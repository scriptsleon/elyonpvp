const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Discord bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

let isReady = false;

// Login bot
if (process.env.DISCORD_BOT_TOKEN) {
  client.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => {
      console.log('✅ Discord bot logged in');
      isReady = true;
    })
    .catch(err => {
      console.error('❌ Discord bot login failed:', err.message);
    });
} else {
  console.log('⚠️ DISCORD_BOT_TOKEN not set - bot features disabled');
}

// Check if user has admin role
async function checkUserRole(userId, roleId) {
  if (!isReady) return false;
  
  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
    const member = await guild.members.fetch(userId);
    return member.roles.cache.has(roleId);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

// Send message to channel
async function sendToChannel(channelId, content) {
  if (!isReady) {
    console.log('Bot not ready, skipping message');
    return false;
  }
  
  try {
    const channel = await client.channels.fetch(channelId);
    await channel.send(content);
    return true;
  } catch (error) {
    console.error('Error sending to channel:', error);
    return false;
  }
}

// Send embed to channel
async function sendEmbedToChannel(channelId, embed) {
  if (!isReady) return false;
  
  try {
    const channel = await client.channels.fetch(channelId);
    await channel.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error('Error sending embed:', error);
    return false;
  }
}

// Create news embed
function createNewsEmbed(title, content, author) {
  return new EmbedBuilder()
    .setColor(0xD4A853) // Gold color
    .setTitle(`📰 ${title}`)
    .setDescription(content)
    .setAuthor({ name: author || 'Elyon PvP' })
    .setTimestamp()
    .setFooter({ text: 'Elyon PvP - Novinky' });
}

// Create recruitment embed
function createRecruitmentEmbed(application) {
  return new EmbedBuilder()
    .setColor(0x5865F2) // Discord blue
    .setTitle('📋 Nová přihláška do Admin Teamu')
    .addFields(
      { name: 'Discord', value: application.discord_username, inline: true },
      { name: 'Věk', value: String(application.age), inline: true },
      { name: 'Zkušenosti', value: application.experience || 'Neuvedeno' }
    )
    .setTimestamp()
    .setFooter({ text: 'Elyon PvP - Nábory' });
}

module.exports = {
  client,
  checkUserRole,
  sendToChannel,
  sendEmbedToChannel,
  createNewsEmbed,
  createRecruitmentEmbed
};
