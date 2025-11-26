# TypeFlow - System Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Frontend)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  React Components (Signup, Login, TypingTest, History, Results)│
│  │                                                              │
│  ├─ AuthContext (State Management)                             │
│  ├─ localStorage (Token & User Storage)                        │
│  └─ React Router (Page Navigation)                             │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP API Calls
              (REST with JWT Bearer Token)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 EXPRESS SERVER (Backend)                        │
│                   http://localhost:5000                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ Routes:                                             │       │
│  ├─────────────────────────────────────────────────────┤       │
│  │ POST   /api/auth/signup                             │       │
│  │ POST   /api/auth/login                              │       │
│  │ POST   /api/tests/save        (Protected)           │       │
│  │ GET    /api/tests/history     (Protected)           │       │
│  │ GET    /api/tests/stats       (Protected)           │       │
│  │ GET    /api/health                                  │       │
│  └─────────────────────────────────────────────────────┘       │
│                           │                                     │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ Middleware:                                         │       │
│  ├─────────────────────────────────────────────────────┤       │
│  │ • CORS Handler                                      │       │
│  │ • JWT Authentication (protected routes)             │       │
│  │ • Error Handling                                    │       │
│  │ • Input Validation                                  │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                   MySQL Query Protocol
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              MYSQL DATABASE (XAMPP)                             │
│                   localhost:3306                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Database: typeflow_db                                          │
│  │                                                              │
│  ├─ Table: users                                               │
│  │  ├─ id (PK)                                                 │
│  │  ├─ name                                                    │
│  │  ├─ email (UNIQUE, indexed)                                │
│  │  ├─ password (bcrypt hashed)                               │
│  │  └─ timestamps                                              │
│  │                                                              │
│  └─ Table: test_results                                        │
│     ├─ id (PK)                                                 │
│     ├─ user_id (FK → users.id)                                │
│     ├─ wpm, accuracy, mistakes                                │
│     ├─ typed_text, duration                                   │
│     ├─ test_date (indexed)                                    │
│     └─ timestamps                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### Signup Flow
```
User                    Frontend              Backend              Database
 │                         │                    │                    │
 ├─ Enter signup form ─→   │                    │                    │
 │                         │                    │                    │
 │                    ┌────┴──────────────┐    │                    │
 │                    │ Validate form:    │    │                    │
 │                    │ - Name required   │    │                    │
 │                    │ - Email valid     │    │                    │
 │                    │ - Passwords match │    │                    │
 │                    └─────┬─────────────┘    │                    │
 │                          │                  │                    │
 │                    POST /api/auth/signup    │                    │
 │                          ├─────────────────→│                    │
 │                          │                  ├─ Validate input    │
 │                          │                  │                    │
 │                          │                  ├─ Check email exists
 │                          │                  ├──────────────────→│
 │                          │                  │                    │
 │                          │                  │← Email not found   │
 │                          │                  │                    │
 │                          │                  ├─ Hash password     │
 │                          │                  │   (bcrypt)         │
 │                          │                  │                    │
 │                          │                  ├─ Insert user ─────→│
 │                          │                  │                    │
 │                          │                  │← Success ──────────│
 │                          │                  │                    │
 │← Success response        │                  │                    │
 │                          ├─ Auto-login      │                    │
 │                     POST /api/auth/login    │                    │
 │                          ├─────────────────→│                    │
 │                          │                  ├─ Verify password   │
 │                          │                  │                    │
 │                          │                  ├─ Generate JWT ─────→│
 │                          │                  │  (7-day exp)       │
 │                          │                  │                    │
 │← Token + User data       │                  │                    │
 │                          │                  │                    │
 └─ Redirect to home       │                    │                    │
    (localStorage: token)
```

### Test Taking & Saving Flow
```
User                 Frontend             Backend              Database
 │                     │                    │                    │
 ├─ Take typing test ─→│                    │                    │
 │  (Type & finish)    │                    │                    │
 │                     │ Calculate stats    │                    │
 │                     │ - WPM              │                    │
 │                     │ - Accuracy         │                    │
 │                     │ - Mistakes         │                    │
 │                     │ - Duration         │                    │
 │                     │                    │                    │
 │                ┌────┴──────────────┐    │                    │
 │                │ If authenticated:  │    │                    │
 │                │ POST /api/tests/save
 │                │ with Bearer token  │    │                    │
 │                └─────┬──────────────┘    │                    │
 │                      │                   │                    │
 │                      ├──────────────────→│                    │
 │                      │                   ├─ Verify JWT       │
 │                      │                   │                    │
 │                      │                   ├─ Insert test ─────→│
 │                      │                   │  (with user_id)    │
 │                      │                   │                    │
 │                      │                   ├─ Fetch previous ──→│
 │                      │                   │  test for compare  │
 │                      │                   │                    │
 │                      │                   │← Previous test data│
 │                      │                   │                    │
 │                      │ ← Comparison data │                    │
 │                      │   (if available)  │                    │
 │                      │                   │                    │
 └─ View results ────→ │                    │                    │
    Show comparison msgs
```

