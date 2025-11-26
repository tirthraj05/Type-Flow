# TypeFlow Setup Verification Checklist

Use this checklist to verify that your TypeFlow installation is working correctly.

## ✅ Pre-Installation Checklist

- [ ] XAMPP installed and MySQL running
- [ ] Node.js installed (v16+)
- [ ] phpMyAdmin accessible at http://localhost/phpmyadmin/

## ✅ Database Setup Verification

### Step 1: Check Database Creation

1. Open phpMyAdmin: http://localhost/phpmyadmin/
2. Look for `typeflow_db` in the left sidebar
3. Click on `typeflow_db`

**Expected Result**: You should see 2 tables:
- `users`
- `test_results`

### Step 2: Verify Table Structure

Click on `users` table → Structure tab:

**Expected columns:**
- `id` (CHAR 36)
- `name` (VARCHAR 100)
- `email` (VARCHAR 100)
- `password` (VARCHAR 255)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

Click on `test_results` table → Structure tab:

**Expected columns:**
- `id` (CHAR 36)
- `user_id` (CHAR 36)
- `wpm` (DECIMAL 6,2)
- `accuracy` (DECIMAL 5,2)
- `mistakes` (INT)
- `typed_text` (LONGTEXT)
- `duration_seconds` (INT)
- `improved` (TINYINT 1)
- `device_info` (VARCHAR 255)
- `test_date` (TIMESTAMP)
- `created_at` (TIMESTAMP)

### Step 3: Verify Sample Data

Click on `test_results` → Browse tab

**Expected Result**: 5 rows of sample test data
- All rows should have `user_id` = '550e8400-e29b-41d4-a716-446655440000'
- WPM values should range from 65.5 to 82.5
- Dates should show progression (7 days ago → today)

Click on `users` → Browse tab

**Expected Result**: 1 demo user
- `id` = '550e8400-e29b-41d4-a716-446655440000'
- `email` = 'demo@typeflow.com'
- `name` = 'Demo User'

---

## ✅ Backend Server Verification

### Step 1: Check Environment File

Location: `server/.env`

**Required content:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=typeflow_db
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production_use_random_string_here
```

### Step 2: Start Backend Server

Run in terminal:
```powershell
cd server
node server.js
```

**Expected Output:**
```
Starting database initialization...
Connected to MySQL
✓ Database created or already exists
✓ Users table created or already exists
✓ Test results table created or already exists
✓ Database initialization completed successfully
Server is running on http://localhost:5000
Available endpoints:
  POST /api/auth/signup
  POST /api/auth/login
  POST /api/auth/logout
  POST /api/tests
  GET /api/tests
  GET /api/tests/:id
  GET /api/tests/stats
  GET /api/tests/export/csv
```

### Step 3: Test Backend Endpoint

Open browser and navigate to: http://localhost:5000/api/health

**Expected Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2025-11-26T..."
}
```

---

## ✅ Frontend Verification

### Step 1: Start Frontend Server

