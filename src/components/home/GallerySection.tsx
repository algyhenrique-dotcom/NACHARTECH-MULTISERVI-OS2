import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accent } from '../common/RichText';

export const GallerySection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPhoto, setSelectedPhoto] = useState<{ title: string; image: string } | null>(null);

  const galleryItems = [
    {
      id: 'cctv',
      title: 'Instalação de CCTV',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'redes',
      title: 'Redes e cablagem',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'reparacao',
      title: 'Reparação de computadores',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'eletrica',
      title: 'Instalações elétricas',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'ac',
      title: 'Ar-condicionado',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <section id="galeria" className="w-full py-8 md:py-12 bg-[#0f1115] text-[#f4f1ec] border-b border-white/[0.08]">
      <div className="w-full px-[clamp(14px,2vw,28px)]">
        {/* Header: Title on left, Subtitle on right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em] leading-tight text-white">
              <Accent text="Trabalhos e | *instalações*." />
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-[12px] md:text-[13px] leading-relaxed text-[#9a978f]">
              Uma amostra do tipo de trabalho que realizamos, do diagnóstico à instalação final.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-4">
          {/* Card 1: Instalação de CCTV */}
          <div
            onClick={() => setSelectedPhoto(galleryItems[0])}
            className="md:col-span-3 md:row-span-2 relative min-h-[260px] md:min-h-[360px] rounded-xl overflow-hidden group bg-[#161920] border border-white/[0.08] cursor-pointer"
          >
            <img
              src={galleryItems[0].image}
              alt={galleryItems[0].title}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 z-10">
              <h3 className="text-[13px] font-medium text-white m-0">
                {galleryItems[0].title}
              </h3>
            </div>
          </div>

          {/* Card 2: Redes e cablagem */}
          <div
            onClick={() => setSelectedPhoto(galleryItems[1])}
            className="md:col-span-5 relative min-h-[160px] md:min-h-[175px] rounded-xl overflow-hidden group bg-[#161920] border border-white/[0.08] cursor-pointer"
          >
            <img
              src={galleryItems[1].image}
              alt={galleryItems[1].title}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 z-10">
              <h3 className="text-[13px] font-medium text-white m-0">
                {galleryItems[1].title}
              </h3>
            </div>
          </div>

          {/* Card 3: Reparação de computadores */}
          <div
            onClick={() => setSelectedPhoto(galleryItems[2])}
            className="md:col-span-4 relative min-h-[160px] md:min-h-[175px] rounded-xl overflow-hidden group bg-[#161920] border border-white/[0.08] cursor-pointer"
          >
            <img
              src={galleryItems[2].image}
              alt={galleryItems[2].title}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 z-10">
              <h3 className="text-[13px] font-medium text-white m-0">
                {galleryItems[2].title}
              </h3>
            </div>
          </div>

          {/* Card 4: Instalações elétricas */}
          <div
            onClick={() => setSelectedPhoto(galleryItems[3])}
            className="md:col-span-4 relative min-h-[160px] md:min-h-[175px] rounded-xl overflow-hidden group bg-[#161920] border border-white/[0.08] cursor-pointer"
          >
            <img
              src={galleryItems[3].image}
              alt={galleryItems[3].title}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 z-10">
              <h3 className="text-[13px] font-medium text-white m-0">
                {galleryItems[3].title}
              </h3>
            </div>
          </div>

          {/* Card 5: Ar-condicionado */}
          <div
            onClick={() => setSelectedPhoto(galleryItems[4])}
            className="md:col-span-5 relative min-h-[160px] md:min-h-[175px] rounded-xl overflow-hidden group bg-[#161920] border border-white/[0.08] cursor-pointer"
          >
            <img
              src={galleryItems[4].image}
              alt={galleryItems[4].title}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-3.5 left-3.5 z-10">
              <h3 className="text-[13px] font-medium text-white m-0">
                {galleryItems[4].title}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-[#ff7a1a] transition-colors"
              aria-label="Fechar"
            >
              <i className="ri-close-line" />
            </button>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h4 className="text-white text-lg font-medium">{selectedPhoto.title}</h4>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
