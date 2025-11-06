import { 
  User, Award, Star, Briefcase, MessageSquare, 
  FileText, Link as LinkIcon, AlignLeft 
} from 'lucide-react';

export interface SectionMetadata {
  id: string;
  label: string;
  icon: any;
  color: string;
  defaultOrder: number;
  alwaysVisible?: boolean;
}

export const SECTION_METADATA: Record<string, SectionMetadata> = {
  personal: {
    id: 'personal',
    label: 'Personal Info',
    icon: User,
    color: 'gray',
    defaultOrder: 0,
    alwaysVisible: true
  },
  links: {
    id: 'links',
    label: 'Social Links',
    icon: LinkIcon,
    color: 'blue',
    defaultOrder: 1
  },
  companies: {
    id: 'companies',
    label: 'Companies Slider',
    icon: Star,
    color: 'gray',
    defaultOrder: 2
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    icon: Briefcase,
    color: 'purple',
    defaultOrder: 3
  },
  experience: {
    id: 'experience',
    label: 'Career Highlights',
    icon: Award,
    color: 'blue',
    defaultOrder: 4
  },
  strengths: {
    id: 'strengths',
    label: 'Strengths',
    icon: Star,
    color: 'orange',
    defaultOrder: 5
  },
  testimonials: {
    id: 'testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
    color: 'blue',
    defaultOrder: 6
  },
  resume: {
    id: 'resume',
    label: 'Resume',
    icon: FileText,
    color: 'purple',
    defaultOrder: 7
  },
  footer: {
    id: 'footer',
    label: 'Footer',
    icon: AlignLeft,
    color: 'gray',
    defaultOrder: 8,
    alwaysVisible: true
  }
};

export const DEFAULT_SECTION_ORDER = [
  'personal',
  'links', 
  'companies',
  'projects',
  'experience',
  'strengths',
  'testimonials',
  'resume',
  'footer'
];

// Layout Presets
export const LAYOUT_PRESETS = {
  developer: {
    name: 'Developer',
    description: 'Perfect for software engineers',
    sections: ['personal', 'links', 'experience', 'projects', 'strengths', 'footer']
  },
  designer: {
    name: 'Designer',
    description: 'Showcase your creative work',
    sections: ['personal', 'links', 'projects', 'experience', 'testimonials', 'footer']
  },
  pm: {
    name: 'Product Manager',
    description: 'Highlight leadership and impact',
    sections: ['personal', 'links', 'experience', 'strengths', 'testimonials', 'footer']
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple',
    sections: ['personal', 'links', 'experience', 'footer']
  },
  complete: {
    name: 'Complete',
    description: 'Show everything',
    sections: DEFAULT_SECTION_ORDER
  }
};


