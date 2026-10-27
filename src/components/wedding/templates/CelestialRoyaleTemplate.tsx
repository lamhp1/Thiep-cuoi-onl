import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Copy,
  Check,
  QrCode,
  X,
  ExternalLink,
  CalendarPlus,
  Send,
  MessageCircle,
  Menu,
  Phone,
  Facebook,
  Instagram,
  Sparkles,
  Maximize2,
  Moon,
  Sun,
  Compass,
  Star,
  Flame,
} from 'lucide-react';
import { WeddingData, BankAccount, WishMessage, GalleryPhoto } from '../../../types';
import {
  calculateCountdown,
  formatVietnameseDate,
  copyToClipboard,
  createGoogleCalendarUrl,
} from '../../../lib/utils';
import { submitRSVP } from '../../../services/rsvpService';
import { getWishes, submitWish, toggleWishLike } from '../../../services/wishesService';
import { LightboxModal } from '../../ui/LightboxModal';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { CoupleNamesStacked } from '../common/CoupleNamesStacked';
import { useToast } from '../../ui/Toast';
import { weddingAudio } from '../../../lib/audioSynth';
import { CelestialStarfield } from './celestial/CelestialStarfield';
import { CelestialConstellationRing, FloatingSparkleStars } from './celestial/CelestialOrnaments';
import { getGuestInfoFromUrl } from '../../../lib/guestPersonalization';
import { PersonalizedWaxSealBadge } from '../common/PersonalizedWaxSealBadge';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import { SmartEventActions } from '../common/SmartEventActions';

interface CelestialRoyaleTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function CelestialRoyaleTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: CelestialRoyaleTemplateProps) {
  const { showToast } = useToast();
  const [isCurtainOpened, setIsCurtainOpened] = useState(!showEnvelopeImmediately);
  const [meteorTrigger, setMeteorTrigger] = useState(0);

