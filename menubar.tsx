'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/lib/store';

export function Countdown({ target }: { target?: number }) {
  const { t } = useLanguage();
  const [time, setTime] = React.useState({ d: 0, h: 0, m: 0, s: 0 });
  const endRef = React.useRef(target ?? Date.now() + 2 * 24 * 60 * 60 * 1000);

  React.useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endRef.current - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTime({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const Box = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground tabular-nums md:h-10 md:w-10 md:text-base">
        {String(v).padStart(2, '0')}
      </span>
      <span className="mt-0.5 text-[10px] text-muted-foreground">{l}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-1.5">
      <Clock className="hidden h-4 w-4 text-primary sm:block" />
      {time.d > 0 && <Box v={time.d} l={t('daysLabel')} />}
      <Box v={time.h} l={t('hours')} />
      <span className="text-primary">:</span>
      <Box v={time.m} l={t('minutes')} />
      <span className="text-primary">:</span>
      <Box v={time.s} l={t('seconds')} />
    </div>
  );
}
