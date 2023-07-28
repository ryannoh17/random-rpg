module.exports = (client) => {
  // eslint-disable-next-line no-param-reassign
  client.switchInvTab = async (interaction, num) => {
    const oldEmbed = interaction.message.embeds[0];
    const { fields } = oldEmbed;
    const { name, value: segItems } = fields[num];
    let otherItems;
    let otherIndex;

    // finds inventory section your in
    for (let i = 1; i < fields.length; i++) {
      if (fields[i].name.includes('__')) {
        otherIndex = i;
        fields[i].name = fields[i].name.replaceAll('_', '');

        const { value: items } = fields[i];
        const itemList = items.split('\n');

        const index = itemList.findIndex((item) => item.includes('*'));

        if (index === -1) break;

        itemList[index] = itemList[index].replace(/\*/g, '');

        otherItems = itemList.join('\n');
      }
    }

    fields[num].name = `__${name}__`;

    if (segItems.length > 0) {
      const segList = segItems.split('\n');
      segList[0] = `**${segList[0]}**`;
      const newItems = segList.join('\n');

      fields[num].value = newItems;

      if (otherIndex && otherIndex !== num) {
        fields[otherIndex].value = otherItems;
      }
    }

    await interaction.update({
      embeds: [oldEmbed],
    });
  };
};
