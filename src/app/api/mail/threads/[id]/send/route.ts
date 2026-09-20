import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { getGmailClientForAccount, getThread, sendReply } from "@/lib/gmail";
import { recordReplyExample } from "@/lib/learning";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const { id } = await params;
  const { body, aiDraft } = (await req.json()) as { body?: string; aiDraft?: string };
  if (!body || !body.trim()) {
    return NextResponse.json({ error: "empty_body" }, { status: 400 });
  }

  try {
    const gmail = await getGmailClientForAccount(ctx.activeAccount);
    const messages = await getThread(gmail, id, ctx.activeAccount.email);
    const lastIncoming = [...messages].reverse().find((m) => !m.isMe);
    if (!lastIncoming) {
      return NextResponse.json({ error: "no_incoming_message" }, { status: 400 });
    }

    // Reply-To wins over From when the sender designates a different reply address.
    const replyTo = lastIncoming.from;

    await sendReply(gmail, {
      threadId: id,
      to: replyTo,
      subject: lastIncoming.subject,
      body,
      fromEmail: ctx.activeAccount.email,
      inReplyToMessageId: lastIncoming.messageIdHeader,
      references: lastIncoming.referencesHeader,
    });

    await recordReplyExample({
      userId: ctx.user.id,
      accountId: ctx.activeAccount.id,
      threadId: id,
      incomingFrom: lastIncoming.from,
      incomingSubject: lastIncoming.subject,
      incomingBody: lastIncoming.body,
      aiDraft: aiDraft ?? "",
      finalReply: body,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send reply", err);
    return NextResponse.json({ error: "send_error" }, { status: 502 });
  }
}
