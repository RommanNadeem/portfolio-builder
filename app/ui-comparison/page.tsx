'use client';

import Link from 'next/link';
import { ArrowLeft, Check, X, Eye, Pencil, Upload, Settings, LogOut, Plus, Trash2, Edit2, GripVertical, Monitor, Smartphone, ChevronDown, MoreVertical, ExternalLink, Copy, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import '../../app/onboarding-v2/onboarding.css';

export default function UIComparisonPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/icon.svg" alt="BuildSpace" className="h-10" />
              <div>
                <h1 className="text-2xl font-black text-gray-900">UI Comparison</h1>
                <p className="text-sm text-gray-800">Current vs Recommended</p>
              </div>
            </div>
            <Link href="/design-system" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>
              <ArrowLeft className="w-4 h-4" />
              Design System
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="mb-16 text-center">
          <div className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: '#FEE7EB', color: '#111111' }}>
            ⚠️ Inconsistencies Identified
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-6">
            Unifying BuildSpace UI
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Side-by-side comparison showing current inconsistencies and recommended fixes to create a cohesive brand experience.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-red-600 mb-2">13</div>
            <div className="text-sm font-semibold text-gray-900">Critical Issues</div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-orange-600 mb-2">8</div>
            <div className="text-sm font-semibold text-gray-900">Major Issues</div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-yellow-600 mb-2">6</div>
            <div className="text-sm font-semibold text-gray-900">Minor Issues</div>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-green-600 mb-2">2-6h</div>
            <div className="text-sm font-semibold text-gray-900">Est. Fix Time</div>
          </div>
        </div>

        {/* Section 1: PRIMARY BUTTONS */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">1. Primary Buttons</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* CURRENT */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <X className="w-5 h-5 text-red-600" />
                <h4 className="text-xl font-bold text-gray-900">Current (Editor)</h4>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Editor buttons - inconsistent */}
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Item (Blue)
                </button>
                
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Publish (Standard Green)
                </button>
                
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate (Purple)
                </button>
              </div>

              <div className="bg-white rounded-xl p-4 border border-red-300">
                <h5 className="text-sm font-bold text-red-900 mb-2">❌ Problems:</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Brand color (#5BC64A) not used</li>
                  <li>• Multiple random colors (blue, green, purple)</li>
                  <li>• White text (not on-brand)</li>
                  <li>• No border (less distinctive)</li>
                  <li>• rounded-lg (generic, not pill)</li>
                </ul>
              </div>
            </div>

            {/* RECOMMENDED */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Check className="w-5 h-5 text-green-600" />
                <h4 className="text-xl font-bold text-gray-900">Recommended</h4>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Unified buttons */}
                <button className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
                
                <button className="btn-primary">
                  <Upload className="w-4 h-4" />
                  Publish Portfolio
                </button>
                
                <button className="btn-primary">
                  <Sparkles className="w-4 h-4" />
                  Generate With AI
                </button>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-600">
                <h5 className="text-sm font-bold text-green-900 mb-2">✅ Benefits:</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Brand color (#5BC64A) everywhere</li>
                  <li>• Consistent black text</li>
                  <li>• Distinctive 2px black border</li>
                  <li>• Pill shape (memorable)</li>
                  <li>• Strong brand identity</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Comparison */}
          <div className="mt-6 bg-gray-900 rounded-2xl p-6 text-white">
            <h5 className="text-sm font-bold text-white mb-4">Code Fix:</h5>
            <div className="grid md:grid-cols-2 gap-6 font-mono text-xs">
              <div>
                <p className="text-red-400 mb-2">// ❌ BEFORE (Editor)</p>
                <pre className="text-gray-300">{`<button className="
  px-4 py-2
  bg-blue-600
  text-white
  rounded-lg
">
  Add Item
</button>`}</pre>
              </div>
              <div>
                <p className="text-green-400 mb-2">// ✅ AFTER (Unified)</p>
                <pre className="text-gray-300">{`<button className="
  btn-primary
">
  <Plus className="w-4 h-4" />
  Add Item
</button>`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: INPUT FIELDS */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">2. Input Fields & Focus Rings</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* CURRENT */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h4 className="text-xl font-bold text-gray-900">Current (Editor)</h4>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Blue Focus (Career)</label>
                  <input
                    type="text"
                    placeholder="Different colors per section"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Purple Focus (Projects)</label>
                  <input
                    type="text"
                    placeholder="No brand consistency"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gray Focus (General)</label>
                  <input
                    type="text"
                    placeholder="Random color choices"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-orange-300">
                <h5 className="text-sm font-bold text-orange-900 mb-2">⚠️ Problems:</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Focus colors change per section</li>
                  <li>• Brand emerald (#059669) not used</li>
                  <li>• 1px border (thinner, less defined)</li>
                  <li>• Inline Tailwind (not reusable)</li>
                  <li>• No helper class system</li>
                </ul>
              </div>
            </div>

            {/* RECOMMENDED - NEW THIN INPUTS */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Check className="w-5 h-5 text-green-600" />
                <h4 className="text-xl font-bold text-gray-900">Recommended ⭐ NEW</h4>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="thin-label">
                    Project Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project title"
                    className="thin-input"
                  />
                  <p className="thin-helper">Keep it short and descriptive</p>
                </div>
                
                <div>
                  <label className="thin-label">
                    Company Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="thin-input"
                  />
                </div>
                
                <div>
                  <label className="thin-label">
                    Description
                  </label>
                  <textarea
                    placeholder="Add brief description"
                    className="thin-textarea"
                    rows={2}
                  ></textarea>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-600">
                <h5 className="text-sm font-bold text-green-900 mb-2">✅ Benefits:</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Emerald focus everywhere (brand!)</li>
                  <li>• 2px borders (consistent)</li>
                  <li>• Reusable classes (.thin-input)</li>
                  <li>• 27% more compact</li>
                  <li>• Helper text system included</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Implementation Note */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-2">✨ New Thin Input System</h4>
                <p className="text-sm text-gray-800 mb-3">
                  We've created dedicated <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">.thin-input</code> classes that solve all editor input issues:
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Compact enough for sidebars (27% shorter)</li>
                  <li>• Brand-consistent emerald focus</li>
                  <li>• 2px borders maintained</li>
                  <li>• Easy to use (single class)</li>
                  <li>• Includes label & helper classes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: MODALS & OVERLAYS */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">3. Modals & Overlays</h3>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6">✅ Current Implementation (Keep This)</h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Example modal preview */}
              <div className="bg-black/60 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Modal Title</h4>
                  <p className="text-gray-600 mb-6">Modal content goes here.</p>
                  <div className="flex gap-3">
                    <button className="btn-primary flex-1">Confirm</button>
                    <button className="btn-secondary flex-1" style={{ color: '#111111' }}>Cancel</button>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-lg font-bold text-gray-900 mb-4">Modal Specs:</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Backdrop:</strong> bg-black/60</li>
                  <li>• <strong>Position:</strong> fixed inset-0, centered</li>
                  <li>• <strong>z-index:</strong> 50</li>
                  <li>• <strong>Modal:</strong> bg-white, rounded-2xl, shadow-2xl</li>
                  <li>• <strong>Max width:</strong> md (448px)</li>
                  <li>• <strong>Padding:</strong> 32px</li>
                </ul>
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-xs font-semibold text-green-900">✅ Consistent across app</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: STATUS INDICATORS */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">4. Status Indicators</h3>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6">✅ Current Implementation (Keep This)</h4>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-4">Save Status Dots</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-700">Saving...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-sm text-gray-700">Unsaved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-700">Saved</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-4">Status Pills</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full w-fit">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-700 font-medium">Saving</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full w-fit">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-700 font-medium">Saved</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-4">Publish Status</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">Live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span className="text-sm font-medium text-gray-700">Draft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: SEGMENTED CONTROLS */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">5. Segmented Controls (Toggles)</h3>
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6">✅ Current Implementation (Keep This)</h4>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h5 className="text-base font-bold text-gray-900 mb-4">View Mode Toggle</h5>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded bg-white text-gray-900 shadow-sm">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded text-gray-600 hover:text-gray-900">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>

              <div>
                <h5 className="text-base font-bold text-gray-900 mb-4">Device Toggle</h5>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
                  <button className="p-2 rounded bg-white text-gray-900 shadow-sm">
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded text-gray-600 hover:text-gray-900">
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl p-4 border border-blue-300">
              <p className="text-sm text-gray-700">
                <strong>✅ Well designed:</strong> Gray-100 container, white active state, smooth transitions
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: CARDS & ITEMS */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">6. Item Cards (Drag & Drop)</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* CURRENT */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h4 className="text-xl font-bold text-gray-900">Current</h4>
              </div>
              
              <div className="mb-6">
                <div className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="absolute left-2 top-4 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="ml-6">
                    <p className="text-sm font-semibold text-gray-900">Senior Product Designer</p>
                    <p className="text-xs text-gray-600 mt-1">Google • 2020-Present</p>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-orange-300">
                <h5 className="text-sm font-bold text-orange-900 mb-2">⚠️ Issue:</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• 1px borders (could be thicker)</li>
                  <li>• rounded-lg (could be more distinctive)</li>
                </ul>
              </div>
            </div>

            {/* RECOMMENDED */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Check className="w-5 h-5 text-green-600" />
                <h4 className="text-xl font-bold text-gray-900">Recommended</h4>
              </div>
              
              <div className="mb-6">
                <div className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all">
                  <div className="absolute left-2 top-4 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="ml-6">
                    <p className="text-sm font-semibold text-gray-900">Senior Product Designer</p>
                    <p className="text-xs text-gray-600 mt-1">Google • 2020-Present</p>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-600">
                <h5 className="text-sm font-bold text-green-900 mb-2">✅ Improvements:</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• 2px borders (more defined)</li>
                  <li>• rounded-xl (16px - more distinctive)</li>
                  <li>• Stronger shadow on hover</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: NAVIGATION BAR */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">7. Navigation Bar</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* CURRENT */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Current (Mixed Styles)</h4>
              
              {/* Simulated navbar */}
              <div className="bg-white border-b border-gray-200 rounded-lg shadow-sm p-3 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-3 h-3" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                      Publish
                    </button>
                    <Settings className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Publish button: Blue-600 (not brand)</li>
                <li>• Height: 56px</li>
                <li>• Style: Clean, functional</li>
              </ul>
            </div>

            {/* RECOMMENDED */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Recommended</h4>
              
              {/* Simulated navbar with btn-primary */}
              <div className="bg-white border-b border-gray-200 rounded-lg shadow-sm p-3 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-3 h-3" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: '#5BC64A', border: '1px solid #111111', color: '#111111' }}>
                      Publish
                    </button>
                    <Settings className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ Publish: Brand green #5BC64A</li>
                <li>✅ Black text for contrast</li>
                <li>✅ Pill shape for brand consistency</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8: COMPREHENSIVE ELEMENT LIST */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">8. Complete UI Element Inventory</h3>
          
          <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-3xl p-8 border-2 border-gray-300">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">All UI Elements Found in BuildSpace</h4>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Buttons */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Buttons (7 types)</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ btn-primary</li>
                  <li>✅ btn-secondary</li>
                  <li>✅ Icon-only buttons</li>
                  <li>✅ Dashed border (add)</li>
                  <li>✅ Danger buttons</li>
                  <li>✅ Link-style buttons</li>
                  <li>✅ Loading buttons</li>
                </ul>
              </div>

              {/* Inputs */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Inputs (9 types)</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Text input</li>
                  <li>✅ Email input</li>
                  <li>✅ Password input</li>
                  <li>✅ Tel input</li>
                  <li>✅ URL input</li>
                  <li>✅ File input</li>
                  <li>✅ Textarea</li>
                  <li>✅ Select dropdown</li>
                  <li>✅ Month/Year picker</li>
                </ul>
              </div>

              {/* Status & Feedback */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Status & Feedback</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Status dots (3 colors)</li>
                  <li>✅ Status pills</li>
                  <li>✅ Progress bars</li>
                  <li>✅ Loading spinners</li>
                  <li>✅ Alert messages (4 types)</li>
                  <li>✅ Toast notifications</li>
                  <li>✅ Validation states</li>
                </ul>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Navigation</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Top navbar (56px)</li>
                  <li>✅ Breadcrumbs</li>
                  <li>✅ Tab navigation</li>
                  <li>✅ Segmented controls</li>
                  <li>✅ Dropdown menus</li>
                  <li>✅ Back buttons</li>
                </ul>
              </div>

              {/* Containers */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Containers</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Modals & overlays</li>
                  <li>✅ Cards (5 variants)</li>
                  <li>✅ Panels (resizable)</li>
                  <li>✅ Sections (collapsible)</li>
                  <li>✅ Empty states</li>
                </ul>
              </div>

              {/* Interactive */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Interactive Elements</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Drag handles</li>
                  <li>✅ Hover actions</li>
                  <li>✅ Checkboxes</li>
                  <li>✅ Radio buttons</li>
                  <li>✅ Toggle switches</li>
                  <li>✅ Chips</li>
                  <li>✅ Badges</li>
                  <li>✅ Tooltips</li>
                </ul>
              </div>

              {/* Forms */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Form Elements</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Labels (required/optional)</li>
                  <li>✅ Helper text</li>
                  <li>✅ Error messages</li>
                  <li>✅ Success messages</li>
                  <li>✅ Validation states</li>
                  <li>✅ Upload areas</li>
                </ul>
              </div>

              {/* Content Blocks */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Content Blocks (16)</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Hero block</li>
                  <li>✅ Text blocks</li>
                  <li>✅ Image blocks</li>
                  <li>✅ Metrics blocks</li>
                  <li>✅ Steps blocks</li>
                  <li>✅ Gallery blocks</li>
                  <li>✅ Callout blocks (4 types)</li>
                  <li>✅ Embed blocks</li>
                  <li>✅ Feature grid</li>
                  <li>✅ Bullets block</li>
                  <li>✅ Quote block</li>
                  <li>✅ Timeline block</li>
                  <li>✅ CTA block</li>
                  <li>✅ Divider</li>
                  <li>✅ Spacer</li>
                </ul>
              </div>

              {/* Utilities */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">Utilities</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✅ Dividers (h/v)</li>
                  <li>✅ Spacers</li>
                  <li>✅ Skeletons</li>
                  <li>✅ Loading states</li>
                  <li>✅ Empty states</li>
                  <li>✅ Error states</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Missing Elements */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">9. Missing UI Elements (To Add)</h3>
          
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6">Elements Used But Not Fully Documented</h4>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">🔶 Toast Notifications</h5>
                <p className="text-sm text-gray-700 mb-2">Used for: Success/error feedback</p>
                <p className="text-xs text-gray-600">Status: Mentioned but not fully documented</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">🔶 Confirmation Dialog</h5>
                <p className="text-sm text-gray-700 mb-2">Used for: Delete confirmations</p>
                <p className="text-xs text-gray-600">Status: Used but not styled consistently</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">🔶 Loading Skeletons</h5>
                <p className="text-sm text-gray-700 mb-2">Used for: Dashboard loading</p>
                <p className="text-xs text-gray-600">Status: Partial documentation</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">🔶 Breadcrumbs</h5>
                <p className="text-sm text-gray-700 mb-2">Used for: Detail page navigation</p>
                <p className="text-xs text-gray-600">Status: Not documented</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">🔶 Tab Navigation</h5>
                <p className="text-sm text-gray-700 mb-2">Used for: Settings sections</p>
                <p className="text-xs text-gray-600">Status: Not documented</p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h5 className="text-base font-bold text-gray-900 mb-3">🔶 Dropdown Menu</h5>
                <p className="text-sm text-gray-700 mb-2">Used for: More options (MoreVertical)</p>
                <p className="text-xs text-gray-600">Status: Partially documented</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-xl border-2 border-yellow-300">
              <p className="text-sm font-bold text-yellow-900 mb-2">Recommendation:</p>
              <p className="text-sm text-gray-700">Add these 6 elements to design system for 100% coverage</p>
            </div>
          </div>
        </section>

        {/* Summary & Action Plan */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">Summary & Action Plan</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* What to Fix */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">🔴 Critical Fixes Needed</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border-2 border-red-300">
                  <h5 className="text-sm font-bold text-red-900 mb-2">1. Button Colors</h5>
                  <p className="text-xs text-gray-700">Replace all blue-600/green-600/purple-600 with brand #5BC64A</p>
                  <p className="text-xs text-red-700 mt-1 font-semibold">Impact: High | Effort: 2 hours</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-red-300">
                  <h5 className="text-sm font-bold text-red-900 mb-2">2. Button Text Color</h5>
                  <p className="text-xs text-gray-700">Change from white to black (#111111)</p>
                  <p className="text-xs text-red-700 mt-1 font-semibold">Impact: High | Effort: 30 min</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-red-300">
                  <h5 className="text-sm font-bold text-red-900 mb-2">3. Button Borders</h5>
                  <p className="text-xs text-gray-700">Add 2px solid black borders to all primary buttons</p>
                  <p className="text-xs text-red-700 mt-1 font-semibold">Impact: Medium | Effort: 1 hour</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-orange-300">
                  <h5 className="text-sm font-bold text-orange-900 mb-2">4. Focus Ring Colors</h5>
                  <p className="text-xs text-gray-700">Use emerald-700 for all focus states</p>
                  <p className="text-xs text-orange-700 mt-1 font-semibold">Impact: Medium | Effort: 2 hours</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-xl border-2 border-gray-900">
                <p className="text-sm font-bold text-gray-900 mb-2">Total Estimated Time:</p>
                <p className="text-2xl font-black text-red-600">5.5 hours</p>
                <p className="text-xs text-gray-700 mt-1">For complete brand consistency</p>
              </div>
            </div>

            {/* What's Already Good */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">✅ What's Already Great</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border-2 border-green-300">
                  <h5 className="text-sm font-bold text-green-900 mb-2">Status Indicators</h5>
                  <p className="text-xs text-gray-700">Colored dots, pills, and badges work perfectly</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-green-300">
                  <h5 className="text-sm font-bold text-green-900 mb-2">Segmented Controls</h5>
                  <p className="text-xs text-gray-700">Edit/Preview toggle is well-designed</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-green-300">
                  <h5 className="text-sm font-bold text-green-900 mb-2">Modal System</h5>
                  <p className="text-xs text-gray-700">Consistent backdrop, sizing, and animations</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-green-300">
                  <h5 className="text-sm font-bold text-green-900 mb-2">Drag & Drop</h5>
                  <p className="text-xs text-gray-700">Hover reveals, smooth transitions, great UX</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-green-300">
                  <h5 className="text-sm font-bold text-green-900 mb-2">Icon Library</h5>
                  <p className="text-xs text-gray-700">Consistent Lucide icons, proper sizing</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-green-300">
                  <h5 className="text-sm font-bold text-green-900 mb-2">Typography</h5>
                  <p className="text-xs text-gray-700">WCAG AAA compliant, good hierarchy</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-xl border-2 border-gray-900">
                <p className="text-sm font-bold text-gray-900 mb-2">No Changes Needed:</p>
                <p className="text-2xl font-black text-green-600">75%</p>
                <p className="text-xs text-gray-700 mt-1">Most of the design system is solid!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8">Implementation Guide</h3>
          
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border-2 border-purple-200">
            <h4 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Fix Process</h4>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <h5 className="text-lg font-bold text-gray-900">Find & Replace Button Classes</h5>
                </div>
                <pre className="bg-gray-900 text-white p-4 rounded-lg text-xs overflow-x-auto mb-3">{`# In editor directory:
Find: className="bg-blue-600 text-white rounded-lg"
Replace: className="btn-primary"

Find: className="bg-green-600 text-white rounded-lg"  
Replace: className="btn-primary"

Find: className="bg-purple-600 text-white rounded-lg"
Replace: className="btn-primary"`}</pre>
                <p className="text-sm text-gray-700">
                  <strong>Files affected:</strong> ~10 components in app/editor/
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <h5 className="text-lg font-bold text-gray-900">Unify Focus Ring Colors</h5>
                </div>
                <pre className="bg-gray-900 text-white p-4 rounded-lg text-xs overflow-x-auto mb-3">{`# In all editor input fields:
Find: focus:ring-blue-500
Replace: focus:ring-emerald-700

Find: focus:ring-purple-500
Replace: focus:ring-emerald-700

Find: focus:ring-gray-900  
Replace: focus:ring-emerald-700`}</pre>
                <p className="text-sm text-gray-700">
                  <strong>Files affected:</strong> All section components with inputs
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <h5 className="text-lg font-bold text-gray-900">Test & Verify</h5>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ Check all buttons use #5BC64A green</li>
                  <li>✅ Verify black text readable on green</li>
                  <li>✅ Confirm 2px black borders present</li>
                  <li>✅ Test focus states show emerald</li>
                  <li>✅ Verify no broken styles</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Before & After Preview */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">Visual Impact</h3>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white text-center">
            <p className="text-sm text-gray-400 mb-4">TRANSFORMATION</p>
            <div className="flex items-center justify-center gap-8 mb-8">
              <div>
                <p className="text-gray-400 text-sm mb-2">Before</p>
                <p className="text-4xl font-black">😕</p>
                <p className="text-sm text-gray-400 mt-2">Inconsistent Brand</p>
              </div>
              <div className="text-6xl text-gray-600">→</div>
              <div>
                <p className="text-gray-400 text-sm mb-2">After</p>
                <p className="text-4xl font-black">✨</p>
                <p className="text-sm text-gray-400 mt-2">Unified Experience</p>
              </div>
            </div>
            <p className="text-lg text-gray-300">
              Users will see ONE cohesive brand from landing page → onboarding → editor → published site
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-12">
          <h3 className="text-3xl font-black text-gray-900 mb-4">Ready to Fix?</h3>
          <p className="text-lg text-gray-600 mb-8">See detailed analysis and file-by-file fixes</p>
          <div className="flex justify-center gap-4">
            <Link href="/design-system" className="btn-primary">
              View Design System
            </Link>
            <a 
              href="/UI_INCONSISTENCIES_ANALYSIS.md" 
              target="_blank"
              className="btn-secondary inline-flex items-center gap-2" 
              style={{ color: '#111111' }}
            >
              Read Full Analysis
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

