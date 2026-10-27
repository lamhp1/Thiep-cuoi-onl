import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Sparkles, CheckCircle2, Clock, Heart } from 'lucide-react';
import { playPointChime } from './loveGameSounds';

interface LoveGameCountdownSectionProps {
  weddingDate: string;
  weddingDateTime?: string;
  isCompleted: boolean;
  onCompleteQuest: () => void;
}

export function LoveGameCountdownSection({
  weddingDate,
  weddingDateTime = '2026-12-20T10:00:00',
  isCompleted,
  onCompleteQuest,
}: LoveGameCountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasAddedCalendar, setHasAddedCalendar] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(weddingDateTime).getTime();
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

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDateTime]);

  const handleAddToCalendar = () => {
    playPointChime();
    setHasAddedCalendar(true);
    if (!isCompleted) {
      onCompleteQuest();
    }

    const title = encodeURIComponent('Đám Cưới Minh Anh & Ngọc Mai');
    const details = encodeURIComponent('Lễ Thành Hôn & Tiệc Cưới Minh Anh & Ngọc Mai. Rất hân hạnh được đón tiếp bạn!');
    const location = encodeURIComponent('TP. Huế');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261220T030000Z/20261220T070000Z`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <section id="quest-countdown" className="relative py-24 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto space-y-10 text-center">
        
        {/* Section Header with Quest Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>QUEST 04 • NGÀY CƯỚI &amp; ĐẾM NGƯỢC</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Khoảnh Khắc Trọng Đại
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            Hẹn gặp lại bạn vào ngày 20.12.2026! Cùng đếm ngược từng giây đến khoảnh khắc chúng mình chính thức về chung một nhà.
          </p>

          {/* Quest completion badge */}
          <div className="pt-1">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ĐÃ HOÀN THÀNH CHẶNG 4 (+10 LOVE POINTS)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playPointChime();
                  onCompleteQuest();
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Chạm để lưu ngày cưới (+10 PTS)
              </button>
            )}
          </div>
        </div>

        {/* Gamified Countdown Digits */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { label: 'NGÀY', value: timeLeft.days, color: 'from-pink-500 to-rose-500' },
            { label: 'GIỜ', value: timeLeft.hours, color: 'from-purple-500 to-indigo-500' },
            { label: 'PHÚT', value: timeLeft.minutes, color: 'from-amber-500 to-orange-500' },
            { label: 'GIÂY', value: timeLeft.seconds, color: 'from-emerald-500 to-teal-500' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative bg-[#16132A]/85 border border-white/15 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-2 group hover:scale-105 transition-transform"
            >
              <div className="text-3xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-200">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
                {item.label}
              </div>
              <div className={`h-1 w-8 mx-auto rounded-full bg-gradient-to-r ${item.color}`} />
            </div>
          ))}
        </div>

        {/* Date Highlight & Google Calendar Reminder Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-xs sm:text-sm">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-500" />
            <span>CHỦ NHẬT • 20 THÁNG 12, 2026</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCalendar}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Bell className="w-4 h-4 animate-bounce" />
            <span>
              {hasAddedCalendar ? 'Đã Thêm Vào Lịch Hẹn!' : 'Lưu Lịch Google Calendar (+10 PTS)'}
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
