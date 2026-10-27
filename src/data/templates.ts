import { TemplateId, TemplateTheme, PlanTier } from '../types';

export const TEMPLATES: Record<TemplateId, TemplateTheme> = {
  'traditional-vietnamese': {
    id: 'traditional-vietnamese',
    name: 'Mẫu 3 — Vietnamese Traditional (Hỷ Sự)',
    badge: 'Mẫu 3 Mới • Trung Cấp • Hỷ Sự',
    description: 'Concept Hỷ Sự đậm bản sắc Việt: Sắc đỏ son, vàng kim & kem giấy trên nền texture giấy nhẹ. Điểm xuyết chữ Hỷ, hoa sen, mây cát tường, họa tiết Đông Sơn. Trải nghiệm mở phong bì đỏ độc bản, timeline cuộn giấy và bao lì xì mừng cưới kèm VietQR.',
    bgClass: 'bg-[#FAF6EE]',
    cardClass: 'bg-[#FFFDF9] border-[#D4AF37]/50 text-[#3D1A1E]',
    accentColor: '#BA1E28',
    textColor: '#3D1A1E',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#D4AF37] border-[#D4AF37]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'floral-romance': {
    id: 'floral-romance',
    name: 'Mẫu 2 — Floral Romance (Hoa Cỏ Lãng Mạn)',
    badge: 'Mẫu 2 • Cơ bản+ • Best-seller',
    description: 'Phong cách lãng mạn, hoa lá, nữ tính. Nền nude, pastel pink & champagne hòa quyện hoa hồng, baby breath, lá eucalyptus và cánh hoa bay nhẹ theo scroll.',
    bgClass: 'bg-[#FFFDFD]',
    cardClass: 'bg-white/90 border-[#F2DCDD] text-[#3E2E31]',
    accentColor: '#D97D8A',
    textColor: '#3E2E31',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#C9A86A] border-[#F2DCDD]',
    requiredPlan: 'basic',
    requiredPlanName: 'Gói Cơ Bản (Basic)',
  },
  'vietnamese-modern-luxury': {
    id: 'vietnamese-modern-luxury',
    name: 'Mẫu 1 — Vietnamese Modern Luxury (Flagship)',
    badge: 'Mẫu 1 Flagship • Độc Quyền',
    description: 'Bản sắc Việt đương đại đẳng cấp: sắc đỏ rượu, lụa beige, vàng champagne & đen than. Hoa sen & mây line-art tối giản, triện Hỷ tinh tế, pattern Đông Sơn và timeline song song hợp nhất.',
    bgClass: 'bg-[#F8F4EC]',
    cardClass: 'bg-white/90 border-[#D8BE87]/50 text-[#18181A]',
    accentColor: '#63121D',
    textColor: '#18181A',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#D8BE87] border-[#D8BE87]/40',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
  'classic-luxury': {
    id: 'classic-luxury',
    name: 'Classic Luxury',
    badge: 'Được yêu thích nhất',
    description: 'Phong cách hoàng gia quý phái với tông màu Ivory, Champagne & Vàng Gold sang trọng vượt thời gian.',
    bgClass: 'bg-[#FDFBF7]',
    cardClass: 'bg-white/80 border-[#E8DFC8] text-[#2C2A29]',
    accentColor: '#D4AF37',
    textColor: '#2C2A29',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#D4AF37] border-[#D4AF37]/30',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'minimal-white': {
    id: 'minimal-white',
    name: 'Minimal White',
    badge: 'Phong cách Tối giản',
    description: 'Thiết kế phong cách tạp chí nghệ thuật Châu Âu hiện đại, đường nét thanh mảnh, tinh tế và khoáng đạt.',
    bgClass: 'bg-[#FAFAFA]',
    cardClass: 'bg-white border-neutral-200 text-[#171717]',
    accentColor: '#525252',
    textColor: '#171717',
    headingFont: 'font-display',
    goldAccent: 'text-neutral-800 border-neutral-300',
    requiredPlan: 'basic',
    requiredPlanName: 'Gói Cơ Bản (Basic)',
  },
  'floral-pink': {
    id: 'floral-pink',
    name: 'Floral Pink',
    badge: 'Ngọt ngào & Lãng mạn',
    description: 'Sắc hồng pastel dịu ngọt kết hợp cùng hoa cỏ mùa xuân, mang lại cảm xúc đong đầy tình yêu.',
    bgClass: 'bg-[#FFF9F9]',
    cardClass: 'bg-white/90 border-[#F7D8DC] text-[#3D2C2E]',
    accentColor: '#E29578',
    textColor: '#3D2C2E',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#D97D8A] border-[#F7D8DC]',
    requiredPlan: 'basic',
    requiredPlanName: 'Gói Cơ Bản (Basic)',
  },
  'elegant-black-gold': {
    id: 'elegant-black-gold',
    name: 'Elegant Black & Gold',
    badge: 'Huyền bí & Đẳng cấp',
    description: 'Tương phản ngoạn mục giữa nền đen nhung thượng lưu và ánh kim lấp lánh như dạ tiệc ánh sao.',
    bgClass: 'bg-[#121110]',
    cardClass: 'bg-[#1C1A17]/90 border-[#D4AF37]/30 text-[#F5F2EB]',
    accentColor: '#E5C058',
    textColor: '#F5F2EB',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#E5C058] border-[#E5C058]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'vietnamese-luxury-01': {
    id: 'vietnamese-luxury-01',
    name: 'Hỷ Sự Việt Nam',
    badge: 'Vietnamese Luxury',
    description: 'Phong cách cưới truyền thống Việt Nam cao cấp với sắc đỏ son #9E1B32, vàng kim hoàng gia #C8A45D, hoa sen thanh tao và phong bì hỷ sự trang trọng.',
    bgClass: 'bg-[#F7F1E5]',
    cardClass: 'bg-[#FFFDF8] border-[#C8A45D]/40 text-[#5A4031]',
    accentColor: '#9E1B32',
    textColor: '#5A4031',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#C8A45D] border-[#C8A45D]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'haute-couture': {
    id: 'haute-couture',
    name: 'Vogue Haute Couture',
    badge: 'Editorial Fashion',
    description: 'Phong cách tạp chí thời trang Paris xa hoa, bố cục Editorial bất đối xứng, typography tinh tế cùng trải nghiệm thị giác điện ảnh.',
    bgClass: 'bg-[#0F0E0D]',
    cardClass: 'bg-[#181614] border-[#C5A880]/30 text-[#F5F2EB]',
    accentColor: '#C5A880',
    textColor: '#F5F2EB',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#C5A880] border-[#C5A880]/40',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
  'celestial-royale': {
    id: 'celestial-royale',
    name: 'Celestial Royale (Dạ Khúc Tinh Tú)',
    badge: 'Ultra Luxury Gala',
    description: 'Dạ tiệc cưới dưới bầu trời sao huyền diệu với hiệu ứng stardust lấp lánh, bản đồ chòm sao tình yêu và sắc xanh đêm Midnight Navy quý phái.',
    bgClass: 'bg-[#060A17]',
    cardClass: 'bg-[#0D152D]/85 border-[#E5C378]/30 text-[#FAF6EE]',
    accentColor: '#E5C378',
    textColor: '#FAF6EE',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#E5C378] border-[#E5C378]/40',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
  'chateau-grandeur': {
    id: 'chateau-grandeur',
    name: 'Château Grandeur (Lâu Đài Pháp)',
    badge: 'French Renaissance',
    description: 'Vẻ đẹp tráng lệ của các tòa lâu đài Pháp với vòm kiến trúc hoàng gia, hoa văn gấm quý tộc và sắc xanh xô thơm hòa quyện vàng kim.',
    bgClass: 'bg-[#FBF9F4]',
    cardClass: 'bg-white/90 border-[#D1AC00]/30 text-[#2D312E]',
    accentColor: '#3F5244',
    textColor: '#2D312E',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#C9A84E] border-[#C9A84E]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'luxury-editorial': {
    id: 'luxury-editorial',
    name: 'Luxury Editorial (Tạp Chí Cưới Cao Cấp)',
    badge: 'Editorial High Fashion',
    description: 'Phong cách tạp chí thời trang cưới thượng lưu, bố cục phi đối xứng không viền thẻ, typography khổ lớn phá cách, parallax & animation mượt mà.',
    bgClass: 'bg-[#FBF9F5]',
    cardClass: 'bg-white/80 border-neutral-300 text-[#121212]',
    accentColor: '#1A1A1A',
    textColor: '#121212',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#121212] border-neutral-900',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
  'cinematic-love-story': {
    id: 'cinematic-love-story',
    name: 'Cinematic Love Story (Phim Ngắn Tương Tác)',
    badge: 'Flagship VIP • Điện Ảnh',
    description: 'Trải nghiệm đỉnh cao như một bộ phim ngắn tương tác. Opening điện ảnh màn hình đen, zoom chậm, scroll-driven animation, poster lễ cưới và đoạn kết fade-to-white kỳ diệu.',
    bgClass: 'bg-[#0A0A0A]',
    cardClass: 'bg-[#141414]/90 border-amber-400/30 text-[#F5F5F3]',
    accentColor: '#E6C687',
    textColor: '#F5F5F3',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#E6C687] border-[#E6C687]/40',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
  'cinematic-vietnamese': {
    id: 'cinematic-vietnamese',
    name: 'Sử Thi Hỷ Sự Hoàng Gia (Phim Cưới Truyền Thống)',
    badge: 'Đột Phá • Điện Ảnh Dân Tộc',
    description: 'Tuyệt phẩm kết hợp điện ảnh tương tác đỉnh cao với hồn cốt văn hóa Việt. Khai Ấn Hoàng Triều, Trục Cuộn Tứ Hồi Lương Duyên, Thả Đèn Hoa Đăng Sông Hương, Tráp Sơn Son Khóa Ngọc mừng cưới và Pháo Hoa Đại Hỷ.',
    bgClass: 'bg-[#0A0405]',
    cardClass: 'bg-[#1C0509]/90 border-[#D4AF37]/40 text-[#FAF6EE]',
    accentColor: '#BA1E28',
    textColor: '#FAF6EE',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#D4AF37] border-[#D4AF37]/50',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
  'cinematic-futuristic': {
    id: 'cinematic-futuristic',
    name: 'Kỷ Nguyên Vĩnh Cửu (Phim Cưới Hiện Đại - Tương Lai)',
    badge: 'Siêu Phẩm 2027 • Tương Lai & Đột Phá',
    description: 'Đột phá viễn tưởng tương lai kết hợp tình yêu thời đại số: Khởi động Cổng Không Gian Lượng Tử (Quantum Warp Drive), Đồng Hồ Nhiệm Vụ Vũ Trụ, Dòng Thời Gian Trùng Lỗ Sâu Wormhole, Thẻ Lên Tàu Biometric RSVP, Lò Phản Ứng Năng Lượng Tình Yêu, Khối Lượng Tử VietQR và Vụ Nổ Sao Siêu Mới (Supernova Fireworks).',
    bgClass: 'bg-[#060814]',
    cardClass: 'bg-[#0D122B]/90 border-[#00F0FF]/35 text-[#F1F5F9]',
    accentColor: '#00F0FF',
    textColor: '#F1F5F9',
    headingFont: 'font-futuristic',
    goldAccent: 'text-[#00F0FF] border-[#00F0FF]/40',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
  'passport-love-01': {
    id: 'passport-love-01',
    name: 'Passport – Hộ Chiếu Tình Yêu',
    badge: 'Mẫu 4 Mới • Travel Editorial • Độc Bản',
    description: 'Biến thiệp cưới thành một cuốn hộ chiếu kể lại hành trình tình yêu: Bìa hộ chiếu dập viền vàng, trang nhận diện Identity Page, dấu thị thực Love Approved, vé lên tàu Boarding Pass sang trọng, hành trình bay Love Journey và thẻ điểm đến Next Destination.',
    bgClass: 'bg-[#F5EEDF]',
    cardClass: 'bg-[#FCFAF5] border-[#B99552]/40 text-[#41372F]',
    accentColor: '#651F2A',
    textColor: '#41372F',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#B99552] border-[#B99552]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'love-map-01': {
    id: 'love-map-01',
    name: 'Love Map – Bản Đồ Tình Yêu',
    badge: 'Mẫu 5 Mới • Travel & Storytelling • Độc Bản',
    description: 'Biến toàn bộ thiệp cưới thành bản đồ kể lại hành trình tình yêu của hai người. Đồng bộ tương tác Map ↔ Timeline, postcard kỷ niệm, trạm dừng lễ cưới và bến đỗ vĩnh cửu Forever.',
    bgClass: 'bg-[#F5EFE3]',
    cardClass: 'bg-[#FFFDF9] border-[#B9985A]/40 text-[#443B35]',
    accentColor: '#722238',
    textColor: '#443B35',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#B9985A] border-[#B9985A]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'love-letter-01': {
    id: 'love-letter-01',
    name: 'Mẫu 6 — Bức Thư Tình (Love Letter)',
    badge: 'Mẫu 6 Mới • Thư Tình Viết Tay • Độc Bản',
    description: 'Biến toàn bộ website thành một bức thư tình ấm áp được viết riêng cho khách mời: Trải nghiệm mở phong bì thư cưới, giấy mỹ thuật ngà, chữ viết tay calligraphy, ảnh polaroid kỷ niệm, hoa cỏ line-art và con dấu sáp đỏ thủ công.',
    bgClass: 'bg-[#F7F1E7]',
    cardClass: 'bg-[#FFFDF8] border-[#C8A96B]/35 text-[#59483E]',
    accentColor: '#7A2638',
    textColor: '#59483E',
    headingFont: 'font-handwriting',
    goldAccent: 'text-[#C8A96B] border-[#C8A96B]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'polaroid-scrapbook-01': {
    id: 'polaroid-scrapbook-01',
    name: 'Mẫu 7 — Polaroid / Scrapbook (Album Kỷ Niệm Thủ Công)',
    badge: 'Mẫu 7 Mới • Trẻ Trung & Sáng Tạo • Độc Bản',
    description: 'Thiết kế như một album kỷ niệm thủ công (Scrapbook): Khung ảnh Polaroid viền trắng chân thực, băng dính washi tape pastel, stickers tình yêu, mẩu giấy note viết tay, vé xem phim & vé máy bay du lịch kỷ niệm. Khi cuộn trang, các ảnh xuất hiện với góc nghiêng tự nhiên (-3°, 2°, -1°) như được đặt lên bàn; rê chuột ảnh dựng thẳng sống động.',
    bgClass: 'bg-[#FAF4EB]',
    cardClass: 'bg-[#FFFDF9] border-[#E8DFCE] text-[#423832]',
    accentColor: '#D9735A',
    textColor: '#423832',
    headingFont: 'font-handwriting',
    goldAccent: 'text-[#C89B53] border-[#E8DFCE]',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'vietnamese-fairytale-01': {
    id: 'vietnamese-fairytale-01',
    name: 'Mẫu 8 — Cổ Tích Việt Nam (Modern Folk Art)',
    badge: 'Mẫu 8 Mới • Độc Quyền • Cổ Tích Làng Quê',
    description: 'Template độc quyền lấy cảm hứng từ tranh Đông Hồ, hoa sen, mây cát tường, lũy tre, đàn chim và làng quê Việt Nam dưới phong cách illustration hiện đại. Trải nghiệm Opening cánh cổng làng cổ kính, mở ra câu chuyện tình yêu qua từng chương truyện tranh: Con đường làng, Dưới bóng cây đa, Bên bờ hồ sen, Mái nhà ấm áp và Lễ cưới đại hỷ trọn vẹn.',
    bgClass: 'bg-[#FAF5EB]',
    cardClass: 'bg-[#FFFDF9] border-[#D9CBB7] text-[#351E17]',
    accentColor: '#BA262B',
    textColor: '#351E17',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#E5A93C] border-[#E5A93C]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'lantern-night-01': {
    id: 'lantern-night-01',
    name: 'Mẫu 9 — Thiệp Đèn Lồng (Vietnamese Night Wedding)',
    badge: 'Mẫu 9 Premium • Dạ Tiệc Cưới Đêm • Đèn Lồng Hội An',
    description: 'Thiết kế thiệp cưới đêm huyền ảo (Vietnamese Night Wedding) với tông màu xanh đen và burgundy quý phái. Dàn đèn lồng hai bên đung đưa nhịp nhàng, phát sáng dần và lan tỏa ánh sáng ấm áp khi cuộn trang. Tên cô dâu chú rể nằm giữa hai vì sao dạ quang ✦, đốm sáng đom đóm (firefly/pixel light) lung linh, cùng màn pháo hoa cực nhẹ tinh tế ở cuối trang.',
    bgClass: 'bg-[#070B18]',
    cardClass: 'bg-[#0F1426]/90 border-[#F59E0B]/35 text-[#F3EFE6]',
    accentColor: '#D97706',
    textColor: '#F3EFE6',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#F59E0B] border-[#F59E0B]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'lantern-template': {
    id: 'lantern-template',
    name: 'Mẫu 9 — Thiệp Đèn Lồng (Vietnamese Night Wedding)',
    badge: 'Mẫu 9 Premium • Dạ Tiệc Cưới Đêm • Đèn Lồng Hội An',
    description: 'Thiết kế thiệp cưới đêm huyền ảo (Vietnamese Night Wedding) với tông màu xanh đen và burgundy quý phái. Dàn đèn lồng hai bên đung đưa nhịp nhàng, phát sáng dần và lan tỏa ánh sáng ấm áp khi cuộn trang. Tên cô dâu chú rể nằm giữa hai vì sao dạ quang ✦, đốm sáng đom đóm (firefly/pixel light) lung linh, cùng màn pháo hoa cực nhẹ tinh tế ở cuối trang.',
    bgClass: 'bg-[#070B18]',
    cardClass: 'bg-[#0F1426]/90 border-[#F59E0B]/35 text-[#F3EFE6]',
    accentColor: '#D97706',
    textColor: '#F3EFE6',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#F59E0B] border-[#F59E0B]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'moon-and-lotus': {
    id: 'moon-and-lotus',
    name: 'Mẫu 10 — Thiệp "Trăng & Hoa" (Under The Same Moon)',
    badge: 'Mẫu 10 Mới • Luxury Nghệ Thuật • Premium',
    description: 'Tuyệt tác thiệp cưới luxury mang đậm phong cách nghệ thuật với sắc chuyển huyền ảo Burgundy → Midnight Blue. Trăng dạ nguyệt di chuyển theo bước cuộn, mây cát tường lững lờ trôi và hoa sen nở rộ dần. Đặc biệt đến phần Wedding: vầng trăng hạ cánh ngay chính giữa, tỏa vầng hào quang rực rỡ khắc sâu dấu ấn thiêng liêng: UNDER THE SAME MOON • MINH ANH & NGỌC MAI • 20 • 12 • 2026.',
    bgClass: 'bg-gradient-to-b from-[#350814] via-[#160B24] to-[#060B1C]',
    cardClass: 'bg-[#0E122A]/85 border-[#EBD494]/35 text-[#FDFBF7]',
    accentColor: '#EBD494',
    textColor: '#FDFBF7',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#EBD494] border-[#EBD494]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'moon-lotus-01': {
    id: 'moon-lotus-01',
    name: 'Mẫu 10 — Thiệp "Trăng & Hoa" (Under The Same Moon)',
    badge: 'Mẫu 10 Mới • Luxury Nghệ Thuật • Premium',
    description: 'Tuyệt tác thiệp cưới luxury mang đậm phong cách nghệ thuật với sắc chuyển huyền ảo Burgundy → Midnight Blue. Trăng dạ nguyệt di chuyển theo bước cuộn, mây cát tường lững lờ trôi và hoa sen nở rộ dần. Đặc biệt đến phần Wedding: vầng trăng hạ cánh ngay chính giữa, tỏa vầng hào quang rực rỡ khắc sâu dấu ấn thiêng liêng: UNDER THE SAME MOON • MINH ANH & NGỌC MAI • 20 • 12 • 2026.',
    bgClass: 'bg-gradient-to-b from-[#350814] via-[#160B24] to-[#060B1C]',
    cardClass: 'bg-[#0E122A]/85 border-[#EBD494]/35 text-[#FDFBF7]',
    accentColor: '#EBD494',
    textColor: '#FDFBF7',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#EBD494] border-[#EBD494]/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'love-game': {
    id: 'love-game',
    name: 'Mẫu 11 — Thiệp "Cùng Chơi Một Trò Chơi" (Gen Z Love Quest)',
    badge: 'Mẫu 11 Mới • Gen Z Game Minigame • Premium',
    description: 'Thiết kế thiệp cưới tương tác đỉnh cao dành cho thế hệ Gen Z: "Bạn có muốn khám phá câu chuyện của chúng mình không?". Khách mời chu du qua 5 chặng thử thách (Chuyện tình, Kỷ niệm, Địa điểm, Ngày cưới, Mừng cưới), mỗi lần hoàn thành tích lũy +10 Love Points với hiệu ứng âm thanh và hạt tim bay huyền ảo. Kết thúc hành trình mở khóa vinh danh "LOVE JOURNEY COMPLETED ❤️ MINH ANH + NGỌC MAI 20.12.2026".',
    bgClass: 'bg-[#0C0A17]',
    cardClass: 'bg-[#16132A]/90 border-pink-500/30 text-white',
    accentColor: '#FF6B8B',
    textColor: '#FFFFFF',
    headingFont: 'font-display',
    goldAccent: 'text-amber-400 border-amber-400/40',
    requiredPlan: 'premium',
    requiredPlanName: 'Gói Cao Cấp (Premium)',
  },
  'cyberpunk-hologram': {
    id: 'cyberpunk-hologram',
    name: 'Mẫu 12 — Cyberpunk Hologram 3D (Kỷ Nguyên Hologram)',
    badge: 'Mẫu 12 Mới • 3D Cyber • VIP High-Tech',
    description: 'Bản hòa tấu tương lai đỉnh cao giữa nghệ thuật 3D Hologram, âm thanh Web Audio Synthesizer, album ảnh ma trận ánh sáng, mini-game Love Quest tương tác tích điểm và thiệp mời laser dạ quang sang trọng.',
    bgClass: 'bg-[#050714]',
    cardClass: 'bg-[#0B1026]/80 border-[#00F0FF]/30 text-[#F1F5F9] backdrop-blur-xl',
    accentColor: '#00F0FF',
    textColor: '#F1F5F9',
    headingFont: 'font-futuristic',
    goldAccent: 'text-[#00F0FF] border-[#00F0FF]/40',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
  'royal-ring-vault': {
    id: 'royal-ring-vault',
    name: 'Mẫu 13 — The Royal Ring Vault (Kho Báu Nhẫn Pha Lê 3D VIP)',
    badge: 'Mẫu 13 Mới • 3D WebGL • VIP Hoàng Gia',
    description: 'Tuyệt tác thiệp cưới 3D thượng lưu độc bản: Mở đầu toàn màn hình với Hộp nhẫn pha lê vát cạnh viền vàng hồng hoàng gia 3D (Three.js), cặp nhẫn kim cương Solitaire xoay 360° với hiệu ứng khúc xạ quang phổ 7 màu, khắc tên riêng của khách VIP bằng tia laser vàng phát sáng và bùng nổ bụi vàng cùng hoa nở xoay vòng khi mở nắp hộp.',
    bgClass: 'bg-[#0B090E]',
    cardClass: 'bg-[#141018]/90 border-[#E8B498]/30 text-[#F5EFE6]',
    accentColor: '#E8B498',
    textColor: '#F5EFE6',
    headingFont: 'font-serif-title',
    goldAccent: 'text-[#E8B498] border-[#E8B498]/40',
    requiredPlan: 'vip',
    requiredPlanName: 'Gói Thiết Kế Riêng (VIP)',
  },
};

/**
 * Normalizes a package string into a plan tier level (1: basic, 2: premium, 3: vip)
 */
export function getPlanTierLevel(planIdentifier?: string | number): number {
  if (typeof planIdentifier === 'number') return planIdentifier;
  if (!planIdentifier) return 2; // Default to premium
  const clean = String(planIdentifier).toLowerCase().trim();
  if (
    clean === 'vip' ||
    clean === 'pkg-vip' ||
    clean.includes('vip') || 
    clean.includes('pkg-vip') || 
    clean.includes('thiết kế riêng') ||
    clean.includes('thiet ke rieng') ||
    clean.includes('custom')
  ) return 3;
  if (
    clean === 'premium' ||
    clean === 'pkg-premium' ||
    clean.includes('premium') || 
    clean.includes('pkg-premium') || 
    clean.includes('cao cấp') ||
    clean.includes('cao cap')
  ) return 2;
  if (
    clean === 'basic' ||
    clean === 'pkg-basic' ||
    clean.includes('basic') || 
    clean.includes('pkg-basic') || 
    clean.includes('cơ bản') ||
    clean.includes('co ban') ||
    clean.includes('tieu chuan')
  ) return 1;
  return 2; // Default premium
}

/**
 * Returns human-readable label for a plan tier
 */
export function getPlanTierName(planIdentifier?: string | number): string {
  const level = getPlanTierLevel(planIdentifier);
  if (level >= 3) return 'Gói Thiết Kế Riêng (VIP)';
  if (level === 2) return 'Gói Cao Cấp (Premium)';
  return 'Gói Cơ Bản (Basic)';
}

function getStoredCommercialTemplatesFallback(): any[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('lamour_commercial_templates');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

/**
 * Checks if a specific template is unlocked for the user's plan tier.
 * If the couple is currently already using this template, it is always treated as allowed.
 */
export function isTemplateAllowedForPlan(
  templateId: TemplateId,
  userPlanIdentifier?: string | number,
  currentTemplateId?: TemplateId,
  commercialTemplates?: any[]
): boolean {
  if (currentTemplateId && templateId === currentTemplateId) return true;
  const userLevel = typeof userPlanIdentifier === 'number'
    ? userPlanIdentifier
    : getPlanTierLevel(userPlanIdentifier);
  const requiredPlan = getTemplateRequiredPlan(templateId, commercialTemplates);
  const requiredLevel = getPlanTierLevel(requiredPlan);
  return userLevel >= requiredLevel;
}

/**
 * Returns the required package plan tier ('basic' | 'premium' | 'vip') for a template slug or ID.
 * Dynamically prioritizes admin-configured commercial template settings!
 */
export function getTemplateRequiredPlan(
  templateSlugOrId: string,
  commercialTemplates?: any[]
): 'basic' | 'premium' | 'vip' {
  const candidateList =
    (commercialTemplates && Array.isArray(commercialTemplates) && commercialTemplates.length > 0)
      ? commercialTemplates
      : getStoredCommercialTemplatesFallback();

  if (candidateList && Array.isArray(candidateList)) {
    const cleanId = String(templateSlugOrId || '').toLowerCase().trim();
    const commercial = candidateList.find((t) => {
      const slug = String(t.slug || '').toLowerCase().trim();
      const id = String(t.id || '').toLowerCase().trim();
      const demoSlug = String(t.demoSlug || '').toLowerCase().trim();
      return (
        slug === cleanId ||
        id === cleanId ||
        demoSlug === cleanId ||
        id === `tpl-${cleanId}` ||
        `tpl-${slug}` === cleanId ||
        slug === cleanId.replace(/^tpl-/, '')
      );
    });

    if (commercial) {
      if (commercial.requiredPlan === 'vip' || commercial.requiredPlan === 'premium' || commercial.requiredPlan === 'basic') {
        return commercial.requiredPlan;
      }
      if (commercial.packageId) {
        if (commercial.packageId.includes('vip')) return 'vip';
        if (commercial.packageId.includes('basic')) return 'basic';
        if (commercial.packageId.includes('premium')) return 'premium';
      }
      if (commercial.packageName) {
        const lower = commercial.packageName.toLowerCase();
        if (lower.includes('vip') || lower.includes('thiết kế riêng')) return 'vip';
        if (lower.includes('basic') || lower.includes('cơ bản')) return 'basic';
        if (lower.includes('premium') || lower.includes('cao cấp')) return 'premium';
      }
      if (commercial.price >= 700000) return 'vip';
      if (commercial.price >= 450000) return 'premium';
      return 'basic';
    }
  }

  const tmpl = TEMPLATES[templateSlugOrId as TemplateId];
  if (tmpl?.requiredPlan) return tmpl.requiredPlan;

  const clean = (templateSlugOrId || '').toLowerCase();
  if (
    clean.includes('vip') ||
    clean.includes('modern-luxury') ||
    clean.includes('haute') ||
    clean.includes('celestial') ||
    clean.includes('cinematic') ||
    clean.includes('futuristic') ||
    clean.includes('editorial')
  ) {
    return 'vip';
  }
  if (
    clean.includes('traditional') ||
    clean.includes('classic') ||
    clean.includes('luxury') ||
    clean.includes('chateau') ||
    clean.includes('gold') ||
    clean.includes('passport') ||
    clean.includes('love-map') ||
    clean.includes('love-letter') ||
    clean.includes('polaroid') ||
    clean.includes('scrapbook') ||
    clean.includes('fairytale') ||
    clean.includes('co-tich') ||
    clean.includes('lantern') ||
    clean.includes('den-long') ||
    clean.includes('night-wedding') ||
    clean.includes('moon') ||
    clean.includes('trang') ||
    clean.includes('lotus') ||
    clean.includes('hoa-sen') ||
    clean.includes('tree') ||
    clean.includes('cay-tinh-yeu') ||
    clean.includes('game') ||
    clean.includes('love-game') ||
    clean.includes('tro-choi')
  ) {
    return 'premium';
  }
  return 'basic';
}

/**
 * Returns dynamic template themes synced with admin commercial template configuration
 */
export function getEffectiveTemplateThemes(
  commercialTemplates?: any[]
): Record<TemplateId, TemplateTheme> {
  const result: Record<TemplateId, TemplateTheme> = { ...TEMPLATES };
  for (const key of Object.keys(TEMPLATES) as TemplateId[]) {
    const reqPlan = getTemplateRequiredPlan(key, commercialTemplates);
    result[key] = {
      ...result[key],
      requiredPlan: reqPlan,
      requiredPlanName: getPlanTierName(reqPlan),
    };
  }
  return result;
}
