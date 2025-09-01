import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('rand')
    .setDescription('rand'),

  async execute(interaction) {
    const randNum = Math.floor(Math.random() * 11); 

    await interaction.reply({
      content: `${randNum}`,
      ephemeral: true,
    });
  },
};
