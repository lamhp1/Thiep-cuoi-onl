import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Share2, RotateCcw, ShieldAlert, Heart, Orbit, Zap } from 'lucide-react';
import { WeddingData } from '../../../../types';
import { useToast } from '../../../ui/Toast';

interface FuturisticGrandFinaleProps {
  data: WeddingData;
  onReplay: () => void;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
}

export function FuturisticGrandFinale({
  data,
  onReplay,
  onNavigateToAdmin,
  isOwnerMode = false,
}: FuturisticGrandFinaleProps) {
  const { showToast } = useToast();

  const groom = data.groom?.fullName || data.groomName || 'Minh Anh';
  const bride = data.bride?.fullName || data.brideName || 'Ngọc Mai';

  const triggerSupernovaFireworks = () => {
    // 3 successive waves of neon cyber confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        startVelocity: 35,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#00F0FF', '#A855F7', '#FF2E93', '#F5D061', '#FFFFFF'],
      });
    }, 250);

    showToast('VỤ NỔ SAO SIÊU MỚI (SUPERNOVA) ĐÃ BỪNG SÁNG!', 'success');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thiệp Cưới Tương Lai: ${groom} & ${bride}`,
          text: `Trân trọng kính mời quý khách tham dự chuyến du hành hạnh phúc cùng ${groom} & ${bride}!`,
          url,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      showToast('Đã sao chép liên kết thiệp cưới vào bộ nhớ đệm!', 'success');
    }
  };

  return (
    <div className="relative py-28 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-10 overflow-hidden font-body select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Supernova Trigger Core Button */}
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <button
            onClick={triggerSupernovaFireworks}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#FF2E93] to-[#A855F7] text-white font-futuristic text-sm sm:text-base font-black tracking-widest shadow-[0_0_40px_rgba(0,240,255,0.4)] hover:shadow-[0_0_60px_rgba(255,46,147,0.6)] transition-all cursor-pointer flex items-center gap-3 mx-auto"
          >
            <Sparkles className="w-5 h-5 text-[#F5D061] animate-spin" style={{ animationDuration: '6s' }} />
            <span>BẮN PHÁO HOA SIÊU TÂN TINH (SUPERNOVA)</span>
          </button>
        </motion.div>
        <p className="text-xs font-mono text-neutral-400">
          [Chạm để thắp sáng cả bầu trời sao chúc mừng ngày đại hỷ]
        </p>
      </div>

      {/* Couple Grand Gratitude Message */}
      <div className="bg-[#090E26]/90 border border-[#00F0FF]/40 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-neon-cyan space-y-6 relative overflow-hidden">
        <div className="w-14 h-14 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] mx-auto shadow-neon-cyan">
          <Heart className="w-7 h-7 fill-[#00F0FF]" />
        </div>

        <div className="space-y-3">
          <h2 className="font-futuristic text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
            Cảm Ơn Bạn Đã Đồng Hành
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Sự hiện diện, lời chúc phúc và tình cảm của quý khách là nguồn năng lượng quý báu nhất thắp sáng hành trình hôn nhân trăm năm của {groom} & {bride}. Hẹn gặp quý khách tại đại tiệc ánh sao!
          </p>
        </div>

        <div className="pt-4 border-t border-[#00F0FF]/25 flex items-center justify-center gap-4 text-xs font-mono text-neutral-400">
          <span>STARDATE: {data.weddingDate || '20/12/2026'}</span>
          <span>•</span>
          <span className="text-[#00F0FF]">ETERNAL LOVE // PROTOCOL COMPLETE</span>
        </div>
      </div>

      {/* Action Buttons: Share & Replay */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-futuristic text-xs font-bold border border-white/20 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[#00F0FF]" />
          <span>Chia sẻ thiệp cưới</span>
        </button>

        <button
          onClick={onReplay}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] font-futuristic text-xs font-bold border border-[#00F0FF]/40 transition-all cursor-pointer shadow-neon-cyan"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Xem lại từ mở màn Warp Speed</span>
        </button>

        {isOwnerMode && onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-futuristic text-xs font-bold border border-amber-500/40 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Quay về trang Quản Trị</span>
          </button>
        )}
      </div>

      {/* Subtle Footer Brand */}
      <div className="pt-8 text-[11px] font-mono text-neutral-500">
        POWERED BY L'AMOUR WEDDING • KỶ NGUYÊN THIỆP CƯỚI CÔNG NGHỆ CAO 2026
      </div>
    </div>
  );
}
