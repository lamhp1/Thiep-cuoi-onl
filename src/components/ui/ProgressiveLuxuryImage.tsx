import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Flower2 } from 'lucide-react';
import { MinimalistLotus } from '../wedding/vietnamese-modern/VietnameseModernOrnaments';

interface ProgressiveLuxuryImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  priority?: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: () => void;
}

export function ProgressiveLuxuryImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  priority = false,
  referrerPolicy = 'no-referrer',
  onClick,
}: ProgressiveLuxuryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const cleanSrc = src?.trim() ? src.trim() : null;

  if (!cleanSrc) {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden bg-[#EFE8DC] flex flex-col items-center justify-center p-3 text-center w-full h-full ${aspectRatio ? aspectRatio : ''} ${containerClassName}`}
      >
        <MinimalistLotus className="w-8 h-8 text-[#D8BE87] mb-1 opacity-70" />
        <span className="text-[10px] font-serif-title text-[#8C8275]">{alt}</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-[#EFE8DC] w-full h-full ${aspectRatio ? aspectRatio : ''} ${containerClassName}`}
    >
      {/* 1. Loading Shimmer Skeleton (Solid warm champagne & lotus pulse) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-r from-[#EFE8DC] via-[#F8F4EC] to-[#EFE8DC] animate-pulse">
          {/* Subtle spinning shimmer band */}
          <div className="w-10 h-10 rounded-full bg-[#D8BE87]/30 border border-[#D8BE87] flex items-center justify-center text-[#63121D] shadow-sm">
            <MinimalistLotus className="w-6 h-6 animate-pulse text-[#63121D]" />
          </div>
          <span className="text-[10px] font-serif-title uppercase tracking-[0.2em] text-[#8C8275] mt-2 font-medium">
            Đang tải ảnh...
          </span>
        </div>
      )}

      {/* 2. Error Fallback */}
      {hasError ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#EAE2D5] text-[#8C8275] p-4 text-center">
          <ImageIcon className="w-8 h-8 text-[#D8BE87] mb-1" />
          <span className="text-xs font-serif-title text-[#5A554E] font-medium">{alt}</span>
        </div>
      ) : (
        /* 3. Actual Image with Smooth Blur-up & Scale-down Transition */
        <motion.img
          src={cleanSrc}
          alt={alt}
          referrerPolicy={referrerPolicy}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          initial={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
          animate={
            isLoaded
              ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
              : { opacity: 0, scale: 1.06, filter: 'blur(8px)' }
          }
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`w-full h-full object-cover transition-transform duration-700 ${className}`}
        />
      )}
    </div>
  );
}
