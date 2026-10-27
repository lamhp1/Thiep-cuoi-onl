import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, ChevronRight, MessageSquareHeart } from 'lucide-react';
import { StoryMilestone } from '../../../../types';
import { playPointChime } from './loveGameSounds';

interface LoveGameStorySectionProps {
  milestones?: StoryMilestone[];
  isCompleted: boolean;
  onCompleteQuest: () => void;
}

export function LoveGameStorySection({
  milestones = [],
  isCompleted,
  onCompleteQuest,
}: LoveGameStorySectionProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const defaultMilestones: StoryMilestone[] = [
    {
      id: 'm-1',
      year: '2020',
      dateStr: '15/04/2020',
      title: 'Lần Đầu Gặp Gỡ (Mission Start)',
      description: 'Chạm mắt nhau tại một quán cà phê quen thuộc vào một chiều mưa. Minh Anh đã chủ động mượn cớ hỏi về cuốn sách Mai đang đọc để bắt chuyện.',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      location: 'The Coffee House, TP. Huế',
    },
    {
      id: 'm-2',
      year: '2022',
      dateStr: '20/10/2022',
      title: 'Lời Tỏ Tình & Hẹn Hò (Level Up)',
      description: 'Dưới ánh hoàng hôn bên bờ sông Hương, Minh Anh lấy hết can đảm trao món quà nhỏ và lời tỏ tình ngọt ngào: "Làm bạn gái anh nhé!" — Mai mỉm cười gật đầu.',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
      location: 'Cầu Tràng Tiền, TP. Huế',
    },
    {
      id: 'm-3',
      year: '2025',
      dateStr: '14/02/2025',
      title: 'Lời Cầu Hôn "She Said Yes" (Boss Cleared)',
      description: 'Chuyến du lịch ngắm bình minh trên đỉnh núi, giữa biển mây bồng bềnh, chiếc nhẫn lấp lánh xuất hiện cùng lời hẹn ước đi cùng nhau suốt cuộc đời.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
      location: 'Đà Lạt sương mờ',
    },
    {
      id: 'm-4',
      year: '2026',
      dateStr: '20/12/2026',
      title: 'Hạnh Phúc Trọn Vẹn (Happy Ending)',
      description: 'Ngày chúng mình cùng nắm tay bước vào lễ đường, đánh dấu chương mới viên mãn nhất trong hành trình tình yêu.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      location: 'Lễ Thành Hôn',
    },
  ];

  const items = milestones && milestones.length > 0 ? milestones : defaultMilestones;
  const current = items[activeIdx] || items[0];

  const handleSelectMilestone = (idx: number) => {
    setActiveIdx(idx);
    playPointChime();
    if (!isCompleted) {
      onCompleteQuest();
    }
  };

  return (
    <section id="quest-story" className="relative py-24 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Section Header with Quest Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>QUEST 01 • CHUYỆN TÌNH YÊU</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Biên Niên Sử Tình Yêu
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            Nhấn vào từng mốc thời gian bên dưới để mở khóa những kỷ niệm đáng nhớ nhất của hai đứa mình!
          </p>

          {/* Quest completion badge */}
          <div className="pt-1">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ĐÃ HOÀN THÀNH CHẶNG 1 (+10 LOVE POINTS)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playPointChime();
                  onCompleteQuest();
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/35 border border-pink-500/40 text-pink-200 text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Chạm để hoàn thành nhiệm vụ (+10 PTS)
              </button>
            )}
          </div>
        </div>

        {/* Milestone Steps Bar (Gamified Stages) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-4xl mx-auto">
          {items.map((m, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={m.id || idx}
                type="button"
                onClick={() => handleSelectMilestone(idx)}
                className={`relative flex flex-col items-center p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-pink-500/25 to-purple-600/20 border-pink-400 text-white shadow-[0_5px_20px_rgba(255,107,139,0.25)] scale-[1.03]'
                    : 'bg-[#151227]/70 hover:bg-[#1C1833] border-white/10 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span className="text-[10px] font-mono tracking-widest text-pink-300/80 font-bold uppercase">
                  CHAPTER {idx + 1}
                </span>
                <span className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {m.year || m.dateStr}
                </span>
                <span className="text-[11px] text-neutral-300 font-medium truncate w-full text-center mt-1">
                  {m.title}
                </span>

                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-400 rotate-45" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Milestone Highlight Card */}
        {current && (
          <div className="relative bg-[#16132A]/85 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl max-w-3xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Image with photo card border */}
              <div className="relative group overflow-hidden rounded-2xl border-2 border-white/15 shadow-lg">
                <img
                  src={current.image || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'}
                  alt={current.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                  {current.dateStr || current.year}
                </div>
              </div>

              {/* Text info & story dialog */}
              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">
                    MỐC KỶ NIỆM #{activeIdx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {current.title}
                  </h3>
                  {current.location && (
                    <p className="text-xs text-amber-300/90 font-mono">
                      📍 {current.location}
                    </p>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {current.description}
                </p>

                {/* Gen Z Interactive Quote / Dialogue Box */}
                <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-200 text-xs flex items-start gap-2.5">
                  <MessageSquareHeart className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <span className="italic font-medium">
                    &ldquo;Khoảnh khắc này, tụi mình biết rằng đối phương chính là mảnh ghép định mệnh của đời mình.&rdquo;
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
