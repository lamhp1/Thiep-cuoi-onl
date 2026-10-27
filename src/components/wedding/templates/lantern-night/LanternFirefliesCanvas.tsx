import React, { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
  phase: number;
}

export function LanternFirefliesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse / touch for interactive reactive firefly dispersal
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
        };
      }
    };

    const onMouseLeave = () => {
      mousePos.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    // Initialize fireflies
    const count = Math.min(45, Math.floor((width * height) / 25000) + 18);
    const fireflies: Firefly[] = [];

    const colors = [
      '#FDE047', // bright amber
      '#F59E0B', // warm gold
      '#FEF08A', // soft lemon
      '#34D399', // faint night emerald
      '#FCD34D', // golden peach
    ];

    for (let i = 0; i < count; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseAlpha: 0.3 + Math.random() * 0.5,
        alpha: 0.5,
        twinkleSpeed: 0.02 + Math.random() * 0.035,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];

        // Sinusoidal organic floating
        f.x += f.vx + Math.sin(time + f.phase) * 0.35;
        f.y += f.vy + Math.cos(time + f.phase * 0.8) * 0.35;

        // Twinkle luminance pulse
        f.alpha = f.baseAlpha + Math.sin(time * 2 + f.phase) * (f.baseAlpha * 0.6);
        f.alpha = Math.max(0.1, Math.min(0.95, f.alpha));

        // Interactive mouse gentle push
        if (mousePos.current.active) {
          const dx = f.x - mousePos.current.x;
          const dy = f.y - mousePos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            f.x += (dx / dist) * force * 1.5;
            f.y += (dy / dist) * force * 1.5;
          }
        }

        // Boundary wrapping
        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;
        if (f.y < -20) f.y = height + 20;
        if (f.y > height + 20) f.y = -20;

        // Draw glowing firefly aura
        const glowRadius = f.radius * 4.5;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowRadius);
        grad.addColorStop(0, f.color);
        grad.addColorStop(0.3, f.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(f.x, f.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = f.alpha * 0.85;
        ctx.fill();

        // Draw solid bright core
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = Math.min(1, f.alpha * 1.2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
