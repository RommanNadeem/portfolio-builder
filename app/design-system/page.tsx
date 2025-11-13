'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  // Existing icons
  ArrowLeft, 
  Upload, 
  Check, 
  Sparkles, 
  Mail, 
  Phone,
  Linkedin,
  Github,
  Calendar,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  ArrowRight,
  HelpCircle,
  // Navigation & Direction
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  Command,
  MoreVertical,
  GripVertical,
  MoveVertical,
  MoveHorizontal,
  Move,
  Maximize2,
  Minimize2,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
  CornerDownLeft,
  CornerDownRight,
  CornerUpLeft,
  CornerUpRight,
  // Files & Documents
  File,
  FileText,
  FileEdit,
  FileSpreadsheet,
  Download,
  Video,
  Film,
  Image as ImageIcon,
  FileImage,
  FileCode,
  FileJson,
  Files,
  Folder,
  FolderOpen,
  FolderPlus,
  Archive,
  Paperclip,
  // Actions & Controls
  Plus,
  X,
  Eye,
  EyeOff,
  Pencil,
  Edit2,
  Edit3,
  Trash2,
  Copy,
  RefreshCw,
  Save,
  Undo,
  Redo,
  RotateCw,
  RotateCcw,
  Search,
  Filter,
  SlidersHorizontal,
  Share,
  Share2,
  Send,
  PlayCircle,
  PauseCircle,
  StopCircle,
  // Status & Feedback
  CheckCircle2,
  Clock,
  Ban,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Bell,
  BellOff,
  BellRing,
  Flag,
  Bookmark,
  Heart,
  ThumbsUp,
  ThumbsDown,
  // Social & Communication
  User,
  Twitter,
  Instagram,
  Globe,
  MessageSquare,
  MessageCircle,
  AtSign,
  Hash,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  Facebook,
  Youtube,
  Slack,
  Send as SendIcon,
  // Content & Features
  Star,
  Award,
  Briefcase,
  Building2,
  Package,
  TrendingUp,
  Lightbulb,
  Zap,
  Tag,
  Tags,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Percent,
  Target,
  TrendingDown,
  Activity,
  BarChart,
  BarChart2,
  BarChart3,
  PieChart,
  LineChart,
  // Layout & Design
  Monitor,
  Smartphone,
  LayoutDashboard,
  AlignLeft,
  Palette,
  Tablet,
  Laptop,
  Layout,
  Grid,
  List,
  Columns,
  Rows,
  Sidebar,
  PanelLeft,
  PanelRight,
  Square,
  Circle,
  Triangle,
  // Template Specific
  Rocket,
  Code,
  Microscope,
  Settings,
  LogOut,
  Link2,
  Home,
  Inbox,
  Database,
  Server,
  Cloud,
  CloudUpload,
  CloudDownload,
  Wifi,
  WifiOff,
  Bluetooth,
  Cast,
  Radio,
  Printer,
  HardDrive,
  Cpu,
  // Text & Typography
  Type,
  Bold,
  Italic,
  Underline,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List as ListIcon,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code2,
  // Media & Image
  Music,
  Mic,
  MicOff,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Play,
  Pause,
  FastForward,
  Rewind,
  SkipForward,
  SkipBack,
  // Time & Calendar
  CalendarDays,
  CalendarClock,
  Timer,
  Hourglass,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  // Tools & Utilities
  Wrench,
  Hammer,
  Scissors,
  Ruler,
  Compass,
  Anchor,
  Key,
  Feather,
  Pipette,
  Magnet,
  Bug
} from 'lucide-react';
import '../onboarding-v2/onboarding.css';

