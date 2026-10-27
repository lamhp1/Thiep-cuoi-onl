import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Crown,
  Sparkles,
  Heart,
  Medal,
  Users,
  Send,
  CheckCircle2,
  Flame,
  Star,
  ShieldAlert,
} from 'lucide-react';
import {
  getLeaderboard,
  submitLeaderboardEntry,
  LeaderboardEntry,
} from '../../../../services/leaderboardService';
import { playVictoryFanfare, playPointChime } from './loveGameSounds';

interface LoveGameLeaderboardSectionProps {
  weddingId: string;
  groomName: string;
  brideName: string;
  lovePoints: number;
  maxPoints: number;
}

export function LoveGameLeaderboardSection({
  weddingId,
  groomName,
  brideName,
  lovePoints,
  maxPoints,
}: LoveGameLeaderboardSectionProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'groom' | 'bride'>('all');

  // Submit form state
  const [playerName, setPlayerName] = useState('');
  const [playerTeam, setPlayerTeam] = useState<'groom' | 'bride' | 'both'>('both');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Retrieve saved ticket code if exists
  const ticketCode = typeof window !== 'undefined'
    ? localStorage.getItem('lamour_lucky_ticket_code') || `VIP-LOVE-${Math.floor(1000 + Math.random() * 9000)}`
    : 'VIP-LOVE-8888';

  useEffect(() => {
    let mounted = true;
    getLeaderboard(weddingId)
      .then((data) => {
        if (mounted) {
          setEntries(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [weddingId]);

  const filteredEntries = entries.filter((e) => {
    if (activeTab === 'groom') return e.team === 'groom';
    if (activeTab === 'bride') return e.team === 'bride';
    return true;
  });

  const getRankBadge = (rank: number, points: number) => {
    if (rank === 1) return { title: 'Đại Sứ Kim Cương 👑', color: 'from-amber-400 to-yellow-500 text-neutral-950' };
    if (rank === 2) return { title: 'Tri Kỷ Vàng Thân Thiết 🌟', color: 'from-slate-200 to-neutral-400 text-neutral-900' };
    if (rank === 3) return { title: 'Chiến Thần Thả Tim 💖', color: 'from-amber-600 to-amber-700 text-white' };
    if (points >= 50) return { title: 'Tri Kỷ Cao Cấp ✨', color: 'from-pink-500/30 to-purple-500/30 text-pink-300' };
    return { title: 'Khách Quý Tận Tâm 🌱', color: 'from-white/10 to-white/5 text-neutral-300' };
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const badgeInfo = getRankBadge(1, lovePoints);
      const newEntry = await submitLeaderboardEntry({
        weddingId,
        name: playerName.trim(),
        team: playerTeam,
        points: lovePoints,
        avatar: playerTeam === 'groom'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
          : playerTeam === 'bride'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        badge: badgeInfo.title,
        ticketCode,
      });

      // Update local state list
      setEntries((prev) => {
        const withoutMe = prev.filter((item) => item.name.toLowerCase() !== playerName.trim().toLowerCase());
        const updated = [newEntry, ...withoutMe];
        updated.sort((a, b) => b.points - a.points);
        return updated;
      });

      setSubmittedId(newEntry.id);
      playVictoryFanfare();
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6B8B', '#F59E0B', '#3B82F6', '#10B981'],
        });
      } catch {
        // ignore
      }
    } catch {
      playPointChime();
    } finally {
      setIsSubmitting(false);
    }
  };

  const top1 = filteredEntries[0];
  const top2 = filteredEntries[1];
  const top3 = filteredEntries[2];
  const remaining = filteredEntries.slice(3);

  return (
    <section id="quest-leaderboard" className="relative py-24 px-4 sm:px-6 scroll-mt-20">
      {/* Background Neon Halo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-purple-600/15 via-pink-600/15 to-amber-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>LOVE QUEST HALL OF FAME</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Bảng Xếp Hạng Điểm Tình Yêu
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Vinh danh những khách quý và tri kỷ tích cực nhất trong chuyến phiêu lưu tình yêu cùng{' '}
            <strong className="text-pink-300">{groomName}</strong> &amp;{' '}
            <strong className="text-pink-300">{brideName}</strong>.
          </p>

          {/* Filter Tabs */}
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tất Cả ({entries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('groom')}
              className={`cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'groom'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Đội Nhà Trai 🎩
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bride')}
              className={`cursor-pointer px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bride'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Đội Nhà Gái 👰
            </button>
          </div>
        </div>

        {/* Podium for Top 3 */}
        {filteredEntries.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 max-w-2xl mx-auto">
            {/* Rank 2 (Silver) */}
            {top2 && (
              <div className="flex flex-col items-center text-center space-y-2 order-1">
                <div className="relative">
                  <img
                    src={top2.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                    alt={top2.name}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-300 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-neutral-900 flex items-center justify-center font-black text-xs shadow-md">
                    2
                  </div>
                </div>
                <div className="space-y-0.5 max-w-[110px] sm:max-w-none">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{top2.name}</p>
                  <span className="text-[10px] font-mono text-pink-300 font-bold">{top2.points} PTS</span>
                </div>
                <div className="w-full h-24 sm:h-32 rounded-t-2xl bg-gradient-to-t from-slate-800/80 to-slate-700/40 border-t-2 border-x border-slate-400/40 flex items-center justify-center shadow-lg">
                  <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                </div>
              </div>
            )}

            {/* Rank 1 (Gold / Crown) */}
            {top1 && (
              <div className="flex flex-col items-center text-center space-y-2 order-2 -mt-6">
                <Crown className="w-7 h-7 sm:w-9 sm:h-9 text-amber-300 animate-bounce" />
                <div className="relative">
                  <img
                    src={top1.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={top1.name}
                    className="w-18 h-18 sm:w-24 sm:h-24 rounded-3xl object-cover border-3 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] ring-4 ring-amber-400/20"
                  />
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 font-black text-[10px] font-mono shadow-md uppercase tracking-wider">
                    #1 TOP
                  </div>
                </div>
                <div className="space-y-0.5 pt-1">
                  <p className="text-sm sm:text-base font-black text-amber-200 truncate">{top1.name}</p>
                  <span className="text-xs font-mono font-black text-white bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                    {top1.points} PTS
                  </span>
                </div>
                <div className="w-full h-32 sm:h-44 rounded-t-2xl bg-gradient-to-t from-amber-500/30 to-amber-400/20 border-t-2 border-x border-amber-400/60 flex flex-col items-center justify-center gap-1 shadow-2xl">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-pulse" />
                  <span className="text-[10px] font-bold font-mono text-amber-200">QUÁN QUÂN</span>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {top3 && (
              <div className="flex flex-col items-center text-center space-y-2 order-3">
                <div className="relative">
                  <img
                    src={top3.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
                    alt={top3.name}
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-600 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-xs shadow-md">
                    3
                  </div>
                </div>
                <div className="space-y-0.5 max-w-[110px] sm:max-w-none">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{top3.name}</p>
                  <span className="text-[10px] font-mono text-pink-300 font-bold">{top3.points} PTS</span>
                </div>
                <div className="w-full h-20 sm:h-28 rounded-t-2xl bg-gradient-to-t from-amber-950/80 to-amber-900/40 border-t-2 border-x border-amber-600/40 flex items-center justify-center shadow-lg">
                  <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Leaderboard List */}
        <div className="rounded-3xl bg-[#141029]/80 border border-white/10 backdrop-blur-xl p-4 sm:p-6 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
            <span>Hạng &amp; Tên Khách Mời</span>
            <span>Điểm &amp; Danh Hiệu</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredEntries.map((item, idx) => {
              const rank = idx + 1;
              const isCurrentUser = submittedId === item.id;
              const badge = getRankBadge(rank, item.points);

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-pink-500/25 to-amber-500/25 border-2 border-amber-400 shadow-lg'
                      : rank <= 3
                      ? 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.08]'
                      : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                        rank === 1
                          ? 'bg-amber-400 text-neutral-950'
                          : rank === 2
                          ? 'bg-slate-300 text-neutral-950'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {rank}
                    </span>

                    <img
                      src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/15"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {item.name}
                        </span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase">
                            Bạn
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                            item.team === 'groom'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : item.team === 'bride'
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {item.team === 'groom' ? 'Nhà Trai' : item.team === 'bride' ? 'Nhà Gái' : 'Cả Hai'}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="text-xs sm:text-sm font-mono font-black text-amber-300 block">
                      {item.points} PTS
                    </span>
                    <span className="text-[10px] font-medium text-pink-300/80 block hidden sm:block">
                      {item.badge || badge.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Your Score Card ("Ghi Danh Lên Bảng Vàng") */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-900/30 via-[#181332] to-amber-900/30 border border-pink-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ghi Danh Khách Quý</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Gửi Điểm Của Bạn Lên Bảng Vàng
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                Lưu lại thành tích và nhận vinh danh trước toàn thể quan khách hai họ!
              </p>
            </div>

            {/* Current Points Badge */}
            <div className="flex items-center gap-3 bg-[#0F0B1E] border border-pink-500/40 px-4 py-2.5 rounded-2xl shrink-0">
              <Heart className="w-5 h-5 text-pink-400 fill-pink-500 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Điểm Của Bạn</span>
                <span className="text-base font-black font-mono text-amber-300">
                  {lovePoints} PTS {lovePoints >= maxPoints && '🔥'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitScore} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">
                  Tên hoặc Biệt danh của bạn <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="VD: Hoàng Lâm (Bạn thân), Thùy Chi..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              {/* Team Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">
                  Bạn là khách của ai?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlayerTeam('groom')}
                    className={`cursor-pointer py-2 rounded-xl text-xs font-bold transition-all border ${
                      playerTeam === 'groom'
                        ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    🎩 Nhà Trai
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerTeam('bride')}
                    className={`cursor-pointer py-2 rounded-xl text-xs font-bold transition-all border ${
                      playerTeam === 'bride'
                        ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    👰 Nhà Gái
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerTeam('both')}
                    className={`cursor-pointer py-2 rounded-xl text-xs font-bold transition-all border ${
                      playerTeam === 'both'
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    💖 Cả Hai
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-neutral-400">
                Mã vé rút thăm may mắn: <strong className="text-amber-300 font-mono">{ticketCode}</strong>
              </span>

              <button
                type="submit"
                disabled={isSubmitting || !playerName.trim()}
                className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Đang ghi danh...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Điểm Lên Bảng Xếp Hạng 🏆</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
