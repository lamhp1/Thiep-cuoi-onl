import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  Calendar,
  Compass,
  Radio,
  Clock,
  Orbit,
  Zap,
} from 'lucide-react';
import { WeddingData } from '../../../../types';

interface FuturisticHeroProps {
  data: WeddingData;
  isPlaying: boolean;
  onToggleSound: () => void;
  onScrollToTimeline: () => void;
}

export function FuturisticHero({
  data,
  isPlaying,
  onToggleSound,
  onScrollToTimeline,
}: FuturisticHeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [millis, setMillis] = useState('000');

  const groom = data.groom?.fullName || data.groomName || 'Minh Anh';
  const bride = data.bride?.fullName || data.brideName || 'Ngọc Mai';
  const weddingDateStr = data.weddingDate || '20/12/2026';

  // Countdown timer logic
  useEffect(() => {
    // Parse target date
    const parts = weddingDateStr.split(/[/-]/);
    let target = new Date();
    if (parts.length === 3) {
      // Day/Month/Year or Year/Month/Day
      if (parts[0].length === 4) {
        target = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 10, 0, 0);
      } else {
        target = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]), 10, 0, 0);
      }
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setMillis('000');
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        const ms = String(diff % 1000).padStart(3, '0');

        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
        setMillis(ms);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [weddingDateStr]);

  const coverPhoto =
    data.coverImage ||
    data.gallery?.[0]?.url ||
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center text-center overflow-hidden pt-12 pb-8 px-4 sm:px-6 select-none font-body">
      {/* Background Holographic Glow & Cyber Grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050711] via-[#0B0F24] to-[#060814] z-0" />
      <div className="absolute inset-0 cyber-grid-bg opacity-35 z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.12)_0%,transparent_70%)] z-[2]" />

      {/* Cyber Floating Telemetry Top Bar */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between border-b border-[#00F0FF]/25 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-neon-cyan animate-pulse" />
          <span className="font-futuristic text-xs tracking-widest text-[#00F0FF] uppercase">
            ORBIT // HỶ SỰ TƯƠNG LAI 2026
          </span>
        </div>

        {/* Audio Spectrum Bar */}
        <button
          onClick={onToggleSound}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 hover:border-[#00F0FF] text-[#00F0FF] text-xs font-mono transition-all cursor-pointer shadow-neon-cyan"
        >
          {isPlaying ? (
            <>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-[#00F0FF] animate-pulse" />
                <span className="w-0.5 h-3 bg-[#00F0FF] animate-bounce" />
                <span className="w-0.5 h-1.5 bg-[#00F0FF] animate-pulse" />
              </div>
              <span>ÂM NHẠC: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-400">ÂM NHẠC: OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Central Hero Core: Holographic Ring Portal */}
      <div className="relative z-10 my-auto py-8 flex flex-col items-center max-w-4xl w-full">
        {/* Hologram Orbital Rings + Couple Portrait */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
          {/* Rotating Outer Ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-[#00F0FF]/50 shadow-neon-cyan"
          />

          {/* Rotating Counter Ring 2 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border border-[#A855F7]/40 shadow-neon-purple"
          />

          {/* Glowing Target Crosshairs */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#00F0FF] rounded-full shadow-neon-cyan" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#FF2E93] rounded-full shadow-neon-pink" />
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 bg-[#00F0FF] rounded-full shadow-neon-cyan" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-1 bg-[#A855F7] rounded-full shadow-neon-purple" />

          {/* Central Portrait Container */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-[#00F0FF]/80 shadow-[0_0_40px_rgba(0,240,255,0.35)]">
            <img
              src={coverPhoto}
              alt={`${groom} & ${bride}`}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 hover:scale-110"
              referrerPolicy="no-referrer"
            />
            {/* Holographic Laser Scanline Sweep */}
            <div className="absolute inset-0 cyber-scanline-overlay opacity-35 pointer-events-none" />
            <motion.div
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#00F0FF]/30 to-transparent pointer-events-none"
            />
          </div>

          {/* Holographic Coordinate Pill Floating */}
          <div className="absolute -bottom-4 bg-[#050711]/90 border border-[#00F0FF]/60 px-4 py-1 rounded-full text-[11px] font-mono text-[#00F0FF] shadow-neon-cyan tracking-wider">
            DIMENSION: ETERNAL_LOVE_∞
          </div>
        </div>

        {/* Grand Typography */}
        <div className="mt-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-futuristic tracking-widest">
            <Zap className="w-3.5 h-3.5 text-[#F5D061]" />
            <span>KỶ NGUYÊN HÔN LỄ ĐA CHIỀU</span>
          </div>

          <h1 className="font-futuristic text-4xl sm:text-6xl md:text-7xl font-black tracking-wider bg-gradient-to-r from-[#00F0FF] via-[#F8FAFC] to-[#FF2E93] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
            {groom.toUpperCase()} & {bride.toUpperCase()}
          </h1>

          <p className="font-futuristic text-xs sm:text-base tracking-[0.2em] text-[#F5D061] uppercase">
            STARDATE: {weddingDateStr} • HÀNH TRÌNH TƯƠNG LAI BẮT ĐẦU
          </p>
        </div>

        {/* Futuristic Mission Countdown Engine */}
        <div className="mt-8 w-full max-w-2xl bg-[#090D22]/85 border border-[#00F0FF]/40 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-neon-cyan">
          <div className="flex items-center justify-between border-b border-[#00F0FF]/20 pb-2 mb-4 text-[11px] font-mono text-[#00F0FF]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              ĐỒNG HỒ ĐẾM NGƯỢC THỜI KHẮC GIAO THOA (QUANTUM TIME):
            </span>
            <span className="text-[#F5D061] font-bold">STATUS: READY_FOR_LAUNCH</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-[#050711]/80 border border-[#00F0FF]/30 rounded-xl p-2 sm:p-3 flex flex-col items-center">
              <span className="font-futuristic text-2xl sm:text-4xl font-extrabold text-[#00F0FF]">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                NGÀY
              </span>
            </div>

            <div className="bg-[#050711]/80 border border-[#00F0FF]/30 rounded-xl p-2 sm:p-3 flex flex-col items-center">
              <span className="font-futuristic text-2xl sm:text-4xl font-extrabold text-[#A855F7]">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                GIỜ
              </span>
            </div>

            <div className="bg-[#050711]/80 border border-[#00F0FF]/30 rounded-xl p-2 sm:p-3 flex flex-col items-center">
              <span className="font-futuristic text-2xl sm:text-4xl font-extrabold text-[#FF2E93]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                PHÚT
              </span>
            </div>

            <div className="bg-[#050711]/80 border border-[#F5D061]/50 rounded-xl p-2 sm:p-3 flex flex-col items-center relative overflow-hidden">
              <div className="flex items-baseline">
                <span className="font-futuristic text-2xl sm:text-4xl font-extrabold text-[#F5D061]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono text-[#F5D061]/70 ml-1 hidden sm:inline">
                  .{millis}
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                GIÂY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Call to Action */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        <button
          onClick={onScrollToTimeline}
          className="group flex flex-col items-center gap-1.5 text-xs font-futuristic text-[#00F0FF]/80 hover:text-white transition-all cursor-pointer"
        >
          <span className="tracking-widest group-hover:tracking-[0.25em] transition-all">
            KHÁM PHÁ DÒNG THỜI GIAN LƯỢNG TỬ
          </span>
          <ChevronDown className="w-5 h-5 text-[#00F0FF] animate-bounce group-hover:scale-125 transition-transform" />
        </button>
      </div>
    </div>
  );
}
