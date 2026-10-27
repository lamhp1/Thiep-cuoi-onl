/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WeddingData } from './types';
import { CommercialPackage, CommercialTemplate, SiteContentConfig } from './types/commercial';
import { getWeddingBySlug } from './services/weddingService';
import { getCommercialPackages } from './services/packageService';
import { getCommercialTemplates } from './services/templateService';
import { INITIAL_DEMO_WEDDING } from './data/demoWedding';
import { DEFAULT_COMMERCIAL_PACKAGES, DEFAULT_COMMERCIAL_TEMPLATES } from './data/commercialDefaults';

import { WeddingPage } from './components/wedding/WeddingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CouplePortal } from './components/portal/CouplePortal';
import { OrderLookupPage } from './components/portal/OrderLookupPage';
import { ToastProvider } from './components/ui/Toast';

import { PublicNavbar } from './components/public/PublicNavbar';
import { PublicFooter } from './components/public/PublicFooter';
import { LandingPage } from './components/public/LandingPage';
import { TemplatesPage } from './components/public/TemplatesPage';
import { PricingPage } from './components/public/PricingPage';
import { OrderPage } from './components/public/OrderPage';
import { DemoTemplatePage } from './components/public/DemoTemplatePage';

import { Sparkles, Settings } from 'lucide-react';
import { Lead } from './types/commercial';
import { getLeadById } from './services/leadService';
import {
  getAllWeddings,
  createOrActivateWeddingFromLead,
  isSlugLockedAuthoritative,
  getSiteContentConfig,
  fetchSiteContentConfigFromFirestore,
} from './services/siteConfigService';

