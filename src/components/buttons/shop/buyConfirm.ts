import { EmbedBuilder, type ButtonInteraction } from "discord.js";
import { Inventory } from "../../../classes/Inventory.js";
import { shopItemsArray } from "../../../commands/game/shop.js";
import { Player } from "../../../classes/Player.js";

export default {
  data: {
    name: 'buyConfirm',
  },

  async execute(interaction: ButtonInteraction) {
    const { message, user, guild } = interaction
    const oldEmbed = message.embeds[0]!;
    const { fields } = oldEmbed;

    let player = await Player.load(user.id, guild!.id)
    let { coins } = player.inventory;

    const shopFieldIndex = Inventory.getShopItemsFieldIndex(fields);
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

    // // bruh how do i efficiently find it in inventory
    // let { quantity: invQuantity } = this.items[shopFieldIndex - 1]!.find(
    //   (item) => item.name === shopEmbedItemName
    // ) ?? { quantity: -1 };

    // if (invQuantity === -1) {
    //   // maybe make it throw error
    //   console.log('item does not exist in inventory');
    //   invQuantity = 0;
    // }

    if (price > coins) {
      // figure something out the player can see
      console.log('item costs too much');
      return null;
    }

    // const newQuantity = invQuantity + buyQuantity;

    const adjustedCoinCount = coins - price * buyQuantity;
    // selectedItem.quantity = newQuantity;

    // turns invetory into list for embed
    const nameList = shopItemsArray[shopFieldIndex - 1]!.map((item) => {
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
          value: `${adjustedCoinCount}`,
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
          value: `${adjustedCoinCount}`,
        });
    }

    // await Profile.findOneAndUpdate(
    //   { _id: storedProfile._id },
    //   {
    //     inventory,
    //     coins: coinCount,
    //   }
    // );

    coins = adjustedCoinCount;

    await interaction.update({
      embeds: [newEmbed],
    });
  },
};


// make it so that you can add multiple items to buy and buy them all at once
// iterate through the shop items blehhhhhh O(n) WOWOWOW