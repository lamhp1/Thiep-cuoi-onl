import React, { useState } from 'react';
import {
  HoiAnDiamondLantern,
  HoiAnGlobeLantern,
  HoiAnGarlicLantern,
} from './LanternNightOrnaments';
import { Sparkles } from 'lucide-react';
import { playLanternWindChime } from './LanternAudioBar';

interface SideLanternColumnsProps {
  scrollProgress: number; // 0 to 1
  onLanternClick?: (lanternId: string) => void;
}

interface LanternItem {
  id: string;
  type: 'diamond' | 'globe' | 'garlic';
  variant: 'amber' | 'burgundy' | 'crimson' | 'gold';
  delay: string;
  swaySide: 'left' | 'right';
  label: string;
  blessing: string;
}

export function SideLanternColumns({ scrollProgress, onLanternClick }: SideLanternColumnsProps) {
  const [activeLantern, setActiveLantern] = useState<string | null>(null);
  const [blessingMessage, setBlessingMessage] = useState<string | null>(null);

  // Scroll-linked glow intensity: expands smoothly as the guest scrolls through the wedding story
  const scrollGlow = 0.4 + scrollProgress * 0.8; // 0.4 -> 1.2

  const handleLanternTap = (item: LanternItem) => {
    setActiveLantern(item.id);
    setBlessingMessage(item.blessing);

    // Play soothing wind chime
    playLanternWindChime();

    if (onLanternClick) {
      onLanternClick(item.id);
    }

    setTimeout(() => {
      setActiveLantern(null);
    }, 1800);

    setTimeout(() => {
      setBlessingMessage(null);
    }, 3200);
  };

  const leftLanterns: LanternItem[] = [
    { id: 'left-1', type: 'diamond', variant: 'amber', delay: '0s', swaySide: 'left', label: 'Hỷ Khí', blessing: '✦ Loan Phụng Hòa Minh • Trăm Năm Hạnh Phúc ✦' },
    { id: 'left-2', type: 'globe', variant: 'burgundy', delay: '1.2s', swaySide: 'left', label: 'Tương Phùng', blessing: '✦ Duyên Định Tam Sinh • Tình Nồng Thắm Thiết ✦' },
    { id: 'left-3', type: 'garlic', variant: 'gold', delay: '0.6s', swaySide: 'left', label: 'Bách Niên', blessing: '✦ Bách Niên Giai Lão • Vĩnh Kết Đồng Tâm ✦' },
    { id: 'left-4', type: 'diamond', variant: 'crimson', delay: '1.8s', swaySide: 'left', label: 'Giai Lão', blessing: '✦ Ánh Dạ Đăng Dẫn Lối Yêu Thương ✦' },
  ];

  const rightLanterns: LanternItem[] = [
    { id: 'right-1', type: 'globe', variant: 'burgundy', delay: '0.4s', swaySide: 'right', label: 'Phúc Duyên', blessing: '✦ Phúc Duyên Viên Mãn • Gia Đạo Bình An ✦' },
    { id: 'right-2', type: 'diamond', variant: 'amber', delay: '1.5s', swaySide: 'right', label: 'Hạnh Phúc', blessing: '✦ Ánh Sáng Hội An Thắp Sáng Duyên Lành ✦' },
    { id: 'right-3', type: 'garlic', variant: 'crimson', delay: '0.9s', swaySide: 'right', label: 'An Yên', blessing: '✦ Đồng Tâm Đồng Đức • Cùng Vượt Năm Tháng ✦' },
    { id: 'right-4', type: 'globe', variant: 'gold', delay: '2.1s', swaySide: 'right', label: 'Vĩnh Cửu', blessing: '✦ Rực Rỡ Đêm Hoa Đăng • Vạn Lời Chúc Phúc ✦' },
  ];

  const renderLantern = (item: LanternItem, index: number) => {
    const isInteracted = activeLantern === item.id;
    const animationClass = item.swaySide === 'left' ? 'animate-lantern-sway-left' : 'animate-lantern-sway-right';

    // On mobile screens, only show the first 2 lanterns per side to avoid crowding text
    const mobileHiddenClass = index >= 2 ? 'hidden md:block' : 'block';

    return (
      <div
        key={item.id}
        onClick={() => handleLanternTap(item)}
        className={`group relative cursor-pointer pointer-events-auto transition-transform duration-500 hover:scale-110 active:scale-95 ${animationClass} ${mobileHiddenClass}`}
        style={{ animationDelay: item.delay }}
        title={`Chạm vào đèn lồng ${item.label} để thắp sáng lời chúc`}
      >
        {/* Click shockwave aura */}
        {isInteracted && (
          <div className="absolute inset-0 -m-6 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
        )}

        {/* Lantern Variant Component */}
        {item.type === 'diamond' && (
          <HoiAnDiamondLantern
            glowIntensity={scrollGlow}
            colorVariant={item.variant}
            isInteracted={isInteracted}
            className="w-9 sm:w-13 md:w-16 h-24 sm:h-34 md:h-38"
          />
        )}
        {item.type === 'globe' && (
          <HoiAnGlobeLantern
            glowIntensity={scrollGlow}
            colorVariant={item.variant}
            isInteracted={isInteracted}
            className="w-9 sm:w-13 md:w-16 h-22 sm:h-32 md:h-36"
          />
        )}
        {item.type === 'garlic' && (
          <HoiAnGarlicLantern
            glowIntensity={scrollGlow}
            colorVariant={item.variant}
            isInteracted={isInteracted}
            className="w-9 sm:w-13 md:w-16 h-24 sm:h-34 md:h-38"
          />
        )}

        {/* Floating tooltip label on hover */}
        <div className="hidden sm:block absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap bg-amber-950/95 text-amber-200 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/50 shadow-xl backdrop-blur-xs font-serif">
          {item.label}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Left Light Wave Aura (Ánh sáng lan từ sườn trái vào tâm khi scroll) */}
      <div
        className="fixed top-0 left-0 w-44 sm:w-80 md:w-96 h-full pointer-events-none z-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at 0% 40%, rgba(245, 158, 11, ${0.16 * scrollGlow}) 0%, rgba(190, 18, 60, ${0.1 * scrollGlow}) 45%, transparent 75%)`,
          opacity: 0.65 + scrollGlow * 0.35,
        }}
      />

      {/* 2. Right Light Wave Aura (Ánh sáng lan từ sườn phải vào tâm khi scroll) */}
      <div
        className="fixed top-0 right-0 w-44 sm:w-80 md:w-96 h-full pointer-events-none z-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at 100% 45%, rgba(245, 158, 11, ${0.16 * scrollGlow}) 0%, rgba(190, 18, 60, ${0.1 * scrollGlow}) 45%, transparent 75%)`,
          opacity: 0.65 + scrollGlow * 0.35,
        }}
      />

      {/* 3. Left Hanging Lanterns Flank with Imperial Eaves */}
      <aside
        aria-label="Đèn lồng cánh trái"
        className="fixed top-0 left-1 sm:left-3 md:left-6 lg:left-10 z-20 flex flex-col gap-8 sm:gap-12 md:gap-14 pointer-events-none"
      >
        {/* Top Imperial Wood Bracket / Eave */}
        <div className="w-12 sm:w-16 h-3 bg-linear-to-r from-amber-950 via-yellow-800 to-amber-900 border-b border-amber-600/40 rounded-b-sm shadow-md" />
        {leftLanterns.map((lantern, idx) => renderLantern(lantern, idx))}
      </aside>

      {/* 4. Right Hanging Lanterns Flank with Imperial Eaves */}
      <aside
        aria-label="Đèn lồng cánh phải"
        className="fixed top-0 right-1 sm:right-3 md:right-6 lg:right-10 z-20 flex flex-col gap-8 sm:gap-12 md:gap-14 pointer-events-none"
      >
        {/* Top Imperial Wood Bracket / Eave */}
        <div className="w-12 sm:w-16 h-3 bg-linear-to-r from-amber-900 via-yellow-800 to-amber-950 border-b border-amber-600/40 rounded-b-sm shadow-md ml-auto" />
        {rightLanterns.map((lantern, idx) => renderLantern(lantern, idx))}
      </aside>

      {/* 5. Interactive Blessing Toast Message when tapping lanterns */}
      {blessingMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300 pointer-events-none">
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-950/98 via-[#2A0815]/98 to-amber-950/98 border border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.6)] text-amber-200 text-xs sm:text-sm font-serif-title backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span className="font-semibold tracking-wide">{blessingMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
