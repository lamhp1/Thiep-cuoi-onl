import React, { useState, useEffect } from 'react';
import { WeddingData, RSVPGuest } from '../../../types';
import { submitRSVP } from '../../../services/rsvpService';
import { addWish } from '../../../services/wishesService';
import { SideLanternColumns } from './lantern-night/SideLanternColumns';
import { LanternFirefliesCanvas } from './lantern-night/LanternFirefliesCanvas';
import { LanternNightOpening } from './lantern-night/LanternNightOpening';
import { LanternHeroSection } from './lantern-night/LanternHeroSection';
import { LanternCoupleSection } from './lantern-night/LanternCoupleSection';
import { LanternStorySection } from './lantern-night/LanternStorySection';
import { LanternEventsSection } from './lantern-night/LanternEventsSection';
import { LanternGallerySection } from './lantern-night/LanternGallerySection';
import { LanternGiftSection } from './lantern-night/LanternGiftSection';
import { LanternRSVPSection } from './lantern-night/LanternRSVPSection';
import { LanternWishesSection, LanternWishItem } from './lantern-night/LanternWishesSection';
import { LanternSoftFireworksFinale } from './lantern-night/LanternSoftFireworksFinale';
import { LanternAudioBar } from './lantern-night/LanternAudioBar';
import { SparklingStar } from './lantern-night/LanternNightOrnaments';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import { Settings, Heart, Calendar, Gift, MessageSquare, ChevronUp, Mail } from 'lucide-react';

