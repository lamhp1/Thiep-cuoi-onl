import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Film,
  Send,
  Heart,
  Check,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { WeddingData, WeddingEvent } from '../../../../types';
import { submitRSVP } from '../../../../services/rsvpService';
import { useToast } from '../../../ui/Toast';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperFrameCorner,
  TraditionalDivider,
} from '../../vietnamese-traditional/TraditionalOrnaments';

interface VietnameseCinematicMoviePosterProps {
  data: WeddingData;
}

function calculateCountdown(targetDateStr: string) {
  if (!targetDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  let target: Date;
  if (targetDateStr.includes('T')) {
    target = new Date(targetDateStr);
  } else if (targetDateStr.includes('/')) {
    const parts = targetDateStr.split('/');
    if (parts.length === 3) {
      target = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]), 10, 0, 0);
    } else {
      target = new Date(targetDateStr);
    }
  } else {
    target = new Date(targetDateStr);
  }

  const now = new Date().getTime();
  const diff = target.getTime() - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isPast: false,
  };
}

export function VietnameseCinematicMoviePoster({ data }: VietnameseCinematicMoviePosterProps) {
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(data.weddingDateTime || data.weddingDate || '2026-12-20')
  );

  // RSVP Form States
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no'>('yes');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpEventId, setRsvpEventId] = useState(data.events[0]?.id || 'event-all');
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(data.weddingDateTime || data.weddingDate || '2026-12-20'));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDateTime, data.weddingDate]);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      showToast('Vui lòng nhập họ tên của bạn', 'error');
      return;
    }

    setRsvpSubmitting(true);
    try {
      await submitRSVP({
        weddingId: data.id,
        fullName: rsvpName.trim(),
        phone: rsvpPhone.trim(),
        attending: rsvpAttending === 'yes',
        guestsCount: rsvpGuests,
        guestOf: 'both',
        message: rsvpNotes.trim(),
      });

      setRsvpSuccess(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#BA1E28', '#FAF6EE'],
      });
      showToast('Đã ghi danh hỷ sự thành công! Trân trọng cảm ơn quý khách.', 'success');
    } catch {
      showToast('Có lỗi xảy ra khi ghi danh, vui lòng thử lại sau', 'error');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const groomFullName = data.groom?.fullName || data.groomName || 'Nguyễn Minh Anh';
  const brideFullName = data.bride?.fullName || data.brideName || 'Trần Ngọc Mai';
  const groomFather = data.groom?.parents?.father || 'Nguyễn Văn Thành';
  const groomMother = data.groom?.parents?.mother || 'Lê Thị Hương';
  const brideFather = data.bride?.parents?.father || 'Trần Quốc Dũng';
  const brideMother = data.bride?.parents?.mother || 'Hoàng Kim Oanh';

  return (
    <section id="movie-poster" className="relative min-h-screen w-full bg-[#0D0204] text-[#FAF6EE] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0405] via-[#1A0307] to-[#0A0405] opacity-95" />

      <div className="relative z-20 max-w-5xl mx-auto">
        {/* Section Heading Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#3D0A11]/80 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-serif uppercase tracking-[0.3em] mb-4">
            <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>POSTER ĐIỆN ẢNH ĐẠI HỶ</span>
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#FFF8EB] drop-shadow-md">
            Chiếu Thư Hoàng Triều & Lịch Trình Đại Lễ
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-[#E2D5BE] mt-2">
            Kính mời quý quan khách tề tựu chung vui vào giờ lành hoàng đạo
          </p>
        </div>

        {/* ===================================================================
            1. THE GRAND IMPERIAL MOVIE POSTER CARD
           =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_0_60px_rgba(212,175,55,0.15)] bg-gradient-to-b from-[#1C0509] to-[#0D0204] p-6 sm:p-10 md:p-14 mb-16"
        >
          {/* Paper Frame Corners */}
          <div className="absolute top-4 left-4 text-[#D4AF37]/70 pointer-events-none">
            <PaperFrameCorner position="top-left" className="w-10 h-10" />
          </div>
          <div className="absolute top-4 right-4 text-[#D4AF37]/70 pointer-events-none">
            <PaperFrameCorner position="top-right" className="w-10 h-10" />
          </div>
          <div className="absolute bottom-4 left-4 text-[#D4AF37]/70 pointer-events-none">
            <PaperFrameCorner position="bottom-left" className="w-10 h-10" />
          </div>
          <div className="absolute bottom-4 right-4 text-[#D4AF37]/70 pointer-events-none">
            <PaperFrameCorner position="bottom-right" className="w-10 h-10" />
          </div>

          <div className="text-center space-y-6">
            {/* Top Film Studio Tagline */}
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-serif tracking-[0.3em] uppercase text-[#D4AF37]">
              <span>THÔNG GIA HAI HỌ ĐỒNG TỔ CHỨC</span>
              <span>•</span>
              <span>ĐẠI LỄ THÀNH HÔN</span>
            </div>

            {/* Poster Main Title */}
            <div className="space-y-2">
              <div className="inline-block px-4 py-1 rounded-full bg-[#BA1E28]/50 border border-[#D4AF37]/40 text-[#F5E6A3] text-xs font-serif tracking-widest uppercase mb-1">
                SIÊU PHẨM HỶ SỰ NĂM 2026
              </div>
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 my-3">
                <h3 className="font-serif-title text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFF8EB] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                  {groomFullName}
                </h3>
                <div className="flex items-center justify-center gap-3 my-1">
                  <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/70" />
                  <div className="w-8 h-8 rounded-full bg-[#BA1E28]/70 border border-[#D4AF37] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                    <Heart className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                  </div>
                  <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/70" />
                </div>
                <h3 className="font-serif-title text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFF8EB] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                  {brideFullName}
                </h3>
              </div>
              <p className="font-serif italic text-sm sm:text-base text-[#F3E5AB]">
                "Duyên trời tác hợp trăm năm thắm • Tình thắm se duyên vạn kiếp nồng"
              </p>
            </div>

            {/* Production Cast & Credits (Danh Phận Hai Họ) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#D4AF37]/30 max-w-3xl mx-auto text-left">
              {/* Nhà Trai */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/20 space-y-1">
                <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#D4AF37] block">
                  HÔN GIA NHÀ TRAI (TÂN LANG)
                </span>
                <p className="font-serif text-sm sm:text-base font-bold text-white">
                  Thân phụ: {groomFather}
                </p>
                <p className="font-serif text-sm sm:text-base font-bold text-white">
                  Thân mẫu: {groomMother}
                </p>
                <p className="text-xs text-[#E2D5BE]/80 pt-1">
                  Địa chỉ: TP. Huế, Thừa Thiên Huế
                </p>
              </div>

              {/* Nhà Gái */}
              <div className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/20 space-y-1">
                <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#D4AF37] block">
                  HÔN GIA NHÀ GÁI (TÂN NƯƠNG)
                </span>
                <p className="font-serif text-sm sm:text-base font-bold text-white">
                  Thân phụ: {brideFather}
                </p>
                <p className="font-serif text-sm sm:text-base font-bold text-white">
                  Thân mẫu: {brideMother}
                </p>
                <p className="text-xs text-[#E2D5BE]/80 pt-1">
                  Địa chỉ: TP. Huế, Thừa Thiên Huế
                </p>
              </div>
            </div>

            {/* NHẬT QUỸ HOÀNG ĐẠO (SUNDIAL COUNTDOWN CLOCK) */}
            <div className="pt-6 border-t border-[#D4AF37]/30">
              <div className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-[0.25em] text-[#D4AF37] mb-4">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>ĐẾM NGƯỢC ĐẾN GIỜ LÀNH HOÀNG ĐẠO</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                <div className="p-3 sm:p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/40 shadow-inner text-center">
                  <span className="font-serif-title text-2xl sm:text-4xl font-bold text-[#FFF8EB] block">
                    {countdown.days}
                  </span>
                  <span className="text-[10px] sm:text-xs font-serif uppercase tracking-widest text-[#D4AF37]">
                    Ngày
                  </span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/40 shadow-inner text-center">
                  <span className="font-serif-title text-2xl sm:text-4xl font-bold text-[#FFF8EB] block">
                    {countdown.hours}
                  </span>
                  <span className="text-[10px] sm:text-xs font-serif uppercase tracking-widest text-[#D4AF37]">
                    Giờ
                  </span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/40 shadow-inner text-center">
                  <span className="font-serif-title text-2xl sm:text-4xl font-bold text-[#FFF8EB] block">
                    {countdown.minutes}
                  </span>
                  <span className="text-[10px] sm:text-xs font-serif uppercase tracking-widest text-[#D4AF37]">
                    Phút
                  </span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-black/50 border border-[#D4AF37]/40 shadow-inner text-center">
                  <span className="font-serif-title text-2xl sm:text-4xl font-bold text-[#FFF8EB] block">
                    {countdown.seconds}
                  </span>
                  <span className="text-[10px] sm:text-xs font-serif uppercase tracking-widest text-[#D4AF37]">
                    Giây
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================
            2. IMPERIAL EVENTS TIMETABLE (CHIẾU THƯ SỰ KIỆN)
           =================================================================== */}
        <div className="space-y-6 mb-16">
          <div className="text-center">
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFF8EB]">
              Chương Trình Đại Lễ & Yến Tiệc
            </h3>
            <p className="text-xs sm:text-sm text-[#D4AF37] font-serif uppercase tracking-wider mt-1">
              Rất vinh hạnh được đón tiếp quý quan khách
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.events.map((evt) => (
              <div
                key={evt.id}
                className="relative rounded-2xl p-6 sm:p-8 bg-[#1A0307]/80 border border-[#D4AF37]/40 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#BA1E28]/60 text-[#F5E6A3] text-xs font-serif uppercase tracking-wider font-bold">
                      {evt.type === 'ceremony' ? 'Nghi Lễ Thành Hôn' : 'Yến Tiệc Rượu Mừng'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-serif font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-[#FFF8EB]">
                    {evt.title}
                  </h4>

                  <div className="space-y-1.5 text-xs sm:text-sm text-[#E2D5BE]">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{evt.date} (Nhằm ngày hoàng đạo)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white block">{evt.locationName}</strong>
                        {evt.address}
                      </span>
                    </div>
                  </div>

                  {evt.description && (
                    <p className="text-xs italic text-[#F3E5AB]/80 font-serif pt-1 border-t border-white/10">
                      {evt.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  {evt.mapUrl && (
                    <a
                      href={evt.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#FFF8EB] text-xs font-serif tracking-wider uppercase transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Chỉ Đường</span>
                    </a>
                  )}
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      `${evt.title} - ${groomFullName} & ${brideFullName}`
                    )}&dates=20261220T030000Z/20261220T060000Z&details=${encodeURIComponent(
                      evt.description || 'Đại lễ thành hôn'
                    )}&location=${encodeURIComponent(evt.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF6EE] text-xs font-serif tracking-wider uppercase transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Lưu Vào Lịch</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            3. RSVP HOÀNG TRIỀU (XÁC NHẬN THAM DỰ ĐẠI LỄ)
           =================================================================== */}
        <div className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#24060C] to-[#120205] border-2 border-[#D4AF37]/50 shadow-2xl relative">
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#BA1E28] border border-[#D4AF37] text-[#F3E5AB] mx-auto shadow-md">
              <SongHyGlyph className="w-6 h-6 text-[#F3E5AB]" />
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFF8EB]">
              Điểm Chỉ Tham Dự (RSVP)
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-[#E2D5BE]">
              Sự hiện diện của quý khách là niềm vinh hạnh to lớn cho hai họ chúng tôi
            </p>
          </div>

          {rsvpSuccess ? (
            <div className="p-6 rounded-2xl bg-[#3D0A11] border border-[#D4AF37] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif-title text-xl font-bold text-[#FFF8EB]">
                Ghi Danh Thành Công!
              </h4>
              <p className="text-xs text-[#F3E5AB] leading-relaxed">
                Xin chân thành cảm ơn {rsvpName} đã gửi phản hồi. Chúng tôi rất mong được nghênh đón quý khách tại đại tiệc!
              </p>
              <button
                onClick={() => setRsvpSuccess(false)}
                className="text-xs text-[#D4AF37] underline hover:text-white cursor-pointer"
              >
                Gửi phản hồi khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleRSVPSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#D4AF37] mb-1">
                  Họ và tên quý khách *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-[#D4AF37] mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={rsvpPhone}
                    onChange={(e) => setRsvpPhone(e.target.value)}
                    placeholder="0905 xxx xxx"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-[#D4AF37] mb-1">
                    Số lượng người tham dự
                  </label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#D4AF37] text-sm"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num} className="bg-neutral-900 text-white">
                        {num} người
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#D4AF37] mb-1">
                  Bạn sẽ tham dự chứ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending('yes')}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                      rsvpAttending === 'yes'
                        ? 'bg-[#BA1E28] border-[#FFD700] text-white shadow-md'
                        : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Chắc chắn tham dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending('no')}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                      rsvpAttending === 'no'
                        ? 'bg-neutral-800 border-neutral-600 text-white'
                        : 'bg-black/30 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Tiếc quá, tôi bận
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#D4AF37] mb-1">
                  Lời nhắn gửi đến đôi uyên ương
                </label>
                <textarea
                  rows={2}
                  value={rsvpNotes}
                  onChange={(e) => setRsvpNotes(e.target.value)}
                  placeholder="Chúc hai bạn trăm năm hạnh phúc, bách niên giai lão..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={rsvpSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8C101A] via-[#BA1E28] to-[#8C101A] border border-[#D4AF37] text-white font-serif font-bold tracking-[0.2em] uppercase text-xs sm:text-sm shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {rsvpSubmitting ? (
                  <span>Đang gửi phản hồi...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#D4AF37]" />
                    <span>Xác Nhận Điểm Chỉ Tham Dự</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
