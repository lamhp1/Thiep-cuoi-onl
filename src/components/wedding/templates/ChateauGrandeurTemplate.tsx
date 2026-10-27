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
  Phone,
  Facebook,
  Instagram,
  Sparkles,
  Maximize2,
  Crown,
  Feather,
  Compass,
  ZoomIn,
} from 'lucide-react';
import { openQRZoom } from '../common/QRZoomModal';
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
import { getGuestInfoFromUrl } from '../../../lib/guestPersonalization';
import { PersonalizedWaxSealBadge } from '../common/PersonalizedWaxSealBadge';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import { SmartEventActions } from '../common/SmartEventActions';

interface ChateauGrandeurTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function ChateauGrandeurTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: ChateauGrandeurTemplateProps) {
  const { showToast } = useToast();
  const [isCurtainOpened, setIsCurtainOpened] = useState(!showEnvelopeImmediately);

  useEffect(() => {
    setIsCurtainOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(data.weddingDateTime || data.weddingDate)
  );

  // Bank & Gift
  const [activeBankTab, setActiveBankTab] = useState<'groom' | 'bride'>('groom');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [expandedQr, setExpandedQr] = useState<BankAccount | null>(null);

  // Guest Personalization
  const guestInfo = React.useMemo(() => getGuestInfoFromUrl(), []);

  // RSVP Form
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

  // Wishes
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [wishAuthor, setWishAuthor] = useState('');
  const [wishRelation, setWishRelation] = useState('Khách quý');
  const [wishContent, setWishContent] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);

  // Gallery
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

