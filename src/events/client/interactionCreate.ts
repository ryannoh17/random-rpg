import type { BaseInteraction, Client } from "discord.js";

export default {
  name: 'interactionCreate',
  async execute(interaction: BaseInteraction, client: Client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);

      if (!command) return;

      try {
        await command.default.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `Command Error`,
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);

      if (!button) return new Error('button does not exist');

      try {
        await button.default.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    }
  },
};
