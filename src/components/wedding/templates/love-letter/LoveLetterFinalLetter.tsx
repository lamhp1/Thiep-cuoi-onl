import React from 'react';
import { motion } from 'motion/react';
import { Heart, ChevronUp } from 'lucide-react';
import {
  LoveLetterWaxSeal,
  BotanicalSketch,
  LoveLetterWashiTape,
  InkUnderline,
} from './LoveLetterOrnaments';

interface LoveLetterFinalLetterProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  backgroundImage?: string;
  onScrollToTop: () => void;
}

export function LoveLetterFinalLetter({
  groomName,
  brideName,
  weddingDate,
  backgroundImage,
  onScrollToTop,
}: LoveLetterFinalLetterProps) {
  const bg =
    backgroundImage ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="relative overflow-hidden pt-16">
      {/* Background with soft romantic wedding photo & overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bg}
          alt="Wedding background"
          className="w-full h-full object-cover opacity-15 filter sepia-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F1E7] via-[#F7F1E7]/90 to-[#EFE7D8]" />
      </div>

      <section id="final-letter" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        {/* The Final Letter Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-[#FFFDF8] rounded-3xl p-8 sm:p-14 md:p-16 border border-[#C8A96B]/40 shadow-2xl text-center overflow-visible"
          style={{
            boxShadow:
              '0 25px 60px -15px rgba(89,72,62,0.18), 0 0 0 1px rgba(200,169,107,0.22)',
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, rgba(200, 169, 107, 0.28) 35px, rgba(200, 169, 107, 0.28) 36px)',
            backgroundPosition: '0 60px',
          }}
        >
          <LoveLetterWashiTape className="-top-3 left-1/2 -translate-x-1/2" color="gold" angle={1} />

          {/* Botanical sketches at edges */}
          <div className="absolute top-6 left-6 hidden sm:block opacity-45 pointer-events-none">
            <BotanicalSketch variant="branch" className="w-14 h-16" />
          </div>
          <div className="absolute top-6 right-6 hidden sm:block opacity-45 pointer-events-none">
            <BotanicalSketch variant="rose" className="w-14 h-16" />
          </div>

          <p className="font-handwriting text-2xl sm:text-3xl text-[#7A2638] font-bold tracking-wide mb-2">
            Hẹn gặp bạn trong ngày hạnh phúc nhất của chúng mình!
          </p>

          <h2 className="font-handwriting text-4xl sm:text-5xl md:text-6xl font-bold text-[#59483E] tracking-tight">
            Ngày {weddingDate}
          </h2>

          <div className="flex justify-center my-3">
            <InkUnderline className="max-w-[200px]" />
          </div>

          <p className="font-handwriting text-xl sm:text-2xl text-[#59483E]/90 max-w-lg mx-auto leading-relaxed my-6">
            "Có những bức thư được viết bằng mực, nhưng bức thư này được viết bằng tất cả chân thành, hạnh phúc và lời cảm ơn sâu sắc nhất từ trái tim hai người."
          </p>

          {/* Signatures & Wax Seal */}
          <div className="mt-8 pt-6 border-t border-[#C8A96B]/20 flex flex-col items-center gap-4">
            <span className="font-handwriting text-2xl text-[#7A2638] italic">
              Thương mến,
            </span>

            <div className="font-handwriting text-3xl sm:text-4xl font-bold text-[#59483E] tracking-wide">
              {groomName} &amp; {brideName}
            </div>

            {/* Red Wax Seal Slammed */}
            <div className="mt-2">
              <LoveLetterWaxSeal text="WITH LOVE" size="lg" stampAnimate={false} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modern Minimalist Footer */}
      <footer className="relative z-10 border-t border-[#C8A96B]/25 py-12 px-4 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#7A2638]">
            WITH LOVE
          </div>
          <div className="font-handwriting text-2xl sm:text-3xl font-bold text-[#59483E]">
            {groomName} &amp; {brideName}
          </div>
          <div className="text-xs text-[#59483E]/70 font-serif">
            {weddingDate} ♥ A LETTER TO REMEMBER
          </div>

          <div className="pt-4">
            <button
              onClick={onScrollToTop}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFDF8] hover:bg-[#F7F1E7] border border-[#C8A96B]/30 text-xs font-serif text-[#7A2638] transition-colors cursor-pointer shadow-xs"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Đầu trang thư</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
