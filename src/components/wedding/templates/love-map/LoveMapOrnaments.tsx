import React from 'react';

/**
 * Paper noise and vintage map texture overlay
 */
export function LoveMapPaperTexture() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Topographic and map contour curves background
 */
export function LoveMapContourBackground({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-[0.07] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M-50,200 C200,100 400,350 700,150 C900,50 1050,280 1100,200"
        fill="none"
        stroke="#722238"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <path
        d="M-50,350 C150,250 350,500 650,300 C850,200 950,450 1100,350"
        fill="none"
        stroke="#B9985A"
        strokeWidth="1.2"
      />
      <path
        d="M-50,550 C250,450 450,700 750,500 C950,400 1000,600 1100,550"
        fill="none"
        stroke="#53665A"
        strokeWidth="1.2"
        strokeDasharray="6 3"
      />
      <circle cx="200" cy="150" r="80" fill="none" stroke="#B9985A" strokeWidth="0.8" opacity="0.6" />
      <circle cx="200" cy="150" r="140" fill="none" stroke="#B9985A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="780" cy="620" r="100" fill="none" stroke="#722238" strokeWidth="0.8" opacity="0.6" />
      <circle cx="780" cy="620" r="160" fill="none" stroke="#722238" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
    </svg>
  );
}

/**
 * Vintage Nautical Compass Rose
 */
export function CompassRose({ className = 'w-16 h-16', rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg
      className={`transition-transform duration-700 select-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Compass"
    >
      <circle cx="50" cy="50" r="46" stroke="#B9985A" strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="41" stroke="#B9985A" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="33" stroke="#722238" strokeWidth="0.6" opacity="0.6" />
      
      {/* Cardinal Points */}
      {/* North */}
      <polygon points="50,10 54,46 50,42" fill="#722238" />
      <polygon points="50,10 46,46 50,42" fill="#B9985A" />
      {/* South */}
      <polygon points="50,90 54,54 50,58" fill="#B9985A" />
      <polygon points="50,90 46,54 50,58" fill="#53665A" />
      {/* East */}
      <polygon points="90,50 54,54 58,50" fill="#B9985A" />
      <polygon points="90,50 54,46 58,50" fill="#722238" />
      {/* West */}
      <polygon points="10,50 46,54 42,50" fill="#53665A" />
      <polygon points="10,50 46,46 42,50" fill="#B9985A" />

      {/* Center Pivot */}
      <circle cx="50" cy="50" r="4" fill="#B9985A" />
      <circle cx="50" cy="50" r="1.5" fill="#FFFDF9" />
      
      {/* N Letter */}
      <text x="50" y="6" fill="#722238" fontSize="6" fontWeight="bold" fontFamily="serif" textAnchor="middle">
        N
      </text>
    </svg>
  );
}

/**
 * Airplane travel route indicator
 */
export function TravelPlaneIcon({ className = 'w-5 h-5 text-[#722238]' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" />
    </svg>
  );
}

/**
 * Vintage Postage Stamp Border wrapper
 */
export function StampBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative p-3 bg-[#FFFDF9] border border-[#B9985A]/35 shadow-md ${className}`}
      style={{
        boxShadow: '0 4px 15px rgba(68, 59, 53, 0.08)',
      }}
    >
      {/* Postage Stamp edge serrations */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-repeat-x flex justify-between pointer-events-none -mt-1 px-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#F5EFE3] -mt-0.5" />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-repeat-x flex justify-between pointer-events-none -mb-1 px-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#F5EFE3] -mb-0.5" />
        ))}
      </div>
      {children}
    </div>
  );
}

/**
 * Vintage Postal Stamp Mark (Dấu mộc bưu điện)
 */
export function LovePostalStamp({
  date = '20.12.2026',
  city = 'OUR WEDDING',
  className = '',
}: {
  date?: string;
  city?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-24 h-24 rounded-full border-2 border-dashed border-[#722238]/60 flex flex-col items-center justify-center text-[#722238] select-none p-1.5 transform -rotate-12 ${className}`}
    >
      <div className="w-full h-full rounded-full border border-[#722238]/40 flex flex-col items-center justify-center p-1">
        <span className="text-[7px] uppercase font-bold tracking-widest text-[#722238]/80 text-center">
          {city}
        </span>
        <div className="w-8 h-[1px] bg-[#722238]/40 my-0.5" />
        <span className="font-serif text-[11px] font-bold text-[#722238] tracking-wider">
          {date}
        </span>
        <div className="w-8 h-[1px] bg-[#722238]/40 my-0.5" />
        <span className="text-[6.5px] uppercase tracking-widest text-[#B9985A] font-semibold">
          ★ LOVE POST ★
        </span>
      </div>
    </div>
  );
}

/**
 * Curving dashed route connector between elements
 */
export function RouteCurve({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-full h-16 pointer-events-none overflow-visible ${className}`} viewBox="0 0 400 60" fill="none">
      <path
        d="M10,10 C120,50 280,-10 390,35"
        stroke="#B9985A"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      <circle cx="10" cy="10" r="4" fill="#722238" />
      <circle cx="390" cy="35" r="4" fill="#B9985A" />
    </svg>
  );
}
