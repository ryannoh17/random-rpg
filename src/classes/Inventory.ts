import { Profile, type ProfileType } from "../schemas/profile.js";
import itemIndex from "../itemIndex.json" with { type: "json" }

export type ItemInfo = typeof itemIndex.items[0];
export interface Item {
  itemInfo: ItemInfo;
  quantity: number;
}

export class Inventory {
  items: Item[][];

  constructor(playerProfile: ProfileType) {
    this.items = playerProfile.inventory;
  }
}
