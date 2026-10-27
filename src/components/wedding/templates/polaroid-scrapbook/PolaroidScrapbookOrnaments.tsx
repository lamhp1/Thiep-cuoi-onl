import React from 'react';
import { Heart, Sparkles, Star, Smile, Bookmark, Camera } from 'lucide-react';

export type WashiTapeStyle =
  | 'pink-grid'
  | 'mint-dots'
  | 'yellow-stripes'
  | 'kraft'
  | 'gold-sheen'
  | 'rose-floral'
  | 'lavender';

interface WashiTapeProps {
  style?: WashiTapeStyle;
  className?: string;
  angle?: number;
  width?: string;
}

export function WashiTape({
  style = 'pink-grid',
  className = '',
  angle = 0,
  width = 'w-24 sm:w-28',
}: WashiTapeProps) {
  const getStyleClasses = () => {
    switch (style) {
      case 'pink-grid':
        return 'bg-[#F9D5D3]/90 text-[#B05B6F] border-y border-[#F3B7B5]/60 [background-image:linear-gradient(to_right,rgba(176,91,111,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(176,91,111,0.15)_1px,transparent_1px)] [background-size:6px_6px]';
      case 'mint-dots':
        return 'bg-[#D2EBD9]/90 text-[#3F7556] border-y border-[#B5DEC0]/60 [background-image:radial-gradient(rgba(63,117,86,0.25)_1px,transparent_1px)] [background-size:6px_6px]';
      case 'yellow-stripes':
        return 'bg-[#FDF0CD]/90 text-[#A67E2E] border-y border-[#F7DF98]/60 [background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(166,126,46,0.15)_4px,rgba(166,126,46,0.15)_8px)]';
      case 'kraft':
        return 'bg-[#E6D2B5]/90 text-[#7A5B35] border-y border-[#D6BC97]/70';
      case 'gold-sheen':
        return 'bg-[#F3E3B6]/95 text-[#916E25] border-y border-[#D6BE7D]/70 shadow-xs';
      case 'rose-floral':
        return 'bg-[#FAD9E2]/90 text-[#9C3858] border-y border-[#F2B3C5]/60';
      case 'lavender':
        return 'bg-[#E4DDF4]/90 text-[#6B5B95] border-y border-[#CDC2E5]/60';
      default:
        return 'bg-[#F9D5D3]/90 text-[#B05B6F]';
    }
  };

  return (
    <div
      style={{ transform: `rotate(${angle}deg)` }}
      className={`h-5 ${width} ${getStyleClasses()} backdrop-blur-[1px] shadow-sm select-none pointer-events-none z-10 relative flex items-center justify-center ${className}`}
    >
      {/* Jagged / torn tape left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40 clip-torn-left opacity-70" />
      {/* Jagged / torn tape right edge */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40 clip-torn-right opacity-70" />
      {/* Subtle translucent tape gloss */}
      <div className="w-full h-full opacity-30 bg-gradient-to-b from-white via-transparent to-black/10" />
    </div>
  );
}

export function Thumbtack({ color = 'gold', className = '' }: { color?: 'gold' | 'red' | 'bronze' | 'mint'; className?: string }) {
  const colorMap = {
    gold: 'bg-gradient-to-br from-[#FFE898] via-[#D4AF37] to-[#8C6D1F]',
    red: 'bg-gradient-to-br from-[#FF8E8E] via-[#D83A52] to-[#871223]',
    bronze: 'bg-gradient-to-br from-[#E6BC8F] via-[#A87442] to-[#6E4218]',
    mint: 'bg-gradient-to-br from-[#A7F3D0] via-[#10B981] to-[#065F46]',
  };

  return (
    <div className={`relative w-4 h-4 rounded-full ${colorMap[color]} shadow-md border border-white/60 z-20 flex items-center justify-center ${className}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
      {/* Pin shadow on paper */}
      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-black/20 blur-[1px] -z-10" />
    </div>
  );
}

export function Paperclip({ className = '', angle = -12 }: { className?: string; angle?: number }) {
  return (
    <div
      style={{ transform: `rotate(${angle}deg)` }}
      className={`relative select-none pointer-events-none z-20 drop-shadow-md ${className}`}
    >
      <svg width="24" height="48" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7 16V36C7 38.7614 9.23858 41 12 41C14.7614 41 17 38.7614 17 36V10C17 5.58172 13.4183 2 9 2C4.58172 2 1 5.58172 1 10V36C1 42.0751 5.92487 47 12 47C18.0751 47 23 42.0751 23 36V14"
          stroke="#C5A059"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="drop-shadow-xs"
        />
        {/* Metal highlight */}
        <path
          d="M7 17V36C7 38.7614 9.23858 41 12 41C14.7614 41 17 38.7614 17 36V10"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function HeartSticker({
  text = 'LOVE',
  color = 'red',
  className = '',
  angle = 8,
}: {
  text?: string;
  color?: 'red' | 'pink' | 'gold' | 'mint';
  className?: string;
  angle?: number;
}) {
  const bgMap = {
    red: 'bg-[#DE485B] text-white border-[#F37B8B]',
    pink: 'bg-[#F9A8B8] text-[#781B30] border-[#FFC8D4]',
    gold: 'bg-[#E3BA64] text-[#4F3605] border-[#FCE2A6]',
    mint: 'bg-[#8CD8B2] text-[#0E4A2A] border-[#BAF0D4]',
  };

  return (
    <div
      style={{ transform: `rotate(${angle}deg)` }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-md border border-dashed select-none z-10 ${bgMap[color]} ${className}`}
    >
      <Heart className="w-3 h-3 fill-current inline-block" />
      <span>{text}</span>
    </div>
  );
}

export function StampSticker({
  label = 'LOVE POST',
  date = '20.12.2026',
  price = 'Forever',
  className = '',
  angle = -5,
}: {
  label?: string;
  date?: string;
  price?: string;
  className?: string;
  angle?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${angle}deg)` }}
      className={`w-20 sm:w-24 bg-[#FFFDF9] border-2 border-dashed border-[#B8965E] p-1.5 rounded-sm shadow-md text-center select-none z-10 relative ${className}`}
    >
      <div className="border border-[#B8965E]/40 p-1 rounded-xs flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full text-[8px] font-bold text-[#8C6D1F] tracking-tighter">
          <span>{label}</span>
          <span>{price}</span>
        </div>
        <div className="my-1 text-[#C84B5D]">
          <Heart className="w-4 h-4 fill-[#C84B5D]" />
        </div>
        <div className="text-[9px] font-serif font-bold text-[#45372C] leading-none">
          {date}
        </div>
      </div>
      {/* Perforation dots on border effect */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FAF4EB]" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FAF4EB]" />
    </div>
  );
}

export function PostmarkCircle({
  city = 'HUẾ - VIỆT NAM',
  date = '20.12.2026',
  className = '',
  angle = 12,
}: {
  city?: string;
  date?: string;
  className?: string;
  angle?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${angle}deg)` }}
      className={`w-20 h-20 rounded-full border-2 border-dashed border-[#9E3547]/60 flex flex-col items-center justify-center text-[#9E3547]/80 select-none pointer-events-none p-1 shadow-xs ${className}`}
    >
      <div className="text-[7px] font-mono font-bold tracking-widest uppercase">
        ★ {city} ★
      </div>
      <div className="w-10 h-px bg-[#9E3547]/40 my-0.5" />
      <div className="text-[10px] font-mono font-extrabold tracking-wider">
        {date}
      </div>
      <div className="text-[7px] font-mono uppercase tracking-widest text-[#9E3547]/70">
        OFFICIAL SEAL
      </div>
    </div>
  );
}

export function PressedFlower({
  className = '',
  angle = 20,
}: {
  className?: string;
  angle?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${angle}deg)` }}
      className={`select-none pointer-events-none z-10 drop-shadow-sm ${className}`}
    >
      <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
        {/* Pressed botanical petal */}
        <path
          d="M50 50 C30 20 20 10 50 5 C80 10 70 20 50 50 Z"
          fill="#D97A8D"
          fillOpacity="0.75"
        />
        <path
          d="M50 50 C20 30 10 20 5 50 C10 80 20 70 50 50 Z"
          fill="#E896A6"
          fillOpacity="0.7"
        />
        <path
          d="M50 50 C30 80 20 90 50 95 C80 90 70 80 50 50 Z"
          fill="#D97A8D"
          fillOpacity="0.75"
        />
        <path
          d="M50 50 C80 30 90 20 95 50 C90 80 80 70 50 50 Z"
          fill="#E896A6"
          fillOpacity="0.7"
        />
        {/* Flower center */}
        <circle cx="50" cy="50" r="7" fill="#C5933C" />
        {/* Dried stem */}
        <path
          d="M50 55 Q52 75 48 95"
          stroke="#7A6843"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}
