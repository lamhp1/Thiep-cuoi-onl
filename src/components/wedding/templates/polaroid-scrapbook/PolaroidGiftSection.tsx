import React, { useState } from 'react';
import { Gift, Copy, Check, QrCode, Heart, Sparkles, Send, ZoomIn } from 'lucide-react';
import { WeddingGiftInfo, BankAccount } from '../../../../types';
import { copyToClipboard } from '../../../../lib/utils';
import { WashiTape, StampSticker, PostmarkCircle, HeartSticker } from './PolaroidScrapbookOrnaments';
import { openQRZoom } from '../../common/QRZoomModal';

interface PolaroidGiftSectionProps {
  gift?: WeddingGiftInfo;
  groomName?: string;
  brideName?: string;
}

export function PolaroidGiftSection({
  gift,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: PolaroidGiftSectionProps) {
  const [activeSide, setActiveSide] = useState<'groom' | 'bride'>('groom');
  const [copied, setCopied] = useState(false);

  const defaultGift: WeddingGiftInfo = {
    message:
      'Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất dành cho chúng mình. Nếu quý khách muốn gửi chút tình cảm từ phương xa, có thể quét mã QR tiện lợi dưới đây.',
    groomBank: {
      bankName: 'Ngân hàng TMCP Ngoại Thương (Vietcombank)',
      accountNumber: '1012345678',
      accountHolder: 'NGUYEN MINH ANH',
      note: 'Chi nhánh Huế',
      qrCodeUrl:
        'https://api.vietqr.io/image/970436-1012345678-compact2.jpg?accountName=NGUYEN%20MINH%20ANH&amount=0',
    },
    brideBank: {
      bankName: 'Ngân hàng Quân Đội (MB Bank)',
      accountNumber: '0905654321',
      accountHolder: 'TRAN NGOC MAI',
      note: 'Chi nhánh Đà Nẵng',
      qrCodeUrl:
        'https://api.vietqr.io/image/970422-0905654321-compact2.jpg?accountName=TRAN%20NGOC%20MAI&amount=0',
    },
  };

  const currentGift = gift || defaultGift;
  const currentBank: BankAccount =
    activeSide === 'groom'
      ? currentGift.groomBank || defaultGift.groomBank
      : currentGift.brideBank || defaultGift.brideBank;

  const handleCopy = async (text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="gift" className="relative py-14 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      {/* Title */}
      <div className="mb-10">
        <div className="inline-block relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <WashiTape style="gold-sheen" angle={1} width="w-32" />
          </div>
          <div className="bg-[#FFFDF9] border border-[#E3D4BC] px-6 py-2 rounded-xs shadow-xs inline-flex items-center gap-2">
            <Gift className="w-3.5 h-3.5 text-[#D9735A]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7E5E44] font-bold">
              HỘP MỪNG CƯỚI • A TOKEN OF LOVE
            </span>
            <Gift className="w-3.5 h-3.5 text-[#D9735A]" />
          </div>
        </div>

        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#2C211B] mt-4">
          Gửi Quà Mừng & Chúc Phúc
        </h2>
        <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5738] mt-1 max-w-lg mx-auto">
          "{currentGift.message}"
        </p>
      </div>

      {/* Airmail Vintage Envelope Container */}
      <div className="relative bg-[#FFFDF9] border-2 border-[#D9C8AC] rounded-xl shadow-xl p-6 sm:p-10 max-w-2xl mx-auto overflow-hidden [background-image:repeating-linear-gradient(135deg,#D9C8AC_0px,#D9C8AC_10px,transparent_10px,transparent_20px)] bg-origin-border">
        {/* Airmail Edge Border Stripe (Red & Blue Retro Postal Pattern) */}
        <div className="absolute top-0 left-0 right-0 h-2.5 [background:repeating-linear-gradient(-45deg,#C84B5D,#C84B5D_15px,#FFF_15px,#FFF_20px,#3E6B89_20px,#3E6B89_35px,#FFF_35px,#FFF_40px)]" />
        <div className="absolute bottom-0 left-0 right-0 h-2.5 [background:repeating-linear-gradient(-45deg,#C84B5D,#C84B5D_15px,#FFF_15px,#FFF_20px,#3E6B89_20px,#3E6B89_35px,#FFF_35px,#FFF_40px)]" />

        {/* Top Right Stamp & Postmark */}
        <div className="absolute top-6 right-6 hidden sm:flex items-center gap-2">
          <PostmarkCircle city="VIETQR AIRMAIL" date="20.12.2026" angle={8} className="scale-75" />
          <StampSticker label="LOVE GIFT" date="2026" price="VIP" angle={-3} className="scale-90" />
        </div>

        {/* Tab Switcher: Nhà Trai / Nhà Gái */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveSide('groom')}
            className={`px-5 py-2 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeSide === 'groom'
                ? 'bg-[#2E473F] text-[#FAF6EE] shadow-md scale-105'
                : 'bg-[#FAF4EB] text-[#6E5948] border border-[#DFCBB2] hover:bg-white'
            }`}
          >
            Mừng Cưới Nhà Trai ({groomName})
          </button>
          <button
            onClick={() => setActiveSide('bride')}
            className={`px-5 py-2 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeSide === 'bride'
                ? 'bg-[#C84B5D] text-white shadow-md scale-105'
                : 'bg-[#FAF4EB] text-[#6E5948] border border-[#DFCBB2] hover:bg-white'
            }`}
          >
            Mừng Cưới Nhà Gái ({brideName})
          </button>
        </div>

        {/* Bank & VietQR Card */}
        <div className="bg-[#FAF6EE] border border-[#E0D2BB] p-6 rounded-lg max-w-md mx-auto relative shadow-inner">
          <div className="absolute -top-3 left-8 z-10">
            <WashiTape style="pink-grid" angle={-3} width="w-20" />
          </div>

          {/* QR Image */}
          {(() => {
            const qrImageUrl =
              currentBank.qrCodeUrl ||
              `https://api.vietqr.io/image/970436-${currentBank.accountNumber}-compact2.jpg?accountName=${encodeURIComponent(
                currentBank.accountHolder
              )}`;
            return (
              <div className="text-center mb-4">
                <div
                  onClick={() =>
                    openQRZoom({
                      qrUrl: qrImageUrl,
                      title: `Mừng Cưới ${activeSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                      bankName: currentBank.bankName,
                      accountNumber: currentBank.accountNumber,
                      accountHolder: currentBank.accountHolder,
                      note: currentBank.note || `Mung cuoi ${activeSide === 'groom' ? groomName : brideName}`,
                    })
                  }
                  className="w-48 h-48 mx-auto bg-white p-2.5 rounded-lg shadow-md border border-[#E0D2BB] relative cursor-pointer group hover:scale-[1.03] transition-all active:scale-95"
                  title="Chạm để phóng to mã QR"
                  data-qr-zoom="true"
                  data-qr-url={qrImageUrl}
                  data-qr-title={`Mừng Cưới ${activeSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`}
                  data-qr-bank={currentBank.bankName}
                  data-qr-account={currentBank.accountNumber}
                  data-qr-holder={currentBank.accountHolder}
                >
                  <img
                    src={qrImageUrl}
                    alt="VietQR Mừng Cưới"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {/* Hover zoom overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
                      Chạm phóng to
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openQRZoom({
                      qrUrl: qrImageUrl,
                      title: `Mừng Cưới ${activeSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                      bankName: currentBank.bankName,
                      accountNumber: currentBank.accountNumber,
                      accountHolder: currentBank.accountHolder,
                      note: currentBank.note || `Mung cuoi ${activeSide === 'groom' ? groomName : brideName}`,
                    })
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-[#8C6D1F] hover:text-[#45362C] font-mono mt-2 cursor-pointer"
                >
                  <ZoomIn className="w-3 h-3" />
                  <span>Bấm vào ảnh để phóng to mã QR</span>
                </button>
              </div>
            );
          })()}

          {/* Bank Details */}
          <div className="space-y-1.5 text-center">
            <span className="font-mono text-[10px] text-[#8C6D1F] uppercase tracking-widest block font-bold">
              {currentBank.bankName}
            </span>
            <div className="font-mono text-xl sm:text-2xl font-black text-[#1E1714] tracking-wider">
              {currentBank.accountNumber}
            </div>
            <div className="font-serif-title text-sm sm:text-base font-bold text-[#45362C]">
              {currentBank.accountHolder}
            </div>
            {currentBank.note && (
              <p className="text-xs font-mono text-[#8C7665]">
                {currentBank.note}
              </p>
            )}
          </div>

          {/* Copy Button */}
          <div className="mt-5 pt-4 border-t border-dashed border-[#DFCBB2]">
            <button
              onClick={() => handleCopy(currentBank.accountNumber)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#FFFDF9] hover:bg-white border-2 border-[#C5A265] text-[#8C6D1F] hover:text-[#584109] font-mono text-xs font-bold tracking-wider uppercase shadow-sm transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">ĐÃ SAO CHÉP THÀNH CÔNG!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#C84B5D]" />
                  <span>SAO CHÉP SỐ TÀI KHOẢN</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="font-polaroid-note text-sm text-[#7D6652] mt-6">
          "Xin chân thành cảm ơn tình cảm ấm áp và sự chúc phúc của quý khách!"
        </p>
      </div>
    </section>
  );
}
