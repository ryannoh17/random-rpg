import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('links')
    .setDescription('Sends links'),
  async execute(interaction: ChatInputCommandInteraction) {
    const message =
      'Invite Bot: https://discord.com/oauth2/authorize?client_id=1079791021560438854&scope=bot&permissions=8';
    await interaction.reply(message);
  },
};
