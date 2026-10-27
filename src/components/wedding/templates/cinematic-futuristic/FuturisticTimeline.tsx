import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Radio, Compass, Orbit, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import { WeddingData, StoryMilestone } from '../../../../types';

interface FuturisticTimelineProps {
  data: WeddingData;
}

export function FuturisticTimeline({ data }: FuturisticTimelineProps) {
  const defaultMilestones: StoryMilestone[] = [
    {
      id: 'm-1',
      year: '2019',
      dateStr: '15/09/2019',
      title: 'Giao Thoa Sóng • Khởi Đầu Định Mệnh',
      description:
        'Lần đầu tiên hai quỹ đạo giao thoa tại quán cafe quen góc phố Sài Gòn. Một ánh mắt chạm nhau mở ra tần số rung động đồng điệu giữa hàng tỷ con người.',
      image:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'm-2',
      year: '2022',
      dateStr: '14/02/2022',
      title: 'Đồng Pha Lượng Tử • Khắc Sâu Tình Yêu',
      description:
        'Vượt qua những khoảng cách và thử thách, tình yêu được thử lửa và ngày càng bền chặt. Hai tâm hồn hòa vào cùng một nhịp đập, hứa hẹn sẽ luôn nắm chặt tay nhau.',
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'm-3',
      year: '2025',
      dateStr: '24/12/2025',
      title: 'Khóa Quỹ Đạo • Lời Cầu Hôn Dưới Ánh Sao',
      description:
        'Dưới bầu trời đêm ngập tràn ánh sao lấp lánh, chiếc nhẫn định mệnh xuất hiện cùng câu nói: "Em sẽ cùng anh đi qua mọi không-thời gian chứ?". Nụ cười và cái gật đầu hạnh phúc.',
      image:
        'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'm-4',
      year: '2026',
      dateStr: data.weddingDate || '20/12/2026',
      title: 'Hợp Nhất Không Gian • Lễ Thành Hôn Vĩnh Cửu',
      description:
        'Thời khắc trọng đại nhất đã điểm. Trước sự chứng kiến và chúc phúc của hai bên gia đình và bạn bè, chúng mình chính thức viết tiếp chương mới rực rỡ nhất của cuộc đời.',
      image:
        data.coverImage ||
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const milestones =
    data.stories && data.stories.length > 0 ? data.stories : defaultMilestones;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeMilestone = milestones[activeIndex] || milestones[0];

  return (
    <section
      id="story-chronicles"
      className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto text-neutral-200 overflow-hidden font-body"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#A855F7] text-xs font-futuristic tracking-widest shadow-neon-purple">
          <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
          <span>HÀNH TRÌNH TÌNH YÊU LƯỢNG TỬ // CONTINUUM</span>
        </div>

        <h2 className="font-futuristic text-3xl sm:text-5xl font-extrabold tracking-wide text-white">
          Dòng Thời Gian Đa Chiều
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          [Chạm vào từng trạm không gian để du hành ngược dòng ký ức]
        </p>
      </div>

      {/* Interactive Orbit Milestone Selector Bar */}
      <div className="relative mb-12">
        {/* Glowing track line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#00F0FF]/30 via-[#A855F7]/50 to-[#FF2E93]/40 z-0" />

        <div className="relative z-10 flex items-center justify-between gap-2 overflow-x-auto pb-4 no-scrollbar">
          {milestones.map((m, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={m.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex flex-col items-center gap-2 px-3 sm:px-5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#0D152D] border-2 border-[#00F0FF] shadow-neon-cyan scale-105'
                    : 'bg-[#060814]/80 border border-neutral-800 hover:border-neutral-600'
                }`}
              >
                {/* Ping dot when selected */}
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    isSelected
                      ? 'bg-[#00F0FF] shadow-neon-cyan ring-4 ring-[#00F0FF]/20'
                      : 'bg-neutral-600'
                  }`}
                />
                <span
                  className={`font-futuristic text-xs sm:text-sm font-bold tracking-wider ${
                    isSelected ? 'text-[#00F0FF]' : 'text-neutral-400'
                  }`}
                >
                  {m.year || `TRẠM 0${idx + 1}`}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {m.dateStr || `P-0${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Milestone Holographic Showcase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMilestone.id || activeIndex}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="relative bg-[#090E26]/90 border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-neon-cyan grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          {/* Cyber Decorative HUD corners */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00F0FF]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00F0FF]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#A855F7]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#A855F7]" />

          {/* Left Column: Hologram Photo */}
          <div className="md:col-span-6 relative group">
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#00F0FF]/60 shadow-[0_0_30px_rgba(0,240,255,0.25)] aspect-4/3">
              <img
                src={activeMilestone.image}
                alt={activeMilestone.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 cyber-scanline-overlay opacity-30 pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#050711] via-transparent to-transparent p-4 flex items-center justify-between text-xs font-mono text-[#00F0FF]">
                <span>SECTOR: 2026-COUPLE</span>
                <span>STATUS: ARCHIVED_ETERNAL</span>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Sci-Fi Telemetry */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-futuristic text-2xl sm:text-3xl font-black text-[#00F0FF]">
                {activeMilestone.year}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5D061]" />
              <span className="font-mono text-xs text-[#F5D061] tracking-wider uppercase">
                {activeMilestone.dateStr}
              </span>
            </div>

            <h3 className="font-futuristic text-xl sm:text-2xl font-bold text-white leading-snug">
              {activeMilestone.title}
            </h3>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-body">
              {activeMilestone.description}
            </p>

            {/* Cyber Telemetry Box */}
            <div className="pt-2 border-t border-[#00F0FF]/20 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#050711]/60 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block text-[10px]">TỌA ĐỘ KỶ NIỆM:</span>
                <span className="text-[#00F0FF] font-semibold">GIAO THOA LƯỢNG TỬ</span>
              </div>

              <div className="bg-[#050711]/60 p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block text-[10px]">TẦN SỐ TÌNH CẢM:</span>
                <span className="text-[#FF2E93] font-semibold">100% CÙNG PHA (SYNC)</span>
              </div>
            </div>

            {/* Next / Previous Milestone controls */}
            <div className="pt-2 flex items-center gap-3">
              <button
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1 text-xs font-futuristic px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Trạm trước</span>
              </button>

              <button
                disabled={activeIndex === milestones.length - 1}
                onClick={() => setActiveIndex((prev) => Math.min(milestones.length - 1, prev + 1))}
                className="inline-flex items-center gap-1 text-xs font-futuristic px-3 py-1.5 rounded-full bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span>Trạm kế tiếp</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
