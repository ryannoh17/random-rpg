import { EmbedBuilder, type APIEmbedField, ButtonInteraction } from "discord.js";
import { shopItemsArray } from "../commands/game/shop.js";
import { type ItemType } from "../schemas/item.js"
import { itemArray as allItemsArray } from "../items.js";

export class Inventory {
  items: ItemType[][];
  coins: number;

  constructor(items: ItemType[][], coins: number) {
    this.items = items;
    this.coins = coins;
  }

  // adds specified quantity of items to a section of the inventory
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

  // loops through all items in array and adds to inventory in the correct segments
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

  // turns inventory items into a string array so it can be printed
  private mapInventorySection(sectionIndex: number): string[] {
    const sectionArray = this.items[sectionIndex]!.map((item) => {
      if (item.quantity > 1) {
        return `${item.name} x${item.quantity}`;
      }
      return item.name;
    });

    return sectionArray;
  }

  createInvEmbed() {
    const coinAmount = this.coins;

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
  static getShopItemsFieldIndex(fields: APIEmbedField[]) {
    let invIndex = -1;
    for (let i = 1; i < fields.length; i++) {
      if (fields[i]!.name.includes('_')) {
        invIndex = i;
      }
    }

    if (invIndex === -1) throw new Error('No underlined field exists');

    return invIndex;
  }

  // MIGHT BE UNNEEDED
  static getCoinsFieldIndex(fields: APIEmbedField[]) {
    let invIndex = -1;
    for (let i = 1; i < fields.length; i++) {
      if (fields[i]!.name === 'Coins') {
        invIndex = i;
      }
    }

    if (invIndex === -1) throw new Error('No [ Coins ] field exists');

    return invIndex;
  }

  // CHANGE THIS SHIT U DONT NEED IT KINDA
  // should just have buttons change a number than have a button that takes that number
  // and adds or subtracts that from inventory (confirm button)
  /*
  get embed from button interaction
  find the item the indicator is on and increment it by x
  get player coins from embed
  calculate new coin count and show on embed with new item count
  */
  static buySome(interaction: ButtonInteraction, buyQuantity: number) {
    const oldEmbed = interaction.message.embeds[0]!;
    const { fields } = oldEmbed;

    // get [ items ] from shop embed
    const shopItemsFieldIndex = this.getShopItemsFieldIndex(fields);
    const { name, value } = fields[shopItemsFieldIndex] ?? (() => {
      throw new Error(`field with index [ ${shopItemsFieldIndex} ] does not exist`);
    })();
    const shopItemsList = value.split('\n');

    // get [ selected shop item name ] and [ new item count ]
    const shopItemIndex = shopItemsList.findIndex((item) => item.includes('*'));
    if (shopItemIndex === -1) throw new Error("ADD EXCEPTION HANDLING TO THIS")
    const shopItemStr = shopItemsList[shopItemIndex] ?? (() => {
      throw new Error(`no shop item exists at index: [ ${shopItemIndex} ]`)
    })();

    const quantityRegex = /x\d+/g;
    const regexRes = quantityRegex.exec(shopItemStr);
    let itemCount = 0;
    let shopItemName = shopItemStr.slice(2, -2);
    if (regexRes != null) {
      if (regexRes.length > 1) {
        console.log(`regexRes found more than 1 quantity, result:\n${regexRes}`)
      }

      itemCount = parseInt(regexRes[0].substring(1))
      shopItemName = shopItemStr.substring(0, regexRes.index - 1);
    }
    itemCount += buyQuantity;

    // find shop [ item cost ]
    const selectedItem = shopItemsArray.find((item) => item!.name === shopItemName);
    const { price } = selectedItem ?? (() => {
      throw new Error(`could not find item with name [ ${shopItemName} ] in [ shopItemsArray ]`)
    })();

    // // bruh how do i efficiently find it in inventory
    // let { quantity: invQuantity } = this.items[shopFieldIndex - 1]!.find(
    //   (item) => item.name === shopEmbedItemName
    // ) ?? { quantity: -1 };

    // if (invQuantity === -1) {
    //   // maybe make it throw error
    //   console.log('item does not exist in inventory');
    //   invQuantity = 0;
    // }

    // get player [ coin count ] from embed
    const { value: coinStr } = fields[0] ?? (() => {
      throw new Error(`field with index [ 0 ] does not exist`);
    })();
    let coins = parseInt(coinStr);

    // change this so that it just disables confirm button when greater
    if (price > coins) {
      // figure something out the player can see
      console.log('item costs too much');
      return null;
    }

    // adjusted coin count to be displayed in embed
    const coinCount = coins - price * buyQuantity;

    shopItemsList[shopItemIndex] = `**${shopItemName} x${itemCount}**`;

    const nameList = shopItemsList.join('\n');

    const newEmbed = EmbedBuilder.from(oldEmbed)
      .spliceFields(shopItemsFieldIndex, 1, {
        name: `${name}`,
        value: `${nameList}`,
        inline: true,
      })
      .spliceFields(0, 1, {
        name: 'Coins',
        value: `${coinCount}`,
      });

    return newEmbed;
  }

  // this should be changed to be similar to buy some and sell confirm should become
  // similar to this function

  // MAKE SURE TO DISABLE SELLING MORE THEN ALL QUANTITIES (might be alr done)

  // THIS SHIT DOES NOT WORK PLS FIXXXX (only modified to be compilable)
  static async sellSome(interaction: ButtonInteraction, sellQuantity?: number) {
    // CODE DOES NOT WORK FOR LAST ITEM PLS FIX (i think its fixed)
    const { message } = interaction;

    const oldEmbed = message.embeds[0]!;
    const { fields } = oldEmbed;
    const invIndex = Inventory.getShopItemsFieldIndex(fields);

    const { value, name } = fields[invIndex]!;

    // why?????
    if (value.length <= 5) {
      return null;
    }

    // find selected item (this could be a function hmmmmm)
    const itemList = value.split('\n');
    let index = itemList.findIndex((item) => item.includes('*'))
    const selectedItemStr = itemList[index] ?? (() => {
      throw new Error(`no shop item exists at index: [ ${index} ]`)
    })()

    const quantityRegex = /x\d+/g;
    const regexRes = quantityRegex.exec(selectedItemStr);
    let itemCount = 0;
    let selectedItemName = selectedItemStr.slice(2, -2);
    if (regexRes != null) {
      if (regexRes.length > 1) {
        console.log(`regexRes found more than 1 quantity, result:\n${regexRes}`)
      }

      itemCount = parseInt(regexRes[0].substring(1))
      selectedItemName = selectedItemStr.substring(0, regexRes.index - 1);
    }
    const selectedItem = allItemsArray.find((item) => item!.name === selectedItemName);
    const { price } = selectedItem ?? (() => {
      throw new Error(`could not find item with name [ ${selectedItemName} ] in [ allItemsArray ]`)
    })();

    const { value: coinStr } = fields[0] ?? (() => {
      throw new Error(`field with index [ 0 ] does not exist`);
    })();
    let coinCount = parseInt(coinStr);

    // checks to see if your selling all of selected item
    if (!sellQuantity || (itemCount - sellQuantity) <= 0) {
      coinCount += selectedItem.price * itemCount;
      itemList.splice(index, 1);
      if (index === itemList.length - 1) {
        index = itemList.length - 2;
      }
    } else {
      coinCount += selectedItem.price * sellQuantity;
      selectedItem.quantity = itemCount - sellQuantity;
    }

    itemList[index] = `**${itemList[index]}**`;
    let newItems;
    let newEmbed;

    if (itemList.length > 0) {
      newItems = itemList.join('\n');

      newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(invIndex, 1, {
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
        .spliceFields(invIndex, 1, {
          name: `${name}`,
          value: `\u200B`,
          inline: true,
        })
        .spliceFields(0, 1, {
          name: 'Coins',
          value: `${coinCount}`,
        });
    }

    // save function used to be here

    return newEmbed;
  }

  static switchInvTab(interaction: ButtonInteraction, num: number) {
    const oldEmbed = interaction.message.embeds[0]!;
    const { fields } = oldEmbed;
    const { name, value: segItems } = fields[num]!;
    let otherItems;
    let otherIndex;

    // finds inventory section your in
    for (let i = 1; i < fields.length; i++) {
      const field = fields[i];
      if (!field) throw new Error(`field does not exist for index [ ${i} ]`);

      if (field.name.includes('__')) {
        otherIndex = i;
        fields[i]!.name = fields[i]!.name.replaceAll('_', '');

        const { value: items } = field;

        if (items.length <= 1) {
          oldEmbed.fields[i]!.value = '\u200B';
          break;
        }        
        
        const itemList = items.split('\n');
        const index = itemList.findIndex((item) => item.includes('*'));

        if (index === -1) {
          break;
        }

        itemList[index] = itemList[index]!.replace(/\*/g, '');

        otherItems = itemList.join('\n');
      }
    }

    fields[num]!.name = `__${name}__`;

    if (segItems.length > 1) {
      const segList = segItems.split('\n');
      segList[0] = `**${segList[0]}**`;
      const newItems = segList.join('\n');

      oldEmbed.fields[num]!.value = newItems;

      if (otherIndex && otherIndex !== num && otherItems) {
        oldEmbed.fields[otherIndex]!.value = otherItems;
      }
    }

    return oldEmbed;
  };
}