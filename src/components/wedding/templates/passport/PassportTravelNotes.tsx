import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, Heart, Sparkles, MapPin, Feather } from 'lucide-react';

export interface TravelNote {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface PassportTravelNotesProps {
  wishes?: any[];
  groomName?: string;
  brideName?: string;
  onSendWish?: (wish: { name: string; message: string }) => Promise<void> | void;
}

export function PassportTravelNotes({
  wishes = [],
  groomName = 'Chú Rể',
  brideName = 'Cô Dâu',
  onSendWish,
}: PassportTravelNotesProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const [notesList, setNotesList] = useState<TravelNote[]>(() => {
    if (wishes && wishes.length > 0) {
      return wishes
        .filter((w: any) => w.isApproved !== false)
        .map((w: any, idx: number) => ({
          id: w.id || `wish-${idx}`,
          name: w.authorName || w.name || 'Khách danh dự',
          message: w.content || w.message || '',
          createdAt: w.createdAt || 'Mới gửi',
        }));
    }
    return [];
  });

  useEffect(() => {
    if (wishes) {
      setNotesList(
        wishes
          .filter((w: any) => w.isApproved !== false)
          .map((w: any, idx: number) => ({
            id: w.id || `wish-${idx}`,
            name: w.authorName || w.name || 'Khách danh dự',
            message: w.content || w.message || '',
            createdAt: w.createdAt || 'Mới gửi',
          }))
      );
    }
  }, [wishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSending(true);
    try {
      if (onSendWish) {
        await onSendWish({ name: name.trim(), message: message.trim() });
      }

      const newWish: TravelNote = {
        id: `wish-${Date.now()}`,
        name: name.trim(),
        message: message.trim(),
        createdAt: 'Vừa xong',
      };
      setNotesList((prev) => [newWish, ...prev]);
      setName('');
      setMessage('');
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const rotations = [-1.5, 1.2, -2, 1.8, -1.2, 2];

  return (
    <section id="travel-notes" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B99552]/15 border border-[#B99552]/30 text-[#651F2A] text-xs font-mono font-bold tracking-[0.25em] uppercase">
            <Feather className="w-3.5 h-3.5 text-[#B99552]" />
            <span>POSTCARD JOURNAL</span>
          </div>

          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#651F2A] tracking-wider uppercase">
            TRAVEL NOTES
          </h2>

          <p className="font-serif-title italic text-base sm:text-lg text-[#172A3A]">
            Những dòng nhắn gửi, lời chúc phúc thân thương gửi đến hai hành khách
          </p>
        </div>

        {/* Wish Form (Postcard Style Input) */}
        <div className="max-w-2xl mx-auto bg-[#FCFAF5] p-6 sm:p-8 rounded-3xl border-2 border-[#B99552]/40 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#B99552]/20 pb-3 mb-4">
            <span className="text-xs font-mono font-bold text-[#651F2A] uppercase tracking-wider">
              VIẾT LỜI CHÚC (LEAVE A NOTE)
            </span>
            <span className="text-[10px] font-mono text-neutral-400">POSTAGE PAID</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của bạn hoặc gia đình..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#B99552]/30 focus:border-[#651F2A] focus:outline-hidden font-sans text-sm text-[#172A3A] shadow-xs"
              />
            </div>

            <div>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi lời chúc phúc ngọt ngào cho hành trình phía trước..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#B99552]/30 focus:border-[#651F2A] focus:outline-hidden font-sans text-sm text-[#172A3A] shadow-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {sendSuccess ? (
                <span className="text-xs font-mono text-emerald-700 font-bold">
                  ✓ Lời chúc đã được gửi vào sổ du ký!
                </span>
              ) : (
                <span className="text-[10px] font-mono text-neutral-400">
                  LƯU BÚT ĐIỆN TỬ
                </span>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="py-2.5 px-6 rounded-xl bg-[#651F2A] hover:bg-[#8E2835] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'ĐANG GỬI...' : 'GỬI LỜI CHÚC'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Display Wishes as Travel Postcards */}
        {notesList.length === 0 ? (
          <div className="py-10 text-center text-xs font-mono text-[#41372F]/60 italic bg-[#FCFAF5]/60 rounded-2xl border border-[#B99552]/20 max-w-lg mx-auto">
            Chưa có lưu bút nào trên hành trình này. Hãy là người đầu tiên để lại lời chúc phúc nhé!
          </div>
        ) : (
          <div
            className={
              notesList.length === 1
                ? 'max-w-md mx-auto'
                : notesList.length === 2
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            }
          >
            {notesList.map((note, idx) => {
              const rot = rotations[idx % rotations.length];

              return (
                <motion.div
                  key={note.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 6) * 0.08 }}
                  style={{ rotate: `${rot}deg` }}
                  className="bg-[#FCFAF5] p-5 sm:p-6 rounded-2xl border border-[#B99552]/30 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl hover:rotate-0 transition-all duration-300 relative group"
                >
                  {/* Stamp watermark on corner */}
                  <div className="absolute top-3 right-3 text-[#651F2A]/30 group-hover:text-[#651F2A]/60 transition-colors">
                    <Heart className="w-5 h-5" />
                  </div>

                  <div className="space-y-2">
                    <span className="font-serif-title text-base font-bold text-[#172A3A] block">
                      {note.name}
                    </span>
                    <p className="font-sans text-xs sm:text-sm text-[#41372F] italic leading-relaxed">
                      "{note.message}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#B99552]/20 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>{note.createdAt || 'Mới gửi'}</span>
                    <span className="uppercase text-[#B99552]">POSTED VIA AIRMAIL</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
