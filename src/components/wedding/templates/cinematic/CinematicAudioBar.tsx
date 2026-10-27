import React from 'react';
import { Volume2, VolumeX, Play, Pause, Film, Music } from 'lucide-react';

interface CinematicAudioBarProps {
  isPlaying: boolean;
  onToggleSound: () => void;
  activeSection?: string;
  onScrollToSection: (sectionId: string) => void;
}

export function CinematicAudioBar({
  isPlaying,
  onToggleSound,
  activeSection,
  onScrollToSection,
}: CinematicAudioBarProps) {
  const sections = [
    { id: 'hero', label: 'PREMIERE' },
    { id: 'story-chapters', label: 'CHAPTERS' },
    { id: 'wedding-event', label: 'THE POSTER' },
    { id: 'gallery', label: 'REELS' },
    { id: 'rsvp', label: 'RSVP' },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-black/85 backdrop-blur-md border border-[#E6C687]/40 rounded-full py-2 px-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2 text-white">
      {/* Sound Controller with Equalizer */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSound}
          className="w-8 h-8 rounded-full bg-[#E6C687] text-neutral-950 flex items-center justify-center hover:bg-white transition-colors cursor-pointer shrink-0"
          title={isPlaying ? 'Tắt âm nhạc' : 'Bật âm nhạc'}
        >
          {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Animated Equalizer Waves */}
        <div className="hidden sm:flex items-center gap-1 h-4">
          <span className={`w-0.5 bg-[#E6C687] rounded-full transition-all ${isPlaying ? 'h-3.5 animate-pulse' : 'h-1'}`} />
          <span className={`w-0.5 bg-[#E6C687] rounded-full transition-all ${isPlaying ? 'h-2 animate-pulse delay-75' : 'h-1'}`} />
          <span className={`w-0.5 bg-[#E6C687] rounded-full transition-all ${isPlaying ? 'h-4 animate-pulse delay-150' : 'h-1'}`} />
          <span className={`w-0.5 bg-[#E6C687] rounded-full transition-all ${isPlaying ? 'h-2.5 animate-pulse delay-100' : 'h-1'}`} />
        </div>

        <div className="text-left leading-tight hidden xs:block">
          <p className="text-[10px] font-mono tracking-widest text-[#E6C687] uppercase truncate max-w-[120px] sm:max-w-[150px]">
            CINEMATIC THEME
          </p>
          <p className="text-[9px] text-neutral-400 truncate max-w-[120px] sm:max-w-[150px]">
            {isPlaying ? 'Playing • Dolby Audio' : 'Paused'}
          </p>
        </div>
      </div>

      {/* Chapter Fast Nav */}
      <div className="flex items-center gap-1 sm:gap-2 text-[10px] font-mono tracking-wider overflow-x-auto no-scrollbar">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onScrollToSection(s.id)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === s.id
                ? 'bg-[#E6C687] text-black font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
