import { PackageUpgradeRequest, UpgradeRequestStatus, CommercialPackage } from '../types/commercial';
import { WeddingData } from '../types';
import { DEFAULT_COMMERCIAL_PACKAGES } from '../data/commercialDefaults';
import { getCommercialPackages } from './packageService';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { getAllWeddings, saveAllWeddings, updateWeddingInRegistry, extendWeddingExpiry } from './siteConfigService';
import { getLeads, updateLeadStatus, updateLeadPackage } from './leadService';
import { saveWeddingData } from './weddingService';

const LOCAL_STORAGE_UPGRADES_KEY = 'lamour_package_upgrade_requests';

function getLocalUpgradeRequests(): PackageUpgradeRequest[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_UPGRADES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalUpgradeRequests(requests: PackageUpgradeRequest[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_UPGRADES_KEY, JSON.stringify(requests));
  } catch (err) {
    console.warn('Could not save upgrade requests locally:', err);
  }
}

/**
 * Normalizes package slug / id into canonical slug ('basic', 'premium', 'vip')
 */
export function normalizePackageSlug(pkgIdOrSlug?: string): string {
  if (!pkgIdOrSlug) return 'basic';
  const clean = pkgIdOrSlug.toLowerCase().trim();
  if (
    clean === 'vip' ||
    clean === 'pkg-vip' ||
    clean.includes('vip') ||
    clean.includes('pkg-vip') ||
    clean.includes('thiết kế riêng') ||
    clean.includes('thiet ke rieng') ||
    clean.includes('custom')
  ) return 'vip';
  if (
    clean === 'premium' ||
    clean === 'pkg-premium' ||
    clean.includes('premium') ||
    clean.includes('pkg-premium') ||
    clean.includes('cao cấp') ||
    clean.includes('cao cap')
  ) return 'premium';
  return 'basic';
}

/**
 * Calculates the exact price difference and upgrade details between two packages
 */
export async function calculateUpgradeDetails(
  currentPackageIdOrSlug?: string,
  targetPackageIdOrSlug?: string,
  providedPackages?: CommercialPackage[]
) {
  const packages = providedPackages || (await getCommercialPackages()) || DEFAULT_COMMERCIAL_PACKAGES;

  const currentSlug = normalizePackageSlug(currentPackageIdOrSlug);
  const targetSlug = normalizePackageSlug(targetPackageIdOrSlug);

  const currentPkg =
    packages.find((p) => p.slug === currentSlug || p.id === currentPackageIdOrSlug) ||
    packages.find((p) => p.slug === 'basic') ||
    DEFAULT_COMMERCIAL_PACKAGES[0];

  const targetPkg =
    packages.find((p) => p.slug === targetSlug || p.id === targetPackageIdOrSlug) ||
    packages.find((p) => p.slug === 'premium') ||
    DEFAULT_COMMERCIAL_PACKAGES[1];

  const currentPaid = currentPkg.price;
  const targetPrice = targetPkg.price;
  const difference = Math.max(0, targetPrice - currentPaid);

  const tierOrder: Record<string, number> = { basic: 1, premium: 2, vip: 3 };
  const currentTier = tierOrder[currentSlug] || 1;
  const targetTier = tierOrder[targetSlug] || 2;
  const isValidUpgrade = targetTier > currentTier;

  return {
    currentPackage: currentPkg,
    targetPackage: targetPkg,
    currentPaid,
    targetPrice,
    difference,
    differenceFormatted: `${difference.toLocaleString('vi-VN')} đ`,
    isValidUpgrade,
  };
}

/**
 * Submits an upgrade request from couple after bank transfer
 */
