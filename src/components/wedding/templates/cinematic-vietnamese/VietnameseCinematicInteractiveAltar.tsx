import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Sparkles,
  Send,
  Heart,
  Copy,
  Check,
  QrCode,
  Lock,
  Unlock,
  Gift,
  HelpCircle,
  ZoomIn,
} from 'lucide-react';
import { WeddingData, BankAccount, WishMessage } from '../../../../types';
import { getWishes, submitWish } from '../../../../services/wishesService';
import { useToast } from '../../../ui/Toast';
import { openQRZoom } from '../../common/QRZoomModal';
import {
  SongHyGlyph,
  LotusOrnament,
  AuspiciousCloud,
  PaperFrameCorner,
  DongSonDrumPattern,
} from '../../vietnamese-traditional/TraditionalOrnaments';

interface VietnameseCinematicInteractiveAltarProps {
  data: WeddingData;
}

interface FloatingLantern {
  id: string;
  author: string;
  message: string;
  x: number; // percentage across river 10 - 90
  y: number; // percentage down river 20 - 80
  scale: number;
  duration: number;
}

const BLESSING_QUICK_TAGS = [
  'Bách niên giai lão 🌸',
  'Loan phụng hòa minh 🕊️',
  'Vĩnh kết đồng tâm 💍',
  'Phúc lộc mãn đường 🧧',
  'Trăm năm hạnh phúc ✨',
];

const FORTUNE_STICKS = [
  {
    code: 'QUẺ SỐ 01 • THƯỢNG THƯỢNG CÁT',
    poem: '“Thiên duyên tác hợp định trăm năm • Hỷ sự lâm môn phúc lộc tràn”',
    meaning: 'Tình cảm sắt son bền chặt, gia đạo êm ấm vạn sự hanh thông.',
  },
  {
    code: 'QUẺ SỐ 08 • ĐẠI CÁT ĐẠI LỢI',
    poem: '“Bách hoa khai lộc đón tân lang • Thuyền hoa rực rỡ rước tân nương”',
    meaning: 'Khởi đầu một chương mới tràn ngập phú quý, con đàn cháu đống.',
  },
  {
    code: 'QUẺ SỐ 19 • BÁCH NIÊN HẢO HỢP',
    poem: '“Sơn hà chứng giám dạ keo sơn • Dẫu ngàn năm tháng mãi tương phùng”',
    meaning: 'Hạnh phúc sắt son, bạn bè quan khách cùng thọ hưởng phúc lành.',
  },
  {
    code: 'QUẺ SỐ 28 • CẦM SẮT HÒA MINH',
    poem: '“Trăng tròn soi bóng chén giao bôi • Rượu nồng se sắt trọn cuộc đời”',
    meaning: 'Vợ chồng hòa thuận như tiếng đàn cầm sắt, phú quý cát tường.',
  },
];

