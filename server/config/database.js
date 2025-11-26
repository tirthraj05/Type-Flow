require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'typeflow_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Auto-initialize database and tables
async function initializeDatabase() {
  let tempConnection;
  try {
    console.log('Starting database initialization...');
    
    // First, create a connection WITHOUT specifying a database
    tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    console.log('Connected to MySQL');
    
    // Create database
    await tempConnection.execute('CREATE DATABASE IF NOT EXISTS typeflow_db');
    console.log('✓ Database created or already exists');
    
    // Switch to database
    await tempConnection.execute('USE typeflow_db');
    
    // Create users table
    await tempConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Users table created or already exists');
    
    // Create test_results table
    await tempConnection.execute(`
      CREATE TABLE IF NOT EXISTS test_results (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        wpm DECIMAL(6, 2) NOT NULL CHECK (wpm >= 0 AND wpm <= 300),
        accuracy DECIMAL(5, 2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
        mistakes INT NOT NULL CHECK (mistakes >= 0),
        typed_text LONGTEXT NOT NULL,
        duration_seconds INT NOT NULL CHECK (duration_seconds >= 1),
        improved TINYINT(1) DEFAULT 0,
        device_info VARCHAR(255) DEFAULT NULL,
        test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_test_date (test_date),
        INDEX idx_improved (improved),
        INDEX idx_results_user_date (user_id, test_date DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Test results table created or already exists');
    console.log('✓ Database initialization completed successfully');
    
    await tempConnection.end();
  } catch (error) {
    const errorMsg = error ? (error.message || JSON.stringify(error)) : 'Unknown error';
    console.error('❌ Database initialization error:', errorMsg);
    console.error('Stack:', error ? error.stack : 'N/A');
    if (tempConnection) {
      try { await tempConnection.end(); } catch (e) { /* ignore */ }
    }
  }
}

// Initialize on module load
initializeDatabase();

module.exports = pool;
