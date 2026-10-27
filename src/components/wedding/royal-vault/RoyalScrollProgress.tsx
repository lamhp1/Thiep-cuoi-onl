import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function RoyalScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('Khởi Đầu');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsVisible(currentScroll > 150);

      // Detect active section
      const sections = [
        { id: 'couple', name: 'Cặp Đôi' },
        { id: 'events', name: 'Lịch Trình' },
        { id: 'ceremony', name: 'Trao Nhẫn' },
        { id: 'story', name: 'Chuyện Tình' },
        { id: 'gallery', name: 'Album Ảnh' },
        { id: 'rsvp', name: 'Xác Nhận Tham Dự' },
        { id: 'gift', name: 'Hộp Mừng Cưới' },
        { id: 'wishes', name: 'Sổ Lưu Bút' },
      ];

      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
            setActiveSection(s.name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Sleek Golden Progress Track */}
      <div className="w-full h-1 bg-black/40 backdrop-blur-sm relative">
        <div
          className="h-full bg-gradient-to-r from-[#C7886D] via-[#E8B498] to-[#FFF3D6] shadow-[0_0_12px_#E8B498] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
        {/* Floating Diamond Indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-[#E8B498] rotate-45 shadow-[0_0_10px_#FFFFFF] transition-all duration-75"
          style={{ left: `calc(${scrollProgress}% - 5px)` }}
        />
      </div>

      {/* Discreet Section Tag on top-right */}
      <div className="max-w-6xl mx-auto px-4 flex justify-end">
        <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-black/75 border border-[#E8B498]/30 text-[10px] text-[#E8B498] font-serif tracking-widest uppercase backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B498] animate-ping" />
          <span>{activeSection}</span>
          <span className="text-white/40">·</span>
          <span className="tabular-nums text-white/80">{Math.round(scrollProgress)}%</span>
        </div>
      </div>
    </div>
  );
}
