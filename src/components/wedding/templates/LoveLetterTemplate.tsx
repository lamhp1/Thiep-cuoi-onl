import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../../types';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { submitRSVP } from '../../../services/rsvpService';
import { Menu, X, Settings, Heart, Mail, Feather } from 'lucide-react';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import {
  LoveLetterPaperTexture,
  LoveLetterWaxSeal,
  StationeryDeskBackground,
} from './love-letter/LoveLetterOrnaments';
import { LoveLetterEnvelopeOpening } from './love-letter/LoveLetterEnvelopeOpening';
import { LoveLetterIntroSection } from './love-letter/LoveLetterIntroSection';
import { LoveLetterMainLetter } from './love-letter/LoveLetterMainLetter';
import { LoveLetterCoupleSection } from './love-letter/LoveLetterCoupleSection';
import { LoveLetterStorySection } from './love-letter/LoveLetterStorySection';
import { LoveLetterPolaroidGallery } from './love-letter/LoveLetterPolaroidGallery';
import { LoveLetterEventsSection } from './love-letter/LoveLetterEventsSection';
import { LoveLetterGiftSection } from './love-letter/LoveLetterGiftSection';
import { LoveLetterRSVPSection } from './love-letter/LoveLetterRSVPSection';
import { LoveLetterGuestbookSection } from './love-letter/LoveLetterGuestbookSection';
import { LoveLetterFinalLetter } from './love-letter/LoveLetterFinalLetter';

