# TypeFlow - Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Database Issues

### Issue: "Cannot connect to database"

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**
1. ✅ Start MySQL in XAMPP
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Wait for status to show "Running"

2. ✅ Check database credentials in `.env`
   ```
   DB_HOST=localhost    (not 127.0.0.1)
   DB_USER=root         (usually default)
   DB_PASSWORD=         (empty for XAMPP)
   ```

3. ✅ Verify database exists
   - Open http://localhost/phpmyadmin/
   - Look for `typeflow_db` in left sidebar
   - If not found, run schema.sql again

4. ✅ Check MySQL port (default 3306)
   - XAMPP > Config (MySQL) > Check port setting

---

### Issue: "Unknown database 'typeflow_db'"

**Solutions:**
1. ✅ Run schema.sql in phpMyAdmin
   - Go to http://localhost/phpmyadmin/
   - Click SQL tab
   - Copy-paste entire `server/schema.sql`
   - Click Execute

2. ✅ Verify tables exist
   - Refresh phpMyAdmin
   - Expand `typeflow_db`
   - Should see `users` and `test_results` tables

3. ✅ Check for typos in `.env`
   - Correct spelling: `typeflow_db` (with underscore)
   - Make sure it matches your created database

---

### Issue: "Access denied for user 'root'@'localhost'"

**Solutions:**
1. ✅ MySQL has a password
   - Update `.env`:
     ```
     DB_PASSWORD=your_mysql_password
     ```

2. ✅ Check XAMPP MySQL user
   - XAMPP default: user = `root`, password = empty
   - If different, update `.env`

3. ✅ Reset MySQL in XAMPP
   - XAMPP > MySQL > Admin
   - Set root user password to empty (or desired password)
   - Update `.env` to match

---

## 🔴 Backend Issues

### Issue: "Port 5000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. ✅ Change port in `.env`
   ```
   PORT=5001
   ```
   Then restart server

2. ✅ Kill process using port 5000
   - **Windows PowerShell:**
     ```powershell
     netstat -ano | findstr :5000
     # Find PID, then:
     taskkill /PID <PID> /F
     ```

3. ✅ Use different port
   - Update `.env` PORT value
   - Frontend will find new port automatically

---

### Issue: "npm ERR! missing script: start"

**Solutions:**
1. ✅ Check you're in `server/` directory
   ```bash
   cd server
   pwd  # Should show .../server
   ```

2. ✅ Verify `package.json` exists
   ```bash
   ls package.json  # Should exist
   ```

3. ✅ Run npm install first
   ```bash
   npm install
   npm start
   ```

4. ✅ Check script name in package.json
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

---

### Issue: "Cannot find module 'express'"

**Solutions:**
1. ✅ Install dependencies
   ```bash
   cd server
   npm install
   ```

2. ✅ Check package.json is present
   ```bash
   cat package.json
   ```

3. ✅ Verify `node_modules` exists
   ```bash
   ls node_modules/
   ```

4. ✅ Clear npm cache and reinstall
   ```bash
   npm cache clean --force
   npm install
   ```

---

### Issue: "Jest: Command not found" or test errors

**Solution:** Tests are not set up - this is normal
- Backend doesn't require testing to run
- Just use the running server for testing

---

### Issue: Server starts but gets no requests

**Solutions:**
1. ✅ Check backend is actually running
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"Server is running"}`

2. ✅ Verify port number
   - Look at startup message
   - Should show: `Server is running on http://localhost:5000`

3. ✅ Check firewall
   - Windows Defender might block port 5000
   - Allow Node.js through firewall

---

## 🔴 Frontend Issues

### Issue: "npm ERR! missing script: dev"

**Solutions:**
1. ✅ Check you're in root directory (not `server/`)
   ```bash
   cd ..  # Go back to project root
   pwd    # Should NOT show .../server
   ```

2. ✅ Verify `package.json` in root
   ```bash
   cat package.json
   ```

3. ✅ Reinstall dependencies
   ```bash
   npm install
   npm run dev
   ```

---

### Issue: "Port 5173 already in use"

**Solutions:**
1. ✅ Vite uses next available port
   - Just start frontend anyway
   - It will show actual port (e.g., 5174)

2. ✅ Or kill the process
   - **Windows PowerShell:**
     ```powershell
     netstat -ano | findstr :5173
     taskkill /PID <PID> /F
     ```

3. ✅ Check terminal output
   - Vite shows actual URL in console
   - Use that URL instead of localhost:5173

---

### Issue: "Cannot find module 'react'"

**Solutions:**
1. ✅ Install frontend dependencies
   ```bash
   npm install
   ```

2. ✅ Verify `package.json` in root directory
   ```bash
   cat package.json
   ```

