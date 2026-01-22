const express = require('express');
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all commands (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, command, description, category, usage_example FROM commands ORDER BY category, command'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching commands:', error);
    res.status(500).json({ error: 'Failed to fetch commands' });
  }
});

// Create command (admin only)
router.post('/', isAdmin, async (req, res) => {
  const { command, description, category, usage_example } = req.body;

  if (!command || !description) {
    return res.status(400).json({ error: 'Command and description are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO commands (command, description, category, usage_example) VALUES (?, ?, ?, ?)',
      [command, description, category || 'Obecné', usage_example || null]
    );

    res.json({ 
      id: result.insertId, 
      message: 'Command created successfully' 
    });
  } catch (error) {
    console.error('Error creating command:', error);
    res.status(500).json({ error: 'Failed to create command' });
  }
});

// Update command (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { command, description, category, usage_example } = req.body;

  try {
    await db.execute(
      'UPDATE commands SET command = ?, description = ?, category = ?, usage_example = ? WHERE id = ?',
      [command, description, category || 'Obecné', usage_example || null, id]
    );

    res.json({ message: 'Command updated successfully' });
  } catch (error) {
    console.error('Error updating command:', error);
    res.status(500).json({ error: 'Failed to update command' });
  }
});

// Delete command (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM commands WHERE id = ?', [id]);
    res.json({ message: 'Command deleted successfully' });
  } catch (error) {
    console.error('Error deleting command:', error);
    res.status(500).json({ error: 'Failed to delete command' });
  }
});

module.exports = router;
