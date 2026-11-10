/**
 * @file travelData.ts
 * @description Configuración persistente de la marca Agencia de Viajes Ferpaul (Bolivia),
 * inventario de las 12 fotografías locales, los 4 destinos principales (Porongo, Zongo, Yungas, Illimani),
 * las 11 postales suspendidas de la Escena 2 y los 4 paneles verticales de la Escena 4.
 * No inventa direcciones físicas ni coordenadas GPS no proporcionadas.
 */

export interface PhotoItem {
  id: string;
  src: string;
  title: string;
  location: string;
  territory: 'Porongo' | 'Zongo' | 'Yungas' | 'Illimani';
  tag: string;
  note: string;
  alt: string;
}

export interface PostcardItem extends PhotoItem {
  paperTone: 'cream' | 'warm';
  /** Posición y estilo en escritorio (1440x900) */
  desktop: {
    top: number; // %
    left: number; // %
    rotate: number; // deg
    width: number; // px (195-250)
    zIndex: number;
  };
  /** Si es visible en móvil (6 postales activas con posiciones propias 390x844) */
  mobile?: {
    top: number; // %
    left: number; // %
    rotate: number; // deg
    width: number; // px (144-158)
    zIndex: number;
  };
  /** Recorte fotográfico cuando utiliza imagen de galería o segundo encuadre */
  crop?: {
    objectPosition: string;
    scale: number;
    aspectRatio: string;
  };
  /** Vector de entrada escalonada y deriva en parallax */
  motion: {
    entryX: number;
    entryY: number;
    entryRotate: number;
    driftX: number;
    driftY: number;
    driftScale: number;
    exitX: number;
    exitY: number;
    staggerOrder: number;
  };
}

export interface GalleryPanelItem extends PhotoItem {
  number: string;
  chapterLabel: string;
  parallaxXFrom: number;
  parallaxXTo: number;
  parallaxYFrom: number;
  parallaxYTo: number;
}

export interface TerritoryOption {
  id: 'Porongo' | 'Zongo' | 'Yungas' | 'Illimani';
  name: string;
  region: string;
  summary: string;
  recommendedDays: number;
  seasonHint: string;
  image: string;
}

export const BRAND_CONFIG = {
  shortName: 'FERPAUL',
  fullName: 'Agencia de Viajes Ferpaul',
  activityType: 'Agencia de Viajes y Expediciones en Bolivia',
  country: 'Bolivia',
  language: 'es',
  whatsappRaw: '59169964875',
  whatsappDisplay: '+591 69964875',
  palette: {
    predominantTeal: '#075056',
    deepSlate: '#233038',
    ctaEmber: '#ff5b04',
  },
  navigation: [
    { id: 'portada', label: 'Portada', href: '#portada' },
    { id: 'destinos', label: 'Destinos', href: '#destinos' },
    { id: 'paisaje', label: 'Paisaje', href: '#paisaje' },
    { id: 'galeria', label: 'Galería', href: '#galeria' },
  ],
  ctaLabel: 'Planificar viaje',
} as const;

export const LOCAL_IMAGES = {
  heroTraveler: '/hero-traveler.png',
  panoramaValley: '/panorama-valley.png',
  footerMist: '/footer-mist.png',
  galleryRedRocks: '/gallery-red-rocks.png',
  galleryWaterfall: '/gallery-waterfall.png',
  gallerySnow: '/gallery-snow.png',
  galleryMarket: '/gallery-market.png',
  postcardLake: '/postcard-lake.png',
  postcardCoast: '/postcard-coast.png',
  postcardDesert: '/postcard-desert.png',
  postcardVillage: '/postcard-village.png',
  postcardForest: '/postcard-forest.png',
} as const;

