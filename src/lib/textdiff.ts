/** Normalized Levenshtein distance in [0, 1]: 0 = identical, 1 = completely different. */
export function computeEditRatio(a: string, b: string): number {
  const s1 = a.trim();
  const s2 = b.trim();
  if (s1 === s2) return 0;
  if (s1.length === 0 || s2.length === 0) return 1;

  // Cap comparison length to keep this O(n*m) computation bounded for very long emails.
  const MAX_LEN = 2000;
  const x = s1.slice(0, MAX_LEN);
  const y = s2.slice(0, MAX_LEN);

  const prev = new Array(y.length + 1);
  const curr = new Array(y.length + 1);
  for (let j = 0; j <= y.length; j++) prev[j] = j;

  for (let i = 1; i <= x.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= y.length; j++) {
      const cost = x[i - 1] === y[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= y.length; j++) prev[j] = curr[j];
  }

  const distance = prev[y.length];
  return Math.min(1, distance / Math.max(x.length, y.length));
}
