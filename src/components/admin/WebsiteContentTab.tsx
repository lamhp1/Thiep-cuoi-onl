import React, { useState, useEffect } from 'react';
import { SiteContentConfig } from '../../types/commercial';
import {
  getSiteContentConfig,
  saveSiteContentConfig,
  fetchSiteContentConfigFromFirestore,
} from '../../services/siteConfigService';
import {
  Globe,
  Save,
  Phone,
  MessageSquare,
  Mail,
  Megaphone,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  MapPin,
  Type,
  Layout,
  MousePointerClick,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface WebsiteContentTabProps {
  onNavigateToPublic?: () => void;
}

export function WebsiteContentTab({ onNavigateToPublic }: WebsiteContentTabProps) {
  const { showToast } = useToast();
  const [config, setConfig] = useState<SiteContentConfig>(getSiteContentConfig());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSiteContentConfigFromFirestore().then((remote) => {
      if (remote) setConfig(remote);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSiteContentConfig(config);
      showToast('Đã lưu cấu hình và cập nhật tức thì ra toàn bộ Trang chủ, Header & Footer!', 'success');
    } catch {
      showToast('Lỗi khi lưu cấu hình nội dung', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-neutral-900 text-base sm:text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#D4AF37]" />
            <span>Quản Lý Nội Dung Website Bán Hàng & Trang Chủ</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Mọi thay đổi tại đây được đồng bộ tức thì ra Trang chủ, Header, Banner khuyến mãi và Footer
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {onNavigateToPublic && (
            <button
              type="button"
              onClick={async () => {
                await saveSiteContentConfig(config);
                onNavigateToPublic();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F3EDE2] text-[#8C7335] border border-[#D4AF37]/40 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Lưu và chuyển trực tiếp ra Trang Chủ trên cùng tab"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Xem Trang Chủ</span>
            </button>
          )}

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            onClick={() => saveSiteContentConfig(config)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-medium shadow-2xs transition-colors"
            title="Mở trang chủ trong tab mới"
          >
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            <span>Mở Tab Mới</span>
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column 1: Brand & Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>Thông Tin Thương Hiệu & Liên Hệ</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Tên thương hiệu (Hiển thị Logo & Header)
              </label>
              <input
                type="text"
                value={config.brandName || ''}
                onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                placeholder="VD: L'Amour Wedding"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Slogan / Định vị thương hiệu
              </label>
              <input
                type="text"
                value={config.brandTagline || ''}
                onChange={(e) => setConfig({ ...config, brandTagline: e.target.value })}
                placeholder="VD: Nền tảng thiệp cưới trực tuyến sang trọng & nghệ thuật"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Hotline tư vấn (Click gọi)
                </label>
                <input
                  type="text"
                  value={config.hotline || ''}
                  onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
                  placeholder="VD: 0905 123 456"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Số Zalo tiếp nhận khách
                </label>
                <input
                  type="text"
                  value={config.zaloNumber || ''}
                  onChange={(e) => setConfig({ ...config, zaloNumber: e.target.value })}
                  placeholder="VD: 0905 123 456"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Email CSKH / Hỗ trợ
              </label>
              <input
                type="email"
                value={config.supportEmail || ''}
                onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                placeholder="VD: contact@lamourwedding.vn"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Địa chỉ văn phòng / Showroom (Footer)
              </label>
              <input
                type="text"
                value={config.address || ''}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="VD: Hà Nội & TP. Hồ Chí Minh (Phục vụ khách hàng toàn quốc & kiều bào)"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Right Column 2: Hero Section Heading & Subheading */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Type className="w-4 h-4 text-[#D4AF37]" />
            <span>Nội Dung Banner Chính Trang Chủ (Hero Section)</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Tiêu đề lớn trang chủ (Hero Heading)
              </label>
              <textarea
                rows={2}
                value={config.heroHeading || ''}
                onChange={(e) => setConfig({ ...config, heroHeading: e.target.value })}
                placeholder="VD: Thiết Kế Thiệp Cưới Điện Tử Tinh Hoa & Đầy Cảm Xúc"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Đoạn văn giới thiệu phụ (Hero Subheading)
              </label>
              <textarea
                rows={3}
                value={config.heroSubheading || ''}
                onChange={(e) => setConfig({ ...config, heroSubheading: e.target.value })}
                placeholder="VD: Biến câu chuyện tình yêu của hai bạn thành tác phẩm nghệ thuật trực tuyến với trải nghiệm tương tác đỉnh cao..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Chữ trên nút đặt thiệp Hero (Nút bấm chính)
              </label>
              <input
                type="text"
                value={config.heroCtaText || ''}
                onChange={(e) => setConfig({ ...config, heroCtaText: e.target.value })}
                placeholder="VD: Đặt Thiệp Cưới Ngay"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            {/* Live Preview of Hero Text */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-neutral-400 block uppercase tracking-wider">
                Xem trước tiêu đề trang chủ:
              </span>
              <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#D4AF37]/30 space-y-2">
                <h4 className="font-serif-title text-base sm:text-lg font-bold text-[#1A1816]">
                  {config.heroHeading || 'Thiết Kế Thiệp Cưới Điện Tử Tinh Hoa & Đầy Cảm Xúc'}
                </h4>
                <p className="font-body text-xs text-[#5E564F] leading-relaxed line-clamp-3">
                  {config.heroSubheading || 'Biến câu chuyện tình yêu của hai bạn thành tác phẩm nghệ thuật trực tuyến với trải nghiệm tương tác đỉnh cao...'}
                </p>
                <div className="pt-1">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4AF37] text-white text-[11px] font-bold uppercase tracking-wider">
                    {config.heroCtaText || 'Đặt Thiệp Cưới Ngay'} →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Promotional Banner Announcement (Full Width) */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-amber-500" />
              <span>Thanh Banner Thông Báo Khuyến Mãi Trên Cùng Website (Top Announcement Bar)</span>
            </h3>

            <button
              type="button"
              onClick={() => setConfig({ ...config, bannerEnabled: !config.bannerEnabled })}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                config.bannerEnabled
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {config.bannerEnabled ? '✓ Đang bật hiển thị' : 'Đã tắt ẩn'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Huy hiệu nổi bật (Badge)
                </label>
                <input
                  type="text"
                  value={config.bannerBadge || ''}
                  onChange={(e) => setConfig({ ...config, bannerBadge: e.target.value })}
                  placeholder="VD: Ưu Đãi Mùa Cưới 2026"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 block">
                  Nội dung thông điệp khuyến mãi
                </label>
                <textarea
                  rows={2}
                  value={config.bannerText || ''}
                  onChange={(e) => setConfig({ ...config, bannerText: e.target.value })}
                  placeholder="VD: Tặng ngay 1 năm lưu trữ & trọn bộ hiệu ứng mở phong bì điện ảnh cho tất cả các gói"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Live Banner Preview Box */}
            <div className="space-y-2 flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-neutral-400 block uppercase tracking-wider">
                Xem trước thanh thông báo trên đỉnh website:
              </span>
              {config.bannerEnabled ? (
                <div className="bg-[#181615] text-white p-3 rounded-xl flex items-center justify-between text-xs gap-3 border border-[#D4AF37]/40 shadow-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      {config.bannerBadge || 'Ưu Đãi'}
                    </span>
                    <span className="text-neutral-200 text-xs truncate">
                      {config.bannerText || 'Nội dung thông báo khuyến mãi hiển thị tại đây'}
                    </span>
                  </div>
                  <span className="text-[#D4AF37] text-xs shrink-0 font-medium whitespace-nowrap">
                    Xem Ngay →
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-neutral-300 text-center text-xs text-neutral-400">
                  Thanh thông báo đang ở trạng thái TẮT. Bật công tắc phía trên để hiển thị cho khách truy cập.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Section Headings Customization */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 lg:col-span-2">
          <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#D4AF37]" />
            <span>Tùy Biến Tiêu Đề Các Khối Trên Trang Chủ (Section Headings)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Tiêu đề khối Tính năng đặc sắc
              </label>
              <input
                type="text"
                value={config.featuresHeading || ''}
                onChange={(e) => setConfig({ ...config, featuresHeading: e.target.value })}
                placeholder="VD: Tính Năng Hiện Đại Dành Riêng Cho Đám Cưới"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Tiêu đề khối Bảng giá dịch vụ
              </label>
              <input
                type="text"
                value={config.pricingHeading || ''}
                onChange={(e) => setConfig({ ...config, pricingHeading: e.target.value })}
                placeholder="VD: Chi Phí Trọn Gói, Không Phát Sinh"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Tiêu đề khối kêu gọi cuối trang (Bottom CTA Banner)
              </label>
              <input
                type="text"
                value={config.ctaBannerHeading || ''}
                onChange={(e) => setConfig({ ...config, ctaBannerHeading: e.target.value })}
                placeholder="VD: Sẵn Sàng Cho Một Đám Cưới Đáng Nhớ?"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700 block">
                Nội dung phụ khối kêu gọi cuối trang
              </label>
              <textarea
                rows={2}
                value={config.ctaBannerSubheading || ''}
                onChange={(e) => setConfig({ ...config, ctaBannerSubheading: e.target.value })}
                placeholder="VD: Chỉ mất 2 phút để gửi yêu cầu đặt thiệp. Chúng tôi sẽ liên hệ tư vấn mẫu phù hợp nhất với phong cách của hai bạn ngay hôm nay."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
