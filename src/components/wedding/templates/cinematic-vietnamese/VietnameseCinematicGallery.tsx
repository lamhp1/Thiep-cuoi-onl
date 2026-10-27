import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Film, Sparkles, Camera } from 'lucide-react';
import { WeddingData, GalleryPhoto } from '../../../../types';
import { LightboxModal } from '../../../ui/LightboxModal';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperFrameCorner,
} from '../../vietnamese-traditional/TraditionalOrnaments';

interface VietnameseCinematicGalleryProps {
  data: WeddingData;
}

export function VietnameseCinematicGallery({ data }: VietnameseCinematicGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fallbackPhotos: GalleryPhoto[] = [
    {
      id: 'vg-1',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=85',
      caption: 'Khoảnh khắc trao lời hẹn ước trăm năm trong sắc phục truyền thống trang trọng.',
    },
    {
      id: 'vg-2',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1920&q=85',
      caption: 'Nắm tay nhau đi qua ngàn lối cũ, cùng hướng về tương lai an yên.',
    },
    {
      id: 'vg-3',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
      caption: 'Nụ cười rạng rỡ của em là ánh bình minh soi sáng cả cuộc đời anh.',
    },
    {
      id: 'vg-4',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=85',
      caption: 'Chiếc nhẫn ước thề đính kết mối lương duyên bách niên giai lão.',
    },
    {
      id: 'vg-5',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=85',
      caption: 'Gia đình sum vầy, trọn vẹn nghĩa tình trong ngày đại hỷ.',
    },
  ];

  const photos = data.gallery && data.gallery.length > 0 ? data.gallery : fallbackPhotos;
  const currentPhoto = photos[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section id="gallery" className="relative min-h-screen w-full bg-[#080203] text-[#FAF6EE] overflow-hidden select-none flex flex-col justify-between py-12 sm:py-16">
      {/* Top Film Frame Info */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-6 flex items-center justify-between border-b border-[#D4AF37]/25 pb-4">
        <div className="flex items-center gap-3 text-xs font-serif tracking-[0.3em] uppercase text-[#D4AF37]">
          <Film className="w-4 h-4 text-[#D4AF37]" />
          <span>HỌA PHỔ TRIỀU ĐẠI &nbsp;•&nbsp; CINEMA REEL</span>
        </div>
        <div className="text-xs font-serif tracking-[0.2em] text-[#F3E5AB]">
          HỌA BỨC {String(currentIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </div>
      </div>

      {/* Main Full-Screen Frame */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4 sm:px-12 my-6">
        <div className="relative max-w-5xl w-full h-[55vh] sm:h-[65vh] rounded-3xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_0_50px_rgba(212,175,55,0.2)] bg-[#140205]">
          {/* Corner Paper Accents */}
          <div className="absolute top-4 left-4 z-30 pointer-events-none text-[#D4AF37]">
            <PaperFrameCorner position="top-left" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute top-4 right-4 z-30 pointer-events-none text-[#D4AF37]">
            <PaperFrameCorner position="top-right" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute bottom-4 left-4 z-30 pointer-events-none text-[#D4AF37]">
            <PaperFrameCorner position="bottom-left" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute bottom-4 right-4 z-30 pointer-events-none text-[#D4AF37]">
            <PaperFrameCorner position="bottom-right" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhoto.id || currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full"
            >
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption || 'Ảnh cưới'}
                className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.08]"
                referrerPolicy="no-referrer"
              />

              {/* Bottom Caption Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 sm:p-10 flex flex-col justify-end">
                <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#FFF8EB] max-w-3xl drop-shadow-md">
                  {currentPhoto.caption || 'Khoảnh khắc trọn vẹn của tình yêu đôi lứa'}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Ảnh trước"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1C0509]/80 hover:bg-[#BA1E28] border border-[#D4AF37]/50 text-[#F5E6A3] flex items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Ảnh sau"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1C0509]/80 hover:bg-[#BA1E28] border border-[#D4AF37]/50 text-[#F5E6A3] flex items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Zoom Lightbox Trigger */}
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Phóng to ảnh"
            className="absolute top-4 right-14 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-[#D4AF37] transition-all cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Thumbnail Filmstrip */}
      <div className="relative z-30 max-w-5xl mx-auto w-full px-6 flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2">
        {photos.map((p, idx) => (
          <button
            key={p.id || idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative rounded-xl overflow-hidden shrink-0 transition-all duration-300 cursor-pointer ${
              idx === currentIndex
                ? 'w-16 h-12 sm:w-20 sm:h-14 ring-2 ring-[#D4AF37] scale-105'
                : 'w-12 h-10 sm:w-14 sm:h-10 opacity-50 hover:opacity-90'
            }`}
          >
            <img
              src={p.url}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        photos={photos}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(idx) => setCurrentIndex(idx)}
      />
    </section>
  );
}