export default function DesignSystemPage() {
  const [activeChips, setActiveChips] = useState<string[]>(['chip1']);
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

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
              <img src="/icon.svg" alt="BuildSpace" className="h-10" />
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
            {['Language', 'Colors', 'Typography', 'Spacing', 'Shadows', 'Radius', 'Buttons', 'Inputs', 'Thin Inputs', 'Editor Inputs', 'Checkboxes', 'Validation', 'Required Fields', 'Tooltips', 'Cards', 'Alerts', 'Badges', 'Chips', 'Upload', 'Progress', 'Links', 'Icons', 'Icon Library', 'Loading', 'Editor UI', 'Current vs Recommended'].map(section => (
              <a
                key={section}
                href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
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
            BuildSpace Design System
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

        {/* Language & Tone */}
        <section id="language" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Brand Voice Guidelines</h2>
          <p className="text-lg text-gray-800 mb-8">Bold, playful, direct voice for freelancers building credible portfolios fast</p>

          {/* Positioning and Audience */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border-2 border-green-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">1. Positioning and Audience</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-green-300">
                <div className="text-sm font-bold text-emerald-700 mb-2">AUDIENCE</div>
                <div className="text-lg font-bold text-gray-900 mb-3">Freelancers who want a credible portfolio fast</div>
                <div className="space-y-2 text-sm text-gray-800">
                  <div><strong>First Action:</strong> build your story</div>
                  <div><strong>Voice Archetype:</strong> Coach (primary), Builder (secondary)</div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border-2 border-green-300">
                <div className="text-sm font-bold text-emerald-700 mb-2">CORE PROMISE</div>
                <div className="text-lg font-bold text-gray-900 mb-3">Time-Based Commitment</div>
                <div className="space-y-2 text-sm text-gray-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span><strong>Hero:</strong> "60 seconds"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span><strong>Elsewhere:</strong> "under a minute"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personality and Tone */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">2. Personality and Tone</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Traits', value: 'Bold, Playful, Direct' },
                { label: 'Playfulness', value: 'Light' },
                { label: 'Reading Level', value: 'Grade 8' },
                { label: 'POV', value: 'Second Person (you/your)' },
                { label: 'Warmth', value: 'Clear and human, never snarky' },
                { label: 'Exclamations', value: 'Rare, only for success' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-xs font-bold text-blue-800 mb-1">{item.label.toUpperCase()}</div>
                  <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Headline and CTA Mechanics */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">3. Headline and CTA Mechanics</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                  <div className="text-sm font-bold text-green-800 mb-3">HEADLINE RULES</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-800 mb-1">Pattern</div>
                      <div className="font-mono text-lg font-bold text-gray-900">Verb + Outcome</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-800 mb-1">Casing</div>
                      <div className="font-semibold text-gray-900">Title Case, No Periods</div>
                    </div>
                    <div className="pt-3 border-t border-green-300">
                      <div className="text-xs font-bold text-green-800 mb-2">✅ EXAMPLES</div>
                      <div className="space-y-1 text-sm text-gray-900 font-semibold">
                        <div>Turn Your Experience Into Story</div>
                        <div>Build Your Story</div>
                        <div>Publish and Share</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                  <div className="text-sm font-bold text-blue-800 mb-3">CTA RULES</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-800 mb-1">Casing</div>
                      <div className="font-semibold text-gray-900">Title Case</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-800 mb-1">Wording</div>
                      <div className="font-semibold text-gray-900">Descriptive verbs</div>
                    </div>
                    <div className="pt-3 border-t border-blue-300">
                      <div className="text-xs font-bold text-blue-800 mb-2">PRIMARY & SECONDARY</div>
                      <div className="space-y-2">
                        <button className="btn-primary w-full justify-center">Build Your Story</button>
                        <button className="btn-secondary w-full justify-center" style={{ color: '#111111' }}>See Live Example</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                <div className="text-sm font-bold text-red-800 mb-3">🚫 NO ARROWS IN COPY</div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-bold text-red-800 mb-2">❌ DON'T</div>
                    <div className="text-sm text-gray-900 line-through">Resume → Portfolio</div>
                    <div className="text-sm text-gray-900 line-through">Experience → Story</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-green-800 mb-2">✅ DO</div>
                    <div className="text-sm text-gray-900 font-semibold">Experience to Portfolio</div>
                    <div className="text-sm text-gray-900 font-semibold">Turn Experience Into Story</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Resume Wording Policy - CRITICAL */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-8 border-2 border-yellow-300 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-700" />
              5. The "Resume" Wording Policy
            </h3>
            <div className="p-4 bg-white rounded-xl border-2 border-yellow-400 mb-6">
              <div className="text-sm font-bold text-yellow-900 mb-2">🎯 GOAL</div>
              <div className="text-gray-900 font-semibold">Reduce repetition and avoid sounding generic while staying clear</div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                  <div className="text-sm font-bold text-green-800 mb-3">✅ PREFER THESE</div>
                  <div className="space-y-2">
                    {[
                      'experience',
                      'work history',
                      'career profile',
                      'portfolio PDF',
                      'professional background'
                    ].map((term, idx) => (
                      <div key={idx} className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        {term}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                  <div className="text-sm font-bold text-red-800 mb-3">🚫 USE "RESUME" SPARINGLY</div>
                  <div className="space-y-2 text-sm text-gray-900">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Use only in high-intent moments</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Hero line or upload control</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>Max once per screen</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Keep in alt text or metadata for SEO</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <div className="text-lg font-bold text-gray-900 mb-4">Find and Replace Guidance</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-bold text-gray-900">Instead of...</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-900">Say...</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { old: 'Upload your resume', new: 'Upload your work history' },
                        { old: 'We parse your resume', new: 'We parse your career profile' },
                        { old: 'Resume to portfolio', new: 'Experience to portfolio' },
                        { old: 'Attach resume', new: 'Attach career profile' },
                        { old: 'Update your resume', new: 'Update your background' }
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800 line-through">{row.old}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{row.new}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                  <div className="text-sm font-bold text-green-800 mb-3">✅ GOOD EXAMPLE</div>
                  <div className="space-y-2">
                    <div className="font-bold text-gray-900 text-lg">Turn Your Experience Into Story</div>
                    <div className="text-sm text-gray-800">Upload your work history. Get your portfolio under a minute.</div>
                    <div className="mt-3 pt-3 border-t border-green-300 text-xs text-gray-700 italic">
                      "Resume" not used at all - clear and fresh
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                  <div className="text-sm font-bold text-red-800 mb-3">❌ BAD EXAMPLE</div>
                  <div className="space-y-2">
                    <div className="font-bold text-gray-900 text-lg line-through">Turn Your Resume Into Story</div>
                    <div className="text-sm text-gray-800 line-through">Upload your resume. Get your resume portfolio.</div>
                    <div className="mt-3 pt-3 border-t border-red-300 text-xs text-gray-700 italic">
                      "Resume" used 3 times - repetitive and generic
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Writing Rules */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">6. Writing Rules</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Do's */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                  <h4 className="text-xl font-bold text-gray-900">DO</h4>
                </div>
                <div className="space-y-3">
                  {[
                    'Short, punchy sentences',
                    'Lead with verbs',
                    'Use specific timeframes',
                    'Use "you" and "your"',
                    'Be specific with numbers',
                    'End with clear CTAs'
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="font-bold text-gray-900 text-sm">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Don'ts */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h4 className="text-xl font-bold text-gray-900">DO NOT</h4>
                </div>
                <div className="space-y-3">
                  {[
                    'Use corporate clichés or buzzwords',
                    'Be vague about time or value',
                    'Use passive voice or hedge',
                    'Over-explain features',
                    'Sound formal or bureaucratic'
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-xl border border-red-200">
                      <div className="font-bold text-gray-900 text-sm">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Banned Terms */}
            <div className="mt-8 p-6 bg-red-50 rounded-2xl border-2 border-red-300">
              <div className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-700" />
                Banned Terms
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'synergy', 'best in class', 'leverage', 'innovative', 'cutting edge',
                  'empower', 'game changing', 'ninja', 'rockstar', 'industry leading', 'world class'
                ].map((term, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-100 text-red-900 rounded-full text-sm font-semibold line-through">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Grammar and Style */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">7. Grammar and Style</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { rule: 'Contractions', value: 'None', example: 'Write "do not" not "don\'t"' },
                { rule: 'Numbers', value: 'Spell out 1–9, digits 10+', example: 'three projects, 15 days' },
                { rule: 'Punctuation', value: 'Short lines, minimal commas', example: 'Upload. Review. Publish.' },
                { rule: 'Arrows', value: 'Do not use', example: 'Write "to" not "→"' },
                { rule: 'Spelling', value: 'US English', example: 'Color not colour' },
                { rule: 'Periods', value: 'Not in headlines', example: 'Build Your Story' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-xs font-bold text-blue-800 mb-1">{item.rule.toUpperCase()}</div>
                  <div className="font-semibold text-gray-900 mb-2">{item.value}</div>
                  <div className="text-xs text-gray-800 italic">{item.example}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tone by Context */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">8. Tone by Context with Samples</h3>
            <div className="space-y-4">
              {/* Landing Hero */}
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-green-200">
                <div className="text-sm font-bold text-green-800 mb-3">LANDING HERO</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-700 mb-1">Headline</div>
                    <div className="font-bold text-gray-900 text-xl">Turn Your Experience Into Story</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-700 mb-1">Subhead</div>
                    <div className="text-gray-900">Upload your work history. Get a narrative portfolio under a minute.</div>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-primary">Build Your Story</button>
                    <button className="btn-secondary" style={{ color: '#111111' }}>See Live Example</button>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="text-sm font-bold text-blue-800 mb-3">HOW IT WORKS</div>
                <div className="space-y-2 text-gray-900">
                  <div className="font-semibold">Step 1: Upload your career profile</div>
                  <div className="font-semibold">Step 2: Review your story</div>
                  <div className="font-semibold">Step 3: Publish and share</div>
                </div>
              </div>

              {/* Onboarding Instructions */}
              <div className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                <div className="text-sm font-bold text-yellow-800 mb-3">ONBOARDING INSTRUCTIONS</div>
                <div className="text-sm text-gray-800 mb-3 italic">Short and directive</div>
                <div className="space-y-2 text-gray-900 font-semibold">
                  <div>Add one project you are proud of</div>
                  <div>Tell us your role and outcomes</div>
                  <div>Add a result, for example 3X leads or 25% faster delivery</div>
                </div>
              </div>

              {/* Success Messages */}
              <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                <div className="text-sm font-bold text-green-800 mb-3">SUCCESS MESSAGES</div>
                <div className="space-y-2 text-gray-900 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Your portfolio is live. Share it now
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Changes published successfully
                  </div>
                </div>
              </div>

              {/* Errors */}
              <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                <div className="text-sm font-bold text-red-800 mb-3">ERRORS</div>
                <div className="space-y-2 text-gray-900 font-semibold">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    That did not work. Sorry about that. Try again or contact support
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    File too large. Max 10 MB
                  </div>
                </div>
              </div>

              {/* Empty States */}
              <div className="p-6 bg-purple-50 rounded-2xl border-2 border-purple-200">
                <div className="text-sm font-bold text-purple-800 mb-3">EMPTY STATES</div>
                <div className="space-y-2 text-gray-900 font-semibold">
                  <div>No projects yet. Add your first one</div>
                  <div>Start with a case study. Show what you shipped</div>
                </div>
              </div>
            </div>
          </div>

          {/* Proof and Credibility */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">4. Proof and Credibility</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                  <div className="text-sm font-bold text-green-800 mb-3">PRIMARY PROOF FORMATS</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <Check className="w-4 h-4 text-green-600" />
                      Before vs after visuals
                    </div>
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <Check className="w-4 h-4 text-green-600" />
                      Live interactive examples
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                  <div className="text-sm font-bold text-blue-800 mb-3">CLAIM STYLE</div>
                  <div className="text-gray-900 font-semibold mb-3">Inline metric with timeframe</div>
                  <div className="p-3 bg-white rounded-lg border border-blue-300">
                    <div className="font-bold text-gray-900">Up 42% in 30 days</div>
                  </div>
                  <div className="text-xs text-gray-700 mt-2 italic">Specific number + specific time</div>
                </div>
              </div>

              <div className="p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                <div className="text-sm font-bold text-red-800 mb-2">❌ AVOID</div>
                <div className="space-y-1 text-gray-900 font-medium">
                  <div className="line-through">Vague claims</div>
                  <div className="line-through">Unbounded promises</div>
                  <div className="line-through">"Results may vary"</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reference Summary Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border-2 border-green-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-700" />
              One-Page Style Card Summary
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Audience', value: 'freelancers' },
                { label: 'Action', value: 'build your story' },
                { label: 'Promise', value: '60 seconds hero, under a minute elsewhere' },
                { label: 'Voice', value: 'bold, playful, direct' },
                { label: 'Pattern', value: 'Verb + Outcome' },
                { label: 'Headlines', value: 'Title Case, no periods' },
                { label: 'CTAs', value: 'Title Case, verbs' },
                { label: '"Resume" policy', value: 'prefer "experience", use sparingly' },
                { label: 'Proof', value: 'before vs after, metric + timeframe' },
                { label: 'Grammar', value: 'no contractions, 1–9 spelled out' },
                { label: 'Errors', value: 'apology plus fix' },
                { label: 'Banned', value: 'see list above' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border-2 border-green-200">
                  <div className="text-xs font-bold text-green-800 mb-1">{item.label.toUpperCase()}</div>
                  <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Color System */}
        <section id="colors" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Color System</h2>
          <p className="text-lg text-gray-800 mb-8">Emerald green primary with pastel accents</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Primary Colors */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Primary CTA Color</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border-2" style={{ background: '#5BC64A', borderColor: '#111111' }} />
                  <div>
                    <div className="font-semibold text-gray-900">Bright Green</div>
                    <div className="text-sm text-gray-800 mb-1">#5BC64A</div>
                    <div className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold inline-block">✅ AAA (8.2:1)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border-2" style={{ background: '#4AB33D', borderColor: '#111111' }} />
                  <div>
                    <div className="font-semibold text-gray-900">Darker Green (Hover)</div>
                    <div className="text-sm text-gray-800 mb-1">#4AB33D</div>
                    <div className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold inline-block">Hover State</div>
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
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Color Swatch</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Hex Code</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Tailwind Class</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">WCAG</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { use: 'Headings (H1, H2, H3)', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Form labels', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Button text (secondary)', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Chip text (default)', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Dropdown options', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Input text (typed)', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' },
                    { use: 'Body paragraphs', color: 'Gray-800', hex: '#1F2937', tw: 'text-gray-800', wcag: 'AAA' },
                    { use: 'Descriptions', color: 'Gray-800', hex: '#1F2937', tw: 'text-gray-800', wcag: 'AAA' },
                    { use: 'Input placeholders', color: 'Gray-700', hex: '#374151', tw: 'placeholder-gray-700', wcag: 'AA+' },
                    { use: 'Textarea placeholders', color: 'Gray-700', hex: '#374151', tw: 'placeholder-gray-700', wcag: 'AA+' },
                    { use: 'Select placeholder option', color: 'Gray-700', hex: '#374151', tw: 'option:disabled', wcag: 'AA+' },
                    { use: 'Text on pastel cards', color: 'Gray-900', hex: '#111827', tw: 'text-gray-900', wcag: 'AAA' }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800 font-medium">{row.use}</td>
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-lg border-2 border-gray-200" style={{ backgroundColor: row.hex }} />
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900 font-mono text-xs font-bold">{row.hex}</span>
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

        {/* Spacing System */}
        <section id="spacing" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Spacing System</h2>
          <p className="text-lg text-gray-800 mb-8">Consistent spacing scale for layouts and components</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="space-y-6">
              {[
                { name: 'XS', value: '8px', rem: '0.5rem', var: '--spacing-xs', example: '8px' },
                { name: 'SM', value: '12px', rem: '0.75rem', var: '--spacing-sm', example: '12px' },
                { name: 'MD', value: '16px', rem: '1rem', var: '--spacing-md', example: '16px' },
                { name: 'LG', value: '24px', rem: '1.5rem', var: '--spacing-lg', example: '24px' },
                { name: 'XL', value: '32px', rem: '2rem', var: '--spacing-xl', example: '32px' },
                { name: '2XL', value: '48px', rem: '3rem', var: '--spacing-2xl', example: '48px' },
                { name: '3XL', value: '64px', rem: '4rem', var: '--spacing-3xl', example: '64px' }
              ].map((spacing, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <div className="w-20">
                    <div className="text-lg font-bold text-gray-900">{spacing.name}</div>
                    <div className="text-xs text-gray-800 font-mono">{spacing.var}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className="h-12 bg-emerald-500 rounded-lg border-2 border-emerald-700"
                      style={{ width: spacing.example }}
                    />
                    <div className="text-sm text-gray-800">
                      <div className="font-bold">{spacing.value}</div>
                      <div className="text-gray-700">{spacing.rem}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-900 mb-2">
                <strong>Usage:</strong> Use CSS variables like <code className="bg-white px-2 py-0.5 rounded font-mono text-xs">var(--spacing-md)</code>
              </p>
              <p className="text-sm text-gray-800">
                These create visual rhythm and consistent component sizing throughout the application.
              </p>
            </div>
          </div>
        </section>

        {/* Shadows / Elevation */}
        <section id="shadows" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Shadows / Elevation</h2>
          <p className="text-lg text-gray-800 mb-8">Four elevation levels for depth and hierarchy</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'SM', value: 'shadow-sm', css: '0 1px 2px rgba(0,0,0,0.05)', use: 'Subtle depth' },
              { name: 'MD', value: 'shadow-md', css: '0 4px 6px rgba(0,0,0,0.07)', use: 'Cards, dropdowns' },
              { name: 'LG', value: 'shadow-lg', css: '0 10px 15px rgba(0,0,0,0.1)', use: 'Modals, popovers' },
              { name: 'XL', value: 'shadow-xl', css: '0 20px 25px rgba(0,0,0,0.1)', use: 'Major elements' }
            ].map((shadow, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <div className={`bg-white rounded-xl p-6 mb-4 ${shadow.value}`}>
                  <div className="text-2xl font-black text-gray-900 mb-2">{shadow.name}</div>
                  <div className="text-xs text-gray-800 font-mono">{shadow.value}</div>
                </div>
                <div className="text-sm text-gray-800">
                  <div className="font-bold text-gray-900 mb-1">{shadow.use}</div>
                  <div className="text-xs text-gray-700 font-mono">{shadow.css}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section id="radius" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Border Radius</h2>
          <p className="text-lg text-gray-800 mb-8">Rounded corners for a friendly, modern aesthetic</p>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'SM', value: '8px', class: 'rounded-lg', css: 'var(--radius-sm)' },
              { name: 'MD', value: '12px', class: 'rounded-xl', css: 'var(--radius-md)' },
              { name: 'LG', value: '16px', class: 'rounded-2xl', css: 'var(--radius-lg)' },
              { name: 'XL', value: '24px', class: 'rounded-3xl', css: 'var(--radius-xl)' },
              { name: '2XL', value: '28px', class: 'rounded-[28px]', css: 'var(--radius-2xl)' },
              { name: 'FULL', value: '9999px', class: 'rounded-full', css: 'var(--radius-full)' }
            ].map((radius, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <div 
                  className={`w-full h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 mb-4 border-2 border-emerald-700 ${radius.class}`}
                />
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{radius.name}</div>
                  <div className="text-sm text-gray-800">{radius.value}</div>
                  <div className="text-xs text-gray-700 font-mono mt-1">{radius.css}</div>
                </div>
              </div>
            ))}
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
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md border-2" style={{ background: '#5BC64A', borderColor: '#111111' }}>
                    <Check className="w-8 h-8" style={{ color: '#111111' }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Primary Button</div>
                    <div className="text-xs px-2 py-0.5 bg-green-200 text-green-900 rounded-full font-bold inline-block mt-1">
                      AAA Compliant
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-800">
                  <div><strong>Background:</strong> Bright Green (#5BC64A)</div>
                  <div><strong>Text:</strong> Black (#111111)</div>
                  <div><strong>Border:</strong> 2px solid #111111</div>
                  <div><strong>Contrast:</strong> 8.2:1</div>
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
                  <div><strong>Text:</strong> Black (#111111)</div>
                  <div><strong>Border:</strong> 2px solid Gray-200</div>
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
                  <button className="btn-secondary" style={{ color: '#111111' }}>
                    Skip for now
                  </button>
                </div>
                <div>
                  <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.btn-secondary (with icon)</div>
                  <button className="btn-secondary" style={{ color: '#111111' }}>
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
                  style={{ color: '#111111' }}
                />
                <p className="text-sm text-gray-800 font-medium mt-2">
                  Text: Gray-900 (#111827) • Placeholder: Gray-700 (#374151)
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
                  style={{ color: '#111111' }}
                />
                <p className="text-sm text-gray-800 font-medium mt-2">
                  Text: Gray-900 (#111827) • Placeholder: Gray-700 (#374151)
                </p>
              </div>

              <div>
                <div className="inline-block text-xs text-gray-800 font-bold mb-3 px-3 py-1 bg-gray-200 rounded-lg font-mono">.onboarding-select</div>
                <label className="text-sm font-bold text-gray-900 block mb-2">Current Role</label>
                <select className="onboarding-select" style={{ color: '#111111' }}>
                  <option disabled value="">Select your role</option>
                  <option>Product Manager</option>
                  <option>Designer</option>
                  <option>Engineer</option>
                  <option>Other</option>
                </select>
                <p className="text-sm text-gray-800 font-medium mt-2">
                  Options: Gray-900 (#111827) • Placeholder: Gray-700 (#374151)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Checkboxes & Radio Buttons */}
        <section id="checkboxes" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Checkboxes & Radio Buttons</h2>
          <p className="text-lg text-gray-800 mb-8">Form selection controls with emerald accent</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Checkboxes */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Checkboxes</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-5 h-5 rounded border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium group-hover:text-emerald-600 transition-colors">
                    Send me portfolio tips
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium group-hover:text-emerald-600 transition-colors">
                    Weekly design inspiration
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer opacity-50">
                  <input 
                    type="checkbox"
                    disabled
                    className="w-5 h-5 rounded border-2 border-gray-300 text-emerald-600 cursor-not-allowed"
                  />
                  <span className="text-gray-900 font-medium">
                    Disabled option
                  </span>
                </label>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-900">
                  <strong>Accent:</strong> Emerald-600 • <strong>Border:</strong> Gray-300
                </p>
              </div>
            </div>

            {/* Radio Buttons */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Radio Buttons</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio"
                    name="plan"
                    defaultChecked
                    className="w-5 h-5 border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium group-hover:text-emerald-600 transition-colors">
                    Free plan
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio"
                    name="plan"
                    className="w-5 h-5 border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium group-hover:text-emerald-600 transition-colors">
                    Pro plan
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio"
                    name="plan"
                    className="w-5 h-5 border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
                  />
                  <span className="text-gray-900 font-medium group-hover:text-emerald-600 transition-colors">
                    Enterprise plan
                  </span>
                </label>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-900">
                  <strong>Accent:</strong> Emerald-600 • <strong>Border:</strong> Gray-300
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Thin Input Fields */}
        <section id="thin-inputs" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Thin Input Fields ⭐ NEW</h2>
          <p className="text-lg text-gray-800 mb-8">Compact, brand-consistent inputs for editor sidebar and tight spaces</p>
          
          {/* Design Philosophy */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border-2 border-emerald-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Design Philosophy</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-3">🎯 Purpose</h4>
                <p className="text-sm text-gray-700">Compact inputs for editor sidebar, settings, and anywhere space is limited</p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-3">✨ Key Feature</h4>
                <p className="text-sm text-gray-700">Maintains brand consistency (2px border, emerald focus) while being space-efficient</p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-3">🎨 Difference</h4>
                <p className="text-sm text-gray-700">43% smaller padding, 12.5% smaller font, but same visual identity</p>
              </div>
            </div>
          </div>

          {/* Thin Input Examples */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Thin Input Field</h3>
            
            <div className="max-w-md space-y-6">
              {/* Text Input */}
              <div>
                <label className="thin-label">
                  Project Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="thin-input"
                  placeholder="Enter project title"
                />
                <p className="thin-helper">Keep it short and descriptive</p>
              </div>

              {/* Email Input */}
              <div>
                <label className="thin-label">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="thin-input"
                  placeholder="you@example.com"
                />
              </div>

              {/* URL Input */}
              <div>
                <label className="thin-label">
                  Website URL <span className="text-gray-600 font-medium text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  className="thin-input"
                  placeholder="https://example.com"
                />
              </div>

              {/* Disabled State */}
              <div>
                <label className="thin-label">
                  Disabled Input
                </label>
                <input
                  type="text"
                  className="thin-input"
                  placeholder="Cannot edit"
                  disabled
                  value="Read-only value"
                />
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Specifications</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-700"><strong>Padding:</strong> 8px 12px</p>
                  <p className="text-gray-700"><strong>Font Size:</strong> 14px (text-sm)</p>
                  <p className="text-gray-700"><strong>Border:</strong> 2px solid gray-200</p>
                  <p className="text-gray-700"><strong>Border Radius:</strong> 8px (rounded-lg)</p>
                </div>
                <div>
                  <p className="text-gray-700"><strong>Focus:</strong> emerald-700 + shadow</p>
                  <p className="text-gray-700"><strong>Label:</strong> text-xs bold gray-900</p>
                  <p className="text-gray-700"><strong>Helper:</strong> text-xs gray-500</p>
                  <p className="text-gray-700"><strong>Class:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded font-mono text-xs">.thin-input</code></p>
                </div>
              </div>
            </div>
          </div>

          {/* Thin Textarea */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Thin Textarea</h3>
            
            <div className="max-w-md space-y-6">
              <div>
                <label className="thin-label">
                  Description
                </label>
                <textarea
                  className="thin-textarea"
                  placeholder="Add a brief description"
                  rows={3}
                ></textarea>
                <p className="thin-helper">Maximum 200 characters</p>
              </div>

              <div>
                <label className="thin-label">
                  Notes <span className="text-gray-600 font-medium text-xs">(Optional)</span>
                </label>
                <textarea
                  className="thin-textarea"
                  placeholder="Additional notes or context"
                  rows={4}
                ></textarea>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Specifications</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-700"><strong>Padding:</strong> 8px 12px</p>
                  <p className="text-gray-700"><strong>Font Size:</strong> 14px (text-sm)</p>
                  <p className="text-gray-700"><strong>Min Height:</strong> 80px</p>
                  <p className="text-gray-700"><strong>Resize:</strong> Vertical only</p>
                </div>
                <div>
                  <p className="text-gray-700"><strong>Border:</strong> 2px solid gray-200</p>
                  <p className="text-gray-700"><strong>Focus:</strong> emerald-700 + shadow</p>
                  <p className="text-gray-700"><strong>Class:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded font-mono text-xs">.thin-textarea</code></p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Input Size Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Property</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Standard Input</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Thin Input ⭐</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Difference</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Padding</td>
                    <td className="py-3 px-4">14px 20px</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">8px 12px</td>
                    <td className="py-3 px-4">-43% height</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Font Size</td>
                    <td className="py-3 px-4">16px (base)</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">14px (sm)</td>
                    <td className="py-3 px-4">-12.5%</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Border</td>
                    <td className="py-3 px-4">2px solid gray-200</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">2px solid gray-200</td>
                    <td className="py-3 px-4">✅ Same</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Border Radius</td>
                    <td className="py-3 px-4">16px (xl)</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">8px (lg)</td>
                    <td className="py-3 px-4">-50%</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Focus Color</td>
                    <td className="py-3 px-4">emerald-700</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">emerald-700</td>
                    <td className="py-3 px-4">✅ Same</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Label Size</td>
                    <td className="py-3 px-4">14px (sm)</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">12px (xs)</td>
                    <td className="py-3 px-4">-14%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Total Height</td>
                    <td className="py-3 px-4">~52px</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">~38px</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">-27% shorter!</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-white rounded-xl border-2 border-emerald-600">
              <p className="text-sm font-bold text-emerald-900 mb-2">✅ Key Benefits:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 27% more compact (fits more in sidebar)</li>
                <li>• Maintains brand emerald focus (consistent!)</li>
                <li>• Keeps 2px border (brand identity)</li>
                <li>• Still WCAG AAA compliant</li>
              </ul>
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">When to Use Thin Inputs</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-green-900 mb-4">✅ Use Thin Inputs For:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Editor left sidebar</strong> - Property editing panels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Settings forms</strong> - Account preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Compact modals</strong> - Small dialogs with limited space</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Inline editing</strong> - Quick property changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Dashboard fields</strong> - Metadata editing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Table cells</strong> - Grid-based editing</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-red-900 mb-4">❌ Use Standard Inputs For:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Onboarding forms</strong> - Use full-size for better UX</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Sign up / Sign in</strong> - Full size for accessibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Primary forms</strong> - Main user input flows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Mobile first</strong> - Larger targets for touch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Critical data entry</strong> - Don't compromise on UX</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Code Examples</h3>
            
            <div className="space-y-6">
              {/* Basic Usage */}
              <div>
                <p className="text-sm text-emerald-400 mb-2">// Basic Thin Input</p>
                <pre className="bg-black/30 rounded-lg p-4 text-sm overflow-x-auto text-gray-300">{`<label className="thin-label">
  Project Title <span className="text-red-600">*</span>
</label>
<input
  type="text"
  className="thin-input"
  placeholder="Enter title"
  required
/>
<p className="thin-helper">Keep it short</p>`}</pre>
              </div>

              {/* Textarea */}
              <div>
                <p className="text-sm text-emerald-400 mb-2">// Thin Textarea</p>
                <pre className="bg-black/30 rounded-lg p-4 text-sm overflow-x-auto text-gray-300">{`<label className="thin-label">
  Description
</label>
<textarea
  className="thin-textarea"
  placeholder="Add description"
  rows={3}
></textarea>`}</pre>
              </div>

              {/* With Optional */}
              <div>
                <p className="text-sm text-emerald-400 mb-2">// With Optional Tag</p>
                <pre className="bg-black/30 rounded-lg p-4 text-sm overflow-x-auto text-gray-300">{`<label className="thin-label">
  Website <span className="text-gray-600 font-medium text-xs">(Optional)</span>
</label>
<input type="url" className="thin-input" />`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Editor Input Fields */}
        <section id="editor-inputs" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Editor Input Fields (Notion-style)</h2>
          <p className="text-lg text-gray-800 mb-8">Borderless inline editing for main content area</p>
          
          {/* Sidebar Inputs */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-3xl p-8 border-2 border-gray-300 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sidebar Inputs</h3>
            <p className="text-sm text-gray-700 mb-6">Compact inputs for the left navigation panel</p>
            
            <div className="space-y-6 max-w-md">
              {/* Text Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Main Heading
                </label>
                <input
                  type="text"
                  placeholder="Enter heading"
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder:text-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500">Helper text goes here</p>
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tagline
                </label>
                <textarea
                  rows={3}
                  placeholder="Your value proposition"
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none placeholder:text-gray-600"
                />
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-md">
              <p className="text-xs text-gray-900 mb-1">
                <strong>Specs:</strong> 1px border-gray-300 • 8px padding • text-sm • rounded-lg
              </p>
              <p className="text-xs text-gray-900">
                <strong>Focus:</strong> 2px ring-gray-900 (or color-coded per section)
              </p>
            </div>
          </div>

          {/* Content Inputs (Notion-style) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Content Inputs (Notion-style)</h3>
            <p className="text-sm text-gray-700 mb-6">Borderless inline editing for main content area</p>
            
            <div className="space-y-6 max-w-3xl">
              {/* Large Title */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Title (40px)</p>
                <input
                  type="text"
                  placeholder="Untitled"
                  className="w-full text-[40px] leading-tight font-semibold tracking-[0.2px] text-gray-900 border-0 bg-transparent focus:outline-none placeholder-italic px-0 py-0 focus:ring-0"
                />
              </div>

              {/* Subtitle */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Subtitle (15px)</p>
                <input
                  type="text"
                  placeholder="Add a subtitle…"
                  className="w-full text-[15px] leading-7 text-gray-800 focus-underline bg-transparent focus:outline-none placeholder-italic px-0 py-2 focus:ring-0"
                />
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Description (15px)</p>
                <textarea
                  placeholder="Add a description…"
                  rows={3}
                  className="w-full text-[15px] leading-7 text-gray-800 focus-underline bg-transparent focus:outline-none placeholder-italic resize-none px-0 py-2 focus:ring-0"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-3xl">
              <p className="text-xs text-gray-900 mb-1">
                <strong>Style:</strong> Borderless • Transparent background • Inline editing feel
              </p>
              <p className="text-xs text-gray-900">
                <strong>Focus:</strong> Subtle underline (focus-underline class) • No visible ring
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Input Style Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Feature</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Onboarding</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Editor Sidebar</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Editor Content</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Border</td>
                    <td className="py-3 px-4">2px solid</td>
                    <td className="py-3 px-4">1px solid</td>
                    <td className="py-3 px-4">0px (transparent)</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Padding</td>
                    <td className="py-3 px-4">12px 16px</td>
                    <td className="py-3 px-4">8px 12px</td>
                    <td className="py-3 px-4">0px or minimal</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Font Size</td>
                    <td className="py-3 px-4">16px (base)</td>
                    <td className="py-3 px-4">14px (sm)</td>
                    <td className="py-3 px-4">15px-40px</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Focus Ring</td>
                    <td className="py-3 px-4">emerald-500</td>
                    <td className="py-3 px-4">gray-900</td>
                    <td className="py-3 px-4">None (underline)</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Background</td>
                    <td className="py-3 px-4">white</td>
                    <td className="py-3 px-4">white</td>
                    <td className="py-3 px-4">transparent</td>
                  </tr>
                  <tr className="border-b border-purple-200">
                    <td className="py-3 px-4 font-semibold">Border Radius</td>
                    <td className="py-3 px-4">12px (xl)</td>
                    <td className="py-3 px-4">8px (lg)</td>
                    <td className="py-3 px-4">0px</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Label Size</td>
                    <td className="py-3 px-4">text-sm</td>
                    <td className="py-3 px-4">text-xs</td>
                    <td className="py-3 px-4">N/A (inline)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Form Validation States */}
        <section id="validation" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Form Validation States</h2>
          <p className="text-lg text-gray-800 mb-8">Visual feedback for form field validation</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 max-w-2xl">
            <div className="space-y-6">
              {/* Success State */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="onboarding-input border-green-500 focus:border-green-500 focus:ring-green-500"
                    value="john@example.com"
                    readOnly
                    style={{ color: '#111111' }}
                  />
                  <CheckCircle className="w-5 h-5 text-green-600 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-green-700 font-medium mt-2 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Email is valid
                </p>
              </div>

              {/* Error State */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="onboarding-input border-red-500 focus:border-red-500 focus:ring-red-500"
                    value="a"
                    readOnly
                    style={{ color: '#111111' }}
                  />
                  <XCircle className="w-5 h-5 text-red-600 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-red-700 font-medium mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Username must be at least 3 characters
                </p>
              </div>

              {/* Warning State */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className="onboarding-input border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500"
                    value="weak"
                    readOnly
                    style={{ color: '#111111' }}
                  />
                  <AlertTriangle className="w-5 h-5 text-yellow-600 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-yellow-700 font-medium mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Password is weak. Consider adding numbers and symbols.
                </p>
              </div>

              {/* Default State */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="onboarding-input"
                  placeholder="+1 (555) 000-0000"
                  style={{ color: '#111111' }}
                />
                <p className="text-sm text-gray-700 font-medium mt-2">
                  Optional field
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Required Fields */}
        <section id="required-fields" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Required Fields</h2>
          <p className="text-lg text-gray-800 mb-8">Visual indicators for mandatory form fields</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 max-w-2xl">
            <div className="space-y-6">
              {/* Required field with asterisk */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="onboarding-input"
                  placeholder="Enter your name"
                  required
                  style={{ color: '#111111' }}
                />
                <p className="text-xs text-gray-700 mt-2">
                  <span className="text-red-600">*</span> Required field
                </p>
              </div>

              {/* Optional field */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  Phone Number <span className="text-gray-600 font-medium">(Optional)</span>
                </label>
                <input
                  type="tel"
                  className="onboarding-input"
                  placeholder="+1 (555) 000-0000"
                  style={{ color: '#111111' }}
                />
              </div>

              {/* Required with helper text */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  className="onboarding-input"
                  placeholder="you@example.com"
                  required
                  style={{ color: '#111111' }}
                />
                <p className="text-xs text-gray-700 mt-2">
                  We'll never share your email address
                </p>
              </div>

              {/* Required select */}
              <div>
                <label className="text-sm font-bold text-gray-900 block mb-2">
                  Current Role <span className="text-red-600">*</span>
                </label>
                <select className="onboarding-select" required style={{ color: '#111111' }}>
                  <option disabled value="">Select your role</option>
                  <option>Product Manager</option>
                  <option>Designer</option>
                  <option>Engineer</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Guidelines */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3">Required Field Guidelines</h4>
              <div className="space-y-2 text-sm text-gray-900">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DO:</strong> Use red asterisk (<span className="text-red-600">*</span>) for required fields</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DO:</strong> Mark optional fields with "(Optional)" in gray</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DO:</strong> Place asterisk immediately after label text</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DON'T:</strong> Mark all fields as required (use sparingly)</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DON'T:</strong> Use "Required" text instead of asterisk</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tooltips */}
        <section id="tooltips" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Tooltips</h2>
          <p className="text-lg text-gray-800 mb-8">Contextual help hints for form fields and buttons</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="space-y-8">
              {/* Label with tooltip */}
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Label with Tooltip Icon</h3>
                <div>
                  <label className="text-sm font-bold text-gray-900 block mb-2 flex items-center gap-2">
                    Project Budget
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip('budget')}
                        onMouseLeave={() => setShowTooltip(null)}
                        onClick={() => setShowTooltip(showTooltip === 'budget' ? null : 'budget')}
                        className="text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      {showTooltip === 'budget' && (
                        <div className="absolute left-6 top-0 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                          <div className="absolute -left-1 top-1.5 w-2 h-2 bg-gray-900 rotate-45" />
                          Enter your total project budget in USD. This helps us provide accurate recommendations.
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="text"
                    className="onboarding-input"
                    placeholder="$50,000"
                    style={{ color: '#111111' }}
                  />
                </div>
              </div>

              {/* Inline tooltip */}
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Inline Tooltip</h3>
                <div>
                  <label className="text-sm font-bold text-gray-900 block mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    className="onboarding-input"
                    placeholder="sk_live_..."
                    style={{ color: '#111111' }}
                  />
                  <div className="mt-2 flex items-start gap-2 text-sm">
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip('apikey')}
                        onMouseLeave={() => setShowTooltip(null)}
                        onClick={() => setShowTooltip(showTooltip === 'apikey' ? null : 'apikey')}
                        className="text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      {showTooltip === 'apikey' && (
                        <div className="absolute left-6 top-0 z-10 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                          <div className="absolute -left-1 top-1.5 w-2 h-2 bg-gray-900 rotate-45" />
                          <strong className="block mb-1">Where to find your API key:</strong>
                          Go to Settings → API Keys → Generate new key. Keep this secure!
                        </div>
                      )}
                    </div>
                    <span className="text-gray-700">Where do I find this?</span>
                  </div>
                </div>
              </div>

              {/* Tooltip on icon button */}
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Icon Button with Tooltip</h3>
                <div className="flex gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip('refresh')}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-900" />
                    </button>
                    {showTooltip === 'refresh' && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap">
                        <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                        Upload new file
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip('info')}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      <Info className="w-5 h-5 text-gray-900" />
                    </button>
                    {showTooltip === 'info' && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap">
                        <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                        View documentation
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tooltip variants */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tooltip Variants</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Top tooltip */}
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <div className="text-sm font-bold text-gray-900 mb-3">Top (Default)</div>
                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip('top')}
                        onMouseLeave={() => setShowTooltip(null)}
                        className="btn-secondary"
                        style={{ color: '#111111' }}
                      >
                        Hover me
                      </button>
                      {showTooltip === 'top' && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap">
                          <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                          Tooltip appears above
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right tooltip */}
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <div className="text-sm font-bold text-gray-900 mb-3">Right</div>
                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip('right')}
                        onMouseLeave={() => setShowTooltip(null)}
                        className="btn-secondary"
                        style={{ color: '#111111' }}
                      >
                        Hover me
                      </button>
                      {showTooltip === 'right' && (
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-10 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap">
                          <div className="absolute right-full mr-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                          Tooltip on right
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom tooltip */}
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <div className="text-sm font-bold text-gray-900 mb-3">Bottom</div>
                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip('bottom')}
                        onMouseLeave={() => setShowTooltip(null)}
                        className="btn-secondary"
                        style={{ color: '#111111' }}
                      >
                        Hover me
                      </button>
                      {showTooltip === 'bottom' && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap">
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full -mb-1 w-2 h-2 bg-gray-900 rotate-45" />
                          Tooltip below
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3">Tooltip Best Practices</h4>
              <div className="space-y-2 text-sm text-gray-900">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DO:</strong> Keep tooltip text short (under 2 lines)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DO:</strong> Show tooltips on hover for desktop, tap for mobile</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DO:</strong> Use tooltips for optional context, not critical info</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DO:</strong> Position tooltips to avoid covering content</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DON'T:</strong> Put essential instructions in tooltips</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DON'T:</strong> Use tooltips on disabled elements</span>
                </div>
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

        {/* Alert Messages */}
        <section id="alerts" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Alert Messages</h2>
          <p className="text-lg text-gray-800 mb-8">Contextual feedback messages for different states</p>
          
          <div className="space-y-6 max-w-3xl">
            {/* Info Alert */}
            <div className="flex items-start gap-4 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
              <AlertCircle className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Information</h4>
                <p className="text-gray-900 font-medium">
                  Your portfolio has been saved as a draft. You can continue editing anytime.
                </p>
              </div>
            </div>

            {/* Success Alert */}
            <div className="flex items-start gap-4 p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Success</h4>
                <p className="text-gray-900 font-medium">
                  Your portfolio has been published successfully! View it at yourdomain.com
                </p>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="flex items-start gap-4 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Warning</h4>
                <p className="text-gray-900 font-medium">
                  Your subscription expires in 3 days. Please update your payment method.
                </p>
              </div>
            </div>

            {/* Error Alert */}
            <div className="flex items-start gap-4 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
              <XCircle className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Error</h4>
                <p className="text-gray-900 font-medium">
                  Failed to upload your resume. Please try again or contact support.
                </p>
              </div>
            </div>

            {/* Compact Variants */}
            <div className="pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Compact Variants</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-full">
                  <Info className="w-4 h-4 text-blue-700" />
                  <span className="text-sm font-medium text-gray-900">Draft auto-saved</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-full">
                  <Check className="w-4 h-4 text-green-700" />
                  <span className="text-sm font-medium text-gray-900">Changes published</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-yellow-700" />
                  <span className="text-sm font-medium text-gray-900">Expiring soon</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-full">
                  <XCircle className="w-4 h-4 text-red-700" />
                  <span className="text-sm font-medium text-gray-900">Upload failed</span>
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
                  style={!activeChips.includes(chip.id) ? { color: '#111111' } : undefined}
                >
                  {activeChips.includes(chip.id) && chip.icon}
                  {chip.label}
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-800">
                <strong>Default state:</strong> Gray-900 (#111111) • 
                <strong className="ml-2">Active state:</strong> White on Bright Green (#5BC64A)
              </p>
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

        {/* Links */}
        <section id="links" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Links & Navigation</h2>
          <p className="text-lg text-gray-800 mb-8">Link styles with emerald hover states</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="space-y-8">
              {/* Standard Links */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Standard Links</h3>
                <div className="space-y-4">
                  <div>
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium underline decoration-2 underline-offset-4 transition-colors">
                      Standard underlined link
                    </a>
                  </div>
                  <div>
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                      Link without underline
                    </a>
                  </div>
                  <div>
                    <a href="#" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                      Dark link with emerald hover
                    </a>
                  </div>
                </div>
              </div>

              {/* Links with Icons */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Links with Icons</h3>
                <div className="space-y-4">
                  <div>
                    <a href="#" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors group">
                      <span>View portfolio</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                  <div>
                    <a href="#" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors group">
                      <span>Continue to next step</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                  <div>
                    <a href="#" className="inline-flex items-center gap-2 text-gray-900 hover:text-emerald-600 font-medium transition-colors group">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span>Go back</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Button-style Links */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Button-style Links</h3>
                <div className="flex flex-wrap gap-4">
                  <Link href="#" className="btn-primary">
                    Get Started
                  </Link>
                  <Link href="#" className="btn-secondary" style={{ color: '#111111' }}>
                    Learn More
                  </Link>
                  <Link 
                    href="#" 
                    className="px-4 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl font-semibold transition-colors"
                  >
                    View Examples
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section id="icons" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Icon Sizes</h2>
          <p className="text-lg text-gray-800 mb-8">Consistent icon sizing with Lucide React</p>
          
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <div className="space-y-8">
              {[
                { size: 'XS (16px)', class: 'w-4 h-4', use: 'Inline with small text, badges' },
                { size: 'SM (20px)', class: 'w-5 h-5', use: 'Buttons, form labels, chips' },
                { size: 'MD (24px)', class: 'w-6 h-6', use: 'Default size, cards, alerts' },
                { size: 'LG (32px)', class: 'w-8 h-8', use: 'Feature icons, empty states' },
                { size: 'XL (48px)', class: 'w-12 h-12', use: 'Upload areas, hero sections' }
              ].map((icon, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <div className="w-32">
                    <div className="text-lg font-bold text-gray-900">{icon.size}</div>
                    <div className="text-xs text-gray-800 font-mono">{icon.class}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Sparkles className={`${icon.class} text-emerald-600`} />
                    <Check className={`${icon.class} text-green-600`} />
                    <Upload className={`${icon.class} text-blue-600`} />
                    <Mail className={`${icon.class} text-pink-600`} />
                  </div>
                  <div className="text-sm text-gray-800">{icon.use}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-900 mb-2">
                <strong>Library:</strong> <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">Lucide React</a>
              </p>
              <p className="text-sm text-gray-800">
                Import icons: <code className="bg-white px-2 py-0.5 rounded font-mono text-xs">import {'{ Check, Upload }'} from 'lucide-react'</code>
              </p>
            </div>
          </div>
        </section>

        {/* Icon Library */}
        <section id="icon-library" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Complete Icon Library</h2>
          <p className="text-lg text-gray-800 mb-8">200+ Lucide React icons organized by category - all available for use!</p>
          
          {/* Navigation & Direction */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Navigation & Direction (23)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: ArrowLeft, name: 'ArrowLeft' },
                { icon: ArrowRight, name: 'ArrowRight' },
                { icon: ArrowUpDown, name: 'ArrowUpDown' },
                { icon: ChevronLeft, name: 'ChevronLeft' },
                { icon: ChevronRight, name: 'ChevronRight' },
                { icon: ChevronDown, name: 'ChevronDown' },
                { icon: ChevronUp, name: 'ChevronUp' },
                { icon: ChevronsLeft, name: 'ChevronsLeft' },
                { icon: ChevronsRight, name: 'ChevronsRight' },
                { icon: ChevronsUp, name: 'ChevronsUp' },
                { icon: ChevronsDown, name: 'ChevronsDown' },
                { icon: Menu, name: 'Menu' },
                { icon: Command, name: 'Command' },
                { icon: MoreVertical, name: 'MoreVertical' },
                { icon: GripVertical, name: 'GripVertical' },
                { icon: ExternalLink, name: 'ExternalLink' },
                { icon: Move, name: 'Move' },
                { icon: MoveVertical, name: 'MoveVertical' },
                { icon: MoveHorizontal, name: 'MoveHorizontal' },
                { icon: Maximize2, name: 'Maximize2' },
                { icon: Minimize2, name: 'Minimize2' },
                { icon: CornerDownLeft, name: 'CornerDownLeft' },
                { icon: CornerDownRight, name: 'CornerDownRight' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-colors">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <span className="text-xs font-medium text-gray-700 text-center">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Files & Documents */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Files & Documents (17)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: File, name: 'File' },
                { icon: FileText, name: 'FileText' },
                { icon: FileEdit, name: 'FileEdit' },
                { icon: FileSpreadsheet, name: 'FileSpreadsheet' },
                { icon: FileImage, name: 'FileImage' },
                { icon: FileCode, name: 'FileCode' },
                { icon: FileJson, name: 'FileJson' },
                { icon: Files, name: 'Files' },
                { icon: Upload, name: 'Upload' },
                { icon: Download, name: 'Download' },
                { icon: Video, name: 'Video' },
                { icon: Film, name: 'Film' },
                { icon: ImageIcon, name: 'Image' },
                { icon: Folder, name: 'Folder' },
                { icon: FolderOpen, name: 'FolderOpen' },
                { icon: FolderPlus, name: 'FolderPlus' },
                { icon: Archive, name: 'Archive' },
                { icon: Paperclip, name: 'Paperclip' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-colors">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <span className="text-xs font-medium text-gray-700 text-center">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions & Controls */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-8 border-2 border-yellow-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Actions & Controls (25)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: Plus, name: 'Plus' },
                { icon: X, name: 'X' },
                { icon: Check, name: 'Check' },
                { icon: Eye, name: 'Eye' },
                { icon: EyeOff, name: 'EyeOff' },
                { icon: Pencil, name: 'Pencil' },
                { icon: Edit2, name: 'Edit2' },
                { icon: Edit3, name: 'Edit3' },
                { icon: Trash2, name: 'Trash2' },
                { icon: Copy, name: 'Copy' },
                { icon: RefreshCw, name: 'RefreshCw' },
                { icon: Save, name: 'Save' },
                { icon: Undo, name: 'Undo' },
                { icon: Redo, name: 'Redo' },
                { icon: RotateCw, name: 'RotateCw' },
                { icon: RotateCcw, name: 'RotateCcw' },
                { icon: Search, name: 'Search' },
                { icon: Filter, name: 'Filter' },
                { icon: SlidersHorizontal, name: 'SlidersHorizontal' },
                { icon: Share, name: 'Share' },
                { icon: Share2, name: 'Share2' },
                { icon: Send, name: 'Send' },
                { icon: PlayCircle, name: 'PlayCircle' },
                { icon: PauseCircle, name: 'PauseCircle' },
                { icon: StopCircle, name: 'StopCircle' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-colors">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <span className="text-xs font-medium text-gray-700 text-center">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status & Feedback */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 border-2 border-pink-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Status & Feedback (22)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: CheckCircle, name: 'CheckCircle' },
                { icon: CheckCircle2, name: 'CheckCircle2' },
                { icon: AlertCircle, name: 'AlertCircle' },
                { icon: AlertTriangle, name: 'AlertTriangle' },
                { icon: XCircle, name: 'XCircle' },
                { icon: Info, name: 'Info' },
                { icon: Loader2, name: 'Loader2' },
                { icon: Sparkles, name: 'Sparkles' },
                { icon: Clock, name: 'Clock' },
                { icon: HelpCircle, name: 'HelpCircle' },
                { icon: Ban, name: 'Ban' },
                { icon: Shield, name: 'Shield' },
                { icon: ShieldCheck, name: 'ShieldCheck' },
                { icon: ShieldAlert, name: 'ShieldAlert' },
                { icon: Lock, name: 'Lock' },
                { icon: Unlock, name: 'Unlock' },
                { icon: Bell, name: 'Bell' },
                { icon: BellOff, name: 'BellOff' },
                { icon: BellRing, name: 'BellRing' },
                { icon: Flag, name: 'Flag' },
                { icon: Bookmark, name: 'Bookmark' },
                { icon: Heart, name: 'Heart' },
                { icon: ThumbsUp, name: 'ThumbsUp' },
                { icon: ThumbsDown, name: 'ThumbsDown' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-colors">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <span className="text-xs font-medium text-gray-700 text-center">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social & Communication */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-8 border-2 border-purple-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Social & Communication (16)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: User, name: 'User' },
                { icon: Users, name: 'Users' },
                { icon: UserPlus, name: 'UserPlus' },
                { icon: UserMinus, name: 'UserMinus' },
                { icon: UserCheck, name: 'UserCheck' },
                { icon: Mail, name: 'Mail' },
                { icon: Phone, name: 'Phone' },
                { icon: MessageSquare, name: 'MessageSquare' },
                { icon: MessageCircle, name: 'MessageCircle' },
                { icon: SendIcon, name: 'Send' },
                { icon: AtSign, name: 'AtSign' },
                { icon: Hash, name: 'Hash' },
                { icon: Linkedin, name: 'Linkedin' },
                { icon: Github, name: 'Github' },
                { icon: Twitter, name: 'Twitter' },
                { icon: Instagram, name: 'Instagram' },
                { icon: Facebook, name: 'Facebook' },
                { icon: Youtube, name: 'Youtube' },
                { icon: Slack, name: 'Slack' },
                { icon: Globe, name: 'Globe' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-colors">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <span className="text-xs font-medium text-gray-700 text-center">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content & Features */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl p-8 border-2 border-cyan-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Content & Features (22)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: Star, name: 'Star' },
                { icon: Award, name: 'Award' },
                { icon: Briefcase, name: 'Briefcase' },
                { icon: Building2, name: 'Building2' },
                { icon: Package, name: 'Package' },
                { icon: LinkIcon, name: 'Link' },
                { icon: Calendar, name: 'Calendar' },
                { icon: TrendingUp, name: 'TrendingUp' },
                { icon: TrendingDown, name: 'TrendingDown' },
                { icon: Lightbulb, name: 'Lightbulb' },
                { icon: Zap, name: 'Zap' },
                { icon: Tag, name: 'Tag' },
                { icon: Tags, name: 'Tags' },
                { icon: ShoppingCart, name: 'ShoppingCart' },
                { icon: ShoppingBag, name: 'ShoppingBag' },
                { icon: CreditCard, name: 'CreditCard' },
                { icon: DollarSign, name: 'DollarSign' },
                { icon: Percent, name: 'Percent' },
                { icon: Target, name: 'Target' },
                { icon: Activity, name: 'Activity' },
                { icon: BarChart, name: 'BarChart' },
                { icon: BarChart2, name: 'BarChart2' },
                { icon: BarChart3, name: 'BarChart3' },
                { icon: PieChart, name: 'PieChart' },
                { icon: LineChart, name: 'LineChart' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-colors">
                    <Icon className="w-6 h-6 text-gray-700" />
                    <span className="text-xs font-medium text-gray-700 text-center">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Layout & Design + Template Specific */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Layout & Design (5)</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Monitor, name: 'Monitor' },
                  { icon: Smartphone, name: 'Smartphone' },
                  { icon: LayoutDashboard, name: 'LayoutDashboard' },
                  { icon: AlignLeft, name: 'AlignLeft' },
                  { icon: Palette, name: 'Palette' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-colors">
                      <Icon className="w-6 h-6 text-gray-700" />
                      <span className="text-xs font-medium text-gray-700 text-center">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 border-2 border-red-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Template Specific (6)</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Rocket, name: 'Rocket' },
                  { icon: Code, name: 'Code' },
                  { icon: Microscope, name: 'Microscope' },
                  { icon: Settings, name: 'Settings' },
                  { icon: LogOut, name: 'LogOut' },
                  { icon: Link2, name: 'Link2' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-colors">
                      <Icon className="w-6 h-6 text-gray-700" />
                      <span className="text-xs font-medium text-gray-700 text-center">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Loading States */}
        <section id="loading" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Loading States</h2>
          <p className="text-lg text-gray-800 mb-8">Spinners and progress indicators for async operations</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Spinners */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Spinners</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  <span className="text-gray-900 font-medium">Small spinner (20px)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                  <span className="text-gray-900 font-medium">Medium spinner (24px)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <span className="text-gray-900 font-medium">Large spinner (32px)</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <code className="text-xs text-gray-900 font-mono">
                  &lt;Loader2 className=&quot;w-6 h-6 animate-spin&quot; /&gt;
                </code>
              </div>
            </div>

            {/* Loading Buttons */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Loading Buttons</h3>
              <div className="space-y-4">
                <button className="btn-primary" disabled>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </button>
                <button className="btn-secondary" disabled style={{ color: '#111111' }}>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </button>
                <button className="btn-primary w-full" disabled>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading resume...
                </button>
              </div>
            </div>

            {/* Loading Card States */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 md:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Loading Card State</h3>
              <div className="onboarding-card animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
              <p className="text-sm text-gray-800 mt-4">
                Skeleton loader for content that's loading
              </p>
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
                  style={{ color: '#111111' }}
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
                  style={{ color: '#111111' }}
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
                <button className="btn-primary flex-1" style={{ color: '#111111' }}>
                  Continue
                </button>
                <button className="btn-secondary" style={{ color: '#111111' }}>
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

        {/* Editor UI Elements */}
        <section id="editor-ui" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Editor UI Elements</h2>
          <p className="text-lg text-gray-800 mb-8">Complete catalog of navbar, left panel, and content area patterns</p>
          
          {/* Navigation Bar Elements */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-8 border-2 border-gray-300 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Navigation Bar Elements</h3>
            
            {/* Save Status Indicators */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Save Status Indicators</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500">Saving...</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className="text-xs text-gray-500">Unsaved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-gray-500">Saved 2:30 PM</span>
                </div>
              </div>
            </div>

            {/* Status Pills */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Status Pills</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-700 font-medium">Saving</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span className="text-xs text-orange-700 font-medium">Unsaved</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-700 font-medium">Saved</span>
                </div>
              </div>
            </div>

            {/* Segmented Control */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Segmented Control (View Toggle)</h4>
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

            {/* Device Toggle */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Device Toggle</h4>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
                <button className="p-2 rounded bg-white text-gray-900 shadow-sm">
                  <Monitor className="w-4 h-4" />
                </button>
                <button className="p-2 rounded text-gray-600 hover:text-gray-900">
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Icon Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dividers */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Dividers</h4>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">Item 1</span>
                <div className="h-6 w-px bg-gray-300" />
                <span className="text-sm text-gray-700">Item 2</span>
                <div className="h-6 w-px bg-gray-300" />
                <span className="text-sm text-gray-700">Item 3</span>
              </div>
            </div>
          </div>

          {/* Left Panel Elements */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Left Panel Elements</h3>
            
            {/* Section Header */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Section Header with Count</h4>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Projects</h3>
                  <span className="text-xs text-gray-500">(3/10)</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Item Card with Drag Handle */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Item Card (with hover actions)</h4>
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
              <p className="text-xs text-gray-600 mt-2">Hover to see drag handle and actions</p>
            </div>

            {/* Add Button (Dashed) */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Add Button (Dashed Border)</h4>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all">
                <Plus className="w-5 h-5" />
                Add New Item
              </button>
            </div>
          </div>

          {/* Common Patterns */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Common UI Patterns</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Publish Status Badge */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-4">Publish Status</h4>
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

              {/* Count Badges */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-4">Count Badges</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Items</span>
                    <span className="text-xs text-gray-500">(3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Limited</span>
                    <span className="text-xs text-gray-500">(5/10)</span>
                  </div>
                </div>
              </div>

              {/* Color-Coded Focus Rings */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 md:col-span-2">
                <h4 className="text-base font-bold text-gray-900 mb-4">Color-Coded Focus Rings</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">General</p>
                    <input type="text" placeholder="Gray-900" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Career/FAQs</p>
                    <input type="text" placeholder="Blue-500" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">Projects/Services</p>
                    <input type="text" placeholder="Purple-500" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Editor UI Best Practices</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-3">✅ Navigation Bar</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Keep height 56px</li>
                  <li>• Show save status prominently</li>
                  <li>• Use dividers between groups</li>
                  <li>• Icon-only for secondary actions</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-3">✅ Left Panel</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Use compact inputs (text-sm)</li>
                  <li>• Show counts for clarity</li>
                  <li>• Reveal actions on hover</li>
                  <li>• Collapsible sections</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-3">✅ Content Area</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Borderless inline editing</li>
                  <li>• Clear visual hierarchy</li>
                  <li>• Transparent backgrounds</li>
                  <li>• Generous click targets</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Current vs Recommended */}
        <section id="current-vs-recommended" className="onboarding-section mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Current vs Recommended</h2>
          <p className="text-lg text-gray-800 mb-8">Side-by-side comparison of existing UI inconsistencies and recommended fixes</p>
          
          {/* Alert Banner */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-bold text-red-900 mb-2">Inconsistencies Detected</h4>
                <p className="text-sm text-gray-800 mb-3">
                  The editor uses different button colors, borders, and focus rings than the onboarding flow, creating a disjointed brand experience.
                </p>
                <Link 
                  href="/ui-comparison"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:text-red-800 underline"
                >
                  View Full Comparison Page
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Comparison: Primary Buttons */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <X className="w-5 h-5 text-red-600" />
                <h4 className="text-xl font-bold text-gray-900">Current (Editor)</h4>
              </div>
              
              <div className="space-y-3 mb-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold w-full">
                  Add Item (Blue)
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold w-full">
                  Publish (Green)
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold w-full">
                  Generate (Purple)
                </button>
              </div>

              <div className="bg-white rounded-xl p-4 border border-red-300 text-xs text-gray-700">
                <strong className="text-red-900">Issues:</strong> Brand color missing, random colors, no borders
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Check className="w-5 h-5 text-green-600" />
                <h4 className="text-xl font-bold text-gray-900">Recommended</h4>
              </div>
              
              <div className="space-y-3 mb-4">
                <button className="btn-primary w-full">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
                <button className="btn-primary w-full">
                  <Upload className="w-4 h-4" />
                  Publish Portfolio
                </button>
                <button className="btn-primary w-full">
                  <Sparkles className="w-4 h-4" />
                  Generate With AI
                </button>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-600 text-xs text-gray-700">
                <strong className="text-green-900">Benefits:</strong> Consistent brand (#5BC64A), distinctive style, strong identity
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-red-600">13</div>
              <div className="text-xs font-semibold text-gray-900">Critical Issues</div>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-orange-600">8</div>
              <div className="text-xs font-semibold text-gray-900">Major Issues</div>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-yellow-600">6</div>
              <div className="text-xs font-semibold text-gray-900">Minor Issues</div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-green-600">2-6h</div>
              <div className="text-xs font-semibold text-gray-900">Fix Time</div>
            </div>
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
            <span className="text-gray-300">•</span>
            <Link href="/ui-comparison" className="text-emerald-600 hover:text-emerald-700 font-semibold">
              UI Comparison
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

