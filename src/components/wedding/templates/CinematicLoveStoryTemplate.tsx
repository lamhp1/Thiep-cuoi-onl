import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WeddingData } from '../../../types';
import { weddingAudio } from '../../../lib/audioSynth';
import { CinematicOpening } from './cinematic/CinematicOpening';
import { CinematicHero } from './cinematic/CinematicHero';
import { CinematicChapters } from './cinematic/CinematicChapters';
import { CinematicPosterEvent } from './cinematic/CinematicPosterEvent';
import { CinematicGallery } from './cinematic/CinematicGallery';
import { CinematicFinalScene } from './cinematic/CinematicFinalScene';
import { CinematicAudioBar } from './cinematic/CinematicAudioBar';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';

interface CinematicLoveStoryTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function CinematicLoveStoryTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: CinematicLoveStoryTemplateProps) {
  const [hasOpened, setHasOpened] = useState(!showEnvelopeImmediately);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Background color transformation on scroll:
  // Cream -> White -> Burgundy -> Black -> Cream
  const { scrollYProgress } = useScroll();
  const dynamicBg = useTransform(
    scrollYProgress,
    [0, 0.22, 0.48, 0.75, 0.98],
    ['#FBF8F3', '#FFFFFF', '#380B13', '#080808', '#FAF7F0']
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

  return (
    <motion.div
      style={{ backgroundColor: dynamicBg }}
      className="relative min-h-screen text-[#1A1816] transition-colors duration-700 font-body overflow-x-hidden selection:bg-[#E6C687] selection:text-black"
    >
      {/* 1. Cinematic Opening Screen */}
      {!hasOpened && (
        <CinematicOpening
          groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Minh Anh'}
          brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Ngọc Mai'}
          coverImage={data.coverImage}
          musicUrl={data.musicUrl}
          onComplete={() => setHasOpened(true)}
        />
      )}

      {/* VIP Personalized Guest Greeting Banner */}
      <PersonalizedWelcomeBanner
        groomName={data.groomName || data.groom?.fullName || data.groom?.name || 'Minh Anh'}
        brideName={data.brideName || data.bride?.fullName || data.bride?.name || 'Ngọc Mai'}
        weddingDate={data.weddingDate}
        accentColor="#E6C687"
      />

      {/* 2. Hero Scene: Full Screen Visual & Center Title */}
      <section id="hero">
        <CinematicHero
          data={data}
          onScrollToStory={() => handleScrollToSection(data.stories && data.stories.length > 0 ? 'story-chapters' : 'movie-poster')}
          isPlaying={isPlaying}
          onToggleSound={handleToggleSound}
        />
      </section>

      {/* 3. Story Chapters: 1 chapter per full-screen scene with scroll-driven zoom & mask */}
      {data.stories && data.stories.length > 0 && (
        <CinematicChapters data={data} />
      )}

      {/* 4. Wedding Event: Movie Poster (THE DAY 20 / 12 / 2026 HUẾ) & RSVP/Gifts */}
      <CinematicPosterEvent data={data} />

      {/* 5. Gallery: Full-Screen Frame-by-Frame Reel */}
      <CinematicGallery data={data} />

      {/* 6. Final Scene: Full-screen couple picture, AND THEY LIVED HAPPILY EVER AFTER, 20 • 12 • 2026, Fade to white */}
      <section id="final-scene">
        <CinematicFinalScene
          data={data}
          onReplay={handleReplay}
          onNavigateToAdmin={onNavigateToAdmin}
          isOwnerMode={isOwnerMode}
        />
      </section>

      {/* 7. Floating Audio Bar & Chapter Navigator */}
      <CinematicAudioBar
        isPlaying={isPlaying}
        onToggleSound={handleToggleSound}
        activeSection={activeSection}
        onScrollToSection={handleScrollToSection}
      />
    </motion.div>
  );
}
