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
        .setRequired(true)
        .addChoices(
          { name: 'Dummy', value: 'Dummy' },
          { name: 'Slime', value: 'Slime' },
          { name: 'Horned Rabbit', value: 'Horned Rabbit' },
          { name: 'Ogre', value: 'Ogre' }
        )
    ),
  async execute(interaction, client) {
    let storedProfile = await Profile.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    if (!storedProfile)
      return interaction.reply({
        content: `${interaction.user.username}'s profile does not exist, can not fight`,
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
        interaction.user.username,
        storedProfile
      );

      return interaction.reply({
        embeds: [fightEmbed],
        components: [row],
      });
    }

    const selectedMonster = interaction.options.getString('monster');
    const coin = new Item('coin', '005', 1, 1);
    let drops = [];

    switch (selectedMonster) {
      case 'Dummy': {
        const stickDrop = new Item('stick', '001', 0, 2);
        drops = [stickDrop, coin]
        const dummy = new Monster(selectedMonster, 3, 0, drops);

        await Profile.findOneAndUpdate(
          { _id: storedProfile._id },
          { monster: dummy }
        );

        storedProfile = await Profile.findOne({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });

        const dummyEmbed = await client.createFightEmbed(
          storedProfile.monster,
          interaction.user.username,
          storedProfile
        );

        return interaction.reply({
          embeds: [dummyEmbed],
          components: [row],
        });
      }

      case 'Slime': {
        const slimeDrop = new Item('slime', '002', 1, 1);
        drops = [slimeDrop];
        const slime = new Monster(selectedMonster, 10, 1, drops);

        await Profile.findOneAndUpdate(
          { _id: storedProfile._id },
          { monster: slime }
        );

        storedProfile = await Profile.findOne({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });

        const slimeEmbed = await client.createFightEmbed(
          storedProfile.monster,
          interaction.user.username,
          storedProfile
        );

        return interaction.reply({
          embeds: [slimeEmbed],
          components: [row],
        });
      }

      case 'Horned Rabbit': {
        const hornDrop = new Item('horn', '003', 4, 1);
        drops = [hornDrop];
        const hornedRabbit = new Monster(selectedMonster, 8, 2, drops);

        await Profile.findOneAndUpdate(
          { _id: storedProfile._id },
          { monster: hornedRabbit }
        );

        storedProfile = await Profile.findOne({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });

        const hornedRabbitEmbed = await client.createFightEmbed(
          storedProfile.monster,
          interaction.user.username,
          storedProfile
        );

        return interaction.reply({
          embeds: [hornedRabbitEmbed],
          components: [row],
        });
      }

      case 'Ogre': {
        const meatDrop = new Item('meat', '004', 2, 3);
        drops = [meatDrop];
        const ogre = new Monster(selectedMonster, 20, 3, drops);

        await Profile.findOneAndUpdate(
          { _id: storedProfile._id },
          { monster: ogre }
        );

        storedProfile = await Profile.findOne({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
        });

        const orgeEmbed = await client.createFightEmbed(
          storedProfile.monster,
          interaction.user.username,
          storedProfile
        );

        return interaction.reply({
          embeds: [orgeEmbed],
          components: [row],
        });
      }
      default:
    }

    return null;
  },
};
