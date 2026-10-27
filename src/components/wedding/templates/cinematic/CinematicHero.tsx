import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Film, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { WeddingData } from '../../../../types';
import { CoupleNamesStacked } from '../../common/CoupleNamesStacked';

interface CinematicHeroProps {
  data: WeddingData;
  onScrollToStory?: () => void;
  isPlaying: boolean;
  onToggleSound: () => void;
}

export function CinematicHero({
  data,
  onScrollToStory,
  isPlaying,
  onToggleSound,
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven transforms
  // Image zoom and subtle blur when scrolling down
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.25]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.85, 0.4]);

  // Typography motion: Tên cô dâu / chú rể dịch chuyển theo scroll
  const groomX = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const brideX = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const plusScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.8]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.6, 0]);

  // Mask & aperture opening
  const letterboxH = useTransform(scrollYProgress, [0, 0.4], ['3.5rem', '0rem']);

  const groomFirstName = data.groom.name.toUpperCase() || 'MINH ANH';
  const brideFirstName = data.bride.name.toUpperCase() || 'NGỌC MAI';

  return (
    <div
      ref={containerRef}
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black text-[#FAF6EE] select-none flex items-center justify-center"
    >
      {/* Dynamic Background Image with Parallax & Slow Zoom */}
      <motion.div
        style={{
          scale: imageScale,
          y: imageY,
          opacity: imageOpacity,
        }}
        className="absolute inset-0 w-full h-full transform-gpu"
      >
        <div
          className="w-full h-full bg-center bg-cover filter brightness-[0.72] contrast-[1.08] saturate-[1.05]"
          style={{ backgroundImage: `url(${data.coverImage})` }}
        />
        {/* Cinematic Vignette and Lighting Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* 35mm Film Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-10"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 0)`,
          backgroundSize: '4px 4px',
        }}
      />

      {/* Top Letterbox Cinema Bar with Film Slate Info */}
      <motion.div
        style={{ height: letterboxH }}
        className="absolute top-0 left-0 right-0 z-30 bg-black/85 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 sm:px-10 overflow-hidden"
      >
        <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] font-mono uppercase text-neutral-400">
          <Film className="w-3.5 h-3.5 text-[#E6C687]" />
          <span className="text-[#E6C687] font-semibold">SCENE: WEDDING PREMIERE</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">TAKE 01</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">2.39:1 ANAMORPHIC</span>
        </div>

        {/* Audio control pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-mono tracking-widest text-neutral-200 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#E6C687] animate-pulse" />
                <span className="hidden sm:inline text-[#E6C687]">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline text-neutral-400">AUDIO OFF</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Center Cinematic Title:
          MINH ANH
          +
          NGỌC MAI
          With scroll-driven parallax movement
      */}
      <motion.div
        style={{
          y: titleY,
          opacity: titleOpacity,
        }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto"
      >
        {/* Premiere Label */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-[#E6C687]/40 backdrop-blur-md text-[11px] sm:text-xs font-mono tracking-[0.35em] text-[#E6C687] uppercase mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
          <span>AN INTERACTIVE WEDDING FILM</span>
        </motion.div>

        {/* CENTER CINEMATIC COUPLE NAMES: 3 ROWS (Groom / Heart / Bride) */}
        <div className="w-full max-w-4xl mx-auto px-4">
          <CoupleNamesStacked
            groomName={groomFirstName}
            brideName={brideFirstName}
            variant="hero-xl"
            textColor="#FAF6EE"
            heartColor="#E6C687"
            groomClassName="font-extrabold drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
            brideClassName="font-extrabold drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)]"
            idPrefix="cinematic-hero"
          />
        </div>

        {/* Date & Location Movie Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-6 text-xs sm:text-sm md:text-base font-light tracking-[0.35em] text-[#E6C687] uppercase"
        >
          PREMIERE &nbsp;•&nbsp; 20 . 12 . 2026 &nbsp;•&nbsp; HUẾ, VIỆT NAM
        </motion.p>
      </motion.div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={onScrollToStory}
      >
        <span className="text-[10px] tracking-[0.3em] font-mono text-neutral-400 uppercase group-hover:text-[#E6C687] transition-colors">
          SCROLL TO PLAY CHAPTERS
        </span>
        <div className="w-5 h-9 rounded-full border border-white/30 flex items-start justify-center p-1 group-hover:border-[#E6C687] transition-colors">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-[#E6C687]"
          />
        </div>
      </motion.div>
    </div>
  );
}
