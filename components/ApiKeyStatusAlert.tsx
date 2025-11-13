'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Key, Shield, X } from 'lucide-react';

interface ApiKeyStatusAlertProps {
  apiKeyStatus: 'default' | 'custom' | 'none';
  voicesLoading?: boolean;
  voicesError?: string | null;
  onDismiss?: () => void;
}

export function ApiKeyStatusAlert({
  apiKeyStatus,
  voicesLoading = false,
  voicesError = null,
  onDismiss
}: ApiKeyStatusAlertProps) {
  // Don't show any alert if using default key and no errors
  if (apiKeyStatus === 'default' && !voicesError && !voicesLoading) {
    return null;
  }

  const getAlertVariant = () => {
    if (voicesError) return 'destructive';
    if (apiKeyStatus === 'none') return 'destructive';
    if (apiKeyStatus === 'custom') return 'default';
    return 'default';
  };

  const getAlertTitle = () => {
    if (voicesError) return 'API Connection Error';
    if (apiKeyStatus === 'none') return 'API Key Required';
    if (apiKeyStatus === 'custom') return 'Custom API Key Active';
    return 'API Status';
  };

  const getAlertDescription = () => {
    if (voicesError) {
      return voicesError;
    }

    if (apiKeyStatus === 'none') {
      return 'Configure an ElevenLabs API key to start generating audio. You can use your own key for higher usage limits.';
    }

    if (apiKeyStatus === 'custom') {
      return 'You are using your personal ElevenLabs API key. Enjoy higher usage limits and personal usage tracking.';
    }

    return 'API configuration status';
  };

  const getAlertIcon = () => {
    if (voicesError || apiKeyStatus === 'none') return AlertTriangle;
    if (apiKeyStatus === 'custom') return Key;
    return Shield;
  };

  const Icon = getAlertIcon();
  const variant = getAlertVariant();

  return (
    <Alert variant={variant} className="relative">
      <Icon className="h-4 w-4" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{getAlertTitle()}</span>
          <Badge variant={apiKeyStatus === 'custom' ? 'default' : 'secondary'}>
            {apiKeyStatus === 'custom' ? 'Custom Key' : apiKeyStatus === 'none' ? 'No Key' : 'Default'}
          </Badge>
          {voicesLoading && (
            <Badge variant="outline">Loading...</Badge>
          )}
        </div>
        <AlertDescription className="text-sm">
          {getAlertDescription()}
        </AlertDescription>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-sm hover:bg-accent/50 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
}