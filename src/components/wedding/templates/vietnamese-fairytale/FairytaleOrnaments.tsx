import React from 'react';

/**
 * Modern Folk Art (Tranh Dân Gian Đương Đại) Vector Ornaments
 * Inspired by Dong Ho paintings, folk clouds, bamboo groves, lotus ponds, and ancient village architecture.
 */

// 1. Dong Ho Folk Auspicious Cloud (Mây Ngũ Sắc / Mây Cát Tường Dân Gian)
export function FolkCloud({ className = 'w-24 h-12 text-[#BA262B]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 80" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 50C10 50 0 42 0 30C0 18 12 8 26 10C32 4 42 0 54 0C68 0 80 8 84 20C90 14 100 10 112 10C128 10 140 20 142 34C152 35 160 42 160 52C160 64 150 74 136 74C120 74 114 62 102 62C92 62 86 70 72 70C58 70 54 58 42 58C32 58 28 66 18 66C8 66 4 60 4 54C4 52 8 50 20 50Z"
        fillOpacity="0.88"
      />
      {/* Inner graphic swirl line typical of Dong Ho cloud drawings */}
      <path
        d="M30 46C24 46 18 42 18 36C18 28 26 22 34 22C42 22 46 28 52 28C58 28 64 22 74 22C84 22 92 28 92 36C92 44 84 50 74 50C62 50 58 40 48 40C40 40 36 46 30 46Z"
        fill="#FAF5EB"
        fillOpacity="0.45"
      />
      <circle cx="120" cy="44" r="6" fill="#FAF5EB" fillOpacity="0.5" />
    </svg>
  );
}

