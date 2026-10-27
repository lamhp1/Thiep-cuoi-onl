import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { GalleryPhoto } from '../../types';

interface LightboxModalProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (idx: number) => void;
}

export function LightboxModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
}: LightboxModalProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    onIndexChange((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos.length, onIndexChange]);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    onIndexChange((currentIndex + 1) % photos.length);
  }, [currentIndex, photos.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.35, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.35, 1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <AnimatePresence>
      <div id="lightbox-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
        {/* Top Control Bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 text-white/90">
          <div className="text-sm font-medium font-body tracking-wider text-neutral-300">
            {currentIndex + 1} / {photos.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="zoom-out-lightbox-btn"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
              aria-label="Thu nhỏ ảnh"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              id="zoom-in-lightbox-btn"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.5}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
              aria-label="Phóng to ảnh"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            {zoomLevel > 1 && (
              <button
                id="reset-zoom-lightbox-btn"
                onClick={handleResetZoom}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Đặt lại kích thước"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
            <button
              id="close-lightbox-btn"
              onClick={onClose}
              className="p-2 ml-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-colors"
              aria-label="Đóng xem ảnh"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Previous Button */}
        <button
          id="prev-photo-btn"
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-white/10 hover:bg-[#D4AF37] text-white transition-all hover:scale-110 active:scale-95"
          aria-label="Ảnh trước đó"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image Container with smooth zoom */}
        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center overflow-hidden"
        >
          {currentPhoto?.url ? (
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption || 'Ảnh cưới'}
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl transition-transform duration-300 select-none"
              style={{ transform: `scale(${zoomLevel})` }}
              referrerPolicy="no-referrer"
            />
          ) : null}

          {currentPhoto.caption && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-sm sm:text-base font-body text-neutral-300 max-w-xl px-4"
            >
              {currentPhoto.caption}
            </motion.p>
          )}
        </motion.div>

        {/* Next Button */}
        <button
          id="next-photo-btn"
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-[#D4AF37] text-white transition-all hover:scale-110 active:scale-95"
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </AnimatePresence>
  );
}
