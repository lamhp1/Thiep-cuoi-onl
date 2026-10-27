import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CommercialTemplate } from '../../types/commercial';
import { getCommercialPackagesSync } from '../../services/packageService';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Sparkles,
  Star,
  Plus,
  Trash2,
  Eye,
  DollarSign,
  Tag,
  Palette,
  Package,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { compressImageFile } from '../../lib/imageUtils';

interface TemplateEditModalProps {
  template: CommercialTemplate | null; // null means creating a new template
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: CommercialTemplate) => void;
}

const INSPIRATION_IMAGES = [
  {
    label: 'Hoàng Gia Cổ Điển',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Hiện Đại Tối Giản',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Hoa Mẫu Đơn Pastel',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Dạ Tiệc Đen Vàng',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Truyền Thống Á Đông',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
  },
  {
    label: 'Biển & Hoàng Hôn',
    url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85',
  },
];

const PRESET_STYLES = [
  'Interactive Cinema VIP (Điện Ảnh)',
  'Hoàng Gia & Quý Phái',
  'Hiện Đại & Nghệ Thuật',
  'Ngọt Ngào & Lãng Mạn',
  'Huyền Bí & Đẳng Cấp',
  'Truyền Thống & Phúc Lộc',
  'Tối Giản & Thanh Lịch',
  'Rustic & Sân Vườn Mộc Mạc',
  'Bãi Biển & Tự Do',
];

