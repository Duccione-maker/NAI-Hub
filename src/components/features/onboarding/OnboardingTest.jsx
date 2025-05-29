import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserProfile from '../../../hooks/useUserProfile'; // Verrà creato in seguito
import aiService from '../../../services/aiService';
import userService from '../../../services/userService';

// Tipi di domande
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TEXT: 'text',
  TRANSLATION: 'translation'
};

// Domande del test di livello
const levelingQuestions = [
  {
    id: 1,
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    question: 'Scegli la risposta corretta: "Io ____ italiano."',
    options: ['sono', 'è', 'sei', 'siamo'],
    correctAnswer: 'sono',
    level: 'A1'
  },
  {
    id: 2,
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    question: 'Completa la frase: "Tu ____ una bella casa."',
    options: ['hai', 'ho', 'ha', 'avete'],
    correctAnswer: 'hai',
    level: 'A1'
  },
  {
    id: 3,
    type: QUESTION_TYPES.TEXT,
    question: 'Scrivi una breve presentazione di te stesso in italiano.',
    level: 'A2'
  },
  {
    id: 4,
    type: QUESTION_TYPES.TRANSLATION,
    question: 'Traduci in italiano: "Yesterday I went to the cinema with my friends."',
    level: 'B1'
  },
  {
    id: 5,
    type: QUESTION_TYPES.TEXT,
    question: 'Descrivi che cosa hai fatto lo scorso fine settimana usando il passato prossimo.',
    level: 'B1'
  }
];

/**
 * Componente per il test di valutazione iniziale
 */
const OnboardingTest = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, loading } = useUserProfile();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  // Se l'utente ha già un livello, reindirizza alla dashboard
  useEffect(() => {
    if (!loading && userProfile && userProfile.level && !result) {
      navigate('/dashboard');
    }
  }, [loading, userProfile, navigate, result]);
  
  // Gestisce il cambio di risposta
  const handleAnswerChange = useCallback((event) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = event.target.value;
    setAnswers(newAnswers);
  }, [answers, currentQuestion]);
  
  // Gestisce il click sul bottone Avanti
  const handleNext = useCallback(() => {
    if (currentQuestion < levelingQuestions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
    } else {
      handleSubmit();
    }
  }, [currentQuestion, levelingQuestions.length]);
  
  // Gestisce il click sul bottone Indietro
  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prevQuestion => prevQuestion - 1);
    }
  }, [currentQuestion]);
  
  // Gestisce la sottomissione del test
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Valuta le risposte con l'AI
      const evaluationResult = await aiService.evaluateOnboarding(answers);
      setResult(evaluationResult);
      
      // Aggiorna il profilo utente con il nuovo livello
      if (evaluationResult && evaluationResult.level) {
        await userService.updateLevel(evaluationResult.level);
        setUserProfile(prev => ({
          ...prev,
          level: evaluationResult.level
        }));
      }
      
      // Naviga alla dashboard dopo 3 secondi
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Errore nella valutazione:', err);
      setError('Si è verificato un errore durante la valutazione. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, navigate, setUserProfile]);
  
  // Mostra un loader durante il caricamento
  if (loading) {
    return <div className="text-center py-8">Caricamento in corso...</div>;
  }
  
  // Mostra il risultato del test
  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Risultato del Test</h2>
        <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
          <p className="text-lg">
            Il tuo livello di italiano è: <strong>{result.level}</strong>
          </p>
          <p className="mt-2">{result.feedback}</p>
        </div>
        <p className="text-center text-gray-600">
          Verrai reindirizzato alla dashboard in un attimo...
        </p>
      </div>
    );
  }
  
  // Ottieni la domanda corrente
  const question = levelingQuestions[currentQuestion];
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Test di livello</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Domanda {currentQuestion + 1} di {levelingQuestions.length}
        </p>
        <progress 
          className="w-full h-2" 
          value={currentQuestion + 1} 
          max={levelingQuestions.length}
        />
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{question.question}</h3>
        
        {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={handleAnswerChange}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )}
        
        {(question.type === QUESTION_TYPES.TEXT || 
          question.type === QUESTION_TYPES.TRANSLATION) && (
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md"
            rows="5"
            value={answers[currentQuestion] || ''}
            onChange={handleAnswerChange}
            placeholder="Scrivi la tua risposta qui..."
          />
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestion === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Indietro
        </button>
        
        <button
          onClick={handleNext}
          disabled={isSubmitting || !answers[currentQuestion]}
          className={`px-4 py-2 rounded-md ${
            isSubmitting || !answers[currentQuestion]
              ? 'bg-blue-300 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentQuestion < levelingQuestions.length - 1 ? 'Avanti' : 'Termina Test'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingTest;