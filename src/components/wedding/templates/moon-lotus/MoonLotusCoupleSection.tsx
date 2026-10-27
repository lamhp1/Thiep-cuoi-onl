import React from 'react';
import { CouplePerson } from '../../../../types';
import { Heart, Sparkles, Moon, Facebook, Instagram, Phone } from 'lucide-react';
import { ArtisticBloomingLotus } from './MoonLotusOrnaments';

interface MoonLotusCoupleSectionProps {
  groom: CouplePerson;
  bride: CouplePerson;
}

export function MoonLotusCoupleSection({ groom, bride }: MoonLotusCoupleSectionProps) {
  return (
    <section id="couple" className="relative py-20 px-4 sm:px-6 z-20">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-widest">
            <Moon className="w-3.5 h-3.5 text-[#EBD494]" />
            <span>Đôi Uyên Ương Dưới Trăng</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#FFFDF7]">
            Tân Lang &amp; Tân Nương
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#F4E4BA]/80">
            “Hai người xa lạ gặp gỡ giữa muôn triệu sinh linh, cùng chung nhịp đập dưới một vầng trăng sáng.”
          </p>
        </div>

        {/* Groom and Bride Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* 1. Tân Lang (Chú Rể) */}
          <div className="relative group rounded-3xl p-6 sm:p-8 bg-[#10142E]/80 border border-[#EBD494]/35 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500 hover:border-[#EBD494]/70 flex flex-col items-center text-center">
            {/* Arched Portrait with Crescent Halo */}
            <div className="relative w-48 h-64 sm:w-56 sm:h-72 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#EBD494]/50 shadow-xl mb-6 bg-[#1A0B28]">
              <img
                src={groom.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                alt={groom.fullName || groom.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10142E] via-transparent to-transparent opacity-60" />
            </div>

            {/* Groom Info */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#751A29]/60 border border-[#EBD494]/40 text-[#F4E4BA] text-[11px] font-serif uppercase tracking-widest">
                Chú Rể • Tân Lang
              </span>
              <h3 className="text-2xl font-serif-title font-bold text-[#FFFDF7]">
                {groom.fullName || groom.name}
              </h3>
              <p className="font-serif text-xs text-[#EBD494]/90 tracking-wide">
                Trưởng nam gia đình họ {groom.parents?.father ? groom.parents.father.split(' ')[1] || 'Nguyễn' : 'Nguyễn'}
              </p>
            </div>

            {/* Bio Quote */}
            <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed mt-4 px-2 italic">
              “{groom.bio || 'Luôn kiên nhẫn chở che, hướng về tương lai ngập tràn nụ cười của hai đứa.'}”
            </p>

            {/* Parents' Info */}
            {groom.parents && (groom.parents.father || groom.parents.mother) && (
              <div className="mt-6 pt-4 border-t border-[#EBD494]/20 w-full text-xs font-serif text-[#F4E4BA]/80 space-y-1">
                <p className="font-semibold text-[#EBD494]">Thân Phụ &amp; Thân Mẫu:</p>
                <p>{groom.parents.father} &amp; {groom.parents.mother}</p>
              </div>
            )}

            {/* Social Links */}
            {groom.socials && (
              <div className="flex items-center gap-3 mt-4 text-[#EBD494]/80">
                {groom.socials.facebook && (
                  <a href={groom.socials.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#EBD494] transition-colors">
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                )}
                {groom.socials.instagram && (
                  <a href={groom.socials.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#EBD494] transition-colors">
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                )}
                {groom.socials.phone && (
                  <a href={`tel:${groom.socials.phone}`} className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#EBD494] transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 2. Tân Nương (Cô Dâu) */}
          <div className="relative group rounded-3xl p-6 sm:p-8 bg-[#10142E]/80 border border-[#EBD494]/35 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500 hover:border-[#EBD494]/70 flex flex-col items-center text-center">
            {/* Arched Portrait with Crescent Halo */}
            <div className="relative w-48 h-64 sm:w-56 sm:h-72 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#EBD494]/50 shadow-xl mb-6 bg-[#1A0B28]">
              <img
                src={bride.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                alt={bride.fullName || bride.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10142E] via-transparent to-transparent opacity-60" />
            </div>

            {/* Bride Info */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#751A29]/60 border border-[#EBD494]/40 text-[#F4E4BA] text-[11px] font-serif uppercase tracking-widest">
                Cô Dâu • Tân Nương
              </span>
              <h3 className="text-2xl font-serif-title font-bold text-[#FFFDF7]">
                {bride.fullName || bride.name}
              </h3>
              <p className="font-serif text-xs text-[#EBD494]/90 tracking-wide">
                Út nữ gia đình họ {bride.parents?.father ? bride.parents.father.split(' ')[1] || 'Trần' : 'Trần'}
              </p>
            </div>

            {/* Bio Quote */}
            <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed mt-4 px-2 italic">
              “{bride.bio || 'Yêu những ngày dịu dàng bình yên, yêu từng cái nắm tay ấm áp đi qua bốn mùa.'}”
            </p>

            {/* Parents' Info */}
            {bride.parents && (bride.parents.father || bride.parents.mother) && (
              <div className="mt-6 pt-4 border-t border-[#EBD494]/20 w-full text-xs font-serif text-[#F4E4BA]/80 space-y-1">
                <p className="font-semibold text-[#EBD494]">Thân Phụ &amp; Thân Mẫu:</p>
                <p>{bride.parents.father} &amp; {bride.parents.mother}</p>
              </div>
            )}

            {/* Social Links */}
            {bride.socials && (
              <div className="flex items-center gap-3 mt-4 text-[#EBD494]/80">
                {bride.socials.facebook && (
                  <a href={bride.socials.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#EBD494] transition-colors">
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                )}
                {bride.socials.instagram && (
                  <a href={bride.socials.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#EBD494] transition-colors">
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                )}
                {bride.socials.phone && (
                  <a href={`tel:${bride.socials.phone}`} className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#EBD494] transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
