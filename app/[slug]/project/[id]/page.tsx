import { getPublishedProject } from '@/lib/publishing';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TemplateRendererClient } from '@/app/[slug]/components/TemplateRendererClient';

// Enable ISR with 60 second revalidation
export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  
  // Server-side optimized fetch (only gets the project we need)
  const data = await getPublishedProject(slug, id);

  if (!data) {
    notFound();
  }

  const { project, portfolioName, footerData } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Breadcrumb */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link
            href={`/${slug}`}
            className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5 sm:gap-2 font-medium cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </nav>

      {/* Project Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Render template blocks in preview mode */}
          <TemplateRendererClient
            blocks={project.blocks}
            entityType="project"
          />
        </div>

        {/* Back to portfolio button */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <Link
            href={`/${slug}`}
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

