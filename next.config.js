'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Package,
  Store,
  LayoutDashboard,
  LogOut,
  Settings,
  Bell,
  Zap,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage, useCurrency, useCart, useWishlist, useAuth } from '@/lib/store';
import { CURRENCIES, LANGUAGES, NAV_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Header({ categories }: { categories: { id: string; slug: string; name: string; name_ar?: string; icon: string }[] }) {
  const { lang, setLang, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { count: cartCount, setOpen: setCartOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const categoryLabel = (c: { name: string; name_ar?: string }) =>
    lang === 'ar' && c.name_ar ? c.name_ar : c.name;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" /> {t('freeShipping')} {t('onOrdersOver')} $50
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sellers" className="hover:underline">{t('sellWithUs')}</Link>
            <Link href="/track" className="hover:underline">{t('trackYourOrder')}</Link>
            <Link href="/support" className="hover:underline">{t('helpCenter')}</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className={cn('glass border-b transition-all', scrolled ? 'border-border shadow-sm' : 'border-transparent')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:gap-6">
          {/* Mobile menu */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent/10 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-white shadow-glow">
              <Store className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Shop<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Search */}
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-10 items-center gap-1 rounded-lg px-2 text-sm hover:bg-accent/10">
                  <Globe className="h-5 w-5" />
                  <span className="hidden text-xs font-medium sm:inline">{lang.toUpperCase()}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(lang === l.code && 'bg-accent/10')}
                  >
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Currency */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden h-10 items-center gap-1 rounded-lg px-2 text-sm hover:bg-accent/10 sm:flex">
                  <span className="text-xs font-medium">{currency}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('currency')}</DropdownMenuLabel>
                {CURRENCIES.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={cn(currency === c.code && 'bg-accent/10')}
                  >
                    <span className="font-medium">{c.code}</span>
                    <span className="text-muted-foreground">{c.symbol}</span>
                    <span className="ms-auto text-xs">{c.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme */}
            {mounted && (
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent/10"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent/10"
              aria-label="wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-accent/10"
              onClick={() => setCartOpen(true)}
              aria-label="cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-secondary/80">
                    <span className="text-sm font-bold uppercase">
                      {(user.fullName || user.email)[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.fullName || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account"><User className="me-2 h-4 w-4" />{t('account')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=orders"><Package className="me-2 h-4 w-4" />{t('myOrders')}</Link>
                  </DropdownMenuItem>
                  {user.role === 'seller' && (
                    <DropdownMenuItem asChild>
                      <Link href="/seller"><Store className="me-2 h-4 w-4" />{t('sellerDashboard')}</Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin"><LayoutDashboard className="me-2 h-4 w-4" />{t('adminDashboard')}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { signOut(); toast.success(t('signOut')); }}>
                    <LogOut className="me-2 h-4 w-4" />{t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/auth">{t('signIn')}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Nav bar */}
        <div className="hidden border-t border-border/60 lg:block">
          <div className="mx-auto flex h-11 max-w-7xl items-center gap-1 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium hover:bg-accent/10">
                  <Menu className="h-4 w-4" /> {t('allCategories')}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {categories.map((c) => (
                  <DropdownMenuItem key={c.id} asChild>
                    <Link href={`/catalog?category=${c.id}`}>
                      {categoryLabel(c)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-accent/10',
                  pathname === link.href && 'text-primary'
                )}
              >
                {t(link.key as never)}
              </Link>
            ))}
            <Link
              href="/catalog?deal=flash"
              className="ms-auto flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-bold text-primary hover:bg-primary/10"
            >
              <Zap className="h-4 w-4 fill-primary" /> {t('flashDeals')}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <MobileNav categories={categories} onClose={() => setMobileOpen(false)} />
      )}
    </header>
  );
}

function SearchBar() {
  const { t } = useLanguage();
  const [q, setQ] = React.useState('');
  const router = useRouter();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/catalog?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={onSearch} className="relative hidden flex-1 lg:block">
      <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="h-10 rounded-full border-border bg-secondary/50 ps-10 pe-24 focus-visible:ring-primary"
      />
      <button
        type="submit"
        className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full gradient-primary px-4 py-1.5 text-sm font-semibold text-white"
      >
        {t('search')}
      </button>
    </form>
  );
}

function MobileNav({ categories, onClose }: { categories: { id: string; slug: string; name: string; name_ar?: string }[]; onClose: () => void }) {
  const { lang, t } = useLanguage();
  const pathname = usePathname();
  const categoryLabel = (c: { name: string; name_ar?: string }) => lang === 'ar' && c.name_ar ? c.name_ar : c.name;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 start-0 w-80 max-w-[85%] animate-slide-in-right bg-card shadow-xl">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <span className="font-display text-lg font-extrabold">Shop<span className="text-primary">Flow</span></span>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto p-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn('flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent/10', pathname === link.href && 'text-primary bg-primary/5')}
            >
              {t(link.key as never)}
            </Link>
          ))}
          <div className="my-2 h-px bg-border" />
          <p className="px-3 py-1 text-xs font-bold uppercase text-muted-foreground">{t('categories')}</p>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalog?category=${c.id}`}
              onClick={onClose}
              className="flex items-center rounded-lg px-3 py-2.5 text-sm hover:bg-accent/10"
            >
              {categoryLabel(c)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
