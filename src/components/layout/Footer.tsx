import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accent } from '../common/RichText';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const servicesList = [
    { name: 'Manutenção e Reparação', hash: '#servicos' },
    { name: 'Informática e Tecnologia', hash: '#servicos' },
    { name: 'Segurança e CCTV', hash: '#servicos' },
    { name: 'Redes e Internet', hash: '#servicos' },
    { name: 'Eletricidade', hash: '#servicos' },
    { name: 'Ar-Condicionado', hash: '#servicos' },
    { name: 'Papelaria e Escritório', hash: '#servicos' },
  ];

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/258847610803?text=Olá%20NacharTech,%20gostaria%20de%20solicitar%20informações%20sobre%20os%20vossos%20serviços.', '_blank');
  };

  return (
    <footer className="w-full bg-[#121419] text-[#f4f1ec] border-t border-white/[0.08]">
      <div className="w-full px-[clamp(14px,2vw,28px)] py-10 md:py-14">
        {/* Footer Title */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-[clamp(26px,4vw,48px)] font-semibold tracking-[-0.025em] leading-[1.04] text-white">
            <Accent text="Precisamos de *resolver*?" />
          </h2>
        </div>

        {/* 3-Column Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 pb-10 border-b border-white/[0.08]">
          {/* Column 1: EMPRESA */}
          <div className="md:col-span-5 flex flex-col items-start gap-3">
            <h4 className="text-[10px] md:text-[11px] font-mono font-medium tracking-[0.16em] uppercase text-[#5fc9bd]">
              EMPRESA
            </h4>
            <p className="text-[13px] leading-[1.6] text-[#9a978f] max-w-[42ch]">
              NacharTech Multisserviços — tecnologia, informática, CCTV, redes, eletricidade, ar-condicionado, papelaria e assistência técnica.
            </p>
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff7a1a] text-[#14100b] text-[13px] font-semibold hover:bg-[#ff8a29] transition-colors cursor-pointer border-none shadow-sm"
            >
              <i className="ri-whatsapp-fill text-[16px]" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Column 2: SERVIÇOS */}
          <div className="md:col-span-4 flex flex-col gap-3.5">
            <h4 className="text-[11px] font-mono font-medium tracking-[0.16em] uppercase text-[#5fc9bd]">
              SERVIÇOS
            </h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {servicesList.map((svc) => (
                <li key={svc.name}>
                  <a
                    href={svc.hash}
                    className="text-[14px] text-[#f4f1ec] hover:text-[#ff7a1a] transition-colors no-underline"
                  >
                    {svc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: CONTACTO */}
          <div className="md:col-span-3 flex flex-col gap-3.5">
            <h4 className="text-[11px] font-mono font-medium tracking-[0.16em] uppercase text-[#5fc9bd]">
              CONTACTO
            </h4>
            <div className="flex flex-col gap-2.5 text-[14px]">
              <a
                href="tel:+258847610803"
                className="text-[#f4f1ec] hover:text-[#ff7a1a] transition-colors no-underline font-mono"
              >
                +258 847 610 803
              </a>
              <a
                href="mailto:nachartechmultiservicoe@gmail.com"
                className="text-[#f4f1ec] hover:text-[#ff7a1a] transition-colors no-underline break-all"
              >
                nachartechmultiservicoe@gmail.com
              </a>
              <a
                href="https://maps.google.com/?q=Nampula,Mozambique"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#f4f1ec] hover:text-[#ff7a1a] transition-colors no-underline"
              >
                <span>Nampula, Moçambique</span>
                <i className="ri-arrow-right-up-line text-[14px]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright on left, Privacy/Terms on right (Screenshot 1) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#9a978f]">
          <p className="m-0">© 2026 NacharTech Multisserviços. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link
              to="/termos"
              className="text-[#9a978f] hover:text-white transition-colors no-underline"
            >
              Privacidade
            </Link>
            <Link
              to="/termos"
              className="text-[#9a978f] hover:text-white transition-colors no-underline"
            >
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
