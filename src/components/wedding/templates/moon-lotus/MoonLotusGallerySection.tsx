import React, { useState, useEffect, useRef } from 'react';
import { GalleryPhoto } from '../../../../types';
import {
  Sparkles,
  Moon,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Heart,
  Play,
  Pause,
  Grid,
  Eye,
  Camera,
  Share2,
  Compass,
} from 'lucide-react';
import { playMoonlightChime } from './MoonLotusOrnaments';

interface MoonLotusGallerySectionProps {
  gallery?: GalleryPhoto[];
}

interface PhotoItem extends GalleryPhoto {
  categoryTitle?: string;
  tag?: string;
}

// Corner filigree decoration SVG component for luxury framing
function GoldCornerOrnament({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const rotation = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <div className={`absolute ${position.split('-')[0]}-1.5 ${position.split('-')[1]}-1.5 z-20 pointer-events-none transform ${rotation}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#EBD494] opacity-80 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        <path d="M 2 2 L 14 2 C 14 6, 6 14, 2 14 Z" fill="currentColor" fillOpacity="0.2" />
        <path d="M 2 2 L 18 2 C 18 8, 8 18, 2 18 Z" stroke="currentColor" strokeWidth="1" />
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
        <path d="M 2 8 C 5 8, 8 5, 8 2" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// Lotus wax seal stamp on photos
function LotusWaxSeal({ number }: { number: string }) {
  return (
    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#350814]/85 backdrop-blur-md border border-[#EBD494]/60 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      <Moon className="w-3 h-3 text-[#EBD494]" />
      <span className="text-[10px] font-serif uppercase tracking-widest text-[#F4E4BA] font-semibold">
        {number}
      </span>
    </div>
  );
}

export function MoonLotusGallerySection({ gallery }: MoonLotusGallerySectionProps) {
  const defaultImages: PhotoItem[] = (gallery && gallery.length > 0 ? gallery : [
    {
      id: 'g-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      caption: 'Nụ cười rạng rỡ dưới ánh hoàng hôn ngả bóng',
      category: 'prewedding',
      categoryTitle: 'Hoàng Hôn & Dạ Nguyệt',
      tag: 'Tuần Trăng I',
    },
    {
      id: 'g-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      caption: 'Tay trong tay bước vào dạ yến trăm năm viên mãn',
      category: 'ceremony',
      categoryTitle: 'Dạ Yến Uyên Ương',
      tag: 'Tuần Trăng II',
    },
    {
      id: 'g-3',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
      caption: 'Khoảnh khắc trao nhẫn thề nguyền dưới ánh sao đêm',
      category: 'ceremony',
      categoryTitle: 'Lời Thề Nguyện',
      tag: 'Tuần Trăng III',
    },
    {
      id: 'g-4',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      caption: 'Ánh mắt đong đầy yêu thương ngàn thu thuở hẹn',
      category: 'moments',
      categoryTitle: 'Hương Sen Ái Tình',
      tag: 'Tuần Trăng IV',
    },
    {
      id: 'g-5',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Hương sen thơm ngát giữa hồ trăng bích nguyệt',
      category: 'prewedding',
      categoryTitle: 'Hoàng Hôn & Dạ Nguyệt',
      tag: 'Tuần Trăng V',
    },
    {
      id: 'g-6',
      url: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
      caption: 'Trăng dạ nguyệt soi bóng đôi uyên ương trọn kiếp',
      category: 'moments',
      categoryTitle: 'Dạ Yến Uyên Ương',
      tag: 'Tuần Trăng VI',
    },
    {
      id: 'g-7',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
      caption: 'Bản hòa ca tình yêu ngân vang cùng gió đêm ngát hương',
      category: 'moments',
      categoryTitle: 'Lời Thề Nguyện',
      tag: 'Tuần Trăng VII',
    },
    {
      id: 'g-8',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85',
      caption: 'Cùng chung một bóng trăng, thề nguyền sánh bước chung đôi',
      category: 'ceremony',
      categoryTitle: 'Hương Sen Ái Tình',
      tag: 'Tuần Trăng VIII',
    },
  ]);

  // View mode: 'spotlight' (Moon Gate Showcase) or 'mosaic' (Celestial Mosaic Grid)
  const [viewMode, setViewMode] = useState<'spotlight' | 'mosaic'>('spotlight');

  // Filter category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Spotlight index
  const [spotlightIdx, setSpotlightIdx] = useState<number>(0);

  // Auto Slideshow state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Lightbox index
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Likes tracking state (photoId -> count)
  const [likes, setLikes] = useState<Record<string, number>>(() => ({
    'g-1': 38,
    'g-2': 42,
    'g-3': 56,
    'g-4': 29,
    'g-5': 34,
    'g-6': 47,
    'g-7': 31,
    'g-8': 50,
  }));

  // Transient sparkle particles for heart reactions
  const [floatingPetals, setFloatingPetals] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Filter images
  const filteredImages = defaultImages.filter((img) => {
    if (selectedCategory === 'all') return true;
    return img.category === selectedCategory;
  });

  // Ensure spotlightIdx is within bounds
  const currentSpotlightPhoto = filteredImages[spotlightIdx] || filteredImages[0] || defaultImages[0];

  // Auto slideshow timer
  useEffect(() => {
    if (!isPlaying || filteredImages.length <= 1) return;
    const interval = setInterval(() => {
      setSpotlightIdx((prev) => (prev + 1) % filteredImages.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPlaying, filteredImages.length]);

  // Handle like with chime and floating petal
  const handleLike = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    playMoonlightChime();

    setLikes((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + 1,
    }));

    // Trigger floating particles
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newPetal = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setFloatingPetals((prev) => [...prev, newPetal]);
    setTimeout(() => {
      setFloatingPetals((prev) => prev.filter((p) => p.id !== newPetal.id));
    }, 1200);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : 0
        );
      }
      if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) =>
          prev !== null ? (prev + 1) % filteredImages.length : 0
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, filteredImages.length]);

  const categories = [
    { id: 'all', label: 'Tất Cả Khoảnh Khắc', icon: '🌕' },
    { id: 'ceremony', label: 'Dạ Yến & Thề Nguyện', icon: '💍' },
    { id: 'prewedding', label: 'Bến Trăng Hoàng Hôn', icon: '🌅' },
    { id: 'moments', label: 'Hương Sen Ái Tình', icon: '🌸' },
  ];

  return (
    <section id="gallery" className="relative py-24 px-4 sm:px-6 lg:px-8 z-20 overflow-hidden">
      {/* Background celestial lotus watermark aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none blur-[140px] opacity-25 bg-gradient-to-tr from-[#751A29] via-[#EBD494]/20 to-[#0A102A]" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/40 text-[#F4E4BA] text-xs font-serif uppercase tracking-[0.2em] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#EBD494] animate-pulse" />
            <span>KHOẢNH KHẮC DẠ NGUYỆT • UNDER THE SAME MOON</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-title font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF7] via-[#F4E4BA] to-[#EBD494]">
            Album Hình Cưới Dạ Nguyệt
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-[#F4E4BA]/85 max-w-xl mx-auto leading-relaxed">
            “Thủy để kình hoa, thiên thượng nguyệt — Đôi tim cùng hướng một tuần trăng viên mãn.”
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#EBD494]/60 to-transparent" />
            <Moon className="w-4 h-4 text-[#EBD494]" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#EBD494]/60 to-transparent" />
          </div>
        </div>

        {/* 2. Control Bar: Category Pills & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-[#090D24]/70 border border-[#EBD494]/30 backdrop-blur-md shadow-xl">
          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSpotlightIdx(0);
                }}
                className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-serif tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#751A29] to-[#A8283D] text-[#FFFDF7] font-semibold shadow-md border border-[#EBD494]/60 scale-[1.02]'
                    : 'text-[#F4E4BA]/70 hover:text-[#FFFDF7] hover:bg-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle & Auto Play */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {viewMode === 'spotlight' && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif transition-all border ${
                  isPlaying
                    ? 'bg-[#EBD494] text-[#350814] font-bold border-[#EBD494] shadow-[0_0_12px_rgba(235,212,148,0.5)]'
                    : 'bg-white/5 text-[#F4E4BA] border-[#EBD494]/30 hover:bg-white/10'
                }`}
                title={isPlaying ? 'Tạm dừng trình chiếu tự động' : 'Tự động thưởng nguyệt (Auto Slideshow)'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isPlaying ? 'Đang Chiếu' : 'Tự Động'}</span>
              </button>
            )}

            <div className="flex rounded-xl p-1 bg-[#120D2A]/80 border border-[#EBD494]/25">
              <button
                onClick={() => setViewMode('spotlight')}
                className={`cursor-pointer p-1.5 rounded-lg text-xs font-serif flex items-center gap-1.5 transition-all ${
                  viewMode === 'spotlight'
                    ? 'bg-[#751A29] text-[#FFFDF7] shadow-sm font-semibold'
                    : 'text-[#F4E4BA]/60 hover:text-[#FFFDF7]'
                }`}
                title="Chế độ Nguyệt Môn Chiếu Dạ (Spotlight Cinema)"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden lg:inline">Nguyệt Môn</span>
              </button>
              <button
                onClick={() => setViewMode('mosaic')}
                className={`cursor-pointer p-1.5 rounded-lg text-xs font-serif flex items-center gap-1.5 transition-all ${
                  viewMode === 'mosaic'
                    ? 'bg-[#751A29] text-[#FFFDF7] shadow-sm font-semibold'
                    : 'text-[#F4E4BA]/60 hover:text-[#FFFDF7]'
                }`}
                title="Chế độ Kính Hoa Thủy Nguyệt (Bố cục Bích Họa Mosaic)"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden lg:inline">Thủy Nguyệt</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. VIEW MODE 1: THE MOON GATE SPOTLIGHT SHOWCASE */}
        {viewMode === 'spotlight' && (
          <div className="space-y-6">
            {/* Center Moon Gate Master Frame */}
            <div className="relative max-w-4xl mx-auto rounded-3xl p-1 sm:p-2 bg-gradient-to-b from-[#EBD494]/40 via-[#751A29]/30 to-[#EBD494]/20 shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <div className="relative overflow-hidden rounded-[22px] bg-[#0A0D22] border border-[#EBD494]/50 group">
                {/* Filigree corner ornaments */}
                <GoldCornerOrnament position="top-left" />
                <GoldCornerOrnament position="top-right" />
                <GoldCornerOrnament position="bottom-left" />
                <GoldCornerOrnament position="bottom-right" />

                {/* Big Display Image */}
                <div
                  onClick={() => setLightboxIdx(spotlightIdx)}
                  className="cursor-pointer relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden"
                >
                  <img
                    key={currentSpotlightPhoto.id}
                    src={currentSpotlightPhoto.url}
                    alt={currentSpotlightPhoto.caption || 'Ảnh cưới dạ nguyệt'}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  />

                  {/* Shimmering Moonlight Water Ripple Overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0D22] via-[#0A0D22]/60 to-transparent pointer-events-none" />

                  {/* Moon Halo Glow behind center */}
                  <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#EBD494]/15 blur-3xl pointer-events-none" />

                  {/* Top Stamp Tag */}
                  <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#350814]/85 backdrop-blur-md border border-[#EBD494]/60 text-[#F4E4BA] font-serif text-xs font-semibold shadow-md flex items-center gap-1.5">
                      <Moon className="w-3 h-3 text-[#EBD494]" />
                      <span>{currentSpotlightPhoto.tag || `Tuần Trăng ${spotlightIdx + 1}`}</span>
                    </span>
                    {currentSpotlightPhoto.categoryTitle && (
                      <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[#FFFDF7]/80 font-serif text-xs border border-white/10">
                        {currentSpotlightPhoto.categoryTitle}
                      </span>
                    )}
                  </div>

                  {/* Right Actions: Fullscreen View & Heart Reaction */}
                  <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(e, currentSpotlightPhoto.id)}
                      className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#350814]/80 hover:bg-[#751A29] border border-[#EBD494]/50 text-[#F4E4BA] transition-all hover:scale-110 shadow-lg"
                      title="Gửi phước lành dạ nguyệt"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#F49EB0] text-[#F49EB0]" />
                      <span className="text-xs font-serif font-bold">
                        {likes[currentSpotlightPhoto.id] || 36}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIdx(spotlightIdx);
                      }}
                      className="cursor-pointer p-2 rounded-full bg-black/60 hover:bg-[#751A29] text-[#FFFDF7] border border-white/20 transition-all hover:scale-110 shadow-lg"
                      title="Phóng to ảnh"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                      <p className="font-serif-title text-base sm:text-xl text-[#FFFDF7] font-semibold tracking-wide leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {currentSpotlightPhoto.caption || 'Khoảnh khắc trăng tròn thề nguyện trăm năm'}
                      </p>
                      <p className="font-serif text-xs text-[#EBD494]/90 italic">
                        Chạm vào ảnh để chiêm ngưỡng toàn màn hình với âm thanh dạ nguyệt
                      </p>
                    </div>

                    {/* Quick navigation arrows */}
                    <div className="flex items-center gap-2 self-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSpotlightIdx((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
                        }}
                        className="cursor-pointer p-2.5 rounded-full bg-[#350814]/80 hover:bg-[#751A29] border border-[#EBD494]/50 text-[#F4E4BA] transition-all hover:scale-105 shadow-md"
                        title="Ảnh trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-serif text-xs font-bold text-[#EBD494] px-2">
                        {spotlightIdx + 1} / {filteredImages.length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSpotlightIdx((prev) => (prev + 1) % filteredImages.length);
                        }}
                        className="cursor-pointer p-2.5 rounded-full bg-[#350814]/80 hover:bg-[#751A29] border border-[#EBD494]/50 text-[#F4E4BA] transition-all hover:scale-105 shadow-md"
                        title="Ảnh sau"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Floating Moonlight Film Reel (Thumbnails) */}
            <div className="relative py-2">
              <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar scroll-smooth">
                {filteredImages.map((img, idx) => {
                  const isSelected = idx === spotlightIdx;
                  return (
                    <div
                      key={img.id || idx}
                      onClick={() => setSpotlightIdx(idx)}
                      className={`cursor-pointer group flex-shrink-0 relative w-24 sm:w-32 aspect-[4/3] rounded-xl overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? 'ring-2 ring-[#EBD494] scale-105 shadow-[0_0_16px_rgba(235,212,148,0.5)] border-transparent'
                          : 'opacity-65 hover:opacity-100 border border-[#EBD494]/30 hover:scale-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || `Ảnh ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#EBD494]/15 pointer-events-none flex items-center justify-center">
                          <Moon className="w-4 h-4 text-[#FFFDF7] filter drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] animate-pulse" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-[9px] font-serif text-[#F4E4BA] block truncate text-center">
                          {img.tag || `Ảnh ${idx + 1}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. VIEW MODE 2: CELESTIAL ARTISTIC MOSAIC & MOON ORB */}
        {viewMode === 'mosaic' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {filteredImages.map((img, idx) => {
              // Create dynamic editorial visual rhythms
              // Card 0: Feature Master Portrait (cols 7)
              // Card 1: Circular Full Moon Orb (cols 5)
              // Card 2, 3: Square & arched cards
              const isLarge = idx === 0;
              const isCircularMoon = idx === 1;
              const isTall = idx === 3;

              let colSpan = 'lg:col-span-4 sm:col-span-1';
              if (isLarge) colSpan = 'lg:col-span-7 sm:col-span-2';
              else if (isCircularMoon) colSpan = 'lg:col-span-5 sm:col-span-1';
              else if (isTall) colSpan = 'lg:col-span-5 sm:col-span-1';
              else if (idx === 4) colSpan = 'lg:col-span-7 sm:col-span-1';

              // Unique Circular Full Moon Frame for Card 1
              if (isCircularMoon) {
                return (
                  <div
                    key={img.id || idx}
                    onClick={() => setLightboxIdx(idx)}
                    className={`${colSpan} cursor-pointer group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-[#1C091D] to-[#0D0B20] border border-[#EBD494]/40 shadow-xl overflow-hidden hover:border-[#EBD494] transition-all duration-500`}
                  >
                    <GoldCornerOrnament position="top-left" />
                    <GoldCornerOrnament position="top-right" />

                    <div className="text-center mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-serif uppercase tracking-widest text-[#EBD494]">
                        <Moon className="w-3 h-3" />
                        <span>VẦNG TRĂNG TRI KỶ</span>
                      </span>
                    </div>

                    {/* Circular Moon-framed Image */}
                    <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full p-1.5 bg-gradient-to-tr from-[#EBD494] via-[#751A29] to-[#F4E4BA] shadow-[0_0_30px_rgba(235,212,148,0.4)] group-hover:scale-105 transition-transform duration-700">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#090D24]">
                        <img
                          src={img.url}
                          alt={img.caption || 'Trăng tròn tri kỷ'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>

                      {/* Glowing Moon Corona */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#EBD494]/60 animate-ping opacity-25 pointer-events-none" />
                    </div>

                    <div className="mt-4 text-center space-y-1">
                      <p className="font-serif-title text-sm sm:text-base font-semibold text-[#FFFDF7]">
                        {img.caption || 'Trăng dạ nguyệt soi bóng đôi uyên ương'}
                      </p>
                      <p className="font-serif text-xs text-[#EBD494]/80 italic">
                        {img.tag || 'Tuần Trăng Viên Mãn'}
                      </p>
                    </div>

                    {/* Bottom Like button */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={(e) => handleLike(e, img.id)}
                        className="cursor-pointer px-3 py-1 rounded-full bg-[#350814]/80 hover:bg-[#751A29] border border-[#EBD494]/40 text-[#F4E4BA] text-xs font-serif flex items-center gap-1.5 transition-all"
                      >
                        <Heart className="w-3 h-3 text-[#F49EB0] fill-[#F49EB0]" />
                        <span>{likes[img.id] || 42}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={img.id || idx}
                  onClick={() => setLightboxIdx(idx)}
                  className={`${colSpan} cursor-pointer group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EBD494]/35 bg-[#0D0B20] shadow-xl hover:shadow-[0_12px_36px_rgba(235,212,148,0.25)] hover:border-[#EBD494]/80 transition-all duration-500`}
                >
                  <GoldCornerOrnament position="top-left" />
                  <GoldCornerOrnament position="bottom-right" />
                  <LotusWaxSeal number={img.tag || `NO. 0${idx + 1}`} />

                  <div className={`relative w-full overflow-hidden ${isLarge ? 'aspect-[16/10]' : isTall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                    <img
                      src={img.url}
                      alt={img.caption || `Ảnh cưới ${idx + 1}`}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay with Water Reflection feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D22] via-[#0A0D22]/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Bottom Info */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-20 flex items-end justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-serif uppercase tracking-widest text-[#EBD494] block">
                          {img.categoryTitle || 'Dạ Nguyệt'}
                        </span>
                        <p className="font-serif text-xs sm:text-sm font-semibold text-[#FFFDF7] line-clamp-2 drop-shadow-md">
                          {img.caption || 'Khoảnh khắc trăm năm'}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleLike(e, img.id)}
                        className="cursor-pointer flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#350814]/85 hover:bg-[#751A29] border border-[#EBD494]/50 text-[#F4E4BA] text-xs font-serif transition-transform hover:scale-110 shadow-md"
                      >
                        <Heart className="w-3 h-3 text-[#F49EB0] fill-[#F49EB0]" />
                        <span className="text-[11px] font-bold">{likes[img.id] || 35}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Poetic Closing Quote Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#350814]/60 via-[#120D2A]/80 to-[#0A0D22]/60 border border-[#EBD494]/30 backdrop-blur-md text-center max-w-3xl mx-auto space-y-3 shadow-lg">
          <Moon className="w-5 h-5 text-[#EBD494] mx-auto animate-bounce" />
          <p className="font-serif italic text-sm sm:text-base text-[#F4E4BA] leading-relaxed">
            “Ánh trăng có thể khuyết rồi lại tròn, nhưng tình yêu trao nhau dưới bầu trời này sẽ vẹn nguyên như đóa sen ngàn thu tỏa sắc.”
          </p>
          <p className="text-xs font-serif uppercase tracking-widest text-[#EBD494]/80">
            — MINH ANH &amp; NGỌC MAI —
          </p>
        </div>
      </div>

      {/* 6. IMMERSIVE MOONLIT CINEMA LIGHTBOX MODAL */}
      {lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gradient-to-b from-[#030510]/95 via-[#120D2A]/95 to-[#350814]/95 backdrop-blur-xl animate-fadeIn select-none"
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between text-[#F4E4BA]">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EBD494]/20 border border-[#EBD494]/40 text-xs font-serif font-semibold">
                {filteredImages[lightboxIdx]?.tag || `Ảnh ${lightboxIdx + 1}`}
              </span>
              <span className="text-xs font-serif opacity-75 hidden sm:inline">
                ({lightboxIdx + 1} / {filteredImages.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-[#751A29] text-white border border-white/20 transition-all hover:scale-105"
                title={isZoomed ? 'Thu nhỏ' : 'Phóng to'}
              >
                {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => handleLike(e, filteredImages[lightboxIdx]?.id)}
                className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#751A29] hover:bg-[#8C2033] text-white border border-[#EBD494]/60 transition-all hover:scale-105 shadow-md"
                title="Gửi tim phước lành"
              >
                <Heart className="w-4 h-4 fill-[#F49EB0] text-[#F49EB0]" />
                <span className="text-xs font-serif font-bold">
                  {likes[filteredImages[lightboxIdx]?.id] || 38}
                </span>
              </button>

              <button
                onClick={() => setLightboxIdx(null)}
                className="cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-red-900/80 text-white border border-white/20 transition-all hover:scale-105"
                title="Đóng (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Previous Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) =>
                prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : 0
              );
            }}
            className="cursor-pointer absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#0A0D22]/80 hover:bg-[#751A29] text-[#F4E4BA] hover:text-white border border-[#EBD494]/40 shadow-xl transition-all hover:scale-110"
            title="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Photo Display Frame */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-5xl max-h-[82vh] rounded-3xl overflow-hidden border-2 border-[#EBD494]/60 shadow-[0_0_60px_rgba(235,212,148,0.25)] flex flex-col items-center bg-[#090D24] transition-all duration-300 ${
              isZoomed ? 'scale-110' : 'scale-100'
            }`}
          >
            <GoldCornerOrnament position="top-left" />
            <GoldCornerOrnament position="top-right" />
            <GoldCornerOrnament position="bottom-left" />
            <GoldCornerOrnament position="bottom-right" />

            <img
              src={filteredImages[lightboxIdx]?.url}
              alt={filteredImages[lightboxIdx]?.caption || 'Ảnh cưới'}
              className="max-h-[68vh] w-auto max-w-full object-contain"
            />

            {/* Bottom Caption bar */}
            <div className="w-full p-4 bg-gradient-to-r from-[#350814] via-[#0A0D22] to-[#120D2A] border-t border-[#EBD494]/30 text-center space-y-1">
              <p className="font-serif-title text-sm sm:text-base text-[#FFFDF7] font-semibold">
                {filteredImages[lightboxIdx]?.caption || 'Khoảnh khắc trăm năm trao lời ước nguyện'}
              </p>
              <p className="font-serif text-xs text-[#EBD494]/80 italic">
                {filteredImages[lightboxIdx]?.categoryTitle || 'Dạ Nguyệt Trăm Năm'}
              </p>
            </div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) =>
                prev !== null ? (prev + 1) % filteredImages.length : 0
              );
            }}
            className="cursor-pointer absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#0A0D22]/80 hover:bg-[#751A29] text-[#F4E4BA] hover:text-white border border-[#EBD494]/40 shadow-xl transition-all hover:scale-110"
            title="Ảnh sau"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Thumbnails bar in Lightbox */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 inset-x-0 z-30 flex justify-center px-4"
          >
            <div className="flex items-center gap-2 overflow-x-auto py-1 px-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-xl no-scrollbar">
              {filteredImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setLightboxIdx(idx)}
                  className={`cursor-pointer flex-shrink-0 w-12 h-10 rounded-lg overflow-hidden border transition-all ${
                    idx === lightboxIdx
                      ? 'border-[#EBD494] scale-110 shadow-[0_0_8px_rgba(235,212,148,0.6)]'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Petal Particles when like button clicked */}
      {floatingPetals.map((petal) => (
        <div
          key={petal.id}
          className="fixed z-50 pointer-events-none animate-ping text-[#F49EB0]"
          style={{ left: petal.x, top: petal.y - 20 }}
        >
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#751A29] text-[#FFFDF7] text-[11px] font-serif border border-[#EBD494]">
            <Heart className="w-3 h-3 fill-[#F49EB0]" />
            <span>+1 Phước lành</span>
          </div>
        </div>
      ))}
    </section>
  );
}
