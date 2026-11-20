import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Scissors, Clock, CheckCircle2, AlertCircle, Coffee, Play, Users } from 'lucide-react';

export const BarberStationPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    barbers,
    tokens,
    services,
    callNextCustomer,
    startService,
    completeService,
    toggleBarberStatus
  } = useQueueStore();

  // Find target barber by ID or name
  const barber = barbers.find(b => b.id === name || b.name.toLowerCase().includes(name?.toLowerCase() || ''));
  const currentToken = tokens.find(tok => tok.id === barber?.currentChairToken);

  // Live stopwatch timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (currentToken && currentToken.status === 'IN_CHAIR' && currentToken.serviceStartedAt) {
      const updateTimer = () => {
        const start = new Date(currentToken.serviceStartedAt!).getTime();
        const diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
        setElapsedSeconds(diff);
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentToken?.status, currentToken?.serviceStartedAt]);

  if (!barber) {
    return (
      <div className="max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Scissors className="w-16 h-16 text-[#E07A5F] mb-4" />
        <h2 className="font-serif text-2xl text-[#1F1F1F] mb-2">Station Not Found</h2>
        <p className="font-sans text-xs text-[#5A5550] mb-6">
          Please select an on-duty barber station from the list below.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {barbers.map(b => (
            <button
              key={b.id}
              onClick={() => navigate(`/barber/${b.id}`)}
              className="px-4 py-2 rounded-full border border-[#E8E0D8] bg-white text-xs font-sans font-medium hover:border-[#E07A5F]"
            >
              {b.name} ({b.station})
            </button>
          ))}
        </div>
      </div>
    );
  }

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCall = () => {
    callNextCustomer(barber.id);
  };

  // Peek next 3 upcoming guests for this barber or ANY
  const upcomingGuests = tokens
    .filter(t => t.status === 'WAITING' && (t.barberPreference === barber.id || t.barberPreference === 'ANY'))
    .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime())
    .slice(0, 3);

  const selectedServicesList = currentToken ? services.filter(s => currentToken.services.includes(s.id)) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Station Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={barber.photo}
            alt={barber.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#E07A5F]"
          />
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-[#E07A5F]">
              {barber.station}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1F1F1F]">
              {barber.name}
            </h1>
            <p className="font-sans text-xs text-[#8C847E]">
              {barber.specialty} • Completed today: <strong className="text-[#1F1F1F]">{barber.completedToday}</strong>
            </p>
          </div>
        </div>

        {/* Station Break Toggle */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => toggleBarberStatus(barber.id, barber.status === 'ON_BREAK' ? 'AVAILABLE' : 'ON_BREAK')}
            className={`px-4 py-2 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all flex items-center space-x-1.5 ${
              barber.status === 'ON_BREAK'
                ? 'bg-[#C59B3F] text-white shadow-xs'
                : 'bg-[#FAF7F2] border border-[#E8E0D8] text-[#5A5550] hover:text-[#1F1F1F]'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>{barber.status === 'ON_BREAK' ? t.onBreakBadge : t.takeBreak}</span>
          </button>
        </div>
      </div>

      {/* Main Workstation Chair Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D8] shadow-soft">
        {currentToken ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E0D8] pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8C847E] font-semibold block">
                  {t.currentClientTitle}
                </span>
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1F1F]">
                  {currentToken.token}
                </span>
              </div>
              <Badge status={currentToken.status} size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E0D8]">
                <span className="text-xs text-[#8C847E] uppercase tracking-wider block mb-1">
                  Customer
                </span>
                <h3 className="font-serif text-xl font-medium text-[#1F1F1F]">
                  {currentToken.customerName}
                </h3>
                <span className="text-xs text-[#5A5550]">
                  Phone: {currentToken.phone || 'Walk-In'}
                </span>
              </div>

              {/* Live Stopwatch Timer */}
              <div className="bg-[#F7EFEB] rounded-2xl p-4 border border-[#E8E0D8] text-center flex flex-col items-center justify-center">
                <span className="text-xs text-[#8C847E] uppercase tracking-wider block mb-1">
                  {t.elapsedTimerLabel}
                </span>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#E07A5F] tracking-wider">
                  {formatTimer(elapsedSeconds)}
                </span>
                <span className="text-[10px] text-[#8C847E] mt-0.5">
                  Est. Target: {currentToken.estimatedDuration} mins
                </span>
              </div>
            </div>

            {/* Selected Services Breakdown */}
            <div>
              <span className="text-xs font-sans text-[#8C847E] uppercase tracking-wider block mb-2">
                Requested Services:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedServicesList.map(srv => (
                  <span
                    key={srv.id}
                    className="px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E0D8] text-xs font-sans font-medium text-[#1F1F1F]"
                  >
                    {language === 'gu' && srv.nameGu ? srv.nameGu : srv.name} ({srv.durationMinutes}m)
                  </span>
                ))}
              </div>
            </div>

            {/* Workstation Actions */}
            <div className="pt-4 border-t border-[#E8E0D8] flex flex-col sm:flex-row gap-3">
              {currentToken.status === 'CALLED' && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => startService(currentToken.id)}
                  className="flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{t.startServiceBtn}</span>
                </Button>
              )}

              {currentToken.status === 'IN_CHAIR' && (
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => completeService(currentToken.id)}
                  className="flex items-center justify-center space-x-2 bg-[#3D7C57] hover:bg-[#2F6143]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.completeServiceBtn}</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Vacant Chair State */
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border-2 border-dashed border-[#E8E0D8] flex items-center justify-center mx-auto text-[#8C847E]">
              <Scissors className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-3xl text-[#1F1F1F]">
                {t.vacantChairTitle}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#5A5550] max-w-sm mx-auto mt-1">
                {t.vacantChairDesc}
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                disabled={barber.status === 'ON_BREAK'}
                onClick={handleCall}
              >
                {t.callNextBtn}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Guests Peek Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-2xs space-y-4">
        <h3 className="font-serif text-lg text-[#1F1F1F] flex items-center space-x-2">
          <Users className="w-4 h-4 text-[#E07A5F]" />
          <span>{t.nextInLinePeek}</span>
        </h3>

        {upcomingGuests.length === 0 ? (
          <p className="font-sans text-xs text-[#8C847E] italic py-2">
            {t.noUpcomingGuests}
          </p>
        ) : (
          <div className="divide-y divide-[#E8E0D8]/60">
            {upcomingGuests.map((g, i) => (
              <div key={g.id} className="py-3 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-[#8C847E]">#{i + 1}</span>
                  <div>
                    <span className="font-serif font-bold text-sm text-[#1F1F1F] block">
                      {g.token}
                    </span>
                    <span className="text-[#5A5550]">{g.customerName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[#E07A5F] font-medium block">
                    {g.services.length} services (~{g.estimatedDuration}m)
                  </span>
                  <span className="text-[10px] text-[#8C847E]">
                    {g.barberPreference === 'ANY' ? 'Any Stylist' : 'Preferred You'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
