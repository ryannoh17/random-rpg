import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns ping'),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const newMessage = `API Latency: ${client.ws.ping} ms\nClient Ping: ${
      message.createdTimestamp - interaction.createdTimestamp
    } ms`;

    await interaction.editReply({
      content: newMessage,
    });
  },
};
