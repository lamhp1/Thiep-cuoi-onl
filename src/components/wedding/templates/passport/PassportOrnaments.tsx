import React from 'react';

/**
 * Paper Texture Background with ultra-subtle grain, fibers and guilloché watermark
 */
export function PassportPaperTexture() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35 select-none"
      aria-hidden="true"
    >
      {/* Subtle fine paper fiber SVG pattern */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="passport-paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.04" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#passport-paper-grain)" />
      </svg>

      {/* Very faint luxury passport guilloché security curves (opacity 0.03) */}
      <svg
        className="absolute -top-32 -right-32 w-[600px] h-[600px] text-[#B99552] opacity-[0.04]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="100" cy="100" r="90" strokeDasharray="2,2" />
        <circle cx="100" cy="100" r="75" />
        <circle cx="100" cy="100" r="60" strokeDasharray="3,3" />
        <circle cx="100" cy="100" r="45" />
        <circle cx="100" cy="100" r="30" strokeDasharray="1,2" />
        <path d="M100 0 L100 200 M0 100 L200 100 M30 30 L170 170 M30 170 L170 30" strokeOpacity="0.4" />
      </svg>
      <svg
        className="absolute -bottom-32 -left-32 w-[600px] h-[600px] text-[#651F2A] opacity-[0.03]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="100" cy="100" r="90" strokeDasharray="2,2" />
        <circle cx="100" cy="100" r="75" />
        <circle cx="100" cy="100" r="60" strokeDasharray="3,3" />
      </svg>
    </div>
  );
}

/**
 * Realistic ink stamp component (scalloped/circular with tilt and ink texture)
 */
