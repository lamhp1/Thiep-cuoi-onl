import React, { useState } from 'react';
import { WeddingData, WeddingEvent } from '../../types';
import { Plus, Trash2, Edit2, MapPin, Calendar, Clock, Check } from 'lucide-react';

interface EventsTabProps {
  data: WeddingData;
  onChange: (data: WeddingData) => void;
}

export function EventsTab({ data, onChange }: EventsTabProps) {
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const handleAddEvent = () => {
    const newEvent: WeddingEvent = {
      id: `event-${Date.now()}`,
      title: 'Lễ Tiệc Mới',
      type: 'reception',
      date: data.weddingDate,
      time: '18:00',
      locationName: 'Trung Tâm Tiệc Cưới Luxury',
      address: '123 Đường Lê Lợi, TP. Huế',
      mapUrl: 'https://maps.google.com/?q=Hue',
      description: 'Trân trọng kính mời quý khách tới chung vui bữa cơm thân mật.',
    };

    onChange({
      ...data,
      events: [...data.events, newEvent],
    });
    setEditingEventId(newEvent.id);
  };

  const handleDeleteEvent = (id: string) => {
    onChange({
      ...data,
      events: data.events.filter((e) => e.id !== id),
    });
  };

  const handleUpdateEvent = (id: string, updated: Partial<WeddingEvent>) => {
    onChange({
      ...data,
      events: data.events.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    });
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold font-serif-title text-neutral-900">
            Danh Sách Sự Kiện Đám Cưới
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Quản lý lễ gia tiên, lễ thành hôn và tiệc chiêu đãi
          </p>
        </div>
        <button
          onClick={handleAddEvent}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-white text-xs sm:text-sm font-medium hover:bg-[#B38F26] shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sự kiện</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.events.map((event) => {
          const isEditing = editingEventId === event.id;

          return (
            <div
              key={event.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm transition-all"
            >
              {isEditing ? (
                /* Edit Form */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Tên sự kiện
                      </label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => handleUpdateEvent(event.id, { title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Loại sự kiện
                      </label>
                      <select
                        value={event.type}
                        onChange={(e) => handleUpdateEvent(event.id, { type: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      >
                        <option value="ceremony">Lễ thành hôn / Gia tiên</option>
                        <option value="reception">Tiệc cưới chiêu đãi</option>
                        <option value="party">After Party</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Ngày tổ chức
                      </label>
                      <input
                        type="text"
                        value={event.date}
                        onChange={(e) => handleUpdateEvent(event.id, { date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Thời gian
                      </label>
                      <input
                        type="text"
                        value={event.time}
                        onChange={(e) => handleUpdateEvent(event.id, { time: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Tên địa điểm
                      </label>
                      <input
                        type="text"
                        value={event.locationName}
                        onChange={(e) => handleUpdateEvent(event.id, { locationName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Địa chỉ chi tiết
                      </label>
                      <input
                        type="text"
                        value={event.address}
                        onChange={(e) => handleUpdateEvent(event.id, { address: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                      Link Google Maps
                    </label>
                    <input
                      type="url"
                      value={event.mapUrl}
                      onChange={(e) => handleUpdateEvent(event.id, { mapUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                      Mô tả thêm
                    </label>
                    <textarea
                      rows={2}
                      value={event.description || ''}
                      onChange={(e) => handleUpdateEvent(event.id, { description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => setEditingEventId(null)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Xong</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Card */
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D4AF37]/15 text-[#8C7335]">
                        {event.type === 'ceremony' ? 'Lễ Thành Hôn' : 'Tiệc Cưới'}
                      </span>
                      <h4 className="font-serif-title font-semibold text-lg text-neutral-900">
                        {event.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {event.locationName} ({event.address})
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-xs text-neutral-600 italic pt-1">{event.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEventId(event.id)}
                      className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                      title="Xóa sự kiện"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