interface LanternTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function LanternTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: LanternTemplateProps) {
  const [hasEntered, setHasEntered] = useState(!showEnvelopeImmediately);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [localWishes, setLocalWishes] = useState<LanternWishItem[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync with showEnvelopeImmediately prop (e.g. from Demo toolbar or Preview modal)
  useEffect(() => {
    setHasEntered(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  // Monitor scroll for lantern glow amplification and light propagation
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRSVPSubmit = async (rsvp: Omit<RSVPGuest, 'id' | 'createdAt'>) => {
    await submitRSVP({
      ...rsvp,
      weddingId: data.id || 'demo-wedding',
    });
    // If message was also entered in RSVP, append to local wishing wall
    if (rsvp.message && rsvp.message.trim()) {
      const newWish: LanternWishItem = {
        id: `wish-${Date.now()}`,
        author: rsvp.fullName,
        content: rsvp.message,
        createdAt: 'Vừa xong',
      };
      setLocalWishes((prev) => [newWish, ...prev]);
    }
  };

  const handleAddWish = (wish: { author: string; content: string }) => {
    addWish({
      weddingId: data.id || 'demo-wedding',
      authorName: wish.author,
      content: wish.content,
    }).catch(() => {});
    const newWish: LanternWishItem = {
      id: `wish-${Date.now()}`,
      author: wish.author,
      content: wish.content,
      createdAt: 'Vừa xong',
    };
    setLocalWishes((prev) => [newWish, ...prev]);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const groomName = data.groomName || 'MINH ANH';
  const brideName = data.brideName || 'NGỌC MAI';
  const weddingDate = data.weddingDate || '20.12.2026';
  const eventCity = data.events?.[0]?.locationName || 'TP. Huế';

  return (
    <div className="relative min-h-screen bg-[#070B18] text-[#F3EFE6] font-body selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      {/* 1. Opening Ceremony Modal (Thắp Sáng Đèn Lồng) */}
      {!hasEntered && (
        <LanternNightOpening
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          city={eventCity}
          musicUrl={data.musicUrl}
          onEnter={() => setHasEntered(true)}
        />
      )}

      {/* 2. Floating Fireflies & Pixel Light Canvas */}
      <LanternFirefliesCanvas />

      {/* 3. Swaying Side Lantern Columns (Treo 2 bên, phát sáng dần khi scroll) */}
      <SideLanternColumns scrollProgress={scrollProgress} />

      {/* 4. Owner Mode Floating Admin Bar */}
      {isOwnerMode && onNavigateToAdmin && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={onNavigateToAdmin}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-950/90 hover:bg-neutral-900 border border-amber-500/50 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider shadow-2xl backdrop-blur-md transition-all hover:scale-105"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Quản Trị Thiệp</span>
          </button>
        </div>
      )}

      {/* 5. Main Hero Section */}
      <div className="relative z-30">
        <PersonalizedWelcomeBanner
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          accentColor="#F59E0B"
        />
      </div>

      <LanternHeroSection
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
        romanticQuote={data.romanticQuote}
        coverImage={data.coverImage}
        scrollProgress={scrollProgress}
        onRSVPClick={() => scrollToSection('rsvp')}
        onExploreClick={() => scrollToSection('couple')}
      />

      {/* 6. Tân Lang & Tân Nương */}
      <LanternCoupleSection
        groom={
          data.groom || {
            name: data.groomName || 'Minh Anh',
            fullName: data.groomName || 'Nguyễn Minh Anh',
            role: 'groom',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
            bio: 'Chàng trai đất cố đô với nụ cười ấm áp, luôn trân quý từng khoảnh khắc giản dị bên người thương.',
          }
        }
        bride={
          data.bride || {
            name: data.brideName || 'Ngọc Mai',
            fullName: data.brideName || 'Trần Ngọc Mai',
            role: 'bride',
            avatar:
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
            bio: 'Cô gái mang nét dịu dàng của sông Hương, yêu hoa cỏ và những đêm hội đèn lồng lung linh.',
          }
        }
      />

      {/* 7. Câu Chuyện Tình Yêu (Love Milestones) */}
      <LanternStorySection
        milestones={data.stories}
        scrollProgress={scrollProgress}
      />

      {/* 8. Lịch Trình Dạ Tiệc Tối (Evening Itinerary & Map) */}
      <LanternEventsSection events={data.events || []} />

      {/* 9. Album Ảnh Dạ Tiệc Đêm (Gallery) */}
      <LanternGallerySection photos={data.gallery || []} />

      {/* 10. Hộp Mừng Cưới Đèn Lồng VietQR (Gift Box) */}
      <LanternGiftSection data={data} />

      {/* 11. Xác Nhận Tham Dự Dạ Yến (RSVP) */}
      <LanternRSVPSection weddingId={data.id} onRSVPSubmit={handleRSVPSubmit} />

      {/* 12. Thả Đèn Lồng Nguyện Ước (Wishes) */}
      <LanternWishesSection
        wishes={localWishes}
        onAddWish={handleAddWish}
      />

      {/* 13. Pháo Hoa Cực Nhẹ Ở Cuối & Lời Cảm Tạ (Soft Fireworks Finale) */}
      <LanternSoftFireworksFinale
        groomName={groomName}
        brideName={brideName}
      />

      {/* 14. Floating Audio Bar (Nhạc Dạ Tiệc & Chuông Gió) */}
      <LanternAudioBar musicUrl={data.musicUrl} />

      {/* 15. Quick Navigation Footer Bar */}
      <footer className="relative border-t border-amber-500/20 bg-neutral-950/90 py-8 px-4 text-center z-20">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-6 text-xs font-serif uppercase tracking-widest text-amber-300/80">
            <button
              onClick={() => scrollToSection('couple')}
              className="cursor-pointer hover:text-amber-200 transition-colors"
            >
              Cặp Đôi
            </button>
            <span>•</span>
            <button
              onClick={() => scrollToSection('events')}
              className="cursor-pointer hover:text-amber-200 transition-colors"
            >
              Lịch Trình
            </button>
            <span>•</span>
            <button
              onClick={() => scrollToSection('gift')}
              className="cursor-pointer hover:text-amber-200 transition-colors"
            >
              Mừng Cưới
            </button>
            <span>•</span>
            <button
              onClick={() => scrollToSection('rsvp')}
              className="cursor-pointer hover:text-amber-200 transition-colors"
            >
              Phúc Đáp
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setHasEntered(false);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="cursor-pointer text-amber-400 hover:text-amber-200 transition-colors inline-flex items-center gap-1 font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Mở Lại Trang Bì Thư</span>
            </button>
          </div>

          <p className="text-[11px] font-serif text-neutral-500">
            © 2026 {groomName} &amp; {brideName} • Vietnamese Night Wedding Invitation • L’Amour Atelier
          </p>
        </div>
      </footer>

      {/* Floating Reopen Envelope Button */}
      {hasEntered && (
        <button
          onClick={() => {
            setHasEntered(false);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="cursor-pointer fixed bottom-20 left-4 sm:left-6 z-40 px-3.5 py-2 rounded-full bg-neutral-950/90 hover:bg-neutral-900 border border-amber-500/50 text-amber-300 text-xs font-serif shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          title="Xem lại trang mở thiệp & thắp đèn lồng"
        >
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Mở Lại Trang Bì Thư</span>
          <span className="sm:hidden">Mở Bì Thư</span>
        </button>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer fixed bottom-20 right-5 z-40 p-2.5 rounded-full bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          title="Lên đầu trang"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
