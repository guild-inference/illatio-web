import '../vendor/scrollcraft/scrollcraft.js';

interface ScrollCraftApi {
  mount(root: Element | Document | string, opts?: Record<string, unknown>): unknown;
  reduce: boolean;
}

declare global {
  interface Window {
    ScrollCraft: ScrollCraftApi;
  }
}

export const engine = window.ScrollCraft;
export const reduceMotion = window.ScrollCraft.reduce;

/** The engine publishes each act's progress (0..1) as --sc-p on the act element. */
export function actProgress(el: HTMLElement): number {
  const v = parseFloat(el.style.getPropertyValue('--sc-p'));
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
}

/** Runs fn on every animation frame while the element is near the viewport. */
export function whileVisible(el: Element, fn: () => void): void {
  let frame = 0;
  const loop = () => {
    fn();
    frame = requestAnimationFrame(loop);
  };
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !frame) frame = requestAnimationFrame(loop);
      else if (!entry.isIntersecting && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        fn();
      }
    },
    { rootMargin: '25% 0px' },
  ).observe(el);
}
