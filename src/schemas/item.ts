import { Schema, type InferSchemaType } from "mongoose";

export const ItemSchema = new Schema({
  name: { type: String, required: true },
  id: { type: Number, required: true },
  type: { type: String, required: true, enum: ['material', 'potion', 'equipment'] },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

export type ItemType = InferSchemaType<typeof ItemSchema>;