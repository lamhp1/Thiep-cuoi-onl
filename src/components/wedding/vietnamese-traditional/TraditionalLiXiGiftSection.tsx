import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingGiftInfo, BankAccount } from '../../../types';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  DongSonDrumPattern,
  TraditionalDivider,
  PaperFrameCorner,
} from './TraditionalOrnaments';
import { Copy, Check, QrCode, Heart, Sparkles, ExternalLink, Download, ZoomIn } from 'lucide-react';
import { copyToClipboard } from '../../../lib/utils';
import { useToast } from '../../ui/Toast';
import { openQRZoom } from '../common/QRZoomModal';

interface TraditionalLiXiGiftSectionProps {
  gift?: WeddingGiftInfo;
  groomName?: string;
  brideName?: string;
}

export function TraditionalLiXiGiftSection({
  gift,
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
}: TraditionalLiXiGiftSectionProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'groom' | 'bride'>('groom');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const defaultGroomBank: BankAccount = {
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrCodeUrl: '',
    note: '',
  };

  const defaultBrideBank: BankAccount = {
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrCodeUrl: '',
    note: '',
  };

  const groomAccount = gift?.groomBank || defaultGroomBank;
  const brideAccount = gift?.brideBank || defaultBrideBank;

  const currentAccount = activeTab === 'groom' ? groomAccount : brideAccount;
  const currentTitle = activeTab === 'groom' ? 'Nhà Trai • Chú Rể' : 'Nhà Gái • Cô Dâu';

  const targetHolder = currentAccount.accountHolder || (activeTab === 'groom' ? groomName : brideName);
  const targetAccount = currentAccount.accountNumber || '0987654321';
  const qrImageUrl =
    currentAccount.qrCodeUrl?.trim() ||
    `https://api.vietqr.io/image/970436-${targetAccount}-compact2.jpg?accountName=${encodeURIComponent(targetHolder)}`;

  const handleCopy = async (text: string, label: string, key: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      showToast(`Đã sao chép ${label}!`, 'success');
      setTimeout(() => {
        setCopiedKey(null);
      }, 2500);
    }
  };

  return (
    <section id="gift" className="relative py-20 sm:py-24 bg-[#FAF6EE] text-[#3D1A1E] overflow-hidden">
      {/* Background Dong Son Watermarks */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <DongSonDrumPattern className="w-[800px] h-[800px] text-[#BA1E28]" opacity={1} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BA1E28]/10 border border-[#BA1E28]/25 text-[#BA1E28] text-xs font-semibold uppercase tracking-widest">
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28]" />
            <span>Hỷ Kim • Mừng Cưới</span>
            <AuspiciousCloud className="w-5 h-3 text-[#BA1E28] scale-x-[-1]" />
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B1119] tracking-wide">
            Hộp Mừng Cưới Hỷ Sự
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#735154] max-w-lg mx-auto leading-relaxed">
            {gift?.message ||
              'Sự hiện diện và lời chúc phúc của quý khách là món quà trân quý nhất đối với chúng mình. Nếu muốn gửi chút tình cảm từ phương xa, quý khách có thể gửi qua phong bao lì xì điện tử dưới đây.'}
          </p>

          <TraditionalDivider className="mt-4 mb-8" />

          {/* Toggle Lì Xì Nhà Trai / Nhà Gái */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-[#D4AF37]/50 shadow-sm gap-1">
            <button
              onClick={() => setActiveTab('groom')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-serif-title font-bold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'groom'
                  ? 'bg-gradient-to-r from-[#BA1E28] to-[#8B1119] text-white shadow-md'
                  : 'text-[#735154] hover:text-[#BA1E28]'
              }`}
            >
              <SongHyGlyph className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Lì Xì Chú Rể (Nhà Trai)</span>
            </button>

            <button
              onClick={() => setActiveTab('bride')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-serif-title font-bold tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'bride'
                  ? 'bg-gradient-to-r from-[#BA1E28] to-[#8B1119] text-white shadow-md'
                  : 'text-[#735154] hover:text-[#BA1E28]'
              }`}
            >
              <LotusOrnament className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Lì Xì Cô Dâu (Nhà Gái)</span>
            </button>
          </div>
        </div>

        {/* Điểm nhấn độc bản: "Bao Lì Xì Cách Điệu" (Stylized Red Envelope) */}
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              transition={{ duration: 0.45 }}
              className="relative rounded-3xl bg-gradient-to-b from-[#B81E27] via-[#9E141E] to-[#760C14] text-white p-6 sm:p-8 shadow-[0_25px_50px_-12px_rgba(186,30,40,0.45)] border-2 border-[#D4AF37]/60 overflow-hidden"
            >
              {/* Nắp bao lì xì lượn sóng phía trên với viền vàng kim */}
              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#8F111B] to-transparent pointer-events-none flex justify-center pt-2">
                <div className="w-32 h-6 border-b-2 border-[#D4AF37]/60 rounded-b-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                </div>
              </div>

              {/* Watermark hoa sen & Dong Son chìm trên thân lì xì */}
              <div className="absolute -right-16 -bottom-16 opacity-10 pointer-events-none">
                <DongSonDrumPattern className="w-64 h-64 text-[#FFD700]" opacity={1} />
              </div>

              {/* Header Lì Xì */}
              <div className="relative z-10 text-center space-y-2 pt-4 pb-3">
                <div className="w-14 h-14 rounded-full bg-[#FAF5EA] border-2 border-[#D4AF37] text-[#BA1E28] flex items-center justify-center mx-auto shadow-md">
                  <SongHyGlyph className="w-8 h-8 text-[#BA1E28]" />
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-body uppercase tracking-[0.25em] text-[#FBEED1]/80">
                    Phong Bao Hỷ Kim
                  </span>
                  <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8] tracking-wider">
                    {currentTitle}
                  </h3>
                </div>
              </div>

              {/* Thẻ Ngân Hàng Rút Ra Từ Lì Xì (Thẻ Kem Giấy Dó Sang Trọng) */}
              <div className="relative z-10 bg-[#FFFDF9] text-[#3D1A1E] rounded-2xl p-5 shadow-inner border border-[#D4AF37]/40 space-y-4 my-2">
                <PaperFrameCorner position="top-left" className="top-1.5 left-1.5 w-5 h-5 text-[#D4AF37]" />
                <PaperFrameCorner position="top-right" className="top-1.5 right-1.5 w-5 h-5 text-[#D4AF37]" />
                <PaperFrameCorner position="bottom-left" className="bottom-1.5 left-1.5 w-5 h-5 text-[#D4AF37]" />
                <PaperFrameCorner position="bottom-right" className="bottom-1.5 right-1.5 w-5 h-5 text-[#D4AF37]" />

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <div
                    onClick={() =>
                      openQRZoom({
                        qrUrl: qrImageUrl,
                        title: `Mừng Cưới ${activeTab === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                        bankName: currentAccount.bankName || 'Ngân Hàng',
                        accountNumber: currentAccount.accountNumber || targetAccount,
                        accountHolder: currentAccount.accountHolder || targetHolder,
                        note: `Mung cuoi ${activeTab === 'groom' ? groomName : brideName}`,
                      })
                    }
                    className="relative p-3 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-sm max-w-[220px] cursor-pointer group hover:scale-[1.03] transition-all active:scale-95 hover:border-[#BA1E28]"
                    title="Chạm để phóng to mã QR"
                    data-qr-zoom="true"
                    data-qr-url={qrImageUrl}
                    data-qr-title={`Mừng Cưới ${activeTab === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`}
                    data-qr-bank={currentAccount.bankName || 'Ngân Hàng'}
                    data-qr-account={currentAccount.accountNumber || targetAccount}
                    data-qr-holder={currentAccount.accountHolder || targetHolder}
                  >
                    <img
                      src={qrImageUrl}
                      alt={`Mã QR mừng cưới ${targetHolder}`}
                      className="w-44 h-44 object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />

                    {/* Hover zoom overlay */}
                    <div className="absolute inset-0 bg-black/45 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1.5 p-2">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40 shadow">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-bold tracking-wide bg-black/70 px-2.5 py-0.5 rounded-full border border-white/20">
                        Chạm để phóng to
                      </span>
                    </div>

                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#BA1E28] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs whitespace-nowrap">
                      VietQR • Quét Nhanh
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openQRZoom({
                        qrUrl: qrImageUrl,
                        title: `Mừng Cưới ${activeTab === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                        bankName: currentAccount.bankName || 'Ngân Hàng',
                        accountNumber: currentAccount.accountNumber || targetAccount,
                        accountHolder: currentAccount.accountHolder || targetHolder,
                        note: `Mung cuoi ${activeTab === 'groom' ? groomName : brideName}`,
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] text-[#8C6B38] hover:text-[#BA1E28] font-medium mt-3 cursor-pointer group"
                  >
                    <ZoomIn className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    <span>Bấm vào mã QR để phóng to</span>
                  </button>
                </div>

                {/* Bank Details Table */}
                <div className="space-y-2.5 pt-2 font-body text-xs">
                  {/* Ngân hàng */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0E6D2]">
                    <span className="text-[#8C6B38] font-medium">Ngân hàng:</span>
                    <span className="font-bold text-[#8B1119] text-right font-serif-title text-sm">
                      {currentAccount.bankName}
                    </span>
                  </div>

                  {/* Chủ tài khoản */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0E6D2]">
                    <span className="text-[#8C6B38] font-medium">Chủ tài khoản:</span>
                    <span className="font-bold text-[#1A1816] uppercase tracking-wider text-right">
                      {currentAccount.accountHolder}
                    </span>
                  </div>

                  {/* Số tài khoản & nút copy */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F0E6D2]">
                    <span className="text-[#8C6B38] font-medium">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#8B1119] text-sm sm:text-base tracking-wider">
                        {currentAccount.accountNumber}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(currentAccount.accountNumber, 'số tài khoản', 'stk')
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#BA1E28]/10 hover:bg-[#BA1E28] text-[#BA1E28] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Sao chép số tài khoản"
                      >
                        {copiedKey === 'stk' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nội dung chuyển khoản gợi ý */}
                  {currentAccount.note && (
                    <div className="flex items-center justify-between py-1.5 bg-[#FAF5EA] p-2.5 rounded-xl border border-[#E8DFC8]">
                      <div className="text-left truncate pr-2">
                        <span className="text-[10px] text-[#8C6B38] block uppercase tracking-wider font-semibold">
                          Lời nhắn chuyển khoản:
                        </span>
                        <span className="font-medium text-[#5C3D40] text-xs truncate block">
                          {currentAccount.note}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(currentAccount.note || '', 'lời nhắn chuyển khoản', 'note')
                        }
                        className="shrink-0 p-1.5 rounded-lg bg-white border border-[#D4AF37]/50 text-[#8B1119] hover:bg-[#BA1E28] hover:text-white transition-colors cursor-pointer"
                        title="Sao chép lời nhắn"
                      >
                        {copiedKey === 'note' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Footer Greeting */}
              <div className="relative z-10 text-center pt-3">
                <p className="text-[11px] text-[#FBEED1]/80 font-serif-title italic">
                  “Cảm ơn quý khách đã chung vui và gửi trao lời chúc phúc trọn vẹn.”
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
