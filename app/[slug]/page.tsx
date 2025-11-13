import { Metadata } from 'next';
import { getPublishedPortfolio } from '@/lib/publishing';
import { getBaseUrl } from '@/lib/url-utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Award, 
  Briefcase, 
  Zap, 
  MessageSquare, 
  ExternalLink,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Globe,
  Calendar,
  Mail,
  Phone,
  Youtube,
  Palette,
  Edit3,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  FileText,
  Download,
  Eye,
  Star,
  Package,
} from 'lucide-react';

// This page is publicly accessible (no auth required)
export const revalidate = 60; // ISR: revalidate every 60 seconds

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPublishedPortfolio(slug);

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    };
  }

  // Handle both formats
  const fullName = (portfolio as any).fullName || (portfolio as any).profile?.full_name || 'Portfolio';
  const tagline = (portfolio as any).tagline || (portfolio as any).profile?.tagline || '';
  const profileImage = (portfolio as any).profileImage || (portfolio as any).profile?.profile_image_url;

  const baseUrl = getBaseUrl();

  return {
    title: `${fullName} - Portfolio`,
    description: tagline || `Portfolio of ${fullName}`,
    openGraph: {
      title: fullName,
      description: tagline,
      images: profileImage ? [profileImage] : [],
      url: `${baseUrl}/${slug}`,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullName,
      description: tagline,
      images: profileImage ? [profileImage] : [],
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  
  const portfolio = await getPublishedPortfolio(slug);

  if (!portfolio) {
    notFound();
  }

  // Handle both formats: legacy (flat) and new (nested with profile object)
  const profile = (portfolio as any).profile || {
    full_name: (portfolio as any).fullName,
    heading: (portfolio as any).heading,
    profession: (portfolio as any).profession,
    email: (portfolio as any).email,
    phone: (portfolio as any).phone,
    tagline: (portfolio as any).tagline,
    who_are_you: (portfolio as any).whoAreYou,
    profile_image_url: (portfolio as any).profileImage,
    resume_url: (portfolio as any).resume,
    companies: (portfolio as any).companies,
    slider_companies: (portfolio as any).sliderCompanies,
    navigation: (portfolio as any).navigation,
    footer_text: (portfolio as any).footerText,
    footer_signature: (portfolio as any).footerSignature,
  };

  if (!profile.full_name && !profile.profession) {
    notFound();
  }

  // Filter out empty Projects (require title)
  const allProjects = (portfolio as any).projects || [];
  const projects = allProjects.filter((p: any) => 
    p && 
    p.title && 
    p.title.trim().length > 0 &&
    p.title !== 'New Project'
  );
  
  // Filter out empty Career Highlights (require organization and role)
  const allCareers = (portfolio as any).careerHighlights || [];
  const careerHighlights = allCareers.filter((c: any) => 
    c && 
    c.organization && 
    c.organization.trim().length > 0 && 
    c.role && 
    c.role.trim().length > 0
  );
  
  // Filter out empty Strengths (require title)
  const allStrengths = (portfolio as any).strengths || [];
  const strengths = allStrengths.filter((s: any) => 
    s && 
    s.title && 
    s.title.trim().length > 0
  );
  
  // Filter out empty Testimonials (require name and content)
  const allTestimonials = (portfolio as any).testimonials || [];
  const testimonials = allTestimonials.filter((t: any) => 
    t && 
    t.name && 
    t.name.trim().length > 0 && 
    t.content && 
    t.content.trim().length > 0
  );
  
  // Filter out empty FAQs (require question and answer)
  const allFaqs = (portfolio as any).faqs || [];
  const faqs = allFaqs.filter((f: any) => 
    f && 
    f.question && 
    f.question.trim().length > 0 && 
    f.answer && 
    f.answer.trim().length > 0 &&
    f.is_visible !== false
  );
  
  // Filter out empty Services (require title and description)
  const allServices = (portfolio as any).services || [];
  const services = allServices.filter((s: any) => 
    s && 
    s.title && 
    s.title.trim().length > 0 && 
    s.description && 
    s.description.trim().length > 0 &&
    s.is_visible !== false
  );
  
  const socialLinks = (portfolio as any).socialLinks || [];
  const sectionOrder = (portfolio as any).sectionOrder;


  // Render sections in order
  const orderedSections = sectionOrder || ['career', 'projects', 'strengths', 'services', 'testimonials', 'faqs', 'resume'];

  // Helper to get social icon component
  const getSocialIcon = (iconName: string) => {
    const className = "w-5 h-5";
    switch (iconName) {
      case 'linkedin': return <Linkedin className={className} />;
      case 'github': return <Github className={className} />;
      case 'twitter': return <Twitter className={className} />;
      case 'instagram': return <Instagram className={className} />;
      case 'globe': return <Globe className={className} />;
      case 'calendar': return <Calendar className={className} />;
      case 'mail': return <Mail className={className} />;
      case 'phone': return <Phone className={className} />;
      case 'youtube': return <Youtube className={className} />;
      case 'behance': return <Palette className={className} />;
      case 'dribbble': return <Palette className={className} />;
      case 'medium': return <Edit3 className={className} />;
      default: return <Globe className={className} />;
    }
  };

  // Define visible sections for navigation
  const ALL_SECTIONS = [
    { id: 'overview', label: 'Overview', hasData: true },
    { id: 'experience', label: 'Experience', hasData: careerHighlights.length > 0 },
    { id: 'projects', label: 'Projects', hasData: projects.length > 0 },
    { id: 'strengths', label: 'Strengths', hasData: strengths.length > 0 },
    { id: 'services', label: 'Services', hasData: services.length > 0 },
    { id: 'testimonials', label: 'Testimonials', hasData: testimonials.length > 0 },
    { id: 'faqs', label: 'FAQs', hasData: faqs.length > 0 },
    { id: 'resume', label: 'Resume', hasData: !!profile.resume_url },
  ];
  const visibleSections = ALL_SECTIONS.filter(section => section.hasData);

  // Companies for slider
  const companiesArray = profile.slider_companies 
    ? profile.slider_companies.split(',').map((c: string) => c.trim()).filter(Boolean)
    : [];
  const duplicatedCompanies = [...companiesArray, ...companiesArray]; // For seamless scroll

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Bold modern design */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 w-full">
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Navigation Links - Horizontal scroll on mobile */}
            <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto flex-1 mr-3 sm:mr-0 scrollbar-hide">
              {visibleSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-xs sm:text-sm font-semibold hover:opacity-70 transition-opacity whitespace-nowrap"
                  style={{ color: '#111111' }}
                >
                  {section.label}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            {profile.navigation?.ctaUrl && (
              <a
                href={profile.navigation.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0"
                style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
              >
                Contact
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Companies Slider - Matching preview with marquee animation */}
      {companiesArray.length > 0 && (
        <div className="w-full bg-white py-8 sm:py-12">
          {/* Section Header */}
          <h2 className="text-center font-semibold tracking-wider text-gray-600 uppercase text-xs sm:text-sm mb-6 sm:mb-8">
            Companies and Teams I Have Worked With
          </h2>

          {/* Scrolling Company Slider */}
          <div className="marquee-container">
            <div className="marquee-content" style={{ gap: '3rem' }}>
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center text-base sm:text-lg lg:text-xl px-8 font-semibold text-gray-400 opacity-60 hover:opacity-100 hover:text-gray-600 transition-all duration-200"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Personal Section - Hero - Bold modern design */}
      <div id="overview" className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 lg:gap-12">
            {/* Profile Image */}
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <div
                className="rounded-full border-2 border-blue-200 bg-gray-100 flex items-center justify-center overflow-hidden"
                style={{ width: '100px', height: '100px' }}
              >
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center sm:text-left">
              {/* Main Heading - Bold gradient */}
              {profile.heading && (
                <h1
                  className="font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4"
                  style={{ lineHeight: '1.1' }}
                >
                  {profile.heading}
                </h1>
              )}

              {/* Tagline */}
              {profile.tagline && (
                <div className="mb-4 sm:mb-6">
                  <p className="leading-relaxed text-base sm:text-lg lg:text-xl mb-2 sm:mb-3" style={{ color: '#111111' }}>{profile.tagline}</p>
                  <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto sm:mx-0" />
                </div>
              )}

              {/* Social Links - Bold pill design */}
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {socialLinks.map((link: any) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 sm:gap-2 border-2 border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm hover:shadow-md text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                      style={{ color: '#111111' }}
                    >
                      {getSocialIcon(link.icon)}
                      <span className="font-medium">{link.platform}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Section - Bold design */}
      {profile.who_are_you && (
        <div className="w-full pb-8 sm:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
            <div className="bg-gray-50 rounded-2xl px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 border-2 border-gray-100">
              <p className="text-sm sm:text-base leading-relaxed" style={{ lineHeight: '1.7', color: '#111111' }}>
                {profile.who_are_you}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sections in order */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-12 sm:pb-16 space-y-10 sm:space-y-12 lg:space-y-16">
        {orderedSections.map((sectionId) => {
          switch (sectionId) {
            case 'career':
              if (careerHighlights.length === 0) return null;
              return (
                <section key="career" id="experience" className="w-full">
                  {/* Section Header - Bold emerald design */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="rounded-lg bg-emerald-100 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <h2 className="font-black text-2xl sm:text-3xl" style={{ color: '#111111' }}>Career Highlights</h2>
                  </div>
                  
                  {/* Career Cards */}
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    {careerHighlights.map((career) => {
                      const achievements = (career as any).key_achievements || (career as any).achievements || [];
                      const featuredIndices = (career as any).featured_achievements || [];
                      const featuredAchievements = featuredIndices.length > 0
                        ? featuredIndices.filter((idx: number) => idx < achievements.length).map((idx: number) => achievements[idx]).slice(0, 3)
                        : achievements.slice(0, 3);

                      const hasDetailPage = career.blocks && career.blocks.length > 0;
                      
                      return (
                        <Link
                          key={career.id}
                          href={`/${slug}/career/${career.id}`}
                          prefetch={true}
                          className="block bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all group relative p-4 sm:p-6 lg:p-8 cursor-pointer hover:border-emerald-300"
                        >
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2 sm:gap-0">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-base sm:text-lg" style={{ color: '#111111' }}>
                                  {career.organization}
                                </h3>
                                {(career as any).link && (
                                  <a
                                    href={(career as any).link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex text-emerald-600 hover:text-emerald-700 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  </a>
                                )}
                              </div>
                              <p className="text-emerald-600 font-semibold text-xs sm:text-sm mt-1">
                                {career.role}
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="font-medium text-xs sm:text-sm" style={{ color: '#111111' }}>
                                {(career as any).startDate || ''} - {(career as any).currentlyWorking || (career as any).current ? 'Present' : (career as any).endDate || ''}
                              </div>
                              {((career as any).currentlyWorking || (career as any).current) && (
                                <span className="inline-block bg-emerald-100 text-emerald-700 rounded-full font-semibold text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 mt-1">
                                  Current Role
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          {career.description && (
                            <p className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: '#111111' }}>{career.description}</p>
                          )}

                          {/* Featured Achievements */}
                          {featuredAchievements.length > 0 && (
                            <ul className="space-y-1 sm:space-y-1.5 mt-2 sm:mt-3">
                              {featuredAchievements.map((achievement: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm" style={{ color: '#111111' }}>
                                  <span className="flex-shrink-0 text-sm sm:text-base mt-0.5 text-emerald-500">✓</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* View Details indicator */}
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                            <span className="text-emerald-600 text-xs sm:text-sm font-semibold inline-flex items-center gap-1">
                              {hasDetailPage ? 'View Full Details' : 'View More'}
                              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );

            case 'projects':
              if (projects.length === 0) return null;
              return (
                <section key="projects" id="projects" className="w-full">
                  {/* Section Header - Bold purple design */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="rounded-lg bg-purple-100 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <h2 className="font-black text-2xl sm:text-3xl" style={{ color: '#111111' }}>Projects</h2>
                  </div>
                  
                  {/* Project Cards */}
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                      const hasDetailPage = project.blocks && project.blocks.length > 0;
                      const cardContent = (
                        <>
                          {/* Thumbnail */}
                          {project.thumbnail ? (
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-full h-40 sm:h-48 object-cover"
                            />
                          ) : (
                            <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <span className="text-5xl sm:text-6xl">💼</span>
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="p-4 sm:p-6">
                            <h3 className="font-bold text-sm sm:text-base mb-2" style={{ color: '#111111' }}>{project.title}</h3>
                            <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2" style={{ color: '#111111' }}>{project.description}</p>
                            
                            {/* Tags */}
                            {project.tags && project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {project.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-purple-100 text-purple-700 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-semibold"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      );
                      
                      if (hasDetailPage) {
                        return (
                          <Link
                            key={project.id}
                            href={`/${slug}/project/${project.id}`}
                            prefetch={true}
                            className="block bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative"
                          >
                            {cardContent}
                          </Link>
                        );
                      }
                      
                      return (
                        <div
                          key={project.id}
                          className="block bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden group relative"
                        >
                          {cardContent}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );

            case 'strengths':
              if (strengths.length === 0) return null;
              return (
                <section key="strengths" id="strengths" className="w-full">
                  {/* Section Header - Bold green design */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="rounded-lg bg-green-100 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <h2 className="font-black text-2xl sm:text-3xl" style={{ color: '#111111' }}>Strengths</h2>
                  </div>
                  
                  {/* Strength Cards */}
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {strengths.map((strength) => (
                      <div key={strength.id} className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all">
                        {strength.icon && (
                          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{strength.icon}</div>
                        )}
                        <h3 className="font-bold text-sm sm:text-base mb-1.5 sm:mb-2" style={{ color: '#111111' }}>{strength.title}</h3>
                        <p className="text-xs sm:text-sm" style={{ color: '#111111' }}>{strength.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'testimonials':
              if (testimonials.length === 0) return null;
              return (
                <section key="testimonials" id="testimonials" className="w-full">
                  {/* Section Header - Bold yellow design */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="rounded-lg bg-yellow-100 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                    </div>
                    <h2 className="font-black text-2xl sm:text-3xl" style={{ color: '#111111' }}>Testimonials</h2>
                  </div>
                  
                  {/* Testimonial Cards */}
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-2">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all">
                        <p className="mb-3 sm:mb-4 italic text-xs sm:text-sm" style={{ color: '#111111' }}>"{testimonial.testimonial}"</p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          {testimonial.avatar_url ? (
                            <img
                              src={testimonial.avatar_url}
                              alt={testimonial.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                              <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-xs sm:text-sm" style={{ color: '#111111' }}>{testimonial.name}</p>
                            {testimonial.title && (
                              <p className="text-xs text-gray-600">{testimonial.title}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'services':
              if (services.length === 0) return null;
              return (
                <section key="services" id="services" className="w-full">
                  {/* Section Header */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="rounded-lg bg-cyan-100 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
                    </div>
                    <h2 className="font-bold text-gray-900 text-2xl sm:text-3xl">Services</h2>
                  </div>
                  
                  {/* Service Cards */}
                  <div className="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service: any) => (
                      <div
                        key={service.id}
                        className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 transition-shadow relative ${
                          service.is_featured 
                            ? 'border-yellow-400 shadow-md ring-2 ring-yellow-200' 
                            : 'border-gray-200 hover:shadow-md'
                        }`}
                      >
                        {/* Featured Badge */}
                        {service.is_featured && (
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                            <div className="bg-yellow-400 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold flex items-center gap-0.5 sm:gap-1">
                              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                              <span>Featured</span>
                            </div>
                          </div>
                        )}

                        {/* Icon */}
                        {service.icon && (
                          <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{service.icon}</div>
                        )}

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1.5 sm:mb-2">{service.title}</h3>

                        {/* Price and Duration */}
                        {(service.price || service.duration) && (
                          <div className="flex items-center gap-2 text-cyan-600 font-medium text-xs sm:text-sm mb-2 sm:mb-3">
                            {service.price && <span>{service.price}</span>}
                            {service.price && service.duration && <span>•</span>}
                            {service.duration && <span>{service.duration}</span>}
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{service.description}</p>

                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                          <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
                            {service.features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-1.5 sm:gap-2 text-gray-700 text-xs sm:text-sm">
                                <span className="flex-shrink-0 text-cyan-500 mt-0.5">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* CTA Button */}
                        {service.cta_text && service.cta_url && (
                          <a
                            href={service.cta_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-600 text-white text-xs sm:text-sm rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                          >
                            <span>{service.cta_text}</span>
                            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'faqs':
              if (faqs.length === 0) return null;
              return (
                <section key="faqs" id="faqs" className="w-full">
                  {/* Section Header */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="rounded-lg bg-sky-100 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                    </div>
                    <h2 className="font-bold text-gray-900 text-2xl sm:text-3xl">FAQs</h2>
                  </div>
                  
                  {/* FAQ Items */}
                  <div className="space-y-2 sm:space-y-3">
                    {faqs.map((faq: any) => (
                      <details
                        key={faq.id}
                        className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
                      >
                        <summary className="cursor-pointer list-none flex items-center justify-between text-sm sm:text-base">
                          <span className="font-semibold text-gray-900 flex-1 pr-3 sm:pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                        </summary>
                        <div className="text-gray-600 text-xs sm:text-sm mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 leading-relaxed">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              );

            case 'resume':
              if (!profile.resume_url) return null;
              const resumeFileName = profile.resume_file_name || 'resume.pdf';
              return (
                <section key="resume" id="resume" className="w-full">
                  {/* Section Header */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="rounded-lg bg-green-100 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <h2 className="font-bold text-gray-900 text-2xl sm:text-3xl">Resume</h2>
                  </div>
                  
                  {/* Resume Card */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="rounded-lg bg-green-100 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">View My Resume</h3>
                          <p className="text-gray-600 text-xs sm:text-sm">Download or view in browser</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={profile.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>View</span>
                        </a>
                        <a
                          href={profile.resume_url}
                          download={resumeFileName}
                          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          title={`Download ${resumeFileName}`}
                        >
                          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Footer - Matching preview exactly */}
      <footer className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
          {/* CTA Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-bold mb-4 text-2xl sm:text-3xl lg:text-4xl">
              {profile.footer_text || "Let's build something meaningful."}
            </h2>
            {profile.navigation?.ctaUrl && (
              <a
                href={profile.navigation.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all text-sm sm:text-base"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-4 sm:my-6" />

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            {/* Signature */}
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              {profile.footer_signature || `Built with 🤍 by ${profile.full_name || 'You'}`}
            </p>

            {/* Links */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <a
                href="#overview"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back to Top
              </a>
              <span className="text-gray-600">•</span>
              <p className="text-gray-400">
                © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

