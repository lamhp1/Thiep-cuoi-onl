import React from 'react';
import { motion } from 'motion/react';
import { WeddingEvent } from '../../../types';
import { FloralDivider } from './FloralOrnaments';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { SmartEventActions } from '../common/SmartEventActions';

interface FloralEventsSectionProps {
  events: WeddingEvent[];
}

export function FloralEventsSection({ events }: FloralEventsSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <section id="events" className="relative py-20 sm:py-28 bg-[#FDF8F5] overflow-hidden">
      {/* Background Soft Pastel Tones */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#FDECEF]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-[#F6EDE0]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-semibold font-body">
            WEDDING ITINERARY & VENUES
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#3E2E31] font-normal italic">
            Sự Kiện Cưới
          </h2>
          <FloralDivider className="w-48 mx-auto my-3" />
          <p className="text-sm font-body text-[#7A696B] leading-relaxed">
            Sự hiện diện và lời chúc phúc của quý khách là niềm hạnh phúc lớn lao nhất đối với hai gia đình.
          </p>
        </motion.div>

        {/* Events Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
          {events.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="relative group bg-white/95 backdrop-blur-xs rounded-3xl p-7 sm:p-9 border border-[#F2DCDD] hover:border-[#D4AF37]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              {/* Corner Fine Gold Lines */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#D4AF37]/50" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#D4AF37]/50" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#D4AF37]/50" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#D4AF37]/50" />

              <div className="space-y-4">
                {/* Event Type Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-[#FCECEF] text-[#D97D8A] text-xs font-semibold uppercase tracking-wider font-body border border-[#F4B8C5]/40">
                    {event.type === 'ceremony'
                      ? 'Lễ Thành Hôn'
                      : event.type === 'reception'
                      ? 'Tiệc Cưới Mừng'
                      : 'Hôn Lễ'}
                  </span>
                  <div className="text-xs text-[#C9A86A] font-semibold font-body tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="font-serif-title text-2xl sm:text-3xl text-[#3E2E31] font-medium">
                  {event.title}
                </h3>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-sm text-[#7A696B] font-body">
                  <Calendar className="w-4 h-4 text-[#D97D8A]" />
                  <span>Ngày {event.date}</span>
                </div>

                {/* Location & Address */}
                <div className="space-y-1.5 pt-2 border-t border-[#F2DCDD]">
                  <div className="flex items-start gap-2 text-sm text-[#3E2E31] font-medium font-body">
                    <MapPin className="w-4 h-4 text-[#D97D8A] shrink-0 mt-0.5" />
                    <span>{event.locationName}</span>
                  </div>
                  <p className="text-xs text-[#7A696B] font-body pl-6 leading-relaxed">
                    {event.address}
                  </p>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-xs text-[#8C767A] italic font-body bg-[#FFFDFD] p-3 rounded-xl border border-[#F2DCDD]">
                    {event.description}
                  </p>
                )}
              </div>

              {/* Smart Actions: Google Maps, Grab/Be Ride, Add to Calendar */}
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
                theme="pink"
                className="pt-2 border-t border-[#F2DCDD]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
