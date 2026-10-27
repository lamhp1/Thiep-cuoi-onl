import React from 'react';
import { motion } from 'motion/react';
import { SongHyGlyph, AuspiciousCloud, DongSonDrumPattern } from './TraditionalOrnaments';
import { ChevronDown, Calendar, Sparkles } from 'lucide-react';
import { CoupleNamesStacked } from '../common/CoupleNamesStacked';

interface TraditionalHeroSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  coverImage: string;
  romanticQuote?: string;
}

export function TraditionalHeroSection({
  groomName,
  brideName,
  weddingDate,
  coverImage,
  romanticQuote,
}: TraditionalHeroSectionProps) {
  // Format date: e.g. "2026-12-20" -> "20 • 12 • 2026"
  const formattedDate = React.useMemo(() => {
    if (!weddingDate) return '20 • 12 • 2026';
    if (weddingDate.includes('-')) {
      const parts = weddingDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]} • ${parts[1]} • ${parts[0]}`;
      }
    }
    if (weddingDate.includes('/')) {
      const parts = weddingDate.split('/');
      if (parts.length === 3) {
        return `${parts[0]} • ${parts[1]} • ${parts[2]}`;
      }
    }
    return '20 • 12 • 2026';
  }, [weddingDate]);

  // Clean uppercase names: e.g. "Nguyễn Văn A" -> "NGUYỄN VĂN A"
  const displayNameGroom = React.useMemo(() => {
    if (!groomName) return 'CHÚ RỂ';
    return groomName.trim().toUpperCase();
  }, [groomName]);

  const displayNameBride = React.useMemo(() => {
    if (!brideName) return 'CÔ DÂU';
    return brideName.trim().toUpperCase();
  }, [brideName]);

  const heroPhoto =
    coverImage ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85';

  return (
    <section className="relative w-full min-h-[75vh] md:min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#240408]">
      {/* Background Wedding Photo (Ảnh cưới chiếm 70–90% màn hình) */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroPhoto}
          alt="Ảnh cưới cô dâu chú rể"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Overlay màu burgundy rất nhẹ theo đúng yêu cầu đề bài */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#36050C]/90 via-[#480812]/30 to-[#2A0409]/45 mix-blend-multiply"
          aria-hidden="true"
        />
        {/* Soft radial glow in center for typography readability */}
        <div
          className="absolute inset-0 bg-radial from-transparent via-[#200307]/20 to-[#1C0206]/80"
          aria-hidden="true"
        />
      </div>

      {/* Decorative Dong Son Bronze Pattern Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5 pointer-events-none opacity-10">
        <DongSonDrumPattern className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] text-[#F3E2BB]" opacity={1} />
      </div>

      {/* Hero Typography & Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white py-16 sm:py-20 flex flex-col items-center justify-center space-y-6 sm:space-y-8">
        {/* Top Ornament: Chữ Hỷ và Mây Cát Tường */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center justify-center gap-3 text-[#E8CCA0]"
        >
          <AuspiciousCloud className="w-10 sm:w-14 h-6 sm:h-8 text-[#D4AF37]/80" />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#8B1119]/80 border border-[#D4AF37] flex items-center justify-center shadow-lg backdrop-blur-xs">
            <SongHyGlyph className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFD700]" />
          </div>
          <AuspiciousCloud className="w-10 sm:w-14 h-6 sm:h-8 text-[#D4AF37]/80 scale-x-[-1]" />
        </motion.div>

        {/* Couple Names (Theo đúng mẫu đề bài: 3 hàng Tên Chú Rể / Hình Trái Tim / Tên Cô Dâu):
            TRƯỜNG AN
            (hình trái tim)
            NGỌC MAI
        */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          className="w-full max-w-2xl mx-auto px-2"
        >
          <CoupleNamesStacked
            groomName={displayNameGroom}
            brideName={displayNameBride}
            variant="hero-xl"
            textColor="#FFFDF8"
            heartColor="#FFD700"
            groomClassName="drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
            brideClassName="drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
            idPrefix="trad-hero"
          />
        </motion.div>

        {/* Underneath:
            TRÂN TRỌNG BÁO HỶ
            20 • 12 • 2026
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-2 pt-2"
        >
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#5A0C14]/75 border border-[#D4AF37]/60 backdrop-blur-md shadow-lg">
            <p className="font-body text-xs sm:text-sm font-semibold tracking-[0.35em] text-[#F3E2BB] uppercase">
              TRÂN TRỌNG BÁO HỶ
            </p>
          </div>

          <div className="pt-1">
            <p className="font-serif-title text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.25em] text-[#FFECB3] drop-shadow-md">
              {formattedDate}
            </p>
          </div>

          {romanticQuote && (
            <p className="font-serif-title italic text-sm sm:text-base text-[#F5E7D3]/85 max-w-xl mx-auto pt-2 line-clamp-2">
              {romanticQuote}
            </p>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="pt-6"
        >
          <a
            href="#story"
            className="inline-flex flex-col items-center gap-1.5 text-xs text-[#E8CCA0]/80 hover:text-[#FFD700] transition-colors cursor-pointer group"
          >
            <span className="font-body text-[11px] uppercase tracking-[0.2em]">Cuộn xem thiệp</span>
            <ChevronDown className="w-5 h-5 animate-bounce text-[#D4AF37]" />
          </a>
        </motion.div>
      </div>

      {/* Subtle Frame Corners at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#FAF6EE] to-transparent z-15 pointer-events-none" />
    </section>
  );
}