  // Load guestbook wishes
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (data.id) {
        const list = await getWishes(data.id);
        if (mounted) setWishes(list || []);
      }
    }
    loadData();

    const handleUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail?.weddingId || detail.weddingId === data.id || data.id.includes(detail.weddingId) || detail.weddingId.includes(data.id)) {
        loadData();
      }
    };

    window.addEventListener('lamour_wishes_updated', handleUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('lamour_wishes_updated', handleUpdated);
    };
  }, [data.id]);

  const handleCopyAccount = async (num: string) => {
    const ok = await copyToClipboard(num);
    if (ok) {
      setCopiedAccount(num);
      showToast('Đã sao chép số tài khoản hoàng gia!', 'success');
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
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#C9A84E', '#3E4F42', '#FAF8F3', '#D4AF37'],
        });
        showToast('Trân trọng cảm ơn hồi đáp của quý khách!', 'success');
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
      showToast('Vui lòng nhập tên và lời chúc quý báu của bạn', 'error');
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
        showToast('Đã lưu lời chúc vào sổ lưu bút hoàng gia!', 'success');
      }
    } catch {
      showToast('Không thể lưu lời chúc, vui lòng thử lại', 'error');
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
    <div className="min-h-screen bg-[#FAF8F3] text-[#222523] font-body selection:bg-[#C9A84E]/30 selection:text-[#3E4F42] relative overflow-x-hidden">
      {/* Floating Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* 1. Royal Decree Curtain Screen */}
      <AnimatePresence>
        {!isCurtainOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2520] p-4 text-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(201,168,78,0.4)_0%,transparent_70%)]" />

            <div className="relative max-w-md w-full bg-[#FAF8F3] border-4 border-[#C9A84E]/50 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-[#222523]">
              {/* Royal Crown Emblem */}
              <div className="w-16 h-16 rounded-full bg-[#3E4F42] border-2 border-[#C9A84E] mx-auto flex items-center justify-center text-[#C9A84E] shadow-md">
                <Crown className="w-8 h-8" />
              </div>

              <div className="space-y-1 w-full max-w-sm mx-auto px-2">
                <span className="font-serif-title italic text-xs tracking-widest text-[#3E4F42] uppercase block font-semibold">
                  Château de Chantilly • Hoàng Gia
                </span>
                <CoupleNamesStacked
                  groomName={data.groomName}
                  brideName={data.brideName}
                  variant="envelope"
                  textColor="#1E2520"
                  heartColor="#C9A84E"
                  idPrefix="chateau-envelope"
                />
                <p className="text-[11px] font-mono tracking-wider text-neutral-500 uppercase mt-1">
                  THIỆP BÁO HỶ HOÀNG GIA • {formatVietnameseDate(data.events[0]?.date || data.weddingDate)}
                </p>
              </div>

              {/* Gold Inscribed Guest Badge */}
              <PersonalizedWaxSealBadge theme="gold" className="my-1.5" />

              <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#C9A84E] to-transparent mx-auto" />

              <p className="text-xs text-neutral-600 italic font-serif-title max-w-xs mx-auto leading-relaxed">
                "{data.romanticQuote || 'Trân trọng kính mời quý khách đến dự buổi dạ yến chúc mừng hôn lễ của chúng tôi.'}"
              </p>

              <button
                onClick={() => {
                  weddingAudio.play(data.musicUrl);
                  setIsCurtainOpened(true);
                  confetti({
                    particleCount: 75,
                    spread: 70,
                    origin: { y: 0.7 },
                    colors: ['#C9A84E', '#3E4F42', '#FAF8F3'],
                  });
                }}
                className="w-full py-3.5 rounded-full bg-linear-to-r from-[#3E4F42] to-[#2B382E] hover:from-[#2B382E] hover:to-[#1E2520] text-[#FAF8F3] text-xs font-bold uppercase tracking-[0.2em] shadow-lg border border-[#C9A84E]/50 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Mở Chiếu Thư Hôn Lễ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Royal French Nav */}
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[#C9A84E]/30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-[#C9A84E]" />
          <span className="font-serif-title text-base sm:text-lg tracking-wider text-[#1E2520] font-bold">
            {data.groomName} & {data.brideName}
          </span>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6 text-xs font-serif-title tracking-wider text-neutral-600">
          <a href="#chateau-couple" className="hover:text-[#3E4F42] font-semibold transition-colors">Tân Lang & Tân Nương</a>
          <a href="#chateau-programme" className="hover:text-[#3E4F42] font-semibold transition-colors">Đại Yến</a>
          <a href="#chateau-gallery" className="hover:text-[#3E4F42] font-semibold transition-colors">Phòng Tranh</a>
          <a href="#chateau-rsvp" className="text-[#3E4F42] font-bold hover:underline">Hồi Báo RSVP</a>
          {isOwnerMode && onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-2.5 py-1 rounded-full bg-[#3E4F42] text-[#FAF8F3] hover:bg-[#2B382E] transition-colors"
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
        accentColor="#C9A84E"
      />

      {/* 2. Hero: Arched French Palace Facade */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center p-6 sm:p-12 overflow-hidden bg-[radial-gradient(#C9A84E_1px,transparent_1px)] [background-size:24px_24px] bg-[#FAF8F3]">
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Royal Crest Emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#C9A84E]/60 text-[#3E4F42] text-xs font-serif-title tracking-[0.2em] uppercase shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-[#C9A84E]" />
            <span>ROYAL CHÂTEAU WEDDING</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <p className="font-serif-title italic text-lg sm:text-xl text-[#3E4F42] tracking-widest font-semibold">
              Kính Báo Lễ Thành Hôn
            </p>
            <div className="w-full max-w-3xl mx-auto px-2">
              <CoupleNamesStacked
                groomName={data.groomName}
                brideName={data.brideName}
                variant="hero-xl"
                textColor="#1E2520"
                heartColor="#C9A84E"
                idPrefix="chateau-hero"
              />
            </div>
          </motion.div>

          {/* Arched French Window Portal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-sm sm:max-w-md aspect-[3/4] rounded-t-full overflow-hidden border-4 border-[#C9A84E] shadow-2xl bg-white p-2"
          >
            <div className="w-full h-full rounded-t-full overflow-hidden">
              <img
                src={data.coverImage}
                alt="Chateau Portrait"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-serif-title italic text-base sm:text-xl text-neutral-700 max-w-xl mx-auto leading-relaxed"
          >
            "{data.romanticQuote || 'Tình yêu là lâu đài vĩnh cửu được xây đắp bằng sự chân thành, thấu hiểu và lòng bao dung.'}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xs font-mono uppercase tracking-[0.25em] text-[#3E4F42] font-semibold"
          >
            {data.city} • {formatVietnameseDate(data.events[0]?.date || data.weddingDate)}
          </motion.div>

          {/* Royal Pedestal Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4"
          >
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
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
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.04 }}
                  className="bg-white border-2 border-[#C9A84E]/40 rounded-2xl p-3 sm:p-4 text-center shadow-md hover:border-[#C9A84E] transition-all"
                >
                  <span className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E2520] block">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#3E4F42] font-bold block mt-1">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Lord & Lady (Couple) */}
      <section id="chateau-couple" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3 mb-16"
        >
          <span className="text-xs font-serif-title tracking-[0.3em] text-[#C9A84E] uppercase font-bold">
            LES MARIÉS
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1E2520]">
            Tân Lang & Tân Nương
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84E] to-transparent mx-auto"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10 items-stretch">
          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="bg-white border sm:border-2 border-[#C9A84E]/40 rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs gap-1">
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#3E4F42] text-[#FAF8F3] font-serif-title tracking-wider text-[9px] sm:text-[11px] font-semibold whitespace-nowrap">
                TÂN LANG • LE MARIÉ
              </span>
              <span className="font-serif-title text-neutral-500 italic text-[10px] sm:text-xs">Chú Rể</span>
            </div>

            {/* Arched Avatar */}
            <div className="relative aspect-[3/4] w-24 sm:w-36 md:max-w-xs mx-auto rounded-t-full overflow-hidden border sm:border-2 border-[#C9A84E] shadow-md">
              <img
                src={data.groom.avatar}
                alt={data.groom.fullName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-3 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-bold text-[#1E2520] leading-tight">
                  {data.groom.fullName}
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-600 leading-relaxed font-body mt-1 line-clamp-3 sm:line-clamp-none">
                  {data.groom.bio || 'Chàng trai phong độ, điềm đạm và tận tụy, luôn dành cho người bạn đời tình cảm trọn vẹn nhất.'}
                </p>
              </div>

              {data.groom.parents && (
                <div className="pt-2 sm:pt-4 border-t border-neutral-200 text-[9.5px] sm:text-xs text-neutral-600 space-y-0.5 sm:space-y-1 font-serif-title">
                  <span className="text-[#3E4F42] font-bold text-[9px] sm:text-xs uppercase block">GIA ĐÌNH NHÀ TRAI</span>
                  <p className="break-words leading-snug">Thân phụ: {data.groom.parents.father}</p>
                  <p className="break-words leading-snug">Thân mẫu: {data.groom.parents.mother}</p>
                </div>
              )}

              {data.groom.socials && (
                <div className="flex justify-center items-center gap-1.5 sm:gap-3 pt-1 sm:pt-2 flex-wrap">
                  {data.groom.socials.phone && (
                    <a
                      href={`tel:${data.groom.socials.phone}`}
                      className="p-1.5 sm:p-2.5 rounded-full bg-neutral-100 hover:bg-[#3E4F42] hover:text-white transition-colors"
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
                      className="p-1.5 sm:p-2.5 rounded-full bg-neutral-100 hover:bg-[#3E4F42] hover:text-white transition-colors"
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
                      className="p-1.5 sm:p-2.5 rounded-full bg-neutral-100 hover:bg-[#3E4F42] hover:text-white transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="bg-white border sm:border-2 border-[#C9A84E]/40 rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-6 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs gap-1">
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#3E4F42] text-[#FAF8F3] font-serif-title tracking-wider text-[9px] sm:text-[11px] font-semibold whitespace-nowrap">
                TÂN NƯƠNG • LA MARIÉE
              </span>
              <span className="font-serif-title text-neutral-500 italic text-[10px] sm:text-xs">Cô Dâu</span>
            </div>

            {/* Arched Avatar */}
            <div className="relative aspect-[3/4] w-24 sm:w-36 md:max-w-xs mx-auto rounded-t-full overflow-hidden border sm:border-2 border-[#C9A84E] shadow-md">
              <img
                src={data.bride.avatar}
                alt={data.bride.fullName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-3 text-center flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-bold text-[#1E2520] leading-tight">
                  {data.bride.fullName}
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-600 leading-relaxed font-body mt-1 line-clamp-3 sm:line-clamp-none">
                  {data.bride.bio || 'Cô gái dịu dàng, tao nhã với nụ cười rạng rỡ, người tô điểm cho cuộc sống tình yêu thêm ngọt ngào.'}
                </p>
              </div>

              {data.bride.parents && (
                <div className="pt-2 sm:pt-4 border-t border-neutral-200 text-[9.5px] sm:text-xs text-neutral-600 space-y-0.5 sm:space-y-1 font-serif-title">
                  <span className="text-[#3E4F42] font-bold text-[9px] sm:text-xs uppercase block">GIA ĐÌNH NHÀ GÁI</span>
                  <p className="break-words leading-snug">Thân phụ: {data.bride.parents.father}</p>
                  <p className="break-words leading-snug">Thân mẫu: {data.bride.parents.mother}</p>
                </div>
              )}

              {data.bride.socials && (
                <div className="flex justify-center items-center gap-1.5 sm:gap-3 pt-1 sm:pt-2 flex-wrap">
                  {data.bride.socials.phone && (
                    <a
                      href={`tel:${data.bride.socials.phone}`}
                      className="p-1.5 sm:p-2.5 rounded-full bg-neutral-100 hover:bg-[#3E4F42] hover:text-white transition-colors"
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
                      className="p-1.5 sm:p-2.5 rounded-full bg-neutral-100 hover:bg-[#3E4F42] hover:text-white transition-colors"
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
                      className="p-1.5 sm:p-2.5 rounded-full bg-neutral-100 hover:bg-[#3E4F42] hover:text-white transition-colors"
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

      {/* 4. Royal Banquet Programme (Events) */}
      <section id="chateau-programme" className="py-24 px-6 sm:px-12 bg-[#F4EFE6] border-y border-[#C9A84E]/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-serif-title tracking-[0.3em] text-[#C9A84E] uppercase font-bold">
              PROGRAMME DU MARIAGE
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1E2520]">
              Chương Trình Hôn Lễ Hoàng Gia
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84E] to-transparent mx-auto"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.events.map((evt, idx) => (
              <motion.div
                key={evt.id || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="bg-white border-2 border-[#C9A84E]/40 rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#3E4F42] px-3 py-1 rounded-full bg-[#3E4F42]/10 border border-[#3E4F42]/20 font-bold">
                    NGHI THỨC {idx + 1}
                  </span>
                  <span className="font-serif-title text-2xl font-bold text-[#C9A84E]">{evt.time}</span>
                </div>

                <div>
                  <h3 className="font-serif-title text-3xl font-bold text-[#1E2520] mb-1">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    Ngày {formatVietnameseDate(evt.date)}
                  </p>
                </div>

                <div className="space-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C9A84E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1E2520] block font-medium">{evt.locationName}</strong>
                      <span className="text-neutral-500">{evt.address}</span>
                    </div>
                  </div>
                  {evt.description && (
                    <p className="text-[11px] text-neutral-500 italic pt-1">
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
                  theme="emerald"
                  className="pt-2 border-t border-neutral-200"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Museum Gallery (Lookbook) */}
      <section id="chateau-gallery" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="text-xs font-serif-title tracking-[0.3em] text-[#C9A84E] uppercase font-bold">
            GALERIE D'ART
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1E2520]">
            Phòng Tranh Kỷ Niệm
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84E] to-transparent mx-auto"
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
            { id: 'all', label: 'Tất Cả Tác Phẩm' },
            { id: 'prewedding', label: 'Pre-Wedding' },
            { id: 'ceremony', label: 'Lễ Thành Hôn' },
            { id: 'moments', label: 'Khoảnh Khắc' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setGalleryTab(cat.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-serif-title tracking-wider uppercase transition-all cursor-pointer ${
                galleryTab === cat.id
                  ? 'bg-[#3E4F42] text-white font-bold shadow-md'
                  : 'bg-white text-neutral-600 hover:text-[#3E4F42] border border-neutral-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid with French Gilt Frames */}
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
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#C9A84E]/50 cursor-pointer bg-neutral-100 shadow-md hover:shadow-2xl transition-all p-1"
            >
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Chateau art'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-mono text-[#C9A84E] uppercase">
                    {photo.category || 'PORTRAIT'}
                  </span>
                  <p className="font-serif-title italic text-xs truncate">
                    {photo.caption || `${data.groomName} & ${data.brideName}`}
                  </p>
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Gift Treasury / VietQR */}
      <section className="py-24 px-6 sm:px-12 bg-[#F4EFE6] border-t border-[#C9A84E]/30">
        <div className="max-w-3xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-serif-title tracking-[0.3em] text-[#C9A84E] uppercase font-bold">
              TRÉSOR DU MARIAGE
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1E2520]">
              Hộp Mừng Cưới Hoàng Gia
            </h2>
            <p className="text-xs text-neutral-600 max-w-md mx-auto">
              {data.gift?.message || 'Sự hiện diện của quý khách là niềm vinh hạnh to lớn. Nếu quý khách muốn gửi món quà mừng từ xa:'}
            </p>
          </motion.div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setActiveBankTab('groom')}
              className={`px-6 py-2.5 rounded-full text-xs font-serif-title uppercase tracking-wider transition-all cursor-pointer ${
                activeBankTab === 'groom'
                  ? 'bg-[#3E4F42] text-white font-bold shadow-md'
                  : 'bg-white text-neutral-600 hover:text-[#3E4F42] border border-neutral-300'
              }`}
            >
              Mừng Chú Rể ({data.groomName})
            </button>
            <button
              onClick={() => setActiveBankTab('bride')}
              className={`px-6 py-2.5 rounded-full text-xs font-serif-title uppercase tracking-wider transition-all cursor-pointer ${
                activeBankTab === 'bride'
                  ? 'bg-[#3E4F42] text-white font-bold shadow-md'
                  : 'bg-white text-neutral-600 hover:text-[#3E4F42] border border-neutral-300'
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
                <div className="p-8 text-center text-xs text-neutral-500 bg-white rounded-2xl border border-neutral-200">
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
                className="bg-white border-2 border-[#C9A84E]/40 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center gap-8 hover:border-[#C9A84E] transition-colors"
              >
                {Boolean(currentBank.qrCodeUrl) && (
                  <div
                    onClick={() => {
                      if (currentBank.qrCodeUrl) {
                        openQRZoom({
                          qrUrl: currentBank.qrCodeUrl,
                          title: `Mừng Cưới - ${currentBank.accountHolder}`,
                          bankName: currentBank.bankName,
                          accountNumber: currentBank.accountNumber,
                          accountHolder: currentBank.accountHolder,
                          note: `Mung cuoi ${currentBank.accountHolder}`,
                        });
                      }
                    }}
                    className="cursor-pointer group relative p-3 bg-neutral-50 rounded-2xl border border-neutral-200 shrink-0 shadow-sm hover:scale-105 transition-all"
                    title="Chạm để phóng to mã QR"
                    data-qr-zoom="true"
                    data-qr-url={currentBank.qrCodeUrl}
                    data-qr-title={`Mừng Cưới - ${currentBank.accountHolder}`}
                    data-qr-bank={currentBank.bankName}
                    data-qr-account={currentBank.accountNumber}
                    data-qr-holder={currentBank.accountHolder}
                  >
                    <img
                      src={currentBank.qrCodeUrl}
                      alt="QR Code"
                      className="w-36 h-36 object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition-opacity gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-white" />
                      <span>Phóng to QR</span>
                    </div>
                  </div>
                )}

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <span className="text-xs font-serif-title text-[#3E4F42] uppercase tracking-widest font-bold block">
                    {currentBank.bankName}
                  </span>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="font-mono text-2xl font-bold text-[#1E2520] tracking-wider">
                      {currentBank.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopyAccount(currentBank.accountNumber)}
                      className="p-1.5 rounded-lg bg-neutral-100 hover:bg-[#3E4F42] hover:text-white transition-colors text-neutral-600 cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedAccount === currentBank.accountNumber ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-mono">
                    Chủ TK: {currentBank.accountHolder}
                  </p>
                  {currentBank.note && (
                    <p className="text-[11px] text-neutral-500 italic">
                      Ghi chú: {currentBank.note}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* 7. The Royal Decree RSVP */}
      <section id="chateau-rsvp" className="py-24 px-6 sm:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border-2 border-[#C9A84E]/50 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl"
        >
          <div className="text-center space-y-3">
            <span className="text-xs font-serif-title tracking-[0.3em] text-[#C9A84E] uppercase font-bold">
              RÉPONSE S'IL VOUS PLAÎT
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1E2520]">
              Hồi Báo Tham Dự Hôn Lễ
            </h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Kính mong quý khách xác nhận tham dự trước ngày cử hành để công tác đón tiếp được chuẩn bị trang trọng nhất.
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="p-8 rounded-2xl bg-[#F4EFE6] border border-emerald-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-2xl text-[#1E2520] font-bold">
                Trân Trọng Cảm Ơn Quý Khách!
              </h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Chúng tôi rất hân hạnh được đón tiếp quý khách tại buổi đại yến thành hôn.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitRSVP} className="space-y-6">
              {guestInfo.hasGuest && guestInfo.cleanName && (
                <div className="p-3.5 rounded-2xl bg-[#3E4F42]/10 border border-[#C9A84E]/50 text-xs text-[#1E2520] flex items-center gap-2.5 shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#C9A84E] shrink-0" />
                  <span>
                    Kính chào <strong>{guestInfo.cleanName}</strong>! Thông tin của bạn đã được điền sẵn để xác nhận nhanh.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-serif-title uppercase tracking-wider text-neutral-600 mb-2 font-bold">
                    Họ và Tên Quý Khách *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="VD: Nguyễn Thành Trung"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 focus:border-[#3E4F42] text-sm text-[#1E2520] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif-title uppercase tracking-wider text-neutral-600 mb-2 font-bold">
                    Số Điện Thoại Liên Lạc *
                  </label>
                  <input
                    type="tel"
                    required
                    value={rsvpPhone}
                    onChange={(e) => setRsvpPhone(e.target.value)}
                    placeholder="VD: 0903 888 999"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 focus:border-[#3E4F42] text-sm text-[#1E2520] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif-title uppercase tracking-wider text-neutral-600 mb-2 font-bold">
                  Sự Hiện Diện Của Quý Khách
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(true)}
                    className={`py-3 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                      rsvpAttending
                        ? 'bg-[#3E4F42] text-white shadow-md'
                        : 'bg-neutral-50 text-neutral-600 border border-neutral-300'
                    }`}
                  >
                    Vinh dự tham dự 🍷
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(false)}
                    className={`py-3 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                      !rsvpAttending
                        ? 'bg-neutral-800 text-white'
                        : 'bg-neutral-50 text-neutral-600 border border-neutral-300'
                    }`}
                  >
                    Tiếc rằng vắng mặt 💌
                  </button>
                </div>
              </div>

              {rsvpAttending && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-serif-title uppercase tracking-wider text-neutral-600 mb-2 font-bold">
                      Số Khách Tham Dự
                    </label>
                    <select
                      value={rsvpGuestsCount}
                      onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-[#1E2520] focus:outline-none focus:border-[#3E4F42]"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} Người
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-serif-title uppercase tracking-wider text-neutral-600 mb-2 font-bold">
                      Quý Khách Thuộc Đoàn
                    </label>
                    <select
                      value={rsvpGuestOf}
                      onChange={(e) => setRsvpGuestOf(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-[#1E2520] focus:outline-none focus:border-[#3E4F42]"
                    >
                      <option value="both">Cả hai gia đình</option>
                      <option value="groom">Họ Nhà Trai ({data.groomName})</option>
                      <option value="bride">Họ Nhà Gái ({data.brideName})</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-serif-title uppercase tracking-wider text-neutral-600 mb-2 font-bold">
                  Lời Chúc / Lưu Ý Đặc Biệt
                </label>
                <textarea
                  rows={3}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Gửi gắm lời chúc mừng hoặc ghi chú món ăn..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 focus:border-[#3E4F42] text-sm text-[#1E2520] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRSVP}
                className="w-full py-4 rounded-full bg-linear-to-r from-[#3E4F42] to-[#2B382E] hover:from-[#2B382E] hover:to-[#1E2520] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg border border-[#C9A84E]/50 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRSVP ? 'Đang gửi hồi báo...' : 'Gửi Hồi Báo RSVP'}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* 8. Salon des Souhaits (Wishes Guestbook) */}
      <section className="py-24 px-6 sm:px-12 bg-[#F4EFE6] border-t border-[#C9A84E]/30">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-serif-title tracking-[0.3em] text-[#C9A84E] uppercase font-bold">
              SALON DES SOUHAITS
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1E2520]">
              Sổ Vàng Lời Chúc Phúc
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84E] to-transparent mx-auto"
            />
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmitWish}
            className="bg-white border-2 border-[#C9A84E]/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={wishAuthor}
                onChange={(e) => setWishAuthor(e.target.value)}
                placeholder="Họ tên của bạn *"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-[#1E2520] focus:outline-none focus:border-[#3E4F42]"
              />
              <select
                value={wishRelation}
                onChange={(e) => setWishRelation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-[#1E2520] focus:outline-none focus:border-[#3E4F42]"
              >
                <option value="Khách quý">Khách quý</option>
                <option value="Bạn bè">Bạn bè</option>
                <option value="Đồng nghiệp">Đồng nghiệp</option>
                <option value="Họ hàng">Họ hàng</option>
                <option value="Người thân">Người thân</option>
              </select>
            </div>
            <textarea
              rows={3}
              required
              value={wishContent}
              onChange={(e) => setWishContent(e.target.value)}
              placeholder="Gửi lời chúc phúc tốt đẹp nhất đến hai bạn..."
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-[#1E2520] focus:outline-none focus:border-[#3E4F42]"
            />
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmittingWish}
                className="px-6 py-2.5 rounded-full bg-[#3E4F42] hover:bg-[#2B382E] text-white text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Lưu Lời Chúc</span>
              </button>
            </div>
          </motion.form>

          {/* Wishes List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {wishes.filter((w) => w.isApproved !== false).length === 0 ? (
              <p className="text-center text-xs text-neutral-500 italic py-6">
                Chưa có lời chúc nào, hãy là người đầu tiên ghi tên vào sổ vàng kỷ niệm!
              </p>
            ) : (
              wishes.filter((w) => w.isApproved !== false).map((w) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="p-5 rounded-2xl bg-white border border-[#C9A84E]/30 space-y-2 group shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-serif-title font-bold text-[#1E2520] text-base block">
                        {w.authorName}
                      </span>
                      <span className="text-[10px] font-mono text-[#3E4F42] uppercase font-semibold">
                        {w.relation || 'Khách quý'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleLike(w.id)}
                      className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                      <span>{w.likesCount || 0}</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-700 font-body leading-relaxed">
                    "{w.content}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 9. Chateau Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 text-center border-t border-[#C9A84E]/30 space-y-4 bg-[#FAF8F3]"
      >
        <Crown className="w-6 h-6 text-[#C9A84E] mx-auto" />
        <h3 className="font-serif-title text-4xl font-bold text-[#1E2520]">
          {data.groomName} <span className="font-script text-[#C9A84E] text-2xl">&</span> {data.brideName}
        </h3>
        <p className="text-xs text-neutral-600 font-serif-title italic">
          Chân thành cảm tạ quý khách đã đến chung vui trong ngày trọng đại của chúng tôi.
        </p>
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest pt-4">
          L'Amour Wedding • Château Grandeur Collection
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
            className="bg-white border-2 border-[#C9A84E] rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center text-xs text-[#3E4F42]">
              <span className="font-serif-title font-bold uppercase">MÃ VIETQR MỪNG CƯỚI</span>
              <button
                onClick={() => setExpandedQr(null)}
                className="p-1 rounded hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              {expandedQr.qrCodeUrl ? (
                <img
                  src={expandedQr.qrCodeUrl}
                  alt="Expanded QR"
                  className="w-full aspect-square object-contain"
                />
              ) : null}
            </div>
            <div className="text-xs text-neutral-700">
              <p className="font-bold text-[#1E2520] text-sm">{expandedQr.bankName}</p>
              <p className="font-mono text-[#3E4F42] text-base font-bold">{expandedQr.accountNumber}</p>
              <p className="text-[11px] text-neutral-500 uppercase">
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
