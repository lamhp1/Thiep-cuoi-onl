import React, { useState } from 'react';

/**
 * Play a soothing, crystal moonlight chime using the Web Audio API
 */
export function playMoonlightChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Celestial chime chord frequencies (Pentatonic E-major: E5, G#5, B5, E6, G#6)
    const freqs = [659.25, 830.61, 987.77, 1318.51, 1661.22];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Ethereal bell envelope
      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.09 / (idx + 1), now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + idx * 0.08 + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.3);
    });
  } catch (err) {
    console.warn('Moonlight chime could not be initialized:', err);
  }
}

/**
 * Detailed Artistic Glowing Moon (Mặt Trăng Nghệ Thuật)
 * Features subtle lunar topography, craters, soft outer corona glow, and clickable pulse.
 */
interface DetailedMoonProps {
  size?: number;
  className?: string;
  glowColor?: string;
  showRays?: boolean;
  interactive?: boolean;
  pulseTrigger?: number;
}

export function DetailedMoon({
  size = 280,
  className = '',
  glowColor = 'rgba(244, 228, 186, 0.45)',
  showRays = true,
  interactive = true,
  pulseTrigger = 0,
}: DetailedMoonProps) {
  const [isRippling, setIsRippling] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    setIsRippling(true);
    playMoonlightChime();
    setTimeout(() => setIsRippling(false), 1400);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative select-none flex items-center justify-center transition-transform duration-700 ${
        interactive ? 'cursor-pointer group hover:scale-[1.03]' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      title={interactive ? 'Chạm để đón ánh trăng phước lành ✨' : 'Vầng trăng dạ nguyệt'}
    >
      {/* Outer Ethereal Moonlight Corona / Glow Halo */}
      <div
        className="absolute inset-[-20%] rounded-full pointer-events-none blur-3xl transition-opacity duration-700 opacity-60 group-hover:opacity-90 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(235, 212, 148, 0.25) 45%, rgba(53, 8, 20, 0) 75%)`,
        }}
      />

      {/* Second Inner Golden Ring */}
      <div
        className="absolute inset-[-6%] rounded-full pointer-events-none blur-xl opacity-80"
        style={{
          background: `radial-gradient(circle, rgba(255, 248, 225, 0.8) 0%, rgba(244, 228, 186, 0.4) 60%, transparent 80%)`,
        }}
      />

      {/* Ripple Wave when tapped */}
      {(isRippling || pulseTrigger > 0) && (
        <div className="absolute inset-0 rounded-full border-2 border-[#F4E4BA]/80 animate-ping pointer-events-none" />
      )}

      {/* High-detail SVG Moon Disc */}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative z-10 drop-shadow-[0_0_35px_rgba(244,228,186,0.7)]"
      >
        <defs>
          {/* Main Moon Sphere Gradient */}
          <radialGradient id="moonSphereGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="35%" stopColor="#F9F3DC" />
            <stop offset="70%" stopColor="#EADBAC" />
            <stop offset="92%" stopColor="#C8B47E" />
            <stop offset="100%" stopColor="#9C8550" />
          </radialGradient>

          {/* Maria / Lunar Dark Seas Gradients */}
          <radialGradient id="mareGrad1" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#BFAF7F" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8C7A4A" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="mareGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A89768" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7E6C3D" stopOpacity="0" />
          </radialGradient>

          {/* Soft Lunar Rim Glow Filter */}
          <filter id="moonSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Ring Ornament */}
        <circle
          cx="100"
          cy="100"
          r="99"
          fill="none"
          stroke="#F4E4BA"
          strokeWidth="0.8"
          strokeOpacity="0.4"
          strokeDasharray="4 6"
        />

        {/* The Moon Disc */}
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="url(#moonSphereGrad)"
        />

        {/* Lunar Seas (Maria) Topography Details */}
        {/* Oceanus Procellarum / Mare Imbrium */}
        <path
          d="M 45 65 Q 60 50, 85 55 T 120 70 Q 110 90, 80 95 T 50 85 Z"
          fill="url(#mareGrad1)"
        />
        {/* Mare Serenitatis & Tranquillitatis */}
        <path
          d="M 105 75 Q 135 70, 150 90 T 140 125 Q 115 120, 110 95 Z"
          fill="url(#mareGrad2)"
        />
        {/* Mare Crisium */}
        <ellipse cx="156" cy="78" rx="14" ry="11" fill="url(#mareGrad1)" />
        {/* Mare Fecunditatis */}
        <path
          d="M 125 120 Q 155 125, 145 150 T 115 145 Q 110 130, 125 120 Z"
          fill="url(#mareGrad2)"
        />
        {/* Mare Nubium & Humorum */}
        <path
          d="M 60 115 Q 85 110, 80 140 T 55 155 Q 45 135, 60 115 Z"
          fill="url(#mareGrad1)"
        />

        {/* Iconic Lunar Craters with soft highlights */}
        {/* Tycho crater at bottom with rays */}
        {showRays && (
          <g opacity="0.35">
            <line x1="88" y1="168" x2="35" y2="120" stroke="#FFF" strokeWidth="0.8" strokeDasharray="1 3" />
            <line x1="88" y1="168" x2="140" y2="130" stroke="#FFF" strokeWidth="0.8" strokeDasharray="1 3" />
            <line x1="88" y1="168" x2="95" y2="90" stroke="#FFF" strokeWidth="0.8" strokeDasharray="1 3" />
          </g>
        )}
        <circle cx="88" cy="168" r="4.5" fill="#CBB682" stroke="#FFFDF8" strokeWidth="0.75" />
        <circle cx="87" cy="167" r="1.5" fill="#FFFDF8" opacity="0.8" />

        {/* Copernicus crater */}
        <circle cx="70" cy="98" r="5" fill="#C5B17B" stroke="#FFF" strokeWidth="0.6" opacity="0.8" />
        {/* Kepler crater */}
        <circle cx="50" cy="95" r="3" fill="#C5B17B" stroke="#FFF" strokeWidth="0.5" opacity="0.7" />

        {/* Delicate Golden Filigree Moon Border */}
        <circle
          cx="100"
          cy="100"
          r="93.5"
          fill="none"
          stroke="rgba(244, 228, 186, 0.6)"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}

