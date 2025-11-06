'use client';

import { Briefcase, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export interface PortfolioData {
  // Support both old and new field names
  name?: string;
  fullName?: string;
  role?: string;
  profession?: string;
  tagline?: string;
  about?: string;
  whoAreYou?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: { platform: string; url: string }[];
  socialLinks?: { platform: string; url: string; icon?: string }[];
  avatarUrl?: string;
  profileImage?: string;
  // Old format
  experiences?: {
    id: string;
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    highlights: string[];
    logoUrl?: string;
  }[];
  // New format
  careerHighlights?: {
    id: string;
    organization: string;
    role: string;
    description?: string;
    achievements: string[];
    startDate: string;
    endDate: string;
    current?: boolean;
  }[];
  projects?: {
    id: string;
    name?: string;
    title?: string;
    summary?: string;
    description?: string;
    role?: string;
    year?: string;
    tags?: string[];
    links?: { label: string; url: string }[];
    coverUrl?: string;
    thumbnail?: string;
  }[];
  theme?: 'clean' | 'mono' | 'grid';
}

interface PortfolioPreviewProps {
  data: PortfolioData;
  showPlaceholders?: boolean;
}

export default function PortfolioPreview({ data, showPlaceholders = false }: PortfolioPreviewProps) {
  const theme = data.theme || 'clean';
  
  const themeClasses = {
    clean: 'bg-white',
    mono: 'bg-gray-50',
    grid: 'bg-white'
  };

  // Support both old and new field names
  const displayName = data.fullName || data.name || '';
  const displayRole = data.profession || data.role || '';
  const displayAbout = data.whoAreYou || data.about || '';
  const displayAvatar = data.profileImage || data.avatarUrl;
  const displayLinks = data.socialLinks || data.links || [];
  const displayExperiences = data.careerHighlights || data.experiences || [];
  const displayProjects = data.projects || [];

  return (
    <div className={`${themeClasses[theme]} min-h-screen`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-start gap-6 mb-6">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              showPlaceholders && (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {displayName ? displayName.charAt(0) : '?'}
                  </span>
                </div>
              )
            )}
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {displayName || (showPlaceholders ? 'Your Name' : '')}
              </h1>
              <p className="text-xl text-gray-600 mb-3">
                {displayRole || (showPlaceholders ? 'Your Role' : '')}
              </p>
              {data.tagline && (
                <p className="text-lg text-gray-700 font-medium">
                  {data.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {data.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {data.location}
              </div>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-1 hover:text-indigo-600">
                <Mail className="w-4 h-4" />
                {data.email}
              </a>
            )}
            {data.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-1 hover:text-indigo-600">
                <Phone className="w-4 h-4" />
                {data.phone}
              </a>
            )}
          </div>

          {/* Social Links */}
          {displayLinks && displayLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {displayLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                >
                  {link.platform}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </header>

        {/* About */}
        {displayAbout && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">
              {displayAbout}
            </p>
          </section>
        )}

        {/* Experience */}
        {displayExperiences && displayExperiences.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
            <div className="space-y-8">
              {displayExperiences.map((exp: any) => {
                // Support both old and new field names
                const expTitle = exp.role || exp.title || '';
                const expCompany = exp.organization || exp.company || '';
                const expHighlights = exp.achievements || exp.highlights || [];
                const expLocation = exp.location || '';
                
                return (
                  <div key={exp.id} className="relative pl-8 border-l-2 border-gray-200">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                    
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{expTitle}</h3>
                        <p className="text-indigo-600 font-medium">{expCompany}</p>
                      </div>
                      {exp.logoUrl && (
                        <img src={exp.logoUrl} alt={expCompany} className="w-10 h-10 rounded" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-3">
                      {exp.startDate} - {exp.endDate}
                      {expLocation && ` • ${expLocation}`}
                    </div>
                    
                    {expHighlights && expHighlights.length > 0 && (
                      <ul className="space-y-2">
                        {expHighlights.map((highlight: string, idx: number) => (
                          <li key={idx} className="text-gray-700 flex items-start gap-2">
                            <span className="text-indigo-600 mt-1.5">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {displayProjects && displayProjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
            <div className={`grid ${theme === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
              {displayProjects.map((project: any) => {
                // Support both old and new field names
                const projectName = project.title || project.name || '';
                const projectDesc = project.description || project.summary || '';
                const projectImage = project.thumbnail || project.coverUrl;
                
                return (
                  <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {projectImage && (
                      <img src={projectImage} alt={projectName} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{projectName}</h3>
                      {project.role && (
                        <p className="text-sm text-indigo-600 font-medium mb-2">{project.role}</p>
                      )}
                      <p className="text-gray-700 mb-4">{projectDesc}</p>
                      
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {project.links && project.links.length > 0 && (
                        <div className="flex gap-2">
                          {project.links.map((link: any, idx: number) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                            >
                              {link.label}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {showPlaceholders && displayExperiences.length === 0 && displayProjects.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Your experience and projects will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

