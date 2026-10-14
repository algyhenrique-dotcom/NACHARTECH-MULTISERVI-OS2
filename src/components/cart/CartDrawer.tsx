import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useShop } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useShop();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/carrinho');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[var(--surface)] text-[var(--text)] h-full flex flex-col justify-between shadow-2xl border-l border-[color-mix(in_srgb,var(--text)_10%,transparent)] z-10 transition-transform duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="ri-shopping-cart-2-line text-[20px] text-[var(--accent)]" />
            <h3 className="text-[18px] font-semibold m-0">{t('cart.title')}</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="pill-icon-btn"
            aria-label="Fechar carrinho"
          >
            <i className="ri-close-line text-[20px]" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--text)_8%,transparent)] flex items-center justify-center text-[28px] text-[var(--muted)] mb-4">
                <i className="ri-shopping-bag-line" />
              </div>
              <h4 className="text-[16px] font-medium mb-1">{t('cart.empty')}</h4>
              <p className="text-[13px] text-[var(--muted)] max-w-xs mb-6">
                {t('cart.emptyLead')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/loja');
                }}
                className="cta text-xs py-2.5 px-6"
              >
                {t('cart.startShopping')}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 rounded-xl bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)]"
              >
                {/* Thumb */}
                <div className="w-18 h-18 rounded-lg overflow-hidden bg-[#101217] shrink-0 p-2 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      to={`/produto/${item.product.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="text-[13px] font-medium leading-snug line-clamp-2 text-[var(--text)] hover:text-[var(--accent)] no-underline"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[var(--muted)] hover:text-red-400 p-1 transition-colors"
                      aria-label="Remover item"
                    >
                      <i className="ri-delete-bin-line text-[14px]" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[14px] font-bold font-mono">
                      {(item.product.price * item.quantity).toLocaleString('pt-MZ')} MT
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-full overflow-hidden bg-[var(--surface)]">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-[13px] hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-colors"
                        aria-label="Diminuir quantidade"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-[12px] font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-[13px] hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)] transition-colors"
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)] bg-[var(--surface-2)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--muted)]">{t('cart.total')}</span>
              <span className="text-[20px] font-bold font-mono">
                {cartTotal.toLocaleString('pt-MZ')} MT
              </span>
            </div>

            <button
              type="button"
              data-magnetic
              onClick={handleCheckoutClick}
              className="cta w-full py-3.5"
            >
              <span>{t('cart.checkout')}</span>
              <i className="ri-arrow-right-line" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
