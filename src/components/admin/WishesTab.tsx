import React, { useState } from 'react';
import { WishMessage } from '../../types';
import { Eye, EyeOff, Trash2, Heart, MessageSquare, AlertCircle } from 'lucide-react';
import { toggleWishApproval, deleteWish } from '../../services/wishesService';
import { useToast } from '../ui/Toast';

interface WishesTabProps {
  weddingId: string;
  wishes: WishMessage[];
  onRefresh: () => void;
}

export function WishesTab({ weddingId, wishes = [], onRefresh }: WishesTabProps) {
  const { showToast } = useToast();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [localHiddenIds, setLocalHiddenIds] = useState<Set<string>>(new Set());

  const wishList = Array.isArray(wishes)
    ? wishes.filter((w) => !localHiddenIds.has(w.id))
    : [];

  const handleToggleHide = async (wishId: string, currentApproved?: boolean) => {
    try {
      await toggleWishApproval(weddingId, wishId, !currentApproved);
      showToast(currentApproved ? 'Đã ẩn lời chúc khỏi thiệp' : 'Đã hiển thị lời chúc trên thiệp', 'info');
      onRefresh();
    } catch {
      showToast('Lỗi khi cập nhật trạng thái lời chúc', 'error');
    }
  };

  const handleExecuteDelete = async (wishId: string) => {
    setIsDeletingId(wishId);
    try {
      // Optimistic instant removal from UI
      setLocalHiddenIds((prev) => new Set([...prev, wishId]));
      setConfirmDeleteId(null);

      await deleteWish(weddingId, wishId);
      showToast('Đã xóa vĩnh viễn lời chúc', 'info');
      onRefresh();
    } catch (err) {
      console.error('Delete wish error:', err);
      // Revert optimistic removal on error
      setLocalHiddenIds((prev) => {
        const next = new Set(prev);
        next.delete(wishId);
        return next;
      });
      showToast('Lỗi khi xóa lời chúc, vui lòng thử lại', 'error');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold font-serif-title text-neutral-900">
            Quản Lý Lời Chúc Mừng ({wishList.length})
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Duyệt, ẩn hoặc xóa vĩnh viễn lời chúc từ khách mời
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishList.map((wish) => {
          const isVisible = wish.isApproved !== false;
          const isConfirming = confirmDeleteId === wish.id;
          const isDeleting = isDeletingId === wish.id;

          return (
            <div
              key={wish.id}
              className={`p-5 rounded-2xl border shadow-sm transition-all flex flex-col justify-between ${
                isVisible ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-neutral-300 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#8C7335] flex items-center justify-center font-bold text-sm">
                      {wish.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif-title font-semibold text-neutral-900">
                        {wish.authorName}
                      </h4>
                      <span className="text-xs text-neutral-400 font-body">
                        {wish.relation || 'Khách mời'} • {new Date(wish.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-rose-500 font-medium">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{wish.likesCount || 1}</span>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 italic my-3 leading-relaxed">
                  "{wish.content}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs gap-2">
                <span className={`px-2 py-0.5 rounded-full font-medium shrink-0 ${isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isVisible ? 'Đang hiển thị' : 'Đang ẩn'}
                </span>

                {isConfirming ? (
                  <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl animate-in fade-in zoom-in-95 duration-150">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="text-[11px] text-rose-700 font-medium whitespace-nowrap">
                      Xóa vĩnh viễn?
                    </span>
                    <button
                      onClick={() => handleExecuteDelete(wish.id)}
                      disabled={isDeleting}
                      className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={isDeleting}
                      className="px-2 py-0.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleHide(wish.id, isVisible)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                      title={isVisible ? 'Ẩn lời chúc khỏi thiệp cưới' : 'Hiển thị lại trên thiệp cưới'}
                    >
                      {isVisible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> <span>Ẩn</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> <span>Hiện</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(wish.id)}
                      className="inline-flex items-center gap-1 p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Xóa lời chúc"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {wishList.length === 0 && (
        <div className="py-16 text-center text-neutral-400">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Chưa có lời chúc nào trong danh sách.</p>
        </div>
      )}
    </div>
  );
}
