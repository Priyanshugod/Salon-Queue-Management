import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Sparkles, Clock, Volume2, ShieldCheck } from 'lucide-react';
import { playSalonChime } from '../../utils/audioChime';

export const TvDisplayPage: React.FC = () => {
  const { t } = useLanguage();
  const { barbers, tokens } = useQueueStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock updates every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const waitingTokens = tokens
    .filter(t => t.status === 'WAITING')
    .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF7F2] text-[#1F1F1F] p-6 lg:p-8 flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between border-b-2 border-[#E8E0D8] pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#E07A5F] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-soft">
            C
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-wide text-[#1F1F1F]">
              {t.tvTitle}
            </h1>
            <span className="font-sans text-xs uppercase tracking-[0.28em] font-semibold text-[#E07A5F]">
              {t.tvSubtitle}
            </span>
          </div>
        </div>

        {/* Live Clock & Sound Indicator */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => playSalonChime()}
            title="Click once to enable browser audio autoplay"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0D8] text-xs font-sans text-[#5A5550] hover:text-[#E07A5F]"
          >
            <Volume2 className="w-4 h-4 text-[#E07A5F]" />
            <span>Audio Chime Active</span>
          </button>

          <div className="text-right">
            <span className="font-serif text-3xl font-bold tracking-wider text-[#1F1F1F] block">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="font-sans text-xs uppercase tracking-wider text-[#8C847E]">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      {/* Main TV Stage (Split 60% Left / 40% Right) */}
      <main className="flex-1 grid grid-cols-12 gap-8 my-6 overflow-hidden">
        {/* Left Side: Now Serving Stations Grid (Col 7) */}
        <section className="col-span-7 flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#E07A5F] animate-ping" />
            <h2 className="font-serif text-2xl font-normal text-[#1F1F1F] tracking-wide">
              {t.nowServingHeader}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5 flex-1">
            {barbers.map((barber) => {
              const activeToken = tokens.find(t => t.id === barber.currentChairToken);
              const isCalled = activeToken?.status === 'CALLED';

              return (
                <div
                  key={barber.id}
                  className={`rounded-3xl p-6 border-2 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    isCalled
                      ? 'bg-white border-[#E07A5F] shadow-soft-glow animate-pulse-glow'
                      : activeToken
                      ? 'bg-white border-[#E8E0D8] shadow-soft'
                      : 'bg-[#F7EFEB]/50 border-dashed border-[#E8E0D8]'
                  }`}
                >
                  {/* Station Number Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs uppercase tracking-[0.22em] font-bold text-[#E07A5F]">
                      {barber.station}
                    </span>
                    <span className="font-sans text-xs text-[#5A5550] font-medium">
                      {barber.name}
                    </span>
                  </div>

                  {/* Active Token Callout */}
                  <div className="my-auto text-center py-4">
                    {activeToken ? (
                      <div>
                        <span className="font-serif text-6xl font-bold tracking-wider text-[#1F1F1F] block">
                          {activeToken.token}
                        </span>
                        <span className="font-sans text-xs text-[#5A5550] block mt-1">
                          {activeToken.customerName}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[#8C847E]">
                        <span className="font-serif text-2xl italic block">
                          {barber.status === 'ON_BREAK' ? 'On Break' : 'Ready'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer status pill */}
                  <div className="pt-2 border-t border-[#E8E0D8]/60 flex items-center justify-between text-xs font-sans">
                    <span className="text-[#8C847E] uppercase text-[10px] tracking-wider">
                      Status
                    </span>
                    <span
                      className={`font-semibold uppercase tracking-wider text-[11px] ${
                        isCalled
                          ? 'text-[#E07A5F] animate-bounce'
                          : activeToken
                          ? 'text-[#3D7C57]'
                          : 'text-[#8C847E]'
                      }`}
                    >
                      {activeToken ? activeToken.status : barber.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: Upcoming in Line (Col 5) */}
        <section className="col-span-5 flex flex-col justify-between bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E8E0D8] pb-3 mb-3">
            <h2 className="font-serif text-2xl font-normal text-[#1F1F1F] tracking-wide">
              {t.upcomingHeader}
            </h2>
            <span className="font-sans text-xs text-[#E07A5F] font-semibold bg-[#FDF0EC] px-3 py-1 rounded-full">
              {waitingTokens.length} waiting
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {waitingTokens.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#8C847E] italic text-sm">
                No guests currently in queue.
              </div>
            ) : (
              waitingTokens.slice(0, 7).map((tok, index) => {
                const reqBarber = barbers.find(b => b.id === tok.barberPreference);

                return (
                  <div
                    key={tok.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D8] flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-serif font-bold text-lg text-[#8C847E]">
                        #{index + 1}
                      </span>
                      <div>
                        <span className="font-serif text-2xl font-bold text-[#1F1F1F] tracking-wide block">
                          {tok.token}
                        </span>
                        <span className="font-sans text-xs text-[#5A5550]">
                          {tok.customerName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-sans text-xs font-semibold text-[#E07A5F] block">
                        {reqBarber ? reqBarber.name : 'Any Stylist'}
                      </span>
                      <span className="font-sans text-[11px] text-[#8C847E]">
                        ~{tok.estimatedDuration} mins
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Bottom Luxury Ticker */}
      <footer className="border-t-2 border-[#E8E0D8] pt-3 flex items-center space-x-3 text-xs font-sans text-[#5A5550] overflow-hidden whitespace-nowrap">
        <Sparkles className="w-4 h-4 text-[#E07A5F] shrink-0" />
        <span className="tracking-wider uppercase text-[#E07A5F] font-semibold shrink-0">
          CHÉRIE GUEST NOTICE:
        </span>
        <div className="font-medium tracking-wide animate-pulse">
          {t.tvTickerMessage}
        </div>
      </footer>
    </div>
  );
};
