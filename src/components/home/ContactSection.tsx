import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accent } from '../common/RichText';
import { useShop } from '../../context/ShopContext';
import { INITIAL_SERVICES } from '../../data/initialData';

export const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const { submitAssistanceRequest, showToast } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Por favor, preencha o seu nome e telefone.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitAssistanceRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service || 'Geral',
        description: formData.description,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      showToast(t('contact.success'));
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        description: '',
      });
    }, 500);
  };

  const handleScrollToForm = () => {
    const formEl = document.getElementById('assistance-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="contacto" className="w-full bg-[#0f1115] text-[#f4f1ec] border-b border-white/[0.08]">
      {/* 1. Cinematic Banner with Stylized "07" */}
      <div className="relative w-full min-h-[260px] md:min-h-[320px] overflow-hidden flex items-center bg-[#090b0e] border-t border-white/10">
        {/* City skyline at dusk background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        {/* Ambient Dark Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090b0e]/95 via-[#090b0e]/75 to-transparent z-[1]" />

        {/* Giant Stylized "07" Watermark */}
        <div
          aria-hidden="true"
          className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 text-[clamp(120px,18vw,260px)] font-bold italic select-none pointer-events-none z-[2]"
          style={{
            fontFamily: 'var(--font-serif)',
            color: '#b45309',
            opacity: 0.8,
            lineHeight: 0.9,
          }}
        >
          07
        </div>

        {/* Content on the left */}
        <div className="relative z-10 w-full px-[clamp(14px,2vw,28px)] py-10 md:py-14 flex flex-col items-start">
          <span className="font-mono text-[10px] md:text-[11px] font-medium tracking-[0.16em] uppercase text-[#5fc9bd] mb-2.5">
            07 — CONTACTO
          </span>

          <h2 className="text-[clamp(20px,2.8vw,32px)] font-semibold tracking-[-0.02em] leading-tight text-white mb-3 max-w-xl">
            <Accent text="Fale com a | *NacharTech*." />
          </h2>

          <p className="text-[13px] md:text-[14px] leading-relaxed text-[#c7c5be] mb-5 max-w-[42ch]">
            Ligue, envie mensagem ou peça assistência técnica. Respondemos o mais rápido possível.
          </p>

          <button
            type="button"
            onClick={handleScrollToForm}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#ff7a1a] text-[#14100b] text-[12px] sm:text-[13px] font-semibold hover:bg-[#ff8a29] transition-colors shadow-sm cursor-pointer border-none"
          >
            <span>Pedir assistência</span>
            <i className="ri-arrow-right-line text-[14px]" />
          </button>
        </div>
      </div>

      {/* 2. Assistance Request Form Section */}
      <div id="assistance-form" className="w-full px-[clamp(14px,2vw,28px)] py-8 md:py-12 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <span className="font-mono text-[10px] md:text-[11px] font-medium tracking-[0.16em] uppercase text-[#5fc9bd] mb-2.5">
              07 — CONTACTO
            </span>

            <h2 className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em] leading-tight text-white mb-3">
              <Accent text="Pedido de | *assistência*." />
            </h2>

            <p className="text-[13px] leading-relaxed text-[#9a978f] mb-6 max-w-[38ch]">
              Diga-nos o que precisa e entraremos em contacto o mais rápido possível.
            </p>

            {/* 3 Contact Info Rows */}
            <div className="flex flex-col gap-3.5 w-full">
              {/* Phone */}
              <a
                href="tel:+258847610803"
                className="flex items-center gap-3 text-inherit no-underline group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1e222b] border border-white/5 flex items-center justify-center text-[#ff7a1a] group-hover:bg-[#ff7a1a] group-hover:text-[#14100b] transition-colors shrink-0">
                  <i className="ri-phone-fill text-[16px]" />
                </div>
                <span className="text-[13px] sm:text-[14px] font-mono tracking-wide text-white">
                  +258 847 610 803
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:nachartechmultiservicoe@gmail.com"
                className="flex items-center gap-3 text-inherit no-underline group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1e222b] border border-white/5 flex items-center justify-center text-[#ff7a1a] group-hover:bg-[#ff7a1a] group-hover:text-[#14100b] transition-colors shrink-0">
                  <i className="ri-mail-fill text-[16px]" />
                </div>
                <span className="text-[13px] sm:text-[14px] text-white break-all">
                  nachartechmultiservicoe@gmail.com
                </span>
              </a>

              {/* Location */}
              <a
                href="https://maps.google.com/?q=Nampula,Mozambique"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-inherit no-underline group"
              >
                <div className="w-10 h-10 rounded-full bg-[#1e222b] border border-white/5 flex items-center justify-center text-[#ff7a1a] group-hover:bg-[#ff7a1a] group-hover:text-[#14100b] transition-colors shrink-0">
                  <i className="ri-map-pin-2-fill text-[16px]" />
                </div>
                <span className="text-[13px] sm:text-[14px] text-white">
                  Nampula, Moçambique
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-[#14171d] border border-white/[0.08] rounded-2xl p-5 md:p-8">
            {submitted ? (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#5fc9bd]/15 text-[#5fc9bd] flex items-center justify-center mb-4">
                  <i className="ri-check-line text-[26px]" />
                </div>
                <h3 className="text-[18px] font-semibold text-white mb-2">
                  Pedido registado com sucesso!
                </h3>
                <p className="text-[13px] text-[#9a978f] max-w-md mb-6">
                  A nossa equipa técnica entrará em contacto muito em breve para esclarecer dúvidas ou agendar a intervenção.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="pill-btn border-white/20 text-white text-[13px]"
                >
                  Enviar outro pedido
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* NOME */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#5fc9bd]">
                    NOME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="O seu nome"
                    className="w-full bg-[#191d24] border border-white/10 rounded-lg px-3.5 py-2.5 text-[13px] text-white focus:border-[#ff7a1a] outline-none"
                  />
                </div>

                {/* TELEFONE & EMAIL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#5fc9bd]">
                      TELEFONE / WHATSAPP
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+258 ..."
                      className="w-full bg-[#191d24] border border-white/10 rounded-lg px-3.5 py-2.5 text-[13px] text-white focus:border-[#ff7a1a] outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#5fc9bd]">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="nome@email.com"
                      className="w-full bg-[#191d24] border border-white/10 rounded-lg px-3.5 py-2.5 text-[13px] text-white focus:border-[#ff7a1a] outline-none"
                    />
                  </div>
                </div>

                {/* SERVIÇO PRETENDIDO */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#5fc9bd]">
                    SERVIÇO PRETENDIDO
                  </label>
                  <select
                    id="service-select"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className="w-full bg-[#191d24] border border-white/10 rounded-lg px-3.5 py-2.5 text-[13px] text-white focus:border-[#ff7a1a] outline-none cursor-pointer"
                  >
                    <option value="">Escolha uma área</option>
                    {INITIAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DESCRIÇÃO DO PROBLEMA */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#5fc9bd]">
                    DESCRIÇÃO DO PROBLEMA
                  </label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descreva o que precisa (máx. 500 caracteres)"
                    className="w-full bg-[#191d24] border border-white/10 rounded-lg px-3.5 py-2.5 text-[13px] text-white focus:border-[#ff7a1a] outline-none resize-none"
                  />
                  <div className="text-right text-[10px] text-[#9a978f] font-mono">
                    {formData.description.length}/500
                  </div>
                </div>

                {/* Enviar pedido Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ff7a1a] text-[#14100b] text-[13px] font-semibold hover:bg-[#ff8a29] transition-colors shadow-sm cursor-pointer border-none"
                  >
                    <span>{isSubmitting ? 'A enviar...' : 'Enviar pedido'}</span>
                    <i className="ri-arrow-right-line text-[15px]" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
