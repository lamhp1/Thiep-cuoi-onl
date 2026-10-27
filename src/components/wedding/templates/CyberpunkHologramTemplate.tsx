import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { WeddingData } from '../../../types';
import { CyberpunkHero } from './cyberpunk-hologram/CyberpunkHero';
import { CyberpunkCoupleSection } from './cyberpunk-hologram/CyberpunkCoupleSection';
import { CyberpunkEventsSection } from './cyberpunk-hologram/CyberpunkEventsSection';
import { CyberpunkInteractiveAlbum } from './cyberpunk-hologram/CyberpunkInteractiveAlbum';
import { CyberpunkMinigame } from './cyberpunk-hologram/CyberpunkMinigame';
import { CyberpunkRSVPSection } from './cyberpunk-hologram/CyberpunkRSVPSection';
import { CyberpunkGiftSection } from './cyberpunk-hologram/CyberpunkGiftSection';
import { WishesSection } from '../WishesSection';
import { Footer } from '../Footer';

interface CyberpunkHologramTemplateProps {
  data: WeddingData;
  onNavigateToAdmin?: () => void;
  isOwnerMode?: boolean;
  showEnvelopeImmediately?: boolean;
}

export function CyberpunkHologramTemplate({
  data,
  onNavigateToAdmin,
  isOwnerMode = false,
}: CyberpunkHologramTemplateProps) {
  const groomName = data.groomName || data.groom?.fullName || 'Minh Anh';
  const brideName = data.brideName || data.bride?.fullName || 'Ngọc Mai';
  const weddingDate = data.events?.[0]?.date || data.weddingDate || '20.12.2026';

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen bg-[#050714] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Laser Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 z-[100] origin-left shadow-[0_0_20px_#00F0FF]"
        style={{ scaleX }}
      />

      {/* Admin Floating Shortcut Bar if owner mode */}
      {isOwnerMode && onNavigateToAdmin && (
        <div className="fixed top-4 right-4 z-50 bg-[#0B1026]/90 backdrop-blur-md border border-cyan-500/40 p-2 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center space-x-2">
          <button
            onClick={onNavigateToAdmin}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-400/40 hover:bg-cyan-500/30 transition-colors"
          >
            ⚙️ QUẢN TRỊ THIỆP
          </button>
        </div>
      )}

      {/* 1. Cyberpunk Hero */}
      <CyberpunkHero
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
        weddingDateTime={data.weddingDateTime}
        city={data.city}
        romanticQuote={data.romanticQuote}
        coverImage={data.coverImage}
        musicUrl={data.musicUrl}
      />

      {/* 2. Couple Section with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <CyberpunkCoupleSection groom={data.groom} bride={data.bride} />
      </motion.div>

      {/* 3. Events Section with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <CyberpunkEventsSection events={data.events} />
      </motion.div>

      {/* 4. Interactive Album with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <CyberpunkInteractiveAlbum gallery={data.gallery} />
      </motion.div>

      {/* 5. Love Quest Minigame with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <CyberpunkMinigame />
      </motion.div>

      {/* 6. RSVP Section with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <CyberpunkRSVPSection
          weddingId={data.id}
          groomName={groomName}
          brideName={brideName}
        />
      </motion.div>

      {/* 7. Gift Section with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <CyberpunkGiftSection
          gift={data.gift}
          groomName={groomName}
          brideName={brideName}
        />
      </motion.div>

      {/* 8. Wishes Guestbook with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <WishesSection weddingId={data.id} />
      </motion.div>

      {/* 9. Footer */}
      <Footer
        groomName={groomName}
        brideName={brideName}
        weddingDate={weddingDate}
      />
    </div>
  );
}
