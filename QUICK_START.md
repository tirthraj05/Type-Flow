# TypeFlow - Quick Start Guide (5 Minutes)

## ⚡ TL;DR Setup

### Prerequisites
- Node.js installed
- XAMPP running (MySQL on port 3306)

### Step 1: Database (1 min)
1. Open http://localhost/phpmyadmin
2. Go to SQL tab
3. **Copy everything from `MIGRATION.sql` file and paste it**
4. Click "Go" ✓

### Step 2: Backend Server (2 min)
```powershell
cd server
npm install
npm start
```
Wait for: "✓ Database initialization completed successfully"

### Step 3: Frontend App (2 min)
In a new terminal:
```powershell
npm install
npm run dev
```
Open http://localhost:5173

### Step 4: Test It (1 min)
1. **Option A (Demo Account)**: 
   - Click "Login"
   - Email: `demo@typeflow.com`
   - Password: `demo123`
   - See 4 test records in dashboard

2. **Option B (New Account)**:
   - Click "Get Started"
   - Create account
   - Click "Start Practicing"
   - Type the text
   - See your results!

## 🎯 Key Endpoints

| Method | Endpoint | Auth Required |
|--------|----------|---|
| POST | /api/auth/signup | No |
| POST | /api/auth/login | No |
| POST | /api/tests/save | Yes |
| GET | /api/tests/history | Yes |
| GET | /api/tests/:id | Yes |
| GET | /api/tests/dashboard/stats | Yes |

## 📊 Database Schema

**users table**
- id (auto-increment)
- name, email, password (hashed)
- created_at, updated_at

**test_results table**
- id, user_id (FK)
- wpm, accuracy, mistakes, duration
- typed_text (full text user typed)
- improved (boolean: 1=improved vs previous, 0=not)
- created_at, test_date

## 💡 Improvement Logic

Test marked as "improved" if:
- **WPM increased** more than 0 WPM from previous test
- OR **WPM similar** (±2) AND **accuracy improved**

Results page shows:
- 🎉 Green badge if improved = 1
- 💪 Amber badge if improved = 0

## 🔒 Security

✅ Passwords: bcrypt (10 rounds)
✅ Auth: JWT tokens
✅ Rate limit: 10/15min on auth, 100/15min general
✅ SQL injection: Prepared statements
✅ Text sanitization: 50k char limit

## 📱 Features

✅ Real-time typing metrics (WPM, Accuracy, Mistakes, Time)
✅ Live character highlighting (correct=green, wrong=red)
✅ Progress bar
✅ Pause/Resume test
✅ Dashboard with statistics
✅ Test history with pagination
✅ Improvement tracking
✅ CSV export
✅ Responsive design
✅ Keyboard accessible

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Database connection error | Ensure MySQL running in XAMPP |
| Port 5000 in use | Kill process or change PORT in .env |
| Tests not saving | Check network tab in browser DevTools |
| Can't login demo user | Verify seed data in phpMyAdmin users table |

## 📁 Important Files

- `server/schema.sql` - Database schema with seed
- `MIGRATION.sql` - Quick database setup (paste in phpMyAdmin)
- `server/.env.example` - Database config template
- `README_SETUP.md` - Detailed documentation
- `src/pages/TypingTest.jsx` - Typing practice component
- `src/pages/History.jsx` - Dashboard component

## 🚀 Next Steps

After successful setup:
1. Take a few typing tests
2. Check dashboard for your results
3. Verify data in phpMyAdmin
4. Try exporting to CSV
5. Review improvement tracking

---

**Need help?** Check `README_SETUP.md` for detailed troubleshooting.

## 🔧 Common Commands

```bash
# Backend
cd server
npm install     # First time only
npm start       # Run server
npm run dev     # With nodemon auto-restart

# Frontend
npm install     # First time only
npm run dev     # Start dev server
npm run build   # Build for production
```

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| DB connection fails | Check MySQL running, verify .env settings |
| CORS errors | Make sure backend runs on :5000 |
| Token errors | Clear localStorage, login again |
| Port already in use | Change PORT in server/.env or frontend vite config |

---

## 📱 Pages & Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Home page | No |
| `/test` | Typing test | No |
| `/results` | Test results | No |
| `/login` | Login page | No |
| `/signup` | Sign up page | No |
| `/history` | Test history & stats | **Yes** |
| `/about` | About page | No |

---

## 🛡️ Security Notes

✓ Passwords: bcrypt hashed (10 rounds)
✓ Tokens: JWT, 7-day expiration
✓ Database: Parameterized queries (no SQL injection)
✓ Frontend: Tokens in localStorage
✓ Backend: CORS enabled, error handling

---

## 📂 Important Files

```
server/.env              ← Database & JWT config
server/schema.sql        ← Run this in phpMyAdmin
src/context/AuthContext  ← Auth state management
src/pages/History.jsx    ← Results dashboard
server/routes/tests.js   ← API endpoints
```

---

## 🎓 What Gets Saved

When logged in, each test saves:
- **WPM** (Words Per Minute)
- **Accuracy** (%)
- **Mistakes** (count)
- **Duration** (seconds)
- **Typed Text** (full text)
- **Date & Time** (automatic)
- **User ID** (automatic)

---

## ✨ Next Steps

After setup:
1. ✅ Create test account
2. ✅ Take multiple typing tests
3. ✅ Check History for trends
4. ✅ See performance comparisons
5. ✅ Customize as needed!

---

**Need Help?** Check SETUP_GUIDE.md for detailed documentation.
