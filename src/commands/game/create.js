const { SlashCommandBuilder } = require('discord.js');
const Profile = require('../../schemas/profile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Creates player profile'),

  async execute(interaction) {
    const { user, guild } = interaction;

    const result = await Profile.updateOne(
      { userId: user.id, guildId: guild.id },
      { userId: user.id, tag: user.tag, guildId: guild.id },
      { upsert: true }
    );

    if (result.upsertedId) {
      console.log(`New Profile: ${result.tag}`);
      return interaction.reply({
        content: `${user.username}'s profile has been created`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: 'Player profile already exists',
      ephemeral: true,
    });
  },
};
