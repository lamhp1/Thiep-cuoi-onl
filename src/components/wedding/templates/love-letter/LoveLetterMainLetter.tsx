import React from 'react';
import { motion } from 'motion/react';
import { Heart, Feather } from 'lucide-react';
import {
  BotanicalSketch,
  LoveLetterWaxSeal,
  LoveLetterWashiTape,
  InkUnderline,
  VintageStampOrnament,
  BrassPaperClipOrnament,
  FountainPenOrnament,
} from './LoveLetterOrnaments';

interface LoveLetterMainLetterProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  city?: string;
}

export function LoveLetterMainLetter({
  groomName,
  brideName,
  weddingDate,
  city = 'TP. Huế',
}: LoveLetterMainLetterProps) {
  return (
    <section
      id="main-letter"
      className="relative py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto"
    >
      {/* Real Paper Sheet Canvas with Ruled Notebook Lines */}
      <motion.div
        initial={{ opacity: 0, y: 35, rotate: -0.5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-12 md:p-16 border border-[#C8A96B]/35 shadow-2xl text-left overflow-visible"
        style={{
          boxShadow:
            '0 20px 50px -15px rgba(89,72,62,0.14), 0 0 0 1px rgba(200,169,107,0.2)',
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, rgba(200, 169, 107, 0.28) 35px, rgba(200, 169, 107, 0.28) 36px)',
          backgroundPosition: '0 120px',
        }}
      >
        {/* Top Left Clipped Postage Stamp with Brass Wire Clip */}
        <div className="hidden sm:block absolute -top-6 -left-4 sm:-left-7 pointer-events-none">
          <VintageStampOrnament
            variant="rose"
            price="5000đ"
            country="THƯ TÌNH"
            postmarkDate={weddingDate}
            angle={-6}
          />
          <BrassPaperClipOrnament className="absolute -top-3 left-4" angle={12} />
        </div>

        {/* Top Washi Tape accent */}
        <LoveLetterWashiTape className="-top-3 right-10 sm:right-16" color="dusty-rose" angle={1.5} />

        {/* Letter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#C8A96B]/25 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#7A2638]">
              <Feather className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>OUR LOVE LETTER</span>
            </div>
            <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#59483E] mt-1">
              Một Lá Thư Cho Ngày Đặc Biệt
            </h2>
          </div>

          <div className="text-right font-handwriting text-base sm:text-lg text-[#59483E]/80 shrink-0">
            <span>Ngày viết: {weddingDate}</span>
            <span className="block text-xs font-serif text-[#C8A96B] uppercase tracking-wider">
              {city}
            </span>
          </div>
        </div>

        {/* Salutation */}
        <div className="mb-6 font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#7A2638] font-bold tracking-wide">
          Gửi gia đình, bạn bè và những người thân yêu nhất,
        </div>

        {/* Letter Body Paragraphs */}
        <div className="space-y-6 text-[#59483E] font-handwriting text-xl sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose font-normal">
          <p>
            Nếu có ai đó hỏi chúng mình điều kỳ diệu nhất trong cuộc sống này là gì, câu trả lời chắc chắn sẽ là khoảnh khắc hai con người xa lạ gặp gỡ, cảm mến và chọn nắm chặt tay nhau đi qua mọi thăng trầm của cuộc đời.
          </p>

          <p>
            Tình yêu của chúng mình không ồn ào hay phô trương, mà được dệt nên từ những buổi chiều dạo bộ đón hoàng hôn, những cái ôm ấm áp sau một ngày dài mệt mỏi, và sự đồng điệu bình dị trong từng ánh mắt, nụ cười. Sau bao ngày tháng cùng nhau trưởng thành, chúng mình hiểu rằng: đã đến lúc cùng nhau xây dựng một mái ấm vẹn tròn.
          </p>

          <p>
            Trong khoảnh khắc thiêng liêng và hạnh phúc nhất của ngày cưới, sự hiện diện cùng lời chúc phúc từ bạn chính là món quà quý giá và trọn vẹn nhất đối với chúng mình. Hãy đến chung vui, cùng nâng ly mừng rượu và viết tiếp những trang kỷ niệm ngọt ngào này nhé!
          </p>
        </div>

        {/* Closing & Signatures */}
        <div className="mt-12 pt-8 border-t border-[#C8A96B]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="font-handwriting text-2xl sm:text-3xl text-[#7A2638] italic">
              Thương mến,
            </div>
            <div className="font-handwriting text-3xl sm:text-4xl font-bold text-[#59483E] mt-2">
              {groomName} &amp; {brideName}
            </div>
            <div className="flex justify-start mt-2">
              <InkUnderline className="max-w-[180px]" />
            </div>
          </div>

          {/* Stamped Wax Seal */}
          <div className="self-end sm:self-center">
            <LoveLetterWaxSeal text="LOVE FOREVER" size="lg" stampAnimate={false} />
          </div>
        </div>

        {/* Fountain Pen resting beside the sign-off */}
        <div className="hidden lg:block absolute -bottom-8 -right-12 xl:-right-20 pointer-events-none">
          <FountainPenOrnament angle={-35} />
        </div>
      </motion.div>
    </section>
  );
}
