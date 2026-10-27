import React, { useState } from 'react';
import { WeddingEvent } from '../../../../types';
import { playCyberClick } from '../../../../lib/audioSynth';
import { CalendarExportModal } from '../../common/CalendarExportModal';
import { SmartRideModal } from '../../common/SmartRideModal';

interface CyberpunkEventsSectionProps {
  events?: WeddingEvent[];
}

export function CyberpunkEventsSection({ events }: CyberpunkEventsSectionProps) {
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<WeddingEvent | null>(null);
  const [selectedRideEvent, setSelectedRideEvent] = useState<WeddingEvent | null>(null);

  const defaultEvents: WeddingEvent[] = [
    {
      id: 'evt-1',
      title: 'LỄ THÀNH HÔN (MAIN CEREMONY)',
      type: 'ceremony',
      time: '11:00 AM',
      date: '20.12.2026',
      locationName: 'Trung Tâm Lễ Cưới L’Amour Grand Palace',
      address: 'Phòng Grand Ballroom, Số 88 Lê Văn Lương, Cầu Giấy, Hà Nội',
      mapUrl: 'https://maps.google.com',
      description: 'Lễ trao nhẫn, làm lễ hỷ sự cùng gia đình hai họ và bạn bè thân thiết.',
    },
    {
      id: 'evt-2',
      title: 'DẠ TIỆC TỐI HOLOGRAM (VIP BANQUET)',
      type: 'reception',
      time: '18:00 PM',
      date: '20.12.2026',
      locationName: 'Trung Tâm Lễ Cưới L’Amour Grand Palace',
      address: 'Sảnh Hoàng Gia, Số 88 Lê Văn Lương, Cầu Giấy, Hà Nội',
      mapUrl: 'https://maps.google.com',
      description: 'Dạ tiệc âm thanh ánh sáng, chúc rượu, âm nhạc tương tác và chương trình bốc thăm trúng thưởng.',
    },
  ];

  const list = events && events.length > 0 ? events : defaultEvents;

  return (
    <section className="relative py-20 px-6 bg-[#050714] text-slate-100 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30 uppercase bg-cyan-950/30">
            LỊCH TRÌNH SỰ KIỆN (SCHEDULE MATRIX)
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono uppercase text-white tracking-tight holo-glitch">
            SỰ KIỆN ĐẠI HỶ
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full" />
        </div>

        {/* Timeline Event Cards */}
        <div className="space-y-6">
          {list.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="bg-[#0B1026]/90 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-6 md:p-8 space-y-6 transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.08)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
                <div className="space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-cyan-500/30 uppercase bg-cyan-950/50">
                    SỰ KIỆN #{idx + 1}
                  </div>
                  <h3 className="text-2xl font-mono font-bold text-white uppercase">
                    {evt.title}
                  </h3>
                </div>

                <div className="text-left md:text-right space-y-1 font-mono">
                  <span className="block text-xl font-bold text-cyan-400 tabular-nums">
                    ⏰ {evt.time}
                  </span>
                  <span className="block text-xs text-slate-400">
                    📅 {evt.date}
                  </span>
                </div>
              </div>

              {/* Location & Details */}
              <div className="space-y-2 text-sm font-sans">
                <p className="font-semibold text-slate-200 text-base">
                  📍 {evt.locationName}
                </p>
                <p className="text-slate-400 text-xs font-light">
                  {evt.address}
                </p>
                {evt.description && (
                  <p className="text-slate-300 text-xs italic pt-2">
                    "{evt.description}"
                  </p>
                )}
              </div>

              {/* Interactive Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2 font-mono text-xs">
                {evt.mapUrl && (
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playCyberClick()}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center space-x-2"
                  >
                    <span>🗺️ XEM BẢN ĐỒ GOOGLE</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    playCyberClick();
                    setSelectedCalendarEvent(evt);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center space-x-2"
                >
                  <span>📅 LƯU LỊCH GOOGLE / APPLE</span>
                </button>

                <button
                  onClick={() => {
                    playCyberClick();
                    setSelectedRideEvent(evt);
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 hover:bg-pink-500/30 transition-colors flex items-center space-x-2"
                >
                  <span>🚗 ĐẶT XE ĐẾN TIỆC</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedCalendarEvent && (
        <CalendarExportModal
          isOpen={Boolean(selectedCalendarEvent)}
          event={selectedCalendarEvent}
          onClose={() => setSelectedCalendarEvent(null)}
        />
      )}

      {selectedRideEvent && (
        <SmartRideModal
          isOpen={Boolean(selectedRideEvent)}
          locationName={selectedRideEvent.locationName}
          address={selectedRideEvent.address}
          mapUrl={selectedRideEvent.mapUrl}
          onClose={() => setSelectedRideEvent(null)}
        />
      )}
    </section>
  );
}
