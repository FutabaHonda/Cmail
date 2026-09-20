import { google } from "googleapis";
import { SignJWT, jwtVerify } from "jose";

export const GMAIL_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
];

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export type OAuthIntent = "login" | "add-account";

type StatePayload = {
  intent: OAuthIntent;
  // Present when adding an account to an already-logged-in user.
  userId?: string;
  nonce: string;
};

function getStateSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signOAuthState(payload: StatePayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getStateSecret());
}

export async function verifyOAuthState(token: string): Promise<StatePayload> {
  const { payload } = await jwtVerify(token, getStateSecret());
  return payload as unknown as StatePayload;
}

export function buildAuthUrl(state: string) {
  const client = createOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // ensures a refresh_token is returned every time
    scope: GMAIL_SCOPES,
    state,
  });
}
