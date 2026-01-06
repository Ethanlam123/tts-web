/**
 * Tests for validation utilities
 */

import { describe, it, expect } from '@jest/globals';
import {
  validateApiKeyFormat,
  validateVoiceId,
  validateText,
  validateSpeed,
  validateAudioBlob,
} from '../validators';

describe('validateApiKeyFormat', () => {
  it('should accept valid ElevenLabs API keys', () => {
    const result = validateApiKeyFormat('sk_abc123def456ghi789');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject keys without sk_ prefix', () => {
    const result = validateApiKeyFormat('abc123def456ghi789');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.field).toBe('apiKey');
  });

  it('should reject keys that are too short', () => {
    const result = validateApiKeyFormat('sk_abc123');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('at least');
  });

  it('should reject null or undefined', () => {
    expect(validateApiKeyFormat(null).isValid).toBe(false);
    expect(validateApiKeyFormat(undefined).isValid).toBe(false);
  });

  it('should reject non-string values', () => {
    const result = validateApiKeyFormat(123 as any);
    expect(result.isValid).toBe(false);
  });

  it('should trim whitespace before validation', () => {
    const result = validateApiKeyFormat('  sk_abc123def456ghi789  ');
    expect(result.isValid).toBe(true);
  });
});

describe('validateVoiceId', () => {
  it('should accept valid voice IDs', () => {
    const result = validateVoiceId('abc123xyz456');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty strings', () => {
    const result = validateVoiceId('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject voice IDs with parentheses', () => {
    const result = validateVoiceId('voice_name(test)');
    expect(result.isValid).toBe(false);
  });

  it('should reject voice IDs with dashes', () => {
    const result = validateVoiceId('voice-name-test');
    expect(result.isValid).toBe(false);
  });

  it('should reject voice IDs that are too long', () => {
    const longId = 'a'.repeat(51);
    const result = validateVoiceId(longId);
    expect(result.isValid).toBe(false);
  });

  it('should reject null or undefined', () => {
    expect(validateVoiceId(null).isValid).toBe(false);
    expect(validateVoiceId(undefined).isValid).toBe(false);
  });
});

describe('validateText', () => {
  it('should accept valid text', () => {
    const result = validateText('Hello, world!');
    expect(result.isValid).toBe(true);
  });

  it('should reject empty strings', () => {
    const result = validateText('');
    expect(result.isValid).toBe(false);
  });

  it('should reject whitespace-only strings', () => {
    const result = validateText('   ');
    expect(result.isValid).toBe(false);
  });

  it('should reject text exceeding maximum length', () => {
    const longText = 'a'.repeat(10001);
    const result = validateText(longText);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('maximum length');
  });

  it('should trim whitespace before validation', () => {
    const result = validateText('  Hello, world!  ');
    expect(result.isValid).toBe(true);
  });

  it('should reject null or undefined', () => {
    expect(validateText(null).isValid).toBe(false);
    expect(validateText(undefined).isValid).toBe(false);
  });
});

describe('validateSpeed', () => {
  it('should accept valid speed values', () => {
    expect(validateSpeed(0.5).isValid).toBe(true);
    expect(validateSpeed(1.0).isValid).toBe(true);
    expect(validateSpeed(2.0).isValid).toBe(true);
    expect(validateSpeed(1.5).isValid).toBe(true);
  });

  it('should reject values below minimum', () => {
    const result = validateSpeed(0.4);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('between');
  });

  it('should reject values above maximum', () => {
    const result = validateSpeed(2.1);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('between');
  });

  it('should reject NaN', () => {
    const result = validateSpeed(NaN);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('valid number');
  });

  it('should reject non-number values', () => {
    const result = validateSpeed('1.0' as any);
    expect(result.isValid).toBe(false);
  });
});

describe('validateAudioBlob', () => {
  it('should accept valid audio blobs', () => {
    const blob = new Blob(['audio data'], { type: 'audio/mpeg' });
    const result = validateAudioBlob(blob);
    expect(result.isValid).toBe(true);
  });

  it('should reject null or undefined', () => {
    expect(validateAudioBlob(null).isValid).toBe(false);
    expect(validateAudioBlob(undefined).isValid).toBe(false);
  });

  it('should reject empty blobs', () => {
    const blob = new Blob([], { type: 'audio/mpeg' });
    const result = validateAudioBlob(blob);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('No audio data');
  });

  it('should reject zero-size blobs', () => {
    const blob = new Blob([''], { type: 'audio/mpeg' });
    const result = validateAudioBlob(blob);
    expect(result.isValid).toBe(false);
  });
});
