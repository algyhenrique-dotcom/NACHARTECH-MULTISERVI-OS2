import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { useShop } from '../context/ShopContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    products,
    categories,
    addToCart,
    toggleFavorite,
    isFavorite,
    lang,
  } = useShop();

  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Set initial selected image
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <Nav variant="solid" />
        <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-40 text-center">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
          <p className="text-[var(--muted)] mb-8">
            O produto procurado pode ter sido removido ou o link está incorreto.
          </p>
          <button
            type="button"
            onClick={() => navigate('/loja')}
            className="cta"
          >
            Voltar à loja
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryObj = categories.find((c) => c.id === product.category);
  const favorite = isFavorite(product.id);
  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Olá NacharTech! Gostaria de encomendar:\n\n*${product.name}*\nMarca: ${product.brand}\nQuantidade: ${quantity}\nTotal: ${(product.price * quantity).toLocaleString('pt-MZ')} MT\n\nPodem confirmar a disponibilidade para entrega em Nampula?`
    );
    window.open(`https://wa.me/258847610803?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav variant="solid" />

      <main className="flex-1 w-full px-[clamp(14px,2vw,28px)] pt-24 md:pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] font-mono uppercase text-[var(--muted)] mb-8">
          <Link to="/" className="hover:text-[var(--text)] no-underline text-inherit">
            Início
          </Link>
          <span>/</span>
          <Link to="/loja" className="hover:text-[var(--text)] no-underline text-inherit">
            Loja
          </Link>
          {categoryObj && (
            <>
              <span>/</span>
              <Link
                to={`/loja?categoria=${categoryObj.id}`}
                className="hover:text-[var(--text)] no-underline text-inherit"
              >
                {lang === 'en' ? categoryObj.nameEn : categoryObj.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[var(--accent2)] truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-3xl bg-[#12141a] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] overflow-hidden flex items-center justify-center p-8">
              {product.isPromo && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[var(--accent)] text-[#14100b] text-[11px] font-bold tracking-wider uppercase">
                  PROMO
                </span>
              )}
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] backdrop-blur-md flex items-center justify-center text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                aria-label="Favorito"
              >
                <i
                  className={`${
                    favorite ? 'ri-heart-fill text-[var(--accent)]' : 'ri-heart-line'
                  } text-[16px]`}
                />
              </button>

              <img
                src={selectedImage || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Thumbnail selector if multiple images */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden bg-[#12141a] p-2 border-2 transition-all shrink-0 ${
                      (selectedImage || product.image) === img
                        ? 'border-[var(--accent)]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Buy Actions */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Brand */}
            <span className="stamp mb-2">{product.brand}</span>

            {/* Title */}
            <h1 className="text-[clamp(26px,3.6vw,44px)] font-semibold tracking-[-0.02em] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
              <span className="text-[clamp(28px,3.8vw,42px)] font-bold font-mono tracking-tight text-[var(--text)]">
                {product.price.toLocaleString('pt-MZ')} MT
              </span>
              {product.originalPrice && (
                <span className="text-[18px] text-[var(--muted)] line-through font-mono">
                  {product.originalPrice.toLocaleString('pt-MZ')} MT
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[15px] leading-relaxed text-[var(--muted)] mb-8">
              {product.description}
            </p>

            {/* Stock status indicator */}
            <div className="flex items-center gap-2 mb-8 text-[13px]">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  product.inStock ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="font-medium">
                {product.inStock
                  ? t('shop.stockAvailable')
                  : t('shop.stockUnavailable')}
              </span>
            </div>

            {/* Quantity Selector and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center border border-[color-mix(in_srgb,var(--text)_16%,transparent)] rounded-full px-2 py-1 bg-[var(--surface)] w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-[16px] hover:text-[var(--accent)]"
                  aria-label="Diminuir"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-[15px]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-[16px] hover:text-[var(--accent)]"
                  aria-label="Aumentar"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                className="cta flex-1 py-3 text-[14px] font-semibold"
              >
                <i className="ri-shopping-cart-2-line text-[16px]" />
                <span>{t('shop.addToCart')}</span>
              </button>
            </div>

            {/* WhatsApp Direct Buy Button */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="w-full py-3 rounded-full bg-[#1e2a22] border border-[#25d366]/40 text-[#25d366] text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#25d366] hover:text-black transition-colors mb-6 cursor-pointer"
            >
              <i className="ri-whatsapp-fill text-[18px]" />
              <span>{t('shop.orderWhatsapp')}</span>
            </button>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--surface-2)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] text-[12px]">
              <div className="flex items-center gap-3">
                <i className="ri-shield-check-line text-[20px] text-[var(--accent2)]" />
                <span>Garantia oficial e assistência técnica em Nampula</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-truck-line text-[20px] text-[var(--accent2)]" />
                <span>Entrega rápida no mesmo dia na cidade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-20">
            <h3 className="text-[20px] font-semibold tracking-tight mb-6 pb-3 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
              {t('shop.specs')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
              {Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-[color-mix(in_srgb,var(--text)_8%,transparent)] text-[14px]"
                >
                  <span className="text-[var(--muted)]">{key}</span>
                  <span className="font-medium text-[var(--text)] text-right">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-[22px] font-semibold tracking-tight mb-8">
              {t('shop.related')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] rounded-xl overflow-hidden flex flex-col justify-between group transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
                >
                  <Link
                    to={`/produto/${rel.id}`}
                    className="relative aspect-square w-full overflow-hidden bg-[#12141a] flex items-center justify-center block"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <span className="text-[11px] font-mono uppercase text-[var(--accent2)] block mb-1">
                      {rel.brand}
                    </span>
                    <Link
                      to={`/produto/${rel.id}`}
                      className="text-[14px] font-medium leading-snug line-clamp-2 text-[var(--text)] hover:text-[var(--accent)] no-underline mb-3 block"
                    >
                      {rel.name}
                    </Link>
                    <div className="flex items-baseline justify-between pt-2 border-t border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                      <span className="text-[16px] font-bold font-mono">
                        {rel.price.toLocaleString('pt-MZ')} MT
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(rel)}
                        className="pill-icon-btn w-8 h-8"
                        aria-label="Adicionar"
                      >
                        <i className="ri-shopping-cart-2-line text-[14px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
