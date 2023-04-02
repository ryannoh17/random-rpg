const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('power')
    .setDescription('gives power'),
  async execute(interaction) {
    if (interaction.user.id !== '449357416287567873')
      return interaction.reply('not an admin can not use');
    
    const selectedUser = interaction.user;

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
        attack: 999,
        health: 999,
      }
    );

    return interaction.reply({
        content: `${selectedUser.username} has been powered up`,
        ephemeral: true,
    });
  },
};
