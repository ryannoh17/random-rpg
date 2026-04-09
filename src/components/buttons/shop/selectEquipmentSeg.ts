import type { ButtonInteraction } from "discord.js";
import { Inventory } from "../../../classes/Inventory.js";

export default {
  data: {
    name: 'selectEquipmentSeg',
  },

  async execute(interaction: ButtonInteraction) {
    const embed = Inventory.switchInvTab(interaction, 3);

    await interaction.update({
      embeds: [embed],
    });  },
};
