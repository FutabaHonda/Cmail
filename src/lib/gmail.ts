import { gmail_v1, google } from "googleapis";
import { prisma } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/crypto";
import { createOAuth2Client } from "@/lib/google-oauth";
import type { GoogleAccount } from "@/generated/prisma/client";

/** Builds a Gmail API client for a stored account, refreshing + persisting the access token if needed. */
export async function getGmailClientForAccount(account: GoogleAccount): Promise<gmail_v1.Gmail> {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: decrypt(account.accessTokenEnc),
    refresh_token: decrypt(account.refreshTokenEnc),
    expiry_date: account.expiryDate.getTime(),
  });

  oauth2Client.on("tokens", (tokens) => {
    void (async () => {
      const data: { accessTokenEnc?: string; expiryDate?: Date; refreshTokenEnc?: string } = {};
      if (tokens.access_token) data.accessTokenEnc = encrypt(tokens.access_token);
      if (tokens.expiry_date) data.expiryDate = new Date(tokens.expiry_date);
      if (tokens.refresh_token) data.refreshTokenEnc = encrypt(tokens.refresh_token);
      if (Object.keys(data).length > 0) {
        await prisma.googleAccount.update({ where: { id: account.id }, data }).catch(() => {});
      }
    })();
  });

  // Proactively refresh if the token is expired or about to expire.
  if (account.expiryDate.getTime() < Date.now() + 60_000) {
    await oauth2Client.refreshAccessToken();
  }

  return google.gmail({ version: "v1", auth: oauth2Client });
}

export type ThreadSummary = {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  unread: boolean;
};

function decodeBase64Url(data: string): string {
  return Buffer.from(data, "base64url").toString("utf8");
}

function getHeader(message: gmail_v1.Schema$Message | undefined, name: string): string {
  const header = message?.payload?.headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase());
  return header?.value ?? "";
}

/** Extracts the best-effort plain text body from a Gmail message payload. */
function extractBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
  if (!payload) return "";
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }
  if (payload.parts) {
    const plain = payload.parts.find((p) => p.mimeType === "text/plain");
    if (plain?.body?.data) return decodeBase64Url(plain.body.data);
    const html = payload.parts.find((p) => p.mimeType === "text/html");
    if (html?.body?.data) return stripHtml(decodeBase64Url(html.body.data));
    for (const part of payload.parts) {
      const nested = extractBody(part);
      if (nested) return nested;
    }
  }
  if (payload.mimeType === "text/html" && payload.body?.data) {
    return stripHtml(decodeBase64Url(payload.body.data));
  }
  return "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function listThreads(
  gmail: gmail_v1.Gmail,
  opts: { query?: string; pageToken?: string; maxResults?: number } = {}
) {
  const res = await gmail.users.threads.list({
    userId: "me",
    q: opts.query,
    pageToken: opts.pageToken,
    maxResults: opts.maxResults ?? 25,
  });

  const threads = res.data.threads ?? [];
  const summaries: ThreadSummary[] = await Promise.all(
    threads.map(async (t) => {
      const full = await gmail.users.threads.get({
        userId: "me",
        id: t.id!,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"],
      });
      const lastMessage = full.data.messages?.[full.data.messages.length - 1];
      const labelIds = lastMessage?.labelIds ?? [];
      return {
        id: t.id!,
        snippet: t.snippet ?? "",
        subject: getHeader(lastMessage, "Subject") || "(件名なし)",
        from: getHeader(lastMessage, "From"),
        date: getHeader(lastMessage, "Date"),
        unread: labelIds.includes("UNREAD"),
      };
    })
  );

  return { threads: summaries, nextPageToken: res.data.nextPageToken ?? null };
}

export type ThreadMessage = {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  isMe: boolean;
  messageIdHeader: string;
  referencesHeader: string;
};

export async function getThread(gmail: gmail_v1.Gmail, threadId: string, myEmail: string) {
  const res = await gmail.users.threads.get({ userId: "me", id: threadId, format: "full" });
  const messages: ThreadMessage[] = (res.data.messages ?? []).map((m) => {
    const from = getHeader(m, "From");
    return {
      id: m.id!,
      from,
      to: getHeader(m, "To"),
      subject: getHeader(m, "Subject"),
      date: getHeader(m, "Date"),
      body: extractBody(m.payload),
      isMe: from.toLowerCase().includes(myEmail.toLowerCase()),
      messageIdHeader: getHeader(m, "Message-Id") || getHeader(m, "Message-ID"),
      referencesHeader: getHeader(m, "References"),
    };
  });
  return messages;
}

function encodeMessage(raw: string): string {
  return Buffer.from(raw).toString("base64url");
}

/** Sends a reply within an existing thread, preserving RFC 2822 threading headers. */
export async function sendReply(
  gmail: gmail_v1.Gmail,
  opts: {
    threadId: string;
    to: string;
    subject: string;
    body: string;
    fromEmail: string;
    inReplyToMessageId: string; // RFC822 Message-ID header value (with <>)
    references?: string;
  }
) {
  const subject = opts.subject.toLowerCase().startsWith("re:") ? opts.subject : `Re: ${opts.subject}`;
  const headers = [
    `To: ${opts.to}`,
    `From: ${opts.fromEmail}`,
    `Subject: ${subject}`,
    `In-Reply-To: ${opts.inReplyToMessageId}`,
    `References: ${opts.references ? `${opts.references} ` : ""}${opts.inReplyToMessageId}`,
    "Content-Type: text/plain; charset=UTF-8",
    "MIME-Version: 1.0",
  ].join("\r\n");
  const raw = `${headers}\r\n\r\n${opts.body}`;

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodeMessage(raw),
      threadId: opts.threadId,
    },
  });
}
