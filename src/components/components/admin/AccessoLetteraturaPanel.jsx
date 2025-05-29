/* eslint-disable react/no-unescaped-entities */
// src/components/admin/AccessoLetteraturaPanel.jsx
import React, { useState, useEffect } from 'react';
import { concediAccessoLetteratura } from '../../../services/progressService';
import './AccessoLetteraturaPanel.css';

/**
 * Pannello di amministrazione per docenti per gestire gli accessi alla sezione Letteratura
 */
const AccessoLetteraturaPanel = ({ classi = [], studenti = [] }) => {
  const [classeSelezionata, setClasseSelezionata] = useState('');
  const [studentiSelezionati, setStudentiSelezionati] = useState([]);
  const [cercaStudente, setCercaStudente] = useState('');
  const [risultatiRicerca, setRisultatiRicerca] = useState([]);
  const [messaggioSuccesso, setMessaggioSuccesso] = useState('');
  const [messaggioErrore, setMessaggioErrore] = useState('');
  const [requisiti, setRequisiti] = useState({
    lettura: 3,
    scrittura: 3,
    punteggiatura: 2,
    registri: 3,
    torneo: 1,
    dojo: 2,
    livello: 'arancione'
  });
  const [modificaRequisitiAttiva, setModificaRequisitiAttiva] = useState(false);

  // Filtra gli studenti in base alla classe selezionata
  const studentiPerClasse = classeSelezionata
    ? studenti.filter(s => s.classe === classeSelezionata)
    : [];

  // Effettua la ricerca quando il termine di ricerca cambia
  useEffect(() => {
    if (cercaStudente.trim() === '') {
      setRisultatiRicerca([]);
      return;
    }

    const termineRicerca = cercaStudente.toLowerCase();
    const risultati = studenti.filter(studente => 
      studente.nome.toLowerCase().includes(termineRicerca) ||
      studente.cognome.toLowerCase().includes(termineRicerca) ||
      studente.id.toLowerCase().includes(termineRicerca)
    );

    setRisultatiRicerca(risultati);
  }, [cercaStudente, studenti]);

  // Gestisce la selezione/deselezione di tutti gli studenti di una classe
  const selezionaTuttiStudentiClasse = (seleziona) => {
    if (seleziona) {
      const nuoviSelezionati = [...studentiSelezionati];
      studentiPerClasse.forEach(studente => {
        if (!nuoviSelezionati.includes(studente.id)) {
          nuoviSelezionati.push(studente.id);
        }
      });
      setStudentiSelezionati(nuoviSelezionati);
    } else {
      const nuoviSelezionati = studentiSelezionati.filter(
        id => !studentiPerClasse.some(studente => studente.id === id)
      );
      setStudentiSelezionati(nuoviSelezionati);
    }
  };

  // Gestisce la selezione/deselezione di un singolo studente
  const toggleSelezioneStudente = (studenteId) => {
    setStudentiSelezionati(prev => {
      if (prev.includes(studenteId)) {
        return prev.filter(id => id !== studenteId);
      } else {
        return [...prev, studenteId];
      }
    });
  };

  // Concede l'accesso agli studenti selezionati
  const concediAccesso = async () => {
    if (studentiSelezionati.length === 0) {
      setMessaggioErrore('Seleziona almeno uno studente.');
      setTimeout(() => setMessaggioErrore(''), 3000);
      return;
    }

    try {
      // In una vera implementazione, eseguiresti una chiamata API
      // per concedere l'accesso a ciascuno studente selezionato

      for (const studenteId of studentiSelezionati) {
        await concediAccessoLetteratura(studenteId);
      }

      setMessaggioSuccesso(`Accesso concesso a ${studentiSelezionati.length} studenti.`);
      setTimeout(() => setMessaggioSuccesso(''), 3000);
      setStudentiSelezionati([]);
      
    } catch (error) {
      console.error('Errore durante la concessione dell\'accesso:', error);
      setMessaggioErrore('Si è verificato un errore. Riprova più tardi.');
      setTimeout(() => setMessaggioErrore(''), 3000);
    }
  };

  // Salva le modifiche ai requisiti
  const salvaRequisiti = () => {
    // In una vera implementazione, qui salveresti i requisiti aggiornati
    // attraverso una chiamata API al backend

    setMessaggioSuccesso('Requisiti aggiornati con successo.');
    setTimeout(() => setMessaggioSuccesso(''), 3000);
    setModificaRequisitiAttiva(false);
  };

  // Annulla le modifiche ai requisiti
  const annullaModificaRequisiti = () => {
    // Ripristina i valori originali
    setRequisiti({
      lettura: 3,
      scrittura: 3,
      punteggiatura: 2,
      registri: 3,
      torneo: 1,
      dojo: 2,
      livello: 'arancione'
    });
    setModificaRequisitiAttiva(false);
  };

  return (
    <div className="accesso-letteratura-panel">
      <h2>Gestione Accessi alla Biblioteca dei Maestri</h2>
      
      {messaggioSuccesso && (
        <div className="messaggio-successo">{messaggioSuccesso}</div>
      )}
      
      {messaggioErrore && (
        <div className="messaggio-errore">{messaggioErrore}</div>
      )}
      
      <div className="requisiti-section">
        <h3>Requisiti di Accesso</h3>
        <div className="requisiti-container">
          <div className="requisiti-list">
            <div className="requisito-item">
              <span className="requisito-label">Sigillo della Parola:</span>
              {modificaRequisitiAttiva ? (
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={requisiti.lettura} 
                  onChange={(e) => setRequisiti({...requisiti, lettura: parseInt(e.target.value)})}
                />
              ) : (
                <span className="requisito-value">{requisiti.lettura} esercizi di lettura con punteggio > 80%</span>
              )}
            </div>
            
            <div className="requisito-item">
              <span className="requisito-label">Sigillo della Penna:</span>
              {modificaRequisitiAttiva ? (
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={requisiti.scrittura}
                  onChange={(e) => setRequisiti({...requisiti, scrittura: parseInt(e.target.value)})}
                />
              ) : (
                <span className="requisito-value">{requisiti.scrittura} esercizi di scrittura valutati positivamente</span>
              )}
            </div>
            
            <div className="requisito-item">
              <span className="requisito-label">Sigillo dei Segni:</span>
              {modificaRequisitiAttiva ? (
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={requisiti.punteggiatura}
                  onChange={(e) => setRequisiti({...requisiti, punteggiatura: parseInt(e.target.value)})}
                />
              ) : (
                <span className="requisito-value">{requisiti.punteggiatura} esercizi di punteggiatura avanzati</span>
              )}
            </div>
            
            <div className="requisito-item">
              <span className="requisito-label">Sigillo delle Voci:</span>
              {modificaRequisitiAttiva ? (
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={requisiti.registri}
                  onChange={(e) => setRequisiti({...requisiti, registri: parseInt(e.target.value)})}
                />
              ) : (
                <span className="requisito-value">{requisiti.registri} registri linguistici usati correttamente</span>
              )}
            </div>
            
            <div className="requisito-item">
              <span className="requisito-label">Sigillo del Torneo:</span>
              {modificaRequisitiAttiva ? (
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  value={requisiti.torneo}
                  onChange={(e) => setRequisiti({...requisiti, torneo: parseInt(e.target.value)})}
                />
              ) : (
                <span className="requisito-value">{requisiti.torneo} tornei completati</span>
              )}
            </div>
            
            <div className="requisito-item">
              <span className="requisito-label">Sigillo della Conoscenza:</span>
              {modificaRequisitiAttiva ? (
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={requisiti.dojo}
                  onChange={(e) => setRequisiti({...requisiti, dojo: parseInt(e.target.value)})}
                />
              ) : (
                <span className="requisito-value">{requisiti.dojo} compagni aiutati nel Dojo</span>
              )}
            </div>
            
            <div className="requisito-item">
              <span className="requisito-label">Sigillo del Maestro:</span>
              {modificaRequisitiAttiva ? (
                <select 
                  value={requisiti.livello}
                  onChange={(e) => setRequisiti({...requisiti, livello: e.target.value})}
                >
                  <option value="bianca">Cintura Bianca</option>
                  <option value="gialla">Cintura Gialla</option>
                  <option value="arancione">Cintura Arancione</option>
                  <option value="verde">Cintura Verde</option>
                  <option value="blu">Cintura Blu</option>
                  <option value="marrone">Cintura Marrone</option>
                  <option value="nera">Cintura Nera</option>
                </select>
              ) : (
                <span className="requisito-value">Cintura {requisiti.livello.charAt(0).toUpperCase() + requisiti.livello.slice(1)}</span>
              )}
            </div>
          </div>
          
          <div className="requisiti-actions">
            {modificaRequisitiAttiva ? (
              <>
                <button className="btn-salva-requisiti" onClick={salvaRequisiti}>
                  Salva Modifiche
                </button>
                <button className="btn-annulla-requisiti" onClick={annullaModificaRequisiti}>
                  Annulla
                </button>
              </>
            ) : (
              <button className="btn-modifica-requisiti" onClick={() => setModificaRequisitiAttiva(true)}>
                Modifica Requisiti
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="accesso-section">
        <h3>Concedi Accesso alla Biblioteca</h3>
        
        <div className="accesso-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Cerca studente..."
              value={cercaStudente}
              onChange={(e) => setCercaStudente(e.target.value)}
              className="search-input"
            />
            {risultatiRicerca.length > 0 && (
              <div className="search-results">
                {risultatiRicerca.map(studente => (
                  <div 
                    key={studente.id} 
                    className={`search-result-item ${studentiSelezionati.includes(studente.id) ? 'selected' : ''}`}
                    onClick={() => toggleSelezioneStudente(studente.id)}
                  >
                    <span className="student-name">{studente.nome} {studente.cognome}</span>
                    <span className="student-class">Classe {studente.classe}</span>
                    {studentiSelezionati.includes(studente.id) && (
                      <span className="check-icon">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="class-selector">
            <select 
              value={classeSelezionata}
              onChange={(e) => setClasseSelezionata(e.target.value)}
              className="class-select"
            >
              <option value="">Seleziona una classe</option>
              {classi.map(classe => (
                <option key={classe.id} value={classe.id}>
                  {classe.nome}
                </option>
              ))}
            </select>
            
            {classeSelezionata && (
              <div className="select-all-container">
                <label>
                  <input 
                    type="checkbox" 
                    checked={studentiPerClasse.every(s => studentiSelezionati.includes(s.id))}
                    onChange={(e) => selezionaTuttiStudentiClasse(e.target.checked)}
                  />
                  Seleziona tutti gli studenti della classe
                </label>
              </div>
            )}
          </div>
        </div>
        
        {classeSelezionata && studentiPerClasse.length > 0 && (
          <div className="studenti-lista">
            <h4>Studenti della classe {classi.find(c => c.id === classeSelezionata)?.nome}</h4>
            <div className="studenti-grid">
              {studentiPerClasse.map(studente => (
                <div 
                  key={studente.id} 
                  className={`studente-card ${studentiSelezionati.includes(studente.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelezioneStudente(studente.id)}
                >
                  <div className="studente-info">
                    <div className="studente-nome">{studente.nome} {studente.cognome}</div>
                    <div className="studente-level">Livello: {studente.livello}</div>
                  </div>
                  {studente.accessoLetteraturaCompletato ? (
                    <div className="accesso-concesso">
                      Accesso già concesso
                    </div>
                  ) : (
                    <div className="checkbox-container">
                      <input 
                        type="checkbox"
                        checked={studentiSelezionati.includes(studente.id)}
                        onChange={() => toggleSelezioneStudente(studente.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="concedi-accesso-container">
          <button 
            className="btn-concedi-accesso"
            disabled={studentiSelezionati.length === 0}
            onClick={concediAccesso}
          >
            Concedi Accesso agli Studenti Selezionati
          </button>
          <div className="studenti-selezionati-counter">
            {studentiSelezionati.length} studenti selezionati
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoLetteraturaPanel;