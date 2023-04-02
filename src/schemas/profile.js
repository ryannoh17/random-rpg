const { Schema, model } = require('mongoose');

const profileScehma = new Schema({
  userId: String,
  tag: String,
  guildId: String,
  maxHealth: { type: Number, default: 10 },
  health: { type: Number, default: 10 },
  attack: { type: Number, default: 2 },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  maxExp: { type: Number, default: 100 },
  monster: Object,
  isFighting: { type: Boolean, default: false },
  inventory: { type: Array, default: [] },
  coins: { type: Number, default: 0 }
});

module.exports = model('Profile', profileScehma, 'profiles');
