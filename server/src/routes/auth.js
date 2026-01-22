const express = require('express');
const passport = require('passport');
const { checkUserRole } = require('../config/discord-bot');
const router = express.Router();

// Discord OAuth login
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth callback
router.get('/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: `${process.env.FRONTEND_URL}/?error=auth_failed`
  }),
  (req, res) => {
    // Successful authentication
    res.redirect(`${process.env.FRONTEND_URL}/?auth=success`);
  }
);

// Get current user
router.get('/me', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ user: null, isAdmin: false });
  }

  try {
    const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
    let isAdmin = false;

    if (adminRoleId) {
      isAdmin = await checkUserRole(req.user.discord_id, adminRoleId);
    }

    res.json({
      user: {
        id: req.user.id,
        discord_id: req.user.discord_id,
        username: req.user.username,
        avatar: req.user.avatar,
        email: req.user.email
      },
      isAdmin
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

module.exports = router;