export async function submitUpgradeRequest(params: {
  orderCode: string;
  weddingId?: string;
  weddingSlug?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  currentPackage: string;
  targetPackage: string;
  note?: string;
}): Promise<PackageUpgradeRequest> {
  const calculation = await calculateUpgradeDetails(params.currentPackage, params.targetPackage);

  const randomId = Math.floor(100000 + Math.random() * 900000);
  const requestId = `UPGRADE-${randomId}`;
  const now = new Date().toISOString();

  const memoContent = `NANG CAP ${params.orderCode || 'LAMOUR'} ${calculation.targetPackage.slug.toUpperCase()}`.trim();

  const newRequest: PackageUpgradeRequest = {
    id: requestId,
    orderCode: params.orderCode,
    weddingId: params.weddingId,
    weddingSlug: params.weddingSlug,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    customerEmail: params.customerEmail,
    currentPackage: calculation.currentPackage.slug,
    currentPackageName: calculation.currentPackage.name,
    targetPackage: calculation.targetPackage.slug,
    targetPackageName: calculation.targetPackage.name,
    currentPaidAmount: calculation.currentPaid,
    targetPrice: calculation.targetPrice,
    upgradeAmount: calculation.difference,
    transferMemo: memoContent,
    note: params.note,
    status: 'PENDING',
    createdAt: now,
  };

  // 1. Save locally
  const localList = getLocalUpgradeRequests();
  // Replace existing pending request for this order if any, or prepend
  const filtered = localList.filter(
    (r) => !(r.orderCode === params.orderCode && r.status === 'PENDING')
  );
  filtered.unshift(newRequest);
  saveLocalUpgradeRequests(filtered);

  // 2. Mark pending status on the wedding
  const allWeddings = getAllWeddings();
  const matchedIndex = allWeddings.findIndex(
    (w) =>
      (params.weddingId && w.id === params.weddingId) ||
      (params.weddingSlug && w.slug === params.weddingSlug) ||
      (params.orderCode && w.orderCode === params.orderCode) ||
      (params.customerPhone && w.customerPhone && w.customerPhone.replace(/\D/g, '') === params.customerPhone.replace(/\D/g, ''))
  );

  if (matchedIndex >= 0) {
    const w = allWeddings[matchedIndex];
    w.upgradeStatus = 'PENDING';
    w.pendingUpgradePackage = calculation.targetPackage.slug;
    w.updatedAt = now;
    allWeddings[matchedIndex] = w;
    saveAllWeddings(allWeddings);
    updateWeddingInRegistry(w);

    if (typeof window !== 'undefined' && w.slug) {
      localStorage.setItem(`lamour_wedding_data_${w.slug}`, JSON.stringify(w));
    }
  }

  // 3. Persist to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'upgrade_requests', newRequest.id), newRequest);
    } catch (err) {
      console.warn('Firestore submitUpgradeRequest offline/unavailable:', err);
    }
  }

  // Dispatch event for UI reaction
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('lamour_upgrade_requested', { detail: newRequest })
    );
  }

  return newRequest;
}

/**
 * Submits an extension request from couple for storage/visibility renewal
 */
