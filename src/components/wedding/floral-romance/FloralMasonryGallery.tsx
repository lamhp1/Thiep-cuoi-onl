import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GalleryPhoto } from '../../../types';
import { LightboxModal } from '../../ui/LightboxModal';
import { FloralDivider } from './FloralOrnaments';
import { Maximize2, Calendar, Sparkles } from 'lucide-react';

interface FloralMasonryGalleryProps {
  photos: GalleryPhoto[];
}

export function FloralMasonryGallery({ photos }: FloralMasonryGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Dates for photos to satisfy "Overlay hiện ngày chụp"
  const photoDates = [
    '15.04.2025',
    '24.06.2025',
    '18.08.2025',
    '02.10.2025',
    '20.10.2025',
    '14.11.2025',
    '05.12.2025',
    '14.02.2026',
    '20.05.2026',
    '08.08.2026',
    '20.10.2026',
    '20.12.2026',
  ];

  const categories = [
    { id: 'all', label: 'Tất Cả Khoảnh Khắc' },
    { id: 'prewedding', label: 'Pre-Wedding' },
    { id: 'ceremony', label: 'Lễ Thành Hôn' },
    { id: 'moments', label: 'Kỷ Niệm Đẹp' },
  ];

  const filteredPhotos = photos.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <section id="gallery" className="relative py-20 sm:py-28 bg-[#FFFDFD] overflow-hidden">
      {/* Background soft pastel blush accents */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#FDECEF]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#F8E7EA]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-semibold font-body">
            SWEET MEMORIES & ALBUM
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#3E2E31] font-normal italic">
            Khoảnh Khắc Tình Yêu
          </h2>
          <FloralDivider className="w-48 mx-auto my-3" />
          <p className="text-sm font-body text-[#7A696B] leading-relaxed">
            Những thước hình lưu giữ từng nụ cười, ánh mắt và khoảnh khắc rung động ngọt ngào nhất của hai chúng mình.
          </p>
        </motion.div>

        {/* Category Pills */}
        <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-body tracking-wider transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#D97D8A] text-white shadow-md shadow-[#D97D8A]/25'
                  : 'bg-[#FDF6F7] text-[#7A696B] hover:bg-[#FCEBF0] border border-[#F2DCDD]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry Layout: Một ảnh lớn xen kẽ nhiều ảnh nhỏ */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px]">
          {filteredPhotos.map((photo, index) => {
            // Pattern: Photos at index 0, 5, 8 are featured large images (spanning 2 columns & 2 rows on md+)
            const isLarge = index % 5 === 0;
            const shootDate = photoDates[index % photoDates.length];

            return (
              <motion.div
                key={photo.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
                onClick={() => setSelectedPhotoIndex(index)}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-[#FDF6F7] border border-[#F2DCDD] shadow-xs hover:shadow-xl transition-shadow duration-300 ${
                  isLarge
                    ? 'sm:col-span-2 sm:row-span-2'
                    : 'col-span-1 row-span-1'
                }`}
              >
                {/* Image element with required hover effects:
                    Khi hover ảnh: scale(1.03), brightness(0.9) */}
                <img
                  src={photo.url}
                  alt={photo.caption || `Ảnh cưới ${index + 1}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:brightness-[0.9]"
                />

                {/* Delicate gold hairline border */}
                <div className="absolute inset-2 rounded-xl border border-white/40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Overlay hiện ngày chụp (Requirement: "Overlay hiện ngày chụp") */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 space-y-1.5">
                    {/* Photoshoot Date Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium font-body border border-white/30">
                      <Calendar className="w-3 h-3 text-[#FCE4EC]" />
                      <span>Ngày chụp: {shootDate}</span>
                    </div>

                    {photo.caption && (
                      <p className="text-white text-xs sm:text-sm font-serif-title font-medium line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-[#F8BBD0] pt-1">
                      <Maximize2 className="w-3 h-3" />
                      <span>Chạm để xem phóng to</span>
                    </div>
                  </div>
                </div>

                {/* Category small badge in top corner */}
                {isLarge && (
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#3E2E31] text-[10px] font-semibold uppercase tracking-wider shadow-xs border border-[#F2DCDD]">
                      Featured
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Lightbox Modal for full-resolution browsing */}
        <LightboxModal
          isOpen={selectedPhotoIndex !== null}
          currentIndex={selectedPhotoIndex ?? 0}
          photos={filteredPhotos}
          onClose={() => setSelectedPhotoIndex(null)}
          onIndexChange={(idx) => setSelectedPhotoIndex(idx)}
        />
      </div>
    </section>
  );
}
