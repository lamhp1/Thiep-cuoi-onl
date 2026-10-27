import React, { useState } from 'react';
import { GalleryPhoto } from '../../../../types';
import { playCyberClick, playCyberLaser } from '../../../../lib/audioSynth';
import { LightboxModal } from '../../../ui/LightboxModal';

interface CyberpunkInteractiveAlbumProps {
  gallery?: GalleryPhoto[];
}

export function CyberpunkInteractiveAlbum({ gallery }: CyberpunkInteractiveAlbumProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const defaultGallery: GalleryPhoto[] = [
    {
      id: 'gal-1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
      caption: 'Khoảnh khắc trao lời thề nguyện vĩnh cửu',
      category: 'prewedding',
    },
    {
      id: 'gal-2',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
      caption: 'Kỷ niệm ngọt ngào dưới bầu trời hoàng hôn',
      category: 'prewedding',
    },
    {
      id: 'gal-3',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
      caption: 'Nụ cười rạng rỡ ngày hẹn ước',
      category: 'ceremony',
    },
    {
      id: 'gal-4',
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200',
      caption: 'Những bước chân đồng điệu hướng tới tương lai',
      category: 'moments',
    },
  ];

  const photos = gallery && gallery.length > 0 ? gallery : defaultGallery;

  const handleOpenLightbox = (idx: number) => {
    playCyberLaser();
    setLightboxIndex(idx);
  };

  return (
    <section className="relative py-20 px-6 bg-[#050714] text-slate-100 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30 uppercase bg-cyan-950/30">
            KHO ẢNH TƯƠNG TÁC (INTERACTIVE ALBUM)
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono uppercase text-white tracking-tight holo-glitch">
            ALBUM KỶ NIỆM HOLOGRAM
          </h2>
          <p className="text-xs font-mono text-slate-400 max-w-lg mx-auto">
            Nhấp vào bất kỳ ảnh nào để kích hoạt chế độ xem kính phóng đại Hologram 3D với hiệu ứng âm thanh đặc biệt.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full" />
        </div>

        {/* Gallery Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative bg-[#0B1026]/80 border border-cyan-500/30 hover:border-cyan-400 rounded-3xl overflow-hidden cursor-pointer backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.url}
                  alt={item.caption || `Hologram Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent opacity-80" />

                {/* Cyber badge overlay */}
                <div className="absolute top-3 right-3 bg-cyan-950/80 backdrop-blur-md border border-cyan-400/40 px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-300">
                  HOLOGRAM #{idx + 1}
                </div>

                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <p className="text-sm font-mono font-bold text-white line-clamp-1">
                    Kỷ Niệm Tình Yêu #{idx + 1}
                  </p>
                  <p className="text-xs font-sans text-cyan-200/80 line-clamp-1 font-light">
                    {item.caption || 'Chạm để phóng to'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          isOpen={lightboxIndex !== null}
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => {
            playCyberClick();
            setLightboxIndex(null);
          }}
          onIndexChange={(idx) => setLightboxIndex(idx)}
        />
      )}
    </section>
  );
}
