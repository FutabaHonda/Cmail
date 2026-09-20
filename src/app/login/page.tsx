import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Googleからの応答が不正でした。もう一度お試しください。",
  invalid_state: "セッションの有効期限が切れました。もう一度お試しください。",
  no_refresh_token: "Googleアカウントへのアクセス許可の取得に失敗しました。もう一度お試しください。",
  no_email: "メールアドレスを取得できませんでした。",
  access_denied: "Googleアカウントへのアクセスが許可されませんでした。",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/mail");

  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-xl font-bold text-white">
          C
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Cmail にログイン</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Claude AIがあなたの文体を学習し、返信下書きを自動作成します。
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {ERROR_MESSAGES[error] ?? "エラーが発生しました。もう一度お試しください。"}
          </p>
        )}

        <a
          href="/api/auth/google/start?intent=login"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
        >
          <GoogleIcon />
          Googleでログイン
        </a>

        <p className="mt-6 text-xs text-zinc-400">
          ログイン後、設定画面から複数のGoogleアカウントを追加して切り替えられます。
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.94v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.94A9 9 0 0 0 0 9c0 1.45.35 2.83.94 4.03l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .94 4.97l3.01 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}