export function VietnameseCinematicInteractiveAltar({ data }: VietnameseCinematicInteractiveAltarProps) {
  const { showToast } = useToast();

  // Floating Lanterns River States
  const [lanterns, setLanterns] = useState<FloatingLantern[]>([
    {
      id: 'lantern-1',
      author: 'Gia Đình Bác Thành',
      message: 'Chúc hai cháu trăm năm đầu bạc răng long, sớm sinh quý tử!',
      x: 25,
      y: 35,
      scale: 1,
      duration: 18,
    },
    {
      id: 'lantern-2',
      author: 'Bạn Thân Đại Học',
      message: 'Mãi mãi ngọt ngào và hạnh phúc như ngày đầu tiên nhé!',
      x: 65,
      y: 45,
      scale: 0.9,
      duration: 22,
    },
    {
      id: 'lantern-3',
      author: 'Cô Ba & Chú Bảy',
      message: 'Chúc phúc hai họ kết thông gia vạn sự viên thành mỹ mãn.',
      x: 45,
      y: 65,
      scale: 1.1,
      duration: 16,
    },
  ]);

  const [activeLantern, setActiveLantern] = useState<FloatingLantern | null>(null);
  const [guestName, setGuestName] = useState('');
  const [wishContent, setWishContent] = useState('');
  const [isSubmittingLantern, setIsSubmittingLantern] = useState(false);

  // Dowry Chest Lock State (Tráp Sơn Son Khóa Ngọc)
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fortune Stick State (Gieo Quẻ Hỷ)
  const [isShakingSticks, setIsShakingSticks] = useState(false);
  const [drawnFortune, setDrawnFortune] = useState<typeof FORTUNE_STICKS[0] | null>(null);

  useEffect(() => {
    // Load real wishes from service if available
    const loadRealWishes = async () => {
      try {
        const list = await getWishes(data.id);
        const approvedList = (list || []).filter((w) => w.isApproved !== false);
        if (approvedList.length > 0) {
          const mapped: FloatingLantern[] = approvedList.slice(0, 8).map((w, i) => ({
            id: w.id || `w-${i}`,
            author: w.authorName,
            message: w.content,
            x: 15 + ((i * 27) % 70),
            y: 20 + ((i * 19) % 55),
            scale: 0.85 + (i % 3) * 0.15,
            duration: 15 + (i % 5) * 3,
          }));
          setLanterns(mapped);
        } else {
          setLanterns([]);
        }
      } catch {
        // fallback
      }
    };
    loadRealWishes();

    const handleUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail?.weddingId || detail.weddingId === data.id || data.id.includes(detail.weddingId) || detail.weddingId.includes(data.id)) {
        loadRealWishes();
      }
    };

    window.addEventListener('lamour_wishes_updated', handleUpdated);
    return () => {
      window.removeEventListener('lamour_wishes_updated', handleUpdated);
    };
  }, [data.id]);

  const handleSendLantern = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !wishContent.trim()) {
      showToast('Vui lòng điền tên và lời chúc của bạn', 'error');
      return;
    }

    setIsSubmittingLantern(true);
    try {
      await submitWish({
        weddingId: data.id,
        authorName: guestName.trim(),
        content: wishContent.trim(),
      });

      const newLantern: FloatingLantern = {
        id: `new-${Date.now()}`,
        author: guestName.trim(),
        message: wishContent.trim(),
        x: 35 + Math.random() * 30,
        y: 50 + Math.random() * 20,
        scale: 1.15,
        duration: 16,
      };

      setLanterns((prev) => [newLantern, ...prev]);
      setActiveLantern(newLantern);
      setGuestName('');
      setWishContent('');

      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#FF9900', '#BA1E28'],
      });

      showToast('Đèn hoa đăng sen vàng đã được thả lên dòng sông hỷ sự!', 'success');
    } catch {
      showToast('Không thể thả hoa đăng lúc này, vui lòng thử lại', 'error');
    } finally {
      setIsSubmittingLantern(false);
    }
  };

  const handleCopyAccount = (accNumber: string, key: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedKey(key);
    showToast(`Đã sao chép số tài khoản: ${accNumber}`, 'success');
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const handleGieoQue = () => {
    if (isShakingSticks) return;
    setIsShakingSticks(true);
    setDrawnFortune(null);

    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * FORTUNE_STICKS.length);
      setDrawnFortune(FORTUNE_STICKS[randomIdx]);
      setIsShakingSticks(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#BA1E28'],
      });
      showToast('Chúc mừng bạn đã rút được quẻ lành đại cát!', 'success');
    }, 1200);
  };

  const groomBank = data.gift?.groomBank || {
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrCodeUrl: '',
  };

  const brideBank = data.gift?.brideBank || {
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrCodeUrl: '',
  };

  return (
    <section id="interactive-altar" className="relative min-h-screen w-full bg-[#0A0405] text-[#FAF6EE] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Background Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0204] via-[#1A0307] to-[#0A0405] opacity-95" />

      <div className="relative z-20 max-w-5xl mx-auto space-y-20">
        {/* ===================================================================
            BREAKTHROUGH 1: THẢ ĐÈN HOA ĐĂNG CẦU PHÚC TRÊN DÒNG SÔNG HOÀNG TRIỀU
           =================================================================== */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D0A11]/80 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-serif uppercase tracking-[0.3em] mb-4">
              <Flame className="w-3.5 h-3.5 text-[#FF9900] animate-pulse" />
              <span>ĐIỂM BỨC PHÁ ĐỘC NHẤT</span>
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#FFF8EB]">
              Thả Đèn Hoa Đăng Cầu Chúc Lương Duyên
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-[#E2D5BE] mt-2 max-w-xl mx-auto">
              Thắp sáng một ngọn đèn sen lung linh gửi gắm tâm tình tốt lành nhất đến đôi uyên ương trên dòng sông ánh sáng
            </p>
          </div>

          {/* VIRTUAL RIVER CANVAS BOX */}
          <div className="relative h-[340px] sm:h-[420px] w-full rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_0_50px_rgba(255,153,0,0.2)] bg-gradient-to-b from-[#060D1A] via-[#0A162B] to-[#040810]">
            {/* Water Ripple Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-black/60 pointer-events-none" />
            
            {/* Moon Reflection on River */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-200/10 blur-3xl pointer-events-none" />

            {/* River Surface Mist */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0405] to-transparent pointer-events-none z-10" />

            {/* Floating Lanterns Render */}
            {lanterns.map((l) => (
              <motion.div
                key={l.id}
                animate={{
                  x: [0, 15, -15, 0],
                  y: [0, -8, 8, 0],
                }}
                transition={{
                  duration: l.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                onClick={() => setActiveLantern(l)}
                style={{
                  left: `${l.x}%`,
                  top: `${l.y}%`,
                  transform: `scale(${l.scale})`,
                }}
                className="absolute z-20 cursor-pointer group -translate-x-1/2 -translate-y-1/2 p-2"
              >
                {/* Glow Halo */}
                <div className="absolute -inset-2 rounded-full bg-amber-400/30 blur-md group-hover:bg-amber-300/60 transition-all duration-300 animate-pulse" />

                {/* Lotus Lantern Visual */}
                <div className="relative flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-t from-red-600 to-amber-400 flex items-center justify-center text-yellow-100 shadow-[0_0_15px_rgba(255,190,0,0.8)]">
                    <Flame className="w-4 h-4 text-amber-100 animate-pulse" />
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-black/70 border border-amber-400/40 text-[9px] text-amber-200 whitespace-nowrap font-serif max-w-[90px] truncate shadow-sm">
                    {l.author}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Active Lantern Preview Bubble */}
            <AnimatePresence>
              {activeLantern && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-md p-4 rounded-2xl bg-[#1C0509]/95 backdrop-blur-md border border-[#D4AF37] shadow-2xl text-center space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-wider">
                      Đèn Hoa Đăng của: {activeLantern.author}
                    </span>
                    <button
                      onClick={() => setActiveLantern(null)}
                      className="text-xs text-neutral-400 hover:text-white px-1.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="font-serif italic text-xs sm:text-sm text-white leading-relaxed">
                    “{activeLantern.message}”
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LANTERN WISH SUBMISSION FORM */}
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#24060C] to-[#140205] border border-[#D4AF37]/50 shadow-xl">
            <h4 className="font-serif-title text-lg sm:text-xl font-bold text-[#FFF8EB] mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF9900]" />
              <span>Gửi Lời Chúc & Thả Hoa Đăng Sen Vàng</span>
            </h4>

            {/* Quick Blessing Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {BLESSING_QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setWishContent((prev) => (prev ? `${prev} ${tag}` : tag))}
                  className="px-3 py-1 rounded-full bg-black/40 hover:bg-[#BA1E28]/40 border border-[#D4AF37]/30 text-xs text-[#F3E5AB] font-serif transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendLantern} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Tên hoặc danh xưng của bạn (VD: Bạn Linh, Gia đình anh Hùng)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] text-sm"
                />
              </div>
              <div>
                <textarea
                  rows={2}
                  required
                  value={wishContent}
                  onChange={(e) => setWishContent(e.target.value)}
                  placeholder="Lời chúc phúc chân thành gửi đến tân lang và tân nương..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmittingLantern}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BA1E28] via-[#D4AF37] to-[#BA1E28] text-black font-serif font-bold text-xs sm:text-sm tracking-widest uppercase shadow-lg hover:shadow-[0_0_20px_rgba(255,190,0,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmittingLantern ? (
                  <span>Đang thắp sáng hoa đăng...</span>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-black" />
                    <span>Thắp Đèn Sen Vàng & Thả Sông</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* ===================================================================
            BREAKTHROUGH 2: TRÁP SƠN SON KHÓA NGỌC & HÒM HỶ TƯỚC VIETQR
           =================================================================== */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D0A11]/80 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-serif uppercase tracking-[0.3em] mb-4">
              <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>HỶ KIM PHÚC LỘC</span>
            </div>
            <h3 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#FFF8EB]">
              Tráp Sơn Son Khóa Ngọc & Hòm Mừng Cưới
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-[#E2D5BE] mt-2 max-w-xl mx-auto">
              Chạm vào Khóa Ngọc Hoàng Gia để mở tráp lấy phong bao Hỷ Tước kèm mã VietQR
            </p>
          </div>

          <div className="max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#1C0509] to-[#0A0405] border-2 border-[#D4AF37] shadow-2xl relative">
            {/* Chest Lock Graphic & Unlock Action */}
            <div className="text-center space-y-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsChestOpen(!isChestOpen)}
                className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#BA1E28] to-[#590B11] border-2 border-[#D4AF37] text-[#F3E5AB] mx-auto shadow-[0_0_35px_rgba(212,175,55,0.4)] cursor-pointer group"
              >
                {isChestOpen ? (
                  <Unlock className="w-8 h-8 text-[#FFD700]" />
                ) : (
                  <Lock className="w-8 h-8 text-[#F3E5AB] group-hover:scale-110 transition-transform" />
                )}
                <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold font-serif uppercase tracking-wider">
                  {isChestOpen ? 'Đã Mở Tráp' : 'Chạm Mở Khóa'}
                </div>
              </motion.button>
              <p className="text-xs font-serif text-[#D4AF37] uppercase tracking-widest">
                {isChestOpen ? 'Tráp sơn son đã mở nắp' : 'Khóa Ngọc Hoàng Gia đang niêm phong'}
              </p>
            </div>

            {/* UNVEILED RED ENVELOPES (BAO LÌ XÌ HỶ SỰ) */}
            <AnimatePresence>
              {isChestOpen ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 pt-4 border-t border-[#D4AF37]/30"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nhà Trai */}
                    <div className="rounded-2xl p-5 bg-[#2C060D] border border-[#D4AF37]/50 space-y-3 text-center flex flex-col justify-between shadow-lg">
                      <div className="space-y-1">
                        <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#D4AF37] block font-bold">
                          PHONG BAO NHÀ TRAI (CHÚ RỂ)
                        </span>
                        <h5 className="font-serif text-sm font-bold text-[#FFF8EB]">
                          {groomBank.accountHolder}
                        </h5>
                        <p className="text-xs text-[#E2D5BE]">
                          {groomBank.bankName}: <span className="font-mono text-white">{groomBank.accountNumber}</span>
                        </p>
                      </div>

                      {Boolean(groomBank.qrCodeUrl) && (
                        <div className="text-center">
                          <div
                            onClick={() =>
                              openQRZoom({
                                qrUrl: groomBank.qrCodeUrl,
                                title: `Mừng Cưới Nhà Trai - ${groomBank.accountHolder}`,
                                bankName: groomBank.bankName,
                                accountNumber: groomBank.accountNumber,
                                accountHolder: groomBank.accountHolder,
                                note: `Mung cuoi ${groomBank.accountHolder}`,
                              })
                            }
                            className="p-2 rounded-xl bg-white mx-auto inline-block shadow-md cursor-pointer group relative hover:scale-105 transition-all active:scale-95 border-2 border-transparent hover:border-[#D4AF37]"
                            title="Chạm để phóng to mã QR"
                            data-qr-zoom="true"
                            data-qr-url={groomBank.qrCodeUrl}
                            data-qr-title={`Mừng Cưới Nhà Trai - ${groomBank.accountHolder}`}
                            data-qr-bank={groomBank.bankName}
                            data-qr-account={groomBank.accountNumber}
                            data-qr-holder={groomBank.accountHolder}
                          >
                            <img
                              src={groomBank.qrCodeUrl}
                              alt="VietQR Chú Rể"
                              className="w-36 h-36 object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 p-1">
                              <ZoomIn className="w-5 h-5 text-white" />
                              <span className="text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
                                Chạm phóng to
                              </span>
                            </div>
                          </div>
                          <span className="block text-[10px] text-[#D4AF37]/80 mt-1 cursor-pointer" onClick={() =>
                            openQRZoom({
                              qrUrl: groomBank.qrCodeUrl,
                              title: `Mừng Cưới Nhà Trai - ${groomBank.accountHolder}`,
                              bankName: groomBank.bankName,
                              accountNumber: groomBank.accountNumber,
                              accountHolder: groomBank.accountHolder,
                              note: `Mung cuoi ${groomBank.accountHolder}`,
                            })
                          }>
                            🔍 Bấm phóng to QR
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => handleCopyAccount(groomBank.accountNumber, 'groom')}
                        className="w-full py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#FFF8EB] text-xs font-serif tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {copiedKey === 'groom' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span>Đã Sao Chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Sao Chép Số TK</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Nhà Gái */}
                    <div className="rounded-2xl p-5 bg-[#2C060D] border border-[#D4AF37]/50 space-y-3 text-center flex flex-col justify-between shadow-lg">
                      <div className="space-y-1">
                        <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#D4AF37] block font-bold">
                          PHONG BAO NHÀ GÁI (CÔ DÂU)
                        </span>
                        <h5 className="font-serif text-sm font-bold text-[#FFF8EB]">
                          {brideBank.accountHolder}
                        </h5>
                        <p className="text-xs text-[#E2D5BE]">
                          {brideBank.bankName}: <span className="font-mono text-white">{brideBank.accountNumber}</span>
                        </p>
                      </div>

                      {Boolean(brideBank.qrCodeUrl) && (
                        <div className="text-center">
                          <div
                            onClick={() =>
                              openQRZoom({
                                qrUrl: brideBank.qrCodeUrl,
                                title: `Mừng Cưới Nhà Gái - ${brideBank.accountHolder}`,
                                bankName: brideBank.bankName,
                                accountNumber: brideBank.accountNumber,
                                accountHolder: brideBank.accountHolder,
                                note: `Mung cuoi ${brideBank.accountHolder}`,
                              })
                            }
                            className="p-2 rounded-xl bg-white mx-auto inline-block shadow-md cursor-pointer group relative hover:scale-105 transition-all active:scale-95 border-2 border-transparent hover:border-[#D4AF37]"
                            title="Chạm để phóng to mã QR"
                            data-qr-zoom="true"
                            data-qr-url={brideBank.qrCodeUrl}
                            data-qr-title={`Mừng Cưới Nhà Gái - ${brideBank.accountHolder}`}
                            data-qr-bank={brideBank.bankName}
                            data-qr-account={brideBank.accountNumber}
                            data-qr-holder={brideBank.accountHolder}
                          >
                            <img
                              src={brideBank.qrCodeUrl}
                              alt="VietQR Cô Dâu"
                              className="w-36 h-36 object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 p-1">
                              <ZoomIn className="w-5 h-5 text-white" />
                              <span className="text-[10px] font-bold bg-black/70 px-2 py-0.5 rounded-full border border-white/20">
                                Chạm phóng to
                              </span>
                            </div>
                          </div>
                          <span className="block text-[10px] text-[#D4AF37]/80 mt-1 cursor-pointer" onClick={() =>
                            openQRZoom({
                              qrUrl: brideBank.qrCodeUrl,
                              title: `Mừng Cưới Nhà Gái - ${brideBank.accountHolder}`,
                              bankName: brideBank.bankName,
                              accountNumber: brideBank.accountNumber,
                              accountHolder: brideBank.accountHolder,
                              note: `Mung cuoi ${brideBank.accountHolder}`,
                            })
                          }>
                            🔍 Bấm phóng to QR
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => handleCopyAccount(brideBank.accountNumber, 'bride')}
                        className="w-full py-2 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#FFF8EB] text-xs font-serif tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {copiedKey === 'bride' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span>Đã Sao Chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Sao Chép Số TK</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-6 text-neutral-400 text-xs font-serif">
                  Nhấn vào con khóa ngọc ở trên để mở phong bao lì xì mừng cưới
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===================================================================
            BREAKTHROUGH 3: GIEO QUẺ HỶ LỘC DUYÊN LÀNH (FORTUNE STICKS)
           =================================================================== */}
        <div className="max-w-xl mx-auto rounded-3xl p-6 sm:p-8 bg-[#180306] border border-[#D4AF37]/40 shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-[0.25em] text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>TƯƠNG TÁC: GIEO QUẺ HỶ LỘC</span>
          </div>

          <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-[#FFF8EB]">
            Lắc Ống Gieo Quẻ Chúc Phúc Cho Quan Khách
          </h4>

          <p className="text-xs text-[#E2D5BE] font-serif leading-relaxed max-w-sm mx-auto">
            Khách mời xin quẻ may mắn cho bản thân và chúc phúc cho đôi bạn trẻ
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGieoQue}
            disabled={isShakingSticks}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#BA1E28] to-[#8C101A] border border-[#D4AF37] text-[#FFF8EB] text-xs font-serif font-bold uppercase tracking-wider shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
          >
            {isShakingSticks ? 'Đang lắc ống quẻ...' : 'Lắc Ống Rút Quẻ Lộc'}
          </motion.button>

          {/* Result Card */}
          <AnimatePresence>
            {drawnFortune && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-2xl bg-black/60 border border-[#D4AF37] space-y-2 text-left"
              >
                <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#FFD700] block font-bold">
                  {drawnFortune.code}
                </span>
                <p className="font-serif italic text-sm text-[#F5E6A3] font-bold">
                  {drawnFortune.poem}
                </p>
                <p className="text-xs text-[#E2D5BE]">
                  <strong>Ý nghĩa:</strong> {drawnFortune.meaning}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
