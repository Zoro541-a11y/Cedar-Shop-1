'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Store, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth, useLanguage } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { SOCIAL_PROVIDERS } from '@/lib/constants';

export default function AuthPage() {
  const { t } = useLanguage();
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ email: '', password: '', fullName: '', confirm: '' });

  const redirect = sp.get('redirect') || '/account';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password);
        if (error) { toast.error(error); return; }
        toast.success(t('welcomeBack'));
        router.push(redirect);
      } else {
        if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        const { error } = await signUp(form.email, form.password, form.fullName);
        if (error) { toast.error(error); return; }
        toast.success(t('welcomeBack'));
        router.push(redirect);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSocial = async (provider: 'google' | 'apple' | 'facebook') => {
    const { error } = await signInWithOAuth(provider);
    if (error) toast.error(error);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-8">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card animate-scale-in">
        {/* Logo */}
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white shadow-glow"><Store className="h-6 w-6" /></div>
          <span className="font-display text-2xl font-extrabold">Shop<span className="text-primary">Flow</span></span>
        </Link>

        <h1 className="text-center font-display text-xl font-bold">{mode === 'login' ? t('signIn') : t('createAccount')}</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{mode === 'login' ? t('signInToContinue') : t('signUpToStart')}</p>

        {/* Social */}
        <div className="mt-6 space-y-2">
          {SOCIAL_PROVIDERS.map((p) => (
            <Button key={p.id} variant="outline" className="w-full gap-2" onClick={() => onSocial(p.id)}>
              <SocialIcon id={p.id} />
              {t('continueWith')} {p.label}
            </Button>
          ))}
        </div>

        <div className="my-4 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <Label className="mb-1.5 block text-xs font-medium">{t('fullName')}</Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="ps-9" required />
              </div>
            </div>
          )}
          <div>
            <Label className="mb-1.5 block text-xs font-medium">{t('email')}</Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="ps-9" required />
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-medium">{t('password')}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type={showPw ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="ps-9 pe-9" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {mode === 'signup' && (
            <div>
              <Label className="mb-1.5 block text-xs font-medium">{t('confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type={showPw ? 'text' : 'password'} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="ps-9" required />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-primary hover:underline">{t('forgotPassword')}</button>
            </div>
          )}

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? t('loading') : mode === 'login' ? t('signIn') : t('createAccount')}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-semibold text-primary hover:underline">
            {mode === 'login' ? t('signUp') : t('signIn')}
          </button>
        </p>
      </div>
    </div>
  );
}

function SocialIcon({ id }: { id: string }) {
  if (id === 'google') return <span className="text-base font-bold">G</span>;
  if (id === 'apple') return <span className="text-base font-bold"></span>;
  if (id === 'facebook') return <span className="text-base font-bold text-blue-600">f</span>;
  return null;
}