/**
 * Artistic Blooming Lotus (Hoa Sen Nở Dần)
 * Physically unfurls multi-layered petals (cánh ngoài, cánh giữa, cánh trong, nhụy sen)
 * based on `bloomProgress` (range 0 to 1).
 */
interface ArtisticBloomingLotusProps {
  bloomProgress?: number; // 0 to 1
  size?: number;
  className?: string;
  colorScheme?: 'rose-gold' | 'ivory-gold' | 'burgundy-blush';
}

export function ArtisticBloomingLotus({
  bloomProgress = 1,
  size = 180,
  className = '',
  colorScheme = 'rose-gold',
}: ArtisticBloomingLotusProps) {
  // Clamp progress between 0 and 1
  const p = Math.min(1, Math.max(0, bloomProgress));

  // Dynamic petal opening angles based on scroll/progress
  const outerAngle = 18 + p * 38; // degrees
  const midAngle = 10 + p * 22;
  const innerScale = 0.7 + p * 0.35;
  const opacityVal = 0.55 + p * 0.45;

  return (
    <div
      className={`relative inline-block select-none transition-all duration-500 ease-out ${className}`}
      style={{ width: size, height: size * 0.85 }}
    >
      <svg
        viewBox="0 0 200 170"
        width={size}
        height={size * 0.85}
        className="overflow-visible filter drop-shadow-[0_4px_16px_rgba(244,228,186,0.3)]"
      >
        <defs>
          {/* Outer Petal Gradient */}
          <linearGradient id="lotusOuterPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#751A29" />
            <stop offset="40%" stopColor="#BA2B42" />
            <stop offset="85%" stopColor="#F5B8C4" />
            <stop offset="100%" stopColor="#FFF2F4" />
          </linearGradient>

          {/* Mid Petal Gradient */}
          <linearGradient id="lotusMidPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#962236" />
            <stop offset="50%" stopColor="#E06D84" />
            <stop offset="90%" stopColor="#FCDCE3" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Center Petal Gradient */}
          <linearGradient id="lotusCenterPetalGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#C43852" />
            <stop offset="60%" stopColor="#F5A3B3" />
            <stop offset="100%" stopColor="#FFFDF7" />
          </linearGradient>

          {/* Golden Stamen & Seed Pod Gradient */}
          <radialGradient id="lotusStamenGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF3CE" />
            <stop offset="45%" stopColor="#F4D06F" />
            <stop offset="90%" stopColor="#B8860B" />
          </radialGradient>
        </defs>

        {/* 1. Base Lotus Leaf / Water Pad Reflection */}
        <g opacity={0.65}>
          <ellipse
            cx="100"
            cy="150"
            rx="75"
            ry="12"
            fill="none"
            stroke="#EBD494"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          <ellipse
            cx="100"
            cy="150"
            rx="45"
            ry="7"
            fill="none"
            stroke="#F4E4BA"
            strokeWidth="0.6"
            strokeDasharray="2 4"
            strokeOpacity="0.5"
          />
        </g>

        {/* 2. Tier 1: Outer Wide Petals (Left & Right - Spread out as p increases) */}
        <g opacity={opacityVal}>
          {/* Far Left Outer Petal */}
          <g transform={`rotate(${-outerAngle * 0.95}, 100, 142)`}>
            <path
              d="M 100 142 C 60 135, 15 110, 30 75 C 45 45, 80 90, 100 142 Z"
              fill="url(#lotusOuterPetalGrad)"
              stroke="#F4E4BA"
              strokeWidth="0.75"
              strokeOpacity="0.6"
            />
          </g>

          {/* Far Right Outer Petal */}
          <g transform={`rotate(${outerAngle * 0.95}, 100, 142)`}>
            <path
              d="M 100 142 C 140 135, 185 110, 170 75 C 155 45, 120 90, 100 142 Z"
              fill="url(#lotusOuterPetalGrad)"
              stroke="#F4E4BA"
              strokeWidth="0.75"
              strokeOpacity="0.6"
            />
          </g>

          {/* Medium Left Outer Petal */}
          <g transform={`rotate(${-outerAngle * 0.6}, 100, 142)`}>
            <path
              d="M 100 142 C 65 125, 30 90, 48 55 C 65 25, 90 75, 100 142 Z"
              fill="url(#lotusOuterPetalGrad)"
              stroke="#F4E4BA"
              strokeWidth="0.7"
              strokeOpacity="0.6"
            />
          </g>

          {/* Medium Right Outer Petal */}
          <g transform={`rotate(${outerAngle * 0.6}, 100, 142)`}>
            <path
              d="M 100 142 C 135 125, 170 90, 152 55 C 135 25, 110 75, 100 142 Z"
              fill="url(#lotusOuterPetalGrad)"
              stroke="#F4E4BA"
              strokeWidth="0.7"
              strokeOpacity="0.6"
            />
          </g>
        </g>

        {/* 3. Tier 2: Mid Petals (Blooming Gracefully) */}
        <g opacity={0.92}>
          {/* Mid Left */}
          <g transform={`rotate(${-midAngle}, 100, 142)`}>
            <path
              d="M 100 142 C 70 120, 50 70, 70 38 C 85 15, 95 65, 100 142 Z"
              fill="url(#lotusMidPetalGrad)"
              stroke="#F4E4BA"
              strokeWidth="0.7"
              strokeOpacity="0.7"
            />
          </g>

          {/* Mid Right */}
          <g transform={`rotate(${midAngle}, 100, 142)`}>
            <path
              d="M 100 142 C 130 120, 150 70, 130 38 C 115 15, 105 65, 100 142 Z"
              fill="url(#lotusMidPetalGrad)"
              stroke="#F4E4BA"
              strokeWidth="0.7"
              strokeOpacity="0.7"
            />
          </g>
        </g>

        {/* 4. Tier 3: Center Queen Petal (Tall and Majestic) */}
        <g transform={`scale(${innerScale})`} style={{ transformOrigin: '100px 142px' }}>
          <path
            d="M 100 142 C 78 105, 78 50, 100 16 C 122 50, 122 105, 100 142 Z"
            fill="url(#lotusCenterPetalGrad)"
            stroke="#FFF4D0"
            strokeWidth="0.8"
            strokeOpacity="0.85"
          />
          {/* Center Petal Rib / Vein */}
          <line
            x1="100"
            y1="140"
            x2="100"
            y2="30"
            stroke="#FFFDF7"
            strokeWidth="0.7"
            strokeOpacity="0.75"
          />
        </g>

        {/* 5. Golden Center Stamen (Nhụy Sen Hoàng Kim) */}
        <g opacity={p > 0.3 ? 1 : 0.4} className="transition-opacity duration-500">
          <ellipse cx="100" cy="132" rx="14" ry="7" fill="url(#lotusStamenGrad)" />
          {/* Glowing stamen dots */}
          <circle cx="95" cy="131" r="1.5" fill="#FFF" />
          <circle cx="100" cy="130" r="1.5" fill="#FFF" />
          <circle cx="105" cy="131" r="1.5" fill="#FFF" />
          <circle cx="92" cy="133" r="1.2" fill="#FFEAA7" />
          <circle cx="108" cy="133" r="1.2" fill="#FFEAA7" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Stylized Oriental Ethereal Clouds (Mây Cát Tường Dạ Nguyệt)
 * Gently drifts horizontally across the sky with soft gradients.
 */
interface CelestialCloudsProps {
  className?: string;
  direction?: 'left' | 'right';
  opacity?: number;
}

export function CelestialClouds({
  className = '',
  direction = 'left',
  opacity = 0.45,
}: CelestialCloudsProps) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${
        direction === 'left' ? 'animate-cloud-drift-slow-left' : 'animate-cloud-drift-slow-right'
      } ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 500 140"
        width="100%"
        height="100%"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F4E4BA" stopOpacity="0" />
            <stop offset="25%" stopColor="#F4E4BA" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#FFF8E7" stopOpacity="0.4" />
            <stop offset="75%" stopColor="#F4E4BA" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F4E4BA" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Flowing Cloud Waves with oriental scrolls */}
        <path
          d="M 10 90 C 40 90, 60 70, 90 70 C 120 70, 130 50, 160 50 C 190 50, 210 65, 240 65 C 270 65, 290 40, 330 40 C 370 40, 390 60, 420 60 C 450 60, 470 85, 490 85 C 470 95, 430 95, 400 90 C 360 85, 340 105, 300 105 C 260 105, 240 85, 200 85 C 160 85, 140 105, 100 105 C 60 105, 40 90, 10 90 Z"
          fill="url(#cloudGrad)"
        />

        {/* Delicate Golden Wave Accent Line */}
        <path
          d="M 30 85 C 80 85, 100 65, 150 65 C 200 65, 220 45, 270 45 C 320 45, 340 70, 390 70 C 440 70, 460 90, 480 90"
          fill="none"
          stroke="#F4E4BA"
          strokeWidth="0.8"
          strokeOpacity="0.35"
          strokeDasharray="4 6"
        />
      </svg>
    </div>
  );
}

