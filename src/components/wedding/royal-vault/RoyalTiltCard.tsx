import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface RoyalTiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  key?: React.Key;
}

export function RoyalTiltCard({
  children,
  className = '',
  glowColor = 'rgba(232, 180, 152, 0.4)',
  maxTilt = 8,
}: RoyalTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);
  const sheenX = useTransform(smoothX, [0, 1], ['0%', '100%']);
  const sheenY = useTransform(smoothY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: 1000 }} className="relative group">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden transition-shadow duration-300 ${
          isHovered ? 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]' : 'shadow-xl'
        } ${className}`}
      >
        {/* Dynamic Holographic / Prismatic Sheen on Hover */}
        {isHovered && (
          <motion.div
            style={{
              background: `radial-gradient(circle at ${sheenX} ${sheenY}, ${glowColor} 0%, transparent 60%)`,
            }}
            className="absolute inset-0 pointer-events-none z-20 mix-blend-screen transition-opacity duration-200"
          />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
}
