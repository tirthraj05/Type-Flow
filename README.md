# TypeFlow - Full-Stack Typing Practice Application

**A complete typing practice platform inspired by TypingBolt** — featuring real-time feedback, progress tracking, and intelligent improvement detection.

## 🚀 Features

### Core Functionality
- **Real-time Typing Test** with live WPM, accuracy, mistakes tracking, and progress bar
- **User Authentication** (Signup/Login) with bcrypt password hashing and JWT tokens
- **Test History Dashboard** with pagination, sorting (newest → oldest), and improvement indicators
- **Smart Progress Tracking** — compares each test with your previous test and highlights improvements
- **Encouragement Messages** — context-aware feedback based on your performance
- **CSV Export** — download your complete typing history
- **Detailed Test Views** — see full typed text, device info, and timestamps
- **Accessible Design** — keyboard navigation, semantic HTML, ARIA attributes

### Technical Stack
- **Frontend**: React 18 + Vite + React Router + TailwindCSS
- **Backend**: Node.js + Express + MySQL (XAMPP)
- **Security**: bcrypt password hashing, JWT authentication, rate limiting, SQL injection prevention
- **Database**: MySQL with UUID primary keys, foreign keys, indexes

---

## 📋 Prerequisites

Before you begin, ensure you have:

1. **XAMPP** (with MySQL/MariaDB running)
   - Download from: https://www.apachefriends.org/
   - Start Apache and MySQL from XAMPP Control Panel

2. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

3. **phpMyAdmin** (included with XAMPP)
   - Access at: http://localhost/phpmyadmin/

---

## 🛠️ Installation & Setup

### Step 1: Clone & Install Dependencies

```powershell
# Clone or navigate to project folder
cd d:\Collage\Type-Flow

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Database Setup (CRITICAL)

#### Option A: Import via phpMyAdmin UI (Recommended)

1. **Open phpMyAdmin**: http://localhost/phpmyadmin/
2. Click "**SQL**" tab at the top
3. **Copy the entire content** of `MIGRATION.sql` file
4. **Paste** into the SQL query box
5. Click "**Go**" to execute

✅ **Success indicators:**
- You should see: "✓ Database created or already exists"
- You should see 2 tables created: `users` and `test_results`
- You should see 5 test records inserted

#### Option B: Import SQL File Directly

1. Open phpMyAdmin: http://localhost/phpmyadmin/
2. Click "**Import**" tab
3. Click "**Choose File**" and select `MIGRATION.sql`
4. Click "**Go**" at the bottom

#### Verify Database Creation

1. In phpMyAdmin left sidebar, click on `typeflow_db`
2. You should see 2 tables: `users` and `test_results`
3. Click on `test_results` → Browse tab
4. You should see 5 sample test records for the demo user

**Demo User Credentials:**
- Email: `demo@typeflow.com`
- Password: `demo123`

### Step 3: Configure Backend Environment

```powershell
# In the server folder
cd server

# Copy the example environment file
copy .env.example .env

# (Optional) Edit .env if your MySQL password is different
```

**Default `.env` values work with XAMPP out of the box:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Empty for default XAMPP
DB_NAME=typeflow_db
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production_use_random_string_here
```

### Step 4: Start the Application

**Terminal 1 - Backend Server:**
```powershell
cd server
node server.js
# Or use nodemon for auto-reload:
npm run dev
```

✅ **You should see:**
```
Starting database initialization...
Connected to MySQL
✓ Database created or already exists
✓ Users table created or already exists
✓ Test results table created or already exists
✓ Database initialization completed successfully
Server is running on http://localhost:5000
```

**Terminal 2 - Frontend Dev Server:**
```powershell
# From project root
npm run dev
```

✅ **You should see:**
```
VITE ready in X ms

➜  Local:   http://localhost:5173/
```

### Step 5: Verify Installation

1. **Open Browser**: Navigate to http://localhost:5173/
2. **Test Demo Login**:
   - Click "Login"
   - Email: `demo@typeflow.com`
   - Password: `demo123`
3. **Check Dashboard**: After login, click "View Dashboard" — you should see 5 sample test results
4. **Verify phpMyAdmin**: 
   - Open http://localhost/phpmyadmin/
   - Browse `typeflow_db` → `test_results` table
   - Confirm the records match what you see in the dashboard

---

## 📊 How Improvement/Encouragement Logic Works

### WPM Comparison Rules

TypeFlow intelligently compares each typing test with your previous test to determine if you're improving:

1. **Calculation Method**: After completing a test, the backend queries your most recent previous test from the database.

