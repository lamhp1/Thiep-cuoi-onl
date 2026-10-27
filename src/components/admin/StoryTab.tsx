import React, { useState } from 'react';
import { WeddingData, StoryMilestone } from '../../types';
import { Plus, Trash2, Edit2, Calendar, Check, EyeOff, HeartHandshake, AlertTriangle, X, MapPin } from 'lucide-react';
import { ImageUploadField } from '../common/ImageUploadField';
import { useToast } from '../ui/Toast';

interface StoryTabProps {
  data: WeddingData;
  onChange: (data: WeddingData) => void;
}

export function StoryTab({ data, onChange }: StoryTabProps) {
  const { showToast } = useToast();
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);
  const storiesList = Array.isArray(data.stories) ? data.stories : [];

  const isModernLuxuryTemplate =
    data.template === 'vietnamese-modern-luxury' ||
    (data.template as string) === 'tpl-vietnamese-modern-luxury';

  const handleAddStory = () => {
    const newStory: StoryMilestone = {
      id: `story-${Date.now()}`,
      year: '2025',
      dateStr: '14 Tháng 02, 2025',
      title: 'Khoảnh Khắc Mới',
      description: 'Chia sẻ kỷ niệm ngọt ngào của hai bạn tại đây...',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    };

    onChange({
      ...data,
      stories: [...storiesList, newStory],
    });
    setEditingStoryId(newStory.id);
    showToast('Đã thêm mốc kỷ niệm mới', 'success');
  };

  const handleDeleteStory = (id: string) => {
    onChange({
      ...data,
      stories: storiesList.filter((s) => s.id !== id),
    });
    if (editingStoryId === id) {
      setEditingStoryId(null);
    }
    showToast('Đã xóa mốc kỷ niệm', 'info');
  };

  const handleConfirmDeleteAll = () => {
    onChange({
      ...data,
      stories: [],
    });
    setEditingStoryId(null);
    setShowConfirmDeleteAll(false);
    showToast('Đã xóa toàn bộ câu chuyện tình yêu. Mục này đã được ẩn trên thiệp cưới.', 'info');
  };

  const handleUpdateStory = (id: string, updated: Partial<StoryMilestone>) => {
    onChange({
      ...data,
      stories: storiesList.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    });
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold font-serif-title text-neutral-900">
            Dòng Thời Gian Câu Chuyện Tình Yêu
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Các mốc kỷ niệm đáng nhớ từ lúc gặp gỡ đến ngày chung đôi
          </p>
        </div>
        <div className="flex items-center gap-2">
          {storiesList.length > 0 && (
            <button
              onClick={() => setShowConfirmDeleteAll(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/70 hover:bg-rose-100 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title="Xóa tất cả các mốc câu chuyện"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa tất cả ({storiesList.length})</span>
            </button>
          )}
          <button
            onClick={handleAddStory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-white text-xs sm:text-sm font-medium hover:bg-[#B38F26] shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm mốc kỷ niệm</span>
          </button>
        </div>
      </div>

      {/* Modal xác nhận xóa tất cả */}
      {showConfirmDeleteAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 space-y-4 animate-scaleUp">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-neutral-900 font-serif-title">
                  Xác nhận xóa toàn bộ câu chuyện?
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Toàn bộ <strong>{storiesList.length} mốc kỷ niệm</strong> sẽ bị xóa khỏi hệ thống.
                </p>
                <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                  <EyeOff className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Sau khi xóa, mục <strong>"Câu chuyện tình yêu"</strong> và thanh menu tương ứng trên thiệp cưới của bạn sẽ tự động được ẩn hoàn toàn đối với khách mời.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowConfirmDeleteAll(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-medium cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác nhận xóa hết</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trạng thái hiển thị trên thiệp cưới */}
      {storiesList.length === 0 ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
            <EyeOff className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed space-y-1">
            <p className="font-semibold text-amber-950">
              Mục "Câu chuyện tình yêu" hiện đang được ẨN HOÀN TOÀN trên thiệp cưới
            </p>
            <p className="text-amber-800 text-xs">
              Bạn đã xóa hết mốc kỷ niệm, thiệp cưới trực tiếp và menu điều hướng trên thiệp sẽ không còn hiển thị phần này. Khi bạn muốn mở lại, chỉ cần bấm nút <strong>"+ Thêm mốc kỷ niệm"</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Đang hiển thị <strong>{storiesList.length}</strong> mốc kỷ niệm trên thiệp cưới</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Khách mời có thể xem được</span>
        </div>
      )}

      {storiesList.length === 0 ? (
        <div className="py-16 px-6 text-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 space-y-4">
          <div className="w-16 h-16 rounded-full bg-white shadow-xs border border-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
            <HeartHandshake className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="font-serif-title text-base font-semibold text-neutral-800">
              Chưa có mốc câu chuyện nào
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Nếu bạn không muốn chia sẻ câu chuyện tình yêu trên thiệp, bạn có thể để trống như hiện tại. Toàn bộ mục này sẽ tự động ẩn trên thiệp cưới của bạn.
            </p>
          </div>
          <button
            onClick={handleAddStory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#D4AF37] text-[#8C7335] text-xs font-semibold hover:bg-[#FAF6EE] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Thêm mốc kỷ niệm đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {storiesList.map((story) => {
            const isEditing = editingStoryId === story.id;

            return (
              <div
                key={story.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm transition-all"
              >
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Năm
                      </label>
                      <input
                        type="text"
                        value={story.year}
                        onChange={(e) => handleUpdateStory(story.id, { year: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Ngày tháng
                      </label>
                      <input
                        type="text"
                        value={story.dateStr}
                        onChange={(e) => handleUpdateStory(story.id, { dateStr: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Tiêu đề kỷ niệm
                      </label>
                      <input
                        type="text"
                        value={story.title}
                        onChange={(e) => handleUpdateStory(story.id, { title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                        Địa điểm / Tọa độ (Map)
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Đà Lạt, Hội An..."
                        value={story.location || ''}
                        onChange={(e) => handleUpdateStory(story.id, { location: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <ImageUploadField
                    id={`story-img-${story.id}`}
                    label="Ảnh minh họa kỷ niệm"
                    value={story.image}
                    onChange={(newImg) => handleUpdateStory(story.id, { image: newImg })}
                    shape="square"
                    helperText="Chọn ảnh kỷ niệm từ máy tính hoặc điện thoại của hai bạn."
                  />

                  <div>
                    <label className="block text-xs uppercase text-neutral-500 font-semibold mb-1">
                      Lời tự sự kỷ niệm (Chung)
                    </label>
                    <textarea
                      rows={3}
                      value={story.description}
                      onChange={(e) => handleUpdateStory(story.id, { description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:border-[#D4AF37] outline-none resize-none"
                    />
                  </div>

                  {/* Tùy chỉnh 2 góc nhìn song song (Chỉ hiển thị khi chọn hoặc chuyển sang Mẫu 1 — Modern Luxury) */}
                  {isModernLuxuryTemplate && (
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D8BE87]/50 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#63121D] flex items-center gap-1.5">
                          <HeartHandshake className="w-4 h-4 text-[#D8BE87]" />
                          <span>Tùy chỉnh Góc Nhìn Song Song (Dual Perspective)</span>
                        </span>
                        <span className="text-[11px] text-neutral-500 italic">
                          Hiển thị độc quyền trên Mẫu 1 — Modern Luxury
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Góc nhìn Chú rể */}
                        <div className="p-3 bg-white rounded-lg border border-neutral-200 space-y-3">
                          <span className="text-xs font-bold text-neutral-800 uppercase block border-b pb-1">
                            Góc nhìn Chú Rể (Anh)
                          </span>
                          <div>
                            <label className="block text-[11px] text-neutral-500 font-medium mb-0.5">
                              Tiêu đề góc nhìn Chú rể
                            </label>
                            <input
                              type="text"
                              placeholder="VD: Lần Đầu Gặp Gỡ Em"
                              value={story.groomTitle || ''}
                              onChange={(e) => handleUpdateStory(story.id, { groomTitle: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-xs focus:border-[#D4AF37] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-neutral-500 font-medium mb-0.5">
                              Lời tự sự của Chú rể
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Cảm xúc, suy nghĩ từ góc nhìn của chú rể..."
                              value={story.groomStory || ''}
                              onChange={(e) => handleUpdateStory(story.id, { groomStory: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-xs focus:border-[#D4AF37] outline-none resize-none"
                            />
                          </div>
                          <ImageUploadField
                            id={`story-groom-img-${story.id}`}
                            label="Ảnh riêng của Chú rể (tùy chọn)"
                            value={story.groomImage || ''}
                            onChange={(newImg) => handleUpdateStory(story.id, { groomImage: newImg })}
                            shape="square"
                          />
                        </div>

                        {/* Góc nhìn Cô dâu */}
                        <div className="p-3 bg-white rounded-lg border border-neutral-200 space-y-3">
                          <span className="text-xs font-bold text-[#63121D] uppercase block border-b pb-1">
                            Góc nhìn Cô Dâu (Mai / Em)
                          </span>
                          <div>
                            <label className="block text-[11px] text-neutral-500 font-medium mb-0.5">
                              Tiêu đề góc nhìn Cô dâu
                            </label>
                            <input
                              type="text"
                              placeholder="VD: Chàng Trai Ấm Áp"
                              value={story.brideTitle || ''}
                              onChange={(e) => handleUpdateStory(story.id, { brideTitle: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-xs focus:border-[#D4AF37] outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-neutral-500 font-medium mb-0.5">
                              Lời tự sự của Cô dâu
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Cảm xúc, suy nghĩ từ góc nhìn của cô dâu..."
                              value={story.brideStory || ''}
                              onChange={(e) => handleUpdateStory(story.id, { brideStory: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded border border-neutral-200 text-xs focus:border-[#D4AF37] outline-none resize-none"
                            />
                          </div>
                          <ImageUploadField
                            id={`story-bride-img-${story.id}`}
                            label="Ảnh riêng của Cô dâu (tùy chọn)"
                            value={story.brideImage || ''}
                            onChange={(newImg) => handleUpdateStory(story.id, { brideImage: newImg })}
                            shape="square"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setEditingStoryId(null)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Xong</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-[#D4AF37]/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37]/15 text-[#8C7335]">
                          {story.year}
                        </span>
                        <h4 className="font-serif-title font-semibold text-lg text-neutral-900 truncate">
                          {story.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingStoryId(story.id)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {story.dateStr}
                      </span>
                      {story.location && (
                        <span className="flex items-center gap-1 text-[#722238] font-medium bg-[#F5EFE3] px-2 py-0.5 rounded-full">
                          <MapPin className="w-3 h-3 text-[#B9985A]" /> {story.location}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
