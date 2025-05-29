import React, { useState, useEffect, useRef } from 'react';
import './SezioneScrittura.css';

// Database di prompt/stimoli per i diversi tipi di esercizi
const promptsDatabase = {
  // Prompt per la scrittura libera
  scritturaLibera: [
    "Racconta una giornata indimenticabile della tua vita.",
    "Descrivi il tuo luogo preferito e spiega perché è speciale per te.",
    "Se potessi viaggiare in qualsiasi periodo storico, quale sceglieresti e perché?",
    "Scrivi una lettera al tuo futuro io tra 10 anni.",
    "Immagina di essere invisibile per un giorno. Come lo trascorreresti?"
  ],
  
  // Prompt per descrizione di immagini
  descrizioneImmagine: [
    { 
      id: "img1", 
      descrizione: "Un tramonto sul mare con una barca in lontananza.", 
      richiesta: "Descrivi questa scena e le emozioni che potrebbe suscitare."
    },
    { 
      id: "img2", 
      descrizione: "Una piazza affollata di una città europea.", 
      richiesta: "Descrivi l'atmosfera di questa piazza e le persone che la popolano."
    },
    { 
      id: "img3", 
      descrizione: "Un bosco autunnale con foglie colorate.", 
      richiesta: "Descrivi i colori e le sensazioni di questo paesaggio autunnale."
    },
    { 
      id: "img4", 
      descrizione: "Un mercato tradizionale con bancarelle colorate.", 
      richiesta: "Descrivi i profumi, i colori e i suoni di questo mercato."
    }
  ],
  
  // Testi da riscrivere con modifiche
  riscritturaTesti: [
    {
      originale: "Ciao Marco! Come stai? Io sto bene. Ti scrivo per invitarti alla mia festa di compleanno sabato. Ci saranno tanti amici e faremo una grigliata. Spero proprio che tu possa venire! A presto!",
      richiesta: "Riscrivi questo messaggio in un registro formale, come se fosse una comunicazione ufficiale."
    },
    {
      originale: "Il sottoscritto, Dott. Rossi, in qualità di dirigente dell'ufficio amministrativo, con la presente comunica che in data 15/05 si terrà una riunione straordinaria atta a discutere le nuove direttive aziendali. Si richiede gentilmente la presenza di tutto il personale.",
      richiesta: "Riscrivi questa comunicazione formale in un tono più informale e amichevole."
    },
    {
      originale: "La manifestazione avrà luogo il giorno 10 aprile p.v. alle ore 18.00 presso l'Auditorium comunale. È richiesto un abbigliamento consono all'evento.",
      richiesta: "Riscrivi questo annuncio in uno stile più giovanile e accattivante."
    },
    {
      originale: "L'azienda informa che, a seguito di interventi di manutenzione straordinaria, gli uffici rimarranno chiusi dal 10 al 15 agosto.",
      richiesta: "Riscrivi questo avviso in modo più dettagliato ed empatico verso i destinatari."
    }
  ]
};

// Regole grammaticali comuni per i suggerimenti
const regoleGrammaticali = {
  punteggiatura: [
    { errore: "mancanza di punto", regola: "Ricorda di terminare le frasi con un punto." },
    { errore: "mancanza di virgola", regola: "Usa la virgola per separare gli elementi di un elenco o le proposizioni." }
  ],
  ortografia: [
    { errore: "apostrofo", regola: "Ricorda che l'apostrofo si usa per indicare l'elisione di una vocale." },
    { errore: "doppie", regola: "Le consonanti doppie modificano la pronuncia e il significato delle parole." }
  ],
  sintassi: [
    { errore: "concordanza soggetto-verbo", regola: "Il verbo deve concordare con il soggetto in numero e persona." },
    { errore: "uso del congiuntivo", regola: "Il congiuntivo si usa nelle frasi che esprimono dubbio, possibilità o desiderio." }
  ]
};

// Livelli di badge ispirati alle cinture del karate
const badgeLevels = [
  { nome: "Cintura Bianca", descrizione: "Primi passi nella scrittura", puntiRichiesti: 0, color: "white" },
  { nome: "Cintura Gialla", descrizione: "Conoscenze di base", puntiRichiesti: 100, color: "yellow" },
  { nome: "Cintura Arancione", descrizione: "Competenze in crescita", puntiRichiesti: 250, color: "orange" },
  { nome: "Cintura Verde", descrizione: "Buona padronanza linguistica", puntiRichiesti: 500, color: "green" },
  { nome: "Cintura Blu", descrizione: "Capacità avanzate", puntiRichiesti: 800, color: "blue" },
  { nome: "Cintura Marrone", descrizione: "Scrittore esperto", puntiRichiesti: 1200, color: "brown" },
  { nome: "Cintura Nera", descrizione: "Maestria linguistica", puntiRichiesti: 2000, color: "black" }
];

