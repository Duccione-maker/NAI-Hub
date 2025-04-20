import React, { useState, useEffect, useRef } from 'react';
import './SezioneRegistri.css';

// Database di esempi per gli esercizi sui registri linguistici
const registriDatabase = {
  // Da informale a formale
  informaleFormale: [
    {
      titolo: "Invito ad una festa",
      testo: "Ciao Luca! Come va? Ti scrivo perché sabato faccio una festa a casa mia per il mio compleanno. Iniziamo verso le 8 di sera. Ci saranno un po' di amici, musica, pizza e birra. Fammi sapere se vieni, così ti mando l'indirizzo! Porta pure qualcuno se vuoi. Ciao!",
      contestoOriginale: "Messaggio WhatsApp a un amico",
      contestoTarget: "Email di invito formale",
      suggerimenti: ["Gentile", "La invito cordialmente", "sarà servito un rinfresco", "La prego di confermare", "Cordiali saluti"],
      esempio: "Gentile Dott. Bianchi,\n\nDesidero invitarLa al ricevimento che si terrà sabato 15 maggio presso la mia abitazione, in occasione del mio compleanno. L'evento avrà inizio alle ore 20:00.\n\nSarà servito un rinfresco e sarà presente un intrattenimento musicale. La prego di confermare la Sua partecipazione, così potrò fornirLe l'indirizzo esatto.\n\nSe desidera, può estendere l'invito a un accompagnatore.\n\nCordiali saluti,\nMarco Rossi"
    },
    {
      titolo: "Richiesta di informazioni",
      testo: "Ciao! Volevo sapere se avete ancora quel libro di cui ti parlavo l'altro giorno. Quanto costa? E fate anche spedizioni? Grazie mille!",
      contestoOriginale: "Messaggio su Instagram a una libreria",
      contestoTarget: "Email a una libreria",
      suggerimenti: ["Spettabile", "Sarei interessato/a ad acquistare", "Vorrei cortesemente sapere", "In attesa di un Vostro gentile riscontro", "Distinti saluti"],
      esempio: "Spettabile Libreria Cultura,\n\nSarei interessato/a ad acquistare il volume di cui abbiamo discusso recentemente. Vorrei cortesemente sapere se il libro è ancora disponibile presso il Vostro punto vendita.\n\nInoltre, gradirei conoscere il prezzo e se è previsto un servizio di spedizione a domicilio.\n\nIn attesa di un Vostro gentile riscontro, porgo distinti saluti.\n\nMario Rossi"
    },
    {
      titolo: "Lamentela per un disservizio",
      testo: "Salve, ieri ho ordinato una pizza da voi ma è arrivata fredda e con un'ora di ritardo! Non è la prima volta che succede. Così non va bene! Voglio un rimborso o almeno una pizza gratis la prossima volta.",
      contestoOriginale: "Messaggio alla pizzeria",
      contestoTarget: "Reclamo formale",
      suggerimenti: ["Egregio", "Mi trovo costretto a segnalare", "il servizio non ha rispettato gli standard", "Vi chiedo gentilmente", "Resto in attesa"],
      esempio: "Egregio Direttore,\n\nMi trovo costretto a segnalare un disservizio verificatosi in data 10 maggio. Ho effettuato un ordine a domicilio presso il Vostro esercizio commerciale, ma la consegna è avvenuta con oltre un'ora di ritardo rispetto al previsto e il prodotto è giunto in condizioni non ottimali (freddo).\n\nDevo purtroppo constatare che non si tratta del primo episodio di questa natura.\n\nVi chiedo gentilmente di prendere in considerazione la possibilità di un rimborso o, in alternativa, di un buono per un ordine futuro.\n\nResto in attesa di un Vostro cortese riscontro.\n\nCordiali saluti,\nLuisa Verdi"
    },
  ],
  
  // Da formale a informale
  formaleInformale: [
    {
      titolo: "Richiesta di appuntamento",
      testo: "Egregio Dottore,\n\nLe scrivo per richiedere un appuntamento presso il Suo studio medico per una visita di controllo. Sarei disponibile nei giorni di martedì e giovedì della prossima settimana, preferibilmente in orario pomeridiano.\n\nLa prego di comunicarmi la Sua disponibilità.\n\nCordiali saluti,\nMaria Rossi",
      contestoOriginale: "Email formale a un medico",
      contestoTarget: "Messaggio al medico di famiglia",
      suggerimenti: ["Ciao", "avrei bisogno di", "ti va bene", "fammi sapere", "grazie mille"],
      esempio: "Ciao dottore! Avrei bisogno di un controllo, ti va bene martedì o giovedì pomeriggio della prossima settimana? Fammi sapere quando sei libero. Grazie mille! Maria"
    },
    {
      titolo: "Comunicazione assenza",
      testo: "Gentile Prof.ssa Bianchi,\n\nCon la presente desidero comunicarLe che mio figlio Alessandro non potrà frequentare le lezioni nei giorni 5 e 6 maggio a causa di una visita medica specialistica programmata da tempo.\n\nLa prego di voler giustificare la sua assenza.\n\nRingraziandoLa per la comprensione, porgo distinti saluti.\n\nLucia Verdi",
      contestoOriginale: "Comunicazione scuola-famiglia",
      contestoTarget: "Messaggio WhatsApp all'insegnante",
      suggerimenti: ["Buongiorno prof", "volevo avvisare che", "deve andare", "grazie per la comprensione", "buona giornata"],
      esempio: "Buongiorno prof! Volevo avvisare che mio figlio Alessandro non potrà venire a scuola il 5 e 6 maggio perché deve andare da un medico specialista (visita prenotata da tempo). Grazie per la comprensione! Buona giornata, Lucia"
    },
    {
      titolo: "Richiesta di informazioni prodotto",
      testo: "Spettabile Ditta,\n\nSono interessato/a all'acquisto del modello di lavatrice XYZ-2000 presente nel Vostro catalogo online. Gradirei ricevere maggiori informazioni in merito alle specifiche tecniche, con particolare riferimento al consumo energetico e alle dimensioni precise del prodotto.\n\nInoltre, Vi chiedo gentilmente di indicarmi se è prevista la consegna a domicilio con installazione e se sono attualmente in corso promozioni.\n\nIn attesa di un Vostro cortese riscontro, porgo distinti saluti.\n\nGiorgio Neri",
      contestoOriginale: "Email ad un negozio di elettrodomestici",
      contestoTarget: "Chat online di assistenza clienti",
      suggerimenti: ["Ciao", "mi interesserebbe", "potresti dirmi", "vorrei sapere anche", "grazie in anticipo"],
      esempio: "Ciao! Mi interesserebbe comprare la lavatrice modello XYZ-2000 che ho visto sul vostro sito. Potresti dirmi quali sono i consumi e le misure esatte? Vorrei sapere anche se fate consegna a casa con installazione e se ci sono offerte in questo periodo. Grazie in anticipo! Giorgio"
    }
  ]
};

