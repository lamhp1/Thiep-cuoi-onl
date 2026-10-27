import React from 'react';
import { motion } from 'motion/react';
import { StoryMilestone } from '../../../../types';
import { MapPin, Calendar, Camera, Compass } from 'lucide-react';
import { LovePostalStamp } from './LoveMapOrnaments';

interface LoveMapMemoryDestinationsProps {
  stories: StoryMilestone[];
  onSelectStory?: (index: number) => void;
}

export function LoveMapMemoryDestinations({
  stories,
  onSelectStory,
}: LoveMapMemoryDestinationsProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section
      id="memory-destinations"
      className="relative py-20 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      {/* Background Topographic overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-15"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
      >
        <path d="M0,180 Q300,50 600,220 T1000,140" fill="none" stroke="#B9985A" strokeWidth="1.2" strokeDasharray="6 4" />
        <path d="M0,420 Q400,280 800,480 T1000,380" fill="none" stroke="#722238" strokeWidth="1" />
      </svg>

      <div className="relative z-20 max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#722238]">
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>POSTCARDS OF LOVE</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#443B35]">
            BƯU THIẾP NHỮNG ĐIỂM DỪNG KỶ NIỆM
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/75 font-body leading-relaxed">
            Mỗi điểm đến tựa như một tấm bưu thiếp gửi về từ quá khứ, lưu giữ trọn vẹn những ngọt ngào của năm tháng bên nhau.
          </p>
        </div>

        {/* Postcard Grid / Masonry with slight alternate rotation - Centered */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-10">
          {stories.map((story, idx) => {
            // Alternate gentle tilt: -2.5deg, +2deg, -1.5deg...
            const tilt = idx % 3 === 0 ? -2.5 : idx % 3 === 1 ? 2 : -1.2;

            return (
              <motion.div
                key={story.id || idx}
                initial={{ opacity: 0, y: 40, rotate: tilt * 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: tilt }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: (idx % 3) * 0.12 }}
                whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
                className="group relative bg-[#FFFDF9] rounded-2xl p-5 sm:p-6 border border-[#B9985A]/45 shadow-xl transition-all duration-300 flex flex-col justify-between w-full sm:w-[340px] lg:w-[350px] max-w-sm"
                style={{
                  boxShadow: '0 8px 24px rgba(68, 59, 53, 0.08)',
                }}
              >
                {/* Vintage Postal Mark in corner */}
                <div className="absolute -top-3 -right-2 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                  <LovePostalStamp
                    date={story.year || 'DESTINATION'}
                    city={`STOP 0${idx + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20"
                  />
                </div>

                {/* Photo area with white postcard frame border */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#B9985A]/30 mb-4 bg-[#F5EFE3] shadow-xs">
                  <img
                    src={story.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-[#FFFDF9]/90 backdrop-blur-xs text-[10px] font-bold text-[#722238] uppercase tracking-wider flex items-center gap-1 border border-[#B9985A]/30">
                    <Camera className="w-3 h-3 text-[#B9985A]" />
                    <span>POSTCARD #{idx + 1}</span>
                  </div>
                </div>

                {/* Postcard Details Section */}
                <div className="space-y-2 flex-grow flex flex-col justify-between pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#722238] font-bold uppercase tracking-wider mb-1">
                      <span>{story.location || `Kỷ niệm năm ${story.year}`}</span>
                      <span className="text-[#B9985A] font-serif">{story.year}</span>
                    </div>

                    <h3 className="font-serif-title text-xl font-bold text-[#443B35] group-hover:text-[#722238] transition-colors">
                      {story.title}
                    </h3>

                    <div className="w-8 h-[1px] bg-[#B9985A]/40 my-2" />

                    <p className="text-xs sm:text-sm text-[#443B35]/75 font-body leading-relaxed line-clamp-4">
                      {story.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-dashed border-[#B9985A]/30 flex items-center justify-between text-[11px] text-[#443B35]/60 font-mono">
                    <span>STATUS: ARRIVED</span>
                    <span className="text-[#722238] font-bold">LOVE JOURNEY</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
