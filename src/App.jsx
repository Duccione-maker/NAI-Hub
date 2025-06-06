import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/components/Navbar/Navbar';
import Dashboard from './components/components/Dashboard/Dashboard';
import TestIngresso from './components/components/TestIngresso/TestIngresso';
import LetturaAssistita from './components/components/LetturaAssistita/LetturaAssistita';
import SezioneScrittura from './components/components/SezioneScrittura/SezioneScrittura';
import SezionePunteggiatura from './components/components/SezionePunteggiatura/SezionePunteggiatura';
import SezioneRegistri from './components/components/SezioneRegistri/SezioneRegistri';
import DojoConoscenza from './components/components/DojoConoscenza/DojoConoscenza';
import TorneoLinguaKai from './components/components/TorneoLinguaKai/TorneoLinguaKai';
import SupportoLinguistico from './components/components/SupportoLinguistico/SupportoLinguistico';
import SupportoButton from './components/components/common/SupportoButton';
import AccessibilityToolbar from './components/components/common/AccessibilityToolbar';
import AccessoLetteraturaPanel from './components/components/admin/AccessoLetteraturaPanel';
import TeacherAccessLink from './components/components/TeacherAccess/TeacherAccessLink';
import AccessibilityPage from './components/components/AccessibilityPage/AccessibilityPage';
import PrivacyDashboard from './components/components/PrivacyDashboard/PrivacyDashboard';
import NormativeCompliance from './components/components/NormativeCompliance/NormativeCompliance';
import ParentalConsent from './components/components/ParentalConsent/ParentalConsent';
import TeacherTraining from './components/components/TeacherTraining/TeacherTraining';
import SystemIntegrations from './components/components/SystemIntegrations/SystemIntegrations';

// ✅ IMPORT CORRETTO del sistema di traduzione
import EnhancedSupportoLinguistico from './components/components/TranslationSystem/EnhancedSupportoLinguistico';
import { UserContext } from './contexts/contexts/UserContext';

import './App.css';

// Mock UserContext per testing
const MockUserContext = React.createContext({
  user: {
    id: 'test-user',
    name: 'Studente Test',
    motherLanguage: 'ar', // Arabo come esempio
    level: 'A1'
  }
});

// Wrapper componente per fornire il mock context
const MockUserProvider = ({ children }) => {
  return (
    <MockUserContext.Provider value={{
      user: {
        id: 'test-user',
        name: 'Studente Test', 
        motherLanguage: 'ar',
        level: 'A1'
      }
    }}>
      {children}
    </MockUserContext.Provider>
  );
};

// Componente per gestire il sistema di traduzione in base alla route
const TranslationSystemManager = () => {
  const location = useLocation();
  const { user } = useContext(MockUserContext) || {}; // ✅ Usa MockUserContext per ora

  // DEBUG
  console.log('🔍 TranslationSystemManager DEBUG:', {
    user: user,
    pathname: location.pathname,
    hasUser: !!user
  });
  
  const isTestMode = location.pathname.includes('/test-ingresso') || 
                     location.pathname.includes('/test-livello') ||
                     location.pathname.includes('/esame');
  
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/lettura')) return 'lettura-assistita';
    if (path.includes('/scrittura')) return 'scrittura';
    if (path.includes('/punteggiatura')) return 'punteggiatura';
    if (path.includes('/registri')) return 'registri';
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/dojo')) return 'biblioteca';
    return 'dashboard';
  };

  if (!user || isTestMode) {
    console.log('❌ Sistema traduzione NON attivo - User:', !!user, 'TestMode:', isTestMode);
    return null;
  }

  console.log('✅ Sistema traduzione ATTIVO per sezione:', getCurrentSection());

  return (
    <EnhancedSupportoLinguistico 
      currentSection={getCurrentSection()}
      isTestMode={isTestMode}
    />
  );
};

function App() {
  const [isSupportoVisible, setSupportoVisible] = useState(false);

  const toggleSupporto = () => {
    setSupportoVisible(!isSupportoVisible);
  };

  return (
    <MockUserProvider> {/* ✅ Wrappa tutto con MockUserProvider */}
      <Router>
        <div className="app">
          <Navbar />
          
          <AccessibilityToolbar />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test-ingresso" element={<TestIngresso />} />
              <Route path="/lettura" element={<LetturaAssistita />} />
              <Route path="/scrittura" element={<SezioneScrittura />} />
              <Route path="/punteggiatura" element={<SezionePunteggiatura />} />
              <Route path="/registri" element={<SezioneRegistri />} />
              <Route path="/dojo" element={<DojoConoscenza />} />
              <Route path="/torneo" element={<TorneoLinguaKai />} />
              <Route path="/admin" element={
                <AccessoLetteraturaPanel 
                  classi={[]} 
                  studenti={[]} 
                />
              } />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/privacy" element={<PrivacyDashboard />} />
              <Route path="/normative" element={<NormativeCompliance />} />
              <Route path="/consent" element={<ParentalConsent studentId="1" setVerified={() => {}} />} />
              <Route path="/formazione" element={<TeacherTraining />} />
              <Route path="/integrazioni" element={<SystemIntegrations />} />
            </Routes>
          </main>

          {/* ✅ SISTEMA DI TRADUZIONE AVANZATO */}
          <TranslationSystemManager />

          {/* SUPPORTO LINGUISTICO LEGACY (mantenuto per backward compatibility) */}
          <SupportoButton 
            isVisible={isSupportoVisible} 
            toggleVisibility={toggleSupporto} 
            currentLanguage="it"
          />

          {isSupportoVisible && (
            <SupportoLinguistico 
              onClose={() => setSupportoVisible(false)} 
              currentSection="dashboard"
            />
          )}

          <TeacherAccessLink />

          <footer className="app-footer">
            <div className="compliance-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/normative">Conformità normativa</Link>
              <Link to="/accessibility">Accessibilità</Link>
              <Link to="/formazione">Formazione Docenti</Link>
              <Link to="/integrazioni">Integrazioni</Link>
            </div>
            <div className="ministry-compliance">
              <small>Conforme alle linee guida del Ministero dell&apos;Istruzione sulla Didattica Digitale Integrata</small>
            </div>
          </footer>
        </div>
      </Router>
    </MockUserProvider>
  );
}

export default App;