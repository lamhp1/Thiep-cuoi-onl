import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../types';
import { Lead, PackageUpgradeRequest } from '../../types/commercial';
import {
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  Sparkles,
  Phone,
  MessageCircle,
  Copy,
  Check,
  X,
  ExternalLink,
  ArrowUpRight,
  Crown,
  ArrowRight,
  Camera,
} from 'lucide-react';
import { getPlatformPaymentConfig, getSiteContentConfig, fetchSiteContentConfigFromFirestore } from '../../services/siteConfigService';
import { SiteContentConfig } from '../../types/commercial';
import {
  getPendingUpgradeForOrder,
  getPendingExtensionForOrder,
  submitExtensionRequest,
  normalizePackageSlug,
} from '../../services/upgradeService';
import { getLiveAlbumQuota } from '../../services/liveAlbumService';
import { getPlanTierLevel } from '../../data/templates';
import { PackageUpgradeModal } from './PackageUpgradeModal';
import { BuyExtraAlbumSlotsModal } from './BuyExtraAlbumSlotsModal';
import { useToast } from '../ui/Toast';

interface CoupleOrderPackageTabProps {
  weddingData: WeddingData;
  leadOrder?: Lead;
  onDataSaved?: (saved: WeddingData) => void;
}

export function CoupleOrderPackageTab({ weddingData, leadOrder, onDataSaved }: CoupleOrderPackageTabProps) {
  const { showToast } = useToast();
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAlbumSlotsModal, setShowAlbumSlotsModal] = useState(false);
  const [targetUpgradePackage, setTargetUpgradePackage] = useState<'premium' | 'vip'>('premium');
  const [pendingUpgrade, setPendingUpgrade] = useState<PackageUpgradeRequest | null>(null);
  const [pendingExtension, setPendingExtension] = useState<PackageUpgradeRequest | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'6m' | '12m' | 'lifetime'>('12m');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(getSiteContentConfig());

  useEffect(() => {
    fetchSiteContentConfigFromFirestore().then((remote) => {
      if (remote) setSiteContent(remote);
    });
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContentConfig>;
      if (customEvent.detail) setSiteContent(customEvent.detail);
      else setSiteContent(getSiteContentConfig());
    };
    window.addEventListener('lamour_site_content_updated', handleUpdate);
    return () => window.removeEventListener('lamour_site_content_updated', handleUpdate);
  }, []);

  const displayHotline = siteContent.hotline || '0905 123 456';
  const cleanHotline = displayHotline.replace(/\s+/g, '');
  const displayZalo = siteContent.zaloNumber || displayHotline;
  const cleanZalo = displayZalo.replace(/\s+/g, '');

  const quota = getLiveAlbumQuota(weddingData);

  const paymentConfig = getPlatformPaymentConfig();
  const isPaid = Boolean(
    leadOrder
      ? (leadOrder.status === 'PAID' || leadOrder.status === 'COMPLETED')
      : (weddingData.status === 'ACTIVE' && (!weddingData.orderCode || weddingData.orderCode === 'DEMO'))
  ) && weddingData.status !== 'LOCKED';

  const pkgCandidates = [
    weddingData.packageId,
    weddingData.packageName,
    leadOrder?.package,
  ].filter(Boolean) as string[];
  const pkgLevel =
    pkgCandidates.length > 0
      ? Math.max(...pkgCandidates.map((p) => getPlanTierLevel(p)))
      : 1;
  const currentPkgSlug = pkgLevel >= 3 ? 'vip' : pkgLevel === 2 ? 'premium' : 'basic';
  const isVip = currentPkgSlug === 'vip';
  const isPremium = currentPkgSlug === 'premium';
  const isBasic = currentPkgSlug === 'basic';

  const packageName =
    weddingData.packageName ||
    (isVip ? 'Gói Thiết Kế Riêng (VIP)' : isBasic ? 'Gói Cơ Bản (Basic)' : 'Gói Cao Cấp (Premium)');

  // Load pending upgrade and extension requests
  const loadPendingRequests = async () => {
    const code = weddingData.orderCode || leadOrder?.id || weddingData.customerPhone || '';
    if (code) {
      const pending = await getPendingUpgradeForOrder(code);
      const pendingExt = await getPendingExtensionForOrder(code);
      setPendingUpgrade(pending);
      setPendingExtension(pendingExt);
    }
  };

  useEffect(() => {
    loadPendingRequests();

    const handleUpgradeEvent = (e: any) => {
      loadPendingRequests();
      if (e.detail?.wedding && onDataSaved) {
        onDataSaved(e.detail.wedding);
      }
    };

    window.addEventListener('lamour_upgrade_requested', handleUpgradeEvent);
    window.addEventListener('lamour_upgrade_approved', handleUpgradeEvent);
    window.addEventListener('lamour_upgrade_rejected', handleUpgradeEvent);
    return () => {
      window.removeEventListener('lamour_upgrade_requested', handleUpgradeEvent);
      window.removeEventListener('lamour_upgrade_approved', handleUpgradeEvent);
      window.removeEventListener('lamour_upgrade_rejected', handleUpgradeEvent);
    };
  }, [weddingData.orderCode, leadOrder?.id]);

  // Calculate remaining days
  const calculateDaysLeft = () => {
    if (!weddingData.expiresAt) return 365;
    const diffTime = new Date(weddingData.expiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(days, 0);
  };

  const daysLeft = calculateDaysLeft();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '1 năm kể từ ngày kích hoạt';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const openUpgrade = (target: 'premium' | 'vip') => {
    setTargetUpgradePackage(target);
    setShowUpgradeModal(true);
  };

  const extensionPlans = {
    '6m': {
      title: 'Gia Hạn Thêm 6 Tháng',
      durationMonths: 6,
      price: 149000,
      priceFormatted: '149.000 đ',
      description: 'Lưu giữ kỷ niệm nửa năm sau đám cưới',
    },
    '12m': {
      title: 'Gia Hạn Thêm 1 Năm (12 Tháng)',
      durationMonths: 12,
      price: 249000,
      priceFormatted: '249.000 đ',
      badge: 'Phổ Biến Nhất',
      description: 'Trọn vẹn kỷ niệm ngày cưới đến lễ kỷ niệm 1 năm',
    },
    'lifetime': {
      title: 'Lưu Trữ Vĩnh Viễn (Trọn Đời)',
      durationMonths: 'LIFETIME' as const,
      price: 499000,
      priceFormatted: '499.000 đ',
      badge: 'Tiết Kiệm Nhất',
      description: 'Bảo lưu trọn đời làm album kỷ niệm mãi mãi không hết hạn',
    },
  };

  const currentPlan = extensionPlans[selectedPlan];
  const memoContent = `GIAHAN ${weddingData.orderCode || weddingData.slug || 'LAMOUR'} ${weddingData.customerPhone || leadOrder?.phone || ''}`.trim();
  const vietQrUrl =
    paymentConfig.useCustomQr && paymentConfig.customQrUrl
      ? paymentConfig.customQrUrl
      : `https://api.vietqr.io/image/${paymentConfig.bankCode}-${paymentConfig.accountNumber}-compact2.png?amount=${currentPlan.price}&addInfo=${encodeURIComponent(memoContent)}&accountName=${encodeURIComponent(paymentConfig.accountHolder)}`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Đã sao chép: ${text}`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmExtension = async () => {
    setIsProcessing(true);
    try {
      await submitExtensionRequest({
        orderCode: weddingData.orderCode || leadOrder?.id || 'LAMOUR',
        weddingId: weddingData.id,
        weddingSlug: weddingData.slug,
        customerName: `${weddingData.groomName || 'Chú rể'} & ${weddingData.brideName || 'Cô dâu'}`,
        customerPhone: weddingData.customerPhone || leadOrder?.phone || '',
        customerEmail: weddingData.customerEmail || leadOrder?.email || '',
        extensionMonths: currentPlan.durationMonths,
        extensionPlanTitle: currentPlan.title,
        price: currentPlan.price,
        currentPackage: currentPkgSlug,
        currentPackageName: packageName,
      });
      showToast('Đã gửi yêu cầu gia hạn thành công! Vui lòng hoàn tất chuyển khoản để Admin kiểm tra & duyệt.', 'success');
      setShowExtendModal(false);
      loadPendingRequests();
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi gửi yêu cầu gia hạn', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Package Info */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Gói Thiệp Đang Sử Dụng
              </span>
              {!isVip && (
                <button
                  type="button"
                  onClick={() => openUpgrade(isBasic ? 'premium' : 'vip')}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-linear-to-r from-[#FAF6EE] to-[#F5E8C7] hover:from-[#D4AF37] hover:to-[#B38F26] text-[#8C7335] hover:text-white border border-[#D4AF37]/50 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-white" />
                  <span>Nâng Cấp Gói</span>
                </button>
              )}
            </div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D4AF37]" />
              <span>{packageName}</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Mã đơn hàng: <strong className="font-mono text-neutral-800">{leadOrder?.id || weddingData.orderCode || 'LAMOUR-ACTIVE'}</strong>
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Trạng thái:</span>
            {pendingUpgrade?.status === 'PENDING' ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Chờ Duyệt Lên {pendingUpgrade.targetPackageName}</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{isVip ? 'Gói Cao Nhất' : 'Đã Kích Hoạt'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Expiry & Days Left */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Thời Hạn Lưu Trữ & Hiển Thị
              </span>
              <button
                onClick={() => setShowExtendModal(true)}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FAF6EE] hover:bg-[#D4AF37] text-[#8C7335] hover:text-white border border-[#D4AF37]/40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Gia Hạn Ngay</span>
              </button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#8C7335]">{daysLeft}</span>
              <span className="text-xs text-neutral-500">ngày sử dụng còn lại</span>
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Hết hạn ngày: <strong>{formatDate(weddingData.expiresAt)}</strong></span>
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Lưu trữ thiệp:</span>
            <button
              onClick={() => setShowExtendModal(true)}
              className="text-[#8C7335] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Gia hạn thêm</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Account & PIN */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Tài Khoản Quản Trị Của Bạn
            </span>
            <p className="text-xs text-neutral-600">
              Đăng nhập qua SĐT: <strong className="text-neutral-900">{weddingData.customerPhone || leadOrder?.phone || '0905 123 456'}</strong>
            </p>
            <p className="text-xs text-neutral-600">
              Mã PIN bảo mật: <strong className="font-mono text-sm text-[#8C7335] bg-[#FAF6EE] px-2 py-0.5 rounded-md border border-[#D4AF37]/30">{weddingData.accessPin || '1234'}</strong>
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 mt-4 text-[11px] text-neutral-400">
            Dùng mã đơn hoặc PIN để đăng nhập trên các thiết bị khác
          </div>
        </div>
      </div>

      {/* Live Wedding Album Capacity & Add-on Banner */}
      <div className="bg-linear-to-r from-[#FAF6EE] via-white to-[#FAF6EE] rounded-2xl border border-[#D4AF37]/40 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#8C7335] flex items-center justify-center font-bold">
              📸
            </span>
            <h4 className="font-serif-title font-bold text-base text-neutral-900">
              Dung Lượng Album Ảnh Cưới (Bộ Đếm Chung)
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white">
              BỘ ĐẾM CHUNG
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Hạn mức hiện tại:{' '}
            <strong className="text-neutral-900 font-mono text-sm">{quota.totalLimit} ảnh</strong>{' '}
            (Gói {quota.packageName}: {quota.baseQuota} ảnh gốc
            {quota.extraPurchased > 0 ? ` + ${quota.extraPurchased} ảnh mua thêm` : ''}).{' '}
            Đã dùng: <strong>{quota.currentCount} / {quota.totalLimit} ảnh</strong> (gồm {quota.galleryCount} ảnh kỷ niệm + {quota.liveAlbumCount} ảnh ngày cưới, còn lại {quota.remainingSlots} chỗ trống).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAlbumSlotsModal(true)}
          className="px-4 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
        >
          <Camera className="w-4 h-4 text-amber-200" />
          <span>Mua Thêm Ảnh Album (+25 / +60 / +150)</span>
        </button>
      </div>

      {/* Pending Extension Alert Banner */}
      {pendingExtension && pendingExtension.status === 'PENDING' && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-300/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4 animate-spin text-blue-800" />
              </div>
              <div>
                <h4 className="font-bold text-blue-950 text-sm">
                  Yêu Cầu Gia Hạn Lưu Trữ Đang Chờ Admin Duyệt
                </h4>
                <p className="text-xs text-blue-800">
                  Gói chọn: <strong className="text-blue-950 font-extrabold">{pendingExtension.extensionPlanTitle || pendingExtension.targetPackageName}</strong>
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-200 text-blue-950 border border-blue-400">
              {pendingExtension.upgradeAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="text-xs text-blue-900 bg-white/80 rounded-xl p-3 border border-blue-200 space-y-1">
            <p>
              Nội dung chuyển khoản đối soát: <strong className="font-mono font-bold text-neutral-900">{pendingExtension.transferMemo}</strong>
            </p>
            <p className="text-blue-700 text-[11px]">
              Thời hạn lưu trữ thiệp cưới sẽ được cộng thêm ngay khi Admin kiểm tra và phê duyệt thanh toán thành công.
            </p>
          </div>
        </div>
      )}

      {/* Pending Upgrade Alert Banner */}
      {pendingUpgrade && pendingUpgrade.status === 'PENDING' && (
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4 animate-spin text-amber-800" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-sm">
                  Yêu Cầu Nâng Cấp Gói Đang Chờ Admin Xác Nhận
                </h4>
                <p className="text-xs text-amber-800">
                  Nâng cấp từ <strong>{pendingUpgrade.currentPackageName}</strong> lên{' '}
                  <strong className="text-amber-900 font-extrabold">{pendingUpgrade.targetPackageName}</strong>
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-200 text-amber-900 border border-amber-400">
              +{pendingUpgrade.upgradeAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="text-xs text-amber-900 bg-white/70 rounded-xl p-3 border border-amber-200 space-y-1">
            <p>
              Nội dung chuyển khoản đối soát: <strong className="font-mono font-bold text-neutral-900">{pendingUpgrade.transferMemo}</strong>
            </p>
            <p className="text-amber-700 text-[11px]">
              Admin đang kiểm tra thông tin chuyển khoản và sẽ kích hoạt gói cho hai bạn trong vòng 5-15 phút.
            </p>
          </div>
        </div>
      )}

      {/* Package Upgrade Options Grid (Step 17 & User Request) */}
      {!isVip && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
            <div className="space-y-0.5">
              <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2 font-serif-title">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
                <span>Nâng Cấp Gói Dịch Vụ Cưới</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Chỉ cần thanh toán số tiền chênh lệch để mở khóa trọn bộ mẫu thiệp cao cấp & không giới hạn tính năng
              </p>
            </div>

            <span className="text-xs text-neutral-500 bg-[#FAF6EE] px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 text-center">
              Gói hiện tại: <strong className="text-[#8C7335]">{packageName}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan 1: Basic */}
            <div
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isBasic
                  ? 'border-[#D4AF37] bg-[#FAF6EE]/50 ring-1 ring-[#D4AF37]'
                  : 'border-neutral-200 bg-neutral-50/50 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-neutral-900 text-sm">Gói Cơ Bản (Basic)</h4>
                  {isBasic && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-white">
                      Gói Của Bạn
                    </span>
                  )}
                </div>
                <p className="text-xl font-extrabold text-neutral-900">299.000 đ</p>
                <p className="text-xs text-neutral-500">
                  Lưu trữ 6 tháng, 8+ mẫu thiệp chuẩn, RSVP cơ bản.
                </p>

                <ul className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>8+ mẫu thiệp tiêu chuẩn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lưu trữ thiệp 6 tháng</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>RSVP xác nhận tham dự</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-200">
                <button
                  type="button"
                  disabled
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-neutral-200 text-neutral-500 cursor-not-allowed text-center"
                >
                  {isBasic ? 'Đang Sử Dụng' : 'Gói Tiêu Chuẩn'}
                </button>
              </div>
            </div>

            {/* Plan 2: Premium */}
            <div
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative ${
                isPremium
                  ? 'border-[#D4AF37] bg-[#FAF6EE]/50 ring-2 ring-[#D4AF37] shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-[#D4AF37]/60 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-neutral-900 text-sm">Gói Cao Cấp (Premium)</h4>
                  {isPremium ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-white">
                      Gói Của Bạn
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF6EE] text-[#8C7335] border border-[#D4AF37]/30">
                      Phổ Biến
                    </span>
                  )}
                </div>
                <p className="text-xl font-extrabold text-[#8C7335]">499.000 đ</p>
                <p className="text-xs text-neutral-500">
                  Lưu trữ 1 năm, 20+ mẫu thiệp đa dạng, RSVP Realtime & Sổ lưu bút.
                </p>

                <ul className="space-y-1.5 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium">20+ mẫu thiệp cao cấp đa phong cách</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lưu trữ thiệp 12 tháng (1 năm)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sổ lưu bút & lời chúc phúc tương tác</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hiệu ứng mở phong bì điện ảnh</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-200">
                {isPremium ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-100 text-emerald-800 cursor-default text-center flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Gói Đang Hoạt Động</span>
                  </button>
                ) : isBasic ? (
                  <button
                    type="button"
                    onClick={() => openUpgrade('premium')}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white shadow-xs hover:shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Bù 200.000 đ • Nâng Cấp Ngay</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-400 cursor-default text-center"
                  >
                    Đã bao gồm trong VIP
                  </button>
                )}
              </div>
            </div>

            {/* Plan 3: VIP */}
            <div
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative ${
                isVip
                  ? 'border-purple-400 bg-purple-50/50 ring-2 ring-purple-300'
                  : 'border-purple-200 bg-linear-to-b from-white to-purple-50/20 hover:border-purple-400 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                    <span>Gói VIP (Thiết Kế Riêng)</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                    Trọn Đời
                  </span>
                </div>
                <p className="text-xl font-extrabold text-purple-900">799.000 đ</p>
                <p className="text-xs text-neutral-500">
                  Lưu trữ vĩnh viễn trọn đời, mở khóa 100% mẫu thiệp, hỗ trợ thiết kế riêng.
                </p>

                <ul className="space-y-1.5 text-xs text-neutral-700 pt-2 border-t border-neutral-200">
                  <li className="flex items-center gap-2 font-medium text-purple-950">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                    <span>Mở khóa 100% mọi mẫu thiệp không giới hạn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                    <span>Lưu trữ kỷ niệm trọn đời (Vĩnh viễn)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tùy biến phông chữ, ảnh nền theo ý muốn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                    <span>Chuyên viên L'Amour hỗ trợ 1:1 tận tình</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => openUpgrade('vip')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-linear-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white shadow-xs hover:shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>
                    {isBasic
                      ? 'Bù 500.000 đ • Lên Gói VIP'
                      : 'Bù 300.000 đ • Lên Gói VIP'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Features Included */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-neutral-900 text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Quyền Lợi & Tính Năng Đang Hoạt Động Của Bạn</span>
          </h3>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
            Đầy đủ bản quyền
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[
            { title: 'Hiệu ứng mở phong bì điện ảnh', desc: 'Trải nghiệm mở thiệp tương tác sáp niêm phong lãng mạn' },
            { title: 'Album ảnh cưới không giới hạn', desc: 'Tải ảnh sắc nét, phân loại khoảnh khắc và lễ cưới' },
            { title: 'Xác nhận tham dự (RSVP) Realtime', desc: 'Khách xác nhận đi bao nhiêu người trực tiếp trên thiệp' },
            { title: 'Sổ lưu bút & Lời chúc phúc', desc: 'Lưu giữ những lời chúc ý nghĩa từ bạn bè và người thân' },
            { title: 'Mã mừng cưới VietQR tức thì', desc: 'Khách quét mã chuyển khoản trực tiếp vào tài khoản hai bạn' },
            { title: 'Lịch sự kiện & Google Maps', desc: 'Đồng hồ đếm ngược và chỉ đường chính xác đến nhà hàng' },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <h4 className="text-xs font-bold text-neutral-900">{item.title}</h4>
              </div>
              <p className="text-[11px] text-neutral-500 pl-6 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Support Contact */}
      <div className="bg-[#FAF6EE] rounded-2xl border border-[#D4AF37]/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#D4AF37]/40 flex items-center justify-center text-[#B38F26] shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 text-sm">Cần hỗ trợ chỉnh sửa ảnh hoặc âm nhạc thiệp cưới?</h4>
            <p className="text-xs text-neutral-600 mt-0.5">
              Đội ngũ thiết kế L'Amour luôn đồng hành 24/7 để ngày vui của hai bạn hoàn hảo nhất.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={`https://zalo.me/${cleanZalo}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-bold text-center transition-colors shadow-xs"
          >
            Chat Zalo Hỗ Trợ
          </a>
          <a
            href={`tel:${cleanHotline}`}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs font-medium text-center transition-colors"
          >
            Gọi {displayHotline}
          </a>
        </div>
      </div>

      {/* Storage Extension Modal (Step 16) */}
      {showExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FAF6EE] text-[#8C7335] flex items-center justify-center border border-[#D4AF37]/40">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-neutral-900">
                    Gia Hạn Lưu Trữ Thiệp Cưới
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Tiếp tục lưu giữ thiệp cưới online và sổ lưu bút của hai bạn
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowExtendModal(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 block">
                Chọn gói thời gian gia hạn:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(Object.entries(extensionPlans) as [keyof typeof extensionPlans, typeof currentPlan][]).map(([key, plan]) => {
                  const isSelected = selectedPlan === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlan(key)}
                      className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#FAF6EE] ring-1 ring-[#D4AF37]'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#D4AF37] text-white">
                          {plan.badge}
                        </span>
                      )}
                      <p className="font-bold text-xs text-neutral-900 leading-snug">
                        {key === '6m' ? '+6 Tháng' : key === '12m' ? '+1 Năm' : 'Vĩnh Viễn'}
                      </p>
                      <p className="text-xs font-extrabold text-[#8C7335] mt-1">
                        {plan.priceFormatted}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic VietQR Payment Card */}
            <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center gap-5">
              <div className="shrink-0 bg-white p-2 rounded-xl shadow-xs border border-neutral-200">
                <img
                  src={vietQrUrl}
                  alt="VietQR Gia Hạn"
                  className="w-36 h-36 object-contain"
                />
              </div>

              <div className="space-y-2.5 text-xs w-full">
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
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-1.5 border-b border-[#D4AF37]/20">
                  <span className="text-neutral-500">Chủ tài khoản:</span>
                  <span className="font-semibold text-neutral-900">{paymentConfig.accountHolder}</span>
                </div>

                <div className="flex justify-between items-center pb-1.5 border-b border-[#D4AF37]/20">
                  <span className="text-neutral-500">Số tiền:</span>
                  <span className="font-extrabold text-[#8C7335] text-sm">{currentPlan.priceFormatted}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
                    <span>{memoContent}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(memoContent, 'memo')}
                      className="p-1 hover:text-[#D4AF37] text-neutral-400 cursor-pointer"
                    >
                      {copiedField === 'memo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowExtendModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmExtension}
                disabled={isProcessing}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isProcessing ? 'Đang xử lý...' : 'Tôi Đã Chuyển Khoản Gia Hạn'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Package Modal */}
      <PackageUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        weddingData={weddingData}
        leadOrder={leadOrder}
        initialTargetPackage={targetUpgradePackage}
        onUpgradeRequested={(req) => {
          setPendingUpgrade(req);
        }}
      />

      {/* Buy Extra Live Album Slots Modal */}
      {showAlbumSlotsModal && (
        <BuyExtraAlbumSlotsModal
          isOpen={showAlbumSlotsModal}
          onClose={() => setShowAlbumSlotsModal(false)}
          weddingData={weddingData}
          onSlotsPurchased={(updated) => {
            if (onDataSaved) onDataSaved(updated);
          }}
          onUpgradePackage={() => {
            setShowAlbumSlotsModal(false);
            openUpgrade(isBasic ? 'premium' : 'vip');
          }}
        />
      )}
    </div>
  );
}
