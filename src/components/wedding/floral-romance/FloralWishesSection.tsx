import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { WishMessage } from '../../../types';
import { getWishes, submitWish, toggleWishLike } from '../../../services/wishesService';
import { FloralDivider } from './FloralOrnaments';
import { useToast } from '../../ui/Toast';
import { Heart, Send, MessageCircleHeart, Sparkles } from 'lucide-react';

interface FloralWishesSectionProps {
  weddingId: string;
}

export function FloralWishesSection({ weddingId }: FloralWishesSectionProps) {
  const { showToast } = useToast();
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [relation, setRelation] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWishes = async () => {
    try {
      const data = await getWishes(weddingId);
      setWishes(data || []);
    } catch (e) {
      console.error('Failed to load wishes:', e);
    }
  };

  useEffect(() => {
    fetchWishes();

    const handleUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail?.weddingId || detail.weddingId === weddingId || weddingId.includes(detail.weddingId) || detail.weddingId.includes(weddingId)) {
        fetchWishes();
      }
    };

    window.addEventListener('lamour_wishes_updated', handleUpdated);
    return () => {
      window.removeEventListener('lamour_wishes_updated', handleUpdated);
    };
  }, [weddingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      showToast('Vui lòng nhập tên và lời chúc của bạn', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const newWish = await submitWish({
        weddingId,
        authorName: authorName.trim(),
        relation: relation.trim() || 'Bạn bè',
        content: content.trim(),
      });

      setWishes((prev) => [newWish, ...prev]);
      setAuthorName('');
      setRelation('');
      setContent('');
      showToast('Cảm ơn bạn đã gửi lời chúc mừng!', 'success');
    } catch (e) {
      showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (wishId: string) => {
    try {
      await toggleWishLike(weddingId, wishId);
      setWishes((prev) =>
        prev.map((w) =>
          w.id === wishId ? { ...w, likesCount: (w.likesCount || 0) + 1 } : w
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="wishes" className="relative py-20 sm:py-28 bg-[#FFFDFD] overflow-hidden">
      {/* Background Soft Pastel Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#FDECEF]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F6EDE0]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-semibold font-body">
            GUESTBOOK & BLESSINGS
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#3E2E31] font-normal italic">
            Sổ Lưu Bút Chúc Phúc
          </h2>
          <FloralDivider className="w-48 mx-auto my-3" />
          <p className="text-sm font-body text-[#7A696B] leading-relaxed">
            Hãy gửi gắm những lời chúc yêu thương nhất để lưu lại dấu ấn kỷ niệm ngày vui của hai chúng mình.
          </p>
        </motion.div>

        {/* Input Form & List Layout */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Wish Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#F2DCDD] shadow-sm relative"
          >
            {/* Fine gold corner accents */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#D4AF37]/50" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#D4AF37]/50" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#D4AF37]/50" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#D4AF37]/50" />

            <h3 className="font-serif-title text-2xl text-[#3E2E31] font-medium mb-4 flex items-center gap-2">
              <MessageCircleHeart className="w-5 h-5 text-[#D97D8A]" />
              <span>Gửi Lời Chúc Mừng</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block font-semibold text-[#5A4549]">
                  Tên của bạn <span className="text-[#D97D8A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ví dụ: Bạn Thanh Hương"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DCDD] focus:border-[#D4AF37] outline-none text-[#3E2E31] bg-[#FFFCFA]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#5A4549]">
                  Mối quan hệ
                </label>
                <input
                  type="text"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="Ví dụ: Bạn thân cô dâu / Đồng nghiệp chú rể"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DCDD] focus:border-[#D4AF37] outline-none text-[#3E2E31] bg-[#FFFCFA]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#5A4549]">
                  Lời chúc tốt đẹp <span className="text-[#D97D8A]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long..."
                  className="w-full p-3.5 rounded-xl border border-[#F2DCDD] focus:border-[#D4AF37] outline-none text-[#3E2E31] bg-[#FFFCFA] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D97D8A] to-[#E29578] hover:from-[#C96B78] hover:to-[#D08467] text-white font-semibold tracking-wider uppercase text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'ĐANG GỬI...' : 'GỬI LỜI CHÚC PHÚC'}</span>
              </button>
            </form>
          </motion.div>

          {/* Wishes List Display */}
          <div className="lg:col-span-7 space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {wishes.filter((wish) => wish.isApproved !== false).length === 0 ? (
              <div className="bg-white/80 rounded-3xl p-8 text-center border border-[#F2DCDD] space-y-2">
                <Sparkles className="w-6 h-6 text-[#D97D8A] mx-auto opacity-70" />
                <p className="text-sm font-serif-title text-[#7A696B]">
                  Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc phúc nhé!
                </p>
              </div>
            ) : (
              wishes.filter((wish) => wish.isApproved !== false).map((wish, idx) => (
                <motion.div
                  key={wish.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white/90 rounded-2xl p-5 border border-[#F2DCDD] shadow-xs hover:shadow-md transition-all space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-title text-base text-[#3E2E31] font-medium">
                        {wish.authorName}
                      </h4>
                      {wish.relation && (
                        <span className="text-[11px] font-body text-[#C9A86A] font-medium">
                          {wish.relation}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleLike(wish.id)}
                      className="inline-flex items-center gap-1 text-xs text-[#D97D8A] hover:text-[#C2185B] transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-[#FCE4EC] hover:fill-[#D97D8A]" />
                      <span>{wish.likesCount || 0}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-body text-[#5A4549] leading-relaxed pt-1">
                    "{wish.content}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
