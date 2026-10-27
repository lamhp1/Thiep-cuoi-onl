import { WeddingData, LiveAlbumPhoto, LiveAlbumConfig, TemplateId } from '../types';
import { PackageUpgradeRequest } from '../types/commercial';
import { getCommercialPackagesSync } from './packageService';
import { getAllWeddings, saveAllWeddings, updateWeddingInRegistry } from './siteConfigService';
import { saveWeddingData } from './weddingService';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getUpgradeRequests } from './upgradeService';
import { getPackageBaseQuota, getUnifiedAlbumQuota, AlbumQuotaInfo } from './albumQuotaService';

export interface AlbumAddonPack {
  id: string;
  name: string;
  extraSlots: number;
  price: number;
  originalPrice?: number;
  badge?: string;
  popular?: boolean;
  description: string;
}

export const ALBUM_ADDON_PACKS: AlbumAddonPack[] = [
  {
    id: 'addon-live-25',
    name: 'Gói Thêm 25 Ảnh Album (Kỷ Niệm & Ngày Cưới)',
    extraSlots: 25,
    price: 99000,
    originalPrice: 150000,
    badge: 'Tiết kiệm',
    popular: false,
    description: 'Thêm 25 vị trí ảnh sắc nét dùng chung cho cả Ảnh Kỷ Niệm & Album Ngày Cưới.',
  },
  {
    id: 'addon-live-60',
    name: 'Gói Thêm 60 Ảnh Album (Kỷ Niệm & Ngày Cưới)',
    extraSlots: 60,
    price: 199000,
    originalPrice: 320000,
    badge: 'Khuyên Dùng 85% Cặp Đôi',
    popular: true,
    description: 'Thoải mái đăng tải từ ảnh cưới đến Lễ Gia Tiên, Đón Dâu, Khai Tiệc và Chúc Rượu.',
  },
  {
    id: 'addon-live-150',
    name: 'Gói VIP Thêm 150 Ảnh (Không Giới Hạn)',
    extraSlots: 150,
    price: 299000,
    originalPrice: 500000,
    badge: 'Đặc Quyền VIP',
    popular: false,
    description: 'Lưu giữ không giới hạn trọn vẹn toàn bộ hàng trăm bức ảnh tiệc cưới & After-Party.',
  },
];

