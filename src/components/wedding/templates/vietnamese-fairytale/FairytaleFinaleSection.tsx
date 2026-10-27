import React, { useState } from 'react';
import { ChapterHeaderBadge, FolkCloud, FolkLotus, FolkBird, FolkRedSeal } from './FairytaleOrnaments';
import { Share2, ArrowUp, Sparkles, Heart, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FairytaleFinaleSectionProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  onReopenGate?: () => void;
}

export function FairytaleFinaleSection({
  groomName,
  brideName,
  weddingDate,
  onReopenGate,
}: FairytaleFinaleSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#BA262B', '#E5A93C', '#2D6A4F'],
        });
      } catch {
        // safe fallback
      }
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="finale-wedding" className="relative py-28 px-4 overflow-hidden bg-[#241310] text-[#FAF5EB]">
      {/* Night festive sky backdrop with fireworks and lanterns */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(#E5A93C 1px, transparent 1px), radial-gradient(#BA262B 1.2px, #241310 1.2px)',
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px',
          }}
        />
      </div>

      {/* Decorative Flying Birds in Night Sky */}
      <div className="absolute top-12 left-10 opacity-70 pointer-events-none hidden sm:block">
        <FolkBird className="w-14 h-12 text-[#E5A93C]" />
      </div>
      <div className="absolute top-16 right-10 opacity-70 pointer-events-none hidden sm:block scale-x-[-1]">
        <FolkBird className="w-14 h-12 text-[#E5A93C]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        {/* Chapter Finale Banner */}
        <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/40 text-[#E5A93C] text-xs font-semibold uppercase tracking-[0.25em]">
          <Sparkles className="w-4 h-4 text-[#E5A93C]" />
          <span>Chương Kết • Lễ Cưới Trọn Vẹn</span>
          <Sparkles className="w-4 h-4 text-[#E5A93C]" />
        </div>

        {/* Grand Wedding Title */}
        <div className="space-y-3">
          <h2 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FFFDF9] tracking-tight">
            Cổ Tích Hóa Trăm Năm
          </h2>
          <p className="font-poetry text-base sm:text-lg text-[#D8BE87] italic max-w-xl mx-auto leading-relaxed">
            "Loan phượng hòa minh duyên bất hủ • Sắt cầm hòa hợp nghĩa thiên thu"
          </p>
        </div>

        {/* Thank You Scroll Card */}
        <div className="max-w-2xl mx-auto bg-[#301A16]/90 rounded-2xl p-7 sm:p-10 border-2 border-[#E5A93C]/40 shadow-2xl backdrop-blur-md relative">
          {/* Top red seal stamp */}
          <div className="flex justify-center -mt-16 mb-4">
            <FolkRedSeal text="HỶ" subtitle="VIÊN MÃN" className="w-14 h-14 bg-[#BA262B] text-white border-[#E5A93C] shadow-lg" />
          </div>

          <h3 className="font-serif-title text-2xl font-bold text-[#E5A93C] mb-4">
            Lời Cảm Tạ Tri Ân
          </h3>

          <div className="space-y-3 font-poetry text-xs sm:text-sm text-[#E2D2B8] leading-relaxed italic text-center">
            <p>
              "Xin gửi trọn vẹn lòng biết ơn sâu sắc đến ông bà, cha mẹ - những người đã dày công sinh thành, nuôi dưỡng và chắp cánh cho tình yêu của chúng con."
            </p>
            <p>
              "Chân thành cảm ơn những người thầy, đồng nghiệp, anh chị em và bạn hữu bốn phương đã luôn kề vai sát cánh, chia sẻ niềm vui trong từng trang truyện tình yêu này."
            </p>
            <p className="text-[#E5A93C] font-semibold not-italic pt-2">
              Sự hiện diện của quý vị là niềm vinh dự và chúc phúc lớn lao nhất cho ngày vui của chúng mình!
            </p>
          </div>

          {/* Couple signatures */}
          <div className="mt-8 pt-6 border-t border-[#E5A93C]/30 flex items-center justify-around">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-[#D8BE87] uppercase block">
                TÂN LANG
              </span>
              <span className="font-serif-title text-lg sm:text-xl font-bold text-white">
                {groomName}
              </span>
            </div>
            <Heart className="w-5 h-5 text-[#BA262B] fill-current animate-pulse" />
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-[#D8BE87] uppercase block">
                TÂN NƯƠNG
              </span>
              <span className="font-serif-title text-lg sm:text-xl font-bold text-white">
                {brideName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleShare}
            className="px-6 py-3 rounded-full bg-[#BA262B] hover:bg-[#961F23] border border-[#E5A93C] text-white font-serif text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Đã Sao Chép Link Thiệp!' : 'Chia Sẻ Thiệp Cưới Này'}</span>
          </button>

          {onReopenGate && (
            <button
              onClick={onReopenGate}
              className="px-6 py-3 rounded-full bg-[#3D221D] hover:bg-[#4E2B25] border border-[#E5A93C]/40 text-[#E2D2B8] font-serif text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Về Lại Cổng Làng</span>
            </button>
          )}

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-[#3D221D] hover:bg-[#4E2B25] border border-[#E5A93C]/40 text-[#E5A93C] transition-colors cursor-pointer"
            title="Cuộn lên đầu trang"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Credit */}
        <div className="pt-8 text-[11px] text-[#A68F7A] font-body space-y-1">
          <p>© 2026 {groomName} &amp; {brideName} • Thiệp Cưới Cổ Tích Việt Nam</p>
          <p className="text-[10px] opacity-70">Thiết kế độc quyền trên nền tảng L'Amour Wedding</p>
        </div>
      </div>
    </section>
  );
}
