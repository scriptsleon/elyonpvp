const express = require('express');
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all published wiki articles (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, title, slug, content, category, created_at, updated_at 
       FROM wiki_articles 
       WHERE published = 1 
       ORDER BY category, title`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching wiki:', error);
    res.status(500).json({ error: 'Failed to fetch wiki articles' });
  }
});

// Get wiki article by slug (public)
router.get('/article/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM wiki_articles WHERE slug = ? AND published = 1',
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Get all wiki articles including drafts (admin only)
router.get('/all', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT wa.*, u.username as author_name 
       FROM wiki_articles wa 
       LEFT JOIN users u ON wa.author_id = u.id 
       ORDER BY wa.category, wa.title`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all wiki:', error);
    res.status(500).json({ error: 'Failed to fetch wiki articles' });
  }
});

// Create wiki article (admin only)
router.post('/', isAdmin, async (req, res) => {
  const { title, slug, content, category, published } = req.body;

  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'Title, slug and content are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO wiki_articles (title, slug, content, category, published, author_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, content, category || 'Obecné', published ? 1 : 0, req.user.id]
    );

    res.json({ 
      id: result.insertId, 
      message: 'Article created successfully' 
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update wiki article (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, category, published } = req.body;

  try {
    await db.execute(
      'UPDATE wiki_articles SET title = ?, slug = ?, content = ?, category = ?, published = ?, updated_at = NOW() WHERE id = ?',
      [title, slug, content, category || 'Obecné', published ? 1 : 0, id]
    );

    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete wiki article (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM wiki_articles WHERE id = ?', [id]);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router;
