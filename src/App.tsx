import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Common/Header';
import Sidebar from './components/Common/Sidebar';
import Footer from './components/Common/Footer';
import ClientsPage from './pages/ClientsPage';
import RoutinesPage from './pages/RoutinesPage';
import DietsPage from './pages/DietsPage';
import EconomicsPage from './pages/EconomicsPage';
import MarketingCampaignsPage from './pages/MarketingCampaignsPage';
import MarketingAnalyticsPage from './pages/MarketingAnalyticsPage';
import ContentPublishingPage from './pages/ContentPublishingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AjustesPage from './pages/AjustesPage';
import EditPlanningPage from './pages/EditPlanningPage';
import ClassesPage from './pages/ClassesPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/diets" element={<DietsPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/economics" element={<EconomicsPage />} />
            <Route path="/marketing/campaigns" element={<MarketingCampaignsPage />} />
            <Route path="/marketing/analytics" element={<MarketingAnalyticsPage />} />
            <Route path="/content" element={<ContentPublishingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<AjustesPage />} />
            <Route path="/edit-planning/:id" element={<EditPlanningPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;