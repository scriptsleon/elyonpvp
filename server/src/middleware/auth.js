const { checkUserRole } = require('../config/discord-bot');

// Check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

// Check if user is admin (by Discord role)
async function isAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
  
  if (!adminRoleId) {
    console.error('DISCORD_ADMIN_ROLE_ID not configured');
    return res.status(500).json({ error: 'Admin role not configured' });
  }

  try {
    const hasAdminRole = await checkUserRole(req.user.discord_id, adminRoleId);
    
    if (hasAdminRole) {
      return next();
    }
    
    res.status(403).json({ error: 'Admin access required' });
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ error: 'Failed to verify admin role' });
  }
}

module.exports = {
  isAuthenticated,
  isAdmin
};
