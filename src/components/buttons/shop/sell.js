const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Profile = require('../../../schemas/profile');

module.exports = {
  data: {
    name: 'sell',
  },

  async execute(interaction, client) {
    const { user, guild } = interaction;

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    const { inventory, coins } = storedProfile;

    const invSections = await client.giveInvSections(inventory, 0);
    const embed = await client.createInvEmbed(inventory, invSections, coins);

    embed.data.fields[1].name = `__${embed.data.fields[1].name}__`;

    const nextItem = new ButtonBuilder()
      .setCustomId('nextItem')
      .setLabel('➡')
      .setStyle(ButtonStyle.Primary);
    const lastItem = new ButtonBuilder()
      .setCustomId('lastItem')
      .setLabel('⬅')
      .setStyle(ButtonStyle.Primary);
    const sellOne = new ButtonBuilder()
      .setCustomId('sellOne')
      .setLabel('x1')
      .setStyle(ButtonStyle.Primary);
    const sellTen = new ButtonBuilder()
      .setCustomId('sellTen')
      .setLabel('x10')
      .setStyle(ButtonStyle.Primary);
    const sellAll = new ButtonBuilder()
      .setCustomId('sellAll')
      .setLabel('xAll')
      .setStyle(ButtonStyle.Primary);
    const materials = new ButtonBuilder()
      .setCustomId('selectMaterialSeg')
      .setLabel('Materials')
      .setStyle(ButtonStyle.Primary);
    const potions = new ButtonBuilder()
      .setCustomId('selectPotionSeg')
      .setLabel('Potions')
      .setStyle(ButtonStyle.Primary);
    const equipment = new ButtonBuilder()
      .setCustomId('selectEquipmentSeg')
      .setLabel('Equipment')
      .setStyle(ButtonStyle.Primary);
    const rowOne = new ActionRowBuilder().addComponents(materials, potions, equipment);
    const rowTwo = new ActionRowBuilder().addComponents(
      lastItem,
      nextItem,
      sellOne,
      sellTen,
      sellAll
    );

    await interaction.update({
      embeds: [embed],
      components: [rowOne, rowTwo],
    });
  },
};
