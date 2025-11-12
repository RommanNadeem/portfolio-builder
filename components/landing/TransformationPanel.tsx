'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, DollarSign, Target } from 'lucide-react';

const transformations = [
  {
    before: [
      'Led product initiatives for mobile app',
      'Worked with cross-functional teams',
      'Improved user engagement metrics',
      'Launched new features for users'
    ],
    after: {
      title: 'Mobile App Redesign & Growth Initiative',
      description: 'Led a 6-month product transformation that reimagined our mobile experience from the ground up. Collaborated with design, engineering, and data teams to identify friction points and opportunities.',
      metrics: [
        { icon: TrendingUp, value: '+47%', label: 'User engagement' },
        { icon: Users, value: '2.3M', label: 'Active users' },
        { icon: Target, value: '35%', label: 'Feature adoption' }
      ],
      highlight: 'Drove company from 1.5M to 2.3M monthly active users in Q2 2023'
    }
  },
  {
    before: [
      'Managed engineering team',
      'Built scalable infrastructure',
      'Reduced system latency',
      'Implemented best practices'
    ],
    after: {
      title: 'Platform Infrastructure Overhaul',
      description: 'Architected and led the migration from monolithic to microservices architecture, reducing deployment time and improving system reliability. Managed a team of 8 engineers through this critical transition.',
      metrics: [
        { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
        { icon: Target, value: '-60%', label: 'Latency' },
        { icon: DollarSign, value: '$400K', label: 'Cost savings' }
      ],
      highlight: 'Reduced P95 latency from 450ms to 180ms, improving user experience across 50K+ daily transactions'
    }
  }
];

export default function TransformationPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = transformations[activeIndex];

  return (
    <div className="space-y-8">
      {/* Transformation selector */}
      <div className="flex justify-center gap-3">
        {transformations.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === idx 
                ? 'bg-indigo-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`View transformation example ${idx + 1}`}
          />
        ))}
      </div>

      {/* Panel container */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Before - Resume bullets */}
        <motion.div
          key={`before-${activeIndex}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -top-3 left-6 bg-gray-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10">
            Your Resume
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-300 p-8 min-h-[400px]">
            {/* Resume header mockup */}
            <div className="mb-6 pb-4 border-b border-gray-300">
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>

            {/* Experience section */}
            <div className="mb-4">
              <div className="h-3 bg-gray-400 rounded w-1/3 mb-3 font-semibold" />
              <div className="h-3 bg-gray-300 rounded w-2/5 mb-2" />
              <div className="h-2 bg-gray-300 rounded w-1/4 mb-4" />
            </div>

            {/* Bullet points */}
            <ul className="space-y-3">
              {active.before.map((bullet, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span className="text-gray-400 mt-1.5 flex-shrink-0">•</span>
                  <span className="text-sm leading-relaxed">{bullet}</span>
                </motion.li>
              ))}
            </ul>

            {/* Generic footer elements */}
            <div className="mt-6 pt-4 border-t border-gray-300 space-y-2">
              <div className="h-2 bg-gray-300 rounded w-full opacity-40" />
              <div className="h-2 bg-gray-300 rounded w-5/6 opacity-40" />
              <div className="h-2 bg-gray-300 rounded w-4/5 opacity-40" />
            </div>
          </div>
        </motion.div>

        {/* Arrow indicator */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* After - Portfolio case study */}
        <motion.div
          key={`after-${activeIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -top-3 left-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Your Portfolio
          </div>

          <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-2xl overflow-hidden min-h-[400px]">
            {/* Case study content */}
            <div className="p-8">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-4 leading-tight"
              >
                {active.after.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 leading-relaxed mb-6"
              >
                {active.after.description}
              </motion.p>

              {/* Metrics grid */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-4 mb-6"
              >
                {active.after.metrics.map((metric, idx) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100"
                    >
                      <Icon className="w-5 h-5 text-indigo-600 mb-2" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        {metric.label}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Highlight callout */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white"
              >
                <div className="text-sm font-semibold mb-1 opacity-90">
                  Key Impact
                </div>
                <p className="text-sm leading-relaxed">
                  {active.after.highlight}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-gray-500 text-sm">
          Same experience. Better story.{' '}
          <span className="font-semibold text-indigo-600">
            AI helps you show impact, not just tasks.
          </span>
        </p>
      </motion.div>
    </div>
  );
}

