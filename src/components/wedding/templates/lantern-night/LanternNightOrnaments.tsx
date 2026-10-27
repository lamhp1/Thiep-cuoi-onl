import React from 'react';

interface LanternProps {
  className?: string;
  glowIntensity?: number; // 0 to 1
  colorVariant?: 'amber' | 'burgundy' | 'crimson' | 'gold';
  isInteracted?: boolean;
}

export function SparklingStar({ className = 'w-4 h-4 text-amber-300' }: { className?: string }) {
  return (
    <span className={`inline-block select-none animate-star-twinkle ${className}`} aria-hidden="true">
      ✦
    </span>
  );
}

export function NightCrescentMoon({ className = 'w-12 h-12 text-amber-200/80' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <path d="M50 10 A40 40 0 1 0 90 50 A32 32 0 1 1 50 10 Z" />
    </svg>
  );
}

export function VietnameseCloudOrnament({ className = 'w-24 h-8 text-amber-500/30' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M20,45 C20,35 30,25 45,25 C48,15 60,10 75,15 C85,8 105,8 115,18 C125,12 145,14 150,25 C165,22 180,32 180,45 C180,50 175,55 165,55 L35,55 C25,55 20,50 20,45 Z" />
      <path d="M45,45 C55,42 65,42 75,45" opacity="0.6" />
      <path d="M100,42 C115,38 130,42 145,45" opacity="0.6" />
    </svg>
  );
}

