import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PassportStamp } from './PassportOrnaments';
import { Ticket, Send, CheckCircle2, User, Phone, Users, MessageSquare, Sparkles } from 'lucide-react';
import { getGuestInfoFromUrl } from '../../../../lib/guestPersonalization';

interface PassportRSVPSectionProps {
  weddingId?: string;
  onRSVPSubmit?: (data: {
    name: string;
    phone: string;
    attending: boolean;
    guestCount: number;
    message?: string;
  }) => Promise<void> | void;
}

export function PassportRSVPSection({
  weddingId,
  onRSVPSubmit,
}: PassportRSVPSectionProps) {
  const guestInfo = useMemo(() => getGuestInfoFromUrl(), []);
  const [fullName, setFullName] = useState(() => guestInfo.rsvpPrefill || '');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (guestInfo.rsvpPrefill) {
      setFullName((prev) => prev || guestInfo.rsvpPrefill);
    }
  }, [guestInfo.rsvpPrefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên của quý khách.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      if (onRSVPSubmit) {
        await onRSVPSubmit({
          name: fullName.trim(),
          phone: phone.trim(),
          attending: attending === 'yes',
          guestCount: attending === 'yes' ? guestCount : 0,
          message: message.trim(),
        });
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra sự cố khi gửi xác nhận. Quý khách vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#651F2A]/10 border border-[#651F2A]/25 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Ticket className="w-3.5 h-3.5 text-[#B99552]" />
            <span>FLIGHT RESERVATION</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            YOUR TICKET IS WAITING
          </h2>

          <p className="font-serif-title italic text-base sm:text-lg text-[#172A3A]">
            Xác nhận tham dự để chúng mình chu toàn đón tiếp quý khách
          </p>
        </div>

        {/* RSVP Card / Booking Form */}
        <div className="relative bg-[#FCFAF5] rounded-3xl p-6 sm:p-10 border-2 border-[#B99552]/40 shadow-2xl overflow-hidden">
          {/* Top Boarding Pass Trim */}
          <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#651F2A] via-[#B99552] to-[#172A3A]" />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 pt-2"
              >
                {/* Personalized Passenger Badge */}
                {guestInfo.hasGuest && (
                  <div className="p-3.5 rounded-2xl bg-[#F5EEDF] border border-[#B99552] flex items-center gap-3 text-xs text-[#172A3A] shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-[#651F2A] text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#B99552]" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-xs uppercase text-[#651F2A]">
                        HÀNH KHÁCH DANH DỰ: {guestInfo.cleanName}
                      </p>
                      <p className="text-[11px] text-[#41372F] font-sans">
                        Tên của bạn đã được xuất vé tự động. Vui lòng xác nhận để hoàn tất thủ tục lên chuyến bay hạnh phúc!
                      </p>
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#172A3A] uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#651F2A]" />
                    <span>HỌ VÀ TÊN QUÝ KHÁCH (PASSENGER NAME) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#B99552]/30 focus:border-[#651F2A] focus:outline-hidden font-sans text-sm text-[#172A3A] shadow-xs"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#172A3A] uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#651F2A]" />
                    <span>SỐ ĐIỆN THOẠI LIÊN HỆ (PHONE NUMBER)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912 345 678"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#B99552]/30 focus:border-[#651F2A] focus:outline-hidden font-sans text-sm text-[#172A3A] shadow-xs"
                  />
                </div>

                {/* Attendance Status */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-[#172A3A] uppercase tracking-wider block">
                    XÁC NHẬN THAM DỰ (FLIGHT CONFIRMATION) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                    <button
                      type="button"
                      onClick={() => setAttending('yes')}
                      className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        attending === 'yes'
                          ? 'bg-[#651F2A] border-[#651F2A] text-white shadow-md'
                          : 'bg-white border-[#B99552]/30 text-[#41372F] hover:bg-[#F5EEDF]/40'
                      }`}
                    >
                      <span>✓ Chắc chắn tham dự</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttending('no')}
                      className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        attending === 'no'
                          ? 'bg-[#172A3A] border-[#172A3A] text-white shadow-md'
                          : 'bg-white border-[#B99552]/30 text-[#41372F] hover:bg-[#F5EEDF]/40'
                      }`}
                    >
                      <span>✕ Rất tiếc không thể đến</span>
                    </button>
                  </div>
                </div>

                {/* Guest Count (if attending) */}
                {attending === 'yes' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-[#172A3A] uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#651F2A]" />
                      <span>SỐ LƯỢNG NGƯỜI ĐI CÙNG (GUEST COUNT)</span>
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#B99552]/30 focus:border-[#651F2A] focus:outline-hidden font-sans text-sm text-[#172A3A] shadow-xs"
                    >
                      <option value={1}>Đi một mình (1 người)</option>
                      <option value={2}>Đi cùng người thương / Bạn (2 người)</option>
                      <option value={3}>Gia đình (3 người)</option>
                      <option value={4}>Gia đình (4 người)</option>
                    </select>
                  </div>
                )}

                {/* Message / Wishes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#172A3A] uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#651F2A]" />
                    <span>LỜI CHÚC GỬI ĐẾN CẶP ĐÔI (WISHES FOR COUPLE)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gửi lời chúc phúc chân thành đến chuyến bay tình yêu của hai bạn..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#B99552]/30 focus:border-[#651F2A] focus:outline-hidden font-sans text-sm text-[#172A3A] shadow-xs resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-mono text-red-600 font-semibold text-center">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#651F2A] via-[#8E2835] to-[#651F2A] hover:brightness-110 text-white font-sans text-sm font-bold tracking-[0.2em] uppercase shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'ĐANG GỬI XÁC NHẬN...' : 'XÁC NHẬN ĐẶT CHỖ (CONFIRM TICKET)'}
                  </span>
                </button>
              </motion.form>
            ) : (
              /* Success State: Ticket Confirmed with Red Stamp */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-6 relative"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#172A3A] uppercase tracking-wider">
                    TICKET CONFIRMED
                  </h3>
                  <p className="font-serif-title italic text-base text-[#651F2A]">
                    Cảm ơn quý khách đã xác nhận tham gia chuyến bay tình yêu cùng chúng mình!
                  </p>
                  <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
                    Thông tin đặt chỗ của quý khách đã được lưu vào danh sách hành khách danh dự.
                  </p>
                </div>

                {/* Animated Stamp Slamming onto Confirmation Card */}
                <div className="pt-4">
                  <motion.div
                    initial={{ scale: 1.8, opacity: 0, rotate: 20 }}
                    animate={{ scale: 1, opacity: 0.95, rotate: -6 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-block"
                  >
                    <PassportStamp
                      text="TICKET CONFIRMED"
                      subtext="SEAT RESERVED"
                      variant="red"
                      size="md"
                    />
                  </motion.div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-mono text-[#B99552] underline hover:text-[#651F2A] transition-colors"
                  >
                    Cập nhật lại thông tin xác nhận
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
