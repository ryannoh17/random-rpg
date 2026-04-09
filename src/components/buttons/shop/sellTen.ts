import type { ButtonInteraction } from "discord.js";
import { Inventory } from "../../../classes/Inventory.js";

export default {
  data: {
    name: 'sellTen',
  },

  async execute(interaction: ButtonInteraction) {
    const embed = await Inventory.sellSome(interaction, 10);

    if (!embed) {
      await interaction.deferUpdate();
      return;
    }

    await interaction.update({
      embeds: [embed],
    });
  },
};
