/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useContext } from 'react';
import './SupportoLinguistico.css';
import { UserContext } from '../../../contexts/contexts/UserContext';
// Database di supporto linguistico per diverse lingue
const supportoLinguisticoDatabase = {
  // Albanese
  albanese: {
    nome: "Shqip",
    glossario: {
      "buongiorno": "mirëdita",
      "grazie": "faleminderit",
      "prego": "ju lutem",
      "scuola": "shkollë",
      "insegnante": "mësues",
      "libro": "libër",
      "scrivere": "shkruaj",
      "leggere": "lexoj",
      "studiare": "studioj",
      "compiti": "detyra",
      "classe": "klasë",
      "esame": "provim",
      "esercizio": "ushtrim",
      "risposta": "përgjigje",
      "domanda": "pyetje"
    },
    frasi: {
      "Come stai?": "Si jeni?",
      "Non ho capito": "Nuk e kuptova",
      "Puoi ripetere per favore?": "Mund ta përsërisni ju lutem?",
      "Ho bisogno di aiuto": "Kam nevojë për ndihmë",
      "Dov'è il bagno?": "Ku është banjo?",
      "A che ora finisce la lezione?": "Në çfarë ore mbaron mësimi?"
    },
    regole: [
      "In albanese, gli articoli vengono posizionati dopo il sostantivo, non prima.",
      "L'albanese usa un alfabeto latino modificato con 36 lettere.",
      "Il verbo in albanese si coniuga in base alla persona, al tempo e al modo.",
      "In albanese, gli aggettivi seguono i sostantivi che modificano."
    ],
    suggerimenti: [
      "Fai attenzione all'uso degli articoli in italiano, che vanno prima del sostantivo.",
      "Le doppie consonanti in italiano non esistono in albanese.",
      "I generi in italiano (maschile/femminile) possono essere diversi rispetto all'albanese."
    ]
  },
  
  // Kosovaro
  kosovaro: {
    nome: "Shqip (Kosovë)",
    glossario: {
      "buongiorno": "mirëdita",
      "grazie": "faleminderit",
      "prego": "ju lutem",
      "scuola": "shkollë",
      "insegnante": "mësues",
      "libro": "libër",
      "scrivere": "shkruaj",
      "leggere": "lexoj",
      "studiare": "studioj",
      "compiti": "detyra",
      "classe": "klasë",
      "esame": "provim",
      "esercizio": "ushtrim",
      "risposta": "përgjigje",
      "domanda": "pyetje"
    },
    frasi: {
      "Come stai?": "Si je?",
      "Non ho capito": "Nuk e kuptova",
      "Puoi ripetere per favore?": "A mundesh me përsërit?",
      "Ho bisogno di aiuto": "Kam nevojë për ndihmë",
      "Dov'è il bagno?": "Ku është banjo?",
      "A che ora finisce la lezione?": "Në çfarë ore përfundon mësimi?"
    },
    regole: [
      "Il kosovaro è una variante dell'albanese con alcune differenze dialettali.",
      "Alcune parole possono avere pronunce leggermente diverse rispetto all'albanese standard.",
      "Il kosovaro mantiene la stessa struttura grammaticale dell'albanese.",
      "Esistono alcune influenze lessicali dal serbo nel kosovaro."
    ],
    suggerimenti: [
      "Le regole grammaticali italiane per gli articoli sono diverse dal kosovaro.",
      "In italiano, presta attenzione alle consonanti doppie che non esistono in kosovaro.",
      "La struttura della frase in italiano (soggetto-verbo-oggetto) è simile a quella kosovara."
    ]
  },
  
  // Indiano (Hindi)
  indiano: {
    nome: "हिन्दी (Hindi)",
    glossario: {
      "buongiorno": "नमस्ते (namaste)",
      "grazie": "धन्यवाद (dhanyavaad)",
      "prego": "आपका स्वागत है (aapka svaagat hai)",
      "scuola": "स्कूल (school)",
      "insegnante": "शिक्षक (shikshak)",
      "libro": "किताब (kitaab)",
      "scrivere": "लिखना (likhna)",
      "leggere": "पढ़ना (padhna)",
      "studiare": "पढ़ाई करना (padhai karna)",
      "compiti": "होमवर्क (homework)",
      "classe": "कक्षा (kaksha)",
      "esame": "परीक्षा (pariksha)",
      "esercizio": "अभ्यास (abhyaas)",
      "risposta": "उत्तर (uttar)",
      "domanda": "प्रश्न (prashn)"
    },
    frasi: {
      "Come stai?": "आप कैसे हैं? (aap kaise hain?)",
      "Non ho capito": "मैंने नहीं समझा (maine nahin samjha)",
      "Puoi ripetere per favore?": "क्या आप दोहरा सकते हैं? (kya aap dohra sakte hain?)",
      "Ho bisogno di aiuto": "मुझे मदद चाहिए (mujhe madad chahiye)",
      "Dov'è il bagno?": "बाथरूम कहाँ है? (bathroom kahan hai?)",
      "A che ora finisce la lezione?": "कक्षा कब खत्म होगी? (kaksha kab khatm hogi?)"
    },
    regole: [
      "L'hindi usa la scrittura Devanagari, completamente diversa dall'alfabeto latino.",
      "La struttura della frase in hindi è generalmente soggetto-oggetto-verbo.",
      "L'hindi non ha articoli (il, lo, la, etc.) come l'italiano.",
      "I verbi in hindi cambiano in base al genere del soggetto."
    ],
    suggerimenti: [
      "In italiano, fai attenzione all'uso degli articoli che non esistono in hindi.",
      "La posizione del verbo in italiano (dopo il soggetto) è diversa dall'hindi.",
      "In italiano, i verbi si coniugano in base alla persona, non al genere come in hindi.",
      "Presta attenzione ai tempi verbali italiani che sono strutturati diversamente dall'hindi."
    ]
  },
  
  // Arabo
  arabo: {
    nome: "العربية (Arabo)",
    glossario: {
      "buongiorno": "صباح الخير (sabah al-khayr)",
      "grazie": "شكرا (shukran)",
      "prego": "عفوا (afwan)",
      "scuola": "مدرسة (madrasa)",
      "insegnante": "مدرّس (mudarris)",
      "libro": "كتاب (kitaab)",
      "scrivere": "يكتب (yaktub)",
      "leggere": "يقرأ (yaqra')",
      "studiare": "يدرس (yadrus)",
      "compiti": "واجبات (wajibat)",
      "classe": "صف (saff)",
      "esame": "امتحان (imtihan)",
      "esercizio": "تمرين (tamrin)",
      "risposta": "جواب (jawab)",
      "domanda": "سؤال (su'al)"
    },
    frasi: {
      "Come stai?": "كيف حالك؟ (kayfa haluk?)",
      "Non ho capito": "لم أفهم (lam afham)",
      "Puoi ripetere per favore?": "هل يمكنك أن تكرر من فضلك؟ (hal yumkinuka an tukarrir min fadlik?)",
      "Ho bisogno di aiuto": "أحتاج إلى مساعدة (ahtaju ila musa'ada)",
      "Dov'è il bagno?": "أين الحمام؟ (ayna al-hammam?)",
      "A che ora finisce la lezione?": "متى تنتهي الدرس؟ (mata tantahi ad-dars?)"
    },
    regole: [
      "L'arabo si scrive da destra a sinistra.",
      "L'arabo ha una struttura verbale-soggetto-oggetto.",
      "I sostantivi in arabo hanno genere (maschile o femminile).",
      "L'arabo non usa le lettere maiuscole."
    ],
    suggerimenti: [
      "In italiano, si scrive da sinistra a destra, al contrario dell'arabo.",
      "Presta attenzione all'uso delle maiuscole in italiano, che non esistono in arabo.",
      "La struttura della frase italiana (soggetto-verbo-oggetto) è diversa dall'arabo.",
      "Gli articoli in italiano hanno forme diverse in base al genere e numero."
    ]
  },
  
  // Rumeno
  rumeno: {
    nome: "Română",
    glossario: {
      "buongiorno": "bună ziua",
      "grazie": "mulțumesc",
      "prego": "cu plăcere",
      "scuola": "școală",
      "insegnante": "profesor",
      "libro": "carte",
      "scrivere": "a scrie",
      "leggere": "a citi",
      "studiare": "a studia",
      "compiti": "teme",
      "classe": "clasă",
      "esame": "examen",
      "esercizio": "exercițiu",
      "risposta": "răspuns",
      "domanda": "întrebare"
    },
    frasi: {
      "Come stai?": "Ce mai faci?",
      "Non ho capito": "Nu am înțeles",
      "Puoi ripetere per favore?": "Poți repeta, te rog?",
      "Ho bisogno di aiuto": "Am nevoie de ajutor",
      "Dov'è il bagno?": "Unde este toaleta?",
      "A che ora finisce la lezione?": "La ce oră se termină lecția?"
    },
    regole: [
      "Il rumeno è una lingua romanza, come l'italiano, quindi ha molte somiglianze.",
      "Il rumeno utilizza alcuni caratteri speciali: ă, â, î, ș, ț.",
      "Il rumeno ha tre generi: maschile, femminile e neutro.",
      "Gli articoli definiti si aggiungono alla fine delle parole in rumeno."
    ],
    suggerimenti: [
      "Essendo entrambe lingue romanze, molte parole sono simili tra italiano e rumeno.",
      "In italiano, gli articoli vanno prima del sostantivo, non alla fine come in rumeno.",
      "Fai attenzione alla pronuncia delle doppie consonanti in italiano, che in rumeno non esistono.",
      "I verbi ausiliari in italiano (avere, essere) si usano diversamente rispetto al rumeno."
    ]
  }
};

