'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Flame, Star, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/store';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/home/countdown';
import { CategoryCard } from '@/components/home/category-card';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/lib/types';
import * as Icons from 'lucide-react';

export function HomeContent({
  categories,
  flashDeals,
  trending,
  featured,
  recommendations,
}: {
  categories: Category[];
  flashDeals: Product[];
  trending: Product[];
  featured: Product[];
  recommendations: Product[];
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero */}
      <HeroSection categories={categories} />

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <SectionHeader title={t('exploreCategories')} subtitle={t('exploreCategoriesDesc')} />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* Flash Deals */}
      {flashDeals.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4">
          <div className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center justify-between gap-4 border-b border-primary/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Zap className="h-5 w-5 fill-white" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">{t('flashDeals')}</h2>
                  <p className="text-xs text-muted-foreground">{t('limitedOffer')}</p>
                </div>
                <Countdown />
              </div>
              <Link href="/catalog?deal=flash" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                {t('viewAll')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-5">
              {flashDeals.slice(0, 5).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo banner */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-2">
          <PromoBanner
            title={t('superDeals')}
            subtitle={t('dealOfTheDay')}
            cta={t('shopNow')}
            href="/catalog?sort=price-asc"
            image="https://images.pexels.com/photos/5650023/pexels-photo-5650023.jpeg?auto=compress&cs=tinysrgb&w=800"
            gradient="from-rose-500/80 to-orange-500/80"
          />
          <PromoBanner
            title={t('newArrivals')}
            subtitle={t('newArrivalsDesc')}
            cta={t('exploreMore')}
            href="/catalog?sort=newest"
            image="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800"
            gradient="from-blue-500/80 to-cyan-500/80"
          />
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4">
          <SectionHeader
            title={t('trendingNow')}
            subtitle={t('mostPopular')}
            icon={<Flame className="h-5 w-5 text-accent" />}
            href="/catalog?sort=trending"
          />
          <ProductGrid products={trending.slice(0, 10)} />
        </section>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4">
          <div className="rounded-2xl border border-info/20 bg-gradient-to-br from-info/5 to-primary/5 p-4">
            <SectionHeader
              title={t('recommended')}
              subtitle={t('personalization')}
              icon={<Sparkles className="h-5 w-5 text-info" />}
            />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {recommendations.slice(0, 6).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4">
          <SectionHeader
            title={t('featured')}
            subtitle={t('topPicks')}
            icon={<Star className="h-5 w-5 text-primary" />}
            href="/catalog?featured=true"
          />
          <ProductGrid products={featured.slice(0, 10)} />
        </section>
      )}

      {/* Become seller CTA */}
      <section className="mx-auto w-full max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 text-primary-foreground md:p-12">
          <div className="relative z-10 max-w-lg">
            <h2 className="font-display text-3xl font-extrabold">{t('joinThousands')}</h2>
            <p className="mt-3 text-primary-foreground/90">{t('joinThousandsDesc')}</p>
            <Button asChild size="lg" variant="secondary" className="mt-6">
              <Link href="/sellers">{t('becomeSeller')}</Link>
            </Button>
          </div>
          <div className="absolute -end-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -end-20 bottom-0 h-64 w-64 rounded-full bg-white/5" />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon,
  href,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h2 className="font-display text-xl font-bold md:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline">
          {t('viewAll')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}

function PromoBanner({
  title,
  subtitle,
  cta,
  href,
  image,
  gradient,
}: {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  gradient: string;
}) {
  return (
    <Link href={href} className="group relative block aspect-[16/7] overflow-hidden rounded-2xl">
      <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className={cn('absolute inset-0 bg-gradient-to-r', gradient)} />
      <div className="absolute inset-0 flex flex-col justify-center gap-2 p-6 text-white md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide opacity-90">{subtitle}</p>
        <h3 className="font-display text-2xl font-extrabold md:text-3xl">{title}</h3>
        <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900 transition-transform group-hover:gap-2">
          {cta} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}

function HeroSection({ categories }: { categories: Category[] }) {
  const { t, lang } = useLanguage();
  const catLabel = (c: Category) => (lang === 'ar' && c.name_ar ? c.name_ar : c.name);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-6">
      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        {/* Side categories (desktop) */}
        <div className="hidden lg:block">
          <div className="rounded-xl border border-border bg-card p-2">
            <p className="px-3 py-2 text-sm font-bold">{t('categories')}</p>
            {categories.slice(0, 8).map((c) => {
              const IconName = c.icon as keyof typeof Icons;
              const Icon = (Icons[IconName] ?? Icons.Tag) as React.ComponentType<{ className?: string }>;
              return (
                <Link
                  key={c.id}
                  href={`/catalog?category=${c.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {catLabel(c)}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Hero banner */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-accent lg:aspect-[21/9]">
          <div className="absolute inset-0">
            <Image
              src="https://images.pexels.com/photos/5650023/pexels-photo-5650023.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Hero"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="object-cover opacity-30"
            />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-center gap-4 p-8 text-white md:p-12">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> {t('trustedBy')}
            </span>
            <h1 className="max-w-xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
              {lang === 'ar'
                ? 'تسوق ملايين المنتجات بأسعار لا تُصدق'
                : 'Shop Millions of Products at Unbeatable Prices'}
            </h1>
            <p className="max-w-md text-sm text-white/90 md:text-base">
              {lang === 'ar'
                ? 'عروض خاطفة، شحن مجاني، وحماية المشتري على كل طلب'
                : 'Flash deals, free shipping, and buyer protection on every order'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-1">
                <Link href="/catalog">{t('shopNow')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="/catalog?deal=flash"><Zap className="h-4 w-4" /> {t('flashDeals')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
