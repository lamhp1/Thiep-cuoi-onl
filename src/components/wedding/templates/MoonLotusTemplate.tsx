import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../../types';
import { MoonLotusCanvas } from './moon-lotus/MoonLotusCanvas';
import { LotusPetalsFalling } from './moon-lotus/MoonLotusOrnaments';
import { MoonLotusOpening } from './moon-lotus/MoonLotusOpening';
import { MoonLotusHeroSection } from './moon-lotus/MoonLotusHeroSection';
import { MoonLotusCenterpieceWedding } from './moon-lotus/MoonLotusCenterpieceWedding';
import { MoonLotusCoupleSection } from './moon-lotus/MoonLotusCoupleSection';
import { MoonLotusStorySection } from './moon-lotus/MoonLotusStorySection';
import { MoonLotusEventsSection } from './moon-lotus/MoonLotusEventsSection';
import { MoonLotusGallerySection } from './moon-lotus/MoonLotusGallerySection';
import { MoonLotusGiftSection } from './moon-lotus/MoonLotusGiftSection';
import { MoonLotusRSVPSection } from './moon-lotus/MoonLotusRSVPSection';
import { MoonLotusWishesSection } from './moon-lotus/MoonLotusWishesSection';
import { MoonLotusFinaleSection } from './moon-lotus/MoonLotusFinaleSection';
import { MoonLotusAudioBar } from './moon-lotus/MoonLotusAudioBar';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import { Moon, Sparkles, Heart } from 'lucide-react';

interface MoonLotusTemplateProps {
  data: WeddingData;
  isDemo?: boolean;
}

