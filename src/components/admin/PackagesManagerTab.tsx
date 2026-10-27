import React, { useState, useEffect } from 'react';
import { CommercialPackage } from '../../types/commercial';
import { DEFAULT_COMMERCIAL_PACKAGES } from '../../data/commercialDefaults';
import { savePackagesConfig } from '../../services/siteConfigService';
import { getCommercialPackages } from '../../services/packageService';
import {
  Package,
  Check,
  Save,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Tag,
  Clock,
  RotateCcw,
  Eye,
  ArrowUp,
  ArrowDown,
  Layers,
  HelpCircle,
  Camera,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export function PackagesManagerTab() {
  const { showToast } = useToast();
  const [packages, setPackages] = useState<CommercialPackage[]>(() => {
    try {
      const raw = localStorage.getItem('lamour_commercial_packages');
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_COMMERCIAL_PACKAGES;
  });

  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    getCommercialPackages()
      .then((remote) => {
        if (remote && remote.length > 0) {
          setPackages(remote);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdatePackage = (pkgId: string, partial: Partial<CommercialPackage>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, ...partial } : p))
    );
  };

  const handlePriceChange = (pkgId: string, price: number, originalPrice?: number) => {
    const updated = packages.map((p) =>
      p.id === pkgId ? { ...p, price, ...(originalPrice !== undefined ? { originalPrice } : {}) } : p
    );
    setPackages(updated);
  };

  const handleFeatureChange = (pkgId: string, featIndex: number, newValue: string) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== pkgId) return p;
        const newFeatures = [...p.features];
        newFeatures[featIndex] = newValue;
        return { ...p, features: newFeatures };
      })
    );
  };

  const handleAddFeature = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== pkgId) return p;
        return { ...p, features: [...p.features, 'Quyền lợi mới'] };
      })
    );
  };

  const handleRemoveFeature = (pkgId: string, featIndex: number) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== pkgId) return p;
        const newFeatures = p.features.filter((_, idx) => idx !== featIndex);
        return { ...p, features: newFeatures };
      })
    );
  };

  const handleMoveFeature = (pkgId: string, featIndex: number, direction: 'up' | 'down') => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== pkgId) return p;
        const targetIdx = direction === 'up' ? featIndex - 1 : featIndex + 1;
        if (targetIdx < 0 || targetIdx >= p.features.length) return p;
        const newFeatures = [...p.features];
        const temp = newFeatures[featIndex];
        newFeatures[featIndex] = newFeatures[targetIdx];
        newFeatures[targetIdx] = temp;
        return { ...p, features: newFeatures };
      })
    );
  };

  const handleTogglePopular = (pkgId: string) => {
    const updated = packages.map((p) =>
      p.id === pkgId ? { ...p, isPopular: !p.isPopular } : p
    );
    setPackages(updated);
  };

  const handleToggleActive = (pkgId: string) => {
    const updated = packages.map((p) =>
      p.id === pkgId ? { ...p, active: !p.active } : p
    );
    setPackages(updated);
  };

  const handleAddPackage = () => {
    const newId = `pkg-custom-${Date.now().toString(36)}`;
    const newPkg: CommercialPackage = {
      id: newId,
      slug: `custom-${packages.length + 1}`,
      name: `Gói Mới ${packages.length + 1}`,
      price: 599000,
      originalPrice: 899000,
      badge: 'GÓI MỚI',
      isPopular: false,
      durationMonths: 12,
      albumPhotoLimit: 60,
      description: 'Mô tả dịch vụ và quyền lợi hấp dẫn cho gói thiệp cưới này.',
      features: [
        'Toàn quyền chọn tất cả mẫu thiệp cưới',
        'Thời hạn lưu trữ 12 tháng',
        'Album ảnh cưới: 60 ảnh (Bộ đếm chung kỷ niệm & ngày cưới, có thể mua thêm)',
        'Nhạc nền & hiệu ứng mở phong bì điện ảnh',
        'Hỗ trợ khách mời gửi mừng cưới VietQR & RSVP',
      ],
      active: true,
    };
    setPackages([...packages, newPkg]);
    showToast('Đã thêm 1 gói thiệp cưới mới!', 'success');
  };

  const handleRemovePackage = (pkgId: string, pkgName: string) => {
    if (packages.length <= 1) {
      showToast('Cần duy trì tối thiểu 1 gói thiệp trên hệ thống!', 'error');
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa "${pkgName}" không?`)) {
      setPackages(packages.filter((p) => p.id !== pkgId));
      showToast(`Đã xóa gói "${pkgName}"`, 'info');
    }
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        'Bạn có chắc chắn muốn khôi phục về 3 gói thiệp cưới mặc định ban đầu không? Tất cả các chỉnh sửa text và giá tùy chỉnh sẽ được thiết lập lại.'
      )
    ) {
      setPackages(DEFAULT_COMMERCIAL_PACKAGES);
      savePackagesConfig(DEFAULT_COMMERCIAL_PACKAGES);
      showToast('Đã khôi phục bảng giá và nội dung về mặc định ban đầu!', 'success');
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      savePackagesConfig(packages);
      showToast('Đã lưu cấu hình bảng giá và toàn bộ nội dung gói thiệp thành công!', 'success');
    } catch {
      showToast('Có lỗi xảy ra khi lưu cấu hình gói thiệp!', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 text-[#8C7335] flex items-center justify-center">
              <Package className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-base sm:text-lg flex items-center gap-2">
                <span>Quản Lý Sản Phẩm & Gói Thiệp Cưới</span>
                <span className="text-[11px] font-semibold bg-[#FAF6EE] text-[#8C7335] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
                  {packages.length} gói
                </span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Cho phép chỉnh sửa toàn diện: <strong>Tên gói</strong>, <strong>Huy hiệu (Badge)</strong>, <strong>Thời hạn</strong>, <strong>Giá bán</strong>, <strong>Lời dẫn mô tả</strong> và <strong>Từng quyền lợi trong gói</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
          {/* Mode Switcher */}
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isPreviewMode
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-neutral-500" />}
            <span>{isPreviewMode ? 'Chuyển Sang Sửa Text' : 'Xem Trước Thẻ'}</span>
          </button>

          {/* Add Package */}
          <button
            type="button"
            onClick={handleAddPackage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-neutral-200 hover:border-[#D4AF37] hover:text-[#8C7335] text-neutral-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Thêm một gói thiệp cưới mới"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Thêm Gói Mới</span>
          </button>

          {/* Reset Defaults */}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:border-red-300 hover:text-red-600 text-neutral-500 text-xs font-medium transition-all cursor-pointer shadow-2xs"
            title="Khôi phục về nội dung gói mặc định ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khôi phục mặc định</span>
          </button>

          {/* Save All */}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu Cấu Hình Gói'}</span>
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      <div className="bg-[#FAF6EE]/80 border border-[#D4AF37]/30 rounded-2xl p-4 text-xs text-[#8C7335] flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
        <div className="space-y-1 text-neutral-700">
          <p className="font-semibold text-neutral-900">
            Mẹo chỉnh sửa nội dung gói thiệp:
          </p>
          <p>
            Bạn có thể chỉnh sửa trực tiếp <strong>Tên gói</strong>, <strong>Huy hiệu</strong>, <strong>Mô tả</strong> và <strong>Danh sách quyền lợi</strong> ở các ô bên dưới. Bấm nút <strong>"+ Thêm dòng"</strong> để bổ sung tính năng mới cho gói, hoặc bấm biểu tượng thùng rác để xóa bớt. Sau khi chỉnh sửa xong, hãy bấm <strong>"Lưu Cấu Hình Gói"</strong> để áp dụng ngay lên toàn bộ Website.
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-xs transition-all relative ${
              pkg.isPopular ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/25' : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {/* Top Badge (Preview or Edit) */}
            <div className="mb-3 flex items-center justify-between gap-2">
              {isPreviewMode ? (
                <div>
                  {pkg.badge ? (
                    <span className="bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs inline-block">
                      {pkg.badge}
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-400 italic">Không có huy hiệu</span>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#D4AF37]" />
                      <span>Huy hiệu đầu thẻ</span>
                    </label>
                    {pkg.badge && (
                      <span className="text-[9px] bg-[#D4AF37]/15 text-[#8C7335] px-1.5 py-0.5 rounded font-mono">
                        Xem thử: {pkg.badge}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={pkg.badge || ''}
                    onChange={(e) => handleUpdatePackage(pkg.id, { badge: e.target.value })}
                    placeholder="VD: TIẾT KIỆM, KHUYÊN DÙNG 85% CẶP ĐÔI..."
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-neutral-800 bg-[#FAF6EE]/70 border border-[#D4AF37]/40 rounded-lg focus:outline-hidden focus:border-[#D4AF37] focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* Status active/inactive badge */}
              <div className="shrink-0 self-start">
                <button
                  type="button"
                  onClick={() => handleToggleActive(pkg.id)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold cursor-pointer transition-colors ${
                    pkg.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                  title="Bấm để bật/tắt hiển thị gói này trên website"
                >
                  {pkg.active ? '✓ Kích hoạt' : '🔒 Tạm ẩn'}
                </button>
              </div>
            </div>

            {/* Package Body */}
            <div className="space-y-4">
              {/* Package Name & Duration & Album Photo Limit */}
              {isPreviewMode ? (
                <div className="border-b border-neutral-100 pb-3 space-y-1">
                  <h3 className="font-bold text-neutral-900 text-lg">{pkg.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Thời hạn: <strong>{pkg.durationMonths} tháng</strong></span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-neutral-700">
                      <Camera className="w-3.5 h-3.5 text-[#B38F26]" />
                      <span>
                        Ảnh album:{' '}
                        <strong className="text-[#8C7335]">
                          {pkg.albumPhotoLimit || (pkg.slug === 'vip' ? 100 : pkg.slug === 'premium' ? 50 : 20)} ảnh
                        </strong>
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 border-b border-neutral-100 pb-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Tên gói thiệp
                    </label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => handleUpdatePackage(pkg.id, { name: e.target.value })}
                      placeholder="VD: Gói Cao Cấp (Premium)"
                      className="w-full px-3 py-1.5 text-sm font-bold text-neutral-900 bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center justify-between gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      <span className="text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Thời hạn:</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={pkg.durationMonths}
                          onChange={(e) =>
                            handleUpdatePackage(pkg.id, {
                              durationMonths: Math.max(1, Number(e.target.value) || 1),
                            })
                          }
                          className="w-14 px-2 py-1 text-xs font-bold text-center border border-neutral-200 bg-white rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                        />
                        <span className="text-[11px] font-semibold text-neutral-700">tháng</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      <span className="text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#B38F26]" />
                        <span>Ảnh album (chung):</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="5"
                          max="500"
                          value={
                            pkg.albumPhotoLimit ||
                            (pkg.slug === 'vip' ? 100 : pkg.slug === 'premium' ? 60 : 40)
                          }
                          onChange={(e) =>
                            handleUpdatePackage(pkg.id, {
                              albumPhotoLimit: Math.max(1, Number(e.target.value) || 40),
                            })
                          }
                          className="w-14 px-2 py-1 text-xs font-bold text-center border border-neutral-200 bg-white rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                        />
                        <span className="text-[11px] font-semibold text-neutral-700">ảnh</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Editor Inputs */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-neutral-600 block mb-0.5">
                    Giá khuyến mãi (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={pkg.price}
                    onChange={(e) => handlePriceChange(pkg.id, Number(e.target.value), pkg.originalPrice)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white font-bold text-neutral-900 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-neutral-600 block mb-0.5">
                    Giá gốc niêm yết (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={pkg.originalPrice || pkg.price}
                    onChange={(e) => handlePriceChange(pkg.id, pkg.price, Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white text-neutral-600 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Description / Slogan Editor */}
              {isPreviewMode ? (
                <p className="text-xs text-neutral-600 leading-relaxed italic bg-neutral-50/60 p-2.5 rounded-xl border border-neutral-100">
                  "{pkg.description}"
                </p>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Mô tả / Slogan gói
                    </label>
                    <span className="text-[10px] text-neutral-400 italic">Chữ nghiêng trên thẻ</span>
                  </div>
                  <textarea
                    rows={2}
                    value={pkg.description}
                    onChange={(e) => handleUpdatePackage(pkg.id, { description: e.target.value })}
                    placeholder="VD: Trải nghiệm đỉnh cao với hiệu ứng âm nhạc lãng mạn, đếm ngược ngày cưới..."
                    className="w-full px-3 py-2 text-xs text-neutral-700 italic bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37] resize-none transition-all"
                  />
                </div>
              )}

              {/* Features List (Quyền lợi) */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Quyền lợi trong gói ({pkg.features.length})</span>
                  </span>

                  {!isPreviewMode && (
                    <button
                      type="button"
                      onClick={() => handleAddFeature(pkg.id)}
                      className="text-[11px] font-semibold text-[#8C7335] hover:text-[#D4AF37] bg-[#FAF6EE] hover:bg-[#FAF6EE]/80 px-2.5 py-1 rounded-md border border-[#D4AF37]/30 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm dòng</span>
                    </button>
                  )}
                </div>

                {isPreviewMode ? (
                  <ul className="space-y-1.5 pt-1">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {pkg.features.length === 0 ? (
                      <div className="text-center py-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-neutral-400 text-xs">
                        Chưa có quyền lợi nào. Bấm <strong>"Thêm dòng"</strong> để thêm quyền lợi mới.
                      </div>
                    ) : (
                      pkg.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 group bg-neutral-50/80 p-1.5 rounded-lg border border-neutral-200/70 hover:border-neutral-300 hover:bg-white transition-all"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => handleFeatureChange(pkg.id, idx, e.target.value)}
                            placeholder="Nhập nội dung quyền lợi..."
                            className="flex-1 text-xs text-neutral-800 bg-transparent px-1.5 py-0.5 focus:bg-white focus:outline-hidden rounded border border-transparent focus:border-[#D4AF37] transition-all"
                          />

                          <div className="flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveFeature(pkg.id, idx, 'up')}
                              className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 cursor-pointer"
                              title="Chuyển lên trên"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === pkg.features.length - 1}
                              onClick={() => handleMoveFeature(pkg.id, idx, 'down')}
                              className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 cursor-pointer"
                              title="Chuyển xuống dưới"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(pkg.id, idx)}
                              className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer transition-colors"
                              title="Xóa quyền lợi này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-4 border-t border-neutral-100 mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePopular(pkg.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    pkg.isPopular
                      ? 'border-[#D4AF37] text-[#8C7335] bg-[#FAF6EE] shadow-2xs'
                      : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                  }`}
                  title="Đánh dấu gói này là Gói Bán Chạy nhất trên trang chủ"
                >
                  {pkg.isPopular ? '★ Gói Bán Chạy' : 'Đặt làm Bán Chạy'}
                </button>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block line-through">
                    {pkg.originalPrice && pkg.originalPrice > pkg.price
                      ? formatCurrency(pkg.originalPrice)
                      : ''}
                  </span>
                  <span className="text-sm font-bold text-emerald-700">
                    {formatCurrency(pkg.price)}
                  </span>
                </div>
              </div>

              {/* Remove Package Button if custom or multiple */}
              {packages.length > 1 && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleRemovePackage(pkg.id, pkg.name)}
                    className="text-[11px] text-neutral-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa gói thiệp này</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
