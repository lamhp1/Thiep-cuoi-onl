import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../types';
import { Lead, PackageUpgradeRequest } from '../../types/commercial';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { getPlatformPaymentConfig } from '../../services/siteConfigService';
import {
  calculateUpgradeDetails,
  submitUpgradeRequest,
  normalizePackageSlug,
} from '../../services/upgradeService';
import { useToast } from '../ui/Toast';

interface PackageUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
  leadOrder?: Lead;
  initialTargetPackage?: 'premium' | 'vip';
  onUpgradeRequested?: (request: PackageUpgradeRequest) => void;
}

export function PackageUpgradeModal({
  isOpen,
  onClose,
  weddingData,
  leadOrder,
  initialTargetPackage,
  onUpgradeRequested,
}: PackageUpgradeModalProps) {
  const { showToast } = useToast();
  const currentSlug = normalizePackageSlug(weddingData.packageId || leadOrder?.package || 'basic');
  
  // Default target package
  const [targetSlug, setTargetSlug] = useState<'premium' | 'vip'>(
    initialTargetPackage || (currentSlug === 'basic' ? 'premium' : 'vip')
  );
  
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculation, setCalculation] = useState<{
    currentPackage: any;
    targetPackage: any;
    currentPaid: number;
    targetPrice: number;
    difference: number;
    differenceFormatted: string;
    isValidUpgrade: boolean;
  } | null>(null);

  useEffect(() => {
    if (initialTargetPackage) {
      setTargetSlug(initialTargetPackage);
    }
  }, [initialTargetPackage]);

  useEffect(() => {
    let isMounted = true;
    calculateUpgradeDetails(currentSlug, targetSlug).then((res) => {
      if (isMounted) setCalculation(res);
    });
    return () => {
      isMounted = false;
    };
  }, [currentSlug, targetSlug]);

  if (!isOpen) return null;

  const paymentConfig = getPlatformPaymentConfig();
  const orderCode = weddingData.orderCode || leadOrder?.id || 'LAMOUR';
  const customerName = weddingData.brideName && weddingData.groomName
    ? `${weddingData.groomName} & ${weddingData.brideName}`
    : leadOrder?.name || 'Khách Hàng';
  const customerPhone = weddingData.customerPhone || leadOrder?.phone || '';

  const memoContent = `NANG CAP ${orderCode} ${targetSlug.toUpperCase()}`;
  const amount = calculation?.difference || 0;
  const vietQrUrl =
    paymentConfig.useCustomQr && paymentConfig.customQrUrl
      ? paymentConfig.customQrUrl
      : `https://api.vietqr.io/image/${paymentConfig.bankCode}-${paymentConfig.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memoContent)}&accountName=${encodeURIComponent(paymentConfig.accountHolder)}`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Đã sao chép: ${text}`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async () => {
    if (!calculation || calculation.difference <= 0) {
      showToast('Gói lựa chọn không hợp lệ', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const request = await submitUpgradeRequest({
        orderCode,
        weddingId: weddingData.id,
        weddingSlug: weddingData.slug,
        customerName,
        customerPhone,
        customerEmail: weddingData.customerEmail || leadOrder?.email,
        currentPackage: currentSlug,
        targetPackage: targetSlug,
        note: customerNote.trim() || undefined,
      });

      showToast(
        'Đã gửi yêu cầu nâng cấp gói thành công! Admin sẽ kiểm tra và duyệt kích hoạt trong ít phút.',
        'success'
      );
      if (onUpgradeRequested) {
        onUpgradeRequested(request);
      }
      onClose();
    } catch (err) {
      console.error('Upgrade submission failed:', err);
      showToast('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37] max-w-2xl w-full shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF6EE] text-[#8C7335] flex items-center justify-center border border-[#D4AF37]/40 shadow-xs">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-lg sm:text-xl font-bold text-neutral-900">
                Nâng Cấp Gói Dịch Vụ Cưới
              </h3>
              <p className="text-xs text-neutral-500">
                Tự động tính chênh lệch & kích hoạt mở khóa toàn bộ tính năng cao cấp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Target Package Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">
              Chọn gói bạn muốn nâng cấp lên:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentSlug === 'basic' && (
                <button
                  type="button"
                  onClick={() => setTargetSlug('premium')}
                  className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    targetSlug === 'premium'
                      ? 'border-[#D4AF37] bg-[#FAF6EE] ring-2 ring-[#D4AF37]/50 shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-neutral-900 block">
                      Gói Cao Cấp (Premium)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-white">
                      Phổ Biến
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-[#8C7335] mt-1">499.000 đ</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Mở khóa tất cả mẫu thiệp cao cấp, RSVP không giới hạn, lưu trữ 1 năm.
                  </p>
                </button>
              )}

              <button
                type="button"
                onClick={() => setTargetSlug('vip')}
                className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                  targetSlug === 'vip'
                    ? 'border-[#D4AF37] bg-[#FAF6EE] ring-2 ring-[#D4AF37]/50 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-neutral-900 block">
                    Gói Thiết Kế Riêng (VIP)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                    Cao Nhất
                  </span>
                </div>
                <p className="text-sm font-extrabold text-[#8C7335] mt-1">799.000 đ</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Mở khóa 100% mẫu thiệp, hiệu ứng cao cấp, hỗ trợ thiết kế riêng & lưu trữ trọn đời.
                </p>
              </button>
            </div>
          </div>

          {/* Automatic Price Calculation Box */}
          {calculation && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Bảng Tính Số Tiền Cần Nâng Cấp
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-neutral-600">
                  <span>Giá gói mới ({calculation.targetPackage.name}):</span>
                  <span className="font-semibold text-neutral-900">
                    {calculation.targetPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="flex justify-between items-center text-neutral-600">
                  <span>Đã thanh toán ({calculation.currentPackage.name}):</span>
                  <span className="font-semibold text-emerald-600">
                    - {calculation.currentPaid.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-neutral-800">
                    Số tiền cần thanh toán nâng cấp:
                  </span>
                  <span className="font-extrabold text-base sm:text-lg text-[#8C7335]">
                    {calculation.differenceFormatted}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Details with VietQR */}
          <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center gap-5">
            <div className="shrink-0 bg-white p-2.5 rounded-xl shadow-xs border border-neutral-200 text-center">
              <img
                src={vietQrUrl}
                alt="VietQR Nâng Cấp Gói"
                className="w-36 h-36 object-contain mx-auto"
              />
              <span className="text-[10px] text-neutral-400 font-medium block mt-1">
                Quét mã để thanh toán tự động
              </span>
            </div>

            <div className="space-y-2 text-xs w-full">
              <div className="flex justify-between items-center pb-1.5 border-b border-[#D4AF37]/20">
                <span className="text-neutral-500">Ngân hàng:</span>
                <span className="font-bold text-neutral-900">{paymentConfig.bankName}</span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-[#D4AF37]/20">
                <span className="text-neutral-500">Số tài khoản:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
                  <span>{paymentConfig.accountNumber}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentConfig.accountNumber, 'acc')}
                    className="p-1 hover:text-[#D4AF37] text-neutral-400 cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedField === 'acc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-[#D4AF37]/20">
                <span className="text-neutral-500">Chủ tài khoản:</span>
                <span className="font-semibold text-neutral-900">{paymentConfig.accountHolder}</span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-[#D4AF37]/20">
                <span className="text-neutral-500">Số tiền chuyển khoản:</span>
                <span className="font-extrabold text-[#8C7335] text-sm">
                  {calculation?.differenceFormatted}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Nội dung CK:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
                  <span className="text-[#8C7335]">{memoContent}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(memoContent, 'memo')}
                    className="p-1 hover:text-[#D4AF37] text-neutral-400 cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedField === 'memo' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 block">
              Ghi chú thêm hoặc mã giao dịch ngân hàng (Tùy chọn):
            </label>
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="VD: Đã chuyển khoản từ app Techcombank 200k lúc 10h15..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]"
            />
          </div>

          {/* Process explanation banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <span className="font-bold block">Quy trình duyệt tự động:</span>
              <p className="text-blue-800">
                Sau khi chuyển khoản, bấm nút bên dưới để gửi yêu cầu đến Admin. Khi Admin kiểm tra và duyệt thành công, tài khoản của bạn sẽ được kích hoạt gói cao hơn ngay lập tức!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-end gap-3 bg-neutral-50 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-white text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !calculation || calculation.difference <= 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Đang gửi yêu cầu...'
                : 'Tôi Đã Chuyển Khoản — Gửi Yêu Cầu Đến Admin'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
