import React, { useState } from 'react';
import { WeddingData } from '../../../types';
import { LoveGameOpening } from './love-game/LoveGameOpening';
import { LoveGameHUD } from './love-game/LoveGameHUD';
import { LoveGameHero } from './love-game/LoveGameHero';
import { LoveGameStorySection } from './love-game/LoveGameStorySection';
import { LoveGameGallerySection } from './love-game/LoveGameGallerySection';
import { LoveGameLocationsSection } from './love-game/LoveGameLocationsSection';
import { LoveGameCountdownSection } from './love-game/LoveGameCountdownSection';
import { LoveGameGiftSection } from './love-game/LoveGameGiftSection';
import { LoveGameRSVPSection } from './love-game/LoveGameRSVPSection';
import { LoveGameWishesSection } from './love-game/LoveGameWishesSection';
import { LoveGameLeaderboardSection } from './love-game/LoveGameLeaderboardSection';
import { LoveGameRewardModal } from './love-game/LoveGameRewardModal';
import { LoveGameFinale } from './love-game/LoveGameFinale';
import { LoveGameParticles } from './love-game/LoveGameParticles';
import { LoveGameAudioBar } from './love-game/LoveGameAudioBar';
import { PersonalizedWelcomeBanner } from '../common/PersonalizedWelcomeBanner';
import { playPointChime, playVictoryFanfare } from './love-game/loveGameSounds';

interface LoveGameTemplateProps {
  data: WeddingData;
  isDemo?: boolean;
}

