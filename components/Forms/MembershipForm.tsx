'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function MembershipForm() {
  const t = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    expertise: '',
    projectsInterest: '',
    securityLevel: 'publicAdvocate',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || data?.error || `Server error ${response.status}`);
      }
      
      console.log('Membership application submitted:', data);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Failed to submit: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-950 border border-green-500/30 rounded-lg p-12 text-center">
        <div className="text-5xl mb-4 font-mono text-green-500">[✓]</div>
        <h3 className="text-3xl font-bold text-green-400 mb-3">{t('membership.submitSuccess')}</h3>
        <p className="text-green-300 text-lg leading-relaxed">Your membership application has been received and your data is securely encrypted using industry-leading protocols.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Form Header */}
      <div>
        <h2 className="text-3xl font-bold text-green-400 mb-2">{t('membership.formTitle')}</h2>
        <p className="text-green-200/70">Please complete the following information to finalize your membership.</p>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-green-300 mb-2">
            {t('membership.fullName')} *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-green-100 placeholder-green-700"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-green-300 mb-2">
            {t('membership.email')} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-green-100 placeholder-green-700"
            placeholder="your@email.com"
          />
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-semibold text-green-300 mb-2">
            {t('membership.organization')}
          </label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-green-100 placeholder-green-700"
            placeholder="Your organization (optional)"
          />
        </div>

        {/* Expertise */}
        <div>
          <label className="block text-sm font-semibold text-green-300 mb-2">
            {t('membership.expertise')}
          </label>
          <textarea
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-green-100 placeholder-green-700"
            placeholder="Describe your expertise and background..."
          />
        </div>

        {/* Projects of Interest */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('membership.projectsInterest')}
          </label>
          <textarea
            name="projectsInterest"
            value={formData.projectsInterest}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-black border border-green-500/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-green-100 placeholder-green-700"
            placeholder="Tell us about your areas of interest and projects..."
          />
        </div>
      </div>

      {/* Security Level Selection */}
      <div className="border-t border-green-500/30 pt-8">
        <h3 className="text-xl font-bold text-green-400 mb-3">{t('membership.securityLevel')}</h3>
        <p className="text-green-200/70 mb-6">{t('membership.securityLevelHelp')}</p>

        <div className="space-y-4">
          {/* Public Advocate */}
          <label className="block p-5 border-2 rounded-lg cursor-pointer transition hover:bg-green-950/50" style={{borderColor: formData.securityLevel === 'publicAdvocate' ? '#22c55e' : 'rgba(34,197,94,0.2)', backgroundColor: formData.securityLevel === 'publicAdvocate' ? 'rgba(34,197,94,0.1)' : 'transparent'}}>
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="securityLevel"
                value="publicAdvocate"
                checked={formData.securityLevel === 'publicAdvocate'}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-green-500 accent-green-500"
              />
              <div className="flex-1">
                <p className="font-bold text-green-300">{t('membership.publicAdvocate')}</p>
                <p className="text-sm text-green-200/70 mt-1">{t('membership.publicAdvocateDesc')}</p>
              </div>
            </div>
          </label>

          {/* Discrete Contributor */}
          <label className="block p-5 border-2 rounded-lg cursor-pointer transition hover:bg-green-950/50" style={{borderColor: formData.securityLevel === 'discreteContributor' ? '#22c55e' : 'rgba(34,197,94,0.2)', backgroundColor: formData.securityLevel === 'discreteContributor' ? 'rgba(34,197,94,0.1)' : 'transparent'}}>
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="securityLevel"
                value="discreteContributor"
                checked={formData.securityLevel === 'discreteContributor'}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-green-500 accent-green-500"
              />
              <div className="flex-1">
                <p className="font-bold text-green-300">{t('membership.discreteContributor')}</p>
                <p className="text-sm text-green-200/70 mt-1">{t('membership.discreteContributorDesc')}</p>
              </div>
            </div>
          </label>

          {/* Confidential Member */}
          <label className="block p-5 border-2 rounded-lg cursor-pointer transition hover:bg-green-950/50" style={{borderColor: formData.securityLevel === 'confidentialMember' ? '#22c55e' : 'rgba(34,197,94,0.2)', backgroundColor: formData.securityLevel === 'confidentialMember' ? 'rgba(34,197,94,0.1)' : 'transparent'}}>
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="securityLevel"
                value="confidentialMember"
                checked={formData.securityLevel === 'confidentialMember'}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-green-500 accent-green-500"
              />
              <div className="flex-1">
                <p className="font-bold text-green-300">{t('membership.confidentialMember')}</p>
                <p className="text-sm text-green-200/70 mt-1">{t('membership.confidentialMemberDesc')}</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Data Protection Notice */}
      <div className="bg-green-950 border border-green-500/30 rounded-lg p-5">
        <p className="text-sm text-green-300">
          <span className="font-bold block mb-1">[◆] {t('membership.dataDisclaimer')}</span>
          All your personal data is encrypted end-to-end using military-grade encryption and stored securely. We never share your information.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-green-600 text-black rounded-lg font-bold text-lg hover:bg-green-500 transition disabled:bg-green-900/30 disabled:text-green-700 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin font-mono text-green-500">[~]</span> Submitting...
          </span>
        ) : (
          `${t('membership.submit')} →`
        )}
      </button>
    </form>
  );
}
