import React from 'react';

/**
 * Hoa sen tối giản (Minimalist Lotus Line-Art)
 * Đường nét thanh mảnh, kiến trúc hiện đại, mang trọn linh hồn thanh tao của sen Việt
 */
export function MinimalistLotus({
  className = 'w-16 h-16 text-[#D8BE87]',
  strokeWidth = 1.5,
  fillOpacity = 0.05,
}: {
  className?: string;
  strokeWidth?: number;
  fillOpacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Hoa sen tối giản"
    >
      {/* Cánh hoa chính giữa thanh thoát */}
      <path
        d="M60 16 C55 38 52 64 60 88 C68 64 65 38 60 16 Z"
        fill="currentColor"
        fillOpacity={fillOpacity * 1.5}
      />
      {/* Cánh sen bên trái 1 */}
      <path
        d="M60 32 C42 42 36 64 50 86 C46 68 52 48 60 32 Z"
        fill="currentColor"
        fillOpacity={fillOpacity}
      />
      {/* Cánh sen bên phải 1 */}
      <path
        d="M60 32 C78 42 84 64 70 86 C74 68 68 48 60 32 Z"
        fill="currentColor"
        fillOpacity={fillOpacity}
      />
      {/* Cánh sen xoè rộng bên trái 2 */}
      <path
        d="M48 54 C24 62 18 80 42 90 C32 78 38 66 48 54 Z"
        fill="currentColor"
        fillOpacity={fillOpacity * 0.8}
      />
      {/* Cánh sen xoè rộng bên phải 2 */}
      <path
        d="M72 54 C96 62 102 80 78 90 C88 78 82 66 72 54 Z"
        fill="currentColor"
        fillOpacity={fillOpacity * 0.8}
      />
      {/* Đế hoa uốn nhẹ */}
      <path
        d="M32 90 C46 96 74 96 88 90 C80 98 40 98 32 90 Z"
        fill="currentColor"
        fillOpacity={fillOpacity * 2}
      />
      {/* Cuống sen buông nhẹ */}
      <path d="M60 96 C59 104 60 110 61 114" strokeWidth={strokeWidth * 0.9} />
      {/* Hạt sương đài sen */}
      <circle cx="60" cy="50" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Hoa sen line-art nghệ thuật khổ vừa dùng bên cạnh QR và trong tiêu đề
 */
export function LotusBranchArt({
  className = 'w-32 h-32 text-[#D8BE87]',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Cuống cong uyển chuyển */}
      <path d="M80 190 C78 150 82 110 80 75" />
      {/* Hoa sen nở */}
      <path d="M80 20 C75 36 74 54 80 72 C86 54 85 36 80 20 Z" fill="currentColor" fillOpacity="0.04" />
      <path d="M80 34 C64 42 60 58 72 72 C68 58 73 44 80 34 Z" fill="currentColor" fillOpacity="0.03" />
      <path d="M80 34 C96 42 100 58 88 72 C92 58 87 44 80 34 Z" fill="currentColor" fillOpacity="0.03" />
      <path d="M70 52 C48 60 44 76 66 80" />
      <path d="M90 52 C112 60 116 76 94 80" />
      {/* Nụ sen nhỏ bên cạnh */}
      <path d="M78 120 C60 115 50 100 48 85 C55 82 65 92 68 108" />
      <path d="M48 85 C42 75 48 65 52 70 C56 75 54 82 48 85 Z" fill="currentColor" fillOpacity="0.05" />
      {/* Lá sen line-art cuộn tròn tối giản */}
      <path d="M82 145 C105 140 120 150 125 165 C115 170 100 165 82 155" />
      <path d="M125 165 C135 158 140 145 130 140 C118 135 105 142 95 148" />
    </svg>
  );
}

/**
 * Mây line-art (Vietnamese Modern Cloud Line-Art)
 * Nét vẽ mảnh thanh tao lấy cảm hứng từ mây cuộn triều đình Huế & gốm men lam
 */
export function ModernCloudLine({
  className = 'w-24 h-10 text-[#D8BE87]',
  strokeWidth = 1.2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 160 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Mây line-art"
    >
      {/* Đường viền mây chính */}
      <path d="M20 44 C12 44 6 36 10 28 C14 20 26 20 32 26 C36 14 52 10 64 18 C72 8 92 8 100 20 C110 14 126 18 130 30 C138 28 148 34 146 42 C144 48 136 50 126 50 L30 50 C24 50 20 48 20 44 Z" />
      {/* Vòng xoáy mây bên trong */}
      <path d="M38 42 C40 34 50 32 56 36" />
      <path d="M72 32 C76 24 88 26 92 32" />
      <path d="M106 36 C110 30 122 32 124 38" />
      {/* Đuôi mây vờn nhẹ */}
      <path d="M130 48 C142 48 152 44 156 38" />
    </svg>
  );
}

/**
 * Chữ Hỷ rất nhỏ (Mini Song Hỷ 囍)
 * Kích thước khiêm nhường, tinh tế, đóng vai trò như triện vàng hoàng gia thanh lịch
 */
export function MiniSongHy({
  className = 'w-4 h-4 text-[#D8BE87]',
  bordered = false,
}: {
  className?: string;
  bordered?: boolean;
}) {
  const content = (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      aria-label="Song Hỷ nhỏ"
    >
      <rect x="10" y="8" width="80" height="8" rx="1.5" />
      <rect x="18" y="16" width="6" height="40" rx="1" />
      <rect x="47" y="16" width="6" height="40" rx="1" />
      <rect x="76" y="16" width="6" height="40" rx="1" />
      <rect x="18" y="28" width="64" height="6" rx="1" />
      <rect x="24" y="38" width="20" height="5" />
      <rect x="24" y="48" width="20" height="5" />
      <rect x="56" y="38" width="20" height="5" />
      <rect x="56" y="48" width="20" height="5" />
      <rect x="6" y="60" width="88" height="8" rx="1.5" />
      <rect x="18" y="68" width="6" height="24" rx="1" />
      <rect x="47" y="68" width="6" height="24" rx="1" />
      <rect x="76" y="68" width="6" height="24" rx="1" />
      <rect x="24" y="70" width="20" height="18" fill="none" stroke="currentColor" strokeWidth="5" />
      <rect x="56" y="70" width="20" height="18" fill="none" stroke="currentColor" strokeWidth="5" />
    </svg>
  );

  if (!bordered) return content;

  return (
    <div className="inline-flex items-center justify-center p-1.5 rounded-full border border-[#D8BE87]/40 bg-[#F7F4EC]/80 shadow-xs">
      {content}
    </div>
  );
}

/**
 * Pattern Đông Sơn cực nhẹ (Ultra-subtle Dong Son Bronze Drum Motif)
 * Các vòng đồng tâm, ngôi sao 14 cánh & chim Lạc cách điệu với độ mờ cực thấp (0.04 - 0.07)
 */
export function DongSonPattern({
  className = 'w-96 h-96 text-[#D8BE87]',
  opacity = 0.05,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Vòng ngoài cùng */}
      <circle cx="200" cy="200" r="190" strokeDasharray="3 3" />
      <circle cx="200" cy="200" r="182" />
      <circle cx="200" cy="200" r="172" strokeDasharray="6 4" />
      
      {/* Vành chim Lạc bay ngược chiều kim đồng hồ (4 góc tượng trưng) */}
      <g strokeWidth="0.8">
        {/* Chim Lạc góc 0 độ */}
        <path d="M 200 40 C 230 45 250 55 260 70 C 240 68 225 65 210 60 Z" fill="currentColor" fillOpacity="0.3" />
        <path d="M 260 70 C 280 85 270 95 240 85" />
        {/* Chim Lạc góc 90 độ */}
        <path d="M 360 200 C 355 230 345 250 330 260 C 332 240 335 225 340 210 Z" fill="currentColor" fillOpacity="0.3" />
        <path d="M 330 260 C 315 280 305 270 315 240" />
        {/* Chim Lạc góc 180 độ */}
        <path d="M 200 360 C 170 355 150 345 140 330 C 160 332 175 335 190 340 Z" fill="currentColor" fillOpacity="0.3" />
        <path d="M 140 330 C 120 315 130 305 160 315" />
        {/* Chim Lạc góc 270 độ */}
        <path d="M 40 200 C 45 170 55 150 70 140 C 68 160 65 175 60 190 Z" fill="currentColor" fillOpacity="0.3" />
        <path d="M 70 140 C 85 120 95 130 85 160" />
      </g>

      <circle cx="200" cy="200" r="130" />
      <circle cx="200" cy="200" r="122" strokeDasharray="4 2" />
      <circle cx="200" cy="200" r="95" />
      <circle cx="200" cy="200" r="88" strokeDasharray="2 3" />

      {/* Ngôi sao Đông Sơn 14 cánh chính giữa */}
      <g>
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * 360) / 14;
          return (
            <polygon
              key={i}
              points="200,120 205,190 195,190"
              transform={`rotate(${angle} 200 200)`}
              fill="currentColor"
              fillOpacity="0.4"
            />
          );
        })}
      </g>
      <circle cx="200" cy="200" r="12" fill="currentColor" fillOpacity="0.2" />
      <circle cx="200" cy="200" r="4" fill="currentColor" />
    </svg>
  );
}

/**
 * Đường phân cách Champagne tinh xảo với hoa sen & chữ Hỷ nhỏ
 */
export function ModernChampagneDivider({
  className = 'my-8',
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full max-w-sm mx-auto ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D8BE87]/60 to-[#D8BE87]" />
      <div className="flex items-center gap-1.5 px-2">
        <span className="w-1 h-1 rounded-full bg-[#D8BE87]" />
        <MiniSongHy className="w-3.5 h-3.5 text-[#63121D]" />
        <span className="w-1 h-1 rounded-full bg-[#D8BE87]" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D8BE87]/60 to-[#D8BE87]" />
    </div>
  );
}
