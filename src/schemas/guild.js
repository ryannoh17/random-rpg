const { Schema, model } = require('mongoose');

const guildScehma = new Schema({
  guildId: String,
  guildName: String,
  guildIcon: { type: String, required: false },
});

module.exports = model('Guild', guildScehma, 'guilds');
