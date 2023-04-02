/* eslint-disable no-param-reassign */
const { EmbedBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = (client) => {
  client.selectSome = async (interaction, num) => {
    const storedProfile = await Profile.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    const oldEmbed = interaction.message.embeds[0];
    const { name } = oldEmbed.fields[0];

    const oldItems = oldEmbed.fields[0].value;
    const itemList = oldItems.split('\n');
    const index = itemList.findIndex((item) => item.includes('*'));
    const selectedItem = storedProfile.inventory[index];
    const newQuantity = selectedItem.quantity - num;
    const coinCount = storedProfile.coins + (selectedItem.price * num);

    selectedItem.quantity = newQuantity;

    if (!num && newQuantity <= 0) {
      num = selectedItem.quantity;
      storedProfile.inventory.splice(index, 1);
    }


    // if (selectedItem.quantity < 0) {
    //   selectedItem.quantity = 0;
    // }

    // storedProfile = await Profile.findOne({
    //   userId: interaction.user.id,
    //   guildId: interaction.guild.id,
    // });

    const nameList = storedProfile.inventory.map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    nameList[index] = `**${nameList[index]}**`; 
    let newItems;
    
    if (nameList.length === 1) {
        newItems = `**${nameList[0]}**`
    } else {
        newItems = nameList.join('\n');
    }


    const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(0, 1, {
      name: `${name}`,
      value: `${newItems}`,
      inline: true,
    }).spliceFields(2, 1, {
      name: 'Coins',
      value: `${coinCount}`,
      inline: true
    });

    await Profile.findOneAndUpdate(
      { _id: storedProfile._id },
      {
        inventory: storedProfile.inventory,
        coins: coinCount
      }
    );

    return newEmbed;
  };
};
