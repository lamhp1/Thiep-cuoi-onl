import { PlatformPaymentConfig, SiteContentConfig, CommercialPackage, CommercialTemplate, Lead } from '../types/commercial';
import { WeddingData } from '../types';
import { DEMO_WEDDING } from '../data/demoWedding';
import { DEFAULT_COMMERCIAL_PACKAGES, DEFAULT_COMMERCIAL_TEMPLATES } from '../data/commercialDefaults';
import { getLeads } from './leadService';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, query } from 'firebase/firestore';

const PLATFORM_PAYMENT_KEY = 'lamour_platform_payment_config';
const SITE_CONTENT_KEY = 'lamour_site_content_config';
const ALL_WEDDINGS_KEY = 'lamour_all_weddings_list';
export const LOCKED_SLUGS_KEY = 'lamour_locked_slugs';

export function getLockedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCKED_SLUGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim().toLowerCase()).filter(Boolean);
    }
  } catch {}
  return [];
}

export function saveLockedSlugs(slugs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const unique = Array.from(new Set(slugs.map((s) => String(s).trim().toLowerCase()).filter(Boolean)));
    localStorage.setItem(LOCKED_SLUGS_KEY, JSON.stringify(unique));
  } catch {}
}

export function unlockSlugAuthoritative(slugOrId?: string | null): void {
  if (!slugOrId) return;
  const raw = slugOrId.trim();
  const clean = raw.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  if (!clean) return;
  const stripped = clean.replace(/^wedding-/, '');
  const prefixed = `wedding-${stripped}`;

  // 1. Remove from locked slugs
  const locked = getLockedSlugs();
  const toRemove = new Set([
    raw.toLowerCase(),
    raw.toUpperCase(),
    clean,
    stripped,
    prefixed,
    `wedding-${clean}`,
  ]);
  const remaining = locked.filter((s) => !toRemove.has(s.toLowerCase()));
  saveLockedSlugs(remaining);

  // 2. Clean localStorage wedding caches
  if (typeof window !== 'undefined') {
    try {
      const directKeys = [
        `lamour_wedding_data_${clean}`,
        `lamour_wedding_data_${stripped}`,
        `lamour_wedding_data_${prefixed}`,
        `lamour_wedding_data_${raw.toLowerCase()}`,
        `lamour_wedding_data_${raw.toUpperCase()}`,
        `lamour_wedding_data_${raw}`,
      ];
      for (const k of directKeys) {
        const val = localStorage.getItem(k);
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (parsed && parsed.status === 'LOCKED') {
              parsed.status = 'ACTIVE';
              parsed.updatedAt = new Date().toISOString();
              localStorage.setItem(k, JSON.stringify(parsed));
            }
          } catch {}
        }
      }
    } catch {}
  }

  // 3. Clean in Platform Weddings Registry
  try {
    const all = getAllWeddings();
    let modified = false;
    const updated = all.map((w) => {
      const wSlug = (w.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const wId = (w.id || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const wOrder = (w.orderCode || '').trim().toLowerCase();
      const isMatch =
        wSlug === clean ||
        wSlug === stripped ||
        wSlug === prefixed ||
        wId === clean ||
        wId === stripped ||
        wId === prefixed ||
        wOrder === clean ||
        wOrder === stripped;
      if (isMatch && w.status === 'LOCKED') {
        modified = true;
        return { ...w, status: 'ACTIVE' as const, updatedAt: new Date().toISOString() };
      }
      return w;
    });
    if (modified) {
      saveAllWeddings(updated);
    }
  } catch {}
}

export function isSlugLockedAuthoritative(slugOrId?: string | null): boolean {
  if (!slugOrId) return false;
  const clean = slugOrId.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
  if (!clean) return false;
  const stripped = clean.replace(/^wedding-/, '');
  const prefixed = `wedding-${stripped}`;

  // 1. Direct check in authoritative locked slugs set
  const lockedList = getLockedSlugs();
  if (
    lockedList.includes(clean) ||
    lockedList.includes(stripped) ||
    lockedList.includes(prefixed)
  ) {
    return true;
  }

  // 2. Direct check in localStorage wedding caches
  if (typeof window !== 'undefined') {
    try {
      const directKeys = [
        `lamour_wedding_data_${clean}`,
        `lamour_wedding_data_${stripped}`,
        `lamour_wedding_data_${prefixed}`,
      ];
      for (const k of directKeys) {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          if (parsed && parsed.status === 'LOCKED') return true;
        }
      }
    } catch {}
  }

  // 3. Direct check in Platform Weddings Registry
  try {
    const all = getAllWeddings();
    for (const w of all) {
      const wSlug = (w.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const wId = (w.id || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const wOrder = (w.orderCode || '').trim().toLowerCase();
      const wNameSlug = (w.groomName && w.brideName)
        ? slugifyVietnamese(`${w.groomName}-${w.brideName}`).toLowerCase()
        : '';

      const isMatching =
        wSlug === clean ||
        wSlug === stripped ||
        wSlug === prefixed ||
        wId === clean ||
        wId === stripped ||
        wId === prefixed ||
        wOrder === clean ||
        wOrder === stripped ||
        (wNameSlug && (wNameSlug === clean || wNameSlug === stripped));

      if (isMatching) {
        if (w.status === 'LOCKED') return true;
        if (
          lockedList.includes(wSlug) ||
          lockedList.includes(wId) ||
          (wOrder && lockedList.includes(wOrder)) ||
          (wNameSlug && lockedList.includes(wNameSlug))
        ) {
          return true;
        }
      }
    }
  } catch {}

  return false;
}
const PACKAGES_KEY = 'lamour_commercial_packages';
const TEMPLATES_KEY = 'lamour_commercial_templates';

export const DEFAULT_PLATFORM_PAYMENT: PlatformPaymentConfig = {
  bankName: 'Vietcombank (VCB)',
  bankCode: 'VCB',
  accountNumber: '1028394857',
  accountHolder: 'HOANG THI BICH LAM (L AMOUR WEDDING)',
  branch: 'Chi nhánh Hà Nội / Huế',
  transferPrefix: 'LAMOUR',
  qrTemplate: 'compact2',
  note: 'Vui lòng ghi nội dung chuyển khoản theo cú pháp: [Mã đơn hàng] [Số điện thoại]',
};

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  brandName: "L'Amour Wedding",
  brandTagline: 'Nền tảng thiệp cưới trực tuyến sang trọng & nghệ thuật',
  hotline: '0905 123 456',
  zaloNumber: '0905 123 456',
  supportEmail: 'contact@lamourwedding.vn',
  address: 'Hà Nội & TP. Hồ Chí Minh (Phục vụ khách hàng toàn quốc & kiều bào)',
  bannerEnabled: true,
  bannerBadge: 'Ưu Đãi Mùa Cưới 2026',
  bannerText: 'Tặng ngay 1 năm lưu trữ & trọn bộ hiệu ứng mở phong bì điện ảnh cho tất cả các gói',
  heroHeading: 'Thiết Kế Thiệp Cưới Điện Tử Tinh Hoa & Đầy Cảm Xúc',
  heroSubheading: 'Biến câu chuyện tình yêu của hai bạn thành tác phẩm nghệ thuật trực tuyến với trải nghiệm tương tác đỉnh cao, xác nhận RSVP và mừng cưới VietQR tức thì.',
  heroCtaText: 'Đặt Thiệp Cưới Ngay',
  featuresHeading: 'Tính Năng Hiện Đại Dành Riêng Cho Đám Cưới',
  pricingHeading: 'Chi Phí Trọn Gói, Không Phát Sinh',
  ctaBannerHeading: 'Sẵn Sàng Cho Một Đám Cưới Đáng Nhớ?',
  ctaBannerSubheading: 'Chỉ mất 2 phút để gửi yêu cầu đặt thiệp. Chúng tôi sẽ liên hệ tư vấn mẫu phù hợp nhất với phong cách của hai bạn ngay hôm nay.',
};

export function getPlatformPaymentConfig(): PlatformPaymentConfig {
  try {
    const raw = localStorage.getItem(PLATFORM_PAYMENT_KEY);
    if (raw) return { ...DEFAULT_PLATFORM_PAYMENT, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Error reading payment config:', err);
  }
  return DEFAULT_PLATFORM_PAYMENT;
}

export async function fetchPlatformPaymentConfigFromFirestore(): Promise<PlatformPaymentConfig> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(query(collection(db, 'config')));
      let found: PlatformPaymentConfig | null = null;
      snap.forEach((d) => {
        if (d.id === 'payment') {
          found = d.data() as PlatformPaymentConfig;
        }
      });
      if (found) {
        const merged = { ...DEFAULT_PLATFORM_PAYMENT, ...found };
        localStorage.setItem(PLATFORM_PAYMENT_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {}
  }
  return getPlatformPaymentConfig();
}

export function savePlatformPaymentConfig(config: PlatformPaymentConfig): void {
  try {
    localStorage.setItem(PLATFORM_PAYMENT_KEY, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lamour_payment_config_updated', { detail: config }));
      try {
        const bc = new BroadcastChannel('lamour_wedding_sync');
        bc.postMessage({ type: 'PAYMENT_CONFIG_UPDATED', config });
        setTimeout(() => {
          try { bc.close(); } catch {}
        }, 500);
      } catch {}
    }
  } catch (err) {
    console.error('Error saving payment config:', err);
  }

  if (isFirebaseConfigured && db) {
    try {
      setDoc(doc(db, 'config', 'payment'), config, { merge: true }).catch(() => {});
    } catch {}
  }
}

export async function fetchSiteContentConfigFromFirestore(): Promise<SiteContentConfig> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'config', 'siteContent'));
      if (snap.exists()) {
        const found = snap.data() as SiteContentConfig;
        const merged: SiteContentConfig = { ...DEFAULT_SITE_CONTENT, ...found };
        localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(merged));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('lamour_site_content_updated', { detail: merged }));
        }
        return merged;
      }
    } catch (e) {
      console.warn('Could not fetch siteContent from Firestore:', e);
    }
  }
  return getSiteContentConfig();
}

