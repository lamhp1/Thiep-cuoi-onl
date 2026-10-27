import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, MailOpen, Heart, ArrowRight } from 'lucide-react';
import { weddingAudio } from '../../../lib/audioSynth';
import { MiniSongHy, MinimalistLotus, ModernCloudLine, DongSonPattern } from './VietnameseModernOrnaments';
import { CoupleNamesStacked } from '../common/CoupleNamesStacked';
import { PersonalizedWaxSealBadge } from '../common/PersonalizedWaxSealBadge';

interface VietnameseModernEnvelopeProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  musicUrl?: string;
  onOpen: () => void;
}

export function VietnameseModernEnvelope({
  groomName,
  brideName,
  weddingDate,
  musicUrl,
  onOpen,
}: VietnameseModernEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [flapOpened, setFlapOpened] = useState(false);
  const [letterPulled, setLetterPulled] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Audio chime
    weddingAudio.play(musicUrl);

    // Step 1: Flap unseals and flips upwards (at 200ms)
    setTimeout(() => {
      setFlapOpened(true);
    }, 250);

    // Step 2: Letter card slides upwards out of envelope pocket (at 600ms)
    setTimeout(() => {
      setLetterPulled(true);

      // Luxurious confetti explosion: Wine red, champagne gold, ivory silk
      try {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#63121D', '#D8BE87', '#E5CFA0', '#851B2A', '#FAF6EE', '#FFFFFF'],
        });
      } catch {}
    }, 700);

    // Step 3: Complete transition into the main wedding invitation
    setTimeout(() => {
      setIsOpen(true);
      onOpen();
    }, 1800);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          id="modern-envelope-modal"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          /* Solid, opaque luxury background - NO transparency */
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141211] p-4 overflow-hidden"
          style={{
            background: 'radial-gradient(circle at center, #2C0E14 0%, #171313 55%, #0D0A0B 100%)',
          }}
        >
          {/* Subtle Dong Son Bronze Drum Watermark on the solid background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
            <div className="animate-[spin_180s_linear_infinite]">
              <DongSonPattern className="w-[850px] h-[850px] text-[#D8BE87]" opacity={0.35} />
            </div>
          </div>

          {/* Ambient Champagne Stardust glow */}
          <div className="absolute w-[500px] h-[500px] bg-[#D8BE87]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Envelope 3D Stage */}
          <div
            className="relative w-full max-w-xs xs:max-w-sm sm:max-w-lg aspect-[4/4.6] xs:aspect-[4/4.2] sm:aspect-[16/11] flex items-center justify-center my-auto"
            style={{ perspective: '1400px' }}
          >
            {/* 1. SLIDING LETTER (Thiệp mời bên trong trượt lên khi mở) */}
            <motion.div
              initial={{ y: 0, scale: 0.92, opacity: 0 }}
              animate={
                letterPulled
                  ? { y: -80, scale: 1.03, opacity: 1, zIndex: 40 }
                  : { y: 0, scale: 0.92, opacity: 0, zIndex: 10 }
              }
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-[88%] sm:w-[88%] aspect-[4/3.8] sm:aspect-[16/10] bg-[#FFFDF9] rounded-2xl p-4 sm:p-8 border-2 border-[#D8BE87] shadow-[0_25px_60px_rgba(0,0,0,0.45)] text-center flex flex-col justify-between"
            >
              {/* Gold Inner Border Line */}
              <div className="absolute inset-2 sm:inset-3 border border-[#D8BE87]/50 rounded-xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between text-[#8C8275] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold">
                <span>Trân Trọng Kính Mời</span>
                <MiniSongHy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#63121D]" />
                <span>Save Our Date</span>
              </div>

              <div className="relative z-10 my-auto space-y-1 py-1 w-full max-w-full px-2">
                <CoupleNamesStacked
                  groomName={groomName}
                  brideName={brideName}
                  variant="envelope-sm"
                  textColor="#18181A"
                  heartColor="#63121D"
                  idPrefix="vm-letter"
                />
                <span className="font-body text-[10px] sm:text-xs text-[#63121D] tracking-[0.25em] uppercase block font-semibold">
                  THE BEGINNING OF FOREVER
                </span>
                <p className="font-serif-title text-xs sm:text-sm text-[#8C8275] italic pt-0.5 sm:pt-1">
                  Ngày {weddingDate || '20 Tháng 12 Năm 2026'}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#63121D] tracking-widest uppercase">
                <span>Đang mở thiệp</span>
                <ArrowRight className="w-3.5 h-3.5 animate-pulse text-[#D8BE87]" />
              </div>
            </motion.div>

            {/* 2. ENVELOPE BODY (Thân phong bì màu đỏ rượu sang trọng) */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={isOpening ? { scale: 0.98, y: 30 } : { scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-20 w-full h-full bg-[#5A0F1A] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] border-2 border-[#D8BE87] overflow-hidden flex flex-col justify-between p-4.5 xs:p-5 sm:p-8"
              style={{
                background: 'linear-gradient(145deg, #6E1422 0%, #540E18 60%, #3B0810 100%)',
              }}
            >
              {/* Champagne Satin Inner Pocket Lining (Lót trong màu vàng champagne) */}
              <div
                className="absolute inset-x-4 top-4 bottom-4 rounded-2xl pointer-events-none opacity-15"
                style={{
                  background: 'repeating-linear-gradient(45deg, #D8BE87 0, #D8BE87 2px, transparent 0, transparent 8px)',
                }}
              />

              {/* Envelope Header Branding */}
              <div className="relative z-10 flex items-center justify-between text-[#D8BE87] text-xs">
                <div className="flex items-center gap-1.5">
                  <ModernCloudLine className="w-6 h-3 sm:w-8 sm:h-4 text-[#D8BE87]" />
                  <span className="font-serif-title uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[9px] sm:text-[10px] font-semibold text-[#F8F4EC]">
                    L'Amour Wedding
                  </span>
                </div>
                <span className="font-body text-[8.5px] sm:text-[9px] tracking-widest text-[#E5CFA0] uppercase">
                  Bản Sắc Việt Hiện Đại
                </span>
              </div>

              {/* Center Typography & Wax Seal Trigger */}
              <div className="relative z-30 flex flex-col items-center justify-center text-center my-auto py-2">
                <PersonalizedWaxSealBadge theme="dark" className="my-1.5" />

                <motion.button
                  onClick={handleOpen}
                  disabled={isOpening}
                  whileHover={!isOpening ? { scale: 1.08 } : {}}
                  whileTap={!isOpening ? { scale: 0.95 } : {}}
                  className="group relative cursor-pointer focus:outline-none"
                  title="Chạm để mở thiệp cưới"
                >
                  {/* Glowing Ring */}
                  <div className="absolute -inset-2.5 sm:-inset-3 rounded-full border border-[#D8BE87]/60 group-hover:border-[#D8BE87] group-hover:shadow-[0_0_30px_rgba(216,190,135,0.7)] animate-pulse transition-all" />

                  {/* Wax Seal Circle */}
                  <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1C1819] via-[#2A2426] to-[#120F10] border-2 border-[#D8BE87] shadow-2xl flex flex-col items-center justify-center text-[#D8BE87] transition-all">
                    <MiniSongHy className="w-7 h-7 sm:w-9 sm:h-9 text-[#D8BE87]" />
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-[#E5CFA0] mt-0.5 sm:mt-1">
                      {isOpening ? 'Đang Mở...' : 'Mở Thiệp'}
                    </span>
                  </div>
                </motion.button>

                {/* Couple Names on Envelope */}
                <div className="mt-3 sm:mt-5 space-y-0.5 sm:space-y-1 text-center w-full max-w-full px-4">
                  <CoupleNamesStacked
                    groomName={groomName}
                    brideName={brideName}
                    variant="envelope"
                    textColor="#FFFFFF"
                    heartColor="#D8BE87"
                    idPrefix="vm-envelope"
                  />
                  <span className="font-body text-[9px] sm:text-[11px] text-[#E5CFA0] tracking-[0.25em] sm:tracking-[0.3em] uppercase block">
                    THE BEGINNING OF FOREVER
                  </span>
                </div>
              </div>

              {/* Envelope Footer Info */}
              <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-[11px] text-[#D8BE87]/90 border-t border-[#D8BE87]/30 pt-2.5 sm:pt-3 mt-auto">
                <span className="text-[#E5CFA0] leading-snug">Hôn Lễ: {weddingDate || '20.12.2026'}</span>
                <button
                  onClick={handleOpen}
                  disabled={isOpening}
                  className="inline-flex items-center gap-1.5 text-white font-medium hover:text-[#D8BE87] transition-colors cursor-pointer shrink-0"
                >
                  <span>Chạm để mở thiệp</span>
                  <MailOpen className="w-3.5 h-3.5 text-[#D8BE87]" />
                </button>
              </div>

              {/* 3. 3D ENVELOPE FLAP (Nắp phong bì lật mở 180 độ theo trục X) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={flapOpened ? { rotateX: -180, zIndex: 5 } : { rotateX: 0, zIndex: 25 }}
                transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  transformOrigin: 'top center',
                  backfaceVisibility: 'hidden',
                }}
                className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#7A1626] to-[#5A0F1A] border-b border-[#D8BE87]/50 shadow-lg flex items-center justify-center rounded-t-3xl pointer-events-none"
              >
                {/* Dong Son faint pattern on flap */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <DongSonPattern className="w-48 h-48 text-[#D8BE87]" opacity={0.4} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
