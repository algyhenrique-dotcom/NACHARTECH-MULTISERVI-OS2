import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accent } from '../common/RichText';
import { INITIAL_SERVICES } from '../../data/initialData';
import { useShop } from '../../context/ShopContext';
import { ServiceItem } from '../../types';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useShop();
  const [activeServiceId, setActiveServiceId] = useState<string>(INITIAL_SERVICES[0].id);

  const activeService =
    INITIAL_SERVICES.find((s) => s.id === activeServiceId) || INITIAL_SERVICES[0];

  const handleOrderService = (service: ServiceItem) => {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const selectEl = document.getElementById('service-select') as HTMLSelectElement | null;
      if (selectEl) {
        selectEl.value = service.id;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  return (
    <section id="servicos" className="w-full py-8 md:py-12 bg-[#0f1115] text-[#f4f1ec] border-b border-white/[0.08]">
      <div className="w-full px-[clamp(14px,2vw,28px)]">
        {/* Header: Title on left, Subtitle on right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 md:mb-8">
          <div className="max-w-xl">
            <h2 className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em] leading-tight text-white">
              <Accent text="Tudo o que fazemos, | organizado por *área*." />
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-[12px] md:text-[13px] leading-relaxed text-[#9a978f]">
              Sete categorias de serviços técnicos e de escritório. Toque em cada área para ver tudo o que inclui.
            </p>
          </div>
        </div>

        {/* 2-Column Split: 7 Services (Left) + Active Service Showcase (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: 7 Services list */}
          <div className="lg:col-span-5 flex flex-col border-t border-white/10">
            {INITIAL_SERVICES.slice(0, 7).map((svc) => {
              const isActive = svc.id === activeServiceId;

              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setActiveServiceId(svc.id)}
                  className={`w-full text-left py-2.5 px-3 flex items-center justify-between border-b transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1b1713] border-[#ff7a1a]/40 text-white rounded-md shadow-sm'
                      : 'border-white/[0.08] text-[#9a978f] hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Number Stamp in teal cyan */}
                    <span className="font-mono text-[11px] text-[#5fc9bd] font-medium tracking-wider w-4">
                      {svc.number}
                    </span>

                    {/* Icon Circle */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-[#ff7a1a] text-[#14100b]'
                          : 'bg-[#1b1e25] text-[#ff7a1a] border border-white/5'
                      }`}
                    >
                      <i className={`${svc.icon} text-[14px]`} />
                    </div>

                    {/* Service Name */}
                    <span
                      className={`text-[13px] ${
                        isActive ? 'font-semibold text-white' : 'font-medium'
                      }`}
                    >
                      {lang === 'en' ? svc.titleEn : svc.title}
                    </span>
                  </div>

                  {/* Right Arrow (visible on active) */}
                  {isActive ? (
                    <i className="ri-arrow-right-s-line text-[16px] text-[#ff7a1a]" />
                  ) : (
                    <span className="w-4" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Service Details Panel */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Service Image */}
            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#12141a] border border-white/10">
              <img
                src={activeService.image}
                alt={activeService.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-[17px] sm:text-[19px] font-semibold tracking-[-0.01em] text-white mb-2">
                {lang === 'en' ? activeService.titleEn : activeService.title}
              </h3>
              <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#9a978f] max-w-2xl">
                {lang === 'en' ? activeService.descriptionEn : activeService.description}
              </p>
            </div>

            {/* 6 Bullet Points in 3 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2.5 pt-1">
              {(lang === 'en' ? activeService.itemsEn : activeService.items).map(
                (item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[12px] leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a1a] shrink-0 mt-1" />
                    <span className="text-[#f4f1ec]">{item}</span>
                  </div>
                )
              )}
            </div>

            {/* Primary Orange Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleOrderService(activeService)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#ff7a1a] text-[#14100b] text-[12px] sm:text-[13px] font-semibold hover:bg-[#ff8a29] transition-colors shadow-sm cursor-pointer border-none"
              >
                <span>Pedir este serviço</span>
                <i className="ri-arrow-right-line text-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
