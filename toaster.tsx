'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { useLanguage } from '@/lib/store';
import type { Category } from '@/lib/types';

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const { lang } = useLanguage();
  const label = lang === 'ar' && category.name_ar ? category.name_ar : category.name;
  const IconName = category.icon as keyof typeof Icons;
  const Icon = (Icons[IconName] ?? Icons.Tag) as React.ComponentType<{ className?: string }>;

  return (
    <Link
      href={`/catalog?category=${category.id}`}
      className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow animate-fade-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-secondary">
        {category.image ? (
          <Image src={category.image} alt={label} fill sizes="56px" className="object-cover transition-transform group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      <span className="line-clamp-1 text-xs font-medium">{label}</span>
    </Link>
  );
}
