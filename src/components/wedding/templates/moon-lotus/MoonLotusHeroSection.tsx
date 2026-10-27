import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Heart, ChevronDown } from 'lucide-react';
import { DetailedMoon, ArtisticBloomingLotus, CelestialClouds } from './MoonLotusOrnaments';

interface MoonLotusHeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  romanticQuote?: string;
  coverImage?: string;
  scrollProgress: number;
  onRSVPClick: () => void;
  onExploreClick: () => void;
}

export function MoonLotusHeroSection({
  groomName,
  brideName,
  weddingDate,
  romanticQuote,
  coverImage,
  scrollProgress,
  onRSVPClick,
  onExploreClick,
}: MoonLotusHeroSectionProps) {
  // Countdown timer calculation to 2026-12-20
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-12-20T10:00:00+07:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate moon top-sky position offset on scroll
  const moonTranslateY = Math.min(180, scrollProgress * 300);
  const heroLotusBloom = Math.min(1, 0.4 + scrollProgress * 1.5);

  const defaultPhoto =
    coverImage ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';

  return (
    <section className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-20 pb-16 overflow-hidden">
      {/* 1. Ethereal Drifting Clouds in the background */}
      <CelestialClouds
        direction="left"
        className="top-12 left-[-10%] w-[120%] h-40 opacity-40"
      />
      <CelestialClouds
        direction="right"
        className="top-36 right-[-10%] w-[120%] h-48 opacity-30"
      />

      {/* 2. Top Header Crown */}
      <div className="relative z-20 max-w-2xl mx-auto space-y-3 pt-6 animate-fadeIn">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-[0.25em] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#EBD494]" />
          <span>Under The Same Moon</span>
          <Sparkles className="w-3.5 h-3.5 text-[#EBD494]" />
        </div>

        <p className="font-serif italic text-xs sm:text-sm text-[#F4E4BA]/85 tracking-widest">
          “Hai phương trời, chung một ánh trăng thề • Trăm năm gắn kết một mối lương duyên”
        </p>
      </div>

      {/* 3. Central Hero Composition: Arched Moon-Gate Portrait with the Moon & Lotus */}
      <div className="relative z-20 my-8 flex flex-col items-center justify-center w-full max-w-4xl">
        {/* Floating Moon in top celestial sky (drifts gracefully as user scrolls) */}
        <div
          className="absolute -top-12 sm:-top-16 right-4 sm:right-12 z-10 transition-transform duration-300 pointer-events-auto"
          style={{ transform: `translateY(${moonTranslateY * 0.4}px)` }}
        >
          <DetailedMoon size={160} className="sm:w-[200px] sm:h-[200px]" />
        </div>

        {/* Arched Couple Portrait with Golden Moon Gate Filigree */}
        <div className="relative w-72 sm:w-88 aspect-[3/4] rounded-t-full rounded-b-3xl overflow-hidden border-2 border-[#EBD494]/50 shadow-[0_20px_60px_rgba(0,0,0,0.75),0_0_40px_rgba(235,212,148,0.2)] bg-[#120E28] group">
          <img
            src={defaultPhoto}
            alt={`${groomName} & ${brideName}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
          />
          {/* Subtle Burgundy-to-Midnight gradient overlay at base */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B28] via-transparent to-transparent opacity-80" />

          {/* Arched Inner Border Accent */}
          <div className="absolute inset-2.5 rounded-t-full rounded-b-2xl border border-[#EBD494]/30 pointer-events-none" />

          {/* Couple Names on the portrait base */}
          <div className="absolute bottom-6 inset-x-0 text-center px-4 space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#EBD494]/90 font-serif">
              Lễ Thành Hôn
            </p>
            <h2 className="text-xl sm:text-2xl font-serif-title font-bold text-white tracking-wider drop-shadow-md">
              {groomName} <span className="text-[#EBD494] font-serif">&amp;</span> {brideName}
            </h2>
            <p className="text-xs font-serif text-[#F4E4BA]/90 tracking-widest">
              20 • 12 • 2026
            </p>
          </div>
        </div>

        {/* Blooming Lotus Flowers at the pedestal base */}
        <div className="relative -mt-10 z-30 flex items-center justify-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <ArtisticBloomingLotus size={120} bloomProgress={heroLotusBloom * 0.85} />
          </div>
          <ArtisticBloomingLotus size={160} bloomProgress={heroLotusBloom} />
          <div className="hidden sm:block">
            <ArtisticBloomingLotus size={120} bloomProgress={heroLotusBloom * 0.85} />
          </div>
        </div>
      </div>

      {/* 4. Countdown Timer: "Đếm Ngược Dưới Ánh Trăng" */}
      <div className="relative z-20 w-full max-w-xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {[
            { label: 'Ngày', value: timeLeft.days },
            { label: 'Giờ', value: timeLeft.hours },
            { label: 'Phút', value: timeLeft.minutes },
            { label: 'Giây', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex-1 max-w-[85px] py-3 px-2 rounded-2xl bg-[#120E28]/80 border border-[#EBD494]/35 shadow-lg backdrop-blur-md"
            >
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#F4E4BA]">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="block text-[10px] sm:text-xs font-serif uppercase tracking-widest text-[#EBD494]/75 mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRSVPClick}
            className="cursor-pointer px-6 py-2.5 rounded-full bg-gradient-to-r from-[#751A29] to-[#A8283D] hover:from-[#8C2033] hover:to-[#B83047] border border-[#EBD494]/60 text-white font-serif text-xs uppercase tracking-wider font-semibold shadow-lg hover:scale-105 transition-all"
          >
            Xác Nhận Tham Dự (RSVP)
          </button>
          <button
            onClick={onExploreClick}
            className="cursor-pointer px-6 py-2.5 rounded-full bg-[#120E28]/80 hover:bg-[#1C163C] border border-[#EBD494]/40 text-[#F4E4BA] font-serif text-xs uppercase tracking-wider transition-all hover:scale-105"
          >
            Khám Phá Thiệp Cưới
          </button>
        </div>

        {/* Down indicator */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onExploreClick}
            className="cursor-pointer text-[#EBD494]/70 hover:text-[#EBD494] transition-colors animate-bounce"
            title="Cuộn xuống"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