interface PassportStampProps {
  text?: string;
  subtext?: string;
  date?: string;
  variant?: 'red' | 'navy' | 'gold' | 'green';
  rotate?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PassportStamp({
  text = 'LOVE APPROVED',
  subtext = 'FOREVER & ALWAYS',
  date = '20.12.2026',
  variant = 'red',
  rotate = -5,
  className = '',
  size = 'md',
}: PassportStampProps) {
  const colorMap = {
    red: 'border-[#8E2835] text-[#8E2835]',
    navy: 'border-[#1D3557] text-[#1D3557]',
    gold: 'border-[#9A7B38] text-[#9A7B38]',
    green: 'border-[#455A44] text-[#455A44]',
  };

  const sizeClasses = {
    sm: 'w-24 h-24 text-[8px]',
    md: 'w-32 h-32 sm:w-36 sm:h-36 text-[10px]',
    lg: 'w-40 h-40 sm:w-44 sm:h-44 text-[11px]',
  };

  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-flex flex-col items-center justify-center rounded-full border-2 border-dashed ${colorMap[variant]} ${sizeClasses[size]} p-2 select-none opacity-90 transition-transform ${className}`}
    >
      <div className="w-full h-full rounded-full border border-current flex flex-col items-center justify-center p-1 text-center font-serif-title tracking-wider leading-tight">
        <span className="text-[7px] uppercase font-bold tracking-[0.2em] opacity-80">
          PASSPORT IMMIGRATION
        </span>
        <div className="w-8 h-px bg-current my-0.5 opacity-60" />
        <span className="font-bold text-xs sm:text-sm uppercase tracking-widest my-0.5">
          {text}
        </span>
        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest my-0.5 font-bold">
          ★ {date} ★
        </span>
        <div className="w-8 h-px bg-current my-0.5 opacity-60" />
        <span className="text-[7px] uppercase tracking-widest font-sans font-semibold opacity-85">
          {subtext}
        </span>
      </div>
    </div>
  );
}

/**
 * Rectangular Visa Entry Stamp
 */
interface VisaEntryStampProps {
  title?: string;
  city?: string;
  date?: string;
  status?: string;
  rotate?: number;
  className?: string;
}

export function VisaEntryStamp({
  title = 'VISA OF LOVE',
  city = 'DESTINY CITY',
  date = '20.12.2026',
  status = 'ENTRY PERMITTED',
  rotate = 3,
  className = '',
}: VisaEntryStampProps) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block border-2 border-[#8E2835]/85 text-[#8E2835] rounded-xl px-4 py-2.5 font-serif-title text-center select-none shadow-xs backdrop-blur-2xs ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#8E2835]/40 pb-1 mb-1">
        <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
          {title}
        </span>
        <span className="text-[9px] font-mono font-bold">№ LV-FOREVER</span>
      </div>
      <div className="text-xs sm:text-sm font-bold tracking-wider uppercase">
        {city}
      </div>
      <div className="text-[10px] font-mono tracking-widest my-0.5 font-bold">
        VALID: {date} ➔ ETERNITY
      </div>
      <div className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#8E2835]/90 border-t border-[#8E2835]/40 pt-1 mt-1 uppercase">
        ✓ {status}
      </div>
    </div>
  );
}

/**
 * Decorative Airplane Route Vector Curve
 */
export function AirplaneRoutePath({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center w-full overflow-hidden ${className}`}>
      <svg
        className="w-full max-w-2xl h-12 text-[#B99552]"
        viewBox="0 0 600 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 20 Q 150 -5 300 20 T 590 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          strokeOpacity="0.7"
        />
        {/* Airplane glyph in center */}
        <g transform="translate(290, 10)">
          <path
            d="M 10 0 L 14 10 L 22 12 L 14 14 L 14 20 L 10 16 L 6 20 L 6 14 L -2 12 L 6 10 Z"
            fill="currentColor"
            transform="scale(0.8) rotate(90 10 10)"
          />
        </g>
        {/* Departure and destination node markers */}
        <circle cx="12" cy="20" r="4" fill="#651F2A" stroke="#B99552" strokeWidth="1.5" />
        <circle cx="588" cy="20" r="4" fill="#651F2A" stroke="#B99552" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/**
 * Clean SVG Barcode for Boarding Pass and Identity Page
 */
export function BarcodeSvg({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-hidden="true">
      <div className="w-1.5 h-10 bg-current" />
      <div className="w-0.5 h-10 bg-current" />
      <div className="w-2 h-10 bg-current" />
      <div className="w-1 h-10 bg-current" />
      <div className="w-0.5 h-10 bg-current" />
      <div className="w-1.5 h-10 bg-current" />
      <div className="w-3 h-10 bg-current" />
      <div className="w-0.5 h-10 bg-current" />
      <div className="w-2 h-10 bg-current" />
      <div className="w-1 h-10 bg-current" />
      <div className="w-0.5 h-10 bg-current" />
      <div className="w-2.5 h-10 bg-current" />
      <div className="w-1 h-10 bg-current" />
      <div className="w-0.5 h-10 bg-current" />
      <div className="w-2 h-10 bg-current" />
      <div className="w-1.5 h-10 bg-current" />
      <div className="w-0.5 h-10 bg-current" />
      <div className="w-3 h-10 bg-current" />
      <div className="w-1 h-10 bg-current" />
      <div className="w-2 h-10 bg-current" />
      <div className="w-0.5 h-10 bg-current" />
      <div className="w-1.5 h-10 bg-current" />
    </div>
  );
}

/**
 * Compass Rose Decorative Vector
 */
export function CompassRose({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-12 h-12 text-[#B99552] ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="50" cy="50" r="44" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
      <circle cx="50" cy="50" r="38" strokeWidth="0.75" opacity="0.7" />
      {/* North / South / East / West needles */}
      <polygon points="50,12 54,46 50,42 46,46" fill="#651F2A" stroke="none" />
      <polygon points="50,88 54,54 50,58 46,54" fill="#B99552" stroke="none" />
      <polygon points="12,50 46,54 42,50 46,46" fill="#B99552" stroke="none" />
      <polygon points="88,50 54,54 58,50 54,46" fill="#B99552" stroke="none" />
      <circle cx="50" cy="50" r="4" fill="#651F2A" />
      <text x="50" y="8" fontSize="8" textAnchor="middle" fill="#651F2A" fontWeight="bold" fontFamily="sans-serif">
        N
      </text>
    </svg>
  );
}
