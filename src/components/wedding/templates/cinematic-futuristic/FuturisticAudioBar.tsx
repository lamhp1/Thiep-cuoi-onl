import React, { useState } from 'react';
import { Volume2, VolumeX, Radio, ListFilter, Compass, ChevronUp } from 'lucide-react';

interface FuturisticAudioBarProps {
  isPlaying: boolean;
  onToggleSound: () => void;
  activeSection: string;
  onScrollToSection: (sectionId: string) => void;
}

export function FuturisticAudioBar({
  isPlaying,
  onToggleSound,
  activeSection,
  onScrollToSection,
}: FuturisticAudioBarProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const sections = [
    { id: 'hero', label: 'Cổng Khởi Hành' },
    { id: 'story-chronicles', label: 'Dòng Thời Gian' },
    { id: 'movie-poster', label: 'Lịch Trình & RSVP' },
    { id: 'quantum-vault', label: 'Năng Lượng & Mừng Cưới' },
    { id: 'gallery', label: 'Lăng Kính Ảnh' },
    { id: 'wishes-matrix', label: 'Sổ Lưu Bút' },
    { id: 'final-scene', label: 'Đoạn Kết Supernova' },
  ];

  return (
    <div className="fixed bottom-5 right-4 sm:right-8 z-50 flex flex-col items-end gap-2 font-body select-none">
      {/* Expanded Quick Navigation Menu */}
      {isNavOpen && (
        <div className="bg-[#090E26]/95 border border-[#00F0FF]/40 rounded-2xl p-3 shadow-[0_0_30px_rgba(0,240,255,0.3)] backdrop-blur-xl mb-2 w-52 space-y-1 text-xs font-mono animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#00F0FF]/30 pb-1.5 mb-1.5 text-[10px] text-[#00F0FF]">
            <span>ĐIỀU HƯỚNG NHANH</span>
            <button
              onClick={() => setIsNavOpen(false)}
              className="text-neutral-400 hover:text-white cursor-pointer"
            >
              [X]
            </button>
          </div>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onScrollToSection(s.id);
                setIsNavOpen(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                activeSection === s.id
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] font-bold border border-[#00F0FF]/30'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              <span>{s.label}</span>
              {activeSection === s.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />}
            </button>
          ))}
        </div>
      )}

      {/* Floating Control Pill */}
      <div className="bg-[#090E26]/90 border border-[#00F0FF]/50 rounded-full p-1.5 shadow-neon-cyan backdrop-blur-xl flex items-center gap-1.5">
        {/* Navigation Dropdown Toggle */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-futuristic flex items-center gap-1.5 cursor-pointer transition-colors"
          title="Mục lục hành trình"
        >
          <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span className="hidden sm:inline">Mục Lục</span>
        </button>

        {/* Sound Toggle Button */}
        <button
          onClick={onToggleSound}
          className="px-3.5 py-1.5 rounded-full bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]/40 text-xs font-mono flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          title={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        >
          {isPlaying ? (
            <>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-[#00F0FF] animate-pulse" />
                <span className="w-0.5 h-3 bg-[#00F0FF] animate-bounce" />
                <span className="w-0.5 h-1.5 bg-[#00F0FF] animate-pulse" />
              </div>
              <span className="font-futuristic font-bold">ÂM THANH</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-400 font-futuristic">MUTE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
