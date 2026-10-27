import React from 'react';
import { CommercialPackage } from '../../types/commercial';
import { CheckCircle2, Sparkles, X, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface PricingPageProps {
  packages: CommercialPackage[];
  onNavigate: (path: string) => void;
}

export function PricingPage({ packages, onNavigate }: PricingPageProps) {
  const comparisonMatrix = [
    { feature: 'Thời hạn lưu trữ thiệp', basic: '3 Tháng', premium: '12 Tháng (Kỷ niệm 1 năm)', vip: '12 Tháng + Lưu trữ vĩnh viễn' },
    { feature: 'Kho giao diện mẫu thiệp', basic: '1 mẫu tự chọn', premium: 'Linh hoạt đổi 5+ mẫu', vip: 'Thiết kế độc quyền theo yêu cầu' },
    { feature: 'Số lượng ảnh Album (kỷ niệm & ngày cưới chung)', basic: '40 ảnh ban đầu', premium: '60 ảnh ban đầu', vip: '100 ảnh ban đầu' },
    { feature: 'Mua thêm số lượng ảnh tải lên', basic: 'Hỗ trợ (+25, +60, +150 ảnh)', premium: 'Hỗ trợ (+25, +60, +150 ảnh)', vip: 'Hỗ trợ (+25, +60, +150 ảnh)' },
    { feature: 'Hiệu ứng mở phong bì điện ảnh', basic: true, premium: true, vip: true },
    { feature: 'Xác nhận tham dự (RSVP)', basic: true, premium: true, vip: true },
    { feature: 'Sổ lưu bút & lời chúc trực tiếp', basic: true, premium: true, vip: true },
    { feature: 'Mã QR mừng cưới VietQR 40+ bank', basic: true, premium: true, vip: true },
    { feature: 'Nhạc nền tình ca piano du dương', basic: false, premium: true, vip: true },
    { feature: 'Đồng hồ đếm ngược ngày cưới', basic: false, premium: true, vip: true },
    { feature: 'Hiệu ứng cánh hoa rơi lãng mạn', basic: false, premium: true, vip: true },
    { feature: 'Hỗ trợ nhập nội dung & ảnh hộ', basic: false, premium: 'Cơ bản ban đầu', vip: 'Chuyên viên riêng chăm sóc 1-1' },
    { feature: 'Hỗ trợ tên miền riêng (domain)', basic: false, premium: false, vip: true },
    { feature: 'Thời gian kích hoạt sau thanh toán', basic: 'Trong 2 giờ', premium: 'Trong 2 giờ', vip: 'Ưu tiên siêu tốc 30 phút' },
  ];

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#8C7335] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B38F26]" />
            <span>Bảng Giá Niêm Yết</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1A1816]">
            Gói Dịch Vụ Thiệp Cưới Online
          </h1>

          <p className="font-body text-sm sm:text-base text-[#5E564F] leading-relaxed">
            Thanh toán một lần duy nhất, không chi phí ẩn, không quảng cáo làm phiền khách mời. Hỗ trợ kích hoạt tài khoản ngay trong ngày.
          </p>
        </div>

        {/* 3 Main Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                pkg.isPopular
                  ? 'bg-white border-2 border-[#D4AF37] shadow-xl relative scale-100 lg:-translate-y-2'
                  : 'bg-white/80 border border-[#EADFC7] shadow-xs hover:shadow-md'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 w-max max-w-[90%]">
                  <span className="px-4 py-1 rounded-full bg-linear-to-r from-[#C29D2C] to-[#E5C058] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap inline-block text-center">
                    {pkg.badge || 'Lựa chọn số 1'}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-title text-2xl font-bold text-[#1A1816]">
                    {pkg.name}
                  </h3>
                  <p className="font-body text-xs text-[#786C5E] mt-1.5 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="border-y border-[#EADFC7]/60 py-5 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif-title text-4xl font-bold text-[#B38F26]">
                      {pkg.price.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500 uppercase">
                      VNĐ / trọn gói
                    </span>
                  </div>
                  {pkg.originalPrice && (
                    <p className="text-xs text-neutral-400 line-through">
                      Giá gốc: {pkg.originalPrice.toLocaleString('vi-VN')} VNĐ
                    </p>
                  )}
                  <p className="text-xs font-medium text-[#2E7D32]">
                    Thời hạn sử dụng: {pkg.durationMonths} tháng
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-[#4A4540]">
                  {pkg.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigate(`/order?package=${pkg.slug}`)}
                  className={`w-full py-3.5 rounded-full font-body text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.isPopular
                      ? 'bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white shadow-md hover:shadow-lg'
                      : 'bg-[#FAF6EE] hover:bg-[#EADFC7] text-[#8C7335] border border-[#D4AF37]/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chọn Gói {pkg.name.split('(')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-white rounded-3xl border border-[#EADFC7] overflow-hidden shadow-xs mb-16">
          <div className="p-6 sm:p-8 bg-[#FAF6EE] border-b border-[#EADFC7]">
            <h3 className="font-serif-title text-2xl font-bold text-[#1A1816]">
              So Sánh Chi Tiết Quyền Lợi Từng Gói
            </h3>
            <p className="font-body text-xs text-[#5E564F] mt-1">
              Bảng đối chiếu minh bạch các tính năng để bạn dễ dàng lựa chọn.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#EADFC7] text-[#1A1816] font-semibold bg-[#FDFBF7]">
                  <th className="p-4 sm:p-5 w-2/5">Tính Năng / Đặc Quyền</th>
                  <th className="p-4 sm:p-5 w-1/5 text-center">Gói Basic</th>
                  <th className="p-4 sm:p-5 w-1/5 text-center bg-[#FAF6EE]/70 text-[#B38F26]">
                    Gói Premium
                  </th>
                  <th className="p-4 sm:p-5 w-1/5 text-center">Gói VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFC7]/60 text-[#4A4540]">
                {comparisonMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF6EE]/40 transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-[#1A1816]">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2E7D32] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-neutral-300 mx-auto" />
                        )
                      ) : (
                        <span>{row.basic}</span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center bg-[#FAF6EE]/30 font-medium">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2E7D32] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-neutral-300 mx-auto" />
                        )
                      ) : (
                        <span>{row.premium}</span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-center font-medium">
                      {typeof row.vip === 'boolean' ? (
                        row.vip ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2E7D32] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-neutral-300 mx-auto" />
                        )
                      ) : (
                        <span>{row.vip}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Addons / Upsell Section */}
        <div className="bg-[#FAF6EE] rounded-3xl border border-[#EADFC7] p-8 sm:p-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1A1816]">
              Dịch Vụ Mở Rộng & Bán Kèm (Add-ons)
            </h3>
            <p className="font-body text-xs text-[#5E564F]">
              Bạn có thể mua thêm bất kỳ lúc nào để nâng tầm trải nghiệm ngày cưới.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#EADFC7] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38F26]">
                Gia Hạn Lưu Trữ
              </span>
              <h4 className="font-serif-title text-lg font-bold text-[#1A1816]">
                Gia Hạn Thêm 6 - 12 Tháng
              </h4>
              <p className="font-body text-xs text-[#5E564F]">
                Chỉ từ <strong>99.000 VNĐ</strong> để tiếp tục lưu giữ kỷ niệm kỷ niệm ngày cưới sau này.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EADFC7] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38F26]">
                Chuyên Viên Hỗ Trợ
              </span>
              <h4 className="font-serif-title text-lg font-bold text-[#1A1816]">
                Nhập Liệu & Chỉnh Ảnh Hộ
              </h4>
              <p className="font-body text-xs text-[#5E564F]">
                Chỉ từ <strong>150.000 VNĐ</strong>, chuyên viên Admin sẽ giúp bạn tải ảnh, định dạng lời mời chỉn chu từ A-Z.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EADFC7] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B38F26]">
                Thương Hiệu Riêng
              </span>
              <h4 className="font-serif-title text-lg font-bold text-[#1A1816]">
                Tên Miền Riêng .com/.vn
              </h4>
              <p className="font-body text-xs text-[#5E564F]">
                Sở hữu tên miền chính chủ (vd: <i>minhanhwedding.com</i>) gắn trực tiếp vào thiệp cưới của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
