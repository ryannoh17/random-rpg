import { Schema, type InferSchemaType } from "mongoose";

export const MonsterSchema = new Schema({
  name: { type: String, required: true },
  maxHealth: { type: Number, required: true },
  health: { type: Number, required: true },
  attack: { type: Number, required: true },
  drops: { type: [String], required: true },
  level: { type: Number, required: true },
  zone: { type: String, required: true, enum: ['Dummy', 'Sunlit Meadow', 'Greenwood'] }
}, { _id: false });

export type MonsterType = InferSchemaType<typeof MonsterSchema>;