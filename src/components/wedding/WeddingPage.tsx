import React, { useState, useEffect, useMemo } from 'react';
import { WeddingData } from '../../types';
import { normalizeWeddingData } from '../../services/weddingService';
import { getAllWeddings, isSlugLockedAuthoritative, unlockSlugAuthoritative, slugifyVietnamese } from '../../services/siteConfigService';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { TEMPLATES } from '../../data/templates';
import { HeaderNav } from './HeaderNav';
import { HeroSection } from './HeroSection';
import { CoupleSection } from './CoupleSection';
import { StorySection } from './StorySection';
import { EventsSection } from './EventsSection';
import { GallerySection } from './GallerySection';
import { GiftSection } from './GiftSection';
import { RSVPSection } from './RSVPSection';
import { WishesSection } from './WishesSection';
import { Footer } from './Footer';
import { EnvelopeCurtain } from '../ui/EnvelopeCurtain';
import { PetalsFalling } from '../ui/PetalsFalling';
import { FloatingMusicPlayer } from '../ui/FloatingMusicPlayer';
import { VietnameseLuxuryTemplate } from './VietnameseLuxuryTemplate';
import { VietnameseModernLuxuryTemplate } from './templates/VietnameseModernLuxuryTemplate';
import { HauteCoutureTemplate } from './templates/HauteCoutureTemplate';
import { CelestialRoyaleTemplate } from './templates/CelestialRoyaleTemplate';
import { ChateauGrandeurTemplate } from './templates/ChateauGrandeurTemplate';
import { LuxuryEditorialTemplate } from './templates/LuxuryEditorialTemplate';
import { CinematicLoveStoryTemplate } from './templates/CinematicLoveStoryTemplate';
import { CinematicVietnameseTemplate } from './templates/CinematicVietnameseTemplate';
import { CinematicFuturisticTemplate } from './templates/CinematicFuturisticTemplate';
import { FloralRomanceTemplate } from './templates/FloralRomanceTemplate';
import { TraditionalVietnameseTemplate } from './templates/TraditionalVietnameseTemplate';
import { PassportLoveTemplate } from './templates/PassportLoveTemplate';
import { LoveMapTemplate } from './templates/LoveMapTemplate';
import { LoveLetterTemplate } from './templates/LoveLetterTemplate';
import { PolaroidScrapbookTemplate } from './templates/PolaroidScrapbookTemplate';
import { VietnameseFairytaleTemplate } from './templates/VietnameseFairytaleTemplate';
import { LanternTemplate } from './templates/LanternTemplate';
import { MoonLotusTemplate } from './templates/MoonLotusTemplate';
import { LoveGameTemplate } from './templates/LoveGameTemplate';
import { CyberpunkHologramTemplate } from './templates/CyberpunkHologramTemplate';
import { RoyalRingVaultTemplate } from './templates/RoyalRingVaultTemplate';
import { UniversalQRZoomModal } from './common/QRZoomModal';
import { UniversalLiveAlbumTrigger } from './live-album/UniversalLiveAlbumTrigger';
import { WeddingLiveAlbumModal } from './live-album/WeddingLiveAlbumModal';
import { PersonalizedWelcomeBanner } from './common/PersonalizedWelcomeBanner';

