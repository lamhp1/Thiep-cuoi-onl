import React, { useState } from 'react';
import { Sparkles, Moon, Heart } from 'lucide-react';
import { DetailedMoon, ArtisticBloomingLotus, playMoonlightChime } from './MoonLotusOrnaments';
import { weddingAudio } from '../../../../lib/audioSynth';
import { PersonalizedWaxSealBadge } from '../../common/PersonalizedWaxSealBadge';

interface MoonLotusOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  city?: string;
  musicUrl?: string;
  onEnter: () => void;
}

export function MoonLotusOpening({
  groomName,
  brideName,
  weddingDate,
  city = 'TP. Huế',
  musicUrl,
  onEnter,
}: MoonLotusOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenInvitation = async () => {
    if (isOpening) return;
    setIsOpening(true);

    // Play celestial moonlight chime sound
    playMoonlightChime();

    // Start background romantic wedding acoustic/melody
    try {
      await weddingAudio.play(musicUrl);
    } catch {
      // Gracefully continue
    }

    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-1000 ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #3F0A19 0%, #1A0B28 50%, #060A1D 100%)',
      }}
    >
      {/* Background Ambient Stars & Lunar Halo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#EBD494]/20 via-[#E06D84]/15 to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Main Luxury Invitation Envelope / Card */}
      <div className="relative w-full max-w-lg rounded-3xl p-8 sm:p-12 text-center border border-[#EBD494]/40 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(235,212,148,0.15)] backdrop-blur-xl bg-[#120D24]/85 overflow-hidden transition-all duration-700">
        {/* Subtle Corner Filigree Ornaments */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#EBD494]/50 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#EBD494]/50 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#EBD494]/50 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#EBD494]/50 rounded-br-lg" />

        {/* Top Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-[0.2em] mb-6">
          <Moon className="w-3.5 h-3.5 text-[#EBD494]" />
          <span>Under The Same Moon</span>
          <Sparkles className="w-3.5 h-3.5 text-[#EBD494]" />
        </div>

        {/* Central Lunar Emblem */}
        <div className="relative my-4 flex justify-center items-center">
          <DetailedMoon size={150} interactive={false} />
          {/* Subtle Blooming Lotus layered in front of the moon */}
          <div className="absolute -bottom-4 z-20">
            <ArtisticBloomingLotus size={110} bloomProgress={0.9} />
          </div>
        </div>

        {/* Personalized Wax Seal Inscribed Guest Badge */}
        <PersonalizedWaxSealBadge theme="red" className="mt-4 mb-2 max-w-[280px]" />

        {/* Couple Names */}
        <div className="mt-4 space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#EBD494]/80 font-serif">
            Thiệp Cưới Báo Hỷ
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#FFFDF7] tracking-wider leading-tight">
            <span>{groomName}</span>
            <span className="block text-[#EBD494] text-2xl sm:text-3xl font-serif my-1">&amp;</span>
            <span>{brideName}</span>
          </h1>
        </div>

        {/* Date & Destination */}
        <div className="mt-6 flex items-center justify-center gap-3 text-xs sm:text-sm font-serif text-[#F4E4BA]/90 tracking-widest uppercase">
          <span>{weddingDate}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#EBD494]" />
          <span>{city}</span>
        </div>

        {/* Wax Seal Click Trigger */}
        <div className="mt-8 pt-4">
          <button
            onClick={handleOpenInvitation}
            className="cursor-pointer group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#751A29] via-[#A8283D] to-[#681423] hover:from-[#8C2033] hover:to-[#7E1A2D] text-[#FFFDF7] font-serif font-semibold text-sm tracking-wider uppercase shadow-[0_4px_25px_rgba(168,40,61,0.5)] border border-[#EBD494]/60 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4E4BA] group-hover:rotate-45 transition-transform duration-500" />
              <span>Đón Ánh Trăng &amp; Mở Thiệp</span>
            </span>
            <div className="absolute inset-0 rounded-full bg-[#EBD494]/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          </button>
          <p className="text-[11px] text-[#EBD494]/60 mt-3 font-serif italic">
            Chạm để mở thiệp cưới kèm giai điệu dạ nguyệt lãng mạn
          </p>
        </div>
      </div>
    </div>
  );
}
