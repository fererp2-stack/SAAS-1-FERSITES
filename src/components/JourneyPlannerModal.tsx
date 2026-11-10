/**
 * @file JourneyPlannerModal.tsx
 * @description Modal de planificación de viaje para Agencia de Viajes Ferpaul (Bolivia).
 * Permite elegir destino (Porongo, Zongo, Yungas, Illimani), temporada, ritmo y duración de 5 a 28 días,
 * además de nombre, correo y notas. Conecta directamente con el número real de WhatsApp (+591 69964875)
 * con el botón "Continuar en WhatsApp", sin afirmar falsamente que el mensaje ya fue recibido.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { BRAND_CONFIG, FEATURED_TERRITORIES } from '../data/travelData';

interface JourneyPlannerModalProps {
  isOpen: boolean;
  initialDestination?: string;
  initialNoteContext?: string;
  onClose: () => void;
}

const SEASONS = [
  'Estación Seca Andina (May – Oct)',
  'Transición Templada (Abr / Nov)',
  'Estación Verde y Bosque (Dic – Mar)',
  'Fechas Flexibles',
] as const;

const PACES = [
  'Contemplativo y Fotográfico',
  'Caminatas y Naturaleza Activa',
  'Expedición y Alta Montaña',
] as const;

export const JourneyPlannerModal: React.FC<JourneyPlannerModalProps> = ({
  isOpen,
  initialDestination = 'Porongo',
  initialNoteContext = '',
  onClose,
}) => {
  const [destination, setDestination] = useState<string>(initialDestination || 'Porongo');
  const [season, setSeason] = useState<string>(SEASONS[0]);
  const [pace, setPace] = useState<string>(PACES[0]);
  const [durationDays, setDurationDays] = useState<number>(8);
  const [travelerName, setTravelerName] = useState<string>('');
  const [travelerEmail, setTravelerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);
  const [showFallbackPanel, setShowFallbackPanel] = useState<boolean>(false);

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
      const found = FEATURED_TERRITORIES.find((t) => t.id === initialDestination);
      if (found) {
        setDurationDays(found.recommendedDays);
      }
    }
  }, [initialDestination]);

  useEffect(() => {
    if (initialNoteContext) {
      setNotes((prev) =>
        prev.includes(initialNoteContext)
          ? prev
          : prev
          ? `${prev} · Interés en postal: ${initialNoteContext}`
          : `Interés especial en: ${initialNoteContext}`
      );
    }
  }, [initialNoteContext]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const whatsappMessage = useMemo(() => {
    const lines = [
      `Hola ${BRAND_CONFIG.fullName}, quisiera planificar un viaje en ${BRAND_CONFIG.country}:`,
      `• Destino principal: ${destination}`,
      `• Duración aproximada: ${durationDays} días`,
      `• Temporada preferida: ${season}`,
      `• Ritmo de viaje: ${pace}`,
      travelerName.trim() ? `• Nombre: ${travelerName.trim()}` : '• Nombre: (Por confirmar)',
      travelerEmail.trim() ? `• Correo: ${travelerEmail.trim()}` : '',
      notes.trim() ? `• Notas de ruta: ${notes.trim()}` : '',
    ].filter(Boolean);
    return lines.join('\n');
  }, [destination, durationDays, season, pace, travelerName, travelerEmail, notes]);

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${BRAND_CONFIG.whatsappRaw}?text=${encodeURIComponent(whatsappMessage)}`;
  }, [whatsappMessage]);

  if (!isOpen) return null;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2600);
    } catch {
      setShowFallbackPanel(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#0b0c0e]/90 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="planner-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#111214] border border-[#075056]/75 shadow-2xl rounded-sm overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con predominio del primer color de la paleta (#075056) */}
        <div className="bg-gradient-to-r from-[#075056] via-[#075056]/85 to-[#233038] px-6 py-5 flex items-center justify-between border-b border-[#f6f4ef]/12">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#f6f4ef]/80 font-aux mb-1">
              <span>{BRAND_CONFIG.fullName}</span>
              <span aria-hidden="true">·</span>
              <span>{BRAND_CONFIG.country}</span>
              <span aria-hidden="true">·</span>
              <span className="font-code">{BRAND_CONFIG.whatsappDisplay}</span>
            </div>
            <h2
              id="planner-modal-title"
              className="font-editorial text-2xl md:text-3xl text-[#f6f4ef] leading-tight"
            >
              Diseña tu Expedición a Medida
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar planificador de viaje"
            className="w-9 h-9 flex items-center justify-center bg-[#0b0c0e]/50 text-[#f6f4ef] hover:text-[#ff5b04] border border-[#f6f4ef]/20 rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Cuerpo del formulario */}
        <div className="p-6 md:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* 1. Selección de Destino en Bolivia */}
          <div>
            <label className="block text-xs text-[#a3a098] mb-2 font-aux">
              1. Territorio o destino principal en Bolivia
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['Porongo', 'Zongo', 'Yungas', 'Illimani', 'Ruta Combinada'] as const).map((item) => {
                const active = destination === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDestination(item)}
                    className={`py-2.5 px-3 text-xs font-medium rounded-sm border transition-all cursor-pointer whitespace-nowrap shrink-0 truncate ${
                      active
                        ? 'bg-[#075056] text-[#f6f4ef] border-[#ff5b04] shadow-sm'
                        : 'bg-[#233038]/55 text-[#a3a098] border-[#f6f4ef]/12 hover:text-[#f6f4ef] hover:border-[#075056]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Duración aproximada (5 a 28 días) */}
          <div className="bg-[#233038]/40 border border-[#075056]/40 p-4 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="duration-range" className="text-xs text-[#a3a098] font-aux">
                2. Duración aproximada del viaje (5 a 28 días)
              </label>
              <span className="font-code text-sm font-semibold text-[#f6f4ef] bg-[#075056] px-2.5 py-0.5 rounded-sm">
                {durationDays} días
              </span>
            </div>
            <input
              id="duration-range"
              type="range"
              min={5}
              max={28}
              step={1}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full accent-[#ff5b04] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-code text-[#a3a098] mt-1">
              <span>5 días</span>
              <span>12 días</span>
              <span>20 días</span>
              <span>28 días</span>
            </div>
          </div>

          {/* 3. Temporada y Ritmo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="planner-season" className="block text-xs text-[#a3a098] mb-1.5 font-aux">
                3. Temporada estimada
              </label>
              <select
                id="planner-season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full bg-[#233038]/75 border border-[#075056]/60 text-[#f6f4ef] text-xs rounded-sm px-3 py-2.5 font-aux"
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s} className="bg-[#111214] text-[#f6f4ef]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="planner-pace" className="block text-xs text-[#a3a098] mb-1.5 font-aux">
                4. Ritmo de la experiencia
              </label>
              <select
                id="planner-pace"
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="w-full bg-[#233038]/75 border border-[#075056]/60 text-[#f6f4ef] text-xs rounded-sm px-3 py-2.5 font-aux"
              >
                {PACES.map((p) => (
                  <option key={p} value={p} className="bg-[#111214] text-[#f6f4ef]">
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Datos del viajero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="traveler-name" className="block text-xs text-[#a3a098] mb-1.5 font-aux">
                Tu nombre
              </label>
              <input
                id="traveler-name"
                type="text"
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                placeholder="Ej. Carolina Mendoza"
                className="w-full bg-[#0b0c0e] border border-[#075056]/60 text-[#f6f4ef] placeholder-[#a3a098]/50 text-sm rounded-sm px-3 py-2 font-aux"
              />
            </div>

            <div>
              <label htmlFor="traveler-email" className="block text-xs text-[#a3a098] mb-1.5 font-aux">
                Tu correo electrónico
              </label>
              <input
                id="traveler-email"
                type="email"
                value={travelerEmail}
                onChange={(e) => setTravelerEmail(e.target.value)}
                placeholder="nombre@correo.com"
                className="w-full bg-[#0b0c0e] border border-[#075056]/60 text-[#f6f4ef] placeholder-[#a3a098]/50 text-sm rounded-sm px-3 py-2 font-aux"
              />
            </div>
          </div>

          {/* 5. Notas */}
          <div>
            <label htmlFor="traveler-notes" className="block text-xs text-[#a3a098] mb-1.5 font-aux">
              Notas de viaje (fechas, número de viajeros, fotografía o intereses)
            </label>
            <textarea
              id="traveler-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cuéntanos si viajas en pareja, grupo privado o si deseas combinar Porongo con Yungas e Illimani..."
              className="w-full bg-[#0b0c0e] border border-[#075056]/60 text-[#f6f4ef] placeholder-[#a3a098]/50 text-sm rounded-sm px-3 py-2 font-aux resize-none"
            />
          </div>

          {/* Acción Real de Contacto: WhatsApp (+591 69964875) */}
          <div className="pt-2 border-t border-[#f6f4ef]/10 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowFallbackPanel(true)}
                className="btn-ember flex-1 py-3 px-5 rounded-sm text-sm font-semibold text-center cursor-pointer whitespace-nowrap shrink-0"
              >
                Continuar en WhatsApp
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="py-3 px-4 text-xs font-medium bg-[#075056]/40 hover:bg-[#075056]/70 text-[#f6f4ef] border border-[#075056] rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedFeedback ? 'Resumen copiado' : 'Copiar resumen'}
              </button>
            </div>

            <p className="text-[11px] text-[#a3a098] leading-relaxed font-aux">
              Se abrirá una conversación en WhatsApp con el número oficial{' '}
              <span className="font-code text-[#f6f4ef]">{BRAND_CONFIG.whatsappDisplay}</span> con
              estos datos prellenados. El mensaje solo se enviará cuando confirmes el envío en tu
              aplicación de WhatsApp.
            </p>

            {showFallbackPanel && (
              <div className="p-3 bg-[#075056]/25 border border-[#075056]/60 rounded-sm text-xs text-[#f6f4ef]/90 space-y-1.5">
                <p className="font-medium text-[#f6f4ef]">
                  Borrador preparado para WhatsApp ({BRAND_CONFIG.whatsappDisplay}):
                </p>
                <pre className="font-code text-[11px] text-[#a3a098] whitespace-pre-wrap bg-[#0b0c0e]/70 p-2.5 rounded-sm">
                  {whatsappMessage}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyPlannerModal;