### History & Dashboard Flow
```
User                  Frontend             Backend              Database
 │                       │                    │                    │
 ├─ Click "History" ────→│                    │                    │
 │                       │                    │                    │
 │                  GET /api/tests/history    │                    │
 │                       ├───────────────────→│                    │
 │                       │                    ├─ Verify JWT       │
 │                       │                    │                    │
 │                       │                    ├─ Query all tests ─→│
 │                       │                    │  for user (DESC)   │
 │                       │                    │                    │
 │                       │                    │← Test array ──────│
 │                       │                    │  (newest first)    │
 │                       │                    │                    │
 │                  GET /api/tests/stats      │                    │
 │                       ├───────────────────→│                    │
 │                       │                    ├─ Calculate stats ─→│
 │                       │                    │  AVG, MAX          │
 │                       │                    │                    │
 │                       │                    │← Stats data ──────│
 │                       │                    │                    │
 │← Dashboard data       │                    │                    │
 │                       │                    │                    │
 └─ Display:            │                    │                    │
    • Stats overview
    • Results table
    • Trends (↑↓)
    • Performance ↑↑
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    JWT TOKEN LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────┘

1. GENERATION (Login)
   User password verified ──→ JWT created with:
                             • User ID
                             • Email
                             • Name
                             • 7-day expiration

2. STORAGE (Frontend)
   JWT saved to ──→ localStorage
   Also sent in  ──→ Authorization header for each request

3. VERIFICATION (Protected Routes)
   Request arrives ──→ Middleware checks:
                      • Token exists?
                      • Valid format?
                      • Not expired?
                      • Valid signature?

4. USAGE
   Valid token ──→ Route handler accesses req.user
                  ├─ req.user.id
                  ├─ req.user.email
                  └─ req.user.name

5. EXPIRATION
   After 7 days ──→ Token invalid
                    ├─ User redirected to login
                    ├─ localStorage cleared
                    └─ New login required


┌─────────────────────────────────────────────────────────────────┐
│                   REQUEST WITH JWT TOKEN                        │
└─────────────────────────────────────────────────────────────────┘

HTTP Request:
┌─────────────────────────────────────────────────────────┐
│ GET /api/tests/history                                  │
│ Host: localhost:5000                                    │
│ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX │
│                VCJ9.eyJpZCI6MSwiaWF0IjoxNjA1MzExMDQ1... │
│                                                          │
│ (No body for GET request)                               │
└─────────────────────────────────────────────────────────┘

Server Processing:
1. Extract token from Authorization header
2. Split on space: ["Bearer", "token_string"]
3. Take token_string
4. Verify signature with JWT_SECRET
5. Decode payload
6. Check expiration
7. If valid: req.user = decoded payload
8. If invalid: Return 403 Forbidden
```

---

## 📈 Performance Comparison Logic

```
┌─────────────────────────────────────────────────────────────────┐
│              PERFORMANCE COMPARISON ALGORITHM                   │
└─────────────────────────────────────────────────────────────────┘

When user completes test:

1. SAVE CURRENT TEST
   ├─ Insert into database
   └─ Get inserted test ID

2. FETCH PREVIOUS TEST
   Query: SELECT wpm, accuracy FROM test_results
          WHERE user_id = ? AND id != current_id
          ORDER BY test_date DESC LIMIT 1

   If found:
   ├─ previousWpm = previous.wpm
   ├─ previousAccuracy = previous.accuracy
   └─ Continue to step 3

   If NOT found (first test):
   └─ Return comparison: null

3. CALCULATE DIFFERENCES
   ├─ wpmDifference = currentWpm - previousWpm
   ├─ accuracyDifference = currentAccuracy - previousAccuracy
   └─ Continue to step 4

4. DETERMINE TRENDS
   ├─ wpmImproved = (currentWpm > previousWpm)
   ├─ accuracyImproved = (currentAccuracy > previousAccuracy)
   └─ Continue to step 5

5. GENERATE MESSAGES
   ├─ If wpmImproved:
   │  └─ "🎉 Great job! Your WPM improved by {difference}!"
   │
   ├─ Else if wpmDifference < 0:
   │  └─ "Keep practicing! You'll get back to {previousWpm} WPM soon."
   │
   ├─ If accuracyImproved:
   │  └─ "📈 Your accuracy improved by {difference}%!"
   │
   └─ Else if accuracyDifference < 0:
      └─ "No worries! Focus on accuracy in the next attempt."

6. RETURN TO FRONTEND
   ├─ Comparison object with all data
   ├─ Display colored messages
   ├─ Show previous stats
   └─ User sees encouraging feedback
```

