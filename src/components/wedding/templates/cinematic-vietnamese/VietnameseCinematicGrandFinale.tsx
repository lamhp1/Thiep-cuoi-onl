import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, ArrowUp, Share2, Film, Heart } from 'lucide-react';
import { WeddingData } from '../../../../types';
import { useToast } from '../../../ui/Toast';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperFrameCorner,
  DongSonDrumPattern,
} from '../../vietnamese-traditional/TraditionalOrnaments';

interface VietnameseCinematicGrandFinaleProps {
  data: WeddingData;
  onReplay: () => void;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
}

export function VietnameseCinematicGrandFinale({
  data,
  onReplay,
  onNavigateToAdmin,
  isOwnerMode,
}: VietnameseCinematicGrandFinaleProps) {
  const { showToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const goldGlow = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  const handleTriggerFireworks = () => {
    confetti({
      particleCount: 120,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#BA1E28', '#FFF8EB', '#FF9900'],
    });
    showToast('Pháo hoa hỷ sự rực rỡ bừng sáng chúc phúc cho đôi uyên ương!', 'success');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Thiệp Cưới Sử Thi: ${data.groomName || 'Minh Anh'} & ${data.brideName || 'Ngọc Mai'}`,
          text: `Kính mời quý quan khách thưởng thức thước phim hỷ sự và dự lễ thành hôn ngày 20/12/2026!`,
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

  const groomFullName = data.groom?.fullName || data.groomName || 'Nguyễn Minh Anh';
  const brideFullName = data.bride?.fullName || data.brideName || 'Trần Ngọc Mai';

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ===================================================================
          FINAL SCENE: FULL-SCREEN ROYAL HERITAGE PORTRAIT & BLESSING
         =================================================================== */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0405] text-[#FAF6EE] select-none p-6 sm:p-12">
        {/* Full Screen Photo */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="w-full h-full bg-center bg-cover filter brightness-[0.55] contrast-[1.15] scale-105"
            style={{ backgroundImage: `url(${data.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0405] via-[#1C0509]/60 to-[#0A0405]/80" />
        </div>

        {/* Center Rotating Drum Halo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
          >
            <DongSonDrumPattern className="w-[600px] h-[600px] text-[#D4AF37]" opacity={0.3} />
          </motion.div>
        </div>

        {/* Narrative Box */}
        <div className="relative z-20 max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#BA1E28] to-[#590B11] border-2 border-[#D4AF37] text-[#F3E5AB] mx-auto shadow-[0_0_40px_rgba(212,175,55,0.4)]"
          >
            <SongHyGlyph className="w-10 h-10 sm:w-12 sm:h-12 text-[#F3E5AB]" glowing />
          </motion.div>

          <div className="space-y-3">
            <span className="text-xs sm:text-sm font-serif uppercase tracking-[0.35em] text-[#D4AF37] block font-bold">
              KẾT MÀN SỬ THI HỶ SỰ
            </span>
            <h3 className="font-serif-title text-3xl sm:text-5xl md:text-6xl font-bold text-[#FFF8EB] tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              Bách Niên Giai Lão
              <br />
              <span className="text-[#D4AF37]">Vĩnh Kết Đồng Tâm</span>
            </h3>
            <p className="font-serif italic text-sm sm:text-base text-[#F3E5AB] max-w-xl mx-auto leading-relaxed">
              “Nắm tay nhau đi qua ngàn giông bão, trao trọn niềm tin cho đến ngày đầu bạc răng long. Xin thành kính tri ân song thân phụ mẫu và toàn thể quý quan khách.”
            </p>
          </div>

          {/* Interactive Fireworks Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTriggerFireworks}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BA1E28] via-[#D4AF37] to-[#BA1E28] text-black font-serif font-bold text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer inline-flex items-center gap-2 hover:shadow-[0_0_50px_rgba(255,190,0,0.8)] transition-all"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Bắn Pháo Hoa Chúc Phúc Hỷ Sự</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ===================================================================
          TRADITIONAL PRODUCTION CREDITS & FOOTER ROLL
         =================================================================== */}
      <footer className="relative bg-[#050203] text-[#FAF6EE] border-t border-[#D4AF37]/30 py-16 px-6 sm:px-12 select-none">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Credits Title */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 text-xs font-serif uppercase tracking-[0.3em] text-[#D4AF37]">
              <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>BẢNG DANH DANH HỶ SỰ • PRODUCTION CREDITS</span>
            </div>
            <h4 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFF8EB]">
              {groomFullName} 囍 {brideFullName}
            </h4>
            <p className="text-xs text-[#E2D5BE]/70 font-serif">
              Đại Lễ Thành Hôn & Vu Quy • 20 Tháng 12 Năm 2026
            </p>
          </div>

          {/* Credits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-serif pt-6 border-t border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block">
                CHỦ HÔN NHÀ TRAI
              </span>
              <p className="text-white font-semibold">{data.groom?.parents?.father || 'Nguyễn Văn Thành'}</p>
              <p className="text-white font-semibold">{data.groom?.parents?.mother || 'Lê Thị Hương'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block">
                CHỦ HÔN NHÀ GÁI
              </span>
              <p className="text-white font-semibold">{data.bride?.parents?.father || 'Trần Quốc Dũng'}</p>
              <p className="text-white font-semibold">{data.bride?.parents?.mother || 'Hoàng Kim Oanh'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block">
                NHÃ NHẠC CUNG ĐÌNH
              </span>
              <p className="text-white font-semibold">Cầm Sắt Hòa Minh</p>
              <p className="text-white font-semibold">Acoustic Hoàng Triều</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block">
                KHÁCH QUÝ CHỨNG GIÁM
              </span>
              <p className="text-white font-semibold">Toàn Thể Quan Khách</p>
              <p className="text-white font-semibold">Bằng Hữu Gần Xa</p>
            </div>
          </div>

          {/* Action Buttons: Replay & Share */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8 border-t border-[#D4AF37]/20">
            <button
              onClick={onReplay}
              className="px-6 py-2.5 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/50 text-[#F5E6A3] text-xs font-serif uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Khởi Chiếu Lại Từ Đầu</span>
            </button>

            <button
              onClick={handleShare}
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-serif uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Lan Tỏa Hỷ Sự (Chia Sẻ)</span>
            </button>

            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-5 py-2.5 rounded-full bg-[#BA1E28]/40 hover:bg-[#BA1E28]/70 border border-[#BA1E28] text-white text-xs font-serif uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Về Quản Trị</span>
              </button>
            )}
          </div>

          <div className="text-center text-[10px] text-neutral-500 font-serif tracking-widest">
            SỬ THI HỶ SỰ HOÀNG GIA • THIẾT KẾ ĐỘC QUYỀN BỞI L'AMOUR WEDDING
          </div>
        </div>
      </footer>
    </div>
  );
}
