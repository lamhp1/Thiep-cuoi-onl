import React, { useState } from 'react';
import { Heart, BookOpen, Sparkles, Music, ArrowDown } from 'lucide-react';
import { WashiTape, Paperclip, HeartSticker, StampSticker } from './PolaroidScrapbookOrnaments';
import { PersonalizedWaxSealBadge } from '../../common/PersonalizedWaxSealBadge';

interface PolaroidScrapbookCoverOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  city?: string;
  coverImage?: string;
  onOpenScrapbook: () => void;
}

export function PolaroidScrapbookCoverOpening({
  groomName,
  brideName,
  weddingDate,
  city = 'TP. HUẾ',
  coverImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  onOpenScrapbook,
}: PolaroidScrapbookCoverOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpenScrapbook();
    }, 650);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#2B231D]/90 backdrop-blur-md transition-all duration-700 select-none overflow-y-auto ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Wooden Desk / Cork Board Background */}
      <div className="absolute inset-0 bg-[#241E1A] opacity-80" />
      <div className="absolute inset-0 scrapbook-desk-bg opacity-30 pointer-events-none" />

      {/* Scrapbook Album Cover */}
      <div className="relative w-full max-w-lg bg-[#FAF4EB] border-4 border-[#E5D7C2] rounded-2xl shadow-2xl p-6 sm:p-8 text-center text-[#3D3128] overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
        {/* Left Book Spine Binding Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-[#8C6D4F] via-[#A88B6E] to-[#FAF4EB] border-r border-[#785C40]/40 flex flex-col justify-around items-center py-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3D3128] shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3D3128] shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3D3128] shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3D3128] shadow-inner" />
        </div>

        {/* Decorative corner washi tape */}
        <div className="absolute -top-3.5 right-6 z-20">
          <WashiTape style="pink-grid" angle={-8} width="w-24" />
        </div>
        <div className="absolute -bottom-3.5 left-10 z-20">
          <WashiTape style="mint-dots" angle={12} width="w-24" />
        </div>

        {/* Top Header Tag */}
        <div className="pl-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F3E7D5] border border-[#DFCBB2] text-[#8C6D1F] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>OUR HANDMADE LOVE SCRAPBOOK</span>
          </div>

          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2C221C]">
            Album Kỷ Niệm & Thiệp Cưới
          </h1>

          <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5738] mt-1">
            "Mỗi khoảnh khắc bên nhau là một mảnh ghép của hạnh phúc"
          </p>
        </div>

        {/* Center Polaroid Photo on Album Cover */}
        <div className="my-4 pl-4 flex flex-col items-center justify-center">
          <div className="relative bg-white p-3 sm:p-4 pb-8 sm:pb-9 rounded-xs shadow-xl border border-neutral-200 rotate-[-2deg] max-w-xs transform hover:rotate-0 hover:scale-105 transition-all duration-300">
            {/* Washi tape over polaroid */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <WashiTape style="yellow-stripes" angle={2} width="w-20" />
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 rounded-xs">
              <img
                src={coverImage}
                alt="Couple Cover"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-2.5 text-center">
              <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#1E1714]">
                {groomName} & {brideName}
              </h2>
              <p className="font-polaroid-note text-sm text-[#8C6D1F]">
                {weddingDate} • {city}
              </p>
            </div>

            {/* Little Stamp on corner */}
            <div className="absolute -bottom-2 -right-2">
              <HeartSticker text="BEST DAY" color="red" angle={10} />
            </div>
          </div>

          {/* Gold Inscribed Guest Invitation */}
          <PersonalizedWaxSealBadge theme="gold" className="mt-4 max-w-[280px]" />
        </div>

        {/* Bottom Ribbon / Open Scrapbook Button */}
        <div className="pl-4 mt-6">
          <button
            onClick={handleOpen}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D9735A] to-[#BA553E] hover:from-[#C86249] hover:to-[#A7442F] text-white font-serif font-bold text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#FDE5DF] group-hover:scale-110 transition-transform" />
            <span>MỞ CUỐN SỔ KỶ NIỆM & THIỆP CƯỚI</span>
            <ArrowDown className="w-4 h-4 text-[#FDE5DF] group-hover:translate-y-0.5 transition-transform" />
          </button>

          <p className="text-[11px] font-mono text-[#8C7565] mt-3">
            Bấm để mở album và thưởng thức giai điệu tình yêu 🎵
          </p>
        </div>
      </div>
    </div>
  );
}