export const FEATURED_TERRITORIES: TerritoryOption[] = [
  {
    id: 'Porongo',
    name: 'Porongo',
    region: 'Colinas y Bosques Subtropicales · Bolivia',
    summary: 'Senderos verdes, arquitectura tradicional de pueblo, miradores húmedos y calma rural a paso pausado.',
    recommendedDays: 6,
    seasonHint: 'Todo el año · Ideal en transición templada',
    image: LOCAL_IMAGES.postcardForest,
  },
  {
    id: 'Zongo',
    name: 'Zongo',
    region: 'Valle Glacial y Cañones · Transición Andina',
    summary: 'Descenso desde cumbres heladas hacia quebradas de roca y cascadas de deshielo que alimentan el valle.',
    recommendedDays: 8,
    seasonHint: 'Mayo a Octubre · Cielos despejados',
    image: LOCAL_IMAGES.galleryWaterfall,
  },
  {
    id: 'Yungas',
    name: 'Yungas',
    region: 'Bosque Nuboso y Mercados Vivos · Bolivia',
    summary: 'Caminos entre neblina templada, cafetales de ladera y mercados locales llenos de frutos e historias.',
    recommendedDays: 10,
    seasonHint: 'Abril a Noviembre · Senderos firmes',
    image: LOCAL_IMAGES.galleryMarket,
  },
  {
    id: 'Illimani',
    name: 'Illimani',
    region: 'Cordillera Real · Alta Montaña en Bolivia',
    summary: 'Lagunas cristalinas de altura, paredes de hielo eterno y campamentos frente al guardián de los Andes.',
    recommendedDays: 12,
    seasonHint: 'Mayo a Septiembre · Estación seca andina',
    image: LOCAL_IMAGES.gallerySnow,
  },
];

export const HERO_FEATURE_POSTCARD: PhotoItem = {
  id: 'hero-lake-card',
  src: LOCAL_IMAGES.postcardLake,
  title: 'Espejo de Deshielo',
  location: 'Faldas del Illimani · Bolivia',
  territory: 'Illimani',
  tag: 'Archivo 01 · Aguas tranquilas',
  note: 'Al amanecer, las aguas de altura reflejan las cumbres nevadas antes de que el viento del valle despierte la superficie.',
  alt: 'Barca de madera flotando sobre un lago cristalino rodeado de pinos y montañas nevadas',
};

export const VALLEY_FEATURE_POSTCARD: PhotoItem = {
  id: 'valley-coast-card',
  src: LOCAL_IMAGES.postcardCoast,
  title: 'Mirador de Niebla y Roca',
  location: 'Vertiente Húmeda de Zongo · Bolivia',
  territory: 'Zongo',
  tag: 'Archivo 07 · Abismo verde',
  note: 'Donde las laderas cubiertas de musgo se encuentran con el vapor del agua fría y el viento que sube desde las quebradas.',
  alt: 'Acantilados verdes cubiertos de bruma junto a aguas profundas en movimiento',
};

/**
 * ONCE postales suspendidas de la Escena 2 con las posiciones exactas de escritorio y móvil.
 */
