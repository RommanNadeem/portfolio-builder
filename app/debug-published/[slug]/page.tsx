import { getPublishedPortfolio } from '@/lib/publishing';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DebugPublishedPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolio = await getPublishedPortfolio(slug);

  if (!portfolio) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug: Portfolio Not Found</h1>
        <p>No published portfolio found for slug: {slug}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug: Published Portfolio Data</h1>
      <p className="mb-4">Slug: {slug}</p>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-lg font-semibold mb-2">Data Structure:</h2>
        <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(portfolio, null, 2)}
        </pre>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-lg font-semibold mb-2">Data Counts:</h2>
        <ul className="space-y-1 text-sm">
          <li>Projects: {(portfolio as any).projects?.length || 0}</li>
          <li>Career Highlights: {(portfolio as any).careerHighlights?.length || 0}</li>
          <li>Strengths: {(portfolio as any).strengths?.length || 0}</li>
          <li>Testimonials: {(portfolio as any).testimonials?.length || 0}</li>
          <li>Social Links: {(portfolio as any).socialLinks?.length || 0}</li>
        </ul>
      </div>

      {(portfolio as any).careerHighlights && (portfolio as any).careerHighlights.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Career Highlights:</h2>
          {(portfolio as any).careerHighlights.map((career: any, idx: number) => (
            <div key={idx} className="mb-4 p-4 bg-gray-50 rounded">
              <p className="font-semibold">{career.organization} - {career.role}</p>
              <p className="text-sm text-gray-600">Description: {career.description || 'N/A'}</p>
              <p className="text-sm text-gray-600">Achievements: {(career.achievements || []).length}</p>
              <p className="text-sm text-gray-600">Key Achievements: {(career.key_achievements || []).length}</p>
              <p className="text-sm text-gray-600">Featured: {(career.featured_achievements || []).length}</p>
              <p className="text-sm text-gray-600">Blocks: {(career.blocks || []).length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

