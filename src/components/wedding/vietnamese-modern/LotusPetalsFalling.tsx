import React, { useEffect, useRef, useState } from 'react';
import { Flower2, Sparkles } from 'lucide-react';

interface LotusPetalParticle {
  x: number;
  y: number;
  size: number;
  width: number;
  height: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayOffset: number;
  swayRadius: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  pitch: number;
  pitchSpeed: number;
  opacity: number;
  palette: {
    tip: string;
    mid: string;
    base: string;
    vein: string;
  };
  curveOffset: number;
}

interface LotusPetalsFallingProps {
  className?: string;
  defaultEnabled?: boolean;
  showToggleButton?: boolean;
}

export function LotusPetalsFalling({
  className = '',
  defaultEnabled = true,
  showToggleButton = true,
}: LotusPetalsFallingProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          active: true,
        };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Traditional Vietnamese Lotus Color Palettes (Sắc Sen Việt Nam)
    const palettes = [
      // 1. Hồng Sen Phớt Đỏ Rượu (Deep Royal Rose to Silk Wine)
      {
        tip: 'rgba(140, 29, 47, 0.85)',
        mid: 'rgba(216, 74, 117, 0.75)',
        base: 'rgba(255, 240, 243, 0.85)',
        vein: 'rgba(140, 29, 47, 0.25)',
      },
      // 2. Sen Hồng Thắm Cung Đình (Imperial Pink Blossom)
      {
        tip: 'rgba(196, 68, 98, 0.85)',
        mid: 'rgba(247, 148, 172, 0.75)',
        base: 'rgba(255, 245, 247, 0.9)',
        vein: 'rgba(179, 57, 81, 0.25)',
      },
      // 3. Bạch Liên Ánh Kim (White Lotus with Champagne Gold Aura)
      {
        tip: 'rgba(216, 190, 135, 0.85)',
        mid: 'rgba(248, 235, 224, 0.8)',
        base: 'rgba(255, 253, 249, 0.95)',
        vein: 'rgba(216, 190, 135, 0.3)',
      },
      // 4. Sen Lụa Đào (Peach Blossom Lotus)
      {
        tip: 'rgba(224, 112, 122, 0.8)',
        mid: 'rgba(253, 194, 191, 0.75)',
        base: 'rgba(255, 248, 246, 0.9)',
        vein: 'rgba(196, 85, 96, 0.2)',
      },
    ];

    // Responsive petal density: 18 on mobile, 30 on desktop
    const count = width < 768 ? 18 : 32;

    const createPetal = (initialY?: number): LotusPetalParticle => {
      const size = Math.random() * 12 + 16; // Length between 16px and 28px
      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size,
        width: size * (Math.random() * 0.25 + 0.65), // Lotus petals are oval-shaped
        height: size * (Math.random() * 0.3 + 1.25),
        speedY: Math.random() * 0.9 + 0.65, // Gentle falling velocity
        speedX: Math.random() * 0.4 - 0.2,
        swaySpeed: Math.random() * 0.02 + 0.012,
        swayOffset: Math.random() * Math.PI * 2,
        swayRadius: Math.random() * 25 + 15,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.8,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        pitch: Math.random() * Math.PI * 2,
        pitchSpeed: Math.random() * 0.02 + 0.008,
        opacity: Math.random() * 0.35 + 0.65,
        palette,
        curveOffset: (Math.random() - 0.5) * 4,
      };
    };

    const petals: LotusPetalParticle[] = Array.from({ length: count }, () =>
      createPetal()
    );

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // 1. Natural Sinusoidal Floating Sway
        p.swayOffset += p.swaySpeed;
        const currentSway = Math.sin(p.swayOffset) * p.swayRadius;

        p.y += p.speedY;
        p.x += p.speedX + Math.cos(p.swayOffset * 0.5) * 0.35;

        // 2. 3D Tumbling Angles
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;
        p.pitch += p.pitchSpeed;

        // 3. Interactive Breeze from mouse / touch
        if (mouse.active) {
          const dx = (p.x + currentSway) - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 3.5;
            p.y += (dy / dist) * force * 2;
            p.rotationSpeed += (dx > 0 ? 0.08 : -0.08) * force;
          }
        }

        // 4. Wrap around screen smoothly
        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
        }
        if (p.x + currentSway > width + 50) {
          p.x = -50 - currentSway;
        } else if (p.x + currentSway < -50) {
          p.x = width + 50 - currentSway;
        }

        // 5. Draw the 3D Lotus Petal
        ctx.save();
        ctx.translate(p.x + currentSway, p.y);

        // 2D In-plane rotation
        ctx.rotate((p.rotation * Math.PI) / 180);

        // 3D Flip (Perspective scale across X & Y axis)
        const scaleX = Math.cos(p.flip);
        const scaleY = 0.85 + Math.sin(p.pitch) * 0.15;
        ctx.scale(Math.abs(scaleX) < 0.08 ? 0.08 : scaleX, scaleY);

        ctx.globalAlpha = p.opacity;

        const w = p.width;
        const h = p.height;

        // Shadow under each floating petal for depth
        ctx.shadowColor = 'rgba(99, 18, 29, 0.12)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;

        // Gradient running from Petal Base to Petal Tip
        const grad = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
        grad.addColorStop(0, p.palette.base);
        grad.addColorStop(0.45, p.palette.mid);
        grad.addColorStop(1, p.palette.tip);

        ctx.fillStyle = grad;

        // Authentic Lotus Petal Contour (Cánh hoa sen thon bầu)
        ctx.beginPath();
        // Start at petal base
        ctx.moveTo(0, -h * 0.5);

        // Left curved contour to petal shoulder and tip
        ctx.bezierCurveTo(
          -w * 0.55,
          -h * 0.28,
          -w * 0.65,
          h * 0.15,
          -w * 0.12,
          h * 0.46
        );

        // Soft pointed apex at the petal tip
        ctx.quadraticCurveTo(0, h * 0.54, w * 0.12, h * 0.46);

        // Right curved contour back down to base
        ctx.bezierCurveTo(
          w * 0.65,
          h * 0.15,
          w * 0.55,
          -h * 0.28,
          0,
          -h * 0.5
        );
        ctx.closePath();
        ctx.fill();

        // Delicate central vein running through the lotus petal
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = p.palette.vein;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.42);
        ctx.quadraticCurveTo(p.curveOffset, 0, 0, h * 0.38);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isEnabled]);

  return (
    <>
      {isEnabled && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`fixed inset-0 pointer-events-none z-30 ${className}`}
        />
      )}

      {showToggleButton && (
        <button
          id="toggle-lotus-petals-btn"
          onClick={() => setIsEnabled(!isEnabled)}
          title={isEnabled ? 'Tắt hiệu ứng cánh sen rơi' : 'Bật hiệu ứng cánh sen rơi'}
          aria-label="Chuyển đổi hiệu ứng cánh sen rơi"
          className="fixed bottom-6 left-6 z-40 group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#FFFFFF] text-[#63121D] border border-[#D8BE87] shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-serif-title font-medium"
        >
          <div className="relative">
            <Flower2
              className={`w-4 h-4 transition-transform duration-500 ${
                isEnabled
                  ? 'text-[#63121D] rotate-12 scale-110'
                  : 'text-[#8C8275] opacity-50'
              }`}
            />
            {isEnabled && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#63121D] animate-ping" />
            )}
          </div>
          <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-[#18181A]">
            {isEnabled ? 'Cánh Sen Rơi' : 'Bật Cánh Sen'}
          </span>
        </button>
      )}
    </>
  );
}
