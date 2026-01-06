/**
 * Status Helper Utilities
 * Provides centralized status configuration and helpers
 */

import { LineStatus } from '@/types';
import { STATUS_CONFIG } from '@/lib/constants';
import { Volume2, Loader2, AlertCircle, LucideIcon } from 'lucide-react';

export interface StatusStyleConfig {
  dotColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon;
  text: string;
}

/**
 * Get status configuration for a given line status
 */
export function getStatusConfig(status: LineStatus): StatusStyleConfig | null {
  const iconMap: Record<LineStatus, LucideIcon> = {
    ready: Volume2,
    processing: Loader2,
    error: AlertCircle,
    idle: Volume2,
  };

  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return {
    ...config,
    icon: iconMap[status],
  };
}

/**
 * Get border classes based on line status
 */
export function getStatusBorderClasses(status: LineStatus): string {
  switch (status) {
    case 'processing':
      return 'border-amber-300 dark:border-amber-500/30 shadow-sm shadow-amber-500/10';
    case 'error':
      return 'border-red-300 dark:border-red-500/30';
    case 'ready':
    default:
      return 'border-border/50 hover:border-border';
  }
}

/**
 * Get character count status based on total characters
 */
export function getCharacterCountStatus(totalCharacters: number): 'normal' | 'warning' | 'error' {
  if (totalCharacters > 10000) return 'error';
  if (totalCharacters > 8000) return 'warning';
  return 'normal';
}

/**
 * Get color classes for character count status
 */
export function getCharacterCountColorClasses(status: 'normal' | 'warning' | 'error'): {
  icon: string;
  text: string;
} {
  switch (status) {
    case 'error':
      return {
        icon: 'text-red-600 dark:text-red-400',
        text: 'text-red-600 dark:text-red-400',
      };
    case 'warning':
      return {
        icon: 'text-amber-600 dark:text-amber-400',
        text: 'text-amber-600 dark:text-amber-400',
      };
    default:
      return {
        icon: 'text-emerald-500',
        text: 'text-foreground',
      };
  }
}

/**
 * Get message for character count status
 */
export function getCharacterCountMessage(status: 'normal' | 'warning' | 'error'): string | null {
  switch (status) {
    case 'error':
      return 'Exceeds 10,000 character limit';
    case 'warning':
      return 'Approaching character limit';
    default:
      return null;
  }
}
