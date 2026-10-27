import React from 'react';
import { Users, CheckCircle, XCircle, Heart, MessageSquare } from 'lucide-react';
import { RSVPGuest, WishMessage } from '../../types';
import { calculateRSVPStats } from '../../services/rsvpService';

interface StatsOverviewProps {
  rsvps: RSVPGuest[];
  wishes: WishMessage[];
}

export function StatsOverview({ rsvps, wishes }: StatsOverviewProps) {
  const stats = calculateRSVPStats(rsvps);

  const cards = [
    {
      label: 'Tổng phản hồi RSVP',
      value: stats.totalResponses,
      subtext: 'Lượt khách đã phản hồi',
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: 'Khách xác nhận tham dự',
      value: stats.attendingCount,
      subtext: `Tổng ${stats.totalGuests} người tham dự`,
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Rất tiếc không thể đến',
      value: stats.decliningCount,
      subtext: 'Đã báo bận',
      icon: XCircle,
      color: 'text-neutral-500 bg-neutral-50 border-neutral-200',
    },
    {
      label: 'Lời chúc đã nhận',
      value: wishes.length,
      subtext: 'Sổ lưu bút hạnh phúc',
      icon: MessageSquare,
      color: 'text-[#8C7335] bg-[#D4AF37]/10 border-[#D4AF37]/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-neutral-500 font-body">{card.label}</p>
              <h4 className="text-2xl font-bold text-neutral-800 font-serif-title mt-1">
                {card.value}
              </h4>
              <p className="text-[11px] text-neutral-400 font-body mt-0.5">{card.subtext}</p>
            </div>
            <div className={`p-3 rounded-xl border ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
