import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle, Heart, Send, Users, User, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { submitRSVP } from '../../services/rsvpService';
import { useToast } from '../ui/Toast';
import { getGuestInfoFromUrl } from '../../lib/guestPersonalization';

interface RSVPSectionProps {
  weddingId: string;
  groomName: string;
  brideName: string;
}

export function RSVPSection({ weddingId, groomName, brideName }: RSVPSectionProps) {
  const { showToast } = useToast();
  const guestInfo = React.useMemo(() => getGuestInfoFromUrl(), []);
  const [fullName, setFullName] = useState(() => guestInfo.rsvpPrefill || '');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<boolean>(true);
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [guestOf, setGuestOf] = useState<'groom' | 'bride' | 'both'>('both');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (guestInfo.rsvpPrefill && !fullName) {
      setFullName(guestInfo.rsvpPrefill);
    }
  }, [guestInfo.rsvpPrefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Vui lòng nhập họ và tên của bạn', 'error');
      return;
    }
    if (!phone.trim()) {
      showToast('Vui lòng nhập số điện thoại để chúng mình liên hệ', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRSVP({
        weddingId,
        fullName: fullName.trim(),
        phone: phone.trim(),
        attending,
        guestsCount: attending ? guestsCount : 0,
        guestOf,
        message: message.trim(),
      });

      if (attending) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#E5C058', '#4ADE80', '#FFF'],
          });
        } catch {
          // ignore
        }
      }

      setSubmitted(true);
      showToast('Cảm ơn bạn đã xác nhận tham dự!', 'success');
    } catch (err) {
      console.error('RSVP submit error:', err);
      showToast('Có lỗi xảy ra khi gửi xác nhận, vui lòng thử lại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    setMessage('');
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16"
      >
        <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] mb-1">
          Xác Nhận Tham Dự
        </p>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C2A29] tracking-wide uppercase">
          Will You Attend?
        </h2>
        <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
        <p className="mt-4 text-sm font-body text-neutral-600 max-w-md mx-auto">
          Để chuẩn bị chu đáo nhất cho ngày chung đôi, xin vui lòng gửi xác nhận trước ngày <strong>10/12/2026</strong>.
        </p>
      </motion.div>

      {/* Main Form or Success Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFDF9] text-[#2C2A29] border-2 border-[#D4AF37]/40 shadow-2xl relative">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="rsvp-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSubmit}
              className="space-y-6 text-left font-body"
            >
              {/* Personalized Guest Welcome Hint */}
              {guestInfo.hasGuest && (
                <div className="p-3.5 rounded-2xl bg-[#FAF3E0] border border-[#D4AF37]/50 flex items-center gap-3 text-xs text-[#8C7335] shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center shrink-0 text-[#B38F26]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      Kính gửi {guestInfo.cleanName}
                    </p>
                    <p className="text-[11px] text-neutral-600">
                      Tên bạn đã được tự động điền sẵn. Chỉ cần 1 cú chạm để xác nhận số người tham dự.
                    </p>
                  </div>
                </div>
              )}

              {/* Attendance Choice */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-3">
                  Bạn sẽ tham dự chứ? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      attending
                        ? 'border-[#D4AF37] bg-[#FAF3E0] text-[#8C7335] shadow-sm'
                        : 'border-neutral-300 bg-white hover:border-neutral-400 text-neutral-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${attending ? 'fill-current text-[#D4AF37]' : ''}`} />
                    <span>Chắc chắn tham dự</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      !attending
                        ? 'border-neutral-500 bg-neutral-200 text-neutral-900 shadow-sm'
                        : 'border-neutral-300 bg-white hover:border-neutral-400 text-neutral-700'
                    }`}
                  >
                    <span>Rất tiếc không thể đến</span>
                  </button>
                </div>
              </div>

              {/* Guest of Groom/Bride */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-2">
                  Khách mời của ai?
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setGuestOf('groom')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-bold text-center transition-all cursor-pointer ${
                      guestOf === 'groom'
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-sm'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Nhà Trai ({groomName})
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestOf('bride')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-bold text-center transition-all cursor-pointer ${
                      guestOf === 'bride'
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-sm'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Nhà Gái ({brideName})
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestOf('both')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-bold text-center transition-all cursor-pointer ${
                      guestOf === 'both'
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-white shadow-sm'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Cả hai bạn
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-1.5">
                  Họ và tên của bạn *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-medium bg-white text-slate-900 placeholder:text-slate-500 shadow-inner"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-1.5">
                  Số điện thoại liên hệ *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0905 123 456"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-medium bg-white text-slate-900 placeholder:text-slate-500 shadow-inner"
                  />
                </div>
              </div>

              {/* Guests Count (Only if attending) */}
              {attending && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-1.5">
                    Số người cùng tham dự
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(parseInt(e.target.value, 10))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-medium bg-white text-slate-900 shadow-inner"
                      >
                        <option value={1} className="bg-white text-slate-900">1 người (Chỉ mình tôi)</option>
                        <option value={2} className="bg-white text-slate-900">2 người (Đi cùng người thương)</option>
                        <option value={3} className="bg-white text-slate-900">3 người (Đi cùng gia đình)</option>
                        <option value={4} className="bg-white text-slate-900">4 người (Gia đình 4 người)</option>
                        <option value={5} className="bg-white text-slate-900">5 người</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-1.5">
                  Lời nhắn gửi đến đôi uyên ương
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gửi gắm điều bạn muốn nhắn nhủ..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-medium bg-white text-slate-900 placeholder:text-slate-500 shadow-inner resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-rsvp-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C058] to-[#D4AF37] text-[#1C1A17] font-body text-sm font-semibold tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Đang gửi xác nhận...</span>
                ) : (
                  <>
                    <span>Xác nhận tham dự</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="rsvp-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4 flex items-center justify-center border-2 border-emerald-300">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h3 className="font-serif-title text-2xl sm:text-3xl font-medium text-[#2C2A29] mb-2">
                Cảm ơn bạn đã xác nhận!
              </h3>

              <p className="text-sm font-body text-neutral-600 max-w-sm mx-auto mb-6 leading-relaxed">
                {attending
                  ? `Sự hiện diện của ${fullName} là niềm vinh hạnh to lớn đối với chúng mình. Rất mong được đón tiếp bạn vào ngày 20/12/2026!`
                  : `Cảm ơn ${fullName} đã gửi lời chúc. Dù rất tiếc không thể gặp bạn, chúng mình luôn trân trọng tình cảm của bạn!`}
              </p>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full text-xs font-body font-medium text-[#8C7335] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 transition-colors"
              >
                Gửi phản hồi khác
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
