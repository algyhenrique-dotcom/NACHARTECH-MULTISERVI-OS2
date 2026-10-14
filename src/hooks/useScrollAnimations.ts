import { useEffect } from "react";

export function useScrollAnimations() {
  useEffect(() => {
    const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Reveal [data-reveal] with IntersectionObserver (fires once)
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    // Set --i index among siblings
    const parentMap = new Map<HTMLElement, number>();
    revealEls.forEach((el) => {
      const parent = el.parentElement || document.body;
      const count = parentMap.get(parent) || 0;
      el.style.setProperty("--i", count.toString());
      parentMap.set(parent, count + 1);
    });

    if (REDUCED) {
      revealEls.forEach((el) => el.classList.add("is-in"));
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px" }
      );

      revealEls.forEach((el) => observer.observe(el));
    }

    // 2. Scroll Parallax & Manifesto words on requestAnimationFrame
    if (REDUCED) return;

    let ticking = false;
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const wordContainers = Array.from(document.querySelectorAll<HTMLElement>("[data-words]"));

    const updateScrollEffects = () => {
      const innerH = window.innerHeight;

      // Parallax de painéis
      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax || "0.32");
        const centre = (rect.top + rect.height / 2 - innerH / 2) / innerH;
        const py = centre * -speed * innerH;
        el.style.setProperty("--py", `${py.toFixed(1)}px`);
      });

      // Manifesto palavra a palavra
      wordContainers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(0, (innerH * 0.8 - rect.top) / (rect.height + innerH * 0.45))
        );
        const words = Array.from(container.querySelectorAll<HTMLElement>(".w"));
        const n = words.length;

        words.forEach((w, i) => {
          const isLit = p * (n + 1) > i + 1;
          w.style.setProperty("--lit", isLit ? "1" : "0");
          if (isLit) {
            w.classList.add("is-lit");
          } else {
            w.classList.remove("is-lit");
          }
        });
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollEffects();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}
