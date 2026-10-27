import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mail, Heart } from 'lucide-react';
import { getGuestInfoFromUrl } from '../../../lib/guestPersonalization';

export interface PersonalizedWaxSealBadgeProps {
  customGuestName?: string;
  theme?: 'gold' | 'red' | 'dark' | 'cream' | 'celestial' | 'emerald' | 'pink' | 'cyber';
  className?: string;
}

/**
 * Đã gỡ bỏ tính năng thiệp mời đích danh theo yêu cầu.
 * Component trả về null để đảm bảo không hiển thị trên bất kỳ mẫu phong bì hay thiệp nào.
 */
export function PersonalizedWaxSealBadge(_props: PersonalizedWaxSealBadgeProps) {
  return null;
}

