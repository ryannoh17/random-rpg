const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('resets player')
    .addUserOption((option) =>
      option.setName('target').setDescription('resets selected player')
    ),
  async execute(interaction) {
    if (interaction.user.id !== '449357416287567873')
      return interaction.reply('not an admin can not use');

    const selectedUser =
      interaction.options.getUser('target') || interaction.user;

    const storedProfile = await Profile.findOne({
      userId: selectedUser.id,
      guildId: interaction.guild.id,
    });

    if (!storedProfile)
      return interaction.reply({
        content: `${selectedUser.username}'s profile does not exist, can not reset`,
      });

    await Profile.findOneAndUpdate(
      { _id: storedProfile._id },
      {
        maxHealth: 10,
        health: 10,
        attack: 2,
        level: 1,
        exp: 0,
        maxExp: 100,
        monster: null,
        isFighting: false,
        inventory: [],
        coins: 0,
      }
    );

    return interaction.reply(`${selectedUser.username} has been reset`);
  },
};
