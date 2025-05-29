import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
import './App.css';

function App() {
  const [isSupportoVisible, setSupportoVisible] = useState(false);

  const toggleSupporto = () => {
    setSupportoVisible(!isSupportoVisible);
  };

  return (
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
  );
}

export default App;