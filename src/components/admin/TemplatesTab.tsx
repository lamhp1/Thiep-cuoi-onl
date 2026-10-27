import React, { useState, useEffect } from 'react';
import { WeddingData, TemplateId, TemplateTheme } from '../../types';
import { Lead } from '../../types/commercial';
import {
  TEMPLATES,
  getPlanTierLevel,
  getPlanTierName,
  isTemplateAllowedForPlan,
  getEffectiveTemplateThemes,
} from '../../data/templates';
import { getCommercialTemplatesSync } from '../../services/templateService';
import { getSiteContentConfig, fetchSiteContentConfigFromFirestore, updateWeddingInRegistry } from '../../services/siteConfigService';
import { saveWeddingData } from '../../services/weddingService';
import { updateLeadTemplate } from '../../services/leadService';
import { SiteContentConfig } from '../../types/commercial';
import {
  Check,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
  ExternalLink,
  Crown,
  Layers,
  Palette,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface TemplatesTabProps {
  data: WeddingData;
  leadOrder?: Lead | null;
  isAdmin?: boolean;
  onChange: (data: WeddingData) => void;
  onUpgradePackage?: () => void;
}

export function TemplatesTab({
  data,
  leadOrder,
  isAdmin = false,
  onChange,
  onUpgradePackage,
}: TemplatesTabProps) {
  const { showToast } = useToast();

  const [commercialTemplates, setCommercialTemplates] = useState(() => getCommercialTemplatesSync());
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

  useEffect(() => {
    const handleUpdate = () => {
      setCommercialTemplates(getCommercialTemplatesSync());
    };
    window.addEventListener('lamour_commercial_templates_updated', handleUpdate);
    return () => {
      window.removeEventListener('lamour_commercial_templates_updated', handleUpdate);
    };
  }, []);

  const dynamicTemplates = getEffectiveTemplateThemes(commercialTemplates);

  // Determine active plan by taking the maximum tier among all available sources
  const planCandidates = [
    data.packageId,
    data.packageName,
    leadOrder?.package,
  ].filter(Boolean) as string[];

  const currentPlanLevel =
    planCandidates.length > 0
      ? Math.max(...planCandidates.map((p) => getPlanTierLevel(p)))
      : 1;

  const currentPlanIdentifier =
    currentPlanLevel >= 3 ? 'vip' : currentPlanLevel === 2 ? 'premium' : 'basic';

  const currentPlanName =
    data.packageName && getPlanTierLevel(data.packageName) === currentPlanLevel
      ? data.packageName
      : getPlanTierName(currentPlanLevel);

  // Filter state
  const [filterMode, setFilterMode] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [lockedModalTemplate, setLockedModalTemplate] = useState<TemplateTheme | null>(null);

  const handleSelectTemplate = (id: TemplateId) => {
    const tmpl = dynamicTemplates[id];
    if (!tmpl) return;

    // Check plan restriction for couples (admin bypasses restriction)
    const isAllowed =
      isAdmin || isTemplateAllowedForPlan(id, currentPlanIdentifier, data.template, commercialTemplates);

    if (!isAllowed) {
      handleLockedTemplateClick(tmpl);
      return;
    }

    const updatedWedding: WeddingData = {
      ...data,
      template: id,
      updatedAt: new Date().toISOString(),
    };

    onChange(updatedWedding);

    // Persist immediately to registry, localStorage, Firestore and lead order
    try {
      updateWeddingInRegistry(updatedWedding);
      saveWeddingData(updatedWedding).catch((e) => console.warn('Auto-save template warning:', e));
      const orderCode = leadOrder?.id || updatedWedding.orderCode;
      if (orderCode) {
        updateLeadTemplate(orderCode, id).catch(() => {});
      }
      if (typeof window !== 'undefined') {
        if (updatedWedding.slug) {
          localStorage.setItem(`lamour_wedding_data_${updatedWedding.slug}`, JSON.stringify(updatedWedding));
          localStorage.setItem(`lamour_wedding_data_wedding-${updatedWedding.slug}`, JSON.stringify(updatedWedding));
          localStorage.setItem('lamour_last_active_slug', updatedWedding.slug);
        }
        if (orderCode) {
          localStorage.setItem(`lamour_wedding_data_${orderCode}`, JSON.stringify(updatedWedding));
        }
        if (leadOrder?.id) {
          localStorage.setItem(`lamour_wedding_data_${leadOrder.id}`, JSON.stringify(updatedWedding));
        }
      }
    } catch {}

    showToast(`Đã áp dụng mẫu giao diện: ${tmpl.name}`, 'success');
  };

  const handleLockedTemplateClick = (tmpl: TemplateTheme) => {
    showToast(
      `Mẫu "${tmpl.name}" thuộc ${tmpl.requiredPlanName || 'Gói Cao Cấp'}. Vui lòng nâng cấp gói để chọn thiệp này!`,
      'warning'
    );
    setLockedModalTemplate(tmpl);
  };

  // Grouping / filtering templates (deduplicate any aliases by template name)
  const allTemplates = Object.values(dynamicTemplates).filter(
    (item, index, self) => index === self.findIndex((t) => t.name === item.name)
  );
  const filteredTemplates = allTemplates.filter((tmpl) => {
    const isAllowed =
      isAdmin || isTemplateAllowedForPlan(tmpl.id, currentPlanIdentifier, data.template, commercialTemplates);
    if (filterMode === 'unlocked') return isAllowed;
    if (filterMode === 'locked') return !isAllowed;
    return true;
  });

  const unlockedCount = allTemplates.filter(
    (t) => isAdmin || isTemplateAllowedForPlan(t.id, currentPlanIdentifier, data.template, commercialTemplates)
  ).length;
  const lockedCount = allTemplates.length - unlockedCount;

  return (
    <div className="space-y-6 font-body">
      {/* Header with Title & Plan Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#8C7335] text-xs font-semibold uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5 text-[#B38F26]" />
            <span>Kho Mẫu Thiệp Cưới Độc Quyền</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold font-serif-title text-neutral-900">
            Chọn Giao Diện & Phong Cách Thiệp
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Thay đổi giao diện, màu sắc và không gian phong cách của thiệp cưới chỉ với 1 cú chạm.
          </p>
        </div>

        {/* Current Plan Badge Card */}
        <div className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#EADFC7] shadow-xs">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              currentPlanLevel >= 3
                ? 'bg-amber-100 text-amber-800'
                : currentPlanLevel === 2
                ? 'bg-[#FAF6EE] text-[#8C7335]'
                : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            {currentPlanLevel >= 3 ? (
              <Crown className="w-5 h-5 text-amber-700" />
            ) : currentPlanLevel === 2 ? (
              <Sparkles className="w-5 h-5 text-[#B38F26]" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-neutral-600" />
            )}
          </div>
          <div className="text-left">
            <span className="text-[11px] text-neutral-400 uppercase font-semibold tracking-wider block">
              Gói dịch vụ hiện tại
            </span>
            <span className="text-sm font-bold text-neutral-900 block font-serif-title">
              {currentPlanName}
            </span>
          </div>

          {!isAdmin && currentPlanLevel < 3 && onUpgradePackage && (
            <button
              onClick={onUpgradePackage}
              type="button"
              className="ml-2 px-3 py-1.5 rounded-xl bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Nâng cấp gói
            </button>
          )}
        </div>
      </div>

      {/* Plan Notice Banner for Basic or Restricted Users */}
      {!isAdmin && currentPlanLevel < 3 && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            currentPlanLevel === 1
              ? 'bg-amber-50/70 border-amber-200/80 text-amber-950'
              : 'bg-neutral-50 border-neutral-200 text-neutral-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs sm:text-sm">
              <p className="font-semibold text-neutral-900">
                {currentPlanLevel === 1
                  ? 'Tài khoản đang đăng ký Gói Cơ Bản (Basic)'
                  : 'Tài khoản đang đăng ký Gói Cao Cấp (Premium)'}
              </p>
              <p className="text-neutral-600 leading-relaxed text-xs">
                {currentPlanLevel === 1
                  ? 'Gói Cơ Bản hỗ trợ 3 mẫu thiệp thiết yếu. Các mẫu thiệp thuộc Gói Cao Cấp và Gói VIP được bôi xám bên dưới. Nhấp vào mẫu bất kỳ để xem hướng dẫn nâng cấp gói.'
                  : 'Gói Cao Cấp hỗ trợ mở khóa 8 mẫu thiệp phổ biến & cao cấp. Các mẫu thuộc Gói VIP độc quyền được bôi xám bên dưới.'}
              </p>
            </div>
          </div>

          {onUpgradePackage && (
            <button
              onClick={onUpgradePackage}
              type="button"
              className="shrink-0 px-4 py-2 rounded-xl bg-white border border-[#D4AF37] hover:bg-[#FAF6EE] text-[#8C7335] text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Xem bảng nâng cấp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            filterMode === 'all'
              ? 'bg-[#181615] text-white shadow-xs'
              : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          Tất cả mẫu ({allTemplates.length})
        </button>
        <button
          onClick={() => setFilterMode('unlocked')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filterMode === 'unlocked'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Khả dụng trong gói ({unlockedCount})</span>
        </button>
        {lockedCount > 0 && (
          <button
            onClick={() => setFilterMode('locked')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              filterMode === 'locked'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Yêu cầu nâng cấp ({lockedCount})</span>
          </button>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tmpl, idx) => {
          const isSelected = data.template === tmpl.id;
          const isAllowed =
            isAdmin || isTemplateAllowedForPlan(tmpl.id, currentPlanIdentifier, data.template, commercialTemplates);
          const isLocked = !isAllowed;

          return (
            <div
              key={`${tmpl.id}-${idx}`}
              onClick={() => {
                if (isLocked) {
                  handleLockedTemplateClick(tmpl);
                } else {
                  handleSelectTemplate(tmpl.id);
                }
              }}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 flex flex-col justify-between ${
                isLocked
                  ? 'grayscale opacity-60 hover:opacity-85 hover:grayscale-[40%] bg-neutral-100/90 border-neutral-300 hover:border-amber-400 cursor-pointer shadow-xs hover:shadow-md'
                  : isSelected
                  ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/20 scale-[1.01] bg-white shadow-md cursor-pointer'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white shadow-xs hover:shadow-lg cursor-pointer'
              }`}
            >
              <div>
                {/* Preview Banner */}
                <div
                  className={`h-40 relative flex items-center justify-center p-4 text-center overflow-hidden transition-colors ${tmpl.bgClass}`}
                >
                  <div
                    className="p-3 rounded-xl border shadow-sm max-w-xs w-full bg-white/85"
                    style={{
                      borderColor: `${tmpl.accentColor}60`,
                    }}
                  >
                    <p
                      className="font-script text-2xl font-bold"
                      style={{ color: tmpl.accentColor }}
                    >
                      Save Our Date
                    </p>
                    <p className="font-serif-title text-xs uppercase tracking-wider font-semibold text-neutral-800 line-clamp-1">
                      {tmpl.name}
                    </p>
                  </div>

                  {/* Top-left Plan Requirement Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-xs flex items-center gap-1 shadow-xs ${
                        isLocked
                          ? 'bg-neutral-900/85 text-amber-300 border border-amber-400/40'
                          : tmpl.requiredPlan === 'vip'
                          ? 'bg-purple-900/85 text-purple-200'
                          : tmpl.requiredPlan === 'premium'
                          ? 'bg-amber-900/85 text-amber-200'
                          : 'bg-neutral-800/80 text-neutral-200'
                      }`}
                    >
                      {isLocked && <Lock className="w-3 h-3 text-amber-300" />}
                      {tmpl.requiredPlanName || 'Gói Cơ Bản'}
                    </span>
                  </div>

                  {/* Selected Check Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  {/* Locked Overlay with prompt */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-neutral-900/45 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 text-center transition-all group-hover:bg-neutral-900/40">
                      <div className="w-9 h-9 rounded-full bg-neutral-900/90 border border-amber-400/60 text-amber-300 flex items-center justify-center shadow-lg mb-1.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-900/90 border border-amber-400/40 text-amber-200 text-[11px] font-bold shadow-xs">
                        {tmpl.requiredPlanName || 'Gói Cao Cấp'}
                      </span>
                      <span className="text-[10px] text-amber-100/90 mt-1 font-medium group-hover:text-amber-200">
                        Bấm để xem cách mở khóa
                      </span>
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-serif-title font-semibold text-neutral-900 text-sm sm:text-base line-clamp-1">
                      {tmpl.name}
                    </h4>
                    {isSelected ? (
                      <span className="shrink-0 text-[10px] font-bold text-[#8C7335] uppercase bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                        Đang chọn
                      </span>
                    ) : isLocked ? (
                      <span className="shrink-0 text-[10px] font-bold text-amber-800 uppercase bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300/60 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Khóa</span>
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Khả dụng
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>

                  {/* Color swatches */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-neutral-400">Điểm nhấn:</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: tmpl.accentColor }}
                      title="Màu điểm nhấn"
                    />
                    <span className="text-[10px] font-mono text-neutral-500">
                      {tmpl.accentColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action Footer */}
              <div className="p-4 pt-0">
                {isLocked ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLockedTemplateClick(tmpl);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-900 text-amber-300 hover:bg-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Nâng cấp để chọn thiệp này</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(tmpl.id);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#FAF6EE] text-[#8C7335] border border-[#D4AF37]/50'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Giao diện đang sử dụng</span>
                      </>
                    ) : (
                      <span>Áp dụng mẫu này</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgrade Modal When Clicking Locked Template */}
      {lockedModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#EADFC7] shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLockedModalTemplate(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Yêu Cầu Nâng Cấp Gói</span>
              </div>
              <h3 className="text-xl font-bold font-serif-title text-neutral-900">
                Nâng Cấp Gói Để Chọn Mẫu Thiệp Này
              </h3>
              <p className="text-xs text-neutral-600">
                Mẫu giao diện bạn chọn yêu cầu gói dịch vụ cao hơn gói hiện tại của bạn.
              </p>
            </div>

            {/* Template Info Preview Box */}
            <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#EADFC7] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">Giao diện đã chọn:</span>
                <span className="text-xs font-bold text-amber-800 uppercase bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {lockedModalTemplate.requiredPlanName}
                </span>
              </div>
              <h4 className="font-serif-title text-base font-bold text-neutral-900">
                {lockedModalTemplate.name}
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {lockedModalTemplate.description}
              </p>
            </div>

            {/* Plan Comparison Box */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
              <div className="space-y-1 border-r border-neutral-200 pr-2">
                <span className="text-[11px] text-neutral-400 font-semibold uppercase block">
                  Gói Hiện Tại
                </span>
                <span className="text-xs font-bold text-neutral-700 block">
                  {currentPlanName}
                </span>
              </div>
              <div className="space-y-1 pl-2">
                <span className="text-[11px] text-amber-600 font-semibold uppercase block">
                  Yêu Cầu Tối Thiểu
                </span>
                <span className="text-xs font-bold text-amber-800 block">
                  {lockedModalTemplate.requiredPlanName}
                </span>
              </div>
            </div>

            {/* Value Proposition List */}
            <div className="space-y-2 text-xs text-neutral-700">
              <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B38F26]" />
                <span>Đặc quyền khi nâng cấp gói:</span>
              </p>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kích hoạt và sử dụng ngay mẫu thiệp <strong>{lockedModalTemplate.name}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Thời hạn lưu trữ thiệp dài hơn (12 tháng đến vĩnh viễn)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Album ảnh cưới chất lượng cao không giới hạn số lượng ảnh</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Nhạc nền piano lãng mạn, hiệu ứng đếm ngược & mở phong bì điện ảnh</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              {onUpgradePackage ? (
                <button
                  type="button"
                  onClick={() => {
                    setLockedModalTemplate(null);
                    onUpgradePackage();
                  }}
                  className="w-full py-3 rounded-2xl bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Chuyển Sang Tab Gói Dịch Vụ & Nâng Cấp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href={`tel:${cleanHotline}`}
                  className="w-full py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#B38F26] text-white font-bold text-xs uppercase tracking-wider text-center block"
                >
                  Liên Hệ Hotline {displayHotline} Để Nâng Cấp
                </a>
              )}

              <div className="flex items-center gap-2">
                <a
                  href={`https://zalo.me/${cleanZalo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Chat Zalo hỗ trợ</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
                <button
                  type="button"
                  onClick={() => setLockedModalTemplate(null)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Để sau (chọn mẫu khác)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
