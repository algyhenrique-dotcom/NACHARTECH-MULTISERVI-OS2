import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { useShop } from '../context/ShopContext';

export const AccountPage: React.FC = () => {
  const { t } = useTranslation();
  const { orders, assistanceRequests } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav variant="solid" />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10 pb-6 border-b border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
          <div>
            <span className="stamp mb-1">PAINEL DO CLIENTE</span>
            <h1 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight">
              A Minha Conta
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="pill-btn text-[12px] uppercase tracking-wider">
              <i className="ri-admin-line mr-1.5" />
              <span>Painel Admin</span>
            </Link>
            <a
              href="https://wa.me/258847610803"
              target="_blank"
              rel="noreferrer"
              className="pill-btn text-[12px] uppercase tracking-wider text-[#25d366]"
            >
              <i className="ri-whatsapp-line mr-1.5" />
              <span>Suporte WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Column 1: Order History */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div>
              <h2 className="text-[20px] font-semibold mb-4 flex items-center gap-2">
                <i className="ri-shopping-bag-line text-[var(--accent)]" />
                <span>Histórico de Encomendas ({orders.length})</span>
              </h2>

              {orders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] text-center">
                  <p className="text-[var(--muted)] text-[14px] mb-4">
                    Ainda não efetuou nenhuma encomenda na loja online.
                  </p>
                  <Link to="/loja" className="cta text-xs py-2 px-5">
                    Ir para a Loja
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] flex flex-col gap-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[color-mix(in_srgb,var(--text)_6%,transparent)] text-[13px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[var(--accent)]">
                            #{ord.id}
                          </span>
                          <span className="text-[var(--muted)]">• {ord.date}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {ord.status === 'pending'
                            ? 'Pendente de envio'
                            : ord.status}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-[14px]">
                        {ord.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-[var(--text)]"
                          >
                            <span>
                              {it.quantity}x {it.productName}
                            </span>
                            <span className="font-mono text-[var(--muted)] text-[13px]">
                              {(it.price * it.quantity).toLocaleString('pt-MZ')} MT
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-[color-mix(in_srgb,var(--text)_6%,transparent)]">
                        <span className="text-[13px] text-[var(--muted)]">
                          Entrega: {ord.deliveryMethod === 'pickup' ? 'Balcão Nampula' : ord.address}
                        </span>
                        <span className="font-bold font-mono text-[16px] text-[var(--accent)]">
                          Total: {ord.total.toLocaleString('pt-MZ')} MT
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assistance Requests List */}
            <div>
              <h2 className="text-[20px] font-semibold mb-4 flex items-center gap-2">
                <i className="ri-customer-service-2-line text-[var(--accent)]" />
                <span>Os Meus Pedidos de Assistência ({assistanceRequests.length})</span>
              </h2>

              {assistanceRequests.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] text-center">
                  <p className="text-[var(--muted)] text-[14px] mb-4">
                    Não tem pedidos de assistência técnica registados.
                  </p>
                  <a href="/#contacto" className="pill-btn text-xs">
                    Pedir Assistência
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {assistanceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)] flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-mono font-bold text-[var(--accent2)]">
                          #{req.id} • {req.date}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {req.status}
                        </span>
                      </div>
                      <div className="text-[15px] font-medium text-[var(--text)]">
                        Serviço: {req.service.toUpperCase()}
                      </div>
                      <p className="text-[14px] text-[var(--muted)] m-0">
                        {req.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Profile & Support Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[color-mix(in_srgb,var(--text)_10%,transparent)]">
              <h3 className="text-[18px] font-semibold mb-4">
                NacharTech Moçambique
              </h3>
              <div className="flex flex-col gap-3 text-[14px] text-[var(--muted)]">
                <div className="flex items-center gap-3">
                  <i className="ri-map-pin-2-line text-[var(--accent)]" />
                  <span>Cidade de Nampula, Província de Nampula</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-phone-line text-[var(--accent)]" />
                  <span className="font-mono">+258 847 610 803</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-mail-line text-[var(--accent)]" />
                  <span>nachartechmultiservicoe@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ri-time-line text-[var(--accent)]" />
                  <span>Segunda a Sábado: 08:00 – 18:00</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface-2)] border border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
              <h4 className="text-[15px] font-semibold mb-2">
                Precisa de uma visita técnica urgente?
              </h4>
              <p className="text-[13px] text-[var(--muted)] mb-4">
                O nosso piquete de assistência rápida atende chamadas para reparações de rede, CCTV e ar-condicionado em toda a cidade.
              </p>
              <a
                href="tel:+258847610803"
                className="cta w-full text-center py-2.5 text-xs"
              >
                Ligar Agora (+258 847 610 803)
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
