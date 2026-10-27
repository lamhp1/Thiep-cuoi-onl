import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PassportStamp } from './PassportOrnaments';
import {
  BookOpen,
  Heart,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  X,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { PersonalizedWaxSealBadge } from '../../common/PersonalizedWaxSealBadge';

interface PassportCoverOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate?: string;
  musicUrl?: string;
  groomPhoto?: string;
  bridePhoto?: string;
  coverImage?: string;
  city?: string;
  onOpen: () => void;
}

export function PassportCoverOpening({
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
  weddingDate = '20.12.2026',
  musicUrl,
  groomPhoto,
  bridePhoto,
  coverImage,
  city = 'Hà Nội, Việt Nam',
  onOpen,
}: PassportCoverOpeningProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosingOverlay, setIsClosingOverlay] = useState(false);
  const [stampLanded, setStampLanded] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 844,
  });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setWindowDimensions({
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
          return;
        }
      }
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const isMobile = windowDimensions.width < 640;

  // Single page base dimensions:
  // On mobile: 245px width, 420px height (ratio 1.71:1, slim and tall)
  // When opened: 490px width, 420px height (ratio 1.17:1, compact landscape)
  const pageWidth = isMobile ? 245 : 330;
  const pageHeight = isMobile ? 420 : 475;
  const openWidth = pageWidth * 2; // 490px on mobile, 660px on desktop

  // Target width on mobile: occupies 97% of the mobile screen width (only ~6px margin on each side)
  const targetOpenWidth = Math.max(windowDimensions.width - 12, 320);
  const targetMaxOpenHeight = Math.max(windowDimensions.height - 180, 290);

  // When OPENED on mobile: scale up so it fits the mobile screen width directly
  const openScale = isMobile
    ? Math.min(targetOpenWidth / openWidth, targetMaxOpenHeight / pageHeight)
    : 1;

  // When CLOSED on mobile: scale so the closed passport cover fills the screen proudly
  const closedScale = isMobile
    ? Math.min(1.24, (windowDimensions.width - 36) / pageWidth)
    : 1;

  const currentScale = isOpen ? openScale : closedScale;

  const displayPhoto =
    coverImage ||
    groomPhoto ||
    bridePhoto ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85';

  const handleToggleBook = () => {
    if (!isOpen) {
      if (musicUrl) {
        try {
          const audio = new Audio(musicUrl);
          audio.play().catch(() => {});
        } catch (e) {
          // Safe audio fallback
        }
      }
      setIsOpen(true);
      setTimeout(() => {
        setStampLanded(true);
      }, 1000);
    } else {
      setStampLanded(false);
      setIsOpen(false);
    }
  };

  const handleFinishAndEnter = () => {
    setIsClosingOverlay(true);
    setTimeout(() => {
      onOpen();
    }, 450);
  };

  return (
    <AnimatePresence>
      {!isClosingOverlay && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#070B14]/95 backdrop-blur-md px-1.5 pt-2 pb-14 sm:p-6 overflow-hidden select-none"
        >
          {/* Ambient Lighting & Luxury Vignette */}
          <div className="absolute inset-0 bg-radial from-[#651F2A]/35 via-transparent to-black/90 pointer-events-none" />

          {/* ================================================================= */}
          {/* TOP BAR                                                           */}
          {/* ================================================================= */}
          <div className="relative z-50 w-full max-w-2xl flex items-center justify-between pt-1 pointer-events-auto">
            <div className="flex items-center gap-1.5 text-[#B99552] text-[11px] sm:text-xs font-mono tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5 text-[#B99552]" />
              <span>HỘ CHIẾU TÌNH YÊU</span>
            </div>

            <button
              type="button"
              onClick={handleFinishAndEnter}
              className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-[#B99552]/40 text-[#F5EEDF] text-[11px] sm:text-xs font-mono tracking-wider transition-all flex items-center gap-1 cursor-pointer backdrop-blur-sm shadow-md"
            >
              <span>Vào thẳng thiệp</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ================================================================= */}
          {/* 3D PASSPORT BOOK CONTAINER                                        */}
          {/* ================================================================= */}
          <div
            className="relative flex-1 w-full flex items-center justify-center my-auto overflow-visible"
            style={{ perspective: '2400px' }}
          >
            {/* The Master Book Wrapper (No layout prop to prevent double-shrinking) */}
            <motion.div
              initial={{ rotateX: 8, rotateY: -6 }}
              animate={
                isOpen
                  ? {
                      rotateX: 2,
                      rotateY: 0,
                      rotateZ: 0,
                      scale: currentScale,
                      width: openWidth,
                      height: pageHeight,
                      transition: { duration: 0.9, ease: [0.34, 1, 0.4, 1] },
                    }
                  : {
                      rotateX: 7,
                      rotateY: -6,
                      rotateZ: 0,
                      scale: currentScale,
                      width: pageWidth,
                      height: pageHeight,
                      transition: { duration: 0.7, ease: [0.34, 1, 0.4, 1] },
                    }
              }
              style={{
                transformStyle: 'preserve-3d',
              }}
              className="relative select-none"
            >
              {/* Soft Desk Shadow beneath the book */}
              <div
                className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-700 ${
                  isOpen
                    ? 'shadow-[0_25px_50px_-10px_rgba(0,0,0,0.85),0_10px_25px_rgba(101,31,42,0.2)]'
                    : 'shadow-[0_20px_40px_-8px_rgba(0,0,0,0.9)]'
                }`}
              />

              {/* Hardcover Casing beneath the pages */}
              <div
                className={`absolute -inset-1 rounded-2xl bg-[#1D080B] border border-[#B99552]/40 pointer-events-none transition-opacity duration-500 ${
                  isOpen ? 'opacity-100' : 'opacity-90'
                }`}
              />

              {/* ============================================================= */}
              {/* RIGHT PAGE: THE BIOMETRIC PASSPORT IDENTITY SPREAD            */}
              {/* ============================================================= */}
              <div
                className={`absolute top-0 h-full rounded-r-xl bg-[#FCFAF5] text-[#41372F] p-3 sm:p-5 overflow-hidden flex flex-col justify-between border-y border-r border-[#B99552]/40 shadow-[inset_15px_0_20px_rgba(0,0,0,0.08)] ${
                  isOpen
                    ? 'right-0 w-1/2'
                    : 'inset-0 w-full rounded-xl pointer-events-none'
                }`}
              >
                {/* Guilloché pattern */}
                <div className="absolute inset-0 opacity-[0.14] pointer-events-none bg-[radial-gradient(#B99552_1px,transparent_1px)] [background-size:8px_8px]" />

                {/* Top Security Line */}
                <div className="relative z-10 flex items-center justify-between border-b border-[#B99552]/30 pb-1.5">
                  <div>
                    <span className="text-[7.5px] sm:text-[9px] font-mono tracking-[0.18em] text-[#651F2A] font-bold uppercase block">
                      REPUBLIC OF ETERNAL LOVE
                    </span>
                    <span className="font-serif-title text-xs sm:text-sm font-bold tracking-wider text-[#172A3A] uppercase">
                      PASSPORT • HỘ CHIẾU
                    </span>
                  </div>
                  <div className="text-right font-mono text-[8px] sm:text-[9.5px]">
                    <span className="text-neutral-400 block text-[6.5px] uppercase">NO.</span>
                    <span className="font-bold text-[#651F2A] tracking-wider">LP-2026-LOVE</span>
                  </div>
                </div>

                {/* Biometric Passport Information */}
                <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-3 py-1.5 items-center flex-1">
                  {/* Photo with Gold Frame & Holographic Seal */}
                  <div className="col-span-5 relative">
                    <div className="w-full aspect-[3/4] rounded border-2 border-[#B99552] overflow-hidden bg-neutral-200 shadow-md relative">
                      <img
                        src={displayPhoto}
                        alt="Couple Passport"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/65 text-white text-[6.5px] sm:text-[7.5px] font-mono text-center py-0.5 tracking-wider uppercase">
                        OFFICIAL PHOTO
                      </div>
                    </div>
                    {/* Hologram badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-[#B99552] via-[#F5EEDF] to-[#B99552] border border-white flex items-center justify-center text-[#651F2A] shadow-xs">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Citizen Metadata Fields */}
                  <div className="col-span-7 space-y-1 font-mono text-[7.5px] sm:text-[9px] leading-tight">
                    <div>
                      <span className="text-neutral-400 block text-[6px] sm:text-[7px] uppercase">
                        BEARERS / CHỦ HỘ CHIẾU
                      </span>
                      <strong className="font-serif-title text-[#172A3A] text-[11px] sm:text-xs block font-bold truncate">
                        {groomName} &amp; {brideName}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-0.5">
                      <div>
                        <span className="text-neutral-400 block text-[6px] sm:text-[7px] uppercase">
                          NATIONALITY
                        </span>
                        <strong className="text-[#651F2A] font-bold text-[7px] sm:text-[8px]">
                          REP. OF LOVE
                        </strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[6px] sm:text-[7px] uppercase">
                          SEX
                        </span>
                        <strong className="text-[#172A3A] text-[7px] sm:text-[8px]">
                          COUPLE
                        </strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[6px] sm:text-[7px] uppercase">
                        DEPARTURE DATE
                      </span>
                      <strong className="text-[#651F2A] font-bold text-[7.5px] sm:text-[8.5px]">
                        {weddingDate}
                      </strong>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[6px] sm:text-[7px] uppercase">
                        AUTHORITY / NƠI CẤP
                      </span>
                      <span className="text-neutral-600 truncate block text-[7px] sm:text-[8px]">
                        {city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Machine Readable Zone (MRZ 2 Lines) */}
                <div className="relative z-10 pt-1.5 border-t border-[#B99552]/30 font-mono text-[6.5px] sm:text-[7.5px] leading-tight text-neutral-600 tracking-wider">
                  <div className="truncate">
                    P&lt;VNM&lt;{groomName.toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </div>
                  <div className="truncate text-[#651F2A] font-bold">
                    LP202612204VNM9605202M2612204&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02
                  </div>
                </div>

                {/* Dynamic Page Shadow as Cover turns */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isOpen ? 0 : 0.9,
                    transition: { duration: 0.5 },
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none"
                />
              </div>

              {/* ============================================================= */}
              {/* 3D CENTER BOOK SPINE (Gáy sách khi mở ra 2 trang)             */}
              {/* ============================================================= */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-full z-30 pointer-events-none flex flex-col justify-between items-center py-3"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.25) 0%, rgba(255,255,255,0.12) 50%, rgba(0,0,0,0.25) 100%)',
                    boxShadow: '0 0 8px rgba(0,0,0,0.4)',
                  }}
                >
                  <div className="w-0.5 h-2.5 bg-[#B99552]/60 rounded-full" />
                  <div className="w-0.5 h-2.5 bg-[#B99552]/60 rounded-full" />
                  <div className="w-0.5 h-2.5 bg-[#B99552]/60 rounded-full" />
                  <div className="w-0.5 h-2.5 bg-[#B99552]/60 rounded-full" />
                </motion.div>
              )}

              {/* ============================================================= */}
              {/* 3D TURNING LEAF: FRONT COVER & LEFT VISA PAGE                 */}
              {/* ============================================================= */}
              <motion.div
                initial={false}
                animate={{
                  rotateY: isOpen ? -180 : 0,
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.35, 0.05, 0.2, 1.0],
                }}
                className={`absolute top-0 h-full z-20 cursor-pointer ${
                  isOpen ? 'right-0 w-1/2 origin-left' : 'inset-0 w-full origin-left'
                }`}
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                }}
                onClick={handleToggleBook}
              >
                {/* ----------------------------------------------------------- */}
                {/* FACE A: MẶT NGOÀI BÌA HỘ CHIẾU (Front Leather Cover)        */}
                {/* ----------------------------------------------------------- */}
                <div
                  className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#68202B] via-[#4A151E] to-[#2B0B11] text-[#F5EEDF] p-4 sm:p-6 flex flex-col justify-between border-2 border-[#B99552]/75 shadow-2xl overflow-hidden group"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  {/* Leather Grain Texture */}
                  <div className="absolute inset-0 opacity-25 mix-blend-overlay bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />

                  {/* Gold Foil Double Frame */}
                  <div className="absolute inset-2 sm:inset-3 rounded-lg border border-[#B99552]/40 pointer-events-none" />
                  <div className="absolute inset-3 sm:inset-4 rounded-md border border-[#B99552]/80 pointer-events-none" />

                  {/* Spine Ridge on the left */}
                  <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />

                  {/* Top Emblem Header */}
                  <div className="relative z-10 text-center pt-1 sm:pt-2">
                    <div className="inline-flex items-center gap-1.5 text-[#B99552] text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.25em] uppercase mb-0.5 font-bold">
                      <span>OFFICIAL UNION</span>
                      <span>•</span>
                      <span>HỘ CHIẾU</span>
                    </div>
                    <h1 className="font-serif-title text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#FCFAF5] drop-shadow-sm uppercase">
                      PASSPORT
                    </h1>
                    <p className="font-serif-title italic text-[10px] sm:text-xs tracking-widest text-[#B99552]">
                      LOVE JOURNEY
                    </p>
                  </div>

                  {/* Center Emblem: Royal Heart */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#B99552]/70 flex items-center justify-center p-1.5 shadow-inner bg-black/20 group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-1 rounded-full border border-dashed border-[#B99552]/40" />
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#7D2433] border border-[#B99552] flex flex-col items-center justify-center text-[#B99552] shadow-md">
                        <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-[#B99552] text-[#7D2433]" />
                        <span className="text-[6.5px] font-mono tracking-widest uppercase mt-0.5 font-bold text-[#FCFAF5]">
                          FOREVER
                        </span>
                      </div>
                    </div>

                    {/* Couple Names */}
                    <div className="mt-3 text-center space-y-0.5">
                      <div className="font-serif-title text-base sm:text-lg font-bold tracking-wider text-[#FCFAF5] drop-shadow-sm">
                        {groomName}
                      </div>
                      <div className="font-serif-title italic text-xs text-[#B99552]">&amp;</div>
                      <div className="font-serif-title text-base sm:text-lg font-bold tracking-wider text-[#FCFAF5] drop-shadow-sm">
                        {brideName}
                      </div>
                    </div>

                    <div className="w-12 h-px bg-[#B99552]/50 my-1.5" />
                    <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#FCFAF5]/80 font-medium">
                      A JOURNEY TOWARDS FOREVER
                    </p>

                    {/* Gold Inscribed Guest Badge */}
                    <PersonalizedWaxSealBadge theme="dark" className="my-1 py-1.5 px-3 max-w-[240px]" />
                  </div>

                  {/* Bottom Button on Cover */}
                  <div className="relative z-10 text-center pb-0.5">
                    <div className="w-full py-2 sm:py-2.5 px-3 rounded-full bg-gradient-to-r from-[#B99552] via-[#D4AF37] to-[#B99552] hover:brightness-110 text-[#2B0B11] font-sans text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap">
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-[#2B0B11]" />
                      <span className="whitespace-nowrap">MỞ HỘ CHIẾU TÌNH YÊU</span>
                    </div>
                    <span className="block text-[7.5px] sm:text-[8.5px] font-mono tracking-wider text-[#B99552]/75 mt-1">
                      [ NHẤP ĐỂ LẬT TRANG SÁCH ]
                    </span>
                  </div>

                  {/* Realistic gilded paper stack on right edge */}
                  <div className="absolute right-0 inset-y-1 w-1 bg-gradient-to-r from-[#F5EEDF] to-[#E6DAC3] rounded-r pointer-events-none opacity-80" />
                </div>

                {/* ----------------------------------------------------------- */}
                {/* FACE B: MẶT TRONG BÌA - TRANG VISA BÊN TRÁI (Left Page)     */}
                {/* ----------------------------------------------------------- */}
                <div
                  className="absolute inset-0 rounded-l-xl bg-[#FCFAF5] text-[#41372F] p-3 sm:p-5 flex flex-col justify-between border-y border-l border-[#B99552]/40 shadow-[inset_-15px_0_20px_rgba(0,0,0,0.08)] overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Guilloché pattern */}
                  <div className="absolute inset-0 opacity-[0.14] pointer-events-none bg-[radial-gradient(#B99552_1px,transparent_1px)] [background-size:8px_8px]" />

                  {/* Header */}
                  <div className="relative z-10 text-center border-b border-[#B99552]/30 pb-1.5">
                    <div className="w-7 h-7 rounded-full border border-[#B99552] bg-[#651F2A] mx-auto flex items-center justify-center text-[#B99552] shadow-xs mb-1">
                      <Heart className="w-3.5 h-3.5 fill-[#B99552]" />
                    </div>
                    <div className="font-serif-title text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#651F2A]">
                      OFFICIAL LOVE VISA
                    </div>
                    <div className="text-[6.5px] sm:text-[7.5px] font-mono text-neutral-500 uppercase tracking-widest">
                      ENTRY PERMIT: DESTINATION FOREVER
                    </div>
                  </div>

                  {/* Visa Entry Data Grid */}
                  <div className="relative z-10 bg-[#F5EEDF]/85 rounded-lg p-2 sm:p-2.5 border border-[#B99552]/30 text-[7.5px] sm:text-[8.5px] font-mono space-y-1 my-auto leading-tight">
                    <div className="flex justify-between border-b border-[#B99552]/20 pb-0.5">
                      <span className="text-neutral-500">BEARERS:</span>
                      <strong className="text-[#172A3A] truncate">
                        {groomName} &amp; {brideName}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-[#B99552]/20 pb-0.5">
                      <span className="text-neutral-500">WEDDING DATE:</span>
                      <strong className="text-[#651F2A]">{weddingDate}</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#B99552]/20 pb-0.5">
                      <span className="text-neutral-500">PORT OF ENTRY:</span>
                      <strong className="text-[#172A3A]">REP. OF LOVE</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">VALIDITY:</span>
                      <strong className="text-[#B99552]">LIFETIME HAPPINESS</strong>
                    </div>
                  </div>

                  {/* Red Visa Stamp */}
                  <div className="relative z-10 text-center py-0.5">
                    {stampLanded && (
                      <motion.div
                        initial={{ scale: 2.2, opacity: 0, rotate: 25 }}
                        animate={{ scale: 1, opacity: 0.95, rotate: -7 }}
                        transition={{
                          type: 'spring',
                          damping: 14,
                          stiffness: 260,
                        }}
                        className="inline-block"
                      >
                        <PassportStamp
                          text="PASSPORT VERIFIED"
                          subtext="IMMIGRATION DEPT"
                          date={weddingDate}
                          variant="red"
                          size="sm"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Footer note */}
                  <div className="relative z-10 text-[6.5px] font-mono text-center text-neutral-400 border-t border-[#B99552]/30 pt-1">
                    GIÁ TRỊ VĨNH CỬU KỂ TỪ NGÀY KÝ
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ================================================================= */}
          {/* BOTTOM CONTROLS BAR (Appears cleanly without overlapping)          */}
          {/* ================================================================= */}
          <div className="relative z-50 w-full max-w-md flex items-center justify-center gap-2.5 pb-16 sm:pb-4 pointer-events-auto px-2">
            {isOpen ? (
              <>
                <button
                  type="button"
                  onClick={handleToggleBook}
                  className="py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 border border-[#B99552]/50 text-[#F5EEDF] font-mono text-[11px] font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-sm shadow-md whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#B99552] shrink-0" />
                  <span>GẬP HỘ CHIẾU</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishAndEnter}
                  className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#651F2A] via-[#8E2835] to-[#651F2A] hover:brightness-110 text-white font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>KHÁM PHÁ HÀNH TRÌNH</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </>
            ) : (
              <div
                onClick={handleToggleBook}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B99552]/15 border border-[#B99552]/30 text-[#F5EEDF] text-[11px] font-mono tracking-wider cursor-pointer hover:bg-[#B99552]/25 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B99552]" />
                <span>Chạm để mở cuốn hộ chiếu</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
