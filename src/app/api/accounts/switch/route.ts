import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { accountId } = (await req.json()) as { accountId?: string };
  if (!accountId) {
    return NextResponse.json({ error: "accountId is required" }, { status: 400 });
  }

  const account = await prisma.googleAccount.findUnique({ where: { id: accountId } });
  if (!account || account.userId !== session.userId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await setSession({ userId: session.userId, activeAccountId: account.id });
  return NextResponse.json({ ok: true });
}