export function getSiteContentConfig(): SiteContentConfig {
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY);
    if (raw) return { ...DEFAULT_SITE_CONTENT, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Error reading site content config:', err);
  }
  return DEFAULT_SITE_CONTENT;
}

export async function saveSiteContentConfig(config: SiteContentConfig): Promise<void> {
  const merged: SiteContentConfig = { ...DEFAULT_SITE_CONTENT, ...config };
  try {
    localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(merged));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lamour_site_content_updated', { detail: merged }));
      try {
        const bc = new BroadcastChannel('lamour_wedding_sync');
        bc.postMessage({ type: 'SITE_CONTENT_UPDATED', config: merged });
        setTimeout(() => {
          try { bc.close(); } catch {}
        }, 500);
      } catch {}
    }
  } catch (err) {
    console.error('Error saving site content config:', err);
  }

  if (isFirebaseConfigured && db) {
    try {
      const cleanPayload: Record<string, any> = {};
      for (const [k, v] of Object.entries(merged)) {
        if (v !== undefined) cleanPayload[k] = v;
      }
      await setDoc(doc(db, 'config', 'siteContent'), cleanPayload, { merge: true });
    } catch (err) {
      console.warn('Could not save siteContent to Firestore:', err);
    }
  }
}

// Weddings Registry for Admin Platform
export function getAllWeddings(): WeddingData[] {
  try {
    const raw = localStorage.getItem(ALL_WEDDINGS_KEY);
    if (raw) {
      const list = JSON.parse(raw) as WeddingData[];
      if (Array.isArray(list) && list.length > 0) {
        // Deduplicate by ID and slug to prevent duplicate keys in React and state
        const seenIds = new Set<string>();
        const deduped: WeddingData[] = [];
        for (const item of list) {
          const uniqueId = item.id || `wedding-${item.slug || Math.random().toString(36).substring(2, 9)}`;
          if (!seenIds.has(uniqueId)) {
            seenIds.add(uniqueId);
            deduped.push({ ...item, id: uniqueId });
          }
        }
        return deduped;
      }
    }
  } catch (e) {
    console.warn('Error reading all weddings:', e);
  }

  // Default initial weddings
  const initialWeddings: WeddingData[] = [
    DEMO_WEDDING,
    {
      ...DEMO_WEDDING,
      id: 'wedding-hoang-long-thu-ha',
      slug: 'hoang-long-thu-ha',
      groomName: 'Hoàng Long',
      brideName: 'Thu Hà',
      weddingDate: '2026-10-25',
      weddingDateTime: '2026-10-25T11:00:00',
      city: 'Đà Nẵng',
      romanticQuote: '“Nơi nào có tình yêu, nơi đó có cuộc sống.”',
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      template: 'minimal-white',
      isPublished: true,
      status: 'ACTIVE',
      expiresAt: '2027-10-25T23:59:59Z',
      packageId: 'pkg-premium',
      packageName: 'Gói Cao Cấp (Premium)',
      viewsCount: 842,
      accessPin: '5678',
      orderCode: 'LAMOUR-829104',
      customerPhone: '0905 567 890',
      customerEmail: 'hoanglong.thuha@gmail.com',
      createdAt: '2026-03-01T09:00:00Z',
      updatedAt: '2026-09-10T14:00:00Z',
    },
    {
      ...DEMO_WEDDING,
      id: 'wedding-duc-huy-thanh-mai',
      slug: 'duc-huy-thanh-mai',
      groomName: 'Đức Huy',
      brideName: 'Thanh Mai',
      weddingDate: '2026-11-18',
      weddingDateTime: '2026-11-18T17:30:00',
      city: 'Hà Nội',
      romanticQuote: '“Gặp gỡ là duyên, đồng hành là hạnh phúc trọn đời.”',
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      template: 'floral-pink',
      isPublished: true,
      status: 'ACTIVE',
      expiresAt: '2027-05-18T23:59:59Z',
      packageId: 'pkg-basic',
      packageName: 'Gói Cơ Bản (Basic)',
      viewsCount: 419,
      accessPin: '9988',
      orderCode: 'LAMOUR-492015',
      customerPhone: '0912 345 678',
      customerEmail: 'duchuy.thanhmai@gmail.com',
      createdAt: '2026-04-12T11:20:00Z',
      updatedAt: '2026-09-08T16:00:00Z',
    },
  ];

  localStorage.setItem(ALL_WEDDINGS_KEY, JSON.stringify(initialWeddings));
  return initialWeddings;
}

