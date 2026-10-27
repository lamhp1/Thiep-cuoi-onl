import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Menu,
  X,
  Maximize2,
  ChevronDown,
  Mail,
  Send,
  User,
  Music,
  Flower2,
} from 'lucide-react';
import { WeddingData, WishMessage, GalleryPhoto } from '../../../types';
import { formatVietnameseDate } from '../../../lib/utils';
import { getWishes, submitWish, toggleWishLike } from '../../../services/wishesService';
import { LightboxModal } from '../../ui/LightboxModal';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { useToast } from '../../ui/Toast';
import {
  MinimalistLotus,
  ModernCloudLine,
  MiniSongHy,
  DongSonPattern,
  ModernChampagneDivider,
} from '../vietnamese-modern/VietnameseModernOrnaments';
import { VietnameseModernEnvelope } from '../vietnamese-modern/VietnameseModernEnvelope';
import { DualParallelTimeline } from '../vietnamese-modern/DualParallelTimeline';
import { ModernCalendarCard } from '../vietnamese-modern/ModernCalendarCard';
import { EmbossedRSVPForm } from '../vietnamese-modern/EmbossedRSVPForm';
import { LotusGiftSection } from '../vietnamese-modern/LotusGiftSection';
import { LotusPetalsFalling } from '../vietnamese-modern/LotusPetalsFalling';
import { ProgressiveLuxuryImage } from '../../ui/ProgressiveLuxuryImage';
import { CoupleNamesStacked } from '../common/CoupleNamesStacked';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import { SmartEventActions } from '../common/SmartEventActions';

interface VietnameseModernLuxuryTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function VietnameseModernLuxuryTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: VietnameseModernLuxuryTemplateProps) {
  const { showToast } = useToast();
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(!showEnvelopeImmediately);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [petalsActive, setPetalsActive] = useState(true);

  // Gallery state
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'prewedding' | 'ceremony' | 'moments'>('all');

