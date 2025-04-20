import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TorneoLinguaKai.css';

// Database di sfide per il torneo
const sfideDatabase = {
  grammatica: [
    {
      id: 'g1',
      livello: 'facile',
      tipo: 'sceltaMultipla',
      domanda: 'Quale forma è corretta?',
      opzioni: ['Io vadi a scuola', 'Io vo a scuola', 'Io vado a scuola', 'Io vado in scuola'],
      risposta: 'Io vado a scuola',
      spiegazione: 'La forma corretta del verbo "andare" alla prima persona singolare è "vado". Inoltre, si dice "andare a scuola", non "in scuola".'
    },
    {
      id: 'g2',
      livello: 'medio',
      tipo: 'sceltaMultipla',
      domanda: 'Individua la frase con l\'uso corretto del condizionale:',
      opzioni: [
        'Se lo saprò, te lo dirò.',
        'Se lo saprei, te lo direi.',
        'Se lo sapessi, te lo dirò.',
        'Se lo sapessi, te lo direi.'
      ],
      risposta: 'Se lo sapessi, te lo direi.',
      spiegazione: 'Nel periodo ipotetico della possibilità, si usa il congiuntivo imperfetto nella protasi (se lo sapessi) e il condizionale presente nell\'apodosi (te lo direi).'
    },
    {
      id: 'g3',
      livello: 'difficile',
      tipo: 'completamento',
      domanda: 'Completa con la forma corretta: "Nonostante ______ tardi, riuscimmo ad arrivare in tempo."',
      opzioni: ['era', 'fosse', 'sarebbe', 'è stato'],
      risposta: 'fosse',
      spiegazione: 'Dopo "nonostante" si usa il congiuntivo, quindi la forma corretta è "fosse".'
    }
  ],
  vocabolario: [
    {
      id: 'v1',
      livello: 'facile',
      tipo: 'sceltaMultipla',
      domanda: 'Qual è il sinonimo di "veloce"?',
      opzioni: ['Lento', 'Rapido', 'Pesante', 'Fragile'],
      risposta: 'Rapido',
      spiegazione: '"Rapido" è un sinonimo di "veloce", entrambi indicano qualcosa che si muove o avviene in poco tempo.'
    },
    {
      id: 'v2',
      livello: 'medio',
      tipo: 'abbinamento',
      domanda: 'Abbina i contrari:',
      opzioni: [
        { chiave: 'Generoso', valore: 'Avaro' },
        { chiave: 'Coraggioso', valore: 'Codardo' },
        { chiave: 'Estroverso', valore: 'Introverso' }
      ],
      risposta: [
        { chiave: 'Generoso', valore: 'Avaro' },
        { chiave: 'Coraggioso', valore: 'Codardo' },
        { chiave: 'Estroverso', valore: 'Introverso' }
      ],
      spiegazione: 'Questi sono esempi di coppie di parole con significati opposti.'
    },
    {
      id: 'v3',
      livello: 'difficile',
      tipo: 'sceltaMultipla',
      domanda: 'Quale di queste parole è un arcaismo?',
      opzioni: ['Automobile', 'Telefonino', 'Guaio', 'Tabellione'],
      risposta: 'Tabellione',
      spiegazione: '"Tabellione" è un arcaismo che indicava un antico ufficiale pubblico con funzioni simili a quelle del notaio. Le altre parole sono di uso comune o recente.'
    }
  ],
  comprensione: [
    {
      id: 'c1',
      livello: 'facile',
      tipo: 'veroFalso',
      testo: 'Maria è andata al mercato e ha comprato delle mele. Le mele erano rosse e molto dolci.',
      domanda: 'Maria ha comprato delle pere.',
      risposta: false,
      spiegazione: 'Il testo afferma chiaramente che Maria ha comprato delle mele, non delle pere.'
    },
    {
      id: 'c2',
      livello: 'medio',
      tipo: 'sceltaMultipla',
      testo: 'Giovanni ha deciso di non partecipare alla festa perché aveva troppo lavoro da finire. Tuttavia, alla fine ha cambiato idea e si è presentato verso la mezzanotte, sorprendendo tutti gli amici.',
      domanda: 'Perché gli amici di Giovanni erano sorpresi?',
      opzioni: [
        'Perché non era stato invitato',
        'Perché era arrivato in ritardo',
        'Perché aveva detto che non sarebbe venuto',
        'Perché aveva portato un regalo costoso'
      ],
      risposta: 'Perché aveva detto che non sarebbe venuto',
      spiegazione: 'Dal testo si evince che Giovanni inizialmente aveva deciso di non partecipare, quindi gli amici non si aspettavano di vederlo alla festa.'
    },
    {
      id: 'c3',
      livello: 'difficile',
      tipo: 'sceltaMultipla',
      testo: 'La democratizzazione dell\'informazione tramite internet ha avuto effetti ambivalenti sulla qualità del dibattito pubblico. Da un lato ha ampliato l\'accesso e la partecipazione dei cittadini, dall\'altro ha favorito la diffusione di notizie non verificate e la polarizzazione delle opinioni.',
      domanda: 'Qual è la tesi principale del testo?',
      opzioni: [
        'Internet ha migliorato il dibattito pubblico',
        'Internet ha peggiorato il dibattito pubblico',
        'Internet ha avuto effetti sia positivi che negativi sul dibattito pubblico',
        'Internet non ha influenzato il dibattito pubblico'
      ],
      risposta: 'Internet ha avuto effetti sia positivi che negativi sul dibattito pubblico',
      spiegazione: 'Il testo sostiene che internet ha avuto effetti "ambivalenti" sulla qualità del dibattito pubblico, illustrando sia aspetti positivi (ampliamento dell\'accesso) che negativi (diffusione di notizie non verificate).'
    }
  ]
};