export function LoveGameTemplate({ data, isDemo = false }: LoveGameTemplateProps) {
  const [hasOpened, setHasOpened] = useState(false);
  const [lovePoints, setLovePoints] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const groomName = data.groom?.fullName || data.groom?.name || data.groomName || 'MINH ANH';
  const brideName = data.bride?.fullName || data.bride?.name || data.brideName || 'NGỌC MAI';
  const weddingDate = data.weddingDate || '20.12.2026';
  const weddingDateTime = data.weddingDateTime || '2026-12-20T10:00:00';
  const maxPoints = 60; // Base target milestone for rewards

  const showNotification = (msg: string) => {
    setRecentNotification(msg);
    setTimeout(() => {
      setRecentNotification(null);
    }, 2800);
  };

  const handleAddBonusPoints = (amount: number, reason: string) => {
    setLovePoints((prev) => prev + amount);
    playPointChime();
    showNotification(reason);
  };

  const handleCompleteQuest = (questId: string, customMsg?: string, pointsAmount: number = 10) => {
    const isNew = !completedQuests.has(questId);
    if (isNew) {
      setCompletedQuests((prev) => {
        const next = new Set(prev);
        next.add(questId);
        return next;
      });
    }

    // Points are flexible and can exceed 60 without cap!
    setLovePoints((prev) => prev + pointsAmount);
    playPointChime();
    showNotification(customMsg || `+${pointsAmount} Love Points! ❤️`);

    // NOTE: Per user request:
    // "không cần tự động hiện hộp thoại nhận phần thưởng tình yêu khi đủ 60 điểm"
    // Guests can open the reward modal at any time via buttons without unsolicited popups!
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartQuestFromOpening = (targetSection?: string) => {
    setHasOpened(true);
    handleCompleteQuest('quest-start', '+10 Love Points: Bắt Đầu Trò Chơi! 🎮');
    if (targetSection) {
      setTimeout(() => {
        scrollToSection(targetSection);
      }, 500);
    }
  };

  const handleDirectEnter = () => {
    setHasOpened(true);
  };

  const handleRestart = () => {
    setLovePoints(0);
    setCompletedQuests(new Set());
    setHasOpened(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="relative min-h-screen text-white font-sans overflow-x-hidden selection:bg-pink-500 selection:text-white"
      style={{
        background: 'linear-gradient(180deg, #0C0A17 0%, #15102A 20%, #170E28 40%, #110B22 65%, #0B0817 85%, #080612 100%)',
      }}
    >
      {/* 1. Cyber-Romance Floating Heart Particles Canvas */}
      <LoveGameParticles />

      {/* 2. Opening Minigame Dialog ("Bạn có muốn khám phá câu chuyện của chúng mình không?") */}
      {!hasOpened && (
        <LoveGameOpening
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          onStartQuest={handleStartQuestFromOpening}
          onDirectEnter={handleDirectEnter}
        />
      )}

      {/* 3. Floating Heads-Up Display (Love Points + Quest Quick Jump) */}
      <LoveGameHUD
        lovePoints={lovePoints}
        maxPoints={maxPoints}
        completedQuests={completedQuests}
        recentNotification={recentNotification}
        onNavigateQuest={scrollToSection}
        onOpenRewardModal={() => setIsRewardModalOpen(true)}
      />

      {/* 4. Top Sticky Gen Z Header */}
      <header className="sticky top-0 inset-x-0 z-30 px-4 py-3 bg-[#0C0A17]/80 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-pink-300 transition-colors"
          >
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-mono text-xs font-black">
              MẪU 11
            </span>
            <span className="font-mono tracking-wider font-bold">
              {groomName} &times; {brideName}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-xs font-mono font-medium text-neutral-300">
            <button
              onClick={() => scrollToSection('quest-story')}
              className="cursor-pointer hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <span>❤️ Chuyện tình</span>
              {completedQuests.has('quest-story') && <span className="text-emerald-400">✓</span>}
            </button>
            <button
              onClick={() => scrollToSection('quest-gallery')}
              className="cursor-pointer hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              <span>📷 Kỷ niệm</span>
              {completedQuests.has('quest-gallery') && <span className="text-emerald-400">✓</span>}
            </button>
            <button
              onClick={() => scrollToSection('quest-locations')}
              className="cursor-pointer hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>📍 Địa điểm</span>
              {completedQuests.has('quest-locations') && <span className="text-emerald-400">✓</span>}
            </button>
            <button
              onClick={() => scrollToSection('quest-countdown')}
              className="cursor-pointer hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>💍 Ngày cưới</span>
              {completedQuests.has('quest-countdown') && <span className="text-emerald-400">✓</span>}
            </button>
            <button
              onClick={() => scrollToSection('quest-gift')}
              className="cursor-pointer hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <span>🎁 Mừng cưới</span>
              {completedQuests.has('quest-gift') && <span className="text-emerald-400">✓</span>}
            </button>
            <button
              onClick={() => scrollToSection('quest-leaderboard')}
              className="cursor-pointer hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-400"
            >
              <span>🏆 Bảng Vàng</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRewardModalOpen(true)}
              className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-bold text-xs shadow-xs hover:scale-105 transition-all"
            >
              <span>🎁 Quà</span>
            </button>

            <button
              onClick={() => scrollToSection('quest-rsvp')}
              className="cursor-pointer px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs tracking-wider uppercase shadow-md hover:scale-105 transition-all"
            >
              RSVP
            </button>
          </div>
        </div>
      </header>

      {/* VIP Personalized Guest Greeting Banner */}
      <PersonalizedWelcomeBanner
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
        accentColor="#EC4899"
      />

      {/* 5. Main Quest Flow */}
      <main className="relative z-20">
        {/* Section 0: Hero / Character Selection */}
        <LoveGameHero
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          romanticQuote={data.romanticQuote}
          groom={data.groom}
          bride={data.bride}
          coverImage={data.coverImage}
          onUnlockPoints={(qid, pts, msg) => handleCompleteQuest(qid, msg, pts)}
          onScrollToNext={() => scrollToSection('quest-story')}
        />

        {/* Section 1: ❤️ Chuyện tình (Quest 1) */}
        <LoveGameStorySection
          milestones={data.stories}
          isCompleted={completedQuests.has('quest-story')}
          onCompleteQuest={() => handleCompleteQuest('quest-story', '+10 Love Points: Mở Khóa Chuyện Tình! ❤️')}
        />

        {/* Section 2: 📷 Kỷ niệm (Quest 2) */}
        <LoveGameGallerySection
          gallery={data.gallery}
          isCompleted={completedQuests.has('quest-gallery')}
          onCompleteQuest={() => handleCompleteQuest('quest-gallery', '+10 Love Points: Khám Phá Kỷ Niệm! 📷')}
          onAddBonusPoints={(pts, msg) => handleAddBonusPoints(pts, msg)}
        />

        {/* Section 3: 📍 Địa điểm (Quest 3) */}
        <LoveGameLocationsSection
          events={data.events}
          isCompleted={completedQuests.has('quest-locations')}
          onCompleteQuest={() => handleCompleteQuest('quest-locations', '+10 Love Points: Đã Lưu Tọa Độ! 📍')}
        />

        {/* Section 4: 💍 Ngày cưới (Quest 4) */}
        <LoveGameCountdownSection
          weddingDate={weddingDate}
          weddingDateTime={weddingDateTime}
          isCompleted={completedQuests.has('quest-countdown')}
          onCompleteQuest={() => handleCompleteQuest('quest-countdown', '+10 Love Points: Nhớ Lịch Hẹn Hôn Lễ! 💍')}
        />

        {/* Section 5: 🎁 Mừng cưới (Quest 5) */}
        <LoveGameGiftSection
          groomBank={data.gift?.groomBank}
          brideBank={data.gift?.brideBank}
          isCompleted={completedQuests.has('quest-gift')}
          onCompleteQuest={() => handleCompleteQuest('quest-gift', '+10 Love Points: Mở Hộp Quà Chúc Phúc! 🎁')}
        />

        {/* Bonus Section: RSVP Form */}
        <LoveGameRSVPSection
          weddingId={data.id}
          groomName={groomName}
          brideName={brideName}
          isCompleted={completedQuests.has('quest-rsvp')}
          onCompleteQuest={() => handleCompleteQuest('quest-rsvp', '+10 Love Points: Đã Xác Nhận Tham Dự! 💌')}
        />

        {/* Bonus Section: Guestbook Wishes Feed */}
        <LoveGameWishesSection
          weddingId={data.id}
          isCompleted={completedQuests.has('quest-wishes')}
          onCompleteQuest={() => handleCompleteQuest('quest-wishes', '+10 Love Points: Gửi Lời Chúc Phúc! ✨')}
          onAddBonusPoints={(pts, msg) => handleAddBonusPoints(pts, msg)}
          onCompleteQuestWithPoints={(qid, msg, pts) => handleCompleteQuest(qid, msg, pts)}
        />

        {/* Section 6: 🏆 Bảng Xếp Hạng Điểm Tình Yêu (Love Quest Hall of Fame) */}
        <LoveGameLeaderboardSection
          weddingId={data.id}
          groomName={groomName}
          brideName={brideName}
          lovePoints={lovePoints}
          maxPoints={maxPoints}
        />

        {/* Grand Finale: LOVE JOURNEY COMPLETED ❤️ */}
        <LoveGameFinale
          groomName={groomName}
          brideName={brideName}
          weddingDate={weddingDate}
          lovePoints={lovePoints}
          maxPoints={maxPoints}
          onRestart={handleRestart}
          onOpenRewardModal={() => setIsRewardModalOpen(true)}
          onOpenLeaderboard={() => scrollToSection('quest-leaderboard')}
        />
      </main>

      {/* 6. Ambient Audio Player */}
      <LoveGameAudioBar musicUrl={data.musicUrl} />

      {/* 7. Interactive Reward Modal (Mã Vé May Mắn, Chứng Nhận Tri Kỷ, Kỷ Niệm Bí Mật) */}
      <LoveGameRewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
        lovePoints={lovePoints}
        maxPoints={maxPoints}
        onOpenLeaderboard={() => {
          scrollToSection('quest-leaderboard');
        }}
      />
    </div>
  );
}
