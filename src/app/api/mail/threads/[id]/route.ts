import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { getGmailClientForAccount, getThread } from "@/lib/gmail";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;

  try {
    const gmail = await getGmailClientForAccount(ctx.activeAccount);
    const messages = await getThread(gmail, id, ctx.activeAccount.email);
    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Failed to get thread", err);
    return NextResponse.json({ error: "gmail_error" }, { status: 502 });
  }
}
