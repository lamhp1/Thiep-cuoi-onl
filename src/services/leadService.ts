import { Lead, LeadStatus } from '../types/commercial';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const LOCAL_STORAGE_LEADS_KEY = 'lamour_commercial_leads';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'LAMOUR-DEMO',
    name: 'Hoàng Long & Thu Hà',
    groomName: 'Hoàng Long',
    brideName: 'Thu Hà',
    phone: '0905123456',
    email: 'hoanglong.thuha@gmail.com',
    package: 'premium',
    template: 'classic-luxury',
    weddingDate: '2026-10-25',
    status: 'PAID',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'LAMOUR-829104',
    name: 'Hoàng Long & Thu Hà',
    groomName: 'Hoàng Long',
    brideName: 'Thu Hà',
    phone: '0905 567 890',
    email: 'hoanglong.thuha@gmail.com',
    package: 'premium',
    template: 'minimal-white',
    weddingDate: '2026-10-25',
    status: 'PAID',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'LAMOUR-492015',
    name: 'Đức Huy & Thanh Mai',
    groomName: 'Đức Huy',
    brideName: 'Thanh Mai',
    phone: '0912 345 678',
    email: 'duchuy.thanhmai@gmail.com',
    package: 'basic',
    template: 'floral-pink',
    weddingDate: '2026-11-18',
    status: 'PAID',
    createdAt: '2026-04-12T11:20:00Z',
  },
];

function getLocalLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
}

function saveLocalLeads(leads: Lead[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
  } catch (err) {
    console.warn('Could not save leads locally:', err);
  }
}

export async function submitLead(
  data: Omit<Lead, 'id' | 'createdAt' | 'status'>
): Promise<Lead> {
  // Generate user-friendly memorable order code (e.g. LAMOUR-782910)
  const randomCode = Math.floor(100000 + Math.random() * 900000);
  const orderId = `LAMOUR-${randomCode}`;

  const newLead: Lead = {
    ...data,
    id: orderId,
    name: data.name || `${data.groomName || 'Chú rể'} & ${data.brideName || 'Cô dâu'}`,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };

  // 1. Save to LocalStorage immediately
  const localList = getLocalLeads();
  localList.unshift(newLead);
  saveLocalLeads(localList);

  // 2. Persist to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'leads', newLead.id), newLead);
    } catch (err) {
      console.warn('Firestore submitLead offline/unavailable, saved locally:', err);
    }
  }

  return newLead;
}

export async function getLeadById(leadId: string): Promise<Lead | null> {
  const localList = getLocalLeads();
  const foundLocal = localList.find(
    (l) => l.id.toLowerCase() === leadId.trim().toLowerCase()
  );
  if (foundLocal) return foundLocal;

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(query(collection(db, 'leads')));
      let found: Lead | null = null;
      snap.forEach((docSnap) => {
        const d = docSnap.data() as Lead;
        if (d.id.toLowerCase() === leadId.trim().toLowerCase()) {
          found = d;
        }
      });
      return found;
    } catch (e) {
      console.warn('Firestore getLeadById failed:', e);
    }
  }
  return null;
}

export async function findLeadByPhoneOrCode(queryText: string): Promise<Lead | null> {
  const clean = queryText.trim().toLowerCase();
  const localList = getLocalLeads();
  const found = localList.find(
    (l) =>
      l.id.toLowerCase() === clean ||
      l.phone.includes(clean) ||
      (l.phone.replace(/\D/g, '') && l.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')))
  );
  if (found) return found;

  const all = await getLeads();
  return (
    all.find(
      (l) =>
        l.id.toLowerCase() === clean ||
        l.phone.includes(clean) ||
        (l.phone.replace(/\D/g, '') && l.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')))
    ) || null
  );
}

export async function getLeads(): Promise<Lead[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: Lead[] = [];
      snap.forEach((d) => list.push(d.data() as Lead));
      if (list.length > 0) {
        saveLocalLeads(list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore getLeads offline/unavailable, using local fallback:', err);
    }
  }
  return getLocalLeads();
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  const localList = getLocalLeads();
  const updated = localList.map((item) =>
    item.id === leadId ? { ...item, status, updatedAt: new Date().toISOString() } : item
  );
  saveLocalLeads(updated);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore updateLeadStatus offline/unavailable, updated locally:', err);
    }
  }
}

export async function updateLeadPackage(
  leadId: string,
  pkg: string,
  status: LeadStatus = 'PAID'
): Promise<void> {
  const localList = getLocalLeads();
  const updated = localList.map((item) =>
    item.id === leadId
      ? { ...item, package: pkg, status, updatedAt: new Date().toISOString() }
      : item
  );
  saveLocalLeads(updated);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        package: pkg,
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore updateLeadPackage offline/unavailable, updated locally:', err);
    }
  }
}

export async function updateLeadTemplate(
  leadId: string,
  template: string
): Promise<void> {
  const cleanId = (leadId || '').trim();
  if (!cleanId) return;

  const localList = getLocalLeads();
  let found = false;
  const updated = localList.map((item) => {
    if (item.id.toLowerCase() === cleanId.toLowerCase()) {
      found = true;
      return { ...item, template, updatedAt: new Date().toISOString() };
    }
    return item;
  });

  if (!found) {
    updated.unshift({
      id: cleanId,
      name: 'Khách Hàng',
      groomName: 'Chú Rể',
      brideName: 'Cô Dâu',
      phone: '',
      email: '',
      package: 'premium',
      template,
      weddingDate: '2026-10-25',
      status: 'PAID',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  saveLocalLeads(updated);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'leads', cleanId), {
        id: cleanId,
        template,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore updateLeadTemplate offline/unavailable, updated locally:', err);
    }
  }
}

export async function deleteLead(leadId: string): Promise<Lead[]> {
  const cleanId = (leadId || '').trim().toLowerCase();
  const localList = getLocalLeads();
  const updated = localList.filter((item) => item.id.trim().toLowerCase() !== cleanId);
  saveLocalLeads(updated);

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('lamour_lead_deleted', { detail: { leadId } }));
      const bc = new BroadcastChannel('lamour_wedding_sync');
      bc.postMessage({ type: 'LEAD_DELETED', leadId });
      setTimeout(() => {
        try {
          bc.close();
        } catch {}
      }, 1000);
    } catch {}
  }

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (err) {
      console.warn('Firestore deleteLead offline/unavailable, deleted locally:', err);
    }
  }

  return updated;
}

