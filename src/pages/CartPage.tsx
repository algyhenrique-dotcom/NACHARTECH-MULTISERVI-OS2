import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
    createOrder,
    showToast,
  } = useShop();

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'cash'>('mpesa');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Nampula',
  });

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name.trim() || !customerInfo.phone.trim()) {
      showToast('Por favor, informe o seu nome e telefone.');
      return;
    }

    if (deliveryMethod === 'delivery' && !customerInfo.address.trim()) {
      showToast('Por favor, indique o endereço ou bairro para entrega em Nampula.');
      return;
    }

    const newOrder = createOrder({
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email,
      address: customerInfo.address,
      city: customerInfo.city,
      deliveryMethod,
      paymentMethod,
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      total: cartTotal,
    });

    setCreatedOrder(newOrder);
    showToast(t('cart.successTitle'));
  };

  const handleSendViaWhatsApp = (order: Order) => {
    const itemsList = order.items
      .map(
        (i) =>
          `• ${i.quantity}x ${i.productName} — ${(i.price * i.quantity).toLocaleString('pt-MZ')} MT`
      )
      .join('\n');

    const message = encodeURIComponent(
      `*NOVA ENCOMENDA #${order.id} — NACHARTECH*\n\n` +
        `*Cliente:* ${order.customerName}\n` +
        `*Telefone:* ${order.phone}\n` +
        `*Entrega:* ${order.deliveryMethod === 'pickup' ? 'Levantamento no Balcão' : `Entrega em Nampula (${order.address})`}\n` +
        `*Pagamento:* ${order.paymentMethod.toUpperCase()}\n\n` +
        `*Artigos:*\n${itemsList}\n\n` +
        `*TOTAL:* ${order.total.toLocaleString('pt-MZ')} MT\n\n` +
        `Por favor, confirmem a encomenda.`
    );

    window.open(`https://wa.me/258847610803?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav variant="solid" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-12 pt-32 pb-24">
        {createdOrder ? (
          /* Order Confirmation View */
          <div className="max-w-2xl mx-auto py-12 px-6 bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-3xl text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[color-mix(in_srgb,var(--accent2)_20%,transparent)] text-[var(--accent2)] flex items-center justify-center text-[36px] mb-6">
              <i className="ri-checkbox-circle-fill" />
            </div>

            <span className="stamp mb-2">ENCOMENDA REGISTADA</span>
            <h1 className="text-[28px] font-bold mb-2">
              #{createdOrder.id}
            </h1>
            <p className="text-[15px] text-[var(--muted)] max-w-md mb-8">
              {t('cart.successMsg')}
            </p>

            {/* Order summary box */}
            <div className="w-full bg-[var(--bg)] p-6 rounded-2xl border border-[color-mix(in_srgb,var(--text)_8%,transparent)] mb-8 text-left text-[14px]">
              <div className="flex justify-between py-2 border-b border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                <span className="text-[var(--muted)]">Cliente:</span>
                <span className="font-medium">{createdOrder.customerName} ({createdOrder.phone})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                <span className="text-[var(--muted)]">Entrega:</span>
                <span className="font-medium">
                  {createdOrder.deliveryMethod === 'pickup'
                    ? 'Levantamento no balcão'
                    : `Entrega em ${createdOrder.address}`}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                <span className="text-[var(--muted)]">Pagamento:</span>
                <span className="font-medium uppercase">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2.5 font-bold text-[16px] text-[var(--accent)] font-mono">
                <span>Total a Pagar:</span>
                <span>{createdOrder.total.toLocaleString('pt-MZ')} MT</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                type="button"
                data-magnetic
                onClick={() => handleSendViaWhatsApp(createdOrder)}
                className="cta flex-1 py-3.5 bg-[#25d366] text-black hover:bg-[#20ba59]"
              >
                <i className="ri-whatsapp-fill text-[18px]" />
                <span>{t('cart.orderViaWhatsApp')}</span>
              </button>

              <button
                type="button"
                data-magnetic
                onClick={() => navigate('/loja')}
                className="pill-btn py-3.5 px-6"
              >
                Voltar à Loja
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart View */
          <div className="py-24 text-center max-w-md mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center text-[36px] text-[var(--muted)] mb-6">
              <i className="ri-shopping-cart-line" />
            </div>
            <h1 className="text-[26px] font-semibold mb-2">{t('cart.empty')}</h1>
            <p className="text-[14px] text-[var(--muted)] mb-8">
              {t('cart.emptyLead')}
            </p>
            <Link to="/loja" data-magnetic className="cta">
              <span>{t('cart.startShopping')}</span>
              <i className="ri-arrow-right-line" />
            </Link>
          </div>
        ) : (
          /* Normal Cart & Checkout Flow */
          <div>
            <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
              <h1 className="text-[clamp(28px,4vw,48px)] font-semibold tracking-tight">
                {t('cart.title')}
              </h1>
              <button
                type="button"
                onClick={clearCart}
                className="text-[13px] text-[var(--muted)] hover:text-red-400"
              >
                Esvaziar carrinho
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 md:p-5 rounded-2xl bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] flex gap-4 md:gap-6 items-center"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-[#12141a] p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-mono uppercase text-[var(--accent2)] block mb-0.5">
                        {item.product.brand}
                      </span>
                      <Link
                        to={`/produto/${item.product.id}`}
                        className="text-[15px] font-medium leading-snug line-clamp-2 text-[var(--text)] hover:text-[var(--accent)] no-underline mb-2 block"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-[14px] text-[var(--muted)] font-mono">
                        {item.product.price.toLocaleString('pt-MZ')} MT / unid.
                      </div>
                    </div>

                    {/* Controls & Subtotal */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-[16px] font-bold font-mono">
                        {(item.product.price * item.quantity).toLocaleString('pt-MZ')} MT
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[color-mix(in_srgb,var(--text)_15%,transparent)] rounded-full overflow-hidden bg-[var(--bg)]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center text-[13px] hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)]"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-[13px] font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center text-[13px] hover:bg-[color-mix(in_srgb,var(--text)_10%,transparent)]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[var(--muted)] hover:text-red-400 p-1"
                          aria-label="Remover"
                        >
                          <i className="ri-delete-bin-line text-[16px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Checkout Form & Total */}
              <div className="lg:col-span-5 bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                <h2 className="text-[20px] font-semibold tracking-tight pb-3 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                  {t('cart.checkout')}
                </h2>

                <form onSubmit={handleSubmitOrder} className="flex flex-col gap-6">
                  {/* Delivery Selection */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent2)]">
                      {t('cart.deliveryMethod')}
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      <label
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          deliveryMethod === 'pickup'
                            ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]'
                            : 'border-[color-mix(in_srgb,var(--text)_12%,transparent)] bg-[var(--bg)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryMethod === 'pickup'}
                            onChange={() => setDeliveryMethod('pickup')}
                            className="accent-[var(--accent)]"
                          />
                          <span className="text-[13px]">{t('cart.pickup')}</span>
                        </div>
                        <span className="text-[12px] font-mono text-emerald-400">
                          {t('cart.free')}
                        </span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          deliveryMethod === 'delivery'
                            ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]'
                            : 'border-[color-mix(in_srgb,var(--text)_12%,transparent)] bg-[var(--bg)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryMethod === 'delivery'}
                            onChange={() => setDeliveryMethod('delivery')}
                            className="accent-[var(--accent)]"
                          />
                          <span className="text-[13px]">{t('cart.deliveryHome')}</span>
                        </div>
                        <span className="text-[12px] font-mono text-emerald-400">
                          {t('cart.free')}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Selection */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-mono tracking-wider uppercase text-[var(--accent2)]">
                      {t('cart.paymentMethod')}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px]">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          paymentMethod === 'mpesa'
                            ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] font-semibold'
                            : 'border-[color-mix(in_srgb,var(--text)_12%,transparent)] bg-[var(--bg)]'
                        }`}
                      >
                        M-Pesa
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('emola')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          paymentMethod === 'emola'
                            ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] font-semibold'
                            : 'border-[color-mix(in_srgb,var(--text)_12%,transparent)] bg-[var(--bg)]'
                        }`}
                      >
                        e-Mola
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          paymentMethod === 'cash'
                            ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] font-semibold'
                            : 'border-[color-mix(in_srgb,var(--text)_12%,transparent)] bg-[var(--bg)]'
                        }`}
                      >
                        Dinheiro
                      </button>
                    </div>
                  </div>

                  {/* Customer Information Inputs */}
                  <div className="flex flex-col gap-4 pt-2 border-t border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, name: e.target.value })
                        }
                        placeholder="Ex: João Tembe"
                        className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, phone: e.target.value })
                          }
                          placeholder="+258 84..."
                          className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                          Email (Opcional)
                        </label>
                        <input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, email: e.target.value })
                          }
                          placeholder="email@exemplo.com"
                          className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                        />
                      </div>
                    </div>

                    {deliveryMethod === 'delivery' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                          {t('cart.address')}
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.address}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              address: e.target.value,
                            })
                          }
                          placeholder="Bairro, Rua, Ponto de referência..."
                          className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Summary Totals */}
                  <div className="pt-4 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)] flex flex-col gap-2">
                    <div className="flex justify-between text-[14px] text-[var(--muted)]">
                      <span>{t('cart.subtotal')}</span>
                      <span className="font-mono">{cartTotal.toLocaleString('pt-MZ')} MT</span>
                    </div>
                    <div className="flex justify-between text-[14px] text-[var(--muted)]">
                      <span>{t('cart.delivery')}</span>
                      <span className="text-emerald-400">{t('cart.free')}</span>
                    </div>
                    <div className="flex justify-between text-[18px] font-bold font-mono text-[var(--text)] pt-2 border-t border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                      <span>{t('cart.total')}</span>
                      <span className="text-[var(--accent)]">
                        {cartTotal.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>
                  </div>

                  {/* Submit Order */}
                  <button
                    type="submit"
                    data-magnetic
                    className="cta w-full py-4 text-[15px]"
                  >
                    <span>{t('cart.placeOrderBtn')}</span>
                    <i className="ri-arrow-right-line" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
