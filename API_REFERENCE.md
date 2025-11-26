# TypeFlow Database Schema & API Reference

## Complete SQL Database Setup

```sql
-- ============================================
-- TypeFlow Database Schema
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS typeflow_db;
USE typeflow_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  wpm DECIMAL(5, 2) NOT NULL,
  accuracy DECIMAL(5, 2) NOT NULL,
  mistakes INT NOT NULL,
  typed_text LONGTEXT NOT NULL,
  duration INT NOT NULL,
  test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_test_date (test_date)
);

-- Indexes for performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_results_user_date ON test_results(user_id, test_date DESC);
```

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. POST `/auth/signup`
**Register a new user**

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Validation Rules:**
- `name`: Required, string
- `email`: Required, valid email, must be unique
- `password`: Required, minimum 6 characters
- `confirmPassword`: Must match password

**Success Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
```json
// Missing fields
{ "error": "All fields are required" }

// Passwords don't match
{ "error": "Passwords do not match" }

// Password too short
{ "error": "Password must be at least 6 characters" }

// Email already registered
{ "error": "Email already registered" }
```

---

### 2. POST `/auth/login`
**Authenticate user and get JWT token**

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
```json
// Missing credentials
{ "error": "Email and password are required" }

// Invalid credentials
{ "error": "Invalid email or password" }
```

**Token Usage:**
```
Authorization: Bearer {token}
```
Token valid for 7 days. Store in localStorage on client.

---

## Test Results Endpoints

### 3. POST `/tests/save`
**Save a typing test result**

**Authentication:** Required (Bearer token in Authorization header)

**Request:**
```json
{
  "wpm": 65.5,
  "accuracy": 98.2,
  "mistakes": 2,
  "typedText": "The quick brown fox jumps over the lazy dog...",
  "duration": 45
}
```

**Parameters:**
- `wpm`: float - Words Per Minute (required)
- `accuracy`: float - Accuracy percentage (required)
- `mistakes`: integer - Number of mistakes (required)
- `typedText`: string - Full typed text (required)
- `duration`: integer - Test duration in seconds (required)

**Success Response (201):**
```json
{
  "message": "Test result saved successfully",
  "testId": 5,
  "comparison": {
    "previousWpm": 62.0,
    "previousAccuracy": 95.5,
    "wpmImproved": true,
    "accuracyImproved": true,
    "wpmDifference": "3.50",
    "accuracyDifference": "2.70"
  }
}
```

**Response if first test (no previous):**
```json
{
  "message": "Test result saved successfully",
  "testId": 1,
  "comparison": null
}
```

**Error Responses:**
```json
// Missing auth token
{ "error": "Access token required" }

// Invalid token
{ "error": "Invalid or expired token" }

// Missing fields
{ "error": "All fields are required" }
```

---

### 4. GET `/tests/history`
**Retrieve all test results for logged-in user (newest first)**

**Authentication:** Required (Bearer token in Authorization header)

**Query Parameters:** None

**Success Response (200):**
```json
{
  "message": "Test history retrieved successfully",
  "results": [
    {
      "id": 5,
      "wpm": 65.50,
      "accuracy": 98.20,
      "mistakes": 2,
      "typed_text": "The quick brown fox...",
      "duration": 45,
      "test_date": "2025-01-15T10:30:45.000Z"
    },
    {
      "id": 4,
      "wpm": 62.00,
      "accuracy": 95.50,
      "mistakes": 3,
      "typed_text": "The quick brown fox...",
      "duration": 47,
      "test_date": "2025-01-14T15:22:30.000Z"
    }
  ],
  "totalTests": 2
}
```

**Error Responses:**
```json
// Not authenticated
{ "error": "Access token required" }

{ "error": "Invalid or expired token" }
```

---

### 5. GET `/tests/stats`
**Retrieve statistics for logged-in user**

**Authentication:** Required (Bearer token in Authorization header)

**Query Parameters:** None

**Success Response (200):**
```json
{
  "message": "Statistics retrieved successfully",
  "stats": {
    "totalTests": 5,
    "avgWpm": 62.4,
    "maxWpm": 75,
    "avgAccuracy": 96.2,
    "maxAccuracy": 99
  }
}
```

**Response Fields:**
- `totalTests`: integer - Total number of tests taken
- `avgWpm`: float - Average WPM across all tests
- `maxWpm`: float - Best WPM achieved
- `avgAccuracy`: float - Average accuracy percentage
- `maxAccuracy`: float - Best accuracy percentage

