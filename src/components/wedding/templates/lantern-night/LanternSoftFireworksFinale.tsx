import React, { useEffect, useRef, useState } from 'react';
import { SparklingStar, LotusNightIcon, HoiAnDiamondLantern, HoiAnGlobeLantern } from './LanternNightOrnaments';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playLanternWindChime } from './LanternAudioBar';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  gravity: number;
}

interface FireworkBurst {
  x: number;
  y: number;
  particles: Particle[];
}

interface LanternSoftFireworksFinaleProps {
  groomName: string;
  brideName: string;
}

export function LanternSoftFireworksFinale({ groomName, brideName }: LanternSoftFireworksFinaleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fireworkCount, setFireworkCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const bursts: FireworkBurst[] = [];
    const colors = [
      '#FDE047', // Champagne yellow
      '#F59E0B', // Warm amber
      '#FDA4AF', // Soft rose pink
      '#FED7AA', // Peach gold
      '#E0E7FF', // Starlight ivory
    ];

    const createSoftBurst = (x: number, y: number) => {
      const particleCount = 36; // Elegant floral flower burst
      const particles: Particle[] = [];
      const baseColor = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.35;
        const speed = 1.4 + Math.random() * 2.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: baseColor,
          size: 1.4 + Math.random() * 1.8,
          decay: 0.01 + Math.random() * 0.008,
          gravity: 0.022,
        });
      }

      bursts.push({ x, y, particles });
    };

    // Listen for user click trigger
    const onManualFirework = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>;
      if (customEvent.detail) {
        createSoftBurst(customEvent.detail.x, customEvent.detail.y);
      }
    };
    window.addEventListener('manual-firework', onManualFirework);

    // Auto trigger soft bursts every few seconds
    const burstTimer = setInterval(() => {
      const rx = width * 0.15 + Math.random() * (width * 0.7);
      const ry = height * 0.12 + Math.random() * (height * 0.45);
      createSoftBurst(rx, ry);
    }, 2400);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let b = bursts.length - 1; b >= 0; b--) {
        const burst = bursts[b];
        for (let p = burst.particles.length - 1; p >= 0; p--) {
          const pt = burst.particles[p];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += pt.gravity;
          pt.vx *= 0.985;
          pt.vy *= 0.985;
          pt.alpha -= pt.decay;

          if (pt.alpha <= 0) {
            burst.particles.splice(p, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = Math.max(0, pt.alpha);
          ctx.shadowBlur = 10;
          ctx.shadowColor = pt.color;
          ctx.fill();
        }

        if (burst.particles.length === 0) {
          bursts.splice(b, 1);
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(burstTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('manual-firework', onManualFirework);
    };
  }, []);

  const handleLaunchFirework = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFireworkCount((prev) => prev + 1);
    playLanternWindChime();

    // Dispatch custom burst
    const event = new CustomEvent('manual-firework', { detail: { x, y } });
    window.dispatchEvent(event);

    // If tapped 3 times, launch celebratory confetti
    if (fireworkCount % 4 === 3) {
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#FDE047', '#F59E0B', '#FDA4AF', '#FFF'],
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <section
      id="finale"
      onClick={handleLaunchFirework}
      className="relative min-h-[580px] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-24 overflow-hidden cursor-crosshair select-none"
    >
      {/* Background canvas for soft gentle fireworks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Decorative Lanterns */}
      <div className="absolute top-10 left-8 sm:left-16 animate-lantern-sway-left pointer-events-none opacity-85">
        <HoiAnDiamondLantern glowIntensity={1.2} colorVariant="gold" className="w-12 sm:w-14 h-32" />
      </div>

      <div className="absolute top-10 right-8 sm:right-16 animate-lantern-sway-right pointer-events-none opacity-85">
        <HoiAnGlobeLantern glowIntensity={1.2} colorVariant="amber" className="w-12 sm:w-14 h-30" />
      </div>

      {/* Content Box */}
      <div className="relative z-20 max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-serif uppercase tracking-widest backdrop-blur-md shadow-lg">
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
          <span>Pháo Hoa Chúc Phúc Dạ Tiệc</span>
          <SparklingStar className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h2 className="font-serif-title text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-b from-[#FFFDF0] via-[#FDE68A] to-[#D97706] drop-shadow-[0_4px_24px_rgba(245,158,11,0.6)] animate-gold-shimmer">
          Trân Trọng Cảm Ơn
        </h2>

        <p className="font-serif text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto">
          Sự hiện diện, lời chúc phúc và tình cảm yêu thương của quý khách là món quà vô giá, thắp sáng trọn vẹn đêm vui trăm năm của gia đình chúng mình.
        </p>

        {/* Center couple signature */}
        <div className="pt-4 space-y-2">
          <div className="flex justify-center">
            <SparklingStar className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div className="font-serif-title text-2xl sm:text-3xl font-bold tracking-widest text-amber-200 uppercase">
            {groomName} &amp; {brideName}
          </div>
          <p className="text-xs font-serif text-amber-400/90 tracking-widest uppercase">
            Cùng Hai Bên Gia Đình Đồng Kính Cẩn
          </p>
        </div>

        {/* Interactive Click Tip */}
        <div className="pt-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-serif shadow-xl hover:border-amber-400 transition-all">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Chạm bất kỳ đâu trên màn hình để thắp pháo hoa mừng tân lang &amp; tân nương</span>
          </div>
        </div>
      </div>
    </section>
  );
}
