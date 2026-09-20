import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { GoogleAccount, User } from "@/generated/prisma/client";

export type AuthContext = {
  user: User;
  activeAccount: GoogleAccount;
  accounts: GoogleAccount[];
};

/** For server components/pages: resolves the session or redirects to /login. */
export async function requireAuth(): Promise<AuthContext> {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  const accounts = await prisma.googleAccount.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
  });
  if (accounts.length === 0) redirect("/login");

  const activeAccount = accounts.find((a) => a.id === session.activeAccountId) ?? accounts[0];

  return { user, activeAccount, accounts };
}

/** For API routes: resolves the session or returns null (caller responds 401). */
export async function getAuthContext(): Promise<AuthContext | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return null;

  const accounts = await prisma.googleAccount.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
  });
  if (accounts.length === 0) return null;

  const activeAccount = accounts.find((a) => a.id === session.activeAccountId) ?? accounts[0];

  return { user, activeAccount, accounts };
}
