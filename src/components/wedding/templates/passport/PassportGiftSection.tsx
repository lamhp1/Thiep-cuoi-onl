import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingGiftInfo, BankAccount } from '../../../../types';
import { Gift, Copy, Check, QrCode, X, Heart, Sparkles } from 'lucide-react';

interface PassportGiftSectionProps {
  gift?: WeddingGiftInfo;
  groomName?: string;
  brideName?: string;
}

export function PassportGiftSection({
  gift,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: PassportGiftSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedQr, setSelectedQr] = useState<{ url: string; title: string } | null>(null);

  const fallbackGifts = [
    {
      id: 'groom',
      role: 'groom',
      bankName: gift?.groomBank?.bankName || '',
      accountNumber: gift?.groomBank?.accountNumber || '',
      accountHolder: gift?.groomBank?.accountHolder || '',
      qrCodeUrl: gift?.groomBank?.qrCodeUrl || '',
    },
    {
      id: 'bride',
      role: 'bride',
      bankName: gift?.brideBank?.bankName || '',
      accountNumber: gift?.brideBank?.accountNumber || '',
      accountHolder: gift?.brideBank?.accountHolder || '',
      qrCodeUrl: gift?.brideBank?.qrCodeUrl || '',
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="gift" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#651F2A]/10 border border-[#651F2A]/25 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Gift className="w-3.5 h-3.5 text-[#B99552]" />
            <span>WEDDING REGISTRY &amp; WISHES</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            A LITTLE GIFT
          </h2>

          <p className="font-serif-title italic text-base sm:text-lg text-[#172A3A] max-w-xl mx-auto">
            "Sự hiện diện của quý khách là món quà trân quý nhất đối với chúng mình."
          </p>

          <p className="text-xs font-sans text-neutral-500 max-w-md mx-auto">
            Nếu quý khách muốn gửi gắm quà mừng chúc phúc từ xa, xin vui lòng sử dụng thông tin chuyển khoản dưới đây:
          </p>
        </div>

        {/* Gift Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fallbackGifts.map((acc, idx) => {
            const isGroom = acc.role === 'groom';

            return (
              <motion.div
                key={acc.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-[#FCFAF5] rounded-3xl p-6 sm:p-8 border-2 border-[#B99552]/35 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                {/* Account Tag */}
                <div className="flex items-center justify-between border-b border-[#B99552]/25 pb-3 mb-6">
                  <span className="text-xs font-mono font-bold text-[#651F2A] uppercase tracking-wider">
                    {isGroom ? 'MỪNG CƯỚI CHÚ RỂ' : 'MỪNG CƯỚI CÔ DÂU'}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {isGroom ? 'GROOM’S GIFT' : 'BRIDE’S GIFT'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* QR Code with click to enlarge */}
                  {acc.qrCodeUrl ? (
                    <div
                      className="w-36 h-36 rounded-2xl bg-white p-2 border-2 border-[#B99552]/40 shadow-md shrink-0 cursor-pointer group relative overflow-hidden"
                      onClick={() =>
                        setSelectedQr({
                          url: acc.qrCodeUrl!,
                          title: isGroom ? `Mừng cưới chú rể ${groomName}` : `Mừng cưới cô dâu ${brideName}`,
                        })
                      }
                      title="Bấm để phóng to mã QR"
                    >
                      <img
                        src={acc.qrCodeUrl}
                        alt={`QR ${acc.accountHolder}`}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-mono font-bold">
                        PHÓNG TO
                      </div>
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-200">
                      <QrCode className="w-12 h-12" />
                    </div>
                  )}

                  {/* Account Text Details */}
                  <div className="space-y-2.5 text-xs font-mono w-full text-center sm:text-left">
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">NGÂN HÀNG</span>
                      <span className="font-bold text-[#172A3A] text-sm block">
                        {acc.bankName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">CHỦ TÀI KHOẢN</span>
                      <span className="font-bold text-[#651F2A] uppercase block">
                        {acc.accountHolder}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">SỐ TÀI KHOẢN</span>
                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                        <span className="font-bold text-base text-[#172A3A] tracking-wider">
                          {acc.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(acc.id, acc.accountNumber)}
                          className="p-1.5 rounded-lg bg-[#F5EEDF] hover:bg-[#B99552] text-[#172A3A] hover:text-white transition-colors"
                          title="Sao chép số tài khoản"
                        >
                          {copiedId === acc.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {copiedId === acc.id && (
                  <div className="mt-4 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center font-mono text-[11px] font-bold">
                    ✓ Đã sao chép số tài khoản thành công!
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* QR Zoom Modal */}
      <AnimatePresence>
        {selectedQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedQr(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#FCFAF5] rounded-3xl p-6 max-w-sm w-full border-2 border-[#B99552] text-center space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#B99552]/30 pb-3">
                <span className="font-serif-title font-bold text-[#172A3A] text-sm">
                  {selectedQr.title}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQr(null)}
                  className="p-1 rounded-full hover:bg-neutral-200 text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-2 bg-white rounded-2xl border border-neutral-200 shadow-inner">
                <img
                  src={selectedQr.url}
                  alt="QR Code"
                  className="w-full aspect-square object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-xs font-mono text-neutral-500">
                Quét mã qua ứng dụng ngân hàng bất kỳ để chuyển khoản
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