**Error Responses:**
```json
// Not authenticated
{ "error": "Access token required" }

{ "error": "Invalid or expired token" }
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes
- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **400**: Bad Request - Invalid request data
- **401**: Unauthorized - Missing or invalid authentication
- **403**: Forbidden - Valid token but access denied
- **409**: Conflict - Resource already exists (email taken)
- **500**: Server Error - Internal server error

---

## Authentication & Security

### JWT Token Structure
```
Header.Payload.Signature
```

**Payload contains:**
```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "iat": 1705311045,
  "exp": 1705916845
}
```

### Token Expiration
- Default: 7 days
- Automatically included in payload

### Password Security
- Algorithm: bcrypt
- Rounds: 10
- Never store plaintext passwords

---

## Database Queries Reference

### Find User by Email
```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

### Get All Tests for User (Newest First)
```sql
SELECT * FROM test_results 
WHERE user_id = 1 
ORDER BY test_date DESC;
```

### Get User Statistics
```sql
SELECT 
  COUNT(*) as totalTests,
  AVG(wpm) as avgWpm,
  MAX(wpm) as maxWpm,
  AVG(accuracy) as avgAccuracy,
  MAX(accuracy) as maxAccuracy
FROM test_results 
WHERE user_id = 1;
```

### Get Previous Test (for comparison)
```sql
SELECT wpm, accuracy FROM test_results 
WHERE user_id = 1 AND id != 5 
ORDER BY test_date DESC 
LIMIT 1;
```

### Delete User (cascades to tests)
```sql
DELETE FROM users WHERE id = 1;
```

---

## Environment Variables

**.env file structure:**
```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=typeflow_db

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**Important:**
- Change `JWT_SECRET` in production!
- Set `DB_PASSWORD` if your MySQL has a password
- `DB_HOST` should be `localhost` for local XAMPP

---

## Example Workflows

### Complete Signup & Test Cycle

**1. User Signup**
```bash
POST /api/auth/signup
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secure123",
  "confirmPassword": "secure123"
}
# Response: User registered
```

**2. User Login**
```bash
POST /api/auth/login
{
  "email": "alice@example.com",
  "password": "secure123"
}
# Response: token + user data
```

**3. Save Test Result**
```bash
POST /api/tests/save
Headers: Authorization: Bearer {token}
{
  "wpm": 55,
  "accuracy": 92,
  "mistakes": 3,
  "typedText": "...",
  "duration": 60
}
# Response: testId + comparison (null - first test)
```

**4. Take Second Test**
```bash
POST /api/tests/save
Headers: Authorization: Bearer {token}
{
  "wpm": 58,
  "accuracy": 94,
  "mistakes": 2,
  "typedText": "...",
  "duration": 58
}
# Response: testId + comparison (shows improvement!)
```

**5. View History**
```bash
GET /api/tests/history
Headers: Authorization: Bearer {token}
# Response: Array of all tests, stats, trends
```

---

## Performance Optimization

### Indexes Created
```sql
-- Email lookup (login)
CREATE INDEX idx_user_email ON users(email);

-- Test history retrieval
CREATE INDEX idx_results_user_date ON test_results(user_id, test_date DESC);

-- Individual test lookup
CREATE INDEX idx_user_id ON test_results(user_id);
CREATE INDEX idx_test_date ON test_results(test_date);
```

### Query Performance
- User login: O(1) - indexed email lookup
- Get history: O(n log n) - pre-sorted by index
- Stats calculation: O(n) - full table scan on user's tests only

---

## Testing the API

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save Test Result:**
```bash
curl -X POST http://localhost:5000/api/tests/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "wpm": 65,
    "accuracy": 98,
    "mistakes": 2,
    "typedText": "test text",
    "duration": 45
  }'
```

**Get History:**
```bash
curl -X GET http://localhost:5000/api/tests/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get Stats:**
```bash
curl -X GET http://localhost:5000/api/tests/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Deployment Checklist

- [ ] Change JWT_SECRET to a strong value
- [ ] Set DB_PASSWORD if using authenticated MySQL
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Enable error logging
- [ ] Add rate limiting
- [ ] Update frontend API base URL
- [ ] Test all endpoints in production
- [ ] Monitor performance

---

## Support

For detailed setup instructions, see `SETUP_GUIDE.md`
For quick start, see `QUICK_START.md`
