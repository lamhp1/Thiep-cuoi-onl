import React, { useState } from 'react';
import { GalleryPhoto } from '../../../../types';
import { Camera, Heart, Sparkles, Filter, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { WashiTape, WashiTapeStyle, HeartSticker, PressedFlower } from './PolaroidScrapbookOrnaments';
import { PolaroidCard } from './ScrapbookMemorabilia';

interface PolaroidGallerySectionProps {
  photos?: GalleryPhoto[];
  onOpenLightbox?: (imgUrl: string) => void;
}

export function PolaroidGallerySection({
  photos = [],
  onOpenLightbox,
}: PolaroidGallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const defaultPhotos: GalleryPhoto[] = [
    {
      id: 'gal-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      caption: 'Tay trong tay dưới nắng chiều',
      category: 'prewedding',
    },
    {
      id: 'gal-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      caption: 'Nụ cười rạng ngời ngày thử váy',
      category: 'moments',
    },
    {
      id: 'gal-3',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      caption: 'Tình yêu trong veo như giọt sương',
      category: 'prewedding',
    },
    {
      id: 'gal-4',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
      caption: 'Trao nhau ánh mắt hẹn thề',
      category: 'ceremony',
    },
    {
      id: 'gal-5',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bên nhau giữa vườn hoa',
      category: 'prewedding',
    },
    {
      id: 'gal-6',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      caption: 'Chiếc nhẫn ước hẹn trọn đời',
      category: 'moments',
    },
    {
      id: 'gal-7',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bình yên là khi có anh kề bên',
      category: 'prewedding',
    },
    {
      id: 'gal-8',
      url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
      caption: 'Ánh hoàng hôn bên bờ biển',
      category: 'moments',
    },
  ];

  const displayList = photos && photos.length > 0 ? photos : defaultPhotos;

  const categories = [
    { id: 'all', label: 'Tất cả ảnh' },
    { id: 'prewedding', label: 'Pre-wedding' },
    { id: 'moments', label: 'Khoảnh khắc ngọt ngào' },
    { id: 'ceremony', label: 'Lễ cưới' },
  ];

  const filteredPhotos = displayList.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  // Pre-configured natural tilts & washi tapes to match user prompt:
  // rotate(-3deg), rotate(2deg), rotate(-1deg), rotate(3deg), rotate(-2.5deg)...
  const tiltPresets = [-3, 2, -1, 2.5, -2, 1.5, -3.5, 2];
  const washiPresets: WashiTapeStyle[] = [
    'pink-grid',
    'mint-dots',
    'yellow-stripes',
    'kraft',
    'rose-floral',
    'gold-sheen',
    'lavender',
    'pink-grid',
  ];
  const positionPresets: ('top-left' | 'top-right' | 'top-center' | 'both-top')[] = [
    'top-left',
    'top-right',
    'top-center',
    'both-top',
    'top-right',
    'top-left',
    'top-center',
    'top-right',
  ];

  return (
    <section id="gallery" className="relative py-14 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Background Decor */}
      <div className="absolute top-8 left-8 hidden lg:block">
        <PressedFlower angle={-15} />
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <WashiTape style="rose-floral" angle={-2} width="w-32" />
          </div>
          <div className="bg-[#FFFDF9] border border-[#E3D4BC] px-6 py-2 rounded-xs shadow-xs inline-flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-[#D9735A]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7E5E44] font-bold">
              POLAROID PHOTO WALL • BỨC TƯỜNG KỶ NIỆM
            </span>
            <Camera className="w-3.5 h-3.5 text-[#D9735A]" />
          </div>
        </div>

        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#2C211B] mt-4">
          Kho Báu Ảnh Kỷ Niệm
        </h2>
        <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5738] mt-1 max-w-lg mx-auto">
          "Rê chuột vào bất kỳ bức ảnh nào để ảnh dựng thẳng lên và phóng to chi tiết"
        </p>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#C84B5D] text-white shadow-md'
                  : 'bg-[#FFFDF9] text-[#634E41] border border-[#E0D2BB] hover:bg-[#FAF4EB]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Polaroid Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 pt-4">
        {filteredPhotos.map((photo, index) => {
          const rotation = tiltPresets[index % tiltPresets.length];
          const washiStyle = washiPresets[index % washiPresets.length];
          const washiPosition = positionPresets[index % positionPresets.length];

          return (
            <div key={photo.id || index} className="flex justify-center">
              <PolaroidCard
                image={photo.url}
                caption={photo.caption || 'Khoảnh khắc ngọt ngào'}
                date="20.12.2026"
                rotation={rotation}
                washiStyle={washiStyle}
                washiPosition={washiPosition}
                className="w-full max-w-xs"
                onClick={() => onOpenLightbox && onOpenLightbox(photo.url)}
              />
            </div>
          );
        })}
      </div>

      {/* Interactive tip */}
      <div className="text-center mt-12">
        <p className="inline-flex items-center gap-2 text-xs font-mono text-[#8C6D1F] bg-[#FFFDF9] border border-[#DFCBB2] px-4 py-2 rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D9735A]" />
          <span>Bấm vào ảnh bất kỳ để xem kích thước lớn toàn màn hình</span>
        </p>
      </div>
    </section>
  );
}
