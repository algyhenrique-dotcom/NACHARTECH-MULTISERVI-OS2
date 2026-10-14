import React from 'react';
import { HeroCanvas } from './HeroCanvas';

/**
 * Clean Animated Hero Stage
 * Per user request:
 * - All text/writings removed ("limpa todo hero removendo todas as escritas")
 * - Pitch-black background removed, blending cleanly with the page theme ("retirando o fundo preto do hero apenas")
 * - Compact height so featured products appear right underneath with clean divider
 */
export const Chapter: React.FC = () => {
  return (
    <section
      className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] overflow-hidden border-b border-white/[0.08]"
      style={{
        background: 'transparent',
      }}
      id="top"
      aria-label="Apresentação Visual NacharTech"
    >
      {/* 1. Animated Canvas with Motherboard, Circuit Traces, CCTV, Laptops, AC Particles & Sparks */}
      <HeroCanvas activeBeat={0} />

      {/* 2. Soft Ambient Lighting Blending with Header */}
      <div
        className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 17, 21, 0.7), transparent)',
        }}
      />

      {/* 3. Subtle Bottom Transition into Featured Products */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(to top, rgba(15, 17, 21, 0.9), transparent)',
        }}
      />
    </section>
  );
};
