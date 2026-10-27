import React from 'react';
import { StoryMilestone } from '../../../../types';
import { Sparkles, Moon, Heart } from 'lucide-react';
import { ArtisticBloomingLotus } from './MoonLotusOrnaments';

interface MoonLotusStorySectionProps {
  milestones?: StoryMilestone[];
  scrollProgress: number;
}

export function MoonLotusStorySection({ milestones, scrollProgress }: MoonLotusStorySectionProps) {
  // Default romantic milestones if not provided
  const items: StoryMilestone[] = milestones && milestones.length > 0 ? milestones : [
    {
      id: 'story-1',
      year: '2019',
      dateStr: '15.04.2019',
      title: 'Trăng Non • Lần Đầu Gặp Gỡ',
      description: 'Như vầng trăng non vừa hé rạng bên dòng sông Hương, một ánh nhìn tình cờ đã gieo mầm duyên lành trong lòng hai người.',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-2',
      year: '2022',
      dateStr: '20.10.2022',
      title: 'Bán Nguyệt • Tình Yêu Thăng Hoa',
      description: 'Những buổi chiều hoàng hôn cùng dạo bước, cùng sẻ chia ước mơ hoài bão. Ánh trăng soi bóng hai người cùng chung một nhịp đập.',
      image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-3',
      year: '2025',
      dateStr: '14.02.2025',
      title: 'Trăng Khuyết • Lời Cầu Hôn Thiêng Liêng',
      description: 'Dưới trời đêm đầy sao lấp lánh và gió ngàn thì thầm, anh quỳ gối trao chiếc nhẫn ước hẹn. Nụ cười rạng rỡ và cái gật đầu trong nước mắt hạnh phúc.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'story-4',
      year: '2026',
      dateStr: '20.12.2026',
      title: 'Trăng Tròn Viên Mãn • Ngày Chung Đôi',
      description: 'Vầng trăng tròn đầy viên mãn nhất soi sáng thánh đường. Chúng mình chính thức về chung một nhà, nắm tay đi trọn cuộc đời.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Moon phase symbols for each milestone
  const moonPhases = ['🌒', '🌓', '🌔', '🌕'];

  return (
    <section id="story" className="relative py-20 px-4 sm:px-6 z-20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-widest">
            <Moon className="w-3.5 h-3.5 text-[#EBD494]" />
            <span>Biên Niên Sử Tuần Trăng</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#FFFDF7]">
            Hành Trình Yêu Dưới Ánh Trăng
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#F4E4BA]/80">
            “Từ mảnh trăng non e ấp đến ngày trăng tròn viên mãn trăm năm.”
          </p>
        </div>

        {/* Timeline Line & Items */}
        <div className="relative border-l-2 border-[#EBD494]/30 ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-10">
          {items.map((item, idx) => {
            const bloomProgress = Math.min(1, 0.4 + (idx + 1) * 0.2);

            return (
              <div key={item.id || idx} className="relative group">
                {/* Moon Phase Node Badge on the line */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#120E28] border-2 border-[#EBD494] flex items-center justify-center text-sm sm:text-base shadow-[0_0_15px_rgba(235,212,148,0.5)] group-hover:scale-110 transition-transform">
                  <span>{moonPhases[idx % moonPhases.length]}</span>
                </div>

                {/* Left Year Badge (visible on desktop) */}
                <div className="hidden sm:block absolute -left-36 top-2 text-right w-24">
                  <span className="font-serif text-lg font-bold text-[#EBD494]">
                    {item.year}
                  </span>
                  <span className="block text-[10px] font-serif text-[#F4E4BA]/60 tracking-wider">
                    {item.dateStr}
                  </span>
                </div>

                {/* Content Card */}
                <div className="rounded-3xl p-6 bg-[#0E122A]/85 border border-[#EBD494]/30 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-[#EBD494]/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="sm:hidden font-serif text-sm font-bold text-[#EBD494]">
                      {item.year} • {item.dateStr}
                    </span>
                    <span className="text-xs font-serif text-[#F4E4BA]/70 uppercase tracking-widest">
                      Chương {idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif-title font-bold text-[#FFFDF7]">
                    {item.title}
                  </h3>

                  <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Photo & Blooming Lotus ornament */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                    {item.image && (
                      <div className="w-full sm:w-64 h-44 rounded-2xl overflow-hidden border border-[#EBD494]/40 shadow-md">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="hidden sm:flex flex-col items-center justify-center p-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <ArtisticBloomingLotus size={90} bloomProgress={bloomProgress} />
                      <span className="text-[10px] font-serif text-[#EBD494]/70 mt-1 italic">
                        Sen nở phước lành
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
