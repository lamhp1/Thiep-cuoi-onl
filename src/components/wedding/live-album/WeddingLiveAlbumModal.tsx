import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Heart,
  Download,
  Share2,
  Sparkles,
  Clock,
  Film,
  Calendar,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { WeddingData, LiveAlbumPhoto } from '../../../types';
import { ensureLiveAlbumConfig, getLiveAlbumQuota } from '../../../services/liveAlbumService';
import { weddingAudio } from '../../../lib/audioSynth';
import { useToast } from '../../ui/Toast';

interface WeddingLiveAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  wedding: WeddingData;
  onOpenUpgradeOrAddon?: () => void;
}

export function WeddingLiveAlbumModal({
  isOpen,
  onClose,
  wedding,
  onOpenUpgradeOrAddon,
}: WeddingLiveAlbumModalProps) {
  const { showToast } = useToast();
  const liveAlbum = ensureLiveAlbumConfig(wedding);
  const quota = getLiveAlbumQuota(wedding);
  const photos = liveAlbum.photos || [];

  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState<number>(3500);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    photos.forEach((p) => {
      initial[p.id] = p.likesCount || Math.floor(Math.random() * 20) + 15;
    });
    return initial;
  });
  const [userLikedPhotos, setUserLikedPhotos] = useState<Record<string, boolean>>({});
  const [showHeartExplosion, setShowHeartExplosion] = useState(false);
  const [gameScore, setGameScore] = useState(120);

  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const template = (wedding.template || 'classic-luxury').toLowerCase();
  const packageTier = quota.packageSlug; // 'basic' | 'premium' | 'vip'

  // Filter photos by phase
  const filteredPhotos = selectedPhase === 'all'
    ? photos
    : photos.filter((p) => {
        if (selectedPhase === 'ceremony') return p.phase === 'ceremony' || p.phase === 'preparation';
        if (selectedPhase === 'reception') return p.phase === 'reception';
        if (selectedPhase === 'afterparty') return p.phase === 'afterparty';
        if (selectedPhase === 'moments') return p.phase === 'moments';
        return true;
      });

  // Sound toggle
  const toggleSound = async () => {
    if (isSoundOn) {
      weddingAudio.pause();
      setIsSoundOn(false);
    } else {
      await weddingAudio.play(wedding.musicUrl);
      setIsSoundOn(true);
    }
  };

  // Keyboard navigation & ESC listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePhotoIndex !== null) {
          setActivePhotoIndex(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && activePhotoIndex !== null) {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft' && activePhotoIndex !== null) {
        handlePrevPhoto();
      } else if (e.key === ' ' && activePhotoIndex !== null) {
        e.preventDefault();
        setIsSlideshowPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activePhotoIndex, filteredPhotos.length]);

  // Slideshow ticker
  useEffect(() => {
    if (!isSlideshowPlaying || activePhotoIndex === null) {
      if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current);
      return;
    }

    slideshowTimerRef.current = setInterval(() => {
      setActivePhotoIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % filteredPhotos.length;
      });
    }, slideshowInterval);

    return () => {
      if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current);
    };
  }, [isSlideshowPlaying, activePhotoIndex, filteredPhotos.length, slideshowInterval]);

  const handleNextPhoto = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const handleLikePhoto = (photoId: string) => {
    const isLiked = userLikedPhotos[photoId];
    setUserLikedPhotos((prev) => ({ ...prev, [photoId]: !isLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + (isLiked ? -1 : 1),
    }));

    if (!isLiked) {
      setShowHeartExplosion(true);
      setTimeout(() => setShowHeartExplosion(false), 1200);
      if (template.includes('game')) {
        setGameScore((prev) => prev + 10);
        showToast('+10 Love XP! Đã thả tim ảnh cưới', 'success');
      } else {
        showToast('Đã gửi lời chúc phúc & thả tim cho bức ảnh!', 'success');
      }
    }
  };

  const handleDownload = (photo: LiveAlbumPhoto) => {
    const a = document.createElement('a');
    a.href = photo.url;
    a.download = `lamour-wedding-${wedding.slug}-${photo.id}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Bắt đầu tải ảnh gốc độ nét cao...', 'info');
  };

  if (!isOpen) return null;

  // Determine aesthetic classes
  const isVipTier = packageTier === 'vip' || template.includes('cinematic') || template.includes('vietnamese-modern-luxury');
  const isFuturistic = template.includes('futuristic');
  const isTraditional = template.includes('traditional') || template.includes('cinematic-vietnamese') || template.includes('vietnamese-luxury');
  const isLantern = template.includes('lantern');
  const isMoonLotus = template.includes('moon');
  const isPolaroid = template.includes('polaroid');
  const isGame = template.includes('game');
  const isFloral = template.includes('floral');
  const isPassport = template.includes('passport');
  const isLoveLetter = template.includes('love-letter');

  // Modal Theme wrapper classes
  let containerBg = 'bg-[#121110] text-[#FAF6EE]';
  let accentBorder = 'border-[#D4AF37]/40';
  let headerGlow = 'text-[#D4AF37]';
  let cardClass = 'bg-[#1C1A18] border-neutral-800 text-[#FAF6EE]';

  if (isFuturistic) {
    containerBg = 'bg-[#060814] text-[#F1F5F9]';
    accentBorder = 'border-[#00F0FF]/50';
    headerGlow = 'text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.4)]';
    cardClass = 'bg-[#0B1028]/90 border-[#00F0FF]/30 text-white';
  } else if (isTraditional) {
    containerBg = 'bg-[#4A0A10] text-[#FAF6EE]';
    accentBorder = 'border-[#D4AF37]/60';
    headerGlow = 'text-[#D4AF37]';
    cardClass = 'bg-[#5A0F17]/90 border-[#D4AF37]/40 text-[#FAF6EE]';
  } else if (isLantern) {
    containerBg = 'bg-[#070B18] text-[#FAF6EE]';
    accentBorder = 'border-[#F59E0B]/50';
    headerGlow = 'text-[#F59E0B]';
    cardClass = 'bg-[#0D142E]/90 border-[#F59E0B]/30 text-white';
  } else if (isMoonLotus) {
    containerBg = 'bg-gradient-to-b from-[#250610] via-[#0E0E24] to-[#040817] text-[#FAF6EE]';
    accentBorder = 'border-[#EBD494]/50';
    headerGlow = 'text-[#EBD494]';
    cardClass = 'bg-[#0D132D]/90 border-[#EBD494]/30 text-white';
  } else if (isGame) {
    containerBg = 'bg-[#0A0717] text-white';
    accentBorder = 'border-pink-500/60';
    headerGlow = 'text-pink-400';
    cardClass = 'bg-[#150F2D] border-pink-500/30 text-white';
  } else if (isPolaroid) {
    containerBg = 'bg-[#FAF4EB] text-[#2C2A29]';
    accentBorder = 'border-[#D4AF37]/40';
    headerGlow = 'text-[#D9735A]';
    cardClass = 'bg-white border-[#E8DFCE] text-[#2C2A29] shadow-md';
  } else if (isFloral) {
    containerBg = 'bg-[#FFFDFD] text-[#2C2A29]';
    accentBorder = 'border-[#D97D8A]/50';
    headerGlow = 'text-[#D97D8A]';
    cardClass = 'bg-white border-[#F2DCDD] text-[#2C2A29] shadow-sm';
  }

  const currentPhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <div
      id="wedding-live-album-modal"
      className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-between backdrop-blur-xl bg-black/85 animate-fadeIn font-body"
      role="dialog"
      aria-modal="true"
    >
      {/* Background Decorative Ambient FX */}
      {isTraditional && (
        <div className="fixed inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,#D4AF37_1px,transparent_1px)] bg-[size:32px_32px]" />
      )}
      {isLantern && (
        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,#F59E0B_0%,transparent_70%)]" />
      )}
      {isFuturistic && (
        <div className="fixed inset-0 pointer-events-none opacity-15 bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      )}
      {isFloral && (
        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,#FFC2D1_0%,transparent_60%)]" />
      )}

      {/* Heart Burst Particle Effect */}
      {showHeartExplosion && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="animate-ping text-6xl select-none">💖</div>
        </div>
      )}

      {/* TOP BAR / HEADER */}
      <header
        className={`sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 backdrop-blur-md flex items-center justify-between gap-4 transition-colors ${containerBg} ${accentBorder}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black/30 border border-white/20 flex items-center justify-center shrink-0">
            {isFuturistic ? (
              <Film className="w-5 h-5 text-[#00F0FF]" />
            ) : isTraditional ? (
              <span className="font-serif-title text-lg text-[#D4AF37] font-bold">囍</span>
            ) : (
              <Camera className="w-5 h-5 text-[#D4AF37]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className={`font-serif-title text-base sm:text-lg font-bold tracking-wide uppercase ${headerGlow}`}>
                {isFuturistic
                  ? 'QUANTUM LIVE ALBUM • KHOẢNH KHẮC NGÀY CƯỚI'
                  : isTraditional
                  ? 'SỬ THI HỶ SỰ • ALBUM ẢNH NGÀY CƯỚI'
                  : isVipTier
                  ? 'CINEMATIC PREMIERE • ALBUM NGÀY CƯỚI'
                  : 'ALBUM KHOẢNH KHẮC NGÀY CƯỚI'}
              </h2>

              {/* Package Badge */}
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isVipTier
                    ? 'bg-linear-to-r from-amber-500 to-amber-700 text-neutral-900 border border-amber-300'
                    : packageTier === 'premium'
                    ? 'bg-[#D4AF37]/20 text-[#E5C058] border border-[#D4AF37]/50'
                    : 'bg-neutral-700 text-neutral-300'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>{quota.packageName}</span>
              </span>
            </div>

            <p className="text-xs opacity-75 truncate max-w-xs sm:max-w-md">
              {wedding.groomName} & {wedding.brideName} • Ngày {wedding.weddingDate}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Cinema Slideshow Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              if (activePhotoIndex === null && filteredPhotos.length > 0) {
                setActivePhotoIndex(0);
              }
              setIsSlideshowPlaying(!isSlideshowPlaying);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isSlideshowPlaying
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            title="Tự động phát trình chiếu ảnh như rạp phim"
          >
            {isSlideshowPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dừng chiếu</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Rạp phim (Slideshow)</span>
              </>
            )}
          </button>

          {/* Sound ambient toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isSoundOn
                ? 'bg-[#D4AF37]/30 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
            title={isSoundOn ? 'Tắt nhạc nền album' : 'Bật nhạc nền lãng mạn'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close button */}
          <button
            id="close-live-album-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Đóng album"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* FILTER TABS & QUOTA BAR */}
      <div className={`px-4 sm:px-8 py-3 border-b backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 ${containerBg} ${accentBorder}`}>
        <div className="flex items-center gap-1.5 overflow-x-auto tab-scrollbar pb-1 text-xs">
          {[
            { id: 'all', label: `Tất cả (${photos.length})` },
            { id: 'ceremony', label: 'Lễ Gia Tiên & Rước Dâu' },
            { id: 'reception', label: 'Tiệc Cưới & Nâng Ly' },
            { id: 'moments', label: 'Khoảnh Khắc Đẹp' },
            { id: 'afterparty', label: 'After-Party' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedPhase(tab.id);
                if (activePhotoIndex !== null) setActivePhotoIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedPhase === tab.id
                  ? 'bg-[#D4AF37] text-neutral-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/15 text-white/80 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quota & Capacity Info Indicator */}
        <div className="flex items-center gap-3 text-xs opacity-85">
          <span>
            Ảnh ngày cưới: <strong>{photos.length}</strong> • Bộ đếm chung: <strong>{quota.currentCount}</strong>/{quota.totalLimit} ảnh
          </span>

          {quota.extraPurchased > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              +{quota.extraPurchased} mua thêm
            </span>
          )}

          {isGame && (
            <span className="px-2.5 py-0.5 rounded-full bg-pink-900/60 text-pink-300 border border-pink-500/50 text-[11px] font-mono font-bold animate-pulse">
              ❤️ LOVE XP: {gameScore}
            </span>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Empty state when no photos have been uploaded yet */}
        {photos.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-300">
              <Camera className="w-10 h-10" />
            </div>
            <h3 className="font-serif-title text-2xl font-bold">
              Khoảnh Khắc Ngày Cưới Sắp Được Cập Nhật!
            </h3>
            <p className="text-sm opacity-75 leading-relaxed">
              Cô dâu {wedding.brideName} & Chú rể {wedding.groomName} sẽ tải lên những bức ảnh đẹp nhất chụp trong ngày lễ cưới trực tiếp tại đây. Quý khách vui lòng ghé lại sau ít phút để chiêm ngưỡng!
            </p>
          </div>
        ) : (
          /* MASONRY / GRID DISPLAY */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPhotos.map((photo, idx) => {
              const likes = likesMap[photo.id] || 0;
              const isLiked = userLikedPhotos[photo.id];

              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] border ${cardClass} ${accentBorder} ${
                    isPolaroid ? 'rotate-[-1deg] hover:rotate-0 shadow-lg' : 'shadow-md'
                  }`}
                >
                  {/* Polaroid Washi Tape Accent if Scrapbook template */}
                  {isPolaroid && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-200/80 backdrop-blur-xs rotate-1 z-20 shadow-2xs border border-amber-300/40" />
                  )}

                  {/* Image container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Ảnh ngày cưới'}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Timestamp Tag Overlay */}
                    {photo.takenAt && (
                      <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-white flex items-center gap-1 border border-white/20">
                        <Clock className="w-2.5 h-2.5 text-amber-300" />
                        <span>{photo.takenAt}</span>
                      </div>
                    )}

                    {/* Passport stamp badge if passport template */}
                    {isPassport && (
                      <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded border border-[#B99552] text-[#B99552] bg-[#0B132B]/80 text-[9px] font-mono uppercase tracking-widest rotate-6">
                        ENTRY OK
                      </div>
                    )}

                    {/* Traditional Hỷ Stamp */}
                    {isTraditional && (
                      <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-[#BA1E28] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-xs font-bold shadow-xs">
                        囍
                      </div>
                    )}

                    {/* Hover Overlay with controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <div className="flex items-center justify-between text-white text-xs">
                        <span className="font-serif italic truncate max-w-[70%]">
                          {photo.caption || 'Xem toàn màn hình'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikePhoto(photo.id);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-125 ${
                              isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(photo);
                            }}
                            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md"
                            title="Tải ảnh gốc"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption & Metadata Footer */}
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <p className="font-medium line-clamp-1 truncate max-w-[75%]">
                      {photo.caption || 'Khoảnh khắc ngày chung đôi'}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] opacity-75 shrink-0">
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-red-500 fill-current' : 'text-neutral-400'}`} />
                      <span>{likes}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FULLSCREEN LIGHTBOX / CINEMA THEATER VIEWER */}
      {currentPhoto && (
        <div
          id="live-album-lightbox"
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex flex-col justify-between animate-fadeIn"
        >
          {/* Cinema Top Controls */}
          <div className="p-4 sm:p-6 flex items-center justify-between text-white border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs opacity-70">
                {activePhotoIndex! + 1} / {filteredPhotos.length}
              </span>
              {currentPhoto.takenAt && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentPhoto.takenAt}</span>
                </span>
              )}
              {isVipTier && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-wider">
                  CINEMA 35MM
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Play / Pause Slideshow */}
              <button
                type="button"
                onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSlideshowPlaying
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isSlideshowPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isSlideshowPlaying ? 'Tạm Dừng' : 'Chiếu Tự Động'}</span>
              </button>

              {/* Like in Lightbox */}
              <button
                type="button"
                onClick={() => handleLikePhoto(currentPhoto.id)}
                className={`p-2 rounded-full transition-transform active:scale-125 cursor-pointer ${
                  userLikedPhotos[currentPhoto.id]
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Thả tim cho khoảnh khắc này"
              >
                <Heart className={`w-4 h-4 ${userLikedPhotos[currentPhoto.id] ? 'fill-current' : ''}`} />
              </button>

              {/* Download original */}
              <button
                type="button"
                onClick={() => handleDownload(currentPhoto)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                title="Tải ảnh gốc chất lượng cao"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Exit Lightbox */}
              <button
                type="button"
                onClick={() => {
                  setActivePhotoIndex(null);
                  setIsSlideshowPlaying(false);
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Photo Display Screen */}
          <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md cursor-pointer transition-all hover:scale-110"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md cursor-pointer transition-all hover:scale-110"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* The Main Image with Film Borders for VIP */}
            <div className={`relative max-w-5xl max-h-[75vh] flex items-center justify-center ${
              isVipTier ? 'border-4 border-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.9)]' : ''
            }`}>
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption || 'Ảnh ngày cưới'}
                className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Bottom Caption Bar */}
          <div className="p-4 sm:p-6 bg-black/70 backdrop-blur-md text-white text-center border-t border-white/10 space-y-1">
            <h4 className="font-serif-title text-base sm:text-lg font-bold text-amber-300">
              {currentPhoto.caption || 'Khoảnh Khắc Ngày Cưới Trọn Vẹn'}
            </h4>
            <p className="text-xs opacity-75">
              {wedding.groomName} & {wedding.brideName} • {wedding.city} • {currentPhoto.takenAt || wedding.weddingDate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
