'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Star, Truck, Search } from 'lucide-react';
import { useLanguage } from '@/lib/store';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Product, Category, Brand, Seller } from '@/lib/types';

type Params = {
  q?: string;
  category?: string;
  brand?: string;
  seller?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  shipping?: string;
  sort?: string;
  deal?: string;
  featured?: string;
};

export function CatalogClient({
  products,
  categories,
  brands,
  sellers,
  initialParams,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  sellers: Seller[];
  initialParams: Params;
}) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const sp = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  const catLabel = (c: { name: string; name_ar?: string }) => (lang === 'ar' && c.name_ar ? c.name_ar : c.name);

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value && value !== 'all' && value !== '') params.set(key, value);
    else params.delete(key);
    router.push(`/catalog?${params.toString()}`);
  };

  const clearAll = () => router.push('/catalog');

  const activeFilters: { key: string; label: string }[] = [];
  if (initialParams.q) activeFilters.push({ key: 'q', label: initialParams.q });
  if (initialParams.category) {
    const c = categories.find((c) => c.id === initialParams.category);
    if (c) activeFilters.push({ key: 'category', label: catLabel(c) });
  }
  if (initialParams.brand) {
    const b = brands.find((b) => b.id === initialParams.brand);
    if (b) activeFilters.push({ key: 'brand', label: b.name });
  }
  if (initialParams.rating) activeFilters.push({ key: 'rating', label: `${initialParams.rating}★+` });
  if (initialParams.shipping) activeFilters.push({ key: 'shipping', label: initialParams.shipping });
  if (initialParams.deal) activeFilters.push({ key: 'deal', label: t('flashDeals') });

  const priceRange: [number, number] = [
    initialParams.minPrice ? Number(initialParams.minPrice) : 0,
    initialParams.maxPrice ? Number(initialParams.maxPrice) : 250,
  ];

  const Filters = (
    <div className="space-y-6">
      {/* Categories */}
      <FilterGroup title={t('categories')}>
        <div className="space-y-2">
          <button
            onClick={() => updateParam('category')}
            className={cn('block w-full text-start text-sm hover:text-primary', !initialParams.category && 'font-semibold text-primary')}
          >
            {t('allCategories')}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParam('category', c.id)}
              className={cn('block w-full text-start text-sm hover:text-primary', initialParams.category === c.id && 'font-semibold text-primary')}
            >
              {catLabel(c)}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Price */}
      <FilterGroup title={t('priceRange')}>
        <Slider
          value={priceRange}
          onValueChange={(v) => {
            updateParam('minPrice', String(v[0]));
            updateParam('maxPrice', String(v[1]));
          }}
          min={0}
          max={250}
          step={5}
          className="my-3"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">${priceRange[0]}</span>
          <span className="font-medium">${priceRange[1]}+</span>
        </div>
      </FilterGroup>

      {/* Rating */}
      <FilterGroup title={t('customerRating')}>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => updateParam('rating', String(r))}
              className={cn('flex w-full items-center gap-2 text-sm hover:text-primary', initialParams.rating === String(r) && 'font-semibold text-primary')}
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('h-3.5 w-3.5', i < r ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
                ))}
              </div>
              <span>{r}+ {t('rating')}</span>
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Brand */}
      <FilterGroup title={t('brands')}>
        <div className="space-y-2">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => updateParam('brand', b.id)}
              className={cn('block w-full text-start text-sm hover:text-primary', initialParams.brand === b.id && 'font-semibold text-primary')}
            >
              {b.name}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Shipping location */}
      <FilterGroup title={t('shippingLocation')}>
        <div className="space-y-2">
          {['all', 'CN', 'US'].map((loc) => (
            <button
              key={loc}
              onClick={() => updateParam('shipping', loc === 'all' ? undefined : loc)}
              className={cn('flex w-full items-center gap-2 text-sm hover:text-primary', (initialParams.shipping ?? 'all') === loc && 'font-semibold text-primary')}
            >
              <Truck className="h-4 w-4" />
              {loc === 'all' ? t('worldwide') : loc === 'CN' ? 'China' : 'USA'}
            </button>
          ))}
        </div>
      </FilterGroup>

      {activeFilters.length > 0 && (
        <Button variant="outline" className="w-full" onClick={clearAll}>
          <X className="me-2 h-4 w-4" /> {t('clearAll')}
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Title + search */}
      <div className="mb-6 flex flex-col gap-3">
        <h1 className="font-display text-2xl font-bold">
          {initialParams.q ? `"${initialParams.q}"` : initialParams.deal === 'flash' ? t('flashDeals') : t('catalog')}
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            updateParam('q', formData.get('q') as string);
          }}
          className="relative max-w-xl"
        >
          <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={initialParams.q} placeholder={t('searchPlaceholder')} className="ps-10" />
        </form>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <Badge key={f.key} variant="secondary" className="gap-1">
              {f.label}
              <button onClick={() => updateParam(f.key)}><X className="h-3 w-3" /></button>
            </Badge>
          ))}
          <button onClick={clearAll} className="text-xs text-primary hover:underline">{t('clearAll')}</button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-xl border border-border bg-card p-4">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><SlidersHorizontal className="h-4 w-4" /> {t('filters')}</h2>
            {Filters}
          </div>
        </aside>

        <div>
          {/* Sort bar */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{products.length}</span> {t('results')}
            </p>
            <div className="flex items-center gap-2">
              {/* Mobile filter trigger */}
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="me-2 h-4 w-4" /> {t('filters')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{t('filters')}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">{Filters}</div>
                </SheetContent>
              </Sheet>

              <Select value={initialParams.sort ?? 'relevance'} onValueChange={(v) => updateParam('sort', v)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder={t('sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">{t('relevance')}</SelectItem>
                  <SelectItem value="price-asc">{t('priceLowHigh')}</SelectItem>
                  <SelectItem value="price-desc">{t('priceHighLow')}</SelectItem>
                  <SelectItem value="rating">{t('customerRating')}</SelectItem>
                  <SelectItem value="newest">{t('newestArrivals')}</SelectItem>
                  <SelectItem value="sold">{t('mostSold')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-bold">{t('noResults')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t('noResultsDesc')}</p>
              </div>
              <Button variant="outline" onClick={clearAll}>{t('clearAll')}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </div>
  );
}
