import React from 'react';
import { motion } from 'motion/react';
import { Star, Sparkles, Compass } from 'lucide-react';

export function CelestialConstellationRing({
  size = 600,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Constellation Orbit with Degree Ticks */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-[#E5C378]/20 border-dashed"
        style={{
          boxShadow: '0 0 50px rgba(229, 195, 120, 0.08), inset 0 0 50px rgba(229, 195, 120, 0.05)',
        }}
      >
        {/* Orbiting Satellite Star 1 */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E5C378] shadow-[0_0_15px_#E5C378] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white" />
        </div>
        {/* Orbiting Satellite Star 2 */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#70B5FF] shadow-[0_0_15px_#70B5FF]" />
      </motion.div>

      {/* Middle Counter-Rotating Astrolabe Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[15%] rounded-full border border-[#70B5FF]/20"
      >
        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#E5C378] shadow-[0_0_12px_#E5C378]" />
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
      </motion.div>

      {/* Inner Golden Halo */}
      <div className="absolute inset-[30%] rounded-full bg-radial from-[#E5C378]/10 via-[#64B5F6]/5 to-transparent blur-md" />
    </div>
  );
}

export function FloatingSparkleStars() {
  const stars = [
    { top: '15%', left: '8%', delay: 0, size: 'text-base', color: 'text-[#E5C378]' },
    { top: '22%', right: '10%', delay: 1.2, size: 'text-xl', color: 'text-[#70B5FF]' },
    { top: '45%', left: '5%', delay: 2.5, size: 'text-sm', color: 'text-white' },
    { top: '65%', right: '7%', delay: 0.8, size: 'text-lg', color: 'text-[#E5C378]' },
    { top: '80%', left: '12%', delay: 1.8, size: 'text-sm', color: 'text-[#FBD38D]' },
    { top: '88%', right: '14%', delay: 3.1, size: 'text-base', color: 'text-white' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {stars.map((s, idx) => (
        <motion.div
          key={idx}
          style={{ top: s.top, left: s.left, right: s.right }}
          animate={{
            y: [-12, 12, -12],
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.2, 0.85],
          }}
          transition={{
            duration: 4.5,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute ${s.size} ${s.color} select-none drop-shadow-[0_0_8px_currentColor]`}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
}
