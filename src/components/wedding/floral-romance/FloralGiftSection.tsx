import React, { useState } from 'react';
import { motion } from 'motion/react';
import { WeddingGiftInfo } from '../../../types';
import { FloralDivider } from './FloralOrnaments';
import { useToast } from '../../ui/Toast';
import { Gift, Copy, Check, QrCode, ZoomIn } from 'lucide-react';
import { openQRZoom } from '../common/QRZoomModal';

interface FloralGiftSectionProps {
  gift: WeddingGiftInfo;
}

export function FloralGiftSection({ gift }: FloralGiftSectionProps) {
  const { showToast } = useToast();
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  if (!gift || (!gift.groomBank && !gift.brideBank)) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(label);
    showToast(`Đã sao chép số tài khoản: ${text}`, 'success');
    setTimeout(() => setCopiedBank(null), 2500);
  };

  return (
    <section id="gift" className="relative py-20 sm:py-28 bg-[#FDF8F5] overflow-hidden">
      {/* Background Soft Pastel Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-r from-[#FDECEF]/60 via-[#F8E7EA]/50 to-[#F6EDE0]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A86A] font-semibold font-body">
            WEDDING GIFT & BLESSING
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#3E2E31] font-normal italic">
            Hộp Mừng Cưới
          </h2>
          <FloralDivider className="w-48 mx-auto my-3" />
          <p className="text-sm font-body text-[#7A696B] max-w-md mx-auto leading-relaxed">
            {gift.message ||
              'Sự hiện diện của quý khách là món quà quý giá nhất. Nếu muốn gửi tặng món quà mừng từ phương xa, xin gửi qua thông tin dưới đây.'}
          </p>
        </motion.div>

        {/* Bank Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Groom Bank */}
          {gift.groomBank && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#F2DCDD] shadow-sm hover:shadow-xl transition-all text-center space-y-4"
            >
              <span className="px-3 py-1 rounded-full bg-[#FCECEF] text-[#D97D8A] text-xs font-semibold uppercase tracking-wider font-body">
                Mừng Cưới Chú Rể
              </span>

              {Boolean(gift.groomBank.qrCodeUrl) && (
                <div className="flex flex-col items-center">
                  <div
                    onClick={() =>
                      openQRZoom({
                        qrUrl: gift.groomBank!.qrCodeUrl!,
                        title: `Mừng Cưới Chú Rể - ${gift.groomBank!.accountHolder}`,
                        bankName: gift.groomBank!.bankName,
                        accountNumber: gift.groomBank!.accountNumber,
                        accountHolder: gift.groomBank!.accountHolder,
                        note: `Mung cuoi ${gift.groomBank!.accountHolder}`,
                      })
                    }
                    className="w-44 h-44 mx-auto p-2 rounded-2xl bg-white border border-[#F2DCDD] shadow-inner cursor-pointer group hover:scale-105 transition-all active:scale-95 relative"
                    title="Chạm để phóng to mã QR"
                    data-qr-zoom="true"
                    data-qr-url={gift.groomBank.qrCodeUrl}
                    data-qr-title={`Mừng Cưới Chú Rể - ${gift.groomBank.accountHolder}`}
                    data-qr-bank={gift.groomBank.bankName}
                    data-qr-account={gift.groomBank.accountNumber}
                    data-qr-holder={gift.groomBank.accountHolder}
                  >
                    <img
                      src={gift.groomBank.qrCodeUrl}
                      alt="Mã QR Chú Rể"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
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
                        qrUrl: gift.groomBank!.qrCodeUrl!,
                        title: `Mừng Cưới Chú Rể - ${gift.groomBank!.accountHolder}`,
                        bankName: gift.groomBank!.bankName,
                        accountNumber: gift.groomBank!.accountNumber,
                        accountHolder: gift.groomBank!.accountHolder,
                        note: `Mung cuoi ${gift.groomBank!.accountHolder}`,
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] text-[#D97D8A] hover:text-[#5A4549] mt-2 cursor-pointer font-body"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>Bấm phóng to mã QR</span>
                  </button>
                </div>
              )}

              <div className="space-y-1 font-body text-xs sm:text-sm text-[#5A4549]">
                <p className="font-semibold text-base text-[#3E2E31]">
                  {gift.groomBank.bankName}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-bold text-[#D97D8A]">
                    {gift.groomBank.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(gift.groomBank!.accountNumber, 'groom')}
                    className="p-1 rounded-lg hover:bg-[#FCECEF] text-[#C9A86A] transition-colors cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    {copiedBank === 'groom' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="uppercase text-xs font-medium text-[#8C767A]">
                  {gift.groomBank.accountHolder}
                </p>
              </div>
            </motion.div>
          )}

          {/* Bride Bank */}
          {gift.brideBank && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative bg-white/95 rounded-3xl p-6 sm:p-8 border border-[#F2DCDD] shadow-sm hover:shadow-xl transition-all text-center space-y-4"
            >
              <span className="px-3 py-1 rounded-full bg-[#FCECEF] text-[#D97D8A] text-xs font-semibold uppercase tracking-wider font-body">
                Mừng Cưới Cô Dâu
              </span>

              {Boolean(gift.brideBank.qrCodeUrl) && (
                <div className="flex flex-col items-center">
                  <div
                    onClick={() =>
                      openQRZoom({
                        qrUrl: gift.brideBank!.qrCodeUrl!,
                        title: `Mừng Cưới Cô Dâu - ${gift.brideBank!.accountHolder}`,
                        bankName: gift.brideBank!.bankName,
                        accountNumber: gift.brideBank!.accountNumber,
                        accountHolder: gift.brideBank!.accountHolder,
                        note: `Mung cuoi ${gift.brideBank!.accountHolder}`,
                      })
                    }
                    className="w-44 h-44 mx-auto p-2 rounded-2xl bg-white border border-[#F2DCDD] shadow-inner cursor-pointer group hover:scale-105 transition-all active:scale-95 relative"
                    title="Chạm để phóng to mã QR"
                    data-qr-zoom="true"
                    data-qr-url={gift.brideBank.qrCodeUrl}
                    data-qr-title={`Mừng Cưới Cô Dâu - ${gift.brideBank.accountHolder}`}
                    data-qr-bank={gift.brideBank.bankName}
                    data-qr-account={gift.brideBank.accountNumber}
                    data-qr-holder={gift.brideBank.accountHolder}
                  >
                    <img
                      src={gift.brideBank.qrCodeUrl}
                      alt="Mã QR Cô Dâu"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
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
                        qrUrl: gift.brideBank!.qrCodeUrl!,
                        title: `Mừng Cưới Cô Dâu - ${gift.brideBank!.accountHolder}`,
                        bankName: gift.brideBank!.bankName,
                        accountNumber: gift.brideBank!.accountNumber,
                        accountHolder: gift.brideBank!.accountHolder,
                        note: `Mung cuoi ${gift.brideBank!.accountHolder}`,
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] text-[#D97D8A] hover:text-[#5A4549] mt-2 cursor-pointer font-body"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>Bấm phóng to mã QR</span>
                  </button>
                </div>
              )}

              <div className="space-y-1 font-body text-xs sm:text-sm text-[#5A4549]">
                <p className="font-semibold text-base text-[#3E2E31]">
                  {gift.brideBank.bankName}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-bold text-[#D97D8A]">
                    {gift.brideBank.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(gift.brideBank!.accountNumber, 'bride')}
                    className="p-1 rounded-lg hover:bg-[#FCECEF] text-[#C9A86A] transition-colors cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    {copiedBank === 'bride' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="uppercase text-xs font-medium text-[#8C767A]">
                  {gift.brideBank.accountHolder}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
