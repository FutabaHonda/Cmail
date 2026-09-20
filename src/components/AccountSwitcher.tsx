"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Account = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  isPrimary: boolean;
};

export default function AccountSwitcher({
  accounts,
  activeAccountId,
  userName,
}: {
  accounts: Account[];
  activeAccountId: string;
  userName: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const active = accounts.find((a) => a.id === activeAccountId) ?? accounts[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function switchAccount(accountId: string) {
    if (accountId === activeAccountId) {
      setOpen(false);
      return;
    }
    setSwitching(accountId);
    const res = await fetch("/api/accounts/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId }),
    });
    setSwitching(null);
    setOpen(false);
    if (res.ok) {
      router.push("/mail");
      router.refresh();
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-50"
      >
        <Avatar picture={active?.picture} label={active?.name ?? active?.email ?? "?"} />
        <span className="max-w-[160px] truncate text-zinc-700">{active?.email}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg">
          <div className="px-4 py-2 text-xs font-medium text-zinc-400">{userName ?? "アカウント"}</div>
          <ul className="max-h-64 overflow-y-auto">
            {accounts.map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => switchAccount(a.id)}
                  disabled={switching !== null}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-zinc-50 ${
                    a.id === activeAccountId ? "bg-zinc-50" : ""
                  }`}
                >
                  <Avatar picture={a.picture} label={a.name ?? a.email} />
                  <span className="flex-1 truncate">
                    <span className="block truncate font-medium text-zinc-800">{a.name ?? a.email}</span>
                    <span className="block truncate text-xs text-zinc-500">{a.email}</span>
                  </span>
                  {a.id === activeAccountId && <span className="text-red-500">✓</span>}
                  {switching === a.id && <span className="text-xs text-zinc-400">切替中…</span>}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-zinc-100 pt-1">
            <a
              href="/api/auth/google/start?intent=add-account"
              className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              + 別のGoogleアカウントを追加
            </a>
            <button
              onClick={logout}
              className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({ picture, label }: { picture: string | null; label: string }) {
  if (picture) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={picture} alt={label} className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />;
  }
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-300 text-xs font-medium text-white">
      {label.slice(0, 1).toUpperCase()}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