export const SCENE_TWO_POSTCARDS: PostcardItem[] = [
  {
    id: 'pc-lake',
    src: LOCAL_IMAGES.postcardLake,
    title: 'Laguna Serena',
    location: 'Pie del Illimani · Bolivia',
    territory: 'Illimani',
    tag: 'Illimani · Deshielo',
    note: 'Aguas turquesa en calma absoluta donde la luz de la mañana dibuja cada cumbre con nitidez.',
    alt: 'Lago de montaña con bote de madera y cumbres nevadas al fondo',
    paperTone: 'cream',
    desktop: { top: 7, left: 6, rotate: -7.5, width: 228, zIndex: 14 },
    mobile: { top: 6, left: -4, rotate: -6.5, width: 150, zIndex: 14 },
    motion: {
      entryX: -240,
      entryY: -180,
      entryRotate: -19,
      driftX: 16,
      driftY: -22,
      driftScale: 1.04,
      exitX: -260,
      exitY: -190,
      staggerOrder: 0,
    },
  },
  {
    id: 'pc-desert',
    src: LOCAL_IMAGES.postcardDesert,
    title: 'Quebrada Ocre',
    location: 'Cañones Secos hacia Zongo · Bolivia',
    territory: 'Zongo',
    tag: 'Zongo · Sendero',
    note: 'Gargantas de piedra cálida talladas por antiguos ríos que descienden desde la meseta alta.',
    alt: 'Sendero solitario atravesando un cañón de roca ocre iluminado por el sol de tarde',
    paperTone: 'warm',
    desktop: { top: 8, left: 76, rotate: 6.5, width: 222, zIndex: 13 },
    mobile: { top: 8, left: 58, rotate: 6.0, width: 148, zIndex: 13 },
    motion: {
      entryX: 250,
      entryY: -175,
      entryRotate: 18,
      driftX: -18,
      driftY: -18,
      driftScale: 0.96,
      exitX: 270,
      exitY: -180,
      staggerOrder: 1,
    },
  },
  {
    id: 'pc-coast',
    src: LOCAL_IMAGES.postcardCoast,
    title: 'Filo de Bruma',
    location: 'Laderas Húmedas de Zongo · Bolivia',
    territory: 'Zongo',
    tag: 'Zongo · Bruma',
    note: 'Laderas de pasto alto y roca oscura donde las nubes bajas rozan el camino de los viajeros.',
    alt: 'Laderas verdes y formaciones de roca oscura bajo cielo nublado',
    paperTone: 'cream',
    desktop: { top: 56, left: 4, rotate: 5.2, width: 218, zIndex: 16 },
    mobile: { top: 62, left: -3, rotate: 4.8, width: 146, zIndex: 16 },
    motion: {
      entryX: -270,
      entryY: 160,
      entryRotate: 16,
      driftX: 20,
      driftY: -26,
      driftScale: 1.05,
      exitX: -280,
      exitY: 180,
      staggerOrder: 2,
    },
  },
  {
    id: 'pc-village',
    src: LOCAL_IMAGES.postcardVillage,
    title: 'Callejón de Piedra',
    location: 'Pueblos de Valle y Yungas · Bolivia',
    territory: 'Yungas',
    tag: 'Yungas · Tradición',
    note: 'Arquitectura de piedra y balcones de madera donde el tiempo transcurre al ritmo de las caminatas.',
    alt: 'Calle empedrada en un pueblo de montaña con balcones de madera y flores',
    paperTone: 'warm',
    desktop: { top: 54, left: 78, rotate: -6.8, width: 230, zIndex: 15 },
    mobile: { top: 60, left: 56, rotate: -5.8, width: 152, zIndex: 15 },
    motion: {
      entryX: 265,
      entryY: 170,
      entryRotate: -17,
      driftX: -22,
      driftY: -20,
      driftScale: 1.03,
      exitX: 285,
      exitY: 195,
      staggerOrder: 3,
    },
  },
  {
    id: 'pc-forest',
    src: LOCAL_IMAGES.postcardForest,
    title: 'Senda en la Niebla',
    location: 'Bosques de Porongo y Yungas · Bolivia',
    territory: 'Porongo',
    tag: 'Porongo · Monte verde',
    note: 'Escalones de piedra húmeda y musgo profundo bajo el dosel silencioso del bosque subtropical.',
    alt: 'Sendero de piedra cubierto de musgo dentro de un bosque envuelto en neblina',
    paperTone: 'cream',
    desktop: { top: 63, left: 39, rotate: 3.4, width: 212, zIndex: 18 },
    mobile: { top: 72, left: 26, rotate: 3.0, width: 148, zIndex: 18 },
    motion: {
      entryX: 20,
      entryY: 290,
      entryRotate: 12,
      driftX: -10,
      driftY: -30,
      driftScale: 1.06,
      exitX: 30,
      exitY: 280,
      staggerOrder: 4,
    },
  },
  {
    id: 'pc-crop-red-rocks',
    src: LOCAL_IMAGES.galleryRedRocks,
    title: 'Mirador de las Agujas',
    location: 'Ruta Alta hacia Zongo · Bolivia',
    territory: 'Zongo',
    tag: 'Zongo · Horizonte',
    note: 'Dos caminantes contemplan la amplitud de las formaciones rojizas antes de iniciar el descenso al valle.',
    alt: 'Dos excursionistas observando formaciones rocosas rojizas y montañas nevadas al fondo',
    paperTone: 'warm',
    desktop: { top: 4, left: 41, rotate: -3.8, width: 205, zIndex: 11 },
    mobile: { top: 2, left: 24, rotate: -3.4, width: 144, zIndex: 11 },
    crop: {
      objectPosition: '50% 32%',
      scale: 1.24,
      aspectRatio: '4 / 3',
    },
    motion: {
      entryX: 0,
      entryY: -260,
      entryRotate: -14,
      driftX: 12,
      driftY: 18,
      driftScale: 0.95,
      exitX: -15,
      exitY: -275,
      staggerOrder: 5,
    },
  },
  {
    id: 'pc-crop-waterfall',
    src: LOCAL_IMAGES.galleryWaterfall,
    title: 'Caída de Basalto',
    location: 'Cascadas de Zongo · Bolivia',
    territory: 'Zongo',
    tag: 'Zongo · Agua viva',
    note: 'El deshielo andino se precipita en columnas de espuma turquesa entre muros de roca volcánica y musgo.',
    alt: 'Cascada caudalosa de agua turquesa cayendo entre acantilados oscuros',
    paperTone: 'cream',
    desktop: { top: 29, left: -3, rotate: 9.5, width: 202, zIndex: 12 },
    crop: {
      objectPosition: '50% 45%',
      scale: 1.28,
      aspectRatio: '4 / 3',
    },
    motion: {
      entryX: -310,
      entryY: -10,
      entryRotate: 22,
      driftX: 26,
      driftY: -14,
      driftScale: 1.04,
      exitX: -320,
      exitY: -20,
      staggerOrder: 6,
    },
  },
  {
    id: 'pc-crop-snow',
    src: LOCAL_IMAGES.gallerySnow,
    title: 'Frente Glaciar',
    location: 'Macizo del Illimani · Bolivia',
    territory: 'Illimani',
    tag: 'Illimani · Cumbre',
    note: 'Lenguas de hielo suspendidas sobre lagunas glaciares donde el silencio solo se rompe con el viento.',
    alt: 'Montaña escarpada cubierta de nieve y glaciar frente a una laguna azul',
    paperTone: 'warm',
    desktop: { top: 28, left: 85, rotate: -8.5, width: 206, zIndex: 12 },
    crop: {
      objectPosition: '50% 25%',
      scale: 1.26,
      aspectRatio: '4 / 3',
    },
    motion: {
      entryX: 310,
      entryY: 15,
      entryRotate: -20,
      driftX: -24,
      driftY: 16,
      driftScale: 0.97,
      exitX: 320,
      exitY: 25,
      staggerOrder: 7,
    },
  },
  {
    id: 'pc-crop-market',
    src: LOCAL_IMAGES.galleryMarket,
    title: 'Cosecha y Tejidos',
    location: 'Mercados de Yungas y Porongo · Bolivia',
    territory: 'Yungas',
    tag: 'Yungas · Encuentro',
    note: 'Conversaciones cercanas con productores locales entre textiles tradicionales y frutos recién cosechados.',
    alt: 'Viajeros conversando con una vendedora local en un mercado tradicional de montaña',
    paperTone: 'cream',
    desktop: { top: 15, left: 23, rotate: 4.6, width: 198, zIndex: 10 },
    crop: {
      objectPosition: '50% 35%',
      scale: 1.22,
      aspectRatio: '4 / 3',
    },
    motion: {
      entryX: -180,
      entryY: -240,
      entryRotate: 15,
      driftX: -14,
      driftY: 22,
      driftScale: 0.94,
      exitX: -200,
      exitY: -250,
      staggerOrder: 8,
    },
  },
  {
    id: 'pc-crop-lake-detail',
    src: LOCAL_IMAGES.postcardLake,
    title: 'Proa en Calma',
    location: 'Laguna Alta del Illimani · Bolivia',
    territory: 'Illimani',
    tag: 'Illimani · Detalle',
    note: 'La textura de la madera envejecida sobre el reflejo verde profundo de los bosques de ladera.',
    alt: 'Detalle cercano de bote de madera reflejado en aguas verdes de montaña',
    paperTone: 'warm',
    desktop: { top: 72, left: 19, rotate: -4.8, width: 196, zIndex: 17 },
    crop: {
      objectPosition: '68% 78%',
      scale: 1.45,
      aspectRatio: '4 / 3',
    },
    motion: {
      entryX: -190,
      entryY: 280,
      entryRotate: -16,
      driftX: 15,
      driftY: -28,
      driftScale: 1.05,
      exitX: -220,
      exitY: 295,
      staggerOrder: 9,
    },
  },
  {
    id: 'pc-crop-desert-detail',
    src: LOCAL_IMAGES.postcardDesert,
    title: 'Luz de la Tarde',
    location: 'Quebradas de Porongo y Valles · Bolivia',
    territory: 'Porongo',
    tag: 'Porongo · Travesía',
    note: 'Cuando el sol desciende, las paredes minerales se encienden en tonos ámbar y terracota.',
    alt: 'Detalle de caminante recorriendo el sendero iluminado entre muros de roca',
    paperTone: 'cream',
    desktop: { top: 68, left: 61, rotate: 7.2, width: 204, zIndex: 17 },
    crop: {
      objectPosition: '62% 62%',
      scale: 1.42,
      aspectRatio: '4 / 3',
    },
    motion: {
      entryX: 210,
      entryY: 275,
      entryRotate: 19,
      driftX: -16,
      driftY: -24,
      driftScale: 1.03,
      exitX: 240,
      exitY: 290,
      staggerOrder: 10,
    },
  },
];

