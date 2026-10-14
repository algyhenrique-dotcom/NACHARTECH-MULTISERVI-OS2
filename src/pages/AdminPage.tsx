import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const AdminPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    products,
    categories,
    orders,
    assistanceRequests,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'requests'>('products');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'computadores',
    price: 1000,
    originalPrice: undefined,
    isPromo: false,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    description: '',
    specs: {},
    inStock: true,
  });

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      brand: '',
      category: 'computadores',
      price: 1000,
      originalPrice: undefined,
      isPromo: false,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      description: '',
      specs: {},
      inStock: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsEditing(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.brand) {
      showToast('Por favor, preencha o nome e a marca.');
      return;
    }

    if (editingProduct.id) {
      updateProduct(editingProduct as Product);
    } else {
      addProduct({
        name: editingProduct.name,
        brand: editingProduct.brand,
        category: editingProduct.category || 'computadores',
        price: Number(editingProduct.price) || 0,
        originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
        isPromo: Boolean(editingProduct.isPromo),
        image: editingProduct.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
        description: editingProduct.description || '',
        specs: editingProduct.specs || {},
        inStock: editingProduct.inStock ?? true,
      });
    }

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav variant="solid" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
          <div>
            <span className="stamp mb-1">GESTÃO NACHARTECH</span>
            <h1 className="text-[clamp(28px,3.8vw,44px)] font-semibold tracking-tight">
              {t('admin.title')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetCatalog}
              className="pill-btn text-[12px] text-amber-400 border-amber-400/40 hover:bg-amber-400/10"
            >
              <i className="ri-restart-line mr-1.5" />
              <span>{t('admin.resetDemo')}</span>
            </button>
            <Link to="/loja" className="pill-btn text-[12px]">
              Ver Loja
            </Link>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-8 border-b border-[color-mix(in_srgb,var(--text)_8%,transparent)] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pill-btn text-[13px] ${
              activeTab === 'products'
                ? 'bg-[var(--accent)] text-[#14100b] border-[var(--accent)] font-semibold'
                : ''
            }`}
          >
            <i className="ri-store-2-line mr-1.5" />
            <span>Produtos ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pill-btn text-[13px] ${
              activeTab === 'orders'
                ? 'bg-[var(--accent)] text-[#14100b] border-[var(--accent)] font-semibold'
                : ''
            }`}
          >
            <i className="ri-shopping-bag-line mr-1.5" />
            <span>Encomendas ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`pill-btn text-[13px] ${
              activeTab === 'requests'
                ? 'bg-[var(--accent)] text-[#14100b] border-[var(--accent)] font-semibold'
                : ''
            }`}
          >
            <i className="ri-customer-service-2-line mr-1.5" />
            <span>Assistência Técnica ({assistanceRequests.length})</span>
          </button>
        </div>

        {/* TAB 1: Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-semibold">
                Lista de Artigos em Catálogo
              </h2>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="cta py-2 px-5 text-[13px]"
              >
                <i className="ri-add-line" />
                <span>{t('admin.newProduct')}</span>
              </button>
            </div>

            <div className="bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="bg-[var(--surface-2)] text-[11px] font-mono uppercase text-[var(--accent2)] border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                    <tr>
                      <th className="p-4">Produto</th>
                      <th className="p-4">Marca</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Preço (MT)</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[color-mix(in_srgb,var(--text)_4%,transparent)]">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 object-contain rounded bg-[#12141a] p-1"
                          />
                          <span className="font-medium line-clamp-1 max-w-xs">{p.name}</span>
                        </td>
                        <td className="p-4 font-mono text-[12px]">{p.brand}</td>
                        <td className="p-4 text-[13px] capitalize">{p.category}</td>
                        <td className="p-4 font-mono font-bold">
                          {p.price.toLocaleString('pt-MZ')} MT
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                              p.inStock
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {p.inStock ? 'Em Stock' : 'Esgotado'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="pill-icon-btn w-8 h-8 hover:text-[var(--accent)]"
                              aria-label="Editar"
                            >
                              <i className="ri-edit-line text-[14px]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(p.id)}
                              className="pill-icon-btn w-8 h-8 hover:text-red-400"
                              aria-label="Eliminar"
                            >
                              <i className="ri-delete-bin-line text-[14px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Orders */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-[18px] font-semibold mb-6">
              Encomendas Recebidas
            </h2>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] rounded-2xl">
                <p className="text-[var(--muted)]">Nenhuma encomenda registada ainda.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 rounded-2xl bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] flex flex-col gap-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-[18px] text-[var(--accent)]">
                          #{ord.id}
                        </span>
                        <span className="text-[13px] text-[var(--muted)]">{ord.date}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[12px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {ord.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[14px]">
                      <div>
                        <span className="text-[11px] font-mono uppercase text-[var(--accent2)] block mb-1">
                          Cliente & Contacto
                        </span>
                        <p className="font-semibold m-0">{ord.customerName}</p>
                        <p className="text-[var(--muted)] m-0">{ord.phone}</p>
                        {ord.email && <p className="text-[var(--muted)] m-0">{ord.email}</p>}
                      </div>

                      <div>
                        <span className="text-[11px] font-mono uppercase text-[var(--accent2)] block mb-1">
                          Modalidade de Entrega
                        </span>
                        <p className="m-0">
                          {ord.deliveryMethod === 'pickup'
                            ? 'Levantamento no Balcão (Nampula)'
                            : `Entrega: ${ord.address}`}
                        </p>
                        <p className="text-[var(--muted)] m-0 uppercase font-mono text-[12px]">
                          Pagamento: {ord.paymentMethod}
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-mono uppercase text-[var(--accent2)] block mb-1">
                          Resumo & Total
                        </span>
                        <div className="flex flex-col gap-1 mb-2">
                          {ord.items.map((i, idx) => (
                            <div key={idx} className="text-[13px] flex justify-between">
                              <span>{i.quantity}x {i.productName}</span>
                              <span className="font-mono">{(i.price * i.quantity).toLocaleString('pt-MZ')} MT</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-[16px] font-bold font-mono text-[var(--accent)] pt-1 border-t border-[color-mix(in_srgb,var(--text)_8%,transparent)] flex justify-between">
                          <span>Total:</span>
                          <span>{ord.total.toLocaleString('pt-MZ')} MT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Requests */}
        {activeTab === 'requests' && (
          <div>
            <h2 className="text-[18px] font-semibold mb-6">
              Pedidos de Assistência Técnica (Contacto)
            </h2>

            {assistanceRequests.length === 0 ? (
              <div className="p-12 text-center bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] rounded-2xl">
                <p className="text-[var(--muted)]">Nenhum pedido de assistência recebido ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assistanceRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-6 rounded-2xl bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)] flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono font-bold text-[var(--accent2)]">
                          #{req.id} • {req.date}
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-amber-500/10 text-amber-400">
                          {req.status}
                        </span>
                      </div>
                      <h3 className="text-[16px] font-semibold mb-1">
                        {req.name}
                      </h3>
                      <div className="flex items-center gap-3 text-[13px] text-[var(--muted)] mb-3">
                        <a href={`tel:${req.phone}`} className="hover:text-[var(--accent)]">
                          <i className="ri-phone-line mr-1" />
                          {req.phone}
                        </a>
                        {req.email && (
                          <a href={`mailto:${req.email}`} className="hover:text-[var(--accent)]">
                            <i className="ri-mail-line mr-1" />
                            {req.email}
                          </a>
                        )}
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] text-[13px]">
                        <span className="text-[11px] font-mono text-[var(--accent)] uppercase block mb-1">
                          Serviço: {req.service}
                        </span>
                        <p className="m-0 text-[var(--text)]">{req.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}?text=Olá%20${encodeURIComponent(req.name)},%20contacto%20da%20NacharTech%20a%20propósito%20do%20seu%20pedido%20de%20assistência.`}
                        target="_blank"
                        rel="noreferrer"
                        className="pill-btn flex-1 text-center justify-center text-[12px] text-[#25d366]"
                      >
                        <i className="ri-whatsapp-line mr-1" />
                        Responder no WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Editor for Product Add/Edit */}
        {isEditing && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-[var(--surface)] text-[var(--text)] border border-[color-mix(in_srgb,var(--text)_14%,transparent)] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center pb-4 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                <h3 className="text-[20px] font-semibold">
                  {editingProduct.id ? t('admin.editProduct') : t('admin.newProduct')}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="pill-icon-btn"
                >
                  <i className="ri-close-line text-[18px]" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                    {t('admin.name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                      {t('admin.brand')}
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.brand || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, brand: e.target.value })
                      }
                      className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                      {t('admin.category')}
                    </label>
                    <select
                      value={editingProduct.category || 'computadores'}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                      {t('admin.price')}
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                      {t('admin.originalPrice')}
                    </label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          originalPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="Opcional"
                      className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                    {t('admin.image')}
                  </label>
                  <input
                    type="url"
                    value={editingProduct.image || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-[var(--accent2)]">
                    {t('admin.description')}
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--bg)] border border-[color-mix(in_srgb,var(--text)_12%,transparent)] rounded-lg px-3 py-2 text-[14px]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isPromo || false}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          isPromo: e.target.checked,
                        })
                      }
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-[13px]">{t('admin.isPromo')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock ?? true}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          inStock: e.target.checked,
                        })
                      }
                      className="accent-[var(--accent)]"
                    />
                    <span className="text-[13px]">{t('admin.inStock')}</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="pill-btn"
                  >
                    {t('admin.cancel')}
                  </button>
                  <button type="submit" className="cta text-xs py-2 px-6">
                    {t('admin.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
