import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
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
import Publications from './pages/Publications';
import EditPlanningPage from './pages/EditPlanningPage';
import PlantillaPage from './components/Routines/plantillas/PlantillaPage';
import ClassesPage from './pages/ClassesPage';
import PageEdicionDieta from './pages/PageEdicionDieta';
import LoginPage from './pages/LoginPage';
import ServiciosPage from './pages/ServiciosPage';
import CommandAssister from './components/CommandAssister/CommandAssister';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Reportesweb from './pages/Reportesweb';
import AIPostCreator from './pages/AIPostCreator';
import AIStoryCreator from './pages/AIStoryCreator';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isCommandAssisterOpen, setIsCommandAssisterOpen] = useState(false);
  const location = useLocation();

  if (!user) {
    return <LoginPage />;
  }

  // Determinar si estamos en la ruta "/edit-planning/:id"
  const isOnEditPlanningPage = location.pathname.startsWith('/edit-planning/');

  // Determinar si debemos ocultar el layout
  const shouldHideLayout = isCommandAssisterOpen && isOnEditPlanningPage;

  return (
    <div
      className={`flex ${shouldHideLayout ? '' : 'flex-col'} min-h-screen ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* Header se oculta si shouldHideLayout es true */}
      {!shouldHideLayout && <Header />}
      <div className={`flex flex-1 ${shouldHideLayout ? '' : ''} relative`}>
        {/* Sidebar se oculta si shouldHideLayout es true */}
        {!shouldHideLayout && <Sidebar />}
        
        {/* Contenido principal */}
        {shouldHideLayout ? (
          <>
            {/* Layout especial para EditPlanningPage */}
            <div className="w-1/3 h-full">
              <CommandAssister
                isExpanded={isCommandAssisterOpen}
                setIsExpanded={setIsCommandAssisterOpen}
              />
            </div>
            <main className="w-2/3 h-full p-6 overflow-y-auto">
              <Routes>
                <Route
                  path="/edit-planning/:id"
                  element={
                    <PrivateRoute>
                      <EditPlanningPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </>
        ) : (
          <>
            <main className="flex-1 p-6">
              <Routes>
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/clients"
                  element={
                    <PrivateRoute>
                      <ClientsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/routines"
                  element={
                    <PrivateRoute>
                      <RoutinesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/diets"
                  element={
                    <PrivateRoute>
                      <DietsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/classes"
                  element={
                    <PrivateRoute>
                      <ClassesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/economics"
                  element={
                    <PrivateRoute>
                      <EconomicsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/marketing/campaigns"
                  element={
                    <PrivateRoute>
                      <MarketingCampaignsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/marketing/analytics"
                  element={
                    <PrivateRoute>
                      <MarketingAnalyticsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/content"
                  element={
                    <PrivateRoute>
                      <ContentPublishingPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/publications"
                  element={
                    <PrivateRoute>
                      <Publications />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <AjustesPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/services"
                  element={
                    <PrivateRoute>
                      <ServiciosPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit-planning/:id"
                  element={
                    <PrivateRoute>
                      <EditPlanningPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/plantilla/:id"
                  element={
                    <PrivateRoute>
                      <PlantillaPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit-diet/:id"
                  element={
                    <PrivateRoute>
                      <PageEdicionDieta />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/ai-post-creator"
                  element={
                    <PrivateRoute>
                      <AIPostCreator />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/ai-story-creator"
                  element={
                    <PrivateRoute>
                      <AIStoryCreator />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reportesweb"
                  element={
                    <PrivateRoute>
                      <Reportesweb />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            
            {/* CommandAssister en la esquina inferior derecha para otras páginas */}
            <div className={`fixed bottom-4 right-4 z-50 ${isCommandAssisterOpen ? 'w-96' : 'w-auto'}`}>
              <CommandAssister
                isExpanded={isCommandAssisterOpen}
                setIsExpanded={setIsCommandAssisterOpen}
              />
            </div>
          </>
        )}
      </div>
      {!shouldHideLayout && <Footer />}
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