import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Play, Film } from 'lucide-react';
import { weddingAudio } from '../../../../lib/audioSynth';
import { CoupleNamesStacked } from '../../common/CoupleNamesStacked';
import { PersonalizedWaxSealBadge } from '../../common/PersonalizedWaxSealBadge';

interface CinematicOpeningProps {
  groomName: string;
  brideName: string;
  coverImage: string;
  musicUrl?: string;
  onComplete: () => void;
}

export function CinematicOpening({
  groomName,
  brideName,
  coverImage,
  musicUrl,
  onComplete,
}: CinematicOpeningProps) {
  const [step, setStep] = useState<'text' | 'image' | 'ready'>('text');
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Step 1: Text lines fade in sequentially
    const timerImage = setTimeout(() => {
      setStep('image');
    }, 3800);

    const timerReady = setTimeout(() => {
      setStep('ready');
    }, 6000);

    return () => {
      clearTimeout(timerImage);
      clearTimeout(timerReady);
    };
  }, []);

  const handleStartExperience = async () => {
    setHasInteracted(true);
    // Start music on user interaction
    try {
      await weddingAudio.play(musicUrl);
    } catch {
      // audio play policy fallback
    }
    // Fade out and hand over to Hero
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  const handleSkip = async () => {
    try {
      await weddingAudio.play(musicUrl);
    } catch {}
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-opening-curtain"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
        className="fixed inset-0 z-[100] bg-[#050505] text-[#FAF6EE] flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* Cinematic 35mm Film Grain Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '3px 3px',
          }}
        />

        {/* Cinematic Widescreen Letterbox Bars */}
        <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 bg-black/90 z-20 border-b border-white/5 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-mono">
            <Film className="w-3.5 h-3.5 text-[#E6C687]" />
            <span>CINEMA PRESENTATION • 24 FPS</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Bỏ qua mở đầu ➔
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-black/90 z-20 border-t border-white/5 flex items-center justify-center px-6">
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-mono text-center">
            {groomName} & {brideName} • AN INTERACTIVE WEDDING FILM
          </p>
        </div>

        {/* Slow Zoom In Photo Behind Text */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{
              opacity: step === 'image' || step === 'ready' ? 0.45 : 0,
              scale: step === 'image' || step === 'ready' ? 1.14 : 1.0,
            }}
            transition={{
              opacity: { duration: 2.2, ease: 'easeInOut' },
              scale: { duration: 18, ease: 'linear' }, // Camera slow push-in
            }}
            className="w-full h-full bg-center bg-cover filter brightness-[0.75] contrast-[1.1] transform-gpu"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/50 to-[#050505]" />
        </div>

        {/* Main Content: Sequential Text Reveal */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Subtitle intro */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mb-8 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E6C687]/30 bg-black/40 backdrop-blur-sm text-[11px] tracking-[0.35em] text-[#E6C687] uppercase"
          >
            <Sparkles className="w-3 h-3 text-[#E6C687]" />
            <span>L'AMOUR PRODUCTIONS PRESENTS</span>
          </motion.div>

          {/* Core Prompt Requirement:
              A STORY
              OF TWO
              HEARTS
              Text fade theo từng dòng
          */}
          <div className="space-y-2 sm:space-y-3 font-serif-title">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.22em] text-[#FAF6EE] uppercase"
              >
                A STORY
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.4, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.28em] text-[#E6C687] uppercase italic"
              >
                OF TWO
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.4, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.22em] text-[#FAF6EE] uppercase"
              >
                HEARTS
              </motion.h1>
            </div>
          </div>

          {/* Couple credits: 3 rows with heart icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 4.2 }}
            className="mt-8 w-full max-w-sm mx-auto px-4"
          >
            <CoupleNamesStacked
              groomName={groomName}
              brideName={brideName}
              variant="envelope-sm"
              textColor="#FAF6EE"
              heartColor="#E6C687"
              idPrefix="cinematic-opening"
            />

            {/* Gold Inscribed Guest Invitation */}
            <div className="flex justify-center mt-3">
              <PersonalizedWaxSealBadge theme="celestial" className="max-w-[280px]" />
            </div>
          </motion.div>

          {/* Interactive Start Prompt (Nhạc bắt đầu sau khi người dùng tương tác) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 4.8 }}
            className="mt-12"
          >
            <button
              onClick={handleStartExperience}
              disabled={hasInteracted}
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#E6C687] text-neutral-950 hover:bg-[#F2D7A1] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_35px_rgba(230,198,135,0.4)] hover:shadow-[0_0_50px_rgba(230,198,135,0.7)] cursor-pointer active:scale-95"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-950 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-950"></span>
              </span>
              <Volume2 className="w-4 h-4" />
              <span>Chạm để bắt đầu phim</span>
              <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-3 text-[11px] text-neutral-400 tracking-wider">
              Khuyên dùng tai nghe & bật âm lượng để cảm nhận trọn vẹn
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