export function LotusNightIcon({ className = 'w-6 h-6 text-amber-400' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M32 10 C32 24 24 38 12 44 C22 48 30 46 32 54 C34 46 42 48 52 44 C40 38 32 24 32 10 Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M32 26 C26 36 18 42 6 46 C16 50 24 49 26 54 C29 48 35 48 38 54 C40 49 48 50 58 46 C46 42 38 36 32 26 Z" />
      <path d="M32 38 C32 46 30 52 28 54 C32 55 32 55 36 54 C34 52 32 46 32 38 Z" />
      <circle cx="32" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

/**
 * Traditional Vietnamese Diamond Lantern (Đèn Lồng Quả Trám Hội An)
 */
export function HoiAnDiamondLantern({
  className = 'w-16 h-36',
  glowIntensity = 0.5,
  colorVariant = 'amber',
  isInteracted = false,
}: LanternProps) {
  const effectiveGlow = Math.min(1.4, Math.max(0.2, glowIntensity + (isInteracted ? 0.4 : 0)));
  
  // Palette setup based on variant
  const palette = {
    amber: {
      silkStart: '#F59E0B',
      silkMid: '#D97706',
      silkEnd: '#78350F',
      coreGlow: 'rgba(253, 230, 138, 0.95)',
      tassel: '#FBBF24',
    },
    burgundy: {
      silkStart: '#BE123C',
      silkMid: '#881337',
      silkEnd: '#4C0519',
      coreGlow: 'rgba(254, 205, 211, 0.9)',
      tassel: '#F59E0B',
    },
    crimson: {
      silkStart: '#DC2626',
      silkMid: '#991B1B',
      silkEnd: '#450A0A',
      coreGlow: 'rgba(254, 226, 226, 0.9)',
      tassel: '#FBBF24',
    },
    gold: {
      silkStart: '#FDE047',
      silkMid: '#EAB308',
      silkEnd: '#854D0E',
      coreGlow: 'rgba(254, 240, 138, 0.95)',
      tassel: '#FDE047',
    },
  }[colorVariant];

  const glowBlur = Math.round(12 + effectiveGlow * 28);
  const glowOpacity = Math.min(1, 0.35 + effectiveGlow * 0.65);

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none transition-all duration-700 ${className}`}
      style={{
        filter: `drop-shadow(0 0 ${glowBlur}px rgba(245, 158, 11, ${glowOpacity}))`,
      }}
    >
      {/* Hanging Cord */}
      <div className="w-[1.5px] h-10 bg-linear-to-b from-amber-400/40 via-amber-300 to-yellow-600/80" />

      {/* Top Wooden Cap with Brass Ring */}
      <div className="w-8 h-2.5 rounded-xs bg-linear-to-r from-amber-950 via-yellow-800 to-amber-950 border border-amber-600/40 shadow-xs relative z-10 flex items-center justify-center">
        <div className="w-4 h-1 bg-yellow-400/40 rounded-full" />
      </div>

      {/* Main Lantern Silk Body (Diamond Shape) */}
      <div className="relative w-16 h-28 my-[-2px] flex items-center justify-center">
        <svg viewBox="0 0 100 160" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id={`glow-diamond-${colorVariant}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={palette.coreGlow} stopOpacity={effectiveGlow} />
              <stop offset="60%" stopColor={palette.silkStart} stopOpacity={0.85} />
              <stop offset="100%" stopColor={palette.silkEnd} stopOpacity={0.95} />
            </radialGradient>
            <linearGradient id={`silk-shimmer-${colorVariant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF" stopOpacity={0.25 * effectiveGlow} />
              <stop offset="50%" stopColor="transparent" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Diamond Silhouette */}
          <path
            d="M50,5 L95,80 L50,155 L5,80 Z"
            fill={`url(#glow-diamond-${colorVariant})`}
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* Bamboo Ribs (Nan tre) Curved Accents */}
          <path d="M50,5 Q75,80 50,155" fill="none" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.6" />
          <path d="M50,5 Q25,80 50,155" fill="none" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.6" />
          <path d="M50,5 L50,155" fill="none" stroke="#FDE68A" strokeWidth="1.2" strokeOpacity="0.75" />
          <path d="M5,80 L95,80" fill="none" stroke="#FBBF24" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 2" />

          {/* Inner Candle Glow Flame */}
          <circle
            cx="50"
            cy="80"
            r={16 * effectiveGlow}
            fill="#FFFBEB"
            className="animate-lantern-core"
            style={{
              filter: `blur(${3}px)`,
              opacity: 0.85 * effectiveGlow,
            }}
          />
        </svg>

        {/* Ambient Expanding Radial Bloom */}
        <div
          className="absolute inset-0 -m-4 rounded-full pointer-events-none transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(251, 191, 36, ${0.45 * effectiveGlow}) 0%, rgba(217, 119, 6, ${0.2 * effectiveGlow}) 50%, transparent 75%)`,
            opacity: effectiveGlow,
          }}
        />
      </div>

      {/* Bottom Wooden Cap */}
      <div className="w-7 h-2 rounded-xs bg-linear-to-r from-amber-950 via-yellow-800 to-amber-950 border border-amber-600/40 shadow-xs relative z-10" />

      {/* Golden Silk Tassel (Tua rua vàng kim) */}
      <div className="relative flex flex-col items-center animate-lantern-tassel">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-xs" />
        <div className="w-3 h-1 bg-amber-600/80 rounded-full" />
        <div className="flex gap-[1.5px] items-start pt-0.5">
          <div className="w-[1px] h-10 bg-linear-to-b from-amber-300 via-yellow-400 to-amber-600" />
          <div className="w-[1.2px] h-12 bg-linear-to-b from-yellow-300 via-amber-400 to-yellow-600 shadow-xs" />
          <div className="w-[1px] h-11 bg-linear-to-b from-amber-200 via-yellow-400 to-amber-700" />
          <div className="w-[1.2px] h-12 bg-linear-to-b from-amber-300 via-yellow-500 to-amber-600" />
          <div className="w-[1px] h-10 bg-linear-to-b from-amber-400 via-yellow-400 to-amber-600" />
        </div>
      </div>
    </div>
  );
}

/**
 * Traditional Vietnamese Globe Lantern (Đèn Lồng Cầu Hội An)
 */
