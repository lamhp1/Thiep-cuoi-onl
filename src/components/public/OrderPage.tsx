import React, { useState, useEffect } from 'react';
import { CommercialPackage, CommercialTemplate } from '../../types/commercial';
import {
  TEMPLATES,
  getPlanTierLevel,
  getPlanTierName,
  getTemplateRequiredPlan,
} from '../../data/templates';
import { TemplateId } from '../../types';
import { submitLead, updateLeadStatus } from '../../services/leadService';
import { getPlatformPaymentConfig, createOrActivateWeddingFromLead, getSiteContentConfig } from '../../services/siteConfigService';
import {
  Sparkles,
  Heart,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  User,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Clock,
  QrCode,
  Copy,
  Check,
  CreditCard,
  Building,
  Lock,
  Search,
} from 'lucide-react';

interface OrderPageProps {
  packages: CommercialPackage[];
  templates: CommercialTemplate[];
  initialTemplate?: string;
  initialPackage?: string;
  onNavigate: (path: string) => void;
}

export function OrderPage({
  packages,
  templates,
  initialTemplate,
  initialPackage,
  onNavigate,
}: OrderPageProps) {
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Helper to determine the package that can use a template
  const getPackageForTemplate = (templateSlug: string): string => {
    const reqTier = getTemplateRequiredPlan(templateSlug, templates);
    const matched = packages.find(
      (p) => p.slug === reqTier || p.id === `pkg-${reqTier}`
    );
    if (matched) return matched.slug;
    const tierLevel = getPlanTierLevel(reqTier);
    const candidate = packages.find((p) => getPlanTierLevel(p.slug) >= tierLevel);
    return candidate?.slug || packages[0]?.slug || 'basic';
  };

  const initialTplSlug = (() => {
    if (initialTemplate) {
      const match = templates.find((t) => (t.slug === initialTemplate || t.id === initialTemplate) && t.active !== false);
      if (match) return match.slug;
    }
    const firstActive = templates.find((t) => t.active !== false);
    return firstActive?.slug || (templates[0] ? templates[0].slug : 'traditional-vietnamese');
  })();
  const [selectedTemplate, setSelectedTemplate] = useState(initialTplSlug);
  const [selectedPackage, setSelectedPackage] = useState(() => {
    if (initialPackage) return initialPackage;
    return getPackageForTemplate(initialTplSlug);
  });
  const [autoSwitchedNotice, setAutoSwitchedNotice] = useState<{
    packageName: string;
    templateName: string;
  } | null>(null);

  const [weddingDate, setWeddingDate] = useState('');
  const [note, setNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hasMarkedPaid, setHasMarkedPaid] = useState(false);

  const paymentConfig = getPlatformPaymentConfig();

  // Sync initial query params if they change
  useEffect(() => {
    if (initialTemplate) {
      const target = templates.find(
        (t) => (t.slug === initialTemplate || t.id === initialTemplate) && t.active !== false
      );
      if (target) {
        setSelectedTemplate(target.slug);
        if (!initialPackage) {
          const autoPkg = getPackageForTemplate(target.slug);
          setSelectedPackage(autoPkg);
          const pkgObj = packages.find((p) => p.slug === autoPkg);
          if (pkgObj) {
            setAutoSwitchedNotice({
              packageName: pkgObj.name,
              templateName: target.name || target.slug,
            });
          }
        }
      } else {
        const firstActive = templates.find((t) => t.active !== false);
        if (firstActive) {
          setSelectedTemplate(firstActive.slug);
          if (!initialPackage) {
            setSelectedPackage(getPackageForTemplate(firstActive.slug));
          }
        }
      }
    }
    if (initialPackage) {
      setSelectedPackage(initialPackage);
    }
  }, [initialTemplate, initialPackage, packages, templates]);

  // Handle template selection (via card click or dropdown)
  const handleSelectTemplate = (templateSlug: string) => {
    setSelectedTemplate(templateSlug);
    const neededPkgSlug = getPackageForTemplate(templateSlug);
    const targetPkg = packages.find((p) => p.slug === neededPkgSlug);
    const tmplTheme = TEMPLATES[templateSlug as TemplateId];
    const commercialTpl = templates.find((t) => t.slug === templateSlug || t.id === templateSlug);
    const tplDisplayName = commercialTpl?.name || tmplTheme?.name || templateSlug;

    // Automatically switch package selection to the package that supports this template
    setSelectedPackage(neededPkgSlug);
    if (targetPkg) {
      setAutoSwitchedNotice({
        packageName: targetPkg.name,
        templateName: tplDisplayName,
      });
    }
  };

  // Handle manual package change
  const handleSelectPackage = (packageSlug: string) => {
    const selectedPkgLevel = getPlanTierLevel(packageSlug);
    const requiredPlanTier = getTemplateRequiredPlan(selectedTemplate, templates);
    const requiredLevel = getPlanTierLevel(requiredPlanTier);

    // If package cannot use current template, auto-switch to a compatible template
    if (selectedPkgLevel < requiredLevel) {
      const compatibleTpl = templates.find(
        (t) => getPlanTierLevel(getTemplateRequiredPlan(t.slug, templates)) <= selectedPkgLevel
      );
      if (compatibleTpl) {
        setSelectedTemplate(compatibleTpl.slug);
        setSelectedPackage(packageSlug);
        const pkgObj = packages.find((p) => p.slug === packageSlug);
        setAutoSwitchedNotice({
          packageName: pkgObj?.name || packageSlug,
          templateName: compatibleTpl.name,
        });
        return;
      }
    }

    setSelectedPackage(packageSlug);
    setAutoSwitchedNotice(null);
  };

  const activePkg = packages.find((p) => p.slug === selectedPackage) || packages[0];
  const activeTpl = templates.find((t) => t.slug === selectedTemplate) || templates[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!groomName.trim() || !brideName.trim()) {
      setErrorMsg('Vui lòng nhập họ tên chú rể và cô dâu.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Vui lòng cung cấp số điện thoại / Zalo để Admin liên hệ.');
      return;
    }

    try {
      setIsSubmitting(true);
      const lead = await submitLead({
        groomName: groomName.trim(),
        brideName: brideName.trim(),
        name: `${groomName.trim()} & ${brideName.trim()}`,
        phone: phone.trim(),
        email: email.trim(),
        template: selectedTemplate,
        package: selectedPackage,
        weddingDate,
        note: note.trim(),
      });

      try {
        createOrActivateWeddingFromLead(lead);
      } catch (initErr) {
        console.warn('Initial wedding creation for lead error:', initErr);
      }

      setSubmittedLeadId(lead.id);
    } catch (err: any) {
      console.error('Error submitting order request:', err);
      const siteConfig = getSiteContentConfig();
      setErrorMsg(`Có lỗi xảy ra khi gửi yêu cầu. Vui lòng liên hệ hotline ${siteConfig.hotline || '0905 123 456'}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#8C7335] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B38F26]" />
            <span>Gửi Yêu Cầu Đặt Thiệp Cưới</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1A1816]">
            Đăng Ký Đặt Thiệp Cưới Online
          </h1>

          <p className="font-body text-xs sm:text-sm text-[#5E564F] leading-relaxed">
            Điền thông tin bên dưới. Admin sẽ liên hệ tư vấn chi tiết, tạo đơn hàng và hướng dẫn thanh toán qua VietQR để kích hoạt thiệp ngay trong ngày.
          </p>
        </div>

        {/* Success State Modal / Screen */}
        {submittedLeadId ? (
          <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto space-y-8 animate-fadeIn">
            {/* Header with success badge */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="inline-block text-[11px] font-mono font-bold text-[#8C7335] uppercase bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#D4AF37]/40">
                ĐƠN HÀNG ĐÃ ĐƯỢC TIẾP NHẬN • MÃ ĐƠN: {submittedLeadId}
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1A1816]">
                Chúc Mừng {groomName} & {brideName}!
              </h2>
              <p className="font-body text-xs sm:text-sm text-[#5E564F] max-w-xl mx-auto leading-relaxed">
                Đơn đặt thiệp cưới đã được ghi nhận vào hệ thống L'Amour. Quý khách vui lòng quét mã VietQR bên dưới để chuyển khoản kích hoạt thiệp.
              </p>
            </div>

            {/* 4-Step Process Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pb-2">
              {[
                { step: '1', title: 'Gửi Thông Tin', status: 'done', label: 'Hoàn thành' },
                { step: '2', title: 'Thanh Toán VietQR', status: 'current', label: 'Bước hiện tại' },
                { step: '3', title: 'Admin Kích Hoạt', status: 'pending', label: '15 - 30 phút' },
                { step: '4', title: 'Nhận & Chia Sẻ Link', status: 'pending', label: 'Sẵn sàng' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    item.status === 'done'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : item.status === 'current'
                      ? 'bg-[#FAF6EE] border-[#D4AF37] text-[#8C7335] shadow-xs'
                      : 'bg-neutral-50 border-neutral-100 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        item.status === 'done'
                          ? 'bg-emerald-600 text-white'
                          : item.status === 'current'
                          ? 'bg-[#D4AF37] text-white'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {item.status === 'done' ? '✓' : item.step}
                    </span>
                    <span className="text-xs font-bold truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] opacity-80 block">{item.label}</span>
                </div>
              ))}
            </div>

            {/* VietQR Payment Card */}
            <div className="bg-linear-to-br from-[#FAF6EE] to-white rounded-2xl border border-[#EADFC7] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EADFC7]/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#B38F26]" />
                  <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                    Quét Mã VietQR Chuyển Khoản Tự Động
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#B38F26] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full">
                  Xử lý ưu tiên
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* QR Code Image */}
                <div className="md:col-span-5 flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
                  {(() => {
                    const qrSrc =
                      paymentConfig.useCustomQr && paymentConfig.customQrUrl
                        ? paymentConfig.customQrUrl
                        : `https://api.vietqr.io/image/${paymentConfig.bankCode}-${paymentConfig.accountNumber}-${
                            paymentConfig.qrTemplate || 'compact2'
                          }.jpg?accountName=${encodeURIComponent(paymentConfig.accountHolder)}&amount=${
                            activePkg.price
                          }&addInfo=${encodeURIComponent(`${submittedLeadId} ${phone.replace(/\D/g, '')}`)}`;
                    return (
                      <img
                        src={qrSrc}
                        alt="QR Chuyển Khoản Thanh Toán"
                        className="w-48 h-auto max-w-full rounded-lg object-contain"
                        onError={(e) => {
                          // Fallback placeholder if image fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    );
                  })()}
                  <span className="text-[11px] text-neutral-500 mt-2 text-center">
                    Mở ứng dụng Ngân hàng hoặc MoMo để quét mã
                  </span>
                </div>

                {/* Transfer Info Details */}
                <div className="md:col-span-7 space-y-3 text-xs">
                  {/* Bank Name */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-neutral-400" />
                      Ngân hàng:
                    </span>
                    <span className="font-bold text-neutral-900">
                      {paymentConfig.bankName} ({paymentConfig.bankCode})
                    </span>
                  </div>

                  {/* Account Number with Copy */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                      Số tài khoản:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900 text-sm">
                        {paymentConfig.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(paymentConfig.accountNumber);
                          setCopiedField('account');
                          setTimeout(() => setCopiedField(null), 2000);
                        }}
                        className="p-1 rounded-md bg-neutral-100 hover:bg-[#D4AF37] hover:text-white transition-colors cursor-pointer"
                        title="Sao chép số tài khoản"
                      >
                        {copiedField === 'account' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Holder */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                    <span className="text-neutral-500">Chủ tài khoản:</span>
                    <span className="font-bold text-neutral-900 uppercase">
                      {paymentConfig.accountHolder}
                    </span>
                  </div>

                  {/* Amount with Copy */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                    <span className="text-neutral-500">Số tiền thanh toán:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#B38F26] text-sm">
                        {activePkg.price.toLocaleString('vi-VN')} VNĐ
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(String(activePkg.price));
                          setCopiedField('price');
                          setTimeout(() => setCopiedField(null), 2000);
                        }}
                        className="p-1 rounded-md bg-neutral-100 hover:bg-[#D4AF37] hover:text-white transition-colors cursor-pointer"
                        title="Sao chép số tiền"
                      >
                        {copiedField === 'price' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Transfer Note with Copy */}
                  <div className="flex items-center justify-between bg-[#FAF6EE] p-2.5 rounded-xl border border-[#D4AF37]/40">
                    <span className="text-[#8C7335] font-semibold">Nội dung chuyển khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900 text-xs sm:text-sm">
                        {submittedLeadId} {phone.replace(/\D/g, '')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const noteText = `${submittedLeadId} ${phone.replace(/\D/g, '')}`;
                          navigator.clipboard.writeText(noteText);
                          setCopiedField('note');
                          setTimeout(() => setCopiedField(null), 2000);
                        }}
                        className="p-1 rounded-md bg-white hover:bg-[#D4AF37] hover:text-white transition-colors cursor-pointer shadow-2xs"
                        title="Sao chép nội dung chuyển khoản"
                      >
                        {copiedField === 'note' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm payment button */}
              <div className="mt-4 pt-4 border-t border-[#EADFC7]/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-neutral-500">
                  {hasMarkedPaid
                    ? '✓ Đã ghi nhận chuyển khoản! Quản trị viên đang kích hoạt thiệp cưới.'
                    : 'Sau khi chuyển khoản trên App ngân hàng, nhấn nút bên cạnh để hoàn tất:'}
                </span>

                <button
                  type="button"
                  disabled={hasMarkedPaid}
                  onClick={async () => {
                    if (submittedLeadId) {
                      await updateLeadStatus(submittedLeadId, 'WAITING_PAYMENT');
                      setHasMarkedPaid(true);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    hasMarkedPaid
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:scale-105 active:scale-95'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{hasMarkedPaid ? 'Đã Báo Chuyển Khoản' : 'Tôi Đã Chuyển Khoản Xong'}</span>
                </button>
              </div>
            </div>

            {/* Pending Admin Approval Card */}
            <div className="bg-[#FAF6EE] rounded-2xl p-5 sm:p-6 border border-[#D4AF37]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-left shadow-xs">
              <div className="space-y-1.5 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>ĐANG CHỜ ADMIN XÁC NHẬN & PHÊ DUYỆT</span>
                </div>
                <h4 className="font-serif-title font-bold text-neutral-900 text-base sm:text-lg">
                  Đơn Hàng Đang Chờ Quản Trị Viên Duyệt Thanh Toán
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
                  Sau khi hai bạn hoàn tất chuyển khoản, Admin sẽ kiểm tra và kích hoạt đơn hàng trong vòng <strong>5 - 15 phút</strong>. Sau khi được duyệt, quyền truy cập <strong>Cổng Quản Trị Cặp Đôi</strong> sẽ được tự động mở để hai bạn bắt đầu chỉnh sửa thiệp cưới và tải ảnh.
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs text-neutral-500 flex-wrap">
                  <span>Mã đơn: <strong className="font-mono text-neutral-800">{submittedLeadId}</strong></span>
                  <span>•</span>
                  <span>SĐT đăng ký: <strong className="text-neutral-800">{phone}</strong></span>
                  <span>•</span>
                  <span className="text-amber-700 font-medium">Chưa thể chỉnh sửa khi Admin chưa duyệt</span>
                </div>
              </div>

              {/* Status / Tracking Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate(`/lookup?code=${submittedLeadId}`)}
                  className="px-5 py-3 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#B38F26] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-body text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Theo Dõi Tiến Độ Đơn Hàng</span>
                </button>

                <div
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-500 font-body text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed text-center"
                  title="Tính năng chỉnh sửa thiệp cưới sẽ được mở khóa sau khi Admin duyệt đơn"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Chờ Duyệt Để Mở Cổng Chỉnh Sửa</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate(`/lookup?code=${submittedLeadId}`)}
                className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tra Cứu Tiến Độ Đơn Hàng
              </button>

              <button
                onClick={() => onNavigate('/')}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-600 text-xs font-medium border border-neutral-300 transition-colors cursor-pointer"
              >
                Về Trang Chủ L'Amour
              </button>
            </div>
          </div>
        ) : (
          /* Form Container */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Col: Order Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 bg-white rounded-3xl border border-[#EADFC7] p-6 sm:p-8 shadow-xs space-y-6"
            >
              <h2 className="font-serif-title text-2xl font-bold text-[#1A1816] border-b border-[#EADFC7]/60 pb-3">
                Thông Tin Đặt Hàng & Liên Hệ
              </h2>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Groom & Bride Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Họ tên Chú Rể *</span>
                  </label>
                  <input
                    id="order-input-groom"
                    type="text"
                    required
                    placeholder="VD: Nguyễn Minh Anh"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EADFC7] bg-[#FDFBF7] text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Họ tên Cô Dâu *</span>
                  </label>
                  <input
                    id="order-input-bride"
                    type="text"
                    required
                    placeholder="VD: Trần Ngọc Mai"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EADFC7] bg-[#FDFBF7] text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Contact Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Số điện thoại / Zalo *</span>
                  </label>
                  <input
                    id="order-input-phone"
                    type="tel"
                    required
                    placeholder="VD: 0905 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EADFC7] bg-[#FDFBF7] text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Email (nhận tài khoản)</span>
                  </label>
                  <input
                    id="order-input-email"
                    type="email"
                    placeholder="VD: minhanh@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#EADFC7] bg-[#FDFBF7] text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Template & Package Selection */}
              <div className="space-y-4 pt-1">
                {/* Visual Clickable Template Picker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Bấm Vào Chọn Mẫu Thiệp</span>
                    </label>
                    <span className="text-[11px] text-[#8C7335] font-medium hidden sm:inline">
                      (Ô chọn gói sẽ tự động chuyển theo mẫu)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {templates
                      .filter((tpl) => tpl.active !== false)
                      .map((tpl, idx) => {
                        const isSelected = selectedTemplate === tpl.slug;
                        const reqPlan = getTemplateRequiredPlan(tpl.slug, templates);
                        const planName = getPlanTierName(reqPlan);
                        return (
                          <button
                            key={`${tpl.id || tpl.slug}-${idx}`}
                            type="button"
                            onClick={() => handleSelectTemplate(tpl.slug)}
                            className={`group text-left p-2 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#FAF6EE] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-xs'
                                : 'bg-white border-[#EADFC7]/80 hover:border-[#D4AF37]/60 hover:bg-[#FAF6EE]/40'
                            }`}
                          >
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-1.5 bg-neutral-100">
                              <img
                                src={tpl.previewImage}
                                alt={tpl.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <span
                                className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                                  reqPlan === 'vip'
                                    ? 'bg-amber-900/90 text-amber-200 border border-amber-500/40'
                                    : reqPlan === 'premium'
                                    ? 'bg-[#181615]/85 text-[#D4AF37] border border-[#D4AF37]/30'
                                    : 'bg-emerald-800/85 text-emerald-100 border border-emerald-400/30'
                                }`}
                              >
                                {reqPlan === 'vip' ? 'Gói VIP' : reqPlan === 'premium' ? 'Gói Premium' : 'Gói Basic'}
                              </span>
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#D4AF37]/15 flex items-center justify-center">
                                  <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-md">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-serif-title text-xs font-bold text-[#1A1816] line-clamp-1">
                                {tpl.name}
                              </p>
                              <p className="text-[10px] text-[#8C7335] line-clamp-1">
                                Thuộc gói: {reqPlan === 'vip' ? 'Gói VIP' : reqPlan === 'premium' ? 'Gói Premium' : 'Gói Basic'}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Dropdown Selects for Template & Package */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Danh Sách Mẫu Thiệp</span>
                    </label>
                    <select
                      id="order-select-template"
                      value={selectedTemplate}
                      onChange={(e) => handleSelectTemplate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#EADFC7] bg-[#FDFBF7] text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                    >
                      {templates
                        .filter((tpl) => tpl.active !== false)
                        .map((tpl, idx) => {
                          const reqPlan = getTemplateRequiredPlan(tpl.slug, templates);
                          const pkgBadge = reqPlan === 'vip' ? 'Gói VIP' : reqPlan === 'premium' ? 'Gói Premium' : 'Gói Basic';
                          return (
                            <option key={`${tpl.id || tpl.slug}-${idx}`} value={tpl.slug}>
                              {tpl.name} — ({pkgBadge})
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Ô Chọn Gói Dịch Vụ</span>
                    </label>
                    <select
                      id="order-select-package"
                      value={selectedPackage}
                      onChange={(e) => handleSelectPackage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#EADFC7] bg-[#FDFBF7] text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                    >
                      {packages.map((pkg) => {
                        const reqPlan = getTemplateRequiredPlan(selectedTemplate, templates);
                        const isRecommended = pkg.slug === reqPlan || pkg.id === `pkg-${reqPlan}`;
                        return (
                          <option key={pkg.id} value={pkg.slug}>
                            {pkg.name} - {pkg.price.toLocaleString('vi-VN')} đ {isRecommended ? '★ (Khớp với mẫu đã chọn)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Auto Switch Feedback Badge */}
                {autoSwitchedNotice && (
                  <div
                    id="auto-switched-package-notice"
                    className="p-3 rounded-xl bg-[#FAF6EE] border border-[#D4AF37]/60 text-xs text-[#8C7335] flex items-center justify-between gap-2 shadow-2xs animate-fadeIn"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B38F26] shrink-0" />
                      <span>
                        Ô chọn gói dịch vụ đã tự động chuyển sang <strong>{autoSwitchedNotice.packageName}</strong> để tương thích với <strong>{autoSwitchedNotice.templateName}</strong>.
                      </span>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-white">
                      Tự động khớp gói
                    </span>
                  </div>
                )}
              </div>

              {/* Wedding Date & Note */}
              <div className="space-y-1.5">
                <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Ngày cưới dự kiến (không bắt buộc)</span>
                </label>
                <input
                  id="order-input-wedding-date"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EADFC7] bg-[#FDFBF7] text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-body text-xs font-semibold text-[#1A1816] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Yêu cầu thêm / Ghi chú cho Admin</span>
                </label>
                <textarea
                  id="order-input-note"
                  rows={3}
                  placeholder="VD: Cần hỗ trợ tải ảnh mẫu trước, đổi bài nhạc nền đám cưới..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EADFC7] bg-[#FDFBF7] text-sm focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  id="order-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-body text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang gửi yêu cầu...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Gửi Yêu Cầu Đặt Thiệp</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-neutral-500">
                Cam kết bảo mật thông tin 100%. Không gửi tin nhắn rác.
              </p>
            </form>

            {/* Right Col: Summary Panel */}
            <div className="lg:col-span-5 space-y-6">
              {/* Selected Package Card Summary */}
              <div className="bg-white rounded-3xl border border-[#EADFC7] p-6 shadow-xs space-y-4">
                <span className="font-body text-[11px] uppercase tracking-wider text-[#B38F26] font-bold block">
                  Tóm Tắt Đơn Hàng Dự Kiến
                </span>

                <div className="space-y-1">
                  <h3 className="font-serif-title text-2xl font-bold text-[#1A1816]">
                    {activePkg?.name}
                  </h3>
                  <p className="font-body text-xs text-[#786C5E]">
                    {activePkg?.description}
                  </p>
                </div>

                <div className="py-4 border-y border-[#EADFC7]/60 flex items-baseline justify-between">
                  <span className="text-xs text-neutral-500">Tổng thanh toán:</span>
                  <span className="font-serif-title text-3xl font-bold text-[#B38F26]">
                    {activePkg?.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Template Selected Preview */}
                {activeTpl && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF6EE] border border-[#EADFC7]">
                    <img
                      src={activeTpl.previewImage}
                      alt={activeTpl.name}
                      className="w-14 h-14 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-serif-title font-bold text-sm text-[#1A1816]">
                        {activeTpl.name}
                      </p>
                      <p className="font-body text-[11px] text-neutral-500">
                        Phong cách: {activeTpl.style}
                      </p>
                    </div>
                  </div>
                )}

                {/* Feature checklist */}
                <div className="space-y-2 pt-2 text-xs text-[#4A4540]">
                  <p className="font-bold text-neutral-800">Quyền lợi kèm theo:</p>
                  {activePkg?.features.slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Admin Quick Assistance */}
              <div className="bg-[#181615] rounded-3xl p-6 text-white space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  Cần Tư Vấn Gấp?
                </span>
                <h4 className="font-serif-title text-xl font-bold text-[#F5F2EB]">
                  Trò Chuyện Trực Tiếp Với Admin
                </h4>
                <p className="font-body text-xs text-[#A8A199] leading-relaxed">
                  Nếu bạn cần tổ chức cưới gấp trong tuần, hãy liên hệ Hotline để được hỗ trợ kích hoạt thiệp ngay lập tức:
                </p>
                <div className="pt-2">
                  {(() => {
                    const cfg = getSiteContentConfig();
                    const phone = cfg.hotline || '0905 123 456';
                    const clean = phone.replace(/\s+/g, '');
                    return (
                      <a
                        href={`tel:${clean}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B38F26] text-[#181615] font-body text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{phone} (Zalo 24/7)</span>
                      </a>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
