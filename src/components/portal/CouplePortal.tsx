import React, { useState, useEffect } from 'react';
import { WeddingData, RSVPGuest, WishMessage } from '../../types';
import { Lead, SiteContentConfig } from '../../types/commercial';
import {
  Heart,
  Save,
  Eye,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Image,
  CreditCard,
  Users,
  MessageSquare,
  Info,
  Palette,
  Clock,
  Sparkles,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Share2,
  Package,
  BarChart3,
  Globe,
  Lock,
  Unlock,
  QrCode,
  Camera,
} from 'lucide-react';
import { WeddingInfoTab } from '../admin/WeddingInfoTab';
import { CoupleTab } from '../admin/CoupleTab';
import { EventsTab } from '../admin/EventsTab';
import { StoryTab } from '../admin/StoryTab';
import { GalleryTab } from '../admin/GalleryTab';
import { LiveAlbumTab } from '../admin/LiveAlbumTab';
import { GiftTab } from '../admin/GiftTab';
import { RSVPTab } from '../admin/RSVPTab';
import { WishesTab } from '../admin/WishesTab';
import { TemplatesTab } from '../admin/TemplatesTab';
import { PreviewModal } from '../admin/PreviewModal';
import { CoupleOrderPackageTab } from './CoupleOrderPackageTab';
import { CoupleStatsTab } from './CoupleStatsTab';
import { ShareQRModal } from './ShareQRModal';
import { DEMO_WEDDING } from '../../data/demoWedding';
import { saveWeddingData } from '../../services/weddingService';
import { updateLeadTemplate } from '../../services/leadService';
import {
  updateWeddingInRegistry,
  getAllWeddings,
  slugifyVietnamese,
  isSlugLockedAuthoritative,
  getSiteContentConfig,
  fetchSiteContentConfigFromFirestore,
} from '../../services/siteConfigService';
import { getRSVPs } from '../../services/rsvpService';
import { getWishes } from '../../services/wishesService';
import { useToast } from '../ui/Toast';

interface CouplePortalProps {
  weddingData: WeddingData;
  leadOrder?: Lead | null;
  onBackToPublic: () => void;
  onDataSaved: (saved: WeddingData) => void;
  onNavigateToLiveWedding: () => void;
}

type CoupleTabKey =
  | 'order'
  | 'stats'
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

