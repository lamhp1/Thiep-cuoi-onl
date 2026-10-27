import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Compass, Heart, Navigation, Clock } from 'lucide-react';
import { LovePostalStamp, TravelPlaneIcon } from './LoveMapOrnaments';

interface LoveMapWeddingDestinationProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  locationName?: string;
  address?: string;
  mapUrl?: string;
}

export function LoveMapWeddingDestination({
  groomName,
  brideName,
  weddingDate = '2026-12-20',
  locationName = 'Trung Tâm Yến Tiệc Hoàng Gia Imperial',
  address = '456 Đường Lê Lợi, Phường Phú Hội, TP. Huế',
  mapUrl = 'https://maps.google.com',
}: LoveMapWeddingDestinationProps) {
  // Departure board countdown calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Parse target wedding date
    let target = new Date('2026-12-20T18:00:00');
    if (weddingDate) {
      if (weddingDate.includes('-')) {
        target = new Date(weddingDate);
      } else if (weddingDate.includes('/')) {
        const parts = weddingDate.split('/');
        if (parts.length === 3) {
          target = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T18:00:00`);
        }
      }
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target.getTime() - now;

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
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  // Format date for display
  const displayDate = React.useMemo(() => {
    if (weddingDate.includes('-')) {
      const p = weddingDate.split('-');
      if (p.length === 3) return `${p[2]}.${p[1]}.${p[0]}`;
    }
    return weddingDate || '20.12.2026';
  }, [weddingDate]);

  return (
    <section
      id="wedding-destination"
      className="relative py-20 lg:py-28 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      {/* Topographic Background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
      >
        <circle cx="500" cy="400" r="300" fill="none" stroke="#B9985A" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="500" cy="400" r="420" fill="none" stroke="#722238" strokeWidth="0.8" opacity="0.5" />
      </svg>

      <div className="relative z-20 max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#722238]">
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>NEXT & FINAL DESTINATION</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#443B35]">
            ĐIỂM ĐẾN HÔN LỄ
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/80 font-body leading-relaxed">
            Trạm dừng quan trọng nhất trong hành trình: Nơi hai trái tim chính thức hòa làm một.
          </p>
        </div>

        {/* Travel Ticket / Boarding Pass */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto mb-16 bg-[#FFFDF9] rounded-3xl border border-[#B9985A]/45 shadow-2xl overflow-hidden"
        >
          {/* Ticket Header Bar */}
          <div className="px-6 sm:px-8 py-3.5 bg-[#722238] text-[#FFFDF9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TravelPlaneIcon className="w-4 h-4 text-[#B9985A]" />
              <span className="font-serif font-bold text-xs sm:text-sm tracking-widest uppercase">
                LOVE JOURNEY TICKET
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#B9985A]">
              PASSENGER TICKET &amp; BAGGAGE CHECK
            </span>
          </div>

          {/* Ticket Body: Main Pass + Perforated Stub */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#B9985A]/40 p-6 sm:p-8 items-center gap-6">
            {/* Left 8 Cols: Main Flight Pass */}
            <div className="md:col-span-8 space-y-6 pr-0 md:pr-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9.5px] uppercase tracking-widest font-bold text-[#722238]/70 block mb-1">
                    PASSENGERS / HÀNH KHÁCH
                  </span>
                  <p className="font-serif-title text-base sm:text-lg font-bold text-[#443B35]">
                    {groomName} &amp; {brideName}
                  </p>
                </div>
                <div>
                  <span className="text-[9.5px] uppercase tracking-widest font-bold text-[#722238]/70 block mb-1">
                    DESTINATION / ĐIỂM ĐẾN
                  </span>
                  <p className="font-serif-title text-base sm:text-lg font-bold text-[#722238] flex items-center gap-1">
                    <span>FOREVER</span>
                    <Heart className="w-3.5 h-3.5 fill-[#722238]" />
                  </p>
                </div>
              </div>

              {/* Flight Specs Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 py-3 border-y border-[#B9985A]/20 text-center">
                <div className="p-2 rounded-xl bg-[#F5EFE3]/60">
                  <span className="text-[9px] uppercase tracking-widest text-[#722238] block font-bold">
                    DATE / NGÀY
                  </span>
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#443B35]">
                    {displayDate}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#F5EFE3]/60">
                  <span className="text-[9px] uppercase tracking-widest text-[#722238] block font-bold">
                    GATE / CỔNG
                  </span>
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#722238]">
                    LOVE 01
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#F5EFE3]/60">
                  <span className="text-[9px] uppercase tracking-widest text-[#722238] block font-bold">
                    BOARDING / KHỞI HÀNH
                  </span>
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#53665A]">
                    NOW &amp; FOREVER
                  </span>
                </div>
              </div>

              {/* Venue address & Map button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#722238] tracking-wider block">
                    ĐỊA ĐIỂM TỔ CHỨC:
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#443B35]">
                    {locationName}
                  </h4>
                  <p className="text-xs text-[#443B35]/75 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#B9985A] shrink-0" />
                    <span className="truncate">{address}</span>
                  </p>
                </div>

                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#722238] hover:bg-[#5a1a2b] text-[#FFFDF9] text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 shadow-sm"
                  >
                    <Navigation className="w-3 h-3 text-[#B9985A]" />
                    <span>XEM BẢN ĐỒ</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right 4 Cols: Perforated Tear-off Stub */}
            <div className="md:col-span-4 flex flex-col items-center justify-between text-center space-y-4 pt-4 md:pt-0 pl-0 md:pl-4">
              <LovePostalStamp
                date={displayDate}
                city="LOVE DESTINATION"
                className="w-20 h-20"
              />

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#722238] font-bold block">
                  FLIGHT STATUS
                </span>
                <span className="px-3 py-1 rounded-full bg-[#53665A]/15 text-[#53665A] font-bold text-xs tracking-wider uppercase">
                  ON TIME • CONFIRMED
                </span>
              </div>

              {/* Decorative Mock Barcode */}
              <div className="w-full pt-2">
                <div className="h-8 w-3/4 mx-auto flex items-stretch justify-center gap-[2px] opacity-70">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className="bg-[#443B35]"
                      style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '1px' }}
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-[#443B35]/60 tracking-[0.2em] block mt-1">
                  LV-2026-FOREVER
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Departure Board Style Countdown */}
        <div className="max-w-3xl mx-auto bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#B9985A]/40 shadow-xl text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#722238] mb-6">
            <Clock className="w-4 h-4 text-[#B9985A]" />
            <span>COUNTDOWN TO OUR DESTINATION</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
            {/* Days */}
            <div className="bg-[#FAF6EE] rounded-2xl p-3 sm:p-4 border border-[#B9985A]/30 shadow-xs flex flex-col items-center">
              <span className="font-serif-title text-3xl sm:text-4xl font-bold text-[#722238]">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#B9985A] mt-1">
                NGÀY
              </span>
            </div>

            {/* Hours */}
            <div className="bg-[#FAF6EE] rounded-2xl p-3 sm:p-4 border border-[#B9985A]/30 shadow-xs flex flex-col items-center">
              <span className="font-serif-title text-3xl sm:text-4xl font-bold text-[#722238]">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#B9985A] mt-1">
                GIỜ
              </span>
            </div>

            {/* Minutes */}
            <div className="bg-[#FAF6EE] rounded-2xl p-3 sm:p-4 border border-[#B9985A]/30 shadow-xs flex flex-col items-center">
              <span className="font-serif-title text-3xl sm:text-4xl font-bold text-[#722238]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#B9985A] mt-1">
                PHÚT
              </span>
            </div>

            {/* Seconds */}
            <div className="bg-[#FAF6EE] rounded-2xl p-3 sm:p-4 border border-[#B9985A]/30 shadow-xs flex flex-col items-center">
              <span className="font-serif-title text-3xl sm:text-4xl font-bold text-[#53665A]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#53665A] mt-1">
                GIÂY
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
