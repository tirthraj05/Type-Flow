const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

// Save test result
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { wpm, accuracy, mistakes, typed_text, duration_seconds, device_info } = req.body;
    const userId = req.user.id;

    // Validation
    if (wpm === undefined || accuracy === undefined || mistakes === undefined || !typed_text || !duration_seconds) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Validate ranges
    if (wpm < 0 || wpm > 300) {
      return res.status(400).json({ error: 'WPM must be between 0 and 300' });
    }
    if (accuracy < 0 || accuracy > 100) {
      return res.status(400).json({ error: 'Accuracy must be between 0 and 100' });
    }
    if (mistakes < 0) {
      return res.status(400).json({ error: 'Mistakes cannot be negative' });
    }
    if (duration_seconds < 1) {
      return res.status(400).json({ error: 'Duration must be at least 1 second' });
    }

    const connection = await pool.getConnection();

    try {
      // Get previous test for comparison
      const [previousTests] = await connection.execute(
        'SELECT wpm, accuracy FROM test_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      let improved = false;
      let comparison = null;

      if (previousTests.length > 0) {
        const previous = previousTests[0];
        const wpmImproved = wpm > previous.wpm;
        const accuracyNotWorsened = accuracy >= previous.accuracy - 2; // Allow 2% tolerance

        // Consider improved if WPM increased significantly or if WPM stayed same but accuracy improved
        improved = wpmImproved || (Math.abs(wpm - previous.wpm) < 2 && accuracy > previous.accuracy);

        comparison = {
          previousWpm: parseFloat(previous.wpm),
          previousAccuracy: parseFloat(previous.accuracy),
          wpmImproved,
          accuracyImproved: accuracy > previous.accuracy,
          wpmDifference: parseFloat((wpm - previous.wpm).toFixed(2)),
          accuracyDifference: parseFloat((accuracy - previous.accuracy).toFixed(2)),
        };
      }

      // Sanitize typed text (remove potentially harmful content)
      const sanitizedText = typed_text.substring(0, 50000); // Limit to 50k chars

      // Save test result with improved flag and device info
      const [result] = await connection.execute(
        'INSERT INTO test_results (user_id, wpm, accuracy, mistakes, typed_text, duration_seconds, improved, device_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, wpm, accuracy, mistakes, sanitizedText, duration_seconds, improved ? 1 : 0, device_info || null]
      );

      const testId = result.insertId;

      connection.release();

      res.status(201).json({
        message: 'Test result saved successfully',
        testId,
        improved,
        comparison,
        encouragementMessage: improved 
          ? 'Nice! Your WPM improved — great progress!' 
          : (comparison && comparison.wpmDifference < -5) 
            ? 'Good effort — keep practicing!' 
            : 'Keep it up! Consistency is key to improvement.',
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Save test error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all test results for logged-in user with pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10)); // Max 100 per page
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();

    try {
      // Get total count
      const [countResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM test_results WHERE user_id = ?',
        [userId]
      );
      const total = countResult[0].total;

      // Get paginated results
      const [results] = await connection.execute(
        'SELECT id, wpm, accuracy, mistakes, typed_text, duration_seconds, improved, device_info, created_at FROM test_results WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [userId, limit, offset]
      );

      connection.release();

      const formattedResults = results.map((r) => ({
        id: r.id,
        wpm: parseFloat(r.wpm),
        accuracy: parseFloat(r.accuracy),
        mistakes: r.mistakes,
        typedText: r.typed_text.substring(0, 100) + (r.typed_text.length > 100 ? '...' : ''),
        duration: r.duration_seconds,
        improved: Boolean(r.improved),
        deviceInfo: r.device_info,
        createdAt: new Date(r.created_at).toISOString(),
        localDate: new Date(r.created_at).toLocaleString('en-US', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }),
      }));

      res.json({
        message: 'Test history retrieved successfully',
        results: formattedResults,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single test detail
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const testId = req.params.id;

    const connection = await pool.getConnection();

    try {
      const [results] = await connection.execute(
        'SELECT id, wpm, accuracy, mistakes, typed_text, duration_seconds, improved, device_info, created_at FROM test_results WHERE id = ? AND user_id = ?',
        [testId, userId]
      );

      connection.release();

      if (results.length === 0) {
        return res.status(404).json({ error: 'Test not found' });
      }

      const test = results[0];
      res.json({
        id: test.id,
        wpm: parseFloat(test.wpm),
        accuracy: parseFloat(test.accuracy),
        mistakes: test.mistakes,
        typedText: test.typed_text,
        duration: test.duration_seconds,
        improved: Boolean(test.improved),
        deviceInfo: test.device_info,
        createdAt: new Date(test.created_at).toISOString(),
        localDate: new Date(test.created_at).toLocaleString('en-US', { 
          dateStyle: 'full', 
          timeStyle: 'long' 
        }),
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Get test detail error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export test history as CSV
router.get('/export/csv', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const connection = await pool.getConnection();

    try {
      const [results] = await connection.execute(
        'SELECT wpm, accuracy, mistakes, typed_text, duration_seconds, improved, device_info, created_at FROM test_results WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );

      connection.release();

      // Create CSV content
      let csv = 'Date,Time,WPM,Accuracy,Mistakes,Duration (seconds),Improved,Device,Typed Text\n';
      
      results.forEach((r) => {
        const date = new Date(r.created_at);
        const dateStr = date.toLocaleDateString('en-US');
        const timeStr = date.toLocaleTimeString('en-US');
        const typedText = r.typed_text.replace(/"/g, '""').replace(/\n/g, ' ');
        
        csv += `"${dateStr}","${timeStr}",${r.wpm},${r.accuracy},${r.mistakes},${r.duration_seconds},${r.improved ? 'Yes' : 'No'},"${r.device_info || 'N/A'}","${typedText}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="typeflow-history-${Date.now()}.csv"`);
      res.send(csv);
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get statistics for dashboard
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const connection = await pool.getConnection();

    try {
      // Get overall statistics
      const [stats] = await connection.execute(
        `SELECT 
          COUNT(*) as totalTests,
          AVG(wpm) as avgWpm,
          MAX(wpm) as maxWpm,
          AVG(accuracy) as avgAccuracy,
          MAX(accuracy) as maxAccuracy,
          SUM(CASE WHEN improved = 1 THEN 1 ELSE 0 END) as improvementCount
        FROM test_results WHERE user_id = ?`,
        [userId]
      );

      connection.release();

      const statData = stats[0];
      res.json({
        message: 'Statistics retrieved successfully',
        stats: {
          totalTests: statData.totalTests,
          avgWpm: parseFloat(statData.avgWpm) || 0,
          maxWpm: parseFloat(statData.maxWpm) || 0,
          avgAccuracy: parseFloat(statData.avgAccuracy) || 0,
          maxAccuracy: parseFloat(statData.maxAccuracy) || 0,
          improvementCount: statData.improvementCount || 0,
        },
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
