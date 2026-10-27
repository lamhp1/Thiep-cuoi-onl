import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import { weddingAudio } from '../../../lib/audioSynth';
import { SongHyIcon, LotusIcon, TraditionalCorner } from './VietnameseOrnaments';
import { CoupleNamesStacked } from '../common/CoupleNamesStacked';
import { PersonalizedWaxSealBadge } from '../common/PersonalizedWaxSealBadge';

interface VietnameseEnvelopeProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  musicUrl?: string;
  onOpen: () => void;
}

export function VietnameseEnvelope({
  groomName,
  brideName,
  weddingDate,
  musicUrl,
  onOpen,
}: VietnameseEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);

    try {
      // Tung hoa giấy đỏ son và vàng hoàng gia
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#9E1B32', '#C8A45D', '#E5D1A1', '#7F1734', '#FFFFFF'],
      });
    } catch {}

    // Bật nhạc cưới truyền thống / acoustic
    weddingAudio.play(musicUrl);

    setTimeout(() => {
      setIsOpen(true);
      onOpen();
    }, 1100);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      {!isOpen && (
        <div
          id="vietnamese-envelope-curtain"
          className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-[#5A4031]/60 backdrop-blur-sm"
        >
          {/* Cửa lụa đỏ son bên trái */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpening ? { x: '-100%' } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#7F1734] to-[#9E1B32] border-r-2 border-[#C8A45D]/60 shadow-2xl z-20"
          >
            {/* Vân gấm chìm truyền thống */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E5D1A1_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
          </motion.div>

          {/* Cửa lụa đỏ son bên phải */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpening ? { x: '100%' } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7F1734] to-[#9E1B32] border-l-2 border-[#C8A45D]/60 shadow-2xl z-20"
          >
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E5D1A1_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
          </motion.div>

          {/* Thiệp Hỷ Trung Tâm */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={isOpening ? { opacity: 0, scale: 1.06, y: -30 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="relative z-30 max-w-md w-[92%] sm:w-[440px] mx-auto p-7 sm:p-9 rounded-3xl bg-[#FFFDF8] text-[#5A4031] shadow-2xl border-2 border-[#C8A45D] text-center"
            style={{
              boxShadow: '0 25px 60px -15px rgba(127, 23, 52, 0.4), 0 0 0 1px rgba(200, 164, 93, 0.3)',
            }}
          >
            {/* 4 Góc Hoa Văn Cung Đình */}
            <TraditionalCorner position="top-left" className="absolute top-3 left-3 w-8 h-8 text-[#C8A45D]/80" />
            <TraditionalCorner position="top-right" className="absolute top-3 right-3 w-8 h-8 text-[#C8A45D]/80" />
            <TraditionalCorner position="bottom-left" className="absolute bottom-3 left-3 w-8 h-8 text-[#C8A45D]/80" />
            <TraditionalCorner position="bottom-right" className="absolute bottom-3 right-3 w-8 h-8 text-[#C8A45D]/80" />

            {/* Khung chỉ vàng kép */}
            <div className="absolute inset-2 sm:inset-3 border border-[#C8A45D]/40 rounded-2xl pointer-events-none" />

            {/* Biểu tượng Song Hỷ (Seal Sáp Đỏ Viền Vàng) */}
            <div className="relative mx-auto mb-3 w-18 h-18 rounded-full bg-gradient-to-tr from-[#7F1734] to-[#9E1B32] text-[#E5D1A1] shadow-lg flex items-center justify-center border-2 border-[#C8A45D]">
              <SongHyIcon className="w-10 h-10 text-[#E5D1A1]" />
              <div className="absolute -bottom-1 -right-1 p-1 bg-[#C8A45D] rounded-full text-[#7F1734] shadow">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Tiêu đề Thiệp */}
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-[#9E1B32] mb-1">
              Thiệp Cưới Truyền Thống
            </p>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-semibold text-[#7F1734] tracking-wider mb-2">
              TRÂN TRỌNG KÍNH MỜI
            </h3>

            {/* Họa tiết hoa sen nhỏ */}
            <div className="flex items-center justify-center gap-3 my-2 text-[#C8A45D]">
              <span className="h-px w-10 bg-[#C8A45D]/60" />
              <LotusIcon className="w-5 h-5 text-[#C8A45D]" />
              <span className="h-px w-10 bg-[#C8A45D]/60" />
            </div>

            {/* Tên Chú Rể & Cô Dâu */}
            <div className="my-4 py-3 bg-[#F7F1E5]/60 rounded-xl border border-[#C8A45D]/30 px-4 w-full">
              <p className="text-[10px] font-body text-[#9E1B32] uppercase tracking-widest font-semibold mb-2">
                Lễ Thành Hôn
              </p>
              <CoupleNamesStacked
                groomName={groomName}
                brideName={brideName}
                variant="envelope"
                textColor="#7F1734"
                heartColor="#C8A45D"
                idPrefix="envelope-curtain"
              />
            </div>

            {/* Ngày Cưới */}
            <p className="font-body text-xs font-semibold text-[#5A4031] tracking-wider mb-6">
              Ngày lành tháng tốt: <span className="text-[#9E1B32] font-bold">{weddingDate}</span>
            </p>

            {/* Nút Mở Thiệp Hỷ */}
            <button
              id="vietnamese-open-invitation-btn"
              onClick={handleOpen}
              disabled={isOpening}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-[#9E1B32] via-[#7F1734] to-[#9E1B32] text-[#FFFDF8] font-body text-sm font-bold tracking-widest uppercase shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-[#C8A45D]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Mở Thiệp Hỷ</span>
                <Heart className="w-4 h-4 fill-[#E5D1A1] text-[#E5D1A1] group-hover:scale-125 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
            </button>

            <p className="mt-4 text-[11px] text-[#5A4031]/70 font-body">
              Chạm để mở thiệp và lắng nghe giai điệu chúc phúc trăm năm
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
