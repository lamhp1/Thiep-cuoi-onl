import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Moon, Disc } from 'lucide-react';
import { weddingAudio } from '../../../../lib/audioSynth';

interface MoonLotusAudioBarProps {
  musicUrl?: string;
  autoPlay?: boolean;
}

export function MoonLotusAudioBar({ musicUrl }: MoonLotusAudioBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check initial playing state from audio synth singleton
    setIsPlaying(weddingAudio.isPlaying);

    const checkInterval = setInterval(() => {
      setIsPlaying(weddingAudio.isPlaying);
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  const togglePlay = async () => {
    if (weddingAudio.isPlaying) {
      weddingAudio.pause();
      setIsPlaying(false);
    } else {
      try {
        await weddingAudio.play(musicUrl);
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio toggle failed:', err);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={togglePlay}
        className={`cursor-pointer group flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 rounded-full border border-[#EBD494]/60 shadow-[0_8px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isPlaying
            ? 'bg-gradient-to-r from-[#751A29]/90 to-[#10142E]/90 text-[#FFFDF7]'
            : 'bg-[#10142E]/80 text-[#F4E4BA]/70'
        }`}
        title={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát giai điệu dạ nguyệt'}
      >
        {/* Spinning Disc or Moon icon */}
        <div
          className={`w-7 h-7 rounded-full bg-[#EBD494]/20 flex items-center justify-center text-[#EBD494] border border-[#EBD494]/40 ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '6s' }}
        >
          <Disc className="w-4 h-4" />
        </div>

        {/* Text and visual sound wave bars */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] font-serif uppercase tracking-widest text-[#EBD494]">
            {isPlaying ? 'Dạ Nguyệt Tình Ca' : 'Nhạc Cưới'}
          </span>
          <span className="text-xs font-serif text-[#FFFDF7]">
            {isPlaying ? 'Đang phát...' : 'Chạm để nghe'}
          </span>
        </div>

        {/* Sound Wave Bars */}
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4 px-1">
            <span className="w-0.5 h-2 bg-[#EBD494] animate-pulse" />
            <span className="w-0.5 h-3.5 bg-[#EBD494] animate-bounce" />
            <span className="w-0.5 h-2.5 bg-[#EBD494] animate-pulse" />
          </div>
        ) : (
          <VolumeX className="w-4 h-4 text-neutral-400" />
        )}
      </button>
    </div>
  );
}
