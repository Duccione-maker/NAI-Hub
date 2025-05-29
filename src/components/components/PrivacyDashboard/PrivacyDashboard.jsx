/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/contexts/UserContext';
import './PrivacyDashboard.css';

const PrivacyDashboard = () => {
  const { userProfile } = useUser();
  const [consents, setConsents] = useState({
    dataProcessing: true,
    analytics: true,
    progressTracking: true,
    aiAnalysis: true
  });
  const [dataRetention, setDataRetention] = useState({
    exerciseData: '3_years',
    profileData: '3_years',
    usageAnalytics: '1_year'
  });
  
  const handleConsentChange = (type) => {
    setConsents(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const handleRetentionChange = (type, value) => {
    setDataRetention(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const saveSettings = async () => {
    // Qui andrebbe l'API call per salvare le impostazioni
    alert('Impostazioni privacy salvate con successo');
  };
  
  const downloadPersonalData = async () => {
    // Qui andrebbe l'API call per generare un report dei dati personali
    alert('Download dei dati personali iniziato');
  };
  
  const requestDeletion = async () => {
    if (window.confirm('Sei sicuro di voler richiedere la cancellazione dei tuoi dati? Questa azione non può essere annullata.')) {
      // Qui andrebbe l'API call per richiedere la cancellazione
      alert('Richiesta di cancellazione inviata. Riceverai una conferma via email.');
    }
  };
  
  // Data retention info con countdown
  const calculateRetentionDate = (period) => {
    const today = new Date();
    const years = parseInt(period.split('_')[0]);
    const futureDate = new Date(today.setFullYear(today.getFullYear() + years));
    return futureDate.toLocaleDateString();
  };
  
  return (
    <div className="privacy-dashboard">
      <h2>Gestione Privacy e Dati Personali</h2>
      <p className="privacy-intro">
        Questa dashboard ti permette di gestire come vengono trattati i tuoi dati all'interno della piattaforma, 
        in conformità con il GDPR e le linee guida del Ministero dell'Istruzione.
      </p>
      
      <section className="consent-section">
        <h3>Consenso al trattamento dei dati</h3>
        <div className="consent-option">
          <label>
            <input 
              type="checkbox" 
              checked={consents.dataProcessing} 
              onChange={() => handleConsentChange('dataProcessing')}
              disabled={true} // Consenso obbligatorio
            />
            Trattamento dati essenziali (obbligatorio per l'utilizzo della piattaforma)
          </label>
          <p className="consent-description">
            Questi dati sono necessari per il funzionamento di base della piattaforma e il tracciamento dei progressi.
          </p>
        </div>
        
        <div className="consent-option">
          <label>
            <input 
              type="checkbox" 
              checked={consents.analytics} 
              onChange={() => handleConsentChange('analytics')}
            />
            Analisi dell'utilizzo della piattaforma
          </label>
          <p className="consent-description">
            Ci permette di migliorare la piattaforma analizzando come viene utilizzata.
          </p>
        </div>
        
        <div className="consent-option">
          <label>
            <input 
              type="checkbox" 
              checked={consents.aiAnalysis} 
              onChange={() => handleConsentChange('aiAnalysis')}
            />
            Analisi AI per personalizzazione dell'apprendimento
          </label>
          <p className="consent-description">
            L'intelligenza artificiale analizza i tuoi esercizi per personalizzare il percorso di apprendimento.
          </p>
        </div>
      </section>
      
      <section className="retention-section">
        <h3>Conservazione dei dati</h3>
        <p>Secondo le linee guida ministeriali, i dati vengono conservati per un periodo limitato:</p>
        
        <div className="retention-option">
          <label>Dati degli esercizi:</label>
          <select 
            value={dataRetention.exerciseData}
            onChange={(e) => handleRetentionChange('exerciseData', e.target.value)}
          >
            <option value="1_year">1 anno</option>
            <option value="2_years">2 anni</option>
            <option value="3_years">3 anni (predefinito)</option>
          </select>
          <p className="retention-info">
            Data di cancellazione prevista: {calculateRetentionDate(dataRetention.exerciseData)}
          </p>
        </div>
        
        <div className="retention-option">
          <label>Dati del profilo:</label>
          <select 
            value={dataRetention.profileData}
            onChange={(e) => handleRetentionChange('profileData', e.target.value)}
          >
            <option value="1_year">1 anno</option>
            <option value="2_years">2 anni</option>
            <option value="3_years">3 anni (predefinito)</option>
          </select>
          <p className="retention-info">
            Data di cancellazione prevista: {calculateRetentionDate(dataRetention.profileData)}
          </p>
        </div>
      </section>
      
      <section className="data-actions">
        <h3>Azioni sui dati personali</h3>
        <div className="action-buttons">
          <button onClick={downloadPersonalData} className="download-btn">
            Scarica i miei dati
          </button>
          <button onClick={requestDeletion} className="delete-btn">
            Richiedi cancellazione dei dati
          </button>
        </div>
        <p className="data-note">
          La cancellazione dei dati comporterà la perdita di tutti i progressi sulla piattaforma.
        </p>
      </section>
      
      <div className="privacy-footer">
        <button onClick={saveSettings} className="save-settings-btn">
          Salva impostazioni
        </button>
      </div>
    </div>
  );
};

export default PrivacyDashboard;