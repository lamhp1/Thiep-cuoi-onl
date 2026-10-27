import React from 'react';
import { WeddingEvent } from '../../../../types';
import { Calendar, Clock, MapPin, Sparkles, Heart } from 'lucide-react';
import { WashiTape, Paperclip, Thumbtack, HeartSticker, StampSticker } from './PolaroidScrapbookOrnaments';
import { SmartEventActions } from '../../common/SmartEventActions';

interface PolaroidEventsSectionProps {
  events: WeddingEvent[];
  weddingDate?: string;
}

export function PolaroidEventsSection({ events, weddingDate = '20.12.2026' }: PolaroidEventsSectionProps) {
  const displayEvents = events && events.length > 0 ? events : [
    {
      id: 'event-1',
      title: 'Lễ Thành Hôn (Vu Quy)',
      type: 'ceremony' as const,
      date: '20/12/2026',
      time: '10:00',
      locationName: 'Tư gia Nhà Gái & Nhà Hàng Hương Giang',
      address: '123 Đường Nguyễn Huệ, Phường Vĩnh Ninh, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=123+Nguyen+Hue+Hue+Vietnam',
      description: 'Nghi thức trao nhẫn truyền thống, nhận phúc lành từ hai bên gia đình.',
    },
    {
      id: 'event-2',
      title: 'Tiệc Cưới Mừng Hạnh Phúc',
      type: 'reception' as const,
      date: '20/12/2026',
      time: '18:00',
      locationName: 'Trung Tâm Yến Tiệc Hoàng Gia Imperial',
      address: '456 Đường Lê Lợi, Phường Phú Hội, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=456+Le+Loi+Hue+Vietnam',
      description: 'Khai tiệc mừng rượu champagne, chia sẻ khoảnh khắc ngọt ngào và khiêu vũ.',
    },
  ];

  return (
    <section id="events" className="relative py-14 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center mb-14">
        <div className="inline-block relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <WashiTape style="mint-dots" angle={-1} width="w-32" />
          </div>
          <div className="bg-[#FFFDF9] border border-[#E3D4BC] px-6 py-2 rounded-xs shadow-xs inline-flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#D9735A]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7E5E44] font-bold">
              THÔNG TIN HÔN LỄ & TIỆC MỪNG
            </span>
            <Calendar className="w-3.5 h-3.5 text-[#D9735A]" />
          </div>
        </div>

        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#2C211B] mt-4">
          Lịch Trình Sự Kiện
        </h2>
        <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5738] mt-1">
          "Sự hiện diện của quý vị là niềm vinh hạnh lớn nhất của gia đình chúng tôi"
        </p>
      </div>

      {/* Events Grid: Styled as Stationery Invitation Cards pinned to the desk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {displayEvents.map((evt, idx) => {
          const rotation = idx % 2 === 0 ? -1.5 : 1.5;
          const washiType = idx % 2 === 0 ? ('pink-grid' as const) : ('yellow-stripes' as const);

          return (
            <div
              key={evt.id || idx}
              style={{ transform: `rotate(${rotation}deg)` }}
              className="group relative bg-[#FFFDF9] border border-[#DFCBB2] p-6 sm:p-8 rounded-xs shadow-md hover:shadow-2xl transition-all duration-300 hover:rotate-0 hover:scale-[1.02] flex flex-col justify-between select-none"
            >
              {/* Paperclip on top-left */}
              <div className="absolute -top-4 left-6 z-20">
                <Paperclip angle={idx % 2 === 0 ? -10 : 15} />
              </div>

              {/* Washi Tape on top-right */}
              <div className="absolute -top-3.5 right-6 z-10">
                <WashiTape style={washiType} angle={idx % 2 === 0 ? 5 : -4} width="w-24" />
              </div>

              <div>
                {/* Badge */}
                <div className="flex items-center justify-between border-b border-[#E8D9C5] pb-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#FAF4EB] border border-[#DDCAB2] text-[#8C6D1F] text-xs font-mono font-bold uppercase tracking-wider">
                    {evt.type === 'ceremony' ? 'LỄ THÀNH HÔN' : 'TIỆC CƯỚI'}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#A64B59]">
                    {evt.date || weddingDate}
                  </span>
                </div>

                <h3 className="font-serif-title text-2xl font-bold text-[#1F1714] group-hover:text-[#C84B5D] transition-colors">
                  {evt.title}
                </h3>

                {evt.description && (
                  <p className="font-polaroid-note text-base text-[#6E5748] mt-2 italic">
                    "{evt.description}"
                  </p>
                )}

                {/* Details list */}
                <div className="mt-5 space-y-3 bg-[#FAF6EE] p-4 rounded-xs border border-[#E9DDC9]">
                  <div className="flex items-center gap-3 text-sm text-[#3E3128]">
                    <div className="w-7 h-7 rounded-full bg-white border border-[#D5C2A5] flex items-center justify-center shrink-0 text-[#C84B5D]">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8C6D1F] block">THỜI GIAN</span>
                      <span className="font-bold text-sm">{evt.time || '10:00'} • {evt.date || weddingDate}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-[#3E3128]">
                    <div className="w-7 h-7 rounded-full bg-white border border-[#D5C2A5] flex items-center justify-center shrink-0 text-[#C84B5D] mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#8C6D1F] block">ĐỊA ĐIỂM</span>
                      <span className="font-bold text-sm block">{evt.locationName}</span>
                      <span className="text-xs text-[#705C4D] leading-relaxed block mt-0.5">{evt.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Actions: Map, Grab/Be Ride, Add to Calendar */}
              <SmartEventActions
                event={{
                  title: evt.title,
                  date: evt.date || weddingDate,
                  time: evt.time || '10:00',
                  locationName: evt.locationName,
                  address: evt.address,
                  description: evt.description,
                  mapUrl: evt.mapUrl,
                }}
                theme="gold"
                className="mt-6 pt-4 border-t border-dashed border-[#DFCBB2]"
              />
            </div>
          );
        })}
      </div>

      {/* Calendar Reminder Note Card */}
      <div className="mt-12 max-w-lg mx-auto bg-[#FFFDF9] border border-[#DFCBB2] p-5 rounded-xs shadow-md text-center relative rotate-[0.5deg]">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <WashiTape style="kraft" angle={-1} width="w-24" />
        </div>
        <p className="font-serif-title text-base font-bold text-[#1E1714]">
          Lưu Lại Ngày Cưới
        </p>
        <p className="font-polaroid-note text-lg text-[#C84B5D] font-bold mt-1">
          Chủ Nhật, Ngày 20 Tháng 12 Năm 2026
        </p>
        <p className="text-xs font-mono text-[#7D6652] mt-0.5">
          (Nhằm ngày 12 tháng 11 năm Bính Ngọ)
        </p>
      </div>
    </section>
  );
}
