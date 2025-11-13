'use client';

import { useState, useEffect } from 'react';
import { Key, Check, X, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { getApiKeyStatus, isUsingCustomApiKey, getEffectiveApiKey, clearStoredApiKey, setApiKeyStatus } from '@/lib/api-key-manager';

export default function Header() {
  const [apiKeyStatus, setApiKeyStatus] = useState<'default' | 'custom' | 'none'>('default');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Update status when component mounts or dropdown closes
    const updateStatus = () => {
      setApiKeyStatus(getApiKeyStatus());
    };

    updateStatus();

    // Add event listener for storage changes (if user updates key in another tab)
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

  const getKeyIconColor = () => {
    switch (apiKeyStatus) {
      case 'custom':
        return 'text-green-500';
      case 'default':
        return 'text-foreground';
      case 'none':
        return 'text-red-500';
      default:
        return 'text-foreground';
    }
  };

  const getKeyIconBg = () => {
    switch (apiKeyStatus) {
      case 'custom':
        return 'bg-green-500/10 hover:bg-green-500/20';
      case 'default':
        return 'bg-secondary hover:bg-secondary/80';
      case 'none':
        return 'bg-red-500/10 hover:bg-red-500/20';
      default:
        return 'bg-secondary hover:bg-secondary/80';
    }
  };

  const getStatusText = () => {
    switch (apiKeyStatus) {
      case 'custom':
        return 'Using Your Key';
      case 'default':
        return 'Using Default Key';
      case 'none':
        return 'No Key Configured';
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

    // If using custom key, show masked version
    if (isUsingCustomApiKey() && effectiveKey.length > 10) {
      return `${effectiveKey.slice(0, 8)}...${effectiveKey.slice(-4)}`;
    }

    return null;
  };

  return (
    <header className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">
              AudioConverter
            </h1>
          </div>

          {/* Right side - Key icon with dropdown */}
          <div className="flex items-center">
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${getKeyIconBg()}`}>
                  <Key className={`w-5 h-5 ${getKeyIconColor()}`} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">API Key Status</span>
                  </div>

                  <div className="space-y-3">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Status:</span>
                      <Badge variant={getStatusBadgeVariant()}>
                        {getStatusText()}
                      </Badge>
                    </div>

                    {/* Stored Key Info (for custom keys) */}
                    {apiKeyStatus === 'custom' && formatStoredKey() && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Key:</span>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {formatStoredKey()}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
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
                  {apiKeyStatus === 'custom' ? (
                    <ApiKeyInput
                      onApiKeyChange={handleApiKeyChange}
                      onStatusChange={handleStatusChange}
                      trigger={
                        <DropdownMenuItem
                          className="w-full justify-start cursor-pointer"
                          onSelect={(e) => e.preventDefault()}
                        >
                          Update API Key
                        </DropdownMenuItem>
                      }
                    />
                  ) : (
                    <ApiKeyInput
                      onApiKeyChange={handleApiKeyChange}
                      onStatusChange={handleStatusChange}
                      trigger={
                        <DropdownMenuItem
                          className="w-full justify-start cursor-pointer"
                          onSelect={(e) => e.preventDefault()}
                        >
                          Configure API Key
                        </DropdownMenuItem>
                      }
                    />
                  )}

                  <DropdownMenuItem asChild>
                    <a
                      href="https://elevenlabs.io/app/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full justify-start cursor-pointer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Get API Key from ElevenLabs
                    </a>
                  </DropdownMenuItem>

                  {apiKeyStatus === 'custom' && (
                    <DropdownMenuItem
                      className="w-full justify-start cursor-pointer text-red-600 focus:text-red-600"
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