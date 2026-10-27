import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Film, ArrowDown, MapPin, Calendar, Heart } from 'lucide-react';
import { WeddingData, StoryMilestone } from '../../../../types';

interface CinematicChaptersProps {
  data: WeddingData;
}

interface ChapterItemProps {
  key?: React.Key;
  chapterIndex: number;
  chapterNumberStr: string;
  chapterTitleEn: string;
  milestone: StoryMilestone;
  totalChapters: number;
}

function SingleChapter({
  chapterIndex,
  chapterNumberStr,
  chapterTitleEn,
  milestone,
  totalChapters,
}: ChapterItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Scroll driven transforms
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.0, 1.18]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], ['40px', '0px', '-40px']);
  const chapterNumberX = useTransform(scrollYProgress, [0, 0.5, 1], ['-60px', '0px', '40px']);
  const maskInset = useTransform(scrollYProgress, [0.1, 0.45], ['10%', '0%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.35, 0.85]);

  return (
    <section
      ref={containerRef}
      id={`chapter-${chapterIndex + 1}`}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden snap-start py-20 px-4 sm:px-8 md:px-12"
    >
      {/* Background Image with Mask Aperture and Parallax Zoom */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <motion.div
          style={{
            scale: imageScale,
            y: imageY,
            padding: maskInset,
          }}
          className="w-full h-full relative transition-all duration-300 transform-gpu"
        >
          <div
            className="w-full h-full rounded-2xl sm:rounded-3xl bg-center bg-cover filter brightness-[0.7] contrast-[1.1] shadow-2xl"
            style={{ backgroundImage: `url(${milestone.image})` }}
          />

          {/* Cinematic Vignette */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Film Strip Decorative Watermark */}
      <div className="absolute top-8 left-6 sm:left-12 z-20 flex items-center gap-3 text-[10px] font-mono tracking-[0.3em] uppercase text-white/50">
        <Film className="w-3.5 h-3.5 text-[#E6C687]" />
        <span>REEL 0{chapterIndex + 1} &nbsp;•&nbsp; SCENE 0{chapterIndex + 1}</span>
      </div>

      <div className="absolute top-8 right-6 sm:right-12 z-20 text-[10px] font-mono tracking-[0.3em] uppercase text-[#E6C687]/80">
        {milestone.year}
      </div>

      {/* Foreground Narrative Typography */}
      <div className="relative z-30 max-w-4xl mx-auto w-full text-center flex flex-col items-center">
        {/* Chapter Header: CHAPTER 01 / CHAPTER 02 */}
        <motion.div
          style={{ x: chapterNumberX }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#E6C687]/40 mb-4"
        >
          <Sparkles className="w-3 h-3 text-[#E6C687]" />
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase text-[#E6C687]">
            {chapterNumberStr}
          </span>
        </motion.div>

        {/* English Cinema Title: THE FIRST MEETING / FIRST DATE / THE PROPOSAL */}
        <motion.h2
          style={{ y: textY }}
          className="font-serif-title text-3xl sm:text-5xl md:text-7xl font-black tracking-[0.2em] text-[#FAF6EE] uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] max-w-3xl"
        >
          {chapterTitleEn}
        </motion.h2>

        {/* Vietnamese Milestone Title */}
        <p className="mt-3 text-sm sm:text-base md:text-lg font-serif-title tracking-wider text-[#E6C687] italic font-light drop-shadow-md">
          {milestone.title}
        </p>

        {/* Scene Script Box / Narrative Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 sm:mt-8 max-w-2xl bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-7 text-left shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-[11px] font-mono tracking-widest text-[#E6C687] uppercase">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {milestone.dateStr || milestone.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#E6C687] text-[#E6C687]" />
              SCENE {chapterIndex + 1} OF {totalChapters}
            </span>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-neutral-200 leading-relaxed font-light">
            {milestone.description}
          </p>
        </motion.div>

        {/* Scroll Cue to Next Chapter */}
        {chapterIndex < totalChapters - 1 && (
          <div className="mt-8 flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
            <span>SCROLL TO CHAPTER 0{chapterIndex + 2}</span>
            <ArrowDown className="w-3 h-3 text-[#E6C687] animate-bounce" />
          </div>
        )}
      </div>
    </section>
  );
}

export function CinematicChapters({ data }: CinematicChaptersProps) {
  // Default chapters according to user specifications:
  // CHAPTER 01: THE FIRST MEETING
  // CHAPTER 02: FIRST DATE
  // CHAPTER 03: THE PROPOSAL
  const fallbackMilestones: StoryMilestone[] = [
    {
      id: 'cinematic-c1',
      year: '2019',
      dateStr: '15.04.2019',
      title: 'Lần Đầu Gặp Gỡ Bên Sông Hương',
      description: 'Một chiều mưa bên hiên quán cà phê nhỏ nhìn ra dòng sông Hương. Một ánh nhìn tình cờ, một nụ cười ấm áp đã mở ra câu chuyện tình yêu dịu dàng nhất.',
      image: data.stories[0]?.image || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'cinematic-c2',
      year: '2021',
      dateStr: '24.10.2021',
      title: 'Buổi Hẹn Đầu Tiên Cầu Trường Tiền',
      description: 'Chuyến dạo bộ hoàng hôn trên cầu Trường Tiền lộng gió, những câu chuyện kéo dài hàng giờ không biết chán. Chúng mình nhận ra nhịp đập chung của hai trái tim.',
      image: data.stories[1]?.image || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'cinematic-c3',
      year: '2024',
      dateStr: '14.02.2024',
      title: 'Lời Cầu Hôn Dưới Bầu Trời Sao',
      description: 'Dưới bầu trời đầy sao và ánh nến lung linh trên đồi Thiên An, anh đã quỳ xuống trao chiếc nhẫn ước hẹn. Câu trả lời "Em đồng ý" trong giọt nước mắt hạnh phúc.',
      image: data.stories[2]?.image || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85',
    },
  ];

  // If stories is empty or undefined, hide the chapters section completely
  if (!data.stories || data.stories.length === 0) {
    return null;
  }

  const chaptersToDisplay = data.stories.slice(0, 6);

  const englishChapterTitles = [
    'THE FIRST MEETING',
    'FIRST DATE',
    'THE PROPOSAL',
    'THE WEDDING DAY',
  ];

  return (
    <div id="story-chapters" className="relative w-full">
      {/* Chapter Section Header Banner */}
      <div className="py-16 text-center bg-black text-[#FAF6EE] relative z-20 border-t border-b border-white/10">
        <div className="max-w-xl mx-auto px-6">
          <p className="font-mono text-xs tracking-[0.35em] text-[#E6C687] uppercase mb-2">
            EPISODIC LOVE STORY
          </p>
          <h3 className="font-serif-title text-2xl sm:text-4xl font-bold uppercase tracking-widest">
            Hành Trình Từng Phân Cảnh
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-light">
            Mỗi thước phim là một cột mốc thiêng liêng đưa hai tâm hồn đến bến đỗ hạnh phúc
          </p>
        </div>
      </div>

      {/* Full-Screen Chapter Presentations */}
      {chaptersToDisplay.map((milestone, idx) => (
        <SingleChapter
          key={milestone.id || `chapter-${idx}`}
          chapterIndex={idx}
          chapterNumberStr={`CHAPTER 0${idx + 1}`}
          chapterTitleEn={englishChapterTitles[idx] || `CHAPTER 0${idx + 1}`}
          milestone={milestone}
          totalChapters={chaptersToDisplay.length}
        />
      ))}
    </div>
  );
}
