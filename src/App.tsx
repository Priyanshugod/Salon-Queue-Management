import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { Header } from './components/common/Header';

import { HomePage } from './pages/customer/HomePage';
import { JoinQueuePage } from './pages/customer/JoinQueuePage';
import { StatusTrackerPage } from './pages/customer/StatusTrackerPage';
import { ReceptionDashboard } from './pages/reception/ReceptionDashboard';
import { BarberStationPage } from './pages/barber/BarberStationPage';
import { TvDisplayPage } from './pages/display/TvDisplayPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* TV Display Page is standalone full-screen (without standard header) */}
          <Route path="/display" element={<TvDisplayPage />} />

          {/* All other routes wrapped in global navigation header */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/join" element={<JoinQueuePage />} />
                    <Route path="/status/:id" element={<StatusTrackerPage />} />
                    <Route path="/reception" element={<ReceptionDashboard />} />
                    <Route path="/barber/:name" element={<BarberStationPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
