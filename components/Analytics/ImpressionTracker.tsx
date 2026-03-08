'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function ImpressionTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const payload = JSON.stringify({ pathname, locale });

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/impressions', blob);
      return;
    }

    void fetch('/api/impressions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    });
  }, [pathname, locale]);

  return null;
}
