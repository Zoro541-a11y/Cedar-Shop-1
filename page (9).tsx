'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Trash2, ShoppingBag, Tag, ArrowRight, Truck, Shield } from 'lucide-react';
import { useCart, useLanguage } from '@/lib/store';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, coupon, applyCoupon, removeCoupon } = useCart();
  const { t } = useLanguage();
  const [code, setCode] = React.useState('');

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal - (coupon?.discount ?? 0) + shipping + tax;

  const onApply = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(code, subtotal);
    if (res.ok) { toast.success(t(res.message as never)); setCode(''); }
    else toast.error(t(res.message as never));
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{t('emptyCart')}</h1>
          <p className="mt-2 text-muted-foreground">{t('emptyCartDesc')}</p>
        </div>
        <Button asChild size="lg"><Link href="/catalog">{t('startShopping')} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" /></Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 font-display text-2xl font-bold">{t('cart')} ({items.length})</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => {
            const key = `${item.product.id}-${Object.values(item.variantSelections).join('-')}`;
            return (
              <div key={key} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                <Link href={`/product/${item.product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={item.product.images[0]} alt={item.product.title} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col gap-1">
                  <Link href={`/product/${item.product.slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary">
                    {item.product.title}
                  </Link>
                  {Object.entries(item.variantSelections).length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {Object.entries(item.variantSelections).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                    <Price amount={item.unitPrice} size="md" className="text-primary" />
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-border">
                        <button onClick={() => updateQuantity(item.product.id, item.variantSelections, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center hover:bg-accent/10"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.variantSelections, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center hover:bg-accent/10"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <button onClick={() => removeItem(item.product.id, item.variantSelections)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Button asChild variant="outline"><Link href="/catalog"><ArrowRight className="me-2 h-4 w-4 rtl:rotate-180" /> {t('continueShopping')}</Link></Button>
        </div>

        {/* Summary */}
        <div className="sticky top-28 h-fit space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold">{t('orderSummary')}</h2>

          {/* Coupon */}
          {coupon ? (
            <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-success"><Tag className="h-3.5 w-3.5" /> {coupon.code}</span>
              <button onClick={removeCoupon} className="text-xs text-muted-foreground hover:text-destructive">{t('removeCoupon')}</button>
            </div>
          ) : (
            <form onSubmit={onApply} className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('couponCode')} className="h-9" />
              <Button type="submit" size="sm" variant="secondary">{t('applyCoupon')}</Button>
            </form>
          )}

          <div className="space-y-2 text-sm">
            <Row label={t('subtotal')} value={<Price amount={subtotal} size="sm" />} />
            {coupon && <Row label={t('discount')} value={<span className="text-success">-<Price amount={coupon.discount} size="sm" /></span>} />}
            <Row label={t('shipping')} value={shipping === 0 ? <span className="font-semibold text-success">{t('free')}</span> : <Price amount={shipping} size="sm" />} />
            <Row label={t('tax')} value={<Price amount={tax} size="sm" />} />
            <div className="flex items-center justify-between border-t pt-2 text-base font-bold">
              <span>{t('total')}</span><Price amount={total} size="lg" className="text-primary" />
            </div>
          </div>

          {subtotal > 0 && subtotal < 50 && (
            <p className="flex items-center gap-1.5 rounded-lg bg-info/10 px-3 py-2 text-xs text-info">
              <Truck className="h-3.5 w-3.5" /> Add <Price amount={50 - subtotal} size="sm" className="font-bold" /> for {t('freeShipping')}
            </p>
          )}

          <Button asChild size="lg" className="w-full gap-2"><Link href="/checkout">{t('checkout')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link></Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" /> {t('secureCheckout')}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span>{value}</div>;
}
