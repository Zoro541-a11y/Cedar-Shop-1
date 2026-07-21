'use client';

import * as React from 'react';
import { Package, MapPin, Heart, Bell, User, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth, useLanguage, useWishlist } from '@/lib/store';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { Price } from '@/components/price';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { getUserOrders, getUserAddresses, getUserNotifications } from '@/lib/data';
import type { Order, Address, Notification } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const sp = useSearchParams();
  const tab = sp.get('tab') || 'orders';
  const { ids: wishIds } = useWishlist();

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [notifs, setNotifs] = React.useState<Notification[]>([]);
  const [wishlistProducts, setWishlistProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    getUserOrders(user.id).then(setOrders);
    getUserAddresses(user.id).then(setAddresses);
    getUserNotifications(user.id).then(setNotifs);
  }, [user]);

  React.useEffect(() => {
    if (wishIds.length === 0) { setWishlistProducts([]); return; }
    supabase.from('products').select('*, category:categories(*), brand:brands(*), seller:sellers(*)').in('id', wishIds).then(({ data }) => {
      setWishlistProducts(data ?? []);
    });
  }, [wishIds]);

  if (loading) return <div className="flex items-center justify-center py-20">{t('loading')}</div>;
  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-xl font-bold">{t('signInToContinue')}</h1>
        <Button asChild><Link href="/auth?redirect=/account">{t('signIn')}</Link></Button>
      </div>
    );
  }

  const items = [
    { href: '/account?tab=orders', label: t('myOrders'), icon: Package },
    { href: '/account?tab=wishlist', label: t('myWishlist'), icon: Heart },
    { href: '/account?tab=addresses', label: t('myAddresses'), icon: MapPin },
    { href: '/account?tab=notifications', label: t('notifications'), icon: Bell },
    { href: '/account?tab=profile', label: t('profileSettings'), icon: User },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 font-display text-2xl font-bold">{t('dashboard')}</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar items={items} role="customer" />
        <div className="flex-1">
          {tab === 'orders' && <OrdersTab orders={orders} />}
          {tab === 'wishlist' && <WishlistTab products={wishlistProducts} />}
          {tab === 'addresses' && <AddressesTab addresses={addresses} userId={user.id} onUpdate={() => getUserAddresses(user.id).then(setAddresses)} />}
          {tab === 'notifications' && <NotificationsTab notifs={notifs} userId={user.id} onUpdate={() => getUserNotifications(user.id).then(setNotifs)} />}
          {tab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  const { t } = useLanguage();
  if (orders.length === 0) {
    return <EmptyState icon={Package} title={t('noOrders')} desc={t('noOrdersDesc')} cta={t('startShopping')} href="/catalog" />;
  }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <p className="text-sm font-bold">{o.order_number}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.placed_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={o.status} />
              <Price amount={o.total} size="md" className="font-bold" />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {o.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                  {item.product_image && <Image src={item.product_image} alt={item.product_title} fill sizes="48px" className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{item.product_title}</p>
                  <p className="text-xs text-muted-foreground">{t('qty')}: {item.quantity}</p>
                </div>
                <Price amount={item.total} size="sm" />
              </div>
            ))}
          </div>
          {o.tracking_number && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-info">
              {t('trackingNumber')}: {o.tracking_number}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function WishlistTab({ products }: { products: any[] }) {
  const { t } = useLanguage();
  if (products.length === 0) {
    return <EmptyState icon={Heart} title={t('myWishlist')} desc={t('emptyCartDesc')} cta={t('startShopping')} href="/catalog" />;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <Link key={p.id} href={`/product/${p.slug}`} className="group overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image src={p.images[0]} alt={p.title} fill sizes="200px" className="object-cover transition-transform group-hover:scale-110" />
          </div>
          <div className="p-3">
            <p className="line-clamp-2 text-sm font-medium">{p.title}</p>
            <Price amount={Number(p.price)} size="md" className="mt-1 text-primary" />
          </div>
        </Link>
      ))}
    </div>
  );
}

