import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, MessageSquare, Radio, User, Heart } from 'lucide-react';
import { WeddingData, WishMessage } from '../../../../types';
import { getWishes, submitWish } from '../../../../services/wishesService';
import { useToast } from '../../../ui/Toast';

interface FuturisticWishesMatrixProps {
  data: WeddingData;
}

const QUICK_TAGS = [
  'Vượt Mọi Không-Thời Gian 🚀',
  'Tình Yêu Vô Cực ∞',
  'Cyber Romance 2026 ✨',
  'Bách Niên Hảo Hợp 🌸',
  'Hạnh Phúc Siêu Tân Tinh 💎',
];

export function FuturisticWishesMatrix({ data }: FuturisticWishesMatrixProps) {
  const { showToast } = useToast();
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const fetched = await getWishes(data.id);
        if (mounted) {
          setWishes(fetched || []);
        }
      } catch {
        if (mounted) setWishes([]);
      }
    }
    load();

    const handleUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail?.weddingId || detail.weddingId === data.id || data.id.includes(detail.weddingId) || detail.weddingId.includes(data.id)) {
        load();
      }
    };

    window.addEventListener('lamour_wishes_updated', handleUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('lamour_wishes_updated', handleUpdated);
    };
  }, [data.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      showToast('Vui lòng nhập tên và lời chúc của bạn!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newWish = await submitWish({
        weddingId: data.id,
        authorName: author.trim(),
        content: content.trim(),
      });

      setWishes((prev) => [newWish, ...prev]);
      setContent('');
      showToast('Lời chúc lượng tử của bạn đã được ghi vào ma trận!', 'success');
    } catch (err) {
      console.warn('Fallback local wish submission:', err);
      const fallbackWish: WishMessage = {
        id: `w-${Date.now()}`,
        weddingId: data.id,
        authorName: author.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        isApproved: true,
      };
      setWishes((prev) => [fallbackWish, ...prev]);
      setContent('');
      showToast('Gửi lời chúc thành công!', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="wishes-matrix"
      className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto text-neutral-200 overflow-hidden font-body"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-futuristic tracking-widest shadow-neon-cyan">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>SỔ LƯU BÚT ĐA CHIỀU // QUANTUM WISHES MATRIX</span>
        </div>

        <h2 className="font-futuristic text-3xl sm:text-5xl font-extrabold tracking-wide text-white">
          Ma Trận Lời Chúc Phúc
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          [Những lời nhắn gửi yêu thương được mã hóa và lưu giữ vĩnh viễn trên tinh cầu]
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form to submit wish */}
        <div className="lg:col-span-5 bg-[#090E26]/90 border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-neon-cyan space-y-6">
          <div className="space-y-1">
            <h3 className="font-futuristic text-xl font-bold text-white">
              Gửi Tín Hiệu Chúc Phúc
            </h3>
            <p className="text-xs text-neutral-400 font-body">
              Để lại dấu ấn của bạn trong sổ lưu bút kỷ nguyên số của hai bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                TÊN QUAN KHÁCH / BIỆT DANH:
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00F0FF]" />
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="VD: Minh Thư & Nhóm Bạn Thân"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#050711]/80 border border-[#00F0FF]/40 focus:border-[#00F0FF] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1">
                NỘI DUNG LỜI CHÚC:
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết những lời chúc ngọt ngào nhất gửi đến cô dâu & chú rể..."
                className="w-full px-4 py-2.5 bg-[#050711]/80 border border-[#00F0FF]/40 focus:border-[#00F0FF] rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#00F0FF] transition-all resize-none"
              />
            </div>

            {/* Quick tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-neutral-400">CHỌN NHANH THÔNG ĐIỆP:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setContent((prev) => (prev ? `${prev} ${tag}` : tag))}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#00F0FF]/20 text-neutral-300 hover:text-[#00F0FF] border border-neutral-700 hover:border-[#00F0FF]/40 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#A855F7] hover:opacity-95 text-[#050711] font-futuristic font-bold text-xs tracking-wider shadow-neon-cyan flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'ĐANG MÃ HÓA & TRUYỀN TÍN HIỆU...' : 'GỬI LỜI CHÚC VÀO MA TRẬN'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Holographic Wishes Feed */}
        <div className="lg:col-span-7 space-y-4 max-h-[560px] overflow-y-auto pr-1">
          {wishes.filter((wish) => wish.isApproved !== false).length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-cyan-300/60 italic bg-[#090E26]/60 rounded-2xl border border-[#00F0FF]/20">
              Chưa có tín hiệu lời chúc nào trong ma trận. Hãy là người đầu tiên truyền tín hiệu nhé!
            </div>
          ) : (
            wishes.filter((wish) => wish.isApproved !== false).map((wish, idx) => (
            <motion.div
              key={wish.id || idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative bg-[#090E26]/90 border border-[#00F0FF]/30 hover:border-[#00F0FF] rounded-2xl p-5 backdrop-blur-xl shadow-sm space-y-2 group transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#A855F7] flex items-center justify-center text-[#050711] font-futuristic font-bold text-xs">
                    {wish.authorName?.charAt(0).toUpperCase() || 'K'}
                  </div>
                  <div>
                    <h4 className="font-futuristic text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                      {wish.authorName}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      TÍN HIỆU XÁC THỰC // 2026
                    </span>
                  </div>
                </div>

                <Heart className="w-4 h-4 text-[#FF2E93] fill-[#FF2E93]/20" />
              </div>

              <p className="text-sm text-neutral-200 font-body leading-relaxed pt-1">
                "{wish.content}"
              </p>
            </motion.div>
          )))}
        </div>
      </div>
    </section>
  );
}
