import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, RefreshCw, Trash2, Link as LinkIcon, Check, Sparkles } from 'lucide-react';
import { compressImageFile, CompressImageOptions } from '../../lib/imageUtils';

export interface ImageUploadFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  shape?: 'circle' | 'square' | 'cover' | 'qr';
  compressionOptions?: CompressImageOptions;
  presets?: { label?: string; url: string }[];
  allowUrlFallback?: boolean;
}

export function ImageUploadField({
  id = `img-upload-${Math.random().toString(36).substring(2, 9)}`,
  label,
  value,
  onChange,
  helperText,
  shape = 'square',
  compressionOptions,
  presets = [],
  allowUrlFallback = true,
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ (JPG, PNG, WEBP, GIF).');
      return;
    }

    try {
      setIsProcessing(true);
      const compressed = await compressImageFile(file, compressionOptions);
      onChange(compressed);
      setUrlDraft(compressed);
    } catch (err) {
      console.error('Lỗi khi nén ảnh:', err);
      // Fallback: direct FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = e.target?.result as string;
        onChange(res);
        setUrlDraft(res);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input value so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const hasImage = Boolean(value && value.trim());

  // Determine preview container classes based on shape
  const getShapeClasses = () => {
    switch (shape) {
      case 'circle':
        return 'w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-[#D4AF37]/50 shadow-sm';
      case 'cover':
        return 'w-full aspect-21/9 sm:aspect-16/7 max-h-56 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm';
      case 'qr':
        return 'w-36 h-36 rounded-2xl overflow-hidden p-2 bg-white border border-neutral-200 shadow-sm';
      case 'square':
      default:
        return 'w-28 h-28 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs uppercase tracking-wider text-neutral-600 font-semibold flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{label}</span>
          </label>
          {allowUrlFallback && (
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] text-[#8C7335] hover:text-[#B38F26] flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'Ẩn ô nhập link' : 'Hoặc dán link ảnh'}</span>
            </button>
          )}
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload Box & Preview */}
      {hasImage ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-3 rounded-2xl bg-[#FDFBF7] border border-[#EADFC7]">
          {/* Image Preview - click to change photo */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer ${getShapeClasses()}`}
            title="Bấm để chọn ảnh khác từ máy"
          >
            <img
              src={value}
              alt="Ảnh đã chọn"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Upload className="w-5 h-5 drop-shadow-sm" />
            </div>
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="h-9 w-9 rounded-xl bg-white hover:bg-[#FAF6EE] text-[#B38F26] hover:text-[#916E16] border border-[#D4AF37]/60 hover:border-[#D4AF37] flex items-center justify-center shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Chọn ảnh khác từ máy"
                aria-label="Chọn ảnh khác từ máy"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 text-[#B38F26] animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-[#B38F26]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setUrlDraft('');
                }}
                className="h-9 w-9 rounded-xl bg-white hover:bg-red-50 text-neutral-500 hover:text-red-600 border border-neutral-200 hover:border-red-200 flex items-center justify-center shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Xóa ảnh"
                aria-label="Xóa ảnh"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã tải ảnh thành công từ thiết bị của bạn</span>
            </p>
          </div>
        </div>
      ) : (
        /* Empty state: Dropzone & File picker */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-5 sm:p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#D4AF37] bg-[#FAF6EE] scale-[1.01]'
              : 'border-neutral-300 hover:border-[#D4AF37] bg-white hover:bg-[#FAF6EE]/30'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] border border-[#EADFC7] flex items-center justify-center text-[#B38F26] shadow-2xs">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-xs sm:text-sm font-semibold text-[#1A1816]">
              {isProcessing ? 'Đang xử lý và tối ưu ảnh...' : 'Bấm vào đây để chọn ảnh trong máy'}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Hoặc kéo thả file ảnh trực tiếp vào đây (Hỗ trợ JPG, PNG, WEBP)
            </p>
          </div>

          <button
            type="button"
            className="mt-1 px-4 py-1.5 rounded-xl bg-[#FAF6EE] border border-[#D4AF37]/50 text-[#8C7335] text-xs font-semibold hover:bg-[#D4AF37] hover:text-white transition-all pointer-events-none"
          >
            Chọn file từ thiết bị
          </button>
        </div>
      )}

      {/* Fallback direct URL input if toggled */}
      {showUrlInput && (
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 animate-fadeIn">
          <label className="text-[11px] font-semibold text-neutral-600 block">
            Hoặc dán trực tiếp đường link ảnh (URL):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:border-[#D4AF37] focus:outline-hidden font-mono bg-white"
            />
            <button
              type="button"
              onClick={() => onChange(urlDraft.trim())}
              className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-semibold cursor-pointer shrink-0"
            >
              Áp dụng link
            </button>
          </div>
        </div>
      )}

      {/* Quick Presets if provided */}
      {presets.length > 0 && (
        <div className="pt-1 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Mẫu có sẵn:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setUrlDraft(preset.url);
                }}
                className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  value === preset.url
                    ? 'border-[#D4AF37] scale-105 shadow-xs ring-2 ring-[#D4AF37]/30'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-neutral-300'
                }`}
                title={preset.label || `Mẫu ảnh ${idx + 1}`}
              >
                <img
                  src={preset.url}
                  alt={preset.label || `Mẫu ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
