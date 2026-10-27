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
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Share2,
  ExternalLink,
  ZoomIn,
} from 'lucide-react';
import { WeddingData, WeddingEvent, BankAccount, WishMessage } from '../../../../types';
import { submitRSVP } from '../../../../services/rsvpService';
import { getWishes, submitWish } from '../../../../services/wishesService';
import { useToast } from '../../../ui/Toast';
import { openQRZoom } from '../../common/QRZoomModal';

interface CinematicPosterEventProps {
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

export function CinematicPosterEvent({ data }: CinematicPosterEventProps) {
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(data.weddingDateTime || data.weddingDate || '2026-12-20')
  );

  // RSVP state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no'>('yes');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpEventId, setRsvpEventId] = useState(data.events[0]?.id || 'event-all');
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Wishes state
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [wishContent, setWishContent] = useState('');
  const [wishSubmitting, setWishSubmitting] = useState(false);

  // Bank copy states
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(data.weddingDateTime || data.weddingDate || '2026-12-20'));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDateTime, data.weddingDate]);

  useEffect(() => {
    let isMounted = true;
    const loadWishes = async () => {
      try {
        const items = await getWishes(data.id);
        if (isMounted && Array.isArray(items)) {
          setWishes(items);
        }
      } catch (err) {
        console.warn('Failed to load wishes in CinematicPosterEvent:', err);
      }
    };
    loadWishes();
    return () => {
      isMounted = false;
    };
  }, [data.id]);

  const handleCopyAccount = async (accountNumber: string, label: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedBank(accountNumber);
      showToast(`Đã sao chép số tài khoản: ${accountNumber}`, 'success');
      setTimeout(() => setCopiedBank(null), 3000);
    } catch {
      showToast(`Số tài khoản: ${accountNumber}`, 'info');
    }
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      showToast('Vui lòng nhập họ và tên của quý khách', 'error');
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
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#E6C687', '#FFFFFF', '#D4AF37'],
      });
      setRsvpSuccess(true);
      showToast('Xác nhận tham dự thành công! Chúng mình rất mong được đón tiếp bạn.', 'success');
    } catch {
      showToast('Có lỗi xảy ra, quý khách vui lòng thử lại', 'error');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !wishContent.trim()) {
      showToast('Vui lòng nhập tên và lời chúc của bạn', 'error');
      return;
    }
    setWishSubmitting(true);
    try {
      const newWish = await submitWish({
        weddingId: data.id,
        authorName: authorName.trim(),
        content: wishContent.trim(),
        relation: 'Khách quý',
      });
      setWishes((prev) => [newWish, ...prev]);
      setWishContent('');
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#E6C687', '#FAF6EE'],
      });
      showToast('Cảm ơn lời chúc ngọt ngào của bạn!', 'success');
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      setWishSubmitting(false);
    }
  };

  // Extract date components for the movie poster:
  // THE DAY
  // 20
  // 12
  // 2026
  // HUẾ
  let dayNum = '20';
  let monthNum = '12';
  let yearNum = '2026';
  const cityName = data.city ? data.city.replace(/Thành phố /i, '').toUpperCase() : 'HUẾ';

  if (data.events[0]?.date) {
    const parts = data.events[0].date.split('/');
    if (parts.length === 3) {
      dayNum = parts[0];
      monthNum = parts[1];
      yearNum = parts[2];
    }
  }

  const makeGoogleCalendarUrl = (ev: WeddingEvent) => {
    const title = encodeURIComponent(`${ev.title} - ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(ev.description || 'Lễ cưới thiêng liêng và tiệc mừng hạnh phúc.');
    const location = encodeURIComponent(`${ev.locationName}, ${ev.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <section id="wedding-event" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0D0B0B] text-[#FAF6EE] overflow-hidden">
      {/* Film Grain & Poster Frame Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '4px 4px',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E6C687]/40 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* ===================================================================
            CORE PROMPT REQUIREMENT:
            Hiển thị giống poster điện ảnh:
            THE DAY
            20
            12
            2026
            HUẾ
           =================================================================== */}
        <div className="relative border-4 border-[#E6C687]/40 rounded-3xl p-6 sm:p-12 md:p-16 bg-gradient-to-b from-[#181515] via-[#100D0D] to-[#080707] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Movie Poster Frame Accents */}
          <div className="absolute top-4 left-4 text-[10px] font-mono tracking-[0.3em] uppercase text-[#E6C687]/70">
            OFFICIAL POSTER • PREMIERE
          </div>
          <div className="absolute top-4 right-4 text-[10px] font-mono tracking-[0.3em] uppercase text-[#E6C687]/70">
            RATED: PURE LOVE
          </div>

          {/* Decorative Aperture Corner Marks */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E6C687]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E6C687]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E6C687]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E6C687]" />

          {/* Center Poster Typography */}
          <div className="text-center py-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif-title text-sm sm:text-base md:text-lg tracking-[0.5em] text-[#E6C687] uppercase font-light mb-4"
            >
              — THE DAY —
            </motion.p>

            {/* Giant Stacked Movie Poster Date: 20 / 12 / 2026 */}
            <div className="flex flex-col items-center justify-center my-4 select-none font-serif-title">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-7xl sm:text-9xl md:text-[11rem] font-extrabold tracking-tighter text-[#FAF6EE] leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
              >
                {dayNum}
              </motion.span>
              <div className="w-24 sm:w-36 h-1 bg-[#E6C687] my-3 sm:my-5 opacity-80" />
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl sm:text-8xl md:text-[9rem] font-light tracking-tighter text-[#E6C687] leading-[0.85]"
              >
                {monthNum}
              </motion.span>
              <div className="w-16 sm:w-24 h-0.5 bg-white/30 my-3 sm:my-4" />
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.2em] text-neutral-300 leading-none uppercase"
              >
                {yearNum}
              </motion.span>
            </div>

            {/* City Name: HUẾ */}
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 font-serif-title text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.35em] text-[#E6C687] uppercase drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
            >
              {cityName}
            </motion.h3>

            <p className="mt-4 text-xs sm:text-sm text-neutral-400 font-mono tracking-[0.25em] uppercase">
              VIETNAM &nbsp;•&nbsp; IN THE PRESENCE OF BELOVED FAMILIES & FRIENDS
            </p>
          </div>

          {/* Film Leader Countdown Clock */}
          <div className="mt-8 pt-8 border-t border-white/10 max-w-2xl mx-auto">
            <p className="text-center text-[10px] font-mono tracking-[0.3em] uppercase text-[#E6C687] mb-4">
              FILM LEADER COUNTDOWN • THỜI GIAN KHỞI CHIẾU
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              {[
                { label: 'NGÀY', value: countdown.days },
                { label: 'GIỜ', value: countdown.hours },
                { label: 'PHÚT', value: countdown.minutes },
                { label: 'GIÂY', value: countdown.seconds },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-black/80 border border-[#E6C687]/30 rounded-2xl py-3 px-2 flex flex-col items-center"
                >
                  <span className="font-serif-title text-2xl sm:text-4xl font-bold text-[#FAF6EE]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#E6C687] mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Movie Billing Block (Credits) */}
          <div className="mt-10 pt-6 border-t border-white/10 text-center max-w-4xl mx-auto">
            <p className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 leading-relaxed">
              AN ORIGINAL WEDDING PRODUCTION &nbsp;•&nbsp; STARRING <span className="text-[#E6C687]">{data.groom.fullName.toUpperCase()}</span> & <span className="text-[#E6C687]">{data.bride.fullName.toUpperCase()}</span>
              <br />
              DIRECTED BY DESTINY & TRUE LOVE &nbsp;•&nbsp; PRODUCED BY {data.groom.parents?.father || 'NHÀ TRAI'} & {data.bride.parents?.father || 'NHÀ GÁI'}
              <br />
              SOUNDTRACK BY TWO HEARTS IN HARMONY &nbsp;•&nbsp; CINEMATOGRAPHY BY CHERISHED MEMORIES &nbsp;•&nbsp; ALL GUESTS WELCOME
            </p>
          </div>
        </div>

        {/* ===================================================================
            EVENT VENUES & SCHEDULE (PREMIERE SCREENINGS)
           =================================================================== */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.events.map((ev, idx) => (
            <motion.div
              key={ev.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="group relative bg-[#151212] border border-[#E6C687]/30 rounded-3xl p-6 sm:p-8 hover:border-[#E6C687] transition-all duration-300 shadow-xl"
            >
              {/* Event Badge */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase text-[#E6C687]">
                  <Film className="w-3.5 h-3.5 text-[#E6C687]" />
                  SCREENING {idx + 1}
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {ev.type === 'ceremony' ? 'LỄ THÀNH HÔN' : 'TIỆC CƯỚI'}
                </span>
              </div>

              <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-white mb-3">
                {ev.title}
              </h4>

              <div className="space-y-2.5 text-xs sm:text-sm text-neutral-300 mb-6 font-light">
                <div className="flex items-center gap-2.5 text-[#E6C687]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{ev.time} &nbsp;•&nbsp; {ev.date}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0 text-[#E6C687] mt-0.5" />
                  <div>
                    <p className="font-medium text-white">{ev.locationName}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{ev.address}</p>
                  </div>
                </div>
                {ev.description && (
                  <p className="text-xs text-neutral-400 pt-2 italic border-t border-white/5">
                    "{ev.description}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                {ev.mapUrl && (
                  <a
                    href={ev.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#E6C687] hover:text-black text-xs font-semibold tracking-wider text-[#FAF6EE] transition-all cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Chỉ đường Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                )}
                <a
                  href={makeGoogleCalendarUrl(ev)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E6C687]/40 hover:border-[#E6C687] text-xs font-semibold tracking-wider text-[#E6C687] transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Lưu vào Lịch</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===================================================================
            INTERACTIVE RSVP: PREMIERE INVITATION PASS
           =================================================================== */}
        <div id="rsvp" className="mt-20 bg-gradient-to-r from-[#171313] via-[#120F0F] to-[#171313] border border-[#E6C687]/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6C687]/15 border border-[#E6C687]/30 text-[#E6C687] text-xs font-mono tracking-widest uppercase mb-3">
              <Sparkles className="w-3 h-3" />
              <span>PREMIERE RESERVATION</span>
            </div>
            <h3 className="font-serif-title text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
              Xác Nhận Tham Dự Lễ Cưới
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Sự hiện diện của quý khách là niềm vinh hạnh và mảnh ghép trọn vẹn nhất cho ngày vui của chúng mình.
            </p>

            {rsvpSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 rounded-2xl bg-[#1F1914] border border-[#E6C687] text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#E6C687] text-black flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif-title text-xl font-bold text-[#E6C687]">
                  Đã Lưu Thông Tin Đặt Chỗ!
                </h4>
                <p className="text-xs text-neutral-300 mt-1">
                  Cảm ơn {rsvpName}. Chúng mình rất mong chờ được đón tiếp bạn tại tiệc cưới!
                </p>
                <button
                  onClick={() => setRsvpSuccess(false)}
                  className="mt-4 text-xs font-mono text-[#E6C687] underline hover:text-white cursor-pointer"
                >
                  Gửi thêm xác nhận khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleRSVPSubmit} className="mt-8 space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-neutral-500 focus:border-[#E6C687] focus:outline-none text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                      Số Điện Thoại
                    </label>
                    <input
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="VD: 0905 123 456"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-neutral-500 focus:border-[#E6C687] focus:outline-none text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                      Bạn sẽ tham dự chứ?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('yes')}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          rsvpAttending === 'yes'
                            ? 'bg-[#E6C687] text-black border-[#E6C687]'
                            : 'bg-black/50 text-neutral-300 border-white/15'
                        }`}
                      >
                        Chắc chắn tham dự
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('no')}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          rsvpAttending === 'no'
                            ? 'bg-neutral-800 text-white border-neutral-600'
                            : 'bg-black/50 text-neutral-400 border-white/15'
                        }`}
                      >
                        Rất tiếc vắng mặt
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                      Số lượng người tham dự
                    </label>
                    <select
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[#E6C687] focus:outline-none text-xs sm:text-sm"
                    >
                      <option value={1}>1 người (Chỉ mình tôi)</option>
                      <option value={2}>2 người (Cùng người thương)</option>
                      <option value={3}>3 người</option>
                      <option value={4}>4 người (Gia đình)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                    Lời nhắn gửi cô dâu chú rể
                  </label>
                  <textarea
                    rows={2}
                    value={rsvpNotes}
                    onChange={(e) => setRsvpNotes(e.target.value)}
                    placeholder="Những lưu ý về ăn uống, chỗ ngồi hoặc lời nhắn yêu thương..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-neutral-500 focus:border-[#E6C687] focus:outline-none text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={rsvpSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#E6C687] hover:bg-[#F2D7A1] text-black font-serif-title font-bold text-sm tracking-widest uppercase transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  {rsvpSubmitting ? 'ĐANG GỬI XÁC NHẬN...' : 'GỬI XÁC NHẬN THAM DỰ ➔'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ===================================================================
            CINEMATIC WEDDING GIFT BOX (HỘP MỪNG CƯỚI / TICKET PASS)
           =================================================================== */}
        {((data.gift?.groomBank && data.gift.groomBank.accountNumber) ||
          (data.gift?.brideBank && data.gift.brideBank.accountNumber)) && (
          <div id="gifts" className="mt-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6C687]/15 border border-[#E6C687]/30 text-[#E6C687] text-xs font-mono tracking-widest uppercase mb-3">
                <QrCode className="w-3 h-3" />
                <span>PREMIERE GIFT TICKET</span>
              </div>
              <h3 className="font-serif-title text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
                Hộp Mừng Cưới & Chúc Phúc
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-light">
                Dành cho quý khách muốn gửi gắm món quà chúc phúc từ phương xa đến tân lang và tân nương.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                ...(data.gift?.groomBank?.accountNumber
                  ? [{ bank: data.gift.groomBank, roleLabel: 'CHÚ RỂ' }]
                  : []),
                ...(data.gift?.brideBank?.accountNumber
                  ? [{ bank: data.gift.brideBank, roleLabel: 'CÔ DÂU' }]
                  : []),
              ].map(({ bank: acc, roleLabel }, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-[#1A1616] to-[#0F0D0D] border-2 border-[#E6C687]/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#E6C687] text-black font-mono text-[10px] tracking-widest uppercase font-bold rounded-bl-xl">
                    {roleLabel}
                  </div>

                  <div>
                    <p className="font-serif-title text-lg font-bold text-white mb-1">
                      {acc.bankName}
                    </p>
                    <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      CHỦ TK: {acc.accountHolder}
                    </p>

                    <div className="mt-4 p-3 bg-black/70 rounded-xl border border-white/10 flex items-center justify-between">
                      <span className="font-mono text-base sm:text-lg tracking-wider text-[#E6C687] font-semibold">
                        {acc.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopyAccount(acc.accountNumber, acc.bankName)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E6C687] text-black hover:bg-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {copiedBank === acc.accountNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  {Boolean(acc.qrCodeUrl) && (
                    <div className="mt-6 flex flex-col items-center justify-center">
                      <div
                        onClick={() =>
                          openQRZoom({
                            qrUrl: acc.qrCodeUrl,
                            title: `Mừng Cưới ${acc.accountHolder}`,
                            bankName: acc.bankName,
                            accountNumber: acc.accountNumber,
                            accountHolder: acc.accountHolder,
                            note: acc.note || `Mung cuoi ${acc.accountHolder}`,
                          })
                        }
                        className="relative p-4 bg-white rounded-2xl cursor-pointer group hover:scale-105 transition-all active:scale-95 shadow-md hover:shadow-xl"
                        title="Chạm để phóng to mã QR"
                        data-qr-zoom="true"
                        data-qr-url={acc.qrCodeUrl}
                        data-qr-title={`Mừng Cưới ${acc.accountHolder}`}
                        data-qr-bank={acc.bankName}
                        data-qr-account={acc.accountNumber}
                        data-qr-holder={acc.accountHolder}
                      >
                        <img
                          src={acc.qrCodeUrl}
                          alt={`QR ${acc.bankName}`}
                          className="w-40 h-40 object-contain"
                          referrerPolicy="no-referrer"
                        />
                        {/* Hover zoom overlay */}
                        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow">
                            <ZoomIn className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
                            Chạm phóng to
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          openQRZoom({
                            qrUrl: acc.qrCodeUrl,
                            title: `Mừng Cưới ${acc.accountHolder}`,
                            bankName: acc.bankName,
                            accountNumber: acc.accountNumber,
                            accountHolder: acc.accountHolder,
                            note: acc.note || `Mung cuoi ${acc.accountHolder}`,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white font-mono mt-2 cursor-pointer"
                      >
                        <ZoomIn className="w-3 h-3" />
                        <span>QUÉT MÃ HOẶC CHẠM PHÓNG TO</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            AUDIENCE WISHES (SỔ LƯU BÚT / REVIEWS)
           =================================================================== */}
        <div id="wishes" className="mt-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6C687]/15 border border-[#E6C687]/30 text-[#E6C687] text-xs font-mono tracking-widest uppercase mb-3">
              <Heart className="w-3 h-3 text-[#E6C687]" />
              <span>AUDIENCE REVIEWS & WISHES</span>
            </div>
            <h3 className="font-serif-title text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
              Sổ Lưu Bút Khán Giả
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-light">
              Những dòng tin nhắn yêu thương, lời chúc trăm năm hạnh phúc từ những người bạn trân quý.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Form */}
            <form onSubmit={handleWishSubmit} className="bg-[#181414] border border-[#E6C687]/30 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                    Tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="VD: Bạn thời đại học..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-neutral-500 focus:border-[#E6C687] focus:outline-none text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                    Quan hệ với Dâu - Rể
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Bạn thân / Đồng nghiệp"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-neutral-500 focus:border-[#E6C687] focus:outline-none text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                  Lời chúc yêu thương *
                </label>
                <textarea
                  rows={3}
                  required
                  value={wishContent}
                  onChange={(e) => setWishContent(e.target.value)}
                  placeholder="Gửi lời chúc phúc ngọt ngào nhất tới Minh Anh & Ngọc Mai..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-neutral-500 focus:border-[#E6C687] focus:outline-none text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={wishSubmitting}
                className="w-full py-3 rounded-full bg-[#E6C687] hover:bg-[#F2D7A1] text-black font-semibold text-xs tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{wishSubmitting ? 'ĐANG GỬI...' : 'GỬI LỜI CHÚC LÊN MÀN ẢNH ➔'}</span>
              </button>
            </form>

            {/* List of Wishes */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {Array.isArray(wishes) && wishes.filter((w) => w.isApproved !== false).length > 0 ? (
                wishes.filter((w) => w.isApproved !== false).map((w, idx) => (
                  <div
                    key={w.id || idx}
                    className="p-5 rounded-2xl bg-[#120F0F] border border-white/10 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-serif-title font-bold text-[#E6C687]">
                        {w.authorName || (w as any).name || 'Khách quý'}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500">
                        {w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
                      "{w.content}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-neutral-500 py-6">
                  Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc tới cặp đôi!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
