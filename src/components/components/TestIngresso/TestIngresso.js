import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TestIngressoStyles.css';

const TestIngresso = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isNAI, setIsNAI] = useState(false);
  const [motherLanguage, setMotherLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  
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

  // Gestione delle risposte
  const handleAnswer = (question, answer) => {
    setAnswers({
      ...answers,
      [question]: answer
    });
  };

  // Passaggio alla fase successiva del test
  const nextStep = () => {
    if (step === 1) {
      // Determina se l'utente è NAI basandosi sulla risposta alla prima domanda
      setIsNAI(answers.yearsInItaly === 'less1' || answers.yearsInItaly === '1to2');
    }
    setStep(step + 1);
  };

  // Invio del test completo
  const submitTest = async () => {
    setLoading(true);
    
    // Simulazione di chiamata API per l'analisi del test
    try {
      // In un'applicazione reale, qui invieresti le risposte al server
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulazione del delay
      
      // Determina il livello in base alle risposte
      let level;
      if (isNAI) {
        if (motherLanguage === 'ar' || motherLanguage === 'zh') {
          level = 'nai-basic';
        } else {
          level = 'nai-intermediate';
        }
      } else {
        // Logica semplificata per la determinazione del livello
        const readingScore = answers.readingComprehension === 'correct' ? 1 : 0;
        const grammarScore = answers.grammarQuestion === 'correct' ? 1 : 0;
        const totalScore = readingScore + grammarScore;
        
        if (totalScore === 0) level = 'beginner';
        else if (totalScore === 1) level = 'intermediate';
        else level = 'advanced';
      }
      
      // In un'applicazione reale, qui aggiornesti il profilo utente nel database
      console.log('Test completato. Livello assegnato:', level);
      
      // Reindirizza alla dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Errore durante l\'invio del test:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rendering della prima fase: domanda sugli anni in Italia
  const renderStep1 = () => (
    <div className="test-step">
      <h3>Da quanti anni sei in Italia?</h3>
      <div className="options-grid">
        <button 
          className={answers.yearsInItaly === 'less1' ? 'selected' : ''}
          onClick={() => handleAnswer('yearsInItaly', 'less1')}
        >
          Meno di 1 anno
        </button>
        <button 
          className={answers.yearsInItaly === '1to2' ? 'selected' : ''}
          onClick={() => handleAnswer('yearsInItaly', '1to2')}
        >
          1-2 anni
        </button>
        <button 
          className={answers.yearsInItaly === 'more2' ? 'selected' : ''}
          onClick={() => handleAnswer('yearsInItaly', 'more2')}
        >
          Più di 2 anni
        </button>
        <button 
          className={answers.yearsInItaly === 'born' ? 'selected' : ''}
          onClick={() => handleAnswer('yearsInItaly', 'born')}
        >
          Sono nato/a in Italia
        </button>
      </div>
      
      <div className="step-navigation">
        <button 
          className="next-button"
          onClick={nextStep}
          disabled={!answers.yearsInItaly}
        >
          Continua
        </button>
      </div>
    </div>
  );

  // Rendering della seconda fase per studenti NAI: selezione della lingua madre
  const renderStep2NAI = () => (
    <div className="test-step">
      <h3>Qual è la tua lingua madre?</h3>
      <div className="language-grid">
        {supportedLanguages.map(lang => (
          <button 
            key={lang.code}
            className={motherLanguage === lang.code ? 'selected' : ''}
            onClick={() => setMotherLanguage(lang.code)}
          >
            {lang.name}
          </button>
        ))}
      </div>
      
      <div className="step-navigation">
        <button className="back-button" onClick={() => setStep(1)}>
          Indietro
        </button>
        <button 
          className="next-button"
          onClick={nextStep}
          disabled={!motherLanguage}
        >
          Continua
        </button>
      </div>
    </div>
  );

  // Rendering della seconda fase per studenti non-NAI: comprensione del testo
  const renderStep2NonNAI = () => (
    <div className="test-step">
      <h3>Comprensione del testo</h3>
      <div className="reading-test">
        <div className="reading-text">
          <p>
            L'Italia è un paese situato nell'Europa meridionale. È conosciuta per la sua arte, 
            architettura, cultura e cucina. Roma è la capitale dell'Italia e ospita il Colosseo, 
            un antico anfiteatro costruito quasi 2000 anni fa.
          </p>
        </div>
        
        <div className="question">
          <p>Dove si trova l'Italia?</p>
          <div className="options-grid">
            <button 
              className={answers.readingComprehension === 'correct' ? 'selected' : ''}
              onClick={() => handleAnswer('readingComprehension', 'correct')}
            >
              Europa meridionale
            </button>
            <button 
              className={answers.readingComprehension === 'wrong1' ? 'selected' : ''}
              onClick={() => handleAnswer('readingComprehension', 'wrong1')}
            >
              Europa settentrionale
            </button>
            <button 
              className={answers.readingComprehension === 'wrong2' ? 'selected' : ''}
              onClick={() => handleAnswer('readingComprehension', 'wrong2')}
            >
              Asia
            </button>
            <button 
              className={answers.readingComprehension === 'wrong3' ? 'selected' : ''}
              onClick={() => handleAnswer('readingComprehension', 'wrong3')}
            >
              Africa
            </button>
          </div>
        </div>
      </div>
      
      <div className="step-navigation">
        <button className="back-button" onClick={() => setStep(1)}>
          Indietro
        </button>
        <button 
          className="next-button"
          onClick={nextStep}
          disabled={!answers.readingComprehension}
        >
          Continua
        </button>
      </div>
    </div>
  );

  // Rendering della terza fase per studenti NAI: test visivo-associativo
  const renderStep3NAI = () => (
    <div className="test-step">
      <h3>Associa la parola all'immagine</h3>
      <div className="visual-test">
        <div className="test-word">Casa</div>
        <div className="images-grid">
          <button 
            className={answers.visualAssociation === 'house' ? 'selected' : ''}
            onClick={() => handleAnswer('visualAssociation', 'house')}
          >
            🏠
          </button>
          <button 
            className={answers.visualAssociation === 'car' ? 'selected' : ''}
            onClick={() => handleAnswer('visualAssociation', 'car')}
          >
            🚗
          </button>
          <button 
            className={answers.visualAssociation === 'tree' ? 'selected' : ''}
            onClick={() => handleAnswer('visualAssociation', 'tree')}
          >
            🌳
          </button>
          <button 
            className={answers.visualAssociation === 'book' ? 'selected' : ''}
            onClick={() => handleAnswer('visualAssociation', 'book')}
          >
            📚
          </button>
        </div>
      </div>
      
      <div className="step-navigation">
        <button className="back-button" onClick={() => setStep(2)}>
          Indietro
        </button>
        <button 
          className="next-button"
          onClick={submitTest}
          disabled={!answers.visualAssociation}
        >
          Completa il test
        </button>
      </div>
    </div>
  );

  // Rendering della terza fase per studenti non-NAI: grammatica
  const renderStep3NonNAI = () => (
    <div className="test-step">
      <h3>Grammatica</h3>
      <div className="grammar-test">
        <div className="question">
          <p>Completa la frase con la forma corretta del verbo:</p>
          <p className="test-sentence">
            Ieri io <span className="blank">_________</span> al cinema con i miei amici.
          </p>
          <div className="options-grid">
            <button 
              className={answers.grammarQuestion === 'correct' ? 'selected' : ''}
              onClick={() => handleAnswer('grammarQuestion', 'correct')}
            >
              sono andato
            </button>
            <button 
              className={answers.grammarQuestion === 'wrong1' ? 'selected' : ''}
              onClick={() => handleAnswer('grammarQuestion', 'wrong1')}
            >
              vado
            </button>
            <button 
              className={answers.grammarQuestion === 'wrong2' ? 'selected' : ''}
              onClick={() => handleAnswer('grammarQuestion', 'wrong2')}
            >
              andrò
            </button>
            <button 
              className={answers.grammarQuestion === 'wrong3' ? 'selected' : ''}
              onClick={() => handleAnswer('grammarQuestion', 'wrong3')}
            >
              andare
            </button>
          </div>
        </div>
      </div>
      
      <div className="step-navigation">
        <button className="back-button" onClick={() => setStep(2)}>
          Indietro
        </button>
        <button 
          className="next-button"
          onClick={submitTest}
          disabled={!answers.grammarQuestion}
        >
          Completa il test
        </button>
      </div>
    </div>
  );

  // Schermata di caricamento
  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Analisi in corso...</p>
    </div>
  );

  return (
    <div className="test-ingresso-container">
      <h2>Test di Ingresso</h2>
      <p className="test-description">
        Questo test ci aiuterà a determinare il tuo livello di competenza linguistica
        e a personalizzare il percorso di apprendimento.
      </p>
      
      <div className="progress-tracker">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>
      
      {loading ? renderLoading() : (
        <>
          {step === 1 && renderStep1()}
          {step === 2 && isNAI ? renderStep2NAI() : renderStep2NonNAI()}
          {step === 3 && isNAI ? renderStep3NAI() : renderStep3NonNAI()}
        </>
      )}
    </div>
  );
};

export default TestIngresso;