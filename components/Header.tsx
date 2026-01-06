'use client';

import { useState, useEffect } from 'react';
import { Key, X, Shield, ExternalLink, Volume2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { getApiKeyStatus, isUsingCustomApiKey, getEffectiveApiKey, clearStoredApiKey } from '@/lib/api-key-manager';

export default function Header() {
  const [apiKeyStatus, setApiKeyStatus] = useState<'default' | 'custom' | 'none'>('default');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setApiKeyStatus(getApiKeyStatus());
    };

    updateStatus();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'elevenlabs_api_key' || e.key === 'elevenlabs_api_key_status') {
        updateStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleApiKeyChange = (apiKey: string | null) => {
    setApiKeyStatus(apiKey ? 'custom' : 'default');
  };

  const handleStatusChange = (status: 'default' | 'custom' | 'none') => {
    setApiKeyStatus(status);
  };

  const getKeyIconStyle = () => {
    switch (apiKeyStatus) {
      case 'custom':
        return {
          bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
          ring: 'ring-emerald-500/20',
          icon: 'text-emerald-500',
        };
      case 'none':
        return {
          bg: 'bg-red-500/10 hover:bg-red-500/20',
          ring: 'ring-red-500/20',
          icon: 'text-red-500',
        };
      default:
        return {
          bg: 'bg-muted hover:bg-muted/80',
          ring: 'ring-border',
          icon: 'text-muted-foreground',
        };
    }
  };

  const getStatusText = () => {
    switch (apiKeyStatus) {
      case 'custom':
        return 'Using Your Key';
      case 'default':
        return 'Default Key';
      case 'none':
        return 'No Key';
      default:
        return 'API Key Status';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (apiKeyStatus) {
      case 'custom':
        return 'default';
      case 'default':
        return 'secondary';
      case 'none':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatStoredKey = () => {
    const effectiveKey = getEffectiveApiKey();
    if (!effectiveKey) return null;

    if (isUsingCustomApiKey() && effectiveKey.length > 10) {
      return `${effectiveKey.slice(0, 8)}...${effectiveKey.slice(-4)}`;
    }

    return null;
  };

  const iconStyle = getKeyIconStyle();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
              <Volume2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                AudioConverter
              </h1>
            </div>
          </div>

          {/* Right side - Key icon with dropdown */}
          <div className="flex items-center">
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`
                    flex items-center justify-center
                    w-10 h-10 rounded-xl
                    ring-1 ${iconStyle.ring}
                    ${iconStyle.bg}
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                  `}
                >
                  <Key className={`w-5 h-5 ${iconStyle.icon}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold">API Key Status</span>
                  </div>

                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Current Status</span>
                      <Badge variant={getStatusBadgeVariant()} className="font-medium">
                        {getStatusText()}
                      </Badge>
                    </div>

                    {/* Stored Key Info (for custom keys) */}
                    {apiKeyStatus === 'custom' && formatStoredKey() && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Key</span>
                        <span className="text-xs font-mono bg-background px-2 py-1 rounded-md border border-border">
                          {formatStoredKey()}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal leading-relaxed px-0">
                      {apiKeyStatus === 'custom'
                        ? 'You are using your personal ElevenLabs API key for higher usage limits.'
                        : apiKeyStatus === 'default'
                        ? 'You are using the default API key. Add your own key for higher limits.'
                        : 'Configure an API key to start generating audio.'
                      }
                    </DropdownMenuLabel>
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Actions */}
                <div className="p-2 space-y-1">
                  <ApiKeyInput
                    onApiKeyChange={handleApiKeyChange}
                    onStatusChange={handleStatusChange}
                    trigger={
                      <DropdownMenuItem
                        className="w-full justify-start cursor-pointer rounded-lg"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        {apiKeyStatus === 'custom' ? 'Update API Key' : 'Configure API Key'}
                      </DropdownMenuItem>
                    }
                  />

                  <DropdownMenuItem asChild>
                    <a
                      href="https://elevenlabs.io/app/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full justify-start cursor-pointer rounded-lg"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Get API Key from ElevenLabs
                    </a>
                  </DropdownMenuItem>

                  {apiKeyStatus === 'custom' && (
                    <DropdownMenuItem
                      className="w-full justify-start cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10"
                      onClick={() => {
                        clearStoredApiKey();
                        setApiKeyStatus('default');
                        handleApiKeyChange(null);
                        handleStatusChange('default');
                        setIsDropdownOpen(false);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Use Default Key
                    </DropdownMenuItem>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
