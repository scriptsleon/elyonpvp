const express = require('express');
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all published news (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, title, content, image_url, created_at, updated_at FROM news WHERE published = 1 ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get all news including drafts (admin only)
router.get('/all', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT n.*, u.username as author_name 
       FROM news n 
       LEFT JOIN users u ON n.author_id = u.id 
       ORDER BY n.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Create news (admin only)
router.post('/', isAdmin, async (req, res) => {
  const { title, content, image_url, published } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO news (title, content, image_url, published, author_id) VALUES (?, ?, ?, ?, ?)',
      [title, content, image_url || null, published ? 1 : 0, req.user.id]
    );

    res.json({ 
      id: result.insertId, 
      message: 'News created successfully' 
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Failed to create news' });
  }
});

// Update news (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, content, image_url, published } = req.body;

  try {
    await db.execute(
      'UPDATE news SET title = ?, content = ?, image_url = ?, published = ?, updated_at = NOW() WHERE id = ?',
      [title, content, image_url || null, published ? 1 : 0, id]
    );

    res.json({ message: 'News updated successfully' });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// Delete news (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM news WHERE id = ?', [id]);
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// Toggle publish status (admin only)
router.post('/:id/toggle-publish', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute(
      'UPDATE news SET published = NOT published, updated_at = NOW() WHERE id = ?',
      [id]
    );
    res.json({ message: 'Publish status toggled' });
  } catch (error) {
    console.error('Error toggling publish:', error);
    res.status(500).json({ error: 'Failed to toggle publish status' });
  }
});

module.exports = router;
