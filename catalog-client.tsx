'use client';

import * as React from 'react';
import Image from 'next/image';
import { Store, Package, BarChart3, Wallet, ShoppingBag, TrendingUp, Plus, DollarSign, Star, AlertTriangle } from 'lucide-react';
import { useAuth, useLanguage } from '@/lib/store';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/price';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type SellerProduct = {
  id: string; slug: string; title: string; price: number; stock: number; sold: number; rating: number; images: string[]; is_featured: boolean;
};

export default function SellerPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const sp = useSearchParams();
  const tab = sp.get('tab') || 'overview';

  const [products, setProducts] = React.useState<SellerProduct[]>([]);
  const [stats, setStats] = React.useState({ revenue: 0, orders: 0, products: 0, avgRating: 0, pendingOrders: 0 });
  const [salesData, setSalesData] = React.useState<{ name: string; sales: number; orders: number }[]>([]);

  React.useEffect(() => {
    if (!user) return;
    // Load seller products (simulated - would filter by seller_id in production)
    supabase.from('products').select('id, slug, title, price, stock, sold, rating, images, is_featured').limit(20).then(({ data }) => {
      setProducts((data ?? []) as any);
    });
    // Compute stats
    supabase.from('order_items').select('total, quantity').then(({ data }) => {
      const revenue = (data ?? []).reduce((a, r) => a + Number(r.total), 0);
      setStats((s) => ({ ...s, revenue, orders: data?.length ?? 0 }));
    });
    // Mock sales chart
    setSalesData([
      { name: 'Mon', sales: 1200, orders: 15 },
      { name: 'Tue', sales: 1800, orders: 22 },
      { name: 'Wed', sales: 2400, orders: 28 },
      { name: 'Thu', sales: 1900, orders: 19 },
      { name: 'Fri', sales: 3200, orders: 35 },
      { name: 'Sat', sales: 4100, orders: 42 },
      { name: 'Sun', sales: 2800, orders: 30 },
    ]);
  }, [user]);

  if (loading) return <div className="flex items-center justify-center py-20">{t('loading')}</div>;
  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <Store className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-xl font-bold">{t('signInToContinue')}</h1>
        <Button asChild><a href="/auth?redirect=/seller">{t('signIn')}</a></Button>
      </div>
    );
  }

  const items = [
    { href: '/seller?tab=overview', label: t('overview'), icon: BarChart3 },
    { href: '/seller?tab=products', label: t('products'), icon: Package },
    { href: '/seller?tab=orders', label: t('sellerOrders'), icon: ShoppingBag },
    { href: '/seller?tab=analytics', label: t('analytics'), icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 font-display text-2xl font-bold">{t('sellerDashboard')}</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar items={items} role="seller" />
        <div className="flex-1">
          {tab === 'overview' && <OverviewTab stats={stats} salesData={salesData} products={products} />}
          {tab === 'products' && <ProductsTab products={products} />}
          {tab === 'orders' && <SellerOrdersTab />}
          {tab === 'analytics' && <AnalyticsTab salesData={salesData} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ stats, salesData, products }: { stats: { revenue: number; orders: number; products: number; avgRating: number; pendingOrders: number }; salesData: { name: string; sales: number; orders: number }[]; products: SellerProduct[] }) {
  const { t } = useLanguage();
  const cards = [
    { label: t('totalRevenue'), value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-success bg-success/10' },
    { label: t('totalOrders'), value: stats.orders, icon: ShoppingBag, color: 'text-info bg-info/10' },
    { label: t('products'), value: products.length, icon: Package, color: 'text-primary bg-primary/10' },
    { label: t('pendingOrders'), value: stats.pendingOrders, icon: AlertTriangle, color: 'text-warning bg-warning/10' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', c.color)}><c.icon className="h-5 w-5" /></div>
            </div>
            <p className="mt-3 text-2xl font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 font-bold">{t('revenue')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 font-bold">{t('bestSellers')}</h3>
        <div className="space-y-2">
          {products.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted"><Image src={p.images[0]} alt={p.title} fill sizes="40px" className="object-cover" /></div>
              <p className="flex-1 line-clamp-1 text-sm font-medium">{p.title}</p>
              <span className="text-sm text-muted-foreground">{p.sold} {t('sold')}</span>
              <Price amount={p.price} size="sm" className="font-bold" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products }: { products: SellerProduct[] }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">{t('products')}</h2>
        <Button size="sm" onClick={() => toast.info('Product editor coming soon')}><Plus className="me-2 h-4 w-4" /> {t('addProduct')}</Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr className="text-start">
              <th className="p-3 text-start font-semibold">{t('products')}</th>
              <th className="p-3 text-start font-semibold">{t('price')}</th>
              <th className="p-3 text-start font-semibold">{t('stockLevel')}</th>
              <th className="p-3 text-start font-semibold">{t('unitsSold')}</th>
              <th className="p-3 text-start font-semibold">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted"><Image src={p.images[0]} alt={p.title} fill sizes="40px" className="object-cover" /></div>
                    <span className="line-clamp-1 font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="p-3"><Price amount={p.price} size="sm" /></td>
                <td className="p-3"><span className={cn(p.stock < 50 ? 'text-warning' : 'text-success')}>{p.stock}</span></td>
                <td className="p-3">{p.sold}</td>
                <td className="p-3">{p.stock > 0 ? <Badge variant="secondary" className="bg-success/20 text-success">{t('active')}</Badge> : <Badge variant="secondary" className="bg-destructive/20 text-destructive">{t('outOfStock')}</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SellerOrdersTab() {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border border-dashed p-12 text-center">
      <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
      <p className="font-bold">{t('sellerOrders')}</p>
      <p className="text-sm text-muted-foreground">{t('loading')}</p>
    </div>
  );
}

function AnalyticsTab({ salesData }: { salesData: { name: string; sales: number; orders: number }[] }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 font-bold">{t('revenue')} Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
            <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
