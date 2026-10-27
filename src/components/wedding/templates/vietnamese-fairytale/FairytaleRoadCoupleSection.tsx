import React, { useState } from 'react';
import { CouplePerson } from '../../../../types';
import { ChapterHeaderBadge, FolkBambooGrove, FolkCloud, FolkLotus, FolkRedSeal } from './FairytaleOrnaments';
import { Heart, Sparkles, Phone, Facebook } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FairytaleRoadCoupleSectionProps {
  groom: CouplePerson;
  bride: CouplePerson;
  groomName: string;
  brideName: string;
}

export function FairytaleRoadCoupleSection({
  groom,
  bride,
  groomName,
  brideName,
}: FairytaleRoadCoupleSectionProps) {
  const [activeHeart, setActiveHeart] = useState(false);

  const triggerBlessing = () => {
    setActiveHeart(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#BA262B', '#E5A93C', '#2D6A4F'],
      });
    } catch {
      // safe fallback
    }
    setTimeout(() => setActiveHeart(false), 2000);
  };

  return (
    <section id="road-couple" className="relative py-20 px-4 overflow-hidden bg-[#FAF5EB]/90">
      {/* Visual metaphor: The winding brick village path background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #A04735 0, #A04735 1px, transparent 0, transparent 24px), repeating-linear-gradient(-45deg, #A04735 0, #A04735 1px, transparent 0, transparent 24px)',
          }}
        />
      </div>

      {/* Decorative Bamboo on the side of the road */}
      <div className="absolute top-10 -left-6 opacity-60 pointer-events-none hidden sm:block">
        <FolkBambooGrove className="w-20 h-64 text-[#2D6A4F]" />
      </div>
      <div className="absolute bottom-10 -right-6 opacity-60 pointer-events-none hidden sm:block scale-x-[-1]">
        <FolkBambooGrove className="w-20 h-64 text-[#2D6A4F]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Chapter 1 Badge */}
        <ChapterHeaderBadge
          chapterNum="Chương I • Con Đường Làng"
          title="Đôi Uyên Ương Hội Ngộ"
          subtext="Lối nhỏ quanh co tre rủ bóng hiền, gặp người một thuở ngỡ trăm năm tơ duyên"
        />

        {/* Comic Storybook Panel - Couple Cards framed like Modern Folk Art Woodcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mt-12 items-stretch">
          {/* 1. Tân Lang (Groom Card) */}
          <div className="group relative bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 border-2 border-[#D9CBB7] shadow-xl hover:border-[#BA262B] transition-all duration-500 flex flex-col justify-between">
            {/* Top Chapter Label in Comic Strip style */}
            <div className="flex items-center justify-between border-b border-[#E6D8C2] pb-3 mb-5">
              <div className="flex items-center gap-2">
                <FolkRedSeal text="CHÀNG" subtitle="TÂN LANG" className="w-9 h-9 text-[#1D3557] bg-[#1D3557]/10 border-[#1D3557]" />
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#853023] uppercase block">
                    BÊN LŨY TRE LÀNG
                  </span>
                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#351E17]">
                    {groom.fullName || groomName}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-serif text-[#7A4C3E] italic">Tân Lang</span>
            </div>

            {/* Photo in Folk Art Frame */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-inner border border-[#E6D8C2] mb-5 group-hover:shadow-md transition-shadow">
              <img
                src={groom.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85'}
                alt={groom.fullName || groomName}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[11px] font-mono tracking-widest text-[#E5A93C] uppercase">
                  Nhà Trai • {groom.parents?.father ? `Trưởng nam của ông bà` : 'Gia đình nhà trai'}
                </p>
                <p className="font-serif-title text-sm font-semibold truncate">
                  {groom.parents?.father ? `${groom.parents.father} & ${groom.parents.mother}` : 'Họ nhà Trai tạ ân'}
                </p>
              </div>
            </div>

            {/* Bio / Comic Monologue */}
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="relative bg-[#FAF5EB] p-4 rounded-xl border border-[#E6D8C2]">
                <div className="text-[10px] font-mono uppercase text-[#A04735] font-bold tracking-wider mb-1 flex items-center gap-1">
                  <FolkCloud className="w-4 h-2 text-[#A04735]" />
                  <span>Lời Tự Sự Của Chú Rể</span>
                </div>
                <p className="font-poetry text-xs sm:text-sm text-[#543026] italic leading-relaxed">
                  "{groom.bio || 'Chàng trai yêu sự giản dị và chân thành. Giữa muôn nẻo đường đời, hạnh phúc lớn nhất là được nắm chặt tay nàng đi qua bao mùa hoa nở rộ.'}"
                </p>
              </div>

              {/* Social or contact info */}
              <div className="flex items-center justify-between text-xs text-[#7A4C3E] pt-2 border-t border-[#E6D8C2]">
                <span className="font-serif">Đại diện họ Nhà Trai</span>
                {groom.socials?.phone && (
                  <a
                    href={`tel:${groom.socials.phone}`}
                    className="inline-flex items-center gap-1 text-[#BA262B] hover:underline font-mono"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{groom.socials.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 2. Tân Nương (Bride Card) */}
          <div className="group relative bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 border-2 border-[#D9CBB7] shadow-xl hover:border-[#BA262B] transition-all duration-500 flex flex-col justify-between">
            {/* Top Chapter Label in Comic Strip style */}
            <div className="flex items-center justify-between border-b border-[#E6D8C2] pb-3 mb-5">
              <div className="flex items-center gap-2">
                <FolkRedSeal text="NÀNG" subtitle="TÂN NƯƠNG" className="w-9 h-9 text-[#BA262B] bg-[#BA262B]/10 border-[#BA262B]" />
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#853023] uppercase block">
                    HOA NỞ ĐẦU THÔN
                  </span>
                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#351E17]">
                    {bride.fullName || brideName}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-serif text-[#7A4C3E] italic">Tân Nương</span>
            </div>

            {/* Photo in Folk Art Frame */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-inner border border-[#E6D8C2] mb-5 group-hover:shadow-md transition-shadow">
              <img
                src={bride.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85'}
                alt={bride.fullName || brideName}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[11px] font-mono tracking-widest text-[#E5A93C] uppercase">
                  Nhà Gái • {bride.parents?.father ? `Ái nữ của ông bà` : 'Gia đình nhà gái'}
                </p>
                <p className="font-serif-title text-sm font-semibold truncate">
                  {bride.parents?.father ? `${bride.parents.father} & ${bride.parents.mother}` : 'Họ nhà Gái tạ ân'}
                </p>
              </div>
            </div>

            {/* Bio / Comic Monologue */}
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="relative bg-[#FAF5EB] p-4 rounded-xl border border-[#E6D8C2]">
                <div className="text-[10px] font-mono uppercase text-[#A04735] font-bold tracking-wider mb-1 flex items-center gap-1">
                  <FolkCloud className="w-4 h-2 text-[#A04735]" />
                  <span>Lời Tự Sự Của Cô Dâu</span>
                </div>
                <p className="font-poetry text-xs sm:text-sm text-[#543026] italic leading-relaxed">
                  "{bride.bio || 'Cô gái yêu nét mộc mạc thanh tao của cánh sen làng. Cảm ơn chàng vì đã đến, trao sự chở che và cùng dệt nên câu chuyện cổ tích đẹp nhất của cuộc đời.'}"
                </p>
              </div>

              {/* Social or contact info */}
              <div className="flex items-center justify-between text-xs text-[#7A4C3E] pt-2 border-t border-[#E6D8C2]">
                <span className="font-serif">Đại diện họ Nhà Gái</span>
                {bride.socials?.phone && (
                  <a
                    href={`tel:${bride.socials.phone}`}
                    className="inline-flex items-center gap-1 text-[#BA262B] hover:underline font-mono"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{bride.socials.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Interactive Blessing Button (Chạm để thả tim duyên lành) */}
        <div className="mt-10 text-center">
          <button
            onClick={triggerBlessing}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#FFFDF9] border-2 border-[#BA262B]/30 hover:border-[#BA262B] text-[#BA262B] shadow-md hover:shadow-lg transition-all text-xs sm:text-sm font-serif font-bold cursor-pointer active:scale-95"
          >
            <Heart className={`w-4 h-4 fill-current ${activeHeart ? 'scale-125 text-red-600' : ''}`} />
            <span>{activeHeart ? 'Đã Chúc Duyên Lành!' : 'Chúc Phúc Cho Đôi Uyên Ương'}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
          </button>
        </div>
      </div>
    </section>
  );
}
