import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WishMessage } from '../../../types';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperFrameCorner,
  TraditionalDivider,
} from './TraditionalOrnaments';
import { MessageCircle, Send, Heart, Sparkles, User } from 'lucide-react';
import { getWishes, submitWish, toggleWishLike } from '../../../services/wishesService';
import { useToast } from '../../ui/Toast';

interface TraditionalWishesSectionProps {
  weddingId?: string;
  groomName?: string;
  brideName?: string;
}

export function TraditionalWishesSection({
  weddingId = 'demo-wedding',
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: TraditionalWishesSectionProps) {
  const { showToast } = useToast();
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('Bạn bè');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const fetched = await getWishes(weddingId);
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
      if (!detail?.weddingId || detail.weddingId === weddingId || weddingId.includes(detail.weddingId) || detail.weddingId.includes(weddingId)) {
        load();
      }
    };

    window.addEventListener('lamour_wishes_updated', handleUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('lamour_wishes_updated', handleUpdated);
    };
  }, [weddingId]);

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      showToast('Vui lòng nhập tên và lời chúc phúc.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newWish = await submitWish({
        weddingId,
        authorName: author.trim(),
        relation,
        content: content.trim(),
      });
      setWishes((prev) => [newWish, ...prev]);
      setAuthor('');
      setContent('');
      showToast('Cảm ơn lời chúc phúc tốt lành của quý khách!', 'success');
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (wishId: string) => {
    try {
      await toggleWishLike(weddingId, wishId);
      setWishes((prev) =>
        prev.map((w) => (w.id === wishId ? { ...w, likesCount: (w.likesCount || 0) + 1 } : w))
      );
    } catch {
      // ignore
    }
  };

  return (
    <section id="wishes" className="relative py-20 sm:py-24 bg-[#FAF6EE] text-[#3D1A1E] overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BA1E28]/10 border border-[#BA1E28]/25 text-[#BA1E28] text-xs font-semibold uppercase tracking-widest">
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28]" />
            <span>Sổ Lưu Bút Hỷ Sự</span>
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28] scale-x-[-1]" />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B1119] tracking-wide">
            Chúc Phúc Trăm Năm
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#735154] max-w-md mx-auto leading-relaxed">
            Những lời chúc tốt lành, tình cảm chân thành từ quý thân hữu là món quà tinh thần quý giá nhất đối với cô dâu và chú rể.
          </p>

          <TraditionalDivider className="mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột gửi lời chúc (Form) */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border-2 border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(186,30,40,0.06)]">
              <PaperFrameCorner position="top-left" className="top-2 left-2 w-5 h-5 text-[#D4AF37]" />
              <PaperFrameCorner position="top-right" className="top-2 right-2 w-5 h-5 text-[#D4AF37]" />
              <PaperFrameCorner position="bottom-left" className="bottom-2 left-2 w-5 h-5 text-[#D4AF37]" />
              <PaperFrameCorner position="bottom-right" className="bottom-2 right-2 w-5 h-5 text-[#D4AF37]" />

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#BA1E28]/10 text-[#BA1E28] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-title text-lg font-bold text-[#8B1119]">
                    Gửi Lời Chúc Phúc
                  </h3>
                  <span className="text-[11px] text-[#A66D29] font-medium block">
                    Khắc ghi tình cảm son sắt
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitWish} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1">
                    Tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nhập họ tên của bạn..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF5EA] border border-[#E0D3BC] focus:border-[#BA1E28] text-xs text-[#1A1816] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1">
                    Mối quan hệ
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF5EA] border border-[#E0D3BC] focus:border-[#BA1E28] text-xs text-[#1A1816] outline-none cursor-pointer"
                  >
                    <option value="Bạn chú rể">Bạn chú rể</option>
                    <option value="Bạn cô dâu">Bạn cô dâu</option>
                    <option value="Bạn bè">Bạn bè thân thiết</option>
                    <option value="Đồng nghiệp">Đồng nghiệp</option>
                    <option value="Họ hàng">Họ hàng thân tộc</option>
                    <option value="Khách quý">Khách quý</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-serif-title font-bold uppercase tracking-wider text-[#8B1119] mb-1">
                    Lời chúc phúc yêu thương *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`Gửi những lời tốt đẹp nhất đến ${groomName} & ${brideName}...`}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF5EA] border border-[#E0D3BC] focus:border-[#BA1E28] text-xs text-[#1A1816] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#BA1E28] via-[#A61C24] to-[#8B1119] text-white font-serif-title text-sm font-bold tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition-all"
                >
                  <SongHyGlyph className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Lời Chúc'}</span>
                  <Send className="w-3.5 h-3.5 text-[#FFD700]" />
                </button>
              </form>
            </div>
          </div>

          {/* Cột danh sách lời chúc */}
          <div className="lg:col-span-7">
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              <AnimatePresence>
                {wishes.filter((w) => w.isApproved !== false).length === 0 ? (
                  <div className="p-6 text-center text-sm text-[#5C3D40]/70 italic bg-[#FFFDF9] rounded-2xl border border-[#D4AF37]/30">
                    Chưa có lời chúc nào được hiển thị. Hãy là người đầu tiên gửi lời chúc phúc nhé!
                  </div>
                ) : (
                  wishes.filter((w) => w.isApproved !== false).map((w, idx) => (
                  <motion.div
                    key={w.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="relative bg-[#FFFDF9] rounded-2xl p-5 border border-[#D4AF37]/40 shadow-2xs hover:shadow-xs transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#BA1E28]/10 border border-[#BA1E28]/25 text-[#BA1E28] flex items-center justify-center font-serif-title font-bold text-xs">
                          {(w.authorName || 'K').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-serif-title text-sm font-bold text-[#8B1119] block">
                            {w.authorName}
                          </span>
                          <span className="text-[10px] text-[#A66D29] font-medium block">
                            {w.relation}
                          </span>
                        </div>
                      </div>

                      {/* Heart Button */}
                      <button
                        onClick={() => handleLike(w.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF5EA] hover:bg-[#FBEED1] text-[#BA1E28] text-xs font-semibold transition-colors cursor-pointer border border-[#EADBBE]"
                        title="Thả tim lời chúc"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#BA1E28]/20" />
                        <span>{w.likesCount || 0}</span>
                      </button>
                    </div>

                    <p className="font-body text-xs sm:text-sm text-[#5C3D40] leading-relaxed pl-9">
                      “{w.content}”
                    </p>
                  </motion.div>
                )))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
