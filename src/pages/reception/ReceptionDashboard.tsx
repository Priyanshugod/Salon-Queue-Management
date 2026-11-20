import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { WalkInModal } from '../../components/reception/WalkInModal';
import { UserPlus, Search, ArrowUp, XCircle, Clock, Scissors, CheckCircle, AlertCircle } from 'lucide-react';

export const ReceptionDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    tokens,
    barbers,
    services,
    callNextCustomer,
    completeService,
    toggleBarberStatus,
    startGracePeriod,
    markNoShow,
    cancelToken,
    bumpPriority
  } = useQueueStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCallNext = (barberId: string) => {
    const res = callNextCustomer(barberId);
    if (!res.success) {
      showToast(res.error || "Cannot call next customer.");
    } else if (res.token) {
      showToast(`Token ${res.token.token} called to station!`);
    }
  };

  // Filter queue tokens
  const waitingTokens = tokens
    .filter(t => t.status === 'WAITING')
    .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());

  const filteredWaitingTokens = waitingTokens.filter(t => 
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#1F1F1F] text-white px-5 py-3 rounded-full text-xs font-sans shadow-lg animate-fade-in flex items-center space-x-2 border border-[#E07A5F]">
          <span className="w-2 h-2 rounded-full bg-[#E07A5F] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Command Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D8]">
        <div>
          <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#E07A5F] block">
            FRONT DESK DISPATCH
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1F1F]">
            {t.receptionTitle}
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-0.5">
            {t.receptionSubtitle}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowWalkInModal(true)}
            className="flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.registerWalkInBtn}</span>
          </Button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Barber Stations (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#1F1F1F]">
              {t.activeChairsHeader}
            </h2>
            <span className="text-xs font-sans text-[#8C847E]">
              {barbers.filter(b => b.status === 'BUSY').length} / {barbers.length} Chairs Occupied
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {barbers.map((barber) => {
              const activeToken = tokens.find(t => t.id === barber.currentChairToken);

              return (
                <div
                  key={barber.id}
                  className={`bg-white rounded-3xl p-5 border transition-all ${
                    barber.status === 'BUSY'
                      ? 'border-[#E07A5F]/70 shadow-soft'
                      : 'border-[#E8E0D8] shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={barber.photo}
                        alt={barber.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#E8E0D8]"
                      />
                      <div>
                        <h3 className="font-serif text-base font-semibold text-[#1F1F1F]">
                          {barber.name}
                        </h3>
                        <span className="font-sans text-xs text-[#E07A5F] font-medium block">
                          {barber.station}
                        </span>
                      </div>
                    </div>

                    <Badge status={barber.status} size="sm" />
                  </div>

                  {/* Active Client Details */}
                  {barber.status === 'BUSY' && activeToken ? (
                    <div className="mt-4 pt-3 border-t border-[#E8E0D8]/60 bg-[#FAF7F2] p-3 rounded-2xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif text-xl font-bold text-[#1F1F1F]">
                          {activeToken.token}
                        </span>
                        <span className="text-[11px] font-sans font-medium text-[#3D7C57] bg-[#EAF3ED] px-2.5 py-0.5 rounded-full">
                          {activeToken.status}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#5A5550]">
                        Guest: <span className="font-medium text-[#1F1F1F]">{activeToken.customerName}</span>
                      </p>
                      <p className="font-sans text-[11px] text-[#8C847E] mt-0.5">
                        Est. Duration: {activeToken.estimatedDuration} mins
                      </p>

                      <div className="mt-3 flex space-x-2">
                        <button
                          type="button"
                          onClick={() => completeService(activeToken.id)}
                          className="flex-1 py-1.5 rounded-full bg-[#1F1F1F] text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-[#333]"
                        >
                          {t.markDone}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 pt-3 border-t border-[#E8E0D8]/60 flex items-center justify-between">
                      <span className="font-sans text-xs text-[#8C847E] italic">
                        {barber.status === 'ON_BREAK' ? 'Stylist on break' : 'Chair vacant'}
                      </span>

                      <div className="flex space-x-2">
                        {barber.status === 'AVAILABLE' && (
                          <button
                            type="button"
                            onClick={() => handleCallNext(barber.id)}
                            className="px-4 py-1.5 rounded-full bg-[#E07A5F] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#D36B50]"
                          >
                            {t.callNextBtn}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleBarberStatus(barber.id, barber.status === 'ON_BREAK' ? 'AVAILABLE' : 'ON_BREAK')}
                          className="px-3 py-1.5 rounded-full border border-[#E8E0D8] text-[11px] text-[#5A5550] hover:text-[#1F1F1F]"
                        >
                          {barber.status === 'ON_BREAK' ? t.resumeDuty : t.takeBreak}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Waiting Queue Table (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-serif text-xl text-[#1F1F1F] flex items-center space-x-2">
              <span>{t.waitingQueueHeader}</span>
              <span className="text-xs font-sans px-2.5 py-0.5 bg-[#FAF7F2] border border-[#E8E0D8] rounded-full text-[#E07A5F] font-bold">
                {waitingTokens.length}
              </span>
            </h2>

            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#8C847E] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 rounded-full border border-[#E8E0D8] bg-white text-xs font-sans focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E0D8] shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#FAF7F2] border-b border-[#E8E0D8] text-[#8C847E] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Token & Client</th>
                    <th className="py-3 px-4">Stylist</th>
                    <th className="py-3 px-4">Services</th>
                    <th className="py-3 px-4">Wait</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0D8]/60">
                  {filteredWaitingTokens.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#8C847E] italic">
                        No clients waiting in line currently.
                      </td>
                    </tr>
                  ) : (
                    filteredWaitingTokens.map((tok, idx) => {
                      const reqBarber = barbers.find(b => b.id === tok.barberPreference);
                      const elapsedMins = Math.round((Date.now() - new Date(tok.joinedAt).getTime()) / 60000);

                      return (
                        <tr key={tok.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#8C847E]">
                            #{idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-serif font-bold text-sm text-[#1F1F1F] block">
                              {tok.token}
                            </span>
                            <span className="text-[#5A5550] block">
                              {tok.customerName}
                            </span>
                            {tok.phone && (
                              <span className="text-[10px] text-[#8C847E]">
                                {tok.phone.slice(0, 3)}****{tok.phone.slice(-3)}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#1F1F1F]">
                            {reqBarber ? reqBarber.name : 'Any Stylist'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E0D8] text-[10px] text-[#5A5550]">
                              {tok.services.length} services ({tok.estimatedDuration}m)
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#8C847E]">
                            {elapsedMins}m ago
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            {/* Bump button */}
                            {idx > 0 && (
                              <button
                                type="button"
                                title="Bump Priority Up"
                                onClick={() => bumpPriority(tok.id)}
                                className="p-1 rounded-full hover:bg-[#F7EFEB] text-[#E07A5F]"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {/* Cancel button */}
                            <button
                              type="button"
                              title="Cancel Token"
                              onClick={() => cancelToken(tok.id)}
                              className="p-1 rounded-full hover:bg-red-50 text-red-600"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Walk-In Modal */}
      {showWalkInModal && (
        <WalkInModal onClose={() => setShowWalkInModal(false)} />
      )}
    </div>
  );
};
