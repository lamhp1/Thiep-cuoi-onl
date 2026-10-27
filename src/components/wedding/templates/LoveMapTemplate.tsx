import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../../types';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { LoveMapPaperTexture, CompassRose } from './love-map/LoveMapOrnaments';
import { LoveMapOpening } from './love-map/LoveMapOpening';
import { LoveMapHero } from './love-map/LoveMapHero';
import { LoveMapCoupleSection } from './love-map/LoveMapCoupleSection';
import { LoveMapInteractiveMap } from './love-map/LoveMapInteractiveMap';
import { LoveMapJourneyTimeline } from './love-map/LoveMapJourneyTimeline';
import { LoveMapMemoryDestinations } from './love-map/LoveMapMemoryDestinations';
import { LoveMapWeddingDestination } from './love-map/LoveMapWeddingDestination';
import { LoveMapEventsSection } from './love-map/LoveMapEventsSection';
import { LoveMapGallery } from './love-map/LoveMapGallery';
import { LoveMapGiftSection } from './love-map/LoveMapGiftSection';
import { LoveMapRSVPSection } from './love-map/LoveMapRSVPSection';
import { LoveMapFooter } from './love-map/LoveMapFooter';
import { submitRSVP } from '../../../services/rsvpService';
import { Menu, X, Settings, Heart, Compass, MapPin } from 'lucide-react';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';

