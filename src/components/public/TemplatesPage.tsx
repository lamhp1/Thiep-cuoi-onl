import React, { useState } from 'react';
import { CommercialTemplate } from '../../types/commercial';
import { getTemplateRequiredPlan } from '../../data/templates';
import { Eye, Sparkles, CheckCircle2, ArrowRight, Filter, RotateCcw } from 'lucide-react';

interface TemplatesPageProps {
  templates: CommercialTemplate[];
  onNavigate: (path: string) => void;
}

export function TemplatesPage({ templates, onNavigate }: TemplatesPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'all' | 'basic' | 'premium' | 'vip'>('all');

  const activeTemplates = templates.filter((tpl) => {
    const slug = (tpl.slug || '').toLowerCase();
    const id = (tpl.id || '').toLowerCase();
    const name = (tpl.name || '').toLowerCase();
    if (
      slug === 'tree-of-love' ||
      slug === 'tree-of-love-01' ||
      id === 'tpl-tree-of-love-01' ||
      id === 'tree-of-love' ||
      name.includes('cây tình yêu') ||
      name.includes('the tree of love')
    ) {
      return false;
    }
    return tpl.active !== false;
  });

  const countAll = activeTemplates.length;
  const countBasic = activeTemplates.filter((t) => getTemplateRequiredPlan(t.slug, templates) === 'basic').length;
  const countPremium = activeTemplates.filter((t) => getTemplateRequiredPlan(t.slug, templates) === 'premium').length;
  const countVip = activeTemplates.filter((t) => getTemplateRequiredPlan(t.slug, templates) === 'vip').length;

  const filteredTemplates = activeTemplates.filter((tpl) => {
    if (selectedPlan === 'all') return true;
    const reqPlan = getTemplateRequiredPlan(tpl.slug, templates);
    return reqPlan === selectedPlan;
  });

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#8C7335] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B38F26]" />
            <span>Kho Mẫu Thiệp Độc Quyền</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-[#1A1816]">
            Bộ Sưu Tập Thiệp Cưới Online 2026
          </h1>

          <p className="font-body text-sm sm:text-base text-[#5E564F] leading-relaxed">
            Chọn mẫu thiệp phù hợp nhất với câu chuyện tình yêu của hai bạn. Bấm "Xem Demo" để trực tiếp trải nghiệm thiệp thực tế như khách mời.
          </p>
        </div>

        {/* PACKAGE FILTER BAR */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Filter className="w-3.5 h-3.5 text-[#B38F26]" />
            <span className="font-body text-xs font-bold uppercase tracking-wider text-[#8C7335]">
              Lọc theo gói dịch vụ:
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* All Packages */}
            <button
              onClick={() => setSelectedPlan('all')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-body font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                selectedPlan === 'all'
                  ? 'bg-[#1A1816] text-[#FAF6EE] ring-2 ring-[#D4AF37]/50 shadow-md scale-102'
                  : 'bg-white text-[#5E564F] hover:bg-[#FAF6EE] border border-[#EADFC7]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Tất Cả Gói</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  selectedPlan === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {countAll}
              </span>
            </button>

            {/* Basic Package */}
            <button
              onClick={() => setSelectedPlan('basic')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-body font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                selectedPlan === 'basic'
                  ? 'bg-linear-to-r from-emerald-800 to-emerald-900 text-emerald-100 ring-2 ring-emerald-500/50 shadow-md scale-102'
                  : 'bg-white text-emerald-900 hover:bg-emerald-50/60 border border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Gói Basic</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  selectedPlan === 'basic'
                    ? 'bg-emerald-700/60 text-emerald-100'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {countBasic}
              </span>
            </button>

            {/* Premium Package */}
            <button
              onClick={() => setSelectedPlan('premium')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-body font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                selectedPlan === 'premium'
                  ? 'bg-linear-to-r from-[#2A231C] to-[#181615] text-[#E5C058] ring-2 ring-[#D4AF37] shadow-md scale-102'
                  : 'bg-white text-[#8C7335] hover:bg-[#FAF6EE] border border-[#D4AF37]/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Gói Premium</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  selectedPlan === 'premium'
                    ? 'bg-[#D4AF37]/30 text-[#E5C058]'
                    : 'bg-[#FAF6EE] text-[#8C7335]'
                }`}
              >
                {countPremium}
              </span>
            </button>

            {/* VIP Package */}
            <button
              onClick={() => setSelectedPlan('vip')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-body font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                selectedPlan === 'vip'
                  ? 'bg-linear-to-r from-amber-950 to-amber-900 text-amber-200 ring-2 ring-amber-500 shadow-md scale-102'
                  : 'bg-white text-amber-900 hover:bg-amber-50/60 border border-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gói VIP</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  selectedPlan === 'vip'
                    ? 'bg-amber-800/60 text-amber-200'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {countVip}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        {selectedPlan !== 'all' && (
          <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-[#EADFC7] mb-8 max-w-xl mx-auto shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-[#5E564F]">
              <span className="font-semibold text-[#1A1816]">
                Đang hiển thị:
              </span>
              <span>
                {filteredTemplates.length} mẫu thiệp{' '}
                <strong className="text-[#8C7335]">
                  (Gói {selectedPlan.toUpperCase()})
                </strong>
              </span>
            </div>

            <button
              onClick={() => setSelectedPlan('all')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#8C7335] hover:text-[#B38F26] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xem tất cả gói</span>
            </button>
          </div>
        )}

        {/* Templates Grid / Empty State */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EADFC7] p-12 text-center max-w-lg mx-auto space-y-4 my-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#FAF6EE] text-[#D4AF37] flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif-title text-xl font-bold text-[#1A1816]">
              Chưa có mẫu thiệp phù hợp bộ lọc
            </h3>
            <p className="font-body text-xs text-[#786C5E] leading-relaxed">
              Bạn có thể nhấn nút bên dưới để quay lại xem toàn bộ mẫu thiệp của tất cả các gói.
            </p>
            <button
              onClick={() => setSelectedPlan('all')}
              className="px-6 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xem tất cả mẫu thiệp</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tpl, idx) => (
            <div
              key={`${tpl.id || tpl.slug}-${idx}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EADFC7] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative h-72 overflow-hidden bg-neutral-100">
                <img
                  src={tpl.previewImage}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#181615]/85 text-[#E5C058] text-[11px] font-semibold uppercase tracking-wider backdrop-blur-xs whitespace-nowrap">
                    {tpl.badge || tpl.style}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  {(() => {
                    const reqPlan = getTemplateRequiredPlan(tpl.slug, templates);
                    if (reqPlan === 'vip') {
                      return (
                        <span className="px-3 py-1.5 rounded-lg bg-linear-to-r from-[#2A1706] to-[#45220B] text-[#F9D776] border border-[#D4AF37]/50 text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                          <Sparkles className="w-3.5 h-3.5 text-[#F9D776]" />
                          <span>Gói VIP</span>
                        </span>
                      );
                    }
                    if (reqPlan === 'premium') {
                      return (
                        <span className="px-3 py-1.5 rounded-lg bg-linear-to-r from-[#181615] to-[#2E2822] text-[#E5C058] border border-[#D4AF37]/40 text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                          <Sparkles className="w-3.5 h-3.5 text-[#E5C058]" />
                          <span>Gói Premium</span>
                        </span>
                      );
                    }
                    return (
                      <span className="px-3 py-1.5 rounded-lg bg-linear-to-r from-[#0F291E] to-[#184631] text-[#7CE4B5] border border-emerald-500/40 text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#7CE4B5]" />
                        <span>Gói Basic</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Body description */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif-title text-2xl font-bold text-[#1A1816] group-hover:text-[#B38F26] transition-colors">
                      {tpl.name}
                    </h3>
                  </div>

                  <p className="font-body text-xs text-[#786C5E] mt-2 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#EADFC7]/60">
                    <p className="font-body text-[11px] font-semibold text-[#8C7335] uppercase tracking-wider mb-2">
                      Đặc điểm nổi bật:
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#5E564F]">
                      {tpl.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-[#EADFC7]/60 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onNavigate(`/demo/${tpl.slug}`)}
                    className="py-3 px-3 rounded-xl border border-[#D4AF37]/60 text-[#8C7335] hover:bg-[#FAF6EE] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem Demo</span>
                  </button>

                  <button
                    onClick={() => {
                      const reqPlan = getTemplateRequiredPlan(tpl.slug, templates);
                      onNavigate(`/order?template=${tpl.slug}&package=${reqPlan}`);
                    }}
                    className="py-3 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Chọn Mẫu</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Custom Design Banner */}
        <div className="mt-16 bg-white rounded-3xl border border-[#EADFC7] p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif-title text-2xl font-bold text-[#1A1816]">
              Bạn muốn một mẫu thiệp được thiết kế riêng độc bản?
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#5E564F] max-w-xl">
              Chúng tôi nhận thiết kế thiệp theo tone màu đám cưới, font chữ và concept hoa cưới của riêng hai bạn trong Gói VIP.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/order?package=vip')}
            className="shrink-0 px-6 py-3.5 rounded-full bg-neutral-900 hover:bg-black text-[#D4AF37] font-body text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tư Vấn Thiết Kế Riêng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
