// src/components/Letteratura/TestoLetterario.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTestoById } from '../../data/letteraturaDatabase';
import './TestoLetterarioStyle.css';

const TestoLetterario = () => {
  const { id } = useParams();
  const [testo, setTesto] = useState(null);
  const [tab, setTab] = useState('testo'); // testo, analisi, esercizi, figure, crea
  const [selectedText, setSelectedText] = useState(null);
  const [figureSelezionate, setFigureSelezionate] = useState([]);
  const [feedback, setFeedback] = useState({ visible: false, correct: false, message: '' });
  const [evidenziaFigure, setEvidenziaFigure] = useState(false);
  const [punteggio, setPunteggio] = useState(0);
  const [livelloDifficolta, setLivelloDifficolta] = useState(1); // 1-3
  const [mostraAiuto, setMostraAiuto] = useState(false);
  const [figureRimaste, setFigureRimaste] = useState([]);
  const [testCompletato, setTestCompletato] = useState(false);
  const [figuraSelezionata, setFiguraSelezionata] = useState('');
  const [nuovoEsempio, setNuovoEsempio] = useState('');
  const [nuovaSpiegazione, setNuovaSpiegazione] = useState('');
  const [sfidaTab, setSfidaTab] = useState('mie');
  const [mieCreazioni, setMieCreazioni] = useState([]);
  const [creazioniDaValutare, setCreazioniDaValutare] = useState([]);
  const [indiceValutazione, setIndiceValutazione] = useState(0);
  const [valutazioneAttuale, setValutazioneAttuale] = useState(0);
  const [commentoValutazione, setCommentoValutazione] = useState('');
  const [classificaCreazioni, setClassificaCreazioni] = useState([]);
  const [filtroClassifica, setFiltroClassifica] = useState('all');
  
  // Lista delle figure retoriche raggruppate per livello di difficoltà
  const figurePossibili = {
    1: ['similitudine', 'metafora', 'anafora', 'enjambement'],
    2: ['ossimoro', 'iperbole', 'allitterazione', 'chiasmo'],
    3: ['sinestesia', 'metonimia', 'sineddoche', 'paronomasia', 'anastrofe']
  };
  
  useEffect(() => {
    const testoTrovato = getTestoById(id);
    if (testoTrovato) {
      setTesto(testoTrovato);
      
      // Inizializza le figure rimaste da trovare
      if (testoTrovato.figureRetoriche_posizioni) {
        setFigureRimaste(testoTrovato.figureRetoriche_posizioni.map(f => ({
          ...f,
          trovata: false
        })));
      }
    }
  }, [id]);
  
  if (!testo) {
    return <div className="loading">Caricamento testo in corso...</div>;
  }
  
  const isPoesia = testo.figureRetoriche !== undefined;
  
  // Funzione per filtrare le figure retoriche in base al livello di difficoltà
  const getFigurePerLivello = () => {
    let figure = [];
    for (let i = 1; i <= livelloDifficolta; i++) {
      figure = [...figure, ...figurePossibili[i]];
    }
    return figure;
  };
  
  // Funzione per ottenere la definizione di una figura retorica
  const getDefinizioneFigura = (tipo) => {
    const figura = testo.figureRetoriche.find(f => f.tipo === tipo);
    return figura ? figura.spiegazione : "Definizione non disponibile";
  };
  
  // Funzione per ottenere un esempio di una figura retorica
  const getEsempioFigura = (tipo) => {
    const figura = testo.figureRetoriche.find(f => f.tipo === tipo);
    return figura ? figura.esempio : "Esempio non disponibile";
  };
  
  // Gestisce la selezione del testo
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;
      
      setSelectedText({
        text: selection.toString(),
        start: startOffset,
        end: endOffset
      });
    }
  };
  
  // Gestisce la scelta di una figura retorica
  const handleFiguraSelection = (figura) => {
    if (!selectedText) return;
    
    // Verifica se la figura è corretta
    const figuraCorretta = testo.figureRetoriche.some(f => 
      f.tipo === figura && f.esempio.includes(selectedText.text)
    );
    
    // Trova l'informazione sulla figura per calcolare i punti
    const figuraInfo = figuraCorretta ? testo.figureRetoriche.find(f => 
      f.tipo === figura && f.esempio.includes(selectedText.text)
    ) : null;
    
    // Aggiungi alla lista delle figure selezionate
    const nuovaFigura = {
      tipo: figura,
      testo: selectedText.text,
      posizione: {
        inizio: selectedText.start,
        fine: selectedText.end
      },
      corretta: figuraCorretta
    };
    
    setFigureSelezionate([...figureSelezionate, nuovaFigura]);
    
    // Aggiorna punteggio
    if (figuraCorretta) {
      const puntiGuadagnati = figuraInfo?.punti || 5;
      setPunteggio(prev => prev + puntiGuadagnati);
      
      // Aggiorna figure rimaste
      const updatedFigureRimaste = figureRimaste.map(f => {
        if (f.tipo === figura && selectedText.text.includes(testo.testoCompleto.substring(f.inizio, f.fine))) {
          return { ...f, trovata: true };
        }
        return f;
      });
      setFigureRimaste(updatedFigureRimaste);
      
      // Verifica se tutte le figure sono state trovate
      const tutteRimaste = updatedFigureRimaste.every(f => f.trovata);
      if (tutteRimaste) {
        setTestCompletato(true);
      }
    }
    
    setSelectedText(null);
    
    // Mostra feedback
    setFeedback({
      visible: true,
      correct: figuraCorretta,
      message: figuraCorretta 
        ? `Corretto! Hai individuato una ${figura}. +${figuraInfo?.punti || 5} punti!` 
        : `Hmm, questa non sembra essere una ${figura}. Riprova!`
    });
    
    // Nascondi il feedback dopo 3 secondi
    setTimeout(() => {
      setFeedback({ visible: false, correct: false, message: '' });
    }, 3000);
  };
  
  // Invia una nuova creazione
  const submitCreazione = () => {
    const nuovaCreazione = {
      tipo: figuraSelezionata,
      esempio: nuovoEsempio,
      spiegazione: nuovaSpiegazione,
      data: new Date().toLocaleDateString(),
      rating: 0,
      feedback: []
    };
    
    setMieCreazioni([...mieCreazioni, nuovaCreazione]);
    
    // Reset del form
    setFiguraSelezionata('');
    setNuovoEsempio('');
    setNuovaSpiegazione('');
    
    // Feedback all'utente
    setFeedback({
      visible: true,
      correct: true,
      message: 'La tua creazione è stata inviata con successo e sarà valutata dagli altri studenti!'
    });
    
    setTimeout(() => {
      setFeedback({ visible: false, correct: false, message: '' });
    }, 3000);
  };
  
  // Funzione per saltare una valutazione
  const skipValutazione = () => {
    if (creazioniDaValutare.length > 0) {
      setIndiceValutazione((indiceValutazione + 1) % creazioniDaValutare.length);
      setValutazioneAttuale(0);
      setCommentoValutazione('');
    }
  };
  
  // Funzione per inviare una valutazione
  const submitValutazione = () => {
    // Logica per inviare la valutazione
    // In un'implementazione reale, questo aggiornerebbe un database
    
    // Feedback all'utente
    setFeedback({
      visible: true,
      correct: true,
      message: 'Grazie per la tua valutazione!'
    });
    
    setTimeout(() => {
      setFeedback({ visible: false, correct: false, message: '' });
      skipValutazione();
    }, 1500);
  };
  
  // Renderizza il testo con le figure retoriche evidenziate
  const renderTestoConFigure = () => {
    if (!testo.figureRetoriche_posizioni || (!evidenziaFigure && tab !== 'figure')) {
      return isPoesia ? (
        <pre className="poesia-text" onMouseUp={tab === 'figure' ? handleTextSelection : undefined}>
          {testo.testoCompleto}
        </pre>
      ) : (
        <p className="prosa-text" onMouseUp={tab === 'figure' ? handleTextSelection : undefined}>
          {testo.testoCompleto}
        </p>
      );
    }
    
    let currentPos = 0;
    const parts = [];
    const testoCompleto = testo.testoCompleto;
    
    // Ordina le posizioni per inizio
    const posizioni = [...testo.figureRetoriche_posizioni].sort((a, b) => a.inizio - b.inizio);
    
    posizioni.forEach((pos, index) => {
      // Aggiungi il testo prima della figura
      if (pos.inizio > currentPos) {
        parts.push(
          <span key={`text-${index}`}>
            {testoCompleto.substring(currentPos, pos.inizio)}
          </span>
        );
      }
      
      // Verifica se la figura è stata trovata (quando siamo in modalità esercizio)
      const figuraRimasta = tab === 'figure' ? figureRimaste.find(
        f => f.inizio === pos.inizio && f.fine === pos.fine
      ) : null;
      
      const evidenzia = tab === 'figure' 
        ? (figuraRimasta && figuraRimasta.trovata) 
        : true;
      
      // Aggiungi la figura evidenziata
      parts.push(
        <span 
          key={`figure-${index}`} 
          className={evidenzia ? `highlight-${pos.tipo}` : ''}
          title={evidenzia ? `${pos.tipo}: ${testo.figureRetoriche.find(f => f.tipo === pos.tipo)?.spiegazione}` : ''}
        >
          {testoCompleto.substring(pos.inizio, pos.fine)}
        </span>
      );
      
      currentPos = pos.fine;
    });
    
    // Aggiungi il resto del testo
    if (currentPos < testoCompleto.length) {
      parts.push(
        <span key="text-end">
          {testoCompleto.substring(currentPos)}
        </span>
      );
    }
    
    return isPoesia ? (
      <pre className="poesia-text" onMouseUp={tab === 'figure' ? handleTextSelection : undefined}>
        {parts}
      </pre>
    ) : (
      <p className="prosa-text" onMouseUp={tab === 'figure' ? handleTextSelection : undefined}>
        {parts}
      </p>
    );
  };
  
  // Verifica tutte le figure retoriche e termina l'esercizio
  const handleVerificaCompletamento = () => {
    // Mostra tutte le figure non trovate
    setEvidenziaFigure(true);
    
    // Calcola il punteggio finale
    const figureTrovate = figureRimaste.filter(f => f.trovata).length;
    const figureNonTrovate = figureRimaste.length - figureTrovate;
    
    // Aggiungi bonus per completamento se tutte le figure sono state trovate
    let punteggioFinale = punteggio;
    if (figureTrovate === figureRimaste.length) {
      punteggioFinale += 20; // Bonus completamento
    }
    
    // Visualizza risultato finale
    setFeedback({
      visible: true,
      correct: figureTrovate > figureNonTrovate,
      message: `Hai trovato ${figureTrovate} figure su ${figureRimaste.length}. Punteggio finale: ${punteggioFinale} punti.`
    });
    
    // Imposta il test come completato
    setTestCompletato(true);
  };
  
  return (
    <div className="testo-letterario-container">
      <Link to="/letteratura" className="back-link">
        &larr; Torna alla biblioteca
      </Link>
      
      <div className="testo-header">
        <h1 className="testo-titolo">{testo.titolo}</h1>
        <h2 className="testo-autore">{testo.autore}, {testo.anno}</h2>
        <div className="testo-meta">
          <span className="testo-periodo">{testo.periodo}</span>
          <span className={`testo-difficolta livello-${testo.livelloDifficolta}`}>
            {testo.livelloDifficolta === 1 ? 'Base' : 
             testo.livelloDifficolta === 2 ? 'Intermedio' : 'Avanzato'}
          </span>
        </div>
      </div>
      
      <div className="testo-tabs">
        <button 
          className={`tab-btn ${tab === 'testo' ? 'active' : ''}`}
          onClick={() => setTab('testo')}
        >
          Testo completo
        </button>
        <button 
          className={`tab-btn ${tab === 'analisi' ? 'active' : ''}`}
          onClick={() => setTab('analisi')}
        >
          Analisi
        </button>
        {isPoesia && (
          <button 
            className={`tab-btn ${tab === 'figure' ? 'active' : ''}`}
            onClick={() => {
              setTab('figure'); 
              setEvidenziaFigure(false);
              // Reset dell'esercizio se non completato
              if (!testCompletato) {
                setFigureSelezionate([]);
                setPunteggio(0);
                if (testo.figureRetoriche_posizioni) {
                  setFigureRimaste(testo.figureRetoriche_posizioni.map(f => ({
                    ...f,
                    trovata: false
                  })));
                }
              }
            }}
          >
            Figure Retoriche
          </button>
        )}
        {isPoesia && punteggio >= 50 && (
          <button 
            className={`tab-btn ${tab === 'crea' ? 'active' : ''}`}
            onClick={() => setTab('crea')}
          >
            Crea Figure
          </button>
        )}
        <button 
          className={`tab-btn ${tab === 'esercizi' ? 'active' : ''}`}
          onClick={() => setTab('esercizi')}
        >
          Esercizi
        </button>
      </div>
      
      <div className="testo-content">
        {tab === 'testo' && (
          <div className="testo-completo">
            {renderTestoConFigure()}
            
            {isPoesia && (
              <div className="testo-actions">
                <button 
                  className={`highlight-toggle ${evidenziaFigure ? 'active' : ''}`}
                  onClick={() => setEvidenziaFigure(!evidenziaFigure)}
                >
                  {evidenziaFigure ? 'Nascondi figure retoriche' : 'Evidenzia figure retoriche'}
                </button>
              </div>
            )}
          </div>
        )}
        
        {tab === 'analisi' && (
          <div className="testo-analisi">
            <h3>Analisi del testo</h3>
            <p>{testo.analisi}</p>
            
            <h3>Temi principali</h3>
            <ul className="temi-list">
              {testo.temiPrincipali.map((tema, index) => (
                <li key={index}>{tema}</li>
              ))}
            </ul>
            
            {isPoesia && (
              <>
                <h3>Figure retoriche</h3>
                <ul className="figure-list">
                  {testo.figureRetoriche.map((figura, index) => (
                    <li key={index}>
                      <strong>{figura.tipo}</strong>: "{figura.esempio}" - {figura.spiegazione}
                    </li>
                  ))}
                </ul>
              </>
            )}
            
            <h3>Parole chiave</h3>
            <div className="parole-chiave">
              {testo.paroleChiave.map((parola, index) => (
                <span key={index} className="parola-tag">{parola}</span>
              ))}
            </div>
          </div>
        )}
        
        {tab === 'figure' && isPoesia && (
          <div className="figure-retoriche-interactive">
            <div className="game-header">
              <h3>Identifica le Figure Retoriche</h3>
              <div className="game-controls">
                <div className="punteggio-display">
                  Punteggio: <span className="punteggio-value">{punteggio}</span>
                </div>
                <div className="difficulty-selector">
                  <label htmlFor="difficulty">Difficoltà:</label>
                  <select 
                    id="difficulty" 
                    value={livelloDifficolta}
                    onChange={(e) => setLivelloDifficolta(parseInt(e.target.value))}
                    disabled={figureSelezionate.length > 0 || testCompletato}
                  >
                    <option value={1}>Base</option>
                    <option value={2}>Intermedia</option>
                    <option value={3}>Avanzata</option>
                  </select>
                </div>
              </div>
            </div>
            
            <p className="instruction">
              Seleziona una parte del testo e poi scegli la figura retorica corrispondente.
              {!testCompletato && (
                <>
                  <br />
                  Trova tutte le figure retoriche presenti nel testo per completare l'esercizio!
                </>
              )}
            </p>
            
            <div className="interactive-content">
              <div className="text-selection-area">
                {renderTestoConFigure()}
              </div>
              
              {!testCompletato && (
                <div className="figure-selection">
                  <h4>Scegli una figura retorica:</h4>
                  {selectedText ? (
                    <div className="selected-text-info">
                      <p>Testo selezionato: <strong>"{selectedText.text}"</strong></p>
                      <div className="figure-buttons">
                        {getFigurePerLivello().map(figura => (
                          <button 
                            key={figura} 
                            className="figura-btn"
                            onClick={() => handleFiguraSelection(figura)}
                          >
                            {figura}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="selection-prompt">Seleziona prima una parte del testo.</p>
                  )}
                </div>
              )}
              
              {feedback.visible && (
                <div className={`feedback-message ${feedback.correct ? 'correct' : 'incorrect'}`}>
                  {feedback.message}
                </div>
              )}
              
              <div className="figure-results">
                <div className="results-header">
                  <h4>Figure identificate:</h4>
                  {!testCompletato && (
                    <button 
                      className={`help-toggle ${mostraAiuto ? 'active' : ''}`}
                      onClick={() => setMostraAiuto(!mostraAiuto)}
                    >
                      {mostraAiuto ? 'Nascondi aiuti' : 'Mostra aiuti'}
                    </button>
                  )}
                </div>
                
                {figureSelezionate.length > 0 ? (
                  <ul className="identified-figures">
                    {figureSelezionate.map((figura, index) => (
                      <li key={index} className={figura.corretta ? 'correct-figure' : 'incorrect-figure'}>
                        <span className="figura-tipo">{figura.tipo}</span>: 
                        <span className="figura-testo">"{figura.testo}"</span>
                        {figura.corretta && <span className="check-icon">✓</span>}
                        {!figura.corretta && <span className="wrong-icon">✗</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Non hai ancora identificato nessuna figura retorica.</p>
                )}
                
                {mostraAiuto && !testCompletato && (
                  <div className="aiuti-section">
                    <h5>Suggerimenti:</h5>
                    <ul className="aiuti-list">
                      {getFigurePerLivello().map(figura => {
                        const figuraInfo = testo.figureRetoriche.find(f => f.tipo === figura);
                        return figuraInfo ? (
                          <li key={figura} className="aiuto-item">
                            <span className="aiuto-figura">{figura}</span>: 
                            <span className="aiuto-definizione">{figuraInfo.spiegazione}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}
              </div>
              
              {testCompletato ? (
                <div className="test-completato">
                  <h4>Esercizio completato!</h4>
                  {testo.figureRetoriche_confronto && (
                    <div className="confronti-section">
                      <h5>Esempi di confronto da altri testi:</h5>
                      <ul className="confronti-list">
                        {testo.figureRetoriche_confronto.map((confronto, index) => (
                          <li key={index} className="confronto-item">
                            <strong>{confronto.figura}</strong> in "{confronto.opera}" di {confronto.autore}:
                            <blockquote className="confronto-esempio">
                              "{confronto.esempio}"
                            </blockquote>
                            <p className="confronto-spiegazione">{confronto.spiegazione}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button 
                    className="kai-button restart-btn"
                    onClick={() => {
                      setTestCompletato(false);
                      setFigureSelezionate([]);
                      setPunteggio(0);
                      if (testo.figureRetoriche_posizioni) {
                        setFigureRimaste(testo.figureRetoriche_posizioni.map(f => ({
                          ...f,
                          trovata: false
                        })));
                      }
                      setEvidenziaFigure(false);
                    }}
                  >
                    Riprova l'esercizio
                  </button>
                </div>
              ) : (
                <button 
                  className="kai-button check-all-btn"
                  onClick={handleVerificaCompletamento}
                >
                  Verifica tutte le figure
                </button>
              )}
            </div>
          </div>
        )}
        
        {tab === 'crea' && isPoesia && (
          <div className="crea-figure-container">
            <h3>Laboratorio di Creazione</h3>
            <p className="lab-description">
              Ora che hai imparato a riconoscere le figure retoriche, prova a crearne di tue!
              Le tue creazioni saranno valutate dagli altri studenti e potrai guadagnare punti extra.
            </p>
            
            <div className="creazione-form">
              <div className="form-section">
                <label htmlFor="figura-tipo">Tipo di figura retorica:</label>
                <select 
                  id="figura-tipo" 
                  value={figuraSelezionata} 
                  onChange={(e) => setFiguraSelezionata(e.target.value)}
                >
                  <option value="">Seleziona una figura...</option>
                  {getFigurePerLivello().map(figura => (
                    <option key={figura} value={figura}>{figura}</option>
                  ))}
                </select>
              </div>
              
              {figuraSelezionata && (
                <div className="form-section">
                  <label htmlFor="figura-esempio">La tua creazione:</label>
                  <textarea 
                    id="figura-esempio" 
                    placeholder={`Scrivi qui il tuo esempio di ${figuraSelezionata}...`}
                    value={nuovoEsempio}
                    onChange={(e) => setNuovoEsempio(e.target.value)}
                    rows={3}
                  ></textarea>
                  
                  <div className="figura-info">
                    <h4>Cos'è una {figuraSelezionata}?</h4>
                    <p>{getDefinizioneFigura(figuraSelezionata)}</p>
                    <div className="esempio-modello">
                      <strong>Esempio di riferimento:</strong>
                      <p>"{getEsempioFigura(figuraSelezionata)}"</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="form-section">
                <label htmlFor="figura-spiegazione">Spiega la tua creazione:</label>
                <textarea 
                  id="figura-spiegazione" 
                  placeholder="Spiega perché il tuo esempio è una buona rappresentazione di questa figura retorica..."
                  value={nuovaSpiegazione}
                  onChange={(e) => setNuovaSpiegazione(e.target.value)}
                  rows={3}
                ></textarea>
              </div>
              
              <button 
                className="kai-button submit-creation"
                disabled={!figuraSelezionata || !nuovoEsempio || !nuovaSpiegazione}
                onClick={submitCreazione}
              >
                Condividi la tua creazione
              </button>
            </div>
            
            <div className="sfida-section">
              <h3>Sfida di Creazione</h3>
              <div className="sfida-tabs">
                <button 
                  className={`sfida-tab ${sfidaTab === 'mie' ? 'active' : ''}`}
                  onClick={() => setSfidaTab('mie')}
                >
                  Le mie creazioni
                </button>
                <button 
                  className={`sfida-tab ${sfidaTab === 'valuta' ? 'active' : ''}`}
                  onClick={() => setSfidaTab('valuta')}
                >
                  Valuta altre creazioni
                </button>
                <button 
                  className={`sfida-tab ${sfidaTab === 'classifica' ? 'active' : ''}`}
                  onClick={() => setSfidaTab('classifica')}
                >
                  Classifica
                </button>
              </div>
              
              {sfidaTab === 'mie' && (
                <div className="mie-creazioni">
                  {mieCreazioni.length > 0 ? (
                    <div className="creazioni-list">
                      {mieCreazioni.map((creazione, index) => (
                        <div key={index} className="creazione-card">
                          <div className="creazione-header">
                            <h4 className="creazione-figura">{creazione.tipo}</h4>
                            <div className="creazione-stats">
                              <span className="creazione-date">{creazione.data}</span>
                              <span className="creazione-rating">
                                <span className="star-icon">★</span> {creazione.rating.toFixed(1)}/5
                              </span>
                            </div>
                          </div>
                          <blockquote className="creazione-esempio">
                            "{creazione.esempio}"
                          </blockquote>
                          <p className="creazione-spiegazione">{creazione.spiegazione}</p>
                          <div className="creazione-feedback">
                            <h5>Feedback ricevuti:</h5>
                            {creazione.feedback.length > 0 ? (
                              <ul className="feedback-list">
                                {creazione.feedback.map((fb, i) => (
                                  <li key={i} className="feedback-item">
                                    <div className="feedback-rating">
                                      {'★'.repeat(fb.rating)}{'☆'.repeat(5-fb.rating)}
                                    </div>
                                    <p className="feedback-comment">{fb.commento}</p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="no-feedback">Non hai ancora ricevuto feedback.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-creazioni">Non hai ancora creato figure retoriche. Prova a crearne una!</p>
                  )}
                </div>
              )}
              
              {sfidaTab === 'valuta' && (
                <div className="valuta-creazioni">
                  {creazioniDaValutare.length > 0 ? (
                    <div className="valutazione-card">
                      <div className="creazione-header">
                        <h4 className="creazione-figura">{creazioniDaValutare[indiceValutazione].tipo}</h4>
                        <span className="creazione-author">di {creazioniDaValutare[indiceValutazione].autore}</span>
                      </div>
                      <blockquote className="creazione-esempio">
                        "{creazioniDaValutare[indiceValutazione].esempio}"
                      </blockquote>
                      <p className="creazione-spiegazione">{creazioniDaValutare[indiceValutazione].spiegazione}</p>
                      
                      <div className="valutazione-form">
                        <h5>La tua valutazione:</h5>
                        <div className="star-rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              className={`star-btn ${valutazioneAttuale >= star ? 'active' : ''}`}
                              onClick={() => setValutazioneAttuale(star)}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <textarea 
                          placeholder="Scrivi qui il tuo feedback (opzionale)..."
                          value={commentoValutazione}
                          onChange={(e) => setCommentoValutazione(e.target.value)}
                          rows={2}
                        ></textarea>
                        <div className="valutazione-actions">
                          <button className="skip-btn" onClick={skipValutazione}>
                            Salta
                          </button>
                          <button 
                            className="kai-button submit-rating"
                            disabled={valutazioneAttuale === 0}
                            onClick={submitValutazione}
                          >
                            Invia valutazione
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="no-creazioni">Non ci sono creazioni da valutare al momento. Torna più tardi!</p>
                  )}
                </div>
              )}
              
              {sfidaTab === 'classifica' && (
                <div className="classifica-creazioni">
                  <div className="filter-options">
                    <select 
                      value={filtroClassifica} 
                      onChange={(e) => setFiltroClassifica(e.target.value)}
                    >
                      <option value="all">Tutte le figure</option>
                      {getFigurePerLivello().map(figura => (
                        <option key={figura} value={figura}>{figura}</option>
                      ))}
                    </select>
                  </div>
                  
                  {classificaCreazioni.length > 0 ? (
                    <div className="classifica-list">
                      {classificaCreazioni
                        .filter(c => filtroClassifica === 'all' || c.tipo === filtroClassifica)
                        .map((creazione, index) => (
                          <div key={index} className="classifica-item">
                            <div className="posizione">#{index + 1}</div>
                            <div className="classifica-content">
                              <div className="classifica-header">
                                <h4>{creazione.tipo}</h4>
                                <div className="classifica-rating">
                                  <span className="star-icon">★</span> {creazione.rating.toFixed(1)}
                                </div>
                              </div>
                              <blockquote>"{creazione.esempio}"</blockquote>
                              <div className="classifica-author">di {creazione.autore}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="no-creazioni">La classifica è vuota. Sii il primo a creare una figura retorica!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {tab === 'esercizi' && (
          <div className="testo-esercizi">
            <h3>Esercizi di comprensione</h3>
            <div className="esercizio">
              <p className="esercizio-domanda">
                Quali sono i temi principali di questo testo?
              </p>
              <textarea 
                className="esercizio-risposta" 
                placeholder="Scrivi qui la tua risposta..."
                rows={4}
              />
            </div>
            
            <div className="esercizio">
              <p className="esercizio-domanda">
                {isPoesia 
                  ? "Analizza le figure retoriche presenti nel testo." 
                  : "Descrivi i personaggi principali e il loro ruolo nella narrazione."}
              </p>
              <textarea 
                className="esercizio-risposta" 
                placeholder="Scrivi qui la tua risposta..."
                rows={4}
              />
            </div>
            
            <button className="kai-button">Invia risposte</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestoLetterario;