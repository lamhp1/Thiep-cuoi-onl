import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { WeddingEvent } from '../../../../types';
import { Calendar, Clock, MapPin, Heart } from 'lucide-react';
import { SmartEventActions } from '../../common/SmartEventActions';
import {
  BotanicalSketch,
  LoveLetterWashiTape,
  LoveLetterWaxSeal,
  InkUnderline,
} from './LoveLetterOrnaments';

interface LoveLetterEventsSectionProps {
  events: WeddingEvent[];
  weddingDate: string;
  weddingDateTime?: string;
}

export function LoveLetterEventsSection({
  events,
  weddingDate,
  weddingDateTime,
}: LoveLetterEventsSectionProps) {
  // Countdown calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(weddingDateTime || `${weddingDate}T10:00:00`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDate, weddingDateTime]);

  const displayEvents = events && events.length > 0 ? events : [];

  return (
    <section id="events" className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#C8A96B]/35 text-[#7A2638] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 shadow-xs">
          <Calendar className="w-3 h-3 text-[#7A2638]" />
          <span>WEDDING DETAILS</span>
        </div>
        <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#59483E] tracking-tight">
          Thư Mời &amp; Lịch Trình Hôn Lễ
        </h2>
        <p className="font-handwriting text-xl sm:text-2xl text-[#7A2638] mt-2">
          Thời gian &amp; địa điểm chúng mình đón chờ sự hiện diện của bạn
        </p>
      </div>

      {/* Countdown Card in Stationery Style */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative max-w-xl mx-auto bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#C8A96B]/35 shadow-xl text-center mb-14"
        style={{
          boxShadow: '0 12px 30px -10px rgba(89,72,62,0.12)',
        }}
      >
        <LoveLetterWashiTape className="-top-3 left-1/2 -translate-x-1/2" color="gold" angle={0} />

        <div className="text-xs uppercase tracking-[0.25em] text-[#7A2638] font-semibold mb-3">
          ĐẾM NGƯỢC ĐẾN NGÀY VỀ CHUNG MỘT NHÀ
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
          {[
            { label: 'NGÀY', value: timeLeft.days },
            { label: 'GIỜ', value: timeLeft.hours },
            { label: 'PHÚT', value: timeLeft.minutes },
            { label: 'GIÂY', value: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#F7F1E7]/70 border border-[#C8A96B]/30 rounded-2xl p-2.5 sm:p-3 text-center"
            >
              <span className="font-serif-title text-2xl sm:text-3xl font-bold text-[#7A2638] block leading-none">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#59483E]/70 tracking-widest uppercase font-semibold mt-1 block">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="font-handwriting text-base sm:text-lg text-[#59483E]/80 mt-4">
          Hẹn gặp bạn vào ngày {weddingDate} ♥
        </p>
      </motion.div>

      {/* Events Note Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {displayEvents.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, y: 30, rotate: isEven ? -1 : 1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#C8A96B]/35 shadow-xl flex flex-col justify-between overflow-visible"
              style={{
                boxShadow: '0 15px 35px -10px rgba(89,72,62,0.12)',
              }}
            >
              {/* Washi Tape Pinning */}
              <LoveLetterWashiTape
                className={`-top-3 ${isEven ? 'left-8' : 'right-8'}`}
                color={isEven ? 'dusty-rose' : 'sage'}
                angle={isEven ? -2 : 2}
              />

              <div>
                {/* Event Type & Header */}
                <div className="flex items-center justify-between border-b border-[#C8A96B]/20 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-semibold tracking-widest text-[#C8A96B] uppercase block">
                      CHƯƠNG TRÌNH
                    </span>
                    <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-[#59483E] mt-0.5">
                      {event.title}
                    </h3>
                  </div>
                  <LoveLetterWaxSeal text="INVITED" size="sm" />
                </div>

                {/* Date & Time */}
                <div className="space-y-3 font-serif text-sm sm:text-base text-[#59483E] mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F7F1E7] border border-[#C8A96B]/30 flex items-center justify-center text-[#7A2638] shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-[#7A2638] text-lg font-serif-title">
                        {event.time}
                      </span>
                      <span className="text-xs text-[#59483E]/70 ml-2">
                        {event.date || weddingDate}
                      </span>
                    </div>
                  </div>

                  {/* Venue Name & Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F7F1E7] border border-[#C8A96B]/30 flex items-center justify-center text-[#7A2638] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#59483E]">
                        {event.locationName}
                      </div>
                      <div className="text-xs text-[#59483E]/80 leading-relaxed mt-0.5">
                        {event.address}
                      </div>
                    </div>
                  </div>

                  {/* Description note if present */}
                  {event.description && (
                    <p className="font-serif text-xs text-[#59483E]/75 italic pl-11 pt-1">
                      "{event.description}"
                    </p>
                  )}
                </div>
              </div>

              {/* Smart Actions: Map, Grab/Be Ride, Add to Calendar */}
              <SmartEventActions
                event={{
                  title: event.title,
                  date: event.date || weddingDate,
                  time: event.time,
                  locationName: event.locationName,
                  address: event.address,
                  description: event.description,
                  mapUrl: event.mapUrl,
                }}
                theme="red"
                className="pt-4 border-t border-[#C8A96B]/20"
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
