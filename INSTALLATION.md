# TypeFlow - Direct Installation Guide

## For the Impatient: 3 Copy-Paste Setup

### 1. Database Setup (Copy-Paste into phpMyAdmin)

**URL**: http://localhost/phpmyadmin/index.php?route=/sql

**SQL Code** (copy everything below and paste):

```sql
CREATE DATABASE IF NOT EXISTS typeflow_db;
USE typeflow_db;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  wpm DECIMAL(5, 2) NOT NULL,
  accuracy DECIMAL(5, 2) NOT NULL,
  mistakes INT NOT NULL,
  typed_text LONGTEXT NOT NULL,
  duration INT NOT NULL,
  improved TINYINT(1) DEFAULT 0,
  test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_test_date (test_date),
  INDEX idx_improved (improved)
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_results_user_date ON test_results(user_id, test_date DESC);

INSERT INTO users (name, email, password) VALUES 
  ('Demo User', 'demo@typeflow.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye');

INSERT INTO test_results (user_id, wpm, accuracy, mistakes, typed_text, duration, improved, created_at) VALUES 
  (1, 65.5, 95.2, 3, 'The quick brown fox jumps over the lazy dog. This is a test of typing speed and accuracy.', 30, 0, DATE_SUB(NOW(), INTERVAL 7 DAY)),
  (1, 72.3, 96.1, 2, 'Typing practice helps improve your skills and muscle memory over time with consistent practice sessions.', 30, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
  (1, 71.8, 95.8, 2, 'Regular typing tests can help you track progress and identify areas for improvement in your technique.', 30, 0, DATE_SUB(NOW(), INTERVAL 3 DAY)),
  (1, 78.2, 97.4, 1, 'Fast and accurate typing is essential for productive work in today digital world where speed matters.', 30, 1, DATE_SUB(NOW(), INTERVAL 1 DAY));
```

Then click "Go" button ✓

### 2. Backend Setup

**PowerShell Terminal 1:**

```powershell
cd d:\Collage\Type-Flow\server
npm install
npm start
```

Wait for message: "✓ Database initialization completed successfully"

### 3. Frontend Setup

**PowerShell Terminal 2:**

```powershell
cd d:\Collage\Type-Flow
npm install
npm run dev
```

Open http://localhost:5173 in your browser ✓

## Test the App

**Demo Login:**
- Email: `demo@typeflow.com`
- Password: `demo123`

**Or Create New Account:**
- Click "Get Started"
- Fill in name, email, password
- Click "Sign Up"

## Verify Everything Works

1. **Login to dashboard**
   - You should see "Your Dashboard" with stats
   - Should see 4 test records in the table (or your new test if you just created account)

2. **Take a typing test**
   - Click "Start Practicing"
   - Type the text shown
   - See your results with improvement badge

3. **Check phpMyAdmin**
   - Open http://localhost/phpmyadmin
   - Click "typeflow_db"
   - Click "test_results" table
   - Verify your new test appears in the table

## That's It!

Your TypeFlow application is now running. Enjoy practicing your typing!

### Quick Commands Reference

| Task | Command |
|------|---------|
| Start backend | `cd server && npm start` |
| Start frontend | `npm run dev` |
| Stop backend | Press Ctrl+C in terminal |
| Stop frontend | Press Ctrl+C in terminal |
| Reset database | Drop typeflow_db in phpMyAdmin, re-paste SQL |
| View logs | Check the terminal running the server |

### Common Port Issues

If port 5000 or 5173 is already in use:

**For port 5000 (backend):**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number you find)
taskkill /PID <PID> /F
```

**For port 5173 (frontend):**
The app will automatically use the next available port.

---

Need more detailed info? Check `README_SETUP.md`
