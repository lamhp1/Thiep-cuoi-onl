import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Compass, CheckCircle2, ChevronRight, Gem } from 'lucide-react';
import { MiniSongHy, MinimalistLotus, ModernCloudLine } from './VietnameseModernOrnaments';
import { ProgressiveLuxuryImage } from '../../ui/ProgressiveLuxuryImage';

interface TimelineStep {
  year: string;
  badge: string;
  anhTitle: string;
  anhStory: string;
  anhPhoto: string;
  maiTitle: string;
  maiStory: string;
  maiPhoto: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    year: '2019',
    badge: 'Meet • Chạm Nhau Ánh Mắt',
    anhTitle: 'Lần Đầu Gặp Gỡ Em',
    anhStory:
      'Một buổi chiều thu Hà Nội tại quán cà phê phố cổ, anh bắt gặp nụ cười trong trẻo của em. Khoảnh khắc ánh mắt ta chạm nhau, anh biết thế giới của mình từ nay đã có thêm một điều kỳ diệu.',
    anhPhoto:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    maiTitle: 'Chàng Trai Ấm Áp',
    maiStory:
      'Ấn tượng đầu tiên về anh là sự chỉn chu và giọng nói trầm ấm. Cách anh lắng nghe em chia sẻ về những đam mê nhỏ bé khiến em cảm nhận được sự bao dung và tin cậy.',
    maiPhoto:
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2022',
    badge: 'Love • Lời Yêu Ngọt Ngào',
    anhTitle: 'Chính Thức Nắm Tay Em',
    anhStory:
      'Sau 3 năm cùng nhau sẻ chia mọi vui buồn, anh lấy hết dũng khí ngỏ lời yêu bên bờ biển lộng gió. Nắm lấy bàn tay nhỏ nhắn của em, anh tự hứa sẽ luôn là điểm tựa vững chãi nhất.',
    anhPhoto:
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=800&q=80',
    maiTitle: 'Bình Yên Bên Anh',
    maiStory:
      'Cái gật đầu ngày hôm ấy là quyết định dịu dàng nhất của thanh xuân em. Tình yêu với anh không ồn ào mà ấm áp như nắng sớm, luôn có mặt mỗi khi em cần.',
    maiPhoto:
      'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2026',
    badge: 'Marriage • Lời Hứa Trọn Đời',
    anhTitle: 'Cầu Hôn Dưới Ánh Hoàng Hôn',
    anhStory:
      'Chiếc nhẫn anh đã chuẩn bị suốt nhiều tháng ròng. Khi quỳ xuống dưới hoàng hôn và nghẹn ngào: "Làm vợ anh nhé?", nhìn giọt nước mắt hạnh phúc của em, anh đã chạm đến ước mơ lớn nhất đời mình.',
    anhPhoto:
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    maiTitle: 'Em Đồng Ý Về Cùng Nhà',
    maiStory:
      'Bảy năm yêu thương đơm hoa kết trái bằng hai tiếng "Đồng ý". Em tin rằng chặng đường phía trước, dù có bao thăng trầm, chỉ cần bàn tay này nắm lấy bàn tay kia, chúng ta sẽ vượt qua tất cả.',
    maiPhoto:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
];

import { StoryMilestone } from '../../../types';

interface DualParallelTimelineProps {
  stories?: StoryMilestone[];
  groomName?: string;
  brideName?: string;
}

