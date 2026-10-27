import React from 'react';

/**
 * Botanical & Gold Line Ornaments for "Mẫu 2 — Floral Romance"
 * Featuring: Soft blush English roses, sage eucalyptus leaves, delicate baby's breath (gypsophila), and golden hairline flourishes.
 */

// Top floral decoration / crest for Hero
export function FloralHeaderDecoration({ className = "w-48 h-16" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Left gold line flourish */}
        <path d="M10 30 C40 30, 60 22, 85 30 C95 33, 100 28, 108 26" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <circle cx="10" cy="30" r="2" fill="#D4AF37" opacity="0.8" />
        <circle cx="28" cy="29" r="1.2" fill="#D4AF37" opacity="0.6" />

        {/* Right gold line flourish */}
        <path d="M230 30 C200 30, 180 22, 155 30 C145 33, 140 28, 132 26" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <circle cx="230" cy="30" r="2" fill="#D4AF37" opacity="0.8" />
        <circle cx="212" cy="29" r="1.2" fill="#D4AF37" opacity="0.6" />

        {/* Left Eucalyptus branch */}
        <path d="M75 32 C85 30, 98 27, 110 28" stroke="#7A9382" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M82 27 C80 23, 85 20, 89 22 C92 24, 91 29, 85 29 Z" fill="#8EA896" opacity="0.85" />
        <path d="M96 25 C95 20, 100 18, 104 20 C107 22, 105 27, 100 27 Z" fill="#9FB5A6" opacity="0.9" />

        {/* Right Eucalyptus branch */}
        <path d="M165 32 C155 30, 142 27, 130 28" stroke="#7A9382" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M158 27 C160 23, 155 20, 151 22 C148 24, 149 29, 155 29 Z" fill="#8EA896" opacity="0.85" />
        <path d="M144 25 C145 20, 140 18, 136 20 C133 22, 135 27, 140 27 Z" fill="#9FB5A6" opacity="0.9" />

        {/* Baby's breath sprigs */}
        <path d="M102 33 C106 37, 108 42, 105 45" stroke="#9A9084" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="103" cy="38" r="1.8" fill="#FFF" stroke="#E2D4C8" strokeWidth="0.6" />
        <circle cx="107" cy="42" r="2" fill="#FFF" stroke="#E2D4C8" strokeWidth="0.6" />
        <circle cx="105" cy="46" r="1.6" fill="#FFF" stroke="#E2D4C8" strokeWidth="0.6" />

        <path d="M138 33 C134 37, 132 42, 135 45" stroke="#9A9084" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="137" cy="38" r="1.8" fill="#FFF" stroke="#E2D4C8" strokeWidth="0.6" />
        <circle cx="133" cy="42" r="2" fill="#FFF" stroke="#E2D4C8" strokeWidth="0.6" />
        <circle cx="135" cy="46" r="1.6" fill="#FFF" stroke="#E2D4C8" strokeWidth="0.6" />

        {/* Center Blooming Rose */}
        {/* Outer petals */}
        <path d="M108 26 C105 18, 114 12, 120 14 C126 12, 135 18, 132 26 C134 32, 128 37, 120 37 C112 37, 106 32, 108 26 Z" fill="#FCE4EC" stroke="#F4B8C5" strokeWidth="0.8" />
        {/* Mid petals */}
        <path d="M112 25 C110 20, 117 16, 120 17 C123 16, 130 20, 128 25 C129 29, 125 33, 120 33 C115 33, 111 29, 112 25 Z" fill="#F8BBD0" stroke="#EC9DB5" strokeWidth="0.7" />
        {/* Core petals */}
        <path d="M116 24 C115 21, 119 19, 120 19 C121 19, 125 21, 124 24 C125 27, 122 29, 120 29 C118 29, 115 27, 116 24 Z" fill="#E2738F" opacity="0.9" />
        <circle cx="120" cy="24" r="2.2" fill="#D95C7C" />
      </svg>
    </div>
  );
}

