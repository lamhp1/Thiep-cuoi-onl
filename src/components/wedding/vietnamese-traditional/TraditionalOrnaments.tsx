import React from 'react';

/**
 * Chữ Song Hỷ (囍) truyền thống cách điệu sắc nét
 */
export function SongHyGlyph({
  className = 'w-8 h-8 text-[#D4AF37]',
  glowing = false,
}: {
  className?: string;
  glowing?: boolean;
}) {
  return (
    <div className={`relative inline-flex items-center justify-center ${glowing ? 'animate-pulse' : ''}`}>
      {glowing && (
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/30 blur-md pointer-events-none scale-150" />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="currentColor"
        className={`relative z-10 ${className}`}
        aria-label="Song Hỷ"
      >
        {/* Nét ngang trên cùng */}
        <rect x="10" y="8" width="80" height="7.5" rx="1.5" />
        {/* 3 cột dọc trên */}
        <rect x="18" y="15.5" width="6.5" height="40" rx="1" />
        <rect x="46.75" y="15.5" width="6.5" height="40" rx="1" />
        <rect x="75.5" y="15.5" width="6.5" height="40" rx="1" />
        {/* Nét ngang giữa tầng trên */}
        <rect x="18" y="27" width="64" height="6" rx="1" />
        {/* Ô khẩu nhỏ trái trên */}
        <rect x="24.5" y="37" width="18" height="5" />
        <rect x="24.5" y="47" width="18" height="5" />
        {/* Ô khẩu nhỏ phải trên */}
        <rect x="57.5" y="37" width="18" height="5" />
        <rect x="57.5" y="47" width="18" height="5" />
        {/* Nét đại hoành ngang giữa */}
        <rect x="6" y="58" width="88" height="8" rx="2" />
        {/* 3 cột dọc dưới */}
        <rect x="18" y="66" width="6.5" height="26" rx="1" />
        <rect x="46.75" y="66" width="6.5" height="26" rx="1" />
        <rect x="75.5" y="66" width="6.5" height="26" rx="1" />
        {/* Ô khẩu dưới trái */}
        <rect x="24.5" y="68" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="5" />
        {/* Ô khẩu dưới phải */}
        <rect x="57.5" y="68" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="5" />
      </svg>
    </div>
  );
}

/**
 * Hoa sen truyền thống Việt Nam (Lotus)
 */
export function LotusOrnament({
  className = 'w-10 h-8 text-[#D4AF37]',
  strokeWidth = 1.8,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Hoa sen"
    >
      {/* Cánh sen tâm */}
      <path
        d="M50 10 C43 28 43 48 50 62 C57 48 57 28 50 10 Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      {/* Cánh sen trong trái */}
      <path
        d="M50 22 C36 30 32 46 44 60 C40 46 44 32 50 22 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Cánh sen trong phải */}
      <path
        d="M50 22 C64 30 68 46 56 60 C60 46 56 32 50 22 Z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      {/* Cánh sen ngoài trái */}
      <path
        d="M42 36 C24 42 18 56 36 64 C28 54 34 44 42 36 Z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Cánh sen ngoài phải */}
      <path
        d="M58 36 C76 42 82 56 64 64 C72 54 66 44 58 36 Z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Đài sen nâng đỡ */}
      <path
        d="M26 64 C38 70 62 70 74 64 C68 74 32 74 26 64 Z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <circle cx="50" cy="36" r="2.2" fill="currentColor" />
    </svg>
  );
}

/**
 * Mây cát tường Việt Nam (Auspicious Cloud Motif)
 */
export function AuspiciousCloud({
  className = 'w-16 h-8 text-[#D4AF37]',
  strokeWidth = 1.8,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 120 50"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Vân mây cát tường"
    >
      <path
        d="M12 36 C8 27 17 18 28 22 C33 13 46 11 55 18 C63 9 80 9 86 20 C96 16 109 23 106 35 C102 44 87 44 80 40 C72 46 48 46 38 40 C28 44 15 44 12 36 Z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path d="M26 34 C29 27 37 25 43 29" />
      <path d="M49 26 C55 20 66 22 70 28" />
      <path d="M78 30 C84 25 93 28 95 33" />
    </svg>
  );
}

/**
 * Họa tiết Trống đồng Đông Sơn cách điệu (Đông Sơn Bronze Drum Pattern)
 * Ngôi sao 14 cánh, chim Lạc bay và các vòng hoa văn đồng tâm
 */
export function DongSonDrumPattern({
  className = 'w-72 h-72 text-[#D4AF37]',
  opacity = 0.08,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Vòng ngoài cùng */}
      <circle cx="200" cy="200" r="192" strokeDasharray="3 3" />
      <circle cx="200" cy="200" r="184" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="174" strokeDasharray="6 4" />
      
      {/* Vành 4 chim Lạc tượng trưng 4 phương hướng */}
      <g strokeWidth="1">
        {/* Hướng Bắc */}
        <path d="M 200 38 C 228 44 248 54 258 68 C 238 66 224 63 210 58 Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M 258 68 C 276 82 268 92 238 82" />
        {/* Hướng Đông */}
        <path d="M 362 200 C 356 228 346 248 332 258 C 334 238 337 224 342 210 Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M 332 258 C 318 276 308 268 318 238" />
        {/* Hướng Nam */}
        <path d="M 200 362 C 172 356 152 346 142 332 C 162 334 176 337 190 342 Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M 142 332 C 124 318 132 308 162 318" />
        {/* Hướng Tây */}
        <path d="M 38 200 C 44 172 54 152 68 142 C 66 162 63 176 58 190 Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M 68 142 C 82 124 92 132 82 162" />
      </g>

      {/* Vòng răng lược & vạch chéo kép */}
      <circle cx="200" cy="200" r="132" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="124" strokeDasharray="4 2" />
      <circle cx="200" cy="200" r="96" strokeWidth="1" />
      <circle cx="200" cy="200" r="88" strokeDasharray="2 3" />

      {/* Mặt trời Đông Sơn 14 cánh ở tâm */}
      <g>
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * 360) / 14;
          return (
            <polygon
              key={i}
              points="200,118 204,190 196,190"
              transform={`rotate(${angle} 200 200)`}
              fill="currentColor"
              fillOpacity="0.45"
            />
          );
        })}
      </g>
      <circle cx="200" cy="200" r="14" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="4.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Dải phân cách hoa văn Đông Sơn & Hoa Sen
 */
