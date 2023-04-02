const { EmbedBuilder } = require('discord.js');
// const Profile = require('../../schemas/profile');

module.exports = {
  data: {
    name: 'nextItem',
  },

  async execute(interaction) {
    const oldEmbed = interaction.message.embeds[0];
    const items = oldEmbed.fields[0].value;
    const { name } = oldEmbed.fields[0];
    const itemList = items.split('\n');

    let index = itemList.findIndex((item) => item.includes('*'));

    itemList[index] = itemList[index].replaceAll('*', '');
    index += 1;

    if (!itemList[index]) index = 0;

    itemList[index] = `**${itemList[index]}**`;
    const newItems = itemList.join('\n');

    const newEmbed = EmbedBuilder.from(
      interaction.message.embeds[0]
    ).spliceFields(0, 1, {
      name: `${name}`,
      value: `${newItems}`,
      inline: true,
    });

    await interaction.update({
      embeds: [newEmbed],
    });
  },
};