export function HoiAnGlobeLantern({
  className = 'w-16 h-34',
  glowIntensity = 0.5,
  colorVariant = 'burgundy',
  isInteracted = false,
}: LanternProps) {
  const effectiveGlow = Math.min(1.4, Math.max(0.2, glowIntensity + (isInteracted ? 0.4 : 0)));

  const palette = {
    amber: {
      start: '#F59E0B',
      mid: '#B45309',
      end: '#78350F',
      core: '#FEF08A',
    },
    burgundy: {
      start: '#E11D48',
      mid: '#9F1239',
      end: '#4C0519',
      core: '#FFE4E6',
    },
    crimson: {
      start: '#EF4444',
      mid: '#B91C1C',
      end: '#450A0A',
      core: '#FEE2E2',
    },
    gold: {
      start: '#FACC15',
      mid: '#CA8A04',
      end: '#713F12',
      core: '#FEF9C3',
    },
  }[colorVariant];

  const glowBlur = Math.round(14 + effectiveGlow * 26);
  const glowOpacity = Math.min(1, 0.35 + effectiveGlow * 0.65);

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none transition-all duration-700 ${className}`}
      style={{
        filter: `drop-shadow(0 0 ${glowBlur}px rgba(245, 158, 11, ${glowOpacity}))`,
      }}
    >
      {/* Hanging Cord */}
      <div className="w-[1.5px] h-8 bg-linear-to-b from-amber-400/30 to-amber-300" />

      {/* Top Cap */}
      <div className="w-7 h-2 rounded-xs bg-linear-to-r from-neutral-950 via-yellow-900 to-neutral-950 border border-yellow-700/50 relative z-10" />

      {/* Spherical Lantern Body */}
      <div className="relative w-16 h-20 my-[-1px] flex items-center justify-center">
        <svg viewBox="0 0 100 110" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id={`glow-globe-${colorVariant}`} cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor={palette.core} stopOpacity={effectiveGlow} />
              <stop offset="65%" stopColor={palette.start} stopOpacity={0.9} />
              <stop offset="100%" stopColor={palette.end} stopOpacity={0.98} />
            </radialGradient>
          </defs>

          {/* Oval Globe */}
          <ellipse
            cx="50"
            cy="55"
            rx="45"
            ry="50"
            fill={`url(#glow-globe-${colorVariant})`}
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeOpacity="0.75"
          />

          {/* Curving Bamboo Ribs */}
          <path d="M50,5 Q78,55 50,105" fill="none" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.6" />
          <path d="M50,5 Q22,55 50,105" fill="none" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.6" />
          <path d="M50,5 Q64,55 50,105" fill="none" stroke="#FDE68A" strokeWidth="0.8" strokeOpacity="0.4" />
          <path d="M50,5 Q36,55 50,105" fill="none" stroke="#FDE68A" strokeWidth="0.8" strokeOpacity="0.4" />
          <line x1="50" y1="5" x2="50" y2="105" stroke="#FEF08A" strokeWidth="1.2" strokeOpacity="0.7" />

          {/* Core Candle Light */}
          <circle
            cx="50"
            cy="55"
            r={15 * effectiveGlow}
            fill="#FFFBEB"
            className="animate-lantern-core"
            style={{
              filter: 'blur(3px)',
              opacity: 0.85 * effectiveGlow,
            }}
          />
        </svg>
      </div>

      {/* Bottom Cap */}
      <div className="w-6 h-2 rounded-xs bg-linear-to-r from-neutral-950 via-yellow-900 to-neutral-950 border border-yellow-700/50 relative z-10" />

      {/* Tassel */}
      <div className="relative flex flex-col items-center animate-lantern-tassel">
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-xs" />
        <div className="flex gap-[1.5px] items-start pt-0.5">
          <div className="w-[1px] h-9 bg-linear-to-b from-amber-300 to-yellow-600" />
          <div className="w-[1.2px] h-11 bg-linear-to-b from-yellow-300 to-amber-700" />
          <div className="w-[1.2px] h-11 bg-linear-to-b from-amber-200 to-yellow-600" />
          <div className="w-[1px] h-9 bg-linear-to-b from-amber-400 to-amber-700" />
        </div>
      </div>
    </div>
  );
}

/**
 * Traditional Vietnamese Garlic Bulb Lantern (Đèn Lồng Củ Tỏi Hội An)
 */
