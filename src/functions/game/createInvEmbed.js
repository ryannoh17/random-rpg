const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.createInvEmbed = async (inventory, items, coins) => {
    const embed = new EmbedBuilder()
      .setTitle(`Inventory`)
      .setThumbnail('https://i.stack.imgur.com/Fzh0w.png')
      .addFields([
        {
          name: 'Items',
          value: `\u200B`,
          inline: true,
        },
        {
          name: '\u200B',
          value: `\u200B`,
          inline: true,
        },
        {
          name: 'Coins',
          value: '0',
          inline: true,
        },
      ]);

    if (inventory.length > 0) {
      embed.spliceFields(0, 1, {
        name: 'Items',
        value: `${items}`,
        inline: true,
      });
    }

    if (coins) {
      embed.spliceFields(2, 1, {
        name: 'Coins',
        value: `${coins}`,
        inline: true,
      });
    }

    return embed;
  };
};
