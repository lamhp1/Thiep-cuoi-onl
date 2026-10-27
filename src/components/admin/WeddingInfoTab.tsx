import React from 'react';
import { WeddingData } from '../../types';
import { Globe, Music, Calendar, MapPin, Quote, Sparkles, Check } from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';
import { slugifyVietnamese } from '../../services/siteConfigService';

interface WeddingInfoTabProps {
  data: WeddingData;
  onChange: (data: WeddingData) => void;
}

export function WeddingInfoTab({ data, onChange }: WeddingInfoTabProps) {
  const updateField = <K extends keyof WeddingData>(field: K, value: WeddingData[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAutoSlugFromNames = () => {
    const g = (data.groomName || '').trim();
    const b = (data.brideName || '').trim();
    if (g && b) {
      const generated = slugifyVietnamese(`${g}-${b}`);
      if (generated) {
        onChange({
          ...data,
          slug: generated,
          id: `wedding-${generated}`,
        });
      }
    }
  };

  const handleGroomNameChange = (val: string) => {
    const parts = val.trim().split(' ').filter(Boolean);
    const shortName = parts[parts.length - 1] || val;

    // Auto-update slug if it was default, empty, or generic
    const currentSlug = data.slug || '';
    const isDefaultSlug =
      !currentSlug ||
      currentSlug === 'minh-anh' ||
      currentSlug === 'wedding' ||
      currentSlug.includes('mai-van-hien') ||
      currentSlug.includes('nguyen-hong-nhung') ||
      currentSlug === 'chu-re-co-dau';

    let updatedSlug = currentSlug;
    if (isDefaultSlug && val.trim() && data.brideName) {
      const gen = slugifyVietnamese(`${val.trim()}-${data.brideName.trim()}`);
      if (gen) updatedSlug = gen;
    }

    onChange({
      ...data,
      slug: updatedSlug,
      id: updatedSlug !== currentSlug ? `wedding-${updatedSlug}` : data.id,
      groomName: val,
      groom: {
        ...(data.groom || { role: 'groom', bio: '', avatar: '' }),
        role: 'groom',
        fullName: val,
        name: shortName,
      },
    });
  };

  const handleBrideNameChange = (val: string) => {
    const parts = val.trim().split(' ').filter(Boolean);
    const shortName = parts[parts.length - 1] || val;

    // Auto-update slug if it was default, empty, or generic
    const currentSlug = data.slug || '';
    const isDefaultSlug =
      !currentSlug ||
      currentSlug === 'minh-anh' ||
      currentSlug === 'wedding' ||
      currentSlug.includes('mai-van-hien') ||
      currentSlug.includes('nguyen-hong-nhung') ||
      currentSlug === 'chu-re-co-dau';

    let updatedSlug = currentSlug;
    if (isDefaultSlug && data.groomName && val.trim()) {
      const gen = slugifyVietnamese(`${data.groomName.trim()}-${val.trim()}`);
      if (gen) updatedSlug = gen;
    }

    onChange({
      ...data,
      slug: updatedSlug,
      id: updatedSlug !== currentSlug ? `wedding-${updatedSlug}` : data.id,
      brideName: val,
      bride: {
        ...(data.bride || { role: 'bride', bio: '', avatar: '' }),
        role: 'bride',
        fullName: val,
        name: shortName,
      },
    });
  };

  const sampleCovers = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=85',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=85',
  ];

  const suggestedSlug = (data.groomName && data.brideName)
    ? slugifyVietnamese(`${data.groomName}-${data.brideName}`)
    : '';

  return (
    <div className="space-y-6 font-body text-neutral-800">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
        <h3 className="text-lg font-semibold font-serif-title text-neutral-900 border-b border-neutral-100 pb-3">
          Thông Tin Chung Thiệp Cưới
        </h3>

        {/* Slug URL */}
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              Đường link riêng của đám cưới (Slug)
            </label>
            {suggestedSlug && data.slug !== suggestedSlug && (
              <button
                type="button"
                onClick={handleAutoSlugFromNames}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#FAF6EE] text-[#8C7335] hover:bg-[#F5E8C7] border border-[#D4AF37]/50 transition-colors cursor-pointer"
                title="Tự động chuyển đường link thành tên Cô dâu & Chú rể"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Đặt Slug theo tên: {suggestedSlug}</span>
              </button>
            )}
          </div>

          <div className="flex rounded-xl shadow-sm border border-neutral-200 overflow-hidden focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20">
            <span className="bg-neutral-50 px-3 py-2.5 text-neutral-500 text-xs sm:text-sm border-r border-neutral-200 select-none">
              domain.com/wedding/
            </span>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
              placeholder="ten-chu-re-ten-co-dau"
              className="flex-1 px-3 py-2 text-sm outline-none bg-white font-mono"
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-neutral-400 flex-wrap gap-1">
            <p>
              Khách mời sẽ truy cập thiệp qua: <strong className="text-neutral-700 font-mono">/wedding/{data.slug || 'slug-cua-ban'}</strong>
            </p>
            {suggestedSlug && data.slug === suggestedSlug && (
              <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Đã tối ưu theo tên cô dâu & chú rể</span>
              </span>
            )}
          </div>
        </div>

        {/* Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
              Tên Chú Rể (Hiển thị tiêu đề & thiệp)
            </label>
            <input
              type="text"
              value={data.groomName}
              onChange={(e) => handleGroomNameChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
              Tên Cô Dâu (Hiển thị tiêu đề & thiệp)
            </label>
            <input
              type="text"
              value={data.brideName}
              onChange={(e) => handleBrideNameChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
            />
          </div>
        </div>

        {/* Date & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              Ngày cưới (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={data.weddingDate}
              onChange={(e) => {
                updateField('weddingDate', e.target.value);
                updateField('weddingDateTime', `${e.target.value}T10:00:00`);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              Giờ làm lễ (Đếm ngược)
            </label>
            <input
              type="datetime-local"
              value={data.weddingDateTime?.substring(0, 16) || `${data.weddingDate}T10:00`}
              onChange={(e) => updateField('weddingDateTime', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              Tỉnh / Thành phố
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="TP. Huế"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
            />
          </div>
        </div>

        {/* Quote */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5 flex items-center gap-1">
            <Quote className="w-3.5 h-3.5 text-[#D4AF37]" />
            Câu nói lãng mạn (Quote)
          </label>
          <textarea
            rows={2}
            value={data.romanticQuote}
            onChange={(e) => updateField('romanticQuote', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm resize-none"
          />
        </div>

        {/* Cover Image */}
        <ImageUploadField
          id="wedding-cover-image"
          label="Ảnh bìa Hero chính"
          value={data.coverImage}
          onChange={(val) => updateField('coverImage', val)}
          shape="cover"
          presets={sampleCovers.map((cov, i) => ({
            label: `Mẫu ${i + 1}`,
            url: cov,
          }))}
          helperText="Nên chọn ảnh ngang có độ nét cao từ điện thoại hoặc máy tính để làm ảnh bìa đẹp nhất."
        />

        {/* Music URL */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5 flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
            Nhạc nền đám cưới (Audio MP3 URL)
          </label>
          <input
            type="url"
            value={data.musicUrl || ''}
            onChange={(e) => updateField('musicUrl', e.target.value)}
            placeholder="Để trống để sử dụng giai điệu piano Canon in D lãng mạn tích hợp sẵn"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-sm"
          />
          <p className="mt-1 text-xs text-neutral-400">
            Nếu để trống, hệ thống sẽ phát bản hòa tấu piano & harp Canon in D bằng Web Audio API mượt mà không bị lỗi tải mạng.
          </p>
        </div>
      </div>
    </div>
  );
}
