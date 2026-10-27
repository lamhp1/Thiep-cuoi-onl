import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

export function PetalsFalling() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;
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
    };

    window.addEventListener('resize', handleResize);

    const petalColors = [
      'rgba(255, 214, 224, ',
      'rgba(255, 235, 238, ',
      'rgba(255, 192, 203, ',
      'rgba(250, 240, 230, ',
      'rgba(247, 231, 206, ',
    ];

    const petalCount = width < 768 ? 16 : 28;
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1.2 + 0.6,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 1.5 - 0.75,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.x += p.speedX + Math.sin(p.y * 0.005) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.beginPath();
        // Delicate curved flower petal shape
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size / 2, p.size / 2, 0, p.size);
        ctx.bezierCurveTo(p.size / 2, p.size / 2, p.size / 2, -p.size / 2, 0, 0);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isEnabled]);

  return (
    <>
      {isEnabled && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-20"
        />
      )}
      <button
        id="toggle-petals-btn"
        onClick={() => setIsEnabled(!isEnabled)}
        title={isEnabled ? 'Tắt hiệu ứng cánh hoa' : 'Bật hiệu ứng cánh hoa'}
        aria-label="Chuyển đổi cánh hoa rơi"
        className="fixed bottom-24 left-6 z-40 p-2.5 rounded-full bg-white/85 hover:bg-white text-[#D4AF37] border border-[#D4AF37]/30 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95"
      >
        <Sparkles className={`w-4 h-4 ${isEnabled ? 'opacity-100' : 'opacity-40'}`} />
      </button>
    </>
  );
}
