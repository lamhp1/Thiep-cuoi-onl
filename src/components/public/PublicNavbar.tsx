import React, { useState, useEffect } from 'react';
import { Heart, Menu, X, Sparkles, Phone, ShieldCheck, ArrowRight, Megaphone } from 'lucide-react';
import { SiteContentConfig } from '../../types/commercial';
import { getSiteContentConfig } from '../../services/siteConfigService';

interface PublicNavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  siteContent?: SiteContentConfig;
}

export function PublicNavbar({ currentPath, onNavigate, siteContent }: PublicNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [content, setContent] = useState<SiteContentConfig>(siteContent || getSiteContentConfig());

  useEffect(() => {
    if (siteContent) {
      setContent(siteContent);
    }
  }, [siteContent]);

  useEffect(() => {
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

    return () => {
      window.removeEventListener('lamour_site_content_updated', handleUpdate);
      if (bc) {
        try { bc.close(); } catch {}
      }
    };
  }, []);

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Mẫu thiệp', path: '/templates' },
    { label: 'Bảng giá', path: '/pricing' },
    { label: 'Quy trình', path: '/#process' },
    { label: 'Hỏi đáp (FAQ)', path: '/#faq' },
  ];

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.replace('/#', ''));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(path.replace('/#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    onNavigate(path);
  };

  const cleanPhone = (content.hotline || '0905 123 456').replace(/\s+/g, '');

  return (
    <header className="sticky top-0 z-50 transition-all">
      {/* 1. Promotional Announcement Bar (if enabled by admin) */}
      {content.bannerEnabled && content.bannerText && (
        <div className="bg-[#181615] text-[#FAF6EE] text-xs py-2 px-4 border-b border-[#D4AF37]/30 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="bg-linear-to-r from-[#D4AF37] to-[#B38F26] text-black font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-2xs">
                {content.bannerBadge || 'Ưu Đãi'}
              </span>
              <span className="text-neutral-200 truncate text-[11px] sm:text-xs">
                {content.bannerText}
              </span>
            </div>

            <button
              onClick={() => onNavigate('/order')}
              className="text-[#D4AF37] hover:text-[#F3DF95] text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <span>Xem Ngay</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EADFC7]/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <button
              id="nav-logo-btn"
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#EADFC7] to-[#D4AF37] p-0.5 shadow-sm transition-transform group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-[#1A1816] flex items-center justify-center">
                  <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                </div>
              </div>
              <div>
                <span className="font-script text-2xl sm:text-3xl text-[#D4AF37] leading-none block">
                  {content.brandName || "L'Amour Wedding"}
                </span>
                <span className="font-body text-[10px] tracking-[0.22em] text-[#786C5E] uppercase font-semibold block line-clamp-1">
                  {content.brandTagline || 'Thiệp Cưới Online Cao Cấp'}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`font-body text-sm font-medium tracking-wide transition-colors cursor-pointer py-1 ${
                      isActive
                        ? 'text-[#B38F26] border-b-2 border-[#D4AF37]'
                        : 'text-[#4A4540] hover:text-[#1A1816]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Right CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#786C5E] hover:text-[#B38F26] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{content.hotline || '0905 123 456'}</span>
              </a>

              <button
                id="nav-lookup-btn"
                onClick={() => onNavigate('/lookup')}
                className="text-xs font-medium text-[#5E564F] hover:text-[#1A1816] px-3 py-2 rounded-lg hover:bg-[#F3EDE2] transition-colors cursor-pointer"
                title="Tra cứu đơn hàng và quản lý thiệp"
              >
                Tra Cứu Đơn
              </button>

              <button
                id="nav-order-cta-btn"
                onClick={() => onNavigate('/order')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#C29D2C] to-[#E5C058] hover:from-[#B38F26] hover:to-[#D4AF37] text-white font-body text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đặt Thiệp Cưới</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="nav-mobile-order-btn"
                onClick={() => onNavigate('/order')}
                className="px-3 py-1.5 rounded-full bg-[#D4AF37] text-white text-[11px] font-semibold uppercase tracking-wider shadow-xs"
              >
                Đặt Thiệp
              </button>

              <button
                id="nav-mobile-menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-[#4A4540] hover:text-[#1A1816] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#FDFBF7] border-b border-[#EADFC7] px-4 pt-2 pb-6 space-y-3 shadow-xl">
            <div className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                    currentPath === link.path
                      ? 'bg-[#EADFC7]/50 text-[#8C7335] font-semibold'
                      : 'text-[#4A4540] hover:bg-[#F3EDE2]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#EADFC7] space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#786C5E] px-1 py-1">
                <span>Hotline:</span>
                <a href={`tel:${cleanPhone}`} className="font-bold text-[#B38F26]">
                  {content.hotline || '0905 123 456'}
                </a>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('/order');
                }}
                className="w-full py-3 rounded-full bg-linear-to-r from-[#C29D2C] to-[#E5C058] text-white font-body text-xs font-semibold uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đặt Thiệp Cưới Ngay</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('/lookup');
                }}
                className="w-full py-2.5 rounded-full bg-white border border-[#EADFC7] text-[#4A4540] font-body text-xs font-medium text-center shadow-2xs block"
              >
                Tra Cứu Đơn Hàng & Thiệp Của Tôi
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
