import React, { useState, useEffect } from 'react';
import { SparklingStar, HoiAnDiamondLantern, HoiAnGlobeLantern, LotusNightIcon, VietnameseCloudOrnament } from './LanternNightOrnaments';
import { Clock, ChevronDown, Sparkles } from 'lucide-react';
import { playLanternWindChime } from './LanternAudioBar';

interface LanternHeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  romanticQuote?: string;
  coverImage?: string;
  city?: string;
  scrollProgress: number;
  onRSVPClick: () => void;
  onExploreClick: () => void;
}

interface FloatingLotusWaterLantern {
  id: number;
  x: number; // percentage across screen
  speed: number;
  scale: number;
}

export function LanternHeroSection({
  groomName,
  brideName,
  weddingDate,
  romanticQuote = '“Dưới muôn ngọn đèn lồng rực rỡ, ta tìm thấy nhau giữa triệu người. Nguyện cùng nhau đi qua năm tháng, giữ ấm ngọn lửa trăm năm.”',
  coverImage,
  city = 'TP. Huế',
  scrollProgress,
  onRSVPClick,
  onExploreClick,
}: LanternHeroSectionProps) {
  // Countdown Timer to 20/12/2026 18:00 Evening Gala
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Interactive Floating River Lotus Lanterns (Hoa Đăng Trôi Sông)
  const [lotusLanterns, setLotusLanterns] = useState<FloatingLotusWaterLantern[]>([
    { id: 1, x: 20, speed: 22, scale: 0.9 },
    { id: 2, x: 55, speed: 28, scale: 1.1 },
    { id: 3, x: 80, speed: 25, scale: 0.8 },
  ]);
  const [blessingReleased, setBlessingReleased] = useState(false);

  const handleReleaseLotus = () => {
    playLanternWindChime();
    const newLantern: FloatingLotusWaterLantern = {
      id: Date.now(),
      x: 10 + Math.random() * 80,
      speed: 18 + Math.random() * 12,
      scale: 0.85 + Math.random() * 0.4,
    };
    setLotusLanterns((prev) => [...prev, newLantern]);
    setBlessingReleased(true);
    setTimeout(() => setBlessingReleased(false), 3000);
  };

  useEffect(() => {
    // Parse target date or default to 2026-12-20 18:00
    const target = new Date('2026-12-20T18:00:00').getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  const heroLanternGlow = 0.5 + scrollProgress * 0.7;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden"
    >
      {/* 1. Deep Night Sky & Burgundy Vignette Background */}
      <div
        className="absolute inset-0 pointer-events-none -z-20"
        style={{
          background: 'linear-gradient(180deg, #05070E 0%, #15050C 35%, #1F0713 70%, #070B16 100%)',
        }}
      />

      {/* 2. Soft Photo Backdrop with Warm Velvet Overlay */}
      {coverImage?.trim() ? (
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-30 mix-blend-luminosity">
          <img
            src={coverImage}
            alt="Wedding Cover"
            className="w-full h-full object-cover scale-105 filter blur-xs"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#05070E] via-[#1A050E]/85 to-[#070B16]" />
        </div>
      ) : null}

      {/* 3. Golden Lantern Archway at the top of Hero */}
      <div className="w-full max-w-4xl mx-auto flex items-start justify-between px-2 sm:px-8 absolute top-8 sm:top-12 pointer-events-none z-10">
        <div className="animate-lantern-sway-left">
          <HoiAnDiamondLantern
            glowIntensity={heroLanternGlow}
            colorVariant="amber"
            className="w-12 sm:w-16 h-32 sm:h-42"
          />
        </div>
        <div className="hidden sm:flex items-center gap-3 pt-4 opacity-75">
          <div className="h-[1px] w-20 bg-linear-to-r from-transparent to-amber-400/70" />
          <VietnameseCloudOrnament className="w-16 h-6 text-amber-400/60" />
          <LotusNightIcon className="w-5 h-5 text-amber-400" />
          <VietnameseCloudOrnament className="w-16 h-6 text-amber-400/60 scale-x-[-1]" />
          <div className="h-[1px] w-20 bg-linear-to-l from-transparent to-amber-400/70" />
        </div>
        <div className="animate-lantern-sway-right">
          <HoiAnGlobeLantern
            glowIntensity={heroLanternGlow}
            colorVariant="burgundy"
            className="w-12 sm:w-16 h-30 sm:h-40"
          />
        </div>
      </div>

      {/* 4. Center Core: Names and Stars formatted exactly as requested */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-6 pt-10 sm:pt-14">
        {/* Style Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs sm:text-sm tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.35)]">
          <span>✦ Dạ Tiệc Cưới Đêm • Vietnamese Night Wedding ✦</span>
        </div>

        {/* The Exact Centerpiece Requested:
              ✦
           MINH ANH
              &
           NGỌC MAI
              ✦
           20.12.2026
        */}
        <div className="relative py-6 sm:py-8 space-y-4">
          {/* Luminous Full Moon Halo Disc behind the names */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 md:w-[28rem] h-72 sm:h-96 md:h-[28rem] rounded-full bg-radial from-amber-400/15 via-red-900/10 to-transparent blur-2xl pointer-events-none -z-10 animate-pulse" />

          {/* Top Star */}
          <div className="flex justify-center">
            <span className="inline-block animate-spin" style={{ animationDuration: '10s' }}>
              <SparklingStar className="w-7 h-7 text-amber-300" />
            </span>
          </div>

          {/* Groom Name */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif-title font-bold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-[#FFFDF0] via-[#FDE68A] via-[#FFFDF0] to-[#D97706] drop-shadow-[0_4px_30px_rgba(245,158,11,0.65)] uppercase animate-gold-shimmer">
            {groomName}
          </h1>

          {/* Ampersand */}
          <div className="text-3xl sm:text-4xl md:text-5xl font-script text-amber-400 select-none py-1 drop-shadow-[0_2px_12px_rgba(245,158,11,0.7)]">
            &amp;
          </div>

          {/* Bride Name */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif-title font-bold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-[#FFFDF0] via-[#FDE68A] via-[#FFFDF0] to-[#D97706] drop-shadow-[0_4px_30px_rgba(245,158,11,0.65)] uppercase animate-gold-shimmer">
            {brideName}
          </h2>

          {/* Bottom Star */}
          <div className="flex justify-center pt-1">
            <span className="inline-block animate-spin" style={{ animationDuration: '10s' }}>
              <SparklingStar className="w-7 h-7 text-amber-300" />
            </span>
          </div>

          {/* Exact Date */}
          <div className="pt-2 text-2xl sm:text-3xl font-serif tracking-[0.25em] text-amber-200 font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {weddingDate}
          </div>
        </div>

        {/* Romantic Evening Quote */}
        <p className="max-w-xl mx-auto font-serif italic text-sm sm:text-base text-neutral-300 leading-relaxed px-4">
          {romanticQuote}
        </p>

        {/* Evening Countdown Clock */}
        <div className="pt-3">
          <div className="inline-block p-4 sm:p-6 rounded-3xl bg-neutral-950/80 border border-amber-500/40 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            <div className="text-[11px] font-serif uppercase tracking-widest text-amber-300 mb-3 flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Thời Khắc Khai Yến Dạ Tiệc Cưới</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="bg-amber-950/50 rounded-xl px-3 sm:px-5 py-2.5 border border-amber-500/25">
                <span className="block font-serif-title text-xl sm:text-3xl font-bold text-amber-200">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-serif">Ngày</span>
              </div>
              <div className="bg-amber-950/50 rounded-xl px-3 sm:px-5 py-2.5 border border-amber-500/25">
                <span className="block font-serif-title text-xl sm:text-3xl font-bold text-amber-200">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-serif">Giờ</span>
              </div>
              <div className="bg-amber-950/50 rounded-xl px-3 sm:px-5 py-2.5 border border-amber-500/25">
                <span className="block font-serif-title text-xl sm:text-3xl font-bold text-amber-200">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-serif">Phút</span>
              </div>
              <div className="bg-amber-950/50 rounded-xl px-3 sm:px-5 py-2.5 border border-amber-500/25">
                <span className="block font-serif-title text-xl sm:text-3xl font-bold text-amber-400 animate-pulse">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-serif">Giây</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Lotus Lantern Floating on River feature */}
        <div className="pt-2 flex flex-col items-center">
          <button
            type="button"
            onClick={handleReleaseLotus}
            className="group cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-red-950/80 via-amber-950/80 to-red-950/80 border border-amber-500/40 text-amber-200 text-xs font-serif hover:border-amber-400 transition-all shadow-md active:scale-95"
          >
            <LotusNightIcon className="w-4 h-4 text-amber-400 group-hover:scale-125 transition-transform" />
            <span>Thả Một Ngọn Hoa Đăng Cầu Chúc Duyên Lành</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          </button>
          {blessingReleased && (
            <p className="text-[11px] font-serif text-amber-300 mt-2 animate-fade-in">
              ✦ Hoa đăng đã thắp sáng dòng sông, nguyện ước duyên nồng trăm năm ✦
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onRSVPClick}
            className="cursor-pointer px-8 py-3.5 rounded-full bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-serif-title font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:shadow-[0_0_40px_rgba(245,158,11,0.9)] hover:scale-105 active:scale-95"
          >
            Xác Nhận Tham Dự Dạ Yến
          </button>

          <button
            type="button"
            onClick={onExploreClick}
            className="cursor-pointer px-6 py-3.5 rounded-full bg-amber-950/70 hover:bg-amber-900/70 border border-amber-500/50 text-amber-200 font-serif-title text-xs sm:text-sm tracking-wider uppercase transition-all backdrop-blur-xs flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <span>Khám Phá Toàn Bộ Thiệp</span>
            <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
          </button>
        </div>
      </div>

      {/* 5. Riverbank Water Reflection with Floating Lotus Lanterns at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 pointer-events-none overflow-hidden z-10">
        {/* River Water Surface with Shimmer */}
        <div className="absolute inset-0 bg-linear-to-t from-[#020408] via-[#080D1A]/80 to-transparent" />
        
        {/* Water Ripples */}
        <div className="absolute bottom-4 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/20 to-transparent blur-xs animate-pulse" />
        <div className="absolute bottom-10 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/10 to-transparent blur-xs animate-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Floating Lotus Lanterns Drifting on the River */}
        {lotusLanterns.map((lantern) => (
          <div
            key={lantern.id}
            className="absolute bottom-3 sm:bottom-6 animate-water-lotus pointer-events-none"
            style={{
              left: `${lantern.x}%`,
              transform: `scale(${lantern.scale})`,
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Flame candle glow */}
              <div className="w-2.5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_12px_#F59E0B] animate-ping" />
              {/* Lotus flower boat */}
              <div className="w-8 h-4 rounded-b-full bg-linear-to-b from-rose-700 to-amber-900 border border-amber-400/60 shadow-md flex items-center justify-center">
                <div className="w-4 h-1 bg-amber-300 rounded-full" />
              </div>
              {/* Water reflection */}
              <div className="w-6 h-2 rounded-full bg-amber-400/30 blur-xs mt-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
