import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, CheckCircle2, MapPin, Calendar, X } from 'lucide-react';
import { getGuestInfoFromUrl } from '../../../lib/guestPersonalization';

export interface PersonalizedWelcomeBannerProps {
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  onScrollToRSVP?: () => void;
  onScrollToEvents?: () => void;
  accentColor?: string;
}

/**
 * Đã gỡ bỏ tính năng thiệp mời đích danh / banner đích danh theo yêu cầu.
 */
export function PersonalizedWelcomeBanner(_props: PersonalizedWelcomeBannerProps) {
  return null;
}