3. ✅ Check `node_modules` exists
   ```bash
   ls node_modules/
   ```

---

### Issue: Frontend loads but backend not responding

**Symptoms:**
- Signup/Login forms don't work
- Console shows CORS errors
- All API calls fail

**Solutions:**
1. ✅ Verify backend is running
   ```bash
   curl http://localhost:5000/api/health
   ```

2. ✅ Check API URL
   - Frontend hardcoded to: `http://localhost:5000`
   - Make sure backend runs on this URL

3. ✅ Check CORS errors in console
   ```
   Access to XMLHttpRequest blocked by CORS
   ```
   → Backend not running or different port

4. ✅ Start backend first
   ```bash
   # Terminal 1
   cd server
   npm start
   
   # Terminal 2
   npm run dev
   ```

---

## 🔴 Authentication Issues

### Issue: "Signup successful but can't login"

**Solutions:**
1. ✅ Email already exists
   - Use different email
   - Or check database: http://localhost/phpmyadmin/ > users table

2. ✅ Password not stored correctly
   - Check database password field (should be hashed)
   - Hashed passwords look like: `$2b$10$...`

3. ✅ Clear browser cache/localStorage
   - DevTools > Application > LocalStorage > Clear

4. ✅ Check database connection
   ```bash
   # Try API directly
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

---

### Issue: "Invalid email or password" even with correct credentials

**Solutions:**
1. ✅ Check exact email in database
   - Emails are case-sensitive
   - Try: `test@example.com` vs `Test@example.com`

2. ✅ Verify password was hashed
   - In phpMyAdmin, check users table
   - Password should start with `$2b$10$`
   - If it shows plain text, something went wrong

3. ✅ Try signing up again
   - Fresh account ensures proper hashing

4. ✅ Check server logs
   - Backend console should show errors
   - Look for bcrypt comparison issues

---

### Issue: "Token is invalid" when trying to access protected routes

**Symptoms:**
- Login works
- But History page shows "Access token required"

**Solutions:**
1. ✅ Clear localStorage and login again
   ```javascript
   // In browser console:
   localStorage.clear()
   // Then reload page and login
   ```

2. ✅ Check token is actually stored
   ```javascript
   // In browser console:
   localStorage.getItem('token')
   // Should return a long string
   ```

3. ✅ Token might be expired
   - Wait 7 days or logout and login again
   - (In development, expiration isn't really the issue)

4. ✅ JWT_SECRET mismatch
   - Backend generates token with JWT_SECRET
   - If you change JWT_SECRET, old tokens become invalid
   - Clear localStorage if you changed the secret

---

### Issue: "Logout doesn't work"

**Solutions:**
1. ✅ Check Logout button code
   - Should clear localStorage and context
   - Check Header.jsx handleLogout function

2. ✅ Refresh after logout
   - Sometimes UI doesn't update immediately
   - Hard refresh: Ctrl+Shift+R

3. ✅ Check localStorage manually
   ```javascript
   // In browser console after logout:
   localStorage.getItem('token')      // Should be null
   localStorage.getItem('user')       // Should be null
   ```

---

## 🔴 API Issues

### Issue: POST endpoint returns "All fields are required"

**Solutions:**
1. ✅ Check request body is valid JSON
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "confirmPassword": "password123"
   }
   ```

2. ✅ Verify all required fields are present
   - For signup: name, email, password, confirmPassword
   - For login: email, password

3. ✅ Check no typos in field names
   - JavaScript is case-sensitive
   - `confirmPassword` NOT `confirmpassword`

---

### Issue: "Email already registered"

**Solutions:**
1. ✅ Use different email
   ```json
   {"email": "newemail@example.com"}
   ```

2. ✅ Check database
   - phpMyAdmin > users table
   - See if email already exists

3. ✅ Delete test user if needed
   - In phpMyAdmin, find and delete the row

---

### Issue: Tests are not saving

**Symptoms:**
- Can take test
- Results show
- But History page is empty

**Solutions:**
1. ✅ Check you're logged in
   - Test saving only works for authenticated users
   - Not logged in? Results show but don't save

2. ✅ Check token in Authorization header
   ```bash
   curl -X POST http://localhost:5000/api/tests/save \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"wpm":65,"accuracy":98,"mistakes":2,"typedText":"test","duration":45}'
   ```

3. ✅ Check test data being sent
   - All fields required: wpm, accuracy, mistakes, typedText, duration
   - Check browser DevTools > Network tab > see request body

4. ✅ Check database connection
   - Verify MySQL is running
   - Check test_results table exists

---

### Issue: "Comparison is null even though I have previous tests"

**Solutions:**
1. ✅ First test always returns null
   - Comparison only appears from 2nd test onward
   - This is expected behavior

2. ✅ Check you're using same account
   - Comparison only with YOUR previous tests
   - Not comparing with other users

