import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, CalendarPlus, Download, CheckCircle, Sparkles, Clock, MapPin } from 'lucide-react';
import {
  createGoogleCalendarUrl,
  downloadIcsFile,
  WeddingEventDetails,
} from '../../../lib/guestPersonalization';
import { useToast } from '../../ui/Toast';

interface CalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: WeddingEventDetails;
}

export function CalendarExportModal({
  isOpen,
  onClose,
  event,
}: CalendarExportModalProps) {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleGoogleCalendar = () => {
    const url = createGoogleCalendarUrl(event);
    window.open(url, '_blank');
    showToast('Đang mở Google Calendar...', 'success');
  };

  const handleDownloadICS = () => {
    downloadIcsFile(event);
    showToast('Đã tải file sự kiện .ics cho Apple / Outlook Calendar!', 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-[#FFFDF9] text-[#2C2A29] w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative border-2 border-[#D4AF37]/40 space-y-5"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-left space-y-1 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E0] text-[#8C7335] text-xs font-semibold border border-[#D4AF37]/30">
              <CalendarPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>1-Click Thêm Vào Lịch</span>
            </div>
            <h3 className="font-serif-title text-xl font-bold text-neutral-900 pt-1">
              {event.title}
            </h3>
            <div className="space-y-1 text-xs text-neutral-600 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {event.time} — Ngày {event.date}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  {event.locationName}, {event.address}
                </span>
              </div>
            </div>
          </div>

          {/* Features note */}
          <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#D4AF37]/30 text-xs text-neutral-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tự động đặt nhắc nhở trước 1 ngày &amp; trước 2 giờ đón khách</span>
          </div>

          {/* Action options */}
          <div className="space-y-2.5">
            {/* Google Calendar */}
            <button
              onClick={handleGoogleCalendar}
              className="w-full p-4 rounded-2xl border-2 border-[#D4AF37]/50 bg-gradient-to-r from-[#FAF3E0] to-[#FFFDF9] hover:border-[#D4AF37] hover:shadow-md transition-all flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-xs">
                  <span className="text-xl">📅</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 group-hover:text-[#B38F26] transition-colors">
                    Thêm vào Google Calendar
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Mở trực tiếp trên tài khoản Google của bạn
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#8C7335] group-hover:translate-x-1 transition-transform">
                Mở ngay →
              </span>
            </button>

            {/* Apple Calendar / .ICS */}
            <button
              onClick={handleDownloadICS}
              className="w-full p-4 rounded-2xl border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 transition-all flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 group-hover:text-black transition-colors">
                    Apple Calendar / File .ICS
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Dành cho iPhone, iPad, Mac hoặc Outlook
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-neutral-700 group-hover:translate-x-1 transition-transform">
                Tải file ↓
              </span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 text-center font-body">
            Sự kiện sẽ lưu kèm đầy đủ giờ làm lễ, bản đồ định vị và ghi chú đón khách.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