function AddressesTab({ addresses, userId, onUpdate }: { addresses: Address[]; userId: string; onUpdate: () => void }) {
  const { t } = useLanguage();
  const [editing, setEditing] = React.useState<Address | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const save = async (data: Partial<Address>) => {
    if (editing) {
      await supabase.from('addresses').update(data).eq('id', editing.id);
    } else {
      await supabase.from('addresses').insert({ ...data, user_id: userId });
    }
    onUpdate();
    setShowForm(false);
    setEditing(null);
    toast.success(t('saveChanges'));
  };

  const del = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    onUpdate();
    toast.success(t('delete'));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h2 className="font-bold">{t('myAddresses')}</h2>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>{t('addAddress')}</Button>
      </div>
      {showForm && <AddressForm initial={editing} onSave={save} onCancel={() => setShowForm(false)} />}
      {addresses.length === 0 && !showForm && <p className="text-sm text-muted-foreground">{t('addAddress')}</p>}
      {addresses.map((a) => (
        <div key={a.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between">
            <div className="text-sm">
              <p className="font-bold">{a.full_name} {a.is_default && <Badge variant="secondary" className="ms-1">{t('defaultAddress')}</Badge>}</p>
              <p className="text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
              <p className="text-muted-foreground">{a.city}, {a.country} {a.zip}</p>
              <p className="text-muted-foreground">{a.phone}</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(a); setShowForm(true); }}>{t('edit')}</Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => del(a.id)}>{t('delete')}</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddressForm({ initial, onSave, onCancel }: { initial: Address | null; onSave: (d: Partial<Address>) => void; onCancel: () => void }) {
  const { t } = useLanguage();
  const [f, setF] = React.useState({ full_name: initial?.full_name ?? '', phone: initial?.phone ?? '', line1: initial?.line1 ?? '', line2: initial?.line2 ?? '', city: initial?.city ?? '', country: initial?.country ?? '', zip: initial?.zip ?? '' });
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder={t('fullName')} value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} />
        <Input placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        <Input placeholder="Address Line 1" value={f.line1} onChange={(e) => setF({ ...f, line1: e.target.value })} className="sm:col-span-2" />
        <Input placeholder="Address Line 2" value={f.line2} onChange={(e) => setF({ ...f, line2: e.target.value })} className="sm:col-span-2" />
        <Input placeholder="City" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
        <Input placeholder="Country" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} />
        <Input placeholder="ZIP" value={f.zip} onChange={(e) => setF({ ...f, zip: e.target.value })} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(f)}>{t('save')}</Button>
        <Button size="sm" variant="outline" onClick={onCancel}>{t('cancel')}</Button>
      </div>
    </div>
  );
}

function NotificationsTab({ notifs, userId, onUpdate }: { notifs: Notification[]; userId: string; onUpdate: () => void }) {
  const { t } = useLanguage();
  const markAll = async () => {
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
    onUpdate();
  };
  if (notifs.length === 0) return <EmptyState icon={Bell} title={t('noNotifications')} desc="" />;
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" variant="ghost" onClick={markAll}>{t('markAllRead')}</Button>
      </div>
      {notifs.map((n) => (
        <div key={n.id} className={cn('rounded-xl border border-border bg-card p-4', !n.read && 'border-primary/30 bg-primary/5')}>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</p>
            </div>
            {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [name, setName] = React.useState(user?.fullName ?? '');
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h2 className="font-bold">{t('personalInfo')}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="mb-1.5 block text-xs font-medium">{t('fullName')}</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label className="mb-1.5 block text-xs font-medium">{t('email')}</Label><Input value={user?.email} disabled /></div>
      </div>
      <Button onClick={() => toast.success(t('saveChanges'))}>{t('saveChanges')}</Button>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-warning/20 text-warning',
    paid: 'bg-info/20 text-info',
    processing: 'bg-info/20 text-info',
    shipped: 'bg-primary/20 text-primary',
    delivered: 'bg-success/20 text-success',
    cancelled: 'bg-destructive/20 text-destructive',
    refunded: 'bg-destructive/20 text-destructive',
  };
  return <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', colors[status])}>{status}</span>;
}

function EmptyState({ icon: Icon, title, desc, cta, href }: { icon: React.ElementType; title: string; desc: string; cta?: string; href?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <Icon className="h-10 w-10 text-muted-foreground" />
      <h3 className="font-bold">{title}</h3>
      {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      {cta && href && <Button asChild><Link href={href}>{cta}</Link></Button>}
    </div>
  );
}
