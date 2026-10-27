import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, Volume2, Share2 } from 'lucide-react';
import { DetailedMoon, ArtisticBloomingLotus, CelestialClouds, playMoonlightChime } from './MoonLotusOrnaments';

interface MoonLotusCenterpieceWeddingProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  scrollProgress: number;
}

export function MoonLotusCenterpieceWedding({
  groomName = 'MINH ANH',
  brideName = 'NGỌC MAI',
  weddingDate = '20 • 12 • 2026',
  scrollProgress,
}: MoonLotusCenterpieceWeddingProps) {
  const [pulseCount, setPulseCount] = useState(0);
  const [hasBlessed, setHasBlessed] = useState(false);

  // Lotus blooms gracefully as section is viewed
  // Scroll progress for this mid-page centerpiece is near 0.3 - 0.5
  const bloomFactor = Math.min(1, Math.max(0.3, scrollProgress * 2.2));

  const handleMoonTap = () => {
    setPulseCount((prev) => prev + 1);
    setHasBlessed(true);
    playMoonlightChime();
  };

  return (
    <section
      id="wedding-centerpiece"
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #350814 0%, #160B24 45%, #060B1C 90%)',
      }}
    >
      {/* 1. Floating Ethereal Oriental Clouds drifting gently */}
      <CelestialClouds direction="left" className="top-10 left-[-15%] w-[130%] h-44 opacity-35" />
      <CelestialClouds direction="right" className="bottom-16 right-[-15%] w-[130%] h-48 opacity-30" />

      {/* 2. Water Surface Ripple & Moonlight Reflection Gradient at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#040714] via-[#0D122B]/70 to-transparent pointer-events-none" />
      <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
        <div className="w-96 h-12 rounded-full bg-[#EBD494]/15 blur-2xl animate-pulse" />
      </div>

      {/* 3. THE CENTERPIECE: TRĂNG NẰM CHÍNH GIỮA */}
      <div className="relative z-20 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
        {/* Top Tagline */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-[0.3em]">
          <Sparkles className="w-3.5 h-3.5 text-[#EBD494]" />
          <span>The Wedding Moment</span>
          <Sparkles className="w-3.5 h-3.5 text-[#EBD494]" />
        </div>

        {/* The Grand Centered Moon Frame with Couple Typography */}
        <div className="relative flex items-center justify-center my-6">
          {/* THE EXACT CENTERED MOON (TRĂNG NẰM CHÍNH GIỮA) */}
          <div className="relative z-10">
            <DetailedMoon
              size={340}
              className="sm:w-[420px] sm:h-[420px]"
              pulseTrigger={pulseCount}
              interactive={true}
            />
          </div>

          {/* Sits right over the moon: The Iconic Wedding Text requested */}
          <div
            onClick={handleMoonTap}
            className="cursor-pointer absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 select-none group"
            title="Chạm vào vầng trăng để đón nhận ánh trăng chúc phúc"
          >
            {/* UNDER THE SAME MOON */}
            <h3 className="font-serif text-xs sm:text-sm md:text-base uppercase tracking-[0.35em] text-[#3D1A1E] font-bold drop-shadow-xs transition-transform duration-300 group-hover:scale-105">
              UNDER THE SAME MOON
            </h3>

            {/* Decorative Divider */}
            <div className="w-16 h-[1px] bg-[#751A29]/50 my-2" />

            {/* MINH ANH & NGỌC MAI */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif-title font-bold text-[#2A060E] tracking-wider transition-transform duration-300 group-hover:scale-105">
                {groomName}
              </h1>
              <div className="text-xl sm:text-2xl font-serif text-[#751A29] font-bold">&amp;</div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif-title font-bold text-[#2A060E] tracking-wider transition-transform duration-300 group-hover:scale-105">
                {brideName}
              </h1>
            </div>

            {/* Decorative Divider */}
            <div className="w-16 h-[1px] bg-[#751A29]/50 my-2" />

            {/* 20 • 12 • 2026 */}
            <p className="font-serif text-sm sm:text-base font-bold text-[#3D1A1E] tracking-[0.25em]">
              {weddingDate}
            </p>

            {/* Interactive hint */}
            <span className="mt-2 text-[10px] text-[#751A29]/80 font-serif italic tracking-wide opacity-80 group-hover:opacity-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Chạm vầng trăng dạ nguyệt</span>
            </span>
          </div>

          {/* Flanking Blooming Lotus Flowers on Left & Right */}
          <div className="absolute -left-12 sm:-left-24 bottom-2 z-30 pointer-events-none">
            <ArtisticBloomingLotus size={150} bloomProgress={bloomFactor} />
          </div>
          <div className="absolute -right-12 sm:-right-24 bottom-2 z-30 pointer-events-none transform -scale-x-100">
            <ArtisticBloomingLotus size={150} bloomProgress={bloomFactor} />
          </div>
        </div>

        {/* Central Bottom Blooming Lotus (Rising from the Moonlit Water) */}
        <div className="relative -mt-10 z-30 flex justify-center items-center">
          <ArtisticBloomingLotus size={180} bloomProgress={bloomFactor} />
        </div>

        {/* Sacred Proclamation Message */}
        <div className="relative z-20 mt-4 max-w-xl mx-auto space-y-3 px-4">
          <p className="font-serif text-sm sm:text-base text-[#FDFBF7] leading-relaxed tracking-wide">
            “Dưới cùng một ánh trăng dịu dàng soi sáng thế gian, hai trái tim đã tìm thấy nhau và cùng nguyện ước gắn kết trọn đời.”
          </p>

          <p className="font-serif text-xs text-[#EBD494]/85 italic tracking-wider">
            Trân trọng kính mời quý quan khách cùng chung vui trong ngày hạnh phúc viên mãn
          </p>

          {/* Interactive Blessing Feedback */}
          {hasBlessed && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBD494]/20 border border-[#EBD494]/40 text-[#FFFDF7] text-xs font-serif animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-[#EBD494]" />
              <span>Ánh trăng đã ghi nhận phước lành của bạn dành cho đôi uyên ương!</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
