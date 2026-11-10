/**
 * @file App.tsx
 * @description Composición principal y coreografía cinematográfica de 5 escenas para
 * Agencia de Viajes Ferpaul (Bolivia), integrando GSAP + ScrollTrigger, las 12 fotografías locales,
 * las 11 postales físicas suspendidas, los 4 paneles verticales de galería, la mochila persistente
 * interpolada mediante curva Catmull-Rom continua, el visor fotográfico y el planificador por WhatsApp.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BRAND_CONFIG,
  FEATURED_TERRITORIES,
  HERO_FEATURE_POSTCARD,
  LOCAL_IMAGES,
  PhotoItem,
  SCENE_FOUR_GALLERY_PANELS,
  SCENE_TWO_POSTCARDS,
  TerritoryOption,
  VALLEY_FEATURE_POSTCARD,
} from './data/travelData';
import { EditorialBackpack } from './components/EditorialBackpack';
import { LightboxModal } from './components/LightboxModal';
import { JourneyPlannerModal } from './components/JourneyPlannerModal';

gsap.registerPlugin(ScrollTrigger);

interface SplineWaypoint {
  /** Valor normalizado global en el espacio de escenas [0 .. 5] */
  u: number;
  xPx: number;
  yPx: number;
  scale: number;
}

/**
 * Interpolación cúbica Catmull-Rom uniforme para un escalar entre p1 y p2 con vecinos p0 y p3.
 */
