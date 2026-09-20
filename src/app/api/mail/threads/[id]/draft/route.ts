import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { getGmailClientForAccount, getThread } from "@/lib/gmail";
import { generateReplyDraft } from "@/lib/ai";
import { getFewShotExamples } from "@/lib/learning";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;

  try {
    const gmail = await getGmailClientForAccount(ctx.activeAccount);
    const messages = await getThread(gmail, id, ctx.activeAccount.email);
    const lastIncoming = [...messages].reverse().find((m) => !m.isMe);
    if (!lastIncoming) {
      return NextResponse.json({ error: "no_incoming_message" }, { status: 400 });
    }

    const examples = await getFewShotExamples(ctx.user.id, lastIncoming.subject, lastIncoming.body);

    const draft = await generateReplyDraft({
      incomingFrom: lastIncoming.from,
      incomingSubject: lastIncoming.subject,
      incomingBody: lastIncoming.body,
      myName: ctx.user.name,
      styleProfile: ctx.user.styleProfile,
      examples,
    });

    return NextResponse.json({ draft, usedExampleCount: examples.length });
  } catch (err) {
    console.error("Failed to generate draft", err);
    return NextResponse.json({ error: "ai_error" }, { status: 502 });
  }
}
