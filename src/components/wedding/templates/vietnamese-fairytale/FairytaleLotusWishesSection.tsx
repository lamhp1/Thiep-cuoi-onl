import React, { useState } from 'react';
import { WishMessage } from '../../../../types';
import { ChapterHeaderBadge, FolkCloud, FolkLotus, FolkRedSeal } from './FairytaleOrnaments';
import { Send, Heart, Sparkles, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FairytaleLotusWishesSectionProps {
  wishes?: WishMessage[];
  weddingId?: string;
  onAddWish?: (name: string, message: string) => Promise<void>;
}

export function FairytaleLotusWishesSection({
  wishes,
  weddingId,
  onAddWish,
}: FairytaleLotusWishesSectionProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [lotusType, setLotusType] = useState<'pink' | 'gold' | 'jade'>('pink');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state for instant feedback
  const [localWishes, setLocalWishes] = useState<WishMessage[]>(
    wishes && wishes.length > 0
      ? wishes
      : [
          {
            id: 'w1',
            weddingId: weddingId || 'demo',
            authorName: 'Bác Ba Thôn Đoài',
            content: 'Chúc hai cháu trăm năm đầu bạc răng long, con đàn cháu đống, gia đạo an khang thịnh vượng!',
            createdAt: 'Hôm nay',
          },
          {
            id: 'w2',
            weddingId: weddingId || 'demo',
            authorName: 'Hội Bạn Cấp 3',
            content: 'Chúc mừng cặp đôi đẹp nhất làng ta! Mãi mặn nồng và yêu thương nhau như ngày đầu tiên nhé!',
            createdAt: 'Hôm qua',
          },
          {
            id: 'w3',
            weddingId: weddingId || 'demo',
            authorName: 'Chị Mai Lan',
            content: 'Thiệp cưới đẹp và thơ mộng quá! Chúc cô dâu chú rể một đời an yên, hạnh phúc viên mãn.',
            createdAt: '2 ngày trước',
          },
        ]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const newWish: WishMessage = {
      id: `w-${Date.now()}`,
      weddingId: weddingId || 'demo',
      authorName: name.trim(),
      content: content.trim(),
      createdAt: 'Vừa xong',
    };

    try {
      if (onAddWish) {
        await onAddWish(name.trim(), content.trim());
      }
      setLocalWishes((prev) => [newWish, ...prev]);
      setName('');
      setContent('');

      // Confetti burst
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#BA262B', '#E5A93C', '#2D6A4F', '#F4B6C2'],
        });
      } catch {
        // safe fallback
      }
    } catch (err) {
      console.error('Error submitting wish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="lotus-wishes" className="relative py-24 px-4 overflow-hidden bg-[#FAF5EB]">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Chapter 7 Badge */}
        <ChapterHeaderBadge
          chapterNum="Chương VII • Đèn Hoa Đăng Sen"
          title="Sổ Lưu Bút Làng Quê"
          subtext="Mỗi lời chúc tựa ngọn hoa đăng sen tỏa sáng, mang theo ước nguyện an lành trôi nhẹ giữa dòng sông tình"
        />

        {/* Input Form for floating a lotus lantern wish */}
        <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 border-2 border-[#D9CBB7] shadow-xl mb-12 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E6D8C2] pb-3 mb-5">
            <div className="flex items-center gap-2">
              <FolkLotus className="w-5 h-5 text-[#BA262B]" />
              <span className="font-serif-title text-base sm:text-lg font-bold text-[#351E17]">
                Thả Hoa Đăng Gửi Lời Chúc Phúc
              </span>
            </div>
            <span className="text-xs font-serif text-[#7A4C3E] italic hidden sm:inline">
              Lưu dấu ngàn năm
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-1">
                  Tên Của Bạn *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Bạn Thân Của Chú Rể"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF5EB] focus:outline-none focus:border-[#BA262B] text-xs sm:text-sm text-[#351E17]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-1">
                  Chọn Ngọn Hoa Đăng Sen
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLotusType('pink')}
                    className={`py-2 px-2 rounded-xl text-xs font-serif font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      lotusType === 'pink'
                        ? 'bg-[#D64560]/15 border-[#D64560] text-[#D64560]'
                        : 'bg-[#FAF5EB] border-[#D9CBB7] text-[#543026]'
                    }`}
                  >
                    <span>🌸 Sen Hồng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLotusType('gold')}
                    className={`py-2 px-2 rounded-xl text-xs font-serif font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      lotusType === 'gold'
                        ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-[#B37D14]'
                        : 'bg-[#FAF5EB] border-[#D9CBB7] text-[#543026]'
                    }`}
                  >
                    <span>✨ Sen Vàng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLotusType('jade')}
                    className={`py-2 px-2 rounded-xl text-xs font-serif font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      lotusType === 'jade'
                        ? 'bg-[#2D6A4F]/15 border-[#2D6A4F] text-[#2D6A4F]'
                        : 'bg-[#FAF5EB] border-[#D9CBB7] text-[#543026]'
                    }`}
                  >
                    <span>🌿 Sen Ngọc</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-bold text-[#351E17] uppercase tracking-wider mb-1">
                Lời Chúc Tâm Huyết *
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Gửi gắm những lời chúc ý nghĩa, ngọt ngào nhất tới tân lang tân nương..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9CBB7] bg-[#FAF5EB] focus:outline-none focus:border-[#BA262B] text-xs sm:text-sm text-[#351E17] resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-full bg-[#BA262B] hover:bg-[#853023] text-[#FAF5EB] text-xs sm:text-sm font-serif font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-75"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Đang Thả Đèn...' : 'Thả Đèn Gửi Lời Chúc'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Wishes River Floating Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-serif text-[#7A4C3E] px-2 mb-2">
            <span>Dòng Sông Nguyện Ước ({localWishes.length} Lời Chúc Đã Thả)</span>
            <span className="flex items-center gap-1 text-[#BA262B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lung Linh Tình Yêu</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localWishes.map((w, idx) => (
              <div
                key={w.id || idx}
                className="group bg-[#FFFDF9] rounded-xl p-4 sm:p-5 border border-[#E6D8C2] shadow-xs hover:border-[#BA262B] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-[#F0E6D5] pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FolkLotus
                      className="w-4 h-4"
                      petalColor={idx % 3 === 0 ? '#D64560' : idx % 3 === 1 ? '#E5A93C' : '#2D6A4F'}
                    />
                    <span className="font-serif-title font-bold text-xs sm:text-sm text-[#351E17]">
                      {w.authorName || (w as any).name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C6D1F]">
                    {w.createdAt || 'Mới đây'}
                  </span>
                </div>

                <p className="font-poetry text-xs sm:text-sm text-[#543026] leading-relaxed italic">
                  "{w.content || (w as any).message}"
                </p>

                <div className="mt-3 pt-2 border-t border-[#F0E6D5] flex items-center justify-between text-[10px] font-serif text-[#7A4C3E]">
                  <span>Ngọn Đèn #{localWishes.length - idx}</span>
                  <span className="text-[#BA262B] flex items-center gap-0.5">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>Duyên lành</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
