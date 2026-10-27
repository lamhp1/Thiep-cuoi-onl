import React from 'react';
import { motion } from 'motion/react';
import { PassportStamp } from './PassportOrnaments';
import { Heart, Compass, Plane, Sparkles } from 'lucide-react';

interface PassportFinalDestinationProps {
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  coverImage?: string;
  onReopenPassport?: () => void;
}

export function PassportFinalDestination({
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
  weddingDate = '20.12.2026',
  coverImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
  onReopenPassport,
}: PassportFinalDestinationProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EEDF] via-[#3D1219] to-[#1A060A] text-[#FCFAF5] pt-20 pb-28 px-4 sm:px-6">
      {/* Background Vignette and Star Glow */}
      <div className="max-w-4xl mx-auto space-y-16 relative z-10 text-center">
        {/* Section Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B99552]/20 border border-[#B99552]/40 text-[#B99552] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>FINAL FLIGHT DESTINATION</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-[#FCFAF5] uppercase">
            OUR FINAL DESTINATION
          </h2>

          <div className="font-serif-title text-2xl sm:text-4xl italic text-[#B99552] font-semibold">
            FOREVER &amp; BEYOND
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#F5EEDF]/80 max-w-lg mx-auto leading-relaxed">
            Hành trình tuyệt vời nhất không phải là đi bao xa, mà là mỗi chặng đường đều có người ấy kề bên.
          </p>
        </div>

        {/* Hero Romantic Couple Photo with Gold Passport Frame */}
        <div className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-[#B99552]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-[16/10] sm:aspect-[16/9]">
          <img
            src={coverImage}
            alt={`${groomName} & ${brideName}`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          <div className="absolute bottom-6 inset-x-6 text-center space-y-1">
            <div className="font-serif-title text-2xl sm:text-3xl font-bold text-white tracking-widest drop-shadow-md">
              {groomName} &amp; {brideName}
            </div>
            <div className="font-mono text-xs text-[#B99552] tracking-widest uppercase">
              DEPARTURE • {weddingDate}
            </div>
          </div>
        </div>

        {/* Slamming Stamp Animation: JOURNEY COMPLETE */}
        <div className="pt-2">
          <motion.div
            initial={{ scale: 1.8, opacity: 0, rotate: 18 }}
            whileInView={{ scale: 1, opacity: 0.95, rotate: -5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="inline-block"
          >
            <PassportStamp
              text="JOURNEY COMPLETE"
              subtext="OFFICIAL IMMIGRATION"
              date={weddingDate}
              variant="gold"
              size="lg"
            />
          </motion.div>
        </div>

        {/* Back Page Passport Seal */}
        <div className="pt-12 border-t border-[#B99552]/30 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full border border-[#B99552]/60 bg-[#651F2A] mx-auto flex items-center justify-center text-[#B99552] shadow-md">
            <Heart className="w-6 h-6 fill-[#B99552]" />
          </div>

          <div className="space-y-1">
            <div className="font-serif-title text-lg font-bold tracking-widest text-[#FCFAF5] uppercase">
              LOVE PASSPORT
            </div>
            <div className="text-[10px] font-mono tracking-[0.2em] text-[#B99552] uppercase">
              FOREVER &amp; ALWAYS • REPUBLIC OF LOVE
            </div>
          </div>

          {onReopenPassport && (
            <div className="pt-4">
              <button
                type="button"
                onClick={onReopenPassport}
                className="px-5 py-2 rounded-full border border-[#B99552]/40 text-[#B99552] hover:bg-[#B99552]/20 font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                ↻ Đóng bìa &amp; Xem lại mở hộ chiếu
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
