const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');
const { shopList } = require('../../../commands/game/shop');

module.exports = {
  data: {
    name: 'buy',
  },

  async execute(interaction) {
    const list = [...shopList];
    list[0] = `**${list[0]}**`;
    const shopItems = list.join('\n');

    const embed = EmbedBuilder.from(interaction.message.embeds[0]).spliceFields(1, 1,
      {
        name: '__Items__',
        value: `${shopItems}`,
      }
    );

    const nextItem = new ButtonBuilder()
      .setCustomId('nextItem')
      .setLabel('➡')
      .setStyle(ButtonStyle.Primary);

    const lastItem = new ButtonBuilder()
      .setCustomId('lastItem')
      .setLabel('⬅')
      .setStyle(ButtonStyle.Primary);

    const buyOne = new ButtonBuilder()
      .setCustomId('buyOne')
      .setLabel('one')
      .setStyle(ButtonStyle.Primary);


    const row = new ActionRowBuilder().addComponents(lastItem, nextItem, buyOne);

    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  },
};