export function HoiAnGarlicLantern({
  className = 'w-16 h-36',
  glowIntensity = 0.5,
  colorVariant = 'amber',
  isInteracted = false,
}: LanternProps) {
  const effectiveGlow = Math.min(1.4, Math.max(0.2, glowIntensity + (isInteracted ? 0.4 : 0)));

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none transition-all duration-700 ${className}`}
      style={{
        filter: `drop-shadow(0 0 ${Math.round(12 + effectiveGlow * 26)}px rgba(245, 158, 11, ${0.35 + effectiveGlow * 0.65}))`,
      }}
    >
      <div className="w-[1.5px] h-12 bg-linear-to-b from-amber-400/30 to-amber-300" />
      <div className="w-7 h-2 rounded-xs bg-linear-to-r from-neutral-950 via-yellow-900 to-neutral-950 border border-yellow-700/50 relative z-10" />

      <div className="relative w-16 h-24 my-[-1px] flex items-center justify-center">
        <svg viewBox="0 0 100 130" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id={`glow-garlic-${colorVariant}`} cx="50%" cy="60%" r="55%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity={effectiveGlow} />
              <stop offset="55%" stopColor={colorVariant === 'burgundy' ? '#9F1239' : '#D97706'} stopOpacity={0.9} />
              <stop offset="100%" stopColor={colorVariant === 'burgundy' ? '#4C0519' : '#78350F'} stopOpacity={0.98} />
            </radialGradient>
          </defs>

          {/* Garlic shape: narrow top, swollen bottom */}
          <path
            d="M36,5 C42,20 20,45 10,75 C-2,105 22,125 50,125 C78,125 102,105 90,75 C80,45 58,20 64,5 Z"
            fill={`url(#glow-garlic-${colorVariant})`}
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />

          {/* Vertical Rib lines */}
          <path d="M50,5 Q70,65 50,125" fill="none" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.5" />
          <path d="M50,5 Q30,65 50,125" fill="none" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="50" y1="5" x2="50" y2="125" stroke="#FEF08A" strokeWidth="1.2" strokeOpacity="0.75" />

          {/* Candle core glow */}
          <circle
            cx="50"
            cy="75"
            r={15 * effectiveGlow}
            fill="#FFFBEB"
            className="animate-lantern-core"
            style={{
              filter: 'blur(3px)',
              opacity: 0.85 * effectiveGlow,
            }}
          />
        </svg>
      </div>

      <div className="w-6 h-2 rounded-xs bg-linear-to-r from-neutral-950 via-yellow-900 to-neutral-950 border border-yellow-700/50 relative z-10" />

      {/* Tassel */}
      <div className="relative flex flex-col items-center animate-lantern-tassel">
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-xs" />
        <div className="flex gap-[1.5px] items-start pt-0.5">
          <div className="w-[1px] h-10 bg-linear-to-b from-amber-300 to-yellow-600" />
          <div className="w-[1.2px] h-13 bg-linear-to-b from-yellow-300 to-amber-700" />
          <div className="w-[1px] h-10 bg-linear-to-b from-amber-400 to-amber-700" />
        </div>
      </div>
    </div>
  );
}

/**
 * Authentic Vietnamese Sky Lantern (Thiên Đăng / Khinh Khí Cầu Đèn Trời)
 * Distinctive recognizable shape with glowing rice paper, bamboo ring, burning flame core, and fluttering ribbons
 */
