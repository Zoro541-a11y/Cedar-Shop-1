'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import {
  LanguageProvider,
  CurrencyProvider,
  CartProvider,
  WishlistProvider,
  AuthProvider,
} from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <LanguageProvider>
        <CurrencyProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <Toaster position="top-center" richColors closeButton />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </NextThemesProvider>
  );
}
