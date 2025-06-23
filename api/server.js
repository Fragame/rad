const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // URL del tuo Docusaurus
  credentials: true
}));

// Database simulato per utenti (in produzione usa un vero database)
// Per generare un nuovo hash: node generate-hash.js
const users = [
  {
    id: 1,
    username: 'admin',
    passwordPlain: 'password123', // SOLO PER DEV - rimuovi in produzione!
    password: '', // Verrà generato al primo avvio
    role: 'editor'
  }
];

// Genera hash al primo avvio se mancante
(async () => {
  for (let user of users) {
    if (!user.password && user.passwordPlain) {
      user.password = await bcrypt.hash(user.passwordPlain, 10);
      console.log(`Hash generato per utente ${user.username}`);
    }
  }
})();

// Middleware di autenticazione
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route di login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Route per ottenere il contenuto di un capitolo
app.get('/api/chapters/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'docs', filename);
    
    const content = await fs.readFile(filePath, 'utf8');
    res.json({ content, filename });
  } catch (error) {
    res.status(404).json({ error: 'Capitolo non trovato' });
  }
});

// Route per salvare un capitolo
app.post('/api/chapters/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Contenuto mancante' });
    }

    const filePath = path.join(__dirname, '..', 'docs', filename);
    
    // Backup del file originale
    const backupPath = path.join(__dirname, '..', 'backups', `${filename}.${Date.now()}.backup`);
    const originalContent = await fs.readFile(filePath, 'utf8');
    
    // Crea la cartella backups se non esiste
    await fs.mkdir(path.join(__dirname, '..', 'backups'), { recursive: true });
    await fs.writeFile(backupPath, originalContent);
    
    // Salva il nuovo contenuto
    await fs.writeFile(filePath, content, 'utf8');
    
    res.json({ 
      message: 'Capitolo salvato con successo',
      backup: backupPath 
    });
  } catch (error) {
    console.error('Errore salvataggio:', error);
    res.status(500).json({ error: 'Errore durante il salvataggio' });
  }
});

// Route per ottenere la lista dei capitoli
app.get('/api/chapters', authenticateToken, async (req, res) => {
  try {
    const docsPath = path.join(__dirname, '..', 'docs');
    const files = await fs.readdir(docsPath);
    
    const chapters = files
      .filter(file => file.endsWith('.md'))
      .map(file => ({
        filename: file,
        title: file.replace('.md', '').replace(/-/g, ' ')
      }));
    
    res.json({ chapters });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei capitoli' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API Server in esecuzione su http://localhost:${PORT}`);
  console.log('Credenziali di default: admin / password123');
});