import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WeddingData } from '../../../types';
import { weddingAudio } from '../../../lib/audioSynth';
import { VietnameseCinematicPrologue } from './cinematic-vietnamese/VietnameseCinematicPrologue';
import { VietnameseCinematicHero } from './cinematic-vietnamese/VietnameseCinematicHero';
import { VietnameseCinematicScrollChronicles } from './cinematic-vietnamese/VietnameseCinematicScrollChronicles';
import { VietnameseCinematicMoviePoster } from './cinematic-vietnamese/VietnameseCinematicMoviePoster';
import { VietnameseCinematicInteractiveAltar } from './cinematic-vietnamese/VietnameseCinematicInteractiveAltar';
import { VietnameseCinematicGallery } from './cinematic-vietnamese/VietnameseCinematicGallery';
import { VietnameseCinematicGrandFinale } from './cinematic-vietnamese/VietnameseCinematicGrandFinale';
import { VietnameseCinematicAudioBar } from './cinematic-vietnamese/VietnameseCinematicAudioBar';

interface CinematicVietnameseTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function CinematicVietnameseTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: CinematicVietnameseTemplateProps) {
  const [hasOpened, setHasOpened] = useState(!showEnvelopeImmediately);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Dynamic Scroll background transition: Imperial Deep Red -> Black Lacquer -> Burgundy -> Gold Dark
  const { scrollYProgress } = useScroll();
  const dynamicBg = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['#0A0405', '#160307', '#22050B', '#0D0204', '#050203']
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

  return (
    <motion.div
      style={{ backgroundColor: dynamicBg }}
      className="template-cinematic-vietnamese relative min-h-screen text-[#FAF6EE] transition-colors duration-700 font-body overflow-x-hidden selection:bg-[#BA1E28] selection:text-[#FFD700]"
    >
      {/* 1. Màn Mở Đầu Điện Ảnh "Khai Ấn Hoàng Triều" (Grand Prologue with Imperial Stamp) */}
      {!hasOpened && (
        <VietnameseCinematicPrologue
          groomName={groomName}
          brideName={brideName}
          weddingDateStr={data.weddingDate || '20 • 12 • 2026'}
          coverImage={data.coverImage}
          musicUrl={data.musicUrl}
          onComplete={() => setHasOpened(true)}
        />
      )}

      {/* 2. Cảnh Mở Màn "Đại Triều Hỷ Lạc" (Hero Scene with Slow Zoom & East Drum Aura) */}
      <section id="hero">
        <VietnameseCinematicHero
          data={data}
          onScrollToStory={() =>
            handleScrollToSection(
              data.stories && data.stories.length > 0 ? 'story-chronicles' : 'movie-poster'
            )
          }
          isPlaying={isPlaying}
          onToggleSound={handleToggleSound}
        />
      </section>

      {/* 3. Trục Cuộn Sử Ký "Tứ Hồi Duyên Định" (Epic Scroll-Driven Chronicle Chapters) */}
      {data.stories && data.stories.length > 0 && (
        <VietnameseCinematicScrollChronicles data={data} />
      )}

      {/* 4. Poster Đại Lễ "Chiếu Thư Hoàng Đạo" & Lịch Trình, RSVP */}
      <VietnameseCinematicMoviePoster data={data} />

      {/* 5. ĐIỂM BỨC PHÁ ĐỘC NHẤT: Thả Hoa Đăng Sen Cầu Phúc, Tráp Sơn Son Khóa Ngọc & Gieo Quẻ Hỷ Lộc */}
      <VietnameseCinematicInteractiveAltar data={data} />

      {/* 6. Họa Phổ Hoàng Triều: Frame-by-Frame Cinema Reel Gallery */}
      <VietnameseCinematicGallery data={data} />

      {/* 7. Đoạn Kết "Pháo Hoa Đại Hỷ, Bách Niên Giai Lão & Bảng Danh Danh Hỷ Sự" */}
      <section id="final-scene">
        <VietnameseCinematicGrandFinale
          data={data}
          onReplay={handleReplay}
          onNavigateToAdmin={onNavigateToAdmin}
          isOwnerMode={isOwnerMode}
        />
      </section>

      {/* 8. Floating Nhã Nhạc Audio Bar & Chapter Quick Navigator */}
      <VietnameseCinematicAudioBar
        isPlaying={isPlaying}
        onToggleSound={handleToggleSound}
        activeSection={activeSection}
        onScrollToSection={handleScrollToSection}
      />
    </motion.div>
  );
}
