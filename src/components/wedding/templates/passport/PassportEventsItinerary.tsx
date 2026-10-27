import React from 'react';
import { motion } from 'motion/react';
import { WeddingEvent } from '../../../../types';
import { MapPin, Clock, Calendar, Ticket } from 'lucide-react';
import { SmartEventActions } from '../../common/SmartEventActions';

interface PassportEventsItineraryProps {
  events?: WeddingEvent[];
  weddingDate?: string;
}

export function PassportEventsItinerary({
  events = [],
  weddingDate = '20/12/2026',
}: PassportEventsItineraryProps) {
  // Fallback default events if empty
  const itineraryEvents: WeddingEvent[] =
    events && events.length > 0
      ? events
      : [
          {
            id: 'ev1',
            type: 'ceremony',
            title: 'Lễ Vu Quy (Nhà Gái)',
            time: '08:30',
            date: weddingDate,
            locationName: 'Tư Gia Nhà Gái',
            address: 'Số 12 Phố Cổ, Hoàn Kiếm, Hà Nội',
            mapUrl: 'https://maps.google.com',
          },
          {
            id: 'ev2',
            type: 'reception',
            title: 'Lễ Thành Hôn (Nhà Trai)',
            time: '11:00',
            date: weddingDate,
            locationName: 'Tư Gia Nhà Trai',
            address: 'Số 88 Đường Kim Mã, Ba Đình, Hà Nội',
            mapUrl: 'https://maps.google.com',
          },
          {
            id: 'ev3',
            type: 'party',
            title: 'Tiệc Cưới Hạnh Phúc (Wedding Banquet)',
            time: '18:00',
            date: weddingDate,
            locationName: 'Trung Tâm Hội Nghị Quốc Tế Almaz',
            address: 'Đường Hoa Lan, Vinhomes Riverside, Long Biên, Hà Nội',
            mapUrl: 'https://maps.google.com',
          },
        ];

  return (
    <section id="events" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#651F2A]/10 border border-[#651F2A]/25 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Ticket className="w-3.5 h-3.5 text-[#B99552]" />
            <span>FLIGHT ITINERARY • STOPS</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            WEDDING ITINERARY
          </h2>

          <p className="font-serif-title italic text-base sm:text-lg text-[#172A3A]">
            Lịch trình các trạm dừng chân trong ngày vui trọng đại
          </p>
        </div>

        {/* Itinerary Cards Grid - Dynamic balanced grid & centered cards */}
        <div
          className={
            itineraryEvents.length === 1
              ? 'max-w-md mx-auto'
              : itineraryEvents.length === 2
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto'
              : itineraryEvents.length === 4
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
          }
        >
          {itineraryEvents.map((ev, idx) => (
            <motion.div
              key={ev.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-7 border-2 border-[#B99552]/35 shadow-lg hover:border-[#B99552] transition-all flex flex-col justify-between relative overflow-hidden h-full"
            >
              <div>
                {/* Top Stop Badge */}
                <div className="flex items-center justify-between border-b border-[#B99552]/25 pb-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#651F2A] text-[#FCFAF5] font-mono text-xs font-bold uppercase tracking-wider">
                    STOP 0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-[#B99552] font-bold tracking-widest uppercase">
                    CONFIRMED
                  </span>
                </div>

                {/* Event Title */}
                <div className="space-y-4">
                  <div className="min-h-[3rem] flex items-center">
                    <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#172A3A] leading-tight">
                      {ev.title}
                    </h3>
                  </div>

                  {/* Details List */}
                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#41372F]">
                      <Clock className="w-4 h-4 text-[#651F2A] shrink-0" />
                      <span className="font-bold text-[#651F2A] text-sm">
                        {ev.time || '10:00'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#41372F]">
                      <Calendar className="w-4 h-4 text-[#B99552] shrink-0" />
                      <span>{ev.date || weddingDate}</span>
                    </div>

                    <div className="flex items-start gap-2 text-[#41372F] pt-1">
                      <MapPin className="w-4 h-4 text-[#172A3A] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[#172A3A] font-sans text-xs">
                          {ev.locationName}
                        </strong>
                        <span className="text-[11px] text-neutral-500 font-sans block leading-relaxed">
                          {ev.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Actions: Map, Grab/Be Ride, Add to Calendar */}
              <SmartEventActions
                event={{
                  title: ev.title,
                  date: ev.date || weddingDate,
                  time: ev.time || '10:00',
                  locationName: ev.locationName,
                  address: ev.address,
                  description: ev.description,
                  mapUrl: ev.mapUrl,
                }}
                theme="gold"
                className="pt-6 mt-6 border-t border-[#B99552]/20"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
