const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('power')
    .setDescription('gives power'),
  async execute(interaction) {
    const { user, guild } = interaction;

    if (user.id !== '449357416287567873')
      return interaction.reply('not an admin can not use');

    const result = await Profile.updateOne(
      { userId: user.id, guildId: guild.id },
      {
        health: 999,
        strength: 999,
      }
    );

    if (result.modifiedCount === 1) {
      return interaction.reply({
        content: `${user.username} has been powered up`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `${user.username}'s profile does not exist`,
      ephemeral: true,
    });
  },
};
