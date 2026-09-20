import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, setSession } from "@/lib/session";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;

  const account = await prisma.googleAccount.findUnique({ where: { id } });
  if (!account || account.userId !== session.userId) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const remaining = await prisma.googleAccount.count({ where: { userId: session.userId } });
  if (remaining <= 1) {
    return NextResponse.json({ error: "cannot_remove_last_account" }, { status: 400 });
  }

  await prisma.googleAccount.delete({ where: { id } });

  if (session.activeAccountId === id) {
    const next = await prisma.googleAccount.findFirst({ where: { userId: session.userId } });
    if (next) {
      await setSession({ userId: session.userId, activeAccountId: next.id });
    }
  }

  return NextResponse.json({ ok: true });
}
