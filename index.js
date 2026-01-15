require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API Maintenance Website',
    endpoints: {
      users: '/api/users',
      maintenance: '/api/maintenance',
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

// ========== ROUTES MAINTENANCE LOGS ==========

// GET tous les logs de maintenance
app.get('/api/maintenance', async (req, res) => {
  try {
    const logs = await db.getAllMaintenanceLogs();
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET un log de maintenance par ID
app.get('/api/maintenance/:id', async (req, res) => {
  try {
    const log = await db.getMaintenanceLogById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Log non trouvé' });
    }
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST créer un log de maintenance
app.post('/api/maintenance', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title requis' });
    }
    const logId = await db.createMaintenanceLog(title, description, status);
    res.status(201).json({ success: true, data: { id: logId, title, description, status } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT modifier un log de maintenance
app.put('/api/maintenance/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title requis' });
    }
    const affected = await db.updateMaintenanceLog(req.params.id, title, description, status);
    if (affected === 0) {
      return res.status(404).json({ success: false, error: 'Log non trouvé' });
    }
    res.json({ success: true, data: { id: req.params.id, title, description, status } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE supprimer un log de maintenance
app.delete('/api/maintenance/:id', async (req, res) => {
  try {
    const affected = await db.deleteMaintenanceLog(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ success: false, error: 'Log non trouvé' });
    }
    res.json({ success: true, message: 'Log supprimé' });
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
