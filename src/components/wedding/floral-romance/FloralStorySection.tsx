import React from 'react';
import { motion } from 'motion/react';
import { StoryMilestone } from '../../../types';
import { FloralDivider } from './FloralOrnaments';
import { Calendar, Heart } from 'lucide-react';

interface FloralStorySectionProps {
  stories: StoryMilestone[];
}

export function FloralStorySection({ stories }: FloralStorySectionProps) {
  if (!stories || stories.length === 0) return null;

  return (
    <section id="story" className="relative py-20 sm:py-28 bg-[#FFFDFD] overflow-hidden">
      {/* Background Soft Pastel Tones */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-[#FDECEF]/50 via-[#F8E7EA]/40 to-[#F6EDE0]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-semibold font-body">
            OUR LOVE STORY
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#3E2E31] font-normal italic">
            Chuyện Tình Yêu
          </h2>
          <FloralDivider className="w-48 mx-auto my-3" />
          <p className="text-sm font-body text-[#7A696B] leading-relaxed">
            Hành trình từ cái nhìn đầu tiên đến lời hẹn thề trọn đời, viết nên bằng những rung cảm ngọt ngào nhất.
          </p>
        </motion.div>

        {/* Timeline Items */}
        <div className="mt-16 relative">
          {/* Central gold dashed line on desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-[1.5px] bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent" />

          <div className="space-y-12 sm:space-y-16">
            {stories.map((story, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={story.id || index}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Photo with scale 0.95 -> 1 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="w-full md:w-1/2 group"
                  >
                    <div className="relative p-2.5 rounded-3xl bg-gradient-to-tr from-[#FFF0F3] via-white to-[#F9EFE7] border border-[#F2DCDD] shadow-sm group-hover:shadow-xl transition-all duration-500 max-w-md mx-auto">
                      <div className="overflow-hidden rounded-2xl aspect-[4/3] relative">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Central timeline floral node on desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FFF0F3] border-2 border-[#D4AF37] items-center justify-center shadow-md z-10 text-[#D97D8A]">
                    <Heart className="w-4 h-4 fill-[#D97D8A]/20" />
                  </div>

                  {/* Text Details with opacity 0 -> 1 */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -25 : 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`w-full md:w-1/2 text-center ${
                      isEven ? 'md:text-right' : 'md:text-left'
                    } space-y-3`}
                  >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCECEF] text-[#D97D8A] text-xs font-semibold font-body border border-[#F4B8C5]/40">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{story.dateStr || story.year}</span>
                    </div>

                    <h3 className="font-serif-title text-2xl sm:text-3xl text-[#3E2E31] font-medium">
                      {story.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-body text-[#7A696B] leading-relaxed">
                      {story.description}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
