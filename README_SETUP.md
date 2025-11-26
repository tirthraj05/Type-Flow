# TypeFlow - Complete Typing Practice Website

A full-stack typing practice application inspired by TypingBolt, built with React, Node.js/Express, and MySQL. Track your typing speed, accuracy, and watch your improvement over time.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (download from https://nodejs.org/)
- XAMPP (MySQL server) - download from https://www.apachefriends.org/
- A modern web browser

### Step 1: Set Up the Database

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Click "Start" next to Apache and MySQL modules

2. **Access phpMyAdmin**
   - Open http://localhost/phpmyadmin/ in your browser
   - You should see the phpMyAdmin interface

3. **Create the Database and Tables**
   - Go to http://localhost/phpmyadmin/index.php?route=/sql
   - **Copy and paste the entire content below** into the SQL query editor:

```sql
-- Create TypeFlow Database
CREATE DATABASE IF NOT EXISTS typeflow_db;
USE typeflow_db;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Test Results Table
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

-- Create indexes for better query performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_results_user_date ON test_results(user_id, test_date DESC);

-- SEED DATA: Demo user and sample test results
INSERT INTO users (name, email, password) VALUES 
  ('Demo User', 'demo@typeflow.com', '$2b$10$N9qo8uLOickgx2ZMRZoMye');

-- Sample test results for demo user (user_id = 1)
INSERT INTO test_results (user_id, wpm, accuracy, mistakes, typed_text, duration, improved, created_at) VALUES 
  (1, 65.5, 95.2, 3, 'The quick brown fox jumps over the lazy dog. This is a test of typing speed and accuracy.', 30, 0, DATE_SUB(NOW(), INTERVAL 7 DAY)),
  (1, 72.3, 96.1, 2, 'Typing practice helps improve your skills and muscle memory over time with consistent practice sessions.', 30, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
  (1, 71.8, 95.8, 2, 'Regular typing tests can help you track progress and identify areas for improvement in your technique.', 30, 0, DATE_SUB(NOW(), INTERVAL 3 DAY)),
  (1, 78.2, 97.4, 1, 'Fast and accurate typing is essential for productive work in today digital world where speed matters.', 30, 1, DATE_SUB(NOW(), INTERVAL 1 DAY));
```

   - Click "Go" to execute the SQL
   - You should see a success message

4. **Verify the Database**
   - Refresh phpMyAdmin
   - In the left sidebar, click "typeflow_db"
   - You should see two tables: `users` and `test_results`
   - Click the `test_results` table and you should see 4 sample records
   - Click the `users` table and you should see the demo user

### Step 2: Set Up the Backend Server

1. **Navigate to server directory**
   ```powershell
   cd d:\Collage\Type-Flow\server
   ```

2. **Create .env file**
   - Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item -Path ".env.example" -Destination ".env"
   ```
   - Open `.env` and verify settings (default is fine for local XAMPP):
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=typeflow_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

3. **Install dependencies**
   ```powershell
   npm install
   ```

4. **Start the server**
   ```powershell
   npm start
   ```
   
   You should see:
   ```
   Server is running on http://localhost:5000
   ✓ Database created or already exists
   ✓ Users table created or already exists
   ✓ Test results table created or already exists
   ✓ Database initialization completed successfully
   ```

   Keep this terminal open while using the app.

### Step 3: Set Up the Frontend

1. **Open a new terminal and navigate to project root**
   ```powershell
   cd d:\Collage\Type-Flow
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start the development server**
   ```powershell
   npm run dev
   ```

   You should see:
   ```
   VITE v... ready in ... ms
   ➜  Local:   http://localhost:5173/
   ```

4. **Open the app**
   - Click the URL or open http://localhost:5173 in your browser
   - You should see the TypeFlow homepage

## 📝 Testing the Full Flow

### Using the Demo Account

1. **Login with demo account**
   - Email: `demo@typeflow.com`
   - Password: `demo123`
   - You'll see the dashboard with 4 sample test results

2. **View Dashboard**
   - Click "Dashboard" to see test history with stats
   - You should see 4 test records with dates, WPM, accuracy, and improvement badges

3. **Verify in phpMyAdmin**
   - Open http://localhost/phpmyadmin/
   - Go to typeflow_db → test_results
   - You should see the same 4 records from the dashboard

### Create a New Account and Take a Test

1. **Sign Up**
   - Click "Get Started" on home page
   - Fill in: Name, Email, Password
   - Click "Sign Up"
   - You'll be automatically logged in

2. **Take a Test**
   - Click "Start Practicing"
   - See the text prompt area with live WPM/Accuracy/Mistakes metrics
   - Start typing to begin (timer starts on first character)
   - Type the entire paragraph
   - See your results with improvement status
   - Click "View Dashboard" to see your test in history

3. **Check in phpMyAdmin**
   - Open http://localhost/phpmyadmin/
   - Go to typeflow_db → test_results
   - You should see your new test record

## 🔧 Backend API Documentation

### Authentication Endpoints

**POST /api/auth/signup**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
Response: `{ "message": "User registered successfully" }`

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response: `{ "message": "Login successful", "token": "jwt_token", "user": {...} }`

### Test Endpoints

**POST /api/tests/save** (requires authentication)
```json
{
  "wpm": 75.5,
  "accuracy": 96.2,
  "mistakes": 2,
  "typedText": "The text user typed...",
  "duration": 30
}
```
Response: `{ "message": "Test result saved", "testId": 123, "improved": true, "comparison": {...} }`

**GET /api/tests/history?page=1&limit=10** (requires authentication)
Response: Returns paginated list of user's tests

**GET /api/tests/:id** (requires authentication)
Response: Returns single test detail with full typed text

**GET /api/tests/dashboard/stats** (requires authentication)
Response: Returns user statistics (total tests, avg WPM, best WPM, etc.)

## 💡 Improvement Logic Explanation

TypeFlow tracks whether each test is an "improvement" using this logic:

1. **First Test**: Always marked as NOT improved (no previous test to compare)
2. **Subsequent Tests**: 
   - Improved if **WPM increased** significantly (more than 0 WPM increase)
   - OR if **WPM stayed same** (+/- 2 WPM) AND **Accuracy improved**
   - Status is saved in `test_results.improved` column (1 = improved, 0 = not improved)

3. **Result Feedback**:
   - Green badge "Nice! Your WPM Improved" if improved = true
   - Amber badge "Good Effort! Keep Practicing" if improved = false
   - Shows comparison with previous test (WPM difference, Accuracy difference)

4. **Dashboard**:
   - "Improvements" card shows count of tests with improved = 1
   - Individual test rows show green "✓ Improved" badge for improved tests

Example progression:
- Test 1: 65 WPM, 95% accuracy → NOT improved (first test)
- Test 2: 72 WPM, 96% accuracy → IMPROVED (WPM +7)
- Test 3: 71 WPM, 95% accuracy → NOT improved (WPM -1, accuracy same)
- Test 4: 78 WPM, 97% accuracy → IMPROVED (WPM +7)

## 📊 Dashboard Features

### Statistics Card
Shows your overall performance:
- **Total Tests**: Number of typing tests completed
- **Avg WPM**: Average words per minute
- **Best WPM**: Your personal best
- **Avg Accuracy**: Average accuracy percentage
- **Improvements**: Count of tests where you improved

### Test History Table
Shows all your tests (newest first):
- Date & Time of test
- WPM achieved
- Accuracy percentage
- Number of mistakes
- Test duration
- Improvement badge (green if improved)
- "View" button to see full test details

### Test Detail Modal
Click "View" on any test to see:
- Complete metrics
- Full typed text
- Exact timestamp

### CSV Export
Click "Export CSV" to download your test history as a spreadsheet for further analysis.

## 🎨 UI Features

### Typing Test Page
- **Real-time metrics** at the top: WPM, Accuracy, Mistakes, Time
- **Progress bar** showing completion percentage
- **Text display area** with:
  - Correct characters in green
  - Incorrect characters highlighted in red
  - Current position cursor in light blue
  - Untyped characters in gray
- **Controls**: Generate Paragraph, Restart, Pause/Resume
- **Tips section** for typing best practices
- Login required (redirects if not authenticated)

### Results Page
- **Improvement badge** with emoji (🎉 for improvement, 💪 for encouragement)
- **Comparison section** showing previous test vs current
- **Difference display** (WPM change, Accuracy change)
- **Action buttons** to try again or view dashboard

### Dashboard
- **Statistics cards** with key metrics
- **Sortable history table** with pagination
- **Export to CSV** functionality
- **Test detail modal** for viewing full test information
- **Improvement tracking** with visual badges

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens for authentication
- ✅ Rate limiting on auth endpoints (10 attempts per 15 minutes)
- ✅ General rate limiting (100 requests per 15 minutes)
- ✅ Prepared statements to prevent SQL injection
- ✅ Text sanitization (typed_text limited to 50k chars)
- ✅ Server-side validation on all endpoints
- ✅ Protected endpoints require valid JWT token

## 🌐 API Security Headers

- CORS enabled for localhost:5173 (frontend)
- Rate limiting prevents brute force attacks
- Invalid tokens return 403 Forbidden
- Missing tokens return 401 Unauthorized

## 📱 Responsive Design

The application is fully responsive:
- **Mobile** (< 768px): Single column layout, touch-friendly buttons
- **Tablet** (768px - 1024px): Two column layout for some sections
- **Desktop** (> 1024px): Full multi-column layout with sidebars

## ⌨️ Keyboard Accessibility

- Tab navigation through all interactive elements
- Enter key to submit forms
- Aria labels for screen readers
- Aria-live regions for dynamic content announcements
- Semantic HTML structure

## 🐛 Troubleshooting

### "Cannot connect to database"
- Ensure MySQL is running in XAMPP
- Check .env file has correct DB_HOST, DB_USER, DB_PASSWORD
- Verify database name matches `typeflow_db`

### "Test results not appearing in dashboard"
- Check that you're logged in as the correct user
- Verify test was actually saved (check phpMyAdmin)
- Try refreshing the page
- Check browser console for errors

### "Backend server won't start"
- Check that port 5000 is not already in use
- Verify MySQL is running
- Check Node version is 16 or higher: `node --version`
- Re-run `npm install` in server directory

### "Cannot login with demo account"
- Verify seed data was inserted (check phpMyAdmin users table)
- The demo password hash is for "demo123"
- Try creating a new account instead

## 📦 Project Structure

```
Type-Flow/
├── server/                    # Backend (Node.js/Express)
│   ├── server.js             # Main server file with rate limiting
│   ├── package.json          # Backend dependencies
│   ├── schema.sql            # Database schema and seed data
│   ├── .env.example          # Example environment variables
│   ├── config/
│   │   └── database.js       # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   └── routes/
│       ├── auth.js           # Auth endpoints (signup/login)
│       └── tests.js          # Test endpoints (save/history/stats)
├── src/                       # Frontend (React + Vite)
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Main app with routing
│   ├── styles.css            # Global styles
│   ├── theme.js              # Theme configuration
│   ├── components/
│   │   ├── Header.jsx        # Navigation header
│   │   └── Footer.jsx        # Footer component
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── TypingTest.jsx    # Typing practice page
│   │   ├── Results.jsx       # Test results page
│   │   ├── History.jsx       # Dashboard/history page
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Signup page
│   │   └── About.jsx         # About page
│   └── utils/
│       └── generateText.js   # Text generation utility
├── package.json              # Frontend dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.cjs       # Tailwind CSS config
└── README_SETUP.md           # This file
```

## 🚀 Deployment Notes

To deploy to production:

1. **Database**: Set up MySQL on production server
2. **Backend**: 
   - Set `NODE_ENV=production`
   - Change JWT_SECRET to a strong random value
   - Use a process manager like PM2
   - Configure proper database credentials
3. **Frontend**:
   - Build: `npm run build`
   - Deploy dist folder to static hosting
   - Update API URL to production backend
4. **Security**:
   - Enable HTTPS
   - Set CORS to production domain only
   - Configure rate limiting for production scale
   - Use environment variables for all secrets

## 📄 License

MIT

## 💬 Support

For issues or questions, check the troubleshooting section above or review the browser console for error messages.

## 🎯 Next Steps

After setup is complete:

1. ✅ Create an account and take a typing test
2. ✅ View your results and dashboard
3. ✅ Take multiple tests to see improvement tracking
4. ✅ Export your history as CSV
5. ✅ Share your progress with friends!

Happy typing! 🎉