2. **Improvement Criteria**:
   - **Improved = True** if:
     - Your WPM increased compared to the previous test, OR
     - WPM stayed roughly the same (±2 WPM tolerance) AND accuracy improved
   - **Improved = False** if WPM decreased or stayed flat without accuracy gains

3. **Encouragement Messages**:
   - **WPM Improved**: "Nice! Your WPM improved — great progress!"
   - **WPM Declined significantly** (>5 WPM drop): "Good effort — keep practicing!"
   - **No major change**: "Keep it up! Consistency is key to improvement."

4. **Visual Feedback**:
   - **Green badge** with 🎉 emoji for improvements
   - **Amber/Red badge** with 💪 emoji for non-improvements
   - Detailed comparison showing previous WPM, accuracy, and the differences

5. **Database Storage**: The `improved` flag (boolean) is saved in the `test_results` table, allowing the dashboard to highlight improvement records with a "✓ Improved" badge.

---

## 📚 API Reference

### Authentication Endpoints

#### POST `/api/auth/signup`
**Create a new user account**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully"
}
```

**Validation:**
- All fields required
- Password minimum 6 characters
- Passwords must match
- Email must be valid format
- Email must be unique

---

#### POST `/api/auth/login`
**Authenticate user and receive JWT token**

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Test Endpoints (All require `Authorization: Bearer <token>` header)

#### POST `/api/tests`
**Save a new typing test result**

**Request Body:**
```json
{
  "wpm": 75.5,
  "accuracy": 96.2,
  "mistakes": 3,
  "typed_text": "The quick brown fox...",
  "duration_seconds": 60,
  "device_info": "Windows 10 - Chrome"
}
```

**Response (201 Created):**
```json
{
  "message": "Test result saved successfully",
  "testId": "650e8400-e29b-41d4-a716-446655440006",
  "improved": true,
  "comparison": {
    "previousWpm": 70.2,
    "previousAccuracy": 95.1,
    "wpmImproved": true,
    "accuracyImproved": true,
    "wpmDifference": 5.3,
    "accuracyDifference": 1.1
  },
  "encouragementMessage": "Nice! Your WPM improved — great progress!"
}
```

**Validation:**
- WPM: 0-300
- Accuracy: 0-100
- Mistakes: ≥ 0
- Duration: ≥ 1 second
- typed_text: max 50,000 characters

---

#### GET `/api/tests?page=1&limit=10`
**Get paginated test history**

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10, max: 100)

**Response (200 OK):**
```json
{
  "message": "Test history retrieved successfully",
  "results": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440005",
      "wpm": 82.5,
      "accuracy": 98.1,
      "mistakes": 0,
      "typedText": "Professional typists maintain both speed...",
      "duration": 45,
      "improved": true,
      "deviceInfo": "Windows 10 - Chrome",
      "createdAt": "2025-11-26T10:30:00.000Z",
      "localDate": "Nov 26, 2025, 10:30 AM"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

#### GET `/api/tests/:id`
**Get detailed test result**

**Response (200 OK):**
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440005",
  "wpm": 82.5,
  "accuracy": 98.1,
  "mistakes": 0,
  "typedText": "Professional typists maintain both speed and accuracy through deliberate practice...",
  "duration": 45,
  "improved": true,
  "deviceInfo": "Windows 10 - Chrome",
  "createdAt": "2025-11-26T10:30:00.000Z",
  "localDate": "Tuesday, November 26, 2025 at 10:30:00 AM PST"
}
```

---

#### GET `/api/tests/stats`
**Get user statistics**

**Response (200 OK):**
```json
{
  "message": "Statistics retrieved successfully",
  "stats": {
    "totalTests": 25,
    "avgWpm": 75.2,
    "maxWpm": 92.5,
    "avgAccuracy": 96.8,
    "maxAccuracy": 99.2,
    "improvementCount": 15
  }
}
```

---

#### GET `/api/tests/export/csv`
**Export test history as CSV file**

**Response**: CSV file download with headers:
- Date, Time, WPM, Accuracy, Mistakes, Duration (seconds), Improved, Device, Typed Text

---

## 🛡️ Security Features

1. **Password Security**:
   - Bcrypt hashing with salt rounds = 10
   - Passwords never stored in plaintext
   - Minimum 6 characters enforced

2. **Authentication**:
   - JWT tokens with 7-day expiration
   - Bearer token authentication for protected routes
   - Client-side token storage in localStorage

3. **Rate Limiting**:
   - Auth endpoints: 10 requests per 15 minutes
   - General endpoints: 100 requests per 15 minutes

4. **SQL Injection Prevention**:
   - Parameterized queries (prepared statements)
   - Input sanitization (typed text limited to 50k chars)

5. **Data Validation**:
   - Server-side validation for all inputs
   - Range checks for WPM, accuracy, duration
   - Email format validation

---

## 💻 Development

### Project Structure

```
Type-Flow/
├── server/                 # Backend (Node.js + Express)
│   ├── config/
│   │   └── database.js      # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── tests.js         # Test CRUD + stats
│   ├── .env.example       # Environment template
│   ├── schema.sql         # Full database schema
│   ├── seed.sql           # Demo data
│   ├── server.js          # Express app entry point
│   └── package.json
│
├── src/                   # Frontend (React + Vite)
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── TypingTest.jsx   # Main typing test UI
│   │   ├── Results.jsx      # Test results + encouragement
│   │   └── History.jsx      # Dashboard + test history
│   ├── utils/
│   │   └── generateText.js  # Practice text generator
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── MIGRATION.sql         # Quick setup SQL (paste in phpMyAdmin)
├── README.md             # This file
└── package.json
```

### Building for Production

```powershell
# Build frontend
npm run build

