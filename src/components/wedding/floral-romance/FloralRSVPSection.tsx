import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { submitRSVP } from '../../../services/rsvpService';
import { FloralDivider } from './FloralOrnaments';
import { useToast } from '../../ui/Toast';
import { Send, CheckCircle2, Heart, User, Phone, Users, Sparkles } from 'lucide-react';
import { getGuestInfoFromUrl } from '../../../lib/guestPersonalization';

interface FloralRSVPSectionProps {
  weddingId: string;
}

export function FloralRSVPSection({ weddingId }: FloralRSVPSectionProps) {
  const { showToast } = useToast();
  const guestInfo = useMemo(() => getGuestInfoFromUrl(), []);
  const [fullName, setFullName] = useState(() => guestInfo.rsvpPrefill || '');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestsCount, setGuestsCount] = useState(1);
  const [guestOf, setGuestOf] = useState<'groom' | 'bride' | 'both'>('both');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (guestInfo.rsvpPrefill) {
      setFullName((prev) => prev || guestInfo.rsvpPrefill);
    }
  }, [guestInfo.rsvpPrefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Vui lòng nhập họ và tên quý khách', 'warning');
      return;
    }
    if (!phone.trim()) {
      showToast('Vui lòng nhập số điện thoại', 'warning');
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

      setIsSubmitted(true);
      showToast('Cảm ơn bạn đã xác nhận tham dự!', 'success');
    } catch (err) {
      showToast('Có lỗi xảy ra, vui lòng thử lại sau', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-20 sm:py-28 bg-[#FDF8F5] overflow-hidden">
      {/* Background Soft Pastel Pink and Champagne Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-r from-[#FDECEF]/60 via-[#F8E7EA]/50 to-[#F6EDE0]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-semibold font-body">
            PLEASE RESPOND
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#3E2E31] font-normal italic">
            Xác Nhận Tham Dự
          </h2>
          <FloralDivider className="w-48 mx-auto my-3" />
          <p className="text-sm font-body text-[#7A696B] max-w-md mx-auto leading-relaxed">
            Để gia đình đón tiếp quý khách một cách chu đáo và trọn vẹn nhất, xin vui lòng gửi phản hồi trước ngày hôn lễ.
          </p>
        </motion.div>

        {/* RSVP Card Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-12 relative bg-white/95 backdrop-blur-md rounded-3xl p-7 sm:p-10 border border-[#F2DCDD] shadow-lg"
        >
          {/* Corner Fine Gold Accents */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#D4AF37]/50" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#D4AF37]/50" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#D4AF37]/50" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#D4AF37]/50" />

          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FCE4EC] text-[#D97D8A] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-title text-2xl text-[#3E2E31]">
                Đã Nhận Được Phản Hồi!
              </h3>
              <p className="text-sm text-[#7A696B] font-body max-w-sm mx-auto">
                Chân thành cảm ơn quý khách. Chúng mình rất mong chờ được hội ngộ và chung vui cùng bạn!
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-xs font-semibold text-[#D97D8A] hover:underline font-body cursor-pointer"
              >
                Gửi phản hồi khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-body text-sm">
              {/* Personalized Guest Welcome Hint */}
              {guestInfo.hasGuest && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FDECEF] to-[#FFF8F9] border border-[#F4B8C5] flex items-center gap-3 text-xs text-[#8C2343] shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#FCE4EC] text-[#D97D8A] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#3E2E31]">
                      Kính gửi {guestInfo.cleanName}
                    </p>
                    <p className="text-[11px] text-[#7A696B]">
                      Tên của bạn đã được điền sẵn. Vui lòng chọn số người tham dự để chúng mình chuẩn bị chu đáo nhất.
                    </p>
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold tracking-wider text-[#5A4549] uppercase">
                  Họ và tên của bạn <span className="text-[#D97D8A]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#C9A86A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Minh Tuấn"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#F2DCDD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-[#3E2E31] placeholder-[#BAA7A9] transition-all bg-[#FFFCFA]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold tracking-wider text-[#5A4549] uppercase">
                  Số điện thoại <span className="text-[#D97D8A]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#C9A86A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#F2DCDD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-[#3E2E31] placeholder-[#BAA7A9] transition-all bg-[#FFFCFA]"
                  />
                </div>
              </div>

              {/* Attendance Radio */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-wider text-[#5A4549] uppercase">
                  Bạn sẽ tham dự chứ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      attending
                        ? 'bg-[#D97D8A] text-white border-[#D97D8A] shadow-md'
                        : 'bg-white text-[#7A696B] border-[#F2DCDD] hover:bg-[#FDF0F3]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sẽ tham dự</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      !attending
                        ? 'bg-[#A8888D] text-white border-[#A8888D] shadow-md'
                        : 'bg-white text-[#7A696B] border-[#F2DCDD] hover:bg-[#FDF0F3]'
                    }`}
                  >
                    <span>Rất tiếc không thể</span>
                  </button>
                </div>
              </div>

              {attending && (
                <>
                  {/* Guests count */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold tracking-wider text-[#5A4549] uppercase">
                      Số người tham dự
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-[#C9A86A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#F2DCDD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-[#3E2E31] transition-all bg-[#FFFCFA]"
                      >
                        <option value={1}>1 người (Tôi đi một mình)</option>
                        <option value={2}>2 người (Tôi và người thương)</option>
                        <option value={3}>3 người</option>
                        <option value={4}>4 người (Gia đình)</option>
                        <option value={5}>5+ người</option>
                      </select>
                    </div>
                  </div>

                  {/* Guest of */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold tracking-wider text-[#5A4549] uppercase">
                      Bạn là khách của
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'groom', label: 'Nhà Trai' },
                        { id: 'bride', label: 'Nhà Gái' },
                        { id: 'both', label: 'Cả Hai' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setGuestOf(item.id as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            guestOf === item.id
                              ? 'bg-[#FCE4EC] text-[#D97D8A] border-[#D97D8A]'
                              : 'bg-white text-[#7A696B] border-[#F2DCDD] hover:bg-[#FDF6F7]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold tracking-wider text-[#5A4549] uppercase">
                  Lời nhắn gửi đến cô dâu & chú rể
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Gửi lời chúc hoặc lưu ý đặc biệt cho chúng mình..."
                  className="w-full p-3.5 rounded-xl border border-[#F2DCDD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-[#3E2E31] placeholder-[#BAA7A9] transition-all bg-[#FFFCFA] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D97D8A] to-[#E29578] hover:from-[#C96B78] hover:to-[#D08467] text-white text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'ĐANG GỬI XÁC NHẬN...' : 'GỬI XÁC NHẬN THAM DỰ'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
