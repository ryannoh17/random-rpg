import { Schema, model } from 'mongoose';

type GuildType = {
  guildId: string,
  guildName: string,
  guildIcon?: string,
}

const guildSchema = new Schema<GuildType>({
  guildId: String,
  guildName: String,
  guildIcon: { type: String, required: false },
});

export const GuildModel = model('Guild', guildSchema, 'guilds');

// why am i saving guild data xdd

// js duplicate
// const { Schema, model } = require('mongoose');

// const guildScehma = new Schema({
//   guildId: String,
//   guildName: String,
//   guildIcon: { type: String, required: false },
// });

// module.exports = model('Guild', guildScehma, 'guilds');