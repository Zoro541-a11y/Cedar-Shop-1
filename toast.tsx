'use client';

import Link from 'next/link';
import { Store, Mail, Phone, MapPin, Shield, Truck, CreditCard, Headphones, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t('thanksForSubscribing'));
      setEmail('');
    }
  };

  const features = [
    { icon: Truck, title: t('fastDelivery'), desc: t('worldwide') },
    { icon: Shield, title: t('buyerProtection'), desc: t('secureTransactions') },
    { icon: CreditCard, title: t('securePayment'), desc: t('secureTransactions') },
    { icon: Headphones, title: t('support247'), desc: t('chatWithUs') },
  ];

  return (
    <footer className="mt-16 border-t border-border bg-card">
      {/* Trust badges */}
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 md:flex-row md:justify-between">
          <div className="text-center md:text-start">
            <h3 className="font-display text-2xl font-bold">{t('newsletter')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('newsletterDesc')}</p>
          </div>
          <form onSubmit={onSubscribe} className="flex w-full max-w-md gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="h-11 flex-1"
              required
            />
            <Button type="submit" size="lg" className="gap-1">
              {t('subscribe')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-white">
              <Store className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-extrabold">Shop<span className="text-primary">Flow</span></span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">{t('footerAboutDesc')}</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@shopflow.com</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (800) 123-4567</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {t('worldwide')}</p>
          </div>
        </div>

        <FooterCol title={t('customerService')} links={[
          { href: '/support', label: t('helpCenter') },
          { href: '/track', label: t('trackYourOrder') },
          { href: '/returns', label: t('returnsRefunds') },
          { href: '/shipping', label: t('shippingInfo') },
          { href: '/contact', label: t('contactUs') },
        ]} />

        <FooterCol title={t('aboutUs')} links={[
          { href: '/about', label: t('aboutUs') },
          { href: '/careers', label: t('careers') },
          { href: '/press', label: t('press') },
          { href: '/blog', label: t('blog') },
        ]} />

        <FooterCol title={t('sellOnShopFlow')} links={[
          { href: '/sellers', label: t('sellerCenter') },
          { href: '/sellers', label: t('becomeSeller') },
          { href: '/affiliate', label: t('affiliateProgram') },
        ]} />

        <FooterCol title={t('followUs')} links={[
          { href: '#', label: 'Facebook' },
          { href: '#', label: 'Twitter' },
          { href: '#', label: 'Instagram' },
          { href: '#', label: 'YouTube' },
        ]} icons />
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} ShopFlow. {t('allRightsReserved')}.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-foreground">{t('termsOfService')}</Link>
            <Link href="/cookies" className="hover:text-foreground">{t('cookiePolicy')}</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">We accept</span>
            {['VISA', 'MC', 'PP', 'AP', 'GPay'].map((p) => (
              <span key={p} className="rounded border border-border bg-background px-2 py-0.5 text-[10px] font-bold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, icons }: { title: string; links: { href: string; label: string }[]; icons?: boolean }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold">{title}</h4>
      <ul className="space-y-2">
        {links.map((l, i) => (
          <li key={i}>
            <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
