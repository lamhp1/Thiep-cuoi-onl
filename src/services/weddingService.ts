import { WeddingData, CouplePerson } from '../types';
import { DEMO_WEDDING } from '../data/demoWedding';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query } from 'firebase/firestore';
import { getAllWeddings, updateWeddingInRegistry, isSlugLockedAuthoritative, unlockSlugAuthoritative, deleteWeddingFromPlatform, slugifyVietnamese } from './siteConfigService';

const LOCAL_STORAGE_KEY_PREFIX = 'lamour_wedding_data_';

/**
 * Normalizes and synchronizes bride and groom names across all representations:
 * - data.groomName & data.brideName (used for titles, headers, envelope, gifts, RSVP)
 * - data.groom.fullName & data.bride.fullName (used in couple cards & biographies)
 * - data.groom.name & data.bride.name (short call names used in modern typography & monogram)
 */
export function normalizeWeddingData(data: WeddingData): WeddingData {
  const cleanSlug = (data.slug || 'minh-anh').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'minh-anh';

  // --- GROOM NAME RECONCILIATION ---
  const groomFullName = (data.groom?.fullName || '').trim();
  const groomTitleName = (data.groomName || '').trim();

  let finalGroomFullName = groomFullName || groomTitleName || DEMO_WEDDING.groomName;
  if (groomFullName && groomFullName !== 'Chú Rể') {
    finalGroomFullName = groomFullName;
  } else if (groomTitleName && groomTitleName !== 'Chú Rể') {
    finalGroomFullName = groomTitleName;
  }

  const groomParts = finalGroomFullName.split(' ').filter(Boolean);
  const derivedGroomShort = groomParts[groomParts.length - 1] || finalGroomFullName;
  const finalGroomShortName = (data.groom?.name && data.groom.name.trim() && data.groom.name.trim() !== 'Chú Rể')
    ? data.groom.name.trim()
    : derivedGroomShort;

  // --- BRIDE NAME RECONCILIATION ---
  const brideFullName = (data.bride?.fullName || '').trim();
  const brideTitleName = (data.brideName || '').trim();

  let finalBrideFullName = brideFullName || brideTitleName || DEMO_WEDDING.brideName;
  if (brideFullName && brideFullName !== 'Cô Dâu') {
    finalBrideFullName = brideFullName;
  } else if (brideTitleName && brideTitleName !== 'Cô Dâu') {
    finalBrideFullName = brideTitleName;
  }

  const brideParts = finalBrideFullName.split(' ').filter(Boolean);
  const derivedBrideShort = brideParts[brideParts.length - 1] || finalBrideFullName;
  const finalBrideShortName = (data.bride?.name && data.bride.name.trim() && data.bride.name.trim() !== 'Cô Dâu')
    ? data.bride.name.trim()
    : derivedBrideShort;

  const normalizedGroom: CouplePerson = {
    role: 'groom',
    fullName: finalGroomFullName,
    name: finalGroomShortName,
    avatar: data.groom?.avatar || DEMO_WEDDING.groom.avatar,
    bio: data.groom?.bio || DEMO_WEDDING.groom.bio,
    parents: data.groom?.parents || DEMO_WEDDING.groom.parents,
    socials: data.groom?.socials || DEMO_WEDDING.groom.socials,
  };

  const normalizedBride: CouplePerson = {
    role: 'bride',
    fullName: finalBrideFullName,
    name: finalBrideShortName,
    avatar: data.bride?.avatar || DEMO_WEDDING.bride.avatar,
    bio: data.bride?.bio || DEMO_WEDDING.bride.bio,
    parents: data.bride?.parents || DEMO_WEDDING.bride.parents,
    socials: data.bride?.socials || DEMO_WEDDING.bride.socials,
  };

  return {
    ...data,
    id: data.id || `wedding-${cleanSlug}`,
    slug: cleanSlug,
    groomName: finalGroomFullName,
    brideName: finalBrideFullName,
    groom: normalizedGroom,
    bride: normalizedBride,
    stories: Array.isArray(data.stories) ? data.stories : [],
    liveAlbum: data.liveAlbum || {
      enabled: true,
      title: 'Khoảnh Khắc Ngày Cưới',
      description: 'Những hình ảnh chân thực, xúc động nhất được chụp và cập nhật trực tiếp trong ngày hôn lễ đại hỷ.',
      extraPhotosPurchased: 0,
      photos: Array.isArray(DEMO_WEDDING.liveAlbum?.photos) ? DEMO_WEDDING.liveAlbum.photos : [],
      allowGuestUpload: true,
    },
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export async function getWeddingBySlug(slug: string): Promise<WeddingData> {
  const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'minh-anh';
  const strippedSlug = cleanSlug.replace(/^wedding-/, '');

  // 1. Check LocalStorage (Fastest and always retains the user's latest local edits)
  let localData: WeddingData | null = null;
  if (typeof window !== 'undefined') {
    let saved =
      localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${cleanSlug}`) ||
      localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${strippedSlug}`) ||
      localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}wedding-${strippedSlug}`);
    if (saved) {
      try {
        localData = normalizeWeddingData(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse local wedding data', e);
      }
    }
  }

  // 2. Check platform registry in siteConfigService
  let registryData: WeddingData | null = null;
  try {
    const list = getAllWeddings();
    const match = list.find((w) => {
      const wSlug = (w.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const wId = (w.id || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const wOrder = (w.orderCode || '').trim().toLowerCase();
      const wSlugStrip = wSlug.replace(/^wedding-/, '');
      const wIdStrip = wId.replace(/^wedding-/, '');
      return (
        wSlug === cleanSlug ||
        wId === cleanSlug ||
        wSlugStrip === strippedSlug ||
        wIdStrip === strippedSlug ||
        wOrder === cleanSlug ||
        wOrder === strippedSlug ||
        w.id === `wedding-${cleanSlug}` ||
        w.slug === `wedding-${cleanSlug}`
      );
    });
    if (match) {
      registryData = normalizeWeddingData(match);
    }
  } catch (e) {
    // ignore
  }

  // 3. Query Firestore if active
  let firestoreData: WeddingData | null = null;
  let firestoreLockExplicit: boolean | null = null;
  if (isFirebaseConfigured && db) {
    try {
      // Check dedicated locks collection first for instant cross-device lock status
      const lockTargets = Array.from(new Set([
        cleanSlug,
        strippedSlug,
        `wedding-${strippedSlug}`,
        registryData?.orderCode,
        localData?.orderCode,
        registryData?.id,
        localData?.id,
      ].filter(Boolean) as string[]));

      for (const lt of lockTargets) {
        try {
          const lockSnap = await getDoc(doc(db, 'locks', lt));
          if (lockSnap.exists()) {
            if (lockSnap.data()?.locked === true) {
              firestoreLockExplicit = true;
              break;
            } else if (lockSnap.data()?.locked === false) {
              firestoreLockExplicit = false;
            }
          }
        } catch {}
      }

      let docRef = doc(db, 'weddings', cleanSlug);
      let snap = await getDoc(docRef);
      if (!snap.exists() && strippedSlug !== cleanSlug) {
        docRef = doc(db, 'weddings', strippedSlug);
        snap = await getDoc(docRef);
      }
      if (snap.exists()) {
        firestoreData = normalizeWeddingData(snap.data() as WeddingData);
      } else {
        // Query weddings collection by slug, id, or orderCode
        const allSnap = await getDocs(query(collection(db, 'weddings')));
        let anyDocLocked = false;
        allSnap.forEach((docSnap) => {
          const d = normalizeWeddingData(docSnap.data() as WeddingData);
          const dSlug = (d.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
          const dId = (d.id || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
          const dOrder = (d.orderCode || '').trim().toLowerCase();
          const dNameSlug = (d.groomName && d.brideName)
            ? slugifyVietnamese(`${d.groomName}-${d.brideName}`).toLowerCase()
            : '';

          const isMatch =
            dSlug === cleanSlug ||
            dSlug.replace(/^wedding-/, '') === strippedSlug ||
            dId === cleanSlug ||
            dId.replace(/^wedding-/, '') === strippedSlug ||
            dOrder === cleanSlug ||
            dOrder === strippedSlug ||
            (dNameSlug && (dNameSlug === cleanSlug || dNameSlug === strippedSlug));

          if (isMatch) {
            firestoreData = d;
            if (d.status === 'LOCKED') anyDocLocked = true;
          }
        });
        if (anyDocLocked) {
          firestoreLockExplicit = true;
        }
      }
    } catch (error) {
      console.warn('Firestore getWeddingBySlug offline/unavailable:', error);
    }
  }

  // Authoritative Lock Determination: Firestore & Registry Lock Priority
  const candidate = firestoreData || localData || registryData;
  const orderCode = (candidate?.orderCode || registryData?.orderCode || localData?.orderCode || '').trim();
  const nameSlug = (candidate?.groomName && candidate?.brideName)
    ? slugifyVietnamese(`${candidate.groomName}-${candidate.brideName}`).toLowerCase()
    : '';

  const isLocallyLocked =
    isSlugLockedAuthoritative(cleanSlug) ||
    isSlugLockedAuthoritative(strippedSlug) ||
    (orderCode && isSlugLockedAuthoritative(orderCode)) ||
    (nameSlug && isSlugLockedAuthoritative(nameSlug)) ||
    registryData?.status === 'LOCKED' ||
    localData?.status === 'LOCKED' ||
    firestoreData?.status === 'LOCKED';

  let isAuthoritativelyLocked = false;

  if (firestoreLockExplicit === true || firestoreData?.status === 'LOCKED') {
    isAuthoritativelyLocked = true;
  } else if (firestoreLockExplicit === false || firestoreData?.status === 'ACTIVE') {
    // Firestore explicitly indicates the card is unlocked / active -> clear local stale locks
    isAuthoritativelyLocked = false;
    unlockSlugAuthoritative(cleanSlug);
    if (strippedSlug !== cleanSlug) unlockSlugAuthoritative(strippedSlug);
    if (orderCode) unlockSlugAuthoritative(orderCode);
    if (nameSlug) unlockSlugAuthoritative(nameSlug);
  } else {
    isAuthoritativelyLocked = isLocallyLocked;
  }

  // 4. Resolve the freshest data version
  let bestData: WeddingData | null = null;

  if (localData && firestoreData) {
    const localTime = localData.updatedAt ? new Date(localData.updatedAt).getTime() : 0;
    const firestoreTime = firestoreData.updatedAt ? new Date(firestoreData.updatedAt).getTime() : 0;

    if (localTime >= firestoreTime && !isAuthoritativelyLocked) {
      bestData = { ...localData, status: 'ACTIVE' };
    } else {
      bestData = firestoreData;
    }
  } else if (firestoreData) {
    bestData = firestoreData;
  } else if (localData) {
    bestData = localData;
  } else if (registryData) {
    bestData = registryData;
  }

  // Final status sync and local cache persistence
  if (bestData) {
    bestData.status = isAuthoritativelyLocked ? 'LOCKED' : (bestData.status || 'ACTIVE');
    if (registryData) {
      bestData.isPublished = registryData.isPublished !== undefined ? registryData.isPublished : bestData.isPublished;
      if (registryData.expiresAt) {
        bestData.expiresAt = registryData.expiresAt;
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${cleanSlug}`, JSON.stringify(bestData));
      if (strippedSlug !== cleanSlug) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${strippedSlug}`, JSON.stringify(bestData));
      }
    }
    return bestData;
  }

  // 5. Fallback to demo wedding
  if (registryData) {
    registryData.status = isAuthoritativelyLocked ? 'LOCKED' : (registryData.status || 'ACTIVE');
    return registryData;
  }

  const baseDemo = normalizeWeddingData(DEMO_WEDDING);
  if (isAuthoritativelyLocked) {
    baseDemo.status = 'LOCKED';
  }

  if (cleanSlug === 'minh-anh' || cleanSlug === '' || cleanSlug === 'demo') {
    return baseDemo;
  }

  // Default customizable copy
  return normalizeWeddingData({
    ...DEMO_WEDDING,
    id: `wedding-${cleanSlug}`,
    slug: cleanSlug,
    status: isAuthoritativelyLocked ? 'LOCKED' : DEMO_WEDDING.status,
  });
}

export async function saveWedding(data: WeddingData): Promise<boolean> {
  const freshTimestamp = new Date().toISOString();
  
  // Guard: Protect admin LOCKED status from being overridden by couple saves
  const all = getAllWeddings();
  const cleanSlug = (data.slug || 'minh-anh').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'minh-anh';
  const stripped = cleanSlug.replace(/^wedding-/, '');
  const existing = all.find((w) => {
    const wSlug = (w.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    const wId = (w.id || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    const wOrder = (w.orderCode || '').trim().toLowerCase();
    return (
      wSlug === cleanSlug ||
      wSlug.replace(/^wedding-/, '') === stripped ||
      wId === cleanSlug ||
      wId.replace(/^wedding-/, '') === stripped ||
      (data.orderCode && wOrder === data.orderCode.toLowerCase().trim())
    );
  });

  const isAuthoritativelyLocked =
    data.status === 'LOCKED' ||
    isSlugLockedAuthoritative(cleanSlug) ||
    isSlugLockedAuthoritative(stripped) ||
    (data.id && isSlugLockedAuthoritative(data.id)) ||
    (data.orderCode && isSlugLockedAuthoritative(data.orderCode));

  const finalStatus = isAuthoritativelyLocked ? 'LOCKED' : (data.status || 'ACTIVE');

  const normalized = normalizeWeddingData({
    ...data,
    status: finalStatus,
    isPublished: existing?.isPublished !== undefined ? existing.isPublished : (data.isPublished !== undefined ? data.isPublished : true),
    stories: Array.isArray(data.stories) ? data.stories : [],
    updatedAt: freshTimestamp,
  });
  normalized.updatedAt = freshTimestamp;
  normalized.status = finalStatus;

  // 1. Always persist to localStorage synchronously for instant multi-tab sync
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${cleanSlug}`, JSON.stringify(normalized));
      localStorage.setItem('lamour_last_active_slug', cleanSlug);
      if (normalized.id && normalized.id !== cleanSlug) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${normalized.id}`, JSON.stringify(normalized));
      }
    } catch (err) {
      console.warn('localStorage save warning:', err);
    }
  }

  // 2. Sync to Platform Weddings Registry
  try {
    updateWeddingInRegistry(normalized);
  } catch (err) {
    console.warn('Could not sync to wedding registry:', err);
  }

  // 3. Dispatch global events & BroadcastChannel for real-time sync across windows/tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lamour_wedding_data_saved', { detail: normalized }));
    try {
      const bc = new BroadcastChannel('lamour_wedding_sync');
      bc.postMessage({ type: 'WEDDING_UPDATED', data: normalized });
      setTimeout(() => {
        try {
          bc.close();
        } catch {}
      }, 1000);
    } catch {
      // BroadcastChannel ignore
    }
  }

  // 4. Persist to Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const sanitized = JSON.parse(JSON.stringify(normalized));
      await setDoc(doc(db, 'weddings', cleanSlug), sanitized, { merge: true });
    } catch (error) {
      console.warn('Firestore saveWedding offline/unavailable, saved locally:', error);
    }
  }

  return true;
}

export function resetToDemoWedding(slug = 'minh-anh'): WeddingData {
  const resetData = normalizeWeddingData({ ...DEMO_WEDDING, slug });
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(resetData));
  }
  return resetData;
}

export async function deleteWedding(idOrSlug: string, orderCode?: string): Promise<boolean> {
  await deleteWeddingFromPlatform(idOrSlug, orderCode);
  return true;
}

export const saveWeddingData = saveWedding;
