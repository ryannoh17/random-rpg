import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { Monster } from "../classes/monster.js"
import type { Item } from "../classes/Inventory.js";
import { ItemSchema } from "./item.js";

const profileScehma = new Schema({
  userID: { type: Number, required: true },
  tag: { type: String, required: true },
  guildID: { type: Number, required: true },
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
  monster: { type: Monster, default: null },
  isFighting: { type: Boolean, default: false },
  inventory: { type: ItemSchema[][], default: [[],[],[]] },
  coins: { type: Number, default: 0 }
});

// wisdom, intelligence, strength, endurance, stamina, agility 

export type ProfileType = InferSchemaType<typeof profileScehma>;
export type ProfileDocType = HydratedDocument<ProfileType>;

export const Profile = model<ProfileDocType>('Profile', profileScehma);
