const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'lastItem',
  },

  async execute(interaction) {
    const oldEmbed = interaction.message.embeds[0];
    const { fields } = oldEmbed
    let fieldIndex;

    // finds inventory section your in
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name.includes('__')) {
        fieldIndex = i;
      }
    }

    // turns field value into array to increment * item by 1
    const { name, value: items } = fields[fieldIndex];
    const itemList = items.split('\n');

    let index = itemList.findIndex((item) => item.includes('*'));
    
    if (index === -1) return; 

    itemList[index] = itemList[index].replace(/\*/g, '');
    index -= 1;

    if (!itemList[index]) index = 0;

    itemList[index] = `**${itemList[index]}**`;
    const newItems = itemList.join('\n');

    const newEmbed = EmbedBuilder.from(oldEmbed).spliceFields(fieldIndex, 1, {
      name: `${name}`,
      value: `${newItems}`,
      inline: true,
    });

    await interaction.update({
      embeds: [newEmbed],
    });
  },
};
