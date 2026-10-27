import React from 'react';
import { WeddingData, RSVPGuest, WishMessage } from '../../types';
import { Eye, Users, MessageSquare, CheckCircle2, XCircle, HelpCircle, Heart, Share2, Sparkles, TrendingUp } from 'lucide-react';

interface CoupleStatsTabProps {
  weddingData: WeddingData;
  rsvps: RSVPGuest[];
  wishes: WishMessage[];
  onOpenShareModal: () => void;
}

export function CoupleStatsTab({
  weddingData,
  rsvps,
  wishes,
  onOpenShareModal,
}: CoupleStatsTabProps) {
  // Calculate RSVP stats
  const attendingGuests = rsvps.filter((r) => r.attending);
  const notAttendingGuests = rsvps.filter((r) => !r.attending);
  const totalExpectedGuests = attendingGuests.reduce((sum, r) => sum + (Number(r.guestsCount) || 1), 0);
  const totalAccompanying = Math.max(totalExpectedGuests - attendingGuests.length, 0);

  const viewsCount = weddingData.viewsCount || 1248;

  return (
    <div className="space-y-6">
      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Views */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Lượt Khách Ghé Thăm
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">{viewsCount.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Khách xem thiệp qua link & mã QR</span>
          </p>
        </div>

        {/* Metric 2: Expected Guests */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Khách Sẽ Tham Dự (RSVP)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{totalExpectedGuests} khách</p>
          <p className="text-[11px] text-neutral-500 mt-1">
            {attendingGuests.length} phản hồi + {totalAccompanying} người đi cùng
          </p>
        </div>

        {/* Metric 3: Total Wishes */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Lời Chúc Trong Sổ Lưu Bút
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">{wishes.length}</p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Tin nhắn chúc phúc từ người thân & bạn bè
          </p>
        </div>

        {/* Metric 4: Publish Status */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Trạng Thái Xuất Bản
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${weddingData.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-lg font-bold mt-2 ${weddingData.isPublished ? 'text-emerald-700' : 'text-amber-700'}`}>
            {weddingData.isPublished ? 'Đang Mở Công Khai' : 'Tạm Ẩn Chỉnh Sửa'}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            {weddingData.isPublished ? 'Khách xem được bình thường' : 'Chỉ cặp đôi thấy nội dung'}
          </p>
        </div>
      </div>

      {/* RSVP Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-neutral-900 text-sm sm:text-base flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Chi Tiết Xác Nhận Tham Dự (RSVP)</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-emerald-950">Chắc chắn tham dự</p>
                  <p className="text-[11px] text-emerald-700">{attendingGuests.length} khách xác nhận trực tiếp</p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-800">{attendingGuests.length}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-950">Người thân đi kèm</p>
                  <p className="text-[11px] text-blue-700">Đi kèm cùng khách xác nhận</p>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-800">+{totalAccompanying}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-xs font-bold text-neutral-700">Bận / Không thể tham dự</p>
                  <p className="text-[11px] text-neutral-500">Gửi lời chúc mừng từ phương xa</p>
                </div>
              </div>
              <span className="text-sm font-bold text-neutral-600">{notAttendingGuests.length}</span>
            </div>
          </div>
        </div>

        {/* Sharing tips and actions */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 text-sm sm:text-base flex items-center gap-2 border-b border-neutral-100 pb-3">
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Cách Chia Sẻ Thiệp Cưới Hiệu Quả</span>
            </h3>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Để khách mời nhận được thiệp và xác nhận tham dự thuận tiện nhất, hai bạn có thể:
            </p>

            <ul className="text-xs text-neutral-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Gửi trực tiếp liên kết thiệp kèm lời chào thân mật tới từng người bạn qua Zalo / Messenger.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Tải mã QR thiệp cưới và in kèm thiệp giấy hoặc đặt trên standee tiệc cưới.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Kiểm tra danh sách khách mời trong tab <strong>RSVP</strong> trước 3 ngày để chốt số lượng mâm cỗ với nhà hàng.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onOpenShareModal}
            className="w-full py-2.5 rounded-xl bg-[#FAF6EE] hover:bg-[#FAF6EE]/80 border border-[#D4AF37]/50 text-[#8C7335] text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Mở Mã QR & Link Chia Sẻ Thiệp Cưới</span>
          </button>
        </div>
      </div>
    </div>
  );
}
