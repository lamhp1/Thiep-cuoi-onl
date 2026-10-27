import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { WeddingEvent } from '../../types';
import { SmartEventActions } from './common/SmartEventActions';

interface EventsSectionProps {
  events: WeddingEvent[];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section id="events" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 sm:mb-20"
      >
        <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] mb-1">
          Lịch Trình Sự Kiện
        </p>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C2A29] tracking-wide uppercase">
          Wedding Events
        </h2>
        <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
      </motion.div>

      {/* Events Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {events.map((event, idx) => {
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className="relative p-8 sm:p-10 rounded-3xl bg-white/75 backdrop-blur-sm border border-[#D4AF37]/30 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Event Type Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#D4AF37]/15 text-[#8C7335] border border-[#D4AF37]/30">
                  {event.type === 'ceremony' ? 'Lễ Thành Hôn' : 'Tiệc Cưới'}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-body">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{event.time}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#2C2A29] mb-3">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm font-body text-neutral-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                )}

                {/* Details list */}
                <div className="space-y-3.5 pt-4 border-t border-neutral-200/80 text-sm font-body">
                  <div className="flex items-start gap-3 text-neutral-700">
                    <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Ngày: <strong>{event.date}</strong></span>
                  </div>

                  <div className="flex items-start gap-3 text-neutral-700">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#2C2A29]">{event.locationName}</strong>
                      <span className="text-xs text-neutral-500">{event.address}</span>
                    </div>
                  </div>
                </div>
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
                className="mt-6 pt-5 border-t border-neutral-100"
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
