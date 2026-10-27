import React from 'react';
import { Heart, Mail, Phone, MapPin, ShieldCheck, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { SiteContentConfig } from '../../types/commercial';
import { getSiteContentConfig } from '../../services/siteConfigService';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
  siteContent?: SiteContentConfig;
}

export function PublicFooter({ onNavigate, siteContent }: PublicFooterProps) {
  const [content, setContent] = React.useState<SiteContentConfig>(siteContent || getSiteContentConfig());

  React.useEffect(() => {
    if (siteContent) setContent(siteContent);
  }, [siteContent]);

  React.useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContentConfig>;
      if (customEvent.detail) setContent(customEvent.detail);
      else setContent(getSiteContentConfig());
    };
    window.addEventListener('lamour_site_content_updated', handleUpdate);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('lamour_wedding_sync');
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'SITE_CONTENT_UPDATED' && ev.data?.config) {
          setContent(ev.data.config);
        }
      };
    } catch {}

    return () => {
      window.removeEventListener('lamour_site_content_updated', handleUpdate);
      if (bc) {
        try { bc.close(); } catch {}
      }
    };
  }, []);
  const cleanPhone = (content.hotline || '0905 123 456').replace(/\s+/g, '');
  const cleanZalo = (content.zaloNumber || content.hotline || '0905 123 456').replace(/\D/g, '');

  return (
    <footer className="bg-[#181615] text-[#E5DFD7] pt-16 pb-12 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-neutral-800">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              </div>
              <span className="font-script text-3xl text-[#E5C058] leading-none">
                {content.brandName || "L'Amour Wedding"}
              </span>
            </div>
            <p className="font-body text-xs text-[#A8A199] leading-relaxed">
              {content.brandTagline ||
                'Nền tảng thiệp cưới online cao cấp, mang lại trải nghiệm thiệp cưới số sang trọng, cá nhân hóa từng câu chuyện tình yêu và tối ưu chi phí hoàn hảo cho ngày trọng đại.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#D4AF37] flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% An Toàn & Bảo Mật
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <Clock className="w-3.5 h-3.5" />
                Kích Hoạt Nhanh 2H
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-4">
              Khám Phá Nhanh
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C2BCB4]">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trang chủ giới thiệu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/templates')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kho mẫu thiệp cưới (5+ phong cách)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bảng giá & Các gói dịch vụ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/order')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Đăng ký đặt thiệp cưới
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/lookup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tra cứu đơn hàng & Thiệp của tôi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cam kết chất lượng */}
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-4">
              Đặc Quyền Dịch Vụ
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A199]">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Không giới hạn số lượt khách mời truy cập</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Tương thích hoàn hảo mọi điện thoại & tablet</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Tích hợp quét mã mừng cưới VietQR 40+ ngân hàng</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Hỗ trợ tải ảnh chất lượng gốc sắc nét</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Hỗ trợ kỹ thuật 24/7 trước & trong lễ cưới</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hotlines */}
          <div className="space-y-3">
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-4">
              Liên Hệ Trực Tiếp Admin
            </h4>
            <div className="space-y-2 text-xs text-[#C2BCB4]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white">
                  Hotline: <strong>{content.hotline || '0905 123 456'}</strong>
                </a>
              </div>
              {content.zaloNumber && (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold shrink-0">
                    Z
                  </span>
                  <a
                    href={`https://zalo.me/${cleanZalo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white text-blue-400 font-semibold"
                  >
                    Zalo tư vấn: <strong>{content.zaloNumber}</strong>
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${content.supportEmail || 'contact@lamourwedding.vn'}`} className="hover:text-white">
                  {content.supportEmail || 'contact@lamourwedding.vn'}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  {content.address || 'Hà Nội & TP. Hồ Chí Minh (Phục vụ khách hàng toàn quốc & kiều bào)'}
                </span>
              </div>
            </div>

            <div className="pt-3">
              <button
                id="footer-cta-order-btn"
                onClick={() => onNavigate('/order')}
                className="w-full py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B38F26] text-[#181615] font-body text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gửi Yêu Cầu Tư Vấn Ngay</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#807971] gap-4">
          <p>© 2026 {content.brandName || "L'Amour Wedding"} Platform. Bản quyền thuộc về Đơn vị phát triển Thiệp Cưới Số.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-neutral-400 cursor-pointer">Điều khoản dịch vụ</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="text-[#605A53] hover:text-[#D4AF37] transition-colors cursor-pointer text-[11px]"
              title="Cổng quản trị dành cho chủ nền tảng"
            >
              Quản Trị Hệ Thống
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