// Nomi ispirati al calendario cinese per le sfide settimanali
const sfideSettimana = [
  { nome: "Drago d'Oro", descrizione: "Sfida di grammatica avanzata" },
  { nome: "Tigre di Giada", descrizione: "Sfida di comprensione del testo" },
  { nome: "Serpente d'Argento", descrizione: "Sfida di vocabolario espanso" },
  { nome: "Scimmia di Fuoco", descrizione: "Sfida sui modi di dire" },
  { nome: "Coniglio d'Acqua", descrizione: "Sfida di analisi logica" },
  { nome: "Gallo di Legno", descrizione: "Sfida di espressione scritta" },
  { nome: "Cane di Terra", descrizione: "Sfida di sinonimi e contrari" },
  { nome: "Topo di Metallo", descrizione: "Sfida di punteggiatura" },
  { nome: "Maiale di Cristallo", descrizione: "Sfida di etimologia" },
  { nome: "Cavallo di Vento", descrizione: "Sfida di espressione orale" }
];

// Database simulato dei giocatori
const giocatoriDB = [
  { id: 1, nome: "Marco", livello: "intermedio", punteggio: 850, vittorie: 12, avatar: "🧑" },
  { id: 2, nome: "Sofia", livello: "avanzato", punteggio: 1200, vittorie: 20, avatar: "👩" },
  { id: 3, nome: "Alex", livello: "principiante", punteggio: 300, vittorie: 5, avatar: "👦" },
  { id: 4, nome: "Giulia", livello: "intermedio", punteggio: 760, vittorie: 10, avatar: "👧" },
  { id: 5, nome: "Luca", livello: "avanzato", punteggio: 1100, vittorie: 18, avatar: "🧔" },
  { id: 6, nome: "Emma", livello: "avanzato", punteggio: 980, vittorie: 16, avatar: "👱‍♀️" },
  { id: 7, nome: "Davide", livello: "principiante", punteggio: 420, vittorie: 7, avatar: "🧒" },
  { id: 8, nome: "Chiara", livello: "intermedio", punteggio: 690, vittorie: 11, avatar: "👩‍🦰" }
];