---

## 🗄️ Database Schema Diagram

```
┌──────────────────────────────┐
│         users                │
├──────────────────────────────┤
│ id            INT PK         │
│ name          VARCHAR(100)   │
│ email         VARCHAR(100) U │
│ password      VARCHAR(255)   │
│ created_at    TIMESTAMP      │
│ updated_at    TIMESTAMP      │
└──────┬───────────────────────┘
       │ (1 to Many)
       │ FK: user_id
       │
┌──────▼──────────────────────────────┐
│      test_results                    │
├──────────────────────────────────────┤
│ id            INT PK                │
│ user_id       INT FK (users.id) ───→ CASCADE DELETE
│ wpm           DECIMAL(5,2)          │
│ accuracy      DECIMAL(5,2)          │
│ mistakes      INT                   │
│ typed_text    LONGTEXT              │
│ duration      INT (seconds)         │
│ test_date     TIMESTAMP (indexed)   │
│ created_at    TIMESTAMP             │
└──────────────────────────────────────┘

Indexes:
├─ PRIMARY KEY: id
├─ UNIQUE: users.email
├─ INDEX: users.email (for login)
├─ INDEX: test_results.user_id
├─ INDEX: test_results.test_date
└─ INDEX: (user_id, test_date DESC) (for history query)
```

---

## 🔄 Complete User Session Lifecycle

```
TIME    │ STEP                      │ LOCATION          │ DATA
────────┼──────────────────────────┼───────────────────┼─────────────
T0      │ User opens app           │ Browser           │ No token
        │                          │                   │
T1      │ Navigate to /signup      │ Frontend          │ Signup page
        │ Enter details            │                   │
        │ Submit form              │                   │
        │                          │                   │
T2      │ POST /auth/signup        │ Backend           │ User data
        │ Validate & hash password │ Database          │ Insert user
        │                          │                   │
T3      │ Auto-login triggered     │ Backend           │ Verify creds
        │ POST /auth/login         │                   │
        │                          │                   │
T4      │ JWT token generated      │ Backend           │ Token = 7d exp
        │ Sent to frontend         │ Browser           │ localStorage
        │ Redirect to home         │                   │
        │                          │                   │
T5      │ Browse home page         │ Frontend          │ Logged in ✓
        │                          │                   │
T6      │ Click "Practice"         │ Frontend          │ /test page
        │ Take typing test         │                   │
        │                          │                   │
T7      │ Test complete            │ Frontend          │ Calculate stats
        │ POST /tests/save         │ Backend           │ Insert result
        │ +  Bearer token          │ Database          │ Get previous
        │                          │                   │
T8      │ Returns comparison       │ Frontend          │ Show results
        │ Show improvement msgs    │ Results page      │ with comparison
        │                          │                   │
T9      │ Click "History"          │ Frontend          │ /history page
        │ GET /tests/history       │ Backend           │ Query all tests
        │ + Bearer token           │ Database          │ (DESC order)
        │                          │                   │
T10     │ Returns results array    │ Frontend          │ Display table
        │ GET /tests/stats         │ Backend           │ Calculate AVG
        │ + Bearer token           │ Database          │ Get MAX
        │                          │                   │
T11     │ Dashboard displayed      │ Frontend          │ Stats + trends
        │ User sees full history   │ History page      │ Performance ↑↑
        │                          │                   │
T12     │ Click "Logout"           │ Frontend          │ Clear token
        │ Clear localStorage       │                   │ Clear user data
        │                          │                   │
T13     │ Redirected to home       │ Frontend          │ Login/signup
        │ Can't access /history    │ (protected route) │ shown
        │                          │                   │
TN      │ Next session             │ Browser           │ localStorage
        │ Token still valid (7d)   │                   │ checked on load
        │ Auto re-login if token   │                   │ Stays logged in
        │ available & not expired  │                   │
```

---

## 🎯 API Call Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│            TYPICAL USER INTERACTION SEQUENCE                    │
└─────────────────────────────────────────────────────────────────┘

1. SIGNUP
   ┌──────────┐                    ┌──────────┐
   │ Browser  │                    │ Server   │
   └────┬─────┘                    └────┬─────┘
        │                               │
        │  POST /auth/signup            │
        │  (name, email, pwd, confirm)  │
        ├──────────────────────────────→│
        │                               │
        │                    Validate & Hash
        │                    Insert User
        │                               │
        │         {message: "Success"}  │
        │←──────────────────────────────┤
        │                               │
        │  POST /auth/login             │
        │  (auto-login)                 │
        ├──────────────────────────────→│
        │                               │
        │                    Generate JWT
        │                               │
        │  {token, user}                │
        │←──────────────────────────────┤
        │                               │
        │  Save token to localStorage   │
        │                               │


