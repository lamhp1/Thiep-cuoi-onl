import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Tablet, Monitor, X, ArrowLeft, MailOpen } from 'lucide-react';
import { WeddingData } from '../../types';
import { WeddingPage } from '../wedding/WeddingPage';

interface PreviewModalProps {
  data: WeddingData;
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ data, isOpen, onClose }: PreviewModalProps) {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [previewKey, setPreviewKey] = useState(1);

  // Listen for Escape key and lock body scroll when preview is active
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const deviceWidthClass = {
    mobile: 'max-w-[390px] h-[780px] rounded-[44px] border-[10px] border-neutral-800 shadow-2xl',
    tablet: 'max-w-[768px] h-[820px] rounded-[32px] border-[10px] border-neutral-800 shadow-2xl',
    desktop: 'max-w-full w-full h-[88vh] rounded-2xl border border-neutral-700 shadow-2xl',
  }[device];

  return (
    <AnimatePresence>
      <div
        id="wedding-preview-modal"
        className="fixed inset-0 z-[9999] flex flex-col bg-neutral-950/92 backdrop-blur-md animate-fadeIn"
      >
        {/* Top Control Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-neutral-900 text-white border-b border-neutral-800 shrink-0 z-10 shadow-md">
          {/* Left: Quick Back & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer shrink-0"
              title="Thoát xem trước (ESC)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif-title font-bold text-sm sm:text-base text-[#D4AF37] truncate">
                  Xem Trước Thiệp Cưới
                </span>
                <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
                  {data.groomName} & {data.brideName}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 hidden sm:block">
                Nhấn ESC hoặc bấm ra vùng tối bên ngoài để thoát
              </p>
            </div>
          </div>

          {/* Middle: Device Switcher */}
          <div className="flex items-center gap-1 bg-neutral-800/90 p-1 rounded-xl border border-neutral-700">
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                device === 'mobile'
                  ? 'bg-[#D4AF37] text-neutral-900 font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">Mobile</span>
            </button>

            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                device === 'tablet'
                  ? 'bg-[#D4AF37] text-neutral-900 font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">Tablet</span>
            </button>

            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                device === 'desktop'
                  ? 'bg-[#D4AF37] text-neutral-900 font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px] sm:text-xs">Desktop</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowEnvelope(true);
                setPreviewKey((k) => k + 1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#F3E5AB] border border-[#D4AF37]/50 text-xs font-semibold transition-colors cursor-pointer"
              title="Mở lại trang bì thư mở thiệp cưới"
            >
              <MailOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Mở lại bì thư</span>
            </button>

            <button
              id="preview-modal-close-btn"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
              title="Đóng chế độ xem trước (ESC)"
            >
              <X className="w-4 h-4" />
              <span>Đóng xem thử</span>
            </button>
          </div>
        </div>

        {/* Device Viewport Frame Area with Backdrop Click to Exit */}
        <div
          onClick={(e) => {
            // Close if clicking directly on the backdrop container
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 flex items-center justify-center relative cursor-zoom-out"
          title="Bấm vào khoảng tối bên ngoài để đóng xem trước"
        >
          <motion.div
            key={`${device}-${previewKey}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative overflow-hidden bg-[#FDFBF7] transition-all cursor-default ${deviceWidthClass}`}
          >
            {/* Inner scroll container hosting live wedding page */}
            <div className="w-full h-full overflow-y-auto relative scrollbar-thin">
              <WeddingPage
                key={`preview-wedding-${previewKey}-${showEnvelope}`}
                data={data}
                isOwnerMode={true}
                showEnvelopeImmediately={showEnvelope}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Floating Quick Exit Button for High Accessibility */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[10000] pointer-events-auto">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-neutral-900/95 hover:bg-black text-white text-xs font-bold shadow-2xl border border-white/20 backdrop-blur-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-[#D4AF37]/50"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>Thoát xem thử (Trở về chỉnh sửa)</span>
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
}
