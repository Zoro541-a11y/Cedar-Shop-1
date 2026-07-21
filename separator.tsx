'use client';

import Link from 'next/link';
import { Store, TrendingUp, Globe, Shield, DollarSign, Users, ArrowRight, Check, Star } from 'lucide-react';
import { useLanguage } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function SellersPage() {
  const { t } = useLanguage();
  const benefits = [
    { icon: Globe, title: t('worldwide'), desc: 'Reach millions of customers across 200+ countries' },
    { icon: DollarSign, title: t('totalRevenue'), desc: 'Competitive commissions and fast payouts' },
    { icon: Shield, title: t('buyerProtection'), desc: 'Secure transactions with seller protection' },
    { icon: TrendingUp, title: t('analytics'), desc: 'Powerful tools to grow your business' },
  ];
  const steps = [
    { n: 1, title: 'Register', desc: 'Create your seller account in minutes' },
    { n: 2, title: 'List Products', desc: 'Add your products with photos and descriptions' },
    { n: 3, title: 'Receive Orders', desc: 'Get notified when customers buy' },
    { n: 4, title: 'Ship & Earn', desc: 'Fulfill orders and grow your revenue' },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-primary-foreground md:p-16 text-center">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
            <Star className="h-3.5 w-3.5" /> {t('trustedBy')}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold md:text-5xl">{t('joinThousands')}</h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">{t('joinThousandsDesc')}</p>
          <Button asChild size="lg" variant="secondary" className="mt-6 gap-2">
            <Link href="/auth?redirect=/seller">{t('becomeSeller')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </Button>
        </div>
        <div className="absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -start-10 bottom-0 h-48 w-48 rounded-full bg-white/5" />
      </div>

      {/* Benefits */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><b.icon className="h-6 w-6" /></div>
            <h3 className="mt-4 font-bold">{b.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="mt-12">
        <h2 className="text-center font-display text-2xl font-bold">How It Works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground font-bold">{s.n}</span>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              {i < steps.length - 1 && <ArrowRight className="absolute -end-2 top-1/2 hidden h-5 w-5 text-muted-foreground lg:block rtl:rotate-180" />}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
        <Store className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 font-display text-2xl font-bold">{t('sellOnShopFlow')}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">{t('joinThousandsDesc')}</p>
        <Button asChild size="lg" className="mt-6"><Link href="/auth?redirect=/seller">{t('becomeSeller')}</Link></Button>
      </div>
    </div>
  );
}
