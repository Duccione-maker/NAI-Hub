import React, { useState } from 'react';
import './SystemIntegrations.css';

// Mock data per i sistemi supportati (in un'implementazione reale verrebbe da un'API)
const supportedSystems = [
  { id: 'registro1', name: 'ClasseViva', icon: '📚' },
  { id: 'registro2', name: 'Argo', icon: '📝' },
  { id: 'registro3', name: 'Nuvola', icon: '☁️' },
  { id: 'registro4', name: 'Axios', icon: '📊' },
  { id: 'registro5', name: 'Spaggiari', icon: '📘' }
];

const SystemIntegrations = () => {
  const [activeTab, setActiveTab] = useState('registri');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectedSystems, setConnectedSystems] = useState([]);
  const [testStatus, setTestStatus] = useState(null);

  const handleSystemSelect = (e) => {
    setSelectedSystem(e.target.value);
    setTestStatus(null);
  };

  const testConnection = () => {
    // Simulazione di test di connessione
    setTestStatus('testing');
    setTimeout(() => {
      const success = Math.random() > 0.3; // Simulazione di successo/errore
      setTestStatus(success ? 'success' : 'error');
    }, 1500);
  };

  const connectSystem = () => {
    // Simulazione di connessione del sistema
    if (!selectedSystem || !apiKey) return;
    
    const systemInfo = supportedSystems.find(s => s.id === selectedSystem);
    
    if (systemInfo) {
      setConnectedSystems([...connectedSystems, {
        id: systemInfo.id,
        name: systemInfo.name,
        icon: systemInfo.icon,
        status: 'active',
        connectedAt: new Date().toLocaleDateString()
      }]);
      
      // Reset form
      setSelectedSystem('');
      setApiKey('');
      setTestStatus(null);
    }
  };

  const disconnectSystem = (systemId) => {
    setConnectedSystems(connectedSystems.filter(s => s.id !== systemId));
  };

  return (
    <div className="system-integrations">
      <h2>Integrazione con sistemi scolastici</h2>
      
      <p className="integration-intro">
        Connetti questa piattaforma educativa con i sistemi già in uso nella tua scuola, 
        come registri elettronici e piattaforme di e-learning, per un'esperienza più completa e integrata.
      </p>
      
      <div className="integrations-tabs">
        <div 
          className={`integration-tab ${activeTab === 'registri' ? 'active' : ''}`}
          onClick={() => setActiveTab('registri')}
        >
          Registri elettronici
        </div>
        <div 
          className={`integration-tab ${activeTab === 'lms' ? 'active' : ''}`}
          onClick={() => setActiveTab('lms')}
        >
          Piattaforme LMS
        </div>
        <div 
          className={`integration-tab ${activeTab === 'altro' ? 'active' : ''}`}
          onClick={() => setActiveTab('altro')}
        >
          Altri sistemi
        </div>
      </div>
      
      <div className="integration-content">
        <div className="integration-form">
          <h3>Aggiungi una nuova integrazione</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="system-select">Sistema da integrare</label>
              <select 
                id="system-select"
                value={selectedSystem}
                onChange={handleSystemSelect}
              >
                <option value="">Seleziona un sistema...</option>
                {supportedSystems.map(system => (
                  <option key={system.id} value={system.id}>
                    {system.icon} {system.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group api-key-field">
              <label htmlFor="api-key">API Key / Token di accesso</label>
              <input 
                id="api-key" 
                type={showApiKey ? "text" : "password"}
                className="api-key-input"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Inserisci la tua API key o token"
              />
              <button 
                type="button" 
                className="show-key-toggle"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          
          {testStatus === 'testing' && (
            <div className="test-status testing">
              Test di connessione in corso...
            </div>
          )}
          
          {testStatus === 'success' && (
            <div className="test-status success">
              Connessione riuscita! Il sistema è raggiungibile.
            </div>
          )}
          
          {testStatus === 'error' && (
            <div className="test-status error">
              Errore di connessione. Verifica la tua API key e riprova.
            </div>
          )}
          
          <div className="form-actions">
            <button 
              className="test-connection" 
              disabled={!selectedSystem || !apiKey}
              onClick={testConnection}
            >
              Testa connessione
            </button>
            <button 
              className="connect-button" 
              disabled={!selectedSystem || !apiKey || testStatus !== 'success'}
              onClick={connectSystem}
            >
              Connetti sistema
            </button>
          </div>
        </div>
        
        <div className="connected-systems">
          <h3>Sistemi connessi</h3>
          
          {connectedSystems.length > 0 ? (
            <div className="systems-list">
              {connectedSystems.map(system => (
                <div key={system.id} className="system-card">
                  <div className="system-name">
                    <div className="system-icon">{system.icon}</div>
                    <div className="system-title">{system.name}</div>
                  </div>
                  
                  <div className="system-info">
                    <p>Connesso il: {system.connectedAt}</p>
                  </div>
                  
                  <div className="system-status">
                    <div className={`status-indicator status-${system.status}`}></div>
                    <span className="status-text">
                      {system.status === 'active' ? 'Attivo' : 
                       system.status === 'inactive' ? 'Inattivo' : 'Errore'}
                    </span>
                  </div>
                  
                  <div className="system-actions">
                    <button 
                      className="system-action" 
                      title="Sincronizza"
                      onClick={() => alert(`Sincronizzazione con ${system.name} avviata.`)}
                    >
                      🔄
                    </button>
                    <button 
                      className="system-action" 
                      title="Disconnetti"
                      onClick={() => disconnectSystem(system.id)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-systems">
              Nessun sistema connesso. Utilizza il form sopra per integrare un sistema.
            </p>
          )}
        </div>
      </div>
      
      <div className="integration-help">
        <p>
          Hai bisogno di assistenza con l'integrazione? Consulta la 
          <a href="/guide/integrations"> guida alle integrazioni</a> o 
          <a href="/support"> contatta il supporto tecnico</a>.
        </p>
      </div>
    </div>
  );
};

export default SystemIntegrations;