// 2. Stylized Bamboo Stalks & Leaves (Lũy Tre Làng Đương Đại)
export function FolkBambooGrove({ className = 'w-16 h-36 text-[#2D6A4F]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 180" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Main stalk */}
      <rect x="36" y="10" width="8" height="35" rx="2" fill="currentColor" />
      <line x1="34" y1="45" x2="46" y2="45" stroke="#FAF5EB" strokeWidth="2.5" />
      <rect x="36" y="47" width="8" height="40" rx="2" fill="currentColor" />
      <line x1="34" y1="87" x2="46" y2="87" stroke="#FAF5EB" strokeWidth="2.5" />
      <rect x="36" y="89" width="8" height="45" rx="2" fill="currentColor" />
      <line x1="34" y1="134" x2="46" y2="134" stroke="#FAF5EB" strokeWidth="2.5" />
      <rect x="36" y="136" width="8" height="44" rx="2" fill="currentColor" />

      {/* Bamboo leaves (lá tre vuốt nhọn cách điệu) */}
      <path d="M36 45 C20 40 5 46 0 54 C12 56 26 52 36 47 Z" fill="currentColor" opacity="0.95" />
      <path d="M44 45 C60 38 75 42 80 50 C68 53 54 50 44 47 Z" fill="currentColor" opacity="0.9" />
      <path d="M36 87 C15 82 2 92 0 102 C14 100 28 94 36 89 Z" fill="currentColor" opacity="0.95" />
      <path d="M44 87 C62 80 76 86 80 96 C66 96 52 92 44 89 Z" fill="currentColor" opacity="0.9" />
      <path d="M36 134 C18 130 6 138 2 146 C16 145 28 140 36 136 Z" fill="currentColor" opacity="0.95" />
      <path d="M44 134 C64 128 78 134 80 144 C67 142 54 138 44 136 Z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

// 3. Folk Lotus Blossom (Hoa Sen Đương Đại - Hồng Sen & Nhụy Vàng)
export function FolkLotus({ className = 'w-16 h-16', petalColor = '#D64560', coreColor = '#E5A93C' }: { className?: string; petalColor?: string; coreColor?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals */}
      <path
        d="M60 85 C30 85 10 70 12 52 C15 36 34 35 44 48 C50 30 70 30 76 48 C86 35 105 36 108 52 C110 70 90 85 60 85 Z"
        fill={petalColor}
        fillOpacity="0.85"
      />
      {/* Central main upright petal */}
      <path
        d="M60 12 C52 30 46 55 60 80 C74 55 68 30 60 12 Z"
        fill={petalColor}
      />
      {/* Left and right inner petals */}
      <path
        d="M60 80 C48 65 38 45 46 28 C56 42 58 60 60 80 Z"
        fill={petalColor}
        fillOpacity="0.95"
      />
      <path
        d="M60 80 C72 65 82 45 74 28 C64 42 62 60 60 80 Z"
        fill={petalColor}
        fillOpacity="0.95"
      />
      {/* Golden Seed core / Nhụy sen vàng */}
      <ellipse cx="60" cy="74" rx="14" ry="7" fill={coreColor} />
      <circle cx="56" cy="74" r="1.5" fill="#8C5311" />
      <circle cx="60" cy="73" r="1.5" fill="#8C5311" />
      <circle cx="64" cy="74" r="1.5" fill="#8C5311" />
      {/* Water ripple underneath */}
      <path d="M25 92 C45 88 75 88 95 92" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M38 96 C52 94 68 94 82 96" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}

// 4. Folk Flying Love Bird / Dove (Chim Én / Uyên Ương Bay Ngậm Hoa)
export function FolkBird({ className = 'w-12 h-12 text-[#BA262B]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body & head */}
      <path
        d="M35 48 C42 46 52 46 62 52 C72 58 84 56 94 48 C90 56 82 62 70 62 C58 62 48 56 40 52 C32 58 20 62 8 62 C16 56 24 50 35 48 Z"
        fill="currentColor"
      />
      {/* Upward Wing */}
      <path
        d="M48 48 C44 32 46 14 62 4 C60 16 66 26 72 34 C64 36 56 42 48 48 Z"
        fill="currentColor"
        opacity="0.95"
      />
      {/* Downward secondary wing */}
      <path
        d="M42 50 C34 40 32 25 38 16 C42 26 44 38 46 48 Z"
        fill="currentColor"
        opacity="0.75"
      />
      {/* Beak & eye */}
      <path d="M94 48 L100 50 L93 53 Z" fill="#E5A93C" />
      <circle cx="86" cy="51" r="2" fill="#FAF5EB" />
      {/* Little twig or flower in beak */}
      <path d="M97 50 C103 48 108 52 110 50" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="109" cy="50" r="2" fill="#D64560" />
    </svg>
  );
}

// 5. Traditional Ancient Village Gate Vector Silhouette & Details (Mái Cổng Làng Rêu Phong)
export function FolkVillageGateIcon({ className = 'w-24 h-24 text-[#A04735]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Curved Roof / Mái Ngói Cong */}
      <path
        d="M10 54 C30 52 60 42 90 32 C96 30 104 30 110 32 C140 42 170 52 190 54 C175 44 140 30 100 24 C60 30 25 44 10 54 Z"
        fill="currentColor"
      />
      {/* Top ridge ornament / Kìm nóc */}
      <circle cx="100" cy="22" r="5" fill="#E5A93C" />
      <path d="M92 24 C96 16 104 16 108 24 Z" fill="#E5A93C" />

      {/* Roof eaves & rafters */}
      <rect x="40" y="52" width="120" height="8" rx="2" fill="#8B3627" />

      {/* Archway Columns */}
      <rect x="48" y="60" width="22" height="96" rx="2" fill="currentColor" />
      <rect x="130" y="60" width="22" height="96" rx="2" fill="currentColor" />

      {/* Arch Curve / Vòm Cổng */}
      <path
        d="M70 156 L70 100 C70 82 82 72 100 72 C118 72 130 82 130 100 L130 156 Z"
        fill="#FAF5EB"
        opacity="0.9"
      />

      {/* Transom Plaque / Bảng hoành phi trên cổng */}
      <rect x="76" y="62" width="48" height="12" rx="2" fill="#BA262B" />
      <rect x="78" y="64" width="44" height="8" rx="1" fill="#FAF5EB" opacity="0.3" />
    </svg>
  );
}

// 6. Seal Stamp: "Hỷ" or "Cổ Tích Lương Duyên" (Con Dấu Triện Son)
export function FolkRedSeal({ text = 'HỶ', subtitle = 'TRĂM NĂM', className = 'w-14 h-14' }: { text?: string; subtitle?: string; className?: string }) {
  const isMultiWord = text.includes(' ') || text.length > 3;
  const isSmall = className.includes('w-8') || className.includes('w-9');

  return (
    <div className={`relative flex flex-col items-center justify-center p-1 border-2 border-[#BA262B] bg-[#BA262B]/10 rounded-lg text-[#BA262B] shadow-inner select-none font-serif ${className}`}>
      <div className="absolute inset-0.5 border border-dashed border-[#BA262B]/50 rounded-[4px] pointer-events-none" />
      <span className={`font-bold leading-tight text-center ${
        isMultiWord
          ? 'text-[8px] sm:text-[9px] tracking-tight'
          : isSmall
          ? 'text-xs tracking-normal'
          : 'text-xl tracking-widest mt-0.5'
      }`}>
        {text}
      </span>
      {subtitle && <span className="text-[6px] uppercase font-mono tracking-tighter opacity-80 mt-0.5 leading-none">{subtitle}</span>}
    </div>
  );
}

// 7. Chapter Badge / Biển Đề Tên Chương Truyện Cổ Tích
export function ChapterHeaderBadge({
  chapterNum,
  title,
  subtext,
}: {
  chapterNum: string;
  title: string;
  subtext?: string;
}) {
  return (
    <div className="text-center space-y-2 mb-8 relative">
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#BA262B]/10 border border-[#BA262B]/30 text-[#BA262B] text-xs font-semibold uppercase tracking-widest">
        <FolkCloud className="w-5 h-3 text-[#BA262B]" />
        <span>{chapterNum}</span>
        <FolkCloud className="w-5 h-3 text-[#BA262B] scale-x-[-1]" />
      </div>

      <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#351E17] tracking-wide">
        {title}
      </h2>

      {subtext && (
        <p className="font-poetry text-sm sm:text-base text-[#7A4C3E] italic max-w-xl mx-auto px-4 leading-relaxed">
          "{subtext}"
        </p>
      )}

      {/* Bottom rustic divider */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#BA262B]/40" />
        <FolkLotus className="w-6 h-6 text-[#BA262B]" />
        <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#BA262B]/40" />
      </div>
    </div>
  );
}
