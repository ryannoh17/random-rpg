const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('links')
    .setDescription('Sends links'),
  async execute(interaction) {
    const message =
      'Invite Bot: https://discord.com/oauth2/authorize?client_id=1079791021560438854&scope=bot&permissions=8';
    await interaction.reply(message);
  },
};
