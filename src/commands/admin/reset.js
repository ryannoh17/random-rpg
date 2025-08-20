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
    const { user, guild } = interaction;
    const selectedUser = interaction.options.getUser('target') || user;

    if (user.id !== '449357416287567873')
      return interaction.reply('not an admin can not use');

    const result = await Profile.updateOne(
      { userId: selectedUser.id, guildId: guild.id },
      {
        maxHealth: 100,
        health: 100,
        maxMana: 0,
        mana: 0,
        strength: 10,
        stamina: 5,
        defense: 0,
        wisdom: 0,
        intelligence: 0,
        agility: 0,
        statPoints: 0,
        level: 1,
        exp: 0,
        maxExp: 100,
        monster: null,
        isFighting: false,
        inventory: [[],[],[]],
        coins: 0,
      }
    );

    if (result.modifiedCount === 1) {
      return interaction.reply({
        content: `${selectedUser.username} has been reset`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `${selectedUser.username}'s profile does not exist, can not reset`,
      ephemeral: true,
    });
  },
};
