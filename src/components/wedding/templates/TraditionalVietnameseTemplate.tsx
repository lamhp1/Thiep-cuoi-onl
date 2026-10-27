import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingData } from '../../../types';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperTextureBackground,
  DongSonDrumPattern,
} from '../vietnamese-traditional/TraditionalOrnaments';
import { TraditionalEnvelopeOpening } from '../vietnamese-traditional/TraditionalEnvelopeOpening';
import { TraditionalHeroSection } from '../vietnamese-traditional/TraditionalHeroSection';
import { TraditionalCoupleSection } from '../vietnamese-traditional/TraditionalCoupleSection';
import { TraditionalPaperScrollStory } from '../vietnamese-traditional/TraditionalPaperScrollStory';
import { TraditionalEventsSection } from '../vietnamese-traditional/TraditionalEventsSection';
import { TraditionalPaperFrameGallery } from '../vietnamese-traditional/TraditionalPaperFrameGallery';
import { TraditionalLiXiGiftSection } from '../vietnamese-traditional/TraditionalLiXiGiftSection';
import { TraditionalRSVPSection } from '../vietnamese-traditional/TraditionalRSVPSection';
import { TraditionalWishesSection } from '../vietnamese-traditional/TraditionalWishesSection';
import { Menu, X, Settings, Heart } from 'lucide-react';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';

interface TraditionalVietnameseTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function TraditionalVietnameseTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: TraditionalVietnameseTemplateProps) {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(!showEnvelopeImmediately);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsEnvelopeOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const navLinks = [
    { href: '#couple', label: 'Cặp Đôi' },
    ...(data.stories && data.stories.length > 0 ? [{ href: '#story', label: 'Cuộn Thư Tình' }] : []),
    { href: '#events', label: 'Hôn Lễ' },
    { href: '#gallery', label: 'Khung Tranh' },
    { href: '#gift', label: 'Bao Lì Xì' },
    { href: '#rsvp', label: 'Báo Hỷ' },
    { href: '#wishes', label: 'Lời Chúc' },
  ];

  return (
    <div className="template-vietnamese-traditional relative min-h-screen bg-[#FAF6EE] text-[#3D1A1E] font-body selection:bg-[#BA1E28]/20 selection:text-[#8B1119]">
      {/* 1. Light Paper Texture Background (Background có texture giấy nhẹ) */}
      <PaperTextureBackground />

      {/* 2. Opening Screen: Phong bì đỏ chính giữa với animation mở thiệp theo yêu cầu */}
      {!isEnvelopeOpened && (
        <TraditionalEnvelopeOpening
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
          musicUrl={data.musicUrl}
          onOpen={() => setIsEnvelopeOpened(true)}
        />
      )}

      {/* 3. Floating Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* 4. Sticky Header Navigation (Đỏ son & Vàng kim hoàng gia) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#D4AF37]/40 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Monogram */}
          <a href="#" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#BA1E28] border border-[#D4AF37] flex items-center justify-center text-white shadow-xs">
              <SongHyGlyph className="w-4 h-4 text-[#FFD700]" />
            </div>
            <span className="font-serif-title text-base sm:text-lg font-bold tracking-wider text-[#8B1119] group-hover:text-[#BA1E28] transition-colors">
              {data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'} &amp; {data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-serif-title font-bold uppercase tracking-wider text-[#735154] hover:text-[#BA1E28] transition-colors"
              >
                {link.label}
              </a>
            ))}

            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BA1E28] text-white text-xs font-semibold hover:bg-[#8B1119] transition-all shadow-xs cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Quản Trị</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="p-2 rounded-xl bg-[#BA1E28] text-white"
                title="Quản trị"
              >
                <Settings className="w-4 h-4 text-[#FFD700]" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-[#D4AF37]/50 text-[#8B1119] cursor-pointer"
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#FFFDF9] border-b border-[#D4AF37]/40 px-6 py-4 space-y-3 overflow-hidden shadow-lg"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-serif-title font-bold uppercase tracking-wider text-[#5C3D40] hover:text-[#BA1E28] py-1"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Layout */}
      <main className="relative z-10 pt-16">
        {/* VIP Personalized Guest Greeting Banner */}
        <PersonalizedWelcomeBanner
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
          weddingDate={data.weddingDate}
          accentColor="#BA1E28"
        />

        {/* 5. Hero Section (70-90% ảnh, overlay burgundy nhẹ, tên cô dâu chú rể) */}
        <TraditionalHeroSection
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
          weddingDate={data.weddingDate}
          coverImage={data.coverImage}
          romanticQuote={data.romanticQuote}
        />

        {/* 6. The Couple Section (Tân Lang & Tân Nương, Gia đình hai bên) */}
        <TraditionalCoupleSection
          groom={data.groom}
          bride={data.bride}
        />

        {/* 7. Story Section: Cuộn giấy (hiển thị khi có mốc kỷ niệm) */}
        {data.stories && data.stories.length > 0 && (
          <TraditionalPaperScrollStory
            milestones={data.stories}
            groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'}
            brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
          />
        )}

        {/* 8. Events Section (Lễ Vu Quy, Thành Hôn, Lịch Âm Dương, Chỉ đường) */}
        <TraditionalEventsSection
          events={data.events}
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
        />

        {/* 9. Gallery Section: Khung tranh giấy mỹ thuật */}
        <TraditionalPaperFrameGallery
          photos={data.gallery}
        />

        {/* 10. Gift Section: Bao Lì Xì cách điệu với VietQR độc bản */}
        <TraditionalLiXiGiftSection
          gift={data.gift}
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
        />

        {/* 11. RSVP Section: Thư hồi âm báo hỷ */}
        <TraditionalRSVPSection
          weddingId={data.id}
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
        />

        {/* 12. Wishes Section: Sổ lưu bút Hỷ Sự */}
        <TraditionalWishesSection
          weddingId={data.id}
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
        />
      </main>

      {/* 13. Traditional Footer */}
      <footer className="relative z-10 bg-[#240408] text-[#FAF6EE] py-14 border-t-2 border-[#D4AF37]/50 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
          <DongSonDrumPattern className="w-[500px] h-[500px] text-[#FFD700]" opacity={1} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#8B1119] border border-[#D4AF37] text-white flex items-center justify-center mx-auto shadow-md">
            <SongHyGlyph className="w-6 h-6 text-[#FFD700]" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif-title text-2xl font-bold tracking-widest uppercase text-white">
              {data.groomName || data.groom?.fullName || data.groom?.name || 'Chú Rể'} &amp; {data.brideName || data.bride?.fullName || data.bride?.name || 'Cô Dâu'}
            </h3>
            <p className="font-serif-title italic text-sm text-[#F3E2BB]">
              Trân trọng cảm ơn sự hiện diện và tình cảm tốt đẹp của toàn thể quý khách.
            </p>
          </div>

          <div className="w-16 h-px bg-[#D4AF37]/40 mx-auto my-2" />

          <p className="text-[11px] font-body text-[#F3E2BB]/60 tracking-wider uppercase">
            Hỷ Sự • Trăm Năm Hạnh Phúc • Vẹn Tròn Nghĩa Phu Thê
          </p>
        </div>
      </footer>
    </div>
  );
}
