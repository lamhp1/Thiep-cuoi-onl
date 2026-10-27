import React from 'react';
import { motion } from 'motion/react';
import { StoryMilestone } from '../../../types';
import { SongHyGlyph, AuspiciousCloud, DongSonDrumPattern, PaperFrameCorner } from './TraditionalOrnaments';
import { Heart, Sparkles, Calendar } from 'lucide-react';

interface TraditionalPaperScrollStoryProps {
  milestones?: StoryMilestone[];
  groomName?: string;
  brideName?: string;
}

export function TraditionalPaperScrollStory({
  milestones,
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: TraditionalPaperScrollStoryProps) {
  // Default 4 milestones exactly as required by the prompt:
  // 2019: Gặp nhau
  // 2022: Yêu nhau
  // 2025: Cầu hôn
  // 2026: Thành hôn
  const defaultMilestones = [
    {
      id: 'm-2019',
      year: '2019',
      title: 'Gặp nhau',
      subtitle: 'Định Mệnh Tương Phùng',
      description:
        'Lần đầu chạm ánh mắt giữa một buổi chiều thu Hà Nội. Một nụ cười bẽn lẽn, một lời chào ngập ngừng đã mở ra khởi đầu cho câu chuyện tình yêu đẹp.',
      image:
        'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'm-2022',
      year: '2022',
      title: 'Yêu nhau',
      subtitle: 'Gắn Kết Trái Tim',
      description:
        'Sau những tháng ngày cùng sẻ chia buồn vui và lắng nghe nhau, chúng mình chính thức nắm tay nhau bước vào chặng đường tình yêu sâu sắc, gắn bó vẹn toàn.',
      image:
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'm-2025',
      year: '2025',
      title: 'Cầu hôn',
      subtitle: 'Lời Ước Trọn Đời',
      description:
        'Dưới ánh hoàng hôn rực rỡ và tiếng sóng vỗ dịu êm, chiếc nhẫn đính ước được trao cùng lời đồng ý nghẹn ngào: "Em đồng ý cùng anh đi qua mọi thăng trầm cuộc đời."',
      image:
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'm-2026',
      year: '2026',
      title: 'Thành hôn',
      subtitle: 'Bách Niên Giai Lão',
      description:
        'Ngày lành tháng tốt, trước sự chứng kiến và chúc phúc của hai bên gia đình cùng bạn bè thân hữu, chúng mình chính thức nên duyên vợ chồng, trọn đời son sắt.',
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // If milestones is empty or undefined, hide the story section completely
  if (!milestones || milestones.length === 0) {
    return null;
  }

  // Render actual user milestones
  const items = React.useMemo(() => {
    return milestones.map((m, idx) => ({
      id: m.id || `m-${idx}`,
      year: m.year || (2019 + idx * 2).toString(),
      title: m.title || 'Khoảnh Khắc Kỷ Niệm',
      subtitle: m.dateStr || 'Kỷ Niệm Yêu Thương',
      description: m.description || '',
      image: m.image || defaultMilestones[idx % defaultMilestones.length].image,
    }));
  }, [milestones]);

  return (
    <section id="story" className="relative py-20 sm:py-24 bg-[#FAF6EE] text-[#3D1A1E] overflow-hidden">
      {/* Background Dong Son Watermarks */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
        <DongSonDrumPattern className="w-[700px] h-[700px] text-[#BA1E28]" opacity={1} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BA1E28]/10 border border-[#BA1E28]/25 text-[#BA1E28] text-xs font-semibold uppercase tracking-widest">
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28]" />
            <span>Chuyện Tình Yêu • Duyên Khởi</span>
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28] scale-x-[-1]" />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B1119] tracking-wide">
            Hành Trình Gắn Kết
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#735154] max-w-md mx-auto leading-relaxed">
            Từ ánh mắt đầu tiên đến lời hẹn ước trọn đời. Từng cột mốc là một trang ký ức son sắt được khắc ghi.
          </p>
        </div>

        {/* Traditional Silk/Paper Scroll Container (Cuộn giấy thư pháp) */}
        <div className="relative mx-auto bg-[#FFFDF9] rounded-2xl shadow-[0_20px_50px_rgba(186,30,40,0.08)] border-2 border-[#D4AF37]/50 p-5 sm:p-10">
          {/* Top Scroll Rod (Trục cuốn gấm lụa trên) */}
          <div className="relative -top-8 -mx-6 sm:-mx-12 h-7 bg-gradient-to-r from-[#690B12] via-[#BA1E28] to-[#690B12] rounded-full shadow-lg border border-[#D4AF37] flex items-center justify-between px-4 sm:px-6">
            <div className="w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white shadow-xs" />
            <div className="flex items-center gap-2 text-[#FBEED1] text-[11px] font-serif-title uppercase tracking-[0.3em]">
              <SongHyGlyph className="w-3.5 h-3.5 text-[#FBEED1]" />
              <span>Cuộn Thư Hỷ Sự</span>
              <SongHyGlyph className="w-3.5 h-3.5 text-[#FBEED1]" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white shadow-xs" />
          </div>

          {/* Inset Gold Frame Corners */}
          <PaperFrameCorner position="top-left" className="top-2 left-2 w-7 h-7 text-[#D4AF37]" />
          <PaperFrameCorner position="top-right" className="top-2 right-2 w-7 h-7 text-[#D4AF37]" />
          <PaperFrameCorner position="bottom-left" className="bottom-2 left-2 w-7 h-7 text-[#D4AF37]" />
          <PaperFrameCorner position="bottom-right" className="bottom-2 right-2 w-7 h-7 text-[#D4AF37]" />

          {/* Timeline Center Container */}
          <div className="relative pt-6 pb-8">
            {/* 1. Animation: Timeline line được "vẽ" từ trên xuống */}
            <div className="absolute left-6 md:left-1/2 top-10 bottom-10 w-0.5 md:-translate-x-1/2 bg-[#EADCC5] overflow-hidden">
              <motion.div
                initial={{ height: '0%' }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full bg-gradient-to-b from-[#BA1E28] via-[#D4AF37] to-[#8B1119]"
              />
            </div>

            {/* Milestones List */}
            <div className="space-y-12 sm:space-y-16">
              {items.map((m, idx) => {
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={m.id}
                    className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-10 ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* 2. Animation: Node xuất hiện bằng scale 0 -> 1 */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{
                          type: 'spring',
                          stiffness: 240,
                          damping: 18,
                          delay: idx * 0.15,
                        }}
                        className="relative group cursor-default"
                      >
                        {/* Triện son đỏ viền vàng hoàng gia */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#BA1E28] to-[#7F0E17] border-2 border-[#D4AF37] text-white flex flex-col items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <span className="font-serif-title text-[11px] sm:text-xs font-bold tracking-tight text-[#FFD700]">
                            {m.year}
                          </span>
                          <SongHyGlyph className="w-3.5 h-3.5 text-white/90" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Milestone Content Card */}
                    <div className="w-full pl-16 md:pl-0 md:w-1/2">
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.7, delay: idx * 0.15 }}
                        className={`bg-[#FAF5EA]/80 backdrop-blur-xs rounded-2xl p-5 sm:p-6 border border-[#D4AF37]/35 shadow-xs hover:shadow-md transition-all ${
                          isEven ? 'md:text-left' : 'md:text-right'
                        }`}
                      >
                        {/* Header: Year Badge & Title */}
                        <div
                          className={`flex items-center gap-2 mb-2 ${
                            isEven ? 'md:justify-start' : 'md:justify-end'
                          }`}
                        >
                          <span className="px-2.5 py-0.5 rounded-full bg-[#BA1E28] text-white text-[11px] font-bold tracking-wider font-serif-title">
                            {m.year}
                          </span>
                          <span className="font-serif-title text-lg sm:text-xl font-bold text-[#8B1119]">
                            {m.title}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#A66D29] font-medium tracking-wide uppercase mb-2">
                          {m.subtitle}
                        </p>

                        <p className="text-xs sm:text-sm text-[#5C3D40] leading-relaxed font-body">
                          {m.description}
                        </p>

                        {/* Optional Milestone Image with Paper Frame */}
                        {Boolean(m.image) && (
                          <div className="mt-4 overflow-hidden rounded-xl border border-[#D4AF37]/40 shadow-xs relative">
                            <img
                              src={m.image}
                              alt={m.title}
                              className="w-full h-36 sm:h-44 object-cover hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 border border-white/40 pointer-events-none" />
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Empty spacer for the other column in desktop */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Scroll Rod (Trục cuốn gấm lụa dưới) */}
          <div className="relative -bottom-8 -mx-6 sm:-mx-12 h-7 bg-gradient-to-r from-[#690B12] via-[#BA1E28] to-[#690B12] rounded-full shadow-lg border border-[#D4AF37] flex items-center justify-between px-4 sm:px-6">
            <div className="w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white shadow-xs" />
            <div className="flex items-center gap-2 text-[#FBEED1] text-[11px] font-serif-title uppercase tracking-[0.3em]">
              <SongHyGlyph className="w-3.5 h-3.5 text-[#FBEED1]" />
              <span>Bách Niên Giai Lão</span>
              <SongHyGlyph className="w-3.5 h-3.5 text-[#FBEED1]" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white shadow-xs" />
          </div>
        </div>
      </div>
    </section>
  );
}
