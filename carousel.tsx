'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  Shield,
  RefreshCw,
  Plus,
  Minus,
  Share2,
  ChevronRight,
  Store,
  Check,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage, useCart, useWishlist, useCurrency } from '@/lib/store';
import { Price } from '@/components/price';
import { RatingStars } from '@/components/rating-stars';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Product, Review } from '@/lib/types';

export function ProductDetail({ product, reviews, related }: { product: Product; reviews: Review[]; related: Product[] }) {
  const { t, lang } = useLanguage();
  const { addItem, setOpen } = useCart();
  const { toggle, has } = useWishlist();
  const [activeImg, setActiveImg] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [selected, setSelected] = React.useState<Record<string, string>>({});
  const [zoom, setZoom] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });

  const title = lang === 'ar' && product.title_ar ? product.title_ar : product.title;
  const desc = lang === 'ar' && product.description_ar ? product.description_ar : product.description;
  const discount = product.compare_at_price ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) : 0;
  const wished = has(product.id);

  const allVariantsSelected = product.variants.every((v) => selected[v.name]);
  const variantPriceAdd = Object.entries(selected).reduce((acc, [name, val]) => {
    const v = product.variants.find((x) => x.name === name);
    const opt = v?.options.find((o) => o.value === val || o.name === val);
    return acc + (opt?.priceDelta ?? 0);
  }, 0);
  const finalPrice = product.price + variantPriceAdd;

  const handleAdd = () => {
    if (product.variants.length > 0 && !allVariantsSelected) {
      toast.error(t('chooseVariants'));
      return;
    }
    addItem(product, qty, selected);
    toast.success(t('addedToCart'));
    setOpen(true);
  };

  const handleBuyNow = () => {
    handleAdd();
    window.location.href = '/checkout';
  };

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">{t('home')}</Link>
        <ChevronRight className="h-3 w-3 rtl:rotate-180" />
        {product.category && (
          <>
            <Link href={`/catalog?category=${product.category.id}`} className="hover:text-foreground">
              {lang === 'ar' && product.category.name_ar ? product.category.name_ar : product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3 rtl:rotate-180" />
          </>
        )}
        <span className="truncate text-foreground">{title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex shrink-0 gap-2 sm:flex-col">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  'relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all',
                  activeImg === i ? 'border-primary' : 'border-border hover:border-primary/40'
                )}
              >
                <Image src={img} alt={`${title} ${i + 1}`} fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>

          {/* Main image with zoom */}
          <div
            className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleZoomMove}
          >
            <Image
              src={product.images[activeImg]}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover transition-transform duration-200"
              style={zoom ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
            />
            {discount > 0 && (
              <Badge className="absolute start-3 top-3 bg-accent text-accent-foreground">-{discount}% {t('off')}</Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div>
            {product.is_flash_deal && (
              <Badge className="mb-2 bg-primary text-primary-foreground">
                <Zap className="me-1 h-3 w-3 fill-white" /> {t('flashDeals')}
              </Badge>
            )}
            <h1 className="font-display text-2xl font-bold leading-tight md:text-3xl">{title}</h1>
          </div>

          {/* Rating + sold */}
          <div className="flex items-center gap-4">
            <RatingStars rating={product.rating} size={18} showValue />
            <span className="text-sm text-muted-foreground">{product.rating_count} {t('reviews')}</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">{product.sold.toLocaleString()} {t('sold')}</span>
          </div>

          {/* Price */}
          <div className="rounded-xl bg-secondary/50 p-4">
            <Price amount={finalPrice} originalAmount={product.compare_at_price} size="xl" className="text-primary" />
            {discount > 0 && (
              <p className="mt-1 text-sm text-success">{t('youSaved')} <Price amount={(product.compare_at_price ?? finalPrice) - finalPrice} size="sm" /></p>
            )}
          </div>

          {/* Variants */}
          {product.variants.map((v) => (
            <div key={v.name}>
              <p className="mb-2 text-sm font-bold">{v.name}</p>
              <div className="flex flex-wrap gap-2">
                {v.options.map((opt) => {
                  const isSelected = selected[v.name] === opt.value || selected[v.name] === opt.name;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelected((p) => ({ ...p, [v.name]: opt.value }))}
                      className={cn(
                        'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-all',
                        isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/40'
                      )}
                    >
                      {opt.name}
                      {opt.priceDelta ? <span className="text-xs text-muted-foreground">+${opt.priceDelta}</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <p className="mb-2 text-sm font-bold">{t('quantity')}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center hover:bg-accent/10">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="flex h-10 w-10 items-center justify-center hover:bg-accent/10">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className={cn('text-sm', product.stock < 50 ? 'text-warning' : 'text-success')}>
                {product.stock > 0 ? `${t('only')} ${product.stock} ${t('left')}` : t('outOfStock')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="lg" className="flex-1 gap-2" onClick={handleAdd} disabled={product.stock === 0}>
              <ShoppingCart className="h-5 w-5" /> {t('addToCart')}
            </Button>
            <Button size="lg" variant="secondary" className="flex-1 gap-2" onClick={handleBuyNow} disabled={product.stock === 0}>
              <Zap className="h-5 w-5" /> {t('buyNow')}
            </Button>
            <Button size="lg" variant="outline" onClick={() => { toggle(product.id); toast.success(wished ? t('removedFromWishlist') : t('addedToWishlist')); }}>
              <Heart className={cn('h-5 w-5', wished && 'fill-primary text-primary')} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Shipping estimate */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t('shippingEstimate')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('estimatedDelivery')}: <span className="font-semibold text-foreground">7-15 {t('days')}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {t('shipsFrom')}: <span className="font-semibold text-foreground">{product.shipping_from === 'CN' ? 'China' : 'USA'}</span>
              {' · '}
              {product.shipping_free ? <span className="font-semibold text-success">{t('freeShipping')}</span> : <span>$8.00</span>}
            </p>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: t('buyerProtection') },
              { icon: RefreshCw, label: t('freeReturns') },
              { icon: Check, label: t('genuine') },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-lg border border-border p-3 text-center">
                <b.icon className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-medium">{b.label}</span>
              </div>
            ))}
          </div>

          {/* Seller */}
          {product.seller && (
            <Link
              href={`/sellers/${product.seller.slug}`}
              className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{product.seller.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RatingStars rating={product.seller.rating} size={10} />
                    <span>{product.seller.rating.toFixed(1)} ({product.seller.rating_count})</span>
                    {product.seller.verified && <Badge variant="secondary" className="h-4 gap-0.5 text-[10px]"><Check className="h-2.5 w-2.5" /> {t('verified')}</Badge>}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground rtl:rotate-180" />
            </Link>
          )}
        </div>
      </div>

      {/* Tabs: description / reviews */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">{t('productDescription')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('customerReviews')} ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <ReviewsList reviews={reviews} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl font-bold">{t('relatedProducts')}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsList({ reviews }: { reviews: Review[] }) {
  const { t } = useLanguage();
  if (reviews.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{t('customerReviews')}</p>;
  }
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }));

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      {/* Summary */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center">
        <p className="text-4xl font-bold">{avg.toFixed(1)}</p>
        <RatingStars rating={avg} size={16} />
        <p className="text-xs text-muted-foreground">{reviews.length} {t('reviews')}</p>
        <div className="mt-2 w-full space-y-1">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-xs">
              <span className="flex w-8 items-center gap-0.5">{d.star}<Star className="h-3 w-3 fill-amber-400 text-amber-400" /></span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-amber-400" style={{ width: `${(d.count / reviews.length) * 100}%` }} />
              </div>
              <span className="w-6 text-end text-muted-foreground">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {r.user_name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold">{r.user_name}</p>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={r.rating} size={12} />
                    {r.verified && <Badge variant="secondary" className="h-4 gap-0.5 text-[10px]"><Check className="h-2.5 w-2.5" /> {t('verifiedPurchase')}</Badge>}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            {r.title && <h4 className="mt-3 text-sm font-bold">{r.title}</h4>}
            <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            {r.images.length > 0 && (
              <div className="mt-3 flex gap-2">
                {r.images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                    <Image src={img} alt={`review ${i}`} fill sizes="64px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            <button className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ThumbsUp className="h-3.5 w-3.5" /> {t('helpful')} ({r.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
