import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Film, Calendar, Heart, ArrowDown } from 'lucide-react';
import { WeddingData, StoryMilestone } from '../../../../types';
import { SongHyGlyph, LotusOrnament, AuspiciousCloud, PaperFrameCorner } from '../../vietnamese-traditional/TraditionalOrnaments';

interface VietnameseCinematicScrollChroniclesProps {
  data: WeddingData;
}

interface ChapterItemProps {
  key?: React.Key;
  chapterIndex: number;
  hoiRomanNumeral: string;
  hoiTitleVietnamese: string;
  poeticVerse: string;
  milestone: StoryMilestone;
  totalChapters: number;
}

const DEFAULT_POETIC_VERSES = [
  '“Hương giang bến hẹn buổi chiều mưa • Ánh mắt trao duyên tự thuở xưa”',
  '“Trải bước ngàn dặm dẫu phong sương • Đồng tâm hiệp lực vững can trường”',
  '“Nguyện trao tín vật dưới trăng thanh • Nguyện thề kết tóc vẹn duyên lành”',
  '“Pháo nổ rền vang trọn chén quỳnh • Trăm năm cầm sắt khúc ân tình”',
];

const DEFAULT_HOI_NAMES = [
  'SƠ KIẾN KHỞI DUYÊN',
  'TƯƠNG TRI ĐỒNG HÀNH',
  'ĐÍNH ƯỚC THỆ HẢI',
  'ĐẠI HỶ VU QUY',
];

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

function SingleChronicleChapter({
  chapterIndex,
  hoiRomanNumeral,
  hoiTitleVietnamese,
  poeticVerse,
  milestone,
  totalChapters,
}: ChapterItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Scroll transforms
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.0, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], ['40px', '0px', '-40px']);
  const sealScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const maskInset = useTransform(scrollYProgress, [0.08, 0.45], ['8%', '0%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 0.45, 0.85]);

  return (
    <section
      ref={containerRef}
      id={`chronicle-chapter-${chapterIndex + 1}`}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden snap-start py-20 px-4 sm:px-8 md:px-12 select-none"
    >
      {/* Background Image Container with Silk Scroll Mask */}
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
            className="w-full h-full rounded-2xl sm:rounded-3xl bg-center bg-cover filter brightness-[0.62] contrast-[1.15] shadow-2xl border border-[#D4AF37]/30"
            style={{ backgroundImage: `url(${milestone.image})` }}
          />

          {/* Heritage Imperial Gradient Vignette */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-[#0A0405] via-[#1A0307]/50 to-[#0A0405]/80 pointer-events-none"
          />

          {/* Corner Paper Frame Accents */}
          <div className="absolute top-4 left-4 pointer-events-none text-[#D4AF37]/60">
            <PaperFrameCorner position="top-left" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute top-4 right-4 pointer-events-none text-[#D4AF37]/60">
            <PaperFrameCorner position="top-right" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute bottom-4 left-4 pointer-events-none text-[#D4AF37]/60">
            <PaperFrameCorner position="bottom-left" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="absolute bottom-4 right-4 pointer-events-none text-[#D4AF37]/60">
            <PaperFrameCorner position="bottom-right" className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </motion.div>
      </div>

      {/* Reel Header Watermark */}
      <div className="absolute top-8 left-6 sm:left-12 z-20 flex items-center gap-3 text-[10px] sm:text-xs font-serif tracking-[0.3em] uppercase text-[#D4AF37]/80">
        <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>SỬ KÝ HỶ SỰ &nbsp;•&nbsp; HỒI THỨ {hoiRomanNumeral}</span>
      </div>

      <div className="absolute top-8 right-6 sm:right-12 z-20 text-xs sm:text-sm font-serif tracking-[0.25em] text-[#F3E5AB]/90 border border-[#D4AF37]/40 px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs">
        {milestone.year || '2026'}
      </div>

      {/* Foreground Narrative Typography */}
      <div className="relative z-30 max-w-3xl mx-auto w-full text-center flex flex-col items-center">
        {/* Chapter Vermilion Seal */}
        <motion.div
          style={{ scale: sealScale }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#590B11]/80 backdrop-blur-md border border-[#D4AF37] mb-4 shadow-xl"
        >
          <SongHyGlyph className="w-4 h-4 text-[#F3E5AB]" />
          <span className="font-serif text-xs sm:text-sm font-bold tracking-[0.35em] uppercase text-[#FFF8EB]">
            HỒI THỨ {hoiRomanNumeral} • {hoiTitleVietnamese}
          </span>
          <SongHyGlyph className="w-4 h-4 text-[#F3E5AB]" />
        </motion.div>

        {/* Story Title */}
        <motion.h3
          style={{ y: textY }}
          className="font-serif-title text-2xl sm:text-4xl md:text-5xl font-bold text-[#FFF9F0] tracking-tight mb-3 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]"
        >
          {milestone.title}
        </motion.h3>

        {/* Milestone Date Str */}
        {milestone.dateStr && (
          <p className="text-xs sm:text-sm font-serif tracking-[0.2em] text-[#D4AF37] uppercase mb-4">
            {milestone.dateStr}
          </p>
        )}

        {/* Classical Poetic Verse (Câu Thơ Cổ Phong) */}
        <div className="my-3 px-6 py-2 rounded-xl bg-black/50 backdrop-blur-xs border border-[#D4AF37]/30 max-w-xl">
          <p className="font-serif italic text-xs sm:text-sm text-[#F9E8B6] tracking-wide">
            {poeticVerse}
          </p>
        </div>

        {/* Milestone Description Narrative */}
        <p className="font-body text-sm sm:text-base md:text-lg text-[#EDE6D8] leading-relaxed max-w-2xl mx-auto mt-2 drop-shadow-md">
          {milestone.description}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-8">
          {Array.from({ length: totalChapters }).map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === chapterIndex
                  ? 'w-8 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]'
                  : 'w-2 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function VietnameseCinematicScrollChronicles({ data }: VietnameseCinematicScrollChroniclesProps) {
  const stories = data.stories && data.stories.length > 0 ? data.stories : [];

  if (stories.length === 0) return null;

  return (
    <div id="story-chronicles" className="relative w-full bg-[#0A0405] text-[#FAF6EE]">
      {/* Chapter Section Header */}
      <div className="pt-20 pb-8 text-center px-4">
        <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-[#3D0A11]/60 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-serif uppercase tracking-[0.3em] mb-4">
          <AuspiciousCloud className="w-4 h-3" />
          <span>SỬ KÝ LƯƠNG DUYÊN</span>
          <AuspiciousCloud className="w-4 h-3 scale-x-[-1]" />
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#FFF9F0]">
          Bản Tình Ca Qua Năm Tháng
        </h2>
        <p className="font-serif italic text-xs sm:text-sm text-[#E2D5BE] mt-2 max-w-md mx-auto">
          Mỗi thước phim là một cột mốc khắc cốt ghi tâm se nên mối duyên lành trăm năm
        </p>
      </div>

      {/* Chapters Scroll */}
      <div className="relative">
        {stories.map((milestone, idx) => (
          <SingleChronicleChapter
            key={milestone.id || `story-${idx}`}
            chapterIndex={idx}
            hoiRomanNumeral={ROMAN_NUMERALS[idx] || `${idx + 1}`}
            hoiTitleVietnamese={DEFAULT_HOI_NAMES[idx] || `HỒI THỨ ${idx + 1}`}
            poeticVerse={DEFAULT_POETIC_VERSES[idx % DEFAULT_POETIC_VERSES.length]}
            milestone={milestone}
            totalChapters={stories.length}
          />
        ))}
      </div>
    </div>
  );
}
