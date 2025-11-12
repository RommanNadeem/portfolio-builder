'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Upload, 
  MessageSquare, 
  Link2, 
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  Zap,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [step, setStep] = useState<'name' | 'profession' | 'complete'>('name');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const professions = [
    'Product Manager',
    'Product Designer',
    'Software Engineer',
    'Other'
  ];

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep('profession');
    }
  };

  const handleProfessionSelect = (prof: string) => {
    setProfession(prof);
    setStep('complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99 102 241 / 0.08) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} 
        />
      </div>

      {/* Floating gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Portfolio Builder</span>
          </div>
          <Link
            href="/signin"
            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section - Interactive */}
        <section className="px-6 pt-12 pb-24 md:pt-20 md:pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Interactive Chat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  Turn your resume into a portfolio in{' '}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    60 seconds
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Upload your resume, answer a few simple questions, and get a clean, shareable portfolio that actually tells your story.
                </p>

                {/* Interactive Chat Interface */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-xl mb-6">
                  <AnimatePresence mode="wait">
                    {step === 'name' && (
                      <motion.div
                        key="name-step"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium mb-3">
                              Let's start with you. What is your name?
                            </p>
                            <form onSubmit={handleNameSubmit} className="space-y-3">
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
                                autoFocus
                              />
                              <button
                                type="submit"
                                disabled={!name.trim()}
                                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </form>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 'profession' && (
                      <motion.div
                        key="profession-step"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium mb-4">
                              Nice to meet you, {name}. What do you do?
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {professions.map((prof) => (
                                <button
                                  key={prof}
                                  onClick={() => handleProfessionSelect(prof)}
                                  className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left font-medium text-gray-700 hover:text-indigo-700"
                                >
                                  {prof}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 'complete' && (
                      <motion.div
                        key="complete-step"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium mb-4">
                              Perfect! Let's build your portfolio, {name}.
                            </p>
                            <Link
                              href="/onboarding-v2/start"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
                            >
                              Start my portfolio
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Microcopy */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Free to start
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Your link can be live in under a minute
                  </div>
                </div>
              </motion.div>

              {/* Right: Portfolio Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Browser chrome */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded px-3 py-1.5 text-xs text-gray-500 font-mono">
                        {name ? `${name.toLowerCase().replace(/\s+/g, '')}.portfolio.com` : 'yourname.portfolio.com'}
                      </div>
                    </div>
                  </div>

                  {/* Portfolio preview content */}
                  <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${name}-${profession}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {name || 'Your Name'}
                        </h2>
                        <p className="text-xl text-indigo-600 font-medium mb-6">
                          {profession || 'Your Profession'}
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                          Building products that balance core value and growth. Previously at leading tech companies.
                        </p>
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="w-24 h-3 bg-gray-200 rounded mb-2" />
                            <div className="w-full h-2 bg-gray-200 rounded mb-1" />
                            <div className="w-3/4 h-2 bg-gray-200 rounded" />
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="w-32 h-3 bg-gray-200 rounded mb-2" />
                            <div className="w-full h-2 bg-gray-200 rounded mb-1" />
                            <div className="w-2/3 h-2 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Powered</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Built for people who are tired of static resumes
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: 'From scattered experience to clear story',
                  description: 'Turn messy bullets into a structured narrative that feels like you.',
                  delay: 0
                },
                {
                  icon: Zap,
                  title: 'Portfolio in minutes, not weekends',
                  description: 'Upload your resume once. We handle the layout, sections, and structure.',
                  delay: 0.1
                },
                {
                  icon: Link2,
                  title: 'Designed to be shared',
                  description: 'Get a clean, responsive link you can send to founders, hiring managers, or your network.',
                  delay: 0.2
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: benefit.delay }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
                    <benefit.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How it works
              </h2>
              <p className="text-xl text-gray-600">
                From data to portfolio in three simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  number: '01',
                  icon: Upload,
                  title: 'Upload your resume',
                  description: 'Drop in your PDF or paste your LinkedIn. We pull out roles, dates, skills, and highlights.',
                  delay: 0
                },
                {
                  number: '02',
                  icon: MessageSquare,
                  title: 'Answer a few questions',
                  description: 'Tell us who you are, what matters to you, and how you want to be seen.',
                  delay: 0.15
                },
                {
                  number: '03',
                  icon: Link2,
                  title: 'Get your live portfolio link',
                  description: 'Review, tweak, and share. Update anytime.',
                  delay: 0.3
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: step.delay }}
                  className="relative"
                >
                  <div className="text-6xl font-bold text-indigo-100 mb-4">
                    {step.number}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Proof Section - Before vs After */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                See the difference
              </h2>
              <p className="text-xl text-gray-600">
                Same data. New story.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Before - Resume */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute -top-3 left-6 bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Your resume
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 border border-gray-300 aspect-[8.5/11] overflow-hidden">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-2 bg-gray-300 rounded w-1/3" />
                    <div className="h-px bg-gray-300 my-4" />
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="h-2 bg-gray-300 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* After - Portfolio */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="absolute -top-3 left-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Your portfolio
                </div>
                <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4" />
                    <div className="h-6 bg-gray-900 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-indigo-600 rounded w-1/3 mb-4" />
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-400 rounded w-full" />
                      <div className="h-2 bg-gray-400 rounded w-5/6" />
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-gray-200">
                      <div className="h-3 bg-gray-800 rounded w-1/3 mb-2" />
                      <div className="h-2 bg-gray-300 rounded w-full mb-1" />
                      <div className="h-2 bg-gray-300 rounded w-4/5" />
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 border border-gray-200">
                      <div className="h-3 bg-gray-800 rounded w-2/5 mb-2" />
                      <div className="h-2 bg-gray-300 rounded w-full mb-1" />
                      <div className="h-2 bg-gray-300 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Built for people like you
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                For product managers, designers, and engineers who want more than a static resume.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-16">
                {['Product Managers', 'Product Designers', 'Software Engineers', 'Founders and indie builders'].map((tag) => (
                  <motion.div
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 bg-white border-2 border-indigo-200 rounded-full text-indigo-700 font-medium"
                  >
                    {tag}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-indigo-200">
                <div className="flex items-start gap-4 mb-6">
                  <Users className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-xl text-gray-900 leading-relaxed mb-6">
                      "It took me less than 10 minutes to go from a resume PDF to a portfolio I actually want to share."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                      <div>
                        <div className="font-semibold text-gray-900">Alex Chen</div>
                        <div className="text-sm text-gray-600">Product Manager at Stripe</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Questions, answered
              </h2>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  question: 'Do I need design skills to use this?',
                  answer: 'No. The layout is handled for you. You just bring your experience and story.'
                },
                {
                  question: 'Is it really 60 seconds?',
                  answer: 'Your first version can be generated in under a minute. You can always refine and customize later.'
                },
                {
                  question: 'Can I edit the content?',
                  answer: 'Yes. You can adjust sections, wording, and structure without touching code.'
                },
                {
                  question: 'Can I update my portfolio later?',
                  answer: 'You can update your portfolio anytime as your career grows.'
                },
                {
                  question: 'What does the shareable link look like?',
                  answer: 'You get a clean URL like yourname.portfolio.com that you can share anywhere.'
                },
                {
                  question: 'Is my data secure?',
                  answer: 'Yes. Your data is stored securely and you control what gets published on your portfolio.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="px-6 py-24 bg-gradient-to-br from-indigo-600 to-purple-600 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '48px 48px'
              }} 
            />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Ready to see your portfolio come alive?
              </h2>
              <p className="text-xl text-indigo-100 mb-10">
                Start with your name. We'll take it from there.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/onboarding-v2/start"
                  className="group px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                >
                  Start my portfolio
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/editor"
                  className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
                >
                  See a sample portfolio
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-indigo-100">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Free to start
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Live in under 60 seconds
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-slate-900 text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Portfolio Builder</span>
          </div>
          <div className="text-sm text-center">
            Built with care for creators and professionals
          </div>
        </div>
      </footer>
    </div>
  );
}
