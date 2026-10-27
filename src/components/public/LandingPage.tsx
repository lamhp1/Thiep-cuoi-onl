import React from 'react';
import {
  Sparkles,
  Heart,
  ArrowRight,
  CheckCircle2,
  Music,
  MapPin,
  QrCode,
  Image,
  Calendar,
  MessageSquareHeart,
  Eye,
  ShieldCheck,
  ChevronDown,
  Clock,
  Send,
  PhoneCall,
} from 'lucide-react';
import { CommercialPackage, CommercialTemplate, SiteContentConfig } from '../../types/commercial';
import { WeddingData } from '../../types';
import { getTemplateRequiredPlan } from '../../data/templates';
import { fetchSiteContentConfigFromFirestore, getSiteContentConfig } from '../../services/siteConfigService';

interface LandingPageProps {
  packages: CommercialPackage[];
  templates: CommercialTemplate[];
  onNavigate: (path: string) => void;
  siteContent?: SiteContentConfig;
  demoWedding?: WeddingData;
}

export function LandingPage({ packages, templates, onNavigate, siteContent, demoWedding }: LandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);
  const [content, setContent] = React.useState<SiteContentConfig>(siteContent || getSiteContentConfig());

  React.useEffect(() => {
    if (siteContent) {
      setContent(siteContent);
    }
  }, [siteContent]);

  React.useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContentConfig>;
      if (customEvent.detail) setContent(customEvent.detail);
      else setContent(getSiteContentConfig());
    };
    window.addEventListener('lamour_site_content_updated', handleUpdate);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('lamour_wedding_sync');
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'SITE_CONTENT_UPDATED' && ev.data?.config) {
          setContent(ev.data.config);
        }
      };
    } catch {}

    fetchSiteContentConfigFromFirestore().then((remote) => {
      if (remote) setContent(remote);
    });

    return () => {
      window.removeEventListener('lamour_site_content_updated', handleUpdate);
      if (bc) {
        try { bc.close(); } catch {}
      }
    };
  }, []);
  const cleanPhone = (content.hotline || '0905 123 456').replace(/\s+/g, '');

  const faqs = [
    {
      q: 'Khách mời xem thiệp cưới online có cần tải ứng dụng không?',
      a: 'Hoàn toàn không cần tải bất kỳ ứng dụng nào! Khách mời chỉ cần nhấp vào đường link thiệp cưới (qua Zalo, Facebook, SMS) là có thể mở thiệp mượt mà trên mọi điện thoại (iPhone, Android) hoặc máy tính.',
    },
    {
      q: 'Sau khi thanh toán, bao lâu tôi nhận được tài khoản chỉnh sửa thiệp?',
      a: 'Sau khi Admin xác nhận thanh toán (thường trong vòng 15-30 phút), hệ thống sẽ kích hoạt tài khoản và tạo sẵn thiệp theo mẫu bạn chọn. Bạn có thể đăng nhập ngay để cập nhật ảnh cưới, thời gian, địa điểm và câu chuyện tình yêu.',
    },
    {
      q: 'Tôi có thể đổi ảnh hoặc sửa thông tin sau khi đã chia sẻ thiệp không?',
      a: 'Có, bạn có thể chỉnh sửa không giới hạn mọi lúc! Ngay khi bạn bấm lưu trong trang quản trị, link thiệp gửi khách mời sẽ tự động cập nhật nội dung mới nhất ngay lập tức mà không cần gửi lại link.',
    },
    {
      q: 'Tính năng quét mã QR mừng cưới hoạt động như thế nào?',
      a: 'Hệ thống tích hợp chuẩn VietQR cho hơn 40 ngân hàng tại Việt Nam (VCB, TCB, MB, ACB, BIDV...). Khách mời mở app ngân hàng quét là tự động điền đúng số tài khoản, tên chủ thẻ và lời chúc mừng cưới mà không sợ chuyển nhầm.',
    },
    {
      q: 'Nếu đám cưới của tôi hoãn hoặc cần gia hạn lưu giữ kỷ niệm thì sao?',
      a: 'Gói dịch vụ đã bao gồm thời hạn lưu trữ từ 3 đến 12 tháng. Khi cần gia hạn, bạn chỉ cần bấm "Gia hạn thiệp" trong bảng điều khiển hoặc liên hệ Admin với chi phí hỗ trợ rất ưu đãi.',
    },
  ];

  const coreFeatures = [
    {
      icon: <QrCode className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Mừng Cưới VietQR Thông Minh',
      desc: 'Tích hợp mã QR của 40+ ngân hàng Việt Nam, quét 1 giây là chuyển tiền mừng chính xác tuyệt đối.',
    },
    {
      icon: <MessageSquareHeart className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Sổ Lưu Bút & Lời Chúc Real-time',
      desc: 'Bạn bè, người thân phương xa có thể gửi những lời chúc phúc ngọt ngào hiển thị trực tiếp trên thiệp.',
    },
    {
      icon: <Calendar className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Xác Nhận Tham Dự (RSVP)',
      desc: 'Nắm chính xác số lượng khách tham dự tiệc cưới để chủ động đặt bàn tiệc, tránh phát sinh lãng phí.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Bản Đồ Chỉ Đường 1 Chạm',
      desc: 'Liên kết trực tiếp Google Maps giúp khách mời tìm đến nhà hàng, tư gia chính xác, không lo lạc đường.',
    },
    {
      icon: <Image className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Album Ảnh Cưới HD Sắc Nét',
      desc: 'Trưng bày trọn vẹn bộ ảnh Pre-wedding và phóng to vuốt chạm mượt mà như xem trên tạp chí cao cấp.',
    },
    {
      icon: <Music className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Nhạc Nền Lãng Mạn Tùy Chọn',
      desc: 'Tự động hòa tấu những bản tình ca piano du dương, chạm đến cảm xúc sâu lắng của mọi khách mời.',
    },
  ];

  const testimonials = [
    {
      couple: 'Minh Anh & Ngọc Mai',
      location: 'Huế & Đà Nẵng',
      quote:
        'Thiệp cưới online L’Amour làm ai nhận được cũng trầm trồ khen ngợi vì quá đẹp và sang trọng! Tính năng RSVP giúp vợ chồng mình kiểm soát chính xác 280 khách để chốt số bàn tiệc hoàn hảo.',
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
    },
    {
      couple: 'Tuấn Kiệt & Thùy Dung',
      location: 'TP. Hồ Chí Minh',
      quote:
        'Bạn bè mình ở xa và nước ngoài rất thích tính năng VietQR và gửi lời chúc trực tiếp. Admin tư vấn rất nhiệt tình, tạo tài khoản và hướng dẫn đổi ảnh nhanh chóng.',
      image:
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80',
    },
    {
      couple: 'Hoàng Long & Khánh Vy',
      location: 'Hà Nội',
      quote:
        'Thay vì tốn hơn 10 triệu in thiệp giấy mà nhiều người bận không tới được, mình dùng thiệp online gửi bạn bè cực kỳ tiện, hiện đại và tiết kiệm đến 80% ngân sách.',
      image:
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="bg-[#FDFBF7] text-[#2C2A29]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Background decorative glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-linear-to-b from-[#F3EDE2] to-transparent rounded-full blur-3xl -z-10 opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & Value Proposition */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#8C7335] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#B38F26]" />
                <span>Nền Tảng Thiệp Cưới Online Thế Hệ Mới</span>
              </div>

              <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl text-[#1A1816] font-bold leading-tight">
                {content.heroHeading ? (
                  <span className="whitespace-pre-line">{content.heroHeading}</span>
                ) : (
                  <>
                    Thiệp Cưới Online Sang Trọng, <br />
                    <span className="font-script text-5xl sm:text-6xl lg:text-7xl text-[#B38F26] font-normal lowercase">
                      chạm trọn vẹn
                    </span>{' '}
                    cảm xúc khách mời.
                  </>
                )}
              </h1>

              <p className="font-body text-base sm:text-lg text-[#5E564F] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {content.heroSubheading ||
                  'Tạm biệt sự bất tiện của thiệp giấy truyền thống. Gửi thiệp cưới điện tử tinh xảo qua Zalo & Facebook với đầy đủ album ảnh cưới HD, âm nhạc du dương, chỉ đường 1 chạm và xác nhận RSVP tức thì.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-order-primary-btn"
                  onClick={() => onNavigate('/order')}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-body text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{content.heroCtaText || 'Đặt Thiệp Cưới Ngay'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-view-templates-btn"
                  onClick={() => onNavigate('/templates')}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-[#FAF6EE] text-[#4A4540] hover:text-[#1A1816] font-body text-sm font-semibold border border-[#EADFC7] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#D4AF37]" />
                  <span>Xem 5+ Mẫu Thiệp Đẹp</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#EADFC7]/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#786C5E]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Chỉ từ <strong>299.000 VNĐ</strong> / trọn gói</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Kích hoạt nhanh trong <strong>2 giờ</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Hơn <strong>1.200+</strong> cặp đôi tin dùng</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Phone Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px]">
                {/* Gold glowing backing card */}
                <div className="absolute inset-0 bg-linear-to-tr from-[#D4AF37]/30 to-[#EADFC7]/50 rounded-[48px] transform rotate-3 scale-105 filter blur-xs -z-10" />

                {/* Smartphone Device Frame */}
                <div className="relative rounded-[40px] bg-[#1A1816] p-3 shadow-2xl border-4 border-[#3D3833]">
                  {/* Speaker & camera pill notch */}
                  <div className="w-24 h-4 bg-[#2C2825] rounded-full mx-auto mb-2" />

                  {/* Inside Screen Content */}
                  <div className="rounded-[30px] overflow-hidden bg-[#FDFBF7] border border-[#EADFC7]/80 text-[#2C2A29] p-4 text-center space-y-3">
                    <div className="h-44 rounded-2xl overflow-hidden relative shadow-inner">
                      <img
                        src={demoWedding?.coverImage || demoWedding?.gallery?.[0]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'}
                        alt="Wedding couple"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end justify-center p-3">
                        <span className="text-white font-script text-2xl drop-shadow-md">
                          {demoWedding?.groomName && demoWedding?.brideName
                            ? `${demoWedding.groomName} & ${demoWedding.brideName}`
                            : 'Minh Anh & Ngọc Mai'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="font-body text-[10px] tracking-widest uppercase text-[#B38F26] font-semibold">
                        Lời Mời Thành Hôn
                      </p>
                      <p className="font-serif-title text-base font-bold text-[#1A1816]">
                        {demoWedding?.weddingDate || '20 Tháng 12, 2026'}
                      </p>
                      <p className="font-body text-[11px] text-neutral-500 line-clamp-1">
                        {demoWedding?.events?.[0]?.locationName || demoWedding?.events?.[0]?.address || 'Trung Tâm Yến Tiệc Hoàng Gia Imperial, TP. Huế'}
                      </p>
                    </div>

                    {/* Mini RSVP & QR buttons mockup */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="py-2 px-1 rounded-lg bg-[#EADFC7]/40 text-[10px] font-semibold text-[#8C7335] flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Xác nhận dự tiệc</span>
                      </div>
                      <div className="py-2 px-1 rounded-lg bg-[#D4AF37] text-white text-[10px] font-semibold flex items-center justify-center gap-1 shadow-xs">
                        <QrCode className="w-3 h-3" />
                        <span>Mừng cưới QR</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => onNavigate(demoWedding?.slug ? `/wedding/${demoWedding.slug}` : '/demo/classic-luxury')}
                        className="w-full py-2 rounded-full border border-[#D4AF37] text-[#8C7335] hover:bg-[#D4AF37] hover:text-white transition-colors text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Xem mẫu thử thực tế</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE / STATS SECTION */}
      <section className="py-12 bg-white border-y border-[#EADFC7]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-serif-title text-3xl sm:text-4xl text-[#B38F26] font-bold">80%</p>
              <p className="font-body text-xs text-[#5E564F] mt-1">Tiết kiệm chi phí in ấn</p>
            </div>
            <div>
              <p className="font-serif-title text-3xl sm:text-4xl text-[#B38F26] font-bold">1 Giây</p>
              <p className="font-body text-xs text-[#5E564F] mt-1">Gửi tức thì qua Zalo, SMS</p>
            </div>
            <div>
              <p className="font-serif-title text-3xl sm:text-4xl text-[#B38F26] font-bold">100%</p>
              <p className="font-body text-xs text-[#5E564F] mt-1">Tương thích mọi thiết bị</p>
            </div>
            <div>
              <p className="font-serif-title text-3xl sm:text-4xl text-[#B38F26] font-bold">24/7</p>
              <p className="font-body text-xs text-[#5E564F] mt-1">Hỗ trợ kỹ thuật chu đáo</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TEMPLATES SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="font-body text-xs uppercase tracking-widest text-[#B38F26] font-semibold">
            Bộ Sưu Tập Xu Hướng 2026
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#1A1816] font-bold">
            Mẫu Thiệp Cưới Tinh Tế & Đẳng Cấp
          </h2>
          <p className="font-body text-sm sm:text-base text-[#5E564F]">
            Mỗi mẫu thiệp được thiết kế tỉ mỉ theo từng ngôn ngữ cảm xúc riêng biệt: từ cổ điển hoàng gia, tối giản hiện đại cho đến sắc hoa mùa xuân ngọt ngào.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates
            .filter((tpl) => {
              if (tpl.active === false) return false;
              const slug = (tpl.slug || '').toLowerCase();
              const id = (tpl.id || '').toLowerCase();
              const name = (tpl.name || '').toLowerCase();
              return (
                slug !== 'tree-of-love' &&
                slug !== 'tree-of-love-01' &&
                id !== 'tpl-tree-of-love-01' &&
                id !== 'tree-of-love' &&
                !name.includes('cây tình yêu') &&
                !name.includes('the tree of love')
              );
            })
            .slice(0, 6)
            .map((tpl, idx) => (
            <div
              key={`${tpl.id || tpl.slug}-${idx}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EADFC7] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Preview Container */}
              <div className="relative h-64 overflow-hidden bg-neutral-100">
                <img
                  src={tpl.previewImage}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#181615]/85 text-[#E5C058] text-[11px] font-semibold uppercase tracking-wider backdrop-blur-xs whitespace-nowrap">
                    {tpl.badge || tpl.style}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  {(() => {
                    const reqPlan = getTemplateRequiredPlan(tpl.slug, templates);
                    if (reqPlan === 'vip') {
                      return (
                        <span className="px-2.5 py-1 rounded-lg bg-linear-to-r from-[#2A1706] to-[#45220B] text-[#F9D776] border border-[#D4AF37]/50 text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                          <Sparkles className="w-3.5 h-3.5 text-[#F9D776]" />
                          <span>Gói VIP</span>
                        </span>
                      );
                    }
                    if (reqPlan === 'premium') {
                      return (
                        <span className="px-2.5 py-1 rounded-lg bg-linear-to-r from-[#181615] to-[#2E2822] text-[#E5C058] border border-[#D4AF37]/40 text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                          <Sparkles className="w-3.5 h-3.5 text-[#E5C058]" />
                          <span>Gói Premium</span>
                        </span>
                      );
                    }
                    return (
                      <span className="px-2.5 py-1 rounded-lg bg-linear-to-r from-[#0F291E] to-[#184631] text-[#7CE4B5] border border-emerald-500/40 text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#7CE4B5]" />
                        <span>Gói Basic</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Content Description */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-[#1A1816] group-hover:text-[#B38F26] transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="font-body text-xs text-[#786C5E] mt-1.5 leading-relaxed line-clamp-2">
                    {tpl.description}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-[#5E564F]">
                    {tpl.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#EADFC7]/60 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onNavigate(`/demo/${tpl.slug}`)}
                    className="py-2.5 px-3 rounded-xl border border-[#D4AF37]/60 text-[#8C7335] hover:bg-[#FAF6EE] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem Demo</span>
                  </button>

                  <button
                    onClick={() => {
                      const reqPlan = getTemplateRequiredPlan(tpl.slug, templates);
                      onNavigate(`/order?template=${tpl.slug}&package=${reqPlan}`);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#B38F26] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Chọn Mẫu</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/templates')}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-[#FAF6EE] border border-[#D4AF37] text-[#8C7335] font-body text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>Khám Phá Toàn Bộ 5+ Mẫu Thiệp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. CORE FEATURES SHOWCASE */}
      <section className="py-20 bg-[#F6F1E7]/60 border-t border-[#EADFC7]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="font-body text-xs uppercase tracking-widest text-[#B38F26] font-semibold">
              Trải Nghiệm Tương Tác Vượt Trội
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#1A1816] font-bold">
              {content.featuresHeading || 'Tính Năng Hiện Đại Dành Riêng Cho Đám Cưới'}
            </h2>
            <p className="font-body text-sm sm:text-base text-[#5E564F]">
              Mọi tương tác đều được tối ưu thông minh trên ngón tay của khách mời, mang lại sự hào hứng và trân trọng ngày vui của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-[#EADFC7] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] border border-[#D4AF37]/30 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-serif-title text-xl font-bold text-[#1A1816]">
                  {feat.title}
                </h3>
                <p className="font-body text-xs text-[#5E564F] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="font-body text-xs uppercase tracking-widest text-[#B38F26] font-semibold">
            Bảng Giá Dịch Vụ Minh Bạch
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#1A1816] font-bold">
            {content.pricingHeading || 'Chi Phí Trọn Gói, Không Phát Sinh'}
          </h2>
          <p className="font-body text-sm sm:text-base text-[#5E564F]">
            Lựa chọn gói thiệp phù hợp với nhu cầu của hai bạn. Kích hoạt 1 lần sử dụng trọn vẹn suốt mùa cưới.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                pkg.isPopular
                  ? 'bg-white border-2 border-[#D4AF37] shadow-xl relative scale-100 lg:-translate-y-2'
                  : 'bg-white/80 border border-[#EADFC7] shadow-xs hover:shadow-md'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 w-max max-w-[90%]">
                  <span className="px-4 py-1 rounded-full bg-linear-to-r from-[#C29D2C] to-[#E5C058] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap inline-block text-center">
                    {pkg.badge || 'Khuyên Dùng Nhất'}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-title text-2xl font-bold text-[#1A1816]">
                    {pkg.name}
                  </h3>
                  <p className="font-body text-xs text-[#786C5E] mt-1">
                    {pkg.description}
                  </p>
                </div>

                <div className="border-y border-[#EADFC7]/60 py-4 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif-title text-4xl font-bold text-[#B38F26]">
                      {pkg.price.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500 uppercase">
                      VNĐ / trọn gói
                    </span>
                  </div>
                  {pkg.originalPrice && (
                    <p className="text-xs text-neutral-400 line-through">
                      Giá gốc: {pkg.originalPrice.toLocaleString('vi-VN')} VNĐ
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-1">
                    <span className="font-medium text-[#2E7D32]">
                      Thời hạn lưu trữ: {pkg.durationMonths} tháng
                    </span>
                    <span className="font-bold text-[#8C7335] bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                      {pkg.albumPhotoLimit || (pkg.slug === 'vip' ? 100 : pkg.slug === 'premium' ? 60 : 40)} ảnh album (chung)
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-[#4A4540]">
                  {pkg.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigate(`/order?package=${pkg.slug}`)}
                  className={`w-full py-3.5 rounded-full font-body text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.isPopular
                      ? 'bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white shadow-md hover:shadow-lg'
                      : 'bg-[#FAF6EE] hover:bg-[#EADFC7] text-[#8C7335] border border-[#D4AF37]/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chọn Gói {pkg.name.split('(')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('/pricing')}
            className="text-xs font-semibold text-[#8C7335] hover:text-[#B38F26] underline tracking-wide cursor-pointer"
          >
            Xem bảng so sánh chi tiết tính năng giữa các gói →
          </button>
        </div>
      </section>

      {/* 6. HOW IT WORKS / BUSINESS PROCESS */}
      <section id="process" className="py-20 bg-white border-t border-[#EADFC7]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="font-body text-xs uppercase tracking-widest text-[#B38F26] font-semibold">
              Quy Trình Đơn Giản & Chu Đáo
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#1A1816] font-bold">
              5 Bước Sở Hữu Thiệp Cưới Trong Mơ
            </h2>
            <p className="font-body text-sm sm:text-base text-[#5E564F]">
              Admin trực tiếp tư vấn và tạo đơn hàng. Bạn chỉ việc cung cấp thông tin và tận hưởng ngày vui trọn vẹn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Chọn Mẫu & Gói',
                desc: 'Xem trước các mẫu thiệp thực tế và chọn gói dịch vụ phù hợp với ngân sách của bạn.',
              },
              {
                step: '02',
                title: 'Gửi Thông Tin',
                desc: 'Điền tên cô dâu chú rể, số điện thoại để Admin tiếp nhận yêu cầu và liên hệ tư vấn.',
              },
              {
                step: '03',
                title: 'Thanh Toán VietQR',
                desc: 'Admin tạo đơn hàng, bạn quét mã QR chuyển khoản nhanh chóng và an toàn 100%.',
              },
              {
                step: '04',
                title: 'Nhận Tài Khoản & Sửa Thiệp',
                desc: 'Admin kích hoạt tài khoản cặp đôi để bạn đăng nhập cập nhật ảnh cưới, timeline tiệc.',
              },
              {
                step: '05',
                title: 'Xuất Bản & Gửi Thiệp',
                desc: 'Nhận link thiệp độc quyền (vd: /wedding/minh-anh) để gửi ngay cho người thân, bạn bè.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#EADFC7] text-center space-y-3 relative group hover:border-[#D4AF37] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#B38F26] font-serif-title font-bold text-base flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h4 className="font-serif-title text-lg font-bold text-[#1A1816]">
                  {item.title}
                </h4>
                <p className="font-body text-xs text-[#5E564F] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-20 bg-[#FAF6EE] border-t border-[#EADFC7]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="font-body text-xs uppercase tracking-widest text-[#B38F26] font-semibold">
              Niềm Vui Khách Hàng
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl text-[#1A1816] font-bold">
              Câu Chuyện Của Các Cặp Đôi
            </h2>
            <p className="font-body text-sm text-[#5E564F]">
              Đồng hành cùng hơn 1.200 đám cưới hạnh phúc trên khắp các tỉnh thành cả nước.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-[#EADFC7] shadow-xs flex flex-col justify-between space-y-6"
              >
                <p className="font-serif-title italic text-sm sm:text-base text-[#4A4540] leading-relaxed">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#EADFC7]/60">
                  <img
                    src={item.image}
                    alt={item.couple}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-serif-title font-bold text-base text-[#1A1816]">
                      {item.couple}
                    </h4>
                    <p className="font-body text-xs text-neutral-500">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="font-body text-xs uppercase tracking-widest text-[#B38F26] font-semibold">
            Giải Đáp Thắc Mắc
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl text-[#1A1816] font-bold">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="font-body text-sm text-[#5E564F]">
            Nếu có câu hỏi khác, bạn có thể gọi trực tiếp Hotline {content.hotline || '0905 123 456'} để được giải đáp tức thì.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#EADFC7] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-serif-title text-base sm:text-lg font-bold text-[#1A1816] hover:text-[#B38F26] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#B38F26] shrink-0 transition-transform duration-300 ${
                    openFaqIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-6 pb-5 pt-1 font-body text-xs sm:text-sm text-[#5E564F] leading-relaxed border-t border-[#EADFC7]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="py-16 bg-[#181615] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="font-script text-3xl sm:text-4xl text-[#D4AF37]">
            Love is the greatest adventure
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F2EB]">
            {content.ctaBannerHeading || 'Sẵn Sàng Cho Một Đám Cưới Đáng Nhớ?'}
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#A8A199] max-w-xl mx-auto leading-relaxed">
            {content.ctaBannerSubheading ||
              'Chỉ mất 2 phút để gửi yêu cầu đặt thiệp. Chúng tôi sẽ liên hệ tư vấn mẫu phù hợp nhất với phong cách của hai bạn ngay hôm nay.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="bottom-cta-order-btn"
              onClick={() => onNavigate('/order')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-body text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gửi Yêu Cầu Đặt Thiệp</span>
            </button>

            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-body text-xs font-semibold border border-neutral-700 transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
              <span>Gọi Tư Vấn: {content.hotline || '0905 123 456'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
