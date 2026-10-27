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
  ChevronDown,
  Settings,
  Phone,
  Facebook,
  Instagram,
  Sparkles,
  Maximize2,
  Flower2,
} from 'lucide-react';
import { WeddingData, BankAccount, WishMessage, GalleryPhoto } from '../../types';
import {
  calculateCountdown,
  formatVietnameseDate,
  copyToClipboard,
  createGoogleCalendarUrl,
} from '../../lib/utils';
import { submitRSVP } from '../../services/rsvpService';
import { getWishes, submitWish, toggleWishLike } from '../../services/wishesService';
import { LightboxModal } from '../ui/LightboxModal';
import { FloatingMusicPlayer } from '../ui/FloatingMusicPlayer';
import { CoupleNamesStacked } from './common/CoupleNamesStacked';
import { useToast } from '../ui/Toast';
import {
  SongHyIcon,
  LotusIcon,
  VietnameseCloudMotif,
  TraditionalCorner,
  RoyalEmblem,
} from './vietnamese/VietnameseOrnaments';
import { VietnameseEnvelope } from './vietnamese/VietnameseEnvelope';
import { PetalsFalling } from './vietnamese/PetalsFalling';
import { getGuestInfoFromUrl } from '../../lib/guestPersonalization';
import { PersonalizedWelcomeBanner } from './common/PersonalizedWelcomeBanner';
import { SmartEventActions } from './common/SmartEventActions';

interface VietnameseLuxuryTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function VietnameseLuxuryTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: VietnameseLuxuryTemplateProps) {
  const { showToast } = useToast();
  const [isCurtainOpened, setIsCurtainOpened] = useState(!showEnvelopeImmediately);

