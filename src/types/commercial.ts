export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'NEGOTIATING'
  | 'WAITING_PAYMENT'
  | 'PAID'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Lead {
  id: string;
  orderCode?: string;
  name: string;
  groomName: string;
  brideName: string;
  phone: string;
  email: string;
  template: string;
  package: string;
  weddingDate?: string;
  note?: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CommercialPackage {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  isPopular?: boolean;
  durationMonths: number;
  albumPhotoLimit?: number; // Số lượng ảnh album cho phép tải lên theo gói
  description: string;
  features: string[];
  active: boolean;
}

export interface CommercialTemplate {
  id: string;
  slug: string;
  name: string;
  style: string;
  price: number;
  badge?: string;
  previewImage: string;
  demoSlug: string;
  features: string[];
  isFeatured?: boolean;
  active: boolean;
  description: string;
  packageId?: string;
  packageName?: string;
  requiredPlan?: 'basic' | 'premium' | 'vip' | string;
}

export interface CustomerOrder {
  id: string;
  orderCode: string;
  customerId?: string;
  customerName: string;
  phone: string;
  email: string;
  templateId: string;
  packageId: string;
  weddingId?: string;
  weddingSlug?: string;
  price: number;
  discount: number;
  finalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'WAITING_CONFIRMATION' | 'PAID' | 'REFUNDED';
  paymentReceiptUrl?: string;
  createdAt: string;
  paidAt?: string;
  startsAt?: string;
  expiresAt?: string;
  note?: string;
}

export interface PlatformPaymentConfig {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  transferPrefix: string;
  qrTemplate: string;
  note?: string;
  customQrUrl?: string;
  useCustomQr?: boolean;
}

export interface SiteContentConfig {
  brandName: string;
  brandTagline: string;
  hotline: string;
  zaloNumber: string;
  supportEmail: string;
  address?: string;
  bannerEnabled: boolean;
  bannerText: string;
  bannerBadge: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaText?: string;
  featuresHeading?: string;
  pricingHeading?: string;
  ctaBannerHeading?: string;
  ctaBannerSubheading?: string;
}

export type UpgradeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UpgradeRequestType = 'PACKAGE' | 'ALBUM_SLOTS' | 'EXTENSION';

export interface PackageUpgradeRequest {
  id: string;
  orderCode: string;
  type?: UpgradeRequestType;
  extraSlots?: number;
  extensionMonths?: number | 'LIFETIME';
  extensionPlanTitle?: string;
  weddingId?: string;
  weddingSlug?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  currentPackage: string;
  currentPackageName: string;
  targetPackage: string;
  targetPackageName: string;
  currentPaidAmount: number;
  targetPrice: number;
  upgradeAmount: number;
  transferMemo: string;
  note?: string;
  status: UpgradeRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}
