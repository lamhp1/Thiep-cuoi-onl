import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolkCloud, FolkBambooGrove, FolkLotus, FolkBird, FolkRedSeal } from './FairytaleOrnaments';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FairytaleVillageGateOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  city?: string;
  onEnterStory: () => void;
}

export function FairytaleVillageGateOpening({
  groomName,
  brideName,
  weddingDate,
  city = 'LÀNG QUÊ VIỆT NAM',
  onEnterStory,
}: FairytaleVillageGateOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenGate = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Trigger folk festive confetti (lotus petals & golden sparks)
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#BA262B', '#E5A93C', '#2D6A4F', '#F4B6C2', '#FFFFFF'],
      });
    } catch {
      // safe fallback
    }

    // After animation completes, dismiss opening curtain
    setTimeout(() => {
      onEnterStory();
    }, 1600);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-[#FAF5EB]"
        style={{
          backgroundImage:
            'radial-gradient(#D9CBB7 0.9px, transparent 0.9px), radial-gradient(#D9CBB7 0.9px, #FAF5EB 0.9px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      >
        {/* Sky with floating clouds & flying folk birds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top Sun / Trăng vầng nguyệt hoàng yến */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 1.2 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-gradient-to-b from-[#F2C94C]/40 via-[#E5A93C]/20 to-transparent blur-xl pointer-events-none"
          />

          {/* Dong Ho Folk Clouds floating */}
          <motion.div
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-12 left-4 sm:left-12 opacity-80"
          >
            <FolkCloud className="w-28 sm:w-36 h-auto text-[#BA262B]/80" />
          </motion.div>
          <motion.div
            animate={{ x: [0, -25, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-16 right-4 sm:right-12 opacity-80"
          >
            <FolkCloud className="w-32 sm:w-40 h-auto text-[#2D6A4F]/75 scale-x-[-1]" />
          </motion.div>

          {/* Flying love birds above village gate */}
          <motion.div
            initial={{ x: -100, y: 80 }}
            animate={{ x: 120, y: -20 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute top-20 left-1/4 opacity-90 hidden sm:block"
          >
            <FolkBird className="w-12 h-10 text-[#BA262B]" />
          </motion.div>
          <motion.div
            initial={{ x: 120, y: 70 }}
            animate={{ x: -100, y: -10 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear', delay: 2 }}
            className="absolute top-24 right-1/4 opacity-80 scale-x-[-1] hidden sm:block"
          >
            <FolkBird className="w-10 h-8 text-[#1D3557]" />
          </motion.div>

          {/* Bamboo Groves flanking the gate left & right */}
          <div className="absolute -bottom-10 -left-6 sm:left-4 opacity-90 pointer-events-none">
            <div className="flex gap-2">
              <FolkBambooGrove className="w-16 sm:w-24 h-64 sm:h-80 text-[#2D6A4F]" />
              <FolkBambooGrove className="w-14 sm:w-20 h-56 sm:h-72 text-[#1B4332] -ml-6 mt-8" />
            </div>
          </div>
          <div className="absolute -bottom-10 -right-6 sm:right-4 opacity-90 pointer-events-none">
            <div className="flex gap-2 scale-x-[-1]">
              <FolkBambooGrove className="w-16 sm:w-24 h-64 sm:h-80 text-[#2D6A4F]" />
              <FolkBambooGrove className="w-14 sm:w-20 h-56 sm:h-72 text-[#1B4332] -ml-6 mt-8" />
            </div>
          </div>
        </div>

        {/* The Grand Vietnamese Village Gate Frame (Cổng Làng Cổ Kính) */}
        <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-6 flex flex-col items-center">
          {/* 1. Gate Roof (Mái Cổng Làng Uốn Cong & Ngói Mũi Hài) */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-full max-w-md relative flex flex-col items-center"
          >
            {/* Top curved roof ridge */}
            <div className="w-[106%] -mx-[3%] h-9 bg-gradient-to-r from-[#9E3E2F] via-[#BA4735] to-[#9E3E2F] rounded-t-[50px] shadow-lg flex items-center justify-between px-6 border-b-2 border-[#6D271C]">
              {/* Left & Right upward curved roof tails (Kìm nóc đầu đao) */}
              <div className="w-5 h-5 border-t-4 border-l-4 border-[#E5A93C] rounded-tl-full -translate-y-2 -rotate-12" />
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C] shadow-sm animate-pulse" />
                <span className="text-[11px] font-serif font-bold text-[#FAF5EB] tracking-[0.25em] uppercase">
                  {city}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C] shadow-sm animate-pulse" />
              </div>
              <div className="w-5 h-5 border-t-4 border-r-4 border-[#E5A93C] rounded-tr-full -translate-y-2 rotate-12" />
            </div>

            {/* Main Roof Arch Tile Eaves */}
            <div className="w-full bg-[#8A3224] py-2 px-4 shadow-md border-x-4 border-[#6D271C] flex items-center justify-center">
              {/* Plaque / Bảng Hoành Phi: CỔ TÍCH LƯƠNG DUYÊN */}
              <div className="bg-[#BA262B] border-2 border-[#E5A93C] px-5 py-1.5 rounded shadow-inner text-center">
                <p className="text-[#FDFBF7] font-serif-title font-black text-sm sm:text-base tracking-[0.2em] uppercase drop-shadow-sm">
                  CỔ TÍCH LƯƠNG DUYÊN
                </p>
                <p className="text-[#E5A93C] text-[9px] font-mono tracking-widest uppercase mt-0.5">
                  LÀNG HẠNH PHÚC • THÀNH HÔN ĐẠI HỶ
                </p>
              </div>
            </div>

            {/* Arch header beam with names */}
            <div className="w-[94%] bg-[#74281C] py-2 px-3 text-center border-b-2 border-[#541D14] flex items-center justify-center gap-2 shadow-inner">
              <FolkLotus className="w-4 h-4 text-[#E5A93C]" />
              <span className="font-serif-title font-bold text-sm sm:text-base text-[#FAF5EB] tracking-wide">
                {groomName} &amp; {brideName}
              </span>
              <FolkLotus className="w-4 h-4 text-[#E5A93C]" />
            </div>
          </motion.div>

          {/* 2. Gate Body with Left & Right Pillars and Middle Swinging Doors */}
          <div className="relative w-full max-w-md flex items-stretch justify-center h-[340px] sm:h-[390px] shadow-2xl rounded-b-xl overflow-hidden bg-[#FAF5EB] border-b-4 border-[#6D271C]">
            {/* Left Brick Pillar (Trụ Cổng Làng Bên Trái có Câu Đối) */}
            <div className="w-11 sm:w-14 bg-gradient-to-b from-[#9E3E2F] via-[#853023] to-[#6D271C] p-1 flex flex-col items-center justify-between border-r-2 border-[#541D14] shadow-md shrink-0">
              <FolkRedSeal text="PHÚC" subtitle="" className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 text-[#FAF5EB] border-[#FAF5EB]/60" />
              <div className="flex flex-col items-center justify-center my-auto py-1 text-[#FAF5EB] font-serif font-bold text-[10px] sm:text-xs drop-shadow-sm select-none">
                <span className="tracking-wider leading-tight whitespace-nowrap">TRĂM</span>
                <span className="my-0.5 sm:my-1 text-[8px] sm:text-[10px] leading-none opacity-80 text-[#FAF5EB]">•</span>
                <span className="tracking-wider leading-tight whitespace-nowrap">NĂM</span>
                <span className="my-0.5 sm:my-1 text-[8px] sm:text-[10px] leading-none opacity-80 text-[#FAF5EB]">•</span>
                <span className="tracking-wider leading-tight whitespace-nowrap">TÌNH</span>
                <span className="my-0.5 sm:my-1 text-[8px] sm:text-[10px] leading-none opacity-80 text-[#FAF5EB]">•</span>
                <span className="tracking-wider leading-tight whitespace-nowrap">VIÊN</span>
                <span className="my-0.5 sm:my-1 text-[8px] sm:text-[10px] leading-none opacity-80 text-[#FAF5EB]">•</span>
                <span className="tracking-wider leading-tight whitespace-nowrap">MÃN</span>
              </div>
              <div className="w-5 h-2 bg-[#E5A93C] rounded-sm opacity-80 mb-1" />
            </div>

            {/* Middle Archway & Double Doors (Cánh Cửa Gỗ Làng Khép Kín) */}
            <div className="relative flex-1 bg-[#4A241C] overflow-hidden flex items-center justify-center perspective-[1000px]">
              {/* Inside Scene Preview (Con đường làng rợp bóng tre mờ ảo phía sau) */}
              <div
                className="absolute inset-0 bg-[#E8DCB8] flex flex-col items-center justify-center p-4 text-center"
                style={{
                  backgroundImage:
                    'radial-gradient(#C4B290 1px, transparent 1px), linear-gradient(to bottom, #FAF5EB 0%, #D8C6A5 100%)',
                }}
              >
                <div className="w-16 h-16 rounded-full bg-[#BA262B]/10 flex items-center justify-center mb-2 animate-bounce">
                  <FolkLotus className="w-10 h-10 text-[#BA262B]" />
                </div>
                <p className="font-serif-title text-base font-bold text-[#6D271C]">Đường Vào Làng Hạnh Phúc</p>
                <p className="text-xs font-poetry text-[#8C5311] italic mt-1">Đang mở ra câu chuyện...</p>
              </div>

              {/* Left Door Wing (Cánh Cửa Gỗ Lim Trái) */}
              <motion.div
                animate={isOpening ? { rotateY: -92, x: -20, opacity: 0.1 } : { rotateY: 0, x: 0, opacity: 1 }}
                transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
                style={{ transformOrigin: 'left center' }}
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#5A2318] via-[#752F21] to-[#60271B] border-r border-[#3E160E] flex flex-col items-end justify-center pr-3 shadow-2xl z-20"
              >
                {/* Wood plank texture lines */}
                <div className="absolute inset-0 opacity-25 flex justify-between pointer-events-none px-2">
                  <div className="w-px h-full bg-black/50" />
                  <div className="w-px h-full bg-black/50" />
                  <div className="w-px h-full bg-black/50" />
                </div>
                {/* Brass Door Studs & Ring Handle */}
                <div className="relative z-10 w-8 h-8 rounded-full border-2 border-[#E5A93C] bg-[#8C5311]/80 shadow-md flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-[#E5A93C]" />
                </div>
                {/* Traditional lotus carving panel */}
                <div className="absolute top-4 left-3 right-3 h-14 border border-[#E5A93C]/30 rounded flex items-center justify-center bg-black/10">
                  <FolkLotus className="w-6 h-6 text-[#E5A93C]/70" />
                </div>
                <div className="absolute bottom-4 left-3 right-3 h-14 border border-[#E5A93C]/30 rounded flex items-center justify-center bg-black/10">
                  <FolkCloud className="w-8 h-4 text-[#E5A93C]/60" />
                </div>
              </motion.div>

              {/* Right Door Wing (Cánh Cửa Gỗ Lim Phải) */}
              <motion.div
                animate={isOpening ? { rotateY: 92, x: 20, opacity: 0.1 } : { rotateY: 0, x: 0, opacity: 1 }}
                transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
                style={{ transformOrigin: 'right center' }}
                className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#5A2318] via-[#752F21] to-[#60271B] border-l border-[#3E160E] flex flex-col items-start justify-center pl-3 shadow-2xl z-20"
              >
                {/* Wood plank texture lines */}
                <div className="absolute inset-0 opacity-25 flex justify-between pointer-events-none px-2">
                  <div className="w-px h-full bg-black/50" />
                  <div className="w-px h-full bg-black/50" />
                  <div className="w-px h-full bg-black/50" />
                </div>
                {/* Brass Door Studs & Ring Handle */}
                <div className="relative z-10 w-8 h-8 rounded-full border-2 border-[#E5A93C] bg-[#8C5311]/80 shadow-md flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-[#E5A93C]" />
                </div>
                {/* Traditional lotus carving panel */}
                <div className="absolute top-4 left-3 right-3 h-14 border border-[#E5A93C]/30 rounded flex items-center justify-center bg-black/10">
                  <FolkLotus className="w-6 h-6 text-[#E5A93C]/70" />
                </div>
                <div className="absolute bottom-4 left-3 right-3 h-14 border border-[#E5A93C]/30 rounded flex items-center justify-center bg-black/10">
                  <FolkCloud className="w-8 h-4 text-[#E5A93C]/60 scale-x-[-1]" />
                </div>
              </motion.div>

              {/* Center Lock / Keyhole / Then Cài Cửa */}
              {!isOpening && (
                <div className="absolute z-30 flex flex-col items-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#F2C94C] to-[#B37D14] border-2 border-[#FAF5EB] shadow-xl flex items-center justify-center text-[#5A2318]">
                    <span className="font-serif-title font-black text-xl tracking-wider">HỶ</span>
                  </div>
                  <span className="mt-2 text-[10px] font-mono font-bold text-[#FAF5EB] bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {weddingDate}
                  </span>
                </div>
              )}
            </div>

            {/* Right Brick Pillar (Trụ Cổng Làng Bên Phải có Câu Đối) */}
            <div className="w-11 sm:w-14 bg-gradient-to-b from-[#9E3E2F] via-[#853023] to-[#6D271C] p-1 flex flex-col items-center justify-between border-l-2 border-[#541D14] shadow-md shrink-0">
              <FolkRedSeal text="THỌ" subtitle="" className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 text-[#FAF5EB] border-[#FAF5EB]/60" />
              <div className="flex flex-col items-center justify-center my-auto py-1 text-[#FAF5EB] font-serif font-bold text-[10px] sm:text-xs drop-shadow-sm select-none">
                <span className="tracking-wider leading-tight whitespace-nowrap">MỘT</span>
                <span className="my-0.5 sm:my-1 text-[8px] sm:text-[10px] leading-none opacity-80 text-[#FAF5EB]">•</span>
                <span className="tracking-wider leading-tight whitespace-nowrap">THUỞ</span>
                <span className="my-0.5 sm:my-1 text-[8px] sm:text-[10px] leading-none opacity-80 text-[#FAF5EB]">•</span>
                <span className="tracking-wider leading-tight whitespace-nowrap">NGHĨA</span>
                <span className="my-0.5 sm:my-1 text-[8px] sm:text-[10px] leading-none opacity-80 text-[#FAF5EB]">•</span>
                <span className="tracking-wider leading-tight whitespace-nowrap">TẠ</span>
                <span className="my-0.5 sm:my-1 text-[8px] sm:text-[10px] leading-none opacity-80 text-[#FAF5EB]">•</span>
                <span className="tracking-wider leading-tight whitespace-nowrap">ÂN</span>
              </div>
              <div className="w-5 h-2 bg-[#E5A93C] rounded-sm opacity-80 mb-1" />
            </div>
          </div>

          {/* 3. The Call to Action Button: "Bước vào câu chuyện của chúng mình" */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 flex flex-col items-center space-y-3 w-full"
          >
            <button
              onClick={handleOpenGate}
              disabled={isOpening}
              className="group relative cursor-pointer overflow-hidden rounded-full bg-gradient-to-r from-[#BA262B] via-[#D8363C] to-[#BA262B] px-8 py-3.5 sm:px-10 sm:py-4 shadow-xl border-2 border-[#E5A93C] text-[#FAF5EB] font-serif-title text-base sm:text-lg font-bold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:shadow-2xl hover:border-white disabled:opacity-80 flex items-center justify-center gap-3"
            >
              {/* Button Sheen Animation */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              <Sparkles className="w-5 h-5 text-[#E5A93C] animate-spin-slow" />
              <span>
                {isOpening ? 'Đang mở cổng làng...' : 'Bước vào câu chuyện của chúng mình'}
              </span>
              <Sparkles className="w-5 h-5 text-[#E5A93C] animate-spin-slow" />
            </button>

            <p className="text-xs font-poetry italic text-[#7A4C3E] text-center max-w-xs leading-relaxed">
              * Chạm để mở cánh cổng làng, cùng bước qua con đường cổ tích trăm năm.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
