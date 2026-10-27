import React from 'react';
import { Compass, Heart } from 'lucide-react';
import { CompassRose } from './LoveMapOrnaments';

interface LoveMapFooterProps {
  groomName: string;
  brideName: string;
  weddingDate?: string;
}

export function LoveMapFooter({
  groomName,
  brideName,
  weddingDate = '20.12.2026',
}: LoveMapFooterProps) {
  return (
    <footer className="relative py-16 px-4 bg-[#EFE6D5] text-[#443B35] overflow-hidden border-t border-[#B9985A]/35 text-center">
      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        {/* Small Compass */}
        <div className="flex justify-center opacity-60">
          <CompassRose className="w-12 h-12" rotate={20} />
        </div>

        {/* Closing Phrase */}
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#722238]">
          THANK YOU FOR BEING PART OF OUR JOURNEY
        </p>

        {/* Couple Names */}
        <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#443B35]">
          {groomName} <span className="font-serif italic text-[#722238] font-normal">&amp;</span> {brideName}
        </h3>

        {/* Minimalist Route Ending: ● ─ ─ ─ ─ ─ ♥ */}
        <div className="w-48 mx-auto my-3 flex items-center justify-center">
          <svg className="w-48 h-6 overflow-visible" viewBox="0 0 160 20" fill="none">
            <circle cx="10" cy="10" r="4" fill="#722238" />
            <line x1="16" y1="10" x2="140" y2="10" stroke="#B9985A" strokeWidth="2" strokeDasharray="5 4" />
            <path
              d="M148 7 C146 4 142 6 144 9 L148 13 L152 9 C154 6 150 4 148 7 Z"
              fill="#722238"
            />
          </svg>
        </div>

        <p className="text-xs text-[#443B35]/60 font-body">
          {weddingDate} • Nguyện ước trăm năm, trọn đời gắn bó
        </p>
      </div>
    </footer>
  );
}
