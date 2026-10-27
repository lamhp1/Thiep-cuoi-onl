import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MailOpen, Heart } from 'lucide-react';
import {
  LoveLetterPaperTexture,
  LoveLetterWaxSeal,
  PostageStamp,
  FountainPenOrnament,
  VintageStampOrnament,
  MiniAirmailLetterOrnament,
  BrassPaperClipOrnament,
} from './LoveLetterOrnaments';
import { PersonalizedWaxSealBadge } from '../../common/PersonalizedWaxSealBadge';

interface LoveLetterEnvelopeOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate?: string;
  city?: string;
  onOpenLetter: () => void;
}

export function LoveLetterEnvelopeOpening({
  groomName,
  brideName,
  weddingDate = '20.12.2026',
  city = 'TP. HUẾ',
  onOpenLetter,
}: LoveLetterEnvelopeOpeningProps) {
  const [openingPhase, setOpeningPhase] = useState<'idle' | 'vibrating' | 'opening' | 'sliding' | 'done'>('idle');

  const handleOpenClick = () => {
    if (openingPhase !== 'idle') return;

    // Step 1: Gentle vibration
    setOpeningPhase('vibrating');

    // Step 2: Flap opens up
    setTimeout(() => {
      setOpeningPhase('opening');
    }, 400);

    // Step 3: Letter slides out & scales
    setTimeout(() => {
      setOpeningPhase('sliding');
    }, 900);

    // Step 4 & 5: Fade out envelope and show main letter
    setTimeout(() => {
      setOpeningPhase('done');
      onOpenLetter();
    }, 1850);
  };

  return (
    <AnimatePresence>
      {openingPhase !== 'done' && (
        <motion.div
          id="love-letter-opening-screen"
          initial={{ opacity: 0 }}
          animate={{
            opacity: openingPhase === 'sliding' ? 0.2 : 1,
            scale: openingPhase === 'sliding' ? 1.05 : 1,
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F1E7] text-[#59483E] px-4 py-6 sm:py-8 overflow-y-auto select-none"
        >
          {/* Paper Texture Overlay with notebook ruled lines */}
          <LoveLetterPaperTexture />

          {/* Background Ambient Letter & Desk Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-[#C98F8F]/10 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#C8A96B]/15 blur-3xl" />

            {/* Vintage Postage Stamp + Brass Paperclip (Top Left Desk) */}
            <div className="hidden sm:block absolute top-8 left-8 md:top-12 md:left-14 lg:left-24 opacity-85">
              <VintageStampOrnament
                variant="rose"
                price="2000đ"
                country="BƯU ĐIỆN"
                postmarkDate={weddingDate}
                angle={-8}
              />
              <BrassPaperClipOrnament className="absolute -top-2 right-2" angle={20} />
            </div>

            {/* Mini Airmail Letter (Bottom Left Desk) */}
            <div className="hidden md:block absolute bottom-12 left-8 lg:left-20 opacity-80">
              <MiniAirmailLetterOrnament angle={6} />
            </div>

            {/* Classical Fountain Pen (Bottom Right Desk) */}
            <div className="hidden sm:block absolute bottom-10 right-6 md:bottom-14 md:right-14 lg:right-24 opacity-95">
              <FountainPenOrnament angle={-32} />
            </div>

            {/* Vintage Airmail Stamp (Top Right Desk) */}
            <div className="hidden md:block absolute top-10 right-10 lg:right-28 opacity-80">
              <VintageStampOrnament
                variant="dove"
                price="AIRMAIL"
                country="TÌNH YÊU"
                postmarkDate={weddingDate}
                angle={12}
              />
            </div>
          </div>

          {/* Central Envelope Assembly */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: openingPhase === 'vibrating' ? [0, -3, 3, -2, 2, 0] : 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              x: { duration: 0.35, ease: 'easeInOut' },
            }}
            className="relative w-full max-w-[360px] sm:max-w-[460px] md:max-w-[520px] rounded-3xl bg-[#FFFDF8] border border-[#C8A96B]/40 shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-between text-center overflow-visible"
            style={{
              boxShadow:
                '0 20px 45px -15px rgba(89,72,62,0.22), 0 0 0 1px rgba(200,169,107,0.2)',
            }}
          >
            {/* Vintage Airmail Postage Stamp (Top Right) */}
            <motion.div
              initial={{ opacity: 0, y: -10, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 4 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute top-4 right-4 sm:top-5 sm:right-6 pointer-events-none"
            >
              <PostageStamp date={weddingDate} city={city} />
            </motion.div>

            {/* Step 1: Subtitle on Envelope Header */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-left w-full max-w-[65%]"
            >
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold text-[#7A2638]">
                <span>♥</span>
                <span>THƯ BÁO HỶ</span>
              </div>
              <p className="font-handwriting text-xs sm:text-base text-[#7A2638]/80 mt-0.5 tracking-wide">
                Gửi những người chúng mình yêu quý...
              </p>
            </motion.div>

            {/* Step 2: Center - Groom & Bride Names (Stacked rows, NEVER wraps single name) */}
            <div className="w-full text-center my-4 sm:my-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="space-y-1 sm:space-y-1.5 w-full"
              >
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C8A96B] font-semibold mb-1">
                  TRÂN TRỌNG BÁO HỶ
                </div>

                {/* Couple Names Stacked: Groom on Line 1, & in center, Bride on Line 2 */}
                <div className="w-full flex flex-col items-center justify-center space-y-0.5 sm:space-y-1">
                  {/* Tên Chú Rể (không bao giờ bị ngắt hàng) */}
                  <div
                    className="w-full font-handwriting font-bold text-[#59483E] tracking-normal leading-tight whitespace-nowrap overflow-hidden text-ellipsis px-2"
                    style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.4rem)' }}
                  >
                    {groomName}
                  </div>

                  {/* Ký hiệu & trang nhã */}
                  <div className="flex items-center justify-center gap-3 text-[#7A2638] my-0.5">
                    <span className="h-[1px] w-8 sm:w-14 bg-[#C8A96B]/40" />
                    <span className="font-handwriting text-xl sm:text-2xl font-normal select-none leading-none">
                      &amp;
                    </span>
                    <span className="h-[1px] w-8 sm:w-14 bg-[#C8A96B]/40" />
                  </div>

                  {/* Tên Cô Dâu (không bao giờ bị ngắt hàng) */}
                  <div
                    className="w-full font-handwriting font-bold text-[#59483E] tracking-normal leading-tight whitespace-nowrap overflow-hidden text-ellipsis px-2"
                    style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.4rem)' }}
                  >
                    {brideName}
                  </div>
                </div>

                <p className="text-[10px] sm:text-xs text-[#59483E]/70 tracking-widest font-sans uppercase mt-2 sm:mt-3">
                  {weddingDate} • {city}
                </p>

                {/* Wax Seal Inscribed Guest Name Badge */}
                <PersonalizedWaxSealBadge theme="red" className="my-2 max-w-[280px]" />
              </motion.div>
            </div>

            {/* Flap & Wax Seal Area */}
            <div className="relative w-full flex items-center justify-center pt-2">
              {/* Envelope Flap Fold Line */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C8A96B]/50 to-transparent pointer-events-none" />

              {/* The Sliding Letter (revealed when opening) */}
              {openingPhase === 'sliding' && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.9 }}
                  animate={{ y: -90, opacity: 1, scale: 1.04 }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                  className="absolute -top-28 w-[92%] h-36 bg-[#FAF5EE] rounded-xl border border-[#C8A96B]/50 shadow-xl p-4 flex flex-col items-center justify-center text-center z-30 pointer-events-none"
                >
                  <p className="font-handwriting text-xl text-[#7A2638] font-bold">
                    Gửi những người chúng mình yêu quý...
                  </p>
                  <p className="font-handwriting text-base text-[#59483E]/85 mt-1">
                    Bức thư tình gửi từ {groomName} &amp; {brideName}
                  </p>
                </motion.div>
              )}

              {/* Wax Seal / Stamp Button anchored to bottom of envelope */}
              <motion.div
                initial={{ opacity: 0, scale: 1.4, rotate: 10 }}
                animate={
                  openingPhase === 'opening' || openingPhase === 'sliding'
                    ? { opacity: 0, scale: 0.5, rotate: -15 }
                    : { opacity: 1, scale: 1, rotate: -2 }
                }
                transition={
                  openingPhase === 'opening' || openingPhase === 'sliding'
                    ? { duration: 0.4, ease: 'easeInOut' }
                    : {
                        delay: 0.65,
                        duration: 0.6,
                        type: 'spring',
                        stiffness: 260,
                      }
                }
                className="relative z-20 cursor-pointer -mb-9 sm:-mb-10"
                onClick={handleOpenClick}
                title="Bấm vào con dấu sáp để mở thư"
              >
                <LoveLetterWaxSeal
                  text="WITH LOVE"
                  size="lg"
                  stampAnimate={false}
                  className="hover:scale-105 active:scale-95 transition-transform drop-shadow-lg"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Dedicated Action Area Below the Envelope (Clean, spacious, zero overlapping) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-12 sm:mt-14 flex flex-col items-center gap-2.5 z-30 text-center"
          >
            {/* Step 3: Button "MỞ BỨC THƯ TÌNH" */}
            <button
              id="love-letter-open-btn"
              onClick={handleOpenClick}
              disabled={openingPhase !== 'idle'}
              className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-[#7A2638] hover:bg-[#631c2c] text-[#FFFDF8] font-serif-title font-semibold text-xs sm:text-sm tracking-widest shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MailOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A96B] group-hover:rotate-12 transition-transform" />
              <span>{openingPhase === 'idle' ? 'MỞ BỨC THƯ TÌNH' : 'ĐANG MỞ THƯ...'}</span>
            </button>

            {/* Helper text */}
            <span className="text-[11px] sm:text-xs text-[#59483E]/70 tracking-wide font-sans">
              Chạm vào phong bì hoặc bấm nút để đọc thư
            </span>

            {/* Direct Skip Button - cleanly separated and clearly visible */}
            <button
              onClick={onOpenLetter}
              className="mt-1.5 text-xs text-[#59483E]/60 hover:text-[#7A2638] underline underline-offset-4 cursor-pointer transition-colors"
            >
              Bỏ qua mở phong bì, xem trực tiếp nội dung thư →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
