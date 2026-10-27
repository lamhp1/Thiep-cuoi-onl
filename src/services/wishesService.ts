import { WishMessage } from '../types';
import { INITIAL_WISHES } from '../data/demoWedding';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';

const LOCAL_STORAGE_KEY_PREFIX = 'lamour_wishes_';
const GLOBAL_DELETED_KEY = 'lamour_wishes_deleted_all';

export function isDemoWeddingId(weddingId: string): boolean {
  if (!weddingId) return true;
  const clean = weddingId.trim().toLowerCase().replace(/^wedding-/, '');
  return (
    clean === 'minh-anh' ||
    clean === 'demo' ||
    clean === 'demo-wedding' ||
    clean === 'demo-minh-anh-ngoc-mai'
  );
}

function getWeddingIdVariants(weddingId: string): string[] {
  if (!weddingId) return ['demo-wedding', 'minh-anh', 'demo-minh-anh-ngoc-mai'];
  const clean = weddingId.trim();
  const lower = clean.toLowerCase();
  const stripped = lower.replace(/^wedding-/, '');
  const prefixed = `wedding-${stripped}`;
  const variants = new Set<string>([clean, lower, stripped, prefixed]);
  if (
    stripped === 'minh-anh' ||
    stripped === 'demo-wedding' ||
    stripped === 'demo-minh-anh-ngoc-mai' ||
    stripped === 'demo'
  ) {
    variants.add('demo-minh-anh-ngoc-mai');
    variants.add('demo-wedding');
    variants.add('minh-anh');
    variants.add('wedding-minh-anh');
  }
  return Array.from(variants);
}

function notifyWishesChanged(weddingId: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lamour_wishes_updated', { detail: { weddingId } }));
  }
}

function getDeletedWishIds(weddingId: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  const deleted = new Set<string>();

  // Check global deleted list
  try {
    const rawGlobal = localStorage.getItem(GLOBAL_DELETED_KEY);
    if (rawGlobal) {
      const parsed = JSON.parse(rawGlobal);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => {
          if (typeof id === 'string') deleted.add(id);
        });
      }
    }
  } catch {}

  const variants = getWeddingIdVariants(weddingId);
  for (const v of variants) {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}deleted_${v}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => {
            if (typeof id === 'string') deleted.add(id);
          });
        }
      } catch {}
    }
  }
  return deleted;
}

function markWishAsDeleted(weddingId: string, wishId: string) {
  if (typeof window === 'undefined') return;

  // Add to global deleted set
  try {
    const rawGlobal = localStorage.getItem(GLOBAL_DELETED_KEY);
    const globalSet = new Set<string>(rawGlobal ? JSON.parse(rawGlobal) : []);
    globalSet.add(wishId);
    localStorage.setItem(GLOBAL_DELETED_KEY, JSON.stringify(Array.from(globalSet)));
  } catch (e) {
    console.warn('Failed to mark wish as globally deleted:', wishId, e);
  }

  const variants = getWeddingIdVariants(weddingId);
  for (const v of variants) {
    try {
      const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}deleted_${v}`);
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      set.add(wishId);
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}deleted_${v}`, JSON.stringify(Array.from(set)));
    } catch (e) {
      console.warn('Failed to mark wish as deleted:', wishId, v, e);
    }
  }
}

function removeWishFromAllLocalStorage(weddingId: string, wishId: string) {
  if (typeof window === 'undefined') return;
  const variants = getWeddingIdVariants(weddingId);
  variants.forEach((v) => {
    try {
      const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${v}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((w: WishMessage) => w.id !== wishId);
          localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${v}`, JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.warn('Failed to remove wish from key:', v, e);
    }
  });
}

function updateWishApprovalInAllLocalStorage(weddingId: string, wishId: string, isApproved: boolean): WishMessage | undefined {
  if (typeof window === 'undefined') return undefined;
  const variants = getWeddingIdVariants(weddingId);
  let updatedWish: WishMessage | undefined;
  variants.forEach((v) => {
    try {
      const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${v}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const updated = parsed.map((w: WishMessage) => {
            if (w.id === wishId) {
              updatedWish = { ...w, isApproved };
              return updatedWish;
            }
            return w;
          });
          localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${v}`, JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.warn('Failed to update wish approval in key:', v, e);
    }
  });
  return updatedWish;
}

