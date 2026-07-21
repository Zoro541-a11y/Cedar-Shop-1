'use client';

import * as React from 'react';
import { getCategories } from '@/lib/data';
import type { Category } from '@/lib/types';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { LiveChat } from '@/components/live-chat';

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <LiveChat />
    </div>
  );
}
