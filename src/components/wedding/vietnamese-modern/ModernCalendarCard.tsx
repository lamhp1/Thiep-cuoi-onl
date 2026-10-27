import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, CalendarPlus, Sparkles, Download } from 'lucide-react';
import { calculateCountdown, createGoogleCalendarUrl, parseFlexibleDate } from '../../../lib/utils';
import { MiniSongHy, MinimalistLotus } from './VietnameseModernOrnaments';

interface ModernCalendarCardProps {
  weddingDateStr?: string; // "2026-12-20"
  weddingDateTime?: string; // "2026-12-20T10:00:00"
  groomName?: string;
  brideName?: string;
  primaryLocation?: string;
  primaryAddress?: string;
}

export function ModernCalendarCard({
  weddingDateStr = '2026-12-20',
  weddingDateTime = '2026-12-20T10:00:00',
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
  primaryLocation = 'Trung Tâm Yến Tiệc Hoàng Gia Imperial',
  primaryAddress = '456 Đường Lê Lợi, TP. Huế',
}: ModernCalendarCardProps) {
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(weddingDateTime || weddingDateStr)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(weddingDateTime || weddingDateStr));
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDateTime, weddingDateStr]);

  // Parse date
  const dateObj = parseFlexibleDate(weddingDateStr || '2026-12-20') || new Date(2026, 11, 20);
  const dayNum = dateObj.getDate() || 20;
  const monthNum = dateObj.getMonth() + 1 || 12;
  const yearNum = dateObj.getFullYear() || 2026;

  // Day of week in English and Vietnamese
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const daysOfWeekVi = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
  const dayIndex = dateObj.getDay() || 0;
  const dayEn = daysOfWeek[dayIndex];
  const dayVi = daysOfWeekVi[dayIndex];

  // Google Calendar URL
  const googleCalendarUrl = createGoogleCalendarUrl(
    `Lễ Cưới: ${groomName} & ${brideName}`,
    weddingDateStr,
    '10:00:00',
    `${primaryLocation}, ${primaryAddress}`,
    `Trân trọng kính mời quý khách đến dự lễ cưới và chung vui cùng gia đình ${groomName} & ${brideName}.`
  );

  // Download .ics file
  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LAmour Wedding//Vietnamese Modern Luxury//VI',
      'BEGIN:VEVENT',
      `SUMMARY:Lễ Cưới ${groomName} & ${brideName}`,
      `DESCRIPTION:Trân trọng kính mời quý khách tham dự lễ thành hôn của ${groomName} và ${brideName}`,
      `LOCATION:${primaryLocation}, ${primaryAddress}`,
      `DTSTART:${yearNum}${String(monthNum).padStart(2, '0')}${String(dayNum).padStart(2, '0')}T100000`,
      `DTEND:${yearNum}${String(monthNum).padStart(2, '0')}${String(dayNum).padStart(2, '0')}T140000`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `le-cuoi-${groomName}-${brideName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="wedding-date-calendar" className="py-20 sm:py-24 bg-[#F2ECE1] relative overflow-hidden">
      {/* Subtle Lotus Watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-15 translate-x-12 translate-y-12">
        <MinimalistLotus className="w-80 h-80 text-[#D8BE87]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#63121D]/10 text-[#63121D] text-xs font-semibold uppercase tracking-[0.2em]">
            <MiniSongHy className="w-3.5 h-3.5 text-[#63121D]" />
            <span>Save The Date</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#18181A]">
            Ngày Vui Trọng Đại
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#6E665A]">
            Khoảnh khắc chúng mình chính thức nên duyên vợ chồng
          </p>
        </div>

        {/* The Vietnamese Modern Calendar Card */}
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="relative bg-[#FFFFFF] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D8BE87] ring-8 ring-[#E6DCC8]"
          >
            {/* Top Red Wine Binder Header */}
            <div className="bg-[#63121D] px-6 py-4 text-center text-[#F8F4EC] relative">
              {/* Golden hanging rings/binder clips effect */}
              <div className="absolute -top-3 left-10 flex gap-2">
                <span className="w-3.5 h-6 rounded-full border-2 border-[#D8BE87] bg-[#18181A] shadow-md" />
              </div>
              <div className="absolute -top-3 right-10 flex gap-2">
                <span className="w-3.5 h-6 rounded-full border-2 border-[#D8BE87] bg-[#18181A] shadow-md" />
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#D8BE87]" />
                <span className="font-body text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#D8BE87]">
                  THÁNG {monthNum} / {yearNum}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#D8BE87]" />
              </div>
            </div>

            {/* Calendar Tear-Sheet Body */}
            <div className="p-5 xs:p-6 sm:p-10 pb-8 sm:pb-10 text-center bg-gradient-to-b from-white via-[#FFFDF9] to-[#FAF7F2] relative">
              {/* Background fine watermark of Dong Son / Lotus */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <MinimalistLotus className="w-64 h-64 text-[#18181A]" />
              </div>

              {/* Massive Modern Numeral */}
              <div className="relative z-10 my-2">
                <span className="font-serif-title text-7xl sm:text-8xl md:text-9xl font-extrabold text-[#18181A] tracking-tighter block leading-none select-none">
                  {dayNum < 10 ? `0${dayNum}` : dayNum}
                </span>
              </div>

              {/* Day of the Week (SUNDAY / CHỦ NHẬT) */}
              <div className="relative z-10 mb-6">
                <span className="font-body text-base sm:text-lg font-bold tracking-[0.3em] text-[#63121D] uppercase block">
                  {dayEn}
                </span>
                <span className="text-xs text-[#8C8275] tracking-widest uppercase">
                  {dayVi}
                </span>
              </div>

              {/* Subtle Gold Divider */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D8BE87] to-transparent mx-auto mb-6" />

              {/* Vietnamese Lunar Date & Auspicious Hours */}
              <div className="space-y-2 relative z-10 text-xs text-[#5A554E] bg-[#F8F4EC]/70 p-4 rounded-2xl border border-[#D8BE87]/30">
                <div className="flex items-center justify-center gap-2 text-[#63121D] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D8BE87]" />
                  <span>Ngày Hoàng Đạo (Kim Đường)</span>
                </div>
                <p className="font-medium text-[#222226]">
                  Tức ngày 12 tháng 11 năm Bính Ngọ (Âm Lịch)
                </p>
                <p className="text-[11px] text-[#8C8275] leading-relaxed">
                  Giờ lành đón dâu & khai tiệc: <strong>Tỵ (09h - 11h)</strong> • <strong>Thân (15h - 17h)</strong>
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="mt-8 pt-6 border-t border-[#D8BE87]/30">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block mb-3">
                  Đếm Ngược Tới Khoảnh Khắc Thiêng Liêng
                </span>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xs mx-auto">
                  <div className="p-2.5 rounded-xl bg-white border border-[#D8BE87]/40 shadow-xs text-center">
                    <span className="font-serif-title text-xl sm:text-2xl font-bold text-[#18181A] block">
                      {countdown.days}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#8C8275]">
                      Ngày
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#D8BE87]/40 shadow-xs text-center">
                    <span className="font-serif-title text-xl sm:text-2xl font-bold text-[#18181A] block">
                      {countdown.hours}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#8C8275]">
                      Giờ
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#D8BE87]/40 shadow-xs text-center">
                    <span className="font-serif-title text-xl sm:text-2xl font-bold text-[#18181A] block">
                      {countdown.minutes}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#8C8275]">
                      Phút
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#D8BE87]/40 shadow-xs text-center">
                    <span className="font-serif-title text-xl sm:text-2xl font-bold text-[#63121D] block">
                      {countdown.seconds}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#63121D]">
                      Giây
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Calendar & Download .ics */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#18181A] text-[#D8BE87] hover:bg-[#63121D] hover:text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
                >
                  <CalendarPlus className="w-4 h-4 text-[#D8BE87]" />
                  <span>Thêm Vào Google Calendar</span>
                </a>

                <button
                  onClick={handleDownloadICS}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#F8F4EC] text-[#5A554E] border border-[#D8BE87]/60 text-xs font-medium transition-all cursor-pointer shadow-xs"
                  title="Tải file lịch (.ics) cho iPhone & Outlook"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C8275]" />
                  <span>Tải file .ics</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
