import React, { useState } from 'react';
import { Camera, Heart, Sparkles, CheckCircle2, Maximize2, X } from 'lucide-react';
import { GalleryPhoto } from '../../../../types';
import { playPointChime } from './loveGameSounds';

interface LoveGameGallerySectionProps {
  gallery?: GalleryPhoto[];
  isCompleted: boolean;
  onCompleteQuest: () => void;
  onAddBonusPoints?: (amount: number, reason: string) => void;
}

export function LoveGameGallerySection({
  gallery = [],
  isCompleted,
  onCompleteQuest,
  onAddBonusPoints,
}: LoveGameGallerySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoLikes, setPhotoLikes] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'prewedding' | 'moments'>('all');

  const defaultPhotos: GalleryPhoto[] = [
    {
      id: 'g-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      caption: 'Ánh mắt ngày đầu hẹn ước',
      category: 'prewedding',
    },
    {
      id: 'g-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      caption: 'Nụ cười rạng rỡ của em',
      category: 'prewedding',
    },
    {
      id: 'g-3',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
      caption: 'Hoàng hôn bên bờ biển',
      category: 'moments',
    },
    {
      id: 'g-4',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      caption: 'Khoảnh khắc trao nhẫn thiêng liêng',
      category: 'prewedding',
    },
    {
      id: 'g-5',
      url: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
      caption: 'Dưới vòm hoa tình yêu',
      category: 'moments',
    },
    {
      id: 'g-6',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Mãi mãi bên nhau',
      category: 'prewedding',
    },
  ];

  const photos = gallery && gallery.length > 0 ? gallery : defaultPhotos;
  const filteredPhotos = activeTab === 'all'
    ? photos
    : photos.filter((p) => p.category === activeTab || !p.category);

  const handleLikePhoto = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playPointChime();
    setPhotoLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    if (onAddBonusPoints) {
      onAddBonusPoints(2, '+2 Love Points: Thả tim ảnh kỷ niệm! ❤️');
    }
    if (!isCompleted) {
      onCompleteQuest();
    }
  };

  const handleOpenPhoto = (url: string) => {
    setSelectedPhoto(url);
    if (!isCompleted) {
      playPointChime();
      onCompleteQuest();
    }
  };

  return (
    <section id="quest-gallery" className="relative py-24 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Section Header with Quest Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span>QUEST 02 • KỶ NIỆM NGỌT NGÀO</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Album Kỷ Niệm Tình Yêu
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            Khám phá những khoảnh khắc đẹp nhất. Thả tim ❤️ vào ảnh bạn thích để thu thập thêm Love Points!
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 text-[11px] font-mono">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
            <span>Thả tim ảnh bất kỳ: <strong>+2 Love Points</strong> (không giới hạn lượt thả tim)</span>
          </div>

          {/* Quest completion badge */}
          <div className="pt-1">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ĐÃ HOÀN THÀNH CHẶNG 2 (+10 LOVE POINTS)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playPointChime();
                  onCompleteQuest();
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500/20 hover:bg-purple-500/35 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Chạm để hoàn thành nhiệm vụ (+10 PTS)
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
            }`}
          >
            Tất Cả ({photos.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prewedding')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'prewedding'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
            }`}
          >
            Ảnh Cưới Pre-Wedding
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('moments')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'moments'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
            }`}
          >
            Khoảnh Khắc Hẹn Hò
          </button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => {
            const likes = (photoLikes[photo.id] || 0) + (idx % 3 === 0 ? 12 : 8);
            return (
              <div
                key={photo.id || idx}
                onClick={() => handleOpenPhoto(photo.url)}
                className="group relative bg-[#16132A]/80 border border-white/15 hover:border-purple-400/60 rounded-3xl p-3 backdrop-blur-xl shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Photo frame */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Kỷ niệm'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleLikePhoto(e, photo.id)}
                      className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-pink-600/90 border border-white/20 hover:border-pink-400 backdrop-blur-md text-white text-xs font-mono font-bold transition-all shadow-md group/like hover:scale-105 active:scale-95"
                      title="Thả tim nhận +2 Love Points"
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-400 group-hover/like:scale-125 fill-pink-400 transition-transform" />
                      <span>{likes}</span>
                      <span className="text-[10px] text-pink-300 font-semibold pl-0.5">+2 PTS</span>
                    </button>
                  </div>

                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white inline-block">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Caption bar */}
                {photo.caption && (
                  <div className="px-2 pt-3 pb-1 text-left">
                    <p className="text-xs font-medium text-neutral-200 truncate">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn"
          >
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playPointChime();
                  if (onAddBonusPoints) {
                    onAddBonusPoints(2, '+2 Love Points: Thả tim ảnh phóng to! ❤️');
                  }
                  if (!isCompleted) {
                    onCompleteQuest();
                  }
                }}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600/80 hover:bg-pink-600 border border-pink-400/50 text-white text-xs font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                <span>Thả Tim Nhận +2 PTS</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <img
              src={selectedPhoto}
              alt="Ảnh phóng to"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

      </div>
    </section>
  );
}
