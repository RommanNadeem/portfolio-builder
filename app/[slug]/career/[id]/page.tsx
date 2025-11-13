import { getPublishedCareer } from '@/lib/publishing';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TemplateRendererClient } from '@/app/[slug]/components/TemplateRendererClient';
import { Award } from 'lucide-react';

// Enable ISR with 60 second revalidation
export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  
  // Server-side optimized fetch (only gets the career we need)
  const data = await getPublishedCareer(slug, id);

  if (!data) {
    notFound();
  }

  const { career, portfolioName, footerData } = data;
  const hasBlocks = career.blocks && career.blocks.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Breadcrumb */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link
            href={`/${slug}`}
            prefetch={true}
            className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5 sm:gap-2 font-medium cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </nav>

      {/* Career Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {hasBlocks ? (
          <div className="space-y-8">
            {/* Render template blocks in preview mode */}
            <TemplateRendererClient
              blocks={career.blocks}
              entityType="career"
            />
          </div>
        ) : (
          /* No detail page content yet */
          <div className="py-16 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{career.role}</h1>
              <p className="text-xl text-gray-600 mb-4">{career.organization}</p>
              <p className="text-gray-500 text-sm">
                {(career as any).startDate} - {(career as any).currentlyWorking || (career as any).current ? 'Present' : (career as any).endDate}
              </p>
            </div>
            
            {career.description && (
              <p className="text-gray-700 max-w-2xl mx-auto mb-8">{career.description}</p>
            )}
            
            {((career as any).achievements || []).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-8 max-w-3xl mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Key Achievements</h3>
                <ul className="space-y-2 text-left">
                  {(career as any).achievements.map((achievement: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="flex-shrink-0 text-blue-500 mt-1">✓</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <p className="text-gray-500 text-sm mt-8">
              Detailed case study coming soon
            </p>
          </div>
        )}

        {/* Back to portfolio button */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <Link
            href={`/${slug}`}
            prefetch={true}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm sm:text-base cursor-pointer"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {portfolioName}
          </Link>
        </div>
      </div>

      {/* Footer */}
      {(footerData?.footerText || footerData?.footerSignature) && (
        <footer className="border-t border-gray-200 bg-gray-50 py-6 sm:py-8 mt-12 sm:mt-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            {footerData.footerText && (
              <p className="text-gray-600 mb-2">{footerData.footerText}</p>
            )}
            {footerData.footerSignature && (
              <p className="text-sm text-gray-500">{footerData.footerSignature}</p>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

