import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperFrameCorner,
  TraditionalDivider,
} from './TraditionalOrnaments';
import { Send, CheckCircle2, User, Phone, Users, Heart, Sparkles } from 'lucide-react';
import { submitRSVP } from '../../../services/rsvpService';
import { useToast } from '../../ui/Toast';
import { getGuestInfoFromUrl } from '../../../lib/guestPersonalization';

interface TraditionalRSVPSectionProps {
  weddingId?: string;
  groomName?: string;
  brideName?: string;
}

export function TraditionalRSVPSection({
  weddingId = 'demo-wedding',
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: TraditionalRSVPSectionProps) {
  const { showToast } = useToast();
  const guestInfo = useMemo(() => getGuestInfoFromUrl(), []);
  const [name, setName] = useState(() => guestInfo.rsvpPrefill || '');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<boolean>(true);
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [guestOf, setGuestOf] = useState<'groom' | 'bride' | 'both'>('both');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (guestInfo.rsvpPrefill) {
      setName((prev) => prev || guestInfo.rsvpPrefill);
    }
  }, [guestInfo.rsvpPrefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập họ tên của quý khách.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRSVP({
        weddingId,
        fullName: name.trim(),
        phone: phone.trim(),
        attending,
        guestsCount: attending ? Number(guestsCount) : 0,
        guestOf,
        message: message.trim(),
      });

      setIsSubmitted(true);
      showToast('Cảm ơn quý khách đã gửi thư xác nhận tham dự!', 'success');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#BA1E28', '#D4AF37', '#FFD700', '#FAF6EE'],
        });
      } catch {
        // ignore
      }
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-20 sm:py-24 bg-[#FBF7EE] text-[#3D1A1E] overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BA1E28]/10 border border-[#BA1E28]/25 text-[#BA1E28] text-xs font-semibold uppercase tracking-widest">
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28]" />
            <span>Xác Nhận Tham Dự</span>
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28] scale-x-[-1]" />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B1119] tracking-wide">
            Thư Hồi Âm Báo Hỷ
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#735154] max-w-md mx-auto leading-relaxed">
            Để gia đình tiện việc đón tiếp và chuẩn bị chu đáo nhất, kính mong quý khách xác nhận tham dự trước ngày hôn lễ.
          </p>

          <TraditionalDivider className="mt-4" />
        </div>

        {/* Form Container: Khung Thư Giấy Mỹ Thuật */}
        <div className="relative bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border-2 border-[#D4AF37]/50 shadow-[0_15px_40px_rgba(186,30,40,0.08)]">
          <PaperFrameCorner position="top-left" className="top-2.5 left-2.5 w-7 h-7 text-[#D4AF37]" />
          <PaperFrameCorner position="top-right" className="top-2.5 right-2.5 w-7 h-7 text-[#D4AF37]" />
          <PaperFrameCorner position="bottom-left" className="bottom-2.5 left-2.5 w-7 h-7 text-[#D4AF37]" />
          <PaperFrameCorner position="bottom-right" className="bottom-2.5 right-2.5 w-7 h-7 text-[#D4AF37]" />

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-10 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#FAF5EA] border-2 border-[#D4AF37] text-[#BA1E28] flex items-center justify-center mx-auto shadow-md">
                <SongHyGlyph className="w-10 h-10 text-[#BA1E28]" />
              </div>

              <h3 className="font-serif-title text-2xl font-bold text-[#8B1119]">
                Kính Báo Đã Nhận Thư Hồi Âm
              </h3>

              <p className="font-body text-xs sm:text-sm text-[#5C3D40] max-w-md mx-auto leading-relaxed">
                Đôi uyên ương {groomName} &amp; {brideName} cùng hai bên gia đình xin chân thành cảm ơn quý khách. Chúng mình rất mong chờ được đón tiếp quý khách!
              </p>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2 rounded-full border border-[#D4AF37] text-[#8B1119] text-xs font-semibold hover:bg-[#FAF5EA] transition-colors cursor-pointer"
              >
                Gửi lại thông tin khác
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personalized Guest Welcome Hint */}
              {guestInfo.hasGuest && (
                <div className="p-3.5 rounded-2xl bg-[#FAF5EA] border border-[#D4AF37] flex items-center gap-3 text-xs text-[#8B1119] shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#BA1E28] text-[#FFFDF8] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#F3E2BB]" />
                  </div>
                  <div>
                    <p className="font-serif-title font-bold text-sm text-[#8B1119]">
                      Kính gửi {guestInfo.cleanName}
                    </p>
                    <p className="text-[11px] text-[#5A121A]/80">
                      Tên của quý khách đã được tự động điền sẵn. Chạm xác nhận để đôi tân lang tân nương chuẩn bị cỗ bàn chu tất!
                    </p>
                  </div>
                </div>
              )}

              {/* Họ tên */}
              <div>
                <label className="block text-xs font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1.5">
                  Họ và tên của quý khách *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn Hoàng"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF5EA] border border-[#E0D3BC] focus:border-[#BA1E28] focus:ring-1 focus:ring-[#BA1E28] text-sm text-[#1A1816] placeholder-[#A09384] outline-none transition-all"
                  />
                  <User className="w-4 h-4 text-[#A09384] absolute right-3.5 top-3" />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1.5">
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0905 123 456"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF5EA] border border-[#E0D3BC] focus:border-[#BA1E28] focus:ring-1 focus:ring-[#BA1E28] text-sm text-[#1A1816] placeholder-[#A09384] outline-none transition-all"
                  />
                  <Phone className="w-4 h-4 text-[#A09384] absolute right-3.5 top-3" />
                </div>
              </div>

              {/* Khách của ai */}
              <div>
                <label className="block text-xs font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1.5">
                  Quý khách là người thân / bạn hữu của
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'groom', label: `Nhà Trai (${groomName})` },
                    { val: 'bride', label: `Nhà Gái (${brideName})` },
                    { val: 'both', label: 'Cả Hai Bên' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setGuestOf(opt.val as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-body font-semibold transition-all border cursor-pointer ${
                        guestOf === opt.val
                          ? 'bg-[#BA1E28] text-white border-[#BA1E28] shadow-xs'
                          : 'bg-[#FAF5EA] text-[#5C3D40] border-[#E0D3BC] hover:border-[#BA1E28]/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tham dự */}
              <div>
                <label className="block text-xs font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1.5">
                  Xác nhận tham dự
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-body font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      attending
                        ? 'bg-gradient-to-r from-[#BA1E28] to-[#8B1119] text-white border-[#BA1E28] shadow-xs'
                        : 'bg-[#FAF5EA] text-[#5C3D40] border-[#E0D3BC]'
                    }`}
                  >
                    <span>✓ Chắc chắn tham dự</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-body font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      !attending
                        ? 'bg-[#6B5A52] text-white border-[#6B5A52] shadow-xs'
                        : 'bg-[#FAF5EA] text-[#5C3D40] border-[#E0D3BC]'
                    }`}
                  >
                    <span>✕ Rất tiếc không thể đến</span>
                  </button>
                </div>
              </div>

              {/* Số khách đi cùng */}
              {attending && (
                <div>
                  <label className="block text-xs font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1.5">
                    Số người tham dự
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`flex-1 py-2 rounded-xl text-xs font-body font-semibold transition-all border cursor-pointer ${
                          guestsCount === num
                            ? 'bg-[#BA1E28] text-white border-[#BA1E28] shadow-xs'
                            : 'bg-[#FAF5EA] text-[#5C3D40] border-[#E0D3BC]'
                        }`}
                      >
                        {num === 4 ? '4+ người' : `${num} người`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lời chúc */}
              <div>
                <label className="block text-xs font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1.5">
                  Lời nhắn gửi đôi uyên ương
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Gửi lời chúc phúc yêu thương đến cô dâu và chú rể..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF5EA] border border-[#E0D3BC] focus:border-[#BA1E28] focus:ring-1 focus:ring-[#BA1E28] text-sm text-[#1A1816] placeholder-[#A09384] outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#BA1E28] via-[#A61C24] to-[#8B1119] hover:opacity-95 text-white font-serif-title text-base font-bold tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all border border-[#D4AF37]/50"
                >
                  <SongHyGlyph className="w-4 h-4 text-[#FFD700]" />
                  <span>{isSubmitting ? 'Đang gửi hồi âm...' : 'Gửi Thư Hồi Âm Phúc Đáp'}</span>
                  <Send className="w-4 h-4 text-[#FFD700]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