/**
 * CUATRO paneles fotográficos verticales de la Escena 4 en el orden exacto requerido:
 * 1. gallery-red-rocks.png
 * 2. gallery-waterfall.png
 * 3. gallery-snow.png
 * 4. gallery-market.png
 */
export const SCENE_FOUR_GALLERY_PANELS: GalleryPanelItem[] = [
  {
    id: 'panel-01-red-rocks',
    number: '01',
    chapterLabel: 'Rutas de Mirador · Zongo',
    src: LOCAL_IMAGES.galleryRedRocks,
    title: 'Lectura del Territorio',
    location: 'Cañones Rojos y Ruta a Zongo · Bolivia',
    territory: 'Zongo',
    tag: 'Capítulo 01 · Orientación',
    note: 'Caminamos con guías locales que conocen cada paso entre las agujas de arcilla y los valles glaciares.',
    alt: 'Dos viajeros de espaldas observando un cañón de roca roja y montañas nevadas',
    parallaxXFrom: -6,
    parallaxXTo: 6,
    parallaxYFrom: -5,
    parallaxYTo: 5,
  },
  {
    id: 'panel-02-waterfall',
    number: '02',
    chapterLabel: 'Aguas de Deshielo · Zongo',
    src: LOCAL_IMAGES.galleryWaterfall,
    title: 'El Pulso del Agua',
    location: 'Vertiente Húmeda de Zongo · Bolivia',
    territory: 'Zongo',
    tag: 'Capítulo 02 · Inmersión',
    note: 'Seguimos el curso de los ríos que nacen en los glaciares y caen con fuerza hacia las quebradas verdes.',
    alt: 'Gran cascada de agua turquesa cayendo entre rocas oscuras y musgo',
    parallaxXFrom: 6,
    parallaxXTo: -6,
    parallaxYFrom: -5,
    parallaxYTo: 5,
  },
  {
    id: 'panel-03-snow',
    number: '03',
    chapterLabel: 'Alta Montaña · Illimani',
    src: LOCAL_IMAGES.gallerySnow,
    title: 'Silencio de Altura',
    location: 'Glaciares y Lagunas del Illimani · Bolivia',
    territory: 'Illimani',
    tag: 'Capítulo 03 · Altitud',
    note: 'Campamentos y caminatas contemplativas frente a las paredes de hielo y lagunas del Illimani.',
    alt: 'Cumbre nevada del macizo glaciar reflejada en una laguna turquesa',
    parallaxXFrom: -6,
    parallaxXTo: 6,
    parallaxYFrom: -5,
    parallaxYTo: 5,
  },
  {
    id: 'panel-04-market',
    number: '04',
    chapterLabel: 'Cultura Viva · Yungas y Porongo',
    src: LOCAL_IMAGES.galleryMarket,
    title: 'Encuentros Reales',
    location: 'Mercados de Los Yungas y Porongo · Bolivia',
    territory: 'Yungas',
    tag: 'Capítulo 04 · Hospitalidad',
    note: 'Compartimos mesa, relatos y mercados con las comunidades que dan vida a Los Yungas y Porongo.',
    alt: 'Pareja de viajeros conversando alegremente con una mujer local en un mercado tradicional',
    parallaxXFrom: 6,
    parallaxXTo: -6,
    parallaxYFrom: -5,
    parallaxYTo: 5,
  },
];