# Preview production build
npm run preview

# Production backend (use process manager like PM2)
cd server
node server.js
```

---

## ❓ Troubleshooting

### Database Connection Failed

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:
1. Verify MySQL is running in XAMPP Control Panel
2. Check MySQL port is 3306 (default)
3. Verify `DB_PASSWORD` in `.env` matches your MySQL root password

---

### Tables Not Created

**Problem**: "Table 'typeflow_db.users' doesn't exist"

**Solution**:
1. Re-run `MIGRATION.sql` in phpMyAdmin SQL tab
2. Check for SQL errors in phpMyAdmin output
3. Manually verify database exists: `SHOW DATABASES;`

---

### JWT Token Errors

**Problem**: "Invalid or expired token"

**Solution**:
1. Logout and login again
2. Clear localStorage in browser DevTools
3. Verify `JWT_SECRET` is set in server `.env`

---

### Cannot Login with Demo User

**Problem**: "Invalid email or password"

**Solution**:
1. Re-run `server/seed.sql` to recreate demo user
2. Verify email is exactly `demo@typeflow.com`
3. Password is exactly `demo123` (case-sensitive)

---

### Port Already in Use

**Problem**: "Error: listen EADDRINUSE: address already in use :::5000"

**Solution**:
1. Change `PORT` in `server/.env` to a different port (e.g., 5001)
2. Kill existing process:
   ```powershell
   # Find process
   netstat -ano | findstr :5000
   # Kill it (replace PID)
   taskkill /PID <PID> /F
   ```

---

## 📦 Files Reference

### SQL Files

- **`MIGRATION.sql`**: Complete database setup (paste into phpMyAdmin)
- **`server/schema.sql`**: Detailed schema with comments
- **`server/seed.sql`**: Demo data (5 test records for demo user)

### Configuration Files

- **`server/.env.example`**: Backend environment template
- **`package.json`**: Frontend dependencies
- **`server/package.json`**: Backend dependencies

---

## 🎓 Testing the Application

### Quick Test Workflow

1. **Signup Flow**:
   - Navigate to http://localhost:5173/
   - Click "Get Started" or "Sign Up"
   - Create account with name, email, password
   - Auto-redirected to home page

2. **Take a Typing Test**:
   - Click "Start Practicing" or navigate to `/test`
   - Start typing when ready
   - Watch live WPM, accuracy, mistakes update in real-time
   - Complete the test (or click Restart to try again)

3. **View Results**:
   - After completing, see immediate encouragement message
   - Compare with previous test (if exists)
   - Click "View Dashboard" to see history

4. **Dashboard Features**:
   - View statistics: Total Tests, Avg WPM, Best WPM, Avg Accuracy, Improvements
   - Browse test history (newest first)
   - Click "View" on any test to see full details
   - Click "Export CSV" to download history

5. **Verify in phpMyAdmin**:
   - Open http://localhost/phpmyadmin/
   - Browse `typeflow_db` → `test_results`
   - Confirm your new test appears in the database
   - Note the `improved` column (0 or 1)

---

## 📝 License

MIT License - feel free to use this project for learning or personal use.

---

## 🚀 Future Enhancements

Potential features to add:
- [ ] WPM-over-time line chart on dashboard
- [ ] Custom text selection or difficulty levels
- [ ] Leaderboards (global/friends)
- [ ] Practice modes (words, sentences, paragraphs)
- [ ] Dark mode theme
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Mobile app (React Native)

---

**Made with ❤️ for typing enthusiasts**