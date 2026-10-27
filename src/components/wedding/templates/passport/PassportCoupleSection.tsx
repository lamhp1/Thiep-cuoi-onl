import React from 'react';
import { motion } from 'motion/react';
import { CouplePerson } from '../../../../types';
import { Heart, Compass, Phone, Facebook, Instagram } from 'lucide-react';

interface PassportCoupleSectionProps {
  groom?: CouplePerson;
  bride?: CouplePerson;
  groomName?: string;
  brideName?: string;
}

export function PassportCoupleSection({
  groom,
  bride,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: PassportCoupleSectionProps) {
  const gName = groom?.fullName || groom?.name || groomName;
  const bName = bride?.fullName || bride?.name || brideName;

  return (
    <section id="couple" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B99552]/15 border border-[#B99552]/30 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Compass className="w-3.5 h-3.5 text-[#B99552]" />
            <span>PRIMARY TRAVELERS</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            TRAVEL COMPANIONS
          </h2>

          <div className="flex items-center justify-center gap-3 text-lg sm:text-xl font-serif-title text-[#172A3A] font-bold">
            <span>{gName}</span>
            <Heart className="w-5 h-5 text-[#651F2A] fill-[#651F2A] shrink-0" />
            <span>{bName}</span>
          </div>

          <p className="font-serif-title italic text-base sm:text-lg text-[#B99552] max-w-xl mx-auto">
            "Together is our favorite destination."
          </p>
          <p className="text-xs font-sans text-neutral-500 uppercase tracking-widest">
            Hành trình vạn dặm bắt đầu từ khoảnh khắc ta cùng bước đi
          </p>
        </div>

        {/* Two Travel Companions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Groom Companion Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-8 border border-[#B99552]/30 shadow-lg relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Passport Tag */}
            <div className="flex items-center justify-between border-b border-[#B99552]/20 pb-3 mb-6">
              <span className="text-[10px] font-mono tracking-widest text-[#651F2A] font-bold uppercase">
                COMPANION 01 • GROOM
              </span>
              <span className="text-[10px] font-mono text-neutral-400">SEAT: 01A</span>
            </div>

            <div className="space-y-4">
              <div className="relative w-40 h-52 sm:w-48 sm:h-60 mx-auto rounded-2xl overflow-hidden border-2 border-[#B99552]/40 shadow-md">
                <img
                  src={
                    groom?.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85'
                  }
                  alt={gName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white">
                  TÂN LANG
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-serif-title text-2xl font-bold text-[#172A3A]">
                  {gName}
                </h3>
                <p className="text-xs font-sans text-[#651F2A] font-semibold tracking-wider uppercase">
                  CHÚ RỂ
                </p>
              </div>

              {groom?.bio && (
                <p className="text-sm font-sans text-[#41372F] text-center leading-relaxed italic px-2">
                  "{groom.bio}"
                </p>
              )}

              {/* Parents information if present */}
              {groom?.parents && (groom.parents.father || groom.parents.mother) && (
                <div className="bg-[#F5EEDF]/60 p-3 rounded-xl border border-[#B99552]/20 text-center font-serif-title text-xs space-y-0.5">
                  <span className="text-[10px] font-sans text-neutral-500 uppercase tracking-widest block">
                    GIA ĐÌNH NHÀ TRAI
                  </span>
                  {groom.parents.father && (
                    <div className="text-[#41372F]">Thân phụ: <strong className="text-[#172A3A]">{groom.parents.father}</strong></div>
                  )}
                  {groom.parents.mother && (
                    <div className="text-[#41372F]">Thân mẫu: <strong className="text-[#172A3A]">{groom.parents.mother}</strong></div>
                  )}
                </div>
              )}
            </div>

            {/* Social / Phone Contact */}
            {groom?.socials && (groom.socials.phone || groom.socials.facebook || groom.socials.instagram) && (
              <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-[#B99552]/20 text-[#651F2A]">
                {groom.socials.phone && (
                  <a href={`tel:${groom.socials.phone}`} className="p-2 rounded-full hover:bg-[#651F2A]/10 transition-colors" title="Gọi điện">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {groom.socials.facebook && (
                  <a href={groom.socials.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-[#651F2A]/10 transition-colors" title="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {groom.socials.instagram && (
                  <a href={groom.socials.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-[#651F2A]/10 transition-colors" title="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* Bride Companion Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-8 border border-[#B99552]/30 shadow-lg relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Passport Tag */}
            <div className="flex items-center justify-between border-b border-[#B99552]/20 pb-3 mb-6">
              <span className="text-[10px] font-mono tracking-widest text-[#651F2A] font-bold uppercase">
                COMPANION 02 • BRIDE
              </span>
              <span className="text-[10px] font-mono text-neutral-400">SEAT: 01B</span>
            </div>

            <div className="space-y-4">
              <div className="relative w-40 h-52 sm:w-48 sm:h-60 mx-auto rounded-2xl overflow-hidden border-2 border-[#B99552]/40 shadow-md">
                <img
                  src={
                    bride?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85'
                  }
                  alt={bName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white">
                  TÂN NƯƠNG
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-serif-title text-2xl font-bold text-[#172A3A]">
                  {bName}
                </h3>
                <p className="text-xs font-sans text-[#651F2A] font-semibold tracking-wider uppercase">
                  CÔ DÂU
                </p>
              </div>

              {bride?.bio && (
                <p className="text-sm font-sans text-[#41372F] text-center leading-relaxed italic px-2">
                  "{bride.bio}"
                </p>
              )}

              {/* Parents information if present */}
              {bride?.parents && (bride.parents.father || bride.parents.mother) && (
                <div className="bg-[#F5EEDF]/60 p-3 rounded-xl border border-[#B99552]/20 text-center font-serif-title text-xs space-y-0.5">
                  <span className="text-[10px] font-sans text-neutral-500 uppercase tracking-widest block">
                    GIA ĐÌNH NHÀ GÁI
                  </span>
                  {bride.parents.father && (
                    <div className="text-[#41372F]">Thân phụ: <strong className="text-[#172A3A]">{bride.parents.father}</strong></div>
                  )}
                  {bride.parents.mother && (
                    <div className="text-[#41372F]">Thân mẫu: <strong className="text-[#172A3A]">{bride.parents.mother}</strong></div>
                  )}
                </div>
              )}
            </div>

            {/* Social / Phone Contact */}
            {bride?.socials && (bride.socials.phone || bride.socials.facebook || bride.socials.instagram) && (
              <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t border-[#B99552]/20 text-[#651F2A]">
                {bride.socials.phone && (
                  <a href={`tel:${bride.socials.phone}`} className="p-2 rounded-full hover:bg-[#651F2A]/10 transition-colors" title="Gọi điện">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {bride.socials.facebook && (
                  <a href={bride.socials.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-[#651F2A]/10 transition-colors" title="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {bride.socials.instagram && (
                  <a href={bride.socials.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-[#651F2A]/10 transition-colors" title="Instagram">
                    <Instagram className="w-4 h-4" />
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
