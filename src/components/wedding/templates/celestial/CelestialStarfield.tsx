import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  z: number; // depth layer (1: far, 2: mid, 3: near)
  size: number;
  color: string;
  baseAlpha: number;
  currentAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hasSpikes: boolean;
  driftX: number;
  driftY: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  decay: number;
  color: string;
  headSize: number;
}

interface InteractiveParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

interface CelestialStarfieldProps {
  className?: string;
  enableShootingStars?: boolean;
  enableConstellations?: boolean;
  interactive?: boolean;
  densityMultiplier?: number;
  meteorTrigger?: number;
}

export function CelestialStarfield({
  className = '',
  enableShootingStars = true,
  enableConstellations = true,
  interactive = true,
  densityMultiplier = 1,
  meteorTrigger = 0,
}: CelestialStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const particlesRef = useRef<InteractiveParticle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const spawnShootingStarRef = useRef<(() => void) | null>(null);

  // Palette of cosmic starry colors
  const starColors = [
    '#FFFFFF', // Diamond White
    '#FFF8E7', // Cosmic Warm White
    '#E5C378', // Celestial Royale Gold
    '#FBD38D', // Starlight Amber
    '#90CDF4', // Sapphire Cyan
    '#C3DAFE', // Periwinkle Blue
    '#E9D8FD', // Nebula Violet
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / width - 0.5) * 40;
      const normalizedY = (e.clientY / height - 0.5) * 40;
      mouseRef.current.targetX = normalizedX;
      mouseRef.current.targetY = normalizedY;

      // Spawn subtle stardust trail on movement
      if (interactive && Math.random() < 0.35) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 2 + 1,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          alpha: 0.9,
          life: 1,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      const normalizedX = (touch.clientX / width - 0.5) * 30;
      const normalizedY = (touch.clientY / height - 0.5) * 30;
      mouseRef.current.targetX = normalizedX;
      mouseRef.current.targetY = normalizedY;

      if (interactive && Math.random() < 0.4) {
        particlesRef.current.push({
          x: touch.clientX,
          y: touch.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 2 + 1,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          alpha: 0.9,
          life: 1,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initialize stars according to screen area
    function initStars() {
      const starCount = Math.floor(Math.min(260, Math.max(120, (width * height) / 6000)) * densityMultiplier);
      const stars: Star[] = [];

      for (let i = 0; i < starCount; i++) {
        const z = Math.random() < 0.6 ? 1 : Math.random() < 0.85 ? 2 : 3;
        const size = z === 1 ? Math.random() * 0.9 + 0.5 : z === 2 ? Math.random() * 1.3 + 1.2 : Math.random() * 1.8 + 2.2;
        const hasSpikes = z === 3 && Math.random() < 0.65; // Brightest stars have 4-point flares
        const baseAlpha = z === 1 ? Math.random() * 0.4 + 0.3 : z === 2 ? Math.random() * 0.5 + 0.45 : Math.random() * 0.4 + 0.6;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          size,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          baseAlpha,
          currentAlpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.035 + 0.015,
          twinklePhase: Math.random() * Math.PI * 2,
          hasSpikes,
          driftX: (Math.random() - 0.5) * 0.08,
          driftY: (Math.random() - 0.5) * 0.08,
        });
      }

      starsRef.current = stars;
    }

    initStars();

    // Spawn a shooting star
    function spawnShootingStar() {
      if (!enableShootingStars) return;
      const angleDeg = Math.random() * 25 + 30; // 30-55 degrees trajectory
      const angle = (angleDeg * Math.PI) / 180;
      const speed = Math.random() * 10 + 12;
      const length = Math.random() * 120 + 80;

      // Spawn from top or left edge
      const startFromTop = Math.random() < 0.7;
      const x = startFromTop ? Math.random() * width * 0.85 : 0;
      const y = startFromTop ? 0 : Math.random() * height * 0.4;

      shootingStarsRef.current.push({
        x,
        y,
        length,
        speed,
        angle,
        opacity: 1,
        decay: Math.random() * 0.015 + 0.01,
        color: Math.random() < 0.65 ? '#E5C378' : '#70B5FF',
        headSize: Math.random() * 1.8 + 1.8,
      });
    }

    spawnShootingStarRef.current = spawnShootingStar;

    // Main animation loop
    let lastTime = performance.now();

    function render(currentTime: number) {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Periodically trigger shooting star
      if (currentTime - lastSpawnRef.current > (Math.random() * 2500 + 2000)) {
        spawnShootingStar();
        lastSpawnRef.current = currentTime;
      }

      const parallaxX = mouseRef.current.x;
      const parallaxY = mouseRef.current.y;
      const stars = starsRef.current;

      // 1. Draw Constellation lines between nearby stars (only for mid & foreground stars)
      if (enableConstellations) {
        ctx.lineWidth = 0.55;
        const maxDist = 95;
        for (let i = 0; i < stars.length; i++) {
          if (stars[i].z === 1) continue; // Skip far stars for performance & clarity
          const x1 = stars[i].x + (parallaxX * stars[i].z * 0.35);
          const y1 = stars[i].y + (parallaxY * stars[i].z * 0.35);

          for (let j = i + 1; j < stars.length; j++) {
            if (stars[j].z === 1) continue;
            const x2 = stars[j].x + (parallaxX * stars[j].z * 0.35);
            const y2 = stars[j].y + (parallaxY * stars[j].z * 0.35);

            const dx = x1 - x2;
            const dy = y1 - y2;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const lineAlpha = (1 - dist / maxDist) * 0.22 * Math.min(stars[i].currentAlpha, stars[j].currentAlpha);
              ctx.strokeStyle = `rgba(229, 195, 120, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
          }
        }
      }

      // 2. Draw Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle update
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase);
        star.currentAlpha = Math.max(0.15, Math.min(1, star.baseAlpha + twinkle * 0.35));

        // Position with parallax drift
        const drawX = star.x + (parallaxX * star.z * 0.35);
        const drawY = star.y + (parallaxY * star.z * 0.35);

        // Ambient drift
        star.x += star.driftX;
        star.y += star.driftY;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.save();
        ctx.globalAlpha = star.currentAlpha;

        // Radial glow halo for bright stars
        if (star.z >= 2) {
          const glowGrad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, star.size * 4);
          glowGrad.addColorStop(0, star.color);
          glowGrad.addColorStop(0.3, 'rgba(229, 195, 120, 0.35)');
          glowGrad.addColorStop(1, 'rgba(229, 195, 120, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core star body
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point cross diffraction spikes for sparkling prominent stars
        if (star.hasSpikes && star.currentAlpha > 0.45) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.7;
          const spikeLen = star.size * 3.5 * star.currentAlpha;

          ctx.beginPath();
          // Horizontal spike
          ctx.moveTo(drawX - spikeLen, drawY);
          ctx.lineTo(drawX + spikeLen, drawY);
          // Vertical spike
          ctx.moveTo(drawX, drawY - spikeLen);
          ctx.lineTo(drawX, drawY + spikeLen);
          ctx.stroke();

          // Subtle diagonal micro-spikes for extra brilliance
          if (star.z === 3) {
            ctx.lineWidth = 0.4;
            const diagLen = spikeLen * 0.55;
            ctx.beginPath();
            ctx.moveTo(drawX - diagLen, drawY - diagLen);
            ctx.lineTo(drawX + diagLen, drawY + diagLen);
            ctx.moveTo(drawX - diagLen, drawY + diagLen);
            ctx.lineTo(drawX + diagLen, drawY - diagLen);
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // 3. Draw and update shooting stars
      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const s = shootingStarsRef.current[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= s.decay;

        if (s.opacity <= 0 || s.x > width + 200 || s.y > height + 200) {
          shootingStarsRef.current.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.opacity);

        // Shooting star tail gradient
        const tailGrad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        tailGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        tailGrad.addColorStop(0.7, s.color);
        tailGrad.addColorStop(1, '#FFFFFF');

        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Incandescent glowing meteor head
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.headSize * 3);
        headGlow.addColorStop(0, '#FFFFFF');
        headGlow.addColorStop(0.3, s.color);
        headGlow.addColorStop(1, 'rgba(229, 195, 120, 0)');

        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.headSize * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 4. Draw and update interactive stardust particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        p.life -= 0.02;

        if (p.alpha <= 0 || p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    }

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [enableShootingStars, enableConstellations, interactive, densityMultiplier]);

  // Handle triggered meteor showers
  useEffect(() => {
    if (meteorTrigger && meteorTrigger > 0) {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          spawnShootingStarRef.current?.();
        }, i * 160);
      }
    }
  }, [meteorTrigger]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Deep Space Radial Nebula Aura Clouds (breathing & organic cosmic glow) */}
      <div className="absolute inset-0 bg-[#030611] pointer-events-none" />

      {/* Galaxy Core 1: Golden Amber Starlight Aura */}
      <div
        className="absolute top-[-10%] left-[25%] w-[800px] h-[800px] rounded-full opacity-25 mix-blend-screen pointer-events-none blur-[120px] animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(229,195,120,0.3) 0%, rgba(200,155,60,0.1) 50%, transparent 75%)',
          animationDuration: '9s',
        }}
      />

      {/* Galaxy Core 2: Royal Sapphire Nebula */}
      <div
        className="absolute top-[35%] right-[-5%] w-[750px] h-[750px] rounded-full opacity-20 mix-blend-screen pointer-events-none blur-[130px] animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(79,140,255,0.35) 0%, rgba(28,37,65,0.15) 50%, transparent 75%)',
          animationDuration: '12s',
        }}
      />

      {/* Galaxy Core 3: Mystic Violet Deep Space Nebula */}
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[850px] h-[850px] rounded-full opacity-25 mix-blend-screen pointer-events-none blur-[140px] animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(147,51,234,0.25) 0%, rgba(88,28,135,0.1) 50%, transparent 75%)',
          animationDuration: '14s',
        }}
      />

      {/* HTML5 Canvas with Sparkling Stars, Constellations, Shooting Stars, and Stardust */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
