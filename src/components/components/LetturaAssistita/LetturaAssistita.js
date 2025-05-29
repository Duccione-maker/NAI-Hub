import React, { useState, useEffect, useRef } from 'react';
import './LetturaAssistitaStyles.css';

// Database simulato di testi per i diversi livelli
const textsDatabase = {
  facile: [
    "Il gatto dorme sul divano. È molto pigro e gli piace stare al caldo. La sua padrona gli porta sempre del buon cibo. Lui miagola quando ha fame. Tutti in casa lo amano molto.",
    "Oggi il cielo è azzurro. Non ci sono nuvole e il sole splende. Gli uccelli cantano sugli alberi del parco. I bambini giocano felici nel prato. È davvero una bella giornata di primavera.",
    "Marco va a scuola ogni mattina. Si sveglia presto e fa colazione. Poi prende lo zaino con i libri. Sua madre lo accompagna in macchina. A scuola incontra i suoi amici.",
    "La mia casa è piccola ma accogliente. Ha un bel giardino con tanti fiori colorati. In salotto c'è un comodo divano blu. La cucina è moderna e luminosa. Mi piace molto vivere qui.",
    "Ieri sono andato al mare con la mia famiglia. L'acqua era calda e pulita. Abbiamo nuotato per ore e costruito castelli di sabbia. Per pranzo abbiamo mangiato un buon gelato. È stata una giornata perfetta."
  ],
  medio: [
    "La biblioteca comunale della nostra città offre numerosi servizi gratuiti ai cittadini. Oltre al prestito di libri, organizza incontri con autori e laboratori di lettura per bambini. Gli spazi sono stati recentemente rinnovati, con nuove postazioni per lo studio e la consultazione. Durante l'estate, il giardino esterno ospita eventi culturali molto apprezzati.",
    "Il fenomeno del cambiamento climatico sta modificando gli ecosistemi di tutto il pianeta. Gli scienziati osservano con preoccupazione lo scioglimento dei ghiacciai e l'innalzamento del livello dei mari. Molte specie animali sono a rischio di estinzione a causa della perdita del loro habitat naturale. È necessario adottare misure urgenti per ridurre le emissioni di gas serra e proteggere la biodiversità.",
    "La cucina italiana è famosa in tutto il mondo per la sua varietà e qualità. Ogni regione ha le sue specialità tradizionali, tramandate di generazione in generazione. Gli ingredienti sono generalmente semplici ma di alta qualità: olio d'oliva, pomodori maturi, basilico fresco. I piatti più amati sono la pasta al pomodoro, la pizza napoletana e il risotto alla milanese.",
    "Il Rinascimento italiano rappresenta uno dei periodi più importanti della storia dell'arte occidentale. Artisti come Leonardo da Vinci, Michelangelo e Raffaello hanno creato opere immortali che ancora oggi attirano milioni di visitatori nei musei. Firenze fu il centro principale di questo movimento culturale, grazie al mecenatismo della famiglia Medici. L'architettura, la scultura e la pittura raggiunsero livelli di perfezione mai visti prima.",
    "L'esplorazione spaziale continua ad affascinare scienziati e appassionati di tutto il mondo. Le recenti missioni su Marte hanno fornito dati importanti sulla geologia del pianeta rosso. Le agenzie spaziali internazionali collaborano per progetti sempre più ambiziosi, come il ritorno dell'uomo sulla Luna e i futuri viaggi verso Marte. Le tecnologie sviluppate per lo spazio hanno applicazioni anche nella vita quotidiana sulla Terra."
  ],
  difficile: [
    "L'intelligenza artificiale sta rivoluzionando numerosi settori dell'economia globale, dall'industria manifatturiera alla finanza, dalla sanità all'istruzione. I sistemi di apprendimento automatico, basati su reti neurali artificiali, sono in grado di analizzare enormi quantità di dati e identificare modelli complessi che sfuggirebbero all'analisi umana. Questioni etiche fondamentali emergono tuttavia riguardo alla privacy dei dati, alla trasparenza degli algoritmi e al rischio di amplificare pregiudizi sociali esistenti. Gli esperti dibattono sulla necessità di un quadro normativo internazionale che possa guidare lo sviluppo responsabile di queste tecnologie.",
    "La letteratura del Novecento italiano si caratterizza per una pluralità di voci e correnti, in costante dialogo con le avanguardie europee ma profondamente radicata nelle specificità culturali nazionali. Autori come Italo Calvino hanno saputo coniugare sperimentazione formale e leggibilità, creando opere che esplorano temi universali attraverso linguaggi innovativi. Il neorealismo del dopoguerra ha rappresentato una risposta estetica e morale alle tragedie del fascismo e del conflitto mondiale, mentre la neoavanguardia degli anni Sessanta ha radicalmente messo in discussione le convenzioni narrative tradizionali. Questa tensione tra impegno civile e ricerca espressiva rimane una costante nella produzione letteraria italiana contemporanea.",
    "Il dibattito sull'urbanistica sostenibile si intensifica di fronte alle sfide poste dai cambiamenti climatici e dalla crescente concentrazione della popolazione mondiale nelle aree metropolitane. Le città intelligenti del futuro dovranno integrare tecnologie digitali avanzate con soluzioni ecologiche innovative: edifici a energia zero, trasporti pubblici elettrificati, infrastrutture verdi capillari e sistemi circolari di gestione dei rifiuti. La partecipazione attiva dei cittadini nella pianificazione urbana diventa essenziale per garantire che questi sviluppi rispondano effettivamente ai bisogni delle comunità locali, evitando processi di gentrificazione che potrebbero esacerbare le disuguaglianze sociali esistenti.",
    "La neuroplasticità cerebrale rappresenta una delle scoperte più rivoluzionarie delle neuroscienze moderne, contraddicendo il dogma secondo cui il cervello adulto sarebbe incapace di modificarsi strutturalmente. Ricerche avanzate dimostrano come, anche in età avanzata, il tessuto neuronale conservi una notevole capacità di riorganizzazione in risposta a stimoli ambientali, apprendimento e traumi. Questa proprietà fondamentale apre prospettive terapeutiche promettenti per la riabilitazione dopo lesioni cerebrali e per il trattamento di disturbi neurodegenerativi. I meccanismi molecolari che regolano questi processi plastici sono oggetto di intensa investigazione scientifica, con l'obiettivo di sviluppare interventi farmacologici mirati che possano potenziare la naturale capacità di adattamento del sistema nervoso.",
    "L'economia circolare propone un ripensamento radicale dei modelli produttivi lineari dominanti, basati sul paradigma 'estrai-produci-consuma-getta'. Attraverso la progettazione rigenerativa dei prodotti, l'estensione del loro ciclo di vita e la valorizzazione dei materiali a fine utilizzo, questo approccio mira a dissociare la crescita economica dal consumo di risorse finite. Le imprese all'avanguardia stanno già implementando strategie circolari che riducono l'impronta ambientale e generano nuove opportunità di mercato. La transizione verso un'economia pienamente circolare richiede tuttavia cambiamenti sistemici che coinvolgono l'intera catena del valore, supportati da politiche pubbliche innovative e da una trasformazione delle abitudini di consumo."
  ]
};

