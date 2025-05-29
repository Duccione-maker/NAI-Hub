import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DojoConoscenza.css';

// Database simulato di studenti che necessitano aiuto
const richiesteAiutoDatabase = [
  {
    id: 1,
    studente: {
      id: 101,
      nome: "Laura",
      avatar: "👧",
      livello: "principiante"
    },
    titolo: "Aiuto con i verbi irregolari",
    descrizione: "Non riesco a capire quando usare il congiuntivo con i verbi irregolari. Qualcuno può aiutarmi con degli esempi pratici?",
    materia: "grammatica",
    difficolta: "media",
    dataRichiesta: new Date(2025, 2, 25), // 25 Marzo 2025
    stato: "aperta",
    puntiOfferti: 25
  },
  {
    id: 2,
    studente: {
      id: 102,
      nome: "Marco",
      avatar: "👦",
      livello: "intermedio"
    },
    titolo: "Dubbi sulla punteggiatura nei dialoghi",
    descrizione: "Sto scrivendo un racconto e non sono sicuro di come usare correttamente la punteggiatura nei dialoghi. In particolare, quando usare le virgolette e quando i trattini.",
    materia: "scrittura",
    difficolta: "facile",
    dataRichiesta: new Date(2025, 2, 28), // 28 Marzo 2025
    stato: "aperta",
    puntiOfferti: 15
  },
  {
    id: 3,
    studente: {
      id: 103,
      nome: "Giulia",
      avatar: "👩",
      livello: "avanzato"
    },
    titolo: "Analisi di un testo poetico",
    descrizione: "Sto analizzando una poesia di Leopardi e vorrei un confronto sulle figure retoriche presenti. Qualcuno esperto di poesia può aiutarmi a identificarle?",
    materia: "letteratura",
    difficolta: "difficile",
    dataRichiesta: new Date(2025, 2, 30), // 30 Marzo 2025
    stato: "aperta",
    puntiOfferti: 40
  },
  {
    id: 4,
    studente: {
      id: 104,
      nome: "Roberto",
      avatar: "🧑",
      livello: "principiante"
    },
    titolo: "Uso del passato remoto",
    descrizione: "Sono confuso su quando usare il passato prossimo e quando il passato remoto. Potete aiutarmi con esempi pratici o regole semplici?",
    materia: "grammatica",
    difficolta: "media",
    dataRichiesta: new Date(2025, 2, 26), // 26 Marzo 2025
    stato: "aperta",
    puntiOfferti: 20
  },
  {
    id: 5,
    studente: {
      id: 105,
      nome: "Chiara",
      avatar: "👱‍♀️",
      livello: "intermedio"
    },
    titolo: "Traduzioni di espressioni idiomatiche",
    descrizione: "Sto cercando aiuto per tradurre alcune espressioni idiomatiche italiane in inglese. Ho bisogno di equivalenti culturali, non solo traduzioni letterali.",
    materia: "vocabolario",
    difficolta: "difficile",
    dataRichiesta: new Date(2025, 2, 29), // 29 Marzo 2025
    stato: "aperta",
    puntiOfferti: 35
  }
];

// Database simulato di aiuti già forniti dallo studente corrente
const aiutiFornitoDB = [
  {
    id: 101,
    richiestaId: 6,
    studente: {
      id: 106,
      nome: "Alessandro",
      avatar: "👨",
      livello: "principiante"
    },
    titolo: "Aiuto con i pronomi diretti e indiretti",
    descrizione: "Mi confondo sempre con l'uso dei pronomi diretti e indiretti in italiano.",
    materia: "grammatica",
    difficolta: "media",
    stato: "completata",
    dataAiuto: new Date(2025, 2, 20), // 20 Marzo 2025
    puntiRicevuti: 20,
    valutazione: 5, // su 5
    feedback: "Grazie mille! La spiegazione è stata molto chiara e gli esempi mi hanno aiutato tantissimo."
  },
  {
    id: 102,
    richiestaId: 7,
    studente: {
      id: 107,
      nome: "Sofia",
      avatar: "👧",
      livello: "intermedio"
    },
    titolo: "Comprensione di un testo filosofico",
    descrizione: "Fatico a comprendere alcuni concetti in un testo di filosofia che sto leggendo.",
    materia: "comprensione",
    difficolta: "difficile",
    stato: "completata",
    dataAiuto: new Date(2025, 2, 15), // 15 Marzo 2025
    puntiRicevuti: 35,
    valutazione: 4, // su 5
    feedback: "Ottimo aiuto! Ho capito molto meglio i concetti difficili grazie alla tua spiegazione."
  }
];

