import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
  const { user, accounts, activeAccount } = await requireAuth();
  const exampleCount = await prisma.replyExample.count({ where: { userId: user.id } });

  return (
    <SettingsClient
      accounts={accounts.map((a) => ({
        id: a.id,
        email: a.email,
        name: a.name,
        picture: a.picture,
        isPrimary: a.isPrimary,
      }))}
      activeAccountId={activeAccount.id}
      styleProfile={user.styleProfile}
      styleProfileCount={user.styleProfileCount}
      exampleCount={exampleCount}
    />
  );
}
