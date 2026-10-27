import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GalleryPhoto } from '../../../../types';
import { Heart, Camera, ZoomIn } from 'lucide-react';
import { LoveLetterWashiTape } from './LoveLetterOrnaments';
import { LightboxModal } from '../../../ui/LightboxModal';

interface LoveLetterPolaroidGalleryProps {
  gallery: GalleryPhoto[];
}

export function LoveLetterPolaroidGallery({ gallery }: LoveLetterPolaroidGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'prewedding' | 'ceremony' | 'moments'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const displayPhotos = gallery || [];

  const filteredPhotos =
    activeCategory === 'all'
      ? displayPhotos
      : displayPhotos.filter((p) => (p.category || 'prewedding') === activeCategory);

  // Deterministic rotation based on index to prevent layout shift on re-renders
  const rotations = [-2.5, 1.8, -1.2, 2.2, -2.0, 1.5, -1.8, 2.0];
  const tapeColors: ('beige' | 'dusty-rose' | 'sage' | 'gold')[] = [
    'beige',
    'dusty-rose',
    'sage',
    'gold',
  ];

  const handleOpenLightbox = (index: number) => {
    // Find index in overall displayPhotos array
    const photo = filteredPhotos[index];
    const fullIndex = displayPhotos.findIndex((p) => p.id === photo?.id);
    setCurrentPhotoIndex(fullIndex >= 0 ? fullIndex : index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#C8A96B]/35 text-[#7A2638] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 shadow-xs">
          <Camera className="w-3 h-3 text-[#7A2638]" />
          <span>SCRAPBOOK MEMORIES</span>
        </div>
        <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#59483E] tracking-tight">
          Những Kỷ Niệm Chúng Mình Muốn Giữ Lại
        </h2>
        <p className="font-handwriting text-xl sm:text-2xl text-[#7A2638] mt-2">
          Bàn scrapbook gom góp từng thước phim quý giá
        </p>

        {/* Stationery Index Tabs for Filtering */}
        {displayPhotos.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'Tất cả kỷ niệm' },
              { id: 'prewedding', label: 'Pre-wedding' },
              { id: 'ceremony', label: 'Nghi lễ' },
              { id: 'moments', label: 'Khoảnh khắc' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-serif font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#7A2638] text-[#FFFDF8] shadow-sm'
                    : 'bg-[#FFFDF8] text-[#59483E] border border-[#C8A96B]/30 hover:bg-[#F7F1E7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty State Graceful Handling */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-[#FFFDF8] rounded-3xl p-10 text-center border border-[#C8A96B]/30 max-w-md mx-auto shadow-sm">
          <p className="font-handwriting text-2xl text-[#7A2638]">
            Đang cập nhật thêm ảnh kỷ niệm...
          </p>
          <p className="font-serif text-xs text-[#59483E]/70 mt-2">
            Những khoảnh khắc hạnh phúc nhất sẽ sớm được bổ sung vào trang thư này.
          </p>
        </div>
      ) : (
        /* Polaroid Scrapbook Collage Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pt-4">
          {filteredPhotos.map((photo, index) => {
            const rotation = rotations[index % rotations.length];
            const tapeColor = tapeColors[index % tapeColors.length];

            return (
              <motion.div
                key={photo.id || index}
                initial={{ opacity: 0, y: 35, rotate: rotation * 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: rotation }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.7,
                  delay: (index % 3) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative group cursor-pointer"
                onClick={() => handleOpenLightbox(index)}
              >
                {/* Polaroid Frame */}
                <div
                  className="bg-[#FFFDF8] p-3 sm:p-4 pb-8 sm:pb-9 rounded-2xl border border-[#C8A96B]/35 shadow-md group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02]"
                  style={{
                    boxShadow: '0 12px 30px -10px rgba(89,72,62,0.15)',
                  }}
                >
                  {/* Washi Tape Pinning at Top */}
                  <LoveLetterWashiTape
                    className="-top-3 left-1/2 -translate-x-1/2"
                    color={tapeColor}
                    angle={rotation > 0 ? 2 : -2}
                  />

                  {/* Photo Canvas */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-[#F7F1E7] border border-[#C8A96B]/20">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Kỷ niệm tình yêu'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />

                    {/* Hover Zoom Icon overlay */}
                    <div className="absolute inset-0 bg-[#7A2638]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#FFFDF8]/90 text-[#7A2638] flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Handwritten Polaroid Caption */}
                  <div className="mt-3 px-1 text-center">
                    <p className="font-handwriting text-base sm:text-lg text-[#59483E] truncate">
                      {photo.caption || 'Khoảnh khắc ngọt ngào bên nhau'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photos={displayPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setCurrentPhotoIndex}
      />
    </section>
  );
}
