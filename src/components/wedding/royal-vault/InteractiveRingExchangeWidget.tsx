import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Check, RotateCcw } from 'lucide-react';
import { playVaultUnlockSound, playRingRotateSparkle } from './royalVaultSounds';

interface InteractiveRingExchangeWidgetProps {
  groomName: string;
  brideName: string;
}

export function InteractiveRingExchangeWidget({ groomName, brideName }: InteractiveRingExchangeWidgetProps) {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);

    if (val >= 98 && !isCompleted) {
      setIsCompleted(true);
      playVaultUnlockSound();
      playRingRotateSparkle();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#E8B498', '#FCE4BE', '#FFFFFF', '#DDA789'],
      });
    }
  };

  const handleReset = () => {
    setIsCompleted(false);
    setSliderValue(0);
  };

  const ringDistance = Math.max(0, (100 - sliderValue) * 1.4); // Distance in pixels

  return (
    <div className="relative my-12 p-8 rounded-3xl bg-gradient-to-b from-[#18121D] to-[#110D15] border border-[#E8B498]/40 shadow-[0_0_50px_rgba(232,180,152,0.15)] text-center overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,180,152,0.1)_0,transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8B498]/15 border border-[#E8B498]/40 text-[#E8B498] text-xs font-serif tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nghi Lễ Tương Tác Hoàng Gia</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif text-white mb-2">
          Khoảnh Khắc Trao Nhẫn Thiêng Liêng
        </h3>
        <p className="text-xs text-white/70 max-w-md mx-auto mb-8 font-light">
          Kéo thanh trượt để cùng cô dâu & chú rể lồng chiếc nhẫn hôn ước, mở khóa lời hẹn ước trăm năm.
        </p>

        {/* The Dual Rings Interactive Stage */}
        <div className="relative h-44 flex items-center justify-center mb-6">
          {/* Groom's Ring */}
          <div
            className="transition-transform duration-100 ease-out flex flex-col items-center"
            style={{ transform: `translateX(-${ringDistance}px)` }}
          >
            <div className="relative w-20 h-20 rounded-full border-[7px] border-[#E8B498] shadow-[0_0_25px_rgba(232,180,152,0.7)] flex items-center justify-center bg-transparent group">
              <div className="w-14 h-14 rounded-full border border-white/30" />
            </div>
            <span className="text-[11px] font-serif uppercase tracking-wider text-[#E8B498] mt-2 block">
              {groomName}
            </span>
          </div>

          {/* Central Connecting Energy Trail */}
          <div
            className="h-1 bg-gradient-to-r from-[#E8B498] via-white to-[#E8B498] transition-all duration-100 shadow-[0_0_15px_#E8B498]"
            style={{
              width: `${Math.max(10, ringDistance * 2)}px`,
              opacity: isCompleted ? 0 : sliderValue / 100,
            }}
          />

          {/* Bride's Solitaire Diamond Ring */}
          <div
            className="transition-transform duration-100 ease-out flex flex-col items-center"
            style={{ transform: `translateX(${ringDistance}px)` }}
          >
            <div className="relative w-20 h-20 rounded-full border-[6px] border-[#E8B498] shadow-[0_0_25px_rgba(232,180,152,0.7)] flex items-center justify-center bg-transparent">
              {/* Solitaire Diamond on top */}
              <div className="absolute -top-3 w-5 h-5 bg-gradient-to-br from-white via-[#E8B498] to-[#FFE8A3] rotate-45 shadow-[0_0_20px_#FFFFFF] border border-white" />
              <div className="w-14 h-14 rounded-full border border-white/30" />
            </div>
            <span className="text-[11px] font-serif uppercase tracking-wider text-[#E8B498] mt-2 block">
              {brideName}
            </span>
          </div>

          {/* Center Union Flash */}
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0,rgba(232,180,152,0.5)_40%,transparent_70%)] animate-pulse" />
              <Heart className="w-8 h-8 text-[#E8B498] fill-[#E8B498] absolute animate-bounce" />
            </motion.div>
          )}
        </div>

        {/* Interaction Controls */}
        {!isCompleted ? (
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full max-w-sm mx-auto h-2.5 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#E8B498] border border-[#E8B498]/40"
            />
            <p className="text-[11px] text-[#E8B498]/80 tracking-wider">
              ✦ Kéo sang phải để lồng nhẫn ({sliderValue}%) ✦
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-black/60 border border-[#E8B498]/50 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
              <Check className="w-4 h-4" />
              <span>Cặp Nhẫn Đã Hòa Làm Một</span>
            </div>
            <p className="text-sm font-serif italic text-white/90 leading-relaxed">
              "Kể từ giây phút này, hai tâm hồn hòa chung một nhịp đập, hai cuộc đời gắn kết trọn đời bên nhau."
            </p>
            <p className="text-xs text-[#E8B498] font-serif tracking-widest">
              {groomName.toUpperCase()} & {brideName.toUpperCase()} • NGUYỆN ƯỚC TRĂM NĂM
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] text-white/60 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all mt-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Thực hiện lại</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
