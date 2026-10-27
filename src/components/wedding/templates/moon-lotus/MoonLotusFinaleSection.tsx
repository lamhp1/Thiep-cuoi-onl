import React, { useState } from 'react';
import { Sparkles, Moon, Heart, Share2, Check, RefreshCw } from 'lucide-react';
import { DetailedMoon, ArtisticBloomingLotus, playMoonlightChime } from './MoonLotusOrnaments';

interface MoonLotusFinaleSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  onReopenEnvelope: () => void;
}

export function MoonLotusFinaleSection({
  groomName,
  brideName,
  weddingDate,
  onReopenEnvelope,
}: MoonLotusFinaleSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      playMoonlightChime();
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <footer className="relative py-24 px-4 sm:px-6 text-center z-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#02040D] to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto space-y-8">
        {/* Soft Moon Emblem */}
        <div className="flex flex-col items-center justify-center">
          <DetailedMoon size={130} interactive={true} />
          <div className="relative -mt-6">
            <ArtisticBloomingLotus size={110} bloomProgress={1} />
          </div>
        </div>

        {/* Thank You Note */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-[#FFFDF7]">
            Chân Thành Cảm Ơn
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-[#F4E4BA]/85 max-w-lg mx-auto leading-relaxed">
            “Cảm ơn quý người thân, bạn bè và quan khách đã dành tình cảm yêu thương, cùng chúng mình sẻ chia khoảnh khắc thiêng liêng nhất của cuộc đời.”
          </p>
        </div>

        {/* Closing Signature */}
        <div className="space-y-1">
          <p className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#EBD494]">
            Forever Under The Same Moon
          </p>
          <p className="text-xl sm:text-2xl font-serif-title font-bold text-[#FFFDF7]">
            {groomName} &amp; {brideName}
          </p>
          <p className="text-xs font-serif text-[#F4E4BA]/75 tracking-widest">
            {weddingDate}
          </p>
        </div>

        {/* Actions: Reopen envelope & Share */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={onReopenEnvelope}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#120E28]/80 hover:bg-[#1C163C] border border-[#EBD494]/40 text-[#F4E4BA] font-serif text-xs uppercase tracking-wider transition-all hover:scale-105"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#EBD494]" />
            <span>Mở Lại Bì Thư</span>
          </button>

          <button
            onClick={handleShare}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#751A29] to-[#A8283D] hover:from-[#8C2033] hover:to-[#B83047] border border-[#EBD494]/60 text-white font-serif text-xs uppercase tracking-wider font-semibold transition-all hover:scale-105 shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Đã Chép Link Thiệp!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#F4E4BA]" />
                <span>Chia Sẻ Thiệp Cưới</span>
              </>
            )}
          </button>
        </div>

        {/* Small Watermark */}
        <div className="pt-8 border-t border-[#EBD494]/15 text-[11px] font-serif text-[#EBD494]/50">
          Mẫu Thiệp Cưới Cao Cấp "Trăng &amp; Hoa" • Under The Same Moon
        </div>
      </div>
    </footer>
  );
}
