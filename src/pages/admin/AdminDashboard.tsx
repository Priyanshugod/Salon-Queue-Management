import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Button } from '../../components/common/Button';
import { Service, Barber } from '../../types';
import { ShieldCheck, ToggleLeft, ToggleRight, DollarSign, Clock, Users, Scissors, RotateCcw, Plus, Check } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    settings,
    tokens,
    barbers,
    services,
    toggleMasterQueue,
    toggleAutoCutoff,
    toggleServiceActive,
    saveService,
    saveBarber,
    resetDailyQueue
  } = useQueueStore();

  const [activeTab, setActiveTab] = useState<'kpi' | 'services' | 'barbers' | 'audit'>('kpi');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Quick statistics
  const completedToday = tokens.filter(t => t.status === 'COMPLETED').length;
  const noShowsToday = tokens.filter(t => t.status === 'NO_SHOW').length;
  const totalRevenue = tokens
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, tok) => {
      const srvSum = tok.services.reduce((sSum, id) => {
        const s = services.find(srv => srv.id === id);
        return sSum + (s?.priceINR || 0);
      }, 0);
      return sum + srvSum;
    }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E0D8] pb-6">
        <div>
          <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#E07A5F] block">
            OWNER COMMAND
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1F1F]">
            {t.adminTitle}
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-0.5">
            {t.adminSubtitle}
          </p>
        </div>

        {/* Master Queue Switch */}
        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-[#E8E0D8] shadow-2xs">
          <div>
            <span className="font-serif text-sm font-semibold text-[#1F1F1F] block">
              {t.masterQueueToggle}
            </span>
            <span className="text-[11px] text-[#8C847E]">
              {settings.masterQueueOpen ? 'Accepting new clients' : 'Queue currently locked'}
            </span>
          </div>

          <button
            onClick={() => toggleMasterQueue(!settings.masterQueueOpen)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
              settings.masterQueueOpen ? 'bg-[#3D7C57]' : 'bg-[#E07A5F]'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                settings.masterQueueOpen ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#E8E0D8] pb-3">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
            activeTab === 'kpi'
              ? 'bg-[#1F1F1F] text-white'
              : 'text-[#5A5550] hover:text-[#1F1F1F]'
          }`}
        >
          Analytics & Overview
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
            activeTab === 'services'
              ? 'bg-[#1F1F1F] text-white'
              : 'text-[#5A5550] hover:text-[#1F1F1F]'
          }`}
        >
          {t.tabServices}
        </button>
        <button
          onClick={() => setActiveTab('barbers')}
          className={`px-4 py-2 rounded-full font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
            activeTab === 'barbers'
              ? 'bg-[#1F1F1F] text-white'
              : 'text-[#5A5550] hover:text-[#1F1F1F]'
          }`}
        >
          {t.tabBarbers}
        </button>
      </div>

      {/* Tab 1: KPI Analytics */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft">
              <span className="text-xs uppercase tracking-wider text-[#8C847E] font-semibold block mb-1">
                {t.kpiTotalServed}
              </span>
              <span className="font-serif text-3xl font-bold text-[#1F1F1F]">
                {completedToday} guests
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft">
              <span className="text-xs uppercase tracking-wider text-[#8C847E] font-semibold block mb-1">
                {t.kpiRevenue}
              </span>
              <span className="font-serif text-3xl font-bold text-[#3D7C57]">
                ₹{totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft">
              <span className="text-xs uppercase tracking-wider text-[#8C847E] font-semibold block mb-1">
                Active Staff
              </span>
              <span className="font-serif text-3xl font-bold text-[#E07A5F]">
                {barbers.filter(b => b.status === 'AVAILABLE' || b.status === 'BUSY').length} / {barbers.length}
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft">
              <span className="text-xs uppercase tracking-wider text-[#8C847E] font-semibold block mb-1">
                {t.kpiNoShows}
              </span>
              <span className="font-serif text-3xl font-bold text-red-600">
                {noShowsToday}
              </span>
            </div>
          </div>

          {/* Reset Queue Banner */}
          <div className="bg-[#FAF7F2] border border-[#E8E0D8] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1F1F1F]">
                Daily Queue Reset
              </h3>
              <p className="font-sans text-xs text-[#5A5550]">
                Clear today's tokens and restore all chairs to available for the next business day.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(true)}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>{t.resetQueueBtn}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Service Catalog */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl border border-[#E8E0D8] shadow-soft overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#1F1F1F]">
              {t.tabServices} ({services.length})
            </h3>
          </div>

          <div className="divide-y divide-[#E8E0D8]/60">
            {services.map((srv) => (
              <div key={srv.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#1F1F1F]">
                    {language === 'gu' && srv.nameGu ? srv.nameGu : srv.name}
                  </h4>
                  <span className="text-xs font-sans text-[#8C847E]">
                    {srv.durationMinutes} mins • ₹{srv.priceINR} • Category: {srv.category}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleServiceActive(srv.id)}
                    className={`px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider ${
                      srv.active
                        ? 'bg-[#EAF3ED] text-[#3D7C57]'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {srv.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Barber Roster */}
      {activeTab === 'barbers' && (
        <div className="bg-white rounded-3xl border border-[#E8E0D8] shadow-soft overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#1F1F1F]">
              {t.tabBarbers} ({barbers.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {barbers.map((barber) => (
              <div key={barber.id} className="p-4 rounded-2xl border border-[#E8E0D8] flex items-center space-x-4">
                <img
                  src={barber.photo}
                  alt={barber.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#E8E0D8]"
                />
                <div>
                  <h4 className="font-serif text-base font-semibold text-[#1F1F1F]">
                    {barber.name}
                  </h4>
                  <span className="text-xs text-[#E07A5F] font-medium block">
                    {barber.station}
                  </span>
                  <span className="text-xs text-[#8C847E]">
                    Status: <strong>{barber.status}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1F1F]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E8E0D8] shadow-xl text-center space-y-4">
            <h3 className="font-serif text-2xl text-[#1F1F1F]">{t.resetConfirmTitle}</h3>
            <p className="font-sans text-xs text-[#5A5550]">
              {t.resetConfirmDesc}
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-full border border-[#E8E0D8] font-sans text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDailyQueue();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-full bg-red-600 text-white font-sans text-xs uppercase font-semibold"
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
