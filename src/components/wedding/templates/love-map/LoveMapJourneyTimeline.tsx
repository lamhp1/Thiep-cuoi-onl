import React from 'react';
import { motion } from 'motion/react';
import { StoryMilestone } from '../../../../types';
import { MapPin, Calendar, Heart, Compass, CheckCircle2, ChevronRight } from 'lucide-react';

interface LoveMapJourneyTimelineProps {
  stories: StoryMilestone[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

export function LoveMapJourneyTimeline({
  stories,
  activeIndex,
  onSelectIndex,
}: LoveMapJourneyTimelineProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section
      id="journey-timeline"
      className="relative py-16 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      <div className="relative z-20 max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#722238]">
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>SYNCHRONIZED TIMELINE</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-tight text-[#443B35]">
            DÒNG THỜI GIAN HÀNH TRÌNH
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/75 font-body">
            Nhấn vào bất kỳ chặng đường nào để đồng bộ với Bản đồ tình yêu phía trên.
          </p>
        </div>

        {/* Timeline List with Vertical Connected Line */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-[#722238] before:via-[#B9985A] before:to-[#53665A] before:border-l before:border-dashed before:border-[#B9985A]">
          {stories.map((story, idx) => {
            const isActive = idx === activeIndex;
            const isWedding = idx === stories.length - 1;

            return (
              <motion.div
                key={story.id || idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => onSelectIndex(idx)}
                className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#FFFDF9] border-[#722238] shadow-xl scale-[1.01]'
                    : 'bg-[#FFFDF9]/70 hover:bg-[#FFFDF9] border-[#B9985A]/30 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Timeline node icon on the left vertical line */}
                <div
                  className={`absolute -left-[31px] sm:-left-[47px] top-6 sm:top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-[#722238] text-white shadow-md ring-4 ring-[#B9985A]/40 scale-110'
                      : 'bg-[#FFFDF9] border-2 border-[#B9985A] text-[#722238] group-hover:scale-105'
                  }`}
                >
                  {isWedding ? (
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <span className="text-[10px] font-bold font-mono">
                      {idx + 1}
                    </span>
                  )}
                </div>

                {/* Left info: Year & Date & Stop badge */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#722238] text-white'
                          : 'bg-[#F5EFE3] text-[#722238]'
                      }`}
                    >
                      STOP {idx + 1} • {story.year}
                    </span>

                    {story.dateStr && (
                      <span className="text-[11px] text-[#443B35]/60 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#B9985A]" />
                        {story.dateStr}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#443B35] group-hover:text-[#722238] transition-colors">
                    {story.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#443B35]/75 font-body line-clamp-2 pr-2">
                    {story.description}
                  </p>
                </div>

                {/* Right thumbnail preview & status */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {story.image && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#B9985A]/40 shadow-xs bg-[#F5EFE3]">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div
                    className={`p-2 rounded-full transition-colors ${
                      isActive
                        ? 'bg-[#722238] text-white'
                        : 'bg-[#F5EFE3] text-[#722238] group-hover:bg-[#B9985A]/30'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
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
