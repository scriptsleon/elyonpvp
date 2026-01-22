const express = require('express');
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');
const { createNewsEmbed, sendEmbedToChannel } = require('../config/discord-bot');
const router = express.Router();

// Send news to Discord via webhook (admin only)
router.post('/webhook/news', isAdmin, async (req, res) => {
  const { newsId } = req.body;

  if (!newsId) {
    return res.status(400).json({ error: 'News ID is required' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Discord webhook not configured' });
  }

  try {
    // Get news from database
    const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [newsId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }

    const news = rows[0];

    // Send to webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `📰 ${news.title}`,
          description: news.content,
          color: 0xD4A853, // Gold
          timestamp: new Date().toISOString(),
          footer: { text: 'Elyon PvP - Novinky' },
          image: news.image_url ? { url: news.image_url } : undefined
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Webhook request failed');
    }

    res.json({ message: 'News sent to Discord' });
  } catch (error) {
    console.error('Error sending to webhook:', error);
    res.status(500).json({ error: 'Failed to send to Discord' });
  }
});

// Send news to Discord via bot (admin only)
router.post('/bot/news', isAdmin, async (req, res) => {
  const { newsId, channelId } = req.body;

  if (!newsId || !channelId) {
    return res.status(400).json({ error: 'News ID and channel ID are required' });
  }

  try {
    // Get news from database
    const [rows] = await db.execute('SELECT * FROM news WHERE id = ?', [newsId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }

    const news = rows[0];
    const embed = createNewsEmbed(news.title, news.content, req.user.username);
    
    const success = await sendEmbedToChannel(channelId, embed);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to send via bot' });
    }

    res.json({ message: 'News sent via Discord bot' });
  } catch (error) {
    console.error('Error sending via bot:', error);
    res.status(500).json({ error: 'Failed to send to Discord' });
  }
});

// Send custom message to Discord channel via bot (admin only)
router.post('/bot/message', isAdmin, async (req, res) => {
  const { channelId, message } = req.body;

  if (!channelId || !message) {
    return res.status(400).json({ error: 'Channel ID and message are required' });
  }

  try {
    const { sendToChannel } = require('../config/discord-bot');
    const success = await sendToChannel(channelId, message);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to send message' });
    }

    res.json({ message: 'Message sent' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
