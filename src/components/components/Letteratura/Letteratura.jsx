// src/components/Letteratura/Letteratura.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTestiPerLivello } from '../../data/letteraturaDatabase';
// Modifica il percorso di importazione di BeltDisplay in base alla tua struttura di progetto
import BeltDisplay from '../common/BeltDisplay/BeltDisplay';
import './LetteraturaStyle.css';

const Letteratura = ({ userProfile }) => {
  const [testiDisponibili, setTestiDisponibili] = useState({ prosa: [], poesia: [] });
  const [categoriaAttiva, setCategoriaAttiva] = useState('prosa');
  const navigate = useNavigate();
  
  // Calcola livello studente basato sul sistema delle cinture karate
  const studentLevel = userProfile?.level || 1;
  const progressToNextLevel = userProfile?.progress || 50;
  
  // Mappa livelli di cintura a livelli di letteratura
  const mapBeltToLiteratureLevel = (beltLevel) => {
    // 1-2 = base, 3-4 = intermedio, 5-6 = avanzato
    if (beltLevel <= 2) return 1;
    if (beltLevel <= 4) return 2;
    return 3;
  };
  
  // Carica i testi appropriati in base al livello
  useEffect(() => {
    const livelloLetteratura = mapBeltToLiteratureLevel(studentLevel);
    const testi = getTestiPerLivello(livelloLetteratura);
    setTestiDisponibili(testi);
  }, [studentLevel]);
  
  // Apri un testo specifico
  const apriTesto = (id) => {
    navigate(`/letteratura/testo/${id}`);
  };
  
  return (
    <div className="letteratura">
      <h2 className="section-title">Il Dojo della Letteratura</h2>
      
      <div className="progress-section">
        <BeltDisplay level={studentLevel} progress={progressToNextLevel} />
        <p className="progress-info">
          Il tuo livello attuale ti permette di accedere a 
          <strong> {testiDisponibili.prosa.length + testiDisponibili.poesia.length} opere letterarie</strong>.
          Continua ad allenarti per sbloccare testi più avanzati!
        </p>
      </div>
      
      <div className="category-selector">
        <button 
          className={`category-btn ${categoriaAttiva === 'prosa' ? 'active' : ''}`}
          onClick={() => setCategoriaAttiva('prosa')}
        >
          Prosa
        </button>
        <button 
          className={`category-btn ${categoriaAttiva === 'poesia' ? 'active' : ''}`}
          onClick={() => setCategoriaAttiva('poesia')}
        >
          Poesia
        </button>
      </div>
      
      <div className="testi-container">
        {testiDisponibili[categoriaAttiva].map((testo) => (
          <div key={testo.id} className="tatami-card testo-card">
            <h3 className="testo-titolo">{testo.titolo}</h3>
            <h4 className="testo-autore">{testo.autore}</h4>
            <div className="testo-meta">
              <span className="testo-periodo">{testo.periodo}</span>
              <span className={`testo-difficolta livello-${testo.livelloDifficolta}`}>
                {testo.livelloDifficolta === 1 ? 'Base' : 
                 testo.livelloDifficolta === 2 ? 'Intermedio' : 'Avanzato'}
              </span>
            </div>
            <p className="testo-estratto">{testo.estratto}</p>
            <div className="testo-temi">
              {testo.temiPrincipali.map((tema, index) => (
                <span key={index} className="tema-tag">{tema}</span>
              ))}
            </div>
            <button 
              className="kai-button"
              onClick={() => apriTesto(testo.id)}
            >
              Leggi e Analizza
            </button>
          </div>
        ))}
      </div>
      
      {testiDisponibili[categoriaAttiva].length === 0 && (
        <div className="no-testi-message">
          <p>Non ci sono ancora testi disponibili per il tuo livello in questa categoria.</p>
          <p>Continua ad allenarti nelle altre sezioni per avanzare di livello!</p>
        </div>
      )}
    </div>
  );
};

export default Letteratura;