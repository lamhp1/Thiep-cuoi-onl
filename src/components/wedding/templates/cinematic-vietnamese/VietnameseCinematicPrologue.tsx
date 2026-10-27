import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Film, Volume2, ShieldCheck, Flame } from 'lucide-react';
import { weddingAudio } from '../../../../lib/audioSynth';
import { SongHyGlyph, LotusOrnament, AuspiciousCloud, DongSonDrumPattern } from '../../vietnamese-traditional/TraditionalOrnaments';

interface VietnameseCinematicPrologueProps {
  groomName: string;
  brideName: string;
  weddingDateStr?: string;
  coverImage: string;
  musicUrl?: string;
  onComplete: () => void;
}

export function VietnameseCinematicPrologue({
  groomName,
  brideName,
  weddingDateStr = '20 • 12 • 2026',
  coverImage,
  musicUrl,
  onComplete,
}: VietnameseCinematicPrologueProps) {
  const [step, setStep] = useState<'decree-lines' | 'seal-ready' | 'stamping' | 'unveiling'>('decree-lines');
  const [stampActivated, setStampActivated] = useState(false);

  useEffect(() => {
    // Automatically transition decree lines to seal prompt after 4 seconds
    const timer = setTimeout(() => {
      if (step === 'decree-lines') {
        setStep('seal-ready');
      }
    }, 4200);

    return () => clearTimeout(timer);
  }, [step]);

  const handleKhaiAn = async () => {
    if (stampActivated) return;
    setStampActivated(true);
    setStep('stamping');

    // Trigger audio playback
    try {
      await weddingAudio.play(musicUrl);
    } catch (e) {
      console.warn('Audio play policy caught', e);
    }

    // After stamp impact animation, transition out
    setTimeout(() => {
      setStep('unveiling');
      setTimeout(() => {
        onComplete();
      }, 1100);
    }, 1200);
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
        key="vietnamese-cinematic-prologue"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
        className="template-cinematic-vietnamese fixed inset-0 z-[100] bg-[#0A0405] text-[#F9F4EB] flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* Imperial Red & Gold Silk Texture Background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#1C0509] via-[#0D0204] to-[#080203] opacity-95"
        />

        {/* Slow Rotating Dong Son Drum Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="scale-125 sm:scale-150"
          >
            <DongSonDrumPattern className="w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] text-[#D4AF37]" opacity={0.35} />
          </motion.div>
        </div>

        {/* 35mm Film Grain Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(rgba(212,175,55,0.2) 1px, transparent 0)`,
            backgroundSize: '3px 3px',
          }}
        />

        {/* Traditional Widescreen Letterbox Bar - Top */}
        <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-[#080203]/95 z-30 border-b border-[#D4AF37]/25 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#D4AF37] font-serif">
            <Film className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span className="font-bold">ĐẠI HỶ HOÀNG TRIỀU</span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline text-neutral-400">PHIM ĐIỆN ẢNH CỔ PHONG</span>
            <span className="hidden md:inline text-neutral-600">•</span>
            <span className="hidden md:inline text-neutral-400">2.39:1 CINEMATIC</span>
          </div>

          <button
            onClick={handleSkip}
            className="text-[11px] sm:text-xs tracking-wider uppercase text-[#D4AF37]/80 hover:text-white transition-colors cursor-pointer px-3 py-1 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20"
          >
            Vào thẳng thiệp ➔
          </button>
        </div>

        {/* Traditional Widescreen Letterbox Bar - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-[#080203]/95 z-30 border-t border-[#D4AF37]/25 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 text-[10px] text-[#D4AF37]/70 font-mono tracking-widest uppercase">
            <span>SỬ KÝ THÀNH HÔN</span>
          </div>
          <p className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#F3E5AB]/75 text-center font-serif truncate mx-2">
            {groomName} 囍 {brideName} • TRĂM NĂM HẢO HỢP
          </p>
          <div className="text-[10px] text-[#D4AF37]/70 font-mono tracking-widest hidden sm:block">
            {weddingDateStr}
          </div>
        </div>

        {/* Central Content Container */}
        <div className="relative z-20 max-w-2xl mx-auto px-6 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8">
          {/* Imperial Double Happiness Insignia */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-full bg-[#BA1E28]/40 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#8C101A] to-[#45070C] border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.4)]">
              <SongHyGlyph className="w-10 h-10 sm:w-12 sm:h-12 text-[#F5E6A3]" glowing />
            </div>
          </motion.div>

          {/* Sequential Decree Lines (Chiếu Chỉ Duyên Phận) */}
          <div className="space-y-3 sm:space-y-4 min-h-[110px] flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.2 }}
              className="font-serif italic text-xs sm:text-sm tracking-[0.25em] text-[#D4AF37]/90 uppercase"
            >
              Khai Mở Chiếu Hỷ Hoàng Triều
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1.2 }}
              className="font-serif-title text-xl sm:text-3xl md:text-4xl text-[#FFF8EB] leading-relaxed tracking-wide font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            >
              "Vạn dặm hồng trần thiên lý tương ngộ
              <br />
              <span className="text-[#D4AF37]">Trăm năm kết tóc, bách niên lương duyên"</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.2 }}
              className="text-xs sm:text-sm text-[#E2D5BE] font-serif tracking-[0.2em] uppercase"
            >
              HỶ SỰ HOÀNG KIM: {groomName} 囍 {brideName}
            </motion.p>
          </div>

          {/* Decorative Clouds & Separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.6, duration: 1 }}
            className="flex items-center gap-3 text-[#D4AF37]/80 w-full max-w-sm justify-center"
          >
            <AuspiciousCloud className="w-10 h-5" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <LotusOrnament className="w-6 h-5 text-[#D4AF37]" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent" />
            <AuspiciousCloud className="w-10 h-5 scale-x-[-1]" />
          </motion.div>

          {/* BREAKTHROUGH INTERACTIVE ELEMENT: KHAI ẤN HOÀNG TRIỀU */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 1 }}
            className="pt-2 flex flex-col items-center space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleKhaiAn}
              disabled={stampActivated}
              className={`relative group px-8 sm:px-10 py-3.5 sm:py-4 rounded-full overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-2xl ${
                stampActivated
                  ? 'bg-[#BA1E28] border-[#FFD700] shadow-[0_0_60px_rgba(255,215,0,0.8)]'
                  : 'bg-gradient-to-r from-[#8C101A] via-[#BA1E28] to-[#8C101A] border-[#D4AF37] hover:border-[#FFF8EB] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]'
              }`}
            >
              {/* Gold Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={stampActivated ? { rotate: [0, 15, -15, 0], scale: [1, 1.3, 1] } : {}}
                  className="w-7 h-7 rounded-lg bg-[#590B11] border border-[#F3E5AB] flex items-center justify-center text-[#F3E5AB] shadow-md"
                >
                  <SongHyGlyph className="w-4 h-4 text-[#F3E5AB]" />
                </motion.div>
                <div className="text-left">
                  <span className="block font-serif font-bold text-xs sm:text-sm tracking-[0.25em] text-[#FFF8EB] uppercase">
                    {stampActivated ? 'ĐANG KHAI ẤN HỶ SỰ...' : 'KHAI ẤN HỶ SỰ • VÀO THIỆP'}
                  </span>
                  <span className="block text-[10px] text-[#F3E5AB]/80 tracking-wider font-sans">
                    Chạm để dập ngọc ấn & khởi chiếu phim
                  </span>
                </div>
              </div>
            </motion.button>

            <div className="flex items-center gap-2 text-[11px] text-[#D4AF37]/80 font-serif italic">
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
              <span>Khuyến nghị bật âm thanh để trải nghiệm trọn vẹn nhã khúc cung đình</span>
            </div>
          </motion.div>
        </div>

        {/* Stamping Flash Shockwave Animation */}
        {step === 'stamping' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.5, 2.5, 4] }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
          >
            <div className="w-96 h-96 rounded-full bg-gradient-to-r from-[#D4AF37]/50 via-[#BA1E28]/40 to-transparent blur-3xl" />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
