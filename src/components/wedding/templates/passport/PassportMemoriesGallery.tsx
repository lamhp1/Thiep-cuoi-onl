import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GalleryPhoto } from '../../../../types';
import { LightboxModal } from '../../../ui/LightboxModal';
import { Camera, Image as ImageIcon, Sparkles, MapPin } from 'lucide-react';

interface PassportMemoriesGalleryProps {
  gallery?: GalleryPhoto[];
}

export function PassportMemoriesGallery({ gallery = [] }: PassportMemoriesGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Pre-calculated organic rotations for polaroid look
  const rotations = [-2, 2.5, -1.5, 3, -2.5, 1.8, -3, 2];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  if (!gallery || gallery.length === 0) {
    return (
      <section id="gallery" className="py-16 sm:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-md mx-auto bg-[#FCFAF5] p-8 rounded-3xl border border-[#B99552]/30 shadow-md space-y-3">
          <Camera className="w-10 h-10 text-[#B99552] mx-auto" />
          <h3 className="font-serif-title text-xl font-bold text-[#172A3A]">
            OUR MEMORIES
          </h3>
          <p className="text-xs text-neutral-500 font-sans">
            Những khoảnh khắc đẹp đang được cập nhật vào trang nhật ký hành trình.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B99552]/15 border border-[#B99552]/30 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Camera className="w-3.5 h-3.5 text-[#B99552]" />
            <span>TRAVEL ALBUM • SNAPSHOTS</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            OUR MEMORIES
          </h2>

          <p className="font-serif-title italic text-base sm:text-lg text-[#172A3A]">
            Từng bức ảnh ghi dấu những cung đường ngập tràn tiếng cười
          </p>

          <div className="inline-block border border-dashed border-[#8E2835]/60 text-[#8E2835] text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-md rotate-[-2deg]">
            ★ MEMORIES STAMPED HERE ★
          </div>
        </div>

        {/* Polaroid / Postcard Grid Layout - Dynamic balanced grid */}
        <div
          className={
            gallery.length === 1
              ? 'max-w-md mx-auto'
              : gallery.length === 2
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-4xl mx-auto'
              : gallery.length === 4
              ? 'grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 max-w-4xl mx-auto'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10'
          }
        >
          {gallery.map((photo, idx) => {
            const rot = rotations[idx % rotations.length];

            return (
              <motion.div
                key={photo.id || idx}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 6) * 0.08 }}
                style={{ rotate: `${rot}deg` }}
                className="bg-[#FCFAF5] p-4 sm:p-5 rounded-2xl border border-[#B99552]/40 shadow-lg hover:shadow-2xl hover:scale-105 hover:rotate-0 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                onClick={() => handleOpenLightbox(idx)}
              >
                {/* Photo container with instant photo border */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 border border-[#B99552]/20">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Kỷ niệm ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Stamp Badge Overlay */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-[9px] font-mono text-[#F5EEDF] px-2 py-0.5 rounded border border-white/20">
                    № 0{idx + 1}
                  </div>
                </div>

                {/* Polaroid Caption bottom strip */}
                <div className="pt-4 pb-1 text-center space-y-1">
                  <p className="font-serif-title italic text-sm text-[#172A3A] font-semibold truncate px-2">
                    {photo.caption || 'Hành Trình Tình Yêu'}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-400">
                    <MapPin className="w-3 h-3 text-[#B99552]" />
                    <span>MEMORIAL STAMP • 2026</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        photos={gallery}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  );
}