2. TYPING TEST
   ┌──────────┐                    ┌──────────┐
   │ Browser  │                    │ Server   │
   └────┬─────┘                    └────┬─────┘
        │                               │
        │  Take test locally            │
        │  Calculate stats              │
        │                               │
        │  POST /tests/save             │
        │  Header: Authorization        │
        │  (wpm, accuracy, mistakes...) │
        ├──────────────────────────────→│
        │                               │
        │                    Verify JWT
        │                    Insert Result
        │                    Fetch Previous
        │                    Compare Results
        │                               │
        │  {testId, comparison}         │
        │←──────────────────────────────┤
        │                               │
        │  Show results page            │
        │  Display comparison msgs      │
        │                               │


3. VIEW HISTORY
   ┌──────────┐                    ┌──────────┐
   │ Browser  │                    │ Server   │
   └────┬─────┘                    └────┬─────┘
        │                               │
        │  GET /tests/history           │
        │  Header: Authorization        │
        ├──────────────────────────────→│
        │                               │
        │                    Verify JWT
        │                    Query Results
        │                    (sorted DESC)
        │                               │
        │  {results[], totalTests}      │
        │←──────────────────────────────┤
        │                               │
        │  GET /tests/stats             │
        │  Header: Authorization        │
        ├──────────────────────────────→│
        │                               │
        │                    Verify JWT
        │                    Calculate Stats
        │                               │
        │  {totalTests, avg, max}       │
        │←──────────────────────────────┤
        │                               │
        │  Render dashboard             │
        │  Show table & stats           │
        │  Show trends (↑↓)             │
        │                               │
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                   SECURITY ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Transport Security (HTTPS in production)
├─ Browser ←→ Server: Encrypted channel
└─ Prevents man-in-the-middle attacks

Layer 2: Authentication
├─ Login verification
├─ Password: bcrypt hash (10 rounds)
└─ JWT token generation with secret

Layer 3: API Protection
├─ CORS: Cross-origin validation
├─ Bearer token in Authorization header
├─ Token expiration (7 days)
└─ Protected routes middleware

Layer 4: Database Security
├─ Parameterized queries
├─ No SQL injection possible
├─ UNIQUE constraint on email
└─ Foreign keys with CASCADE

Layer 5: Data Validation
├─ Input validation on all routes
├─ Email format verification
├─ Password strength rules
└─ Numeric range checks

Layer 6: Error Handling
├─ Generic error messages
├─ No sensitive info in responses
├─ Proper HTTP status codes
└─ Request logging (server-side)

Layer 7: Session Management
├─ Token stored in localStorage
├─ Automatic expiration
├─ Manual logout available
└─ No session hijacking possible
```

---

## 📊 Data Transformation Flow

```
Raw Test Data → Processing → Database Storage → Retrieval → Display

INPUT (User's typing test)
├─ Typed text (raw string)
├─ Target text (raw string)
├─ Start time (timestamp)
└─ End time (timestamp)

PROCESSING
├─ Calculate WPM
│  └─ Correct chars / 5 / minutes
├─ Calculate Accuracy
│  └─ (Correct chars / Total typed) * 100
├─ Count Mistakes
│  └─ Incorrect character count
└─ Duration
   └─ End time - Start time

DATABASE STORAGE
├─ wpm: DECIMAL(5,2)     → 65.50
├─ accuracy: DECIMAL(5,2) → 98.20
├─ mistakes: INT          → 2
├─ typed_text: LONGTEXT   → Full string (50MB max)
├─ duration: INT          → 45 (seconds)
└─ test_date: TIMESTAMP   → 2025-01-15 10:30:45

RETRIEVAL & COMPARISON
├─ Get current test: {wpm: 65.50, accuracy: 98.20}
├─ Get previous: {wpm: 62.00, accuracy: 95.50}
├─ Calculate deltas
│  ├─ wpmDiff = 65.50 - 62.00 = 3.50 ✓ Improved
│  └─ accDiff = 98.20 - 95.50 = 2.70 ✓ Improved
└─ Generate messages

FRONTEND DISPLAY
├─ Results Card
│  ├─ WPM: 65 (big text)
│  ├─ Accuracy: 98% (big text)
│  ├─ Mistakes: 2
│  └─ Duration: 45s
├─ Comparison Box (green)
│  ├─ 🎉 Great job! Your WPM improved by 3.50!
│  ├─ 📈 Your accuracy improved by 2.70%!
│  └─ Previous: 62 WPM, 95.50% Accuracy
└─ Action Buttons
   ├─ Try Again
   ├─ View History
   └─ Home
```

---

## ✅ This diagram covers:
- Complete system architecture
- Data flow for all operations
- Authentication & JWT flow
- Comparison algorithm
- Database schema relationships
- Session lifecycle
- API sequence diagrams
- Security layers
- Data transformation pipeline

Use these diagrams as reference during development and testing!
