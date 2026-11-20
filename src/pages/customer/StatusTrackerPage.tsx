import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { calculateWaitTime } from '../../utils/waitTime';
import { Badge } from '../../components/common/Badge';
import { TurnAlertModal } from '../../components/customer/TurnAlertModal';
import { Clock, Scissors, AlertTriangle, ArrowLeft, CheckCircle2, User, Phone } from 'lucide-react';

export const StatusTrackerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { tokens, barbers, services, cancelToken } = useQueueStore();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTurnAlert, setShowTurnAlert] = useState(false);
  const [hasTriggeredAlert, setHasTriggeredAlert] = useState(false);

  // Find target token
  const token = tokens.find(tok => tok.id === id || tok.token === id);

  useEffect(() => {
    if (token && token.status === 'CALLED' && !hasTriggeredAlert) {
      setShowTurnAlert(true);
      setHasTriggeredAlert(true);
    }
  }, [token?.status, hasTriggeredAlert]);

  if (!token) {
    return (
      <div className="max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-[#E07A5F] mb-4" />
        <h2 className="font-serif text-2xl text-[#1F1F1F] mb-2">Token Not Found</h2>
        <p className="font-sans text-xs text-[#5A5550] mb-6">
          The requested queue token could not be located. It may have expired or been completed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-xs uppercase tracking-wider text-[#E07A5F] font-semibold hover:underline"
        >
          Return to Salon Home &rarr;
        </button>
      </div>
    );
  }

  // Calculate position among waiting tokens
  const waitingTokens = tokens
    .filter(t => t.status === 'WAITING')
    .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());
  
  const positionIndex = waitingTokens.findIndex(t => t.id === token.id);
  const rank = positionIndex !== -1 ? positionIndex + 1 : 0;

  // Calculate wait time
  const { estimatedMinutes, isPaused } = calculateWaitTime(token, tokens, barbers, services);

  // Look up assigned or preferred barber
  const assignedBarber = barbers.find(b => b.id === (token.assignedBarber || token.barberPreference));

  // Look up selected services
  const selectedServicesList = services.filter(s => token.services.includes(s.id));

  const handleConfirmLeave = () => {
    cancelToken(token.id);
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24 space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#8C847E] hover:text-[#1F1F1F]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Salon Overview</span>
      </button>

      {/* Approaching Alert Banner (Rank <= 2) */}
      {token.status === 'WAITING' && rank > 0 && rank <= 2 && (
        <div className="p-4 rounded-2xl bg-[#E07A5F] text-white shadow-soft-glow animate-pulse">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-base font-semibold">
                {t.approachingWarningTitle}
              </h4>
              <p className="font-sans text-xs opacity-90 mt-0.5">
                {t.approachingWarningDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Token Badge Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D8] shadow-soft text-center space-y-4">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C847E]">
          {t.tokenLabel}
        </span>

        {/* Giant Serif Token Display */}
        <div className="py-2">
          <span className="font-serif text-5xl sm:text-6xl font-bold tracking-wider text-[#1F1F1F] block">
            {token.token}
          </span>
        </div>

        <div className="flex justify-center">
          <Badge status={token.status} size="md" />
        </div>

        <p className="font-sans text-xs text-[#8C847E]">
          {t.joinedAtLabel} {new Date(token.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>

        {/* Progress Stepper */}
        <div className="pt-4 border-t border-[#E8E0D8]/60">
          <div className="flex items-center justify-between text-[11px] font-sans font-medium text-[#8C847E]">
            <span className={token.status === 'WAITING' ? 'text-[#E07A5F] font-bold' : ''}>
              1. Waiting
            </span>
            <span className="text-[#E8E0D8]">&rarr;</span>
            <span className={token.status === 'CALLED' ? 'text-[#E07A5F] font-bold' : ''}>
              2. Called
            </span>
            <span className="text-[#E8E0D8]">&rarr;</span>
            <span className={token.status === 'IN_CHAIR' ? 'text-[#E07A5F] font-bold' : ''}>
              3. In Chair
            </span>
            <span className="text-[#E8E0D8]">&rarr;</span>
            <span className={token.status === 'COMPLETED' ? 'text-[#3D7C57] font-bold' : ''}>
              4. Done
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Queue Metrics */}
      {token.status === 'WAITING' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Position in Line */}
          <div className="bg-[#F7EFEB] rounded-2xl p-5 border border-[#E8E0D8] text-center">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#8C847E] font-semibold block mb-1">
              {t.currentPosition}
            </span>
            <span className="font-serif text-3xl font-semibold text-[#1F1F1F]">
              #{rank}
            </span>
            <span className="font-sans text-xs text-[#5A5550] block mt-0.5">
              {t.inLineSuffix}
            </span>
          </div>

          {/* Countdown Clock */}
          <div className="bg-[#F7EFEB] rounded-2xl p-5 border border-[#E8E0D8] text-center">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#8C847E] font-semibold block mb-1">
              {t.approxWaitRemaining}
            </span>
            <span className="font-serif text-3xl font-semibold text-[#E07A5F]">
              {isPaused ? 'Paused' : `~${estimatedMinutes}`}
            </span>
            <span className="font-sans text-xs text-[#5A5550] block mt-0.5">
              {isPaused ? 'Staff on break' : t.mins}
            </span>
          </div>
        </div>
      )}

      {/* Station & Stylist Assignment Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E0D8] shadow-2xs space-y-3">
        <h3 className="font-serif text-lg text-[#1F1F1F]">
          Service Details
        </h3>

        <div className="space-y-2 text-xs font-sans text-[#5A5550]">
          <div className="flex justify-between py-1.5 border-b border-[#E8E0D8]/40">
            <span className="text-[#8C847E]">Customer:</span>
            <span className="font-medium text-[#1F1F1F]">{token.customerName}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-[#E8E0D8]/40">
            <span className="text-[#8C847E]">{t.assignedStylist}:</span>
            <span className="font-medium text-[#1F1F1F]">
              {assignedBarber ? assignedBarber.name : t.anyBarberOption}
            </span>
          </div>

          {token.station && (
            <div className="flex justify-between py-1.5 border-b border-[#E8E0D8]/40">
              <span className="text-[#8C847E]">{t.stationNumber}:</span>
              <span className="font-bold text-[#E07A5F]">{token.station}</span>
            </div>
          )}

          <div className="pt-2">
            <span className="text-[#8C847E] block mb-1.5">Selected Services:</span>
            <div className="space-y-1">
              {selectedServicesList.map((srv) => (
                <div key={srv.id} className="flex justify-between text-xs">
                  <span>{language === 'gu' && srv.nameGu ? srv.nameGu : srv.name}</span>
                  <span className="font-medium">₹{srv.priceINR}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completed State Celebration */}
      {token.status === 'COMPLETED' && (
        <div className="bg-[#EAF3ED] border border-[#C3DEC9] rounded-2xl p-6 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-[#3D7C57] mx-auto" />
          <h4 className="font-serif text-xl text-[#1F1F1F]">{t.serviceCompletedTitle}</h4>
          <p className="font-sans text-xs text-[#5A5550]">{t.serviceCompletedDesc}</p>
        </div>
      )}

      {/* Self-Service Leave Queue Button (Only when WAITING) */}
      {token.status === 'WAITING' && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="text-xs uppercase tracking-wider text-red-600 hover:text-red-700 font-sans font-semibold underline"
          >
            {t.leaveQueueButton}
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1F1F]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E8E0D8] shadow-xl text-center space-y-4">
            <h3 className="font-serif text-2xl text-[#1F1F1F]">{t.leaveConfirmTitle}</h3>
            <p className="font-sans text-xs text-[#5A5550] leading-relaxed">
              {t.leaveConfirmDesc}
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-full border border-[#E8E0D8] font-sans text-xs uppercase tracking-wider"
              >
                {t.stayInQueue}
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                className="flex-1 py-2.5 rounded-full bg-red-600 text-white font-sans text-xs uppercase tracking-wider font-semibold"
              >
                {t.confirmLeave}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Turn Alert Modal */}
      {showTurnAlert && token.status === 'CALLED' && (
        <TurnAlertModal token={token} onClose={() => setShowTurnAlert(false)} />
      )}
    </div>
  );
};
