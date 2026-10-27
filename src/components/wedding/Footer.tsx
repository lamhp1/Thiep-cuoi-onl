import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
}

export function Footer({ groomName, brideName, weddingDate }: FooterProps) {
  return (
    <footer id="footer" className="py-16 px-4 text-center border-t border-[#D4AF37]/20 bg-gradient-to-b from-transparent to-[#F6F2E9]">
      <div className="max-w-md mx-auto">
        <p className="font-script text-4xl sm:text-5xl text-[#D4AF37] mb-2">
          Thank You!
        </p>

        <p className="font-serif-title text-xl text-[#2C2A29] font-medium tracking-wider">
          {groomName} & {brideName}
        </p>

        <div className="flex items-center justify-center gap-2 text-[#D4AF37] my-3">
          <span className="h-px w-8 bg-[#D4AF37]/40" />
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span className="h-px w-8 bg-[#D4AF37]/40" />
        </div>

        <p className="text-xs font-body text-neutral-500 mb-6 tracking-wide">
          Chân thành cảm ơn sự hiện diện và những lời chúc phúc ấm áp của quý khách trong ngày trọng đại nhất của chúng mình!
        </p>

        <p className="text-[11px] font-body text-neutral-400">
          © 2026 {groomName} & {brideName} • Created with L'Amour Luxury Wedding
        </p>
      </div>
    </footer>
  );
}
