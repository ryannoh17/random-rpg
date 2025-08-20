const { Schema, model } = require('mongoose');

const profileScehma = new Schema({
  userId: String,
  tag: String,
  guildId: String,
  maxHealth: { type: Number, default: 100 },
  health: { type: Number, default: 100 },
  maxMana: { type: Number, default: 0 },
  mana: { type: Number, default: 0 },
  strength: { type: Number, default: 10 },
  stamina: { type: Number, default: 5 },
  defense: { type: Number, default: 0 },
  wisdom: { type: Number, default: 0 },
  intelligence: { type: Number, default: 0 },
  agility: { type: Number, default: 0 },
  statPoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  exp: { type: Number, default: 0 },
  maxExp: { type: Number, default: 100 },
  monster: Object,
  isFighting: { type: Boolean, default: false },
  inventory: { type: Array, default: [[],[],[]] },
  coins: { type: Number, default: 0 }
});

// wisdom, intelligence, strength, endurance, stamina, agility 

module.exports = model('Profile', profileScehma, 'profiles');