function catmullRomScalar(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

/**
 * Evalúa la curva Catmull-Rom continua sobre la lista ordenada de puntos de control.
 */
function evaluateBackpackSpline(
  waypoints: SplineWaypoint[],
  u: number
): { x: number; y: number; scale: number; tangentX: number } {
  const clampedU = Math.max(waypoints[0].u, Math.min(waypoints[waypoints.length - 1].u, u));

  let segIdx = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (clampedU >= waypoints[i].u && clampedU <= waypoints[i + 1].u) {
      segIdx = i;
      break;
    }
  }

  const p1 = waypoints[segIdx];
  const p2 = waypoints[Math.min(waypoints.length - 1, segIdx + 1)];
  const p0 = waypoints[Math.max(0, segIdx - 1)];
  const p3 = waypoints[Math.min(waypoints.length - 1, segIdx + 2)];

  const span = Math.max(0.0001, p2.u - p1.u);
  const localT = Math.max(0, Math.min(1, (clampedU - p1.u) / span));

  const x = catmullRomScalar(p0.xPx, p1.xPx, p2.xPx, p3.xPx, localT);
  const y = catmullRomScalar(p0.yPx, p1.yPx, p2.yPx, p3.yPx, localT);
  const scale = catmullRomScalar(p0.scale, p1.scale, p2.scale, p3.scale, localT);

  const deltaT = Math.min(1, localT + 0.04);
  const nextX = catmullRomScalar(p0.xPx, p1.xPx, p2.xPx, p3.xPx, deltaT);
  const tangentX = nextX - x;

  return { x, y, scale, tangentX };
}

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [plannerOpen, setPlannerOpen] = useState<boolean>(false);
  const [plannerTerritory, setPlannerTerritory] = useState<string>('Porongo');
  const [plannerNoteContext, setPlannerNoteContext] = useState<string>('');
  const [selectedClosingTerritory, setSelectedClosingTerritory] =
    useState<TerritoryOption['id']>('Porongo');
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Referencias de secciones y elementos animados
  const headerRef = useRef<HTMLElement | null>(null);
  const backpackWrapperRef = useRef<HTMLDivElement | null>(null);

  // Escena 1 — Portada
  const scene1Ref = useRef<HTMLElement | null>(null);
  const scene1BgRef = useRef<HTMLImageElement | null>(null);
  const scene1TitleLeftRef = useRef<HTMLHeadingElement | null>(null);
  const scene1TitleRightRef = useRef<HTMLHeadingElement | null>(null);
  const scene1CardRef = useRef<HTMLButtonElement | null>(null);
  const scene1BottomBarRef = useRef<HTMLDivElement | null>(null);
  const scene1CurtainRef = useRef<HTMLDivElement | null>(null);

  // Escena 2 — Postales
  const scene2Ref = useRef<HTMLElement | null>(null);
  const scene2HeaderRef = useRef<HTMLDivElement | null>(null);
  const scene2PreviewWrapRef = useRef<HTMLDivElement | null>(null);
  const postcardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Escena 3 — Paisaje Panorámico
  const scene3Ref = useRef<HTMLElement | null>(null);
  const scene3BgRef = useRef<HTMLImageElement | null>(null);
  const scene3TitleRef = useRef<HTMLDivElement | null>(null);
  const scene3CardRef = useRef<HTMLButtonElement | null>(null);
  const scene3CurtainRef = useRef<HTMLDivElement | null>(null);

  // Escena 4 — Galería
  const scene4Ref = useRef<HTMLElement | null>(null);
  const panelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const panelCaptionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Escena 5 — Cierre
  const scene5Ref = useRef<HTMLElement | null>(null);
  const scene5BgRef = useRef<HTMLImageElement | null>(null);
  const scene5TitleRef = useRef<HTMLDivElement | null>(null);
  const scene5CardRef = useRef<HTMLDivElement | null>(null);
  const scene5PinRef = useRef<SVGSVGElement | null>(null);

  // Detectar prefers-reduced-motion y viewport móvil
  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqMobile = window.matchMedia('(max-width: 767px)');

    const updateFlags = () => {
      setReducedMotion(mqMotion.matches);
      setIsMobileView(mqMobile.matches);
    };
    updateFlags();

    mqMotion.addEventListener('change', updateFlags);
    mqMobile.addEventListener('change', updateFlags);
    return () => {
      mqMotion.removeEventListener('change', updateFlags);
      mqMobile.removeEventListener('change', updateFlags);
    };
  }, []);

  // Precarga de las 12 fotografías locales para evitar parpadeos entre escenas
  useEffect(() => {
    Object.values(LOCAL_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Coreografía GSAP + ScrollTrigger para las 5 escenas y la mochila persistente
  useLayoutEffect(() => {
    if (reducedMotion) {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      return;
    }

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Entrada inicial escalonada en Portada (duración ~1.15s, desplazamiento ~24px)
      gsap.fromTo(
        [
          headerRef.current,
          scene1TitleLeftRef.current,
          scene1CardRef.current,
          scene1TitleRightRef.current,
          scene1BottomBarRef.current,
        ],
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.12,
          ease: 'power3.out',
          overwrite: 'auto',
        }
      );

      // ========================================================================
      // ESCENA 1 — PORTADA (100vh fijada durante ~135vh adicionales, scrub 0.65)
      // ========================================================================
      const tlScene1 = gsap.timeline({
        scrollTrigger: {
          id: 'st-scene1',
          trigger: scene1Ref.current,
          start: 'top top',
          end: '+=135%',
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
        },
      });

      // Fondo: escala 1 -> 1.16 y desplazamiento vertical 0 -> -6%
      tlScene1.fromTo(
        scene1BgRef.current,
        { scale: 1, yPercent: 0 },
        { scale: 1.16, yPercent: -6, ease: 'none', duration: 1 },
        0
      );

      // Titular izquierdo: viaja a la izquierda ~24% y arriba ~42%, baja opacidad
      tlScene1.fromTo(
        scene1TitleLeftRef.current,
        { xPercent: 0, yPercent: 0, opacity: 1 },
        { xPercent: -24, yPercent: -42, opacity: 0.08, ease: 'power1.inOut', duration: 0.85 },
        0
      );

      // Titular derecho: viaja a la derecha ~24% y abajo ~45%, baja opacidad
      tlScene1.fromTo(
        scene1TitleRightRef.current,
        { xPercent: 0, yPercent: 0, opacity: 1 },
        { xPercent: 24, yPercent: 45, opacity: 0.08, ease: 'power1.inOut', duration: 0.85 },
        0
      );

      // Tarjeta central: escala 1 -> 1.38 en escritorio (1.22 en móvil), asciende ~18% y rota -3.5° -> +2.5°
      tlScene1.fromTo(
        scene1CardRef.current,
        { scale: 1, yPercent: 0, rotation: -3.5, opacity: 1 },
        {
          scale: isMobile ? 1.22 : 1.38,
          yPercent: -18,
          rotation: 2.5,
          ease: 'power1.inOut',
          duration: 0.76,
        },
        0
      );

      // Cerca de la salida, la tarjeta se desvanece y la cortina carbón/teal cubre la portada
      tlScene1.to(
        scene1CardRef.current,
        { opacity: 0, scale: isMobile ? 1.28 : 1.46, duration: 0.24, ease: 'power2.in' },
        0.76
      );

      tlScene1.fromTo(
        scene1BottomBarRef.current,
        { opacity: 1, y: 0 },
        { opacity: 0, y: 16, duration: 0.4, ease: 'power1.in' },
        0.15
      );

      tlScene1.fromTo(
        scene1CurtainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: 'power2.inOut' },
        0.72
      );

      // ========================================================================
      // ESCENA 2 — POSTALES (100vh fijada ~230vh escritorio / ~185vh móvil, scrub 0.75)
      // ========================================================================
      const tlScene2 = gsap.timeline({
        scrollTrigger: {
          id: 'st-scene2',
          trigger: scene2Ref.current,
          start: 'top top',
          end: isMobile ? '+=185%' : '+=230%',
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
        },
      });

      // El título entra primero: escala 0.92 -> 1, ascenso 28px -> 0 y opacidad 0 -> 1
      tlScene2.fromTo(
        scene2HeaderRef.current,
        { scale: 0.92, y: 28, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.18, ease: 'power2.out' },
        0
      );

      // Las postales llegan escalonadamente desde bordes diferentes
      SCENE_TWO_POSTCARDS.forEach((pc, idx) => {
        const el = postcardRefs.current[idx];
        if (!el) return;
        if (isMobile && !pc.mobile) return;

        const baseRotate = isMobile && pc.mobile ? pc.mobile.rotate : pc.desktop.rotate;
        const enterStart = 0.06 + pc.motion.staggerOrder * 0.022;

        // Fase 1: Entrada desde los bordes con escala 0.82 y rotación marcada
        tlScene2.fromTo(
          el,
          {
            x: isMobile ? pc.motion.entryX * 0.65 : pc.motion.entryX,
            y: isMobile ? pc.motion.entryY * 0.65 : pc.motion.entryY,
            scale: 0.82,
            rotation: baseRotate + pc.motion.entryRotate,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: baseRotate,
            opacity: 1,
            duration: 0.24,
            ease: 'power2.out',
          },
          enterStart
        );

        // Fase 2: Deriva en parallax con velocidades distintas
        tlScene2.to(
          el,
          {
            x: isMobile ? pc.motion.driftX * 0.6 : pc.motion.driftX,
            y: isMobile ? pc.motion.driftY * 0.6 : pc.motion.driftY,
            scale: pc.motion.driftScale,
            rotation: baseRotate * 0.75,
            duration: 0.34,
            ease: 'sine.inOut',
          },
          0.36
        );

        // Fase 3: En el último tramo se separan hacia fuera y pierden opacidad
        tlScene2.to(
          el,
          {
            x: isMobile ? pc.motion.exitX * 0.65 : pc.motion.exitX,
            y: isMobile ? pc.motion.exitY * 0.65 : pc.motion.exitY,
            scale: 1.12,
            opacity: 0,
            duration: 0.26,
            ease: 'power2.in',
          },
          0.72
        );
      });

      // El titular central se desvanece suavemente al abrir paso a la vista previa del valle
      tlScene2.to(
        scene2HeaderRef.current,
        { opacity: 0, y: -24, scale: 0.96, duration: 0.2, ease: 'power2.in' },
        0.74
      );

      // Vista previa de panorama-valley.png aparece y crece para unir Escena 2 con Escena 3
      tlScene2.fromTo(
        scene2PreviewWrapRef.current,
        { opacity: 0, scale: 0.84 },
        { opacity: 1, scale: 1.04, duration: 0.28, ease: 'power2.inOut' },
        0.72
      );

      // ========================================================================
      // ESCENA 3 — PAISAJE PANORÁMICO (100vh fijada ~155vh adicionales, scrub 0.65)
      // ========================================================================
      const tlScene3 = gsap.timeline({
        scrollTrigger: {
          id: 'st-scene3',
          trigger: scene3Ref.current,
          start: 'top top',
          end: '+=155%',
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
        },
      });

      // Paisaje: escala 1.14 -> 1 y desplazamiento vertical -4% -> +4%
      tlScene3.fromTo(
        scene3BgRef.current,
        { scale: 1.14, yPercent: -4 },
        { scale: 1, yPercent: 4, duration: 1, ease: 'none' },
        0
      );

      // Titular: entra desde 36px abajo con opacidad 0, permanece legible y sube ligeramente al salir
      tlScene3.fromTo(
        scene3TitleRef.current,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.24, ease: 'power2.out' },
        0.04
      );
      tlScene3.to(
        scene3TitleRef.current,
        { y: -22, opacity: 0.15, duration: 0.24, ease: 'power2.in' },
        0.76
      );

      // Tarjeta postcard-coast.png: entra desde 80px abajo, escala 0.9 -> 1, rotación -7.5° -> -2.5°
      tlScene3.fromTo(
        scene3CardRef.current,
        { y: 80, scale: 0.9, rotation: -7.5, opacity: 0 },
        { y: 0, scale: 1, rotation: -4.2, opacity: 1, duration: 0.28, ease: 'power2.out' },
        0.1
      );
      // Deriva suavemente ~18px hacia arriba y termina en -2.5 grados
      tlScene3.to(
        scene3CardRef.current,
        { y: -18, rotation: -2.5, duration: 0.42, ease: 'sine.inOut' },
        0.38
      );
      tlScene3.to(
        scene3CardRef.current,
        { y: -38, opacity: 0, duration: 0.2, ease: 'power2.in' },
        0.8
      );

      // Cortina carbón/teal al salir para crear continuidad con la galería
      tlScene3.fromTo(
        scene3CurtainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.24, ease: 'power2.inOut' },
        0.76
      );

      // ========================================================================
      // ESCENA 4 — GALERÍA (100vh fijada ~280vh adicionales, scrub 0.65)
      // ========================================================================
      const tlScene4 = gsap.timeline({
        scrollTrigger: {
          id: 'st-scene4',
          trigger: scene4Ref.current,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            let active = 0;
            if (p >= 0.68) active = 3;
            else if (p >= 0.38) active = 2;
            else if (p >= 0.08) active = 1;
            setActiveGalleryIdx((prev) => (prev !== active ? active : prev));
          },
        },
      });

      // Estado inicial de los 4 paneles: Panel 1 protagonista (escala 1.03, opacidad 1), demás (0.92, 0.46)
      SCENE_FOUR_GALLERY_PANELS.forEach((panel, idx) => {
        const panelEl = panelRefs.current[idx];
        const imgEl = panelImgRefs.current[idx];
        const capEl = panelCaptionRefs.current[idx];
        if (!panelEl || !imgEl || !capEl) return;

        gsap.set(panelEl, {
          scale: idx === 0 ? 1.03 : 0.92,
          opacity: idx === 0 ? 1 : 0.46,
        });
        gsap.set(capEl, {
          opacity: idx === 0 ? 1 : 0.55,
          y: idx === 0 ? 0 : 6,
        });

        // Parallax interno continuo durante todo el recorrido (escala 1.22 -> 1.06, deriva X y Y)
        tlScene4.fromTo(
          imgEl,
          {
            scale: 1.22,
            xPercent: panel.parallaxXFrom,
            yPercent: panel.parallaxYFrom,
          },
          {
            scale: 1.06,
            xPercent: panel.parallaxXTo,
            yPercent: panel.parallaxYTo,
            duration: 1,
            ease: 'none',
          },
          0
        );
      });

      // Transferencias de protagonismo 1->2 (0.08), 2->3 (0.38) y 3->4 (0.68), cada una dura ~0.24
      const transitions = [
        { from: 0, to: 1, start: 0.08 },
        { from: 1, to: 2, start: 0.38 },
        { from: 2, to: 3, start: 0.68 },
      ];

      transitions.forEach(({ from, to, start }) => {
        const fromPanel = panelRefs.current[from];
        const toPanel = panelRefs.current[to];
        const fromCap = panelCaptionRefs.current[from];
        const toCap = panelCaptionRefs.current[to];

        if (fromPanel && toPanel) {
          tlScene4.to(
            fromPanel,
            { scale: 0.92, opacity: 0.46, duration: 0.24, ease: 'power2.inOut' },
            start
          );
          tlScene4.to(
            toPanel,
            { scale: 1.03, opacity: 1, duration: 0.24, ease: 'power2.inOut' },
            start
          );
        }
        if (fromCap && toCap) {
          tlScene4.to(
            fromCap,
            { opacity: 0.55, y: 6, duration: 0.24, ease: 'power2.inOut' },
            start
          );
          tlScene4.to(
            toCap,
            { opacity: 1, y: 0, duration: 0.24, ease: 'power2.inOut' },
            start
          );
        }
      });

      // ========================================================================
      // ESCENA 5 — CIERRE (Parallax suave de entrada, tarjeta de papel y chincheta)
      // ========================================================================
      const tlScene5 = gsap.timeline({
        scrollTrigger: {
          id: 'st-scene5',
          trigger: scene5Ref.current,
          start: 'top 85%',
          end: 'bottom bottom',
          scrub: 0.65,
        },
      });

      // Paisaje: escala 1.14 -> 1
      tlScene5.fromTo(
        scene5BgRef.current,
        { scale: 1.14 },
        { scale: 1, duration: 1, ease: 'power1.out' },
        0
      );

      // Titular desde 32px abajo
      tlScene5.fromTo(
        scene5TitleRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
        0.08
      );

      // Tarjeta de papel desde 56px abajo con leve rotación
      tlScene5.fromTo(
        scene5CardRef.current,
        { y: 56, rotation: -1.8, opacity: 0 },
        { y: 0, rotation: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
        0.18
      );

      // Chincheta roja cae suavemente al final
      tlScene5.fromTo(
        scene5PinRef.current,
        { y: -28, scale: 1.25, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' },
        0.52
      );

      // ========================================================================
      // MOCHILA VIAJERA PERSISTENTE (Curva Catmull-Rom continua + suavizado 0.42s)
      // ========================================================================
      if (backpackWrapperRef.current) {
        const quickX = gsap.quickTo(backpackWrapperRef.current, 'x', {
          duration: 0.42,
          ease: 'power3.out',
        });
        const quickY = gsap.quickTo(backpackWrapperRef.current, 'y', {
          duration: 0.42,
          ease: 'power3.out',
        });
        const quickScale = gsap.quickTo(backpackWrapperRef.current, 'scale', {
          duration: 0.42,
          ease: 'power3.out',
        });
        const quickRot = gsap.quickTo(backpackWrapperRef.current, 'rotation', {
          duration: 0.42,
          ease: 'power3.out',
        });

        const buildWaypoints = (): SplineWaypoint[] => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const mobile = vw < 768;

          if (mobile) {
            // Trayectoria móvil propia que pasa por zonas libres sin tapar titulares ni botones
            return [
              { u: 0.0, xPx: vw * 0.82, yPx: vh * 0.82, scale: 0.92 },
              { u: 0.5, xPx: vw * 0.78, yPx: vh * 0.76, scale: 0.96 },
              { u: 1.0, xPx: vw * 0.18, yPx: vh * 0.52, scale: 0.9 },
              { u: 1.25, xPx: vw * 0.16, yPx: vh * 0.24, scale: 0.86 },
              { u: 1.6, xPx: vw * 0.82, yPx: vh * 0.24, scale: 0.9 },
              { u: 1.95, xPx: vw * 0.82, yPx: vh * 0.76, scale: 0.95 },
              { u: 2.2, xPx: vw * 0.78, yPx: vh * 0.82, scale: 0.98 },
              { u: 2.55, xPx: vw * 0.5, yPx: vh * 0.88, scale: 1.0 },
              { u: 2.95, xPx: vw * 0.2, yPx: vh * 0.8, scale: 0.94 },
              { u: 3.12, xPx: vw * 0.24, yPx: vh * 0.48, scale: 0.88 },
              { u: 3.38, xPx: vw * 0.74, yPx: vh * 0.48, scale: 0.9 },
              { u: 3.68, xPx: vw * 0.26, yPx: vh * 0.84, scale: 0.9 },
              { u: 3.92, xPx: vw * 0.76, yPx: vh * 0.84, scale: 0.92 },
              { u: 4.85, xPx: vw * 0.84, yPx: vh * 0.78, scale: 0.94 },
            ];
          }

          // Guía exacta de trayectoria de escritorio (Sección 10)
          const closingX = Math.min(vw - 64, vw * 0.5 + 308);
          return [
            { u: 0.0, xPx: vw * 0.5, yPx: vh * 0.81, scale: 0.95 }, // Inicio portada
            { u: 0.5, xPx: vw * 0.36, yPx: vh * 0.74, scale: 1.02 }, // Mitad portada
            { u: 1.0, xPx: vw * 0.27, yPx: vh * 0.5, scale: 0.92 }, // Transición a postales
            { u: 1.2, xPx: vw * 0.29, yPx: vh * 0.29, scale: 0.88 }, // Entrada postales
            { u: 1.55, xPx: vw * 0.68, yPx: vh * 0.25, scale: 0.94 }, // Mitad postales
            { u: 1.95, xPx: vw * 0.71, yPx: vh * 0.68, scale: 1.02 }, // Salida postales
            { u: 2.18, xPx: vw * 0.72, yPx: vh * 0.79, scale: 1.06 }, // Entrada valle
            { u: 2.55, xPx: vw * 0.46, yPx: vh * 0.86, scale: 1.1 }, // Mitad valle
            { u: 2.95, xPx: vw * 0.22, yPx: vh * 0.76, scale: 1.02 }, // Salida valle
            { u: 3.1, xPx: vw * 0.18, yPx: vh * 0.63, scale: 0.92 }, // Primer panel
            { u: 3.36, xPx: vw * 0.39, yPx: vh * 0.6, scale: 0.96 }, // Segundo panel
            { u: 3.64, xPx: vw * 0.61, yPx: vh * 0.62, scale: 0.94 }, // Tercer panel
            { u: 3.9, xPx: vw * 0.82, yPx: vh * 0.64, scale: 0.97 }, // Cuarto panel
            { u: 4.85, xPx: closingX, yPx: vh * 0.72, scale: 1.0 }, // Cierre junto a tarjeta
          ];
        };

        let cachedWaypoints = buildWaypoints();

        // Calcula el progreso continuo u in [0 .. 4.85] usando los puntos reales de ScrollTrigger
        const computeContinuousSceneU = (): number => {
          const scrollY = window.scrollY;
          const st1 = ScrollTrigger.getById('st-scene1');
          const st2 = ScrollTrigger.getById('st-scene2');
          const st3 = ScrollTrigger.getById('st-scene3');
          const st4 = ScrollTrigger.getById('st-scene4');
          const st5 = ScrollTrigger.getById('st-scene5');

          if (!st1 || !st2 || !st3 || !st4) return 0;

          if (scrollY <= st1.end) {
            const p = Math.max(0, Math.min(1, (scrollY - st1.start) / Math.max(1, st1.end - st1.start)));
            return p; // 0.0 -> 1.0
          }
          if (scrollY <= st2.end) {
            const p = Math.max(0, Math.min(1, (scrollY - st1.end) / Math.max(1, st2.end - st1.end)));
            return 1.0 + p; // 1.0 -> 2.0
          }
          if (scrollY <= st3.end) {
            const p = Math.max(0, Math.min(1, (scrollY - st2.end) / Math.max(1, st3.end - st2.end)));
            return 2.0 + p; // 2.0 -> 3.0
          }
          if (scrollY <= st4.end) {
            const p = Math.max(0, Math.min(1, (scrollY - st3.end) / Math.max(1, st4.end - st3.end)));
            return 3.0 + p; // 3.0 -> 4.0
          }

          const endScroll = st5 ? st5.end : document.documentElement.scrollHeight - window.innerHeight;
          const p5 = Math.max(0, Math.min(1, (scrollY - st4.end) / Math.max(1, endScroll - st4.end)));
          // Desacelera suavemente al llegar al cierre
          const easedP5 = 1 - Math.pow(1 - p5, 2);
          return 4.0 + easedP5 * 0.85;
        };

        const updateBackpackPosition = (immediate = false) => {
          const u = computeContinuousSceneU();
          const { x, y, scale, tangentX } = evaluateBackpackSpline(cachedWaypoints, u);
          // Rotación moderada entre -7° y +7°
          const rot = Math.max(-7, Math.min(7, tangentX * 0.28));

          if (immediate && backpackWrapperRef.current) {
            gsap.set(backpackWrapperRef.current, { x, y, scale, rotation: rot });
          } else {
            quickX(x);
            quickY(y);
            quickScale(scale);
            quickRot(rot);
          }
        };

        updateBackpackPosition(true);

        const handleScroll = () => updateBackpackPosition(false);
        const handleResize = () => {
          cachedWaypoints = buildWaypoints();
          updateBackpackPosition(true);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        ScrollTrigger.addEventListener('refresh', handleResize);

        return () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
          ScrollTrigger.removeEventListener('refresh', handleResize);
        };
      }
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  // Navegación suave hacia las secciones reales teniendo en cuenta los pins de ScrollTrigger
  const scrollToSection = (sectionId: string) => {
    const triggerMap: Record<string, string> = {
      portada: 'st-scene1',
      destinos: 'st-scene2',
      paisaje: 'st-scene3',
      galeria: 'st-scene4',
      cierre: 'st-scene5',
    };

    const stId = triggerMap[sectionId];
    const st = stId ? ScrollTrigger.getById(stId) : null;
    if (st) {
      window.scrollTo({ top: st.start + 4, behavior: reducedMotion ? 'auto' : 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleOpenPlannerForTerritory = (territory: string, noteContext = '') => {
    setSelectedPhoto(null);
    setPlannerTerritory(territory);
    setPlannerNoteContext(noteContext);
    setPlannerOpen(true);
  };

  const activePanelData = SCENE_FOUR_GALLERY_PANELS[activeGalleryIdx] || SCENE_FOUR_GALLERY_PANELS[0];

  return (
    <div className="relative min-h-screen w-full bg-[#0b0c0e] text-[#f6f4ef] selection:bg-[#ff5b04] selection:text-white">
      {/* =====================================================================
          4. NAVEGACIÓN FIJA (Contrato de 3 zonas con predominio Teal y CTA Naranja)
         ===================================================================== */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40 px-5 md:px-12 py-4 flex items-center justify-between gap-4 md:gap-8 bg-gradient-to-b from-[#075056]/90 via-[#0b0c0e]/55 to-transparent"
      >
        {/* Zona 1: Nombre de la marca en texto serif pequeño con espaciado */}
        <a
          href="#portada"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('portada');
          }}
          className="font-editorial text-sm md:text-base tracking-[0.24em] text-[#f6f4ef] hover:text-[#ff5b04] transition-colors whitespace-nowrap shrink-0"
        >
          {BRAND_CONFIG.shortName}
        </a>

        {/* Zona 2: Cuatro enlaces de sección (simplificados en móvil) */}
        <nav
          aria-label="Navegación principal"
          className="flex items-center gap-3 sm:gap-5 md:gap-8 text-xs md:text-sm font-aux text-[#f6f4ef]/85"
        >
          {BRAND_CONFIG.navigation.map((navItem) => (
            <a
              key={navItem.id}
              href={navItem.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(navItem.id);
              }}
              className="hover:text-[#f6f4ef] underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0"
            >
              {navItem.label}
            </a>
          ))}
        </nav>

        {/* Zona 3: Botón principal naranja (#ff5b04) para abrir el planificador */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => handleOpenPlannerForTerritory(selectedClosingTerritory)}
            className="btn-ember px-3.5 md:px-5 py-2 text-xs font-medium rounded-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            {BRAND_CONFIG.ctaLabel}
          </button>
        </div>
      </header>

      {/* =====================================================================
          10. MOCHILA VIAJERA PERSISTENTE (Única instancia fija superpuesta)
         ===================================================================== */}
      {!reducedMotion && (
        <div
          ref={backpackWrapperRef}
          className="fixed top-0 left-0 z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-[48px] h-[56px] md:w-[74px] md:h-[86px] will-change-transform"
          aria-hidden="true"
        >
          <EditorialBackpack className="w-full h-full" />
        </div>
      )}

      <main>
        {/* =====================================================================
            5. ESCENA 1 — PORTADA (100vh fijada ~135vh adicionales)
           ===================================================================== */}
        <section
          id="portada"
          ref={scene1Ref}
          aria-label="Portada Agencia de Viajes Ferpaul Bolivia"
          className="relative w-full h-screen overflow-hidden bg-[#111214] flex flex-col justify-between px-5 md:px-12 pt-24 pb-8"
        >
          {/* Imagen hero-traveler.png manteniendo a la viajera en el quinto izquierdo */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              ref={scene1BgRef}
              src={LOCAL_IMAGES.heroTraveler}
              alt="Viajera contemplando un valle verde profundo entre montañas con neblina"
              className="w-full h-full object-cover object-[18%_center] will-change-transform"
            />
            {/* Oscurecida leve con matiz del primer color Teal (#075056) y degradado arriba/abajo */}
            <div className="absolute inset-0 bg-[#075056]/28 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c0e]/80 via-[#111214]/25 to-[#0b0c0e]/92" />
          </div>

          {/* Espaciador superior */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#f6f4ef]/80 font-aux">
            <span>{BRAND_CONFIG.fullName}</span>
            <span className="hidden sm:inline font-code text-[#f6f4ef]/75">
              BOLIVIA · PORONGO · ZONGO · YUNGAS · ILLIMANI
            </span>
          </div>

          {/* Composición central: Titular izquierdo + Postal física + Titular derecho itálico */}
          <div className="relative z-10 my-auto w-full max-w-[1344px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-4 md:gap-6">
            <div className="lg:col-span-5 text-left">
              <p className="text-xs text-[#f6f4ef]/80 mb-2 font-aux">
                Expediciones de Autor en Bolivia
              </p>
              <h1
                ref={scene1TitleLeftRef}
                className="font-editorial text-[clamp(2.65rem,5.2vw,5.75rem)] leading-[0.98] tracking-tight text-[#f6f4ef] headline-balance will-change-transform"
              >
                Más Allá del Mapa
              </h1>
            </div>

            {/* Tarjeta fotográfica física entre ambos titulares usando postcard-lake.png */}
            <div className="lg:col-span-2 flex justify-center my-1 lg:my-0">
              <button
                ref={scene1CardRef}
                type="button"
                onClick={() => setSelectedPhoto(HERO_FEATURE_POSTCARD)}
                style={{ transform: 'rotate(-3.5deg)' }}
                aria-label={`Ver postal ampliada: ${HERO_FEATURE_POSTCARD.title}`}
                className="postcard-frame w-[210px] md:w-[320px] shrink-0 text-left cursor-pointer group"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#18181a]">
                  <img
                    src={HERO_FEATURE_POSTCARD.src}
                    alt={HERO_FEATURE_POSTCARD.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="pt-2.5 px-1 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-editorial italic text-sm md:text-base text-[#18181a] leading-snug">
                      {HERO_FEATURE_POSTCARD.title}
                    </p>
                    <p className="text-[11px] text-[#18181a]/70 font-aux">
                      {HERO_FEATURE_POSTCARD.location}
                    </p>
                  </div>
                  <span className="font-code text-[10px] text-[#075056] font-semibold whitespace-nowrap shrink-0">
                    VER POSTAL
                  </span>
                </div>
              </button>
            </div>

            <div className="lg:col-span-5 text-right">
              <h2
                ref={scene1TitleRightRef}
                className="font-editorial italic text-[clamp(2.65rem,5.2vw,5.75rem)] leading-[0.98] tracking-tight text-[#f6f4ef] headline-balance will-change-transform"
              >
                Hacia el Instante
              </h2>
              <p className="text-xs md:text-sm text-[#f6f4ef]/80 mt-2 font-aux">
                Porongo · Valle de Zongo · Los Yungas · Macizo del Illimani
              </p>
            </div>
          </div>

          {/* Microtexto inferior y pista "Desliza para recorrer" */}
          <div
            ref={scene1BottomBarRef}
            className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#a3a098] font-aux border-t border-[#f6f4ef]/15 pt-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#f6f4ef]">Rutas privadas y grupos reducidos</span>
              <span aria-hidden="true">·</span>
              <span className="font-code">WhatsApp {BRAND_CONFIG.whatsappDisplay}</span>
            </div>
            <div className="flex items-center gap-2 text-[#f6f4ef]">
              <span>Desliza para recorrer</span>
              <span aria-hidden="true" className="text-[#ff5b04]">↓</span>
            </div>
          </div>

          {/* Cortina carbón/teal para enlazar con la Escena 2 */}
          <div
            ref={scene1CurtainRef}
            className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-[#075056]/95 to-[#111214] opacity-0"
          />
        </section>

        {/* =====================================================================
            6. ESCENA 2 — POSTALES (100vh con 11 postales suspendidas y vista previa del valle)
           ===================================================================== */}
        <section
          id="destinos"
          ref={scene2Ref}
          aria-label="Once postales de destinos en Bolivia"
          className="relative w-full h-screen overflow-hidden bg-[#111214] flex items-center justify-center px-5 md:px-12"
        >
          {/* Viñeta radial con el primer color Teal (#075056) predominante */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(7, 80, 86, 0.58) 0%, rgba(35, 48, 56, 0.42) 48%, rgba(11, 12, 14, 0.96) 100%)',
            }}
          />

          {/* Capa de vista previa de panorama-valley.png que crece al final para unir con Escena 3 */}
          <div
            ref={scene2PreviewWrapRef}
            className="absolute inset-0 z-10 pointer-events-none opacity-0 overflow-hidden"
          >
            <img
              src={LOCAL_IMAGES.panoramaValley}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#075056]/35 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[#0b0c0e]/45" />
          </div>

          {/* ONCE postales físicas suspendidas (6 en móvil con coordenadas móviles propias) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {SCENE_TWO_POSTCARDS.map((pc, idx) => {
              const hiddenOnMobile = isMobileView && !pc.mobile;
              if (hiddenOnMobile) return null;

              const pos = isMobileView && pc.mobile ? pc.mobile : pc.desktop;

              return (
                <button
                  key={pc.id}
                  ref={(el) => {
                    postcardRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => setSelectedPhoto(pc)}
                  aria-label={`Abrir postal ${pc.title} — ${pc.location}`}
                  style={{
                    top: `${pos.top}%`,
                    left: `${pos.left}%`,
                    width: `${pos.width}px`,
                    zIndex: pos.zIndex,
                    transform: `rotate(${pos.rotate}deg)`,
                  }}
                  className={`absolute pointer-events-auto text-left cursor-pointer postcard-frame ${
                    pc.paperTone === 'warm' ? 'postcard-frame-warm' : ''
                  }`}
                >
                  <div
                    className="relative w-full overflow-hidden bg-[#18181a]"
                    style={{ aspectRatio: pc.crop?.aspectRatio || '4 / 3' }}
                  >
                    <img
                      src={pc.src}
                      alt={pc.alt}
                      style={
                        pc.crop
                          ? {
                              objectPosition: pc.crop.objectPosition,
                              transform: `scale(${pc.crop.scale})`,
                            }
                          : undefined
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-2 px-0.5">
                    <p className="font-editorial text-xs md:text-sm text-[#18181a] leading-tight truncate">
                      {pc.title}
                    </p>
                    <div className="flex items-center justify-between gap-1 mt-0.5 text-[10px] text-[#18181a]/70 font-aux">
                      <span className="truncate">{pc.tag}</span>
                      <span className="font-code text-[#075056] font-semibold shrink-0">+</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Titular central protegido con sombra radial oscura para máxima legibilidad */}
          <div
            ref={scene2HeaderRef}
            className="relative z-30 max-w-2xl mx-auto text-center px-6 py-8 rounded-sm pointer-events-none"
            style={{
              background:
                'radial-gradient(closest-side, rgba(11, 12, 14, 0.88) 0%, rgba(7, 80, 86, 0.55) 68%, transparent 100%)',
            }}
          >
            <div className="flex items-center justify-center gap-2 text-xs text-[#f6f4ef]/85 mb-3 font-aux">
              <span>Bitácora de Campo</span>
              <span aria-hidden="true">·</span>
              <span>Cuatro Regiones de Bolivia</span>
            </div>
            <h2 className="font-editorial text-[clamp(2.35rem,4.4vw,4.5rem)] leading-[1.04] text-[#f6f4ef] mb-4 headline-balance">
              Destinos que Merecen
              <br />
              <span className="italic">Ser Caminados</span>
            </h2>
            <p className="text-xs md:text-sm text-[#f6f4ef]/85 max-w-md mx-auto leading-relaxed font-aux">
              Porongo, el Valle de Zongo, Los Yungas y el Illimani reunidos en once postales de
              viaje. Pulsa sobre cualquier postal para examinar su historia.
            </p>
          </div>
        </section>

        {/* =====================================================================
            7. ESCENA 3 — PAISAJE PANORÁMICO (100vh con panorama-valley.png y tarjeta física)
           ===================================================================== */}
        <section
          id="paisaje"
          ref={scene3Ref}
          aria-label="Paisaje panorámico de valle andino"
          className="relative w-full h-screen overflow-hidden bg-[#111214] flex flex-col items-center justify-center px-5 md:px-12"
        >
          {/* Fotografía panorama-valley.png a pantalla completa */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              ref={scene3BgRef}
              src={LOCAL_IMAGES.panoramaValley}
              alt="Valle verde serpenteado por ríos glaciares con cumbres nevadas en el horizonte"
              className="w-full h-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-[#075056]/25 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c0e]/75 via-[#111214]/40 to-[#0b0c0e]/85" />
          </div>

          {/* Contenido central: Titular blanco + pequeña tarjeta física con postcard-coast.png */}
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            <div ref={scene3TitleRef} className="mb-8">
              <p className="text-xs text-[#f6f4ef]/85 mb-2 font-aux">
                Inmersión Territorial · {BRAND_CONFIG.fullName}
              </p>
              <h2 className="font-editorial text-[clamp(2.35rem,4.5vw,4.65rem)] leading-[1.05] text-[#f6f4ef] max-w-3xl mx-auto headline-balance">
                Ve a un Lugar que Se Quede Contigo
              </h2>
            </div>

            {/* Pequeña tarjeta física hecha con postcard-coast.png */}
            <button
              ref={scene3CardRef}
              type="button"
              onClick={() => setSelectedPhoto(VALLEY_FEATURE_POSTCARD)}
              style={{ transform: 'rotate(-4.5deg)' }}
              aria-label={`Examinar postal ${VALLEY_FEATURE_POSTCARD.title}`}
              className="postcard-frame postcard-frame-warm w-[220px] md:w-[265px] text-left cursor-pointer group"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#18181a]">
                <img
                  src={VALLEY_FEATURE_POSTCARD.src}
                  alt={VALLEY_FEATURE_POSTCARD.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="pt-2.5 px-1 flex items-center justify-between gap-2">
                <div>
                  <p className="font-editorial italic text-sm text-[#18181a] leading-tight">
                    {VALLEY_FEATURE_POSTCARD.title}
                  </p>
                  <p className="text-[11px] text-[#18181a]/75 font-aux">
                    {VALLEY_FEATURE_POSTCARD.location}
                  </p>
                </div>
                <span className="font-code text-[10px] text-[#ff5b04] font-semibold shrink-0">
                  AMPLIAR
                </span>
              </div>
            </button>
          </div>

          {/* Cortina carbón/teal de salida hacia la Galería */}
          <div
            ref={scene3CurtainRef}
            className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-[#075056]/90 to-[#0b0c0e] opacity-0"
          />
        </section>

        {/* =====================================================================
            8. ESCENA 4 — GALERÍA (4 paneles verticales en orden estricto + contador)
           ===================================================================== */}
        <section
          id="galeria"
          ref={scene4Ref}
          aria-label="Cómo viajamos: Galería de cuatro capítulos"
          className="relative w-full h-screen overflow-hidden bg-[#0b0c0e] flex flex-col justify-between px-5 md:px-12 pt-20 pb-6"
        >
          {/* Fondo sutil con predominio del primer color de la paleta (#075056) */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(7, 80, 86, 0.38) 0%, rgba(17, 18, 20, 0.95) 55%, rgba(11, 12, 14, 1) 100%)',
            }}
          />

          {/* Encabezado editorial: "Cómo Viajamos", contador "Panel 01 de 04" y nombre activo */}
          <div className="relative z-10 w-full max-w-[1344px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#075056]/60 pb-3">
            <div>
              <p className="text-xs text-[#a3a098] font-aux mb-0.5">
                Metodología de Expedición · {BRAND_CONFIG.fullName}
              </p>
              <h2 className="font-editorial text-2xl md:text-4xl text-[#f6f4ef] leading-none">
                Cómo Viajamos
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs md:text-sm font-aux">
              <span className="font-code text-[#ff5b04] font-semibold">
                Panel 0{activeGalleryIdx + 1} de 04
              </span>
              <span aria-hidden="true" className="text-[#a3a098]">·</span>
              <span className="text-[#f6f4ef] font-medium">
                {activePanelData.title} ({activePanelData.territory})
              </span>
            </div>
          </div>

          {/* Cuatro paneles fotográficos verticales (4 columnas en escritorio, 2x2 en móvil) */}
          <div className="relative z-10 w-full max-w-[1344px] mx-auto my-3 flex-1 min-h-0 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-stretch">
            {SCENE_FOUR_GALLERY_PANELS.map((panel, idx) => {
              const isProtagonist = activeGalleryIdx === idx;
              return (
                <button
                  key={panel.id}
                  ref={(el) => {
                    panelRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => setSelectedPhoto(panel)}
                  aria-label={`Ver capítulo ${panel.number}: ${panel.title} — ${panel.location}`}
                  className={`relative w-full h-full overflow-hidden rounded-sm text-left cursor-pointer border transition-colors ${
                    isProtagonist
                      ? 'border-[#ff5b04] shadow-xl'
                      : 'border-[#075056]/40 hover:border-[#075056]'
                  }`}
                >
                  {/* Fotografía interna con parallax continuo */}
                  <img
                    ref={(el) => {
                      panelImgRefs.current[idx] = el;
                    }}
                    src={panel.src}
                    alt={panel.alt}
                    className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  />

                  {/* Oscurecido superior e inferior para contraste editorial */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c0e]/75 via-transparent to-[#0b0c0e]/92" />

                  {/* Número pequeño arriba */}
                  <div className="relative z-10 p-3 md:p-4 flex items-center justify-between text-xs">
                    <span className="font-code text-[#f6f4ef] font-semibold">{panel.number}</span>
                    <span className="text-[11px] text-[#f6f4ef]/80 font-aux truncate ml-2">
                      {panel.territory}
                    </span>
                  </div>

                  {/* Título, lugar y descripción corta abajo */}
                  <div
                    ref={(el) => {
                      panelCaptionRefs.current[idx] = el;
                    }}
                    className="absolute bottom-0 left-0 right-0 z-10 p-3 md:p-5 flex flex-col justify-end"
                  >
                    <p className="text-[11px] text-[#ff5b04] font-aux mb-0.5">
                      {panel.location}
                    </p>
                    <h3 className="font-editorial text-lg md:text-2xl text-[#f6f4ef] leading-tight mb-1.5">
                      {panel.title}
                    </h3>
                    <p className="text-xs text-[#f6f4ef]/85 leading-relaxed line-clamp-2 md:line-clamp-3 font-aux">
                      {panel.note}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Indicador inferior de los cuatro capítulos */}
          <div className="relative z-10 w-full max-w-[1344px] mx-auto pt-2 border-t border-[#f6f4ef]/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
              {SCENE_FOUR_GALLERY_PANELS.map((panel, idx) => {
                const active = activeGalleryIdx === idx;
                return (
                  <button
                    key={panel.id}
                    type="button"
                    onClick={() => setSelectedPhoto(panel)}
                    className={`flex items-center gap-1.5 text-xs font-aux transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active ? 'text-[#f6f4ef] font-semibold' : 'text-[#a3a098] hover:text-[#f6f4ef]'
                    }`}
                  >
                    <span
                      className={`font-code text-[11px] ${
                        active ? 'text-[#ff5b04]' : 'text-[#a3a098]'
                      }`}
                    >
                      {panel.number}
                    </span>
                    <span>{panel.title}</span>
                  </button>
                );
              })}
            </div>

            <span className="hidden md:inline text-xs text-[#a3a098] font-aux whitespace-nowrap shrink-0">
              Haz clic en cualquier panel para abrir el visor
            </span>
          </div>
        </section>

        {/* =====================================================================
            9. ESCENA 5 — CIERRE (Sección clara con footer-mist.png, tarjeta de papel y chincheta)
           ===================================================================== */}
        <section
          id="cierre"
          ref={scene5Ref}
          aria-label="Planifica tu viaje con Agencia de Viajes Ferpaul"
          className="relative w-full min-h-screen overflow-hidden bg-[#f2ede2] text-[#18181a] flex flex-col justify-between px-5 md:px-12 pt-24 pb-10"
        >
          {/* Fondo footer-mist.png con capa luminosa suave */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              ref={scene5BgRef}
              src={LOCAL_IMAGES.footerMist}
              alt="Valle montañoso envuelto en neblina matinal luminosa"
              className="w-full h-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf7f0]/80 via-[#faf7f0]/65 to-[#111214]/90" />
          </div>

          {/* Contenido central: Titular oscuro + Tarjeta de papel con chincheta roja */}
          <div className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center">
            <div ref={scene5TitleRef} className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 text-xs text-[#075056] font-semibold mb-2 font-aux">
                <span>{BRAND_CONFIG.fullName}</span>
                <span aria-hidden="true">·</span>
                <span>{BRAND_CONFIG.country}</span>
              </div>
              <h2 className="font-editorial text-[clamp(2.5rem,4.8vw,4.5rem)] leading-[1.04] text-[#18181a] headline-balance">
                Planifica tu Viaje
              </h2>
            </div>

            {/* Tarjeta de papel real (máx 512px) con chincheta centrada arriba */}
            <div
              ref={scene5CardRef}
              className="closing-paper-card relative w-full max-w-[512px] p-6 sm:p-8 pt-9"
            >
              {/* Chincheta roja construida con SVG local centrada en el borde superior */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <svg
                  ref={scene5PinRef}
                  width="32"
                  height="36"
                  viewBox="0 0 32 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <ellipse cx="16" cy="31" rx="7" ry="2.5" fill="#18181a" fillOpacity="0.28" />
                  <path d="M16 18V31" stroke="#7A7A80" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="16" cy="12" r="9.5" fill="#C83228" stroke="#8F1D15" strokeWidth="1.2" />
                  <circle cx="13" cy="9" r="3" fill="#FF7A70" fillOpacity="0.65" />
                </svg>
              </div>

              <div className="text-center mb-5">
                <p className="font-editorial italic text-lg text-[#075056] mb-1">
                  Cuatro territorios emblemáticos de Bolivia
                </p>
                <p className="text-xs sm:text-sm text-[#18181a]/80 leading-relaxed font-aux">
                  Elige el destino que deseas explorar y diseñaremos contigo un itinerario a medida
                  con atención directa por WhatsApp ({BRAND_CONFIG.whatsappDisplay}).
                </p>
              </div>

              {/* Cuadrícula 2x2 de los cuatro territorios seleccionables: Porongo, Zongo, Yungas, Illimani */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {FEATURED_TERRITORIES.map((territory) => {
                  const selected = selectedClosingTerritory === territory.id;
                  return (
                    <button
                      key={territory.id}
                      type="button"
                      onClick={() => setSelectedClosingTerritory(territory.id)}
                      className={`p-3.5 text-left rounded-sm border transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#075056] text-[#f6f4ef] border-[#075056] shadow-md'
                          : 'bg-[#faf7f0] text-[#18181a] border-[#18181a]/15 hover:border-[#075056]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-editorial text-base font-semibold">
                          {territory.name}
                        </span>
                        <span
                          className={`font-code text-[11px] ${
                            selected ? 'text-[#ff5b04]' : 'text-[#075056]'
                          }`}
                        >
                          ~{territory.recommendedDays} días
                        </span>
                      </div>
                      <p
                        className={`text-[11px] leading-snug font-aux ${
                          selected ? 'text-[#f6f4ef]/85' : 'text-[#18181a]/70'
                        }`}
                      >
                        {territory.summary}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Botón principal de contacto con el color tipo naranja (#ff5b04) */}
              <button
                type="button"
                onClick={() => handleOpenPlannerForTerritory(selectedClosingTerritory)}
                className="btn-ember w-full py-3.5 px-6 rounded-sm text-sm font-semibold tracking-wide cursor-pointer whitespace-nowrap shrink-0"
              >
                Planificar ruta a {selectedClosingTerritory}
              </button>

              <div className="mt-4 pt-3 border-t border-[#18181a]/10 flex items-center justify-between text-[11px] text-[#18181a]/70 font-aux">
                <span>Atención directa en español</span>
                <span className="font-code text-[#075056] font-semibold">
                  WhatsApp {BRAND_CONFIG.whatsappDisplay}
                </span>
              </div>

              {/* En modo prefers-reduced-motion, mostramos la mochila estática junto a la tarjeta */}
              {reducedMotion && (
                <div className="mt-4 flex items-center justify-center gap-3 pt-3 border-t border-[#18181a]/10">
                  <div className="w-12 h-14 shrink-0">
                    <EditorialBackpack className="w-full h-full" />
                  </div>
                  <p className="text-xs text-[#18181a]/75 font-aux">
                    Equipaje listo para tu próxima expedición en Bolivia.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pie editorial discreto */}
          <footer className="relative z-10 w-full max-w-[1344px] mx-auto mt-12 pt-5 border-t border-[#f6f4ef]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#f6f4ef]/85 font-aux">
            <div className="flex items-center gap-2">
              <span className="font-editorial tracking-widest text-[#f6f4ef]">
                {BRAND_CONFIG.shortName}
              </span>
              <span aria-hidden="true">·</span>
              <span>{BRAND_CONFIG.fullName}</span>
              <span aria-hidden="true">·</span>
              <span>{BRAND_CONFIG.country}</span>
            </div>

            <div className="flex items-center gap-4">
              {BRAND_CONFIG.navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className="hover:text-[#ff5b04] transition-colors whitespace-nowrap shrink-0"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => handleOpenPlannerForTerritory(selectedClosingTerritory)}
                className="text-[#ff5b04] hover:underline cursor-pointer whitespace-nowrap shrink-0 font-code"
              >
                {BRAND_CONFIG.whatsappDisplay}
              </button>
            </div>
          </footer>
        </section>
      </main>

      {/* Visor de fotografías ampliado (Lightbox) */}
      <LightboxModal
        item={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onInquireDestination={(territory, title) =>
          handleOpenPlannerForTerritory(territory, title)
        }
      />

      {/* Modal Planificador de Viajes con WhatsApp real */}
      <JourneyPlannerModal
        isOpen={plannerOpen}
        initialDestination={plannerTerritory}
        initialNoteContext={plannerNoteContext}
        onClose={() => setPlannerOpen(false)}
      />
    </div>
  );
}
