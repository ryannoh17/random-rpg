import type { ButtonInteraction, Client } from "discord.js";

export default {
    data: {
      name: 'buyOne',
    },
  
    async execute(interaction: ButtonInteraction) {
      const embed = await client.buySome(interaction, 1);
  
      if (!embed) {
        await interaction.deferUpdate();
        return;
      }
  
      await interaction.update({
        embeds: [embed],
      });
    },
  };
  