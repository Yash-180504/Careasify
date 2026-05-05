'use client';

import { useEffect, useState } from 'react';

export default function PWARegister() {
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Listen for install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  return (
    <div className="pwa-banner">
      <span style={{ fontSize: '1.5rem' }}>📲</span>
      <span className="pwa-banner-text">Install Careasify for a better experience!</span>
      <button className="btn btn-primary btn-sm" onClick={handleInstall}>
        Install App
      </button>
      <button className="pwa-banner-close" onClick={() => setShowInstall(false)} aria-label="Close">
        ✕
      </button>
    </div>
  );
}
