import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('send a dm to Ryan ever hour')
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message your sending')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, client: Client) {
    const { cooldowns } = client;
    const { user } = interaction;
    const { id: userID } = user;

    if (cooldowns.has(userID)) {
      await interaction.reply('wait grace');
    } else {
      const recipient = client.users.cache.get('449357416287567873'); // 449357416287567873
      if (recipient == undefined) 
        return interaction.reply("recipient does not exist");
      
      const message = interaction.options.getString('message', true);

      await recipient.send(message);
      await interaction.reply('message sent');

      client.cooldowns.set(userID, true);

      setTimeout(() => {
        client.cooldowns.delete(userID);
      }, 3600000);
    }
  },
};
