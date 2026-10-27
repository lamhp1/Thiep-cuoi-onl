import React, { useState, useEffect } from 'react';
import { FolkCloud, FolkLotus, FolkBird, FolkRedSeal } from './FairytaleOrnaments';
import { Calendar, MapPin, Sparkles, Heart } from 'lucide-react';

interface FairytaleHeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  coverImage?: string;
  location?: string;
  onExploreChapters?: () => void;
}

export function FairytaleHeroSection({
  groomName,
  brideName,
  weddingDate,
  coverImage,
  location = 'Làng Quê Việt Nam',
  onExploreChapters,
}: FairytaleHeroSectionProps) {
  const safeCoverImage =
    coverImage?.trim() || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85';

  // Countdown Timer calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Parse weddingDate or fallback
    const target = new Date();
    target.setDate(target.getDate() + 45); // default fallback ~45 days

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <section id="hero" className="relative pt-8 pb-16 px-4 overflow-hidden">
      {/* Background Decorative Graphic Elements */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-40">
        <FolkCloud className="w-48 sm:w-64 h-auto text-[#BA262B]" />
      </div>
      <div className="absolute top-20 left-0 pointer-events-none opacity-30">
        <FolkCloud className="w-40 sm:w-56 h-auto text-[#2D6A4F] scale-x-[-1]" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        {/* Storybook Cover Ribbon */}
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-[#BA262B]/10 border-2 border-[#BA262B]/30 text-[#BA262B] text-xs font-semibold uppercase tracking-[0.25em]">
          <FolkBird className="w-4 h-4 text-[#BA262B]" />
          <span>Chuyện Cổ Tích Lương Duyên • Trăm Năm Hạnh Phúc</span>
          <FolkBird className="w-4 h-4 text-[#BA262B] scale-x-[-1]" />
        </div>

        {/* Hero Title with Folk Art Calligraphy */}
        <div className="space-y-2">
          <p className="font-poetry text-base sm:text-lg text-[#853023] italic">
            "Duyên trời định sẵn tự ngàn năm, trăng tròn vành vạnh tỏ tình thâm"
          </p>
          <h1 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-bold text-[#351E17] tracking-tight leading-tight sm:leading-none">
            {groomName} <span className="text-[#BA262B] font-serif font-light">&amp;</span> {brideName}
          </h1>
        </div>

        {/* Date & Location Plaque */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-serif text-[#6D271C]">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5EB] border border-[#BA262B]/30 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#BA262B]" />
            <span className="font-bold tracking-wider">{weddingDate}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5EB] border border-[#BA262B]/30 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span className="font-bold tracking-wider">{location}</span>
          </div>
        </div>

        {/* Illustrated Modern Folk Art Storybook Portrait Card */}
        <div className="relative max-w-2xl mx-auto mt-6 group">
          {/* Folk border frame with corner seals */}
          <div className="absolute -inset-2.5 bg-gradient-to-r from-[#9E3E2F] via-[#E5A93C] to-[#2D6A4F] rounded-3xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity" />

          <div className="relative bg-[#FFFDF9] rounded-2xl p-3 sm:p-4 border-2 border-[#D9CBB7] shadow-2xl overflow-hidden">
            {/* Corner Decorative Folk Ornaments */}
            <div className="absolute top-2 left-2 z-20">
              <FolkRedSeal text="HỶ" subtitle="" className="w-8 h-8 text-[#BA262B] bg-[#BA262B]/10 border-[#BA262B]" />
            </div>
            <div className="absolute top-2 right-2 z-20">
              <FolkRedSeal text="DUYÊN" subtitle="" className="w-8 h-8 text-[#BA262B] bg-[#BA262B]/10 border-[#BA262B]" />
            </div>

            {/* Main Picture with soft warm vintage film tone */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden shadow-inner">
              <img
                src={safeCoverImage}
                alt={`${groomName} & ${brideName}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-[1.02] saturate-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/70 via-transparent to-black/20" />

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-4 right-4 text-left flex items-end justify-between text-[#FAF5EB]">
                <div>
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#E5A93C] uppercase block">
                    TRANH KỶ NIỆM ĐẠI HỶ
                  </span>
                  <h3 className="font-serif-title text-base sm:text-xl font-bold drop-shadow">
                    Lễ Vu Quy &amp; Thành Hôn
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-serif">
                  <Heart className="w-3.5 h-3.5 text-[#BA262B] fill-current animate-pulse" />
                  <span>Một Nhà</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown to Fairytale Wedding Day (Đếm ngược ngày lành) */}
        <div className="pt-4 max-w-md mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#853023] mb-3">
            Thời Khắc Hoàng Đạo Đang Đến Gần
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Ngày', value: timeLeft.days },
              { label: 'Giờ', value: timeLeft.hours },
              { label: 'Phút', value: timeLeft.minutes },
              { label: 'Giây', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FFFDF9] border border-[#BA262B]/25 rounded-xl p-2.5 sm:p-3 shadow-xs text-center flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#BA262B] to-[#E5A93C]" />
                <span className="font-serif-title text-xl sm:text-2xl font-bold text-[#351E17] leading-none">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-serif text-[#7A4C3E] uppercase tracking-wider mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll invitation */}
        {onExploreChapters && (
          <div className="pt-4">
            <button
              onClick={onExploreChapters}
              className="inline-flex items-center gap-2 text-xs font-serif text-[#BA262B] hover:text-[#853023] font-bold tracking-wider underline underline-offset-4 cursor-pointer transition-colors"
            >
              <span>Cuộn xuống để đọc tiếp từng chương cổ tích</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
