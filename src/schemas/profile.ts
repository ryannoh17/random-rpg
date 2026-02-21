import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { MonsterSchema } from "./monster.js"
import { ItemSchema } from "./item.js";

const profileScehma = new Schema({
  userID: { type: String, required: true },
  tag: { type: String, required: true },
  guildID: { type: String, required: true },
  maxHealth: { type: Number, default: 100, required: true },
  health: { type: Number, default: 100, required: true },
  maxMana: { type: Number, default: 0, required: true },
  mana: { type: Number, default: 0, required: true },
  strength: { type: Number, default: 10, required: true },
  stamina: { type: Number, default: 5, required: true },
  defense: { type: Number, default: 0, required: true },
  wisdom: { type: Number, default: 0, required: true },
  intelligence: { type: Number, default: 0, required: true },
  agility: { type: Number, default: 0, required: true },
  statPoints: { type: Number, default: 0, required: true },
  level: { type: Number, default: 1, required: true },
  exp: { type: Number, default: 0, required: true },
  maxExp: { type: Number, default: 100, required: true },
  monster: { type: MonsterSchema, default: null, required: true },
  isFighting: { type: Boolean, default: false, required: true },
  inventory: { type: [[ItemSchema]], default: [[],[],[]], required: true },
  coins: { type: Number, default: 0, required: true }
});

// wisdom, intelligence, strength, endurance, stamina, agility 

export type ProfileType = InferSchemaType<typeof profileScehma>;
export type ProfileDocType = HydratedDocument<ProfileType>;

export const Profile = model<ProfileDocType>('Profile', profileScehma);
