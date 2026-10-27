import React from 'react';
import { CouplePerson } from '../../../../types';
import { Heart, User, Phone, Sparkles } from 'lucide-react';
import { WashiTape, Paperclip, Thumbtack, HeartSticker, PressedFlower } from './PolaroidScrapbookOrnaments';
import { PolaroidCard } from './ScrapbookMemorabilia';

interface PolaroidCoupleSectionProps {
  groom?: CouplePerson;
  bride?: CouplePerson;
  groomName?: string;
  brideName?: string;
  onOpenLightbox?: (imgUrl: string) => void;
}

export function PolaroidCoupleSection({
  groom,
  bride,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
  onOpenLightbox,
}: PolaroidCoupleSectionProps) {
  const groomAvatar =
    groom?.avatar ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
  const brideAvatar =
    bride?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <section id="couple" className="relative py-14 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Background Decor */}
      <div className="absolute top-10 right-10 hidden md:block">
        <PressedFlower angle={-25} />
      </div>

      {/* Section Title */}
      <div className="text-center mb-12">
        <div className="inline-block relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <WashiTape style="rose-floral" angle={1} width="w-32" />
          </div>
          <div className="bg-[#FFFDF9] border border-[#E3D4BC] px-6 py-2 rounded-xs shadow-xs inline-flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#C84B5D] fill-current" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7E5E44] font-bold">
              HAI MẢNH GHÉP TÌNH YÊU
            </span>
            <Heart className="w-3.5 h-3.5 text-[#C84B5D] fill-current" />
          </div>
        </div>

        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#2C211B] mt-4">
          Cô Dâu & Chú Rể
        </h2>
        <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5738] mt-1">
          "Hai con người, hai tính cách, một tình yêu chân thành"
        </p>
      </div>

      {/* Grid: Groom & Bride side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 items-start">
        {/* The Groom Column */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm">
            <PolaroidCard
              image={groomAvatar}
              date="The Handsome Groom"
              caption={groom?.fullName || groomName}
              rotation={-3}
              washiStyle="kraft"
              washiPosition="top-left"
              badge="CHÚ RỂ"
              stickerText="MR. RIGHT"
              onClick={() => onOpenLightbox && onOpenLightbox(groomAvatar)}
            />
          </div>

          {/* Groom's Note Card (Ripped Notebook Paper) */}
          <div className="relative w-full max-w-sm mt-6 bg-[#FFFDF9] border border-[#E0D2BB] p-5 rounded-xs shadow-md [background-image:linear-gradient(to_bottom,transparent_23px,#EBE0CE_24px)] [background-size:100%_24px] rotate-[1deg]">
            <div className="absolute -top-3 right-8 z-10">
              <WashiTape style="mint-dots" angle={-5} width="w-20" />
            </div>

            <h3 className="font-serif-title text-lg font-bold text-[#1E1714] border-b border-[#E0D2BB] pb-1 mb-3">
              Lời Tự Bạch Chú Rể
            </h3>

            <p className="font-polaroid-note text-base text-[#4F3F34] leading-relaxed mb-4">
              {groom?.bio ||
                'Người luôn kiên nhẫn lắng nghe, thích chụp ảnh và luôn mong muốn mang đến nụ cười bình yên nhất cho Ngọc Mai trong mọi khoảnh khắc cuộc đời.'}
            </p>

            {/* Parents */}
            {groom?.parents && (
              <div className="pt-2 border-t border-dashed border-[#DFCBB2] text-xs font-mono text-[#78614E] space-y-0.5">
                <span className="font-bold text-[#8C6D1F] block text-[10px] uppercase">
                  GIA ĐÌNH NHÀ TRAI:
                </span>
                <p>Thân phụ: {groom.parents.father}</p>
                <p>Thân mẫu: {groom.parents.mother}</p>
              </div>
            )}
          </div>
        </div>

        {/* The Bride Column */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-sm">
            <PolaroidCard
              image={brideAvatar}
              date="The Beautiful Bride"
              caption={bride?.fullName || brideName}
              rotation={2.5}
              washiStyle="rose-floral"
              washiPosition="top-right"
              badge="CÔ DÂU"
              stickerText="MRS. ALWAYS RIGHT"
              onClick={() => onOpenLightbox && onOpenLightbox(brideAvatar)}
            />
          </div>

          {/* Bride's Note Card (Ripped Notebook Paper) */}
          <div className="relative w-full max-w-sm mt-6 bg-[#FFFDF9] border border-[#E0D2BB] p-5 rounded-xs shadow-md [background-image:linear-gradient(to_bottom,transparent_23px,#EBE0CE_24px)] [background-size:100%_24px] rotate-[-1.5deg]">
            <div className="absolute -top-3 left-8 z-10">
              <WashiTape style="pink-grid" angle={6} width="w-20" />
            </div>

            <h3 className="font-serif-title text-lg font-bold text-[#1E1714] border-b border-[#E0D2BB] pb-1 mb-3">
              Lời Tự Bạch Cô Dâu
            </h3>

            <p className="font-polaroid-note text-base text-[#4F3F34] leading-relaxed mb-4">
              {bride?.bio ||
                'Một tâm hồn ấm áp thích cắm hoa, làm bánh và cùng Minh Anh đi dạo mỗi chiều hoàng hôn. Cảm ơn anh vì đã luôn là điểm tựa vững chãi nhất.'}
            </p>

            {/* Parents */}
            {bride?.parents && (
              <div className="pt-2 border-t border-dashed border-[#DFCBB2] text-xs font-mono text-[#78614E] space-y-0.5">
                <span className="font-bold text-[#8C6D1F] block text-[10px] uppercase">
                  GIA ĐÌNH NHÀ GÁI:
                </span>
                <p>Thân phụ: {bride.parents.father}</p>
                <p>Thân mẫu: {bride.parents.mother}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
