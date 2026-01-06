'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Key, Shield, Check, X, ExternalLink } from 'lucide-react';
import { apiKeyManager, getApiKeyStatus } from '@/lib/api-key-manager';
import { TIMING } from '@/lib/constants';

interface ApiKeyInputProps {
  onApiKeyChange?: (apiKey: string | null) => void;
  onStatusChange?: (status: 'default' | 'custom' | 'none') => void;
  trigger?: React.ReactNode;
}

export function ApiKeyInput({
  onApiKeyChange,
  onStatusChange,
  trigger
}: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: string;
    details?: string;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentStatus = getApiKeyStatus();
  const storedKey = apiKeyManager.getStoredApiKey();

  const handleValidateApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationResult({
        isValid: false,
        error: 'API key is required',
        details: 'Please enter an ElevenLabs API key to continue.'
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await apiKeyManager.testApiKey(apiKey.trim());
      setValidationResult(result);

      if (result.isValid) {
        // Store the valid API key
        apiKeyManager.storeApiKey(apiKey.trim());
        setApiKey('');
        onApiKeyChange?.(apiKey.trim());
        onStatusChange?.('custom');

        // Close dialog after successful validation
        setTimeout(() => {
          setIsOpen(false);
        }, TIMING.DIALOG_CLOSE_DELAY);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: 'Validation failed',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearApiKey = () => {
    apiKeyManager.clearStoredApiKey();
    setApiKey('');
    setValidationResult(null);
    onApiKeyChange?.(null);
    onStatusChange?.('default');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isValidating) {
      handleValidateApiKey();
    }
  };

  const formatApiKey = (key: string) => {
    if (key.length <= 10) return key;
    return `${key.slice(0, 8)}...${key.slice(-4)}`;
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
    >
      <Key className="h-4 w-4" />
      {currentStatus === 'custom' ? 'Update Key' : 'API Key'}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Key Configuration
          </DialogTitle>
          <DialogDescription>
            Use your own ElevenLabs API key for higher limits and personal usage tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
            <div className="space-y-1">
              <div className="text-sm font-medium">Current Status</div>
              <div className="flex items-center gap-2">
                {currentStatus === 'custom' ? (
                  <>
                    <Badge variant="default" className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Using Your Key
                    </Badge>
                    {storedKey && (
                      <span className="text-xs text-slate-400">
                        {formatApiKey(storedKey)}
                      </span>
                    )}
                  </>
                ) : currentStatus === 'default' ? (
                  <Badge variant="secondary">
                    Using Default Key
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="h-3 w-3 mr-1" />
                    No Key Set
                  </Badge>
                )}
              </div>
            </div>
            {currentStatus === 'custom' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearApiKey}
                className="text-red-500 hover:text-red-600"
              >
                Clear
              </Button>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              ElevenLabs API Key
            </label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                placeholder="sk_..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setValidationResult(null);
                }}
                onKeyPress={handleKeyPress}
                className="pr-12 font-mono"
                disabled={isValidating}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isValidating}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <Alert className={validationResult.isValid ? 'border-green-500' : 'border-red-500'}>
              <AlertDescription className="space-y-1">
                <div className="flex items-center gap-2">
                  {validationResult.isValid ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className={validationResult.isValid ? 'text-green-500' : 'text-red-500'}>
                    {validationResult.isValid ? 'Success' : 'Error'}
                  </span>
                </div>
                {validationResult.error && (
                  <div className="text-sm">{validationResult.error}</div>
                )}
                {validationResult.details && (
                  <div className="text-xs text-slate-400">{validationResult.details}</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Help Information */}
          <Tabs defaultValue="format" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="format">Format</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            <TabsContent value="format" className="space-y-2">
              <div className="text-sm text-slate-300 dark:text-slate-400">
                <p>Your API key should start with <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-800 dark:text-slate-200">sk_</code> followed by alphanumeric characters.</p>
                <p className="mt-1">Example: <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-800 dark:text-slate-200">sk_xxxxxxxxxxxxxxxx</code></p>
              </div>
            </TabsContent>
            <TabsContent value="help" className="space-y-2">
              <div className="text-sm text-slate-400">
                <p>To get your API key:</p>
                <ol className="list-decimal list-inside space-y-1 mt-1">
                  <li>Visit your ElevenLabs dashboard</li>
                  <li>Navigate to API Keys section</li>
                  <li>Copy your secret API key</li>
                  <li>Paste it in the field above</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleValidateApiKey}
              disabled={!apiKey.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Validate & Save
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isValidating}
            >
              Cancel
            </Button>
          </div>

          {/* External Link */}
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-slate-300"
              asChild
            >
              <a
                href="https://elevenlabs.io/app/api-keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Get API Key from ElevenLabs
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}