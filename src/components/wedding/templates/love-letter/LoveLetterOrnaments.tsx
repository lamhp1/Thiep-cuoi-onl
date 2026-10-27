import React from 'react';
import { motion } from 'motion/react';

/**
 * Paper Texture & Ruled Lines Overlay
 * Delivers organic paper grain, horizontal notebook ruled lines, and subtle margin lines.
 */
export function LoveLetterPaperTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Base paper grain texture */}
      <div
        className="absolute inset-0 opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(#59483e 0.6px, transparent 0.6px), radial-gradient(#7a2638 0.4px, #f7f1e7 0.4px)`,
          backgroundSize: '24px 24px, 12px 12px',
          backgroundPosition: '0 0, 6px 6px',
        }}
      />

      {/* 2. Horizontal Ruled Lines like stationery lined writing paper */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 35px,
            rgba(200, 169, 107, 0.35) 35px,
            rgba(200, 169, 107, 0.35) 36px
          )`,
          backgroundPosition: '0 18px',
        }}
      />

      {/* 3. Red/Gold left vertical margin rule line on wider viewports like classic letter paper */}
      <div
        className="hidden md:block absolute inset-y-0 left-8 lg:left-14 xl:left-20 w-[1px] bg-[#7A2638]/20"
        style={{
          boxShadow: '1px 0 0 0 rgba(200, 169, 107, 0.18)',
        }}
      />
    </div>
  );
}

/**
 * Washi Tape / Paper Tape Strip
 * Simulates adhesive paper tape holding polaroids or notes to paper.
 */
export function LoveLetterWashiTape({
  className = '',
  color = 'beige',
  angle = -2,
}: {
  className?: string;
  color?: 'beige' | 'dusty-rose' | 'sage' | 'gold';
  angle?: number;
}) {
  const colorStyles = {
    beige: 'bg-[#EADECE]/85 border-[#D8C7B0]/60 text-[#8C7662]',
    'dusty-rose': 'bg-[#E3C6C6]/80 border-[#C98F8F]/50 text-[#7A2638]',
    sage: 'bg-[#D6DDD4]/80 border-[#879583]/50 text-[#4E5C4A]',
    gold: 'bg-[#EFE3C7]/80 border-[#C8A96B]/50 text-[#8C6B28]',
  };

  return (
    <div
      className={`absolute h-4 sm:h-5 w-20 sm:w-28 shadow-xs pointer-events-none z-20 backdrop-blur-[1px] border-t border-b ${colorStyles[color]} ${className}`}
      style={{
        transform: `rotate(${angle}deg)`,
        clipPath:
          'polygon(0% 15%, 4% 0%, 96% 0%, 100% 15%, 98% 85%, 100% 100%, 4% 100%, 0% 85%)',
      }}
    />
  );
}

/**
 * Red Wax Seal / Stamp
 * Authentic vintage wax seal with organic imperfect outer edge, debossed lettering, and drop shadow.
 */
export function LoveLetterWaxSeal({
  text = 'WITH LOVE',
  size = 'md',
  stampAnimate = false,
  className = '',
}: {
  text?: 'WITH LOVE' | 'CONFIRMED' | 'SAVE THE DATE' | 'LOVE FOREVER' | 'INVITED' | 'SPECIAL';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  stampAnimate?: boolean;
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-[7px]',
    md: 'w-16 h-16 text-[8px]',
    lg: 'w-20 h-20 text-[10px]',
    xl: 'w-24 h-24 text-[11px]',
  };

  const Component = stampAnimate ? motion.div : 'div';
  const motionProps = stampAnimate
    ? {
        initial: { scale: 1.6, opacity: 0, rotate: 12 },
        animate: { scale: 1, opacity: 1, rotate: -3 },
        transition: {
          type: 'spring' as const,
          damping: 15,
          stiffness: 220,
          mass: 0.8,
        },
      }
    : {};

  return (
    <Component
      {...motionProps}
      className={`relative inline-flex items-center justify-center rounded-full select-none shadow-md ${sizeClasses[size]} ${className}`}
      style={{
        background: 'radial-gradient(circle at 35% 30%, #9E2B40 0%, #7A2638 55%, #541624 100%)',
        boxShadow:
          'inset 0 2px 3px rgba(255,255,255,0.25), inset 0 -3px 5px rgba(0,0,0,0.5), 0 6px 14px rgba(84,22,36,0.35)',
      }}
      aria-hidden="true"
    >
      {/* Outer organic irregular rim effect */}
      <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />

      {/* Inner debossed ring */}
      <div className="w-[82%] h-[82%] rounded-full border-2 border-dashed border-[#F7D8DC]/40 flex flex-col items-center justify-center p-1 text-center shadow-inner">
        {/* Heart emblem */}
        <span className="text-[#FDF2F4] text-xs leading-none mb-0.5 opacity-90 drop-shadow-xs">
          ♥
        </span>
        <span className="font-serif-title uppercase font-black tracking-widest text-[#FDF2F4] drop-shadow-sm leading-tight">
          {text}
        </span>
      </div>
    </Component>
  );
}

/**
 * Botanical Line-Art Sketch (Rose / Leaf branch)
 * Drawn in real-time with SVG stroke-dashoffset animation.
 */
export function BotanicalSketch({
  variant = 'rose',
  className = '',
}: {
  variant?: 'rose' | 'branch' | 'leaves' | 'flourish';
  className?: string;
}) {
  if (variant === 'flourish') {
    return (
      <svg
        className={`overflow-visible ${className}`}
        viewBox="0 0 160 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          d="M4 12 C 40 4, 60 20, 80 12 C 100 4, 120 20, 156 12"
          stroke="#7A2638"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="80" cy="12" r="2.5" fill="#7A2638" opacity="0.8" />
        <circle cx="72" cy="12" r="1.5" fill="#C8A96B" />
        <circle cx="88" cy="12" r="1.5" fill="#C8A96B" />
      </svg>
    );
  }

  if (variant === 'branch') {
    return (
      <svg
        className={`overflow-visible ${className}`}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Central stem */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.65 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          d="M 50 115 Q 45 60 55 10"
          stroke="#879583"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.2, ease: 'easeOut' }}
          d="M 50 95 C 30 85 20 65 35 60 C 45 65 50 80 50 95 Z"
          stroke="#879583"
          strokeWidth="1.2"
          fill="#879583"
          fillOpacity="0.08"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.4, ease: 'easeOut' }}
          d="M 51 75 C 70 65 80 45 65 40 C 55 45 51 60 51 75 Z"
          stroke="#879583"
          strokeWidth="1.2"
          fill="#879583"
          fillOpacity="0.08"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.6, ease: 'easeOut' }}
          d="M 52 45 C 38 35 32 18 45 15 C 52 20 53 35 52 45 Z"
          stroke="#879583"
          strokeWidth="1.2"
          fill="#879583"
          fillOpacity="0.08"
        />
      </svg>
    );
  }

  // Rose botanical line sketch
  return (
    <svg
      className={`overflow-visible ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Rose petals spiraling */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        d="M 60 45 C 55 35 68 32 72 40 C 76 50 62 55 58 48 C 54 42 62 38 66 42"
        stroke="#7A2638"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.65 }}
        viewport={{ once: true }}
        transition={{ duration: 1.9, delay: 0.2, ease: 'easeInOut' }}
        d="M 55 40 C 45 42 42 55 52 62 C 65 70 78 62 76 50 C 74 42 68 38 60 38"
        stroke="#C98F8F"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 2.0, delay: 0.4, ease: 'easeInOut' }}
        d="M 46 52 C 38 62 48 76 60 76 C 74 76 86 65 82 52"
        stroke="#7A2638"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Stem and sepals */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
        d="M 60 76 Q 58 95 65 115"
        stroke="#879583"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.55 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
        d="M 60 88 Q 75 80 82 85 Q 75 92 61 90"
        stroke="#879583"
        strokeWidth="1.2"
        fill="#879583"
        fillOpacity="0.1"
      />
    </svg>
  );
}

