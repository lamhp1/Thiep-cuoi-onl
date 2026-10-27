import React, { useState, useEffect } from 'react';
import { TemplateId } from '../../types';
import { DEMO_WEDDING } from '../../data/demoWedding';
import { TEMPLATES, getTemplateRequiredPlan } from '../../data/templates';
import { WeddingPage } from '../wedding/WeddingPage';
import { Sparkles, ArrowLeft, X, MailOpen, Eye, AlertCircle } from 'lucide-react';
import { getCommercialTemplatesSync } from '../../services/templateService';

interface DemoTemplatePageProps {
  templateSlug: string;
  onNavigate: (path: string) => void;
}

export function DemoTemplatePage({ templateSlug, onNavigate }: DemoTemplatePageProps) {
  const cleanSlug = templateSlug ? templateSlug.replace(/^tpl-/, '') : '';
  const validTemplateId = (TEMPLATES[templateSlug as TemplateId]
    ? templateSlug
    : TEMPLATES[cleanSlug as TemplateId]
    ? cleanSlug
    : 'traditional-vietnamese') as TemplateId;

  const currentTheme = TEMPLATES[validTemplateId];

  const commercialTemplates = getCommercialTemplatesSync();
  const matchedTpl = commercialTemplates.find(
    (t) =>
      t.slug === validTemplateId ||
      t.slug === templateSlug ||
      t.slug === cleanSlug ||
      t.id === templateSlug ||
      t.demoSlug === templateSlug
  );
  const isInactive = matchedTpl ? matchedTpl.active === false : false;

  // Envelope state for demo mode - defaults to true so guests experience the opening envelope
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [envelopeKey, setEnvelopeKey] = useState(1);

  // Clone demo data so we never use customer data
  const demoData = {
    ...DEMO_WEDDING,
    template: validTemplateId,
  };

  // Support ESC key to exit demo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onNavigate('/templates');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  const handleReopenEnvelope = () => {
    setShowEnvelope(true);
    setEnvelopeKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen">
      {/* Top Floating Demo Toolbar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[96%] max-w-4xl bg-[#181615]/95 backdrop-blur-md text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/50 shadow-2xl flex items-center justify-between gap-2 animate-fadeIn">
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            onClick={() => onNavigate('/templates')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6EE] text-xs font-semibold transition-colors cursor-pointer shrink-0"
            title="Quay lại danh sách mẫu thiệp (ESC)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Thoát xem thử</span>
            <span className="sm:hidden">Thoát</span>
          </button>
          <div className="text-left truncate hidden md:block">
            <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider block">
              Bản Xem Thử Mẫu
            </span>
            <span className="font-serif-title text-xs sm:text-sm font-bold truncate block">
              {currentTheme?.name || templateSlug}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Button to Replay / View Envelope Opening Ceremony */}
          <button
            id="demo-reopen-envelope-btn"
            onClick={handleReopenEnvelope}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 text-[#F3E5AB] border border-[#D4AF37]/50 text-xs font-semibold transition-colors cursor-pointer"
            title="Xem lại trang bì thư mở thiệp cưới"
          >
            <MailOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Xem trang mở thiệp</span>
          </button>

          {showEnvelope && (
            <button
              onClick={() => setShowEnvelope(false)}
              className="hidden lg:inline-flex items-center gap-1 text-xs text-[#E5DFD7] hover:text-white px-2.5 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Bỏ qua trang bì thư, xem ngay nội dung chi tiết thiệp"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>Xem nội dung thiệp</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('/templates')}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-[#E5DFD7] hover:text-white px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            Đổi Mẫu
          </button>

          {isInactive ? (
            <div
              className="px-3 sm:px-4 py-1.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed"
              title="Mẫu thiệp này đang tạm tắt (Inactive) bởi Quản trị viên và chưa mở bán"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Mẫu Đang Tạm Tắt</span>
              <span className="sm:hidden">Tạm Tắt</span>
            </div>
          ) : (
            <button
              id="demo-choose-template-btn"
              onClick={() => {
                const reqPlan = getTemplateRequiredPlan(validTemplateId);
                onNavigate(`/order?template=${validTemplateId}&package=${reqPlan}`);
              }}
              className="px-3 sm:px-4 py-1.5 rounded-full bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chọn Mẫu Này</span>
              <span className="sm:hidden">Đặt Mẫu</span>
            </button>
          )}
        </div>
      </div>

      {/* Inactive Warning Alert Banner */}
      {isInactive && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-[55] w-[92%] max-w-xl bg-amber-950/90 border border-amber-500/50 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl text-amber-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Mẫu thiệp này đang ở trạng thái <strong>TẠM TẮT (Inactive)</strong> trong trang quản trị và hiện không mở bán cho khách hàng.</span>
          </div>
          <button
            onClick={() => onNavigate('/templates')}
            className="px-2.5 py-1 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-white font-medium shrink-0 cursor-pointer text-[11px]"
          >
            Xem mẫu khác
          </button>
        </div>
      )}

      {/* Render the full interactive wedding page */}
      <WeddingPage
        key={`${validTemplateId}-${envelopeKey}-${showEnvelope}`}
        data={demoData}
        isOwnerMode={true}
        onNavigateToAdmin={() => onNavigate('/admin')}
        showEnvelopeImmediately={showEnvelope}
      />

      {/* Bottom Floating Quick Exit Pill */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] pointer-events-auto">
        <button
          onClick={() => onNavigate('/templates')}
          className="px-4 py-2 rounded-full bg-black/85 hover:bg-black text-white text-xs font-semibold shadow-xl border border-white/20 backdrop-blur-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="w-3.5 h-3.5 text-rose-400" />
          <span>Đóng xem thử mẫu thiệp</span>
        </button>
      </div>
    </div>
  );
}
