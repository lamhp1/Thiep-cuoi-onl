import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, CheckCircle2, Users, Sparkles } from 'lucide-react';
import {
  LoveLetterWashiTape,
  LoveLetterWaxSeal,
  BotanicalSketch,
  InkUnderline,
} from './LoveLetterOrnaments';
import { getGuestInfoFromUrl } from '../../../../lib/guestPersonalization';

interface LoveLetterRSVPSectionProps {
  weddingDate: string;
  onSubmitRSVP?: (rsvpData: {
    name: string;
    phone: string;
    attending: boolean;
    guestCount: number;
    message: string;
  }) => void;
}

export function LoveLetterRSVPSection({
  weddingDate,
  onSubmitRSVP,
}: LoveLetterRSVPSectionProps) {
  const guestInfo = useMemo(() => getGuestInfoFromUrl(), []);
  const [name, setName] = useState(() => guestInfo.rsvpPrefill || '');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<boolean>(true);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (guestInfo.rsvpPrefill) {
      setName((prev) => prev || guestInfo.rsvpPrefill);
    }
  }, [guestInfo.rsvpPrefill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (onSubmitRSVP) {
        onSubmitRSVP({
          name: name.trim(),
          phone: phone.trim(),
          attending,
          guestCount,
          message: message.trim(),
        });
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section id="rsvp" className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
      {/* Stationery Paper Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-12 md:p-14 border border-[#C8A96B]/35 shadow-2xl text-center overflow-visible"
        style={{
          boxShadow: '0 20px 50px -15px rgba(89,72,62,0.14), 0 0 0 1px rgba(200,169,107,0.2)',
        }}
      >
        <LoveLetterWashiTape className="-top-3 left-1/2 -translate-x-1/2" color="gold" angle={-1} />

        {/* Section Heading */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7F1E7] border border-[#C8A96B]/30 text-[#7A2638] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 shadow-xs">
            <Heart className="w-3 h-3 fill-current text-[#7A2638]" />
            <span>SỰ HIỆN DIỆN CỦA BẠN</span>
          </div>

          <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#59483E] tracking-tight">
            Bạn Sẽ Đến Chứ?
          </h2>

          <p className="font-serif text-sm sm:text-base text-[#59483E]/80 max-w-lg mx-auto mt-2 leading-relaxed">
            Sự hiện diện và lời chúc phúc của bạn là món quà đặc biệt nhất đối với chúng mình trong ngày trọng đại này.
          </p>

          <div className="flex justify-center mt-2">
            <InkUnderline className="max-w-[200px]" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            /* Handwritten Style Input Form */
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto space-y-6 text-left"
            >
              {/* Personalized Guest Welcome Hint */}
              {guestInfo.hasGuest && (
                <div className="p-3.5 rounded-2xl bg-[#F7F1E7] border border-[#C8A96B]/50 flex items-center gap-3 text-xs text-[#7A2638] shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#7A2638] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#F7F1E7]" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-xs uppercase tracking-wider text-[#7A2638]">
                      Thân gửi {guestInfo.cleanName}
                    </p>
                    <p className="text-[11px] text-[#59483E] font-handwriting text-base">
                      Tên của bạn đã được viết sẵn trong thư. Vui lòng xác nhận để chúng mình chu toàn đón tiếp nhé ♥
                    </p>
                  </div>
                </div>
              )}

              {/* Full Name - Handwritten Underline style */}
              <div className="space-y-1">
                <label className="block font-serif text-xs uppercase tracking-wider text-[#59483E]/70 font-semibold">
                  Họ và tên quý khách *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A..."
                    className="w-full py-2.5 px-1 bg-transparent border-b-2 border-[#C8A96B]/40 focus:border-[#7A2638] focus:outline-hidden font-handwriting text-2xl text-[#59483E] placeholder:text-[#59483E]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number - Handwritten Underline style */}
              <div className="space-y-1">
                <label className="block font-serif text-xs uppercase tracking-wider text-[#59483E]/70 font-semibold">
                  Số điện thoại *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678..."
                    className="w-full py-2.5 px-1 bg-transparent border-b-2 border-[#C8A96B]/40 focus:border-[#7A2638] focus:outline-hidden font-handwriting text-2xl text-[#59483E] placeholder:text-[#59483E]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Attendance Options */}
              <div className="space-y-2 pt-2">
                <label className="block font-serif text-xs uppercase tracking-wider text-[#59483E]/70 font-semibold">
                  Bạn có thể tham dự chứ?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-3 px-4 rounded-2xl border text-sm font-serif font-semibold text-center transition-all cursor-pointer ${
                      attending
                        ? 'bg-[#7A2638] text-[#FFFDF8] border-[#7A2638] shadow-md'
                        : 'bg-[#F7F1E7]/60 text-[#59483E] border-[#C8A96B]/30 hover:bg-[#F7F1E7]'
                    }`}
                  >
                    ♥ Chắc chắn sẽ tham dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-3 px-4 rounded-2xl border text-sm font-serif font-semibold text-center transition-all cursor-pointer ${
                      !attending
                        ? 'bg-[#59483E] text-[#FFFDF8] border-[#59483E] shadow-md'
                        : 'bg-[#F7F1E7]/60 text-[#59483E] border-[#C8A96B]/30 hover:bg-[#F7F1E7]'
                    }`}
                  >
                    Rất tiếc không thể đến
                  </button>
                </div>
              </div>

              {/* Number of Guests (if attending) */}
              {attending && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-2"
                >
                  <label className="block font-serif text-xs uppercase tracking-wider text-[#59483E]/70 font-semibold">
                    Số lượng người tham dự
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`flex-1 py-2 rounded-xl border text-sm font-serif font-bold transition-all cursor-pointer ${
                          guestCount === num
                            ? 'bg-[#C8A96B] text-[#FFFDF8] border-[#C8A96B] shadow-sm'
                            : 'bg-[#FFFDF8] text-[#59483E] border-[#C8A96B]/30 hover:bg-[#F7F1E7]'
                        }`}
                      >
                        {num} người
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message to Couple */}
              <div className="space-y-1 pt-2">
                <label className="block font-serif text-xs uppercase tracking-wider text-[#59483E]/70 font-semibold">
                  Lời chúc gửi đến hai người
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết vài lời nhắn gửi yêu thương..."
                  className="w-full py-2 px-1 bg-transparent border-b-2 border-[#C8A96B]/40 focus:border-[#7A2638] focus:outline-hidden font-handwriting text-xl text-[#59483E] placeholder:text-[#59483E]/30 resize-none transition-colors"
                />
              </div>

              {/* Submit Button Styled as Wax Stamp */}
              <div className="pt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full bg-[#7A2638] hover:bg-[#631c2c] text-[#FFFDF8] font-serif-title font-bold text-sm tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send className="w-4 h-4 text-[#C8A96B] group-hover:translate-x-1 transition-transform" />
                  <span>{isSubmitting ? 'ĐANG ĐÓNG DẤU XÁC NHẬN...' : 'GỬI LỜI XÁC NHẬN'}</span>
                </button>
              </div>
            </motion.form>
          ) : (
            /* RSVP SUCCESS CONFIRMATION - Slamming Wax Stamp */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="py-10 max-w-md mx-auto space-y-6 text-center"
            >
              {/* Slamming Wax Seal with "CONFIRMED" */}
              <div className="flex justify-center">
                <LoveLetterWaxSeal
                  text="CONFIRMED"
                  size="xl"
                  stampAnimate={true}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#7A2638]">
                  CẢM ƠN BẠN!
                </h3>
                <p className="font-handwriting text-2xl text-[#59483E]">
                  Hẹn gặp bạn trong ngày đặc biệt của chúng mình. ♥
                </p>
                <p className="font-serif text-xs sm:text-sm text-[#59483E]/75 mt-2 leading-relaxed">
                  Lời phản hồi của bạn đã được ghi lại trong cuốn sổ tay ngày cưới của cô dâu chú rể.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-[#7A2638] hover:text-[#59483E] underline underline-offset-4 cursor-pointer font-serif"
                >
                  Thay đổi câu trả lời hoặc gửi lời chúc khác
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
