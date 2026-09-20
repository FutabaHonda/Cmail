import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createOAuth2Client, verifyOAuthState } from "@/lib/google-oauth";
import { encrypt } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { setSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const stateToken = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
  }
  if (!code || !stateToken) {
    return NextResponse.redirect(new URL("/login?error=missing_code", req.url));
  }

  let state: Awaited<ReturnType<typeof verifyOAuthState>>;
  try {
    state = await verifyOAuthState(stateToken);
  } catch {
    return NextResponse.redirect(new URL("/login?error=invalid_state", req.url));
  }

  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens.access_token || !tokens.refresh_token) {
    // Google omits refresh_token if the user already granted consent previously
    // without `prompt=consent`; our /start route always forces prompt=consent,
    // so this should only happen on unexpected client misconfiguration.
    return NextResponse.redirect(new URL("/login?error=no_refresh_token", req.url));
  }
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data: profile } = await oauth2.userinfo.get();
  if (!profile.email) {
    return NextResponse.redirect(new URL("/login?error=no_email", req.url));
  }

  const expiryDate = new Date(tokens.expiry_date ?? Date.now() + 3600_000);
  const accessTokenEnc = encrypt(tokens.access_token);
  const refreshTokenEnc = encrypt(tokens.refresh_token);
  const scope = tokens.scope ?? "";

  const existingAccount = await prisma.googleAccount.findUnique({ where: { email: profile.email } });

  if (state.intent === "add-account") {
    if (!state.userId) {
      return NextResponse.redirect(new URL("/login?error=missing_user", req.url));
    }
    if (existingAccount && existingAccount.userId !== state.userId) {
      return NextResponse.redirect(
        new URL("/settings?error=account_linked_elsewhere", req.url)
      );
    }

    const account = existingAccount
      ? await prisma.googleAccount.update({
          where: { id: existingAccount.id },
          data: { accessTokenEnc, refreshTokenEnc, expiryDate, scope, name: profile.name, picture: profile.picture },
        })
      : await prisma.googleAccount.create({
          data: {
            userId: state.userId,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            accessTokenEnc,
            refreshTokenEnc,
            expiryDate,
            scope,
          },
        });

    await setSession({ userId: state.userId, activeAccountId: account.id });
    return NextResponse.redirect(new URL("/mail", req.url));
  }

  // intent === "login"
  let userId: string;
  let accountId: string;

  if (existingAccount) {
    userId = existingAccount.userId;
    const account = await prisma.googleAccount.update({
      where: { id: existingAccount.id },
      data: { accessTokenEnc, refreshTokenEnc, expiryDate, scope, name: profile.name, picture: profile.picture },
    });
    accountId = account.id;
    await prisma.user.update({
      where: { id: userId },
      data: { name: profile.name ?? undefined, picture: profile.picture ?? undefined },
    });
  } else {
    const user = await prisma.user.create({
      data: {
        primaryEmail: profile.email,
        name: profile.name,
        picture: profile.picture,
      },
    });
    const account = await prisma.googleAccount.create({
      data: {
        userId: user.id,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        accessTokenEnc,
        refreshTokenEnc,
        expiryDate,
        scope,
        isPrimary: true,
      },
    });
    userId = user.id;
    accountId = account.id;
  }

  await setSession({ userId, activeAccountId: accountId });
  return NextResponse.redirect(new URL("/mail", req.url));
}
