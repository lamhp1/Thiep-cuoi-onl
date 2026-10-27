import React from 'react';
import { WeddingEvent } from '../../../../types';
import { SparklingStar, LotusNightIcon } from './LanternNightOrnaments';
import { Clock, MapPin, Calendar, ExternalLink, Sparkles, Navigation } from 'lucide-react';
import { SmartEventActions } from '../../common/SmartEventActions';

interface LanternEventsSectionProps {
  events: WeddingEvent[];
}

export function LanternEventsSection({ events }: LanternEventsSectionProps) {
  // Evening specific schedule if single event or standard
  const eveningProgram = [
    { time: '17:30', title: 'Đón Khách Dưới Phố Đèn Lồng', desc: 'Welcome Cocktail, trà chiều hoàng cung & chụp ảnh kỷ niệm tại photobooth đèn lồng.' },
    { time: '18:30', title: 'Khai Lễ Dạ Tiệc Hoàng Gia', desc: 'Nghi thức trao nhẫn, thắp sáng đôi đèn Long Phụng & nhận chúc phúc từ song thân.' },
    { time: '19:15', title: 'Khai Yến & Rót Rượu Mừng', desc: 'Thưởng thức ẩm thực dạ yến thượng hạng cùng tháp rượu champagne lung linh.' },
    { time: '20:30', title: 'Thả Đèn Lồng & Khiêu Vũ Acoustic', desc: 'Cùng thả đèn hoa đăng gửi gắm ước nguyện hòa cùng giai điệu tình ca đêm.' },
  ];

  const handleAddToCalendar = (ev: WeddingEvent) => {
    // Generate Google Calendar Link
    const title = encodeURIComponent(ev.title);
    const location = encodeURIComponent(`${ev.locationName}, ${ev.address}`);
    const details = encodeURIComponent(ev.description || 'Dạ tiệc cưới đèn lồng');
    // Simple 2026-12-20 date format
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${details}&dates=20261220T110000Z/20261220T150000Z`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <section id="events" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-serif uppercase tracking-widest">
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Thời Khắc Trọng Đại</span>
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-100 animate-gold-shimmer">
          Lịch Trình Dạ Yến Đèn Lồng
        </h2>
        <p className="font-serif italic text-sm text-neutral-400 max-w-md mx-auto">
          Sự hiện diện của quý khách là niềm vinh hạnh và ngọn lửa ấm áp nhất cho buổi dạ tiệc của chúng mình.
        </p>
      </div>

      {/* Main Events Cards (Vu Quy & Thành Hôn / Reception) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {events.map((ev, idx) => (
          <div
            key={ev.id || idx}
            className="relative rounded-3xl bg-neutral-950/70 border border-amber-500/35 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between group hover:border-amber-400/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-900/40 border border-amber-500/30 text-amber-300 text-xs font-serif uppercase tracking-wider">
                  {ev.type === 'ceremony' ? 'Lễ Vu Quy (Nhà Gái)' : 'Tiệc Cưới Dạ Yến (Nhà Trai)'}
                </span>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>

              <h3 className="font-serif-title text-2xl font-bold text-amber-100">
                {ev.title}
              </h3>

              {/* Time & Date */}
              <div className="flex items-center gap-4 text-amber-200/90 font-serif text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{ev.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{ev.time}</span>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1 pt-2">
                <div className="flex items-start gap-2 text-neutral-200 font-serif text-sm font-semibold">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{ev.locationName}</span>
                </div>
                <p className="text-xs text-neutral-400 font-body pl-6">
                  {ev.address}
                </p>
              </div>

              {ev.description && (
                <p className="text-xs font-serif italic text-neutral-300/80 pt-2 border-t border-amber-500/15">
                  {ev.description}
                </p>
              )}
            </div>

            {/* Smart Actions: Map, Grab/Be Ride, Add to Calendar */}
            <SmartEventActions
              event={{
                title: ev.title,
                date: ev.date,
                time: ev.time,
                locationName: ev.locationName,
                address: ev.address,
                description: ev.description,
                mapUrl: ev.mapUrl,
              }}
              theme="gold"
              className="mt-6 pt-4 border-t border-amber-500/20"
            />
          </div>
        ))}
      </div>

      {/* Evening Gala Timeline Bar (Tối ưu cho tiệc tối) */}
      <div className="rounded-3xl bg-linear-to-b from-[#18040C]/80 to-neutral-950/80 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-serif uppercase tracking-[0.2em] text-amber-400 font-semibold">
            ✦ Chương Trình Chi Tiết Dạ Tiệc Tối ✦
          </span>
          <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-amber-100">
            Dạ Yến Đèn Lồng Trăng Rằm
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eveningProgram.map((item, i) => (
            <div
              key={i}
              className="relative p-4 rounded-2xl bg-neutral-950/60 border border-amber-500/20 space-y-2 group hover:border-amber-400/50 transition-colors"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-serif text-xs font-bold">
                {item.time}
              </div>
              <h5 className="font-serif-title text-base font-bold text-amber-100">
                {item.title}
              </h5>
              <p className="text-xs font-body text-neutral-300/80 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dress Code Recommendation for Night Wedding */}
        <div className="mt-8 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-xs font-serif uppercase tracking-widest text-amber-400 font-bold">
              Trang Phục Gợi Ý (Dress Code Dạ Yến)
            </span>
            <p className="text-xs text-neutral-300">
              Quý khách vui lòng ưu tiên trang phục tông màu ấm áp: Burgundy, Đỏ Rượu, Midnight Navy hoặc Champagne Gold.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#881337] border border-amber-400/40" title="Burgundy" />
            <div className="w-6 h-6 rounded-full bg-[#0F172A] border border-amber-400/40" title="Midnight Navy" />
            <div className="w-6 h-6 rounded-full bg-[#CA8A04] border border-amber-400/40" title="Champagne Gold" />
            <div className="w-6 h-6 rounded-full bg-[#450A0A] border border-amber-400/40" title="Deep Wine" />
          </div>
        </div>
      </div>
    </section>
  );
}
