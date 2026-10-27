import React, { useState } from 'react';
import { MapPin, Navigation, Car, CalendarPlus, ExternalLink } from 'lucide-react';
import { WeddingEventDetails } from '../../../lib/guestPersonalization';
import { SmartRideModal } from './SmartRideModal';
import { CalendarExportModal } from './CalendarExportModal';

interface SmartEventActionsProps {
  event: WeddingEventDetails & { mapUrl?: string };
  theme?: 'gold' | 'red' | 'dark' | 'clean' | 'pink' | 'cyber' | 'celestial' | 'emerald';
  compact?: boolean;
  className?: string;
}

export function SmartEventActions({
  event,
  theme = 'gold',
  compact = false,
  className = '',
}: SmartEventActionsProps) {
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);

  // Style variations based on template aesthetics
  const styles = {
    gold: {
      mapBtn: 'bg-[#D4AF37] hover:bg-[#B38F26] text-[#1C1A17] font-semibold border border-[#D4AF37]/60 shadow-sm',
      rideBtn: 'bg-[#FAF6EE] hover:bg-[#F3EAD6] text-[#8C7335] font-semibold border border-[#D4AF37]/50',
      calBtn: 'bg-[#FAF6EE] hover:bg-[#F3EAD6] text-[#8C7335] font-semibold border border-[#D4AF37]/50',
      iconColor: 'text-[#D4AF37]',
    },
    red: {
      mapBtn: 'bg-[#9E1B32] hover:bg-[#7F1734] text-[#FFFDF8] font-bold border border-[#C8A45D] shadow-sm',
      rideBtn: 'bg-[#F7F1E5] hover:bg-[#F0E4CE] text-[#7F1734] font-bold border border-[#C8A45D]/60',
      calBtn: 'bg-[#F7F1E5] hover:bg-[#F0E4CE] text-[#7F1734] font-bold border border-[#C8A45D]/60',
      iconColor: 'text-[#9E1B32]',
    },
    dark: {
      mapBtn: 'bg-[#D8BE87] hover:bg-[#E5CFA0] text-[#141211] font-bold shadow-md',
      rideBtn: 'bg-[#242021] hover:bg-[#332D2F] text-[#E5CFA0] border border-[#D8BE87]/40',
      calBtn: 'bg-[#242021] hover:bg-[#332D2F] text-[#E5CFA0] border border-[#D8BE87]/40',
      iconColor: 'text-[#D8BE87]',
    },
    celestial: {
      mapBtn: 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0C1428] font-bold shadow-md',
      rideBtn: 'bg-[#0E1A33] hover:bg-[#152549] text-[#F3E5AB] border border-[#D4AF37]/40',
      calBtn: 'bg-[#0E1A33] hover:bg-[#152549] text-[#F3E5AB] border border-[#D4AF37]/40',
      iconColor: 'text-[#F3E5AB]',
    },
    emerald: {
      mapBtn: 'bg-[#D4AF37] hover:bg-[#B38F26] text-[#081F1A] font-bold shadow-md',
      rideBtn: 'bg-[#0A2721] hover:bg-[#103830] text-[#E5CFA0] border border-[#D4AF37]/40',
      calBtn: 'bg-[#0A2721] hover:bg-[#103830] text-[#E5CFA0] border border-[#D4AF37]/40',
      iconColor: 'text-[#D4AF37]',
    },
    pink: {
      mapBtn: 'bg-gradient-to-r from-[#FCE4EC] to-[#F8D7DA] hover:from-[#F8BBD0] hover:to-[#F5CAD0] text-[#8C2343] font-semibold border border-[#F4B8C5]/60 shadow-xs',
      rideBtn: 'bg-white hover:bg-[#FFF5F7] text-[#8C2343] font-medium border border-[#F4B8C5]/50',
      calBtn: 'bg-white hover:bg-[#FFF5F7] text-[#8C2343] font-medium border border-[#F4B8C5]/50',
      iconColor: 'text-[#D97D8A]',
    },
    cyber: {
      mapBtn: 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono font-bold border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      rideBtn: 'bg-neutral-900 hover:bg-neutral-800 text-cyan-400 border border-cyan-500/30 font-mono',
      calBtn: 'bg-neutral-900 hover:bg-neutral-800 text-cyan-400 border border-cyan-500/30 font-mono',
      iconColor: 'text-cyan-400',
    },
    clean: {
      mapBtn: 'bg-neutral-900 hover:bg-neutral-800 text-white font-medium shadow-xs',
      rideBtn: 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium border border-neutral-200',
      calBtn: 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium border border-neutral-200',
      iconColor: 'text-neutral-700',
    },
  }[theme] || {
    mapBtn: 'bg-[#D4AF37] text-white',
    rideBtn: 'bg-neutral-100 text-neutral-700',
    calBtn: 'bg-neutral-100 text-neutral-700',
    iconColor: 'text-[#D4AF37]',
  };

  const handleOpenMap = (e: React.MouseEvent) => {
    e.preventDefault();
    const dest = `${event.locationName}, ${event.address}`.trim();
    const targetUrl = event.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
    window.open(targetUrl, '_blank');
  };

  return (
    <>
      <div className={`flex flex-wrap items-center gap-2 sm:gap-2.5 pt-4 ${className}`}>
        {/* 1. Google Maps Navigation */}
        <button
          type="button"
          onClick={handleOpenMap}
          className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${styles.mapBtn}`}
          title="Mở chỉ đường trên Google Maps"
        >
          <Navigation className="w-3.5 h-3.5 shrink-0" />
          <span>Chỉ Đường</span>
          <ExternalLink className="w-3 h-3 opacity-70 shrink-0" />
        </button>

        {/* 2. Grab / Be Ride Booking */}
        <button
          type="button"
          onClick={() => setIsRideModalOpen(true)}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs tracking-wider transition-all duration-200 cursor-pointer ${styles.rideBtn}`}
          title="Đặt xe Grab hoặc Be đến tiệc cưới"
        >
          <Car className="w-3.5 h-3.5 shrink-0" />
          <span>Đặt xe Grab / Be</span>
        </button>

        {/* 3. 1-Click Add to Calendar */}
        <button
          type="button"
          onClick={() => setIsCalModalOpen(true)}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs tracking-wider transition-all duration-200 cursor-pointer ${styles.calBtn}`}
          title="Thêm vào Google Calendar hoặc Apple Calendar (.ics)"
        >
          <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
          <span>Thêm vào Lịch</span>
        </button>
      </div>

      {/* Ride Booking Modal */}
      <SmartRideModal
        isOpen={isRideModalOpen}
        onClose={() => setIsRideModalOpen(false)}
        locationName={event.locationName}
        address={event.address}
        mapUrl={event.mapUrl}
      />

      {/* Add to Calendar Modal */}
      <CalendarExportModal
        isOpen={isCalModalOpen}
        onClose={() => setIsCalModalOpen(false)}
        event={event}
      />
    </>
  );
}
