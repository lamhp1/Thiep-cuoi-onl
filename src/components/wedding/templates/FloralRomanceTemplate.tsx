import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../../../types';
import { EnvelopeCurtain } from '../../ui/EnvelopeCurtain';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { FloralScrollPetals } from '../floral-romance/FloralScrollPetals';
import { FloralHeroSection } from '../floral-romance/FloralHeroSection';
import { FloralCoupleSection } from '../floral-romance/FloralCoupleSection';
import { FloralCountdown } from '../floral-romance/FloralCountdown';
import { FloralStorySection } from '../floral-romance/FloralStorySection';
import { FloralEventsSection } from '../floral-romance/FloralEventsSection';
import { FloralMasonryGallery } from '../floral-romance/FloralMasonryGallery';
import { FloralRSVPSection } from '../floral-romance/FloralRSVPSection';
import { FloralWishesSection } from '../floral-romance/FloralWishesSection';
import { FloralGiftSection } from '../floral-romance/FloralGiftSection';
import { Heart, Menu, X, Settings } from 'lucide-react';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';

interface FloralRomanceTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function FloralRomanceTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: FloralRomanceTemplateProps) {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(!showEnvelopeImmediately);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsEnvelopeOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  // Formatted date string for Hero & Countdown: e.g. "20.12.2026"
  const formattedDate = React.useMemo(() => {
    if (data.weddingDate) {
      const parts = data.weddingDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    }
    return '20.12.2026';
  }, [data.weddingDate]);

  const navLinks = [
    { href: '#couple', label: 'Cặp Đôi' },
    ...(data.stories && data.stories.length > 0 ? [{ href: '#story', label: 'Chuyện Tình' }] : []),
    { href: '#events', label: 'Sự Kiện' },
    { href: '#gallery', label: 'Album Ảnh' },
    { href: '#rsvp', label: 'Xác Nhận' },
    { href: '#wishes', label: 'Lời Chúc' },
    { href: '#gift', label: 'Mừng Cưới' },
  ];

  return (
    <div className="relative min-h-screen bg-[#FFFDFD] text-[#3E2E31] font-body selection:bg-[#FCE4EC] selection:text-[#C2185B]">
      {/* 1. Envelope Curtain opening on initial visit */}
      {!isEnvelopeOpened && (
        <EnvelopeCurtain
          groomName={data.groomName}
          brideName={data.brideName}
          weddingDate={data.events[0]?.date || data.weddingDate}
          musicUrl={data.musicUrl}
          onOpen={() => setIsEnvelopeOpened(true)}
        />
      )}

      {/* 2. Scroll-linked Floating Petals (Đặc biệt: 5–10 cánh hoa bay nhẹ theo scroll, không phải particle liên tục) */}
      <FloralScrollPetals />

      {/* 3. Floating Background Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* 4. Elegant Sticky Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#F2DCDD]/60 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Monogram */}
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#FCECEF] border border-[#D4AF37]/50 flex items-center justify-center text-[#D97D8A]">
              <Heart className="w-4 h-4 fill-[#D97D8A]/30" />
            </div>
            <span className="font-serif-title text-lg sm:text-xl font-medium tracking-wide text-[#3E2E31] group-hover:text-[#D97D8A] transition-colors">
              {data.groom.name} & {data.bride.name}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-widest text-[#7A696B] hover:text-[#D97D8A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Admin / Owner Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0F3] hover:bg-[#FCE4EC] border border-[#F2DCDD] text-xs font-semibold text-[#8C2343] transition-colors cursor-pointer"
                title="Quản trị thiệp"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quản Trị</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#7A696B] hover:bg-[#FCECEF] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-[#F2DCDD] px-6 py-4 space-y-3 shadow-lg"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold uppercase tracking-widest text-[#7A696B] hover:text-[#D97D8A] py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </header>

      {/* Personalized Welcome Banner */}
      <PersonalizedWelcomeBanner
        groomName={data.groom?.name || data.groomName || 'Chú Rể'}
        brideName={data.bride?.name || data.brideName || 'Cô Dâu'}
        weddingDate={formattedDate}
        accentColor="#D97D8A"
      />

      {/* 5. Main Content Flow adhering strictly to the requested sequence:
          - Hero
          - Couple
          - Countdown
          - Our Story
          - Events
          - Gallery (Masonry, 1 ảnh lớn xen kẽ nhiều ảnh nhỏ, hover scale 1.03, brightness 0.9, overlay hiện ngày chụp)
          - RSVP
          - Wishes
          - Hộp Mừng Cưới (Gift)
      */}
      <main>
        {/* Section 1: Hero */}
        <FloralHeroSection data={data} formattedDate={formattedDate} />

        {/* Section 2: Couple */}
        <FloralCoupleSection
          groom={data.groom}
          bride={data.bride}
          romanticQuote={data.romanticQuote}
        />

        {/* Section 3: Countdown */}
        <FloralCountdown
          targetDateStr={data.weddingDateTime || data.weddingDate}
          weddingDateDisplay={formattedDate}
        />

        {/* Section 4: Our Story */}
        {data.stories && data.stories.length > 0 && (
          <FloralStorySection stories={data.stories} />
        )}

        {/* Section 5: Events */}
        <FloralEventsSection events={data.events} />

        {/* Section 6: Gallery (Masonry) */}
        <FloralMasonryGallery photos={data.gallery} />

        {/* Section 7: RSVP */}
        <FloralRSVPSection weddingId={data.id} />

        {/* Section 8: Wishes */}
        <FloralWishesSection weddingId={data.id} />

        {/* Section 9: Gift / Congratulatory Box */}
        <FloralGiftSection gift={data.gift} />
      </main>

      {/* 6. Refined Footer */}
      <footer className="py-12 bg-[#F9F3F0] text-center border-t border-[#F2DCDD] px-4 space-y-3 font-body">
        <div className="w-8 h-8 rounded-full bg-white border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#D97D8A]">
          <Heart className="w-4 h-4 fill-[#D97D8A]/30" />
        </div>
        <p className="font-serif-title text-xl text-[#3E2E31]">
          {data.groom.name} & {data.bride.name}
        </p>
        <p className="text-xs text-[#8C767A]">
          {formattedDate} • With love, forever
        </p>
        <p className="text-[11px] text-[#A89296] pt-4">
          Thiết kế thiệp cưới online phong cách Floral Romance — L'Amour Wedding
        </p>
      </footer>
    </div>
  );
}
