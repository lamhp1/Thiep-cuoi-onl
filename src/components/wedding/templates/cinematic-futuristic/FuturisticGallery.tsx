import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Maximize2,
  Play,
  Pause,
  Heart,
  Grid,
  Layers,
  Film,
  Zap,
  Radio,
  Sliders,
  Compass,
} from 'lucide-react';
import { WeddingData, GalleryPhoto } from '../../../../types';

interface FuturisticGalleryProps {
  data: WeddingData;
}

type DisplayMode = 'hologram' | 'bento' | 'stream';

export function FuturisticGallery({ data }: FuturisticGalleryProps) {
  const defaultPhotos: GalleryPhoto[] = [
    {
      id: 'g-1',
      url:
        data.coverImage ||
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
      caption: 'Kỷ nguyên tình yêu vĩnh cửu - Khởi đầu hành trình ánh sáng',
      category: 'prewedding',
    },
    {
      id: 'g-2',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      caption: 'Ánh mắt giao thoa lượng tử - Khoảnh khắc thời gian ngưng đọng',
      category: 'prewedding',
    },
    {
      id: 'g-3',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      caption: 'Vòng tay bình yên vượt qua mọi giới hạn không-thời gian',
      category: 'moments',
    },
    {
      id: 'g-4',
      url: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
      caption: 'Dạ tiệc ánh sáng và những nụ cười rạng rỡ của bạn bè',
      category: 'ceremony',
    },
    {
      id: 'g-5',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      caption: 'Lời thề son sắt trao nhẫn cưới kết nối hai tâm hồn',
      category: 'ceremony',
    },
    {
      id: 'g-6',
      url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
      caption: 'Hạnh phúc đong đầy trong từng nhịp thở của tương lai',
      category: 'moments',
    },
    {
      id: 'g-7',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Hành tinh của riêng hai người - Nơi tình yêu là quy luật duy nhất',
      category: 'prewedding',
    },
    {
      id: 'g-8',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
      caption: 'Mãi bên nhau qua mọi ngân hà và dặm trường năm tháng',
      category: 'moments',
    },
  ];

  const photos = data.gallery && data.gallery.length > 0 ? data.gallery : defaultPhotos;

  // States
  const [displayMode, setDisplayMode] = useState<DisplayMode>('hologram');
  const [filter, setFilter] = useState<'all' | 'prewedding' | 'ceremony' | 'moments'>('all');
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isAutoCruise, setIsAutoCruise] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  const filteredPhotos = photos.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  // Clamp active stage index if list changes
  useEffect(() => {
    if (activeStageIndex >= filteredPhotos.length) {
      setActiveStageIndex(0);
    }
  }, [filteredPhotos.length, activeStageIndex]);

  // Auto cruise timer for Hologram 3D mode
  useEffect(() => {
    if (!isAutoCruise || displayMode !== 'hologram' || filteredPhotos.length <= 1) return;

    const timer = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % filteredPhotos.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [isAutoCruise, displayMode, filteredPhotos.length]);

  const activePhoto = filteredPhotos[activeStageIndex] || filteredPhotos[0];

  const handleLike = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    const current = likesMap[photoId] || 0;
    setLikesMap((prev) => ({ ...prev, [photoId]: current + 1 }));

    confetti({
      particleCount: 25,
      spread: 45,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#00F0FF', '#FF2E93', '#A855F7'],
    });
  };

  const handlePrevStage = () => {
    setActiveStageIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  };

  const handleNextStage = () => {
    setActiveStageIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  };

  const activeLightboxPhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] || null : null;

  return (
    <section
      id="gallery"
      className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto text-neutral-200 overflow-hidden font-body select-none"
    >
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-br from-[#00F0FF]/10 via-[#A855F7]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-futuristic tracking-widest shadow-neon-cyan">
          <Camera className="w-3.5 h-3.5 animate-pulse" />
          <span>LĂNG KÍNH ĐA CHIỀU // QUANTUM HOLO-MATRIX GALLERY</span>
        </div>

        <h2 className="font-futuristic text-3xl sm:text-5xl font-extrabold tracking-wide text-white">
          Bộ Sưu Tập Hình Ảnh Kỷ Nguyên
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-xl mx-auto">
          [Những khoảnh khắc định mệnh được lưu giữ vĩnh cửu trong không gian lượng tử đa chiều]
        </p>
      </div>

      {/* Futuristic Control HUD Bar: View Mode Switcher + Category Filters */}
      <div className="relative z-10 max-w-5xl mx-auto mb-10 space-y-5">
        {/* 1. Mode Switcher (Sân khấu 3D / Bento / Dòng chảy) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090E26]/90 border border-[#00F0FF]/40 rounded-2xl p-2 sm:p-2.5 backdrop-blur-xl shadow-neon-cyan">
          <div className="flex items-center gap-1.5 text-xs font-futuristic text-[#00F0FF] px-2 py-1">
            <Radio className="w-4 h-4 animate-pulse text-[#00F0FF]" />
            <span className="hidden sm:inline">CHẾ ĐỘ HIỂN THỊ:</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => setDisplayMode('hologram')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-futuristic font-bold flex items-center gap-2 transition-all cursor-pointer ${
                displayMode === 'hologram'
                  ? 'bg-gradient-to-r from-[#00F0FF] to-[#00A8FF] text-[#050711] shadow-neon-cyan scale-102'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SÂN KHẤU 3D HOLOGRAM</span>
            </button>

            <button
              onClick={() => setDisplayMode('bento')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-futuristic font-bold flex items-center gap-2 transition-all cursor-pointer ${
                displayMode === 'bento'
                  ? 'bg-gradient-to-r from-[#A855F7] to-[#FF2E93] text-white shadow-neon-purple scale-102'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>MA TRẬN BENTO ĐIỆN ẢNH</span>
            </button>

            <button
              onClick={() => setDisplayMode('stream')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-futuristic font-bold flex items-center gap-2 transition-all cursor-pointer ${
                displayMode === 'stream'
                  ? 'bg-gradient-to-r from-[#FF2E93] to-[#F5D061] text-[#050711] shadow-neon-pink scale-102'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>DÒNG CHẢY LƯỢNG TỬ</span>
            </button>
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'TẤT CẢ HÌNH ẢNH' },
            { id: 'prewedding', label: 'CYBER PRE-WEDDING' },
            { id: 'ceremony', label: 'NGHI LỄ THÀNH HÔN' },
            { id: 'moments', label: 'KHOẢNH KHẮC ĐỜI THƯỜNG' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-futuristic tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#00F0FF]/25 border border-[#00F0FF] text-[#00F0FF] font-bold shadow-neon-cyan'
                  : 'bg-[#090E26]/60 text-neutral-400 border border-neutral-800 hover:border-neutral-600 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: SÂN KHẤU 3D HOLOGRAPHIC (Hologram Depth Cylindrical Stage)
          ========================================================================= */}
      {displayMode === 'hologram' && (
        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          {/* Main 3D Perspective Stage Container */}
          <div className="relative h-[480px] sm:h-[540px] md:h-[580px] w-full flex items-center justify-center overflow-hidden rounded-3xl bg-[#090E26]/70 border border-[#00F0FF]/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)]">
            {/* Holographic Circular Emitter Floor */}
            <div className="absolute bottom-2 inset-x-0 h-40 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-[85%] h-24 rounded-full border-2 border-[#00F0FF] shadow-[0_0_40px_#00F0FF] animate-pulse" />
              <div className="absolute w-[60%] h-14 rounded-full border border-dashed border-[#FF2E93] shadow-[0_0_30px_#FF2E93]" />
            </div>

            {/* Stage Left Image (Ghost Perspective) */}
            {filteredPhotos.length > 1 && (
              <div
                onClick={handlePrevStage}
                className="hidden sm:block absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-48 md:w-64 h-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer opacity-30 hover:opacity-70 transition-all duration-500 scale-90 -rotate-y-12 z-0 border border-cyan-500/30 shadow-lg group"
                style={{ perspective: 1000 }}
              >
                <img
                  src={
                    filteredPhotos[
                      (activeStageIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                    ]?.url
                  }
                  alt="Ảnh trước"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#050711]/60" />
              </div>
            )}

            {/* Stage Right Image (Ghost Perspective) */}
            {filteredPhotos.length > 1 && (
              <div
                onClick={handleNextStage}
                className="hidden sm:block absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-48 md:w-64 h-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer opacity-30 hover:opacity-70 transition-all duration-500 scale-90 rotate-y-12 z-0 border border-purple-500/30 shadow-lg group"
                style={{ perspective: 1000 }}
              >
                <img
                  src={filteredPhotos[(activeStageIndex + 1) % filteredPhotos.length]?.url}
                  alt="Ảnh sau"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#050711]/60" />
              </div>
            )}

            {/* Center Stage Holographic Master Frame */}
            <AnimatePresence mode="wait">
              {activePhoto && (
                <motion.div
                  key={activePhoto.id || activeStageIndex}
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -15 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="relative z-10 w-[90%] sm:w-[500px] md:w-[580px] h-[360px] sm:h-[440px] md:h-[480px] rounded-2xl overflow-hidden border-2 border-[#00F0FF] shadow-[0_0_60px_rgba(0,240,255,0.4)] group"
                >
                  {/* Cyber Crosshairs & Optical Ring */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF] z-20" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF] z-20" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#A855F7] z-20" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#A855F7] z-20" />

                  {/* Laser Scanning Beam */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-laser-sweep z-20 pointer-events-none" />

                  {/* Optical Scanline Grid Overlay */}
                  <div className="absolute inset-0 cyber-scanline-overlay opacity-30 pointer-events-none z-10" />

                  {/* Telemetry Badge Top Right */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#050711]/85 border border-[#00F0FF]/50 text-[#00F0FF] text-[10px] font-mono tracking-widest backdrop-blur-md">
                      HOLO_8K // 0{activeStageIndex + 1}
                    </span>
                  </div>

                  {/* Fullscreen Trigger Button Top Left */}
                  <button
                    onClick={() => setLightboxIndex(activeStageIndex)}
                    className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-[#050711]/85 hover:bg-[#00F0FF]/30 border border-[#00F0FF]/50 text-[#00F0FF] cursor-pointer backdrop-blur-md transition-colors shadow-sm"
                    title="Phóng to toàn màn hình"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* The Image */}
                  <img
                    src={activePhoto.url}
                    alt={activePhoto.caption || 'Ảnh cưới Kỷ Nguyên'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />

                  {/* Lower Info & Like HUD Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050711] via-[#050711]/80 to-transparent p-4 sm:p-6 z-20 flex flex-col justify-end space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#00F0FF]">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                          <span>TỌA ĐỘ VĨNH CỬU // 2026.09.18</span>
                        </div>
                        <h3 className="font-futuristic text-base sm:text-lg font-bold text-white truncate">
                          {activePhoto.caption || 'Khoảnh khắc thiêng liêng'}
                        </h3>
                      </div>

                      {/* Interactive Heart Reaction Button */}
                      <button
                        onClick={(e) => handleLike(e, activePhoto.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF2E93]/20 to-[#A855F7]/20 hover:from-[#FF2E93]/40 hover:to-[#A855F7]/40 border border-[#FF2E93]/50 text-white font-futuristic text-xs font-bold cursor-pointer transition-transform active:scale-90 shrink-0 shadow-neon-pink"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#FF2E93] fill-[#FF2E93]" />
                        <span>{likesMap[activePhoto.id] || 99}+</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Orbit Arrows */}
            {filteredPhotos.length > 1 && (
              <>
                <button
                  onClick={handlePrevStage}
                  className="absolute left-3 sm:left-6 z-30 p-3 sm:p-4 rounded-full bg-[#050711]/90 hover:bg-[#00F0FF]/30 border border-[#00F0FF] text-white hover:text-[#00F0FF] cursor-pointer shadow-neon-cyan transition-all active:scale-95"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNextStage}
                  className="absolute right-3 sm:right-6 z-30 p-3 sm:p-4 rounded-full bg-[#050711]/90 hover:bg-[#00F0FF]/30 border border-[#00F0FF] text-white hover:text-[#00F0FF] cursor-pointer shadow-neon-cyan transition-all active:scale-95"
                  aria-label="Ảnh kế tiếp"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Stage Bottom Floating Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090E26]/80 border border-[#00F0FF]/30 rounded-2xl p-3 backdrop-blur-xl">
            {/* Auto Cruise Toggle */}
            <button
              onClick={() => setIsAutoCruise(!isAutoCruise)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-futuristic text-[#00F0FF] border border-[#00F0FF]/30 cursor-pointer transition-colors"
            >
              {isAutoCruise ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#F5D061]" />
                  <span>DỪNG TỰ ĐỘNG DU HÀNH</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>BẬT TỰ ĐỘNG DU HÀNH // AUTO CRUISE</span>
                </>
              )}
            </button>

            {/* Quick Thumbnail Shard Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-md no-scrollbar">
              {filteredPhotos.map((photo, idx) => (
                <button
                  key={photo.id || idx}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                    activeStageIndex === idx
                      ? 'border-[#00F0FF] shadow-neon-cyan scale-110 ring-1 ring-[#00F0FF]'
                      : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {activeStageIndex === idx && (
                    <div className="absolute inset-0 bg-[#00F0FF]/20 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={() => setLightboxIndex(activeStageIndex)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00F0FF]/20 hover:bg-[#00F0FF]/35 text-[#00F0FF] border border-[#00F0FF]/50 text-xs font-futuristic font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>XEM CHI TIẾT 8K</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: MA TRẬN BENTO ĐIỆN ẢNH (Cyber Bento Matrix)
          ========================================================================= */}
      {displayMode === 'bento' && (
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-[240px] sm:auto-rows-[280px]">
            {/* Bento Block 1: Massive Hero 2x2 Showcase */}
            {filteredPhotos[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setLightboxIndex(0)}
                className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden bg-[#090E26] border-2 border-[#00F0FF]/60 hover:border-[#00F0FF] shadow-neon-cyan group cursor-pointer"
              >
                <img
                  src={filteredPhotos[0].url}
                  alt={filteredPhotos[0].caption || 'Ảnh cưới chính'}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 cyber-scanline-overlay opacity-25 pointer-events-none" />
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-laser-sweep pointer-events-none" />

                {/* Hero Badge */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#050711]/90 border border-[#00F0FF] text-[#00F0FF] text-xs font-futuristic font-bold tracking-widest shadow-neon-cyan flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#F5D061]" />
                  <span>HERO SHOWCASE // MASTER_FRAME</span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#050711] via-[#050711]/40 to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-mono text-[#00F0FF] tracking-wider">
                    RESOLUTION: 8K CINEMA • QUANTUM SHARD
                  </span>
                  <h3 className="font-futuristic text-xl sm:text-2xl font-bold text-white mt-1">
                    {filteredPhotos[0].caption || 'Khoảnh khắc mở đầu kỷ nguyên'}
                  </h3>
                </div>
              </motion.div>
            )}

            {/* Bento Block 2: Quantum Telemetry Stats Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0D152D] via-[#140C33] to-[#090E26] border border-[#A855F7]/50 p-6 flex flex-col justify-between shadow-neon-purple font-mono">
              <div className="flex items-center justify-between text-xs text-[#A855F7]">
                <span>TELEMETRY_LOG</span>
                <Compass className="w-4 h-4 animate-spin text-[#00F0FF]" style={{ animationDuration: '10s' }} />
              </div>

              <div className="space-y-3 my-auto">
                <div className="space-y-0.5">
                  <p className="text-[10px] text-neutral-400">TỔNG LƯU TRỮ KHOẢNH KHẮC</p>
                  <p className="text-2xl font-futuristic font-bold text-white">
                    {photos.length} KHUNG HÌNH
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-neutral-400">TẦN SỐ ĐỒNG ĐIỆU TRÁI TIM</p>
                  <p className="text-sm font-futuristic font-bold text-[#00F0FF]">
                    528 Hz (LOVE FREQUENCY)
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px] text-neutral-400 flex items-center justify-between">
                <span>STATUS: IMMUTABLE</span>
                <span className="text-emerald-400">100% ONLINE</span>
              </div>
            </div>

            {/* Bento Block 3+: Remaining photos in alternating shapes */}
            {filteredPhotos.slice(1).map((photo, index) => {
              const actualIndex = index + 1;
              const isWide = index === 2 || index === 5;

              return (
                <motion.div
                  key={photo.id || actualIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => setLightboxIndex(actualIndex)}
                  className={`group relative rounded-3xl overflow-hidden bg-[#090E26] border border-[#00F0FF]/30 hover:border-[#00F0FF] shadow-neon-cyan transition-all duration-300 cursor-pointer ${
                    isWide ? 'md:col-span-2' : ''
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Ảnh cưới'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 cyber-scanline-overlay opacity-25 pointer-events-none" />

                  {/* Corner Target Markers */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Hover Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050711] via-[#050711]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="overflow-hidden">
                        <span className="text-[10px] font-mono text-[#00F0FF]">
                          FRAME_0{actualIndex + 1}
                        </span>
                        <p className="font-futuristic text-sm font-bold text-white truncate">
                          {photo.caption || 'Khoảnh khắc hạnh phúc'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleLike(e, photo.id)}
                        className="p-2 rounded-full bg-white/10 hover:bg-[#FF2E93]/30 text-white hover:text-[#FF2E93] cursor-pointer transition-colors shrink-0"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: DÒNG CHẢY LƯỢNG TỬ (Quantum Hyper-Stream Reel)
          ========================================================================= */}
      {displayMode === 'stream' && (
        <div className="relative z-10 space-y-6 max-w-6xl mx-auto overflow-hidden">
          <div className="text-center text-xs font-mono text-neutral-400">
            [Rê chuột vào ảnh để tạm dừng dòng thời gian & Bấm để phóng to 8K]
          </div>

          {/* Reel Track 1: Moving Right */}
          <div className="relative overflow-hidden py-3 group">
            <div className="flex gap-5 animate-marquee group-hover:[animation-play-state:paused] w-max">
              {[...filteredPhotos, ...filteredPhotos].map((photo, idx) => (
                <div
                  key={`${photo.id}-track1-${idx}`}
                  onClick={() => setLightboxIndex(idx % filteredPhotos.length)}
                  className="relative w-72 sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden border border-[#00F0FF]/40 hover:border-[#00F0FF] shadow-neon-cyan shrink-0 cursor-pointer group/item transition-transform hover:scale-104 duration-300"
                >
                  <img
                    src={photo.url}
                    alt="Reel"
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050711] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs font-futuristic font-bold text-white truncate">
                    {photo.caption || 'Khoảnh khắc bất diệt'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reel Track 2: Moving Left */}
          {filteredPhotos.length > 3 && (
            <div className="relative overflow-hidden py-3 group">
              <div className="flex gap-5 animate-marquee-reverse group-hover:[animation-play-state:paused] w-max">
                {[...filteredPhotos.slice().reverse(), ...filteredPhotos.slice().reverse()].map(
                  (photo, idx) => (
                    <div
                      key={`${photo.id}-track2-${idx}`}
                      onClick={() => setLightboxIndex(idx % filteredPhotos.length)}
                      className="relative w-72 sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden border border-[#A855F7]/40 hover:border-[#FF2E93] shadow-neon-purple shrink-0 cursor-pointer group/item transition-transform hover:scale-104 duration-300"
                    >
                      <img
                        src={photo.url}
                        alt="Reel Reverse"
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050711] via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-3 right-3 text-xs font-futuristic font-bold text-white truncate">
                        {photo.caption || 'Khoảnh khắc bất diệt'}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          8K QUANTUM HOLO-VIEWER LIGHTBOX MODAL
          ========================================================================= */}
      <AnimatePresence>
        {activeLightboxPhoto && (
          <div
            className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-8 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Lightbox Top HUD Bar */}
            <div
              className="w-full max-w-5xl flex items-center justify-between text-xs font-mono text-[#00F0FF] border-b border-[#00F0FF]/30 pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                <span className="font-futuristic font-bold text-white">
                  HOLO_VIEWER // FRAME {lightboxIndex! + 1} / {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleLike(
                      { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as any,
                      activeLightboxPhoto.id
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2E93]/20 hover:bg-[#FF2E93]/35 text-[#FF2E93] border border-[#FF2E93]/40 cursor-pointer transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{likesMap[activeLightboxPhoto.id] || 99} Thả tim</span>
                </button>

                <button
                  onClick={() => setLightboxIndex(null)}
                  className="text-neutral-400 hover:text-white px-3.5 py-1 rounded-full border border-neutral-700 hover:border-white cursor-pointer font-futuristic text-xs transition-colors"
                >
                  [ĐÓNG X]
                </button>
              </div>
            </div>

            {/* Main Image in Viewport with HUD Crosshair Frame */}
            <div
              className="relative max-w-4xl max-h-[72vh] my-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeLightboxPhoto.url}
                alt={activeLightboxPhoto.caption || 'Ảnh cưới phóng to'}
                className="max-h-[70vh] max-w-full rounded-2xl border-2 border-[#00F0FF] shadow-[0_0_60px_rgba(0,240,255,0.4)] object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next buttons */}
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev! > 0 ? prev! - 1 : filteredPhotos.length - 1
                      )
                    }
                    className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-[#050711]/90 hover:bg-[#00F0FF]/30 border border-[#00F0FF] text-white hover:text-[#00F0FF] cursor-pointer transition-all shadow-neon-cyan"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setLightboxIndex((prev) =>
                        prev! < filteredPhotos.length - 1 ? prev! + 1 : 0
                      )
                    }
                    className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-[#050711]/90 hover:bg-[#00F0FF]/30 border border-[#00F0FF] text-white hover:text-[#00F0FF] cursor-pointer transition-all shadow-neon-cyan"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Bottom Caption HUD */}
            <div
              className="w-full max-w-5xl text-center space-y-1 text-xs font-mono text-neutral-400 border-t border-[#00F0FF]/30 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-futuristic text-base font-bold text-[#F5D061]">
                {activeLightboxPhoto.caption || 'Kỷ niệm tình yêu bất diệt qua mọi không-thời gian'}
              </p>
              <span className="text-[11px] text-neutral-500">
                TELEMETRY: APERTURE F/1.2 • EXPOSURE 1/4000s • ISO 100 • QUANTUM SHARD 2026
              </span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
