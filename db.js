require('dotenv').config();
const mysql = require('mysql2/promise');

// Configuration du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_password',
  database: process.env.DB_NAME || 'maintenance_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fonction pour tester la connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL établie avec succès');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    return false;
  }
}

// Fonctions CRUD pour les utilisateurs
async function getAllUsers() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}

async function getUserById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function createUser(name, email) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  return result.insertId;
}

async function updateUser(id, name, email) {
  const [result] = await pool.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id]
  );
  return result.affectedRows;
}

async function deleteUser(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows;
}

// Fonctions pour les logs de maintenance
async function getAllMaintenanceLogs() {
  const [rows] = await pool.query('SELECT * FROM maintenance_logs ORDER BY created_at DESC');
  return rows;
}

async function getMaintenanceLogById(id) {
  const [rows] = await pool.query('SELECT * FROM maintenance_logs WHERE id = ?', [id]);
  return rows[0];
}

async function createMaintenanceLog(title, description, status = 'pending') {
  const [result] = await pool.query(
    'INSERT INTO maintenance_logs (title, description, status) VALUES (?, ?, ?)',
    [title, description, status]
  );
  return result.insertId;
}

async function updateMaintenanceLog(id, title, description, status) {
  const [result] = await pool.query(
    'UPDATE maintenance_logs SET title = ?, description = ?, status = ? WHERE id = ?',
    [title, description, status, id]
  );
  return result.affectedRows;
}

async function deleteMaintenanceLog(id) {
  const [result] = await pool.query('DELETE FROM maintenance_logs WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = {
  pool,
  testConnection,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog
};
