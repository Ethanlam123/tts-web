/**
 * Tests for status helper utilities
 */

import { describe, it, expect } from '@jest/globals';
import {
  getStatusConfig,
  getStatusBorderClasses,
  getCharacterCountStatus,
  getCharacterCountColorClasses,
  getCharacterCountMessage,
} from '../status-helpers';
import type { LineStatus } from '@/types';

describe('getStatusConfig', () => {
  it('should return correct config for ready status', () => {
    const config = getStatusConfig('ready');
    expect(config).not.toBeNull();
    expect(config?.text).toBe('Ready');
    expect(config?.bgColor).toContain('emerald');
    expect(config?.icon).toBeDefined();
  });

  it('should return correct config for processing status', () => {
    const config = getStatusConfig('processing');
    expect(config).not.toBeNull();
    expect(config?.text).toBe('Generating...');
    expect(config?.bgColor).toContain('amber');
    expect(config?.icon).toBeDefined();
  });

  it('should return correct config for error status', () => {
    const config = getStatusConfig('error');
    expect(config).not.toBeNull();
    expect(config?.text).toBe('Failed to generate');
    expect(config?.bgColor).toContain('red');
    expect(config?.icon).toBeDefined();
  });

  it('should return null for idle status', () => {
    const config = getStatusConfig('idle');
    expect(config).toBeNull();
  });
});

describe('getStatusBorderClasses', () => {
  it('should return processing border classes', () => {
    const classes = getStatusBorderClasses('processing');
    expect(classes).toContain('amber');
    expect(classes).toContain('shadow');
  });

  it('should return error border classes', () => {
    const classes = getStatusBorderClasses('error');
    expect(classes).toContain('red');
  });

  it('should return default border classes for ready status', () => {
    const classes = getStatusBorderClasses('ready');
    expect(classes).toContain('border-border');
    expect(classes).toContain('hover:border-border');
  });

  it('should return default border classes for idle status', () => {
    const classes = getStatusBorderClasses('idle');
    expect(classes).toContain('border-border');
  });
});

describe('getCharacterCountStatus', () => {
  it('should return normal for low character counts', () => {
    expect(getCharacterCountStatus(100)).toBe('normal');
    expect(getCharacterCountStatus(5000)).toBe('normal');
    expect(getCharacterCountStatus(7999)).toBe('normal');
  });

  it('should return warning for approaching limit', () => {
    expect(getCharacterCountStatus(8000)).toBe('warning');
    expect(getCharacterCountStatus(9000)).toBe('warning');
    expect(getCharacterCountStatus(9999)).toBe('warning');
  });

  it('should return error for exceeding limit', () => {
    expect(getCharacterCountStatus(10000)).toBe('error');
    expect(getCharacterCountStatus(15000)).toBe('error');
  });
});

describe('getCharacterCountColorClasses', () => {
  it('should return normal color classes', () => {
    const classes = getCharacterCountColorClasses('normal');
    expect(classes.icon).toBe('text-emerald-500');
    expect(classes.text).toBe('text-foreground');
  });

  it('should return warning color classes', () => {
    const classes = getCharacterCountColorClasses('warning');
    expect(classes.icon).toContain('amber');
    expect(classes.text).toContain('amber');
  });

  it('should return error color classes', () => {
    const classes = getCharacterCountColorClasses('error');
    expect(classes.icon).toContain('red');
    expect(classes.text).toContain('red');
  });
});

describe('getCharacterCountMessage', () => {
  it('should return null for normal status', () => {
    const message = getCharacterCountMessage('normal');
    expect(message).toBeNull();
  });

  it('should return warning message', () => {
    const message = getCharacterCountMessage('warning');
    expect(message).toBe('Approaching character limit');
  });

  it('should return error message', () => {
    const message = getCharacterCountMessage('error');
    expect(message).toBe('Exceeds 10,000 character limit');
  });
});
