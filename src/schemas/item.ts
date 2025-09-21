import { Schema } from "mongoose";

export const ItemSchema = new Schema({
  itemInfo: {
    name: { type: String },
    id: Number,
    type: String,
    price: Number,
    description: String
  },
  quantity: { type: Number }
}, { _id: false });