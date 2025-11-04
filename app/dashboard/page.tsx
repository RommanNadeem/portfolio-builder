'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MonthYearPicker from './components/MonthYearPicker';
import EmojiPicker from './components/EmojiPicker';
import { 
  User, Mail, Phone, RefreshCw, ChevronDown, 
  Pencil, Briefcase, FileText, MessageSquare,
  GraduationCap, Award, Star, ArrowRight, 
  Linkedin, Calendar, ExternalLink, Github,
  Twitter, Instagram, Globe, Link as LinkIcon,
  Plus, Trash2, GripVertical, Eye
} from 'lucide-react';

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

interface Testimonial {
  id: string;
  name: string;
  title: string;
  testimonial: string;
  linkedinUrl: string;
}

interface CustomSection {
  id: string;
  title: string;
  icon: string;
  type: 'text' | 'textarea' | 'list' | 'cards' | 'grid';
  data: any;
  order: number;
}

interface PortfolioData {
  fullName: string;
  profession: string;
  email: string;
  phone: string;
  resume: string | null;
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

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<PortfolioData | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<string | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [newSectionData, setNewSectionData] = useState({
    title: '',
    icon: '',
    type: 'text' as 'text' | 'textarea' | 'list' | 'cards' | 'grid'
  });
  const [addingCareerHighlight, setAddingCareerHighlight] = useState(false);
  const [addingStrength, setAddingStrength] = useState(false);
  const [addingTestimonial, setAddingTestimonial] = useState(false);
  const [addingSocialLink, setAddingSocialLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newCareerHighlight, setNewCareerHighlight] = useState<CareerHighlight>({
    id: '',
    organization: '',
    role: '',
    description: '',
    link: '',
    achievements: '',
    startDate: '',
    endDate: '',
    current: false
  });
  const [newStrength, setNewStrength] = useState<Strength>({
    id: '',
    title: '',
    description: '',
    icon: ''
  });
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    id: '',
    name: '',
    title: '',
    testimonial: '',
    linkedinUrl: ''
  });
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    id: '',
    platform: '',
    url: '',
    icon: ''
  });

  useEffect(() => {
    // Get data from localStorage
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Ensure socialLinks exists for backwards compatibility
      if (!parsedData.socialLinks) {
        parsedData.socialLinks = [];
      }
      // Initialize sliderCompanies from companies if not exists (backwards compatibility)
      if (!parsedData.sliderCompanies && parsedData.companies) {
        parsedData.sliderCompanies = parsedData.companies;
      }
      if (!parsedData.sliderCompanies) {
        parsedData.sliderCompanies = '';
      }
      // Initialize careerHighlights
      if (!parsedData.careerHighlights) {
        parsedData.careerHighlights = [];
      }
      // Initialize strengths
      if (!parsedData.strengths) {
        parsedData.strengths = [];
      }
      // Initialize customSections
      if (!parsedData.customSections) {
        parsedData.customSections = [];
      }
      // Initialize testimonials
      if (!parsedData.testimonials) {
        parsedData.testimonials = [];
      }
      setData(parsedData);
    } else {
      // Redirect to onboarding if no data
      router.push('/onboarding');
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'links', label: 'Social Links', icon: LinkIcon },
    { id: 'companies', label: 'Companies Slider', icon: Star },
    { id: 'experience', label: 'Career Highlights', icon: Briefcase },
    { id: 'strengths', label: 'Strengths', icon: Award },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'about', label: 'About Me', icon: MessageSquare },
    { id: 'resume', label: 'Resume', icon: FileText },
    ...(data.customSections || []).map(section => ({
      id: `custom-${section.id}`,
      label: section.title,
      icon: () => <span className="text-lg">{section.icon}</span> as any,
      isCustom: true,
      customData: section
    }))
  ];

  const companyList = data.companies ? data.companies.split(',').map(c => c.trim()).filter(c => c) : [];
  const sliderCompanies = data.sliderCompanies ? data.sliderCompanies.split(',').map(c => c.trim()).filter(c => c) : [];
  const socialLinks = data.socialLinks || [];
  const careerHighlights = data.careerHighlights || [];
  const strengths = data.strengths || [];
  const testimonials = data.testimonials || [];

  const handleOpenEdit = (section: string) => {
    setEditingSection(section);
    const editableData = { ...data! };
    // Ensure arrays exist
    if (!editableData.socialLinks) {
      editableData.socialLinks = [];
    }
    if (!editableData.careerHighlights) {
      editableData.careerHighlights = [];
    }
    if (!editableData.strengths) {
      editableData.strengths = [];
    }
    if (!editableData.testimonials) {
      editableData.testimonials = [];
    }
    setEditData(editableData);
  };

  const availablePlatforms = [
    { platform: 'LinkedIn', icon: 'linkedin' },
    { platform: 'GitHub', icon: 'github' },
    { platform: 'Twitter', icon: 'twitter' },
    { platform: 'Instagram', icon: 'instagram' },
    { platform: 'Dribbble', icon: 'dribbble' },
    { platform: 'Behance', icon: 'behance' },
    { platform: 'Schedule a Call', icon: 'calendar' },
    { platform: 'Website', icon: 'globe' },
  ];

  const handleAddPlatform = (platform: string, icon: string) => {
    if (!editData) return;
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform,
      url: '',
      icon
    };
    setEditData({
      ...editData,
      socialLinks: [...(editData.socialLinks || []), newLink]
    });
  };

  const handleUpdateLink = (id: string, field: keyof SocialLink, value: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      socialLinks: (editData.socialLinks || []).map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    });
  };

  const handleRemoveLink = (id: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      socialLinks: (editData.socialLinks || []).filter(link => link.id !== id)
    });
  };

  const handleAddSliderCompany = (companyName: string) => {
    if (!editData || !companyName.trim()) return;
    const currentCompanies = editData.sliderCompanies ? editData.sliderCompanies.split(',').map(c => c.trim()).filter(c => c) : [];
    if (!currentCompanies.includes(companyName.trim())) {
      currentCompanies.push(companyName.trim());
      setEditData({
        ...editData,
        sliderCompanies: currentCompanies.join(', ')
      });
    }
  };

  const handleRemoveSliderCompany = (companyName: string) => {
    if (!editData) return;
    const currentCompanies = editData.sliderCompanies ? editData.sliderCompanies.split(',').map(c => c.trim()).filter(c => c) : [];
    const filtered = currentCompanies.filter(c => c !== companyName);
    setEditData({
      ...editData,
      sliderCompanies: filtered.join(', ')
    });
  };

  const handleAddCareerCompany = (companyName: string) => {
    if (!editData || !companyName.trim()) return;
    const currentCompanies = editData.companies ? editData.companies.split(',').map(c => c.trim()).filter(c => c) : [];
    if (!currentCompanies.includes(companyName.trim())) {
      currentCompanies.push(companyName.trim());
      setEditData({
        ...editData,
        companies: currentCompanies.join(', ')
      });
    }
  };

  const handleRemoveCareerCompany = (companyName: string) => {
    if (!editData) return;
    const currentCompanies = editData.companies ? editData.companies.split(',').map(c => c.trim()).filter(c => c) : [];
    const filtered = currentCompanies.filter(c => c !== companyName);
    setEditData({
      ...editData,
      companies: filtered.join(', ')
    });
  };

  const handleAddCareerHighlight = () => {
    if (!editData) return;
    const newHighlight: CareerHighlight = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      description: '',
      link: '',
      achievements: '',
      startDate: '',
      endDate: '',
      current: false
    };
    setEditData({
      ...editData,
      careerHighlights: [...(editData.careerHighlights || []), newHighlight]
    });
    setEditingHighlight(newHighlight.id);
  };

  const handleUpdateHighlight = (id: string, field: keyof CareerHighlight, value: any) => {
    if (!editData) return;
    setEditData({
      ...editData,
      careerHighlights: (editData.careerHighlights || []).map(h =>
        h.id === id ? { ...h, [field]: value } : h
      )
    });
  };

  const handleRemoveHighlight = (id: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      careerHighlights: (editData.careerHighlights || []).filter(h => h.id !== id)
    });
    if (editingHighlight === id) {
      setEditingHighlight(null);
    }
  };

  const handleMoveHighlight = (id: string, direction: 'up' | 'down') => {
    if (!editData) return;
    const highlights = [...(editData.careerHighlights || [])];
    const index = highlights.findIndex(h => h.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= highlights.length) return;
    
    [highlights[index], highlights[newIndex]] = [highlights[newIndex], highlights[index]];
    setEditData({
      ...editData,
      careerHighlights: highlights
    });
  };

  const handleAddStrength = () => {
    if (!editData) return;
    const newStrength: Strength = {
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: ''
    };
    setEditData({
      ...editData,
      strengths: [...(editData.strengths || []), newStrength]
    });
  };

  const handleUpdateStrength = (id: string, field: keyof Strength, value: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      strengths: (editData.strengths || []).map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    });
  };

  const handleRemoveStrength = (id: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      strengths: (editData.strengths || []).filter(s => s.id !== id)
    });
  };

  const handleAddCustomSection = () => {
    if (!newSectionData.title || !newSectionData.type) return;
    
    let initialData;
    switch (newSectionData.type) {
      case 'text':
        initialData = '';
        break;
      case 'textarea':
        initialData = '';
        break;
      case 'list':
        initialData = [];
        break;
      case 'cards':
      case 'grid':
        initialData = [];
        break;
      default:
        initialData = '';
    }

    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: newSectionData.title,
      icon: newSectionData.icon || '📝',
      type: newSectionData.type,
      data: initialData,
      order: (data?.customSections || []).length
    };

    if (data) {
      const updatedData = {
        ...data,
        customSections: [...(data.customSections || []), newSection]
      };
      setData(updatedData);
      localStorage.setItem('portfolioData', JSON.stringify(updatedData));
    }

    // Reset modal
    setNewSectionData({ title: '', icon: '', type: 'text' });
    setShowAddSectionModal(false);
  };

  const handleUpdateCustomSection = (id: string, newData: any) => {
    if (!editData) return;
    setEditData({
      ...editData,
      customSections: (editData.customSections || []).map(section =>
        section.id === id ? { ...section, data: newData } : section
      )
    });
  };

  const handleRemoveCustomSection = (id: string) => {
    if (!data) return;
    const updatedData = {
      ...data,
      customSections: (data.customSections || []).filter(s => s.id !== id)
    };
    setData(updatedData);
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
    setActiveSection(null);
  };

  const handleAddTestimonial = () => {
    if (!editData) return;
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: '',
      title: '',
      testimonial: '',
      linkedinUrl: ''
    };
    setEditData({
      ...editData,
      testimonials: [...(editData.testimonials || []), newTestimonial]
    });
  };

  const handleUpdateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      testimonials: (editData.testimonials || []).map(t =>
        t.id === id ? { ...t, [field]: value } : t
      )
    });
  };

  const handleRemoveTestimonial = (id: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      testimonials: (editData.testimonials || []).filter(t => t.id !== id)
    });
  };

  const handleSaveNewCareerHighlight = () => {
    const highlight: CareerHighlight = {
      ...newCareerHighlight,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      careerHighlights: [...(data?.careerHighlights || []), highlight]
    };
    setData(updatedData);
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
    setAddingCareerHighlight(false);
    setNewCareerHighlight({
      id: '',
      organization: '',
      role: '',
      description: '',
      link: '',
      achievements: '',
      startDate: '',
      endDate: '',
      current: false
    });
  };

  const handleDiscardNewCareerHighlight = () => {
    setAddingCareerHighlight(false);
    setNewCareerHighlight({
      id: '',
      organization: '',
      role: '',
      description: '',
      link: '',
      achievements: '',
      startDate: '',
      endDate: '',
      current: false
    });
  };

  const handleSaveNewStrength = () => {
    const strength: Strength = {
      ...newStrength,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      strengths: [...(data?.strengths || []), strength]
    };
    setData(updatedData);
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
    setAddingStrength(false);
    setNewStrength({
      id: '',
      title: '',
      description: '',
      icon: ''
    });
  };

  const handleDiscardNewStrength = () => {
    setAddingStrength(false);
    setNewStrength({
      id: '',
      title: '',
      description: '',
      icon: ''
    });
  };

  const handleSaveNewTestimonial = () => {
    const testimonial: Testimonial = {
      ...newTestimonial,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      testimonials: [...(data?.testimonials || []), testimonial]
    };
    setData(updatedData);
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
    setAddingTestimonial(false);
    setNewTestimonial({
      id: '',
      name: '',
      title: '',
      testimonial: '',
      linkedinUrl: ''
    });
  };

  const handleDiscardNewTestimonial = () => {
    setAddingTestimonial(false);
    setNewTestimonial({
      id: '',
      name: '',
      title: '',
      testimonial: '',
      linkedinUrl: ''
    });
  };

  const handleSaveNewSocialLink = () => {
    const link: SocialLink = {
      ...newSocialLink,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      socialLinks: [...(data?.socialLinks || []), link]
    };
    setData(updatedData);
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
    setAddingSocialLink(false);
    setNewSocialLink({
      id: '',
      platform: '',
      url: '',
      icon: ''
    });
  };

  const handleDiscardNewSocialLink = () => {
    setAddingSocialLink(false);
    setNewSocialLink({
      id: '',
      platform: '',
      url: '',
      icon: ''
    });
  };

  const handleSaveEdit = () => {
    if (editData) {
      setData(editData);
      localStorage.setItem('portfolioData', JSON.stringify(editData));
    }
    setEditingSection(null);
    setEditData(null);
    setEditingHighlight(null);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditData(null);
    setEditingHighlight(null);
  };

  const hasChanges = () => {
    if (!editData || !data) return false;
    return JSON.stringify(editData) !== JSON.stringify(data);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        const updatedData = { ...data, profileImage: imageData };
        setData(updatedData);
        localStorage.setItem('portfolioData', JSON.stringify(updatedData));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    const updatedData = { ...data, profileImage: null };
    setData(updatedData);
    localStorage.setItem('portfolioData', JSON.stringify(updatedData));
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Portfolio Builder</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Edit/Preview Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'edit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </div>
            </button>
          </div>

          {/* Desktop/Mobile Preview Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                previewMode === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Desktop Preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2"/>
                <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                previewMode === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Mobile Preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2"/>
                <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Management */}
        <div className={`w-[420px] bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 ${
          viewMode === 'preview' ? 'hidden lg:block' : 'block'
        }`}>
        {/* Header */}
        <div className="p-8 border-b border-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your content</p>
          </div>

          {/* Personal Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 relative group">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                  {data.profileImage ? (
                    <img 
                      src={data.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Pencil className="w-5 h-5 text-white" />
                  </label>
                </div>
                {data.profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 mb-3 truncate">
                  {data.fullName || 'Your Name'}
                </h2>
                <div className="space-y-2">
                  {data.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{data.email}</span>
                    </div>
                  )}
                  {data.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{data.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Sections */}
        <div className="p-6 pb-3">
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Section</span>
          </button>
        </div>

        <nav className="px-6 pb-6 space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => {
                  if (activeSection === item.id) {
                    setActiveSection(null);
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-left transition-all shadow-sm ${
                  activeSection === item.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeSection === item.id
                      ? 'bg-white/10'
                      : 'bg-gray-100'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      activeSection === item.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {(item as any).isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${item.label}"?`)) {
                          handleRemoveCustomSection((item as any).customData.id);
                        }
                      }}
                      className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                        activeSection === item.id
                          ? 'hover:bg-white/20 text-white'
                          : 'hover:bg-red-100 text-red-600'
                      }`}
                      title="Delete section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeSection === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Content */}
              {activeSection === item.id && (
                <div className="mt-3 mb-1 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 shadow-sm animate-fadeIn">
                  {/* Editing Mode */}
                  {editingSection === item.id ? (
                    <div className="space-y-4">
                      {item.id === 'personal' && editData && (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                              type="text"
                              value={editData.fullName}
                              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Profession</label>
                            <select
                              value={editData.profession}
                              onChange={(e) => setEditData({ ...editData, profession: e.target.value })}
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            >
                              <option value="">Select profession</option>
                              <option value="Product Manager">Product Manager</option>
                              <option value="Product Designer">Product Designer</option>
                              <option value="Software Engineer">Software Engineer</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Tagline</label>
                            <input
                              type="text"
                              value={editData.tagline}
                              onChange={(e) => setEditData({ ...editData, tagline: e.target.value })}
                              maxLength={100}
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">{100 - (editData.tagline?.length || 0)} characters left</p>
                          </div>
                        </>
                      )}
                      
                      {item.id === 'about' && editData && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">About Me</label>
                          <textarea
                            value={editData.whoAreYou}
                            onChange={(e) => setEditData({ ...editData, whoAreYou: e.target.value })}
                            rows={6}
                            className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                          />
                        </div>
                      )}
                      
                      {item.id === 'links' && editData && (
                        <div className="space-y-3">
                          {/* Added Links */}
                          {(editData.socialLinks || []).map((link) => (
                            <div key={link.id} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-gray-900">{link.platform}</span>
                                <button
                                  onClick={() => handleRemoveLink(link.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="url"
                                value={link.url}
                                onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
                              />
                            </div>
                          ))}
                          
                          {/* Available Platforms to Add */}
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">Add Platform</p>
                            <div className="grid grid-cols-2 gap-2">
                              {availablePlatforms
                                .filter(p => !(editData.socialLinks || []).some(l => l.platform === p.platform))
                                .map((platform) => {
                                  const IconComp = 
                                    platform.icon === 'linkedin' ? Linkedin :
                                    platform.icon === 'github' ? Github :
                                    platform.icon === 'twitter' ? Twitter :
                                    platform.icon === 'instagram' ? Instagram :
                                    platform.icon === 'calendar' ? Calendar :
                                    Globe;
                                  
                                  return (
                                    <button
                                      key={platform.platform}
                                      onClick={() => handleAddPlatform(platform.platform, platform.icon)}
                                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                                    >
                                      <IconComp className="w-3.5 h-3.5" />
                                      <span className="truncate">{platform.platform}</span>
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {item.id === 'companies' && editData && (
                        <div className="space-y-3">
                          {/* Slider Company List */}
                          {(() => {
                            const companies = editData.sliderCompanies ? editData.sliderCompanies.split(',').map(c => c.trim()).filter(c => c) : [];
                            return (
                              <>
                                {companies.map((company, index) => (
                                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        {company.charAt(0)}
                                      </div>
                                      <span className="text-sm font-medium text-gray-900">{company}</span>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveSliderCompany(company)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </>
                            );
                          })()}
                          
                          {/* Add Company Input */}
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">Add Company to Slider</p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                id={`slider-company-input-${item.id}`}
                                placeholder="Company name"
                                className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const input = e.currentTarget as HTMLInputElement;
                                    handleAddSliderCompany(input.value);
                                    input.value = '';
                                  }
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  const input = document.getElementById(`slider-company-input-${item.id}`) as HTMLInputElement;
                                  if (input) {
                                    handleAddSliderCompany(input.value);
                                    input.value = '';
                                  }
                                }}
                                className="px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {item.id === 'experience' && editData && (
                        <div className="space-y-3">
                          {/* Career Highlights List */}
                          {(editData.careerHighlights || []).map((highlight, index) => (
                            <div key={highlight.id} className="bg-white border border-gray-200 rounded-lg p-3">
                              {editingHighlight === highlight.id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={highlight.organization}
                                    onChange={(e) => handleUpdateHighlight(highlight.id, 'organization', e.target.value)}
                                    placeholder="Organization/Project"
                                    className="w-full px-2 py-1.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                                  />
                                  <input
                                    type="text"
                                    value={highlight.role}
                                    onChange={(e) => handleUpdateHighlight(highlight.id, 'role', e.target.value)}
                                    placeholder="Role"
                                    className="w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                                  />
                                  <textarea
                                    value={highlight.description}
                                    onChange={(e) => handleUpdateHighlight(highlight.id, 'description', e.target.value)}
                                    placeholder="Short description"
                                    rows={2}
                                    className="w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                  />
                                  <input
                                    type="url"
                                    value={highlight.link}
                                    onChange={(e) => handleUpdateHighlight(highlight.id, 'link', e.target.value)}
                                    placeholder="Link (optional)"
                                    className="w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                                  />
                                  <textarea
                                    value={highlight.achievements}
                                    onChange={(e) => handleUpdateHighlight(highlight.id, 'achievements', e.target.value)}
                                    placeholder="Achievements/Responsibilities"
                                    rows={2}
                                    className="w-full px-2 py-1.5 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                                      <MonthYearPicker
                                        value={highlight.startDate}
                                        onChange={(value) => handleUpdateHighlight(highlight.id, 'startDate', value)}
                                        placeholder="Select month"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">End Date</label>
                                      <MonthYearPicker
                                        value={highlight.current || highlight.endDate === 'Present' ? 'Present' : highlight.endDate}
                                        onChange={(value) => handleUpdateHighlight(highlight.id, 'endDate', value)}
                                        placeholder={highlight.current || highlight.endDate === 'Present' ? 'Present' : 'Select month'}
                                        disabled={highlight.current || highlight.endDate === 'Present'}
                                      />
                                    </div>
                                  </div>
                                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                                    <input
                                      type="checkbox"
                                      checked={highlight.current || highlight.endDate === 'Present'}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        handleUpdateHighlight(highlight.id, 'current', isChecked);
                                        if (isChecked) {
                                          handleUpdateHighlight(highlight.id, 'endDate', 'Present');
                                        } else {
                                          handleUpdateHighlight(highlight.id, 'endDate', '');
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-2 border-gray-300 text-white focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 checked:bg-gray-900 checked:border-gray-900 cursor-pointer transition-colors"
                                    />
                                    Currently working here
                                  </label>
                                  <button
                                    onClick={() => setEditingHighlight(null)}
                                    className="w-full px-2 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800"
                                  >
                                    Done
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <div className="flex flex-col gap-1">
                                      <button
                                        onClick={() => handleMoveHighlight(highlight.id, 'up')}
                                        disabled={index === 0}
                                        className={`${index === 0 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                      >
                                        <ChevronDown className="w-3 h-3 rotate-180" />
                                      </button>
                                      <button
                                        onClick={() => handleMoveHighlight(highlight.id, 'down')}
                                        disabled={index === (editData.careerHighlights || []).length - 1}
                                        className={`${index === (editData.careerHighlights || []).length - 1 ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                      >
                                        <ChevronDown className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 truncate">{highlight.organization || 'Untitled'}</p>
                                      {highlight.role && <p className="text-xs text-gray-600">{highlight.role}</p>}
                                      {highlight.startDate && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          {highlight.startDate} - {highlight.current ? 'Present' : highlight.endDate || 'Present'}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => setEditingHighlight(highlight.id)}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleRemoveHighlight(highlight.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Add Highlight Button */}
                          <button
                            onClick={handleAddCareerHighlight}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Career Highlight</span>
                          </button>
                        </div>
                      )}
                      
                      {item.id === 'strengths' && editData && (
                        <div className="space-y-3">
                          {/* Strengths List */}
                          {(editData.strengths || []).map((strength) => (
                            <div key={strength.id} className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <EmojiPicker
                                    value={strength.icon}
                                    onChange={(emoji) => handleUpdateStrength(strength.id, 'icon', emoji)}
                                  />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <input
                                    type="text"
                                    value={strength.title}
                                    onChange={(e) => handleUpdateStrength(strength.id, 'title', e.target.value)}
                                    placeholder="Strength title"
                                    className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal"
                                  />
                                  <textarea
                                    value={strength.description}
                                    onChange={(e) => handleUpdateStrength(strength.id, 'description', e.target.value)}
                                    placeholder="Brief description"
                                    rows={3}
                                    className="w-full px-3 py-2 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none placeholder:text-gray-400"
                                  />
                                </div>
                                <button
                                  onClick={() => handleRemoveStrength(strength.id)}
                                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add Strength Button */}
                          <button
                            onClick={handleAddStrength}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Strength</span>
                          </button>
                        </div>
                      )}

                      {/* Testimonials Editing */}
                      {item.id === 'testimonials' && editData && (
                        <div className="space-y-3">
                          {/* Testimonials List */}
                          {(editData.testimonials || []).map((testimonial) => (
                            <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-700">Testimonial</span>
                                <button
                                  onClick={() => handleRemoveTestimonial(testimonial.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              
                              <input
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => handleUpdateTestimonial(testimonial.id, 'name', e.target.value)}
                                placeholder="Full Name (e.g., Phil Carter)"
                                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal"
                              />
                              
                              <input
                                type="text"
                                value={testimonial.title}
                                onChange={(e) => handleUpdateTestimonial(testimonial.id, 'title', e.target.value)}
                                placeholder="Title/Affiliation (e.g., CEO @ Company)"
                                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-400"
                              />
                              
                              <input
                                type="url"
                                value={testimonial.linkedinUrl}
                                onChange={(e) => handleUpdateTestimonial(testimonial.id, 'linkedinUrl', e.target.value)}
                                placeholder="LinkedIn URL (optional)"
                                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-400"
                              />
                              
                              <textarea
                                value={testimonial.testimonial}
                                onChange={(e) => handleUpdateTestimonial(testimonial.id, 'testimonial', e.target.value)}
                                placeholder="Testimonial text..."
                                rows={4}
                                className="w-full px-3 py-2 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none placeholder:text-gray-400"
                              />
                            </div>
                          ))}
                          
                          {/* Add Testimonial Button */}
                          <button
                            onClick={handleAddTestimonial}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Testimonial</span>
                          </button>
                        </div>
                      )}

                      {/* Custom Sections Editing */}
                      {item.id.startsWith('custom-') && editData && (() => {
                        const customSection = (item as any).customData as CustomSection;
                        const sectionData = editData.customSections?.find(s => s.id === customSection.id);
                        
                        if (!sectionData) return null;
                        
                        return (
                          <div className="space-y-3">
                            {sectionData.type === 'text' && (
                              <input
                                type="text"
                                value={sectionData.data || ''}
                                onChange={(e) => handleUpdateCustomSection(sectionData.id, e.target.value)}
                                placeholder={`Enter ${sectionData.title.toLowerCase()}...`}
                                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                              />
                            )}
                            
                            {sectionData.type === 'textarea' && (
                              <textarea
                                value={sectionData.data || ''}
                                onChange={(e) => handleUpdateCustomSection(sectionData.id, e.target.value)}
                                placeholder={`Enter ${sectionData.title.toLowerCase()}...`}
                                rows={5}
                                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                              />
                            )}
                            
                            {sectionData.type === 'list' && (
                              <div className="space-y-2">
                                {(sectionData.data as string[]).map((item: string, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => {
                                        const newList = [...sectionData.data];
                                        newList[idx] = e.target.value;
                                        handleUpdateCustomSection(sectionData.id, newList);
                                      }}
                                      className="flex-1 px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    />
                                    <button
                                      onClick={() => {
                                        const newList = sectionData.data.filter((_: any, i: number) => i !== idx);
                                        handleUpdateCustomSection(sectionData.id, newList);
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const newList = [...(sectionData.data || []), ''];
                                    handleUpdateCustomSection(sectionData.id, newList);
                                  }}
                                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Add Item</span>
                                </button>
                              </div>
                            )}
                            
                            <button
                              onClick={() => handleRemoveCustomSection(sectionData.id)}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Section</span>
                            </button>
                          </div>
                        );
                      })()}

                      {/* Save/Cancel Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={!hasChanges()}
                          className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                            hasChanges()
                              ? 'bg-gray-900 text-white hover:bg-gray-800'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Content Preview */}
                      <div className="mb-4">
                        {item.id === 'personal' && (
                          <div className="space-y-2">
                            {data.fullName && (
                              <p className="text-sm font-medium text-gray-900">{data.fullName}</p>
                            )}
                            {data.tagline && (
                              <p className="text-xs text-gray-600 italic">{data.tagline}</p>
                            )}
                          </div>
                        )}
                        
                        {item.id === 'links' && (
                          <div>
                            {(data.email || data.phone || socialLinks.filter(l => l.url && l.url.trim() !== '').length > 0) ? (
                              <div className="flex flex-wrap gap-1.5">
                                {/* Email Chip */}
                                {data.email && (
                                  <span className="inline-flex items-center gap-1.5 text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full">
                                    <Mail className="w-3 h-3" />
                                    Email
                                  </span>
                                )}
                                
                                {/* Phone Chip */}
                                {data.phone && (
                                  <span className="inline-flex items-center gap-1.5 text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full">
                                    <Phone className="w-3 h-3" />
                                    Phone
                                  </span>
                                )}
                                
                                {/* Social Links Chips */}
                                {socialLinks
                                  .filter(l => l.url && l.url.trim() !== '')
                                  .map((link) => {
                                    const IconComp = 
                                      link.icon === 'linkedin' ? Linkedin :
                                      link.icon === 'github' ? Github :
                                      link.icon === 'twitter' ? Twitter :
                                      link.icon === 'instagram' ? Instagram :
                                      link.icon === 'calendar' ? Calendar :
                                      Globe;
                                    
                                    return (
                                      <span key={link.id} className="inline-flex items-center gap-1.5 text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full">
                                        <IconComp className="w-3 h-3" />
                                        {link.platform}
                                      </span>
                                    );
                                  })}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No links added</p>
                            )}
                          </div>
                        )}
                        
                        {item.id === 'companies' && (
                          <div>
                            {sliderCompanies.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {sliderCompanies.map((company, index) => (
                                  <span key={index} className="inline-flex items-center gap-1.5 text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full">
                                    <div className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center">
                                      <span className="text-[8px] font-bold">{company.charAt(0)}</span>
                                    </div>
                                    {company}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No companies in slider</p>
                            )}
                          </div>
                        )}
                        
                        {item.id === 'experience' && (
                          <div>
                            {careerHighlights.length > 0 ? (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-700">
                                  {careerHighlights.length} {careerHighlights.length === 1 ? 'highlight' : 'highlights'}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {careerHighlights.slice(0, 3).map((h) => (
                                    <span key={h.id} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                      {h.organization || 'Untitled'}
                                    </span>
                                  ))}
                                  {careerHighlights.length > 3 && (
                                    <span className="text-xs text-gray-500">+{careerHighlights.length - 3}</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No career highlights</p>
                            )}
                          </div>
                        )}
                        
                        {item.id === 'strengths' && (
                          <div>
                            {strengths.length > 0 ? (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-700">
                                  {strengths.length} {strengths.length === 1 ? 'strength' : 'strengths'}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {strengths.slice(0, 3).map((s) => (
                                    <span key={s.id} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded flex items-center gap-1">
                                      <span>{s.icon}</span>
                                      {s.title || 'Untitled'}
                                    </span>
                                  ))}
                                  {strengths.length > 3 && (
                                    <span className="text-xs text-gray-500">+{strengths.length - 3}</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No strengths added</p>
                            )}
                          </div>
                        )}
                        
                        {item.id === 'testimonials' && (
                          <div>
                            {testimonials.length > 0 ? (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-700">
                                  {testimonials.length} {testimonials.length === 1 ? 'testimonial' : 'testimonials'}
                                </p>
                                <div className="space-y-1">
                                  {testimonials.slice(0, 3).map((t) => (
                                    <p key={t.id} className="text-xs text-gray-600">• {t.name || 'Unnamed'}</p>
                                  ))}
                                  {testimonials.length > 3 && (
                                    <p className="text-xs text-gray-500">+{testimonials.length - 3} more</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">No testimonials added</p>
                            )}
                          </div>
                        )}
                        
                        {item.id === 'about' && data.whoAreYou && (
                          <p className="text-xs text-gray-600 line-clamp-3">
                            {data.whoAreYou}
                          </p>
                        )}
                        
                        {item.id === 'resume' && data.resume && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600">Resume uploaded</span>
                          </div>
                        )}
                        
                        {/* Custom Sections Display */}
                        {item.id.startsWith('custom-') && (() => {
                          const customSection = (item as any).customData as CustomSection;
                          const sectionData = data.customSections?.find(s => s.id === customSection.id);
                          
                          if (!sectionData || !sectionData.data) return <p className="text-xs text-gray-500">No data added</p>;
                          
                          if (sectionData.type === 'text' || sectionData.type === 'textarea') {
                            return <p className="text-xs text-gray-600 line-clamp-3">{sectionData.data}</p>;
                          }
                          
                          if (sectionData.type === 'list' && Array.isArray(sectionData.data)) {
                            const items = sectionData.data.filter((item: string) => item.trim() !== '');
                            if (items.length === 0) return <p className="text-xs text-gray-500">No items added</p>;
                            
                            return (
                              <div className="space-y-1">
                                {items.slice(0, 3).map((item: string, idx: number) => (
                                  <p key={idx} className="text-xs text-gray-600">• {item}</p>
                                ))}
                                {items.length > 3 && (
                                  <p className="text-xs text-gray-500">+{items.length - 3} more</p>
                                )}
                              </div>
                            );
                          }
                          
                          return null;
                        })()}
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(item.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 shadow-sm hover:shadow-md transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Edit {item.label}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right Side - Portfolio Preview */}
      <div className={`flex-1 overflow-y-auto ${
        viewMode === 'edit' ? 'hidden lg:block' : 'block'
      } ${viewMode === 'edit' ? 'portfolio-edit-mode' : ''} ${
        previewMode === 'mobile' ? 'flex items-start justify-center bg-gray-900 p-4' : 'p-2'
      }`}>
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto relative ${
          previewMode === 'mobile' ? 'w-[375px] h-[812px] shadow-2xl' : 'h-full'
        }`}>
          {/* Blur Gradient Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
          {/* Navigation Bar */}
          <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className={`mx-auto transition-all duration-300 ${
              previewMode === 'mobile' ? 'px-4' : 'px-4 sm:px-6 lg:px-8'
            }`}>
              <div className={`flex items-center justify-between ${
                previewMode === 'mobile' ? 'h-12' : 'h-14 sm:h-16'
              }`}>
                {/* Logo/Name */}
                <div className="flex-shrink-0">
                  <h3 className={`font-bold text-gray-900 ${
                    previewMode === 'mobile' ? 'text-sm' : 'text-base sm:text-lg lg:text-xl'
                  }`}>
                    {data.fullName?.split(' ')[0] || 'Portfolio'}
                  </h3>
                </div>
                
                {/* Desktop Navigation Links - Only show on desktop preview and large screens */}
                {previewMode === 'desktop' && (
                  <>
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                      <a href="#about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                        About
                      </a>
                      {careerHighlights.length > 0 && (
                        <a href="#experience" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                          Experience
                        </a>
                      )}
                      {strengths.length > 0 && (
                        <a href="#strengths" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                          Strengths
                        </a>
                      )}
                      {testimonials.length > 0 && (
                        <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                          Testimonials
                        </a>
                      )}
                      {data.resume && (
                        <a href="#resume" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                          Resume
                        </a>
                      )}
                    </div>
                    
                    {/* Desktop CTA Button */}
                    <div className="hidden md:flex flex-shrink-0">
                      {data.email && (
                        <a
                          href={`mailto:${data.email}`}
                          className="px-4 lg:px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                        >
                          Get in Touch
                        </a>
                      )}
                    </div>
                  </>
                )}
                
                {/* Hamburger Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={previewMode === 'mobile' ? 'p-1.5 rounded-lg hover:bg-gray-100 transition-colors' : 'md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <svg className={previewMode === 'mobile' ? 'w-5 h-5 text-gray-700' : 'w-6 h-6 text-gray-700'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className={previewMode === 'mobile' ? 'w-5 h-5 text-gray-700' : 'w-6 h-6 text-gray-700'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div className={`py-3 border-t border-gray-200 animate-fadeIn ${
                  previewMode === 'mobile' ? 'block' : 'md:hidden'
                }`}>
                  <div className={`flex flex-col ${
                    previewMode === 'mobile' ? 'space-y-2' : 'space-y-3'
                  }`}>
                    <a 
                      href="#about" 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-medium text-gray-700 hover:text-gray-900 transition-colors ${
                        previewMode === 'mobile' ? 'text-xs py-1.5' : 'text-sm py-2'
                      }`}
                    >
                      About
                    </a>
                    {careerHighlights.length > 0 && (
                      <a 
                        href="#experience"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-medium text-gray-700 hover:text-gray-900 transition-colors ${
                          previewMode === 'mobile' ? 'text-xs py-1.5' : 'text-sm py-2'
                        }`}
                      >
                        Experience
                      </a>
                    )}
                    {strengths.length > 0 && (
                      <a 
                        href="#strengths"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-medium text-gray-700 hover:text-gray-900 transition-colors ${
                          previewMode === 'mobile' ? 'text-xs py-1.5' : 'text-sm py-2'
                        }`}
                      >
                        Strengths
                      </a>
                    )}
                    {testimonials.length > 0 && (
                      <a 
                        href="#testimonials"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-medium text-gray-700 hover:text-gray-900 transition-colors ${
                          previewMode === 'mobile' ? 'text-xs py-1.5' : 'text-sm py-2'
                        }`}
                      >
                        Testimonials
                      </a>
                    )}
                    {data.resume && (
                      <a 
                        href="#resume"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-medium text-gray-700 hover:text-gray-900 transition-colors ${
                          previewMode === 'mobile' ? 'text-xs py-1.5' : 'text-sm py-2'
                        }`}
                      >
                        Resume
                      </a>
                    )}
                    {data.email && (
                      <a
                        href={`mailto:${data.email}`}
                        className={`w-full bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all text-center mt-2 ${
                          previewMode === 'mobile' ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'
                        }`}
                      >
                        Get in Touch
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Company Slider */}
          {sliderCompanies.length > 0 && (
            <div className={`bg-white overflow-hidden ${
              previewMode === 'mobile' ? 'py-4' : 'py-6 sm:py-8'
            }`}>
              <h3 className={`text-center font-bold tracking-wider text-gray-500 uppercase px-4 ${
                previewMode === 'mobile' ? 'text-[10px] mb-3' : 'text-xs sm:text-sm mb-4 sm:mb-6 px-4 sm:px-8'
              }`}>
                Companies and Teams I have worked with
              </h3>
              <div className="marquee-container">
                <div className="marquee-content font-lato">
                  {[...sliderCompanies, ...sliderCompanies].map((company, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center font-black text-gray-400 ${
                        previewMode === 'mobile' ? 'px-3 text-lg' : 'px-4 sm:px-6 lg:px-8 text-xl sm:text-2xl lg:text-4xl'
                      }`}
                    >
                      {company}
                      <span className={previewMode === 'mobile' ? 'mx-2 text-gray-300' : 'mx-2 sm:mx-3 lg:mx-4 text-gray-300'}>•</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={`mx-auto transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-md px-4 py-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'
          }`}>
          {/* Hero Section */}
          <div id="about" className={previewMode === 'mobile' ? 'mb-8' : 'mb-12 sm:mb-16 lg:mb-20'}>
            <div className={`flex items-start mb-6 sm:mb-8 ${
              previewMode === 'mobile' ? 'flex-col gap-4' : 'flex-col sm:flex-row gap-6 sm:gap-8'
            }`}>
              <div className="flex-shrink-0 relative group">
                <div className={`rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden ${
                  previewMode === 'mobile' ? 'w-20 h-20' : 'w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32'
                }`}>
                  {data.profileImage ? (
                    <img 
                      src={data.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-gray-400" />
                  )}
                </div>
                {viewMode === 'edit' && (
                  <>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-1">
                          <Pencil className="w-6 h-6 text-white" />
                          <span className="text-white text-xs font-medium">Upload</span>
                        </div>
                      </label>
                    </div>
                    {data.profileImage && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="flex-1">
                <h1 className={`font-bold text-gray-900 leading-tight ${
                  previewMode === 'mobile' ? 'text-2xl mb-2' : 'text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 lg:mb-4'
                }`}>
                  Hi, I'm <span className="text-purple-600">{data.fullName?.split(' ')[0] || 'Your Name'}</span>.
                </h1>
                {data.tagline && (
                  <p className={`text-gray-700 font-medium ${
                    previewMode === 'mobile' ? 'text-sm mb-3' : 'text-lg sm:text-xl mb-4 sm:mb-6 lg:mb-8'
                  }`}>{data.tagline}</p>
                )}
                
                {/* Contact & Social Pill Buttons */}
                <div className="group/social-section relative">
                  <div className={`flex items-center flex-wrap ${
                    previewMode === 'mobile' ? 'gap-2' : 'gap-2 sm:gap-3'
                  }`}>
                    {/* Email Chip */}
                    {data.email && (
                      <a
                        href={`mailto:${data.email}`}
                        className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all ${
                          previewMode === 'mobile' ? 'px-2.5 py-1.5 text-xs' : 'px-3 sm:px-4 py-2 text-xs sm:text-sm'
                        }`}
                      >
                        <Mail className={previewMode === 'mobile' ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} />
                        <span className={previewMode === 'mobile' ? 'hidden' : 'hidden sm:inline'}>{data.email}</span>
                        <span className={previewMode === 'mobile' ? 'inline' : 'sm:hidden'}>Email</span>
                      </a>
                    )}
                    
                    {/* Phone Chip */}
                    {data.phone && (
                      <a
                        href={`tel:${data.phone}`}
                        className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all ${
                          previewMode === 'mobile' ? 'px-2.5 py-1.5 text-xs' : 'px-3 sm:px-4 py-2 text-xs sm:text-sm'
                        }`}
                      >
                        <Phone className={previewMode === 'mobile' ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} />
                        <span className={previewMode === 'mobile' ? 'hidden' : 'hidden sm:inline'}>{data.phone}</span>
                        <span className={previewMode === 'mobile' ? 'inline' : 'sm:hidden'}>Call</span>
                      </a>
                    )}
                    
                    {/* Custom Social Links */}
                    {socialLinks
                      .filter(link => link.url && link.url.trim() !== '')
                      .map((link) => {
                        const IconComponent = 
                          link.icon === 'linkedin' ? Linkedin :
                          link.icon === 'github' ? Github :
                          link.icon === 'twitter' ? Twitter :
                          link.icon === 'instagram' ? Instagram :
                          link.icon === 'calendar' ? Calendar :
                          Globe;
                        
                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all ${
                              previewMode === 'mobile' ? 'px-2.5 py-1.5 text-xs' : 'px-3 sm:px-4 py-2 text-xs sm:text-sm'
                            }`}
                          >
                            <IconComponent className={previewMode === 'mobile' ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} />
                            <span>{link.platform}</span>
                          </a>
                        );
                      })}

                    {/* Add More Social Link Skeleton Chip */}
                    {viewMode === 'edit' && !addingSocialLink && (
                      <button
                        onClick={() => setAddingSocialLink(true)}
                        className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-200 hover:border-gray-400 transition-all ${
                          previewMode === 'mobile' ? 'px-2.5 py-1.5 text-xs' : 'px-3 sm:px-4 py-2 text-xs sm:text-sm'
                        }`}
                      >
                        <Plus className={previewMode === 'mobile' ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} />
                        <span>Add Link</span>
                      </button>
                    )}
                  </div>

                  {/* Add New Social Link Form */}
                  {viewMode === 'edit' && addingSocialLink && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-4 animate-fadeIn">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" />
                        Add New Social Link
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
                          <select
                            value={newSocialLink.platform}
                            onChange={(e) => {
                              const selectedPlatform = availablePlatforms.find(p => p.platform === e.target.value);
                              setNewSocialLink({ 
                                ...newSocialLink, 
                                platform: e.target.value,
                                icon: selectedPlatform?.icon || 'globe'
                              });
                            }}
                            className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="">Select a platform</option>
                            {availablePlatforms.map((platform) => (
                              <option key={platform.platform} value={platform.platform}>
                                {platform.platform}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
                          <input
                            type="url"
                            value={newSocialLink.url}
                            onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleDiscardNewSocialLink}
                          className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleSaveNewSocialLink}
                          disabled={!newSocialLink.platform || !newSocialLink.url}
                          className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Save Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About Text */}
            {data.whoAreYou && (
              <div className={`text-gray-700 leading-relaxed ${
                previewMode === 'mobile' ? 'text-xs' : 'text-base sm:text-lg'
              }`}>
                <p>{data.whoAreYou}</p>
              </div>
            )}
          </div>

          {/* Career Highlights Section */}
          {(careerHighlights.length > 0 || viewMode === 'edit') && (
            <div id="experience" className={previewMode === 'mobile' ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}>
              <div className={`flex items-center gap-2 ${previewMode === 'mobile' ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
                <div className={`rounded-lg bg-blue-100 flex items-center justify-center ${
                  previewMode === 'mobile' ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
                }`}>
                  <Briefcase className={previewMode === 'mobile' ? 'w-3 h-3 text-blue-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-blue-600'} />
                </div>
                <h2 className={`font-bold text-gray-900 ${
                  previewMode === 'mobile' ? 'text-base' : 'text-2xl sm:text-3xl'
                }`}>Career Highlights</h2>
              </div>
              
              {careerHighlights.length > 0 ? (
                <>
                  <div className={previewMode === 'mobile' ? 'space-y-3' : 'space-y-4 sm:space-y-6'}>
                    {careerHighlights.slice(0, 6).map((highlight, index) => (
                  <div key={highlight.id} className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                    previewMode === 'mobile' ? 'p-3' : 'p-6 sm:p-8'
                  }`}>
                    {/* Header: Title, Role, and Arrow */}
                    <div className={`flex items-start justify-between ${
                      previewMode === 'mobile' ? 'gap-2 mb-2' : 'gap-4 mb-4'
                    }`}>
                      <div className="flex-1">
                        <h3 className={`font-bold mb-1 ${
                          previewMode === 'mobile' ? 'text-sm' : 'text-xl sm:text-2xl'
                        }`}>
                          {highlight.link ? (
                            <a 
                              href={highlight.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2 group"
                            >
                              <span>{highlight.organization}</span>
                              <ExternalLink className={previewMode === 'mobile' ? 'w-3 h-3' : 'w-4 h-4 sm:w-5 sm:h-5 opacity-70 group-hover:opacity-100 transition-opacity'} />
                            </a>
                          ) : (
                            <span className="text-blue-600">{highlight.organization}</span>
                          )}
                          {highlight.role && (
                            <span className="text-gray-900 font-normal"> | {highlight.role}</span>
                          )}
                        </h3>
                        {(highlight.startDate || highlight.endDate) && (
                          <p className={previewMode === 'mobile' ? 'text-[10px] text-gray-500' : 'text-sm text-gray-500'}>
                            {highlight.startDate} {highlight.startDate && '- '} {highlight.current || highlight.endDate === 'Present' ? 'Present' : highlight.endDate}
                          </p>
                        )}
                      </div>
                      {highlight.link && (
                        <a
                          href={highlight.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    {highlight.description && (
                      <p className={`text-gray-700 leading-relaxed ${
                        previewMode === 'mobile' ? 'text-[11px] mb-2' : 'text-sm sm:text-base mb-3'
                      }`}>
                        {highlight.description}
                      </p>
                    )}

                    {/* Link Display */}
                    {highlight.link && (
                      <a
                        href={highlight.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-blue-600 hover:text-blue-700 hover:underline block ${
                          previewMode === 'mobile' ? 'text-[10px] mb-2' : 'text-sm mb-4'
                        }`}
                      >
                        {highlight.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}

                    {/* Achievements as Bullet Points */}
                    {highlight.achievements && (
                      <div className={`space-y-2 ${previewMode === 'mobile' ? 'mt-2' : 'mt-4'}`}>
                        {highlight.achievements.split('\n').filter(line => line.trim()).map((achievement, idx) => (
                          <div key={idx} className={`flex items-start ${previewMode === 'mobile' ? 'gap-1.5' : 'gap-2'}`}>
                            <div className={previewMode === 'mobile' ? 'flex-shrink-0 mt-1' : 'flex-shrink-0 mt-1.5'}>
                              <div className={previewMode === 'mobile' ? 'w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-blue-600 rotate-90' : 'w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-blue-600 rotate-90'}></div>
                            </div>
                            <p className={`text-gray-700 leading-relaxed flex-1 ${
                              previewMode === 'mobile' ? 'text-[10px]' : 'text-sm'
                            }`}>
                              {achievement}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                    ))}
                  </div>
                  
                  {careerHighlights.length > 6 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowAllHighlights(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View All {careerHighlights.length} Highlights
                      </button>
                    </div>
                  )}

                  {/* Add More Skeleton Block */}
                  {viewMode === 'edit' && !addingCareerHighlight && (
                    <button
                      onClick={() => setAddingCareerHighlight(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all group mt-2"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-all">
                          <Plus className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                          Add another career highlight
                        </p>
                      </div>
                    </button>
                  )}

                  {/* Add New Career Highlight Form - After Items */}
                  {viewMode === 'edit' && addingCareerHighlight && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-6 animate-fadeIn">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" />
                        Add New Career Highlight
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={newCareerHighlight.organization}
                            onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, organization: e.target.value })}
                            placeholder="Organization/Project *"
                            className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <input
                            type="text"
                            value={newCareerHighlight.role}
                            onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, role: e.target.value })}
                            placeholder="Role *"
                            className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <textarea
                          value={newCareerHighlight.description}
                          onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, description: e.target.value })}
                          placeholder="Short description"
                          rows={3}
                          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                        />
                        <input
                          type="url"
                          value={newCareerHighlight.link}
                          onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, link: e.target.value })}
                          placeholder="Link (optional)"
                          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <textarea
                          value={newCareerHighlight.achievements}
                          onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, achievements: e.target.value })}
                          placeholder="Achievements (one per line)"
                          rows={3}
                          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={newCareerHighlight.startDate}
                            onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, startDate: e.target.value })}
                            placeholder="Start Date (e.g., Jan 2023)"
                            className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <input
                            type="text"
                            value={newCareerHighlight.endDate}
                            onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, endDate: e.target.value })}
                            placeholder="End Date (e.g., Present)"
                            disabled={newCareerHighlight.current}
                            className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newCareerHighlight.current}
                            onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                          />
                          <span className="text-sm text-gray-700">Currently working here</span>
                        </label>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleDiscardNewCareerHighlight}
                          className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleSaveNewCareerHighlight}
                          disabled={!newCareerHighlight.organization || !newCareerHighlight.role}
                          className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Save Highlight
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : viewMode === 'edit' && !addingCareerHighlight && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No career highlights added yet</p>
                  <button
                    onClick={() => setAddingCareerHighlight(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Highlight</span>
                  </button>
                </div>
              )}

              {/* Add New Career Highlight Form */}
              {viewMode === 'edit' && addingCareerHighlight && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Add New Career Highlight
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newCareerHighlight.organization}
                        onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, organization: e.target.value })}
                        placeholder="Organization/Project *"
                        className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <input
                        type="text"
                        value={newCareerHighlight.role}
                        onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, role: e.target.value })}
                        placeholder="Role *"
                        className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <textarea
                      value={newCareerHighlight.description}
                      onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, description: e.target.value })}
                      placeholder="Short description"
                      rows={3}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                    <input
                      type="url"
                      value={newCareerHighlight.link}
                      onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, link: e.target.value })}
                      placeholder="Link (optional)"
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <textarea
                      value={newCareerHighlight.achievements}
                      onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, achievements: e.target.value })}
                      placeholder="Achievements (one per line)"
                      rows={3}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newCareerHighlight.startDate}
                        onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, startDate: e.target.value })}
                        placeholder="Start Date (e.g., Jan 2023)"
                        className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <input
                        type="text"
                        value={newCareerHighlight.endDate}
                        onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, endDate: e.target.value })}
                        placeholder="End Date (e.g., Present)"
                        disabled={newCareerHighlight.current}
                        className="px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCareerHighlight.current}
                        onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                      <span className="text-sm text-gray-700">Currently working here</span>
                    </label>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleDiscardNewCareerHighlight}
                      className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSaveNewCareerHighlight}
                      disabled={!newCareerHighlight.organization || !newCareerHighlight.role}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save Highlight
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strengths Section */}
          {(strengths.length > 0 || viewMode === 'edit') && (
            <div id="strengths" className={previewMode === 'mobile' ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}>
              <div className={`flex items-center gap-2 ${previewMode === 'mobile' ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
                <div className={`rounded-lg bg-orange-100 flex items-center justify-center ${
                  previewMode === 'mobile' ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
                }`}>
                  <Award className={previewMode === 'mobile' ? 'w-3 h-3 text-orange-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-orange-600'} />
                </div>
                <h2 className={`font-bold text-gray-900 ${
                  previewMode === 'mobile' ? 'text-base' : 'text-2xl sm:text-3xl'
                }`}>Strength Zones</h2>
              </div>
              
              {strengths.length > 0 ? (
                <div className={`grid ${
                  previewMode === 'mobile' ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                }`}>
                {strengths.map((strength) => (
                  <div key={strength.id} className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                    previewMode === 'mobile' ? 'p-3' : 'p-6'
                  }`}>
                    <div className={previewMode === 'mobile' ? 'text-2xl mb-2' : 'text-4xl mb-4'}>{strength.icon}</div>
                    <h3 className={`font-bold text-gray-900 ${
                      previewMode === 'mobile' ? 'text-sm mb-1' : 'text-lg mb-2'
                    }`}>
                      {strength.title}
                    </h3>
                    {strength.description && (
                      <p className={`text-gray-600 leading-relaxed ${
                        previewMode === 'mobile' ? 'text-[10px]' : 'text-sm'
                      }`}>
                        {strength.description}
                      </p>
                    )}
                  </div>
                ))}
                
                {/* Add More Skeleton Block */}
                {viewMode === 'edit' && !addingStrength && (
                  <button
                    onClick={() => setAddingStrength(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all group mt-2"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-all">
                        <Plus className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                        Add another strength
                      </p>
                    </div>
                  </button>
                )}
                </div>
              ) : viewMode === 'edit' && !addingStrength && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No strengths added yet</p>
                  <button
                    onClick={() => setAddingStrength(true)}
                    className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Strength</span>
                  </button>
                </div>
              )}

              {/* Add New Strength Form */}
              {viewMode === 'edit' && addingStrength && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mt-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-orange-600" />
                    Add New Strength
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <EmojiPicker
                          value={newStrength.icon}
                          onChange={(emoji) => setNewStrength({ ...newStrength, icon: emoji })}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input
                          type="text"
                          value={newStrength.title}
                          onChange={(e) => setNewStrength({ ...newStrength, title: e.target.value })}
                          placeholder="e.g., Problem Solving"
                          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={newStrength.description}
                        onChange={(e) => setNewStrength({ ...newStrength, description: e.target.value })}
                        placeholder="Brief description of this strength..."
                        rows={3}
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleDiscardNewStrength}
                      className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSaveNewStrength}
                      disabled={!newStrength.title}
                      className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save Strength
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Testimonials Section */}
          {(testimonials.length > 0 || viewMode === 'edit') && (
            <div id="testimonials" className={previewMode === 'mobile' ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}>
              <div className={`flex items-center gap-2 ${previewMode === 'mobile' ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
                <div className={`rounded-lg bg-blue-100 flex items-center justify-center ${
                  previewMode === 'mobile' ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
                }`}>
                  <MessageSquare className={previewMode === 'mobile' ? 'w-3 h-3 text-blue-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-blue-600'} />
                </div>
                <h2 className={`font-bold text-gray-900 ${
                  previewMode === 'mobile' ? 'text-base' : 'text-2xl sm:text-3xl'
                }`}>What People Say</h2>
              </div>
              
              {testimonials.length > 0 ? (
                <div className={`grid ${
                  previewMode === 'mobile' ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'
                }`}>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className={`bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                    previewMode === 'mobile' ? 'p-3' : 'p-6'
                  }`}>
                    {/* Header with Avatar, Name, Title, and LinkedIn */}
                    <div className={`flex items-start ${previewMode === 'mobile' ? 'gap-2 mb-2' : 'gap-3 mb-4'}`}>
                      {/* Avatar with Auto-generated Initials */}
                      <div className={`flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center ${
                        previewMode === 'mobile' ? 'w-8 h-8' : 'w-12 h-12'
                      }`}>
                        <span className={`text-white font-bold ${
                          previewMode === 'mobile' ? 'text-xs' : 'text-lg'
                        }`}>
                          {testimonial.name ? testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
                        </span>
                      </div>
                      
                      {/* Name and Title */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-gray-900 mb-0.5 ${
                          previewMode === 'mobile' ? 'text-xs' : 'text-base'
                        }`}>
                          {testimonial.name || 'Anonymous'}
                        </h3>
                        {testimonial.title && (
                          <p className={`text-gray-500 leading-relaxed ${
                            previewMode === 'mobile' ? 'text-[10px]' : 'text-xs'
                          }`}>
                            {testimonial.title}
                          </p>
                        )}
                      </div>
                      
                      {/* LinkedIn Icon */}
                      {testimonial.linkedinUrl && (
                        <a
                          href={testimonial.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-blue-600 hover:text-blue-700 transition-colors"
                          title="View LinkedIn Profile"
                        >
                          <Linkedin className={previewMode === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} />
                        </a>
                      )}
                    </div>
                    
                    {/* Testimonial Text */}
                    {testimonial.testimonial && (
                      <p className={`text-gray-700 leading-relaxed italic ${
                        previewMode === 'mobile' ? 'text-[10px]' : 'text-sm'
                      }`}>
                        &ldquo;{testimonial.testimonial}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
                
                {/* Add More Skeleton Block */}
                {viewMode === 'edit' && !addingTestimonial && (
                  <button
                    onClick={() => setAddingTestimonial(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all group mt-2"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-all">
                        <Plus className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                        Add another testimonial
                      </p>
                    </div>
                  </button>
                )}
                </div>
              ) : viewMode === 'edit' && !addingTestimonial && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No testimonials added yet</p>
                  <button
                    onClick={() => setAddingTestimonial(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Testimonial</span>
                  </button>
                </div>
              )}

              {/* Add New Testimonial Form */}
              {viewMode === 'edit' && addingTestimonial && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Add New Testimonial
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                          placeholder="e.g., Phil Carter"
                          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                        <input
                          type="url"
                          value={newTestimonial.linkedinUrl}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, linkedinUrl: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title/Affiliation *</label>
                      <input
                        type="text"
                        value={newTestimonial.title}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                        placeholder="e.g., CEO @ Company, Advisor @ Another"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial *</label>
                      <textarea
                        value={newTestimonial.testimonial}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial: e.target.value })}
                        placeholder="Enter the testimonial text here..."
                        rows={5}
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleDiscardNewTestimonial}
                      className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSaveNewTestimonial}
                      disabled={!newTestimonial.name || !newTestimonial.title || !newTestimonial.testimonial}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save Testimonial
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resume Section */}
          {data.resume && (
            <div id="resume" className={previewMode === 'mobile' ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}>
              <div className={`flex items-center gap-2 ${previewMode === 'mobile' ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
                <div className={`rounded-lg bg-purple-100 flex items-center justify-center ${
                  previewMode === 'mobile' ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
                }`}>
                  <FileText className={previewMode === 'mobile' ? 'w-3 h-3 text-purple-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-purple-600'} />
                </div>
                <h2 className={`font-bold text-gray-900 ${
                  previewMode === 'mobile' ? 'text-base' : 'text-2xl sm:text-3xl'
                }`}>Resume</h2>
              </div>
              
              <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm flex items-start gap-3 ${
                previewMode === 'mobile' ? 'p-3 flex-col' : 'p-4 sm:p-6 flex-col sm:flex-row sm:items-center gap-4'
              }`}>
                <div className={`rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 ${
                  previewMode === 'mobile' ? 'w-10 h-10' : 'w-14 h-14 sm:w-16 sm:h-16'
                }`}>
                  <FileText className={previewMode === 'mobile' ? 'w-5 h-5 text-gray-400' : 'w-7 h-7 sm:w-8 sm:h-8 text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-gray-900 ${
                    previewMode === 'mobile' ? 'text-sm' : 'text-base sm:text-lg'
                  }`}>Resume uploaded</p>
                  <p className={`text-gray-600 ${
                    previewMode === 'mobile' ? 'text-xs' : 'text-sm sm:text-base'
                  }`}>Ready to parse and display</p>
                </div>
                <button className={`bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all ${
                  previewMode === 'mobile' ? 'w-full px-3 py-2 text-xs' : 'w-full sm:w-auto px-4 py-2 text-sm'
                }`}>
                  View
                </button>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className={`border-t border-gray-200 ${
            previewMode === 'mobile' ? 'mt-8 pt-6' : 'mt-16 sm:mt-20 lg:mt-24 pt-8 sm:pt-10 lg:pt-12'
          }`}>
            <div className={`flex items-start justify-between ${
              previewMode === 'mobile' ? 'flex-col gap-4' : 'flex-col sm:flex-row sm:items-center gap-6 sm:gap-4'
            }`}>
              <h2 className={`font-bold text-gray-900 ${
                previewMode === 'mobile' ? 'text-lg' : 'text-2xl sm:text-3xl lg:text-4xl'
              }`}>
                Let's build something meaningful.
              </h2>
              <div className={`flex items-center flex-shrink-0 ${
                previewMode === 'mobile' ? 'gap-2' : 'gap-3'
              }`}>
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    className={`rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-all ${
                      previewMode === 'mobile' ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'
                    }`}
                  >
                    <Mail className={previewMode === 'mobile' ? 'w-4 h-4 text-gray-600' : 'w-5 h-5 sm:w-6 sm:h-6 text-gray-600'} />
                  </a>
                )}
                <a
                  href="#"
                  className={`rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-all ${
                    previewMode === 'mobile' ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'
                  }`}
                >
                  <Linkedin className={previewMode === 'mobile' ? 'w-4 h-4 text-gray-600' : 'w-5 h-5 sm:w-6 sm:h-6 text-gray-600'} />
                </a>
              </div>
            </div>
            <p className={`text-center text-gray-500 ${
              previewMode === 'mobile' ? 'text-[10px] mt-4' : 'text-xs sm:text-sm mt-6 sm:mt-8'
            }`}>
              Built with 🤍 by {data.fullName || 'You'}
            </p>
          </div>
          </div>
          </div>
        </div>
      </div>

      {/* View All Highlights Modal */}
      {showAllHighlights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Career Highlights</h2>
              <button
                onClick={() => setShowAllHighlights(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {careerHighlights.map((highlight) => (
                <div key={highlight.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                  {/* Header: Title, Role, and Arrow */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">
                        {highlight.link ? (
                          <a 
                            href={highlight.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2 group"
                          >
                            <span>{highlight.organization}</span>
                            <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <span className="text-blue-600">{highlight.organization}</span>
                        )}
                        {highlight.role && (
                          <span className="text-gray-900 font-normal"> | {highlight.role}</span>
                        )}
                      </h3>
                      {(highlight.startDate || highlight.endDate) && (
                        <p className="text-sm text-gray-500">
                          {highlight.startDate} {highlight.startDate && '- '} {highlight.current || highlight.endDate === 'Present' ? 'Present' : highlight.endDate}
                        </p>
                      )}
                    </div>
                    {highlight.link && (
                      <a
                        href={highlight.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  {highlight.description && (
                    <p className="text-base text-gray-700 mb-3 leading-relaxed">
                      {highlight.description}
                    </p>
                  )}

                  {/* Link Display */}
                  {highlight.link && (
                    <a
                      href={highlight.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline mb-4 block"
                    >
                      {highlight.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}

                  {/* Achievements as Bullet Points */}
                  {highlight.achievements && (
                    <div className="space-y-2 mt-4">
                      {highlight.achievements.split('\n').filter(line => line.trim()).map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-1.5">
                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-blue-600 rotate-90"></div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">
                            {achievement}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddSectionModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add Custom Section</h3>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title *</label>
                <input
                  type="text"
                  value={newSectionData.title}
                  onChange={(e) => setNewSectionData({ ...newSectionData, title: e.target.value })}
                  placeholder="e.g., Skills, Awards, Certifications"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Icon</label>
                <div className="flex items-center gap-2">
                  <EmojiPicker
                    value={newSectionData.icon}
                    onChange={(emoji) => setNewSectionData({ ...newSectionData, icon: emoji })}
                  />
                  <p className="text-xs text-gray-500">Click to select an emoji icon</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type *</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setNewSectionData({ ...newSectionData, type: 'text' })}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      newSectionData.type === 'text'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900">Single Line Text</div>
                    <div className="text-xs text-gray-500">A simple text input field</div>
                  </button>

                  <button
                    onClick={() => setNewSectionData({ ...newSectionData, type: 'textarea' })}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      newSectionData.type === 'textarea'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900">Paragraph Text</div>
                    <div className="text-xs text-gray-500">Multi-line textarea for longer content</div>
                  </button>

                  <button
                    onClick={() => setNewSectionData({ ...newSectionData, type: 'list' })}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      newSectionData.type === 'list'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900">Bullet List</div>
                    <div className="text-xs text-gray-500">Add multiple items in a list format</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomSection}
                disabled={!newSectionData.title || !newSectionData.type}
                className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all ${
                  newSectionData.title && newSectionData.type
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Section
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