// Esempi di feedback pre-configurati
const feedbackTemplates = {
  ottimo: {
    valutazione: "Ottimo lavoro!",
    commento: "Hai saputo adattare perfettamente il registro linguistico al nuovo contesto. La scelta dei termini è appropriata e il tono è adeguato alla situazione comunicativa.",
    suggerimenti: []
  },
  buono: {
    valutazione: "Buon lavoro",
    commento: "La riscrittura è generalmente adeguata al nuovo contesto, con un registro linguistico perlopiù appropriato.",
    suggerimenti: [
      "Fai attenzione alla coerenza del registro in tutto il testo."
    ]
  },
  sufficiente: {
    valutazione: "Lavoro sufficiente",
    commento: "Hai compreso la necessità di modificare il registro, ma ci sono ancora elementi non adeguati al nuovo contesto.",
    suggerimenti: [
      "Presta più attenzione alle formule di apertura e chiusura.",
      "Considera il rapporto tra mittente e destinatario."
    ]
  },
  daRivedere: {
    valutazione: "Da rivedere",
    commento: "La riscrittura non riflette adeguatamente il cambiamento di registro richiesto.",
    suggerimenti: [
      "Rivedi la differenza tra registro formale e informale.",
      "Considera il contesto comunicativo e lo scopo del messaggio.",
      "Utilizza un lessico appropriato al registro richiesto."
    ]
  }
};

