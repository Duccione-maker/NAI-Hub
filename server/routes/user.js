const express = require('express');
const router = express.Router();

// GET /api/user/profile - Ottieni il profilo utente
router.get('/profile', (req, res) => {
  const db = req.app.locals.db.getData();
  
  // Simuliamo un utente di default per questo esempio
  // In una vera app, dovresti usare autenticazione
  const user = db.users[0] || {
    id: 1,
    name: 'Studente',
    level: 'A1',
    progress: 0,
    lastLogin: new Date().toISOString()
  };
  
  res.json(user);
});

// PUT /api/user/profile - Aggiorna il profilo utente
router.put('/profile', (req, res) => {
  const { level, progress } = req.body;
  
  if (!level) {
    return res.status(400).json({ error: 'Il livello è richiesto' });
  }
  
  const db = req.app.locals.db.getData();
  
  // Aggiorna l'utente (o crea se non esiste)
  let user = db.users[0];
  
  if (!user) {
    user = {
      id: 1,
      name: 'Studente',
      lastLogin: new Date().toISOString()
    };
    db.users = [user];
  }
  
  // Aggiorna i campi
  user.level = level;
  if (progress !== undefined) {
    user.progress = progress;
  }
  user.lastUpdate = new Date().toISOString();
  
  // Salva nel database
  req.app.locals.db.saveData(db);
  
  res.json(user);
});

// GET /api/user/progress - Ottieni il progresso dell'utente
router.get('/progress', (req, res) => {
  const db = req.app.locals.db.getData();
  
  // In un'app reale, dovresti filtrare per l'utente corrente
  const progress = db.progress || [];
  
  res.json(progress);
});

// POST /api/user/progress - Registra un nuovo progresso
router.post('/progress', (req, res) => {
  const { activity, score, timestamp } = req.body;
  
  if (!activity || score === undefined) {
    return res.status(400).json({ error: 'Attività e punteggio sono richiesti' });
  }
  
  const db = req.app.locals.db.getData();
  
  // Crea l'oggetto progresso
  const progressEntry = {
    id: Date.now(),
    userId: 1, // In un'app reale, usa l'ID dell'utente autenticato
    activity,
    score,
    timestamp: timestamp || new Date().toISOString()
  };
  
  // Aggiungi al database
  if (!db.progress) {
    db.progress = [];
  }
  
  db.progress.push(progressEntry);
  
  // Salva nel database
  req.app.locals.db.saveData(db);
  
  res.status(201).json(progressEntry);
});

module.exports = router;