import React, { useState, useEffect } from 'react';
import { WeddingData, RSVPGuest, WishMessage } from '../../types';
import {
  Save,
  Eye,
  ArrowLeft,
  Info,
  Heart,
  Calendar,
  Clock,
  Image,
  CreditCard,
  Users,
  MessageSquare,
  Palette,
  RotateCcw,
  ShoppingBag,
  Globe,
  Lock,
  LogOut,
  Sparkles,
  DollarSign,
  Package,
  Layers,
  Crown,
  Camera,
} from 'lucide-react';
import { StatsOverview } from './StatsOverview';
import { WeddingInfoTab } from './WeddingInfoTab';
import { CoupleTab } from './CoupleTab';
import { EventsTab } from './EventsTab';
import { StoryTab } from './StoryTab';
import { GalleryTab } from './GalleryTab';
import { LiveAlbumTab } from './LiveAlbumTab';
import { GiftTab } from './GiftTab';
import { RSVPTab } from './RSVPTab';
import { WishesTab } from './WishesTab';
import { TemplatesTab } from './TemplatesTab';
import { LeadsTab } from './LeadsTab';
import { PreviewModal } from './PreviewModal';
import { RevenueStatsTab } from './RevenueStatsTab';
import { WeddingsManagerTab } from './WeddingsManagerTab';
import { PackagesManagerTab } from './PackagesManagerTab';
import { TemplatesManagerTab } from './TemplatesManagerTab';
import { PaymentSettingsTab } from './PaymentSettingsTab';
import { WebsiteContentTab } from './WebsiteContentTab';
import { UpgradeRequestsTab } from './UpgradeRequestsTab';
import { saveWeddingData } from '../../services/weddingService';
import { updateWeddingInRegistry } from '../../services/siteConfigService';
import { getRSVPs } from '../../services/rsvpService';
import { getWishes } from '../../services/wishesService';
import { getUpgradeRequests, approveAllPendingUpgradeRequests } from '../../services/upgradeService';
import { INITIAL_DEMO_WEDDING } from '../../data/demoWedding';
import { useToast } from '../ui/Toast';

interface AdminDashboardProps {
  initialData: WeddingData;
  initialTab?: TabKey;
  onBackToWedding: () => void;
  onNavigateToPublic?: () => void;
  onNavigateToCouplePortal?: () => void;
  onDataSaved: (savedData: WeddingData) => void;
}

type TabKey =
  | 'revenue'
  | 'leads'
  | 'upgrade-requests'
  | 'weddings'
  | 'packages'
  | 'templates-catalog'
  | 'payment-settings'
  | 'website-cms'
  | 'info'
  | 'couple'
  | 'events'
  | 'story'
  | 'gallery'
  | 'live-album'
  | 'gift'
  | 'rsvp'
  | 'wishes'
  | 'templates';

