import React from 'react';
import { motion } from 'motion/react';
import { StoryMilestone } from '../../../../types';
import { Heart, Calendar, MapPin, Sparkles } from 'lucide-react';
import {
  BotanicalSketch,
  LoveLetterWashiTape,
  InkUnderline,
} from './LoveLetterOrnaments';

interface LoveLetterStorySectionProps {
  stories: StoryMilestone[];
}

export function LoveLetterStorySection({ stories }: LoveLetterStorySectionProps) {
  // If no stories provided, fallback gracefully
  const displayStories = stories && stories.length > 0 ? stories : [];

  const rotations = [-2, 1.5, -1.5, 2, -1, 1];
  const tapeColors: ('beige' | 'dusty-rose' | 'sage' | 'gold')[] = [
    'dusty-rose',
    'beige',
    'sage',
    'gold',
  ];

  return (
    <section id="story" className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#C8A96B]/35 text-[#7A2638] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 shadow-xs">
          <Heart className="w-3 h-3 fill-current text-[#7A2638]" />
          <span>OUR STORY</span>
        </div>
        <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#59483E] tracking-tight">
          Dòng Ký Ức Của Chúng Mình
        </h2>
        <p className="font-handwriting text-xl sm:text-2xl text-[#7A2638] mt-2">
          Từng mẩu giấy ghi nhớ những cột mốc định mệnh
        </p>
      </div>

      {/* Story Fragments Layout (Not a rigid dashboard timeline) */}
      <div className="space-y-12 sm:space-y-16">
        {displayStories.map((story, index) => {
          const rotation = rotations[index % rotations.length];
          const tapeColor = tapeColors[index % tapeColors.length];
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={story.id || index}
              initial={{ opacity: 0, y: 35, rotate: rotation * 1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: rotation }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.85,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 md:p-10 border border-[#C8A96B]/35 shadow-xl max-w-3xl mx-auto flex flex-col ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-6 md:gap-8 items-center overflow-visible`}
              style={{
                boxShadow:
                  '0 15px 35px -10px rgba(89,72,62,0.12), 0 0 0 1px rgba(200,169,107,0.16)',
              }}
            >
              {/* Adhesive washi tape at the top corner */}
              <LoveLetterWashiTape
                className={`-top-3.5 ${isEven ? 'left-8 sm:left-12' : 'right-8 sm:right-12'}`}
                color={tapeColor}
                angle={rotation > 0 ? 3 : -3}
              />

              {/* Photo Card fragment */}
              {story.image && (
                <div className="w-full md:w-56 shrink-0 aspect-[4/3] sm:aspect-[1/1] rounded-2xl overflow-hidden bg-[#F7F1E7] border border-[#C8A96B]/30 shadow-md relative group">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Note Content fragment */}
              <div className="flex-1 text-left space-y-2.5">
                {/* Year Badge & Date stamp */}
                <div className="flex items-center gap-2">
                  <span className="font-serif-title font-bold text-xl sm:text-2xl text-[#7A2638] tracking-wider">
                    {story.year}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                  <span className="text-xs font-handwriting text-lg text-[#59483E]/80">
                    {story.dateStr || `Năm ${story.year}`}
                  </span>
                </div>

                {/* Milestone Title */}
                <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-[#59483E]">
                  {story.title}
                </h3>

                {/* Milestone Description */}
                <p className="font-handwriting text-lg sm:text-xl text-[#59483E]/90 leading-relaxed">
                  {story.description}
                </p>

                {/* Botanical sketch drawing */}
                <div className="pt-2 flex items-center justify-between">
                  <InkUnderline className="max-w-[140px]" />
                  <BotanicalSketch
                    variant={isEven ? 'branch' : 'rose'}
                    className="w-10 h-10 opacity-50 shrink-0"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