/**
 * Hand-drawn Pen underline stroke
 */
export function InkUnderline({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`overflow-visible h-3 w-full max-w-xs ${className}`}
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.75 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        d="M 2 8 C 50 3, 100 10, 150 5 C 175 3, 190 7, 198 6"
        stroke="#7A2638"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Vintage Airmail / Postage Stamp Ornament
 */
export function PostageStamp({
  date = '20.12.2026',
  city = 'HUẾ',
  className = '',
}: {
  date?: string;
  city?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-20 h-24 bg-[#FAF6EE] border-2 border-dashed border-[#C8A96B]/60 p-1.5 flex flex-col items-center justify-between text-center select-none shadow-xs rotate-3 ${className}`}
      style={{
        boxShadow: '0 2px 8px rgba(89,72,62,0.12)',
      }}
    >
      <div className="w-full flex justify-between text-[7px] font-bold text-[#7A2638] uppercase tracking-wider">
        <span>AIRMAIL</span>
        <span>♥</span>
        <span>LOVE</span>
      </div>

      <div className="my-auto w-12 h-12 rounded-full border border-[#7A2638]/40 flex flex-col items-center justify-center p-1">
        <span className="text-[7px] text-[#7A2638] font-bold tracking-widest uppercase">
          {city}
        </span>
        <span className="text-[8px] font-serif font-bold text-[#59483E] leading-none my-0.5">
          {date}
        </span>
        <span className="text-[6px] text-[#C8A96B] tracking-tighter">WEDDING</span>
      </div>

      {/* Cancellation lines */}
      <div className="w-full flex flex-col gap-0.5 opacity-40">
        <div className="h-[1px] bg-[#7A2638]" />
        <div className="h-[1px] bg-[#7A2638]" />
      </div>
    </div>
  );
}

/**
 * Realistic Vintage Fountain Pen (Cây bút máy cổ điển)
 * Features two-tone gold calligraphy nib, engraved breather hole, feed, glossy lacquer barrel, and brass clip.
 */
export function FountainPenOrnament({
  className = '',
  angle = -25,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={`select-none pointer-events-none filter drop-shadow-[0_12px_22px_rgba(89,72,62,0.28)] ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
      aria-hidden="true"
    >
      <svg
        width="270"
        height="38"
        viewBox="0 0 270 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="penGoldNib" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2C275" />
            <stop offset="35%" stopColor="#FFF4C2" />
            <stop offset="65%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9E7628" />
          </linearGradient>
          <linearGradient id="penLacquerBarrel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7A2638" />
            <stop offset="30%" stopColor="#A8364D" />
            <stop offset="60%" stopColor="#541624" />
            <stop offset="100%" stopColor="#2D0B13" />
          </linearGradient>
          <linearGradient id="penGoldTrim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B8" />
            <stop offset="50%" stopColor="#C8A96B" />
            <stop offset="100%" stopColor="#7A5617" />
          </linearGradient>
        </defs>

        {/* --- 1. Calligraphy Gold Nib --- */}
        {/* Nib tip and contour */}
        <path
          d="M 6 19 L 36 10 L 44 12 L 44 26 L 36 28 Z"
          fill="url(#penGoldNib)"
          stroke="#8A6721"
          strokeWidth="0.8"
        />
        {/* Nib slit */}
        <line x1="6" y1="19" x2="24" y2="19" stroke="#541624" strokeWidth="0.9" strokeLinecap="round" />
        {/* Heart breather hole */}
        <circle cx="24" cy="19" r="1.6" fill="#541624" />
        {/* Engraved filigree lines on nib */}
        <path
          d="M 28 14 Q 34 14 36 12 M 28 24 Q 34 24 36 26"
          stroke="#8A6721"
          strokeWidth="0.65"
          strokeLinecap="round"
        />

        {/* --- 2. Feed & Grip Section --- */}
        <rect x="44" y="13" width="7" height="12" fill="#221A17" />
        <rect x="51" y="12" width="3" height="14" fill="url(#penGoldTrim)" />
        {/* Ergonomic grip section */}
        <rect x="54" y="11" width="36" height="16" rx="2" fill="#2E2220" />
        <rect x="90" y="10" width="5" height="18" rx="1" fill="url(#penGoldTrim)" />

        {/* --- 3. Glossy Burgundy Barrel --- */}
        <rect x="95" y="10" width="135" height="18" rx="3" fill="url(#penLacquerBarrel)" />
        {/* Specular light streak along body */}
        <line x1="97" y1="13" x2="226" y2="13" stroke="rgba(255,255,255,0.42)" strokeWidth="1.3" strokeLinecap="round" />

        {/* --- 4. Gold Pocket Clip --- */}
        <rect x="180" y="5" width="34" height="3.5" rx="1.2" fill="url(#penGoldTrim)" />
        <circle cx="214" cy="6.7" r="2.8" fill="url(#penGoldTrim)" />

        {/* --- 5. Gold Trim Ring & Tapered Finial --- */}
        <rect x="230" y="10" width="4" height="18" fill="url(#penGoldTrim)" />
        <path d="M 234 11 L 258 14 Q 266 19 258 24 L 234 27 Z" fill="url(#penLacquerBarrel)" />
        <circle cx="258" cy="19" r="2.4" fill="url(#penGoldTrim)" />
      </svg>
    </div>
  );
}

/**
 * Feather Quill Pen (Cây bút lông vũ)
 */
export function QuillPenOrnament({
  className = '',
  angle = 30,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={`select-none pointer-events-none filter drop-shadow-[0_10px_20px_rgba(89,72,62,0.22)] ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
      aria-hidden="true"
    >
      <svg
        width="220"
        height="80"
        viewBox="0 0 220 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="quillVane" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF8F0" />
            <stop offset="50%" stopColor="#EFE3D3" />
            <stop offset="100%" stopColor="#D8C7B0" />
          </linearGradient>
        </defs>
        {/* Feather plume */}
        <path
          d="M 50 40 C 90 15, 160 10, 210 25 C 190 45, 140 60, 60 42 Z"
          fill="url(#quillVane)"
          stroke="#C8A96B"
          strokeWidth="0.8"
        />
        {/* Feather barb lines */}
        <path
          d="M 80 34 L 110 22 M 110 32 L 145 20 M 140 30 L 175 22 M 90 38 L 120 48 M 125 36 L 155 45"
          stroke="#C8A96B"
          strokeWidth="0.6"
          strokeOpacity="0.6"
        />
        {/* Central quill shaft */}
        <path
          d="M 12 55 Q 80 40 215 24"
          stroke="#A88B54"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Gold nib tip */}
        <path
          d="M 2 58 L 14 53 L 14 59 Z"
          fill="#D4AF37"
          stroke="#7A5617"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
}

/**
 * Collectible Vintage Postage Stamp (Tem thư cổ điển với viền răng cưa)
 */
export function VintageStampOrnament({
  variant = 'rose',
  price = '2000đ',
  country = 'VIỆT NAM',
  postmarkDate = '20.12.2026',
  className = '',
  angle = 4,
}: {
  variant?: 'rose' | 'dove' | 'airmail';
  price?: string;
  country?: string;
  postmarkDate?: string;
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none filter drop-shadow-[0_4px_12px_rgba(89,72,62,0.16)] ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
      aria-hidden="true"
    >
      {/* Postage Stamp with Authentic Perforated Scalloped Edge */}
      <div
        className="relative w-24 h-28 sm:w-28 sm:h-32 bg-[#FAF6EE] p-2 border border-[#C8A96B]/50 flex flex-col justify-between"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(200,169,107,0.3)',
          backgroundImage:
            'radial-gradient(circle, transparent 3px, #FAF6EE 3.5px)',
          backgroundSize: '10px 10px',
          backgroundPosition: '-5px -5px',
        }}
      >
        {/* Inner Stamp Vignette Border */}
        <div className="w-full h-full border border-[#7A2638]/40 bg-[#FFFDF8] p-1.5 flex flex-col justify-between items-center text-center">
          {/* Header */}
          <div className="w-full flex justify-between items-center text-[7px] font-bold text-[#7A2638] uppercase tracking-wider">
            <span>{country}</span>
            <span>{price}</span>
          </div>

          {/* Central Artwork */}
          <div className="my-auto flex flex-col items-center justify-center">
            {variant === 'rose' && (
              <div className="w-10 h-10 flex items-center justify-center text-[#7A2638]">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.4]">
                  <path d="M12 4C9 4 7 6 7 9C7 13 12 16 12 16C12 16 17 13 17 9C17 6 15 4 12 4Z" />
                  <path d="M12 16V21M12 18L9 16M12 19L15 17" />
                </svg>
              </div>
            )}
            {variant === 'dove' && (
              <div className="w-10 h-10 flex items-center justify-center text-[#7A2638]">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.4]">
                  <path d="M4 14C8 12 12 8 16 4C18 7 19 11 18 14C15 14 13 16 11 18C10 20 8 20 6 19L4 14Z" />
                  <path d="M16 4L20 6" />
                </svg>
              </div>
            )}
            {variant === 'airmail' && (
              <div className="w-10 h-10 flex items-center justify-center text-[#7A2638]">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.4]">
                  <path d="M3 8L12 14L21 8M3 8V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V8M3 8L12 3L21 8" />
                </svg>
              </div>
            )}
            <span className="font-handwriting text-[10px] text-[#7A2638] font-bold mt-0.5">
              Tình Yêu
            </span>
          </div>

          {/* Footer */}
          <div className="w-full text-[6px] tracking-widest text-[#C8A96B] uppercase font-semibold">
            BƯU CHÍNH HẠNH PHÚC
          </div>
        </div>

        {/* Postmark Cancellation Stamp Overlay */}
        <div className="absolute -top-1 -right-3 w-14 h-14 rounded-full border border-[#7A2638]/60 flex flex-col items-center justify-center p-1 rotate-12 pointer-events-none opacity-80">
          <span className="text-[6px] uppercase font-bold text-[#7A2638] tracking-widest">
            AIRMAIL
          </span>
          <span className="text-[7px] font-bold text-[#59483E] leading-none my-0.5 font-mono">
            {postmarkDate}
          </span>
          <div className="w-8 h-[1px] bg-[#7A2638]/50 my-0.5" />
          <span className="text-[5px] text-[#7A2638] tracking-tighter">CONFIRMED</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Mini Airmail Letter & Postcard (Lá thư airmail thu nhỏ)
 */
