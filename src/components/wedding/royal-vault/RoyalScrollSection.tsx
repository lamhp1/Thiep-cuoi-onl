import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface RoyalScrollSectionProps {
  id?: string;
  chapterNumber?: string;
  chapterTitle?: string;
  className?: string;
  children: React.ReactNode;
}

export function RoyalScrollSection({
  id,
  chapterNumber,
  chapterTitle,
  className = '',
  children,
}: RoyalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax transform for the background chapter watermark
  const watermarkY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.12, 0.12, 0]);

  // Section 3D perspective rotation and elevation
  const sectionRotateX = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [6, 0, 0, -4]);
  const sectionScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.96, 1, 1, 0.97]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`relative scroll-mt-20 overflow-hidden ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Background Parallax Chapter Watermark */}
      {chapterNumber && (
        <motion.div
          style={{ y: watermarkY, opacity: watermarkOpacity }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden z-0"
        >
          <span className="font-serif font-black text-[130px] sm:text-[220px] md:text-[300px] text-[#E8B498] tracking-tighter leading-none">
            {chapterNumber}
          </span>
        </motion.div>
      )}

      {/* Animated Expanding Laser Light Divider Ribbon on top */}
      <div className="relative z-10 w-full flex items-center justify-center py-2 pointer-events-none">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#E8B498] to-transparent shadow-[0_0_12px_rgba(232,180,152,0.8)] relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border border-[#E8B498] shadow-[0_0_8px_#FFFFFF]" />
        </motion.div>
      </div>

      {/* Chapter Title Badge if provided */}
      {chapterTitle && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex justify-center pt-3 pb-1"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18121D]/80 border border-[#E8B498]/30 backdrop-blur-md shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B498] animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-serif font-semibold text-[#E8B498] tracking-[0.25em] uppercase">
              {chapterTitle}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B498]" />
          </div>
        </motion.div>
      )}

      {/* 3D Elevated Section Body with Scroll Response */}
      <motion.div
        style={{
          rotateX: sectionRotateX,
          scale: sectionScale,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 transition-transform duration-100 ease-out"
      >
        {children}
      </motion.div>
    </div>
  );
}
