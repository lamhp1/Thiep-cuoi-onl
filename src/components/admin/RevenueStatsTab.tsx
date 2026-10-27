import React, { useState, useEffect } from 'react';
import { calculatePlatformRevenueStats, RevenueStats } from '../../services/siteConfigService';
import { DollarSign, TrendingUp, ShoppingBag, CreditCard, PieChart, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function RevenueStatsTab() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculatePlatformRevenueStats().then((res) => {
      setStats(res);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-12 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Đang tổng hợp báo cáo doanh thu...</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tổng Doanh Thu</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Thực thu qua tài khoản ngân hàng</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Đơn Đã Thanh Toán</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">
            {stats.paidOrdersCount} <span className="text-sm font-normal text-neutral-400">/ {stats.totalOrdersCount} đơn</span>
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Tỷ lệ chuyển đổi chốt đơn: <strong className="text-neutral-800">{stats.conversionRate}%</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Đang Chờ Thu</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{formatCurrency(stats.pendingAmount)}</p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Các đơn mới hoặc đang chờ khách CK
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Giá Trị Đơn Trung Bình</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] text-[#B38F26] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-neutral-900 mt-2">{formatCurrency(stats.averageOrderValue)}</p>
          <p className="text-[11px] text-neutral-500 mt-1">
            AOV (Average Order Value)
          </p>
        </div>
      </div>

      {/* Package Breakdown Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="font-bold text-neutral-900 text-sm sm:text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#D4AF37]" />
              <span>Cơ Cấu Doanh Thu Theo Gói Dịch Vụ</span>
            </h3>
            <span className="text-xs text-neutral-400">Tỷ trọng % doanh thu</span>
          </div>

          <div className="space-y-4 pt-2">
            {stats.packageBreakdown.map((item) => (
              <div key={item.packageName} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800">{item.packageName}</span>
                  <div className="text-right">
                    <span className="font-bold text-neutral-900">{formatCurrency(item.revenue)}</span>
                    <span className="text-neutral-400 ml-2">({item.count} đơn • {item.percentage}%)</span>
                  </div>
                </div>
                {/* Visual progress bar */}
                <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#D4AF37] to-[#B38F26] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#D4AF37]/30 text-xs text-neutral-700 mt-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#B38F26] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Gợi ý kinh doanh:</strong> Gói <strong>Cao Cấp (Premium 499k)</strong> đang chiếm tỷ trọng doanh thu cao nhất (trên 65%). Tiếp tục tập trung quảng bá hiệu ứng mở phong bì và tính năng VietQR mừng cưới để tăng tỷ lệ chốt đơn.
            </p>
          </div>
        </div>

        {/* Payment Policy and Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-900 text-sm sm:text-base flex items-center gap-2 border-b border-neutral-100 pb-3">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Chính Sách Bán Hàng</span>
            </h3>

            <ul className="text-xs text-neutral-600 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Khách hàng chuyển khoản trực tiếp qua mã VietQR của nền tảng L'Amour.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Tư vấn viên xác nhận tiền về qua SMS/App ngân hàng, sau đó chuyển trạng thái sang <strong>"Đã thanh toán (PAID)"</strong> để kích hoạt thiệp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Cặp đôi được cấp thời hạn lưu trữ tương ứng với gói (3 tháng, 12 tháng, vĩnh viễn).</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-center">
            <span className="text-[11px] text-neutral-400">
              Số liệu cập nhật thời gian thực theo đơn hàng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
