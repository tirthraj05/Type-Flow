# TypeFlow - Quick Reference Card

## 🚀 Startup Commands (Copy & Paste)

### Terminal 1: Start Backend
```bash
cd server
npm install
npm start
```
Expected: `Server is running on http://localhost:5000`

### Terminal 2: Start Frontend
```bash
npm install
npm run dev
```
Expected: App opens at `http://localhost:5173`

---

## 📍 Main Routes (URLs)

| URL | Page | Auth Required | Purpose |
|-----|------|---------------|---------|
| http://localhost:5173/ | Home | No | Landing page |
| http://localhost:5173/test | Typing Test | No | Take test |
| http://localhost:5173/results | Results | No | See results |
| http://localhost:5173/login | Login | No | Sign in |
| http://localhost:5173/signup | Sign Up | No | Create account |
| http://localhost:5173/history | History | **Yes** | View dashboard |
| http://localhost:5173/about | About | No | Info page |

---

## 🔗 API Endpoints (Base: http://localhost:5000/api)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/signup` | No | Register |
| POST | `/auth/login` | No | Login |
| POST | `/tests/save` | **Yes** | Save result |
| GET | `/tests/history` | **Yes** | Get results |
| GET | `/tests/stats` | **Yes** | Get stats |
| GET | `/health` | No | Health check |

---

## 📊 Database

### Connect to Database
1. Open: http://localhost/phpmyadmin/
2. Login: root (no password by default)
3. Database: `typeflow_db`

### Key Tables
```
users
├─ id, name, email, password, created_at, updated_at

test_results
├─ id, user_id, wpm, accuracy, mistakes
├─ typed_text, duration, test_date, created_at
```

### Setup Database
```sql
-- Copy this entire text from server/schema.sql
-- Paste in phpMyAdmin SQL tab
-- Click Execute
```

---

## 🔐 Authentication

### Signup Request
```json
POST http://localhost:5000/api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login Request
```json
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Request (with token)
```
GET http://localhost:5000/api/tests/history
Headers: Authorization: Bearer {TOKEN_HERE}
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Database config |
| `server/server.js` | Backend entry |
| `server/schema.sql` | Database setup |
| `src/App.jsx` | Frontend entry |
| `src/context/AuthContext.jsx` | Auth state |
| `src/pages/History.jsx` | Dashboard |

---

## 🧪 Quick Test Flow

1. **Sign Up**
   - Go to http://localhost:5173/signup
   - Fill: Name, Email, Password, Confirm
   - Click "Sign Up"
   - Auto-login happens
   - See user greeting in header

2. **Take Test**
   - Click "Practice"
   - Take typing test
   - View results

3. **View Results**
   - See stats
   - See comparison (if 2nd+ test)
   - See improvement/decline message

4. **View History**
   - Click "History" in header
   - See stats overview
   - See all tests table
   - See trends (↑↓)

5. **Logout**
   - Click "Logout"
   - Redirected to home
   - Header shows Login/Sign Up

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| DB won't connect | Start MySQL in XAMPP, check .env |
| Backend won't start | Check port 5000 free, npm install |
| Frontend won't start | Check you're in project root, npm install |
| Signup fails | Email already used, try different |
| Login fails | Wrong email/password, check spelling |
| History empty | Not logged in, or tests not saved |
| API errors | Check backend running on :5000 |
| Token invalid | Clear localStorage, login again |

---

## 💾 Environment Variables

**.env File Location:** `server/.env`

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=typeflow_db
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**Update if:**
- MySQL has password → Set `DB_PASSWORD`
- Using different port → Set `PORT`
- Deploying to production → Change `JWT_SECRET`

---

## 📱 Example Workflows

### New User Journey
1. Signup → Auto-login → Home
2. Click Practice → Take test → Results
3. Click History → See test in table
4. Take another test → See comparison
5. Click History → See both tests + stats

### Returning User
1. Login → Home
2. See "History" link in header (logged in!)
3. Click History → Dashboard
4. Take test → Results with comparison
5. Logout → Login required for history

### Test Comparison
- **Test 1:** No comparison (first test)
- **Test 2:** Compare with Test 1
  - If better: Green message "Great job!"
  - If worse: Yellow message "Keep practicing!"
- **Test 3+:** Compare with most recent previous test

---

## 🎯 Feature Matrix

| Feature | Works Without Login | Works With Login | Saves Data |
|---------|---------------------|------------------|------------|
| Typing Test | ✅ | ✅ | ❌ / ✅ |
| View Results | ✅ | ✅ | N/A |
| See Comparison | ❌ | ✅ | ✅ |
| View History | ❌ | ✅ | - |
| See Dashboard | ❌ | ✅ | - |

---

## 📋 Data Stored Per Test

When logged in, each test saves:
- ✅ WPM (words per minute)
- ✅ Accuracy (%)
- ✅ Mistakes (count)
- ✅ Typed Text (full paragraph)
- ✅ Duration (seconds)
- ✅ Date & Time (automatic)
- ✅ User ID (automatic)

---

## 🔒 Security Summary

- ✅ Passwords: bcrypt hashed
- ✅ Auth: JWT tokens (7-day expiration)
- ✅ Database: Parameterized queries
- ✅ APIs: Protected with Bearer token
- ✅ Storage: token in localStorage

---

## 📊 File Size Reference

| Component | Lines | Size |
|-----------|-------|------|
| Backend | ~450 | ~20KB |
| Frontend | ~790 | ~30KB |
| Database | ~35 | ~2KB |
| Documentation | ~4000+ | ~150KB |
| **Total** | **~5500+** | **~200KB** |

---

## 🎓 Documentation Map

```
START HERE
    ↓
