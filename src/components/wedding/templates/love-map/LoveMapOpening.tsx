import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Compass, Navigation } from 'lucide-react';
import { CompassRose, LoveMapPaperTexture } from './LoveMapOrnaments';
import { PersonalizedWaxSealBadge } from '../../common/PersonalizedWaxSealBadge';

interface LoveMapOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate?: string;
  onStartJourney: () => void;
}

export function LoveMapOpening({
  groomName,
  brideName,
  weddingDate = '20.12.2026',
  onStartJourney,
}: LoveMapOpeningProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClickStart = () => {
    setIsExiting(true);
    setTimeout(() => {
      onStartJourney();
    }, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        id="love-map-opening-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: isExiting ? 1.08 : 1 }}
        exit={{ opacity: 0, scale: 1.12, filter: 'blur(4px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5EFE3] text-[#443B35] px-4 overflow-hidden select-none"
      >
        {/* Paper texture overlay */}
        <LoveMapPaperTexture />

        {/* Vintage Topographic Background Contour lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M-50,150 Q200,80 400,220 T850,180"
            fill="none"
            stroke="#B9985A"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M-50,300 Q150,220 400,380 T850,320"
            fill="none"
            stroke="#722238"
            strokeWidth="1"
            strokeDasharray="6 3"
          />
          <path
            d="M-50,450 Q250,380 450,520 T850,480"
            fill="none"
            stroke="#53665A"
            strokeWidth="1.2"
          />
          <circle cx="400" cy="300" r="180" fill="none" stroke="#B9985A" strokeWidth="0.8" opacity="0.4" />
          <circle cx="400" cy="300" r="260" fill="none" stroke="#B9985A" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        </svg>

        {/* Floating Antique Compass in Corner */}
        <motion.div
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ opacity: 0.4, rotate: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute top-6 right-6 hidden sm:block pointer-events-none"
        >
          <CompassRose className="w-20 h-20" rotate={15} />
        </motion.div>

        {/* Central Opening Card */}
        <div className="relative z-20 max-w-lg w-full flex flex-col items-center text-center p-6 sm:p-10 rounded-3xl bg-[#FFFDF9]/90 border border-[#B9985A]/40 shadow-2xl backdrop-blur-sm">
          {/* Step 1: Subtitle Label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 mb-3 text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold text-[#722238]"
          >
            <span className="w-6 h-[1px] bg-[#722238]/40" />
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>OUR LOVE JOURNEY</span>
            <span className="w-6 h-[1px] bg-[#722238]/40" />
          </motion.div>

          {/* Step 2: Minimalist Animated Route Line: ● ─ ─ ─ ─ ─ ♥ */}
          <div className="w-full max-w-xs my-4 h-12 flex items-center justify-center">
            <svg
              className="w-full h-12 overflow-visible"
              viewBox="0 0 260 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Origin Marker */}
              <motion.circle
                cx="20"
                cy="20"
                r="6"
                fill="#722238"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
              <motion.circle
                cx="20"
                cy="20"
                r="10"
                stroke="#722238"
                strokeWidth="1.5"
                fill="none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ delay: 0.6, duration: 2, repeat: Infinity }}
              />

              {/* Animated Dashed Route Line */}
              <motion.path
                d="M26,20 C80,6 170,34 230,20"
                stroke="#B9985A"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 1.2, ease: 'easeInOut' }}
              />

              {/* Destination Heart Marker */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5, type: 'spring', stiffness: 200 }}
              >
                <circle cx="236" cy="20" r="12" fill="#722238" />
                <path
                  d="M236 15 C233 11 228 14 231 18 L236 23 L241 18 C244 14 239 11 236 15 Z"
                  fill="#FFFDF9"
                />
              </motion.g>
            </svg>
          </div>

          {/* Step 3: Couple Names */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="space-y-1 mb-3"
          >
            <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#443B35]">
              {groomName}
            </h1>
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="w-8 h-[1px] bg-[#B9985A]/50" />
              <span className="font-serif italic text-lg sm:text-xl text-[#722238] font-normal">&amp;</span>
              <span className="w-8 h-[1px] bg-[#B9985A]/50" />
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#443B35]">
              {brideName}
            </h1>

            {/* Gold Inscribed Guest Invitation */}
            <PersonalizedWaxSealBadge theme="gold" className="my-2" />
          </motion.div>

          {/* Journey Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-xs sm:text-sm text-[#443B35]/75 max-w-sm mb-6 font-body leading-relaxed"
          >
            Mỗi cuộc gặp gỡ là một tọa độ định mệnh. Kính mời quý khách bước vào hành trình tình yêu của chúng mình.
          </motion.p>

          {/* Wedding Date stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EFE3] border border-[#B9985A]/50 text-[11px] font-semibold text-[#722238] tracking-widest uppercase mb-6"
          >
            <span>DESTINATION DATE</span>
            <span>•</span>
            <span className="font-serif font-bold text-xs">{weddingDate}</span>
          </motion.div>

          {/* Step 4: START THE JOURNEY button */}
          <motion.button
            id="start-journey-button"
            onClick={handleClickStart}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(114, 34, 56, 0.25)' }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#722238] hover:bg-[#5c1a2c] text-[#FFFDF9] font-medium text-sm tracking-wider uppercase shadow-xl transition-all duration-300 cursor-pointer border border-[#B9985A]/40"
          >
            <Navigation className="w-4 h-4 text-[#B9985A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>BẮT ĐẦU HÀNH TRÌNH</span>
            <Heart className="w-3.5 h-3.5 fill-[#B9985A] text-[#B9985A]" />
          </motion.button>

          <span className="text-[10px] text-[#443B35]/50 mt-4 tracking-wider uppercase font-medium">
            Click để mở bản đồ
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
