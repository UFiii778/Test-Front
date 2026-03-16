// =====================================================
// FILE: frontend/src/hooks/useCopyToClipboard.js
// DESKRIPSI: Copy to clipboard hook
// =====================================================

import { useState, useCallback } from 'react';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState('');

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      setError('Clipboard API tidak didukung oleh browser ini');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setValue(text);
      setError(null);
      
      // Reset copied status after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
      return true;
    } catch (err) {
      setError(err.message);
      setCopied(false);
      return false;
    }
  }, []);

  const copyElement = useCallback(async (element) => {
    if (!element) return false;

    try {
      const text = element.innerText || element.textContent || element.value;
      return await copy(text);
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [copy]);

  return {
    copied,
    error,
    value,
    copy,
    copyElement
  };
};

// Copy with fallback for older browsers
export const useCopyWithFallback = () => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    // Try modern clipboard API first
    if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        setTimeout(() => setCopied(false), 2000);
        return true;
      } catch (err) {
        // Fallback to execCommand
        return fallbackCopy(text);
      }
    } else {
      // Fallback to execCommand
      return fallbackCopy(text);
    }
  }, []);

  const fallbackCopy = (text) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), 2000);
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { copied, error, copy };
};

// Copy text with success/error callback
export const useCopyWithCallback = (onSuccess, onError) => {
  const { copy } = useCopyToClipboard();

  const copyWithCallback = useCallback(async (text) => {
    const success = await copy(text);
    
    if (success && onSuccess) {
      onSuccess(text);
    } else if (!success && onError) {
      onError();
    }
    
    return success;
  }, [copy, onSuccess, onError]);

  return copyWithCallback;
};

// Copy to clipboard with formatting
export const useCopyFormatted = () => {
  const { copy } = useCopyToClipboard();

  const copyHtml = useCallback(async (element) => {
    if (!element) return false;

    try {
      const html = element.outerHTML;
      const text = element.innerText || element.textContent;

      // Create clipboard data with both HTML and text
      const clipboardData = new ClipboardItem({
        'text/plain': new Blob([text], { type: 'text/plain' }),
        'text/html': new Blob([html], { type: 'text/html' })
      });

      await navigator.clipboard.write([clipboardData]);
      return true;
    } catch (err) {
      // Fallback to text-only copy
      return copy(element.innerText || element.textContent);
    }
  }, [copy]);

  return { copyHtml };
};

// Copy JSON data
export const useCopyJson = () => {
  const { copy } = useCopyToClipboard();

  const copyJson = useCallback(async (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    return await copy(jsonString);
  }, [copy]);

  return { copyJson };
};