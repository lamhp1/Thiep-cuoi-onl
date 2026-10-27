import React, { useState, useEffect } from 'react';
import { Heart, Camera, MapPin, Calendar, Gift, Play, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { playPointChime } from './loveGameSounds';
import { PersonalizedWaxSealBadge } from '../../common/PersonalizedWaxSealBadge';

interface LoveGameOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  onStartQuest: (targetSection?: string) => void;
  onDirectEnter: () => void;
}

export function LoveGameOpening({
  groomName,
  brideName,
  weddingDate,
  onStartQuest,
  onDirectEnter,
}: LoveGameOpeningProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const handleSelectQuest = (targetSection?: string) => {
    playPointChime();
    setIsClosing(true);
    setTimeout(() => {
      onStartQuest(targetSection);
    }, 450);
  };

  const handleDirectEnter = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDirectEnter();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 overflow-y-auto ${
        isClosing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, rgba(30, 20, 55, 0.95) 0%, rgba(12, 10, 24, 0.98) 100%)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Ambient background particles & glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-pink-500/15 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-xl my-auto">
        {/* Game Window Card */}
        <div className="relative bg-[#141226]/90 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(255,107,139,0.25)] backdrop-blur-2xl text-center space-y-6">
          
          {/* Top Window Bar with retro-gaming badges */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm" />
              <span className="text-[11px] font-mono tracking-widest text-pink-300/80 font-bold ml-2 uppercase">
                GEN Z LOVE QUEST 2026
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>START +10 PTS</span>
            </div>
          </div>

          {/* Players Badge */}
          <div className="space-y-2">
            {/* VIP Inscribed Guest Invitation Badge */}
            <PersonalizedWaxSealBadge theme="dark" className="my-1 max-w-[320px]" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs sm:text-sm font-medium">
              <span className="text-pink-400 font-bold">🎮 P1:</span> {groomName}
              <span className="text-pink-500 font-black">×</span>
              <span className="text-purple-300 font-bold">P2:</span> {brideName}
            </div>

            {/* Main Opening Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 tracking-tight leading-snug">
              Cùng chơi một trò chơi nhé?
            </h2>

            {/* Prompt as requested */}
            <p className="text-sm sm:text-base text-pink-100/90 font-medium max-w-md mx-auto leading-relaxed">
              &ldquo;Bạn có muốn khám phá câu chuyện của chúng mình không?&rdquo;
            </p>
          </div>

          {/* 5 Requested Quest Selector Buttons */}
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-mono font-semibold">
              Chọn một chặng để khám phá trước (+10 Love Points)
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectQuest('quest-story')}
                className="group flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-pink-500/30 hover:to-rose-500/20 border border-white/10 hover:border-pink-500/50 text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.03] active:scale-95"
              >
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400/30 group-hover:scale-125 transition-transform" />
                <span className="font-semibold">❤️ Chuyện tình</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuest('quest-gallery')}
                className="group flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/20 border border-white/10 hover:border-purple-400/50 text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.03] active:scale-95"
              >
                <Camera className="w-4 h-4 text-purple-300 group-hover:scale-125 transition-transform" />
                <span className="font-semibold">📷 Kỷ niệm</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuest('quest-locations')}
                className="group flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-emerald-500/30 hover:to-teal-500/20 border border-white/10 hover:border-emerald-400/50 text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.03] active:scale-95"
              >
                <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                <span className="font-semibold">📍 Địa điểm</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuest('quest-countdown')}
                className="group flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-amber-500/30 hover:to-orange-500/20 border border-white/10 hover:border-amber-400/50 text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.03] active:scale-95"
              >
                <Calendar className="w-4 h-4 text-amber-300 group-hover:scale-125 transition-transform" />
                <span className="font-semibold">💍 Ngày cưới</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectQuest('quest-gift')}
                className="group col-span-2 sm:col-span-2 flex items-center justify-center gap-2 px-3 py-3 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-rose-500/30 hover:to-pink-500/20 border border-white/10 hover:border-rose-400/50 text-white text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.03] active:scale-95"
              >
                <Gift className="w-4 h-4 text-rose-400 group-hover:scale-125 transition-transform" />
                <span className="font-semibold">🎁 Mừng cưới</span>
              </button>
            </div>
          </div>

          {/* Primary Big Start Button */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={() => handleSelectQuest()}
              className="w-full relative group overflow-hidden px-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:via-rose-600 hover:to-amber-500 text-white font-bold text-base sm:text-lg shadow-[0_10px_30px_rgba(255,107,139,0.4)] transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-3"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Play className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
              <span className="relative z-10 tracking-wide font-black">
                Bắt Đầu Khám Phá (+10 PTS)
              </span>
            </button>

            {/* Direct Link to View Details (Respecting all guests) */}
            <button
              type="button"
              onClick={handleDirectEnter}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              <span>Vào thẳng thiệp cưới chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Date Stamp */}
          <div className="text-[11px] font-mono text-neutral-500">
            SAVE THE DATE • {weddingDate}
          </div>
        </div>
      </div>
    </div>
  );
}
