import React, { useState } from 'react';
import { ChapterHeaderBadge, FolkCloud, FolkLotus, FolkRedSeal } from './FairytaleOrnaments';
import { CheckCircle2, Send, Sparkles, Users, User, Phone, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FairytaleVillageRSVPSectionProps {
  weddingId?: string;
  onRSVPSubmit: (rsvp: {
    name: string;
    phone: string;
    attending: boolean;
    guestCount: number;
    message?: string;
  }) => Promise<void>;
}

export function FairytaleVillageRSVPSection({
  weddingId,
  onRSVPSubmit,
}: FairytaleVillageRSVPSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [side, setSide] = useState<'both' | 'groom' | 'bride'>('both');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onRSVPSubmit({
        name,
        phone,
        attending,
        guestCount: attending ? guestCount : 0,
        message: `${side !== 'both' ? `[Khách ${side === 'groom' ? 'Nhà Trai' : 'Nhà Gái'}] ` : ''}${message}`,
      });

      setSubmitted(true);

      // Festive confetti
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#BA262B', '#E5A93C', '#2D6A4F'],
        });
      } catch {
        // safe fallback
      }
    } catch (err) {
      console.error('RSVP submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="village-rsvp" className="relative py-24 px-4 overflow-hidden bg-[#F5EFE3]">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Chapter 6 Badge */}
        <ChapterHeaderBadge
          chapterNum="Chương VI • Hỷ Sự Đầy Sân"
          title="Xác Nhận Tham Dự"
          subtext="Cáo bảng làng vui ngày đại hỷ, trân trọng kính mời quý khách ghi danh chung mừng"
        />

        <div className="max-w-xl mx-auto bg-[#FFFDF9] rounded-2xl p-6 sm:p-9 border-2 border-[#D9CBB7] shadow-xl relative">
          {/* Top Hanging Plaque Cord Motif */}
          <div className="flex justify-center -mt-12 mb-4">
            <div className="flex items-center gap-4">
              <span className="w-1.5 h-7 bg-[#8A3224] rounded-t" />
              <div className="bg-[#BA262B] text-[#FAF5EB] px-4 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-widest shadow-md border border-[#E5A93C]">
                Sổ Ghi Danh Đại Hỷ
              </div>
              <span className="w-1.5 h-7 bg-[#8A3224] rounded-t" />
            </div>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#2D6A4F]/10 border-2 border-[#2D6A4F] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="inline-block p-2 border-2 border-dashed border-[#BA262B] rounded-lg bg-[#BA262B]/10">
                <p className="font-serif-title text-xl font-bold text-[#BA262B] tracking-widest">
                  ĐẠI HỶ CHỨNG MINH
                </p>
                <p className="text-[10px] font-mono text-[#853023] uppercase">
                  ĐÃ LƯU VÀO DANH SÁCH QUAN KHÁCH
                </p>
              </div>

              <h3 className="font-serif-title text-2xl font-bold text-[#351E17]">
                Cảm Tạ Quý Khách!
              </h3>
              <p className="font-poetry text-sm text-[#543026] italic max-w-md mx-auto leading-relaxed">
                "Lời hồi đáp của bạn là niềm vinh hạnh to lớn cho gia đình chúng mình. Hẹn gặp lại bạn trong ngày vui đại hỷ rộn rã tiếng cười!"
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#BA262B] underline font-serif font-bold cursor-pointer pt-2"
              >
                Gửi lại thông tin nếu có thay đổi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Attendance Toggle */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-2">
                  Bạn Sẽ Đến Chung Vui Chứ?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-serif font-bold border transition-all cursor-pointer ${
                      attending
                        ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white shadow-md'
                        : 'bg-[#FAF5EB] border-[#D9CBB7] text-[#543026]'
                    }`}
                  >
                    🎉 Chắc Chắn Tham Dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-serif font-bold border transition-all cursor-pointer ${
                      !attending
                        ? 'bg-[#853023] border-[#853023] text-white shadow-md'
                        : 'bg-[#FAF5EB] border-[#D9CBB7] text-[#543026]'
                    }`}
                  >
                    💌 Rất Tiếc Không Thể Đến
                  </button>
                </div>
              </div>

              {/* Guest Full Name */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#BA262B]" />
                  <span>Họ Và Tên Của Bạn *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF5EB] focus:outline-none focus:border-[#BA262B] text-sm text-[#351E17] font-body"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>Số Điện Thoại Liên Hệ</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF5EB] focus:outline-none focus:border-[#BA262B] text-sm text-[#351E17] font-body"
                />
              </div>

              {/* Guest Side & Guest Count */}
              {attending && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-1.5">
                      Khách Mời Của Ai?
                    </label>
                    <select
                      value={side}
                      onChange={(e) => setSide(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF5EB] focus:outline-none focus:border-[#BA262B] text-xs font-serif text-[#351E17]"
                    >
                      <option value="both">Bạn Chung Hai Người</option>
                      <option value="groom">Khách Nhà Trai (Chú Rể)</option>
                      <option value="bride">Khách Nhà Gái (Cô Dâu)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#BA262B]" />
                      <span>Số Người Tham Dự</span>
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF5EB] focus:outline-none focus:border-[#BA262B] text-xs font-serif text-[#351E17]"
                    >
                      <option value={1}>1 Người (Chỉ mình tôi)</option>
                      <option value={2}>2 Người (Đi cùng bạn đời/người thân)</option>
                      <option value={3}>3 Người</option>
                      <option value={4}>4 Người (Cả gia đình)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Personal Message */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#853023]" />
                  <span>Lời Nhắn Gửi Tới Đôi Uyên Ương</span>
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Gửi lời chúc phúc trăm năm hoặc dặn dò thời gian đón tiếp..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF5EB] focus:outline-none focus:border-[#BA262B] text-xs sm:text-sm text-[#351E17] font-body resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-full bg-[#BA262B] hover:bg-[#853023] text-[#FAF5EB] text-sm font-serif font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-75 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang Ghi Danh...' : 'Xác Nhận Tham Dự Ngay'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
