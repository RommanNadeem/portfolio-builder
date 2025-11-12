'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Palette, 
  Code, 
  FileText, 
  Award,
  Users,
  TrendingUp,
  CheckCircle 
} from 'lucide-react';

const templates = [
  {
    id: 'pm-strategic',
    role: 'PM',
    name: 'Strategic PM',
    description: 'For product leaders who drive vision and growth',
    includedSections: [
      'Case studies with metrics',
      'Product philosophy',
      'Companies worked with',
      'Key achievements'
    ],
    useCase: 'Best for senior PMs applying to leadership roles',
    gradient: 'from-blue-500 to-indigo-600',
    icon: Briefcase
  },
  {
    id: 'pm-growth',
    role: 'PM',
    name: 'Growth PM',
    description: 'Showcasing data-driven experiments and wins',
    includedSections: [
      'Growth experiments',
      'Conversion metrics',
      'A/B test results',
      'Impact stories'
    ],
    useCase: 'Perfect for PMs focused on metrics and experimentation',
    gradient: 'from-green-500 to-emerald-600',
    icon: TrendingUp
  },
  {
    id: 'designer-visual',
    role: 'Design',
    name: 'Visual Designer',
    description: 'Image-rich portfolio for visual storytelling',
    includedSections: [
      'Project showcases',
      'Design process',
      'Client testimonials',
      'Awards & recognition'
    ],
    useCase: 'Ideal for designers with strong visual work',
    gradient: 'from-purple-500 to-pink-600',
    icon: Palette
  },
  {
    id: 'designer-ux',
    role: 'Design',
    name: 'UX Researcher',
    description: 'Research-driven portfolio with insights',
    includedSections: [
      'Research studies',
      'User insights',
      'Design impact',
      'Methodologies'
    ],
    useCase: 'For designers emphasizing research and user understanding',
    gradient: 'from-indigo-500 to-purple-600',
    icon: Users
  },
  {
    id: 'engineer-fullstack',
    role: 'Engineering',
    name: 'Full Stack Engineer',
    description: 'Technical depth with project highlights',
    includedSections: [
      'Technical projects',
      'Tech stack',
      'Open source contributions',
      'Performance wins'
    ],
    useCase: 'Great for engineers showing range and impact',
    gradient: 'from-cyan-500 to-blue-600',
    icon: Code
  },
  {
    id: 'engineer-specialist',
    role: 'Engineering',
    name: 'Specialist Engineer',
    description: 'Deep expertise in specific domains',
    includedSections: [
      'Domain expertise',
      'Technical articles',
      'Certifications',
      'Conference talks'
    ],
    useCase: 'Best for engineers with deep specialization',
    gradient: 'from-slate-600 to-gray-800',
    icon: Award
  }
];

export default function TemplateGallery() {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const roles = ['all', 'PM', 'Design', 'Engineering'];

  const filteredTemplates = selectedRole === 'all' 
    ? templates 
    : templates.filter(t => t.role === selectedRole);

  return (
    <div>
      {/* Role filters */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => {
              setSelectedRole(role);
              setFlippedCard(null);
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedRole === role
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300'
            }`}
          >
            {role === 'all' ? 'All Templates' : role}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <motion.div 
        layout
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template) => {
            const isFlipped = flippedCard === template.id;
            const Icon = template.icon;

            return (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative h-[360px]"
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  className="relative w-full h-full cursor-pointer"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  onClick={() => setFlippedCard(isFlipped ? null : template.id)}
                  onMouseEnter={() => setFlippedCard(template.id)}
                  onMouseLeave={() => setFlippedCard(null)}
                >
                  {/* Front of card */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="h-full bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                      {/* Gradient header */}
                      <div className={`h-32 bg-gradient-to-br ${template.gradient} p-6 flex items-center justify-between`}>
                        <div>
                          <div className="text-white/80 text-sm font-medium mb-1">
                            {template.role}
                          </div>
                          <h3 className="text-2xl font-bold text-white">
                            {template.name}
                          </h3>
                        </div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {template.description}
                        </p>

                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-gray-200">
                          <div className="text-sm font-semibold text-gray-900 mb-2">
                            Use Case
                          </div>
                          <div className="text-sm text-gray-600">
                            {template.useCase}
                          </div>
                        </div>

                        <div className="mt-4 text-center">
                          <span className="text-sm text-indigo-600 font-medium">
                            Hover to see what's included →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className={`h-full bg-gradient-to-br ${template.gradient} rounded-2xl shadow-2xl p-8 flex flex-col justify-between`}>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          What's Included
                        </h3>
                        <div className="h-1 w-16 bg-white/50 rounded mb-6" />

                        <ul className="space-y-4">
                          {template.includedSections.map((section, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3 text-white"
                            >
                              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                              <span className="font-medium">{section}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-center">
                        <div className="text-white/80 text-sm mb-4">
                          Click to flip back
                        </div>
                        <button className="w-full px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transition-colors">
                          Use This Template
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

