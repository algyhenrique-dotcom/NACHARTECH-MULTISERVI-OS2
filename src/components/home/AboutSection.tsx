import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accent } from '../common/RichText';

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="sobre" className="w-full py-8 md:py-12 bg-[#0f1115] text-[#f4f1ec] border-b border-white/[0.08]">
      <div className="w-full px-[clamp(14px,2vw,28px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Workshop photography */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#12141a] border border-white/10 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                alt="Bancada de reparação técnica NacharTech"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Narrative content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Stamp in teal cyan */}
            <span className="font-mono text-[10px] md:text-[11px] font-medium tracking-[0.16em] uppercase text-[#5fc9bd] mb-2.5">
              04 — SOBRE NÓS
            </span>

            {/* Headline */}
            <h2 className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em] leading-tight text-white mb-3.5">
              <Accent text="Uma empresa que | resolve do início | ao *fim*." />
            </h2>

            {/* Paragraph */}
            <p className="text-[13px] md:text-[14px] leading-relaxed text-[#9a978f] mb-4 max-w-[50ch]">
              A NacharTech Multisserviços reúne tecnologia, reparação, instalações técnicas e serviços de escritório. Da manutenção de um computador à instalação completa de CCTV, redes e ar-condicionado.
            </p>

            {/* Tags Strip with subtle dots */}
            <div className="text-[10px] md:text-[11px] font-mono tracking-[0.12em] uppercase text-[#64748b] flex flex-wrap items-center gap-x-2 gap-y-1 mb-5 font-medium">
              <span>TECNOLOGIA</span>
              <span className="text-[#ff7a1a]">•</span>
              <span>INFORMÁTICA</span>
              <span className="text-[#ff7a1a]">•</span>
              <span>CCTV</span>
              <span className="text-[#ff7a1a]">•</span>
              <span>REDES</span>
              <span className="text-[#ff7a1a]">•</span>
              <span>ELETRICIDADE</span>
              <span className="text-[#ff7a1a]">•</span>
              <span>AR-CONDICIONADO</span>
              <span className="text-[#ff7a1a]">•</span>
              <span>PAPELARIA</span>
              <span className="text-[#ff7a1a]">•</span>
              <span>ASSISTÊNCIA TÉCNICA</span>
            </div>

            {/* Orange CTA Button */}
            <a
              href="#servicos"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#ff7a1a] text-[#14100b] text-[12px] sm:text-[13px] font-semibold hover:bg-[#ff8a29] transition-colors shadow-sm no-underline"
            >
              <span>Ver os serviços</span>
              <i className="ri-arrow-right-line text-[14px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
