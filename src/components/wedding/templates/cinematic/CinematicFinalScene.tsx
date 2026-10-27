import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, RotateCcw, ArrowUp, Share2, Film } from 'lucide-react';
import { WeddingData } from '../../../../types';
import { useToast } from '../../../ui/Toast';

interface CinematicFinalSceneProps {
  data: WeddingData;
  onReplay: () => void;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
}

export function CinematicFinalScene({
  data,
  onReplay,
  onNavigateToAdmin,
  isOwnerMode,
}: CinematicFinalSceneProps) {
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasFadedToWhite, setHasFadedToWhite] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Scroll driven fade-to-white effect
  const whiteOpacity = useTransform(scrollYProgress, [0.75, 0.98], [0, 1]);

  const handleTriggerWhiteFade = () => {
    setHasFadedToWhite(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FAF6EE', '#C5A880'],
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Thiệp Cưới Điện Ảnh: ${data.groom.name} & ${data.bride.name}`,
          text: `Cùng đón xem thước phim tình yêu và chung vui ngày cưới 20/12/2026!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Đã sao chép liên kết thiệp cưới!', 'success');
      }
    } catch {
      // ignore
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ===================================================================
          FINAL SCENE (CUỐI TRANG: ẢNH TOÀN MÀN HÌNH + TEXT)
         =================================================================== */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-[#FAF6EE] select-none p-6 sm:p-12">
        {/* Full Screen Photo */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="w-full h-full bg-center bg-cover filter brightness-[0.65] contrast-[1.15] scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url(${
                data.coverImage ||
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85'
              })`,
            }}
          />
          {/* Deep cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90" />
        </div>

        {/* Cinematic Film Frame Bar */}
        <div className="absolute top-6 inset-x-6 sm:inset-x-12 z-20 flex items-center justify-between border-b border-white/10 pb-3 text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400">
          <span className="flex items-center gap-2">
            <Film className="w-3.5 h-3.5 text-[#E6C687]" />
            FINAL SCENE • EPILOGUE
          </span>
          <span>THE END</span>
        </div>

        {/* Center Typography Reveal:
            AND THEY LIVED
            HAPPILY EVER AFTER.
            Sau đó:
            20 • 12 • 2026
        */}
        <div className="relative z-30 max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/60 border border-[#E6C687]/40 mb-6"
          >
            <Sparkles className="w-3 h-3 text-[#E6C687]" />
            <span className="font-mono text-xs tracking-[0.35em] text-[#E6C687] uppercase">
              ETERNAL LOVE
            </span>
          </motion.div>

          <div className="space-y-3 font-serif-title uppercase">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.2 }}
              className="text-3xl sm:text-5xl md:text-7xl font-light tracking-[0.25em] text-neutral-200"
            >
              AND THEY LIVED
            </motion.h2>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.6 }}
              className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.28em] text-[#E6C687] drop-shadow-[0_4px_30px_rgba(230,198,135,0.5)]"
            >
              HAPPILY EVER AFTER.
            </motion.h2>
          </div>

          {/* Sau đó: 20 • 12 • 2026 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="mt-8 pt-6 border-t border-white/20 w-full max-w-md flex flex-col items-center"
          >
            <p className="font-serif-title text-2xl sm:text-3xl md:text-4xl tracking-[0.4em] font-light text-white">
              20 • 12 • 2026
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.3em] uppercase text-[#E6C687]">
              {data.groom.fullName.toUpperCase()} &amp; {data.bride.fullName.toUpperCase()}
            </p>
          </motion.div>

          {/* Prompt to trigger Fade to White */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 1.8 }}
            className="mt-12 flex flex-col items-center gap-3"
          >
            <button
              onClick={handleTriggerWhiteFade}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/30 text-xs font-mono tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
            >
              FADE TO WHITE ➔
            </button>
            <span className="text-[10px] font-mono text-neutral-400 tracking-widest">
              (Hoặc tiếp tục cuộn trang để kết thúc thước phim)
            </span>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          FADE TO WHITE SCREEN (MÀN KẾT TRẮNG TINH KHIẾT)
         =================================================================== */}
      <div
        className={`relative min-h-[90vh] w-full bg-[#FCFAF7] text-[#1A1816] flex flex-col items-center justify-center px-6 py-20 text-center transition-all duration-1000 ${
          hasFadedToWhite ? 'opacity-100 scale-100' : ''
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E6C687]/20 border border-[#E6C687] text-[#8C7335] flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-8 h-8 fill-current text-[#B38F26]" />
          </div>

          <h3 className="font-serif-title text-3xl sm:text-5xl font-bold tracking-wider text-[#1A1816]">
            Chân Thành Cảm Ơn
          </h3>

          <p className="text-sm sm:text-base text-[#5A524A] leading-relaxed font-light">
            Cảm ơn quý người thân và bạn bè đã dõi theo và trở thành một phần tươi đẹp nhất trong thước phim cuộc đời của {data.groom.name} & {data.bride.name}.
            <br />
            Hẹn gặp lại quý khách trong ngày hạnh phúc 20/12/2026 tại Thành phố Huế!
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onReplay}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1816] text-[#FAF6EE] hover:bg-black font-semibold text-xs tracking-widest uppercase transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xem lại từ đầu</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#D4AF37]/50 text-[#8C7335] hover:bg-[#FAF6EE] font-semibold text-xs tracking-widest uppercase transition-all cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ thiệp</span>
            </button>

            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] text-white hover:bg-[#B38F26] font-semibold text-xs tracking-widest uppercase transition-all cursor-pointer shadow-md"
              >
                <span>Chỉnh sửa thiệp</span>
              </button>
            )}
          </div>

          <p className="text-[11px] font-mono text-[#8C7335] tracking-widest uppercase pt-6">
            L'AMOUR WEDDING STUDIO • CINEMATIC EDITION 2026
          </p>
        </div>
      </div>
    </div>
  );
}
