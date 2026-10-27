import React, { useState } from 'react';
import { Send, CheckCircle2, Heart, User, Phone, Users, MessageSquare } from 'lucide-react';
import { WashiTape, Paperclip, Thumbtack, HeartSticker } from './PolaroidScrapbookOrnaments';

interface PolaroidRSVPSectionProps {
  onRSVPSubmit: (data: {
    name: string;
    phone: string;
    attending: boolean;
    guestCount: number;
    message?: string;
  }) => Promise<void>;
  weddingDate?: string;
}

export function PolaroidRSVPSection({
  onRSVPSubmit,
  weddingDate = '20.12.2026',
}: PolaroidRSVPSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    attending: true,
    guestCount: 1,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    try {
      await onRSVPSubmit(formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-14 sm:py-24 px-4 sm:px-6 max-w-3xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-block relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <WashiTape style="mint-dots" angle={-1} width="w-32" />
          </div>
          <div className="bg-[#FFFDF9] border border-[#E3D4BC] px-6 py-2 rounded-xs shadow-xs inline-flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#C84B5D] fill-current" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7E5E44] font-bold">
              XÁC NHẬN THAM DỰ • RSVP
            </span>
            <Heart className="w-3.5 h-3.5 text-[#C84B5D] fill-current" />
          </div>
        </div>

        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#2C211B] mt-4">
          Bạn Sẽ Đến Chung Vui Chứ?
        </h2>
        <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5738] mt-1">
          "Xin vui lòng gửi phản hồi trước ngày 10.12.2026 để chúng mình chuẩn bị đón tiếp chu đáo nhất."
        </p>
      </div>

      {/* Guest Response Card Container */}
      <div className="relative bg-[#FFFDF9] border-2 border-[#DFCBB2] p-6 sm:p-10 rounded-xl shadow-xl [background-image:linear-gradient(to_bottom,transparent_27px,#EFE5D3_28px)] [background-size:100%_28px]">
        {/* Paperclips on top corners */}
        <div className="absolute -top-4 left-8 z-20">
          <Paperclip angle={-12} />
        </div>
        <div className="absolute -top-3.5 right-8 z-10">
          <WashiTape style="yellow-stripes" angle={4} width="w-24" />
        </div>

        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#8CD8B2]/20 border-2 border-[#10B981] text-[#0E4A2A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
            </div>

            {/* Stamped Ink Seal */}
            <div className="inline-block border-4 border-dashed border-[#C84B5D] text-[#C84B5D] px-6 py-2 rounded-sm rotate-[-3deg] shadow-xs">
              <span className="font-mono text-xl sm:text-2xl font-black uppercase tracking-widest">
                COUNT ME IN! ✓
              </span>
            </div>

            <h3 className="font-serif-title text-2xl font-bold text-[#2C211B]">
              Cảm Ơn Bạn Rất Nhiều!
            </h3>
            <p className="font-polaroid-note text-lg text-[#6A5445] max-w-md mx-auto">
              Thông tin của bạn đã được ghi lại trong sổ khách mời. Minh Anh & Ngọc Mai rất mong chờ được gặp bạn trong ngày hạnh phúc!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="font-mono text-xs uppercase font-bold text-[#8C6D1F] block mb-1.5">
                  TÊN CỦA BẠN *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full bg-[#FAF6EE] border border-[#D5C2A5] rounded-md px-3.5 py-2.5 text-sm text-[#2C211B] placeholder-[#9E8A78] focus:outline-none focus:border-[#C84B5D] transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="font-mono text-xs uppercase font-bold text-[#8C6D1F] block mb-1.5">
                  SỐ ĐIỆN THOẠI *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="VD: 0912 345 678"
                  className="w-full bg-[#FAF6EE] border border-[#D5C2A5] rounded-md px-3.5 py-2.5 text-sm text-[#2C211B] placeholder-[#9E8A78] focus:outline-none focus:border-[#C84B5D] transition-colors"
                />
              </div>
            </div>

            {/* Attendance Choice */}
            <div>
              <label className="font-mono text-xs uppercase font-bold text-[#8C6D1F] block mb-2">
                BẠN SẼ THAM DỰ CHỨ? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: true })}
                  className={`p-3 rounded-md border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.attending
                      ? 'bg-[#C84B5D] text-white border-[#C84B5D] shadow-md'
                      : 'bg-[#FAF6EE] text-[#634E41] border-[#DFCBB2] hover:bg-white'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Chắc chắn sẽ tham dự!</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: false })}
                  className={`p-3 rounded-md border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    !formData.attending
                      ? 'bg-[#634E41] text-white border-[#634E41] shadow-md'
                      : 'bg-[#FAF6EE] text-[#634E41] border-[#DFCBB2] hover:bg-white'
                  }`}
                >
                  <span>Tiếc quá, mình không thể đến</span>
                </button>
              </div>
            </div>

            {/* Guest count */}
            {formData.attending && (
              <div>
                <label className="font-mono text-xs uppercase font-bold text-[#8C6D1F] block mb-1.5">
                  SỐ LƯỢNG NGƯỜI THAM DỰ
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  className="w-full bg-[#FAF6EE] border border-[#D5C2A5] rounded-md px-3.5 py-2.5 text-sm text-[#2C211B] focus:outline-none focus:border-[#C84B5D] transition-colors"
                >
                  <option value={1}>1 người (Chỉ mình tôi)</option>
                  <option value={2}>2 người (Đi cùng người thương / Bạn bè)</option>
                  <option value={3}>3 người (Đi cùng gia đình)</option>
                  <option value={4}>4 người (Gia đình 4 thành viên)</option>
                </select>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="font-mono text-xs uppercase font-bold text-[#8C6D1F] block mb-1.5">
                LỜI NHẮN GỬI CÔ DÂU CHÚ RỂ
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Gửi lời chúc hoặc nhắn nhủ thêm cho cô dâu chú rể nhé..."
                className="w-full bg-[#FAF6EE] border border-[#D5C2A5] rounded-md p-3 text-sm text-[#2C211B] placeholder-[#9E8A78] focus:outline-none focus:border-[#C84B5D] transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#C84B5D] to-[#A23847] hover:from-[#B53D4E] hover:to-[#8E2D3B] text-white font-mono text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'ĐANG GỬI XÁC NHẬN...' : 'GỬI XÁC NHẬN THAM DỰ'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
