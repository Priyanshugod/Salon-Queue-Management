import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { getGlobalWaitEstimate } from '../../utils/waitTime';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Clock, Users, Scissors, Sparkles, MapPin, Search } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { tokens, barbers, services } = useQueueStore();
  const [tokenSearchInput, setTokenSearchInput] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchError, setSearchError] = useState('');

  const { waitMinutes, countInLine, activeBarberCount } = getGlobalWaitEstimate(tokens, barbers, services);

  const handleTrackToken = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const code = tokenSearchInput.trim().toUpperCase();
    if (!code) return;

    const matched = tokens.find(t => t.token.toUpperCase() === code || t.id === code);
    if (matched) {
      navigate(`/status/${matched.id}`);
    } else {
      setSearchError("No active token found matching this code. Please verify.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#F7EFEB] border border-[#E8E0D8]">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] font-semibold text-[#E07A5F]">
              {t.heroKicker}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1F1F1F] tracking-tight leading-[1.15]">
            {t.heroTitle}
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#5A5550] max-w-xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Live Pulse Card */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D8] shadow-soft max-w-2xl mx-auto">
          <div className="grid grid-cols-3 divide-x divide-[#E8E0D8] text-center">
            {/* Metric 1 */}
            <div className="px-2">
              <div className="flex items-center justify-center space-x-1 text-[#E07A5F] mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-sans text-xs uppercase tracking-wider font-semibold">
                  {t.estWait}
                </span>
              </div>
              <span className="font-serif text-2xl sm:text-4xl font-semibold text-[#1F1F1F] block">
                ~{waitMinutes} <span className="text-sm font-sans font-normal text-[#5A5550]">{t.mins}</span>
              </span>
            </div>

            {/* Metric 2 */}
            <div className="px-2">
              <div className="flex items-center justify-center space-x-1 text-[#5A5550] mb-1">
                <Users className="w-4 h-4" />
                <span className="font-sans text-xs uppercase tracking-wider font-semibold">
                  Queue
                </span>
              </div>
              <span className="font-serif text-2xl sm:text-4xl font-semibold text-[#1F1F1F] block">
                {countInLine} <span className="text-sm font-sans font-normal text-[#5A5550]">{t.guestsInLine.split(' ')[0]}</span>
              </span>
            </div>

            {/* Metric 3 */}
            <div className="px-2">
              <div className="flex items-center justify-center space-x-1 text-[#3D7C57] mb-1">
                <Scissors className="w-4 h-4" />
                <span className="font-sans text-xs uppercase tracking-wider font-semibold">
                  Stylists
                </span>
              </div>
              <span className="font-serif text-2xl sm:text-4xl font-semibold text-[#1F1F1F] block">
                {activeBarberCount} <span className="text-sm font-sans font-normal text-[#5A5550]">on duty</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/join" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full">
                {t.heroJoinCta}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setShowSearchModal(true)}
            >
              {t.heroTrackCta}
            </Button>
          </div>
        </div>
      </section>

      {/* Stylist Roster Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#E8E0D8]/70">
        <div className="text-center mb-8">
          <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#E07A5F] block mb-1">
            EXCELLENCE IN CRAFT
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1F1F]">
            {t.activeStaffTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="bg-white rounded-2xl p-5 border border-[#E8E0D8] shadow-2xs hover:shadow-soft transition-all text-center flex flex-col items-center"
            >
              <div className="relative mb-4">
                <img
                  src={barber.photo}
                  alt={barber.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#E8E0D8]"
                />
                <div className="absolute -bottom-1 -right-1">
                  <Badge status={barber.status} size="sm" />
                </div>
              </div>

              <h3 className="font-serif text-lg font-medium text-[#1F1F1F]">
                {barber.name}
              </h3>
              <span className="font-sans text-xs text-[#E07A5F] font-medium tracking-wide block mt-0.5">
                {barber.station}
              </span>
              <p className="font-sans text-xs text-[#8C847E] mt-2 line-clamp-2">
                {barber.specialty}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Salon Details Footer Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-[#F7EFEB] border border-[#E8E0D8] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-3 text-left">
            <Clock className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-lg font-medium text-[#1F1F1F]">
                {t.hoursTitle}
              </h4>
              <p className="font-sans text-xs text-[#5A5550] mt-0.5">
                {t.hoursText}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-left">
            <MapPin className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif text-lg font-medium text-[#1F1F1F]">
                {t.locationTitle}
              </h4>
              <p className="font-sans text-xs text-[#5A5550] mt-0.5">
                {t.locationText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Track Token Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1F1F]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8E0D8] shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-[#1F1F1F]">
                {t.heroTrackCta}
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-[#8C847E] hover:text-[#1F1F1F] text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <p className="font-sans text-xs text-[#5A5550]">
              {t.enterTokenPrompt}
            </p>

            <form onSubmit={handleTrackToken} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={tokenSearchInput}
                  onChange={(e) => setTokenSearchInput(e.target.value)}
                  placeholder="e.g. A-102 or W-104"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E0D8] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 focus:border-[#E07A5F] uppercase"
                  autoFocus
                />
                {searchError && (
                  <p className="text-red-600 text-xs mt-1.5 font-sans">
                    {searchError}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSearchModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {t.trackButton}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
