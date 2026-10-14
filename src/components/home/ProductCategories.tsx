import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useShop } from '../../context/ShopContext';
import { Category } from '../../types';

export const ProductCategories: React.FC = () => {
  const { t } = useTranslation();
  const { categories, lang } = useShop();

  return (
    <section className="w-full py-8 md:py-10 bg-[#0f1115] text-[#f4f1ec] border-b border-white/[0.08]">
      <div className="w-full px-[clamp(14px,2vw,28px)]">
        {/* Header: Title on left, Link on right */}
        <div className="flex items-center justify-between gap-4 mb-5 md:mb-6">
          <h2 className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em] leading-tight text-white">
            Categorias de produtos.
          </h2>

          <Link
            to="/loja"
            className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-[#ff7a1a] hover:underline no-underline"
          >
            <span>Ver todos os produtos</span>
            <i className="ri-arrow-right-line text-[14px]" />
          </Link>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat: Category) => (
            <Link
              key={cat.id}
              to={`/loja?categoria=${cat.id}`}
              className="relative aspect-[16/10] rounded-xl overflow-hidden group bg-[#171a20] border border-white/[0.08] transition-colors duration-200 hover:border-white/20 no-underline text-inherit block"
            >
              {/* Full-bleed photography */}
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {/* Scrim Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

              {/* Label at bottom-left */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 md:bottom-3 md:left-3 md:right-3 z-10 flex items-center gap-2">
                <i className={`${cat.icon} text-[#ff7a1a] text-[15px] md:text-[17px] shrink-0`} />
                <h3 className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-white leading-tight m-0 truncate">
                  {lang === 'en' ? cat.nameEn : cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
