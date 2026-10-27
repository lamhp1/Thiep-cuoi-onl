import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Navigation, Copy, Check, Car, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { getSmartNavigationLinks } from '../../../lib/guestPersonalization';
import { useToast } from '../../ui/Toast';

interface SmartRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  address: string;
  mapUrl?: string;
  theme?: 'gold' | 'red' | 'dark';
}

export function SmartRideModal({
  isOpen,
  onClose,
  locationName,
  address,
  mapUrl,
  theme = 'gold',
}: SmartRideModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const links = getSmartNavigationLinks({ locationName, address, mapUrl });

  const handleCopyAddress = () => {
    const fullText = `${locationName}, ${address}`.trim();
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast('Đã sao chép địa chỉ tiệc cưới vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenGrab = () => {
    // Attempt mobile scheme then open web link
    window.open(links.grabWebUrl, '_blank');
    showToast('Đang mở Grab với điểm đến đã định sẵn...', 'info');
  };

  const handleOpenBe = () => {
    window.open(links.beWebUrl, '_blank');
    showToast('Đang mở Be với điểm đến đã định sẵn...', 'info');
  };

  const handleOpenGoogleMaps = () => {
    window.open(links.googleMapsDirectionsUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-[#FFFDF9] text-[#2C2A29] w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative border-2 border-[#D4AF37]/40 space-y-5"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-left space-y-1 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E0] text-[#8C7335] text-xs font-semibold border border-[#D4AF37]/30">
              <Car className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Chỉ Đường &amp; Đặt Xe Thông Minh</span>
            </div>
            <h3 className="font-serif-title text-xl font-bold text-neutral-900 pt-1">
              {locationName}
            </h3>
            <div className="flex items-start gap-1.5 text-xs text-neutral-600">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
          </div>

          {/* Copy Address Box */}
          <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#D4AF37]/30 flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-700 truncate font-mono select-all">
              {locationName}, {address}
            </span>
            <button
              onClick={handleCopyAddress}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Chép địa chỉ'}</span>
            </button>
          </div>

          {/* Ride Booking Options */}
          <div className="space-y-2.5">
            <p className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
              Chọn ứng dụng di chuyển:
            </p>

            {/* Grab Ride */}
            <button
              onClick={handleOpenGrab}
              className="w-full p-3.5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-600 transition-all flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00B14F] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  Grab
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    Đặt Xe Grab (Car / Bike)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Đã định sẵn điểm đến {locationName}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Be Ride */}
            <button
              onClick={handleOpenBe}
              className="w-full p-3.5 rounded-2xl border-2 border-amber-500/40 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-600 transition-all flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFCC00] text-neutral-900 flex items-center justify-center font-extrabold text-sm shadow-sm">
                  be
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 group-hover:text-amber-800 transition-colors">
                    Đặt Xe Be (BeCar / BeBike)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Mở ứng dụng Be nhanh chóng
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Google Maps Directions */}
            <button
              onClick={handleOpenGoogleMaps}
              className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 transition-all flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 group-hover:text-blue-700 transition-colors">
                    Chỉ Đường Google Maps
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Dẫn đường chuẩn xác từng khúc cua
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 text-center">
            Mẹo: Bạn có thể sao chép địa chỉ để dùng cho các app taxi khác (Xanh SM, Taxi Mai Linh...)
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
