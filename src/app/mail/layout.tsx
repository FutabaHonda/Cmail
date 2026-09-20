import { requireAuth } from "@/lib/auth";
import AccountSwitcher from "@/components/AccountSwitcher";
import Link from "next/link";

export default async function MailLayout({ children }: { children: React.ReactNode }) {
  const { user, activeAccount, accounts } = await requireAuth();

  return (
    <div className="flex h-screen flex-col bg-white">
      <header className="flex h-16 items-center gap-4 border-b border-zinc-200 px-4">
        <Link href="/mail" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-lg font-bold text-white">
            C
          </div>
          <span className="text-xl font-medium text-zinc-700">Cmail</span>
        </Link>
        <div className="ml-auto">
          <AccountSwitcher accounts={accounts} activeAccountId={activeAccount.id} userName={user.name} />
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-zinc-200 p-3">
          <Link
            href="/mail"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            受信トレイ
          </Link>
          <Link
            href="/settings"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            設定・学習状況
          </Link>
        </nav>
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
