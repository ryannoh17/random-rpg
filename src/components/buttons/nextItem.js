const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'nextItem',
  },

  async execute(interaction) {
    const oldEmbed = interaction.message.embeds[0];
    const { name, value: items } = oldEmbed.fields[0];
    const itemList = items.split('\n');

    let index = itemList.findIndex((item) => item.includes('*'));
    
    if (index === -1) return; 

    itemList[index] = itemList[index].replace(/\*/g, '');
    index += 1;

    if (!itemList[index]) index = 0;

    itemList[index] = `**${itemList[index]}**`;
    const newItems = itemList.join('\n');

    const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(0, 1, {
      name: `${name}`,
      value: `${newItems}`,
      inline: true,
    });

    await interaction.update({
      embeds: [newEmbed],
    });
  },
};
