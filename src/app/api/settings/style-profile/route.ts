import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE() {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  await prisma.replyExample.deleteMany({ where: { userId: ctx.user.id } });
  await prisma.user.update({
    where: { id: ctx.user.id },
    data: { styleProfile: null, styleProfileCount: 0 },
  });

  return NextResponse.json({ ok: true });
}
