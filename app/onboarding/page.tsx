'use client';

import { useState } from 'react';
import FullNameStep from './steps/FullNameStep';
import ProfessionStep from './steps/ProfessionStep';
import EmailStep from './steps/EmailStep';
import PhoneStep from './steps/PhoneStep';
import ResumeStep from './steps/ResumeStep';
import CompaniesStep from './steps/CompaniesStep';
import TaglineStep from './steps/TaglineStep';
import WhoAreYouStep from './steps/WhoAreYouStep';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

interface CareerHighlight {
  id: string;
  organization: string;
  role: string;
  description: string;
  link: string;
  achievements: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Strength {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface CustomSection {
  id: string;
  title: string;
  icon: string;
  type: 'text' | 'textarea' | 'list' | 'cards' | 'grid';
  data: any;
  order: number;
}

interface Testimonial {
  id: string;
  name: string;
  title: string;
  testimonial: string;
  linkedinUrl: string;
}

export interface OnboardingData {
  fullName: string;
  profession: 'Product Manager' | 'Product Designer' | 'Software Engineer' | '';
  email: string;
  phone: string;
  resume: File | null;
  companies: string;
  sliderCompanies: string;
  careerHighlights: CareerHighlight[];
  strengths: Strength[];
  tagline: string;
  whoAreYou: string;
  profileImage: string | null;
  socialLinks: SocialLink[];
  customSections: CustomSection[];
  testimonials: Testimonial[];
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    profession: '',
    email: '',
    phone: '',
    resume: null,
    companies: '',
    sliderCompanies: '',
    careerHighlights: [],
    strengths: [],
    tagline: '',
    whoAreYou: '',
    profileImage: null,
    socialLinks: [],
    customSections: [],
    testimonials: [],
  });

  const totalSteps = 8;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding completed:', data);
    // Save data to localStorage
    localStorage.setItem('portfolioData', JSON.stringify(data));
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FullNameStep
            value={data.fullName}
            onChange={(value) => updateData('fullName', value)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ProfessionStep
            value={data.profession}
            onChange={(value) => updateData('profession', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <EmailStep
            value={data.email}
            onChange={(value) => updateData('email', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <PhoneStep
            value={data.phone}
            onChange={(value) => updateData('phone', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <ResumeStep
            value={data.resume}
            onChange={(value) => updateData('resume', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <CompaniesStep
            value={data.companies}
            onChange={(value) => updateData('companies', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <TaglineStep
            value={data.tagline}
            onChange={(value) => updateData('tagline', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 8:
        return (
          <WhoAreYouStep
            value={data.whoAreYou}
            onChange={(value) => updateData('whoAreYou', value)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 relative">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="absolute top-6 left-6 text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

