import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../../../types';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { PassportPaperTexture } from './passport/PassportOrnaments';
import { PassportCoverOpening } from './passport/PassportCoverOpening';
import { PassportIdentityPage } from './passport/PassportIdentityPage';
import { PassportCoupleSection } from './passport/PassportCoupleSection';
import { PassportDestinationCountdown } from './passport/PassportDestinationCountdown';
import { PassportBoardingPass } from './passport/PassportBoardingPass';
import { PassportJourneyTimeline } from './passport/PassportJourneyTimeline';
import { PassportMemoriesGallery } from './passport/PassportMemoriesGallery';
import { PassportEventsItinerary } from './passport/PassportEventsItinerary';
import { PassportGiftSection } from './passport/PassportGiftSection';
import { PassportRSVPSection } from './passport/PassportRSVPSection';
import { PassportTravelNotes } from './passport/PassportTravelNotes';
import { PassportFinalDestination } from './passport/PassportFinalDestination';
import { submitRSVP } from '../../../services/rsvpService';
import { submitWish, getWishes } from '../../../services/wishesService';
import { Menu, X, Settings, Heart, Plane, BookOpen, Compass } from 'lucide-react';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';

interface PassportLoveTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function PassportLoveTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: PassportLoveTemplateProps) {
  const [isCoverOpened, setIsCoverOpened] = useState(!showEnvelopeImmediately);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentWishes, setCurrentWishes] = useState<any[]>([]);

  useEffect(() => {
    setIsCoverOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  // Fetch wishes if wedding id is present
  useEffect(() => {
    let mounted = true;
    const fetchWishes = () => {
      if (data.id) {
        getWishes(data.id)
          .then((fetched) => {
            if (mounted) setCurrentWishes(fetched || []);
          })
          .catch((err) => console.warn('Could not fetch wishes:', err));
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

  const groomName =
    data.groom?.fullName || data.groomName || data.groom?.name || 'Chú Rể';
  const brideName =
    data.bride?.fullName || data.brideName || data.bride?.name || 'Cô Dâu';

  // Format display date
  const formattedDate = React.useMemo(() => {
    if (data.weddingDate) {
      if (data.weddingDate.includes('-')) {
        const parts = data.weddingDate.split('-');
        if (parts.length === 3) {
          return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
      }
      return data.weddingDate;
    }
    return '20.12.2026';
  }, [data.weddingDate]);

  const navLinks = [
    { href: '#identity', label: 'Hộ Chiếu' },
    { href: '#couple', label: 'Cặp Đôi' },
    { href: '#destination', label: 'Điểm Đến' },
    { href: '#boarding-pass', label: 'Vé Lên Tàu' },
    { href: '#story', label: 'Hành Trình' },
    { href: '#gallery', label: 'Kỷ Niệm' },
    { href: '#events', label: 'Lịch Trình' },
    { href: '#rsvp', label: 'Xác Nhận' },
    { href: '#gift', label: 'Mừng Cưới' },
    { href: '#travel-notes', label: 'Lưu Bút' },
  ];

  const handleRSVPSubmit = async (rsvpData: {
    name: string;
    phone: string;
    attending: boolean;
    guestCount: number;
    message?: string;
  }) => {
    await submitRSVP({
      weddingId: data.id || 'demo-passport-love-01',
      fullName: rsvpData.name,
      phone: rsvpData.phone,
      attending: rsvpData.attending,
      guestsCount: rsvpData.guestCount,
      guestOf: 'both',
      message: rsvpData.message,
    });
  };

  const handleWishSubmit = async (wishData: { name: string; message: string }) => {
    const newWish = await submitWish({
      weddingId: data.id || 'demo-passport-love-01',
      authorName: wishData.name,
      content: wishData.message,
    });
    setCurrentWishes((prev) => [newWish, ...prev]);
  };

  return (
    <div className="template-passport-love relative min-h-screen bg-[#F5EEDF] text-[#41372F] font-sans selection:bg-[#651F2A]/20 selection:text-[#651F2A]">
      {/* 1. Subtle Paper Texture Background */}
      <PassportPaperTexture />

      {/* 2. Opening Screen: Bìa Hộ Chiếu 3D sang trọng mở trang */}
      {!isCoverOpened && (
        <PassportCoverOpening
          groomName={groomName}
          brideName={brideName}
          weddingDate={formattedDate}
          musicUrl={data.musicUrl}
          groomPhoto={data.groom?.avatar || data.coverImage}
          bridePhoto={data.bride?.avatar || data.coverImage}
          coverImage={data.coverImage}
          city={data.city || (data.events && data.events[0]?.address) || 'Hà Nội, Việt Nam'}
          onOpen={() => setIsCoverOpened(true)}
        />
      )}

      {/* 3. Floating Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* 4. Sticky Header Navigation: Editorial Travel Style */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#F5EEDF]/90 backdrop-blur-md border-b border-[#B99552]/30 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Monogram / Brand */}
          <a href="#" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#651F2A] border border-[#B99552] flex items-center justify-center text-[#B99552] shadow-xs">
              <Plane className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <span className="font-serif-title text-base sm:text-lg font-bold tracking-wider text-[#172A3A] group-hover:text-[#651F2A] transition-colors uppercase block leading-none">
                {groomName} ♥ {brideName}
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#651F2A] font-bold block uppercase">
                LOVE PASSPORT • 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-mono font-bold uppercase tracking-wider text-[#41372F] hover:text-[#651F2A] transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Reopen Cover button */}
            <button
              type="button"
              onClick={() => setIsCoverOpened(false)}
              className="p-1.5 rounded-full hover:bg-[#651F2A]/10 text-[#651F2A] transition-colors cursor-pointer"
              title="Xem lại bìa hộ chiếu"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#651F2A] text-white text-xs font-semibold hover:bg-[#8E2835] transition-all shadow-xs cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Quản Trị</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsCoverOpened(false)}
              className="p-2 rounded-lg bg-[#FCFAF5] text-[#651F2A] border border-[#B99552]/40"
              title="Bìa hộ chiếu"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="p-2 rounded-lg bg-[#651F2A] text-white"
                title="Quản trị"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#FCFAF5] text-[#172A3A] border border-[#B99552]/40"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#FCFAF5] border-b border-[#B99552]/40 shadow-xl px-4 py-4 space-y-2"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#41372F] hover:text-[#651F2A] hover:bg-[#F5EEDF] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content Layout */}
      <main className="relative z-10 pt-16">
        {/* VIP Passenger Personalized Greeting Banner */}
        <PersonalizedWelcomeBanner
          groomName={groomName}
          brideName={brideName}
          weddingDate={formattedDate}
          accentColor="#B99552"
        />

        {/* 1. Identity Page (Passport Of Love) */}
        <PassportIdentityPage
          groom={data.groom}
          bride={data.bride}
          groomName={groomName}
          brideName={brideName}
          weddingDate={formattedDate}
          weddingCity={data.city || (data.events && data.events[0]?.address) || 'Việt Nam'}
          coverImage={data.coverImage}
        />

        {/* 2. Travel Companions (Couple Profile) */}
        <PassportCoupleSection
          groom={data.groom}
          bride={data.bride}
          groomName={groomName}
          brideName={brideName}
        />

        {/* 3. Next Destination & Departure Countdown */}
        <PassportDestinationCountdown
          weddingDate={data.weddingDate || '2026-12-20'}
          city={data.city || (data.events && data.events[0]?.address) || 'Hà Nội, Việt Nam'}
          locationName={data.events && data.events[0]?.locationName}
        />

        {/* 4. Wedding Boarding Pass */}
        <PassportBoardingPass
          groomName={groomName}
          brideName={brideName}
          weddingDate={formattedDate}
          weddingTime={data.events && data.events[0]?.time ? data.events[0].time : '10:00'}
          weddingCity={data.city}
        />

        {/* 5. Love Journey Flight Route Timeline */}
        <PassportJourneyTimeline
          stories={data.stories}
          groomName={groomName}
          brideName={brideName}
        />

        {/* 6. Travel Memories (Instant Photo / Polaroid Gallery) */}
        <PassportMemoriesGallery gallery={data.gallery} />

        {/* 7. Flight Itinerary / Stops */}
        <PassportEventsItinerary
          events={data.events}
          weddingDate={formattedDate}
        />

        {/* 8. A Little Gift (VietQR & Registry) */}
        <PassportGiftSection
          gift={data.gift}
          groomName={groomName}
          brideName={brideName}
        />

        {/* 9. Flight Reservation / RSVP Ticket Waiting */}
        <PassportRSVPSection
          weddingId={data.id}
          onRSVPSubmit={handleRSVPSubmit}
        />

        {/* 10. Travel Notes / Guestbook Postcards */}
        <PassportTravelNotes
          wishes={currentWishes}
          groomName={groomName}
          brideName={brideName}
          onSendWish={handleWishSubmit}
        />

        {/* 11. Final Destination & Passport Back Cover */}
        <PassportFinalDestination
          groomName={groomName}
          brideName={brideName}
          weddingDate={formattedDate}
          coverImage={data.coverImage}
          onReopenPassport={() => {
            setIsCoverOpened(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>
    </div>
  );
}
