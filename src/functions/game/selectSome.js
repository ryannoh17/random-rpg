/* eslint-disable no-param-reassign */
const { EmbedBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = (client) => {
  client.selectSome = async (interaction, num) => {
    // CODE DOES NOT WORK FOR LAST ITEM PLS FIX
    const { user, guild, message } = interaction

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    const { inventory, coins } = storedProfile;

    const oldEmbed = message.embeds[0];
    const { fields } = oldEmbed;
    let invIndex;

    for (let i = 0; i < inventory.length; i++) {
      if (fields[i].name.includes('_')) {
        invIndex = i;
      }
    }

    const { value, name } = fields[invIndex];

    if(value.length === 1) {
      return null;
    }

    const itemList = value.split('\n');
    let index = itemList.findIndex((item) => item.includes('*'));
        
    const selectedItem = inventory[invIndex - 1][index];
    const { quantity: itemQuantity } = selectedItem;

    const newQuantity = itemQuantity - num;

    let coinCount;

    if (!num || newQuantity <= 0) {
      selectedItem.quantity = 0;
      coinCount = coins + selectedItem.price * itemQuantity;
      inventory[invIndex - 1].splice(index, 1);
        if(index === itemList.length - 1){
          index = itemList.length - 2;
        }
    } else {
      coinCount = coins + selectedItem.price * num;
      selectedItem.quantity = newQuantity;
    }

    // turns invetory into list for embed
    const nameList = inventory[invIndex - 1].map((items) => {
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

    await Profile.findOneAndUpdate(
      { _id: storedProfile._id },
      {
        inventory,
        coins: coinCount,
      }
    );

    return newEmbed;
  };
};
