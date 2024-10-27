import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import PageEdicionDieta from './pages/PageEdicionDieta';
import LoginPage from './pages/LoginPage';
import ServiciosPage from './pages/ServiciosPage';
import CommandAssister from './components/CommandAssister/CommandAssister';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const { theme } = useTheme();
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/clients" element={<PrivateRoute><ClientsPage /></PrivateRoute>} />
            <Route path="/routines" element={<PrivateRoute><RoutinesPage /></PrivateRoute>} />
            <Route path="/diets" element={<PrivateRoute><DietsPage /></PrivateRoute>} />
            <Route path="/classes" element={<PrivateRoute><ClassesPage /></PrivateRoute>} />
            <Route path="/economics" element={<PrivateRoute><EconomicsPage /></PrivateRoute>} />
            <Route path="/marketing/campaigns" element={<PrivateRoute><MarketingCampaignsPage /></PrivateRoute>} />
            <Route path="/marketing/analytics" element={<PrivateRoute><MarketingAnalyticsPage /></PrivateRoute>} />
            <Route path="/content" element={<PrivateRoute><ContentPublishingPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><AjustesPage /></PrivateRoute>} />
            <Route path="/services" element={<PrivateRoute><ServiciosPage /></PrivateRoute>} /> {/* Nueva ruta */}
            <Route path="/edit-planning/:id" element={<PrivateRoute><EditPlanningPage /></PrivateRoute>} />
            <Route path="/edit-diet/:id" element={<PrivateRoute><PageEdicionDieta /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
      <Footer />
      <CommandAssister />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
