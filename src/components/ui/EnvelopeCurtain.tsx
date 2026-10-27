import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Mail, Heart, Sparkles } from 'lucide-react';
import { weddingAudio } from '../../lib/audioSynth';
import { CoupleNamesStacked } from '../wedding/common/CoupleNamesStacked';
import { PersonalizedWaxSealBadge } from '../wedding/common/PersonalizedWaxSealBadge';

interface EnvelopeCurtainProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  musicUrl?: string;
  onOpen: () => void;
}

export function EnvelopeCurtain({
  groomName,
  brideName,
  weddingDate,
  musicUrl,
  onOpen,
}: EnvelopeCurtainProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenInvitation = () => {
    setIsAnimating(true);

    // Fire romantic gold/rose confetti
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#E5C058', '#F3E5AB', '#E29578', '#FFF'],
      });
    } catch {
      // ignore
    }

    // Play wedding ambient sound upon user gesture
    weddingAudio.play(musicUrl);

    // Give curtain time to split elegantly
    setTimeout(() => {
      setIsOpen(true);
      onOpen();
    }, 1100);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      {!isOpen && (
        <div id="envelope-curtain-container" className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
          {/* Left Curtain / Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={isAnimating ? { x: '-100%' } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 w-1/2 h-full bg-[#181615] border-r border-[#D4AF37]/30 shadow-2xl z-20 flex items-center justify-end"
          >
            {/* Subtle vintage luxury pattern on curtain */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          </motion.div>

          {/* Right Curtain / Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={isAnimating ? { x: '100%' } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 right-0 w-1/2 h-full bg-[#181615] border-l border-[#D4AF37]/30 shadow-2xl z-20 flex items-center justify-start"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          </motion.div>

          {/* Center Luxury Invitation Letter Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={isAnimating ? { opacity: 0, scale: 1.08, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-30 max-w-md w-[90%] mx-auto p-8 sm:p-10 rounded-3xl bg-[#FDFBF7] text-[#2C2A29] shadow-2xl border-2 border-[#D4AF37]/40 text-center"
          >
            {/* Ornamental Frame Border */}
            <div className="absolute inset-2 border border-[#D4AF37]/30 rounded-2xl pointer-events-none" />

            {/* Wax Seal Icon */}
            <div className="relative mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-tr from-[#9B111E] to-[#C41E3A] text-white shadow-lg flex items-center justify-center border-2 border-[#D4AF37]">
              <Mail className="w-7 h-7 text-[#FFF8E7]" />
              <div className="absolute -bottom-1 right-0 p-1 bg-[#D4AF37] rounded-full text-white shadow">
                <Sparkles className="w-3 h-3 text-[#181615]" />
              </div>
            </div>

            <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] mb-1">
              You're Invited
            </p>
            <p className="font-body text-xs uppercase tracking-[0.25em] text-[#8C7335] mb-4 font-semibold">
              Trân trọng kính mời
            </p>

            <div className="my-4 py-3 border-y border-[#D4AF37]/25 w-full max-w-full px-2">
              <CoupleNamesStacked
                groomName={groomName}
                brideName={brideName}
                variant="envelope"
                textColor="#2C2A29"
                heartColor="#D4AF37"
                idPrefix="envelope-curtain-box"
              />
            </div>

            <p className="font-body text-xs text-neutral-500 mb-6 tracking-wider">
              {weddingDate}
            </p>

            {/* Open Button */}
            <button
              id="open-wedding-invitation-btn"
              onClick={handleOpenInvitation}
              disabled={isAnimating}
              className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C058] to-[#D4AF37] text-[#1C1A17] font-body text-sm font-semibold tracking-widest uppercase shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Mở Thiệp Cưới</span>
                <Heart className="w-4 h-4 fill-current text-[#1C1A17] group-hover:scale-125 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <p className="mt-4 text-[11px] text-neutral-400 font-body">
              Chạm để mở thiệp và thưởng thức giai điệu chúc phúc
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