// Livelli di supporto disponibili
const livelliSupporto = [
  { id: "completo", nome: "Completo", descrizione: "Tutte le funzionalità di supporto attive" },
  { id: "intermedio", nome: "Intermedio", descrizione: "Glossario e suggerimenti, senza traduzioni automatiche" },
  { id: "base", nome: "Base", descrizione: "Solo glossario essenziale" },
  { id: "disattivato", nome: "Disattivato", descrizione: "Nessun supporto" }
];

const SupportoLinguistico = ({ onClose, currentSection }) => {
  const { user } = useContext(UserContext) || { user: null };
  const [linguaSelezionata, setLinguaSelezionata] = useState("");
  const [livelloSupporto, setLivelloSupporto] = useState("completo");
  const [ricercaGlossario, setRicercaGlossario] = useState("");
  const [visualizzazioneAttiva, setVisualizzazioneAttiva] = useState("glossario");
  const [erroriComuni, setErroriComuni] = useState([]);
  const [glossarioFiltrato, setGlossarioFiltrato] = useState({});
  const [isActive, setIsActive] = useState(true);
  
  // Effetto per caricare le preferenze dell'utente
  useEffect(() => {
    if (user) {
      // In un'implementazione reale, queste informazioni verrebbero caricate dal profilo utente
      const linguaPredefinita = user.linguaMadre || localStorage.getItem('linguaPredefinita') || "";
      const livelloPredefinito = user.livelloSupporto || localStorage.getItem('livelloSupporto') || "completo";
      
      if (linguaPredefinita && supportoLinguisticoDatabase[linguaPredefinita]) {
        setLinguaSelezionata(linguaPredefinita);
      }
      
      if (livelloPredefinito) {
        setLivelloSupporto(livelloPredefinito);
      }
      
      // Carica errori comuni simulati basati sulla sezione corrente
      caricaErroriComuni(currentSection);
    }
  }, [user, currentSection]);
  
  // Effetto per filtrare il glossario in base alla ricerca
  useEffect(() => {
    if (linguaSelezionata && supportoLinguisticoDatabase[linguaSelezionata]) {
      const glossarioCompleto = supportoLinguisticoDatabase[linguaSelezionata].glossario;
      
      if (ricercaGlossario.trim() === "") {
        setGlossarioFiltrato(glossarioCompleto);
      } else {
        const termini = {};
        Object.entries(glossarioCompleto).forEach(([italiano, traduzione]) => {
          if (italiano.toLowerCase().includes(ricercaGlossario.toLowerCase()) || 
              traduzione.toLowerCase().includes(ricercaGlossario.toLowerCase())) {
            termini[italiano] = traduzione;
          }
        });
        setGlossarioFiltrato(termini);
      }
    }
  }, [linguaSelezionata, ricercaGlossario]);
  
  // Funzione per caricare gli errori comuni simulati
  const caricaErroriComuni = (sezione) => {
    // In una versione reale, questi dati verrebbero da un'API o da un'analisi degli errori dello studente
    const erroriPerSezione = {
      lettura: [
        "Difficoltà con le doppie consonanti",
        "Confusione tra 'e' ed 'è'",
        "Problemi con la pronuncia di 'gl' e 'gn'"
      ],
      scrittura: [
        "Omissione degli articoli",
        "Errato accordo tra soggetto e verbo",
        "Uso scorretto delle preposizioni"
      ],
      punteggiatura: [
        "Assenza di punteggiatura",
        "Uso errato della virgola",
        "Confusione tra punto e virgola e due punti"
      ],
      registri: [
        "Uso inappropriato del tu/Lei",
        "Lessico troppo informale in contesti formali",
        "Strutture sintattiche non adatte al registro richiesto"
      ]
    };
    
    setErroriComuni(erroriPerSezione[sezione] || []);
  };
  
  // Gestione del cambio lingua
  const handleChangeLingua = (e) => {
    const nuovaLingua = e.target.value;
    setLinguaSelezionata(nuovaLingua);
    localStorage.setItem('linguaPredefinita', nuovaLingua);
    
    // Reset della ricerca per mostrare il glossario completo della nuova lingua
    setRicercaGlossario("");
  };
  
  // Gestione del cambio livello di supporto
  const handleChangeLivelloSupporto = (e) => {
    const nuovoLivello = e.target.value;
    setLivelloSupporto(nuovoLivello);
    localStorage.setItem('livelloSupporto', nuovoLivello);
  };
  
  // Gestione della ricerca nel glossario
  const handleSearchGlossario = (e) => {
    setRicercaGlossario(e.target.value);
  };
  
  // Funzione per ascoltare la pronuncia (simulata)
  const ascoltaPronuncia = (parola) => {
    console.log(`Riproduci audio per: ${parola}`);
    // In una versione reale, qui ci sarebbe l'integrazione con un sistema TTS
    alert(`Riproduzione audio per: ${parola}`);
  };
  
  // Funzione per cambiare la visualizzazione attiva
  const cambiaVisualizzazione = (vista) => {
    setVisualizzazioneAttiva(vista);
  };
  
  // Funzione per minimizzare/espandere il supporto
  const toggleActive = () => {
    setIsActive(!isActive);
  };
  
  // Se non c'è una lingua selezionata o il supporto è disattivato, mostra un'interfaccia minima
  if (!linguaSelezionata || livelloSupporto === "disattivato") {
    return (
      <div className={`supporto-linguistico-widget ${isActive ? 'active' : 'minimized'}`}>
        <div className="supporto-header">
          <h3>Supporto Linguistico</h3>
          <button className="toggle-button" onClick={toggleActive}>
            {isActive ? '−' : '+'}
          </button>
        </div>
        
        {isActive && (
          <div className="supporto-content">
            <div className="lingua-selector">
              <label>Seleziona la tua lingua madre:</label>
              <select value={linguaSelezionata} onChange={handleChangeLingua}>
                <option value="">Seleziona una lingua</option>
                {Object.entries(supportoLinguisticoDatabase).map(([codice, lingua]) => (
                  <option key={codice} value={codice}>{lingua.nome}</option>
                ))}
              </select>
            </div>
            
            <div className="livello-supporto">
              <label>Livello di supporto:</label>
              <select value={livelloSupporto} onChange={handleChangeLivelloSupporto}>
                {livelliSupporto.map(livello => (
                  <option key={livello.id} value={livello.id}>{livello.nome} - {livello.descrizione}</option>
                ))}
              </select>
            </div>
            
            <div className="supporto-footer">
              <button className="close-button" onClick={onClose}>Chiudi</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Interfaccia completa con il supporto attivo
  return (
    <div className={`supporto-linguistico-widget ${isActive ? 'active' : 'minimized'}`}>
      <div className="supporto-header">
        <h3>Supporto Linguistico - {supportoLinguisticoDatabase[linguaSelezionata].nome}</h3>
        <div className="header-controls">
          <select value={livelloSupporto} onChange={handleChangeLivelloSupporto} className="livello-select">
            {livelliSupporto.map(livello => (
              <option key={livello.id} value={livello.id}>{livello.nome}</option>
            ))}
          </select>
          <button className="toggle-button" onClick={toggleActive}>
            {isActive ? '−' : '+'}
          </button>
        </div>
      </div>
      
      {isActive && (
        <div className="supporto-content">
          <div className="tabs">
            <button 
              className={visualizzazioneAttiva === 'glossario' ? 'active' : ''} 
              onClick={() => cambiaVisualizzazione('glossario')}
            >
              Glossario
            </button>
            <button 
              className={visualizzazioneAttiva === 'frasi' ? 'active' : ''} 
              onClick={() => cambiaVisualizzazione('frasi')}
            >
              Frasi Utili
            </button>
            <button 
              className={visualizzazioneAttiva === 'regole' ? 'active' : ''} 
              onClick={() => cambiaVisualizzazione('regole')}
            >
              Regole
            </button>
            <button 
              className={visualizzazioneAttiva === 'suggerimenti' ? 'active' : ''} 
              onClick={() => cambiaVisualizzazione('suggerimenti')}
            >
              Suggerimenti
            </button>
            {erroriComuni.length > 0 && (
              <button 
                className={visualizzazioneAttiva === 'errori' ? 'active' : ''} 
                onClick={() => cambiaVisualizzazione('errori')}
              >
                Errori Comuni
              </button>
            )}
          </div>
          
          {visualizzazioneAttiva === 'glossario' && (
            <div className="glossario-view">
              <div className="glossario-search">
                <input 
                  type="text" 
                  placeholder="Cerca nel glossario..." 
                  value={ricercaGlossario}
                  onChange={handleSearchGlossario}
                />
              </div>
              
              <div className="glossario-list">
                {Object.entries(glossarioFiltrato).length > 0 ? (
                  Object.entries(glossarioFiltrato).map(([italiano, traduzione], index) => (
                    <div key={index} className="glossario-item">
                      <div className="italiano-termine">
                        <span className="termine">{italiano}</span>
                        <button 
                          className="audio-button" 
                          onClick={() => ascoltaPronuncia(italiano)}
                          title="Ascolta pronuncia in italiano"
                        >
                          🔊
                        </button>
                      </div>
                      <div className="traduzione-termine">
                        <span className="termine">{traduzione}</span>
                        <button 
                          className="audio-button" 
                          onClick={() => ascoltaPronuncia(traduzione)}
                          title="Ascolta pronuncia nella lingua madre"
                        >
                          🔊
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="nessun-risultato">Nessun termine trovato. Prova una ricerca diversa.</p>
                )}
              </div>
            </div>
          )}
          
          {visualizzazioneAttiva === 'frasi' && (
            <div className="frasi-view">
              <h4>Frasi utili per la comunicazione</h4>
              <div className="frasi-list">
                {Object.entries(supportoLinguisticoDatabase[linguaSelezionata].frasi).map(([italiano, traduzione], index) => (
                  <div key={index} className="frase-item">
                    <div className="italiano-frase">
                      <span className="frase">{italiano}</span>
                      <button 
                        className="audio-button" 
                        onClick={() => ascoltaPronuncia(italiano)}
                        title="Ascolta pronuncia in italiano"
                      >
                        🔊
                      </button>
                    </div>
                    <div className="traduzione-frase">
                      <span className="frase">{traduzione}</span>
                      <button 
                        className="audio-button" 
                        onClick={() => ascoltaPronuncia(traduzione)}
                        title="Ascolta pronuncia nella lingua madre"
                      >
                        🔊
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {visualizzazioneAttiva === 'regole' && (
            <div className="regole-view">
              <h4>Regole grammaticali principali</h4>
              <ul className="regole-list">
                {supportoLinguisticoDatabase[linguaSelezionata].regole.map((regola, index) => (
                  <li key={index} className="regola-item">{regola}</li>
                ))}
              </ul>
            </div>
          )}
          
          {visualizzazioneAttiva === 'suggerimenti' && (
            <div className="suggerimenti-view">
              <h4>Suggerimenti per l'apprendimento dell'italiano</h4>
              <ul className="suggerimenti-list">
                {supportoLinguisticoDatabase[linguaSelezionata].suggerimenti.map((suggerimento, index) => (
                  <li key={index} className="suggerimento-item">{suggerimento}</li>
                ))}
              </ul>
            </div>
          )}
          
          {visualizzazioneAttiva === 'errori' && erroriComuni.length > 0 && (
            <div className="errori-view">
              <h4>Errori comuni nella sezione attuale</h4>
              <ul className="errori-list">
                {erroriComuni.map((errore, index) => (
                  <li key={index} className="errore-item">{errore}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="supporto-footer">
            <div className="lingua-selector">
              <label>Cambia lingua:</label>
              <select value={linguaSelezionata} onChange={handleChangeLingua}>
                {Object.entries(supportoLinguisticoDatabase).map(([codice, lingua]) => (
                  <option key={codice} value={codice}>{lingua.nome}</option>
                ))}
              </select>
            </div>
            <button className="close-button" onClick={onClose}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente di provider globale per il supporto linguistico
const SupportoLinguisticoProvider = () => {
  const [isSupportoVisible, setSupportoVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState("lettura");
  
  // Utilizziamo l'URL corrente per determinare la sezione attuale
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('lettura')) {
      setCurrentSection('lettura');
    } else if (path.includes('scrittura')) {
      setCurrentSection('scrittura');
    } else if (path.includes('punteggiatura')) {
      setCurrentSection('punteggiatura');
    } else if (path.includes('registri')) {
      setCurrentSection('registri');
    }
  }, []);
  
  const showSupporto = (section) => {
    setCurrentSection(section);
    setSupportoVisible(true);
  };
  
  const hideSupporto = () => {
    setSupportoVisible(false);
  };
  
  return (
    <div className="supporto-provider">
      {isSupportoVisible && (
        <SupportoLinguistico 
          onClose={hideSupporto} 
          currentSection={currentSection} 
        />
      )}
      <button className="supporto-trigger-button" onClick={() => showSupporto(currentSection)}>
        🌍 Supporto Linguistico
      </button>
    </div>
  );
};

export { SupportoLinguistico, SupportoLinguisticoProvider };
export default SupportoLinguistico;