export default function App() {
  const [weddingData, setWeddingData] = useState<WeddingData>(INITIAL_DEMO_WEDDING);
  const [packages, setPackages] = useState<CommercialPackage[]>(DEFAULT_COMMERCIAL_PACKAGES);
  const [templates, setTemplates] = useState<CommercialTemplate[]>(DEFAULT_COMMERCIAL_TEMPLATES);
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(getSiteContentConfig());
  const [isLoading, setIsLoading] = useState(true);

  // Router state
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [orderInitialTemplate, setOrderInitialTemplate] = useState<string | undefined>();
  const [orderInitialPackage, setOrderInitialPackage] = useState<string | undefined>();
  const [lookupInitialCode, setLookupInitialCode] = useState<string>('');
  const [demoTemplateSlug, setDemoTemplateSlug] = useState<string>('classic-luxury');
  const [currentCoupleLead, setCurrentCoupleLead] = useState<Lead | null>(null);

  const parseCurrentLocation = () => {
    const path = window.location.pathname;
    const search = new URLSearchParams(window.location.search);

    setCurrentPath(path);

    // Extract query parameters for order page and portal
    const tplParam = search.get('template');
    const pkgParam = search.get('package');
    const codeParam = search.get('code') || search.get('orderId');

    if (tplParam) setOrderInitialTemplate(tplParam);
    if (pkgParam) setOrderInitialPackage(pkgParam);

    // ROUTE 1: Couple Portal (/portal) - Strict Customer Data Isolation
    if (path === '/portal' || path.startsWith('/portal/')) {
      const activeCode = codeParam || (typeof window !== 'undefined' ? (sessionStorage.getItem('lamour_logged_in_couple_code') || localStorage.getItem('lamour_logged_in_couple_code')) : null);
      if (activeCode) {
        setLookupInitialCode(activeCode);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('lamour_logged_in_couple_code', activeCode);
          localStorage.setItem('lamour_logged_in_couple_code', activeCode);
        }
        getLeadById(activeCode).then((lead) => {
          if (lead) {
            setCurrentCoupleLead(lead);
            const wedding = createOrActivateWeddingFromLead(lead);
            const allWeddings = getAllWeddings();
            const match = allWeddings.find(
              (w) => w.id === wedding.id || w.slug === wedding.slug || w.orderCode === lead.id
            );
            const targetWedding = match || wedding;
            setWeddingData(targetWedding);

            const targetSlug = targetWedding.slug || wedding.slug;
            if (targetSlug) {
              getWeddingBySlug(targetSlug).then((remote) => {
                if (remote && remote.template) {
                  setWeddingData((prev) => ({
                    ...prev,
                    ...remote,
                    template: remote.template,
                  }));
                }
              });
            }
          } else {
            const allWeddings = getAllWeddings();
            const match = allWeddings.find(
              (w) => w.orderCode === activeCode || w.id === activeCode || w.slug === activeCode
            );
            if (match) {
              setWeddingData(match);
              if (match.slug) {
                getWeddingBySlug(match.slug).then((remote) => {
                  if (remote && remote.template) {
                    setWeddingData((prev) => ({
                      ...prev,
                      ...remote,
                      template: remote.template,
                    }));
                  }
                });
              }
            }
          }
        }).finally(() => {
          setIsLoading(false);
        });
      } else {
        // Not logged in to any couple account
        setCurrentCoupleLead(null);
        setIsLoading(false);
      }
      return; // CRITICAL: Stop here! Do NOT fall through to loading the demo wedding or another customer's wedding
    }

    // ROUTE 2: Live Wedding Invitation for Guests (/wedding/:slug)
    const slugMatch = path.match(/\/wedding\/([^/?#]+)/);
    if (slugMatch) {
      setIsLoading(true);
      const targetSlug = decodeURIComponent(slugMatch[1]).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || INITIAL_DEMO_WEDDING.slug;

      getWeddingBySlug(targetSlug)
        .then((data) => {
          if (data) {
            setWeddingData(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
      return;
    }

    // ROUTE 3: Demo Template (/demo/:slug)
    const demoMatch = path.match(/\/demo\/([a-zA-Z0-9-_]+)/);
    if (demoMatch) {
      setDemoTemplateSlug(demoMatch[1]);
      setIsLoading(false);
      return;
    }

    // ROUTE 4: Public pages / Admin
    if (codeParam) {
      setLookupInitialCode(codeParam);
      getLeadById(codeParam).then((lead) => {
        if (lead) {
          setCurrentCoupleLead(lead);
          const wedding = createOrActivateWeddingFromLead(lead);
          setWeddingData(wedding);
        }
      });
    }

    getWeddingBySlug(INITIAL_DEMO_WEDDING.slug)
      .then((data) => {
        if (data) setWeddingData(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    parseCurrentLocation();

    // Proactively purge any obsolete cached templates from localStorage
    try {
      const raw = localStorage.getItem('lamour_commercial_templates');
      if (raw && (raw.includes('tree-of-love') || raw.includes('Cây Tình Yêu') || raw.includes('tree_of_love'))) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((t: any) => {
            const slug = (t.slug || '').toLowerCase();
            const id = (t.id || '').toLowerCase();
            const name = (t.name || '').toLowerCase();
            return (
              slug !== 'tree-of-love' &&
              slug !== 'tree-of-love-01' &&
              id !== 'tpl-tree-of-love-01' &&
              id !== 'tree-of-love' &&
              !name.includes('cây tình yêu') &&
              !name.includes('the tree of love')
            );
          });
          localStorage.setItem('lamour_commercial_templates', JSON.stringify(cleaned));
        }
      }
    } catch {}

    // Load commercial packages and templates
    Promise.all([getCommercialPackages(), getCommercialTemplates()]).then(
      ([pkgList, tplList]) => {
        if (pkgList && pkgList.length > 0) setPackages(pkgList);
        if (tplList && tplList.length > 0) {
          const filtered = tplList.filter((t) => {
            const slug = (t.slug || '').toLowerCase();
            const id = (t.id || '').toLowerCase();
            const name = (t.name || '').toLowerCase();
            return (
              slug !== 'tree-of-love' &&
              slug !== 'tree-of-love-01' &&
              id !== 'tpl-tree-of-love-01' &&
              id !== 'tree-of-love' &&
              !name.includes('cây tình yêu') &&
              !name.includes('the tree of love')
            );
          });
          setTemplates(filtered);
        }
      }
    );

    const handleTemplatesUpdated = () => {
      getCommercialTemplates().then((tplList) => {
        if (tplList) {
          const filtered = tplList.filter((t) => {
            const slug = (t.slug || '').toLowerCase();
            const id = (t.id || '').toLowerCase();
            const name = (t.name || '').toLowerCase();
            return (
              slug !== 'tree-of-love' &&
              slug !== 'tree-of-love-01' &&
              id !== 'tpl-tree-of-love-01' &&
              id !== 'tree-of-love' &&
              !name.includes('cây tình yêu') &&
              !name.includes('the tree of love')
            );
          });
          setTemplates(filtered);
        }
      });
    };
    window.addEventListener('lamour_commercial_templates_updated', handleTemplatesUpdated);

    const handlePackagesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<CommercialPackage[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setPackages(customEvent.detail);
      }
    };
    window.addEventListener('lamour_commercial_packages_updated', handlePackagesUpdated);

    const handleWeddingSaved = (e: Event) => {
      const customEvent = e as CustomEvent<WeddingData>;
      if (customEvent.detail) {
        setWeddingData(customEvent.detail);
      }
    };
    window.addEventListener('lamour_wedding_data_saved', handleWeddingSaved);

    // Multi-tab real-time sync via BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('lamour_wedding_sync');
      broadcastChannel.onmessage = (event) => {
        if (event.data?.type === 'WEDDING_UPDATED' && event.data?.data) {
          const updated = event.data.data as WeddingData;
          setWeddingData((current) => {
            const currentSlug = (current.slug || '').trim().toLowerCase();
            const updatedSlug = (updated.slug || '').trim().toLowerCase();
            if (currentSlug === updatedSlug || current.id === updated.id) {
              return updated;
            }
            return current;
          });
        } else if (event.data?.type === 'PACKAGES_UPDATED' && Array.isArray(event.data?.packages)) {
          setPackages(event.data.packages);
        } else if (event.data?.type === 'SITE_CONTENT_UPDATED' && event.data?.config) {
          setSiteContent(event.data.config);
        }
      };
    } catch {
      // BroadcastChannel not available in all contexts
    }

    // Proactively fetch site content config from Firestore
    fetchSiteContentConfigFromFirestore().then((remote) => {
      if (remote) setSiteContent(remote);
    });

    const handleSiteContentUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContentConfig>;
      if (customEvent.detail) {
        setSiteContent(customEvent.detail);
      } else {
        setSiteContent(getSiteContentConfig());
      }
    };
    window.addEventListener('lamour_site_content_updated', handleSiteContentUpdated);

    const handleLockStatusChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string; id?: string; status?: string; isLocked?: boolean }>;
      if (customEvent.detail) {
        const slug = (customEvent.detail.slug || '').trim().toLowerCase();
        const strippedSlug = slug.replace(/^wedding-/, '');
        const id = (customEvent.detail.id || '').trim().toLowerCase();
        setWeddingData((prev) => {
          const currentSlug = (prev.slug || '').trim().toLowerCase();
          const currentStripped = currentSlug.replace(/^wedding-/, '');
          const currentId = (prev.id || '').trim().toLowerCase();
          const currentOrder = (prev.orderCode || '').trim().toLowerCase();
          const matches =
            !slug ||
            slug === currentSlug ||
            strippedSlug === currentStripped ||
            currentSlug.includes(slug) ||
            slug.includes(currentSlug) ||
            (id && (id === currentId || id === currentOrder || id === currentSlug || id.replace(/^wedding-/, '') === currentStripped));
          if (matches) {
            return {
              ...prev,
              status: (customEvent.detail.isLocked ?? customEvent.detail.status === 'LOCKED') ? 'LOCKED' : 'ACTIVE',
            };
          }
          return prev;
        });
      }
    };
    window.addEventListener('lamour_lock_status_changed', handleLockStatusChanged);

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'lamour_locked_slugs' ||
        e.key === 'lamour_all_weddings_list' ||
        e.key === 'lamour_site_content_config' ||
        (e.key && e.key.startsWith('lamour_wedding_data_'))
      ) {
        if (e.key === 'lamour_site_content_config') {
          setSiteContent(getSiteContentConfig());
        }
        parseCurrentLocation();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handlePopState = () => parseCurrentLocation();
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('lamour_commercial_templates_updated', handleTemplatesUpdated);
      window.removeEventListener('lamour_commercial_packages_updated', handlePackagesUpdated);
      window.removeEventListener('lamour_wedding_data_saved', handleWeddingSaved);
      window.removeEventListener('lamour_site_content_updated', handleSiteContentUpdated);
      window.removeEventListener('lamour_lock_status_changed', handleLockStatusChanged);
      window.removeEventListener('storage', handleStorageChange);
      if (broadcastChannel) {
        try {
          broadcastChannel.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  useEffect(() => {
    if (siteContent?.brandName) {
      document.title = `${siteContent.brandName} - ${siteContent.brandTagline || 'Thiệp Cưới Online Cao Cấp'}`;
    }
  }, [siteContent]);

  const navigateTo = (newUrl: string) => {
    window.history.pushState({}, '', newUrl);
    parseCurrentLocation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="font-script text-3xl sm:text-4xl text-[#D4AF37] animate-pulse">
            L'Amour Wedding
          </p>
          <p className="font-body text-xs tracking-widest text-neutral-400 mt-2 uppercase">
            Đang tải nền tảng thiệp cưới online cao cấp...
          </p>
        </div>
      </div>
    );
  }

  // 1. ADMIN DASHBOARD ROUTE: /admin (Dành riêng cho Chủ Nền Tảng)
  if (
    currentPath === '/admin' ||
    currentPath.startsWith('/admin/') ||
    window.location.hash === '#admin'
  ) {
    return (
      <ToastProvider>
        <AdminDashboard
          initialData={weddingData}
          initialTab={currentPath === '/admin/templates' ? 'templates-catalog' : undefined}
          onBackToWedding={() => navigateTo(`/wedding/${weddingData.slug}`)}
          onNavigateToPublic={() => navigateTo('/')}
          onNavigateToCouplePortal={() => navigateTo('/lookup')}
          onDataSaved={(saved) => setWeddingData(saved)}
        />
      </ToastProvider>
    );
  }

  // 2. COUPLE PORTAL ROUTE: /portal (Dành cho cặp đôi sau khi đặt thiệp thành công)
  if (currentPath === '/portal' || currentPath.startsWith('/portal/')) {
    const hasActiveSession = currentCoupleLead || (typeof window !== 'undefined' && (sessionStorage.getItem('lamour_logged_in_couple_code') || localStorage.getItem('lamour_logged_in_couple_code')));
    
    if (!hasActiveSession && !lookupInitialCode) {
      return (
        <ToastProvider>
          <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] flex flex-col justify-between">
            <PublicNavbar currentPath="/lookup" onNavigate={navigateTo} siteContent={siteContent} />
            <main className="flex-1 py-6">
              <OrderLookupPage
                initialCode=""
                onNavigate={navigateTo}
                onOpenCouplePortal={(lead) => {
                  setCurrentCoupleLead(lead);
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('lamour_logged_in_couple_code', lead.id);
                    localStorage.setItem('lamour_logged_in_couple_code', lead.id);
                  }
                  const wedding = createOrActivateWeddingFromLead(lead);
                  const allWeddings = getAllWeddings();
                  const match = allWeddings.find(
                    (w) => w.id === wedding.id || w.slug === wedding.slug || w.orderCode === lead.id
                  );
                  setWeddingData(match || wedding);
                  navigateTo(`/portal?code=${lead.id}`);
                }}
              />
            </main>
            <PublicFooter onNavigate={navigateTo} siteContent={siteContent} />
          </div>
        </ToastProvider>
      );
    }

    return (
      <ToastProvider>
        <CouplePortal
          weddingData={weddingData}
          leadOrder={currentCoupleLead}
          onBackToPublic={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('lamour_logged_in_couple_code');
              localStorage.removeItem('lamour_logged_in_couple_code');
            }
            setCurrentCoupleLead(null);
            navigateTo('/');
          }}
          onDataSaved={(saved) => {
            setWeddingData(saved);
            if (saved.template) {
              setCurrentCoupleLead((prev) => (prev ? { ...prev, template: saved.template } : prev));
            }
          }}
          onNavigateToLiveWedding={() => navigateTo(`/wedding/${weddingData.slug}`)}
        />
      </ToastProvider>
    );
  }

  // 3. LIVE TEMPLATE DEMO ROUTE: /demo/:templateSlug
  if (currentPath.startsWith('/demo/')) {
    return (
      <ToastProvider>
        <DemoTemplatePage
          templateSlug={demoTemplateSlug}
          onNavigate={navigateTo}
        />
      </ToastProvider>
    );
  }

  // 4. ACTUAL CUSTOMER WEDDING INVITATION ROUTE: /wedding/:slug (Dành cho khách mời đám cưới)
  if (currentPath.startsWith('/wedding/')) {
    return (
      <ToastProvider>
        <div className="relative">
          <WeddingPage
            data={weddingData}
            isOwnerMode={false}
            showEnvelopeImmediately={true}
          />

          {/* Discreet Platform Pill for guests who want to make their own wedding card */}
          <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
            <button
              onClick={() => navigateTo('/')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181615]/90 hover:bg-black text-[#D4AF37] hover:text-[#E5C058] text-xs font-body font-semibold shadow-xl border border-[#D4AF37]/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Khám phá nền tảng L'Amour Wedding"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Tạo Thiệp Như Mẫu Này</span>
              <span className="sm:hidden">Đặt Thiệp</span>
            </button>
          </div>
        </div>
      </ToastProvider>
    );
  }

  // 5. PUBLIC SALES WEBSITE PAGES (/ , /templates , /pricing , /order , /lookup)
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] flex flex-col justify-between">
        {/* Universal Public Navbar */}
        <PublicNavbar
          currentPath={currentPath}
          onNavigate={navigateTo}
          siteContent={siteContent}
        />

        {/* Page Content View Switching */}
        <main className="flex-1">
          {currentPath === '/templates' ? (
            <TemplatesPage
              templates={templates}
              onNavigate={navigateTo}
            />
          ) : currentPath === '/pricing' ? (
            <PricingPage
              packages={packages}
              onNavigate={navigateTo}
            />
          ) : currentPath === '/order' ? (
            <OrderPage
              packages={packages}
              templates={templates}
              initialTemplate={orderInitialTemplate}
              initialPackage={orderInitialPackage}
              onNavigate={navigateTo}
            />
          ) : currentPath === '/lookup' ? (
            <OrderLookupPage
              initialCode={lookupInitialCode}
              onNavigate={navigateTo}
              onOpenCouplePortal={(lead) => {
                setCurrentCoupleLead(lead);
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('lamour_logged_in_couple_code', lead.id);
                  localStorage.setItem('lamour_logged_in_couple_code', lead.id);
                }
                const wedding = createOrActivateWeddingFromLead(lead);
                const allWeddings = getAllWeddings();
                const match = allWeddings.find(
                  (w) => w.id === wedding.id || w.slug === wedding.slug || w.orderCode === lead.id
                );
                setWeddingData(match || wedding);
                navigateTo(`/portal?code=${lead.id}`);
              }}
            />
          ) : (
            /* Default: Landing Page (/) */
            <LandingPage
              packages={packages}
              templates={templates}
              onNavigate={navigateTo}
              siteContent={siteContent}
              demoWedding={weddingData}
            />
          )}
        </main>

        {/* Universal Public Footer */}
        <PublicFooter onNavigate={navigateTo} siteContent={siteContent} />

        {/* Temporary Floating Admin Launcher for AI Studio Simulation (will be removed before production) */}
        <div className="fixed bottom-5 right-5 z-50">
          <button
            id="floating-admin-simulator-btn"
            onClick={() => navigateTo('/admin')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/95 hover:bg-black text-[#D4AF37] hover:text-[#F3DF95] text-xs font-semibold shadow-2xl border-2 border-[#D4AF37] backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Mở Bảng Quản Trị Hệ Thống (/admin) - Mã PIN: 8888"
          >
            <Settings className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
            <span className="font-bold tracking-wide">Admin</span>
            <span className="text-[10px] bg-[#D4AF37]/20 px-1.5 py-0.5 rounded-sm text-[#E5C058] font-mono">PIN: 8888</span>
          </button>
        </div>
      </div>
    </ToastProvider>
  );
}
