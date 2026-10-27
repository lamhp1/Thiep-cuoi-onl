import React, { useState } from 'react';
import { Gift, Copy, Check, QrCode, Sparkles, Heart, ZoomIn } from 'lucide-react';
import { ArtisticBloomingLotus } from './MoonLotusOrnaments';
import { openQRZoom } from '../../common/QRZoomModal';

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl?: string;
  note?: string;
}

interface MoonLotusGiftSectionProps {
  groomBank?: BankAccount;
  brideBank?: BankAccount;
  groomName?: string;
  brideName?: string;
}

export function MoonLotusGiftSection({
  groomBank,
  brideBank,
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: MoonLotusGiftSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');

  const defaultGroomBank: BankAccount = groomBank || {
    bankName: 'Vietcombank',
    accountNumber: '',
    accountHolder: groomName.toUpperCase(),
    note: `Mừng cưới ${groomName} & ${brideName}`,
  };

  const defaultBrideBank: BankAccount = brideBank || {
    bankName: 'Techcombank',
    accountNumber: '',
    accountHolder: brideName.toUpperCase(),
    note: `Mừng cưới ${groomName} & ${brideName}`,
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentBank = activeTab === 'groom' ? defaultGroomBank : defaultBrideBank;
  const currentTitle = activeTab === 'groom' ? 'Mừng Cưới Chú Rể (Nhà Trai)' : 'Mừng Cưới Cô Dâu (Nhà Gái)';

  // Generate standard VietQR image link
  const qrUrl =
    currentBank.qrCodeUrl ||
    `https://img.vietqr.io/image/${currentBank.bankName.toLowerCase()}-${currentBank.accountNumber}-compact2.png?amount=0&addInfo=${encodeURIComponent(
      currentBank.note || 'Mung cuoi'
    )}&accountName=${encodeURIComponent(currentBank.accountHolder)}`;

  return (
    <section id="gift" className="relative py-20 px-4 sm:px-6 z-20">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBD494]/15 border border-[#EBD494]/30 text-[#F4E4BA] text-xs font-serif uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5 text-[#EBD494]" />
            <span>Hộp Mừng Cưới</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-title font-bold text-[#FFFDF7]">
            Gửi Trao Chúc Phúc
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#F4E4BA]/80 leading-relaxed">
            “Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất đối với chúng mình. Nếu muốn gửi quà mừng cưới từ xa, quý vị có thể quét mã VietQR dưới đây.”
          </p>
        </div>

        {/* Tab Switcher: Nhà Trai / Nhà Gái */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-full bg-[#10142E] border border-[#EBD494]/40 shadow-lg">
            <button
              onClick={() => setActiveTab('groom')}
              className={`cursor-pointer px-6 py-2 rounded-full text-xs font-serif uppercase tracking-wider font-semibold transition-all ${
                activeTab === 'groom'
                  ? 'bg-gradient-to-r from-[#751A29] to-[#A8283D] text-white shadow-md'
                  : 'text-[#F4E4BA]/70 hover:text-white'
              }`}
            >
              Nhà Trai (Chú Rể)
            </button>
            <button
              onClick={() => setActiveTab('bride')}
              className={`cursor-pointer px-6 py-2 rounded-full text-xs font-serif uppercase tracking-wider font-semibold transition-all ${
                activeTab === 'bride'
                  ? 'bg-gradient-to-r from-[#751A29] to-[#A8283D] text-white shadow-md'
                  : 'text-[#F4E4BA]/70 hover:text-white'
              }`}
            >
              Nhà Gái (Cô Dâu)
            </button>
          </div>
        </div>

        {/* The Card Box */}
        <div className="rounded-3xl p-6 sm:p-10 bg-[#0E122A]/90 border border-[#EBD494]/40 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col items-center text-center space-y-6">
          {/* Subtle Blooming Lotus top ornament */}
          <div className="relative -mt-4 mb-2">
            <ArtisticBloomingLotus size={100} bloomProgress={0.9} />
          </div>

          <h3 className="text-xl font-serif-title font-bold text-[#FFFDF7]">
            {currentTitle}
          </h3>

          {/* QR Code */}
          <div className="text-center">
            <div
              onClick={() =>
                openQRZoom({
                  qrUrl,
                  title: `${currentTitle} - ${currentBank.accountHolder}`,
                  bankName: currentBank.bankName,
                  accountNumber: currentBank.accountNumber,
                  accountHolder: currentBank.accountHolder,
                  note: currentBank.note || `Mung cuoi ${currentBank.accountHolder}`,
                })
              }
              className="relative p-4 rounded-2xl bg-white shadow-xl border-2 border-[#EBD494]/50 max-w-[220px] mx-auto cursor-pointer group hover:scale-105 transition-all active:scale-95"
              title="Chạm để phóng to mã QR"
              data-qr-zoom="true"
              data-qr-url={qrUrl}
              data-qr-title={`${currentTitle} - ${currentBank.accountHolder}`}
              data-qr-bank={currentBank.bankName}
              data-qr-account={currentBank.accountNumber}
              data-qr-holder={currentBank.accountHolder}
            >
              <img
                src={qrUrl}
                alt="VietQR mừng cưới"
                className="w-full h-auto object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
                  Chạm phóng to
                </span>
              </div>
              <div className="mt-2 text-[10px] font-sans text-neutral-500 font-semibold uppercase tracking-wider">
                Quét mã VietQR
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                openQRZoom({
                  qrUrl,
                  title: `${currentTitle} - ${currentBank.accountHolder}`,
                  bankName: currentBank.bankName,
                  accountNumber: currentBank.accountNumber,
                  accountHolder: currentBank.accountHolder,
                  note: currentBank.note || `Mung cuoi ${currentBank.accountHolder}`,
                })
              }
              className="inline-flex items-center gap-1 text-[11px] text-[#EBD494] hover:text-white font-serif mt-2 cursor-pointer"
            >
              <ZoomIn className="w-3 h-3" />
              <span>Bấm vào hình để phóng to mã QR</span>
            </button>
          </div>

          {/* Account Details */}
          <div className="w-full max-w-md space-y-3 font-serif text-xs sm:text-sm text-neutral-300">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141A36] border border-[#EBD494]/20">
              <span className="text-neutral-400">Ngân hàng:</span>
              <span className="font-bold text-[#FFFDF7]">{currentBank.bankName}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141A36] border border-[#EBD494]/20">
              <span className="text-neutral-400">Chủ tài khoản:</span>
              <span className="font-bold text-[#FFFDF7] uppercase">{currentBank.accountHolder}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141A36] border border-[#EBD494]/20">
              <span className="text-neutral-400">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#F4E4BA] tracking-wider text-sm">
                  {currentBank.accountNumber}
                </span>
                <button
                  onClick={() => handleCopy(currentBank.accountNumber, activeTab)}
                  className="cursor-pointer p-1.5 rounded-lg bg-[#EBD494]/20 hover:bg-[#EBD494]/30 text-[#F4E4BA] transition-colors"
                  title="Sao chép số tài khoản"
                >
                  {copiedKey === activeTab ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {copiedKey === activeTab && (
              <p className="text-xs text-emerald-400 font-serif animate-fadeIn">
                Đã sao chép số tài khoản thành công!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