// Left Floral Side Decoration for Hero (slide in from left)
export function FloralHeroLeft({ className = "w-40 sm:w-56 md:w-72 h-auto" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 280 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
        <defs>
          <linearGradient id="roseGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF0F3" />
            <stop offset="45%" stopColor="#F8B4C4" />
            <stop offset="100%" stopColor="#E27B94" />
          </linearGradient>
          <linearGradient id="roseGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5F7" />
            <stop offset="50%" stopColor="#F5CAD5" />
            <stop offset="100%" stopColor="#DE89A1" />
          </linearGradient>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B4C9BC" />
            <stop offset="100%" stopColor="#6C8875" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9DBCF" />
            <stop offset="100%" stopColor="#819F8B" />
          </linearGradient>
          <linearGradient id="goldLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EAD295" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA8222" />
          </linearGradient>
        </defs>

        {/* Gold artistic spiral vines */}
        <path d="M-10 120 C40 100, 110 130, 140 190 C165 240, 145 310, 105 340 C75 362, 35 350, 20 310" stroke="url(#goldLineGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M140 190 C170 170, 220 195, 235 245 C248 290, 210 335, 170 340" stroke="url(#goldLineGrad)" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.5" />
        <circle cx="235" cy="245" r="2.5" fill="#D4AF37" opacity="0.75" />
        <circle cx="105" cy="340" r="2" fill="#D4AF37" opacity="0.75" />

        {/* Eucalyptus branches - Background layer */}
        <g opacity="0.92">
          {/* Main stem */}
          <path d="M10 380 C40 330, 80 260, 120 180 C140 140, 155 90, 160 30" stroke="#5E7866" strokeWidth="2" strokeLinecap="round" />
          {/* Eucalyptus leaf pairs */}
          <ellipse cx="65" cy="310" rx="22" ry="14" transform="rotate(-30 65 310)" fill="url(#leafGrad1)" stroke="#536D5C" strokeWidth="0.8" />
          <ellipse cx="85" cy="275" rx="20" ry="13" transform="rotate(25 85 275)" fill="url(#leafGrad2)" stroke="#536D5C" strokeWidth="0.8" />
          <ellipse cx="98" cy="225" rx="20" ry="12" transform="rotate(-20 98 225)" fill="url(#leafGrad1)" stroke="#536D5C" strokeWidth="0.8" />
          <ellipse cx="125" cy="195" rx="18" ry="11" transform="rotate(35 125 195)" fill="url(#leafGrad2)" stroke="#536D5C" strokeWidth="0.8" />
          <ellipse cx="132" cy="140" rx="16" ry="10" transform="rotate(-15 132 140)" fill="url(#leafGrad1)" stroke="#536D5C" strokeWidth="0.8" />
          <ellipse cx="152" cy="115" rx="15" ry="9" transform="rotate(20 152 115)" fill="url(#leafGrad2)" stroke="#536D5C" strokeWidth="0.8" />
          <ellipse cx="158" cy="65" rx="13" ry="8" transform="rotate(-5 158 65)" fill="url(#leafGrad1)" stroke="#536D5C" strokeWidth="0.8" />
        </g>

        {/* Baby's breath sprays */}
        <g stroke="#968C80" strokeWidth="1" strokeLinecap="round">
          <path d="M70 210 Q110 190 150 160" />
          <path d="M120 180 Q145 150 170 140" />
          <path d="M140 165 Q175 160 195 180" />
          <path d="M80 270 Q130 280 180 270" />
          <path d="M140 275 Q165 295 190 300" />
        </g>
        {/* Baby's breath little white florets */}
        <g fill="#FFFFFF" stroke="#DECBC6" strokeWidth="0.8">
          <circle cx="150" cy="160" r="3.5" />
          <circle cx="170" cy="140" r="3" />
          <circle cx="195" cy="180" r="3.8" />
          <circle cx="180" cy="155" r="2.8" />
          <circle cx="135" cy="150" r="2.5" />
          <circle cx="180" cy="270" r="3.6" />
          <circle cx="190" cy="300" r="3.2" />
          <circle cx="165" cy="290" r="2.8" />
          <circle cx="198" cy="265" r="2.4" />
        </g>

        {/* Top Rose Bud */}
        <g transform="translate(130, 90) rotate(15)">
          <path d="M0 25 C-12 12, -8 0, 10 -5 C28 -1, 30 15, 20 28 Z" fill="url(#roseGradient2)" stroke="#E599AC" strokeWidth="1" />
          <path d="M2 20 C-4 10, 2 2, 12 0 C22 0, 24 10, 16 22 Z" fill="#FCE4EC" />
          <path d="M6 14 C3 8, 8 3, 13 4 C18 5, 17 11, 12 15 Z" fill="#E2738F" />
        </g>

        {/* Secondary Blooming Garden Rose */}
        <g transform="translate(45, 270) rotate(-10)">
          {/* Calyx leaves */}
          <path d="M-15 35 C-30 45, -45 40, -50 30 C-40 25, -25 28, -10 32 Z" fill="#6C8875" />
          <path d="M30 40 C45 50, 60 45, 65 35 C55 30, 40 32, 25 35 Z" fill="#6C8875" />

          {/* Outer Layer */}
          <circle cx="0" cy="20" r="42" fill="url(#roseGradient1)" stroke="#EDAAB9" strokeWidth="1.2" />
          {/* Petal scallops */}
          <path d="M-35 15 C-42 -5, -15 -20, 5 -15 C25 -20, 42 -5, 35 15 C45 35, 25 55, 0 52 C-25 55, -45 35, -35 15 Z" fill="#FFF0F3" stroke="#F2B8C6" strokeWidth="1" />
          {/* Middle Petals */}
          <path d="M-22 18 C-25 2, -8 -8, 2 -5 C14 -8, 26 2, 22 18 C28 32, 14 44, 0 42 C-14 44, -28 32, -22 18 Z" fill="#F8BBD0" stroke="#E695A8" strokeWidth="1" />
          {/* Inner Swirl */}
          <path d="M-12 18 C-14 8, -4 2, 0 3 C6 2, 14 8, 12 18 C15 26, 8 32, 0 31 C-8 32, -15 26, -12 18 Z" fill="#E57390" />
          <circle cx="0" cy="18" r="4.5" fill="#C94F6E" />
        </g>

        {/* Main Large Focal Rose */}
        <g transform="translate(95, 195)">
          {/* Calyx base leaves */}
          <path d="M-30 50 C-50 65, -70 60, -75 48 C-60 40, -40 44, -20 46 Z" fill="#5F7B68" />
          <path d="M40 55 C65 68, 85 62, 90 50 C75 42, 55 45, 30 48 Z" fill="#5F7B68" />

          {/* Grand outer petals */}
          <circle cx="5" cy="25" r="54" fill="url(#roseGradient2)" stroke="#EDAAB9" strokeWidth="1.2" />
          <path d="M-45 15 C-55 -10, -20 -30, 8 -24 C36 -30, 58 -10, 48 15 C62 45, 36 68, 6 65 C-26 68, -62 45, -45 15 Z" fill="#FFF5F7" stroke="#F4B8C6" strokeWidth="1" />
          {/* Mid petal ring */}
          <path d="M-32 20 C-38 0, -12 -14, 6 -10 C24 -14, 40 0, 34 20 C42 40, 22 55, 6 52 C-12 55, -42 40, -32 20 Z" fill="#F8B4C4" stroke="#DE8399" strokeWidth="1" />
          {/* Inner tight petals */}
          <path d="M-18 20 C-22 6, -6 -2, 6 0 C18 -2, 24 6, 20 20 C24 32, 14 40, 6 38 C-4 40, -24 32, -18 20 Z" fill="#DE6D87" stroke="#C44B66" strokeWidth="0.8" />
          <circle cx="6" cy="19" r="6.5" fill="#BF3B59" />
          <path d="M3 17 Q6 13 9 17 Q6 21 3 17 Z" fill="#FFF" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

// Right Floral Side Decoration for Hero (slide in from right)
export function FloralHeroRight({ className = "w-40 sm:w-56 md:w-72 h-auto" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className} -scale-x-100`}>
      <FloralHeroLeft className="w-full h-auto" />
    </div>
  );
}

// Section Floral Divider
export function FloralDivider({ className = "w-full max-w-xs mx-auto my-6" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
      <div className="flex items-center gap-1.5 text-[#D97D8A]">
        {/* Left eucalyptus leaf */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="-rotate-45">
          <ellipse cx="12" cy="12" rx="9" ry="5" fill="#8EA896" stroke="#668270" strokeWidth="1" />
        </svg>
        {/* Center rosebud */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" fill="#FCE4EC" stroke="#F4B8C5" strokeWidth="1" />
          <circle cx="12" cy="12" r="5" fill="#F48FB1" stroke="#E91E63" strokeWidth="0.7" />
          <circle cx="12" cy="12" r="2" fill="#D81B60" />
        </svg>
        {/* Right eucalyptus leaf */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="rotate-45">
          <ellipse cx="12" cy="12" rx="9" ry="5" fill="#8EA896" stroke="#668270" strokeWidth="1" />
        </svg>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
    </div>
  );
}

// Individual Rose Petal SVG for floating effect
export function RosePetalSvg({
  color = "#F8B4C4",
  secondaryColor = "#FCE4EC",
  className = "w-6 h-6",
}: {
  color?: string;
  secondaryColor?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`petalGrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor="#C44B66" />
        </linearGradient>
      </defs>
      {/* Curved realistic rose petal with organic top notch */}
      <path
        d="M16 2 C22 2, 30 8, 30 18 C30 27, 22 34, 16 34 C10 34, 2 27, 2 18 C2 8, 10 2, 16 2 Z"
        fill={`url(#petalGrad-${color.replace('#', '')})`}
        stroke="#FFFFFF"
        strokeWidth="0.7"
        opacity="0.9"
      />
      {/* Central vein line */}
      <path d="M16 8 Q15 20 16 30" stroke="#FFFFFF" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
