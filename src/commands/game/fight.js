const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const Profile = require('../../schemas/profile');
const Monster = require('../../classes/monster');
const Item = require('../../classes/item');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Fight!')
    .addStringOption((option) =>
      option
        .setName('monster')
        .setDescription('spawns selected monster')
        .setRequired(false)
        .addChoices(
          // sunlit meadows, greenwood, Phantom Caves
          { name: 'dummy', value: 'dummy' },
          { name: 'Sunlit Meadows', value: 'SLM' },
          { name: 'Greenwood', value: 'GNW' },
          { name: 'Ogre', value: 'Ogre' }
        )
    ),
  // eslint-disable-next-line consistent-return
  async execute(interaction, client) {
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

    const selectedMonster = await interaction.options.getString('monster');

    if (!selectedMonster) {
      await client.chooseMonster(interaction, row);
    }

    let drops = [];

    switch (selectedMonster) {
      case 'Dummy': {
        const stickDrop = new Item('stick', '001', 0, 2);
        drops = [stickDrop]
        const dummy = new Monster(selectedMonster, 3, 0, drops);

        client.fightMonster(interaction, dummy, row);
        break;
      }

      case 'Slime': {
        const slimeDrop = new Item('slime', '002', 1, 1);
        drops = [slimeDrop];
        const slime = new Monster(selectedMonster, 10, 1, drops);

        client.fightMonster(interaction, slime, row);
        break;
      }

      case 'Horned Rabbit': {
        const hornDrop = new Item('horn', '003', 4, 1);
        drops = [hornDrop];
        const hornedRabbit = new Monster(selectedMonster, 8, 2, drops);

        client.fightMonster(interaction, hornedRabbit, row);
        break;
      }

      case 'Ogre': {
        const meatDrop = new Item('meat', '010', 2, 3);
        drops = [meatDrop];
        const ogre = new Monster(selectedMonster, 20, 3, drops);

        client.fightMonster(interaction, ogre, row);
        break;
      }
      default:
        break;
    }
  },
};
