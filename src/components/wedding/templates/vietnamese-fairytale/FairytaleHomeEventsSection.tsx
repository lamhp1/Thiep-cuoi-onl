import React from 'react';
import { WeddingEvent } from '../../../../types';
import { ChapterHeaderBadge, FolkCloud, FolkLotus, FolkRedSeal } from './FairytaleOrnaments';
import { Calendar, Clock, MapPin, Navigation, ExternalLink } from 'lucide-react';

interface FairytaleHomeEventsSectionProps {
  events: WeddingEvent[];
}

export function FairytaleHomeEventsSection({ events }: FairytaleHomeEventsSectionProps) {
  // Default events if none provided
  const displayEvents: WeddingEvent[] =
    events && events.length > 0
      ? events
      : [
          {
            id: 'e1',
            title: 'Lễ Vu Quy (Nhà Gái)',
            type: 'ceremony',
            date: '20/12/2026',
            time: '08:00',
            locationName: 'Tư Gia Nhà Gái',
            address: 'Số 12 Thôn Đông, Xã Kim Liên, Nam Đàn, Nghệ An',
            mapUrl: 'https://maps.google.com',
            description: 'Lễ trao dâu, xuất giá tạ ơn đấng sinh thành',
          },
          {
            id: 'e2',
            title: 'Lễ Thành Hôn (Nhà Trai)',
            type: 'ceremony',
            date: '20/12/2026',
            time: '11:00',
            locationName: 'Tư Gia Nhà Trai',
            address: 'Số 88 Làng Cổ Đường Lâm, Sơn Tây, Hà Nội',
            mapUrl: 'https://maps.google.com',
            description: 'Lễ bái gia tiên, nghênh đón tân nương vào nhà',
          },
          {
            id: 'e3',
            title: 'Tiệc Cưới Đại Hỷ (Tiệc Mừng)',
            type: 'reception',
            date: '20/12/2026',
            time: '17:30',
            locationName: 'Trung Tâm Tiệc Cưới Trống Đồng Hoàng Gia',
            address: 'Đại Lộ Thăng Long, Mễ Trì, Nam Từ Liêm, Hà Nội',
            mapUrl: 'https://maps.google.com',
            description: 'Khai tiệc rượu mừng, cùng gia quyến nâng ly chúc phúc',
          },
        ];

  const handleAddToCalendar = (event: WeddingEvent) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || `Lễ cưới của đôi bạn trẻ tại ${event.locationName}`);
    const location = encodeURIComponent(`${event.locationName}, ${event.address}`);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <section id="home-events" className="relative py-24 px-4 overflow-hidden bg-[#F5EFE3]">
      {/* Decorative Traditional Tile Roof Eaves Backdrop */}
      <div className="absolute top-0 inset-x-0 h-4 bg-[#8A3224] border-b-2 border-[#6D271C] flex items-center justify-center pointer-events-none">
        <div className="h-1 w-full bg-[#E5A93C]/40" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Chapter 4 Badge */}
        <ChapterHeaderBadge
          chapterNum="Chương IV • Dưới Mái Nhà Ấm"
          title="Lịch Trình Đại Hỷ"
          subtext="Mái nhà ngói đỏ đèn lồng rạng rỡ, trầu têm cánh phượng đón khách quý chung vui"
        />

        {/* Traditional Home Events Cards Centered Layout */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-12">
          {displayEvents.map((evt, idx) => {
            const badgeLabel = idx === 0 ? 'VU QUY' : idx === 1 ? 'THÀNH HÔN' : 'ĐẠI HỶ';
            const cardWidthClass =
              displayEvents.length === 1
                ? 'max-w-lg'
                : displayEvents.length === 2
                ? 'sm:w-[calc(50%-1rem)] max-w-md'
                : 'sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm';

            return (
              <div
                key={evt.id || idx}
                className={`group relative bg-[#FFFDF9] rounded-2xl p-6 sm:p-7 border-2 border-[#D9CBB7] shadow-lg hover:border-[#BA262B] transition-all duration-300 flex flex-col justify-between w-full ${cardWidthClass}`}
              >
                {/* Event Badge & Type */}
                <div>
                  <div className="flex items-center justify-between border-b border-[#E6D8C2] pb-3 mb-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#853023] uppercase">
                      <Clock className="w-3.5 h-3.5 text-[#BA262B]" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="relative px-2.5 py-1 rounded-md border border-[#BA262B] bg-[#BA262B]/10 text-[#BA262B] font-serif font-bold text-[10px] tracking-wider flex items-center justify-center shadow-2xs select-none">
                      <div className="absolute inset-0.5 border border-dashed border-[#BA262B]/40 rounded-[3px] pointer-events-none" />
                      <span>{badgeLabel}</span>
                    </div>
                  </div>

                  <h3 className="font-serif-title text-xl font-bold text-[#351E17] mb-2 leading-snug">
                    {evt.title}
                  </h3>

                  {evt.description && (
                    <p className="font-poetry text-xs text-[#7A4C3E] italic mb-5 leading-relaxed">
                      "{evt.description}"
                    </p>
                  )}

                  {/* Date & Location Details */}
                  <div className="space-y-3 bg-[#FAF5EB] p-4 rounded-xl border border-[#E6D8C2] mb-6">
                    <div className="flex items-start gap-2.5 text-xs text-[#543026]">
                      <Calendar className="w-4 h-4 text-[#BA262B] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-serif font-bold block">{evt.date}</span>
                        <span className="text-[10px] text-[#853023] font-mono uppercase">Ngày Hoàng Đạo</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs text-[#543026]">
                      <MapPin className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-serif font-bold block">{evt.locationName}</span>
                        <span className="text-[11px] text-[#7A4C3E] block leading-normal">{evt.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Maps & Calendar */}
                <div className="space-y-2 pt-2">
                  <a
                    href={evt.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${evt.locationName} ${evt.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#BA262B] hover:bg-[#853023] text-[#FAF5EB] text-xs font-serif font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Chỉ Đường Google Maps</span>
                  </a>

                  <button
                    onClick={() => handleAddToCalendar(evt)}
                    className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-[#BA262B]/5 border border-[#BA262B]/30 text-[#853023] text-xs font-serif font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Thêm Vào Lịch Hẹn</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
