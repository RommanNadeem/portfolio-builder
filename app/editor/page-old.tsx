'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser, signOut } from '@/lib/supabase';
import { getCompletePortfolio, convertToLegacyFormat, saveCompletePortfolio } from '@/lib/database';
import MonthYearPicker from './components/MonthYearPicker';
import EmojiPicker from './components/EmojiPicker';
import { 
  User, Mail, Phone, RefreshCw, ChevronDown, 
  Pencil, Briefcase, FileText, MessageSquare,
  GraduationCap, Award, Star, ArrowRight, ArrowLeft,
  Linkedin, Calendar, ExternalLink, Github,
  Twitter, Instagram, Globe, Link as LinkIcon,
  Plus, Trash2, GripVertical, Eye, AlignLeft, Settings,
  LogOut
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
  achievements: string[];
  startDate: string;
  endDate: string;
  current: boolean;
  isPageBlock?: boolean;
  pageContent?: string;
  sections?: any[]; // Sections for pageblock detail page
}

interface Strength {
  id: string;
  title: string;
  description: string;
  icon: string;
  isPageBlock?: boolean;
  pageContent?: string;
  sections?: any[]; // Sections for pageblock detail page
}

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  tags: string[];
  pageContent: string;
  link?: string;
  sections?: any[]; // Sections for pageblock detail page
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
  heading?: string;
  profession: string;
  email: string;
  phone: string;
  resume: string | null;
  companies: string;
  sliderCompanies: string;
  careerHighlights: CareerHighlight[];
  strengths: Strength[];
  projects: Project[];
  tagline: string;
  whoAreYou: string;
  profileImage: string | null;
  socialLinks: SocialLink[];
  customSections: CustomSection[];
  testimonials: Testimonial[];
  footerText?: string;
  footerSignature?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<PortfolioData | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<CareerHighlight | null>(null);
  const [editingStrength, setEditingStrength] = useState<Strength | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
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
  const [addingProject, setAddingProject] = useState(false);
  const [addingSocialLink, setAddingSocialLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateValidationError, setDateValidationError] = useState<string>('');
  const [newCareerHighlight, setNewCareerHighlight] = useState<CareerHighlight>({
    id: '',
    organization: '',
    role: '',
    description: '',
    link: '',
    achievements: [],
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
  const [newProject, setNewProject] = useState<Project>({
    id: '',
    title: '',
    description: '',
    thumbnail: null,
    tags: [],
    pageContent: '',
    link: ''
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      // Check if this is a fresh auth (just signed up/in)
      const freshAuth = localStorage.getItem('freshAuth');
      if (freshAuth) {
        // Clear the flag and skip the redirect check this time
        localStorage.removeItem('freshAuth');
        // Give extra time for session to establish
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }

      const user = await getCurrentUser();
      if (!user) {
        // Only redirect if there's also no portfolio data
        const hasData = localStorage.getItem('portfolioData');
        if (!hasData) {
          router.push('/onboarding');
        }
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      // Check if user is authenticated
      const user = await getCurrentUser();
      
      console.log('[Editor Debug] User:', user?.id || 'Not authenticated');
      
      if (user) {
        // Store user ID for save operations
        setCurrentUserId(user.id);
        
        // Load from Supabase only
        const { data: portfolioData, error } = await getCompletePortfolio(user.id);
        
        console.log('[Editor Debug] Supabase data:', portfolioData);
        console.log('[Editor Debug] Supabase error:', error);
        
        if (!error && portfolioData) {
          // Convert to legacy format
          const parsedData = convertToLegacyFormat(portfolioData);
          console.log('[Editor Debug] Converted data:', parsedData);
          console.log('[Editor Debug] Career highlights count:', parsedData.careerHighlights?.length || 0);
          
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
      // Migrate achievements from string to array (backwards compatibility)
      if (parsedData.careerHighlights) {
        parsedData.careerHighlights = parsedData.careerHighlights.map((highlight: any) => {
          if (typeof highlight.achievements === 'string') {
            // Split by newlines, filter empty, take up to 3
            const achievementsArray = highlight.achievements
              .split('\n')
              .filter((a: string) => a.trim())
              .slice(0, 3);
            return { ...highlight, achievements: achievementsArray };
          }
          // If already an array, ensure max 3 items
          if (Array.isArray(highlight.achievements)) {
            const achievementsArray = [...highlight.achievements]
              .filter((a: string) => a !== null && a !== undefined)
              .slice(0, 3);
            return { ...highlight, achievements: achievementsArray };
          }
          // If achievements is missing, initialize with empty array
          return { ...highlight, achievements: [] };
        });
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
      // Initialize projects
      if (!parsedData.projects) {
        parsedData.projects = [];
      }
          
          setData(parsedData);
          setEditData(parsedData); // Initialize editData with loaded data
          return;
        } else {
          // No data in Supabase, redirect to onboarding
          console.log('[Editor Debug] No data found, redirecting to onboarding');
          router.push('/onboarding-v2/start');
          return;
        }
    } else {
        // Not authenticated, redirect to sign in
        console.log('[Editor Debug] Not authenticated, redirecting to signin');
        router.push('/signin');
        return;
    }
    };
    
    loadData();
  }, [router]);
  
  // Sync data to editData whenever data changes
  useEffect(() => {
    if (data && !editData) {
      setEditData(data);
    }
  }, [data, editData]);


  if (!data) {
    console.log('[Editor] Data is null, showing loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Loading...</div>
          <div className="text-xs text-gray-400">If this persists, check the console</div>
        </div>
      </div>
    );
  }
  
  console.log('[Editor] Data loaded, rendering page');

  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'links', label: 'Social Links', icon: LinkIcon },
    { id: 'companies', label: 'Companies Slider', icon: Star },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'experience', label: 'Career Highlights', icon: Award },
    { id: 'strengths', label: 'Strengths', icon: Star },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'footer', label: 'Footer', icon: AlignLeft },
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
  const projects = data.projects || [];

  // Section configuration - defines each section as a manageable entity
  const sectionConfig: { [key: string]: {
    id: string;
    label: string;
    isVisible: () => boolean;
    hasData: () => boolean;
    icon: any;
    color: string;
  }} = {
    personal: {
      id: 'personal',
      label: 'Personal Info',
      isVisible: () => true, // Always visible
      hasData: () => !!(data.heading || data.tagline || data.whoAreYou || data.profileImage),
      icon: User,
      color: 'gray'
    },
    links: {
      id: 'links',
      label: 'Social Links',
      isVisible: () => true, // Always visible
      hasData: () => socialLinks.length > 0 || !!data.email || !!data.phone,
      icon: LinkIcon,
      color: 'blue'
    },
    companies: {
      id: 'companies',
      label: 'Companies Slider',
      isVisible: () => sliderCompanies.length > 0,
      hasData: () => sliderCompanies.length > 0,
      icon: Star,
      color: 'gray'
    },
    projects: {
      id: 'projects',
      label: 'Projects',
      isVisible: () => projects.length > 0 || viewMode === 'edit',
      hasData: () => projects.length > 0,
      icon: Briefcase,
      color: 'purple'
    },
    experience: {
      id: 'experience',
      label: 'Career Highlights',
      isVisible: () => careerHighlights.length > 0 || viewMode === 'edit',
      hasData: () => careerHighlights.length > 0,
      icon: Award,
      color: 'blue'
    },
    strengths: {
      id: 'strengths',
      label: 'Strengths',
      isVisible: () => strengths.length > 0 || viewMode === 'edit',
      hasData: () => strengths.length > 0,
      icon: Star,
      color: 'orange'
    },
    testimonials: {
      id: 'testimonials',
      label: 'Testimonials',
      isVisible: () => testimonials.length > 0 || viewMode === 'edit',
      hasData: () => testimonials.length > 0,
      icon: MessageSquare,
      color: 'blue'
    },
    resume: {
      id: 'resume',
      label: 'Resume',
      isVisible: () => !!data.resume || viewMode === 'edit',
      hasData: () => !!data.resume,
      icon: FileText,
      color: 'purple'
    },
    footer: {
      id: 'footer',
      label: 'Footer',
      isVisible: () => true, // Always visible
      hasData: () => !!(data.footerText || data.footerSignature),
      icon: AlignLeft,
      color: 'gray'
    }
  };

  // Get ordered, visible sections
  // Helper function to save data to both localStorage and Supabase
  const saveDataToDB = async (newData: PortfolioData) => {
    // Save to localStorage
    localStorage.setItem('portfolioData', JSON.stringify(newData));
    
    // Save to Supabase if user is authenticated
    if (currentUserId) {
      try {
        const result = await saveCompletePortfolio(currentUserId, newData);
        if (result.error) {
          console.error('Error saving to database:', result.error);
        } else {
          console.log('Successfully saved to database');
        }
      } catch (error) {
        console.error('Error saving to database:', error);
      }
    }
  };

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
    if (!editableData.projects) {
      editableData.projects = [];
    }
    setEditData(editableData);
  };

  // Date validation helper
  const compareDates = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate || endDate === 'Present') return true;
    
    const parseDate = (dateStr: string) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const parts = dateStr.split(' ');
      if (parts.length !== 2) return null;
      const monthIndex = months.indexOf(parts[0]);
      const year = parseInt(parts[1]);
      if (monthIndex === -1 || isNaN(year)) return null;
      return new Date(year, monthIndex, 1);
    };
    
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    if (!start || !end) return true; // Can't compare invalid dates
    return start <= end;
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
    // Open the add career highlight form instead of creating empty element
    setAddingCareerHighlight(true);
    // Scroll to the career highlights section in preview
    const experienceSection = document.getElementById('experience');
    if (experienceSection) {
      experienceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUpdateHighlight = async (id: string, field: keyof CareerHighlight, value: any) => {
    if (!data) return;
    
    const updatedHighlights = (data.careerHighlights || []).map(h => {
      if (h.id === id) {
        // Special handling for 'current' field
        if (field === 'current') {
          setDateValidationError('');
          return {
            ...h,
            current: value,
            endDate: value ? 'Present' : ''
          };
        }
        
        // Create updated highlight
        const updated = { ...h, [field]: value };
        
        // Validate dates when updating startDate or endDate
        if (field === 'startDate' || field === 'endDate') {
          const startDate = field === 'startDate' ? value : h.startDate;
          const endDate = field === 'endDate' ? value : h.endDate;
          
          if (startDate && endDate && endDate !== 'Present') {
            if (!compareDates(startDate, endDate)) {
              setDateValidationError('End date must be after start date');
              return h; // Don't update if invalid
            } else {
              setDateValidationError('');
            }
          }
        }
        
        return updated;
      }
      return h;
    });
    
    const newData = {
      ...data,
      careerHighlights: updatedHighlights
    };
    
    setData(newData);
    setEditData(newData);
    await saveDataToDB(newData);
  };

  const handleRemoveHighlight = async (id: string) => {
    if (!data) return;
    const newData = {
      ...data,
      careerHighlights: (data.careerHighlights || []).filter(h => h.id !== id)
    };
    setData(newData);
    setEditData(newData);
    await saveDataToDB(newData);
    if (editingHighlight?.id === id) {
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

  const handleUpdateStrength = async (id: string, field: keyof Strength, value: string) => {
    if (!data) return;
    
    // Update editData if we're in edit mode (left sidebar)
    if (editData) {
      const updatedEditData = {
        ...editData,
        strengths: (editData.strengths || []).map(s =>
          s.id === id ? { ...s, [field]: value } : s
        )
      };
      setEditData(updatedEditData);
    }
    
    // Also update main data for immediate preview
    const newData = {
      ...data,
      strengths: (data.strengths || []).map(s =>
        s.id === id ? { ...s, [field]: value } : s
      )
    };
    setData(newData);
    await saveDataToDB(newData);
  };

  const handleRemoveStrength = async (id: string) => {
    if (!data) return;
    
    // Update editData if we're in edit mode (left sidebar)
    if (editData) {
      const updatedEditData = {
        ...editData,
        strengths: (editData.strengths || []).filter(s => s.id !== id)
      };
      setEditData(updatedEditData);
    }
    
    // Also update main data
    const newData = {
      ...data,
      strengths: (data.strengths || []).filter(s => s.id !== id)
    };
    setData(newData);
    await saveDataToDB(newData);
    if (editingStrength?.id === id) {
      setEditingStrength(null);
    }
  };

  const handleAddCustomSection = async () => {
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

    const customSectionId = `custom-${newSection.id}`;

    if (data) {
      const updatedData = {
        ...data,
        customSections: [...(data.customSections || []), newSection]
      };
      setData(updatedData);
      
      
      await saveDataToDB(updatedData);
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

  const handleRemoveCustomSection = async (id: string) => {
    if (!data) return;
    
    const customSectionId = `custom-${id}`;
    
    // Update editData if we're in edit mode (left sidebar)
    if (editData) {
      const updatedEditData = {
        ...editData,
        customSections: (editData.customSections || []).filter(s => s.id !== id)
      };
      setEditData(updatedEditData);
    }
    
    // Also update main data
    const updatedData = {
      ...data,
      customSections: (data.customSections || []).filter(s => s.id !== id)
    };
    setData(updatedData);
    
    await saveDataToDB(updatedData);
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

  const handleUpdateTestimonial = async (id: string, field: keyof Testimonial, value: string) => {
    if (!data) return;
    
    // Update editData if we're in edit mode (left sidebar)
    if (editData) {
      const updatedEditData = {
        ...editData,
        testimonials: (editData.testimonials || []).map(t =>
          t.id === id ? { ...t, [field]: value } : t
        )
      };
      setEditData(updatedEditData);
    }
    
    // Also update main data for immediate preview
    const newData = {
      ...data,
      testimonials: (data.testimonials || []).map(t =>
        t.id === id ? { ...t, [field]: value } : t
      )
    };
    setData(newData);
    await saveDataToDB(newData);
  };

  const handleRemoveTestimonial = async (id: string) => {
    if (!data) return;
    
    // Update editData if we're in edit mode (left sidebar)
    if (editData) {
      const updatedEditData = {
        ...editData,
        testimonials: (editData.testimonials || []).filter(t => t.id !== id)
      };
      setEditData(updatedEditData);
    }
    
    // Also update main data
    const newData = {
      ...data,
      testimonials: (data.testimonials || []).filter(t => t.id !== id)
    };
    setData(newData);
    await saveDataToDB(newData);
    if (editingTestimonial?.id === id) {
      setEditingTestimonial(null);
    }
  };

  // Project Handlers
  const handleAddProject = () => {
    if (!editData) return;
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      thumbnail: null,
      tags: [],
      pageContent: '',
      link: ''
    };
    setEditData({
      ...editData,
      projects: [...(editData.projects || []), newProject]
    });
  };

  const handleUpdateProject = async (id: string, field: keyof Project, value: any) => {
    if (!data) return;
    
    // Update editData if we're in edit mode (left sidebar)
    if (editData) {
      const updatedEditData = {
        ...editData,
        projects: (editData.projects || []).map(p =>
          p.id === id ? { ...p, [field]: value } : p
        )
      };
      setEditData(updatedEditData);
    }
    
    // Also update main data for immediate preview
    const newData = {
      ...data,
      projects: (data.projects || []).map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    };
    setData(newData);
    await saveDataToDB(newData);
  };

  const handleRemoveProject = async (id: string) => {
    if (!data) return;
    
    // Update editData if we're in edit mode (left sidebar)
    if (editData) {
      const updatedEditData = {
        ...editData,
        projects: (editData.projects || []).filter(p => p.id !== id)
      };
      setEditData(updatedEditData);
    }
    
    // Also update main data
    const newData = {
      ...data,
      projects: (data.projects || []).filter(p => p.id !== id)
    };
    setData(newData);
    await saveDataToDB(newData);
    if (editingProject?.id === id) {
      setEditingProject(null);
    }
  };

  const handleSaveNewProject = async () => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      projects: [...(data?.projects || []), project]
    };
    setData(updatedData);
    await saveDataToDB(updatedData);
    setAddingProject(false);
    setNewProject({
      id: '',
      title: '',
      description: '',
      thumbnail: null,
      tags: [],
      pageContent: '',
      link: ''
    });
  };

  const handleDiscardNewProject = () => {
    setAddingProject(false);
    setNewProject({
      id: '',
      title: '',
      description: '',
      thumbnail: null,
      tags: [],
      pageContent: '',
      link: ''
    });
  };

  const handleSaveNewCareerHighlight = async () => {
    const highlight: CareerHighlight = {
      ...newCareerHighlight,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      careerHighlights: [...(data?.careerHighlights || []), highlight]
    };
    setData(updatedData);
    await saveDataToDB(updatedData);
    setAddingCareerHighlight(false);
    setNewCareerHighlight({
      id: '',
      organization: '',
      role: '',
      description: '',
      link: '',
      achievements: [],
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
      achievements: [],
      startDate: '',
      endDate: '',
      current: false
    });
  };

  const handleSaveNewStrength = async () => {
    const strength: Strength = {
      ...newStrength,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      strengths: [...(data?.strengths || []), strength]
    };
    setData(updatedData);
    await saveDataToDB(updatedData);
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

  const handleSaveNewTestimonial = async () => {
    const testimonial: Testimonial = {
      ...newTestimonial,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      testimonials: [...(data?.testimonials || []), testimonial]
    };
    setData(updatedData);
    await saveDataToDB(updatedData);
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

  const handleSaveNewSocialLink = async () => {
    const link: SocialLink = {
      ...newSocialLink,
      id: Date.now().toString()
    };
    const updatedData = {
      ...data!,
      socialLinks: [...(data?.socialLinks || []), link]
    };
    setData(updatedData);
    await saveDataToDB(updatedData);
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

  const handleSaveEdit = async () => {
    if (editData) {
      setData(editData);
      await saveDataToDB(editData);
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
        // Update editData if we're in edit mode, otherwise update data directly
        if (editData) {
          setEditData({ ...editData, profileImage: imageData });
        } else {
        const updatedData = { ...data, profileImage: imageData };
        setData(updatedData);
          saveDataToDB(updatedData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    // Update editData if we're in edit mode, otherwise update data directly
    if (editData) {
      setEditData({ ...editData, profileImage: null });
    } else {
    const updatedData = { ...data, profileImage: null };
    setData(updatedData);
      saveDataToDB(updatedData);
    }
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

          {/* Back to Dashboard, Settings & Logout Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/home')}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-all flex items-center gap-2"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all flex items-center gap-2"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
              className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 hover:border-red-300 rounded-lg transition-all flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
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

        <nav className="px-6 pt-6 pb-3 space-y-3">
          {menuItems.map((item, index) => (
            <div 
              key={item.id} 
              className="relative group"
            >
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
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeSection === item.id
                      ? 'bg-white/10'
                      : 'bg-gray-100'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      activeSection === item.id ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex flex-col flex-1">
                  <span className="font-semibold">{item.label}</span>
                    <span className={`text-xs ${
                      activeSection === item.id ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {item.id === 'personal' && (data.profileImage ? 'Photo uploaded' : 'Complete profile')}
                      {item.id === 'experience' && sectionConfig[item.id]?.hasData() && `${careerHighlights.length} ${careerHighlights.length === 1 ? 'item' : 'items'}`}
                      {item.id === 'projects' && sectionConfig[item.id]?.hasData() && `${projects.length} ${projects.length === 1 ? 'item' : 'items'}`}
                      {item.id === 'strengths' && sectionConfig[item.id]?.hasData() && `${strengths.length} ${strengths.length === 1 ? 'item' : 'items'}`}
                      {item.id === 'testimonials' && sectionConfig[item.id]?.hasData() && `${testimonials.length} ${testimonials.length === 1 ? 'item' : 'items'}`}
                      {item.id === 'links' && sectionConfig[item.id]?.hasData() && (() => {
                        const totalLinks = socialLinks.length + (data.email ? 1 : 0) + (data.phone ? 1 : 0);
                        return `${totalLinks} ${totalLinks === 1 ? 'link' : 'links'}`;
                      })()}
                      {item.id === 'companies' && sectionConfig[item.id]?.hasData() && `${sliderCompanies.length} ${sliderCompanies.length === 1 ? 'company' : 'companies'}`}
                      {item.id === 'resume' && sectionConfig[item.id]?.hasData() && 'Uploaded'}
                      {item.id === 'footer' && (sectionConfig[item.id]?.hasData() ? 'Customized' : 'Default')}
                    </span>
                  </div>
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
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-800">
                              <strong>Note:</strong> Update your Full Name, Email, and Profession in <button onClick={() => router.push('/settings')} className="underline font-semibold hover:text-blue-900">Settings</button>
                            </p>
                          </div>
                          
                          {/* Profile Photo Upload */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Profile Photo</label>
                            <div className="flex items-center gap-4">
                              <div className="relative group/photo">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                                  {editData.profileImage ? (
                                    <img 
                                      src={editData.profileImage} 
                                      alt="Profile" 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-10 h-10 text-gray-400" />
                                  )}
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
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
                                {editData.profileImage && (
                                  <button
                                    onClick={handleRemoveImage}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity"
                                    title="Remove image"
                                  >
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-600 mb-2">Upload a professional photo</p>
                                <label className="inline-block">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                  />
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-all cursor-pointer">
                                    <Plus className="w-3 h-3" />
                                    Upload Photo
                                  </span>
                                </label>
                                {editData.profileImage && (
                                  <button
                                    onClick={handleRemoveImage}
                                    className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-all"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Hero Heading</label>
                            <input
                              type="text"
                              value={editData.heading || `Hi, I'm ${editData.fullName?.split(' ')[0] || 'Your Name'}.`}
                              onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                              placeholder="Hi, I'm John."
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Customize your main heading (e.g., "Hi, I'm John." or "Welcome!")</p>
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
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">About Me</label>
                            <textarea
                              value={editData.whoAreYou}
                              onChange={(e) => setEditData({ ...editData, whoAreYou: e.target.value })}
                              rows={4}
                              maxLength={100}
                              placeholder="Write a brief description about yourself (max 100 characters)"
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">{100 - (editData.whoAreYou?.length || 0)} characters left</p>
                          </div>
                        </>
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
                      
                      {item.id === 'projects' && editData && (
                        <div className="space-y-3">
                          {/* Projects List */}
                          {(editData.projects || []).map((project) => (
                            <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                              <input
                                type="text"
                                value={project.title}
                                onChange={(e) => handleUpdateProject(project.id, 'title', e.target.value)}
                                placeholder="Project title"
                                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 font-semibold"
                              />
                              <textarea
                                value={project.description}
                                onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                                placeholder="Short description"
                                rows={2}
                                className="w-full px-3 py-2 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={() => router.push(`/project/${project.id}`)}
                                  className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                                >
                                  Edit Full Page →
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveProject(project.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          
                          {/* Add New Project Button */}
                          <button
                            onClick={handleAddProject}
                            className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 inline-flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Project</span>
                          </button>
                        </div>
                      )}
                      
                      {item.id === 'experience' && editData && (
                        <div className="space-y-3">
                          {/* Career Highlights List */}
                          {(editData.careerHighlights || []).map((highlight, index) => (
                            <div key={highlight.id} className="bg-white border border-gray-200 rounded-lg p-3">
                              {editingHighlight?.id === highlight.id ? (
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
                                    placeholder="One line about what this company/project is about"
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
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label className="block text-xs font-medium text-gray-700">Your Achievements (up to 3)</label>
                                      {(highlight.achievements || []).length < 3 && (
                                        <button
                                          onClick={() => {
                                            const newAchievements = [...(highlight.achievements || []), ''];
                                            handleUpdateHighlight(highlight.id, 'achievements', newAchievements);
                                          }}
                                          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                        >
                                          <Plus className="w-3 h-3" />
                                          Add
                                        </button>
                                      )}
                                    </div>
                                    {(highlight.achievements || []).map((achievement, index) => (
                                      <div key={index} className="flex items-start gap-1">
                                        <input
                                          type="text"
                                          value={achievement || ''}
                                          onChange={(e) => {
                                            const newAchievements = [...(highlight.achievements || [])];
                                            newAchievements[index] = e.target.value;
                                            handleUpdateHighlight(highlight.id, 'achievements', newAchievements);
                                          }}
                                          placeholder={`Achievement ${index + 1}`}
                                          className="flex-1 px-2 py-1.5 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                                        />
                                        <button
                                          onClick={() => {
                                            const newAchievements = (highlight.achievements || []).filter((_, i) => i !== index);
                                            handleUpdateHighlight(highlight.id, 'achievements', newAchievements);
                                          }}
                                          className="flex-shrink-0 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                          title="Remove achievement"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                    {(highlight.achievements || []).length === 0 && (
                                      <p className="text-xs text-gray-500 italic">No achievements added yet</p>
                                    )}
                                  </div>
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
                                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900 group">
                                    <input
                                      type="checkbox"
                                      checked={highlight.current || highlight.endDate === 'Present'}
                                      onChange={(e) => handleUpdateHighlight(highlight.id, 'current', e.target.checked)}
                                      className="w-4 h-4 rounded border-2 border-gray-300 cursor-pointer transition-all
                                        checked:bg-gray-900 checked:border-gray-900 
                                        focus:ring-2 focus:ring-gray-900 focus:ring-offset-0
                                        appearance-none
                                        relative
                                        checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
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
                                        onClick={() => setEditingHighlight(highlight)}
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

                      {/* Footer Editing */}
                      {item.id === 'footer' && editData && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Footer Call-to-Action</label>
                            <input
                              type="text"
                              value={editData.footerText || "Let's build something meaningful."}
                              onChange={(e) => setEditData({ ...editData, footerText: e.target.value })}
                              placeholder="Let's build something meaningful."
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Main CTA text shown in footer</p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Footer Signature</label>
                            <input
                              type="text"
                              value={editData.footerSignature || `Built with 🤍 by ${editData.fullName || 'You'}`}
                              onChange={(e) => setEditData({ ...editData, footerSignature: e.target.value })}
                              placeholder="Built with 🤍 by Muhammad Romman Nadeem"
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                            <p className="mt-1 text-xs text-gray-500">Small text shown at bottom</p>
                          </div>
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
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                                {data.profileImage ? (
                                  <img 
                                    src={data.profileImage} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-gray-900">{data.fullName}</p>
                                <p className="text-[10px] text-gray-500">{data.profileImage ? 'Photo uploaded' : 'No photo'}</p>
                              </div>
                            </div>
                            {data.heading && (
                              <p className="text-sm font-medium text-gray-900">{data.heading}</p>
                            )}
                            {data.tagline && (
                              <p className="text-xs text-gray-600 italic">{data.tagline}</p>
                            )}
                            {data.whoAreYou && (
                              <p className="text-xs text-gray-600 line-clamp-2">{data.whoAreYou}</p>
                            )}
                          </div>
                        )}
                        
                        {item.id === 'projects' && projects.length > 0 && (
                          <div className="space-y-2">
                            {projects.slice(0, 3).map((project) => (
                              <div key={project.id} className="text-xs text-gray-700 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                                <span className="font-medium truncate">{project.title}</span>
                              </div>
                            ))}
                            {projects.length > 3 && (
                              <p className="text-xs text-gray-500">+{projects.length - 3} more</p>
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
                        
                        {item.id === 'footer' && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">Call-to-Action:</p>
                            <p className="text-xs text-gray-600 italic">
                              {data.footerText || "Let's build something meaningful."}
                            </p>
                            <p className="text-[10px] text-gray-500 pt-1 border-t border-gray-200">
                              {data.footerSignature || `Built with 🤍 by ${data.fullName || 'You'}`}
                            </p>
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

        {/* Add Custom Section Button */}
        <div className="px-6 pb-6 pt-3">
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Section</span>
          </button>
        </div>
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
                      {projects.length > 0 && (
                        <a href="#projects" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                          Projects
                        </a>
                      )}
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
                    {projects.length > 0 && (
                      <a 
                        href="#projects"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`font-medium text-gray-700 hover:text-gray-900 transition-colors ${
                          previewMode === 'mobile' ? 'text-xs py-1.5' : 'text-sm py-2'
                        }`}
                      >
                        Projects
                      </a>
                    )}
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

          <div className="flex flex-col w-full items-start">

          {/* Company Slider - Full Width */}
          {sliderCompanies.length > 0 && (
            <div id="companies" className={`w-full overflow-hidden ${
              previewMode === 'mobile' ? 'py-6' : 'py-8 sm:py-12'
            }`}>
              <h3 className={`text-center font-bold tracking-wider text-gray-500 uppercase ${
                previewMode === 'mobile' ? 'text-[10px] mb-4' : 'text-xs sm:text-sm mb-6 sm:mb-8'
              }`}>
                Companies and Teams I have worked with
              </h3>
              <div className="marquee-container overflow-hidden">
                <div className="marquee-content font-lato">
                  {[...sliderCompanies, ...sliderCompanies].map((company, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center font-black text-gray-400 whitespace-nowrap ${
                        previewMode === 'mobile' ? 'px-3 text-base' : 'px-4 sm:px-6 lg:px-8 text-lg sm:text-xl lg:text-3xl'
                      }`}
                    >
                      {company}
                      <span className={previewMode === 'mobile' ? 'mx-2 text-gray-300' : 'mx-3 sm:mx-4 lg:mx-6 text-gray-300'}>•</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Personal Info Section */}
          <div id="personal" className={`w-full flex flex-col ${
            previewMode === 'mobile' ? 'max-w-md px-4 mb-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16'
          }`}>
            <div className={`flex items-start ${
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
                  {data.heading || `Hi, I'm ${data.fullName?.split(' ')[0] || 'Your Name'}.`}
                </h1>
                {data.tagline && (
                  <p className={`text-gray-700 font-medium ${
                    previewMode === 'mobile' ? 'text-sm mb-3' : 'text-lg sm:text-xl mb-4 sm:mb-6 lg:mb-8'
                  }`}>{data.tagline}</p>
                )}
              </div>
            </div>

            {/* About Text */}
            {data.whoAreYou && (
              <div className={`text-gray-700 leading-relaxed ${
                previewMode === 'mobile' ? 'text-xs mt-4' : 'text-base sm:text-lg mt-6 sm:mt-8'
              }`}>
                <p>{data.whoAreYou}</p>
              </div>
            )}
          </div>

          {/* Social Links Section */}
          <div id="links" className={`w-full flex flex-col ${
            previewMode === 'mobile' ? 'max-w-md px-4 mb-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16'
          }`}>
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
          </div>

          {/* Projects Section */}
          {(projects.length > 0 || viewMode === 'edit') && (
            <div 
              id="projects" 
              className={`w-full flex flex-col relative ${
                previewMode === 'mobile' ? 'max-w-md px-4 mb-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'
              }`}>
              <div className={`flex items-center gap-2 ${previewMode === 'mobile' ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
                <div className={`rounded-lg bg-purple-100 flex items-center justify-center ${
                  previewMode === 'mobile' ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
                }`}>
                  <Briefcase className={previewMode === 'mobile' ? 'w-3 h-3 text-purple-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-purple-600'} />
                </div>
                <h2 className={`font-bold text-gray-900 ${
                  previewMode === 'mobile' ? 'text-base' : 'text-2xl sm:text-3xl'
                }`}>Projects</h2>
              </div>
              
              {projects.length > 0 ? (
                <div className={`grid ${
                  previewMode === 'mobile' ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'
                }`}>
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group/card cursor-pointer ${
                        previewMode === 'mobile' ? 'p-3' : 'p-6'
                      }`}
                      onClick={() => router.push(`/detail/project/${project.id}`)}
                    >
                      {/* Edit Icon - Only in Edit Mode */}
                      {viewMode === 'edit' && editingProject?.id !== project.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                          }}
                          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md border border-gray-200 opacity-0 group-hover/card:opacity-100 hover:bg-gray-50 hover:scale-110 transition-all z-10"
                        >
                          <Pencil className="w-4 h-4 text-gray-700" />
                        </button>
                      )}
                      
                      <h3 className={`font-bold text-purple-600 mb-2 ${
                        previewMode === 'mobile' ? 'text-sm' : 'text-lg'
                      }`}>
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className={`text-gray-700 leading-relaxed ${
                          previewMode === 'mobile' ? 'text-[11px]' : 'text-sm'
                        }`}>
                          {project.description}
                        </p>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Arrow Icon - Bottom Right (always shows for projects) */}
                      <div className="absolute bottom-3 right-3">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-md">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add More Skeleton Block */}
                  {viewMode === 'edit' && !addingProject && (
                    <button
                      onClick={() => setAddingProject(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all group mt-2"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-all">
                          <Plus className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                          Add a new project
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              ) : viewMode === 'edit' && !addingProject && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No projects added yet</p>
                  <button
                    onClick={() => setAddingProject(true)}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Project</span>
                  </button>
                </div>
              )}

              {/* Add New Project Form */}
              {viewMode === 'edit' && addingProject && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mt-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-600" />
                    Add New Project
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="Project Title *"
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Brief description for the card"
                      rows={3}
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                    />
                    <input
                      type="url"
                      value={newProject.link}
                      onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                      placeholder="External Link (optional)"
                      className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={newProject.tags.join(', ')}
                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                        placeholder="React, TypeScript, Design"
                        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleDiscardNewProject}
                      className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSaveNewProject}
                      disabled={!newProject.title}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Career Highlights Section */}
          {(careerHighlights.length > 0 || viewMode === 'edit') && (
            <div id="experience" className={`w-full flex flex-col ${
              previewMode === 'mobile' ? 'max-w-md px-4 mb-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'
            }`}>
              <div className={`flex items-center gap-2 ${previewMode === 'mobile' ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
                <div className={`rounded-lg bg-blue-100 flex items-center justify-center ${
                  previewMode === 'mobile' ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
                }`}>
                  <Award className={previewMode === 'mobile' ? 'w-3 h-3 text-blue-600' : 'w-4 h-4 sm:w-5 sm:h-5 text-blue-600'} />
                </div>
                <h2 className={`font-bold text-gray-900 ${
                  previewMode === 'mobile' ? 'text-base' : 'text-2xl sm:text-3xl'
                }`}>Career Highlights</h2>
              </div>
              
              {careerHighlights.length > 0 || (viewMode === 'edit' && addingCareerHighlight) ? (
                <>
                  {careerHighlights.length > 0 && (
                  <div className={previewMode === 'mobile' ? 'space-y-3' : 'space-y-4 sm:space-y-6'}>
                    {careerHighlights.slice(0, 6).map((highlight, index) => (
                  <div key={highlight.id} className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group/card ${
                    previewMode === 'mobile' ? 'p-3' : 'p-6 sm:p-8'
                  }`}>
                    {/* Edit Icon - Only in Edit Mode and when not editing */}
                    {viewMode === 'edit' && editingHighlight?.id !== highlight.id && (
                      <button
                        onClick={() => setEditingHighlight(highlight)}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md border border-gray-200 opacity-0 group-hover/card:opacity-100 hover:bg-gray-50 hover:scale-110 transition-all z-10"
                      >
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </button>
                    )}
                    
                    {/* Inline Edit Form */}
                    {viewMode === 'edit' && editingHighlight?.id === highlight.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={highlight.organization}
                            onChange={(e) => handleUpdateHighlight(highlight.id, 'organization', e.target.value)}
                            placeholder="Organization/Project *"
                            className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <input
                            type="text"
                            value={highlight.role}
                            onChange={(e) => handleUpdateHighlight(highlight.id, 'role', e.target.value)}
                            placeholder="Role *"
                            className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <textarea
                          value={highlight.description}
                          onChange={(e) => handleUpdateHighlight(highlight.id, 'description', e.target.value)}
                          placeholder="One line about what this company/project is about"
                          rows={2}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                        />
                        <input
                          type="url"
                          value={highlight.link}
                          onChange={(e) => handleUpdateHighlight(highlight.id, 'link', e.target.value)}
                          placeholder="Link (optional)"
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">Your Achievements (up to 3)</label>
                            {(highlight.achievements || []).length < 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newAchievements = [...(highlight.achievements || []), ''];
                                  handleUpdateHighlight(highlight.id, 'achievements', newAchievements);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add
                              </button>
                            )}
                          </div>
                          {(highlight.achievements || []).map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <input
                                type="text"
                                value={achievement || ''}
                                onChange={(e) => {
                                  const newAchievements = [...(highlight.achievements || [])];
                                  newAchievements[index] = e.target.value;
                                  handleUpdateHighlight(highlight.id, 'achievements', newAchievements);
                                }}
                                placeholder={`Achievement ${index + 1}`}
                                className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newAchievements = (highlight.achievements || []).filter((_, i) => i !== index);
                                  handleUpdateHighlight(highlight.id, 'achievements', newAchievements);
                                }}
                                className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Remove achievement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {(highlight.achievements || []).length === 0 && (
                            <p className="text-sm text-gray-500 italic">Click "Add" to add your accomplishments</p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                            <MonthYearPicker
                              value={highlight.startDate || ''}
                              onChange={(value) => handleUpdateHighlight(highlight.id, 'startDate', value)}
                              placeholder="Select month"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                            <MonthYearPicker
                              value={highlight.current || highlight.endDate === 'Present' ? 'Present' : (highlight.endDate || '')}
                              onChange={(value) => handleUpdateHighlight(highlight.id, 'endDate', value)}
                              placeholder={highlight.current || highlight.endDate === 'Present' ? 'Present' : 'Select month'}
                              disabled={highlight.current || highlight.endDate === 'Present'}
                            />
                          </div>
                        </div>
                        
                        {/* Date Validation Error */}
                        {dateValidationError && editingHighlight?.id === highlight.id && (
                          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            <p className="text-xs text-red-600 font-medium">{dateValidationError}</p>
                          </div>
                        )}
                        
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={highlight.current || highlight.endDate === 'Present'}
                            onChange={(e) => handleUpdateHighlight(highlight.id, 'current', e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer transition-all
                              checked:bg-gray-900 checked:border-gray-900 
                              focus:ring-2 focus:ring-gray-900 focus:ring-offset-0
                              appearance-none
                              relative
                              checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                          />
                          <span className="text-sm text-gray-700">Currently working here</span>
                        </label>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={highlight.isPageBlock || false}
                              onChange={(e) => handleUpdateHighlight(highlight.id, 'isPageBlock', e.target.checked)}
                              className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer transition-all
                                checked:bg-blue-600 checked:border-blue-600 
                                focus:ring-2 focus:ring-blue-600 focus:ring-offset-0
                                appearance-none
                                relative
                                checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                            />
                            <span className="text-sm text-gray-700">Make this a Page Block (creates dedicated page)</span>
                          </label>
                          {highlight.isPageBlock && (
                            <button
                              onClick={() => router.push(`/detail/highlight/${highlight.id}`)}
                              className="mt-2 text-blue-600 hover:text-blue-700 text-xs font-medium"
                            >
                              Edit Full Page →
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setEditingHighlight(null)}
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => handleRemoveHighlight(highlight.id)}
                            className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                      {!highlight.isPageBlock && highlight.link && (
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
                    {highlight.achievements && Array.isArray(highlight.achievements) && highlight.achievements.some(a => a && a.trim()) && (
                      <div className={`space-y-2 ${previewMode === 'mobile' ? 'mt-2' : 'mt-4'}`}>
                        {highlight.achievements.filter(achievement => achievement && achievement.trim()).map((achievement, idx) => (
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
                    
                    {/* Page Block Arrow - Bottom Right */}
                    {highlight.isPageBlock && (
                      <button
                        onClick={() => router.push(`/detail/highlight/${highlight.id}`)}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 hover:bg-purple-100 transition-all shadow-md"
                        title="View full page"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                    </>
                    )}
                  </div>
                    ))}
                  </div>
                  )}
                  
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
                  {viewMode === 'edit' && !addingCareerHighlight && careerHighlights.length > 0 && (
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
                          placeholder="One line about what this company/project is about"
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
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">Your Achievements (up to 3)</label>
                            {(newCareerHighlight.achievements || []).length < 3 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newAchievements = [...(newCareerHighlight.achievements || []), ''];
                                  setNewCareerHighlight({ ...newCareerHighlight, achievements: newAchievements });
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                <Plus className="w-4 h-4" />
                                Add Achievement
                              </button>
                            )}
                          </div>
                          {(newCareerHighlight.achievements || []).map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <input
                                type="text"
                                value={achievement || ''}
                                onChange={(e) => {
                                  const newAchievements = [...(newCareerHighlight.achievements || [])];
                                  newAchievements[index] = e.target.value;
                                  setNewCareerHighlight({ ...newCareerHighlight, achievements: newAchievements });
                                }}
                                placeholder={`Achievement ${index + 1}`}
                                className="flex-1 px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newAchievements = (newCareerHighlight.achievements || []).filter((_, i) => i !== index);
                                  setNewCareerHighlight({ ...newCareerHighlight, achievements: newAchievements });
                                }}
                                className="flex-shrink-0 p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove achievement"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          {(newCareerHighlight.achievements || []).length === 0 && (
                            <p className="text-sm text-gray-500 italic">Click "Add Achievement" to add your accomplishments</p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <MonthYearPicker
                              value={newCareerHighlight.startDate || ''}
                              onChange={(value) => setNewCareerHighlight({ ...newCareerHighlight, startDate: value })}
                              placeholder="Select month"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <MonthYearPicker
                              value={newCareerHighlight.current ? 'Present' : (newCareerHighlight.endDate || '')}
                              onChange={(value) => setNewCareerHighlight({ ...newCareerHighlight, endDate: value })}
                              placeholder={newCareerHighlight.current ? 'Present' : 'Select month'}
                              disabled={newCareerHighlight.current}
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={newCareerHighlight.current}
                            onChange={(e) => setNewCareerHighlight({ ...newCareerHighlight, current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
                            className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer transition-all
                              checked:bg-gray-900 checked:border-gray-900 
                              focus:ring-2 focus:ring-gray-900 focus:ring-offset-0
                              appearance-none
                              relative
                              checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
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
            </div>
          )}

          {/* Strengths Section */}
          {(strengths.length > 0 || viewMode === 'edit') && (
            <div id="strengths" className={`w-full flex flex-col ${
              previewMode === 'mobile' ? 'max-w-md px-4 mb-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'
            }`}>
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
                  <div 
                    key={strength.id} 
                    className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group/card ${
                      previewMode === 'mobile' ? 'p-3' : 'p-6'
                    } ${strength.isPageBlock ? 'cursor-pointer' : ''}`}
                    onClick={() => strength.isPageBlock && router.push(`/detail/strength/${strength.id}`)}
                  >
                    {/* Edit Icon - Only in Edit Mode and when not editing */}
                    {viewMode === 'edit' && editingStrength?.id !== strength.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingStrength(strength);
                        }}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md border border-gray-200 opacity-0 group-hover/card:opacity-100 hover:bg-gray-50 hover:scale-110 transition-all z-10"
                      >
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </button>
                    )}
                    
                    
                    {/* Inline Edit Form */}
                    {viewMode === 'edit' && editingStrength?.id === strength.id ? (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <EmojiPicker
                            value={strength.icon}
                            onChange={(emoji) => handleUpdateStrength(strength.id, 'icon', emoji)}
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={strength.title}
                              onChange={(e) => handleUpdateStrength(strength.id, 'title', e.target.value)}
                              placeholder="Strength title *"
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                            />
                            <textarea
                              value={strength.description}
                              onChange={(e) => handleUpdateStrength(strength.id, 'description', e.target.value)}
                              placeholder="Brief description"
                              rows={2}
                              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                            />
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={strength.isPageBlock || false}
                              onChange={(e) => handleUpdateStrength(strength.id, 'isPageBlock', e.target.checked as any)}
                              className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer transition-all
                                checked:bg-orange-600 checked:border-orange-600 
                                focus:ring-2 focus:ring-orange-600 focus:ring-offset-0
                                appearance-none
                                relative
                                checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
                            />
                            <span className="text-sm text-gray-700">Make this a Page Block (creates dedicated page)</span>
                          </label>
                          {strength.isPageBlock && (
                            <button
                              onClick={() => router.push(`/detail/strength/${strength.id}`)}
                              className="mt-2 text-orange-600 hover:text-orange-700 text-xs font-medium"
                            >
                              Edit Full Page →
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingStrength(null)}
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => handleRemoveStrength(strength.id)}
                            className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                        
                        {/* Page Block Arrow - Bottom Right */}
                        {strength.isPageBlock && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/detail/strength/${strength.id}`);
                            }}
                            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition-all shadow-md"
                            title="View full page"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        )}
                      </>
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
            <div id="testimonials" className={`w-full flex flex-col ${
              previewMode === 'mobile' ? 'max-w-md px-4 mb-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'
            }`}>
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
                  <div key={testimonial.id} className={`bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group/card ${
                    previewMode === 'mobile' ? 'p-3' : 'p-6'
                  }`}>
                    {/* Edit Icon - Only in Edit Mode and when not editing */}
                    {viewMode === 'edit' && editingTestimonial?.id !== testimonial.id && (
                      <button
                        onClick={() => setEditingTestimonial(testimonial)}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md border border-gray-200 opacity-0 group-hover/card:opacity-100 hover:bg-gray-50 hover:scale-110 transition-all z-10"
                      >
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </button>
                    )}
                    
                    {/* Inline Edit Form */}
                    {viewMode === 'edit' && editingTestimonial?.id === testimonial.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => handleUpdateTestimonial(testimonial.id, 'name', e.target.value)}
                          placeholder="Full Name *"
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                          type="text"
                          value={testimonial.title}
                          onChange={(e) => handleUpdateTestimonial(testimonial.id, 'title', e.target.value)}
                          placeholder="Title/Affiliation *"
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                          type="url"
                          value={testimonial.linkedinUrl}
                          onChange={(e) => handleUpdateTestimonial(testimonial.id, 'linkedinUrl', e.target.value)}
                          placeholder="LinkedIn URL (optional)"
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <textarea
                          value={testimonial.testimonial}
                          onChange={(e) => handleUpdateTestimonial(testimonial.id, 'testimonial', e.target.value)}
                          placeholder="Testimonial text *"
                          rows={3}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingTestimonial(null)}
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => handleRemoveTestimonial(testimonial.id)}
                            className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                    </>
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
            <div id="resume" className={`w-full flex flex-col ${
              previewMode === 'mobile' ? 'max-w-md px-4 mb-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'
            }`}>
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
                  }`}>Resume.pdf</p>
                  <p className={`text-gray-600 ${
                    previewMode === 'mobile' ? 'text-xs' : 'text-sm sm:text-base'
                  }`}>View or download your resume</p>
                </div>
                <div className={`flex gap-2 ${
                  previewMode === 'mobile' ? 'w-full flex-col' : 'flex-row'
                }`}>
                  <a
                    href={data.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 ${
                      previewMode === 'mobile' ? 'w-full px-3 py-2 text-xs' : 'px-4 py-2 text-sm'
                    }`}
                  >
                    <Eye className={previewMode === 'mobile' ? 'w-3 h-3' : 'w-4 h-4'} />
                    View
                  </a>
                  <a
                    href={data.resume}
                    download
                    className={`bg-white text-gray-900 border-2 border-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 ${
                      previewMode === 'mobile' ? 'w-full px-3 py-2 text-xs' : 'px-4 py-2 text-sm'
                    }`}
                  >
                    <FileText className={previewMode === 'mobile' ? 'w-3 h-3' : 'w-4 h-4'} />
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {(data.customSections || []).map((customSection) => (
            <div 
              key={customSection.id}
              id={`custom-${customSection.id}`}
              className={`w-full flex flex-col ${
                previewMode === 'mobile' ? 'max-w-md px-4 mb-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20'
              }`}
            >
              <div className={`flex items-center gap-2 ${previewMode === 'mobile' ? 'mb-3' : 'mb-6 sm:mb-8'}`}>
                <div className={`rounded-lg bg-indigo-100 flex items-center justify-center ${
                  previewMode === 'mobile' ? 'w-5 h-5' : 'w-7 h-7 sm:w-8 sm:h-8'
                }`}>
                  <span className={previewMode === 'mobile' ? 'text-xs' : 'text-base sm:text-lg'}>
                    {customSection.icon}
                  </span>
                </div>
                <h2 className={`font-bold text-gray-900 ${
                  previewMode === 'mobile' ? 'text-base' : 'text-2xl sm:text-3xl'
                }`}>{customSection.title}</h2>
              </div>

              {/* Text Type */}
              {customSection.type === 'text' && customSection.data && (
                <p className={`text-gray-700 ${
                  previewMode === 'mobile' ? 'text-sm' : 'text-base sm:text-lg'
                }`}>{customSection.data}</p>
              )}

              {/* Textarea Type */}
              {customSection.type === 'textarea' && customSection.data && (
                <p className={`text-gray-700 whitespace-pre-wrap ${
                  previewMode === 'mobile' ? 'text-sm' : 'text-base sm:text-lg'
                }`}>{customSection.data}</p>
              )}

              {/* List Type */}
              {customSection.type === 'list' && Array.isArray(customSection.data) && customSection.data.length > 0 && (
                <ul className={`space-y-2 list-disc list-inside ${
                  previewMode === 'mobile' ? 'text-sm' : 'text-base sm:text-lg'
                }`}>
                  {customSection.data.filter((item: string) => item.trim() !== '').map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              )}

              {/* Cards/Grid Type */}
              {(customSection.type === 'cards' || customSection.type === 'grid') && Array.isArray(customSection.data) && customSection.data.length > 0 && (
                <div className={`grid gap-4 ${
                  customSection.type === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {customSection.data.filter((item: any) => item && Object.keys(item).length > 0).map((item: any, index: number) => (
                    <div 
                      key={index}
                      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all ${
                        previewMode === 'mobile' ? 'p-3' : 'p-4 sm:p-6'
                      }`}
                    >
                      {item.title && (
                        <h3 className={`font-semibold text-gray-900 mb-2 ${
                          previewMode === 'mobile' ? 'text-sm' : 'text-base sm:text-lg'
                        }`}>{item.title}</h3>
                      )}
                      {item.description && (
                        <p className={`text-gray-600 ${
                          previewMode === 'mobile' ? 'text-xs' : 'text-sm sm:text-base'
                        }`}>{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!customSection.data || (Array.isArray(customSection.data) && customSection.data.length === 0) && (
                <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center ${
                  previewMode === 'mobile' ? 'p-6' : 'p-8 sm:p-12'
                }`}>
                  <p className={`text-gray-400 ${
                    previewMode === 'mobile' ? 'text-sm' : 'text-base'
                  }`}>No content added yet</p>
                </div>
              )}
            </div>
          ))}

          {/* Footer Section */}
          <div id="footer" className={`w-full flex flex-col border-t border-gray-200 ${
            previewMode === 'mobile' ? 'max-w-md px-4 mt-8 pt-6' : 'max-w-5xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 lg:mt-24 pt-8 sm:pt-10 lg:pt-12'
          }`}>
            <div className={`flex items-start justify-between ${
              previewMode === 'mobile' ? 'flex-col gap-4' : 'flex-col sm:flex-row sm:items-center gap-6 sm:gap-4'
            }`}>
              <h2 className={`font-bold text-gray-900 ${
                previewMode === 'mobile' ? 'text-lg' : 'text-2xl sm:text-3xl lg:text-4xl'
              }`}>
                {data.footerText || "Let's build something meaningful."}
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
                {socialLinks.find(link => link.platform === 'LinkedIn') && (
                <a
                    href={socialLinks.find(link => link.platform === 'LinkedIn')?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  className={`rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-all ${
                    previewMode === 'mobile' ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'
                  }`}
                >
                  <Linkedin className={previewMode === 'mobile' ? 'w-4 h-4 text-gray-600' : 'w-5 h-5 sm:w-6 sm:h-6 text-gray-600'} />
                </a>
                )}
              </div>
            </div>
            <p className={`text-center text-gray-500 ${
              previewMode === 'mobile' ? 'text-[10px] mt-4 mb-6' : 'text-xs sm:text-sm mt-6 sm:mt-8 mb-8 sm:mb-10 lg:mb-12'
            }`}>
              {data.footerSignature || `Built with 🤍 by ${data.fullName || 'You'}`}
            </p>
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
                  {highlight.achievements && Array.isArray(highlight.achievements) && highlight.achievements.some((a: string) => a && a.trim()) && (
                    <div className="space-y-2 mt-4">
                      {highlight.achievements.filter((achievement: string) => achievement && achievement.trim()).map((achievement: string, idx: number) => (
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
  );
}

