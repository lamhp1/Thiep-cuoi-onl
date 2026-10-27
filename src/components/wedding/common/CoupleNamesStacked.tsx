import React from 'react';
import { Heart } from 'lucide-react';

export type CoupleNamesSizeVariant =
  | 'envelope-sm'
  | 'envelope'
  | 'hero'
  | 'hero-xl';

interface CoupleNamesStackedProps {
  groomName: string;
  brideName: string;
  variant?: CoupleNamesSizeVariant;
  textColor?: string;
  heartColor?: string;
  heartSize?: string;
  fontFamily?: string;
  uppercase?: boolean;
  className?: string;
  groomClassName?: string;
  brideClassName?: string;
  heartClassName?: string;
  heartElement?: React.ReactNode;
  idPrefix?: string;
}

/**
 * Calculates a dynamic, responsive font size (using clamp) so that names NEVER wrap
 * onto a second line, automatically shrinking font size when names are long on both
 * mobile and PC.
 */
export function getCoupleNamesFontSize(
  nameLength: number,
  variant: CoupleNamesSizeVariant = 'hero'
): string {
  const len = Math.max(4, Math.min(nameLength, 32));

  if (variant === 'envelope-sm') {
    // For small sliding letters or compact seal cards
    const mobileRem = Math.max(0.68, 1.25 - (len - 6) * 0.032);
    const desktopRem = Math.max(0.85, 1.5 - (len - 6) * 0.035);
    const vwFactor = Math.max(2.2, 4.2 - len * 0.08);
    return `clamp(${mobileRem.toFixed(2)}rem, ${vwFactor.toFixed(2)}vw, ${desktopRem.toFixed(2)}rem)`;
  }

  if (variant === 'envelope') {
    // For standard envelope covers and invitation card covers
    const mobileRem = Math.max(0.8, 1.55 - (len - 6) * 0.042);
    const desktopRem = Math.max(1.1, 2.2 - (len - 6) * 0.048);
    const vwFactor = Math.max(3.0, 5.2 - len * 0.11);
    return `clamp(${mobileRem.toFixed(2)}rem, ${vwFactor.toFixed(2)}vw, ${desktopRem.toFixed(2)}rem)`;
  }

  if (variant === 'hero-xl') {
    // For massive editorial, cinematic, or flagship heroes
    const mobileRem = Math.max(1.0, 2.6 - (len - 6) * 0.075);
    const desktopRem = Math.max(2.1, 5.8 - (len - 6) * 0.16);
    const vwFactor = Math.max(4.2, 9.0 - len * 0.2);
    return `clamp(${mobileRem.toFixed(2)}rem, ${vwFactor.toFixed(2)}vw, ${desktopRem.toFixed(2)}rem)`;
  }

  // Default 'hero'
  const mobileRem = Math.max(0.95, 2.15 - (len - 6) * 0.06);
  const desktopRem = Math.max(1.6, 4.4 - (len - 6) * 0.13);
  const vwFactor = Math.max(3.6, 7.5 - len * 0.16);
  return `clamp(${mobileRem.toFixed(2)}rem, ${vwFactor.toFixed(2)}vw, ${desktopRem.toFixed(2)}rem)`;
}

export const CoupleNamesStacked: React.FC<CoupleNamesStackedProps> = ({
  groomName,
  brideName,
  variant = 'hero',
  textColor,
  heartColor = '#D4AF37',
  heartSize,
  fontFamily = 'font-serif-title',
  uppercase = true,
  className = '',
  groomClassName = '',
  brideClassName = '',
  heartClassName = '',
  heartElement,
  idPrefix = 'couple-stacked',
}) => {
  const gName = (groomName || 'Chú Rể').trim();
  const bName = (brideName || 'Cô Dâu').trim();

  // Pick the longer name to ensure both rows stay balanced in size
  const maxLen = Math.max(gName.length, bName.length);
  const calculatedFontSize = getCoupleNamesFontSize(maxLen, variant as CoupleNamesSizeVariant);

  // Default heart sizing by variant
  const defaultHeartSizeClass =
    variant === 'envelope-sm'
      ? 'w-3 h-3 sm:w-3.5 sm:h-3.5'
      : variant === 'envelope'
      ? 'w-3.5 h-3.5 sm:w-4.5 sm:h-4.5'
      : variant === 'hero-xl'
      ? 'w-5 h-5 sm:w-8 sm:h-8'
      : 'w-4 h-4 sm:w-6 sm:h-6';

  const finalHeartSize = heartSize || defaultHeartSizeClass;

  return (
    <div
      id={`${idPrefix}-container`}
      className={`w-full max-w-full flex flex-col items-center justify-center text-center overflow-hidden leading-none select-none ${className}`}
    >
      {/* Row 1: Tên Chú Rể */}
      <div
        id={`${idPrefix}-groom-row`}
        className="w-full max-w-full overflow-hidden flex items-center justify-center"
      >
        <span
          id={`${idPrefix}-groom-text`}
          className={`block whitespace-nowrap tracking-wide ${fontFamily} font-bold leading-tight ${
            uppercase ? 'uppercase' : ''
          } ${groomClassName}`}
          style={{
            fontSize: calculatedFontSize,
            color: textColor,
          }}
        >
          {gName}
        </span>
      </div>

      {/* Row 2: (hình trái tim) */}
      <div
        id={`${idPrefix}-heart-row`}
        className={`flex items-center justify-center my-1 sm:my-2 ${heartClassName}`}
      >
        {heartElement ? (
          heartElement
        ) : (
          <div className="flex items-center justify-center relative">
            <Heart
              className={`${finalHeartSize} fill-current transition-transform duration-300 hover:scale-125`}
              style={{ color: heartColor }}
              aria-label="Tình yêu vĩnh cửu"
            />
          </div>
        )}
      </div>

      {/* Row 3: Tên Cô Dâu */}
      <div
        id={`${idPrefix}-bride-row`}
        className="w-full max-w-full overflow-hidden flex items-center justify-center"
      >
        <span
          id={`${idPrefix}-bride-text`}
          className={`block whitespace-nowrap tracking-wide ${fontFamily} font-bold leading-tight ${
            uppercase ? 'uppercase' : ''
          } ${brideClassName}`}
          style={{
            fontSize: calculatedFontSize,
            color: textColor,
          }}
        >
          {bName}
        </span>
      </div>
    </div>
  );
};
