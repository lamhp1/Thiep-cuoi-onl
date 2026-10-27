import React from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '../../../types';
import {
  FloralHeaderDecoration,
  FloralHeroLeft,
  FloralHeroRight,
  FloralDivider,
} from './FloralOrnaments';
import { CoupleNamesStacked } from '../common/CoupleNamesStacked';

interface FloralHeroSectionProps {
  data: WeddingData;
  formattedDate: string;
}

export function FloralHeroSection({ data, formattedDate }: FloralHeroSectionProps) {
  // Use portrait/cover image or bride/groom portrait
  const portraitPhoto =
    data.coverImage ||
    data.gallery[0]?.url ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';

  // Short romantic names: e.g. "ANH & NGỌC"
  const shortGroom = data.groom.name.toUpperCase();
  const shortBride = data.bride.name.toUpperCase();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#FFFDFD] via-[#FDF5F6] to-[#FFFBFB]">
      {/* Background Soft Champagne & Pastel Pink radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] bg-gradient-to-r from-[#FCECEF]/60 via-[#F8EAE4]/50 to-[#F6EDE0]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Gold Border Corners around Hero */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#D4AF37]/50 hidden sm:block pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#D4AF37]/50 hidden sm:block pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#D4AF37]/50 hidden sm:block pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#D4AF37]/50 hidden sm:block pointer-events-none" />

      {/* Left Floral Arrangement - Slides in from left when appearing */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block max-w-[240px] lg:max-w-[320px] pointer-events-none"
      >
        <FloralHeroLeft className="w-full h-auto" />
      </motion.div>

      {/* Right Floral Arrangement - Slides in from right when appearing */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block max-w-[240px] lg:max-w-[320px] pointer-events-none"
      >
        <FloralHeroRight className="w-full h-auto" />
      </motion.div>

      {/* Hero Center Column Container */}
      <div className="relative z-20 max-w-xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-5">
        {/* 1. Floral decoration (Top Crest) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <FloralHeaderDecoration className="w-48 sm:w-56 h-14 sm:h-16" />
        </motion.div>

        {/* 2. SAVE THE DATE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="space-y-1"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-[#C9A86A] uppercase font-body block">
            SAVE THE DATE
          </span>
        </motion.div>

        {/* 3. ANH & NGỌC (Couple Names: 3-row layout Groom / Heart / Bride) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="w-full max-w-xl mx-auto px-4"
        >
          <CoupleNamesStacked
            groomName={data.groomName || shortGroom}
            brideName={data.brideName || shortBride}
            variant="hero"
            textColor="#3E2E31"
            heartColor="#D97D8A"
            groomClassName="italic font-normal"
            brideClassName="italic font-normal"
            idPrefix="floral-hero"
          />
        </motion.div>

        {/* 4. 20.12.2026 (Wedding Date) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex items-center justify-center gap-3"
        >
          <span className="h-[1px] w-8 bg-[#D4AF37]/50" />
          <span className="text-base sm:text-lg font-serif-title tracking-[0.2em] text-[#D97D8A] font-medium">
            {formattedDate}
          </span>
          <span className="h-[1px] w-8 bg-[#D4AF37]/50" />
        </motion.div>

        {/* 5. [ẢNH DỌC] - Hero vertical portrait photo with scale 0.95 -> 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-2 group"
        >
          {/* Subtle floral mobile accents visible on small screens */}
          <div className="md:hidden absolute -top-8 -left-6 w-20 h-20 pointer-events-none opacity-80">
            <FloralHeroLeft className="w-full h-auto" />
          </div>
          <div className="md:hidden absolute -bottom-8 -right-6 w-20 h-20 pointer-events-none opacity-80">
            <FloralHeroRight className="w-full h-auto" />
          </div>

          {/* Outer elegant gold double frame */}
          <div className="relative p-2.5 sm:p-3 rounded-[32px] bg-gradient-to-b from-[#FFF0F3] via-white to-[#F9EFE7] shadow-xl border border-[#F2DCDD]">
            {/* Fine gold outline inside */}
            <div className="relative overflow-hidden rounded-[24px] border border-[#D4AF37]/40 w-[270px] sm:w-[320px] md:w-[350px] aspect-[3/4.2]">
              <img
                src={portraitPhoto}
                alt={`${data.groomName} & ${data.brideName}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Inner soft golden vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* 6. With love, forever */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-2 space-y-2"
        >
          <p className="font-script text-3xl sm:text-4xl text-[#D97D8A] select-none">
            With love, forever
          </p>
          <p className="text-xs text-[#8C767A] font-body tracking-wider">
            {data.city ? `Hôn lễ tổ chức tại ${data.city}` : 'Trân trọng kính mời quý khách'}
          </p>
        </motion.div>
      </div>

      {/* Down arrow indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-10 animate-bounce text-[#D97D8A]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 10L12 15L17 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
