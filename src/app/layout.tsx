
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'AVIS Tire Tread Intel',
  description: 'Enterprise tire tread measurement system',
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
      </head>
      <body>
        <div className="offline-banner">
          <span>OFFLINE MODE</span>
          <span>Data will sync when reconnected</span>
        </div>
        <header className="bg-white border-b border-[#e0e0e0] sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <Image src="/images/avis-logo.png" alt="AVIS" width={52} height={22} className="object-contain" />
            <span className="text-xs font-semibold tracking-wider text-avis-gray uppercase">Tread Intel</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
