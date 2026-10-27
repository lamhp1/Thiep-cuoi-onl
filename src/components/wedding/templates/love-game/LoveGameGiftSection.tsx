import React, { useState } from 'react';
import { Gift, Copy, Check, Sparkles, CheckCircle2, QrCode, CreditCard, Heart, ZoomIn } from 'lucide-react';
import { BankAccount } from '../../../../types';
import { playPointChime } from './loveGameSounds';
import { openQRZoom } from '../../common/QRZoomModal';

interface LoveGameGiftSectionProps {
  groomBank?: BankAccount;
  brideBank?: BankAccount;
  isCompleted: boolean;
  onCompleteQuest: () => void;
}

export function LoveGameGiftSection({
  groomBank,
  brideBank,
  isCompleted,
  onCompleteQuest,
}: LoveGameGiftSectionProps) {
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [isBoxOpened, setIsBoxOpened] = useState(false);

  const defaultGroomBank: BankAccount = {
    bankName: 'MB Bank (Quân Đội)',
    accountNumber: '0905123456',
    accountHolder: 'NGUYEN MINH ANH',
    qrCodeUrl: 'https://api.vietqr.io/image/970422-0905123456-compact2.jpg?amount=0&addInfo=Mung%20cuoi%20Minh%20Anh&accountName=NGUYEN%20MINH%20ANH',
    note: 'Mừng cưới Chú rể Minh Anh',
  };

  const defaultBrideBank: BankAccount = {
    bankName: 'Vietcombank',
    accountNumber: '0905654321',
    accountHolder: 'TRAN NGOC MAI',
    qrCodeUrl: 'https://api.vietqr.io/image/970436-0905654321-compact2.jpg?amount=0&addInfo=Mung%20cuoi%20Ngoc%20Mai&accountName=TRAN%20NGOC%20MAI',
    note: 'Mừng cưới Cô dâu Ngọc Mai',
  };

  const activeGroom = groomBank || defaultGroomBank;
  const activeBride = brideBank || defaultBrideBank;
  const currentBank = activeTab === 'groom' ? activeGroom : activeBride;

  const handleOpenBox = () => {
    setIsBoxOpened(true);
    playPointChime();
    if (!isCompleted) {
      onCompleteQuest();
    }
  };

  const handleCopy = (num: string, type: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedBank(type);
    playPointChime();
    if (!isCompleted) {
      onCompleteQuest();
    }
    setTimeout(() => setCopiedBank(null), 2500);
  };

  return (
    <section id="quest-gift" className="relative py-24 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto space-y-10 text-center">
        
        {/* Section Header with Quest Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Gift className="w-3.5 h-3.5 text-rose-400" />
            <span>QUEST 05 • HỘP QUÀ MỪNG CƯỚI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Gửi Trao Chúc Phúc (Lucky Box)
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            Sự hiện diện và lời chúc của bạn là món quà quý giá nhất đối với chúng mình. Nếu muốn gửi quà mừng từ xa, bạn có thể quét mã VietQR tiện lợi dưới đây!
          </p>

          {/* Quest completion badge */}
          <div className="pt-1">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ĐÃ HOÀN THÀNH CHẶNG 5 (+10 LOVE POINTS)
              </span>
            ) : (
              <button
                type="button"
                onClick={handleOpenBox}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-rose-200 text-xs font-mono font-bold transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Mở hộp quà mừng cưới (+10 PTS)
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher: Nhà Trai vs Nhà Gái */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('groom');
              playPointChime();
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'groom'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg scale-105'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
            }`}
          >
            <span>🎩 Mừng Cưới Chú Rể</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('bride');
              playPointChime();
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bride'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
            }`}
          >
            <span>👰 Mừng Cưới Cô Dâu</span>
          </button>
        </div>

        {/* QR Code & Bank Card */}
        <div className="max-w-md mx-auto bg-[#16132A]/90 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* QR Code Display with Scanner Frame */}
          {(() => {
            const qrImageUrl =
              currentBank.qrCodeUrl ||
              `https://api.vietqr.io/image/970422-${currentBank.accountNumber}-compact2.jpg`;
            return (
              <div className="text-center">
                <div
                  onClick={() =>
                    openQRZoom({
                      qrUrl: qrImageUrl,
                      title: `Mừng Cưới ${activeTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'} - ${currentBank.accountHolder}`,
                      bankName: currentBank.bankName,
                      accountNumber: currentBank.accountNumber,
                      accountHolder: currentBank.accountHolder,
                      note: currentBank.note || `Mung cuoi ${currentBank.accountHolder}`,
                    })
                  }
                  className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden group cursor-pointer hover:scale-105 transition-all active:scale-95"
                  title="Chạm để phóng to mã QR"
                  data-qr-zoom="true"
                  data-qr-url={qrImageUrl}
                  data-qr-title={`Mừng Cưới ${activeTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'} - ${currentBank.accountHolder}`}
                  data-qr-bank={currentBank.bankName}
                  data-qr-account={currentBank.accountNumber}
                  data-qr-holder={currentBank.accountHolder}
                >
                  <img
                    src={qrImageUrl}
                    alt={`Mã VietQR ${currentBank.accountHolder}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-pink-500" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-pink-500" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-pink-500" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-pink-500" />

                  {/* Hover zoom overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold bg-black/70 px-2.5 py-0.5 rounded-full border border-white/20">
                      Chạm để phóng to
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openQRZoom({
                      qrUrl: qrImageUrl,
                      title: `Mừng Cưới ${activeTab === 'groom' ? 'Chú Rể' : 'Cô Dâu'} - ${currentBank.accountHolder}`,
                      bankName: currentBank.bankName,
                      accountNumber: currentBank.accountNumber,
                      accountHolder: currentBank.accountHolder,
                      note: currentBank.note || `Mung cuoi ${currentBank.accountHolder}`,
                    })
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-pink-300 hover:text-white font-mono mt-2 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Bấm vào ảnh để phóng to mã QR</span>
                </button>
              </div>
            );
          })()}

          {/* Bank details */}
          <div className="space-y-2 text-center text-white">
            <p className="text-xs font-mono uppercase tracking-wider text-pink-300 font-bold">
              {currentBank.bankName}
            </p>
            <h4 className="text-lg sm:text-xl font-bold">
              {currentBank.accountHolder}
            </h4>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-base font-bold text-amber-300">
              <span>{currentBank.accountNumber}</span>
            </div>
          </div>

          {/* Copy Button */}
          <div>
            <button
              type="button"
              onClick={() => handleCopy(currentBank.accountNumber, activeTab)}
              className="w-full cursor-pointer flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] active:scale-98 shadow-md"
            >
              {copiedBank === activeTab ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Đã Sao Chép Số Tài Khoản!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao Chép Số Tài Khoản (+10 PTS)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
