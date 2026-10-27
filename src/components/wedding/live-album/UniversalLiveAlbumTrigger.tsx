import React from 'react';
import { Camera, Sparkles, Film, Heart } from 'lucide-react';
import { WeddingData } from '../../../types';
import { ensureLiveAlbumConfig, getLiveAlbumQuota } from '../../../services/liveAlbumService';

interface UniversalLiveAlbumTriggerProps {
  wedding: WeddingData;
  onOpen: () => void;
}

export function UniversalLiveAlbumTrigger({ wedding, onOpen }: UniversalLiveAlbumTriggerProps) {
  const liveAlbum = ensureLiveAlbumConfig(wedding);
  const quota = getLiveAlbumQuota(wedding);
  const photoCount = liveAlbum.photos.length;
  const template = (wedding.template || 'classic-luxury').toLowerCase();

  // Determine button style according to template aesthetic & tier
  const getTriggerStyle = () => {
    // 1. Futuristic Cybernetic
    if (template.includes('futuristic')) {
      return {
        container: 'bg-[#090D21]/95 text-[#00F0FF] border-2 border-[#00F0FF]/60 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)]',
        badge: 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40',
        iconColor: 'text-[#00F0FF]',
        label: 'QUANTUM LIVE ALBUM',
        sublabel: photoCount > 0 ? `${photoCount} KHOẢNH KHẮC` : 'LIVE RECAP',
        isPill: false,
      };
    }

    // 2. Cinematic Love Story VIP
    if (template.includes('cinematic-love-story') || template.includes('haute-couture')) {
      return {
        container: 'bg-[#121212]/95 text-[#F5E6C8] border border-[#E6C687]/60 shadow-[0_10px_25px_rgba(0,0,0,0.8)] hover:border-[#E6C687]',
        badge: 'bg-[#E6C687]/20 text-[#E6C687] border border-[#E6C687]/40',
        iconColor: 'text-[#E6C687]',
        label: 'CINEMA LIVE ALBUM',
        sublabel: photoCount > 0 ? `${photoCount} Thước Phim` : 'Trực Tiếp',
        isPill: true,
      };
    }

    // 3. Cinematic Vietnamese / Traditional Vietnamese / Vietnamese Luxury
    if (
      template.includes('traditional') ||
      template.includes('cinematic-vietnamese') ||
      template.includes('vietnamese-luxury')
    ) {
      return {
        container: 'bg-[#8A141E]/95 text-[#FDF8EE] border border-[#D4AF37]/70 shadow-[0_8px_25px_rgba(138,20,30,0.5)] hover:bg-[#9B1723]',
        badge: 'bg-[#D4AF37] text-[#5A0C13] font-bold',
        iconColor: 'text-[#D4AF37]',
        label: 'ALBUM NGÀY CƯỚI',
        sublabel: photoCount > 0 ? `${photoCount} Ảnh Hỷ Sự` : 'Trực Tiếp',
        isPill: true,
      };
    }

    // 4. Vietnamese Modern Luxury (Flagship)
    if (template.includes('vietnamese-modern-luxury')) {
      return {
        container: 'bg-[#4A0D15]/95 text-[#FBF6EC] border border-[#D8BE87]/70 shadow-2xl hover:border-[#E6CFA0]',
        badge: 'bg-[#D8BE87] text-[#33080E] font-bold',
        iconColor: 'text-[#D8BE87]',
        label: 'KHOẢNH KHẮC NGÀY CƯỚI',
        sublabel: photoCount > 0 ? `${photoCount} Khoảnh Khắc` : 'Live Flagship',
        isPill: true,
      };
    }

    // 5. Lantern Night (Dạ Tiệc Đèn Lồng)
    if (template.includes('lantern')) {
      return {
        container: 'bg-[#090E20]/95 text-[#FDE68A] border border-[#F59E0B]/70 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]',
        badge: 'bg-[#F59E0B] text-neutral-900 font-bold',
        iconColor: 'text-[#F59E0B]',
        label: 'ALBUM TIỆC ĐÊM',
        sublabel: photoCount > 0 ? `${photoCount} Ảnh Đèn Lồng` : 'Đang Cập Nhật',
        isPill: true,
      };
    }

    // 6. Moon & Lotus (Trăng & Hoa)
    if (template.includes('moon')) {
      return {
        container: 'bg-gradient-to-r from-[#2A0813] to-[#0A1026] text-[#FDFBF7] border border-[#EBD494]/70 shadow-[0_0_20px_rgba(235,212,148,0.35)]',
        badge: 'bg-[#EBD494] text-[#1E050D] font-bold',
        iconColor: 'text-[#EBD494]',
        label: 'ALBUM DẠ NGUYỆT',
        sublabel: photoCount > 0 ? `${photoCount} Khoảnh Khắc` : 'Trăng & Hoa',
        isPill: true,
      };
    }

    // 7. Love Game (Gen Z Minigame)
    if (template.includes('game')) {
      return {
        container: 'bg-[#130E29]/95 text-[#FF6B8B] border-2 border-[#FF6B8B] shadow-[0_0_20px_rgba(255,107,139,0.5)] hover:scale-105',
        badge: 'bg-[#FF6B8B] text-white font-extrabold',
        iconColor: 'text-[#FFD166]',
        label: 'LIVE RECAP [XP +50]',
        sublabel: photoCount > 0 ? `${photoCount} QUẢNG TRƯỜNG ẢNH` : 'CHƠI & XEM',
        isPill: false,
      };
    }

    // 8. Polaroid Scrapbook
    if (template.includes('polaroid')) {
      return {
        container: 'bg-[#FFFDF9] text-[#423832] border-2 border-[#E8DFCE] shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:rotate-1 rotate-[-1deg]',
        badge: 'bg-[#D9735A] text-white font-bold',
        iconColor: 'text-[#D9735A]',
        label: 'SCRAPBOOK NGÀY CƯỚI',
        sublabel: photoCount > 0 ? `${photoCount} Tấm Polaroid` : 'Dán Ảnh Live',
        isPill: false,
      };
    }

    // 9. Passport Love (Hộ Chiếu)
    if (template.includes('passport')) {
      return {
        container: 'bg-[#1C2541]/95 text-[#F5EEDF] border border-[#B99552]/70 shadow-xl',
        badge: 'bg-[#B99552] text-[#0B132B] font-bold',
        iconColor: 'text-[#B99552]',
        label: 'LIVE BOARDING ALBUM',
        sublabel: photoCount > 0 ? `${photoCount} Stamp Kỷ Niệm` : 'Love Airlines',
        isPill: true,
      };
    }

    // 10. Love Letter / Love Map
    if (template.includes('love-letter') || template.includes('love-map')) {
      return {
        container: 'bg-[#FAF5EB] text-[#59483E] border border-[#C8A96B]/60 shadow-xl',
        badge: 'bg-[#7A2638] text-white font-serif font-bold',
        iconColor: 'text-[#7A2638]',
        label: 'ALBUM KỶ NIỆM NGÀY CƯỚI',
        sublabel: photoCount > 0 ? `${photoCount} Bức Ảnh` : 'Bức Thư Tình',
        isPill: true,
      };
    }

    // 11. Floral Romance / Pink
    if (template.includes('floral')) {
      return {
        container: 'bg-white/95 text-[#3E2E31] border border-[#D97D8A]/50 shadow-xl hover:border-[#D97D8A]',
        badge: 'bg-[#D97D8A] text-white font-bold',
        iconColor: 'text-[#D97D8A]',
        label: 'ALBUM HOA CƯỚI',
        sublabel: photoCount > 0 ? `${photoCount} Bức Ảnh` : 'Khoảnh Khắc',
        isPill: true,
      };
    }

    // Default Classic Luxury / Minimal
    return {
      container: 'bg-[#1A1816]/95 text-[#FAF6EE] border border-[#D4AF37]/50 shadow-2xl hover:border-[#D4AF37]',
      badge: 'bg-[#D4AF37] text-neutral-900 font-bold',
      iconColor: 'text-[#D4AF37]',
      label: 'ALBUM NGÀY CƯỚI',
      sublabel: photoCount > 0 ? `${photoCount} Ảnh Trực Tiếp` : 'Khoảnh Khắc',
      isPill: true,
    };
  };

  const style = getTriggerStyle();

  return (
    <div
      id="universal-live-album-widget"
      className="fixed bottom-5 right-4 sm:right-6 z-40 transition-all duration-300 animate-fadeIn"
    >
      <button
        id="trigger-live-album-btn"
        type="button"
        onClick={onOpen}
        aria-label="Xem Album Ảnh Ngày Cưới"
        className={`group relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 backdrop-blur-md transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
          style.isPill ? 'rounded-full' : 'rounded-2xl'
        } ${style.container}`}
      >
        {/* Pulsing Live Dot Animation */}
        <span className="relative flex h-3.5 w-3.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
        </span>

        {/* Camera / Film Icon */}
        <div className="relative">
          <Camera className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${style.iconColor}`} />
          <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
        </div>

        {/* Text information */}
        <div className="text-left font-body leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase font-serif-title">
              {style.label}
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] uppercase tracking-wider font-extrabold bg-red-600 text-white animate-pulse">
              LIVE
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] opacity-85 font-medium">
            {style.sublabel}
          </p>
        </div>

        {/* Photo Count Tag */}
        {photoCount > 0 && (
          <span
            className={`ml-1 px-2.5 py-1 rounded-full text-[11px] shrink-0 shadow-xs ${style.badge}`}
          >
            {photoCount} ảnh
          </span>
        )}
      </button>
    </div>
  );
}