  useEffect(() => {
    setIsCurtainOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(data.weddingDateTime || data.weddingDate)
  );

  // Nav state
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setWishAuthor((prev) => prev || guestInfo.rsvpPrefill);
    }
  }, [guestInfo.rsvpPrefill]);

  // Wishes State
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [wishAuthor, setWishAuthor] = useState('');
  const [wishRelation, setWishRelation] = useState('Bạn bè');
  const [wishContent, setWishContent] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);

  // Gallery & Lightbox State
  const [galleryTab, setGalleryTab] = useState<'all' | 'prewedding' | 'ceremony' | 'moments'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Floating petals toggle
  const [showPetals, setShowPetals] = useState(true);

  // Countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(data.weddingDateTime || data.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDateTime, data.weddingDate]);

  // Scroll listener for nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch wishes
  useEffect(() => {
    let mounted = true;
    const fetchWishes = () => {
      getWishes(data.id)
        .then((items) => {
          if (mounted) setWishes(items);
        })
        .catch((err) => {
          console.warn('Wishes load error:', err);
        });
    };

    fetchWishes();

    const handleUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail?.weddingId || detail.weddingId === data.id || data.id.includes(detail.weddingId) || detail.weddingId.includes(data.id)) {
        fetchWishes();
      }
    };

    window.addEventListener('lamour_wishes_updated', handleUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('lamour_wishes_updated', handleUpdated);
    };
  }, [data.id]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopy = async (accountNumber: string) => {
    const success = await copyToClipboard(accountNumber);
    if (success) {
      setCopiedAccount(accountNumber);
      showToast(`Đã sao chép số tài khoản: ${accountNumber}`, 'success');
      setTimeout(() => setCopiedAccount(null), 3000);
    } else {
      showToast('Không thể tự động sao chép, vui lòng thử lại', 'error');
    }
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      showToast('Vui lòng nhập họ và tên của bạn', 'error');
      return;
    }
    if (!rsvpPhone.trim()) {
      showToast('Vui lòng nhập số điện thoại liên hệ', 'error');
      return;
    }

    setIsSubmittingRSVP(true);
    try {
      await submitRSVP({
        weddingId: data.id,
        fullName: rsvpName.trim(),
        phone: rsvpPhone.trim(),
        attending: rsvpAttending,
        guestsCount: rsvpAttending ? rsvpGuestsCount : 0,
        guestOf: rsvpGuestOf,
        message: rsvpMessage.trim(),
      });

      if (rsvpAttending) {
        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#9E1B32', '#C8A45D', '#E5D1A1', '#FFFDF8'],
          });
        } catch {}
      }

      setRsvpSubmitted(true);
      showToast('Cảm ơn bạn đã gửi xác nhận tham dự!', 'success');
    } catch {
      showToast('Có lỗi xảy ra khi gửi xác nhận, vui lòng thử lại', 'error');
    } finally {
      setIsSubmittingRSVP(false);
    }
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishAuthor.trim()) {
      showToast('Vui lòng nhập tên của bạn', 'error');
      return;
    }
    if (!wishContent.trim()) {
      showToast('Vui lòng nhập lời chúc của bạn', 'error');
      return;
    }

    setIsSubmittingWish(true);
    try {
      const newWish = await submitWish({
        weddingId: data.id,
        authorName: wishAuthor.trim(),
        relation: wishRelation,
        content: wishContent.trim(),
      });

      setWishes([newWish, ...wishes]);
      setWishContent('');
      setWishAuthor('');
      showToast('Cảm ơn bạn đã gửi lời chúc phúc ý nghĩa!', 'success');
    } catch {
      showToast('Không thể gửi lời chúc, vui lòng thử lại', 'error');
    } finally {
      setIsSubmittingWish(false);
    }
  };

  const handleLikeWish = async (wishId: string) => {
    const newCount = await toggleWishLike(data.id, wishId);
    setWishes(wishes.map((w) => (w.id === wishId ? { ...w, likesCount: newCount } : w)));
  };

  const filteredPhotos =
    galleryTab === 'all' ? data.gallery : data.gallery.filter((p) => p.category === galleryTab);

  const activeBank = activeBankTab === 'groom' ? data.gift.groomBank : data.gift.brideBank;

  const quickWishList = [
    'Trăm năm hạnh phúc, bách niên giai lão! 💍',
    'Loan phụng hòa minh, gia đạo hưng thịnh! 🌸',
    'Chúc hai bạn mãi ngọt ngào và son sắt! ❤️',
    'Sớm đón quý tử, phúc lộc đầy nhà! 👶',
  ];

  return (
    <div
      id="vietnamese-luxury-template-root"
      className="relative min-h-screen bg-[#F7F1E5] text-[#5A4031] font-body selection:bg-[#9E1B32] selection:text-white"
    >
      {/* 1. Traditional Vietnamese Opening Envelope */}
      {!isCurtainOpened && (
        <VietnameseEnvelope
          groomName={data.groomName}
          brideName={data.brideName}
          weddingDate={data.events[0]?.date || data.weddingDate}
          musicUrl={data.musicUrl}
          onOpen={() => setIsCurtainOpened(true)}
        />
      )}

      {/* Atmospheric Falling Petals */}
      {showPetals && <PetalsFalling />}

      {/* Toggle Petals Pill (Fixed on Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowPetals(!showPetals)}
          className="p-2.5 rounded-full bg-[#FFFDF8]/90 hover:bg-[#FFFDF8] border border-[#C8A45D] text-[#9E1B32] shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title={showPetals ? 'Tắt cánh hoa rơi' : 'Bật cánh hoa rơi'}
        >
          <Flower2 className={`w-4 h-4 ${showPetals ? 'animate-spin' : 'opacity-50'}`} style={{ animationDuration: '12s' }} />
        </button>
      </div>

      {/* Floating Audio Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* 2. Top Navigation Bar */}
      <header
        id="vn-header-nav"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FFFDF8]/95 backdrop-blur-md shadow-md border-b border-[#C8A45D]/40 py-2.5 text-[#5A4031]'
            : 'bg-gradient-to-b from-[#7F1734]/80 via-[#7F1734]/40 to-transparent py-4 text-[#FFFDF8]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Song Hy & Couple Monogram */}
          <button
            onClick={() => scrollToSection('#hero')}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9E1B32] to-[#7F1734] border border-[#C8A45D] flex items-center justify-center text-[#E5D1A1] shadow">
              <SongHyIcon className="w-5 h-5 text-[#E5D1A1]" />
            </div>
            <div>
              <span className="font-serif-title text-base sm:text-lg font-bold tracking-wide text-[#9E1B32] group-hover:text-[#7F1734] transition-colors block">
                {data.groom.name} & {data.bride.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A45D] font-semibold block">
                Lễ Thành Hôn
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
            <button onClick={() => scrollToSection('#hero')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
              Trang Chủ
            </button>
            <button onClick={() => scrollToSection('#couple')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
              Đôi Uyên Ương
            </button>
            <button onClick={() => scrollToSection('#family')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
              Hai Họ
            </button>
            {data.stories && data.stories.length > 0 && (
              <button onClick={() => scrollToSection('#story')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
                Hành Trình
              </button>
            )}
            <button onClick={() => scrollToSection('#events')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
              Sự Kiện
            </button>
            <button onClick={() => scrollToSection('#gallery')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
              Album Ảnh
            </button>
            <button onClick={() => scrollToSection('#gift')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
              Mừng Cưới
            </button>
            <button onClick={() => scrollToSection('#rsvp')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
              RSVP
            </button>
            <button onClick={() => scrollToSection('#wishes')} className="hover:text-[#9E1B32] transition-colors cursor-pointer">
              Lời Chúc
            </button>
          </nav>

          {/* Right Action / Mobile Toggle */}
          <div className="flex items-center gap-2">
            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9E1B32] hover:bg-[#7F1734] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider shadow border border-[#C8A45D] cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Chỉnh Sửa</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#9E1B32] hover:bg-[#C8A45D]/10 cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#FFFDF8] border-b border-[#C8A45D]/40 px-6 py-4 shadow-xl"
            >
              <div className="flex flex-col gap-3 text-sm font-semibold text-[#5A4031]">
                <button onClick={() => scrollToSection('#hero')} className="text-left py-1 hover:text-[#9E1B32]">
                  Trang Chủ
                </button>
                <button onClick={() => scrollToSection('#couple')} className="text-left py-1 hover:text-[#9E1B32]">
                  Đôi Uyên Ương
                </button>
                <button onClick={() => scrollToSection('#family')} className="text-left py-1 hover:text-[#9E1B32]">
                  Kính Báo Hai Họ
                </button>
                {data.stories && data.stories.length > 0 && (
                  <button onClick={() => scrollToSection('#story')} className="text-left py-1 hover:text-[#9E1B32]">
                    Hành Trình Yêu Thương
                  </button>
                )}
                <button onClick={() => scrollToSection('#events')} className="text-left py-1 hover:text-[#9E1B32]">
                  Lịch Trình Hỷ Sự
                </button>
                <button onClick={() => scrollToSection('#gallery')} className="text-left py-1 hover:text-[#9E1B32]">
                  Album Ảnh Kỷ Niệm
                </button>
                <button onClick={() => scrollToSection('#gift')} className="text-left py-1 hover:text-[#9E1B32]">
                  Hộp Mừng Cưới
                </button>
                <button onClick={() => scrollToSection('#rsvp')} className="text-left py-1 hover:text-[#9E1B32]">
                  Xác Nhận Tham Dự (RSVP)
                </button>
                <button onClick={() => scrollToSection('#wishes')} className="text-left py-1 hover:text-[#9E1B32]">
                  Sổ Lưu Bút Chúc Phúc
                </button>
                {isOwnerMode && onNavigateToAdmin && (
                  <button
                    onClick={onNavigateToAdmin}
                    className="mt-2 py-2 px-4 rounded-xl bg-[#9E1B32] text-white text-center font-bold text-xs"
                  >
                    Mở Bảng Quản Trị
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* VIP Personalized Guest Greeting Banner */}
      <PersonalizedWelcomeBanner
        groomName={data.groomName || data.groom?.fullName || 'Chú Rể'}
        brideName={data.brideName || data.bride?.fullName || 'Cô Dâu'}
        weddingDate={data.weddingDate}
        accentColor="#C8A45D"
      />

      {/* 3. Hero Section */}
      <section
        id="hero"
        className="relative min-h-[95vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-b from-[#7F1734] via-[#9E1B32] to-[#7F1734]"
      >
        {/* Cover Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={data.coverImage}
            alt={`Lễ thành hôn ${data.groomName} & ${data.brideName}`}
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-105 animate-[pulse_15s_ease-in-out_infinite]"
            referrerPolicy="no-referrer"
          />
          {/* Traditional Crimson & Gold Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#7F1734]/95 via-[#9E1B32]/60 to-black/60" />
          {/* Traditional Royal Pattern Grid */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A45D_1px,transparent_1px)] [background-size:24px_24px]" />
          {/* Outer Border with Traditional Corner Accents */}
          <div className="absolute inset-4 sm:inset-8 border border-[#C8A45D]/40 rounded-2xl pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32 flex flex-col items-center justify-center text-[#FFFDF8]">
          {/* Royal Seal Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#7F1734]/80 backdrop-blur-md border border-[#C8A45D] text-[#E5D1A1] shadow-xl"
          >
            <SongHyIcon className="w-4 h-4 text-[#E5D1A1]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em]">
              Hỷ Sự Trăm Năm • Lễ Thành Hôn
            </span>
            <SongHyIcon className="w-4 h-4 text-[#E5D1A1]" />
          </motion.div>

          {/* Couple Names: 3-row layout Groom / Heart / Bride */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="my-3 w-full max-w-3xl mx-auto px-2"
          >
            <CoupleNamesStacked
              groomName={data.groomName}
              brideName={data.brideName}
              variant="hero"
              textColor="#FFFDF8"
              heartColor="#E5D1A1"
              groomClassName="drop-shadow-md"
              brideClassName="drop-shadow-md"
              idPrefix="vietnamese-luxury-hero"
            />
          </motion.div>

          {/* Romantic Quote */}
          {data.romanticQuote && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-4 max-w-xl text-sm sm:text-base md:text-lg font-serif-title italic text-[#FFFDF8]/90 leading-relaxed drop-shadow"
            >
              {data.romanticQuote}
            </motion.p>
          )}

          {/* Wedding Date & City Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-[#FFFDF8]"
          >
            <div className="flex items-center gap-2 bg-[#7F1734]/70 backdrop-blur-md px-4 py-2 rounded-full border border-[#C8A45D]/50 shadow">
              <Calendar className="w-4 h-4 text-[#C8A45D]" />
              <span>{formatVietnameseDate(data.weddingDate)}</span>
            </div>
            {data.city && (
              <div className="flex items-center gap-2 bg-[#7F1734]/70 backdrop-blur-md px-4 py-2 rounded-full border border-[#C8A45D]/50 shadow">
                <MapPin className="w-4 h-4 text-[#C8A45D]" />
                <span>{data.city}</span>
              </div>
            )}
          </motion.div>

          {/* Countdown Clock (Traditional Ivory & Gold Cards) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-10 w-full max-w-lg"
          >
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF8]/95 backdrop-blur-md border-2 border-[#C8A45D] shadow-2xl text-[#5A4031]">
              <div className="flex flex-col items-center">
                <span className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-bold text-[#9E1B32]">
                  {String(countdown.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#7F1734] mt-1">
                  Ngày
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-[#C8A45D]/40">
                <span className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-bold text-[#9E1B32]">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#7F1734] mt-1">
                  Giờ
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-[#C8A45D]/40">
                <span className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-bold text-[#9E1B32]">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#7F1734] mt-1">
                  Phút
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-[#C8A45D]/40">
                <span className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-bold text-[#9E1B32]">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#7F1734] mt-1">
                  Giây
                </span>
              </div>
            </div>
          </motion.div>

          {/* Scroll Down */}
          <button
            onClick={() => scrollToSection('#couple')}
            className="mt-12 text-[#E5D1A1] hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer animate-bounce"
            aria-label="Cuộn xuống xem thông tin"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">Khám phá</span>
            <ChevronDown className="w-5 h-5 text-[#C8A45D]" />
          </button>
        </div>
      </section>

      {/* 4. Couple Section (Đôi Uyên Ương) */}
      <section id="couple" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 text-[#9E1B32] mb-1">
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
            <span className="font-serif-title font-bold text-xs uppercase tracking-[0.25em]">
              Lương Duyên Tiền Định
            </span>
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#7F1734] tracking-wide uppercase">
            Đôi Uyên Ương
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A45D] mx-auto mt-4" />
        </motion.div>

        {/* Couple Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-8 md:gap-10 lg:gap-14 relative items-stretch">
          {/* Center Double Happiness Emblem for Desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-[#9E1B32] to-[#7F1734] border-2 border-[#C8A45D] items-center justify-center text-[#E5D1A1] shadow-2xl">
            <SongHyIcon className="w-7 h-7 text-[#E5D1A1]" />
          </div>

          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center p-3 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl bg-[#FFFDF8] border sm:border-2 border-[#C8A45D]/40 shadow-lg hover:shadow-2xl transition-all text-center relative group"
          >
            <TraditionalCorner position="top-left" className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 w-4 h-4 sm:w-7 sm:h-7 text-[#C8A45D]/60" />
            <TraditionalCorner position="bottom-right" className="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 w-4 h-4 sm:w-7 sm:h-7 text-[#C8A45D]/60" />

            {/* Avatar with Royal Double Ring */}
            <div className="relative mb-3 sm:mb-6">
              <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full p-1 sm:p-1.5 border sm:border-2 border-[#9E1B32] shadow-md group-hover:border-[#C8A45D] transition-colors bg-[#F7F1E5]">
                <img
                  src={data.groom.avatar}
                  alt={data.groom.fullName}
                  className="w-full h-full object-cover object-top rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9E1B32] to-[#7F1734] text-[#FFFDF8] text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest px-2.5 py-0.5 sm:px-5 sm:py-1.5 rounded-full shadow-lg border border-[#C8A45D] whitespace-nowrap">
                Chú Rể
              </span>
            </div>

            <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-bold text-[#7F1734] mt-1 sm:mt-2 leading-tight">
              {data.groom.fullName}
            </h3>

            {/* Parents Notice */}
            {data.groom.parents && (
              <div className="my-1.5 sm:my-2.5 text-[9.5px] sm:text-xs font-semibold text-[#9E1B32] italic bg-[#F7F1E5] px-2 sm:px-3.5 py-1.5 rounded-xl border border-[#C8A45D]/30 w-full">
                <p className="break-words leading-snug">Thân phụ: {data.groom.parents.father}</p>
                <p className="break-words leading-snug">Thân mẫu: {data.groom.parents.mother}</p>
              </div>
            )}

            <p className="text-[10.5px] sm:text-sm text-[#5A4031]/90 leading-relaxed my-2 sm:my-4 text-center line-clamp-4 sm:line-clamp-none flex-1">
              {data.groom.bio}
            </p>

            {/* Socials & Phone */}
            {data.groom.socials && (
              <div className="flex items-center gap-1.5 sm:gap-3 mt-auto pt-2 sm:pt-4 border-t border-[#C8A45D]/20 w-full justify-center text-[#9E1B32] flex-wrap">
                {data.groom.socials.phone && (
                  <a
                    href={`tel:${data.groom.socials.phone}`}
                    className="p-1.5 sm:p-2.5 rounded-full bg-[#F7F1E5] hover:bg-[#9E1B32] hover:text-white transition-colors"
                    title="Gọi điện cho chú rể"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
                {data.groom.socials.facebook && (
                  <a
                    href={data.groom.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 sm:p-2.5 rounded-full bg-[#F7F1E5] hover:bg-[#9E1B32] hover:text-white transition-colors"
                    title="Facebook chú rể"
                  >
                    <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
                {data.groom.socials.instagram && (
                  <a
                    href={data.groom.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 sm:p-2.5 rounded-full bg-[#F7F1E5] hover:bg-[#9E1B32] hover:text-white transition-colors"
                    title="Instagram chú rể"
                  >
                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center p-3 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl bg-[#FFFDF8] border sm:border-2 border-[#C8A45D]/40 shadow-lg hover:shadow-2xl transition-all text-center relative group"
          >
            <TraditionalCorner position="top-right" className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-4 h-4 sm:w-7 sm:h-7 text-[#C8A45D]/60" />
            <TraditionalCorner position="bottom-left" className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-4 h-4 sm:w-7 sm:h-7 text-[#C8A45D]/60" />

            {/* Avatar with Royal Double Ring */}
            <div className="relative mb-3 sm:mb-6">
              <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full p-1 sm:p-1.5 border sm:border-2 border-[#9E1B32] shadow-md group-hover:border-[#C8A45D] transition-colors bg-[#F7F1E5]">
                <img
                  src={data.bride.avatar}
                  alt={data.bride.fullName}
                  className="w-full h-full object-cover object-top rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9E1B32] to-[#7F1734] text-[#FFFDF8] text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest px-2.5 py-0.5 sm:px-5 sm:py-1.5 rounded-full shadow-lg border border-[#C8A45D] whitespace-nowrap">
                Cô Dâu
              </span>
            </div>

            <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-bold text-[#7F1734] mt-1 sm:mt-2 leading-tight">
              {data.bride.fullName}
            </h3>

            {/* Parents Notice */}
            {data.bride.parents && (
              <div className="my-1.5 sm:my-2.5 text-[9.5px] sm:text-xs font-semibold text-[#9E1B32] italic bg-[#F7F1E5] px-2 sm:px-3.5 py-1.5 rounded-xl border border-[#C8A45D]/30 w-full">
                <p className="break-words leading-snug">Thân phụ: {data.bride.parents.father}</p>
                <p className="break-words leading-snug">Thân mẫu: {data.bride.parents.mother}</p>
              </div>
            )}

            <p className="text-[10.5px] sm:text-sm text-[#5A4031]/90 leading-relaxed my-2 sm:my-4 text-center line-clamp-4 sm:line-clamp-none flex-1">
              {data.bride.bio}
            </p>

            {/* Socials & Phone */}
            {data.bride.socials && (
              <div className="flex items-center gap-1.5 sm:gap-3 mt-auto pt-2 sm:pt-4 border-t border-[#C8A45D]/20 w-full justify-center text-[#9E1B32] flex-wrap">
                {data.bride.socials.phone && (
                  <a
                    href={`tel:${data.bride.socials.phone}`}
                    className="p-1.5 sm:p-2.5 rounded-full bg-[#F7F1E5] hover:bg-[#9E1B32] hover:text-white transition-colors"
                    title="Gọi điện cho cô dâu"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
                {data.bride.socials.facebook && (
                  <a
                    href={data.bride.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 sm:p-2.5 rounded-full bg-[#F7F1E5] hover:bg-[#9E1B32] hover:text-white transition-colors"
                    title="Facebook cô dâu"
                  >
                    <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
                {data.bride.socials.instagram && (
                  <a
                    href={data.bride.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 sm:p-2.5 rounded-full bg-[#F7F1E5] hover:bg-[#9E1B32] hover:text-white transition-colors"
                    title="Instagram cô dâu"
                  >
                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 5. Family Section (Kính Báo Hai Bên Gia Đình) */}
      <section id="family" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFDF8] border-2 border-[#C8A45D] shadow-xl relative text-center">
          <TraditionalCorner position="top-left" className="absolute top-4 left-4 w-8 h-8 text-[#C8A45D]" />
          <TraditionalCorner position="top-right" className="absolute top-4 right-4 w-8 h-8 text-[#C8A45D]" />
          <TraditionalCorner position="bottom-left" className="absolute bottom-4 left-4 w-8 h-8 text-[#C8A45D]" />
          <TraditionalCorner position="bottom-right" className="absolute bottom-4 right-4 w-8 h-8 text-[#C8A45D]" />

          {/* Section Header */}
          <div className="mb-10">
            <p className="font-serif-title text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#9E1B32]">
              Hôn Lễ Thành Toàn
            </p>
            <h3 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold text-[#7F1734] mt-1">
              Kính Báo Hai Bên Gia Đình
            </h3>
            <div className="w-16 h-0.5 bg-[#C8A45D] mx-auto mt-3" />
          </div>

          {/* Two Families Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-center relative">
            {/* Divider for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[#C8A45D]/50 to-transparent -translate-x-1/2" />

            {/* Nhà Trai */}
            <div className="space-y-3 bg-[#F7F1E5]/50 p-6 rounded-2xl border border-[#C8A45D]/30">
              <span className="inline-block px-4 py-1 rounded-full bg-[#9E1B32] text-[#FFFDF8] text-xs font-bold uppercase tracking-widest">
                Đại Diện Nhà Trai
              </span>
              {data.groom.parents ? (
                <div className="space-y-1.5 pt-2">
                  <p className="text-sm font-semibold text-[#5A4031]">
                    Thân phụ: <span className="text-[#7F1734] font-bold">{data.groom.parents.father}</span>
                  </p>
                  <p className="text-sm font-semibold text-[#5A4031]">
                    Thân mẫu: <span className="text-[#7F1734] font-bold">{data.groom.parents.mother}</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-500 italic pt-2">Gia đình Chú Rể</p>
              )}
              <div className="pt-2 text-xs font-bold text-[#9E1B32] uppercase tracking-wider">
                Chú rể: {data.groom.fullName}
              </div>
            </div>

            {/* Nhà Gái */}
            <div className="space-y-3 bg-[#F7F1E5]/50 p-6 rounded-2xl border border-[#C8A45D]/30">
              <span className="inline-block px-4 py-1 rounded-full bg-[#9E1B32] text-[#FFFDF8] text-xs font-bold uppercase tracking-widest">
                Đại Diện Nhà Gái
              </span>
              {data.bride.parents ? (
                <div className="space-y-1.5 pt-2">
                  <p className="text-sm font-semibold text-[#5A4031]">
                    Thân phụ: <span className="text-[#7F1734] font-bold">{data.bride.parents.father}</span>
                  </p>
                  <p className="text-sm font-semibold text-[#5A4031]">
                    Thân mẫu: <span className="text-[#7F1734] font-bold">{data.bride.parents.mother}</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-500 italic pt-2">Gia đình Cô Dâu</p>
              )}
              <div className="pt-2 text-xs font-bold text-[#9E1B32] uppercase tracking-wider">
                Cô dâu: {data.bride.fullName}
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs font-serif-title italic text-[#5A4031]/80 max-w-xl mx-auto">
            “Kính mong quý quan viên hai họ, thân bằng quyến thuộc cùng chung vui và chúc phúc cho ngày hạnh phúc trăm năm của hai con chúng tôi.”
          </p>
        </div>
      </section>

      {/* 6. Love Story Timeline (Hành Trình Yêu Thương) */}
      {data.stories && data.stories.length > 0 && (
        <section id="story" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 text-[#9E1B32] mb-1">
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
            <span className="font-serif-title font-bold text-xs uppercase tracking-[0.25em]">
              Từ Lần Đầu Gặp Gỡ
            </span>
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#7F1734] tracking-wide uppercase">
            Hành Trình Yêu Thương
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A45D] mx-auto mt-4" />
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Golden Line */}
          <div className="absolute top-8 bottom-8 left-4 md:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#C8A45D]/20 via-[#C8A45D] to-[#C8A45D]/20 pointer-events-none" />

          <div className="space-y-12 sm:space-y-16">
            {data.stories.map((story, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Node Badge (Lotus / Heart) */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-[#9E1B32] border-2 border-[#C8A45D] shadow-md flex items-center justify-center text-[#E5D1A1]">
                    <LotusIcon className="w-4 h-4 text-[#E5D1A1]" />
                  </div>

                  {/* Photo */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-[#C8A45D]/50 shadow-lg group bg-[#FFFDF8]">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-56 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#9E1B32]/90 backdrop-blur-md text-[#FFFDF8] text-xs font-bold tracking-wider border border-[#C8A45D]">
                        {story.dateStr || story.year}
                      </div>
                    </div>
                  </div>

                  {/* Story Text Box */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF8] border border-[#C8A45D]/40 shadow-md">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#9E1B32]">
                        Cột mốc hạnh phúc
                      </span>
                      <h4 className="font-serif-title text-2xl font-bold text-[#7F1734] mt-1 mb-2">
                        {story.title}
                      </h4>
                      <p className="text-sm text-[#5A4031]/90 leading-relaxed font-body">
                        {story.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* 7. Wedding Events Section (Lịch Trình Hỷ Sự) */}
      <section id="events" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 text-[#9E1B32] mb-1">
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
            <span className="font-serif-title font-bold text-xs uppercase tracking-[0.25em]">
              Giờ Lành Khởi Sự
            </span>
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#7F1734] tracking-wide uppercase">
            Lịch Trình Hỷ Sự
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A45D] mx-auto mt-4" />
        </motion.div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {data.events.map((event, idx) => {
            const calUrl = createGoogleCalendarUrl(
              event.title,
              event.date,
              event.time,
              `${event.locationName}, ${event.address}`,
              event.description || 'Tham dự ngày vui thành hôn của chúng mình'
            );

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="relative p-8 sm:p-10 rounded-3xl bg-[#FFFDF8] border-2 border-[#C8A45D] shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <TraditionalCorner position="top-left" className="absolute top-3 left-3 w-7 h-7 text-[#C8A45D]/70" />
                <TraditionalCorner position="top-right" className="absolute top-3 right-3 w-7 h-7 text-[#C8A45D]/70" />

                {/* Event Type & Time */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#9E1B32] text-[#FFFDF8] border border-[#C8A45D]">
                      {event.type === 'ceremony' ? 'Lễ Gia Tiên / Vu Quy' : 'Tiệc Cưới Mừng Hạnh Phúc'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#9E1B32] font-bold">
                      <Clock className="w-4 h-4 text-[#C8A45D]" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#7F1734] mb-2">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-sm text-[#5A4031]/90 mb-5 leading-relaxed font-body">
                      {event.description}
                    </p>
                  )}

                  {/* Date & Location Details */}
                  <div className="space-y-2.5 py-4 border-y border-[#C8A45D]/30 text-xs sm:text-sm text-[#5A4031]">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#9E1B32] shrink-0" />
                      <span className="font-bold text-[#7F1734]">{event.date}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#9E1B32] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#7F1734]">{event.locationName}</p>
                        <p className="text-xs text-[#5A4031]/80 mt-0.5">{event.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Actions: Map, Grab/Be Ride, Add to Calendar */}
                <SmartEventActions
                  event={{
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    locationName: event.locationName,
                    address: event.address,
                    description: event.description,
                    mapUrl: event.mapUrl,
                  }}
                  theme="red"
                  className="mt-6 pt-4 border-t border-[#C8A45D]/30"
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 8. Gallery Section (Khoảnh Khắc Hạnh Phúc) */}
      <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-[#9E1B32] mb-1">
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
            <span className="font-serif-title font-bold text-xs uppercase tracking-[0.25em]">
              Ghi Dấu Kỷ Niệm
            </span>
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#7F1734] tracking-wide uppercase">
            Khoảnh Khắc Hạnh Phúc
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A45D] mx-auto mt-4" />
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'prewedding', label: 'Pre-Wedding' },
            { id: 'ceremony', label: 'Lễ Cưới' },
            { id: 'moments', label: 'Khoảnh Khắc' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setGalleryTab(cat.id as any)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer ${
                galleryTab === cat.id
                  ? 'bg-[#9E1B32] text-[#FFFDF8] shadow-md border border-[#C8A45D]'
                  : 'bg-[#FFFDF8] hover:bg-[#F7F1E5] text-[#5A4031] border border-[#C8A45D]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 6) * 0.08 }}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl border-2 border-[#C8A45D]/40 transition-all bg-[#FFFDF8]"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Ảnh cưới'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7F1734]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <div className="text-[#FFFDF8] flex items-center justify-between w-full">
                  <p className="text-xs sm:text-sm font-serif-title font-semibold truncate pr-2">
                    {photo.caption || 'Khoảnh khắc ngọt ngào'}
                  </p>
                  <Maximize2 className="w-4 h-4 text-[#E5D1A1] shrink-0" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <LightboxModal
          isOpen={lightboxOpen}
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={(idx) => setLightboxIndex(idx)}
        />
      </section>

      {/* 9. Wedding Gift Section (Hộp Mừng Cưới) */}
      <section id="gift" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#9E1B32] text-[#E5D1A1] shadow-lg border border-[#C8A45D] mb-3">
            <SongHyIcon className="w-6 h-6 text-[#E5D1A1]" />
          </div>
          <p className="font-serif-title text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#9E1B32]">
            Chúc Phúc Từ Xa
          </p>
          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#7F1734] tracking-wide uppercase">
            Hộp Mừng Cưới
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A45D] mx-auto mt-4" />

          <p className="mt-4 max-w-xl mx-auto text-sm font-body text-[#5A4031]/90 leading-relaxed">
            {data.gift.message ||
              'Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất dành cho chúng mình. Nếu quý khách muốn gửi chút tình cảm từ phương xa, có thể chuyển qua số tài khoản dưới đây.'}
          </p>
        </motion.div>

        {/* Tab Switcher (Chú Rể / Cô Dâu) */}
        <div className="inline-flex p-1.5 rounded-full bg-[#FFFDF8] border-2 border-[#C8A45D] shadow-md mb-8">
          <button
            onClick={() => setActiveBankTab('groom')}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer ${
              activeBankTab === 'groom'
                ? 'bg-[#9E1B32] text-[#FFFDF8] shadow'
                : 'text-[#5A4031] hover:text-[#9E1B32]'
            }`}
          >
            Mừng Chú Rể ({data.groom.name})
          </button>
          <button
            onClick={() => setActiveBankTab('bride')}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer ${
              activeBankTab === 'bride'
                ? 'bg-[#9E1B32] text-[#FFFDF8] shadow'
                : 'text-[#5A4031] hover:text-[#9E1B32]'
            }`}
          >
            Mừng Cô Dâu ({data.bride.name})
          </button>
        </div>

        {/* Active Bank Card */}
        {activeBank && (
          <motion.div
            key={activeBankTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF8] border-2 border-[#C8A45D] shadow-2xl relative max-w-lg mx-auto text-center"
          >
            <TraditionalCorner position="top-left" className="absolute top-3 left-3 w-7 h-7 text-[#C8A45D]" />
            <TraditionalCorner position="top-right" className="absolute top-3 right-3 w-7 h-7 text-[#C8A45D]" />
            <TraditionalCorner position="bottom-left" className="absolute bottom-3 left-3 w-7 h-7 text-[#C8A45D]" />
            <TraditionalCorner position="bottom-right" className="absolute bottom-3 right-3 w-7 h-7 text-[#C8A45D]" />

            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#F7F1E5] border border-[#C8A45D] flex items-center justify-center text-[#9E1B32]">
              <SongHyIcon className="w-8 h-8 text-[#9E1B32]" />
            </div>

            <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-[#7F1734]">
              {activeBank.bankName}
            </h4>

            {activeBank.note && (
              <p className="text-xs text-[#5A4031]/70 mt-0.5">{activeBank.note}</p>
            )}

            {/* Account Number Box */}
            <div className="my-6 p-4 rounded-2xl bg-[#F7F1E5] border border-[#C8A45D]/50 flex items-center justify-between gap-3">
              <div className="text-left overflow-hidden">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#9E1B32] block">
                  Số tài khoản
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#7F1734] truncate block">
                  {activeBank.accountNumber}
                </span>
              </div>
              <button
                onClick={() => handleCopy(activeBank.accountNumber)}
                className="px-3.5 py-2 rounded-xl bg-[#9E1B32] hover:bg-[#7F1734] text-[#FFFDF8] text-xs font-bold flex items-center gap-1.5 transition-all shadow shrink-0 cursor-pointer"
              >
                {copiedAccount === activeBank.accountNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#E5D1A1]" />
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

            <div className="text-sm font-semibold text-[#5A4031]">
              Chủ tài khoản: <span className="font-bold text-[#7F1734] uppercase">{activeBank.accountHolder}</span>
            </div>

            {/* QR Code */}
            {activeBank.qrCodeUrl && (
              <div className="mt-6 pt-6 border-t border-[#C8A45D]/30 flex flex-col items-center">
                <div
                  onClick={() => setExpandedQr(activeBank)}
                  className="p-3 rounded-2xl bg-white border-2 border-[#C8A45D] shadow-md cursor-pointer hover:scale-105 transition-transform"
                  title="Chạm để phóng to mã QR"
                >
                  <img
                    src={activeBank.qrCodeUrl}
                    alt={`Mã VietQR ${activeBank.bankName}`}
                    className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
                  />
                </div>
                <button
                  onClick={() => setExpandedQr(activeBank)}
                  className="mt-3 text-xs font-bold text-[#9E1B32] hover:text-[#7F1734] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Chạm để phóng to mã QR thanh toán</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* QR Code Expanded Modal */}
        <AnimatePresence>
          {expandedQr && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedQr(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 max-w-sm w-full border-2 border-[#C8A45D] text-center shadow-2xl relative cursor-default"
              >
                <button
                  onClick={() => setExpandedQr(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#F7F1E5] text-[#9E1B32] hover:bg-[#9E1B32] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <h4 className="font-serif-title text-xl font-bold text-[#7F1734] mb-1">
                  Mã Quét Mừng Cưới (VietQR)
                </h4>
                <p className="text-xs text-[#5A4031]/80 mb-4">
                  {expandedQr.bankName} • {expandedQr.accountHolder}
                </p>

                <div className="p-3 bg-white rounded-2xl border-2 border-[#C8A45D] shadow inline-block">
                  <img
                    src={expandedQr.qrCodeUrl}
                    alt="VietQR"
                    className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
                  />
                </div>

                <p className="text-xs text-[#5A4031]/80 mt-4">
                  Mở ứng dụng ngân hàng bất kỳ để quét mã chuyển khoản nhanh
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 10. RSVP Section (Xác Nhận Tham Dự) */}
      <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFDF8] border-2 border-[#C8A45D] shadow-2xl relative text-center">
          <TraditionalCorner position="top-left" className="absolute top-4 left-4 w-8 h-8 text-[#C8A45D]" />
          <TraditionalCorner position="top-right" className="absolute top-4 right-4 w-8 h-8 text-[#C8A45D]" />
          <TraditionalCorner position="bottom-left" className="absolute bottom-4 left-4 w-8 h-8 text-[#C8A45D]" />
          <TraditionalCorner position="bottom-right" className="absolute bottom-4 right-4 w-8 h-8 text-[#C8A45D]" />

          {/* Section Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-[#9E1B32] mb-1">
              <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
              <span className="font-serif-title font-bold text-xs uppercase tracking-[0.25em]">
                Trân Trọng Đón Tiếp
              </span>
              <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#7F1734] tracking-wide uppercase">
              Xác Nhận Tham Dự
            </h2>
            <div className="w-20 h-0.5 bg-[#C8A45D] mx-auto mt-4" />
            <p className="mt-3 text-sm text-[#5A4031]/80 max-w-md mx-auto">
              Sự hiện diện của bạn là niềm vinh hạnh to lớn cho gia đình chúng mình. Vui lòng xác nhận trước ngày cưới để chúng mình chuẩn bị đón tiếp chu đáo nhất!
            </p>
          </div>

          {rsvpSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 px-6 rounded-2xl bg-[#F7F1E5] border border-[#C8A45D] max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-[#9E1B32] text-[#FFFDF8] mx-auto flex items-center justify-center mb-4 shadow">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="font-serif-title text-2xl font-bold text-[#7F1734]">
                Xác Nhận Thành Công!
              </h4>
              <p className="text-sm text-[#5A4031] mt-2">
                Chúng mình đã nhận được phản hồi từ bạn. Rất mong chờ được đón tiếp bạn trong ngày vui trọng đại!
              </p>
              <button
                onClick={() => setRsvpSubmitted(false)}
                className="mt-6 px-6 py-2 rounded-full bg-[#9E1B32] text-[#FFFDF8] text-xs font-bold uppercase tracking-wider hover:bg-[#7F1734] transition-colors cursor-pointer"
              >
                Gửi Lại Phản Hồi Khác
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleRSVPSubmit} className="max-w-xl mx-auto space-y-5 text-left">
              {/* Personalized Guest Welcome Hint */}
              {guestInfo.hasGuest && (
                <div className="p-3.5 rounded-2xl bg-[#F7F1E5] border border-[#C8A45D] flex items-center gap-3 text-xs text-[#7F1734] shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#9E1B32] text-[#FFFDF8] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#E5D1A1]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#7F1734]">
                      Kính gửi {guestInfo.cleanName}
                    </p>
                    <p className="text-[11px] text-[#5A4031]/80">
                      Tên của quý khách đã được tự động điền sẵn. Chỉ cần 1 chạm để xác nhận số người tham dự.
                    </p>
                  </div>
                </div>
              )}

              {/* Họ & Tên */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7F1734] mb-1.5">
                  Họ và tên của bạn <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F1E5]/70 border border-[#C8A45D]/50 focus:border-[#9E1B32] focus:ring-2 focus:ring-[#9E1B32]/20 outline-none text-sm text-[#5A4031]"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7F1734] mb-1.5">
                  Số điện thoại <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F1E5]/70 border border-[#C8A45D]/50 focus:border-[#9E1B32] focus:ring-2 focus:ring-[#9E1B32]/20 outline-none text-sm text-[#5A4031]"
                />
              </div>

              {/* Xác nhận tham dự */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7F1734] mb-2">
                  Bạn có thể tham dự không?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(true)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      rsvpAttending
                        ? 'border-[#9E1B32] bg-[#9E1B32] text-white shadow'
                        : 'border-[#C8A45D]/40 bg-[#F7F1E5]/50 text-[#5A4031]'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Sẽ Tham Dự</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending(false)}
                    className={`p-3 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      !rsvpAttending
                        ? 'border-[#7F1734] bg-[#7F1734] text-white shadow'
                        : 'border-[#C8A45D]/40 bg-[#F7F1E5]/50 text-[#5A4031]'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Rất Tiếc Không Thể</span>
                  </button>
                </div>
              </div>

              {/* Số lượng khách đi cùng (nếu tham dự) */}
              {rsvpAttending && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7F1734] mb-1.5">
                      Số lượng người tham dự
                    </label>
                    <select
                      value={rsvpGuestsCount}
                      onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F1E5]/70 border border-[#C8A45D]/50 focus:border-[#9E1B32] focus:ring-2 focus:ring-[#9E1B32]/20 outline-none text-sm text-[#5A4031] font-semibold"
                    >
                      <option value={1}>1 người (Chỉ mình tôi)</option>
                      <option value={2}>2 người (Tôi và người thương)</option>
                      <option value={3}>3 người</option>
                      <option value={4}>4 người (Gia đình)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7F1734] mb-1.5">
                      Khách mời của ai?
                    </label>
                    <select
                      value={rsvpGuestOf}
                      onChange={(e) => setRsvpGuestOf(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F7F1E5]/70 border border-[#C8A45D]/50 focus:border-[#9E1B32] focus:ring-2 focus:ring-[#9E1B32]/20 outline-none text-sm text-[#5A4031] font-semibold"
                    >
                      <option value="both">Bạn của Cả Hai Họ</option>
                      <option value="groom">Khách của Nhà Trai ({data.groom.name})</option>
                      <option value="bride">Khách của Nhà Gái ({data.bride.name})</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Lời nhắn kèm */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7F1734] mb-1.5">
                  Lời nhắn gửi đến cặp đôi (Tùy chọn)
                </label>
                <textarea
                  rows={3}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Gửi lời nhắn nhủ thân tình..."
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F1E5]/70 border border-[#C8A45D]/50 focus:border-[#9E1B32] focus:ring-2 focus:ring-[#9E1B32]/20 outline-none text-sm text-[#5A4031]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingRSVP}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#9E1B32] via-[#7F1734] to-[#9E1B32] hover:from-[#7F1734] hover:to-[#9E1B32] text-[#FFFDF8] font-bold text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 border border-[#C8A45D] cursor-pointer"
              >
                {isSubmittingRSVP ? (
                  <span>Đang gửi xác nhận...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#E5D1A1]" />
                    <span>Gửi Xác Nhận Tham Dự</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 11. Guestbook / Wishes Section (Sổ Lưu Bút Chúc Phúc) */}
      <section id="wishes" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-[#9E1B32] mb-1">
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
            <span className="font-serif-title font-bold text-xs uppercase tracking-[0.25em]">
              Gửi Trao Yêu Thương
            </span>
            <LotusIcon className="w-6 h-6 text-[#9E1B32]" />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#7F1734] tracking-wide uppercase">
            Sổ Lưu Bút Chúc Phúc
          </h2>
          <div className="w-20 h-0.5 bg-[#C8A45D] mx-auto mt-4" />
          <p className="mt-3 text-sm text-[#5A4031]/80 max-w-md mx-auto">
            Hãy để lại những lời chúc tốt đẹp nhất để lưu giữ kỷ niệm trong ngày trọng đại của chúng mình nhé!
          </p>
        </motion.div>

        {/* Wish Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] border-2 border-[#C8A45D] shadow-xl mb-12 relative">
          <TraditionalCorner position="top-right" className="absolute top-3 right-3 w-7 h-7 text-[#C8A45D]" />

          <h3 className="font-serif-title text-xl font-bold text-[#7F1734] mb-4">
            Viết Lời Chúc Mừng Hạnh Phúc
          </h3>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickWishList.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setWishContent(preset)}
                className="px-3 py-1 rounded-full bg-[#F7F1E5] hover:bg-[#C8A45D]/20 text-[#7F1734] text-xs font-semibold border border-[#C8A45D]/40 transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          <form onSubmit={handleWishSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  required
                  value={wishAuthor}
                  onChange={(e) => setWishAuthor(e.target.value)}
                  placeholder="Tên của bạn *"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1E5]/70 border border-[#C8A45D]/50 focus:border-[#9E1B32] outline-none text-sm text-[#5A4031]"
                />
              </div>
              <div>
                <select
                  value={wishRelation}
                  onChange={(e) => setWishRelation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1E5]/70 border border-[#C8A45D]/50 focus:border-[#9E1B32] outline-none text-sm text-[#5A4031]"
                >
                  <option value="Bạn bè">Bạn bè thân thiết</option>
                  <option value="Họ hàng Nhà Trai">Họ hàng Nhà Trai</option>
                  <option value="Họ hàng Nhà Gái">Họ hàng Nhà Gái</option>
                  <option value="Đồng nghiệp">Đồng nghiệp</option>
                  <option value="Người thân">Người thân trong gia đình</option>
                </select>
              </div>
            </div>

            <div>
              <textarea
                rows={3}
                required
                value={wishContent}
                onChange={(e) => setWishContent(e.target.value)}
                placeholder="Nhập lời chúc phúc ngọt ngào..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#F7F1E5]/70 border border-[#C8A45D]/50 focus:border-[#9E1B32] outline-none text-sm text-[#5A4031]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingWish}
              className="px-6 py-2.5 rounded-full bg-[#9E1B32] hover:bg-[#7F1734] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest shadow border border-[#C8A45D] flex items-center gap-2 cursor-pointer transition-all"
            >
              {isSubmittingWish ? (
                <span>Đang gửi...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#E5D1A1]" />
                  <span>Gửi Lời Chúc Mừng</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Wishes List */}
        {wishes.filter((wish) => wish.isApproved !== false).length === 0 ? (
          <div className="p-8 text-center bg-[#FFFDF8] rounded-2xl border border-[#C8A45D]/40 text-sm text-[#5A4031]/70 italic max-w-md mx-auto">
            Chưa có lời chúc nào hiển thị. Hãy là người đầu tiên gửi lời chúc phúc nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {wishes.filter((wish) => wish.isApproved !== false).map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#C8A45D]/50 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#9E1B32] text-[#FFFDF8] flex items-center justify-center font-bold text-xs">
                        {wish.authorName.charAt(0) || 'B'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#7F1734]">{wish.authorName}</h4>
                        <span className="text-[10px] text-[#C8A45D] uppercase tracking-wider font-semibold">
                          {wish.relation || 'Bạn bè'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#5A4031]/60">
                      {new Date(wish.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-sm text-[#5A4031]/90 italic font-body mt-2 leading-relaxed">
                    “{wish.content}”
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#C8A45D]/20 flex items-center justify-end">
                  <button
                    onClick={() => handleLikeWish(wish.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#9E1B32] hover:text-[#7F1734] font-semibold cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{wish.likesCount || 0} yêu thích</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 12. Final Message & Footer (Lời Cảm Ơn) */}
      <footer
        id="footer"
        className="py-16 px-4 text-center border-t-2 border-[#C8A45D] bg-gradient-to-b from-[#FFFDF8] to-[#F7F1E5]"
      >
        <div className="max-w-md mx-auto">
          {/* Royal Seal Emblem */}
          <div className="relative mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-tr from-[#9E1B32] to-[#7F1734] border-2 border-[#C8A45D] flex items-center justify-center shadow-lg">
            <SongHyIcon className="w-8 h-8 text-[#E5D1A1]" />
          </div>

          <p className="font-serif-title text-3xl sm:text-4xl text-[#7F1734] font-bold mb-1">
            Chân Thành Cảm Ơn
          </p>

          <p className="font-serif-title text-xl text-[#9E1B32] font-semibold tracking-wider my-2">
            {data.groomName} & {data.brideName}
          </p>

          <div className="flex items-center justify-center gap-2 text-[#C8A45D] my-3">
            <span className="h-px w-10 bg-[#C8A45D]/50" />
            <LotusIcon className="w-4 h-4 text-[#C8A45D]" />
            <span className="h-px w-10 bg-[#C8A45D]/50" />
          </div>

          <p className="text-xs text-[#5A4031]/80 mb-6 tracking-wide leading-relaxed font-body">
            Sự hiện diện và những lời chúc phúc ấm áp của quý khách trong ngày trọng đại là món quà quý giá nhất đối với chúng mình!
          </p>

          <p className="text-[11px] text-[#5A4031]/60 font-body">
            © 2026 {data.groomName} & {data.brideName} • Thiết kế theo phong cách Hỷ Sự Việt Nam
          </p>
        </div>
      </footer>
    </div>
  );
}
