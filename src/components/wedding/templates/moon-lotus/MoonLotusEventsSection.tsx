import React from 'react';
import { WeddingEvent } from '../../../../types';
import { Calendar, Clock, MapPin, ExternalLink, Moon, Sparkles, Bookmark } from 'lucide-react';
import { SmartEventActions } from '../../common/SmartEventActions';

interface MoonLotusEventsSectionProps {
  events: WeddingEvent[];
  groomName?: string;
  brideName?: string;
}

export function MoonLotusEventsSection({
  events,
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: MoonLotusEventsSectionProps) {
  const defaultEvents: WeddingEvent[] = events && events.length > 0 ? events : [
    {
      id: 'event-1',
      title: 'Lễ Thành Hôn (Vu Quy)',
      type: 'ceremony',
      date: '20/12/2026',
      time: '09:30',
      locationName: 'Tư Gia Nhà Gái & Nhà Hàng Hương Giang',
      address: '123 Đường Nguyễn Huệ, Phường Vĩnh Ninh, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=123+Nguyen+Hue+Hue+Vietnam',
      description: 'Nghi thức dâng hương gia tiên, trao nhẫn thề ước và nhận lời chúc phúc từ hai bên gia đình.',
    },
    {
      id: 'event-2',
      title: 'Dạ Tiệc Cưới Dưới Ánh Trăng (Wedding Banquet)',
      type: 'reception',
      date: '20/12/2026',
      time: '18:00',
      locationName: 'Trung Tâm Yến Tiệc Hoàng Gia Moonlight Palace',
      address: '456 Đường Lê Lợi, Phường Phú Hội, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=456+Le+Loi+Hue+Vietnam',
      description: 'Dạ yến rượu vang, hòa tấu âm nhạc dưới ánh trăng và cùng khiêu vũ lưu giữ khoảnh khắc đáng nhớ nhất.',
    },
  ];

  // Helper to generate Google Calendar link
  const createGoogleCalendarLink = (event: WeddingEvent) => {
    const title = encodeURIComponent(`Lễ Cưới ${groomName} & ${brideName} — ${event.title}`);
    const details = encodeURIComponent(event.description || 'Trân trọng kính mời quý khách đến chung vui cùng gia đình.');
    const location = encodeURIComponent(`${event.locationName}, ${event.address}`);
    // Assume 2026-12-20
    const dates = '20261220T100000/20261220T210000';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  return (
    <section id="events" className="relative py-20 px-4 sm:px-6 z-20">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5 text-[#EBD494]" />
            <span>Nghi Lễ &amp; Dạ Yến</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#FFFDF7]">
            Lịch Trình Hôn Lễ
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#F4E4BA]/80">
            “Rất hân hạnh được đón tiếp quý quan khách trong ngày vui trọng đại của hai gia đình.”
          </p>
        </div>

        {/* Calendar Highlighting Card */}
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-[#120E28]/80 border border-[#EBD494]/40 shadow-xl backdrop-blur-md text-center space-y-2">
          <p className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#EBD494]">
            Chủ Nhật Hoàng Đạo
          </p>
          <div className="text-5xl font-serif-title font-bold text-[#FFFDF7] tracking-wider my-1">
            20
          </div>
          <p className="text-sm font-serif uppercase tracking-widest text-[#F4E4BA]/90">
            Tháng 12 • Năm 2026
          </p>
          <p className="text-xs font-serif text-neutral-400 italic">
            (Tức ngày 12 tháng 11 năm Bính Ngọ)
          </p>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {defaultEvents.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="relative rounded-3xl p-6 sm:p-8 bg-[#0E122A]/85 border border-[#EBD494]/35 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-[#EBD494]/70 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#751A29]/60 border border-[#EBD494]/40 text-[#F4E4BA] text-xs font-serif font-semibold">
                    <Sparkles className="w-3 h-3 text-[#EBD494]" />
                    <span>{evt.type === 'ceremony' ? 'Nghi Lễ Gia Tiên' : 'Tiệc Cưới Dạ Nguyệt'}</span>
                  </span>
                  <span className="text-xs font-serif text-[#EBD494]/70">
                    20 • 12 • 2026
                  </span>
                </div>

                <h3 className="text-2xl font-serif-title font-bold text-[#FFFDF7]">
                  {evt.title}
                </h3>

                <div className="space-y-2 text-xs sm:text-sm font-serif text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#EBD494] shrink-0 mt-0.5" />
                    <span>Thời gian: <strong className="text-[#FFFDF7]">{evt.time}</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#EBD494] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#FFFDF7] block">{evt.locationName}</strong>
                      <span className="text-neutral-400 text-xs">{evt.address}</span>
                    </div>
                  </div>
                </div>

                {evt.description && (
                  <p className="text-xs font-serif text-neutral-400 italic pt-2 border-t border-[#EBD494]/15 leading-relaxed">
                    {evt.description}
                  </p>
                )}
              </div>

              {/* Smart Actions: Map, Grab/Be Ride, Add to Calendar (.ics / Google / Apple) */}
              <SmartEventActions
                event={{
                  title: evt.title,
                  date: evt.date,
                  time: evt.time,
                  locationName: evt.locationName,
                  address: evt.address,
                  description: evt.description,
                  mapUrl: evt.mapUrl,
                }}
                theme="dark"
                className="pt-3 border-t border-[#EBD494]/20"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
