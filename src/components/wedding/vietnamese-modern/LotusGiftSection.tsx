import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, QrCode, Heart, Sparkles, ExternalLink, Download, ZoomIn } from 'lucide-react';
import { BankAccount } from '../../../types';
import { copyToClipboard } from '../../../lib/utils';
import { useToast } from '../../ui/Toast';
import { MinimalistLotus, LotusBranchArt, MiniSongHy } from './VietnameseModernOrnaments';
import { ProgressiveLuxuryImage } from '../../ui/ProgressiveLuxuryImage';
import { openQRZoom } from '../common/QRZoomModal';

interface LotusGiftSectionProps {
  groomBank?: BankAccount;
  brideBank?: BankAccount;
  groomName?: string;
  brideName?: string;
}

export function LotusGiftSection({
  groomBank,
  brideBank,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: LotusGiftSectionProps) {
  const { showToast } = useToast();
  const [selectedSide, setSelectedSide] = useState<'groom' | 'bride'>('groom');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fallback default bank accounts if none provided in wedding data
  const defaultGroomBank: BankAccount = {
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrCodeUrl: '',
  };

  const defaultBrideBank: BankAccount = {
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrCodeUrl: '',
  };

  const activeBank = selectedSide === 'groom' ? (groomBank || defaultGroomBank) : (brideBank || defaultBrideBank);
  const activeHolder = selectedSide === 'groom' ? (groomBank?.accountHolder || defaultGroomBank.accountHolder) : (brideBank?.accountHolder || defaultBrideBank.accountHolder);
  const activeNumber = selectedSide === 'groom' ? (groomBank?.accountNumber || defaultGroomBank.accountNumber) : (brideBank?.accountNumber || defaultBrideBank.accountNumber);
  const activeBankName = selectedSide === 'groom' ? (groomBank?.bankName || defaultGroomBank.bankName) : (brideBank?.bankName || defaultBrideBank.bankName);
  const activeQR = activeBank.qrCodeUrl || (selectedSide === 'groom' ? defaultGroomBank.qrCodeUrl : defaultBrideBank.qrCodeUrl);

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    setCopiedField(label);
    showToast(`Đã sao chép ${label}!`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="gift-box" className="py-20 sm:py-28 bg-[#F8F4EC] relative overflow-hidden">
      {/* Background Soft Ornament */}
      <div className="absolute top-1/2 -left-20 -translate-y-1/2 pointer-events-none opacity-10">
        <MinimalistLotus className="w-96 h-96 text-[#63121D]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Heading with Scroll Animation */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-14 space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#63121D]/10 text-[#63121D] text-xs font-semibold uppercase tracking-[0.2em]">
            <MiniSongHy className="w-3.5 h-3.5 text-[#63121D]" />
            <span>Hộp Mừng Cưới</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#18181A]">
            Gửi Trao Chúc Phúc
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#5A554E] leading-relaxed">
            Sự chúc phúc và tình cảm của quý khách là món quà quý giá nhất trong ngày trọng đại của chúng mình.
          </p>

          {/* Tab Switcher: Chú Rể / Cô Dâu (Solid luxury buttons) */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setSelectedSide('groom')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                selectedSide === 'groom'
                  ? 'bg-[#18181A] text-[#D8BE87] shadow-md scale-105'
                  : 'bg-[#FFFFFF] text-[#5A554E] hover:bg-[#FAF7F2] border border-[#D8BE87]/50 shadow-xs'
              }`}
            >
              Mừng Chú Rể (Nhà Trai)
            </button>

            <button
              onClick={() => setSelectedSide('bride')}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                selectedSide === 'bride'
                  ? 'bg-[#63121D] text-[#F8F4EC] shadow-md scale-105'
                  : 'bg-[#FFFFFF] text-[#5A554E] hover:bg-[#FAF7F2] border border-[#D8BE87]/50 shadow-xs'
              }`}
            >
              Mừng Cô Dâu (Nhà Gái)
            </button>
          </div>
        </motion.div>

        {/* The Core Requirement: QR ĐƯỢC ĐẶT BÊN CẠNH HOA SEN LINE-ART */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={selectedSide}
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border-2 border-[#D8BE87] shadow-2xl relative overflow-hidden"
          >
            {/* Grid layout pairing QR Code with Minimalist Lotus Line-Art */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* QR Code Container (Left/Center col-span-5) */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div
                  onClick={() =>
                    openQRZoom({
                      qrUrl: activeQR,
                      title: `Mừng Cưới ${selectedSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                      bankName: activeBankName,
                      accountNumber: activeNumber,
                      accountHolder: activeHolder,
                      note: activeBank.note,
                    })
                  }
                  className="relative p-4 rounded-2xl bg-[#FAF7F2] border border-[#D8BE87]/50 shadow-inner group cursor-pointer hover:border-[#D8BE87] transition-all hover:scale-[1.02] active:scale-98"
                  title="Chạm để phóng to mã QR"
                  data-qr-zoom="true"
                  data-qr-url={activeQR}
                  data-qr-title={`Mừng Cưới ${selectedSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`}
                  data-qr-bank={activeBankName}
                  data-qr-account={activeNumber}
                  data-qr-holder={activeHolder}
                >
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-neutral-200 shadow-sm relative">
                    <ProgressiveLuxuryImage
                      src={activeQR}
                      alt={`Mã QR ${selectedSide === 'groom' ? groomName : brideName}`}
                      className="w-full h-full object-contain p-2"
                      priority={true}
                    />

                    {/* Hover & tap zoom hint overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 p-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold tracking-wide bg-black/60 px-3 py-1 rounded-full border border-white/20 shadow">
                        Chạm để phóng to mã QR
                      </span>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#63121D] border border-[#D8BE87] flex items-center justify-center text-white shadow-md">
                    <QrCode className="w-3.5 h-3.5 text-[#D8BE87]" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openQRZoom({
                      qrUrl: activeQR,
                      title: `Mừng Cưới ${selectedSide === 'groom' ? 'Chú Rể ' + groomName : 'Cô Dâu ' + brideName}`,
                      bankName: activeBankName,
                      accountNumber: activeNumber,
                      accountHolder: activeHolder,
                      note: activeBank.note,
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs text-[#8C6B38] hover:text-[#63121D] font-medium tracking-wide mt-3 cursor-pointer group"
                >
                  <ZoomIn className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Bấm vào hình để phóng to mã QR</span>
                </button>
              </div>

              {/* Minimalist Lotus Line-Art (Middle Accent col-span-2 hidden md:flex) */}
              <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center text-[#D8BE87]">
                <div className="h-16 w-px bg-gradient-to-b from-transparent to-[#D8BE87]" />
                <LotusBranchArt className="w-28 h-36 text-[#D8BE87] my-2" />
                <div className="h-16 w-px bg-gradient-to-t from-transparent to-[#D8BE87]" />
              </div>

              {/* Bank Details (Right col-span-5) */}
              <div className="md:col-span-5 space-y-4 text-left">
                {/* Mobile visible lotus badge */}
                <div className="md:hidden flex items-center gap-2 text-[#D8BE87] mb-2">
                  <MinimalistLotus className="w-7 h-7" />
                  <span className="text-xs uppercase tracking-widest text-[#63121D] font-bold">
                    Hoa Sen Thanh Khiết
                  </span>
                </div>

                <div className="border-b border-[#D8BE87]/40 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block">
                    Ngân hàng thụ hưởng
                  </span>
                  <p className="font-serif-title text-xl font-bold text-[#18181A]">
                    {activeBankName}
                  </p>
                </div>

                <div className="border-b border-[#D8BE87]/40 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block">
                    Chủ tài khoản
                  </span>
                  <p className="font-serif-title text-lg font-bold text-[#63121D] uppercase">
                    {activeHolder}
                  </p>
                </div>

                <div className="border-b border-[#D8BE87]/40 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block">
                    Số tài khoản
                  </span>
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <span className="font-mono text-lg font-bold text-[#18181A] tracking-wider">
                      {activeNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(activeNumber, 'Số tài khoản')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D8BE87]/20 hover:bg-[#D8BE87]/35 text-[#63121D] text-xs font-semibold transition-colors cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === 'Số tài khoản' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-700" />
                          <span className="text-green-700">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Transfer Note helper */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block mb-1">
                    Cú pháp gửi lời chúc gợi ý
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F8F4EC] border border-[#D8BE87]/40">
                    <span className="font-body text-xs text-[#5A554E] truncate">
                      Mung cuoi {selectedSide === 'groom' ? groomName : brideName}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(`Mung cuoi ${selectedSide === 'groom' ? groomName : brideName}`, 'Cú pháp chuyển khoản')
                      }
                      className="p-1 rounded-md text-[#63121D] hover:bg-white transition-colors cursor-pointer shrink-0"
                      title="Sao chép cú pháp"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
