import React from 'react';
import { motion } from 'motion/react';
import { Heart, Facebook, Instagram, Phone } from 'lucide-react';
import { CouplePerson } from '../../types';

interface CoupleSectionProps {
  groom: CouplePerson;
  bride: CouplePerson;
}

export function CoupleSection({ groom, bride }: CoupleSectionProps) {
  return (
    <section id="couple" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 sm:mb-20"
      >
        <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] mb-1">
          Cô Dâu & Chú Rể
        </p>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C2A29] tracking-wide uppercase">
          The Bride & Groom
        </h2>
        <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
      </motion.div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-10 md:gap-16 lg:gap-24 relative items-stretch">
        {/* Center Intertwined Heart Badge for Desktop */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#D4AF37]/40 items-center justify-center text-[#D4AF37] shadow-lg">
          <Heart className="w-5 h-5 fill-current" />
        </div>

        {/* Groom Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center p-3.5 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-sm border border-[#D4AF37]/25 shadow-md hover:shadow-xl transition-all text-center"
        >
          {/* Avatar with luxury golden double ring */}
          <div className="relative mb-3 sm:mb-6">
            <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full p-1 sm:p-1.5 border-2 border-[#D4AF37]/60 group-hover:border-[#D4AF37] transition-colors">
              <img
                src={groom.avatar}
                alt={groom.fullName}
                className="w-full h-full object-cover object-top rounded-full shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-[9px] sm:text-[11px] font-body uppercase tracking-wider sm:tracking-widest px-2.5 py-0.5 sm:px-4 sm:py-1 rounded-full shadow-md font-semibold whitespace-nowrap">
              Chú Rể
            </span>
          </div>

          <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-medium text-[#2C2A29] leading-tight">
            {groom.fullName}
          </h3>

          {/* Parents info */}
          {groom.parents && (
            <div className="my-1.5 sm:my-2 text-[10px] sm:text-xs font-body text-neutral-500 italic leading-snug break-words max-w-full">
              Con ông: <span className="font-medium text-neutral-700">{groom.parents.father}</span> & bà <span className="font-medium text-neutral-700">{groom.parents.mother}</span>
            </div>
          )}

          <p className="mt-2 sm:mt-4 text-[10.5px] sm:text-sm font-body text-neutral-600 leading-relaxed max-w-sm flex-1 line-clamp-4 sm:line-clamp-none">
            {groom.bio}
          </p>

          {/* Socials */}
          <div className="mt-3 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
            {groom.socials?.facebook && (
              <a
                href={groom.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 sm:p-2.5 rounded-full bg-[#FDFBF7] text-neutral-600 hover:text-[#D4AF37] hover:bg-neutral-100 transition-colors border border-neutral-200"
                aria-label="Facebook Chú rể"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {groom.socials?.instagram && (
              <a
                href={groom.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 sm:p-2.5 rounded-full bg-[#FDFBF7] text-neutral-600 hover:text-[#D4AF37] hover:bg-neutral-100 transition-colors border border-neutral-200"
                aria-label="Instagram Chú rể"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {groom.socials?.phone && (
              <a
                href={`tel:${groom.socials.phone}`}
                className="p-1.5 sm:p-2.5 rounded-full bg-[#FDFBF7] text-neutral-600 hover:text-[#D4AF37] hover:bg-neutral-100 transition-colors border border-neutral-200"
                aria-label="Gọi điện Chú rể"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Bride Profile */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center p-3.5 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl bg-white/70 backdrop-blur-sm border border-[#D4AF37]/25 shadow-md hover:shadow-xl transition-all text-center"
        >
          {/* Avatar */}
          <div className="relative mb-3 sm:mb-6">
            <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full p-1 sm:p-1.5 border-2 border-[#D4AF37]/60 group-hover:border-[#D4AF37] transition-colors">
              <img
                src={bride.avatar}
                alt={bride.fullName}
                className="w-full h-full object-cover object-top rounded-full shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-[9px] sm:text-[11px] font-body uppercase tracking-wider sm:tracking-widest px-2.5 py-0.5 sm:px-4 sm:py-1 rounded-full shadow-md font-semibold whitespace-nowrap">
              Cô Dâu
            </span>
          </div>

          <h3 className="font-serif-title text-sm xs:text-base sm:text-2xl md:text-3xl font-medium text-[#2C2A29] leading-tight">
            {bride.fullName}
          </h3>

          {/* Parents info */}
          {bride.parents && (
            <div className="my-1.5 sm:my-2 text-[10px] sm:text-xs font-body text-neutral-500 italic leading-snug break-words max-w-full">
              Con ông: <span className="font-medium text-neutral-700">{bride.parents.father}</span> & bà <span className="font-medium text-neutral-700">{bride.parents.mother}</span>
            </div>
          )}

          <p className="mt-2 sm:mt-4 text-[10.5px] sm:text-sm font-body text-neutral-600 leading-relaxed max-w-sm flex-1 line-clamp-4 sm:line-clamp-none">
            {bride.bio}
          </p>

          {/* Socials */}
          <div className="mt-3 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
            {bride.socials?.facebook && (
              <a
                href={bride.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 sm:p-2.5 rounded-full bg-[#FDFBF7] text-neutral-600 hover:text-[#D4AF37] hover:bg-neutral-100 transition-colors border border-neutral-200"
                aria-label="Facebook Cô dâu"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {bride.socials?.instagram && (
              <a
                href={bride.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 sm:p-2.5 rounded-full bg-[#FDFBF7] text-neutral-600 hover:text-[#D4AF37] hover:bg-neutral-100 transition-colors border border-neutral-200"
                aria-label="Instagram Cô dâu"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {bride.socials?.phone && (
              <a
                href={`tel:${bride.socials.phone}`}
                className="p-2.5 rounded-full bg-[#FDFBF7] text-neutral-600 hover:text-[#D4AF37] hover:bg-neutral-100 transition-colors border border-neutral-200"
                aria-label="Gọi điện Cô dâu"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
