import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2, Camera } from 'lucide-react';
import { GalleryPhoto } from '../../types';
import { LightboxModal } from '../ui/LightboxModal';

interface GallerySectionProps {
  gallery: GalleryPhoto[];
}

export function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'prewedding' | 'ceremony' | 'moments'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'prewedding', label: 'Pre-Wedding' },
    { id: 'ceremony', label: 'Lễ Cưới' },
    { id: 'moments', label: 'Khoảnh Khắc' },
  ] as const;

  const filteredPhotos = selectedCategory === 'all'
    ? gallery
    : gallery.filter((p) => p.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16"
      >
        <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] mb-1">
          Khoảnh Khắc Hạnh Phúc
        </p>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C2A29] tracking-wide uppercase">
          Our Memories
        </h2>
        <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
      </motion.div>

      {/* Category Tabs & Live Album Banner */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-body font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#D4AF37] text-white shadow-md'
                  : 'bg-white/80 hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dedicated Live Wedding Album Trigger Banner */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('lamour_open_live_album'))}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Camera className="w-4 h-4 text-amber-200" />
          <span>Xem Toàn Bộ Album Ảnh Ngày Cưới (Live Recap)</span>
          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
            LIVE
          </span>
        </button>
      </div>

      {/* Gallery Grid (Responsive Masonry Columns) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filteredPhotos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
            onClick={() => openLightbox(idx)}
            className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 border border-[#D4AF37]/20 shadow-md hover:shadow-xl transition-all"
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Kỷ niệm ngày cưới'}
              loading="lazy"
              className="w-full h-auto object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
              referrerPolicy="no-referrer"
            />

            {/* Hover overlay caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-serif-title italic line-clamp-2">
                  {photo.caption || 'Khoảnh khắc ngọt ngào'}
                </p>
                <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm shrink-0 ml-2">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="py-16 text-center text-neutral-400">
          <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-body">Không có ảnh trong danh mục này.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photos={filteredPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(newIdx) => setCurrentPhotoIndex(newIdx)}
      />
    </section>
  );
}
