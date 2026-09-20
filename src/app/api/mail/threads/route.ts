import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { getGmailClientForAccount, listThreads } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const query = req.nextUrl.searchParams.get("q") ?? undefined;
  const pageToken = req.nextUrl.searchParams.get("pageToken") ?? undefined;

  try {
    const gmail = await getGmailClientForAccount(ctx.activeAccount);
    const result = await listThreads(gmail, { query, pageToken });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to list threads", err);
    return NextResponse.json({ error: "gmail_error" }, { status: 502 });
  }
}