interface LoveLetterTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function LoveLetterTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: LoveLetterTemplateProps) {
  const [isLetterOpened, setIsLetterOpened] = useState(!showEnvelopeImmediately);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLetterOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const groomName = data.groom?.fullName || data.groomName || 'Chú Rể';
  const brideName = data.bride?.fullName || data.brideName || 'Cô Dâu';
  const weddingDate = data.weddingDate || '20.12.2026';
  const city = data.events?.[0]?.locationName || 'TP. HUẾ';

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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F1E7] text-[#59483E] font-serif antialiased relative selection:bg-[#7A2638] selection:text-[#FFFDF8]">
      {/* Paper texture grain & ruled notebook lines across entire letter */}
      <LoveLetterPaperTexture />

      {/* Stationery Desk Background Decor: Fountain Pens, Postage Stamps, Airmail Letters, Paperclips */}
      <StationeryDeskBackground weddingDate={weddingDate} city={city} />

      {/* Opening Envelope Screen */}
      {!isLetterOpened && (
        <LoveLetterEnvelopeOpening
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          city={city}
          onOpenLetter={() => {
            setIsLetterOpened(true);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }}
        />
      )}

      {/* Stationery Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#F7F1E7]/90 backdrop-blur-md border-b border-[#C8A96B]/30 transition-all shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <Feather className="w-4 h-4 text-[#7A2638] group-hover:rotate-12 transition-transform" />
            <span className="font-handwriting font-bold text-xl sm:text-2xl text-[#59483E]">
              {groomName} &amp; {brideName}
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-[#C8A96B] font-semibold">
              • BỨC THƯ TÌNH
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-serif font-medium text-[#59483E]">
            <button
              onClick={() => handleScrollToSection('intro')}
              className="hover:text-[#7A2638] transition-colors cursor-pointer"
            >
              LỜI MỞ ĐẦU
            </button>
            <button
              onClick={() => handleScrollToSection('main-letter')}
              className="hover:text-[#7A2638] transition-colors cursor-pointer text-[#7A2638]"
            >
              LÁ THƯ TÌNH
            </button>
            <button
              onClick={() => handleScrollToSection('couple')}
              className="hover:text-[#7A2638] transition-colors cursor-pointer"
            >
              TÁC GIẢ
            </button>
            <button
              onClick={() => handleScrollToSection('story')}
              className="hover:text-[#7A2638] transition-colors cursor-pointer"
            >
              DÒNG KÝ ỨC
            </button>
            <button
              onClick={() => handleScrollToSection('events')}
              className="hover:text-[#7A2638] transition-colors cursor-pointer"
            >
              THƯ MỜI &amp; LỊCH TRÌNH
            </button>
            <button
              onClick={() => handleScrollToSection('gallery')}
              className="hover:text-[#7A2638] transition-colors cursor-pointer"
            >
              KỶ NIỆM
            </button>
            <button
              onClick={() => handleScrollToSection('gift')}
              className="hover:text-[#7A2638] transition-colors cursor-pointer"
            >
              HỘP MỪNG
            </button>
            <button
              onClick={() => handleScrollToSection('rsvp')}
              className="px-4 py-1.5 rounded-full bg-[#7A2638] text-[#FFFDF8] hover:bg-[#631c2c] transition-colors cursor-pointer text-[11px] font-serif-title font-semibold shadow-xs"
            >
              XÁC NHẬN THAM DỰ
            </button>
          </nav>

          {/* Right Actions: Admin & Mobile menu */}
          <div className="flex items-center gap-2">
            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="p-2 rounded-full hover:bg-[#EADECE] text-[#59483E] transition-colors cursor-pointer"
                title="Quản trị thiệp cưới"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-[#EADECE] text-[#59483E] transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF8] border-b border-[#C8A96B]/30 px-6 py-4 space-y-3 font-serif text-sm shadow-xl">
            <button
              onClick={() => handleScrollToSection('intro')}
              className="block w-full text-left py-1 text-[#59483E] hover:text-[#7A2638]"
            >
              Lời mở đầu
            </button>
            <button
              onClick={() => handleScrollToSection('main-letter')}
              className="block w-full text-left py-1 text-[#7A2638] font-bold"
            >
              Lá thư tình chính
            </button>
            <button
              onClick={() => handleScrollToSection('couple')}
              className="block w-full text-left py-1 text-[#59483E] hover:text-[#7A2638]"
            >
              Tác giả bức thư (Dâu rể)
            </button>
            <button
              onClick={() => handleScrollToSection('story')}
              className="block w-full text-left py-1 text-[#59483E] hover:text-[#7A2638]"
            >
              Dòng ký ức tình yêu
            </button>
            <button
              onClick={() => handleScrollToSection('events')}
              className="block w-full text-left py-1 text-[#59483E] hover:text-[#7A2638]"
            >
              Thư mời &amp; Lịch trình hôn lễ
            </button>
            <button
              onClick={() => handleScrollToSection('gallery')}
              className="block w-full text-left py-1 text-[#59483E] hover:text-[#7A2638]"
            >
              Bàn ảnh Scrapbook
            </button>
            <button
              onClick={() => handleScrollToSection('gift')}
              className="block w-full text-left py-1 text-[#59483E] hover:text-[#7A2638]"
            >
              Hộp mừng cưới
            </button>
            <button
              onClick={() => handleScrollToSection('rsvp')}
              className="block w-full text-left py-2 px-3 rounded-xl bg-[#7A2638] text-[#FFFDF8] font-serif-title font-semibold text-center"
            >
              Xác nhận tham dự (RSVP)
            </button>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main className="relative">
        {/* VIP Reader Personalized Greeting Banner */}
        <PersonalizedWelcomeBanner
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          accentColor="#7A2638"
        />

        {/* 1. Letter Introduction */}
        <LoveLetterIntroSection
          groomName={groomName}
          brideName={brideName}
          romanticQuote={data.romanticQuote}
        />

        {/* 2. Main Love Letter */}
        <LoveLetterMainLetter
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          city={city}
        />

        {/* 3. The Authors / Couple Section */}
        {data.groom && data.bride && (
          <LoveLetterCoupleSection
            groom={data.groom}
            bride={data.bride}
          />
        )}

        {/* 4. Our Story / Milestones Notes */}
        {data.stories && data.stories.length > 0 && (
          <LoveLetterStorySection stories={data.stories} />
        )}

        {/* 5. Wedding Details & Events */}
        {data.events && data.events.length > 0 && (
          <LoveLetterEventsSection
            events={data.events}
            weddingDate={weddingDate}
            weddingDateTime={data.weddingDateTime}
          />
        )}

        {/* 6. Scrapbook Polaroid Gallery */}
        <LoveLetterPolaroidGallery gallery={data.gallery || []} />

        {/* 7. Wedding Gift / VietQR */}
        {data.gift && (
          <LoveLetterGiftSection
            gift={data.gift}
            groomName={groomName}
            brideName={brideName}
          />
        )}

        {/* 8. RSVP Section */}
        <LoveLetterRSVPSection
          weddingDate={weddingDate}
          onSubmitRSVP={handleRSVPSubmit}
        />

        {/* 9. Guestbook / Wishes */}
        <LoveLetterGuestbookSection />

        {/* 10. Final Letter & Footer */}
        <LoveLetterFinalLetter
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          backgroundImage={data.coverImage || data.gallery?.[0]?.url}
          onScrollToTop={handleScrollToTop}
        />
      </main>

      {/* Floating Music Player */}
      {data.musicUrl && (
        <FloatingMusicPlayer
          musicUrl={data.musicUrl}
        />
      )}
    </div>
  );
}
