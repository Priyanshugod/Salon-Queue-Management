import React, { useEffect } from 'react';
import { QueueToken } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, Scissors, CheckCircle, ArrowRight } from 'lucide-react';
import { playSalonChime } from '../../utils/audioChime';

interface TurnAlertModalProps {
  token: QueueToken;
  onClose: () => void;
}

export const TurnAlertModal: React.FC<TurnAlertModalProps> = ({ token, onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    // Play audio chime when alert appears
    playSalonChime();
    
    // Optional vibration on mobile phones
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch {
        // Ignore if restricted
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1F1F]/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF7F2] border-2 border-[#E07A5F] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden animate-scale-up">
        {/* Decorative corner flourishes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#E07A5F]/10 rounded-full blur-2xl -translate-x-12 -translate-y-12" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#E57B62]/10 rounded-full blur-2xl translate-x-12 translate-y-12" />

        <div className="relative z-10 space-y-6">
          {/* Animated Callout Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E07A5F] text-white shadow-soft-glow mx-auto animate-bounce">
            <Scissors className="w-10 h-10" />
          </div>

          <div>
            <span className="font-sans text-xs uppercase tracking-[0.25em] font-bold text-[#E07A5F] block mb-2">
              {t.itsYourTurnTitle}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal text-[#1F1F1F] tracking-tight">
              {token.station || 'Station 1'}
            </h2>
            <p className="font-sans text-sm text-[#5A5550] mt-2">
              {t.itsYourTurnDesc}
            </p>
          </div>

          {/* Token Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8E0D8] shadow-sm">
            <span className="text-xs uppercase tracking-widest text-[#8C847E] font-medium block">
              {t.tokenLabel}
            </span>
            <span className="font-serif text-3xl font-bold text-[#1F1F1F] tracking-wider block my-1">
              {token.token}
            </span>
            <span className="inline-flex items-center text-xs text-[#3D7C57] font-medium bg-[#EAF3ED] px-3 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              {token.customerName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#1F1F1F] hover:bg-[#2C2B2A] text-white py-3.5 rounded-full font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>I'm Heading to Chair Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