export function CouplePortal({
  weddingData,
  leadOrder,
  onBackToPublic,
  onDataSaved,
  onNavigateToLiveWedding,
}: CouplePortalProps) {
  const { showToast } = useToast();
  const [data, setData] = useState<WeddingData>(weddingData);
  const [activeTab, setActiveTab] = useState<CoupleTabKey>('order');
  const [rsvps, setRsvps] = useState<RSVPGuest[]>([]);
  const [wishes, setWishes] = useState<WishMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpeningLive, setIsOpeningLive] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareQrOpen, setShareQrOpen] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(getSiteContentConfig());

  useEffect(() => {
    fetchSiteContentConfigFromFirestore().then((remote) => {
      if (remote) setSiteContent(remote);
    });

    const handleSiteContentUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContentConfig>;
      if (customEvent.detail) {
        setSiteContent(customEvent.detail);
      } else {
        setSiteContent(getSiteContentConfig());
      }
    };
    window.addEventListener('lamour_site_content_updated', handleSiteContentUpdated);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('lamour_wedding_sync');
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'SITE_CONTENT_UPDATED' && ev.data?.config) {
          setSiteContent(ev.data.config);
        }
      };
    } catch {}

    return () => {
      window.removeEventListener('lamour_site_content_updated', handleSiteContentUpdated);
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
    };
  }, []);

  const displayHotline = siteContent.hotline || '0905 123 456';
  const cleanHotline = displayHotline.replace(/\s+/g, '');

  useEffect(() => {
    if (weddingData) {
      // Always sync with the authoritative status and publication from registry
      const all = getAllWeddings();
      const registryMatch = all.find(
        (w) =>
          w.id === weddingData.id ||
          w.slug === weddingData.slug ||
          (weddingData.orderCode && w.orderCode === weddingData.orderCode) ||
          (leadOrder && w.orderCode === leadOrder.id)
      );
      const isLockedByAdmin =
        weddingData.status === 'LOCKED' ||
        registryMatch?.status === 'LOCKED' ||
        isSlugLockedAuthoritative(weddingData.slug) ||
        isSlugLockedAuthoritative(weddingData.id) ||
        isSlugLockedAuthoritative(weddingData.orderCode) ||
        (leadOrder && isSlugLockedAuthoritative(leadOrder.id));

      const effectiveStatus = isLockedByAdmin ? 'LOCKED' : (registryMatch?.status || weddingData.status || 'ACTIVE');
      const effectivePublished =
        registryMatch?.isPublished !== undefined
          ? registryMatch.isPublished
          : weddingData.isPublished !== undefined
          ? weddingData.isPublished
          : true;

      // Extract authoritative names from lead order first, then weddingData
      const leadGroom = (leadOrder?.groomName || '').trim();
      const leadBride = (leadOrder?.brideName || '').trim();
      let parsedLeadGroom = leadGroom;
      let parsedLeadBride = leadBride;
      if ((!parsedLeadGroom || !parsedLeadBride) && leadOrder?.name && (leadOrder.name.includes('&') || leadOrder.name.includes('-'))) {
        const sep = leadOrder.name.includes('&') ? '&' : '-';
        const parts = leadOrder.name.split(sep).map((s) => s.trim());
        if (!parsedLeadGroom && parts[0]) parsedLeadGroom = parts[0];
        if (!parsedLeadBride && parts[1]) parsedLeadBride = parts[1];
      }

      // If leadOrder has names, they are authoritative for this couple's order
      const currentGroom = parsedLeadGroom || (weddingData.groom?.fullName || weddingData.groomName || '').trim();
      const currentBride = parsedLeadBride || (weddingData.bride?.fullName || weddingData.brideName || '').trim();
      const groomParts = currentGroom.split(' ').filter(Boolean);
      const brideParts = currentBride.split(' ').filter(Boolean);
      const groomShort = groomParts[groomParts.length - 1] || currentGroom;
      const brideShort = brideParts[brideParts.length - 1] || currentBride;
      const generatedNameSlug = (currentGroom && currentBride && currentGroom !== 'Chú Rể' && currentBride !== 'Cô Dâu')
        ? slugifyVietnamese(`${currentGroom}-${currentBride}`)
        : '';

      const currentSlug = registryMatch?.slug || weddingData.slug || '';
      const isDemoOrOldSlug = !currentSlug ||
        currentSlug.includes('mai-van-hien') ||
        currentSlug.includes('nguyen-hong-nhung') ||
        currentSlug === 'minh-anh' ||
        currentSlug === 'wedding' ||
        currentSlug === 'chu-re-co-dau' ||
        currentSlug.startsWith('demo-');

      // Rule: Khi khách hàng lần đầu bấm vào chỉnh sửa thiệp thì Đường link riêng của đám cưới (Slug) sẽ chuyển thành tên cô dâu chú rể luôn
      const shouldAutoConvertSlug = Boolean(
        generatedNameSlug && (isDemoOrOldSlug || currentSlug !== generatedNameSlug)
      );

      const targetSlug = shouldAutoConvertSlug ? generatedNameSlug : (currentSlug || generatedNameSlug || 'wedding');
      const targetId = `wedding-${targetSlug}`;

      const baseGroom = registryMatch?.groom || weddingData.groom || DEMO_WEDDING.groom;
      const baseBride = registryMatch?.bride || weddingData.bride || DEMO_WEDDING.bride;

      // Blank out sample demo bank accounts so couple starts with empty fields
      const rawGift = (registryMatch || weddingData).gift;
      const isSampleAccountNumber = (acc?: string) => {
        if (!acc) return true;
        const clean = acc.trim();
        return (
          clean === '990512345678' ||
          clean === '190365432199' ||
          clean === '0905123456' ||
          clean === '0905654321' ||
          clean === '1023889999' ||
          clean === '1903668888' ||
          clean === '1029384756' ||
          clean === '0987654321' ||
          clean === '0905123456888' ||
          clean === '1903654321999'
        );
      };

      const cleanGroomBank = {
        bankName: isSampleAccountNumber(rawGift?.groomBank?.accountNumber) ? '' : (rawGift?.groomBank?.bankName || ''),
        accountNumber: isSampleAccountNumber(rawGift?.groomBank?.accountNumber) ? '' : (rawGift?.groomBank?.accountNumber || ''),
        accountHolder: isSampleAccountNumber(rawGift?.groomBank?.accountNumber) ? '' : (rawGift?.groomBank?.accountHolder || ''),
        qrCodeUrl: isSampleAccountNumber(rawGift?.groomBank?.accountNumber) ? '' : (rawGift?.groomBank?.qrCodeUrl || ''),
        note: isSampleAccountNumber(rawGift?.groomBank?.accountNumber) ? '' : (rawGift?.groomBank?.note || ''),
      };

      const cleanBrideBank = {
        bankName: isSampleAccountNumber(rawGift?.brideBank?.accountNumber) ? '' : (rawGift?.brideBank?.bankName || ''),
        accountNumber: isSampleAccountNumber(rawGift?.brideBank?.accountNumber) ? '' : (rawGift?.brideBank?.accountNumber || ''),
        accountHolder: isSampleAccountNumber(rawGift?.brideBank?.accountNumber) ? '' : (rawGift?.brideBank?.accountHolder || ''),
        qrCodeUrl: isSampleAccountNumber(rawGift?.brideBank?.accountNumber) ? '' : (rawGift?.brideBank?.qrCodeUrl || ''),
        note: isSampleAccountNumber(rawGift?.brideBank?.accountNumber) ? '' : (rawGift?.brideBank?.note || ''),
      };

      // Ensure couple's chosen template is preserved and never overwritten by stale classic-luxury
      let resolvedTemplate = weddingData.template;
      if (!resolvedTemplate || resolvedTemplate === 'classic-luxury') {
        if (registryMatch?.template && registryMatch.template !== 'classic-luxury') {
          resolvedTemplate = registryMatch.template;
        } else if (leadOrder?.template && leadOrder.template !== 'classic-luxury') {
          resolvedTemplate = leadOrder.template as any;
        } else if (typeof window !== 'undefined') {
          const candidateKeys = [
            `lamour_wedding_data_${targetSlug}`,
            `lamour_wedding_data_${weddingData.slug}`,
            leadOrder?.id ? `lamour_wedding_data_${leadOrder.id}` : null,
          ].filter(Boolean) as string[];
          for (const k of candidateKeys) {
            const raw = localStorage.getItem(k);
            if (raw) {
              try {
                const parsed = JSON.parse(raw);
                if (parsed?.template) {
                  resolvedTemplate = parsed.template;
                  break;
                }
              } catch {}
            }
          }
        }
      }

      const synchronized: WeddingData = {
        ...(registryMatch || weddingData),
        id: targetId,
        slug: targetSlug,
        template: resolvedTemplate || weddingData.template || registryMatch?.template || 'classic-luxury',
        status: effectiveStatus,
        isPublished: effectivePublished,
        groomName: currentGroom || weddingData.groomName,
        brideName: currentBride || weddingData.brideName,
        groom: {
          ...baseGroom,
          role: 'groom',
          fullName: currentGroom || baseGroom.fullName || baseGroom.name,
          name: groomShort,
        },
        bride: {
          ...baseBride,
          role: 'bride',
          fullName: currentBride || baseBride.fullName || baseBride.name,
          name: brideShort,
        },
        gift: {
          message: rawGift?.message || 'Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất dành cho chúng mình. Nếu muốn gửi chút tình cảm từ phương xa, quý khách có thể gửi qua số tài khoản dưới đây.',
          groomBank: cleanGroomBank,
          brideBank: cleanBrideBank,
        },
        orderCode: leadOrder?.id || weddingData.orderCode,
        customerPhone: leadOrder?.phone || weddingData.customerPhone,
        customerEmail: leadOrder?.email || weddingData.customerEmail,
      };

      setData(synchronized);

      if (shouldAutoConvertSlug && (currentSlug !== targetSlug || weddingData.slug !== targetSlug)) {
        try {
          updateWeddingInRegistry(synchronized);
          saveWeddingData(synchronized);
          if (typeof window !== 'undefined') {
            localStorage.setItem(`lamour_wedding_data_${targetSlug}`, JSON.stringify(synchronized));
            localStorage.setItem(`lamour_wedding_data_wedding-${targetSlug}`, JSON.stringify(synchronized));
            localStorage.setItem('lamour_last_active_slug', targetSlug);
            if (currentSlug && currentSlug !== targetSlug) {
              localStorage.removeItem(`lamour_wedding_data_${currentSlug}`);
            }
          }
          onDataSaved(synchronized);
        } catch (e) {
          console.warn('Auto-slug conversion sync error:', e);
        }
      }
    }
  }, [weddingData, leadOrder]);

  const loadGuestData = async () => {
    try {
      const [rsvpsData, wishesData] = await Promise.all([
        getRSVPs(data.id),
        getWishes(data.id, true),
      ]);
      setRsvps(rsvpsData);
      setWishes(wishesData);
    } catch (err) {
      console.error('Error loading guest interactions:', err);
    }
  };

  useEffect(() => {
    loadGuestData();
  }, [data.id]);

  const isLockedByAdmin =
    data.status === 'LOCKED' ||
    isSlugLockedAuthoritative(data.slug) ||
    isSlugLockedAuthoritative(data.id) ||
    isSlugLockedAuthoritative(data.orderCode) ||
    (leadOrder && isSlugLockedAuthoritative(leadOrder.id));

  const isPendingPaymentApproval = Boolean(
    leadOrder
      ? (leadOrder.status !== 'PAID' && leadOrder.status !== 'COMPLETED')
      : (data.status !== 'ACTIVE' && (!data.orderCode || data.orderCode === 'DEMO'))
  );

  const isApproved = !isLockedByAdmin && !isPendingPaymentApproval;

  useEffect(() => {
    const handleLockStatusChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string; id?: string; status?: string; isLocked?: boolean }>;
      if (customEvent.detail) {
        const targetClean = (data.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
        const eventSlug = (customEvent.detail.slug || '').trim().toLowerCase();
        const eventId = (customEvent.detail.id || '').trim().toLowerCase();
        const matches =
          !eventSlug ||
          eventSlug === targetClean ||
          eventId === (data.id || '').toLowerCase() ||
          (data.orderCode && eventId === data.orderCode.toLowerCase()) ||
          targetClean.includes(eventSlug) ||
          eventSlug.includes(targetClean);

        if (matches) {
          const newStatus = (customEvent.detail.isLocked ?? customEvent.detail.status === 'LOCKED') ? 'LOCKED' : 'ACTIVE';
          setData((prev) => ({ ...prev, status: newStatus }));
        }
      }
    };
    window.addEventListener('lamour_lock_status_changed', handleLockStatusChanged);

    const handleSavedEvent = (e: Event) => {
      const customEvent = e as CustomEvent<WeddingData>;
      if (customEvent.detail) {
        const d = customEvent.detail;
        if (d.id === data.id || d.slug === data.slug || (data.orderCode && d.orderCode === data.orderCode)) {
          setData(d);
        }
      }
    };
    window.addEventListener('lamour_wedding_data_saved', handleSavedEvent);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('lamour_wedding_sync');
      bc.onmessage = (event) => {
        if (event.data?.type === 'WEDDING_UPDATED') {
          const updated = event.data.data as WeddingData;
          const uSlug = (updated?.slug || event.data.slug || '').trim().toLowerCase();
          const currentSlug = (data.slug || '').trim().toLowerCase();
          if (uSlug === currentSlug || updated?.id === data.id || (data.orderCode && updated?.orderCode === data.orderCode)) {
            if (event.data.isLocked !== undefined) {
              setData((prev) => ({ ...prev, status: event.data.isLocked ? 'LOCKED' : 'ACTIVE' }));
            } else if (updated) {
              setData(updated);
            }
          }
        }
      };
    } catch {}

    return () => {
      window.removeEventListener('lamour_lock_status_changed', handleLockStatusChanged);
      window.removeEventListener('lamour_wedding_data_saved', handleSavedEvent);
      if (bc) {
        try { bc.close(); } catch {}
      }
    };
  }, [data.id, data.slug, data.orderCode]);

  // Synchronous local storage & registry auto-update so any tab or preview is immediately synchronized
  const handleDataChange = (updated: WeddingData) => {
    if (!isApproved) {
      showToast('Thiệp cưới đang bị khóa hoặc chưa được Admin phê duyệt. Không thể chỉnh sửa!', 'error');
      return;
    }
    const all = getAllWeddings();
    const registryMatch = all.find((w) => w.id === updated.id || w.slug === updated.slug || (updated.orderCode && w.orderCode === updated.orderCode));
    const isLocked =
      updated.status === 'LOCKED' ||
      registryMatch?.status === 'LOCKED' ||
      isSlugLockedAuthoritative(updated.slug) ||
      isSlugLockedAuthoritative(updated.id) ||
      isSlugLockedAuthoritative(updated.orderCode);
    const effectiveStatus = isLocked ? 'LOCKED' : (registryMatch?.status || updated.status || 'ACTIVE');
    const effectivePublished = registryMatch?.isPublished !== undefined ? registryMatch.isPublished : (updated.isPublished !== undefined ? updated.isPublished : true);
    
    const finalGroom = updated.groom?.fullName || updated.groomName || '';
    const finalBride = updated.bride?.fullName || updated.brideName || '';
    const gParts = finalGroom.split(' ').filter(Boolean);
    const bParts = finalBride.split(' ').filter(Boolean);
    const gShort = gParts[gParts.length - 1] || finalGroom;
    const bShort = bParts[bParts.length - 1] || finalBride;

    const baseGroom = updated.groom || DEMO_WEDDING.groom;
    const baseBride = updated.bride || DEMO_WEDDING.bride;

    const sanitized: WeddingData = {
      ...updated,
      groomName: finalGroom || updated.groomName,
      brideName: finalBride || updated.brideName,
      groom: {
        ...baseGroom,
        role: 'groom',
        fullName: finalGroom || baseGroom.fullName || updated.groomName,
        name: gShort,
      },
      bride: {
        ...baseBride,
        role: 'bride',
        fullName: finalBride || baseBride.fullName || updated.brideName,
        name: bShort,
      },
      status: effectiveStatus,
      isPublished: effectivePublished,
    };

    setData(sanitized);
    try {
      const cleanSlug = (sanitized.slug || 'minh-anh').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'minh-anh';
      const withTimestamp: WeddingData = {
        ...sanitized,
        stories: Array.isArray(sanitized.stories) ? sanitized.stories : [],
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`lamour_wedding_data_${cleanSlug}`, JSON.stringify(withTimestamp));
        localStorage.setItem(`lamour_wedding_data_wedding-${cleanSlug}`, JSON.stringify(withTimestamp));
        if (sanitized.orderCode) {
          localStorage.setItem(`lamour_wedding_data_${sanitized.orderCode}`, JSON.stringify(withTimestamp));
        }
        localStorage.setItem('lamour_last_active_slug', cleanSlug);
      }
      updateWeddingInRegistry(withTimestamp);
      onDataSaved(withTimestamp);
      const targetOrderId = leadOrder?.id || withTimestamp.orderCode;
      if (withTimestamp.template && targetOrderId) {
        updateLeadTemplate(targetOrderId, withTimestamp.template).catch(() => {});
      }
    } catch (e) {
      console.warn('Real-time sync error:', e);
    }
  };

  const handleSave = async (customData?: WeddingData) => {
    if (!isApproved) {
      showToast('Admin chưa phê duyệt đơn hàng này. Quyền chỉnh sửa và lưu thiệp đang tạm khóa!', 'error');
      return;
    }
    const dataToSave = customData || data;
    setIsSaving(true);
    try {
      const all = getAllWeddings();
      const registryMatch = all.find((w) => w.id === dataToSave.id || w.slug === dataToSave.slug || (dataToSave.orderCode && w.orderCode === dataToSave.orderCode));
      const freshTimestamp = new Date().toISOString();
      const isLocked =
        dataToSave.status === 'LOCKED' ||
        registryMatch?.status === 'LOCKED' ||
        isSlugLockedAuthoritative(dataToSave.slug) ||
        isSlugLockedAuthoritative(dataToSave.id) ||
        isSlugLockedAuthoritative(dataToSave.orderCode);
      const withTimestamp: WeddingData = {
        ...dataToSave,
        status: isLocked ? 'LOCKED' : (registryMatch?.status || dataToSave.status || 'ACTIVE'),
        isPublished: registryMatch?.isPublished !== undefined ? registryMatch.isPublished : (dataToSave.isPublished !== undefined ? dataToSave.isPublished : true),
        stories: Array.isArray(dataToSave.stories) ? dataToSave.stories : [],
        updatedAt: freshTimestamp,
      };
      await saveWeddingData(withTimestamp);
      updateWeddingInRegistry(withTimestamp);
      setData(withTimestamp);
      onDataSaved(withTimestamp);
      const targetOrderId = leadOrder?.id || withTimestamp.orderCode;
      if (withTimestamp.template && targetOrderId) {
        updateLeadTemplate(targetOrderId, withTimestamp.template).catch(() => {});
      }
      showToast('Đã lưu và đồng bộ toàn bộ nội dung thiệp cưới thành công!', 'success');
    } catch (err) {
      console.error('Error saving wedding:', err);
      showToast('Có lỗi xảy ra khi lưu. Vui lòng thử lại.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenLiveWedding = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isApproved) {
      showToast('Đơn hàng đang chờ Admin duyệt thanh toán hoặc đang bị khóa. Thiệp cưới đang ở chế độ tạm dừng!', 'info');
    }
    setIsOpeningLive(true);
    try {
      const all = getAllWeddings();
      const registryMatch = all.find((w) => w.id === data.id || w.slug === data.slug || (data.orderCode && w.orderCode === data.orderCode));
      const freshTimestamp = new Date().toISOString();
      const cleanSlug = (data.slug || 'minh-anh').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'minh-anh';
      const isLiveLocked =
        data.status === 'LOCKED' ||
        registryMatch?.status === 'LOCKED' ||
        isSlugLockedAuthoritative(data.slug) ||
        isSlugLockedAuthoritative(data.id) ||
        isSlugLockedAuthoritative(data.orderCode);
      const withTimestamp: WeddingData = {
        ...data,
        status: isLiveLocked ? 'LOCKED' : (registryMatch?.status || data.status || 'ACTIVE'),
        isPublished: registryMatch?.isPublished !== undefined ? registryMatch.isPublished : (data.isPublished !== undefined ? data.isPublished : true),
        stories: Array.isArray(data.stories) ? data.stories : [],
        updatedAt: freshTimestamp,
      };

      // 1. Instant synchronous write to localStorage and registry before new tab loads
      if (typeof window !== 'undefined') {
        localStorage.setItem(`lamour_wedding_data_${cleanSlug}`, JSON.stringify(withTimestamp));
        localStorage.setItem('lamour_last_active_slug', cleanSlug);
      }
      updateWeddingInRegistry(withTimestamp);
      onDataSaved(withTimestamp);

      // 2. Persist to Firestore and broadcast
      await saveWeddingData(withTimestamp);

      // 3. Open the fresh wedding in a new tab
      window.open(`/wedding/${cleanSlug}`, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Error saving before opening live wedding:', err);
      window.open(`/wedding/${data.slug}`, '_blank', 'noopener,noreferrer');
    } finally {
      setIsOpeningLive(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!isApproved) {
      showToast('Admin chưa phê duyệt thanh toán cho đơn hàng. Thiệp cưới chưa thể xuất bản!', 'error');
      return;
    }
    const newPub = !data.isPublished;
    const updated = { ...data, isPublished: newPub };
    setData(updated);
    await handleSave(updated);
    showToast(
      newPub
        ? 'Thiệp cưới đã được XUẤT BẢN công khai cho khách mời'
        : 'Thiệp cưới đã chuyển sang chế độ TẠM ẨN chỉnh sửa',
      newPub ? 'success' : 'info'
    );
  };

  const weddingUrl = `${window.location.origin}/wedding/${data.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(weddingUrl);
    setHasCopiedLink(true);
    showToast('Đã sao chép liên kết thiệp cưới!', 'success');
    setTimeout(() => setHasCopiedLink(false), 2500);
  };

  const EDITING_TAB_KEYS: CoupleTabKey[] = [
    'info',
    'couple',
    'events',
    'story',
    'gallery',
    'live-album',
    'gift',
    'templates',
  ];

  const tabs: { key: CoupleTabKey; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'order', label: 'Đơn hàng & Gói dịch vụ', icon: Package },
    { key: 'stats', label: 'Thống kê thiệp cưới', icon: BarChart3 },
    { key: 'info', label: 'Thông tin chung', icon: Info },
    { key: 'couple', label: 'Cô dâu & Chú rể', icon: Heart },
    { key: 'events', label: 'Lịch sự kiện & Bản đồ', icon: Calendar },
    { key: 'story', label: 'Câu chuyện tình yêu', icon: Clock },
    { key: 'gallery', label: 'Ảnh kỷ niệm (Pre-Wedding)', icon: Image },
    { key: 'live-album', label: 'Album Ngày Cưới (Live)', icon: Camera, badge: data.liveAlbum?.photos?.length || 0 },
    { key: 'gift', label: 'Mừng cưới VietQR', icon: CreditCard },
    { key: 'rsvp', label: 'Khách xác nhận (RSVP)', icon: Users, badge: rsvps.length },
    { key: 'wishes', label: 'Sổ lưu bút & Lời chúc', icon: MessageSquare, badge: wishes.length },
    { key: 'templates', label: 'Giao diện & Nhạc nền', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2C2A29] font-body flex flex-col">
      {/* Top Header for Couple */}
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 sm:px-8 py-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border border-[#D4AF37]/50 flex items-center justify-center text-[#B38F26]">
            <Heart className="w-4 h-4 fill-current" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-title text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                Thiệp Cưới: {data.groom?.fullName || data.groomName || leadOrder?.groomName || 'Chú Rể'} & {data.bride?.fullName || data.brideName || leadOrder?.brideName || 'Cô Dâu'}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF6EE] text-[#8C7335] border border-[#D4AF37]/30">
                Khu Vực Cặp Đôi
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 flex-wrap">
              <span>Mã thiệp: <strong>{leadOrder?.id || data.orderCode || data.slug}</strong></span>
              <span>•</span>
              <span className={data.status === 'LOCKED' ? 'text-red-600 font-semibold' : isApproved ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                {data.status === 'LOCKED' ? '🔒 Đã bị Admin khóa' : isApproved ? '✓ Đã kích hoạt' : '⏳ Chờ Admin duyệt thanh toán'}
              </span>
            </p>
          </div>
        </div>

        {/* Right actions: Publish/Unpublish toggle, Share QR, Preview, Save */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Publish / Unpublish Toggle */}
          <button
            type="button"
            onClick={handleTogglePublish}
            disabled={!isApproved}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isLockedByAdmin
                ? 'bg-red-50 text-red-600 border border-red-200 cursor-not-allowed opacity-80'
                : !isApproved
                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed opacity-75'
                : data.isPublished
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100'
            }`}
            title={
              isLockedByAdmin
                ? 'Thiệp cưới đang bị khóa bởi Admin'
                : !isApproved
                ? 'Admin chưa duyệt - Chưa thể xuất bản thiệp'
                : 'Bật/Tắt chế độ xuất bản cho khách mời xem'
            }
          >
            {isLockedByAdmin ? (
              <Lock className="w-3.5 h-3.5 text-red-500" />
            ) : data.isPublished && isApproved ? (
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="hidden md:inline">
              {isLockedByAdmin
                ? 'Đã Khóa'
                : !isApproved
                ? 'Chờ duyệt'
                : data.isPublished
                ? 'Đang Xuất Bản'
                : 'Tạm Ẩn'}
            </span>
          </button>


          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-medium text-neutral-700 transition-colors cursor-pointer"
            title="Xem trước thiệp"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Xem thử</span>
          </button>

          <button
            onClick={() => handleSave()}
            disabled={!isApproved || isSaving}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors ${
              isLockedByAdmin
                ? 'bg-red-100 text-red-600 cursor-not-allowed border border-red-200'
                : !isApproved
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
                : 'bg-[#D4AF37] hover:bg-[#B38F26] text-[#181615] cursor-pointer'
            }`}
            title={
              isLockedByAdmin
                ? 'Thiệp cưới đang bị khóa bởi Admin - Không thể chỉnh sửa'
                : !isApproved
                ? 'Admin chưa duyệt đơn hàng - Chưa thể chỉnh sửa thiệp'
                : 'Lưu thiệp'
            }
          >
            {isLockedByAdmin ? (
              <Lock className="w-3.5 h-3.5 text-red-500" />
            ) : !isApproved ? (
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>
              {isLockedByAdmin
                ? 'Đã Khóa'
                : !isApproved
                ? 'Chờ duyệt'
                : isSaving
                ? 'Đang lưu...'
                : 'Lưu thiệp'}
            </span>
          </button>

          <button
            onClick={onBackToPublic}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
            title="Đăng xuất khỏi tài khoản thiệp cưới"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Admin Locked Warning Banner */}
        {isLockedByAdmin ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-red-950 shadow-sm animate-fadeIn">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center shrink-0 text-red-600 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <h4 className="font-bold text-red-950 flex items-center gap-2">
                  <span>Thiệp Cưới Tạm Khóa Bởi Quản Trị Viên (Admin)</span>
                </h4>
                <p className="text-red-800 text-xs leading-relaxed max-w-2xl">
                  Thiệp cưới của hai bạn hiện đang ở trạng thái tạm khóa bảo vệ hoặc hết hạn gói lưu trữ. Các tính năng chỉnh sửa thiệp và link xem thiệp công khai đang tạm dừng. Khách mời khi truy cập link thiệp cũng sẽ thấy màn hình thông báo tạm dừng. Quý khách vui lòng liên hệ Admin qua Hotline/Zalo để được hỗ trợ mở khóa nhanh chóng!
                </p>
              </div>
            </div>

            <a
              href={`tel:${cleanHotline}`}
              className="shrink-0 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Hotline: {displayHotline}
            </a>
          </div>
        ) : isPendingPaymentApproval ? (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-950 shadow-sm animate-fadeIn">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <h4 className="font-bold text-amber-950 flex items-center gap-2">
                  <span>Chờ Admin Phê Duyệt — Tính Năng Chỉnh Sửa Thiệp Cưới Đang Khóa</span>
                </h4>
                <p className="text-amber-800 text-xs leading-relaxed max-w-2xl">
                  Đơn hàng của hai bạn đang chờ Admin xác nhận thanh toán. Trong thời gian này, các tính năng chỉnh sửa nội dung thiệp cưới, đăng ảnh và đổi giao diện tạm thời được khóa để bảo vệ tài khoản. Sau khi Admin kiểm tra và duyệt (khoảng 5 - 15 phút), toàn bộ quyền chỉnh sửa sẽ tự động mở!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('order')}
              className="shrink-0 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Xem Chi Tiết Đơn & VietQR
            </button>
          </div>
        ) : null}

        {/* Quick Link Card with Direct Copy and QR button */}
        <div
          id="couple-portal-url-card"
          className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4"
        >
          <div className="min-w-0 flex-1 max-w-md w-full space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
              Đường dẫn thiệp cưới của hai bạn
            </span>
            <div
              id="couple-portal-wedding-url"
              title={weddingUrl}
              className="font-mono text-xs sm:text-sm text-neutral-800 bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200 select-all truncate w-full block cursor-text hover:border-[#D4AF37]/60 transition-colors"
            >
              {weddingUrl}
            </div>
          </div>

          <div
            id="couple-portal-url-actions"
            className="flex items-center gap-2 shrink-0 flex-nowrap"
          >
            <button
              id="couple-portal-copy-link-btn"
              type="button"
              onClick={handleCopyLink}
              className="shrink-0 whitespace-nowrap px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {hasCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
              <span>{hasCopiedLink ? 'Đã sao chép' : 'Sao chép link'}</span>
            </button>

            <button
              id="couple-portal-qr-code-btn"
              type="button"
              onClick={() => setShareQrOpen(true)}
              className="shrink-0 whitespace-nowrap px-3.5 py-2 rounded-xl bg-[#FAF6EE] border border-[#D4AF37]/50 hover:bg-[#F5E8C7] text-[#8C7335] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Xem mã QR và tải ảnh QR chất lượng cao về máy"
            >
              <QrCode className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
              <span>Mã QR & Tải về</span>
            </button>

            <a
              id="couple-portal-open-live-btn"
              href={`/wedding/${data.slug}`}
              onClick={handleOpenLiveWedding}
              className={`shrink-0 whitespace-nowrap px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                isOpeningLive ? 'opacity-70 pointer-events-none' : ''
              }`}
              title="Mở thiệp cưới thực tế với dữ liệu mới nhất"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>{isOpeningLive ? 'Đang mở...' : 'Mở thiệp'}</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 pt-0.5 tab-scrollbar border-b border-neutral-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const isTabLocked = !isApproved && EDITING_TAB_KEYS.includes(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : isTabLocked
                    ? 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200/80 border border-neutral-200/70'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
                }`}
                title={isTabLocked ? 'Chờ Admin duyệt đơn hàng để mở khóa chỉnh sửa' : tab.label}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : isTabLocked ? 'text-amber-500' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
                {isTabLocked && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Khóa</span>
                  </span>
                )}
                {typeof tab.badge === 'number' && tab.badge > 0 && !isTabLocked && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#D4AF37] text-neutral-900' : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="pb-16">
          {activeTab === 'order' && (
            <CoupleOrderPackageTab
              weddingData={data}
              leadOrder={leadOrder || undefined}
              onDataSaved={(updated) => {
                if (isApproved) {
                  setData(updated);
                  onDataSaved(updated);
                }
              }}
            />
          )}
          {activeTab === 'stats' && (
            <CoupleStatsTab
              weddingData={data}
              rsvps={rsvps}
              wishes={wishes}
              onOpenShareModal={() => setShareQrOpen(true)}
            />
          )}

          {/* Locked Notice Screen when Admin hasn't approved yet */}
          {!isApproved && EDITING_TAB_KEYS.includes(activeTab) ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 shadow-sm my-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-mono font-bold text-amber-800 uppercase bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
                  TÍNH NĂNG CHỈNH SỬA ĐANG TẠM KHÓA
                </span>
                <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-neutral-900">
                  Admin Chưa Phê Duyệt Đơn Hàng
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Để đảm bảo tính xác thực và an toàn tài khoản, hai bạn chỉ có thể chỉnh sửa nội dung thiệp cưới, thay đổi thông tin gia đình, sự kiện và đăng ảnh sau khi đơn hàng được Admin phê duyệt thanh toán thành công.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-left text-xs space-y-2 font-body">
                <div className="flex justify-between items-center text-neutral-600 pb-1.5 border-b border-neutral-200/60">
                  <span>Mã đơn hàng:</span>
                  <strong className="font-mono text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">{leadOrder?.id || data.orderCode}</strong>
                </div>
                <div className="flex justify-between items-center text-neutral-600 pb-1.5 border-b border-neutral-200/60">
                  <span>Trạng thái:</span>
                  <strong className="text-amber-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Chờ Admin kiểm tra & duyệt thanh toán</span>
                  </strong>
                </div>
                <div className="flex justify-between items-center text-neutral-600">
                  <span>Gói thiệp đăng ký:</span>
                  <strong className="text-neutral-900 uppercase font-bold">{leadOrder?.package || data.packageName || 'Cao Cấp (Premium)'}</strong>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('order')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Xem Chi Tiết Đơn Hàng & VietQR</span>
                </button>
                <a
                  href={`tel:${cleanHotline}`}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Hotline Hỗ Trợ Duyệt: {displayHotline}</span>
                </a>
              </div>
            </div>
          ) : (
            <>
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
                <GalleryTab
                  data={data}
                  onChange={handleDataChange}
                  onUpgradePackage={() => setActiveTab('order')}
                />
              )}
              {activeTab === 'live-album' && (
                <LiveAlbumTab
                  data={data}
                  onChange={handleDataChange}
                  onUpgradePackage={() => setActiveTab('order')}
                />
              )}
              {activeTab === 'gift' && (
                <GiftTab data={data} onChange={handleDataChange} />
              )}
              {activeTab === 'templates' && (
                <TemplatesTab
                  data={data}
                  leadOrder={leadOrder}
                  onChange={handleDataChange}
                  onUpgradePackage={() => setActiveTab('order')}
                />
              )}
            </>
          )}

          {activeTab === 'rsvp' && (
            <RSVPTab weddingId={data.id} rsvps={rsvps} onRefresh={loadGuestData} />
          )}
          {activeTab === 'wishes' && (
            <WishesTab weddingId={data.id} wishes={wishes} onRefresh={loadGuestData} />
          )}
        </div>
      </div>



      {/* Preview Modal */}
      {previewOpen && (
        <PreviewModal
          data={data}
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {/* Share QR Modal */}
      <ShareQRModal
        isOpen={shareQrOpen}
        onClose={() => setShareQrOpen(false)}
        weddingUrl={weddingUrl}
        groomName={data.groomName}
        brideName={data.brideName}
      />
    </div>
  );
}
