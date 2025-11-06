'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingStartPage() {
  const router = useRouter();

  // Redirect to the new flow page
  useEffect(() => {
    router.push('/onboarding-v2/flow');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-500 mb-2">Loading...</div>
      </div>
    </div>
  );
}
