import React, { useState, useRef } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  RefreshCw,
  Sparkles,
  Clock,
  Eye,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Info,
} from 'lucide-react';
import { WeddingData, LiveAlbumPhoto } from '../../types';
import {
  ensureLiveAlbumConfig,
  getLiveAlbumQuota,
} from '../../services/liveAlbumService';
import { compressImageFile } from '../../lib/imageUtils';
import { useToast } from '../ui/Toast';
import { BuyExtraAlbumSlotsModal } from '../portal/BuyExtraAlbumSlotsModal';
import { WeddingLiveAlbumModal } from '../wedding/live-album/WeddingLiveAlbumModal';

interface LiveAlbumTabProps {
  data: WeddingData;
  onChange: (updated: WeddingData) => void;
  onUpgradePackage?: () => void;
}

export function LiveAlbumTab({ data, onChange, onUpgradePackage }: LiveAlbumTabProps) {
  const { showToast } = useToast();
  const liveAlbum = ensureLiveAlbumConfig(data);
  const quota = getLiveAlbumQuota(data);

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [buySlotsModalOpen, setBuySlotsModalOpen] = useState(false);
  const [previewAlbumOpen, setPreviewAlbumOpen] = useState(false);

  // Single photo add form state
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newTakenAt, setNewTakenAt] = useState('');
  const [newPhase, setNewPhase] = useState<'preparation' | 'ceremony' | 'reception' | 'afterparty' | 'moments'>('ceremony');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos = liveAlbum.photos || [];

  const handleProcessFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Vui lòng chọn tệp ảnh hợp lệ (JPG, PNG, WEBP)', 'error');
      return;
    }

    // Check quota
    const slotsRemaining = quota.remainingSlots;
    if (slotsRemaining <= 0) {
      showToast(
        `Album của bạn đã đạt giới hạn tối đa (${quota.totalLimit} ảnh). Vui lòng mua thêm dung lượng hoặc nâng cấp gói!`,
        'error'
      );
      setBuySlotsModalOpen(true);
      return;
    }

    const filesToUpload = validFiles.slice(0, slotsRemaining);
    if (validFiles.length > slotsRemaining) {
      showToast(
        `Chỉ còn ${slotsRemaining} vị trí trống trong gói. Hệ thống sẽ tải ${slotsRemaining} ảnh đầu tiên.`,
        'info'
      );
    }

    setIsUploading(true);
    showToast(`Đang nén và tối ưu ${filesToUpload.length} ảnh trực tiếp ngày cưới...`, 'info');

    try {
      const newPhotos: LiveAlbumPhoto[] = [];
      const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const compressed = await compressImageFile(file, { maxWidth: 1920, quality: 0.85 });
        const cleanName = file.name.replace(/\.[^/.]+$/, '');

        newPhotos.push({
          id: `live-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          url: compressed,
          caption: cleanName.length > 2 ? cleanName : 'Khoảnh khắc ngày cưới',
          takenAt: nowStr,
          phase: newPhase,
          likesCount: Math.floor(Math.random() * 15) + 5,
          uploadedAt: new Date().toISOString(),
        });
      }

      const updatedLive = {
        ...liveAlbum,
        photos: [...newPhotos, ...photos],
      };

      onChange({
        ...data,
        liveAlbum: updatedLive,
      });

      showToast(`Đã thêm thành công ${newPhotos.length} ảnh vào Album Ngày Cưới!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Có lỗi khi xử lý tải ảnh, vui lòng thử lại', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddSingleUrlPhoto = () => {
    if (!newUrl.trim()) {
      showToast('Vui lòng nhập đường link ảnh', 'error');
      return;
    }

    if (quota.remainingSlots <= 0) {
      showToast(
        `Album của bạn đã đạt giới hạn tối đa (${quota.totalLimit} ảnh). Vui lòng mua thêm dung lượng!`,
        'error'
      );
      setBuySlotsModalOpen(true);
      return;
    }

    const newPhoto: LiveAlbumPhoto = {
      id: `live-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: newUrl.trim(),
      caption: newCaption.trim() || 'Khoảnh khắc ngày cưới',
      takenAt: newTakenAt.trim() || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      phase: newPhase,
      likesCount: 10,
      uploadedAt: new Date().toISOString(),
    };

    onChange({
      ...data,
      liveAlbum: {
        ...liveAlbum,
        photos: [newPhoto, ...photos],
      },
    });

    setNewUrl('');
    setNewCaption('');
    setNewTakenAt('');
    showToast('Đã thêm ảnh vào Album Ngày Cưới', 'success');
  };

  const handleDeletePhoto = (id: string) => {
    onChange({
      ...data,
      liveAlbum: {
        ...liveAlbum,
        photos: photos.filter((p) => p.id !== id),
      },
    });
    showToast('Đã xóa ảnh khỏi album', 'info');
  };

  const handleMovePhoto = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= photos.length) return;

    const list = [...photos];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    onChange({
      ...data,
      liveAlbum: {
        ...liveAlbum,
        photos: list,
      },
    });
  };

  const handleUpdatePhotoField = (id: string, field: keyof LiveAlbumPhoto, value: any) => {
    const updatedPhotos = photos.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });

    onChange({
      ...data,
      liveAlbum: {
        ...liveAlbum,
        photos: updatedPhotos,
      },
    });
  };

  return (
    <div className="space-y-6 font-body">
      {/* 1. QUOTA & CAPACITY STATUS CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                📸
              </span>
              <h3 className="font-serif-title text-lg sm:text-xl font-bold text-neutral-900">
                Album Ảnh Chụp Lúc Đám Cưới Diễn Ra (Live Album)
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Ảnh kỷ niệm và album ảnh ngày cưới dùng chung bộ đếm ảnh. Bạn có thể mua thêm số lượng ảnh để tải lên thêm.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewAlbumOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>Xem Thử Album Trên Thiệp</span>
            </button>

            <button
              type="button"
              onClick={() => setBuySlotsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mua Thêm Dung Lượng</span>
            </button>
          </div>
        </div>

        {/* Quota Progress Gauge */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-600">Gói hiện tại:</span>
              <strong className="text-neutral-900 uppercase font-bold px-2.5 py-0.5 rounded-full bg-white border border-neutral-200 text-xs">
                {quota.packageName}
              </strong>
              <span className="text-neutral-500 text-[11px]">
                ({quota.baseQuota} ảnh ban đầu
                {quota.extraPurchased > 0 ? (
                  <span className="text-emerald-700 font-semibold"> + {quota.extraPurchased} mua thêm</span>
                ) : null}
                )
              </span>
            </div>

            <div className="text-right flex items-center gap-2 flex-wrap sm:justify-end">
              <span className="text-neutral-600 font-medium">Bộ đếm chung:</span>
              <strong className="text-neutral-900 font-mono text-sm">{quota.currentCount}</strong>
              <span className="text-neutral-500"> / {quota.totalLimit} ảnh</span>
              <span className="text-[11px] text-neutral-500">
                ({quota.galleryCount} kỷ niệm + {quota.liveAlbumCount} ngày cưới)
              </span>
              {quota.extraPurchased > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  (+{quota.extraPurchased} mua thêm)
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-neutral-200 overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                quota.percentageUsed > 90
                  ? 'bg-rose-500'
                  : quota.percentageUsed > 70
                  ? 'bg-amber-500'
                  : 'bg-linear-to-r from-[#D4AF37] to-[#8C7335]'
              }`}
              style={{ width: `${quota.percentageUsed}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
            <span>
              {quota.remainingSlots > 0 ? (
                <>
                  Còn lại: <strong className="text-emerald-700">{quota.remainingSlots} ảnh</strong> có thể tải thêm
                </>
              ) : (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Đã sử dụng hết hạn mức ảnh của gói!
                </span>
              )}
            </span>

            {quota.remainingSlots <= 5 && (
              <button
                type="button"
                onClick={() => setBuySlotsModalOpen(true)}
                className="text-[#8C7335] font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Nâng thêm ảnh ngay (+25 / +60 / +150)</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PHOTO UPLOADER SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h4 className="text-base font-bold font-serif-title text-neutral-900">
            Tải Ảnh Ngày Cưới Lên Album
          </h4>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{showUrlInput ? 'Ẩn link URL' : 'Hoặc thêm bằng link ảnh'}</span>
            </button>
          </div>
        </div>

        {/* Hidden Multi-file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleProcessFiles(e.target.files);
            }
          }}
          className="hidden"
        />

        {/* Big Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleProcessFiles(e.dataTransfer.files);
            }
          }}
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
              {isUploading
                ? 'Đang nén và tải ảnh lên...'
                : 'Bấm vào đây để chọn ảnh chụp trong đám cưới từ điện thoại / máy tính'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Hỗ trợ chọn nhiều ảnh cùng lúc (JPG, PNG, WEBP). Hệ thống tự động nén tối ưu hiển thị siêu nhanh!
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-xl bg-white border border-[#D4AF37]/50 text-[#8C7335] text-xs font-semibold shadow-2xs">
            Chọn ảnh từ thiết bị
          </span>
        </div>

        {/* Phase choice bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 pt-1">
          <span className="font-semibold text-neutral-700">Mục mặc định khi tải lên:</span>
          {[
            { id: 'preparation', label: 'Chuẩn bị' },
            { id: 'ceremony', label: 'Gia Tiên & Rước Dâu' },
            { id: 'reception', label: 'Tiệc Cưới' },
            { id: 'afterparty', label: 'After-Party' },
            { id: 'moments', label: 'Khoảnh Khắc' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setNewPhase(cat.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                newPhase === cat.id
                  ? 'bg-neutral-900 text-white font-bold'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Optional URL input box */}
        {showUrlInput && (
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <h5 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
              Thêm ảnh bằng đường link trực tiếp (URL):
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-white focus:border-[#D4AF37] outline-none"
              />
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Chú thích ảnh (Ví dụ: Trao nhẫn...)"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-white focus:border-[#D4AF37] outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTakenAt}
                  onChange={(e) => setNewTakenAt(e.target.value)}
                  placeholder="Giờ chụp (VD: 10:30)"
                  className="w-28 px-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-white focus:border-[#D4AF37] outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSingleUrlPhoto}
                  className="flex-1 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-semibold cursor-pointer"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. PHOTOS LIST WITH ORDER & METADATA EDIT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Danh sách ảnh ngày cưới ({photos.length} ảnh)
          </h4>
          <span className="text-xs text-neutral-400">
            Dùng mũi tên để đổi thứ tự ảnh xuất hiện trên thiệp
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-3">
            <Camera className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-neutral-500 text-sm">Chưa có ảnh nào trong Album Ngày Cưới.</p>
            <p className="text-xs text-neutral-400">
              Hãy bấm tải ảnh ở trên để cập nhật những khoảnh khắc tuyệt vời nhất cho quan khách!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="p-3 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between gap-3 group"
              >
                <div className="flex gap-3">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Ảnh ngày cưới'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {photo.takenAt && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px]">
                        {photo.takenAt}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase font-semibold">
                        Chú thích:
                      </label>
                      <input
                        type="text"
                        value={photo.caption || ''}
                        onChange={(e) => handleUpdatePhotoField(photo.id, 'caption', e.target.value)}
                        placeholder="Nhập chú thích khoảnh khắc..."
                        className="w-full px-2 py-1 rounded border border-neutral-200 text-xs outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase font-semibold">
                          Giờ chụp:
                        </label>
                        <input
                          type="text"
                          value={photo.takenAt || ''}
                          onChange={(e) => handleUpdatePhotoField(photo.id, 'takenAt', e.target.value)}
                          placeholder="VD: 10:30"
                          className="w-full px-2 py-1 rounded border border-neutral-200 text-xs outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-neutral-400 uppercase font-semibold">
                          Giai đoạn:
                        </label>
                        <select
                          value={photo.phase || 'ceremony'}
                          onChange={(e) => handleUpdatePhotoField(photo.id, 'phase', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-neutral-200 text-xs outline-none focus:border-[#D4AF37]"
                        >
                          <option value="preparation">Chuẩn bị</option>
                          <option value="ceremony">Gia Tiên</option>
                          <option value="reception">Tiệc Cưới</option>
                          <option value="afterparty">After-Party</option>
                          <option value="moments">Khoảnh Khắc</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-2 text-xs">
                  <span className="text-[11px] text-neutral-400">#{idx + 1}</span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMovePhoto(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-neutral-100 text-neutral-600 disabled:opacity-30 cursor-pointer"
                      title="Lên trước"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePhoto(idx, 'down')}
                      disabled={idx === photos.length - 1}
                      className="p-1 rounded hover:bg-neutral-100 text-neutral-600 disabled:opacity-30 cursor-pointer"
                      title="Xuống sau"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-1 rounded hover:bg-rose-50 text-rose-600 cursor-pointer ml-1"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Extra Slots Modal */}
      {buySlotsModalOpen && (
        <BuyExtraAlbumSlotsModal
          isOpen={buySlotsModalOpen}
          onClose={() => setBuySlotsModalOpen(false)}
          weddingData={data}
          onSlotsPurchased={(updated) => {
            onChange(updated);
          }}
          onUpgradePackage={onUpgradePackage}
        />
      )}

      {/* Preview Live Album Modal */}
      {previewAlbumOpen && (
        <WeddingLiveAlbumModal
          isOpen={previewAlbumOpen}
          onClose={() => setPreviewAlbumOpen(false)}
          wedding={data}
          onOpenUpgradeOrAddon={() => {
            setPreviewAlbumOpen(false);
            setBuySlotsModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
