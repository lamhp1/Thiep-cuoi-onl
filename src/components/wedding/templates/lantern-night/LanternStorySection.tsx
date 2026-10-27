import React from 'react';
import { StoryMilestone } from '../../../../types';
import { SparklingStar, HoiAnDiamondLantern, HoiAnGlobeLantern } from './LanternNightOrnaments';
import { MapPin, Calendar, Heart } from 'lucide-react';

interface LanternStorySectionProps {
  milestones?: StoryMilestone[];
  scrollProgress: number;
}

export function LanternStorySection({ milestones = [], scrollProgress }: LanternStorySectionProps) {
  // Default romantic story if empty
  const defaultMilestones: StoryMilestone[] = [
    {
      id: 'story-1',
      year: '2019',
      dateStr: '15/10/2019',
      title: 'Ánh Mắt Ban Đầu',
      description: 'Lần đầu gặp gỡ tại một quán trà nhỏ bên dòng sông Hương. Ánh mắt chạm nhau dịu dàng như vệt sáng đèn lồng đầu tiên thắp lên trong đêm.',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      location: 'Huế Mộng Mơ',
    },
    {
      id: 'story-2',
      year: '2022',
      dateStr: '14/02/2022',
      title: 'Phố Cũ Lên Đèn',
      description: 'Cùng nhau dạo bước dưới hàng ngàn ngọn đèn lồng lung linh ở phố cổ. Chiếc đèn hoa đăng gửi gắm ước nguyện trăm năm hòa chung một lối.',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      location: 'Phố Cổ Hội An',
    },
    {
      id: 'story-3',
      year: '2025',
      dateStr: '20/10/2025',
      title: 'Lời Hẹn Ước Hoàng Hôn',
      description: 'Khi mặt trời vừa buông ráng đỏ trên mặt biển và những ngọn đèn dạ yến bắt đầu rực sáng, chiếc nhẫn cầu hôn đã tìm thấy người bạn đời đích thực.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      location: 'Bán Đảo Sơn Trà',
    },
    {
      id: 'story-4',
      year: '2026',
      dateStr: '20/12/2026',
      title: 'Dạ Tiệc Trăm Năm',
      description: 'Ngày chúng mình chính thức kết tóc se tơ. Dưới muôn ánh đèn lồng chứng giám, lời nguyện thề bách niên giai lão vang vọng mãi trong đêm.',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      location: 'Dạ Yến Hoàng Gia',
    },
  ];

  const items = milestones && milestones.length > 0 ? milestones : defaultMilestones;

  return (
    <section id="story" className="relative py-24 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-serif uppercase tracking-widest">
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Biên Niên Sử Tình Yêu</span>
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-100">
          Chuyện Tình Dưới Ánh Đèn Lồng
        </h2>
        <p className="font-serif italic text-sm text-neutral-400 max-w-md mx-auto">
          Mỗi cột mốc đi qua là một ngọn đèn được thắp sáng, rọi đường cho tình yêu cập bến bờ hạnh phúc.
        </p>
      </div>

      {/* Central Illuminated Thread Line */}
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-linear-to-b from-amber-400/20 via-amber-400 to-amber-400/20 hidden md:block" />

        {/* Story Nodes */}
        <div className="space-y-12 sm:space-y-16">
          {items.map((milestone, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={milestone.id || idx}
                className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-10 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Central Lantern Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-linear-to-b from-amber-400 to-amber-600 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                    <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-amber-300 font-serif text-xs font-bold">
                      {idx + 1}
                    </div>
                  </div>
                </div>

                {/* Photo Side */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative rounded-2xl overflow-hidden p-1 bg-linear-to-b from-amber-400/40 via-yellow-600/20 to-neutral-900 shadow-2xl group max-w-sm w-full">
                    <div className="aspect-4/3 rounded-xl overflow-hidden relative">
                      <img
                        src={milestone.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                        alt={milestone.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Floating Year Tag */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-neutral-950/80 border border-amber-500/40 text-amber-300 font-serif text-xs font-bold shadow-md">
                        {milestone.year}
                      </div>

                      {milestone.location && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-amber-200 text-xs font-serif">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{milestone.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className={`w-full md:w-1/2 text-center ${
                    isEven ? 'md:text-left' : 'md:text-right'
                  } space-y-2`}
                >
                  <div className="inline-block text-xs font-serif tracking-widest text-amber-400 uppercase font-semibold">
                    {milestone.dateStr}
                  </div>
                  <h3 className="font-serif-title text-2xl font-bold text-amber-100">
                    {milestone.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-neutral-300/80 leading-relaxed max-w-md mx-auto md:mx-0">
                    {milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
