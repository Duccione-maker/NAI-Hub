/* eslint-disable react/no-unescaped-entities */
// In Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DashboardStyles.css';
import BeltDisplay from '../common/BeltDisplay/BeltDisplay';
import PergamenaSigillata from '../PergamenaSigillata/PergamenaSigillata';
import { updateUserProfile } from '../../../services/apiService'; // Percorso corretto per la nuova struttura

const Dashboard = ({ userProfile }) => {
  // Dati di esempio
  const studentLevel = userProfile?.level || 2;
  const progressToNextLevel = userProfile?.progress || 65;
  
  // Stato per gestire lo sblocco della sezione letteratura
  const [accessoLetteraturaCompletato, setAccessoLetteraturaCompletato] = useState(false);

  // Verifica lo stato dell'accesso alla letteratura all'avvio
  useEffect(() => {
    if (userProfile && userProfile.accessoLetteraturaCompletato) {
      setAccessoLetteraturaCompletato(true);
    }
  }, [userProfile]);

  // Funzione per gestire il completamento dell'accesso
  const handleAccessoCompletato = () => {
    // Aggiorna lo stato locale
    setAccessoLetteraturaCompletato(true);
    
    // Aggiorna il profilo utente nel backend
    updateUserProfile({
      ...userProfile,
      accessoLetteraturaCompletato: true
    });
  };
  
  return (
    <div className="dashboard">
      
      <h2 className="welcome-title">Benvenuto al Dojo della Lingua, {userProfile?.name || 'Studente'}</h2>
      
      <BeltDisplay level={studentLevel} progress={progressToNextLevel} />
      
      <div className="dashboard-sections">
        <div className="tatami-card">
          <h3><span className="section-icon">📚</span> Il tuo percorso</h3>
          <p>Continua il tuo allenamento linguistico da dove avevi interrotto.</p>
          <button className="kai-button">Riprendi gli esercizi</button>
        </div>
        
        <div className="tatami-card">
          <h3><span className="section-icon">🏆</span> Prossimi obiettivi</h3>
          <p>Raggiungi questi traguardi per avanzare al livello successivo.</p>
          <ul className="objectives-list">
            <li>Completa 5 esercizi di lettura assistita</li>
            <li>Raggiungere l'80% di precisione nella punteggiatura</li>
            <li>Completa una sfida nel torneo Lingua Kai</li>
          </ul>
        </div>
        
        <div className="tatami-card">
          <h3><span className="section-icon">🥋</span> Le tue medaglie</h3>
          <div className="medals-showcase">
            {/* Qui potresti mostrare le medaglie o badge guadagnati */}
          </div>
        </div>
      </div>
      
      {/* Sezione Pergamena Sigillata */}
      <div className="sezione-pergamena">
        <h2 className="sezione-titolo">La Biblioteca dei Maestri</h2>
        
        {accessoLetteraturaCompletato ? (
          <div className="biblioteca-sbloccata">
            <div className="biblioteca-messaggio">
              <p>Hai sbloccato l'accesso alla Biblioteca dei Maestri!</p>
              <p>Esplora i grandi classici della letteratura e scopri i segreti delle figure retoriche.</p>
            </div>
            <Link to="/letteratura" className="button-biblioteca">
              Accedi alla Biblioteca
            </Link>
          </div>
        ) : (
          <PergamenaSigillata 
            userProfile={userProfile} 
            onAccessoCompletato={handleAccessoCompletato} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;