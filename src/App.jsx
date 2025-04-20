import AccessibilityPage from './components/AccessibilityPage/AccessibilityPage';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { getUserProfile } from './services/apiService';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import TestIngresso from './components/TestIngresso/TestIngresso';
import LetturaAssistita from './components/LetturaAssistita/LetturaAssistita';
import SezioneScrittura from './components/SezioneScrittura/SezioneScrittura';
import SezionePunteggiatura from './components/SezionePunteggiatura/SezionePunteggiatura';
import SezioneRegistri from './components/SezioneRegistri/SezioneRegistri';
import SupportoLinguistico from './components/SupportoLinguistico/SupportoLinguistico';
import TorneoLinguaKai from './components/TorneoLinguaKai/TorneoLinguaKai';
import DojoConoscenza from './components/DojoConoscenza/DojoConoscenza';
import Letteratura from './components/Letteratura/Letteratura';
import TestoLetterario from './components/Letteratura/TestoLetterario';
// Nuovi componenti per la conformità
import LoadingScreen from './components/common/LoadingScreen';
import SupportoButton from './components/common/SupportoButton';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import AccessibilityToolbar from './components/common/AccessibilityToolbar';
import PrivacyDashboard from './components/PrivacyDashboard/PrivacyDashboard';
import TeacherTraining from './components/TeacherTraining/TeacherTraining';
import SystemIntegrations from './components/SystemIntegrations/SystemIntegrations';
import NormativeCompliance from './components/NormativeCompliance/NormativeCompliance';
import ParentalConsent from './components/ParentalConsent/ParentalConsent';
// Componente di accesso all'area docenti
import AccessoLetteraturaPanel from './components/admin/AccessoLetteraturaPanel';
import TeacherAccessLink from './components/TeacherAccess/TeacherAccessLink';

import { UserProvider } from './contexts/UserContext';
import './App.css';

