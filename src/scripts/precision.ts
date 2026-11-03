// Quantization for the Labs page. Every plate draws through `quantize` at the page's current precision.
// Sample weights are seeded normal draws, not a trained model; the page labels them that way.
export type Precision = '16' | '8' | '4' | '1.58';
export const PRECISIONS: Precision[] = ['16', '8', '4', '1.58'];
export const BITS: Record<Precision, number> = { '16': 16, '8': 8, '4': 4, '1.58': Math.log2(3) };
export const LABEL: Record<Precision, string> = {
  '16': '16-bit',
  '8': '8-bit',
  '4': '4-bit',
  '1.58': 'ternary',
};

export function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Normal draws by Box-Muller from a seeded uniform source. */
export function normals(count: number, seed: number, sigma = 1): Float32Array {
  const rand = seeded(seed);
  const out = new Float32Array(count);
  for (let i = 0; i < count; i += 2) {
    const u = Math.max(rand(), 1e-9);
    const v = rand();
    const r = Math.sqrt(-2 * Math.log(u)) * sigma;
    out[i] = r * Math.cos(2 * Math.PI * v);
    if (i + 1 < count) out[i + 1] = r * Math.sin(2 * Math.PI * v);
  }
  return out;
}

/**
 * A smooth low-rank pattern plus noise, scaled to unit variance, so a plate shows banding as precision
 * drops. Seeded sample data; real weight blocks look closer to the noise term alone.
 */
export function sampleBlock(cols: number, rows: number, seed: number): Float32Array {
  const noise = normals(cols * rows, seed, 0.32);
  const rand = seeded(seed + 1);
  const parts = Array.from({ length: 3 }, () => ({
    fr: 1 + rand() * 3,
    fc: 1 + rand() * 4,
    pr: rand() * Math.PI * 2,
    pc: rand() * Math.PI * 2,
    a: 0.6 + rand() * 0.6,
  }));
  const out = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      let v = noise[r * cols + c];
      for (const k of parts)
        v +=
          k.a *
          Math.sin((r / rows) * Math.PI * k.fr + k.pr) *
          Math.cos((c / cols) * Math.PI * k.fc + k.pc);
      out[r * cols + c] = v;
    }
  let m = 0;
  for (const x of out) m += x * x;
  const sd = Math.sqrt(m / out.length) || 1;
  return out.map((x) => x / sd);
}

/**
 * 16-bit is drawn as given. 8- and 4-bit use symmetric round-to-nearest with one scale per tensor.
 * Ternary uses the absmean scale: values become -1, 0 or +1 times mean |w|.
 */
export function quantize(w: Float32Array, p: Precision): Float32Array {
  if (p === '16') return w;
  const out = new Float32Array(w.length);
  if (p === '1.58') {
    let sum = 0;
    for (const x of w) sum += Math.abs(x);
    const gamma = sum / w.length || 1;
    for (let i = 0; i < w.length; i++)
      out[i] = Math.max(-1, Math.min(1, Math.round(w[i] / gamma))) * gamma;
    return out;
  }
  let max = 0;
  for (const x of w) max = Math.max(max, Math.abs(x));
  const levels = 2 ** (BITS[p] - 1) - 1;
  const scale = max / levels || 1;
  for (let i = 0; i < w.length; i++) out[i] = Math.round(w[i] / scale) * scale;
  return out;
}

export function meanAbsError(a: Float32Array, b: Float32Array): number {
  let e = 0;
  for (let i = 0; i < a.length; i++) e += Math.abs(a[i] - b[i]);
  return e / a.length;
}

/** Ideal storage: parameters x bits / 8 / 2^30. Packing, scales and runtime memory are excluded. */
export function gib(billions: number, p: Precision): number {
  return (billions * 1e9 * BITS[p]) / 8 / 2 ** 30;
}
