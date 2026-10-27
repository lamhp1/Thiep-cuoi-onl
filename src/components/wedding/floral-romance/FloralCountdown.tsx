import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FloralDivider } from './FloralOrnaments';

interface FloralCountdownProps {
  targetDateStr: string; // e.g. '2026-12-20T10:00:00' or '2026-12-20'
  weddingDateDisplay: string; // e.g. '20.12.2026'
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function FloralCountdown({ targetDateStr, weddingDateDisplay }: FloralCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const parsedDate = targetDateStr.includes('T')
        ? new Date(targetDateStr).getTime()
        : new Date(`${targetDateStr}T10:00:00`).getTime();

      const now = new Date().getTime();
      const diff = parsedDate - now;

      if (isNaN(diff) || diff <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const units = [
    { label: 'NGÀY', value: timeRemaining.days },
    { label: 'GIỜ', value: timeRemaining.hours },
    { label: 'PHÚT', value: timeRemaining.minutes },
    { label: 'GIÂY', value: timeRemaining.seconds },
  ];

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-[#FFFDFD] via-[#FDF3F5] to-[#FFFDFD]">
      {/* Subtle background rose & champagne glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-[#FDECEF]/60 via-[#F8E7EA]/50 to-[#FBF2E7]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtitle & Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-semibold font-body">
            ĐẾM NGƯỢC KHOẢNH KHẮC THIÊNG LIÊNG
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-normal text-[#3E2E31] italic">
            Save The Date • {weddingDateDisplay}
          </h2>
          <FloralDivider className="w-48 mx-auto my-4" />
          <p className="text-sm font-body text-[#7A696B] max-w-md mx-auto leading-relaxed">
            Từng giây phút trôi qua đều đưa chúng mình đến gần hơn với ngày chung đôi hạnh phúc trọn vẹn.
          </p>
        </motion.div>

        {/* 4 Countdown Boxes */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {units.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="relative group bg-white/90 backdrop-blur-xs border border-[#F2DCDD] hover:border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {/* Corner fine line gold accents */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#D4AF37]/60" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#D4AF37]/60" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#D4AF37]/60" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#D4AF37]/60" />

              <span className="block font-serif-title text-4xl sm:text-5xl font-medium text-[#D97D8A] tracking-tight">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="mt-1 block text-[11px] font-semibold tracking-[0.2em] text-[#8C767A] font-body">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        {timeRemaining.isPast && (
          <div className="mt-8 inline-block px-5 py-2 rounded-full bg-[#FCE4EC] text-[#C2185B] text-xs font-semibold tracking-wider font-body">
            Hôn lễ đã diễn ra ngập tràn hạnh phúc và phúc lành!
          </div>
        )}
      </div>
    </section>
  );
}
