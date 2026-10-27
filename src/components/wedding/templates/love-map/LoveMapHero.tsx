import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { CompassRose, TravelPlaneIcon } from './LoveMapOrnaments';
import { MapPin, Heart, ChevronDown, Calendar, Navigation } from 'lucide-react';
import { StoryMilestone } from '../../../../types';

interface LoveMapHeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingLocation?: string;
  stories: StoryMilestone[];
  heroImage?: string;
  onExploreMap: () => void;
}

export function LoveMapHero({
  groomName,
  brideName,
  weddingDate,
  weddingLocation = 'Trung Tâm Yến Tiệc Hoàng Gia',
  stories,
  heroImage,
  onExploreMap,
}: LoveMapHeroProps) {
  // Determine start year/milestone and destination year
  const firstStory = stories.length > 0 ? stories[0] : null;
  const lastStory = stories.length > 1 ? stories[stories.length - 1] : null;

  const startYear = firstStory?.year || '2019';
  const startTitle = firstStory?.title || 'FIRST MEET';
  const endYear = lastStory?.year || (weddingDate.match(/\d{4}/)?.[0] || '2026');
  const endTitle = 'WEDDING';

  // Calculated flight route coordinates through SVG space
  const routeWaypoints = useMemo(() => {
    const total = Math.max(stories.length - 1, 1);
    const startX = 50;
    const endX = 450;
    const count = stories.length;

    return stories.map((st, idx) => {
      const progress = total > 0 ? idx / total : 0.5;
      const x = Math.round(startX + progress * (endX - startX));

      // Determine elegant Y coordinate for the journey curve
      let y = 50;
      if (count === 2) {
        y = idx === 0 ? 52 : 46;
      } else if (count === 3) {
        y = idx === 0 ? 50 : idx === 1 ? 30 : 50;
      } else if (count === 4) {
        // [Origin, Trough, Crest, Destination]
        const yMap = [50, 58, 28, 50];
        y = yMap[idx];
      } else {
        // Smooth sine wave distribution for any count
        const wave = -Math.sin(progress * Math.PI * 1.5) * 18;
        y = Math.round(50 + wave);
      }

      // If point is at high crest (y <= 36), place label pill ABOVE.
      // Otherwise, place label pill BELOW with clear margin to prevent any overlap.
      const isCrest = y <= 36;
      const labelY = isCrest ? y - 24 : y + 16;

      return {
        ...st,
        x,
        y,
        isCrest,
        labelY,
        idx,
      };
    });
  }, [stories]);

  // Generate SVG cubic bezier path string that strictly passes through every waypoint
  const routePathD = useMemo(() => {
    if (routeWaypoints.length === 0) return '';
    if (routeWaypoints.length === 1) return `M ${routeWaypoints[0].x} ${routeWaypoints[0].y}`;

    let d = `M ${routeWaypoints[0].x} ${routeWaypoints[0].y}`;
    for (let i = 0; i < routeWaypoints.length - 1; i++) {
      const curr = routeWaypoints[i];
      const next = routeWaypoints[i + 1];
      const midX = Math.round((curr.x + next.x) / 2);
      d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [routeWaypoints]);

  // Airplane indicator placed directly on the route climb
  const planeInfo = useMemo(() => {
    if (routeWaypoints.length < 2) return null;
    const segIdx = routeWaypoints.length >= 3 ? 1 : 0;
    const p1 = routeWaypoints[segIdx];
    const p2 = routeWaypoints[segIdx + 1];
    const px = Math.round((p1.x + p2.x) / 2);
    const py = Math.round((p1.y + p2.y) / 2);
    const angle = Math.round(Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI));
    return { x: px, y: py, angle };
  }, [routeWaypoints]);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-between pt-12 pb-10 px-4 overflow-hidden bg-[#F5EFE3] text-[#443B35]"
    >
      {/* Background Stylized Topographic Map Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle photo background tint if hero image is available */}
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-multiply filter blur-[1px] scale-105"
            style={{ backgroundImage: `url("${heroImage}")` }}
          />
        )}

        {/* Vintage Topographic Curves */}
        <svg
          className="w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Elevation Rings */}
          <ellipse cx="600" cy="400" rx="420" ry="260" fill="none" stroke="#B9985A" strokeWidth="1" strokeDasharray="5 5" />
          <ellipse cx="600" cy="400" rx="320" ry="190" fill="none" stroke="#722238" strokeWidth="0.8" opacity="0.6" />
          <ellipse cx="600" cy="400" rx="200" ry="120" fill="none" stroke="#53665A" strokeWidth="0.8" />
          <ellipse cx="600" cy="400" rx="90" ry="50" fill="none" stroke="#B9985A" strokeWidth="0.6" />

          {/* Meridian lines */}
          <line x1="600" y1="50" x2="600" y2="750" stroke="#443B35" strokeWidth="0.5" opacity="0.15" strokeDasharray="8 8" />
          <line x1="100" y1="400" x2="1100" y2="400" stroke="#443B35" strokeWidth="0.5" opacity="0.15" strokeDasharray="8 8" />

          {/* Coordinate markings */}
          <text x="610" y="80" fontSize="10" fill="#722238" opacity="0.4" fontFamily="monospace">N 16°28&apos;02&quot; E 107°35&apos;44&quot;</text>
        </svg>
      </div>

      {/* Decorative Rotating Compass in Upper Right */}
      <div className="absolute top-6 right-6 lg:top-12 lg:right-16 pointer-events-none opacity-40 hover:opacity-70 transition-opacity">
        <CompassRose className="w-16 h-16 sm:w-24 sm:h-24" rotate={8} />
      </div>

      {/* Top Header Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 flex flex-col items-center text-center mt-4"
      >
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFFDF9]/90 border border-[#B9985A]/40 text-[#722238] shadow-sm">
          <Navigation className="w-3.5 h-3.5 text-[#B9985A]" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
            OUR JOURNEY BEGINS HERE
          </span>
        </div>
      </motion.div>

      {/* Main Stylized Route Map Centerpiece */}
      <div className="relative z-20 w-full max-w-4xl my-auto flex flex-col items-center text-center py-6">
        {/* Couple Names over Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mb-6 space-y-2"
        >
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#B9985A]">
            THE WEDDING ADVENTURE OF
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-serif-title font-bold text-3xl sm:text-5xl lg:text-6xl text-[#443B35] tracking-tight">
            <span>{groomName}</span>
            <span className="font-serif italic font-normal text-2xl sm:text-4xl text-[#722238] px-1">
              &amp;
            </span>
            <span>{brideName}</span>
          </div>
          <p className="text-sm sm:text-base font-serif italic text-[#722238] max-w-md mx-auto pt-1">
            &ldquo;Đi cùng nhau từ một khoảnh khắc tình cờ đến một đời gắn kết&rdquo;
          </p>
        </motion.div>

        {/* Hero Interactive Stylized Route Canvas */}
        <div className="relative w-full max-w-2xl px-4 py-6 bg-[#FFFDF9]/80 rounded-3xl border border-[#B9985A]/35 shadow-lg backdrop-blur-sm my-4">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#722238]/80 mb-2 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#722238]" />
              ORIGIN: {startYear}
            </span>
            <span className="text-[#B9985A] hidden sm:inline">
              {stories.length} STOPS OF LOVE
            </span>
            <span className="flex items-center gap-1.5">
              DESTINATION: {endYear}
              <Heart className="w-2.5 h-2.5 fill-[#722238] text-[#722238]" />
            </span>
          </div>

          {/* Route SVG with animated dashed line & airplane */}
          <div className="relative w-full h-24 sm:h-28 flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Route Curve strictly passing through every waypoint */}
              <motion.path
                id="hero-route-path"
                d={routePathD}
                stroke="#B9985A"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
              />

              {/* Waypoints along route */}
              {routeWaypoints.map((st, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === routeWaypoints.length - 1;

                return (
                  <motion.g
                    key={st.id || idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 + idx * 0.25, duration: 0.4 }}
                    className="cursor-pointer group"
                    onClick={onExploreMap}
                  >
                    {/* Ring aura for first and last */}
                    {(isFirst || isLast) && (
                      <circle
                        cx={st.x}
                        cy={st.y}
                        r={isLast ? 14 : 12}
                        fill={isLast ? '#722238' : '#53665A'}
                        fillOpacity="0.12"
                        stroke={isLast ? '#722238' : '#53665A'}
                        strokeWidth="1.2"
                      />
                    )}

                    {/* Central dot on the exact curve coordinate */}
                    <circle
                      cx={st.x}
                      cy={st.y}
                      r={isFirst || isLast ? 7.5 : 4.5}
                      fill={isLast ? '#722238' : isFirst ? '#53665A' : '#B9985A'}
                      stroke="#FFFDF9"
                      strokeWidth="2"
                    />

                    {/* Milestone Year Label Badge - with clean opaque background to prevent any overlap */}
                    <g className="transition-all duration-300">
                      <rect
                        x={st.x - 22}
                        y={st.labelY}
                        width="44"
                        height="18"
                        rx="9"
                        fill="#FFFDF9"
                        stroke="#B9985A"
                        strokeWidth="0.8"
                        strokeOpacity="0.8"
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))',
                        }}
                      />
                      <text
                        x={st.x}
                        y={st.labelY + 12}
                        fontSize="9"
                        fontWeight="bold"
                        fill="#722238"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                        className="select-none pointer-events-none"
                      >
                        {st.year || `${idx + 1}`}
                      </text>
                    </g>
                  </motion.g>
                );
              })}

              {/* Airplane positioned right on the route curve */}
              {planeInfo && (
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  transform={`translate(${planeInfo.x}, ${planeInfo.y}) rotate(${planeInfo.angle})`}
                  className="pointer-events-none"
                >
                  <circle
                    r="12"
                    fill="#FFFDF9"
                    stroke="#B9985A"
                    strokeWidth="1.2"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))',
                    }}
                  />
                  <g transform="translate(-7, -7)">
                    <TravelPlaneIcon className="w-3.5 h-3.5 text-[#722238]" />
                  </g>
                </motion.g>
              )}
            </svg>
          </div>

          {/* Route Milestones Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#B9985A]/20 text-center">
            {stories.slice(0, 4).map((st, i) => (
              <div key={st.id || i} className="p-1.5 rounded-xl hover:bg-[#F5EFE3]/50 transition-colors">
                <span className="text-[10px] font-bold text-[#722238] uppercase block tracking-wider">
                  {st.year}
                </span>
                <span className="text-[11px] font-medium text-[#443B35] truncate block">
                  {st.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button to jump directly to the Love Map */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-4"
        >
          <button
            id="hero-explore-map-btn"
            onClick={onExploreMap}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#722238] hover:bg-[#5a1a2b] text-[#FFFDF9] font-semibold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#B9985A]/40"
          >
            <MapPin className="w-4 h-4 text-[#B9985A]" />
            <span>KHÁM PHÁ BẢN ĐỒ TÌNH YÊU</span>
          </button>

          <a
            href="#wedding-destination"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFFDF9] hover:bg-white text-[#443B35] font-semibold text-xs tracking-wider uppercase border border-[#B9985A]/40 shadow-sm transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-[#722238]" />
            <span>ĐIỂM ĐẾN HÔN LỄ</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.a
        href="#couple"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="relative z-20 flex flex-col items-center gap-1 text-[#722238] hover:text-[#443B35] transition-colors cursor-pointer text-xs uppercase tracking-widest font-semibold"
      >
        <span>HÀNH TRÌNH BẮT ĐẦU</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-[#B9985A]" />
        </motion.div>
      </motion.a>
    </section>
  );
}
