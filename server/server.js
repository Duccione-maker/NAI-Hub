const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Importa le routes
const userRoutes = require('./routes/user');
const textRoutes = require('./routes/text');
const aiRoutes = require('./routes/ai');

// Usa le routes
app.use('/api/user', userRoutes);
app.use('/api/text', textRoutes);
app.use('/api/ai', aiRoutes);

// Lettura del database JSON
const getDbData = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Errore nella lettura del database:', error);
    return { users: [], texts: [], progress: [] };
  }
};

// Scrittura nel database JSON
const saveDbData = (data) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'db.json'),
      JSON.stringify(data, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    console.error('Errore nella scrittura del database:', error);
    return false;
  }
};

// Condividi le funzioni del DB con le routes
app.locals.db = {
  getData: getDbData,
  saveData: saveDbData,
};

// In production, serve il React app per le route non API
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});