import React, { useState } from 'react';
import { StoryMilestone } from '../../../../types';
import { ChapterHeaderBadge, FolkCloud, FolkLotus, FolkRedSeal } from './FairytaleOrnaments';
import { Calendar, Clock, MapPin, Sparkles, ChevronRight } from 'lucide-react';

interface FairytaleBanyanStorySectionProps {
  story: StoryMilestone[];
}

export function FairytaleBanyanStorySection({ story }: FairytaleBanyanStorySectionProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<StoryMilestone | null>(null);

  // Default folk milestones if empty
  const displayMilestones: StoryMilestone[] =
    story && story.length > 0
      ? story
      : [
          {
            id: 'm1',
            year: '2021',
            dateStr: 'Mùa Thu 2021',
            title: 'Lần Đầu Gặp Gỡ Bên Giếng Nước Gốc Đa',
            description:
              'Một chiều thu gió mát, ánh mắt chạm nhau giữa dòng người tấp nập. Nụ cười trong trẻo như làn nước giếng ngọc làm xao xuyến trái tim người khách lạ.',
            image:
              'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
            location: 'Phố Cổ Hà Nội',
          },
          {
            id: 'm2',
            year: '2023',
            dateStr: 'Hạ Tròn 2023',
            title: 'Hò Hẹn Trăng Thanh Dưới Tán Đa Râm Mát',
            description:
              'Những chuyến đi xa cùng nhau, qua những cánh đồng lúa chín vàng ươm và bến sông quê. Từng mẩu chuyện nhỏ góp lại thành lời thề son sắt.',
            image:
              'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80',
            location: 'Đồng Lúa Ninh Bình',
          },
          {
            id: 'm3',
            year: '2025',
            dateStr: 'Xuân Đầu Năm 2025',
            title: 'Lời Hẹn Ước Trăm Năm - Về Chung Một Nhà',
            description:
              'Chàng quỳ gối trao chiếc nhẫn ước hẹn dưới bầu trời rực rỡ ngàn sao: "Cùng anh viết tiếp câu chuyện cổ tích bình yên suốt đời này nhé!". Nàng khẽ gật đầu trong giọt nước mắt hạnh phúc.',
            image:
              'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
            location: 'Sông Hương Xứ Huế',
          },
        ];

  return (
    <section id="banyan-story" className="relative py-24 px-4 overflow-hidden bg-[#F5EFE3]">
      {/* Decorative Traditional Banyan Tree Silhouette Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl pointer-events-none opacity-25">
        <svg viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Stylized Modern Folk Banyan Canopy */}
          <ellipse cx="500" cy="120" rx="360" ry="110" fill="#2D6A4F" />
          <ellipse cx="320" cy="140" rx="200" ry="80" fill="#1B4332" />
          <ellipse cx="680" cy="140" rx="200" ry="80" fill="#1B4332" />
          {/* Main Mighty Trunk */}
          <path d="M460 160 Q450 320 400 400 L600 400 Q550 320 540 160 Z" fill="#8B4513" />
          {/* Hanging aerial roots (rễ đa buông) */}
          <path d="M340 170 Q350 280 330 380" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" />
          <path d="M660 170 Q650 280 670 380" stroke="#8B4513" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Chapter 2 Badge */}
        <ChapterHeaderBadge
          chapterNum="Chương II • Dưới Bóng Cây Đa"
          title="Lời Hẹn Ước Trăm Năm"
          subtext="Cây đa ngàn năm rủ bóng chở che, ghi dấu bao mùa mưa nắng đưa lối đôi tim tìm về"
        />

        {/* Comic Story Chronicles (Dải tranh truyện các mốc thời gian) */}
        <div className="relative mt-14 space-y-12 sm:space-y-16">
          {/* Central Trunk Timeline Guide Line */}
          <div className="absolute top-4 bottom-4 left-4 sm:left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-[#2D6A4F] via-[#BA262B] to-[#E5A93C] rounded-full hidden sm:block" />

          {displayMilestones.map((item, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={item.id || idx}
                className={`relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10 ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Center Node Node (Quả chuông hoặc hoa sen) */}
                <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FFFDF9] border-2 border-[#BA262B] shadow-md items-center justify-center z-20">
                  <span className="font-serif-title text-xs font-bold text-[#BA262B]">
                    {idx + 1}
                  </span>
                </div>

                {/* 1. Photo Panel (Khung tranh minh họa mốc kỷ niệm) */}
                <div className="w-full sm:w-1/2 group">
                  <div className="relative bg-[#FFFDF9] p-3 sm:p-4 rounded-2xl border-2 border-[#D9CBB7] shadow-lg hover:border-[#BA262B] transition-all duration-300">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-inner">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Year pill on photo */}
                      <div className="absolute top-3 left-3 bg-[#BA262B] text-[#FAF5EB] px-3 py-1 rounded-full text-xs font-serif font-bold shadow-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.dateStr || item.year}</span>
                      </div>

                      {item.location && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-0.5 rounded text-[11px] font-sans flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#E5A93C]" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Comic Narrative Text Card (Khung dẫn chuyện cổ tích) */}
                <div className="w-full sm:w-1/2">
                  <div className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#E6D8C2] shadow-md relative overflow-hidden">
                    {/* Top stamp */}
                    <div className="flex items-center justify-between border-b border-[#E6D8C2] pb-2.5 mb-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#853023] uppercase font-bold">
                        HỒI THỨ {idx + 1} • {item.year}
                      </span>
                      <FolkLotus className="w-4 h-4 text-[#BA262B]" />
                    </div>

                    <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#351E17] leading-snug mb-2">
                      {item.title}
                    </h3>

                    <p className="font-poetry text-xs sm:text-sm text-[#543026] leading-relaxed italic">
                      "{item.description}"
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#E6D8C2] flex items-center justify-between text-xs text-[#7A4C3E]">
                      <span className="font-serif italic">Khắc cốt ghi tâm</span>
                      <button
                        onClick={() => setSelectedMilestone(item)}
                        className="inline-flex items-center gap-1 text-[#BA262B] hover:text-[#853023] font-bold cursor-pointer"
                      >
                        <span>Chi tiết</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal if clicked */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EB] rounded-2xl max-w-md w-full p-6 border-2 border-[#E5A93C] shadow-2xl relative animate-fadeIn">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 shadow">
              <img
                src={selectedMilestone.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                alt={selectedMilestone.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-[#BA262B] text-xs font-serif font-bold uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedMilestone.dateStr || selectedMilestone.year}</span>
            </div>
            <h3 className="font-serif-title text-xl font-bold text-[#351E17] mb-2">
              {selectedMilestone.title}
            </h3>
            <p className="font-poetry text-sm text-[#543026] italic leading-relaxed mb-6">
              "{selectedMilestone.description}"
            </p>
            <button
              onClick={() => setSelectedMilestone(null)}
              className="w-full py-2.5 rounded-full bg-[#BA262B] text-[#FAF5EB] font-serif font-bold text-sm hover:bg-[#853023] transition-colors cursor-pointer"
            >
              Đóng Cửa Sổ Kỷ Niệm
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
