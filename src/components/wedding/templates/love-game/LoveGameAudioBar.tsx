import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { weddingAudio } from '../../../../lib/audioSynth';

interface LoveGameAudioBarProps {
  musicUrl?: string;
}

export function LoveGameAudioBar({ musicUrl }: LoveGameAudioBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const unsub = weddingAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      weddingAudio.pause();
    } else {
      weddingAudio.play(musicUrl);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    weddingAudio.setMuted(nextMuted);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-40 flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16132A]/90 hover:bg-[#1E1A38] border border-white/15 backdrop-blur-xl shadow-xl transition-all text-white">
        <button
          type="button"
          onClick={handleTogglePlay}
          className="cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold text-pink-300 hover:text-pink-200 transition-colors"
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc nền'}
        >
          <Disc className={`w-4 h-4 text-pink-400 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isPlaying ? 'BGM ON' : 'PLAY BGM'}</span>
        </button>

        {isPlaying && (
          <div className="flex items-center gap-0.5 h-3 px-1">
            <span className="w-0.5 h-full bg-pink-400 animate-pulse" />
            <span className="w-0.5 h-2 bg-purple-400 animate-pulse delay-75" />
            <span className="w-0.5 h-3 bg-amber-400 animate-pulse delay-150" />
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleMute}
          className="cursor-pointer text-neutral-400 hover:text-white transition-colors p-1"
          title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
