import React from 'react';
import { CouplePerson } from '../../../../types';
import { SparklingStar, LotusNightIcon, HoiAnGarlicLantern } from './LanternNightOrnaments';
import { Heart, Phone, Facebook, Instagram } from 'lucide-react';

interface LanternCoupleSectionProps {
  groom: CouplePerson;
  bride: CouplePerson;
}

export function LanternCoupleSection({ groom, bride }: LanternCoupleSectionProps) {
  return (
    <section id="couple" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-serif uppercase tracking-widest">
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Nhân Vật Chính Dạ Yến</span>
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-100 animate-gold-shimmer">
          Tân Lang &amp; Tân Nương
        </h2>
        <p className="font-serif italic text-sm text-neutral-400 max-w-md mx-auto">
          Dưới ánh đèn lồng chứng giám, hai trái tim chung một nhịp đập, cùng nguyện ước trăm năm hạnh phúc.
        </p>
      </div>

      {/* Couple Dual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-stretch">
        {/* Groom Card */}
        <div className="relative rounded-3xl bg-neutral-950/70 border border-amber-500/35 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between group hover:border-amber-400/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]">
          {/* Subtle Lantern watermark top right */}
          <div className="absolute top-4 right-4 opacity-25 group-hover:opacity-60 transition-opacity pointer-events-none">
            <LotusNightIcon className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-6">
            {/* Avatar Frame with Gold Luminous Ring */}
            <div className="relative w-44 h-56 sm:w-48 sm:h-64 mx-auto rounded-2xl overflow-hidden p-1 bg-linear-to-b from-amber-400 via-yellow-600 to-amber-950 shadow-xl">
              <img
                src={groom.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                alt={groom.fullName}
                className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-t from-neutral-950/70 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Groom Info */}
            <div className="text-center space-y-2">
              <span className="text-xs font-serif uppercase tracking-widest text-amber-400/90 font-semibold">
                Chú Rể (Tân Lang)
              </span>
              <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-amber-100">
                {groom.fullName}
              </h3>
              <p className="text-xs sm:text-sm font-body text-neutral-300/80 leading-relaxed px-2">
                {groom.bio}
              </p>
            </div>
          </div>

          {/* Parents Information */}
          <div className="mt-6 pt-5 border-t border-amber-500/20 text-center space-y-1">
            <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400/80">
              Kính Báo Nhà Trai
            </span>
            <p className="text-xs text-neutral-300 font-serif">
              Thân phụ: <strong className="text-amber-200">{groom.parents?.father || 'Nguyễn Văn Thành'}</strong>
            </p>
            <p className="text-xs text-neutral-300 font-serif">
              Thân mẫu: <strong className="text-amber-200">{groom.parents?.mother || 'Lê Thị Hương'}</strong>
            </p>
          </div>
        </div>

        {/* Bride Card */}
        <div className="relative rounded-3xl bg-neutral-950/70 border border-amber-500/35 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between group hover:border-amber-400/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]">
          <div className="absolute top-4 right-4 opacity-25 group-hover:opacity-60 transition-opacity pointer-events-none">
            <LotusNightIcon className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-6">
            {/* Avatar Frame with Gold Luminous Ring */}
            <div className="relative w-44 h-56 sm:w-48 sm:h-64 mx-auto rounded-2xl overflow-hidden p-1 bg-linear-to-b from-amber-400 via-rose-700 to-amber-950 shadow-xl">
              <img
                src={bride.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'}
                alt={bride.fullName}
                className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 rounded-xl bg-linear-to-t from-neutral-950/70 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Bride Info */}
            <div className="text-center space-y-2">
              <span className="text-xs font-serif uppercase tracking-widest text-amber-400/90 font-semibold">
                Cô Dâu (Tân Nương)
              </span>
              <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-amber-100">
                {bride.fullName}
              </h3>
              <p className="text-xs sm:text-sm font-body text-neutral-300/80 leading-relaxed px-2">
                {bride.bio}
              </p>
            </div>
          </div>

          {/* Parents Information */}
          <div className="mt-6 pt-5 border-t border-amber-500/20 text-center space-y-1">
            <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400/80">
              Kính Báo Nhà Gái
            </span>
            <p className="text-xs text-neutral-300 font-serif">
              Thân phụ: <strong className="text-amber-200">{bride.parents?.father || 'Trần Quốc Dũng'}</strong>
            </p>
            <p className="text-xs text-neutral-300 font-serif">
              Thân mẫu: <strong className="text-amber-200">{bride.parents?.mother || 'Hoàng Kim Oanh'}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
