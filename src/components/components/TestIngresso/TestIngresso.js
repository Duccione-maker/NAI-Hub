import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TestIngressoStyles.css';

const TestIngresso = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isNAI, setIsNAI] = useState(false);
  const [motherLanguage, setMotherLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionBank, setQuestionBank] = useState({});
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [sectionProgress, setSectionProgress] = useState({
    demographic: false,
    reading: false,
    grammar: false,
    writing: false,
    speaking: false
  });

  // Configurazione sezioni test QCER
  const testSections = [
    { id: 'demographic', name: 'Informazioni di Base', questions: 2 },
    { id: 'reading', name: 'Comprensione Scritta', questions: 8 },
    { id: 'grammar', name: 'Grammatica e Vocabolario', questions: 8 },
    { id: 'writing', name: 'Produzione Scritta', questions: 3 },
    { id: 'speaking', name: 'Produzione Orale', questions: 3 }
  ];

  // Mapping QCER → Cinture Karate
  const qcerToBelt = {
    'A1': { belt: 'yellow', name: 'Cintura Gialla', color: '#FFD700' },
    'A2': { belt: 'orange', name: 'Cintura Arancione', color: '#FFA500' },
    'B1': { belt: 'green', name: 'Cintura Verde', color: '#32CD32' },
    'B2': { belt: 'blue', name: 'Cintura Blu', color: '#4169E1' },
    'C1': { belt: 'brown', name: 'Cintura Marrone', color: '#8B4513' },
    'C2': { belt: 'black', name: 'Cintura Nera', color: '#000000' }
  };

  // Lingue supportate per studenti NAI
  const supportedLanguages = [
    { code: 'al', name: 'Albanese' },
    { code: 'ko', name: 'Kosovaro' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabo' },
    { code: 'zh', name: 'Cinese' },
    { code: 'ro', name: 'Rumeno' },
    { code: 'es', name: 'Spagnolo' },
    { code: 'pt', name: 'Portoghese' },
    { code: 'uk', name: 'Ucraino' }
  ];

  // Caricamento dinamico domande AI
  useEffect(() => {
    loadQuestionBank();
  }, []);

  const loadQuestionBank = async () => {
    setLoading(true);
    try {
      // Verifica se MockQuestionService esiste
      console.log('Caricamento MockQuestionService...');
      
      // Usa import dinamico con fallback
      let MockQuestionService;
      try {
        const module = await import('./MockQuestionService');
        MockQuestionService = module.MockQuestionService;
        console.log('MockQuestionService caricato con successo');
      } catch (importError) {
        console.warn('MockQuestionService non trovato, uso fallback:', importError);
        throw new Error('File non trovato');
      }
      
      const questions = await MockQuestionService.generateTestBank();
      setQuestionBank(questions);
      
      // Carica prime domande demografiche
      setCurrentQuestions(questions.demographic || []);
    } catch (error) {
      console.error('Errore caricamento domande, uso fallback:', error);
      // Fallback a domande hardcoded
      loadHardcodedQuestions();
    } finally {
      setLoading(false);
    }
  };

  const loadHardcodedQuestions = () => {
    // Fallback temporaneo con domande esistenti
    const hardcodedBank = {
      demographic: [
        {
          id: 'years_italy',
          type: 'multiple_choice',
          question: 'Da quanti anni sei in Italia?',
          options: [
            { value: 'less1', text: 'Meno di 1 anno' },
            { value: '1to2', text: '1-2 anni' },
            { value: 'more2', text: 'Più di 2 anni' },
            { value: 'born', text: 'Sono nato/a in Italia' }
          ]
        }
      ],
      reading: [], // Verranno generate dall'AI
      grammar: [], // Verranno generate dall'AI
      writing: [], // Verranno generate dall'AI
      speaking: [] // Verranno generate dall'AI
    };
    setQuestionBank(hardcodedBank);
    setCurrentQuestions(hardcodedBank.demographic);
  };

  // Gestione avanzamento sezioni
  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Aggiorna NAI status immediatamente quando rispondi alla domanda anni
    if (questionId === 'years_italy') {
      const isNAIUser = answer === 'less1' || answer === '1to2';
      setIsNAI(isNAIUser);
      console.log('NAI Status aggiornato:', isNAIUser, 'Years:', answer);
    }
  };

  const nextSection = async () => {
    const currentSectionId = testSections[currentSection].id;
    
    // Determina se è NAI dalla prima sezione
    if (currentSection === 0) {
      const yearsInItaly = answers.years_italy;
      const isNAIUser = yearsInItaly === 'less1' || yearsInItaly === '1to2';
      setIsNAI(isNAIUser);
      console.log('NAI Status:', isNAIUser, 'Years:', yearsInItaly); // Debug
    }

    // Marca sezione completata
    setSectionProgress(prev => ({
      ...prev,
      [currentSectionId]: true
    }));

    // Avanza alla sezione successiva
    if (currentSection < testSections.length - 1) {
      const nextSectionIndex = currentSection + 1;
      const nextSectionId = testSections[nextSectionIndex].id;
      
      setCurrentSection(nextSectionIndex);
      
      // Carica domande per la prossima sezione
      await loadSectionQuestions(nextSectionId);
    } else {
      // Test completato
      await submitTest();
    }
  };

  const loadSectionQuestions = async (sectionId) => {
    setLoading(true);
    try {
      // Usa Mock Service per generare domande adattive
      console.log('Caricamento sezione:', sectionId);
      
      const { MockQuestionService } = await import('./MockQuestionService');
      const sectionQuestions = await MockQuestionService.generateSectionQuestions(sectionId, {
        isNAI: isNAI,
        motherLanguage: motherLanguage,
        previousAnswers: answers
      });
      
      console.log('Domande caricate per', sectionId, ':', sectionQuestions);
      setCurrentQuestions(sectionQuestions);
    } catch (error) {
      console.error('Errore generazione domande sezione:', error);
      
      // FALLBACK: Usa domande hardcoded per la sezione
      const fallbackQuestions = getFallbackQuestions(sectionId);
      console.log('Usando fallback per', sectionId, ':', fallbackQuestions);
      setCurrentQuestions(fallbackQuestions);
    } finally {
      setLoading(false);
    }
  };

  // Fallback domande per ogni sezione
  const getFallbackQuestions = (sectionId) => {
    const fallbacks = {
      reading: [
        {
          id: 'reading_fallback_1',
          type: 'reading_comprehension',
          text: 'Maria è una studentessa. Ha 20 anni e studia medicina. Ogni mattina va all\'università.',
          subQuestions: [
            {
              id: 'reading_fallback_1_q1',
              question: 'Che cosa studia Maria?',
              options: [
                { value: 'correct', text: 'Medicina', isCorrect: true },
                { value: 'wrong1', text: 'Storia', isCorrect: false },
                { value: 'wrong2', text: 'Matematica', isCorrect: false },
                { value: 'wrong3', text: 'Arte', isCorrect: false }
              ]
            }
          ]
        }
      ],
      grammar: [
        {
          id: 'grammar_fallback_1',
          type: 'grammar',
          question: 'Completa: "Io _____ italiano."',
          options: [
            { value: 'correct', text: 'sono', isCorrect: true },
            { value: 'wrong1', text: 'sei', isCorrect: false },
            { value: 'wrong2', text: 'è', isCorrect: false },
            { value: 'wrong3', text: 'siamo', isCorrect: false }
          ]
        }
      ],
      writing: [
        {
          id: 'writing_fallback_1',
          type: 'writing',
          prompt: 'Presentati brevemente: scrivi il tuo nome e cosa ti piace fare.',
          placeholder: 'Mi chiamo...',
          minWords: 20,
          minRows: 3
        }
      ],
      speaking: [
        {
          id: 'speaking_fallback_1',
          type: 'speaking',
          prompt: 'Presentati: di\' il tuo nome e la tua età.',
          maxDuration: 30
        }
      ]
    };
    
    return fallbacks[sectionId] || [];
  };

  // ALGORITMO DI SCORING QCER AVANZATO - FIXED
  const calculateQCERLevel = async () => {
    try {
      console.log('🔍 === INIZIO CALCOLO QCER ===');
      
      // Valuta risposte di scrittura e parlato con Mock AI
      const { MockQuestionService, QCERScoring } = await import('./MockQuestionService');
      
      // Crea una copia delle risposte per non modificare l'originale
      const evaluatedAnswers = { ...answers };
      
      // Valuta scrittura
      console.log('📝 Valutazione sezione scrittura...');
      for (let key of Object.keys(evaluatedAnswers)) {
        if (key.includes('writing') && typeof evaluatedAnswers[key] === 'string') {
          try {
            const evaluation = await MockQuestionService.evaluateWriting(evaluatedAnswers[key], 'A1');
            evaluatedAnswers[key] = { 
              score: evaluation.score, 
              text: evaluatedAnswers[key],
              feedback: evaluation.feedback || '',
              suggestedLevel: evaluation.suggestedLevel || 'A1'
            };
            console.log('✅ Scrittura valutata:', key, 'Score:', evaluation.score);
          } catch (evalError) {
            console.warn('⚠️ Errore valutazione scrittura:', evalError);
            evaluatedAnswers[key] = { score: 0.5, text: evaluatedAnswers[key] };
          }
        }
        
        // Valuta parlato
        if (key.includes('speaking') && typeof evaluatedAnswers[key] === 'object' && evaluatedAnswers[key]) {
          try {
            if (evaluatedAnswers[key].skipped) {
              evaluatedAnswers[key].score = 0.5;
              console.log('⏭️ Parlato saltato:', key);
            } else if (evaluatedAnswers[key].audioBlob) {
              const evaluation = await MockQuestionService.evaluateSpeaking(evaluatedAnswers[key], 'A1');
              evaluatedAnswers[key] = { ...evaluatedAnswers[key], score: evaluation.score };
              console.log('✅ Parlato valutato:', key, 'Score:', evaluation.score);
            }
          } catch (evalError) {
            console.warn('⚠️ Errore valutazione parlato:', evalError);
            evaluatedAnswers[key] = { ...evaluatedAnswers[key], score: 0.5 };
          }
        }
      }

      // Calcola livello QCER finale con logging dettagliato
      console.log('🧮 Calcolo livello finale...');
      const levelResult = QCERScoring.calculateLevel(evaluatedAnswers);
      
      // Verifica che il risultato sia valido
      if (!levelResult || typeof levelResult !== 'object') {
        throw new Error('QCERScoring ha restituito un risultato non valido');
      }
      
      const finalLevel = levelResult.level || levelResult;
      console.log('🎯 Livello finale calcolato:', finalLevel);
      
      // Verifica che sia un livello QCER valido
      const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      if (!validLevels.includes(finalLevel)) {
        console.warn('⚠️ Livello non valido, uso A1:', finalLevel);
        return 'A1';
      }
      
      return finalLevel;
      
    } catch (error) {
      console.error('❌ Errore calcolo QCER, uso algoritmo fallback:', error);
      
      // ALGORITMO FALLBACK SEMPLIFICATO
      console.log('🔧 === ALGORITMO FALLBACK ===');
      
      const sectionScores = {
        reading: 0,
        grammar: 0,
        writing: 0,
        speaking: 0
      };

      // Calcola punteggi per sezione
      Object.keys(sectionScores).forEach(section => {
        const sectionAnswers = Object.keys(answers)
          .filter(key => key.includes(section))
          .map(key => answers[key]);
        
        console.log(`📊 Sezione ${section}:`, sectionAnswers.length, 'risposte');
        
        if (sectionAnswers.length > 0) {
          const correctAnswers = sectionAnswers.filter(answer => {
            if (typeof answer === 'object' && answer.isCorrect) return true;
            if (answer === 'correct') return true;
            if (typeof answer === 'object' && answer.score && answer.score > 0.6) return true;
            if (typeof answer === 'string' && answer.length > 10) return true; // Testi scritti
            return false;
          }).length;
          
          sectionScores[section] = (correctAnswers / sectionAnswers.length) * 100;
        } else {
          sectionScores[section] = 50; // Neutro se nessuna risposta
        }
      });

      console.log('📊 FALLBACK - Punteggi sezioni:', sectionScores);

      // Media ponderata
      const totalScore = (
        sectionScores.reading * 0.25 +
        sectionScores.grammar * 0.35 +
        sectionScores.writing * 0.25 +
        sectionScores.speaking * 0.15
      );

      console.log('🎯 FALLBACK - Punteggio totale:', totalScore + '%');

      // Mapping conservativo per studenti NAI
      if (totalScore >= 85) return 'C1';
      if (totalScore >= 75) return 'B2';
      if (totalScore >= 65) return 'B1';
      if (totalScore >= 45) return 'A2';
      return 'A1';
    }
  };

  // INVIO TEST E ASSEGNAZIONE CINTURA - FIXED
  const submitTest = async () => {
    setLoading(true);
    
    try {
      console.log('🎯 Inizio calcolo livello QCER...');
      let qcerLevel = await calculateQCERLevel();
      console.log('✅ Livello calcolato:', qcerLevel);
      
      // CONTROLLO SICUREZZA: Verifica che il livello sia valido
      if (!qcerLevel || !qcerToBelt[qcerLevel]) {
        console.warn('⚠️ Livello non valido, uso A1 di default');
        qcerLevel = 'A1';
      }
      
      const assignedBelt = qcerToBelt[qcerLevel];
      console.log('🥋 Cintura assegnata:', assignedBelt);
      
      // Verifica che la cintura sia valida
      if (!assignedBelt || !assignedBelt.belt) {
        console.error('❌ Errore nella mappatura cintura');
        throw new Error('Errore nella mappatura cintura per livello: ' + qcerLevel);
      }

      // Salva risultati nel database
      const testResults = {
        answers,
        qcerLevel,
        belt: assignedBelt.belt,
        beltName: assignedBelt.name,
        beltColor: assignedBelt.color,
        isNAI,
        motherLanguage,
        timestamp: new Date().toISOString()
      };
      
      console.log('💾 Salvataggio risultati test:', testResults);

      // Aggiorna profilo utente
      await updateUserProfile(qcerLevel, assignedBelt);
      
      console.log('🚀 Reindirizzamento a dashboard...');
      
      // Reindirizza con celebrazione cintura
      navigate('/dashboard', { 
        state: { 
          newBelt: assignedBelt,
          qcerLevel,
          isFirstTest: true,
          testResults: testResults
        }
      });
      
    } catch (error) {
      console.error('❌ Errore salvataggio test:', error);
      
      // FALLBACK: Usa livello A1 se tutto fallisce
      console.log('🔧 Applicando fallback A1...');
      
      const fallbackBelt = qcerToBelt['A1'];
      
      navigate('/dashboard', { 
        state: { 
          newBelt: fallbackBelt,
          qcerLevel: 'A1',
          isFirstTest: true,
          error: 'Test completato con valutazione di base'
        }
      });
      
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (qcerLevel, belt) => {
    try {
      console.log('Aggiornamento profilo:', {
        qcerLevel,
        currentBelt: belt.belt,
        testCompletedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Errore aggiornamento profilo:', error);
    }
  };

  // Funzione per verificare se si può procedere
  const canProceed = () => {
    const currentSectionId = testSections[currentSection]?.id;
    
    if (currentSection === 0) {
      // Sezione demografica
      const hasYearsAnswer = answers.years_italy;
      const hasLanguageIfNAI = !isNAI || motherLanguage;
      
      console.log('CanProceed check:', {
        hasYearsAnswer,
        isNAI,
        motherLanguage,
        hasLanguageIfNAI,
        result: hasYearsAnswer && hasLanguageIfNAI
      });
      
      return hasYearsAnswer && hasLanguageIfNAI;
    }
    
    // Per altre sezioni, verifica che ci siano risposte
    const sectionAnswers = Object.keys(answers).filter(key => 
      key.includes(currentSectionId) || 
      key.startsWith(currentSectionId)
    );
    
    const requiredAnswers = currentQuestions.length;
    const canPass = sectionAnswers.length >= Math.max(1, requiredAnswers * 0.5);
    
    console.log('CanProceed other section:', {
      currentSectionId,
      sectionAnswers: sectionAnswers.length,
      requiredAnswers,
      canPass
    });
    
    return canPass;
  };

  // Rendering sezione demografica
  const renderDemographicSection = () => (
    <div className="test-section">
      <h3>Informazioni di Base</h3>
      <div className="demographic-questions">
        {currentQuestions.map((question, index) => (
          <div key={question.id} className="question-container">
            <p className="question-text">{question.question}</p>
            <div className="options-grid">
              {question.options.map(option => (
                <button
                  key={option.value}
                  className={answers[question.id] === option.value ? 'selected' : ''}
                  onClick={() => handleAnswer(question.id, option.value)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {/* Selezione lingua madre per NAI */}
        {isNAI && (
          <div className="language-selection">
            <h4>Qual è la tua lingua madre?</h4>
            <p className="language-note">Questa informazione ci aiuta a personalizzare il test</p>
            <div className="language-grid">
              {supportedLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={motherLanguage === lang.code ? 'selected' : ''}
                  onClick={() => {
                    setMotherLanguage(lang.code);
                    console.log('Lingua selezionata:', lang.name);
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Rendering sezioni competenze QCER
  const renderSkillSection = () => {
    const section = testSections[currentSection];
    
    return (
      <div className="test-section">
        <h3>{section.name}</h3>
        <div className="section-progress">
          Sezione {currentSection + 1} di {testSections.length}
        </div>
        
        <div className="questions-container">
          {/* Debug: mostra quante domande ci sono */}
          {currentQuestions.length === 0 && (
            <div style={{background: '#ffebee', padding: '20px', border: '1px solid #f44336', borderRadius: '8px', margin: '20px 0'}}>
              <h4 style={{color: '#d32f2f'}}>⚠️ Nessuna domanda caricata</h4>
              <p>Sezione: {testSections[currentSection]?.id}</p>
              <p>Numero domande: {currentQuestions.length}</p>
              <button 
                onClick={() => {
                  console.log('Force loading fallback...');
                  setCurrentQuestions(getFallbackQuestions(testSections[currentSection]?.id));
                }}
                style={{background: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px'}}
              >
                🔄 Forza Caricamento Domande
              </button>
            </div>
          )}
          
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="question-block">
              {/* Rendering basato sul tipo di domanda */}
              {question.type === 'reading_comprehension' && (
                <div className="reading-question">
                  <div className="reading-text">{question.text}</div>
                  <div className="comprehension-questions">
                    {question.subQuestions.map(subQ => (
                      <div key={subQ.id} className="sub-question">
                        <p>{subQ.question}</p>
                        <div className="options-grid">
                          {subQ.options.map(option => (
                            <button
                              key={option.value}
                              className={answers[subQ.id] === option.value ? 'selected' : ''}
                              onClick={() => handleAnswer(subQ.id, option.value)}
                            >
                              {option.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {question.type === 'grammar' && (
                <div className="grammar-question">
                  <p>{question.question}</p>
                  <div className="options-grid">
                    {question.options.map(option => (
                      <button
                        key={option.value}
                        className={answers[question.id] === option.value ? 'selected' : ''}
                        onClick={() => handleAnswer(question.id, option.value)}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {question.type === 'writing' && (
                <div className="writing-question">
                  <p>{question.prompt}</p>
                  <textarea
                    placeholder={question.placeholder}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    rows={question.minRows || 4}
                  />
                  <div className="word-count">
                    Parole: {(answers[question.id] || '').split(' ').filter(w => w).length}
                    {question.minWords && ` (minimo: ${question.minWords})`}
                  </div>
                </div>
              )}
              
              {question.type === 'speaking' && (
                <div className="speaking-question">
                  <p>{question.prompt}</p>
                  <SpeakingRecorder 
                    questionId={question.id}
                    onRecordingComplete={(audioData) => handleAnswer(question.id, audioData)}
                    maxDuration={question.maxDuration || 60}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Progress tracker migliorato
  const renderProgressTracker = () => (
    <div className="progress-tracker-qcer">
      {testSections.map((section, index) => (
        <div key={section.id} className="progress-section">
          <div className={`progress-step ${
            index < currentSection ? 'completed' : 
            index === currentSection ? 'active' : 'pending'
          }`}>
            {index < currentSection ? '✓' : index + 1}
          </div>
          <span className="section-name">{section.name}</span>
          {index < testSections.length - 1 && <div className="progress-line" />}
        </div>
      ))}
    </div>
  );

  // Loading con messaggi dinamici
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p>
        {currentSection === 0 ? 'Caricamento test...' :
         currentSection < testSections.length ? 'Generazione domande adattive...' :
         'Analisi risultati e assegnazione cintura...'}
      </p>
      {currentSection === testSections.length && (
        <div className="belt-preview">
          <p>Preparazione della tua cintura karate...</p>
          <div className="belt-animation">🥋</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="test-ingresso-container qcer-enhanced">
      <header className="test-header">
        <h2>Test di Livello QCER</h2>
        <p className="test-description">
          Questo test determinerà il tuo livello secondo il Quadro Comune Europeo 
          e ti assegnerà la cintura karate corrispondente per iniziare il tuo percorso.
        </p>
      </header>
      
      {renderProgressTracker()}
      
      {loading ? renderLoading() : (
        <div className="test-content">
          {currentSection === 0 ? renderDemographicSection() : renderSkillSection()}
          
          <div className="section-navigation">
            {currentSection > 0 && (
              <button 
                className="back-button"
                onClick={() => setCurrentSection(currentSection - 1)}
              >
                Indietro
              </button>
            )}
            
            <button
              className="next-button"
              onClick={nextSection}
              disabled={!canProceed()}
            >
              {currentSection === testSections.length - 1 ? 'Completa Test' : 'Continua'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// COMPONENTE SPEAKING RECORDER MIGLIORATO
// SOSTITUISCI il componente SpeakingRecorder alla fine del TestIngresso.jsx
// Rimuovi tutto da "const SpeakingRecorder =" fino alla fine del file e sostituisci con questo:

const SpeakingRecorder = ({ questionId, onRecordingComplete, maxDuration }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(time => time + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Il tuo browser non supporta la registrazione audio');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        onRecordingComplete({
          audioBlob,
          audioUrl,
          duration: recordingTime * 1000
        });
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setHasError(false);
      setRecordingTime(0);

      setTimeout(() => {
        if (recorder.state === 'recording') {
          stopRecording();
        }
      }, maxDuration * 1000);

    } catch (error) {
      console.error('Errore accesso microfono:', error);
      setHasError(true);
      
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Accesso al microfono negato. Abilita il microfono nelle impostazioni del browser.');
      } else if (error.name === 'NotFoundError') {
        setErrorMessage('Nessun microfono trovato. Collega un microfono e riprova.');
      } else {
        setErrorMessage('Errore microfono: ' + error.message);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const skipSpeaking = () => {
    console.log('🔇 Sezione parlato saltata per:', questionId);
    onRecordingComplete({
      audioBlob: null,
      audioUrl: null,
      duration: 0,
      score: 0.5,
      skipped: true
    });
  };

  // STILI INLINE invece di styled-jsx
  const styles = {
    speakingRecorder: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      margin: '10px 0',
      backgroundColor: '#f9f9f9'
    },
    recordingInfo: {
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: '#e3f2fd',
      borderRadius: '4px'
    },
    recordingError: {
      padding: '15px',
      backgroundColor: '#ffebee',
      border: '1px solid #f44336',
      borderRadius: '4px'
    },
    errorMessage: {
      color: '#d32f2f',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    recordButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    skipButton: {
      marginTop: '15px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    recordingActive: {
      textAlign: 'center',
      padding: '20px'
    },
    recordingIndicator: {
      fontSize: '18px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    pulseDot: {
      width: '10px',
      height: '10px',
      backgroundColor: '#ff0000',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '8px',
      animation: 'pulse 1s infinite'
    },
    timer: {
      fontSize: '16px',
      marginBottom: '15px',
      color: '#dc3545',
      fontWeight: 'bold'
    },
    stopButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    recordingComplete: {
      textAlign: 'center'
    },
    audioControls: {
      width: '100%',
      marginBottom: '10px'
    },
    actionButtons: {
      marginTop: '15px'
    },
    reRecordButton: {
      backgroundColor: '#ffc107',
      color: '#212529',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px'
    },
    speakingHelp: {
      fontSize: '14px',
      color: '#6c757d',
      marginTop: '15px'
    }
  };

  return (
    <div style={styles.speakingRecorder}>
      {hasError ? (
        <div style={styles.recordingError}>
          <p style={styles.errorMessage}>⚠️ {errorMessage}</p>
          <div className="error-actions">
            <button 
              onClick={() => {
                setHasError(false);
                setErrorMessage('');
              }}
              style={styles.recordButton}
            >
              🔄 Riprova
            </button>
            <button 
              onClick={skipSpeaking}
              style={styles.skipButton}
            >
              ⏭️ Salta Sezione Parlato
            </button>
          </div>
          <p style={styles.speakingHelp}>
            Nota: Saltando la sezione parlato, il test sarà meno preciso ma potrai comunque ottenere una valutazione.
          </p>
        </div>
      ) : (
        <>
          <div style={styles.recordingInfo}>
            <p>📋 Hai <strong>{maxDuration} secondi</strong> per rispondere.</p>
            <p>💡 Parla chiaramente verso il microfono</p>
          </div>

          <div className="recording-controls">
            {!isRecording && !audioURL ? (
              <div className="recording-start">
                <button 
                  style={styles.recordButton}
                  onClick={startRecording}
                >
                  🎤 Inizia Registrazione
                </button>
                
                <button 
                  onClick={skipSpeaking}
                  style={styles.skipButton}
                >
                  ⏭️ Salta questa sezione
                </button>
              </div>
            ) : isRecording ? (
              <div style={styles.recordingActive}>
                <div style={styles.recordingIndicator}>
                  <div style={styles.pulseDot}></div>
                  <span>🔴 Registrazione in corso...</span>
                </div>
                
                <div style={styles.timer}>
                  Tempo: {recordingTime}s / {maxDuration}s
                </div>

                <button 
                  style={styles.stopButton}
                  onClick={stopRecording}
                >
                  ⏹️ Ferma Registrazione
                </button>
              </div>
            ) : audioURL ? (
              <div style={styles.recordingComplete}>
                <p>✅ Registrazione completata!</p>
                
                <div style={styles.audioControls}>
                  <audio controls src={audioURL} style={{ width: '100%', marginBottom: '10px' }} />
                </div>

                <div style={styles.actionButtons}>
                  <button 
                    onClick={() => {
                      setAudioURL(null);
                      setIsRecording(false);
                      setRecordingTime(0);
                    }}
                    style={styles.reRecordButton}
                  >
                    🔄 Registra di Nuovo
                  </button>
                  
                  <button 
                    onClick={skipSpeaking}
                    style={styles.skipButton}
                  >
                    ⏭️ Salta comunque
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          
          {!audioURL && !isRecording && (
            <div style={styles.speakingHelp}>
              <p>⚠️ Se non hai microfono disponibile, puoi saltare questa sezione</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestIngresso;