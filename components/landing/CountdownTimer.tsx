'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Layout, Sparkles, CheckCircle } from 'lucide-react';

export default function CountdownTimer() {
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: FileText, label: 'Analyzing resume', time: 20 },
    { icon: Sparkles, label: 'Generating content', time: 45 },
    { icon: Layout, label: 'Building sections', time: 55 },
    { icon: CheckCircle, label: 'Portfolio ready!', time: 60 }
  ];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const elapsed = 60 - seconds;
    const newStep = steps.findIndex((step, idx) => {
      return elapsed < step.time && (idx === 0 || elapsed >= steps[idx - 1].time);
    });
    if (newStep !== -1 && newStep !== currentStep) {
      setCurrentStep(newStep);
    } else if (elapsed >= 60) {
      setCurrentStep(steps.length - 1);
    }
  }, [seconds, currentStep]);

  const handleStart = () => {
    setSeconds(60);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const progress = ((60 - seconds) / 60) * 100;

  return (
    <div className="relative">
      {/* Main countdown display */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-2 bg-gray-100 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-8">
          {/* Timer display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-baseline gap-1 mb-2">
              <motion.span
                key={seconds}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                {seconds}
              </motion.span>
              <span className="text-2xl font-medium text-gray-500">sec</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {seconds > 0 ? 'Time remaining' : 'Complete!'}
            </p>
          </div>

          {/* Current step indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-3 mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl"
            >
              {steps[currentStep] && (() => {
                const StepIcon = steps[currentStep].icon;
                return (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <StepIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      {steps[currentStep].label}
                    </span>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>

          {/* Portfolio assembly preview */}
          <div className="space-y-3 mb-6 min-h-[200px]">
            {isRunning && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: currentStep >= 0 ? 1 : 0, x: currentStep >= 0 ? 0 : -20 }}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: currentStep >= 1 ? 1 : 0, x: currentStep >= 1 ? 0 : -20 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="h-3 bg-gray-800 rounded w-2/3 mb-2" />
                  <div className="h-2 bg-gray-300 rounded w-full mb-1" />
                  <div className="h-2 bg-gray-300 rounded w-4/5" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: currentStep >= 2 ? 1 : 0, x: currentStep >= 2 ? 0 : -20 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-3 bg-gray-800 rounded w-1/3" />
                    <div className="text-2xl font-bold text-indigo-600">+37%</div>
                  </div>
                  <div className="h-2 bg-gray-300 rounded w-full mb-1" />
                  <div className="h-2 bg-gray-300 rounded w-3/4" />
                </motion.div>
              </>
            )}

            {!isRunning && seconds === 60 && (
              <div className="flex items-center justify-center h-[200px] text-gray-400">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click Start to see the magic</p>
                </div>
              </div>
            )}

            {!isRunning && seconds === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center h-[200px]"
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-1">Portfolio Ready!</p>
                  <p className="text-sm text-gray-500">Your story is live</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action button */}
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isRunning ? 'Building...' : seconds === 0 ? 'Start Again' : 'Start Demo'}
          </button>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute -top-4 -right-4 bg-gradient-to-br from-pink-400 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold"
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        Under 60s
      </motion.div>
    </div>
  );
}

