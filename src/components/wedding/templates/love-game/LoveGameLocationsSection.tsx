import React, { useState } from 'react';
import { MapPin, Navigation, Calendar, Copy, Check, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { WeddingEvent } from '../../../../types';
import { playPointChime } from './loveGameSounds';
import { SmartEventActions } from '../../common/SmartEventActions';

interface LoveGameLocationsSectionProps {
  events?: WeddingEvent[];
  isCompleted: boolean;
  onCompleteQuest: () => void;
}

export function LoveGameLocationsSection({
  events = [],
  isCompleted,
  onCompleteQuest,
}: LoveGameLocationsSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const defaultEvents: WeddingEvent[] = [
    {
      id: 'evt-1',
      title: 'Lễ Vu Quy (Nhà Gái)',
      type: 'ceremony',
      date: '20/12/2026',
      time: '08:30',
      locationName: 'Tư Gia Nhà Gái',
      address: '123 Đường Nguyễn Huệ, Phường Vĩnh Ninh, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=123+Nguyen+Hue+Hue+Vietnam',
      description: 'Nghi thức trao nhẫn truyền thống và nhận phúc lành từ hai họ.',
    },
    {
      id: 'evt-2',
      title: 'Lễ Thành Hôn & Tiệc Cưới',
      type: 'reception',
      date: '20/12/2026',
      time: '11:00',
      locationName: 'Trung Tâm Tiệc Cưới Hương Giang Grand Ballroom',
      address: '51 Lê Lợi, Phường Phú Hội, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=51+Le+Loi+Hue+Vietnam',
      description: 'Khai tiệc mừng hạnh phúc cùng bạn bè và quan khách thân hữu.',
    },
  ];

  const items = events && events.length > 0 ? events : defaultEvents;

  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    playPointChime();
    if (!isCompleted) {
      onCompleteQuest();
    }
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenMap = (url: string) => {
    playPointChime();
    if (!isCompleted) {
      onCompleteQuest();
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="quest-locations" className="relative py-24 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Section Header with Quest Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>QUEST 03 • ĐỊA ĐIỂM &amp; CHỈ ĐƯỜNG</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Tọa Độ Check-in Đám Cưới
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            Khám phá địa điểm tổ chức hôn lễ và tiệc mừng. Mở bản đồ hoặc sao chép địa chỉ để hoàn thành nhiệm vụ!
          </p>

          {/* Quest completion badge */}
          <div className="pt-1">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ĐÃ HOÀN THÀNH CHẶNG 3 (+10 LOVE POINTS)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playPointChime();
                  onCompleteQuest();
                }}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Chạm để lưu tọa độ (+10 PTS)
              </button>
            )}
          </div>
        </div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="group relative bg-[#16132A]/85 border border-white/15 hover:border-emerald-400/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl transition-all duration-300 text-left space-y-5 hover:-translate-y-1"
            >
              {/* Top Station Tag */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  CHECKPOINT #{idx + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  {evt.type === 'ceremony' ? 'LỄ THÀNH HÔN' : 'TIỆC MỪNG'}
                </span>
              </div>

              {/* Title & Timing */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {evt.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-300 font-mono">
                  <div className="flex items-center gap-1.5 text-pink-300">
                    <Clock className="w-4 h-4 text-pink-400" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{evt.date}</span>
                  </div>
                </div>
              </div>

              {/* Venue & Address */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{evt.locationName}</span>
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed pl-5">
                  {evt.address}
                </p>
              </div>

              {evt.description && (
                <p className="text-xs text-neutral-400 italic">
                  &ldquo;{evt.description}&rdquo;
                </p>
              )}

              {/* Smart Actions: Map, Grab/Be Ride, Add to Calendar */}
              <SmartEventActions
                event={{
                  title: evt.title,
                  date: evt.date,
                  time: evt.time,
                  locationName: evt.locationName,
                  address: evt.address,
                  description: evt.description,
                  mapUrl: evt.mapUrl,
                }}
                theme="cyber"
                className="pt-2 border-t border-white/10"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
