import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { RosePetalSvg } from './FloralOrnaments';

/**
 * Scroll-linked Petals (Đặc biệt: Một số cánh hoa bay nhẹ theo scroll. Không phải particle liên tục. Chỉ 5–10 phần tử.)
 * Exactly 7 distinct rose petals floating in fixed viewport coordinates.
 * Their Y-drift, horizontal sway, and rotation are directly mapped to user scroll position.
 */

interface PetalConfig {
  id: number;
  initialX: number; // percentage across screen 0-100
  initialY: number; // percentage down screen 0-100
  size: number; // in px
  color: string;
  secondaryColor: string;
  speedY: number; // vertical drift factor
  swayAmp: number; // horizontal sway amplitude in px
  swayFreq: number; // frequency of sway
  rotSpeed: number; // degrees per 100% scroll
  baseAngle: number;
  opacity: number;
}

const PETALS_CONFIG: PetalConfig[] = [
  {
    id: 1,
    initialX: 8,
    initialY: 15,
    size: 28,
    color: '#F8B4C4',
    secondaryColor: '#FFF0F3',
    speedY: 280,
    swayAmp: 45,
    swayFreq: 3,
    rotSpeed: 210,
    baseAngle: 18,
    opacity: 0.85,
  },
  {
    id: 2,
    initialX: 88,
    initialY: 22,
    size: 24,
    color: '#F48FB1',
    secondaryColor: '#FCE4EC',
    speedY: 340,
    swayAmp: -50,
    swayFreq: 2.5,
    rotSpeed: -260,
    baseAngle: -25,
    opacity: 0.8,
  },
  {
    id: 3,
    initialX: 20,
    initialY: 45,
    size: 32,
    color: '#E57390',
    secondaryColor: '#F8BBD0',
    speedY: 240,
    swayAmp: 35,
    swayFreq: 4,
    rotSpeed: 180,
    baseAngle: 40,
    opacity: 0.9,
  },
  {
    id: 4,
    initialX: 92,
    initialY: 58,
    size: 22,
    color: '#F06292',
    secondaryColor: '#FFF',
    speedY: 400,
    swayAmp: -40,
    swayFreq: 3,
    rotSpeed: 300,
    baseAngle: -15,
    opacity: 0.75,
  },
  {
    id: 5,
    initialX: 12,
    initialY: 72,
    size: 26,
    color: '#F8B4C4',
    secondaryColor: '#FFF5F7',
    speedY: 290,
    swayAmp: 55,
    swayFreq: 2,
    rotSpeed: -190,
    baseAngle: 65,
    opacity: 0.82,
  },
  {
    id: 6,
    initialX: 78,
    initialY: 82,
    size: 30,
    color: '#E91E63',
    secondaryColor: '#F8BBD0',
    speedY: 320,
    swayAmp: 40,
    swayFreq: 3.5,
    rotSpeed: 240,
    baseAngle: 12,
    opacity: 0.78,
  },
  {
    id: 7,
    initialX: 52,
    initialY: 30,
    size: 20,
    color: '#F48FB1',
    secondaryColor: '#FFF0F3',
    speedY: 360,
    swayAmp: -30,
    swayFreq: 4,
    rotSpeed: -160,
    baseAngle: -45,
    opacity: 0.7,
  },
];

interface ScrollPetalItemProps {
  key?: React.Key;
  config: PetalConfig;
  scrollYProgress: any;
}

function ScrollPetalItem({
  config,
  scrollYProgress,
}: ScrollPetalItemProps) {
  // Map scroll 0 -> 1 to vertical travel
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, config.speedY]
  );
  // Map scroll to horizontal sway with trigonometric sinusoidal feel
  const rawX = useTransform(scrollYProgress, (progress: number) => {
    return Math.sin(progress * Math.PI * config.swayFreq) * config.swayAmp;
  });
  // Map scroll to rotation
  const rawRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [config.baseAngle, config.baseAngle + config.rotSpeed]
  );

  // Apply silky spring physics so the scroll feels organic and light as air
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const smoothRotate = useSpring(rawRotate, { stiffness: 50, damping: 18 });

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${config.initialX}%`,
        top: `${config.initialY}%`,
        x: smoothX,
        y: smoothY,
        rotate: smoothRotate,
        width: config.size,
        height: config.size * 1.15,
        opacity: config.opacity,
        pointerEvents: 'none',
      }}
      className="filter drop-shadow-sm transition-opacity duration-300"
    >
      <RosePetalSvg
        color={config.color}
        secondaryColor={config.secondaryColor}
        className="w-full h-full"
      />
    </motion.div>
  );
}

export function FloralScrollPetals() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none"
    >
      {PETALS_CONFIG.map((petal) => (
        <ScrollPetalItem
          key={petal.id}
          config={petal}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
