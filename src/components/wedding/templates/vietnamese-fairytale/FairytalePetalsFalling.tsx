import React, { useMemo } from 'react';

interface PetalItem {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  type: 'lotus' | 'bamboo' | 'sparkle';
  color: string;
}

export function FairytalePetalsFalling({ count = 18 }: { count?: number }) {
  const petals = useMemo<PetalItem[]>(() => {
    const items: PetalItem[] = [];
    const types: ('lotus' | 'bamboo' | 'sparkle')[] = ['lotus', 'lotus', 'bamboo', 'sparkle'];
    const colors = ['#F4B6C2', '#E78EA0', '#D64560', '#52B788', '#E5A93C'];

    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        left: Math.random() * 96 + 2,
        size: Math.random() * 12 + 10,
        duration: Math.random() * 7 + 8,
        delay: Math.random() * 6,
        rotate: Math.random() * 360,
        type: types[i % types.length],
        color: colors[i % colors.length],
      });
    }
    return items;
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute -top-10 opacity-75 animate-fall"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        >
          {p.type === 'lotus' && (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 24 32"
              fill={p.color}
              style={{ transform: `rotate(${p.rotate}deg)` }}
            >
              {/* Curved delicate lotus petal shape */}
              <path d="M12 0 C4 10 0 20 6 28 C12 34 18 30 20 22 C22 14 18 6 12 0 Z" opacity="0.85" />
            </svg>
          )}

          {p.type === 'bamboo' && (
            <svg
              width={p.size * 1.5}
              height={p.size * 0.6}
              viewBox="0 0 32 14"
              fill="#2D6A4F"
              style={{ transform: `rotate(${p.rotate}deg)` }}
            >
              {/* Slender bamboo leaf shape */}
              <path d="M0 7 C10 0 22 2 32 7 C22 12 10 14 0 7 Z" opacity="0.75" />
            </svg>
          )}

          {p.type === 'sparkle' && (
            <div
              className="rounded-full blur-[0.5px]"
              style={{
                width: `${p.size * 0.4}px`,
                height: `${p.size * 0.4}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
