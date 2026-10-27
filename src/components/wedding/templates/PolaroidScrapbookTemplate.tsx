import React, { useState, useEffect } from 'react';
import { WeddingData, GalleryPhoto } from '../../../types';
import { FloatingMusicPlayer } from '../../ui/FloatingMusicPlayer';
import { submitRSVP } from '../../../services/rsvpService';
import {
  Menu,
  X,
  Settings,
  Heart,
  Camera,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowUp,
} from 'lucide-react';
import { WashiTape, Paperclip, HeartSticker } from './polaroid-scrapbook/PolaroidScrapbookOrnaments';
import { PolaroidScrapbookCoverOpening } from './polaroid-scrapbook/PolaroidScrapbookCoverOpening';
import { PolaroidHeroSection } from './polaroid-scrapbook/PolaroidHeroSection';
import { PolaroidCoupleSection } from './polaroid-scrapbook/PolaroidCoupleSection';
import { PolaroidStorySection } from './polaroid-scrapbook/PolaroidStorySection';
import { PolaroidEventsSection } from './polaroid-scrapbook/PolaroidEventsSection';
import { PolaroidGallerySection } from './polaroid-scrapbook/PolaroidGallerySection';
import { PolaroidGiftSection } from './polaroid-scrapbook/PolaroidGiftSection';
import { PolaroidRSVPSection } from './polaroid-scrapbook/PolaroidRSVPSection';
import { PolaroidWishesSection } from './polaroid-scrapbook/PolaroidWishesSection';

interface PolaroidScrapbookTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function PolaroidScrapbookTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: PolaroidScrapbookTemplateProps) {
  const [isScrapbookOpened, setIsScrapbookOpened] = useState(!showEnvelopeImmediately);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    setIsScrapbookOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const groomName = data.groom?.fullName || data.groomName || 'Minh Anh';
  const brideName = data.bride?.fullName || data.brideName || 'Ngọc Mai';
  const weddingDate = data.weddingDate || '20.12.2026';
  const city = data.events?.[0]?.locationName || 'TP. HUẾ';
  const coverImage =
    data.coverImage ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';

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

  const handleAddWish = async (_author: string, _content: string) => {
    // Saved locally within PolaroidWishesSection state
  };

