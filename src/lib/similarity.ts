/**
 * Lightweight, dependency-free text similarity used to retrieve past reply
 * examples that resemble a new incoming email. No embedding API call is
 * needed for this — a bag-of-tokens cosine similarity is enough to find
 * "this is basically the same kind of email as before" for few-shot
 * retrieval, and it works offline/instantly.
 *
 * Tokenization handles both Latin text (word split) and CJK text (character
 * bigrams, since Japanese/Chinese have no whitespace word boundaries).
 */

const CJK_RANGE =
  "\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff\\uff66-\\uff9f";

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "to", "of", "in",
  "on", "for", "and", "or", "with", "this", "that", "it", "you", "your", "we",
  "please", "thanks", "thank", "regards", "hi", "hello", "dear",
  "です", "ます", "こと", "して", "した", "する", "から", "ので", "よう",
  "これ", "それ", "あの", "この", "ため", "また", "しか", "など", "さん",
]);

export function tokenize(text: string): string[] {
  const tokens: string[] = [];

  const latin = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  for (const w of latin) {
    if (w.length >= 2 && !STOPWORDS.has(w)) tokens.push(w);
  }

  const cjkRegex = new RegExp(`[${CJK_RANGE}]+`, "g");
  const cjkRuns = text.match(cjkRegex) ?? [];
  for (const run of cjkRuns) {
    if (run.length === 1) {
      tokens.push(run);
      continue;
    }
    for (let i = 0; i < run.length - 1; i++) {
      const bigram = run.slice(i, i + 2);
      if (!STOPWORDS.has(bigram)) tokens.push(bigram);
    }
  }

  return tokens;
}

export type KeywordVector = Record<string, number>;

export function buildKeywordVector(text: string): KeywordVector {
  const vector: KeywordVector = {};
  for (const token of tokenize(text)) {
    vector[token] = (vector[token] ?? 0) + 1;
  }
  return vector;
}

export function serializeKeywords(vector: KeywordVector): string {
  return JSON.stringify(vector);
}

export function deserializeKeywords(raw: string): KeywordVector {
  try {
    return JSON.parse(raw) as KeywordVector;
  } catch {
    return {};
  }
}

export function cosineSimilarity(a: KeywordVector, b: KeywordVector): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const key in a) {
    normA += a[key] * a[key];
    if (key in b) dot += a[key] * b[key];
  }
  for (const key in b) {
    normB += b[key] * b[key];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function rankBySimilarity<T extends { keywords: string }>(
  queryText: string,
  candidates: T[],
  topK: number
): Array<T & { score: number }> {
  const queryVector = buildKeywordVector(queryText);
  return candidates
    .map((c) => ({ ...c, score: cosineSimilarity(queryVector, deserializeKeywords(c.keywords)) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
