import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { useShop } from '../context/ShopContext';

export const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const { products, favorites, toggleFavorite, addToCart } = useShop();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav variant="solid" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-12 pt-32 pb-24">
        <div className="mb-10">
          <span className="stamp mb-2">LISTA DE DESEJOS</span>
          <h1 className="text-[clamp(28px,4vw,48px)] font-semibold tracking-tight">
            {t('favorites.title')} ({favoriteProducts.length})
          </h1>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center text-[36px] text-[var(--muted)] mb-6">
              <i className="ri-heart-line" />
            </div>
            <h2 className="text-[22px] font-semibold mb-2">
              {t('favorites.empty')}
            </h2>
            <p className="text-[14px] text-[var(--muted)] mb-8">
              Guarde os produtos que mais gosta para consultar mais tarde ou partilhar.
            </p>
            <Link to="/loja" data-magnetic className="cta">
              <span>{t('favorites.explore')}</span>
              <i className="ri-arrow-right-line" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] rounded-2xl p-4 flex flex-col justify-between group transition-all duration-300 hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#12141a] mb-4 flex items-center justify-center p-4">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] backdrop-blur-md flex items-center justify-center text-[var(--accent)] hover:scale-110 transition-transform"
                    aria-label="Remover favorito"
                  >
                    <i className="ri-heart-fill text-[16px]" />
                  </button>

                  <Link to={`/produto/${product.id}`} className="w-full h-full block">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </Link>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-[var(--accent2)] block mb-1">
                    {product.brand}
                  </span>
                  <Link
                    to={`/produto/${product.id}`}
                    className="text-[15px] font-medium leading-snug line-clamp-2 text-[var(--text)] hover:text-[var(--accent)] no-underline mb-3 block"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-baseline justify-between pt-3 border-t border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                    <span className="text-[17px] font-bold font-mono">
                      {product.price.toLocaleString('pt-MZ')} MT
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="pill-btn py-1.5 px-3.5 text-[12px]"
                    >
                      <i className="ri-shopping-cart-2-line mr-1.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