/**
 * Floating Lotus Petals (Cánh Sen Bay Trong Đêm)
 */
export function LotusPetalsFalling() {
  const petals = [
    { left: '8%', delay: '0s', dur: '11s', size: 18, rot: 15 },
    { left: '22%', delay: '2.5s', dur: '13s', size: 22, rot: -25 },
    { left: '38%', delay: '5s', dur: '10s', size: 16, rot: 40 },
    { left: '55%', delay: '1.2s', dur: '14s', size: 24, rot: -10 },
    { left: '72%', delay: '4s', dur: '12s', size: 19, rot: 30 },
    { left: '86%', delay: '7s', dur: '15s', size: 20, rot: -35 },
    { left: '94%', delay: '3.2s', dur: '11.5s', size: 17, rot: 20 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {petals.map((item, idx) => (
        <div
          key={idx}
          className="absolute top-[-40px] animate-lotus-petal-fall opacity-70"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.dur,
          }}
        >
          <svg
            width={item.size}
            height={item.size * 1.5}
            viewBox="0 0 20 30"
            style={{ transform: `rotate(${item.rot}deg)` }}
            className="filter drop-shadow-[0_2px_4px_rgba(117,26,41,0.3)]"
          >
            <path
              d="M 10 0 C 18 8, 18 20, 10 30 C 2 20, 2 8, 10 0 Z"
              fill="url(#fallingPetalGrad)"
            />
            <defs>
              <linearGradient id="fallingPetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF0F3" />
                <stop offset="50%" stopColor="#F49EB0" />
                <stop offset="100%" stopColor="#A8283D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
