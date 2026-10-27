import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Heart,
  Sparkles,
  Send,
  QrCode,
  X,
  ExternalLink,
  ChevronDown,
  Navigation,
  ZoomIn,
} from 'lucide-react';
import { WeddingData, WeddingEvent, BankAccount, WishMessage } from '../../../types';
import { LightboxModal } from '../../ui/LightboxModal';
import { CoupleNamesStacked } from '../common/CoupleNamesStacked';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { useToast } from '../../ui/Toast';
import { weddingAudio } from '../../../lib/audioSynth';
import { submitRSVP } from '../../../services/rsvpService';
import { openQRZoom } from '../common/QRZoomModal';
import { getWishes, submitWish } from '../../../services/wishesService';
import { getGuestInfoFromUrl } from '../../../lib/guestPersonalization';
import { PersonalizedWaxSealBadge } from '../common/PersonalizedWaxSealBadge';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import { SmartEventActions } from '../common/SmartEventActions';

interface LuxuryEditorialTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

// Helper: Calculate countdown
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

// Helper: Copy to clipboard
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }
  return false;
}

interface EditorialGalleryProps {
  galleryImages: { id?: string; url: string; caption?: string }[];
  data: WeddingData;
  setCursorText: (text: string) => void;
  setLightboxIndex: (idx: number) => void;
  setLightboxOpen: (open: boolean) => void;
}

