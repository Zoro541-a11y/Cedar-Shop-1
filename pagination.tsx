'use client';

import { useCurrency } from '@/lib/store';
import { formatPrice } from '@/lib/format';

export function Price({
  amount,
  originalAmount,
  className,
  originalClassName,
  size = 'md',
}: {
  amount: number;
  originalAmount?: number | null;
  className?: string;
  originalClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const { currency } = useCurrency();
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-bold ${sizes[size]} ${className ?? ''}`}>{formatPrice(amount, currency)}</span>
      {originalAmount && originalAmount > amount && (
        <span className={`text-muted-foreground line-through ${sizes[size === 'xl' ? 'md' : 'sm']} ${originalClassName ?? ''}`}>
          {formatPrice(originalAmount, currency)}
        </span>
      )}
    </div>
  );
}
