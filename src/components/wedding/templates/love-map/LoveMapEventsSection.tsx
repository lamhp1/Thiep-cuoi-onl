import React from 'react';
import { motion } from 'motion/react';
import { WeddingEvent } from '../../../../types';
import { MapPin, Calendar, Clock, Compass } from 'lucide-react';
import { StampBorder } from './LoveMapOrnaments';
import { SmartEventActions } from '../../common/SmartEventActions';

interface LoveMapEventsSectionProps {
  events: WeddingEvent[];
}

export function LoveMapEventsSection({ events }: LoveMapEventsSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <section
      id="events"
      className="relative py-20 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      <div className="relative z-20 max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#722238]">
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>ITINERARY OF THE DAY</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#443B35]">
            LỊCH TRÌNH CÁC CHẶNG LỄ CƯỚI
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/75 font-body leading-relaxed">
            Các trạm dừng thiêng liêng trong ngày trọng đại. Rất hân hạnh được đón tiếp quý khách.
          </p>
        </div>

        {/* Events Grid - Centered flexibly for 1, 2, 3 or more events */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {events.map((event, idx) => {
            const stopNumber = String(idx + 1).padStart(2, '0');

            return (
              <motion.div
                key={event.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group flex flex-col justify-between bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#B9985A]/40 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden w-full sm:w-[350px] lg:w-[370px] max-w-sm"
              >
                {/* Stop Tag Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#722238] text-[#FFFDF9] text-[10px] font-bold tracking-widest uppercase shadow-xs">
                    STOP {stopNumber}
                  </span>

                  <span className="text-xs font-semibold text-[#B9985A] uppercase tracking-wider">
                    {event.type === 'ceremony'
                      ? 'HÔN LỄ'
                      : event.type === 'reception'
                      ? 'TIỆC CƯỚI'
                      : 'SỰ KIỆN'}
                  </span>
                </div>

                {/* Event Main Title */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#443B35] group-hover:text-[#722238] transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-2 py-3 border-y border-[#B9985A]/20 text-xs sm:text-sm text-[#443B35]/80">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#722238] shrink-0" />
                      <span className="font-semibold text-[#722238]">{event.time}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#B9985A] shrink-0" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#722238] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#443B35]">{event.locationName}</p>
                        <p className="text-xs text-[#443B35]/70 mt-0.5">{event.address}</p>
                      </div>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-xs text-[#443B35]/75 font-body leading-relaxed pt-1">
                      {event.description}
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
                  theme="gold"
                  className="pt-3 border-t border-[#B9985A]/20"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