3. ✅ Check database query
   - Tests table should have multiple rows for your user_id
   - Each should have test_date with proper timestamps

---

## 🟡 Performance Issues

### Issue: Database queries are slow

**Solutions:**
1. ✅ Check indexes
   ```sql
   -- In phpMyAdmin, check indexes exist:
   SHOW INDEXES FROM test_results;
   SHOW INDEXES FROM users;
   ```

2. ✅ Run schema.sql again
   - Makes sure all indexes are created

3. ✅ Clear old test data
   ```sql
   -- If too many tests, clear some:
   DELETE FROM test_results WHERE id < 100;
   ```

---

### Issue: Frontend is slow to load

**Solutions:**
1. ✅ Check if backend is responding quickly
   ```bash
   time curl http://localhost:5000/api/health
   ```

2. ✅ Check DevTools > Network tab
   - Look for slow requests
   - Check response times

3. ✅ Clear browser cache
   - Ctrl+Shift+Delete
   - Clear cache and cookies

4. ✅ Check for large typed_text data
   - Don't store extremely long text (>1MB)
   - Limit test text size on frontend

---

## 🟡 UI/UX Issues

### Issue: Comparison messages don't show

**Solutions:**
1. ✅ Check you took 2+ tests
   - First test returns null comparison
   - Comparison shows from test 2 onward

2. ✅ Verify backend returned comparison
   - Check browser DevTools > Network > API response
   - Should include comparison object

3. ✅ Check Results.jsx code
   - Make sure component handles comparison prop
   - Check conditional rendering logic

---

### Issue: Performance trends (↑↓) don't show

**Solutions:**
1. ✅ Check comparison object in response
   ```javascript
   // Browser console on results page:
   console.log(window.location.state)
   // Should show comparison object
   ```

2. ✅ Verify History.jsx calculates trends
   - Code should calculate: `current - previous`
   - Show arrows based on positive/negative

3. ✅ Check CSS for color coding
   - Green for improved (↑)
   - Red for declined (↓)

---

## 🟢 Verification Steps

### System is working correctly if:

✅ Backend
- [ ] Server starts without errors
- [ ] `curl http://localhost:5000/api/health` returns status
- [ ] All 5 endpoints accessible

✅ Database
- [ ] Can see `typeflow_db` in phpMyAdmin
- [ ] Tables: `users` and `test_results` exist
- [ ] Can insert/query data

✅ Frontend
- [ ] App loads at localhost:5173 (or shown port)
- [ ] Can navigate to signup/login
- [ ] Header shows auth options

✅ Authentication
- [ ] Can signup with valid data
- [ ] Auto-login works
- [ ] Token in localStorage
- [ ] User greeting shows in header

✅ Typing Test
- [ ] Can take typing test
- [ ] Results calculate correctly
- [ ] Results show after test completes

✅ Test Saving
- [ ] When logged in, test saves
- [ ] Can view History page
- [ ] Tests appear in table

✅ Comparison
- [ ] After 2nd test, comparison shows
- [ ] Messages appear (improvement/encouragement)
- [ ] Trends show with arrows

---

## 🆘 Still Having Issues?

### Debug Steps

1. **Check browser console**
   - DevTools > Console tab
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Check server console**
   - Terminal where backend runs
   - Look for error messages
   - Check logs

3. **Check database**
   - phpMyAdmin
   - Verify data exists
   - Check foreign keys

4. **Test API directly**
   - Use cURL commands from API_REFERENCE.md
   - Verify endpoint works in isolation

5. **Check logs**
   - Browser DevTools logs
   - Server terminal output
   - Database error logs

### Getting Help

1. Read relevant documentation:
   - API_REFERENCE.md (API questions)
   - SETUP_GUIDE.md (setup issues)
   - SYSTEM_ARCHITECTURE.md (understanding flow)

2. Check file contents:
   - `.env` configuration
   - `package.json` dependencies
   - Database schema in phpMyAdmin

3. Verify prerequisites:
   - Node.js installed
   - MySQL running
   - All ports available

---

## ✅ Quick Checklist for Startup

Before you start, verify:

- [ ] XAMPP Apache running
- [ ] XAMPP MySQL running  
- [ ] phpMyAdmin accessible (http://localhost/phpmyadmin/)
- [ ] Database created with schema.sql
- [ ] Node.js installed (node --version)
- [ ] npm installed (npm --version)
- [ ] server/node_modules exists (or run npm install)
- [ ] Port 5000 available
- [ ] Port 5173 available

If all checked, run:
```bash
# Terminal 1
cd server
npm start

# Terminal 2 (new terminal)
npm run dev
```

---

**Last Updated:** January 15, 2025
**Version:** 1.0.0
