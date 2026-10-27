import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Users, Check, Heart, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { TravelPlaneIcon } from './LoveMapOrnaments';
import { getGuestInfoFromUrl } from '../../../../lib/guestPersonalization';

interface LoveMapRSVPSectionProps {
  onSubmitRSVP: (data: {
    name: string;
    phone: string;
    attending: boolean;
    guestCount: number;
    message?: string;
  }) => Promise<void>;
  weddingDate?: string;
}

export function LoveMapRSVPSection({
  onSubmitRSVP,
  weddingDate = '20.12.2026',
}: LoveMapRSVPSectionProps) {
  const guestInfo = useMemo(() => getGuestInfoFromUrl(), []);
  const [formData, setFormData] = useState({
    name: guestInfo.rsvpPrefill || '',
    phone: '',
    attending: true,
    guestCount: 1,
    message: '',
  });

  useEffect(() => {
    if (guestInfo.rsvpPrefill) {
      setFormData((prev) => ({ ...prev, name: prev.name || guestInfo.rsvpPrefill }));
    }
  }, [guestInfo.rsvpPrefill]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Vui lòng điền họ tên và số điện thoại');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await onSubmitRSVP({
        name: formData.name,
        phone: formData.phone,
        attending: formData.attending,
        guestCount: formData.attending ? formData.guestCount : 0,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Đã có lỗi xảy ra. Quý khách vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="relative py-20 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      <div className="relative z-20 max-w-3xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#722238]">
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>JOURNEY RESERVATION</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#443B35]">
            WILL YOU JOIN OUR JOURNEY?
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/80 font-body leading-relaxed">
            Sự có mặt của quý khách sẽ là niềm hạnh phúc lớn nhất của chúng mình trên chặng đường này.
          </p>
        </div>

        {/* RSVP Card styled like an Elegant Travel Reservation Ticket */}
        <div className="relative bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#B9985A]/45 shadow-2xl overflow-hidden">
          {/* Top Boarding Tag */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#B9985A]/25 text-xs text-[#722238] font-bold tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <TravelPlaneIcon className="w-4 h-4 text-[#722238]" />
              XÁC NHẬN ĐỒNG HÀNH
            </span>
            <span className="text-[#B9985A] font-serif">{weddingDate}</span>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              /* Success State with CONFIRMED Stamp animation */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 text-center space-y-6"
              >
                {/* Stamp animation */}
                <motion.div
                  initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
                  animate={{ scale: 1, opacity: 1, rotate: -8 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-44 h-44 mx-auto rounded-full border-4 border-dashed border-[#722238] flex flex-col items-center justify-center p-2 text-[#722238] shadow-lg bg-[#FFFDF9]"
                >
                  <div className="w-full h-full rounded-full border-2 border-[#722238] flex flex-col items-center justify-center p-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#B9985A]">
                      LOVE JOURNEY
                    </span>
                    <span className="font-serif-title font-extrabold text-2xl tracking-wider text-[#722238] my-1">
                      CONFIRMED
                    </span>
                    <span className="text-[9px] uppercase font-semibold text-[#722238]">
                      PASSENGER VERIFIED
                    </span>
                    <Heart className="w-4 h-4 fill-[#722238] text-[#722238] mt-1" />
                  </div>
                </motion.div>

                <div className="space-y-2">
                  <h3 className="font-serif-title text-2xl font-bold text-[#722238]">
                    YOUR JOURNEY IS CONFIRMED!
                  </h3>
                  <p className="text-sm text-[#443B35]/80 max-w-md mx-auto font-body">
                    Cảm ơn quý khách đã xác nhận tham dự. Hẹn gặp lại quý khách tại điểm đến hạnh phúc của chúng mình ♥
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      attending: true,
                      guestCount: 1,
                      message: '',
                    });
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#F5EFE3] hover:bg-[#B9985A]/20 text-[#722238] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-[#B9985A]/30"
                >
                  Gửi phản hồi khác
                </button>
              </motion.div>
            ) : (
              /* RSVP Form */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {/* Personalized Guest Welcome Hint */}
                {guestInfo.hasGuest && (
                  <div className="p-3.5 rounded-2xl bg-[#F5EFE3] border border-[#B9985A] flex items-center gap-3 text-xs text-[#722238] shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-[#722238] text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#B9985A]" />
                    </div>
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wider text-[#722238]">
                        Kính gửi {guestInfo.cleanName}
                      </p>
                      <p className="text-[11px] text-[#443B35]">
                        Tên bạn đã được định vị sẵn trên bản đồ. Chạm để xác nhận số người đồng hành cùng bạn!
                      </p>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#722238] mb-1.5">
                    Họ và tên quý khách *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#B9985A]/40 text-[#443B35] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#722238]/30 transition-all"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#722238] mb-1.5">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="VD: 0901234567"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#B9985A]/40 text-[#443B35] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#722238]/30 transition-all"
                  />
                </div>

                {/* Attendance Options */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#722238] mb-1.5">
                    Khả năng tham dự
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: true })}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        formData.attending
                          ? 'bg-[#722238] text-white border-[#722238] shadow-sm'
                          : 'bg-[#FAF6EE] text-[#443B35] border-[#B9985A]/30 hover:bg-[#F5EFE3]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Sẽ tham dự</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: false })}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        !formData.attending
                          ? 'bg-[#443B35] text-white border-[#443B35] shadow-sm'
                          : 'bg-[#FAF6EE] text-[#443B35] border-[#B9985A]/30 hover:bg-[#F5EFE3]'
                      }`}
                    >
                      <span>Rất tiếc không thể</span>
                    </button>
                  </div>
                </div>

                {/* Guest Count (if attending) */}
                {formData.attending && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#722238] mb-1.5">
                      Số lượng người tham dự cùng
                    </label>
                    <select
                      value={formData.guestCount}
                      onChange={(e) =>
                        setFormData({ ...formData, guestCount: parseInt(e.target.value, 10) })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#B9985A]/40 text-[#443B35] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#722238]/30 transition-all cursor-pointer"
                    >
                      <option value={1}>Đi 1 mình (1 người)</option>
                      <option value={2}>Đi cùng người thương (2 người)</option>
                      <option value={3}>Đi cùng gia đình (3 người)</option>
                      <option value={4}>Đi cùng gia đình (4 người)</option>
                    </select>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#722238] mb-1.5">
                    Lời nhắn gửi cô dâu chú rể (tùy chọn)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Gửi lời chúc mừng hoặc ghi chú đặc biệt..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF6EE] border border-[#B9985A]/40 text-[#443B35] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#722238]/30 transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#722238] hover:bg-[#5a1a2b] text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-[#B9985A]/40"
                >
                  {isSubmitting ? (
                    <span>Đang gửi xác nhận...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#B9985A]" />
                      <span>XÁC NHẬN THAM GIA HÀNH TRÌNH</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
