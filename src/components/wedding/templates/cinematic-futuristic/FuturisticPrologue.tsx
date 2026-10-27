import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Fingerprint, Volume2, Radio, Compass, Orbit } from 'lucide-react';
import { weddingAudio } from '../../../../lib/audioSynth';

interface FuturisticPrologueProps {
  groomName: string;
  brideName: string;
  weddingDateStr?: string;
  coverImage: string;
  musicUrl?: string;
  onComplete: () => void;
}

export function FuturisticPrologue({
  groomName,
  brideName,
  weddingDateStr = '20 • 12 • 2026',
  coverImage,
  musicUrl,
  onComplete,
}: FuturisticPrologueProps) {
  const [step, setStep] = useState<'scan' | 'charging' | 'warp' | 'enter'>('scan');
  const [chargeProgress, setChargeProgress] = useState(0);
  const pressTimerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hyperspace canvas particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars data
    const numStars = 220;
    const stars = Array.from({ length: numStars }).map(() => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      o: 0.2 + Math.random() * 0.8,
      color: Math.random() > 0.6 ? '#00F0FF' : Math.random() > 0.3 ? '#A855F7' : '#F5D061',
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(5, 7, 17, 0.35)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const speedMultiplier = step === 'charging' ? 8 : step === 'warp' ? 26 : 1.5;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= speedMultiplier;
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const k = 250 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = Math.max(0.8, (1 - star.z / width) * (step === 'warp' ? 6 : 2.5));
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.shadowColor = star.color;
          ctx.shadowBlur = step === 'warp' ? 12 : 4;
          ctx.fill();

          // Streak lines in warp mode
          if (step === 'warp' || step === 'charging') {
            const prevK = 250 / (star.z + speedMultiplier * 1.8);
            const prevPx = star.x * prevK + cx;
            const prevPy = star.y * prevK + cy;
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = star.color;
            ctx.lineWidth = size * 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [step]);

  // Handle touch / click start charging
  const startCharging = () => {
    if (step === 'warp' || step === 'enter') return;
    setStep('charging');

    const startTime = Date.now();
    const duration = 1000; // 1 second charge

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setChargeProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        triggerWarpJump();
      }
    }, 20);

    pressTimerRef.current = interval;
  };

  const cancelCharging = () => {
    if (step === 'warp' || step === 'enter') return;
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (chargeProgress < 100) {
      setChargeProgress(0);
      setStep('scan');
    }
  };

  const triggerWarpJump = async () => {
    setStep('warp');
    try {
      await weddingAudio.play(musicUrl);
    } catch {}

    setTimeout(() => {
      setStep('enter');
      setTimeout(() => {
        onComplete();
      }, 700);
    }, 1100);
  };

  const handleInstantSkip = async () => {
    try {
      await weddingAudio.play(musicUrl);
    } catch {}
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="futuristic-prologue"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.15, filter: 'blur(16px)', transition: { duration: 0.9 } }}
        className="fixed inset-0 z-[100] bg-[#050711] text-[#F1F5F9] flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden font-body"
      >
        {/* Hyperspace canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-80" />

        {/* Cyber grid & scanlines */}
        <div className="absolute inset-0 cyber-grid-bg pointer-events-none z-[1] opacity-25" />
        <div className="absolute inset-0 cyber-scanline-overlay pointer-events-none z-[2] opacity-30" />

        {/* Corner Cyber HUD Accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#00F0FF]/60 z-20 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#00F0FF]/60 z-20 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#A855F7]/60 z-20 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#A855F7]/60 z-20 pointer-events-none" />

        {/* Top Sci-Fi Status Bar */}
        <div className="relative z-10 w-full max-w-5xl flex items-center justify-between border-b border-[#00F0FF]/25 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping" />
            <span className="font-futuristic text-xs tracking-widest text-[#00F0FF]">
              SYSTEM: QUANTUM_LOVE_ONLINE
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-neutral-400 font-mono">
            <span>COORD: 10.7769° N, 106.7009° E</span>
            <span>TIMELINE: {weddingDateStr}</span>
          </div>

          <button
            onClick={handleInstantSkip}
            className="text-xs text-[#00F0FF]/80 hover:text-white border border-[#00F0FF]/30 hover:border-[#00F0FF] px-3 py-1 rounded-full bg-[#00F0FF]/10 backdrop-blur-md transition-all cursor-pointer"
          >
            Bỏ qua mở màn ➔
          </button>
        </div>

        {/* Central Holographic Terminal */}
        <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-xl space-y-6">
          {/* Glowing Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-futuristic tracking-widest shadow-neon-cyan"
          >
            <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>KỶ NGUYÊN HÔN PHỐI TƯƠNG LAI 2026 // VIP</span>
          </motion.div>

          {/* Couple Names Hologram */}
          <div className="space-y-2">
            <h1 className="font-futuristic text-3xl sm:text-5xl font-extrabold tracking-wider bg-gradient-to-r from-[#00F0FF] via-[#F1F5F9] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              {groomName} & {brideName}
            </h1>
            <p className="font-futuristic text-xs sm:text-sm tracking-widest text-[#F5D061] flex items-center justify-center gap-2">
              <span>★</span>
              <span>GIAO THOA VẬN TỐC ÁNH SÁNG • BÁCH NIÊN VĨNH CỬU</span>
              <span>★</span>
            </p>
          </div>

          {/* Interactive Biometric Warp Trigger Button */}
          <div className="pt-4 flex flex-col items-center space-y-4">
            <div className="relative group cursor-pointer">
              {/* Outer Pulsing Rings */}
              <div
                className={`absolute -inset-4 rounded-full border border-[#00F0FF]/40 transition-all duration-300 ${
                  step === 'charging' ? 'scale-125 border-[#FF2E93] animate-ping' : 'animate-pulse'
                }`}
              />
              <div className="absolute -inset-2 rounded-full border border-[#A855F7]/50" />

              {/* Progress Ring */}
              <svg className="w-28 h-28 -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="rgba(0, 240, 255, 0.15)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke={step === 'charging' ? '#FF2E93' : '#00F0FF'}
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - chargeProgress / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-75"
                />
              </svg>

              {/* Center Fingerprint Touch Sensor */}
              <button
                id="futuristic-warp-btn"
                onMouseDown={startCharging}
                onMouseUp={cancelCharging}
                onMouseLeave={cancelCharging}
                onTouchStart={startCharging}
                onTouchEnd={cancelCharging}
                className="absolute inset-2 m-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#0D152D] to-[#1A0A2E] border-2 border-[#00F0FF] shadow-neon-cyan flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Fingerprint
                  className={`w-9 h-9 transition-colors ${
                    step === 'charging' ? 'text-[#FF2E93] scale-110' : 'text-[#00F0FF]'
                  }`}
                />
                <span className="text-[9px] font-futuristic text-white mt-1">
                  {chargeProgress > 0 ? `${chargeProgress}%` : 'CHẠM'}
                </span>
              </button>
            </div>

            <div className="space-y-1">
              <p className="font-futuristic text-xs sm:text-sm text-neutral-300 tracking-wider">
                {step === 'charging'
                  ? 'ĐANG TÍCH NĂNG LƯỢNG WARP JUMP...'
                  : 'GIỮ 1 GIÂY ĐỂ KÍCH HOẠT DU HÀNH KHÔNG GIAN'}
              </p>
              <p className="text-[11px] text-neutral-500 font-mono">
                [Hoặc nhấn nút để bước vào lễ cưới ngay]
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Feed */}
        <div className="relative z-10 w-full max-w-5xl flex items-center justify-between border-t border-[#00F0FF]/25 pt-3 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
            <span>FREQUENCY: 432Hz HARMONY</span>
          </div>

          <div className="flex items-center gap-2 text-[#F5D061]">
            <Sparkles className="w-3 h-3" />
            <span>CHẠM VÀO MÀN HÌNH ĐỂ PHÁT NHẠC TỰ ĐỘNG</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
