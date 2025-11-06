'use client';

import { useState } from 'react';
import { generateTaglines, generateAbout } from '@/lib/railway-api';

export default function TestAIPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testTaglines = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const { data, error: err } = await generateTaglines({
      name: 'John Doe',
      role: 'Product Designer',
      companies: ['Google', 'Apple', 'Microsoft']
    });

    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setResult(data);
    }
  };

  const testAbout = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const { data, error: err } = await generateAbout({
      name: 'John Doe',
      role: 'Product Designer',
      companies: ['Google', 'Apple'],
      experiences: [
        {
          company: 'Google',
          title: 'Senior Product Designer',
          startDate: 'Jan 2020',
          endDate: 'Present',
          highlights: ['Led design for Maps', 'Shipped 15+ features']
        }
      ]
    });

    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setResult(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🧪 Test AI Functions</h1>

        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Test Railway Backend API</h2>
          <p className="text-gray-600 mb-6">
            Click buttons to test if your Railway backend is working with OpenAI
          </p>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testTaglines}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
            >
              {loading ? '⏳ Testing...' : '✨ Test Generate Taglines'}
            </button>

            <button
              onClick={testAbout}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
            >
              {loading ? '⏳ Testing...' : '📝 Test Generate About'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-red-900 mb-2">❌ Error:</h3>
              <p className="text-sm text-red-700">{error}</p>
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer">View Details</summary>
                <pre className="text-xs mt-2 bg-red-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">✅ Success!</h3>
              <pre className="text-sm bg-white p-4 rounded overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">📋 Checklist:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✅ OpenAI key set in Railway environment variables</li>
            <li>✅ Railway backend deployed (parse-resume, generate-copy, etc.)</li>
            <li>✅ .env.local file has NEXT_PUBLIC_RAILWAY_BACKEND_URL</li>
            <li>⏳ Testing if API works...</li>
          </ul>
        </div>

        <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-3">🔍 Check Console</h3>
          <p className="text-sm text-gray-600 mb-2">
            Open Browser DevTools (F12) and look for:
          </p>
          <ul className="text-xs text-gray-700 space-y-1 font-mono bg-gray-50 p-3 rounded">
            <li>[Railway API] Calling /api/generate-copy</li>
            <li>[Railway API] Response: {'{ data: {...}, error: null }'}</li>
            <li>[Railway API] Success: /api/generate-copy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