function EditorialGallery({
  galleryImages,
  data,
  setCursorText,
  setLightboxIndex,
  setLightboxOpen,
}: EditorialGalleryProps) {
  const [viewMode, setViewMode] = useState<'reel' | 'grid'>('reel');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPlate, setCurrentPlate] = useState(1);
  const reelRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleScroll = () => {
    if (!reelRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = reelRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      setScrollProgress(progress);
      const plate = Math.min(
        galleryImages.length,
        Math.max(1, Math.round(progress * (galleryImages.length - 1)) + 1)
      );
      setCurrentPlate(plate);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!reelRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - reelRef.current.offsetLeft;
    scrollLeftRef.current = reelRef.current.scrollLeft;
    setHasDragged(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !reelRef.current) return;
    e.preventDefault();
    const x = e.pageX - reelRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      setHasDragged(true);
    }
    reelRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!reelRef.current) return;
    const step = reelRef.current.clientWidth * 0.7;
    reelRef.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!reelRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 5) {
      const { scrollLeft, scrollWidth, clientWidth } = reelRef.current;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 2;
      const canScrollLeft = scrollLeft > 2;

      if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
        reelRef.current.scrollLeft += e.deltaY * 1.2;
      }
    }
  };

  return (
    <div className="w-full">
      {/* Gallery Header Controls */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-6 gap-4">
        <div>
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A880] block mb-2 font-semibold">
            EXHIBITION GALLERY
          </span>
          <h2 className="font-serif-title text-3xl sm:text-5xl text-white uppercase font-light tracking-tight">
            Khoảnh Khắc Kỷ Niệm
          </h2>
        </div>

        {/* View Mode & Nav Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-neutral-900 border border-white/15 text-[11px] uppercase tracking-wider font-medium">
            <button
              onClick={() => setViewMode('reel')}
              className={`px-3 sm:px-4 py-1.5 transition-all cursor-pointer ${
                viewMode === 'reel' ? 'bg-[#C5A880] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Lookbook Reel
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 sm:px-4 py-1.5 transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#C5A880] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Lưới Tạp Chí
            </button>
          </div>

          {/* Prev/Next for Reel */}
          {viewMode === 'reel' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollByAmount('left')}
                className="w-9 h-9 border border-white/20 hover:border-[#C5A880] hover:text-[#C5A880] flex items-center justify-center text-white/80 transition-colors cursor-pointer"
                title="Ảnh trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollByAmount('right')}
                className="w-9 h-9 border border-white/20 hover:border-[#C5A880] hover:text-[#C5A880] flex items-center justify-center text-white/80 transition-colors cursor-pointer"
                title="Ảnh kế tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODE: REEL */}
      {viewMode === 'reel' ? (
        <div className="space-y-6">
          <div
            ref={reelRef}
            onScroll={handleScroll}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex gap-6 overflow-x-auto scroll-smooth px-6 sm:px-12 pb-6 scrollbar-none cursor-grab active:cursor-grabbing select-none"
          >
            {/* Lookbook Intro Card */}
            <div className="shrink-0 w-[280px] sm:w-[360px] aspect-[4/5] bg-neutral-900/90 border border-white/10 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] tracking-[0.3em] text-[#C5A880] uppercase block mb-3 font-medium">
                  THE LOOKBOOK &bull; ISSUE 2026
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl text-white font-light leading-snug">
                  Từng khung hình là một nốt nhạc trong bản giao hưởng tình yêu.
                </h3>
              </div>
              <div className="space-y-3 pt-6 border-t border-white/10">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Kéo ngang chuột, cuộn hoặc dùng nút điều hướng để thưởng lãm toàn bộ ảnh kỷ niệm.
                </p>
                <div className="flex items-center justify-between text-[11px] tracking-widest text-[#C5A880] uppercase font-medium">
                  <span>PLATE 0{currentPlate}</span>
                  <span className="text-neutral-500">TỔNG 0{galleryImages.length}</span>
                </div>
              </div>
            </div>

            {/* Photo Slides */}
            {galleryImages.map((img, idx) => (
              <div
                key={img.id || idx}
                className="shrink-0 w-[280px] sm:w-[480px] aspect-[4/5] relative group cursor-pointer overflow-hidden bg-neutral-800 border border-white/5"
                onMouseEnter={() => setCursorText('VIEW')}
                onMouseLeave={() => setCursorText('')}
                onClick={() => {
                  if (!hasDragged) {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }
                }}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Gallery ${idx + 1}`}
                  draggable={false}
                  className="w-full h-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors pointer-events-none" />

                {/* Caption & Plate indicator */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white flex items-end justify-between pointer-events-none">
                  <div>
                    <span className="text-[10px] tracking-widest text-[#C5A880] uppercase block font-semibold mb-1">
                      PLATE 0{idx + 1}
                    </span>
                    <p className="font-serif-title text-base sm:text-lg font-light italic">
                      {img.caption || `${data.groomName} & ${data.brideName}`}
                    </p>
                  </div>
                  <span className="text-xs text-white/60 tracking-widest">
                    0{idx + 1} / 0{galleryImages.length}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator Bar & Subtitle */}
          <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400">
            <div className="w-full sm:w-64 h-[2px] bg-white/10 overflow-hidden relative">
              <div
                className="h-full bg-[#C5A880] transition-all duration-150"
                style={{ width: `${Math.max(12, scrollProgress * 100)}%` }}
              />
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 text-center sm:text-right">
              Kéo chuột hoặc lướt ngang để xem tiếp &bull; Chạm vào ảnh để phóng to toàn màn hình
            </p>
          </div>
        </div>
      ) : (
        /* VIEW MODE: EDITORIAL MOSAIC GRID */
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {galleryImages.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                onMouseEnter={() => setCursorText('VIEW')}
                onMouseLeave={() => setCursorText('')}
                className="group relative overflow-hidden bg-neutral-800 cursor-pointer border border-white/10 aspect-[4/5]"
              >
                <img
                  src={img.url}
                  alt={img.caption || `Gallery ${idx + 1}`}
                  className="w-full h-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent text-white flex items-end justify-between">
                  <div>
                    <span className="text-[9px] tracking-widest text-[#C5A880] uppercase block">
                      PLATE 0{idx + 1}
                    </span>
                    <p className="font-serif-title text-base font-light italic truncate">
                      {img.caption || `${data.groomName} & ${data.brideName}`}
                    </p>
                  </div>
                  <span className="text-xs text-white/50 tracking-widest">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function LuxuryEditorialTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode,
  showEnvelopeImmediately = true,
}: LuxuryEditorialTemplateProps) {
  const { showToast } = useToast();
  const [isCurtainOpened, setIsCurtainOpened] = useState(!showEnvelopeImmediately);

  useEffect(() => {
    setIsCurtainOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  // Audio state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Countdown
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(data.weddingDateTime || data.weddingDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(data.weddingDateTime || data.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDateTime, data.weddingDate]);

  // Guest Personalization
  const guestInfo = React.useMemo(() => getGuestInfoFromUrl(), []);

  // RSVP state
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

  // Wishes state
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [wishAuthor, setWishAuthor] = useState('');
  const [wishRelation, setWishRelation] = useState('Bạn bè');
  const [wishContent, setWishContent] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);

  // Gallery state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Bank & Gift QR
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [activeBankTab, setActiveBankTab] = useState<'groom' | 'bride'>('groom');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [expandedQr, setExpandedQr] = useState<BankAccount | null>(null);

  // Custom Cursor for Desktop
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024;
  });
  const [cursorText, setCursorText] = useState('');
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 250, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 250, mass: 0.5 });

  useEffect(() => {
    const checkDevice = () => {
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsDesktop(hasFinePointer && window.innerWidth >= 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop, mouseX, mouseY]);

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

  // Hero Parallax setup (using window scrollY to avoid unhydrated target ref errors)
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 800], ['0%', '24%']);
  const heroImageScale = useTransform(scrollY, [0, 800], [1, 1.12]);
  const heroTextY = useTransform(scrollY, [0, 800], ['0%', '35%']);
  const heroTextOpacity = useTransform(scrollY, [0, 550], [1, 0]);

  // Handle music toggle
  const toggleMusic = () => {
    if (isPlayingMusic) {
      weddingAudio.pause();
      setIsPlayingMusic(false);
    } else {
      weddingAudio.play(data.musicUrl);
      setIsPlayingMusic(true);
    }
  };

  // Open envelope / cover
  const handleOpenInvitation = () => {
    weddingAudio.play(data.musicUrl);
    setIsPlayingMusic(true);
    setIsCurtainOpened(true);
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#121212', '#C5A880', '#D4AF37', '#E5DFD7'],
    });
  };

  // Copy bank account
  const handleCopyAccount = async (num: string) => {
    const ok = await copyToClipboard(num);
    if (ok) {
      setCopiedAccount(num);
      showToast('Đã sao chép số tài khoản!', 'success');
      setTimeout(() => setCopiedAccount(null), 3000);
    }
  };

  // RSVP Submit
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
        showToast('Cảm ơn bạn đã phản hồi thiệp mời!', 'success');
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
        });
      }
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      setIsSubmittingRSVP(false);
    }
  };

  // Wish Submit
  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishAuthor.trim() || !wishContent.trim()) {
      showToast('Vui lòng nhập tên và lời chúc phúc', 'error');
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
      if (newWish && newWish.id) {
        setWishes((prev) => [newWish, ...prev]);
        setWishAuthor('');
        setWishContent('');
        showToast('Lời chúc của bạn đã được gửi thành công!', 'success');
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } catch {
      showToast('Không thể gửi lời chúc, vui lòng thử lại', 'error');
    } finally {
      setIsSubmittingWish(false);
    }
  };

  // Calendar event download
  const handleAddToCalendar = (event: WeddingEvent) => {
    const title = `${data.groomName} & ${data.brideName} - ${event.title}`;
    const desc = `Lễ cưới ${data.groomName} & ${data.brideName}. Địa điểm: ${event.address}`;
    const dateFormatted = event.date.replace(/\//g, '-');
    const startIso = `${dateFormatted}T${event.time || '10:00'}:00`;
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(
      event.address
    )}&dates=${startIso.replace(/[-:]/g, '')}/${startIso.replace(/[-:]/g, '')}`;

    window.open(googleCalendarUrl, '_blank');
  };

  // Primary wedding photo
  const heroPhoto =
    data.coverImage ||
    data.gallery[0]?.url ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85';

  const fullWidthPhoto1 =
    data.gallery[1]?.url ||
    data.stories?.[0]?.image ||
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=85';

  const fullWidthPhoto2 =
    data.gallery[2]?.url ||
    data.stories?.[1]?.image ||
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1920&q=85';

  const storyPhoto =
    data.stories?.[0]?.image ||
    data.gallery[3]?.url ||
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85';

  const galleryImages =
    data.gallery.length > 0
      ? data.gallery
      : [
          {
            id: 'demo-1',
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
            caption: 'The First Look',
          },
          {
            id: 'demo-2',
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
            caption: 'Embracing Tomorrow',
          },
          {
            id: 'demo-3',
            url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
            caption: 'Golden Hour Promises',
          },
          {
            id: 'demo-4',
            url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
            caption: 'Whispered Vows',
          },
          {
            id: 'demo-5',
            url: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
            caption: 'Forever Begins',
          },
        ];

  return (
    <div className="relative min-h-screen bg-[#FBF9F5] text-[#121212] font-body selection:bg-[#121212] selection:text-[#FBF9F5] overflow-x-hidden">
      {/* =========================================================================
          CUSTOM DESKTOP CURSOR (Disabled on mobile/touch for performance)
          ========================================================================= */}
      {isDesktop && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          style={{
            x: smoothX,
            y: smoothY,
          }}
        >
          <motion.div
            animate={{
              width: cursorText ? 80 : isHoveredInteractive ? 48 : 12,
              height: cursorText ? 80 : isHoveredInteractive ? 48 : 12,
              backgroundColor: cursorText ? 'rgba(18, 18, 18, 0.9)' : isHoveredInteractive ? 'rgba(18, 18, 18, 0.15)' : '#121212',
              borderColor: cursorText ? '#C5A880' : '#121212',
            }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="rounded-full border border-neutral-900/40 flex items-center justify-center text-[10px] tracking-widest text-[#FBF9F5] uppercase font-medium backdrop-blur-[1px] shadow-sm select-none"
          >
            {cursorText}
          </motion.div>
        </motion.div>
      )}

      {/* =========================================================================
          1. OPENING COVER / MAGAZINE ENVELOPE CEREMONY
          ========================================================================= */}
      <AnimatePresence>
        {!isCurtainOpened && (
          <motion.div
            key="luxury-editorial-cover"
            initial={{ opacity: 1 }}
            exit={{
              clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
              opacity: 0,
              scale: 1.05,
              transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] },
            }}
            className="fixed inset-0 z-[90] bg-[#121110] text-[#FBF9F5] flex flex-col justify-between p-6 sm:p-12 overflow-hidden"
          >
            {/* Background subtle textured portrait with zoom */}
            <motion.div
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center opacity-35 filter grayscale contrast-125"
              style={{ backgroundImage: `url(${heroPhoto})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/70 to-[#121110]/90" />

            {/* Top Bar of the Invitation Issue */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4 text-[10px] sm:text-xs tracking-[0.25em] text-neutral-400 uppercase">
              <span>SPECIAL EDITION &bull; VOL. 2026</span>
              <span className="text-[#C5A880] font-semibold">THE WEDDING INVITATION</span>
              <span>L’AMOUR EXCLUSIVE</span>
            </div>

            {/* Central Magazine Masthead & Names */}
            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 my-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xs sm:text-sm tracking-[0.35em] text-[#C5A880] uppercase font-medium"
              >
                THE OFFICIAL INVITATION OF
              </motion.p>

              <div className="space-y-2 w-full max-w-xl mx-auto px-2">
                <CoupleNamesStacked
                  groomName={data.groomName}
                  brideName={data.brideName}
                  variant="hero"
                  textColor="#FFFFFF"
                  heartColor="#C5A880"
                  groomClassName="font-light tracking-tight"
                  brideClassName="font-light tracking-tight"
                  idPrefix="editorial-opening"
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-xs sm:text-sm tracking-[0.25em] text-neutral-300 uppercase"
              >
                {data.weddingDate || '20 DECEMBER 2026'} &bull; {data.city || 'VIỆT NAM'}
              </motion.p>

              {/* Gold Inscribed Guest Invitation */}
              <div className="flex justify-center my-2">
                <PersonalizedWaxSealBadge theme="dark" className="max-w-[280px]" />
              </div>

              {/* Enter Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="pt-6"
              >
                <button
                  id="open-luxury-editorial-btn"
                  onClick={handleOpenInvitation}
                  onMouseEnter={() => setIsHoveredInteractive(true)}
                  onMouseLeave={() => setIsHoveredInteractive(false)}
                  className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 bg-[#FBF9F5] hover:bg-[#C5A880] text-[#121212] hover:text-[#121212] text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-2xl rounded-none cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880] group-hover:text-black transition-colors" />
                  <span>Mở Trang Bìa Thiệp Cưới</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-3 text-[10px] tracking-widest text-neutral-400 uppercase">
                  (Chạm để mở và kích hoạt âm nhạc đám cưới)
                </p>
              </motion.div>
            </div>

            {/* Bottom Bar Details */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-4 text-[10px] tracking-widest text-neutral-500 uppercase">
              <span>EST. 2026</span>
              <span>FOREVER &bull; ALWAYS</span>
              <span>SCROLL TO DISCOVER</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          2. MINIMALIST TOP EDITORIAL NAVIGATION BAR (Rất nhỏ ở phía trên)
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-40 h-12 sm:h-14 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
          {/* Issue Logo / Monogram */}
          <a
            href="#hero"
            className="flex items-center gap-2 text-xs tracking-[0.25em] font-semibold uppercase text-neutral-900 hover:opacity-75 transition-opacity"
          >
            <span>{data.groomName.slice(0, 1)}</span>
            <span className="font-serif-title italic font-normal text-sm">&amp;</span>
            <span>{data.brideName.slice(0, 1)}</span>
            <span className="hidden sm:inline-block text-[10px] text-neutral-400 font-normal pl-2 border-l border-neutral-300">
              EDITORIAL ISSUE
            </span>
          </a>

          {/* Discreet Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-neutral-600 font-medium">
            <a
              href="#about"
              className="hover:text-neutral-900 transition-colors"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
            >
              Lời Ngỏ
            </a>
            {data.stories && data.stories.length > 0 && (
              <a
                href="#story"
                className="hover:text-neutral-900 transition-colors"
                onMouseEnter={() => setIsHoveredInteractive(true)}
                onMouseLeave={() => setIsHoveredInteractive(false)}
              >
                Chuyện Tình
              </a>
            )}
            <a
              href="#events"
              className="hover:text-neutral-900 transition-colors"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
            >
              Lịch Trình
            </a>
            <a
              href="#gallery"
              className="hover:text-neutral-900 transition-colors"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
            >
              Bộ Ảnh
            </a>
            <a
              href="#rsvp"
              className="hover:text-neutral-900 transition-colors text-black font-semibold"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
            >
              RSVP
            </a>
          </nav>

          {/* Right Action: Sound Toggle & Quick Gift */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMusic}
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-widest uppercase border border-neutral-300 hover:border-neutral-900 rounded-none text-neutral-700 hover:text-black transition-colors cursor-pointer"
              title={isPlayingMusic ? 'Tắt nhạc' : 'Bật nhạc nền'}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3 h-3 text-neutral-900 animate-pulse" />
                  <span className="hidden sm:inline">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-neutral-400" />
                  <span className="hidden sm:inline">Sound Off</span>
                </>
              )}
            </button>

            <button
              onClick={() => setGiftModalOpen(true)}
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-900 hover:bg-[#C5A880] text-[#FBF9F5] hover:text-black text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer"
            >
              <QrCode className="w-3 h-3" />
              <span className="hidden sm:inline">Mừng Cưới</span>
            </button>

            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="text-[10px] text-amber-700 bg-amber-50 px-2 py-1 border border-amber-200 uppercase tracking-wider font-semibold cursor-pointer"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* VIP Personalized Guest Greeting Banner */}
      <PersonalizedWelcomeBanner
        groomName={data.groomName}
        brideName={data.brideName}
        weddingDate={data.weddingDate}
        accentColor="#C5A880"
      />

      {/* =========================================================================
          3. HERO SECTION (Full-Screen Photo with Text Overlay & Parallax)
          Text overlay:
          THE WEDDING OF
          MINH ANH
          &
          NGỌC MAI
          20 DECEMBER 2026
          ========================================================================= */}
      <section
        id="hero"
        className="relative h-screen min-h-[640px] w-full overflow-hidden flex flex-col justify-end pt-14"
      >
        {/* Parallax Background Photo */}
        <motion.div
          style={{ y: heroImageY, scale: heroImageScale }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center pointer-events-none"
        >
          <img
            src={heroPhoto}
            alt={`${data.groomName} & ${data.brideName}`}
            className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-90"
          />
          {/* Subtle Editorial Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        </motion.div>

        {/* Text Placed Directly Over Photo */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pb-14 sm:pb-20 text-center text-white"
        >
          {/* THE WEDDING OF with Clip-path line reveal */}
          <div className="overflow-hidden mb-3 sm:mb-5">
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm tracking-[0.4em] uppercase font-light text-[#E5DFD7]"
            >
              THE WEDDING OF
            </motion.p>
          </div>

          {/* BRIDE & GROOM NAMES: 3-row layout Groom / Heart / Bride */}
          <div className="w-full max-w-4xl mx-auto px-2">
            <CoupleNamesStacked
              groomName={data.groomName}
              brideName={data.brideName}
              variant="hero-xl"
              textColor="#FFFFFF"
              heartColor="#E5C058"
              groomClassName="font-light tracking-tight drop-shadow-sm"
              brideClassName="font-light tracking-tight drop-shadow-sm"
              idPrefix="editorial-hero"
            />
          </div>

          {/* WEDDING DATE (20 DECEMBER 2026) */}
          <div className="overflow-hidden mt-6 sm:mt-8">
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#FBF9F5]/90 font-medium"
            >
              {data.weddingDate || '20 DECEMBER 2026'} &bull; {data.city || 'HÀ NỘI'}
            </motion.p>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-8 flex flex-col items-center justify-center gap-2"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/60">SCROLL DOWN</span>
            <ChevronDown className="w-4 h-4 text-white/70 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================================================
          4. LARGE TYPOGRAPHY SECTION: "LOVE IS HOME." & ISSUE STATEMENT
          Nhiều whitespace, typographic scaling, and clip-path reveal.
          ========================================================================= */}
      <section id="about" className="relative py-28 sm:py-36 md:py-44 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Giant Typographic Monolith: LOVE IS HOME. */}
          <div className="lg:col-span-7 select-none">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="font-serif-title text-6xl sm:text-8xl md:text-9xl leading-[0.88] uppercase tracking-tighter text-[#121212] font-light"
            >
              <div className="overflow-hidden">
                <motion.div
                  variants={{
                    hidden: { y: '100%', clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' },
                    visible: {
                      y: '0%',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  LOVE
                </motion.div>
              </div>

              <div className="overflow-hidden">
                <motion.div
                  variants={{
                    hidden: { y: '100%', clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' },
                    visible: {
                      y: '0%',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="italic font-normal text-[#C5A880] tracking-normal"
                >
                  IS
                </motion.div>
              </div>

              <div className="overflow-hidden">
                <motion.div
                  variants={{
                    hidden: { y: '100%', clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' },
                    visible: {
                      y: '0%',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  HOME.
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right: Editorial Statement & Countdown */}
          <div className="lg:col-span-5 space-y-8 pt-4 lg:pt-8 text-[#2C2A29]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 font-semibold block">
                EDITORIAL STATEMENT &bull; ESSAY 01
              </span>
              <p className="font-serif-title text-xl sm:text-2xl text-neutral-800 leading-relaxed font-normal">
                &ldquo;{data.romanticQuote || 'Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng.'}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Chúng mình trân trọng kính mời quý gia đình, bạn bè và những người thương yêu nhất đến chung vui trong ngày
                trọng đại khởi đầu cho hành trình trăm năm hạnh phúc.
              </p>
            </motion.div>

            {/* Live Minimal Countdown Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="border-t border-neutral-300/80 pt-6"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium block mb-4">
                THE COUNTDOWN TO FOREVER
              </span>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                <div className="p-3 bg-white/60 border border-neutral-200/80">
                  <span className="font-serif-title text-2xl sm:text-3xl text-neutral-900 block font-light">
                    {String(countdown.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] tracking-widest text-neutral-400 uppercase">NGÀY</span>
                </div>
                <div className="p-3 bg-white/60 border border-neutral-200/80">
                  <span className="font-serif-title text-2xl sm:text-3xl text-neutral-900 block font-light">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] tracking-widest text-neutral-400 uppercase">GIỜ</span>
                </div>
                <div className="p-3 bg-white/60 border border-neutral-200/80">
                  <span className="font-serif-title text-2xl sm:text-3xl text-neutral-900 block font-light">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] tracking-widest text-neutral-400 uppercase">PHÚT</span>
                </div>
                <div className="p-3 bg-white/60 border border-neutral-200/80">
                  <span className="font-serif-title text-2xl sm:text-3xl text-neutral-900 block font-light">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] tracking-widest text-neutral-400 uppercase">GIÂY</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FULL-WIDTH PHOTO #1 (With Image Mask Reveal Animation)
          ========================================================================= */}
      <section className="relative w-full overflow-hidden px-4 sm:px-8 py-8">
        <motion.div
          initial={{ clipPath: 'inset(8% 8% 8% 8%)', scale: 0.96 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[60vh] sm:h-[80vh] overflow-hidden bg-neutral-900"
          onMouseEnter={() => {
            if (isDesktop) setCursorText('VIEW');
          }}
          onMouseLeave={() => {
            if (isDesktop) setCursorText('');
          }}
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
        >
          <img
            src={fullWidthPhoto1}
            alt="Editorial Wedding Story"
            className="w-full h-full object-cover object-center filter grayscale contrast-110 hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Editorial Caption Tag */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 text-white z-10 space-y-1">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] block">
              FIGURE 01 &bull; PORTRAIT OF DEVOTION
            </span>
            <p className="font-serif-title text-lg sm:text-2xl font-light italic">
              {data.groomName} &amp; {data.brideName}
            </p>
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          6. STORY SPLIT LAYOUT (Asymmetric Editorial Storytelling)
          ========================================================================= */}
      {data.stories && data.stories.length > 0 && (
        <section id="story" className="py-24 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-300 pb-6 mb-16 sm:mb-24">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 block mb-2 font-semibold">
              CHAPTER ARCHIVES
            </span>
            <h2 className="font-serif-title text-4xl sm:text-6xl text-neutral-900 uppercase font-light tracking-tight">
              Câu Chuyện Tình Yêu
            </h2>
          </div>
          <p className="text-xs tracking-widest text-neutral-500 uppercase mt-4 md:mt-0 font-medium">
            TIMELINE &bull; HOW WE BEGAN
          </p>
        </div>

        {/* Asymmetrical Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Framed Editorial Portrait with Mask Reveal */}
          <motion.div
            initial={{ clipPath: 'inset(12% 0 12% 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0% 0 0% 0)', opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden shadow-2xl">
              <img
                src={storyPhoto}
                alt="Story Cover"
                className="w-full h-full object-cover filter contrast-[1.03]"
              />
              <div className="absolute inset-0 border border-neutral-900/10 pointer-events-none" />
            </div>

            {/* Editorial Label Overlay */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-[#121212] text-[#FBF9F5] p-5 sm:p-6 shadow-2xl max-w-[240px]">
              <span className="text-[9px] tracking-[0.25em] text-[#C5A880] uppercase block mb-1">MEMOIR</span>
              <p className="font-serif-title text-base sm:text-lg leading-snug italic font-normal">
                &ldquo;Hành trình từ ngày đầu gặp gỡ đến khoảnh khắc về chung một nhà.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Right Column: Editorial Timeline Milestones */}
          <div className="lg:col-span-7 space-y-12 lg:pl-6">
            {data.stories.map((milestone, idx) => (
              <motion.div
                key={milestone.id || idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="border-b border-neutral-300/80 pb-8 group"
              >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs tracking-[0.25em] text-[#C5A880] uppercase font-semibold">
                      {milestone.year || `CHƯƠNG 0${idx + 1}`}
                    </span>
                    <span className="text-[11px] tracking-widest text-neutral-400 uppercase">
                      {milestone.dateStr}
                    </span>
                  </div>
                  <h3 className="font-serif-title text-2xl sm:text-3xl text-neutral-900 mb-3 group-hover:text-[#C5A880] transition-colors font-light">
                    {milestone.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    )}

      {/* =========================================================================
          7. FULL-WIDTH IMAGE #2 (Image Wipe Reveal Transition)
          ========================================================================= */}
      <section className="relative w-full overflow-hidden my-12">
        <motion.div
          initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          whileInView={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[65vh] sm:h-[85vh] bg-neutral-900"
          onMouseEnter={() => {
            if (isDesktop) setCursorText('VIEW');
          }}
          onMouseLeave={() => {
            if (isDesktop) setCursorText('');
          }}
          onClick={() => {
            setLightboxIndex(1);
            setLightboxOpen(true);
          }}
        >
          <img
            src={fullWidthPhoto2}
            alt="Cinematic Wedding Still"
            className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-90"
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Centered Minimalist Monogram/Quote */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            <span className="text-xs tracking-[0.4em] uppercase text-[#C5A880] mb-4">
              L'AMOUR &bull; INFINITE GRACE
            </span>
            <h2 className="font-serif-title text-3xl sm:text-5xl md:text-6xl font-light italic max-w-2xl leading-tight">
              &ldquo;Together is our favorite place to be.&rdquo;
            </h2>
            <div className="w-16 h-[1px] bg-[#C5A880] mt-6" />
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          8. EVENTS / ITINERARY SECTION (Chương Trình Lễ Cưới & Tiệc Cưới)
          Không dùng card thông thường, dùng bố cục chương trình triển lãm / tạp chí.
          ========================================================================= */}
      <section id="events" className="py-24 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-300 pb-6 mb-16">
          <div>
            <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 block mb-2 font-semibold">
              THE ITINERARY
            </span>
            <h2 className="font-serif-title text-4xl sm:text-6xl text-neutral-900 uppercase font-light tracking-tight">
              Chương Trình Hôn Lễ
            </h2>
          </div>
          <p className="text-xs tracking-widest text-neutral-500 uppercase mt-4 md:mt-0 font-medium">
            CEREMONY &bull; RECEPTION &bull; GALA
          </p>
        </div>

        {/* Events Table / Editorial Grid */}
        <div className="divide-y divide-neutral-300">
          {data.events.map((evt, idx) => (
            <motion.div
              key={evt.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start group hover:bg-neutral-100/40 transition-colors px-2 sm:px-4"
            >
              {/* Event Time & Index */}
              <div className="lg:col-span-3 space-y-1">
                <span className="text-[11px] tracking-[0.25em] text-[#C5A880] uppercase font-bold block">
                  PART 0{idx + 1} &bull; {evt.time}
                </span>
                <span className="text-xs tracking-widest text-neutral-500 uppercase block font-medium">
                  {evt.date}
                </span>
              </div>

              {/* Event Title & Description */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="font-serif-title text-3xl sm:text-4xl text-neutral-900 font-light group-hover:text-[#C5A880] transition-colors">
                  {evt.title}
                </h3>
                {evt.description && (
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {evt.description}
                  </p>
                )}
              </div>

              {/* Event Location & Actions */}
              <div className="lg:col-span-4 space-y-4 lg:text-right">
                <div>
                  <h4 className="font-serif-title text-lg text-neutral-900 font-medium">
                    {evt.locationName}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm lg:ml-auto">
                    {evt.address}
                  </p>
                </div>

                {/* Smart Actions: Google Maps, Grab/Be Ride, Add to Calendar */}
                <div className="pt-2 flex justify-start lg:justify-end">
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
                    theme="dark"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. GALLERY SECTION:
          Lookbook Reel & Editorial Magazine Grid (Không trượt trôi trang, không khoảng đen thừa)
          ========================================================================= */}
      <section id="gallery" className="relative py-16 sm:py-24 bg-[#141312] text-[#FBF9F5] overflow-hidden">
        <EditorialGallery
          galleryImages={galleryImages}
          data={data}
          setCursorText={setCursorText}
          setLightboxIndex={setLightboxIndex}
          setLightboxOpen={setLightboxOpen}
        />
      </section>

      {/* =========================================================================
          10. RSVP & GUESTBOOK WISHES & GIFT BOX (Thiết kế Editorial tinh giản)
          ========================================================================= */}
      <section id="rsvp" className="py-24 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left: RSVP Form (Minimalist Underline Inputs) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 block mb-2 font-semibold">
                CONFIRMATION
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl text-neutral-900 uppercase font-light tracking-tight">
                Xác Nhận Tham Dự
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-3 leading-relaxed">
                Sự hiện diện của bạn là niềm vinh hạnh to lớn cho gia đình chúng mình. Vui lòng xác nhận trước ngày cưới
                để chúng mình chuẩn bị đón tiếp chu đáo nhất.
              </p>
            </div>

            {rsvpSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-neutral-900 text-[#FBF9F5] space-y-4 text-center"
              >
                <Check className="w-8 h-8 text-[#C5A880] mx-auto" />
                <h3 className="font-serif-title text-2xl font-light">Đã Ghi Nhận Phản Hồi</h3>
                <p className="text-xs text-neutral-300">
                  Cảm ơn bạn đã phản hồi! Cô dâu &amp; Chú rể rất mong chờ được đón tiếp bạn.
                </p>
                <button
                  onClick={() => setRsvpSubmitted(false)}
                  className="text-[10px] uppercase tracking-widest text-[#C5A880] underline cursor-pointer"
                >
                  Gửi lại thông tin khác
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="space-y-6">
                {guestInfo.hasGuest && guestInfo.cleanName && (
                  <div className="p-3.5 bg-neutral-900 text-[#FBF9F5] border border-[#C5A880]/50 text-xs flex items-center gap-2.5 shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>
                      Kính chào <strong>{guestInfo.cleanName}</strong>! Thông tin khách mời đã được điền sẵn trên ấn phẩm thiệp cưới.
                    </span>
                  </div>
                )}

                {/* Full name input */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
                    HỌ VÀ TÊN KHÁCH MỜI *
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full py-3 bg-transparent border-b border-neutral-400 focus:border-neutral-900 outline-none text-sm text-neutral-900 transition-colors"
                  />
                </div>

                {/* Phone number */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
                    SỐ ĐIỆN THOẠI LIÊN HỆ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={rsvpPhone}
                    onChange={(e) => setRsvpPhone(e.target.value)}
                    placeholder="0987 654 321"
                    className="w-full py-3 bg-transparent border-b border-neutral-400 focus:border-neutral-900 outline-none text-sm text-neutral-900 transition-colors"
                  />
                </div>

                {/* Attendance radio */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium block">
                    BẠN SẼ THAM DỰ CHỨ? *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRsvpAttending(true)}
                      className={`py-3 px-4 text-xs uppercase tracking-widest font-medium border text-center transition-all cursor-pointer ${
                        rsvpAttending
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'border-neutral-300 text-neutral-600 hover:border-neutral-500'
                      }`}
                    >
                      Chắc chắn tham dự
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpAttending(false)}
                      className={`py-3 px-4 text-xs uppercase tracking-widest font-medium border text-center transition-all cursor-pointer ${
                        !rsvpAttending
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'border-neutral-300 text-neutral-600 hover:border-neutral-500'
                      }`}
                    >
                      Rất tiếc không thể
                    </button>
                  </div>
                </div>

                {/* Number of guests & Guest Of */}
                {rsvpAttending && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
                        SỐ LƯỢNG NGƯỜI ĐI CÙNG
                      </label>
                      <select
                        value={rsvpGuestsCount}
                        onChange={(e) => setRsvpGuestsCount(Number(e.target.value))}
                        className="w-full py-3 bg-transparent border-b border-neutral-400 focus:border-neutral-900 outline-none text-sm text-neutral-900 transition-colors cursor-pointer"
                      >
                        <option value={1}>1 người (Chỉ mình tôi)</option>
                        <option value={2}>2 người</option>
                        <option value={3}>3 người</option>
                        <option value={4}>4 người (Gia đình)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
                        KHÁCH CỦA AI?
                      </label>
                      <select
                        value={rsvpGuestOf}
                        onChange={(e) => setRsvpGuestOf(e.target.value as any)}
                        className="w-full py-3 bg-transparent border-b border-neutral-400 focus:border-neutral-900 outline-none text-sm text-neutral-900 transition-colors cursor-pointer"
                      >
                        <option value="both">Khách chung của hai bạn</option>
                        <option value="groom">Khách của Chú rể</option>
                        <option value="bride">Khách của Cô dâu</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="space-y-1 pt-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
                    LỜI NHẮN ĐẾN CÔ DÂU CHÚ RỂ
                  </label>
                  <textarea
                    rows={2}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Gửi lời nhắn hoặc lưu ý đặc biệt..."
                    className="w-full py-3 bg-transparent border-b border-neutral-400 focus:border-neutral-900 outline-none text-sm text-neutral-900 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRSVP}
                  onMouseEnter={() => setIsHoveredInteractive(true)}
                  onMouseLeave={() => setIsHoveredInteractive(false)}
                  className="w-full py-4 bg-neutral-900 hover:bg-[#C5A880] text-white hover:text-neutral-950 text-xs tracking-[0.25em] uppercase font-bold transition-colors shadow-lg cursor-pointer"
                >
                  {isSubmittingRSVP ? 'Đang gửi phản hồi...' : 'Gửi Xác Nhận Tham Dự'}
                </button>
              </form>
            )}
          </div>

          {/* Right: Guestbook Wishes (Lời chúc phong cách tạp chí) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 block mb-2 font-semibold">
                GUESTBOOK
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl text-neutral-900 uppercase font-light tracking-tight">
                Sổ Lưu Bút Lời Chúc
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-3 leading-relaxed">
                Hãy để lại những dòng chúc phúc yêu thương dành cho {data.groomName} &amp; {data.brideName}.
              </p>
            </div>

            {/* Quick Wish Input */}
            <form onSubmit={handleSubmitWish} className="space-y-4 bg-white/70 p-6 border border-neutral-200/90">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Tên của bạn..."
                  value={wishAuthor}
                  onChange={(e) => setWishAuthor(e.target.value)}
                  className="py-2.5 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-neutral-900"
                />
                <select
                  value={wishRelation}
                  onChange={(e) => setWishRelation(e.target.value)}
                  className="py-2.5 px-3 bg-white border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-neutral-900 cursor-pointer"
                >
                  <option value="Bạn bè">Bạn bè</option>
                  <option value="Đồng nghiệp">Đồng nghiệp</option>
                  <option value="Họ hàng">Họ hàng thân thiết</option>
                  <option value="Anh chị em">Anh chị em</option>
                </select>
              </div>

              <textarea
                required
                rows={3}
                placeholder="Viết lời chúc phúc trăm năm..."
                value={wishContent}
                onChange={(e) => setWishContent(e.target.value)}
                className="w-full p-3 bg-white border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-neutral-900 resize-none"
              />

              <button
                type="submit"
                disabled={isSubmittingWish}
                onMouseEnter={() => setIsHoveredInteractive(true)}
                onMouseLeave={() => setIsHoveredInteractive(false)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-[#C5A880] text-white hover:text-neutral-950 text-xs tracking-widest uppercase font-semibold transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingWish ? 'Đang gửi...' : 'Gửi Lời Chúc'}</span>
              </button>
            </form>

            {/* Wishes Feed */}
            <div className="max-h-[420px] overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {wishes.filter((w) => w.isApproved !== false).length > 0 ? (
                wishes.filter((w) => w.isApproved !== false).map((w, idx) => (
                  <div key={w.id || idx} className="p-4 bg-white/60 border-l-2 border-neutral-900 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-900">
                        {w.authorName || (w as any).author || 'Khách quý'}
                      </span>
                      <span className="text-[10px] tracking-widest text-[#C5A880] uppercase font-medium">
                        {w.relation}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed font-serif-title italic text-base">
                      &ldquo;{w.content}&rdquo;
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-neutral-400 border border-dashed border-neutral-300">
                  Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc phúc!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. FOOTER (Editorial Colophon)
          ========================================================================= */}
      <footer className="py-16 sm:py-20 border-t border-neutral-300/80 bg-[#121110] text-[#FBF9F5] px-6 sm:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-[11px] tracking-[0.35em] text-[#C5A880] uppercase font-medium">
            THANK YOU FOR BEING PART OF OUR JOURNEY
          </p>

          <h2 className="font-serif-title text-4xl sm:text-6xl text-white font-light uppercase tracking-tight">
            {data.groomName} &amp; {data.brideName}
          </h2>

          <p className="text-xs tracking-[0.25em] text-neutral-400 uppercase">
            {data.weddingDate || '20 DECEMBER 2026'} &bull; FOREVER WITH LOVE
          </p>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-widest text-neutral-500 uppercase gap-3">
            <span>DESIGNED WITH LUXURY EDITORIAL TEMPLATE</span>
            <span>L'AMOUR WEDDING &bull; ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          12. GIFT / BANK QR MODAL (Hộp Mừng Cưới)
          ========================================================================= */}
      <AnimatePresence>
        {giftModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#FBF9F5] text-neutral-900 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setGiftModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 mb-6">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold block">
                  WEDDING GIFT &bull; MỪNG CƯỚI
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl text-neutral-900 font-light uppercase">
                  Hộp Mừng Cưới Online
                </h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Dành cho những người bạn thân quý ở xa muốn gửi lời chúc phúc và quà mừng đến cặp đôi.
                </p>
              </div>

              {/* Bank tabs */}
              <div className="flex border-b border-neutral-300 mb-6">
                <button
                  onClick={() => setActiveBankTab('groom')}
                  className={`flex-1 py-2.5 text-xs tracking-widest uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeBankTab === 'groom'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Chú Rể ({data.groomName})
                </button>
                <button
                  onClick={() => setActiveBankTab('bride')}
                  className={`flex-1 py-2.5 text-xs tracking-widest uppercase font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeBankTab === 'bride'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Cô Dâu ({data.brideName})
                </button>
              </div>

              {/* Bank Content */}
              {(() => {
                const bank =
                  activeBankTab === 'groom' ? data.gift?.groomBank : data.gift?.brideBank;
                if (!bank || !bank.accountNumber) {
                  return (
                    <div className="p-6 text-center text-xs text-neutral-500">
                      Chưa cập nhật thông tin tài khoản mừng cưới.
                    </div>
                  );
                }

                const qrUrl =
                  bank.qrCodeUrl ||
                  `https://img.vietqr.io/image/${bank.bankName}-${bank.accountNumber}-compact.png?amount=0&addInfo=${encodeURIComponent(
                    `Mung cuoi ${data.groomName} ${data.brideName}`
                  )}&accountName=${encodeURIComponent(bank.accountHolder)}`;

                return (
                  <div className="space-y-6 text-center">
                    {/* QR Code image */}
                    <div>
                      <div
                        onClick={() =>
                          openQRZoom({
                            qrUrl,
                            title: `Mừng Cưới ${activeBankTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'} - ${bank.accountHolder}`,
                            bankName: bank.bankName,
                            accountNumber: bank.accountNumber,
                            accountHolder: bank.accountHolder,
                            note: `Mung cuoi ${data.groomName} ${data.brideName}`,
                          })
                        }
                        className="w-52 h-52 mx-auto bg-white p-3 border border-neutral-300 shadow-sm relative group cursor-pointer hover:border-black transition-all hover:scale-105 active:scale-95"
                        title="Chạm để phóng to mã QR"
                        data-qr-zoom="true"
                        data-qr-url={qrUrl}
                        data-qr-title={`Mừng Cưới ${activeBankTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'} - ${bank.accountHolder}`}
                        data-qr-bank={bank.bankName}
                        data-qr-account={bank.accountNumber}
                        data-qr-holder={bank.accountHolder}
                      >
                        <img src={qrUrl} alt="VietQR" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 p-2">
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
                            qrUrl,
                            title: `Mừng Cưới ${activeBankTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'} - ${bank.accountHolder}`,
                            bankName: bank.bankName,
                            accountNumber: bank.accountNumber,
                            accountHolder: bank.accountHolder,
                            note: `Mung cuoi ${data.groomName} ${data.brideName}`,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-black font-mono mt-2 cursor-pointer"
                      >
                        <ZoomIn className="w-3 h-3" />
                        <span>Bấm vào hình để phóng to mã QR</span>
                      </button>
                    </div>

                    {/* Account details */}
                    <div className="space-y-2 bg-white/80 p-4 border border-neutral-200 text-left text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Ngân hàng</span>
                        <span className="font-semibold text-neutral-900">{bank.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Số tài khoản</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900">{bank.accountNumber}</span>
                          <button
                            onClick={() => handleCopyAccount(bank.accountNumber)}
                            className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                            title="Sao chép"
                          >
                            {copiedAccount === bank.accountNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Chủ tài khoản</span>
                        <span className="font-semibold uppercase text-neutral-900">{bank.accountHolder}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyAccount(bank.accountNumber)}
                      className="w-full py-3 bg-neutral-900 hover:bg-[#C5A880] text-white hover:text-neutral-950 text-xs tracking-widest uppercase font-semibold transition-colors cursor-pointer"
                    >
                      {copiedAccount === bank.accountNumber ? 'Đã sao chép STK!' : 'Sao chép số tài khoản'}
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <LightboxModal
          photos={galleryImages}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={(idx) => setLightboxIndex(idx)}
        />
      )}

      {/* Floating Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />
    </div>
  );
}
