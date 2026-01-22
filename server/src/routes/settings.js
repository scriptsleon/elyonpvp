const express = require('express');
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get public settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT setting_key, setting_value FROM site_settings WHERE is_public = 1'
    );
    
    // Convert to object
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get all settings (admin only)
router.get('/all', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM site_settings');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update setting (admin only)
router.put('/:key', isAdmin, async (req, res) => {
  const { key } = req.params;
  const { value, is_public } = req.body;

  try {
    // Upsert setting
    await db.execute(
      `INSERT INTO site_settings (setting_key, setting_value, is_public) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE setting_value = ?, is_public = ?, updated_at = NOW()`,
      [key, value, is_public ? 1 : 0, value, is_public ? 1 : 0]
    );

    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Bulk update settings (admin only)
router.post('/bulk', isAdmin, async (req, res) => {
  const { settings } = req.body;

  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Settings object is required' });
  }

  try {
    for (const [key, value] of Object.entries(settings)) {
      await db.execute(
        `INSERT INTO site_settings (setting_key, setting_value, is_public) 
         VALUES (?, ?, 1) 
         ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = NOW()`,
        [key, String(value), String(value)]
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
