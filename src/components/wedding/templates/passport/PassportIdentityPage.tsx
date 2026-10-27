import React from 'react';
import { motion } from 'motion/react';
import { CouplePerson } from '../../../../types';
import { PassportStamp, BarcodeSvg } from './PassportOrnaments';
import { ShieldCheck, Calendar, Heart, Award, MapPin } from 'lucide-react';

interface PassportIdentityPageProps {
  groom?: CouplePerson;
  bride?: CouplePerson;
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  weddingCity?: string;
  coverImage?: string;
}

export function PassportIdentityPage({
  groom,
  bride,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
  weddingDate = '20/12/2026',
  weddingCity = 'Hà Nội, Việt Nam',
  coverImage,
}: PassportIdentityPageProps) {
  const gName = groom?.fullName || groom?.name || groomName;
  const bName = bride?.fullName || bride?.name || brideName;
  const gPhoto = groom?.avatar || coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85';
  const bPhoto = bride?.avatar || coverImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85';

  return (
    <section id="identity" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Title Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#651F2A]/10 border border-[#651F2A]/25 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <span>OFFICIAL IDENTIFICATION</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            PASSPORT OF LOVE
          </h2>
          <p className="font-serif-title italic text-sm sm:text-base text-[#41372F]/80">
            Trang Chứng Nhận Tình Yêu &amp; Lời Thề Ước Trọn Đời
          </p>
        </div>

        {/* Passport Identity Booklet Card */}
        <div className="relative bg-[#FCFAF5] rounded-2xl sm:rounded-3xl border-2 border-[#B99552]/40 shadow-2xl p-6 sm:p-10 overflow-hidden text-[#41372F]">
          {/* Subtle Passport Guilloché Top Band */}
          <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-[#651F2A] via-[#B99552] to-[#172A3A]" />

          {/* Watermark Crest Background */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <Heart className="w-96 h-96 text-[#651F2A]" />
          </div>

          {/* Booklet Header Grid */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#B99552]/30 pb-4 mb-6 gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#651F2A] font-bold uppercase block">
                REPUBLIC OF ETERNAL LOVE
              </span>
              <span className="font-serif-title text-xl sm:text-2xl font-bold tracking-widest text-[#172A3A] uppercase">
                HỘ CHIẾU TÌNH YÊU
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right font-mono text-xs">
                <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">PASSPORT NO.</span>
                <span className="font-bold text-[#651F2A] text-sm tracking-widest">LV-2026-FOREVER</span>
              </div>
              <ShieldCheck className="w-7 h-7 text-[#B99552]" />
            </div>
          </div>

          {/* Main Identity Content: Two Citizens of Love (Chú Rể & Cô Dâu) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {/* Groom Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#41372F]/15 pb-2">
                <span className="w-2 h-2 rounded-full bg-[#651F2A]" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#651F2A]">
                  CHỦ HỘ CHIẾU 01 • CHÚ RỂ (GROOM)
                </h3>
              </div>

              <div className="flex gap-4">
                {/* Photo with passport photo frame */}
                <div className="w-28 sm:w-32 h-36 sm:h-40 rounded-lg border-2 border-[#B99552]/60 overflow-hidden shrink-0 bg-neutral-100 shadow-md p-1 relative">
                  <img
                    src={gPhoto}
                    alt={gName}
                    className="w-full h-full object-cover rounded"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/60 text-[8px] font-mono text-white px-1 rounded">
                    GROOM
                  </div>
                </div>

                {/* Details Data List */}
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">HỌ &amp; TÊN (FULL NAME)</span>
                    <span className="font-serif-title text-base sm:text-lg font-bold text-[#172A3A] block">
                      {gName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">QUỐC TỊCH (NATIONALITY)</span>
                    <span className="font-bold text-[#651F2A]">LOVE / TÌNH YÊU</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">TÌNH TRẠNG (STATUS)</span>
                    <span className="font-bold text-emerald-800">ENGAGED ➔ MARRIED</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">NƠI CẤP (ISSUED AT)</span>
                    <span className="font-medium text-[#41372F]">{weddingCity || 'Trái Tim'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bride Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#41372F]/15 pb-2">
                <span className="w-2 h-2 rounded-full bg-[#B99552]" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#651F2A]">
                  CHỦ HỘ CHIẾU 02 • CÔ DÂU (BRIDE)
                </h3>
              </div>

              <div className="flex gap-4">
                {/* Photo with passport photo frame */}
                <div className="w-28 sm:w-32 h-36 sm:h-40 rounded-lg border-2 border-[#B99552]/60 overflow-hidden shrink-0 bg-neutral-100 shadow-md p-1 relative">
                  <img
                    src={bPhoto}
                    alt={bName}
                    className="w-full h-full object-cover rounded"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/60 text-[8px] font-mono text-white px-1 rounded">
                    BRIDE
                  </div>
                </div>

                {/* Details Data List */}
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">HỌ &amp; TÊN (FULL NAME)</span>
                    <span className="font-serif-title text-base sm:text-lg font-bold text-[#172A3A] block">
                      {bName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">QUỐC TỊCH (NATIONALITY)</span>
                    <span className="font-bold text-[#651F2A]">LOVE / TÌNH YÊU</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">TÌNH TRẠNG (STATUS)</span>
                    <span className="font-bold text-emerald-800">ENGAGED ➔ MARRIED</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 uppercase block tracking-wider">NGÀY HÔN LỄ (ENTRY DATE)</span>
                    <span className="font-bold text-[#172A3A]">{weddingDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Passport Stamp: Slamming down effect */}
          <div className="absolute right-4 sm:right-12 bottom-20 sm:bottom-16 pointer-events-none">
            <motion.div
              initial={{ scale: 1.6, opacity: 0, rotate: 15 }}
              whileInView={{ scale: 1, opacity: 0.9, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            >
              <PassportStamp
                text="LOVE APPROVED"
                subtext="OFFICIAL IMMIGRATION"
                date={weddingDate}
                variant="red"
                size="md"
              />
            </motion.div>
          </div>

          {/* Machine Readable Zone (MRZ) at Bottom of Passport Page */}
          <div className="mt-8 pt-4 border-t border-[#B99552]/30 font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.28em] text-neutral-600 select-all overflow-x-auto whitespace-nowrap leading-relaxed bg-[#F5EEDF]/50 p-3 rounded-lg border border-[#B99552]/20">
            <div>
              P&lt;LOVE{gName.toUpperCase().replace(/\s+/g, '&lt;').slice(0, 15)}&lt;&lt;{bName.toUpperCase().replace(/\s+/g, '&lt;').slice(0, 15)}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            </div>
            <div>
              LV20261220&lt;FOREVER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;APPROVED&lt;&lt;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
