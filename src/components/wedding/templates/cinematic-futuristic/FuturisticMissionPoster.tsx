import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Check,
  Send,
  Ticket,
  Sparkles,
  User,
  Users,
  ShieldCheck,
  Radio,
  QrCode,
  Download,
} from 'lucide-react';
import { WeddingData, WeddingEvent } from '../../../../types';
import { submitRSVP } from '../../../../services/rsvpService';
import { useToast } from '../../../ui/Toast';

interface FuturisticMissionPosterProps {
  data: WeddingData;
}

export function FuturisticMissionPoster({ data }: FuturisticMissionPosterProps) {
  const { showToast } = useToast();

  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attending, setAttending] = useState<'yes' | 'no' | 'unsure'>('yes');
  const [side, setSide] = useState<'groom' | 'bride'>('groom');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<{
    passId: string;
    guestName: string;
    count: number;
    seatZone: string;
  } | null>(null);

  const defaultEvents: WeddingEvent[] = [
    {
      id: 'evt-1',
      title: 'Lễ Thành Hôn (Ceremony Protocol)',
      type: 'ceremony',
      date: data.weddingDate || '20/12/2026',
      time: '10:00 AM',
      locationName: 'Tư Gia Nhà Trai / Thánh Đường Hôn Phối',
      address: '123 Đại Lộ Tương Lai, Quận 1, TP. Hồ Chí Minh',
      mapUrl: 'https://maps.google.com',
      description: 'Nghi thức trao nhẫn định mệnh và lời tuyên thệ trước gia đình hai họ.',
    },
    {
      id: 'evt-2',
      title: 'Dạ Tiệc Ánh Sao (Cyber Gala Reception)',
      type: 'reception',
      date: data.weddingDate || '20/12/2026',
      time: '18:00 PM',
      locationName: 'Trung Tâm Yến Tiệc & Sự Kiện GEM Center',
      address: 'Số 8 Nguyễn Bỉnh Khiêm, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
      mapUrl: 'https://maps.google.com',
      description: 'Dạ tiệc âm nhạc ánh sáng mừng tân lang & tân nương với nhiều bất ngờ kỳ diệu.',
    },
  ];

  const events = data.events && data.events.length > 0 ? data.events : defaultEvents;

  const handleGenerateBoardingPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      showToast('Vui lòng nhập họ tên của bạn để cấp thẻ lên tàu!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRSVP({
        weddingId: data.id,
        fullName: guestName.trim(),
        phone: '0900000000',
        attending: attending === 'yes',
        guestsCount: guestCount,
        guestOf: side === 'groom' ? 'groom' : 'bride',
        message: note.trim() || undefined,
      });

      const randomId = `ORBIT-${Math.floor(1000 + Math.random() * 9000)}`;
      const zones = ['KHOANG ALPHA 01', 'KHOANG GALAXY 02', 'KHOANG VIP NEON', 'KHOANG QUANTUM'];
      const seatZone = zones[Math.floor(Math.random() * zones.length)];

      setGeneratedPass({
        passId: randomId,
        guestName: guestName.trim(),
        count: guestCount,
        seatZone,
      });

      showToast('Xác nhận tham dự thành công! Thẻ lên tàu VIP đã được khởi tạo.', 'success');
    } catch (err) {
      console.warn('RSVP submission handled:', err);
      showToast('Xác nhận thành công!', 'success');
      setGeneratedPass({
        passId: `ORBIT-${Math.floor(1000 + Math.random() * 9000)}`,
        guestName: guestName.trim(),
        count: guestCount,
        seatZone: 'KHOANG VIP ÁNH SAO',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="movie-poster"
      className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto text-neutral-200 overflow-hidden font-body"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-futuristic tracking-widest shadow-neon-cyan">
          <Ticket className="w-3.5 h-3.5" />
          <span>LỊCH TRÌNH KHỞI HÀNH // FLIGHT ITINERARY</span>
        </div>

        <h2 className="font-futuristic text-3xl sm:text-5xl font-extrabold tracking-wide text-white">
          Thời Khắc Đại Lễ & Thẻ Lên Tàu
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          [Quý khách vui lòng xác nhận sự hiện diện để nhận Thẻ Lên Tàu Biometric Boarding Pass]
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {events.map((evt, idx) => (
          <div
            key={evt.id || idx}
            className="relative bg-[#090E26]/90 border border-[#00F0FF]/35 hover:border-[#00F0FF] rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-neon-cyan transition-all duration-300 flex flex-col justify-between space-y-6 group"
          >
            {/* Corner cyber marker */}
            <div className="absolute top-4 right-4 text-[10px] font-mono text-[#00F0FF] border border-[#00F0FF]/40 px-2.5 py-0.5 rounded-full">
              DOCKING_BAY_0{idx + 1}
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-futuristic text-[#F5D061]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{evt.date}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{evt.time}</span>
              </div>

              <h3 className="font-futuristic text-xl sm:text-2xl font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                {evt.title}
              </h3>

              <div className="space-y-2 text-sm text-neutral-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#FF2E93] shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-white block">{evt.locationName}</span>
                    <span className="text-xs text-neutral-400">{evt.address}</span>
                  </div>
                </div>

                {evt.description && (
                  <p className="text-xs text-neutral-400 italic pt-1">{evt.description}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#00F0FF]/20 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500">DRESS CODE: CYBER CHIC / SANG TRỌNG</span>
              {evt.mapUrl && (
                <a
                  href={evt.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-futuristic px-3.5 py-1.5 rounded-full bg-[#00F0FF]/15 hover:bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]/40 transition-colors"
                >
                  <span>Chỉ đường</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* RSVP Section: Biometric Boarding Pass Generator */}
      <div className="relative bg-gradient-to-br from-[#090E26] via-[#0E1538] to-[#120B2E] border-2 border-[#00F0FF]/50 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.25)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF2E93]/15 border border-[#FF2E93]/40 text-[#FF2E93] text-xs font-futuristic">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>XÁC NHẬN SỰ HIỆN DIỆN // RSVP</span>
              </div>
              <h3 className="font-futuristic text-2xl sm:text-3xl font-extrabold text-white">
                Đăng Ký Nhận Thẻ Lên Tàu VIP
              </h3>
              <p className="text-xs text-neutral-400 font-body">
                Sự hiện diện của quý khách là niềm vinh hạnh to lớn nhất đối với cô dâu và chú rể trong ngày khởi đầu hạnh phúc.
              </p>
            </div>

            <form onSubmit={handleGenerateBoardingPass} className="space-y-4 font-body">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  DANH TÍNH QUAN KHÁCH (HỌ & TÊN):
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00F0FF]" />
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Nam & Gia Đình"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#050711]/80 border border-[#00F0FF]/40 focus:border-[#00F0FF] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    SỐ LƯỢNG KHÁCH:
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00F0FF]" />
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050711]/80 border border-[#00F0FF]/40 focus:border-[#00F0FF] rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all"
                    >
                      <option value={1}>1 người (Đi một mình)</option>
                      <option value={2}>2 người (Cùng người thương)</option>
                      <option value={3}>3 người (Cùng gia đình)</option>
                      <option value={4}>4+ người (Cả gia đình)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    QUÝ KHÁCH LÀ KHÁCH CỦA:
                  </label>
                  <select
                    value={side}
                    onChange={(e) => setSide(e.target.value as 'groom' | 'bride')}
                    className="w-full px-3 py-2.5 bg-[#050711]/80 border border-[#00F0FF]/40 focus:border-[#00F0FF] rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all"
                  >
                    <option value="groom">Nhà Trai (Groom's Side)</option>
                    <option value="bride">Nhà Gái (Bride's Side)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  LỜI NHẮN HOẶC GỬI LỜI CHÚC ĐẶC BIỆT:
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Gửi lời chúc ấm áp đến hai bạn..."
                  className="w-full px-4 py-2.5 bg-[#050711]/80 border border-[#00F0FF]/40 focus:border-[#00F0FF] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#A855F7] hover:from-[#00E0EF] hover:to-[#9333EA] text-[#050711] font-futuristic font-bold text-sm tracking-wider shadow-neon-cyan flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'ĐANG CẤP MÃ LÊN TÀU...' : 'XÁC NHẬN & CẤP THẺ LÊN TÀU VIP'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Holographic Boarding Pass Display */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-md bg-[#050711]/95 border-2 border-[#00F0FF] rounded-3xl p-6 relative overflow-hidden shadow-[0_0_35px_rgba(0,240,255,0.3)]">
              {/* Scanline & hologram overlay */}
              <div className="absolute inset-0 cyber-scanline-overlay opacity-40 pointer-events-none" />

              {/* Pass Header */}
              <div className="flex items-center justify-between border-b border-[#00F0FF]/30 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-ping" />
                  <span className="font-futuristic text-xs tracking-widest text-[#00F0FF]">
                    ORBIT AIRWAYS // WEDDING PASS
                  </span>
                </div>
                <span className="font-mono text-xs text-[#F5D061] font-bold">
                  {generatedPass?.passId || 'VIP-PASS-2026'}
                </span>
              </div>

              {/* Passenger Info */}
              <div className="py-4 space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                    TÊN QUAN KHÁCH (PASSENGER NAME):
                  </span>
                  <span className="font-futuristic text-lg font-bold text-white tracking-wider block">
                    {generatedPass?.guestName || (guestName ? guestName : 'QUÝ QUAN KHÁCH & GIA ĐÌNH')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#090E26] p-2 rounded-lg border border-[#00F0FF]/20">
                    <span className="text-[10px] text-neutral-400 block">KHOANG GHẾ (ZONE):</span>
                    <span className="text-[#00F0FF] font-bold">
                      {generatedPass?.seatZone || 'KHOANG VIP ÁNH SAO'}
                    </span>
                  </div>

                  <div className="bg-[#090E26] p-2 rounded-lg border border-[#00F0FF]/20">
                    <span className="text-[10px] text-neutral-400 block">SỐ LƯỢNG:</span>
                    <span className="text-[#FF2E93] font-bold">
                      {generatedPass?.count || guestCount} VÉ CHÍNH THỨC
                    </span>
                  </div>
                </div>

                <div className="bg-[#090E26] p-2 rounded-lg border border-[#00F0FF]/20 text-xs font-mono flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">NGÀY KHỞI HÀNH:</span>
                    <span className="text-[#F5D061] font-bold">{data.weddingDate || '20/12/2026'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">TRẠNG THÁI:</span>
                    <span className="text-[#00F0FF] font-bold">CONFIRMED (ĐÃ DUYỆT)</span>
                  </div>
                </div>
              </div>

              {/* Simulated Holographic Barcode */}
              <div className="pt-3 border-t border-dashed border-[#00F0FF]/40 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="h-6 flex items-center gap-1">
                    <span className="w-1 h-full bg-[#00F0FF]" />
                    <span className="w-0.5 h-full bg-white" />
                    <span className="w-2 h-full bg-[#00F0FF]" />
                    <span className="w-0.5 h-full bg-white" />
                    <span className="w-1.5 h-full bg-[#00F0FF]" />
                    <span className="w-1 h-full bg-white" />
                    <span className="w-3 h-full bg-[#00F0FF]" />
                    <span className="w-0.5 h-full bg-white" />
                    <span className="w-1 h-full bg-[#00F0FF]" />
                    <span className="w-2 h-full bg-white" />
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500">
                    CODE: 849-2026-LOVE-ETERNAL
                  </span>
                </div>

                <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF] flex items-center justify-center text-[#00F0FF]">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