export function AuthenticSkyLantern({
  className = 'w-16 h-24',
  colorVariant = 'amber',
  scale = 1,
}: {
  className?: string;
  colorVariant?: 'amber' | 'gold' | 'crimson' | 'rose' | 'sunset';
  scale?: number;
}) {
  const palette = {
    amber: {
      bodyStart: '#FDE68A',
      bodyMid: '#F59E0B',
      bodyEnd: '#B45309',
      core: '#FFFBEB',
      flame: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.85)',
      ribbon: '#FBBF24',
    },
    gold: {
      bodyStart: '#FEF08A',
      bodyMid: '#EAB308',
      bodyEnd: '#854D0E',
      core: '#FFFFF0',
      flame: '#FBBF24',
      glow: 'rgba(234, 179, 8, 0.9)',
      ribbon: '#FDE047',
    },
    crimson: {
      bodyStart: '#FECACA',
      bodyMid: '#DC2626',
      bodyEnd: '#7F1D1D',
      core: '#FFF1F2',
      flame: '#EF4444',
      glow: 'rgba(220, 38, 38, 0.85)',
      ribbon: '#F87171',
    },
    rose: {
      bodyStart: '#FCE7F3',
      bodyMid: '#DB2777',
      bodyEnd: '#831843',
      core: '#FFF1F2',
      flame: '#EC4899',
      glow: 'rgba(219, 39, 119, 0.85)',
      ribbon: '#F472B6',
    },
    sunset: {
      bodyStart: '#FFEDD5',
      bodyMid: '#EA580C',
      bodyEnd: '#7C2D12',
      core: '#FFF7ED',
      flame: '#F97316',
      glow: 'rgba(234, 88, 12, 0.9)',
      ribbon: '#FB923C',
    },
  }[colorVariant];

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none transform-gpu will-change-transform ${className}`}
      style={{
        transform: `scale(${scale})`,
      }}
    >
      {/* Ambient Outer Halo Bloom (Composited on GPU, zero frame drops) */}
      <div
        className="absolute inset-0 -m-2 rounded-full pointer-events-none opacity-85 blur-sm"
        style={{
          background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Lantern Main Dome/Trapezoid Body */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 100 135" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id={`sky-lantern-glow-${colorVariant}`} cx="50%" cy="65%" r="65%">
              <stop offset="0%" stopColor={palette.core} stopOpacity="0.98" />
              <stop offset="35%" stopColor={palette.bodyStart} stopOpacity="0.92" />
              <stop offset="70%" stopColor={palette.bodyMid} stopOpacity="0.88" />
              <stop offset="100%" stopColor={palette.bodyEnd} stopOpacity="0.95" />
            </radialGradient>
            <linearGradient id={`sky-lantern-rib-${colorVariant}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF" stopOpacity="0.7" />
              <stop offset="70%" stopColor={palette.bodyStart} stopOpacity="0.5" />
              <stop offset="100%" stopColor="#78350F" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Classic Trapezoid / Dome Sky Lantern Silhouette */}
          <path
            d="M 22,25 C 24,8 45,3 50,3 C 55,3 76,8 78,25 C 84,48 88,86 82,108 C 80,113 20,113 18,108 C 12,86 16,48 22,25 Z"
            fill={`url(#sky-lantern-glow-${colorVariant})`}
            stroke="#D97706"
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />

          {/* Traditional Bamboo Vertical Ribs */}
          <path d="M 50,3 L 50,112" stroke={`url(#sky-lantern-rib-${colorVariant})`} strokeWidth="1.2" strokeOpacity="0.7" />
          <path d="M 50,3 Q 66,55 64,111" stroke={`url(#sky-lantern-rib-${colorVariant})`} strokeWidth="1" strokeOpacity="0.55" fill="none" />
          <path d="M 50,3 Q 34,55 36,111" stroke={`url(#sky-lantern-rib-${colorVariant})`} strokeWidth="1" strokeOpacity="0.55" fill="none" />
          <path d="M 50,3 Q 76,55 77,109" stroke={`url(#sky-lantern-rib-${colorVariant})`} strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
          <path d="M 50,3 Q 24,55 23,109" stroke={`url(#sky-lantern-rib-${colorVariant})`} strokeWidth="0.8" strokeOpacity="0.4" fill="none" />

          {/* Horizontal Bamboo Hoops (Gân tre ngang) */}
          <path d="M 20,40 Q 50,46 80,40" stroke="#B45309" strokeWidth="0.8" strokeOpacity="0.35" fill="none" />
          <path d="M 18,72 Q 50,80 82,72" stroke="#B45309" strokeWidth="0.8" strokeOpacity="0.35" fill="none" />

          {/* Lower Bamboo Ring (Vành tre đáy đèn) */}
          <ellipse cx="50" cy="112" rx="32" ry="6" fill="#451A03" stroke="#F59E0B" strokeWidth="1.5" />
          <ellipse cx="50" cy="112" rx="27" ry="4.5" fill="#1C0A00" stroke="#78350F" strokeWidth="1" />

          {/* Cross Wire for Burner */}
          <line x1="26" y1="112" x2="74" y2="112" stroke="#D97706" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="50" y1="108" x2="50" y2="116" stroke="#D97706" strokeWidth="1" strokeOpacity="0.8" />

          {/* Inner Radiant Heat Bloom */}
          <circle cx="50" cy="100" r="18" fill={palette.core} opacity="0.6" style={{ filter: 'blur(5px)' }} />

          {/* Burning Flame Cup & Dancing Fire */}
          <ellipse cx="50" cy="112" rx="5" ry="2.5" fill="#78350F" stroke="#F59E0B" strokeWidth="0.8" />
          
          {/* Flame Core */}
          <path
            d="M 46,112 C 45,103 49,94 50,92 C 51,94 55,103 54,112 Z"
            fill="#FFFBEB"
            className="animate-pulse"
          />
          <path
            d="M 47,112 C 46,105 49,98 50,96 C 51,98 54,105 53,112 Z"
            fill="#FBBF24"
            opacity="0.85"
          />
        </svg>

        {/* Fluttering Twin Lucky Ribbons Beneath */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-start gap-1.5 pointer-events-none">
          <div
            className="w-[1.5px] h-6 sm:h-8 rounded-full shadow-xs origin-top animate-water-lotus"
            style={{
              backgroundColor: palette.ribbon,
              animationDuration: '1.8s',
            }}
          />
          <div
            className="w-[1.5px] h-7 sm:h-10 rounded-full shadow-xs origin-top animate-water-lotus"
            style={{
              backgroundColor: palette.flame,
              animationDuration: '2.4s',
              animationDelay: '0.4s',
            }}
          />
        </div>
      </div>
    </div>
  );
}
