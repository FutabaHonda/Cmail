"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Account = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  isPrimary: boolean;
};

const REPLIES_PER_STYLE_REFRESH = 5;

export default function SettingsClient({
  accounts,
  activeAccountId,
  styleProfile,
  styleProfileCount,
  exampleCount,
}: {
  accounts: Account[];
  activeAccountId: string;
  styleProfile: string | null;
  styleProfileCount: number;
  exampleCount: number;
}) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repliesUntilNextRefresh = REPLIES_PER_STYLE_REFRESH - (styleProfileCount % REPLIES_PER_STYLE_REFRESH);

  async function removeAccount(id: string) {
    if (accounts.length <= 1) return;
    if (!confirm("このアカウントの連携を解除しますか？")) return;
    setRemoving(id);
    setError(null);
    const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    setRemoving(null);
    if (res.ok) {
      router.refresh();
    } else {
      setError("アカウントの削除に失敗しました。");
    }
  }

  async function resetLearning() {
    if (!confirm("学習データ（過去の返信例と文体プロファイル）をすべて削除します。よろしいですか？")) return;
    setResetting(true);
    setError(null);
    const res = await fetch("/api/settings/style-profile", { method: "DELETE" });
    setResetting(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("リセットに失敗しました。");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900">設定</h1>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">連携アカウント</h2>
        <ul className="mt-3 divide-y divide-zinc-100 rounded-xl border border-zinc-200">
          {accounts.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-4 py-3">
              {a.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.picture} alt={a.email} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-300 text-sm font-medium text-white">
                  {(a.name ?? a.email).slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-800">{a.name ?? a.email}</p>
                <p className="truncate text-xs text-zinc-500">{a.email}</p>
              </div>
              {a.id === activeAccountId && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">使用中</span>
              )}
              <button
                onClick={() => removeAccount(a.id)}
                disabled={accounts.length <= 1 || removing === a.id}
                className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
              >
                {removing === a.id ? "削除中…" : "解除"}
              </button>
            </li>
          ))}
        </ul>
        <a
          href="/api/auth/google/start?intent=add-account"
          className="mt-3 inline-block rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          + 別のGoogleアカウントを追加
        </a>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">AI返信の学習状況</h2>
        <div className="mt-3 rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-700">
            学習に使われた送信済み返信: <span className="font-semibold">{exampleCount}件</span>
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            返信を{Math.max(repliesUntilNextRefresh, 0)}件送信すると、次の文体プロファイルの更新が行われます（{REPLIES_PER_STYLE_REFRESH}件ごとに自動更新）。
          </p>

          {styleProfile ? (
            <div className="mt-4">
              <p className="mb-1 text-xs font-medium text-zinc-500">現在学習されている文体プロファイル</p>
              <pre className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">{styleProfile}</pre>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-400">
              まだ文体プロファイルは作成されていません。返信を{REPLIES_PER_STYLE_REFRESH}件送信すると自動的に作成されます。
            </p>
          )}

          <button
            onClick={resetLearning}
            disabled={resetting || exampleCount === 0}
            className="mt-4 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
          >
            {resetting ? "リセット中…" : "学習データをリセット"}
          </button>
        </div>
      </section>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
