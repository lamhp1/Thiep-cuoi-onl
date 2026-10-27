import React from 'react';
import { motion } from 'motion/react';
import { CouplePerson } from '../../../../types';
import { Heart, Compass, MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import { StampBorder, LovePostalStamp } from './LoveMapOrnaments';

interface LoveMapCoupleSectionProps {
  groom: CouplePerson;
  bride: CouplePerson;
  weddingDate?: string;
}

export function LoveMapCoupleSection({
  groom,
  bride,
  weddingDate = '20.12.2026',
}: LoveMapCoupleSectionProps) {
  return (
    <section
      id="couple"
      className="relative py-20 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      {/* Topographic background contours */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-15"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 C300,50 600,250 1000,120"
          fill="none"
          stroke="#B9985A"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M0,350 C400,200 500,450 1000,320"
          fill="none"
          stroke="#722238"
          strokeWidth="1"
          strokeDasharray="6 3"
        />
      </svg>

      <div className="relative z-20 max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#722238]">
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>ORIGIN OF OUR STORY</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#443B35]">
            TWO PEOPLE, ONE JOURNEY
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/80 font-body leading-relaxed">
            Hai con người từ hai tọa độ khác nhau, qua những ngã rẽ cuộc đời, đã gặp gỡ và cùng viết nên một lộ trình hạnh phúc vĩnh cửu.
          </p>
        </div>

        {/* The Two Origins: Groom & Bride connected by a line */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Central Connecting Route Line on Desktop */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex-col items-center pointer-events-none">
            <div className="relative flex items-center justify-center w-32">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] border-t-2 border-dashed border-[#B9985A]" />
              <div className="relative z-10 w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#B9985A] shadow-md flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#722238] fill-[#722238]" />
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-[#722238] mt-2 bg-[#FFFDF9] px-2.5 py-0.5 rounded-full border border-[#B9985A]/40 shadow-xs whitespace-nowrap">
              TƯƠNG NGỘ
            </span>
          </div>

          {/* GROOM CARD - POINT OF ORIGIN A */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#B9985A]/40 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all"
          >
            {/* Stamp Tag in top right */}
            <div className="absolute top-4 right-4">
              <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-[#F5EFE3] text-[#722238] border border-[#B9985A]/40">
                POINT A • CHÚ RỂ
              </span>
            </div>

            {/* Groom Photo in Postcard Mat */}
            <div className="relative w-48 h-56 sm:w-56 sm:h-64 mx-auto mb-6 p-2.5 bg-[#FFFDF9] rounded-2xl border border-[#B9985A]/30 shadow-md transform group-hover:rotate-1 transition-transform">
              <img
                src={groom.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80'}
                alt={groom.fullName}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
              <div className="absolute -bottom-2 -left-2 bg-[#722238] text-[#FFFDF9] text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                THE GROOM
              </div>
            </div>

            {/* Groom Details */}
            <div className="text-center space-y-2 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title text-2xl font-bold text-[#443B35]">
                  {groom.fullName || groom.name}
                </h3>
                <p className="text-xs uppercase tracking-widest font-semibold text-[#B9985A]">
                  Tọa độ chú rể
                </p>
                <div className="w-10 h-[1px] bg-[#B9985A]/40 mx-auto my-3" />
                <p className="text-xs sm:text-sm text-[#443B35]/75 font-body leading-relaxed line-clamp-4">
                  {groom.bio || 'Chàng trai luôn vững chãi, yêu thích những chuyến phiêu lưu và đã tìm thấy bến đỗ bình yên nhất bên cạnh cô dâu.'}
                </p>
              </div>

              {/* Parents info if available */}
              {groom.parents && (
                <div className="pt-4 border-t border-[#B9985A]/20 text-[11px] text-[#443B35]/70 space-y-0.5">
                  <p className="font-semibold text-[#722238]">Quý Nam Của:</p>
                  <p>Ông: {groom.parents.father}</p>
                  <p>Bà: {groom.parents.mother}</p>
                </div>
              )}

              {/* Social / Contact */}
              {groom.socials && (
                <div className="flex items-center justify-center gap-3 pt-3">
                  {groom.socials.phone && (
                    <a
                      href={`tel:${groom.socials.phone}`}
                      className="p-2 rounded-full bg-[#F5EFE3] hover:bg-[#B9985A]/20 text-[#722238] transition-colors"
                      title="Gọi điện"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {groom.socials.facebook && (
                    <a
                      href={groom.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-[#F5EFE3] hover:bg-[#B9985A]/20 text-[#722238] transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* BRIDE CARD - POINT OF ORIGIN B */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#B9985A]/40 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all"
          >
            {/* Stamp Tag in top right */}
            <div className="absolute top-4 right-4">
              <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-[#F5EFE3] text-[#722238] border border-[#B9985A]/40">
                POINT B • CÔ DÂU
              </span>
            </div>

            {/* Bride Photo in Postcard Mat */}
            <div className="relative w-48 h-56 sm:w-56 sm:h-64 mx-auto mb-6 p-2.5 bg-[#FFFDF9] rounded-2xl border border-[#B9985A]/30 shadow-md transform group-hover:-rotate-1 transition-transform">
              <img
                src={bride.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={bride.fullName}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#53665A] text-[#FFFDF9] text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                THE BRIDE
              </div>
            </div>

            {/* Bride Details */}
            <div className="text-center space-y-2 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-serif-title text-2xl font-bold text-[#443B35]">
                  {bride.fullName || bride.name}
                </h3>
                <p className="text-xs uppercase tracking-widest font-semibold text-[#B9985A]">
                  Tọa độ cô dâu
                </p>
                <div className="w-10 h-[1px] bg-[#B9985A]/40 mx-auto my-3" />
                <p className="text-xs sm:text-sm text-[#443B35]/75 font-body leading-relaxed line-clamp-4">
                  {bride.bio || 'Cô gái dịu dàng, nụ cười rạng rỡ như ánh mai. Mang đến cho chú rể một tình yêu chân thành và niềm tin về một tổ ấm ngọt ngào.'}
                </p>
              </div>

              {/* Parents info if available */}
              {bride.parents && (
                <div className="pt-4 border-t border-[#B9985A]/20 text-[11px] text-[#443B35]/70 space-y-0.5">
                  <p className="font-semibold text-[#722238]">Ái Nữ Của:</p>
                  <p>Ông: {bride.parents.father}</p>
                  <p>Bà: {bride.parents.mother}</p>
                </div>
              )}

              {/* Social / Contact */}
              {bride.socials && (
                <div className="flex items-center justify-center gap-3 pt-3">
                  {bride.socials.phone && (
                    <a
                      href={`tel:${bride.socials.phone}`}
                      className="p-2 rounded-full bg-[#F5EFE3] hover:bg-[#B9985A]/20 text-[#722238] transition-colors"
                      title="Gọi điện"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {bride.socials.facebook && (
                    <a
                      href={bride.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-[#F5EFE3] hover:bg-[#B9985A]/20 text-[#722238] transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
