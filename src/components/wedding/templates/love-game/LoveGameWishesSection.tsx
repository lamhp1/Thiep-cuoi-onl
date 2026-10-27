import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, Send, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { WishMessage } from '../../../../types';
import { getWishes, submitWish } from '../../../../services/wishesService';
import { playPointChime } from './loveGameSounds';

interface LoveGameWishesSectionProps {
  weddingId: string;
  isCompleted: boolean;
  onCompleteQuest: () => void;
  onAddBonusPoints?: (amount: number, reason: string) => void;
  onCompleteQuestWithPoints?: (questId: string, customMsg?: string, points?: number) => void;
}

export function LoveGameWishesSection({
  weddingId,
  isCompleted,
  onCompleteQuest,
  onAddBonusPoints,
  onCompleteQuestWithPoints,
}: LoveGameWishesSectionProps) {
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('❤️');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedWishIds, setLikedWishIds] = useState<Set<string>>(new Set());

  const stickers = ['❤️', '💍', '🥂', '🎉', '🌟', '🕊️'];

  const getWishRewardInfo = (text: string) => {
    const len = text.trim().length;
    if (len === 0) {
      return {
        points: 10,
        tier: 'Khởi đầu',
        label: '+10 PTS',
        nextHint: 'Viết từ 30 ký tự để đạt +20 PTS ✨',
        progress: 0,
        color: 'text-neutral-400',
        badgeBg: 'bg-white/10 text-neutral-300 border-white/15',
      };
    }
    if (len < 30) {
      return {
        points: 10,
        tier: 'Lời chúc ngắn',
        label: '+10 PTS',
        nextHint: `Cần thêm ${30 - len} ký tự để nhận +20 PTS ✨`,
        progress: Math.min(100, Math.round((len / 30) * 100)),
        color: 'text-pink-300',
        badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      };
    }
    if (len < 70) {
      return {
        points: 20,
        tier: 'Lời chúc ngọt ngào',
        label: '+20 PTS (+10 Bonus)',
        nextHint: `Cần thêm ${70 - len} ký tự để nhận +35 PTS 💖`,
        progress: Math.min(100, Math.round(((len - 30) / 40) * 100)),
        color: 'text-amber-300',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }
    if (len < 130) {
      return {
        points: 35,
        tier: 'Lời chúc ấm áp',
        label: '+35 PTS (+25 Bonus)',
        nextHint: `Cần thêm ${130 - len} ký tự để nhận +50 PTS 🌟`,
        progress: Math.min(100, Math.round(((len - 70) / 60) * 100)),
        color: 'text-purple-300',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      };
    }
    if (len < 200) {
      return {
        points: 50,
        tier: 'Lời chúc siêu tâm huyết',
        label: '+50 PTS (+40 Bonus)',
        nextHint: `Cần thêm ${200 - len} ký tự để đạt mức Kỷ Lục +70 PTS 🔥`,
        progress: Math.min(100, Math.round(((len - 130) / 70) * 100)),
        color: 'text-rose-300',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      };
    }
    return {
      points: 70,
      tier: 'Đại sứ tình yêu vô cực 🔥',
      label: '+70 PTS (KỶ LỤC TÂM HUYẾT)',
      nextHint: 'Đã đạt mức điểm tối thượng cho lời chúc! 🎉',
      progress: 100,
      color: 'text-amber-300',
      badgeBg: 'bg-gradient-to-r from-amber-500/30 to-pink-500/30 text-amber-200 border-amber-400/50',
    };
  };

  const currentReward = getWishRewardInfo(content);

  const defaultWishes: WishMessage[] = [
    {
      id: 'w-1',
      weddingId,
      authorName: 'Hoàng Lâm (Bạn thân)',
      relation: 'Bạn bè',
      content: 'Chúc đôi bạn trẻ trăm năm hạnh phúc, mãi mãi bên nhau và yêu thương nhau nhiều hơn mỗi ngày!',
      createdAt: 'Vừa xong',
      likesCount: 12,
    },
    {
      id: 'w-2',
      weddingId,
      authorName: 'Thùy Chi & Nhóm Bạn Đại Học',
      relation: 'Bạn cô dâu',
      content: 'Chúc mừng công chúa Ngọc Mai đã tìm được hoàng tử của đời mình. Hai bạn quá đẹp đôi!',
      createdAt: '1 giờ trước',
      likesCount: 9,
    },
    {
      id: 'w-3',
      weddingId,
      authorName: 'Anh Tuấn & Gia đình',
      relation: 'Họ hàng',
      content: 'Chúc hai cháu đầu bạc răng long, gia đạo ấm êm, thuận hòa và vạn sự như ý.',
      createdAt: '3 giờ trước',
      likesCount: 15,
    },
  ];

  useEffect(() => {
    let mounted = true;
    getWishes(weddingId || 'demo-wedding')
      .then((data) => {
        if (mounted && data.length > 0) {
          setWishes(data);
        } else if (mounted) {
          setWishes(defaultWishes);
        }
      })
      .catch(() => {
        if (mounted) setWishes(defaultWishes);
      });
    return () => {
      mounted = false;
    };
  }, [weddingId]);

  const handleLikeWish = (wishId: string) => {
    playPointChime();
    setLikedWishIds((prev) => {
      const next = new Set(prev);
      next.add(wishId);
      return next;
    });
    setWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, likesCount: (w.likesCount || 0) + 1 } : w))
    );
    if (onAddBonusPoints) {
      onAddBonusPoints(1, '+1 Love Point: Thả tim lời chúc! 💖');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    const reward = getWishRewardInfo(content);
    setIsSubmitting(true);
    try {
      const newWish = await submitWish({
        weddingId: weddingId || 'demo-wedding',
        authorName: authorName.trim(),
        relation: 'Khách quý',
        content: `${selectedSticker} ${content.trim()}`,
      });
      setWishes((prev) => [newWish, ...prev]);
      setContent('');
      playPointChime();
      if (onCompleteQuestWithPoints) {
        onCompleteQuestWithPoints('quest-wishes', `+${reward.points} Love Points: ${reward.tier}! ✨`, reward.points);
      } else {
        onCompleteQuest();
      }
    } catch {
      const fallbackWish: WishMessage = {
        id: `w-${Date.now()}`,
        weddingId,
        authorName: authorName.trim(),
        relation: 'Khách quý',
        content: `${selectedSticker} ${content.trim()}`,
        createdAt: 'Vừa xong',
        likesCount: 1,
      };
      setWishes((prev) => [fallbackWish, ...prev]);
      setContent('');
      playPointChime();
      if (onCompleteQuestWithPoints) {
        onCompleteQuestWithPoints('quest-wishes', `+${reward.points} Love Points: ${reward.tier}! ✨`, reward.points);
      } else {
        onCompleteQuest();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quest-wishes" className="relative py-24 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Section Header with Quest Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold tracking-wider uppercase">
            <MessageSquareHeart className="w-3.5 h-3.5 text-pink-400" />
            <span>SỔ LƯU BÚT TÌNH YÊU • CHÚC PHÚC ONLINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Gửi Ngàn Lời Chúc Phúc
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            Hãy để lại vài dòng yêu thương và chọn một icon may mắn gửi đến Minh Anh &amp; Ngọc Mai nhé!
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border border-pink-500/30 text-pink-200 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Đặc quyền điểm số: <strong>Lời chúc càng dài &amp; tâm huyết càng nhận nhiều điểm! (Lên đến +70 PTS)</strong></span>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-[#16132A]/90 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Tên của bạn hoặc biệt danh..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
              />

              {/* Sticker Selector */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-mono text-neutral-400">Icon:</span>
                <div className="flex items-center gap-1.5">
                  {stickers.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSticker(s)}
                      className={`text-base p-1 rounded-lg transition-transform cursor-pointer ${
                        selectedSticker === s ? 'scale-125 bg-white/20' : 'hover:scale-110'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết lời chúc ngọt ngào, ấm áp gửi đến tân lang & tân nương (lời chúc càng dài càng nhiều điểm)..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-pink-500 transition-colors resize-none"
              />

              {/* Dynamic Points Reward Indicator */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 font-mono">Độ dài: <strong className="text-white">{content.trim().length}</strong> ký tự</span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold font-mono ${currentReward.badgeBg}`}>
                      {currentReward.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-neutral-400 text-[11px]">Thưởng hoàn tất:</span>
                    <span className="text-sm font-black text-amber-300">+{currentReward.points} LOVE POINTS</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-0.5">
                  <p className="text-[11px] text-neutral-400 italic">
                    {currentReward.nextHint}
                  </p>
                  <div className="w-28 sm:w-40 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 via-purple-400 to-amber-300 rounded-full transition-all duration-300"
                      style={{ width: `${currentReward.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-neutral-950 font-black text-sm shadow-xl transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-neutral-950" />
              <span>Gửi Lời Chúc Phúc Lên Bảng Vàng (+{currentReward.points} PTS) 💌</span>
            </button>
          </form>
        </div>

        {/* Wishes Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest text-left">
              Lời Chúc Từ Bạn Bè &amp; Người Thân ({wishes.filter((w) => w.isApproved !== false).length})
            </h4>
            <span className="text-[11px] font-mono text-pink-300/80">
              💡 Thả tim lời chúc người khác để nhận +1 PTS/lần
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {wishes.filter((w) => w.isApproved !== false).map((w) => {
              const isLiked = likedWishIds.has(w.id);
              return (
                <div
                  key={w.id}
                  className="bg-[#16132A]/70 border border-white/10 rounded-2xl p-4 backdrop-blur-md space-y-3 hover:border-pink-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-300 font-bold text-xs flex items-center justify-center">
                        {w.authorName.charAt(0)}
                      </span>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-white">
                          {w.authorName}
                        </h5>
                        {w.relation && (
                          <span className="text-[10px] text-pink-400 font-mono">
                            {w.relation}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {w.createdAt || 'Vừa xong'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    {w.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono text-neutral-500">
                      {w.content.length > 80 ? '⭐ Lời chúc tâm huyết' : '❤️ Lời chúc yêu thương'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleLikeWish(w.id)}
                      className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                        isLiked
                          ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50'
                          : 'bg-white/5 hover:bg-pink-500/20 text-neutral-400 hover:text-pink-300 border border-white/10'
                      }`}
                      title="Thả tim nhận +1 PTS"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-400 text-pink-400' : 'text-neutral-400'}`} />
                      <span>{w.likesCount || 0}</span>
                      <span className="text-[9px] text-pink-300 font-bold pl-0.5">+1 PTS</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
