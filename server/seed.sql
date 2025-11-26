-- =============================================
-- TypeFlow Demo Data Seed Script
-- =============================================
-- Run this AFTER creating tables via MIGRATION.sql
-- =============================================

USE typeflow_db;

-- Insert demo user if not exists
-- Email: demo@typeflow.com
-- Password: demo123 (bcrypt hash)
INSERT INTO users (id, name, email, password, created_at) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Demo User', 'demo@typeflow.com', '$2b$10$YQ0ZJmqBWPz7kGGK3Ov4x.pT7hVzXF7PjHhP2YN.F9Kxy3rD5IQF6', NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Sample test results showing progression (newest to oldest)
DELETE FROM test_results WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

INSERT INTO test_results (id, user_id, wpm, accuracy, mistakes, typed_text, duration_seconds, improved, device_info, created_at) VALUES 
  -- Test 5: Latest (best performance)
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 82.5, 98.1, 0, 
   'Professional typists maintain both speed and accuracy through deliberate practice and proper finger placement on the keyboard home row keys. Consistency and focus are the keys to mastery.',
   45, 1, 'Windows 10 - Chrome', NOW()),
  
  -- Test 4: Day ago (improvement)
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 78.2, 97.4, 1, 
   'Fast and accurate typing is essential for productive work in todays digital world where speed matters. Consistent practice leads to mastery of the keyboard.',
   45, 1, 'Windows 10 - Chrome', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  
  -- Test 3: 3 days ago (no improvement)
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 71.8, 95.8, 2, 
   'Regular typing tests can help you track progress and identify areas for improvement in your technique. Focus on accuracy first, then speed will naturally follow.',
   45, 0, 'Windows 10 - Chrome', DATE_SUB(NOW(), INTERVAL 3 DAY)),
  
  -- Test 2: 5 days ago (improvement)
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 72.3, 96.1, 2, 
   'Typing practice helps improve your skills and muscle memory over time with consistent practice sessions. Keep practicing daily for best results and improvement.',
   45, 1, 'Windows 10 - Chrome', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  
  -- Test 1: 7 days ago (first test)
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 65.5, 95.2, 3, 
   'The quick brown fox jumps over the lazy dog. This is a test of typing speed and accuracy. Practice makes perfect when you type regularly and focus on technique.',
   45, 0, 'Windows 10 - Chrome', DATE_SUB(NOW(), INTERVAL 7 DAY));

-- Verify seed data
SELECT 'Users created:' as status, COUNT(*) as count FROM users;
SELECT 'Test results created:' as status, COUNT(*) as count FROM test_results;
SELECT 'Demo user tests:' as status, COUNT(*) as count FROM test_results WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- Display sample data
SELECT 
  DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as test_date,
  wpm,
  accuracy,
  mistakes,
  improved,
  SUBSTRING(typed_text, 1, 50) as text_preview
FROM test_results 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY created_at DESC;
