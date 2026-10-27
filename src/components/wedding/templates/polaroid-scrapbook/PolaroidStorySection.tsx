import React from 'react';
import { StoryMilestone } from '../../../../types';
import { Heart, Sparkles, BookHeart, Compass, Film, Plane } from 'lucide-react';
import { WashiTape, Paperclip, Thumbtack, PressedFlower, HeartSticker } from './PolaroidScrapbookOrnaments';
import { PolaroidCard, CinemaTicketStub, FlightBoardingPass, PostcardMemoir } from './ScrapbookMemorabilia';

interface PolaroidStorySectionProps {
  stories?: StoryMilestone[];
  onOpenLightbox?: (imgUrl: string) => void;
}

export function PolaroidStorySection({
  stories = [],
  onOpenLightbox,
}: PolaroidStorySectionProps) {
  return (
    <section id="story" className="relative py-14 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Scattered ornaments */}
      <div className="absolute top-12 left-10 hidden lg:block">
        <Paperclip angle={-15} />
      </div>
      <div className="absolute top-16 right-12 hidden lg:block">
        <PressedFlower angle={30} />
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <WashiTape style="yellow-stripes" angle={-1} width="w-32" />
          </div>
          <div className="bg-[#FFFDF9] border border-[#E3D4BC] px-6 py-2 rounded-xs shadow-xs inline-flex items-center gap-2">
            <BookHeart className="w-3.5 h-3.5 text-[#D9735A]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7E5E44] font-bold">
              KÝ ỨC THỦ CÔNG • OUR SCRAPBOOK
            </span>
            <BookHeart className="w-3.5 h-3.5 text-[#D9735A]" />
          </div>
        </div>

        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#2C211B] mt-4">
          Hành Trình Kỷ Niệm Của Chúng Mình
        </h2>
        <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5738] mt-1 max-w-xl mx-auto">
          "Từng tấm ảnh, chiếc vé xem phim, vé máy bay hay tấm bưu thiếp... đều ghi dấu khoảnh khắc trái tim cùng chung nhịp đập."
        </p>
      </div>

      {/* Story Timeline / Scrapbook Pages */}
      <div className="space-y-16 sm:space-y-24">
        {/* MILESTONE 1: First Date & Cinema Ticket */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: Polaroid Photo rotated -3deg */}
          <div className="w-full lg:w-1/2 max-w-md">
            <PolaroidCard
              image={
                stories[0]?.image ||
                'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80'
              }
              date={stories[0]?.dateStr || '15.04.2019'}
              caption="Lần đầu gặp gỡ tại quán cà phê nhỏ"
              rotation={-3}
              washiStyle="pink-grid"
              washiPosition="top-left"
              stickerText="SWEET BEGINNING"
              onClick={() =>
                onOpenLightbox &&
                onOpenLightbox(
                  stories[0]?.image ||
                    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80'
                )
              }
            />
          </div>

          {/* Right: Vintage Cinema Ticket Stub */}
          <div className="w-full lg:w-1/2 max-w-md">
            <CinemaTicketStub
              date="15.04.2019"
              movieName="FIRST DATE CINEMA"
              time="19:30"
              theater="RẠP HƯƠNG GIANG — PHÒNG CHIẾU 02"
              seats="GHẾ ĐÔI A12 & A13"
              quote="“Buổi xem phim đầu tiên, cả hai đều lúng túng nhìn nhau nhiều hơn nhìn màn hình...”"
              rotation={2}
            />
          </div>
        </div>

        {/* MILESTONE 2: First Trip & Flight Boarding Pass */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: Flight Boarding Pass */}
          <div className="w-full lg:w-1/2 max-w-md">
            <FlightBoardingPass
              flightNo="VN-1206"
              from="HUẾ (HUI)"
              to="ĐÀ LẠT (DLI)"
              passenger="MINH ANH & NGỌC MAI"
              date="12.06.2021"
              gate="07"
              seat="01A & 01B"
              note="“Chuyến đi đầu tiên xa nhà cùng nhau. 12.06.2021 — Our first trip! Cùng ngắm bình minh trên đồi chè và sương giăng khắp lối.”"
              rotation={-2}
            />
          </div>

          {/* Right: Polaroid Photo rotated 2deg */}
          <div className="w-full lg:w-1/2 max-w-md">
            <PolaroidCard
              image={
                stories[1]?.image ||
                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'
              }
              date="12.06.2021"
              caption="Our first trip"
              rotation={2}
              washiStyle="mint-dots"
              washiPosition="top-right"
              stickerText="TRIP OF LOVE"
              onClick={() =>
                onOpenLightbox &&
                onOpenLightbox(
                  stories[1]?.image ||
                    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'
                )
              }
            />
          </div>
        </div>

        {/* MILESTONE 3: The Proposal & Vintage Postcard */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: Polaroid Photo rotated -1deg */}
          <div className="w-full lg:w-1/2 max-w-md">
            <PolaroidCard
              image={
                stories[2]?.image ||
                'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80'
              }
              date={stories[2]?.dateStr || '14.02.2024'}
              caption="She said YES!"
              rotation={-1}
              washiStyle="rose-floral"
              washiPosition="top-center"
              stickerText="YES! FOREVER"
              onClick={() =>
                onOpenLightbox &&
                onOpenLightbox(
                  stories[2]?.image ||
                    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80'
                )
              }
            />
          </div>

          {/* Right: Postcard Memoir */}
          <div className="w-full lg:w-1/2 max-w-md">
            <PostcardMemoir
              city="ĐỒI THIÊN AN • HUẾ"
              date="14.02.2024"
              message="“Dưới ánh hoàng hôn vàng rực và đồi thông lộng gió, anh đã quỳ xuống nắm lấy tay em. Em rơi nước mắt và khẽ mỉm cười gật đầu.”"
              image={
                stories[2]?.image ||
                'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80'
              }
              rotation={1.5}
            />
          </div>
        </div>

        {/* MILESTONE 4: The Wedding Day */}
        <div className="max-w-2xl mx-auto text-center pt-4">
          <div className="relative bg-[#FFFDF9] border border-[#E0D2BB] p-6 sm:p-8 rounded-xs shadow-md rotate-[-0.5deg]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <WashiTape style="gold-sheen" angle={0} width="w-36" />
            </div>

            <div className="inline-block px-3 py-1 bg-[#D9735A]/10 text-[#C84B5D] rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3">
              MỐC KHỞI ĐẦU VĨNH CỬU
            </div>

            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1E1714]">
              {stories[3]?.title || 'The Wedding - Ngày Chúng Ta Chung Đôi'}
            </h3>

            <p className="font-polaroid-note text-lg sm:text-xl text-[#6D5340] max-w-lg mx-auto mt-2 leading-relaxed">
              {stories[3]?.description ||
                'Một trang mới đầy hy vọng và yêu thương được mở ra trước sự chứng kiến và chúc phúc của những người thân yêu nhất trong cuộc đời.'}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <HeartSticker text="FOREVER" color="red" angle={-4} />
              <HeartSticker text="20.12.2026" color="gold" angle={3} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
