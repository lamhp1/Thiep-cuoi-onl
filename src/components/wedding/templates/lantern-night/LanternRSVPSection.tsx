import React, { useState } from 'react';
import { RSVPGuest } from '../../../../types';
import { SparklingStar, LotusNightIcon, HoiAnGlobeLantern } from './LanternNightOrnaments';
import { Send, CheckCircle2, User, Phone, Users, MessageSquare, Sparkles } from 'lucide-react';

interface LanternRSVPSectionProps {
  weddingId?: string;
  onRSVPSubmit: (rsvp: Omit<RSVPGuest, 'id' | 'createdAt'>) => Promise<void> | void;
}

export function LanternRSVPSection({ weddingId = 'wedding-lantern', onRSVPSubmit }: LanternRSVPSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    side: 'groom' as 'groom' | 'bride',
    attendance: 'yes' as 'yes' | 'no',
    guestCount: 1,
    wishes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onRSVPSubmit({
        weddingId,
        fullName: formData.name,
        phone: formData.phone,
        guestOf: formData.side,
        attending: formData.attendance === 'yes',
        guestsCount: formData.attendance === 'yes' ? Number(formData.guestCount) : 0,
        message: formData.wishes,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-serif uppercase tracking-widest">
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Xác Nhận Tham Dự</span>
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-100">
          Phúc Đáp Dạ Yến Đèn Lồng
        </h2>
        <p className="font-serif italic text-sm text-neutral-400 max-w-md mx-auto">
          Để công tác tiếp đón và chuẩn bị bàn tiệc chu đáo nhất, xin quý khách vui lòng xác nhận tham dự trước ngày 10/12/2026.
        </p>
      </div>

      {/* Form Container */}
      <div className="relative rounded-3xl bg-neutral-950/80 border border-amber-500/35 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-amber-100">
              Đã Nhận Được Lời Phúc Đáp!
            </h3>
            <p className="font-serif text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Một ngọn đèn lồng mang tên <strong className="text-amber-300">{formData.name}</strong> đã được thắp sáng trong dạ tiệc. Gia đình chúng mình chân thành cảm ơn!
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: '',
                  phone: '',
                  side: 'groom',
                  attendance: 'yes',
                  guestCount: 1,
                  wishes: '',
                });
              }}
              className="cursor-pointer px-6 py-2 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 font-serif text-xs uppercase tracking-wider hover:bg-amber-900/60"
            >
              Gửi thêm phản hồi khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Guest Name */}
              <div className="space-y-2">
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-300">
                  Họ và tên quý khách *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-amber-500/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Hoàng Tuấn Kiệt"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 focus:border-amber-400 text-amber-100 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-300">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-amber-500/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ví dụ: 0912 345 678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 focus:border-amber-400 text-amber-100 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Guest of Groom or Bride */}
            <div className="space-y-2">
              <label className="block text-xs font-serif uppercase tracking-wider text-amber-300">
                Quý khách là khách của ai?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, side: 'groom' })}
                  className={`cursor-pointer py-3 rounded-xl font-serif text-xs font-bold uppercase tracking-wider border transition-colors ${
                    formData.side === 'groom'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-amber-500/30'
                  }`}
                >
                  Khách Nhà Trai (Tân Lang)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, side: 'bride' })}
                  className={`cursor-pointer py-3 rounded-xl font-serif text-xs font-bold uppercase tracking-wider border transition-colors ${
                    formData.side === 'bride'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-amber-500/30'
                  }`}
                >
                  Khách Nhà Gái (Tân Nương)
                </button>
              </div>
            </div>

            {/* Attendance & Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-serif uppercase tracking-wider text-amber-300">
                  Khả năng tham dự
                </label>
                <select
                  value={formData.attendance}
                  onChange={(e) =>
                    setFormData({ ...formData, attendance: e.target.value as 'yes' | 'no' })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 focus:border-amber-400 text-amber-100 text-sm focus:outline-none transition-colors"
                >
                  <option value="yes">Chắc chắn tham dự dạ yến</option>
                  <option value="no">Tiếc quá, tôi không thể tham dự</option>
                </select>
              </div>

              {formData.attendance === 'yes' && (
                <div className="space-y-2">
                  <label className="block text-xs font-serif uppercase tracking-wider text-amber-300">
                    Số lượng người tham dự
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-amber-500/30 focus:border-amber-400 text-amber-100 text-sm focus:outline-none transition-colors"
                  >
                    <option value={1}>1 người (Chỉ mình tôi)</option>
                    <option value={2}>2 người (Tôi và người thương)</option>
                    <option value={3}>3 người (Gia đình nhỏ)</option>
                    <option value={4}>4 người (Gia đình 4 người)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Wishes */}
            <div className="space-y-2">
              <label className="block text-xs font-serif uppercase tracking-wider text-amber-300">
                Lời chúc phúc gửi gắm
              </label>
              <textarea
                rows={3}
                value={formData.wishes}
                onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
                placeholder="Gửi gắm lời chúc trăm năm hạnh phúc tới cô dâu chú rể..."
                className="w-full p-4 rounded-xl bg-neutral-900/90 border border-amber-500/30 focus:border-amber-400 text-amber-100 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full py-3.5 rounded-full bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-serif-title font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.8)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Đang gửi xác nhận...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Xác Nhận &amp; Thắp Sáng Ngọn Đèn Của Bạn</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
