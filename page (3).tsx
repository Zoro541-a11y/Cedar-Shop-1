'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutDashboard, Users, Package, FolderTree, ShoppingBag, Tag, BarChart3, DollarSign, TrendingUp, TrendingDown, Store, Eye, Trash2 } from 'lucide-react';
import { useAuth, useLanguage } from '@/lib/store';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/price';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const sp = useSearchParams();
  const tab = sp.get('tab') || 'overview';

  const [productCount, setProductCount] = React.useState(0);
  const [orderCount, setOrderCount] = React.useState(0);
  const [userCount, setUserCount] = React.useState(0);
  const [revenue, setRevenue] = React.useState(0);
  const [products, setProducts] = React.useState<any[]>([]);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [coupons, setCoupons] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [profiles, setProfiles] = React.useState<any[]>([]);

  React.useEffect(() => {
    supabase.from('products').select('*', { count: 'exact', head: true }).then(({ count }) => setProductCount(count ?? 0));
    supabase.from('orders').select('*', { count: 'exact', head: true }).then(({ count }) => setOrderCount(count ?? 0));
    supabase.from('profiles').select('*', { count: 'exact', head: true }).then(({ count }) => setUserCount(count ?? 0));
    supabase.from('order_items').select('total').then(({ data }) => setRevenue((data ?? []).reduce((a, r) => a + Number(r.total), 0)));
    supabase.from('products').select('id, slug, title, price, stock, sold, images, rating').limit(10).then(({ data }) => setProducts(data ?? []));
    supabase.from('orders').select('id, order_number, status, total, placed_at').order('placed_at', { ascending: false }).limit(10).then(({ data }) => setOrders(data ?? []));
    supabase.from('coupons').select('*').then(({ data }) => setCoupons(data ?? []));
    supabase.from('categories').select('*').then(({ data }) => setCategories(data ?? []));
    supabase.from('profiles').select('*').limit(10).then(({ data }) => setProfiles(data ?? []));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20">{t('loading')}</div>;
  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <LayoutDashboard className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-xl font-bold">{t('signInToContinue')}</h1>
        <Button asChild><a href="/auth?redirect=/admin">{t('signIn')}</a></Button>
      </div>
    );
  }

  const items = [
    { href: '/admin?tab=overview', label: t('overview'), icon: BarChart3 },
    { href: '/admin?tab=products', label: t('manageProducts'), icon: Package },
    { href: '/admin?tab=orders', label: t('manageOrders'), icon: ShoppingBag },
    { href: '/admin?tab=users', label: t('users'), icon: Users },
    { href: '/admin?tab=categories', label: t('manageCategories'), icon: FolderTree },
    { href: '/admin?tab=coupons', label: t('manageCoupons'), icon: Tag },
    { href: '/admin?tab=reports', label: t('reports'), icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 font-display text-2xl font-bold">{t('adminDashboard')}</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar items={items} role="admin" />
        <div className="flex-1">
          {tab === 'overview' && <AdminOverview productCount={productCount} orderCount={orderCount} userCount={userCount} revenue={revenue} orders={orders} />}
          {tab === 'products' && <AdminProducts products={products} />}
          {tab === 'orders' && <AdminOrders orders={orders} />}
          {tab === 'users' && <AdminUsers profiles={profiles} />}
          {tab === 'categories' && <AdminCategories categories={categories} />}
          {tab === 'coupons' && <AdminCoupons coupons={coupons} />}
          {tab === 'reports' && <AdminReports />}
        </div>
      </div>
    </div>
  );
}

function AdminOverview({ productCount, orderCount, userCount, revenue, orders }: { productCount: number; orderCount: number; userCount: number; revenue: number; orders: any[] }) {
  const { t } = useLanguage();
  const cards = [
    { label: t('grossSales'), value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: 'text-success bg-success/10', trend: '+12.5%', up: true },
    { label: t('totalOrders'), value: orderCount, icon: ShoppingBag, color: 'text-info bg-info/10', trend: '+8.2%', up: true },
    { label: t('totalUsers'), value: userCount, icon: Users, color: 'text-primary bg-primary/10', trend: '+5.1%', up: true },
    { label: t('manageProducts'), value: productCount, icon: Package, color: 'text-accent bg-accent/10', trend: '-2.3%', up: false },
  ];
  const chartData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => ({ name: m, sales: 5000 + i * 2000 + Math.random() * 3000, orders: 50 + i * 15 }));
  const pieData = [
    { name: t('electronics' as never) || 'Electronics', value: 35, color: 'hsl(0 72% 51%)' },
    { name: 'Fashion', value: 25, color: 'hsl(26 95% 56%)' },
    { name: 'Home', value: 20, color: 'hsl(173 58% 39%)' },
    { name: 'Other', value: 20, color: 'hsl(43 74% 66%)' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', c.color)}><c.icon className="h-5 w-5" /></div>
              <span className={cn('flex items-center gap-1 text-xs font-semibold', c.up ? 'text-success' : 'text-destructive')}>
                {c.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{c.trend}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 font-bold">{t('totalOrders')}</h3>
        <div className="space-y-2">
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
              <span className="font-mono text-sm font-bold">{o.order_number}</span>
              <span className="text-sm capitalize text-muted-foreground">{o.status}</span>
              <Price amount={Number(o.total)} size="sm" className="font-bold" />
            </div>
          ))}
          {orders.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">{t('noOrders')}</p>}
        </div>
      </div>
    </div>
  );
}

