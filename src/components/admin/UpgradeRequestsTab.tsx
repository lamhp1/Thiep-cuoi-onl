import React, { useState, useEffect } from 'react';
import { PackageUpgradeRequest, UpgradeRequestStatus } from '../../types/commercial';
import {
  getUpgradeRequests,
  approveUpgradeRequest,
  rejectUpgradeRequest,
} from '../../services/upgradeService';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Phone,
  Calendar,
  CreditCard,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  Camera,
  Loader2,
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { approveAllPendingUpgradeRequests } from '../../services/upgradeService';

interface UpgradeRequestsTabProps {
  onRefreshCount?: () => void;
}

export function UpgradeRequestsTab({ onRefreshCount }: UpgradeRequestsTabProps) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<PackageUpgradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isApprovingAll, setIsApprovingAll] = useState(false);

  // Rejection modal
  const [rejectModalData, setRejectModalData] = useState<{
    request: PackageUpgradeRequest;
    reason: string;
  } | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getUpgradeRequests();
      setRequests(data);
      onRefreshCount?.();
    } catch (err) {
      console.error('Error loading upgrade requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const handleUpgradeEvent = () => {
      fetchRequests();
    };
    window.addEventListener('lamour_upgrade_requested', handleUpgradeEvent);
    window.addEventListener('lamour_upgrade_approved', handleUpgradeEvent);
    return () => {
      window.removeEventListener('lamour_upgrade_requested', handleUpgradeEvent);
      window.removeEventListener('lamour_upgrade_approved', handleUpgradeEvent);
    };
  }, []);

  const handleApprove = async (request: PackageUpgradeRequest) => {
    setProcessingId(request.id);
    try {
      const result = await approveUpgradeRequest(request.id, 'Admin L\'Amour');
      if (result.success) {
        const msg =
          request.type === 'EXTENSION'
            ? `Đã duyệt và gia hạn thời gian lưu trữ (${request.extensionPlanTitle || 'thành công'}) cho ${request.customerName}!`
            : request.type === 'ALBUM_SLOTS'
            ? `Đã duyệt và cấp thành công +${request.extraSlots || 0} ảnh vào Album Ngày Cưới cho khách hàng ${request.customerName}!`
            : `Đã duyệt và kích hoạt thành công gói ${request.targetPackageName} cho khách hàng ${request.customerName}!`;
        showToast(msg, 'success');
        fetchRequests();
      } else {
        showToast('Không thể cập nhật yêu cầu', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi duyệt yêu cầu', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalData) return;
    const { request, reason } = rejectModalData;
    setProcessingId(request.id);
    try {
      const result = await rejectUpgradeRequest(
        request.id,
        reason.trim() || 'Giao dịch chuyển khoản chưa khớp số tiền'
      );
      if (result.success) {
        showToast(`Đã từ chối yêu cầu của ${request.customerName}`, 'info');
        setRejectModalData(null);
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi từ chối yêu cầu', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveAll = async () => {
    setIsApprovingAll(true);
    try {
      const result = await approveAllPendingUpgradeRequests('Admin L\'Amour');
      showToast(`Đã duyệt thành công ${result.approvedCount} yêu cầu!`, 'success');
      await fetchRequests();
      onRefreshCount?.();
    } catch (e) {
      console.error(e);
      showToast('Có lỗi khi duyệt tất cả yêu cầu', 'error');
    } finally {
      setIsApprovingAll(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    let matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    if (filterStatus === 'TYPE_PACKAGE') matchStatus = (r.type === 'PACKAGE' || !r.type);
    if (filterStatus === 'TYPE_EXTENSION') matchStatus = r.type === 'EXTENSION';
    if (filterStatus === 'TYPE_ALBUM') matchStatus = r.type === 'ALBUM_SLOTS';

    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      r.customerName.toLowerCase().includes(query) ||
      r.customerPhone.includes(query) ||
      r.orderCode.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query);
    return matchStatus && matchQuery;
  });

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;
  const extensionCount = requests.filter((r) => r.type === 'EXTENSION').length;
  const packageCount = requests.filter((r) => r.type === 'PACKAGE' || !r.type).length;
  const albumCount = requests.filter((r) => r.type === 'ALBUM_SLOTS').length;

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2 font-serif-title">
            <Crown className="w-6 h-6 text-[#D4AF37]" />
            <span>Quản Lý Duyệt Nâng Cấp, Gia Hạn & Album</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Xác nhận giao dịch thanh toán chuyển khoản, gia hạn thời gian lưu trữ thiệp và nâng cấp dịch vụ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {pendingCount > 0 && (
            <button
              onClick={handleApproveAll}
              disabled={isApprovingAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              {isApprovingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang duyệt...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Duyệt Tất Cả ({pendingCount})</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={fetchRequests}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Tổng Yêu Cầu
          </span>
          <span className="text-2xl font-bold text-neutral-900 mt-1 block">
            {requests.length}
          </span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
            Chờ Duyệt
          </span>
          <span className="text-2xl font-bold text-amber-900 mt-1 block flex items-center gap-1.5">
            {pendingCount}
            {pendingCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Đã Kích Hoạt
          </span>
          <span className="text-2xl font-bold text-emerald-900 mt-1 block">
            {approvedCount}
          </span>
        </div>

        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Yêu Cầu Gia Hạn
          </span>
          <span className="text-2xl font-bold text-blue-900 mt-1 block">
            {extensionCount}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'Tất cả' },
            { key: 'PENDING', label: `Chờ duyệt (${pendingCount})`, highlight: pendingCount > 0 },
            { key: 'TYPE_EXTENSION', label: `Gia hạn thời gian (${extensionCount})` },
            { key: 'TYPE_PACKAGE', label: `Nâng cấp gói (${packageCount})` },
            { key: 'TYPE_ALBUM', label: `Mua ảnh Album (${albumCount})` },
            { key: 'APPROVED', label: 'Đã kích hoạt' },
            { key: 'REJECTED', label: 'Từ chối' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterStatus(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === item.key
                  ? 'bg-neutral-900 text-white'
                  : item.highlight
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, SĐT, mã đơn..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* List of Requests */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400 space-y-2">
            <Crown className="w-10 h-10 mx-auto text-neutral-300 stroke-1" />
            <p className="font-medium text-neutral-600">Không tìm thấy yêu cầu nào</p>
            <p className="text-xs">
              Khi khách hàng chuyển khoản và gửi yêu cầu gia hạn hoặc nâng cấp từ portal, thông tin sẽ hiển thị ở đây.
            </p>
          </div>
        ) : (
          filteredRequests.map((req, idx) => {
            const isPending = req.status === 'PENDING';
            const isApproved = req.status === 'APPROVED';
            const isRejected = req.status === 'REJECTED';
            const isExtension = req.type === 'EXTENSION';
            const isAlbum = req.type === 'ALBUM_SLOTS';

            return (
              <div
                key={`${req.id}-${idx}`}
                className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 transition-all ${
                  isPending
                    ? isExtension
                      ? 'border-blue-300 bg-blue-50/20 ring-1 ring-blue-200'
                      : 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-200'
                    : isApproved
                    ? 'border-emerald-200'
                    : 'border-neutral-200'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isPending
                          ? isExtension
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                          : isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {isExtension ? (
                        <Clock className="w-5 h-5 text-blue-800" />
                      ) : isAlbum ? (
                        <Camera className="w-5 h-5 text-amber-800" />
                      ) : (
                        <Crown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-neutral-900 text-base">
                          {req.customerName}
                        </h4>
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-semibold">
                          {req.orderCode}
                        </span>
                        {isExtension && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-700" />
                            <span>Gia Hạn: {req.extensionPlanTitle || 'Lưu Trữ'}</span>
                          </span>
                        )}
                        {isAlbum && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            📸 Mua Thêm +{req.extraSlots} Ảnh
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        Gửi lúc: {new Date(req.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isExtension
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Chờ Admin Duyệt</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isExtension ? 'Đã Cộng Thời Hạn' : isAlbum ? 'Đã Cấp Dung Lượng' : 'Đã Kích Hoạt Gói'}</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Từ Chối</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Package & Price details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  {/* Upgrade Flow / Extension Flow / Album Slot Flow */}
                  <div className="space-y-1">
                    <span className="text-neutral-400 block font-medium">
                      Loại yêu cầu:
                    </span>
                    {isExtension ? (
                      <div className="font-bold text-blue-900 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-md">
                        {req.extensionPlanTitle || `Gia hạn thêm ${req.extensionMonths === 'LIFETIME' ? 'Vĩnh Viễn' : req.extensionMonths + ' tháng'}`}
                      </div>
                    ) : isAlbum ? (
                      <div className="font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
                        Cấp thêm +{req.extraSlots} ảnh vào Album Ngày Cưới
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                          {req.currentPackageName}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF6EE] text-[#8C7335] border border-[#D4AF37]/40">
                          {req.targetPackageName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1">
                    <span className="text-neutral-400 block font-medium">
                      {isExtension || isAlbum ? 'Số tiền thanh toán:' : 'Số tiền chênh lệch (Thu thêm):'}
                    </span>
                    <span className="text-base font-extrabold text-[#8C7335] block">
                      {req.upgradeAmount.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      {isExtension ? `Thanh toán gói gia hạn ${req.extensionPlanTitle || ''}` : isAlbum ? req.targetPackageName : `(${req.targetPrice.toLocaleString('vi-VN')} đ - ${req.currentPaidAmount.toLocaleString('vi-VN')} đ)`}
                    </span>
                  </div>

                  {/* Transfer Memo */}
                  <div className="space-y-1">
                    <span className="text-neutral-400 block font-medium">Nội dung CK đối soát:</span>
                    <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-md block break-all">
                      {req.transferMemo}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="space-y-1">
                    <span className="text-neutral-400 block font-medium">Số điện thoại / Zalo:</span>
                    <a
                      href={`tel:${req.customerPhone}`}
                      className="font-semibold text-neutral-900 flex items-center gap-1 hover:text-[#D4AF37]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{req.customerPhone}</span>
                    </a>
                  </div>
                </div>

                {/* Customer Note if any */}
                {req.note && (
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-700 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-neutral-800">Ghi chú của khách: </span>
                      <span>{req.note}</span>
                    </div>
                  </div>
                )}

                {/* Rejection Reason if any */}
                {req.rejectionReason && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-red-900">Lý do từ chối: </span>
                      <span>{req.rejectionReason}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons for Admin */}
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-neutral-400">
                    {req.reviewedAt ? (
                      <span>
                        Duyệt bởi: <strong>{req.reviewedBy || 'Admin'}</strong> vào {new Date(req.reviewedAt).toLocaleString('vi-VN')}
                      </span>
                    ) : (
                      <span>Vui lòng kiểm tra tài khoản ngân hàng trước khi duyệt</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          type="button"
                          onClick={() => setRejectModalData({ request: req, reason: '' })}
                          disabled={processingId === req.id}
                          className="px-3 py-1.5 rounded-xl border border-neutral-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Từ Chối
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApprove(req)}
                          disabled={processingId === req.id}
                          className="px-4 py-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {processingId === req.id
                              ? 'Đang duyệt...'
                              : isExtension
                              ? 'Duyệt & Cộng Thời Hạn'
                              : isAlbum
                              ? `Cấp +${req.extraSlots} Ảnh`
                              : `Duyệt & Kích Hoạt Gói ${req.targetPackageName}`}
                          </span>
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{isExtension ? 'Đã cộng thời hạn' : 'Đã hoàn tất kích hoạt'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="font-bold text-neutral-900 text-base flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span>Từ Chối Yêu Cầu Nâng Cấp</span>
            </h4>
            <p className="text-xs text-neutral-600">
              Nhập lý do từ chối để thông báo cho khách hàng <strong>{rejectModalData.request.customerName}</strong> ({rejectModalData.request.orderCode}):
            </p>

            <textarea
              rows={3}
              value={rejectModalData.reason}
              onChange={(e) =>
                setRejectModalData({ ...rejectModalData, reason: e.target.value })
              }
              placeholder="VD: Chưa nhận được số tiền 200.000đ trong sao kê, vui lòng kiểm tra lại..."
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-red-300 focus:border-red-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalData(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={processingId === rejectModalData.request.id}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
