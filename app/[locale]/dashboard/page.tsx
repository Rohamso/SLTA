'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

interface CountBucket {
  total: number;
  en: number;
  fa: number;
}

interface ImpressionSnapshot {
  totals: CountBucket;
  pages: Array<{ path: string } & CountBucket>;
  daily: Array<{ date: string } & CountBucket>;
  updatedAt: string;
}

const EMPTY_SNAPSHOT: ImpressionSnapshot = {
  totals: { total: 0, en: 0, fa: 0 },
  pages: [],
  daily: [],
  updatedAt: new Date(0).toISOString(),
};

function formatTimestamp(value: string, locale: string): string {
  if (!value || Number.isNaN(Date.parse(value))) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatDay(value: string, locale: string): string {
  if (!value || Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export default function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'fa';

  const [snapshot, setSnapshot] = useState<ImpressionSnapshot>(EMPTY_SNAPSHOT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSnapshot = useCallback(async () => {
    try {
      const response = await fetch('/api/impressions?days=30&top=25', {
        method: 'GET',
        cache: 'no-store',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || data?.error || `Server error ${response.status}`);
      }

      setSnapshot(data as ImpressionSnapshot);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSnapshot();

    const intervalId = setInterval(() => {
      void loadSnapshot();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [loadSnapshot]);

  const maxDailyCount = useMemo(
    () => Math.max(...snapshot.daily.map((item) => item.total), 1),
    [snapshot.daily]
  );

  return (
    <div className={isRTL ? 'text-right' : ''}>
      <div className="mb-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-green-400">{t('dashboard.title')}</h1>
        <p className="text-lg text-green-200/70 max-w-3xl">{t('dashboard.subtitle')}</p>
        <p className="text-sm text-green-300/60 mt-3 font-mono">
          {t('dashboard.lastUpdated')}: {formatTimestamp(snapshot.updatedAt, locale)}
        </p>
      </div>

      <div className="mb-10 bg-green-950 border border-green-500/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-green-300 mb-3">{t('dashboard.privacyTitle')}</h2>
        <p className="text-green-200/70 text-sm leading-relaxed">{t('dashboard.privacyBody')}</p>
      </div>

      {loading ? (
        <div className="bg-black border border-green-500/30 rounded-lg p-8 text-green-300">
          {t('dashboard.loading')}
        </div>
      ) : error ? (
        <div className="bg-red-950/50 border border-red-500/40 rounded-lg p-8">
          <h2 className="text-xl font-bold text-red-300 mb-2">{t('dashboard.errorTitle')}</h2>
          <p className="text-red-200/80 text-sm">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-black border border-green-500/30 rounded-lg p-5">
              <p className="text-green-200/70 text-sm">{t('dashboard.totalImpressions')}</p>
              <p className="text-4xl font-bold text-green-300">{snapshot.totals.total}</p>
            </div>
            <div className="bg-black border border-green-500/30 rounded-lg p-5">
              <p className="text-green-200/70 text-sm">{t('dashboard.englishImpressions')}</p>
              <p className="text-4xl font-bold text-green-300">{snapshot.totals.en}</p>
            </div>
            <div className="bg-black border border-green-500/30 rounded-lg p-5">
              <p className="text-green-200/70 text-sm">{t('dashboard.farsiImpressions')}</p>
              <p className="text-4xl font-bold text-green-300">{snapshot.totals.fa}</p>
            </div>
          </div>

          <div className="mb-10 bg-black border border-green-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-5">{t('dashboard.topPagesTitle')}</h2>
            {snapshot.pages.length === 0 ? (
              <p className="text-green-200/70 text-sm">{t('dashboard.noData')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  <thead className="text-green-300 border-b border-green-500/30">
                    <tr>
                      <th className="py-3 pr-4 font-semibold">{t('dashboard.tablePage')}</th>
                      <th className="py-3 pr-4 font-semibold">{t('dashboard.tableTotal')}</th>
                      <th className="py-3 pr-4 font-semibold">{t('dashboard.tableEnglish')}</th>
                      <th className="py-3 pr-4 font-semibold">{t('dashboard.tableFarsi')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.pages.map((page) => (
                      <tr key={page.path} className="border-b border-green-500/10 last:border-0">
                        <td className="py-3 pr-4 text-green-200 font-mono">{page.path}</td>
                        <td className="py-3 pr-4 text-green-300">{page.total}</td>
                        <td className="py-3 pr-4 text-green-300">{page.en}</td>
                        <td className="py-3 pr-4 text-green-300">{page.fa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-black border border-green-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-400 mb-5">{t('dashboard.trendTitle')}</h2>
            {snapshot.daily.length === 0 ? (
              <p className="text-green-200/70 text-sm">{t('dashboard.noData')}</p>
            ) : (
              <div className="space-y-3">
                {snapshot.daily.map((row) => (
                  <div key={row.date}>
                    <div className="flex items-center justify-between text-xs text-green-200/70 mb-1">
                      <span>{formatDay(row.date, locale)}</span>
                      <span>{row.total}</span>
                    </div>
                    <div className="h-2 bg-green-950 rounded-full overflow-hidden border border-green-500/20">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${Math.max((row.total / maxDailyCount) * 100, row.total > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
