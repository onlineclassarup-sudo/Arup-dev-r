import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import CustomCursor from '@/components/CustomCursor';
import { DEVELOPER_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${DEVELOPER_INFO.name} | Aspiring Developer`,
  description: `${DEVELOPER_INFO.tagline} Discover AAA Roblox production games, live server telemetry, and acquisition of commercial Luau systems & assets.`,
  keywords: [
    'Aspiring Developer',
    'Roblox Developer',
    'Roblox Studio',
    'Luau Scripting',
    'Roblox Portfolio',
    'Roblox Systems Architect',
    'BANGLA PLAZA',
    'Sylhety Vibes',
    'LAXUIRES PARK',
    'Lumina Hangout',
    'Last Fade',
    'Roblox Assets Store',
    'Knit Framework',
  ],
  authors: [{ name: DEVELOPER_INFO.name, url: 'https://roblox.com' }],
  creator: DEVELOPER_INFO.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: `${DEVELOPER_INFO.name} | Aspiring Developer Portfolio`,
    description: DEVELOPER_INFO.tagline,
    siteName: `${DEVELOPER_INFO.name} // DEV`,
  },
};

export const viewport: Viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-void-950 text-gray-100 antialiased selection:bg-neon-cyan/20 selection:text-neon-cyan relative min-h-screen">
        <ToastProvider>
          <CustomCursor />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

