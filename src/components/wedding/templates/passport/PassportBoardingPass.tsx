import React from 'react';
import { motion } from 'motion/react';
import { BarcodeSvg } from './PassportOrnaments';
import { Plane, Heart, Calendar, Clock, Ticket, Sparkles, QrCode } from 'lucide-react';

interface PassportBoardingPassProps {
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  weddingTime?: string;
  weddingCity?: string;
}

export function PassportBoardingPass({
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
  weddingDate = '20.12.2026',
  weddingTime = '10:00',
  weddingCity = 'Hà Nội',
}: PassportBoardingPassProps) {
  return (
    <section id="boarding-pass" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Section Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#651F2A]/10 border border-[#651F2A]/25 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Ticket className="w-3.5 h-3.5 text-[#B99552]" />
            <span>EXCLUSIVE TRAVEL TICKET</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            WEDDING BOARDING PASS
          </h2>
          <p className="font-serif-title italic text-sm sm:text-base text-[#41372F]/80">
            Tấm vé danh dự lên chuyến bay khởi hành đến bến đỗ hạnh phúc
          </p>
        </div>

        {/* Boarding Pass Card with Animated Slide-in from Right */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="relative bg-[#FCFAF5] rounded-3xl border-2 border-[#B99552]/40 shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Main Ticket (Left Side) */}
          <div className="flex-1 p-6 sm:p-8 space-y-6">
            {/* Ticket Header */}
            <div className="flex items-center justify-between border-b border-[#B99552]/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#651F2A] text-[#FCFAF5] flex items-center justify-center font-serif-title font-bold text-lg shadow-md border border-[#B99552]/50">
                  ✈
                </div>
                <div>
                  <span className="font-serif-title text-xl font-bold tracking-wider text-[#172A3A] uppercase block">
                    LOVE AIRLINES
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#651F2A] font-semibold uppercase block">
                    BOARDING PASS • FIRST CLASS
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">FLIGHT</span>
                <span className="text-base font-bold text-[#651F2A] tracking-widest">LV-2026</span>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                HÀNH KHÁCH (PASSENGERS)
              </span>
              <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#172A3A] tracking-wide">
                {groomName} &amp; {brideName}
              </div>
            </div>

            {/* Route from -> to */}
            <div className="grid grid-cols-3 gap-2 items-center bg-[#F5EEDF]/60 p-4 rounded-2xl border border-[#B99552]/20">
              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">KHỞI HÀNH (FROM)</span>
                <span className="font-serif-title text-base sm:text-lg font-bold text-[#651F2A] block">
                  FIRST MEETING
                </span>
                <span className="text-[10px] text-neutral-500 font-sans">Ngày Đầu Gặp Gỡ</span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 w-full justify-center text-[#B99552]">
                  <div className="h-px bg-current flex-1" />
                  <Plane className="w-4 h-4 rotate-90 shrink-0" />
                  <div className="h-px bg-current flex-1" />
                </div>
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#B99552] font-bold mt-1">
                  NON-STOP
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">ĐẾN (TO)</span>
                <span className="font-serif-title text-base sm:text-lg font-bold text-[#651F2A] block">
                  FOREVER
                </span>
                <span className="text-[10px] text-neutral-500 font-sans">Trọn Đời Bên Nhau</span>
              </div>
            </div>

            {/* Flight parameters grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-2">
              <div>
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">NGÀY (DATE)</span>
                <span className="font-bold text-[#172A3A] text-sm">{weddingDate}</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">GIỜ (TIME)</span>
                <span className="font-bold text-[#172A3A] text-sm">{weddingTime}</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">CỔNG (GATE)</span>
                <span className="font-bold text-[#651F2A] text-sm">LOVE</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">GHẾ (SEAT)</span>
                <span className="font-bold text-[#651F2A] text-sm">01A + 01B</span>
              </div>
            </div>

            {/* Barcode section */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#B99552]/20">
              <BarcodeSvg className="text-[#172A3A]" />
              <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
                ETICKET № 2026-LOVE-FOREVER-01A01B
              </span>
            </div>
          </div>

          {/* Perforated Divider (Đường răng cưa xé vé) */}
          <div className="relative flex md:flex-col items-center justify-between py-2 md:py-0 px-6 md:px-0">
            {/* Top cutout circle on desktop / Left cutout circle on mobile */}
            <div className="w-6 h-6 rounded-full bg-[#F5EEDF] border-2 border-[#B99552]/40 -mt-3 md:-mt-3 md:-translate-y-1/2 -ml-9 md:ml-0" />

            {/* Perforated dashed line */}
            <div className="w-full md:w-px h-px md:h-full border-t md:border-t-0 md:border-l-2 border-dashed border-[#B99552]/50 my-2 md:my-0" />

            {/* Bottom cutout circle on desktop / Right cutout circle on mobile */}
            <div className="w-6 h-6 rounded-full bg-[#F5EEDF] border-2 border-[#B99552]/40 -mb-3 md:-mb-3 md:translate-y-1/2 -mr-9 md:mr-0" />
          </div>

          {/* Tear-off Ticket Stub (Right Side) */}
          <div className="w-full md:w-64 bg-[#F5EEDF]/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 md:border-l border-[#B99552]/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#651F2A] font-bold tracking-widest uppercase">
                  PASSENGER RECEIPT
                </span>
                <span className="text-[9px] font-mono text-neutral-400">STUB</span>
              </div>

              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">PASSENGER</span>
                <span className="font-serif-title text-base font-bold text-[#172A3A] block">
                  {groomName} &amp; {brideName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase block">FLIGHT</span>
                  <span className="font-bold text-[#651F2A]">LV-2026</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase block">SEAT</span>
                  <span className="font-bold text-[#651F2A]">01A + 01B</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase block">DATE</span>
                  <span className="font-bold text-[#172A3A]">{weddingDate}</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase block">GATE</span>
                  <span className="font-bold text-[#172A3A]">LOVE</span>
                </div>
              </div>
            </div>

            {/* Decorative Stamp / QR on Stub */}
            <div className="pt-4 border-t border-[#B99552]/30 flex items-center justify-between">
              <div className="text-[9px] font-mono text-neutral-500 leading-tight">
                BOARDING PASS<br />
                CONFIRMED<br />
                ★ LOVE 2026 ★
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border border-[#B99552]/40 flex items-center justify-center p-1.5 shadow-xs">
                <QrCode className="w-full h-full text-[#651F2A]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
