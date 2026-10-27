import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Trophy, Share2, RotateCcw, Check, Sparkles, ArrowUp, Gift, Award } from 'lucide-react';
import { playVictoryFanfare } from './loveGameSounds';

interface LoveGameFinaleProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  lovePoints: number;
  maxPoints: number;
  onRestart: () => void;
  onOpenRewardModal: () => void;
  onOpenLeaderboard: () => void;
}

export function LoveGameFinale({
  groomName,
  brideName,
  weddingDate,
  lovePoints,
  maxPoints,
  onRestart,
  onOpenRewardModal,
  onOpenLeaderboard,
}: LoveGameFinaleProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti blast on finale render
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#FF6B8B', '#A78BFA', '#F59E0B', '#10B981', '#FFFFFF'],
      });
      playVictoryFanfare();
    } catch {
      // ignore
    }
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCelebrateMore = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF6B8B', '#F43F5E', '#FBBF24', '#A855F7'],
      });
      playVictoryFanfare();
    } catch {
      // ignore
    }
  };

  return (
    <footer id="quest-finale" className="relative py-28 px-4 sm:px-6 overflow-hidden text-center scroll-mt-20">
      {/* Background magical radiant glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-t from-pink-600/20 via-purple-600/15 to-transparent blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        
        {/* Trophy / Level Max Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 p-1 shadow-[0_0_50px_rgba(245,158,11,0.5)] flex items-center justify-center mx-auto hover:rotate-6 transition-transform cursor-pointer" onClick={handleCelebrateMore}>
            <div className="w-full h-full bg-[#120F24] rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 animate-pulse" />
            </div>
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-black text-[10px] font-mono uppercase tracking-wider shadow-md">
            100% UNLOCKED
          </span>
        </div>

        {/* EXACT REQUIRED FINALE TEXT */}
        <div className="space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs sm:text-sm font-mono font-black tracking-widest uppercase animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>GAME CLEARED • {lovePoints} LOVE POINTS {lovePoints >= maxPoints && '★'}</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <span>LOVE JOURNEY COMPLETED</span>
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-pink-500 fill-pink-500 inline-block animate-bounce" />
          </h2>

          <div className="space-y-2 pt-2">
            <p className="text-2xl sm:text-4xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-200 to-rose-400 uppercase font-serif-title">
              {groomName} + {brideName}
            </p>

            <p className="text-lg sm:text-2xl font-black font-mono tracking-widest text-neutral-200">
              {weddingDate}
            </p>
          </div>
        </div>

        {/* Sincere Thank You message from the couple */}
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-2 text-neutral-300 text-xs sm:text-sm leading-relaxed">
          <p className="font-medium">
            &ldquo;Cảm ơn bạn đã đồng hành và hoàn thành chuyến hành trình tình yêu cùng chúng mình. Sự hiện diện và chúc phúc của bạn là món quà ý nghĩa nhất trong ngày khởi đầu trăm năm hạnh phúc!&rdquo;
          </p>
          <p className="text-pink-300 font-bold font-mono text-[11px] pt-1">
            — {groomName} &amp; {brideName} trân trọng cảm ơn —
          </p>
        </div>

        {/* Primary Rewards Call to Action Card */}
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-pink-500/15 border-2 border-amber-400/50 backdrop-blur-2xl shadow-[0_0_40px_rgba(245,158,11,0.25)] space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-amber-300 tracking-widest uppercase">
              ★ ĐẶC QUYỀN HOÀN THÀNH GAME ★
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Nhận Phần Thưởng &amp; Vinh Danh Bảng Vàng
            </h3>
            <p className="text-xs text-neutral-300">
              Mở khóa vé bốc thăm may mắn, chứng nhận tri kỷ độc bản và lưu danh trên Bảng Xếp Hạng Tình Yêu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={onOpenRewardModal}
              className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-neutral-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Gift className="w-4 h-4 text-neutral-950" />
              <span>Nhận Phần Thưởng Tình Yêu 🎁</span>
            </button>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Xem Bảng Xếp Hạng 🏆</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCelebrateMore}
            className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Bắn Pháo Hoa Chúc Mừng 🎉</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Đã Sao Chép Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-pink-300" />
                <span>Chia Sẻ Thiệp Cưới</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 hover:text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
            title="Chơi lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại Minigame</span>
          </button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-400 hover:text-white transition-all hover:scale-105 active:scale-95"
            title="Lên đầu trang"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Footer copyright stamp */}
        <div className="pt-10 text-[11px] font-mono text-neutral-500">
          DESIGNED FOR GEN Z WITH LOVE • L&apos;AMOUR WEDDING 2026
        </div>

      </div>
    </footer>
  );
}
