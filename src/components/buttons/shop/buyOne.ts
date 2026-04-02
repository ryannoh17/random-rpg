import type { ButtonInteraction } from "discord.js";
import { Inventory } from "../../../classes/Inventory.js";

export default {
    data: {
      name: 'buyOne',
    },
  
    async execute(interaction: ButtonInteraction) {
      const embed = await Inventory.buySome(interaction, 1, 3);
  
      if (!embed) {
        await interaction.deferUpdate();
        return;
      }
  
      await interaction.update({
        embeds: [embed],
      });
    },
  };
  