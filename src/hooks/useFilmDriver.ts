import { useEffect } from "react";

export function useFilmDriver() {
  useEffect(() => {
    const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const FADE = 0.1;
    const STAGGER = 0.035;

    const chapterEls = Array.from(document.querySelectorAll<HTMLElement>(".chapter"));
    if (!chapterEls.length) return;

    if (REDUCED) {
      chapterEls.forEach((el) => el.classList.add("is-static"));
      return;
    }

    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);

    interface BeatInfo {
      el: HTMLElement;
      from: number;
      to: number;
      motion: string;
      side: number;
      parts: HTMLElement[];
      lines: HTMLElement[];
    }

    interface ChapterState {
      el: HTMLElement;
      stage: HTMLElement;
      video: HTMLVideoElement | null;
      duration: number;
      clock: number;
      isPaused: boolean;
      beats: BeatInfo[];
      scrollCue: HTMLElement | null;
    }

    const chapters: ChapterState[] = chapterEls.map((ch) => {
      const stage = (ch.querySelector(".stage") as HTMLElement) || ch;
      const video = ch.querySelector("video") as HTMLVideoElement | null;
      const duration = parseFloat(ch.dataset.duration || "14") || 14;
      const scrollCue = ch.querySelector(".scroll-cue") as HTMLElement | null;

      const beatEls = Array.from(ch.querySelectorAll<HTMLElement>(".beat"));
      const beats: BeatInfo[] = beatEls.map((b) => {
        const from = parseFloat(b.dataset.from || "0");
        const to = parseFloat(b.dataset.to || "1");
        const motion = b.dataset.motion || "rise";
        const side = parseFloat(b.dataset.side || "1");

        // Direct children except chips
        const parts = Array.from(b.children).filter(
          (c) => !c.classList.contains("chips")
        ) as HTMLElement[];

        const lines = Array.from(b.querySelectorAll<HTMLElement>(".line-in"));

        return { el: b, from, to, motion, side, parts, lines };
      });

      return {
        el: ch,
        stage,
        video,
        duration,
        clock: 0,
        isPaused: false,
        beats,
        scrollCue,
      };
    });

    let lastTime = performance.now();
    let raf = 0;
    let hasScrolled = false;

    const onScroll = () => {
      if (!hasScrolled && window.scrollY > 20) {
        hasScrolled = true;
        document.documentElement.style.setProperty("--cue", "0");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.style.setProperty("--cue", "1");

    // Pause on hover over beat
    chapters.forEach((ch) => {
      ch.beats.forEach((b) => {
        b.el.addEventListener("pointerenter", () => {
          ch.isPaused = true;
        });
        b.el.addEventListener("pointerleave", () => {
          ch.isPaused = false;
        });
      });
    });

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      chapters.forEach((ch) => {
        // Advance clock if not paused
        if (!ch.isPaused) {
          if (ch.video && !ch.video.paused && ch.video.duration > 0) {
            ch.clock = ch.video.currentTime / ch.video.duration;
          } else {
            ch.clock = (ch.clock + dt / ch.duration) % 1;
          }
        }

        const p = ch.clock;

        ch.beats.forEach((b) => {
          const span = b.to - b.from;
          if (span <= 0) return;

          const local = (p - b.from) / span;
          const isOn = local >= 0 && local <= 1;

          if (isOn) {
            b.el.classList.add("is-on");
            b.el.style.setProperty("--local", local.toFixed(3));

            const isLeaving = 1 - local < (FADE + STAGGER * 4);
            b.el.classList.toggle("is-leaving", isLeaving);

            // Exit progress for upward translation
            const exitP = ease(clamp01((local - 0.85) / 0.15));
            b.el.style.setProperty("--exit", exitP.toFixed(3));

            const dir = local < 0.5 ? -1 : 1;
            b.el.style.setProperty("--dir", dir.toString());
            b.el.style.setProperty("--side", b.side.toString());

            // Parts animation (staggered)
            const n = b.parts.length;
            b.parts.forEach((part, i) => {
              const tIn = clamp01((local - i * STAGGER) / FADE);
              const tOut = clamp01((1 - local - (n - 1 - i) * STAGGER) / FADE);
              const o = ease(Math.min(tIn, tOut));
              const oInv = 1 - o;

              part.style.setProperty("--o", o.toFixed(3));
              part.style.setProperty("--o-inv", oInv.toFixed(3));
            });

            // Lines animation (staggered at 0.8)
            b.lines.forEach((line, i) => {
              const tIn = clamp01((local - i * STAGGER * 0.8) / FADE);
              const tOut = clamp01((1 - local - i * STAGGER * 0.8) / FADE);
              const o = ease(Math.min(tIn, tOut));
              const oInv = 1 - o;
              line.style.setProperty("--o-inv", oInv.toFixed(3));
            });
          } else {
            b.el.classList.remove("is-on", "is-leaving");
          }
        });
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}
