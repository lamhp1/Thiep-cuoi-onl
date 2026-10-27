import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

interface FairytaleAudioBarProps {
  musicUrl?: string;
}

export function FairytaleAudioBar({
  musicUrl,
}: FairytaleAudioBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback to soothing folk flute/piano instrumental if musicUrl is empty or undefined
  const defaultMusic =
    musicUrl?.trim() || 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3';

  useEffect(() => {
    // Attempt graceful autoplay if allowed, else wait for user click
    const handleFirstClick = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked by browser policy
          });
      }
    };

    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, [hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      <audio ref={audioRef} src={defaultMusic} loop preload="auto" />

      {/* Floating Bamboo Wood & Gold Coin Audio Controller */}
      <button
        onClick={togglePlay}
        className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full border-2 transition-all duration-300 shadow-xl cursor-pointer ${
          isPlaying
            ? 'bg-[#BA262B] border-[#E5A93C] text-[#FAF5EB] shadow-[#BA262B]/30'
            : 'bg-[#FAF5EB] border-[#9E3E2F]/40 text-[#6D271C] hover:border-[#BA262B]'
        }`}
        title={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền dân gian'}
      >
        <div className="relative flex items-center justify-center">
          <Disc
            className={`w-5 h-5 text-[#E5A93C] ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {isPlaying ? (
              <Volume2 className="w-2.5 h-2.5 text-white" />
            ) : (
              <VolumeX className="w-2.5 h-2.5 text-[#6D271C]" />
            )}
          </div>
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] font-serif font-bold uppercase tracking-wider leading-none">
            {isPlaying ? 'Giai Điệu Làng Quê' : 'Bật Nhạc Nền'}
          </span>
          <span className="text-[8px] font-poetry opacity-80 mt-0.5">
            {isPlaying ? 'Đàn Tranh & Sáo Trúc' : 'Chạm để thưởng thức'}
          </span>
        </div>

        {/* Audio frequency wave visualizer bars */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3 ml-1">
            <span className="w-0.5 h-2 bg-[#E5A93C] animate-pulse" />
            <span className="w-0.5 h-3 bg-[#FAF5EB] animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-0.5 h-1.5 bg-[#E5A93C] animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
      </button>
    </div>
  );
}
