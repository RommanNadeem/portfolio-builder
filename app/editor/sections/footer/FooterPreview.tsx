'use client';

import { ArrowRight } from 'lucide-react';
import { FooterData } from './types';

interface FooterPreviewProps {
  data: FooterData;
  fullName: string;
  previewMode: 'desktop' | 'mobile';
}

export function FooterPreview({ data, fullName, previewMode }: FooterPreviewProps) {
  const isMobile = previewMode === 'mobile';

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className={`${isMobile ? 'px-4 py-8' : 'px-4 sm:px-6 lg:px-8 py-12 sm:py-16'}`}>
        <div className="max-w-6xl mx-auto">
          {/* CTA Section */}
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
            <h2 className={`font-bold mb-4 ${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>
              {data.footerText || "Let's build something meaningful."}
            </h2>
            <button className={`inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-6" />

          {/* Footer Bottom */}
          <div className={`flex ${isMobile ? 'flex-col items-center gap-3' : 'items-center justify-between'}`}>
            {/* Signature */}
            <p className={`text-gray-400 ${isMobile ? 'text-xs text-center' : 'text-sm'}`}>
              {data.footerSignature || `Built with 🤍 by ${fullName || 'You'}`}
            </p>

            {/* Links */}
            <div className={`flex items-center gap-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back to Top
              </button>
              <span className="text-gray-600">•</span>
              <p className="text-gray-400">
                © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

