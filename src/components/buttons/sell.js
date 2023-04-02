const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: {
    name: 'sell',
  },

  async execute(interaction, client) {
    const storedProfile = await Profile.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    const nameList = storedProfile.inventory.map((items) => {
      if (items.quantity > 1) {
        return `${items.name} x${items.quantity}`;
      }
      return items.name;
    });
    
    nameList[0] = `**${nameList[0]}**`;
    const items = nameList.join('\n');

    const embed = await client.createInvEmbed(
      storedProfile.inventory,
      items,
      storedProfile.coins
    );

    const nextItem = new ButtonBuilder()
      .setCustomId('nextItem')
      .setLabel('➡')
      .setStyle(ButtonStyle.Primary);

    const lastItem = new ButtonBuilder()
      .setCustomId('lastItem')
      .setLabel('⬅')
      .setStyle(ButtonStyle.Primary);

    const sellOne = new ButtonBuilder()
      .setCustomId('selectOne')
      .setLabel('x1')
      .setStyle(ButtonStyle.Primary);
    const sellTen = new ButtonBuilder()
      .setCustomId('selectTen')
      .setLabel('x10')
      .setStyle(ButtonStyle.Primary);
    const sellAll = new ButtonBuilder()
      .setCustomId('selectAll')
      .setLabel('xAll')
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(
      lastItem,
      nextItem,
      sellOne,
      sellTen,
      sellAll
    );

    await interaction.update({
      embeds: [embed],
      components: [row],
    });
  },
};
