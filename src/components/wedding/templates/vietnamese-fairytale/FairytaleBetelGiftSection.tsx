import React, { useState } from 'react';
import { BankAccount } from '../../../../types';
import { ChapterHeaderBadge, FolkCloud, FolkLotus, FolkRedSeal } from './FairytaleOrnaments';
import { QrCode, Copy, Check, Heart, Sparkles, ZoomIn } from 'lucide-react';
import { openQRZoom } from '../../common/QRZoomModal';

interface FairytaleBetelGiftSectionProps {
  groomBank?: Partial<BankAccount> & { accountName?: string };
  brideBank?: Partial<BankAccount> & { accountName?: string };
  groomName: string;
  brideName: string;
}

export function FairytaleBetelGiftSection({
  groomBank,
  brideBank,
  groomName,
  brideName,
}: FairytaleBetelGiftSectionProps) {
  const [selectedSide, setSelectedSide] = useState<'groom' | 'bride'>('groom');
  const [copied, setCopied] = useState(false);

  // Default fallback bank data if none configured
  const defaultGroomBank = {
    bankName: groomBank?.bankName || '',
    accountNumber: groomBank?.accountNumber || '',
    accountHolder: groomBank?.accountHolder || (groomBank as any)?.accountName || '',
    qrCodeUrl: groomBank?.qrCodeUrl || '',
  };

  const defaultBrideBank = {
    bankName: brideBank?.bankName || '',
    accountNumber: brideBank?.accountNumber || '',
    accountHolder: brideBank?.accountHolder || (brideBank as any)?.accountName || '',
    qrCodeUrl: brideBank?.qrCodeUrl || '',
  };

  const activeBank = selectedSide === 'groom' ? defaultGroomBank : defaultBrideBank;

  const copyAccountNumber = () => {
    if (activeBank.accountNumber) {
      navigator.clipboard.writeText(activeBank.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="betel-gift" className="relative py-24 px-4 overflow-hidden bg-[#FAF5EB]">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Chapter 5 Badge */}
        <ChapterHeaderBadge
          chapterNum="Chương V • Mâm Quả Trầu Cau"
          title="Gửi Trao Mừng Cưới"
          subtext="Miếng trầu nên nghĩa nên duyên, tấm lòng quý báu gửi niềm hỷ hoan"
        />

        {/* Narrative Box: "Miếng Trầu Là Đầu Câu Chuyện" */}
        <div className="max-w-2xl mx-auto mb-10 text-center bg-[#FFFDF9] border border-[#D9CBB7] p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-center gap-2 text-[#BA262B] text-xs font-serif font-bold uppercase mb-2">
            <FolkLotus className="w-4 h-4" />
            <span>Ý Nghĩa Mừng Cưới Dân Gian</span>
            <FolkLotus className="w-4 h-4" />
          </div>
          <p className="font-poetry text-xs sm:text-sm text-[#543026] italic leading-relaxed">
            "Sự hiện diện và lời chúc phúc của quý khách là món quà vô giá nhất đối với chúng mình. Nếu quý khách ở xa hoặc muốn gửi gắm mừng cưới chúc phúc cho đôi bạn trẻ, có thể quét mã VietQR may mắn bên dưới."
          </p>
        </div>

        {/* Side Selector Tabs (Mừng Nhà Trai / Mừng Nhà Gái) */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedSide('groom')}
            className={`px-6 py-2.5 rounded-full font-serif text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              selectedSide === 'groom'
                ? 'bg-[#1D3557] border-[#1D3557] text-[#FAF5EB] shadow-md scale-105'
                : 'bg-[#FFFDF9] border-[#D9CBB7] text-[#1D3557] hover:border-[#1D3557]'
            }`}
          >
            Hộp Mừng Chú Rể ({groomName})
          </button>
          <button
            onClick={() => setSelectedSide('bride')}
            className={`px-6 py-2.5 rounded-full font-serif text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
              selectedSide === 'bride'
                ? 'bg-[#BA262B] border-[#BA262B] text-[#FAF5EB] shadow-md scale-105'
                : 'bg-[#FFFDF9] border-[#D9CBB7] text-[#BA262B] hover:border-[#BA262B]'
            }`}
          >
            Hộp Mừng Cô Dâu ({brideName})
          </button>
        </div>

        {/* Lacquer Box Gift Card (Tráp Sơn Son Mừng Cưới) */}
        <div className="max-w-md mx-auto bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 border-2 border-[#D9CBB7] shadow-2xl relative overflow-hidden">
          {/* Top lacquer decoration bar */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#BA262B] via-[#E5A93C] to-[#BA262B]" />

          <div className="text-center space-y-4">
            {/* Seal and Bank label */}
            <div className="flex items-center justify-between border-b border-[#E6D8C2] pb-3">
              <span className="text-xs font-serif font-bold text-[#6D271C]">
                {selectedSide === 'groom' ? 'Đại Diện Nhà Trai' : 'Đại Diện Nhà Gái'}
              </span>
              <FolkRedSeal text="HỶ" subtitle="VIETQR" className="w-8 h-8 text-[9px] text-[#BA262B] border-[#BA262B]" />
            </div>

            {/* QR Code Container */}
            <div className="relative inline-block text-center">
              <div
                onClick={() => {
                  if (activeBank.qrCodeUrl) {
                    openQRZoom({
                      qrUrl: activeBank.qrCodeUrl,
                      title: `Mừng Cưới ${selectedSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                      bankName: activeBank.bankName,
                      accountNumber: activeBank.accountNumber,
                      accountHolder: activeBank.accountHolder,
                      note: `Mung cuoi ${selectedSide === 'groom' ? groomName : brideName}`,
                    });
                  }
                }}
                className={`relative inline-block p-3 bg-[#FAF5EB] rounded-2xl border-2 border-[#D9CBB7] shadow-inner group transition-all ${
                  activeBank.qrCodeUrl ? 'cursor-pointer hover:scale-[1.03] active:scale-95 hover:border-[#BA262B]' : ''
                }`}
                title="Chạm để phóng to mã QR"
                data-qr-zoom="true"
                data-qr-url={activeBank.qrCodeUrl}
                data-qr-title={`Mừng Cưới ${selectedSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`}
                data-qr-bank={activeBank.bankName}
                data-qr-account={activeBank.accountNumber}
                data-qr-holder={activeBank.accountHolder}
              >
                {activeBank.qrCodeUrl ? (
                  <div className="relative">
                    <img
                      src={activeBank.qrCodeUrl}
                      alt={`Mã VietQR mừng cưới ${activeBank.accountHolder}`}
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl mx-auto"
                    />
                    {/* Hover zoom overlay */}
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-bold tracking-wide bg-black/70 px-2.5 py-0.5 rounded-full border border-white/20">
                        Chạm để phóng to
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center bg-white rounded-xl text-neutral-400">
                    <QrCode className="w-16 h-16" />
                    <span className="text-xs mt-2">Mã QR Mừng Cưới</span>
                  </div>
                )}
              </div>

              {activeBank.qrCodeUrl && (
                <button
                  type="button"
                  onClick={() =>
                    openQRZoom({
                      qrUrl: activeBank.qrCodeUrl,
                      title: `Mừng Cưới ${selectedSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                      bankName: activeBank.bankName,
                      accountNumber: activeBank.accountNumber,
                      accountHolder: activeBank.accountHolder,
                      note: `Mung cuoi ${selectedSide === 'groom' ? groomName : brideName}`,
                    })
                  }
                  className="block mx-auto text-center text-xs text-[#7A4C3E] hover:text-[#BA262B] font-medium mt-2 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Bấm vào hình để phóng to mã QR</span>
                  </span>
                </button>
              )}
            </div>

            {/* Bank details with 1-click copy */}
            <div className="bg-[#FAF5EB] p-4 rounded-xl border border-[#E6D8C2] text-left space-y-2">
              <div className="flex justify-between text-xs text-[#7A4C3E]">
                <span>Ngân hàng:</span>
                <span className="font-bold text-[#351E17] font-serif">{activeBank.bankName}</span>
              </div>
              <div className="flex justify-between text-xs text-[#7A4C3E]">
                <span>Chủ tài khoản:</span>
                <span className="font-bold text-[#351E17] font-serif uppercase">{activeBank.accountHolder}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#7A4C3E] pt-1 border-t border-[#E6D8C2]">
                <span>Số tài khoản:</span>
                <span className="font-mono font-bold text-sm sm:text-base text-[#BA262B] tracking-wider">
                  {activeBank.accountNumber}
                </span>
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={copyAccountNumber}
              className="w-full py-2.5 px-4 rounded-xl bg-[#BA262B] hover:bg-[#853023] text-[#FAF5EB] text-xs font-serif font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã Sao Chép Số Tài Khoản!' : 'Sao Chép Số Tài Khoản'}</span>
            </button>

            <p className="text-[11px] font-poetry text-[#7A4C3E] italic">
              * Tự động hiển thị nội dung chúc phúc khi quét mã VietQR bằng ứng dụng ngân hàng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
