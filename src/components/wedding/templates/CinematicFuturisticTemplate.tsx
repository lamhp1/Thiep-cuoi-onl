import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WeddingData } from '../../../types';
import { weddingAudio } from '../../../lib/audioSynth';
import { FuturisticPrologue } from './cinematic-futuristic/FuturisticPrologue';
import { FuturisticHero } from './cinematic-futuristic/FuturisticHero';
import { FuturisticTimeline } from './cinematic-futuristic/FuturisticTimeline';
import { FuturisticMissionPoster } from './cinematic-futuristic/FuturisticMissionPoster';
import { FuturisticQuantumVault } from './cinematic-futuristic/FuturisticQuantumVault';
import { FuturisticGallery } from './cinematic-futuristic/FuturisticGallery';
import { FuturisticWishesMatrix } from './cinematic-futuristic/FuturisticWishesMatrix';
import { FuturisticGrandFinale } from './cinematic-futuristic/FuturisticGrandFinale';
import { FuturisticAudioBar } from './cinematic-futuristic/FuturisticAudioBar';

interface CinematicFuturisticTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function CinematicFuturisticTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: CinematicFuturisticTemplateProps) {
  const [hasOpened, setHasOpened] = useState(!showEnvelopeImmediately);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Dynamic Scroll background transition: Deep Void Black -> Quantum Indigo -> Cyber Violet -> Starlight Black
  const { scrollYProgress } = useScroll();
  const dynamicBg = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['#050711', '#0B0F24', '#100A26', '#090D22', '#050711']
  );

  // Sync state with audio engine
  useEffect(() => {
    const unsub = weddingAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setHasOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  const handleToggleSound = async () => {
    if (isPlaying) {
      weddingAudio.pause();
    } else {
      await weddingAudio.play(data.musicUrl);
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleReplay = () => {
    setHasOpened(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const groomName = data.groom?.fullName || data.groomName || 'Minh Anh';
  const brideName = data.bride?.fullName || data.brideName || 'Ngọc Mai';
  const coverImage =
    data.coverImage ||
    data.gallery?.[0]?.url ||
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85';

  return (
    <motion.div
      style={{ backgroundColor: dynamicBg }}
      className="template-cinematic-futuristic relative min-h-screen text-[#F1F5F9] transition-colors duration-700 font-body overflow-x-hidden selection:bg-[#00F0FF] selection:text-[#050711]"
    >
      {/* 1. Màn Khởi Hành Đột Phá "Quantum Warp Drive Prologue" */}
      {!hasOpened && (
        <FuturisticPrologue
          groomName={groomName}
          brideName={brideName}
          weddingDateStr={data.weddingDate || '20 • 12 • 2026'}
          coverImage={coverImage}
          musicUrl={data.musicUrl}
          onComplete={() => setHasOpened(true)}
        />
      )}

      {/* 2. Cổng Không Gian Hôn Phối (Hero Scene with 3D Hologram Rings & Sci-Fi Mission Countdown) */}
      <section id="hero">
        <FuturisticHero
          data={data}
          onScrollToTimeline={() =>
            handleScrollToSection(
              data.stories && data.stories.length > 0 ? 'story-chronicles' : 'movie-poster'
            )
          }
          isPlaying={isPlaying}
          onToggleSound={handleToggleSound}
        />
      </section>

      {/* 3. Dòng Thời Gian Lượng Tử (Quantum Continuum Timeline) */}
      {data.stories && data.stories.length > 0 && (
        <FuturisticTimeline data={data} />
      )}

      {/* 4. Lịch Trình Khởi Hành & Biometric Boarding Pass RSVP */}
      <FuturisticMissionPoster data={data} />

      {/* 5. Lò Phản Ứng Tình Yêu, Hộp Lượng Tử VietQR & AI Gieo Quẻ Tương Lai */}
      <FuturisticQuantumVault data={data} />

      {/* 6. Lăng Kính Đa Chiều (Prism Holo-Matrix Gallery) */}
      <FuturisticGallery data={data} />

      {/* 7. Ma Trận Lời Chúc (Quantum Wishes Matrix) */}
      <FuturisticWishesMatrix data={data} />

      {/* 8. Đoạn Kết "Vụ Nổ Siêu Tân Tinh (Supernova Fireworks) & Lời Tri Ân" */}
      <section id="final-scene">
        <FuturisticGrandFinale
          data={data}
          onReplay={handleReplay}
          onNavigateToAdmin={onNavigateToAdmin}
          isOwnerMode={isOwnerMode}
        />
      </section>

      {/* 9. Floating Quantum HUD Audio & Navigation Controller */}
      <FuturisticAudioBar
        isPlaying={isPlaying}
        onToggleSound={handleToggleSound}
        activeSection={activeSection}
        onScrollToSection={handleScrollToSection}
      />
    </motion.div>
  );
}
