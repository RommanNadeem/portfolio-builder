'use client';

/**
 * Interactive Quiz Component
 * 
 * Engaging multi-step quiz for users who skip resume upload
 * Collects information through fun, interactive questions
 * Uses AI to generate portfolio data at the end
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Briefcase, 
  Target,
  TrendingUp,
  Users,
  Zap,
  Award,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface QuizData {
  // Question 1: Role
  role: string;
  
  // Question 2: Experience Level
  experienceLevel: string;
  yearsOfExperience: string;
  
  // Question 3: Industry/Domain
  industries: string[];
  
  // Question 4: Skills
  topSkills: string[];
  
  // Question 5: Work Style
  workStyle: string[];
  
  // Question 6: Recent Projects
  recentProject: {
    type: string;
    description: string;
    impact: string;
  };
  
  // Question 7: Achievements
  topAchievements: string[];
  
  // Question 8: Goals
  careerGoals: string;
  targetAudience: string;
}

interface InteractiveQuizProps {
  userName: string;
  onComplete: (data: QuizData) => Promise<void>;
  onBack: () => void;
}

const ROLES = [
  { value: 'Product Manager', icon: Target, color: 'purple' },
  { value: 'Product Designer', icon: Sparkles, color: 'blue' },
  { value: 'Software Engineer', icon: Zap, color: 'green' },
  { value: 'Data Scientist', icon: TrendingUp, color: 'orange' },
  { value: 'Marketing Manager', icon: Users, color: 'pink' },
  { value: 'Other', icon: Briefcase, color: 'gray' },
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Just Starting Out', years: '0-2 years', emoji: '🌱' },
  { value: 'mid', label: 'Growing & Learning', years: '2-5 years', emoji: '🌿' },
  { value: 'senior', label: 'Experienced Pro', years: '5-10 years', emoji: '🌳' },
  { value: 'expert', label: 'Industry Expert', years: '10+ years', emoji: '🏆' },
];

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
  'Media', 'Gaming', 'SaaS', 'Enterprise', 'Consumer Products',
  'Non-profit', 'Government', 'Consulting', 'Startup', 'Other'
];

const COMMON_SKILLS = {
  'Product Manager': ['Product Strategy', 'User Research', 'Roadmap Planning', 'Data Analysis', 'Stakeholder Management', 'Agile/Scrum', 'A/B Testing', 'Customer Discovery'],
  'Product Designer': ['UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'User Testing', 'Figma', 'Adobe XD', 'Interaction Design'],
  'Software Engineer': ['JavaScript/TypeScript', 'React', 'Node.js', 'Python', 'System Design', 'API Development', 'Cloud Services', 'Testing'],
  'Data Scientist': ['Machine Learning', 'Python', 'SQL', 'Data Visualization', 'Statistics', 'TensorFlow', 'A/B Testing', 'Big Data'],
  'Marketing Manager': ['Digital Marketing', 'Content Strategy', 'SEO/SEM', 'Social Media', 'Analytics', 'Campaign Management', 'Branding', 'Growth Marketing'],
  'Other': ['Leadership', 'Communication', 'Problem Solving', 'Project Management', 'Strategy', 'Collaboration', 'Innovation', 'Analysis']
};

const WORK_STYLES = [
  { value: 'data-driven', label: 'Data-Driven', description: 'Love metrics and analytics', emoji: '📊' },
  { value: 'creative', label: 'Creative Thinker', description: 'Ideas and innovation', emoji: '💡' },
  { value: 'collaborative', label: 'Team Player', description: 'Thrive in collaboration', emoji: '🤝' },
  { value: 'strategic', label: 'Strategic', description: 'Big picture planning', emoji: '🎯' },
  { value: 'hands-on', label: 'Hands-On', description: 'Love building things', emoji: '🛠️' },
  { value: 'user-focused', label: 'User-Focused', description: 'Customer obsessed', emoji: '❤️' },
];

const PROJECT_TYPES = [
  { value: 'new_product', label: 'New Product Launch', icon: Sparkles },
  { value: 'redesign', label: 'Product Redesign', icon: Target },
  { value: 'feature', label: 'Major Feature', icon: Zap },
  { value: 'growth', label: 'Growth Initiative', icon: TrendingUp },
  { value: 'optimization', label: 'Optimization Project', icon: Award },
  { value: 'other', label: 'Other Project', icon: Briefcase },
];

export function InteractiveQuiz({ userName, onComplete, onBack }: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customRole, setCustomRole] = useState('');
  
  const [quizData, setQuizData] = useState<QuizData>({
    role: '',
    experienceLevel: '',
    yearsOfExperience: '',
    industries: [],
    topSkills: [],
    workStyle: [],
    recentProject: {
      type: '',
      description: '',
      impact: '',
    },
    topAchievements: ['', '', ''],
    careerGoals: '',
    targetAudience: '',
  });

  const totalQuestions = 8;
  const progress = (currentQuestion / totalQuestions) * 100;

  const updateQuizData = (field: keyof QuizData, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(quizData);
    } catch (error) {
      console.error('Quiz submission error:', error);
      setIsSubmitting(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string, maxItems?: number) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      if (maxItems && array.length >= maxItems) {
        return [...array.slice(1), item];
      }
      return [...array, item];
    }
  };

  const canProceed = () => {
    switch (currentQuestion) {
      case 1:
        return quizData.role && (quizData.role !== 'Other' || customRole.trim());
      case 2:
        return quizData.experienceLevel && quizData.yearsOfExperience;
      case 3:
        return quizData.industries.length > 0;
      case 4:
        return quizData.topSkills.length >= 3;
      case 5:
        return quizData.workStyle.length > 0;
      case 6:
        return quizData.recentProject.type && quizData.recentProject.description.trim();
      case 7:
        return quizData.topAchievements.some(a => a.trim());
      case 8:
        return quizData.careerGoals.trim() && quizData.targetAudience.trim();
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">
              Question {currentQuestion} of {totalQuestions}
            </p>
            <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <AnimatePresence mode="wait">
            {/* Question 1: Role */}
            {currentQuestion === 1 && (
              <motion.div
                key="q1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Hi {userName}! 👋
                  </h2>
                  <p className="text-lg text-gray-600">
                    What's your primary role?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    const isSelected = quizData.role === role.value;
                    
                    return (
                      <motion.button
                        key={role.value}
                        onClick={() => updateQuizData('role', role.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          p-6 rounded-xl border-2 transition-all text-left
                          ${isSelected 
                            ? 'border-purple-500 bg-purple-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                      >
                        <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                        <p className="font-semibold text-gray-900">{role.value}</p>
                      </motion.button>
                    );
                  })}
                </div>

                {quizData.role === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4"
                  >
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="What's your role?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      autoFocus
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Question 2: Experience Level */}
            {currentQuestion === 2 && (
              <motion.div
                key="q2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    What's your experience level? 🚀
                  </h2>
                  <p className="text-lg text-gray-600">
                    Help us understand your journey
                  </p>
                </div>

                <div className="space-y-4">
                  {EXPERIENCE_LEVELS.map((level) => {
                    const isSelected = quizData.experienceLevel === level.value;
                    
                    return (
                      <motion.button
                        key={level.value}
                        onClick={() => {
                          updateQuizData('experienceLevel', level.value);
                          updateQuizData('yearsOfExperience', level.years);
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`
                          w-full p-5 rounded-xl border-2 transition-all flex items-center gap-4
                          ${isSelected 
                            ? 'border-purple-500 bg-purple-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                      >
                        <span className="text-4xl">{level.emoji}</span>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900 text-lg">{level.label}</p>
                          <p className="text-sm text-gray-600">{level.years}</p>
                        </div>
                        {isSelected && <CheckCircle className="w-6 h-6 text-purple-600" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Question 3: Industries */}
            {currentQuestion === 3 && (
              <motion.div
                key="q3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Which industries do you work in? 🏢
                  </h2>
                  <p className="text-lg text-gray-600">
                    Select all that apply
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {INDUSTRIES.map((industry) => {
                    const isSelected = quizData.industries.includes(industry);
                    
                    return (
                      <motion.button
                        key={industry}
                        onClick={() => updateQuizData('industries', toggleArrayItem(quizData.industries, industry))}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
                          px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium
                          ${isSelected 
                            ? 'border-purple-500 bg-purple-500 text-white shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                          }
                        `}
                      >
                        {industry}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Question 4: Skills */}
            {currentQuestion === 4 && (
              <motion.div
                key="q4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    What are your top skills? ⚡
                  </h2>
                  <p className="text-lg text-gray-600">
                    Pick at least 3, up to 8
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {(COMMON_SKILLS[quizData.role as keyof typeof COMMON_SKILLS] || COMMON_SKILLS['Other']).map((skill) => {
                    const isSelected = quizData.topSkills.includes(skill);
                    
                    return (
                      <motion.button
                        key={skill}
                        onClick={() => updateQuizData('topSkills', toggleArrayItem(quizData.topSkills, skill, 8))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium
                          ${isSelected 
                            ? 'border-purple-500 bg-purple-500 text-white shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                          }
                        `}
                      >
                        {skill}
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-center text-sm text-gray-500">
                  {quizData.topSkills.length} selected {quizData.topSkills.length >= 3 ? '✓' : '(minimum 3)'}
                </p>
              </motion.div>
            )}

            {/* Question 5: Work Style */}
            {currentQuestion === 5 && (
              <motion.div
                key="q5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    How would you describe your work style? 🎨
                  </h2>
                  <p className="text-lg text-gray-600">
                    Choose what resonates with you
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {WORK_STYLES.map((style) => {
                    const isSelected = quizData.workStyle.includes(style.value);
                    
                    return (
                      <motion.button
                        key={style.value}
                        onClick={() => updateQuizData('workStyle', toggleArrayItem(quizData.workStyle, style.value, 3))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          p-5 rounded-xl border-2 transition-all text-left
                          ${isSelected 
                            ? 'border-purple-500 bg-purple-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                      >
                        <span className="text-3xl mb-2 block">{style.emoji}</span>
                        <p className="font-semibold text-gray-900">{style.label}</p>
                        <p className="text-sm text-gray-600">{style.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Question 6: Recent Project */}
            {currentQuestion === 6 && (
              <motion.div
                key="q6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Tell us about a recent project 💼
                  </h2>
                  <p className="text-lg text-gray-600">
                    This helps us create your first case study
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Project Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {PROJECT_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = quizData.recentProject.type === type.value;
                        
                        return (
                          <button
                            key={type.value}
                            onClick={() => updateQuizData('recentProject', { ...quizData.recentProject, type: type.value })}
                            className={`
                              p-4 rounded-lg border-2 transition-all flex items-center gap-3
                              ${isSelected 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-gray-300'
                              }
                            `}
                          >
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                            <span className="text-sm font-medium text-gray-900">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brief Description
                    </label>
                    <textarea
                      value={quizData.recentProject.description}
                      onChange={(e) => updateQuizData('recentProject', { ...quizData.recentProject, description: e.target.value })}
                      placeholder="What was the project about? What problem did you solve?"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impact & Results (Optional)
                    </label>
                    <input
                      type="text"
                      value={quizData.recentProject.impact}
                      onChange={(e) => updateQuizData('recentProject', { ...quizData.recentProject, impact: e.target.value })}
                      placeholder="e.g., Increased conversions by 40%, saved 200 hours/month"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Question 7: Achievements */}
            {currentQuestion === 7 && (
              <motion.div
                key="q7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    What are you most proud of? 🏆
                  </h2>
                  <p className="text-lg text-gray-600">
                    Share your top achievements
                  </p>
                </div>

                <div className="space-y-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Achievement {index + 1} {index === 0 && <span className="text-purple-600">*</span>}
                      </label>
                      <input
                        type="text"
                        value={quizData.topAchievements[index]}
                        onChange={(e) => {
                          const newAchievements = [...quizData.topAchievements];
                          newAchievements[index] = e.target.value;
                          updateQuizData('topAchievements', newAchievements);
                        }}
                        placeholder={`e.g., ${
                          index === 0 ? 'Led team that increased revenue by 150%' :
                          index === 1 ? 'Designed feature used by 1M+ users' :
                          'Reduced load time from 5s to 800ms'
                        }`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Question 8: Goals */}
            {currentQuestion === 8 && (
              <motion.div
                key="q8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Last question! 🎯
                  </h2>
                  <p className="text-lg text-gray-600">
                    Help us tailor your portfolio
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are your career goals?
                    </label>
                    <textarea
                      value={quizData.careerGoals}
                      onChange={(e) => updateQuizData('careerGoals', e.target.value)}
                      placeholder="What do you want to achieve next? What opportunities are you looking for?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Who is your target audience?
                    </label>
                    <input
                      type="text"
                      value={quizData.targetAudience}
                      onChange={(e) => updateQuizData('targetAudience', e.target.value)}
                      placeholder="e.g., Hiring managers at tech companies, Potential clients, Recruiters"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <p className="font-semibold text-gray-900">AI Magic Time!</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    We'll use AI to transform your answers into a beautiful, professional portfolio with personalized content and compelling stories.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-gray-700 hover:bg-white rounded-lg transition-all flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {currentQuestion < totalQuestions ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium shadow-lg"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Portfolio
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

