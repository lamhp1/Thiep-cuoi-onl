import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, Copy, Check, Download, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export interface QRModalData {
  qrUrl: string;
  title?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  note?: string;
}

// Global dispatcher to open QR zoom modal from anywhere
export function openQRZoom(data: QRModalData) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('lamour:open-qr-zoom', {
        detail: data,
        bubbles: true,
      })
    );
  }
}

interface QRZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QRModalData | null;
}

export function QRZoomModal({ isOpen, onClose, data }: QRZoomModalProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Reset copied states when modal opens/changes
  useEffect(() => {
    setCopiedAccount(false);
    setCopiedNote(false);
    setIsDownloading(false);
  }, [data]);

  const handleCopyAccount = useCallback(async () => {
    if (!data?.accountNumber) return;
    try {
      await navigator.clipboard.writeText(data.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = data.accountNumber;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2500);
    }
  }, [data?.accountNumber]);

  const handleCopyNote = useCallback(async () => {
    if (!data?.note) return;
    try {
      await navigator.clipboard.writeText(data.note);
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2500);
    } catch {
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2500);
    }
  }, [data?.note]);

  const handleDownloadQR = useCallback(async () => {
    if (!data?.qrUrl) return;
    setIsDownloading(true);
    try {
      // Try fetching as blob to trigger direct file download
      const response = await fetch(data.qrUrl, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanName = (data.accountHolder || 'Ma-QR')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
      link.download = `vietqr-mung-cuoi-${cleanName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      // Fallback for CORS: open image or direct link download
      const link = document.createElement('a');
      link.href = data.qrUrl;
      link.target = '_blank';
      link.download = 'vietqr-mung-cuoi.png';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  }, [data?.qrUrl, data?.accountHolder]);

  const cleanQrUrl = data?.qrUrl?.trim() || null;

  if (!isOpen || !cleanQrUrl) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-gradient-to-b from-[#1C1816] via-[#161311] to-[#0E0C0B] text-white rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-[#D4AF37]/40 z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 z-20"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1.5 pr-8 pl-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E5C378] text-[11px] font-semibold tracking-wider uppercase">
              <QrCode className="w-3.5 h-3.5" />
              <span>Phóng To Mã QR Mừng Cưới</span>
            </div>
            <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#FFFDF8] tracking-wide line-clamp-1">
              {data.title || 'Quét Mã Để Mừng Cưới'}
            </h3>
            <p className="text-xs text-neutral-400">
              Quét mã bằng app Ngân hàng hoặc Ví điện tử (MoMo, ZaloPay, Viettel Money...)
            </p>
          </div>

          {/* Large High-Contrast QR Code Container */}
          <div className="relative mx-auto my-3 p-3.5 sm:p-4 bg-white rounded-2xl shadow-2xl border-2 border-[#D4AF37]/50 max-w-[290px] sm:max-w-[320px] aspect-square flex flex-col items-center justify-center">
            {/* Corner aesthetic brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />

            {cleanQrUrl ? (
              <img
                src={cleanQrUrl}
                alt="Mã QR Chuyển Khoản Mừng Cưới"
                className="w-full h-full object-contain select-none rounded-lg"
                referrerPolicy="no-referrer"
              />
            ) : null}

            {/* Bottom floating badge on the QR code */}
            <div className="absolute -bottom-3 px-3 py-0.5 rounded-full bg-[#BA1E28] text-white text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 border border-white/40">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>VietQR • Chuyển Khoản 24/7</span>
            </div>
          </div>

          {/* Bank details info card */}
          {(data.bankName || data.accountNumber || data.accountHolder) && (
            <div className="mt-5 space-y-2 bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs">
              {data.bankName && (
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="text-neutral-400">Ngân hàng:</span>
                  <span className="font-bold text-[#E5C378] text-right font-serif-title sm:text-sm">
                    {data.bankName}
                  </span>
                </div>
              )}

              {data.accountHolder && (
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="text-neutral-400">Chủ tài khoản:</span>
                  <span className="font-bold text-white uppercase tracking-wider text-right">
                    {data.accountHolder}
                  </span>
                </div>
              )}

              {data.accountNumber && (
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-neutral-400">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base sm:text-lg font-bold text-[#F3E5AB] tracking-wider">
                      {data.accountNumber}
                    </span>
                    <button
                      onClick={handleCopyAccount}
                      className="px-2 py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#E5C378] hover:text-white border border-[#D4AF37]/40 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {data.note && (
                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <span className="text-neutral-400">Nội dung CK:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-200 font-mono text-[11px] truncate max-w-[150px]">
                      {data.note}
                    </span>
                    <button
                      onClick={handleCopyNote}
                      className="text-neutral-400 hover:text-white text-[11px] underline cursor-pointer"
                    >
                      {copiedNote ? 'Đã chép' : 'Chép'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
            <button
              onClick={handleDownloadQR}
              disabled={isDownloading}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#E5C378]" />
              <span>{isDownloading ? 'Đang tải...' : 'Tải mã QR'}</span>
            </button>

            {data.accountNumber ? (
              <button
                onClick={handleCopyAccount}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 active:scale-98 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                {copiedAccount ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-950" />
                    <span>Sao chép STK</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-98 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
            )}
          </div>

          {/* Helpful Tip */}
          <p className="mt-3.5 text-[11px] text-center text-neutral-400 leading-relaxed font-body">
            💡 <span className="text-neutral-300">Mẹo:</span> Bạn có thể tải ảnh mã QR về máy rồi mở app ngân hàng chọn <span className="text-[#E5C378]">"Quét QR từ thư viện ảnh"</span> để chuyển khoản nhanh.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * UniversalQRZoomModal is mounted once inside the invitation view (WeddingPage).
 * It listens for:
 * 1. The custom event 'lamour:open-qr-zoom'
 * 2. Click events on any image matching QR patterns (vietqr, qrCode, qr, etc.)
 * This provides 100% guarantee that any QR code clicked in any template will enlarge.
 */
export function UniversalQRZoomModal() {
  const [modalData, setModalData] = useState<QRModalData | null>(null);

  useEffect(() => {
    // 1. Listen for explicit custom events
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<QRModalData>;
      if (customEvent.detail && customEvent.detail.qrUrl) {
        setModalData(customEvent.detail);
      }
    };

    window.addEventListener('lamour:open-qr-zoom', handleCustomEvent);

    // 2. Global click interceptor for QR images
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Do not trigger if already clicking inside an open modal or lightbox
      if (target.closest('.fixed.z-\\[99999\\], #lightbox-modal, [role="dialog"]')) {
        return;
      }

      // Find closest image or element with data-qr
      const img = target.tagName === 'IMG' ? (target as HTMLImageElement) : target.querySelector('img');
      const qrContainer = target.closest('[data-qr-zoom]') as HTMLElement | null;

      let qrUrl = '';
      let title = '';
      let bankName = '';
      let accountNumber = '';
      let accountHolder = '';
      let note = '';

      if (qrContainer) {
        qrUrl = qrContainer.getAttribute('data-qr-url') || (qrContainer.querySelector('img')?.src || '');
        title = qrContainer.getAttribute('data-qr-title') || '';
        bankName = qrContainer.getAttribute('data-qr-bank') || '';
        accountNumber = qrContainer.getAttribute('data-qr-account') || '';
        accountHolder = qrContainer.getAttribute('data-qr-holder') || '';
        note = qrContainer.getAttribute('data-qr-note') || '';
      }

      if (!qrUrl && img && img.src) {
        const src = img.src.toLowerCase();
        const alt = (img.alt || '').toLowerCase();
        const isQR =
          src.includes('vietqr') ||
          src.includes('api.vietqr.io') ||
          src.includes('img.vietqr.io') ||
          src.includes('qr') ||
          alt.includes('qr') ||
          alt.includes('mã qr') ||
          alt.includes('mung cuoi') ||
          alt.includes('vietqr');

        // Check that it is indeed a QR code, not just a standard photo
        if (isQR && (src.includes('vietqr') || src.includes('qr') || alt.includes('qr'))) {
          qrUrl = img.src;
          title = img.alt || 'Mã QR Mừng Cưới';

          // Try to discover bank details from surrounding card if available
          const parentCard = img.closest('.gift-section, [class*="Gift"], [class*="gift"], [class*="bank"], [class*="Bank"], div') as HTMLElement | null;
          if (parentCard) {
            const text = parentCard.innerText || '';
            const accMatch = text.match(/\b\d{8,18}\b/);
            if (accMatch) accountNumber = accMatch[0];
          }
        }
      }

      if (qrUrl) {
        setModalData({
          qrUrl,
          title: title || 'Mã QR Mừng Cưới',
          bankName,
          accountNumber,
          accountHolder,
          note,
        });
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener('lamour:open-qr-zoom', handleCustomEvent);
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return (
    <QRZoomModal
      isOpen={!!modalData}
      onClose={() => setModalData(null)}
      data={modalData}
    />
  );
}