  const handleScrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'hero', label: 'Trang chủ' },
    { id: 'couple', label: 'Cô dâu & Chú rể' },
    { id: 'story', label: 'Kỷ niệm Scrapbook' },
    { id: 'events', label: 'Lịch trình' },
    { id: 'gallery', label: 'Kho ảnh Polaroid' },
    { id: 'gift', label: 'Hộp mừng cưới' },
    { id: 'rsvp', label: 'Xác nhận tham dự' },
    { id: 'wishes', label: 'Sổ lưu bút' },
  ];

  return (
    <div className="relative min-h-screen bg-[#F8F3EA] text-[#2C211B] font-body scrapbook-desk-bg selection:bg-[#F9D5D3] selection:text-[#9C3858]">
      {/* Background Subtle Wood/Cork Texture Overlay */}
      <div className="fixed inset-0 scrapbook-grid-paper pointer-events-none opacity-40 z-0" />

      {/* 1. Cover Opening Modal */}
      {!isScrapbookOpened && (
        <PolaroidScrapbookCoverOpening
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          city={city}
          coverImage={coverImage}
          onOpenScrapbook={() => setIsScrapbookOpened(true)}
        />
      )}

      {/* 2. Scrapbook Sticky Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF4EB]/90 backdrop-blur-md border-b border-[#E6D8C2] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Couple Calligraphy */}
          <div
            onClick={() => handleScrollToSection('hero')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#E57A8B] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif-title text-base sm:text-lg font-bold text-[#2C211B] group-hover:text-[#C84B5D] transition-colors">
                {groomName} & {brideName}
              </span>
              <span className="text-[10px] font-mono text-[#8C6D1F] block -mt-1 tracking-wider uppercase">
                POLAROID SCRAPBOOK
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollToSection(link.id)}
                className="font-mono text-xs font-semibold uppercase tracking-wider text-[#685344] hover:text-[#C84B5D] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Reopen Album Cover Button */}
            <button
              onClick={() => setIsScrapbookOpened(false)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF9] border border-[#DFCBB2] text-xs font-mono font-bold text-[#7A614E] hover:text-[#2C211B] shadow-xs hover:shadow-sm transition-all cursor-pointer"
              title="Xem lại bìa album"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C84B5D]" />
              <span>Bìa Album</span>
            </button>

            {/* Admin toggle if owner */}
            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#C84B5D] text-white text-xs font-mono font-bold hover:bg-[#B53D4E] shadow-sm transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quản Trị</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md bg-[#FAF4EB] text-[#4F3E33] hover:text-[#2C211B] border border-[#DFCBB2] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFDF9] border-b border-[#DFCBB2] px-4 py-4 space-y-2 shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollToSection(link.id)}
                className="w-full text-left py-2 px-3 rounded-md text-sm font-mono text-[#5C483A] hover:bg-[#FAF4EB] hover:text-[#C84B5D] font-bold tracking-wide transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsScrapbookOpened(false);
              }}
              className="w-full text-left py-2 px-3 rounded-md text-sm font-mono text-[#C84B5D] font-bold hover:bg-[#FAF4EB] flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Xem lại bìa Album</span>
            </button>
          </div>
        )}
      </header>

      {/* MAIN SCRAPBOOK DESK CONTENT */}
      <main className="relative z-10">
        {/* Hero Section */}
        <PolaroidHeroSection
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          weddingDateTime={data.weddingDateTime}
          coverImage={coverImage}
          city={city}
          romanticQuote={data.romanticQuote}
          onOpenLightbox={(url) => setLightboxImg(url)}
        />

        {/* Couple Section */}
        <PolaroidCoupleSection
          groom={data.groom}
          bride={data.bride}
          groomName={groomName}
          brideName={brideName}
          onOpenLightbox={(url) => setLightboxImg(url)}
        />

        {/* Story Section: Scrapbook Journey (Tickets & Postcard) */}
        <PolaroidStorySection
          stories={data.stories || []}
          onOpenLightbox={(url) => setLightboxImg(url)}
        />

        {/* Events Section: Stationery Itinerary Cards */}
        <PolaroidEventsSection
          events={data.events || []}
          weddingDate={weddingDate}
        />

        {/* Gallery Section: Masonry Wall with Hover Upright Interaction */}
        <PolaroidGallerySection
          photos={data.gallery || []}
          onOpenLightbox={(url) => setLightboxImg(url)}
        />

        {/* Gift Section: Airmail Postal Envelope & VietQR */}
        {data.gift && (
          <PolaroidGiftSection
            gift={data.gift}
            groomName={groomName}
            brideName={brideName}
          />
        )}

        {/* RSVP Section: Guest Response Card */}
        <PolaroidRSVPSection
          onRSVPSubmit={handleRSVPSubmit}
          weddingDate={weddingDate}
        />

        {/* Wishes Section: Guestbook with Interactive Stickers */}
        <PolaroidWishesSection
          onAddWish={handleAddWish}
          groomName={groomName}
          brideName={brideName}
        />
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#DFCBB2] bg-[#FAF4EB] py-12 px-4 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <HeartSticker text="THANK YOU" color="red" angle={-3} />
            <HeartSticker text="WITH LOVE" color="gold" angle={3} />
          </div>

          <h3 className="font-serif-title text-2xl font-bold text-[#2C211B] mt-2">
            {groomName} & {brideName}
          </h3>

          <p className="font-polaroid-note text-lg text-[#7E5E44]">
            "Cảm ơn bạn đã luôn là một phần tuyệt vời trong album kỷ niệm cuộc đời chúng mình!"
          </p>

          <p className="text-[11px] font-mono text-[#9C826E] pt-4">
            Mẫu 7 — Polaroid / Scrapbook • Thiết kế album kỷ niệm thủ công cao cấp
          </p>

          {/* Back to top button */}
          <div className="pt-3">
            <button
              onClick={() => handleScrollToSection('hero')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFDF9] hover:bg-white border border-[#DFCBB2] text-xs font-mono font-bold text-[#7E5E44] shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#C84B5D]" />
              <span>VỀ ĐẦU TRANG</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white p-3 sm:p-5 pb-12 rounded-xs shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-9 h-9 rounded-full bg-[#C84B5D] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Washi tape over lightbox polaroid */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
              <WashiTape style="pink-grid" angle={-1} width="w-28" />
            </div>

            <img
              src={lightboxImg}
              alt="Expanded Memory"
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-xs"
              referrerPolicy="no-referrer"
            />

            <div className="mt-3 text-center">
              <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5E44]">
                "Một khoảnh khắc đẹp lưu giữ trọn đời"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