// Componente interno per accedere a useLocation (deve essere usato all'interno di Router)
const AppContent = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSupportoVisible, setSupportoVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [consentVerified, setConsentVerified] = useState(false);
  const location = useLocation();
  
  // Caricamento del profilo utente
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Verifica se esiste un profilo salvato localmente
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          try {
            setUserProfile(JSON.parse(savedProfile));
            setLoading(false);
          } catch (e) {
            console.error('Error parsing saved profile:', e);
          }
        }
        
        // Carica comunque i dati freschi dal server
        const profileData = await getUserProfile();
        setUserProfile(profileData);
        
        // Verifica età e necessità di consenso genitoriale
        if (profileData && profileData.age < 14) {
          const hasConsent = localStorage.getItem('parental-consent');
          setConsentVerified(!!hasConsent);
        } else {
          setConsentVerified(true);
        }
        
        // Salva il profilo aggiornato
        localStorage.setItem('userProfile', JSON.stringify(profileData));
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Impossibile caricare il profilo utente. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // Determina la sezione corrente in base all'URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('lettura')) {
      setCurrentSection('lettura');
    } else if (path.includes('scrittura')) {
      setCurrentSection('scrittura');
    } else if (path.includes('punteggiatura')) {
      setCurrentSection('punteggiatura');
    } else if (path.includes('registri')) {
      setCurrentSection('registri');
    } else if (path.includes('torneo')) {
      setCurrentSection('torneo');
    } else if (path.includes('dojo')) {
      setCurrentSection('dojo');
    } else if (path.includes('letteratura')) {
      setCurrentSection('letteratura');
    } else if (path.includes('test-ingresso')) {
      setCurrentSection('test');
    } else if (path.includes('privacy')) {
      setCurrentSection('privacy');
    } else if (path.includes('formazione')) {
      setCurrentSection('formazione');
    } else if (path.includes('integrazioni')) {
      setCurrentSection('integrazioni');
    } else if (path.includes('normative')) {
      setCurrentSection('normative');
    } else if (path.includes('admin')) {
      setCurrentSection('admin');
    } else {
      setCurrentSection('dashboard');
    }
  }, [location.pathname]);
  
  // Reindirizzamento al test di ingresso se necessario
  useEffect(() => {
    if (userProfile && 
        !userProfile.hasCompletedEntryTest && 
        !location.pathname.includes('test-ingresso') && 
        !location.pathname.includes('login') &&
        !location.pathname.includes('privacy') &&
        !location.pathname.includes('consent') &&
        !location.pathname.includes('admin')) {
      // Non reindirizza immediatamente per evitare loop in alcuni casi
      setTimeout(() => {
        window.location.href = '/test-ingresso';
      }, 100);
    }
    
    // Reindirizzamento alla pagina di consenso genitoriale se necessario
    if (userProfile && 
        userProfile.age < 14 && 
        !consentVerified && 
        !location.pathname.includes('consent') &&
        !location.pathname.includes('admin')) {
      setTimeout(() => {
        window.location.href = '/consent';
      }, 100);
    }
  }, [userProfile, location.pathname, consentVerified]);
  
  const toggleSupporto = () => {
    setSupportoVisible(!isSupportoVisible);
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return <div className="error-screen">{error}</div>;
  }
  
  return (
    <UserProvider value={{ userProfile, setUserProfile, loading }}>
      <ErrorBoundary>
        <div className="app">
          <Navbar userProfile={userProfile} currentSection={currentSection} />
          
          {/* AccessibilityToolbar sempre visibile */}
          <AccessibilityToolbar />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test-ingresso" element={<TestIngresso />} />
              
              {/* Percorsi relativi alla conformità normativa */}
              <Route path="/privacy" element={<PrivacyDashboard />} />
              <Route path="/consent" element={<ParentalConsent studentId={userProfile?.id} setVerified={setConsentVerified} />} />
              <Route path="/formazione" element={<TeacherTraining />} />
              <Route path="/integrazioni" element={<SystemIntegrations />} />
              <Route path="/normative" element={<NormativeCompliance />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />       
              
              {/* Percorsi protetti che richiedono il test di ingresso */}
              <Route path="/lettura" element={
                <ProtectedRoute requiresEntryTest={true} requiresConsent={true}>
                  <LetturaAssistita />
                </ProtectedRoute>
              } />
              
              <Route path="/scrittura" element={
                <ProtectedRoute requiresEntryTest={true} requiresConsent={true}>
                  <SezioneScrittura />
                </ProtectedRoute>
              } />
              
              <Route path="/punteggiatura" element={
                <ProtectedRoute requiresEntryTest={true} requiresConsent={true}>
                  <SezionePunteggiatura />
                </ProtectedRoute>
              } />
              
              <Route path="/registri" element={
                <ProtectedRoute requiresEntryTest={true} requiresConsent={true}>
                  <SezioneRegistri />
                </ProtectedRoute>
              } />
              
              <Route path="/torneo" element={
                <ProtectedRoute requiresEntryTest={true} requiresConsent={true}>
                  <TorneoLinguaKai />
                </ProtectedRoute>
              } />
              
              <Route path="/dojo" element={
                <ProtectedRoute requiresEntryTest={true} requiresConsent={true}>
                  <DojoConoscenza />
                </ProtectedRoute>
              } />
              
              {/* Nuove rotte per la sezione Letteratura */}
              <Route path="/letteratura" element={
                <ProtectedRoute requiresEntryTest={true} requiresConsent={true}>
                  <Letteratura userProfile={userProfile} />
                </ProtectedRoute>
              } />
              
              <Route path="/letteratura/testo/:id" element={
                <ProtectedRoute requiresEntryTest={true} requiresConsent={true}>
                  <TestoLetterario />
                </ProtectedRoute>
              } />
              
              {/* Rotta per l'Area Docenti */}
              <Route path="/admin" element={
                <AccessoLetteraturaPanel 
                  classi={[]} 
                  studenti={[]} 
                />
              } />
              
              {/* Reindirizzamento per percorsi non validi */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          
          {/* Pulsante per attivare il supporto linguistico */}
          <SupportoButton 
            isVisible={isSupportoVisible} 
            toggleVisibility={toggleSupporto} 
            currentLanguage={userProfile?.preferredLanguage || 'it'} 
          />
          
          {/* Componente di supporto linguistico che appare solo quando attivato */}
          {isSupportoVisible && (
            <SupportoLinguistico 
              onClose={() => setSupportoVisible(false)} 
              currentSection={currentSection}
              userProfile={userProfile}
            />
          )}
          
          {/* Link all'Area Docenti */}
          <TeacherAccessLink />
          
          {/* Footer con informazioni sulla conformità */}
          <footer className="app-footer">
            <div className="compliance-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/normative">Conformità normativa</Link>
              <Link to="/accessibility">Accessibilità</Link>
            </div>
            <div className="ministry-compliance">
              <small>Conforme alle linee guida del Ministero dell'Istruzione sulla Didattica Digitale Integrata</small>
            </div>
          </footer>
        </div>
      </ErrorBoundary>
    </UserProvider>
  );
};

// Componente App principale
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;