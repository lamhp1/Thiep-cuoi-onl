import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Plane, Calendar, Compass } from 'lucide-react';

interface PassportDestinationCountdownProps {
  weddingDate?: string;
  weddingDateTime?: string;
  city?: string;
  locationName?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function PassportDestinationCountdown({
  weddingDate = '2026-12-20',
  weddingDateTime,
  city = 'Hà Nội, Việt Nam',
  locationName = 'Trung Tâm Tiệc Cưới Hoàng Gia',
}: PassportDestinationCountdownProps) {
  // Parse target date
  const targetTimestamp = useMemo(() => {
    if (weddingDateTime) {
      const parsed = new Date(weddingDateTime).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    if (weddingDate) {
      // Formats: "YYYY-MM-DD" or "DD/MM/YYYY"
      if (weddingDate.includes('/')) {
        const [d, m, y] = weddingDate.split('/');
        const parsed = new Date(`${y}-${m}-${d}T10:00:00`).getTime();
        if (!isNaN(parsed)) return parsed;
      } else {
        const parsed = new Date(`${weddingDate}T10:00:00`).getTime();
        if (!isNaN(parsed)) return parsed;
      }
    }
    return new Date('2026-12-20T10:00:00').getTime();
  }, [weddingDate, weddingDateTime]);

  const calculateTimeLeft = (): TimeRemaining => {
    const difference = targetTimestamp - Date.now();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  const countdownUnits = [
    { label: 'NGÀY (DAYS)', value: timeLeft.days },
    { label: 'GIỜ (HOURS)', value: timeLeft.hours },
    { label: 'PHÚT (MINS)', value: timeLeft.minutes },
    { label: 'GIÂY (SECS)', value: timeLeft.seconds },
  ];

  return (
    <section id="destination" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Destination Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#172A3A] to-[#0D1822] text-[#FCFAF5] rounded-3xl p-6 sm:p-10 border-2 border-[#B99552]/40 shadow-2xl relative overflow-hidden"
        >
          {/* Compass Rose Accent */}
          <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
            <Compass className="w-64 h-64 text-[#B99552]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#B99552]/30 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[#B99552] text-xs font-mono tracking-[0.25em] font-bold uppercase">
                <Plane className="w-3.5 h-3.5" />
                <span>FLIGHT DESTINATION • LV2026</span>
              </div>
              <h3 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-wider text-[#FCFAF5] uppercase">
                NEXT DESTINATION
              </h3>
              <p className="font-serif-title italic text-sm text-[#B99552]">
                Điểm dừng chân hạnh phúc &amp; vĩnh cửu
              </p>
            </div>

            {/* Terminal Badge */}
            <div className="bg-[#B99552]/20 border border-[#B99552]/40 px-4 py-2 rounded-2xl text-right font-mono">
              <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">TERMINAL</span>
              <span className="text-sm font-bold text-[#FCFAF5] tracking-widest">GATE OF LOVE 01</span>
            </div>
          </div>

          {/* Location & Schedule Info */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#651F2A] border border-[#B99552]/50 flex items-center justify-center text-[#B99552] shrink-0 shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  ĐỊA ĐIỂM (LOCATION)
                </span>
                <span className="font-serif-title text-lg font-bold text-white block">
                  {locationName}
                </span>
                <span className="text-xs text-neutral-300 font-sans block">
                  {city}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#651F2A] border border-[#B99552]/50 flex items-center justify-center text-[#B99552] shrink-0 shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  NGÀY KHỞI HÀNH (DEPARTURE DATE)
                </span>
                <span className="font-serif-title text-lg font-bold text-white block">
                  {weddingDate}
                </span>
                <span className="text-xs text-[#B99552] font-mono block">
                  TRĂM NĂM HẠNH PHÚC
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Departure Airport Flight Board Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-8 border border-[#B99552]/30 shadow-xl space-y-6"
        >
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#651F2A] font-bold tracking-[0.25em] uppercase">
              <Clock className="w-3.5 h-3.5 text-[#B99552]" />
              <span>FLIGHT SCHEDULE</span>
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#172A3A] tracking-wider uppercase">
              DEPARTURE IN
            </h3>
            <p className="text-xs font-sans text-neutral-500">
              Đồng hồ đếm ngược giờ cất cánh đến bến bờ hôn nhân
            </p>
          </div>

          {/* Airport Flip Board Style Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {countdownUnits.map((unit) => (
              <div
                key={unit.label}
                className="bg-[#172A3A] text-[#FCFAF5] rounded-2xl p-3 sm:p-4 border-2 border-[#B99552]/40 shadow-inner flex flex-col items-center justify-center relative overflow-hidden"
              >
                {/* Horizontal split line simulating airport flip flap */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-black/40" />

                <div className="relative h-12 sm:h-14 flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={unit.value}
                      initial={{ y: -16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 16, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="font-mono text-2xl sm:text-4xl font-bold tracking-widest text-[#B99552]"
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-wider text-neutral-400 mt-1 uppercase text-center">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