export function MiniAirmailLetterOrnament({
  className = '',
  angle = -6,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={`select-none pointer-events-none filter drop-shadow-[0_8px_18px_rgba(89,72,62,0.18)] ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
      aria-hidden="true"
    >
      <div className="relative w-36 h-24 sm:w-44 sm:h-28 bg-[#FFFDF8] rounded-lg border border-[#C8A96B]/50 p-2.5 flex flex-col justify-between overflow-hidden">
        {/* Vintage Airmail Striped Border (Red & Navy diagonal chevrons) */}
        <div
          className="absolute inset-0 pointer-events-none border-[3px] border-transparent"
          style={{
            borderImage:
              'repeating-linear-gradient(-45deg, #7A2638 0, #7A2638 8px, transparent 8px, transparent 12px, #36536D 12px, #36536D 20px, transparent 20px, transparent 24px) 3',
          }}
        />

        {/* Top Header */}
        <div className="flex justify-between items-start pt-1 px-1">
          <div className="inline-block bg-[#7A2638] text-[#FFFDF8] text-[7px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
            PAR AVION
          </div>
          <div className="w-8 h-10 border border-dashed border-[#C8A96B] bg-[#FAF6EE] flex items-center justify-center text-[7px] text-[#7A2638] font-bold">
            ♥ 10đ
          </div>
        </div>

        {/* Mock handwritten address lines */}
        <div className="px-2 pb-1 space-y-1">
          <div className="h-[1px] w-24 bg-[#59483E]/25" />
          <div className="h-[1px] w-20 bg-[#59483E]/25" />
          <div className="font-handwriting text-xs text-[#7A2638] font-bold">
            Gửi người thương mến...
          </div>
        </div>

        {/* Mini washi tape pinning */}
        <div className="absolute -top-2 left-6 w-12 h-3.5 bg-[#EADECE]/85 border-t border-b border-[#D8C7B0]/60 -rotate-3" />
      </div>
    </div>
  );
}

/**
 * Brass Wire Paperclip (Kẹp giấy kim loại)
 */
export function BrassPaperClipOrnament({
  className = '',
  angle = 15,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      className={`select-none pointer-events-none filter drop-shadow-[0_3px_6px_rgba(89,72,62,0.25)] ${className}`}
      style={{ transform: `rotate(${angle}deg)` }}
      aria-hidden="true"
    >
      <svg width="22" height="52" viewBox="0 0 22 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 6 42 V 12 C 6 6, 16 6, 16 12 V 44 C 16 49, 1 49, 1 44 V 16 C 1 9, 21 9, 21 16 V 38"
          stroke="#C8A96B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 6 42 V 12 C 6 6, 16 6, 16 12 V 44 C 16 49, 1 49, 1 44 V 16 C 1 9, 21 9, 21 16 V 38"
          stroke="#FFF2B8"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
      </svg>
    </div>
  );
}

/**
 * Full Stationery Desk Background Decor Layer
 * Distributes fountain pens, postage stamps, airmail envelopes, and paperclips across the screen margins.
 */
export function StationeryDeskBackground({
  weddingDate = '2026-12-20',
  city = 'HUẾ',
}: {
  weddingDate?: string;
  city?: string;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-1 select-none"
      aria-hidden="true"
    >
      {/* 1. Top Right Corner: Vintage Postage Stamp & Paperclip */}
      <div className="hidden lg:block absolute top-20 right-8 xl:right-16 opacity-90">
        <VintageStampOrnament
          variant="rose"
          price="2026đ"
          country="VIỆT NAM"
          postmarkDate={weddingDate}
          angle={6}
        />
        <BrassPaperClipOrnament className="absolute -top-3 left-4" angle={-15} />
      </div>

      {/* 2. Beside Intro Section (Left): Mini Folded Airmail Letter */}
      <div className="hidden md:block absolute top-[520px] left-4 lg:left-10 xl:left-14 opacity-85">
        <MiniAirmailLetterOrnament angle={-8} />
      </div>

      {/* 3. Beside Main Love Letter (Right): Authentic Fountain Pen resting on the paper */}
      <div className="hidden lg:block absolute top-[980px] -right-10 xl:right-6 opacity-95">
        <FountainPenOrnament angle={-38} />
      </div>

      {/* 4. Beside Couple Polaroid Section (Left): Second Stamp & Botanicals */}
      <div className="hidden lg:block absolute top-[1650px] left-6 xl:left-14 opacity-85">
        <VintageStampOrnament
          variant="dove"
          price="1000đ"
          country="HẠNH PHÚC"
          postmarkDate={weddingDate}
          angle={-5}
        />
      </div>

      {/* 5. Beside Story Scrapbook (Right): Postage Stamp + Mini Wax Stamp */}
      <div className="hidden md:block absolute top-[2300px] right-6 xl:right-16 opacity-85">
        <VintageStampOrnament
          variant="airmail"
          price="AIRMAIL"
          country="LOVE POST"
          postmarkDate={weddingDate}
          angle={8}
        />
      </div>

      {/* 6. Beside Events Section (Left): Feather Quill Pen */}
      <div className="hidden xl:block absolute top-[3100px] -left-10 opacity-80">
        <QuillPenOrnament angle={32} />
      </div>

      {/* 7. Near Final Letter (Right): Fountain Pen left near the signature */}
      <div className="hidden lg:block absolute bottom-[380px] right-8 xl:right-20 opacity-90">
        <FountainPenOrnament angle={28} />
      </div>
    </div>
  );
}