// Database simulato classifica aiutanti
const classificaAiutanti = [
  { id: 201, nome: "Mario", avatar: "👨‍🏫", puntiTotali: 450, aiutiForniti: 15, livello: "Master", badge: ["🏆", "⭐", "🌟"] },
  { id: 202, nome: "Lucia", avatar: "👩‍🎓", puntiTotali: 380, aiutiForniti: 12, livello: "Esperto", badge: ["⭐", "🌟"] },
  { id: 203, nome: "Tu", avatar: "🧠", puntiTotali: 55, aiutiForniti: 2, livello: "Apprendista", badge: ["🔰"] },
  { id: 204, nome: "Andrea", avatar: "👨‍💻", puntiTotali: 320, aiutiForniti: 10, livello: "Esperto", badge: ["⭐"] },
  { id: 205, nome: "Francesca", avatar: "👩‍🔬", puntiTotali: 280, aiutiForniti: 9, livello: "Esperto", badge: ["⭐"] },
  { id: 206, nome: "Luca", avatar: "🧑‍🚀", puntiTotali: 240, aiutiForniti: 8, livello: "Avanzato", badge: ["📚"] },
  { id: 207, nome: "Giovanna", avatar: "👩‍⚕️", puntiTotali: 200, aiutiForniti: 7, livello: "Avanzato", badge: ["📚"] },
  { id: 208, nome: "Paolo", avatar: "👨‍🍳", puntiTotali: 170, aiutiForniti: 6, livello: "Intermedio", badge: ["📝"] },
  { id: 209, nome: "Elisa", avatar: "👩‍🏭", puntiTotali: 140, aiutiForniti: 5, livello: "Intermedio", badge: ["📝"] },
  { id: 210, nome: "Stefano", avatar: "🧑‍🎨", puntiTotali: 110, aiutiForniti: 4, livello: "Base", badge: [] }
];

// Sistema di badge con descrizioni
const badgeInfo = {
  "🏆": "Campione del Dojo - Primo posto nella classifica mensile",
  "⭐": "Stella del sapere - Più di 10 aiuti forniti con valutazione media sopra 4",
  "🌟": "Super maestro - Più di 20 aiuti forniti con valutazione media sopra 4.5",
  "📚": "Bibliofilo - Esperto in aiuti relativi alla letteratura",
  "📝": "Grammaticus - Esperto in aiuti relativi alla grammatica",
  "🔰": "Nuovo aiutante - Ha iniziato da poco a fornire aiuto"
};

// Livelli di esperienza nel Dojo
const livelliDojo = {
  "Novizio": { min: 0, max: 50, descrizione: "Stai muovendo i primi passi come aiutante" },
  "Apprendista": { min: 51, max: 150, descrizione: "Hai iniziato ad aiutare regolarmente altri studenti" },
  "Intermedio": { min: 151, max: 250, descrizione: "Le tue conoscenze sono apprezzate dalla comunità" },
  "Avanzato": { min: 251, max: 350, descrizione: "Sei un punto di riferimento per molti studenti" },
  "Esperto": { min: 351, max: 400, descrizione: "Le tue spiegazioni sono considerate eccellenti" },
  "Master": { min: 401, max: Infinity, descrizione: "Hai raggiunto il livello massimo di competenza come aiutante" }
};

