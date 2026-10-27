import React, { useState } from 'react';
import { SparklingStar, LotusNightIcon, HoiAnGlobeLantern, AuthenticSkyLantern } from './LanternNightOrnaments';
import { Send, Heart, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playLanternWindChime } from './LanternAudioBar';

export interface LanternWishItem {
  id: string;
  authorName?: string;
  author?: string;
  content: string;
  createdAt?: string;
}

interface LanternWishesSectionProps {
  wishes?: LanternWishItem[];
  onAddWish: (wish: { author: string; content: string }) => void;
}

interface ReleasedSkyLantern {
  id: number;
  author: string;
  content: string;
}

export function LanternWishesSection({ wishes = [], onAddWish }: LanternWishesSectionProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [justReleased, setJustReleased] = useState(false);
  const [releasedLanterns, setReleasedLanterns] = useState<ReleasedSkyLantern[]>([]);

  const defaultWishes: LanternWishItem[] = [
    {
      id: 'wish-1',
      author: 'Anh Tuấn & Chị Thảo',
      content: 'Chúc Minh Anh & Ngọc Mai trăm năm hạnh phúc, con đàn cháu đống, cuộc sống lúc nào cũng tràn ngập tiếng cười và rực rỡ như đêm hội đèn lồng này nhé!',
      createdAt: '1 giờ trước',
    },
    {
      id: 'wish-2',
      author: 'Bác Ba (Đà Nẵng)',
      content: 'Mừng ngày vui của hai cháu. Chúc hai cháu luôn nhường nhịn, yêu thương, cùng xây đắp tổ ấm vững bền trăm năm!',
      createdAt: '3 giờ trước',
    },
    {
      id: 'wish-3',
      author: 'Nhóm bạn thân Đại học',
      content: 'Chúc mừng chú rể đẹp trai nhất quả đất đã rước được nàng thơ về dinh! Chúc đôi bạn trẻ sớm có thêm thành viên nhí đáng yêu!',
      createdAt: '5 giờ trước',
    },
  ];

  const presetGreetings = [
    'Trăm năm hạnh phúc, vĩnh kết đồng tâm ✦',
    'Loan phụng hòa minh, gia đạo bình an ✦',
    'Sớm đón thiên thần nhỏ, trọn vẹn yêu thương ✦',
    'Mãi mãi ấm áp như ngọn đèn lồng đêm hội ✦',
  ];

  const displayWishes = wishes && wishes.length > 0 ? wishes : defaultWishes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    onAddWish({
      author,
      content,
    });

    // 1. Play chime
    playLanternWindChime();

    // 2. Confetti sparks
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FDE68A', '#D97706'],
      });
    } catch {
      // ignore
    }

    // 3. Add rising sky lantern
    const newSkyLantern: ReleasedSkyLantern = {
      id: Date.now(),
      author,
      content: content.length > 35 ? content.slice(0, 32) + '...' : content,
    };
    setReleasedLanterns((prev) => [...prev, newSkyLantern]);

    setJustReleased(true);
    setAuthor('');
    setContent('');

    setTimeout(() => {
      setJustReleased(false);
    }, 4000);
  };

  return (
    <section id="wishes" className="relative py-24 px-4 sm:px-6 max-w-5xl mx-auto overflow-hidden">
      {/* Floating Sky Lanterns Released by User */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {releasedLanterns.map((l, i) => (
          <div
            key={l.id}
            className={`absolute bottom-10 ${
              i % 3 === 0
                ? 'animate-lantern-drift-left'
                : i % 3 === 1
                ? 'animate-lantern-drift-right'
                : 'animate-lantern-drift-zigzag'
            }`}
            style={{
              left: `${15 + (i % 6) * 14}%`,
              animationDuration: '7s',
            }}
          >
            <div className="relative flex flex-col items-center">
              <AuthenticSkyLantern
                className="w-20 h-30 sm:w-24 sm:h-36"
                colorVariant={i % 2 === 0 ? 'gold' : 'amber'}
                scale={1.1}
              />
              <div className="absolute inset-x-2 top-6 text-center px-1">
                <span className="block text-[10px] font-bold text-amber-950 uppercase line-clamp-1 drop-shadow-xs">
                  {l.author}
                </span>
                <span className="block text-[9px] font-serif italic text-amber-900 leading-tight line-clamp-2 px-1">
                  {l.content}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif uppercase tracking-widest backdrop-blur-md shadow-md">
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Sổ Lưu Bút Dạ Đăng</span>
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-100 animate-gold-shimmer">
          Thả Đèn Lồng Gửi Nguyện Ước
        </h2>
        <p className="font-serif italic text-sm sm:text-base text-neutral-300 max-w-lg mx-auto">
          Mỗi lời chúc phúc là một ngọn thiên đăng bay cao vào dải ngân hà, thắp sáng may mắn và an lành cho đôi uyên ương.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Form Box (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-neutral-950/85 border border-amber-500/40 p-6 sm:p-7 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {justReleased && (
            <div className="absolute inset-0 bg-neutral-950/98 z-20 flex flex-col items-center justify-center p-6 text-center space-y-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-amber-500/25 text-amber-400 flex items-center justify-center animate-bounce shadow-[0_0_25px_rgba(245,158,11,0.8)]">
                <Flame className="w-7 h-7" />
              </div>
              <p className="font-serif-title text-xl font-bold text-amber-200">
                Đèn Lồng Của Bạn Đã Bay Lên Trời!
              </p>
              <p className="text-xs text-neutral-300 leading-relaxed font-serif">
                Nguyện ước chân thành đã hóa thành ánh sáng rạng ngời dẫn lối cho tân lang và tân nương.
              </p>
            </div>
          )}

          <h3 className="font-serif-title text-lg font-bold text-amber-100 mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Thắp Đèn Gửi Lời Chúc</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-amber-300 mb-1.5">
                Tên hoặc danh xưng của bạn
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ví dụ: Anh Tuấn &amp; Chị Thảo"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-amber-500/30 focus:border-amber-400 text-amber-100 text-sm focus:outline-none transition-colors"
              />
            </div>

            {/* Quick Greeting Presets */}
            <div className="space-y-1">
              <label className="block text-[11px] font-serif uppercase tracking-wider text-neutral-400">
                Gợi ý lời chúc nhanh
              </label>
              <div className="flex flex-wrap gap-1.5">
                {presetGreetings.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setContent(preset)}
                    className="text-[10px] font-serif px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 text-amber-300 hover:border-amber-400 hover:bg-amber-900/60 transition-colors text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-amber-300 mb-1.5">
                Lời chúc phúc chân tình
              </label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Viết những lời yêu thương chân thành gửi đến tân lang và tân nương..."
                className="w-full p-3.5 rounded-xl bg-neutral-900 border border-amber-500/30 focus:border-amber-400 text-amber-100 text-sm focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-3.5 rounded-full bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-serif-title font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_30px_rgba(245,158,11,0.9)] flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Thả Đèn Lồng Lên Bầu Trời</span>
            </button>
          </form>
        </div>

        {/* Wishes Floating Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4 max-h-[540px] overflow-y-auto pr-1">
          {displayWishes.map((w, idx) => (
            <div
              key={w.id || idx}
              className="rounded-2xl bg-neutral-950/75 border border-amber-500/30 p-5 backdrop-blur-md hover:border-amber-400/60 transition-all shadow-lg space-y-2 group hover:bg-neutral-950/90"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,1)] animate-pulse" />
                  <span className="font-serif-title font-bold text-sm text-amber-200">
                    {w.authorName || w.author || 'Khách quý'}
                  </span>
                </div>
                {w.createdAt && (
                  <span className="text-[10px] text-neutral-400 font-serif">
                    {w.createdAt}
                  </span>
                )}
              </div>

              <p className="font-body text-xs sm:text-sm text-neutral-300 leading-relaxed pl-4 border-l-2 border-amber-500/40">
                {w.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
