import React, { useState, useEffect } from 'react';
import { Lead, SiteContentConfig } from '../../types/commercial';
import { getLeadById, findLeadByPhoneOrCode, getLeads } from '../../services/leadService';
import { getSiteContentConfig, fetchSiteContentConfigFromFirestore, slugifyVietnamese } from '../../services/siteConfigService';
import {
  Search,
  Heart,
  Calendar,
  Package,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface OrderLookupPageProps {
  onNavigate: (path: string) => void;
  onOpenCouplePortal: (lead: Lead) => void;
  initialCode?: string;
}

export function OrderLookupPage({
  onNavigate,
  onOpenCouplePortal,
  initialCode = '',
}: OrderLookupPageProps) {
  const { showToast } = useToast();
  const [queryText, setQueryText] = useState(initialCode);
  const [isSearching, setIsSearching] = useState(false);
  const [foundLead, setFoundLead] = useState<Lead | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
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

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = async (textToSearch?: string) => {
    const text = (textToSearch !== undefined ? textToSearch : queryText).trim();
    if (!text) {
      showToast('Vui lòng nhập mã đơn hàng hoặc số điện thoại', 'info');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const result = await findLeadByPhoneOrCode(text);
      if (result) {
        let savedTemplate = result.template;
        if (typeof window !== 'undefined') {
          const nameSlug = result.groomName && result.brideName
            ? slugifyVietnamese(`${result.groomName}-${result.brideName}`)
            : '';
          const candidateKeys = [
            `lamour_wedding_data_${result.id}`,
            nameSlug ? `lamour_wedding_data_${nameSlug}` : null,
            nameSlug ? `lamour_wedding_data_wedding-${nameSlug}` : null,
          ].filter(Boolean) as string[];

          for (const key of candidateKeys) {
            const raw = localStorage.getItem(key);
            if (raw) {
              try {
                const parsed = JSON.parse(raw);
                if (parsed?.template) {
                  savedTemplate = parsed.template;
                  break;
                }
              } catch {}
            }
          }
        }
        setFoundLead({
          ...result,
          template: savedTemplate || result.template || 'classic-luxury',
        });
      } else {
        setFoundLead(null);
        showToast('Không tìm thấy đơn hàng tương ứng. Vui lòng kiểm tra lại.', 'error');
      }
    } catch (err) {
      console.error('Lookup error:', err);
      showToast('Lỗi khi tra cứu đơn hàng', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsSearching(true);
    try {
      const all = await getLeads();
      const demoLead = all.find((l) => l.id === 'LAMOUR-DEMO') || all[0];
      if (demoLead) {
        let savedTemplate = demoLead.template;
        if (typeof window !== 'undefined') {
          const candidateKeys = [
            `lamour_wedding_data_${demoLead.id}`,
            'lamour_wedding_data_hoang-long-thu-ha',
            'lamour_wedding_data_wedding-hoang-long-thu-ha',
            'lamour_wedding_data_minh-anh',
          ];
          for (const key of candidateKeys) {
            const raw = localStorage.getItem(key);
            if (raw) {
              try {
                const parsed = JSON.parse(raw);
                if (parsed?.template) {
                  savedTemplate = parsed.template;
                  break;
                }
              } catch {}
            }
          }
        }
        const effective = {
          ...demoLead,
          template: savedTemplate || demoLead.template || 'classic-luxury',
        };
        setQueryText(effective.id);
        setFoundLead(effective);
        setHasSearched(true);
      } else {
        // Create mock lead for demo
        let savedTemplate = 'classic-luxury';
        if (typeof window !== 'undefined') {
          const raw =
            localStorage.getItem('lamour_wedding_data_LAMOUR-DEMO') ||
            localStorage.getItem('lamour_wedding_data_hoang-long-thu-ha') ||
            localStorage.getItem('lamour_wedding_data_minh-anh');
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed?.template) savedTemplate = parsed.template;
            } catch {}
          }
        }
        const mockLead: Lead = {
          id: 'LAMOUR-DEMO',
          name: 'Hoàng Long & Thu Hà',
          groomName: 'Hoàng Long',
          brideName: 'Thu Hà',
          phone: '0905123456',
          email: 'hoanglong.thuha@gmail.com',
          package: 'premium',
          template: savedTemplate,
          weddingDate: '2026-10-25',
          status: 'PAID',
          createdAt: new Date().toISOString(),
        };
        setFoundLead(mockLead);
        setQueryText(mockLead.id);
        setHasSearched(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusDisplay = (status: Lead['status']) => {
    switch (status) {
      case 'NEW':
        return {
          label: 'Mới tiếp nhận - Đang xếp lịch tư vấn',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          desc: 'Tư vấn viên L\'Amour sẽ liên hệ qua Zalo/SĐT trong 15-30 phút.',
        };
      case 'CONTACTED':
      case 'NEGOTIATING':
        return {
          label: 'Đã tư vấn - Chờ chốt gói',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          desc: 'Đơn hàng đang trong quá trình trao đổi chi tiết.',
        };
      case 'WAITING_PAYMENT':
        return {
          label: 'Chờ thanh toán VietQR',
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          desc: 'Vui lòng hoàn tất chuyển khoản để kích hoạt xuất bản thiệp.',
        };
      case 'PAID':
      case 'COMPLETED':
        return {
          label: 'Đã thanh toán & Đang hoạt động',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          desc: 'Thiệp cưới của hai bạn đã sẵn sàng gửi đến khách mời!',
        };
      default:
        return {
          label: status,
          bg: 'bg-neutral-50 text-neutral-800 border-neutral-200',
          desc: '',
        };
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-[80vh] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#8C7335] text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-[#B38F26]" />
            <span>Khu Vực Dành Cho Cặp Đôi</span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1A1816]">
            Tra Cứu Đơn Hàng & Quản Lý Thiệp Cưới
          </h1>

          <p className="font-body text-xs sm:text-sm text-[#6E655C] max-w-lg mx-auto">
            Nhập <strong>Mã đơn hàng</strong> (ví dụ: <span className="font-mono font-semibold text-neutral-800">LAMOUR-829104</span>) hoặc <strong>Số điện thoại</strong> đã đăng ký khi đặt thiệp.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl border border-[#EADFC7] p-6 sm:p-8 shadow-md space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Nhập mã đơn (LAMOUR-...) hoặc SĐT đã đặt thiệp"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-300 focus:outline-hidden focus:border-[#D4AF37] text-sm text-neutral-900 bg-neutral-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-body text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <span>Đang tìm...</span>
              ) : (
                <>
                  <span>Tra Cứu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 text-xs text-neutral-500 gap-2 border-t border-neutral-100">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              Chưa đặt thiệp? <button onClick={() => onNavigate('/order')} className="text-[#B38F26] font-semibold hover:underline">Đăng ký đặt thiệp ngay</button>
            </span>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-[#8C7335] hover:text-[#5E4D20] font-medium underline decoration-dotted cursor-pointer"
            >
              Xem thử tài khoản mẫu (Demo)
            </button>
          </div>
        </div>

        {/* Found Result Card */}
        {foundLead && (
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#8C7335] uppercase bg-[#FAF6EE] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                  MÃ ĐƠN HÀNG: {foundLead.id}
                </span>
                <h3 className="font-serif-title text-2xl font-bold text-neutral-900 mt-2">
                  {foundLead.name || `${foundLead.groomName} & ${foundLead.brideName}`}
                </h3>
              </div>

              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusDisplay(foundLead.status).bg}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {getStatusDisplay(foundLead.status).label}
                </span>
              </div>
            </div>

            {/* Order detail grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-600 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <div className="space-y-1">
                <span className="text-neutral-400 block font-medium">Gói dịch vụ:</span>
                <span className="font-semibold text-neutral-900 uppercase flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {foundLead.package}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-400 block font-medium">Mẫu đã chọn:</span>
                <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {foundLead.template}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-400 block font-medium">Ngày cưới dự kiến:</span>
                <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {foundLead.weddingDate || 'Chưa cập nhật'}
                </span>
              </div>
            </div>

            {/* Status explanation */}
            <div className="text-xs text-neutral-500 bg-[#FAF6EE]/60 p-3.5 rounded-xl border border-[#EADFC7]/60">
              <p className="text-neutral-700 font-medium">
                {getStatusDisplay(foundLead.status).desc}
              </p>
            </div>

            {/* Main Action to enter couple management */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">
                Tạo lúc: {new Date(foundLead.createdAt).toLocaleString('vi-VN')}
              </span>

              {foundLead.status === 'PAID' || foundLead.status === 'COMPLETED' ? (
                <button
                  onClick={() => onOpenCouplePortal(foundLead)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-body text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Vào Chỉnh Sửa Thiệp Cưới Của Bạn</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <div
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-500 font-body text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                    title="Chưa thể chỉnh sửa vì Admin chưa duyệt thanh toán cho đơn hàng này"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Chờ Admin Duyệt Để Chỉnh Sửa</span>
                  </div>

                  <a
                    href={`tel:${cleanHotline}`}
                    className="px-4 py-2 rounded-full bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium border border-neutral-200 transition-colors"
                  >
                    Hotline Hỗ Trợ: {displayHotline}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not Found State */}
        {hasSearched && !foundLead && !isSearching && (
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 text-center space-y-4 shadow-sm">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif-title text-lg font-bold text-neutral-900">
                Không Tìm Thấy Đơn Hàng Nào
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Không có dữ liệu trùng khớp với từ khóa "<strong>{queryText}</strong>".
                Vui lòng kiểm tra lại Mã đơn hàng hoặc Số điện thoại hai bạn đã nhập khi đăng ký.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onNavigate('/order')}
                className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-white text-xs font-semibold hover:bg-[#B38F26] transition-colors"
              >
                Đặt Thiệp Cưới Mới
              </button>
              <a
                href={`tel:${cleanHotline}`}
                className="px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-colors"
              >
                Hotline: {displayHotline}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
