import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Film, Sparkles, Camera } from 'lucide-react';
import { WeddingData, GalleryPhoto } from '../../../../types';
import { LightboxModal } from '../../../ui/LightboxModal';

interface CinematicGalleryProps {
  data: WeddingData;
}

export function CinematicGallery({ data }: CinematicGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fallbackPhotos: GalleryPhoto[] = [
    {
      id: 'g-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
      caption: 'Khoảnh khắc trao lời hẹn ước vĩnh cửu trong ánh ban mai.',
    },
    {
      id: 'g-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=85',
      caption: 'Bên nhau dịu dàng giữa không gian cổ kính và lãng mạn.',
    },
    {
      id: 'g-3',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=85',
      caption: 'Nụ cười rạng rỡ của em là cả thế giới đối với anh.',
    },
    {
      id: 'g-4',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1920&q=85',
      caption: 'Chiếc nhẫn ước hẹn và giọt nước mắt của niềm hạnh phúc trọn vẹn.',
    },
    {
      id: 'g-5',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=85',
      caption: 'Nắm tay nhau đi qua ngàn giông bão để đón ánh bình minh tươi sáng.',
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
    <section id="gallery" className="relative min-h-screen w-full bg-black text-[#FAF6EE] overflow-hidden select-none flex flex-col justify-between py-12 sm:py-16">
      {/* Top Film Frame Info */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 text-xs font-mono tracking-[0.3em] uppercase text-neutral-400">
          <Film className="w-4 h-4 text-[#E6C687]" />
          <span>CINEMA REEL GALLERY</span>
          <span className="text-[#E6C687]">FRAME 0{currentIndex + 1} / 0{photos.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLightboxOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono tracking-widest text-[#E6C687] transition-colors cursor-pointer"
            title="Xem toàn màn hình"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* Main Screen: Full-Screen Large Photo Showcase (Ảnh lớn từng màn hình) */}
      <div className="relative flex-1 w-full min-h-[550px] sm:min-h-[650px] flex items-center justify-center my-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id || currentIndex}
            initial={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1.0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full flex items-center justify-center p-4 sm:p-8"
          >
            <div className="relative w-full h-full max-w-6xl max-h-[85vh] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] group">
              <div
                className="w-full h-full bg-center bg-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${currentPhoto.url})` }}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#E6C687] mb-1">
                    <Camera className="w-3 h-3" />
                    <span>SCENE STILL #{currentIndex + 1}</span>
                  </div>
                  <p className="font-serif-title text-lg sm:text-2xl font-bold text-white leading-snug drop-shadow-md">
                    {currentPhoto.caption || 'Khoảnh khắc tình yêu diệu kỳ'}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase shrink-0">
                  35MM COLOR FILM • PREMIERE ARCHIVE
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons Left / Right */}
        <button
          onClick={handlePrev}
          className="absolute left-6 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-[#E6C687] hover:text-black text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl active:scale-95"
          title="Ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-6 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-[#E6C687] hover:text-black text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xl active:scale-95"
          title="Ảnh tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Film Strip Thumbnail Navigator */}
      <div className="relative z-30 max-w-5xl mx-auto w-full px-6">
        <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2 no-scrollbar">
          {photos.map((photo, i) => (
            <button
              key={photo.id || i}
              onClick={() => setCurrentIndex(i)}
              className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                currentIndex === i
                  ? 'border-[#E6C687] scale-110 shadow-[0_0_15px_rgba(230,198,135,0.6)]'
                  : 'border-white/20 opacity-50 hover:opacity-90'
              }`}
            >
              <img
                src={photo.url}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#E6C687]">
                0{i + 1}
              </span>
            </button>
          ))}
        </div>
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