const SezioneRegistri = () => {
  // Stati
  const [direzione, setDirezione] = useState('informaleFormale'); // 'informaleFormale' o 'formaleInformale'
  const [esercizioCorrente, setEsercizioCorrente] = useState(null);
  const [testo, setTesto] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showEsempio, setShowEsempio] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Refs
  const textareaRef = useRef(null);
  
  // Carica un esercizio all'avvio o quando cambia la direzione
  useEffect(() => {
    caricaNuovoEsercizio();
  }, [direzione]);
  
  // Funzione per caricare un nuovo esercizio
  const caricaNuovoEsercizio = () => {
    setLoading(true);
    
    // Reset stati
    setTesto('');
    setIsSubmitted(false);
    setFeedback(null);
    setShowEsempio(false);
    
    // Seleziona casualmente un esercizio dalla direzione corrente
    const esercizi = registriDatabase[direzione];
    const randomIndex = Math.floor(Math.random() * esercizi.length);
    const nuovoEsercizio = esercizi[randomIndex];
    
    setEsercizioCorrente(nuovoEsercizio);
    
    // Simula caricamento
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };
  
  // Gestisce il cambio di direzione
  const handleDirezioneChange = (e) => {
    setDirezione(e.target.value);
  };
  
  // Gestisce il cambio di testo
  const handleTestoChange = (e) => {
    setTesto(e.target.value);
  };
  
  // Invia il testo per valutazione
  const handleSubmit = () => {
    if (!testo.trim()) {
      alert('Inserisci il testo prima di inviare.');
      return;
    }
    
    setLoading(true);
    
    // Simula analisi AI del testo
    setTimeout(() => {
      const valutazione = valutaTesto(testo);
      setFeedback(valutazione);
      setIsSubmitted(true);
      setLoading(false);
    }, 1500);
  };
  
  // Funzione che valuta il testo (simulata)
  const valutaTesto = (testo) => {
    // In un'implementazione reale, qui ci sarebbe un'analisi del testo
    // basata su NLP o chiamata a un servizio di AI
    
    // Per ora, facciamo una valutazione simulata basata sulla lunghezza e 
    // sulla presenza di alcune parole chiave dai suggerimenti
    
    const lunghezza = testo.length;
    let trovati = 0;
    
    if (esercizioCorrente && esercizioCorrente.suggerimenti) {
      // Conta quanti suggerimenti sono stati utilizzati
      esercizioCorrente.suggerimenti.forEach(suggerimento => {
        if (testo.toLowerCase().includes(suggerimento.toLowerCase())) {
          trovati++;
        }
      });
    }
    
    // Punteggio basato su lunghezza e suggerimenti usati
    const punteggio = Math.min(10, Math.max(1, Math.floor(lunghezza / 50) + trovati));
    
    // Selezione del feedback in base al punteggio
    let feedbackBase;
    if (punteggio >= 8) {
      feedbackBase = feedbackTemplates.ottimo;
    } else if (punteggio >= 6) {
      feedbackBase = feedbackTemplates.buono;
    } else if (punteggio >= 4) {
      feedbackBase = feedbackTemplates.sufficiente;
    } else {
      feedbackBase = feedbackTemplates.daRivedere;
    }
    
    // Personalizza i suggerimenti in base al contesto
    const suggerimentiPersonalizzati = [...feedbackBase.suggerimenti];
    if (direzione === 'informaleFormale' && punteggio < 8) {
      suggerimentiPersonalizzati.push("Utilizza forme di cortesia come 'Lei' e 'Voi'.");
      if (punteggio < 6) {
        suggerimentiPersonalizzati.push("Evita abbreviazioni e termini colloquiali.");
      }
    } else if (direzione === 'formaleInformale' && punteggio < 8) {
      suggerimentiPersonalizzati.push("Usa un tono più diretto e frasi più brevi.");
      if (punteggio < 6) {
        suggerimentiPersonalizzati.push("Non esagerare con i convenevoli e le formule di cortesia.");
      }
    }
    
    return {
      punteggio: punteggio,
      valutazione: feedbackBase.valutazione,
      commento: feedbackBase.commento,
      suggerimenti: suggerimentiPersonalizzati
    };
  };
  
  // Funzione per mostrare/nascondere l'esempio
  const toggleEsempio = () => {
    setShowEsempio(!showEsempio);
  };
  
  // Funzione per iniziare un nuovo esercizio
  const handleNuovoEsercizio = () => {
    caricaNuovoEsercizio();
  };
  
  // Determina il titolo della sezione in base alla direzione
  const getTitolo = () => {
    if (direzione === 'informaleFormale') {
      return "Da registro informale a formale";
    } else {
      return "Da registro formale a informale";
    }
  };
  
  // Renderizza il componente
  return (
    <div className="sezione-registri-container">
      <div className="registri-header">
        <h2>Registri Linguistici</h2>
        
        <div className="direzione-selector">
          <label>Direzione:</label>
          <select 
            value={direzione}
            onChange={handleDirezioneChange}
            disabled={loading || isSubmitted}
          >
            <option value="informaleFormale">Da Informale a Formale</option>
            <option value="formaleInformale">Da Formale a Informale</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">Caricamento in corso...</div>
        </div>
      ) : esercizioCorrente ? (
        <>
          <div className="esercizio-container">
            <h3>{getTitolo()}: {esercizioCorrente.titolo}</h3>
            
            <div className="contesto-originale">
              <p>
                <strong>Contesto originale:</strong> {esercizioCorrente.contestoOriginale}
              </p>
            </div>
            
            <div className="testo-originale">
              <h4>Testo originale:</h4>
              <p>{esercizioCorrente.testo}</p>
            </div>
            
            <div className="contesto-target">
              <p>
                <strong>Nuovo contesto:</strong> {esercizioCorrente.contestoTarget}
              </p>
              <p className="istruzioni">
                Riscrivi il testo adattandolo al nuovo contesto, utilizzando il registro linguistico appropriato.
              </p>
            </div>
            
            <div className="suggerimenti-box">
              <h4>Suggerimenti:</h4>
              <ul className="suggerimenti-lista">
                {esercizioCorrente.suggerimenti.map((suggerimento, index) => (
                  <li key={index}>{suggerimento}</li>
                ))}
              </ul>
            </div>
            
            <div className="editor-container">
              <textarea
                ref={textareaRef}
                value={testo}
                onChange={handleTestoChange}
                placeholder="Scrivi qui la tua riscrittura..."
                className="testo-editor"
                disabled={isSubmitted}
              />
              
              {!isSubmitted && (
                <div className="action-buttons">
                  <button 
                    className="primary-btn"
                    onClick={handleSubmit}
                    disabled={!testo.trim() || loading}
                  >
                    Invia
                  </button>
                  
                  <button 
                    className="secondary-btn"
                    onClick={toggleEsempio}
                    disabled={loading}
                  >
                    {showEsempio ? 'Nascondi esempio' : 'Mostra esempio'}
                  </button>
                </div>
              )}
            </div>
            
            {showEsempio && (
              <div className="esempio-container">
                <h4>Esempio di riscrittura:</h4>
                <div className="esempio-text">
                  <p>{esercizioCorrente.esempio}</p>
                </div>
                <p className="esempio-disclaimer">
                  Nota: questo è solo un esempio. Ci sono molti modi corretti di adattare un testo 
                  a un nuovo registro linguistico.
                </p>
              </div>
            )}
          </div>
          
          {isSubmitted && feedback && (
            <div className="feedback-container">
              <div className="feedback-header">
                <h3>Feedback</h3>
                <div className="punteggio-container">
                  <div className="punteggio-circle">
                    <span>{feedback.punteggio}</span>
                  </div>
                  <div className="punteggio-label">/10</div>
                </div>
              </div>
              
              <div className="feedback-body">
                <p className="valutazione">{feedback.valutazione}</p>
                <p className="commento">{feedback.commento}</p>
                
                {feedback.suggerimenti.length > 0 && (
                  <div className="feedback-suggerimenti">
                    <h4>Suggerimenti per migliorare:</h4>
                    <ul>
                      {feedback.suggerimenti.map((suggerimento, index) => (
                        <li key={index}>{suggerimento}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="confronto-container">
                  <div className="testo-utente">
                    <h4>La tua riscrittura:</h4>
                    <p>{testo}</p>
                  </div>
                </div>
                
                <div className="next-actions">
                  <button 
                    className="primary-btn"
                    onClick={handleNuovoEsercizio}
                  >
                    Nuovo esercizio
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="no-content">
          Impossibile caricare l'esercizio. Si prega di riprovare.
        </div>
      )}
    </div>
  );
};

export default SezioneRegistri;