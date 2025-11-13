'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { PortfolioPreview } from '../components/PortfolioPreview';
import { track } from '@/lib/telemetry';
import { parseResume, generateTaglines, generateAbout } from '@/lib/railway-api';
import { User, Upload, X, Sparkles, Mail, Phone, Plus, Check, Linkedin, Github, Twitter, Instagram, Globe, Calendar, Link, Edit2, Save, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import ImportPicker from '@/components/onboarding/ImportPicker';
import { InteractiveQuiz } from '../components/InteractiveQuiz';
import type { QuizData, GeneratedPortfolioData } from '@/lib/railway-api';

interface OnboardingData {
  fullName: string;
  heading: string;
  tagline: string;
  taglineSuggestions: string[];
  whoAreYou: string;
  email: string;
  phone: string;
  profileImage: string | null;
  resume: string | null; // Resume URL after upload
  resumeFileName: string | null; // Original filename
  resumeFile: File | null; // Store file to upload during signup
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    icon: string;
  }>;
  careerHighlights: Array<{
    id: string;
    organization: string;
    role: string;
    description?: string;
    achievements: string[];
    responsibilities?: string[];
    key_achievements?: string[];
    impacts?: any; // Structured impacts from backend
    // Company grouping metadata
    companyGroup?: string;
    companyOccurrence?: number;
    sameCompanyCount?: number;
    hasMultipleRolesAtCompany?: boolean;
    sameCompanyRoles?: string[];
    companyTenure?: any;
    startDate?: string;
    endDate?: string;
    current?: boolean;
  }>;
  source: 'resume' | 'manual';
}

const AVAILABLE_PLATFORMS = [
  { platform: 'LinkedIn', icon: 'linkedin' },
  { platform: 'GitHub', icon: 'github' },
  { platform: 'Twitter', icon: 'twitter' },
  { platform: 'Instagram', icon: 'instagram' },
  { platform: 'Website', icon: 'globe' },
  { platform: 'Schedule a Call', icon: 'calendar' },
  { platform: 'Other', icon: 'link' },
];

