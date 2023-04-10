const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../schemas/guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Returns server info'),

  async execute(interaction) {
    const { guild } = interaction;

    let guildProfile = await Guild.findOne({ guildId: guild.id });

    if (!guildProfile) {
      guildProfile = await new Guild({
        guildId: guild.id,
        guildName: guild.name,
        guildIcon: guild.iconURL() ? guild.iconURL() : 'none',
      });

      await guildProfile.save().catch(console.error);
      await interaction.reply({
        content: `New Server\nServer Name: ${guildProfile.guildName}\nServer ID: ${guildProfile.guildId}`,
      });
      
    } else {
      await interaction.reply({
        content: `Server Name: ${guildProfile.guildName}\nServer ID: ${guildProfile.guildId}`,
      });
    }
  },
};
