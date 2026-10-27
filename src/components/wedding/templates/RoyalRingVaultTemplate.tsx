import React, { useState, useEffect, useMemo } from 'react';
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
  Send,
  Sparkles,
  Maximize2,
  Share2,
  Music,
  Eye,
  Camera,
  ChevronDown,
  Wine,
  Award,
  Filter,
} from 'lucide-react';
import { WeddingData, BankAccount, WishMessage, GalleryPhoto } from '../../../types';
import { calculateCountdown, formatVietnameseDate, copyToClipboard } from '../../../lib/utils';
import { submitRSVP } from '../../../services/rsvpService';
import { getWishes, submitWish } from '../../../services/wishesService';
import { LightboxModal } from '../../ui/LightboxModal';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { useToast } from '../../ui/Toast';
import { SmartEventActions } from '../common/SmartEventActions';
import { RoyalRingVaultOpening } from '../royal-vault/RoyalRingVaultOpening';
import { UniversalQRZoomModal } from '../common/QRZoomModal';
import { RoyalGoldParticlesCanvas } from '../royal-vault/RoyalGoldParticlesCanvas';
import { InteractiveRingExchangeWidget } from '../royal-vault/InteractiveRingExchangeWidget';
import { VirtualChampagneToastWidget } from '../royal-vault/VirtualChampagneToastWidget';
import { RoyalEnvelopeGiftCard } from '../royal-vault/RoyalEnvelopeGiftCard';
import { RoyalScrollProgress } from '../royal-vault/RoyalScrollProgress';
import { RoyalScrollSection } from '../royal-vault/RoyalScrollSection';
import { RoyalTiltCard } from '../royal-vault/RoyalTiltCard';
import { RoyalScrollRingSentinel } from '../royal-vault/RoyalScrollRingSentinel';
import { RoyalSparkleCursor } from '../royal-vault/RoyalSparkleCursor';
import { RoyalWaxSealHero } from '../royal-vault/RoyalWaxSealHero';

interface RoyalRingVaultTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function RoyalRingVaultTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: RoyalRingVaultTemplateProps) {
  const { showToast } = useToast();

  // 3D Vault Opening State
  const [isVaultOpened, setIsVaultOpened] = useState(!showEnvelopeImmediately);
  const [showVaultModal, setShowVaultModal] = useState(false);