interface LoveMapTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function LoveMapTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: LoveMapTemplateProps) {
  const [isJourneyStarted, setIsJourneyStarted] = useState(!showEnvelopeImmediately);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsJourneyStarted(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const groomName = data.groom?.fullName || data.groomName || 'Chú Rể';
  const brideName = data.bride?.fullName || data.brideName || 'Cô Dâu';
  const weddingDate = data.weddingDate || '20.12.2026';

  // Primary event for wedding destination info
  const primaryEvent = data.events && data.events.length > 0 ? data.events[0] : undefined;

  const handleRSVPSubmit = async (rsvpData: {
    name: string;
    phone: string;
    attending: boolean;
    guestCount: number;
    message?: string;
  }) => {
    await submitRSVP({
      weddingId: data.id || 'demo-wedding',
      fullName: rsvpData.name,
      phone: rsvpData.phone,
      attending: rsvpData.attending,
      guestsCount: rsvpData.guestCount,
      guestOf: 'both',
      message: rsvpData.message || '',
    });
  };

  const handleScrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartJourney = () => {
    setIsJourneyStarted(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#F5EFE3] text-[#443B35] font-sans antialiased relative selection:bg-[#722238] selection:text-[#FFFDF9]">
      {/* Background paper texture overlay */}
      <LoveMapPaperTexture />

      {/* Opening Screen (Can be dismissed by clicking Start the Journey) */}
      {!isJourneyStarted && (
        <LoveMapOpening
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          onStartJourney={handleStartJourney}
        />
      )}

      {/* Floating Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#F5EFE3]/90 backdrop-blur-md border-b border-[#B9985A]/30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => handleScrollToSection('hero')}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <Compass className="w-4 h-4 text-[#722238] group-hover:rotate-45 transition-transform" />
            <span className="font-serif-title font-bold text-sm tracking-wider text-[#443B35]">
              {groomName} &amp; {brideName}
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-[#B9985A] font-semibold">
              • LOVE MAP
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#443B35]/80">
            <button
              onClick={() => handleScrollToSection('couple')}
              className="hover:text-[#722238] transition-colors cursor-pointer"
            >
              CẶP ĐÔI
            </button>
            <button
              onClick={() => handleScrollToSection('love-map')}
              className="hover:text-[#722238] transition-colors cursor-pointer text-[#722238]"
            >
              BẢN ĐỒ
            </button>
            <button
              onClick={() => handleScrollToSection('journey-timeline')}
              className="hover:text-[#722238] transition-colors cursor-pointer"
            >
              HÀNH TRÌNH
            </button>
            <button
              onClick={() => handleScrollToSection('wedding-destination')}
              className="hover:text-[#722238] transition-colors cursor-pointer"
            >
              ĐIỂM ĐẾN
            </button>
            <button
              onClick={() => handleScrollToSection('events')}
              className="hover:text-[#722238] transition-colors cursor-pointer"
            >
              SỰ KIỆN
            </button>
            <button
              onClick={() => handleScrollToSection('gallery')}
              className="hover:text-[#722238] transition-colors cursor-pointer"
            >
              ALBUM ẢNH
            </button>
            <button
              onClick={() => handleScrollToSection('rsvp')}
              className="px-3.5 py-1.5 rounded-full bg-[#722238] text-white hover:bg-[#581728] transition-colors cursor-pointer text-[11px]"
            >
              XÁC NHẬN (RSVP)
            </button>
          </nav>

          {/* Mobile Hamburger & Admin controls */}
          <div className="flex items-center gap-2">
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#B9985A]/40 text-[#722238] text-[11px] font-semibold tracking-wider hover:bg-[#F5EFE3] transition-colors shadow-xs cursor-pointer"
                title="Quản trị thiệp cưới"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">QUẢN TRỊ</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#443B35] hover:bg-[#B9985A]/15 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 bg-[#FFFDF9] border-b border-[#B9985A]/30 shadow-lg space-y-2 text-center text-xs font-bold uppercase tracking-wider text-[#443B35]">
            <button
              onClick={() => handleScrollToSection('couple')}
              className="block w-full py-2 hover:text-[#722238]"
            >
              CẶP ĐÔI
            </button>
            <button
              onClick={() => handleScrollToSection('love-map')}
              className="block w-full py-2 text-[#722238]"
            >
              BẢN ĐỒ TÌNH YÊU
            </button>
            <button
              onClick={() => handleScrollToSection('journey-timeline')}
              className="block w-full py-2 hover:text-[#722238]"
            >
              DÒNG THỜI GIAN
            </button>
            <button
              onClick={() => handleScrollToSection('memory-destinations')}
              className="block w-full py-2 hover:text-[#722238]"
            >
              BƯU THIẾP KỶ NIỆM
            </button>
            <button
              onClick={() => handleScrollToSection('wedding-destination')}
              className="block w-full py-2 hover:text-[#722238]"
            >
              ĐIỂM ĐẾN HÔN LỄ
            </button>
            <button
              onClick={() => handleScrollToSection('events')}
              className="block w-full py-2 hover:text-[#722238]"
            >
              LỊCH TRÌNH SỰ KIỆN
            </button>
            <button
              onClick={() => handleScrollToSection('gallery')}
              className="block w-full py-2 hover:text-[#722238]"
            >
              ALBUM ẢNH
            </button>
            <button
              onClick={() => handleScrollToSection('gift')}
              className="block w-full py-2 hover:text-[#722238]"
            >
              MỪNG CƯỚI
            </button>
            <button
              onClick={() => handleScrollToSection('rsvp')}
              className="block w-full py-2 text-[#722238]"
            >
              XÁC NHẬN THAM DỰ (RSVP)
            </button>
          </div>
        )}
      </header>

      {/* Main Template Content Sections */}
      <main className="relative">
        {/* VIP Traveler Personalized Greeting Banner */}
        <PersonalizedWelcomeBanner
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          accentColor="#B9985A"
        />

        {/* 1. Hero Section */}
        <LoveMapHero
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          weddingLocation={primaryEvent?.locationName}
          stories={data.stories || []}
          heroImage={data.coverImage || data.gallery?.[0]?.url}
          onExploreMap={() => handleScrollToSection('love-map')}
        />

        {/* 2. Couple Section */}
        <LoveMapCoupleSection
          groom={data.groom}
          bride={data.bride}
          weddingDate={weddingDate}
        />

        {/* 3. Interactive Illustrated Love Map (Main centerpiece) */}
        <LoveMapInteractiveMap
          stories={data.stories || []}
          activeIndex={activeStoryIndex}
          onSelectIndex={setActiveStoryIndex}
          onViewTimeline={() => handleScrollToSection('journey-timeline')}
        />

        {/* 4. Journey Timeline (Synchronized 2-way with Map) */}
        <LoveMapJourneyTimeline
          stories={data.stories || []}
          activeIndex={activeStoryIndex}
          onSelectIndex={setActiveStoryIndex}
        />

        {/* 5. Memory Destinations (Postcards of Love) */}
        <LoveMapMemoryDestinations
          stories={data.stories || []}
          onSelectStory={setActiveStoryIndex}
        />

        {/* 6. Wedding Destination & Boarding Pass & Countdown */}
        <LoveMapWeddingDestination
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          locationName={primaryEvent?.locationName}
          address={primaryEvent?.address}
          mapUrl={primaryEvent?.mapUrl}
        />

        {/* 7. Events Itinerary */}
        <LoveMapEventsSection events={data.events || []} />

        {/* 8. Travel Photo Gallery */}
        <LoveMapGallery gallery={data.gallery || []} />

        {/* 9. Wedding Gift / QR / Tag Section */}
        <LoveMapGiftSection
          giftInfo={data.gift}
          groomName={groomName}
          brideName={brideName}
        />

        {/* 10. RSVP Section */}
        <LoveMapRSVPSection
          onSubmitRSVP={handleRSVPSubmit}
          weddingDate={weddingDate}
        />
      </main>

      {/* Footer */}
      <LoveMapFooter
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
      />

      {/* Background Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />
    </div>
  );
}
