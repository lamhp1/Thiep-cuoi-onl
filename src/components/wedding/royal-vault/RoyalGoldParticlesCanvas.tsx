import React, { useEffect, useRef } from 'react';

export function RoyalGoldParticlesCanvas() {
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

    // Mouse tracking for subtle repulsion
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll velocity tracking
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let scrollVelocity = 0;
    let targetScrollVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      // Cap max impulse
      targetScrollVelocity = Math.max(-15, Math.min(15, deltaY * 0.45));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Gold Stardust Particle definition
    interface StardustParticle {
      x: number;
      y: number;
      size: number;
      baseSpeedX: number;
      baseSpeedY: number;
      opacity: number;
      baseOpacity: number;
      hue: number;
      pulsePhase: number;
    }

    // Velvet Rose Petal definition
    interface PetalParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      wobbleSpeed: number;
      wobblePhase: number;
      rotation: number;
      rotSpeed: number;
      opacity: number;
    }

    const stardustCount = Math.min(65, Math.floor(width / 22));
    const stardust: StardustParticle[] = [];

    for (let i = 0; i < stardustCount; i++) {
      stardust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 2.5,
        baseSpeedX: (Math.random() - 0.5) * 0.35,
        baseSpeedY: -0.2 - Math.random() * 0.4, // slow upward float
        opacity: 0.2 + Math.random() * 0.6,
        baseOpacity: 0.2 + Math.random() * 0.6,
        hue: 35 + Math.random() * 15,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Falling velvet petals (14 graceful petals)
    const petalCount = 14;
    const petals: PetalParticle[] = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 8,
        speedY: 0.8 + Math.random() * 1.1,
        wobbleSpeed: 0.02 + Math.random() * 0.025,
        wobblePhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.45 + Math.random() * 0.35,
      });
    }

    let time = 0;
    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.02;

      // Smooth decay of scroll velocity
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.08;
      targetScrollVelocity *= 0.94; // damping

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Stardust particles
      for (let i = 0; i < stardust.length; i++) {
        const p = stardust[i];

        // Move with scroll velocity influence (scrolling down pushes particles up slightly faster)
        p.x += p.baseSpeedX + (Math.sin(time + i) * 0.2);
        p.y += p.baseSpeedY - (scrollVelocity * 0.4);

        // Screen boundary wrap
        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        } else if (p.y > height + 15) {
          p.y = -15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Subtle mouse repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          p.x -= (dx / dist) * 0.7;
          p.y -= (dy / dist) * 0.7;
        }

        // Pulse opacity
        const pulse = Math.sin(time * 2 + p.pulsePhase);
        const currentOpacity = Math.max(0.1, p.baseOpacity + pulse * 0.25);

        // Glowing halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.8);
        grad.addColorStop(0, `hsla(${p.hue}, 95%, 88%, ${currentOpacity})`);
        grad.addColorStop(0.35, `hsla(${p.hue}, 85%, 68%, ${currentOpacity * 0.7})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Core bright spark
        ctx.fillStyle = `rgba(255, 252, 245, ${currentOpacity * 0.95})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Falling Velvet Rose Petals
      for (let i = 0; i < petals.length; i++) {
        const pt = petals[i];

        // Petal physics: downward drift + horizontal sinusoidal sway + scroll boost
        pt.y += pt.speedY + (scrollVelocity * 0.25);
        pt.x += Math.sin(time * 2 + pt.wobblePhase) * 0.8;
        pt.rotation += pt.rotSpeed;

        if (pt.y > height + 20) {
          pt.y = -20;
          pt.x = Math.random() * width;
        } else if (pt.y < -20) {
          pt.y = height + 20;
        }
        if (pt.x < -20) pt.x = width + 20;
        if (pt.x > width + 20) pt.x = -20;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rotation);

        // Flatten horizontally for 3D tumbling appearance
        const scaleX = Math.cos(time * 2 + pt.wobblePhase);
        ctx.scale(scaleX, 1);

        // Draw curved rose petal
        ctx.beginPath();
        ctx.moveTo(0, -pt.size);
        ctx.bezierCurveTo(pt.size * 0.9, -pt.size * 0.8, pt.size * 0.8, pt.size * 0.8, 0, pt.size);
        ctx.bezierCurveTo(-pt.size * 0.8, pt.size * 0.8, -pt.size * 0.9, -pt.size * 0.8, 0, -pt.size);
        ctx.closePath();

        // Royal Burgundy velvet gradient with gold rim sheen
        const petalGrad = ctx.createLinearGradient(0, -pt.size, 0, pt.size);
        petalGrad.addColorStop(0, `rgba(168, 38, 62, ${pt.opacity})`);
        petalGrad.addColorStop(0.7, `rgba(105, 18, 34, ${pt.opacity * 0.9})`);
        petalGrad.addColorStop(1, `rgba(58, 8, 18, ${pt.opacity * 0.8})`);

        ctx.fillStyle = petalGrad;
        ctx.fill();

        // Delicate gold edge highlight
        ctx.strokeStyle = `rgba(232, 180, 152, ${pt.opacity * 0.35})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-75"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
