import React from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar } from 'lucide-react';
import { StoryMilestone } from '../../types';

interface StorySectionProps {
  stories: StoryMilestone[];
}

export function StorySection({ stories }: StorySectionProps) {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <section id="story" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 sm:mb-24"
      >
        <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] mb-1">
          Hành Trình Yêu Thương
        </p>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C2A29] tracking-wide uppercase">
          Our Story
        </h2>
        <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
      </motion.div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Central Vertical Line for Desktop & Left Line for Mobile */}
        <div className="absolute top-8 bottom-8 left-4 md:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/50 to-[#D4AF37]/10 pointer-events-none" />

        <div className="space-y-12 sm:space-y-16">
          {stories.map((milestone, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-6 sm:gap-10 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Center Node Badge */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-[#FDFBF7] border-2 border-[#D4AF37] shadow-md flex items-center justify-center text-[#D4AF37]">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>

                {/* Milestone Image */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0">
                  <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 shadow-md group">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-56 sm:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[#D4AF37] text-xs font-semibold px-3 py-1 rounded-full border border-[#D4AF37]/30">
                      {milestone.year}
                    </div>
                  </div>
                </div>

                {/* Milestone Text Content */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`inline-flex items-center gap-1.5 text-xs text-[#8C7335] font-body mb-2 ${isEven ? 'md:justify-end' : ''}`}>
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{milestone.dateStr}</span>
                    </div>

                    <h3 className="font-serif-title text-xl sm:text-2xl font-medium text-[#2C2A29] mb-2">
                      {milestone.title}
                    </h3>

                    <p className="text-sm font-body text-neutral-600 leading-relaxed">
                      {milestone.description}
                    </p>
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
