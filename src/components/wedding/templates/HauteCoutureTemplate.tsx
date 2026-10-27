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
  Bookmark,
  Share2,
  Music,
  Eye,
  Camera,
  Compass,
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
import { getGuestInfoFromUrl } from '../../../lib/guestPersonalization';
import { PersonalizedWaxSealBadge } from '../common/PersonalizedWaxSealBadge';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import { SmartEventActions } from '../common/SmartEventActions';

interface HauteCoutureTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function HauteCoutureTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: HauteCoutureTemplateProps) {
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
  const [wishRelation, setWishRelation] = useState('Bạn bè');
  const [wishContent, setWishContent] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);

  // Gallery
  const [galleryTab, setGalleryTab] = useState<'all' | 'prewedding' | 'ceremony' | 'moments'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(data.weddingDateTime || data.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDateTime, data.weddingDate]);

  // Load guestbook wishes
  useEffect(() => {
    async function loadData() {
      if (data.id) {
        const list = await getWishes(data.id);
        setWishes(list);
      }
    }
    loadData();
  }, [data.id]);

  // Handle Copy Bank Account
  const handleCopyAccount = async (num: string) => {
    const ok = await copyToClipboard(num);
    if (ok) {
      setCopiedAccount(num);
      showToast('Đã sao chép số tài khoản!', 'success');
      setTimeout(() => setCopiedAccount(null), 3000);
    }
  };

  // Handle RSVP submission
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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A880', '#E5DFD7', '#FAF7F2', '#2B2625'],
        });
        showToast('Cảm ơn bạn đã phản hồi xác nhận tham dự!', 'success');
      }
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      setIsSubmittingRSVP(false);
    }
  };

  // Handle Wish submission
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
    <div className="min-h-screen bg-[#0E0D0C] text-[#F3EFEA] font-body selection:bg-[#C5A880]/30 selection:text-[#E8D7BE] relative overflow-x-hidden">
      {/* 1. Haute Couture Editorial Curtain Cover */}
      <AnimatePresence>
        {!isCurtainOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0908] p-4 text-center overflow-hidden"
          >
            {/* Ambient silk light */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.3)_0%,transparent_70%)]" />

            <div className="relative max-w-lg w-full bg-[#141210] border border-[#C5A880]/40 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 text-[#F3EFEA]">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-[#C5A880] border-b border-[#C5A880]/20 pb-4 font-mono">
                <span>VOGUE BRIDAL EDITION</span>
                <span>ISSUE NO. 26</span>
              </div>

              <div className="space-y-2 w-full max-w-sm mx-auto px-2">
                <p className="font-serif-title italic text-sm tracking-widest text-neutral-400">
                  L'Amour Haute Couture
                </p>
                <CoupleNamesStacked
                  groomName={data.groomName}
                  brideName={data.brideName}
                  variant="envelope"
                  textColor="#FFFFFF"
                  heartColor="#C5A880"
                  groomClassName="font-light"
                  brideClassName="font-light"
                  idPrefix="haute-envelope"
                />
                <p className="text-xs text-neutral-400 tracking-widest uppercase font-mono mt-1">
                  {data.city} • {formatVietnameseDate(data.events[0]?.date || data.weddingDate)}
                </p>
              </div>

              {/* Gold Inscribed Guest Invitation */}
              <PersonalizedWaxSealBadge theme="dark" className="my-1.5" />

              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto my-4" />

              <p className="text-xs text-neutral-300 italic font-serif-title max-w-sm mx-auto leading-relaxed">
                "{data.romanticQuote || 'Trân trọng kính mời quý khách đến chứng kiến khoảnh khắc hạnh phúc nhất cuộc đời chúng tôi.'}"
              </p>

              <button
                onClick={() => {
                  weddingAudio.play(data.musicUrl);
                  setIsCurtainOpened(true);
                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#C5A880', '#F3EFEA', '#9B8361'],
                  });
                }}
                className="w-full py-4 rounded-full bg-linear-to-r from-[#C5A880] via-[#E8D7BE] to-[#C5A880] text-[#0E0D0C] text-xs font-bold uppercase tracking-[0.25em] shadow-lg hover:shadow-[0_0_25px_rgba(197,168,128,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Mở Thiệp Chúc Mừng
              </button>

              <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono pt-2">
                Tap to explore exclusive wedding editorial
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* Top Editorial Sticky Bar */}
      <header className="sticky top-0 z-40 bg-[#0E0D0C]/90 backdrop-blur-md border-b border-[#C5A880]/20 px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#C5A880] uppercase font-bold">
            VOGUE BRIDAL
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline font-serif-title italic text-sm tracking-wider text-neutral-300">
            {data.groomName} & {data.brideName}
          </span>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6 text-[11px] uppercase tracking-widest text-neutral-400">
          <a href="#editorial-couple" className="hover:text-[#C5A880] transition-colors">Cặp Đôi</a>
          <a href="#editorial-itinerary" className="hover:text-[#C5A880] transition-colors">Lịch Trình</a>
          <a href="#editorial-lookbook" className="hover:text-[#C5A880] transition-colors">Lookbook</a>
          <a href="#editorial-rsvp" className="text-[#C5A880] font-bold hover:underline">RSVP</a>
          {isOwnerMode && onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-2.5 py-1 rounded bg-[#C5A880]/20 text-[#C5A880] hover:bg-[#C5A880]/30 transition-colors"
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
        accentColor="#C5A880"
      />

      {/* 2. Hero Editorial Cover Section */}
      <section className="relative min-h-[92vh] flex flex-col justify-between p-6 sm:p-12 border-b border-[#C5A880]/25 overflow-hidden">
        {/* Subtle high-fashion background overlay with slow drift */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0.2 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity"
          style={{ backgroundImage: `url(${data.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C] via-[#0E0D0C]/80 to-transparent" />

        {/* Masthead Header with Editorial Split Line Reveal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#C5A880]/30 pb-4 gap-4"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-[10px] uppercase font-mono text-[#C5A880]"
            >
              SPECIAL WEDDING RETROSPECTIVE
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif-title text-6xl sm:text-8xl lg:text-9xl font-light tracking-tighter text-white uppercase leading-none mt-2"
            >
              L'AMOUR
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-right sm:text-right font-mono text-[11px] text-neutral-400 space-y-1"
          >
            <p className="text-[#C5A880] font-bold tracking-widest uppercase">THE WEDDING ISSUE</p>
            <p>{formatVietnameseDate(data.events[0]?.date || data.weddingDate)}</p>
            <p className="text-neutral-500 uppercase">{data.city} • VIETNAM</p>
          </motion.div>
        </motion.div>

        {/* Hero Center Editorial Framing */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 text-[#C5A880] text-[11px] uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:8s]" />
              <span>Dạ Tiệc Thành Hôn Độc Quyền</span>
            </div>

            <div className="space-y-2 w-full max-w-3xl mx-auto px-2">
              <CoupleNamesStacked
                groomName={data.groomName}
                brideName={data.brideName}
                variant="hero-xl"
                textColor="#FFFFFF"
                heartColor="#C5A880"
                groomClassName="font-light"
                brideClassName="font-light"
                idPrefix="haute-hero"
              />
            </div>

            <p className="text-neutral-300 font-serif-title text-lg sm:text-xl italic max-w-xl leading-relaxed">
              "{data.romanticQuote || 'Tình yêu không chỉ là nhìn vào nhau, mà là cùng nhìn về một hướng trên con đường phía trước.'}"
            </p>

            {/* Haute Countdown Timer */}
            <div className="pt-4 border-t border-[#C5A880]/20">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880] mb-3">
                ĐẾM NGƯỢC NGÀY CHUNG ĐÔI
              </div>
              <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md">
                {[
                  { label: 'NGÀY', val: countdown.days },
                  { label: 'GIỜ', val: countdown.hours },
                  { label: 'PHÚT', val: countdown.minutes },
                  { label: 'GIÂY', val: countdown.seconds },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -4, borderColor: '#C5A880' }}
                    className="bg-[#181614] border border-[#C5A880]/30 rounded-2xl p-3 sm:p-4 text-center group transition-colors shadow-lg"
                  >
                    <span className="font-serif-title text-2xl sm:text-3xl font-bold text-white block">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-[#C5A880] block mt-1">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Hero Portrait Frame with Editorial Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 1.5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-[#C5A880]/40 shadow-2xl group">
              <img
                src={data.coverImage}
                alt="Editorial Portrait"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-xs font-mono text-neutral-300">
                <div>
                  <span className="text-[10px] uppercase text-[#C5A880] block">COVER STORY</span>
                  <span className="font-serif-title italic text-sm">{data.groomName} & {data.brideName}</span>
                </div>
                <span className="text-[10px] px-2 py-1 rounded bg-black/60 border border-white/20">35MM FILM</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Editorial Footnotes */}
        <div className="relative z-10 flex flex-wrap justify-between items-center text-[10px] font-mono uppercase tracking-widest text-neutral-500 border-t border-[#C5A880]/20 pt-4 gap-2">
          <span>PARISIAN EDITORIAL AESTHETIC</span>
          <span>CURATED WITH PASSION</span>
          <span>EXCLUSIVE WEDDING INVITATION</span>
        </div>
      </section>

      {/* 3. The Protagonists (Bride & Groom) */}
      <section id="editorial-couple" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
            THE PROTAGONISTS
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl font-light text-white">
            Nhân Vật Chính Của Câu Chuyện
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Groom Card - Slide in from left */}
          <motion.div
            initial={{ opacity: 0, x: -60, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="bg-[#141311] border border-[#C5A880]/30 rounded-3xl p-8 sm:p-10 space-y-6 relative overflow-hidden group hover:border-[#C5A880]/70 transition-all shadow-xl"
          >
            <div className="absolute top-6 right-6 text-[10px] font-mono uppercase tracking-widest text-[#C5A880] px-3 py-1 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10">
              CHÚ RỂ • GROOM
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-800">
              <img
                src={data.groom.avatar}
                alt={data.groom.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-serif-title text-3xl font-light text-white">
                  {data.groom.fullName}
                </h3>
                <span className="font-script text-2xl text-[#C5A880]">{data.groom.name}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-body">
                {data.groom.bio || 'Chàng trai điềm tĩnh, ấm áp, luôn đồng hành và dành trọn niềm tin yêu cho người bạn đời của mình.'}
              </p>

              {data.groom.parents && (
                <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 font-mono space-y-1">
                  <span className="text-[#C5A880] uppercase block">KÍNH BÁO NHÀ TRAI</span>
                  <p className="break-words leading-snug">Thân phụ: {data.groom.parents.father}</p>
                  <p className="break-words leading-snug">Thân mẫu: {data.groom.parents.mother}</p>
                </div>
              )}

              {data.groom.socials && (
                <div className="flex items-center gap-3 pt-2">
                  {data.groom.socials.phone && (
                    <a
                      href={`tel:${data.groom.socials.phone}`}
                      className="p-2 rounded-full bg-neutral-800 hover:bg-[#C5A880] hover:text-black transition-colors"
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
                      className="p-2 rounded-full bg-neutral-800 hover:bg-[#C5A880] hover:text-black transition-colors"
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
                      className="p-2 rounded-full bg-neutral-800 hover:bg-[#C5A880] hover:text-black transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Bride Card - Slide in from right */}
          <motion.div
            initial={{ opacity: 0, x: 60, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-[#141311] border border-[#C5A880]/30 rounded-3xl p-8 sm:p-10 space-y-6 relative overflow-hidden group hover:border-[#C5A880]/70 transition-all shadow-xl"
          >
            <div className="absolute top-6 right-6 text-[10px] font-mono uppercase tracking-widest text-[#C5A880] px-3 py-1 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10">
              CÔ DÂU • BRIDE
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-800">
              <img
                src={data.bride.avatar}
                alt={data.bride.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-serif-title text-3xl font-light text-white">
                  {data.bride.fullName}
                </h3>
                <span className="font-script text-2xl text-[#C5A880]">{data.bride.name}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-body">
                {data.bride.bio || 'Cô gái dịu dàng, tinh tế và ngập tràn năng lượng tích cực, người thắp sáng mọi khoảnh khắc chung đôi.'}
              </p>

              {data.bride.parents && (
                <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 font-mono space-y-1">
                  <span className="text-[#C5A880] uppercase block">KÍNH BÁO NHÀ GÁI</span>
                  <p className="break-words leading-snug">Thân phụ: {data.bride.parents.father}</p>
                  <p className="break-words leading-snug">Thân mẫu: {data.bride.parents.mother}</p>
                </div>
              )}

              {data.bride.socials && (
                <div className="flex items-center gap-3 pt-2">
                  {data.bride.socials.phone && (
                    <a
                      href={`tel:${data.bride.socials.phone}`}
                      className="p-2 rounded-full bg-neutral-800 hover:bg-[#C5A880] hover:text-black transition-colors"
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
                      className="p-2 rounded-full bg-neutral-800 hover:bg-[#C5A880] hover:text-black transition-colors"
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
                      className="p-2 rounded-full bg-neutral-800 hover:bg-[#C5A880] hover:text-black transition-colors"
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

      {/* 4. Dress Code & Haute Guidance */}
      <section className="py-12 px-6 sm:px-12 bg-[#12110F] border-y border-[#C5A880]/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-2 text-center md:text-left"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
              ATELIER DRESS CODE
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl text-white">
              Bảng Màu Trang Phục Gợi Ý
            </h3>
            <p className="text-xs text-neutral-400 max-w-md">
              Để tạo nên những bức ảnh kỷ niệm hài hòa và ấn tượng nhất, quý khách có thể lựa chọn trang phục theo bảng màu dưới đây.
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            {[
              { name: 'Champagne Silk', bg: '#D8C5A8', text: '#1A1816' },
              { name: 'Black Velvet', bg: '#1F1E1D', text: '#FAF7F2' },
              { name: 'Warm Cream', bg: '#FAF5EE', text: '#2C2A29' },
              { name: 'Gold Accent', bg: '#C5A880', text: '#0E0D0C' },
            ].map((swatch, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ scale: 1.15, y: -4 }}
                className="text-center group"
              >
                <div
                  className="w-12 h-12 rounded-full border-2 border-neutral-700 shadow-md transition-transform mx-auto flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: swatch.bg }}
                />
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 block mt-2">
                  {swatch.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Itinerary (Events) with Runway Card Cascade */}
      <section id="editorial-itinerary" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-16"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
            THE PROGRAMME
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl font-light text-white">
            Lịch Trình Hôn Lễ
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto"
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
              whileHover={{ y: -6, borderColor: '#C5A880' }}
              className="bg-[#141210] border border-[#C5A880]/30 rounded-3xl p-8 space-y-6 relative overflow-hidden group transition-all shadow-xl"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] px-3 py-1 rounded bg-[#C5A880]/10 border border-[#C5A880]/30">
                  EVENT {idx + 1} • {evt.type.toUpperCase()}
                </span>
                <span className="font-serif-title italic text-2xl text-[#C5A880]">{evt.time}</span>
              </div>

              <div>
                <h3 className="font-serif-title text-3xl font-light text-white mb-1">
                  {evt.title}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Ngày {formatVietnameseDate(evt.date)}
                </p>
              </div>

              <div className="space-y-2 border-t border-neutral-800 pt-4 text-xs text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
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
                theme="gold"
                className="pt-2 border-t border-neutral-800"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Love Story (Chronicle Timeline) with Staggered Chapter Reveals */}
      {data.stories && data.stories.length > 0 && (
        <section className="py-20 px-6 sm:px-12 bg-[#12110F] border-t border-[#C5A880]/20">
          <div className="max-w-5xl mx-auto space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-3"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
                MEMOIRS & TIMELINE
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl font-light text-white">
                Chương Trình Tình Yêu
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto"
              />
            </motion.div>

            <div className="space-y-12">
              {data.stories.map((st, i) => (
                <motion.div
                  key={st.id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
                    i % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`md:col-span-5 ${
                      i % 2 === 1 ? 'md:order-2' : ''
                    } aspect-[4/3] rounded-2xl overflow-hidden border border-[#C5A880]/30 group`}
                  >
                    <img
                      src={st.image}
                      alt={st.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div
                    className={`md:col-span-7 space-y-3 ${
                      i % 2 === 1 ? 'md:order-1 md:text-right' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 text-xs font-mono text-[#C5A880]">
                      <span className="font-bold">CHAPTER {i + 1}</span>
                      <span>•</span>
                      <span>{st.year || st.dateStr}</span>
                    </div>
                    <h3 className="font-serif-title text-3xl text-white font-light">
                      {st.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-body max-w-xl">
                      {st.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. The Lookbook (Gallery) with Editorial Lift */}
      <section id="editorial-lookbook" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-12"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
            EDITORIAL LOOKBOOK
          </span>
          <h2 className="font-serif-title text-4xl sm:text-5xl font-light text-white">
            Bộ Ảnh Kỷ Niệm
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto"
          />
        </motion.div>

        {/* Filter chips */}
        <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Tất cả ảnh' },
            { id: 'prewedding', label: 'Pre-Wedding' },
            { id: 'ceremony', label: 'Lễ Thành Hôn' },
            { id: 'moments', label: 'Khoảnh Khắc' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setGalleryTab(cat.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase transition-all cursor-pointer ${
                galleryTab === cat.id
                  ? 'bg-[#C5A880] text-black font-bold shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid with Staggered Cascading Lift */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGallery.map((photo, index) => (
            <motion.div
              key={photo.id || index}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#C5A880]/60 cursor-pointer bg-neutral-900 transition-all shadow-lg"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Lookbook'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono text-[#C5A880] uppercase">
                  {photo.category || 'MOMENT'}
                </span>
                <p className="font-serif-title italic text-xs text-white truncate">
                  {photo.caption || `${data.groomName} & ${data.brideName}`}
                </p>
                <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. Gift Registry / QR Bank */}
      <section className="py-20 px-6 sm:px-12 bg-[#12110F] border-t border-[#C5A880]/20">
        <div className="max-w-3xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
              WEDDING GIFT REGISTRY
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-light text-white">
              Hộp Mừng Cưới & Chúc Phúc
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              {data.gift?.message || 'Sự hiện diện của quý khách là niềm hạnh phúc lớn nhất của chúng tôi. Nếu quý khách muốn gửi quà mừng từ xa:'}
            </p>
          </motion.div>

          {/* Toggle Groom / Bride bank */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setActiveBankTab('groom')}
              className={`px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeBankTab === 'groom'
                  ? 'bg-[#C5A880] text-black font-bold shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              Mừng Chú Rể ({data.groomName})
            </button>
            <button
              onClick={() => setActiveBankTab('bride')}
              className={`px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeBankTab === 'bride'
                  ? 'bg-[#C5A880] text-black font-bold shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              Mừng Cô Dâu ({data.brideName})
            </button>
          </div>

          {/* Bank Info Card with 3D Reveal */}
          {(() => {
            const currentBank =
              activeBankTab === 'groom' ? data.gift?.groomBank : data.gift?.brideBank;
            if (!currentBank || !currentBank.bankName) {
              return (
                <div className="p-8 text-center text-xs text-neutral-500 bg-[#181614] rounded-2xl border border-neutral-800">
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
                className="bg-[#181614] border border-[#C5A880]/40 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center gap-8"
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
                    <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition-opacity">
                      Phóng to QR
                    </div>
                  </div>
                )}

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block">
                    {currentBank.bankName}
                  </span>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="font-mono text-2xl font-bold text-white tracking-wider">
                      {currentBank.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopyAccount(currentBank.accountNumber)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#C5A880] hover:text-black transition-colors text-neutral-300 cursor-pointer"
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

      {/* 9. Atelier RSVP Form */}
      <section id="editorial-rsvp" className="py-20 px-6 sm:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#141210] border border-[#C5A880]/40 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl"
        >
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
              R.S.V.P. CONFIRMATION
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-light text-white">
              Xác Nhận Tham Dự
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Để gia đình chuẩn bị chu đáo nhất, xin vui lòng phản hồi trước ngày hôn lễ.
            </p>
          </div>

          {rsvpSubmitted ? (
            <div className="p-8 rounded-2xl bg-[#1C1A17] border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-2xl text-white">
                Đã Nhận Được Phản Hồi!
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Chân thành cảm ơn bạn đã xác nhận. {data.groomName} & {data.brideName} rất mong chờ được đón tiếp bạn!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitRSVP} className="space-y-6">
              {guestInfo.hasGuest && guestInfo.cleanName && (
                <div className="p-3.5 rounded-2xl bg-[#C5A880]/15 border border-[#C5A880]/40 text-xs text-[#F3EFEA] flex items-center gap-2.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0 animate-pulse" />
                  <span>
                    Xin chào <strong>{guestInfo.cleanName}</strong>! Tên của bạn đã được điền sẵn trên thiệp mời.
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
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-[#C5A880] text-sm text-white focus:outline-none transition-colors"
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
                    placeholder="VD: 0912 345 678"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-[#C5A880] text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Attendance Toggle */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Bạn Sẽ Đến Chung Vui Chứ?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(true)}
                    className={`py-3 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      rsvpAttending
                        ? 'bg-[#C5A880] text-black font-bold'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    Chắc chắn sẽ đến 🎉
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(false)}
                    className={`py-3 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                      !rsvpAttending
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    Rất tiếc không thể đến 💌
                  </button>
                </div>
              </div>

              {rsvpAttending && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Số lượng khách tham dự
                    </label>
                    <select
                      value={rsvpGuestsCount}
                      onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#C5A880]"
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
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#C5A880]"
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
                  Lời Nhắn Gửi Đôi Bạn
                </label>
                <textarea
                  rows={3}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Gửi gắm lời chúc hoặc ghi chú đặc biệt..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-[#C5A880] text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRSVP}
                className="w-full py-4 rounded-full bg-linear-to-r from-[#C5A880] via-[#E8D7BE] to-[#C5A880] text-black text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-[0_0_20px_rgba(197,168,128,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRSVP ? 'Đang gửi phản hồi...' : 'Gửi Xác Nhận Tham Dự'}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* 10. Wishes & Guestbook with Elegant Lift */}
      <section className="py-20 px-6 sm:px-12 bg-[#12110F] border-t border-[#C5A880]/20">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
              GUESTBOOK & BLESSINGS
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl font-light text-white">
              Sổ Lưu Bút Kỷ Niệm
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-[#C5A880] to-transparent mx-auto"
            />
          </motion.div>

          {/* Submit Wish Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmitWish}
            className="bg-[#181614] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={wishAuthor}
                onChange={(e) => setWishAuthor(e.target.value)}
                placeholder="Tên của bạn *"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#C5A880]"
              />
              <select
                value={wishRelation}
                onChange={(e) => setWishRelation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#C5A880]"
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
              placeholder="Gửi lời chúc tốt đẹp nhất đến cô dâu và chú rể..."
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#C5A880]"
            />
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmittingWish}
                className="px-6 py-2.5 rounded-full bg-[#C5A880] hover:bg-[#d5ba94] text-black text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
                Hãy là người đầu tiên gửi lời chúc tốt đẹp đến cặp đôi!
              </p>
            ) : (
              wishes.filter((w) => w.isApproved !== false).map((w) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="p-5 rounded-2xl bg-[#181614] border border-neutral-800/80 space-y-2 group hover:border-[#C5A880]/40 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-serif-title font-medium text-white text-base block">
                        {w.authorName}
                      </span>
                      <span className="text-[10px] font-mono text-[#C5A880] uppercase">
                        {w.relation || 'Khách mời'}
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

      {/* 11. Editorial Colophon / Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 text-center border-t border-[#C5A880]/20 space-y-4"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C5A880]">
          FIN DU RETROSPECTIVE
        </div>
        <h3 className="font-serif-title text-4xl font-light text-white">
          {data.groomName} <span className="font-script text-[#C5A880] text-2xl">&</span> {data.brideName}
        </h3>
        <p className="text-xs text-neutral-400 font-serif-title italic">
          Cảm ơn quý khách đã trở thành một phần đặc biệt trong ngày trọng đại của chúng tôi.
        </p>
        <div className="text-[10px] font-mono text-neutral-600 pt-4 uppercase tracking-widest">
          L'Amour Wedding • Haute Couture Editorial
        </div>
      </motion.footer>

      {/* Modal QR code expand */}
      {expandedQr && (
        <div
          onClick={() => setExpandedQr(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141210] border border-[#C5A880] rounded-3xl p-6 max-w-sm w-full text-center space-y-4 animate-scaleUp"
          >
            <div className="flex justify-between items-center text-xs text-[#C5A880]">
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
              <p className="font-mono text-[#C5A880] text-base">{expandedQr.accountNumber}</p>
              <p className="text-[11px] text-neutral-400 uppercase">
                {expandedQr.accountHolder}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
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
