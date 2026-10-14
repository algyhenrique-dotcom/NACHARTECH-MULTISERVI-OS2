import { useEffect } from "react";

export function usePointerParallax() {
  useEffect(() => {
    const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const FINE = matchMedia("(pointer: fine)").matches;
    if (REDUCED || !FINE) return;
    const root = document.documentElement;
    const LERP = 0.08;
    let tx = 0, ty = 0, mx = 0, my = 0, raf = 0;
    const settle = () => {
      mx += (tx - mx) * LERP;
      my += (ty - my) * LERP;
      root.style.setProperty("--mx", mx.toFixed(3));
      root.style.setProperty("--my", my.toFixed(3));
      raf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.002 ? requestAnimationFrame(settle) : 0;
    };
    const aim = (x: number, y: number) => {
      tx = x; ty = y;
      if (!raf) raf = requestAnimationFrame(settle);
    };
    const onMove = (e: PointerEvent) =>
      aim((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    const onLeave = () => aim(0, 0);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);
}