const LetturaAssistita = () => {
  // Stati del componente
  const [currentLevel, setCurrentLevel] = useState('facile');
  const [currentText, setCurrentText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [modelAudioURL, setModelAudioURL] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState('idle'); // idle, loading, complete
  const [feedbackData, setFeedbackData] = useState(null);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const lastUsedTextsRef = useRef({
    facile: [],
    medio: [],
    difficile: []
  });
  
  // Effetto per generare il testo all'avvio del componente
  useEffect(() => {
    generateNewText();
  }, []);
  
  /**
   * Genera un nuovo testo in base al livello di difficoltà selezionato
   */
  const generateNewText = () => {
    const availableTexts = textsDatabase[currentLevel];
    
    // Controlla se ci sono testi disponibili
    if (!availableTexts || availableTexts.length === 0) {
      console.error(`Nessun testo disponibile per il livello ${currentLevel}`);
      return;
    }
    
    // Seleziona un indice che non è stato usato recentemente
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * availableTexts.length);
    } while (
      lastUsedTextsRef.current[currentLevel].includes(randomIndex) && 
      lastUsedTextsRef.current[currentLevel].length < availableTexts.length
    );
    
    // Aggiorna la lista degli indici usati recentemente
    const updatedLastUsed = [...lastUsedTextsRef.current[currentLevel], randomIndex];
    
    // Mantieni solo gli ultimi 3 indici usati (o meno se ci sono meno testi disponibili)
    const maxToRemember = Math.min(3, availableTexts.length - 1);
    if (updatedLastUsed.length > maxToRemember) {
      lastUsedTextsRef.current[currentLevel] = updatedLastUsed.slice(-maxToRemember);
    } else {
      lastUsedTextsRef.current[currentLevel] = updatedLastUsed;
    }
    
    // Imposta il nuovo testo
    setCurrentText(availableTexts[randomIndex]);
    
    // Resetta audio e feedback
    setRecordedAudioURL(null);
    setModelAudioURL(null);
    setFeedbackData(null);
    setAiAnalysisStatus('idle');
    
    // Genera l'audio modello per questo testo
    generateModelAudio(availableTexts[randomIndex]);
  };
  
  /**
   * Genera l'audio modello per il testo corrente (simulato)
   */
  const generateModelAudio = async (text) => {
    setIsGeneratingAudio(true);
    
    // Simula il ritardo per la generazione dell'audio
    try {
      // In un'implementazione reale, qui chiameremmo un'API di text-to-speech
      // Per ora, simuliamo una generazione audio con un ritardo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Crea un contesto audio per simulare un file audio vuoto
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Impostiamo il volume a zero per non riprodurre suoni reali
      gainNode.gain.value = 0;
      
      // Registra l'audio simulato
      const mediaStream = audioContext.createMediaStreamDestination();
      oscillator.connect(mediaStream);
      
      const mediaRecorder = new MediaRecorder(mediaStream.stream);
      const audioChunks = [];
      
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setModelAudioURL(audioUrl);
        setIsGeneratingAudio(false);
      });
      
      // Simula una breve registrazione
      mediaRecorder.start();
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        mediaRecorder.stop();
      }, 100);
      
    } catch (error) {
      console.error('Errore nella generazione dell\'audio modello:', error);
      setIsGeneratingAudio(false);
    }
  };
  
  /**
   * Gestisce il cambio di livello di difficoltà
   */
  const handleLevelChange = (e) => {
    setCurrentLevel(e.target.value);
    // Genera un nuovo testo quando cambia il livello
    setTimeout(generateNewText, 0);
  };
  
  /**
   * Inizia la registrazione della lettura dell'utente
   */
  const startRecording = async () => {
    if (isRecording) return;
    
    try {
      // Richiedi l'accesso al microfono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.addEventListener('dataavailable', event => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordedAudioURL(audioUrl);
        setIsRecording(false);
        
        // Analizza la registrazione
        analyzeRecording();
      });
      
      // Inizia la registrazione
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Errore nell\'accesso al microfono:', error);
      alert('Non è stato possibile accedere al microfono. Verifica le autorizzazioni del browser.');
      setIsRecording(false);
    }
  };
  
  /**
   * Ferma la registrazione in corso
   */
  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    
    // Ferma anche tutti i tracciati audio
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
  };
  
  /**
   * Analizza la registrazione dell'utente e fornisce feedback (simulato)
   */
  const analyzeRecording = () => {
    setAiAnalysisStatus('loading');
    
    // Simula un ritardo per l'analisi
    setTimeout(() => {
      // In un'implementazione reale, qui verrebbero mostrati i risultati dell'analisi AI
      // Per ora, mostriamo un feedback simulato
      
      // Genera un punteggio casuale tra 70 e 95
      const accuracyScore = Math.floor(Math.random() * 26) + 70;
      
      // Genera feedback basati sul livello
      let feedback;
      if (currentLevel === 'facile') {
        feedback = {
          pronunciation: 'Buona pronuncia delle parole comuni. Alcune difficoltà con le doppie consonanti.',
          fluency: 'Lettura piuttosto fluida con alcune pause.',
          rhythm: 'Il ritmo è generalmente costante, ma alcune frasi sono state lette troppo velocemente.'
        };
      } else if (currentLevel === 'medio') {
        feedback = {
          pronunciation: 'Pronuncia adeguata, con alcune difficoltà sulle parole più complesse.',
          fluency: 'Buona fluidità con qualche esitazione sui termini meno comuni.',
          rhythm: 'Ritmo variabile, con alcune accelerazioni nei passaggi più semplici.'
        };
      } else {
        feedback = {
          pronunciation: 'Buona padronanza delle parole complesse, con qualche imprecisione sui termini tecnici.',
          fluency: 'Fluidità generalmente buona, con pause appropriate tra i concetti complessi.',
          rhythm: 'Buon controllo del ritmo, ma l\'intonazione potrebbe essere migliorata in alcune frasi.'
        };
      }
      
      // Genera errori simulati
      const words = currentText.split(' ');
      const errorWords = [];
      
      // Seleziona casualmente 2-4 parole come "errori"
      const numErrors = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numErrors; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        if (words[randomIndex].length > 3 && !errorWords.includes(words[randomIndex])) {
          errorWords.push(words[randomIndex]);
        }
      }
      
      setFeedbackData({
        accuracyScore,
        feedback,
        errorWords
      });
      
      setAiAnalysisStatus('complete');
    }, 2000);
  };
  
  /**
   * Riproduce l'audio modello generato
   */
  const playModelAudio = () => {
    // In un'implementazione reale, qui riprodurremmo l'audio TTS
    // Per ora, mostriamo un messaggio di simulazione
    const audioPlayer = document.getElementById('model-audio-player');
    if (audioPlayer) {
      audioPlayer.play();
    }
  };

  return (
    <div className="lettura-assistita-container">
      <div className="lettura-header">
        <h2>Lettura Assistita con AI</h2>
        <div className="level-selector">
          <label>Livello di difficoltà:</label>
          <select 
            value={currentLevel}
            onChange={handleLevelChange}
          >
            <option value="facile">Facile</option>
            <option value="medio">Medio</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>
      </div>
      
      <div className="text-container">
        <div className="text-controls">
          <button className="primary-btn" onClick={generateNewText}>
            Genera Nuovo Testo
          </button>
        </div>
        <div className="reading-text">
          {currentText || (
            <div className="loading-spinner">Generazione in corso...</div>
          )}
        </div>
      </div>
      
      <div className="audio-section">
        <div className="model-audio">
          <h3>Ascolto Modello</h3>
          <button 
            className="primary-btn" 
            onClick={playModelAudio}
            disabled={isGeneratingAudio || !modelAudioURL}
          >
            {isGeneratingAudio ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> Generazione audio...
              </>
            ) : (
              <>
                <i className="fa fa-play"></i> Ascolta Lettura Modello
              </>
            )}
          </button>
          {modelAudioURL && (
            <>
              <audio id="model-audio-player" controls className="audio-player" src={modelAudioURL} />
              <div className="simulation-message">
                Simulazione: In un'implementazione reale, qui sentiresti la lettura del testo generata da un sistema TTS di alta qualità.
              </div>
            </>
          )}
        </div>
        
        <div className="user-recording">
          <h3>La Tua Lettura</h3>
          <div className="recording-controls">
            <button
              className="primary-btn"
              onClick={startRecording}
              disabled={isRecording}
            >
              {isRecording ? (
                <>
                  <i className="fa fa-circle recording-indicator"></i> Registrazione in corso...
                </>
              ) : (
                <>
                  <i className="fa fa-microphone"></i> Inizia Registrazione
                </>
              )}
            </button>
            <button
              className="primary-btn"
              onClick={stopRecording}
              disabled={!isRecording}
            >
              <i className="fa fa-stop"></i> Ferma Registrazione
            </button>
          </div>
          {recordedAudioURL && (
            <audio controls className="audio-player" src={recordedAudioURL} />
          )}
        </div>
      </div>
      
      <div className="feedback-section">
        <h3>Feedback AI</h3>
        <div className="ai-feedback">
          {aiAnalysisStatus === 'idle' && (
            <p>Registra la tua lettura per ricevere un feedback.</p>
          )}
          
          {aiAnalysisStatus === 'loading' && (
            <div className="loading-spinner">Analisi della lettura in corso...</div>
          )}
          
          {aiAnalysisStatus === 'complete' && feedbackData && (
            <>
              <div className="feedback-overview">
                <div className="accuracy-score">
                  <div className="score-circle">
                    <span>{feedbackData.accuracyScore}%</span>
                  </div>
                  <span>Accuratezza</span>
                </div>
                <div className="feedback-details">
                  <p><strong>Pronuncia:</strong> {feedbackData.feedback.pronunciation}</p>
                  <p><strong>Fluidità:</strong> {feedbackData.feedback.fluency}</p>
                  <p><strong>Ritmo e intonazione:</strong> {feedbackData.feedback.rhythm}</p>
                </div>
              </div>
              
              <div className="feedback-errors">
                <h4>Parole da migliorare:</h4>
                <ul>
                  {feedbackData.errorWords.map((word, index) => (
                    <li key={index}>{word}</li>
                  ))}
                </ul>
              </div>
              
              <div className="feedback-suggestions">
                <h4>Suggerimenti:</h4>
                <p>Prova a rileggere il testo concentrandoti sulle parole evidenziate.</p>
                <p>Fai attenzione al ritmo, cercando di mantenere una velocità costante.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetturaAssistita;