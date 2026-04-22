import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Player } from "../../../classes/Player.js";

export default {
  data: {
    name: "sellConfirm"
  },

  async execute(interaction: ButtonInteraction) {
    const { user, guild, message } = interaction
    const num = 1; // FIX THIS PLSSSSSS

    let player = await Player.load(user.id, guild!.id);

    const { inventory } = player;
    const { coins } = inventory;

    const oldEmbed = message.embeds[0]!;
    const { fields } = oldEmbed;
    let invIndex = -1;

    // find inventory section (wait how is this working)
    for (let i = 0; i < inventory.items.length; i++) {
      if (fields[i]!.name.includes('_')) {
        invIndex = i;
      }
    }

    if (invIndex === -1) throw new Error("invIndex is undefined");

    const { value, name } = fields[invIndex]!;

    if(value.length <= 5) {
      return null;
    }

    // find selected item
    const itemList = value.split('\n');
    let index = itemList.findIndex((item) => item.includes('*'));
        
    const selectedItem = inventory.items[invIndex - 1]![index]!;
    const { quantity: itemQuantity } = selectedItem;

    const newQuantity = itemQuantity - num;

    let coinCount;

    // checks to see if your selling all of selected item
    if (!num || newQuantity <= 0) {
      selectedItem.quantity = 0;
      coinCount = coins + selectedItem.price * itemQuantity;
      inventory.items[invIndex - 1]!.splice(index, 1);
        if(index === itemList.length - 1){
          index = itemList.length - 2;
        }
    } else {
      coinCount = coins + selectedItem.price * num;
      selectedItem.quantity = newQuantity;
    }

    player.inventory.coins = coinCount;
    await player.save()

    // turns invetory into list for embed
    const nameList = inventory.items[invIndex - 1]!.map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    nameList[index] = `**${nameList[index]}**`;
    let newItems;
    let newEmbed;

    if (nameList.length > 0) {
      newItems = nameList.join('\n');

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

    return newEmbed;
  },
};
