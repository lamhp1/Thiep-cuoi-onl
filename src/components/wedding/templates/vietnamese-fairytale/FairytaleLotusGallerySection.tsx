import React, { useState } from 'react';
import { GalleryPhoto } from '../../../../types';
import { ChapterHeaderBadge, FolkCloud, FolkLotus, FolkRedSeal } from './FairytaleOrnaments';
import { Maximize2, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FairytaleGalleryPhoto extends GalleryPhoto {
  title?: string;
  description?: string;
}

interface FairytaleLotusGallerySectionProps {
  gallery: GalleryPhoto[];
}

export function FairytaleLotusGallerySection({ gallery }: FairytaleLotusGallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'prewedding' | 'ceremony' | 'moments'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fallback rich gallery if empty
  const defaultPhotos: FairytaleGalleryPhoto[] = [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      caption: 'Hương Sắc Đầu Xuân - Nụ cười rạng rỡ của nàng giữa tà áo dài thắm sắc duyên',
      category: 'prewedding',
      title: 'Hương Sắc Đầu Xuân',
      description: 'Nụ cười rạng rỡ của nàng giữa tà áo dài thắm sắc duyên',
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      caption: 'Dưới Mái Đình Xưa - Khoảnh khắc tay trong tay nguyện ước trăm năm',
      category: 'ceremony',
      title: 'Dưới Mái Đình Xưa',
      description: 'Khoảnh khắc tay trong tay nguyện ước trăm năm',
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      caption: 'Bến Thuyền Hoàng Hôn - Lặng ngắm dòng sông quê lúc ráng chiều buông xuống',
      category: 'moments',
      title: 'Bến Thuyền Hoàng Hôn',
      description: 'Lặng ngắm dòng sông quê lúc ráng chiều buông xuống',
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Gió Thoảng Ven Đầm - Hương sen ngào ngạt gửi gắm lời thề nguyện sắt son',
      category: 'prewedding',
      title: 'Gió Thoảng Ven Đầm',
      description: 'Hương sen ngào ngạt gửi gắm lời thề nguyện sắt son',
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85',
      caption: 'Bình Yên Bên Người - Chỉ cần có nhau, mọi khoảnh khắc đều hóa cổ tích',
      category: 'ceremony',
      title: 'Bình Yên Bên Người',
      description: 'Chỉ cần có nhau, mọi khoảnh khắc đều hóa cổ tích',
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
      caption: 'Đại Hỷ Trăm Năm - Ánh mắt chan chứa tình thâm gửi trao nhau',
      category: 'moments',
      title: 'Đại Hỷ Trăm Năm',
      description: 'Ánh mắt chan chứa tình thâm gửi trao nhau',
    },
  ];

  const photos: FairytaleGalleryPhoto[] =
    gallery && gallery.length > 0 ? (gallery as FairytaleGalleryPhoto[]) : defaultPhotos;

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <section id="lotus-gallery" className="relative py-24 px-4 overflow-hidden bg-[#FAF5EB]">
      {/* Decorative Lotus Water Lily Pond Vector Background */}
      <div className="absolute top-10 left-4 opacity-35 pointer-events-none hidden sm:block">
        <FolkLotus className="w-28 h-28" petalColor="#D64560" coreColor="#E5A93C" />
      </div>
      <div className="absolute bottom-10 right-4 opacity-35 pointer-events-none hidden sm:block">
        <FolkLotus className="w-32 h-32" petalColor="#BA262B" coreColor="#E5A93C" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Chapter 3 Badge */}
        <ChapterHeaderBadge
          chapterNum="Chương III • Bên Bờ Hồ Sen"
          title="Khoảnh Khắc Bích Dao"
          subtext="Hoa sen ngát hương thơm mùa hội ngộ, in bóng hình đôi lứa vẹn tròn duyên"
        />

        {/* Gallery Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {[
            { id: 'all', label: 'Tất Cả Khung Hình' },
            { id: 'prewedding', label: 'Áo Dài Truyền Thống' },
            { id: 'ceremony', label: 'Lễ Nghi Trang Trọng' },
            { id: 'moments', label: 'Khoảnh Khắc Đồng Quê' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-serif font-semibold transition-all cursor-pointer border ${
                activeFilter === tab.id
                  ? 'bg-[#BA262B] border-[#BA262B] text-[#FAF5EB] shadow-md'
                  : 'bg-[#FFFDF9] border-[#D9CBB7] text-[#6D271C] hover:border-[#BA262B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modern Folk Art Gallery Grid (Khung tranh dân gian đương đại) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPhotos.map((photo, idx) => {
            const photoTitle = photo.title || photo.caption || `Tranh Kỷ Niệm #${idx + 1}`;
            const photoDesc = photo.description || (photo.caption !== photoTitle ? photo.caption : undefined);

            return (
              <div
                key={photo.id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative bg-[#FFFDF9] rounded-2xl p-3 sm:p-4 border-2 border-[#D9CBB7] shadow-lg hover:border-[#BA262B] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Photo viewport */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={photo.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                    alt={photoTitle}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white space-y-1">
                      <p className="font-serif-title text-base font-bold drop-shadow">
                        {photoTitle}
                      </p>
                      {photoDesc && (
                        <p className="font-poetry text-xs text-neutral-200 italic line-clamp-2">
                          "{photoDesc}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Enlarge trigger badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Caption strip styled like Dong Ho painting title */}
                <div className="pt-3 flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <FolkLotus className="w-3.5 h-3.5 text-[#BA262B] shrink-0" />
                    <span className="font-serif-title text-xs font-bold text-[#351E17] truncate block" title={photoTitle}>
                      {photoTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#853023] uppercase shrink-0 whitespace-nowrap">
                    Bích Dao {idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-white/10 cursor-pointer"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filteredPhotos[lightboxIndex]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'}
              alt={filteredPhotos[lightboxIndex]?.title || filteredPhotos[lightboxIndex]?.caption || 'Ảnh cưới'}
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl border border-white/20"
            />
            <div className="text-center text-white mt-3 space-y-1">
              <h4 className="font-serif-title text-lg font-bold">
                {filteredPhotos[lightboxIndex]?.title || filteredPhotos[lightboxIndex]?.caption || 'Tranh Kỷ Niệm Cổ Tích'}
              </h4>
              <p className="font-poetry text-xs text-neutral-300 italic">
                {filteredPhotos[lightboxIndex]?.description || 'Hạnh phúc đong đầy giữa chốn làng quê yên bình'}
              </p>
            </div>
          </div>

          <button
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 rounded-full bg-white/10 cursor-pointer"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </section>
  );
}
