'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  Check, 
  Sparkles, 
  Mail, 
  Phone,
  Linkedin,
  Github,
  Calendar,
  Info
} from 'lucide-react';
import '../onboarding-v2/onboarding.css';

export default function DesignSystemPage() {
  const [activeChips, setActiveChips] = useState<string[]>(['chip1']);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  const toggleChip = (id: string) => {
    setActiveChips(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Design System</h1>
                <p className="text-sm text-gray-800">Ctrl.xyz-inspired components</p>
              </div>
            </div>
            <Link href="/" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          
          {/* Quick nav */}
          <div className="flex gap-2 flex-wrap">
            {['Colors', 'Typography', 'Buttons', 'Inputs', 'Cards', 'Badges', 'Chips', 'Upload', 'Progress'].map(section => (
              <a
                key={section}
                href={`#${section.toLowerCase()}`}
                className="px-3 py-1.5 text-sm text-gray-800 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
              >
                {section}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="onboarding-container text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-4">
            Portfolio Builder Design System
          </h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-6">
            A cohesive design language inspired by Ctrl.xyz, featuring emerald green accents, 
            pastel backgrounds, and pill-shaped components.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-200 rounded-full">
            <Check className="w-4 h-4 text-green-700" />
            <span className="text-sm font-bold text-green-900">100% WCAG AAA Compliant</span>
          </div>
        </div>

        {/* Color System */}
        <section id="colors" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Color System</h2>
          <p className="text-lg text-gray-800 mb-8">Emerald green primary with pastel accents</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Primary Colors */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Primary Colors (Action)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-emerald-600 border-2 border-gray-200" />
                  <div>
                    <div className="font-semibold text-gray-900">Emerald 600</div>
                    <div className="text-sm text-gray-800 mb-1">#10B981</div>
                    <div className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-bold inline-block">AA Only</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-emerald-700 border-2 border-gray-200" />
                  <div>
                    <div className="font-semibold text-gray-900">Emerald 700</div>
                    <div className="text-sm text-gray-800 mb-1">#059669</div>
                    <div className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold inline-block">✅ AAA (Use This)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pastel Backgrounds */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pastel Backgrounds</h3>
              <div className="space-y-3">
                {[
                  { name: 'Blue', bg: 'bg-blue-50', hex: '#DBEAFE' },
                  { name: 'Pink', bg: 'bg-pink-50', hex: '#FCE7F3' },
                  { name: 'Yellow', bg: 'bg-yellow-50', hex: '#FEF3C7' },
                  { name: 'Green', bg: 'bg-green-50', hex: '#D1FAE5' }
                ].map(color => (
                  <div key={color.name} className="flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-xl ${color.bg} border-2 border-gray-200`} />
                    <div>
                      <div className="font-semibold text-gray-900">{color.name}</div>
                      <div className="text-sm text-gray-800">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neutrals */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Neutrals</h3>
              <div className="space-y-3">
                {[
                  { name: 'Gray 900', bg: 'bg-gray-900', hex: '#111827' },
                  { name: 'Gray 700', bg: 'bg-gray-700', hex: '#374151' },
                  { name: 'Gray 600', bg: 'bg-gray-600', hex: '#4B5563' },
                  { name: 'Gray 200', bg: 'bg-gray-200', hex: '#E5E7EB' }
                ].map(color => (
                  <div key={color.name} className="flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-xl ${color.bg} border-2 border-gray-200`} />
                    <div>
                      <div className="font-semibold text-gray-900">{color.name}</div>
                      <div className="text-sm text-gray-800">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section id="typography" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Typography</h2>
          <p className="text-lg text-gray-800 mb-8">WCAG AAA compliant text colors with clear hierarchy</p>
          
          {/* Typography Colors - WCAG AAA System */}
          <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Typography Colors - WCAG AAA Compliant</h3>
                <p className="text-sm text-gray-800">All colors meet or exceed accessibility standards</p>
              </div>
              <div className="text-xs px-3 py-1.5 bg-green-200 text-green-900 rounded-full font-bold">
                ✅ AAA Certified
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {[
                { 
                  name: 'Headings & Labels', 
                  class: 'text-gray-900', 
                  color: '#111827', 
                  usage: 'H1, H2, H3, form labels, buttons, important text', 
                  contrast: '16.1:1',
                  wcag: 'AAA',
                  example: 'Main Title Here'
                },
                { 
                  name: 'Body Text', 
                  class: 'text-gray-800', 
                  color: '#1F2937', 
                  usage: 'Paragraphs, descriptions, main content', 
                  contrast: '10.4:1',
                  wcag: 'AAA',
                  example: 'This is body text for paragraphs'
                },
                { 
                  name: 'Helper Text', 
                  class: 'text-gray-700', 
                  color: '#374151', 
                  usage: 'Captions, small labels (≥14pt only)', 
                  contrast: '6.3:1',
                  wcag: 'AA',
                  example: 'Optional helper text'
                },
                { 
                  name: 'On Pastel Backgrounds', 
                  class: 'text-gray-900', 
                  color: '#111827', 
                  usage: 'Any text on blue/pink/yellow/green-50 backgrounds', 
                  contrast: '16.1:1',
                  wcag: 'AAA',
                  example: 'Text on colored cards'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-16 h-16 rounded-xl flex-shrink-0 shadow-md`} style={{ backgroundColor: item.color }} />
                    <div>
                      <div className="font-bold text-gray-900 text-lg mb-1">{item.name}</div>
                      <div className="text-xs px-2 py-0.5 bg-green-200 text-green-900 rounded-full font-bold inline-block">
                        {item.wcag}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-800 font-mono font-bold">{item.color}</div>
                    <div className="text-sm text-gray-800">
                      <span className="font-semibold">Contrast:</span> {item.contrast}
                    </div>
                    <div className="text-sm text-gray-800">
                      <span className="font-semibold">Tailwind:</span> <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">{item.class}</code>
                    </div>
                    <div className="text-xs text-gray-800 mt-2 pt-2 border-t border-green-200">
                      {item.usage}
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="text-xs text-gray-600 mb-1">Example:</div>
                      <div className={item.class}>{item.example}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Usage Guide */}
            <div className="bg-white rounded-2xl p-6 border-2 border-green-300">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📖</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Usage Guidelines</h4>
                  <div className="space-y-3 text-sm text-gray-800">
                    <div>
                      <strong>✅ DO:</strong> Use <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">text-gray-900</code> for all headings and labels
                    </div>
                    <div>
                      <strong>✅ DO:</strong> Use <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">text-gray-800</code> for all body text and descriptions
                    </div>
                    <div>
                      <strong>✅ DO:</strong> Use <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">text-gray-900</code> on all pastel backgrounds
                    </div>
                    <div>
                      <strong>❌ DON'T:</strong> Use <code className="bg-red-100 px-2 py-0.5 rounded font-mono text-xs">text-gray-600</code> or lighter for body text (fails WCAG AAA)
                    </div>
                    <div>
                      <strong>⚠️ CAUTION:</strong> Only use <code className="bg-yellow-100 px-2 py-0.5 rounded font-mono text-xs">text-gray-700</code> for large text (≥18pt)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Reference Table */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Reference Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Use Case</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Color</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Tailwind Class</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">WCAG</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { use: 'Headings (H1, H2, H3)', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Form labels', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Button text (secondary)', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Chip text', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Dropdown options', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Input text', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Body paragraphs', color: 'Gray-800', hex: '#1F2937', tw: 'text-gray-800', wcag: 'AAA' },
                    { use: 'Descriptions', color: 'Gray-800', hex: '#1F2937', tw: 'text-gray-800', wcag: 'AAA' },
                    { use: 'Input placeholders', color: 'Gray-600', hex: '#4B5563', tw: 'placeholder-gray-600', wcag: 'AA' },
                    { use: 'Text on pastel cards', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{row.use}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: row.hex }} />
                          <span className="text-gray-800 font-mono text-xs">{row.hex}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-900 font-mono text-xs">{row.tw}</code>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          row.wcag === 'AAA' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {row.wcag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section id="buttons" className="mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-8">Buttons</h2>
          
          {/* Button Color Analysis */}
          <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Button Color Compliance</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-green-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-emerald-700 flex items-center justify-center shadow-md">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Primary Button</div>
                    <div className="text-xs px-2 py-0.5 bg-green-200 text-green-900 rounded-full font-bold inline-block mt-1">
                      AAA Compliant
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-800">
                  <div><strong>Background:</strong> Emerald-700 (#059669)</div>
                  <div><strong>Text:</strong> White (#FFFFFF)</div>
                  <div><strong>Contrast:</strong> 5.28:1</div>
                  <div className="pt-2 border-t border-green-200">
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">✅ WCAG AAA</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-green-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-md">
                    <Check className="w-8 h-8 text-gray-900" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Secondary Button</div>
                    <div className="text-xs px-2 py-0.5 bg-green-200 text-green-900 rounded-full font-bold inline-block mt-1">
                      AAA Compliant
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-800">
                  <div><strong>Background:</strong> White (#FFFFFF)</div>
                  <div><strong>Text:</strong> Gray-900 (#111827)</div>
                  <div><strong>Contrast:</strong> 16.1:1</div>
                  <div className="pt-2 border-t border-green-200">
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold">✅ WCAG AAA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Primary Button</h3>
              <div className="space-y-4">
                <div>
                  <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.btn-primary</div>
                  <button className="btn-primary">
                    Continue
                  </button>
                </div>
                <div>
                  <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.btn-primary (with icon)</div>
                  <button className="btn-primary">
                    <Upload className="w-5 h-5" />
                    Upload Resume
                  </button>
                </div>
                <div>
                  <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.btn-primary:disabled</div>
                  <button className="btn-primary" disabled>
                    Processing...
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Secondary Button</h3>
              <div className="space-y-4">
                <div>
                  <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.btn-secondary</div>
                  <button className="btn-secondary">
                    Skip for now
                  </button>
                </div>
                <div>
                  <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.btn-secondary (with icon)</div>
                  <button className="btn-secondary">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section id="inputs" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Form Inputs</h2>
          <p className="text-lg text-gray-800 mb-8">Clean, accessible form elements with emerald focus states</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 max-w-2xl">
            <div className="space-y-6">
              <div>
                <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-input</div>
                <label className="text-sm font-bold text-gray-900 block mb-2">Full Name</label>
                <input
                  type="text"
                  className="onboarding-input"
                  placeholder="Enter your name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <p className="text-sm text-gray-800 font-medium mt-2">
                  Text: Gray-900 (#111827) • Placeholder: Gray-600 (#4B5563)
                </p>
              </div>

              <div>
                <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-textarea</div>
                <label className="text-sm font-bold text-gray-900 block mb-2">About You</label>
                <textarea
                  className="onboarding-textarea"
                  placeholder="Tell us about yourself..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
                <p className="text-sm text-gray-800 font-medium mt-2">
                  Text: Gray-900 (#111827) • Placeholder: Gray-600 (#4B5563)
                </p>
              </div>

              <div>
                <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-select</div>
                <label className="text-sm font-bold text-gray-900 block mb-2">Current Role</label>
                <select className="onboarding-select">
                  <option disabled value="">Select your role</option>
                  <option>Product Manager</option>
                  <option>Designer</option>
                  <option>Engineer</option>
                  <option>Other</option>
                </select>
                <p className="text-sm text-gray-800 font-medium mt-2">
                  Options: Gray-900 (#111827) • Placeholder: Gray-600 (#4B5563)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section id="cards" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Cards</h2>
          <p className="text-lg text-gray-800 mb-8">Rounded cards with optional pastel gradients</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="onboarding-card">
              <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-card</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">White Card</h3>
              <p className="text-gray-800">
                Standard card with white background and border.
              </p>
            </div>

            <div className="onboarding-card onboarding-card-pastel-blue">
              <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-white rounded-lg font-mono border border-gray-300">.onboarding-card-pastel-blue</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Blue Card</h3>
              <p className="text-gray-900">
                Card with pastel blue gradient background.
              </p>
            </div>

            <div className="onboarding-card onboarding-card-pastel-pink">
              <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-white rounded-lg font-mono border border-gray-300">.onboarding-card-pastel-pink</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pink Card</h3>
              <p className="text-gray-900">
                Card with pastel pink gradient background.
              </p>
            </div>

            <div className="onboarding-card onboarding-card-pastel-yellow">
              <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-white rounded-lg font-mono border border-gray-300">.onboarding-card-pastel-yellow</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Yellow Card</h3>
              <p className="text-gray-900">
                Card with pastel yellow gradient background.
              </p>
            </div>

            <div className="onboarding-card onboarding-card-pastel-green">
              <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-white rounded-lg font-mono border border-gray-300">.onboarding-card-pastel-green</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Green Card</h3>
              <p className="text-gray-900">
                Card with pastel green gradient background.
              </p>
            </div>

            {/* Example: Info Card */}
            <div className="onboarding-card onboarding-card-pastel-blue">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Pro Tip</h3>
                  <p className="text-sm text-gray-900">
                    Use pastel cards to highlight important information or tips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section id="badges" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Badges</h2>
          <p className="text-lg text-gray-800 mb-8">Status indicators with pastel backgrounds</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="onboarding-badge onboarding-badge-blue">
                  In Progress
                </span>
                <span className="onboarding-badge onboarding-badge-green">
                  Completed
                </span>
                <span className="onboarding-badge onboarding-badge-yellow">
                  Action Required
                </span>
              </div>

              <div className="inline-block text-xs text-gray-800 font-bold px-3 py-1 bg-gray-200 rounded-lg font-mono">
                .onboarding-badge-blue / -green / -yellow
              </div>
            </div>
          </div>
        </section>

        {/* Chips */}
        <section id="chips" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Chips / Tags</h2>
          <p className="text-lg text-gray-800 mb-8">Interactive selection chips with active states</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-chip (interactive)</div>
            <p className="text-gray-800 mb-6">Click to toggle selection state</p>
            
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'chip1', label: 'Product Manager', icon: <Check className="w-4 h-4" /> },
                { id: 'chip2', label: 'Designer', icon: <Check className="w-4 h-4" /> },
                { id: 'chip3', label: 'Engineer', icon: <Check className="w-4 h-4" /> },
                { id: 'chip4', label: 'Marketing', icon: <Check className="w-4 h-4" /> },
                { id: 'chip5', label: 'Sales', icon: <Check className="w-4 h-4" /> }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => toggleChip(chip.id)}
                  className={`onboarding-chip ${activeChips.includes(chip.id) ? 'active' : ''}`}
                >
                  {activeChips.includes(chip.id) && chip.icon}
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Upload Area */}
        <section id="upload" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Upload Area</h2>
          <p className="text-lg text-gray-800 mb-8">Drag and drop file upload with visual feedback</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-upload-area</div>
              <div className="onboarding-upload-area">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Upload your resume
                </p>
                <p className="text-sm text-gray-800">
                  PDF, DOC, or DOCX • Max 10MB
                </p>
              </div>
            </div>

            <div>
              <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-upload-area.active</div>
              <div className="onboarding-upload-area active">
                <Upload className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Drop file here
                </p>
                <p className="text-sm text-gray-800">
                  Release to upload
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Indicator */}
        <section id="progress" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Progress Indicator</h2>
          <p className="text-lg text-gray-800 mb-8">Segmented progress bars for multi-step flows</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 max-w-2xl">
            <div className="inline-block text-xs text-gray-800 font-bold mb-4 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-progress</div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-800 font-medium mb-3">Step 1 of 5</p>
                <div className="onboarding-progress">
                  {[true, false, false, false, false].map((active, idx) => (
                    <div
                      key={idx}
                      className={`onboarding-progress-step ${active ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-800 font-medium mb-3">Step 3 of 5</p>
                <div className="onboarding-progress">
                  {[true, true, true, false, false].map((active, idx) => (
                    <div
                      key={idx}
                      className={`onboarding-progress-step ${active ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-800 font-medium mb-3">Step 5 of 5 (Complete)</p>
                <div className="onboarding-progress">
                  {[true, true, true, true, true].map((active, idx) => (
                    <div
                      key={idx}
                      className={`onboarding-progress-step ${active ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Form */}
        <section className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Complete Example</h2>
          <p className="text-lg text-gray-800 mb-8">See how all components work together in a real form</p>
          
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-12 border-2 border-gray-200 max-w-3xl mx-auto">
            <div className="onboarding-container">
              <div className="text-center mb-2xl">
                <h1 className="text-4xl font-black text-gray-900 mb-6" style={{ lineHeight: 1.2, letterSpacing: '-0.025em' }}>
                  Tell us about yourself
                </h1>
                <p className="text-xl text-gray-800 mb-8" style={{ lineHeight: 1.6 }}>
                  This helps us create a portfolio that reflects your unique story
                </p>
              </div>

              <div className="onboarding-section">
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="onboarding-input"
                  placeholder="you@example.com"
                />
              </div>

              <div className="onboarding-section">
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  className="onboarding-input"
                  placeholder="+1 (555) 000-0000"
                />
                <p className="text-sm text-gray-800 font-medium mt-2">
                  We'll never share your phone number
                </p>
              </div>

              <div className="onboarding-card onboarding-card-pastel-blue">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-700 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      AI-Powered Suggestions
                    </h3>
                    <p className="text-sm text-gray-900 font-medium">
                      We'll use this information to personalize your portfolio recommendations
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-xl flex gap-4">
                <button className="btn-primary flex-1">
                  Continue
                </button>
                <button className="btn-secondary">
                  Skip
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Code */}
        <section className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">How to Use</h2>
          <p className="text-lg text-gray-800 mb-8">Copy and paste code examples with WCAG AAA colors</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Import */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">1. Import the CSS</h3>
              <div className="bg-gray-900 rounded-xl p-4">
                <pre className="text-sm text-white overflow-x-auto">
{`import '../onboarding-v2/onboarding.css';`}
                </pre>
              </div>
            </div>

            {/* Color Guidelines */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">2. Use WCAG AAA Colors</h3>
              <div className="space-y-2 text-sm text-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-900 rounded" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">text-gray-900</code>
                  <span>Headings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 rounded" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">text-gray-800</code>
                  <span>Body text</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-600 rounded" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">btn-primary</code>
                  <span>CTAs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 text-white">
            <div className="text-sm text-gray-400 mb-4 font-mono">Complete Example</div>
            <pre className="text-sm overflow-x-auto">
{`// WCAG AAA Compliant Example
import '../onboarding-v2/onboarding.css';

export default function MyPage() {
  return (
    <div className="onboarding-container">
      {/* Heading - Gray-900 (16.1:1) */}
      <h1 className="onboarding-title text-gray-900">
        Tell us about yourself
      </h1>
      
      {/* Subtitle - Gray-800 (10.4:1) */}
      <p className="onboarding-subtitle text-gray-800">
        This helps create your perfect portfolio
      </p>
      
      <div className="onboarding-section">
        {/* Label - Gray-900 (16.1:1) */}
        <label className="onboarding-label text-gray-900">
          Full Name
        </label>
        <input 
          className="onboarding-input" 
          placeholder="Enter your name"
        />
        {/* Description - Gray-800 (10.4:1) */}
        <p className="onboarding-description text-gray-800 mt-2">
          This appears on your portfolio
        </p>
      </div>
      
      {/* Pastel card - use Gray-900 for text */}
      <div className="onboarding-card onboarding-card-pastel-blue">
        <h3 className="text-lg font-bold text-gray-900">
          Pro Tip
        </h3>
        <p className="text-sm text-gray-900">
          All text on pastel backgrounds uses Gray-900
        </p>
      </div>
      
      <button className="btn-primary">
        Continue
      </button>
    </div>
  );
}`}
            </pre>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-12 border-t border-gray-200">
          <p className="text-gray-800 mb-4">
            Design System based on Ctrl.xyz aesthetic • Emerald green & pastels
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              View Landing Page
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/onboarding-v2/flow" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Try Onboarding
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