export async function submitExtensionRequest(params: {
  orderCode: string;
  weddingId?: string;
  weddingSlug?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  extensionMonths: number | 'LIFETIME';
  extensionPlanTitle: string;
  price: number;
  currentPackage?: string;
  currentPackageName?: string;
  note?: string;
}): Promise<PackageUpgradeRequest> {
  const randomId = Math.floor(100000 + Math.random() * 900000);
  const requestId = `EXTENSION-${randomId}`;
  const now = new Date().toISOString();

  const memoContent = `GIAHAN ${params.orderCode || 'LAMOUR'} ${params.customerPhone || ''}`.trim();

  const newRequest: PackageUpgradeRequest = {
    id: requestId,
    type: 'EXTENSION',
    extensionMonths: params.extensionMonths,
    extensionPlanTitle: params.extensionPlanTitle,
    orderCode: params.orderCode,
    weddingId: params.weddingId,
    weddingSlug: params.weddingSlug,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    customerEmail: params.customerEmail,
    currentPackage: params.currentPackage || 'basic',
    currentPackageName: params.currentPackageName || 'Gói Thiệp',
    targetPackage: params.currentPackage || 'basic',
    targetPackageName: `Gia Hạn: ${params.extensionPlanTitle}`,
    currentPaidAmount: 0,
    targetPrice: params.price,
    upgradeAmount: params.price,
    transferMemo: memoContent,
    note: params.note,
    status: 'PENDING',
    createdAt: now,
  };

  // 1. Save locally
  const localList = getLocalUpgradeRequests();
  const filtered = localList.filter(
    (r) => !(r.orderCode === params.orderCode && r.type === 'EXTENSION' && r.status === 'PENDING')
  );
  filtered.unshift(newRequest);
  saveLocalUpgradeRequests(filtered);

  // 2. Mark pending extension status on the wedding
  const allWeddings = getAllWeddings();
  const matchedIndex = allWeddings.findIndex(
    (w) =>
      (params.weddingId && w.id === params.weddingId) ||
      (params.weddingSlug && w.slug === params.weddingSlug) ||
      (params.orderCode && w.orderCode === params.orderCode) ||
      (params.customerPhone && w.customerPhone && w.customerPhone.replace(/\D/g, '') === params.customerPhone.replace(/\D/g, ''))
  );

  if (matchedIndex >= 0) {
    const w = allWeddings[matchedIndex];
    w.extensionStatus = 'PENDING';
    w.pendingExtensionMonths = params.extensionMonths;
    w.pendingExtensionTitle = params.extensionPlanTitle;
    w.updatedAt = now;
    allWeddings[matchedIndex] = w;
    saveAllWeddings(allWeddings);
    updateWeddingInRegistry(w);

    if (typeof window !== 'undefined' && w.slug) {
      localStorage.setItem(`lamour_wedding_data_${w.slug}`, JSON.stringify(w));
    }
  }

  // 3. Persist to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'upgrade_requests', newRequest.id), newRequest);
    } catch (err) {
      console.warn('Firestore submitExtensionRequest offline/unavailable:', err);
    }
  }

  // Dispatch event for UI reaction
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('lamour_upgrade_requested', { detail: newRequest })
    );
  }

  return newRequest;
}

export async function getUpgradeRequests(): Promise<PackageUpgradeRequest[]> {
  const localList = getLocalUpgradeRequests();
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'upgrade_requests'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const remoteList: PackageUpgradeRequest[] = [];
      snap.forEach((d) => remoteList.push(d.data() as PackageUpgradeRequest));

      const localMap = new Map<string, PackageUpgradeRequest>(
        localList.map((r) => [r.id, r])
      );

      // Smart merge: If admin resolved an item locally (APPROVED or REJECTED)
      // but remote still shows PENDING, local resolution MUST prevail!
      const merged: PackageUpgradeRequest[] = [];
      const remoteHandled = new Set<string>();

      for (const remoteItem of remoteList) {
        remoteHandled.add(remoteItem.id);
        const localItem = localMap.get(remoteItem.id);
        if (
          localItem &&
          (localItem.status === 'APPROVED' || localItem.status === 'REJECTED') &&
          remoteItem.status === 'PENDING'
        ) {
          // Local approval is authoritative - keep local and heal remote in Firestore
          merged.push(localItem);
          setDoc(doc(db, 'upgrade_requests', remoteItem.id), localItem, { merge: true }).catch(() => {});
        } else {
          merged.push(remoteItem);
        }
      }

      // Add any local items not present in remote yet
      for (const localItem of localList) {
        if (!remoteHandled.has(localItem.id)) {
          merged.push(localItem);
        }
      }

      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveLocalUpgradeRequests(merged);
      return merged;
    } catch (err) {
      console.warn('Firestore getUpgradeRequests failed, fallback to local:', err);
    }
  }
  return localList;
}

