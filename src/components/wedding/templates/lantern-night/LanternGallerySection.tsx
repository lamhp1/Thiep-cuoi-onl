import React, { useState } from 'react';
import { GalleryPhoto } from '../../../../types';
import { SparklingStar, LotusNightIcon } from './LanternNightOrnaments';
import { LightboxModal } from '../../../ui/LightboxModal';
import { Eye, Image as ImageIcon, Sparkles } from 'lucide-react';

interface LanternGallerySectionProps {
  photos?: GalleryPhoto[];
}

export function LanternGallerySection({ photos = [] }: LanternGallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Default romantic night/classic wedding photoshoot
  const defaultPhotos: GalleryPhoto[] = [
    {
      id: 'g-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      caption: 'Dưới ánh đèn lồng Hội An mộng mơ',
    },
    {
      id: 'g-2',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85',
      caption: 'Nụ cười rạng rỡ của tân nương',
    },
    {
      id: 'g-3',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85',
      caption: 'Bên bến sông Hương lúc hoàng hôn buông',
    },
    {
      id: 'g-4',
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
      caption: 'Khoảnh khắc trao lời hẹn ước',
    },
    {
      id: 'g-5',
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=85',
      caption: 'Dạ tiệc ánh sáng ngập tràn hoa tươi',
    },
    {
      id: 'g-6',
      url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85',
      caption: 'Khiêu vũ dưới trời sao lấp lánh',
    },
  ];

  const galleryItems = photos && photos.length > 0 ? photos : defaultPhotos;

  return (
    <section id="gallery" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-serif uppercase tracking-widest">
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Khoảnh Khắc Vĩnh Cửu</span>
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-100 animate-gold-shimmer">
          Album Ảnh Dạ Tiệc Đêm
        </h2>
        <p className="font-serif italic text-sm text-neutral-400 max-w-md mx-auto">
          Từng khung hình ghi lại nụ cười, ánh mắt và những giây phút ngọt ngào nhất trong hành trình tình yêu.
        </p>
      </div>

      {/* Responsive Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => setLightboxIndex(index)}
            className="group relative cursor-pointer rounded-2xl overflow-hidden p-1 bg-linear-to-b from-amber-400/40 via-yellow-700/20 to-neutral-900 shadow-xl transition-all duration-500 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:-translate-y-1"
          >
            <div className="relative aspect-4/3 sm:aspect-auto sm:h-72 w-full rounded-xl overflow-hidden bg-neutral-900">
              <img
                src={photo.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                alt={photo.caption || `Wedding photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Hover overlay caption */}
              <div className="absolute bottom-0 inset-x-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-serif text-amber-200 text-sm font-semibold drop-shadow-md line-clamp-1">
                  {photo.caption || 'Khoảnh khắc tình yêu'}
                </p>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Phóng to xem sắc nét</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          photos={galleryItems}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={(idx) => setLightboxIndex(idx)}
        />
      )}
    </section>
  );
}
