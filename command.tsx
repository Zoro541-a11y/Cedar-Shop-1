'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Truck } from 'lucide-react';
import { useCart, useLanguage, useCurrency } from '@/lib/store';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, open, setOpen, removeItem, updateQuantity, subtotal, coupon, applyCoupon, removeCoupon } = useCart();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const [code, setCode] = React.useState('');

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 8;
  const total = subtotal - (coupon?.discount ?? 0) + shipping;

  const onApply = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(code, subtotal);
    if (res.ok) {
      toast.success(t(res.message as never));
      setCode('');
    } else {
      toast.error(t(res.message as never));
    }
  };

  return (
    <>
      <div
        className={cn('fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'pointer-events-none opacity-0')}
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          'fixed inset-y-0 end-0 z-[71] flex w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-bold">{t('cart')}</h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">{items.length}</span>
          </div>
          <button onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold">{t('emptyCart')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t('emptyCartDesc')}</p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/catalog">{t('startShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {items.map((item) => {
                  const key = `${item.product.id}-${Object.values(item.variantSelections).join('-')}`;
                  return (
                    <div key={key} className="flex gap-3 rounded-lg border border-border p-2">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={item.product.images[0]} alt={item.product.title} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <h4 className="line-clamp-2 text-sm font-medium">{item.product.title}</h4>
                        {Object.entries(item.variantSelections).length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {Object.entries(item.variantSelections).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          <Price amount={item.unitPrice} size="sm" className="text-primary" />
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.variantSelections, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-accent/10"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.variantSelections, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-accent/10"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.product.id, item.variantSelections)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t p-4 space-y-3">
              {/* Coupon */}
              {coupon ? (
                <div className="flex items-center justify-between rounded-lg bg-success/10 px-3 py-2 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-success">
                    <Tag className="h-3.5 w-3.5" /> {coupon.code}
                  </span>
                  <button onClick={removeCoupon} className="text-xs text-muted-foreground hover:text-destructive">
                    {t('removeCoupon')}
                  </button>
                </div>
              ) : (
                <form onSubmit={onApply} className="flex gap-2">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('couponCode')}
                    className="h-9"
                  />
                  <Button type="submit" size="sm" variant="secondary">{t('applyCoupon')}</Button>
                </form>
              )}

              <div className="space-y-1.5 text-sm">
                <Row label={t('subtotal')} value={<Price amount={subtotal} size="sm" />} />
                {coupon && <Row label={t('discount')} value={<span className="text-success">-<Price amount={coupon.discount} size="sm" /></span>} />}
                <Row
                  label={t('shipping')}
                  value={shipping === 0 ? <span className="font-semibold text-success">{t('free')}</span> : <Price amount={shipping} size="sm" />}
                />
                <div className="flex items-center justify-between border-t pt-2 text-base font-bold">
                  <span>{t('total')}</span>
                  <Price amount={total} size="lg" className="text-primary" />
                </div>
              </div>

              {subtotal > 0 && subtotal < 50 && (
                <p className="flex items-center gap-1.5 rounded-lg bg-info/10 px-3 py-2 text-xs text-info">
                  <Truck className="h-3.5 w-3.5" />
                  Add <Price amount={50 - subtotal} size="sm" className="font-bold" /> for {t('freeShipping')}
                </p>
              )}

              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  <Link href="/cart">{t('viewCart')}</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/checkout">{t('checkout')}</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {value}
    </div>
  );
}
