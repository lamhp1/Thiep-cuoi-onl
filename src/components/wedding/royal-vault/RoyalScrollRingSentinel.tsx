import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, ChevronUp } from 'lucide-react';

interface RoyalScrollRingSentinelProps {
  onReopenVault: () => void;
}

export function RoyalScrollRingSentinel({ onReopenVault }: RoyalScrollRingSentinelProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState('Khởi Đầu');
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const chapters = [
    { id: 'hero', num: 'I', label: 'Lời Ngỏ' },
    { id: 'couple', num: 'II', label: 'Cặp Đôi' },
    { id: 'events', num: 'III', label: 'Sự Kiện' },
    { id: 'ceremony', num: 'IV', label: 'Trao Nhẫn' },
    { id: 'story', num: 'V', label: 'Chuyện Tình' },
    { id: 'gallery', num: 'VI', label: 'Khoảnh Khắc' },
    { id: 'rsvp', num: 'VII', label: 'Xác Nhận' },
    { id: 'gift', num: 'VIII', label: 'Mừng Cưới' },
    { id: 'wishes', num: 'IX', label: 'Lưu Bút' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsVisible(currentScroll > 250);

      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapters[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveChapter(chapters[i].label);
            setActiveChapterIdx(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsExpanded(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-4 sm:left-6 bottom-5 z-40 select-none">
      {/* Expanded Chapter Navigator Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 p-3.5 rounded-2xl bg-[#140F18]/95 border border-[#E8B498]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl max-w-xs space-y-1.5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] font-serif text-[#E8B498] uppercase tracking-wider">
              <span>Hành Trình Hôn Lễ</span>
              <span className="text-white/40">{Math.round(scrollProgress)}%</span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => scrollTo(ch.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-serif transition-all text-left ${
                    idx === activeChapterIdx
                      ? 'bg-[#E8B498]/20 text-[#E8B498] font-bold border border-[#E8B498]/40'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] text-[#E8B498]/70 font-mono w-4">{ch.num}</span>
                    <span>{ch.label}</span>
                  </span>
                  {idx === activeChapterIdx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8B498] shadow-[0_0_8px_#E8B498]" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={onReopenVault}
                className="flex-1 py-1.5 text-[11px] font-serif rounded-lg bg-gradient-to-r from-[#E8B498] to-[#C7886D] text-[#190F14] font-bold hover:brightness-110 active:scale-95 transition-all text-center"
              >
                💍 Hộp Nhẫn 3D
              </button>
              <button
                onClick={scrollToTop}
                className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white transition-all"
                title="Lên đầu trang"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Ring Sentinel Pill */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#140F18]/90 border border-[#E8B498]/50 shadow-[0_0_25px_rgba(232,180,152,0.35)] backdrop-blur-xl text-left hover:border-[#E8B498] transition-all"
      >
        {/* Animated Rotating 3D Ring Silhouette synced to scroll */}
        <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
          {/* Outer Ring */}
          <div
            className="w-6 h-6 rounded-full border-2 border-[#E8B498] shadow-[0_0_10px_#E8B498] transition-transform duration-75 ease-out"
            style={{ transform: `rotate(${scrollProgress * 3.6}deg)` }}
          >
            {/* Solitaire diamond node attached to the rotating ring */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rotate-45 shadow-[0_0_8px_#FFFFFF] border border-[#E8B498]" />
          </div>
          {/* Inner pulse spark */}
          <div className="absolute w-1.5 h-1.5 rounded-full bg-[#E8B498] group-hover:animate-ping" />
        </div>

        {/* Text Details */}
        <div className="hidden sm:block pr-1">
          <div className="text-[9px] uppercase tracking-widest text-[#E8B498]/70 font-mono leading-none">
            CHƯƠNG {chapters[activeChapterIdx]?.num}
          </div>
          <div className="text-xs font-serif font-bold text-white tracking-wide truncate max-w-[100px]">
            {activeChapter}
          </div>
        </div>

        <Compass className={`w-3.5 h-3.5 text-[#E8B498] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </motion.button>
    </div>
  );
}
