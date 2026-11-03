// Illustrative top-k routing for the home page. A word is hashed to a seed and the seed picks ten distinct
// experts out of 512, the ratio Qwen3.8 uses. It shows how few experts one token touches; it is not a
// trained router and the page says so.
export const EXPERTS = 512;
export const TOP_K = 10;

function fnv1a(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalize(word: string): string {
  return word.toLowerCase().replace(/[^\p{L}\p{N}'-]+/gu, '');
}

export function route(word: string): number[] {
  const rand = mulberry32(fnv1a(normalize(word)));
  const picked = new Set<number>();
  while (picked.size < TOP_K) picked.add(Math.floor(rand() * EXPERTS));
  return [...picked].sort((a, b) => a - b);
}

/** Paints a field of 512 cells: `on` lights the current word, `heat` keeps a trace of earlier words. */
export function paint(cells: HTMLElement[], on: number[], heat?: Map<number, number>): void {
  const lit = new Set(on);
  cells.forEach((cell, i) => {
    const h = heat?.get(i) ?? 0;
    cell.className = lit.has(i) ? 'is-on' : h ? `is-heat h${Math.min(h, 3)}` : '';
  });
}
