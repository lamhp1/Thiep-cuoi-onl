import React from 'react';
import { Volume2, VolumeX, Film, Sparkles, Flame, Gift, Calendar, Image as ImageIcon } from 'lucide-react';
import { SongHyGlyph } from '../../vietnamese-traditional/TraditionalOrnaments';

interface VietnameseCinematicAudioBarProps {
  isPlaying: boolean;
  onToggleSound: () => void;
  activeSection: string;
  onScrollToSection: (sectionId: string) => void;
}

export function VietnameseCinematicAudioBar({
  isPlaying,
  onToggleSound,
  activeSection,
  onScrollToSection,
}: VietnameseCinematicAudioBarProps) {
  const navItems = [
    { id: 'hero', label: 'Khởi Đầu', icon: Film },
    { id: 'story-chronicles', label: 'Sử Ký', icon: Sparkles },
    { id: 'movie-poster', label: 'Đại Lễ', icon: Calendar },
    { id: 'interactive-altar', label: 'Thả Đèn', icon: Flame },
    { id: 'gallery', label: 'Họa Phổ', icon: ImageIcon },
    { id: 'final-scene', label: 'Kết Màn', icon: SongHyGlyph },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[94%] bg-[#120204]/90 backdrop-blur-md text-[#FAF6EE] px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/50 shadow-[0_4px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2 select-none animate-fadeIn">
      {/* Sound Toggle Button with Animated Wave */}
      <button
        onClick={onToggleSound}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3D0A11] hover:bg-[#590B11] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif transition-colors cursor-pointer shrink-0"
        title={isPlaying ? 'Tắt nhã nhạc cung đình' : 'Bật nhã nhạc cung đình'}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span className="hidden sm:inline font-bold">Nhã Nhạc: Bật</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline text-neutral-300">Bật Nhạc</span>
          </>
        )}
      </button>

      {/* Chapter Navigator Pills */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onScrollToSection(item.id)}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-serif tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-[#BA1E28] text-white border border-[#D4AF37] shadow-md font-bold'
                  : 'text-[#E2D5BE] hover:text-white hover:bg-white/10'
              }`}
            >
              {typeof Icon === 'function' && <Icon className="w-3 h-3 text-[#D4AF37]" />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