function saveWishesToLocalStorage(weddingId: string, wishes: WishMessage[]) {
  if (typeof window === 'undefined') return;
  const variants = getWeddingIdVariants(weddingId);
  const data = JSON.stringify(wishes);
  variants.forEach((v) => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${v}`, data);
    } catch (e) {
      console.warn('Failed to save wishes to localStorage key:', v, e);
    }
  });
}

export async function getWishes(weddingId: string, includeHidden = false): Promise<WishMessage[]> {
  const variants = getWeddingIdVariants(weddingId);
  let resultList: WishMessage[] = [];
  let foundInFirestore = false;

  if (isFirebaseConfigured && db) {
    const path = 'wishes';
    try {
      const q = query(collection(db, path), where('weddingId', 'in', variants.slice(0, 10)));
      const snap = await getDocs(q);
      const list: WishMessage[] = [];
      snap.forEach((d) => list.push(d.data() as WishMessage));
      if (list.length > 0) {
        resultList = list;
        foundInFirestore = true;
      }
    } catch (error) {
      console.warn('Firestore getWishes offline/unavailable, fallback to local storage:', error);
    }
  }

  // Check localStorage for all variants
  let hasExplicitLocalSaved = false;
  if (typeof window !== 'undefined') {
    for (const v of variants) {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${v}`);
      if (saved !== null) {
        hasExplicitLocalSaved = true;
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            if (!foundInFirestore) {
              resultList = parsed;
              break;
            } else {
              // Merge local overrides (such as isApproved toggles) into Firestore data
              const localMap = new Map<string, WishMessage>(parsed.map((item: WishMessage) => [item.id, item]));
              resultList = resultList.map((item) => {
                const localItem = localMap.get(item.id);
                if (localItem && localItem.isApproved !== undefined) {
                  return { ...item, isApproved: localItem.isApproved };
                }
                return item;
              });
              const firestoreIds = new Set(resultList.map((w) => w.id));
              parsed.forEach((p: WishMessage) => {
                if (!firestoreIds.has(p.id)) {
                  resultList.push(p);
                }
              });
              break;
            }
          }
        } catch (e) {
          console.warn('Failed to parse local wishes', e);
        }
      }
    }
  }

  const deletedIds = getDeletedWishIds(weddingId);

  // Fallback initial demo wishes ONLY for demo weddings if nothing found, nothing saved locally, not found in firestore, and not all deleted
  if (
    isDemoWeddingId(weddingId) &&
    resultList.length === 0 &&
    !hasExplicitLocalSaved &&
    !foundInFirestore &&
    deletedIds.size === 0
  ) {
    resultList = Array.isArray(INITIAL_WISHES) ? [...INITIAL_WISHES] : [];
  }

  // Filter out any wishes that were explicitly deleted
  if (deletedIds.size > 0) {
    resultList = resultList.filter((w) => !deletedIds.has(w.id));
  }

  // Sort by createdAt descending
  resultList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // If includeHidden is false (default for all public wedding cards), filter out unapproved wishes
  if (!includeHidden) {
    return resultList.filter((w) => w.isApproved !== false);
  }

  return resultList;
}

export async function submitWish(wish: Omit<WishMessage, 'id' | 'createdAt' | 'likesCount' | 'isApproved'>): Promise<WishMessage> {
  const newWish: WishMessage = {
    ...wish,
    id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    likesCount: 1,
    isApproved: true,
  };

  // Local storage save across all variant keys
  if (typeof window !== 'undefined') {
    const current = await getWishes(wish.weddingId, true);
    const updated = [newWish, ...current.filter((w) => w.id !== newWish.id)];
    saveWishesToLocalStorage(wish.weddingId, updated);
  }

  // Firestore save
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'wishes', newWish.id), newWish);
    } catch (error) {
      console.warn('Firestore submitWish offline/unavailable, saved locally:', error);
    }
  }

  notifyWishesChanged(wish.weddingId);
  return newWish;
}

export const addWish = submitWish;

export async function toggleWishLike(weddingId: string, wishId: string): Promise<number> {
  let newLikes = 1;
  let targetWish: WishMessage | undefined;

  if (typeof window !== 'undefined') {
    const current = await getWishes(weddingId, true);
    const updated = current.map((w) => {
      if (w.id === wishId) {
        newLikes = (w.likesCount || 0) + 1;
        targetWish = { ...w, likesCount: newLikes };
        return targetWish;
      }
      return w;
    });
    saveWishesToLocalStorage(weddingId, updated);
  }

  if (isFirebaseConfigured && db) {
    try {
      try {
        await updateDoc(doc(db, 'wishes', wishId), { likesCount: newLikes });
      } catch {
        if (targetWish) {
          await setDoc(doc(db, 'wishes', wishId), targetWish);
        }
      }
    } catch (error) {
      console.warn('Firestore toggleWishLike offline/unavailable, updated locally:', error);
    }
  }

  notifyWishesChanged(weddingId);
  return newLikes;
}

export async function toggleWishApproval(weddingId: string, wishId: string, isApproved: boolean): Promise<boolean> {
  let targetWish: WishMessage | undefined;

  if (typeof window !== 'undefined') {
    // 1. Direct update across all variant keys in localStorage
    targetWish = updateWishApprovalInAllLocalStorage(weddingId, wishId, isApproved);

    // If not found in raw keys (e.g. was loaded from demo), fetch and save
    if (!targetWish) {
      const current = await getWishes(weddingId, true);
      const updated = current.map((w) => {
        if (w.id === wishId) {
          targetWish = { ...w, isApproved };
          return targetWish;
        }
        return w;
      });
      saveWishesToLocalStorage(weddingId, updated);
    }
  }

  if (isFirebaseConfigured && db) {
    try {
      try {
        await updateDoc(doc(db, 'wishes', wishId), { isApproved });
      } catch {
        if (targetWish) {
          await setDoc(doc(db, 'wishes', wishId), targetWish);
        }
      }
    } catch (error) {
      console.warn('Firestore toggleWishApproval offline/unavailable, updated locally:', error);
    }
  }

  notifyWishesChanged(weddingId);
  return true;
}

export async function deleteWish(weddingId: string, wishId: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    // 1. Mark as deleted globally and for all wedding variants
    markWishAsDeleted(weddingId, wishId);

    // 2. Directly purge from all localStorage keys
    removeWishFromAllLocalStorage(weddingId, wishId);

    // 3. Ensure any cached list is also sanitized
    const current = await getWishes(weddingId, true);
    const filtered = current.filter((w) => w.id !== wishId);
    saveWishesToLocalStorage(weddingId, filtered);
  }

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'wishes', wishId));
    } catch (error) {
      console.warn('Firestore deleteWish offline/unavailable, deleted locally:', error);
    }
  }

  notifyWishesChanged(weddingId);
  return true;
}

