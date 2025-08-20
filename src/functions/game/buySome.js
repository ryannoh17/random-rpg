/* eslint-disable no-param-reassign */
const { EmbedBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');
const { shopItemsArray } = require('../../commands/game/shop');

function getInvIndex(fields) {
  let invIndex = -1;
  for (let i = 1; i < fields.length; i++) {
    if (fields[i].name.includes('_')) {
      invIndex = i;
    }
  }

  if (invIndex === -1) throw new Error('No underlined field exists');
  
  return invIndex;
}

function getShopEmbedIndex(fieldValue, shopItemList) {
  if (!fieldValue) throw new Error('Field has no content');
  
  const shopIndex = shopItemList.findIndex((item) => item.includes('*'));

  return shopIndex;
}

// function getSelectedItem() {

// }

module.exports = (client) => {
  client.buySome = async (interaction, num) => {
    const { user, guild, message } = interaction;
    const oldEmbed = message.embeds[0];
    const { fields } = oldEmbed;

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });
    const { inventory, coins: playerCoins } = storedProfile;

    const invIndex = getInvIndex();
    const { value, name } = fields[invIndex];
    const shopItemList = value.split('\n');

    const shopIndex = getShopEmbedIndex(value, shopItemList);
    const shopEmbedItemName = shopItemList[shopIndex];

    const selectedItem = shopItemsArray.find((item) => item.name === shopEmbedItemName);
    const { price } = selectedItem;

    // bruh how do i efficiently find it in inventory
    let { quantity: invQuantity } = inventory[invIndex - 1].find(
      (item) => item.name === shopEmbedItemName
    );

    if (invQuantity === undefined) {
      console.log('item does not exist in inventory');
      invQuantity = 0;
    }

    if (price > playerCoins) {
      console.log('item costs too much');
      return null;
    }

    const newQuantity = invQuantity + num;

    const coinCount = playerCoins - price * num;
    selectedItem.quantity = newQuantity;

    // turns invetory into list for embed
    const nameList = inventory[invIndex - 1].map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });

    nameList[shopIndex] = `**${nameList[shopIndex]}**`;
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