/**
 * Gets the active pending upgrade request for an order or phone
 */
export async function getPendingUpgradeForOrder(
  orderCodeOrPhone: string
): Promise<PackageUpgradeRequest | null> {
  const clean = orderCodeOrPhone.trim().toLowerCase();
  const all = await getUpgradeRequests();
  return (
    all.find(
      (r) =>
        r.status === 'PENDING' &&
        (r.type === 'PACKAGE' || !r.type) &&
        (r.orderCode.toLowerCase() === clean ||
          r.customerPhone.includes(clean) ||
          r.customerPhone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')))
    ) || null
  );
}

/**
 * Gets the active pending extension request for an order or phone
 */
export async function getPendingExtensionForOrder(
  orderCodeOrPhone: string
): Promise<PackageUpgradeRequest | null> {
  const clean = orderCodeOrPhone.trim().toLowerCase();
  const all = await getUpgradeRequests();
  return (
    all.find(
      (r) =>
        r.status === 'PENDING' &&
        r.type === 'EXTENSION' &&
        (r.orderCode.toLowerCase() === clean ||
          r.customerPhone.includes(clean) ||
          r.customerPhone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')))
    ) || null
  );
}

/**
 * Admin approves upgrade request: activates higher package & extends expiration
 */
export async function approveUpgradeRequest(
  requestId: string,
  adminName = 'Admin'
): Promise<{ success: boolean; request?: PackageUpgradeRequest; wedding?: WeddingData }> {
  const allRequests = await getUpgradeRequests();
  const request = allRequests.find((r) => r.id === requestId);

  if (!request) {
    return { success: false };
  }

  const now = new Date().toISOString();
  request.status = 'APPROVED';
  request.reviewedAt = now;
  request.reviewedBy = adminName;

  // 1. Update request in LocalStorage & Firestore (using setDoc with merge so it never fails if missing)
  const updatedRequests = allRequests.map((r) => (r.id === requestId ? request : r));
  saveLocalUpgradeRequests(updatedRequests);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(
        doc(db, 'upgrade_requests', requestId),
        {
          ...request,
          status: 'APPROVED',
          reviewedAt: now,
          reviewedBy: adminName,
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Firestore approve upgrade request setDoc failed:', e);
    }
  }

  // 2. Update Lead package in Leads collection if package upgrade
  if (request.type === 'PACKAGE' || !request.type) {
    try {
      const leads = await getLeads();
      const lead = leads.find(
        (l) =>
          l.id === request.orderCode ||
          (l.phone && request.customerPhone && l.phone.replace(/\D/g, '') === request.customerPhone.replace(/\D/g, ''))
      );
      if (lead) {
        await updateLeadPackage(lead.id, request.targetPackage, 'PAID');
      }
    } catch (e) {
      console.warn('Sync lead package failed:', e);
    }
  }

  // 3. Update WeddingData package / album slots / expiry
  const allWeddings = getAllWeddings();
  const cleanOrder = (request.orderCode || '').toLowerCase().trim();
  const cleanSlug = (request.weddingSlug || '').toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
  const strippedSlug = cleanSlug.replace(/^wedding-/, '');
  const cleanId = (request.weddingId || '').toLowerCase().trim();
  const cleanPhone = (request.customerPhone || '').replace(/\D/g, '');

  let updatedWedding: WeddingData | undefined;

  const updatedWeddingsList = allWeddings.map((w) => {
    const wId = (w.id || '').toLowerCase().trim();
    const wSlug = (w.slug || '').toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
    const wStripped = wSlug.replace(/^wedding-/, '');
    const wOrder = (w.orderCode || '').toLowerCase().trim();
    const wPhone = (w.customerPhone || '').replace(/\D/g, '');

    const isMatch =
      (cleanId && (wId === cleanId || wId === cleanSlug || wStripped === strippedSlug)) ||
      (cleanSlug && (wSlug === cleanSlug || wStripped === strippedSlug || wSlug === strippedSlug)) ||
      (cleanOrder && (wOrder === cleanOrder || (wOrder && cleanOrder.includes(wOrder)))) ||
      (cleanPhone && wPhone && wPhone.length >= 8 && (wPhone.includes(cleanPhone) || cleanPhone.includes(wPhone)));

    if (!isMatch) return w;

    if (request.type === 'EXTENSION') {
      // 1. Extend storage/display expiration date upon Admin approval
      let newExpiry: string;
      if (request.extensionMonths === 'LIFETIME') {
        newExpiry = '2099-12-31T23:59:59Z';
      } else {
        const months = typeof request.extensionMonths === 'number' ? request.extensionMonths : 12;
        const current = w.expiresAt ? new Date(w.expiresAt) : new Date();
        const baseDate = isNaN(current.getTime()) || current < new Date() ? new Date() : current;
        baseDate.setMonth(baseDate.getMonth() + months);
        newExpiry = baseDate.toISOString();
      }

      w.expiresAt = newExpiry;
      w.extensionStatus = 'APPROVED';
      w.pendingExtensionMonths = undefined;
      w.pendingExtensionTitle = undefined;
      w.status = 'ACTIVE';
      w.updatedAt = now;
    } else if (request.type === 'ALBUM_SLOTS') {
      // 2. Grant extra photo album slots upon Admin approval
      const extraToAdd = request.extraSlots || 0;
      w.extraPhotosPurchased = (w.extraPhotosPurchased || 0) + extraToAdd;
      const currentLive = w.liveAlbum || {
        enabled: true,
        title: 'Khoảnh Khắc Ngày Cưới',
        description: 'Những hình ảnh chân thực trong ngày cưới.',
        extraPhotosPurchased: 0,
        photos: [],
      };
      w.liveAlbum = {
        ...currentLive,
        extraPhotosPurchased: (currentLive.extraPhotosPurchased || 0) + extraToAdd,
      };
      w.status = 'ACTIVE';
      w.updatedAt = now;
    } else {
      // 3. Upgrade Package
      w.packageId = request.targetPackage;
      w.packageName = request.targetPackageName;
      w.upgradeStatus = 'APPROVED';
      w.pendingUpgradePackage = undefined;
      w.status = 'ACTIVE';

      // Extend expiration based on upgraded plan
      const newExpiry = new Date();
      if (request.targetPackage === 'vip') {
        newExpiry.setFullYear(newExpiry.getFullYear() + 2); // 2 years
      } else {
        newExpiry.setFullYear(newExpiry.getFullYear() + 1); // 1 year
      }
      w.expiresAt = newExpiry.toISOString();
      w.updatedAt = now;
    }

    updatedWedding = { ...w };
    return w;
  });

  saveAllWeddings(updatedWeddingsList);

  if (updatedWedding) {
    const targetW = updatedWedding as WeddingData;
    updateWeddingInRegistry(targetW);

    if (typeof window !== 'undefined') {
      const slugKey = (targetW.slug || 'minh-anh').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      localStorage.setItem(`lamour_wedding_data_${slugKey}`, JSON.stringify(targetW));
      if (targetW.id) {
        localStorage.setItem(`lamour_wedding_data_${targetW.id}`, JSON.stringify(targetW));
      }
      if (targetW.orderCode) {
        localStorage.setItem(`lamour_wedding_data_${targetW.orderCode}`, JSON.stringify(targetW));
      }
      window.dispatchEvent(new CustomEvent('lamour_wedding_data_saved', { detail: targetW }));
    }

    // Persist to Firestore with explicit nulls for cleared extension fields so merge deletes them
    if (isFirebaseConfigured && db) {
      try {
        const slugKey = (targetW.slug || 'minh-anh').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
        const payload: Record<string, any> = {
          ...targetW,
          extensionStatus: 'APPROVED',
          pendingExtensionTitle: null,
          pendingExtensionMonths: null,
          status: 'ACTIVE',
          expiresAt: targetW.expiresAt,
          updatedAt: now,
        };
        const sanitized = JSON.parse(JSON.stringify(payload));
        sanitized.extensionStatus = 'APPROVED';
        sanitized.pendingExtensionTitle = null;
        sanitized.pendingExtensionMonths = null;

        setDoc(doc(db, 'weddings', slugKey), sanitized, { merge: true }).catch(() => {});
        if (targetW.id && targetW.id !== slugKey) {
          setDoc(doc(db, 'weddings', targetW.id), sanitized, { merge: true }).catch(() => {});
        }
        setDoc(doc(db, 'locks', slugKey), { locked: false, status: 'ACTIVE', updatedAt: now }, { merge: true }).catch(() => {});
      } catch (err) {
        console.warn('Error saving approved wedding to Firestore:', err);
      }
    }
  }

  // Dispatch events for all components and dashboard counts
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('lamour_upgrade_approved', {
        detail: { request, wedding: updatedWedding },
      })
    );
  }

  return { success: true, request, wedding: updatedWedding };
}

