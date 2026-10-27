import React, { useState } from 'react';
import { RoyalRingVault3DCanvas } from './RoyalRingVault3DCanvas';
import { weddingAudio } from '../../../lib/audioSynth';
import { Sparkles, ArrowRight, Volume2, VolumeX, Eye } from 'lucide-react';

interface RoyalRingVaultOpeningProps {
  onEnterWedding: () => void;
  guestName: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  musicUrl?: string;
}

export function RoyalRingVaultOpening({
  onEnterWedding,
  guestName,
  groomName,
  brideName,
  weddingDate,
  musicUrl,
}: RoyalRingVaultOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    // If opening for first time and music isn't playing, start soft background music
    if (nextState && !isPlayingMusic) {
      weddingAudio.play(musicUrl);
      setIsPlayingMusic(true);
    }
  };

  const handleToggleMusic = () => {
    if (isPlayingMusic) {
      weddingAudio.pause();
      setIsPlayingMusic(false);
    } else {
      weddingAudio.play(musicUrl);
      setIsPlayingMusic(true);
    }
  };

  const handleExplore = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onEnterWedding();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#09070c] transition-all duration-700 ${
        isTransitioning ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* 3D Scene Canvas */}
      <RoyalRingVault3DCanvas
        isOpen={isOpen}
        onToggleOpen={handleToggleOpen}
        guestName={guestName}
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
        onExploreWedding={handleExplore}
      />

      {/* Unified Luxury Top Navigation Header (Zero Overlap with Text or Canvas) */}
      <header className="absolute top-0 inset-x-0 z-30 px-3 sm:px-6 py-3.5 flex items-center justify-between gap-2 sm:gap-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
        {/* Left: Music Sound Toggle */}
        <button
          onClick={handleToggleMusic}
          className="pointer-events-auto shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-[#e5a88e]/40 text-white/90 hover:text-white hover:border-[#e5a88e] text-xs backdrop-blur-md transition-all active:scale-95 shadow-lg"
          title="Bật/Tắt nhạc nền"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#e5a88e] animate-pulse" />
              <span className="hidden sm:inline">Giai điệu lãng mạn</span>
              <span className="sm:hidden">Nhạc</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/70">Bật nhạc</span>
            </>
          )}
        </button>

        {/* Center: Clean Non-Overlapping VIP Monogram Badge */}
        <div className="flex flex-col items-center text-center min-w-0 max-w-[55%] sm:max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/75 border border-[#e5a88e]/40 text-[#e5a88e] text-[10px] sm:text-[11px] font-serif tracking-widest uppercase backdrop-blur-md shadow-md">
            <span>✦</span>
            <span className="truncate">The Royal Ring Vault 3D</span>
            <span>✦</span>
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-[#e8b498] font-light tracking-wide truncate">
            Kính mời: <span className="font-semibold text-white">{guestName || 'Quý Khách Quý'}</span>
          </p>
        </div>

        {/* Right: Quick Skip to Invitation */}
        <button
          onClick={handleExplore}
          className="pointer-events-auto shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#e5a88e]/25 via-white/20 to-[#e5a88e]/25 border border-[#e5a88e]/50 text-white hover:brightness-125 text-xs font-serif backdrop-blur-md transition-all active:scale-95 shadow-lg"
        >
          <span className="hidden sm:inline">Vào xem</span>
          <span>Thiệp cưới</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#e5a88e]" />
        </button>
      </header>
    </div>
  );
}