function AdminProducts({ products }: { products: any[] }) {
  const { t } = useLanguage();
  const del = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    toast.success(t('delete'));
  };
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-bold">{t('manageProducts')}</h2>
        <Button size="sm" onClick={() => toast.info('Product editor coming soon')}>{t('addProduct')}</Button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-secondary/50"><tr><th className="p-3 text-start">Product</th><th className="p-3 text-start">Price</th><th className="p-3 text-start">Stock</th><th className="p-3 text-start">Sold</th><th className="p-3"></th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="p-3"><div className="flex items-center gap-2"><div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted"><Image src={p.images[0]} alt={p.title} fill sizes="40px" className="object-cover" /></div><span className="line-clamp-1 font-medium">{p.title}</span></div></td>
              <td className="p-3"><Price amount={Number(p.price)} size="sm" /></td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">{p.sold}</td>
              <td className="p-3"><div className="flex gap-1"><Button size="icon" variant="ghost" asChild><Link href={`/product/${p.slug}`}><Eye className="h-4 w-4" /></Link></Button><Button size="icon" variant="ghost" className="text-destructive" onClick={() => del(p.id)}><Trash2 className="h-4 w-4" /></Button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminOrders({ orders }: { orders: any[] }) {
  const { t } = useLanguage();
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <h2 className="border-b p-4 font-bold">{t('manageOrders')}</h2>
      <table className="w-full text-sm">
        <thead className="bg-secondary/50"><tr><th className="p-3 text-start">Order</th><th className="p-3 text-start">Date</th><th className="p-3 text-start">Status</th><th className="p-3 text-start">Total</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-border">
              <td className="p-3 font-mono font-bold">{o.order_number}</td>
              <td className="p-3 text-muted-foreground">{new Date(o.placed_at).toLocaleDateString()}</td>
              <td className="p-3"><Badge variant="secondary" className="capitalize">{o.status}</Badge></td>
              <td className="p-3"><Price amount={Number(o.total)} size="sm" className="font-bold" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminUsers({ profiles }: { profiles: any[] }) {
  const { t } = useLanguage();
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <h2 className="border-b p-4 font-bold">{t('users')}</h2>
      <table className="w-full text-sm">
        <thead className="bg-secondary/50"><tr><th className="p-3 text-start">User</th><th className="p-3 text-start">Role</th><th className="p-3 text-start">Joined</th></tr></thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="p-3"><div><p className="font-medium">{p.full_name || '—'}</p><p className="text-xs text-muted-foreground">{p.email}</p></div></td>
              <td className="p-3"><Badge variant="secondary" className="capitalize">{p.role}</Badge></td>
              <td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {profiles.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No users yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function AdminCategories({ categories }: { categories: any[] }) {
  const { t } = useLanguage();
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <div key={c.id} className="rounded-xl border border-border bg-card p-4">
          <p className="font-bold">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.slug}</p>
        </div>
      ))}
    </div>
  );
}

function AdminCoupons({ coupons }: { coupons: any[] }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <div className="flex justify-between"><h2 className="font-bold">{t('manageCoupons')}</h2><Button size="sm" onClick={() => toast.info('Coming soon')}>{t('add')}</Button></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
            <p className="font-mono text-lg font-bold text-primary">{c.code}</p>
            <p className="text-sm text-muted-foreground">{c.type === 'percent' ? `${c.value}% off` : `$${c.value} off`}</p>
            {c.min_subtotal && <p className="text-xs text-muted-foreground">Min: ${c.min_subtotal}</p>}
            <Badge variant="secondary" className={cn('mt-2', c.active ? 'bg-success/20 text-success' : 'bg-muted')}>{c.active ? t('active') : t('inactive')}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminReports() {
  const { t } = useLanguage();
  const data = ['W1', 'W2', 'W3', 'W4'].map((w) => ({ name: w, revenue: Math.random() * 10000, orders: Math.random() * 100 }));
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 font-bold">{t('reports')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