export function MoonLotusTemplate({ data, isDemo = false }: MoonLotusTemplateProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll for interactive moon movement, cloud drifting, and blooming lotus
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const groomName = data.groom?.fullName || data.groom?.name || 'MINH ANH';
  const brideName = data.bride?.fullName || data.bride?.name || 'NGỌC MAI';
  const weddingDate = data.weddingDate || '20 • 12 • 2026';
  const city = data.city || 'TP. Huế';
  const musicUrl = data.musicUrl;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative min-h-screen text-[#FDFBF7] font-serif overflow-x-hidden selection:bg-[#751A29] selection:text-[#F4E4BA]"
      style={{
        // Visual theme: Burgundy transitioning into Midnight Blue
        background: 'linear-gradient(180deg, #350814 0%, #200921 15%, #120D2A 35%, #080C22 55%, #050817 75%, #030510 100%)',
      }}
    >
      {/* 1. Dynamic Starlight Canvas (Twinkling stars & occasional shooting stars) */}
      <MoonLotusCanvas />

      {/* 2. Soft Falling Lotus Petals drifting in the breeze */}
      <LotusPetalsFalling />

      {/* 3. Opening Invitation Ceremony Envelope / Gate */}
      {!hasOpened && (
        <MoonLotusOpening
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          city={city}
          musicUrl={musicUrl}
          onEnter={() => setHasOpened(true)}
        />
      )}

      {/* 4. Floating Luxury Navigation Header */}
      <nav className="fixed top-0 inset-x-0 z-40 px-4 py-3 bg-[#0A0D22]/75 backdrop-blur-md border-b border-[#EBD494]/20 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo / Couple Title */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer flex items-center gap-2 text-xs sm:text-sm font-serif-title font-bold text-[#FFFDF7] hover:text-[#EBD494] transition-colors"
          >
            <Moon className="w-4 h-4 text-[#EBD494]" />
            <span>{groomName} &amp; {brideName}</span>
          </div>

          {/* Quick Anchor Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-serif uppercase tracking-widest text-[#F4E4BA]/80">
            <button
              onClick={() => scrollToSection('couple')}
              className="cursor-pointer hover:text-[#EBD494] transition-colors"
            >
              Uyên Ương
            </button>
            <button
              onClick={() => scrollToSection('wedding-centerpiece')}
              className="cursor-pointer hover:text-[#EBD494] text-[#EBD494] font-semibold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Dạ Nguyệt</span>
            </button>
            <button
              onClick={() => scrollToSection('story')}
              className="cursor-pointer hover:text-[#EBD494] transition-colors"
            >
              Tuần Trăng
            </button>
            <button
              onClick={() => scrollToSection('events')}
              className="cursor-pointer hover:text-[#EBD494] transition-colors"
            >
              Sự Kiện
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="cursor-pointer hover:text-[#EBD494] transition-colors"
            >
              Ảnh Cưới
            </button>
            <button
              onClick={() => scrollToSection('gift')}
              className="cursor-pointer hover:text-[#EBD494] transition-colors"
            >
              Mừng Cưới
            </button>
            <button
              onClick={() => scrollToSection('wishes')}
              className="cursor-pointer hover:text-[#EBD494] transition-colors"
            >
              Sổ Lưu Bút
            </button>
          </div>

          {/* RSVP Button */}
          <button
            onClick={() => scrollToSection('rsvp')}
            className="cursor-pointer px-4 py-1.5 rounded-full bg-gradient-to-r from-[#751A29] to-[#A8283D] hover:from-[#8C2033] hover:to-[#B83047] border border-[#EBD494]/60 text-white font-serif text-xs font-semibold uppercase tracking-wider shadow-sm transition-all hover:scale-105"
          >
            RSVP
          </button>
        </div>
      </nav>

      {/* Personalized Guest Welcome Banner */}
      <div className="pt-14 relative z-30">
        <PersonalizedWelcomeBanner
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          accentColor="#EBD494"
        />
      </div>

      {/* 5. Main Content Sections */}
      <main className="relative z-20">
        {/* Section 1: Hero Section */}
        <MoonLotusHeroSection
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          romanticQuote={data.romanticQuote}
          coverImage={data.coverImage}
          scrollProgress={scrollProgress}
          onRSVPClick={() => scrollToSection('rsvp')}
          onExploreClick={() => scrollToSection('wedding-centerpiece')}
        />

        {/* Section 2: THE WEDDING CENTERPIECE (trăng nằm chính giữa) */}
        <MoonLotusCenterpieceWedding
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          scrollProgress={scrollProgress}
        />

        {/* Section 3: Couple Section (Tân Lang & Tân Nương) */}
        <MoonLotusCoupleSection
          groom={data.groom}
          bride={data.bride}
        />

        {/* Section 4: Story Timeline (Biên Niên Sử Tuần Trăng) */}
        <MoonLotusStorySection
          milestones={data.stories}
          scrollProgress={scrollProgress}
        />

        {/* Section 5: Events (Lịch Trình Hôn Lễ) */}
        <MoonLotusEventsSection
          events={data.events || []}
          groomName={groomName}
          brideName={brideName}
        />

        {/* Section 6: Photo Gallery (Album Khoảnh Khắc Dạ Nguyệt) */}
        <MoonLotusGallerySection gallery={data.gallery || []} />

        {/* Section 7: VietQR Gift Box (Hộp Mừng Cưới Tráp Ngọc Sen) */}
        <MoonLotusGiftSection
          groomBank={data.gift?.groomBank}
          brideBank={data.gift?.brideBank}
          groomName={groomName}
          brideName={brideName}
        />

        {/* Section 8: RSVP Form (Xác Nhận Tham Dự) */}
        <MoonLotusRSVPSection
          groomName={groomName}
          brideName={brideName}
        />

        {/* Section 9: Guest Wishes (Thả Hoa Sen Cầu Chúc Dưới Trăng) */}
        <MoonLotusWishesSection
          weddingId={data.id}
          groomName={groomName}
          brideName={brideName}
        />

        {/* Section 10: Finale & Footer */}
        <MoonLotusFinaleSection
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          onReopenEnvelope={() => {
            setHasOpened(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>

      {/* 6. Floating Audio Bar */}
      <MoonLotusAudioBar musicUrl={musicUrl} />
    </div>
  );
}
