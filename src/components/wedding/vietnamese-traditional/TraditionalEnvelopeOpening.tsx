import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SongHyGlyph, AuspiciousCloud, DongSonDrumPattern } from './TraditionalOrnaments';
import { Sparkles, Music } from 'lucide-react';
import { weddingAudio } from '../../../lib/audioSynth';
import { CoupleNamesStacked } from '../common/CoupleNamesStacked';
import { PersonalizedWaxSealBadge } from '../common/PersonalizedWaxSealBadge';

interface TraditionalEnvelopeOpeningProps {
  groomName: string;
  brideName: string;
  musicUrl?: string;
  onOpen: () => void;
}

export function TraditionalEnvelopeOpening({
  groomName,
  brideName,
  musicUrl,
  onOpen,
}: TraditionalEnvelopeOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isGlow, setIsGlow] = useState(false);

  // Derive beautiful display names: e.g. "Nguyễn Minh Anh" -> "MINH ANH", "Ngọc Mai" -> "NGỌC MAI"
  const coupleDisplayNames = React.useMemo(() => {
    const formatName = (full: string, fallback: string) => {
      if (!full || !full.trim()) return fallback;
      const parts = full.trim().split(' ').filter(Boolean);
      if (parts.length > 2) {
        return parts.slice(-2).join(' ').toUpperCase();
      }
      return full.trim().toUpperCase();
    };
    const g = formatName(groomName, 'CHÚ RỂ');
    const b = formatName(brideName, 'CÔ DÂU');
    return `${g} & ${b}`;
  }, [groomName, brideName]);

  const handleOpenInvitation = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Play ambient background audio
    try {
      weddingAudio.play(musicUrl);
    } catch {
      // ignore audio autoplay restriction
    }

    // 2. Chữ Hỷ phát sáng nhẹ sau khi nắp mở và thiệp trượt lên
    setTimeout(() => {
      setIsGlow(true);
    }, 450);

    // 3. Sau khoảng 1.6s - 1.8s, trang chính fade in
    setTimeout(() => {
      onOpen();
    }, 1750);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B050B]/95 backdrop-blur-md px-4 overflow-hidden"
      >
        {/* Background Paper Texture & Dong Son Watermark */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#D4AF37 0.8px, transparent 0.8px), radial-gradient(#BA1E28 0.5px, #2B050B 0.5px)`,
            backgroundSize: '30px 30px, 60px 60px',
          }}
        />
        <div className="absolute -top-32 -right-32 pointer-events-none opacity-10">
          <DongSonDrumPattern className="w-[520px] h-[520px] text-[#D4AF37]" opacity={1} />
        </div>
        <div className="absolute -bottom-32 -left-32 pointer-events-none opacity-10">
          <DongSonDrumPattern className="w-[520px] h-[520px] text-[#D4AF37]" opacity={1} />
        </div>

        {/* Outer Envelope Wrapper */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-[390px] sm:max-w-[420px] aspect-[4/5] perspective-1000 select-none"
        >
          {/* 1. Tấm thiệp bên trong (Inner Card - Kem giấy) */}
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={
              isOpening
                ? { y: -140, opacity: 1, scale: 1.02 }
                : { y: 0, opacity: 0 }
            }
            transition={{ duration: 0.85, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-4 top-4 bottom-8 rounded-2xl bg-[#FAF6EE] text-[#5A121A] p-6 shadow-2xl border border-[#D4AF37]/60 flex flex-col items-center justify-center text-center z-10"
            style={{
              backgroundImage: 'linear-gradient(180deg, #FFFDF9 0%, #FAF5EA 100%)',
            }}
          >
            {/* Viền đôi giấy mỹ thuật */}
            <div className="absolute inset-2 border border-[#D4AF37]/30 rounded-xl pointer-events-none" />

            {/* Chữ Hỷ phát sáng nhẹ khi thiệp trượt lên */}
            <div className="relative mb-3">
              {isGlow && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1.2], opacity: [0.3, 0.9, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute inset-0 rounded-full bg-[#FFD700]/40 blur-xl pointer-events-none"
                />
              )}
              <SongHyGlyph
                className={`w-12 h-12 transition-all duration-700 ${
                  isGlow
                    ? 'text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.9)] scale-110'
                    : 'text-[#BA1E28]'
                }`}
                glowing={isGlow}
              />
            </div>

            <div className="space-y-1 w-full max-w-[260px] px-2">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C6B38] font-medium font-body block mb-1">
                Hỷ Sự Viên Mãn
              </span>
              <CoupleNamesStacked
                groomName={groomName}
                brideName={brideName}
                variant="envelope-sm"
                textColor="#8B1119"
                heartColor="#D4AF37"
                idPrefix="trad-envelope-card"
              />
            </div>

            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-3" />

            <p className="text-xs text-[#6B5A52] font-body max-w-[240px] leading-relaxed">
              Trân trọng kính mời quý khách đến chung vui ngày hạnh phúc lứa đôi.
            </p>

            {/* Floating Sparkle Icon */}
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-[#D4AF37] font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Đang mở thiệp mừng...</span>
            </div>
          </motion.div>

          {/* 2. Thân phong bì đỏ son chính giữa */}
          <div
            className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#BA1E28] via-[#A01620] to-[#7F0E17] text-[#FAF6EE] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-2 border-[#D4AF37]/50 overflow-hidden z-20 flex flex-col justify-between p-6 sm:p-7"
            style={{
              boxShadow: '0 20px 50px rgba(139, 17, 25, 0.45), inset 0 0 30px rgba(0,0,0,0.35)',
            }}
          >
            {/* Viền hoa văn chỉ vàng kim thanh nhã */}
            <div className="absolute inset-3 border border-[#D4AF37]/40 rounded-xl pointer-events-none" />
            <div className="absolute inset-4 border border-[#D4AF37]/20 rounded-lg pointer-events-none" />

            {/* Hoa văn Đông Sơn chìm trên thân phong bì */}
            <div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none">
              <DongSonDrumPattern className="w-64 h-64 text-[#FFD700]" opacity={1} />
            </div>
            <div className="absolute -left-16 -top-16 opacity-10 pointer-events-none">
              <DongSonDrumPattern className="w-64 h-64 text-[#FFD700]" opacity={1} />
            </div>

            {/* Nắp phong bì phía trên (Animated Top Flap) */}
            <motion.div
              initial={false}
              animate={
                isOpening
                  ? { rotateX: -160, zIndex: 5 }
                  : { rotateX: 0, zIndex: 30 }
              }
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
              className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#8F111B] to-[#A61C24] border-b-2 border-[#D4AF37]/60 pointer-events-none shadow-md"
            >
              {/* Nắp hình tam giác lượn nhẹ viền vàng */}
              <div className="w-full h-full flex items-center justify-center">
                <AuspiciousCloud className="w-16 h-8 text-[#D4AF37]/60" />
              </div>
            </motion.div>

            {/* Nội dung Phong bì theo đúng yêu cầu đề bài:
              ┌────────────────────┐
              │                    │
              │        囍           │
              │                    │
              │   TRÂN TRỌNG       │
              │     KÍNH MỜI       │
              │                    │
              │     ANH & MAI      │
              │                    │
              │     [MỞ THIỆP]     │
              │                    │
              └────────────────────┘
            */}
            <div className="relative z-25 flex flex-col items-center justify-center text-center my-auto space-y-6 pt-10">
              {/* 1. Chữ Hỷ 囍 */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#FAF5EA] to-[#E8DCBF] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg mx-auto">
                  <SongHyGlyph className="w-12 h-12 text-[#BA1E28]" glowing={false} />
                </div>
              </div>

              {/* 2. TRÂN TRỌNG KÍNH MỜI */}
              <div className="space-y-1 mb-2">
                <p className="font-body text-xs sm:text-sm font-semibold tracking-[0.35em] text-[#F3E2BB] uppercase">
                  TRÂN TRỌNG
                </p>
                <p className="font-body text-xs sm:text-sm font-semibold tracking-[0.35em] text-[#F3E2BB] uppercase">
                  KÍNH MỜI
                </p>
              </div>

              {/* 3. Couple Display Names */}
              <div className="py-1 w-full max-w-full px-4">
                <CoupleNamesStacked
                  groomName={groomName}
                  brideName={brideName}
                  variant="envelope"
                  textColor="#FFFDF8"
                  heartColor="#FFD700"
                  groomClassName="drop-shadow-md"
                  brideClassName="drop-shadow-md"
                  idPrefix="trad-envelope-front"
                />
                <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2 opacity-80" />
              </div>

              {/* 4. [MỞ THIỆP] Button */}
              <div className="pt-2 w-full max-w-[200px]">
                <button
                  onClick={handleOpenInvitation}
                  disabled={isOpening}
                  className="w-full relative group overflow-hidden px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F2D786] to-[#D4AF37] text-[#5A121A] font-serif-title font-bold text-base tracking-widest uppercase shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.6)] active:scale-95 transition-all cursor-pointer border border-[#FFF8E7]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>MỞ THIỆP</span>
                  </span>
                  {/* Shimmer light bar across button */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </button>
              </div>
            </div>

            {/* Bottom Auspicious Clouds Accent */}
            <div className="relative z-25 flex items-center justify-between text-[#D4AF37]/50 text-xs px-2 pt-2">
              <AuspiciousCloud className="w-12 h-6 text-[#D4AF37]/60" />
              <span className="font-body text-[10px] tracking-widest uppercase text-[#F3E2BB]/70">
                Hỷ Sự Như Ý
              </span>
              <AuspiciousCloud className="w-12 h-6 text-[#D4AF37]/60 scale-x-[-1]" />
            </div>
          </div>
        </motion.div>

        {/* Subtle Hint */}
        <p className="absolute bottom-4 text-center text-[#F3E2BB]/60 text-xs font-body tracking-wider">
          Chạm vào phong bì hoặc bấm [MỞ THIỆP] để xem thiệp mừng
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
