import React, { useState } from 'react';
import { WeddingData } from '../../../../types';
import { SparklingStar, LotusNightIcon, HoiAnDiamondLantern } from './LanternNightOrnaments';
import { Gift, QrCode, Copy, Check, Heart, Sparkles, ZoomIn } from 'lucide-react';
import { openQRZoom } from '../../common/QRZoomModal';

interface LanternGiftSectionProps {
  data: WeddingData;
}

export function LanternGiftSection({ data }: LanternGiftSectionProps) {
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Bank Info for Groom and Bride
  const groomBank = {
    bankName: data.gift?.groomBank?.bankName || 'Vietcombank',
    accountNumber: data.gift?.groomBank?.accountNumber || '1018899888',
    accountHolder: data.gift?.groomBank?.accountHolder || data.groomName || 'NGUYEN MINH ANH',
    qrCode:
      data.gift?.groomBank?.qrCodeUrl ||
      'https://api.vietqr.io/image/970436-1018899888-rFm9g5a.jpg?accountName=NGUYEN%20MINH%20ANH&amount=0',
  };

  const brideBank = {
    bankName: data.gift?.brideBank?.bankName || 'Techcombank',
    accountNumber: data.gift?.brideBank?.accountNumber || '1903668899',
    accountHolder: data.gift?.brideBank?.accountHolder || data.brideName || 'TRAN NGOC MAI',
    qrCode:
      data.gift?.brideBank?.qrCodeUrl ||
      'https://api.vietqr.io/image/970407-1903668899-7sK3x9y.jpg?accountName=TRAN%20NGOC%20MAI&amount=0',
  };

  const current = activeTab === 'groom' ? groomBank : brideBank;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <section id="gift" className="relative py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-serif uppercase tracking-widest">
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Hộp Mừng Cưới Đèn Lồng Cát Tường</span>
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-100 via-amber-300 to-amber-100">
          Gửi Trao Chúc Phúc (Mừng Cưới)
        </h2>
        <p className="font-serif italic text-sm text-neutral-400 max-w-md mx-auto">
          Tình cảm và lời chúc của quý khách là món quà quý giá nhất. Với những người thân ở xa, quý khách có thể gửi lời chúc qua hộp quà mừng cưới VietQR.
        </p>
      </div>

      {/* Main Gift Box Panel with Lantern Frame */}
      <div className="relative rounded-3xl bg-neutral-950/80 border border-amber-500/35 p-6 sm:p-10 backdrop-blur-md shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400 to-transparent" />

        {/* Tab Selection: Nhà Trai & Nhà Gái */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('groom')}
            className={`cursor-pointer px-6 py-2.5 rounded-full font-serif text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
              activeTab === 'groom'
                ? 'bg-amber-500 text-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-neutral-900 text-amber-200/80 hover:bg-neutral-800 border border-amber-500/30'
            }`}
          >
            Mừng Cưới Chú Rể (Nhà Trai)
          </button>
          <button
            onClick={() => setActiveTab('bride')}
            className={`cursor-pointer px-6 py-2.5 rounded-full font-serif text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
              activeTab === 'bride'
                ? 'bg-amber-500 text-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-neutral-900 text-amber-200/80 hover:bg-neutral-800 border border-amber-500/30'
            }`}
          >
            Mừng Cưới Cô Dâu (Nhà Gái)
          </button>
        </div>

        {/* QR Code & Banking Details */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* QR Code Frame */}
          <div className="flex flex-col items-center">
            <div
              onClick={() =>
                openQRZoom({
                  qrUrl: current.qrCode,
                  title: `Mừng Cưới ${activeTab === 'groom' ? 'Nhà Trai (Chú Rể)' : 'Nhà Gái (Cô Dâu)'}`,
                  bankName: current.bankName,
                  accountNumber: current.accountNumber,
                  accountHolder: current.accountHolder,
                  note: `Mung cuoi ${current.accountHolder}`,
                })
              }
              className="relative p-3 rounded-2xl bg-white shadow-2xl border-2 border-amber-400/60 max-w-[220px] w-full cursor-pointer group hover:scale-105 transition-all active:scale-95"
              title="Chạm để phóng to mã QR"
              data-qr-zoom="true"
              data-qr-url={current.qrCode}
              data-qr-title={`Mừng Cưới ${activeTab === 'groom' ? 'Nhà Trai (Chú Rể)' : 'Nhà Gái (Cô Dâu)'}`}
              data-qr-bank={current.bankName}
              data-qr-account={current.accountNumber}
              data-qr-holder={current.accountHolder}
            >
              <img
                src={current.qrCode}
                alt="VietQR Mừng Cưới"
                className="w-full aspect-square object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
                  Chạm phóng to
                </span>
              </div>
              <div className="mt-2 text-center text-[10px] font-body text-neutral-600 font-semibold uppercase tracking-wider">
                Quét mã VietQR tiện lợi
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                openQRZoom({
                  qrUrl: current.qrCode,
                  title: `Mừng Cưới ${activeTab === 'groom' ? 'Nhà Trai (Chú Rể)' : 'Nhà Gái (Cô Dâu)'}`,
                  bankName: current.bankName,
                  accountNumber: current.accountNumber,
                  accountHolder: current.accountHolder,
                  note: `Mung cuoi ${current.accountHolder}`,
                })
              }
              className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-100 font-body mt-2 cursor-pointer"
            >
              <ZoomIn className="w-3 h-3" />
              <span>Bấm vào ảnh để phóng to</span>
            </button>
          </div>

          {/* Account Details */}
          <div className="space-y-4 max-w-sm w-full text-center md:text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400/80">
                Ngân Hàng
              </span>
              <p className="font-serif-title text-xl font-bold text-amber-100">
                {current.bankName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400/80">
                Chủ Tài Khoản
              </span>
              <p className="font-serif-title text-lg font-bold text-amber-200">
                {current.accountHolder}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-serif uppercase tracking-widest text-amber-400/80">
                Số Tài Khoản
              </span>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-amber-300 tracking-wider">
                  {current.accountNumber}
                </span>
                <button
                  onClick={() => handleCopy(current.accountNumber, 'acc')}
                  className="cursor-pointer p-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 transition-colors"
                  title="Sao chép số tài khoản"
                >
                  {copiedKey === 'acc' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copiedKey === 'acc' && (
                <p className="text-xs text-emerald-400 font-body">Đã sao chép số tài khoản!</p>
              )}
            </div>

            <p className="text-xs text-neutral-400 font-body italic pt-2">
              Nội dung chuyển khoản gợi ý: <span className="text-amber-200">"{data.groomName || 'Minh Anh'} &amp; {data.brideName || 'Ngoc Mai'} - Chuc Mung Hanh Phuc"</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
