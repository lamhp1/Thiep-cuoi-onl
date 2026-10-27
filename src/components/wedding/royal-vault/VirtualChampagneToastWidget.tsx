import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Wine, Heart, Award } from 'lucide-react';
import { playCrystalGlassClink, playVaultUnlockSound } from './royalVaultSounds';

interface VirtualChampagneToastWidgetProps {
  groomName: string;
  brideName: string;
  guestName: string;
  weddingId: string;
}

export function VirtualChampagneToastWidget({
  groomName,
  brideName,
  guestName,
  weddingId,
}: VirtualChampagneToastWidgetProps) {
  const storageKey = `royal_toast_count_${weddingId}`;
  const [toastCount, setToastCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 128;
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : 128;
  });

  const [hasToasted, setHasToasted] = useState<boolean>(false);
  const [isClinking, setIsClinking] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background rising champagne bubbles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let w = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let h = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      w = canvas.width = canvas.parentElement.clientWidth;
      h = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    interface Bubble {
      x: number;
      y: number;
      r: number;
      speed: number;
      wobble: number;
      wobbleSpeed: number;
      opacity: number;
    }

    const bubbles: Bubble[] = [];
    for (let i = 0; i < 35; i++) {
      bubbles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.5 + Math.random() * 3,
        speed: 0.6 + Math.random() * 1.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.03,
        opacity: 0.25 + Math.random() * 0.65,
      });
    }

    let time = 0;
    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.03;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.wobble) * 8;

        if (b.y < -10) {
          b.y = h + 10;
          b.x = Math.random() * w;
        }

        // Draw glowing champagne bubble
        const grad = ctx.createRadialGradient(currentX, b.y, 0, currentX, b.y, b.r * 2);
        grad.addColorStop(0, `rgba(255, 245, 215, ${b.opacity})`);
        grad.addColorStop(0.5, `rgba(232, 180, 152, ${b.opacity * 0.6})`);
        grad.addColorStop(1, 'rgba(232, 180, 152, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.r * 2, 0, Math.PI * 2);
        ctx.fill();

        // Shiny center core
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(currentX - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleToast = () => {
    if (isClinking) return;
    setIsClinking(true);
    setHasToasted(true);

    const nextCount = toastCount + 1;
    setToastCount(nextCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(nextCount));
    }

    // Audio chime
    playCrystalGlassClink();
    setTimeout(() => {
      playVaultUnlockSound();
    }, 180);

    // Confetti
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#FCE4BE', '#E8B498', '#FFFFFF', '#FFD700', '#DCA389'],
    });

    setTimeout(() => {
      setIsClinking(false);
    }, 1200);
  };

  return (
    <div className="relative my-12 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#1A1222] via-[#140E1B] to-[#100A15] border border-[#E8B498]/45 shadow-[0_15px_60px_rgba(0,0,0,0.7)] text-center overflow-hidden group">
      {/* Background Champagne Bubbles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Ambient Spotlight Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,180,152,0.18)_0,transparent_75%)] pointer-events-none" />

      {/* Top Section Badge */}
      <div className="relative z-10 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8B498]/15 border border-[#E8B498]/40 text-[#E8B498] text-xs font-serif tracking-widest uppercase mb-3 shadow-lg">
          <Wine className="w-3.5 h-3.5" />
          <span>NÂNG LY CHÚC MỪNG HOÀNG GIA</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-serif text-white mb-2 tracking-wide drop-shadow-[0_0_20px_rgba(232,180,152,0.3)]">
          Hòa Chung Ly Rượu Mừng
        </h3>
        <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto mb-8 font-light leading-relaxed">
          Hãy cùng chạm ly chúc cho tình yêu của <span className="font-semibold text-[#FCE4BE]">{groomName} & {brideName}</span> luôn nồng nàn, sắt son và trọn vẹn hạnh phúc.
        </p>

        {/* --- HIGH-END VECTOR CRYSTAL CHAMPAGNE FLUTES STAGE --- */}
        <div className="relative h-52 sm:h-60 flex items-center justify-center mb-6 select-none">
          {/* Background Royal Champagne Tower Glass Silhouette */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <svg width="280" height="180" viewBox="0 0 280 180" fill="none">
              <path d="M140 10 L160 50 L120 50 Z" stroke="#E8B498" strokeWidth="1" fill="rgba(232,180,152,0.1)" />
              <path d="M100 60 L120 100 L80 100 Z" stroke="#E8B498" strokeWidth="1" fill="rgba(232,180,152,0.1)" />
              <path d="M180 60 L200 100 L160 100 Z" stroke="#E8B498" strokeWidth="1" fill="rgba(232,180,152,0.1)" />
              <path d="M60 110 L80 150 L40 150 Z" stroke="#E8B498" strokeWidth="1" fill="rgba(232,180,152,0.1)" />
              <path d="M140 110 L160 150 L120 150 Z" stroke="#E8B498" strokeWidth="1" fill="rgba(232,180,152,0.1)" />
              <path d="M220 110 L240 150 L200 150 Z" stroke="#E8B498" strokeWidth="1" fill="rgba(232,180,152,0.1)" />
            </svg>
          </div>

          {/* Left Flute (Groom's Glass) */}
          <motion.div
            animate={
              isClinking
                ? { x: [0, 42, 0], rotate: [0, 22, 0] }
                : { rotate: [-2, 2, -2], y: [-2, 2, -2] }
            }
            transition={{
              duration: isClinking ? 0.6 : 3.5,
              repeat: isClinking ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 flex flex-col items-center cursor-pointer group/flute"
            onClick={handleToast}
          >
            {/* Vector Crystal Flute */}
            <div className="relative w-20 h-40 sm:w-24 sm:h-48 drop-shadow-[0_10px_20px_rgba(232,180,152,0.3)]">
              <svg viewBox="0 0 100 200" className="w-full h-full overflow-visible">
                <defs>
                  {/* Golden Champagne Liquid Gradient */}
                  <linearGradient id="wineGradLeft" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFF3D6" />
                    <stop offset="30%" stopColor="#FFD57E" />
                    <stop offset="70%" stopColor="#E8B498" />
                    <stop offset="100%" stopColor="#9E5F48" />
                  </linearGradient>

                  {/* Crystal Rim Highlight */}
                  <linearGradient id="crystalGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#E8B498" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Base Glass Stand */}
                <ellipse cx="50" cy="188" rx="28" ry="6" fill="url(#crystalGlow)" stroke="#E8B498" strokeWidth="1.5" />
                {/* Slender Stem */}
                <line x1="50" y1="120" x2="50" y2="188" stroke="url(#crystalGlow)" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="50" y1="120" x2="50" y2="188" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

                {/* Crystal Bowl Outline */}
                <path
                  d="M 28 20 C 28 80, 42 120, 50 120 C 58 120, 72 80, 72 20 Z"
                  fill="rgba(255,255,255,0.06)"
                  stroke="#E8B498"
                  strokeWidth="2"
                />

                {/* Golden Champagne Liquid Fill */}
                <path
                  d="M 32 45 C 32 82, 43 115, 50 115 C 57 115, 68 82, 68 45 C 58 48, 42 42, 32 45 Z"
                  fill="url(#wineGradLeft)"
                />

                {/* Effervescent Rising Micro-Bubbles inside glass */}
                <circle cx="46" cy="90" r="1.5" fill="#FFF" opacity="0.9">
                  <animate attributeName="cy" values="100;45" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="54" cy="75" r="2" fill="#FFF" opacity="0.8">
                  <animate attributeName="cy" values="105;45" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="40" cy="80" r="1.2" fill="#FFF" opacity="0.9">
                  <animate attributeName="cy" values="95;45" dur="1.5s" repeatCount="indefinite" />
                </circle>

                {/* Crystal Specular Side Sheen */}
                <path d="M 31 22 Q 33 70 48 116" stroke="#FFF" strokeWidth="2.5" fill="none" opacity="0.75" strokeLinecap="round" />
                {/* Top Glass Rim */}
                <ellipse cx="50" cy="20" rx="22" ry="4" fill="none" stroke="#FFF" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-[11px] font-serif uppercase tracking-widest text-[#E8B498] font-semibold mt-1">
              {groomName}
            </span>
          </motion.div>

          {/* Central Clink Flash & Starburst Pulse */}
          <AnimatePresence>
            {isClinking && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.8, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              >
                {/* Radiant Shockwave Circle */}
                <div className="w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(252,228,190,0.9)_35%,rgba(232,180,152,0.6)_65%,transparent_80%)] shadow-[0_0_60px_#FFFFFF]" />
                <Sparkles className="w-10 h-10 text-amber-200 absolute animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Flute (Bride's Glass) */}
          <motion.div
            animate={
              isClinking
                ? { x: [0, -42, 0], rotate: [0, -22, 0] }
                : { rotate: [2, -2, 2], y: [2, -2, 2] }
            }
            transition={{
              duration: isClinking ? 0.6 : 3.5,
              repeat: isClinking ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 flex flex-col items-center cursor-pointer group/flute"
            onClick={handleToast}
          >
            {/* Vector Crystal Flute */}
            <div className="relative w-20 h-40 sm:w-24 sm:h-48 drop-shadow-[0_10px_20px_rgba(232,180,152,0.3)]">
              <svg viewBox="0 0 100 200" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="wineGradRight" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFF3D6" />
                    <stop offset="30%" stopColor="#FFD57E" />
                    <stop offset="70%" stopColor="#E8B498" />
                    <stop offset="100%" stopColor="#9E5F48" />
                  </linearGradient>
                </defs>

                {/* Base Stand */}
                <ellipse cx="50" cy="188" rx="28" ry="6" fill="url(#crystalGlow)" stroke="#E8B498" strokeWidth="1.5" />
                {/* Slender Stem */}
                <line x1="50" y1="120" x2="50" y2="188" stroke="url(#crystalGlow)" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="50" y1="120" x2="50" y2="188" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

                {/* Bowl Outline */}
                <path
                  d="M 28 20 C 28 80, 42 120, 50 120 C 58 120, 72 80, 72 20 Z"
                  fill="rgba(255,255,255,0.06)"
                  stroke="#E8B498"
                  strokeWidth="2"
                />

                {/* Golden Liquid Fill */}
                <path
                  d="M 32 45 C 32 82, 43 115, 50 115 C 57 115, 68 82, 68 45 C 58 42, 42 48, 32 45 Z"
                  fill="url(#wineGradRight)"
                />

                {/* Rising Micro-Bubbles */}
                <circle cx="52" cy="85" r="1.5" fill="#FFF" opacity="0.9">
                  <animate attributeName="cy" values="105;45" dur="1.7s" repeatCount="indefinite" />
                </circle>
                <circle cx="44" cy="70" r="2" fill="#FFF" opacity="0.8">
                  <animate attributeName="cy" values="100;45" dur="2.1s" repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="92" r="1.2" fill="#FFF" opacity="0.9">
                  <animate attributeName="cy" values="110;45" dur="1.6s" repeatCount="indefinite" />
                </circle>

                {/* Crystal Specular Sheen */}
                <path d="M 69 22 Q 67 70 52 116" stroke="#FFF" strokeWidth="2.5" fill="none" opacity="0.75" strokeLinecap="round" />
                {/* Rim */}
                <ellipse cx="50" cy="20" rx="22" ry="4" fill="none" stroke="#FFF" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-[11px] font-serif uppercase tracking-widest text-[#E8B498] font-semibold mt-1">
              {brideName}
            </span>
          </motion.div>
        </div>

        {/* Live Toast Counter Display */}
        <div className="mb-6 p-4 rounded-2xl bg-black/60 border border-[#E8B498]/30 max-w-sm mx-auto shadow-inner backdrop-blur-md">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-[#FCE4BE] tabular-nums block drop-shadow-[0_0_15px_rgba(232,180,152,0.5)]">
            {toastCount.toLocaleString('vi-VN')}
          </span>
          <span className="text-[11px] text-[#E8B498]/90 font-serif uppercase tracking-widest block mt-0.5">
            Ly Rượu Mừng Đã Được Nâng
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleToast}
          disabled={isClinking}
          className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E8B498] via-[#FCE4BE] to-[#E8B498] text-[#190F14] font-serif font-bold text-xs uppercase tracking-wider shadow-[0_0_35px_rgba(232,180,152,0.5)] hover:shadow-[0_0_50px_rgba(232,180,152,0.85)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 mx-auto cursor-pointer"
        >
          <Wine className="w-4 h-4 group-hover:rotate-12 transition-transform text-[#190F14]" />
          <span>{hasToasted ? 'Nâng Ly Lần Nữa' : 'Nâng Ly Chúc Mừng Ngay'}</span>
        </button>

        {/* Personalized Congratulation Note */}
        {hasToasted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-xl bg-[#E8B498]/10 border border-[#E8B498]/30 inline-flex items-center gap-2 text-xs text-[#FCE4BE] font-serif italic"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8B498] shrink-0" />
            <span>Cảm ơn <strong className="text-white not-italic">{guestName}</strong> đã nâng ly gửi trao lời chúc phúc trọn vẹn!</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
