import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Camera,
  ArrowRight,
  TrendingUp,
  Clock,
  Send,
} from 'lucide-react';
import { WeddingData } from '../../types';
import { PackageUpgradeRequest } from '../../types/commercial';
import {
  ALBUM_ADDON_PACKS,
  AlbumAddonPack,
  submitAlbumSlotRequest,
  getLiveAlbumQuota,
} from '../../services/liveAlbumService';
import { getPlatformPaymentConfig } from '../../services/siteConfigService';
import { useToast } from '../ui/Toast';

interface BuyExtraAlbumSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
  onSlotsPurchased?: (updated: WeddingData) => void;
  onRequestSubmitted?: (req: PackageUpgradeRequest) => void;
  onUpgradePackage?: () => void;
}

export function BuyExtraAlbumSlotsModal({
  isOpen,
  onClose,
  weddingData,
  onSlotsPurchased,
  onRequestSubmitted,
  onUpgradePackage,
}: BuyExtraAlbumSlotsModalProps) {
  const { showToast } = useToast();
  const quota = getLiveAlbumQuota(weddingData);
  const paymentConfig = getPlatformPaymentConfig();

  const [selectedPack, setSelectedPack] = useState<AlbumAddonPack>(ALBUM_ADDON_PACKS[1]); // Default to 60 slots
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [customerNote, setCustomerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const orderCode = weddingData.orderCode || weddingData.slug || 'LAMOUR';
  const transferMemo = `ALBUM ${orderCode} ${selectedPack.extraSlots}`.toUpperCase();

  // VietQR URL
  const vietQrUrl = `https://api.vietqr.io/image/${paymentConfig.bankCode || '970436'}-${paymentConfig.accountNumber}-compact2.jpg?amount=${selectedPack.price}&addInfo=${encodeURIComponent(
    transferMemo
  )}&accountName=${encodeURIComponent(paymentConfig.accountHolder)}`;

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(transferMemo);
    setCopiedMemo(true);
    showToast('Đã sao chép nội dung chuyển khoản!', 'success');
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  const handleSubmitRequest = async () => {
    setIsProcessing(true);
    try {
      const request = await submitAlbumSlotRequest({
        wedding: weddingData,
        pack: selectedPack,
        customerNote: customerNote.trim() || undefined,
      });

      setIsSuccess(true);
      showToast(
        `Đã gửi yêu cầu mua thêm +${selectedPack.extraSlots} ảnh đến Admin! Admin sẽ đối soát sao kê và duyệt cấp dung lượng cho bạn.`,
        'success'
      );

      if (onRequestSubmitted) {
        onRequestSubmitted(request);
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra, vui lòng liên hệ hotline hỗ trợ', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn font-body"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-linear-to-r from-[#FAF6EE] to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#8C7335]">
              <Camera className="w-5 h-5 text-[#B38F26]" />
            </div>
            <div>
              <h3 className="font-serif-title text-base sm:text-lg font-bold text-neutral-900">
                Mua Thêm Số Lượng Ảnh Album Cưới
              </h3>
              <p className="text-xs text-neutral-500">
                Mở rộng hạn mức ảnh được tải lên album thiệp cưới & album ngày cưới
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Current Status Bar */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-neutral-500">Gói hiện tại:</span>{' '}
              <strong className="text-neutral-900">{quota.packageName}</strong>
              <span className="text-neutral-400 ml-1.5">
                (Gốc: {quota.baseQuota} ảnh{quota.extraPurchased > 0 ? ` + ${quota.extraPurchased} ảnh mua thêm` : ''})
              </span>
            </div>
            <div>
              <span className="text-neutral-500">Đã dùng chung:</span>{' '}
              <strong className="text-neutral-900 font-mono">{quota.currentCount} / {quota.totalLimit} ảnh</strong>{' '}
              <span className="text-neutral-400">
                ({quota.galleryCount} kỷ niệm + {quota.liveAlbumCount} ngày cưới)
              </span>
            </div>
          </div>

          {/* Select Add-on Pack */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              1. Chọn gói số lượng ảnh muốn mua thêm:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ALBUM_ADDON_PACKS.map((pack) => {
                const isSelected = selectedPack.id === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#FAF6EE]/60 shadow-md scale-[1.02]'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                    }`}
                  >
                    {pack.badge && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37] text-white shadow-2xs">
                        {pack.badge}
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-sm">
                        <span>+{pack.extraSlots} ảnh</span>
                        {isSelected && <Check className="w-4 h-4 text-[#B38F26]" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-tight">
                        {pack.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-200/60">
                      <div className="text-base font-extrabold text-[#8C7335]">
                        {pack.price.toLocaleString('vi-VN')} đ
                      </div>
                      {pack.originalPrice && (
                        <div className="text-[10px] text-neutral-400 line-through">
                          {pack.originalPrice.toLocaleString('vi-VN')} đ
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capacity preview */}
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Sau khi mua: Hạn mức dùng chung tăng lên{' '}
                <strong>{quota.totalLimit + selectedPack.extraSlots} ảnh</strong> (cho cả ảnh kỷ niệm & ngày cưới)
              </span>
            </div>
            <span className="font-bold text-emerald-700">+{selectedPack.extraSlots}</span>
          </div>

          {/* Payment Section (VietQR) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              2. Quét mã VietQR chuyển khoản kích hoạt tức thì:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <img
                  src={vietQrUrl}
                  alt="VietQR Chuyển Khoản Mua Thêm Ảnh"
                  className="w-44 h-44 object-contain"
                />
                <span className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-[#D4AF37]" />
                  <span>Quét bằng mọi App Ngân hàng</span>
                </span>
              </div>

              {/* Transfer Details */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Ngân hàng:</span>
                  <strong className="text-neutral-900">{paymentConfig.bankName}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Số tài khoản:</span>
                  <strong className="text-neutral-900 font-mono text-sm">{paymentConfig.accountNumber}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Chủ tài khoản:</span>
                  <strong className="text-neutral-900">{paymentConfig.accountHolder}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Số tiền thanh toán:</span>
                  <strong className="text-base text-[#8C7335] font-extrabold">
                    {selectedPack.price.toLocaleString('vi-VN')} đ
                  </strong>
                </div>

                {/* Memo */}
                <div className="pt-1">
                  <span className="text-neutral-500 block text-[11px]">Nội dung chuyển khoản (bắt buộc):</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded border border-neutral-200">
                      {transferMemo}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyMemo}
                      className="p-1 rounded bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 cursor-pointer"
                      title="Sao chép nội dung"
                    >
                      {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Note input for customer */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-neutral-600">
                Ghi chú thêm cho Admin (tùy chọn):
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="VD: Nguyễn Văn A chuyển khoản từ Techcombank..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            {/* Explanatory Approval Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <span className="font-bold block">Quy trình duyệt & cấp dung lượng:</span>
                <p className="text-amber-800">
                  Sau khi hai bạn chuyển khoản thành công, hãy bấm <strong>"Gửi Yêu Cầu Duyệt Đến Admin"</strong>. Admin sẽ kiểm tra sao kê ngân hàng và phê duyệt cấp dung lượng ảnh cho hai bạn trong vòng ít phút!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-500 text-center sm:text-left">
            <span>Hoặc nâng cấp gói thiệp? </span>
            {onUpgradePackage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onUpgradePackage();
                }}
                className="text-[#8C7335] font-semibold hover:underline cursor-pointer"
              >
                Nâng cấp Gói Cao Cấp / VIP
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 text-xs font-semibold cursor-pointer"
            >
              Để sau
            </button>

            <button
              type="button"
              onClick={handleSubmitRequest}
              disabled={isProcessing || isSuccess}
              style={{ marginRight: '100px' }}
              className="mr-[100px] flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Đã Gửi Yêu Cầu Đến Admin!</span>
                </>
              ) : isProcessing ? (
                <span>Đang gửi yêu cầu...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi Yêu Cầu Duyệt Đến Admin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
