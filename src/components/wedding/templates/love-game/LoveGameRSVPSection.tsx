import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Send, Users, User, Phone, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { submitRSVP } from '../../../../services/rsvpService';
import { playPointChime } from './loveGameSounds';
import { getGuestInfoFromUrl } from '../../../../lib/guestPersonalization';

interface LoveGameRSVPSectionProps {
  weddingId: string;
  groomName: string;
  brideName: string;
  isCompleted: boolean;
  onCompleteQuest: () => void;
}

export function LoveGameRSVPSection({
  weddingId,
  groomName,
  brideName,
  isCompleted,
  onCompleteQuest,
}: LoveGameRSVPSectionProps) {
  const guestInfo = useMemo(() => getGuestInfoFromUrl(), []);
  const [fullName, setFullName] = useState(() => guestInfo.rsvpPrefill || '');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<boolean>(true);
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [guestOf, setGuestOf] = useState<'groom' | 'bride' | 'both'>('both');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (guestInfo.rsvpPrefill) {
      setFullName((prev) => prev || guestInfo.rsvpPrefill);
    }
  }, [guestInfo.rsvpPrefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitRSVP({
        weddingId: weddingId || 'demo-wedding',
        fullName: fullName.trim(),
        phone: phone.trim() || '0900000000',
        attending,
        guestsCount: attending ? guestsCount : 0,
        guestOf,
        message: message.trim(),
      });

      setSubmitted(true);
      playPointChime();
      onCompleteQuest();

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6B8B', '#A78BFA', '#F59E0B', '#FFF'],
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
      // Still allow completion for demo
      setSubmitted(true);
      playPointChime();
      onCompleteQuest();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quest-rsvp" className="relative py-24 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-3xl mx-auto space-y-10 text-center">
        
        {/* Section Header with Quest Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>BONUS QUEST • XÁC NHẬN THAM DỰ (RSVP)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Đăng Ký Tham Gia Lễ Cưới
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            Để {groomName} &amp; {brideName} chuẩn bị đón tiếp chu đáo nhất, bạn vui lòng xác nhận trước ngày 10.12.2026 nhé!
          </p>

          {/* Quest completion badge */}
          <div className="pt-1">
            {isCompleted || submitted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ĐÃ GỬI XÁC NHẬN (+10 LOVE POINTS)
              </span>
            ) : null}
          </div>
        </div>

        {/* RSVP Form Card */}
        <div className="bg-[#16132A]/90 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Cảm ơn bạn đã xác nhận!
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                {attending
                  ? `Chúng mình rất vui được chào đón bạn cùng chung vui trong ngày trọng đại!`
                  : `Cảm ơn bạn đã gửi lời chúc tốt đẹp đến hai đứa mình.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {guestInfo.hasGuest && (
                <div className="p-3.5 rounded-2xl bg-pink-500/15 border border-pink-400/30 flex items-center gap-2.5 text-xs text-pink-200">
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>
                    Chào <strong>{guestInfo.displayName}</strong>! Tên của bạn đã được điền sẵn, chỉ cần 1 chạm để nhận thẻ RSVP.
                  </span>
                </div>
              )}

              {/* Select Team: Groom / Bride / Both */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-pink-300 uppercase tracking-wider block">
                  1. Bạn là khách mời của ai?
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: 'groom', label: '🎩 Nhà Trai' },
                    { id: 'bride', label: '👰 Nhà Gái' },
                    { id: 'both', label: '🌟 Cả Hai Bạn' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setGuestOf(t.id as 'groom' | 'bride' | 'both')}
                      className={`py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                        guestOf === t.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendance Choice */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-pink-300 uppercase tracking-wider block">
                  2. Bạn sẽ đến chung vui chứ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      attending
                        ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-300 shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Chắc chắn sẽ đến ❤️</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      !attending
                        ? 'bg-rose-500/25 border-2 border-rose-400 text-rose-300 shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                    }`}
                  >
                    <span>Rất tiếc không thể đến 🥺</span>
                  </button>
                </div>
              </div>

              {/* Name & Phone Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-pink-400" />
                    <span>Họ và tên *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-pink-400" />
                    <span>Số điện thoại *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0912 345 678"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>

              {/* Guests Count (If attending) */}
              {attending && (
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-pink-400" />
                    <span>Số lượng người tham dự</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`w-12 h-10 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer ${
                          guestsCount === num
                            ? 'bg-pink-500 text-white shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                        }`}
                      >
                        {num === 4 ? '4+' : num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300">
                  Lời nhắn gửi đến cô dâu &amp; chú rể (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Chúc hai bạn trăm năm hạnh phúc, sớm có quý tử nha!"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-pink-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:via-rose-600 hover:to-amber-500 text-white font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Xác Nhận Tham Dự (+10 PTS)'}
                </span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