export function AdminDashboard({
  initialData,
  initialTab,
  onBackToWedding,
  onNavigateToPublic,
  onNavigateToCouplePortal,
  onDataSaved,
}: AdminDashboardProps) {
  const { showToast } = useToast();
  const [data, setData] = useState<WeddingData>(initialData);
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (initialTab) return initialTab;
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/admin/templates') return 'templates-catalog';
    }
    return 'revenue';
  });
  const [rsvps, setRsvps] = useState<RSVPGuest[]>([]);
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingUpgradesCount, setPendingUpgradesCount] = useState<number>(0);

  // Security PIN gate for Platform Owner
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('lamour_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '8888' || pinInput.trim() === 'admin') {
      sessionStorage.setItem('lamour_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError('');
      showToast('Đăng nhập Quản Trị Hệ Thống thành công', 'success');
    } else {
      setPinError('Mã PIN quản trị không chính xác (Gợi ý: 8888)');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('lamour_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
    showToast('Đã đăng xuất khỏi phiên quản trị', 'info');
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [isDirectApproving, setIsDirectApproving] = useState(false);

  const loadPendingUpgrades = async () => {
    try {
      const reqs = await getUpgradeRequests();
      const count = reqs.filter((r) => r.status === 'PENDING').length;
      setPendingUpgradesCount(count);
    } catch (e) {
      console.error('Failed to load pending upgrades count', e);
    }
  };

  const handleDirectApproveAll = async () => {
    setIsDirectApproving(true);
    try {
      const res = await approveAllPendingUpgradeRequests('Admin L\'Amour');
      showToast(`Đã duyệt thành công ${res.approvedCount || 'toàn bộ'} yêu cầu gia hạn / nâng cấp!`, 'success');
      await loadPendingUpgrades();
    } catch {
      showToast('Có lỗi khi duyệt yêu cầu', 'error');
    } finally {
      setIsDirectApproving(false);
    }
  };

  useEffect(() => {
    loadPendingUpgrades();
    const handleUpgradeChange = () => loadPendingUpgrades();
    window.addEventListener('lamour_upgrade_requested', handleUpgradeChange);
    window.addEventListener('lamour_upgrade_approved', handleUpgradeChange);
    window.addEventListener('lamour_upgrade_rejected', handleUpgradeChange);
    return () => {
      window.removeEventListener('lamour_upgrade_requested', handleUpgradeChange);
      window.removeEventListener('lamour_upgrade_approved', handleUpgradeChange);
      window.removeEventListener('lamour_upgrade_rejected', handleUpgradeChange);
    };
  }, []);

  const loadResponses = async () => {
    try {
      const [rsvpsData, wishesData] = await Promise.all([
        getRSVPs(data.id),
        getWishes(data.id, true),
      ]);
      setRsvps(rsvpsData);
      setWishes(wishesData);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    }
  };

  useEffect(() => {
    loadResponses();
  }, [data.id]);

  // Real-time synchronization helper for instant tab/preview updates
  const handleDataChange = (updated: WeddingData) => {
    setData(updated);
    try {
      const cleanSlug = (updated.slug || 'minh-anh').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'minh-anh';
      const withTimestamp: WeddingData = {
        ...updated,
        stories: Array.isArray(updated.stories) ? updated.stories : [],
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`lamour_wedding_data_${cleanSlug}`, JSON.stringify(withTimestamp));
        localStorage.setItem('lamour_last_active_slug', cleanSlug);
      }
      updateWeddingInRegistry(withTimestamp);
      onDataSaved(withTimestamp);
    } catch (e) {
      console.warn('Admin real-time sync error:', e);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const freshTimestamp = new Date().toISOString();
      const withTimestamp: WeddingData = {
        ...data,
        stories: Array.isArray(data.stories) ? data.stories : [],
        updatedAt: freshTimestamp,
      };
      await saveWeddingData(withTimestamp);
      setData(withTimestamp);
      onDataSaved(withTimestamp);
      showToast('Đã lưu và đồng bộ mọi thay đổi thành công!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast('Lỗi khi lưu dữ liệu, vui lòng kiểm tra lại', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDemo = () => {
    if (
      !confirm(
        'Bạn có chắc muốn khôi phục lại dữ liệu đám cưới mẫu của Minh Anh & Ngọc Mai?'
      )
    )
      return;
    setData(INITIAL_DEMO_WEDDING);
    showToast('Đã khôi phục dữ liệu mẫu! Đừng quên nhấn "Lưu thay đổi"', 'info');
  };

  // Platform governance tabs
  const platformTabs: {
    key: TabKey;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { key: 'revenue', label: 'Thống kê doanh thu', icon: DollarSign },
    { key: 'leads', label: 'Khách hàng & Đơn hàng', icon: ShoppingBag },
    {
      key: 'upgrade-requests',
      label: 'Duyệt Gia Hạn & Nâng Cấp',
      icon: Crown,
      badge: pendingUpgradesCount,
    },
    { key: 'weddings', label: 'Quản lý Wedding & Gia hạn', icon: Heart },
    { key: 'packages', label: 'Sản phẩm / Gói thiệp', icon: Package },
    { key: 'templates-catalog', label: 'Quản lý Templates', icon: Layers },
    { key: 'payment-settings', label: 'Quản lý thanh toán', icon: CreditCard },
    { key: 'website-cms', label: 'Nội dung website', icon: Globe },
  ];

  // Specific wedding content editing tabs
  const weddingContentTabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'info', label: 'Thông tin chung', icon: Info },
    { key: 'couple', label: 'Cô dâu & Chú rể', icon: Heart },
    { key: 'events', label: 'Lịch sự kiện', icon: Calendar },
    { key: 'story', label: 'Câu chuyện', icon: Clock },
    { key: 'gallery', label: 'Album ảnh', icon: Image },
    { key: 'live-album', label: 'Album Ngày Cưới (Live)', icon: Camera },
    { key: 'gift', label: 'Mừng cưới / QR', icon: CreditCard },
    { key: 'rsvp', label: 'Khách mời (RSVP)', icon: Users },
    { key: 'wishes', label: 'Lời chúc', icon: MessageSquare },
    { key: 'templates', label: 'Mẫu giao diện', icon: Palette },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#181615] text-[#FAF6EE] flex flex-col items-center justify-center p-4 font-body">
        <div className="w-full max-w-md bg-[#24211E] rounded-3xl border border-[#D4AF37]/30 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif-title text-2xl font-bold text-white pt-2">
              Chủ Nền Tảng L'Amour
            </h1>
            <p className="text-xs text-neutral-400">
              Hệ thống Quản trị & Điều hành Thiệp cưới trực tuyến
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block">
                Mã PIN Quản Trị Hệ Thống
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="Nhập mã PIN (Mặc định: 8888)"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-[#181615] border border-neutral-700 focus:border-[#D4AF37] focus:outline-hidden text-white text-center font-mono tracking-widest text-lg"
              />
              {pinError && (
                <p className="text-xs text-red-400 text-center font-medium mt-1">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-body text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Mở Bảng Điều Hành Quản Trị
            </button>
          </form>

          {/* Couple redirection notice */}
          <div className="pt-4 border-t border-neutral-800 text-center space-y-3">
            <div className="bg-[#FAF6EE]/5 p-3 rounded-xl border border-neutral-800 text-xs text-neutral-300">
              <p className="font-medium text-[#FAF6EE] mb-1">
                Hai bạn là Cặp đôi mua thiệp muốn chỉnh sửa thiệp của mình?
              </p>
              <p className="text-[11px] text-neutral-400">
                Không cần tài khoản quản trị viên. Vui lòng vào Cổng Cặp Đôi để chỉnh sửa nội dung thiệp của mình.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onNavigateToCouplePortal || onNavigateToPublic}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-[#D4AF37] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Chuyển Sang Cổng Quản Trị Cặp Đôi</span>
              </button>

              {onNavigateToPublic && (
                <button
                  type="button"
                  onClick={onNavigateToPublic}
                  className="text-xs text-neutral-400 hover:text-white transition-colors py-1 cursor-pointer"
                >
                  ← Về Website Bán Hàng L'Amour
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isEditingContent = [
    'info',
    'couple',
    'events',
    'story',
    'gallery',
    'gift',
    'rsvp',
    'wishes',
    'templates',
  ].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2C2A29] font-body flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 sm:px-8 py-3.5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          {onNavigateToPublic && (
            <button
              onClick={onNavigateToPublic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-[#FAF6EE] text-neutral-700 hover:text-[#B38F26] text-xs font-semibold transition-colors cursor-pointer"
              title="Về Website Bán Hàng L'Amour"
            >
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Website Bán Hàng</span>
            </button>
          )}

          <button
            onClick={async () => {
              try {
                await saveWeddingData(data);
                onDataSaved(data);
              } catch (e) {
                console.warn('Auto save failed before return:', e);
              }
              onBackToWedding();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title="Quay lại trang thiệp cưới của khách"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem thiệp mẫu</span>
          </button>

          <div className="hidden md:block h-5 w-px bg-neutral-200" />

          <div className="hidden sm:block">
            <h1 className="font-serif-title text-base sm:text-lg font-bold text-neutral-900 leading-tight">
              Quản Trị Hệ Thống L'Amour
            </h1>
            <p className="text-[11px] text-neutral-400">
              Quyền: ADMIN / Chủ Nền Tảng (Toàn quyền quản trị)
            </p>
          </div>
        </div>

        {/* Action Buttons: Preview, Save & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleResetToDemo}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors hidden lg:block"
            title="Khôi phục dữ liệu demo mẫu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="admin-preview-btn"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-[#D4AF37]/50 text-[#8C7335] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-xs sm:text-sm font-medium transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Xem trước</span>
          </button>

          <button
            id="admin-save-btn"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Đăng xuất Quản trị viên"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Platform Governance Tabs */}
        <div>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
            Phân Hệ Quản Trị Nền Tảng (Platform Owner)
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 pt-0.5 tab-scrollbar border-b border-neutral-200">
            {platformTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (tab.key === 'templates-catalog') {
                      window.history.pushState({}, '', '/admin/templates');
                    } else {
                      window.history.pushState({}, '', '/admin');
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submenu for Individual Wedding Content Editing */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Chỉnh Sửa Dữ Liệu Thiệp: {data.groomName} & {data.brideName} ({data.slug})
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 pt-0.5 tab-scrollbar border-b border-neutral-200">
            {weddingContentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FAF6EE] text-[#8C7335] font-bold border border-[#D4AF37]/50 shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pending Requests Notification Banner for Admin */}
        {pendingUpgradesCount > 0 && activeTab !== 'upgrade-requests' && (
          <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-md flex items-center justify-between flex-wrap gap-3 mb-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold shrink-0">
                <Clock className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Có {pendingUpgradesCount} Yêu Cầu Gia Hạn / Nâng Cấp Đang Chờ Duyệt</h4>
                <p className="text-xs text-amber-100">
                  Cặp đôi đã chuyển khoản gia hạn thời gian lưu trữ hoặc nâng cấp gói thiệp. Vui lòng kiểm tra và duyệt ngay.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDirectApproveAll}
                disabled={isDirectApproving}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isDirectApproving ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang duyệt...</span>
                  </>
                ) : (
                  <span>✓ Duyệt Nhanh Tất Cả</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upgrade-requests')}
                className="px-4 py-2 rounded-xl bg-white text-amber-950 font-bold text-xs shadow-xs hover:bg-amber-50 transition-all cursor-pointer"
              >
                Xem Chi Tiết →
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Display */}
        <div className="pb-16">
          {/* Platform Management Tabs */}
          {activeTab === 'revenue' && <RevenueStatsTab />}
          {activeTab === 'leads' && (
            <LeadsTab
              onOpenWeddingEdit={(wedding) => {
                setData(wedding);
                setActiveTab('info');
                showToast(`Đang mở chỉnh sửa thiệp của ${wedding.groomName} & ${wedding.brideName}`, 'info');
              }}
            />
          )}
          {activeTab === 'upgrade-requests' && (
            <UpgradeRequestsTab
              onRefreshCount={() => {
                loadPendingUpgrades();
              }}
            />
          )}
          {activeTab === 'weddings' && (
            <WeddingsManagerTab
              onSelectWeddingForEdit={(wedding) => {
                setData(wedding);
                setActiveTab('info');
                showToast(`Đang mở chỉnh sửa thiệp của ${wedding.groomName} & ${wedding.brideName}`, 'info');
              }}
            />
          )}
          {activeTab === 'packages' && <PackagesManagerTab />}
          {activeTab === 'templates-catalog' && <TemplatesManagerTab />}
          {activeTab === 'payment-settings' && <PaymentSettingsTab />}
          {activeTab === 'website-cms' && <WebsiteContentTab onNavigateToPublic={onNavigateToPublic} />}

          {/* Wedding Content Tabs */}
          {activeTab === 'info' && (
            <WeddingInfoTab data={data} onChange={handleDataChange} />
          )}
          {activeTab === 'couple' && (
            <CoupleTab data={data} onChange={handleDataChange} />
          )}
          {activeTab === 'events' && (
            <EventsTab data={data} onChange={handleDataChange} />
          )}
          {activeTab === 'story' && (
            <StoryTab data={data} onChange={handleDataChange} />
          )}
          {activeTab === 'gallery' && (
            <GalleryTab data={data} onChange={handleDataChange} />
          )}
          {activeTab === 'live-album' && (
            <LiveAlbumTab data={data} onChange={handleDataChange} />
          )}
          {activeTab === 'gift' && (
            <GiftTab data={data} onChange={handleDataChange} />
          )}
          {activeTab === 'rsvp' && (
            <RSVPTab
              weddingId={data.id}
              rsvps={rsvps}
              onRefresh={loadResponses}
            />
          )}
          {activeTab === 'wishes' && (
            <WishesTab
              weddingId={data.id}
              wishes={wishes}
              onRefresh={loadResponses}
            />
          )}
          {activeTab === 'templates' && (
            <TemplatesTab data={data} isAdmin={true} onChange={handleDataChange} />
          )}
        </div>
      </main>

      {/* Interactive Responsive Live Preview Modal */}
      <PreviewModal
        data={data}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