  // Wishes state
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestWish, setGuestWish] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);

  useEffect(() => {
    setIsEnvelopeOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  // Load wishes
  useEffect(() => {
    let mounted = true;
    const fetchWishes = () => {
      if (data.id) {
        getWishes(data.id)
          .then((items) => {
            if (mounted) setWishes(items || []);
          })
          .catch((err) => {
            console.warn('Wishes load error:', err);
          });
      }
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

  const handlePostWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestWish.trim()) {
      showToast('Vui lòng điền tên và lời chúc của bạn', 'error');
      return;
    }

    setIsSubmittingWish(true);
    try {
      const newWish = await submitWish({
        weddingId: data.id,
        authorName: guestName.trim(),
        content: guestWish.trim(),
      });
      if (newWish && newWish.id) {
        setWishes((prev) => [newWish, ...prev]);
        setGuestWish('');
        showToast('Cảm ơn lời chúc tốt đẹp của quý khách!', 'success');
      }
    } catch (e) {
      // Local fallback
      const fallbackWish: WishMessage = {
        id: `wish-${Date.now()}`,
        weddingId: data.id,
        authorName: guestName.trim(),
        content: guestWish.trim(),
        createdAt: new Date().toISOString(),
        likesCount: 1,
      };
      setWishes((prev) => [fallbackWish, ...prev]);
      setGuestWish('');
      showToast('Đã ghi lại lời chúc mừng!', 'success');
    } finally {
      setIsSubmittingWish(false);
    }
  };

  const handleLikeWish = async (wishId: string) => {
    try {
      await toggleWishLike(data.id, wishId);
    } catch {
      setWishes((prev) =>
        prev.map((w) => (w.id === wishId ? { ...w, likesCount: (w.likesCount || 0) + 1 } : w))
      );
    }
  };

  // Filter gallery
  const filteredPhotos = (data.gallery || []).filter((photo) => {
    if (galleryFilter === 'all') return true;
    return photo.category === galleryFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#18181A] font-body relative selection:bg-[#63121D]/20 selection:text-[#63121D] overflow-x-hidden">
      {/* 1. Opening Luxury Envelope Curtain */}
      {!isEnvelopeOpened && (
        <VietnameseModernEnvelope
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Minh Anh'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Ngọc Mai'}
          weddingDate={formatVietnameseDate(data.weddingDate)}
          musicUrl={data.musicUrl}
          onOpen={() => setIsEnvelopeOpened(true)}
        />
      )}

      {/* Falling Lotus Petals Animation (Hiệu ứng cánh sen rơi) */}
      <LotusPetalsFalling />

      {/* Floating Replay Envelope Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        <button
          onClick={() => setIsEnvelopeOpened(false)}
          className="w-11 h-11 rounded-full bg-[#63121D] text-[#D8BE87] border border-[#D8BE87]/60 shadow-xl flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          title="Mở lại phong bì thiệp cưới"
        >
          <Mail className="w-5 h-5 text-[#F8F4EC]" />
        </button>

        {/* Floating Music Player */}
        <FloatingMusicPlayer musicUrl={data.musicUrl} />
      </div>

      {/* 2. Sleek Sticky Header Navigation (Solid non-transparent background) */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE] border-b border-[#D8BE87]/50 shadow-xs transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Logo & Mini Song Hy */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#63121D] border border-[#D8BE87] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <MiniSongHy className="w-4 h-4 text-[#F8F4EC]" />
            </div>
            <div className="text-left">
              <span className="font-serif-title font-bold text-base sm:text-lg tracking-wider text-[#18181A] block leading-tight">
                {data.groomName || data.groom?.fullName || data.groom?.name || 'Minh Anh'} & {data.brideName || data.bride?.fullName || data.bride?.name || 'Ngọc Mai'}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C8275] block">
                VIETNAMESE MODERN LUXURY
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wider text-[#5A554E] uppercase">
            <a href="#couple" className="hover:text-[#63121D] transition-colors">
              Cặp Đôi
            </a>
            {data.stories && data.stories.length > 0 && (
              <a href="#story-dual-timeline" className="hover:text-[#63121D] transition-colors">
                Chuyện Tình Yêu
              </a>
            )}
            <a href="#wedding-date-calendar" className="hover:text-[#63121D] transition-colors">
              Lịch Cưới
            </a>
            <a href="#events" className="hover:text-[#63121D] transition-colors">
              Sự Kiện
            </a>
            <a href="#gallery" className="hover:text-[#63121D] transition-colors">
              Album Ảnh
            </a>
            <a href="#rsvp-embossed" className="hover:text-[#63121D] transition-colors">
              Phúc Đáp
            </a>
            <a href="#gift-box" className="hover:text-[#63121D] transition-colors">
              Mừng Cưới
            </a>
            <a href="#wishes" className="hover:text-[#63121D] transition-colors">
              Sổ Lưu Bút
            </a>
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="#rsvp-embossed"
              className="px-3.5 py-1.5 rounded-full bg-[#63121D] text-[#F8F4EC] text-[11px] font-semibold tracking-wider uppercase"
            >
              RSVP
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#18181A] rounded-lg hover:bg-neutral-200/50 transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="lg:hidden bg-[#F8F4EC] border-b border-[#D8BE87]/40 px-6 py-5 space-y-4 text-xs font-semibold uppercase tracking-wider text-[#5A554E]"
            >
              <a
                href="#couple"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#63121D]"
              >
                Cặp Đôi & Gia Đình
              </a>
              {data.stories && data.stories.length > 0 && (
                <a
                  href="#story-dual-timeline"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#63121D]"
                >
                  Chuyện Tình Yêu (Dual Timeline)
                </a>
              )}
              <a
                href="#wedding-date-calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#63121D]"
              >
                Lịch Cưới Hiện Đại
              </a>
              <a
                href="#events"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#63121D]"
              >
                Thời Gian & Địa Điểm
              </a>
              <a
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#63121D]"
              >
                Album Khoảnh Khắc
              </a>
              <a
                href="#rsvp-embossed"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#63121D]"
              >
                Xác Nhận Tham Dự (RSVP)
              </a>
              <a
                href="#gift-box"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#63121D]"
              >
                Hộp Mừng Cưới & Mã QR
              </a>
              <a
                href="#wishes"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-[#63121D]"
              >
                Sổ Lưu Bút
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* VIP Personalized Guest Greeting Banner */}
      <PersonalizedWelcomeBanner
        groomName={data.groom?.name || data.groomName || 'Minh Anh'}
        brideName={data.bride?.name || data.brideName || 'Ngọc Mai'}
        weddingDate={data.weddingDate || '20.12.2026'}
        accentColor="#D8BE87"
      />

      {/* 3. HERO SECTION */}
      {/* Requirement: Ảnh cưới + typography lớn: MINH ANH / NGỌC MAI / THE BEGINNING / OF FOREVER */}
      <section id="hero" className="relative pt-12 pb-20 sm:pt-16 sm:pb-32 overflow-hidden bg-[#F8F4EC]">
        {/* Subtle Slow Rotating Dong Son Bronze Drum Watermark in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-4">
          <div className="animate-[spin_120s_linear_infinite]">
            <DongSonPattern className="w-[850px] h-[850px] text-[#18181A]" opacity={0.6} />
          </div>
        </div>

        {/* Minimalist Cloud Lines in corners */}
        <div className="absolute top-10 left-8 pointer-events-none opacity-25">
          <ModernCloudLine className="w-28 h-12 text-[#D8BE87]" />
        </div>
        <div className="absolute top-16 right-8 pointer-events-none opacity-20 -scale-x-100">
          <ModernCloudLine className="w-32 h-14 text-[#D8BE87]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Top Tagline */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#D8BE87]/60 shadow-xs">
              <MiniSongHy className="w-3.5 h-3.5 text-[#63121D]" />
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#63121D] uppercase">
                Save Our Date • {formatVietnameseDate(data.weddingDate)}
              </span>
            </div>
          </div>

          {/* Large Editorial Typography: MINH ANH / NGỌC MAI / THE BEGINNING / OF FOREVER */}
          <div className="text-center space-y-1 mb-10 w-full max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <CoupleNamesStacked
                groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'MINH ANH'}
                brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'NGỌC MAI'}
                variant="hero-xl"
                textColor="#18181A"
                heartColor="#D8BE87"
                brideClassName="text-[#63121D]"
                idPrefix="vm-luxury-hero"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="pt-4"
            >
              <span className="font-body text-xs sm:text-sm md:text-base tracking-[0.35em] text-[#8C8275] uppercase block font-semibold">
                THE BEGINNING
              </span>
              <span className="font-serif-title text-base sm:text-lg md:text-xl tracking-[0.25em] text-[#18181A] uppercase block font-bold mt-0.5">
                OF FOREVER
              </span>
            </motion.div>
          </div>

          {/* Central Wedding Photo with Fine Champagne Bevel & Lotus Accents */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="max-w-3xl mx-auto relative group"
          >
            {/* Outer Frame (Solid white card with champagne border) */}
            <div className="relative rounded-3xl p-3 sm:p-4 bg-[#FFFFFF] shadow-2xl border-2 border-[#D8BE87]">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-[#D8BE87]/40 bg-[#EFE8DC]">
                <ProgressiveLuxuryImage
                  src={data.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85'}
                  alt="Ảnh cưới Minh Anh & Ngọc Mai"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority={true}
                />

                {/* Soft Bottom Gradient & Quote */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3.5 sm:p-8 pointer-events-none">
                  <p className="text-white font-serif-title text-xs sm:text-lg italic tracking-wide max-w-xl mx-auto text-center leading-relaxed break-words">
                    "{data.romanticQuote || 'Tình yêu không chỉ là nhìn nhau, mà là cùng nhau nhìn về một hướng.'}"
                  </p>
                </div>
              </div>

              {/* Minimalist Corner Lotus Watermarks */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#D8BE87] flex items-center justify-center shadow-md">
                <MinimalistLotus className="w-6 h-6 text-[#63121D]" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#D8BE87] flex items-center justify-center shadow-md">
                <MinimalistLotus className="w-6 h-6 text-[#63121D]" />
              </div>
            </div>
          </motion.div>

          {/* Quick Action Scroll Hint */}
          <div className="text-center mt-12">
            <a
              href="#couple"
              className="inline-flex flex-col items-center gap-1 text-[11px] font-semibold tracking-widest text-[#8C8275] uppercase hover:text-[#63121D] transition-colors"
            >
              <span>Khám phá chuyện tình</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-[#D8BE87]" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. COUPLE & FAMILY SECTION (GIA ĐÌNH HAI BÊN & CẶP ĐÔI) */}
      <section id="couple" className="py-20 sm:py-28 bg-[#F2ECE1] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63121D]/10 text-[#63121D] text-xs font-semibold uppercase tracking-[0.2em]">
              <MiniSongHy className="w-3.5 h-3.5 text-[#63121D]" />
              <span>Gia Đình &amp; Duyên Định</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#18181A]">
              Kính Báo Hai Họ
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#6E665A]">
              Với sự đồng thuận và phúc lành từ gia đình hai bên nội ngoại
            </p>
          </div>

          {/* Couple Cards Grid with scroll animation */}
          <div className="grid grid-cols-2 gap-3 sm:gap-8 md:gap-12 items-stretch">
            {/* Groom Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 border sm:border-2 border-[#D8BE87] shadow-xl relative overflow-hidden flex flex-col"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-6 text-center sm:text-left">
                <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden border sm:border-2 border-[#D8BE87] shadow-md shrink-0 bg-[#FAF7F2]">
                  <ProgressiveLuxuryImage
                    src={data.groom?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                    alt={`Chú rể ${data.groomName || 'chú rể'}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[8.5px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-[0.25em] text-[#8C8275] block whitespace-nowrap">
                    Nhà Trai • Chú Rể
                  </span>
                  <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl font-bold text-[#18181A] mt-0.5 leading-tight">
                    {data.groom?.fullName || data.groomName || 'Chú Rể'}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-[#63121D] font-medium block break-words leading-tight">
                    Kỹ sư công nghệ sáng tạo
                  </span>
                </div>
              </div>

              {/* Parents */}
              <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-xl bg-[#FAF7F2] border border-[#D8BE87]/40 text-[9.5px] sm:text-xs text-[#5A554E] space-y-0.5 sm:space-y-1 mb-2.5 sm:mb-4">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8C8275] block">
                  Thân phụ &amp; Thân mẫu
                </span>
                <p className="break-words leading-snug">
                  <strong>{data.groom?.parents?.father || 'Thân phụ Chú rể'}</strong>
                </p>
                <p className="break-words leading-snug">
                  <strong>{data.groom?.parents?.mother || 'Thân mẫu Chú rể'}</strong>
                </p>
              </div>

              <p className="font-body text-[10.5px] sm:text-xs md:text-sm text-[#5A554E] leading-relaxed italic break-words flex-1">
                "{data.groom?.bio || `Người luôn kiên nhẫn lắng nghe và luôn mang lại nụ cười bình yên cho ${data.brideName || data.bride?.name || 'người thương'} trong mọi khoảnh khắc.`}"
              </p>
            </motion.div>

            {/* Bride Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 border sm:border-2 border-[#D8BE87] shadow-xl relative overflow-hidden flex flex-col"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-6 text-center sm:text-left">
                <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden border sm:border-2 border-[#D8BE87] shadow-md shrink-0 bg-[#FAF7F2]">
                  <ProgressiveLuxuryImage
                    src={data.bride?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                    alt={`Cô dâu ${data.brideName || 'cô dâu'}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[8.5px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-[0.25em] text-[#63121D] block whitespace-nowrap">
                    Nhà Gái • Cô Dâu
                  </span>
                  <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl font-bold text-[#63121D] mt-0.5 leading-tight">
                    {data.bride?.fullName || data.brideName || 'Cô Dâu'}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-[#18181A] font-medium block break-words leading-tight">
                    Nhà thiết kế nội thất
                  </span>
                </div>
              </div>

              {/* Parents */}
              <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-xl bg-[#FAF7F2] border border-[#D8BE87]/40 text-[9.5px] sm:text-xs text-[#5A554E] space-y-0.5 sm:space-y-1 mb-2.5 sm:mb-4">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8C8275] block">
                  Thân phụ &amp; Thân mẫu
                </span>
                <p className="break-words leading-snug">
                  <strong>{data.bride?.parents?.father || 'Ông Trần Quốc Dũng'}</strong>
                </p>
                <p className="break-words leading-snug">
                  <strong>{data.bride?.parents?.mother || 'Bà Hoàng Kim Oanh'}</strong>
                </p>
              </div>

              <p className="font-body text-[10.5px] sm:text-xs md:text-sm text-[#5A554E] leading-relaxed italic break-words flex-1">
                "{data.bride?.bio || 'Tâm hồn mơ mộng và ấm áp. Thích làm bánh, cắm hoa và cùng Minh Anh khám phá những miền đất mới.'}"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. DUAL PARALLEL TIMELINE (Story Section) */}
      {data.stories && data.stories.length > 0 && (
        <DualParallelTimeline
          stories={data.stories}
          groomName={data.groom?.name || 'Minh Anh'}
          brideName={data.bride?.name || 'Ngọc Mai'}
        />
      )}

      {/* 6. WEDDING DATE CALENDAR (Lịch Việt Nam Hiện Đại) */}
      {/* Requirement: Ngày cưới hiển thị như lịch Việt Nam hiện đại: THÁNG 12 / 2026, 20, SUNDAY */}
      <ModernCalendarCard
        weddingDateStr={data.weddingDate || '2026-12-20'}
        weddingDateTime={data.weddingDateTime || '2026-12-20T10:00:00'}
        groomName={data.groom?.name || 'Minh Anh'}
        brideName={data.bride?.name || 'Ngọc Mai'}
        primaryLocation={data.events?.[0]?.locationName || 'Trung Tâm Yến Tiệc Hoàng Gia Imperial'}
        primaryAddress={data.events?.[0]?.address || '456 Đường Lê Lợi, TP. Huế'}
      />

      {/* 7. EVENTS TIMELINE (Lễ Cưới & Tiệc Mừng) */}
      <section id="events" className="py-20 sm:py-28 bg-[#F8F4EC] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63121D]/10 text-[#63121D] text-xs font-semibold uppercase tracking-[0.2em]">
              <Clock className="w-3.5 h-3.5 text-[#63121D]" />
              <span>Chương Trình Hôn Lễ</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#18181A]">
              Sự Kiện Trọng Đại
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#6E665A]">
              Trân trọng kính mời quý khách tham dự các nghi lễ thiêng liêng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(data.events || []).map((ev, index) => (
              <motion.div
                key={ev.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#D8BE87] shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#63121D] text-[#F8F4EC] text-[10px] font-bold uppercase tracking-wider">
                      {ev.type === 'ceremony' ? 'Lễ Thành Hôn' : 'Tiệc Cưới'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#63121D]">
                      <Clock className="w-3.5 h-3.5 text-[#D8BE87]" />
                      <span>{ev.time || '10:00'}</span>
                    </div>
                  </div>

                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#18181A] mb-2">
                    {ev.title}
                  </h3>

                  <div className="space-y-2 text-xs sm:text-sm text-[#5A554E] mb-6">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#63121D] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#18181A] block">{ev.locationName}</strong>
                        <span>{ev.address}</span>
                      </div>
                    </div>
                    {ev.description && (
                      <p className="text-xs text-[#8C8275] italic pt-1">
                        {ev.description}
                      </p>
                    )}
                  </div>
                </div>

                <SmartEventActions
                  event={{
                    title: ev.title,
                    date: ev.date || data.weddingDate || '2026-12-20',
                    time: ev.time || '10:00',
                    locationName: ev.locationName,
                    address: ev.address,
                    description: ev.description,
                    mapUrl: ev.mapUrl,
                  }}
                  theme="red"
                  className="pt-4 border-t border-[#D8BE87]/30"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GALLERY SECTION (Album Khoảnh Khắc) */}
      <section id="gallery" className="py-20 sm:py-28 bg-[#F2ECE1] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63121D]/10 text-[#63121D] text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-[#63121D]" />
              <span>Khoảnh Khắc Hạnh Phúc</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#18181A]">
              Album Ảnh Cưới
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#6E665A]">
              Từng khung hình lưu giữ trọn vẹn nụ cười và lời hẹn ước trăm năm
            </p>

            {/* Gallery Category Filter */}
            <div className="flex items-center justify-center gap-2 pt-3">
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'prewedding', label: 'Pre-Wedding' },
                { id: 'ceremony', label: 'Lễ Cưới' },
                { id: 'moments', label: 'Khoảnh Khắc' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGalleryFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    galleryFilter === tab.id
                      ? 'bg-[#63121D] text-white shadow-md'
                      : 'bg-[#FFFFFF] text-[#5A554E] hover:bg-[#FAF7F2] border border-[#D8BE87]/50 shadow-xs'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photos Grid with ProgressiveLuxuryImage and Scroll Animation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {filteredPhotos.map((photo, idx) => (
              <motion.div
                key={photo.id || idx}
                initial={{ opacity: 0, y: 25, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPhotoIndex(idx)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md cursor-pointer border-2 border-[#D8BE87]/60 bg-[#FFFFFF]"
              >
                <ProgressiveLuxuryImage
                  src={photo.url}
                  alt={photo.caption || `Ảnh cưới ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#18181A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="p-3 rounded-full bg-[#18181A]/80 text-[#D8BE87] border border-[#D8BE87]">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
                {photo.caption && (
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-[#18181A]/90 text-white text-[11px] truncate text-center border border-[#D8BE87]/40">
                    {photo.caption}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Lightbox Modal */}
          <LightboxModal
            photos={filteredPhotos}
            currentIndex={selectedPhotoIndex ?? 0}
            isOpen={selectedPhotoIndex !== null}
            onClose={() => setSelectedPhotoIndex(null)}
            onIndexChange={(newIdx) => setSelectedPhotoIndex(newIdx)}
          />
        </div>
      </section>

      {/* 9. EMBOSSED RSVP SECTION */}
      {/* Requirement: Form xuất hiện như một tấm thiệp nổi. Input có underline vàng. */}
      <EmbossedRSVPForm
        weddingId={data.id}
        groomName={data.groom?.name || 'Minh Anh'}
        brideName={data.bride?.name || 'Ngọc Mai'}
      />

      {/* 10. GIFT SECTION */}
      {/* Requirement: QR được đặt bên cạnh hoa sen line-art. */}
      <LotusGiftSection
        groomBank={data.gift?.groomBank}
        brideBank={data.gift?.brideBank}
        groomName={data.groom?.name || 'Minh Anh'}
        brideName={data.bride?.name || 'Ngọc Mai'}
      />

      {/* 11. WISHES GUESTBOOK SECTION (Solid warm linen background) */}
      <section id="wishes" className="py-20 sm:py-28 bg-[#F2ECE1] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto mb-12 space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#63121D]/10 text-[#63121D] text-xs font-semibold uppercase tracking-[0.2em]">
              <MessageCircle className="w-3.5 h-3.5 text-[#63121D]" />
              <span>Sổ Lưu Bút Online</span>
            </div>
            <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#18181A]">
              Lời Chúc Yêu Thương
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#6E665A]">
              Để lại những dòng lưu bút ngọt ngào dành tặng cô dâu và chú rể
            </p>
          </motion.div>

          {/* Wish Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#D8BE87] shadow-xl mb-12"
          >
            <form onSubmit={handlePostWish} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Tên của bạn hoặc xưng hô (ví dụ: Chị Lan Anh)..."
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#FAF7F2] px-4 py-3 rounded-xl text-xs sm:text-sm border border-[#D8BE87]/60 focus:border-[#63121D] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmittingWish}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#63121D] text-white hover:bg-[#7A1624] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-[#D8BE87]" />
                  <span>Gửi Lời Chúc</span>
                </button>
              </div>

              <textarea
                rows={3}
                required
                placeholder={`Viết lời chúc phúc ngọt ngào gửi gắm đến ${data.groomName || data.groom?.name || 'chú rể'} & ${data.brideName || data.bride?.name || 'cô dâu'}...`}
                value={guestWish}
                onChange={(e) => setGuestWish(e.target.value)}
                className="w-full bg-[#FAF7F2] p-4 rounded-xl text-xs sm:text-sm border border-[#D8BE87]/60 focus:border-[#63121D] focus:outline-none transition-colors resize-none"
              />
            </form>
          </motion.div>

          {/* Wishes List */}
          <div className="space-y-4">
            {wishes.filter((wish) => wish.isApproved !== false).length === 0 ? (
              <div className="p-6 text-center text-xs sm:text-sm text-[#8C8275] italic bg-white/80 rounded-2xl border border-[#D8BE87]/50">
                Chưa có lời chúc nào được hiển thị. Hãy là người đầu tiên gửi lời chúc phúc nhé!
              </div>
            ) : (
              wishes.filter((wish) => wish.isApproved !== false).map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="bg-[#FFFFFF] p-5 rounded-2xl border-2 border-[#D8BE87]/50 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <strong className="font-serif-title text-base font-bold text-[#18181A]">
                      {wish.authorName}
                    </strong>
                    <span className="text-[10px] text-[#8C8275]">
                      {wish.createdAt ? new Date(wish.createdAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-[#4A453F] leading-relaxed">
                    "{wish.content}"
                  </p>
                </div>

                <button
                  onClick={() => handleLikeWish(wish.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#D8BE87]/20 text-[#63121D] text-xs font-medium transition-colors cursor-pointer shrink-0 border border-[#D8BE87]/40"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#63121D]" />
                  <span>{wish.likesCount || 1}</span>
                </button>
              </motion.div>
            )))}
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="py-14 bg-[#18181A] text-[#FAF6EE] text-center border-t border-[#D8BE87]/40 relative overflow-hidden">
        {/* Subtle Dong Son in footer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <DongSonPattern className="w-[600px] h-[600px] text-[#D8BE87]" opacity={0.3} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#63121D] border border-[#D8BE87] flex items-center justify-center mx-auto shadow-lg">
            <MiniSongHy className="w-6 h-6 text-[#F8F4EC]" />
          </div>

          <h3 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-widest uppercase">
            {data.groom?.name || 'MINH ANH'} &amp; {data.bride?.name || 'NGỌC MAI'}
          </h3>

          <p className="font-body text-xs text-[#D8BE87] tracking-widest uppercase">
            Thank you for being part of our story
          </p>

          <div className="pt-6 border-t border-white/10 text-[11px] text-neutral-400">
            <span>Thiết kế &amp; Vận hành bởi L'Amour Wedding • Vietnamese Modern Luxury Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