// Componente principale per il Dojo della Conoscenza
const DojoConoscenza = () => {
  const [visualizzazione, setVisualizzazione] = useState("richieste"); // richieste, miei-aiuti, classifica
  const [richiesteAiuto, setRichiesteAiuto] = useState([]);
  const [richiesteFiltered, setRichiesteFiltered] = useState([]);
  const [aiutiForniti, setAiutiForniti] = useState([]);
  const [classificaUtenti, setClassificaUtenti] = useState([]);
  const [richiestaSelezionata, setRichiestaSelezionata] = useState(null);
  const [mostraDettaglioRichiesta, setMostraDettaglioRichiesta] = useState(false);
  const [mostraFormRisposta, setMostraFormRisposta] = useState(false);
  const [rispostaText, setRispostaText] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("tutte");
  const [filtroDifficolta, setFiltroDifficolta] = useState("tutte");
  const [ordinamento, setOrdinamento] = useState("recenti");
  const [mostraInfoBadge, setMostraInfoBadge] = useState(null);
  const [profiloUtente, setProfiloUtente] = useState({
    puntiTotali: 55,
    aiutiForniti: 2,
    livello: "Apprendista",
    valutazioneMedia: 4.5,
    badge: ["🔰"]
  });
  
  const navigate = useNavigate();

  // Carica i dati all'avvio
  useEffect(() => {
    // In un'implementazione reale, questi dati verrebbero da una API
    setRichiesteAiuto(richiesteAiutoDatabase);
    setRichiesteFiltered(richiesteAiutoDatabase);
    setAiutiForniti(aiutiFornitoDB);
    setClassificaUtenti(classificaAiutanti);
  }, []);

  // Effetto per filtrare le richieste in base ai filtri selezionati
  useEffect(() => {
    let filtered = [...richiesteAiuto];
    
    // Applica filtro per materia
    if (filtroMateria !== "tutte") {
      filtered = filtered.filter(richiesta => richiesta.materia === filtroMateria);
    }
    
    // Applica filtro per difficoltà
    if (filtroDifficolta !== "tutte") {
      filtered = filtered.filter(richiesta => richiesta.difficolta === filtroDifficolta);
    }
    
    // Applica ordinamento
    if (ordinamento === "recenti") {
      filtered.sort((a, b) => b.dataRichiesta - a.dataRichiesta);
    } else if (ordinamento === "punti") {
      filtered.sort((a, b) => b.puntiOfferti - a.puntiOfferti);
    } else if (ordinamento === "difficolta") {
      const difficoltaOrdine = { "facile": 1, "media": 2, "difficile": 3 };
      filtered.sort((a, b) => difficoltaOrdine[b.difficolta] - difficoltaOrdine[a.difficolta]);
    }
    
    setRichiesteFiltered(filtered);
  }, [richiesteAiuto, filtroMateria, filtroDifficolta, ordinamento]);

  // Formatta data come stringa
  const formattaData = (data) => {
    const oggi = new Date();
    const ieri = new Date(oggi);
    ieri.setDate(oggi.getDate() - 1);
    
    // Controlla se la data è oggi
    if (data.toDateString() === oggi.toDateString()) {
      return "Oggi";
    }
    
    // Controlla se la data è ieri
    if (data.toDateString() === ieri.toDateString()) {
      return "Ieri";
    }
    
    // Altrimenti, formatta la data come giorno/mese
    return `${data.getDate()}/${data.getMonth() + 1}`;
  };

  // Gestisce il clic su una richiesta di aiuto
  const handleRichiestaClick = (richiesta) => {
    setRichiestaSelezionata(richiesta);
    setMostraDettaglioRichiesta(true);
  };

  // Chiude il dettaglio della richiesta
  const chiudiDettaglioRichiesta = () => {
    setMostraDettaglioRichiesta(false);
    setMostraFormRisposta(false);
    setRispostaText("");
  };

  // Mostra il form per rispondere alla richiesta
  const mostraFormRispostaHandler = () => {
    setMostraFormRisposta(true);
  };

  // Gestisce l'invio della risposta
  const inviaRisposta = () => {
    if (rispostaText.trim() === "") {
      alert("Il contenuto della risposta non può essere vuoto");
      return;
    }
    
    // In un'implementazione reale, qui invieremmo la risposta ad un backend
    alert("Risposta inviata con successo! Hai guadagnato " + richiestaSelezionata.puntiOfferti + " punti!");
    
    // Aggiorna lo stato locale
    const nuovoAiuto = {
      id: Date.now(),
      richiestaId: richiestaSelezionata.id,
      studente: richiestaSelezionata.studente,
      titolo: richiestaSelezionata.titolo,
      descrizione: richiestaSelezionata.descrizione,
      materia: richiestaSelezionata.materia,
      difficolta: richiestaSelezionata.difficolta,
      stato: "completata",
      dataAiuto: new Date(),
      puntiRicevuti: richiestaSelezionata.puntiOfferti,
      valutazione: null,
      feedback: null
    };
    
    // Aggiorna gli aiuti forniti
    setAiutiForniti([nuovoAiuto, ...aiutiForniti]);
    
    // Aggiorna le richieste rimuovendo quella appena risolta
    const nuoveRichieste = richiesteAiuto.filter(r => r.id !== richiestaSelezionata.id);
    setRichiesteAiuto(nuoveRichieste);
    setRichiesteFiltered(nuoveRichieste);
    
    // Aggiorna i punti dell'utente
    setProfiloUtente(prevProfilo => ({
      ...prevProfilo,
      puntiTotali: prevProfilo.puntiTotali + richiestaSelezionata.puntiOfferti,
      aiutiForniti: prevProfilo.aiutiForniti + 1
    }));
    
    // Chiudi il dettaglio
    chiudiDettaglioRichiesta();
  };

  // Mostra info su un badge quando si passa sopra con il mouse
  const mostraInfoBadgeHandler = (badge) => {
    setMostraInfoBadge(badge);
  };

  // Nasconde info badge
  const nascondiInfoBadgeHandler = () => {
    setMostraInfoBadge(null);
  };

  // Determina il livello dojo in base ai punti
  const determinaLivelloDojo = (punti) => {
    for (const [livello, range] of Object.entries(livelliDojo)) {
      if (punti >= range.min && punti <= range.max) {
        return livello;
      }
    }
    return "Novizio"; // Fallback
  };

  // Renderizza le richieste di aiuto
  const renderRichiesteAiuto = () => {
    return (
      <div className="dojo-richieste-container">
        <div className="dojo-filtri">
          <div className="filtro-gruppo">
            <label>Materia:</label>
            <select value={filtroMateria} onChange={(e) => setFiltroMateria(e.target.value)}>
              <option value="tutte">Tutte le materie</option>
              <option value="grammatica">Grammatica</option>
              <option value="scrittura">Scrittura</option>
              <option value="letteratura">Letteratura</option>
              <option value="vocabolario">Vocabolario</option>
              <option value="comprensione">Comprensione</option>
            </select>
          </div>
          
          <div className="filtro-gruppo">
            <label>Difficoltà:</label>
            <select value={filtroDifficolta} onChange={(e) => setFiltroDifficolta(e.target.value)}>
              <option value="tutte">Tutte le difficoltà</option>
              <option value="facile">Facile</option>
              <option value="media">Media</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
          
          <div className="filtro-gruppo">
            <label>Ordina per:</label>
            <select value={ordinamento} onChange={(e) => setOrdinamento(e.target.value)}>
              <option value="recenti">Più recenti</option>
              <option value="punti">Punti offerti</option>
              <option value="difficolta">Difficoltà</option>
            </select>
          </div>
        </div>
        
        <div className="richieste-lista">
          {richiesteFiltered.length > 0 ? (
            richiesteFiltered.map(richiesta => (
              <div key={richiesta.id} className="richiesta-card" onClick={() => handleRichiestaClick(richiesta)}>
                <div className="richiesta-header">
                  <div className="richiesta-studente">
                    <span className="avatar">{richiesta.studente.avatar}</span>
                    <span className="nome">{richiesta.studente.nome}</span>
                    <span className="livello">{richiesta.studente.livello}</span>
                  </div>
                  <div className="richiesta-data">{formattaData(richiesta.dataRichiesta)}</div>
                </div>
                
                <h3 className="richiesta-titolo">{richiesta.titolo}</h3>
                <p className="richiesta-descrizione">{richiesta.descrizione.length > 120 ? `${richiesta.descrizione.substring(0, 120)}...` : richiesta.descrizione}</p>
                
                <div className="richiesta-footer">
                  <div className="richiesta-tag">
                    <span className="tag materia">{richiesta.materia}</span>
                    <span className={`tag difficolta ${richiesta.difficolta}`}>{richiesta.difficolta}</span>
                  </div>
                  <div className="richiesta-punti">{richiesta.puntiOfferti} punti</div>
                </div>
              </div>
            ))
          ) : (
            <div className="nessuna-richiesta">
              <p>Non ci sono richieste di aiuto disponibili con i filtri selezionati.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizza gli aiuti forniti dall'utente
  const renderAiutiForniti = () => {
    return (
      <div className="dojo-aiuti-container">
        <div className="aiuti-header">
          <h2>I miei aiuti forniti</h2>
          <div className="aiuti-stats">
            <div className="stat">
              <span className="label">Totale aiuti:</span>
              <span className="valore">{profiloUtente.aiutiForniti}</span>
            </div>
            <div className="stat">
              <span className="label">Punti guadagnati:</span>
              <span className="valore">{profiloUtente.puntiTotali}</span>
            </div>
            <div className="stat">
              <span className="label">Valutazione media:</span>
              <span className="valore">{profiloUtente.valutazioneMedia} ⭐</span>
            </div>
          </div>
        </div>
        
        <div className="aiuti-livello">
          <div className="livello-info">
            <h3>Livello Dojo: {profiloUtente.livello}</h3>
            <p>{livelliDojo[profiloUtente.livello]?.descrizione}</p>
          </div>
          <div className="badge-container">
            {profiloUtente.badge.map((badge, index) => (
              <span 
                key={index} 
                className="badge" 
                onMouseEnter={() => mostraInfoBadgeHandler(badge)}
                onMouseLeave={nascondiInfoBadgeHandler}
              >
                {badge}
              </span>
            ))}
            {mostraInfoBadge && (
              <div className="badge-tooltip">
                {badgeInfo[mostraInfoBadge]}
              </div>
            )}
          </div>
        </div>
        
        <div className="aiuti-lista">
          {aiutiForniti.length > 0 ? (
            aiutiForniti.map(aiuto => (
              <div key={aiuto.id} className="aiuto-card">
                <div className="aiuto-header">
                  <div className="aiuto-studente">
                    <span className="avatar">{aiuto.studente.avatar}</span>
                    <span className="nome">{aiuto.studente.nome}</span>
                  </div>
                  <div className="aiuto-data">{formattaData(aiuto.dataAiuto)}</div>
                </div>
                
                <h3 className="aiuto-titolo">{aiuto.titolo}</h3>
                
                <div className="aiuto-tags">
                  <span className="tag materia">{aiuto.materia}</span>
                  <span className={`tag difficolta ${aiuto.difficolta}`}>{aiuto.difficolta}</span>
                </div>
                
                <div className="aiuto-footer">
                  <div className="aiuto-punti">
                    <span className="label">Punti ricevuti:</span>
                    <span className="valore">{aiuto.puntiRicevuti}</span>
                  </div>
                  
                  {aiuto.valutazione !== null && (
                    <div className="aiuto-valutazione">
                      <span className="label">Valutazione:</span>
                      <span className="valore">{aiuto.valutazione} ⭐</span>
                    </div>
                  )}
                </div>
                
                {aiuto.feedback && (
                  <div className="aiuto-feedback">
                    <p>"{aiuto.feedback}"</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="nessun-aiuto">
              <p>Non hai ancora fornito aiuto ad altri studenti. Inizia rispondendo alle richieste!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizza la classifica degli aiutanti
  const renderClassifica = () => {
    return (
      <div className="dojo-classifica-container">
        <h2>Classifica dei Maestri del Dojo</h2>
        <p className="classifica-descrizione">I migliori aiutanti della comunità di apprendimento</p>
        
        <div className="classifica-tabella">
          <div className="classifica-header">
            <div className="classifica-pos">Pos.</div>
            <div className="classifica-utente">Utente</div>
            <div className="classifica-livello">Livello</div>
            <div className="classifica-badge">Badge</div>
            <div className="classifica-aiuti">Aiuti</div>
            <div className="classifica-punti">Punti</div>
          </div>
          
          {classificaUtenti.map((utente, index) => (
            <div 
              key={utente.id} 
              className={`classifica-riga ${index < 3 ? 'top-player' : ''} ${utente.nome === 'Tu' ? 'current-user' : ''}`}
            >
              <div className="classifica-pos">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div className="classifica-utente">
                <span className="avatar">{utente.avatar}</span> 
                <span className="nome">{utente.nome}</span>
              </div>
              <div className="classifica-livello">{utente.livello}</div>
              <div className="classifica-badge">
                {utente.badge.map((badge, badgeIndex) => (
                  <span 
                    key={badgeIndex} 
                    className="badge" 
                    onMouseEnter={() => mostraInfoBadgeHandler(badge)}
                    onMouseLeave={nascondiInfoBadgeHandler}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="classifica-aiuti">{utente.aiutiForniti}</div>
              <div className="classifica-punti">{utente.puntiTotali}</div>
            </div>
          ))}
        </div>
        
        <div className="prossimi-badge">
          <h3>Prossimi badge da sbloccare</h3>
          <div className="badge-list">
            <div className="badge-item">
              <span className="badge-icon">📝</span>
              <div className="badge-info">
                <h4>Grammaticus</h4>
                <p>Aiuta 5 studenti con problemi di grammatica</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '40%' }}></div>
                </div>
                <span className="progress-text">2/5 completati</span>
              </div>
            </div>
            
            <div className="badge-item">
              <span className="badge-icon">⭐</span>
              <div className="badge-info">
                <h4>Stella del sapere</h4>
                <p>Fornisci più di 10 aiuti con valutazione media superiore a 4</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '20%' }}></div>
                </div>
                <span className="progress-text">2/10 completati</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizza il dettaglio di una richiesta
  const renderDettaglioRichiesta = () => {
    if (!richiestaSelezionata) return null;
    
    return (
      <div className="richiesta-dettaglio-overlay">
        <div className="richiesta-dettaglio-container">
          <button className="chiudi-btn" onClick={chiudiDettaglioRichiesta}>×</button>
          
          <div className="richiesta-dettaglio-header">
            <div className="studente-info">
              <span className="avatar">{richiestaSelezionata.studente.avatar}</span>
              <div className="studente-dati">
                <h3>{richiestaSelezionata.studente.nome}</h3>
                <span className="livello">{richiestaSelezionata.studente.livello}</span>
              </div>
            </div>
            <div className="richiesta-data">{formattaData(richiestaSelezionata.dataRichiesta)}</div>
          </div>
          
          <div className="richiesta-dettaglio-content">
            <h2>{richiestaSelezionata.titolo}</h2>
            
            <div className="richiesta-tags">
              <span className="tag materia">{richiestaSelezionata.materia}</span>
              <span className={`tag difficolta ${richiestaSelezionata.difficolta}`}>{richiestaSelezionata.difficolta}</span>
            </div>
            
            <div className="richiesta-descrizione-completa">
              <p>{richiestaSelezionata.descrizione}</p>
            </div>
            
            <div className="richiesta-punti-dettaglio">
              <span className="label">Punti offerti:</span>
              <span className="valore">{richiestaSelezionata.puntiOfferti}</span>
            </div>
            
            {!mostraFormRisposta ? (
              <button 
                className="risposta-btn" 
                onClick={mostraFormRispostaHandler}
              >
                Offri il tuo aiuto
              </button>
            ) : (
              <div className="risposta-form">
                <h3>La tua risposta</h3>
                <textarea
                  className="risposta-textarea"
                  placeholder="Scrivi qui la tua risposta..."
                  value={rispostaText}
                  onChange={(e) => setRispostaText(e.target.value)}
                  rows={6}
                ></textarea>
                <div className="risposta-actions">
                  <button 
                    className="annulla-btn" 
                    onClick={() => setMostraFormRisposta(false)}
                  >
                    Annulla
                  </button>
                  <button 
                    className="invia-btn" 
                    onClick={inviaRisposta}
                    disabled={rispostaText.trim() === ""}
                  >
                    Invia risposta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dojo-conoscenza">
      <div className="dojo-header">
        <h1>Dojo della Conoscenza 🏅</h1>
        <p>Condividi le tue conoscenze, aiuta altri studenti e guadagna punti!</p>
      </div>
      
      <div className="dojo-navigation">
        <button 
          className={`nav-btn ${visualizzazione === 'richieste' ? 'active' : ''}`} 
          onClick={() => setVisualizzazione('richieste')}
        >
          Richieste di aiuto
        </button>
        <button 
          className={`nav-btn ${visualizzazione === 'miei-aiuti' ? 'active' : ''}`} 
          onClick={() => setVisualizzazione('miei-aiuti')}
        >
          I miei aiuti
        </button>
        <button 
          className={`nav-btn ${visualizzazione === 'classifica' ? 'active' : ''}`} 
          onClick={() => setVisualizzazione('classifica')}
        >
          Classifica
        </button>
      </div>
      
      <div className="dojo-content">
        {visualizzazione === 'richieste' && renderRichiesteAiuto()}
        {visualizzazione === 'miei-aiuti' && renderAiutiForniti()}
        {visualizzazione === 'classifica' && renderClassifica()}
      </div>
      
      {mostraDettaglioRichiesta && renderDettaglioRichiesta()}
    </div>
  );
};

export default DojoConoscenza;