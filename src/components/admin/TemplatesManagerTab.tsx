import React, { useState, useEffect, useRef } from 'react';
import { CommercialTemplate, CommercialPackage } from '../../types/commercial';
import { DEFAULT_COMMERCIAL_TEMPLATES, DEFAULT_COMMERCIAL_PACKAGES } from '../../data/commercialDefaults';
import {
  saveCommercialTemplates,
  getCommercialTemplatesSync,
  resetCommercialTemplatesToDefault,
  deleteCommercialTemplateAsync,
  toggleTemplateActiveStatus,
} from '../../services/templateService';
import { getCommercialPackages, getCommercialPackagesSync } from '../../services/packageService';
import { compressImageFile } from '../../lib/imageUtils';
import {
  Palette,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Tag,
  Check,
  Sparkles,
  Plus,
  Star,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Copy,
  Upload,
  Search,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  DollarSign,
  Layers,
  ArrowUpDown,
  Package,
  X,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { TemplateEditModal } from './TemplateEditModal';

interface TemplatesManagerTabProps {
  onNavigateToDemo?: (demoSlug: string) => void;
}

export function TemplatesManagerTab({ onNavigateToDemo }: TemplatesManagerTabProps) {
  const { showToast } = useToast();
  const fileInputDirectRef = useRef<HTMLInputElement>(null);
  const [selectedTplForImageUpload, setSelectedTplForImageUpload] = useState<string | null>(null);

  const [templates, setTemplates] = useState<CommercialTemplate[]>(() => {
    return getCommercialTemplatesSync();
  });

  const [packages, setPackages] = useState<CommercialPackage[]>(() => {
    return getCommercialPackagesSync();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
  const [copiedRoute, setCopiedRoute] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CommercialTemplate | null>(null);

  // Delete template confirmation modal state
  const [templateToDelete, setTemplateToDelete] = useState<CommercialTemplate | null>(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);

  // Quick package inline editing
  const [editingPackageTplId, setEditingPackageTplId] = useState<string | null>(null);

  // Listen for background updates
  useEffect(() => {
    const handleUpdate = () => {
      setTemplates(getCommercialTemplatesSync());
    };
    window.addEventListener('lamour_commercial_templates_updated', handleUpdate);

    getCommercialPackages().then((pkgs) => {
      if (pkgs && pkgs.length > 0) setPackages(pkgs);
    }).catch(() => {});

    const handlePackagesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CommercialPackage[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setPackages(customEvent.detail);
      }
    };
    window.addEventListener('lamour_commercial_packages_updated', handlePackagesUpdate);

    return () => {
      window.removeEventListener('lamour_commercial_templates_updated', handleUpdate);
      window.removeEventListener('lamour_commercial_packages_updated', handlePackagesUpdate);
    };
  }, []);

  // Helper to determine the package of a template
  const getPackageForTemplate = (tpl: CommercialTemplate): CommercialPackage => {
    if (tpl.packageId) {
      const match = packages.find((p) => p.id === tpl.packageId || p.slug === tpl.packageId);
      if (match) return match;
    }
    if (tpl.requiredPlan) {
      const match = packages.find(
        (p) =>
          p.slug === tpl.requiredPlan ||
          p.id === tpl.requiredPlan ||
          p.id === `pkg-${tpl.requiredPlan}`
      );
      if (match) return match;
    }
    if (tpl.packageName) {
      const match = packages.find((p) => p.name.toLowerCase().includes(tpl.packageName!.toLowerCase()));
      if (match) return match;
    }
    if (tpl.price >= 700000 || tpl.slug.includes('vip') || tpl.style?.toLowerCase().includes('vip')) {
      const vip = packages.find((p) => p.slug === 'vip' || p.id === 'pkg-vip');
      if (vip) return vip;
    }
    if (tpl.price >= 450000 || tpl.slug.includes('premium')) {
      const premium = packages.find((p) => p.slug === 'premium' || p.id === 'pkg-premium');
      if (premium) return premium;
    }
    const basic = packages.find((p) => p.slug === 'basic' || p.id === 'pkg-basic');
    return basic || packages[0] || DEFAULT_COMMERCIAL_PACKAGES[0];
  };

  const handleSavePackage = (tplId: string, newPkgId: string) => {
    const targetPkg = packages.find((p) => p.id === newPkgId || p.slug === newPkgId);
    if (!targetPkg) return;

    const canonicalPlan: 'basic' | 'premium' | 'vip' =
      targetPkg.slug === 'vip' || targetPkg.id?.includes('vip')
        ? 'vip'
        : targetPkg.slug === 'basic' || targetPkg.id?.includes('basic')
        ? 'basic'
        : 'premium';

    const updated = templates.map((t) => {
      const match =
        t.id === tplId ||
        t.slug === tplId ||
        `tpl-${t.slug}` === tplId ||
        t.id === `tpl-${tplId}` ||
        t.slug === tplId.replace(/^tpl-/, '');
      if (!match) return t;
      return {
        ...t,
        packageId: targetPkg.id,
        packageName: targetPkg.name,
        requiredPlan: canonicalPlan,
        price: targetPkg.price,
      };
    });

    setTemplates(updated);
    saveCommercialTemplates(updated);
    setEditingPackageTplId(null);
    showToast(`Đã chuyển mẫu thiệp sang "${targetPkg.name}" (${targetPkg.price.toLocaleString('vi-VN')} đ)`, 'success');
  };

  // 1. TOGGLE ACTIVE (Tắt / Bật template)
  const handleToggleActive = (tplId: string) => {
    const updated = templates.map((t) => {
      if (t.id === tplId) {
        const currentlyActive = t.active !== false;
        return { ...t, active: !currentlyActive };
      }
      return t;
    });
    setTemplates(updated);
    saveCommercialTemplates(updated);
    const target = updated.find((t) => t.id === tplId);
    showToast(
      target?.active !== false
        ? `Đã kích hoạt mở bán mẫu "${target?.name}"`
        : `Đã tạm tắt và ẩn mẫu "${target?.name}" khỏi khách hàng`,
      'info'
    );
  };

  // 2. TOGGLE FEATURED (Đánh dấu Featured)
  const handleToggleFeatured = (tplId: string) => {
    const updated = templates.map((t) =>
      t.id === tplId ? { ...t, isFeatured: !t.isFeatured } : t
    );
    setTemplates(updated);
    saveCommercialTemplates(updated);
    const target = updated.find((t) => t.id === tplId);
    showToast(
      target?.isFeatured
        ? `Đã gắn nhãn Nổi Bật (Featured) cho mẫu "${target.name}"`
        : `Đã gỡ nhãn Nổi Bật cho mẫu "${target?.name}"`,
      'success'
    );
  };

  // 3. REORDER TEMPLATES (Sắp xếp thứ tự: Lên / Xuống)
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...templates];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setTemplates(updated);
    saveCommercialTemplates(updated);
    showToast(`Đã di chuyển mẫu "${temp.name}" lên vị trí #${index}`, 'info');
  };

  const handleMoveDown = (index: number) => {
    if (index >= templates.length - 1) return;
    const updated = [...templates];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setTemplates(updated);
    saveCommercialTemplates(updated);
    showToast(`Đã di chuyển mẫu "${temp.name}" xuống vị trí #${index + 2}`, 'info');
  };

  // 5. UPLOAD TEMPLATE PREVIEW DIRECTLY (Upload preview ảnh trực tiếp)
  const handleTriggerDirectUpload = (tplId: string) => {
    setSelectedTplForImageUpload(tplId);
    fileInputDirectRef.current?.click();
  };

  const handleDirectFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = selectedTplForImageUpload;
    if (!file || !targetId) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)', 'error');
      return;
    }

    try {
      const imageUrl = await compressImageFile(file, { maxWidth: 1600, quality: 0.85 });
      const updated = templates.map((t) =>
        t.id === targetId ? { ...t, previewImage: imageUrl } : t
      );
      setTemplates(updated);
      saveCommercialTemplates(updated);
      showToast('Đã cập nhật ảnh bìa xem trước từ máy thành công!', 'success');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          const updated = templates.map((t) =>
            t.id === targetId ? { ...t, previewImage: imageUrl } : t
          );
          setTemplates(updated);
          saveCommercialTemplates(updated);
          showToast('Đã cập nhật ảnh bìa xem trước thành công!', 'success');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      e.target.value = '';
      setSelectedTplForImageUpload(null);
    }
  };

  // 6. CREATE & EDIT MODAL HANDLERS
  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tpl: CommercialTemplate) => {
    setEditingTemplate(tpl);
    setIsModalOpen(true);
  };

  const handleSaveTemplateFromModal = (savedTemplate: CommercialTemplate) => {
    let updated: CommercialTemplate[];
    if (editingTemplate) {
      // Edit existing
      updated = templates.map((t) => {
        const isMatch =
          t.id === savedTemplate.id ||
          t.slug === savedTemplate.slug ||
          (editingTemplate && (t.id === editingTemplate.id || t.slug === editingTemplate.slug));
        return isMatch ? savedTemplate : t;
      });
      showToast(`Đã lưu thay đổi mẫu thiệp "${savedTemplate.name}"!`, 'success');
    } else {
      // Create new
      updated = [savedTemplate, ...templates];
      showToast(`Đã tạo mới thành công mẫu thiệp "${savedTemplate.name}"!`, 'success');
    }

    setTemplates(updated);
    saveCommercialTemplates(updated);
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  // 7. DUPLICATE TEMPLATE
  const handleDuplicateTemplate = (tpl: CommercialTemplate) => {
    const newTemplate: CommercialTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Bản Sao)`,
      slug: `${tpl.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      badge: 'Mẫu mới',
      isFeatured: false,
      active: true,
    };
    const updated = [newTemplate, ...templates];
    setTemplates(updated);
    saveCommercialTemplates(updated);
    showToast(`Đã nhân bản mẫu thiệp thành "${newTemplate.name}"!`, 'success');
  };

  // 8. DELETE TEMPLATE
  const handleDeleteTemplate = (tpl: CommercialTemplate) => {
    setTemplateToDelete(tpl);
  };

  const handleConfirmDeleteTemplate = async () => {
    if (!templateToDelete) return;
    setIsDeletingTemplate(true);
    try {
      const tplName = templateToDelete.name;
      await deleteCommercialTemplateAsync(templateToDelete.id);
      const updated = templates.filter((t) => t.id !== templateToDelete.id);
      setTemplates(updated);
      showToast(`Đã xóa vĩnh viễn mẫu thiệp "${tplName}" khỏi hệ thống!`, 'success');
      setTemplateToDelete(null);
    } catch (err) {
      console.error('Delete template error:', err);
      showToast('Có lỗi xảy ra khi xóa mẫu thiệp', 'error');
    } finally {
      setIsDeletingTemplate(false);
    }
  };

  // 9. RESET TO DEFAULTS
  const handleResetToDefaults = () => {
    if (
      !confirm(
        'Bạn có chắc chắn muốn khôi phục 5 mẫu thiệp nguyên bản của L\'Amour? Các mẫu tự tạo mới sẽ bị ghi đè.'
      )
    ) {
      return;
    }
    const defs = resetCommercialTemplatesToDefault();
    setTemplates(defs);
    showToast('Đã khôi phục 5 mẫu thiệp chuẩn của L\'Amour!', 'success');
  };

  // Filter and Search logic
  const filteredTemplates = templates.filter((tpl) => {
    const slug = (tpl.slug || '').toLowerCase();
    const id = (tpl.id || '').toLowerCase();
    const name = (tpl.name || '').toLowerCase();
    if (
      slug === 'tree-of-love' ||
      slug === 'tree-of-love-01' ||
      id === 'tpl-tree-of-love-01' ||
      id === 'tree-of-love' ||
      name.includes('cây tình yêu') ||
      name.includes('the tree of love')
    ) {
      return false;
    }

    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.badge && tpl.badge.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === 'active') return tpl.active !== false;
    if (filterMode === 'inactive') return tpl.active === false;
    if (filterMode === 'featured') return tpl.isFeatured;
    return true;
  });

  const validTemplates = templates.filter((t) => {
    const slug = (t.slug || '').toLowerCase();
    const id = (t.id || '').toLowerCase();
    const name = (t.name || '').toLowerCase();
    return (
      slug !== 'tree-of-love' &&
      slug !== 'tree-of-love-01' &&
      id !== 'tpl-tree-of-love-01' &&
      id !== 'tree-of-love' &&
      !name.includes('cây tình yêu') &&
      !name.includes('the tree of love')
    );
  });
  const activeCount = validTemplates.filter((t) => t.active !== false).length;
  const inactiveCount = validTemplates.filter((t) => t.active === false).length;
  const featuredCount = validTemplates.filter((t) => t.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Hidden file input for direct card image upload */}
      <input
        type="file"
        ref={fileInputDirectRef}
        onChange={handleDirectFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-neutral-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 text-[#8C7335] flex items-center justify-center border border-[#D4AF37]/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-neutral-900 text-lg sm:text-xl">
                  Quản Lý Mẫu Thiệp Cưới (Templates)
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#FAF6EE] text-[#8C7335] border border-[#D4AF37]/40 font-semibold">
                  /admin/templates
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Tạo mới, sửa mẫu thiệp, gán gói, upload ảnh preview, đặt giá, bật/tắt hiển thị, đánh dấu nổi bật và sắp xếp thứ tự
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}/admin/templates`;
              navigator.clipboard.writeText(url);
              setCopiedRoute(true);
              showToast(`Đã sao chép liên kết: ${url}`, 'success');
              setTimeout(() => setCopiedRoute(false), 2000);
            }}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sao chép liên kết nhanh tới trang Quản lý Template"
          >
            {copiedRoute ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRoute ? 'Đã chép link' : 'Copy link /admin/templates'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-red-50 hover:text-red-600 text-neutral-600 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            title="Khôi phục lại 5 mẫu thiệp ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục gốc</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Template Mới</span>
          </button>
        </div>
      </div>

      {/* Stats Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Tổng số mẫu
            </span>
            <span className="text-2xl font-bold text-neutral-900">{templates.length}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Đang mở bán
            </span>
            <span className="text-2xl font-bold text-emerald-600">{activeCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Tạm tắt / Ẩn
            </span>
            <span className="text-2xl font-bold text-neutral-500">{inactiveCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Mẫu nổi bật (Featured)
            </span>
            <span className="text-2xl font-bold text-amber-500">{featuredCount}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên mẫu, slug, phong cách..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#D4AF37] focus:outline-hidden"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
          >
            Tất cả ({templates.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
          >
            Đang bán ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('inactive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'inactive'
                ? 'bg-neutral-700 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
          >
            Đã tắt ({inactiveCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('featured')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterMode === 'featured'
                ? 'bg-amber-500 text-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Nổi bật ({featuredCount})</span>
          </button>
        </div>
      </div>

      {/* Templates Grid List */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-neutral-800">
            Không tìm thấy mẫu thiệp nào phù hợp
          </p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm tạo mẫu template mới để bổ sung vào bộ sưu tập.
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo Template Mới Ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl, idx) => {
            // Find global index for reordering
            const globalIndex = templates.findIndex((t) => t.id === tpl.id);
            const isFirst = globalIndex === 0;
            const isLast = globalIndex === templates.length - 1;
            const currentPkg = getPackageForTemplate(tpl);
            const isTplActive = tpl.active !== false;

            return (
              <div
                key={`${tpl.id}-${idx}`}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs flex flex-col justify-between transition-all duration-300 relative group ${
                  isTplActive
                    ? 'border-neutral-200 hover:border-[#D4AF37] hover:shadow-lg'
                    : 'border-neutral-300 bg-neutral-50/50 opacity-75'
                }`}
              >
                <div>
                  {/* Image Preview Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
                    <img
                      src={tpl.previewImage}
                      alt={tpl.name}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        !isTplActive ? 'grayscale-30' : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />

                    {/* Inactive Overlay Badge */}
                    {!isTplActive && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center p-4 text-center">
                        <span className="px-3 py-1.5 rounded-full bg-neutral-900/90 text-neutral-200 text-xs font-bold flex items-center gap-1.5 shadow-lg border border-neutral-700">
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          <span>Đã Tắt - Ẩn Khỏi Khách Hàng</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(tpl.id)}
                          className="mt-2 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow cursor-pointer transition-colors"
                        >
                          Bật Mở Bán Lại
                        </button>
                      </div>
                    )}

                    {/* Top Left: Order Badge & Reorder Arrows */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/75 backdrop-blur-xs rounded-xl p-1 shadow-md">
                      <span className="text-[11px] font-mono font-bold text-white px-2">
                        #{globalIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveUp(globalIndex)}
                        disabled={isFirst}
                        title="Di chuyển lên trước"
                        className="p-1 rounded-lg text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(globalIndex)}
                        disabled={isLast}
                        title="Di chuyển xuống sau"
                        className="p-1 rounded-lg text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Top Right: Status Switch & Featured Star */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {/* Featured Star Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(tpl.id)}
                        title={tpl.isFeatured ? 'Bỏ đánh dấu nổi bật' : 'Đánh dấu mẫu nổi bật'}
                        className={`p-1.5 rounded-xl backdrop-blur-xs shadow-md transition-transform hover:scale-110 cursor-pointer ${
                          tpl.isFeatured
                            ? 'bg-amber-400 text-neutral-900 border border-amber-300'
                            : 'bg-black/60 text-white/70 hover:text-white'
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${tpl.isFeatured ? 'fill-current' : ''}`}
                        />
                      </button>

                      {/* Active Status Badge Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(tpl.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs shadow-md transition-all cursor-pointer flex items-center gap-1 ${
                          isTplActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        {isTplActive ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Đang Bán</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Tạm Ẩn</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bottom Left: Package & Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md backdrop-blur-xs flex items-center gap-1.5 border ${
                          currentPkg.slug === 'vip' || currentPkg.id?.includes('vip')
                            ? 'bg-purple-900/90 border-purple-400/40 text-purple-200'
                            : currentPkg.slug === 'premium' || currentPkg.id?.includes('premium')
                            ? 'bg-[#8C7335]/95 border-[#D4AF37]/50 text-[#FAF6EE]'
                            : 'bg-neutral-900/90 border-neutral-600 text-neutral-200'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{currentPkg.name}</span>
                      </span>
                      {tpl.badge && (
                        <span className="bg-linear-to-r from-[#D4AF37] to-[#B38F26] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                          {tpl.badge}
                        </span>
                      )}
                    </div>

                    {/* Bottom Right: Quick Upload Image Button */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleTriggerDirectUpload(tpl.id)}
                        title="Upload ảnh preview mới cho mẫu này"
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-neutral-800 text-xs font-semibold shadow-md flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-[10px]">Đổi Ảnh</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5">
                    {/* Title & Slug */}
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-bold text-neutral-900 text-base group-hover:text-[#8C7335] transition-colors line-clamp-1">
                          {tpl.name}
                        </h3>
                        <span className="font-mono text-[11px] text-neutral-400 shrink-0">
                          /{tpl.slug}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    {/* Package & Features */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                      {/* Package Section with Direct Switcher */}
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-semibold text-neutral-400 block uppercase tracking-wider">
                            Gói Áp Dụng
                          </span>
                          <span className="text-[11px] font-bold text-[#8C7335]">
                            {currentPkg.price.toLocaleString('vi-VN')} đ
                          </span>
                        </div>

                        {/* Direct Select Dropdown */}
                        <div className="flex items-center gap-1.5">
                          <select
                            value={currentPkg.id}
                            onChange={(e) => handleSavePackage(tpl.id, e.target.value)}
                            title="Chọn gói thiệp cho mẫu này (Basic / Premium / VIP)"
                            className={`w-full text-xs font-bold px-2 py-1.5 rounded-xl border cursor-pointer focus:outline-hidden transition-all shadow-2xs ${
                              currentPkg.slug === 'vip' || currentPkg.id?.includes('vip')
                                ? 'bg-purple-50 text-purple-900 border-purple-300 hover:border-purple-500'
                                : currentPkg.slug === 'premium' || currentPkg.id?.includes('premium')
                                ? 'bg-[#FAF6EE] text-[#8C7335] border-[#D4AF37]/60 hover:border-[#D4AF37]'
                                : 'bg-blue-50 text-blue-900 border-blue-300 hover:border-blue-500'
                            }`}
                          >
                            {packages.map((pkg) => (
                              <option key={pkg.id} value={pkg.id}>
                                {pkg.name} ({pkg.price.toLocaleString('vi-VN')} đ)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 1-Click Package Quick Buttons */}
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          {packages.map((pkg) => {
                            const isCurrent = currentPkg.id === pkg.id || currentPkg.slug === pkg.slug;
                            return (
                              <button
                                key={pkg.id}
                                type="button"
                                onClick={() => handleSavePackage(tpl.id, pkg.id)}
                                title={`Chuyển mẫu sang ${pkg.name} (${pkg.price.toLocaleString('vi-VN')} đ)`}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                                  isCurrent
                                    ? 'bg-[#D4AF37] text-white border-[#B38F26] shadow-xs'
                                    : 'bg-white hover:bg-neutral-100 text-neutral-600 border-neutral-200'
                                }`}
                              >
                                {pkg.name.replace('Gói ', '')}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Featured Count Indicator */}
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-neutral-400 block uppercase">
                          Đặc Điểm
                        </span>
                        <span className="text-xs font-medium text-neutral-600">
                          {tpl.features?.length || 0} tính năng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Strip */}
                <div className="p-4 border-t border-neutral-100 bg-neutral-50/70 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Live Demo Link */}
                    <a
                      href={`/demo/${tpl.demoSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#8C7335] text-xs font-semibold border border-neutral-200/80 hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Xem Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {/* Duplicate button */}
                    <button
                      type="button"
                      onClick={() => handleDuplicateTemplate(tpl)}
                      title="Nhân bản mẫu thiệp này"
                      className="p-1.5 rounded-xl hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Explicit Hide / Show Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(tpl.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                        isTplActive
                          ? 'bg-amber-50/80 hover:bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                      title={isTplActive ? 'Tạm ẩn mẫu thiệp này khỏi trang khách hàng' : 'Kích hoạt mở bán lại mẫu này'}
                    >
                      {isTplActive ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                          <span>Ẩn</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hiện</span>
                        </>
                      )}
                    </button>

                    {/* Edit Template Modal */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(tpl)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-[#D4AF37] hover:text-[#F3DF95] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>

                    {/* Delete Template */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(tpl)}
                      title="Xóa vĩnh viễn mẫu thiệp này"
                      className="p-1.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Template Confirmation Modal */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-red-200 p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title text-lg font-bold text-neutral-900">
                    Xác Nhận Xóa Vĩnh Viễn Mẫu Thiệp
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Mẫu sẽ bị loại bỏ khỏi danh mục và không thể khôi phục
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isDeletingTemplate && setTemplateToDelete(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                disabled={isDeletingTemplate}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Template Details Box */}
            <div className="p-4 bg-red-50/40 rounded-2xl border border-red-100 space-y-3 text-xs text-neutral-700">
              <div className="flex items-center gap-3">
                <img
                  src={templateToDelete.previewImage}
                  alt={templateToDelete.name}
                  className="w-16 h-16 rounded-xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-neutral-900 text-sm">{templateToDelete.name}</h4>
                  <p className="font-mono text-[11px] text-neutral-500">Slug: /{templateToDelete.slug}</p>
                  <p className="text-[11px] text-neutral-600">
                    Phong cách: <strong>{templateToDelete.style}</strong> • Giá: <strong>{templateToDelete.price.toLocaleString('vi-VN')} đ</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Khách hàng sẽ không còn thấy mẫu thiệp này trên trang chủ, danh mục mẫu và trang đặt thiệp.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                disabled={isDeletingTemplate}
                className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteTemplate}
                disabled={isDeletingTemplate}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeletingTemplate ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Vĩnh Viễn Mẫu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Create & Edit Modal */}
      <TemplateEditModal
        template={editingTemplate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplateFromModal}
      />
    </div>
  );
}
