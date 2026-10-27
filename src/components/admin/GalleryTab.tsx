import React, { useState, useRef } from 'react';
import { WeddingData, GalleryPhoto } from '../../types';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  RefreshCw,
  Link as LinkIcon,
  Check,
  Sparkles,
  Camera,
  ShoppingBag,
  Crown,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { compressImageFile } from '../../lib/imageUtils';
import { getGalleryQuota } from '../../services/albumQuotaService';
import { BuyExtraAlbumSlotsModal } from '../portal/BuyExtraAlbumSlotsModal';

interface GalleryTabProps {
  data: WeddingData;
  onChange: (data: WeddingData) => void;
  onUpgradePackage?: () => void;
}

export function GalleryTab({ data, onChange, onUpgradePackage }: GalleryTabProps) {
  const { showToast } = useToast();
  const quota = getGalleryQuota(data);
  const [showBuySlotsModal, setShowBuySlotsModal] = useState(false);

  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState<'prewedding' | 'ceremony' | 'moments'>('prewedding');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = () => {
    if (!newUrl.trim()) {
      showToast('Vui lòng chọn ảnh từ máy hoặc nhập đường link ảnh', 'error');
      return;
    }

    if (quota.remainingSlots <= 0) {
      showToast(
        `Album của bạn đã đạt giới hạn tối đa của gói (${quota.totalLimit} ảnh). Vui lòng mua thêm số lượng ảnh để tiếp tục!`,
        'error'
      );
      setShowBuySlotsModal(true);
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: newUrl.trim(),
      caption: newCaption.trim() || undefined,
      category: newCategory,
    };

    onChange({
      ...data,
      gallery: [newPhoto, ...data.gallery],
    });

    setNewUrl('');
    setNewCaption('');
    showToast('Đã thêm ảnh vào bộ sưu tập', 'success');
  };

  const handleProcessFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Vui lòng chọn tệp ảnh hợp lệ (JPG, PNG, WEBP)', 'error');
      return;
    }

    if (quota.remainingSlots <= 0) {
      showToast(
        `Album ảnh của bạn đã đạt giới hạn tối đa của gói (${quota.totalLimit} ảnh). Vui lòng mua thêm số lượng ảnh hoặc nâng cấp gói!`,
        'error'
      );
      setShowBuySlotsModal(true);
      return;
    }

    let filesToUpload = validFiles;
    let overflowCount = 0;
    if (validFiles.length > quota.remainingSlots) {
      overflowCount = validFiles.length - quota.remainingSlots;
      filesToUpload = validFiles.slice(0, quota.remainingSlots);
      showToast(
        `Gói hiện tại chỉ còn ${quota.remainingSlots} vị trí trống. Hệ thống đang tải ${quota.remainingSlots} ảnh! Vui lòng mua thêm số lượng ảnh để tải tiếp ${overflowCount} ảnh còn lại.`,
        'info'
      );
    }

    setIsUploading(true);
    showToast(`Đang tải và tối ưu ${filesToUpload.length} ảnh từ thiết bị...`, 'info');

    try {
      if (filesToUpload.length === 1) {
        // Single file: put in preview so user can add caption/category, or add immediately
        const compressed = await compressImageFile(filesToUpload[0], { maxWidth: 1600, quality: 0.82 });
        setNewUrl(compressed);
        showToast('Ảnh đã sẵn sàng! Bạn có thể thêm chú thích và bấm "Lưu vào Album"', 'success');
      } else {
        // Multi-file batch upload
        const newPhotos: GalleryPhoto[] = [];
        for (const file of filesToUpload) {
          const compressed = await compressImageFile(file, { maxWidth: 1600, quality: 0.82 });
          newPhotos.push({
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: compressed,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            category: newCategory,
          });
        }
        onChange({
          ...data,
          gallery: [...newPhotos, ...data.gallery],
        });
        showToast(`Đã thêm thành công ${newPhotos.length} ảnh vào Album!`, 'success');

        if (overflowCount > 0) {
          setTimeout(() => {
            setShowBuySlotsModal(true);
          }, 1200);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Có lỗi khi xử lý ảnh, vui lòng thử lại', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleDeletePhoto = (id: string) => {
    onChange({
      ...data,
      gallery: data.gallery.filter((p) => p.id !== id),
    });
    showToast('Đã xóa ảnh', 'info');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.gallery.length) return;

    const updated = [...data.gallery];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    onChange({
      ...data,
      gallery: updated,
    });
  };

  return (
    <div className="space-y-6 font-body">
      {/* 0. QUOTA CAPACITY & ADD-ON STATUS CARD */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FAF6EE] text-[#B38F26] border border-[#D4AF37]/40 flex items-center justify-center font-bold">
                <Camera className="w-4 h-4 text-[#B38F26]" />
              </span>
              <h3 className="font-serif-title text-lg sm:text-xl font-bold text-neutral-900">
                Hạn Mức & Số Lượng Ảnh Album (Bộ Đếm Chung)
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Ảnh kỷ niệm và album ảnh ngày cưới có chung bộ đếm ảnh. Bạn có thể mua thêm số lượng ảnh để tải lên thêm.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onUpgradePackage && quota.packageSlug !== 'vip' && (
              <button
                type="button"
                onClick={onUpgradePackage}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900 border border-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Nâng Cấp Gói</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowBuySlotsModal(true)}
              className="px-4 py-2 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mua Thêm Số Lượng Ảnh</span>
            </button>
          </div>
        </div>

        {/* Quota Gauge Progress Bar */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE]/50 border border-[#D4AF37]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-600">Gói hiện tại:</span>
              <strong className="text-neutral-900 font-bold px-2.5 py-0.5 rounded-full bg-white border border-neutral-200 text-xs">
                {quota.packageName}
              </strong>
              <span className="text-neutral-500 text-[11px]">
                ({quota.baseQuota} ảnh ban đầu
                {quota.extraPurchased > 0 ? (
                  <span className="text-emerald-700 font-semibold"> + {quota.extraPurchased} ảnh mua thêm</span>
                ) : null}
                )
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-600">Bộ đếm chung:</span>
              <strong className="font-mono text-neutral-900 text-sm">
                {quota.currentCount} / {quota.totalLimit} ảnh
              </strong>
              <span className="text-[11px] text-neutral-500">
                ({quota.galleryCount} kỷ niệm + {quota.liveAlbumCount} ngày cưới)
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  quota.remainingSlots === 0
                    ? 'bg-rose-100 text-rose-700'
                    : quota.remainingSlots <= 5
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {quota.remainingSlots === 0 ? 'Đã hết chỗ' : `Còn ${quota.remainingSlots} chỗ`}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white rounded-full h-2.5 overflow-hidden p-0.5 border border-neutral-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                quota.percentageUsed >= 95
                  ? 'bg-rose-500'
                  : quota.percentageUsed >= 75
                  ? 'bg-amber-500'
                  : 'bg-linear-to-r from-[#D4AF37] to-[#B38F26]'
              }`}
              style={{ width: `${Math.min(100, Math.max(4, quota.percentageUsed))}%` }}
            />
          </div>

          {quota.isAtLimit && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Album ảnh đã đạt tối đa hạn mức ({quota.totalLimit} ảnh). Bấm <strong>"Mua Thêm Số Lượng Ảnh"</strong> để tiếp tục tải thêm ảnh mới!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Header & Add form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="text-lg font-semibold font-serif-title text-neutral-900">
            Thêm Ảnh Vào Album Kỷ Niệm
          </h3>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-[#8C7335] hover:text-[#B38F26] flex items-center gap-1 underline underline-offset-2 cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{showUrlInput ? 'Ẩn ô dán link' : 'Hoặc dán link URL ảnh'}</span>
          </button>
        </div>

        {/* Hidden Multi-file input */}
        <input
          ref={fileInputRef}
          id="photo-file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Big Interactive Dropzone for picking photos from machine */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2.5 ${
            isDragging
              ? 'border-[#D4AF37] bg-[#FAF6EE] scale-[1.01]'
              : 'border-neutral-200 hover:border-[#D4AF37] bg-[#FDFBF7] hover:bg-[#FAF6EE]/50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EADFC7] shadow-2xs flex items-center justify-center text-[#B38F26]">
            {isUploading ? (
              <RefreshCw className="w-7 h-7 animate-spin" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>
          <div>
            <p className="text-sm sm:text-base font-semibold text-[#1A1816]">
              {isUploading ? 'Đang xử lý tải ảnh...' : 'Bấm vào đây để chọn ảnh từ máy tính hoặc điện thoại'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Hỗ trợ kéo thả ảnh, chọn 1 hoặc nhiều ảnh cùng lúc (JPG, PNG, WEBP)
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-xl bg-white border border-[#D4AF37]/50 text-[#8C7335] text-xs font-semibold shadow-2xs">
            Chọn ảnh từ thiết bị
          </span>
        </div>

        {/* Single Photo Preview & Save Bar if an image was selected */}
        {newUrl && (
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <img
                src={newUrl}
                alt="Xem trước ảnh"
                className="w-20 h-20 rounded-xl object-cover border border-amber-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-2 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Chú thích ảnh (Ví dụ: Khoảnh khắc trao nhẫn...)"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs sm:text-sm bg-white focus:border-[#D4AF37] outline-none"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs sm:text-sm bg-white focus:border-[#D4AF37] outline-none"
                  >
                    <option value="prewedding">Bộ sưu tập: Pre-Wedding</option>
                    <option value="ceremony">Bộ sưu tập: Lễ Cưới</option>
                    <option value="moments">Bộ sưu tập: Khoảnh Khắc</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddPhoto}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lưu ảnh này vào Album</span>
                  </button>
                  <button
                    onClick={() => setNewUrl('')}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-600 text-xs border border-neutral-200 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optional URL Input field if toggled */}
        {showUrlInput && (
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <label className="block text-xs font-semibold text-neutral-600">
              Dán đường link ảnh (URL trực tiếp):
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-white focus:border-[#D4AF37] outline-none"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-medium cursor-pointer"
              >
                Thêm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photos Grid with reorder & delete */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Danh sách ảnh ({data.gallery.length} ảnh)
          </h4>
          <span className="text-xs text-neutral-400">Dùng mũi tên để đổi thứ tự ảnh</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.gallery.map((photo, idx) => (
            <div
              key={photo.id}
              className="group relative rounded-xl overflow-hidden border border-neutral-200 bg-white shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <img
                  src={photo.url}
                  alt={photo.caption || 'Ảnh cưới'}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Hover control overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-2">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 cursor-pointer"
                    title="Chuyển lên trước"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === data.gallery.length - 1}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 cursor-pointer"
                    title="Chuyển về sau"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-1.5 rounded-lg bg-rose-500/80 text-white hover:bg-rose-600 cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-2 text-[11px] text-neutral-500 truncate">
                {photo.caption || photo.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buy Extra Album Slots Modal */}
      <BuyExtraAlbumSlotsModal
        isOpen={showBuySlotsModal}
        onClose={() => setShowBuySlotsModal(false)}
        weddingData={data}
        onSlotsPurchased={(updated) => onChange(updated)}
        onUpgradePackage={onUpgradePackage}
      />
    </div>
  );
}
