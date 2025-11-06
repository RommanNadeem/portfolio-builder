'use client';

import { useEffect, useState } from 'react';

export default function DebugDataPage() {
  const [draftData, setDraftData] = useState<any>(null);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    const draft = localStorage.getItem('onboarding_draft');
    const portfolio = localStorage.getItem('portfolioData');
    
    setDraftData(draft ? JSON.parse(draft) : null);
    setPortfolioData(portfolio ? JSON.parse(portfolio) : null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Debug Data</h1>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">onboarding_draft (localStorage)</h2>
          {draftData ? (
            <>
              <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {draftData.name || 'N/A'}
                </div>
                <div>
                  <strong>Role:</strong> {draftData.role || 'N/A'}
                </div>
                <div>
                  <strong>Email:</strong> {draftData.email || 'N/A'}
                </div>
                <div>
                  <strong>Phone:</strong> {draftData.phone || 'N/A'}
                </div>
                <div>
                  <strong>Experiences:</strong> {draftData.experiences?.length || 0}
                </div>
                <div>
                  <strong>Projects:</strong> {draftData.projects?.length || 0}
                </div>
                <div>
                  <strong>Links:</strong> {draftData.links?.length || 0}
                </div>
              </div>
              <details>
                <summary className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium">
                  View Full JSON
                </summary>
                <pre className="mt-3 text-xs bg-gray-50 p-4 rounded overflow-x-auto border">
                  {JSON.stringify(draftData, null, 2)}
                </pre>
              </details>
            </>
          ) : (
            <p className="text-gray-500">No draft data found</p>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">portfolioData (localStorage)</h2>
          {portfolioData ? (
            <>
              <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {portfolioData.name || portfolioData.fullName || 'N/A'}
                </div>
                <div>
                  <strong>Role:</strong> {portfolioData.role || portfolioData.profession || 'N/A'}
                </div>
                <div>
                  <strong>Experiences (new):</strong> {portfolioData.experiences?.length || 0}
                </div>
                <div>
                  <strong>Career Highlights (old):</strong> {portfolioData.careerHighlights?.length || 0}
                </div>
              </div>
              <details>
                <summary className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium">
                  View Full JSON
                </summary>
                <pre className="mt-3 text-xs bg-gray-50 p-4 rounded overflow-x-auto border">
                  {JSON.stringify(portfolioData, null, 2)}
                </pre>
              </details>
            </>
          ) : (
            <p className="text-gray-500">No portfolio data found</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check if "experiences" array has items</li>
            <li>• Verify each experience has: id, company, title, startDate, endDate</li>
            <li>• Make sure data structure matches what PortfolioPreview expects</li>
          </ul>
        </div>

        <button
          onClick={() => {
            if (confirm('Clear all localStorage data?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Clear All Data & Reload
        </button>
      </div>
    </div>
  );
}

