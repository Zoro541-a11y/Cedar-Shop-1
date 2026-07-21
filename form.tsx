'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, MapPin, Heart, Bell, Settings, Store, LayoutDashboard, LogOut, Home } from 'lucide-react';
import { useAuth, useLanguage } from '@/lib/store';
import { cn } from '@/lib/utils';

export function DashboardSidebar({
  items,
  role,
}: {
  items: { href: string; label: string; icon: React.ElementType }[];
  role: 'customer' | 'seller' | 'admin';
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="rounded-xl border border-border bg-card p-4">
        {/* User card */}
        <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground font-bold">
            {(user?.fullName || user?.email || '?')[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{user?.fullName || user?.email}</p>
            <span className="text-xs capitalize text-primary">{role}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || (item.href.includes('?') && pathname + '?' === item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 space-y-1 border-t border-border pt-4">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10">
            <Home className="h-4 w-4" /> {t('home')}
          </Link>
          <button onClick={() => signOut()} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> {t('signOut')}
          </button>
        </div>
      </div>
    </aside>
  );
}
