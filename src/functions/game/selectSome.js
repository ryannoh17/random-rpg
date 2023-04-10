/* eslint-disable no-param-reassign */
const { EmbedBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = (client) => {
  client.selectSome = async (interaction, num) => {
    // CODE DOES NOT WORK FOR LAST ITEM PLS FIX

    const storedProfile = await Profile.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    const { inventory } = storedProfile;

    if (inventory.length < 1) {
      return false;
    }

    const oldEmbed = interaction.message.embeds[0];
    const { name } = oldEmbed.fields[0];

    const itemList = oldEmbed.fields[0].value.split('\n');
    const index = itemList.findIndex((item) => item.includes('*'));
    const selectedItem = inventory[index];
    const { quantity } = selectedItem;

    const newQuantity = quantity - num;
    const coinCount = storedProfile.coins + selectedItem.price * num;

    selectedItem.quantity = newQuantity;

    if (!num || newQuantity <= 0) {
      num = selectedItem.quantity;
      inventory.splice(index, 1);
    }

    const nameList = inventory.map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    nameList[index] = `**${nameList[index]}**`;
    let newItems;
    let newEmbed;

    if (inventory.length > 0) {
      newItems = nameList.join('\n');

      newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(0, 1, {
          name: `${name}`,
          value: `${newItems}`,
          inline: true,
        })
        .spliceFields(2, 1, {
          name: 'Coins',
          value: `${coinCount}`,
          inline: true,
        });
    } else {
      newEmbed = EmbedBuilder.from(oldEmbed)
        .spliceFields(0, 1, {
          name: `${name}`,
          value: `\u200B`,
          inline: true,
        })
        .spliceFields(2, 1, {
          name: 'Coins',
          value: `${coinCount}`,
          inline: true,
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
