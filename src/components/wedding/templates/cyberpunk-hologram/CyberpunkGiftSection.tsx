import React, { useState } from 'react';
import { WeddingGiftInfo } from '../../../../types';
import { playCyberClick, playCyberSuccess } from '../../../../lib/audioSynth';

interface CyberpunkGiftSectionProps {
  gift?: WeddingGiftInfo;
  groomName?: string;
  brideName?: string;
}

export function CyberpunkGiftSection({
  gift,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: CyberpunkGiftSectionProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const defaultGroomBank = {
    bankName: gift?.groomBank?.bankName || 'MB BANK (NGÀN HÀNG QUÂN ĐỘI)',
    accountName: gift?.groomBank?.accountHolder || groomName.toUpperCase(),
    accountNumber: gift?.groomBank?.accountNumber || '999988886666',
    qrUrl: gift?.groomBank?.qrCodeUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
  };

  const defaultBrideBank = {
    bankName: gift?.brideBank?.bankName || 'VIETCOMBANK',
    accountName: gift?.brideBank?.accountHolder || brideName.toUpperCase(),
    accountNumber: gift?.brideBank?.accountNumber || '666688889999',
    qrUrl: gift?.brideBank?.qrCodeUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
  };

  const handleCopy = (text: string, label: string) => {
    playCyberClick();
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    playCyberSuccess();
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <section className="relative py-20 px-6 bg-[#050714] text-slate-100 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30 uppercase bg-cyan-950/30">
            HỘP MỪNG CƯỚI QUANTUM (VIETQR GIFT VAULT)
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-mono uppercase text-white tracking-tight holo-glitch">
            MỪNG CƯỚI CẶP ĐÔI
          </h2>
          <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
            Sự hiện diện và lời chúc phúc của quý khách là món quà trân quý nhất đối với chúng mình!
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 mx-auto rounded-full" />
        </div>

        {/* Bank QR Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Groom Bank */}
          <div className="bg-[#0B1026]/90 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between hover:border-cyan-400 transition-all shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <div className="space-y-4 text-center">
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono text-cyan-300 border border-cyan-500/30 uppercase bg-cyan-950/50">
                MỪNG CƯỚI CHÚ RỂ ({groomName})
              </div>

              {/* QR Image Frame */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-cyan-400/40 shadow-lg">
                <img
                  src={defaultGroomBank.qrUrl}
                  alt="Groom VietQR"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1 font-mono text-xs text-left bg-slate-900/80 p-4 rounded-2xl border border-cyan-500/20">
                <p className="text-slate-400">NGÂN HÀNG: <strong className="text-white">{defaultGroomBank.bankName}</strong></p>
                <p className="text-slate-400">CHỦ TÀI KHOẢN: <strong className="text-cyan-300">{defaultGroomBank.accountName}</strong></p>
                <p className="text-slate-400">SỐ TÀI KHOẢN: <strong className="text-white font-bold">{defaultGroomBank.accountNumber}</strong></p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(defaultGroomBank.accountNumber, 'groom')}
              className="w-full py-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 font-mono text-xs text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center justify-center space-x-2"
            >
              <span>{copiedText === 'groom' ? '✓ ĐÃ SAO CHÉP STK CHÚ RỂ' : '📋 SAO CHÉP STK CHÚ RỂ'}</span>
            </button>
          </div>

          {/* Bride Bank */}
          <div className="bg-[#0B1026]/90 backdrop-blur-xl border border-pink-500/40 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between hover:border-pink-400 transition-all shadow-[0_0_30px_rgba(255,0,122,0.1)]">
            <div className="space-y-4 text-center">
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono text-pink-300 border border-pink-500/30 uppercase bg-pink-950/50">
                MỪNG CƯỚI CÔ DÂU ({brideName})
              </div>

              {/* QR Image Frame */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-pink-400/40 shadow-lg">
                <img
                  src={defaultBrideBank.qrUrl}
                  alt="Bride VietQR"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1 font-mono text-xs text-left bg-slate-900/80 p-4 rounded-2xl border border-pink-500/20">
                <p className="text-slate-400">NGÂN HÀNG: <strong className="text-white">{defaultBrideBank.bankName}</strong></p>
                <p className="text-slate-400">CHỦ TÀI KHOẢN: <strong className="text-pink-300">{defaultBrideBank.accountName}</strong></p>
                <p className="text-slate-400">SỐ TÀI KHOẢN: <strong className="text-white font-bold">{defaultBrideBank.accountNumber}</strong></p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(defaultBrideBank.accountNumber, 'bride')}
              className="w-full py-3 rounded-2xl bg-pink-500/20 border border-pink-400/40 font-mono text-xs text-pink-300 hover:bg-pink-500/30 transition-colors flex items-center justify-center space-x-2"
            >
              <span>{copiedText === 'bride' ? '✓ ĐÃ SAO CHÉP STK CÔ DÂU' : '📋 SAO CHÉP STK CÔ DÂU'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
