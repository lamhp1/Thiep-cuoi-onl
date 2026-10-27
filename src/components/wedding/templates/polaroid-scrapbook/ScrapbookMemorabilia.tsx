import React from 'react';
import { Heart, Sparkles, Film, Plane, Calendar, MapPin, Tag } from 'lucide-react';
import { WashiTape, WashiTapeStyle, Paperclip, Thumbtack, StampSticker, PostmarkCircle } from './PolaroidScrapbookOrnaments';

export interface PolaroidCardProps {
  image: string;
  date?: string;
  caption?: string;
  rotation?: number; // e.g. -3, 2, -1
  washiStyle?: WashiTapeStyle;
  washiPosition?: 'top-left' | 'top-right' | 'top-center' | 'both-top' | 'none';
  stickerText?: string;
  onClick?: () => void;
  className?: string;
  badge?: string;
  isHero?: boolean;
}

export function PolaroidCard({
  image,
  date,
  caption,
  rotation = -2,
  washiStyle = 'pink-grid',
  washiPosition = 'top-center',
  stickerText,
  onClick,
  className = '',
  badge,
  isHero = false,
}: PolaroidCardProps) {
  // Compute style rotation string with smooth transition
  return (
    <div
      onClick={onClick}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`group relative bg-white p-3 sm:p-4 pb-8 sm:pb-10 rounded-xs shadow-md hover:shadow-2xl border border-neutral-200/80 transition-all duration-300 ease-out hover:rotate-0 hover:scale-[1.04] hover:z-30 cursor-pointer select-none ${className}`}
    >
      {/* Washi Tape attachments */}
      {washiPosition === 'top-left' && (
        <div className="absolute -top-3 -left-3 z-20">
          <WashiTape style={washiStyle} angle={-25} width="w-20 sm:w-24" />
        </div>
      )}
      {washiPosition === 'top-right' && (
        <div className="absolute -top-3 -right-3 z-20">
          <WashiTape style={washiStyle} angle={25} width="w-20 sm:w-24" />
        </div>
      )}
      {washiPosition === 'top-center' && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <WashiTape style={washiStyle} angle={-1} width="w-24 sm:w-28" />
        </div>
      )}
      {washiPosition === 'both-top' && (
        <>
          <div className="absolute -top-3 -left-2 z-20">
            <WashiTape style={washiStyle} angle={-28} width="w-16 sm:w-20" />
          </div>
          <div className="absolute -top-3 -right-2 z-20">
            <WashiTape style="yellow-stripes" angle={28} width="w-16 sm:w-20" />
          </div>
        </>
      )}

      {/* Optional Top Badge / Sticker */}
      {badge && (
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded-full bg-[#E57A8B] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
            {badge}
          </span>
        </div>
      )}

      {/* Image container */}
      <div className={`relative overflow-hidden bg-neutral-100 ${isHero ? 'aspect-[4/5] sm:aspect-[4/4.5]' : 'aspect-square sm:aspect-[4/3.8]'}`}>
        <img
          src={image}
          alt={caption || 'Polaroid Memory'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Subtle photo glossy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Classic Polaroid Bottom White Border with Handwritten Date & Note */}
      <div className="mt-3 text-center px-1">
        {date && (
          <p className="font-polaroid-note text-sm sm:text-base text-[#8C6D53] tracking-wide">
            {date}
          </p>
        )}
        {caption && (
          <p className="font-polaroid-handwriting text-lg sm:text-xl text-[#3A2E2B] font-bold leading-tight mt-0.5">
            "{caption}"
          </p>
        )}
      </div>

      {/* Corner Sticker if specified */}
      {stickerText && (
        <div className="absolute -bottom-2 -right-2 z-20">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FCE38A] text-[#594002] border border-[#EAC85A] text-[10px] font-bold shadow-xs rotate-6">
            <Heart className="w-2.5 h-2.5 fill-current text-[#D84A5F]" />
            {stickerText}
          </span>
        </div>
      )}
    </div>
  );
}