Run in **separate** terminal:
```powershell
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 2: Access Application

Open browser: http://localhost:5173/

**Expected Result:**
- Landing page loads successfully
- You see "Master Your Typing Speed" headline
- "Get Started" and "Login" buttons visible
- Features section with 6 feature cards

### Step 3: Test Demo Login

1. Click "Login" button
2. Enter:
   - Email: `demo@typeflow.com`
   - Password: `demo123`
3. Click "Login"

**Expected Result:**
- Redirected to home page
- Header shows "Demo User" name
- "Start Practicing" and "View Dashboard" buttons visible

---

## ✅ Feature Verification

### Test 1: View Dashboard

After logging in as demo user:
1. Click "View Dashboard"

**Expected Result:**
- Shows 5 statistics cards:
  - Total Tests: 5
  - Avg WPM: ~74
  - Best WPM: 82
  - Avg Accuracy: ~97%
  - Improvements: 3
- Table shows 5 test records
- Most recent test at top (82.5 WPM)
- Some records show "✓ Improved" badge

### Test 2: View Test Detail

On dashboard:
1. Click "View" on any test record

**Expected Result:**
- Modal opens showing:
  - WPM, Accuracy, Mistakes, Duration metrics
  - Full typed text
  - Test date and time
  - Device info (Windows 10 - Chrome)
  - Improvement status

### Test 3: Export CSV

On dashboard:
1. Click "Export CSV" button

**Expected Result:**
- CSV file downloads
- Filename: `typeflow-history-[timestamp].csv`
- Contains all 5 test records with headers

### Test 4: Take a Typing Test

1. Navigate to http://localhost:5173/test
2. Start typing the displayed text

**Expected Result:**
- Live metrics update (WPM, Accuracy, Mistakes, Time)
- Progress bar fills as you type
- Characters turn green (correct) or red (incorrect)
- Test completes when you finish typing

### Test 5: View Results with Encouragement

After completing a test:

**Expected Result:**
- Results page shows with metrics
- Encouragement message displays:
  - Green badge with 🎉 if improved
  - Amber badge with 💪 if not improved
- Comparison section shows difference from previous test
- "View Dashboard" button available

### Test 6: Create New Account

1. Logout from demo account
2. Click "Sign Up"
3. Fill in:
   - Name: Your Name
   - Email: your.email@example.com
   - Password: test123
   - Confirm Password: test123
4. Click "Sign Up"

**Expected Result:**
- Account created successfully
- Automatically logged in
- Redirected to home page
- No test history yet (0 tests)

### Test 7: Verify New User in Database

1. Open phpMyAdmin
2. Browse `typeflow_db` → `users` table

**Expected Result:**
- New user row added with your email
- UUID assigned as id
- Password is hashed (not plain text)

---

## ✅ Security Verification

### Test 1: Protected Routes

1. Logout from application
2. Try to access: http://localhost:5173/test

**Expected Result:**
- Redirected to login page OR
- Shows "Login Required" message

### Test 2: Password Validation

1. Try to signup with:
   - Password: "123" (too short)

**Expected Result:**
- Error message: "Password must be at least 6 characters"

### Test 3: Email Validation

1. Try to signup with:
   - Email: "invalid-email"

**Expected Result:**
- Error message: "Invalid email format"

### Test 4: Duplicate Email Check

1. Try to signup with:
   - Email: demo@typeflow.com (already exists)

**Expected Result:**
- Error message: "Email already registered"

---

## ✅ Data Persistence Verification

### Test 1: Database → Dashboard Sync

1. Login as demo user
2. Note the test count and records
3. Open phpMyAdmin
4. Browse `test_results` table
5. Count rows for demo user (user_id = '550e8400-e29b-41d4-a716-446655440000')

**Expected Result:**
- Dashboard count matches database count
- Latest test in dashboard matches latest row in database

### Test 2: New Test Persistence

1. Take a new typing test
2. Complete the test
3. Check dashboard (should show +1 test)
4. Open phpMyAdmin → `test_results` → Browse
5. Sort by `created_at` DESC

**Expected Result:**
- New row appears at top
- Matches your test metrics (WPM, accuracy, etc.)
- `improved` column shows 0 or 1 based on performance

---

## 🚨 Common Issues

### Issue: "Cannot connect to database"

**Solutions:**
1. Verify MySQL is running in XAMPP
2. Check `DB_PASSWORD` in `server/.env`
3. Test MySQL connection in phpMyAdmin

### Issue: "Table doesn't exist"

**Solutions:**
1. Re-run `MIGRATION.sql` in phpMyAdmin
2. Verify `typeflow_db` exists
3. Check SQL import for errors

### Issue: "Invalid token" on protected routes

**Solutions:**
1. Logout and login again
2. Clear browser localStorage
3. Verify `JWT_SECRET` in `server/.env`

### Issue: Demo user login fails

**Solutions:**
1. Run `server/seed.sql` to recreate demo user
2. Verify password is exactly `demo123`
3. Check `users` table in phpMyAdmin

---

## ✅ Final Checklist

- [ ] Database created and tables exist
- [ ] Demo user and sample data loaded
- [ ] Backend server starts without errors
- [ ] Frontend dev server runs on port 5173
- [ ] Can login with demo credentials
- [ ] Dashboard shows 5 test records
- [ ] Can view test details
- [ ] Can export CSV
- [ ] Can take new typing test
- [ ] Can create new user account
- [ ] New tests appear in database and dashboard

**If all items are checked, your TypeFlow installation is complete! 🎉**

---

## 📞 Need Help?

1. Check `README.md` for detailed setup instructions
2. Review `TROUBLESHOOTING.md` for common issues
3. Verify all files exist:
   - `MIGRATION.sql`
   - `server/.env.example`
   - `server/seed.sql`
   - `server/schema.sql`

**Database URL for verification:**
- phpMyAdmin: http://localhost/phpmyadmin/
- Database name: `typeflow_db`
- Demo user: demo@typeflow.com / demo123
