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
  const transformRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: transformProgress } = useScroll({
    target: transformRef,
    offset: ["start end", "end start"]
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ background: '#0A7C61' }} />
            <span className="text-lg font-bold" style={{ color: '#111111' }}>Portfolio Builder</span>
            </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#story" className="hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>Your Story</a>
            <a href="#features" className="hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>Features</a>
            <a href="#faq" className="hover:opacity-70 transition-opacity" style={{ color: '#111111' }}>FAQ</a>
          </div>

          <Link
            href="/onboarding-v2/start"
            className="px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
            style={{ background: '#0A7C61' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section - Centered with Scroll Animation */}
      <section ref={heroRef} className="relative min-h-[150vh] pt-32 pb-64 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Main headline - centered */}
              <motion.div
            initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: '#DDEAFF', color: '#111111' }}>
              <Sparkles className="w-4 h-4 inline mr-2" />
              One portfolio for all your work
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black mb-8 leading-none tracking-tight" style={{ color: '#111111' }}>
              Your Resume<br />
              → Your Story
            </h1>

            <p className="text-3xl md:text-4xl font-medium mb-12 leading-tight" style={{ color: '#111111' }}>
              Upload your resume.<br />
              Get your portfolio in 60 seconds.
            </p>

            {/* CTA */}
            <Link
              href="/onboarding-v2/start"
              className="inline-flex items-center gap-3 px-8 py-5 text-white text-lg font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 mb-8"
              style={{ background: '#0A7C61' }}
            >
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-white" style={{ background: '#DDEAFF' }} />
                <div className="w-6 h-6 rounded-full border-2 border-white" style={{ background: '#FEE7EB' }} />
                <div className="w-6 h-6 rounded-full border-2 border-white" style={{ background: '#FFF5B8' }} />
              </div>
              Upload Resume
            </Link>

            <div className="flex justify-center items-center gap-6 text-sm mb-20" style={{ color: '#666666' }}>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" style={{ color: '#0A7C61' }} />
                Free to start
                          </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" style={{ color: '#0A7C61' }} />
                No credit card
                          </div>
                        </div>
                      </motion.div>

          {/* Scroll indicator */}
                      <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm font-medium" style={{ color: '#666666' }}>Watch the magic</span>
            <ArrowDown className="w-5 h-5" style={{ color: '#111111' }} />
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
                  <FileText className="w-8 h-8" style={{ color: '#0A7C61' }} />
                  <div className="text-sm font-bold" style={{ color: '#111111' }}>Resume.pdf</div>
                </div>
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-2 rounded" style={{ 
                      background: '#F5F5F5',
                      width: `${60 + Math.random() * 40}%` 
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
                  <div className="h-4 rounded mb-4" style={{ background: '#0A7C61', width: '40%' }} />
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

      {/* Story Section */}
      <section ref={transformRef} id="story" className="relative py-32 px-6" style={{ background: '#FEE7EB' }}>
          <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: '#FFF5B8', color: '#111111' }}>
              Your data becomes your story
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight" style={{ color: '#111111' }}>
              Turn experience<br />
              into narrative
            </h2>
            
            <p className="text-2xl max-w-3xl mx-auto" style={{ color: '#111111' }}>
              We transform resume bullets into compelling case studies with quantifiable metrics. 
              Your story becomes your brand.
            </p>
          </motion.div>

          {/* Before vs After */}
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Before - Bullets */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 border-2 border-gray-200"
            >
              <div className="text-sm font-bold mb-6 px-4 py-2 rounded-full inline-block" style={{ background: '#F5F5F5', color: '#111111' }}>
                Before
              </div>
              <div className="space-y-3">
                {[
                  'Led product initiatives',
                  'Worked with teams',
                  'Improved metrics',
                  'Launched features'
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3" style={{ color: '#111111' }}>
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* After - Story */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl p-8 border-2" style={{ background: '#DDEAFF', borderColor: '#DDEAFF' }}
            >
              <div className="text-sm font-bold mb-6 px-4 py-2 rounded-full inline-block" style={{ background: '#0A7C61', color: 'white' }}>
                After
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#111111' }}>
                Mobile Growth Initiative
              </h3>
              <p className="mb-6" style={{ color: '#111111' }}>
                Led a 6-month transformation that reimagined the mobile experience, collaborating with design and engineering teams.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '+47%', label: 'Engagement' },
                  { value: '2.3M', label: 'Users' },
                  { value: '35%', label: 'Adoption' }
                ].map((metric, idx) => (
                  <div key={idx} className="rounded-xl p-3 text-center" style={{ background: 'white' }}>
                    <div className="text-xl font-black mb-1" style={{ color: '#0A7C61' }}>{metric.value}</div>
                    <div className="text-xs" style={{ color: '#111111' }}>{metric.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features - Simple, Convenient, Connected */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: Upload, 
                label: 'Simple', 
                desc: 'Focus on your story, not design.',
                bg: '#FFF5B8'
              },
              { 
                icon: Sparkles, 
                label: 'Convenient', 
                desc: 'One portfolio for your entire career.',
                bg: '#FEE7EB'
              },
              { 
                icon: Globe, 
                label: 'Connected', 
                desc: 'Share everywhere, update once.',
                bg: '#DDEAFF'
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
                  className="rounded-3xl p-8 border-2"
                  style={{ background: feature.bg, borderColor: feature.bg }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6" style={{ color: '#111111' }} />
                    <h3 className="text-xl font-bold" style={{ color: '#111111' }}>{feature.label}</h3>
                  </div>
                  <p style={{ color: '#111111' }}>{feature.desc}</p>
                </motion.div>
              );
            })}
            </div>
          </div>
        </section>

      {/* Value Props */}
      <section className="py-32 px-6" style={{ background: '#F5F5F5' }}>
          <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: '#111111' }}>
              Everything you need
              </h2>
            <p className="text-xl" style={{ color: '#111111' }}>
              Built to help you stand out and close more opportunities
              </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Upload,
                title: 'Instant portfolio generation', 
                desc: 'Upload resume. Instantly generate a recruiter-ready, client-ready portfolio.',
                bg: '#DDEAFF'
              },
              { 
                icon: TrendingUp, 
                title: 'AI-generated case studies', 
                desc: 'AI creates case studies with quantifiable metrics from your resume bullets.',
                bg: '#FEE7EB'
              },
              { 
                icon: BarChart3, 
                title: 'Data-driven templates', 
                desc: 'Templates that continually improve based on performance data.',
                bg: '#FFF5B8'
              },
              { 
                icon: RefreshCw, 
                title: 'One-click updates', 
                desc: 'Easy updates. One click edits update every page instantly.',
                bg: '#E5F8D6'
              },
              { 
                icon: Globe, 
                title: 'Real domains', 
                desc: 'No embarrassing subdomains. Use yourname.com for real credibility.',
                bg: '#DDEAFF'
              },
              { 
                icon: Sparkles, 
                title: 'Built to convert', 
                desc: 'Designed to help you stand out and close more leads.',
                bg: '#FEE7EB'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200">
                    <Icon className="w-6 h-6" style={{ color: '#111111' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#111111' }}>{feature.title}</h3>
                  <p style={{ color: '#111111' }}>{feature.desc}</p>
                </motion.div>
              );
            })}
            </div>
          </div>
        </section>

      {/* 2,500+ roles */}
      <section className="py-32 px-6" style={{ background: '#E5F8D6' }}>
          <div className="max-w-7xl mx-auto">
          <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            className="text-7xl md:text-8xl font-black mb-16 leading-tight"
            style={{ color: '#111111' }}
          >
            2,500+ roles.<br />
            One portfolio.
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'PM', color: '#DDEAFF' },
              { name: 'Design', color: '#FEE7EB' },
              { name: 'Eng', color: '#FFF5B8' },
              { name: 'Mktg', color: '#E5F8D6' },
              { name: 'Sales', color: '#DDEAFF' },
              { name: 'Content', color: '#FEE7EB' },
              { name: 'Growth', color: '#FFF5B8' }
            ].map((role, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl font-black" style={{ 
                  background: role.color,
                  color: '#111111'
                }}>
                  {role.name.charAt(0)}
                </div>
                <div className="text-sm font-bold" style={{ color: '#111111' }}>{role.name}</div>
              </motion.div>
            ))}
            </div>
          </div>
        </section>

      {/* Social Proof */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
          >
            <div className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: '#FEE7EB', color: '#111111' }}>
              Join thousands
            </div>
            
            <h2 className="text-7xl md:text-8xl font-black mb-8 leading-tight" style={{ color: '#111111' }}>
              12,500+<br />
              professionals<br />
              trust us
              </h2>
            </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            {[
              { metric: '4.9★', label: 'Average rating', bg: '#DDEAFF' },
              { metric: '48s', label: 'Avg. time to publish', bg: '#FFF5B8' },
              { metric: '94%', label: 'Better responses', bg: '#E5F8D6' }
            ].map((stat, idx) => (
            <motion.div
                key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-3xl p-8 border-2"
                style={{ background: stat.bg, borderColor: stat.bg }}
              >
                <div className="text-5xl font-black mb-2" style={{ color: '#111111' }}>{stat.metric}</div>
                <div className="text-lg" style={{ color: '#111111' }}>{stat.label}</div>
            </motion.div>
            ))}
          </div>
          </div>
        </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-6" style={{ background: '#F5F5F5' }}>
          <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: '#FFF5B8', color: '#111111' }}>
              Questions?
            </div>
            <h2 className="text-6xl font-black mb-4" style={{ color: '#111111' }}>
              FAQ
              </h2>
          </div>

            <div className="space-y-4">
              {[
              { q: 'How do I create my portfolio?', a: 'Upload your resume or connect LinkedIn. Our AI generates a complete portfolio in under 60 seconds.' },
              { q: 'Can I use my own domain?', a: 'Yes! Pro plans support custom domains like yourname.com with automatic SSL setup.' },
              { q: 'What does AI write vs what I control?', a: 'AI drafts structure and content. You review and approve everything before it goes live.' },
              { q: 'Is my data secure?', a: 'Yes. Your data is encrypted and stored securely. We never share with third parties.' }
            ].map((faq, idx) => (
                <motion.div
                key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200"
              >
                <h3 className="font-bold text-lg mb-2" style={{ color: '#111111' }}>{faq.q}</h3>
                <p style={{ color: '#111111' }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* Final CTA */}
      <section className="py-32 px-6" style={{ background: '#E5F8D6' }}>
        <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
            <h2 className="text-7xl md:text-9xl font-black mb-12 leading-none" style={{ color: '#111111' }}>
              Your Story<span className="text-6xl">.</span>
              </h2>
                <Link
                  href="/onboarding-v2/start"
              className="inline-flex items-center gap-3 px-10 py-6 text-white text-xl font-semibold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              style={{ background: '#0A7C61' }}
            >
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-white" style={{ background: '#DDEAFF' }} />
                <div className="w-7 h-7 rounded-full border-2 border-white" style={{ background: '#FEE7EB' }} />
                <div className="w-7 h-7 rounded-full border-2 border-white" style={{ background: '#FFF5B8' }} />
              </div>
              Upload Resume
            </Link>
            </motion.div>
          </div>
        </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-white border-t border-gray-200">
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
                <li><a href="/design-system" className="hover:opacity-70">Design System</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center text-sm" style={{ color: '#666666' }}>
            <p>© 2025 Portfolio Builder. Your data, your story, your brand.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
