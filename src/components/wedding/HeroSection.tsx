import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronDown, MapPin, Heart } from 'lucide-react';
import { calculateCountdown, formatVietnameseDate } from '../../lib/utils';
import { CoupleNamesStacked } from './common/CoupleNamesStacked';

interface HeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingDateTime: string;
  city: string;
  romanticQuote: string;
  coverImage: string;
  accentColor?: string;
}

export function HeroSection({
  groomName,
  brideName,
  weddingDate,
  weddingDateTime,
  city,
  romanticQuote,
  coverImage,
}: HeroSectionProps) {
  const [countdown, setCountdown] = useState(() => calculateCountdown(weddingDateTime || weddingDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(weddingDateTime || weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDateTime, weddingDate]);

  const handleScrollDown = () => {
    const nextSection = document.querySelector('#couple');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center text-center overflow-hidden bg-black">
      {/* Background Image with subtle zoom/parallax & gradient mask */}
      <div className="absolute inset-0 z-0">
        <img
          src={coverImage}
          alt={`Lễ thành hôn ${groomName} & ${brideName}`}
          className="w-full h-full object-cover object-center scale-105 animate-[pulse_12s_ease-in-out_infinite]"
          referrerPolicy="no-referrer"
        />
        {/* Luxury multi-layer dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60" />
        {/* Ornamental subtle border vignette */}
        <div className="absolute inset-4 sm:inset-8 border border-[#D4AF37]/25 pointer-events-none rounded-2xl" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24 flex flex-col items-center justify-center text-white">
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] mb-6 text-xs sm:text-sm font-body tracking-[0.25em] uppercase"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Save Our Date</span>
          <Heart className="w-3.5 h-3.5 fill-current" />
        </motion.div>

        {/* Groom & Bride Names: 3-row layout Groom / Heart / Bride */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="my-2 w-full max-w-3xl mx-auto px-2"
        >
          <CoupleNamesStacked
            groomName={groomName}
            brideName={brideName}
            variant="hero"
            textColor="#FDFBF7"
            heartColor="#D4AF37"
            groomClassName="font-light drop-shadow-md"
            brideClassName="font-light drop-shadow-md"
            idPrefix="classic-hero"
          />
        </motion.div>

        {/* Romantic Quote */}
        {romanticQuote && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 max-w-xl text-sm sm:text-base md:text-lg font-serif-title italic text-neutral-200/90 leading-relaxed drop-shadow"
          >
            {romanticQuote}
          </motion.p>
        )}

        {/* Wedding Date & Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-body text-neutral-200"
        >
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>{formatVietnameseDate(weddingDate)}</span>
          </div>
          {city && (
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>{city}</span>
            </div>
          )}
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-10 w-full max-w-lg"
        >
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-[#D4AF37]/35 shadow-2xl">
            {/* Days */}
            <div className="flex flex-col items-center">
              <span className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-semibold text-[#D4AF37]">
                {String(countdown.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-body text-neutral-300 mt-1">
                Ngày
              </span>
            </div>
            {/* Hours */}
            <div className="flex flex-col items-center border-l border-white/15">
              <span className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-semibold text-[#D4AF37]">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-body text-neutral-300 mt-1">
                Giờ
              </span>
            </div>
            {/* Minutes */}
            <div className="flex flex-col items-center border-l border-white/15">
              <span className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-semibold text-[#D4AF37]">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-body text-neutral-300 mt-1">
                Phút
              </span>
            </div>
            {/* Seconds */}
            <div className="flex flex-col items-center border-l border-white/15">
              <span className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-semibold text-[#D4AF37]">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-body text-neutral-300 mt-1">
                Giây
              </span>
            </div>
          </div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.button
          id="scroll-down-btn"
          onClick={handleScrollDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-12 text-[#D4AF37] hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer"
          aria-label="Cuộn xuống xem thông tin"
        >
          <span className="text-[11px] font-body tracking-[0.2em] uppercase text-neutral-300">
            Khám phá
          </span>
          <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
        </motion.button>
      </div>
    </section>
  );
}
