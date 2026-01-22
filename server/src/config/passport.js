const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const db = require('./database');

const scopes = ['identify', 'email', 'guilds', 'guilds.members.read'];

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: scopes
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists in database
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE discord_id = ?',
      [profile.id]
    );

    let user;
    
    if (rows.length === 0) {
      // Create new user
      const [result] = await db.execute(
        `INSERT INTO users (discord_id, username, discriminator, avatar, email, access_token, refresh_token) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          profile.id,
          profile.username,
          profile.discriminator || '0',
          profile.avatar,
          profile.email || null,
          accessToken,
          refreshToken
        ]
      );
      
      user = {
        id: result.insertId,
        discord_id: profile.id,
        username: profile.username,
        avatar: profile.avatar,
        email: profile.email
      };
    } else {
      // Update existing user
      await db.execute(
        `UPDATE users SET username = ?, discriminator = ?, avatar = ?, email = ?, 
         access_token = ?, refresh_token = ?, updated_at = NOW() WHERE discord_id = ?`,
        [
          profile.username,
          profile.discriminator || '0',
          profile.avatar,
          profile.email || null,
          accessToken,
          refreshToken,
          profile.id
        ]
      );
      user = rows[0];
    }

    // Fetch user's roles from Discord guild
    user.guilds = profile.guilds || [];
    user.accessToken = accessToken;
    
    return done(null, user);
  } catch (error) {
    console.error('Passport error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.discord_id);
});

passport.deserializeUser(async (discordId, done) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE discord_id = ?',
      [discordId]
    );
    
    if (rows.length === 0) {
      return done(null, false);
    }
    
    done(null, rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
