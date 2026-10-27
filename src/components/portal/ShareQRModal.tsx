import React, { useState } from 'react';
import { X, Copy, Check, Download, Share2, Sparkles } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface ShareQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingUrl: string;
  groomName: string;
  brideName: string;
}

export function ShareQRModal({
  isOpen,
  onClose,
  weddingUrl,
  groomName,
  brideName,
}: ShareQRModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use reliable standard QR code API
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    weddingUrl
  )}&color=2c2a29&bgcolor=ffffff&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(weddingUrl);
    setCopied(true);
    showToast('Đã sao chép link thiệp cưới!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeGroom = (groomName || 'ChuRe').replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
      const safeBride = (brideName || 'CoDau').replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
      link.download = `QR_ThiepCuoi_${safeGroom}_${safeBride}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      showToast('Đã tải mã QR thiệp cưới về máy thành công!', 'success');
    } catch {
      // Fallback: direct download link / new tab
      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.target = '_blank';
      link.download = 'QR_ThiepCuoi.png';
      link.click();
      showToast('Đang tải ảnh mã QR...', 'info');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative border border-[#D4AF37]/30 text-center animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EE] text-[#8C7335] text-xs font-semibold border border-[#D4AF37]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mã QR Chia Sẻ Thiệp Cưới</span>
          </div>
          <h3 className="font-serif-title text-xl font-bold text-neutral-900 pt-1">
            {groomName} & {brideName}
          </h3>
          <p className="text-xs text-neutral-500">
            Khách mời quét mã bằng camera điện thoại hoặc Zalo để mở thiệp trực tiếp
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#D4AF37]/40 inline-block mx-auto shadow-inner">
          <div className="bg-white p-3 rounded-xl shadow-xs">
            <img
              src={qrImageUrl}
              alt="Mã QR Thiệp Cưới"
              className="w-52 h-52 object-contain mx-auto rounded-lg"
            />
          </div>
          <p className="text-[11px] font-mono text-neutral-600 mt-2 font-medium">
            Quét mã để xem thiệp cưới
          </p>
        </div>

        {/* Action Buttons: Download QR & Copy Link */}
        <div className="space-y-2.5">
          <button
            onClick={handleDownloadQR}
            disabled={isDownloading}
            className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Đang tải ảnh...' : 'Tải Ảnh Mã QR Về Máy'}</span>
          </button>

          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 p-2 rounded-xl text-left">
            <span className="font-mono text-xs text-neutral-700 truncate flex-1 px-2 select-all">
              {weddingUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Tips for Couple */}
        <div className="text-[11px] text-neutral-500 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-left space-y-1">
          <p className="font-semibold text-neutral-700">Mẹo cho cô dâu & chú rể:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Tải mã QR về máy để gửi nhà in thiệp giấy hoặc in standee để bàn tiệc cưới.</li>
            <li>Gửi trực tiếp đường dẫn qua tin nhắn Zalo, Messenger hoặc đính kèm vào bài đăng Facebook.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
