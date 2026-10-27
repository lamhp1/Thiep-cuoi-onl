import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Film, Sparkles, Volume2, VolumeX, Calendar, MapPin } from 'lucide-react';
import { WeddingData } from '../../../../types';
import { SongHyGlyph, LotusOrnament, AuspiciousCloud, DongSonDrumPattern } from '../../vietnamese-traditional/TraditionalOrnaments';

interface VietnameseCinematicHeroProps {
  data: WeddingData;
  onScrollToStory?: () => void;
  isPlaying: boolean;
  onToggleSound: () => void;
}

export function VietnameseCinematicHero({
  data,
  onScrollToStory,
  isPlaying,
  onToggleSound,
}: VietnameseCinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven transforms
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.25]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.85, 0.35]);

  // Typography motion: symmetrical expansion
  const groomX = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const brideX = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const sealScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.25, 0.8]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.7, 0]);

  // Top letterbox collapse on scroll
  const letterboxH = useTransform(scrollYProgress, [0, 0.35], ['3.5rem', '0rem']);

  const groomFullName = data.groom?.fullName || data.groomName || 'Nguyễn Minh Anh';
  const brideFullName = data.bride?.fullName || data.brideName || 'Trần Ngọc Mai';
  const weddingDateStr = data.weddingDate || '20/12/2026';

  return (
    <div
      ref={containerRef}
      className="relative h-screen min-h-[720px] w-full overflow-hidden bg-[#0A0405] text-[#FAF6EE] select-none flex items-center justify-center"
    >
      {/* Background Image with Cinematic Parallax & Slow Zoom */}
      <motion.div
        style={{
          scale: imageScale,
          y: imageY,
          opacity: imageOpacity,
        }}
        className="absolute inset-0 w-full h-full transform-gpu"
      >
        <div
          className="w-full h-full bg-center bg-cover filter brightness-[0.68] contrast-[1.12] saturate-[1.08]"
          style={{ backgroundImage: `url(${data.coverImage})` }}
        />
        {/* Heritage Vignette and Warm Imperial Lighting Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0405] via-black/40 to-[#0A0405]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C0509]/60 via-transparent to-[#1C0509]/60" />
      </motion.div>

      {/* Rotating Bronze Drum Aura in Center Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-25">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
        >
          <DongSonDrumPattern className="w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] text-[#D4AF37]" opacity={0.3} />
        </motion.div>
      </div>

      {/* 35mm Film Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-10"
        style={{
          backgroundImage: `radial-gradient(rgba(212,175,55,0.2) 1px, transparent 0)`,
          backgroundSize: '4px 4px',
        }}
      />

      {/* Top Letterbox Cinema Bar with Traditional Film Slate */}
      <motion.div
        style={{ height: letterboxH }}
        className="absolute top-0 left-0 right-0 z-30 bg-[#080203]/90 backdrop-blur-md border-b border-[#D4AF37]/20 flex items-center justify-between px-6 sm:px-10 overflow-hidden"
      >
        <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] font-serif uppercase text-[#D4AF37]">
          <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-bold">ĐẠI HỶ HOÀNG GIA</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[#FAF6EE]/70">THƯỚC PHIM HỶ SỰ</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline text-[#FAF6EE]/70">2.39:1 CINEMATIC REEL</span>
        </div>

        <button
          onClick={onToggleSound}
          className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-[#D4AF37] hover:text-white px-3 py-1 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>Nhã Khúc: Đang Phát</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              <span>Bật Âm Thanh</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Hero Center Title Typography */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center"
      >
        {/* Imperial Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#3D0A11]/80 backdrop-blur-md border border-[#D4AF37]/50 mb-5 sm:mb-6 shadow-lg"
        >
          <AuspiciousCloud className="w-4 h-3 text-[#D4AF37]" />
          <span className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-[#F5E6A3] font-bold">
            TRĂM NĂM HOÀNG ĐẠO • THIÊN DUYÊN TIỀN ĐỊNH
          </span>
          <AuspiciousCloud className="w-4 h-3 text-[#D4AF37] scale-x-[-1]" />
        </motion.div>

        {/* Grand Double Happiness Royal Seal */}
        <motion.div
          style={{ scale: sealScale }}
          className="relative mb-4 sm:mb-6"
        >
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#BA1E28] to-[#6A0C13] border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            <SongHyGlyph className="w-8 h-8 sm:w-10 sm:h-10 text-[#F5E6A3]" glowing />
          </div>
        </motion.div>

        {/* Symmetrical Couple Names with Scroll Displacement */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8 my-2 sm:my-3">
          {/* Groom Full Name */}
          <motion.div
            style={{ x: groomX }}
            className="text-center md:text-right"
          >
            <span className="block text-[10px] sm:text-xs font-serif tracking-[0.3em] uppercase text-[#D4AF37]/90 mb-0.5">
              CHÚ RỂ (TÂN LANG)
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-[#FFF9F0] drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
              {groomFullName}
            </h1>
          </motion.div>

          {/* Center Royal Separator */}
          <div className="flex items-center gap-2 text-[#D4AF37] my-1 md:my-0">
            <LotusOrnament className="w-6 h-5 text-[#D4AF37]" />
            <span className="font-serif text-lg sm:text-2xl text-[#D4AF37] font-bold">&</span>
            <LotusOrnament className="w-6 h-5 text-[#D4AF37] scale-x-[-1]" />
          </div>

          {/* Bride Full Name */}
          <motion.div
            style={{ x: brideX }}
            className="text-center md:text-left"
          >
            <span className="block text-[10px] sm:text-xs font-serif tracking-[0.3em] uppercase text-[#D4AF37]/90 mb-0.5">
              CÔ DÂU (TÂN NƯƠNG)
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-[#FFF9F0] drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
              {brideFullName}
            </h1>
          </motion.div>
        </div>

        {/* Traditional Royal Couplets (Câu Đối Hoàng Triều) */}
        <div className="max-w-2xl mx-auto my-4 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xs border border-[#D4AF37]/25">
          <p className="font-serif italic text-xs sm:text-sm text-[#F3E5AB] tracking-wide leading-relaxed">
            "Loan phụng hòa minh bách niên hảo hợp
            <br className="hidden sm:inline" />
            <span className="mx-2 hidden sm:inline">•</span>
            Sơn hà chứng giám vạn kiếp phu thê"
          </p>
        </div>

        {/* Wedding Date & Royal City Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-serif tracking-widest text-[#E6C687] uppercase mt-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>NGÀY HOÀNG ĐẠO: {weddingDateStr}</span>
          </div>
          <span className="text-[#D4AF37]/40 hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>{data.city || 'CỐ ĐÔ HUẾ'}</span>
          </div>
        </div>

        {/* Scroll CTA: Khởi Chiếu Thước Phim */}
        <motion.button
          onClick={onScrollToStory}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 sm:mt-10 inline-flex flex-col items-center gap-2 group cursor-pointer"
        >
          <span className="text-[11px] font-serif uppercase tracking-[0.3em] text-[#D4AF37] group-hover:text-white transition-colors">
            Khởi Chiếu Thước Phim Sử Ký
          </span>
          <div className="w-9 h-9 rounded-full bg-[#BA1E28]/60 border border-[#D4AF37]/60 flex items-center justify-center text-[#F5E6A3] group-hover:bg-[#BA1E28] transition-colors shadow-lg animate-bounce">
            <ChevronDown className="w-4 h-4" />
          </div>
        </motion.button>
      </motion.div>

      {/* Decorative Frame Corners */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 pointer-events-none z-20 text-[#D4AF37]/40">
        <AuspiciousCloud className="w-8 h-4 sm:w-12 sm:h-6" />
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none z-20 text-[#D4AF37]/40">
        <AuspiciousCloud className="w-8 h-4 sm:w-12 sm:h-6 scale-x-[-1]" />
      </div>
    </div>
  );
}
