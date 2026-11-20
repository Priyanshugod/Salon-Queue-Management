import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Sparkles, Monitor, Users, Scissors, ShieldAlert, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { settings, barbers } = useQueueStore();
  const location = useLocation();

  const activeBarbersCount = barbers.filter(b => b.status === 'AVAILABLE' || b.status === 'BUSY').length;

  const navLinks = [
    { to: '/', label: t.navHome },
    { to: '/join', label: t.navJoin },
    { to: '/reception', label: t.navReception, icon: Users },
    { to: '/barber/barber-1', label: t.navBarberStations, icon: Scissors },
    { to: '/display', label: t.navTvDisplay, icon: Monitor },
    { to: '/admin', label: t.navAdmin, icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E0D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Monogram */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-[#E07A5F] flex items-center justify-center text-white shadow-sm group-hover:bg-[#D36B50] transition-colors">
              <span className="font-serif italic font-bold text-lg tracking-wider">C</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-2xl tracking-wide font-normal text-[#1F1F1F]">
                  {t.salonName}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F] opacity-80" />
              </div>
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-semibold text-[#8C847E] block -mt-1">
                {t.salonTagline}
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop/Tablet) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-1.5 rounded-full font-sans text-xs uppercase tracking-wider font-medium transition-all ${
                    isActive
                      ? 'bg-[#1F1F1F] text-white shadow-xs'
                      : 'text-[#5A5550] hover:text-[#1F1F1F] hover:bg-[#F7EFEB]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Status Badge & Language Switcher */}
          <div className="flex items-center space-x-3">
            {/* Live Queue Status Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full border border-[#E8E0D8] bg-white text-xs font-sans">
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.masterQueueOpen && activeBarbersCount > 0
                    ? 'bg-[#3D7C57] animate-pulse'
                    : 'bg-[#E07A5F]'
                }`}
              />
              <span className="text-[#5A5550] font-medium text-[11px] tracking-wide">
                {settings.masterQueueOpen ? t.queueOpen : t.queueClosed}
              </span>
            </div>

            {/* Persistent Language Switcher */}
            <div className="flex items-center bg-[#F7EFEB] border border-[#E8E0D8] rounded-full p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-sans font-semibold tracking-wider transition-all ${
                  language === 'en'
                    ? 'bg-[#E07A5F] text-white shadow-xs'
                    : 'text-[#5A5550] hover:text-[#1F1F1F]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('gu')}
                className={`px-2.5 py-1 rounded-full text-xs font-sans font-semibold tracking-wider transition-all ${
                  language === 'gu'
                    ? 'bg-[#E07A5F] text-white shadow-xs'
                    : 'text-[#5A5550] hover:text-[#1F1F1F]'
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto pb-2.5 pt-1 space-x-2 scrollbar-none border-t border-[#E8E0D8]/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`whitespace-nowrap px-3 py-1 rounded-full font-sans text-[11px] uppercase tracking-wider font-medium transition-all ${
                  isActive
                    ? 'bg-[#1F1F1F] text-white'
                    : 'text-[#5A5550] bg-white border border-[#E8E0D8]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
