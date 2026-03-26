import { EmbedBuilder, type APIEmbedField, ButtonInteraction } from "discord.js";
import { shopItemsArray } from "../commands/game/shop.js";
import { type ItemType } from "../schemas/item.js"

export class Inventory {
  items: ItemType[][];
  coins: number;

  constructor(items: ItemType[][], coins: number) {
    this.items = items;
    this.coins = coins;
  }

  private async addItem(invIndex: number, itemToAdd: ItemType): Promise<void> {
    let invSegment = this.items[invIndex];

    if (!invSegment) throw new Error("invIndex out of inventory bounds");

    let itemIndex = invSegment.findIndex((currItem) => currItem.id === itemToAdd.id);

    if (itemIndex === -1) {
      invSegment.push(itemToAdd);
    } else {
      if (invSegment[itemIndex]) {
        invSegment[itemIndex].quantity += itemToAdd.quantity;
      }
    }
  }

  async addToInventory(itemsToAdd: ItemType[]): Promise<void> {
    for (const currItem of itemsToAdd) {
      switch (currItem.type) {
        case "material":
          this.addItem(0, currItem);
          break;
        case "potion":
          this.addItem(1, currItem);
          break;
        case "equipment":
          this.addItem(2, currItem);
          break;
      }
    }
  }

  private mapInventorySection(sectionIndex: number) {
    const sectionArray = this.items[sectionIndex]!.map((item) => {
      if (item.quantity > 1) {
        return `${item.name} x${item.quantity}`;
      }
      return item.name;
    });

    return sectionArray;
  }

  createInvEmbed(coins: number) {
    const coinAmount = coins;

    const embed = new EmbedBuilder()
      .setTitle(`Inventory`)
      .setThumbnail('https://i.stack.imgur.com/Fzh0w.png')
      .addFields([
        {
          name: 'Coins',
          value: `${coinAmount}`,
        },
        {
          name: 'Materials',
          value: `\u200B`,
          inline: true,
        },
        {
          name: 'Potions',
          value: `\u200B`,
          inline: true,
        },
        {
          name: 'Equipment',
          value: `\u200B`,
          inline: true,
        },
      ]);

    if (this.items[0]!.length > 0) {
      embed.spliceFields(1, 1, {
        name: 'Materials',
        value: `${this.mapInventorySection(0)}`,
        inline: true,
      });
    }
    if (this.items[1]!.length > 0) {
      embed.spliceFields(2, 1, {
        name: 'Potions',
        value: `${this.mapInventorySection(1)}`,
        inline: true,
      });
    }
    if (this.items[2]!.length > 0) {
      embed.spliceFields(3, 1, {
        name: 'Equipment',
        value: `${this.mapInventorySection(2)}`,
        inline: true,
      });
    }

    return embed;
  }

  // fields are the headers of sections in the embed
  private getShopFieldIndex(fields: APIEmbedField[]) {
    let invIndex = -1;
    for (let i = 1; i < fields.length; i++) {
      if (fields[i]!.name.includes('_')) {
        invIndex = i;
      }
    }

    if (invIndex === -1) throw new Error('No underlined field exists');

    return invIndex;
  }

  async buySome(interaction: ButtonInteraction, buyQuantity: number, coins: number) {
    const { message } = interaction;
    const oldEmbed = message.embeds[0]!;
    const { fields } = oldEmbed;

    const shopFieldIndex = this.getShopFieldIndex(fields);
    const { name, value } = fields[shopFieldIndex] ?? (() => {
      throw new Error(`field with index [ ${shopFieldIndex} ] does not exist`);
    })();
    const shopItemList = value.split('\n');

    const shopItemIndex = shopItemList.findIndex((item) => item.includes('*'));
    if (shopItemIndex === -1) throw new Error("ADD EXCEPTION HANDLING TO THIS")

    const shopEmbedItemName = shopItemList[shopItemIndex];

    const selectedItem = shopItemsArray.find((item) => item!.name === shopEmbedItemName);
    const { price } = selectedItem ?? (() => {
      throw new Error(`could not find item with name [ ${shopEmbedItemName} ] in [ shopItemsArray ]`)
    })();

    // bruh how do i efficiently find it in inventory
    let { quantity: invQuantity } = this.items[shopFieldIndex - 1]!.find(
      (item) => item.name === shopEmbedItemName
    ) ?? { quantity: -1 };

    if (invQuantity === -1) {
      // maybe make it throw error
      console.log('item does not exist in inventory');
      invQuantity = 0;
    }

    if (price > coins) {
      // figure something out the player can see
      console.log('item costs too much');
      return null;
    }

    const newQuantity = invQuantity + buyQuantity;

    const coinCount = coins - price * buyQuantity;
    selectedItem.quantity = newQuantity;

    // turns invetory into list for embed
    const nameList = this.items[shopFieldIndex - 1]!.map((item) => {
      if (item.quantity > 1) {
        return `${item.name} x${item.quantity}`;
      }
      return item.name;
    });

    nameList[shopItemIndex] = `**${nameList[shopItemIndex]}**`;
    let newItems;
    let newEmbed;

    if (nameList.length > 0) {
      newItems = nameList.join('\n');

      newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(shopFieldIndex, 1, {
          name: `${name}`,
          value: `${newItems}`,
          inline: true,
        })
        .spliceFields(0, 1, {
          name: 'Coins',
          value: `${coinCount}`,
        });
    } else {
      newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(shopFieldIndex, 1, {
          name: `${name}`,
          value: `\u200B`,
          inline: true,
        })
        .spliceFields(0, 1, {
          name: 'Coins',
          value: `${coinCount}`,
        });
    }

    // await Profile.findOneAndUpdate(
    //   { _id: storedProfile._id },
    //   {
    //     inventory,
    //     coins: coinCount,
    //   }
    // );

    coins = coinCount;

    return newEmbed;
  }

}