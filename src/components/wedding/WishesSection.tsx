import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, MessageCircle, Sparkles, User } from 'lucide-react';
import { WishMessage } from '../../types';
import { getWishes, submitWish, toggleWishLike } from '../../services/wishesService';
import { useToast } from '../ui/Toast';

interface WishesSectionProps {
  weddingId: string;
}

export function WishesSection({ weddingId }: WishesSectionProps) {
  const { showToast } = useToast();
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [relation, setRelation] = useState('Bạn bè');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchWishes = () => {
      getWishes(weddingId)
        .then((data) => {
          if (mounted) setWishes(data);
        })
        .catch((err) => {
          console.warn('Could not load wishes from Firestore, using offline fallback:', err);
        });
    };

    fetchWishes();

    const handleUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail?.weddingId || detail.weddingId === weddingId || weddingId.includes(detail.weddingId) || detail.weddingId.includes(weddingId)) {
        fetchWishes();
      }
    };

    window.addEventListener('lamour_wishes_updated', handleUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('lamour_wishes_updated', handleUpdated);
    };
  }, [weddingId]);

  const quickWishes = [
    'Chúc hai bạn trăm năm hạnh phúc, răng long đầu bạc! ❤️',
    'Chúc tình yêu luôn nồng nàn như ngày đầu tiên 🥂',
    'Gia đạo bình an, sớm đón thiên thần nhỏ nhé! 👶',
    'Một đời an yên, cùng nhau già đi thật hạnh phúc 💍',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      showToast('Vui lòng nhập tên của bạn', 'error');
      return;
    }
    if (!content.trim()) {
      showToast('Vui lòng nhập lời chúc của bạn', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newWish = await submitWish({
        weddingId,
        authorName: authorName.trim(),
        relation,
        content: content.trim(),
      });

      // Prepend optimistically
      setWishes((prev) => [newWish, ...prev]);
      setContent('');
      showToast('Cảm ơn bạn! Lời chúc đã được gửi thành công ❤️', 'success');
    } catch (err) {
      console.error('Submit wish error:', err);
      showToast('Có lỗi xảy ra khi gửi lời chúc', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (wishId: string) => {
    try {
      const newCount = await toggleWishLike(weddingId, wishId);
      setWishes((prev) =>
        prev.map((w) => (w.id === wishId ? { ...w, likesCount: newCount } : w))
      );
    } catch {
      // ignore
    }
  };

  return (
    <section id="wishes" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16"
      >
        <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] mb-1">
          Sổ Lưu Bút
        </p>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C2A29] tracking-wide uppercase">
          Wishes & Blessings
        </h2>
        <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />
        <p className="mt-4 text-sm font-body text-neutral-600 max-w-md mx-auto">
          Hãy để lại những lời chúc yêu thương và tốt đẹp nhất để lưu giữ kỷ niệm cùng cô dâu và chú rể nhé.
        </p>
      </motion.div>

      {/* Wishes Input Form */}
      <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] text-[#2C2A29] border-2 border-[#D4AF37]/40 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5 font-body text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-1.5">
                Tên của bạn *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Nhập tên hoặc danh xưng..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm font-medium bg-white text-slate-900 placeholder:text-slate-500 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-1.5">
                Mối quan hệ
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm font-medium bg-white text-slate-900 shadow-inner"
              >
                <option value="Bạn bè" className="bg-white text-slate-900">Bạn bè</option>
                <option value="Đồng nghiệp" className="bg-white text-slate-900">Đồng nghiệp</option>
                <option value="Người thân gia đình" className="bg-white text-slate-900">Người thân gia đình</option>
                <option value="Họ hàng hai bên" className="bg-white text-slate-900">Họ hàng hai bên</option>
                <option value="Anh chị em" className="bg-white text-slate-900">Anh chị em</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#2C2A29] font-bold mb-1.5">
              Lời chúc của bạn *
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Gửi gắm những lời chúc tốt đẹp nhất đến cô dâu & chú rể..."
              className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm font-medium bg-white text-slate-900 placeholder:text-slate-500 shadow-inner resize-none"
            />
          </div>

          {/* Quick suggestion pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#5A4031] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Gợi ý nhanh:
            </span>
            {quickWishes.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setContent(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF3E0] text-[#3D2C2E] hover:text-[#8C7335] font-medium transition-colors border border-[#D4AF37]/40 shadow-2xs cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="pt-2 text-right">
            <button
              id="send-wish-btn"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C8A45D] via-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#8C7335] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Đang gửi...</span>
              ) : (
                <>
                  <span>Gửi lời chúc</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Wishes Display List */}
      <div className="space-y-5 text-left">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
            <span>Lời chúc từ người thân & bạn bè</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-mono text-xs font-bold">
              {wishes.filter((w) => w.isApproved !== false).length}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <AnimatePresence initial={false}>
            {wishes
              .filter((w) => w.isApproved !== false)
              .map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 rounded-3xl bg-[#FFFDF9] text-[#2C2A29] border-2 border-[#D4AF37]/40 shadow-xl hover:border-[#D4AF37] hover:shadow-2xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FAF3E0] border border-[#D4AF37]/50 text-[#8C7335] flex items-center justify-center font-serif-title font-bold text-base shadow-xs shrink-0">
                          {wish.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-serif-title text-base sm:text-lg font-bold text-[#1A1816] leading-tight">
                            {wish.authorName}
                          </h4>
                          {wish.relation && (
                            <span className="text-[11px] font-semibold text-[#8C7335] bg-[#FAF3E0] px-2 py-0.5 rounded-md border border-[#D4AF37]/30 inline-block mt-0.5">
                              {wish.relation}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleLike(wish.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer shadow-2xs"
                        title="Thả tim lời chúc"
                        aria-label="Thả tim lời chúc"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span className="font-mono text-rose-700 font-bold">{wish.likesCount || 1}</span>
                      </button>
                    </div>

                    <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#D4AF37]/25 my-2">
                      <p className="font-body text-sm sm:text-base font-medium text-[#2C2A29] leading-relaxed italic">
                        "{wish.content}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t-2 border-[#EADFC7] flex items-center justify-between text-xs font-body">
                    <span className="font-mono font-semibold text-[#5A4031]">
                      📅 {new Date(wish.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="font-bold text-[#8C7335] tracking-wider uppercase text-[11px]">
                      L'Amour Wedding
                    </span>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {wishes.filter((w) => w.isApproved !== false).length === 0 && (
          <div className="py-12 text-center text-neutral-300 bg-black/40 rounded-3xl border border-neutral-800 p-8">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 text-[#D4AF37] opacity-60" />
            <p className="text-sm font-body font-medium text-slate-300">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé!</p>
          </div>
        )}
      </div>
    </section>
  );
}