export const DEMO_LIVE_ALBUM_PHOTOS: LiveAlbumPhoto[] = [
  {
    id: 'live-p1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    caption: 'Đoàn rước dâu nhà trai xuất phát với tráp quả trầu cau rạng rỡ',
    takenAt: '08:30',
    phase: 'preparation',
    likesCount: 52,
    uploadedAt: '2026-12-20T08:35:00Z',
  },
  {
    id: 'live-p2',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
    caption: 'Chú rể trao hoa cưới cầm tay cho cô dâu trong nụ cười hạnh phúc vỡ òa',
    takenAt: '09:15',
    phase: 'ceremony',
    likesCount: 88,
    uploadedAt: '2026-12-20T09:20:00Z',
  },
  {
    id: 'live-p3',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=85',
    caption: 'Nghi thức dâng trà gia tiên & nhận lời chúc phúc thiêng liêng từ cha mẹ hai bên',
    takenAt: '09:45',
    phase: 'ceremony',
    likesCount: 74,
    uploadedAt: '2026-12-20T09:50:00Z',
  },
  {
    id: 'live-p4',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=85',
    caption: 'Khoảnh khắc trao nhẫn cưới - Chiếc nhẫn minh chứng trọn đời gắn bó',
    takenAt: '10:30',
    phase: 'ceremony',
    likesCount: 120,
    uploadedAt: '2026-12-20T10:35:00Z',
  },
  {
    id: 'live-p5',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    caption: 'Dàn phù dâu phù rể siêu đáng yêu tạo dáng rạng rỡ trước cổng hoa',
    takenAt: '11:15',
    phase: 'moments',
    likesCount: 46,
    uploadedAt: '2026-12-20T11:20:00Z',
  },
  {
    id: 'live-p6',
    url: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1600&q=85',
    caption: 'Đón tiếp bạn bè và quan khách tại sảnh yến tiệc lung linh ánh nến',
    takenAt: '18:00',
    phase: 'reception',
    likesCount: 65,
    uploadedAt: '2026-12-20T18:10:00Z',
  },
  {
    id: 'live-p7',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=85',
    caption: 'Tân lang & tân nương bước vào lễ đường trong tiếng vỗ tay rộn rã & pháo hoa',
    takenAt: '18:45',
    phase: 'reception',
    likesCount: 135,
    uploadedAt: '2026-12-20T18:50:00Z',
  },
  {
    id: 'live-p8',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1600&q=85',
    caption: 'Rót tháp rượu champagne & cắt bánh cưới khai tiệc ngày đại hỷ',
    takenAt: '19:15',
    phase: 'reception',
    likesCount: 92,
    uploadedAt: '2026-12-20T19:20:00Z',
  },
  {
    id: 'live-p9',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600&q=85',
    caption: 'Cùng nâng ly chúc mừng bên gia đình, thầy cô và đồng nghiệp',
    takenAt: '19:50',
    phase: 'reception',
    likesCount: 78,
    uploadedAt: '2026-12-20T20:00:00Z',
  },
  {
    id: 'live-p10',
    url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=85',
    caption: 'First Dance lãng mạn - Điệu khiêu vũ đầu tiên trong tiếng reo hò của bạn bè',
    takenAt: '20:30',
    phase: 'moments',
    likesCount: 140,
    uploadedAt: '2026-12-20T20:35:00Z',
  },
  {
    id: 'live-p11',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=85',
    caption: 'After-Party bùng nổ: Quẩy hết mình cùng hội bạn thân đến nửa đêm!',
    takenAt: '21:15',
    phase: 'afterparty',
    likesCount: 168,
    uploadedAt: '2026-12-20T21:20:00Z',
  },
  {
    id: 'live-p12',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=85',
    caption: 'Lời cảm ơn chân thành từ sâu trái tim đến toàn thể quý khách quý',
    takenAt: '22:00',
    phase: 'afterparty',
    likesCount: 185,
    uploadedAt: '2026-12-20T22:05:00Z',
  },
];

export type LiveAlbumQuotaInfo = AlbumQuotaInfo;

/**
 * Calculates current photo limit based on package tier + extra purchased slots.
 * Dùng chung bộ đếm giữa Ảnh Kỷ Niệm (Gallery) và Album Ngày Cưới (Live Album).
 */
export function getLiveAlbumQuota(wedding: WeddingData): LiveAlbumQuotaInfo {
  return getUnifiedAlbumQuota(wedding);
}

/**
 * Normalizes live album configuration
 */
export function ensureLiveAlbumConfig(wedding: WeddingData): LiveAlbumConfig {
  if (wedding.liveAlbum && Array.isArray(wedding.liveAlbum.photos)) {
    return wedding.liveAlbum;
  }

  // Provide initial demo photos if empty or demo wedding
  const isDemo = wedding.slug === 'minh-anh' || wedding.id.includes('demo');
  return {
    enabled: true,
    title: 'Khoảnh Khắc Ngày Cưới',
    description: 'Những hình ảnh chân thực, xúc động nhất được chụp và cập nhật trực tiếp trong ngày đại hỷ.',
    extraPhotosPurchased: 0,
    photos: isDemo ? DEMO_LIVE_ALBUM_PHOTOS : [],
    allowGuestUpload: true,
  };
}

/**
 * Submits a request to Admin to purchase extra album slots.
 * Slots will ONLY be granted once Admin reviews and approves the request.
 */
