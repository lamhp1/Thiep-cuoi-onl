import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Copy, Check, Sparkles, ChevronDown } from 'lucide-react';
import { BankAccount } from '../../../types';
import { playVaultUnlockSound } from './royalVaultSounds';

interface RoyalEnvelopeGiftCardProps {
  bank: BankAccount;
  roleLabel: string;
  onExpandQr: (bank: BankAccount) => void;
  onCopy: (text: string, label: string) => void;
  copiedAccount: string | null;
}

export function RoyalEnvelopeGiftCard({
  bank,
  roleLabel,
  onExpandQr,
  onCopy,
  copiedAccount,
}: RoyalEnvelopeGiftCardProps) {
  const [isOpened, setIsOpened] = useState(true);

  const toggleOpen = () => {
    setIsOpened(!isOpened);
    playVaultUnlockSound();
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18121D] to-[#120D16] border border-[#E8B498]/40 shadow-2xl overflow-hidden group">
      {/* Subtle Corner Filigree Ornaments */}
      <div className="absolute top-3 left-3 text-[#E8B498]/40 text-xs select-none">✦</div>
      <div className="absolute top-3 right-3 text-[#E8B498]/40 text-xs select-none">✦</div>
      <div className="absolute bottom-3 left-3 text-[#E8B498]/40 text-xs select-none">✦</div>
      <div className="absolute bottom-3 right-3 text-[#E8B498]/40 text-xs select-none">✦</div>

      {/* Header Tag */}
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-1 rounded-full bg-[#E8B498]/15 border border-[#E8B498]/40 text-[#E8B498] text-xs font-serif tracking-widest uppercase">
          {roleLabel}
        </span>
      </div>

      {/* QR Code Presentation */}
      <div className="flex flex-col items-center">
        {bank.qrCodeUrl ? (
          <div
            onClick={() => onExpandQr(bank)}
            className="group/qr relative p-3 bg-white rounded-2xl shadow-[0_0_30px_rgba(232,180,152,0.3)] cursor-pointer hover:scale-105 transition-all duration-300 mb-6"
          >
            <img src={bank.qrCodeUrl} alt="VietQR" className="w-44 h-44 object-contain" />
            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-white font-serif bg-black/70 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                Phóng to QR
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 text-center block mt-1">
              Chạm để phóng to mã QR
            </span>
          </div>
        ) : (
          <div className="p-8 bg-white/5 rounded-2xl border border-dashed border-[#E8B498]/40 mb-6 flex flex-col items-center">
            <QrCode className="w-16 h-16 text-[#E8B498] mb-2 animate-pulse" />
            <span className="text-xs text-white/80 font-serif">Mã VietQR Mừng Cưới</span>
          </div>
        )}

        {/* Bank Details Table */}
        <div className="w-full space-y-3 text-left">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs">
            <span className="text-white/60">Ngân hàng:</span>
            <span className="font-semibold text-white">{bank.bankName}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs">
            <span className="text-white/60">Số tài khoản:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#E8B498] text-sm tracking-wider">
                {bank.accountNumber}
              </span>
              <button
                onClick={() => onCopy(bank.accountNumber, 'Số tài khoản')}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-[#E8B498]/30 text-white/80 hover:text-white transition-colors"
                title="Sao chép số tài khoản"
              >
                {copiedAccount === bank.accountNumber ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs">
            <span className="text-white/60">Chủ tài khoản:</span>
            <span className="font-semibold text-white uppercase tracking-wider">
              {bank.accountHolder}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
