import Anthropic from "@anthropic-ai/sdk";

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

function getModel(): string {
  return process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
}

export type FewShotExample = {
  incomingSubject: string;
  incomingBody: string;
  finalReply: string;
};

export type GenerateReplyInput = {
  incomingFrom: string;
  incomingSubject: string;
  incomingBody: string;
  myName?: string | null;
  styleProfile: string | null;
  examples: FewShotExample[];
};

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}\n…(省略)` : text;
}

function buildSystemPrompt(styleProfile: string | null, myName?: string | null): string {
  const lines = [
    "あなたはユーザーの代わりにメールの返信下書きを作成するアシスタントです。",
    "受信したメールの内容を理解し、ユーザーが実際に送るのに近い、自然な返信文を作成してください。",
    "出力は返信メール本文のみとし、件名や説明、Markdownの装飾は含めないでください。",
    myName ? `差出人の名前は「${myName}」です。署名が必要な場合はこの名前を使ってください。` : "",
    styleProfile
      ? `これまでの送信履歴から学習したユーザーの文体・傾向は以下の通りです。できる限りこれに沿った文体で書いてください:\n${styleProfile}`
      : "まだユーザーの文体データが十分にないため、丁寧でビジネスライクな標準的な日本語（相手が英語の場合は英語）で返信を作成してください。",
  ].filter(Boolean);
  return lines.join("\n\n");
}

function buildUserPrompt(input: GenerateReplyInput): string {
  const parts: string[] = [];

  if (input.examples.length > 0) {
    parts.push("### 過去にユーザーが実際に送った返信の例（文体の参考にしてください）");
    input.examples.forEach((ex, i) => {
      parts.push(
        [
          `--- 参考例 ${i + 1} ---`,
          `受信メール件名: ${ex.incomingSubject}`,
          `受信メール本文:\n${truncate(ex.incomingBody, 800)}`,
          `ユーザーが実際に送った返信:\n${truncate(ex.finalReply, 800)}`,
        ].join("\n")
      );
    });
    parts.push("");
  }

  parts.push("### 今回返信が必要な受信メール");
  parts.push(`差出人: ${input.incomingFrom}`);
  parts.push(`件名: ${input.incomingSubject}`);
  parts.push(`本文:\n${truncate(input.incomingBody, 4000)}`);
  parts.push("");
  parts.push("上記メールへの返信本文の下書きを作成してください。");

  return parts.join("\n");
}

export async function generateReplyDraft(input: GenerateReplyInput): Promise<string> {
  const client = getClient();
  const message = await client.messages.create({
    model: getModel(),
    max_tokens: 1024,
    system: buildSystemPrompt(input.styleProfile, input.myName),
    messages: [{ role: "user", content: buildUserPrompt(input) }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
}

export type StyleExample = {
  incomingSubject: string;
  incomingBody: string;
  finalReply: string;
  editRatio: number;
};

/**
 * Re-derives the user's writing-style summary from their most recent sent
 * replies. Called periodically (see REPLIES_PER_STYLE_REFRESH in
 * src/lib/learning.ts) so that reply drafts keep converging on how the user
 * actually writes, rather than relying on a single static prompt.
 */
export async function refreshStyleProfile(
  previousProfile: string | null,
  recentExamples: StyleExample[]
): Promise<string> {
  const client = getClient();

  const examplesText = recentExamples
    .map(
      (ex, i) =>
        `--- 例 ${i + 1} (AI下書きからの編集率: ${(ex.editRatio * 100).toFixed(0)}%) ---\n受信件名: ${ex.incomingSubject}\n受信本文:\n${truncate(ex.incomingBody, 600)}\n実際に送信された返信:\n${truncate(ex.finalReply, 600)}`
    )
    .join("\n\n");

  const system = [
    "あなたはユーザーのメール返信スタイルを分析するアシスタントです。",
    "与えられた「実際に送信された返信」のサンプルから、今後の返信下書き作成に使う簡潔なスタイルガイドを日本語で作成してください。",
    "含めるべき観点: 文体（である調/ですます調など）、丁寧さのレベル、よく使う挨拶・書き出し、よく使う結びの言葉や署名の形式、返信の長さの傾向、絵文字や記号の使用有無、その他特徴的な言い回し。",
    "出力は箇条書き5〜10項目程度の簡潔なガイドのみとし、前置きや説明文は含めないでください。",
  ].join("\n");

  const userContent = [
    previousProfile ? `### これまでのスタイルガイド\n${previousProfile}` : "",
    `### 直近の送信サンプル\n${examplesText}`,
    "上記を踏まえて、更新後のスタイルガイドを作成してください。",
  ]
    .filter(Boolean)
    .join("\n\n");

  const message = await client.messages.create({
    model: getModel(),
    max_tokens: 512,
    system,
    messages: [{ role: "user", content: userContent }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text.trim() : previousProfile ?? "";
}
