import { type ButtonInteraction } from "discord.js";
import { Inventory } from "../../../classes/Inventory.js";
import { shopItemsArray } from "../../../commands/game/shop.js";
import { Player } from "../../../classes/Player.js";
import type { ItemType } from "../../../schemas/item.js";

export default {
  data: {
    name: 'buyConfirm',
  },

  // add all items with quantities to array and tally up cost
  // add array to inv, subtract cost from coins
  // save player
  // update embed
  async execute(interaction: ButtonInteraction) {
    const { user, guild } = interaction;

    if (!guild) throw new Error("user not in server");

    let player = await Player.load(user.id, guild.id)
    let { coins } = player.inventory;

    const oldEmbed = interaction.message.embeds[0]!;
    const { fields } = oldEmbed;

    // get [ items ] from shop embed
    const shopItemsFieldIndex = Inventory.getShopItemsFieldIndex(fields);
    const { name, value } = fields[shopItemsFieldIndex] ?? (() => {
      throw new Error(`field with index [ ${shopItemsFieldIndex} ] does not exist`);
    })();
    const shopItemsList = value.split('\n');

    // get [ selected shop item name ] and [ new item count ]
    const shopItemIndex = shopItemsList.findIndex((item) => item.includes('*'));
    if (shopItemIndex === -1) throw new Error("ADD EXCEPTION HANDLING TO THIS")
    const shopItemStr = shopItemsList[shopItemIndex] ?? (() => {
      throw new Error(`no shop item exists at index: [ ${shopItemIndex} ]`);
    })();

    const quantityRegex = /x\d+/g;
    let shopItemsToAdd: ItemType[] = [];
    let totalCost = 0;

    // loop through items in embed and find ones with quantities
    for (let shopItem of shopItemsList) {
      // PLEASEEEEE MAKE SURE TO DISABLE THIS BUTTON AND ENABLE IN BUY BUTTONS
      if (shopItem.includes("*")) {
        shopItem = shopItem.slice(2, -2);
      }

      const regexRes = quantityRegex.exec(shopItem) ?? (() => {
        throw new Error("The result of [ quantity regex ] is null when it shouldn't be");
      })();

      if (regexRes.length > 1) {
        console.log(`regexRes found more than 1 quantity, result:\n${regexRes}`);
      }

      // get the item from all items array and adjust quantity
      // add the item with quantity to [ shopItemsToAdd ] to add to inv
      let shopItemName = shopItem.substring(0, regexRes.index - 1);
      const itemCount = parseInt(regexRes[0].substring(1))

      const currItem = shopItemsArray.find((item) => item!.name === shopItemName);
      const { price } = currItem ?? (() => {
        throw new Error(`could not find item with name [ ${shopItemName} ] in [ shopItemsArray ]`)
      })();

      currItem.quantity = itemCount;
      shopItemsToAdd.push(currItem);

      totalCost += itemCount * price;
    }

    // IMPLEMENT QUANTITY INCREASE BUTTONS TO DISABLE CONFIRM BUTTON
    // nvm im the goat i alr commented this
    if (totalCost > coins) 
      throw new Error(`Player has ${coins} coins but items cost ${totalCost} coins`)

    player.inventory.coins -= totalCost;
    player.inventory.addToInventory(shopItemsToAdd);
    player.save();
    
    const newEmbed = player.inventory.createInvEmbed();

    await interaction.update({
      embeds: [newEmbed],
    });
  },
};


// make it so that you can add multiple items to buy and buy them all at once
