import React from 'react';
import { motion } from 'motion/react';
import { StoryMilestone } from '../../../../types';
import { AirplaneRoutePath } from './PassportOrnaments';
import { Plane, Calendar, MapPin, Heart, Sparkles } from 'lucide-react';

interface PassportJourneyTimelineProps {
  stories?: StoryMilestone[];
  groomName?: string;
  brideName?: string;
}

export function PassportJourneyTimeline({
  stories,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: PassportJourneyTimelineProps) {
  // Default milestones if stories is empty or has fewer items
  const milestones: StoryMilestone[] =
    stories && stories.length > 0
      ? stories
      : [
          {
            id: 'm1',
            year: '2019',
            dateStr: '15/05/2019',
            title: 'Chuyến Bay Gặp Gỡ (First Meet)',
            description: 'Lần đầu tiên ánh mắt chạm nhau tại một quán cafe nhỏ giữa lòng thành phố, đánh dấu điểm xuất phát của hành trình.',
            image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85',
          },
          {
            id: 'm2',
            year: '2021',
            dateStr: '20/10/2021',
            title: 'Hành Trình Gắn Kết (First Date)',
            description: 'Những chuyến đi cùng nhau, những sẻ chia và thấu hiểu đã biến hai người xa lạ thành mảnh ghép không thể thiếu.',
            image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=85',
          },
          {
            id: 'm3',
            year: '2024',
            dateStr: '14/02/2024',
            title: 'Lời Hứa Ngàn Đời (The Proposal)',
            description: 'Dưới hoàng hôn biển lộng gió, anh trao em chiếc nhẫn đính hôn cùng câu hỏi quan trọng nhất cuộc đời: "Will you marry me?".',
            image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=85',
          },
          {
            id: 'm4',
            year: '2026',
            dateStr: '20/12/2026',
            title: 'Đích Đến Vĩnh Cửu (The Wedding)',
            description: 'Ngày chúng ta chính thức viết tiếp chương mới của cuộc đời, nắm chặt tay nhau đi đến tận cùng thời gian.',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85',
          },
        ];

  return (
    <section id="story" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#651F2A]/10 border border-[#651F2A]/25 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Plane className="w-3.5 h-3.5 text-[#B99552]" />
            <span>FLIGHT ROUTE • ITINERARY</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            OUR JOURNEY
          </h2>

          <p className="font-serif-title italic text-base sm:text-lg text-[#172A3A]">
            Từng chặng đường bay chở che yêu thương của {groomName} &amp; {brideName}
          </p>

          <AirplaneRoutePath className="my-4" />
        </div>

        {/* Timeline Container with Center Flight Line */}
        <div className="relative pt-6">
          {/* Vertical Flight Route Line with continuous dashed border */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 border-l-2 border-dashed border-[#B99552]/70" />

          {/* Milestones List */}
          <div className="space-y-12 sm:space-y-16">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={item.id || idx}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Center Airplane Node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 w-11 h-11 rounded-full bg-[#651F2A] border-2 border-[#B99552] text-[#FCFAF5] flex items-center justify-center shadow-lg font-mono text-xs font-bold"
                  >
                    <Plane className="w-5 h-5 text-[#FCFAF5]" />
                  </motion.div>

                  {/* Content Card (Left or Right on desktop, offset on mobile) */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`ml-14 md:ml-0 md:w-1/2 ${
                      isEven ? 'md:text-left' : 'md:text-right'
                    }`}
                  >
                    <div className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-7 border border-[#B99552]/35 shadow-lg relative overflow-hidden group hover:border-[#B99552] transition-colors">
                      {/* Top Stamp Tag */}
                      <div
                        className={`flex items-center gap-2 mb-3 ${
                          isEven ? 'md:justify-start' : 'md:justify-end'
                        }`}
                      >
                        <span className="px-2.5 py-0.5 rounded-full bg-[#651F2A]/10 text-[#651F2A] font-mono text-xs font-bold">
                          {item.year}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {item.dateStr || item.year}
                        </span>
                      </div>

                      {/* Milestone Title */}
                      <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#172A3A] mb-2">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans text-xs sm:text-sm text-[#41372F] leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Milestone Photo if provided */}
                      {item.image && (
                        <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#B99552]/30 shadow-inner">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white">
                            WAYPOINT {idx + 1}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Opposite Spacer Column for Desktop */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
