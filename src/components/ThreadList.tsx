"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ThreadSummary = {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  unread: boolean;
};

function parseFromName(from: string): string {
  const match = from.match(/^"?([^"<]*)"?\s*<.*>$/);
  const name = match ? match[1].trim() : from;
  return name || from;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

export default function ThreadList({ activeThreadId }: { activeThreadId?: string }) {
  const [threads, setThreads] = useState<ThreadSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/mail/threads")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setThreads(data.threads);
      })
      .catch(() => {
        if (!cancelled) setError("メールの取得に失敗しました。Gmail連携の設定を確認してください。");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="p-4 text-sm text-red-600">{error}</p>;
  }

  if (!threads) {
    return <p className="p-4 text-sm text-zinc-400">読み込み中…</p>;
  }

  if (threads.length === 0) {
    return <p className="p-4 text-sm text-zinc-400">メールはありません。</p>;
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {threads.map((t) => (
        <li key={t.id}>
          <Link
            href={`/mail/${t.id}`}
            className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-zinc-50 hover:shadow-sm ${
              t.id === activeThreadId ? "bg-red-50" : ""
            } ${t.unread ? "font-semibold text-zinc-900" : "text-zinc-600"}`}
          >
            <span className="w-40 shrink-0 truncate">{parseFromName(t.from)}</span>
            <span className="min-w-0 flex-1 truncate">
              <span className={t.unread ? "text-zinc-900" : "text-zinc-700"}>{t.subject}</span>
              <span className="text-zinc-400"> - {t.snippet}</span>
            </span>
            <span className="w-14 shrink-0 text-right text-xs text-zinc-400">{formatDate(t.date)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
