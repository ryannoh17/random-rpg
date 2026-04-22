import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
} from "discord.js";
import { Monster } from "../../classes/Monster.js";
import { Player } from "../../classes/Player.js";

export default {
  data: new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Fight!')
    .addStringOption((option) =>
      option
        .setName('area')
        .setDescription('enter selected area')
        .setRequired(true)
        .addChoices(
          // sunlit meadows, greenwood, Phantom Caves
          { name: 'Dummy', value: 'Dummy' },
          { name: 'Sunlit Meadow', value: 'Sunlit Meadow' },
          { name: 'Greenwood', value: 'Greenwood' }
        )
    ),
  // eslint-disable-next-line consistent-return
  async execute(interaction: ChatInputCommandInteraction) {
    const { user, guild } = interaction;

    if (guild == null)
      return interaction.reply("user not in a server");

    let player = await Player.load(user.id, guild.id);
    if (!player) {
      return interaction.reply("create a player first with /create");
    }

    const selectedArea = interaction.options.getString('area')!;

    if (!player.isFighting) {
      const spawnedMonster = Monster.spawn(selectedArea!);
      player.monster = spawnedMonster;
      
      await player.save();
    }

    const fightEmbed = player.createFightEmbed();

    const swordButton = new ButtonBuilder()
      .setCustomId('sword')
      .setLabel('sword')
      .setStyle(ButtonStyle.Primary);

    const potionButton = new ButtonBuilder()
      .setCustomId('potions')
      .setLabel('potions')
      .setStyle(ButtonStyle.Secondary);

    const nextButton = new ButtonBuilder()
      .setCustomId('nextBattle')
      .setLabel('next')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      swordButton,
      potionButton,
      nextButton
    );

    return interaction.reply({
      embeds: [fightEmbed],
      components: [row],
    });
  },
};
