import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Sparkles, Bell } from 'lucide-react';

interface LanternAudioBarProps {
  musicUrl?: string;
}

export const playLanternWindChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const frequencies = [880, 1046.5, 1318.5, 1567.98, 1760]; // A5, C6, E6, G6, A6 pentatonic
    const now = audioCtx.currentTime;

    frequencies.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.08, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 1.3);
    });
  } catch (e) {
    // AudioContext not allowed or not supported
  }
};

export function LanternAudioBar({ musicUrl }: LanternAudioBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Default soothing Vietnamese piano / night wedding instrumental
  const defaultMusic =
    musicUrl?.trim() || 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3';

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be blocked until user gesture
      });
    }
  };

  const playWindChime = () => {
    playLanternWindChime();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
      <audio
        ref={audioRef}
        src={defaultMusic}
        loop
        preload="auto"
      />

      {/* Wind Chime Bell */}
      <button
        onClick={playWindChime}
        className="cursor-pointer p-2.5 rounded-full bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
        title="Ngân chuông gió dạ tiệc"
      >
        <Bell className="w-4 h-4 animate-bounce" />
      </button>

      {/* Music Player Button */}
      <button
        onClick={togglePlay}
        className={`cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 ${
          isPlaying
            ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
            : 'bg-neutral-950/80 text-amber-200 border-amber-500/30 hover:border-amber-400'
        }`}
        title={isPlaying ? 'Tắt nhạc dạ tiệc' : 'Bật nhạc dạ tiệc'}
      >
        <Music className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
        <span className="text-xs font-serif font-semibold hidden sm:inline">
          {isPlaying ? 'Dạ Tiệc Đêm' : 'Bật Nhạc'}
        </span>
      </button>
    </div>
  );
}
