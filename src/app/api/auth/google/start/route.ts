import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthUrl, signOAuthState, type OAuthIntent } from "@/lib/google-oauth";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const intentParam = req.nextUrl.searchParams.get("intent");
  const intent: OAuthIntent = intentParam === "add-account" ? "add-account" : "login";

  let userId: string | undefined;
  if (intent === "add-account") {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    userId = session.userId;
  }

  const state = await signOAuthState({ intent, userId, nonce: randomBytes(8).toString("hex") });
  const url = buildAuthUrl(state);
  return NextResponse.redirect(url);
}
