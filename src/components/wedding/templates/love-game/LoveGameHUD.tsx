import React, { useState } from 'react';
import { Heart, Trophy, CheckCircle2, ChevronUp, Sparkles, MapPin, Camera, Calendar, Gift } from 'lucide-react';

interface LoveGameHUDProps {
  lovePoints: number;
  maxPoints: number;
  completedQuests: Set<string>;
  recentNotification: string | null;
  onNavigateQuest: (sectionId: string) => void;
  onOpenRewardModal: () => void;
}

export function LoveGameHUD({
  lovePoints,
  maxPoints,
  completedQuests,
  recentNotification,
  onNavigateQuest,
  onOpenRewardModal,
}: LoveGameHUDProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentage = Math.min(100, Math.round((lovePoints / maxPoints) * 100));

  const getLevelName = (pts: number) => {
    if (pts >= 120) return 'INFINITY LEVEL: Đại Sứ Tình Yêu Vô Cực 🔥';
    if (pts >= 80) return 'LEGENDARY LEVEL: Tình Yêu Vĩnh Cửu 💖';
    if (pts >= 60) return 'MASTER LEVEL: Tri Kỷ Hoàn Hảo 👑';
    if (pts >= 50) return 'MAX LEVEL: Trăm Năm Hạnh Phúc ✨';
    if (pts >= 40) return 'Level 4: Lời Hẹn Ước Vĩnh Cửu';
    if (pts >= 30) return 'Level 3: Gắn Kết Tri Kỷ';
    if (pts >= 20) return 'Level 2: Say Nắng & Hẹn Hò';
    return 'Level 1: Khởi Đầu Định Mệnh';
  };

  const quests = [
    { id: 'quest-story', label: 'Chuyện tình', icon: Heart, iconColor: 'text-pink-400' },
    { id: 'quest-gallery', label: 'Kỷ niệm', icon: Camera, iconColor: 'text-purple-400' },
    { id: 'quest-locations', label: 'Địa điểm', icon: MapPin, iconColor: 'text-emerald-400' },
    { id: 'quest-countdown', label: 'Ngày cưới', icon: Calendar, iconColor: 'text-amber-400' },
    { id: 'quest-gift', label: 'Mừng cưới', icon: Gift, iconColor: 'text-rose-400' },
  ];

  return (
    <>
      {/* Pop-up points gain notification */}
      {recentNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] pointer-events-none animate-bounce">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-black text-sm shadow-[0_10px_25px_rgba(255,107,139,0.5)] border border-white/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{recentNotification}</span>
            <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
          </div>
        </div>
      )}

      {/* Floating HUD Container (Top Right / Sticky Dock) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        {/* Main Love Points Gauge Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#16132A]/90 hover:bg-[#1E1A38] border border-pink-500/40 hover:border-pink-400 shadow-[0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          {/* Animated Glowing Heart */}
          <div className="relative">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-500 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black font-mono text-white">
                {lovePoints}
              </span>
              <span className="text-[10px] font-mono text-pink-300/80">/ {maxPoints} PTS</span>
            </div>
            <div className="w-20 sm:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <ChevronUp
            className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expanded Quest Menu Dropdown */}
        {isExpanded && (
          <div className="w-72 bg-[#16132A]/95 border border-white/15 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl text-white space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Nhiệm vụ tình yêu
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                {completedQuests.size}/{quests.length} hoàn thành
              </span>
            </div>

            <p className="text-[11px] text-pink-200/80 font-medium">
              {getLevelName(lovePoints)}
            </p>

            {/* Quests Checklist */}
            <div className="space-y-1.5">
              {quests.map((q) => {
                const isDone = completedQuests.has(q.id);
                const IconComponent = q.icon;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      onNavigateQuest(q.id);
                      setIsExpanded(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                        : 'bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400' : q.iconColor}`} />
                      <span>{q.label}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          +10 PTS
                        </span>
                      ) : (
                        <span className="text-[10px] text-pink-300/60 font-mono">
                          +10 PTS
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reward & Leaderboard Action Buttons in Dropdown */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  onOpenRewardModal();
                  setIsExpanded(false);
                }}
                className="cursor-pointer py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-neutral-950 font-black text-[11px] flex items-center justify-center gap-1 shadow-md hover:scale-[1.02] transition-transform"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Nhận Thưởng 🎁</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigateQuest('quest-leaderboard');
                  setIsExpanded(false);
                }}
                className="cursor-pointer py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-[11px] flex items-center justify-center gap-1 hover:scale-[1.02] transition-transform"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Bảng Vàng 🏆</span>
              </button>
            </div>

            {/* Jump to Finale Button if all or almost all completed */}
            <button
              type="button"
              onClick={() => {
                onNavigateQuest('quest-finale');
                setIsExpanded(false);
              }}
              className="w-full mt-1 py-2 rounded-xl bg-gradient-to-r from-pink-500/30 to-amber-500/30 hover:from-pink-500/50 hover:to-amber-500/50 border border-pink-500/40 text-xs font-bold text-pink-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Xem kết quả hành trình (Finale)</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Bottom Quick Quest Bar (Mobile & Desktop) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[96%] bg-[#151227]/95 border border-white/15 rounded-full px-2.5 py-2 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-1 text-white">
        {quests.map((q) => {
          const isDone = completedQuests.has(q.id);
          const IconComp = q.icon;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onNavigateQuest(q.id)}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
                isDone ? 'text-emerald-300' : 'text-neutral-400 hover:text-white'
              }`}
              title={q.label}
            >
              <IconComp className={`w-4 h-4 ${isDone ? 'text-emerald-400 fill-emerald-400/20' : q.iconColor}`} />
              <span className="text-[10px] font-medium hidden sm:inline">{q.label}</span>
              {isDone && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#151227]" />
              )}
            </button>
          );
        })}

        {/* Quick Leaderboard button in Bottom Dock */}
        <button
          type="button"
          onClick={() => onNavigateQuest('quest-leaderboard')}
          className="relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
          title="Bảng Xếp Hạng"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold hidden sm:inline">Bảng Vàng</span>
        </button>

        {/* Quick Reward button in Bottom Dock */}
        <button
          type="button"
          onClick={onOpenRewardModal}
          className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-neutral-950 font-black text-xs shadow-md hover:scale-105 transition-all"
        >
          <Gift className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Quà 🎁</span>
        </button>
      </div>
    </>
  );
}
