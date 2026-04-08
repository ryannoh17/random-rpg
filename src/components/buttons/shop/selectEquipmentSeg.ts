import type { ButtonInteraction } from "discord.js";

export default {
  data: {
    name: 'selectEquipmentSeg',
  },

  async execute(interaction: ButtonInteraction, client) {
    client.switchInvTab(interaction, 3);
  },
};
