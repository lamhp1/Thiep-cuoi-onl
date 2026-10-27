import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GalleryPhoto } from '../../../../types';
import { Compass, Camera, Maximize2, Heart } from 'lucide-react';
import { LightboxModal } from '../../../ui/LightboxModal';
import { LovePostalStamp } from './LoveMapOrnaments';

interface LoveMapGalleryProps {
  gallery: GalleryPhoto[];
}

export function LoveMapGallery({ gallery }: LoveMapGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!gallery || gallery.length === 0) return null;

  const handleOpenPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      className="relative py-20 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      <div className="relative z-20 max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#722238]">
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>TRAVEL PHOTO ALBUM</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#443B35]">
            MEMORIES ALONG THE WAY
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/75 font-body leading-relaxed">
            Những khoảnh khắc lãng mạn chụp lại dọc theo từng nẻo đường tình yêu của hai đứa mình.
          </p>
        </div>

        {/* Travel Album Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gallery.map((photo, idx) => {
            // Slight vintage photo tilt
            const rotation = idx % 4 === 0 ? -1.5 : idx % 4 === 1 ? 1.8 : idx % 4 === 2 ? -1 : 1.2;

            return (
              <motion.div
                key={photo.id || idx}
                initial={{ opacity: 0, scale: 0.96, rotate: rotation }}
                whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                onClick={() => handleOpenPhoto(idx)}
                className="group relative bg-[#FFFDF9] rounded-2xl p-4 border border-[#B9985A]/40 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Polaroid/Film image container */}
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF6EE] border border-[#B9985A]/25 mb-3">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Khoảnh khắc kỷ niệm ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#FFFDF9]/90 text-[#722238] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Film Frame Index Marker */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-[#F5EFE3] tracking-widest uppercase">
                    EXP #{String(idx + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Caption / Location tag */}
                <div className="px-1 flex items-center justify-between text-xs text-[#443B35]">
                  <p className="font-serif italic text-sm text-[#722238] truncate pr-2">
                    {photo.caption || 'Khoảnh khắc ngọt ngào bên nhau'}
                  </p>
                  <Heart className="w-3.5 h-3.5 text-[#B9985A] group-hover:fill-[#722238] group-hover:text-[#722238] transition-colors shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        photos={gallery}
        currentIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setSelectedPhotoIndex}
      />
    </section>
  );
}