  useEffect(() => {
    setIsVaultOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  // Countdown timer
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(data.weddingDateTime || data.weddingDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(data.weddingDateTime || data.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDateTime, data.weddingDate]);

  // Bank & Gift
  const [activeBankTab, setActiveBankTab] = useState<'groom' | 'bride'>('groom');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [expandedQr, setExpandedQr] = useState<BankAccount | null>(null);

  // Guest Information from URL
  const guestInfo = useMemo(() => {
    if (typeof window === 'undefined') return { cleanName: '', displayName: 'Quý Khách Quý & Người Thương' };
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('guest') || params.get('to') || params.get('name') || '';
    if (raw.trim()) {
      return { cleanName: raw.trim(), displayName: raw.trim() };
    }
    return { cleanName: '', displayName: 'Quý Khách Quý & Người Thương' };
  }, []);

  // Gallery Lightbox & Filter
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'ceremony' | 'couples'>('all');

  // Wishes state
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [newWishName, setNewWishName] = useState(guestInfo.cleanName || '');
  const [newWishContent, setNewWishContent] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);

  useEffect(() => {
    const loadWishes = async () => {
      const list = await getWishes(data.id || data.slug || 'demo');
      setWishes(list);
    };
    loadWishes();
  }, [data.id, data.slug]);

  // RSVP Form state
  const [rsvpName, setRsvpName] = useState(guestInfo.cleanName || '');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no'>('yes');
  const [rsvpGuestsCount, setRsvpGuestsCount] = useState('1');
  const [rsvpNote, setRsvpNote] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  const groomName = data.groomName || data.groom?.name || 'Minh Anh';
  const brideName = data.brideName || data.bride?.name || 'Ngọc Mai';
  const weddingDateStr = formatVietnameseDate(data.weddingDateTime || data.weddingDate);

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    setCopiedAccount(text);
    showToast(`Đã sao chép ${label}!`, 'success');
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishContent.trim()) {
      showToast('Vui lòng nhập tên và lời chúc của bạn!', 'error');
      return;
    }
    setIsSubmittingWish(true);
    try {
      const created = await submitWish({
        weddingId: data.id || data.slug || 'demo',
        authorName: newWishName.trim(),
        content: newWishContent.trim(),
      });
      if (created) {
        setWishes((prev) => [created, ...prev]);
        setNewWishContent('');
        showToast('Cảm ơn lời chúc quý báu của bạn!', 'success');
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#E8B498', '#FCE4BE', '#ffffff'],
        });
      }
    } catch {
      showToast('Không thể gửi lời chúc lúc này, vui lòng thử lại!', 'error');
    } finally {
      setIsSubmittingWish(false);
    }
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      showToast('Vui lòng nhập tên của bạn!', 'error');
      return;
    }
    setIsSubmittingRsvp(true);
    try {
      await submitRSVP({
        weddingId: data.id || data.slug || 'demo',
        fullName: rsvpName.trim(),
        phone: rsvpPhone.trim(),
        attending: rsvpAttending === 'yes',
        guestsCount: parseInt(rsvpGuestsCount, 10) || 1,
        guestOf: 'both',
        message: rsvpNote.trim(),
      });
      showToast('Xác nhận tham dự thành công! Chúng mình rất mong được đón tiếp bạn.', 'success');
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#E8B498', '#DCA389', '#FAF6EE'],
      });
    } catch {
      showToast('Gửi xác nhận thất bại, vui lòng thử lại sau!', 'error');
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const activeBank = useMemo(() => {
    if (activeBankTab === 'groom') {
      return (
        data.gift?.groomBank || {
          bankName: 'MB Bank',
          accountNumber: '999999999',
          accountHolder: groomName.toUpperCase(),
          qrCodeUrl: '',
        }
      );
    }
    return (
      data.gift?.brideBank || {
        bankName: 'Techcombank',
        accountNumber: '888888888',
        accountHolder: brideName.toUpperCase(),
        qrCodeUrl: '',
      }
    );
  }, [activeBankTab, data.gift?.groomBank, data.gift?.brideBank, groomName, brideName]);

  // Story Milestones
  const storyMilestones = useMemo(() => {
    if (data.stories && data.stories.length > 0) return data.stories;
    return [
      {
        id: 's1',
        year: '2021',
        title: 'Ánh Nhìn Đầu Tiên',
        content: 'Một buổi chiều thu Hà Nội trong trẻo, giữa quán cà phê nhỏ, định mệnh đã cho chúng mình gặp nhau.',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 's2',
        year: '2023',
        title: 'Chuyến Đi Của Tình Yêu',
        content: 'Cùng nhau đặt chân đến những vùng đất mới, vượt qua thử thách và nhận ra đối phương là mảnh ghép hoàn hảo.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 's3',
        year: '2026',
        title: 'Chiếc Nhẫn Cầu Hôn',
        content: 'Dưới bầu trời đêm đầy sao lấp lánh, câu nói "Em đồng ý" đã mở ra chương đẹp nhất của cuộc đời hai đứa.',
        image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
      },
    ];
  }, [data.stories]);

  const filteredGallery = useMemo(() => {
    if (!data.gallery || data.gallery.length === 0) return [];
    if (galleryFilter === 'all') return data.gallery;
    if (galleryFilter === 'ceremony') {
      return data.gallery.filter((_, idx) => idx % 2 === 0);
    }
    return data.gallery.filter((_, idx) => idx % 2 === 1);
  }, [data.gallery, galleryFilter]);

  return (
    <div className="min-h-screen bg-[#0B090E] text-[#F5EFE6] font-sans selection:bg-[#E8B498]/30 selection:text-white relative overflow-x-hidden pb-32">
      {/* 1. Ambient Gold Stardust Embers Canvas Effect */}
      <RoyalGoldParticlesCanvas />

      {/* 1b. Interactive Rose Gold Cursor & Scroll Sparkle Micro-Stars */}
      <RoyalSparkleCursor />

      {/* 1c. Royal Gold Scroll Progress Track with Floating Diamond Indicator */}
      <RoyalScrollProgress />

      {/* 1d. Interactive Floating 3D Ring Sentinel & Chapter Navigator */}
      <RoyalScrollRingSentinel onReopenVault={() => setShowVaultModal(true)} />

      {/* 2. Full-screen 3D Vault Opening Experience */}
      {!isVaultOpened && (
        <RoyalRingVaultOpening
          onEnterWedding={() => setIsVaultOpened(true)}
          guestName={guestInfo.displayName}
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDateStr}
          musicUrl={data.musicUrl}
        />
      )}

      {/* Floating Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0B090E]/90 backdrop-blur-md border-b border-[#E8B498]/20 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <a href="#hero" className="text-sm sm:text-base font-serif font-bold tracking-widest text-[#E8B498] whitespace-nowrap shrink-0">
            {groomName.toUpperCase()} & {brideName.toUpperCase()}
          </a>

          {/* Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider text-white/70">
            <a href="#hero" className="hover:text-[#E8B498] transition-colors whitespace-nowrap">Lời Ngỏ</a>
            <a href="#couple" className="hover:text-[#E8B498] transition-colors whitespace-nowrap">Cặp Đôi</a>
            <a href="#events" className="hover:text-[#E8B498] transition-colors whitespace-nowrap">Sự Kiện</a>
            <a href="#ceremony" className="hover:text-[#E8B498] transition-colors whitespace-nowrap">Trao Nhẫn</a>
            <a href="#story" className="hover:text-[#E8B498] transition-colors whitespace-nowrap">Chuyện Tình</a>
            <a href="#gallery" className="hover:text-[#E8B498] transition-colors whitespace-nowrap">Khoảnh Khắc</a>
            <a href="#rsvp" className="hover:text-[#E8B498] transition-colors whitespace-nowrap">RSVP</a>
            <a href="#gift" className="hover:text-[#E8B498] transition-colors whitespace-nowrap">Mừng Cưới</a>
          </nav>

          {/* Primary Action: Reopen 3D Ring Vault Modal */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowVaultModal(true)}
              className="px-3.5 sm:px-4 py-1.5 text-xs font-serif font-semibold rounded-full bg-gradient-to-r from-[#E8B498] to-[#C7886D] text-[#190F14] hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>💍</span>
              <span className="hidden sm:inline">Mở Lại</span>
              <span>Hộp Nhẫn 3D</span>
            </button>
          </div>
        </div>
      </header>

      {/* Interactive VIP Wax Seal Monogram Banner */}
      <RoyalWaxSealHero
        guestName={guestInfo.displayName}
        groomName={groomName}
        brideName={brideName}
      />

      {/* CHƯƠNG I: Lời Ngỏ & Hero Section */}
      <RoyalScrollSection id="hero" chapterNumber="I" chapterTitle="Chương I • Lời Ngỏ Hôn Ước">
        <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#18121D]/90 border border-[#E8B498]/40 text-[#E8B498] text-xs font-serif tracking-widest uppercase mb-6 shadow-xl">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thiệp Cưới Hoàng Gia VIP • The Royal Ring Vault</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">SAVE THE DATE</p>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-wide text-white leading-tight mb-6">
              <span className="block text-[#E8B498] italic drop-shadow-[0_0_30px_rgba(232,180,152,0.4)]">
                {groomName}
              </span>
              <span className="text-2xl sm:text-3xl font-light text-white/50 block my-1">&</span>
              <span className="block text-[#E8B498] italic drop-shadow-[0_0_30px_rgba(232,180,152,0.4)]">
                {brideName}
              </span>
            </h1>

            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E8B498] to-transparent mx-auto mb-6" />

            <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto font-light leading-relaxed mb-8">
              Trân trọng kính mời <span className="font-semibold text-[#FCE4BE] underline decoration-[#E8B498]/60 underline-offset-4">{guestInfo.displayName}</span> tới dự buổi lễ thành hôn trang trọng và chung vui cùng gia đình chúng mình.
            </p>

            {/* Countdown Clock with 3D Tilt Cards */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto mb-10">
              {[
                { label: 'Ngày', val: countdown.days },
                { label: 'Giờ', val: countdown.hours },
                { label: 'Phút', val: countdown.minutes },
                { label: 'Giây', val: countdown.seconds },
              ].map((item, idx) => (
                <RoyalTiltCard key={idx} maxTilt={6}>
                  <div className="p-3 sm:p-4 rounded-2xl bg-[#141018]/90 border border-[#E8B498]/30 shadow-xl text-center group hover:border-[#E8B498] transition-all">
                    <span className="block text-2xl sm:text-3xl font-serif font-bold text-[#E8B498] tabular-nums group-hover:scale-110 transition-transform">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-white/60">{item.label}</span>
                  </div>
                </RoyalTiltCard>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href="#rsvp"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E8B498] via-[#F7D6C5] to-[#E8B498] text-[#1C1016] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                Xác Nhận Tham Dự (RSVP)
              </a>
              <a
                href="#events"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white/90 hover:text-white font-serif text-xs uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all"
              >
                Xem Thời Gian & Địa Điểm
              </a>
            </div>
          </div>
        </section>
      </RoyalScrollSection>

      {/* CHƯƠNG II: Cặp Đôi */}
      <RoyalScrollSection id="couple" chapterNumber="II" chapterTitle="Chương II • Hai Nửa Yêu Thương">
        <section className="py-16 sm:py-20 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8B498] block mb-2">✦ Chú Rể & Cô Dâu ✦</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">Chân Dung Đôi Lứa</h2>
            <div className="w-16 h-[1px] bg-[#E8B498]/60 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
            {/* Groom Card with 3D Tilt */}
            <RoyalTiltCard maxTilt={7}>
              <div className="p-7 sm:p-9 rounded-3xl bg-[#141018]/95 border border-[#E8B498]/30 shadow-2xl relative overflow-hidden group hover:border-[#E8B498]/70 transition-all">
                <div className="w-36 h-36 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#E8B498] to-transparent mb-6 shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={data.groom?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                    alt={groomName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-widest text-[#E8B498] font-serif block mb-1">CHÚ RỂ</span>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{data.groom?.fullName || groomName}</h3>
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-5">
                    {data.groom?.bio || 'Người đàn ông vững chãi, luôn sẵn sàng đồng hành và bảo vệ nụ cười của em qua mọi thăng trầm cuộc sống.'}
                  </p>
                  {data.groom?.parents && (
                    <div className="pt-4 border-t border-white/10 text-xs text-white/60">
                      <p className="text-[11px] uppercase tracking-wider text-[#E8B498]/80 mb-0.5">Trưởng nam của:</p>
                      <p className="text-white/90 font-medium">{data.groom.parents.father} & {data.groom.parents.mother}</p>
                    </div>
                  )}
                </div>
              </div>
            </RoyalTiltCard>

            {/* Bride Card with 3D Tilt */}
            <RoyalTiltCard maxTilt={7}>
              <div className="p-7 sm:p-9 rounded-3xl bg-[#141018]/95 border border-[#E8B498]/30 shadow-2xl relative overflow-hidden group hover:border-[#E8B498]/70 transition-all">
                <div className="w-36 h-36 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#E8B498] to-transparent mb-6 shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={data.bride?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={brideName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-widest text-[#E8B498] font-serif block mb-1">CÔ DÂU</span>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{data.bride?.fullName || brideName}</h3>
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-5">
                    {data.bride?.bio || 'Cô gái dịu dàng, đem lại ánh sáng bình yên và sự ấm áp vô tận cho ngôi nhà nhỏ của chúng ta.'}
                  </p>
                  {data.bride?.parents && (
                    <div className="pt-4 border-t border-white/10 text-xs text-white/60">
                      <p className="text-[11px] uppercase tracking-wider text-[#E8B498]/80 mb-0.5">Ái nữ của:</p>
                      <p className="text-white/90 font-medium">{data.bride.parents.father} & {data.bride.parents.mother}</p>
                    </div>
                  )}
                </div>
              </div>
            </RoyalTiltCard>
          </div>
        </section>
      </RoyalScrollSection>

      {/* CHƯƠNG III: Sự Kiện & Địa Điểm */}
      <RoyalScrollSection id="events" chapterNumber="III" chapterTitle="Chương III • Lịch Trình Hôn Lễ">
        <section className="py-16 sm:py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8B498] block mb-2">✦ CHƯƠNG TRÌNH HÔN LỄ ✦</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">Sự Kiện & Địa Điểm</h2>
            <div className="w-16 h-[1px] bg-[#E8B498]/60 mx-auto mt-4" />
          </div>

          <div className="space-y-6">
            {data.events?.map((event, idx) => (
              <RoyalTiltCard key={event.id || idx} maxTilt={4}>
                <div className="p-6 sm:p-8 rounded-3xl bg-[#141018] border border-[#E8B498]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#E8B498]/70 transition-all">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8B498]/15 border border-[#E8B498]/40 text-[#E8B498] text-xs font-serif">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.time} • {event.date}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">{event.title}</h3>
                    <p className="text-xs sm:text-sm text-[#E8B498] font-medium flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{event.locationName}</span>
                    </p>
                    <p className="text-xs text-white/60 font-light max-w-md">{event.address}</p>
                  </div>

                  <div className="shrink-0 flex flex-col sm:flex-row gap-2">
                    <SmartEventActions
                      event={{
                        title: event.title,
                        date: event.date,
                        time: event.time,
                        locationName: event.locationName,
                        address: event.address,
                        mapUrl: event.mapUrl,
                        description: event.description,
                        groomName,
                        brideName,
                      }}
                    />
                  </div>
                </div>
              </RoyalTiltCard>
            ))}
          </div>
        </section>
      </RoyalScrollSection>

      {/* CHƯƠNG IV: Trao Nhẫn Thiêng Liêng */}
      <RoyalScrollSection id="ceremony" chapterNumber="IV" chapterTitle="Chương IV • Nghi Thức Trao Nhẫn">
        <section className="py-12 sm:py-16 px-4 max-w-4xl mx-auto">
          <InteractiveRingExchangeWidget groomName={groomName} brideName={brideName} />
        </section>
      </RoyalScrollSection>

      {/* CHƯƠNG V: Chuyện Tình & Timeline */}
      <RoyalScrollSection id="story" chapterNumber="V" chapterTitle="Chương V • Hành Trình Tình Yêu">
        <section className="py-16 sm:py-20 px-4 max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8B498] block mb-2">✦ HÀNH TRÌNH TÌNH YÊU ✦</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white">Chuyện Chúng Mình</h2>
            <div className="w-16 h-[1px] bg-[#E8B498]/60 mx-auto mt-4" />
          </div>

          <div className="relative border-l-2 border-[#E8B498]/40 ml-4 sm:ml-28 space-y-12">
            {storyMilestones.map((milestone, idx) => (
              <div key={milestone.id || idx} className="relative pl-6 sm:pl-10 group">
                {/* Glowing Diamond Node on timeline */}
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[#E8B498] border-4 border-[#0B090E] shadow-[0_0_15px_#E8B498] group-hover:scale-125 transition-transform" />

                <span className="hidden sm:block absolute -left-24 top-1.5 text-sm font-serif font-bold text-[#E8B498] tracking-wider">
                  {milestone.year}
                </span>

                <RoyalTiltCard maxTilt={5}>
                  <div className="p-6 sm:p-7 rounded-3xl bg-[#141018] border border-[#E8B498]/25 shadow-xl group-hover:border-[#E8B498]/60 transition-all">
                    <span className="sm:hidden text-xs font-serif font-bold text-[#E8B498] block mb-1">
                      Năm {milestone.year}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white mb-2">{milestone.title}</h3>
                    <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-4">{milestone.content}</p>
                    {milestone.image && (
                      <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-white/10">
                        <img
                          src={milestone.image}
                          alt={milestone.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                </RoyalTiltCard>
              </div>
            ))}
          </div>
        </section>
      </RoyalScrollSection>

      {/* CHƯƠNG VI: Khoảnh Khắc Tình Yêu / Album Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <RoyalScrollSection id="gallery" chapterNumber="VI" chapterTitle="Chương VI • Tuyệt Tác Khoảnh Khắc">
          <section className="py-16 sm:py-20 px-4 max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#E8B498] block mb-2">✦ ALBUM KỶ NIỆM ✦</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white">Khoảnh Khắc Tình Yêu</h2>
              <div className="w-16 h-[1px] bg-[#E8B498]/60 mx-auto mt-4" />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[
                { id: 'all', label: 'Tất cả khoảnh khắc' },
                { id: 'ceremony', label: 'Bộ ảnh hoàng gia' },
                { id: 'couples', label: 'Khoảnh khắc ngọt ngào' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGalleryFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-serif transition-all ${
                    galleryFilter === f.id
                      ? 'bg-[#E8B498] text-[#190F14] font-bold shadow-md'
                      : 'bg-white/5 border border-white/15 text-white/70 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filteredGallery.map((photo, idx) => (
                <RoyalTiltCard key={photo.id || idx} maxTilt={6}>
                  <div
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-neutral-900 border border-[#E8B498]/20 shadow-lg hover:border-[#E8B498]/70 transition-all"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Ảnh cưới'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </RoyalTiltCard>
              ))}
            </div>
          </section>
        </RoyalScrollSection>
      )}

      {/* CHƯƠNG VII: Nâng Ly Chúc Mừng */}
      <RoyalScrollSection chapterNumber="VII" chapterTitle="Chương VII • Nâng Ly Danh Dự">
        <section className="py-10 px-4 max-w-4xl mx-auto">
          <VirtualChampagneToastWidget
            groomName={groomName}
            brideName={brideName}
            guestName={guestInfo.displayName}
            weddingId={data.id || data.slug || 'demo'}
          />
        </section>
      </RoyalScrollSection>

      {/* CHƯƠNG VIII: Xác Nhận Tham Dự (RSVP) */}
      <RoyalScrollSection id="rsvp" chapterNumber="VIII" chapterTitle="Chương VIII • Xác Nhận Tham Dự">
        <section className="py-16 sm:py-20 px-4 max-w-xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8B498] block mb-2">✦ XÁC NHẬN THAM DỰ ✦</span>
            <h2 className="text-3xl font-serif text-white">Sự Hiện Diện Của Bạn</h2>
            <p className="text-xs sm:text-sm text-white/60 mt-2">
              Để gia đình chuẩn bị chu đáo nhất, xin vui lòng gửi phản hồi cho chúng mình trước ngày cưới.
            </p>
          </div>

          <RoyalTiltCard maxTilt={3}>
            <form onSubmit={handleRSVPSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#141018] border border-[#E8B498]/30 shadow-2xl space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 mb-1">Họ & Tên *</label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Tên của bạn hoặc gia đình"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#E8B498]/40 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E8B498]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={rsvpPhone}
                  onChange={(e) => setRsvpPhone(e.target.value)}
                  placeholder="Nhập số điện thoại để nhận thông báo nhắc nhở"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#E8B498]/40 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E8B498]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 mb-1">Khả năng tham dự *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpAttending('yes')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      rsvpAttending === 'yes'
                        ? 'bg-[#E8B498] text-[#190F14] border-[#E8B498]'
                        : 'bg-black/40 border-white/20 text-white/70'
                    }`}
                  >
                    ✓ Chắc chắn tham dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpAttending('no')}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      rsvpAttending === 'no'
                        ? 'bg-[#E8B498] text-[#190F14] border-[#E8B498]'
                        : 'bg-black/40 border-white/20 text-white/70'
                    }`}
                  >
                    Rất tiếc không thể đến
                  </button>
                </div>
              </div>

              {rsvpAttending === 'yes' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/80 mb-1">Số lượng người tham dự</label>
                  <select
                    value={rsvpGuestsCount}
                    onChange={(e) => setRsvpGuestsCount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1c1521] border border-[#E8B498]/40 text-white text-sm focus:outline-none focus:border-[#E8B498]"
                  >
                    <option value="1">1 người</option>
                    <option value="2">2 người (Đi cùng người thương)</option>
                    <option value="3">3 người (Gia đình)</option>
                    <option value="4">4+ người</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/80 mb-1">Lời nhắn gửi cô dâu chú rể</label>
                <textarea
                  rows={3}
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  placeholder="Gửi lời chúc yêu thương hoặc ghi chú món ăn..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#E8B498]/40 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E8B498]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRsvp}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E8B498] via-[#F7D6C5] to-[#E8B498] text-[#190F14] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                {isSubmittingRsvp ? 'Đang gửi...' : 'Gửi Xác Nhận Tham Dự'}
              </button>
            </form>
          </RoyalTiltCard>
        </section>
      </RoyalScrollSection>

      {/* CHƯƠNG IX: Hộp Mừng Cưới */}
      <RoyalScrollSection id="gift" chapterNumber="IX" chapterTitle="Chương IX • Trao Gửi Yêu Thương">
        <section className="py-16 sm:py-20 px-4 max-w-xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E8B498] block mb-2">✦ HỘP MỪNG CƯỚI ✦</span>
          <h2 className="text-3xl font-serif text-white mb-2">Gửi Trao Yêu Thương</h2>
          <p className="text-xs sm:text-sm text-white/60 mb-8 max-w-md mx-auto">
            Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất đối với chúng mình. Nếu muốn gửi quà mừng cưới từ xa:
          </p>

          {/* Bank Tabs */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setActiveBankTab('groom')}
              className={`px-5 py-2 rounded-full text-xs font-serif font-semibold border transition-all ${
                activeBankTab === 'groom'
                  ? 'bg-[#E8B498] text-[#190F14] border-[#E8B498] shadow-md'
                  : 'bg-white/5 border-white/20 text-white/70 hover:text-white'
              }`}
            >
              Mừng Chú Rể ({groomName})
            </button>
            <button
              onClick={() => setActiveBankTab('bride')}
              className={`px-5 py-2 rounded-full text-xs font-serif font-semibold border transition-all ${
                activeBankTab === 'bride'
                  ? 'bg-[#E8B498] text-[#190F14] border-[#E8B498] shadow-md'
                  : 'bg-white/5 border-white/20 text-white/70 hover:text-white'
              }`}
            >
              Mừng Cô Dâu ({brideName})
            </button>
          </div>

          {/* Royal Envelope Gift Card */}
          <RoyalEnvelopeGiftCard
            bank={activeBank}
            roleLabel={activeBankTab === 'groom' ? `Tài Khoản Chú Rể (${groomName})` : `Tài Khoản Cô Dâu (${brideName})`}
            onExpandQr={(b) => setExpandedQr(b)}
            onCopy={handleCopy}
            copiedAccount={copiedAccount}
          />
        </section>
      </RoyalScrollSection>

      {/* CHƯƠNG X: Sổ Lưu Bút Lời Chúc */}
      <RoyalScrollSection id="wishes" chapterNumber="X" chapterTitle="Chương X • Sổ Lưu Bút Danh Dự">
        <section className="py-16 sm:py-20 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E8B498] block mb-2">✦ SỔ LƯU BÚT ✦</span>
            <h2 className="text-3xl font-serif text-white">Lời Chúc Danh Dự</h2>
            <p className="text-xs text-white/60 mt-2">Hãy để lại lời chúc phúc tốt đẹp nhất cho ngày vui của chúng mình.</p>
          </div>

          {/* Wish Form */}
          <RoyalTiltCard maxTilt={3}>
            <form onSubmit={handleWishSubmit} className="p-6 rounded-3xl bg-[#141018] border border-[#E8B498]/30 shadow-xl mb-8 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={newWishName}
                  onChange={(e) => setNewWishName(e.target.value)}
                  placeholder="Tên của bạn *"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-[#E8B498]/40 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E8B498]"
                />
              </div>
              <div>
                <textarea
                  required
                  rows={3}
                  value={newWishContent}
                  onChange={(e) => setNewWishContent(e.target.value)}
                  placeholder="Viết lời chúc của bạn tới cô dâu & chú rể... *"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-[#E8B498]/40 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#E8B498]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingWish}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E8B498] to-[#C7886D] text-[#190F14] font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingWish ? 'Đang gửi...' : 'Gửi Lời Chúc Mừng'}</span>
              </button>
            </form>
          </RoyalTiltCard>

          {/* Wishes List */}
          <div className="space-y-4">
            {wishes.map((w, idx) => (
              <div key={w.id || idx} className="p-5 rounded-2xl bg-[#141018] border border-white/10 shadow-md hover:border-[#E8B498]/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-sm text-[#E8B498]">{w.authorName || (w as unknown as { name?: string }).name}</span>
                  <span className="text-[10px] text-white/40">{w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">{w.content}</p>
              </div>
            ))}
          </div>
        </section>
      </RoyalScrollSection>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-[#E8B498]/15 text-xs text-white/50">
        <p className="font-serif text-sm text-[#E8B498] tracking-widest uppercase mb-2">
          {groomName} & {brideName}
        </p>
        <p className="font-light">Cảm ơn bạn đã luôn là một phần ý nghĩa trong hành trình hạnh phúc của chúng mình.</p>
        <p className="mt-4 text-[10px] text-white/30">L'Amour Wedding • The Royal Ring Vault 3D VIP Experience</p>
      </footer>

      {/* Lightbox for Gallery */}
      {lightboxIndex !== null && data.gallery && (
        <LightboxModal
          photos={data.gallery}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={(idx) => setLightboxIndex(idx)}
        />
      )}

      {/* QR Zoom Modal */}
      {expandedQr && (
        <UniversalQRZoomModal
          bank={expandedQr}
          onClose={() => setExpandedQr(null)}
        />
      )}

      {/* Modal 3D Vault if User Reopens it */}
      {showVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setShowVaultModal(false)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all shadow-xl"
            title="Đóng Hộp Nhẫn"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-full h-full">
            <RoyalRingVaultOpening
              onEnterWedding={() => setShowVaultModal(false)}
              guestName={guestInfo.displayName}
              groomName={groomName}
              brideName={brideName}
              weddingDate={weddingDateStr}
              musicUrl={data.musicUrl}
            />
          </div>
        </div>
      )}

      {/* Floating 3D Vault Trigger Button on Bottom-Right (Stacked cleanly above Live Album trigger) */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          onClick={() => setShowVaultModal(true)}
          className="group relative px-4 py-2.5 rounded-full bg-gradient-to-r from-[#18121D] via-[#211626] to-[#18121D] border border-[#E8B498] text-[#E8B498] font-serif text-xs font-semibold shadow-[0_0_25px_rgba(232,180,152,0.4)] hover:shadow-[0_0_35px_rgba(232,180,152,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 backdrop-blur-md"
        >
          <span className="text-base group-hover:rotate-12 transition-transform">💍</span>
          <span className="tracking-wide hidden sm:inline">Mở Lại</span>
          <span>Hộp Nhẫn 3D</span>
        </button>
      </div>
    </div>
  );
}
