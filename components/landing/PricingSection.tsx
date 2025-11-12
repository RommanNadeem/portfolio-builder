'use client';

import { Check, Sparkles, Crown, Zap, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'AI-generated portfolio',
      'Up to 3 projects',
      'Basic templates',
      'Subdomain hosting',
      'Community support'
    ],
    cta: 'Start Free',
    popular: false,
    icon: Sparkles
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For professionals who want more',
    features: [
      'Everything in Free',
      'Unlimited projects',
      'All premium templates',
      'Custom domain support',
      'Advanced analytics',
      'Priority support',
      'Remove branding'
    ],
    cta: 'Start Free Trial',
    popular: true,
    icon: Crown
  },
  {
    name: 'Team',
    price: '$39',
    period: 'per month',
    description: 'For agencies and teams',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Team analytics dashboard',
      'White-label options',
      'API access',
      'Dedicated support',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false,
    icon: Zap
  }
];

export default function PricingSection() {
  return (
    <div className="space-y-16">
      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? 'border-indigo-500 shadow-2xl scale-105'
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-xl'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`bg-white p-8 ${plan.popular ? 'pt-16' : ''}`}>
                {/* Icon and name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                      : 'bg-gradient-to-br from-slate-100 to-slate-200'
                  }`}>
                    <Icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* CTA button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 mb-8 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/50'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features list */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-900 mb-3">
                    What's included:
                  </div>
                  {plan.features.map((feature, featureIdx) => (
                    <div
                      key={featureIdx}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Domain guide callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Using Your Own Domain
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                With Pro or Team plans, connect your custom domain (like yourname.com) instead of using a subdomain. We provide simple DNS instructions and one-click SSL setup.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">1</div>
                  <div className="text-sm text-gray-600">Buy domain from any registrar</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">2</div>
                  <div className="text-sm text-gray-600">Add DNS records (we show you how)</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">3</div>
                  <div className="text-sm text-gray-600">Your portfolio goes live instantly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ note */}
      <div className="text-center text-gray-500 text-sm">
        All plans include a 14-day free trial. No credit card required to start.
      </div>
    </div>
  );
}

