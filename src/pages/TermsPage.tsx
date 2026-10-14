import React from 'react';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <Nav variant="solid" />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 md:px-12 pt-32 pb-24">
        <span className="stamp mb-2">INFORMAÇÃO LEGAL</span>
        <h1 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight mb-8">
          Termos e Condições & Privacidade
        </h1>

        <div className="space-y-8 text-[15px] leading-relaxed text-[var(--muted)]">
          <section className="bg-[var(--surface)] p-6 rounded-2xl border border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
            <h2 className="text-[18px] font-semibold text-[var(--text)] mb-3">
              1. Sobre a NacharTech Multisserviços
            </h2>
            <p>
              A NacharTech Multisserviços é uma empresa registada em Nampula, Moçambique, especializada em assistência técnica, instalação de redes, videovigilância CCTV, eletricidade, climatização e comércio de equipamentos informáticos e artigos de papelaria.
            </p>
          </section>

          <section className="bg-[var(--surface)] p-6 rounded-2xl border border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
            <h2 className="text-[18px] font-semibold text-[var(--text)] mb-3">
              2. Encomendas e Pagamentos Locais
            </h2>
            <p>
              Todos os preços apresentados na loja online são cotados em Meticais (MT). Os pagamentos podem ser efetuados via M-Pesa (+258 847 610 803), e-Mola ou em numerário no ato de levantamento no balcão ou entrega ao domicílio na cidade de Nampula.
            </p>
          </section>

          <section className="bg-[var(--surface)] p-6 rounded-2xl border border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
            <h2 className="text-[18px] font-semibold text-[var(--text)] mb-3">
              3. Garantia e Assistência Técnica
            </h2>
            <p>
              Os equipamentos eletrónicos novos beneficiam de garantia legal contra defeitos de fabrico. Os serviços de reparação técnica efetuados na nossa bancada incluem diagnóstico rigoroso e garantia de intervenção sobre as peças substituídas.
            </p>
          </section>

          <section className="bg-[var(--surface)] p-6 rounded-2xl border border-[color-mix(in_srgb,var(--text)_8%,transparent)]">
            <h2 className="text-[18px] font-semibold text-[var(--text)] mb-3">
              4. Privacidade e Proteção de Dados
            </h2>
            <p>
              Os dados de contacto fornecidos nos formulários de assistência ou checkout destinam-se exclusivamente à gestão das ordens de serviço e comunicação direta com o cliente via telefone ou WhatsApp. Nunca partilhamos informações pessoais com terceiros.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