interface WeddingPageProps {
  key?: React.Key;
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function WeddingPage({
  data: rawData,
  onNavigateToAdmin,
  isOwnerMode = false,
  showEnvelopeImmediately = true,
}: WeddingPageProps) {
  const data = useMemo(() => normalizeWeddingData(rawData), [rawData]);
  const [isCurtainOpened, setIsCurtainOpened] = useState(!showEnvelopeImmediately);
  const [isLiveAlbumOpen, setIsLiveAlbumOpen] = useState(false);
  const currentTheme = TEMPLATES[data.template] || TEMPLATES['classic-luxury'];

  useEffect(() => {
    const handleOpenLive = () => {
      setIsLiveAlbumOpen(true);
    };
    window.addEventListener('lamour_open_live_album', handleOpenLive);
    return () => window.removeEventListener('lamour_open_live_album', handleOpenLive);
  }, []);

  useEffect(() => {
    setIsCurtainOpened(!showEnvelopeImmediately);
  }, [showEnvelopeImmediately]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const groom = data.groomName || data.groom?.fullName || 'Chú Rể';
      const bride = data.brideName || data.bride?.fullName || 'Cô Dâu';
      document.title = `Thiệp Cưới: ${groom} & ${bride} | L'Amour Wedding`;
    }
  }, [data.groomName, data.brideName, data.groom?.fullName, data.bride?.fullName]);

  // 1. Authoritative Real-Time Lock Check across URL, Registry, LocalStorage, and Firestore
  const currentUrlSlug = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const match = window.location.pathname.match(/\/wedding\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') : '';
  }, []);

  const [liveLocked, setLiveLocked] = useState<boolean>(() => {
    const urlMatch = typeof window !== 'undefined' ? window.location.pathname.match(/\/wedding\/([^/?#]+)/) : null;
    const urlSlug = urlMatch ? decodeURIComponent(urlMatch[1]).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') : '';
    const nameSlug = (data.groomName && data.brideName)
      ? slugifyVietnamese(`${data.groomName}-${data.brideName}`).toLowerCase()
      : '';

    if (
      isSlugLockedAuthoritative(data.slug) ||
      isSlugLockedAuthoritative(data.id) ||
      isSlugLockedAuthoritative(data.orderCode) ||
      isSlugLockedAuthoritative(urlSlug) ||
      isSlugLockedAuthoritative(nameSlug)
    ) {
      return true;
    }
    if (data.status === 'LOCKED') return true;
    return false;
  });

  useEffect(() => {
    // 1. Synchronous check on mount & props change
    const checkLock = async () => {
      const urlMatch = typeof window !== 'undefined' ? window.location.pathname.match(/\/wedding\/([^/?#]+)/) : null;
      const urlSlug = urlMatch ? decodeURIComponent(urlMatch[1]).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') : '';
      const targetClean = (data.slug || urlSlug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      const orderCode = (data.orderCode || '').trim();
      const nameSlug = (data.groomName && data.brideName)
        ? slugifyVietnamese(`${data.groomName}-${data.brideName}`).toLowerCase()
        : '';

      // 1. Initial zero-latency local check
      const localLocked =
        isSlugLockedAuthoritative(data.slug) ||
        isSlugLockedAuthoritative(data.id) ||
        isSlugLockedAuthoritative(data.orderCode) ||
        isSlugLockedAuthoritative(urlSlug) ||
        isSlugLockedAuthoritative(targetClean) ||
        isSlugLockedAuthoritative(nameSlug) ||
        data.status === 'LOCKED';

      setLiveLocked(localLocked);

      // 2. Cross-device check via Firestore if active
      if (isFirebaseConfigured && db) {
        try {
          const keysToCheck = Array.from(new Set([
            targetClean,
            targetClean.replace(/^wedding-/, ''),
            `wedding-${targetClean.replace(/^wedding-/, '')}`,
            orderCode,
            nameSlug,
            `wedding-${nameSlug}`,
            data.id,
          ].filter(Boolean) as string[]));

          let remoteExplicitLocked: boolean | null = null;
          for (const key of keysToCheck) {
            const lockSnap = await getDoc(doc(db, 'locks', key));
            if (lockSnap.exists()) {
              if (lockSnap.data()?.locked === true) {
                remoteExplicitLocked = true;
                break;
              } else if (lockSnap.data()?.locked === false) {
                remoteExplicitLocked = false;
              }
            }
            const wSnap = await getDoc(doc(db, 'weddings', key));
            if (wSnap.exists()) {
              const wStatus = (wSnap.data() as WeddingData)?.status;
              if (wStatus === 'LOCKED') {
                remoteExplicitLocked = true;
                break;
              } else if (wStatus === 'ACTIVE') {
                remoteExplicitLocked = false;
              }
            }
          }

          if (remoteExplicitLocked === true) {
            setLiveLocked(true);
            return;
          } else if (remoteExplicitLocked === false) {
            unlockSlugAuthoritative(targetClean);
            unlockSlugAuthoritative(targetClean.replace(/^wedding-/, ''));
            if (orderCode) unlockSlugAuthoritative(orderCode);
            if (nameSlug) unlockSlugAuthoritative(nameSlug);
            setLiveLocked(false);
            return;
          }
        } catch {}
      }

      // 3. Fallback check all weddings registry
      try {
        const all = getAllWeddings();
        const stripped = targetClean.replace(/^wedding-/, '');
        for (const w of all) {
          const wSlug = (w.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
          const wId = (w.id || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
          const wOrder = (w.orderCode || '').trim().toLowerCase();
          const wNameSlug = (w.groomName && w.brideName)
            ? slugifyVietnamese(`${w.groomName}-${w.brideName}`).toLowerCase()
            : '';

          const isMatch =
            wSlug === targetClean ||
            wSlug.replace(/^wedding-/, '') === stripped ||
            wId === targetClean ||
            wId.replace(/^wedding-/, '') === stripped ||
            (data.orderCode && wOrder === data.orderCode.toLowerCase().trim()) ||
            (nameSlug && wNameSlug === nameSlug);

          if (isMatch) {
            if (w.status === 'LOCKED') {
              setLiveLocked(true);
              return;
            } else if (w.status === 'ACTIVE') {
              setLiveLocked(false);
              return;
            }
          }
        }
      } catch {}

      setLiveLocked(localLocked);
    };

    checkLock();

    // 2. Listen to real-time events from Admin toggle lock in same window
    const handleLockEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string; id?: string; status?: string; isLocked?: boolean }>;
      if (customEvent.detail) {
        const targetClean = (data.slug || currentUrlSlug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
        const eventSlug = (customEvent.detail.slug || '').trim().toLowerCase();
        const eventId = (customEvent.detail.id || '').trim().toLowerCase();
        if (
          !eventSlug ||
          eventSlug === targetClean ||
          eventId === targetClean ||
          targetClean.includes(eventSlug) ||
          eventSlug.includes(targetClean)
        ) {
          setLiveLocked(customEvent.detail.isLocked ?? customEvent.detail.status === 'LOCKED');
        }
      }
    };
    window.addEventListener('lamour_lock_status_changed', handleLockEvent);

    const handleSavedEvent = (e: Event) => {
      const customEvent = e as CustomEvent<WeddingData>;
      if (customEvent.detail) {
        const targetClean = (data.slug || currentUrlSlug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
        const dSlug = (customEvent.detail.slug || '').trim().toLowerCase();
        if (dSlug === targetClean || customEvent.detail.id === data.id) {
          if (customEvent.detail.status === 'LOCKED') {
            setLiveLocked(true);
          } else if (customEvent.detail.status === 'ACTIVE') {
            setLiveLocked(false);
          }
        }
      }
    };
    window.addEventListener('lamour_wedding_data_saved', handleSavedEvent);

    // 3. Multi-tab sync via BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('lamour_wedding_sync');
      bc.onmessage = (event) => {
        if (event.data?.type === 'WEDDING_UPDATED') {
          const targetClean = (data.slug || currentUrlSlug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
          const updated = event.data.data as WeddingData;
          const uSlug = (updated?.slug || event.data.slug || '').trim().toLowerCase();
          if (uSlug === targetClean || updated?.id === data.id) {
            if (event.data.isLocked !== undefined) {
              setLiveLocked(event.data.isLocked);
            } else if (updated?.status === 'LOCKED') {
              setLiveLocked(true);
            } else if (updated?.status === 'ACTIVE') {
              setLiveLocked(false);
            }
          }
        }
      };
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lamour_locked_slugs' || e.key?.startsWith('lamour_wedding_data_') || e.key === 'lamour_all_weddings_list') {
        checkLock();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('lamour_lock_status_changed', handleLockEvent);
      window.removeEventListener('lamour_wedding_data_saved', handleSavedEvent);
      window.removeEventListener('storage', handleStorage);
      if (bc) {
        try { bc.close(); } catch {}
      }
    };
  }, [data.slug, data.id, data.orderCode, data.status, currentUrlSlug]);

  const isLocked = liveLocked || data.status === 'LOCKED';

  // 1. Check if wedding is locked by Admin
  if (isLocked && !isOwnerMode) {
    const groomTitle = data.groomName || data.groom?.fullName || 'Chú Rể';
    const brideTitle = data.brideName || data.bride?.fullName || 'Cô Dâu';
    return (
      <div className="min-h-screen bg-[#181615] text-[#FAF6EE] flex items-center justify-center p-6 text-center font-body">
        <div className="max-w-md bg-[#24211E] rounded-3xl p-8 border border-neutral-800 shadow-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="font-serif-title text-xl font-bold text-white">
            Thiệp Cưới Tạm Dừng Hoạt Động
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Thiệp cưới của {groomTitle} & {brideTitle} hiện đang ở trạng thái tạm dừng hoặc cần gia hạn thời gian lưu trữ.
          </p>
          <p className="text-[11px] text-neutral-500">
            Quý khách vui lòng liên hệ cô dâu chú rể hoặc bộ phận chăm sóc khách hàng L'Amour Wedding để biết thêm thông tin chi tiết.
          </p>
        </div>
      </div>
    );
  }

  // 2. Check if wedding is unpublished by the couple
  if (!data.isPublished && !isOwnerMode) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C2A29] flex items-center justify-center p-6 text-center font-body">
        <div className="max-w-md bg-white rounded-3xl p-8 border border-[#D4AF37]/30 shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF6EE] border border-[#D4AF37]/40 text-[#B38F26] flex items-center justify-center mx-auto">
            <span className="text-2xl">💌</span>
          </div>
          <h2 className="font-serif-title text-xl font-bold text-neutral-900">
            Thiệp Cưới Đang Chuẩn Bị
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Cô dâu {data.brideName} & Chú rể {data.groomName} đang hoàn thiện những lời ngỏ và hình ảnh đẹp nhất.
          </p>
          <p className="text-[11px] text-neutral-400">
            Thiệp cưới sẽ sớm được công bố chính thức đến quý khách. Hẹn gặp lại quý khách!
          </p>
        </div>
      </div>
    );
  }

  // 3. Render Template Content with Universal QR Zoom Support
  const renderTemplateContent = () => {
    if (data.template === 'vietnamese-luxury-01') {
      return (
        <VietnameseLuxuryTemplate
          data={data}
          onNavigateToAdmin={onNavigateToAdmin}
          isOwnerMode={isOwnerMode}
          showEnvelopeImmediately={showEnvelopeImmediately}
        />
      );
    }

  // 3b. Dispatch to Vietnamese Modern Luxury Template if selected
  if (
    data.template === 'vietnamese-modern-luxury' ||
    (data.template as string) === 'tpl-vietnamese-modern-luxury'
  ) {
    return (
      <VietnameseModernLuxuryTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 4. Dispatch to Vogue Haute Couture Template if selected
  if (
    data.template === 'haute-couture' ||
    (data.template as string) === 'tpl-haute-couture'
  ) {
    return (
      <HauteCoutureTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 5. Dispatch to Celestial Royale Template if selected
  if (
    data.template === 'celestial-royale' ||
    (data.template as string) === 'tpl-celestial-royale'
  ) {
    return (
      <CelestialRoyaleTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 6. Dispatch to Château Grandeur Template if selected
  if (
    data.template === 'chateau-grandeur' ||
    (data.template as string) === 'tpl-chateau-grandeur'
  ) {
    return (
      <ChateauGrandeurTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 7. Dispatch to Luxury Editorial Template if selected
  if (
    data.template === 'luxury-editorial' ||
    (data.template as string) === 'tpl-luxury-editorial'
  ) {
    return (
      <LuxuryEditorialTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 8. Dispatch to Cinematic Love Story Template (VIP Premiere)
  if (
    data.template === 'cinematic-love-story' ||
    (data.template as string) === 'tpl-cinematic-love-story'
  ) {
    return (
      <CinematicLoveStoryTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 8b. Dispatch to Cinematic Vietnamese Traditional Template (Sử Thi Hỷ Sự Hoàng Gia)
  if (
    data.template === 'cinematic-vietnamese' ||
    (data.template as string) === 'tpl-cinematic-vietnamese'
  ) {
    return (
      <CinematicVietnameseTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 8c. Dispatch to Cinematic Futuristic Template (Kỷ Nguyên Vĩnh Cửu)
  if (
    data.template === 'cinematic-futuristic' ||
    (data.template as string) === 'tpl-cinematic-futuristic'
  ) {
    return (
      <CinematicFuturisticTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 9. Dispatch to Mẫu 2 — Floral Romance (Cơ bản+)
  if (
    data.template === 'floral-romance' ||
    (data.template as string) === 'tpl-floral-romance' ||
    data.template === 'floral-pink'
  ) {
    return (
      <FloralRomanceTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 10. Dispatch to Mẫu 3 — Vietnamese Traditional (Hỷ Sự)
  if (
    data.template === 'traditional-vietnamese' ||
    (data.template as string) === 'tpl-traditional-vietnamese' ||
    (data.template as string) === 'vietnamese-traditional'
  ) {
    return (
      <TraditionalVietnameseTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 11. Dispatch to Mẫu 4 — Passport Hộ Chiếu Tình Yêu (Travel Editorial)
  if (
    data.template === 'passport-love-01' ||
    (data.template as string) === 'tpl-passport-love-01' ||
    (data.template as string) === 'passport-love'
  ) {
    return (
      <PassportLoveTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 12. Dispatch to Mẫu 5 — Love Map (Bản Đồ Tình Yêu)
  if (
    data.template === 'love-map-01' ||
    (data.template as string) === 'tpl-love-map-01' ||
    (data.template as string) === 'love-map'
  ) {
    return (
      <LoveMapTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 13. Dispatch to Mẫu 6 — Love Letter (Bức Thư Tình)
  if (
    data.template === 'love-letter-01' ||
    (data.template as string) === 'tpl-love-letter-01' ||
    (data.template as string) === 'love-letter'
  ) {
    return (
      <LoveLetterTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 14. Dispatch to Mẫu 7 — Polaroid / Scrapbook (Album Kỷ Niệm Thủ Công)
  if (
    data.template === 'polaroid-scrapbook-01' ||
    (data.template as string) === 'tpl-polaroid-scrapbook-01' ||
    (data.template as string) === 'polaroid-scrapbook'
  ) {
    return (
      <PolaroidScrapbookTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 15. Dispatch to Mẫu 8 — Cổ Tích Việt Nam (Modern Folk Art)
  if (
    data.template === 'vietnamese-fairytale-01' ||
    (data.template as string) === 'tpl-vietnamese-fairytale-01' ||
    (data.template as string) === 'vietnamese-fairytale' ||
    (data.template as string)?.includes('fairytale') ||
    (data.template as string)?.includes('co-tich')
  ) {
    return (
      <VietnameseFairytaleTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 16. Dispatch to Mẫu 9 — Thiệp Đèn Lồng (Vietnamese Night Wedding)
  if (
    data.template === 'lantern-night-01' ||
    data.template === 'lantern-template' ||
    (data.template as string) === 'tpl-lantern-night-01' ||
    (data.template as string) === 'lantern-night' ||
    (data.template as string)?.includes('lantern') ||
    (data.template as string)?.includes('den-long')
  ) {
    return (
      <LanternTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 17. Dispatch to Mẫu 10 — Thiệp "Trăng & Hoa" (Under The Same Moon)
  if (
    data.template === 'moon-and-lotus' ||
    data.template === 'moon-lotus-01' ||
    (data.template as string) === 'tpl-moon-lotus-01' ||
    (data.template as string) === 'moon-lotus' ||
    (data.template as string)?.includes('moon') ||
    (data.template as string)?.includes('trang-va-hoa') ||
    (data.template as string)?.includes('hoa-sen')
  ) {
    return (
      <MoonLotusTemplate
        data={data}
        isDemo={!isOwnerMode}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 18. Dispatch to Mẫu 11 — Thiệp "Cùng chơi một trò chơi" (Gen Z Love Quest)
  if (
    data.template === 'love-game' ||
    (data.template as string) === 'tpl-love-game' ||
    (data.template as string)?.includes('love-game') ||
    (data.template as string)?.includes('cung-choi') ||
    (data.template as string)?.includes('tro-choi') ||
    (data.template as string)?.includes('game')
  ) {
    return (
      <LoveGameTemplate
        data={data}
        isDemo={!isOwnerMode}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 19. Dispatch to Cyberpunk 3D Hologram Template
  if (
    data.template === 'cyberpunk-hologram' ||
    (data.template as string) === 'tpl-cyberpunk-hologram' ||
    (data.template as string)?.includes('cyberpunk') ||
    (data.template as string)?.includes('hologram')
  ) {
    return (
      <CyberpunkHologramTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  // 20. Dispatch to The Royal Ring Vault 3D Template
  if (
    data.template === 'royal-ring-vault' ||
    (data.template as string) === 'tpl-royal-ring-vault' ||
    (data.template as string)?.includes('royal-ring-vault') ||
    (data.template as string)?.includes('ring-vault') ||
    (data.template as string)?.includes('hop-nhan')
  ) {
    return (
      <RoyalRingVaultTemplate
        data={data}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        showEnvelopeImmediately={showEnvelopeImmediately}
      />
    );
  }

  return (
    <div className={`relative min-h-screen ${currentTheme.bgClass} ${currentTheme.textColor} transition-colors duration-500`}>
      {/* 1. Envelope Opening Screen on initial visit */}
      {!isCurtainOpened && (
        <EnvelopeCurtain
          groomName={data.groomName}
          brideName={data.brideName}
          weddingDate={data.events[0]?.date || data.weddingDate}
          musicUrl={data.musicUrl}
          onOpen={() => setIsCurtainOpened(true)}
        />
      )}

      {/* 2. Floating Petals */}
      <PetalsFalling />

      {/* 3. Floating Background Music Player */}
      <FloatingMusicPlayer musicUrl={data.musicUrl} />

      {/* 4. Sticky Header Navigation */}
      <HeaderNav
        groomName={data.groomName}
        brideName={data.brideName}
        onNavigateToAdmin={onNavigateToAdmin}
        isOwnerMode={isOwnerMode}
        accentColor={currentTheme.accentColor}
        hasStories={Boolean(data.stories && data.stories.length > 0)}
      />

      {/* Personalized Welcome Banner */}
      <PersonalizedWelcomeBanner
        groomName={data.groomName}
        brideName={data.brideName}
        weddingDate={data.weddingDate}
        accentColor={currentTheme.accentColor}
      />

      {/* 5. Hero Section */}
      <HeroSection
        groomName={data.groomName}
        brideName={data.brideName}
        weddingDate={data.weddingDate}
        weddingDateTime={data.weddingDateTime}
        city={data.city}
        romanticQuote={data.romanticQuote}
        coverImage={data.coverImage}
        accentColor={currentTheme.accentColor}
      />

      {/* 6. The Bride & Groom */}
      <CoupleSection groom={data.groom} bride={data.bride} />

      {/* 7. Our Story Timeline */}
      {data.stories && data.stories.length > 0 && (
        <StorySection stories={data.stories} />
      )}

      {/* 8. Wedding Events */}
      <EventsSection events={data.events} />

      {/* 9. Our Memories Gallery */}
      <GallerySection gallery={data.gallery} />

      {/* 10. Wedding Gift / QR Bank */}
      <GiftSection
        gift={data.gift}
        groomName={data.groomName}
        brideName={data.brideName}
      />

      {/* 11. RSVP Attendance Form */}
      <RSVPSection
        weddingId={data.id}
        groomName={data.groomName}
        brideName={data.brideName}
      />

      {/* 12. Guestbook Wishes */}
      <WishesSection weddingId={data.id} />

      {/* 13. Footer */}
      <Footer
        groomName={data.groomName}
        brideName={data.brideName}
        weddingDate={data.weddingDate}
      />
    </div>
    );
  };

  return (
    <>
      {renderTemplateContent()}
      <UniversalQRZoomModal />
      <UniversalLiveAlbumTrigger
        wedding={data}
        onOpen={() => setIsLiveAlbumOpen(true)}
      />
      <WeddingLiveAlbumModal
        isOpen={isLiveAlbumOpen}
        onClose={() => setIsLiveAlbumOpen(false)}
        wedding={data}
        onOpenUpgradeOrAddon={() => {
          if (onNavigateToAdmin) onNavigateToAdmin();
        }}
      />
    </>
  );
}
