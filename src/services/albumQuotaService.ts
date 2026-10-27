import { WeddingData } from '../types';
import { getCommercialPackagesSync } from './packageService';

export interface AlbumQuotaInfo {
  packageSlug: 'basic' | 'premium' | 'vip' | string;
  packageName: string;
  baseQuota: number;
  extraPurchased: number;
  totalLimit: number;
  galleryCount: number; // Số ảnh kỷ niệm (Gallery)
  liveAlbumCount: number; // Số ảnh album ngày cưới (Live Album)
  currentCount: number; // Tổng số ảnh đã sử dụng = galleryCount + liveAlbumCount (BỘ ĐẾM CHUNG)
  remainingSlots: number;
  isAtLimit: boolean;
  percentageUsed: number;
}

/**
 * Lấy hạn mức số lượng ảnh ban đầu theo từng gói dịch vụ:
 * - Gói Cơ Bản (Basic): 40 ảnh ban đầu
 * - Gói Cao Cấp (Premium): 60 ảnh ban đầu
 * - Gói Thiết Kế Riêng (VIP): 100 ảnh ban đầu
 * Có thể điều chỉnh linh hoạt từ cấu hình gói trong PackagesManager.
 */
export function getPackageBaseQuota(wedding: WeddingData): {
  slug: 'basic' | 'premium' | 'vip';
  name: string;
  baseQuota: number;
} {
  const pkgId = (wedding.packageId || '').toLowerCase();
  const pkgName = (wedding.packageName || '').toLowerCase();
  const tpl = (wedding.template || '').toLowerCase();

  // 1. Thử tìm trong cấu hình gói hiện tại (do Admin thiết lập)
  try {
    const packages = getCommercialPackagesSync();
    const matched = packages.find(
      (p) =>
        p.id.toLowerCase() === pkgId ||
        p.slug.toLowerCase() === pkgId ||
        p.name.toLowerCase() === pkgName
    );
    if (matched) {
      const slug = matched.slug.includes('vip')
        ? 'vip'
        : matched.slug.includes('premium')
        ? 'premium'
        : 'basic';
      const baseQuota =
        matched.albumPhotoLimit && matched.albumPhotoLimit > 0
          ? matched.albumPhotoLimit
          : slug === 'vip'
          ? 100
          : slug === 'premium'
          ? 60
          : 40;

      return {
        slug,
        name: matched.name,
        baseQuota,
      };
    }
  } catch {
    // ignore
  }

  // 2. Dự phòng theo mẫu thiệp hoặc tên gói
  if (
    pkgId.includes('vip') ||
    pkgName.includes('vip') ||
    pkgName.includes('thiết kế riêng') ||
    tpl.includes('cinematic') ||
    tpl.includes('vietnamese-modern-luxury') ||
    tpl.includes('haute-couture') ||
    tpl.includes('celestial') ||
    tpl.includes('luxury-editorial')
  ) {
    return {
      slug: 'vip',
      name: 'Gói Thiết Kế Riêng (VIP)',
      baseQuota: 100,
    };
  }

  if (
    pkgId.includes('premium') ||
    pkgName.includes('premium') ||
    pkgName.includes('cao cấp') ||
    tpl.includes('traditional') ||
    tpl.includes('passport') ||
    tpl.includes('love-map') ||
    tpl.includes('love-letter') ||
    tpl.includes('polaroid') ||
    tpl.includes('lantern') ||
    tpl.includes('moon') ||
    tpl.includes('fairytale') ||
    tpl.includes('love-game') ||
    tpl.includes('chateau')
  ) {
    return {
      slug: 'premium',
      name: 'Gói Cao Cấp (Premium)',
      baseQuota: 60,
    };
  }

  return {
    slug: 'basic',
    name: 'Gói Cơ Bản (Basic)',
    baseQuota: 40,
  };
}

/**
 * BỘ ĐẾM ẢNH DÙNG CHUNG:
 * Ảnh kỷ niệm (Gallery) và Album ảnh ngày cưới (Live Album) dùng chung một bộ đếm ảnh.
 * Ví dụ: khách up 15 ảnh kỷ niệm và 15 ảnh album ngày cưới thì bộ đếm chung sẽ là 30 ảnh.
 * Hạn mức ban đầu: Gói basic 40 ảnh, gói premium 60 ảnh, gói VIP 100 ảnh.
 * Có thể mua thêm số lượng ảnh tải lên qua add-on packs.
 */
export function getUnifiedAlbumQuota(wedding: WeddingData): AlbumQuotaInfo {
  const { slug, name, baseQuota } = getPackageBaseQuota(wedding);

  // Số ảnh mua thêm (đồng bộ giữa extraPhotosPurchased và liveAlbum.extraPhotosPurchased)
  const extraPurchased = Math.max(
    wedding.extraPhotosPurchased || 0,
    wedding.liveAlbum?.extraPhotosPurchased || 0
  );

  const totalLimit = baseQuota + extraPurchased;
  const galleryCount = Array.isArray(wedding.gallery) ? wedding.gallery.length : 0;
  const liveAlbumCount = Array.isArray(wedding.liveAlbum?.photos) ? wedding.liveAlbum.photos.length : 0;
  
  // Bộ đếm chung
  const currentCount = galleryCount + liveAlbumCount;
  const remainingSlots = Math.max(0, totalLimit - currentCount);
  const isAtLimit = currentCount >= totalLimit;
  const percentageUsed = totalLimit > 0 ? Math.min(100, Math.round((currentCount / totalLimit) * 100)) : 100;

  return {
    packageSlug: slug,
    packageName: name,
    baseQuota,
    extraPurchased,
    totalLimit,
    galleryCount,
    liveAlbumCount,
    currentCount,
    remainingSlots,
    isAtLimit,
    percentageUsed,
  };
}

/**
 * Alias cho Gallery (dùng chung bộ đếm với live album)
 */
export function getGalleryQuota(wedding: WeddingData): AlbumQuotaInfo {
  return getUnifiedAlbumQuota(wedding);
}

/**
 * Alias cho Live Album (dùng chung bộ đếm với gallery)
 */
export function getLiveAlbumQuota(wedding: WeddingData): AlbumQuotaInfo {
  return getUnifiedAlbumQuota(wedding);
}
