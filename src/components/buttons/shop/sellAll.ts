import type { ButtonInteraction } from "discord.js";
import { Inventory } from "../../../classes/Inventory.js";

export default {
  data: {
    name: 'sellAll',
  },

  async execute(interaction: ButtonInteraction) {
    const embed = await Inventory.sellSome(interaction);

    if (!embed) {
      await interaction.deferUpdate();
      return;
    }

    await interaction.update({
      embeds: [embed],
    });
  },
};
