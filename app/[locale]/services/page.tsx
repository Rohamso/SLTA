'use client';

import { useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();
  const isRTL = locale === 'fa';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError('');
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(t('fileTooLarge'));
      e.target.value = '';
      setResumeFile(null);
      return;
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(t('invalidFileType'));
      e.target.value = '';
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !email || !country || !resumeFile) return;

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('country', country);
      formData.append('resume', resumeFile);

      const res = await fetch('/api/resume-review', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('errorGeneric'));
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || t('errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setFullName('');
    setEmail('');
    setCountry('');
    setResumeFile(null);
    setSubmitted(false);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className={isRTL ? 'text-right' : ''}>
      {/* Hero */}
      <section className="mb-16 pt-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs font-semibold uppercase tracking-wider mb-6">
            {isRTL ? 'خدمات انجمن' : 'Community Services'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">{t('title')}</h1>
          <p className="text-lg text-green-200/70 max-w-3xl mx-auto leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* Resume Review Section */}
      <section className="mb-20 bg-black rounded-2xl p-8 md:p-10 border border-green-500/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center text-xl font-mono text-green-400">
                📄
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-green-400">{t('resumeTitle')}</h2>
            </div>

            <p className="text-green-200/70 leading-relaxed mb-8">{t('resumeDesc')}</p>

            {/* How it works */}
            <div className="bg-green-950/50 border border-green-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-300 mb-4">{t('resumeHow')}</h3>
              <div className="space-y-4">
                {[t('resumeStep1'), t('resumeStep2'), t('resumeStep3')].map((step, i) => (
                  <div key={i} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-8 h-8 bg-green-900/60 rounded-full flex items-center justify-center text-green-400 font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-green-200/70 text-sm leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy disclaimer */}
            <div className="mt-6 flex items-start gap-3">
              <span className="text-green-500 mt-0.5">🔒</span>
              <p className="text-green-300/50 text-xs leading-relaxed">{t('disclaimer')}</p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              /* Success State */
              <div className="bg-green-950/30 border border-green-500/30 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-green-400 mb-3">{t('successTitle')}</h3>
                <p className="text-green-200/70 leading-relaxed mb-6">{t('successMsg')}</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-green-900/50 hover:bg-green-900 border border-green-500/30 rounded-lg text-green-400 font-semibold text-sm transition"
                >
                  {t('submitAnother')}
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="bg-green-950/20 border border-green-500/20 rounded-xl p-6 md:p-8 space-y-5">
                <h3 className="text-xl font-bold text-green-400 mb-2">{t('formTitle')}</h3>

                {/* Full Name */}
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-1.5">{t('fullName')}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-green-500/30 rounded-lg text-green-300 text-sm placeholder:text-green-300/30 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-1.5">{t('email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-green-500/30 rounded-lg text-green-300 text-sm placeholder:text-green-300/30 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                    dir="ltr"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-1.5">{t('country')}</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder={t('countryPlaceholder')}
                    required
                    className="w-full px-4 py-2.5 bg-black border border-green-500/30 rounded-lg text-green-300 text-sm placeholder:text-green-300/30 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-green-300 text-sm font-semibold mb-1.5">{t('resume')}</label>
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      required
                      className="w-full px-4 py-2.5 bg-black border border-green-500/30 rounded-lg text-green-300 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border file:border-green-500/30 file:text-green-400 file:bg-green-900/50 file:text-xs file:font-semibold hover:file:bg-green-900 file:cursor-pointer file:transition"
                    />
                  </div>
                  <p className="text-green-300/40 text-xs mt-1">{t('resumeHint')}</p>
                  {resumeFile && (
                    <p className="text-green-400 text-xs mt-1">
                      ✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-950/50 border border-red-500/40 rounded-lg px-4 py-3">
                    <p className="text-red-300/80 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !resumeFile}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:text-green-700 disabled:cursor-not-allowed text-black font-bold text-sm rounded-lg transition mt-2"
                >
                  {submitting ? t('submitting') : t('submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
