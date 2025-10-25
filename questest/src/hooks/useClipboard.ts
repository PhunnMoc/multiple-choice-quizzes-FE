'use client';

import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<boolean>;
  isCopied: boolean;
  error: string | null;
}

export function useClipboard(): UseClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        return true;
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
          return true;
        } else {
          throw new Error('execCommand failed');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy to clipboard';
      setError(errorMessage);
      console.error('Clipboard error:', errorMessage);
      return false;
    }
  }, []);

  return { copyToClipboard, isCopied, error };
}