export function DualParallelTimeline({
  stories,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: DualParallelTimelineProps) {
  // If stories is explicitly passed and empty, hide completely
  if (stories && stories.length === 0) {
    return null;
  }

  const steps: TimelineStep[] = React.useMemo(() => {
    if (stories && stories.length > 0) {
      return stories.map((s, idx) => {
        const defaultPreset = TIMELINE_STEPS[idx % TIMELINE_STEPS.length];

        // Resolved Year & Badge
        const year = s.year || (2019 + idx * 2).toString();
        const badge = s.dateStr ? `${s.dateStr} • ${s.title || defaultPreset.badge}` : s.title ? `${year} • ${s.title}` : defaultPreset.badge;

        // --- GROOM (ANH) RESOLUTION ---
        let anhTitle = s.groomTitle?.trim() || (s.title && s.title !== defaultPreset.badge ? s.title : defaultPreset.anhTitle);
        let anhPhoto = s.groomImage?.trim() || s.image || defaultPreset.anhPhoto;
        let anhStory = s.groomStory?.trim() || s.groomDescription?.trim() || s.description?.trim() || defaultPreset.anhStory;

        // --- BRIDE (MAI / EM) RESOLUTION ---
        let maiTitle = s.brideTitle?.trim() || defaultPreset.maiTitle;
        let maiPhoto = s.brideImage?.trim() || (s.groomImage && s.image !== s.groomImage ? s.image : defaultPreset.maiPhoto);
        let maiStory = s.brideStory?.trim() || s.brideDescription?.trim() || '';

        // If bride perspective wasn't explicitly customized, supply the rich authentic complementary bride perspective
        if (!maiStory) {
          if (s.groomStory && s.description && s.description !== s.groomStory) {
            maiStory = s.description;
          } else {
            maiStory = defaultPreset.maiStory;
          }
        }

        // Failsafe: Ensure groom and bride titles and stories are NEVER identical duplicates
        if (anhTitle.trim().toLowerCase() === maiTitle.trim().toLowerCase()) {
          maiTitle = defaultPreset.maiTitle;
        }
        if (anhStory.trim().toLowerCase() === maiStory.trim().toLowerCase()) {
          maiStory = defaultPreset.maiStory;
        }
        if (anhPhoto.trim() === maiPhoto.trim() && defaultPreset.maiPhoto) {
          maiPhoto = defaultPreset.maiPhoto;
        }

        return {
          year,
          badge,
          anhTitle,
          anhStory,
          anhPhoto,
          maiTitle,
          maiStory,
          maiPhoto,
        };
      });
    }
    return TIMELINE_STEPS;
  }, [stories, groomName, brideName]);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [hoveredSide, setHoveredSide] = useState<'both' | 'anh' | 'mai'>('both');

  const shortGroomName = groomName || 'Anh';
  const shortBrideName = brideName || 'Mai';

  return (
    <section id="story-dual-timeline" className="py-20 sm:py-28 relative overflow-hidden bg-[#F7F4EC]">
      {/* Background line-art clouds subtle watermark */}
      <div className="absolute top-12 left-6 pointer-events-none opacity-25">
        <ModernCloudLine className="w-36 h-16 text-[#D8BE87]" />
      </div>
      <div className="absolute top-24 right-8 pointer-events-none opacity-20 rotate-12">
        <ModernCloudLine className="w-40 h-16 text-[#D8BE87]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#63121D]/10 border border-[#63121D]/20 text-[#63121D] text-xs font-semibold uppercase tracking-[0.2em]">
            <MiniSongHy className="w-3.5 h-3.5 text-[#63121D]" />
            <span>Parallel Love Story</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#18181A] tracking-tight">
            Hai Ngả Đường • Một Điểm Hẹn
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#5A554E] leading-relaxed max-w-lg mx-auto">
            Hai câu chuyện song hành từ hai góc nhìn của <strong className="text-[#63121D]">{groomName}</strong> và{' '}
            <strong className="text-[#63121D]">{brideName}</strong>, từng bước gắn kết và hòa làm một vào năm 2026.
          </p>

          {/* Perspective Selector Pills */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setHoveredSide('both')}
              className={`px-3.5 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                hoveredSide === 'both'
                  ? 'bg-[#63121D] text-[#F7F4EC] border-[#63121D] shadow-sm'
                  : 'bg-white/60 text-[#5A554E] border-[#D8BE87]/40 hover:bg-white'
              }`}
            >
              Song hành cả hai
            </button>
            <button
              onClick={() => setHoveredSide('anh')}
              className={`px-3.5 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                hoveredSide === 'anh'
                  ? 'bg-[#18181A] text-[#D8BE87] border-[#18181A] shadow-sm'
                  : 'bg-white/60 text-[#5A554E] border-[#D8BE87]/40 hover:bg-white'
              }`}
            >
              Góc nhìn {shortGroomName}
            </button>
            <button
              onClick={() => setHoveredSide('mai')}
              className={`px-3.5 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                hoveredSide === 'mai'
                  ? 'bg-[#7A1624] text-[#F7F4EC] border-[#7A1624] shadow-sm'
                  : 'bg-white/60 text-[#5A554E] border-[#D8BE87]/40 hover:bg-white'
              }`}
            >
              Góc nhìn {shortBrideName}
            </button>
          </div>
        </div>

        {/* Dual Column Headings */}
        <div className="grid grid-cols-2 gap-4 sm:gap-12 mb-10 max-w-4xl mx-auto text-center border-b border-[#D8BE87]/40 pb-4">
          <div
            className={`transition-opacity duration-300 ${
              hoveredSide === 'mai' ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C8275] block">
              Góc Nhìn Chú Rể
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#18181A] tracking-wider mt-1">
              {shortGroomName.toUpperCase()}
            </h3>
            <span className="text-xs text-[#63121D] font-medium tracking-wide">
              {groomName}
            </span>
          </div>

          <div
            className={`transition-opacity duration-300 ${
              hoveredSide === 'anh' ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C8275] block">
              Góc Nhìn Cô Dâu
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#63121D] tracking-wider mt-1">
              {shortBrideName.toUpperCase()}
            </h3>
            <span className="text-xs text-[#18181A] font-medium tracking-wide">
              {brideName}
            </span>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-16 max-w-4xl mx-auto relative">
          {/* Dual Parallel Vertical Guide Lines */}
          <div className="hidden md:block absolute top-6 bottom-16 left-[25%] -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#18181A]/20 via-[#D8BE87] to-[#63121D] pointer-events-none" />
          <div className="hidden md:block absolute top-6 bottom-16 left-[75%] -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#63121D]/20 via-[#D8BE87] to-[#63121D] pointer-events-none" />

          {steps.map((step, idx) => {
            const isSelected = activeStepIndex === idx;

            return (
              <div
                key={step.year + '-' + idx}
                onClick={() => setActiveStepIndex(idx)}
                className="relative cursor-pointer group"
              >
                {/* Year Marker in Center */}
                <div className="flex items-center justify-center my-4">
                  <div className="relative z-20 px-5 py-1.5 rounded-full bg-[#18181A] text-[#D8BE87] border border-[#D8BE87]/60 shadow-md flex items-center gap-2 group-hover:scale-105 transition-transform">
                    <span className="font-serif-title text-base sm:text-lg font-bold tracking-widest text-white">
                      {step.year}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#D8BE87]" />
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#D8BE87]">
                      {step.badge.split('•')[0].trim()}
                    </span>
                  </div>
                </div>

                {/* Parallel Cards Grid: Left (Groom) & Right (Bride) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 pt-2">
                  {/* GROOM Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                      hoveredSide === 'mai' ? 'opacity-40' : 'opacity-100'
                    } ${
                      isSelected
                        ? 'bg-[#FFFFFF] shadow-xl border-[#18181A]/40 ring-2 ring-[#18181A]/10'
                        : 'bg-[#FFFFFF] hover:shadow-md border-[#D8BE87]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8C8275]">
                          {shortGroomName} • {step.year}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#18181A]" />
                      </div>

                      <h4 className="font-serif-title text-lg sm:text-xl font-bold text-[#18181A] mb-2">
                        {step.anhTitle}
                      </h4>

                      <p className="font-body text-xs sm:text-sm text-[#4A453F] leading-relaxed mb-4">
                        "{step.anhStory}"
                      </p>
                    </div>

                    <div className="relative h-36 sm:h-44 rounded-xl overflow-hidden shadow-inner border border-[#D8BE87]/40 bg-[#EFE8DC]">
                      <ProgressiveLuxuryImage
                        src={step.anhPhoto}
                        alt={`Ký ức ${shortGroomName} ${step.year}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-medium tracking-wide pointer-events-none">
                        Ký ức {shortGroomName}
                      </div>
                    </div>
                  </motion.div>

                  {/* BRIDE Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                      hoveredSide === 'anh' ? 'opacity-40' : 'opacity-100'
                    } ${
                      isSelected
                        ? 'bg-[#FFFFFF] shadow-xl border-[#63121D]/50 ring-2 ring-[#63121D]/15'
                        : 'bg-[#FFFFFF] hover:shadow-md border-[#D8BE87]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#63121D]">
                          {shortBrideName} • {step.year}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#63121D]" />
                      </div>

                      <h4 className="font-serif-title text-lg sm:text-xl font-bold text-[#63121D] mb-2">
                        {step.maiTitle}
                      </h4>

                      <p className="font-body text-xs sm:text-sm text-[#4A453F] leading-relaxed mb-4">
                        "{step.maiStory}"
                      </p>
                    </div>

                    <div className="relative h-36 sm:h-44 rounded-xl overflow-hidden shadow-inner border border-[#D8BE87]/40 bg-[#EFE8DC]">
                      <ProgressiveLuxuryImage
                        src={step.maiPhoto}
                        alt={`Ký ức ${shortBrideName} ${step.year}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-medium tracking-wide pointer-events-none">
                        Ký ức {shortBrideName}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hai Timeline Hợp Lại Ở Cuối (Convergence Section & SVG Animation) */}
        <div className="mt-20 pt-10 text-center max-w-3xl mx-auto relative">
          {/* Animated Converging SVG Lines */}
          <div className="w-full max-w-md mx-auto mb-6">
            <svg
              viewBox="0 0 400 180"
              fill="none"
              className="w-full h-28 sm:h-36 overflow-visible"
            >
              <defs>
                <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#18181A" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#D8BE87" stopOpacity="1" />
                  <stop offset="100%" stopColor="#63121D" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="rightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#63121D" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#D8BE87" stopOpacity="1" />
                  <stop offset="100%" stopColor="#63121D" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="unionGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D8BE87" stopOpacity="1" />
                  <stop offset="100%" stopColor="#63121D" stopOpacity="1" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Nhánh bên trái từ Anh (100 -> 200) */}
              <motion.path
                d="M 80 10 C 80 70 200 90 200 130"
                stroke="url(#leftGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0.2, opacity: 0.6 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />

              {/* Nhánh bên phải từ Mai (320 -> 200) */}
              <motion.path
                d="M 320 10 C 320 70 200 90 200 130"
                stroke="url(#rightGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0.2, opacity: 0.6 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />

              {/* Đường trung tâm hợp nhất rạng rỡ (200, 130 -> 200, 175) */}
              <motion.path
                d="M 200 130 L 200 175"
                stroke="url(#unionGlow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#glowEffect)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 1 }}
              />

              {/* Điểm giao thoa phát sáng */}
              <circle cx="200" cy="130" r="5" fill="#D8BE87" />
              <circle cx="200" cy="175" r="4" fill="#63121D" />
            </svg>
          </div>

          {/* Convergence Emblem & Union Announcement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white via-[#FFFDF9] to-[#F8F4EC] border-2 border-[#D8BE87]/60 shadow-2xl relative overflow-hidden"
          >
            {/* Corner minimalist motifs */}
            <div className="absolute top-4 left-4 opacity-30">
              <MinimalistLotus className="w-8 h-8 text-[#D8BE87]" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-30 rotate-180">
              <MinimalistLotus className="w-8 h-8 text-[#D8BE87]" />
            </div>

            {/* Mini Song Hy Badge */}
            <div className="w-14 h-14 rounded-full bg-[#63121D] border-2 border-[#D8BE87] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MiniSongHy className="w-6 h-6 text-[#F7F4EC]" />
            </div>

            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#63121D] block mb-1">
              The Convergence • 2026
            </span>

            <h3 className="font-serif-title text-2xl sm:text-4xl font-bold text-[#18181A] mb-3">
              Trọn Đời Bên Nhau
            </h3>

            <p className="font-body text-xs sm:text-sm text-[#5A554E] leading-relaxed max-w-lg mx-auto mb-6">
              "Hai ngả đường riêng biệt của thanh xuân nay đã hòa cùng một nhịp đập. Chúng mình trân trọng từng khoảnh khắc đã qua để viết tiếp chương đẹp nhất của cuộc đời: Hôn Nhân & Hạnh Phúc."
            </p>

            <div className="inline-flex items-center gap-4 text-xs font-semibold text-[#18181A] tracking-wider px-5 py-2.5 rounded-full bg-[#D8BE87]/15 border border-[#D8BE87]/40">
              <span className="text-[#18181A] font-serif-title text-sm">{groomName}</span>
              <Heart className="w-3.5 h-3.5 fill-[#63121D] text-[#63121D]" />
              <span className="text-[#63121D] font-serif-title text-sm">{brideName}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
