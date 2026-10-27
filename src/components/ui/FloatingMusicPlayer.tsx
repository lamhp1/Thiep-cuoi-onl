import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { weddingAudio } from '../../lib/audioSynth';

interface FloatingMusicPlayerProps {
  musicUrl?: string;
}

export function FloatingMusicPlayer({ musicUrl }: FloatingMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsub = weddingAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    weddingAudio.toggle(musicUrl);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    weddingAudio.setMuted(nextMuted);
  };

  return (
    <div id="floating-music-player" className="fixed bottom-20 left-4 sm:left-6 z-40 flex items-center gap-2">
      {/* Main disc button */}
      <div className="relative group">
        <button
          id="music-disc-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#D4AF37] shadow-xl backdrop-blur-md transition-all duration-300 ${
            isPlaying ? 'bg-[#1C1A17] text-[#D4AF37]' : 'bg-white/90 text-neutral-600'
          }`}
          aria-label="Điều khiển âm nhạc đám cưới"
        >
          {/* Rotating vinyl icon */}
          <div className={`w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center ${isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`}>
            <Music className="w-4 h-4 text-[#D4AF37]" />
          </div>

          {/* Sound waves pulse indicator */}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D4AF37]"></span>
            </span>
          )}
        </button>

        {/* Quick action buttons on hover / expand */}
        <div
          className={`absolute left-0 bottom-14 flex items-center gap-2 p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4AF37]/30 shadow-2xl transition-all duration-300 origin-bottom-left ${
            isExpanded ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
          }`}
        >
          <button
            id="play-pause-music-btn"
            onClick={handleTogglePlay}
            className="p-2 rounded-xl bg-[#FDFBF7] hover:bg-[#D4AF37] text-neutral-700 hover:text-white transition-colors"
            title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc cưới'}
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            id="mute-music-btn"
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-[#FDFBF7] hover:bg-[#D4AF37] text-neutral-700 hover:text-white transition-colors"
            title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
            aria-label={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
          </button>

          <div className="px-2 pr-3 border-l border-neutral-200 text-left whitespace-nowrap">
            <p className="text-[11px] font-semibold text-[#8C7335] uppercase tracking-wider">Nhạc cưới</p>
            <p className="text-xs text-neutral-600 font-body">
              {isPlaying ? (isMuted ? 'Đang tắt tiếng' : 'Canon in D Melodies') : 'Tạm dừng'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
