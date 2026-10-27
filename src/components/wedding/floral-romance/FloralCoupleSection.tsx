import React from 'react';
import { motion } from 'motion/react';
import { CouplePerson } from '../../../types';
import { FloralDivider, FloralHeroLeft, FloralHeroRight } from './FloralOrnaments';
import { Heart, Phone, Instagram, Facebook } from 'lucide-react';

interface FloralCoupleSectionProps {
  groom: CouplePerson;
  bride: CouplePerson;
  romanticQuote?: string;
}

export function FloralCoupleSection({ groom, bride, romanticQuote }: FloralCoupleSectionProps) {
  return (
    <section id="couple" className="relative py-20 sm:py-28 bg-[#FDF8F5] overflow-hidden">
      {/* Background soft pastel blush and champagne washes */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#FDECEF]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#F6EDE0]/70 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative side floral slides */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 0.75, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0 }}
        className="absolute left-0 top-1/3 -translate-y-1/2 w-32 sm:w-44 hidden xl:block pointer-events-none"
      >
        <FloralHeroLeft className="w-full h-auto" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 0.75, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0 }}
        className="absolute right-0 top-1/3 -translate-y-1/2 w-32 sm:w-44 hidden xl:block pointer-events-none"
      >
        <FloralHeroRight className="w-full h-auto" />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-semibold font-body">
            GROOM & BRIDE
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#3E2E31] font-normal italic">
            Cô Dâu & Chú Rể
          </h2>
          <FloralDivider className="w-48 mx-auto my-3" />
          {romanticQuote && (
            <p className="text-sm font-body text-[#7A696B] italic leading-relaxed max-w-xl mx-auto">
              {romanticQuote}
            </p>
          )}
        </motion.div>

        {/* Couple Cards Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 gap-2.5 sm:gap-6 md:gap-8 lg:gap-14 max-w-4xl mx-auto items-stretch">
          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group relative bg-white/90 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 border border-[#F2DCDD] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-2.5 sm:space-y-4 md:space-y-5"
          >
            {/* Fine gold corner brackets */}
            <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 w-2 h-2 sm:w-3 sm:h-3 border-t border-l border-[#D4AF37]/50" />
            <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-2 h-2 sm:w-3 sm:h-3 border-t border-r border-[#D4AF37]/50" />
            <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-2 h-2 sm:w-3 sm:h-3 border-b border-l border-[#D4AF37]/50" />
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 w-2 h-2 sm:w-3 sm:h-3 border-b border-r border-[#D4AF37]/50" />

            {/* Groom Portrait */}
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-1 sm:p-1.5 md:p-2 rounded-full bg-gradient-to-tr from-[#FCE4EC] via-white to-[#F9EFE7] border border-[#D4AF37]/40 shadow-md"
            >
              <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden">
                <img
                  src={groom.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                  alt={groom.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Role & Name */}
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-[#C9A86A] uppercase font-body">
                CHÚ RỂ
              </span>
              <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl text-[#3E2E31] font-medium leading-tight">
                {groom.fullName}
              </h3>
            </div>

            {/* Parents */}
            {groom.parents && (
              <div className="text-[9.5px] sm:text-xs text-[#8C767A] space-y-0.5 border-t border-b border-[#F2DCDD] py-1.5 sm:py-3 w-full">
                <p className="font-medium text-[#5A4549]">Trưởng Nam của:</p>
                <p className="break-words leading-snug">{groom.parents.father}</p>
                <p className="break-words leading-snug">{groom.parents.mother}</p>
              </div>
            )}

            {/* Bio */}
            <p className="text-[10.5px] sm:text-xs md:text-sm text-[#7A696B] leading-relaxed font-body line-clamp-4 sm:line-clamp-none flex-1">
              {groom.bio}
            </p>

            {/* Socials */}
            {groom.socials && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-3 pt-1 sm:pt-2 flex-wrap">
                {groom.socials.facebook && (
                  <a
                    href={groom.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FDF0F3] text-[#D97D8A] hover:bg-[#D97D8A] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
                {groom.socials.instagram && (
                  <a
                    href={groom.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FDF0F3] text-[#D97D8A] hover:bg-[#D97D8A] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
                {groom.socials.phone && (
                  <a
                    href={`tel:${groom.socials.phone}`}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FDF0F3] text-[#D97D8A] hover:bg-[#D97D8A] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative bg-white/90 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 border border-[#F2DCDD] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-2.5 sm:space-y-4 md:space-y-5"
          >
            {/* Fine gold corner brackets */}
            <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 w-2 h-2 sm:w-3 sm:h-3 border-t border-l border-[#D4AF37]/50" />
            <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-2 h-2 sm:w-3 sm:h-3 border-t border-r border-[#D4AF37]/50" />
            <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-2 h-2 sm:w-3 sm:h-3 border-b border-l border-[#D4AF37]/50" />
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 w-2 h-2 sm:w-3 sm:h-3 border-b border-r border-[#D4AF37]/50" />

            {/* Bride Portrait */}
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-1 sm:p-1.5 md:p-2 rounded-full bg-gradient-to-tr from-[#FCE4EC] via-white to-[#F9EFE7] border border-[#D4AF37]/40 shadow-md"
            >
              <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden">
                <img
                  src={bride.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                  alt={bride.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Role & Name */}
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-[#C9A86A] uppercase font-body">
                CÔ DÂU
              </span>
              <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl text-[#3E2E31] font-medium leading-tight">
                {bride.fullName}
              </h3>
            </div>

            {/* Parents */}
            {bride.parents && (
              <div className="text-[9.5px] sm:text-xs text-[#8C767A] space-y-0.5 border-t border-b border-[#F2DCDD] py-1.5 sm:py-3 w-full">
                <p className="font-medium text-[#5A4549]">Ái Nữ của:</p>
                <p className="break-words leading-snug">{bride.parents.father}</p>
                <p className="break-words leading-snug">{bride.parents.mother}</p>
              </div>
            )}

            {/* Bio */}
            <p className="text-[10.5px] sm:text-xs md:text-sm text-[#7A696B] leading-relaxed font-body line-clamp-4 sm:line-clamp-none flex-1">
              {bride.bio}
            </p>

            {/* Socials */}
            {bride.socials && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-3 pt-1 sm:pt-2 flex-wrap">
                {bride.socials.facebook && (
                  <a
                    href={bride.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FDF0F3] text-[#D97D8A] hover:bg-[#D97D8A] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
                {bride.socials.instagram && (
                  <a
                    href={bride.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FDF0F3] text-[#D97D8A] hover:bg-[#D97D8A] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
                {bride.socials.phone && (
                  <a
                    href={`tel:${bride.socials.phone}`}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FDF0F3] text-[#D97D8A] hover:bg-[#D97D8A] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
