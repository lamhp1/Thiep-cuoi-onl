import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  SparklingStar,
  HoiAnGlobeLantern,
  HoiAnDiamondLantern,
  HoiAnGarlicLantern,
  AuthenticSkyLantern,
  NightCrescentMoon,
  LotusNightIcon,
} from './LanternNightOrnaments';
import { Sparkles, Flame, Volume2, Mail, Heart, ArrowRight } from 'lucide-react';
import { weddingAudio } from '../../../../lib/audioSynth';
import { playLanternWindChime } from './LanternAudioBar';
import { PersonalizedWaxSealBadge } from '../../common/PersonalizedWaxSealBadge';

interface LanternNightOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  city?: string;
  musicUrl?: string;
  onEnter: () => void;
}

interface RisingLanternSpec {
  id: number;
  type: 'sky-dome' | 'globe' | 'diamond' | 'garlic';
  left: number; // %
  bottomOffset: number; // px
  scale: number;
  delay: number; // seconds
  duration: number; // seconds
  driftClass: string;
  colorVariant: 'amber' | 'gold' | 'crimson' | 'rose' | 'sunset';
  zIndex: number;
}

export function LanternNightOpening({
  groomName,
  brideName,
  weddingDate,
  city = 'TP. Huế',
  musicUrl,
  onEnter,
}: LanternNightOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [waxBroken, setWaxBroken] = useState(false);

  // Deterministic, organically scattered lanterns rising with UNIFORM linear speed
  const risingLanterns: RisingLanternSpec[] = useMemo(() => [
    { id: 1, type: 'sky-dome', left: 4, bottomOffset: -60, scale: 0.95, delay: 0.05, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'amber', zIndex: 18 },
    { id: 2, type: 'sky-dome', left: 12, bottomOffset: -120, scale: 0.65, delay: 0.35, duration: 5.8, driftClass: 'animate-lantern-drift-left', colorVariant: 'gold', zIndex: 12 },
    { id: 3, type: 'globe', left: 18, bottomOffset: -80, scale: 0.8, delay: 0.15, duration: 5.8, driftClass: 'animate-sky-lantern-rise', colorVariant: 'crimson', zIndex: 15 },
    { id: 4, type: 'sky-dome', left: 24, bottomOffset: -160, scale: 1.15, delay: 0.0, duration: 5.8, driftClass: 'animate-lantern-drift-zigzag', colorVariant: 'sunset', zIndex: 22 },
    { id: 5, type: 'diamond', left: 30, bottomOffset: -100, scale: 0.7, delay: 0.5, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'gold', zIndex: 14 },
    { id: 6, type: 'sky-dome', left: 36, bottomOffset: -140, scale: 0.55, delay: 0.7, duration: 5.8, driftClass: 'animate-lantern-drift-left', colorVariant: 'amber', zIndex: 11 },
    { id: 7, type: 'sky-dome', left: 42, bottomOffset: -90, scale: 1.05, delay: 0.1, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'amber', zIndex: 20 },
    { id: 8, type: 'garlic', left: 48, bottomOffset: -180, scale: 0.75, delay: 0.8, duration: 5.8, driftClass: 'animate-sky-lantern-rise', colorVariant: 'rose', zIndex: 13 },
    { id: 9, type: 'sky-dome', left: 54, bottomOffset: -70, scale: 1.1, delay: 0.2, duration: 5.8, driftClass: 'animate-lantern-drift-zigzag', colorVariant: 'gold', zIndex: 21 },
    { id: 10, type: 'sky-dome', left: 60, bottomOffset: -130, scale: 0.6, delay: 0.6, duration: 5.8, driftClass: 'animate-lantern-drift-left', colorVariant: 'sunset', zIndex: 12 },
    { id: 11, type: 'globe', left: 66, bottomOffset: -90, scale: 0.85, delay: 0.3, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'crimson', zIndex: 16 },
    { id: 12, type: 'sky-dome', left: 72, bottomOffset: -150, scale: 1.18, delay: 0.05, duration: 5.8, driftClass: 'animate-sky-lantern-rise', colorVariant: 'amber', zIndex: 22 },
    { id: 13, type: 'diamond', left: 78, bottomOffset: -110, scale: 0.68, delay: 0.45, duration: 5.8, driftClass: 'animate-lantern-drift-zigzag', colorVariant: 'gold', zIndex: 13 },
    { id: 14, type: 'sky-dome', left: 84, bottomOffset: -80, scale: 0.92, delay: 0.25, duration: 5.8, driftClass: 'animate-lantern-drift-left', colorVariant: 'sunset', zIndex: 17 },
    { id: 15, type: 'sky-dome', left: 91, bottomOffset: -140, scale: 0.72, delay: 0.55, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'amber', zIndex: 14 },
    { id: 16, type: 'sky-dome', left: 96, bottomOffset: -60, scale: 1.0, delay: 0.15, duration: 5.8, driftClass: 'animate-lantern-drift-left', colorVariant: 'rose', zIndex: 19 },
    // Staggered second wave (rising mid-flight at identical uniform speed)
    { id: 17, type: 'sky-dome', left: 8, bottomOffset: -220, scale: 0.85, delay: 1.0, duration: 5.8, driftClass: 'animate-lantern-drift-zigzag', colorVariant: 'gold', zIndex: 15 },
    { id: 18, type: 'garlic', left: 15, bottomOffset: -260, scale: 0.6, delay: 1.3, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'amber', zIndex: 11 },
    { id: 19, type: 'sky-dome', left: 22, bottomOffset: -200, scale: 1.05, delay: 0.95, duration: 5.8, driftClass: 'animate-lantern-drift-left', colorVariant: 'sunset', zIndex: 20 },
    { id: 20, type: 'diamond', left: 28, bottomOffset: -240, scale: 0.7, delay: 1.5, duration: 5.8, driftClass: 'animate-sky-lantern-rise', colorVariant: 'amber', zIndex: 13 },
    { id: 21, type: 'sky-dome', left: 35, bottomOffset: -190, scale: 0.5, delay: 1.2, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'rose', zIndex: 10 },
    { id: 22, type: 'globe', left: 45, bottomOffset: -230, scale: 0.9, delay: 0.85, duration: 5.8, driftClass: 'animate-lantern-drift-zigzag', colorVariant: 'crimson', zIndex: 18 },
    { id: 23, type: 'sky-dome', left: 51, bottomOffset: -270, scale: 1.15, delay: 1.15, duration: 5.8, driftClass: 'animate-lantern-drift-left', colorVariant: 'amber', zIndex: 22 },
    { id: 24, type: 'sky-dome', left: 58, bottomOffset: -210, scale: 0.65, delay: 1.4, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'gold', zIndex: 12 },
    { id: 25, type: 'garlic', left: 63, bottomOffset: -250, scale: 0.78, delay: 1.6, duration: 5.8, driftClass: 'animate-sky-lantern-rise', colorVariant: 'sunset', zIndex: 14 },
    { id: 26, type: 'sky-dome', left: 70, bottomOffset: -190, scale: 1.0, delay: 1.05, duration: 5.8, driftClass: 'animate-lantern-drift-zigzag', colorVariant: 'amber', zIndex: 19 },
    { id: 27, type: 'diamond', left: 77, bottomOffset: -230, scale: 0.62, delay: 1.7, duration: 5.8, driftClass: 'animate-lantern-drift-left', colorVariant: 'gold', zIndex: 11 },
    { id: 28, type: 'sky-dome', left: 83, bottomOffset: -210, scale: 0.88, delay: 1.25, duration: 5.8, driftClass: 'animate-lantern-drift-right', colorVariant: 'rose', zIndex: 16 },
    { id: 29, type: 'globe', left: 88, bottomOffset: -260, scale: 0.75, delay: 1.8, duration: 5.8, driftClass: 'animate-sky-lantern-rise', colorVariant: 'crimson', zIndex: 13 },
    { id: 30, type: 'sky-dome', left: 94, bottomOffset: -200, scale: 1.1, delay: 1.1, duration: 5.8, driftClass: 'animate-lantern-drift-zigzag', colorVariant: 'sunset', zIndex: 21 },
  ], []);

  const handleOpenEnvelope = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);

    // 1. Play chime and romantic wedding audio
    try {
      playLanternWindChime();
      weddingAudio.play(musicUrl);
    } catch {
      // Audio autoplay policy fallback
    }

    // 2. Break wax seal with gold & ruby sparks
    setTimeout(() => {
      setWaxBroken(true);
      try {
        confetti({
          particleCount: 110,
          spread: 110,
          origin: { y: 0.55 },
          colors: ['#F59E0B', '#FDE68A', '#D97706', '#991B1B', '#FFFBEB', '#DC2626', '#FEF08A'],
        });
      } catch {
        // ignore
      }
    }, 250);

    // 3. Extended flight duration (4.8 seconds) with 100% pure CSS animation
    // Zero React re-renders during flight for silky smooth 60fps execution
    setTimeout(() => {
      setIsOpened(true);
      onEnter();
    }, 4800);
  };

  const handleSkipToWedding = () => {
    setIsOpened(true);
    onEnter();
  };

  if (isOpened) return null;

  return (
    <AnimatePresence>
      <div
        id="lantern-opening-curtain"
        className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6 select-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #1A0713 0%, #0C0F1E 50%, #05070D 100%)',
        }}
      >
        {/* Night Sky Crescent Moon & Ambient Constellations */}
        <div className="absolute top-4 right-5 sm:top-10 sm:right-16 opacity-80 animate-pulse pointer-events-none">
          <NightCrescentMoon className="w-16 h-16 sm:w-24 sm:h-24 text-amber-200/50" />
        </div>

        {/* Ambient Stardust Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(36)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-200/80 animate-star-twinkle"
              style={{
                top: `${(i * 17 + 5) % 100}%`,
                left: `${(i * 23 + 7) % 100}%`,
                width: `${1.5 + (i % 3)}px`,
                height: `${1.5 + (i % 3)}px`,
                animationDelay: `${(i % 5) * 0.7}s`,
                animationDuration: `${2.5 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* RISING SKY LANTERNS SPECTACLE (Authentic, Chaotic / Organic, Graceful) */}
        {isOpening && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {risingLanterns.map((lantern) => (
              <div
                key={lantern.id}
                className={`absolute ${lantern.driftClass}`}
                style={{
                  left: `${lantern.left}%`,
                  bottom: `${lantern.bottomOffset}px`,
                  animationDelay: `${lantern.delay}s`,
                  animationDuration: `${lantern.duration}s`,
                  zIndex: lantern.zIndex,
                }}
              >
                {/* Render authentic, easily recognizable lantern shapes */}
                {lantern.type === 'sky-dome' && (
                  <AuthenticSkyLantern
                    className="w-12 h-20 sm:w-16 sm:h-26"
                    colorVariant={lantern.colorVariant}
                    scale={lantern.scale}
                  />
                )}

                {lantern.type === 'globe' && (
                  <div style={{ transform: `scale(${lantern.scale * 0.85})` }}>
                    <HoiAnGlobeLantern
                      glowIntensity={1.2}
                      colorVariant={lantern.colorVariant === 'rose' || lantern.colorVariant === 'sunset' ? 'burgundy' : (lantern.colorVariant as 'amber' | 'burgundy' | 'crimson' | 'gold')}
                      className="w-12 h-26 sm:w-14 sm:h-30"
                    />
                  </div>
                )}

                {lantern.type === 'diamond' && (
                  <div style={{ transform: `scale(${lantern.scale * 0.85})` }}>
                    <HoiAnDiamondLantern
                      glowIntensity={1.2}
                      colorVariant={lantern.colorVariant === 'rose' || lantern.colorVariant === 'sunset' ? 'amber' : (lantern.colorVariant as 'amber' | 'burgundy' | 'crimson' | 'gold')}
                      className="w-12 h-28 sm:w-14 sm:h-34"
                    />
                  </div>
                )}

                {lantern.type === 'garlic' && (
                  <div style={{ transform: `scale(${lantern.scale * 0.85})` }}>
                    <HoiAnGarlicLantern
                      glowIntensity={1.2}
                      colorVariant={lantern.colorVariant === 'crimson' ? 'burgundy' : 'amber'}
                      className="w-12 h-28 sm:w-14 sm:h-32"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Ambient Rising Ember Sparks during opening */}
        {isOpening && (
          <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
            {[...Array(24)].map((_, i) => (
              <div
                key={`spark-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 blur-2xs animate-sky-lantern-rise"
                style={{
                  left: `${(i * 13 + 7) % 100}%`,
                  bottom: '-20px',
                  animationDelay: `${(i % 8) * 0.3}s`,
                  animationDuration: `${3.5 + (i % 3)}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        )}

        {/* Floating Flight Banner & Skip Option during lantern ascent */}
        {isOpening && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-8 sm:top-12 z-40 flex flex-col items-center gap-3 px-4 max-w-md text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-950/85 border border-amber-400/60 text-amber-200 text-xs sm:text-sm font-serif shadow-[0_0_30px_rgba(245,158,11,0.5)] backdrop-blur-md">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Vạn Đèn Lồng Đang Bay Lên Thắp Sáng Bầu Trời...</span>
              <SparklingStar className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            </div>

            {/* Glowing Golden Progress Bar */}
            <div className="w-48 sm:w-64 h-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 overflow-hidden shadow-inner">
              <div
                className="h-full bg-linear-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,1)] animate-lantern-progress-bar"
              />
            </div>

            {/* Quick Skip button */}
            <button
              type="button"
              onClick={handleSkipToWedding}
              className="cursor-pointer text-xs font-serif text-amber-300/80 hover:text-amber-100 flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-amber-950/50 transition-colors"
            >
              <span>Vào xem thiệp ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Left Side Hanging Lantern */}
        <div className="absolute top-0 left-2 sm:left-8 lg:left-16 animate-lantern-sway-left pointer-events-none z-10">
          <HoiAnDiamondLantern
            glowIntensity={isOpening ? 1.8 : 0.9}
            colorVariant="amber"
            className="w-10 sm:w-14 md:w-16 h-28 sm:h-40"
          />
        </div>

        {/* Right Side Hanging Lantern */}
        <div className="absolute top-0 right-2 sm:right-8 lg:right-16 animate-lantern-sway-right pointer-events-none z-10">
          <HoiAnGlobeLantern
            glowIntensity={isOpening ? 1.8 : 0.9}
            colorVariant="burgundy"
            className="w-10 sm:w-14 md:w-16 h-26 sm:h-38"
          />
        </div>

        {/* Ancient Rooftop Silhouette at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-28 sm:h-36 opacity-35 pointer-events-none overflow-hidden flex items-end justify-center z-15">
          <svg viewBox="0 0 1200 160" preserveAspectRatio="none" className="w-full h-full text-[#04060B] fill-current">
            <path d="M0,160 L0,120 Q150,70 300,105 Q450,140 600,85 Q750,50 900,100 Q1050,130 1200,90 L1200,160 Z" />
          </svg>
        </div>

        {/* Main Royal 3D Envelope Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={
            isOpening
              ? { scale: 1.08, opacity: 0, y: -30, filter: 'blur(10px)' }
              : { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }
          }
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className={`relative z-20 w-full max-w-md sm:max-w-lg ${isOpening ? 'pointer-events-none' : ''}`}
          style={{ perspective: '1200px' }}
        >
          {/* Outer Radiant Amber Halo */}
          <div className="absolute -inset-1.5 rounded-[36px] bg-linear-to-b from-amber-500/40 via-red-900/30 to-amber-600/40 blur-2xl opacity-90 animate-pulse" />

          {/* Physical Envelope Card */}
          <div className="relative rounded-[32px] bg-linear-to-b from-[#141A2E] via-[#1A1224] to-[#240C1A] border-2 border-amber-500/60 shadow-[0_25px_70px_rgba(0,0,0,0.9)] p-6 sm:p-8 text-center overflow-hidden">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/70 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/70 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/70 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/70 rounded-br-xl pointer-events-none" />

            {/* Subtle Watermark Lotus Pattern */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <LotusNightIcon className="w-80 h-80 text-amber-200" />
            </div>

            {/* Top Royal Header Pill */}
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-400/50 text-amber-200 text-xs font-serif uppercase tracking-[0.2em] shadow-lg backdrop-blur-md mb-3">
              <span className="inline-block animate-spin" style={{ animationDuration: '8s' }}>
                <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
              </span>
              <span>Vietnamese Night Wedding</span>
              <span className="inline-block animate-spin" style={{ animationDuration: '8s' }}>
                <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </div>

            {/* Inscribed Gold Guest Name Badge */}
            <PersonalizedWaxSealBadge theme="gold" className="my-2 max-w-[300px]" />

            {/* Royal Invitation Title */}
            <div className="relative space-y-1 mb-5">
              <p className="font-serif text-[11px] sm:text-xs text-amber-300/90 uppercase tracking-[0.3em]">
                Trân Trọng Kính Mời Dự Dạ Tiệc Cưới
              </p>
              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-[#FFFDF7] via-[#FDE68A] to-[#D97706] drop-shadow-[0_2px_14px_rgba(245,158,11,0.6)]">
                Thiệp Báo Hỷ
              </h2>
            </div>

            {/* Couple Centerpiece */}
            <div className="relative my-5 py-4 px-3 sm:px-6 rounded-2xl bg-neutral-950/60 border border-amber-500/40 backdrop-blur-xs space-y-2 shadow-inner">
              <div className="flex justify-center">
                <SparklingStar className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-serif-title font-bold tracking-wider text-amber-100 uppercase animate-gold-shimmer bg-linear-to-r from-amber-100 via-amber-300 via-amber-100 to-amber-400 bg-clip-text text-transparent">
                {groomName}
              </div>
              <div className="text-xl font-serif text-amber-400 select-none">&amp;</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-serif-title font-bold tracking-wider text-amber-100 uppercase animate-gold-shimmer bg-linear-to-r from-amber-100 via-amber-300 via-amber-100 to-amber-400 bg-clip-text text-transparent">
                {brideName}
              </div>
              <div className="flex justify-center">
                <SparklingStar className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>

            {/* Date & Location */}
            <div className="relative font-serif text-amber-200/90 text-sm sm:text-base tracking-[0.2em] mb-6">
              <span className="font-bold text-amber-300">{weddingDate}</span>
              <span className="mx-2.5 text-amber-500">•</span>
              <span>{city}</span>
            </div>

            {/* Interactive Royal Wax Seal Button (Con Dấu Sáp Hỷ Khí) */}
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  id="open-lantern-wax-seal"
                  onClick={handleOpenEnvelope}
                  disabled={isOpening}
                  title="Chạm vào con dấu sáp hoàng gia để mở thiệp"
                  className={`group relative cursor-pointer w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-transform duration-300 active:scale-95 ${
                    waxBroken ? 'scale-110 opacity-0' : 'animate-wax-seal hover:scale-105'
                  }`}
                >
                  {/* Wax Seal Outer Rim */}
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#A81D24] via-[#7F1318] to-[#4A0A0E] border-2 border-amber-400/80 shadow-[0_4px_20px_rgba(185,28,28,0.7)]" />

                  {/* Wax Seal Inner Impression */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-amber-400/60 flex flex-col items-center justify-center bg-radial from-[#991B1B] to-[#590C12] text-amber-200 shadow-inner">
                    <span className="font-serif-title font-bold text-xl sm:text-2xl tracking-tighter text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      囍
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-amber-300/80 font-serif">
                      SONG HỶ
                    </span>
                  </div>

                  {/* Flame Spark Indicator */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                  </div>
                </button>
              </div>

              {/* Main Action Button */}
              <button
                type="button"
                id="open-lantern-envelope-btn"
                onClick={handleOpenEnvelope}
                disabled={isOpening}
                className="group relative cursor-pointer w-full sm:w-auto px-8 py-3.5 rounded-full bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-serif-title font-bold text-xs sm:text-sm tracking-[0.15em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.7)] hover:shadow-[0_0_50px_rgba(245,158,11,1)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <Flame className="w-4 h-4 text-amber-950 animate-bounce" />
                <span>Thắp Sáng Đèn Lồng &amp; Mở Thiệp</span>
                <Sparkles className="w-4 h-4 text-amber-950 group-hover:rotate-45 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleSkipToWedding}
                className="text-[11px] font-serif text-neutral-400 hover:text-amber-200 underline underline-offset-4 cursor-pointer transition-colors mt-0.5"
              >
                Bỏ qua nghi thức &amp; xem thiệp ngay
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
