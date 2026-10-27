import React, { useState, useEffect, useMemo } from 'react';
import { Mail, CheckCircle2, Sparkles, Send, Users, Heart } from 'lucide-react';
import { playMoonlightChime } from './MoonLotusOrnaments';
import { getGuestInfoFromUrl } from '../../../../lib/guestPersonalization';

interface MoonLotusRSVPSectionProps {
  groomName?: string;
  brideName?: string;
  onRSVPSubmit?: (data: {
    name: string;
    phone: string;
    attendance: 'yes' | 'no' | 'maybe';
    guestCount: number;
    wishes: string;
  }) => void;
}

export function MoonLotusRSVPSection({
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
  onRSVPSubmit,
}: MoonLotusRSVPSectionProps) {
  const guestInfo = useMemo(() => getGuestInfoFromUrl(), []);
  const [form, setForm] = useState({
    name: guestInfo.rsvpPrefill || '',
    phone: '',
    attendance: 'yes' as 'yes' | 'no' | 'maybe',
    guestCount: 1,
    wishes: '',
  });

  useEffect(() => {
    if (guestInfo.rsvpPrefill) {
      setForm((prev) => ({ ...prev, name: prev.name || guestInfo.rsvpPrefill }));
    }
  }, [guestInfo.rsvpPrefill]);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (onRSVPSubmit) {
      onRSVPSubmit(form);
    }
    playMoonlightChime();
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="relative py-20 px-4 sm:px-6 z-20">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5 text-[#EBD494]" />
            <span>Xác Nhận Tham Dự</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#FFFDF7]">
            Sự Hiện Diện Của Bạn
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#F4E4BA]/80 leading-relaxed">
            “Để chúng mình chuẩn bị chu đáo nhất cho dạ yến dưới ánh trăng, xin vui lòng gửi phản hồi trước ngày 10.12.2026.”
          </p>
        </div>

        {/* RSVP Card */}
        <div className="rounded-3xl p-6 sm:p-10 bg-[#0E122A]/90 border border-[#EBD494]/40 shadow-2xl backdrop-blur-md">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#EBD494]/20 border border-[#EBD494] text-[#EBD494] flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif-title font-bold text-[#FFFDF7]">
                Cảm Ơn Bạn Rất Nhiều!
              </h3>
              <p className="font-serif text-sm text-[#F4E4BA]/90 max-w-md mx-auto leading-relaxed">
                {groomName} &amp; {brideName} đã nhận được phản hồi của bạn. Hẹn gặp bạn dưới ánh trăng rạng rỡ của ngày chung đôi!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="cursor-pointer text-xs font-serif text-[#EBD494] underline hover:text-[#FFFDF7] transition-colors"
              >
                Gửi phản hồi khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-serif text-xs sm:text-sm">
              {guestInfo.hasGuest && (
                <div className="p-3.5 rounded-2xl bg-[#751A29]/40 border border-[#EBD494]/50 flex items-center gap-2.5 text-xs text-[#F4E4BA] shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#EBD494] shrink-0 animate-pulse" />
                  <span>
                    Kính chào <strong>{guestInfo.displayName}</strong>! Tên của bạn đã được điền sẵn, chạm 1 chạm để xác nhận.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-[#F4E4BA] mb-2 font-semibold tracking-wide">
                  Họ và tên của bạn *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Anh Tuấn"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#141A36] border border-[#EBD494]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#EBD494] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#F4E4BA] mb-2 font-semibold tracking-wide">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#141A36] border border-[#EBD494]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#EBD494] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#F4E4BA] mb-2 font-semibold tracking-wide">
                  Bạn có thể tham dự chứ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, attendance: 'yes' })}
                    className={`cursor-pointer py-3 px-4 rounded-2xl border text-center transition-all ${
                      form.attendance === 'yes'
                        ? 'bg-[#751A29] border-[#EBD494] text-white font-bold shadow-md'
                        : 'bg-[#141A36] border-[#EBD494]/20 text-neutral-300 hover:border-[#EBD494]/50'
                    }`}
                  >
                    Chắc chắn tham dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, attendance: 'no' })}
                    className={`cursor-pointer py-3 px-4 rounded-2xl border text-center transition-all ${
                      form.attendance === 'no'
                        ? 'bg-[#2A1138] border-[#EBD494] text-white font-bold shadow-md'
                        : 'bg-[#141A36] border-[#EBD494]/20 text-neutral-300 hover:border-[#EBD494]/50'
                    }`}
                  >
                    Rất tiếc vắng mặt
                  </button>
                </div>
              </div>

              {form.attendance === 'yes' && (
                <div>
                  <label className="block text-[#F4E4BA] mb-2 font-semibold tracking-wide">
                    Số lượng người tham dự
                  </label>
                  <select
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#141A36] border border-[#EBD494]/30 text-white focus:outline-none focus:border-[#EBD494]"
                  >
                    <option value={1}>1 người (Chỉ mình tôi)</option>
                    <option value={2}>2 người (Cùng người thương)</option>
                    <option value={3}>3 người (Gia đình)</option>
                    <option value={4}>4 người (Gia đình)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[#F4E4BA] mb-2 font-semibold tracking-wide">
                  Lời chúc gửi đến cô dâu &amp; chú rể
                </label>
                <textarea
                  rows={3}
                  placeholder="Gửi lời chúc phúc ngọt ngào..."
                  value={form.wishes}
                  onChange={(e) => setForm({ ...form, wishes: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#141A36] border border-[#EBD494]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#EBD494] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full py-3.5 rounded-full bg-gradient-to-r from-[#751A29] via-[#A8283D] to-[#681423] hover:from-[#8C2033] hover:to-[#7E1A2D] text-white font-serif font-bold uppercase tracking-wider text-xs shadow-lg border border-[#EBD494]/60 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#F4E4BA]" />
                <span>Gửi Xác Nhận Tham Dự</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
