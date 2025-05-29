const express = require('express');
const router = express.Router();

// GET /api/text/list - Ottieni la lista dei testi disponibili
router.get('/list', (req, res) => {
  const db = req.app.locals.db.getData();
  const { level } = req.query;
  
  let texts = db.texts || [];
  
  // Filtra per livello se specificato
  if (level) {
    texts = texts.filter(text => text.level === level);
  }
  
  // Restituisci solo i metadati, non il contenuto completo
  const textsList = texts.map(({ id, title, level, type, summary }) => ({
    id, title, level, type, summary
  }));
  
  res.json(textsList);
});

// GET /api/text/:id - Ottieni un testo specifico
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = req.app.locals.db.getData();
  
  const text = (db.texts || []).find(t => t.id.toString() === id);
  
  if (!text) {
    return res.status(404).json({ error: 'Testo non trovato' });
  }
  
  res.json(text);
});

// POST /api/text - Aggiungi un nuovo testo
router.post('/', (req, res) => {
  const { title, content, level, type, summary } = req.body;
  
  if (!title || !content || !level) {
    return res.status(400).json({ error: 'Titolo, contenuto e livello sono richiesti' });
  }
  
  const db = req.app.locals.db.getData();
  
  // Crea il nuovo testo
  const newText = {
    id: Date.now(),
    title,
    content,
    level,
    type: type || 'reading',
    summary: summary || '',
    createdAt: new Date().toISOString(),
  };
  
  // Aggiungi al database
  if (!db.texts) {
    db.texts = [];
  }
  
  db.texts.push(newText);
  
  // Salva nel database
  req.app.locals.db.saveData(db);
  
  res.status(201).json(newText);
});

module.exports = router;