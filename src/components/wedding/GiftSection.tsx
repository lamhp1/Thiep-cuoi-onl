import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Copy, Check, QrCode, X, Heart, CreditCard, ZoomIn } from 'lucide-react';
import { WeddingGiftInfo, BankAccount } from '../../types';
import { copyToClipboard } from '../../lib/utils';
import { useToast } from '../ui/Toast';
import { openQRZoom } from './common/QRZoomModal';

interface GiftSectionProps {
  gift: WeddingGiftInfo;
  groomName: string;
  brideName: string;
}

export function GiftSection({ gift, groomName, brideName }: GiftSectionProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [expandedQr, setExpandedQr] = useState<BankAccount | null>(null);

  const activeBank = activeTab === 'groom' ? gift.groomBank : gift.brideBank;

  const handleCopy = async (accountNumber: string) => {
    const success = await copyToClipboard(accountNumber);
    if (success) {
      setCopiedAccount(accountNumber);
      showToast(`Đã sao chép số tài khoản: ${accountNumber}`, 'success');
      setTimeout(() => setCopiedAccount(null), 3000);
    } else {
      showToast('Không thể tự động sao chép, vui lòng thử lại', 'error');
    }
  };

  return (
    <section id="gift" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] mb-3">
          <Gift className="w-6 h-6" />
        </div>
        <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] mb-1">
          Hộp Mừng Cưới
        </p>
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-normal text-[#2C2A29] tracking-wide uppercase">
          Wedding Gift
        </h2>
        <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4" />

        <p className="mt-4 max-w-xl mx-auto text-sm font-body text-neutral-600 leading-relaxed">
          {gift.message ||
            'Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất dành cho chúng mình. Nếu quý khách muốn gửi chút tình cảm từ phương xa, có thể chuyển qua số tài khoản dưới đây.'}
        </p>
      </motion.div>

      {/* Groom & Bride Bank Switcher Tabs */}
      <div className="inline-flex p-1.5 rounded-full bg-white/80 border border-[#D4AF37]/30 shadow-sm mb-8">
        {gift.groomBank && (
          <button
            id="tab-groom-bank"
            onClick={() => setActiveTab('groom')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-body font-medium transition-all cursor-pointer ${
              activeTab === 'groom'
                ? 'bg-[#D4AF37] text-white shadow-md'
                : 'text-neutral-600 hover:text-[#D4AF37]'
            }`}
          >
            Mừng cưới Chú Rể ({groomName})
          </button>
        )}
        {gift.brideBank && (
          <button
            id="tab-bride-bank"
            onClick={() => setActiveTab('bride')}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-body font-medium transition-all cursor-pointer ${
              activeTab === 'bride'
                ? 'bg-[#D4AF37] text-white shadow-md'
                : 'text-neutral-600 hover:text-[#D4AF37]'
            }`}
          >
            Mừng cưới Cô Dâu ({brideName})
          </button>
        )}
      </div>

      {/* Bank Account Display Card */}
      {activeBank && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-sm border border-[#D4AF37]/30 shadow-xl text-left"
        >
          {!(activeBank.accountNumber || activeBank.qrCodeUrl || activeBank.bankName) ? (
            <div className="py-8 text-center text-neutral-500 text-xs sm:text-sm font-body italic space-y-2">
              <CreditCard className="w-8 h-8 text-[#D4AF37]/60 mx-auto" />
              <p>Thông tin mừng cưới của {activeTab === 'groom' ? `Chú Rể (${groomName})` : `Cô Dâu (${brideName})`} đang được cập nhật.</p>
              <p className="text-[11px] text-neutral-400">Hai bạn có thể vào Cổng Cặp Đôi (Tab Mừng cưới VietQR) để thêm số tài khoản và mã QR.</p>
            </div>
          ) : (
            <>
              {/* QR Code preview */}
              {Boolean(activeBank.qrCodeUrl) && (
                <div className="relative mb-6 text-center">
                  <div
                    onClick={() => {
                      if (activeBank.qrCodeUrl) {
                        openQRZoom({
                          qrUrl: activeBank.qrCodeUrl,
                          title: `Mừng Cưới ${activeTab === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                          bankName: activeBank.bankName,
                          accountNumber: activeBank.accountNumber,
                          accountHolder: activeBank.accountHolder,
                          note: `Mung cuoi ${activeTab === 'groom' ? groomName : brideName}`,
                        });
                      }
                    }}
                    className="group relative inline-block p-3 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-md cursor-pointer hover:border-[#D4AF37] transition-all"
                    title="Bấm để phóng to mã QR"
                    data-qr-zoom="true"
                    data-qr-url={activeBank.qrCodeUrl}
                    data-qr-title={`Mừng Cưới ${activeTab === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`}
                    data-qr-bank={activeBank.bankName}
                    data-qr-account={activeBank.accountNumber}
                    data-qr-holder={activeBank.accountHolder}
                  >
                    <img
                      src={activeBank.qrCodeUrl}
                      alt={`Mã QR ${activeBank.bankName}`}
                      className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg mx-auto select-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-medium font-body">
                      <ZoomIn className="w-4 h-4" />
                      <span>Phóng to mã QR</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-neutral-400 font-body">
                    Quét mã QR bằng ứng dụng ngân hàng hoặc ví điện tử (Chạm để phóng to)
                  </p>
                </div>
              )}

              {/* Account Details list */}
              <div className="space-y-3.5 text-sm font-body border-t border-neutral-100 pt-5">
                {activeBank.bankName && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Ngân hàng:</span>
                    <span className="font-semibold text-[#2C2A29]">{activeBank.bankName}</span>
                  </div>
                )}

                {activeBank.accountHolder && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Chủ tài khoản:</span>
                    <span className="font-semibold text-[#2C2A29] uppercase">{activeBank.accountHolder}</span>
                  </div>
                )}

                {activeBank.accountNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Số tài khoản:</span>
                    <span className="font-mono font-bold text-base text-[#8C7335] tracking-wider">
                      {activeBank.accountNumber}
                    </span>
                  </div>
                )}

                {activeBank.note && (
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                    <span>Nội dung:</span>
                    <span className="italic">{activeBank.note}</span>
                  </div>
                )}
              </div>

              {/* Copy Account Button */}
              {activeBank.accountNumber && (
                <button
                  id={`copy-account-btn-${activeTab}`}
                  onClick={() => handleCopy(activeBank.accountNumber)}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F26] text-white font-body font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  {copiedAccount === activeBank.accountNumber ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Đã sao chép số tài khoản!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép số tài khoản</span>
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* Large QR Modal */}
      <AnimatePresence>
        {expandedQr && (
          <div
            id="qr-modal"
            onClick={() => setExpandedQr(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm w-full bg-white rounded-3xl p-6 text-center shadow-2xl border border-[#D4AF37]/40"
            >
              <button
                id="close-qr-modal-btn"
                onClick={() => setExpandedQr(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[#D4AF37] mb-2">
                <Heart className="w-4 h-4 fill-current" />
                <span className="font-script text-2xl">Mừng Cưới</span>
              </div>

              <h3 className="font-serif-title text-xl font-semibold text-[#2C2A29]">
                {expandedQr.accountHolder}
              </h3>
              <p className="text-xs text-neutral-500 font-body mb-4">
                {expandedQr.bankName} - {expandedQr.accountNumber}
              </p>

              <div className="p-3 bg-[#FDFBF7] rounded-2xl border border-[#D4AF37]/30 inline-block shadow-inner">
                {expandedQr.qrCodeUrl ? (
                  <img
                    src={expandedQr.qrCodeUrl}
                    alt="QR Code Lớn"
                    className="w-64 h-64 sm:w-72 sm:h-72 object-contain mx-auto rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>

              <button
                onClick={() => handleCopy(expandedQr.accountNumber)}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#D4AF37] text-white font-body text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#B38F26] transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Sao chép STK: {expandedQr.accountNumber}</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
