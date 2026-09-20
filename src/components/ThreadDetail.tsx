"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ThreadMessage = {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  isMe: boolean;
};

export default function ThreadDetail({ threadId }: { threadId: string }) {
  const [messages, setMessages] = useState<ThreadMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftMeta, setDraftMeta] = useState<{ usedExampleCount: number } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/mail/threads/${threadId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setMessages(data.messages);
      })
      .catch(() => {
        if (!cancelled) setError("メールの取得に失敗しました。");
      });
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  async function generateDraft() {
    setDrafting(true);
    setActionError(null);
    setReplyOpen(true);
    try {
      const res = await fetch(`/api/mail/threads/${threadId}/draft`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      setDraft(data.draft);
      setAiDraft(data.draft);
      setDraftMeta({ usedExampleCount: data.usedExampleCount ?? 0 });
    } catch {
      setActionError("AI下書きの作成に失敗しました。ANTHROPIC_API_KEYの設定を確認してください。");
    } finally {
      setDrafting(false);
    }
  }

  async function send() {
    setSending(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/mail/threads/${threadId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft, aiDraft }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "failed");
      setSent(true);
      setReplyOpen(false);
      router.refresh();
    } catch {
      setActionError("送信に失敗しました。");
    } finally {
      setSending(false);
    }
  }

  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;
  if (!messages) return <p className="p-6 text-sm text-zinc-400">読み込み中…</p>;

  const subject = messages[messages.length - 1]?.subject || "(件名なし)";

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-zinc-100 px-6 py-4">
        <h1 className="text-xl font-normal text-zinc-800">{subject}</h1>
      </div>

      <div className="flex-1 space-y-3 px-6 py-4">
        {messages.map((m) => (
          <div key={m.id} className="rounded-lg border border-zinc-100 p-4 shadow-sm">
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="font-medium text-zinc-800">{m.from}</span>
              <span className="text-xs text-zinc-400">{m.date}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{m.body}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-100 px-6 py-4">
        {sent && !replyOpen && (
          <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            返信を送信しました。この返信はAIの学習データとして保存されました。
          </p>
        )}

        {!replyOpen ? (
          <div className="flex gap-2">
            <button
              onClick={generateDraft}
              disabled={drafting}
              className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
            >
              {drafting ? "AIが下書きを作成中…" : "✨ AIで返信を下書き"}
            </button>
            <button
              onClick={() => setReplyOpen(true)}
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              自分で返信を書く
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2 text-xs text-zinc-500">
              <span>返信を編集して送信できます。編集内容はAIの学習に使われ、次回以降の下書きの精度が上がります。</span>
              {draftMeta && <span className="shrink-0 text-zinc-400">参考にした過去の返信: {draftMeta.usedExampleCount}件</span>}
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={10}
              placeholder="返信本文を入力してください"
              className="w-full resize-y p-4 text-sm text-zinc-800 focus:outline-none"
            />
            <div className="flex items-center justify-between gap-2 border-t border-zinc-100 px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={send}
                  disabled={sending || !draft.trim()}
                  className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {sending ? "送信中…" : "送信"}
                </button>
                <button
                  onClick={generateDraft}
                  disabled={drafting}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                >
                  {drafting ? "再作成中…" : "AI下書きを再生成"}
                </button>
              </div>
              <button
                onClick={() => setReplyOpen(false)}
                className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-700"
              >
                破棄
              </button>
            </div>
          </div>
        )}

        {actionError && <p className="mt-3 text-sm text-red-600">{actionError}</p>}
      </div>
    </div>
  );
}
