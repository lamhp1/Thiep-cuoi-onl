import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoryMilestone } from '../../../../types';
import { CompassRose, TravelPlaneIcon } from './LoveMapOrnaments';
import { MapPin, Calendar, Heart, ChevronLeft, ChevronRight, Navigation, Sparkles } from 'lucide-react';

interface LoveMapInteractiveMapProps {
  stories: StoryMilestone[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onViewTimeline?: () => void;
}

// Fallback locations if not provided in story
const FALLBACK_LOCATIONS = [
  'Đà Nẵng • Bờ Biển Mỹ Khê',
  'Huế • Cầu Trường Tiền Lộng Gió',
  'Đà Lạt • Thung Lũng Ngàn Hoa',
  'Phú Quốc • Hoàng Hôn Biển Đảo',
  'Hà Nội • Phố Cổ Thu Sang',
  'Hội An • Phố Đèn Lồng Hoài Cổ',
  'TP. Hồ Chí Minh • Phố Đi Bộ Ánh Đèn',
  'Đỉnh Mây Sapa • Lời Ước Nguyện',
];

export function LoveMapInteractiveMap({
  stories,
  activeIndex,
  onSelectIndex,
  onViewTimeline,
}: LoveMapInteractiveMapProps) {
  // Ensure we have at least 1 milestone to display gracefully
  const safeStories = useMemo(() => {
    if (!stories || stories.length === 0) {
      return [
        {
          id: 'def-1',
          year: '2020',
          dateStr: '15.05.2020',
          title: 'Ngày Đầu Gặp Gỡ',
          description: 'Một khoảnh khắc tình cờ mở ra câu chuyện ngọt ngào nhất của hai đứa mình.',
          image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
          location: 'Huế • Dòng Sông Hương',
        },
        {
          id: 'def-2',
          year: '2026',
          dateStr: '20.12.2026',
          title: 'Ngày Chung Đôi',
          description: 'Hôn lễ thiêng liêng trước sự chứng kiến và chúc phúc của gia đình và bạn bè.',
          image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
          location: 'Trung Tâm Yến Tiệc Hoàng Gia',
        },
      ];
    }
    return stories;
  }, [stories]);

  const activeStory = safeStories[activeIndex] || safeStories[0];
  const count = safeStories.length;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute calculated coordinates along an aesthetic winding S-curve across a 900x520 map canvas
  const waypoints = useMemo(() => {
    const pts: { x: number; y: number; story: StoryMilestone; location: string }[] = [];
    const width = 840;
    const height = 460;
    const marginX = 70;
    const marginY = 60;

    for (let i = 0; i < count; i++) {
      const st = safeStories[i];
      const progress = count === 1 ? 0.5 : i / (count - 1);
      
      // S-curve distribution across the map
      const x = marginX + progress * (width - 2 * marginX);
      // Gentle sine oscillation: alternating heights
      const yOffset = Math.sin(progress * Math.PI * 2.5) * (height * 0.28);
      const y = height / 2 + yOffset;

      const loc = st.location || FALLBACK_LOCATIONS[i % FALLBACK_LOCATIONS.length];
      pts.push({ x: Math.round(x), y: Math.round(y), story: st, location: loc });
    }
    return pts;
  }, [safeStories, count]);

  // Generate SVG cubic bezier path string connecting all waypoints
  const pathData = useMemo(() => {
    if (waypoints.length === 0) return '';
    if (waypoints.length === 1) return `M ${waypoints[0].x} ${waypoints[0].y}`;

    let d = `M ${waypoints[0].x} ${waypoints[0].y}`;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const curr = waypoints[i];
      const next = waypoints[i + 1];
      const midX = (curr.x + next.x) / 2;
      d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [waypoints]);

  const activePoint = waypoints[activeIndex] || waypoints[0];

  const handlePrev = () => {
    onSelectIndex((activeIndex - 1 + count) % count);
  };

  const handleNext = () => {
    onSelectIndex((activeIndex + 1) % count);
  };

  return (
    <section
      id="love-map"
      className="relative py-16 lg:py-24 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      {/* Topographic Map Contours */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <path d="M0,150 Q400,60 800,220 T1200,180" fill="none" stroke="#B9985A" strokeWidth="1" strokeDasharray="5 5" />
        <path d="M0,350 Q300,280 700,420 T1200,360" fill="none" stroke="#722238" strokeWidth="0.8" strokeDasharray="8 4" />
        <path d="M0,600 Q500,480 900,640 T1200,580" fill="none" stroke="#53665A" strokeWidth="1" />
      </svg>

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#B9985A]/40 text-[#722238] shadow-xs text-[11px] tracking-[0.25em] uppercase font-bold">
            <Navigation className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>INTERACTIVE LOVE MAP</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#443B35]">
            BẢN ĐỒ HÀNH TRÌNH TÌNH YÊU
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/80 font-body leading-relaxed">
            Chạm vào từng trạm dừng trên bản đồ để khám phá những khoảnh khắc và kỷ niệm khó phai của hai chúng mình.
          </p>
        </div>

        {/* Desktop Split Layout: 65% Map + 35% Active Destination Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT: Illustrated Interactive Map Viewport (7 Cols on LG) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col bg-[#FFFDF9] rounded-3xl border border-[#B9985A]/40 shadow-xl overflow-hidden relative">
            {/* Map Top Bar */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-[#B9985A]/25 bg-[#FBF8F2] flex items-center justify-between text-xs text-[#443B35] select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#722238] animate-pulse" />
                <span className="font-semibold tracking-wider uppercase text-[11px] text-[#722238]">
                  EXPLORER MAP • TỌA ĐỘ KỶ NIỆM
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#B9985A] font-semibold">
                <span>TRẠM {activeIndex + 1} / {count}</span>
              </div>
            </div>

            {/* Interactive SVG Canvas Area */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[300px] sm:min-h-[420px] bg-[#FAF6EE] overflow-hidden p-2 flex items-center justify-center">
              {/* Compass Rose in Corner */}
              <div className="absolute top-4 right-4 pointer-events-none opacity-40">
                <CompassRose className="w-14 h-14 sm:w-20 sm:h-20" rotate={activeIndex * 25} />
              </div>

              {/* Decorative Scale Bar */}
              <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2 text-[9px] uppercase tracking-widest text-[#722238]/60 font-mono">
                <div className="w-12 h-1 border-b-2 border-l border-r border-[#722238]/50" />
                <span>HÀNH TRÌNH TÌNH YÊU</span>
              </div>

              {/* Map SVG with dynamic Pan/Zoom towards active point on desktop */}
              <svg
                id="interactive-svg-map"
                viewBox="0 0 840 460"
                className="w-full h-full select-none transition-transform duration-700 ease-out"
                style={{
                  // Subtle camera pan effect based on active point
                  transform: `scale(${1.02}) translate(${(420 - activePoint.x) * 0.08}px, ${(230 - activePoint.y) * 0.08}px)`,
                }}
              >
                {/* Background Illustrated Terrain contours */}
                <ellipse cx="220" cy="180" rx="140" ry="90" fill="#F0E8D7" opacity="0.6" />
                <ellipse cx="620" cy="300" rx="160" ry="100" fill="#F0E8D7" opacity="0.6" />
                <path
                  d="M 50,230 Q 250,150 450,280 T 800,200"
                  fill="none"
                  stroke="#B9985A"
                  strokeWidth="0.8"
                  opacity="0.35"
                />

                {/* Animated Connecting Route Path */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke="#B9985A"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />

                {/* Markers for each story milestone */}
                {waypoints.map((pt, idx) => {
                  const isActive = idx === activeIndex;
                  const isHovered = idx === hoveredIndex;
                  const isWeddingStop = idx === count - 1;

                  return (
                    <g
                      key={pt.story.id || idx}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => onSelectIndex(idx)}
                      className="cursor-pointer group"
                    >
                      {/* Transparent enlarged hit area for effortless hover & click */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="28"
                        fill="transparent"
                        className="cursor-pointer"
                      />

                      {/* Active Beacon Pulse Wave */}
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="26"
                          fill="none"
                          stroke="#722238"
                          strokeWidth="1.5"
                          opacity="0.4"
                          className="animate-ping"
                        />
                      )}

                      {/* Gold ring aura on active or hover */}
                      {(isActive || isHovered) && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isActive ? 20 : 16}
                          fill="#B9985A"
                          fillOpacity={isActive ? 0.25 : 0.15}
                          stroke="#B9985A"
                          strokeWidth="1.5"
                        />
                      )}

                      {/* Main Marker Circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 14 : isHovered ? 12 : 9}
                        fill={isActive || isHovered ? '#722238' : '#FFFDF9'}
                        stroke={isActive || isHovered ? '#B9985A' : '#53665A'}
                        strokeWidth={isActive || isHovered ? 2.5 : 2}
                        className="transition-all duration-300"
                        style={{
                          filter: isActive || isHovered ? 'drop-shadow(0 4px 8px rgba(114,34,56,0.35))' : 'none',
                        }}
                      />

                      {/* Marker Icon: Heart for Wedding / Proposal or Stop Number */}
                      {isWeddingStop ? (
                        <path
                          d={`M ${pt.x} ${pt.y - 4} C ${pt.x - 3} ${pt.y - 8} ${pt.x - 7} ${pt.y - 5} ${pt.x - 4} ${pt.y - 1} L ${pt.x} ${pt.y + 4} L ${pt.x + 4} ${pt.y - 1} C ${pt.x + 7} ${pt.y - 5} ${pt.x + 3} ${pt.y - 8} ${pt.x} ${pt.y - 4} Z`}
                          fill={isActive || isHovered ? '#FFFDF9' : '#722238'}
                          className="pointer-events-none"
                        />
                      ) : (
                        <text
                          x={pt.x}
                          y={pt.y + 3.5}
                          fontSize={isActive || isHovered ? '9' : '8'}
                          fontWeight="bold"
                          fill={isActive || isHovered ? '#FFFDF9' : '#443B35'}
                          textAnchor="middle"
                          fontFamily="sans-serif"
                          className="pointer-events-none select-none"
                        >
                          {idx + 1}
                        </text>
                      )}

                      {/* Floating Marker Label Tag */}
                      <g className="transition-all duration-300">
                        <rect
                          x={pt.x - 45}
                          y={pt.y - (idx % 2 === 0 ? 32 : -16)}
                          width="90"
                          height="18"
                          rx="9"
                          fill={isActive || isHovered ? '#722238' : '#FFFDF9'}
                          stroke="#B9985A"
                          strokeWidth="0.8"
                          strokeOpacity={isActive || isHovered ? 1 : 0.6}
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
                          }}
                        />
                        <text
                          x={pt.x}
                          y={pt.y - (idx % 2 === 0 ? 20 : -28)}
                          fontSize="8.5"
                          fontWeight={isActive || isHovered ? 'bold' : '600'}
                          fill={isActive || isHovered ? '#FFFDF9' : '#443B35'}
                          textAnchor="middle"
                          fontFamily="sans-serif"
                          className="pointer-events-none select-none"
                        >
                          {pt.story.year || `Trạm ${idx + 1}`}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Hover Preview Tooltip Card for Milestone */}
                {hoveredIndex !== null && waypoints[hoveredIndex] && (() => {
                  const hp = waypoints[hoveredIndex];
                  const story = hp.story;
                  const isTopHalf = hp.y <= 210;
                  const cardW = 210;
                  const cardH = story.image ? 175 : 85;
                  const popupX = Math.max(16, Math.min(840 - cardW - 16, hp.x - cardW / 2));
                  const popupY = isTopHalf ? hp.y + 26 : Math.max(12, hp.y - cardH - 24);

                  return (
                    <g className="pointer-events-none transition-all duration-200">
                      {/* Pointer triangle arrow */}
                      <polygon
                        points={
                          isTopHalf
                            ? `${hp.x},${hp.y + 16} ${hp.x - 8},${popupY} ${hp.x + 8},${popupY}`
                            : `${hp.x},${hp.y - 16} ${hp.x - 8},${popupY + cardH} ${hp.x + 8},${popupY + cardH}`
                        }
                        fill="#FFFDF9"
                        stroke="#B9985A"
                        strokeWidth="1.2"
                      />

                      <foreignObject
                        x={popupX}
                        y={popupY}
                        width={cardW}
                        height={cardH + 10}
                        className="overflow-visible"
                      >
                        <div
                          className="bg-[#FFFDF9] rounded-2xl p-2.5 border-2 border-[#B9985A] shadow-2xl flex flex-col gap-2 transition-all duration-200"
                          style={{
                            boxShadow: '0 12px 28px rgba(68, 59, 53, 0.28)',
                          }}
                        >
                          {story.image ? (
                            <div className="w-full h-24 rounded-xl overflow-hidden bg-[#F5EFE3] relative border border-[#B9985A]/30">
                              <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                              />
                              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#722238]/90 text-[#FFFDF9] text-[9px] font-bold tracking-wider uppercase">
                                {story.year || `Trạm ${hoveredIndex + 1}`}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-full bg-[#722238] text-[#FFFDF9] text-[9px] font-bold tracking-wider uppercase">
                                {story.year || `Trạm ${hoveredIndex + 1}`}
                              </span>
                              {story.dateStr && (
                                <span className="text-[10px] text-[#443B35]/70 font-medium">
                                  {story.dateStr}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="space-y-0.5 px-0.5">
                            <h4 className="font-serif-title text-xs font-bold text-[#443B35] leading-snug line-clamp-2">
                              {story.title}
                            </h4>
                            {(story.location || hp.location) && (
                              <p className="text-[10px] text-[#722238] font-medium truncate flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 text-[#B9985A] shrink-0" />
                                <span className="truncate">{story.location || hp.location}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Map Bottom Quick Navigation bar */}
            <div className="px-4 py-3 bg-[#FBF8F2] border-t border-[#B9985A]/25 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 sm:gap-2">
                {waypoints.map((pt, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectIndex(i)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      i === activeIndex || i === hoveredIndex
                        ? 'bg-[#722238] text-[#FFFDF9] shadow-xs'
                        : 'bg-[#FFFDF9] hover:bg-[#F5EFE3] text-[#443B35] border border-[#B9985A]/30'
                    }`}
                  >
                    {pt.story.year || `Trạm ${i + 1}`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#F5EFE3] border border-[#B9985A]/40 text-[#443B35] transition-colors cursor-pointer"
                  title="Trạm trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#F5EFE3] border border-[#B9985A]/40 text-[#443B35] transition-colors cursor-pointer"
                  title="Trạm kế tiếp"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Active Destination Story Card (5 Cols on LG) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory.id || activeIndex}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.45 }}
                className="flex-grow flex flex-col justify-between bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#B9985A]/40 shadow-xl relative overflow-hidden"
              >
                {/* Stamp & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE3] border border-[#B9985A]/40 text-[#722238] font-bold text-[10px] tracking-widest uppercase">
                    <Sparkles className="w-3 h-3 text-[#B9985A]" />
                    <span>DESTINATION {activeIndex + 1}</span>
                  </span>

                  <span className="font-serif font-bold text-lg text-[#B9985A]">
                    {activeStory.year}
                  </span>
                </div>

                {/* Photo in Postcard / Travel Photo Mat */}
                {activeStory.image && (
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#B9985A]/30 shadow-md mb-4 group bg-[#F5EFE3]">
                    <img
                      src={activeStory.image}
                      alt={activeStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-2.5 left-3 text-white flex items-center gap-1 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#B9985A]" />
                      <span className="font-medium truncate max-w-[240px]">
                        {activePoint.location}
                      </span>
                    </div>
                  </div>
                )}

                {/* Story Text Content */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-[11px] text-[#722238] font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#B9985A]" />
                    <span>{activeStory.dateStr || activeStory.year}</span>
                  </div>

                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#443B35]">
                    {activeStory.title}
                  </h3>

                  <div className="w-10 h-[1.5px] bg-[#B9985A]/60 my-2" />

                  <p className="text-xs sm:text-sm text-[#443B35]/80 font-body leading-relaxed">
                    {activeStory.description}
                  </p>
                </div>

                {/* Footer Controls of the card */}
                <div className="pt-4 border-t border-[#B9985A]/25 flex items-center justify-between">
                  <span className="text-[11px] text-[#443B35]/60 font-medium">
                    {activeIndex + 1} / {count} điểm đến
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="px-3 py-1.5 rounded-full bg-[#F5EFE3] hover:bg-[#B9985A]/20 text-[#722238] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Trước
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-4 py-1.5 rounded-full bg-[#722238] hover:bg-[#581728] text-[#FFFDF9] text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                    >
                      Tiếp theo
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
