import React, { useState } from 'react';
import { Heart, Send, Sparkles, MessageCircle, Smile, Flower2, Wine, Star } from 'lucide-react';
import { WashiTape, WashiTapeStyle, Paperclip, Thumbtack, HeartSticker } from './PolaroidScrapbookOrnaments';

export interface ScrapbookWish {
  id: string;
  name: string;
  message: string;
  createdAt?: string;
  sticker?: string;
}

interface PolaroidWishesSectionProps {
  wishes?: ScrapbookWish[];
  onAddWish?: (name: string, message: string) => Promise<void> | void;
  groomName?: string;
  brideName?: string;
}

export function PolaroidWishesSection({
  wishes,
  onAddWish,
  groomName = 'Minh Anh',
  brideName = 'Ngọc Mai',
}: PolaroidWishesSectionProps) {
  const [authorName, setAuthorName] = useState('');
  const [wishContent, setWishContent] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('heart');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultWishes: ScrapbookWish[] = [
    {
      id: 'wish-1',
      name: 'Thanh Hằng & Tuấn Kiệt',
      message:
        'Chúc hai bạn trăm năm hạnh phúc, mãi mãi ngọt ngào và thấu hiểu nhau như những ngày đầu tiên nhé!',
      createdAt: '2026-10-12T09:00:00Z',
    },
    {
      id: 'wish-2',
      name: 'Hội Bạn Thân Đại Học',
      message:
        'Cuối cùng thì chàng trai của chúng ta cũng rước được nàng về dinh! Hạnh phúc viên mãn nha Minh Anh & Ngọc Mai!',
      createdAt: '2026-10-13T14:30:00Z',
    },
    {
      id: 'wish-3',
      name: 'Chị Lan Hương',
      message:
        'Mẫu thiệp scrapbook xinh xắn quá đỗi! Chúc hai em xây dựng một tổ ấm ngập tràn tiếng cười và sự bình yên.',
      createdAt: '2026-10-14T18:20:00Z',
    },
    {
      id: 'wish-4',
      name: 'Bác Ba & Gia Đình',
      message:
        'Chúc hai cháu sắt son nghĩa vợ tình chồng, đầu bạc răng long, sớm có tin vui cho cả hai gia đình cùng mừng!',
      createdAt: '2026-10-15T08:15:00Z',
    },
  ];

  const [localWishes, setLocalWishes] = useState<ScrapbookWish[]>(
    wishes && wishes.length > 0 ? wishes : defaultWishes
  );

  const stickers = [
    { id: 'heart', label: 'Trái tim', icon: Heart, color: 'text-[#C84B5D]' },
    { id: 'ring', label: 'Nhẫn cưới', icon: Sparkles, color: 'text-[#C5A059]' },
    { id: 'flower', label: 'Hoa hồng', icon: Flower2, color: 'text-[#E57A8B]' },
    { id: 'wine', label: 'Rượu mừng', icon: Wine, color: 'text-[#8E44AD]' },
    { id: 'star', label: 'Ngôi sao', icon: Star, color: 'text-[#F39C12]' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !wishContent.trim()) return;

    setIsSubmitting(true);
    try {
      if (onAddWish) {
        await onAddWish(authorName, wishContent);
      }
      // Optimistic update
      const newWish: ScrapbookWish = {
        id: `wish-${Date.now()}`,
        name: authorName,
        message: wishContent,
        createdAt: new Date().toISOString(),
        sticker: selectedSticker,
      };
      setLocalWishes([newWish, ...localWishes]);
      setAuthorName('');
      setWishContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tapeStyles: WashiTapeStyle[] = [
    'pink-grid',
    'mint-dots',
    'yellow-stripes',
    'kraft',
    'rose-floral',
    'gold-sheen',
  ];

  return (
    <section id="wishes" className="relative py-14 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <WashiTape style="rose-floral" angle={-1} width="w-32" />
          </div>
          <div className="bg-[#FFFDF9] border border-[#E3D4BC] px-6 py-2 rounded-xs shadow-xs inline-flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-[#D9735A]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7E5E44] font-bold">
              SỔ LƯU BÚT & LỜI CHÚC PHÚC
            </span>
            <MessageCircle className="w-3.5 h-3.5 text-[#D9735A]" />
          </div>
        </div>

        <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#2C211B] mt-4">
          Gửi Lời Chúc Đến Đôi Uyên Ương
        </h2>
        <p className="font-polaroid-note text-lg sm:text-xl text-[#7E5738] mt-1 max-w-lg mx-auto">
          "Hãy dán một mảnh giấy ghi nhớ và kẹp sticker chúc mừng lên cuốn sổ kỷ niệm của chúng mình nhé!"
        </p>
      </div>

      {/* Form: Write a wish note */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="relative bg-[#FFFDF9] border-2 border-[#DFCBB2] p-6 sm:p-8 rounded-xl shadow-lg [background-image:linear-gradient(to_bottom,transparent_23px,#F0E6D5_24px)] [background-size:100%_24px]">
          <div className="absolute -top-3 left-8 z-10">
            <WashiTape style="kraft" angle={-2} width="w-24" />
          </div>

          <h3 className="font-serif-title text-lg font-bold text-[#2C211B] mb-4">
            Để Lại Lời Chúc Phúc
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Tên của bạn hoặc xưng hô..."
                className="w-full bg-[#FAF6EE] border border-[#D5C2A5] rounded-md px-3.5 py-2 text-sm text-[#2C211B] placeholder-[#9E8A78] focus:outline-none focus:border-[#C84B5D] transition-colors"
              />
            </div>

            <div>
              <textarea
                rows={3}
                required
                value={wishContent}
                onChange={(e) => setWishContent(e.target.value)}
                placeholder="Viết lời chúc ngọt ngào nhất gửi đến cô dâu chú rể..."
                className="w-full bg-[#FAF6EE] border border-[#D5C2A5] rounded-md p-3 text-sm text-[#2C211B] placeholder-[#9E8A78] focus:outline-none focus:border-[#C84B5D] transition-colors resize-none"
              />
            </div>

            {/* Sticker selector */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-mono text-[#8C6D1F] uppercase font-bold">
                CHỌN STICKER ĐÍNH KÈM:
              </span>
              <div className="flex items-center gap-2">
                {stickers.map((st) => {
                  const Icon = st.icon;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedSticker(st.id)}
                      className={`p-1.5 rounded-full border cursor-pointer transition-all ${
                        selectedSticker === st.id
                          ? 'bg-[#FCE38A] border-[#C5A059] shadow-xs scale-110'
                          : 'bg-white border-[#E0D2BB] hover:bg-neutral-50'
                      }`}
                      title={st.label}
                    >
                      <Icon className={`w-4 h-4 ${st.color}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C84B5D] hover:bg-[#B53D4E] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'ĐANG DÁN LỜI CHÚC...' : 'DÁN LÊN CUỐN SỔ KỶ NIỆM'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Scattered Sticky Notes Guestbook Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {localWishes.map((w, idx) => {
          const rotation = idx % 3 === 0 ? -2.5 : idx % 3 === 1 ? 2 : -1;
          const washiType = tapeStyles[idx % tapeStyles.length];

          return (
            <div
              key={w.id || idx}
              style={{ transform: `rotate(${rotation}deg)` }}
              className="group relative bg-[#FFFDF9] border border-[#E0D2BB] p-5 rounded-xs shadow-md hover:shadow-2xl transition-all duration-300 hover:rotate-0 hover:scale-[1.03] select-none [background-image:linear-gradient(to_bottom,transparent_23px,#F5EDE0_24px)] [background-size:100%_24px]"
            >
              {/* Thumbtack or Washi tape */}
              {idx % 2 === 0 ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <WashiTape style={washiType} angle={idx % 4 === 0 ? -3 : 4} width="w-20" />
                </div>
              ) : (
                <div className="absolute -top-2.5 right-6 z-10">
                  <Thumbtack color="gold" />
                </div>
              )}

              {/* Wish Author */}
              <div className="flex items-center justify-between border-b border-[#E0D2BB] pb-1.5 mb-2 mt-1">
                <span className="font-serif-title font-bold text-sm text-[#2C211B]">
                  {w.name}
                </span>
                <Heart className="w-3 h-3 text-[#C84B5D] fill-current" />
              </div>

              {/* Wish Content */}
              <p className="font-polaroid-note text-base text-[#4E3E34] leading-relaxed italic">
                "{w.message}"
              </p>

              {/* Bottom tag */}
              <div className="mt-3 pt-2 border-t border-dashed border-[#E0D2BB]/70 flex items-center justify-between text-[10px] font-mono text-[#8C6D1F]">
                <span>GỬI TẶNG MINH ANH & MAI</span>
                <span>♥ TRÂN QUÝ</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
