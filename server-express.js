const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Carica i dati dal file db.json
let dbData;
try {
  dbData = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  console.log('Database caricato con successo');
} catch (error) {
  console.error('Errore nel caricamento del database:', error);
  dbData = { 
    userProfile: {}, 
    userStats: {}, 
    recentActivities: [],
    readingTexts: { facile: [], medio: [], difficile: [] } 
  };
}

// Endpoint utente
app.get('/api/user/profile', (req, res) => {
  res.json(dbData.userProfile);
});

app.get('/api/user/stats', (req, res) => {
  res.json(dbData.userStats);
});

app.get('/api/user/recent-activities', (req, res) => {
  res.json(dbData.recentActivities);
});

app.post('/api/user/updateLevel', (req, res) => {
  const { level } = req.body;
  if (dbData.userProfile) {
    dbData.userProfile.level = level;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User profile not found' });
  }
});

// Endpoint lettura
app.get('/api/texts/:difficulty', (req, res) => {
  const { difficulty } = req.params;
  const texts = dbData.readingTexts && dbData.readingTexts[difficulty] ? dbData.readingTexts[difficulty] : [];
  res.json(texts.map(text => ({
    id: text.id,
    title: text.title,
    description: text.description
  })));
});

app.get('/api/text/:id', (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  
  let text = null;
  
  for (const difficulty of ['facile', 'medio', 'difficile']) {
    if (dbData.readingTexts && dbData.readingTexts[difficulty]) {
      text = dbData.readingTexts[difficulty].find(t => t.id === idNum);
      if (text) break;
    }
  }
  
  if (text) {
    res.json(text);
  } else {
    res.status(404).json({ error: 'Testo non trovato' });
  }
});

// Endpoint esercizi di scrittura
app.get('/api/writing-exercises/:type', (req, res) => {
  const { type } = req.params;
  const exercises = dbData.writingExercises && dbData.writingExercises[type] ? dbData.writingExercises[type] : [];
  res.json(exercises);
});

// Endpoint esercizi di punteggiatura
app.get('/api/punctuation-exercises/:difficulty', (req, res) => {
  const { difficulty } = req.params;
  const exercises = dbData.punctuationExercises && dbData.punctuationExercises[difficulty] ? dbData.punctuationExercises[difficulty] : [];
  res.json(exercises);
});

// API simulata per l'analisi del testo
app.post('/api/ai/analyze-text', (req, res) => {
  const accuracy = Math.floor(Math.random() * 30) + 70; // 70-99%
  
  res.json({
    accuracy,
    feedback: "Il testo dimostra una buona comprensione dell'argomento.",
    errors: []
  });
});

// API simulata per l'analisi della lettura
app.post('/api/ai/analyze-speech', (req, res) => {
  const accuracy = Math.floor(Math.random() * 30) + 70; // 70-99%
  const fluencyScore = Math.floor(Math.random() * 30) + 70; // 70-99%
  
  res.json({
    accuracy,
    fluencyScore,
    errors: [
      {
        word: "difficile",
        suggestion: "La pronuncia corretta è 'dif-fì-ci-le' con l'accento sulla seconda i"
      }
    ],
    suggestions: "Prova a rallentare leggermente la lettura per migliorare la pronuncia."
  });
});

// Endpoint esercizi sui registri linguistici
app.get('/api/register-exercises', (req, res) => {
  const exercises = dbData.registerExercises || [];
  res.json(exercises);
});

// Endpoint per il torneo
app.get('/api/challenges', (req, res) => {
  const challenges = dbData.challengeTournament && dbData.challengeTournament.challenges ? dbData.challengeTournament.challenges : [];
  res.json(challenges);
});

app.get('/api/weekly-challenge', (req, res) => {
  const weeklyChallenge = dbData.challengeTournament && dbData.challengeTournament.weeklyChallenge ? dbData.challengeTournament.weeklyChallenge : null;
  res.json(weeklyChallenge);
});

// Endpoint per gli avversari
app.get('/api/opponents', (req, res) => {
  const opponents = dbData.challengeTournament && dbData.challengeTournament.opponents ? dbData.challengeTournament.opponents : [];
  res.json(opponents);
});

// Endpoint per la classifica del Dojo
app.get('/api/dojo-leaderboard', (req, res) => {
  const leaderboard = dbData.dojoLeaderboard || [];
  res.json(leaderboard);
});

// Endpoint per le richieste di aiuto
app.get('/api/help-requests', (req, res) => {
  const requests = dbData.helpRequests || [];
  res.json(requests);
});

// Endpoint per il glossario
app.get('/api/glossary/search', (req, res) => {
  const { term, language } = req.query;
  const glossary = dbData.glossary && dbData.glossary[language] ? dbData.glossary[language] : [];
  const results = glossary.filter(item => 
    item.italian.toLowerCase().includes((term || '').toLowerCase())
  );
  res.json(results);
});

// Endpoint per le traduzioni recenti
app.get('/api/translations/recent', (req, res) => {
  const { language } = req.query;
  const translations = dbData.recentTranslations && dbData.recentTranslations[language] ? dbData.recentTranslations[language] : [];
  res.json(translations);
});

// Route generica per debug
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Server Express funzionante',
    endpoints: [
      '/api/user/profile',
      '/api/user/stats',
      '/api/user/recent-activities',
      '/api/texts/:difficulty',
      '/api/text/:id',
      '/api/writing-exercises/:type',
      '/api/punctuation-exercises/:difficulty',
      '/api/register-exercises',
      '/api/challenges',
      '/api/weekly-challenge',
      '/api/opponents',
      '/api/dojo-leaderboard',
      '/api/help-requests',
      '/api/glossary/search',
      '/api/translations/recent'
    ]
  });
});

// Gestione degli errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Errore del server!');
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server Express in esecuzione sulla porta ${port}`);
});