import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useQueueStore } from '../../store/useQueueStore';
import { Button } from '../common/Button';
import { Check, X } from 'lucide-react';

interface WalkInModalProps {
  onClose: () => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({ onClose }) => {
  const { t, language } = useLanguage();
  const { services, barbers, joinQueue } = useQueueStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['srv-1']);
  const [barberPreference, setBarberPreference] = useState<string>('ANY');
  const [error, setError] = useState('');

  const activeServices = services.filter(s => s.active);
  const activeBarbers = barbers.filter(b => b.status === 'AVAILABLE' || b.status === 'BUSY');

  const handleToggle = (id: string) => {
    setError('');
    if (selectedServices.includes(id)) {
      if (selectedServices.length === 1) return;
      setSelectedServices(selectedServices.filter(sId => sId !== id));
    } else {
      if (selectedServices.length >= 3) {
        setError(t.maxServicesReached);
        return;
      }
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Please enter customer name.");
      return;
    }

    const res = joinQueue({
      customerName,
      phone,
      services: selectedServices,
      barberPreference,
      type: 'WALK_IN'
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Failed to register walk-in.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1F1F]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8E0D8] shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E0D8] pb-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-[#E07A5F] block">
              FRONT DESK ENTRY
            </span>
            <h3 className="font-serif text-2xl text-[#1F1F1F]">
              {t.walkInModalTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C847E] hover:text-[#1F1F1F] p-1.5 rounded-full hover:bg-[#FAF7F2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A5550] font-semibold mb-1">
              {t.fullNameLabel} *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t.walkInNamePlaceholder}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A5550] font-semibold mb-1">
              {t.phoneLabel} (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.optionalPhonePlaceholder}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E0D8] text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/40"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs uppercase tracking-wider text-[#5A5550] font-semibold">
                Services (Max 3)
              </label>
              <span className="text-[11px] text-[#E07A5F] font-medium">
                {selectedServices.length}/3
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-[#E8E0D8] rounded-xl bg-[#FAF7F2]/50">
              {activeServices.map(srv => {
                const isSelected = selectedServices.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleToggle(srv.id)}
                    className={`p-2 rounded-lg text-xs cursor-pointer border flex justify-between items-center ${
                      isSelected
                        ? 'bg-[#E07A5F] text-white border-[#E07A5F]'
                        : 'bg-white text-[#1F1F1F] border-[#E8E0D8]'
                    }`}
                  >
                    <span className="truncate mr-1">
                      {language === 'gu' && srv.nameGu ? srv.nameGu : srv.name}
                    </span>
                    <span className="text-[10px] opacity-80 shrink-0">₹{srv.priceINR}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A5550] font-semibold mb-1.5">
              Stylist Preference
            </label>
            <select
              value={barberPreference}
              onChange={(e) => setBarberPreference(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E0D8] text-sm focus:outline-none bg-white"
            >
              <option value="ANY">{t.anyBarberOption}</option>
              {activeBarbers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.station})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8E0D8]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {t.walkInSubmit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
