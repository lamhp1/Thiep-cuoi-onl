import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryPhoto } from '../../../types';
import { SongHyGlyph, AuspiciousCloud, PaperFrameCorner, TraditionalDivider } from './TraditionalOrnaments';
import { LightboxModal } from '../../ui/LightboxModal';
import { Maximize2, Heart, Camera } from 'lucide-react';

interface TraditionalPaperFrameGalleryProps {
  photos?: GalleryPhoto[];
}

export function TraditionalPaperFrameGallery({ photos }: TraditionalPaperFrameGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const defaultPhotos: GalleryPhoto[] = [
    {
      id: 'gp-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      caption: 'Khoảnh khắc rạng rỡ của cô dâu chú rể trong ngày đính ước',
      category: 'prewedding',
    },
    {
      id: 'gp-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      caption: 'Nghi thức trao nhẫn thiêng liêng trước bàn thờ gia tiên',
      category: 'ceremony',
    },
    {
      id: 'gp-3',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      caption: 'Nụ cười hạnh phúc rạng ngời ngày vu quy',
      category: 'ceremony',
    },
    {
      id: 'gp-4',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85',
      caption: 'Khung ảnh áo dài truyền thống thêu rồng phượng hoàng gia',
      category: 'prewedding',
    },
    {
      id: 'gp-5',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
      caption: 'Lời chúc phúc chân tình từ song thân phụ mẫu và họ hàng',
      category: 'moments',
    },
    {
      id: 'gp-6',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Cùng nhau bước về một mái ấm đong đầy yêu thương',
      category: 'moments',
    },
  ];

  const galleryItems = photos && photos.length > 0 ? photos : defaultPhotos;

  const filteredPhotos = galleryItems.filter((photo) => {
    if (selectedCategory === 'all') return true;
    return photo.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'Tất Cả Album' },
    { id: 'prewedding', label: 'Ảnh Cưới Studio' },
    { id: 'ceremony', label: 'Lễ Gia Tiên & Vu Quy' },
    { id: 'moments', label: 'Khoảnh Khắc Kỷ Niệm' },
  ];

  return (
    <section id="gallery" className="relative py-20 sm:py-24 bg-[#FBF7EE] text-[#3D1A1E] overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BA1E28]/10 border border-[#BA1E28]/25 text-[#BA1E28] text-xs font-semibold uppercase tracking-widest">
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28]" />
            <span>Kho Báu Kỷ Niệm</span>
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28] scale-x-[-1]" />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B1119] tracking-wide">
            Khung Tranh Kỷ Niệm
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#735154] max-w-md mx-auto leading-relaxed">
            Mỗi bức ảnh là một bức họa lưu giữ thanh xuân, nụ cười và thời khắc thiêng liêng nhất của cuộc đời.
          </p>

          <TraditionalDivider className="mt-4 mb-8" />

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-body font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#BA1E28] text-white shadow-md border border-[#BA1E28]'
                    : 'bg-white text-[#735154] hover:bg-[#FAF5EA] border border-[#E0D3BC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid: Frame giống khung tranh giấy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id || index}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45 }}
                className="group relative cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              >
                {/* Frame Khung Tranh Giấy Mỹ Thuật Truyền Thống */}
                <div className="relative bg-[#FFFDF9] rounded-2xl p-3.5 sm:p-4 border border-[#D4AF37]/50 shadow-[0_10px_25px_rgba(186,30,40,0.06)] group-hover:shadow-[0_16px_35px_rgba(186,30,40,0.12)] transition-all duration-300 transform group-hover:-translate-y-1">
                  {/* Bốn góc hoa văn khung tranh vàng kim */}
                  <PaperFrameCorner position="top-left" className="top-2 left-2 w-6 h-6 text-[#D4AF37]" />
                  <PaperFrameCorner position="top-right" className="top-2 right-2 w-6 h-6 text-[#D4AF37]" />
                  <PaperFrameCorner position="bottom-left" className="bottom-2 left-2 w-6 h-6 text-[#D4AF37]" />
                  <PaperFrameCorner position="bottom-right" className="bottom-2 right-2 w-6 h-6 text-[#D4AF37]" />

                  {/* Viền đôi giấy bo tranh (Parchment Mat Border) */}
                  <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-[#FAF5EA] border border-[#D4AF37]/35 shadow-inner">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Ảnh cưới'}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3D060D]/80 via-[#3D060D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                      <div className="flex items-center justify-between text-white/90">
                        <span className="text-[11px] font-body uppercase tracking-wider text-[#FFD700]">
                          Chạm để phóng to
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      {photo.caption && (
                        <p className="font-serif-title text-sm mt-1 text-[#FFFDF8] line-clamp-2">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Caption & Song Hỷ nhũ vàng bên dưới khung tranh */}
                  <div className="pt-3 pb-1 px-1 flex items-center justify-between text-[#8B1119]">
                    <div className="flex items-center gap-1.5 text-xs font-serif-title font-medium truncate">
                      <SongHyGlyph className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="truncate text-[#5C3D40]">
                        {photo.caption || 'Hỷ Sự Trăm Năm'}
                      </span>
                    </div>
                    <span className="text-[10px] font-body text-[#A66D29] uppercase tracking-wider shrink-0 pl-2">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        photos={filteredPhotos}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(idx) => setLightboxIndex(idx)}
      />
    </section>
  );
}