export function CinemaTicketStub({
  date = '15.04.2019',
  movieName = 'FIRST DATE CINEMA',
  time = '19:30',
  theater = 'CINE LOVE THEATER - RẠP 03',
  seats = 'SEATS A12 & A13',
  quote = '“Ngày ấy anh hồi hộp đến mức làm đổ cả bắp rang bơ...”',
  rotation = -2.5,
  onClick,
}: {
  date?: string;
  movieName?: string;
  time?: string;
  theater?: string;
  seats?: string;
  quote?: string;
  rotation?: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className="group relative bg-[#FBF5E5] text-[#3E3127] border-2 border-dashed border-[#B8965E] rounded-md shadow-md hover:shadow-2xl transition-all duration-300 hover:rotate-0 hover:scale-[1.03] p-4 sm:p-5 max-w-sm w-full mx-auto select-none cursor-pointer"
    >
      {/* Tape on top */}
      <div className="absolute -top-3.5 left-1/4 -translate-x-1/2 z-20">
        <WashiTape style="yellow-stripes" angle={-5} width="w-20" />
      </div>

      {/* Semicircle notches on left and right for authentic ticket look */}
      <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF4EB] border-r-2 border-dashed border-[#B8965E]" />
      <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FAF4EB] border-l-2 border-dashed border-[#B8965E]" />

      <div className="flex items-center justify-between border-b border-[#B8965E]/30 pb-2">
        <div className="flex items-center gap-1.5 text-[#A23847] font-bold text-xs tracking-wider uppercase">
          <Film className="w-3.5 h-3.5" />
          <span>VÉ XEM PHIM KỶ NIỆM</span>
        </div>
        <span className="text-[10px] font-mono text-[#8C6D1F] bg-[#FFF8DE] px-2 py-0.5 rounded-sm border border-[#E5CE85]">
          ADMIT TWO
        </span>
      </div>

      <div className="py-3">
        <h4 className="font-serif-title text-base sm:text-lg font-bold text-[#1E1714]">
          {movieName}
        </h4>
        <p className="text-xs text-[#6A5A4D] font-mono mt-0.5">{theater}</p>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#B8965E]/20 text-center">
          <div>
            <span className="text-[9px] uppercase font-mono text-[#8C6D1F] block">NGÀY HẸN</span>
            <span className="text-xs font-bold font-mono text-[#2B231D]">{date}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono text-[#8C6D1F] block">GIỜ CHIẾU</span>
            <span className="text-xs font-bold font-mono text-[#2B231D]">{time}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono text-[#8C6D1F] block">SỐ GHẾ</span>
            <span className="text-xs font-bold font-mono text-[#A23847]">{seats}</span>
          </div>
        </div>

        {quote && (
          <p className="mt-3 font-polaroid-note text-sm text-[#7D4D32] italic bg-[#FFFBF0] p-2 rounded-xs border border-[#E8DCC2]">
            {quote}
          </p>
        )}
      </div>

      {/* Barcode representation */}
      <div className="pt-2 border-t border-dashed border-[#B8965E]/40 flex items-center justify-between text-neutral-600">
        <div className="h-6 flex items-end gap-[2px] opacity-75">
          {[3, 1, 4, 2, 5, 2, 1, 4, 3, 2, 5, 1, 3, 4, 2, 1, 5, 2, 3].map((h, i) => (
            <div key={i} className="bg-[#3E3127] w-[2px]" style={{ height: `${h * 4}px` }} />
          ))}
        </div>
        <span className="text-[9px] font-mono text-[#8C6D1F]">NO. 2019-FIRST-LOVE</span>
      </div>
    </div>
  );
}

export function FlightBoardingPass({
  flightNo = 'LV-2026',
  from = 'HUẾ (HUI)',
  to = 'ĐÀ LẠT (DLI)',
  passenger = 'MINH ANH & NGỌC MAI',
  date = '12.06.2021',
  gate = '07',
  seat = '01A & 01B',
  note = '“Chuyến du lịch xa đầu tiên cùng nhau. 4 ngày trọn vẹn bình yên nơi phố sương.”',
  rotation = 2,
}: {
  flightNo?: string;
  from?: string;
  to?: string;
  passenger?: string;
  date?: string;
  gate?: string;
  seat?: string;
  note?: string;
  rotation?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className="group relative bg-[#FFFDF9] text-[#3A2F29] border-2 border-[#D9C4A1] rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 hover:rotate-0 hover:scale-[1.03] max-w-md w-full mx-auto select-none overflow-hidden cursor-pointer"
    >
      {/* Tape on top right */}
      <div className="absolute -top-3 -right-2 z-20">
        <WashiTape style="mint-dots" angle={15} width="w-20" />
      </div>

      {/* Header Band */}
      <div className="bg-[#2D4A43] text-[#FAF6EE] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#8CD8B2]" />
          <span className="text-xs font-bold tracking-widest uppercase">LOVE AIRLINES — BOARDING PASS</span>
        </div>
        <span className="text-[10px] font-mono bg-[#8CD8B2]/20 text-[#8CD8B2] px-2 py-0.5 rounded-xs border border-[#8CD8B2]/40">
          FIRST TRIP
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase text-[#7F6F60] block">HÀNH KHÁCH</span>
            <span className="font-serif-title text-sm sm:text-base font-bold text-[#1E1714]">
              {passenger}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono uppercase text-[#7F6F60] block">CHUYẾN BAY</span>
            <span className="font-mono text-xs font-bold text-[#2D4A43]">{flightNo}</span>
          </div>
        </div>

        {/* Route Route Flow */}
        <div className="bg-[#FAF6EE] p-2.5 rounded-md border border-[#EBE1CF] flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-[#8C6D1F] block">KHỞI HÀNH</span>
            <span className="font-bold text-sm text-[#2E241E]">{from}</span>
          </div>
          <div className="flex flex-col items-center px-2">
            <Plane className="w-4 h-4 text-[#2D4A43] rotate-90 my-0.5" />
            <span className="text-[8px] font-mono text-[#A89078] tracking-widest">NON-STOP</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-[#8C6D1F] block">ĐIỂM ĐẾN</span>
            <span className="font-bold text-sm text-[#2E241E]">{to}</span>
          </div>
        </div>

        {/* Grid info */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="border-r border-[#E0D2BC] pr-2">
            <span className="text-[9px] font-mono text-[#7F6F60] block">NGÀY BAY</span>
            <span className="text-xs font-bold font-mono text-[#2E241E]">{date}</span>
          </div>
          <div className="border-r border-[#E0D2BC] px-2">
            <span className="text-[9px] font-mono text-[#7F6F60] block">CỔNG (GATE)</span>
            <span className="text-xs font-bold font-mono text-[#2D4A43]">{gate}</span>
          </div>
          <div className="pl-2">
            <span className="text-[9px] font-mono text-[#7F6F60] block">GHẾ NGỒI</span>
            <span className="text-xs font-bold font-mono text-[#C44358]">{seat}</span>
          </div>
        </div>

        {note && (
          <p className="font-polaroid-note text-sm text-[#634E3F] italic bg-[#FFFBF0] p-2 rounded-xs border border-[#EFE5D2]">
            {note}
          </p>
        )}
      </div>

      {/* Perforated tear line with barcode */}
      <div className="border-t-2 border-dashed border-[#D9C4A1] bg-[#FAF6EE] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1 opacity-70">
          {[2, 4, 1, 3, 5, 2, 4, 1, 3, 2, 4, 1, 5, 3, 2].map((h, i) => (
            <div key={i} className="bg-[#2D4A43] w-[2px]" style={{ height: `${h * 3.5}px` }} />
          ))}
        </div>
        <span className="text-[9px] font-mono text-[#7F6F60]">LOVE TRIP VERIFIED ✓</span>
      </div>
    </div>
  );
}

export function PostcardMemoir({
  city = 'HUẾ - THÁNH ĐỊA TÌNH YÊU',
  date = '14.02.2024',
  message = '“Dưới bầu trời sao lộng gió trên đồi thông Thiên An, anh đã quỳ xuống trao chiếc nhẫn. Em đã gật đầu cùng nụ cười rạng rỡ nhất trần đời. Forever with you!”',
  image = 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
  rotation = -1.5,
  onClick,
}: {
  city?: string;
  date?: string;
  message?: string;
  image?: string;
  rotation?: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className="group relative bg-[#FFFDF9] border border-[#D5C2A5] rounded-xs shadow-md hover:shadow-2xl transition-all duration-300 hover:rotate-0 hover:scale-[1.03] p-4 sm:p-5 max-w-lg w-full mx-auto select-none cursor-pointer"
    >
      {/* Top Left Washi Tape */}
      <div className="absolute -top-3 -left-3 z-20">
        <WashiTape style="rose-floral" angle={-15} width="w-24" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left: Mini photo */}
        <div className="w-full sm:w-2/5 aspect-[4/3] rounded-xs overflow-hidden border border-[#E0D3BE] shadow-xs relative">
          <img
            src={image}
            alt="Postcard Memory"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-xs font-mono">
            {date}
          </div>
        </div>

        {/* Right: Handwritten postcard note & stamp */}
        <div className="w-full sm:w-3/5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D1F] block">
                POSTCARD DE L'AMOUR
              </span>
              <span className="font-serif-title text-xs font-bold text-[#3E3127]">
                {city}
              </span>
            </div>
            {/* Stamp on top right */}
            <StampSticker date={date} angle={4} className="scale-80 origin-top-right" />
          </div>

          <p className="font-polaroid-note text-sm sm:text-base text-[#4E3D31] leading-relaxed my-2 italic">
            {message}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#D5C2A5]/70 text-[10px] font-mono text-[#8C6D1F]">
            <span>SHE SAID YES! 💍</span>
            <PostmarkCircle city="ĐỒI THIÊN AN" date={date} angle={-6} className="scale-60 -my-4 origin-bottom-right" />
          </div>
        </div>
      </div>
    </div>
  );
}
