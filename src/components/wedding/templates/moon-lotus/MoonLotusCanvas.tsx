import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export function MoonLotusCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Palette of celestial starlight
    const starColors = ['#FFFDF9', '#F4E4BA', '#E2E8F0', '#FDE8ED', '#FBD38D'];

    // Generate background stars
    let stars: Star[] = [];
    const starCount = Math.min(180, Math.floor((width * height) / 8000));

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: 0.015 + Math.random() * 0.025,
          twinklePhase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = 2;

    const spawnShootingStar = () => {
      if (shootingStars.length < maxShootingStars && Math.random() < 0.008) {
        shootingStars.push({
          x: Math.random() * (width * 0.8),
          y: Math.random() * (height * 0.4),
          length: Math.random() * 90 + 70,
          speed: Math.random() * 6 + 6,
          angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
          opacity: 1,
          active: true,
        });
      }
    };

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const currentAlpha =
          star.alpha * (0.6 + 0.4 * Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase));

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 2;
        ctx.shadowColor = star.color;
        ctx.fill();

        // Cross shimmer for larger stars
        if (star.radius > 1.3 && currentAlpha > 0.6) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - 4, star.y);
          ctx.lineTo(star.x + 4, star.y);
          ctx.moveTo(star.x, star.y - 4);
          ctx.lineTo(star.x, star.y + 4);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Draw Shooting Stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        if (!s.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        const endX = s.x - Math.cos(s.angle) * s.length;
        const endY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(244, 228, 186, 0.85)');
        grad.addColorStop(1, 'rgba(244, 228, 186, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.globalAlpha = s.opacity;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        // Update shooting star movement
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.012;

        if (s.opacity <= 0 || s.x > width + 100 || s.y > height + 100) {
          s.active = false;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{ opacity: 0.9 }}
    />
  );
}
