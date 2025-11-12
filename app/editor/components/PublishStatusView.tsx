/**
 * PublishStatusView - Shows portfolio status and publish action
 * 
 * Displays URL, stats, validation, and publish button
 */

'use client';

import { useState, useEffect } from 'react';
import { Copy, ExternalLink, Check, AlertCircle, AlertTriangle, Briefcase, Award, Star, MessageSquare, HelpCircle, Package, FileText } from 'lucide-react';
import { PublishButton, type PublishButtonState } from './PublishButton';
import { validateBeforePublish } from '@/lib/publishing';

interface PublishStatusViewProps {
  userId: string;
  portfolioUrl: string;
  portfolioData: any;
  isPublished: boolean;
  onPublish: () => Promise<void>;
  publishButtonState: PublishButtonState;
}

export function PublishStatusView({
  userId,
  portfolioUrl,
  portfolioData,
  isPublished,
  onPublish,
  publishButtonState,
}: PublishStatusViewProps) {
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState<{
    canPublish: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  // Run validation
  useEffect(() => {
    const result = validateBeforePublish(portfolioData);
    setValidation(result);
  }, [portfolioData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSite = () => {
    window.open(portfolioUrl, '_blank', 'noopener,noreferrer');
  };

  const projectCount = portfolioData?.projects?.length || 0;
  const careerCount = portfolioData?.careerHighlights?.length || 0;
  const strengthCount = portfolioData?.strengths?.length || 0;
  const testimonialCount = portfolioData?.testimonials?.length || 0;
  const faqCount = portfolioData?.faqs?.length || 0;
  const serviceCount = portfolioData?.services?.length || 0;
  const hasResume = Boolean(portfolioData?.resume || portfolioData?.profile?.resume_url);

  return (
    <div className="space-y-6">
      {/* Portfolio URL Display */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Your Portfolio URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={portfolioUrl}
            readOnly
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-700"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            title={copied ? 'Copied!' : 'Copy URL'}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {isPublished && (
            <button
              onClick={handleOpenSite}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="View Site"
            >
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Portfolio Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatItem icon={<Briefcase className="w-5 h-5" />} iconBg="bg-purple-100" iconColor="text-purple-600" label="Projects" value={projectCount} />
          <StatItem icon={<Award className="w-5 h-5" />} iconBg="bg-blue-100" iconColor="text-blue-600" label="Career" value={careerCount} />
          <StatItem icon={<Star className="w-5 h-5" />} iconBg="bg-orange-100" iconColor="text-orange-600" label="Strengths" value={strengthCount} />
          <StatItem icon={<MessageSquare className="w-5 h-5" />} iconBg="bg-yellow-100" iconColor="text-yellow-600" label="Testimonials" value={testimonialCount} />
          <StatItem icon={<HelpCircle className="w-5 h-5" />} iconBg="bg-sky-100" iconColor="text-sky-600" label="FAQs" value={faqCount} />
          <StatItem icon={<Package className="w-5 h-5" />} iconBg="bg-cyan-100" iconColor="text-cyan-600" label="Services" value={serviceCount} />
          <StatItem icon={<FileText className="w-5 h-5" />} iconBg="bg-green-100" iconColor="text-green-600" label="Resume" value={hasResume ? '✓' : '—'} />
        </div>
      </div>

      {/* Validation Errors (Blocking) */}
      {validation && validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-2">
                Please fix these issues to publish:
              </h4>
              <ul className="space-y-1">
                {validation.errors.map((error, i) => (
                  <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings (Non-blocking) */}
      {validation && validation.warnings.length > 0 && validation.errors.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                Suggestions:
              </h4>
              <ul className="space-y-1">
                {validation.warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-yellow-800 flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-yellow-700 mt-2">
                You can still publish, but addressing these will improve your portfolio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {validation && validation.errors.length === 0 && validation.warnings.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Your portfolio looks great!
              </p>
              <p className="text-xs text-green-700 mt-1">
                Ready to publish and share with the world.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Publish Button */}
      <PublishButton
        state={publishButtonState}
        onClick={onPublish}
        disabled={validation?.errors.length ? validation.errors.length > 0 : false}
      />
    </div>
  );
}

/**
 * Stat Item Component
 */
function StatItem({ 
  icon, 
  iconBg, 
  iconColor, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  iconBg: string; 
  iconColor: string; 
  label: string; 
  value: number | string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}


