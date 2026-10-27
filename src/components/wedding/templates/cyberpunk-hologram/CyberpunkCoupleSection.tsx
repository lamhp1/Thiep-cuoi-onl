import React from 'react';
import { CouplePerson } from '../../../../types';

interface CyberpunkCoupleSectionProps {
  groom?: CouplePerson;
  bride?: CouplePerson;
}

export function CyberpunkCoupleSection({ groom, bride }: CyberpunkCoupleSectionProps) {
  const defaultGroomImg = groom?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800';
  const defaultBrideImg = bride?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800';

  return (
    <section className="relative py-20 px-6 bg-[#050714] text-slate-100 overflow-hidden">
      {/* Background Cyber Grid Lines */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30 uppercase bg-cyan-950/30">
            CHỦ THỂ HOLOGRAM (THE COUPLE)
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono uppercase text-white tracking-tight holo-glitch">
            CHÚ RỂ & CÔ DÂU
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full" />
        </div>

        {/* Couple Cards Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Groom Card */}
          <div className="bg-[#0B1026]/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between hover:border-cyan-400 transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-cyan-400/40 group">
                <img
                  src={defaultGroomImg}
                  alt={groom?.fullName || 'Chú Rể'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 bg-cyan-950/80 backdrop-blur-md border border-cyan-400/40 px-3 py-1 rounded-lg text-xs font-mono text-cyan-300">
                  ⚡ CHÚ RỂ • GROOM ID
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-mono font-bold text-white uppercase">
                  {groom?.fullName || groom?.name || 'Nguyễn Minh Anh'}
                </h3>
                <p className="text-xs font-mono text-cyan-400">
                  Chàng Trai Công Nghệ & Tương Lai
                </p>
              </div>

              <p className="text-sm font-sans text-slate-300 leading-relaxed font-light">
                {groom?.bio || 'Yêu thích khám phá công nghệ mới, chinh phục các cung đường và đồng hành cùng người thương trong từng chặng đường tương lai.'}
              </p>
            </div>

            {/* Groom Stat Indicators */}
            <div className="space-y-2 pt-4 border-t border-cyan-500/20 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>CHỈ SỐ THỦ PHỦ (HOME)</span>
                <span className="text-cyan-400">
                  {groom?.parents?.father ? `${groom.parents.father} & ${groom.parents.mother}` : 'Gia Đình Nhà Trai'}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[95%] rounded-full shadow-[0_0_10px_#00F0FF]" />
              </div>
            </div>
          </div>

          {/* Bride Card */}
          <div className="bg-[#0B1026]/80 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between hover:border-pink-400 transition-all duration-300 shadow-[0_0_30px_rgba(255,0,122,0.1)]">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-pink-400/40 group">
                <img
                  src={defaultBrideImg}
                  alt={bride?.fullName || 'Cô Dâu'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 bg-pink-950/80 backdrop-blur-md border border-pink-400/40 px-3 py-1 rounded-lg text-xs font-mono text-pink-300">
                  💖 CÔ DÂU • BRIDE ID
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-mono font-bold text-white uppercase">
                  {bride?.fullName || bride?.name || 'Trần Ngọc Mai'}
                </h3>
                <p className="text-xs font-mono text-pink-400">
                  Cô Gái Tinh Tế & Đầy Đam Mê
                </p>
              </div>

              <p className="text-sm font-sans text-slate-300 leading-relaxed font-light">
                {bride?.bio || 'Yêu âm nhạc, thiết kế và những nét đẹp lãng mạn. Luôn mang đến hơi ấm và sự ngọt ngào cho căn nhà tương lai.'}
              </p>
            </div>

            {/* Bride Stat Indicators */}
            <div className="space-y-2 pt-4 border-t border-pink-500/20 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>CHỈ SỐ THỦ PHỦ (HOME)</span>
                <span className="text-pink-400">
                  {bride?.parents?.father ? `${bride.parents.father} & ${bride.parents.mother}` : 'Gia Đình Nhà Gái'}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-pink-500 h-full w-[95%] rounded-full shadow-[0_0_10px_#FF007A]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
