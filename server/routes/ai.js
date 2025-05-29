const express = require('express');
const router = express.Router();

// POST /api/ai/evaluate - Valuta una risposta dell'utente
router.post('/evaluate', (req, res) => {
  const { text, userResponse, type } = req.body;
  
  if (!text || !userResponse || !type) {
    return res.status(400).json({ 
      error: 'Testo, risposta utente e tipo di valutazione sono richiesti' 
    });
  }
  
  // Qui in una vera app chiamerei un'API di AI
  // Per ora simulo una risposta
  
  let evaluation;
  
  switch (type) {
    case 'reading':
      evaluation = simulateReadingEvaluation(text, userResponse);
      break;
    case 'writing':
      evaluation = simulateWritingEvaluation(userResponse);
      break;
    case 'onboarding':
      evaluation = simulateOnboardingEvaluation(userResponse);
      break;
    default:
      return res.status(400).json({ error: 'Tipo di valutazione non valido' });
  }
  
  res.json(evaluation);
});

// POST /api/ai/suggest - Ottieni suggerimenti per l'apprendimento
router.post('/suggest', (req, res) => {
  const { level, interests, learningHistory } = req.body;
  
  if (!level) {
    return res.status(400).json({ error: 'Il livello è richiesto' });
  }
  
  // Simulo una risposta di suggerimenti
  const suggestions = simulateSuggestions(level, interests);
  
  res.json(suggestions);
});

// Funzioni di simulazione AI
function simulateReadingEvaluation(text, userResponse) {
  // In una vera app, qui manderesti la richiesta a un modello AI
  const score = Math.floor(Math.random() * 40) + 60; // Punteggio tra 60-100
  
  return {
    score,
    feedback: `Hai compreso ${score}% del testo. ` + 
      (score > 80 
        ? 'Ottimo lavoro!' 
        : 'Continua a esercitarti per migliorare la comprensione.'),
    suggestions: [
      'Prova a leggere più attentamente i dettagli',
      'Focalizzati sui tempi verbali nel testo',
      'Cerca di identificare i punti chiave della narrazione'
    ]
  };
}

function simulateWritingEvaluation(userResponse) {
  // In una vera app, qui analizzeresti il testo con un modello AI
  const aspects = [
    { name: 'grammar', score: Math.floor(Math.random() * 40) + 60 },
    { name: 'vocabulary', score: Math.floor(Math.random() * 40) + 60 },
    { name: 'coherence', score: Math.floor(Math.random() * 40) + 60 },
  ];
  
  const totalScore = Math.round(
    aspects.reduce((sum, aspect) => sum + aspect.score, 0) / aspects.length
  );
  
  return {
    score: totalScore,
    aspects,
    feedback: `Il tuo punteggio complessivo è ${totalScore}/100. ` +
      (totalScore > 80 
        ? 'Ottimo lavoro!' 
        : 'Ci sono alcune aree in cui puoi migliorare.'),
    suggestions: [
      'Prova a usare sinonimi per evitare ripetizioni',
      'Fai attenzione alla concordanza dei tempi verbali',
      'Connetti le tue idee con connettori logici adeguati'
    ]
  };
}

function simulateOnboardingEvaluation(responses) {
  // Simula la valutazione per determinare il livello
  let totalPoints = 0;
  
  // In una vera applicazione, analizzeresti le risposte in modo più sofisticato
  // Per ora, assegno punti in base alla lunghezza delle risposte
  if (Array.isArray(responses)) {
    responses.forEach(response => {
      // Più lunga è la risposta, più punti (semplificazione)
      const length = response.length;
      if (length > 100) totalPoints += 3;
      else if (length > 50) totalPoints += 2;
      else if (length > 20) totalPoints += 1;
    });
  } else if (typeof responses === 'string') {
    const length = responses.length;
    if (length > 100) totalPoints += 3;
    else if (length > 50) totalPoints += 2;
    else if (length > 20) totalPoints += 1;
  }
  
  // Determina il livello in base ai punti
  let level;
  if (totalPoints >= 8) level = 'B1';
  else if (totalPoints >= 4) level = 'A2';
  else level = 'A1';
  
  return {
    level,
    confidence: 0.8, // Simulazione della confidenza della previsione
    feedback: `In base alle tue risposte, ti consigliamo di iniziare dal livello ${level}.`
  };
}

function simulateSuggestions(level, interests = []) {
  // Simula suggerimenti personalizzati
  const suggestions = [
    {
      type: 'reading',
      title: `Lettura consigliata per livello ${level}`,
      description: 'Un testo adatto al tuo livello attuale'
    },
    {
      type: 'exercise',
      title: 'Esercizio di grammatica',
      description: `Pratica con i concetti di grammatica del livello ${level}`
    },
    {
      type: 'vocabulary',
      title: 'Amplia il tuo vocabolario',
      description: 'Impara nuove parole relative ai tuoi interessi'
    }
  ];
  
  return {
    suggestions,
    message: `Ecco alcune attività consigliate per il tuo livello ${level}.`
  };
}

module.exports = router;