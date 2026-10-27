import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Zap,
  Sparkles,
  Heart,
  Copy,
  Check,
  QrCode,
  Lock,
  Unlock,
  Radio,
  Cpu,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { WeddingData, BankAccount } from '../../../../types';
import { useToast } from '../../../ui/Toast';
import { openQRZoom } from '../../common/QRZoomModal';

interface FuturisticQuantumVaultProps {
  data: WeddingData;
}

const CYBER_FORTUNES = [
  {
    code: 'QUẺ LƯỢNG TỬ #01 // ALPHA',
    verdict: 'TÌNH DUYÊN ĐỒNG PHA TUYỆT ĐỐI (100% RESONANCE)',
    meaning: 'Hai tâm hồn như hai hạt lượng tử rối vĩnh cửu: dù ở bất kỳ không-thời gian nào cũng luôn cùng hướng về nhau.',
  },
  {
    code: 'QUẺ LƯỢNG TỬ #08 // FORTUNE',
    verdict: 'TÀI LỘC VÔ CỰC (INFINITE ABUNDANCE)',
    meaning: 'Năng lượng thịnh vượng bùng nổ, gia đạo sung túc, mọi dự định tương lai đều hanh thông rực rỡ.',
  },
  {
    code: 'QUẺ LƯỢNG TỬ #26 // STARDUST',
    verdict: 'BÁCH NIÊN KHÔNG ĐỔI (IMMUTABLE ETERNITY)',
    meaning: 'Lời thề hẹn được mã hóa vào vĩnh hằng, bạn bè và quan khách cùng sẻ chia nguồn năng lượng tích cực này.',
  },
  {
    code: 'QUẺ LƯỢNG TỬ #99 // SUPERNOVA',
    verdict: 'HẠNH PHÚC SIÊU TÂN TINH (MAXIMUM JOY)',
    meaning: 'Ánh sáng tình yêu tỏa rạng ngàn năm ánh sáng, đem lại niềm vui bất tận cho mọi người xung quanh.',
  },
];

export function FuturisticQuantumVault({ data }: FuturisticQuantumVaultProps) {
  const { showToast } = useToast();

  // Love Energy Reactor State
  const [energyLevel, setEnergyLevel] = useState(84);
  const [injectedCount, setInjectedCount] = useState(0);
  const [plasmaSparks, setPlasmaSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  // Quantum Vault Lock State
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [activeQrModal, setActiveQrModal] = useState<BankAccount | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Cyber Oracle State
  const [isScanningFortune, setIsScanningFortune] = useState(false);
  const [drawnFortune, setDrawnFortune] = useState<(typeof CYBER_FORTUNES)[0] | null>(null);

  const bankAccounts = [
    ...(data.gift?.groomBank ? [{ ...data.gift.groomBank, ownerRole: 'groom' as const }] : []),
    ...(data.gift?.brideBank ? [{ ...data.gift.brideBank, ownerRole: 'bride' as const }] : []),
  ];

  // Inject Love Energy Handler
  const handleInjectEnergy = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSpark = { id: Date.now(), x, y };
    setPlasmaSparks((prev) => [...prev.slice(-6), newSpark]);

    const nextLevel = Math.min(100, energyLevel + 2);
    if (nextLevel === 100 && energyLevel < 100) {
      // Trigger Supernova Celebration!
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#A855F7', '#FF2E93', '#F5D061'],
      });
      showToast('NĂNG LƯỢNG TÌNH YÊU ĐÃ ĐẠT 100% MAXIMUM POWER!', 'success');
    }
    setEnergyLevel(nextLevel);

    setInjectedCount((prev) => prev + 1);
  };

  // Copy Account Number
  const handleCopyAccount = (accountNumber: string, idx: number) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedIndex(idx);
    showToast('Đã sao chép số tài khoản vào bộ nhớ đệm!', 'success');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  // Draw Cyber Fortune
  const handleDrawFortune = () => {
    setIsScanningFortune(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * CYBER_FORTUNES.length);
      setDrawnFortune(CYBER_FORTUNES[randomIndex]);
      setIsScanningFortune(false);
      showToast('Phân tích quẻ lượng tử hoàn tất!', 'success');
    }, 1200);
  };

  return (
    <section
      id="quantum-vault"
      className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto text-neutral-200 overflow-hidden font-body"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-futuristic tracking-widest shadow-neon-cyan">
          <Cpu className="w-3.5 h-3.5" />
          <span>TRẠM TIẾP NĂNG LƯỢNG & HỘP LƯỢNG TỬ // QUANTUM VAULT</span>
        </div>

        <h2 className="font-futuristic text-3xl sm:text-5xl font-extrabold tracking-wide text-white">
          Năng Lượng & Quà Mừng Lượng Tử
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          [Tiếp năng lượng chúc phúc cho tình yêu & Chạm mở khối lượng tử mừng cưới VietQR]
        </p>
      </div>

      {/* Grid: Left = Love Reactor, Right = Quantum Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
        {/* 1. Lò Phản Ứng Năng Lượng Tình Yêu (Love Reactor) */}
        <div className="lg:col-span-6 bg-[#090E26]/90 border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-neon-cyan flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#00F0FF]">
              <span>CORE: LOVE_REACTOR_MK-IV</span>
              <span className="text-[#F5D061] font-bold">
                CÔNG SUẤT: {energyLevel}%
              </span>
            </div>

            <h3 className="font-futuristic text-xl sm:text-2xl font-bold text-white">
              Lò Phản Ứng Tình Yêu
            </h3>
            <p className="text-xs text-neutral-400 font-body">
              Mỗi lượt chạm bơm năng lượng sẽ truyền xung ánh sáng chúc phúc vào lò phản ứng của cô dâu chú rể.
            </p>
          </div>

          {/* Reactor Visual Core */}
          <div className="relative py-6 flex flex-col items-center justify-center">
            {/* Pulsing Concentric Rings */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-[#00F0FF]/40 shadow-neon-cyan"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-3 rounded-full border border-dashed border-[#FF2E93]/40 shadow-neon-pink"
              />

              {/* Center Reactor Core */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#0D152D] to-[#200A38] border-2 border-[#00F0FF] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.4)]">
                <Heart className="w-10 h-10 text-[#FF2E93] animate-pulse fill-[#FF2E93]" />
                <span className="font-futuristic text-lg font-black text-white mt-1">
                  {energyLevel}%
                </span>
                <span className="text-[9px] font-mono text-neutral-400">TỔNG XUNG: {injectedCount}</span>
              </div>
            </div>

            {/* Glowing Energy Progress Bar */}
            <div className="w-full mt-6 space-y-1.5">
              <div className="w-full h-3 bg-[#050711] rounded-full border border-[#00F0FF]/30 overflow-hidden p-0.5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#FF2E93]"
                  style={{ width: `${energyLevel}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
            </div>
          </div>

          {/* Inject Button */}
          <button
            onClick={handleInjectEnergy}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2E93] via-[#A855F7] to-[#00F0FF] hover:opacity-95 text-white font-futuristic font-bold text-sm tracking-wider shadow-neon-pink flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98 relative overflow-hidden"
          >
            <Zap className="w-4 h-4 text-[#F5D061]" />
            <span>BƠM NĂNG LƯỢNG CHÚC PHÚC (+2%)</span>
          </button>
        </div>

        {/* 2. Khối Lượng Tử Mừng Cưới (Quantum Vault VietQR) */}
        <div className="lg:col-span-6 bg-[#090E26]/90 border border-[#00F0FF]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-neon-cyan flex flex-col justify-between space-y-6 relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#00F0FF]">
              <span>ENCRYPTION: 256-BIT_QUANTUM</span>
              <span className="text-[#F5D061] font-bold">
                {isVaultUnlocked ? 'STATUS: UNLOCKED' : 'STATUS: LOCKED'}
              </span>
            </div>

            <h3 className="font-futuristic text-xl sm:text-2xl font-bold text-white">
              Hộp Lượng Tử Mừng Cưới
            </h3>
            <p className="text-xs text-neutral-400 font-body">
              Dành cho quý khách muốn gửi tình cảm mừng cưới từ xa qua mã chuyển khoản VietQR bảo mật.
            </p>
          </div>

          {/* Locked vs Unlocked Vault View */}
          {!isVaultUnlocked ? (
            <div className="my-auto py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-28 h-28 rounded-2xl bg-[#050711] border-2 border-[#00F0FF]/50 shadow-neon-cyan flex items-center justify-center group cursor-pointer" onClick={() => setIsVaultUnlocked(true)}>
                <Lock className="w-12 h-12 text-[#00F0FF] group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 cyber-scanline-overlay opacity-30" />
              </div>

              <div className="space-y-1">
                <p className="font-futuristic text-sm text-white font-semibold">
                  KHỐI LƯỢNG TỬ ĐANG ĐƯỢC BẢO VỆ
                </p>
                <p className="text-xs text-neutral-400 font-mono">
                  [Chạm vào nút bên dưới để quét laser mở khóa]
                </p>
              </div>

              <button
                onClick={() => setIsVaultUnlocked(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00F0FF]/20 hover:bg-[#00F0FF]/35 text-[#00F0FF] border border-[#00F0FF] font-futuristic text-xs font-bold tracking-wider transition-all cursor-pointer shadow-neon-cyan"
              >
                <Unlock className="w-4 h-4" />
                <span>QUÉT LASER MỞ KHỐI LƯỢNG TỬ</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 font-body animate-fadeIn">
              {bankAccounts.length > 0 ? (
                <div className="space-y-3">
                  {bankAccounts.map((acc, idx) => (
                    <div
                      key={idx}
                      className="bg-[#050711]/90 border border-[#00F0FF]/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-futuristic text-xs font-bold text-[#00F0FF]">
                            {acc.bankName}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            ({acc.ownerRole === 'groom' ? 'Chú Rể' : 'Cô Dâu'})
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white font-mono tracking-wider truncate">
                          {acc.accountNumber}
                        </p>
                        <p className="text-xs text-neutral-300 truncate">{acc.accountHolder}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {Boolean(acc.qrCodeUrl) && (
                          <button
                            onClick={() => {
                              setActiveQrModal(acc);
                              openQRZoom({
                                qrUrl: acc.qrCodeUrl,
                                title: `Mừng Cưới - ${acc.accountHolder}`,
                                bankName: acc.bankName,
                                accountNumber: acc.accountNumber,
                                accountHolder: acc.accountHolder,
                                note: `Mung cuoi ${acc.accountHolder}`,
                              });
                            }}
                            className="p-2 rounded-xl bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 text-[#00F0FF] border border-[#00F0FF]/40 cursor-pointer transition-colors"
                            title="Phóng to mã QR chuyển khoản"
                            data-qr-zoom="true"
                            data-qr-url={acc.qrCodeUrl}
                            data-qr-title={`Mừng Cưới - ${acc.accountHolder}`}
                            data-qr-bank={acc.bankName}
                            data-qr-account={acc.accountNumber}
                            data-qr-holder={acc.accountHolder}
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleCopyAccount(acc.accountNumber, idx)}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Đã copy</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#050711]/90 border border-[#00F0FF]/40 rounded-2xl p-6 text-center space-y-2">
                  <Gift className="w-8 h-8 text-[#00F0FF] mx-auto" />
                  <p className="font-futuristic text-sm text-white font-bold">
                    TẤM LÒNG & LỜI CHÚC LÀ QUÀ TẶNG QUÝ GIÁ NHẤT
                  </p>
                  <p className="text-xs text-neutral-400">
                    Cô dâu và chú rể vô cùng trân trọng sự hiện diện và những lời chúc phúc ấm áp từ quý khách.
                  </p>
                </div>
              )}

              <button
                onClick={() => setIsVaultUnlocked(false)}
                className="text-xs text-neutral-400 hover:text-white font-mono flex items-center gap-1 mx-auto cursor-pointer pt-1"
              >
                <Lock className="w-3 h-3" />
                <span>Khóa lại khối lượng tử</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Trạm AI Gieo Quẻ Tương Lai (Cyber Oracle 2026) */}
      <div className="bg-gradient-to-r from-[#090E26] via-[#140C33] to-[#090E26] border border-[#A855F7]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-neon-purple text-center space-y-6">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/50 text-[#A855F7] text-xs font-futuristic">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>AI CYBER ORACLE 2026 // PHÂN TÍCH QUẺ LƯỢNG TỬ</span>
          </div>
          <h3 className="font-futuristic text-xl sm:text-2xl font-bold text-white">
            Gieo Quẻ Tương Lai Cùng Tân Lang & Tân Nương
          </h3>
          <p className="text-xs text-neutral-400 font-body">
            Nhận thông điệp cát lành và năng lượng may mắn từ trí tuệ lượng tử trong ngày hỷ sự.
          </p>
        </div>

        {drawnFortune ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xl mx-auto bg-[#050711]/95 border-2 border-[#A855F7] rounded-2xl p-6 space-y-3 shadow-neon-purple"
          >
            <span className="text-[10px] font-mono text-[#A855F7] tracking-widest block">
              {drawnFortune.code}
            </span>
            <h4 className="font-futuristic text-base sm:text-lg font-bold text-[#F5D061]">
              {drawnFortune.verdict}
            </h4>
            <p className="text-sm text-neutral-200 font-body leading-relaxed">
              {drawnFortune.meaning}
            </p>
            <div className="pt-2">
              <button
                onClick={handleDrawFortune}
                disabled={isScanningFortune}
                className="text-xs font-futuristic text-[#00F0FF] hover:underline cursor-pointer"
              >
                Gieo lại quẻ khác ➔
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={handleDrawFortune}
            disabled={isScanningFortune}
            className="px-6 py-3 rounded-xl bg-[#A855F7]/30 hover:bg-[#A855F7]/45 text-white font-futuristic text-xs font-bold tracking-wider border border-[#A855F7] shadow-neon-purple cursor-pointer transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#F5D061]" />
            <span>{isScanningFortune ? 'ĐANG QUÉT NĂNG LƯỢNG VŨ TRỤ...' : 'CHẠM ĐỂ GIEO QUẺ LƯỢNG TỬ'}</span>
          </button>
        )}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {activeQrModal && (
          <div
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveQrModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#090E26] border-2 border-[#00F0FF] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-neon-cyan font-body"
            >
              <div className="flex items-center justify-between border-b border-[#00F0FF]/30 pb-3">
                <span className="font-futuristic text-xs font-bold text-[#00F0FF]">
                  MÃ VIETQR MỪNG CƯỚI
                </span>
                <button
                  onClick={() => setActiveQrModal(null)}
                  className="text-neutral-400 hover:text-white cursor-pointer text-xs font-mono"
                >
                  [ĐÓNG]
                </button>
              </div>

              <div className="w-56 h-56 mx-auto rounded-2xl bg-white p-3 shadow-inner">
                {activeQrModal.qrCodeUrl ? (
                  <img
                    src={activeQrModal.qrCodeUrl}
                    alt="VietQR"
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>

              <div className="space-y-1 text-xs font-mono text-neutral-300">
                <p className="font-bold text-white">{activeQrModal.bankName}</p>
                <p className="text-[#00F0FF] font-bold text-sm">{activeQrModal.accountNumber}</p>
                <p>{activeQrModal.accountHolder}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
