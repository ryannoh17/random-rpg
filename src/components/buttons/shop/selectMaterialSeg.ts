import type { ButtonInteraction } from "discord.js";
import { Inventory } from "../../../classes/Inventory.js";

export default {
  data: {
    name: 'selectMaterialSeg',
  },

  async execute(interaction: ButtonInteraction) {
        const embed = Inventory.switchInvTab(interaction, 1);
    
        await interaction.update({
          embeds: [embed],
        });
  },
};
