import { CommercialPackage } from '../types/commercial';
import { DEFAULT_COMMERCIAL_PACKAGES } from '../data/commercialDefaults';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const LOCAL_STORAGE_PACKAGES_KEY = 'lamour_commercial_packages';

export function getCommercialPackagesSync(): CommercialPackage[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PACKAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_COMMERCIAL_PACKAGES;
}

export async function getCommercialPackages(): Promise<CommercialPackage[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'packages'));
      const list: CommercialPackage[] = [];
      snap.forEach((d) => list.push(d.data() as CommercialPackage));
      if (list.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_PACKAGES_KEY, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('Could not load packages from Firestore, using defaults:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PACKAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  return DEFAULT_COMMERCIAL_PACKAGES;
}

export async function getPackageById(idOrSlug: string): Promise<CommercialPackage | undefined> {
  const packages = await getCommercialPackages();
  return packages.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}
