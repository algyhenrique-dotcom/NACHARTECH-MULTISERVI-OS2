import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, addToCart, toggleFavorite, isFavorite, lang } = useShop();

  const currentCategory = searchParams.get('categoria') || 'all';
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyPromo, setOnlyPromo] = useState(false);

  // Sync state if URL param changes
  React.useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleCategorySelect = (catId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('categoria');
    } else {
      newParams.set('categoria', catId);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('q', val.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (currentCategory !== 'all' && p.category !== currentCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }
      // Stock filter
      if (onlyInStock && !p.inStock) {
        return false;
      }
      // Promo filter
      if (onlyPromo && !p.isPromo) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, currentCategory, searchQuery, onlyInStock, onlyPromo, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav variant="solid" />

      <main className="flex-1 w-full px-[clamp(14px,2vw,28px)] pt-24 md:pt-28 pb-16">
        {/* Page Header */}
        <div className="mb-10">
          <div className="stamp mb-2">LOJA OFICIAL NACHARTECH</div>
          <h1 className="text-[clamp(30px,4.5vw,56px)] font-semibold tracking-[-0.03em] leading-tight mb-4">
            Catálogo de Tecnologia & Equipamentos
          </h1>
          <p className="text-[15px] text-[var(--muted)] max-w-2xl">
            Adquira computadores, componentes, redes, CCTV, climatização e papelaria com garantia e suporte técnico local em Nampula.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-2xl p-4 md:p-6 mb-10 flex flex-col gap-6">
          {/* Top row: search & sorting */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative flex items-center">
              <i className="ri-search-line absolute left-4 text-[18px] text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('shop.searchInCatalog')}
                className="w-full bg-[var(--bg)] pl-11 pr-4 py-2.5 text-[14px] rounded-xl border border-[color-mix(in_srgb,var(--text)_12%,transparent)] focus:border-[var(--accent)] outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('q');
                    setSearchParams(newParams);
                  }}
                  className="absolute right-3 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  <i className="ri-close-line" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3 flex items-center gap-2">
              <span className="text-[12px] font-mono text-[var(--accent2)] uppercase shrink-0">
                ORDENAR:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[var(--bg)] py-2.5 px-3 text-[13px] rounded-xl border border-[color-mix(in_srgb,var(--text)_12%,transparent)] outline-none cursor-pointer"
              >
                <option value="default">Recomendados</option>
                <option value="price-asc">{t('shop.priceAsc')}</option>
                <option value="price-desc">{t('shop.priceDesc')}</option>
                <option value="name">{t('shop.nameAsc')}</option>
              </select>
            </div>

            {/* Checkbox toggles */}
            <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-4 text-[13px]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyPromo}
                  onChange={(e) => setOnlyPromo(e.target.checked)}
                  className="rounded accent-[var(--accent)]"
                />
                <span>Promoções</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded accent-[var(--accent)]"
                />
                <span>Em Stock</span>
              </label>
            </div>
          </div>

          {/* Categories Pill Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className={`pill-btn text-[12px] tracking-wider uppercase shrink-0 ${
                currentCategory === 'all'
                  ? 'bg-[var(--accent)] text-[#14100b] border-[var(--accent)] font-semibold'
                  : ''
              }`}
            >
              Todos ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`pill-btn text-[12px] tracking-wider uppercase shrink-0 ${
                    currentCategory === cat.id
                      ? 'bg-[var(--accent)] text-[#14100b] border-[var(--accent)] font-semibold'
                      : ''
                  }`}
                >
                  <i className={`${cat.icon} mr-1.5`} />
                  <span>{lang === 'en' ? cat.nameEn : cat.name}</span>
                  <span className="ml-1 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-[13px] text-[var(--muted)]">
          <span>
            {filteredProducts.length} {t('shop.found')}
          </span>
          {currentCategory !== 'all' && (
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <i className="ri-close-line" />
              <span>Limpar filtro de categoria</span>
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] rounded-3xl p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[color-mix(in_srgb,var(--text)_8%,transparent)] flex items-center justify-center text-[28px] text-[var(--muted)] mb-4">
              <i className="ri-search-2-line" />
            </div>
            <h3 className="text-[18px] font-semibold mb-2">{t('shop.noResults')}</h3>
            <p className="text-[14px] text-[var(--muted)] max-w-md mx-auto mb-6">
              Experimente alterar os termos de pesquisa ou remover os filtros aplicados.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
                setOnlyInStock(false);
                setOnlyPromo(false);
              }}
              className="pill-btn"
            >
              Redefinir filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: Product) => {
              const favorite = isFavorite(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] rounded-xl overflow-hidden flex flex-col justify-between group transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
                >
                  {/* Image & Badges - Touching corners */}
                  <div className="relative w-full aspect-square overflow-hidden bg-[#12141a] flex items-center justify-center">
                    {product.isPromo && (
                      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[var(--accent)] text-[#14100b] text-[10px] font-bold tracking-wider uppercase">
                        PROMO
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] backdrop-blur-md flex items-center justify-center text-[var(--text)] transition-colors hover:text-[var(--accent)] cursor-pointer"
                      aria-label="Favorito"
                    >
                      <i
                        className={`${
                          favorite
                            ? 'ri-heart-fill text-[var(--accent)]'
                            : 'ri-heart-line'
                        } text-[13px]`}
                      />
                    </button>

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

                  {/* Info with padding */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-[var(--accent2)] block mb-1">
                        {product.brand}
                      </span>

                      <Link
                        to={`/produto/${product.id}`}
                        className="no-underline text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                      >
                        <h3 className="text-[13px] font-medium leading-[1.3] line-clamp-2 min-h-[34px] mb-2">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    <div>
                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-[15px] font-bold tracking-tight font-mono">
                          {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MT
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-[var(--muted)] line-through font-mono">
                            {product.originalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MT
                          </span>
                        )}
                      </div>

                      {/* Add Button */}
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="w-full py-2 rounded-full bg-[var(--accent)] text-[#14100b] text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#ff8a29] transition-colors cursor-pointer border-none shadow-sm"
                      >
                        <i className="ri-shopping-cart-2-line text-[14px]" />
                        <span>{t('featuredProducts.add')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
