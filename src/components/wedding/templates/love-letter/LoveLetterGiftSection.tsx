import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingGiftInfo } from '../../../../types';
import { Gift, Copy, Check, QrCode, X, Heart } from 'lucide-react';
import {
  LoveLetterWashiTape,
  LoveLetterWaxSeal,
  BotanicalSketch,
} from './LoveLetterOrnaments';
import { useToast } from '../../../ui/Toast';

interface LoveLetterGiftSectionProps {
  gift: WeddingGiftInfo;
  groomName: string;
  brideName: string;
}

export function LoveLetterGiftSection({
  gift,
  groomName,
  brideName,
}: LoveLetterGiftSectionProps) {
  const { showToast } = useToast();
  const [selectedQr, setSelectedQr] = useState<{ url: string; title: string } | null>(null);
  const [copiedBank, setCopiedBank] = useState<'groom' | 'bride' | null>(null);

  const handleCopy = (accountNumber: string, bankHolder: string, target: 'groom' | 'bride') => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedBank(target);
    showToast(`Đã sao chép số tài khoản của ${bankHolder}!`, 'success');
    setTimeout(() => {
      setCopiedBank(null);
    }, 3000);
  };

  const groomBank = gift?.groomBank;
  const brideBank = gift?.brideBank;

  return (
    <section id="gift" className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#C8A96B]/35 text-[#7A2638] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 shadow-xs">
          <Gift className="w-3 h-3 text-[#7A2638]" />
          <span>A TOKEN OF LOVE</span>
        </div>
        <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#59483E] tracking-tight">
          Một Chút Yêu Thương
        </h2>
        <p className="font-serif text-sm sm:text-base text-[#59483E]/80 max-w-lg mx-auto mt-2 leading-relaxed">
          {gift?.message ||
            'Sự hiện diện của bạn đã là món quà quý giá nhất đối với chúng mình. Nếu muốn gửi gắm lời chúc mừng phương xa, bạn có thể gửi qua hộp mừng cưới dưới đây.'}
        </p>
      </div>

      {/* Gift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-stretch">
        {/* GROOM BANK SLIP */}
        {groomBank && (
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#C8A96B]/35 shadow-xl flex flex-col justify-between overflow-visible"
            style={{
              boxShadow: '0 15px 35px -10px rgba(89,72,62,0.12)',
            }}
          >
            <LoveLetterWashiTape className="-top-3 left-8" color="beige" angle={-2} />

            <div>
              <div className="flex items-center justify-between border-b border-[#C8A96B]/20 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C8A96B] font-semibold">
                    MỪNG CƯỚI CHÚ RỂ
                  </span>
                  <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-[#59483E] mt-0.5">
                    {groomBank.accountHolder || groomName}
                  </h3>
                </div>
                <LoveLetterWaxSeal text="WITH LOVE" size="sm" />
              </div>

              {/* Bank Details */}
              <div className="space-y-2.5 font-serif text-sm text-[#59483E]">
                <div className="flex justify-between py-1 border-b border-[#C8A96B]/15">
                  <span className="text-[#59483E]/70 text-xs">Ngân hàng:</span>
                  <span className="font-bold text-[#7A2638]">{groomBank.bankName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#C8A96B]/15">
                  <span className="text-[#59483E]/70 text-xs">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#59483E]">
                      {groomBank.accountNumber}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(groomBank.accountNumber, groomBank.accountHolder || groomName, 'groom')
                      }
                      className="p-1.5 rounded-lg bg-[#F7F1E7] hover:bg-[#EADECE] text-[#7A2638] transition-colors cursor-pointer"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản chú rể"
                    >
                      {copiedBank === 'groom' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-[#C8A96B]/15">
                  <span className="text-[#59483E]/70 text-xs">Chủ tài khoản:</span>
                  <span className="font-semibold">{groomBank.accountHolder}</span>
                </div>
              </div>
            </div>

            {/* QR Code trigger */}
            {groomBank.qrCodeUrl && (
              <div className="mt-6 pt-4 border-t border-[#C8A96B]/20">
                <button
                  onClick={() =>
                    setSelectedQr({
                      url: groomBank.qrCodeUrl,
                      title: `Mừng cưới Chú rể: ${groomBank.accountHolder || groomName}`,
                    })
                  }
                  className="w-full py-2.5 rounded-2xl bg-[#F7F1E7] hover:bg-[#EADECE] text-[#7A2638] font-serif font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#C8A96B]/30"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Xem Mã VietQR Quét Nhanh</span>
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* BRIDE BANK SLIP */}
        {brideBank && (
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#C8A96B]/35 shadow-xl flex flex-col justify-between overflow-visible"
            style={{
              boxShadow: '0 15px 35px -10px rgba(89,72,62,0.12)',
            }}
          >
            <LoveLetterWashiTape className="-top-3 right-8" color="dusty-rose" angle={2} />

            <div>
              <div className="flex items-center justify-between border-b border-[#C8A96B]/20 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C8A96B] font-semibold">
                    MỪNG CƯỚI CÔ DÂU
                  </span>
                  <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-[#59483E] mt-0.5">
                    {brideBank.accountHolder || brideName}
                  </h3>
                </div>
                <LoveLetterWaxSeal text="LOVE FOREVER" size="sm" />
              </div>

              {/* Bank Details */}
              <div className="space-y-2.5 font-serif text-sm text-[#59483E]">
                <div className="flex justify-between py-1 border-b border-[#C8A96B]/15">
                  <span className="text-[#59483E]/70 text-xs">Ngân hàng:</span>
                  <span className="font-bold text-[#7A2638]">{brideBank.bankName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#C8A96B]/15">
                  <span className="text-[#59483E]/70 text-xs">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-[#59483E]">
                      {brideBank.accountNumber}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(brideBank.accountNumber, brideBank.accountHolder || brideName, 'bride')
                      }
                      className="p-1.5 rounded-lg bg-[#F7F1E7] hover:bg-[#EADECE] text-[#7A2638] transition-colors cursor-pointer"
                      title="Sao chép số tài khoản"
                      aria-label="Sao chép số tài khoản cô dâu"
                    >
                      {copiedBank === 'bride' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-[#C8A96B]/15">
                  <span className="text-[#59483E]/70 text-xs">Chủ tài khoản:</span>
                  <span className="font-semibold">{brideBank.accountHolder}</span>
                </div>
              </div>
            </div>

            {/* QR Code trigger */}
            {brideBank.qrCodeUrl && (
              <div className="mt-6 pt-4 border-t border-[#C8A96B]/20">
                <button
                  onClick={() =>
                    setSelectedQr({
                      url: brideBank.qrCodeUrl,
                      title: `Mừng cưới Cô dâu: ${brideBank.accountHolder || brideName}`,
                    })
                  }
                  className="w-full py-2.5 rounded-2xl bg-[#F7F1E7] hover:bg-[#EADECE] text-[#7A2638] font-serif font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#C8A96B]/30"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Xem Mã VietQR Quét Nhanh</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* QR Modal Popup */}
      <AnimatePresence>
        {selectedQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#C8A96B]/40 shadow-2xl text-center"
            >
              <button
                onClick={() => setSelectedQr(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F7F1E7] text-[#59483E] transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-serif-title font-bold text-lg text-[#59483E] mb-1">
                {selectedQr.title}
              </h4>
              <p className="font-handwriting text-sm text-[#7A2638] mb-4">
                Quét mã để gửi lời chúc phúc
              </p>

              <div className="p-3 bg-white rounded-2xl border border-[#C8A96B]/30 shadow-inner inline-block mx-auto">
                <img
                  src={selectedQr.url}
                  alt="Mã QR mừng cưới"
                  className="w-56 h-56 object-contain rounded-lg"
                />
              </div>

              <p className="text-[11px] text-[#59483E]/70 mt-4">
                Hệ thống hỗ trợ mọi ứng dụng ngân hàng và ví điện tử tại Việt Nam.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