export async function submitAlbumSlotRequest(params: {
  wedding: WeddingData;
  pack: AlbumAddonPack;
  customerNote?: string;
}): Promise<PackageUpgradeRequest> {
  const { wedding, pack, customerNote } = params;
  const now = new Date().toISOString();
  const orderCode = wedding.orderCode || wedding.slug || 'LAMOUR';
  const requestId = `ALBUM-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const transferMemo = `ALBUM ${orderCode} ${pack.extraSlots}`.toUpperCase();
  const customerName =
    wedding.brideName && wedding.groomName
      ? `${wedding.groomName} & ${wedding.brideName}`
      : 'Khách Hàng Cặp Đôi';

  const request: PackageUpgradeRequest = {
    id: requestId,
    type: 'ALBUM_SLOTS',
    extraSlots: pack.extraSlots,
    orderCode: orderCode,
    weddingId: wedding.id,
    weddingSlug: wedding.slug,
    customerName: customerName,
    customerPhone: wedding.customerPhone || '',
    customerEmail: wedding.customerEmail || '',
    currentPackage: wedding.packageId || 'basic',
    currentPackageName: wedding.packageName || 'Gói Hiện Tại',
    targetPackage: pack.id,
    targetPackageName: pack.name,
    currentPaidAmount: 0,
    targetPrice: pack.price,
    upgradeAmount: pack.price,
    transferMemo: transferMemo,
    note: customerNote || `Mua thêm +${pack.extraSlots} ảnh vào Album Ngày Cưới`,
    status: 'PENDING',
    createdAt: now,
  };

  // 1. Save locally in upgrade requests list
  try {
    const raw = localStorage.getItem('lamour_package_upgrade_requests');
    const list: PackageUpgradeRequest[] = raw ? JSON.parse(raw) : [];
    // remove existing pending album request for this order if any
    const filtered = list.filter(
      (r) => !(r.orderCode === orderCode && r.type === 'ALBUM_SLOTS' && r.status === 'PENDING')
    );
    filtered.unshift(request);
    localStorage.setItem('lamour_package_upgrade_requests', JSON.stringify(filtered));
  } catch {}

  // 2. Save to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'upgrade_requests', request.id), request);
    } catch (e) {
      console.warn('Error saving album slot request to firestore:', e);
    }
  }

  // 3. Dispatch event for real-time UI reaction
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lamour_upgrade_requested', { detail: request }));
  }

  return request;
}

/**
 * Gets active pending album slot request for a wedding
 */
export async function getPendingAlbumSlotRequest(
  orderCodeOrSlug: string
): Promise<PackageUpgradeRequest | null> {
  const clean = (orderCodeOrSlug || '').trim().toLowerCase();
  if (!clean) return null;
  const all = await getUpgradeRequests();
  return (
    all.find(
      (r) =>
        r.type === 'ALBUM_SLOTS' &&
        r.status === 'PENDING' &&
        (r.orderCode.toLowerCase() === clean ||
          r.weddingSlug?.toLowerCase() === clean ||
          (r.weddingId && r.weddingId.toLowerCase() === clean))
    ) || null
  );
}

/**
 * Administrative direct grant of extra album slots
 */
export async function purchaseExtraAlbumSlots(
  wedding: WeddingData,
  extraSlots: number,
  paidAmount: number,
  packName: string
): Promise<WeddingData> {
  const currentLive = ensureLiveAlbumConfig(wedding);
  const currentExtra = Math.max(
    wedding.extraPhotosPurchased || 0,
    currentLive.extraPhotosPurchased || 0
  );
  const updatedExtra = currentExtra + extraSlots;

  const updatedWedding: WeddingData = {
    ...wedding,
    extraPhotosPurchased: updatedExtra,
    liveAlbum: {
      ...currentLive,
      extraPhotosPurchased: updatedExtra,
    },
    updatedAt: new Date().toISOString(),
  };

  // 1. Update in local storage
  if (typeof window !== 'undefined') {
    const cleanSlug = wedding.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    localStorage.setItem(`lamour_wedding_data_${cleanSlug}`, JSON.stringify(updatedWedding));
  }

  // 2. Update in Registry
  updateWeddingInRegistry(updatedWedding);

  // 3. Save to Firestore
  try {
    await saveWeddingData(updatedWedding);
  } catch (err) {
    console.error('Failed to save wedding data to firestore after slot purchase:', err);
  }

  // Broadcast
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('lamour_wedding_data_saved', { detail: updatedWedding })
    );
  }

  return updatedWedding;
}
