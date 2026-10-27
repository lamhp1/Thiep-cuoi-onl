import React, { useState } from 'react';
import { Heart, Sparkles, Shield, Zap, Flame, Award, ChevronDown } from 'lucide-react';
import { CouplePerson } from '../../../../types';
import { playPointChime } from './loveGameSounds';

interface LoveGameHeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  romanticQuote?: string;
  groom?: CouplePerson;
  bride?: CouplePerson;
  coverImage?: string;
  onUnlockPoints: (questId: string, pts: number, msg: string) => void;
  onScrollToNext: () => void;
}

export function LoveGameHero({
  groomName,
  brideName,
  weddingDate,
  romanticQuote,
  groom,
  bride,
  coverImage,
  onUnlockPoints,
  onScrollToNext,
}: LoveGameHeroProps) {
  const [synergyScore, setSynergyScore] = useState(999);
  const [boostCount, setBoostCount] = useState(0);

  const handleBoostAffinity = () => {
    playPointChime();
    setSynergyScore((prev) => prev + 10);
    const newCount = boostCount + 1;
    setBoostCount(newCount);

    if (newCount === 1) {
      onUnlockPoints('affinity-boost', 10, '+10 Love Points: Tăng Chỉ Số Tương Hợp! 💖');
    } else {
      onUnlockPoints(`affinity-boost-${newCount}`, 2, `+2 Love Points: Combo Thả Tim x${newCount}! 🔥`);
    }
  };

  const groomAvatar = groom?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
  const brideAvatar = bride?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-pink-500/20 via-purple-600/10 to-transparent blur-[140px]" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-rose-500/15 blur-[100px]" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center space-y-8 sm:space-y-12">
        {/* Game Title Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-pink-300 text-xs sm:text-sm font-mono font-semibold tracking-wider uppercase backdrop-blur-md shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>LOVE QUEST 2026 • CÙNG CHƠI MỘT TRÒ CHƠI</span>
        </div>

        {/* Big Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200">
              {groomName}
            </span>
            <span className="mx-3 text-pink-500 font-light">&amp;</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-pink-400">
              {brideName}
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-mono tracking-widest text-neutral-300 uppercase">
            WEDDING DAY • {weddingDate} • SAVE THE DATE
          </p>
        </div>

        {/* Romantic Quote Dialog Box */}
        {romanticQuote && (
          <div className="max-w-2xl mx-auto px-6 py-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md text-pink-100 text-xs sm:text-sm leading-relaxed font-sans italic shadow-lg">
            {romanticQuote}
          </div>
        )}

        {/* Dual Character Cards (Player 1 & Player 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Player 1: Groom */}
          <div className="relative group bg-[#16132A]/80 border border-white/15 hover:border-pink-500/50 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 text-left shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-[11px] font-mono text-pink-400 font-bold tracking-wider uppercase">
                🎮 PLAYER 1 (CHÚ RỂ)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold">
                HP 100%
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={groomAvatar}
                alt={groomName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-pink-400/40 shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="space-y-1 text-white">
                <h3 className="font-bold text-lg text-white">{groomName}</h3>
                <p className="text-xs text-neutral-400">Đội trưởng tình yêu</p>
                
                {/* Micro Stats */}
                <div className="space-y-1 pt-2 text-[11px] text-neutral-300 font-mono">
                  <div className="flex items-center gap-1.5 text-pink-300">
                    <Flame className="w-3 h-3 text-pink-400" />
                    <span>Tấn công: 100% Chiều chuộng</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>Phòng thủ: Luôn nhận lỗi trước</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player 2: Bride */}
          <div className="relative group bg-[#16132A]/80 border border-white/15 hover:border-purple-400/50 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 text-left shadow-xl hover:-translate-y-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-[11px] font-mono text-purple-300 font-bold tracking-wider uppercase">
                👑 PLAYER 2 (CÔ DÂU)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                HP 100%
              </span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={brideAvatar}
                alt={brideName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-purple-400/40 shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="space-y-1 text-white">
                <h3 className="font-bold text-lg text-white">{brideName}</h3>
                <p className="text-xs text-neutral-400">Nữ hoàng trái tim</p>
                
                {/* Micro Stats */}
                <div className="space-y-1 pt-2 text-[11px] text-neutral-300 font-mono">
                  <div className="flex items-center gap-1.5 text-pink-300">
                    <Zap className="w-3 h-3 text-pink-400" />
                    <span>Sức hút: 100% Dễ thương</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <Award className="w-3 h-3 text-purple-400" />
                    <span>Đặc quyền: Quyết định mọi việc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Affinity Meter & Boost Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-mono font-medium">
              Chỉ số tương hợp: <strong className="text-pink-300 font-black">{synergyScore}%</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleBoostAffinity}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/35 hover:to-rose-500/35 border border-pink-500/40 text-pink-200 text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>
              {boostCount === 0
                ? 'Thả Tim Nâng Điểm (+10 PTS)'
                : `Thả Tim Liên Tục (+2 PTS) • x${boostCount} 🔥`}
            </span>
          </button>
        </div>

        {/* Scroll down prompt */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onScrollToNext}
            className="inline-flex flex-col items-center gap-1.5 text-neutral-400 hover:text-pink-300 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-mono uppercase tracking-widest">
              Khám phá Chặng 1: ❤️ Chuyện tình
            </span>
            <ChevronDown className="w-4 h-4 text-pink-400 group-hover:translate-y-1 transition-transform animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
