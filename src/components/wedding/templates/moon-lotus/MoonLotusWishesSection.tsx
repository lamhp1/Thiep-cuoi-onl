import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Send, MessageCircle } from 'lucide-react';
import { ArtisticBloomingLotus, playMoonlightChime } from './MoonLotusOrnaments';
import { getWishes, submitWish } from '../../../../services/wishesService';
import { WishMessage } from '../../../../types';

interface MoonLotusWishesSectionProps {
  weddingId?: string;
  groomName?: string;
  brideName?: string;
}

export function MoonLotusWishesSection({
  weddingId = 'demo-wedding',
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: MoonLotusWishesSectionProps) {
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [senderName, setSenderName] = useState('');
  const [wishText, setWishText] = useState('');
  const [justDropped, setJustDropped] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchWishes = () => {
      getWishes(weddingId)
        .then((items) => {
          if (mounted) setWishes(items || []);
        })
        .catch((err) => {
          console.warn('Wishes load error:', err);
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

  const handleDropLotusWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !wishText.trim()) return;

    playMoonlightChime();
    setJustDropped(true);

    try {
      const newWish = await submitWish({
        weddingId,
        authorName: senderName.trim(),
        relation: 'Khách quý',
        content: wishText.trim(),
      });
      setWishes((prev) => [newWish, ...prev.filter((w) => w.id !== newWish.id)]);
      setSenderName('');
      setWishText('');
    } catch (e) {
      console.warn('Error submitting wish:', e);
    }

    setTimeout(() => {
      setJustDropped(false);
    }, 2500);
  };

  const activeWishes = wishes.filter((w) => w.isApproved !== false);

  return (
    <section id="wishes" className="relative py-20 px-4 sm:px-6 z-20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#EBD494]" />
            <span>Sổ Lưu Bút Dạ Nguyệt</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#FFFDF7]">
            Thả Hoa Sen Cầu Chúc
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#F4E4BA]/80">
            “Mỗi lời chúc là một đóa sen hoa đăng trôi nhẹ trên mặt hồ trăng, mang theo bình an và phước lành.”
          </p>
        </div>

        {/* Input Card to Drop Lotus */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#0E122A]/90 border border-[#EBD494]/40 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleDropLotusWish} className="space-y-4 font-serif text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#F4E4BA] mb-2 font-semibold tracking-wide">
                  Tên của bạn
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lê Minh Tâm"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#141A36] border border-[#EBD494]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#EBD494]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="cursor-pointer w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#751A29] to-[#A8283D] hover:from-[#8C2033] hover:to-[#B83047] text-white font-serif font-bold uppercase tracking-wider text-xs shadow-md border border-[#EBD494]/60 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#F4E4BA]" />
                  <span>Thả Hoa Đăng Sen</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#F4E4BA] mb-2 font-semibold tracking-wide">
                Lời chúc phúc
              </label>
              <textarea
                rows={2}
                required
                placeholder={`Gửi gắm lời chúc trăm năm hạnh phúc tới ${groomName} & ${brideName}...`}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#141A36] border border-[#EBD494]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#EBD494] resize-none"
              />
            </div>
          </form>

          {justDropped && (
            <div className="mt-4 p-3 rounded-2xl bg-[#EBD494]/20 border border-[#EBD494]/40 text-[#FFFDF7] text-center text-xs font-serif flex items-center justify-center gap-2 animate-fadeIn">
              <ArtisticBloomingLotus size={35} bloomProgress={1} />
              <span>Đóa hoa sen chở lời chúc của bạn đã nhẹ nhàng trôi vào hồ trăng!</span>
            </div>
          )}
        </div>

        {/* Floating Wishes Pond Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-serif text-[#EBD494]/80 uppercase tracking-widest px-2">
            <MessageCircle className="w-4 h-4" />
            <span>Những cánh sen chúc phúc ({activeWishes.length})</span>
          </div>

          {activeWishes.length === 0 ? (
            <div className="p-8 text-center text-xs font-serif text-[#F4E4BA]/60 italic bg-[#10142E]/50 rounded-2xl border border-[#EBD494]/20">
              Chưa có đóa sen chúc phúc nào. Hãy là người đầu tiên thả hoa đăng gửi lời chúc nhé!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeWishes.map((w) => (
                <div
                  key={w.id}
                  className="relative rounded-2xl p-5 bg-[#10142E]/80 border border-[#EBD494]/25 shadow-lg backdrop-blur-md space-y-2 hover:border-[#EBD494]/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#FFFDF7] text-sm">
                      {w.authorName}
                    </span>
                    <span className="text-[10px] font-serif text-[#EBD494]/70">
                      {w.createdAt ? new Date(w.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay'}
                    </span>
                  </div>

                  <p className="font-serif text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                    “{w.content}”
                  </p>

                  <div className="flex justify-end pt-1">
                    <ArtisticBloomingLotus size={32} bloomProgress={0.8} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
