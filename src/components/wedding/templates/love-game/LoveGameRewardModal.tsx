import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Gift,
  Award,
  Sparkles,
  Copy,
  Check,
  X,
  Heart,
  Ticket,
  Lock,
  Unlock,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { playVictoryFanfare, playPointChime } from './loveGameSounds';

interface LoveGameRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  groomName: string;
  brideName: string;
  weddingDate: string;
  lovePoints: number;
  maxPoints: number;
  onOpenLeaderboard: () => void;
}

export function LoveGameRewardModal({
  isOpen,
  onClose,
  groomName,
  brideName,
  weddingDate,
  lovePoints,
  maxPoints,
  onOpenLeaderboard,
}: LoveGameRewardModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCert, setCopiedCert] = useState(false);
  const [guestName, setGuestName] = useState('Khách Quý Tri Kỷ');
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);

  // Generate or retrieve persistent lucky ticket code
  const [ticketCode] = useState(() => {
    try {
      const stored = localStorage.getItem('lamour_lucky_ticket_code');
      if (stored) return stored;
      const newCode = `VIP-LOVE-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('lamour_lucky_ticket_code', newCode);
      return newCode;
    } catch {
      return 'VIP-LOVE-8888';
    }
  });

  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(ticketCode);
      setCopiedCode(true);
      playPointChime();
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyCertificate = () => {
    const certText = `🏆 CHỨNG NHẬN TRI KỶ VÀNG\n` +
      `Đã đồng hành xuất sắc trong chuyến phiêu lưu tình yêu cùng ${groomName} & ${brideName}.\n` +
      `Người nhận: ${guestName}\n` +
      `Điểm tích lũy: ${lovePoints} Love Points ${lovePoints >= maxPoints ? '★ (Đạt chuẩn vinh danh)' : ''}\n` +
      `Mã Vé Rút Thăm May Mắn: ${ticketCode}\n` +
      `Hôn Lễ: ${weddingDate} • Trăm Năm Hạnh Phúc ❤️`;

    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(certText);
      setCopiedCert(true);
      playPointChime();
      setTimeout(() => setCopiedCert(false), 2500);
    }
  };

  const handleUnlockSecret = () => {
    setIsSecretUnlocked(true);
    playVictoryFanfare();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#FF6B8B', '#F59E0B', '#10B981'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1E1838] via-[#16122C] to-[#0F0B1E] border border-pink-500/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(255,107,139,0.3)] text-white space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black font-mono tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>PHẦN THƯỞNG CHIẾN THẮNG • REWARD UNLOCKED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-amber-200 to-rose-400">
            Hộp Quà Tri Kỷ Vàng
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
            Chúc mừng bạn đã hoàn thành trọn vẹn Love Quest! Dưới đây là các phần quà và đặc quyền dành riêng cho bạn:
          </p>
        </div>

        {/* Reward 1: VIP Lucky Draw Ticket */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-pink-500/15 to-purple-500/15 border-2 border-dashed border-amber-400/50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-neutral-950 shrink-0 shadow-lg">
              <Ticket className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block">
                Phần Thưởng 1 • Vé Rút Thăm May Mắn
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                Mã Số May Mắn Tiệc Cưới
              </h3>
              <p className="text-[11px] text-neutral-300 mt-0.5">
                Đưa mã này cho ban tổ chức tại sảnh tiệc để tham gia vòng quay trúng quà của Cô Dâu &amp; Chú Rể!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#0E0A1F] border border-amber-400/40 px-3 py-2 rounded-xl shrink-0">
            <span className="font-mono font-black text-amber-300 text-sm tracking-wider">
              {ticketCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="cursor-pointer p-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 transition-colors"
              title="Sao chép mã"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Reward 2: Digital Golden Love Certificate */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-pink-300 font-mono text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Phần Thưởng 2 • Chứng Nhận Tri Kỷ Vàng</span>
          </div>

          {/* Certificate Frame */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#FAF6EE] to-[#F3EAD3] text-neutral-900 p-6 sm:p-8 border-4 border-[#C8A45D] shadow-2xl space-y-4">
            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 text-[#C8A45D] text-xs">✤</div>
            <div className="absolute top-2 right-2 text-[#C8A45D] text-xs">✤</div>
            <div className="absolute bottom-2 left-2 text-[#C8A45D] text-xs">✤</div>
            <div className="absolute bottom-2 right-2 text-[#C8A45D] text-xs">✤</div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black tracking-widest text-[#8C7335] uppercase block">
                CERTIFICATE OF LOVE MASTER
              </span>
              <h4 className="text-xl sm:text-2xl font-black font-serif-title text-[#4A1521] uppercase">
                Chứng Nhận Tri Kỷ Kim Cương
              </h4>
            </div>

            <p className="text-xs text-neutral-600 italic">
              Trao tặng cho người bạn quý mến đã mở khóa 100% chuyến phiêu lưu tình yêu:
            </p>

            {/* Editable Guest Name */}
            <div className="inline-block border-b-2 border-dashed border-[#C8A45D] pb-1 px-4">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nhập tên của bạn"
                className="text-center font-bold text-base sm:text-lg text-neutral-900 bg-transparent outline-none w-48 sm:w-64"
              />
            </div>

            <div className="text-xs text-neutral-700 leading-relaxed max-w-md mx-auto">
              Chứng thực người bạn đồng hành thân thiết của <strong>{groomName}</strong> &amp; <strong>{brideName}</strong>. 
              Ghi danh vĩnh viễn vào trang sử ngày trọng đại <strong>{weddingDate}</strong>.
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#C8A45D]/40 text-left">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Thành Tích</span>
                <span className="text-xs font-bold text-[#8C7335]">
                  {lovePoints} PTS {lovePoints >= maxPoints && '★ (Đạt chuẩn)'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#C8A45D] bg-[#8C7335]/15 flex items-center justify-center text-[#8C7335] text-[10px] font-black uppercase text-center rotate-[-12deg]">
                VERIFIED<br />LOVE
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">Mã Vé</span>
                <span className="text-xs font-bold font-mono text-neutral-900">{ticketCode}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyCertificate}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-200 text-xs font-bold transition-all hover:scale-105"
          >
            {copiedCert ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Đã sao chép nội dung chứng nhận!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-pink-300" />
                <span>Sao Chép Chứng Nhận Để Khoe Bạn Bè</span>
              </>
            )}
          </button>
        </div>

        {/* Reward 3: Secret Behind-The-Scenes Memory Vault */}
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                Phần Thưởng 3 • Bí Mật Hậu Trường Độc Quyền
              </span>
            </div>
            {!isSecretUnlocked ? (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Đang khóa 🔒
              </span>
            ) : (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Đã mở khóa 🔓
              </span>
            )}
          </div>

          {!isSecretUnlocked ? (
            <div className="text-center py-6 space-y-3 bg-[#110D24] rounded-xl border border-white/5">
              <Lock className="w-8 h-8 text-neutral-400 mx-auto animate-pulse" />
              <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                Một khoảnh khắc bí mật chưa từng được công bố trên mạng xã hội của {groomName} &amp; {brideName}.
              </p>
              <button
                type="button"
                onClick={handleUnlockSecret}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Mở Khóa Kho Báu Kỷ Niệm Bí Mật</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 space-y-3 animate-fadeIn text-left">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-bold">
                <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                <span>Bí mật được bật mí từ cô dâu &amp; chú rể:</span>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed italic bg-black/20 p-3 rounded-lg border border-white/5">
                &ldquo;Bật mí nhỏ: Lần đầu tiên Minh Anh ngỏ lời cầu hôn Ngọc Mai trong chuyến đi Đà Lạt mưa bay, chú rể vì quá run nên đã làm rơi chiếc hộp nhẫn xuống cỏ và phải nhờ cả nhóm bạn soi đèn pin tìm suốt 15 phút! Nhưng khoảnh khắc ấy lại là kỷ niệm ngọt ngào và đáng nhớ nhất trong cuộc đời hai đứa. Cảm ơn bạn vì đã luôn là tri kỷ của chúng mình!&rdquo;
              </p>
              <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đặc quyền VIP: Ưu tiên chụp ảnh photobooth cùng cặp đôi tại tiệc cưới!</span>
              </div>
            </div>
          )}
        </div>

        {/* Action: Open Leaderboard */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLeaderboard();
            }}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-neutral-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>Ghi Danh Lên Bảng Xếp Hạng Tình Yêu 🏆</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto cursor-pointer px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 hover:text-white font-bold text-xs sm:text-sm transition-all"
          >
            Quay lại trang thiệp
          </button>
        </div>
      </div>
    </div>
  );
}
