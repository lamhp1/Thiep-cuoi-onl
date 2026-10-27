import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface LeaderboardEntry {
  id: string;
  weddingId: string;
  name: string;
  team: 'groom' | 'bride' | 'both';
  points: number;
  avatar?: string;
  badge?: string;
  ticketCode?: string;
  createdAt: string;
}

const STORAGE_KEY_PREFIX = 'lamour_love_leaderboard_';

const DEFAULT_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'lead-1',
    weddingId: 'demo-wedding',
    name: 'Bảo Trâm (Phù Dâu Trưởng)',
    team: 'bride',
    points: 60,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    badge: '👑 Đại Sứ Tình Yêu Kim Cương',
    ticketCode: 'VIP-LOVE-9999',
    createdAt: '10 phút trước',
  },
  {
    id: 'lead-2',
    weddingId: 'demo-wedding',
    name: 'Hải Đăng (Bạn thân Chú Rể)',
    team: 'groom',
    points: 60,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    badge: '🏆 Tri Kỷ Vàng Thân Thiết',
    ticketCode: 'VIP-LOVE-8888',
    createdAt: '25 phút trước',
  },
  {
    id: 'lead-3',
    weddingId: 'demo-wedding',
    name: 'Quỳnh Nga & Nhóm F4',
    team: 'both',
    points: 50,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    badge: '💖 Chiến Thần Thả Tim',
    ticketCode: 'VIP-LOVE-7777',
    createdAt: '1 giờ trước',
  },
  {
    id: 'lead-4',
    weddingId: 'demo-wedding',
    name: 'Tuấn Kiệt (Hội Bạn Cấp 3)',
    team: 'groom',
    points: 40,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    badge: '✨ Khách Quý Tận Tâm',
    ticketCode: 'VIP-LOVE-6666',
    createdAt: '2 giờ trước',
  },
  {
    id: 'lead-5',
    weddingId: 'demo-wedding',
    name: 'Minh Thư (Team Đồng Nghiệp)',
    team: 'bride',
    points: 40,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    badge: '✨ Khách Quý Tận Tâm',
    ticketCode: 'VIP-LOVE-5555',
    createdAt: '3 giờ trước',
  },
];

export async function getLeaderboard(weddingId: string): Promise<LeaderboardEntry[]> {
  const safeWeddingId = weddingId || 'demo-wedding';
  let firestoreEntries: LeaderboardEntry[] = [];

  try {
    if (db) {
      const colRef = collection(db, 'weddings', safeWeddingId, 'leaderboards');
      const q = query(colRef, orderBy('points', 'desc'), limit(30));
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        firestoreEntries.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
    }
  } catch (err) {
    console.warn('Could not fetch leaderboard from Firestore, trying local cache:', err);
  }

  // Load from local storage
  let localEntries: LeaderboardEntry[] = [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${safeWeddingId}`);
    if (raw) {
      localEntries = JSON.parse(raw);
    }
  } catch {
    // ignore
  }

  // Merge & Deduplicate
  const map = new Map<string, LeaderboardEntry>();

  // Add default demo entries first
  DEFAULT_LEADERBOARD_ENTRIES.forEach((e) => map.set(e.name, e));
  // Override with local entries
  localEntries.forEach((e) => map.set(e.name, e));
  // Override with Firestore entries
  firestoreEntries.forEach((e) => map.set(e.name, e));

  const merged = Array.from(map.values());
  merged.sort((a, b) => b.points - a.points);
  return merged;
}

export async function submitLeaderboardEntry(
  data: Omit<LeaderboardEntry, 'id' | 'createdAt'>
): Promise<LeaderboardEntry> {
  const safeWeddingId = data.weddingId || 'demo-wedding';
  const entryId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newEntry: LeaderboardEntry = {
    id: entryId,
    ...data,
    createdAt: 'Vừa xong',
  };

  // 1. Save to local storage
  try {
    const current = await getLeaderboard(safeWeddingId);
    // Replace if same name exists with lower points
    const existingIdx = current.findIndex((item) => item.name.toLowerCase() === data.name.toLowerCase());
    let nextList: LeaderboardEntry[];
    if (existingIdx >= 0) {
      current[existingIdx] = newEntry;
      nextList = current;
    } else {
      nextList = [newEntry, ...current];
    }
    nextList.sort((a, b) => b.points - a.points);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${safeWeddingId}`, JSON.stringify(nextList));
  } catch {
    // ignore
  }

  // 2. Save to Firestore
  try {
    if (db) {
      const docRef = doc(db, 'weddings', safeWeddingId, 'leaderboards', entryId);
      await setDoc(docRef, {
        weddingId: safeWeddingId,
        name: data.name,
        team: data.team,
        points: data.points,
        avatar: data.avatar || '',
        badge: data.badge || 'Đại Sứ Tình Yêu',
        ticketCode: data.ticketCode || '',
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Could not save leaderboard entry to Firestore:', err);
  }

  return newEntry;
}
