import React from 'react';
import { motion } from 'motion/react';
import { WeddingEvent } from '../../../types';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperFrameCorner,
  TraditionalDivider,
} from './TraditionalOrnaments';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { SmartEventActions } from '../common/SmartEventActions';

interface TraditionalEventsSectionProps {
  events?: WeddingEvent[];
  groomName?: string;
  brideName?: string;
}

export function TraditionalEventsSection({
  events,
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: TraditionalEventsSectionProps) {
  const defaultEvents: WeddingEvent[] = [
    {
      id: 'ev-1',
      title: 'Lễ Vu Quy (Nhà Gái)',
      type: 'ceremony',
      date: '20/12/2026',
      time: '08:30',
      locationName: 'Tư Gia Nhà Gái',
      address: '123 Đường Nguyễn Huệ, Phường Vĩnh Ninh, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=Hue+Vietnam',
      description: 'Nghi thức dâng hương gia tiên, nhận phúc chúc từ song thân phụ mẫu và trao lễ vật.',
    },
    {
      id: 'ev-2',
      title: 'Lễ Thành Hôn & Tiệc Cưới',
      type: 'reception',
      date: '20/12/2026',
      time: '11:00',
      locationName: 'Trung Tâm Yến Tiệc Hoàng Gia',
      address: '456 Đường Lê Lợi, Phường Phú Hội, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=Hue+Vietnam',
      description: 'Kính mời quý quan khách cùng nâng ly chúc mừng hạnh phúc của đôi tân lang & tân nương.',
    },
  ];

  const eventList = events && events.length > 0 ? events : defaultEvents;

  return (
    <section id="events" className="relative py-20 sm:py-24 bg-[#FAF6EE] text-[#3D1A1E] overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BA1E28]/10 border border-[#BA1E28]/25 text-[#BA1E28] text-xs font-semibold uppercase tracking-widest">
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28]" />
            <span>Thời Khắc Trọng Đại</span>
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28] scale-x-[-1]" />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B1119] tracking-wide">
            Sự Kiện Cưới Hỏi
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#735154] max-w-md mx-auto leading-relaxed">
            Kính mời quý thân hữu bớt chút thời gian quý báu đến tham dự và chứng kiến giờ lành kết duyên của đôi trẻ.
          </p>

          <TraditionalDivider className="mt-4" />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {eventList.map((event, idx) => {
            return (
              <motion.div
                key={event.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(186,30,40,0.06)] flex flex-col justify-between"
              >
                <PaperFrameCorner position="top-left" className="top-2 left-2 w-6 h-6 text-[#D4AF37]" />
                <PaperFrameCorner position="top-right" className="top-2 right-2 w-6 h-6 text-[#D4AF37]" />
                <PaperFrameCorner position="bottom-left" className="bottom-2 left-2 w-6 h-6 text-[#D4AF37]" />
                <PaperFrameCorner position="bottom-right" className="bottom-2 right-2 w-6 h-6 text-[#D4AF37]" />

                <div>
                  {/* Event Type Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#BA1E28] text-white text-[11px] font-bold font-serif-title uppercase tracking-wider">
                      {event.type === 'ceremony' ? 'Nghi Lễ Gia Tiên' : 'Tiệc Cưới Báo Hỷ'}
                    </span>
                    <span className="text-[11px] font-body text-[#A66D29] font-semibold uppercase tracking-wider">
                      Hoàng Đạo Cát Nhật
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-title text-2xl font-bold text-[#8B1119] mb-4">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-3 font-body text-xs sm:text-sm text-[#5C3D40] border-y border-[#F0E4CE] py-4 my-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#BA1E28]/10 text-[#BA1E28] flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[#8C6B38] text-[11px] block uppercase font-medium">Giờ đón khách</span>
                        <span className="font-bold text-[#1A1816] text-base">{event.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#BA1E28]/10 text-[#BA1E28] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[#8C6B38] text-[11px] block uppercase font-medium">Ngày tốt</span>
                        <span className="font-bold text-[#8B1119] text-base">{event.date}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#BA1E28]/10 text-[#BA1E28] flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1A1816] block">{event.locationName}</span>
                        <span className="text-[#735154] text-xs leading-relaxed block mt-0.5">{event.address}</span>
                      </div>
                    </div>
                  </div>

                  {event.description && (
                    <p className="font-body text-xs text-[#6B5A52] italic mb-6">
                      “{event.description}”
                    </p>
                  )}
                </div>

                {/* Smart Actions: Map, Grab/Be Ride, Add to Calendar */}
                <SmartEventActions
                  event={{
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    locationName: event.locationName,
                    address: event.address,
                    description: event.description,
                    mapUrl: event.mapUrl,
                  }}
                  theme="red"
                  className="pt-2 border-t border-[#F0E4CE]"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
