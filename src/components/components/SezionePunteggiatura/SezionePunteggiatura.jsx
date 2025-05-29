import React, { useState, useEffect, useRef } from 'react';
import './SezionePunteggiatura.css';

// Configurazione temporanea per API, in produzione andrà spostata in un file di configurazione
const API_CONFIG = {
  baseUrl: 'https://api.openai.com/v1/completions',
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Da configurare nelle variabili d'ambiente
  model: 'text-davinci-003',
  apiEnabled: false // Impostare a true quando l'API è configurata e pronta
};

// Testi predefiniti per il fallback (usati quando l'API non è disponibile)
const FALLBACK_TEXTS = {
  facile: [
    {
      rawText: "il gatto dorme sul divano è molto pigro e gli piace stare al caldo la sua padrona gli porta sempre del buon cibo lui miagola quando ha fame tutti in casa lo amano molto",
      correctText: "Il gatto dorme sul divano. È molto pigro e gli piace stare al caldo. La sua padrona gli porta sempre del buon cibo. Lui miagola quando ha fame. Tutti in casa lo amano molto."
    },
    {
      rawText: "oggi il cielo è azzurro non ci sono nuvole e il sole splende gli uccelli cantano sugli alberi del parco i bambini giocano felici nel prato è davvero una bella giornata di primavera",
      correctText: "Oggi il cielo è azzurro. Non ci sono nuvole e il sole splende. Gli uccelli cantano sugli alberi del parco. I bambini giocano felici nel prato. È davvero una bella giornata di primavera."
    },
    {
      rawText: "marco va a scuola ogni mattina si sveglia presto e fa colazione poi prende lo zaino con i libri sua madre lo accompagna in macchina a scuola incontra i suoi amici",
      correctText: "Marco va a scuola ogni mattina. Si sveglia presto e fa colazione. Poi prende lo zaino con i libri. Sua madre lo accompagna in macchina. A scuola incontra i suoi amici."
    }
  ],
  medio: [
    {
      rawText: "la biblioteca comunale della nostra città offre numerosi servizi gratuiti ai cittadini oltre al prestito di libri organizza incontri con autori e laboratori di lettura per bambini gli spazi sono stati recentemente rinnovati con nuove postazioni per lo studio e la consultazione durante l'estate il giardino esterno ospita eventi culturali molto apprezzati",
      correctText: "La biblioteca comunale della nostra città offre numerosi servizi gratuiti ai cittadini. Oltre al prestito di libri, organizza incontri con autori e laboratori di lettura per bambini. Gli spazi sono stati recentemente rinnovati, con nuove postazioni per lo studio e la consultazione. Durante l'estate, il giardino esterno ospita eventi culturali molto apprezzati."
    },
    {
      rawText: "il fenomeno del cambiamento climatico sta modificando gli ecosistemi di tutto il pianeta gli scienziati osservano con preoccupazione lo scioglimento dei ghiacciai e l'innalzamento del livello dei mari molte specie animali sono a rischio di estinzione a causa della perdita del loro habitat naturale è necessario adottare misure urgenti per ridurre le emissioni di gas serra e proteggere la biodiversità",
      correctText: "Il fenomeno del cambiamento climatico sta modificando gli ecosistemi di tutto il pianeta. Gli scienziati osservano con preoccupazione lo scioglimento dei ghiacciai e l'innalzamento del livello dei mari. Molte specie animali sono a rischio di estinzione a causa della perdita del loro habitat naturale. È necessario adottare misure urgenti per ridurre le emissioni di gas serra e proteggere la biodiversità."
    },
    {
      rawText: "la cucina italiana è famosa in tutto il mondo per la sua varietà e qualità ogni regione ha le sue specialità tradizionali tramandate di generazione in generazione gli ingredienti sono generalmente semplici ma di alta qualità: olio d'oliva pomodori maturi basilico fresco i piatti più amati sono la pasta al pomodoro la pizza napoletana e il risotto alla milanese",
      correctText: "La cucina italiana è famosa in tutto il mondo per la sua varietà e qualità. Ogni regione ha le sue specialità tradizionali, tramandate di generazione in generazione. Gli ingredienti sono generalmente semplici ma di alta qualità: olio d'oliva, pomodori maturi, basilico fresco. I piatti più amati sono la pasta al pomodoro, la pizza napoletana e il risotto alla milanese."
    }
  ],
  difficile: [
    {
      rawText: "l'intelligenza artificiale sta rivoluzionando numerosi settori dell'economia globale dall'industria manifatturiera alla finanza dalla sanità all'istruzione i sistemi di apprendimento automatico basati su reti neurali artificiali sono in grado di analizzare enormi quantità di dati e identificare modelli complessi che sfuggirebbero all'analisi umana questioni etiche fondamentali emergono tuttavia riguardo alla privacy dei dati alla trasparenza degli algoritmi e al rischio di amplificare pregiudizi sociali esistenti gli esperti dibattono sulla necessità di un quadro normativo internazionale che possa guidare lo sviluppo responsabile di queste tecnologie",
      correctText: "L'intelligenza artificiale sta rivoluzionando numerosi settori dell'economia globale, dall'industria manifatturiera alla finanza, dalla sanità all'istruzione. I sistemi di apprendimento automatico, basati su reti neurali artificiali, sono in grado di analizzare enormi quantità di dati e identificare modelli complessi che sfuggirebbero all'analisi umana. Questioni etiche fondamentali emergono tuttavia riguardo alla privacy dei dati, alla trasparenza degli algoritmi e al rischio di amplificare pregiudizi sociali esistenti. Gli esperti dibattono sulla necessità di un quadro normativo internazionale che possa guidare lo sviluppo responsabile di queste tecnologie."
    },
    {
      rawText: "la letteratura del novecento italiano si caratterizza per una pluralità di voci e correnti in costante dialogo con le avanguardie europee ma profondamente radicata nelle specificità culturali nazionali autori come italo calvino hanno saputo coniugare sperimentazione formale e leggibilità creando opere che esplorano temi universali attraverso linguaggi innovativi il neorealismo del dopoguerra ha rappresentato una risposta estetica e morale alle tragedie del fascismo e del conflitto mondiale mentre la neoavanguardia degli anni sessanta ha radicalmente messo in discussione le convenzioni narrative tradizionali questa tensione tra impegno civile e ricerca espressiva rimane una costante nella produzione letteraria italiana contemporanea",
      correctText: "La letteratura del Novecento italiano si caratterizza per una pluralità di voci e correnti, in costante dialogo con le avanguardie europee ma profondamente radicata nelle specificità culturali nazionali. Autori come Italo Calvino hanno saputo coniugare sperimentazione formale e leggibilità, creando opere che esplorano temi universali attraverso linguaggi innovativi. Il neorealismo del dopoguerra ha rappresentato una risposta estetica e morale alle tragedie del fascismo e del conflitto mondiale, mentre la neoavanguardia degli anni Sessanta ha radicalmente messo in discussione le convenzioni narrative tradizionali. Questa tensione tra impegno civile e ricerca espressiva rimane una costante nella produzione letteraria italiana contemporanea."
    },
    {
      rawText: "il dibattito sull'urbanistica sostenibile si intensifica di fronte alle sfide poste dai cambiamenti climatici e dalla crescente concentrazione della popolazione mondiale nelle aree metropolitane le città intelligenti del futuro dovranno integrare tecnologie digitali avanzate con soluzioni ecologiche innovative: edifici a energia zero trasporti pubblici elettrificati infrastrutture verdi capillari e sistemi circolari di gestione dei rifiuti la partecipazione attiva dei cittadini nella pianificazione urbana diventa essenziale per garantire che questi sviluppi rispondano effettivamente ai bisogni delle comunità locali evitando processi di gentrificazione che potrebbero esacerbare le disuguaglianze sociali esistenti",
      correctText: "Il dibattito sull'urbanistica sostenibile si intensifica di fronte alle sfide poste dai cambiamenti climatici e dalla crescente concentrazione della popolazione mondiale nelle aree metropolitane. Le città intelligenti del futuro dovranno integrare tecnologie digitali avanzate con soluzioni ecologiche innovative: edifici a energia zero, trasporti pubblici elettrificati, infrastrutture verdi capillari e sistemi circolari di gestione dei rifiuti. La partecipazione attiva dei cittadini nella pianificazione urbana diventa essenziale per garantire che questi sviluppi rispondano effettivamente ai bisogni delle comunità locali, evitando processi di gentrificazione che potrebbero esacerbare le disuguaglianze sociali esistenti."
    }
  ]
};

