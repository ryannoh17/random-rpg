const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('send a dm to Ryan ever hour')
    .addStringOption((option) =>
      option
        .setName('message')
        .setDescription('The message your sending')
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { cooldowns } = client;

    if (cooldowns.has(interaction.user.id)) {
      await interaction.reply('wait grace');
    } else {
      const user = client.users.cache.get('449357416287567873'); // 449357416287567873
      const message = interaction.options.getString('message');

      user.send(message);
      interaction.reply('message sent');

      client.cooldowns.set(interaction.user.id, true);

      setTimeout(() => {
        client.cooldowns.delete(interaction.user.id);
      }, 3600000);
    }
  },
};
