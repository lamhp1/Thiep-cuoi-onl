import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WeddingGiftInfo } from '../../../../types';
import { Compass, Gift, QrCode, Copy, Check, Heart, ShieldCheck, ZoomIn } from 'lucide-react';
import { openQRZoom } from '../../common/QRZoomModal';

interface LoveMapGiftSectionProps {
  giftInfo?: WeddingGiftInfo;
  groomName?: string;
  brideName?: string;
}

export function LoveMapGiftSection({
  giftInfo,
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: LoveMapGiftSectionProps) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [selectedQR, setSelectedQR] = useState<{ url: string; title: string } | null>(null);

  const groomBank = giftInfo?.groomBank;
  const brideBank = giftInfo?.brideBank;

  const handleCopy = (accNum: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(accNum);
      setCopiedAccount(accNum);
      setTimeout(() => setCopiedAccount(null), 2500);
    }
  };

  return (
    <section
      id="gift"
      className="relative py-20 px-4 bg-[#F5EFE3] text-[#443B35] overflow-hidden"
    >
      <div className="relative z-20 max-w-4xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-bold text-[#722238]">
            <Compass className="w-3.5 h-3.5 text-[#B9985A]" />
            <span>HÀNH TRANG CHÚC PHÚC</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#443B35]">
            A LITTLE SOMETHING
          </h2>
          <div className="w-16 h-[2px] bg-[#B9985A] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-[#443B35]/80 font-body leading-relaxed">
            {giftInfo?.message || 'Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất đối với chúng mình trong hành trình này.'}
          </p>
        </div>

        {/* Bank / QR Cards: Styled like Travel Luggage Tags / Vintage Envelopes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* GROOM GIFT CARD */}
          {groomBank && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#B9985A]/40 shadow-xl flex flex-col justify-between"
            >
              {/* Top Tag */}
              <div className="flex items-center justify-between pb-4 border-b border-[#B9985A]/20">
                <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#722238] text-[#FFFDF9]">
                  MỪNG CƯỚI CHÚ RỂ
                </span>
                <span className="text-xs font-semibold text-[#722238]">{groomName}</span>
              </div>

              {/* QR Image preview */}
              {Boolean(groomBank.qrCodeUrl) && (
                <div className="my-6 flex justify-center">
                  <div
                    onClick={() => {
                      if (groomBank.qrCodeUrl) {
                        openQRZoom({
                          qrUrl: groomBank.qrCodeUrl,
                          title: `Mừng cưới chú rể ${groomName}`,
                          bankName: groomBank.bankName,
                          accountNumber: groomBank.accountNumber,
                          accountHolder: groomBank.accountHolder,
                          note: `Mung cuoi ${groomName}`,
                        });
                      }
                    }}
                    className="p-3 bg-white rounded-2xl border-2 border-dashed border-[#B9985A]/50 shadow-md cursor-pointer group hover:border-[#722238] transition-all hover:scale-105"
                    title="Chạm để phóng to mã QR"
                    data-qr-zoom="true"
                    data-qr-url={groomBank.qrCodeUrl}
                    data-qr-title={`Mừng cưới chú rể ${groomName}`}
                    data-qr-bank={groomBank.bankName}
                    data-qr-account={groomBank.accountNumber}
                    data-qr-holder={groomBank.accountHolder}
                  >
                    <img
                      src={groomBank.qrCodeUrl}
                      alt="VietQR Chú Rể"
                      className="w-36 h-36 object-contain rounded-lg"
                    />
                    <span className="text-[10px] font-semibold text-[#722238] flex items-center justify-center gap-1 mt-2">
                      <ZoomIn className="w-3 h-3" /> Chạm phóng to
                    </span>
                  </div>
                </div>
              )}

              {/* Account Details */}
              <div className="space-y-2 text-xs sm:text-sm bg-[#FAF6EE] p-4 rounded-2xl border border-[#B9985A]/25">
                <div className="flex justify-between">
                  <span className="text-[#443B35]/70">Ngân hàng:</span>
                  <span className="font-bold text-[#443B35]">{groomBank.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#443B35]/70">Chủ tài khoản:</span>
                  <span className="font-bold text-[#443B35]">{groomBank.accountHolder}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#B9985A]/20">
                  <span className="text-[#443B35]/70">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#722238] text-sm">
                      {groomBank.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(groomBank.accountNumber)}
                      className="p-1 rounded-md bg-[#FFFDF9] hover:bg-[#B9985A]/20 text-[#722238] border border-[#B9985A]/30 transition-colors cursor-pointer"
                      title="Sao chép"
                    >
                      {copiedAccount === groomBank.accountNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BRIDE GIFT CARD */}
          {brideBank && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#B9985A]/40 shadow-xl flex flex-col justify-between"
            >
              {/* Top Tag */}
              <div className="flex items-center justify-between pb-4 border-b border-[#B9985A]/20">
                <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#53665A] text-[#FFFDF9]">
                  MỪNG CƯỚI CÔ DÂU
                </span>
                <span className="text-xs font-semibold text-[#53665A]">{brideName}</span>
              </div>

              {/* QR Image preview */}
              {Boolean(brideBank.qrCodeUrl) && (
                <div className="my-6 flex justify-center">
                  <div
                    onClick={() => {
                      if (brideBank.qrCodeUrl) {
                        openQRZoom({
                          qrUrl: brideBank.qrCodeUrl,
                          title: `Mừng cưới cô dâu ${brideName}`,
                          bankName: brideBank.bankName,
                          accountNumber: brideBank.accountNumber,
                          accountHolder: brideBank.accountHolder,
                          note: `Mung cuoi ${brideName}`,
                        });
                      }
                    }}
                    className="p-3 bg-white rounded-2xl border-2 border-dashed border-[#B9985A]/50 shadow-md cursor-pointer group hover:border-[#53665A] transition-all hover:scale-105"
                    title="Chạm để phóng to mã QR"
                    data-qr-zoom="true"
                    data-qr-url={brideBank.qrCodeUrl}
                    data-qr-title={`Mừng cưới cô dâu ${brideName}`}
                    data-qr-bank={brideBank.bankName}
                    data-qr-account={brideBank.accountNumber}
                    data-qr-holder={brideBank.accountHolder}
                  >
                    <img
                      src={brideBank.qrCodeUrl}
                      alt="VietQR Cô Dâu"
                      className="w-36 h-36 object-contain rounded-lg"
                    />
                    <span className="text-[10px] font-semibold text-[#53665A] flex items-center justify-center gap-1 mt-2">
                      <ZoomIn className="w-3 h-3" /> Chạm phóng to
                    </span>
                  </div>
                </div>
              )}

              {/* Account Details */}
              <div className="space-y-2 text-xs sm:text-sm bg-[#FAF6EE] p-4 rounded-2xl border border-[#B9985A]/25">
                <div className="flex justify-between">
                  <span className="text-[#443B35]/70">Ngân hàng:</span>
                  <span className="font-bold text-[#443B35]">{brideBank.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#443B35]/70">Chủ tài khoản:</span>
                  <span className="font-bold text-[#443B35]">{brideBank.accountHolder}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#B9985A]/20">
                  <span className="text-[#443B35]/70">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#53665A] text-sm">
                      {brideBank.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(brideBank.accountNumber)}
                      className="p-1 rounded-md bg-[#FFFDF9] hover:bg-[#B9985A]/20 text-[#53665A] border border-[#B9985A]/30 transition-colors cursor-pointer"
                      title="Sao chép"
                    >
                      {copiedAccount === brideBank.accountNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* QR Zoom Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedQR(null)}
        >
          <div
            className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#B9985A] shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif-title text-lg font-bold text-[#722238]">
              {selectedQR.title}
            </h3>
            <div className="p-4 bg-white rounded-2xl border border-[#B9985A]/30 shadow-inner">
              {selectedQR.url ? (
                <img
                  src={selectedQR.url}
                  alt="QR Code"
                  className="w-56 h-56 mx-auto object-contain"
                />
              ) : null}
            </div>
            <button
              onClick={() => setSelectedQR(null)}
              className="w-full py-2.5 rounded-full bg-[#722238] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
