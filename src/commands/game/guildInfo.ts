import type { ChatInputCommandInteraction } from "discord.js";
import { GuildModel } from "../../schemas/guild.js";
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Returns server info'),

  async execute(interaction: ChatInputCommandInteraction) {
    const { guild }  = interaction;

    if (guild == null) 
      return interaction.reply('We are not in a server');
    

    let guildProfile = await GuildModel.findOne({ guildId: guild.id });

    if (!guildProfile) {
      // yeah i have no idea why I saved guild data keeping this ig

      guildProfile = new GuildModel({
        guildId: guild.id,
        guildName: guild.name,
        guildIcon: guild.iconURL() ? guild.iconURL() : 'none',
      });

      await guildProfile.save().catch(console.error);
      return interaction.reply({
        content: `New Server\nServer Name: ${guildProfile.guildName}\nServer ID: ${guildProfile.guildId}`,
      });
      
    } else {
      return interaction.reply({
        content: `Server Name: ${guild.name}\nServer ID: ${guild.id}`,
      });
    }
  },
};