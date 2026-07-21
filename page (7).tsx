'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, CreditCard, Truck, Shield, Lock, Wallet, Banknote, ArrowRight, ChevronRight } from 'lucide-react';
import { useCart, useLanguage, useAuth } from '@/lib/store';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, subtotal, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = React.useState(1);
  const [placing, setPlacing] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);

  const [addr, setAddr] = React.useState({ fullName: user?.fullName ?? '', phone: '', line1: '', line2: '', city: '', country: '', zip: '' });
  const [payment, setPayment] = React.useState('card');
  const [card, setCard] = React.useState({ number: '', name: '', expiry: '', cvv: '' });

  const shipping = subtotal > 50 ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal - (coupon?.discount ?? 0) + shipping + tax;

  if (items.length === 0 && !orderId) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">{t('emptyCart')}</h1>
        <Button asChild><Link href="/catalog">{t('startShopping')}</Link></Button>
      </div>
    );
  }

  if (orderId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-success-foreground animate-scale-in">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="font-display text-2xl font-bold">{t('orderConfirmed')}</h1>
        <p className="text-muted-foreground">{t('orderConfirmedDesc')} <span className="font-bold text-foreground">{orderId}</span></p>
        <p className="text-sm text-muted-foreground">{t('paymentSuccessDesc')}</p>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link href="/account?tab=orders">{t('trackOrder')}</Link></Button>
          <Button asChild><Link href="/catalog">{t('continueShopping')}</Link></Button>
        </div>
      </div>
    );
  }

  const placeOrder = async () => {
    setPlacing(true);
    try {
      if (!user) {
        toast.error('Please sign in to place your order');
        window.location.href = '/auth?redirect=/checkout';
        return;
      }
      const orderNumber = `SF-${Date.now().toString(36).toUpperCase()}`;
      const { data, error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'paid',
        payment_status: 'paid',
        payment_method: payment,
        subtotal,
        discount: coupon?.discount ?? 0,
        shipping,
        tax,
        total,
        currency: 'USD',
        shipping_address: addr,
      }).select('id').single();

      if (error) throw error;

      const orderItems = items.map((item) => ({
        order_id: data.id,
        product_id: item.product.id,
        product_title: item.product.title,
        product_image: item.product.images[0] ?? null,
        variant: Object.entries(item.variantSelections).map(([k, v]) => `${k}:${v}`).join(', '),
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.unitPrice * item.quantity,
        seller_id: item.product.seller_id,
        fulfillment_status: 'pending',
      }));

      await supabase.from('order_items').insert(orderItems);

      // Add notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'order',
        title: t('orderConfirmed'),
        body: `${t('orderNumber')}: ${orderNumber}`,
      });

      setOrderId(orderNumber);
      clearCart();
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const steps = [
    { n: 1, label: t('shippingAddress') },
    { n: 2, label: t('paymentMethod') },
    { n: 3, label: t('placeOrder') },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 font-display text-2xl font-bold">{t('secureCheckout')}</h1>

      {/* Steps indicator */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className={cn('flex items-center gap-2', step >= s.n ? 'text-primary' : 'text-muted-foreground')}>
              <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold', step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                {step > s.n ? <Check className="h-4 w-4" /> : s.n}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={cn('h-px flex-1', step > s.n ? 'bg-primary' : 'bg-border')} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 animate-fade-up">
              <h2 className="flex items-center gap-2 font-bold"><Truck className="h-5 w-5 text-primary" /> {t('shippingAddress')}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t('fullName')} value={addr.fullName} onChange={(v) => setAddr({ ...addr, fullName: v })} required />
                <Field label="Phone" value={addr.phone} onChange={(v) => setAddr({ ...addr, phone: v })} required />
                <Field label="Address Line 1" value={addr.line1} onChange={(v) => setAddr({ ...addr, line1: v })} required full />
                <Field label="Address Line 2" value={addr.line2} onChange={(v) => setAddr({ ...addr, line2: v })} full />
                <Field label="City" value={addr.city} onChange={(v) => setAddr({ ...addr, city: v })} required />
                <Field label="Country" value={addr.country} onChange={(v) => setAddr({ ...addr, country: v })} required />
                <Field label="ZIP" value={addr.zip} onChange={(v) => setAddr({ ...addr, zip: v })} required />
              </div>
              <Button className="w-full" onClick={() => setStep(2)} disabled={!addr.fullName || !addr.line1 || !addr.city || !addr.country || !addr.zip}>
                {t('paymentMethod')} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 animate-fade-up">
              <h2 className="flex items-center gap-2 font-bold"><CreditCard className="h-5 w-5 text-primary" /> {t('paymentMethod')}</h2>
              <RadioGroup value={payment} onValueChange={setPayment} className="space-y-2">
                {[
                  { id: 'card', label: t('creditCard'), icon: CreditCard, desc: 'Visa, Mastercard' },
                  { id: 'paypal', label: t('paypal'), icon: Wallet, desc: 'PayPal Account' },
                  { id: 'applepay', label: t('applePay'), icon: Wallet, desc: 'Apple Pay' },
                  { id: 'googlepay', label: t('googlePay'), icon: Wallet, desc: 'Google Pay' },
                  { id: 'cod', label: t('cashOnDelivery'), icon: Banknote, desc: 'Pay on delivery' },
                ].map((m) => (
                  <label key={m.id} htmlFor={m.id} className={cn('flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all', payment === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}>
                    <RadioGroupItem value={m.id} id={m.id} />
                    <m.icon className="h-5 w-5" />
                    <div className="flex-1"><p className="text-sm font-medium">{m.label}</p><p className="text-xs text-muted-foreground">{m.desc}</p></div>
                  </label>
                ))}
              </RadioGroup>

              {payment === 'card' && (
                <div className="grid gap-3 rounded-lg bg-secondary/50 p-4 animate-fade-up">
                  <Field label={t('cardNumber')} value={card.number} onChange={(v) => setCard({ ...card, number: v })} placeholder="1234 5678 9012 3456" full />
                  <Field label={t('cardName')} value={card.name} onChange={(v) => setCard({ ...card, name: v })} full />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={t('expiry')} value={card.expiry} onChange={(v) => setCard({ ...card, expiry: v })} placeholder="MM/YY" />
                    <Field label={t('cvv')} value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v })} placeholder="123" />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>{t('back')}</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>{t('orderSummary')} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 animate-fade-up">
              <h2 className="font-bold">{t('orderSummary')}</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={`${item.product.id}-${Object.values(item.variantSelections).join('-')}`} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.product.images[0]} alt={item.product.title} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-medium">{item.product.title}</p>
                      <p className="text-xs text-muted-foreground">{t('qty')}: {item.quantity}</p>
                    </div>
                    <Price amount={item.unitPrice * item.quantity} size="sm" className="font-bold" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>{t('back')}</Button>
                <Button className="flex-1 gap-2" onClick={placeOrder} disabled={placing}>
                  <Lock className="h-4 w-4" /> {placing ? t('loading') : t('placeOrder')}
                </Button>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Shield className="h-3.5 w-3.5" /> {t('security')}</p>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="sticky top-28 h-fit space-y-3 rounded-xl border border-border bg-card p-5">
          <h3 className="font-bold">{t('orderSummary')}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t('subtotal')}</span><Price amount={subtotal} size="sm" /></div>
            {coupon && <div className="flex justify-between"><span className="text-muted-foreground">{t('discount')}</span><span className="text-success">-<Price amount={coupon.discount} size="sm" /></span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">{t('shipping')}</span>{shipping === 0 ? <span className="font-semibold text-success">{t('free')}</span> : <Price amount={shipping} size="sm" />}</div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('tax')}</span><Price amount={tax} size="sm" /></div>
            <div className="flex justify-between border-t pt-2 text-base font-bold"><span>{t('total')}</span><Price amount={total} size="lg" className="text-primary" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required, full }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <Label className="mb-1.5 block text-xs font-medium">{label}{required && <span className="text-destructive"> *</span>}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10" />
    </div>
  );
}
