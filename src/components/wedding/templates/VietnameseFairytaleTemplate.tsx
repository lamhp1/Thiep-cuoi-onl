import React, { useState, useEffect } from 'react';
import { WeddingData, CouplePerson, WeddingEvent, StoryMilestone, GalleryPhoto, WishMessage } from '../../../types';
import { submitRSVP } from '../../../services/rsvpService';
import { FairytaleVillageGateOpening } from './vietnamese-fairytale/FairytaleVillageGateOpening';
import { FairytalePetalsFalling } from './vietnamese-fairytale/FairytalePetalsFalling';
import { FairytaleAudioBar } from './vietnamese-fairytale/FairytaleAudioBar';
import { FairytaleHeroSection } from './vietnamese-fairytale/FairytaleHeroSection';
import { FairytaleRoadCoupleSection } from './vietnamese-fairytale/FairytaleRoadCoupleSection';
import { FairytaleBanyanStorySection } from './vietnamese-fairytale/FairytaleBanyanStorySection';
import { FairytaleLotusGallerySection } from './vietnamese-fairytale/FairytaleLotusGallerySection';
import { FairytaleHomeEventsSection } from './vietnamese-fairytale/FairytaleHomeEventsSection';
import { FairytaleBetelGiftSection } from './vietnamese-fairytale/FairytaleBetelGiftSection';
import { FairytaleVillageRSVPSection } from './vietnamese-fairytale/FairytaleVillageRSVPSection';
import { FairytaleLotusWishesSection } from './vietnamese-fairytale/FairytaleLotusWishesSection';
import { FairytaleFinaleSection } from './vietnamese-fairytale/FairytaleFinaleSection';
import { FolkLotus, FolkBird, FolkRedSeal } from './vietnamese-fairytale/FairytaleOrnaments';
import { Menu, X, Settings, Heart, BookOpen } from 'lucide-react';

interface VietnameseFairytaleTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function VietnameseFairytaleTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: VietnameseFairytaleTemplateProps) {
  const [isGateOpened, setIsGateOpened] = useState(!showEnvelopeImmediately);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsGateOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const groomName = data.groom?.fullName || data.groomName || 'Minh Đức';
  const brideName = data.bride?.fullName || data.brideName || 'Thục Quyên';
  const weddingDate = data.weddingDate || '20/12/2026';
  const city = data.events?.[0]?.locationName || 'Làng Quê Việt Nam';
  const coverImage = data.coverImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85';

  const defaultGroom: CouplePerson = data.groom || {
    name: groomName,
    fullName: groomName,
    role: 'groom',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
    bio: 'Chàng trai yêu thích sự chân thành mộc mạc, tìm thấy bến đỗ an yên và cả bầu trời hạnh phúc trong ánh mắt nàng.',
    parents: {
      father: 'Nguyễn Văn Thành',
      mother: 'Trần Thị Lụa',
    },
  };

