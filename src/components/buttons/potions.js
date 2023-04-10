const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: {
    name: 'potions',
  },

  async execute(interaction) {
    const { components } = interaction.message;

    const healButton = new ButtonBuilder()
      .setCustomId('healPotion')
      .setLabel('heal')
      .setStyle(ButtonStyle.Primary);

    const greaterHealButton = new ButtonBuilder()
      .setCustomId('greaterHealPotion')
      .setLabel('greater heal')
      .setStyle(ButtonStyle.Primary);

    const damageButton = new ButtonBuilder()
      .setCustomId('damagePotion')
      .setLabel('damage')
      .setStyle(ButtonStyle.Primary);

    const row = components[0];
    const newRow = new ActionRowBuilder().addComponents(
      healButton,
      greaterHealButton,
      damageButton
    );

    if (!components[1]) {
      await interaction.update({
        components: [row, newRow],
      });
    } else {
      await interaction.update({
        components: [row],
      });
    }
  },
};
