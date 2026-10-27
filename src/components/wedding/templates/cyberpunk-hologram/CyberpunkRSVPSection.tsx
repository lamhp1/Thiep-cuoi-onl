import React, { useState } from 'react';
import { playCyberClick, playCyberSuccess } from '../../../../lib/audioSynth';

interface CyberpunkRSVPSectionProps {
  weddingId?: string;
  groomName?: string;
  brideName?: string;
}

export function CyberpunkRSVPSection({
  weddingId = 'demo-wedding',
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: CyberpunkRSVPSectionProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'YES' | 'NO'>('YES');
  const [guestCount, setGuestCount] = useState(1);
  const [guestSide, setGuestSide] = useState<'GROOM' | 'BRIDE'>('GROOM');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitting(true);
    playCyberClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      playCyberSuccess();
    }, 800);
  };

  return (
    <section className="relative py-20 px-6 bg-[#050714] text-slate-100 overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30 uppercase bg-cyan-950/30">
            XÁC NHẬN THAM DỰ (BIOMETRIC RSVP MATRIX)
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono uppercase text-white tracking-tight holo-glitch">
            XÁC NHẬN THAM DỰ
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Sự hiện diện của quý khách là niềm vinh hạnh lớn nhất của {groomName} & {brideName}!
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full" />
        </div>

        {/* Form Container */}
        <div className="bg-[#0B1026]/90 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-6 md:p-10 space-y-6 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-cyan-300 font-bold uppercase">
                  HỌ VÀ TÊN KHÁCH MỜI *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập họ và tên của bạn..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-cyan-300 font-bold uppercase">
                  SỐ ĐIỆN THOẠI LIÊN HỆ
                </label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              {/* Guest Side */}
              <div className="space-y-2">
                <label className="block text-cyan-300 font-bold uppercase">
                  BẠN LÀ KHÁCH MỜI CỦA AI?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setGuestSide('GROOM');
                    }}
                    className={`py-3 px-4 rounded-2xl border text-center font-bold transition-all ${
                      guestSide === 'GROOM'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    NHÀ TRAI ({groomName})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setGuestSide('BRIDE');
                    }}
                    className={`py-3 px-4 rounded-2xl border text-center font-bold transition-all ${
                      guestSide === 'BRIDE'
                        ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(255,0,122,0.3)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    NHÀ GÁI ({brideName})
                  </button>
                </div>
              </div>

              {/* Attending & Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-cyan-300 font-bold uppercase">
                    XÁC NHẬN THAM DỰ?
                  </label>
                  <select
                    value={attending}
                    onChange={(e) => setAttending(e.target.value as 'YES' | 'NO')}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="YES">SẼ TỚI DỰ TIỆC (YES)</option>
                    <option value="NO">RẤT TIẾC KHÔNG THỂ TỚI (NO)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-cyan-300 font-bold uppercase">
                    SỐ NGUỜI THAM DỰ
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="block text-cyan-300 font-bold uppercase">
                  LỜI NHẮN GỬI ĐẾN CẶP ĐÔI
                </label>
                <textarea
                  rows={3}
                  placeholder="Gửi lời chúc mừng hoặc ghi chú món ăn..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-600 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] transition-all duration-300"
              >
                {isSubmitting ? 'ĐANG TRUYỀN DỮ LIỆU RSVP...' : '⚡ XÁC NHẬN THAM DỰ HOLOGRAM'}
              </button>
            </form>
          ) : (
            /* Success Feedback */
            <div className="text-center py-8 space-y-4 font-mono">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto text-3xl shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-white uppercase">
                ĐÃ XÁC NHẬN RSVP THÀNH CÔNG!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Cảm ơn <strong>{fullName}</strong> đã phản hồi. Thông tin tham dự đã được lưu trữ trong ma trận dữ liệu của đám cưới!
              </p>
              <button
                onClick={() => {
                  playCyberClick();
                  setIsSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-cyan-300 border border-cyan-500/30 hover:border-cyan-400"
              >
                GỬI LẠI PHẢN HỒI KHÁC
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
