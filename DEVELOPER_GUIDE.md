# TypeFlow - Developer Guide

## 🏗️ Architecture Overview

```
User Browser (React App)
    ↓ HTTP/JSON
Express API Server
    ↓ SQL Queries
MySQL Database
    ↓ Retrieve Data
Express API Server
    ↓ JSON Response
User Browser
```

## 🔑 Key Components

### Frontend Architecture

**App.jsx** - Main component with routing

**AuthContext.jsx** - Global auth state
- Stores: user, token, loading, isAuthenticated
- Methods: login(), logout()
- Persists to localStorage

**Protected Routes**
- Check `useAuth().isAuthenticated`
- Redirect to login if not authenticated

### Backend Architecture

**server.js** - Express app setup
- Port 5000
- Rate limiting middleware
- CORS enabled
- Routes mounted at `/api/*`

**config/database.js** - MySQL connection
- Creates pool with mysql2/promise
- Auto-creates tables on startup
- Connection pooling for performance

**middleware/auth.js** - JWT validation
- Extracts token from Authorization header
- Validates JWT signature and expiry
- Adds user to request object

**routes/auth.js** - Authentication
- POST /signup: Create user
- POST /login: Authenticate user
- Bcrypt for hashing (10 rounds)

**routes/tests.js** - Test management
- POST /save: Save test result
- GET /history: Paginated test history
- GET /:id: Single test detail
- GET /dashboard/stats: Statistics

### Database Design

**One-to-Many Relationship**: users → test_results

**Indexes for Performance**:
- `idx_user_email` on users table
- `idx_results_user_date` on test_results table
- Allows fast lookups and sorting

## 🔄 Data Flow Examples

### Taking a Test

1. **User types paragraph** (TypingTest.jsx)
   - Real-time metrics calculated locally
   - When done, calls `/api/tests/save`

2. **Backend receives data** (tests.js)
   - Validates ranges (WPM 0-300, accuracy 0-100)
   - Fetches previous test for comparison
   - Calculates `improved` flag
   - Saves to database

3. **Response sent back** (tests.js)
   - testId, improved status, comparison data
   - Frontend navigates to results page

4. **Results displayed** (Results.jsx)
   - Shows improvement badge
   - Displays comparison with previous
   - User can view dashboard or try again

### Viewing Dashboard

1. **Component loads** (History.jsx)
   - Checks `isAuthenticated`
   - Calls `/api/tests/history?page=1&limit=10`

2. **Backend fetches data** (tests.js)
   - Gets total count
   - Fetches paginated records
   - Sorts by created_at DESC
   - Returns formatted response

3. **Frontend displays** (History.jsx)
   - Shows stats cards
   - Renders history table
   - Pagination controls
   - Click "View" for modal

## 🔐 Security Layers

### Password Protection
```
User enters password
    ↓
bcrypt.hash(password, 10)
    ↓
Hashed password stored in DB
    ↓
User logs in
    ↓
bcrypt.compare(inputPassword, storedHash)
    ↓
Match or no match
```

### Authentication
```
User logs in
    ↓
JWT token created with user data
    ↓
Token returned to frontend
    ↓
Frontend sends token with each request
    ↓
Backend validates JWT signature
    ↓
User ID extracted from token
    ↓
Database queries scoped to user
```

### Rate Limiting
```
User makes request
    ↓
Rate limiter checks IP
    ↓
If under limit: allow
If over limit: 429 error
    ↓
Resets every 15 minutes
```

## 📊 Improvement Logic Deep Dive

Located in: `server/routes/tests.js` → `/api/tests/save`

```javascript
// Get previous test
SELECT wpm, accuracy FROM test_results 
WHERE user_id = ? 
ORDER BY created_at DESC LIMIT 1

// Calculate if improved
if (previousTests.length > 0) {
  const previous = previousTests[0];
  const wpmImproved = wpm > previous.wpm;
  const accuracyNotWorsened = accuracy >= previous.accuracy - 2;
  
  improved = wpmImproved || 
             (Math.abs(wpm - previous.wpm) < 2 && accuracy > previous.accuracy);
}

// Save with improved flag
INSERT INTO test_results 
(..., improved) 
VALUES (..., improved ? 1 : 0)
```

**Logic Rules**:
- First test: `improved = false` (no previous)
- WPM increased: `improved = true`
- WPM same (±2) AND accuracy up: `improved = true`
- All other cases: `improved = false`

## 🧪 Common Development Tasks

### Add a New Page

1. Create component in `src/pages/NewPage.jsx`
2. Import in `src/App.jsx`
3. Add route:
```jsx
<Route path="/newpage" element={<NewPage />} />
```
4. Add navigation link in `Header.jsx`

### Add a New API Endpoint

1. Create in appropriate file in `server/routes/`
2. Add middleware (e.g., `authenticateToken`)
3. Add database query
4. Add error handling
5. Return proper status code and JSON
6. Test with curl or Postman

### Change Database Schema

