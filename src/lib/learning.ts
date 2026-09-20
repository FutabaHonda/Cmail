import { prisma } from "@/lib/db";
import { refreshStyleProfile } from "@/lib/ai";
import { computeEditRatio } from "@/lib/textdiff";
import { buildKeywordVector, rankBySimilarity, serializeKeywords } from "@/lib/similarity";

/** Regenerate the style profile every N sent replies, so it keeps improving without an AI call on every single send. */
const REPLIES_PER_STYLE_REFRESH = 5;
const MAX_EXAMPLES_FOR_STYLE_REFRESH = 15;
const MAX_FEW_SHOT_EXAMPLES = 3;

export async function getFewShotExamples(userId: string, incomingSubject: string, incomingBody: string) {
  const examples = await prisma.replyExample.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 200, // cap the candidate pool for the in-memory similarity scan
  });

  const ranked = rankBySimilarity(`${incomingSubject}\n${incomingBody}`, examples, MAX_FEW_SHOT_EXAMPLES);
  return ranked.map((ex) => ({
    incomingSubject: ex.incomingSubject,
    incomingBody: ex.incomingBody,
    finalReply: ex.finalReply,
  }));
}

export async function recordReplyExample(input: {
  userId: string;
  accountId: string;
  threadId: string;
  incomingFrom: string;
  incomingSubject: string;
  incomingBody: string;
  aiDraft: string;
  finalReply: string;
}) {
  const editRatio = computeEditRatio(input.aiDraft, input.finalReply);
  const keywords = serializeKeywords(buildKeywordVector(`${input.incomingSubject}\n${input.incomingBody}`));

  await prisma.replyExample.create({
    data: {
      userId: input.userId,
      accountId: input.accountId,
      threadId: input.threadId,
      incomingFrom: input.incomingFrom,
      incomingSubject: input.incomingSubject,
      incomingBody: input.incomingBody,
      aiDraft: input.aiDraft,
      finalReply: input.finalReply,
      keywords,
      editRatio,
    },
  });

  const user = await prisma.user.update({
    where: { id: input.userId },
    data: { styleProfileCount: { increment: 1 } },
  });

  if (user.styleProfileCount % REPLIES_PER_STYLE_REFRESH === 0) {
    await refreshUserStyleProfile(input.userId);
  }
}

export async function refreshUserStyleProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const recent = await prisma.replyExample.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: MAX_EXAMPLES_FOR_STYLE_REFRESH,
  });
  if (recent.length === 0) return;

  const newProfile = await refreshStyleProfile(
    user.styleProfile,
    recent.map((ex) => ({
      incomingSubject: ex.incomingSubject,
      incomingBody: ex.incomingBody,
      finalReply: ex.finalReply,
      editRatio: ex.editRatio,
    }))
  );

  if (newProfile) {
    await prisma.user.update({ where: { id: userId }, data: { styleProfile: newProfile } });
  }
}
