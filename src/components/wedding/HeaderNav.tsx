import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Settings } from 'lucide-react';

interface HeaderNavProps {
  groomName: string;
  brideName: string;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  accentColor?: string;
  hasStories?: boolean;
}

export function HeaderNav({
  groomName,
  brideName,
  onNavigateToAdmin,
  isOwnerMode = false,
  hasStories = true,
}: HeaderNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Trang chủ', href: '#hero' },
    { label: 'Cặp đôi', href: '#couple' },
    ...(hasStories ? [{ label: 'Câu chuyện', href: '#story' }] : []),
    { label: 'Sự kiện', href: '#events' },
    { label: 'Album ảnh', href: '#gallery' },
    { label: '📸 Ảnh ngày cưới', href: '#live-album', isLiveAlbum: true },
    { label: 'Mừng cưới', href: '#gift' },
    { label: 'Xác nhận (RSVP)', href: '#rsvp' },
    { label: 'Lời chúc', href: '#wishes' },
  ];

  const handleNavClick = (href: string, isLiveAlbum?: boolean) => {
    setMobileMenuOpen(false);
    if (isLiveAlbum) {
      window.dispatchEvent(new CustomEvent('lamour_open_live_album'));
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const monogram = `${groomName.charAt(0) || 'M'} & ${brideName.charAt(0) || 'M'}`;

  return (
    <header
      id="main-wedding-header"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/20 py-3 text-[#2C2A29]'
          : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram Brand */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center gap-2 group"
        >
          <span className="font-script text-2xl sm:text-3xl text-[#D4AF37] font-semibold tracking-wider">
            {monogram}
          </span>
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-current group-hover:scale-125 transition-transform" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-body text-xs lg:text-sm font-medium tracking-wider uppercase">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href, item.isLiveAlbum);
              }}
              className={`transition-colors hover:text-[#D4AF37] relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D4AF37] hover:after:w-full after:transition-all ${
                isScrolled ? 'text-[#3E3A37]' : 'text-white/90'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Admin Dashboard Entry Button (Only for wedding couple/owner) */}
        <div className="flex items-center gap-3">
          {isOwnerMode && onNavigateToAdmin && (
            <button
              id="header-admin-btn"
              onClick={onNavigateToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#8C7335] hover:text-[#5E4D20] border border-[#D4AF37]/40 transition-all backdrop-blur-sm"
              title="Mở bảng quản trị thiệp cưới"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quản trị thiệp</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Mở danh mục menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FDFBF7] text-[#2C2A29] border-b border-[#D4AF37]/30 shadow-2xl px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4 font-body text-sm font-medium tracking-wide">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href, item.isLiveAlbum);
                }}
                className="py-2 border-b border-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                <Heart className="w-3 h-3 text-[#D4AF37]/40" />
              </a>
            ))}
            {isOwnerMode && onNavigateToAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToAdmin();
                }}
                className="mt-2 w-full py-2.5 rounded-xl bg-[#D4AF37] text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>Quản trị thiệp cưới</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