  const handleTriggerMeteors = () => {
    setMeteorTrigger((prev) => prev + 1);
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FFE5A3', '#E5C378', '#7CE0FF', '#FFFFFF', '#D8B4FE'],
    });
    showToast('✦ Bầu trời sao rực sáng cùng vệt sao băng chúc phúc!', 'success');
  };

  useEffect(() => {
    setIsCurtainOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(data.weddingDateTime || data.weddingDate)
  );

  // Bank Gift State
  const [activeBankTab, setActiveBankTab] = useState<'groom' | 'bride'>('groom');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [expandedQr, setExpandedQr] = useState<BankAccount | null>(null);

  // Guest Personalization
  const guestInfo = React.useMemo(() => getGuestInfoFromUrl(), []);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState(() => guestInfo.rsvpPrefill || '');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<boolean>(true);
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState<number>(1);
  const [rsvpGuestOf, setRsvpGuestOf] = useState<'groom' | 'bride' | 'both'>('both');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [isSubmittingRSVP, setIsSubmittingRSVP] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    if (guestInfo.rsvpPrefill) {
      setRsvpName((prev) => prev || guestInfo.rsvpPrefill);
    }
  }, [guestInfo.rsvpPrefill]);

  // Wishes State
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [wishAuthor, setWishAuthor] = useState('');
  const [wishRelation, setWishRelation] = useState('Bạn bè');
  const [wishContent, setWishContent] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);

  // Gallery State
  const [galleryTab, setGalleryTab] = useState<'all' | 'prewedding' | 'ceremony' | 'moments'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(data.weddingDateTime || data.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDateTime, data.weddingDate]);

  // Load wishes
  useEffect(() => {
    async function loadData() {
      if (data.id) {
        const list = await getWishes(data.id);
        setWishes(list);
      }
    }
    loadData();
  }, [data.id]);

  const handleCopyAccount = async (num: string) => {
    const ok = await copyToClipboard(num);
    if (ok) {
      setCopiedAccount(num);
      showToast('Đã sao chép số tài khoản!', 'success');
      setTimeout(() => setCopiedAccount(null), 3000);
    }
  };

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPhone.trim()) {
      showToast('Vui lòng điền họ tên và số điện thoại', 'error');
      return;
    }
    setIsSubmittingRSVP(true);
    try {
      const res = await submitRSVP({
        weddingId: data.id,
        fullName: rsvpName.trim(),
        phone: rsvpPhone.trim(),
        attending: rsvpAttending,
        guestsCount: rsvpGuestsCount,
        guestOf: rsvpGuestOf,
        message: rsvpMessage.trim(),
      });
      if (res && res.id) {
        setRsvpSubmitted(true);
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E5C378', '#F8F9FA', '#64B5F6', '#1C2541'],
        });
        showToast('Cảm ơn bạn đã phản hồi xác nhận tham dự!', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      setIsSubmittingRSVP(false);
    }
  };

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishAuthor.trim() || !wishContent.trim()) {
      showToast('Vui lòng nhập tên và lời chúc của bạn', 'error');
      return;
    }
    setIsSubmittingWish(true);
    try {
      const newWish = await submitWish({
        weddingId: data.id,
        authorName: wishAuthor.trim(),
        content: wishContent.trim(),
        relation: wishRelation,
      });
      if (newWish && newWish.id) {
        setWishes((prev) => [newWish, ...prev]);
        setWishAuthor('');
        setWishContent('');
        showToast('Đã gửi lời chúc mừng thành công!', 'success');
      }
    } catch {
      showToast('Không thể gửi lời chúc, vui lòng thử lại', 'error');
    } finally {
      setIsSubmittingWish(false);
    }
  };

  const handleToggleLike = async (wishId: string) => {
    if (!data.id) return;
    const newLikes = await toggleWishLike(data.id, wishId);
    setWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, likesCount: newLikes } : w))
    );
  };

  const filteredGallery = data.gallery.filter((item) => {
    if (galleryTab === 'all') return true;
    return item.category === galleryTab;
  });

  return (
    <div className="min-h-screen bg-[#050814] text-[#FAF6EE] font-body selection:bg-[#E5C378]/30 selection:text-[#E5C378] relative overflow-x-hidden">
      {/* 0. Fullscreen Living Cosmos Starfield & Nebula Universe */}
      <CelestialStarfield
        enableShootingStars={true}
        enableConstellations={true}
        interactive={true}
        meteorTrigger={meteorTrigger}
      />

      {/* Floating Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* Floating Meteor Shower Summon Action */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleTriggerMeteors}
        className="fixed bottom-6 left-6 z-40 px-3.5 py-2.5 rounded-full bg-[#0B132B]/90 border border-[#E5C378]/50 text-[#E5C378] text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(229,195,120,0.3)] hover:shadow-[0_0_35px_rgba(229,195,120,0.6)] backdrop-blur-md cursor-pointer group"
        title="Thắp sáng bầu trời sao và gọi sao băng"
      >
        <Sparkles className="w-4 h-4 text-[#E5C378] group-hover:rotate-12 transition-transform animate-pulse" />
        <span className="hidden sm:inline font-medium">Sao Băng & Vũ Trụ</span>
      </motion.button>

      {/* 1. Celestial Stardust Opening Envelope */}
      <AnimatePresence>
        {!isCurtainOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#03050B] p-4 text-center overflow-hidden"
          >
            {/* Living starfield backdrop for opening envelope */}
            <CelestialStarfield
              enableShootingStars={true}
              enableConstellations={true}
              densityMultiplier={1.3}
              interactive={true}
            />
            <CelestialConstellationRing size={640} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-35" />

            {/* Glowing Celestial Constellation Card */}
            <div className="relative max-w-md w-full bg-[#0B1226]/90 border border-[#E5C378]/40 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(229,195,120,0.2)] backdrop-blur-xl space-y-6">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#E5C378]/20 to-[#64B5F6]/20 border border-[#E5C378]/50 mx-auto flex items-center justify-center text-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.3)] animate-pulse">
                <Star className="w-7 h-7 fill-[#E5C378]" />
              </div>

              <div className="space-y-2 w-full max-w-sm mx-auto px-2">
                <span className="text-[10px] font-mono tracking-[0.35em] text-[#E5C378] uppercase block">
                  CELESTIAL ROYALE INVITATION
                </span>
                <CoupleNamesStacked
                  groomName={data.groomName}
                  brideName={data.brideName}
                  variant="envelope"
                  textColor="#FFFFFF"
                  heartColor="#E5C378"
                  idPrefix="celestial-envelope"
                />
                <p className="text-xs text-[#90CAF9] font-mono tracking-wider">
                  DẠ TIỆC ÁNH SAO • {formatVietnameseDate(data.events[0]?.date || data.weddingDate)}
                </p>
              </div>

              {/* Gold Inscribed Guest Badge */}
              <PersonalizedWaxSealBadge theme="celestial" className="my-1.5" />

              <p className="text-xs text-neutral-300 italic font-serif-title max-w-xs mx-auto leading-relaxed">
                "{data.romanticQuote || 'Giữa muôn vạn vì tinh tú của vũ trụ bao la, chúng tôi đã tìm thấy ánh sáng của đời mình.'}"
              </p>

              <button
                onClick={() => {
                  weddingAudio.play(data.musicUrl);
                  setIsCurtainOpened(true);
                  confetti({
                    particleCount: 70,
                    spread: 80,
                    origin: { y: 0.7 },
                    colors: ['#E5C378', '#64B5F6', '#FFFFFF', '#0B1226'],
                  });
                }}
                className="w-full py-3.5 rounded-full bg-linear-to-r from-[#C29D2C] via-[#E5C378] to-[#C29D2C] text-[#050814] text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(229,195,120,0.4)] hover:shadow-[0_0_35px_rgba(229,195,120,0.6)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Mở Thiệp Dạ Tiệc Ánh Sao
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Starlight Constellation Top Nav */}
      <header className="sticky top-0 z-40 bg-[#050814]/85 backdrop-blur-md border-b border-[#E5C378]/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Star className="w-4 h-4 text-[#E5C378] fill-[#E5C378]/30" />
          <span className="font-serif-title text-base sm:text-lg tracking-wider text-white">
            {data.groomName} & {data.brideName}
          </span>
        </div>

        <nav className="flex items-center gap-3 sm:gap-6 text-xs font-mono uppercase tracking-wider text-neutral-400">
          <a href="#celestial-couple" className="hover:text-[#E5C378] transition-colors hidden md:inline">Đôi Uyên Ương</a>
          <a href="#celestial-programme" className="hover:text-[#E5C378] transition-colors hidden sm:inline">Dạ Tiệc</a>
          <a href="#celestial-memories" className="hover:text-[#E5C378] transition-colors hidden sm:inline">Ánh Sao Kỷ Niệm</a>
          <a href="#celestial-rsvp" className="text-[#E5C378] font-bold hover:underline">Xác Nhận</a>
          <button
            onClick={handleTriggerMeteors}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/40 text-[#E5C378] hover:bg-[#E5C378] hover:text-[#050814] transition-all text-[11px] font-mono uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(229,195,120,0.2)]"
            title="Thắp sáng sao băng trên bầu trời"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Sao Băng</span>
          </button>
          {isOwnerMode && onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-2.5 py-1 rounded-full bg-[#E5C378]/20 text-[#E5C378] hover:bg-[#E5C378]/30 transition-colors"
            >
              Admin
            </button>
          )}
        </nav>
      </header>

      {/* VIP Personalized Guest Greeting Banner */}
      <PersonalizedWelcomeBanner
        groomName={data.groomName}
        brideName={data.brideName}
        weddingDate={data.weddingDate}
        accentColor="#E5C378"
      />

      {/* 2. Celestial Gala Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center text-center p-6 sm:p-12 overflow-hidden">
        {/* Floating Sparkle Stars in 3D Space */}
        <FloatingSparkleStars />

        {/* Deep starry space gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${data.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/40 via-[#050814]/70 to-[#050814]/90" />

        {/* Orbiting Stardust Astrolabe Rings */}
        <CelestialConstellationRing size={780} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70" />
        <div className="absolute w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full border border-[#E5C378]/15 animate-spin [animation-duration:120s] pointer-events-none" />
        <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full border border-[#64B5F6]/15 animate-spin [animation-duration:80s] [animation-direction:reverse] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1630] border border-[#E5C378]/40 text-[#E5C378] text-xs font-mono tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(229,195,120,0.25)]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>THE CELESTIAL ROYALE UNION</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <p className="font-serif-title italic text-lg sm:text-2xl text-[#90CAF9] tracking-widest">
              Lễ Thành Hôn & Dạ Tiệc Ánh Sao
            </p>
            <div className="w-full max-w-3xl mx-auto px-2">
              <CoupleNamesStacked
                groomName={data.groomName}
                brideName={data.brideName}
                variant="hero-xl"
                textColor="#FFFFFF"
                heartColor="#E5C378"
                idPrefix="celestial-hero"
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif-title italic text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed"
          >
            "{data.romanticQuote || 'Như hai vì tinh tú tìm thấy quỹ đạo của nhau giữa bầu trời ngàn sao rực rỡ.'}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xs font-mono uppercase tracking-[0.2em] text-[#E5C378] pt-2"
          >
            {data.city} • {formatVietnameseDate(data.events[0]?.date || data.weddingDate)}
          </motion.div>

          {/* Astronomical Countdown Dial */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pt-6"
          >
            <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
              {[
                { label: 'NGÀY', val: countdown.days },
                { label: 'GIỜ', val: countdown.hours },
                { label: 'PHÚT', val: countdown.minutes },
                { label: 'GIÂY', val: countdown.seconds },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="bg-[#0B132B]/80 border border-[#E5C378]/30 rounded-2xl p-4 sm:p-5 text-center shadow-[0_0_20px_rgba(229,195,120,0.12)] group hover:border-[#E5C378] hover:shadow-[0_0_25px_rgba(229,195,120,0.25)] transition-all backdrop-blur-md"
                >
                  <span className="font-serif-title text-3xl sm:text-4xl font-bold text-white block">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#E5C378] block mt-1">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Two Stars (Couple Presentation) */}
      <section id="celestial-couple" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3 mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E5C378]">
            THE CONSTELLATION OF TWO SOULS
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl font-medium text-white">
            Đôi Uyên Ương Định Mệnh
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#E5C378] to-transparent mx-auto"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10 items-stretch">
          {/* Groom: Solar Halo */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="bg-[#0A1128]/90 border border-[#E5C378]/30 rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-6 shadow-[0_0_35px_rgba(229,195,120,0.12)] hover:border-[#E5C378] hover:shadow-[0_0_40px_rgba(229,195,120,0.25)] transition-all group backdrop-blur-sm flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs gap-1">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/40 text-[#E5C378] font-mono uppercase tracking-wider text-[8.5px] sm:text-[10px] whitespace-nowrap">
                <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>ÁNH DƯƠNG • CHÚ RỂ</span>
              </div>
              <span className="font-mono text-neutral-400 text-[9px] sm:text-[11px]">{data.groom.role.toUpperCase()}</span>
            </div>

            <div className="relative aspect-[4/5] w-24 sm:w-36 md:w-auto rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5C378]/30 group-hover:border-[#E5C378]/60 transition-colors mx-auto">
              <img
                src={data.groom.avatar}
                alt={data.groom.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent opacity-70" />
            </div>

            <div className="space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between text-center sm:text-left">
              <div>
                <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-medium text-white leading-tight">
                  {data.groom.fullName}
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-300 leading-relaxed mt-1 line-clamp-3 sm:line-clamp-none">
                  {data.groom.bio || 'Ngọn đèn ấm áp và vững chãi, luôn che chở và cùng người bạn đời kiến tạo tương lai rực rỡ.'}
                </p>
              </div>

              {data.groom.parents && (
                <div className="pt-2 sm:pt-4 border-t border-white/10 text-[9.5px] sm:text-xs text-neutral-400 space-y-0.5 sm:space-y-1 font-mono">
                  <span className="text-[#E5C378] text-[8.5px] sm:text-[10px] uppercase block">GIA ĐÌNH NHÀ TRAI</span>
                  <p className="break-words leading-snug">Thân phụ: {data.groom.parents.father}</p>
                  <p className="break-words leading-snug">Thân mẫu: {data.groom.parents.mother}</p>
                </div>
              )}

              {data.groom.socials && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-3 pt-1 sm:pt-2 flex-wrap">
                  {data.groom.socials.phone && (
                    <a
                      href={`tel:${data.groom.socials.phone}`}
                      className="p-1.5 sm:p-2.5 rounded-full bg-[#1C2541] hover:bg-[#E5C378] hover:text-[#050814] transition-colors"
                      title="Gọi điện"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {data.groom.socials.facebook && (
                    <a
                      href={data.groom.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2.5 rounded-full bg-[#1C2541] hover:bg-[#E5C378] hover:text-[#050814] transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {data.groom.socials.instagram && (
                    <a
                      href={data.groom.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2.5 rounded-full bg-[#1C2541] hover:bg-[#E5C378] hover:text-[#050814] transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Bride: Lunar Aura */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="bg-[#0A1128]/90 border border-[#64B5F6]/30 rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-6 shadow-[0_0_35px_rgba(100,181,246,0.12)] hover:border-[#64B5F6] hover:shadow-[0_0_40px_rgba(100,181,246,0.25)] transition-all group backdrop-blur-sm flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs gap-1">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#64B5F6]/15 border border-[#64B5F6]/40 text-[#90CAF9] font-mono uppercase tracking-wider text-[8.5px] sm:text-[10px] whitespace-nowrap">
                <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>ÁNH TRĂNG • CÔ DÂU</span>
              </div>
              <span className="font-mono text-neutral-400 text-[9px] sm:text-[11px]">{data.bride.role.toUpperCase()}</span>
            </div>

            <div className="relative aspect-[4/5] w-24 sm:w-36 md:w-auto rounded-xl sm:rounded-2xl overflow-hidden border border-[#64B5F6]/30 group-hover:border-[#64B5F6]/60 transition-colors mx-auto">
              <img
                src={data.bride.avatar}
                alt={data.bride.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent opacity-70" />
            </div>

            <div className="space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between text-center sm:text-left">
              <div>
                <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-medium text-white leading-tight">
                  {data.bride.fullName}
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-300 leading-relaxed mt-1 line-clamp-3 sm:line-clamp-none">
                  {data.bride.bio || 'Vì sao dịu dàng và lung linh, người mang lại sự bình yên và vẻ đẹp thanh thuần cho từng ngày trôi qua.'}
                </p>
              </div>

              {data.bride.parents && (
                <div className="pt-2 sm:pt-4 border-t border-white/10 text-[9.5px] sm:text-xs text-neutral-400 space-y-0.5 sm:space-y-1 font-mono">
                  <span className="text-[#90CAF9] text-[8.5px] sm:text-[10px] uppercase block">GIA ĐÌNH NHÀ GÁI</span>
                  <p className="break-words leading-snug">Thân phụ: {data.bride.parents.father}</p>
                  <p className="break-words leading-snug">Thân mẫu: {data.bride.parents.mother}</p>
                </div>
              )}

              {data.bride.socials && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-3 pt-1 sm:pt-2 flex-wrap">
                  {data.bride.socials.phone && (
                    <a
                      href={`tel:${data.bride.socials.phone}`}
                      className="p-1.5 sm:p-2.5 rounded-full bg-[#1C2541] hover:bg-[#64B5F6] hover:text-[#050814] transition-colors"
                      title="Gọi điện"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {data.bride.socials.facebook && (
                    <a
                      href={data.bride.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2.5 rounded-full bg-[#1C2541] hover:bg-[#64B5F6] hover:text-[#050814] transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {data.bride.socials.instagram && (
                    <a
                      href={data.bride.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2.5 rounded-full bg-[#1C2541] hover:bg-[#64B5F6] hover:text-[#050814] transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Programme (Events) */}
      <section id="celestial-programme" className="py-24 px-6 sm:px-12 bg-[#080E21]/75 backdrop-blur-md border-y border-[#E5C378]/20">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E5C378]">
              GALA TIMELINE & VENUES
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-medium text-white">
              Thời Khắc Trọng Đại
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-[#E5C378] to-transparent mx-auto"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.events.map((evt, idx) => (
              <motion.div
                key={evt.id || idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="bg-[#0B1530]/90 border border-[#E5C378]/30 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden group hover:border-[#E5C378] hover:shadow-[0_0_30px_rgba(229,195,120,0.2)] transition-all"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C378] px-3 py-1 rounded-full bg-[#E5C378]/15 border border-[#E5C378]/30">
                    NGHI THỨC {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5 text-[#E5C378] font-mono font-bold text-xl">
                    <Clock className="w-4 h-4" />
                    <span>{evt.time}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif-title text-3xl font-medium text-white mb-1">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-[#90CAF9] font-mono">
                    Ngày {formatVietnameseDate(evt.date)}
                  </p>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#E5C378] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-medium">{evt.locationName}</strong>
                      <span className="text-neutral-400">{evt.address}</span>
                    </div>
                  </div>
                  {evt.description && (
                    <p className="text-[11px] text-neutral-400 italic pt-1">
                      "{evt.description}"
                    </p>
                  )}
                </div>

                {/* Smart Actions: Google Maps, Grab/Be Ride, Add to Calendar */}
                <SmartEventActions
                  event={{
                    title: evt.title,
                    date: evt.date,
                    time: evt.time,
                    locationName: evt.locationName,
                    address: evt.address,
                    description: evt.description,
                    mapUrl: evt.mapUrl,
                  }}
                  theme="celestial"
                  className="pt-2 border-t border-white/10"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Memories Galaxy (Gallery) */}
      <section id="celestial-memories" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E5C378]">
            THE GALAXY OF MEMORIES
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl font-medium text-white">
            Thiên Hà Kỷ Niệm
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#E5C378] to-transparent mx-auto"
          />
        </motion.div>

        {/* Filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2"
        >
          {[
            { id: 'all', label: 'Toàn Bộ Ảnh' },
            { id: 'prewedding', label: 'Pre-Wedding' },
            { id: 'ceremony', label: 'Hôn Lễ' },
            { id: 'moments', label: 'Ánh Sao Đêm' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setGalleryTab(cat.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                galleryTab === cat.id
                  ? 'bg-[#E5C378] text-[#050814] font-bold shadow-[0_0_15px_rgba(229,195,120,0.4)]'
                  : 'bg-[#0B1530] text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGallery.map((photo, index) => (
            <motion.div
              key={photo.id || index}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E5C378]/60 cursor-pointer bg-[#0A1128] transition-all shadow-xl"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Galaxy'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono text-[#E5C378] uppercase">
                  {photo.category || 'STARLIGHT'}
                </span>
                <p className="font-serif-title italic text-xs text-white truncate">
                  {photo.caption || `${data.groomName} & ${data.brideName}`}
                </p>
                <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-[#E5C378]">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Gift Registry / VietQR */}
      <section className="py-24 px-6 sm:px-12 bg-[#080E21]/75 backdrop-blur-md border-t border-[#E5C378]/20">
        <div className="max-w-3xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E5C378]">
              CONSTELLATION OF GIFTS
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-medium text-white">
              Gửi Trao Món Quà Chúc Phúc
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              {data.gift?.message || 'Sự hiện diện của quý khách là món quà quý giá nhất. Nếu quý khách muốn gửi lời chúc mừng từ xa:'}
            </p>
          </motion.div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setActiveBankTab('groom')}
              className={`px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeBankTab === 'groom'
                  ? 'bg-[#E5C378] text-[#050814] font-bold shadow-[0_0_15px_rgba(229,195,120,0.4)]'
                  : 'bg-[#0B1530] text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              Mừng Chú Rể ({data.groomName})
            </button>
            <button
              onClick={() => setActiveBankTab('bride')}
              className={`px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeBankTab === 'bride'
                  ? 'bg-[#E5C378] text-[#050814] font-bold shadow-[0_0_15px_rgba(229,195,120,0.4)]'
                  : 'bg-[#0B1530] text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              Mừng Cô Dâu ({data.brideName})
            </button>
          </div>

          {(() => {
            const currentBank =
              activeBankTab === 'groom' ? data.gift?.groomBank : data.gift?.brideBank;
            if (!currentBank || !currentBank.bankName) {
              return (
                <div className="p-8 text-center text-xs text-neutral-500 bg-[#0B1530] rounded-2xl border border-white/10">
                  Thông tin mừng cưới đang được cập nhật
                </div>
              );
            }
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-[#0B1530]/90 border border-[#E5C378]/40 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center gap-8 hover:border-[#E5C378] transition-colors"
              >
                {currentBank.qrCodeUrl && (
                  <div
                    onClick={() => setExpandedQr(currentBank)}
                    className="cursor-pointer group relative p-3 bg-white rounded-2xl shrink-0 shadow-lg"
                  >
                    <img
                      src={currentBank.qrCodeUrl}
                      alt="QR Code"
                      className="w-36 h-36 object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition-opacity">
                      Phóng to QR
                    </div>
                  </div>
                )}

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <span className="text-[10px] font-mono text-[#E5C378] uppercase tracking-widest block">
                    {currentBank.bankName}
                  </span>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="font-mono text-2xl font-bold text-white tracking-wider">
                      {currentBank.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopyAccount(currentBank.accountNumber)}
                      className="p-1.5 rounded-lg bg-[#1C2541] hover:bg-[#E5C378] hover:text-[#050814] transition-colors text-neutral-300 cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedAccount === currentBank.accountNumber ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-300 uppercase tracking-wider font-mono">
                    Chủ TK: {currentBank.accountHolder}
                  </p>
                  {currentBank.note && (
                    <p className="text-[11px] text-neutral-400 italic">
                      Ghi chú: {currentBank.note}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* 7. Celestial RSVP Form */}
      <section id="celestial-rsvp" className="py-24 px-6 sm:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0B1530]/95 border border-[#E5C378]/40 rounded-3xl p-8 sm:p-12 space-y-8 shadow-[0_0_50px_rgba(229,195,120,0.18)]"
        >
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E5C378]">
              ATTENDANCE CONFIRMATION
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-medium text-white">
              Xác Nhận Tham Dự Dạ Tiệc
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Sự hiện diện của quý khách là vinh hạnh lớn lao cho gia đình chúng tôi.
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="p-8 rounded-2xl bg-[#0F1C40] border border-emerald-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-2xl text-white">
                Đã Nhận Được Xác Nhận!
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Cảm ơn bạn đã phản hồi. Hẹn gặp bạn dưới bầu trời sao đêm hôn lễ!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitRSVP} className="space-y-6">
              {guestInfo.hasGuest && guestInfo.cleanName && (
                <div className="p-3.5 rounded-2xl bg-[#E5C378]/15 border border-[#E5C378]/40 text-xs text-[#FAF6EE] flex items-center gap-2.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#E5C378] shrink-0 animate-pulse" />
                  <span>
                    Xin chào <strong>{guestInfo.cleanName}</strong>! Tên của bạn đã được điền sẵn trên thiệp ánh sao.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="VD: Trần Hoàng Long"
                    className="w-full px-4 py-3 rounded-xl bg-[#050814] border border-white/10 focus:border-[#E5C378] text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={rsvpPhone}
                    onChange={(e) => setRsvpPhone(e.target.value)}
                    placeholder="VD: 0988 123 456"
                    className="w-full px-4 py-3 rounded-xl bg-[#050814] border border-white/10 focus:border-[#E5C378] text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Xác Nhận Tham Dự
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(true)}
                    className={`py-3 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      rsvpAttending
                        ? 'bg-[#E5C378] text-[#050814] font-bold shadow-md'
                        : 'bg-[#050814] text-neutral-400 border border-white/10'
                    }`}
                  >
                    Chắc chắn sẽ tham dự ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(false)}
                    className={`py-3 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      !rsvpAttending
                        ? 'bg-[#1C2541] text-white font-bold'
                        : 'bg-[#050814] text-neutral-400 border border-white/10'
                    }`}
                  >
                    Tiếc rằng không thể đến 💌
                  </button>
                </div>
              </div>

              {rsvpAttending && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Số Lượng Khách
                    </label>
                    <select
                      value={rsvpGuestsCount}
                      onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-[#050814] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E5C378]"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} Người
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Khách Mời Của
                    </label>
                    <select
                      value={rsvpGuestOf}
                      onChange={(e) => setRsvpGuestOf(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-[#050814] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E5C378]"
                    >
                      <option value="both">Cả hai bạn</option>
                      <option value="groom">Nhà Trai ({data.groomName})</option>
                      <option value="bride">Nhà Gái ({data.brideName})</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Lời Nhắn Đến Đôi Bạn
                </label>
                <textarea
                  rows={3}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Gửi lời nhắn hoặc dặn dò đặc biệt..."
                  className="w-full px-4 py-3 rounded-xl bg-[#050814] border border-white/10 focus:border-[#E5C378] text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRSVP}
                className="w-full py-4 rounded-full bg-linear-to-r from-[#C29D2C] via-[#E5C378] to-[#C29D2C] text-[#050814] text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(229,195,120,0.4)] hover:shadow-[0_0_40px_rgba(229,195,120,0.6)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRSVP ? 'Đang lưu phản hồi...' : 'Gửi Xác Nhận Tham Dự'}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* 8. Wishing Stars Guestbook */}
      <section className="py-24 px-6 sm:px-12 bg-[#080E21]/75 backdrop-blur-md border-t border-[#E5C378]/20">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E5C378]">
              WISHING STARS GUESTBOOK
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-medium text-white">
              Những Ngôi Sao Lời Chúc
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-[#E5C378] to-transparent mx-auto"
            />
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmitWish}
            className="bg-[#0B1530]/80 backdrop-blur-md border border-[#E5C378]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={wishAuthor}
                onChange={(e) => setWishAuthor(e.target.value)}
                placeholder="Tên của bạn *"
                className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E5C378]"
              />
              <select
                value={wishRelation}
                onChange={(e) => setWishRelation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E5C378]"
              >
                <option value="Bạn bè">Bạn bè</option>
                <option value="Đồng nghiệp">Đồng nghiệp</option>
                <option value="Họ hàng">Họ hàng</option>
                <option value="Người thân">Người thân</option>
                <option value="Khách quý">Khách quý</option>
              </select>
            </div>
            <textarea
              rows={3}
              required
              value={wishContent}
              onChange={(e) => setWishContent(e.target.value)}
              placeholder="Gửi lời chúc hạnh phúc trăm năm đến cặp đôi..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#050814] border border-white/10 text-sm text-white focus:outline-none focus:border-[#E5C378]"
            />
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmittingWish}
                className="px-6 py-2.5 rounded-full bg-[#E5C378] hover:bg-[#ebd399] text-[#050814] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Lời Chúc</span>
              </button>
            </div>
          </motion.form>

          {/* Wishes List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {wishes.filter((w) => w.isApproved !== false).length === 0 ? (
              <p className="text-center text-xs text-neutral-500 italic py-6">
                Chưa có lời chúc nào, hãy thắp sáng ngôi sao đầu tiên!
              </p>
            ) : (
              wishes.filter((w) => w.isApproved !== false).map((w) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="p-5 rounded-2xl bg-[#0B1530]/80 border border-white/10 space-y-2 group hover:border-[#E5C378]/40 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-serif-title font-medium text-white text-base block">
                        {w.authorName}
                      </span>
                      <span className="text-[10px] font-mono text-[#E5C378] uppercase">
                        {w.relation || 'Khách quý'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleLike(w.id)}
                      className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                      <span>{w.likesCount || 0}</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-300 font-body leading-relaxed">
                    "{w.content}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 9. Celestial Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 text-center border-t border-[#E5C378]/20 space-y-4"
      >
        <div className="w-8 h-8 rounded-full bg-[#E5C378]/20 border border-[#E5C378]/40 mx-auto flex items-center justify-center text-[#E5C378]">
          <Star className="w-4 h-4 fill-[#E5C378]" />
        </div>
        <h3 className="font-serif-title text-4xl font-medium text-white">
          {data.groomName} <span className="font-script text-[#E5C378] text-2xl">&</span> {data.brideName}
        </h3>
        <p className="text-xs text-neutral-400 font-serif-title italic">
          Cảm ơn quý khách đã cùng chúng tôi thắp sáng một đêm kỷ niệm khó quên.
        </p>
        <div className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest pt-4">
          L'Amour Wedding • Celestial Royale Edition
        </div>
      </motion.footer>

      {/* Modal QR Code */}
      {expandedQr && (
        <div
          onClick={() => setExpandedQr(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B1530] border border-[#E5C378] rounded-3xl p-6 max-w-sm w-full text-center space-y-4"
          >
            <div className="flex justify-between items-center text-xs text-[#E5C378]">
              <span className="font-mono uppercase">MÃ VIETQR MỪNG CƯỚI</span>
              <button
                onClick={() => setExpandedQr(null)}
                className="p-1 rounded hover:bg-white/10 text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-white p-4 rounded-2xl">
              <img
                src={expandedQr.qrCodeUrl}
                alt="Expanded QR"
                className="w-full aspect-square object-contain"
              />
            </div>
            <div className="text-xs text-neutral-300">
              <p className="font-bold text-white text-sm">{expandedQr.bankName}</p>
              <p className="font-mono text-[#E5C378] text-base">{expandedQr.accountNumber}</p>
              <p className="text-[11px] text-neutral-400 uppercase">
                {expandedQr.accountHolder}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <LightboxModal
        photos={filteredGallery}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
}
