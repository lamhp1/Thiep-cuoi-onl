import React from 'react';

// Chữ Song Hỷ (囍) cách điệu cao cấp
export function SongHyIcon({ className = 'w-6 h-6 text-[#C8A45D]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} aria-label="Song Hỷ">
      {/* Khung Song Hỷ truyền thống */}
      <rect x="10" y="8" width="80" height="8" rx="2" />
      {/* Cột dọc */}
      <rect x="18" y="16" width="6" height="40" rx="1" />
      <rect x="47" y="16" width="6" height="40" rx="1" />
      <rect x="76" y="16" width="6" height="40" rx="1" />
      {/* Nét ngang giữa */}
      <rect x="18" y="28" width="64" height="6" rx="1" />
      {/* Khung ô chữ Hỷ trái */}
      <rect x="24" y="38" width="20" height="5" />
      <rect x="24" y="48" width="20" height="5" />
      {/* Khung ô chữ Hỷ phải */}
      <rect x="56" y="38" width="20" height="5" />
      <rect x="56" y="48" width="20" height="5" />
      {/* Nét ngang lớn bên dưới */}
      <rect x="6" y="60" width="88" height="8" rx="2" />
      {/* Cột dưới */}
      <rect x="18" y="68" width="6" height="24" rx="1" />
      <rect x="47" y="68" width="6" height="24" rx="1" />
      <rect x="76" y="68" width="6" height="24" rx="1" />
      {/* Ô vuông khẩu trái */}
      <rect x="24" y="70" width="20" height="18" fill="none" stroke="currentColor" strokeWidth="5" />
      {/* Ô vuông khẩu phải */}
      <rect x="56" y="70" width="20" height="18" fill="none" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}

// Hoa Sen Việt Nam (Vietnamese Lotus)
export function LotusIcon({ className = 'w-8 h-8 text-[#C8A45D]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Cánh hoa sen chính giữa */}
      <path d="M50 8 C44 28 44 48 50 64 C56 48 56 28 50 8 Z" fill="currentColor" fillOpacity="0.2" />
      {/* Cánh trái trong */}
      <path d="M50 20 C36 28 32 46 44 62 C40 48 44 32 50 20 Z" fill="currentColor" fillOpacity="0.12" />
      {/* Cánh phải trong */}
      <path d="M50 20 C64 28 68 46 56 62 C60 48 56 32 50 20 Z" fill="currentColor" fillOpacity="0.12" />
      {/* Cánh trái ngoài */}
      <path d="M42 36 C22 42 16 56 36 66 C28 56 34 44 42 36 Z" fill="currentColor" fillOpacity="0.08" />
      {/* Cánh phải ngoài */}
      <path d="M58 36 C78 42 84 56 64 66 C72 56 66 44 58 36 Z" fill="currentColor" fillOpacity="0.08" />
      {/* Đế đài hoa */}
      <path d="M26 66 C38 72 62 72 74 66 C68 76 32 76 26 66 Z" fill="currentColor" fillOpacity="0.3" />
      {/* Giọt sương / hạt sen */}
      <circle cx="50" cy="38" r="2.5" fill="currentColor" />
    </svg>
  );
}

// Họa tiết Mây Cổ Điển Việt Nam (Vietnamese Royal Clouds)
export function VietnameseCloudMotif({ className = 'w-16 h-8 text-[#C8A45D]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 38 C6 28 16 18 28 22 C32 12 46 10 56 18 C64 8 82 8 88 20 C98 16 112 24 108 36 C104 46 88 46 80 42 C72 48 48 48 38 42 C28 46 14 46 10 38 Z" fill="currentColor" fillOpacity="0.06" />
      <path d="M25 35 C28 28 36 26 42 30" />
      <path d="M48 26 C54 20 66 22 70 28" />
      <path d="M78 30 C84 25 94 28 96 34" />
    </svg>
  );
}

// Góc hoa văn viền cung đình (Traditional Corner Flourish)
export function TraditionalCorner({ position = 'top-left', className = 'w-10 h-10 text-[#C8A45D]' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; className?: string }) {
  const rotation = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-[-1]',
  }[position];

  return (
    <div className={`pointer-events-none ${rotation} ${className}`}>
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        {/* Đường viền góc chính */}
        <path d="M4 56 L4 8 C4 5.79 5.79 4 8 4 L56 4" strokeWidth="2.5" />
        {/* Viền đôi song hành */}
        <path d="M10 52 L10 12 C10 10.9 10.9 10 12 10 L52 10" strokeWidth="1.2" strokeOpacity="0.7" />
        {/* Họa tiết hoa mây góc */}
        <path d="M14 24 C14 18 18 14 24 14 C28 14 30 18 28 22 C26 26 20 26 18 24" fill="currentColor" fillOpacity="0.15" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}

// Huy hiệu Song Hỷ viền vàng hoàng gia
export function RoyalEmblem({ title = 'Hỷ', subTitle = 'Trăm Năm Hạnh Phúc' }: { title?: string; subTitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center my-3">
      <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#9E1B32] to-[#7F1734] border-2 border-[#C8A45D] flex items-center justify-center shadow-xl">
        <div className="absolute inset-1 border border-[#E5D1A1]/40 rounded-full" />
        <SongHyIcon className="w-10 h-10 sm:w-11 sm:h-11 text-[#E5D1A1]" />
      </div>
      {title && (
        <span className="font-serif-title font-bold text-xs uppercase tracking-[0.25em] text-[#9E1B32] mt-2">
          {title}
        </span>
      )}
      {subTitle && (
        <span className="text-[11px] font-body text-[#7F1734]/80 tracking-wider">
          {subTitle}
        </span>
      )}
    </div>
  );
}
