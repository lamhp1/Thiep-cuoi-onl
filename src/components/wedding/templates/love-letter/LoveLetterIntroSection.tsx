import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { BotanicalSketch, InkUnderline, LoveLetterWashiTape } from './LoveLetterOrnaments';

interface LoveLetterIntroSectionProps {
  groomName: string;
  brideName: string;
  romanticQuote?: string;
}

export function LoveLetterIntroSection({
  groomName,
  brideName,
  romanticQuote,
}: LoveLetterIntroSectionProps) {
  const quoteLines = romanticQuote && romanticQuote.trim().length > 0
    ? romanticQuote.split('\n').filter(Boolean)
    : [
        'Có những cuộc gặp gỡ bắt đầu rất tình cờ,',
        'nhưng lại trở thành một phần rất đẹp của cuộc đời...',
        'Cảm ơn bạn đã luôn ở bên, chia sẻ và đồng hành cùng chúng mình trên hành trình tình yêu này.',
      ];

  return (
    <section
      id="intro"
      className="relative pt-10 pb-16 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto"
    >
      {/* Real Paper Card Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-10 md:p-14 border border-[#C8A96B]/35 shadow-xl text-center overflow-hidden"
        style={{
          boxShadow: '0 15px 40px -10px rgba(89,72,62,0.12), 0 0 0 1px rgba(200,169,107,0.18)',
        }}
      >
        {/* Washi Tape top center pinning */}
        <LoveLetterWashiTape className="-top-2.5 left-1/2 -translate-x-1/2" color="beige" angle={-1} />

        {/* Botanical sketch on left/right margins */}
        <div className="absolute top-6 left-6 hidden sm:block pointer-events-none opacity-40">
          <BotanicalSketch variant="branch" className="w-16 h-20" />
        </div>
        <div className="absolute bottom-6 right-6 hidden sm:block pointer-events-none opacity-40">
          <BotanicalSketch variant="rose" className="w-16 h-20" />
        </div>

        {/* Small greeting label */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7F1E7] border border-[#C8A96B]/30 text-[#7A2638] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-4"
        >
          <Heart className="w-3 h-3 fill-current text-[#7A2638]" />
          <span>LỜI MỞ ĐẦU TỪ TRÁI TIM</span>
        </motion.div>

        {/* Prominent Handwriting Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#7A2638] tracking-wide leading-tight mb-2"
        >
          Gửi những người chúng mình yêu quý...
        </motion.h2>

        {/* Fountain pen stroke underline */}
        <div className="flex justify-center mb-6">
          <InkUnderline className="max-w-[240px]" />
        </div>

        {/* Line-by-Line Reveal of Emotional Quote */}
        <div className="max-w-2xl mx-auto space-y-3 font-handwriting text-[#59483E] text-xl sm:text-2xl md:text-3xl leading-relaxed">
          {quoteLines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.3 + idx * 0.18,
                ease: 'easeOut',
              }}
              className="relative"
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Handwritten note at footer of page */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 pt-6 border-t border-[#C8A96B]/20 flex items-center justify-center gap-2 text-xs text-[#59483E]/70 font-handwriting text-base"
        >
          <span>Viết từ trái tim</span>
          <span className="text-[#7A2638]">•</span>
          <span>{groomName} &amp; {brideName}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