export async function fetchWeddingsFromFirestore(): Promise<WeddingData[]> {
  const localList = getAllWeddings();
  if (!isFirebaseConfigured || !db) return localList;

  try {
    const snap = await getDocs(query(collection(db, 'weddings')));
    if (snap.empty) return localList;

    const firestoreList: WeddingData[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as WeddingData;
      if (data && (data.groomName || data.brideName || data.slug)) {
        firestoreList.push(data);
      }
    });

    // Merge Firestore documents with local list (Firestore is authoritative for status)
    const merged = [...localList];
    for (const fItem of firestoreList) {
      const cleanFSlug = (fItem.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const strippedFSlug = cleanFSlug.replace(/^wedding-/, '');
      const fNameSlug = (fItem.groomName && fItem.brideName)
        ? slugifyVietnamese(`${fItem.groomName}-${fItem.brideName}`).toLowerCase()
        : '';

      const existingIdx = merged.findIndex((w) => {
        const wSlug = (w.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
        const wId = (w.id || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
        const wOrder = (w.orderCode || '').trim().toLowerCase();
        const wNameSlug = (w.groomName && w.brideName)
          ? slugifyVietnamese(`${w.groomName}-${w.brideName}`).toLowerCase()
          : '';
        return (
          wSlug === cleanFSlug ||
          wSlug.replace(/^wedding-/, '') === strippedFSlug ||
          wId === cleanFSlug ||
          wId.replace(/^wedding-/, '') === strippedFSlug ||
          (fItem.orderCode && wOrder === fItem.orderCode.toLowerCase().trim()) ||
          (fNameSlug && wNameSlug === fNameSlug)
        );
      });

      // Firestore status is authoritative
      let resolvedStatus: 'ACTIVE' | 'LOCKED' | 'EXPIRED' = 'ACTIVE';
      if (fItem.status === 'LOCKED') {
        resolvedStatus = 'LOCKED';
      } else if (fItem.status === 'ACTIVE') {
        resolvedStatus = 'ACTIVE';
      } else {
        const isLocallyLocked =
          (existingIdx >= 0 && merged[existingIdx].status === 'LOCKED') ||
          isSlugLockedAuthoritative(cleanFSlug) ||
          isSlugLockedAuthoritative(fItem.id) ||
          (fItem.orderCode && isSlugLockedAuthoritative(fItem.orderCode));
        resolvedStatus = isLocallyLocked ? 'LOCKED' : 'ACTIVE';
      }

      // Reconcile extensionStatus:
      // If local is already APPROVED or there is no pending extension request in upgrade_requests,
      // do NOT let a stale PENDING in fItem overwrite it!
      let resolvedExtensionStatus = fItem.extensionStatus;
      let resolvedPendingTitle = fItem.pendingExtensionTitle;
      let resolvedPendingMonths = fItem.pendingExtensionMonths;

      if (existingIdx >= 0 && merged[existingIdx].extensionStatus === 'APPROVED') {
        resolvedExtensionStatus = 'APPROVED';
        resolvedPendingTitle = undefined;
        resolvedPendingMonths = undefined;
      }

      let hasRealPendingExtension = false;
      try {
        const rawUpgrades = localStorage.getItem('lamour_package_upgrade_requests');
        if (rawUpgrades) {
          const reqs = JSON.parse(rawUpgrades);
          hasRealPendingExtension = Array.isArray(reqs) && reqs.some(
            (r: any) =>
              r.status === 'PENDING' &&
              r.type === 'EXTENSION' &&
              (r.weddingSlug === fItem.slug ||
                r.weddingId === fItem.id ||
                (fItem.orderCode && r.orderCode === fItem.orderCode))
          );
        }
      } catch {}

      if (!hasRealPendingExtension && (resolvedExtensionStatus === 'PENDING' || fItem.extensionStatus === 'PENDING')) {
        resolvedExtensionStatus = 'APPROVED';
        resolvedPendingTitle = undefined;
        resolvedPendingMonths = undefined;
      }

      if (existingIdx >= 0) {
        merged[existingIdx] = {
          ...merged[existingIdx],
          ...fItem,
          extensionStatus: resolvedExtensionStatus,
          pendingExtensionTitle: resolvedPendingTitle,
          pendingExtensionMonths: resolvedPendingMonths,
          status: resolvedStatus,
          updatedAt: fItem.updatedAt || merged[existingIdx].updatedAt,
        };
      } else {
        merged.unshift({
          ...fItem,
          extensionStatus: resolvedExtensionStatus,
          pendingExtensionTitle: resolvedPendingTitle,
          pendingExtensionMonths: resolvedPendingMonths,
          status: resolvedStatus,
        });
      }

      if (resolvedStatus === 'LOCKED') {
        const identifiers = [
          cleanFSlug,
          strippedFSlug,
          fItem.id,
          fItem.orderCode,
          fNameSlug,
        ].filter(Boolean) as string[];
        const currentLocked = getLockedSlugs();
        saveLockedSlugs(Array.from(new Set([...currentLocked, ...identifiers])));
      } else if (resolvedStatus === 'ACTIVE') {
        unlockSlugAuthoritative(cleanFSlug);
        unlockSlugAuthoritative(strippedFSlug);
        if (fItem.id) unlockSlugAuthoritative(fItem.id);
        if (fItem.orderCode) unlockSlugAuthoritative(fItem.orderCode);
        if (fNameSlug) unlockSlugAuthoritative(fNameSlug);
      }
    }

    saveAllWeddings(merged);
    return merged;
  } catch (err) {
    console.warn('fetchWeddingsFromFirestore offline/unavailable:', err);
    return localList;
  }
}

export function saveAllWeddings(weddings: WeddingData[]): void {
  try {
    const seenIds = new Set<string>();
    const deduped: WeddingData[] = [];
    for (const w of weddings) {
      const id = w.id || `wedding-${w.slug || Math.random().toString(36).substring(2, 9)}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        deduped.push({ ...w, id });
      }
    }
    localStorage.setItem(ALL_WEDDINGS_KEY, JSON.stringify(deduped));
  } catch (err) {
    console.error('Error saving all weddings:', err);
  }
}

export function updateWeddingInRegistry(wedding: WeddingData): void {
  try {
    const list = getAllWeddings();
    let found = false;
    const updated = list.map((w) => {
      if (
        w.id === wedding.id ||
        w.slug === wedding.slug ||
        (wedding.orderCode && w.orderCode === wedding.orderCode)
      ) {
        found = true;
        return {
          ...w,
          ...wedding,
          // Admin-controlled status and publication must be preserved and never overridden by couple portal edits
          status: w.status || wedding.status || 'ACTIVE',
          isPublished: w.isPublished !== undefined ? w.isPublished : (wedding.isPublished !== undefined ? wedding.isPublished : true),
          expiresAt: w.expiresAt || wedding.expiresAt,
          updatedAt: wedding.updatedAt || new Date().toISOString(),
        };
      }
      return w;
    });

    if (!found) {
      updated.unshift(wedding);
    }

    saveAllWeddings(updated);
  } catch (err) {
    console.warn('Failed to sync wedding to registry:', err);
  }
}

export function updateWeddingStatus(idOrSlug: string, status: 'ACTIVE' | 'LOCKED' | 'EXPIRED'): WeddingData[] {
  const list = getAllWeddings();
  const cleanTarget = (idOrSlug || '').trim().toLowerCase();
  const strippedTarget = cleanTarget.replace(/^wedding-/, '');

  // 1. Find all candidate weddings matching this identifier
  const initialMatches = list.filter((w) => {
    const wId = (w.id || '').trim().toLowerCase();
    const wSlug = (w.slug || '').trim().toLowerCase();
    const wOrder = (w.orderCode || '').trim().toLowerCase();
    const wNameSlug = (w.groomName && w.brideName)
      ? slugifyVietnamese(`${w.groomName}-${w.brideName}`).toLowerCase()
      : '';

    return (
      wId === cleanTarget ||
      wSlug === cleanTarget ||
      wOrder === cleanTarget ||
      wId.replace(/^wedding-/, '') === strippedTarget ||
      wSlug.replace(/^wedding-/, '') === strippedTarget ||
      wOrder === strippedTarget ||
      (wNameSlug && (wNameSlug === cleanTarget || wNameSlug === strippedTarget))
    );
  });

  const relatedOrderCodes = new Set(
    initialMatches.map((w) => (w.orderCode || '').trim().toLowerCase()).filter(Boolean)
  );
  if (cleanTarget.startsWith('lamour-')) {
    relatedOrderCodes.add(cleanTarget);
  }

  const relatedNameSlugs = new Set(
    initialMatches.map((w) =>
      w.groomName && w.brideName ? slugifyVietnamese(`${w.groomName}-${w.brideName}`).toLowerCase() : ''
    ).filter(Boolean)
  );

  let targetWedding: WeddingData | null = null;
  const allRelatedSlugs = new Set<string>();

  const updated = list.map((w) => {
    const wId = (w.id || '').trim().toLowerCase();
    const wSlug = (w.slug || '').trim().toLowerCase();
    const wOrder = (w.orderCode || '').trim().toLowerCase();
    const wNameSlug = (w.groomName && w.brideName)
      ? slugifyVietnamese(`${w.groomName}-${w.brideName}`).toLowerCase()
      : '';

    const isMatch =
      wId === cleanTarget ||
      wSlug === cleanTarget ||
      wOrder === cleanTarget ||
      wId.replace(/^wedding-/, '') === strippedTarget ||
      wSlug.replace(/^wedding-/, '') === strippedTarget ||
      wOrder === strippedTarget ||
      (wNameSlug && (wNameSlug === cleanTarget || wNameSlug === strippedTarget)) ||
      (wOrder && relatedOrderCodes.has(wOrder)) ||
      (wNameSlug && relatedNameSlugs.has(wNameSlug));

    if (isMatch) {
      if (wSlug) allRelatedSlugs.add(wSlug);
      if (wId) allRelatedSlugs.add(wId);
      if (wOrder) allRelatedSlugs.add(wOrder);
      if (wNameSlug) allRelatedSlugs.add(wNameSlug);

      const modified = { ...w, status, updatedAt: new Date().toISOString() };
      if (!targetWedding) targetWedding = modified;
      return modified;
    }
    return w;
  });

  // If not found in list, create fallback target to guarantee it gets locked
  if (!targetWedding) {
    const fallbackSlug = strippedTarget || 'minh-anh';
    const baseObj = DEMO_WEDDING;
    targetWedding = {
      ...baseObj,
      id: cleanTarget || `wedding-${fallbackSlug}`,
      slug: fallbackSlug,
      status,
      updatedAt: new Date().toISOString(),
    };
    updated.unshift(targetWedding);
  }

  saveAllWeddings(updated);

  const weddingObj = targetWedding as WeddingData;
  const targetSlug = (weddingObj.slug || strippedTarget).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'minh-anh';
  const targetId = (weddingObj.id || cleanTarget).trim().toLowerCase();
  const targetOrder = (weddingObj.orderCode || '').trim().toLowerCase();
  const canonicalNameSlug = (weddingObj.groomName && weddingObj.brideName)
    ? slugifyVietnamese(`${weddingObj.groomName}-${weddingObj.brideName}`).toLowerCase()
    : '';

  // 1. Authoritative Locked Slugs Registry Update
  const currentLocked = getLockedSlugs();
  const identifiersToUpdate = Array.from(new Set([
    targetSlug,
    targetSlug.replace(/^wedding-/, ''),
    `wedding-${targetSlug.replace(/^wedding-/, '')}`,
    targetId,
    targetId.replace(/^wedding-/, ''),
    `wedding-${targetId.replace(/^wedding-/, '')}`,
    cleanTarget,
    strippedTarget,
    `wedding-${strippedTarget}`,
    targetOrder,
    canonicalNameSlug,
    canonicalNameSlug ? `wedding-${canonicalNameSlug}` : '',
    ...Array.from(allRelatedSlugs),
    ...Array.from(relatedOrderCodes),
    ...Array.from(relatedNameSlugs),
  ].filter(Boolean) as string[]));

  if (status === 'LOCKED') {
    const newLocked = Array.from(new Set([...currentLocked, ...identifiersToUpdate]));
    saveLockedSlugs(newLocked);
  } else {
    const toRemoveSet = new Set(identifiersToUpdate);
    const newLocked = currentLocked.filter((s) => !toRemoveSet.has(s));
    saveLockedSlugs(newLocked);
    identifiersToUpdate.forEach((id) => unlockSlugAuthoritative(id));
  }

  // 2. Synchronous LocalStorage & Events dispatch
  if (typeof window !== 'undefined') {
    const serialized = JSON.stringify(weddingObj);
    identifiersToUpdate.forEach((idKey) => {
      localStorage.setItem(`lamour_wedding_data_${idKey}`, serialized);
    });

    window.dispatchEvent(new CustomEvent('lamour_wedding_data_saved', { detail: weddingObj }));
    window.dispatchEvent(
      new CustomEvent('lamour_lock_status_changed', {
        detail: { slug: targetSlug, id: targetId, status, isLocked: status === 'LOCKED' },
      })
    );

    try {
      const bc = new BroadcastChannel('lamour_wedding_sync');
      bc.postMessage({
        type: 'WEDDING_UPDATED',
        data: weddingObj,
        lockStatus: status,
        isLocked: status === 'LOCKED',
        slug: targetSlug,
        identifiers: identifiersToUpdate,
      });
      setTimeout(() => {
        try {
          bc.close();
        } catch {}
      }, 1000);
    } catch {
      // ignore
    }
  }

  // 3. Persist to Firestore: Both to 'locks' collection and 'weddings' collection
  if (isFirebaseConfigured && db) {
    try {
      const sanitized = JSON.parse(JSON.stringify(weddingObj));

      // Write authoritative lock doc for all relevant identifiers
      const lockPayload = {
        locked: status === 'LOCKED',
        status,
        slug: targetSlug,
        orderCode: targetOrder || null,
        id: targetId,
        updatedAt: new Date().toISOString(),
      };

      const docsToLock = Array.from(new Set([
        targetSlug,
        targetSlug.replace(/^wedding-/, ''),
        targetId,
        cleanTarget,
        strippedTarget,
        targetOrder,
        targetOrder.toUpperCase(),
        targetOrder.toLowerCase(),
        canonicalNameSlug,
        canonicalNameSlug ? `wedding-${canonicalNameSlug}` : '',
        ...Array.from(allRelatedSlugs),
        ...Array.from(relatedOrderCodes),
        ...Array.from(relatedOrderCodes).map((c) => c.toUpperCase()),
        ...Array.from(relatedOrderCodes).map((c) => c.toLowerCase()),
      ].filter(Boolean) as string[]));

      docsToLock.forEach((key) => {
        setDoc(doc(db!, 'locks', key), lockPayload, { merge: true }).catch(() => {});
        setDoc(doc(db!, 'weddings', key), sanitized, { merge: true }).catch(() => {});
      });

      // Synchronize associated Lead status if exists
      if (targetOrder) {
        const cleanOrder = targetOrder.toUpperCase();
        setDoc(
          doc(db, 'leads', cleanOrder),
          {
            lockedByAdmin: status === 'LOCKED',
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch(() => {});
      }
    } catch (e) {
      console.warn('Firestore updateWeddingStatus sync warning:', e);
    }
  }

  return updated;
}

export function toggleWeddingPublished(idOrSlug: string, isPublished: boolean): WeddingData[] {
  const list = getAllWeddings();
  let targetWedding: WeddingData | null = null;
  const cleanTarget = (idOrSlug || '').trim().toLowerCase();
  const updated = list.map((w) => {
    const wId = (w.id || '').trim().toLowerCase();
    const wSlug = (w.slug || '').trim().toLowerCase();
    const isMatch =
      wId === cleanTarget ||
      wSlug === cleanTarget ||
      wId.replace(/^wedding-/, '') === cleanTarget.replace(/^wedding-/, '') ||
      wSlug.replace(/^wedding-/, '') === cleanTarget.replace(/^wedding-/, '');
    if (isMatch) {
      targetWedding = { ...w, isPublished, updatedAt: new Date().toISOString() };
      return targetWedding;
    }
    return w;
  });
  saveAllWeddings(updated);
  if (targetWedding && typeof window !== 'undefined') {
    const weddingObj = targetWedding as WeddingData;
    const slug = weddingObj.slug;
    localStorage.setItem(`lamour_wedding_data_${slug}`, JSON.stringify(weddingObj));
    localStorage.setItem(`lamour_wedding_data_wedding-${slug}`, JSON.stringify(weddingObj));
    if (weddingObj.id) {
      localStorage.setItem(`lamour_wedding_data_${weddingObj.id}`, JSON.stringify(weddingObj));
    }
    if (weddingObj.orderCode) {
      localStorage.setItem(`lamour_wedding_data_${weddingObj.orderCode}`, JSON.stringify(weddingObj));
    }
    window.dispatchEvent(new CustomEvent('lamour_wedding_data_saved', { detail: weddingObj }));
    try {
      const bc = new BroadcastChannel('lamour_wedding_sync');
      bc.postMessage({ type: 'WEDDING_UPDATED', data: weddingObj });
      bc.close();
    } catch {
      // ignore
    }
  }
  if (targetWedding && isFirebaseConfigured && db) {
    const weddingObj = targetWedding as WeddingData;
    const cleanSlug = (weddingObj.slug || '').trim().toLowerCase();
    if (cleanSlug) {
      setDoc(doc(db, 'weddings', cleanSlug), weddingObj, { merge: true }).catch(() => {});
    }
    if (weddingObj.id && weddingObj.id !== cleanSlug) {
      setDoc(doc(db, 'weddings', weddingObj.id), weddingObj, { merge: true }).catch(() => {});
    }
  }
  return updated;
}

export function updateWeddingPackage(
  idOrSlug: string,
  newPackageSlugOrId: string,
  newPackageName?: string
): WeddingData[] {
  const list = getAllWeddings();
  let targetWedding: WeddingData | null = null;
  const cleanTarget = (idOrSlug || '').trim().toLowerCase();

  const cleanPkg = (newPackageSlugOrId || '').trim().toLowerCase();
  const canonicalSlug =
    cleanPkg === 'vip' || cleanPkg.includes('vip')
      ? 'vip'
      : cleanPkg === 'basic' || cleanPkg.includes('basic')
      ? 'basic'
      : 'premium';
  const canonicalName =
    newPackageName ||
    (canonicalSlug === 'vip'
      ? 'Gói Thiết Kế Riêng (VIP)'
      : canonicalSlug === 'basic'
      ? 'Gói Cơ Bản (Basic)'
      : 'Gói Cao Cấp (Premium)');
  const canonicalId = `pkg-${canonicalSlug}`;

  const updated = list.map((w) => {
    const wId = (w.id || '').trim().toLowerCase();
    const wSlug = (w.slug || '').trim().toLowerCase();
    const isMatch =
      wId === cleanTarget ||
      wSlug === cleanTarget ||
      wId.replace(/^wedding-/, '') === cleanTarget.replace(/^wedding-/, '') ||
      wSlug.replace(/^wedding-/, '') === cleanTarget.replace(/^wedding-/, '');
    if (!isMatch) return w;

    // Adjust expiration if upgrading
    let newExpiresAt = w.expiresAt;
    if (canonicalSlug === 'vip' || canonicalSlug === 'premium') {
      const current = w.expiresAt ? new Date(w.expiresAt) : new Date();
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() + (canonicalSlug === 'vip' ? 2 : 1));
      if (isNaN(current.getTime()) || current < minDate) {
        newExpiresAt = minDate.toISOString();
      }
    }

    targetWedding = {
      ...w,
      packageId: canonicalId,
      packageName: canonicalName,
      requiredPlan: canonicalSlug as any,
      expiresAt: newExpiresAt,
      status: 'ACTIVE' as const,
      updatedAt: new Date().toISOString(),
    };
    return targetWedding;
  });

  saveAllWeddings(updated);

  if (targetWedding && typeof window !== 'undefined') {
    const weddingObj = targetWedding as WeddingData;
    const slug = weddingObj.slug;
    localStorage.setItem(`lamour_wedding_data_${slug}`, JSON.stringify(weddingObj));
    localStorage.setItem(`lamour_wedding_data_wedding-${slug}`, JSON.stringify(weddingObj));
    if (weddingObj.id) {
      localStorage.setItem(`lamour_wedding_data_${weddingObj.id}`, JSON.stringify(weddingObj));
    }
    if (weddingObj.orderCode) {
      localStorage.setItem(`lamour_wedding_data_${weddingObj.orderCode}`, JSON.stringify(weddingObj));
    }
    unlockSlugAuthoritative(slug);
    unlockSlugAuthoritative(weddingObj.id);
    if (weddingObj.orderCode) unlockSlugAuthoritative(weddingObj.orderCode);

    window.dispatchEvent(new CustomEvent('lamour_wedding_data_saved', { detail: weddingObj }));
    window.dispatchEvent(
      new CustomEvent('lamour_lock_status_changed', {
        detail: { slug, id: weddingObj.id, status: 'ACTIVE', isLocked: false },
      })
    );
    try {
      const bc = new BroadcastChannel('lamour_wedding_sync');
      bc.postMessage({ type: 'WEDDING_UPDATED', data: weddingObj, isLocked: false });
      bc.close();
    } catch {}
  }

  if (targetWedding && isFirebaseConfigured && db) {
    const weddingObj = targetWedding as WeddingData;
    const cleanSlug = (weddingObj.slug || '').trim().toLowerCase();
    const lockPayload = { locked: false, status: 'ACTIVE', updatedAt: new Date().toISOString() };
    if (cleanSlug) {
      setDoc(doc(db, 'weddings', cleanSlug), weddingObj, { merge: true }).catch(() => {});
      setDoc(doc(db, 'locks', cleanSlug), lockPayload, { merge: true }).catch(() => {});
    }
    if (weddingObj.id && weddingObj.id !== cleanSlug) {
      setDoc(doc(db, 'weddings', weddingObj.id), weddingObj, { merge: true }).catch(() => {});
      setDoc(doc(db, 'locks', weddingObj.id), lockPayload, { merge: true }).catch(() => {});
    }
    if (weddingObj.orderCode) {
      setDoc(doc(db, 'locks', weddingObj.orderCode), lockPayload, { merge: true }).catch(() => {});
    }
  }

  return updated;
}

export function extendWeddingExpiry(idOrSlug: string, additionalMonths: number | 'LIFETIME'): WeddingData[] {
  const list = getAllWeddings();
  let targetWedding: WeddingData | null = null;
  const cleanTarget = (idOrSlug || '').trim().toLowerCase();
  const updated = list.map((w) => {
    const wId = (w.id || '').trim().toLowerCase();
    const wSlug = (w.slug || '').trim().toLowerCase();
    const isMatch =
      wId === cleanTarget ||
      wSlug === cleanTarget ||
      wId.replace(/^wedding-/, '') === cleanTarget.replace(/^wedding-/, '') ||
      wSlug.replace(/^wedding-/, '') === cleanTarget.replace(/^wedding-/, '');
    if (!isMatch) return w;
    let newExpiry: string;
    if (additionalMonths === 'LIFETIME') {
      newExpiry = '2099-12-31T23:59:59Z';
    } else {
      const current = w.expiresAt ? new Date(w.expiresAt) : new Date();
      const baseDate = isNaN(current.getTime()) || current < new Date() ? new Date() : current;
      baseDate.setMonth(baseDate.getMonth() + additionalMonths);
      newExpiry = baseDate.toISOString();
    }
    targetWedding = {
      ...w,
      expiresAt: newExpiry,
      extensionStatus: 'APPROVED',
      pendingExtensionMonths: undefined,
      pendingExtensionTitle: undefined,
      status: 'ACTIVE' as const,
      updatedAt: new Date().toISOString(),
    };
    return targetWedding;
  });
  saveAllWeddings(updated);

  // Auto-resolve any pending extension requests for this wedding so badges/counts clear immediately
  if (targetWedding && typeof window !== 'undefined') {
    const weddingObj = targetWedding as WeddingData;
    const slug = weddingObj.slug;

    try {
      const rawUpgrades = localStorage.getItem('lamour_package_upgrade_requests');
      if (rawUpgrades) {
        const upgradeList = JSON.parse(rawUpgrades);
        let hasResolved = false;
        const nowIso = new Date().toISOString();
        const updatedUpgrades = upgradeList.map((r: any) => {
          const matchWedding =
            r.status === 'PENDING' &&
            r.type === 'EXTENSION' &&
            (r.weddingSlug === slug ||
              r.weddingId === weddingObj.id ||
              (weddingObj.orderCode && r.orderCode === weddingObj.orderCode));
          if (matchWedding) {
            hasResolved = true;
            const approvedReq = { ...r, status: 'APPROVED', reviewedAt: nowIso, reviewedBy: 'Admin (Gia hạn trực tiếp)' };
            if (isFirebaseConfigured && db) {
              setDoc(doc(db, 'upgrade_requests', r.id), approvedReq, { merge: true }).catch(() => {});
            }
            return approvedReq;
          }
          return r;
        });
        if (hasResolved) {
          localStorage.setItem('lamour_package_upgrade_requests', JSON.stringify(updatedUpgrades));
          window.dispatchEvent(new CustomEvent('lamour_upgrade_approved', { detail: { wedding: weddingObj } }));
        }
      }
    } catch {}

    localStorage.setItem(`lamour_wedding_data_${slug}`, JSON.stringify(weddingObj));
    localStorage.setItem(`lamour_wedding_data_wedding-${slug}`, JSON.stringify(weddingObj));
    if (weddingObj.id) {
      localStorage.setItem(`lamour_wedding_data_${weddingObj.id}`, JSON.stringify(weddingObj));
    }
    if (weddingObj.orderCode) {
      localStorage.setItem(`lamour_wedding_data_${weddingObj.orderCode}`, JSON.stringify(weddingObj));
    }
    unlockSlugAuthoritative(slug);
    unlockSlugAuthoritative(weddingObj.id);
    if (weddingObj.orderCode) unlockSlugAuthoritative(weddingObj.orderCode);

    window.dispatchEvent(new CustomEvent('lamour_wedding_data_saved', { detail: weddingObj }));
    window.dispatchEvent(
      new CustomEvent('lamour_lock_status_changed', {
        detail: { slug, id: weddingObj.id, status: 'ACTIVE', isLocked: false },
      })
    );
    try {
      const bc = new BroadcastChannel('lamour_wedding_sync');
      bc.postMessage({ type: 'WEDDING_UPDATED', data: weddingObj, isLocked: false });
      bc.close();
    } catch {
      // ignore
    }
  }
  if (targetWedding && isFirebaseConfigured && db) {
    const weddingObj = targetWedding as WeddingData;
    const cleanSlug = (weddingObj.slug || '').trim().toLowerCase();
    const lockPayload = { locked: false, status: 'ACTIVE', updatedAt: new Date().toISOString() };
    const firestorePayload: any = {
      ...weddingObj,
      extensionStatus: 'APPROVED',
      pendingExtensionMonths: null,
      pendingExtensionTitle: null,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    };
    if (cleanSlug) {
      setDoc(doc(db, 'weddings', cleanSlug), firestorePayload, { merge: true }).catch(() => {});
      setDoc(doc(db, 'locks', cleanSlug), lockPayload, { merge: true }).catch(() => {});
    }
    if (weddingObj.id && weddingObj.id !== cleanSlug) {
      setDoc(doc(db, 'weddings', weddingObj.id), firestorePayload, { merge: true }).catch(() => {});
      setDoc(doc(db, 'locks', weddingObj.id), lockPayload, { merge: true }).catch(() => {});
    }
    if (weddingObj.orderCode) {
      setDoc(doc(db, 'locks', weddingObj.orderCode), lockPayload, { merge: true }).catch(() => {});
    }
  }
  return updated;
}

export async function deleteWeddingFromPlatform(idOrSlug: string, orderCode?: string): Promise<WeddingData[]> {
  const list = getAllWeddings();
  const cleanTarget = (idOrSlug || '').trim().toLowerCase();
  const strippedTarget = cleanTarget.replace(/^wedding-/, '');
  const cleanOrder = (orderCode || '').trim().toLowerCase();

  // 1. Filter out from platform weddings registry
  const updated = list.filter((w) => {
    const wId = (w.id || '').trim().toLowerCase();
    const wSlug = (w.slug || '').trim().toLowerCase();
    const wOrder = (w.orderCode || '').trim().toLowerCase();
    const isMatch =
      wId === cleanTarget ||
      wSlug === cleanTarget ||
      wId.replace(/^wedding-/, '') === strippedTarget ||
      wSlug.replace(/^wedding-/, '') === strippedTarget ||
      (cleanOrder && (wOrder === cleanOrder || wId === cleanOrder || wSlug === cleanOrder)) ||
      (wOrder && wOrder === cleanTarget);
    return !isMatch;
  });

  saveAllWeddings(updated);

  // 2. Remove from locked slugs registry if present
  unlockSlugAuthoritative(cleanTarget);
  unlockSlugAuthoritative(strippedTarget);
  if (cleanOrder) unlockSlugAuthoritative(cleanOrder);

  // 3. Clear all related localStorage keys & caches
  if (typeof window !== 'undefined') {
    try {
      const keysToRemove = [
        `lamour_wedding_data_${cleanTarget}`,
        `lamour_wedding_data_${strippedTarget}`,
        `lamour_wedding_data_wedding-${strippedTarget}`,
        `lamour_wedding_data_wedding-${cleanTarget}`,
        `lamour_rsvps_${cleanTarget}`,
        `lamour_rsvps_${strippedTarget}`,
        `lamour_wishes_${cleanTarget}`,
        `lamour_wishes_${strippedTarget}`,
        `lamour_live_album_${cleanTarget}`,
        `lamour_live_album_${strippedTarget}`,
      ];
      if (cleanOrder) {
        keysToRemove.push(
          `lamour_wedding_data_${cleanOrder}`,
          `lamour_rsvps_${cleanOrder}`,
          `lamour_wishes_${cleanOrder}`
        );
      }
      for (const k of keysToRemove) {
        localStorage.removeItem(k);
      }

      // Dispatch global deletion events
      window.dispatchEvent(
        new CustomEvent('lamour_wedding_deleted', {
          detail: { id: cleanTarget, slug: strippedTarget, orderCode: cleanOrder },
        })
      );
      window.dispatchEvent(
        new CustomEvent('lamour_wedding_data_saved', {
          detail: updated[0] || null,
        })
      );

      try {
        const bc = new BroadcastChannel('lamour_wedding_sync');
        bc.postMessage({
          type: 'WEDDING_DELETED',
          id: cleanTarget,
          slug: strippedTarget,
          orderCode: cleanOrder,
        });
        setTimeout(() => {
          try {
            bc.close();
          } catch {}
        }, 1000);
      } catch {}
    } catch (e) {
      console.warn('Error clearing local cache for deleted wedding:', e);
    }
  }

  // 4. Delete documents from Firestore collections if configured
  if (isFirebaseConfigured && db) {
    try {
      const idsToDelete = [
        cleanTarget,
        strippedTarget,
        `wedding-${strippedTarget}`,
      ];
      if (cleanOrder) idsToDelete.push(cleanOrder);

      const uniqueIds = Array.from(new Set(idsToDelete.filter(Boolean)));
      for (const docId of uniqueIds) {
        try {
          await deleteDoc(doc(db, 'weddings', docId));
        } catch {}
        try {
          await deleteDoc(doc(db, 'locks', docId));
        } catch {}
      }
    } catch (err) {
      console.warn('Firestore deleteWeddingFromPlatform error:', err);
    }
  }

  return updated;
}

export function savePackagesConfig(packages: CommercialPackage[]): void {
  try {
    localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lamour_commercial_packages_updated', { detail: packages }));
      try {
        const bc = new BroadcastChannel('lamour_wedding_sync');
        bc.postMessage({ type: 'PACKAGES_UPDATED', packages });
        setTimeout(() => {
          try { bc.close(); } catch {}
        }, 1000);
      } catch {}
    }

    if (isFirebaseConfigured && db) {
      for (const pkg of packages) {
        if (pkg.id) {
          const sanitized = JSON.parse(JSON.stringify(pkg));
          setDoc(doc(db, 'packages', pkg.id), sanitized, { merge: true }).catch((err) => {
            console.warn('Failed to sync package to Firestore:', pkg.id, err);
          });
        }
      }
    }
  } catch (e) {
    console.error('Failed to save packages config:', e);
  }
}

export function saveTemplatesConfig(templates: CommercialTemplate[]): void {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lamour_commercial_templates_updated', { detail: templates }));
    }
  } catch (e) {
    console.error('Failed to save templates config:', e);
  }
}

// Revenue & Financial calculations
export interface RevenueStats {
  totalRevenue: number;
  paidOrdersCount: number;
  totalOrdersCount: number;
  pendingAmount: number;
  averageOrderValue: number;
  conversionRate: number;
  packageBreakdown: {
    packageName: string;
    count: number;
    revenue: number;
    percentage: number;
  }[];
}

export async function calculatePlatformRevenueStats(): Promise<RevenueStats> {
  const leads: Lead[] = await getLeads();
  const packages = DEFAULT_COMMERCIAL_PACKAGES;

  const packagePrices: Record<string, { price: number; name: string }> = {
    basic: { price: 299000, name: 'Gói Cơ Bản (Basic)' },
    'pkg-basic': { price: 299000, name: 'Gói Cơ Bản (Basic)' },
    premium: { price: 499000, name: 'Gói Cao Cấp (Premium)' },
    'pkg-premium': { price: 499000, name: 'Gói Cao Cấp (Premium)' },
    vip: { price: 799000, name: 'Gói Thiết Kế Riêng (VIP)' },
    'pkg-vip': { price: 799000, name: 'Gói Thiết Kế Riêng (VIP)' },
  };

  let totalRevenue = 0;
  let pendingAmount = 0;
  let paidCount = 0;
  const packageCounts: Record<string, { count: number; revenue: number; name: string }> = {
    basic: { count: 0, revenue: 0, name: 'Gói Cơ Bản' },
    premium: { count: 0, revenue: 0, name: 'Gói Cao Cấp' },
    vip: { count: 0, revenue: 0, name: 'Gói VIP' },
  };

  // Base simulation seed if leads list is small
  const seedPaid = [
    { pkg: 'premium', price: 499000 },
    { pkg: 'premium', price: 499000 },
    { pkg: 'basic', price: 299000 },
    { pkg: 'vip', price: 799000 },
    { pkg: 'premium', price: 499000 },
  ];

  seedPaid.forEach((item) => {
    totalRevenue += item.price;
    paidCount += 1;
    if (packageCounts[item.pkg]) {
      packageCounts[item.pkg].count += 1;
      packageCounts[item.pkg].revenue += item.price;
    }
  });

  leads.forEach((l) => {
    const pkgKey = l.package ? l.package.replace('pkg-', '') : 'premium';
    const priceInfo = packagePrices[l.package] || packagePrices[pkgKey] || { price: 499000, name: 'Cao Cấp' };

    if (l.status === 'PAID' || l.status === 'COMPLETED') {
      totalRevenue += priceInfo.price;
      paidCount += 1;
      if (packageCounts[pkgKey]) {
        packageCounts[pkgKey].count += 1;
        packageCounts[pkgKey].revenue += priceInfo.price;
      }
    } else if (l.status === 'WAITING_PAYMENT' || l.status === 'NEGOTIATING' || l.status === 'NEW') {
      pendingAmount += priceInfo.price;
    }
  });

  const totalOrders = Math.max(leads.length + seedPaid.length, 1);
  const aov = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;
  const conversionRate = Math.round((paidCount / totalOrders) * 100);

  const breakdown = Object.entries(packageCounts).map(([_, val]) => ({
    packageName: val.name,
    count: val.count,
    revenue: val.revenue,
    percentage: totalRevenue > 0 ? Math.round((val.revenue / totalRevenue) * 100) : 0,
  }));

  return {
    totalRevenue,
    paidOrdersCount: paidCount,
    totalOrdersCount: totalOrders,
    pendingAmount,
    averageOrderValue: aov,
    conversionRate,
    packageBreakdown: breakdown,
  };
}

export function slugifyVietnamese(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Creates or activates a live Wedding for a customer lead
 * Ensures strict security and isolation: newly logged-in couples get a clean, customized default template,
 * never inheriting or seeing another customer's data or photos.
 */
export function createOrActivateWeddingFromLead(lead: Lead): WeddingData {
  const allWeddings = getAllWeddings();
  
  let rawGroom = (lead.groomName || '').trim();
  let rawBride = (lead.brideName || '').trim();
  if ((!rawGroom || !rawBride) && lead.name && (lead.name.includes('&') || lead.name.includes('-'))) {
    const separator = lead.name.includes('&') ? '&' : '-';
    const parts = lead.name.split(separator).map((s) => s.trim());
    if (parts.length >= 2) {
      if (!rawGroom) rawGroom = parts[0];
      if (!rawBride) rawBride = parts[1];
    }
  }
  const groomFullName = rawGroom || 'Chú Rể';
  const brideFullName = rawBride || 'Cô Dâu';

  // Crucial requirement: khi khách hàng lần đầu bấm vào chỉnh sửa thiệp thì Đường link riêng của đám cưới (Slug) sẽ chuyển thành tên cô dâu chú rể luôn
  const nameSlug = (rawGroom && rawBride && rawGroom !== 'Chú Rể' && rawBride !== 'Cô Dâu')
    ? slugifyVietnamese(`${rawGroom}-${rawBride}`)
    : '';
  const baseSlug = nameSlug || slugifyVietnamese(`${groomFullName}-${brideFullName}`) || 'wedding';
  const expectedId = `wedding-${baseSlug}`;

  // Check local saved data cache first across all relevant keys
  let localSaved: WeddingData | null = null;
  if (typeof window !== 'undefined') {
    const candidateKeys = [
      lead.id ? `lamour_wedding_data_${lead.id}` : null,
      lead.id ? `lamour_wedding_data_${lead.id.toLowerCase()}` : null,
      baseSlug ? `lamour_wedding_data_${baseSlug}` : null,
      baseSlug ? `lamour_wedding_data_wedding-${baseSlug}` : null,
      nameSlug ? `lamour_wedding_data_${nameSlug}` : null,
      nameSlug ? `lamour_wedding_data_wedding-${nameSlug}` : null,
      lead.id === 'LAMOUR-DEMO' ? 'lamour_wedding_data_LAMOUR-DEMO' : null,
      lead.id === 'LAMOUR-DEMO' ? 'lamour_wedding_data_hoang-long-thu-ha' : null,
      localStorage.getItem('lamour_last_active_slug') ? `lamour_wedding_data_${localStorage.getItem('lamour_last_active_slug')}` : null,
    ].filter(Boolean) as string[];

    for (const key of candidateKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.template || parsed.groomName || parsed.slug)) {
            localSaved = parsed;
            break;
          }
        } catch {}
      }
    }
  }

  // Check if wedding already exists for this lead by orderCode, id, slug, or phone
  const existing = allWeddings.find(
    (w) =>
      (lead.id && (w.orderCode === lead.id || w.id === lead.id || w.id === `wedding-${lead.id}`)) ||
      (localSaved && (w.id === localSaved.id || w.slug === localSaved.slug || (localSaved.orderCode && w.orderCode === localSaved.orderCode))) ||
      w.id === expectedId ||
      w.slug === baseSlug ||
      (nameSlug && (w.slug === nameSlug || w.id === `wedding-${nameSlug}`)) ||
      (lead.phone && w.customerPhone && w.customerPhone.replace(/\D/g, '') === lead.phone.replace(/\D/g, '') && (w.orderCode !== 'LAMOUR-DEMO' || lead.id === 'LAMOUR-DEMO'))
  ) || (localSaved?.orderCode !== 'LAMOUR-DEMO' || lead.id === 'LAMOUR-DEMO' ? localSaved : null);

  const isLeadApproved = lead.status === 'PAID' || lead.status === 'COMPLETED';

  if (existing) {
    const isLockEnforced =
      isSlugLockedAuthoritative(lead.id) ||
      isSlugLockedAuthoritative(baseSlug) ||
      isSlugLockedAuthoritative(nameSlug) ||
      (existing && (
        existing.status === 'LOCKED' ||
        isSlugLockedAuthoritative(existing.id) ||
        isSlugLockedAuthoritative(existing.slug) ||
        isSlugLockedAuthoritative(existing.orderCode)
      )) ||
      localSaved?.status === 'LOCKED';

    const preservedStatus: 'ACTIVE' | 'LOCKED' | 'EXPIRED' =
      !isLeadApproved || isLockEnforced
        ? 'LOCKED'
        : existing.status || 'ACTIVE';

    // Crucial requirement: when customer opens/edits wedding, slug must be converted to bride & groom names
    const targetSlug = nameSlug || (
      (groomFullName !== 'Chú Rể' && brideFullName !== 'Cô Dâu' && baseSlug)
        ? baseSlug
        : (existing.slug || baseSlug)
    );
    const targetId = `wedding-${targetSlug}`;

    const finalGroom = (rawGroom && rawGroom !== 'Chú Rể')
      ? rawGroom
      : (existing.groom?.fullName || existing.groomName || 'Chú Rể');
    const finalBride = (rawBride && rawBride !== 'Cô Dâu')
      ? rawBride
      : (existing.bride?.fullName || existing.brideName || 'Cô Dâu');

    const gParts = finalGroom.split(' ').filter(Boolean);
    const bParts = finalBride.split(' ').filter(Boolean);
    const gShort = gParts[gParts.length - 1] || finalGroom;
    const bShort = bParts[bParts.length - 1] || finalBride;

    // Preserving the chosen template with highest fidelity:
    // 1. localSaved.template (couple's explicit saved choice)
    // 2. existing.template (if not default classic-luxury)
    // 3. lead.template (if lead had chosen custom template)
    // 4. existing.template || lead.template || w.template || 'classic-luxury'
    const chosenTemplate =
      localSaved?.template ||
      (existing?.template && existing.template !== 'classic-luxury' ? existing.template : null) ||
      (lead.template && lead.template !== 'classic-luxury' ? lead.template : null) ||
      existing?.template ||
      (lead.template as any) ||
      'classic-luxury';

    const updated = allWeddings.map((w) =>
      w.id === existing.id || w.slug === existing.slug || (w.orderCode && w.orderCode === lead.id)
        ? {
            ...w,
            id: targetId,
            slug: targetSlug,
            status: preservedStatus,
            isPublished: isLeadApproved ? (existing.isPublished !== undefined ? existing.isPublished : true) : false,
            orderCode: lead.id || w.orderCode,
            groomName: finalGroom,
            brideName: finalBride,
            groom: {
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
              bio: '',
              ...(w.groom || existing.groom || {}),
              role: 'groom' as const,
              fullName: finalGroom,
              name: gShort,
            },
            bride: {
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
              bio: '',
              ...(w.bride || existing.bride || {}),
              role: 'bride' as const,
              fullName: finalBride,
              name: bShort,
            },
            weddingDate: w.weddingDate || existing.weddingDate || lead.weddingDate,
            template: chosenTemplate,
            packageId: lead.package || w.packageId,
            customerPhone: lead.phone || w.customerPhone,
            customerEmail: lead.email || w.customerEmail,
            updatedAt: new Date().toISOString(),
          }
        : w
    );
    if (!allWeddings.some((w) => w.id === targetId || w.slug === targetSlug || w.id === existing.id || w.slug === existing.slug)) {
      updated.unshift({ ...existing, id: targetId, slug: targetSlug, status: preservedStatus, template: chosenTemplate });
    }
    saveAllWeddings(updated);
    const targetWedding = updated.find((w) => w.id === targetId || w.slug === targetSlug || w.id === existing.id || w.slug === existing.slug)!;
    if (typeof window !== 'undefined') {
      localStorage.setItem(`lamour_wedding_data_${targetSlug}`, JSON.stringify(targetWedding));
      localStorage.setItem(`lamour_wedding_data_wedding-${targetSlug}`, JSON.stringify(targetWedding));
      if (lead.id) {
        localStorage.setItem(`lamour_wedding_data_${lead.id}`, JSON.stringify(targetWedding));
      }
      localStorage.setItem('lamour_last_active_slug', targetSlug);
      if (existing.slug && existing.slug !== targetSlug) {
        localStorage.removeItem(`lamour_wedding_data_${existing.slug}`);
      }
    }
    return targetWedding;
  }

  // Generate unique slug for new couple ensuring no conflict with id or slug
  let candidateSlug = baseSlug;
  let counter = 1;
  while (allWeddings.some((w) => w.slug === candidateSlug || w.id === `wedding-${candidateSlug}`)) {
    candidateSlug = `${baseSlug}-${counter++}`;
  }

  // Calculate expiration based on package
  const pkg = lead.package ? lead.package.toLowerCase() : 'premium';
  const expiryDate = new Date();
  let packageName = 'Gói Cao Cấp (Premium)';
  if (pkg.includes('vip')) {
    expiryDate.setFullYear(expiryDate.getFullYear() + 2); // 2 years / lifetime
    packageName = 'Gói Thiết Kế Riêng (VIP)';
  } else if (pkg.includes('basic')) {
    expiryDate.setMonth(expiryDate.getMonth() + 6); // 6 months
    packageName = 'Gói Cơ Bản (Basic)';
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year
    packageName = 'Gói Cao Cấp (Premium)';
  }

  // Generate 4-digit PIN for couple login
  const randomPin = String(Math.floor(1000 + Math.random() * 9000));

  const groomParts = groomFullName.split(' ').filter(Boolean);
  const brideParts = brideFullName.split(' ').filter(Boolean);
  const groomShort = groomParts[groomParts.length - 1] || groomFullName;
  const brideShort = brideParts[brideParts.length - 1] || brideFullName;
  const weddingDateStr = lead.weddingDate || '2026-11-20';

  const newWedding: WeddingData = {
    ...DEMO_WEDDING,
    id: `wedding-${candidateSlug}`,
    slug: candidateSlug,
    groomName: groomFullName,
    brideName: brideFullName,
    weddingDate: weddingDateStr,
    weddingDateTime: `${weddingDateStr}T17:30:00`,
    template: localSaved?.template || (lead.template as any) || 'classic-luxury',
    romanticQuote: `“${groomShort} & ${brideShort} — Tình yêu không chỉ là nhìn nhau, mà là cùng nhau nhìn về một hướng và xây đắp một mái ấm vẹn tròn.”`,
    groom: {
      role: 'groom',
      fullName: groomFullName,
      name: groomShort,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      bio: `Chú rể ${groomShort} hân hoan cùng cô dâu ${brideShort} chuẩn bị cho ngày trọng đại nhất của cuộc đời. Cảm ơn tình cảm và sự hiện diện của mọi người.`,
      parents: {
        father: 'Thân phụ Chú rể',
        mother: 'Thân mẫu Chú rể',
      },
      socials: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        phone: lead.phone || '',
      },
    },
    bride: {
      role: 'bride',
      fullName: brideFullName,
      name: brideShort,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      bio: `Cô dâu ${brideShort} gửi lời cảm ơn chân thành đến gia đình và quý bạn bè đã luôn đồng hành, yêu thương và chúc phúc cho hai đứa.`,
      parents: {
        father: 'Thân phụ Cô dâu',
        mother: 'Thân mẫu Cô dâu',
      },
      socials: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        phone: '',
      },
    },
    events: [
      {
        id: `event-${candidateSlug}-1`,
        title: 'Lễ Thành Hôn (Vu Quy)',
        type: 'ceremony',
        time: '09:00',
        date: weddingDateStr,
        locationName: 'Tư gia Nhà Gái',
        address: 'Số 123 Đường Hoa Hồng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        mapUrl: 'https://maps.google.com',
        description: 'Nghi thức rước dâu và thắp hương gia tiên truyền thống.',
      },
      {
        id: `event-${candidateSlug}-2`,
        title: 'Tiệc Cưới Chung Vui',
        type: 'reception',
        time: '18:00',
        date: weddingDateStr,
        locationName: 'Trung Tâm Hội Nghị Tiệc Cưới Riverside Palace',
        address: '360D Bến Vân Đồn, Phường 1, Quận 4, TP. Hồ Chí Minh',
        mapUrl: 'https://maps.google.com',
        description: 'Đón khách lúc 17:30. Khai tiệc mừng hạnh phúc lúc 18:30.',
      },
    ],
    stories: [
      {
        id: `story-${candidateSlug}-1`,
        year: '2022',
        dateStr: '15/09/2022',
        title: 'Lần Đầu Gặp Gỡ',
        description: 'Một buổi chiều thu dịu mát, chúng mình vô tình gặp nhau và nhận ra nửa kia của cuộc đời.',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: `story-${candidateSlug}-2`,
        year: '2024',
        dateStr: '20/10/2024',
        title: 'Chính Thức Hẹn Hò',
        description: 'Tình yêu đơm hoa kết trái qua những chuyến đi xa và những kỷ niệm ngọt ngào.',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: `story-${candidateSlug}-3`,
        year: '2025',
        dateStr: '14/02/2025',
        title: 'Khoảnh Khắc Cầu Hôn',
        description: 'Dưới ánh hoàng hôn lãng mạn, câu trả lời "Em đồng ý" đã mở ra một chương mới tràn ngập yêu thương.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: `story-${candidateSlug}-4`,
        year: '2026',
        dateStr: '20/11/2026',
        title: 'Ngày Chung Đôi',
        description: 'Cùng nhau bước vào lễ đường, bắt đầu hành trình hôn nhân hạnh phúc trọn đời.',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      },
    ],
    gift: {
      groomBank: {
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        qrCodeUrl: '',
        note: '',
      },
      brideBank: {
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        qrCodeUrl: '',
        note: '',
      },
      message: 'Sự hiện diện và lời chúc phúc của quý khách là món quà quý giá nhất dành cho chúng mình. Nếu muốn gửi chút tình cảm từ phương xa, quý khách có thể gửi qua số tài khoản dưới đây.',
    },
    isPublished: isLeadApproved && !isSlugLockedAuthoritative(lead.id) && !isSlugLockedAuthoritative(candidateSlug),
    status: (isLeadApproved && !isSlugLockedAuthoritative(lead.id) && !isSlugLockedAuthoritative(candidateSlug) && !isSlugLockedAuthoritative(nameSlug)) ? 'ACTIVE' : 'LOCKED',
    expiresAt: expiryDate.toISOString(),
    packageId: lead.package || 'premium',
    packageName: packageName,
    viewsCount: 1,
    accessPin: randomPin,
    orderCode: lead.id,
    customerPhone: lead.phone,
    customerEmail: lead.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [
    newWedding,
    ...allWeddings.filter((w) => w.id !== newWedding.id && w.slug !== newWedding.slug),
  ];
  saveAllWeddings(updatedList);
  if (typeof window !== 'undefined') {
    localStorage.setItem(`lamour_wedding_data_${candidateSlug}`, JSON.stringify(newWedding));
  }
  return newWedding;
}
