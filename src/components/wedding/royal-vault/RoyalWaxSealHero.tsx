import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, ChevronDown, Heart } from 'lucide-react';
import { playVaultUnlockSound, playRingRotateSparkle } from './royalVaultSounds';

interface RoyalWaxSealHeroProps {
  guestName: string;
  groomName: string;
  brideName: string;
}

export function RoyalWaxSealHero({ guestName, groomName, brideName }: RoyalWaxSealHeroProps) {
  const [isBroken, setIsBroken] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCrackSeal = () => {
    if (!isBroken) {
      setIsBroken(true);
      playVaultUnlockSound();
      playRingRotateSparkle();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.35 },
        colors: ['#E8B498', '#FCE4BE', '#DDA789', '#FFFFFF'],
      });
    } else {
      setIsBroken(false);
    }
  };

  const groomInitial = (groomName || 'M').charAt(0).toUpperCase();
  const brideInitial = (brideName || 'N').charAt(0).toUpperCase();

  return (
    <div className="relative z-20 max-w-3xl mx-auto px-4 pt-4 sm:pt-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl bg-gradient-to-r from-[#18121D]/95 via-[#231728]/95 to-[#18121D]/95 border border-[#E8B498]/40 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl p-5 sm:p-7 overflow-hidden group"
      >
        {/* Dynamic Holographic Border Beam */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E8B498]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          {/* Left: 3D Wax Seal Monogram */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCrackSeal}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(232,180,152,0.5)] focus:outline-none"
              title="Chạm để mở con dấu sáp hoàng gia"
            >
              {/* Wax Seal Outer scalloped border */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-[#FAF6EE]/40 transition-transform duration-500 ${
                  isHovered ? 'rotate-45' : ''
                } ${
                  isBroken
                    ? 'bg-gradient-to-br from-[#8A253A] to-[#450C18]'
                    : 'bg-gradient-to-br from-[#C7886D] via-[#E8B498] to-[#9E5F48]'
                }`}
              />

              {/* Inner ring & Monogram */}
              <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/40 flex flex-col items-center justify-center text-[#1E0F16] font-serif font-bold text-xs shadow-inner">
                <span className="text-[10px] tracking-tighter leading-none">{groomInitial}&{brideInitial}</span>
                <span className="text-[8px] tracking-widest text-[#1E0F16]/80 uppercase">ROYAL</span>
              </div>

              {/* Small crack glow if broken */}
              {isBroken && (
                <div className="absolute inset-0 rounded-full border border-amber-300 animate-ping opacity-30" />
              )}
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-widest text-[#E8B498] font-serif font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>THIỆP MỜI DANH DỰ HOÀNG GIA</span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white mt-0.5 leading-snug">
                Kính gửi: <span className="text-[#FCE4BE] drop-shadow-[0_0_12px_rgba(232,180,152,0.5)]">{guestName || 'Quý Khách Quý & Người Thương'}</span>
              </h3>
              <p className="text-[11px] text-white/60 font-light mt-0.5">
                {isBroken ? 'Đã mở phong thư hoàng gia' : 'Chạm con dấu sáp hoặc nút bên cạnh để mở thư'}
              </p>
            </div>
          </div>

          {/* Right Action: Open Letter Toggle */}
          <button
            onClick={handleCrackSeal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#E8B498]/20 via-[#E8B498]/30 to-[#E8B498]/20 hover:from-[#E8B498]/40 hover:to-[#E8B498]/40 border border-[#E8B498]/50 text-xs font-serif font-semibold text-[#FCE4BE] transition-all shrink-0 flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8B498]" />
            <span>{isBroken ? 'Thu gọn thư mời' : 'Mở phong thư hoàng gia'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isBroken ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expandable Heartfelt Royal Parchment Letter */}
        <AnimatePresence>
          {isBroken && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-5 pt-5 border-t border-[#E8B498]/25 text-left"
            >
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0F0B12]/90 border border-[#E8B498]/30 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(232,180,152,0.15)_0,transparent_70%)] pointer-events-none" />

                <h4 className="text-base font-serif font-bold text-[#E8B498] mb-2 flex items-center gap-2">
                  <span>Kính gửi {guestName || 'Quý Khách Quý'},</span>
                  <Heart className="w-3.5 h-3.5 text-[#E8B498] fill-[#E8B498]" />
                </h4>

                <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed mb-3">
                  Trong từng bước đi của hành trình tình yêu đôi lứa, sự đồng hành, sẻ chia và chứng kiến của bạn là niềm hạnh phúc vô giá của chúng mình. Chiếc thiệp này là lời tri ân chân thành nhất, thay cho lời mời trân trọng gửi tới bạn để cùng nâng ly chung vui, chứng kiến lời thề nguyền trăm năm dưới ánh sáng tình yêu vĩnh cửu.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[11px] text-[#E8B498]/70 font-mono tracking-wider">HÔN LỄ HOÀNG GIA VIP</span>
                  <span className="text-xs text-[#E8B498] font-serif italic">
                    — Thân mến, {groomName} & {brideName}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
