/**
 * @file LightboxModal.tsx
 * @description Visor fotográfico ampliado. Se abre al hacer clic en cualquier postal o panel de galería,
 * y se cierra mediante clic en el fondo, botón de cierre o tecla Escape.
 * Muestra fotografía completa, título, ubicación real en Bolivia, nota editorial y botón para iniciar
 * la planificación de viaje hacia ese destino.
 */

import React, { useEffect } from 'react';
import { PhotoItem } from '../data/travelData';

interface LightboxModalProps {
  item: PhotoItem | null;
  onClose: () => void;
  onInquireDestination: (territory: PhotoItem['territory'], itemTitle: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  onInquireDestination,
}) => {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-[#0b0c0e]/92 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#111214] border border-[#075056]/60 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre superior derecho */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar visor de fotografía"
          className="absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center bg-[#0b0c0e]/85 text-[#f6f4ef] hover:text-[#ff5b04] border border-[#f6f4ef]/15 rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="text-lg leading-none" aria-hidden="true">✕</span>
        </button>

        {/* Columna de imagen en marco tipo papel */}
        <div className="md:col-span-7 bg-[#075056]/20 p-5 md:p-7 flex items-center justify-center">
          <div className="postcard-frame w-full max-w-md mx-auto">
            <div className="relative overflow-hidden bg-[#18181a] aspect-[4/3]">
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pt-2.5 px-1 flex items-center justify-between text-xs text-[#18181a]/75 font-aux">
              <span className="font-editorial italic text-sm text-[#18181a] truncate">
                {item.title}
              </span>
              <span className="font-code text-[11px] text-[#075056] whitespace-nowrap shrink-0">
                {item.territory.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Columna de ficha editorial y llamada a la acción */}
        <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-[#075056]/35 via-[#111214] to-[#0b0c0e]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#a3a098] mb-3 font-aux">
              <span className="text-[#f6f4ef] font-medium">{item.territory}</span>
              <span aria-hidden="true">·</span>
              <span>{item.tag}</span>
            </div>

            <h2
              id="lightbox-title"
              className="font-editorial text-2xl md:text-3xl text-[#f6f4ef] leading-tight mb-2 headline-balance"
            >
              {item.title}
            </h2>

            <p className="text-xs text-[#a3a098] mb-6 font-aux">
              {item.location}
            </p>

            <div className="h-px w-full bg-[#075056]/50 mb-6" />

            <p className="text-sm md:text-[15px] text-[#f6f4ef]/90 leading-relaxed font-aux mb-6">
              {item.note}
            </p>
          </div>

          <div className="pt-4 border-t border-[#f6f4ef]/10 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onInquireDestination(item.territory, item.title)}
              className="btn-ember w-full py-3 px-5 rounded-sm text-sm font-medium tracking-wide cursor-pointer whitespace-nowrap shrink-0 text-center"
            >
              Consultar ruta en {item.territory}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs text-[#a3a098] hover:text-[#f6f4ef] border border-[#f6f4ef]/15 rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Volver al recorrido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