  const defaultBride: CouplePerson = data.bride || {
    name: brideName,
    fullName: brideName,
    role: 'bride',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    bio: 'Cô gái dịu dàng yêu nét thanh tao hoa sen, gửi gắm trọn vẹn yêu thương cùng chàng dệt nên câu chuyện cổ tích ngàn năm.',
    parents: {
      father: 'Lê Hoàng Hải',
      mother: 'Vũ Thị Minh',
    },
  };

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

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navChapters = [
    { id: 'hero', label: 'Lời Ngỏ' },
    { id: 'road-couple', label: 'I. Đường Làng' },
    { id: 'banyan-story', label: 'II. Cây Đa' },
    { id: 'lotus-gallery', label: 'III. Hồ Sen' },
    { id: 'home-events', label: 'IV. Mái Nhà' },
    { id: 'betel-gift', label: 'V. Mừng Cưới' },
    { id: 'village-rsvp', label: 'VI. Phúc Đáp' },
    { id: 'lotus-wishes', label: 'VII. Lưu Bút' },
    { id: 'finale-wedding', label: 'Lễ Cưới' },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] text-[#351E17] font-body selection:bg-[#BA262B]/20 selection:text-[#BA262B]">
      {/* 1. Village Gate Opening Screen (Cổng Làng Cổ Kính) */}
      {!isGateOpened && (
        <FairytaleVillageGateOpening
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          city={city}
          onEnterStory={() => setIsGateOpened(true)}
        />
      )}

      {/* 2. Delicate Falling Lotus Petals & Bamboo Leaves */}
      <FairytalePetalsFalling count={16} />

      {/* 3. Folk Instrument Background Audio Bar */}
      <FairytaleAudioBar musicUrl={data.musicUrl} />

      {/* 4. Modern Folk Sticky Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF5EB]/90 backdrop-blur-md border-b border-[#D9CBB7] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo Brand / Couple Names */}
          <div
            onClick={() => handleScrollTo('hero')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#BA262B] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <FolkLotus className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-serif-title text-base sm:text-lg font-bold text-[#351E17] group-hover:text-[#BA262B] transition-colors">
                {groomName} &amp; {brideName}
              </span>
              <span className="text-[10px] font-mono text-[#853023] block -mt-1 tracking-widest uppercase">
                CỔ TÍCH VIỆT NAM
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navChapters.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className="px-3 py-1 rounded-full text-xs font-serif font-bold text-[#543026] hover:text-[#BA262B] hover:bg-[#BA262B]/5 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Right (Admin & Mobile Toggle) */}
          <div className="flex items-center gap-2">
            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BA262B] text-[#FAF5EB] text-xs font-serif font-semibold shadow-xs hover:bg-[#853023] transition-colors cursor-pointer"
                title="Vào trang quản trị thiệp"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quản Trị</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#351E17] hover:bg-[#BA262B]/10 transition-colors cursor-pointer"
              aria-label="Mở danh mục chương truyện"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF5EB] border-b border-[#D9CBB7] px-4 py-4 space-y-1 animate-fadeIn">
            {navChapters.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-serif font-bold text-[#543026] hover:bg-[#BA262B]/10 hover:text-[#BA262B] flex items-center justify-between cursor-pointer"
              >
                <span>{item.label}</span>
                <FolkLotus className="w-3.5 h-3.5 text-[#BA262B]/60" />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Storybook Chapters Flow */}
      <main>
        {/* Prologue: Hero & Countdown */}
        <FairytaleHeroSection
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          coverImage={coverImage}
          location={city}
          onExploreChapters={() => handleScrollTo('road-couple')}
        />

        {/* Chapter I: Con Đường Làng (Đôi Uyên Ương Hội Ngộ) */}
        <FairytaleRoadCoupleSection
          groom={defaultGroom}
          bride={defaultBride}
          groomName={groomName}
          brideName={brideName}
        />

        {/* Chapter II: Dưới Bóng Cây Đa (Lời Hẹn Ước Trăm Năm) */}
        <FairytaleBanyanStorySection story={data.stories || (data as any).story || []} />

        {/* Chapter III: Bên Bờ Hồ Sen (Khoảnh Khắc Bích Dao) */}
        <FairytaleLotusGallerySection gallery={data.gallery || []} />

        {/* Chapter IV: Dưới Mái Nhà Ấm (Lịch Trình Đại Hỷ) */}
        <FairytaleHomeEventsSection events={data.events || []} />

        {/* Chapter V: Mâm Quả Trầu Cau & Chúc Phúc (Hộp Mừng Cưới) */}
        <FairytaleBetelGiftSection
          groomBank={data.gift?.groomBank || (data as any).giftRegistry?.groomBank}
          brideBank={data.gift?.brideBank || (data as any).giftRegistry?.brideBank}
          groomName={groomName}
          brideName={brideName}
        />

        {/* Chapter VI: Hỷ Sự Đầy Sân (Xác Nhận Tham Dự RSVP) */}
        <FairytaleVillageRSVPSection
          weddingId={data.id}
          onRSVPSubmit={handleRSVPSubmit}
        />

        {/* Chapter VII: Thả Đèn Hoa Đăng Sen (Sổ Lưu Bút Làng Quê) */}
        <FairytaleLotusWishesSection
          wishes={(data as any).wishes || []}
          weddingId={data.id}
        />

        {/* Final Chapter: Lễ Cưới Trọn Vẹn */}
        <FairytaleFinaleSection
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          onReopenGate={() => {
            setIsGateOpened(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>
    </div>
  );
}
