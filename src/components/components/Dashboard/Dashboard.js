/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DashboardStyles.css';
import BeltDisplay from '../common/BeltDisplay/BeltDisplay';
import PergamenaSigillata from '../PergamenaSigillata/PergamenaSigillata';
import { updateUserProfile } from '../../../services/apiService';

const Dashboard = ({ userProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Stati per sistema cinture
  const [currentBelt, setCurrentBelt] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newBeltData, setNewBeltData] = useState(null);
  const [qcerLevel, setQcerLevel] = useState(null);
  
  // Stati esistenti
  const studentLevel = userProfile?.level || 2;
  const progressToNextLevel = userProfile?.progress || 65;
  const [accessoLetteraturaCompletato, setAccessoLetteraturaCompletato] = useState(false);

  // Mapping QCER → Cinture Karate
  const qcerToBelt = {
    'A1': { belt: 'yellow', name: 'Cintura Gialla', color: '#FFD700', nextLevel: 'A2', progress: 0 },
    'A2': { belt: 'orange', name: 'Cintura Arancione', color: '#FFA500', nextLevel: 'B1', progress: 20 },
    'B1': { belt: 'green', name: 'Cintura Verde', color: '#32CD32', nextLevel: 'B2', progress: 40 },
    'B2': { belt: 'blue', name: 'Cintura Blu', color: '#4169E1', nextLevel: 'C1', progress: 60 },
    'C1': { belt: 'brown', name: 'Cintura Marrone', color: '#8B4513', nextLevel: 'C2', progress: 80 },
    'C2': { belt: 'black', name: 'Cintura Nera', color: '#000000', nextLevel: null, progress: 100 }
  };

  // Carica dati cintura all'avvio
  useEffect(() => {
    // Controlla se arrivi dal test con nuova cintura
    if (location.state?.newBelt && location.state?.isFirstTest) {
      const newBelt = location.state.newBelt;
      const level = location.state.qcerLevel;
      
      setNewBeltData(newBelt);
      setQcerLevel(level);
      setCurrentBelt(newBelt);
      setShowCelebration(true);
      
      // Salva nel localStorage
      localStorage.setItem('userQCERLevel', level);
      localStorage.setItem('userBelt', JSON.stringify(newBelt));
      
      // Nasconde celebrazione dopo 6 secondi
      setTimeout(() => setShowCelebration(false), 6000);
      
      // Aggiorna profilo utente
      updateUserProfile({
        ...userProfile,
        qcerLevel: level,
        currentBelt: newBelt,
        testCompletedAt: new Date().toISOString()
      });
      
    } else {
      // Carica dati esistenti
      loadUserBeltData();
    }
    
    // Controlla accesso letteratura
    if (userProfile && userProfile.accessoLetteraturaCompletato) {
      setAccessoLetteraturaCompletato(true);
    }
  }, [location.state, userProfile]);

  const loadUserBeltData = () => {
    const storedLevel = localStorage.getItem('userQCERLevel');
    const storedBelt = localStorage.getItem('userBelt');
    
    if (storedLevel && storedBelt) {
      setQcerLevel(storedLevel);
      setCurrentBelt(JSON.parse(storedBelt));
    }
  };

  const handleAccessoCompletato = () => {
    setAccessoLetteraturaCompletato(true);
    updateUserProfile({
      ...userProfile,
      accessoLetteraturaCompletato: true
    });
  };

  const goToTest = () => {
    navigate('/test-ingresso');
  };

  // Componente Celebrazione Cintura
  const BeltCelebration = ({ belt, level }) => (
    <div className="belt-celebration-overlay">
      <div className="celebration-modal">
        <div className="celebration-fireworks">✨🎉✨</div>
        <div className="celebration-content">
          <h1 className="celebration-title">🎉 CONGRATULAZIONI! 🎉</h1>
          <div className="belt-display-large">
            <div 
              className={`belt-visual ${belt.belt}`}
              style={{ 
                backgroundColor: belt.color,
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                margin: '0 auto 1rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                animation: 'beltGlow 2s ease-in-out infinite alternate'
              }}
            >
              🥋
            </div>
            <h2 style={{ color: belt.color, fontSize: '2rem', margin: '1rem 0' }}>
              {belt.name}
            </h2>
            <p className="qcer-level-badge">
              Livello QCER: <strong>{level}</strong>
            </p>
          </div>
          <div className="celebration-message">
            <p>🏆 Hai completato il test di ingresso!</p>
            <p>🚀 La tua avventura linguistica inizia ora!</p>
            <p>💪 Allenati nelle sezioni per salire di livello!</p>
          </div>
          <button 
            className="start-journey-btn"
            onClick={() => setShowCelebration(false)}
          >
            🥋 Inizia l'Allenamento
          </button>
        </div>
      </div>
    </div>
  );

  // Componente Status Cintura Attuale
  const CurrentBeltStatus = ({ belt, level }) => {
    const nextBelt = belt.nextLevel ? qcerToBelt[belt.nextLevel] : null;
    const currentProgress = progressToNextLevel; // Usa il progress esistente
    
    return (
      <div className="current-belt-section">
        <div className="belt-status-card">
          <div className="belt-current-display">
            <div 
              className={`belt-icon-large ${belt.belt}`}
              style={{ backgroundColor: belt.color }}
            >
              🥋
            </div>
            <div className="belt-info">
              <h3 className="belt-name">{belt.name}</h3>
              <div className="qcer-badge">QCER {level}</div>
              <div className="belt-description">
                {level === 'A1' && "Livello Principiante - Basi della lingua"}
                {level === 'A2' && "Livello Elementare - Comunicazione semplice"}
                {level === 'B1' && "Livello Intermedio - Autonomia linguistica"}
                {level === 'B2' && "Livello Intermedio Superiore - Fluidità"}
                {level === 'C1' && "Livello Avanzato - Padronanza"}
                {level === 'C2' && "Maestria Completa - Eccellenza"}
              </div>
            </div>
          </div>
          
          {nextBelt && (
            <div className="progression-section">
              <div className="next-belt-target">
                <span className="progression-arrow">→</span>
                <div className="next-belt-info">
                  <div 
                    className={`belt-icon-small ${nextBelt.belt}`}
                    style={{ backgroundColor: nextBelt.color }}
                  >
                    🥋
                  </div>
                  <div>
                    <h4>{nextBelt.name}</h4>
                    <div className="qcer-badge small">QCER {belt.nextLevel}</div>
                  </div>
                </div>
              </div>
              
              <div className="progression-bar">
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${currentProgress}%`,
                      backgroundColor: nextBelt.color 
                    }}
                  ></div>
                </div>
                <p className="progress-text">
                  {currentProgress}% verso {nextBelt.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente Invito al Test (se non ha cintura)
  const TestInvitation = () => (
    <div className="test-invitation-card">
      <div className="invitation-content">
        <div className="invitation-icon">🎯</div>
        <h2>Inizia il Tuo Percorso Karate Linguistico</h2>
        <p>
          Completa il test di ingresso QCER per ottenere la tua prima cintura 
          e iniziare il percorso personalizzato di apprendimento.
        </p>
        <p className="invitation-subtitle">
          ⏱️ 10-15 minuti | 🏆 Cintura garantita | 🎯 Percorso personalizzato
        </p>
        <button className="test-cta-btn" onClick={goToTest}>
          🥋 Fai il Test di Ingresso QCER
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Celebrazione Cintura */}
      {showCelebration && newBeltData && (
        <BeltCelebration belt={newBeltData} level={qcerLevel} />
      )}

      {/* Header con Cintura o Invito Test */}
      <div className="dashboard-header-section">
        <h2 className="welcome-title">
          🏛️ Benvenuto al Dojo della Lingua, {userProfile?.name || 'Studente'}
        </h2>
        
        {currentBelt && qcerLevel ? (
          <CurrentBeltStatus belt={currentBelt} level={qcerLevel} />
        ) : (
          <TestInvitation />
        )}
      </div>

      {/* BeltDisplay esistente (manteniamo per compatibilità) */}
      {!currentBelt && (
        <BeltDisplay level={studentLevel} progress={progressToNextLevel} />
      )}
      
      <div className="dashboard-sections">
        <div className="tatami-card">
          <h3><span className="section-icon">📚</span> Il tuo percorso</h3>
          <p>Continua il tuo allenamento linguistico da dove avevi interrotto.</p>
          {currentBelt ? (
            <div className="percorso-info">
              <p className="current-focus">
                <strong>Focus attuale ({qcerLevel}):</strong>
                {qcerLevel === 'A1' && " Vocabolario base e frasi semplici"}
                {qcerLevel === 'A2' && " Comunicazione quotidiana e grammatica elementare"}
                {qcerLevel === 'B1' && " Comprensione testi e espressione fluida"}
                {qcerLevel === 'B2' && " Testi complessi e argomentazioni"}
                {qcerLevel === 'C1' && " Linguaggio avanzato e registri formali"}
                {qcerLevel === 'C2' && " Padronanza completa e sfumature"}
              </p>
              <button className="kai-button">Riprendi gli esercizi</button>
            </div>
          ) : (
            <button className="kai-button" onClick={goToTest}>
              Inizia con il Test
            </button>
          )}
        </div>
        
        <div className="tatami-card">
          <h3><span className="section-icon">🏆</span> Prossimi obiettivi</h3>
          <p>Raggiungi questi traguardi per avanzare al livello successivo.</p>
          <ul className="objectives-list">
            {currentBelt ? (
              <>
                <li>Completa 5 esercizi di lettura assistita per il tuo livello</li>
                <li>Raggiungi l'80% di precisione nella punteggiatura</li>
                <li>Completa una sfida nel Torneo Lingua Kai</li>
                {currentBelt.nextLevel && (
                  <li>🎯 Obiettivo: {qcerToBelt[currentBelt.nextLevel].name}</li>
                )}
              </>
            ) : (
              <>
                <li>🎯 Completa il test di ingresso QCER</li>
                <li>🥋 Ottieni la tua prima cintura</li>
                <li>📚 Inizia il percorso personalizzato</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="tatami-card">
          <h3><span className="section-icon">🥋</span> Le tue medaglie</h3>
          <div className="medals-showcase">
            {currentBelt && (
              <div className="medal-earned">
                <div 
                  className="medal-icon"
                  style={{ backgroundColor: currentBelt.color }}
                >
                  🏅
                </div>
                <span>Test QCER Completato</span>
              </div>
            )}
            {currentBelt && qcerLevel !== 'A1' && (
              <div className="medal-earned">
                <div className="medal-icon">🎖️</div>
                <span>Avanzamento di Livello</span>
              </div>
            )}
            {/* Placeholder per future medaglie */}
            <div className="medal-placeholder">
              <div className="medal-icon locked">🔒</div>
              <span>Maestro della Punteggiatura</span>
            </div>
            <div className="medal-placeholder">
              <div className="medal-icon locked">🔒</div>
              <span>Campione Torneo Kai</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sezione Pergamena Sigillata */}
      <div className="sezione-pergamena">
        <h2 className="sezione-titolo">📚 La Biblioteca dei Maestri</h2>
        
        {accessoLetteraturaCompletato ? (
          <div className="biblioteca-sbloccata">
            <div className="biblioteca-messaggio">
              <p>🎉 Hai sbloccato l'accesso alla Biblioteca dei Maestri!</p>
              <p>Esplora i grandi classici della letteratura e scopri i segreti delle figure retoriche.</p>
            </div>
            <Link to="/letteratura" className="button-biblioteca">
              📖 Accedi alla Biblioteca
            </Link>
          </div>
        ) : (
          <div className="pergamena-container">
            <div className="accesso-info">
              {currentBelt ? (
                <p>
                  🔐 <strong>Requisito per l'accesso:</strong> Raggiungi il livello {' '}
                  <span style={{ color: qcerToBelt['B1'].color }}>B1 (Cintura Verde)</span> {' '}
                  per sbloccare la Biblioteca dei Maestri.
                  {qcerLevel === 'A1' || qcerLevel === 'A2' ? (
                    <span className="progress-hint">
                      <br />💪 Continua ad allenarti per avanzare!
                    </span>
                  ) : (
                    <span className="ready-hint">
                      <br />🎉 Sei quasi pronto per l'accesso!
                    </span>
                  )}
                </p>
              ) : (
                <p>
                  🎯 Completa il test di ingresso per iniziare il percorso verso 
                  la Biblioteca dei Maestri.
                </p>
              )}
            </div>
            <PergamenaSigillata 
              userProfile={userProfile} 
              onAccessoCompletato={handleAccessoCompletato} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;