import { Schema, model } from 'mongoose';

export type GuildType = {
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