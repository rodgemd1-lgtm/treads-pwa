'use client';

import { useEffect } from 'react';

export function PWARegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let deferredPrompt: any;

    function handler(e: Event) {
      e.preventDefault();
      deferredPrompt = e;
      (window as any).__pwaDeferredPrompt = e;
    }
    window.addEventListener('beforeinstallprompt', handler);

    async function register() {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          reg.addEventListener('updatefound', () => {
            const w = reg.installing;
            w?.addEventListener('statechange', () => {
              if (w.state === 'installed' && navigator.serviceWorker.controller) {
                window.dispatchEvent(new CustomEvent('pwa-update-available'));
              }
            });
          });
        } catch {}
      }
    }
    register();

    const onOffline = () => document.documentElement.classList.add('offline');
    const onOnline = () => document.documentElement.classList.remove('offline');
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    if (!navigator.onLine) onOffline();

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  return null;
}