// Citazioni sulla disciplina e l'apprendimento dai maestri di karate
const karateQuotes = [
  "\"Il karate è come l'acqua bollente; senza calore costante, torna ad essere tiepido.\" - Gichin Funakoshi",
  "\"Il miglioramento è sempre possibile, non importa da quanto tempo pratichi.\" - Shoshin Nagamine",
  "\"La perfezione del carattere è la meta ultima.\" - Gichin Funakoshi",
  "\"Prima di vincere gli altri, devi vincere te stesso.\" - Proverbio del karate",
  "\"Non temere di camminare lentamente, temi solo di fermarti.\" - Antico detto del karate",
  "\"La pratica costante è il segreto dell'apprendimento.\" - Masatoshi Nakayama"
];

const SezioneScrittura = () => {
  // Stati per il componente
  const [tipoEsercizio, setTipoEsercizio] = useState('scritturaLibera');
  const [prompt, setPrompt] = useState({});
  const [testo, setTesto] = useState('');
  const [modalitaCorrezione, setModalitaCorrezione] = useState('finale');
  const [erroriEvidenziati, setErroriEvidenziati] = useState([]);
  const [suggerimenti, setSuggerimenti] = useState([]);
  const [stato, setStato] = useState('inizio'); // 'inizio', 'scrittura', 'feedback'
  const [puntiUtente, setPuntiUtente] = useState(320); // Simuliamo un utente con alcuni punti
  const [badgeAttuale, setBadgeAttuale] = useState({});
  const [randomQuote, setRandomQuote] = useState('');
  
  // Refs
  const textareaRef = useRef(null);
  const lastAnalysisTimeRef = useRef(0);
  
  // Effetto per generare un prompt iniziale e calcolare il badge attuale
  useEffect(() => {
    generaNuovoPrompt();
    calcolaBadgeAttuale();
    // Seleziona una citazione casuale
    const quoteIndex = Math.floor(Math.random() * karateQuotes.length);
    setRandomQuote(karateQuotes[quoteIndex]);
  }, []);
  
  // Effetto per analizzare il testo durante la scrittura (solo in modalità in itinere)
  useEffect(() => {
    if (modalitaCorrezione === 'itinere' && testo && stato === 'scrittura') {
      const now = Date.now();
      // Analizziamo solo ogni 1.5 secondi per non sovraccaricare l'interfaccia
      if (now - lastAnalysisTimeRef.current > 1500) {
        analizzaTesto(testo);
        lastAnalysisTimeRef.current = now;
      }
    }
  }, [testo, modalitaCorrezione, stato]);
  
  /**
   * Genera un nuovo prompt in base al tipo di esercizio selezionato
   */
  const generaNuovoPrompt = () => {
    let nuovoPrompt;
    
    switch(tipoEsercizio) {
      case 'scritturaLibera':
        const randomIndex = Math.floor(Math.random() * promptsDatabase.scritturaLibera.length);
        nuovoPrompt = {
          testo: promptsDatabase.scritturaLibera[randomIndex],
          tipo: 'scritturaLibera'
        };
        break;
      
      case 'descrizioneImmagine':
        const randomImg = Math.floor(Math.random() * promptsDatabase.descrizioneImmagine.length);
        nuovoPrompt = promptsDatabase.descrizioneImmagine[randomImg];
        nuovoPrompt.tipo = 'descrizioneImmagine';
        break;
      
      case 'riscritturaTesti':
        const randomText = Math.floor(Math.random() * promptsDatabase.riscritturaTesti.length);
        nuovoPrompt = promptsDatabase.riscritturaTesti[randomText];
        nuovoPrompt.tipo = 'riscritturaTesti';
        break;
      
      default:
        nuovoPrompt = {
          testo: "Scrivi un breve testo su un argomento a tua scelta.",
          tipo: 'scritturaLibera'
        };
    }
    
    setPrompt(nuovoPrompt);
    setTesto('');
    setErroriEvidenziati([]);
    setSuggerimenti([]);
    setStato('inizio');
    
    // Seleziona una nuova citazione casuale
    const quoteIndex = Math.floor(Math.random() * karateQuotes.length);
    setRandomQuote(karateQuotes[quoteIndex]);
  };
  
  /**
   * Calcola il badge attuale dell'utente in base ai punti
   */
  const calcolaBadgeAttuale = () => {
    let badgeCorrente = badgeLevels[0]; // Iniziamo dalla cintura bianca
    
    for (let i = 1; i < badgeLevels.length; i++) {
      if (puntiUtente >= badgeLevels[i].puntiRichiesti) {
        badgeCorrente = badgeLevels[i];
      } else {
        break;
      }
    }
    
    setBadgeAttuale(badgeCorrente);
  };
  
  /**
   * Gestisce la modifica del tipo di esercizio
   */
  const handleTipoEsercizioChange = (e) => {
    setTipoEsercizio(e.target.value);
    setTimeout(generaNuovoPrompt, 0);
  };
  
  /**
   * Gestisce la modifica della modalità di correzione
   */
  const handleModalitaCorrezioneChange = (e) => {
    setModalitaCorrezione(e.target.value);
    // Se cambiamo modalità durante la scrittura, resettiamo gli errori
    if (stato === 'scrittura') {
      setErroriEvidenziati([]);
      setSuggerimenti([]);
    }
  };
  
  /**
   * Gestisce i cambiamenti nel testo della textarea
   */
  const handleTestoChange = (e) => {
    setTesto(e.target.value);
    // Se siamo appena passati dallo stato 'inizio' allo stato 'scrittura'
    if (stato === 'inizio') {
      setStato('scrittura');
    }
  };
  
  /**
   * Inizia un nuovo esercizio
   */
  const iniziaNuovoEsercizio = () => {
    generaNuovoPrompt();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  /**
   * Invia il testo per l'analisi finale
   */
  const inviaPerFeedback = () => {
    if (testo.trim().length < 10) {
      alert("Il testo è troppo breve. Scrivi almeno qualche frase.");
      return;
    }
    
    setStato('feedback');
    analizzaTesto(testo, true); // true indica che è un'analisi finale
    
    // Simuliamo l'aggiunta di punti all'utente
    const puntiGuadagnati = Math.floor(Math.random() * 30) + 20; // 20-50 punti
    const nuoviPuntiTotali = puntiUtente + puntiGuadagnati;
    setPuntiUtente(nuoviPuntiTotali);
    
    // Ricalcoliamo il badge
    setTimeout(() => {
      calcolaBadgeAttuale();
    }, 500);
  };
  
  /**
   * Analizza il testo per trovare errori e generare suggerimenti
   * In un'implementazione reale, questa funzione chiamerebbe un'API di analisi linguistica
   */
  const analizzaTesto = (testoAnalizzare, isFeedbackFinale = false) => {
    // Simuliamo l'analisi del testo
    // In un'implementazione reale, questa sarebbe una chiamata API a un servizio di NLP
    
    const parole = testoAnalizzare.split(/\s+/);
    const erroriSimulati = [];
    const suggerimentiGenerati = [];
    
    // Simuliamo alcuni errori comuni
    if (testoAnalizzare.length > 20) {
      // Verifichiamo la punteggiatura finale
      if (!testoAnalizzare.trim().match(/[.!?]$/)) {
        erroriSimulati.push({
          tipo: 'punteggiatura',
          descrizione: 'Manca la punteggiatura finale',
          indice: testoAnalizzare.length - 1
        });
        
        const regolaRandom = regoleGrammaticali.punteggiatura[0];
        suggerimentiGenerati.push(regolaRandom.regola);
      }
      
      // Verifichiamo l'uso delle maiuscole dopo i punti
      const frasi = testoAnalizzare.split(/[.!?]+\s+/);
      for (let i = 1; i < frasi.length; i++) {
        if (frasi[i].length > 0 && frasi[i][0] !== frasi[i][0].toUpperCase()) {
          const posizioneErrore = testoAnalizzare.indexOf(frasi[i]);
          erroriSimulati.push({
            tipo: 'maiuscole',
            descrizione: 'Inizia la frase con la lettera maiuscola',
            indice: posizioneErrore
          });
          
          suggerimentiGenerati.push("Inizia ogni frase con una lettera maiuscola.");
          break;
        }
      }
      
      // Simuliamo errori di ripetizione
      const paroleUniche = new Set(parole);
      if (parole.length > 3 && paroleUniche.size < parole.length * 0.8) {
        suggerimentiGenerati.push("Cerca di variare il vocabolario per rendere il testo più interessante.");
      }
    }
    
    // Aggiungiamo alcuni suggerimenti casuali per la modalità di feedback finale
    if (isFeedbackFinale) {
      // Suggerimenti in base alla lunghezza del testo
      if (parole.length < 50) {
        suggerimentiGenerati.push("Cerca di sviluppare maggiormente le tue idee per arricchire il testo.");
      } else if (parole.length > 200) {
        suggerimentiGenerati.push("Il testo è ben sviluppato. Assicurati che ogni parte sia rilevante per l'argomento principale.");
      }
      
      // Suggerimenti casuali basati sul tipo di esercizio
      if (tipoEsercizio === 'scritturaLibera') {
        suggerimentiGenerati.push("Nella scrittura libera, è importante mantenere un filo logico tra i paragrafi.");
      } else if (tipoEsercizio === 'descrizioneImmagine') {
        suggerimentiGenerati.push("Nelle descrizioni, cerca di utilizzare aggettivi vividi che trasmettano sensazioni.");
      } else if (tipoEsercizio === 'riscritturaTesti') {
        suggerimentiGenerati.push("Nella riscrittura, assicurati di mantenere il significato originale cambiando il registro linguistico.");
      }
      
      // Aggiungiamo un suggerimento in stile karate 
      suggerimentiGenerati.push("Come nel karate, la precisione è più importante della velocità. Rileggi sempre i tuoi testi con attenzione.");
    }
    
    // Aggiorniamo gli stati con gli errori e i suggerimenti
    setErroriEvidenziati(erroriSimulati);
    setSuggerimenti([...new Set(suggerimentiGenerati)]); // Rimuoviamo i duplicati
  };
  
  /**
   * Renderizza il prompt appropriato per il tipo di esercizio
   */
  const renderPrompt = () => {
    switch(prompt.tipo) {
      case 'scritturaLibera':
        return (
          <div className="esercizio-prompt">
            <h3>Scrivi liberamente</h3>
            <p>{prompt.testo}</p>
            <div className="karate-quote">
              <p>{randomQuote}</p>
            </div>
          </div>
        );
      
      case 'descrizioneImmagine':
        return (
          <div className="esercizio-prompt">
            <h3>Descrivi l'immagine</h3>
            <div className="immagine-simulata">
              <p><i className="fa fa-image"></i> {prompt.descrizione}</p>
            </div>
            <p>{prompt.richiesta}</p>
            <div className="karate-quote">
              <p>{randomQuote}</p>
            </div>
          </div>
        );
      
      case 'riscritturaTesti':
        return (
          <div className="esercizio-prompt">
            <h3>Riscrivi il testo</h3>
            <div className="testo-originale">
              {prompt.originale}
            </div>
            <p>{prompt.richiesta}</p>
            <div className="karate-quote">
              <p>{randomQuote}</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="esercizio-prompt">
            <p>Seleziona un tipo di esercizio per iniziare.</p>
            <div className="karate-quote">
              <p>{randomQuote}</p>
            </div>
          </div>
        );
    }
  };
  
  /**
   * Renderizza il pannello di feedback dopo l'invio del testo
   */
  const renderFeedbackPanel = () => {
    if (stato !== 'feedback') return null;
    
    // Calcoliamo la qualità del testo
    const lunghezzaTesto = testo.length;
    const numeroErrori = erroriEvidenziati.length;
    
    let qualita;
    if (lunghezzaTesto < 50) {
      qualita = "migliorabile";
    } else if (numeroErrori > 3) {
      qualita = "buona, con margini di miglioramento";
    } else {
      qualita = "ottima";
    }
    
    // Simuliamo un voto su 10
    const votoBase = lunghezzaTesto > 200 ? 8 : (lunghezzaTesto > 100 ? 7 : 6);
    const votoFinale = Math.max(5, Math.min(10, votoBase - (numeroErrori * 0.5)));
    const puntiGuadagnati = Math.floor(Math.random() * 30) + 20; // 20-50 punti
    
    return (
      <div className="feedback-panel">
        <h3>Feedback del Sensei</h3>
        
        <div className="valutazione">
          <div className="voto">{votoFinale.toFixed(1)}</div>
          <div className="descrizione-voto">
            <p>La qualità del tuo testo è <strong>{qualita}</strong>.</p>
            <p>Hai guadagnato <strong className="punti-guadagnati">+{puntiGuadagnati} punti</strong></p>
          </div>
        </div>
        
        {suggerimenti.length > 0 && (
          <div className="suggerimenti-linguistici">
            <h4>Suggerimenti per migliorare:</h4>
            <ul>
              {suggerimenti.map((suggerimento, index) => (
                <li key={index}>{suggerimento}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="prossimo-badge">
          <h4>Il tuo progresso:</h4>
          <div className="badge-info">
            <div className="badge-icon">
              <div className={`current-belt current-belt-${badgeAttuale.color || 'white'}`}></div>
            </div>
            <div className="badge-details">
              <p><strong>Livello attuale:</strong> {badgeAttuale.nome}</p>
              <p>{badgeAttuale.descrizione}</p>
              
              {badgeAttuale.nome !== badgeLevels[badgeLevels.length - 1].nome && (
                <>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min(100, ((puntiUtente - badgeAttuale.puntiRichiesti) / (getProssimoLivelloBadge().puntiRichiesti - badgeAttuale.puntiRichiesti)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="next-level">Prossimo livello: {getProssimoLivelloBadge().nome} ({getProssimoLivelloBadge().puntiRichiesti - puntiUtente} punti mancanti)</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <button className="primary-btn" onClick={iniziaNuovoEsercizio}>
          <i className="fa fa-plus-circle"></i> Nuovo Esercizio
        </button>
      </div>
    );
  };
  
  /**
   * Ottiene il prossimo livello badge
   */
  const getProssimoLivelloBadge = () => {
    const currentIndex = badgeLevels.findIndex(b => b.nome === badgeAttuale.nome);
    if (currentIndex < badgeLevels.length - 1) {
      return badgeLevels[currentIndex + 1];
    }
    return badgeAttuale; // Già al massimo livello
  };

  return (
    <div className="sezione-scrittura-container">
      <div className="scrittura-header">
        <h2>Esercizi di Scrittura</h2>
        <div className="badge-attuale">
          <div className={`belt-icon belt-${badgeAttuale.color || 'white'}`}></div>
          <span className="badge-text">{badgeAttuale.nome}</span>
        </div>
      </div>
      
      <div className="controls-panel">
        <div className="tipo-esercizio-selector">
          <label>Tipo di esercizio:</label>
          <select 
            value={tipoEsercizio}
            onChange={handleTipoEsercizioChange}
            disabled={stato === 'scrittura' || stato === 'feedback'}
          >
            <option value="scritturaLibera">Scrittura libera</option>
            <option value="descrizioneImmagine">Descrizione immagine</option>
            <option value="riscritturaTesti">Riscrittura testi</option>
          </select>
        </div>
        
        <div className="modalita-correzione-selector">
          <label>Modalità di correzione:</label>
          <select 
            value={modalitaCorrezione}
            onChange={handleModalitaCorrezioneChange}
          >
            <option value="finale">Alla fine</option>
            <option value="itinere">In itinere</option>
          </select>
        </div>
      </div>
      
      {renderPrompt()}
      
      <div className="editor-container">
        <textarea
          ref={textareaRef}
          value={testo}
          onChange={handleTestoChange}
          placeholder="Inizia a scrivere qui..."
          className={`testo-editor ${stato === 'feedback' ? 'readonly' : ''}`}
          readOnly={stato === 'feedback'}
        ></textarea>
        
        {erroriEvidenziati.length > 0 && modalitaCorrezione === 'itinere' && (
          <div className="errori-inline">
            <h4>Suggerimenti:</h4>
            <ul>
              {erroriEvidenziati.map((errore, index) => (
                <li key={index}>{errore.descrizione}</li>
              ))}
            </ul>
          </div>
        )}
        
        {stato === 'scrittura' && (
          <div className="editor-actions">
            <button className="primary-btn" onClick={inviaPerFeedback}>
              <i className="fa fa-check-circle"></i> Invia per Feedback
            </button>
          </div>
        )}
      </div>
      
      {renderFeedbackPanel()}
    </div>
  );
};

export default SezioneScrittura;