export function TraditionalDivider({
  className = 'my-8',
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full max-w-md mx-auto ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
      <div className="flex items-center gap-2 px-2 text-[#BA1E28]">
        <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
        <LotusOrnament className="w-6 h-5 text-[#BA1E28]" strokeWidth={2} />
        <SongHyGlyph className="w-4 h-4 text-[#D4AF37]" />
        <LotusOrnament className="w-6 h-5 text-[#BA1E28] scale-x-[-1]" strokeWidth={2} />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
    </div>
  );
}

/**
 * Góc khung tranh giấy mỹ thuật truyền thống (Traditional Paper Frame Corner)
 */
export function PaperFrameCorner({
  position = 'top-left',
  className = 'w-8 h-8 text-[#D4AF37]',
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}) {
  const transformClass = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-[-1]',
  }[position];

  return (
    <div className={`pointer-events-none absolute ${transformClass} ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
        <path d="M2 38 L2 6 C2 3.79 3.79 2 6 2 L38 2" strokeWidth="2" />
        <path d="M7 35 L7 9 C7 7.9 7.9 7 9 7 L35 7" strokeWidth="1" strokeOpacity="0.7" />
        <path d="M12 20 C12 14 15 12 20 12 C24 12 25 15 23 18 C21 21 16 21 15 20" fill="currentColor" fillOpacity="0.2" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * Background Texture Giấy Nhẹ (Light Paper Texture / Giấy Dó mỹ thuật)
 * Hiệu ứng sợi giấy Dó nhẹ nhàng, không gây nặng nề
 */
export function PaperTextureBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-45 mix-blend-multiply"
      style={{
        backgroundImage: `radial-gradient(#C5A059 0.75px, transparent 0.75px), radial-gradient(#BA1E28 0.5px, #FAF6EE 0.5px)`,
        backgroundSize: '32px 32px, 64px 64px',
        backgroundPosition: '0 0, 16px 16px',
      }}
      aria-hidden="true"
    />
  );
}
