import React, { useEffect, useRef } from 'react';

export function RoyalSparkleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Sparkle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      rotation: number;
      rotSpeed: number;
    }

    const sparkles: Sparkle[] = [];
    const colors = ['#FFF4E0', '#E8B498', '#FCE4BE', '#DDA789', '#FFFFFF'];

    const spawnSparkle = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i++) {
        if (sparkles.length > 50) sparkles.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        sparkles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: 1.5 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.02 + Math.random() * 0.03,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.1,
        });
      }
    };

    let lastX = 0;
    let lastY = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX === undefined || clientY === undefined) return;

      const dist = Math.hypot(clientX - lastX, clientY - lastY);
      if (dist > 18) {
        spawnSparkle(clientX, clientY, 2);
        lastX = clientX;
        lastY = clientY;
      }
    };

    // Also spawn sparkles when scrolling
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) > 25) {
        const randX = Math.random() * width;
        const randY = Math.random() * height;
        spawnSparkle(randX, randY, 1);
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        s.rotation += s.rotSpeed;

        if (s.alpha <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = Math.max(0, s.alpha);

        // Draw 4-point diamond star
        ctx.fillStyle = s.color;
        ctx.beginPath();
        const r = s.size;
        ctx.moveTo(0, -r * 2);
        ctx.lineTo(r * 0.4, -r * 0.4);
        ctx.lineTo(r * 2, 0);
        ctx.lineTo(r * 0.4, r * 0.4);
        ctx.lineTo(0, r * 2);
        ctx.lineTo(-r * 0.4, r * 0.4);
        ctx.lineTo(-r * 2, 0);
        ctx.lineTo(-r * 0.4, -r * 0.4);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
