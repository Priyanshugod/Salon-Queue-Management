import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Button } from '../../components/common/Button';
import { Sparkles, Check, Star, AlertCircle, ArrowLeft } from 'lucide-react';

export const JoinQueuePage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { services, barbers, settings, joinQueue } = useQueueStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['srv-1']);
  const [barberPreference, setBarberPreference] = useState<string>('ANY');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeDuplicateTokenId, setActiveDuplicateTokenId] = useState<string | null>(null);

  // Filter only active services and barbers
  const activeServices = services.filter(s => s.active);
  const activeBarbers = barbers.filter(b => b.status === 'AVAILABLE' || b.status === 'BUSY');

  // Multi-service selection handler (Max 3)
  const handleToggleService = (serviceId: string) => {
    setErrorMessage('');
    if (selectedServices.includes(serviceId)) {
      if (selectedServices.length === 1) {
        setErrorMessage("Please select at least 1 service.");
        return;
      }
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      if (selectedServices.length >= 3) {
        setErrorMessage(t.maxServicesReached);
        return;
      }
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Totals calculation
  const totalDuration = selectedServices.reduce((sum, id) => {
    const s = services.find(srv => srv.id === id);
    return sum + (s?.durationMinutes || 0);
  }, 0);

  const totalPrice = selectedServices.reduce((sum, id) => {
    const s = services.find(srv => srv.id === id);
    return sum + (s?.priceINR || 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setActiveDuplicateTokenId(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage(t.phoneInvalid);
      return;
    }

    if (selectedServices.length === 0 || selectedServices.length > 3) {
      setErrorMessage(t.maxServicesReached);
      return;
    }

    const result = joinQueue({
      customerName,
      phone: cleanPhone,
      services: selectedServices,
      barberPreference,
      type: 'REMOTE'
    });

    if (result.success && result.token) {
      navigate(`/status/${result.token.id}`);
    } else {
      setErrorMessage(result.error || "Unable to join queue.");
      if (result.token) {
        setActiveDuplicateTokenId(result.token.id);
      }
    }
  };

  if (!settings.masterQueueOpen) {
    return (
      <div className="max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-[#E07A5F] mb-4" />
        <h2 className="font-serif text-3xl text-[#1F1F1F] mb-2">{t.queueClosed}</h2>
        <p className="font-sans text-sm text-[#5A5550] leading-relaxed mb-6">
          {t.queueClosedNotice}
        </p>
        <Button variant="outline" onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#8C847E] hover:text-[#1F1F1F] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-[#E07A5F] block">
          INSTANT RESERVATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1F1F] mt-1">
          {t.joinTitle}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#5A5550] mt-1">
          {t.joinSubtitle}
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-red-700 font-sans">
            <p>{errorMessage}</p>
            {activeDuplicateTokenId && (
              <button
                type="button"
                onClick={() => navigate(`/status/${activeDuplicateTokenId}`)}
                className="mt-2 inline-block font-semibold text-[#E07A5F] hover:underline"
              >
                Track your active token &rarr;
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Customer Details */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft space-y-4">
          <h2 className="font-serif text-xl text-[#1F1F1F] flex items-center space-x-2">
            <span>{t.step1Contact}</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-[#5A5550] font-semibold mb-1.5">
                {t.fullNameLabel} *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E0D8] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40 focus:border-[#E07A5F]"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-wider text-[#5A5550] font-semibold mb-1.5">
                {t.phoneLabel} *
              </label>
              <div className="relative flex rounded-xl border border-[#E8E0D8] overflow-hidden focus-within:ring-2 focus-within:ring-[#E07A5F]/40 focus-within:border-[#E07A5F]">
                <span className="bg-[#FAF7F2] text-[#5A5550] text-xs font-semibold px-3 py-3 border-r border-[#E8E0D8] flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-4 py-3 font-sans text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Multi-Service Selection (Max 3) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#1F1F1F]">
              {t.step2Services}
            </h2>
            <span className="font-sans text-xs font-semibold px-3 py-1 rounded-full bg-[#F7EFEB] text-[#E07A5F]">
              {selectedServices.length}/3 Selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeServices.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              const displayName = language === 'gu' && service.nameGu ? service.nameGu : service.name;

              return (
                <div
                  key={service.id}
                  onClick={() => handleToggleService(service.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#E07A5F] bg-[#FDF0EC]/60 shadow-2xs'
                      : 'border-[#E8E0D8] bg-[#FAF7F2]/40 hover:border-[#D5C9BE]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-serif text-sm font-medium text-[#1F1F1F] block">
                        {displayName}
                      </span>
                      <span className="font-sans text-[11px] text-[#8C847E]">
                        {service.durationMinutes} {t.mins}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#E07A5F] border-[#E07A5F] text-white'
                          : 'border-[#E8E0D8] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E8E0D8]/50 flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-[#1F1F1F]">
                      ₹{service.priceINR}
                    </span>
                    <span className="font-sans text-[10px] text-[#8C847E] uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Stylist Preference */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D8] shadow-soft space-y-4">
          <h2 className="font-serif text-xl text-[#1F1F1F]">
            {t.step3Barber}
          </h2>

          <div className="space-y-3">
            {/* Any Barber Card */}
            <div
              onClick={() => setBarberPreference('ANY')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                barberPreference === 'ANY'
                  ? 'border-[#E07A5F] bg-[#FDF0EC]/60 shadow-2xs'
                  : 'border-[#E8E0D8] bg-[#FAF7F2]/40 hover:border-[#D5C9BE]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#E07A5F] text-white flex items-center justify-center">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="font-serif text-sm font-semibold text-[#1F1F1F] block">
                    {t.anyBarberOption}
                  </span>
                  <span className="font-sans text-xs text-[#5A5550]">
                    {t.anyBarberDesc}
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  barberPreference === 'ANY'
                    ? 'border-[#E07A5F] bg-[#E07A5F] text-white'
                    : 'border-[#E8E0D8] bg-white'
                }`}
              >
                {barberPreference === 'ANY' && <Check className="w-3 h-3" />}
              </div>
            </div>

            {/* Individual Stylists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activeBarbers.map((barber) => {
                const isSelected = barberPreference === barber.id;
                return (
                  <div
                    key={barber.id}
                    onClick={() => setBarberPreference(barber.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#E07A5F] bg-[#FDF0EC]/60 shadow-2xs'
                        : 'border-[#E8E0D8] bg-white hover:border-[#D5C9BE]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={barber.photo}
                        alt={barber.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E8E0D8]"
                      />
                      <div>
                        <span className="font-serif text-sm font-medium text-[#1F1F1F] block">
                          {barber.name}
                        </span>
                        <span className="font-sans text-[11px] text-[#8C847E]">
                          {barber.station}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#E07A5F] bg-[#E07A5F] text-white'
                          : 'border-[#E8E0D8] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Bottom Summary & Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8E0D8] p-4 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="font-sans text-[11px] text-[#8C847E] uppercase tracking-wider block">
                {t.totalDuration}: ~{totalDuration} {t.mins}
              </span>
              <span className="font-serif text-2xl font-bold text-[#1F1F1F]">
                ₹{totalPrice}
              </span>
            </div>

            <Button type="submit" variant="primary" size="lg">
              {t.confirmJoinCta}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
