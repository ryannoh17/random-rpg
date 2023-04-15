const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.createInvEmbed = async (
    inventory,
    matList,
    potionList,
    equipList,
    coins
  ) => {
    const coinAmt = coins || '0';

    const embed = new EmbedBuilder()
      .setTitle(`Inventory`)
      .setThumbnail('https://i.stack.imgur.com/Fzh0w.png')
      .addFields([
        {
          name: 'Coins',
          value: `${coinAmt}`,
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

    if (inventory[0].length > 0) {
      embed.spliceFields(1, 1, {
        name: 'Materials',
        value: `${matList}`,
        inline: true,
      });
    }
    if (inventory[1].length > 0) {
      embed.spliceFields(2, 1, {
        name: 'Materials',
        value: `${potionList}`,
        inline: true,
      });
    }
    if (inventory[2].length > 0) {
      embed.spliceFields(3, 1, {
        name: 'Equipment',
        value: `${equipList}`,
        inline: true,
      });
    }

    return embed;
  };
};
