# TypeFlow - Complete Setup Guide

## Project Overview
TypeFlow is a typing practice application with full authentication and test result tracking using MySQL, Express.js backend, and React frontend.

## System Requirements
- Node.js (v14 or higher)
- XAMPP (for MySQL)
- npm or yarn

---

## Step 1: Database Setup (XAMPP)

### 1.1 Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services

### 1.2 Create Database
1. Open phpMyAdmin: http://localhost/phpmyadmin/
2. Copy the entire contents of `server/schema.sql`
3. Paste into the **SQL** tab in phpMyAdmin
4. Click **Execute**

This will create:
- `typeflow_db` database
- `users` table (id, name, email, password, timestamps)
- `test_results` table (id, user_id, wpm, accuracy, mistakes, typed_text, duration, test_date)

### 1.3 Verify Database Creation
In phpMyAdmin, you should see:
- Database: `typeflow_db`
  - Table: `users`
  - Table: `test_results`

---

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd server
npm install
```

### 2.2 Configure Environment
The `.env` file is already created with default values:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=typeflow_db
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**Important Notes:**
- If your MySQL has a password, update `DB_PASSWORD`
- Change `JWT_SECRET` in production!

### 2.3 Start Backend Server
```bash
npm start
```

You should see:
```
Server is running on http://localhost:5000
```

**Available Endpoints:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/tests/save` - Save test result
- `GET /api/tests/history` - Get all test results
- `GET /api/tests/stats` - Get user statistics

---

## Step 3: Frontend Setup

### 3.1 Install Frontend Dependencies
```bash
cd ..
npm install
```

### 3.2 Start Development Server
```bash
npm run dev
```

The frontend will start at `http://localhost:5173` (or another port if 5173 is in use)

---

## Step 4: Complete System Startup

### Quick Start Script
```bash
# Terminal 1: Start Backend
cd server
npm start

# Terminal 2: Start Frontend
npm run dev
```

### Verification
1. Backend: http://localhost:5000/api/health ✓ (should show status)
2. Frontend: http://localhost:5173 ✓ (should load TypeFlow app)

---

## Features & Usage

### Authentication
1. **Sign Up**
   - Navigate to `/signup`
   - Enter: Name, Email, Password, Confirm Password
   - Passwords must be at least 6 characters
   - Auto-login after successful signup

2. **Login**
   - Navigate to `/login`
   - Enter: Email and Password
   - JWT token stored in localStorage

3. **Logout**
   - Click "Logout" button in header
   - Clears token and user data

### Typing Test
1. Click "Practice" or "Start" button
2. Click on the paragraph and start typing
3. Test ends automatically when you finish the paragraph
4. Results are saved to database (if logged in)
5. Compare with previous test (if available)

### Test Results Dashboard
1. Navigate to "History" (only visible when logged in)
2. View:
   - **Statistics Overview**: Total tests, average WPM, best WPM, accuracy stats
   - **Test Results Table**: All tests sorted by newest first
   - **Performance Trends**: Arrows (↑↓) show if performance improved/declined
   - **Color Indicators**: Green (↑) for improvements, Red (↓) for declines

### Performance Comparison
After each test, you'll see:
- **Green messages** (improvement): "🎉 Great job! Your WPM improved by X!"
- **Yellow messages** (decline): "Keep practicing! You'll get back to X WPM soon."
- **Previous stats** shown for reference

---

## Database Schema Details

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL (bcrypt hashed),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Test Results Table
```sql
CREATE TABLE test_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  wpm DECIMAL(5, 2) NOT NULL,
  accuracy DECIMAL(5, 2) NOT NULL,
  mistakes INT NOT NULL,
  typed_text LONGTEXT NOT NULL,
  duration INT NOT NULL (seconds),
  test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Security Features

✓ **Bcrypt Password Hashing**: Passwords encrypted with salt rounds
✓ **JWT Authentication**: Secure token-based authentication
✓ **Token Expiration**: Tokens expire after 7 days
✓ **Protected Routes**: Test results require valid authentication
✓ **CORS Enabled**: Frontend-backend communication secured
✓ **SQL Injection Protection**: Using parameterized queries

---

## API Endpoints Reference

### Authentication

#### POST `/api/auth/signup`
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
**Response:** `{ "message": "User registered successfully" }`

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Tests

#### POST `/api/tests/save`
**Headers:** `Authorization: Bearer {token}`
**Request:**
```json
{
  "wpm": 65,
  "accuracy": 98,
  "mistakes": 2,
  "typedText": "The full typed paragraph...",
  "duration": 45
}
```
**Response:**
```json
{
  "message": "Test result saved successfully",
  "testId": 5,
  "comparison": {
    "previousWpm": 62,
    "previousAccuracy": 95,
    "wpmImproved": true,
    "accuracyImproved": true,
    "wpmDifference": "3.00",
    "accuracyDifference": "3.00"
  }
}
```

#### GET `/api/tests/history`
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "message": "Test history retrieved successfully",
  "results": [
    {
      "id": 5,
      "wpm": 65,
      "accuracy": 98,
      "mistakes": 2,
      "typed_text": "...",
      "duration": 45,
      "test_date": "2025-01-15T10:30:00.000Z"
    }
  ],
  "totalTests": 1
}
```

#### GET `/api/tests/stats`
**Headers:** `Authorization: Bearer {token}`
**Response:**
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

---

## Troubleshooting

### "Cannot connect to database"
- ✓ Ensure MySQL is running in XAMPP
- ✓ Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
- ✓ Verify database exists in phpMyAdmin

### "Token is invalid"
- ✓ Check token hasn't expired (7 day validity)
- ✓ Clear localStorage and login again
- ✓ Verify JWT_SECRET in `.env`

### CORS errors
- ✓ Backend CORS is already configured
- ✓ Ensure backend is running on port 5000
- ✓ Ensure frontend is running on port 5173

### "Email already registered"
- ✓ Use a different email for new signup
- ✓ Or login with existing credentials

---

## Production Considerations

1. **Change JWT_SECRET**: Update to a strong random value
2. **Database Backups**: Regular backups of MySQL database
3. **HTTPS**: Use HTTPS in production
4. **Environment Variables**: Use proper `.env` management
5. **Rate Limiting**: Add rate limiting to API endpoints
6. **Input Validation**: Additional validation on server
7. **CORS Configuration**: Whitelist specific domains
8. **Error Logging**: Implement proper logging system

---

## File Structure
```
Type-Flow/
├── server/
│   ├── server.js                 # Express app entry point
│   ├── package.json              # Backend dependencies
│   ├── .env                       # Environment configuration
│   ├── schema.sql                # Database schema
│   ├── config/
│   │   └── database.js           # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   └── routes/
│       ├── auth.js               # Signup/Login routes
│       └── tests.js              # Test results routes
│
├── src/
│   ├── App.jsx                   # Main app component
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── pages/
│   │   ├── Home.jsx              # Home page
│   │   ├── Login.jsx             # Login page
│   │   ├── Signup.jsx            # Signup page
│   │   ├── TypingTest.jsx        # Typing test page
│   │   ├── Results.jsx           # Results with comparison
│   │   └── History.jsx           # Test history & stats
│   └── components/
│       ├── Header.jsx            # Navigation header
│       └── Footer.jsx            # Footer
│
└── package.json                  # Frontend dependencies
```

---

## Support & Contact
For issues or questions, check the documentation or create an issue in the repository.

Happy typing! 🎉
