export type TemplateId = 
  | 'classic-luxury' 
  | 'minimal-white' 
  | 'floral-pink' 
  | 'floral-romance'
  | 'elegant-black-gold' 
  | 'traditional-vietnamese'
  | 'vietnamese-luxury-01'
  | 'vietnamese-modern-luxury'
  | 'haute-couture'
  | 'celestial-royale'
  | 'chateau-grandeur'
  | 'luxury-editorial'
  | 'cinematic-love-story'
  | 'cinematic-vietnamese'
  | 'cinematic-futuristic'
  | 'passport-love-01'
  | 'love-map-01'
  | 'love-letter-01'
  | 'polaroid-scrapbook-01'
  | 'vietnamese-fairytale-01'
  | 'lantern-night-01'
  | 'lantern-template'
  | 'moon-and-lotus'
  | 'moon-lotus-01'
  | 'love-game'
  | 'cyberpunk-hologram'
  | 'royal-ring-vault';

export interface CouplePerson {
  name: string;
  fullName: string;
  role: 'groom' | 'bride';
  avatar: string;
  bio: string;
  parents?: {
    father: string;
    mother: string;
  };
  socials?: {
    facebook?: string;
    instagram?: string;
    phone?: string;
  };
}

export interface WeddingEvent {
  id: string;
  title: string;
  type: 'ceremony' | 'reception' | 'engagement' | 'party';
  date: string; // e.g. "20/12/2026"
  time: string; // e.g. "10:00"
  locationName: string;
  address: string;
  mapUrl: string;
  description?: string;
}

export interface StoryMilestone {
  id: string;
  year: string;
  dateStr: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  location?: string;
  // Dual perspective fields for Groom (Anh) & Bride (Em / Cô dâu)
  groomTitle?: string;
  groomStory?: string;
  groomDescription?: string;
  groomImage?: string;
  brideTitle?: string;
  brideStory?: string;
  brideDescription?: string;
  brideImage?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  category?: 'prewedding' | 'ceremony' | 'moments';
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl: string;
  note?: string;
}

export interface WeddingGiftInfo {
  groomBank?: BankAccount;
  brideBank?: BankAccount;
  message?: string;
}

export interface RSVPGuest {
  id: string;
  weddingId: string;
  fullName: string;
  phone: string;
  attending: boolean;
  guestsCount: number;
  guestOf: 'groom' | 'bride' | 'both';
  message?: string;
  createdAt: string;
}

export interface WishMessage {
  id: string;
  weddingId: string;
  authorName: string;
  content: string;
  relation?: string;
  createdAt: string;
  likesCount?: number;
  isApproved?: boolean;
}

export interface LiveAlbumPhoto {
  id: string;
  url: string;
  caption?: string;
  takenAt?: string; // e.g. "08:30", "11:15", "18:45"
  phase?: 'preparation' | 'ceremony' | 'reception' | 'afterparty' | 'moments';
  likesCount?: number;
  uploadedAt?: string;
}

export interface LiveAlbumConfig {
  enabled: boolean;
  title?: string;
  description?: string;
  extraPhotosPurchased?: number;
  photos: LiveAlbumPhoto[];
  allowGuestUpload?: boolean;
}

export interface WeddingData {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  weddingDate: string; // ISO string or YYYY-MM-DD
  weddingDateTime: string; // 2026-12-20T10:00:00
  city: string;
  romanticQuote: string;
  coverImage: string;
  musicUrl?: string;
  template: TemplateId;
  groom: CouplePerson;
  bride: CouplePerson;
  events: WeddingEvent[];
  stories: StoryMilestone[];
  gallery: GalleryPhoto[];
  extraPhotosPurchased?: number; // Số lượng ảnh album đã mua thêm vượt hạn mức gói
  liveAlbum?: LiveAlbumConfig;
  gift: WeddingGiftInfo;
  isPublished: boolean;
  status?: 'ACTIVE' | 'LOCKED' | 'EXPIRED';
  expiresAt?: string;
  packageId?: string;
  packageName?: string;
  requiredPlan?: PlanTier;
  viewsCount?: number;
  customerPhone?: string;
  customerEmail?: string;
  accessPin?: string;
  orderCode?: string;
  upgradeStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  pendingUpgradePackage?: string;
  extensionStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  pendingExtensionMonths?: number | 'LIFETIME';
  pendingExtensionTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlanTier = 'basic' | 'premium' | 'vip';

export interface TemplateTheme {
  id: TemplateId;
  name: string;
  badge: string;
  description: string;
  bgClass: string;
  cardClass: string;
  accentColor: string;
  textColor: string;
  headingFont: string;
  goldAccent: string;
  requiredPlan?: PlanTier;
  requiredPlanName?: string;
}