export default function OnboardingFlowPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeFocusSection, setActiveFocusSection] = useState<'heading' | 'tagline' | 'about' | 'career' | 'links' | 'contact' | 'image' | null>(null);

  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    heading: '',
    tagline: '',
    taglineSuggestions: [],
    whoAreYou: '',
    email: '',
    phone: '',
    profileImage: null,
    resume: null,
    resumeFileName: null,
    resumeFile: null,
    socialLinks: [],
    careerHighlights: [],
    source: 'manual',
  });

  // Helper function to get icon component
  const getIcon = (iconName: string) => {
    const className = "w-4 h-4";
    switch (iconName) {
      case 'linkedin': return <Linkedin className={className} />;
      case 'github': return <Github className={className} />;
      case 'twitter': return <Twitter className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'globe': return <Globe className={className} />;
      case 'calendar': return <Calendar className={className} />;
      case 'link': return <Link className={className} />;
      default: return <Globe className={className} />;
    }
  };

  // For link addition
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkPlatform, setNewLinkPlatform] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [customPlatformName, setCustomPlatformName] = useState('');

  // For signup step
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // For career editing
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
  const [isAddingCareer, setIsAddingCareer] = useState(false);
  const [newCareer, setNewCareer] = useState({
    role: '',
    organization: '',
    achievements: [''],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSteps = 9;

  // Step 1: Name Input
  const handleNameSubmit = () => {
    if (!data.fullName.trim()) return;
    track({ kind: 'onboarding_started', payload: {} });
    setCurrentStep(2);
  };

  // Step 2: Resume Upload or Skip
  const handleResumeUpload = async (file: File) => {
    setIsProcessing(true);
    track({ 
      kind: 'import_resume_started', 
      payload: { fileSize: file.size, fileType: file.type } 
    });

    try {
      // Store the resume file to upload later during signup
      if (process.env.NODE_ENV === 'development') {
        console.log('[Onboarding] Processing resume file');
      }
      
      const { data: parsed, error: parseError } = await parseResume(file);
      
      if (parseError || !parsed) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Resume parse failed, using mock data');
        }
        
        // Mock data fallback - with resume file stored
        const mockData = {
          fullName: data.fullName,
          heading: `Hi, I'm ${data.fullName} — Product Designer`,
          profession: 'Product Designer',
          taglineSuggestions: [
            'Product Designer who ships fast. Previously at Google.',
            'Designer focused on impact. Ex-Google.',
            'Building great products at Google.',
          ],
          whoAreYou: "I'm a Product Designer who builds products that balance core value and growth.",
          email: 'john@example.com',
          phone: '+1 234 567 8900',
        };

      setData(prev => ({
        ...prev,
        heading: mockData.heading,
        taglineSuggestions: mockData.taglineSuggestions,
        tagline: mockData.taglineSuggestions[0],
        whoAreYou: mockData.whoAreYou,
        email: mockData.email,
        phone: mockData.phone,
        resumeFile: file, // Store file to upload during signup
        resumeFileName: file.name,
        careerHighlights: [
          {
            id: crypto.randomUUID(),
            organization: 'Google',
            role: 'Senior Product Designer',
            description: '',
            achievements: [
              'Led design for Google Maps mobile app',
              'Shipped 15+ features improving engagement by 32%',
            ],
            startDate: 'Jan 2020',
            endDate: 'Present',
            current: true,
          }
        ],
        source: 'resume',
      }));

        setIsProcessing(false);
        setCurrentStep(3);
        return;
      }

      // Real data from backend
      const companies = parsed.companies?.split(',').map(c => c.trim()).filter(Boolean) || [];
      
      const { data: taglineData } = await generateTaglines({
        name: parsed.fullName || data.fullName,
        role: parsed.profession || 'Professional',
        companies: companies
      });

      const { data: aboutData } = await generateAbout({
        name: parsed.fullName || data.fullName,
        role: parsed.profession || 'Professional',
        companies: companies
      });

      const taglines = taglineData?.taglines || [
        `${parsed.profession} who ships fast`,
        `${parsed.profession} focused on impact`,
        `Building great products`
      ];

      const whoAreYou = (aboutData as any)?.whoAreYou || parsed.whoAreYou || `I'm a ${parsed.profession} who builds impactful products.`;

      setData(prev => ({
        ...prev,
        heading: parsed.heading || `Hi, I'm ${parsed.fullName} — ${parsed.profession}`,
        taglineSuggestions: taglines,
        tagline: taglines[0],
        whoAreYou: whoAreYou,
        email: parsed.email || '',
        phone: parsed.phone || '',
        resumeFile: file, // Store file to upload during signup
        resumeFileName: file.name,
        socialLinks: (parsed.socialLinks || []).map((link: any) => ({
          ...link,
          id: link.id || crypto.randomUUID()
        })),
        careerHighlights: (parsed.careerHighlights || []).map((h: any) => ({
          id: h.id || crypto.randomUUID(),
          organization: h.organization,
          role: h.role,
          description: h.description || '',
          achievements: h.achievements || [],
          responsibilities: h.responsibilities || undefined,
          key_achievements: h.key_achievements || undefined,
          impacts: h.impacts || undefined, // Structured impacts from backend
          // Company grouping metadata
          companyGroup: h.companyGroup,
          companyOccurrence: h.companyOccurrence,
          sameCompanyCount: h.sameCompanyCount,
          hasMultipleRolesAtCompany: h.hasMultipleRolesAtCompany,
          sameCompanyRoles: h.sameCompanyRoles,
          companyTenure: h.companyTenure,
          startDate: h.startDate,
          endDate: h.endDate,
          current: h.current || false,
        })),
        source: 'resume',
      }));

      setIsProcessing(false);
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Resume parsing error');
      alert('That did not work. Sorry about that. Try again or start from scratch');
      setIsProcessing(false);
    }
  };

  const handleSkip = async () => {
    // Show interactive quiz instead of generic flow
    setShowQuiz(true);
  };

  const handleQuizComplete = async (quizData: QuizData) => {
    setIsProcessing(true);
    
    try {
      // Import the quiz generation function
      const { generateFromQuiz } = await import('@/lib/railway-api');
      
      // Generate portfolio data from quiz
      const { data: generatedData, error } = await generateFromQuiz(data.fullName, quizData);
      
      if (error || !generatedData) {
        throw new Error('Failed to generate portfolio data from quiz');
      }

      // Update onboarding data with AI-generated content
      setData(prev => ({
        ...prev,
        heading: generatedData.heading,
        tagline: generatedData.tagline,
        taglineSuggestions: generatedData.taglineSuggestions,
        whoAreYou: generatedData.whoAreYou,
        careerHighlights: generatedData.careerHighlights.map(h => ({
          ...h,
          id: h.id || crypto.randomUUID()
        })),
        source: 'manual',
      }));

      setIsProcessing(false);
      setShowQuiz(false);
      setCurrentStep(3); // Move to heading step with AI-generated content
    } catch (error) {
      console.error('Quiz generation error');
      
      // Fallback to generic data
      const { data: taglineData } = await generateTaglines({
        name: data.fullName,
        role: quizData.role || 'Professional',
        companies: []
      });

      setData(prev => ({
        ...prev,
        heading: `Hi, I'm ${prev.fullName} — ${quizData.role}`,
        taglineSuggestions: taglineData?.taglines || [
          'Product Manager who ships fast',
          'Designer focused on usable products',
          'Engineer who turns ideas into systems'
        ],
        source: 'manual',
      }));
      
      setIsProcessing(false);
      setShowQuiz(false);
      setCurrentStep(3);
    }
  };

  const handleQuizBack = () => {
    setShowQuiz(false);
  };

  // Step 3: Choose Heading
  const handleHeadingNext = () => {
    if (!data.heading.trim()) {
      setData(prev => ({ ...prev, heading: `Hi, I'm ${prev.fullName}` }));
    }
    setActiveFocusSection(null);
    setCurrentStep(4);
  };

  // Step 4: Select Tagline
  const handleTaglineNext = () => {
    setActiveFocusSection(null);
    setCurrentStep(5);
  };

  // Step 5: About Section
  const handleAboutNext = () => {
    setActiveFocusSection(null);
    setCurrentStep(6);
  };

  // Step 6: Career Highlights
  const handleCareerNext = () => {
    setActiveFocusSection(null);
    setCurrentStep(7);
  };

  const handleDeleteCareer = (id: string) => {
    setData(prev => ({
      ...prev,
      careerHighlights: prev.careerHighlights.filter(h => h.id !== id)
    }));
  };

  const handleUpdateCareer = (id: string, updates: Partial<OnboardingData['careerHighlights'][0]>) => {
    setData(prev => ({
      ...prev,
      careerHighlights: prev.careerHighlights.map(h => 
        h.id === id ? { ...h, ...updates } : h
      )
    }));
  };

  const handleAddCareer = () => {
    if (!newCareer.role.trim() || !newCareer.organization.trim()) return;

    // Filter out empty achievements
    const validAchievements = newCareer.achievements.filter(a => a.trim() !== '');

    setData(prev => ({
      ...prev,
      careerHighlights: [
        ...prev.careerHighlights,
        {
          id: crypto.randomUUID(),
          organization: newCareer.organization,
          role: newCareer.role,
          description: '',
          achievements: validAchievements,
          current: false,
        }
      ]
    }));

    setNewCareer({ role: '', organization: '', achievements: [''] });
    setIsAddingCareer(false);
  };

  const handleAddAchievement = () => {
    setNewCareer(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const handleUpdateAchievement = (index: number, value: string) => {
    setNewCareer(prev => ({
      ...prev,
      achievements: prev.achievements.map((a, i) => i === index ? value : a)
    }));
  };

  const handleRemoveAchievement = (index: number) => {
    setNewCareer(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Achievement editing for existing career highlights
  const handleAddExistingAchievement = (careerId: string) => {
    setData(prev => ({
      ...prev,
      careerHighlights: prev.careerHighlights.map(h =>
        h.id === careerId
          ? { ...h, achievements: [...(h.achievements || []), ''] }
          : h
      )
    }));
  };

  const handleUpdateExistingAchievement = (careerId: string, index: number, value: string) => {
    setData(prev => ({
      ...prev,
      careerHighlights: prev.careerHighlights.map(h =>
        h.id === careerId
          ? {
              ...h,
              achievements: h.achievements?.map((a, i) => i === index ? value : a) || []
            }
          : h
      )
    }));
  };

  const handleRemoveExistingAchievement = (careerId: string, index: number) => {
    setData(prev => ({
      ...prev,
      careerHighlights: prev.careerHighlights.map(h =>
        h.id === careerId
          ? {
              ...h,
              achievements: h.achievements?.filter((_, i) => i !== index) || []
            }
          : h
      )
    }));
  };

  // Step 7: Social Links
  const handleAddLink = () => {
    if (newLinkUrl.trim()) {
      setData(prev => ({
        ...prev,
        socialLinks: [
          ...prev.socialLinks,
          {
            id: crypto.randomUUID(),
            platform: newLinkPlatform,
            url: newLinkUrl.trim(),
            icon: newLinkIcon,
          }
        ]
      }));
      setIsAddingLink(false);
      setNewLinkPlatform('');
      setNewLinkIcon('');
      setNewLinkUrl('');
    }
  };

  const handleDeleteLink = (id: string) => {
    setData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const handleLinksNext = () => {
    setActiveFocusSection(null);
    setCurrentStep(8);
  };

  // Step 8: Profile Picture
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('That file type is not supported. Upload an image file');
      event.target.value = ''; // Reset input
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large. Max 5 MB');
      event.target.value = ''; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setData(prev => ({ ...prev, profileImage: reader.result as string }));
      event.target.value = ''; // Reset input for next upload
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setData(prev => ({ ...prev, profileImage: null }));
  };

  const handlePictureNext = () => {
    setActiveFocusSection(null);
    setCurrentStep(9);
  };

  // For signup processing
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Async resume upload (happens in background after user is redirected to editor)
  const uploadResumeAsync = async (userId: string, resumeFile: File) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Background] Uploading resume file');
      }
      
      const { uploadFile } = await import('@/lib/storage');
      const { supabase } = await import('@/lib/supabase');
      
      const uploadResult = await uploadFile({
        userId: userId,
        file: resumeFile,
        type: 'resume',
        isPublic: true,
      });

      if (uploadResult.error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Background] Resume upload failed:', uploadResult.error);
        }
        return;
      }

      // Update profile with resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: uploadResult.publicUrl })
        .eq('id', userId);

      if (updateError) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Background] Failed to update resume URL:', updateError);
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Background] Resume uploaded successfully');
        }
        
        // Update localStorage so editor has the resume URL
        const cached = localStorage.getItem('portfolioData');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            parsed.resume = uploadResult.publicUrl;
            localStorage.setItem('portfolioData', JSON.stringify(parsed));
          } catch (e) {
            // Ignore
          }
        }
      }
    } catch (err) {
      // Silently fail - this is background operation
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Background] Resume upload exception:', err);
      }
    }
  };

  // Step 10: Signup
  const handleSignup = async () => {
    if (!signupEmail.trim() || !signupPassword.trim()) {
      setSignupError('Email and password required');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password too short. At least 6 characters required');
      return;
    }

    setIsSigningUp(true);
    setSignupError('');

    try {
      const { supabase } = await import('@/lib/supabase');
      const { saveCompletePortfolio } = await import('@/lib/database');

      // 1. Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // Ensure we have a valid session before proceeding
      if (!authData.session) {
        throw new Error('No session created. Please try signing in instead.');
      }

      track({
        kind: 'signup_completed',
        payload: { source: data.source } as any
      });

      // BATCH SAVE: Save complete portfolio data immediately (no resume upload blocking)
      // Resume will be uploaded asynchronously in the background
      if (process.env.NODE_ENV === 'development') {
        console.log('[Signup] Batch saving portfolio to Supabase');
      }
      
      // Extract profession from first career highlight role if available
      const profession = data.careerHighlights && data.careerHighlights.length > 0 
        ? data.careerHighlights[0].role 
        : 'Professional';
      
      // Extract company names from career highlights for slider
      const companies = data.careerHighlights && data.careerHighlights.length > 0
        ? data.careerHighlights.map(h => h.organization).join(', ')
        : '';
      
      // Combine email/phone with social links
      // Filter out Email/Phone from socialLinks to avoid duplicates (case-insensitive)
      const socialLinksWithoutEmailPhone = data.socialLinks.filter(
        link => link.platform && link.platform.toLowerCase() !== 'email' && link.platform.toLowerCase() !== 'phone'
      );
      
      const allSocialLinks = [
        ...(data.email ? [{
          id: crypto.randomUUID(),
          platform: 'Email',
          url: data.email,
          icon: 'mail'
        }] : []),
        ...(data.phone ? [{
          id: crypto.randomUUID(),
          platform: 'Phone',
          url: data.phone,
          icon: 'phone'
        }] : []),
        ...socialLinksWithoutEmailPhone,
      ];
      
      const portfolioToSave = {
        ...data,
        fullName: data.fullName,
        heading: data.heading,
        profession: profession,
        tagline: data.tagline,
        whoAreYou: data.whoAreYou,
        email: data.email,
        phone: data.phone,
        companies: companies,
        sliderCompanies: companies,
        profileImage: data.profileImage,
        resume: null, // Will be updated async
        resumeFileName: data.resumeFile?.name || null,
        socialLinks: allSocialLinks,
        careerHighlights: data.careerHighlights,
      };
      
      const { error: saveError } = await saveCompletePortfolio(authData.user.id, portfolioToSave);
      
      if (saveError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Signup] Failed to save portfolio:', saveError);
        }
        throw new Error('Failed to save your portfolio data. Please try again.');
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Signup] Portfolio saved successfully');
      }

      // Set auth flags
      localStorage.setItem('freshAuth', 'true');
      localStorage.setItem('bypassDashboard', 'true');
      
      track({
        kind: 'onboarding_flow_completed',
        payload: {
          hasData: true,
          source: data.source
        }
      } as any);

      // Navigate to editor immediately - don't wait for resume upload
      router.push('/editor');

      // ASYNC: Upload resume in background after user is redirected
      if (data.resumeFile) {
        // Fire and forget - don't await
        uploadResumeAsync(authData.user.id, data.resumeFile);
      }

    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Signup error:', err);
      }
      setSignupError(err.message || 'That did not work. Sorry about that. Try again or contact support');
      setIsSigningUp(false);
    }
  };

  if (!mounted) return null;

  // Show quiz if user skipped resume upload
  if (showQuiz) {
    return (
      <InteractiveQuiz
        userName={data.fullName}
        onComplete={handleQuizComplete}
        onBack={handleQuizBack}
      />
    );
  }

  // Combine email/phone with social links for preview
  // Filter out Email/Phone from socialLinks to avoid duplicates (case-insensitive)
  const socialLinksWithoutEmailPhone = data.socialLinks.filter(
    link => link.platform && link.platform.toLowerCase() !== 'email' && link.platform.toLowerCase() !== 'phone'
  );
  
  const allLinks = [
    ...(data.email ? [{
      id: 'email-link',
      platform: 'Email',
      url: data.email,
      icon: 'mail'
    }] : []),
    ...(data.phone ? [{
      id: 'phone-link',
      platform: 'Phone',
      url: data.phone,
      icon: 'phone'
    }] : []),
    ...socialLinksWithoutEmailPhone,
  ];

  const previewData = {
    heading: data.heading,
    tagline: data.tagline,
    whoAreYou: data.whoAreYou,
    profileImage: data.profileImage,
    socialLinks: allLinks,
    careerHighlights: data.careerHighlights,
    email: data.email,
    phone: data.phone,
  };

  // Step 1: Name
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <div className="flex items-center gap-2 justify-center mb-6">
              <img src="/icon.svg" alt="BuildSpace" className="h-8" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-4">
              Build Your Story
            </p>
            <p className="text-base text-gray-800">
              Let us start with your name
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => setData(prev => ({ ...prev, fullName: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Enter your name"
                className="onboarding-input"
                style={{ color: '#111111' }}
                autoFocus
                required
              />
            </div>

            <button
              onClick={handleNameSubmit}
              disabled={!data.fullName.trim()}
              className="btn-primary w-full"
              style={{ color: '#111111' }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Work History Upload
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              Hi {data.fullName}
            </p>
            <p className="text-base text-gray-800">
              Upload your work history to auto-fill, or start from scratch
            </p>
          </div>

          <ImportPicker
            onResumeUpload={handleResumeUpload}
            onSkip={handleSkip}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    );
  }

  // Step 3: Choose Heading
  if (currentStep === 3) {
    return (
      <OnboardingLayout
        currentStep={3}
        totalSteps={totalSteps}
        onNext={handleHeadingNext}
        onBack={() => setCurrentStep(2)}
        nextLabel="Continue"
        nextDisabled={!data.heading.trim()}
        preview={<PortfolioPreview data={previewData} focusSection={activeFocusSection || "heading"} />}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Heading</h2>
            <p className="text-base text-gray-800">
              Main headline for your portfolio
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Heading
            </label>
              <input
                type="text"
                value={data.heading}
                onChange={(e) => setData(prev => ({ ...prev, heading: e.target.value }))}
                onFocus={() => setActiveFocusSection('heading')}
                placeholder={`Hi, I am ${data.fullName}`}
                className="onboarding-input"
                style={{ color: '#111111' }}
              />
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  // Step 4: Select Tagline
  if (currentStep === 4) {
    return (
      <OnboardingLayout
        currentStep={4}
        totalSteps={totalSteps}
        onNext={handleTaglineNext}
        onBack={() => setCurrentStep(3)}
        nextLabel="Continue"
        preview={<PortfolioPreview data={previewData} focusSection={activeFocusSection || "tagline"} />}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tagline</h2>
            <p className="text-base text-gray-800">
              Short description of what you do
            </p>
          </div>

          {data.taglineSuggestions.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Suggestions
              </label>
              <div className="space-y-2">
                {data.taglineSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setData(prev => ({ ...prev, tagline: suggestion }));
                      setActiveFocusSection('tagline');
                    }}
                    onFocus={() => setActiveFocusSection('tagline')}
                    className={`w-full text-left px-4 py-3 border-2 text-sm transition-colors rounded-xl font-medium ${
                      data.tagline === suggestion
                        ? 'border-emerald-500 bg-emerald-50 text-gray-900'
                        : 'border-gray-200 hover:border-gray-400 text-gray-900'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Custom
            </label>
              <textarea
                value={data.tagline}
                onChange={(e) => setData(prev => ({ ...prev, tagline: e.target.value }))}
                onFocus={() => setActiveFocusSection('tagline')}
                placeholder="Write your own tagline"
                rows={3}
                className="onboarding-textarea"
                style={{ color: '#111111' }}
              />
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  // Step 5: About Section
  if (currentStep === 5) {
    return (
      <OnboardingLayout
        currentStep={5}
        totalSteps={totalSteps}
        onNext={handleAboutNext}
        onBack={() => setCurrentStep(4)}
        nextLabel="Continue"
        preview={<PortfolioPreview data={previewData} focusSection={activeFocusSection || "about"} />}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">About</h2>
            <p className="text-base text-gray-800">
              Tell more about yourself <span className="text-gray-600 font-medium">(Optional)</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Your Story
            </label>
              <textarea
                value={data.whoAreYou}
                onChange={(e) => setData(prev => ({ ...prev, whoAreYou: e.target.value }))}
                onFocus={() => setActiveFocusSection('about')}
                placeholder="Share your background and what drives you"
                rows={10}
                className="onboarding-textarea"
                style={{ color: '#111111' }}
              />
          </div>

          <button
            onClick={handleAboutNext}
            className="text-gray-900 hover:text-emerald-600 font-medium transition-colors"
          >
            skip for now
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // Step 6: Career Highlights
  if (currentStep === 6) {
    return (
      <OnboardingLayout
        currentStep={6}
        totalSteps={totalSteps}
        onNext={handleCareerNext}
        onBack={() => setCurrentStep(5)}
        nextLabel="Continue"
        preview={<PortfolioPreview data={previewData} focusSection={activeFocusSection || "career"} />}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Career Highlights</h2>
            <p className="text-base text-gray-800">
              Your work experience <span className="text-gray-600 font-medium">(Optional)</span>
            </p>
          </div>

          {/* Career Highlights List */}
          {data.careerHighlights.length > 0 && (
            <div className="space-y-4">
              {data.careerHighlights.map((highlight) => {
                const isEditing = editingCareerId === highlight.id;
                
                return (
                  <div key={highlight.id} className="border border-gray-200 p-4 space-y-3">
                    {isEditing ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            Role
                          </label>
                            <input
                              type="text"
                              value={highlight.role}
                              onChange={(e) => handleUpdateCareer(highlight.id, { role: e.target.value })}
                              onFocus={() => setActiveFocusSection('career')}
                              placeholder="Senior Product Designer"
                              className="onboarding-input"
                              style={{ color: '#111111' }}
                            />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            Company
                          </label>
                            <input
                              type="text"
                              value={highlight.organization}
                              onChange={(e) => handleUpdateCareer(highlight.id, { organization: e.target.value })}
                              onFocus={() => setActiveFocusSection('career')}
                              placeholder="Google"
                              className="onboarding-input"
                              style={{ color: '#111111' }}
                            />
                        </div>

                        {highlight.startDate && (
                          <p className="text-xs text-gray-400">
                            {highlight.startDate} - {highlight.current ? 'Present' : highlight.endDate}
                          </p>
                        )}

                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            Achievements
                          </label>
                          <div className="space-y-2">
                            {(highlight.achievements && highlight.achievements.length > 0) ? (
                              highlight.achievements.map((achievement, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={achievement}
                                      onChange={(e) => handleUpdateExistingAchievement(highlight.id, idx, e.target.value)}
                                      onFocus={() => setActiveFocusSection('career')}
                                      placeholder={`Achievement ${idx + 1}`}
                                      className="onboarding-input flex-1"
                                      style={{ color: '#111111' }}
                                    />
                                  <button
                                    onClick={() => handleRemoveExistingAchievement(highlight.id, idx)}
                                    className="px-3 text-gray-600 hover:text-red-600 transition-colors"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-700 italic">No achievements added</p>
                            )}
                            <button
                              onClick={() => handleAddExistingAchievement(highlight.id)}
                              className="text-sm text-gray-900 hover:text-emerald-600 flex items-center gap-1 font-medium"
                            >
                              <Plus className="w-4 h-4" />
                              Add Achievement
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => {
                              // Clean up empty achievements before saving
                              const validAchievements = highlight.achievements?.filter(a => a.trim() !== '') || [];
                              handleUpdateCareer(highlight.id, { achievements: validAchievements });
                              setEditingCareerId(null);
                            }}
                            className="btn-primary flex-1"
                            style={{ color: '#111111' }}
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => handleDeleteCareer(highlight.id)}
                            className="px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 hover:border-red-500 hover:text-red-600 rounded-full font-semibold transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-base font-bold text-gray-900">{highlight.role}</h3>
                          <p className="text-sm text-gray-800">{highlight.organization}</p>
                          {highlight.startDate && (
                            <p className="text-sm text-gray-700">
                              {highlight.startDate} - {highlight.current ? 'Present' : highlight.endDate}
                            </p>
                          )}
                          {highlight.achievements && highlight.achievements.length > 0 && (
                            <div className="mt-2">
                              <ul className="space-y-1">
                                {highlight.achievements.slice(0, 3).map((achievement, idx) => (
                                  <li key={idx} className="text-sm text-gray-800 pl-3 relative before:content-['•'] before:absolute before:left-0">
                                    {achievement}
                                  </li>
                                ))}
                                {highlight.achievements.length > 3 && (
                                  <li className="text-sm text-gray-700 italic pl-3">
                                    +{highlight.achievements.length - 3} more
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => setEditingCareerId(highlight.id)}
                          className="text-gray-600 hover:text-emerald-600 flex-shrink-0 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add New Career Highlight */}
          {isAddingCareer ? (
            <div className="border-2 border-emerald-500 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Role <span className="text-red-600">*</span>
                </label>
                  <input
                    type="text"
                    value={newCareer.role}
                    onChange={(e) => setNewCareer(prev => ({ ...prev, role: e.target.value }))}
                    onFocus={() => setActiveFocusSection('career')}
                    placeholder="Product Manager"
                    className="onboarding-input"
                    style={{ color: '#111111' }}
                    autoFocus
                    required
                  />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Company <span className="text-red-600">*</span>
                </label>
                  <input
                    type="text"
                    value={newCareer.organization}
                    onChange={(e) => setNewCareer(prev => ({ ...prev, organization: e.target.value }))}
                    onFocus={() => setActiveFocusSection('career')}
                    placeholder="Apple"
                    className="onboarding-input"
                    style={{ color: '#111111' }}
                    required
                  />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Achievements <span className="text-gray-600 font-medium">(Optional)</span>
                </label>
                <div className="space-y-2">
                  {newCareer.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => handleUpdateAchievement(index, e.target.value)}
                          onFocus={() => setActiveFocusSection('career')}
                          placeholder={`Achievement ${index + 1}`}
                          className="onboarding-input flex-1"
                          style={{ color: '#111111' }}
                        />
                      {newCareer.achievements.length > 1 && (
                        <button
                          onClick={() => handleRemoveAchievement(index)}
                          className="px-3 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddAchievement}
                    className="text-sm text-gray-900 hover:text-emerald-600 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Achievement
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsAddingCareer(false);
                    setNewCareer({ role: '', organization: '', achievements: [''] });
                  }}
                  className="btn-secondary flex-1"
                  style={{ color: '#111111' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCareer}
                  disabled={!newCareer.role.trim() || !newCareer.organization.trim()}
                  className="btn-primary flex-1"
                  style={{ color: '#111111' }}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCareer(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-sm text-gray-900 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Career Highlight
            </button>
          )}

          <button
            onClick={handleCareerNext}
            className="text-gray-900 hover:text-emerald-600 font-medium transition-colors"
          >
            skip for now
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // Step 7: Social Links + Contact
  if (currentStep === 7) {
    const availablePlatforms = AVAILABLE_PLATFORMS.filter(
      ({ platform }) => !data.socialLinks.some(link => link.platform === platform)
    );

    return (
      <OnboardingLayout
        currentStep={7}
        totalSteps={totalSteps}
        onNext={handleLinksNext}
        onBack={() => setCurrentStep(6)}
        nextLabel="Continue"
        preview={<PortfolioPreview data={previewData} focusSection={activeFocusSection || "links"} />}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Links and Contact</h2>
            <p className="text-base text-gray-800">
              Add your contact info and social profiles
            </p>
          </div>

          {/* Email & Phone */}
          <div className="space-y-4 pb-6 border-b border-gray-100">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                  onFocus={() => setActiveFocusSection('contact')}
                  placeholder="you@example.com"
                  className="onboarding-input"
                  style={{ color: '#111111' }}
                />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number <span className="text-gray-600 font-medium">(Optional)</span>
              </label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData(prev => ({ ...prev, phone: e.target.value }))}
                  onFocus={() => setActiveFocusSection('contact')}
                  placeholder="+1 (555) 000-0000"
                  className="onboarding-input"
                  style={{ color: '#111111' }}
                />
            </div>
          </div>

          {/* Existing Links */}
          {data.socialLinks.length > 0 && (
            <div className="space-y-2">
              {data.socialLinks.map((link) => (
                <div key={link.id} className="border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 text-gray-700">
                      {getIcon(link.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{link.platform}</p>
                      <p className="text-sm text-gray-800 truncate">{link.url}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-gray-600 hover:text-red-600 flex-shrink-0 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Link */}
          {isAddingLink ? (
            <div className="border-2 border-emerald-500 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-emerald-600">
                  {getIcon(newLinkIcon)}
                </div>
                <p className="text-base font-bold text-gray-900">{newLinkPlatform}</p>
              </div>
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  onFocus={() => setActiveFocusSection('links')}
                  placeholder="https://"
                  autoFocus
                  className="onboarding-input"
                  style={{ color: '#111111' }}
                />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingLink(false)}
                  className="btn-secondary flex-1"
                  style={{ color: '#111111' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLink}
                  disabled={!newLinkUrl.trim()}
                  className="btn-primary flex-1"
                  style={{ color: '#111111' }}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <>
              {availablePlatforms.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Add Social Link
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePlatforms.map(({ platform, icon }) => (
                      <button
                        key={platform}
                        onClick={() => {
                          setNewLinkPlatform(platform);
                          setNewLinkIcon(icon);
                          setIsAddingLink(true);
                        }}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-900 border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors rounded-xl"
                      >
                        {getIcon(icon)}
                        <span>{platform}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <button
            onClick={handleLinksNext}
            className="text-gray-900 hover:text-emerald-600 font-medium transition-colors"
          >
            skip for now
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // Step 8: Profile Picture
  if (currentStep === 8) {
    return (
      <OnboardingLayout
        currentStep={8}
        totalSteps={totalSteps}
        onNext={handlePictureNext}
        onBack={() => setCurrentStep(7)}
        nextLabel="Continue"
        preview={<PortfolioPreview data={previewData} focusSection={activeFocusSection || "image"} />}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Picture</h2>
            <p className="text-base text-gray-800">
              Add a face to the name <span className="text-gray-600 font-medium">(Optional)</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200">
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-24 h-24 text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              {data.profileImage ? (
                <button
                  onClick={handleRemoveImage}
                  className="text-gray-900 hover:text-red-600 font-medium transition-colors"
                >
                  remove photo
                </button>
              ) : (
                <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-200 hover:border-emerald-500 rounded-xl text-gray-900 hover:text-emerald-600 font-medium cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  upload photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <button
            onClick={handlePictureNext}
            className="text-gray-900 hover:text-emerald-600 font-medium transition-colors"
          >
            skip for now
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // Step 9: Signup
  if (currentStep === 9) {
    return (
      <OnboardingLayout
        currentStep={9}
        totalSteps={totalSteps}
        onBack={() => setCurrentStep(8)}
        showNext={false}
        preview={<PortfolioPreview data={previewData} />}
      >
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-base text-gray-800">
              Save and publish your portfolio
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => {
                setSignupEmail(e.target.value);
                setSignupError('');
              }}
              placeholder="you@example.com"
              className="onboarding-input"
              style={{ color: '#111111' }}
              disabled={isSigningUp}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => {
                setSignupPassword(e.target.value);
                setSignupError('');
              }}
              placeholder="Minimum 6 characters"
              className="onboarding-input"
              style={{ color: '#111111' }}
              disabled={isSigningUp}
              required
            />
            {signupPassword.length > 0 && signupPassword.length < 6 && (
              <p className="mt-2 text-sm text-red-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                At least 6 characters required
              </p>
            )}
          </div>

          {signupError && (
            <div className="flex items-start gap-4 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
              <XCircle className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{signupError}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={!signupEmail.trim() || !signupPassword.trim() || signupPassword.length < 6 || isSigningUp}
            className="btn-primary w-full"
            style={{ color: '#111111' }}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account and Continue'
            )}
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  return null;
}

