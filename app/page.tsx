import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header with Sign In */}
      <header className="w-full py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">Portfolio Builder</span>
          </div>
          <Link
            href="/signin"
            className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <main className="max-w-4xl w-full text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              Portfolio Builder
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create your professional portfolio in minutes
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4">
              ✨ NEW: Import from Resume or LinkedIn
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome! Let's build your portfolio
            </h2>
            <p className="text-gray-600 mb-8">
              Get started in under 60 seconds with our new preview-first onboarding. Upload your resume or paste your LinkedIn URL to auto-generate your portfolio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/onboarding-v2/start"
                className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-4 px-8 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-lg"
              >
                ⚡ Get Started
              </Link>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account? <Link href="/signin" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Professional Profile
            </h3>
            <p className="text-gray-600 text-sm">
              Share your name, profession, and a compelling description of who you are
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Resume Upload
            </h3>
            <p className="text-gray-600 text-sm">
              Upload your resume and we'll parse your experience, education, and skills
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Work Experience
            </h3>
            <p className="text-gray-600 text-sm">
              List companies you've worked with and showcase your professional journey
            </p>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
