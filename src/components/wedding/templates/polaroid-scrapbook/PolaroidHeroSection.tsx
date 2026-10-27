import { parseFlexibleDate } from '../../../../lib/utils';
import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { WashiTape, Paperclip, Thumbtack, PressedFlower, HeartSticker } from './PolaroidScrapbookOrnaments';
import { PolaroidCard } from './ScrapbookMemorabilia';

interface PolaroidHeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingDateTime?: string;
  coverImage: string;
  city?: string;
  romanticQuote?: string;
  onOpenLightbox?: (imgUrl: string) => void;
}

export function PolaroidHeroSection({
  groomName,
  brideName,
  weddingDate,
  weddingDateTime,
  coverImage,
  city = 'TP. HUẾ',
  romanticQuote = '“Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.”',
  onOpenLightbox,
}: PolaroidHeroSectionProps) {
  // Countdown calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const parsed = parseFlexibleDate(weddingDateTime || weddingDate, '10:00:00');
    const target = parsed ? parsed.getTime() : new Date('2026-12-20T10:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDateTime, weddingDate]);

  return (
    <section id="hero" className="relative pt-12 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
      {/* Scattered decorative ornaments */}
      <div className="absolute top-4 left-6 hidden sm:block">
        <PressedFlower angle={-15} />
      </div>
      <div className="absolute top-8 right-8 hidden sm:block">
        <Paperclip angle={20} />
      </div>

      {/* Scrapbook Banner Header */}
      <div className="inline-block relative mb-6">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <WashiTape style="pink-grid" angle={-2} width="w-28" />
        </div>
        <div className="bg-[#FFFDF9] border border-[#E3D4BC] px-6 py-2 rounded-xs shadow-sm inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D9735A]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#7E5E44] font-bold">
            CHUYỆN TÌNH YÊU & THIỆP BÁO HỶ
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#D9735A]" />
        </div>
      </div>

      {/* Handwritten Big Headline */}
      <div className="space-y-2 mb-8">
        <h2 className="font-polaroid-handwriting text-3xl sm:text-5xl md:text-6xl text-[#C84B5D] font-bold tracking-tight">
          We're Getting Married!
        </h2>
        <h1 className="font-serif-title text-3xl sm:text-5xl md:text-6xl font-bold text-[#2C211B] leading-tight">
          {groomName} <span className="text-[#D9735A] font-serif font-light">&</span> {brideName}
        </h1>
        <p className="font-polaroid-note text-lg sm:text-2xl text-[#825C3E]">
          {romanticQuote}
        </p>
      </div>

      {/* Centerpiece: Hero Polaroid Photo */}
      <div className="relative max-w-md sm:max-w-lg mx-auto mb-10">
        {/* Thumbtack on top center */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
          <Thumbtack color="gold" />
        </div>

        <PolaroidCard
          image={coverImage}
          date={weddingDate}
          caption="Our happiest day begins here"
          rotation={-2}
          washiStyle="kraft"
          washiPosition="both-top"
          stickerText="SAVE THE DATE"
          isHero={true}
          onClick={() => onOpenLightbox && onOpenLightbox(coverImage)}
        />
      </div>

      {/* Countdown Clock designed as Hand-pinned Sticky Notes */}
      <div className="max-w-xl mx-auto mt-6">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#8C6D1F] uppercase tracking-widest mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>ĐẾM NGƯỢC ĐẾN NGÀY CHUNG ĐÔI</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          {[
            { label: 'NGÀY', value: timeLeft.days, rot: -2, tape: 'pink-grid' as const },
            { label: 'GIỜ', value: timeLeft.hours, rot: 1.5, tape: 'mint-dots' as const },
            { label: 'PHÚT', value: timeLeft.minutes, rot: -1, tape: 'yellow-stripes' as const },
            { label: 'GIÂY', value: timeLeft.seconds, rot: 2, tape: 'rose-floral' as const },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{ transform: `rotate(${item.rot}deg)` }}
              className="relative bg-[#FFFDF9] border border-[#E0D2BB] p-3 sm:p-4 rounded-xs shadow-md transition-transform hover:rotate-0 hover:scale-105 select-none"
            >
              {/* Mini washi tape on top of sticky note */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
                <WashiTape style={item.tape} angle={item.rot > 0 ? 3 : -3} width="w-12 sm:w-16" />
              </div>
              <div className="font-serif-title text-2xl sm:text-4xl font-extrabold text-[#2C211B] mt-1">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-mono font-bold text-[#8C6D1F] uppercase mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
