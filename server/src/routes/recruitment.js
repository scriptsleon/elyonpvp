const express = require('express');
const db = require('../config/database');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { createRecruitmentEmbed, sendEmbedToChannel } = require('../config/discord-bot');
const router = express.Router();

// Submit recruitment application (authenticated users)
router.post('/', isAuthenticated, async (req, res) => {
  const { age, experience, motivation, availability, previous_experience } = req.body;

  if (!age || !experience) {
    return res.status(400).json({ error: 'Age and experience are required' });
  }

  try {
    // Check if user already has pending application
    const [existing] = await db.execute(
      'SELECT id FROM recruitment_applications WHERE user_id = ? AND status = "pending"',
      [req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'You already have a pending application' });
    }

    const [result] = await db.execute(
      `INSERT INTO recruitment_applications 
       (user_id, discord_username, age, experience, motivation, availability, previous_experience) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        req.user.username,
        age,
        experience,
        motivation || null,
        availability || null,
        previous_experience || null
      ]
    );

    // Send notification to Discord (optional - configure DISCORD_RECRUITMENT_CHANNEL_ID)
    if (process.env.DISCORD_RECRUITMENT_CHANNEL_ID) {
      const embed = createRecruitmentEmbed({
        discord_username: req.user.username,
        age,
        experience
      });
      await sendEmbedToChannel(process.env.DISCORD_RECRUITMENT_CHANNEL_ID, embed);
    }

    res.json({ 
      id: result.insertId, 
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get all applications (admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT ra.*, u.username, u.avatar, u.discord_id 
       FROM recruitment_applications ra 
       LEFT JOIN users u ON ra.user_id = u.id 
       ORDER BY ra.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status (admin only)
router.put('/:id/status', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await db.execute(
      'UPDATE recruitment_applications SET status = ?, admin_notes = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?',
      [status, admin_notes || null, req.user.id, id]
    );

    res.json({ message: `Application ${status}` });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Delete application (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM recruitment_applications WHERE id = ?', [id]);
    res.json({ message: 'Application deleted' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router;
