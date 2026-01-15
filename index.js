require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static('public'));

// Route racine - redirige vers la page HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route API info
app.get('/api', (req, res) => {
  res.json({
    message: 'API Maintenance Website',
    endpoints: {
      users: '/api/users',
      maintenance: '/api/maintenance',
      login: '/api/login',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', async (req, res) => {
  const dbConnected = await db.testConnection();
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'healthy' : 'unhealthy',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ========== ROUTE LOGIN ==========

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    const user = await db.loginUser(email, password);

    if (user) {
      const { password: pwd, ...userWithoutPassword } = user;
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: userWithoutPassword
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }
  } catch (error) {
    console.error('Erreur login:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ROUTES USERS ==========

// GET tous les utilisateurs
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET un utilisateur par ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST créer un utilisateur
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name et email requis' });
    }
    const userId = await db.createUser(name, email);
    res.status(201).json({ success: true, data: { id: userId, name, email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT modifier un utilisateur
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name et email requis' });
    }
    const affected = await db.updateUser(req.params.id, name, email);
    if (affected === 0) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, data: { id: req.params.id, name, email } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE supprimer un utilisateur
app.delete('/api/users/:id', async (req, res) => {
  try {
    const affected = await db.deleteUser(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ROUTES TASKS ==========

// GET toutes les taches
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await db.getAllTasks();
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET une tache par ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await db.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Tache non trouvee' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST creer une tache
app.post('/api/tasks', async (req, res) => {
  try {
    const { user_id, title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title requis' });
    }
    const taskId = await db.createTask(user_id, title, description, status);
    res.status(201).json({ success: true, data: { id: taskId, user_id, title, description, status } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT modifier une tache
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title requis' });
    }
    const affected = await db.updateTask(req.params.id, title, description, status);
    if (affected === 0) {
      return res.status(404).json({ success: false, error: 'Tache non trouvee' });
    }
    res.json({ success: true, data: { id: req.params.id, title, description, status } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE supprimer une tache
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const affected = await db.deleteTask(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ success: false, error: 'Tache non trouvee' });
    }
    res.json({ success: true, message: 'Tache supprimee' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  db.testConnection();
});
