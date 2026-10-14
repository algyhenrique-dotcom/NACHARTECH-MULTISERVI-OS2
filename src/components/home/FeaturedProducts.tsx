import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

export const FeaturedProducts: React.FC = () => {
  const { t } = useTranslation();
  const { products, addToCart, toggleFavorite, isFavorite } = useShop();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Maintain the exact 6 featured products order from Screenshot 8
  const featured = products.slice(0, 6);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const [addedId, setAddedId] = React.useState<string | null>(null);

  const formatPrice = (num: number) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const handleAdd = (product: Product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  return (
    <section id="produtos" className="w-full py-8 md:py-10 bg-[#0f1115] text-[#f4f1ec] border-b border-white/[0.08]">
      <div className="w-full px-[clamp(14px,2vw,28px)]">
        {/* Header: Title on left, Carousel Arrows on right */}
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h2 className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em] leading-tight text-white">
            Produtos em destaque
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Anterior"
            >
              <i className="ri-arrow-left-s-line text-[16px]" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Seguinte"
            >
              <i className="ri-arrow-right-s-line text-[16px]" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map((product: Product) => {
            const favorite = isFavorite(product.id);

            return (
              <div
                key={product.id}
                className="w-[220px] sm:w-[240px] shrink-0 bg-[#171a20] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col justify-between group transition-colors duration-200 hover:border-white/20 snap-start"
              >
                {/* Image Stage Container - Flush touching top & side corners */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0c0e12] flex items-center justify-center">
                  {/* PROMO Badge on Top-Left */}
                  {product.isPromo && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#ff7a1a] text-[#14100b] text-[9px] font-bold tracking-wider uppercase">
                      PROMO
                    </span>
                  )}

                  {/* Wishlist Heart on Top-Right */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white transition-colors hover:text-[#ff7a1a] cursor-pointer"
                    aria-label="Favorito"
                  >
                    <i
                      className={`${
                        favorite
                          ? 'ri-heart-fill text-[#ff7a1a]'
                          : 'ri-heart-line'
                      } text-[13px]`}
                    />
                  </button>

                  {/* Product Image Touching Corners */}
                  <Link
                    to={`/produto/${product.id}`}
                    className="w-full h-full block"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* Content Area with Padding */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Brand in teal cyan */}
                    <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#5fc9bd] block mb-1 font-semibold">
                      {product.brand}
                    </span>

                    {/* Product Name */}
                    <Link
                      to={`/produto/${product.id}`}
                      className="no-underline text-white hover:text-[#ff7a1a] transition-colors block"
                    >
                      <h3 className="text-[12px] sm:text-[13px] font-medium leading-[1.3] line-clamp-2 min-h-[32px] mb-2">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div>
                    {/* Price Row */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-[15px] font-bold tracking-tight text-white font-mono">
                        {formatPrice(product.price)} MT
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-[#9a978f] line-through font-mono">
                          {formatPrice(product.originalPrice)} MT
                        </span>
                      )}
                    </div>

                    {/* Orange Full-Width Add Button without bouncy transform */}
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      className={`w-full py-2 px-3 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150 shadow-sm cursor-pointer border-none ${
                        addedId === product.id
                          ? 'bg-[#5fc9bd] text-[#0f1115]'
                          : 'bg-[#ff7a1a] text-[#14100b] hover:bg-[#ff8a29]'
                      }`}
                    >
                      <i
                        className={
                          addedId === product.id
                            ? 'ri-check-line text-[14px]'
                            : 'ri-shopping-cart-2-line text-[14px]'
                        }
                      />
                      <span>
                        {addedId === product.id
                          ? 'Adicionado!'
                          : t('featuredProducts.add')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