1. Edit `server/schema.sql`
2. Manually update database OR
3. Create migration file
4. Restart backend (will auto-create new tables)

### Modify Improvement Logic

Edit `server/routes/tests.js` → `/api/tests/save` section:
```javascript
// Find this section
improved = wpmImproved || (Math.abs(wpm - previous.wpm) < 2 && accuracy > previous.accuracy);
```

### Change Styling

Use Tailwind classes in components. Examples:
```jsx
// Text styling
className="text-xl text-gray-900 font-bold"

// Colors
className="bg-blue-600 hover:bg-blue-700"

// Responsive
className="grid md:grid-cols-2 lg:grid-cols-3"

// Spacing
className="p-4 md:p-8 mb-6"
```

## 🐛 Debugging Guide

### Backend Debugging

1. **Check server is running**
   ```powershell
   # Should see: "Server is running on http://localhost:5000"
   # And: "✓ Database initialization completed successfully"
   ```

2. **Check logs in terminal**
   - Errors appear in red
   - Check console.error() calls

3. **Check database directly**
   - Open phpMyAdmin
   - Query tables directly
   - Verify data was inserted

4. **Test endpoints with Postman or curl**
   ```powershell
   # Test login
   curl -X POST http://localhost:5000/api/auth/login `
     -H "Content-Type: application/json" `
     -d "{\"email\":\"demo@typeflow.com\",\"password\":\"demo123\"}"
   ```

### Frontend Debugging

1. **Check browser console** (F12)
   - Errors in red
   - Check Network tab
   - Check Application tab for localStorage

2. **Check token is being sent**
   - Network tab → XHR requests
   - Headers tab
   - Look for Authorization: Bearer token

3. **Check component rendering**
   - React DevTools extension
   - Inspect components
   - Check props and state

4. **Clear browser cache**
   ```
   F12 → Application → Clear All
   ```

## 📈 Performance Optimization Ideas

1. **Database**: Add more indexes
2. **Caching**: Redis for frequently accessed data
3. **Pagination**: Already implemented
4. **Image optimization**: Lazy load images
5. **Code splitting**: Split components
6. **Database queries**: Add query caching
7. **API responses**: Compress with gzip

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET
- [ ] Update database credentials
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for domain
- [ ] Set up environment variables
- [ ] Test all features
- [ ] Configure database backups
- [ ] Set up monitoring/logging
- [ ] Use process manager (PM2)

## 📚 Code Style & Best Practices

### Backend (JavaScript)
```javascript
// Use const/let, not var
const pool = require('../config/database');

// Use async/await
async function getData() {
  try {
    const data = await connection.execute(sql);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Use prepared statements
const [rows] = await connection.execute(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

// Validate input
if (!email || !password) {
  return res.status(400).json({ error: 'Missing required fields' });
}
```

### Frontend (React/JSX)
```jsx
// Use hooks
const [state, setState] = useState(null);
const { isAuthenticated } = useAuth();

// Use proper naming
const handleSubmit = (e) => { /* ... */ }
const formatDate = (date) => { /* ... */ }

// Use conditional rendering
{isAuthenticated ? <Dashboard /> : <Login />}

// Use Tailwind classes
className="text-blue-600 hover:text-blue-700 transition"

// Destructure props
const { user, token } = props;
```

## 🔗 API Contract Examples

### Save Test Request
```json
{
  "wpm": 75.5,
  "accuracy": 96.2,
  "mistakes": 2,
  "typedText": "...",
  "duration": 30
}
```

### Save Test Response
```json
{
  "message": "Test result saved successfully",
  "testId": 123,
  "improved": true,
  "comparison": {
    "previousWpm": 72.3,
    "previousAccuracy": 96.1,
    "wpmImproved": true,
    "accuracyImproved": true,
    "wpmDifference": 3.2,
    "accuracyDifference": 0.1
  }
}
```

### Get History Response
```json
{
  "message": "Test history retrieved successfully",
  "results": [
    {
      "id": 123,
      "wpm": 75.5,
      "accuracy": 96.2,
      "mistakes": 2,
      "typedText": "...",
      "duration": 30,
      "improved": true,
      "createdAt": "2025-11-26T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

## 🎓 Learning Path

1. **Start**: Read `server/schema.sql` to understand data structure
2. **Then**: Read `server/routes/auth.js` to understand signup/login
3. **Then**: Read `server/routes/tests.js` to understand test endpoints
4. **Then**: Read `src/pages/TypingTest.jsx` to understand frontend
5. **Finally**: Read `src/pages/History.jsx` to understand dashboard

## 💡 Extension Ideas

1. **Multi-language support**: Add language field to users
2. **Difficulty levels**: Easy/Medium/Hard paragraphs
3. **Social features**: Share results, follow users
4. **Achievements**: Badges for milestones
5. **Coaching**: Tips based on performance
6. **Mobile app**: React Native version
7. **Real-time multiplayer**: WebSocket racing
8. **Voice feedback**: Audio pronunciation guide

---

**Happy coding!** 🚀

Questions? Check the documentation files or review the source code comments.
