import React, { useState } from 'react';
import { RSVPGuest } from '../../types';
import { Download, Search, Trash2, CheckCircle, XCircle, Phone, Users } from 'lucide-react';
import { deleteRSVP } from '../../services/rsvpService';
import { useToast } from '../ui/Toast';

interface RSVPTabProps {
  weddingId: string;
  rsvps: RSVPGuest[];
  onRefresh: () => void;
}

export function RSVPTab({ weddingId, rsvps, onRefresh }: RSVPTabProps) {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'declined'>('all');

  const filtered = rsvps.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm);

    if (filterStatus === 'attending') return matchesSearch && item.attending;
    if (filterStatus === 'declined') return matchesSearch && !item.attending;
    return matchesSearch;
  });

  const handleExportCSV = () => {
    if (rsvps.length === 0) {
      showToast('Chưa có dữ liệu khách mời để xuất file', 'error');
      return;
    }

    // CSV header and rows with UTF-8 BOM for Microsoft Excel Vietnamese compatibility
    const headers = ['Họ và tên', 'Số điện thoại', 'Trạng thái', 'Số người', 'Khách của', 'Lời nhắn', 'Thời gian gửi'];
    const rows = rsvps.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      r.attending ? 'Tham dự' : 'Không tham dự',
      r.guestsCount || 0,
      r.guestOf === 'groom' ? 'Nhà trai' : r.guestOf === 'bride' ? 'Nhà gái' : 'Cả hai',
      `"${(r.message || '').replace(/"/g, '""')}"`,
      new Date(r.createdAt).toLocaleString('vi-VN'),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rsvp-wedding-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã tải xuống file CSV danh sách khách mời', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa phản hồi RSVP này?')) return;
    try {
      await deleteRSVP(weddingId, id);
      showToast('Đã xóa khách mời', 'info');
      onRefresh();
    } catch {
      showToast('Lỗi khi xóa phản hồi', 'error');
    }
  };

  return (
    <div className="space-y-6 font-body">
      {/* Controls Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hoặc số điện thoại..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm outline-none focus:border-[#D4AF37] bg-white"
          >
            <option value="all">Tất cả ({rsvps.length})</option>
            <option value="attending">Chắc chắn đến ({rsvps.filter((r) => r.attending).length})</option>
            <option value="declined">Không thể đến ({rsvps.filter((r) => !r.attending).length})</option>
          </select>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium shadow-sm transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Xuất danh sách Excel / CSV</span>
        </button>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-neutral-700">
            <thead className="bg-neutral-50 text-neutral-500 uppercase text-[11px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Khách Mời</th>
                <th className="px-6 py-3.5 font-semibold">Liên Hệ</th>
                <th className="px-6 py-3.5 font-semibold">Trạng Thái</th>
                <th className="px-6 py-3.5 font-semibold">Số Người</th>
                <th className="px-6 py-3.5 font-semibold">Khách Của</th>
                <th className="px-6 py-3.5 font-semibold">Lời Nhắn</th>
                <th className="px-6 py-3.5 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-body">
              {filtered.map((guest) => (
                <tr key={guest.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {guest.fullName}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    <a
                      href={`tel:${guest.phone}`}
                      className="inline-flex items-center gap-1 hover:text-[#D4AF37]"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{guest.phone}</span>
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {guest.attending ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Tham dự
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        <XCircle className="w-3.5 h-3.5 text-rose-500" /> Bận
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-800">
                    {guest.attending ? `${guest.guestsCount} người` : '0'}
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs">
                    {guest.guestOf === 'groom'
                      ? 'Nhà trai'
                      : guest.guestOf === 'bride'
                      ? 'Nhà gái'
                      : 'Cả hai'}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 max-w-xs truncate italic">
                    {guest.message || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(guest.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa khách này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-neutral-400 font-body">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Không tìm thấy khách mời nào phù hợp.</p>
          </div>
        )}
      </div>
    </div>
  );
}