const SezionePunteggiatura = () => {
  // Stati del componente
  const [currentLevel, setCurrentLevel] = useState('facile');
  const [isLoading, setIsLoading] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userText, setUserText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [audioElement, setAudioElement] = useState(null);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  
  // Refs
  const textEditorRef = useRef(null);
  
  // Carica un nuovo esercizio quando il componente viene montato o cambia il livello
  useEffect(() => {
    loadNewExercise();
  }, [currentLevel]);
  
  // Funzione per caricare un nuovo esercizio
  const loadNewExercise = async () => {
    setIsLoading(true);
    setUserText('');
    setIsSubmitted(false);
    setFeedback(null);
    
    try {
      let exerciseData;
      
      if (API_CONFIG.apiEnabled) {
        // Ottieni il testo dall'API
        exerciseData = await fetchExerciseFromAPI(currentLevel);
      } else {
        // Usa i testi fallback
        exerciseData = getRandomFallbackText(currentLevel);
      }
      
      // Aggiunge l'esercizio alla storia (per evitare ripetizioni)
      setExerciseHistory(prev => [...prev, exerciseData.rawText]);
      
      // Imposta il nuovo esercizio
      setCurrentExercise(exerciseData);
      
      // Genera l'audio di riferimento
      generateReferenceAudio(exerciseData.correctText);
      
    } catch (error) {
      console.error("Errore nel caricamento dell'esercizio:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Funzione per generare l'audio di riferimento (simulata)
  const generateReferenceAudio = (text) => {
    // In un'implementazione reale, qui chiameresti un servizio TTS
    // Per ora, creiamo un semplice elemento audio simulato
    const audio = new Audio();
    setAudioElement(audio);
  };
  
  // Funzione per ottenere un testo casuale da quelli fallback
  const getRandomFallbackText = (level) => {
    const availableTexts = FALLBACK_TEXTS[level];
    
    // Evita testi già usati di recente, se possibile
    let filteredTexts = availableTexts.filter(text => 
      !exerciseHistory.includes(text.rawText)
    );
    
    // Se tutti i testi sono stati usati, resetta la storia
    if (filteredTexts.length === 0) {
      setExerciseHistory([]);
      filteredTexts = availableTexts;
    }
    
    // Seleziona un testo casuale
    const randomIndex = Math.floor(Math.random() * filteredTexts.length);
    return filteredTexts[randomIndex];
  };
  
  // Funzione per ottenere un testo dall'API (esempio con OpenAI)
  const fetchExerciseFromAPI = async (level) => {
    // Questa è una funzione di esempio, andrà adattata all'API specifica che utilizzerai
    
    // Definisci il prompt in base al livello
    let prompt, maxTokens;
    switch(level) {
      case 'facile':
        prompt = "Genera un breve testo di circa 5 frasi semplici in italiano su un argomento quotidiano. Fornisci due versioni: una senza punteggiatura e maiuscole, e una versione corretta.";
        maxTokens = 300;
        break;
      case 'medio':
        prompt = "Genera un testo di media complessità in italiano di circa 4-5 frasi su un argomento culturale o scientifico. Fornisci due versioni: una senza punteggiatura e maiuscole, e una versione corretta.";
        maxTokens = 500;
        break;
      case 'difficile':
        prompt = "Genera un testo complesso in italiano di circa 4-5 frasi lunghe su un argomento accademico o specialistico. Fornisci due versioni: una senza punteggiatura e maiuscole, e una versione corretta.";
        maxTokens = 700;
        break;
      default:
        prompt = "Genera un breve testo in italiano. Fornisci due versioni: una senza punteggiatura e maiuscole, e una versione corretta.";
        maxTokens = 300;
    }
    
    try {
      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          prompt: prompt,
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].text.trim();
      
      // Estrai le due versioni del testo dalla risposta
      // Nota: Questa parte dipende dal formato specifico della risposta API
      // e potrebbe richiedere adattamenti
      const parts = content.split('\n\n');
      
      let rawText = '';
      let correctText = '';
      
      if (parts.length >= 2) {
        // Cerca le sezioni che contengono le versioni
        for (const part of parts) {
          if (part.toLowerCase().includes('senza punteggiatura') || 
              part.toLowerCase().includes('versione raw')) {
            rawText = part.replace(/^.*?:/, '').trim();
          }
          else if (part.toLowerCase().includes('versione corretta') || 
                   part.toLowerCase().includes('con punteggiatura')) {
            correctText = part.replace(/^.*?:/, '').trim();
          }
        }
      }
      
      // Se non è stato possibile estrarre entrambe le versioni, usa un fallback
      if (!rawText || !correctText) {
        return getRandomFallbackText(level);
      }
      
      return { rawText, correctText };
      
    } catch (error) {
      console.error('Errore nella chiamata API:', error);
      // In caso di errore, usa un testo di fallback
      return getRandomFallbackText(level);
    }
  };
  
  // Gestisci il cambio di livello
  const handleLevelChange = (e) => {
    setCurrentLevel(e.target.value);
  };
  
  // Gestisci il cambio di testo dell'utente
  const handleTextChange = (e) => {
    setUserText(e.target.value);
  };
  
  // Gestisci il play dell'audio di riferimento
  const playReferenceAudio = () => {
    // In un'implementazione reale, riproduce l'audio TTS
    // Per simulazione, mostriamo un messaggio
    alert("In un'implementazione reale, qui ascolteresti la lettura corretta del testo con la punteggiatura appropriata.");
  };
  
  // Invia l'esercizio per la valutazione
  const submitExercise = () => {
    if (!currentExercise || !userText) return;
    
    // Calcola il punteggio e prepara il feedback
    const { score, feedback } = evaluateUserText(userText, currentExercise.correctText);
    
    setScore(score);
    setFeedback(feedback);
    setIsSubmitted(true);
  };
  
  // Valutazione del testo inserito dall'utente
  const evaluateUserText = (userText, correctText) => {
    // Calcolo degli errori di punteggiatura
    const userPunctuation = extractPunctuation(userText);
    const correctPunctuation = extractPunctuation(correctText);
    
    // Verifica maiuscole
    const userCapitalization = extractCapitalization(userText);
    const correctCapitalization = extractCapitalization(correctText);
    
    // Calcola errori e punteggio
    const punctuationErrors = comparePunctuation(userPunctuation, correctPunctuation);
    const capitalizationErrors = compareCapitalization(userCapitalization, correctCapitalization);
    
    const totalErrors = punctuationErrors.length + capitalizationErrors.length;
    const maxScore = correctPunctuation.length + correctCapitalization.length;
    const userScore = Math.max(0, maxScore - totalErrors);
    
    // Calcola percentuale
    const percentage = Math.round((userScore / maxScore) * 100);
    
    // Prepara feedback
    const feedback = {
      punctuationErrors,
      capitalizationErrors,
      percentage,
      suggestions: generateSuggestions(punctuationErrors, capitalizationErrors)
    };
    
    return { score: percentage, feedback };
  };
  
  // Estrae la punteggiatura da un testo
  const extractPunctuation = (text) => {
    const punctuation = [];
    let currentPos = 0;
    
    // Trova tutta la punteggiatura nel testo
    const regex = /[.,;:!?"()]/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      punctuation.push({
        char: match[0],
        position: match.index,
        context: text.substring(Math.max(0, match.index - 10), 
                                Math.min(text.length, match.index + 10))
      });
      currentPos = match.index + 1;
    }
    
    return punctuation;
  };
  
  // Estrae le maiuscole da un testo
  const extractCapitalization = (text) => {
    const caps = [];
    
    // Trova tutte le maiuscole nel testo
    const lines = text.split(/[.!?]\s+/);
    let currentPos = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 0) {
        const firstChar = line[0];
        if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase()) {
          caps.push({
            char: firstChar,
            position: currentPos,
            context: line.substring(0, Math.min(20, line.length))
          });
        }
      }
      
      // Aggiorna la posizione per la prossima linea
      currentPos += lines[i].length + 2; // +2 per il separatore e lo spazio
    }
    
    return caps;
  };
  
  // Confronta la punteggiatura dell'utente con quella corretta
  const comparePunctuation = (userPunct, correctPunct) => {
    const errors = [];
    
    // Verifica punteggiatura mancante
    correctPunct.forEach(punct => {
      const found = userPunct.some(up => 
        Math.abs(up.position - punct.position) < 5 && up.char === punct.char
      );
      
      if (!found) {
        errors.push({
          type: 'missing',
          char: punct.char,
          context: punct.context,
          message: `Manca un segno di ${getPunctuationName(punct.char)} qui: "${punct.context}"`
        });
      }
    });
    
    // Verifica punteggiatura errata o in eccesso
    userPunct.forEach(punct => {
      const found = correctPunct.some(cp => 
        Math.abs(cp.position - punct.position) < 5 && cp.char === punct.char
      );
      
      if (!found) {
        const nearbyCorrect = correctPunct.find(cp => 
          Math.abs(cp.position - punct.position) < 5
        );
        
        if (nearbyCorrect) {
          errors.push({
            type: 'wrong',
            char: punct.char,
            correctChar: nearbyCorrect.char,
            context: punct.context,
            message: `Hai usato ${getPunctuationName(punct.char)} invece di ${getPunctuationName(nearbyCorrect.char)} qui: "${punct.context}"`
          });
        } else {
          errors.push({
            type: 'extra',
            char: punct.char,
            context: punct.context,
            message: `C'è un segno di ${getPunctuationName(punct.char)} in eccesso qui: "${punct.context}"`
          });
        }
      }
    });
    
    return errors;
  };
  
  // Confronta le maiuscole dell'utente con quelle corrette
  const compareCapitalization = (userCaps, correctCaps) => {
    const errors = [];
    
    // Verifica maiuscole mancanti
    correctCaps.forEach(cap => {
      const found = userCaps.some(uc => 
        Math.abs(uc.position - cap.position) < 10 && 
        uc.char.toUpperCase() === cap.char.toUpperCase()
      );
      
      if (!found) {
        errors.push({
          type: 'missing_cap',
          context: cap.context,
          message: `Manca una lettera maiuscola all'inizio di questa frase: "${cap.context}"`
        });
      }
    });
    
    return errors;
  };
  
  // Genera suggerimenti in base agli errori
  const generateSuggestions = (punctErrors, capErrors) => {
    const suggestions = [];
    
    // Analizza pattern di errori
    const missingPoints = punctErrors.filter(e => e.type === 'missing' && e.char === '.').length;
    const missingCommas = punctErrors.filter(e => e.type === 'missing' && e.char === ',').length;
    const missingCaps = capErrors.length;
    
    // Genera suggerimenti specifici
    if (missingPoints > 1) {
      suggestions.push("Ricorda di separare le frasi con un punto. Ogni frase completa dovrebbe terminare con un punto.");
    }
    
    if (missingCommas > 1) {
      suggestions.push("Usa le virgole per separare elementi di un elenco o per dividere parti di una frase.");
    }
    
    if (missingCaps > 1) {
      suggestions.push("Inizia ogni frase con una lettera maiuscola dopo un punto, un punto esclamativo o un punto interrogativo.");
    }
    
    // Aggiungi suggerimenti generali
    if (punctErrors.length > 0 || capErrors.length > 0) {
      suggestions.push("Rileggi sempre il testo ad alta voce per capire dove servono le pause (virgole, punti) e dove iniziano nuove frasi (maiuscole).");
    }
    
    return suggestions;
  };
  
  // Ottieni il nome del segno di punteggiatura
  const getPunctuationName = (char) => {
    const names = {
      '.': 'punto',
      ',': 'virgola',
      ';': 'punto e virgola',
      ':': 'due punti',
      '!': 'punto esclamativo',
      '?': 'punto interrogativo',
      '"': 'virgolette',
      '(': 'parentesi',
      ')': 'parentesi'
    };
    
    return names[char] || char;
  };
  
  // Inizia un nuovo esercizio
  const startNewExercise = () => {
    loadNewExercise();
  };
  
  // Renderizza il feedback
  const renderFeedback = () => {
    if (!feedback) return null;
    
    return (
      <div className="punteggiatura-feedback">
        <div className="feedback-score">
          <div className="score-circle">
            <span>{feedback.percentage}%</span>
          </div>
          <div className="score-label">Punteggio</div>
        </div>
        
        <div className="feedback-details">
          {feedback.punctuationErrors.length > 0 && (
            <div className="errors-section">
              <h4>Errori di punteggiatura:</h4>
              <ul>
                {feedback.punctuationErrors.slice(0, 5).map((error, index) => (
                  <li key={`punct-${index}`}>{error.message}</li>
                ))}
                {feedback.punctuationErrors.length > 5 && (
                  <li>...e altri {feedback.punctuationErrors.length - 5} errori.</li>
                )}
              </ul>
            </div>
          )}
          
          {feedback.capitalizationErrors.length > 0 && (
            <div className="errors-section">
              <h4>Errori di maiuscole:</h4>
              <ul>
                {feedback.capitalizationErrors.slice(0, 5).map((error, index) => (
                  <li key={`cap-${index}`}>{error.message}</li>
                ))}
                {feedback.capitalizationErrors.length > 5 && (
                  <li>...e altri {feedback.capitalizationErrors.length - 5} errori.</li>
                )}
              </ul>
            </div>
          )}
          
          {feedback.suggestions.length > 0 && (
            <div className="suggestions-section">
              <h4>Suggerimenti:</h4>
              <ul>
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={`sugg-${index}`}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="feedback-actions">
          <button className="primary-btn" onClick={startNewExercise}>
            Nuovo Esercizio
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="sezione-punteggiatura-container">
      <div className="punteggiatura-header">
        <h2>Esercizi di Punteggiatura</h2>
        
        <div className="level-selector">
          <label>Livello:</label>
          <select 
            value={currentLevel}
            onChange={handleLevelChange}
            disabled={isLoading || isSubmitted}
          >
            <option value="facile">Facile</option>
            <option value="medio">Medio</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>
      </div>
      
      <div className="exercise-container">
        {isLoading ? (
          <div className="loading-indicator">Caricamento dell'esercizio...</div>
        ) : (
          <>
            <div className="exercise-instructions">
              <p>Ascolta l'audio e aggiungi la punteggiatura corretta al testo sottostante.</p>
              <p>Ricorda di inserire anche le maiuscole dove necessario.</p>
              
              <button 
                className="audio-btn"
                onClick={playReferenceAudio}
                disabled={!currentExercise}
              >
                <i className="fa fa-volume-up"></i> Ascolta il testo
              </button>
            </div>
            
            {currentExercise && (
              <div className="exercise-content">
                <div className="raw-text">
                  <h3>Testo da correggere:</h3>
                  <p>{currentExercise.rawText}</p>
                </div>
                
                <div className="text-editor-container">
                  <h3>Inserisci la punteggiatura:</h3>
                  <textarea
                    ref={textEditorRef}
                    value={userText}
                    onChange={handleTextChange}
                    placeholder="Digita qui il testo con la punteggiatura corretta..."
                    className="punctuation-editor"
                    disabled={isSubmitted}
                  />
                  
                  {!isSubmitted && (
                    <div className="editor-actions">
                      <button 
                        className="primary-btn"
                        onClick={submitExercise}
                        disabled={!userText.trim()}
                      >
                        Verifica
                      </button>
                    </div>
                  )}
                </div>
                
                {isSubmitted && (
                  <div className="correct-text">
                    <h3>Testo corretto:</h3>
                    <p>{currentExercise.correctText}</p>
                  </div>
                )}
              </div>
            )}
            
            {isSubmitted && renderFeedback()}
          </>
        )}
      </div>
    </div>
  );
};

export default SezionePunteggiatura;