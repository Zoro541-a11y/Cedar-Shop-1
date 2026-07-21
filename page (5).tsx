import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from '@/components/providers';
import { StoreLayout } from '@/components/store-layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shopflow.example'),
  title: {
    default: 'ShopFlow — Global Marketplace for Dropshipping',
    template: '%s · ShopFlow',
  },
  description:
    'ShopFlow is a multi-vendor dropshipping marketplace with millions of products, flash deals, and worldwide shipping.',
  keywords: [
    'marketplace',
    'dropshipping',
    'ecommerce',
    'online shopping',
    'AliExpress',
    'wholesale',
  ],
  manifest: '/manifest.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1120' },
  ],
  openGraph: {
    type: 'website',
    title: 'ShopFlow — Global Marketplace',
    description: 'Millions of products with worldwide shipping and flash deals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopFlow — Global Marketplace',
    description: 'Millions of products with worldwide shipping and flash deals.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <Providers>
          <StoreLayout>{children}</StoreLayout>
        </Providers>
      </body>
    </html>
  );
}