/**
 * Approve all pending upgrade / extension / album slot requests in one click
 */
export async function approveAllPendingUpgradeRequests(
  adminName = 'Admin'
): Promise<{ success: boolean; approvedCount: number }> {
  const requests = await getUpgradeRequests();
  const pending = requests.filter((r) => r.status === 'PENDING');
  let approvedCount = 0;

  for (const req of pending) {
    try {
      const res = await approveUpgradeRequest(req.id, adminName);
      if (res.success) {
        approvedCount++;
      }
    } catch (e) {
      console.warn('Error approving request in batch:', req.id, e);
    }
  }

  return { success: true, approvedCount };
}

/**
 * Admin rejects upgrade request with reason
 */
export async function rejectUpgradeRequest(
  requestId: string,
  rejectionReason = 'Giao dịch chuyển khoản chưa khớp số tiền',
  adminName = 'Admin'
): Promise<{ success: boolean; request?: PackageUpgradeRequest }> {
  const allRequests = await getUpgradeRequests();
  const request = allRequests.find((r) => r.id === requestId);

  if (!request) {
    return { success: false };
  }

  const now = new Date().toISOString();
  request.status = 'REJECTED';
  request.rejectionReason = rejectionReason;
  request.reviewedAt = now;
  request.reviewedBy = adminName;

  const updatedRequests = allRequests.map((r) => (r.id === requestId ? request : r));
  saveLocalUpgradeRequests(updatedRequests);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'upgrade_requests', requestId), {
        status: 'REJECTED',
        rejectionReason,
        reviewedAt: now,
        reviewedBy: adminName,
      });
    } catch (e) {
      console.warn('Firestore reject upgrade request update failed:', e);
    }
  }

  // Update Wedding status
  const allWeddings = getAllWeddings();
  const weddingIdx = allWeddings.findIndex(
    (w) =>
      (request.weddingId && w.id === request.weddingId) ||
      (request.weddingSlug && w.slug === request.weddingSlug) ||
      (request.orderCode && w.orderCode === request.orderCode)
  );

  if (weddingIdx >= 0) {
    const w = allWeddings[weddingIdx];
    if (request.type === 'EXTENSION') {
      w.extensionStatus = 'REJECTED';
      w.pendingExtensionMonths = undefined;
      w.pendingExtensionTitle = undefined;
    } else {
      w.upgradeStatus = 'REJECTED';
      w.pendingUpgradePackage = undefined;
    }
    w.updatedAt = now;
    allWeddings[weddingIdx] = w;
    saveAllWeddings(allWeddings);
    updateWeddingInRegistry(w);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('lamour_upgrade_rejected', { detail: { request } })
    );
  }

  return { success: true, request };
}
