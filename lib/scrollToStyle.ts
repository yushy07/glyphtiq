const MAX_SCROLL_WAIT_MS = 8000;
const STABLE_FRAMES = 3;
const STABLE_EPSILON = 0.5;

/**
 * Smooth-scrolls a style card into the vertical center of the viewport once
 * its layout has settled. The card can mount a moment after a state change
 * (pagination swaps pages, entrance animations run), so scrolling on a fixed
 * timer measures a moving target and overshoots — e.g. landing at the bottom
 * of the page instead of the card. Instead, poll on requestAnimationFrame
 * until the element exists and its viewport-relative position stops changing,
 * then scroll. Returns a cancel function for use as an effect cleanup.
 */
export function scrollToStyleById(styleId: string): () => void {
  let cancelled = false;
  let raf = 0;
  const startedAt = performance.now();
  let lastTop: number | null = null;
  let stableFrames = 0;

  const tick = () => {
    if (cancelled) return;
    if (performance.now() - startedAt > MAX_SCROLL_WAIT_MS) {
      return;
    }
    const el = document.getElementById(`style-${styleId}`);
    if (!el) {
      raf = requestAnimationFrame(tick);
      return;
    }
    // Read layout position in a fresh animation frame
    const rect = el.getBoundingClientRect();
    const top = rect.top;
    if (lastTop !== null && Math.abs(top - lastTop) <= STABLE_EPSILON) {
      stableFrames += 1;
    } else {
      stableFrames = 0;
    }
    lastTop = top;
    if (stableFrames >= STABLE_FRAMES) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}
