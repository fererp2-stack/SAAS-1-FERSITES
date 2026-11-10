/**
 * @file EditorialBackpack.tsx
 * @description Ilustración SVG original de una mochila de campo premium en vista frontal.
 * Incluye rollo de manta superior, lona verde oliva encerada con matiz teal, correas de cuero marrón,
 * hebillas de latón envejecido, bolsillos laterales, costuras finas y sombra suave mediante gradientes SVG locales.
 */

import React from 'react';

interface EditorialBackpackProps {
  className?: string;
}

export const EditorialBackpack: React.FC<EditorialBackpackProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 148 172"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Sombra exterior suave para separar la mochila del fondo */}
        <filter id="bp-drop-shadow" x="-18%" y="-12%" width="136%" height="136%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#041214" floodOpacity="0.62" />
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
        </filter>

        {/* Gradiente principal de lona verde oliva encerada con matiz Ferpaul Teal */}
        <linearGradient id="bp-canvas-body" x1="26" y1="36" x2="122" y2="152" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4A5842" />
          <stop offset="48%" stopColor="#394634" />
          <stop offset="82%" stopColor="#2A3628" />
          <stop offset="100%" stopColor="#1E2920" />
        </linearGradient>

        {/* Gradiente de la solapa superior encerada */}
        <linearGradient id="bp-canvas-flap" x1="74" y1="36" x2="74" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#58674E" />
          <stop offset="55%" stopColor="#43513B" />
          <stop offset="100%" stopColor="#2F3B29" />
        </linearGradient>

        {/* Gradiente del bolsillo frontal */}
        <linearGradient id="bp-canvas-pocket" x1="74" y1="90" x2="74" y2="144" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#46543E" />
          <stop offset="100%" stopColor="#2B3626" />
        </linearGradient>

        {/* Gradiente de bolsillos laterales */}
        <linearGradient id="bp-side-pocket" x1="0" y1="74" x2="0" y2="138" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3E4B37" />
          <stop offset="100%" stopColor="#232C1F" />
        </linearGradient>

        {/* Gradiente del rollo de manta superior (lana cálida / espiga) */}
        <linearGradient id="bp-blanket-roll" x1="28" y1="14" x2="120" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8CEBE" />
          <stop offset="35%" stopColor="#C4B69F" />
          <stop offset="75%" stopColor="#9E8F78" />
          <stop offset="100%" stopColor="#7B6D59" />
        </linearGradient>

        {/* Gradiente de cuero marrón curtido */}
        <linearGradient id="bp-leather" x1="0" y1="12" x2="0" y2="154" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B542F" />
          <stop offset="45%" stopColor="#6E3F20" />
          <stop offset="100%" stopColor="#472611" />
        </linearGradient>

        {/* Refuerzo inferior de cuero oscuro */}
        <linearGradient id="bp-leather-base" x1="30" y1="136" x2="118" y2="156" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5C3419" />
          <stop offset="100%" stopColor="#381D0C" />
        </linearGradient>

        {/* Gradiente de latón envejecido */}
        <linearGradient id="bp-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E5C168" />
          <stop offset="50%" stopColor="#B88E35" />
          <stop offset="100%" stopColor="#785818" />
        </linearGradient>
      </defs>

      <g filter="url(#bp-drop-shadow)">
        {/* Sombra de base elíptica */}
        <ellipse cx="74" cy="158" rx="46" ry="6" fill="#050809" fillOpacity="0.45" />

        {/* Asa superior de cuero */}
        <path
          d="M58 18C58 10.5 90 10.5 90 18"
          stroke="url(#bp-leather)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M60 18C60 12.5 88 12.5 88 18"
          stroke="#A87048"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.7"
        />

        {/* Bolsillo lateral izquierdo */}
        <path
          d="M28 78C20 79 16 85 16 95V126C16 134 21 139 29 140H33V78H28Z"
          fill="url(#bp-side-pocket)"
          stroke="#1C2419"
          strokeWidth="1.2"
        />
        <path d="M17 94H32" stroke="#5B6B52" strokeWidth="1" strokeDasharray="2.5 2" opacity="0.65" />
        <rect x="20" y="102" width="8" height="4" rx="1" fill="url(#bp-leather)" />

        {/* Bolsillo lateral derecho */}
        <path
          d="M120 78C128 79 132 85 132 95V126C132 134 127 139 119 140H115V78H120Z"
          fill="url(#bp-side-pocket)"
          stroke="#1C2419"
          strokeWidth="1.2"
        />
        <path d="M116 94H131" stroke="#5B6B52" strokeWidth="1" strokeDasharray="2.5 2" opacity="0.65" />
        <rect x="120" y="102" width="8" height="4" rx="1" fill="url(#bp-leather)" />

        {/* Cuerpo principal de lona verde oliva encerada */}
        <rect
          x="28"
          y="38"
          width="92"
          height="116"
          rx="16"
          fill="url(#bp-canvas-body)"
          stroke="#1D261B"
          strokeWidth="1.5"
        />

        {/* Pliegues sutiles de volumen en la lona */}
        <path
          d="M36 52C34 84 34 114 38 142"
          stroke="#5C6D52"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M112 52C114 84 114 114 110 142"
          stroke="#161E14"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Base reforzada en cuero curtido */}
        <path
          d="M28 134H120V140C120 148.837 112.837 154 104 154H44C35.163 154 28 148.837 28 140V134Z"
          fill="url(#bp-leather-base)"
          stroke="#2A1508"
          strokeWidth="1.2"
        />
        {/* Costura fina de la base de cuero */}
        <path
          d="M31 137.5H117"
          stroke="#9E6B43"
          strokeWidth="1"
          strokeDasharray="3 2.5"
          opacity="0.75"
        />

        {/* Bolsillo frontal inferior con fuelle */}
        <rect
          x="38"
          y="92"
          width="72"
          height="46"
          rx="9"
          fill="url(#bp-canvas-pocket)"
          stroke="#1B2318"
          strokeWidth="1.3"
        />
        {/* Costura perimetral del bolsillo frontal */}
        <rect
          x="41"
          y="95"
          width="66"
          height="40"
          rx="7"
          stroke="#6A7C60"
          strokeWidth="0.9"
          strokeDasharray="2.5 2.5"
          opacity="0.65"
        />

        {/* Solapa superior del bolsillo frontal */}
        <path
          d="M38 98C38 93.582 41.582 90 46 90H102C106.418 90 110 93.582 110 98V105C110 108.314 107.314 111 104 111H44C40.686 111 38 108.314 38 105V98Z"
          fill="#4A5942"
          stroke="#1E261B"
          strokeWidth="1.2"
        />

        {/* Solapa principal superior (cubre la mitad superior de la mochila) */}
        <path
          d="M30 46C30 39.373 35.373 34 42 34H106C112.627 34 118 39.373 118 46V78C118 87.941 109.941 95 100 95H48C38.059 95 30 87.941 30 78V46Z"
          fill="url(#bp-canvas-flap)"
          stroke="#1B2419"
          strokeWidth="1.5"
        />
        {/* Costura fina en el borde de la solapa principal */}
        <path
          d="M34 47C34 41.5 38.5 38 44 38H104C109.5 38 114 41.5 114 47V76C114 84 107.5 90.5 99 90.5H49C40.5 90.5 34 84 34 76V47Z"
          stroke="#728567"
          strokeWidth="1"
          strokeDasharray="3 2.5"
          opacity="0.65"
        />

        {/* Parche de cuero central con insignia grabada */}
        <rect
          x="65"
          y="55"
          width="18"
          height="14"
          rx="2.5"
          fill="url(#bp-leather)"
          stroke="#2E170A"
          strokeWidth="1"
        />
        <line x1="69" y1="60" x2="75" y2="65" stroke="#C59B6D" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="79" y1="60" x2="73" y2="65" stroke="#C59B6D" strokeWidth="1.1" strokeLinecap="round" />

        {/* Rollo de manta superior (lana tejida con bordes en espiral) */}
        <rect
          x="24"
          y="16"
          width="100"
          height="24"
          rx="12"
          fill="url(#bp-blanket-roll)"
          stroke="#4A3E31"
          strokeWidth="1.4"
        />
        {/* Franjas tejidas del rollo de manta (acento Teal y Ember) */}
        <path d="M36 17V39" stroke="#075056" strokeWidth="2.5" opacity="0.65" />
        <path d="M41 17V39" stroke="#C83228" strokeWidth="1.5" opacity="0.65" />
        <path d="M107 17V39" stroke="#C83228" strokeWidth="1.5" opacity="0.65" />
        <path d="M112 17V39" stroke="#075056" strokeWidth="2.5" opacity="0.65" />
        {/* Espiral lateral del rollo de manta */}
        <circle cx="31" cy="28" r="7" fill="#8C7D68" stroke="#4A3E31" strokeWidth="1.1" />
        <path d="M31 24C33.5 24 35 26 35 28C35 30.5 32.5 32 30 31" stroke="#4A3E31" strokeWidth="1" strokeLinecap="round" />
        <circle cx="117" cy="28" r="7" fill="#8C7D68" stroke="#4A3E31" strokeWidth="1.1" />
        <path d="M117 24C119.5 24 121 26 121 28C121 30.5 118.5 32 116 31" stroke="#4A3E31" strokeWidth="1" strokeLinecap="round" />

        {/* Correas verticales principales de cuero marrón (izquierda y derecha) */}
        <g>
          {/* Correa izquierda */}
          <rect
            x="45"
            y="14"
            width="10"
            height="128"
            rx="3"
            fill="url(#bp-leather)"
            stroke="#2B1508"
            strokeWidth="1.1"
          />
          <line
            x1="47.2"
            y1="17"
            x2="47.2"
            y2="139"
            stroke="#AC764E"
            strokeWidth="0.8"
            strokeDasharray="2.5 2"
            opacity="0.75"
          />
          <line
            x1="52.8"
            y1="17"
            x2="52.8"
            y2="139"
            stroke="#AC764E"
            strokeWidth="0.8"
            strokeDasharray="2.5 2"
            opacity="0.75"
          />
          {/* Ojales metálicos en la correa izquierda */}
          <circle cx="50" cy="108" r="1.2" fill="#2A1508" />
          <circle cx="50" cy="115" r="1.2" fill="#2A1508" />
          <circle cx="50" cy="122" r="1.2" fill="#2A1508" />

          {/* Correa derecha */}
          <rect
            x="93"
            y="14"
            width="10"
            height="128"
            rx="3"
            fill="url(#bp-leather)"
            stroke="#2B1508"
            strokeWidth="1.1"
          />
          <line
            x1="95.2"
            y1="17"
            x2="95.2"
            y2="139"
            stroke="#AC764E"
            strokeWidth="0.8"
            strokeDasharray="2.5 2"
            opacity="0.75"
          />
          <line
            x1="100.8"
            y1="17"
            x2="100.8"
            y2="139"
            stroke="#AC764E"
            strokeWidth="0.8"
            strokeDasharray="2.5 2"
            opacity="0.75"
          />
          {/* Ojales metálicos en la correa derecha */}
          <circle cx="98" cy="108" r="1.2" fill="#2A1508" />
          <circle cx="98" cy="115" r="1.2" fill="#2A1508" />
          <circle cx="98" cy="122" r="1.2" fill="#2A1508" />
        </g>

        {/* Hebillas de latón envejecido superiores (sujetando la manta) */}
        <rect
          x="43.5"
          y="33"
          width="13"
          height="8"
          rx="2"
          fill="none"
          stroke="url(#bp-brass)"
          strokeWidth="2.2"
        />
        <line x1="50" y1="33" x2="50" y2="41" stroke="url(#bp-brass)" strokeWidth="1.8" />

        <rect
          x="91.5"
          y="33"
          width="13"
          height="8"
          rx="2"
          fill="none"
          stroke="url(#bp-brass)"
          strokeWidth="2.2"
        />
        <line x1="98" y1="33" x2="98" y2="41" stroke="url(#bp-brass)" strokeWidth="1.8" />

        {/* Hebillas principales de latón envejecido (cierre de la solapa) */}
        <rect
          x="43"
          y="86"
          width="14"
          height="10"
          rx="2.2"
          fill="#1E140B"
          fillOpacity="0.45"
          stroke="url(#bp-brass)"
          strokeWidth="2.4"
        />
        <line x1="50" y1="86" x2="50" y2="96" stroke="url(#bp-brass)" strokeWidth="2" />

        <rect
          x="91"
          y="86"
          width="14"
          height="10"
          rx="2.2"
          fill="#1E140B"
          fillOpacity="0.45"
          stroke="url(#bp-brass)"
          strokeWidth="2.4"
        />
        <line x1="98" y1="86" x2="98" y2="96" stroke="url(#bp-brass)" strokeWidth="2" />

        {/* Remaches de latón envejecido */}
        <circle cx="50" cy="46" r="1.6" fill="url(#bp-brass)" />
        <circle cx="98" cy="46" r="1.6" fill="url(#bp-brass)" />
        <circle cx="50" cy="101" r="1.6" fill="url(#bp-brass)" />
        <circle cx="98" cy="101" r="1.6" fill="url(#bp-brass)" />
      </g>
    </svg>
  );
};
export default EditorialBackpack;
