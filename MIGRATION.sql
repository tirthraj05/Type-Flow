-- =============================================
-- TypeFlow - Quick Setup SQL for phpMyAdmin
-- =============================================
-- INSTRUCTIONS:
-- 1. Open http://localhost/phpmyadmin/
-- 2. Click "SQL" tab at the top
-- 3. Paste this ENTIRE file into the SQL box
-- 4. Click "Go" to execute
-- =============================================

CREATE DATABASE IF NOT EXISTS typeflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE typeflow_db;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (id, name, email, password) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Demo User', 'demo@typeflow.com', '$2b$10$YQ0ZJmqBWPz7kGGK3Ov4x.pT7hVzXF7PjHhP2YN.F9Kxy3rD5IQF6')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO test_results (id, user_id, wpm, accuracy, mistakes, typed_text, duration_seconds, improved, device_info, created_at) VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 65.5, 95.2, 3, 'The quick brown fox jumps over the lazy dog. This is a test of typing speed and accuracy. Practice makes perfect when you type regularly.', 45, 0, 'Windows 10 - Chrome', DATE_SUB(NOW(), INTERVAL 7 DAY)),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 72.3, 96.1, 2, 'Typing practice helps improve your skills and muscle memory over time with consistent practice sessions. Keep practicing daily for best results.', 45, 1, 'Windows 10 - Chrome', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 71.8, 95.8, 2, 'Regular typing tests can help you track progress and identify areas for improvement in your technique. Focus on accuracy first, then speed.', 45, 0, 'Windows 10 - Chrome', DATE_SUB(NOW(), INTERVAL 3 DAY)),
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 78.2, 97.4, 1, 'Fast and accurate typing is essential for productive work in todays digital world where speed matters. Consistent practice leads to mastery.', 45, 1, 'Windows 10 - Chrome', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 82.5, 98.1, 0, 'Professional typists maintain both speed and accuracy through deliberate practice and proper finger placement on the keyboard home row keys.', 45, 1, 'Windows 10 - Chrome', NOW())
ON DUPLICATE KEY UPDATE wpm=wpm;
