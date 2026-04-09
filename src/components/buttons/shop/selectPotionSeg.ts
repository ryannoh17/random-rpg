import type { ButtonInteraction } from "discord.js";
import { Inventory } from "../../../classes/Inventory.js";

export default {
  data: {
    name: 'selectPotionSeg',
  },

  async execute(interaction: ButtonInteraction) {
    const embed = Inventory.switchInvTab(interaction, 2);

    await interaction.update({
      embeds: [embed],
    });
  },
};
