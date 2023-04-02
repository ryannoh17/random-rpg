const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../schemas/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Returns server info'),

    async execute(interaction) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildProfile) {
            guildProfile = await new Guild({
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL() ? interaction.guild.iconURL() : 'none'
            });

            await guildProfile.save().catch(console.error);
            await interaction.reply({
                content: `New Server\nServer Name: ${guildProfile.guildName}\nServer ID: ${guildProfile.guildId}`
            });

            console.log(guildProfile);
        } else {
            await interaction.reply({
                content: `Server Name: ${guildProfile.guildName}\nServer ID: ${guildProfile.guildId}`
            });

            console.log(guildProfile);
        }
    }
}