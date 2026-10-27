import React from 'react';
import { motion } from 'motion/react';
import { CouplePerson } from '../../../types';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperFrameCorner,
  TraditionalDivider,
} from './TraditionalOrnaments';
import { Heart, Phone, Facebook, Instagram } from 'lucide-react';

interface TraditionalCoupleSectionProps {
  groom: CouplePerson;
  bride: CouplePerson;
}

export function TraditionalCoupleSection({ groom, bride }: TraditionalCoupleSectionProps) {
  return (
    <section id="couple" className="relative py-20 sm:py-24 bg-[#FBF7EE] text-[#3D1A1E] overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BA1E28]/10 border border-[#BA1E28]/25 text-[#BA1E28] text-xs font-semibold uppercase tracking-widest">
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28]" />
            <span>Tân Lang & Tân Nương</span>
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28] scale-x-[-1]" />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B1119] tracking-wide">
            Đôi Uyên Ương
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#735154] max-w-md mx-auto leading-relaxed">
            Hai mảnh ghép đồng điệu gặp gỡ, cùng xây đắp nên một gia đình nhỏ ngập tràn tiếng cười và tình yêu.
          </p>

          <TraditionalDivider className="mt-4" />
        </div>

        {/* Dual Cards: Groom & Bride */}
        <div className="grid grid-cols-2 gap-3 sm:gap-8 md:gap-12 items-stretch">
          {/* 1. Chú Rể (Tân Lang) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="relative bg-[#FFFDF9] rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 border border-[#D4AF37]/50 shadow-[0_12px_35px_rgba(186,30,40,0.06)] flex flex-col items-center text-center group"
          >
            <PaperFrameCorner position="top-left" className="top-1 left-1 sm:top-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 text-[#D4AF37]" />
            <PaperFrameCorner position="top-right" className="top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 text-[#D4AF37]" />
            <PaperFrameCorner position="bottom-left" className="bottom-1 left-1 sm:bottom-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 text-[#D4AF37]" />
            <PaperFrameCorner position="bottom-right" className="bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 text-[#D4AF37]" />

            {/* Avatar Frame Giấy Mỹ Thuật */}
            <div className="relative w-20 h-28 xs:w-24 xs:h-32 sm:w-44 sm:h-56 md:w-48 md:h-60 rounded-xl sm:rounded-2xl p-1 sm:p-2 bg-[#FAF5EA] border border-[#D4AF37]/40 shadow-sm mb-2.5 sm:mb-5 overflow-hidden">
              <img
                src={groom.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                alt={groom.fullName}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-1 sm:inset-2 border border-white/60 rounded-lg sm:rounded-xl pointer-events-none" />
            </div>

            {/* Badge & Tên */}
            <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
              <span className="inline-block px-2 sm:px-3 py-0.5 rounded-full bg-[#BA1E28] text-white text-[9px] sm:text-[11px] font-bold font-serif-title uppercase tracking-wider sm:tracking-widest whitespace-nowrap">
                Chú Rể • Tân Lang
              </span>
              <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-bold text-[#8B1119] leading-tight">
                {groom.fullName}
              </h3>
            </div>

            {/* Song Thân Phụ Mẫu (Nhà Trai) */}
            {groom.parents && (
              <div className="w-full bg-[#FAF5EA] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-[#EADBBE] mb-2.5 sm:mb-4 text-[9.5px] sm:text-xs font-body text-[#5C3D40] space-y-0.5 sm:space-y-1">
                <p className="font-serif-title font-semibold text-[#8B1119] uppercase tracking-wider text-[9px] sm:text-[11px]">
                  Song Thân Phụ Mẫu
                </p>
                <p className="break-words leading-snug">Thân phụ: <span className="font-semibold text-[#1A1816]">{groom.parents.father}</span></p>
                <p className="break-words leading-snug">Thân mẫu: <span className="font-semibold text-[#1A1816]">{groom.parents.mother}</span></p>
              </div>
            )}

            {/* Bio */}
            <p className="font-body text-[10.5px] sm:text-xs md:text-sm text-[#614749] leading-relaxed line-clamp-3 flex-1">
              {groom.bio}
            </p>
          </motion.div>

          {/* 2. Cô Dâu (Tân Nương) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-[#FFFDF9] rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 border border-[#D4AF37]/50 shadow-[0_12px_35px_rgba(186,30,40,0.06)] flex flex-col items-center text-center group"
          >
            <PaperFrameCorner position="top-left" className="top-1 left-1 sm:top-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 text-[#D4AF37]" />
            <PaperFrameCorner position="top-right" className="top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 text-[#D4AF37]" />
            <PaperFrameCorner position="bottom-left" className="bottom-1 left-1 sm:bottom-2 sm:left-2 w-4 h-4 sm:w-6 sm:h-6 text-[#D4AF37]" />
            <PaperFrameCorner position="bottom-right" className="bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 text-[#D4AF37]" />

            {/* Avatar Frame Giấy Mỹ Thuật */}
            <div className="relative w-20 h-28 xs:w-24 xs:h-32 sm:w-44 sm:h-56 md:w-48 md:h-60 rounded-xl sm:rounded-2xl p-1 sm:p-2 bg-[#FAF5EA] border border-[#D4AF37]/40 shadow-sm mb-2.5 sm:mb-5 overflow-hidden">
              <img
                src={bride.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                alt={bride.fullName}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-1 sm:inset-2 border border-white/60 rounded-lg sm:rounded-xl pointer-events-none" />
            </div>

            {/* Badge & Tên */}
            <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
              <span className="inline-block px-2 sm:px-3 py-0.5 rounded-full bg-[#BA1E28] text-white text-[9px] sm:text-[11px] font-bold font-serif-title uppercase tracking-wider sm:tracking-widest whitespace-nowrap">
                Cô Dâu • Tân Nương
              </span>
              <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-bold text-[#8B1119] leading-tight">
                {bride.fullName}
              </h3>
            </div>

            {/* Song Thân Phụ Mẫu (Nhà Gái) */}
            {bride.parents && (
              <div className="w-full bg-[#FAF5EA] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-[#EADBBE] mb-2.5 sm:mb-4 text-[9.5px] sm:text-xs font-body text-[#5C3D40] space-y-0.5 sm:space-y-1">
                <p className="font-serif-title font-semibold text-[#8B1119] uppercase tracking-wider text-[9px] sm:text-[11px]">
                  Song Thân Phụ Mẫu
                </p>
                <p className="break-words leading-snug">Thân phụ: <span className="font-semibold text-[#1A1816]">{bride.parents.father}</span></p>
                <p className="break-words leading-snug">Thân mẫu: <span className="font-semibold text-[#1A1816]">{bride.parents.mother}</span></p>
              </div>
            )}

            {/* Bio */}
            <p className="font-body text-[10.5px] sm:text-xs md:text-sm text-[#614749] leading-relaxed line-clamp-3 flex-1">
              {bride.bio}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