QUICK_START.md (5 min)
    ↓
Choose Path:
├─ Setup? → SETUP_GUIDE.md
├─ API? → API_REFERENCE.md
├─ Architecture? → SYSTEM_ARCHITECTURE.md
├─ Troubleshoot? → TROUBLESHOOTING.md
├─ Overview? → IMPLEMENTATION_SUMMARY.md
└─ Navigation? → INDEX.md
```

---

## ⚡ Essential Commands

```bash
# Backend Setup & Start
cd server
npm install                    # First time only
npm start                      # Run server
npm run dev                    # With auto-restart

# Frontend Setup & Start
npm install                    # First time only (in root)
npm run dev                    # Start dev server
npm run build                  # Build for production

# Database
# In phpMyAdmin: copy-paste schema.sql contents & Execute
```

---

## 🎉 Success Indicators

✅ **Backend Ready:**
```
Server is running on http://localhost:5000
```

✅ **Frontend Ready:**
```
Local: http://localhost:5173/
```

✅ **Database Ready:**
```
typeflow_db shown in phpMyAdmin
```

✅ **Full System Ready:**
- Can signup/login
- Can take tests
- Can view history
- See comparisons

---

## 🔗 Useful Links

- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:5173
- Database: http://localhost/phpmyadmin/
- phpMyAdmin Users: root (no password)

---

## 📞 Getting Help

1. **Error message?** → Check TROUBLESHOOTING.md
2. **How does it work?** → Check SYSTEM_ARCHITECTURE.md
3. **API question?** → Check API_REFERENCE.md
4. **Setup problem?** → Check SETUP_GUIDE.md
5. **Finding files?** → Check INDEX.md

---

## ✨ Tips

- 💡 First test shows no comparison (expected)
- 💡 Logout clears localStorage (automatic)
- 💡 Tokens expire in 7 days (auto-logout)
- 💡 Can take tests without login (but won't save)
- 💡 Multiple users can use same app
- 💡 Each user's tests are private (user_id in DB)

---

## 🚀 Production Checklist

Before deploying:
- [ ] Change JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set DB_PASSWORD if needed
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Enable request logging
- [ ] Test all endpoints
- [ ] Set up monitoring

---

**Status:** ✅ Complete & Working
**Version:** 1.0.0
**Ready to Use:** YES!

Print this card, keep it nearby! 📋
