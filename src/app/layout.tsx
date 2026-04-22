import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AVIS Tire Tread Intel',
  description: 'Enterprise tire tread measurement system for fleet management',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AVIS Treads',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#d4002a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#d4002a" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="offline-banner">
          <span>OFFLINE</span>
          <span>Data syncs when reconnected</span>
        </div>
        <header className="bg-white border-b border-[#e0e0e0] sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#d4002a] text-white font-extrabold text-sm px-2.5 py-1 tracking-[0.15em] leading-none">AVIS</div>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#767676] uppercase">Tread Intel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4caf50] animate-pulse" />
              <span className="text-[10px] text-[#767676]">PWA</span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
