const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const Profile = require('../../schemas/profile');
const Monster = require('../../classes/monster');
const { itemArray } = require('../../items');

module.exports = {
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
          { name: 'dummy', value: 'dummy' },
          { name: 'Sunlit Meadows', value: 'Sunlit Meadows' },
          { name: 'Greenwood', value: 'Greenwood' },
        )
    ),
  // eslint-disable-next-line consistent-return
  async execute(interaction, client, title) {
    const { user, guild } = interaction;

    const storedProfile = await Profile.findOne({
      userId: user.id,
      guildId: guild.id,
    });

    if (!storedProfile)
      return interaction.reply({
        content: `${user.username}'s profile does not exist, can not fight`,
        ephemeral: true,
      });

    const attackButton = new ButtonBuilder()
      .setCustomId('attack')
      .setLabel('attack')
      .setStyle(ButtonStyle.Primary);

    const potionButton = new ButtonBuilder()
      .setCustomId('potions')
      .setLabel('potions')
      .setStyle(ButtonStyle.Secondary);

    const nextButton = new ButtonBuilder()
      .setCustomId('nextBattle')
      .setLabel('next')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(
      attackButton,
      potionButton,
      nextButton
    );

    if (storedProfile.isFighting) {
      const fightEmbed = await client.createFightEmbed(
        storedProfile.monster,
        user.username,
        storedProfile
      );

      return interaction.reply({
        embeds: [fightEmbed],
        components: [row],
      });
    }

    const selectedArea = title || await interaction.options.getString('area');
    console.log(title, selectedArea);

    switch (selectedArea) {
      case 'Dummy': {
        const drops = [itemArray[0]];
        const dummy = new Monster('Dummy', 30, 0, drops);

        await client.fightMonster(interaction, dummy, row);
        break;
      }

      case 'Sunlit Meadows': {
        await client.fromSLM(interaction, row, selectedArea);
        break;
      }

      case 'Greenwood': {
        await client.fromGNW(interaction, row, selectedArea);
        break;
      }

      default:
        break;
    }
  },
};
