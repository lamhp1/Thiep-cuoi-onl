import { RSVPGuest } from '../types';
import { INITIAL_RSVPS } from '../data/demoWedding';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';

const LOCAL_STORAGE_KEY_PREFIX = 'lamour_rsvps_';

export async function getRSVPs(weddingId: string): Promise<RSVPGuest[]> {
  if (isFirebaseConfigured && db) {
    const path = 'rsvps';
    try {
      const q = query(collection(db, path), where('weddingId', '==', weddingId));
      const snap = await getDocs(q);
      const list: RSVPGuest[] = [];
      snap.forEach((d) => list.push(d.data() as RSVPGuest));
      if (list.length > 0) return list;
    } catch (error) {
      console.warn('Firestore getRSVPs offline/unavailable, fallback to local storage:', error);
    }
  }

  // Check localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${weddingId}`);
    if (saved) {
      try {
        return JSON.parse(saved) as RSVPGuest[];
      } catch (e) {
        console.warn('Failed to parse local rsvps', e);
      }
    }
  }

  // Fallback initial demo data
  return INITIAL_RSVPS;
}

export async function submitRSVP(rsvp: Omit<RSVPGuest, 'id' | 'createdAt'>): Promise<RSVPGuest> {
  const newRsvp: RSVPGuest = {
    ...rsvp,
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  // 1. Save in local cache
  if (typeof window !== 'undefined') {
    const current = await getRSVPs(rsvp.weddingId);
    const updated = [newRsvp, ...current];
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${rsvp.weddingId}`, JSON.stringify(updated));
  }

  // 2. Save in Firestore if active
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'rsvps', newRsvp.id), newRsvp);
    } catch (error) {
      console.warn('Firestore submitRSVP offline/unavailable, saved locally:', error);
    }
  }

  return newRsvp;
}

export async function deleteRSVP(weddingId: string, rsvpId: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const current = await getRSVPs(weddingId);
    const filtered = current.filter((r) => r.id !== rsvpId);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${weddingId}`, JSON.stringify(filtered));
  }

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'rsvps', rsvpId));
    } catch (error) {
      console.warn('Firestore deleteRSVP offline/unavailable, deleted locally:', error);
    }
  }

  return true;
}

export function calculateRSVPStats(rsvps: RSVPGuest[]) {
  const totalResponses = rsvps.length;
  const attendingList = rsvps.filter((r) => r.attending);
  const attendingCount = attendingList.length;
  const decliningCount = rsvps.filter((r) => !r.attending).length;
  const totalGuests = attendingList.reduce((sum, r) => sum + (r.guestsCount || 1), 0);

  return {
    totalResponses,
    attendingCount,
    decliningCount,
    totalGuests,
  };
}
