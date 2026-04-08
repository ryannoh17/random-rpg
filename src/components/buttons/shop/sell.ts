import { ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction } from "discord.js";
import { Profile } from "../../../schemas/profile.js";
import { Player } from "../../../classes/Player.js";

export default {
  data: {
    name: 'sell',
  },

  async execute(interaction: ButtonInteraction) {
    const { user, guild } = interaction;

    if (!guild) return interaction.reply('user not in server');

    let player = await Player.load(user.id, guild.id);

    const embed = player.inventory.createInvEmbed();

    // uh maybe change this
    embed.data.fields![1]!.name = `__${embed.data.fields![1]!.name}__`;

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
    const rowOne = new ActionRowBuilder<ButtonBuilder>().addComponents(
      materials, 
      potions, 
      equipment
    );
    const rowTwo = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
