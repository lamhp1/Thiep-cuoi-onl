import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, MessageSquareHeart } from 'lucide-react';
import { LoveLetterWashiTape, BotanicalSketch, InkUnderline } from './LoveLetterOrnaments';

export interface LoveLetterWish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  likes?: number;
}

interface LoveLetterGuestbookSectionProps {
  wishes?: LoveLetterWish[];
  onAddWish?: (wish: { name: string; message: string }) => void;
}

export function LoveLetterGuestbookSection({
  wishes = [],
  onAddWish,
}: LoveLetterGuestbookSectionProps) {
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [localWishes, setLocalWishes] = useState<LoveLetterWish[]>(
    wishes.length > 0
      ? wishes
      : [
          {
            id: 'sample-1',
            name: 'Hải Đăng & Minh Thư',
            message: 'Chúc hai bạn mãi mãi ngập tràn tình yêu và nụ cười như những ngày đầu tiên!',
            createdAt: 'Hôm qua',
            likes: 12,
          },
          {
            id: 'sample-2',
            name: 'Chị Mai Lan',
            message: 'Nhìn bức thư tình mà xúc động quá. Chúc em gái và em rể trăm năm hạnh phúc, đầu bạc răng long!',
            createdAt: '2 ngày trước',
            likes: 8,
          },
          {
            id: 'sample-3',
            name: 'Hội Bạn Thân Đại Học',
            message: 'Cuối cùng ngày này cũng tới! Chuẩn bị quẩy hết mình trong ngày vui của hai đứa nhé!',
            createdAt: '3 ngày trước',
            likes: 15,
          },
        ]
  );
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    setLocalWishes((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, likes: (w.likes || 0) + (likedMap[id] ? -1 : 1) }
          : w
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;

    const newWish: LoveLetterWish = {
      id: `wish-${Date.now()}`,
      name: guestName.trim(),
      message: guestMessage.trim(),
      createdAt: 'Vừa xong',
      likes: 1,
    };

    setLocalWishes([newWish, ...localWishes]);
    if (onAddWish) {
      onAddWish({ name: guestName.trim(), message: guestMessage.trim() });
    }

    setGuestName('');
    setGuestMessage('');
  };

  const tapeColors: ('beige' | 'dusty-rose' | 'sage' | 'gold')[] = [
    'dusty-rose',
    'beige',
    'sage',
    'gold',
  ];

  return (
    <section id="guestbook" className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFDF8] border border-[#C8A96B]/35 text-[#7A2638] text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-3 shadow-xs">
          <MessageSquareHeart className="w-3 h-3 text-[#7A2638]" />
          <span>GUESTBOOK OF LOVE</span>
        </div>
        <h2 className="font-handwriting text-3xl sm:text-4xl md:text-5xl font-bold text-[#59483E] tracking-tight">
          Sổ Lưu Bút &amp; Lời Chúc Phúc
        </h2>
        <p className="font-handwriting text-xl sm:text-2xl text-[#7A2638] mt-2">
          Những mẩu giấy yêu thương từ bạn bè và người thân
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Wish Form Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 relative bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#C8A96B]/35 shadow-xl overflow-visible"
          style={{
            boxShadow: '0 15px 35px -10px rgba(89,72,62,0.12)',
          }}
        >
          <LoveLetterWashiTape className="-top-3 left-8" color="dusty-rose" angle={-2} />

          <h3 className="font-serif-title text-xl font-bold text-[#59483E] mb-1">
            Gửi Một Mẩu Tin Nhắn
          </h3>
          <p className="font-handwriting text-base text-[#7A2638] mb-4">
            Để lại một lời chúc nắn nót gửi dâu rể
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#59483E]/70 font-serif font-semibold mb-1">
                Tên của bạn
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ví dụ: Bạn thân hồi cấp 3..."
                className="w-full py-2 px-1 bg-transparent border-b-2 border-[#C8A96B]/40 focus:border-[#7A2638] focus:outline-hidden font-handwriting text-xl text-[#59483E] placeholder:text-[#59483E]/30"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#59483E]/70 font-serif font-semibold mb-1">
                Lời chúc phúc
              </label>
              <textarea
                required
                rows={3}
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                placeholder="Chúc hai bạn trăm năm hạnh phúc..."
                className="w-full py-2 px-1 bg-transparent border-b-2 border-[#C8A96B]/40 focus:border-[#7A2638] focus:outline-hidden font-handwriting text-xl text-[#59483E] placeholder:text-[#59483E]/30 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#7A2638] hover:bg-[#631c2c] text-[#FFFDF8] font-serif-title font-semibold text-xs tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>GỬI LỜI CHÚC PHÚC</span>
            </button>
          </form>
        </motion.div>

        {/* Wishes List (Scrapbook Board of Notes) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <AnimatePresence>
            {localWishes.map((wish, idx) => {
              const tapeColor = tapeColors[idx % tapeColors.length];
              const isLiked = !!likedMap[wish.id];

              return (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="relative bg-[#FFFDF8] rounded-2xl p-5 sm:p-6 border border-[#C8A96B]/30 shadow-md text-left overflow-visible"
                >
                  <LoveLetterWashiTape
                    className="-top-2.5 right-6"
                    color={tapeColor}
                    angle={idx % 2 === 0 ? 2 : -2}
                  />

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif-title font-bold text-base text-[#59483E]">
                      {wish.name}
                    </span>
                    <span className="text-[10px] text-[#59483E]/60 font-serif">
                      {wish.createdAt || 'Gần đây'}
                    </span>
                  </div>

                  <p className="font-handwriting text-lg sm:text-xl text-[#59483E] leading-relaxed">
                    "{wish.message}"
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#C8A96B]/15 flex items-center justify-end">
                    <button
                      onClick={() => handleLike(wish.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-serif transition-colors cursor-pointer ${
                        isLiked ? 'text-[#7A2638] font-bold' : 'text-[#59483E]/60 hover:text-[#7A2638]'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-[#7A2638]' : ''}`}
                      />
                      <span>{wish.likes || 0}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
