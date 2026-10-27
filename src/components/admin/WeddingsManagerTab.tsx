import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../types';
import { PackageUpgradeRequest } from '../../types/commercial';
import {
  getAllWeddings,
  fetchWeddingsFromFirestore,
  updateWeddingStatus,
  extendWeddingExpiry,
  toggleWeddingPublished,
  saveAllWeddings,
  isSlugLockedAuthoritative,
  deleteWeddingFromPlatform,
  updateWeddingPackage,
} from '../../services/siteConfigService';
import { deleteLead } from '../../services/leadService';
import {
  getUpgradeRequests,
  approveUpgradeRequest,
  approveAllPendingUpgradeRequests,
} from '../../services/upgradeService';
import {
  Heart,
  Lock,
  Unlock,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Search,
  KeyRound,
  Eye,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  AlertTriangle,
  X,
  Loader2,
  Package,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface WeddingsManagerTabProps {
  onSelectWeddingForEdit?: (wedding: WeddingData) => void;
}

export function WeddingsManagerTab({ onSelectWeddingForEdit }: WeddingsManagerTabProps) {
  const { showToast } = useToast();
  const [weddings, setWeddings] = useState<WeddingData[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PackageUpgradeRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [editingPinWeddingId, setEditingPinWeddingId] = useState<string | null>(null);
  const [newPinValue, setNewPinValue] = useState<string>('');
  const [isApprovingAll, setIsApprovingAll] = useState(false);

  // Delete Wedding Confirmation Modal State
  const [weddingToDelete, setWeddingToDelete] = useState<WeddingData | null>(null);
  const [deleteAssociatedLead, setDeleteAssociatedLead] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const reloadWeddings = () => {
    setWeddings(getAllWeddings());
    fetchWeddingsFromFirestore().then((remote) => {
      if (remote && remote.length > 0) {
        setWeddings(remote);
      }
    }).catch(() => {});
  };

  const loadPending = async () => {
    try {
      const allReqs = await getUpgradeRequests();
      const pending = allReqs.filter((r) => r.status === 'PENDING' && r.type === 'EXTENSION');
      setPendingRequests(pending);

      // Auto-heal local weddings: if no pending requests exist, clear any stuck PENDING extensionStatus
      if (pending.length === 0) {
        setWeddings((prev) => {
          let hadStuck = false;
          const healed = prev.map((w) => {
            if (w.extensionStatus === 'PENDING') {
              hadStuck = true;
              return { ...w, extensionStatus: 'APPROVED' as const, pendingExtensionTitle: undefined, pendingExtensionMonths: undefined };
            }
            return w;
          });
          if (hadStuck) {
            saveAllWeddings(healed);
          }
          return hadStuck ? healed : prev;
        });
      }
    } catch (e) {
      console.warn('Could not load pending requests for weddings tab:', e);
    }
  };

  useEffect(() => {
    reloadWeddings();
    loadPending();

    const handleWeddingDeleted = () => reloadWeddings();
    const handleUpgradeChanged = () => {
      reloadWeddings();
      loadPending();
    };

    const handleWeddingSaved = (e: Event) => {
      const customEvent = e as CustomEvent<WeddingData>;
      if (customEvent.detail) {
        const item = customEvent.detail;
        setWeddings((prev) => {
          const matchIdx = prev.findIndex(
            (w) =>
              w.id === item.id ||
              w.slug === item.slug ||
              (item.orderCode && w.orderCode === item.orderCode)
          );
          if (matchIdx >= 0) {
            const next = [...prev];
            next[matchIdx] = { ...next[matchIdx], ...item };
            return next;
          }
          return [item, ...prev];
        });
      }
    };

    window.addEventListener('lamour_wedding_deleted', handleWeddingDeleted);
    window.addEventListener('lamour_wedding_data_saved', handleWeddingSaved);
    window.addEventListener('lamour_upgrade_requested', handleUpgradeChanged);
    window.addEventListener('lamour_upgrade_approved', handleUpgradeChanged);
    window.addEventListener('lamour_upgrade_rejected', handleUpgradeChanged);

    return () => {
      window.removeEventListener('lamour_wedding_deleted', handleWeddingDeleted);
      window.removeEventListener('lamour_wedding_data_saved', handleWeddingSaved);
      window.removeEventListener('lamour_upgrade_requested', handleUpgradeChanged);
      window.removeEventListener('lamour_upgrade_approved', handleUpgradeChanged);
      window.removeEventListener('lamour_upgrade_rejected', handleUpgradeChanged);
    };
  }, []);

  const handleQuickApproveExtension = async (wedding: WeddingData) => {
    // Find matching pending request
    const matching = pendingRequests.find(
      (r) =>
        r.weddingSlug === wedding.slug ||
        r.weddingId === wedding.id ||
        (wedding.orderCode && r.orderCode === wedding.orderCode) ||
        (wedding.customerPhone && r.customerPhone && wedding.customerPhone.replace(/\D/g, '') === r.customerPhone.replace(/\D/g, ''))
    );

    if (matching) {
      const res = await approveUpgradeRequest(matching.id, 'Admin L\'Amour');
      if (res.success) {
        showToast(`Đã duyệt gia hạn cho thiệp của ${wedding.groomName} & ${wedding.brideName}!`, 'success');
      }
    } else {
      // If no formal request document was found, extend directly by 12 months or lifetime
      const months = wedding.pendingExtensionMonths || 12;
      const updated = extendWeddingExpiry(wedding.id || wedding.slug, months);
      setWeddings(updated);
      showToast(`Đã phê duyệt gia hạn thời gian lưu trữ cho ${wedding.groomName} & ${wedding.brideName}!`, 'success');
    }
    loadPending();
    reloadWeddings();
  };

  const handleApproveAllExtensions = async () => {
    setIsApprovingAll(true);
    try {
      const res = await approveAllPendingUpgradeRequests('Admin L\'Amour');
      // Also clear any stuck PENDING status in weddings list
      const all = getAllWeddings();
      const cleared = all.map((w) =>
        w.extensionStatus === 'PENDING'
          ? { ...w, extensionStatus: 'APPROVED' as const, pendingExtensionTitle: undefined, pendingExtensionMonths: undefined }
          : w
      );
      saveAllWeddings(cleared);
      setWeddings(cleared);
      setPendingRequests([]);
      showToast(`Đã duyệt thành công toàn bộ (${res.approvedCount || 'tất cả'}) yêu cầu gia hạn!`, 'success');
      reloadWeddings();
    } catch (e) {
      console.error(e);
      showToast('Có lỗi khi duyệt tất cả yêu cầu', 'error');
    } finally {
      setIsApprovingAll(false);
    }
  };

  const handleToggleLock = (wedding: WeddingData) => {
    const isCurrentlyLocked =
      wedding.status === 'LOCKED' ||
      isSlugLockedAuthoritative(wedding.slug) ||
      isSlugLockedAuthoritative(wedding.id) ||
      isSlugLockedAuthoritative(wedding.orderCode);
    const newStatus = isCurrentlyLocked ? 'ACTIVE' : 'LOCKED';
    const updated = updateWeddingStatus(wedding.id || wedding.slug, newStatus);
    setWeddings(updated);
    showToast(
      newStatus === 'LOCKED'
        ? `Đã KHÓA thiệp cưới của ${wedding.groomName} & ${wedding.brideName}`
        : `Đã KÍCH HOẠT MỞ LẠI cho thiệp của ${wedding.groomName} & ${wedding.brideName}`,
      newStatus === 'LOCKED' ? 'info' : 'success'
    );
  };

  const handleTogglePublish = (wedding: WeddingData) => {
    const newPub = !wedding.isPublished;
    const updated = toggleWeddingPublished(wedding.id || wedding.slug, newPub);
    setWeddings(updated);
    showToast(
      newPub
        ? `Đã BẬT xuất bản công khai cho thiệp của ${wedding.groomName} & ${wedding.brideName}`
        : `Đã ẨN thiệp (Chế độ riêng tư) của ${wedding.groomName} & ${wedding.brideName}`,
      'info'
    );
  };

  const handleExtend = (wedding: WeddingData, months: number | 'LIFETIME') => {
    const updated = extendWeddingExpiry(wedding.id || wedding.slug, months);
    setWeddings(updated);
    const text = months === 'LIFETIME' ? 'vĩnh viễn' : `thêm ${months} tháng`;
    showToast(`Đã gia hạn thành công ${text} cho thiệp ${wedding.groomName} & ${wedding.brideName}`, 'success');
  };

  const handleSavePin = (wedding: WeddingData) => {
    if (!newPinValue.trim()) return;
    const updated = weddings.map((w) =>
      w.id === wedding.id ? { ...w, accessPin: newPinValue.trim(), updatedAt: new Date().toISOString() } : w
    );
    setWeddings(updated);
    saveAllWeddings(updated);
    setEditingPinWeddingId(null);
    setNewPinValue('');
    showToast(`Đã cập nhật mã PIN khách hàng thành công: ${newPinValue}`, 'success');
  };

  const handleAddLiveAlbumSlots = (wedding: WeddingData, slots: number) => {
    const currentLive = wedding.liveAlbum || {
      enabled: true,
      title: 'Khoảnh Khắc Ngày Cưới',
      description: 'Những hình ảnh chân thực trong ngày cưới.',
      extraPhotosPurchased: 0,
      photos: [],
    };
    const currentExtra = Math.max(wedding.extraPhotosPurchased || 0, currentLive.extraPhotosPurchased || 0);
    const updatedExtra = currentExtra + slots;
    const updated = weddings.map((w) =>
      w.id === wedding.id
        ? {
            ...w,
            extraPhotosPurchased: updatedExtra,
            liveAlbum: { ...currentLive, extraPhotosPurchased: updatedExtra },
            updatedAt: new Date().toISOString(),
          }
        : w
    );
    setWeddings(updated);
    saveAllWeddings(updated);
    showToast(`Đã cộng thêm +${slots} ảnh vào Album cho ${wedding.groomName} & ${wedding.brideName}!`, 'success');
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/wedding/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showToast('Đã sao chép đường link thiệp cưới', 'success');
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleChangePackage = (item: WeddingData, newPkg: 'basic' | 'premium' | 'vip') => {
    const pkgNames: Record<'basic' | 'premium' | 'vip', string> = {
      basic: 'Gói Cơ Bản (Basic)',
      premium: 'Gói Cao Cấp (Premium)',
      vip: 'Gói Thiết Kế Riêng (VIP)',
    };
    const updatedList = updateWeddingPackage(item.slug || item.id, newPkg, pkgNames[newPkg]);
    setWeddings(updatedList);
    showToast(`Đã chuyển thiệp cưới của ${item.groomName} & ${item.brideName} sang ${pkgNames[newPkg]}!`, 'success');
  };

  const handleConfirmDeleteWedding = async () => {
    if (!weddingToDelete) return;
    setIsDeleting(true);
    try {
      const groom = weddingToDelete.groomName;
      const bride = weddingToDelete.brideName;
      const orderCode = weddingToDelete.orderCode;

      // 1. Delete wedding from platform registry, caches, and Firestore
      const updatedList = await deleteWeddingFromPlatform(
        weddingToDelete.id || weddingToDelete.slug,
        orderCode
      );
      setWeddings(updatedList);

      // 2. Optionally delete associated Lead order
      if (deleteAssociatedLead && orderCode) {
        try {
          await deleteLead(orderCode);
        } catch (err) {
          console.warn('Could not delete associated lead:', err);
        }
      }

      showToast(`Đã xóa vĩnh viễn thiệp cưới của ${groom} & ${bride} thành công!`, 'success');
      setWeddingToDelete(null);
    } catch (err) {
      console.error('Failed to delete wedding:', err);
      showToast('Có lỗi xảy ra khi xóa thiệp cưới', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredWeddings = weddings.filter((w) => {
    const matchStatus = filterStatus === 'ALL' || w.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !q ||
      w.groomName.toLowerCase().includes(q) ||
      w.brideName.toLowerCase().includes(q) ||
      w.slug.toLowerCase().includes(q) ||
      (w.customerPhone && w.customerPhone.includes(q)) ||
      (w.orderCode && w.orderCode.toLowerCase().includes(q));
    return matchStatus && matchQuery;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Không giới hạn';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-neutral-900 text-base sm:text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D4AF37]" />
            <span>Quản Lý Danh Sách Thiệp Cưới Trên Hệ Thống</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kích hoạt, khóa thiệp, theo dõi thời hạn sử dụng và quản lý tài khoản cặp đôi
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, mã thiệp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-hidden text-neutral-700 font-medium"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LOCKED">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Pending Extension Notice Banner with One-Click Approve All */}
      {pendingRequests.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-blue-900">
                Có {pendingRequests.length} Yêu Cầu Gia Hạn Thời Gian Đang Chờ Duyệt
              </h4>
              <p className="text-xs text-blue-700">
                Khách hàng đã chuyển khoản thanh toán phí gia hạn lưu trữ thiệp cưới.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleApproveAllExtensions}
            disabled={isApprovingAll}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isApprovingAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang duyệt...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Duyệt Tất Cả Gia Hạn</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Weddings Grid List */}
      <div className="space-y-4">
        {filteredWeddings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 text-neutral-400">
            <p className="text-sm">Không tìm thấy thiệp cưới nào phù hợp.</p>
          </div>
        ) : (
          filteredWeddings.map((item, index) => {
            const isLocked =
              item.status === 'LOCKED' ||
              isSlugLockedAuthoritative(item.slug) ||
              isSlugLockedAuthoritative(item.id) ||
              isSlugLockedAuthoritative(item.orderCode);
            const isCopied = copiedSlug === item.slug;
            const isEditingPin = editingPinWeddingId === item.id;

            return (
              <div
                key={`${item.id || item.slug || 'wedding'}-${index}`}
                className={`bg-white rounded-2xl border transition-all shadow-xs p-5 space-y-4 ${
                  isLocked ? 'border-red-200 bg-red-50/10' : 'border-neutral-200 hover:border-[#D4AF37]/50'
                }`}
              >
                {/* Upper row: Couple names, Package, Badges, Direct Actions */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <img
                      src={item.coverImage || item.groom?.avatar || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                      alt={item.groomName}
                      className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif-title font-bold text-base sm:text-lg text-neutral-900 truncate">
                          {item.groomName} & {item.brideName}
                        </h3>
                        <span className="font-mono text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md shrink-0">
                          /{item.slug}
                        </span>

                        {/* Status Badge Button - Fixed Width to avoid layout shifts */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleLock(item);
                          }}
                          className={`w-[124px] justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-all shrink-0 whitespace-nowrap ${
                            isLocked
                              ? 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
                          }`}
                          title={isLocked ? 'Thiệp đang bị khóa (Nhấn để kích hoạt lại)' : 'Thiệp đang hoạt động (Nhấn để khóa)'}
                        >
                          {isLocked ? <Lock className="w-3 h-3 shrink-0" /> : <Unlock className="w-3 h-3 shrink-0" />}
                          <span className="whitespace-nowrap">{isLocked ? 'Đã Khóa' : 'Đang Hoạt Động'}</span>
                        </button>

                        {/* Publish Status Badge Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTogglePublish(item);
                          }}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-colors shrink-0 whitespace-nowrap ${
                            item.isPublished
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                          title={item.isPublished ? 'Đang công khai (Nhấn để ẩn thiệp)' : 'Đang tạm ẩn (Nhấn để công khai thiệp)'}
                        >
                          <span className="whitespace-nowrap">{item.isPublished ? '✓ Công khai' : '🔒 Tạm ẩn'}</span>
                        </button>

                        {/* Pending Extension Request Badge - Only display if there is a real pending request */}
                        {(() => {
                          const hasRealPending =
                            item.extensionStatus === 'PENDING' &&
                            (pendingRequests.length === 0
                              ? false // All requests are approved, do not show stale badge
                              : pendingRequests.some(
                                  (r) =>
                                    r.weddingSlug === item.slug ||
                                    r.weddingId === item.id ||
                                    (item.orderCode && r.orderCode === item.orderCode) ||
                                    (item.customerPhone &&
                                      r.customerPhone &&
                                      item.customerPhone.replace(/\D/g, '') === r.customerPhone.replace(/\D/g, ''))
                                ));

                          if (!hasRealPending) return null;

                          return (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white border border-blue-700 flex items-center gap-1.5 shadow-2xs shrink-0 whitespace-nowrap">
                              <Clock className="w-3 h-3 text-blue-100 shrink-0 animate-pulse" />
                              <span>Chờ duyệt {item.pendingExtensionTitle ? `(${item.pendingExtensionTitle})` : 'gia hạn'}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleQuickApproveExtension(item);
                                }}
                                className="ml-1 px-2 py-0.5 rounded-full bg-white text-blue-900 text-[10px] font-black hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                                title="Bấm để duyệt ngay yêu cầu gia hạn này"
                              >
                                ✓ Duyệt Ngay
                              </button>
                            </span>
                          );
                        })()}
                      </div>

                      <div className="text-xs text-neutral-500 mt-1 flex items-center gap-3 flex-wrap">
                        <span>Ngày cưới: <strong>{item.weddingDate}</strong></span>
                        <span>•</span>
                        <span>Mẫu thiệp: <strong className="capitalize">{item.template}</strong></span>
                        <span>•</span>
                        <div className="inline-flex items-center gap-1.5 bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#D4AF37]/40 shadow-2xs shrink-0">
                          <Package className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span className="text-[11px] font-bold text-neutral-600">Gói:</span>
                          <select
                            value={
                              (item.packageId?.includes('vip') || item.packageName?.toLowerCase().includes('vip'))
                                ? 'vip'
                                : (item.packageId?.includes('basic') || item.packageName?.toLowerCase().includes('cơ bản') || item.packageName?.toLowerCase().includes('basic'))
                                ? 'basic'
                                : 'premium'
                            }
                            onChange={(e) => handleChangePackage(item, e.target.value as 'basic' | 'premium' | 'vip')}
                            className="text-xs font-bold text-[#8C7335] bg-transparent border-none focus:outline-hidden cursor-pointer"
                            title="Bấm để thay đổi gói dịch vụ của thiệp cưới này (Cơ Bản / Cao Cấp / VIP)"
                          >
                            <option value="basic">Gói Cơ Bản (Basic)</option>
                            <option value="premium">Gói Cao Cấp (Premium)</option>
                            <option value="vip">Gói Thiết Kế Riêng (VIP)</option>
                          </select>
                        </div>
                        <span>•</span>
                        <span>Lượt xem: <strong>{item.viewsCount || 120} lượt</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View live, Copy link, Lock toggle - Stabilized */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item.slug)}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      title="Sao chép link thiệp"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                      <span className="whitespace-nowrap">{isCopied ? 'Đã copy' : 'Copy link'}</span>
                    </button>

                    <a
                      href={`/wedding/${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="whitespace-nowrap">Xem thiệp</span>
                    </a>

                    {onSelectWeddingForEdit && (
                      <button
                        type="button"
                        onClick={() => onSelectWeddingForEdit(item)}
                        className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#8C7335] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">Sửa thiệp</span>
                      </button>
                    )}

                    {/* Toggle Lock / Unlock Button - Fixed width to prevent line wrap jumping */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleLock(item);
                      }}
                      className={`w-[130px] justify-center px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                        isLocked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'
                      }`}
                      title={isLocked ? 'Kích hoạt lại thiệp' : 'Khóa thiệp'}
                    >
                      {isLocked ? <Unlock className="w-3.5 h-3.5 shrink-0" /> : <Lock className="w-3.5 h-3.5 shrink-0" />}
                      <span className="whitespace-nowrap">{isLocked ? 'Kích Hoạt Lại' : 'Khóa Thiệp'}</span>
                    </button>

                    {/* Permanent Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setWeddingToDelete(item);
                        setDeleteAssociatedLead(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      title="Xóa vĩnh viễn thiệp cưới này khỏi hệ thống"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="whitespace-nowrap">Xóa</span>
                    </button>
                  </div>
                </div>

                {/* Lower row: Expiry Duration, Live Album Capacity & Customer Credentials Management */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-100">
                  {/* Expiry and Extensions */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Thời hạn lưu trữ:</span>
                      </span>
                      <strong className="text-neutral-900 font-mono text-xs">
                        {formatDate(item.expiresAt)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-neutral-500">Gia hạn:</span>
                      <button
                        onClick={() => handleExtend(item, 1)}
                        className="px-2 py-1 rounded-md bg-white border border-neutral-200 hover:border-[#D4AF37] hover:text-[#8C7335] text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        +1T
                      </button>
                      <button
                        onClick={() => handleExtend(item, 3)}
                        className="px-2 py-1 rounded-md bg-white border border-neutral-200 hover:border-[#D4AF37] hover:text-[#8C7335] text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        +3T
                      </button>
                      <button
                        onClick={() => handleExtend(item, 6)}
                        className="px-2 py-1 rounded-md bg-white border border-neutral-200 hover:border-[#D4AF37] hover:text-[#8C7335] text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        +6T
                      </button>
                      <button
                        onClick={() => handleExtend(item, 'LIFETIME')}
                        className="px-2 py-1 rounded-md bg-[#FAF6EE] border border-[#D4AF37]/50 text-[#8C7335] hover:bg-[#D4AF37] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        ∞ Vĩnh Viễn
                      </button>
                    </div>
                  </div>

                  {/* Live Album Management */}
                  <div className="space-y-2 md:border-l md:border-neutral-200 md:pl-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                        <span className="text-sm">📸</span>
                        <span>Album Ảnh (Chung):</span>
                      </span>
                      <span className="font-mono text-neutral-900 font-bold">
                        {(item.gallery?.length || 0) + (item.liveAlbum?.photos?.length || 0)} ảnh
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="text-[11px] text-neutral-500">
                        {item.gallery?.length || 0} KN + {item.liveAlbum?.photos?.length || 0} NC • Mua: <strong className="text-emerald-700">+{Math.max(item.extraPhotosPurchased || 0, item.liveAlbum?.extraPhotosPurchased || 0)} ảnh</strong>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAddLiveAlbumSlots(item, 25)}
                          className="px-2 py-1 rounded-md bg-white border border-neutral-200 hover:border-[#D4AF37] text-[11px] font-medium cursor-pointer"
                          title="Cộng thêm 25 ảnh"
                        >
                          +25 ảnh
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddLiveAlbumSlots(item, 60)}
                          className="px-2 py-1 rounded-md bg-[#FAF6EE] border border-[#D4AF37]/50 text-[#8C7335] text-[11px] font-bold cursor-pointer"
                          title="Cộng thêm 60 ảnh"
                        >
                          +60 ảnh
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Customer Account & Security Credentials */}
                  <div className="space-y-2 md:border-l md:border-neutral-200 md:pl-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tài khoản cặp đôi:</span>
                      </span>
                      <span className="font-mono text-neutral-800">
                        Mã: <strong>{item.orderCode || item.id}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-neutral-500">
                        PIN: <strong className="font-mono text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200">{item.accessPin || '1234'}</strong>
                        {item.customerPhone && <span className="ml-2">({item.customerPhone})</span>}
                      </span>

                      {isEditingPin ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="PIN mới"
                            value={newPinValue}
                            onChange={(e) => setNewPinValue(e.target.value)}
                            className="w-20 px-2 py-0.5 text-xs rounded border border-neutral-300 font-mono"
                          />
                          <button
                            onClick={() => handleSavePin(item)}
                            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-medium"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingPinWeddingId(null)}
                            className="px-1.5 py-0.5 bg-neutral-200 text-neutral-600 rounded text-[11px]"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPinWeddingId(item.id);
                            setNewPinValue(item.accessPin || '1234');
                          }}
                          className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                        >
                          Đổi PIN
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Wedding Confirmation Modal */}
      {weddingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-red-200 p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title text-lg font-bold text-neutral-900">
                    Xác Nhận Xóa Vĩnh Viễn Thiệp Cưới
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Hành động này sẽ xóa dữ liệu và không thể khôi phục
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isDeleting && setWeddingToDelete(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                disabled={isDeleting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Wedding Details Box */}
            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 space-y-2.5 text-xs text-neutral-700">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Cặp đôi:</span>
                <strong className="text-neutral-900 font-semibold text-sm">
                  {weddingToDelete.groomName} & {weddingToDelete.brideName}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Đường dẫn thiệp (Slug):</span>
                <span className="font-mono text-neutral-800 bg-white px-2 py-0.5 rounded border border-neutral-200">
                  /wedding/{weddingToDelete.slug}
                </span>
              </div>
              {weddingToDelete.orderCode && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">Mã đơn hàng liên kết:</span>
                  <span className="font-mono text-neutral-800 bg-white px-2 py-0.5 rounded border border-neutral-200">
                    {weddingToDelete.orderCode}
                  </span>
                </div>
              )}
              {weddingToDelete.customerPhone && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">Số điện thoại:</span>
                  <span className="font-semibold text-neutral-800">
                    {weddingToDelete.customerPhone}
                  </span>
                </div>
              )}
            </div>

            {/* Associated Lead Option */}
            {weddingToDelete.orderCode && (
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 cursor-pointer hover:bg-neutral-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={deleteAssociatedLead}
                  onChange={(e) => setDeleteAssociatedLead(e.target.checked)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-semibold text-neutral-900 block">
                    Xóa luôn đơn đặt hàng tương ứng trong mục Khách Hàng (Leads)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Mã đơn: {weddingToDelete.orderCode}
                  </span>
                </div>
              </label>
            )}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Toàn bộ ảnh trong Live Album, lời chúc, danh sách RSVP và link thiệp sẽ bị vô hiệu hóa ngay lập tức.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setWeddingToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteWedding}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Vĩnh Viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
