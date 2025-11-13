'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FileText,
  ArrowDown,
  Sparkles, 
  TrendingUp,
  BarChart3,
  RefreshCw,
  Globe,
  Check,
  Upload
} from 'lucide-react';

export default function LandingPage() {
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });


  // Resume falls down
  const resumeY = useTransform(scrollYProgress, [0, 0.5], [0, 300]);
  const resumeRotate = useTransform(scrollYProgress, [0, 0.5], [0, 5]);
  const resumeScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  // Container appears
  const containerY = useTransform(scrollYProgress, [0.3, 0.6], [100, 0]);
  const containerOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/icon.svg" alt="BuildSpace Icon" className="h-6 sm:h-8" />
            <img src="/logo.svg" alt="BuildSpace" className="h-6 sm:h-8" />
          </div>

          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
            <a href="#story" className="hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>Your Story</a>
            <a href="#templates" className="hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>Templates</a>
            <a href="#examples" className="hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>Examples</a>
            <a href="#pricing" className="hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>Pricing</a>
            <a href="#faq" className="hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>FAQ</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/signin"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all hover:bg-gray-100 whitespace-nowrap"
              style={{ color: '#111111' }}
            >
              Sign In
            </Link>
            <Link
              href="/onboarding-v2/start"
              className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered with Scroll Animation */}
      <section ref={heroRef} className="relative min-h-[150vh] pt-20 sm:pt-32 pb-32 sm:pb-64 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Main headline - centered */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-none tracking-tight max-w-5xl mx-auto" style={{ color: '#111111' }}>
              Turn your experience<br />
              Into Story
            </h1>
                
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-6 sm:mb-8 leading-tight px-4" style={{ color: '#111111' }}>
              Upload your work history.<br />
              Get a narrative portfolio in 60 seconds.
            </p>

            {/* CTA */}
            <Link
              href="/onboarding-v2/start"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-5 text-base sm:text-lg font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 mb-3 sm:mb-4"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
            </Link>

            <div className="text-xs sm:text-sm mb-12 sm:mb-16 px-4" style={{ color: '#666666' }}>
              PDF or DOCX. We extract roles, outcomes, and dates.
            </div>
          </motion.div>
        </div>

        {/* Scroll Animation: Resume → Portfolio */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full max-w-2xl">
            {/* Resume falling */}
                      <motion.div
              style={{ y: resumeY, rotate: resumeRotate, scale: resumeScale }}
              className="absolute top-0 left-1/2 -translate-x-1/2"
            >
              <div className="w-64 h-80 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8" style={{ color: '#5BC64A' }} />
                  <div className="text-sm font-bold" style={{ color: '#111111' }}>updated-resume-final(2).pdf</div>
                </div>
                <div className="space-y-2">
                  {[85, 92, 78, 95, 88, 90, 82, 87].map((width, i) => (
                    <div key={i} className="h-2 rounded" style={{ 
                      background: '#F5F5F5',
                      width: `${width}%` 
                    }} />
                  ))}
                  </div>
                </div>
              </motion.div>

            {/* Portfolio container appearing */}
              <motion.div
              style={{ y: containerY, opacity: containerOpacity }}
              className="absolute top-96 left-1/2 -translate-x-1/2"
            >
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden w-96">
                  {/* Browser chrome */}
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#F5F5F5' }}>
                    <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#FF9F80' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#FFF5B8' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#E5F8D6' }} />
                    </div>
                  <div className="flex-1 mx-2">
                    <div className="bg-white rounded px-3 py-1.5 text-xs font-mono" style={{ color: '#111111' }}>
                      buildspace.me/Romman
                    </div>
                  </div>
                          </div>

                {/* Portfolio preview */}
                <div className="p-8" style={{ background: '#FFFFFF' }}>
                  <div className="w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, #DDEAFF, #FEE7EB)' }} />
                  <div className="h-6 rounded mb-2" style={{ background: '#111111', width: '60%' }} />
                  <div className="h-4 rounded mb-4" style={{ background: '#5BC64A', width: '40%' }} />
                  <div className="space-y-2">
                    <div className="h-2 rounded" style={{ background: '#F5F5F5', width: '100%' }} />
                    <div className="h-2 rounded" style={{ background: '#F5F5F5', width: '85%' }} />
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
          </div>
        </section>

      {/* How It Works Section */}
      <section id="story" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight" style={{ color: '#111111' }}>
              How It Works
            </h2>
          </motion.div>

          {/* 3 Steps */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12">
            {[
              {
                step: '1',
                title: 'Upload Your Career Profile',
                desc: 'PDF or DOCX. Roles, dates, outcomes extracted.',
                bg: '#DDEAFF',
                icon: Upload
              },
              {
                step: '2',
                title: 'Review Your Story',
                desc: 'Clear case studies with one key metric.',
                bg: '#FEE7EB',
                icon: Sparkles
              },
              {
                step: '3',
                title: 'Publish On Your Domain',
                desc: 'Get a free personalized URL. Share a link that wins replies under a minute.',
                bg: '#FFF5B8',
                icon: Globe
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2"
                  style={{ background: item.bg, borderColor: item.bg }}
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white mb-4 sm:mb-6 mx-auto border-2 border-gray-200">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#111111' }} />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black mb-3 sm:mb-4 text-center" style={{ color: '#111111' }}>
                    {item.title}
                  </h3>
                  <p className="text-center text-sm sm:text-base lg:text-lg" style={{ color: '#111111' }}>
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Inline CTA */}
          <div className="text-center">
            <Link
              href="/onboarding-v2/start"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Live Builder Preview Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ background: '#F5F5F5' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight" style={{ color: '#111111' }}>
              See It Build In Real Time
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto px-4" style={{ color: '#111111' }}>
              Watch your sections assemble as you upload.
            </p>
          </motion.div>

          {/* Preview Steps */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              {
                label: 'Pick a layout',
                icon: BarChart3,
                color: '#DDEAFF'
              },
              {
                label: 'Edit a headline',
                icon: FileText,
                color: '#FEE7EB'
              },
              {
                label: 'Add one result',
                icon: TrendingUp,
                color: '#E5F8D6'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl mb-4 mx-auto" style={{ background: item.color }}>
                    <Icon className="w-6 h-6" style={{ color: '#111111' }} />
                  </div>
                  <p className="text-xl font-bold text-center" style={{ color: '#111111' }}>
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
            </div>

          {/* Inline CTA */}
          <div className="text-center">
            <Link
              href="/onboarding-v2/start"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Before To After Section */}
      <section id="examples" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ background: '#FEE7EB' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#111111' }}>
              From Bullets To Case Studies
            </h2>
            <p className="text-2xl max-w-3xl mx-auto" style={{ color: '#111111' }}>
              We turn raw bullets into clear stories with proof.
            </p>
          </motion.div>

          {/* Carousel Results */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { metric: 'Response rate up 42% in 30 days', bg: '#DDEAFF' },
              { metric: 'Two client intros in seven days', bg: '#FFF5B8' },
              { metric: 'Profile views up 55% in 14 days', bg: '#E5F8D6' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-3xl p-8 border-2"
                style={{ background: item.bg, borderColor: item.bg }}
              >
                <div className="flex items-center justify-center h-32">
                  <p className="text-2xl font-black text-center" style={{ color: '#111111' }}>
                    {item.metric}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Inline CTA */}
          <div className="text-center">
            <Link
              href="/onboarding-v2/start"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Templates For Your Role Section */}
      <section id="templates" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#111111' }}>
              Templates For Your Role
            </h2>
            <p className="text-2xl max-w-3xl mx-auto mb-8" style={{ color: '#111111' }}>
              Pick a starting point. Customize every block.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Product', 'Design', 'Engineering', 'Marketing', 'Data'].map((filter, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:shadow-md"
                style={{ background: '#F5F5F5', color: '#111111', border: '2px solid #E5E5E5' }}
              >
                {filter}
              </motion.button>
            ))}
          </div>

          {/* Template Tiles */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { name: 'Product Manager', sections: 'Hero, Projects, Metrics', tone: 'Data-driven', bg: '#DDEAFF' },
              { name: 'Designer', sections: 'Hero, Portfolio, Process', tone: 'Visual-first', bg: '#FEE7EB' },
              { name: 'Engineer', sections: 'Hero, Projects, Tech Stack', tone: 'Technical', bg: '#FFF5B8' },
              { name: 'Marketer', sections: 'Hero, Campaigns, Results', tone: 'Results-focused', bg: '#E5F8D6' },
              { name: 'Data Analyst', sections: 'Hero, Insights, Methods', tone: 'Analytical', bg: '#DDEAFF' },
              { name: 'Content Creator', sections: 'Hero, Work, Impact', tone: 'Story-driven', bg: '#FEE7EB' }
            ].map((template, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-full h-32 rounded-2xl mb-6" style={{ background: template.bg }} />
                <h3 className="text-xl font-black mb-3" style={{ color: '#111111' }}>{template.name}</h3>
                <div className="space-y-2 text-sm" style={{ color: '#666666' }}>
                  <p><span className="font-semibold">Sections:</span> {template.sections}</p>
                  <p><span className="font-semibold">Tone:</span> {template.tone}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Inline CTA */}
          <div className="text-center">
            <Link
              href="/onboarding-v2/start"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
            </Link>
            </div>
          </div>
        </section>

      {/* Everything You Need */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ background: '#F5F5F5' }}>
          <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#111111' }}>
              Everything You Need
              </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Upload,
                title: 'Instant Portfolio Generation', 
                desc: 'Upload, review, publish under a minute.'
              },
              { 
                icon: Sparkles, 
                title: 'AI Generated Case Studies', 
                desc: 'Outcomes, timelines, stakeholders, and a key metric.'
              },
              { 
                icon: BarChart3, 
                title: 'Data Driven Templates', 
                desc: 'Layouts tuned from real usage. Updated regularly.'
              },
              { 
                icon: TrendingUp, 
                title: 'Built To Convert', 
                desc: 'Fast load, clear actions, real domain support.'
              },
              { 
                icon: RefreshCw, 
                title: 'Build With Blocks', 
                desc: 'Add only what you need. No token limits. Unlimited edits.'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#5BC64A' }}>
                      <Icon className="w-6 h-6" style={{ color: 'white' }} />
                    </div>
                    <h3 className="text-2xl font-black" style={{ color: '#111111' }}>{feature.title}</h3>
                  </div>
                  <p className="text-lg" style={{ color: '#111111' }}>{feature.desc}</p>
                </motion.div>
              );
            })}
            </div>
          </div>
        </section>

      {/* Results That Matter */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ background: '#E5F8D6' }}>
          <div className="max-w-7xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#111111' }}>
              Results That Matter
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {[
              { result: 'More replies', timeframe: 'in seven days', bg: '#DDEAFF' },
              { result: 'Interviews booked', timeframe: 'in 14 days', bg: '#FFF5B8' },
              { result: 'Clients closed', timeframe: 'in thirty days', bg: '#FEE7EB' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-3xl p-12 border-2 text-center"
                style={{ background: item.bg, borderColor: item.bg }}
              >
                <div className="text-4xl font-black mb-3" style={{ color: '#111111' }}>{item.result}</div>
                <div className="text-xl font-semibold" style={{ color: '#111111' }}>{item.timeframe}</div>
              </motion.div>
            ))}
            </div>

          {/* Inline CTA */}
          <div className="text-center">
            <Link
              href="/onboarding-v2/start"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
            </Link>
            </div>
          </div>
        </section>

      {/* Domain And SEO */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#111111' }}>
              Your Domain From Day One
              </h2>
              <p className="text-2xl max-w-3xl mx-auto mb-8" style={{ color: '#111111' }}>
                Share a clean link with your own slug. No random words.
              </p>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#666666' }}>
                Note: Use your own domain when you are ready. Auto SSL.
              </p>
            </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { step: 'Choose a slug', icon: Globe, bg: '#DDEAFF' },
              { step: 'Copy your link', icon: Check, bg: '#FFF5B8' },
              { step: 'Share anywhere', icon: Sparkles, bg: '#E5F8D6' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200"
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl mx-auto mb-6" style={{ background: item.bg }}>
                    <Icon className="w-8 h-8" style={{ color: '#111111' }} />
                  </div>
                  <p className="text-xl font-black text-center" style={{ color: '#111111' }}>{item.step}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Inline CTA */}
          <div className="text-center">
            <Link
              href="/onboarding-v2/start"
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
            </Link>
          </div>
          </div>
        </section>

      {/* Privacy And Control */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ background: '#F5F5F5' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: '#111111' }}>
              Your Data, Your Control
            </h2>
            <p className="text-2xl mb-6" style={{ color: '#111111' }}>
              You choose what to store. Delete any time.
            </p>
            <a href="#" className="text-lg font-semibold underline hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>
              Data Policy
            </a>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#111111' }}>
              Simple Plans Built For You
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="rounded-3xl p-10 border-2"
              style={{ background: '#DDEAFF', borderColor: '#DDEAFF' }}
            >
              <h3 className="text-3xl font-black mb-8" style={{ color: '#111111' }}>Starter</h3>
              <ul className="space-y-4 mb-8 text-lg" style={{ color: '#111111' }}>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#5BC64A' }} />
                  <span>Generate one portfolio</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#5BC64A' }} />
                  <span>One custom template</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#5BC64A' }} />
                  <span>Connect a domain</span>
                </li>
              </ul>
              <Link
                href="/onboarding-v2/start"
                className="block text-center px-8 py-4 text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
                style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
              >
                Build Your Story
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-10 border-2"
              style={{ background: '#FEE7EB', borderColor: '#FEE7EB' }}
            >
              <h3 className="text-3xl font-black mb-8" style={{ color: '#111111' }}>Pro</h3>
              <ul className="space-y-4 mb-8 text-lg" style={{ color: '#111111' }}>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#5BC64A' }} />
                  <span>Unlimited case studies</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#5BC64A' }} />
                  <span>All templates and updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#5BC64A' }} />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href="/onboarding-v2/start"
                className="block text-center px-8 py-4 text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
                style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
              >
                Build Your Story
              </Link>
            </motion.div>
          </div>

          <div className="text-center">
            <p className="text-sm" style={{ color: '#666666' }}>
              Use your own domain when you are ready.
            </p>
          </div>
          </div>
        </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ background: '#F5F5F5' }}>
          <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-black mb-4 leading-tight" style={{ color: '#111111' }}>
              FAQ
              </h2>
          </div>

            <div className="space-y-4">
              {[
              { q: 'What Files Can I Upload', a: 'PDF or DOCX of your work history. Max 10 MB per file.' },
              { q: 'How Do You Turn Experience Into Story', a: 'We extract roles, dates, outcomes, and skills, then draft case studies you can edit.' },
              { q: 'Can I Edit The AI Draft', a: 'Yes. Change headlines, metrics, images, and sections.' },
              { q: 'Do I Need A Custom Domain', a: 'No. You get a clean link with your own slug. You can add your domain later.' },
              { q: 'Will My Data Train Your Models', a: 'No, unless you give consent. You can delete your data any time.' },
              { q: 'Can I Import Projects From A File Or Link', a: 'Yes. Add attachments or links to demos, videos, and designs.' },
              { q: 'How Many Case Studies Can I Create', a: 'Starter includes one portfolio. Pro supports unlimited case studies.' },
              { q: 'Can I Export My Portfolio', a: 'Yes. Export a shareable link. File export options are coming soon.' },
              { q: 'How Fast Is It', a: 'Most users publish under a minute after upload.' },
              { q: 'Who Owns The Content', a: 'You do. You can edit or delete any time.' }
            ].map((faq, idx) => (
                <motion.div
                key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200"
              >
                <h3 className="font-bold text-xl mb-2" style={{ color: '#111111' }}>{faq.q}</h3>
                <p className="text-lg" style={{ color: '#111111' }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ background: '#DDEAFF' }}>
        <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-7xl md:text-9xl font-black mb-12 leading-none" style={{ color: '#111111' }}>
              Your Story
              </h2>
                <Link
                  href="/onboarding-v2/start"
              className="inline-flex items-center gap-3 px-10 py-6 text-xl font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ background: '#5BC64A', border: '2px solid #111111', color: '#111111' }}
            >
              Build Your Story
                </Link>
            </motion.div>
          </div>
        </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#111111' }}>Product</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#111111' }}>
                <li><a href="#" className="hover:opacity-70">Features</a></li>
                <li><a href="#" className="hover:opacity-70">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#111111' }}>Company</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#111111' }}>
                <li><a href="#" className="hover:opacity-70">About</a></li>
                <li><a href="#" className="hover:opacity-70">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#111111' }}>Resources</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#111111' }}>
                <li><a href="#" className="hover:opacity-70">Docs</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center text-sm" style={{ color: '#666666' }}>
            <p>© 2025 BuildSpace. Your data, your story, your brand.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
