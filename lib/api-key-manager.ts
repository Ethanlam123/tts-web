import { ApiKeyManager, ValidationResult, ApiKeyStatus } from '@/types';

export const API_KEY_STORAGE_KEY = 'elevenlabs_api_key';
export const API_KEY_STATUS_KEY = 'elevenlabs_api_key_status';

export const apiKeyManager: ApiKeyManager = {
  /**
   * Store API key in localStorage with validation
   */
  storeApiKey: (apiKey: string): void => {
    try {
      if (!apiKeyManager.validateApiKeyFormat(apiKey)) {
        throw new Error('Invalid API key format');
      }

      if (typeof window === 'undefined') {
        throw new Error('Cannot store API key during SSR');
      }

      // Only store valid keys
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);

      // Update status to custom when user key is stored
      localStorage.setItem(API_KEY_STATUS_KEY, 'custom');
    } catch (error) {
      console.error('Failed to store API key:', error);
      throw error;
    }
  },

  /**
   * Retrieve stored API key from localStorage
   */
  getStoredApiKey: (): string | null => {
    try {
      if (typeof window === 'undefined') {
        return null; // SSR-safe: no localStorage on server
      }
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  },

  /**
   * Remove stored API key and reset status
   */
  clearStoredApiKey: (): void => {
    try {
      if (typeof window === 'undefined') {
        return; // SSR-safe: no localStorage on server
      }
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      localStorage.setItem(API_KEY_STATUS_KEY, 'default');
    } catch (error) {
      console.error('Failed to clear API key:', error);
      throw error;
    }
  },

  /**
   * Validate API key format using ElevenLabs pattern
   * ElevenLabs API keys start with 'sk_' followed by alphanumeric characters
   */
  validateApiKeyFormat: (apiKey: string): boolean => {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }

    // ElevenLabs API key format: sk_xxxxxxxx (alphanumeric after sk_)
    const elevenLabsKeyPattern = /^sk_[a-zA-Z0-9]{16,}$/;
    return elevenLabsKeyPattern.test(apiKey.trim());
  },

  /**
   * Test API key validity by making API calls
   */
  testApiKey: async (apiKey: string): Promise<ValidationResult> => {
    try {
      // First validate format
      if (!apiKeyManager.validateApiKeyFormat(apiKey)) {
        return {
          isValid: false,
          error: 'Invalid API key format. ElevenLabs API keys should start with "sk_" followed by alphanumeric characters.',
          details: 'Expected format: sk_xxxxxxxxxxxxxxxx'
        };
      }

      // Test with voices API to validate key works
      const voicesResponse = await fetch('/api/voices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
        },
      });

      if (voicesResponse.ok) {
        const data = await voicesResponse.json();
        return {
          isValid: true,
          details: `API key is valid. Found ${data.voices?.length || 0} available voices.`
        };
      }

      // Handle specific error responses
      if (voicesResponse.status === 401 || voicesResponse.status === 403) {
        return {
          isValid: false,
          error: 'Invalid or expired API key',
          details: 'The provided API key is not valid or has expired. Please check your ElevenLabs dashboard.'
        };
      }

      if (voicesResponse.status === 429) {
        return {
          isValid: true, // Key is valid but rate limited
          error: 'Rate limit exceeded',
          details: 'Your API key is valid but you\'ve hit the rate limit. Please try again shortly.'
        };
      }

      // Generic API error
      return {
        isValid: false,
        error: 'API key validation failed',
        details: `Server returned status ${voicesResponse.status}. Please check your internet connection and try again.`
      };

    } catch (error) {
      return {
        isValid: false,
        error: 'Network error',
        details: error instanceof Error ? error.message : 'Failed to test API key due to network issues.'
      };
    }
  },
};

/**
 * Get current API key status based on localStorage
 */
export function getApiKeyStatus(): ApiKeyStatus {
  try {
    const storedKey = apiKeyManager.getStoredApiKey();

    // Check if localStorage is available (SSR-safe)
    let status: ApiKeyStatus = 'default';
    if (typeof window !== 'undefined') {
      status = localStorage.getItem(API_KEY_STATUS_KEY) as ApiKeyStatus || 'default';
    }

    if (storedKey && apiKeyManager.validateApiKeyFormat(storedKey)) {
      return 'custom';
    }

    return status;
  } catch (error) {
    console.error('Failed to get API key status:', error);
    return 'none';
  }
}

/**
 * Get API key to use for API calls (client-side first, fallback to server-side)
 */
export function getEffectiveApiKey(): string | null {
  try {
    const storedKey = apiKeyManager.getStoredApiKey();

    if (storedKey && apiKeyManager.validateApiKeyFormat(storedKey)) {
      return storedKey;
    }

    return null; // Will fallback to server-side environment variable
  } catch (error) {
    console.error('Failed to get effective API key:', error);
    return null;
  }
}

/**
 * Check if user is using a custom API key
 */
export function isUsingCustomApiKey(): boolean {
  return getApiKeyStatus() === 'custom';
}

/**
 * Set API key status (used when switching between default/custom)
 */
export function setApiKeyStatus(status: ApiKeyStatus): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STATUS_KEY, status);
    }
  } catch (error) {
    console.error('Failed to set API key status:', error);
  }
}

/**
 * Initialize API key status on app load
 */
export function initializeApiKeyStatus(): void {
  try {
    if (typeof window === 'undefined') {
      return; // Skip initialization during SSR
    }

    const currentStatus = localStorage.getItem(API_KEY_STATUS_KEY);

    if (!currentStatus) {
      // First time loading - set default status
      setApiKeyStatus('default');
    } else if (currentStatus === 'custom') {
      // Validate stored key is still valid format
      const storedKey = apiKeyManager.getStoredApiKey();
      if (!storedKey || !apiKeyManager.validateApiKeyFormat(storedKey)) {
        // Invalid format - reset to default
        apiKeyManager.clearStoredApiKey();
        setApiKeyStatus('default');
      }
    }
  } catch (error) {
    console.error('Failed to initialize API key status:', error);
    setApiKeyStatus('none');
  }
}

// Export individual functions for easier importing
export const storeApiKey = apiKeyManager.storeApiKey;
export const getStoredApiKey = apiKeyManager.getStoredApiKey;
export const clearStoredApiKey = apiKeyManager.clearStoredApiKey;
export const validateApiKeyFormat = apiKeyManager.validateApiKeyFormat;
export const testApiKey = apiKeyManager.testApiKey;