// Componente principale per il Torneo Lingua Kai
const TorneoLinguaKai = () => {
  const [modalita, setModalita] = useState(null); // 'allenamento' o 'multiplayer'
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);
  const [livelloSelezionato, setLivelloSelezionato] = useState(null);
  const [sfideAttuali, setSfideAttuali] = useState([]);
  const [sfidaCorrente, setSfidaCorrente] = useState(null);
  const [indiceSfida, setIndiceSfida] = useState(0);
  const [mostraRisultato, setMostraRisultato] = useState(false);
  const [rispostaUtente, setRispostaUtente] = useState(null);
  const [punteggio, setPunteggio] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [timerAttivo, setTimerAttivo] = useState(false);
  const [avversarioSelezionato, setAvversarioSelezionato] = useState(null);
  const [mostraClassifica, setMostraClassifica] = useState(false);
  const [mostraAvversari, setMostraAvversari] = useState(false);
  const [sfidaSettimanaAttuale, setSfidaSettimanaAttuale] = useState(null);
  const [giocatoriClassifica, setGiocatoriClassifica] = useState([]);
  const [mostraSfidaSettimana, setMostraSfidaSettimana] = useState(false);
  const [abbinamenti, setAbbinamenti] = useState({});
  const [fase, setFase] = useState("selezione"); // selezione, sfida, risultato

  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Preleva una sfida settimanale casuale all'avvio
  useEffect(() => {
    const indiceRandom = Math.floor(Math.random() * sfideSettimana.length);
    setSfidaSettimanaAttuale(sfideSettimana[indiceRandom]);
    setGiocatoriClassifica([...giocatoriDB].sort((a, b) => b.punteggio - a.punteggio));
  }, []);

  // Gestione del timer
  useEffect(() => {
    if (timerAttivo) {
      intervalRef.current = setInterval(() => {
        setTempo(prevTempo => prevTempo + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerAttivo]);

  // Seleziona le sfide in base alla categoria e al livello
  const selezionaSfide = (categoria, livello) => {
    const sfideFiltrate = sfideDatabase[categoria].filter(sfida => 
      livello === 'tutti' || sfida.livello === livello
    );
    
    // Mescola e prendi 5 sfide (o meno se non ce ne sono abbastanza)
    const sfideMescolate = [...sfideFiltrate].sort(() => 0.5 - Math.random());
    return sfideMescolate.slice(0, Math.min(5, sfideMescolate.length));
  };

  // Avvia l'allenamento
  const avviaAllenamento = (categoria, livello) => {
    const sfideSelezionate = selezionaSfide(categoria, livello);
    if (sfideSelezionate.length === 0) {
      alert("Non ci sono sfide disponibili per questa combinazione di categoria e livello");
      return;
    }

    setCategoriaSelezionata(categoria);
    setLivelloSelezionato(livello);
    setSfideAttuali(sfideSelezionate);
    setSfidaCorrente(sfideSelezionate[0]);
    setIndiceSfida(0);
    setPunteggio(0);
    setTempo(0);
    setTimerAttivo(true);
    setFase("sfida");
  };

  // Avvia il multiplayer
  const avviaMultiplayer = (avversario) => {
    const categorieDisponibili = Object.keys(sfideDatabase);
    const categoriaRandom = categorieDisponibili[Math.floor(Math.random() * categorieDisponibili.length)];
    const sfideSelezionate = selezionaSfide(categoriaRandom, 'tutti');
    
    setAvversarioSelezionato(avversario);
    setCategoriaSelezionata(categoriaRandom);
    setLivelloSelezionato('tutti');
    setSfideAttuali(sfideSelezionate);
    setSfidaCorrente(sfideSelezionate[0]);
    setIndiceSfida(0);
    setPunteggio(0);
    setTempo(0);
    setTimerAttivo(true);
    setFase("sfida");
    setMostraAvversari(false);
  };

  // Gestisce la risposta dell'utente
  const gestisciRisposta = (risposta) => {
    setTimerAttivo(false);
    setRispostaUtente(risposta);

    // Calcola i punti in base alla risposta e al tempo
    let puntiGuadagnati = 0;
    const rispostaCorretta = sfidaCorrente.risposta === risposta;
    
    if (rispostaCorretta) {
      // Più punti se la risposta è veloce
      if (tempo < 5) {
        puntiGuadagnati = 100;
      } else if (tempo < 10) {
        puntiGuadagnati = 75;
      } else if (tempo < 15) {
        puntiGuadagnati = 50;
      } else {
        puntiGuadagnati = 25;
      }
    }

    setPunteggio(prevPunteggio => prevPunteggio + puntiGuadagnati);
    setMostraRisultato(true);
  };

  // Gestisce l'abbinamento nelle sfide di tipo "abbinamento"
  const gestisciAbbinamento = (chiave, valore) => {
    const nuoviAbbinamenti = { ...abbinamenti };
    nuoviAbbinamenti[chiave] = valore;
    setAbbinamenti(nuoviAbbinamenti);

    // Verifica se tutti gli abbinamenti sono stati fatti
    if (Object.keys(nuoviAbbinamenti).length === sfidaCorrente.opzioni.length) {
      // Verifica se gli abbinamenti sono corretti
      const abbinamentoCorretto = sfidaCorrente.opzioni.every(
        coppia => nuoviAbbinamenti[coppia.chiave] === coppia.valore
      );
      
      gestisciRisposta(abbinamentoCorretto);
    }
  };

  // Passa alla sfida successiva
  const prossimaFase = () => {
    // Se abbiamo finito tutte le sfide
    if (indiceSfida >= sfideAttuali.length - 1) {
      setFase("risultato");
      setTimerAttivo(false);
      return;
    }
    
    const nuovoIndice = indiceSfida + 1;
    setIndiceSfida(nuovoIndice);
    setSfidaCorrente(sfideAttuali[nuovoIndice]);
    setMostraRisultato(false);
    setRispostaUtente(null);
    setAbbinamenti({});
    setTempo(0);
    setTimerAttivo(true);
  };

  // Torna alla selezione della modalità
  const tornaSelezione = () => {
    setModalita(null);
    setFase("selezione");
    setTimerAttivo(false);
    setMostraRisultato(false);
    setAvversarioSelezionato(null);
    setPunteggio(0);
    setTempo(0);
    setSfidaCorrente(null);
    setSfideAttuali([]);
  };

  // Formatta il tempo per la visualizzazione
  const formattaTempo = (secondi) => {
    const minuti = Math.floor(secondi / 60);
    const secondiRimanenti = secondi % 60;
    return `${minuti.toString().padStart(2, '0')}:${secondiRimanenti.toString().padStart(2, '0')}`;
  };

  // Renderizza la sfida corrente
  const renderizzaSfida = () => {
    if (!sfidaCorrente) return null;

    const { tipo, domanda, opzioni, testo } = sfidaCorrente;

    return (
      <div className="sfida-container">
        {/* Se c'è un testo da leggere */}
        {testo && (
          <div className="sfida-testo">
            <h4>Leggi il seguente testo:</h4>
            <p>{testo}</p>
          </div>
        )}

        <div className="sfida-domanda">
          <h3>{domanda}</h3>
        </div>

        <div className="sfida-opzioni">
          {tipo === 'sceltaMultipla' && opzioni.map((opzione, index) => (
            <button
              key={index}
              className={`opzione-btn ${rispostaUtente === opzione ? (opzione === sfidaCorrente.risposta ? 'corretta' : 'errata') : ''}`}
              onClick={() => !mostraRisultato && gestisciRisposta(opzione)}
              disabled={mostraRisultato}
            >
              {opzione}
            </button>
          ))}

          {tipo === 'veroFalso' && (
            <>
              <button
                className={`opzione-btn ${rispostaUtente === true ? (sfidaCorrente.risposta === true ? 'corretta' : 'errata') : ''}`}
                onClick={() => !mostraRisultato && gestisciRisposta(true)}
                disabled={mostraRisultato}
              >
                Vero
              </button>
              <button
                className={`opzione-btn ${rispostaUtente === false ? (sfidaCorrente.risposta === false ? 'corretta' : 'errata') : ''}`}
                onClick={() => !mostraRisultato && gestisciRisposta(false)}
                disabled={mostraRisultato}
              >
                Falso
              </button>
            </>
          )}

          {tipo === 'completamento' && opzioni.map((opzione, index) => (
            <button
              key={index}
              className={`opzione-btn ${rispostaUtente === opzione ? (opzione === sfidaCorrente.risposta ? 'corretta' : 'errata') : ''}`}
              onClick={() => !mostraRisultato && gestisciRisposta(opzione)}
              disabled={mostraRisultato}
            >
              {opzione}
            </button>
          ))}

          {tipo === 'abbinamento' && (
            <div className="abbinamento-container">
              <div className="colonna-chiavi">
                {opzioni.map((coppia, index) => (
                  <div key={`chiave-${index}`} className="abbinamento-item">
                    <span>{coppia.chiave}</span>
                  </div>
                ))}
              </div>
              <div className="colonna-valori">
                {opzioni.map((coppia, index) => (
                  <div 
                    key={`valore-${index}`} 
                    className="abbinamento-item"
                    onClick={() => !mostraRisultato && gestisciAbbinamento(opzioni[index].chiave, coppia.valore)}
                  >
                    <span>{coppia.valore}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {mostraRisultato && (
          <div className={`risultato ${rispostaUtente === sfidaCorrente.risposta ? 'corretto' : 'errato'}`}>
            <h4>{rispostaUtente === sfidaCorrente.risposta ? 'Corretto!' : 'Errato!'}</h4>
            <p>{sfidaCorrente.spiegazione}</p>
            <button className="btn-next" onClick={prossimaFase}>
              {indiceSfida >= sfideAttuali.length - 1 ? "Vedi risultato finale" : "Prossima domanda"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Renderizza il risultato finale
  const renderizzaRisultatoFinale = () => {
    // Calcola statistiche
    const numSfide = sfideAttuali.length;
    const percentualeCorrette = (punteggio / (numSfide * 100)) * 100;
    const tempoTotale = formattaTempo(tempo);
    
    // Genera commento in base al punteggio
    let commento = "";
    if (percentualeCorrette >= 90) {
      commento = "Eccellente! Hai una padronanza impressionante della lingua italiana!";
    } else if (percentualeCorrette >= 75) {
      commento = "Ottimo lavoro! La tua conoscenza dell'italiano è molto buona.";
    } else if (percentualeCorrette >= 50) {
      commento = "Buon risultato! Continua a esercitarti per migliorare.";
    } else if (percentualeCorrette >= 30) {
      commento = "C'è margine di miglioramento. Continua a studiare!";
    } else {
      commento = "Continua ad allenarti! Con la pratica migliorerai sicuramente.";
    }

    return (
      <div className="risultato-finale">
        <h2>Risultato Finale</h2>
        
        {modalita === 'multiplayer' && avversarioSelezionato && (
          <div className="sfida-avversario-risultato">
            <h3>Sfida contro {avversarioSelezionato.nome} {avversarioSelezionato.avatar}</h3>
            <div className="confronto-risultati">
              <div className="risultato-giocatore">
                <h4>Il tuo punteggio</h4>
                <p className="punteggio-grande">{punteggio} punti</p>
              </div>
              <div className="vs">VS</div>
              <div className="risultato-avversario">
                <h4>Punteggio avversario</h4>
                <p className="punteggio-grande">
                  {/* Genera un punteggio casuale per l'avversario */}
                  {Math.floor(Math.random() * 500)}
                </p>
              </div>
            </div>
            <h3 className="risultato-vittoria">
              {punteggio > Math.floor(Math.random() * 500) 
                ? "Hai vinto! 🏆" 
                : "Hai perso! Ritenta!"}
            </h3>
          </div>
        )}
        
        <div className="statistiche">
          <div className="statistica">
            <span className="label">Punteggio totale:</span>
            <span className="valore">{punteggio} punti</span>
          </div>
          <div className="statistica">
            <span className="label">Risposte corrette:</span>
            <span className="valore">{Math.round(percentualeCorrette)}%</span>
          </div>
          <div className="statistica">
            <span className="label">Tempo totale:</span>
            <span className="valore">{tempoTotale}</span>
          </div>
          <div className="statistica">
            <span className="label">Categoria:</span>
            <span className="valore">{categoriaSelezionata}</span>
          </div>
          <div className="statistica">
            <span className="label">Livello:</span>
            <span className="valore">{livelloSelezionato === 'tutti' ? 'Misto' : livelloSelezionato}</span>
          </div>
        </div>
        
        <div className="commento-finale">
          <p>{commento}</p>
        </div>
        
        <div className="azioni-finali">
          <button className="btn-action" onClick={() => avviaAllenamento(categoriaSelezionata, livelloSelezionato)}>
            Riprova stessa categoria
          </button>
          <button className="btn-action" onClick={tornaSelezione}>
            Torna al menu
          </button>
        </div>
      </div>
    );
  };

  // Renderizza la modalità di selezione
  const renderizzaModalitaSelezione = () => {
    return (
      <div className="selezione-modalita">
        <div className="banner-torneo">
          <h1>Torneo Lingua Kai 🏯</h1>
          <p>Consolida le tue competenze linguistiche attraverso sfide emozionanti!</p>
        </div>
        
        <div className="opzioni-modalita">
          <div className="modalita-card" onClick={() => setModalita('allenamento')}>
            <div className="modalita-icon">🥋</div>
            <h3>Allenamento</h3>
            <p>Affronta sfide individuali per migliorare le tue abilità</p>
          </div>
          
          <div className="modalita-card" onClick={() => setModalita('multiplayer')}>
            <div className="modalita-icon">⚔️</div>
            <h3>Multiplayer</h3>
            <p>Sfida altri giocatori e scala la classifica</p>
          </div>
        </div>
        
        {sfidaSettimanaAttuale && (
          <div className="sfida-settimana" onClick={() => setMostraSfidaSettimana(true)}>
            <div className="sfida-settimana-banner">
              <h3>🔥 Sfida della Settimana 🔥</h3>
              <h4>{sfidaSettimanaAttuale.nome}</h4>
            </div>
            <p>{sfidaSettimanaAttuale.descrizione}</p>
            <button className="btn-action">Partecipa alla sfida!</button>
          </div>
        )}
        
        <div className="altre-opzioni">
          <button className="btn-secondary" onClick={() => setMostraClassifica(true)}>
            Visualizza Classifica 🏆
          </button>
        </div>
      </div>
    );
  };

  // Renderizza la selezione dell'allenamento
  const renderizzaSelezioneCategoriaAllenamento = () => {
    return (
      <div className="selezione-categoria">
        <h2>Scegli una categoria per allenarti</h2>
        
        <div className="categorie-grid">
          <div className="categoria-card" onClick={() => setCategoriaSelezionata('grammatica')}>
            <div className="categoria-icon">📝</div>
            <h3>Grammatica</h3>
            <p>Regole grammaticali, coniugazione verbi, sintassi</p>
          </div>
          
          <div className="categoria-card" onClick={() => setCategoriaSelezionata('vocabolario')}>
            <div className="categoria-icon">📚</div>
            <h3>Vocabolario</h3>
            <p>Sinonimi, contrari, significati, famiglie di parole</p>
          </div>
          
          <div className="categoria-card" onClick={() => setCategoriaSelezionata('comprensione')}>
            <div className="categoria-icon">🔍</div>
            <h3>Comprensione</h3>
            <p>Lettura e comprensione di testi, inferenze, significato</p>
          </div>
        </div>
        
        {categoriaSelezionata && (
          <div className="selezione-livello">
            <h3>Seleziona il livello di difficoltà per {categoriaSelezionata}</h3>
            
            <div className="livelli-container">
              <button 
                className="livello-btn" 
                onClick={() => avviaAllenamento(categoriaSelezionata, 'facile')}
              >
                Facile
              </button>
              <button 
                className="livello-btn" 
                onClick={() => avviaAllenamento(categoriaSelezionata, 'medio')}
              >
                Medio
              </button>
              <button 
                className="livello-btn" 
                onClick={() => avviaAllenamento(categoriaSelezionata, 'difficile')}
              >
                Difficile
              </button>
              <button 
                className="livello-btn" 
                onClick={() => avviaAllenamento(categoriaSelezionata, 'tutti')}
              >
                Tutti i livelli
              </button>
            </div>
            
            <button className="btn-back" onClick={() => setCategoriaSelezionata(null)}>
              Torna indietro
            </button>
          </div>
        )}
        
        <button className="btn-back" onClick={tornaSelezione}>
          Torna alla selezione modalità
        </button>
      </div>
    );
  };

  // Renderizza la selezione dell'avversario per il multiplayer
  const renderizzaSelezioneBattaglia = () => {
    return (
      <div className="selezione-battaglia">
        <h2>Modalità Multiplayer</h2>
        <p>Sfida altri giocatori e metti alla prova le tue conoscenze!</p>
        
        <div className="opzioni-battaglia">
          <button 
            className="btn-action" 
            onClick={() => setMostraAvversari(true)}
          >
            Scegli il tuo avversario
          </button>
          
          <button 
            className="btn-action" 
            onClick={() => {
              // Seleziona un avversario casuale
              const avversarioCasuale = giocatoriDB[Math.floor(Math.random() * giocatoriDB.length)];
              avviaMultiplayer(avversarioCasuale);
            }}
          >
            Sfida casuale
          </button>
        </div>
        
        <button className="btn-back" onClick={tornaSelezione}>
          Torna alla selezione modalità
        </button>
      </div>
    );
  };

  // Renderizza la classifica
  const renderizzaClassifica = () => {
    return (
      <div className="classifica-overlay">
        <div className="classifica-container">
          <h2>🏆 Classifica dei giocatori 🏆</h2>
          
          <div className="classifica-tabella">
            <div className="classifica-header">
              <div className="classifica-pos">Pos.</div>
              <div className="classifica-giocatore">Giocatore</div>
              <div className="classifica-livello">Livello</div>
              <div className="classifica-punteggio">Punteggio</div>
              <div className="classifica-vittorie">Vittorie</div>
            </div>
            
            {giocatoriClassifica.map((giocatore, index) => (
              <div 
                key={giocatore.id} 
                className={`classifica-riga ${index < 3 ? 'top-player' : ''}`}
              >
                <div className="classifica-pos">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div className="classifica-giocatore">
                  <span className="avatar">{giocatore.avatar}</span> {giocatore.nome}
                </div>
                <div className="classifica-livello">{giocatore.livello}</div>
                <div className="classifica-punteggio">{giocatore.punteggio}</div>
                <div className="classifica-vittorie">{giocatore.vittorie}</div>
              </div>
            ))}
          </div>
          
          <div className="premio-settimanale">
            <h3>Premio settimanale</h3>
            <p>Il vincitore della sfida "{sfidaSettimanaAttuale?.nome}" riceverà 500 punti bonus!</p>
          </div>
          
          <button className="btn-close" onClick={() => setMostraClassifica(false)}>
            Chiudi
          </button>
        </div>
      </div>
    );
  };

  // Renderizza la selezione dell'avversario
  const renderizzaSelezionAvversari = () => {
    return (
      <div className="avversari-overlay">
        <div className="avversari-container">
          <h2>Scegli il tuo avversario</h2>
          
          <div className="avversari-grid">
            {giocatoriDB.map((giocatore) => (
              <div 
                key={giocatore.id} 
                className="avversario-card"
                onClick={() => avviaMultiplayer(giocatore)}
              >
                <div className="avversario-avatar">{giocatore.avatar}</div>
                <h3>{giocatore.nome}</h3>
                <div className="avversario-stats">
                  <div className="stat">
                    <span className="label">Livello:</span>
                    <span className="valore">{giocatore.livello}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Punteggio:</span>
                    <span className="valore">{giocatore.punteggio}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Vittorie:</span>
                    <span className="valore">{giocatore.vittorie}</span>
                  </div>
                </div>
                <button className="btn-sfida">Sfida</button>
              </div>
            ))}
          </div>
          
          <button className="btn-close" onClick={() => setMostraAvversari(false)}>
            Annulla
          </button>
        </div>
      </div>
    );
  };

  // Renderizza i dettagli della sfida settimanale
  const renderizzaSfidaSettimana = () => {
    return (
      <div className="sfida-settimana-overlay">
        <div className="sfida-settimana-dettaglio">
          <h2>Sfida della Settimana</h2>
          <h3 className="nome-sfida">{sfidaSettimanaAttuale?.nome}</h3>
          
          <div className="sfida-settimana-info">
            <p className="descrizione">{sfidaSettimanaAttuale?.descrizione}</p>
            <div className="sfida-dettagli">
              <div className="dettaglio">
                <span className="label">Durata:</span>
                <span className="valore">7 giorni rimanenti</span>
              </div>
              <div className="dettaglio">
                <span className="label">Punti in palio:</span>
                <span className="valore">500 punti</span>
              </div>
              <div className="dettaglio">
                <span className="label">Partecipanti:</span>
                <span className="valore">24 giocatori</span>
              </div>
            </div>
          </div>
          
          <div className="premio-sfida">
            <h4>Premio speciale</h4>
            <p>Il vincitore della sfida riceverà il titolo speciale "{sfidaSettimanaAttuale?.nome}" visualizzato accanto al proprio nome!</p>
          </div>
          
          <div className="azioni-sfida">
            <button 
              className="btn-action" 
              onClick={() => {
                setMostraSfidaSettimana(false);
                // Avvia una sfida nella categoria appropriata
                const categoriaRandom = Object.keys(sfideDatabase)[Math.floor(Math.random() * Object.keys(sfideDatabase).length)];
                avviaAllenamento(categoriaRandom, 'difficile');
              }}
            >
              Accetta la sfida
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => setMostraSfidaSettimana(false)}
            >
              Torna indietro
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizza l'interfaccia in base alla fase attuale
  return (
    <div className="torneo-lingua-kai">
      {/* Header con punteggio e timer durante la sfida */}
      {fase === "sfida" && (
        <div className="sfida-header">
          <div className="sfida-info">
            <div className="categoria-badge">{categoriaSelezionata}</div>
            <div className="livello-badge">{livelloSelezionato === 'tutti' ? 'Misto' : livelloSelezionato}</div>
          </div>
          
          <div className="sfida-progress">
            <div className="progress-text">Domanda {indiceSfida + 1} di {sfideAttuali.length}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((indiceSfida + 1) / sfideAttuali.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="sfida-counters">
            <div className="punteggio">
              <span className="label">Punteggio:</span>
              <span className="valore">{punteggio}</span>
            </div>
            <div className="timer">
              <span className="label">Tempo:</span>
              <span className="valore">{formattaTempo(tempo)}</span>
            </div>
          </div>
          
          {modalita === 'multiplayer' && avversarioSelezionato && (
            <div className="avversario-info">
              <span>VS {avversarioSelezionato.avatar} {avversarioSelezionato.nome}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Contenuto principale */}
      <div className="torneo-content">
        {fase === "selezione" && !modalita && renderizzaModalitaSelezione()}
        
        {fase === "selezione" && modalita === 'allenamento' && renderizzaSelezioneCategoriaAllenamento()}
        
        {fase === "selezione" && modalita === 'multiplayer' && renderizzaSelezioneBattaglia()}
        
        {fase === "sfida" && renderizzaSfida()}
        
        {fase === "risultato" && renderizzaRisultatoFinale()}
      </div>
      
      {/* Overlay per la classifica */}
      {mostraClassifica && renderizzaClassifica()}
      
      {/* Overlay per la selezione degli avversari */}
      {mostraAvversari && renderizzaSelezionAvversari()}
      
      {/* Overlay per i dettagli della sfida settimanale */}
      {mostraSfidaSettimana && renderizzaSfidaSettimana()}
    </div>
  );
};

export default TorneoLinguaKai;