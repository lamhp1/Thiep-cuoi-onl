import React, { useState, useRef } from 'react';
import { PlatformPaymentConfig } from '../../types/commercial';
import { getPlatformPaymentConfig, savePlatformPaymentConfig } from '../../services/siteConfigService';
import {
  CreditCard,
  Save,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  Link as LinkIcon,
  Check,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { compressImageFile } from '../../lib/imageUtils';

export function PaymentSettingsTab() {
  const { showToast } = useToast();
  const [config, setConfig] = useState<PlatformPaymentConfig>(getPlatformPaymentConfig());
  const [testAmount, setTestAmount] = useState<number>(499000);
  const [testOrderCode, setTestOrderCode] = useState<string>('LAMOUR-TEST');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [showUrlBox, setShowUrlBox] = useState<boolean>(false);
  const [previewZoom, setPreviewZoom] = useState<boolean>(false);
  const [showChangeQrModal, setShowChangeQrModal] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'upload' | 'url'>('upload');
  const [modalUrlInput, setModalUrlInput] = useState<string>('');
  const [modalPreviewSrc, setModalPreviewSrc] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    savePlatformPaymentConfig(config);
    showToast('Đã lưu cấu hình tài khoản ngân hàng & mã QR nhận thanh toán thành công!', 'success');
  };

  // Handle uploading custom QR image file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WebP)', 'error');
      return;
    }

    try {
      setIsUploading(true);
      // Compress to avoid localStorage bloat while keeping high fidelity for QR scanning
      const base64Url = await compressImageFile(file, {
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.92,
        outputType: 'image/png',
      });

      const updated: PlatformPaymentConfig = {
        ...config,
        customQrUrl: base64Url,
        useCustomQr: true,
      };

      setConfig(updated);
      savePlatformPaymentConfig(updated);
      showToast('Đã tải lên và kích hoạt mã QR tùy chỉnh mới thành công!', 'success');
    } catch (err) {
      console.error('Lỗi khi tải ảnh mã QR:', err);
      showToast('Không thể xử lý ảnh, vui lòng thử lại bằng ảnh khác', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle applying image by URL
  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    const trimmed = urlInput.trim();
    const updated: PlatformPaymentConfig = {
      ...config,
      customQrUrl: trimmed,
      useCustomQr: true,
    };
    setConfig(updated);
    savePlatformPaymentConfig(updated);
    setUrlInput('');
    setShowUrlBox(false);
    showToast('Đã áp dụng link ảnh mã QR mới thành công!', 'success');
  };

  // Handle file chosen in Modal
  const handleModalFileSelect = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WebP)', 'error');
      return;
    }
    try {
      setIsUploading(true);
      const base64Url = await compressImageFile(file, {
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.92,
        outputType: 'image/png',
      });
      setModalPreviewSrc(base64Url);
    } catch (err) {
      console.error('Lỗi khi nén ảnh:', err);
      showToast('Không thể xử lý ảnh, vui lòng thử lại', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyModalQr = () => {
    const targetSrc = modalTab === 'upload' ? modalPreviewSrc : modalUrlInput.trim();
    if (!targetSrc) {
      showToast('Vui lòng tải lên ảnh hoặc nhập liên kết ảnh mã QR', 'error');
      return;
    }
    const updated: PlatformPaymentConfig = {
      ...config,
      customQrUrl: targetSrc,
      useCustomQr: true,
    };
    setConfig(updated);
    savePlatformPaymentConfig(updated);
    setShowChangeQrModal(false);
    setModalPreviewSrc('');
    setModalUrlInput('');
    showToast('Đã đổi và kích hoạt ảnh mã QR nhận tiền mới thành công!', 'success');
  };

  // Revert back to auto VietQR generator
  const handleRemoveCustomQr = () => {
    const updated: PlatformPaymentConfig = {
      ...config,
      customQrUrl: undefined,
      useCustomQr: false,
    };
    setConfig(updated);
    savePlatformPaymentConfig(updated);
    showToast('Đã xóa mã QR tùy chỉnh, quay lại VietQR tự động theo số tài khoản', 'info');
  };

  // Generate dynamic VietQR image URL
  const vietQrUrl = `https://api.vietqr.io/image/${config.bankCode}-${config.accountNumber}-${config.qrTemplate || 'compact2'}.jpg?accountName=${encodeURIComponent(
    config.accountHolder
  )}&amount=${testAmount}&addInfo=${encodeURIComponent(testOrderCode)}`;

  // Currently active displayed QR
  const activeQrSrc = config.useCustomQr && config.customQrUrl ? config.customQrUrl : vietQrUrl;

  return (
    <div className="space-y-6">
      {/* Hidden File Input for QR Code Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={modalFileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleModalFileSelect(e.target.files?.[0])}
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-neutral-900 text-base sm:text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#D4AF37]" />
            <span>Quản Lý Thanh Toán & Mã QR Ngân Hàng Nền Tảng</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cấu hình số tài khoản ngân hàng và mã QR nhận tiền chuyển khoản khi khách đặt mua gói thiệp cưới
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setModalTab('upload');
              setModalPreviewSrc(config.customQrUrl || '');
              setShowChangeQrModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-[#D4AF37] hover:text-[#F3DF95] text-xs font-bold shadow-xs transition-all cursor-pointer hover:shadow-md active:scale-95"
            title="Đổi ảnh mã QR nhận tiền chuyển khoản"
          >
            <Upload className="w-4 h-4" />
            <span>Đổi Ảnh Mã QR Khác</span>
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Cấu Hình</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bank Account Info & QR Selection Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Bank Account Details */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#D4AF37]" />
              <span>Thông Tin Tài Khoản Nhận Thanh Toán (Chủ Nền Tảng)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Ngân Hàng
                </label>
                <input
                  type="text"
                  value={config.bankName}
                  onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                  placeholder="VD: Vietcombank (VCB)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Mã Ngân Hàng (VietQR Bank Code)
                </label>
                <input
                  type="text"
                  value={config.bankCode}
                  onChange={(e) => setConfig({ ...config, bankCode: e.target.value.toUpperCase() })}
                  placeholder="VD: VCB, MB, TCB, VPB, TPB, BIDV, CTG..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 uppercase font-mono focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Số Tài Khoản
                </label>
                <input
                  type="text"
                  value={config.accountNumber}
                  onChange={(e) => setConfig({ ...config, accountNumber: e.target.value.replace(/\s+/g, '') })}
                  placeholder="VD: 1028394857"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 font-mono text-neutral-900 font-bold focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Tên Chủ Tài Khoản (In hoa không dấu)
                </label>
                <input
                  type="text"
                  value={config.accountHolder}
                  onChange={(e) => setConfig({ ...config, accountHolder: e.target.value.toUpperCase() })}
                  placeholder="VD: HOANG THI BICH LAM"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 uppercase font-bold text-neutral-900 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Chi Nhánh
                </label>
                <input
                  type="text"
                  value={config.branch || ''}
                  onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                  placeholder="VD: Chi nhánh Thăng Long, Hà Nội"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Tiền Tố Cú Pháp Chuyển Khoản
                </label>
                <input
                  type="text"
                  value={config.transferPrefix}
                  onChange={(e) => setConfig({ ...config, transferPrefix: e.target.value.toUpperCase() })}
                  placeholder="VD: LAMOUR"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 uppercase font-mono focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-neutral-700 block">
                Ghi chú hướng dẫn khách hàng chuyển khoản
              </label>
              <textarea
                rows={2}
                value={config.note || ''}
                onChange={(e) => setConfig({ ...config, note: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Card 2: QR Code Mode & Image Management */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#D4AF37]" />
                  <span>Cài Đặt Ảnh Mã QR Thanh Toán</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Lựa chọn dùng mã VietQR tự động hoặc tải lên ảnh mã QR riêng của bạn
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                  config.useCustomQr && config.customQrUrl
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    config.useCustomQr && config.customQrUrl ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                <span>
                  {config.useCustomQr && config.customQrUrl
                    ? 'Đang dùng Ảnh QR Tùy Chỉnh'
                    : 'Đang dùng VietQR Tự Động'}
                </span>
              </span>
            </div>

            {/* Mode Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Auto VietQR */}
              <button
                type="button"
                onClick={() => {
                  const updated = { ...config, useCustomQr: false };
                  setConfig(updated);
                  savePlatformPaymentConfig(updated);
                  showToast('Đã chuyển sang chế độ VietQR tự động theo số tài khoản', 'info');
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  !config.useCustomQr || !config.customQrUrl
                    ? 'border-[#D4AF37] bg-[#FAF6EE] ring-2 ring-[#D4AF37]/30 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>VietQR Tự Động (Khuyên Dùng)</span>
                  </div>
                  {(!config.useCustomQr || !config.customQrUrl) && (
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
                  Tự động sinh mã VietQR theo chuẩn NAPAS 247, tự điền sẵn số tiền theo gói thiệp và mã đơn hàng của khách.
                </p>
              </button>

              {/* Option 2: Custom QR Upload */}
              <button
                type="button"
                onClick={() => {
                  if (!config.customQrUrl) {
                    fileInputRef.current?.click();
                  } else {
                    const updated = { ...config, useCustomQr: true };
                    setConfig(updated);
                    savePlatformPaymentConfig(updated);
                    showToast('Đã kích hoạt ảnh mã QR tùy chỉnh', 'success');
                  }
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                  config.useCustomQr && config.customQrUrl
                    ? 'border-[#D4AF37] bg-[#FAF6EE] ring-2 ring-[#D4AF37]/30 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>Ảnh Mã QR Tùy Chỉnh</span>
                  </div>
                  {config.useCustomQr && config.customQrUrl && (
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
                  Tải lên ảnh mã QR từ ngân hàng (VietinBank, Techcombank...), ví MoMo, ZaloPay hoặc mã QR in sẵn của bạn.
                </p>
              </button>
            </div>

            {/* Custom QR Upload & Management Zone */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-neutral-800 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Quản Lý Ảnh Mã QR Tùy Chỉnh</span>
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Hỗ trợ tệp PNG, JPG, WebP. Ảnh sẽ được tự động tối ưu để quét nhanh nhất.
                  </p>
                </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setModalTab('upload');
                  setModalPreviewSrc(config.customQrUrl || '');
                  setShowChangeQrModal(true);
                }}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-[#D4AF37] hover:text-[#F3DF95] text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{config.customQrUrl ? 'Đổi Ảnh Mã QR Khác' : 'Thêm / Đổi Ảnh Mã QR Khác'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalTab('upload');
                  modalFileInputRef.current?.click();
                }}
                disabled={isUploading}
                className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-neutral-500" />
                <span>Chọn Tệp Từ Máy</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlBox(!showUrlBox)}
                className="px-3 py-2 rounded-xl bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5 text-neutral-500" />
                <span>Dán Link URL</span>
              </button>
            </div>
              </div>

              {/* URL Input Box (Collapsible) */}
              {showUrlBox && (
                <div className="p-3 bg-white rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-2 animate-fadeIn">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Dán đường dẫn ảnh mã QR (https://...)"
                    className="flex-1 w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Áp Dụng
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlBox(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* If Custom QR Exists: Show card & options */}
              {config.customQrUrl ? (
                <div className="p-3.5 bg-white rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative group w-16 h-16 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                      <img
                        src={config.customQrUrl}
                        alt="Custom QR Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewZoom(true)}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Xem ảnh lớn"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900">
                          Ảnh Mã QR Đang Được Lưu
                        </span>
                        {config.useCustomQr ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Đang áp dụng
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                            Đang tạm dừng
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {config.useCustomQr
                          ? 'Khách đặt thiệp sẽ quét trực tiếp mã QR này khi chuyển khoản'
                          : 'Bạn đang chọn VietQR tự động, nhấn Kích hoạt để dùng mã này'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    {!config.useCustomQr && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...config, useCustomQr: true };
                          setConfig(updated);
                          savePlatformPaymentConfig(updated);
                          showToast('Đã kích hoạt ảnh mã QR này', 'success');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Kích Hoạt Dùng
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Đổi Ảnh Khác
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveCustomQr}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Xóa ảnh này và quay lại VietQR tự động"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa Ảnh QR</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-neutral-300 hover:border-[#D4AF37] rounded-xl bg-white text-center cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] group-hover:scale-110 flex items-center justify-center mx-auto mb-2 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-neutral-800">
                    Nhấn vào đây để tải lên ảnh mã QR của bạn
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Hỗ trợ ảnh QR từ App ngân hàng, MoMo, ZaloPay, ViettelPay...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live QR Preview as Seen by Guests */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 flex flex-col items-center justify-between text-center">
          <div className="space-y-3 w-full">
            <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-3 flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Xem Trước Mã QR Hiển Thị Cho Khách</span>
            </h3>

            <div className="flex items-center justify-center gap-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  config.useCustomQr && config.customQrUrl
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {config.useCustomQr && config.customQrUrl
                  ? 'Mã QR Tùy Chỉnh (Custom)'
                  : 'VietQR Tự Động (NAPAS 247)'}
              </span>
            </div>

            <p className="text-[11px] text-neutral-500">
              Đây là hình ảnh mã QR thực tế khách hàng sẽ thấy và quét khi thanh toán đơn đặt thiệp
            </p>

            {/* QR Image Box */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 inline-block mx-auto mt-1 relative group">
              <img
                src={activeQrSrc}
                alt="QR Payment Preview"
                className="w-52 h-52 object-contain rounded-xl mx-auto shadow-sm bg-white"
              />

              {/* Hover Zoom Overlay */}
              <button
                type="button"
                onClick={() => setPreviewZoom(true)}
                className="absolute inset-0 bg-black/40 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1"
              >
                <Eye className="w-6 h-6" />
                <span className="text-xs font-semibold">Xem Phóng To</span>
              </button>
            </div>

            {/* Quick Change Button directly under preview */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setModalTab('upload');
                  setModalPreviewSrc(config.customQrUrl || '');
                  setShowChangeQrModal(true);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer hover:scale-105"
                title="Thay đổi sang hình ảnh mã QR khác"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Đổi Ảnh Mã QR Khác</span>
              </button>

              <button
                type="button"
                onClick={() => modalFileInputRef.current?.click()}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Chọn tệp ảnh nhanh từ máy tính hoặc điện thoại"
              >
                <ImageIcon className="w-3.5 h-3.5 text-neutral-600" />
                <span>Tải Từ Máy</span>
              </button>

              {config.customQrUrl && (
                <button
                  type="button"
                  onClick={() => {
                    const newUse = !config.useCustomQr;
                    const updated = { ...config, useCustomQr: newUse };
                    setConfig(updated);
                    savePlatformPaymentConfig(updated);
                    showToast(
                      newUse ? 'Đã bật mã QR tùy chỉnh' : 'Đã chuyển về VietQR tự động',
                      'info'
                    );
                  }}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  {config.useCustomQr ? 'Dùng VietQR' : 'Dùng Ảnh Tải Lên'}
                </button>
              )}
            </div>

            {/* Bank details below QR */}
            <div className="text-xs text-neutral-700 space-y-0.5 pt-2 bg-neutral-50/70 p-3 rounded-xl border border-neutral-100">
              <p className="font-bold text-neutral-900">{config.accountHolder}</p>
              <p className="font-mono text-neutral-700 font-semibold">{config.accountNumber}</p>
              <p className="text-[11px] text-neutral-500">{config.bankName}</p>
            </div>

            {/* Simulated Order Info for Test */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/60 text-left space-y-2">
              <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">
                Mô Phỏng Thử Nghiệm
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-neutral-400 block">Số tiền mẫu</label>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs rounded border border-neutral-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block">Mã đơn mẫu</label>
                  <input
                    type="text"
                    value={testOrderCode}
                    onChange={(e) => setTestOrderCode(e.target.value.toUpperCase())}
                    className="w-full px-2 py-1 text-xs rounded border border-neutral-200 bg-white uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-neutral-100 text-[11px] text-emerald-700 font-medium flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đã sẵn sàng nhận thanh toán trên toàn hệ thống</span>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal for QR Image */}
      {previewZoom && (
        <div
          onClick={() => setPreviewZoom(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-3xl max-w-sm w-full space-y-4 text-center shadow-2xl animate-scaleUp"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#D4AF37]" />
                <span>Mã QR Thanh Toán</span>
              </h4>
              <button
                type="button"
                onClick={() => setPreviewZoom(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              <img
                src={activeQrSrc}
                alt="Enlarged QR"
                className="w-full h-auto object-contain rounded-xl mx-auto"
              />
            </div>

            <div className="text-xs text-neutral-600 space-y-1">
              <p className="font-bold text-neutral-900 text-sm">{config.accountHolder}</p>
              <p className="font-mono font-semibold">{config.accountNumber} — {config.bankName}</p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreviewZoom(false);
                  setModalTab('upload');
                  setModalPreviewSrc(config.customQrUrl || '');
                  setShowChangeQrModal(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Đổi Ảnh QR Khác</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewZoom(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change QR Modal (Step 1 requirement: Đổi ảnh để add mã QR khác vào) */}
      {showChangeQrModal && (
        <div
          onClick={() => setShowChangeQrModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-scaleUp max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border border-[#D4AF37]/50 flex items-center justify-center text-[#B38F26]">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                    Đổi Ảnh Mã QR Thanh Toán Khác
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Tải lên hoặc dán link ảnh mã QR tài khoản ngân hàng mới
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowChangeQrModal(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switch: Upload File vs Paste URL */}
            <div className="flex items-center p-1 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => setModalTab('upload')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  modalTab === 'upload'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Tải Ảnh Từ Máy</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('url')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  modalTab === 'url'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Dán Link Ảnh (URL)</span>
              </button>
            </div>

            {/* Tab 1: File Upload */}
            {modalTab === 'upload' && (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleModalFileSelect(file);
                  }}
                  onClick={() => modalFileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#D4AF37] bg-[#FAF6EE]/80 scale-[1.01]'
                      : 'border-neutral-300 hover:border-[#D4AF37] bg-neutral-50/50 hover:bg-[#FAF6EE]/30'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#B38F26] flex items-center justify-center mx-auto mb-2">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-neutral-800">
                    Kéo thả ảnh mã QR vào đây hoặc bấm để chọn tệp
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Hỗ trợ định dạng PNG, JPG, JPEG, WebP (Tự động nén tối ưu)
                  </p>
                  <div className="mt-3">
                    <span className="inline-block px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-[11px] font-semibold transition-colors">
                      {isUploading ? 'Đang xử lý ảnh...' : 'Duyệt ảnh từ thiết bị'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: URL Input */}
            {modalTab === 'url' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Đường dẫn ảnh mã QR trực tuyến:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={modalUrlInput}
                    onChange={(e) => setModalUrlInput(e.target.value)}
                    placeholder="https://example.com/qr-code.png"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!modalUrlInput.trim()) {
                        showToast('Vui lòng nhập đường dẫn URL ảnh', 'error');
                        return;
                      }
                      setModalPreviewSrc(modalUrlInput.trim());
                      showToast('Đã tải xem trước ảnh từ link URL', 'info');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer"
                  >
                    Xem thử
                  </button>
                </div>
              </div>
            )}

            {/* Preview of the Chosen QR Code */}
            {modalPreviewSrc && (
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-600 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Xem trước mã QR mới chọn:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setModalPreviewSrc('');
                      setModalUrlInput('');
                    }}
                    className="text-red-500 hover:text-red-700 text-[11px] font-medium cursor-pointer"
                  >
                    Hủy ảnh này
                  </button>
                </div>
                <div className="p-2 bg-white rounded-xl border border-neutral-200/80 inline-block w-full text-center">
                  <img
                    src={modalPreviewSrc}
                    alt="New QR preview"
                    className="w-40 h-40 object-contain mx-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowChangeQrModal(false)}
                className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={handleApplyModalQr}
                disabled={!modalPreviewSrc && !modalUrlInput.trim()}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Lưu & Áp Dụng Mã QR Mới Này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
