import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '../../types/commercial';
import { WeddingData } from '../../types';
import { getLeads, updateLeadStatus, updateLeadPackage, deleteLead } from '../../services/leadService';
import { createOrActivateWeddingFromLead, getAllWeddings, updateWeddingStatus, toggleWeddingPublished, updateWeddingPackage, deleteWeddingFromPlatform } from '../../services/siteConfigService';
import {
  Users,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Package,
  MessageSquare,
  Clock,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  Check,
  X,
  Share2,
  ShieldCheck,
  Heart,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useToast } from '../ui/Toast';

interface LeadsTabProps {
  onOpenWeddingEdit?: (wedding: WeddingData) => void;
}

export function LeadsTab({ onOpenWeddingEdit }: LeadsTabProps) {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [handoverModal, setHandoverModal] = useState<{
    lead: Lead;
    wedding: WeddingData;
  } | null>(null);
  const [copiedHandover, setCopiedHandover] = useState(false);

  // Delete Lead Confirmation State
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [deleteAssociatedWedding, setDeleteAssociatedWedding] = useState<boolean>(true);
  const [isDeletingLead, setIsDeletingLead] = useState<boolean>(false);

  const fetchLeadsData = async () => {
    setIsLoading(true);
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error('Error loading leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();

    const handleLeadDeleted = () => fetchLeadsData();
    window.addEventListener('lamour_lead_deleted', handleLeadDeleted);
    return () => {
      window.removeEventListener('lamour_lead_deleted', handleLeadDeleted);
    };
  }, []);

  const handleConfirmDeleteLead = async () => {
    if (!leadToDelete) return;
    setIsDeletingLead(true);
    try {
      const leadId = leadToDelete.id;
      const leadName = leadToDelete.name;

      // 1. Delete Lead
      const updatedList = await deleteLead(leadId);
      setLeads(updatedList);

      // 2. Delete Associated Wedding if requested
      if (deleteAssociatedWedding) {
        try {
          await deleteWeddingFromPlatform(leadId, leadId);
        } catch (e) {
          console.warn('Could not delete associated wedding:', e);
        }
      }

      showToast(`Đã xóa đơn đặt hàng của ${leadName} thành công!`, 'success');
      setLeadToDelete(null);
    } catch (err) {
      console.error('Delete lead error:', err);
      showToast('Có lỗi xảy ra khi xóa đơn hàng', 'error');
    } finally {
      setIsDeletingLead(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );

      // Synchronize wedding lock state according to approval status
      const all = getAllWeddings();
      const targetLead = leads.find((l) => l.id === leadId);
      const wedding = all.find(
        (w) =>
          w.orderCode === leadId ||
          (targetLead?.phone && w.customerPhone && w.customerPhone.replace(/\D/g, '') === targetLead.phone.replace(/\D/g, ''))
      );

      if (wedding) {
        if (newStatus === 'PAID' || newStatus === 'COMPLETED') {
          updateWeddingStatus(wedding.id || wedding.slug, 'ACTIVE');
          toggleWeddingPublished(wedding.id || wedding.slug, true);
        } else {
          updateWeddingStatus(wedding.id || wedding.slug, 'LOCKED');
          toggleWeddingPublished(wedding.id || wedding.slug, false);
        }
      } else if (targetLead && (newStatus === 'PAID' || newStatus === 'COMPLETED')) {
        const created = createOrActivateWeddingFromLead(targetLead);
        updateWeddingStatus(created.id || created.slug, 'ACTIVE');
      } else if (newStatus !== 'PAID' && newStatus !== 'COMPLETED') {
        updateWeddingStatus(leadId, 'LOCKED');
      }

      showToast('Đã cập nhật trạng thái khách hàng & đồng bộ thiệp cưới', 'success');
    } catch (e) {
      console.error('Status change error:', e);
      showToast('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const handleLeadPackageChange = async (leadId: string, newPkgSlug: string) => {
    try {
      const canonicalSlug: 'basic' | 'premium' | 'vip' =
        newPkgSlug.toLowerCase().includes('vip')
          ? 'vip'
          : newPkgSlug.toLowerCase().includes('basic') || newPkgSlug.toLowerCase().includes('cơ bản')
          ? 'basic'
          : 'premium';
      const pkgNames: Record<'basic' | 'premium' | 'vip', string> = {
        basic: 'Gói Cơ Bản (Basic)',
        premium: 'Gói Cao Cấp (Premium)',
        vip: 'Gói Thiết Kế Riêng (VIP)',
      };

      await updateLeadPackage(leadId, canonicalSlug);

      const targetLead = leads.find((l) => l.id === leadId);
      if (targetLead) {
        updateWeddingPackage(targetLead.id, canonicalSlug, pkgNames[canonicalSlug]);
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, package: canonicalSlug } : l))
      );
      showToast(`Đã chuyển đơn của ${targetLead?.name || 'khách'} sang ${pkgNames[canonicalSlug]}!`, 'success');
    } catch {
      showToast('Có lỗi xảy ra khi đổi gói', 'error');
    }
  };

  const handleActivateWedding = async (lead: Lead) => {
    try {
      const approvedLead: Lead = { ...lead, status: 'PAID' };
      await updateLeadStatus(lead.id, 'PAID');
      const wedding = createOrActivateWeddingFromLead(approvedLead);
      updateWeddingStatus(wedding.id, 'ACTIVE');
      toggleWeddingPublished(wedding.id, true);
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: 'PAID' } : l))
      );
      setHandoverModal({ lead: approvedLead, wedding: { ...wedding, status: 'ACTIVE', isPublished: true } });
      showToast(`Đã duyệt thanh toán & kích hoạt quyền chỉnh sửa thiệp cưới cho ${lead.name}!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi kích hoạt thiệp cưới', 'error');
    }
  };

  const handleOpenHandover = (lead: Lead) => {
    const all = getAllWeddings();
    let wedding = all.find(
      (w) =>
        w.orderCode === lead.id ||
        (lead.phone && w.customerPhone && w.customerPhone.replace(/\D/g, '') === lead.phone.replace(/\D/g, ''))
    );
    if (!wedding) {
      wedding = createOrActivateWeddingFromLead(lead);
    }
    setHandoverModal({ lead, wedding });
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Mới (Chưa liên hệ)
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Đã liên hệ tư vấn
          </span>
        );
      case 'NEGOTIATING':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            Đang thương lượng
          </span>
        );
      case 'WAITING_PAYMENT':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            Chờ thanh toán
          </span>
        );
      case 'PAID':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Đã thanh toán
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            Đã bàn giao thiệp
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
            Đã hủy / Không mua
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
            {status}
          </span>
        );
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchStatus = filterStatus === 'ALL' || l.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchSearch =
      !query ||
      l.name.toLowerCase().includes(query) ||
      l.phone.includes(query) ||
      (l.email && l.email.toLowerCase().includes(query)) ||
      l.groomName.toLowerCase().includes(query) ||
      l.brideName.toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  const totalCount = leads.length;
  const newCount = leads.filter((l) => l.status === 'NEW').length;
  const waitingPaymentCount = leads.filter((l) => l.status === 'WAITING_PAYMENT').length;
  const paidCount = leads.filter((l) => l.status === 'PAID' || l.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <p className="text-xs text-neutral-500 font-medium">Tổng số yêu cầu</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <p className="text-xs text-blue-600 font-medium">Yêu cầu mới (Cần gọi)</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{newCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <p className="text-xs text-amber-600 font-medium">Chờ thanh toán</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{waitingPaymentCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <p className="text-xs text-emerald-600 font-medium">Đã thanh toán / Bàn giao</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{paidCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
          <button
            onClick={fetchLeadsData}
            className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 cursor-pointer"
            title="Tải lại danh sách"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'NEW', label: 'Mới' },
            { id: 'CONTACTED', label: 'Đã tư vấn' },
            { id: 'WAITING_PAYMENT', label: 'Chờ TT' },
            { id: 'PAID', label: 'Đã TT' },
            { id: 'COMPLETED', label: 'Hoàn tất' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st.id
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            Đang tải dữ liệu khách hàng tiềm năng...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 text-neutral-400 text-sm space-y-2">
            <Users className="w-8 h-8 mx-auto text-neutral-300" />
            <p className="font-medium text-neutral-600">Chưa có yêu cầu đặt thiệp nào</p>
            <p className="text-xs">
              Khi khách hàng điền form tại trang <strong>/order</strong> trên website bán hàng, thông tin sẽ xuất hiện tại đây ngay lập tức.
            </p>
          </div>
        ) : (
          filteredLeads.map((lead, idx) => (
            <div
              key={`${lead.id}-${idx}`}
              className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4 hover:border-[#D4AF37] transition-colors"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border border-[#D4AF37]/40 flex items-center justify-center text-[#B38F26] font-bold text-sm">
                    {lead.groomName ? lead.groomName.charAt(0) : 'W'}
                  </div>
                  <div>
                    <h4 className="font-serif-title text-base sm:text-lg font-bold text-neutral-900">
                      {lead.name}
                    </h4>
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleString('vi-VN')} (Mã: {lead.id})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(lead.status)}
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange(lead.id, e.target.value as LeadStatus)
                    }
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white font-medium cursor-pointer"
                  >
                    <option value="NEW">Mới (Chưa gọi)</option>
                    <option value="CONTACTED">Đã gọi tư vấn</option>
                    <option value="NEGOTIATING">Đang thương lượng</option>
                    <option value="WAITING_PAYMENT">Chờ chuyển khoản</option>
                    <option value="PAID">Đã nhận tiền</option>
                    <option value="COMPLETED">Đã bàn giao thiệp</option>
                    <option value="CANCELLED">Hủy / Không mua</option>
                  </select>
                </div>
              </div>

              {/* Body Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-neutral-600">
                <div className="space-y-1">
                  <span className="text-neutral-400 block font-medium">Số điện thoại / Zalo:</span>
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-semibold text-neutral-900 flex items-center gap-1 hover:text-[#B38F26]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{lead.phone}</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block font-medium">Email:</span>
                  <span className="text-neutral-800 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{lead.email || 'Chưa cung cấp'}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block font-medium">Gói dịch vụ đã chọn:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <select
                      value={
                        lead.package?.toLowerCase().includes('vip')
                          ? 'vip'
                          : lead.package?.toLowerCase().includes('basic') || lead.package?.toLowerCase().includes('cơ bản')
                          ? 'basic'
                          : 'premium'
                      }
                      onChange={(e) => handleLeadPackageChange(lead.id, e.target.value)}
                      title="Bấm để thay đổi gói dịch vụ của đơn này (Cơ Bản / Cao Cấp / VIP)"
                      className="text-xs font-bold text-[#8C7335] bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#D4AF37]/50 focus:outline-hidden cursor-pointer"
                    >
                      <option value="basic">Gói Cơ Bản (Basic)</option>
                      <option value="premium">Gói Cao Cấp (Premium)</option>
                      <option value="vip">Gói Thiết Kế Riêng (VIP)</option>
                    </select>
                    <span className="text-xs text-neutral-500">• Mẫu: <strong className="text-neutral-700">{lead.template}</strong></span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block font-medium">Ngày cưới dự kiến:</span>
                  <span className="text-neutral-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{lead.weddingDate || 'Chưa xác định'}</span>
                  </span>
                </div>
              </div>

              {lead.note && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-700 flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-800">Ghi chú của khách: </span>
                    <span>{lead.note}</span>
                  </div>
                </div>
              )}

              {/* Action Bar for Step 8 & 9: Admin Confirmation & System Activation */}
              <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {lead.status === 'PAID' || lead.status === 'COMPLETED' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Thiệp cưới đã kích hoạt & sẵn sàng</span>
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-500">
                      {lead.status === 'WAITING_PAYMENT'
                        ? 'Khách đã báo chuyển khoản VietQR - Vui lòng kiểm tra tài khoản và bấm kích hoạt'
                        : 'Yêu cầu mới - Hãy kiểm tra thông tin hoặc bấm kích hoạt khi nhận được thanh toán'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {lead.status !== 'PAID' && lead.status !== 'COMPLETED' ? (
                    <button
                      onClick={() => handleActivateWedding(lead)}
                      className="px-4 py-2 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Xác Nhận Đã Nhận Tiền & Kích Hoạt Thiệp</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenHandover(lead)}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-[#D4AF37] hover:text-[#F3DF95] text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Lấy Tin Nhắn Bàn Giao (Zalo/SMS)</span>
                    </button>
                  )}

                  <a
                    href={`https://zalo.me/${lead.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 transition-colors flex items-center gap-1"
                  >
                    <span>Mở Zalo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Delete Lead Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setLeadToDelete(lead);
                      setDeleteAssociatedWedding(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    title="Xóa đơn đặt hàng / khách hàng này"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Handover Modal (Step 8 -> Step 10 & 13) */}
      {handoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-neutral-900">
                    Bàn Giao Thiệp Cưới Cho Cặp Đôi
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Đã kích hoạt thành công thiệp cưới của{' '}
                    <strong>{handoverModal.lead.name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setHandoverModal(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FAF6EE] p-4 rounded-2xl border border-[#D4AF37]/30">
              <div className="space-y-1">
                <span className="text-neutral-500 block">Link Thiệp Công Khai:</span>
                <a
                  href={`/wedding/${handoverModal.wedding.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#8C7335] hover:underline flex items-center gap-1 truncate"
                >
                  <span>/wedding/{handoverModal.wedding.slug}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 block">Cổng Quản Trị Cặp Đôi:</span>
                <a
                  href={`/portal?code=${handoverModal.wedding.orderCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-neutral-800 hover:underline flex items-center gap-1 truncate"
                >
                  <span>/portal?code={handoverModal.wedding.orderCode}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 block">Mã PIN Đăng Nhập:</span>
                <span className="font-mono font-bold text-neutral-900 text-sm bg-white px-2 py-0.5 rounded border border-[#D4AF37]/40">
                  {handoverModal.wedding.accessPin || '1234'}
                </span>
              </div>
            </div>

            {/* Pre-written message box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <span>Tin nhắn soạn sẵn gửi khách qua Zalo / SMS:</span>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const origin = window.location.origin;
                    const message = `Kính gửi hai bạn ${handoverModal.lead.name},

L'Amour Wedding xin chúc mừng và trân trọng bàn giao thiệp cưới online cao cấp của hai bạn:

🌸 Link xem & chia sẻ thiệp tới khách mời:
${origin}/wedding/${handoverModal.wedding.slug}

💌 Cổng quản trị & tự do chỉnh sửa thiệp:
${origin}/portal?code=${handoverModal.wedding.orderCode}

🔑 Mã PIN bảo mật: ${handoverModal.wedding.accessPin || '1234'}
📱 Đăng nhập bằng SĐT: ${handoverModal.lead.phone}
⏳ Gói dịch vụ: ${handoverModal.wedding.packageName || 'Cao Cấp'} (Hạn dùng: ${new Date(handoverModal.wedding.expiresAt || '').toLocaleDateString('vi-VN')})

Hai bạn có thể vào Cổng quản trị để đăng ảnh cưới, viết câu chuyện tình yêu và cập nhật tài khoản nhận mừng cưới bất cứ lúc nào!
Nếu cần hỗ trợ thêm, vui lòng liên hệ hotline L'Amour: 0905 123 456.

Chúc hai bạn ngày cưới trọn vẹn và hạnh phúc trăm năm!`;

                    navigator.clipboard.writeText(message);
                    setCopiedHandover(true);
                    showToast('Đã sao chép nội dung tin nhắn bàn giao', 'success');
                    setTimeout(() => setCopiedHandover(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 hover:bg-[#D4AF37] hover:text-white text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedHandover ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép toàn bộ tin nhắn</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                rows={8}
                value={`Kính gửi hai bạn ${handoverModal.lead.name},

L'Amour Wedding xin chúc mừng và trân trọng bàn giao thiệp cưới online cao cấp của hai bạn:

🌸 Link xem & chia sẻ thiệp tới khách mời:
${window.location.origin}/wedding/${handoverModal.wedding.slug}

💌 Cổng quản trị & tự do chỉnh sửa thiệp:
${window.location.origin}/portal?code=${handoverModal.wedding.orderCode}

🔑 Mã PIN bảo mật: ${handoverModal.wedding.accessPin || '1234'}
📱 Đăng nhập bằng SĐT: ${handoverModal.lead.phone}
⏳ Gói dịch vụ: ${handoverModal.wedding.packageName || 'Cao Cấp'}

Hai bạn có thể vào Cổng quản trị để đăng ảnh cưới, viết câu chuyện tình yêu và cập nhật tài khoản nhận mừng cưới bất cứ lúc nào!
Nếu cần hỗ trợ thêm, vui lòng liên hệ hotline L'Amour: 0905 123 456.

Chúc hai bạn ngày cưới trọn vẹn và hạnh phúc trăm năm!`}
                className="w-full p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-mono text-neutral-800 focus:outline-hidden resize-none leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`https://zalo.me/${handoverModal.lead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#0068FF] hover:bg-[#0054CC] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Mở Zalo Khách Hàng</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`/wedding/${handoverModal.wedding.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold text-center transition-colors"
                >
                  Xem Thiệp Thực Tế
                </a>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {onOpenWeddingEdit && (
                  <button
                    onClick={() => {
                      const wedding = handoverModal.wedding;
                      setHandoverModal(null);
                      onOpenWeddingEdit(wedding);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-[#D4AF37] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Chỉnh Sửa Thiệp Này Ngay
                  </button>
                )}

                <button
                  onClick={() => setHandoverModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lead Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-red-200 p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title text-lg font-bold text-neutral-900">
                    Xác Nhận Xóa Đơn Đặt Hàng
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Mã đơn: <strong>{leadToDelete.id}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isDeletingLead && setLeadToDelete(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                disabled={isDeletingLead}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Lead Details Box */}
            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 space-y-2 text-xs text-neutral-700">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Khách hàng:</span>
                <strong className="text-neutral-900 font-semibold">{leadToDelete.name}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Số điện thoại:</span>
                <span className="font-semibold text-neutral-800">{leadToDelete.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Gói / Mẫu:</span>
                <span className="font-medium text-neutral-800 uppercase">{leadToDelete.package} • {leadToDelete.template}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-medium">Trạng thái hiện tại:</span>
                <span>{leadToDelete.status}</span>
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 cursor-pointer hover:bg-neutral-100/80 transition-colors">
              <input
                type="checkbox"
                checked={deleteAssociatedWedding}
                onChange={(e) => setDeleteAssociatedWedding(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="font-semibold text-neutral-900 block">
                  Đồng thời xóa toàn bộ dữ liệu thiệp cưới đã khởi tạo (nếu có)
                </span>
                <span className="text-[11px] text-neutral-500">
                  Xóa link thiệp, album ảnh và danh sách khách mời liên quan
                </span>
              </div>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setLeadToDelete(null)}
                disabled={isDeletingLead}
                className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteLead}
                disabled={isDeletingLead}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeletingLead ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Đơn Hàng</span>
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