const PRESET_DEMO_SLUGS = [
  { slug: 'cinematic-love-story', label: 'Demo: Cinematic Love Story (Phim Ngắn VIP)' },
  { slug: 'classic-luxury', label: 'Demo: Classic Luxury (Hoàng Gia)' },
  { slug: 'minimal-white', label: 'Demo: Minimal White (Tối Giản)' },
  { slug: 'floral-pink', label: 'Demo: Floral Pink (Khu Vườn Hoa)' },
  { slug: 'elegant-black-gold', label: 'Demo: Black & Gold Royale (Dạ Tiệc)' },
  { slug: 'traditional-vietnamese', label: 'Demo: Truyền Thống Á Đông (Hỷ Sự)' },
  { slug: 'haute-couture', label: 'Demo: Vogue Haute Couture' },
  { slug: 'celestial-royale', label: 'Demo: Celestial Royale' },
  { slug: 'chateau-grandeur', label: 'Demo: Château Grandeur' },
  { slug: 'luxury-editorial', label: 'Demo: Luxury Editorial' },
];

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function TemplateEditModal({
  template,
  isOpen,
  onClose,
  onSave,
}: TemplateEditModalProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!template;

  const [name, setName] = useState(template?.name || '');
  const [slug, setSlug] = useState(template?.slug || '');
  const [style, setStyle] = useState(template?.style || PRESET_STYLES[0]);
  const [price, setPrice] = useState<number>(template?.price ?? 499000);
  const [badge, setBadge] = useState(template?.badge || '');
  const [previewImage, setPreviewImage] = useState(
    template?.previewImage || INSPIRATION_IMAGES[0].url
  );
  const [demoSlug, setDemoSlug] = useState(
    template?.demoSlug || PRESET_DEMO_SLUGS[0].slug
  );
  const [description, setDescription] = useState(template?.description || '');
  const [features, setFeatures] = useState<string[]>(
    template?.features || [
      'Giao diện tương thích 100% điện thoại và máy tính',
      'Hiệu ứng mở phong bì niêm phong cao cấp',
      'Phát nhạc nền tự động và album ảnh cưới HD',
      'Xác nhận RSVP & mã VietQR mừng cưới tích hợp sẵn',
    ]
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    template?.isFeatured ?? false
  );
  const [active, setActive] = useState<boolean>(template?.active ?? true);

  const [newFeatureText, setNewFeatureText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const packages = useMemo(() => getCommercialPackagesSync(), []);
  const [selectedPkgId, setSelectedPkgId] = useState<string>(() => {
    if (template?.packageId) return template.packageId;
    if (template?.requiredPlan) {
      const match = packages.find((p) => p.slug === template.requiredPlan);
      if (match) return match.id;
    }
    if (template?.packageName) {
      const match = packages.find((p) => p.name.toLowerCase().includes(template.packageName!.toLowerCase()));
      if (match) return match.id;
    }
    if (template?.price && template.price >= 700000) {
      const vip = packages.find((p) => p.slug === 'vip' || p.id === 'pkg-vip');
      if (vip) return vip.id;
    }
    if (template?.price && template.price >= 450000) {
      const prem = packages.find((p) => p.slug === 'premium' || p.id === 'pkg-premium');
      if (prem) return prem.id;
    }
    return packages[0]?.id || 'pkg-basic';
  });

  const chosenPkg = packages.find((p) => p.id === selectedPkgId || p.slug === selectedPkgId) || packages[0];

  useEffect(() => {
    if (template && isOpen) {
      setName(template.name || '');
      setSlug(template.slug || '');
      setStyle(template.style || PRESET_STYLES[0]);
      setPrice(template.price ?? 499000);
      setBadge(template.badge || '');
      setPreviewImage(template.previewImage || INSPIRATION_IMAGES[0].url);
      setDemoSlug(template.demoSlug || PRESET_DEMO_SLUGS[0].slug);
      setDescription(template.description || '');
      setFeatures(template.features || []);
      setIsFeatured(template.isFeatured ?? false);
      setActive(template.active ?? true);

      const allPkgs = getCommercialPackagesSync();
      const foundPkg = allPkgs.find(
        (p) =>
          p.id === template.packageId ||
          p.slug === template.packageId ||
          p.slug === template.requiredPlan ||
          (template.packageName && p.name.toLowerCase().includes(template.packageName.toLowerCase()))
      );
      if (foundPkg) {
        setSelectedPkgId(foundPkg.id);
      } else {
        if (template.price && template.price >= 700000) {
          const vip = allPkgs.find((p) => p.slug === 'vip' || p.id === 'pkg-vip');
          if (vip) setSelectedPkgId(vip.id);
        } else if (template.price && template.price >= 450000) {
          const prem = allPkgs.find((p) => p.slug === 'premium' || p.id === 'pkg-premium');
          if (prem) setSelectedPkgId(prem.id);
        } else {
          const basic = allPkgs.find((p) => p.slug === 'basic' || p.id === 'pkg-basic');
          if (basic) setSelectedPkgId(basic.id);
        }
      }
    }
  }, [template?.id, isOpen]);

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    const chosen = packages.find((p) => p.id === pkgId || p.slug === pkgId);
    if (chosen) {
      setPrice(chosen.price);
    }
  };

  // Auto-slugify when name changes if not manually edited or when creating
  const handleNameChange = (newName: string) => {
    setName(newName);
    if (!isEditing && (!slug || slug === slugify(name))) {
      setSlug(slugify(newName));
    }
  };

  // Upload file handler
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)', 'error');
      return;
    }

    try {
      const compressed = await compressImageFile(file, { maxWidth: 1600, quality: 0.85 });
      setPreviewImage(compressed);
      showToast('Đã tải và tối ưu ảnh xem trước mẫu thành công!', 'success');
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
          showToast('Đã tải ảnh xem trước template!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Vui lòng nhập tên mẫu thiệp', 'error');
      return;
    }

    const finalSlug = slug.trim() || slugify(name);
    if (!finalSlug) {
      showToast('Vui lòng nhập mã định danh (slug)', 'error');
      return;
    }

    if (!previewImage.trim()) {
      showToast('Vui lòng cung cấp ảnh xem trước cho template', 'error');
      return;
    }

    const targetPackage = packages.find((p) => p.id === selectedPkgId || p.slug === selectedPkgId) || packages[0];
    const canonicalPlan: 'basic' | 'premium' | 'vip' =
      targetPackage?.slug === 'vip' || targetPackage?.id?.includes('vip')
        ? 'vip'
        : targetPackage?.slug === 'basic' || targetPackage?.id?.includes('basic')
        ? 'basic'
        : 'premium';

    const newTemplateData: CommercialTemplate = {
      id: template?.id || `tpl-${Date.now()}`,
      name: name.trim(),
      slug: finalSlug,
      style: style.trim(),
      price: price > 0 ? price : (targetPackage?.price || 499000),
      badge: badge.trim() || undefined,
      previewImage: previewImage.trim(),
      demoSlug: demoSlug.trim() || 'classic-luxury',
      description: description.trim(),
      features: features.filter((f) => f.trim().length > 0),
      isFeatured: !!isFeatured,
      active: !!active,
      packageId: targetPackage?.id || `pkg-${canonicalPlan}`,
      packageName: targetPackage?.name || (canonicalPlan === 'vip' ? 'Gói Thiết Kế Riêng (VIP)' : canonicalPlan === 'basic' ? 'Gói Cơ Bản (Basic)' : 'Gói Cao Cấp (Premium)'),
      requiredPlan: canonicalPlan,
    };

    onSave(newTemplateData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37]/50 w-full max-w-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 text-[#8C7335] flex items-center justify-center border border-[#D4AF37]/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-neutral-900">
                {isEditing ? `Chỉnh Sửa Mẫu: ${template.name}` : 'Tạo Template Mới'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isEditing
                  ? 'Cập nhật hình ảnh xem trước, giá bán, nhãn nổi bật và nội dung'
                  : 'Điền thông tin và tải ảnh xem trước để thêm mẫu thiệp mới vào hệ thống'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Image Upload & Preview */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center justify-between">
              <span>Ảnh Xem Trước (Preview Image)</span>
              <span className="text-[11px] font-normal text-neutral-400">Tỷ lệ khuyến nghị: 4:3 hoặc 16:9</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Image Preview Box */}
              <div className="md:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-dashed border-[#D4AF37]/50 bg-neutral-100 group shadow-xs">
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Template Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white/90 text-neutral-900 text-xs font-bold shadow cursor-pointer hover:bg-white flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Đổi Ảnh</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-neutral-400">
                    <ImageIcon className="w-8 h-8 text-neutral-300 mb-2" />
                    <span className="text-xs">Chưa có ảnh preview</span>
                  </div>
                )}

                {/* Overlays on preview */}
                {badge && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#D4AF37] text-white text-[10px] font-bold shadow">
                    {badge}
                  </div>
                )}
                {isFeatured && (
                  <div className="absolute top-2 right-2 p-1 rounded-md bg-amber-400 text-neutral-900 shadow">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-xs text-white text-[11px] font-bold border border-white/20 shadow-xs flex items-center gap-1">
                  <Package className="w-3 h-3 text-[#D4AF37]" />
                  <span>{chosenPkg?.name || 'Gói áp dụng'}</span>
                </div>
              </div>

              {/* Upload Controls & Presets */}
              <div className="md:col-span-7 space-y-3">
                {/* Drag and Drop Box */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#D4AF37] bg-[#FAF6EE]'
                      : 'border-neutral-300 hover:border-[#D4AF37] bg-neutral-50/50 hover:bg-[#FAF6EE]/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-[#D4AF37] mx-auto mb-1" />
                  <p className="text-xs font-semibold text-neutral-800">
                    Kéo thả ảnh vào đây hoặc bấm để chọn từ máy tính
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Chọn ảnh từ máy tính</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#8C7335] hover:text-[#B38F26] underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {showUrlInput ? 'Ẩn ô nhập link' : 'Hoặc dán link ảnh'}
                  </button>
                </div>

                {/* Direct Image URL input if toggled */}
                {showUrlInput && (
                  <div className="space-y-1 p-3 rounded-xl bg-neutral-50 border border-neutral-200 animate-fadeIn">
                    <label className="text-[11px] font-semibold text-neutral-600 block">
                      Dán trực tiếp URL hình ảnh:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:border-[#D4AF37] focus:outline-hidden font-mono bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Inspiration Image Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-medium text-neutral-500 block">
                    Hoặc chọn nhanh ảnh mẫu chất lượng cao có sẵn:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {INSPIRATION_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setPreviewImage(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] border transition-all cursor-pointer ${
                          previewImage === preset.url
                            ? 'bg-[#D4AF37] text-white border-[#D4AF37] font-semibold'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#D4AF37]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          {/* Section 2: Basic Template Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Tên Mẫu Thiệp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Royal Heritage (Di Sản Hoàng Gia)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] focus:outline-hidden font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Mã Định Danh (Slug URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="VD: royal-heritage"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Section 3: Phong Cách & Gói */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Phong Cách (Style)
              </label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="VD: Hoàng Gia & Quý Phái"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] focus:outline-hidden"
                />
                <div className="flex flex-wrap gap-1">
                  {PRESET_STYLES.slice(0, 4).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStyle(st)}
                      className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 hover:bg-[#FAF6EE] hover:text-[#8C7335] text-neutral-600 transition-colors cursor-pointer"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                  <span>Gói (Package) <span className="text-red-500">*</span></span>
                </span>
                <span className="text-xs font-bold text-[#8C7335]">
                  {chosenPkg?.name}
                </span>
              </label>
              <select
                value={selectedPkgId}
                onChange={(e) => handlePackageSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-[#D4AF37] focus:outline-hidden font-bold text-neutral-800 bg-white"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handlePackageSelect(pkg.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      selectedPkgId === pkg.id
                        ? 'bg-[#FAF6EE] text-[#8C7335] border-[#D4AF37] shadow-2xs font-bold'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Demo Slug & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Liên Kết Mẫu Demo (demoSlug)
              </label>
              <select
                value={demoSlug}
                onChange={(e) => setDemoSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:border-[#D4AF37] focus:outline-hidden bg-white"
              >
                {PRESET_DEMO_SLUGS.map((preset) => (
                  <option key={preset.slug} value={preset.slug}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                Nhãn Tiếp Thị (Badge)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="VD: Bán chạy nhất, Mẫu hot 2026..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:border-[#D4AF37] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 5: Flags (Featured & Active) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF6EE] border border-[#D4AF37]/30">
            {/* Featured toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Star className={`w-4 h-4 ${isFeatured ? 'text-amber-500 fill-amber-500' : 'text-neutral-400'}`} />
                  <span>Đánh Dấu Nổi Bật (Featured)</span>
                </span>
                <p className="text-[11px] text-neutral-500">
                  Hiển thị ưu tiên hàng đầu tại trang chủ và mục nổi bật
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isFeatured ? 'bg-[#D4AF37]' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 left-0.5 transition-transform duration-200 ${
                    isFeatured ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Eye className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-neutral-400'}`} />
                  <span>Trạng Thái Mở Bán (Active)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'}`}>
                    {active ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                  </span>
                </span>
                <p className="text-[11px] text-neutral-500">
                  {active ? 'Đang mở cho khách xem thử và đặt hàng' : 'Đang tạm tắt / ẩn khỏi khách hàng'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  active ? 'bg-emerald-600' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 left-0.5 transition-transform duration-200 ${
                    active ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 6: Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 block">
              Mô Tả Ý Nghĩa Mẫu Thiệp (Description)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu phong cách, cảm xúc và thông điệp mà mẫu thiệp này mang lại..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:border-[#D4AF37] focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Section 7: Key Features List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">
              Đặc Điểm Nổi Bật (Features)
            </label>

            <div className="space-y-1.5">
              {features.map((feat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[index] = e.target.value;
                      setFeatures(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:border-[#D4AF37] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Thêm đặc điểm mới (VD: Hiệu ứng cánh hoa bay rực rỡ)..."
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:border-[#D4AF37] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Lưu Thay Đổi Mẫu' : 'Tạo Mẫu Mới Ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
